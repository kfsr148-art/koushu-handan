#!/usr/bin/env node
/* v1513-big-check.js — 大物手の一言／惜しむ一言の出し分けを、本体で実際に出して見る（枠 三十三の最後の確かめ・2026-11-21）
   ＊作法14：本体の写しを一時ディレクトリ（名に koushu- を入れる）に作り、adviceFor の直後（DOMContentLoaded の内側）に
     probe を一片差し込んで headless の Chrome／Edge の --dump-dom で駆動する。結果は base64 の目印つきで DOM に置いて拾う。
     リポジトリの本体には何も入れない。本物の ntfy・push・commit は叩かない（この台本は reports/ に書くだけ）。
   ＊作法35：待つ側に timeout 180000・SIGKILL。一度に流さず、切れ端ごとに回す。
   ＊確かめること
     (1) 配牌の打点（a.doraValue）が 3 以上の手と 2 以下の手で、人格7×方言9（63行）の adviceFor の字に
         大物の一言（攻め）／惜しむ一言（守り）が出る・出ないか。攻守と打点は v1508（c0f520de）と同じ入力で突き合わせる。
     (2) 出た字が reports/kuchou-441.tsv の「大物」「惜しむ」の入れる字（63×2）と一致するか。食い違いの数。 */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync, execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const V1508 = 'c0f520dea608e696da479fd187643eed358fc264';
const TONES = ['butler', 'strategist', 'blunt', 'lady', 'french', 'ichihime', 'sensei'];
const DIALS = ['std', 'miyazaki', 'hakata', 'osaka', 'kyoto', 'aomori', 'okinawa', 'bushi', 'yoji'];
const ANCHOR = '/* 声：部品の wav（24kHz';
const T0 = Date.now();
const sec = () => Math.round((Date.now() - T0) / 1000) + '秒';

/* ---- ブラウザ ---- */
const browser = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(p => p && fs.existsSync(p))[0];
if (!browser) { console.log('SKIP：ブラウザが見つからない（PASS ではない）'); process.exit(2); }
console.log('ブラウザ：' + browser);

/* ---- 本体の二版 ---- */
const srcNew = fs.readFileSync(path.join(ROOT, 'koushu-handan.html'), 'utf8');
function gitShow(rev) { return execFileSync('git', ['show', rev + ':koushu-handan.html'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 180000, killSignal: 'SIGKILL' }); }
let srcOld;
try { srcOld = gitShow(V1508); }
catch (e) {
  console.log('v1508 が浅い写しに無い → 取りに行く');
  try { execFileSync('git', ['fetch', '--depth=1', 'origin', V1508], { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' }); srcOld = gitShow(V1508); }
  catch (e2) { execFileSync('git', ['fetch', '--deepen=400', 'origin'], { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' }); srcOld = gitShow(V1508); }
}
const verOf = s => (/data-ver="([^"]+)"/.exec(s) || [])[1];
console.log('新：' + verOf(srcNew) + '／旧：' + verOf(srcOld));
[['新', srcNew], ['旧', srcOld]].forEach(([n, s]) => { const c = s.split(ANCHOR).length - 1; if (c !== 1) { console.log('FAIL：' + n + 'の差し込み所が ' + c + ' 件'); process.exit(1); } });

/* ---- 手（種つきの乱数で作る・両版に同じ物を渡す） ---- */
function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = rng(20261121);
function wall() {
  const w = [];
  ['m', 'p', 's'].forEach(s => { for (let n = 1; n <= 9; n++) { for (let k = 0; k < 4; k++) { w.push(s + ((n === 5 && k === 0) ? 0 : n)); } } });   // 0＝赤五
  ['E', 'S', 'W', 'N', 'P', 'F', 'C'].forEach(c => { for (let k = 0; k < 4; k++) { w.push(c); } });
  return w;
}
function take(w, c) { const i = w.indexOf(c); if (i >= 0) { w.splice(i, 1); return c; } return null; }
function draw(w) { return w.splice(Math.floor(R() * w.length), 1)[0]; }
const HANDS = [];
for (let i = 0; i < 3000; i++) {
  const w = wall(), t = [];
  if (i >= 1500 && i < 2250) { ['m0', 'p0', 's0'].forEach(c => t.push(take(w, c))); }            // 赤三枚＋十枚（打点 3 以上が必ず立つ。攻守はばらける）
  else if (i >= 2250) { ['m0', 'p0'].forEach(c => t.push(take(w, c))); }                          // 赤二枚＋表示牌（打点 2 前後の境目）
  while (t.length < 13) { t.push(draw(w)); }
  const ind = draw(w);
  const ix = i;
  HANDS.push({ t: t.map(c => c), i: (R() < 0.85) ? ind : null, n: ix });
}

/* ---- probe ---- */
function probeCode(data) {
  return '\n;(function(){ var __KP = ' + JSON.stringify(data) + ';\n' + String.raw`
setTimeout(function(){
  var out = { ver: document.documentElement.getAttribute('data-ver'), res: [] };
  try {
    var mk = function(c){ if(c.length === 1) return honorTileOf(c); var s = ({m:'man',p:'pin',s:'sou'})[c[0]], n = +c[1]; return (n === 0) ? numTileOf(s, 5, true) : numTileOf(s, n, false); };
    var sh = hand, sdc = doraCount, sdi = doraIndicator, st = currentTone, sdl = currentDialect, stt = currentTaunt;
    try {
      __KP.hands.forEach(function(h){
        var tiles = h.t.map(mk);
        hand = tiles; doraIndicator = h.i || null;
        doraCount = h.i ? tiles.filter(function(x){ return x.code === indicatorToDora(h.i); }).length : 0;
        var a = analyze();
        if(!a || a.tooMany){ out.res.push({ n: h.n, err: 'no-a' }); return; }
        var catN = tiles.filter(function(x){ return x.suit === 'cat'; }).length + countIsolatedRealTiles(tiles.filter(function(x){ return x.suit !== 'cat'; }));
        var v0 = a.verdict, rv = revoteVerdict(a, catN);
        if(rv){ a.revote = rv; a.verdict = rv.to; }
        var row = { n: h.n, v: a.verdict, v0: v0, dv: a.doraValue };
        if(__KP.mode === 'adv'){
          row.adv = [];
          var att = (a.verdict === 'attack');
          __KP.dials.forEach(function(d){
            __KP.tones.forEach(function(tn){
              currentTone = tn; currentDialect = (d === 'std') ? '' : d; currentTaunt = 'normal';
              var r = null, e = '';
              try { r = adviceFor(a, tiles, att); } catch(ex){ e = String(ex); }
              row.adv.push({ tone: tn, dial: d, text: r ? r.text : null, noAudio: !!(r && !r.audio), scene: r && r.scene ? r.scene : '', e: e });
            });
          });
        }
        out.res.push(row);
      });
    } finally { hand = sh; doraCount = sdc; doraIndicator = sdi; currentTone = st; currentDialect = sdl; currentTaunt = stt; }
  } catch(e){ out.err = String(e && e.stack || e); }
  var n = document.createElement('div');
  n.textContent = 'KOUSHU_BIG_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(out)))) + 'KOUSHU_BIG_END';
  document.body.appendChild(n);
}, 300);
})();
`;
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-big-'));
let runNo = 0;
function run(src, data, label) {
  runNo++;
  const k = src.indexOf(ANCHOR);
  const html = src.slice(0, k) + probeCode(data) + '\n  ' + src.slice(k);
  const f = path.join(tmp, 'probe-' + runNo + '.html');
  fs.writeFileSync(f, html, 'utf8');
  const t1 = Date.now();
  const r = spawnSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
    '--force-device-scale-factor=1', '--window-size=844,390',
    '--user-data-dir=' + path.join(tmp, 'prof-' + runNo),
    '--virtual-time-budget=60000', '--dump-dom', 'file:///' + f.replace(/\\/g, '/')],
    { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, windowsHide: true, timeout: 180000, killSignal: 'SIGKILL' });
  fs.rmSync(f, { force: true });
  const s = Math.round((Date.now() - t1) / 1000);
  if (r.error && r.error.code === 'ETIMEDOUT') { console.log('  ' + label + '：上限180秒で切った'); return null; }
  const hit = /KOUSHU_BIG_BEGIN([A-Za-z0-9+/=]+)KOUSHU_BIG_END/.exec(String(r.stdout || ''));
  if (!hit) { console.log('  ' + label + '：目印が無い（' + s + '秒・終了 ' + r.status + '）' + String(r.stderr || '').slice(0, 300)); return null; }
  const got = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8'));
  console.log('  ' + label + '：' + got.ver + '・' + got.res.length + '件・' + s + '秒' + (got.err ? '・例外 ' + got.err.slice(0, 300) : ''));
  return got;
}

try {
  /* ---- ① 攻守と打点：v1508 と v1513 に同じ 3000 手 ---- */
  console.log('\n## ① 攻守と打点（同じ入力 3000 手・v1508 と v1513）');
  const V = { old: [], neu: [] };
  for (let c = 0; c < HANDS.length; c += 1000) {
    const part = HANDS.slice(c, c + 1000);
    const o = run(srcOld, { mode: 'v', hands: part }, '旧 ' + c + '〜');
    const nn = run(srcNew, { mode: 'v', hands: part }, '新 ' + c + '〜');
    if (o) { V.old = V.old.concat(o.res); }
    if (nn) { V.neu = V.neu.concat(nn.res); }
  }
  const om = {}; V.old.forEach(x => { om[x.n] = x; });
  let cmp = 0, dV = 0, dV0 = 0, dDv = 0; const diffs = [];
  V.neu.forEach(x => { const o = om[x.n]; if (!o || x.err || o.err) { return; } cmp++; if (o.v !== x.v) { dV++; diffs.push(x.n); } if (o.v0 !== x.v0) { dV0++; } if (o.dv !== x.dv) { dDv++; } });
  const cnt = (arr, f) => arr.filter(f).length;
  console.log('突き合わせた手 ' + cmp + '／攻守（決め直し後）の食い違い ' + dV + '／決め直し前の食い違い ' + dV0 + '／打点の食い違い ' + dDv + (diffs.length ? '／食い違った手 ' + diffs.slice(0, 20).join(',') : ''));
  console.log('新の内訳：打点3以上かつ攻め ' + cnt(V.neu, x => x.dv >= 3 && x.v === 'attack') + '／打点3以上かつ守り ' + cnt(V.neu, x => x.dv >= 3 && x.v === 'defend') + '／打点3未満かつ攻め ' + cnt(V.neu, x => x.dv < 3 && x.v === 'attack') + '／打点3未満かつ守り ' + cnt(V.neu, x => x.dv < 3 && x.v === 'defend') + '／打点ちょうど2 ' + cnt(V.neu, x => x.dv === 2));

  /* ---- 手を選ぶ（四つの組・各3手） ---- */
  const byN = {}; HANDS.forEach(h => { byN[h.n] = h; });
  const pick = (f, k) => V.neu.filter(x => !x.err && f(x)).slice(0, k);
  const G = {
    BA: pick(x => x.dv >= 3 && x.v === 'attack', 3),
    BD: pick(x => x.dv >= 3 && x.v === 'defend', 3),
    SA: pick(x => x.dv === 2 && x.v === 'attack', 1).concat(pick(x => x.dv < 2 && x.v === 'attack', 2)),
    SD: pick(x => x.dv === 2 && x.v === 'defend', 1).concat(pick(x => x.dv < 2 && x.v === 'defend', 2))
  };
  const sel = [];
  Object.keys(G).forEach(g => { G[g].forEach(x => { sel.push(byN[x.n]); }); console.log('組 ' + g + '：' + G[g].map(x => '手' + x.n + '（打点' + x.dv + '・' + x.v + '：' + byN[x.n].t.join(' ') + (byN[x.n].i ? '／表示 ' + byN[x.n].i : '') + '）').join('　')); });
  const grp = {}; Object.keys(G).forEach(g => G[g].forEach(x => { grp[x.n] = g; }));

  /* ---- ② 63行の字：adviceFor ---- */
  console.log('\n## ② 人格7×方言9 の adviceFor（' + sel.length + '手 × 63）');
  const recs = [];
  for (let c = 0; c < DIALS.length; c += 3) {
    const ds = DIALS.slice(c, c + 3);
    const g = run(srcNew, { mode: 'adv', hands: sel, dials: ds, tones: TONES }, '新 ' + ds.join('・'));
    if (g) { g.res.forEach(x => { (x.adv || []).forEach(a => { recs.push(Object.assign({ n: x.n, v: x.v, dv: x.dv, g: grp[x.n] }, a)); }); }); }
  }

  /* ---- 口調表 ---- */
  const tsv = fs.readFileSync(path.join(ROOT, 'reports', 'kuchou-441.tsv'), 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split('\t'));
  const H = tsv[0], iT = H.indexOf('人格'), iD = H.indexOf('方言'), iK = H.indexOf('種類'), iX = H.indexOf('入れる字');
  const EXP = {};
  tsv.slice(1).forEach(r => { if (r[iK] !== '大物' && r[iK] !== '惜しむ') { return; } const key = r[iT] + '|' + r[iD]; (EXP[key] = EXP[key] || {})[r[iK] === '大物' ? 'big' : 'def'] = r[iX] || ''; });
  console.log('口調表の行：' + Object.keys(EXP).length + '組（大物 ' + Object.values(EXP).filter(e => e.big !== undefined).length + '・惜しむ ' + Object.values(EXP).filter(e => e.def !== undefined).length + '）');

  /* ---- 判じる ---- */
  const rows = [], bad = [];
  let mBig = 0, mDef = 0, mSmall = 0, nScene = 0, nNull = 0;
  TONES.forEach(tn => DIALS.forEach(d => {
    const e = EXP[tn + '|' + d] || {}, big = e.big || '', def = e.def || '';
    const rs = recs.filter(r => r.tone === tn && r.dial === d);
    const st = { BA: [0, 0], BD: [0, 0], SA: [0, 0], SD: [0, 0] };   // [見た, 合った]
    const shown = { big: '', def: '' };
    rs.forEach(r => {
      if (r.text == null) { nNull++; bad.push(tn + '/' + d + ' 手' + r.n + '：字が無い ' + r.e); st[r.g][0]++; return; }
      if (r.noAudio) { nScene++; }
      const t = r.text, hasB = big && t.indexOf(big) >= 0, hasD = def && t.indexOf(def) >= 0, headB = big && t.indexOf(big) === 0, headD = def && t.indexOf(def) === 0;
      let ok;
      if (r.g === 'BA') { ok = big ? (headB && !hasD) : (!hasD); if (!ok) { mBig++; } if (!shown.big) { shown.big = t.slice(0, 40); } }
      else if (r.g === 'BD') { ok = def ? (headD && !hasB) : (!hasB); if (!ok) { mDef++; } if (!shown.def) { shown.def = t.slice(0, 40); } }
      else { ok = !hasB && !hasD; if (!ok) { mSmall++; } }
      st[r.g][0]++; if (ok) { st[r.g][1]++; }
      if (!ok) { bad.push(tn + '/' + d + ' 組' + r.g + ' 手' + r.n + (r.noAudio ? '（声なし・場面の早い戻り ' + r.scene + '）' : '') + '：' + t.slice(0, 80)); }
    });
    rows.push([tn, d, big, def, st.BA.join('/'), st.BD.join('/'), st.SA.join('/'), st.SD.join('/'), shown.big, shown.def]);
  }));
  const okRow = r => [4, 5, 6, 7].every(i => { const p = r[i].split('/'); return p[0] !== '0' && p[0] === p[1]; });
  console.log('\n| 人格 | 方言 | 大物（攻・打点3+） | 惜しむ（守・打点3+） | 打点3未満・攻 | 打点3未満・守 | 判 |');
  console.log('|---|---|---|---|---|---|---|');
  rows.forEach(r => console.log('| ' + r[0] + ' | ' + r[1] + ' | ' + r[4] + ' | ' + r[5] + ' | ' + r[6] + ' | ' + r[7] + ' | ' + (okRow(r) ? 'OK' : 'NG') + ' |'));
  console.log('\n（各欄＝合った数/見た数。大物＝字の頭が口調表の大物の字・惜しむの字なし／惜しむ＝字の頭が口調表の惜しむの字・大物の字なし／打点3未満＝どちらも無し）');
  console.log('\n## まとめ');
  console.log('63行のうち全部合った行：' + rows.filter(okRow).length + '／63');
  console.log('大物の一言の食い違い（字・有無）：' + mBig + '件／惜しむ一言の食い違い：' + mDef + '件／打点3未満で出てしまった：' + mSmall + '件');
  console.log('字が返らなかった：' + nNull + '件／声なしの戻り（場面の早い戻り）：' + nScene + '件');
  console.log('攻守（v1508 と同じ入力）の食い違い：' + dV + '件／打点の食い違い：' + dDv + '件（' + cmp + '手）');
  if (bad.length) { console.log('\n### 食い違いの中身（頭から60件）'); bad.slice(0, 60).forEach(b => console.log('- ' + b)); }
  const outTsv = path.join(ROOT, 'reports', 'v1513-big-check.tsv');
  fs.writeFileSync(outTsv, ['人格\t方言\t表の大物\t表の惜しむ\t大物(合/見)\t惜しむ(合/見)\t小・攻\t小・守\t出た字の頭(大物)\t出た字の頭(惜しむ)'].concat(rows.map(r => r.join('\t'))).join('\n') + '\n', 'utf8');
  console.log('\n書いた：reports/v1513-big-check.tsv／所要 ' + sec());
  const pass = rows.filter(okRow).length === 63 && mBig + mDef + mSmall + nNull === 0 && dV === 0 && dDv === 0 && cmp === HANDS.length;
  console.log(pass ? 'PASS' : 'FAIL（上の食い違いを見る）');
  process.exitCode = pass ? 0 : 1;
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
