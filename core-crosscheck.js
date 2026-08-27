#!/usr/bin/env node
/* ============================================================
   core-crosscheck.js — node から呼んだ中核の値と、本体の画面に出る値を突き合わせる
   ============================================================
   ＊作法14「写しに probe」方式。本体には仕掛けを入れない。
     本体の写しを一時ディレクトリに作り、そこへ探索用の一片を差し込んで headless で駆動し、
     終わったら写しごと消す。
   ＊作法15「window に診断口を残さない」。analyze() は公開しない。
     画面の釦（判定）を押し、本体が自分で書く記録（localStorage の haipaiLog）と
     判定カードの字だけを読む。

   使い方
     node core-crosscheck.js          … 10通りを突き合わせて表で出す
     node core-crosscheck.js --json   … 生の値も出す
   ============================================================ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { makeAnalyze, parseHand, TEN } = require('./core-probe.js');

const BODY = path.join(__dirname, 'koushu-handan.html');

/* 画面の側（本体が自分で書く記録）と、node の側（analyze() の返し）の対応表。
   左＝記録の名、右＝analyze() の返しの名。 */
const PAIRS = [
  ['verdict', 'verdict'],
  ['sh', 'baseShanten'],
  ['acceptTiles', 'acceptTiles'],
  ['widthLabel', 'widthLabel'],
  ['goodShapes', 'goodShapes'],
  ['shapeNeeded', 'shapeNeeded'],
  ['shapeOK', 'shapeOK'],
  ['yakuhaiPair', 'yakuhaiPair'],
  ['doraValue', 'doraValue'],
  ['doraPlain', 'doraCount'],
  ['red', 'redCount'],
  ['defHonors', 'defHonors'],
  ['defTerminals', 'defTerminals'],
  ['kokushiSeen', 'kokushiSeen'],
  ['kokushiKinds', 'kokushiKinds'],
  ['yakumanReach', 'yakumanReach'],
  ['yakumanName', 'yakumanName']
];

function findBrowser() {
  const cands = [
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe'
  ].filter(Boolean);
  for (const c of cands) { if (fs.existsSync(c)) { return c; } }
  return null;
}

/* 写しへ差し込む一片。判定を10回押して、本体が書いた記録と判定カードの字を拾う。 */
function probeSource(cases) {
  return '<script>\n'
    + 'document.addEventListener("DOMContentLoaded", function () {\n'
    + '  setTimeout(function () {\n'
    + '    var CASES = ' + JSON.stringify(cases) + ';\n'
    + '    var out = [];\n'
    + '    CASES.forEach(function (c) {\n'
    + '      try { localStorage.removeItem("haipaiLog"); } catch (e) {}\n'
    + '      var chip = document.querySelector(\'[data-round="\' + c.round + \'"][data-seat="\' + c.seat + \'"]\');\n'
    + '      if (chip) { chip.click(); }\n'
    + '      var ta = document.getElementById("qiText");\n'
    + '      ta.value = c.hand;\n'
    + '      window.ssRebuildHand();\n'
    + '      document.getElementById("judgeBtn").click();\n'
    + '      var log = [];\n'
    + '      try { log = JSON.parse(localStorage.getItem("haipaiLog") || "[]"); } catch (e) {}\n'
    + '      var v = document.getElementById("verdict");\n'
    + '      out.push({ name: c.name, hand: c.hand, seat: c.seat, round: c.round,\n'
    + '                 rec: log.length ? log[log.length - 1] : null,\n'
    + '                 cls: v ? v.className : "",\n'
    + '                 text: v ? String(v.textContent).replace(/\\s+/g, " ").trim().slice(0, 400) : "" });\n'
    + '      if (chip) { chip.click(); }\n'
    + '    });\n'
    + '    var d = document.createElement("div");\n'
    + '    d.id = "CROSSCHECK";\n'
    + '    d.textContent = btoa(unescape(encodeURIComponent(JSON.stringify(out))));\n'
    + '    document.body.appendChild(d);\n'
    + '  }, 1500);\n'
    + '});\n'
    + '</script>\n';
}

function runScreenSide(cases) {
  const browser = findBrowser();
  if (!browser) { return { skipped: 'ブラウザが見つかりません（この突き合わせは飛ばします）' }; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-cross-'));
  const copy = path.join(dir, 'body.html');
  try {
    let html = fs.readFileSync(BODY, 'utf8');
    const at = html.lastIndexOf('</body>');
    if (at < 0) { throw new Error('</body> が見つかりません'); }
    html = html.slice(0, at) + probeSource(cases) + html.slice(at);
    fs.writeFileSync(copy, html, 'utf8');
    const r = spawnSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
      '--no-sandbox', '--disable-dev-shm-usage', '--window-size=900,1200',
      '--virtual-time-budget=30000', '--dump-dom', 'file:///' + copy.replace(/\\/g, '/')],
      { encoding: 'utf8', maxBuffer: 1024 * 1024 * 512, timeout: 180000 });
    const dom = String(r.stdout || '');
    const m = dom.match(/<div id="CROSSCHECK">([^<]*)<\/div>/);
    if (!m) { return { skipped: '目印が出ませんでした（駆動に失敗）' }; }
    return { rows: JSON.parse(Buffer.from(m[1], 'base64').toString('utf8')) };
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
  }
}

function main() {
  const cases = TEN.map(t => ({ name: t.name, hand: t.hand, seat: t.seat, round: t.round }));
  const analyze = makeAnalyze();
  const nodeSide = {};
  cases.forEach(c => { nodeSide[c.name] = analyze(parseHand(c.hand), c.seat, c.round, 0); });

  const screen = runScreenSide(cases);
  if (screen.skipped) {
    console.log('画面の側：' + screen.skipped);
    console.log('SKIP — 突き合わせは行えませんでした。');
    process.exit(1);
  }

  let okAll = 0, ngAll = 0, missAll = 0;
  const lines = [];
  screen.rows.forEach(row => {
    const n = nodeSide[row.name];
    const rec = row.rec;
    const seen = String(row.text || '');
    let ok = 0, ng = 0, miss = 0;
    const bad = [];
    if (!rec) {
      lines.push('  ' + row.name + '（' + row.hand + '）… 画面の記録が取れませんでした。カードの字＝「' + seen.slice(0, 60) + '」');
      missAll += PAIRS.length;
      return;
    }
    PAIRS.forEach(([sk, nk]) => {
      if (!(sk in rec)) { miss++; return; }
      const a = rec[sk], b = n[nk];
      if (JSON.stringify(a) === JSON.stringify(b)) { ok++; }
      else { ng++; bad.push(nk + '：画面=' + JSON.stringify(a) + ' / node=' + JSON.stringify(b)); }
    });
    okAll += ok; ngAll += ng; missAll += miss;
    lines.push('  ' + (ng === 0 ? '一致' : '不一致') + ' ' + row.name + '（' + row.hand + '）'
      + ' 一致' + ok + '／食い違い' + ng + '／画面に無い' + miss
      + '　判定＝' + (n.tooMany ? '多牌' : n.verdict));
    bad.forEach(b => lines.push('        ✗ ' + b));
  });

  console.log('■ 中核の突き合わせ（node の側 ⇄ 本体の画面の側）');
  console.log('  中核の切り出し元：koushu-handan.html ' + analyze.from + '〜' + analyze.to + '行（' + analyze.lines + '行）');
  console.log('  比べた項目：' + PAIRS.length + '／手牌：' + cases.length + '通り');
  console.log('');
  lines.forEach(l => console.log(l));
  console.log('');
  console.log('  合計 — 一致 ' + okAll + '／食い違い ' + ngAll + '／画面に無い ' + missAll);
  console.log(ngAll === 0 ? 'PASS — 全項目で一致しました。' : 'FAIL — 食い違いがあります（直さず報告のみ）。');
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ node: nodeSide, screen: screen.rows }, null, 1));
  }
  process.exit(ngAll === 0 ? 0 : 1);
}

if (require.main === module) { main(); }
