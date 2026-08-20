#!/usr/bin/env node
/* 剣士のコマに目盛りを重ねた一覧に焼く。頭の幅を目で読むための道具。
   出力は二枚組——本番と同じ暗い背景 #0d1b16 と、白地。asset-proof.js と同じ流儀。

   なぜ要るか：振りの八枚は弧が頭に重なるため、色による頭の自動判定が効かない
   （髪が影に沈み、弧が金髪の色域に入る）。char_export.js の「顔比」も、
   全身の上から5分の1の帯で最も広い行を測る作りなので、八枚では弧を拾う。
   倍率を決めるには、目盛りを重ねて目で読むしかない。読んだ値は
   CLAUDE.md §21 の「目視読みが最終」に従って人が決める。

   使い方: node head-proof.js [koushu-handan.html]
   出力  : head-proof-dark.png ／ head-proof-light.png

   目盛りは元画像の画素で 10px ごとの細線、50px ごとに太線と数字。倍率は2倍。
   画像の読み書きは headless の Edge / Chrome にやらせる（この環境には画像の外部部品が無い）。
   本体には触れない。素材の data URL だけを取り出して別の頁で描く（CLAUDE.md §14 の精神）。 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HTML = process.argv[2] || path.join(__dirname, 'koushu-handan.html');
const src = fs.readFileSync(HTML, 'utf8');

/* ---- 本体の字面から素材と足元の行を拾う（実行時の内部は覗かない） ---- */
function pickObj(name) {
  const i = src.indexOf('const ' + name + ' = {');
  if (i < 0) return {};
  const block = src.slice(i, src.indexOf('};', i) + 2);
  const out = {};
  const re = /(\w+)\s*:\s*'(data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+)'/g;
  let m;
  while ((m = re.exec(block))) out[m[1]] = m[2];
  return out;
}
function pickNums(name) {
  const i = src.indexOf('const ' + name + ' = {');
  if (i < 0) return {};
  const block = src.slice(i, src.indexOf('};', i) + 2);
  const out = {};
  const re = /(\w+)\s*:\s*(\d+)/g;
  let m;
  while ((m = re.exec(block))) out[m[1]] = Number(m[2]);
  return out;
}

const WHIP = pickObj('EDA_WHIP');
const NAGE = pickObj('EDA_NAGE');
const FOOT = pickNums('EDA_FOOT');
const NAGE_FOOT = pickNums('EDA_NAGE_FOOT');

/* 並べる順。測る八枚を先に、物差しの基準を後ろに置く。 */
const GROUPS = [
  { title: '振りの八枚（倍率を決める対象）',
    keys: ['u', 'ur', 'r', 'dr', 'd', 'dl', 'l', 'ul'], from: 'whip' },
  { title: '基準（この三枚と見比べる）',
    keys: ['idleRight', 'breathR', 'action'], from: 'mix' },
];

const items = [];
GROUPS.forEach(g => g.keys.forEach(k => {
  const url = (g.from === 'whip') ? WHIP[k] : (WHIP[k] || NAGE[k]);
  const foot = (FOOT[k] !== undefined) ? FOOT[k] : (NAGE_FOOT[k] !== undefined ? NAGE_FOOT[k] : null);
  items.push({ group: g.title, key: k, url: url || null, foot: foot });
}));

const missing = items.filter(x => !x.url).map(x => x.key);
if (missing.length) {
  console.error('素材を取り出せない : ' + missing.join(', '));
  process.exit(2);
}

/* ---- 焼く頁 ---- */
const PAGE = `<!doctype html><meta charset="utf-8"><body style="margin:0">
<script>
var ITEMS = ${JSON.stringify(items.map(x => ({ group: x.group, key: x.key, url: x.url, foot: x.foot })))};
var Z = 2;            /* 倍率 */
var FINE = 10;        /* 細線の間隔（元画像の画素） */
var BOLD = 50;        /* 太線と数字の間隔 */
var COLS = 4;
var PAD = 46;         /* 目盛りの数字を置く余白 */
var GAP = 18;
var HEAD = 30;        /* 群の見出しの高さ */

function load(u){ return new Promise(function(res, rej){
  var im = new Image(); im.onload = function(){ res(im); }; im.onerror = rej; im.src = u; }); }

(async function(){
  var imgs = [];
  for (var i = 0; i < ITEMS.length; i++) imgs.push(await load(ITEMS[i].url));

  /* 段組み。群ごとに改行する。 */
  var rows = [], cur = null;
  ITEMS.forEach(function(it, i){
    if (!cur || cur.group !== it.group) { cur = { group: it.group, cells: [] }; rows.push(cur); }
    cur.cells.push({ it: it, im: imgs[i] });
  });

  /* 各群を COLS 枚ずつの段に割る */
  var bands = [];
  rows.forEach(function(r){
    for (var s = 0; s < r.cells.length; s += COLS) {
      bands.push({ group: (s === 0 ? r.group : ''), cells: r.cells.slice(s, s + COLS) });
    }
  });

  var W = 0, H = 0;
  bands.forEach(function(b){
    var w = 0, h = 0;
    b.cells.forEach(function(c){ w += c.im.width * Z + PAD + GAP; h = Math.max(h, c.im.height * Z + PAD); });
    W = Math.max(W, w + GAP);
    H += h + HEAD + GAP;
  });
  H += GAP;

  function draw(bg, ink, fine, bold) {
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var g = cv.getContext('2d');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.imageSmoothingEnabled = false;
    var y = GAP;
    bands.forEach(function(b){
      if (b.group) {
        g.fillStyle = ink; g.font = 'bold 17px "Yu Gothic UI", "Meiryo", sans-serif';
        g.textBaseline = 'top';
        g.fillText(b.group, GAP, y);
      }
      y += HEAD;
      var x = GAP, bh = 0;
      b.cells.forEach(function(c){
        var iw = c.im.width * Z, ih = c.im.height * Z;
        var ox = x + PAD, oy = y + PAD;
        g.drawImage(c.im, ox, oy, iw, ih);
        /* 目盛り */
        g.font = '12px Consolas, monospace'; g.textBaseline = 'top';
        for (var sx = 0; sx <= c.im.width; sx += FINE) {
          var px = ox + sx * Z;
          g.strokeStyle = (sx % BOLD === 0) ? bold : fine;
          g.beginPath(); g.moveTo(px + 0.5, (sx % BOLD === 0) ? y + 16 : oy); g.lineTo(px + 0.5, oy + ih); g.stroke();
          if (sx % BOLD === 0) { g.fillStyle = bold; g.fillText(String(sx), px + 2, y + 16); }
        }
        for (var sy = 0; sy <= c.im.height; sy += FINE) {
          var py = oy + sy * Z;
          g.strokeStyle = (sy % BOLD === 0) ? bold : fine;
          g.beginPath(); g.moveTo((sy % BOLD === 0) ? x + 4 : ox, py + 0.5); g.lineTo(ox + iw, py + 0.5); g.stroke();
          if (sy % BOLD === 0) { g.fillStyle = bold; g.fillText(String(sy), x + 4, py + 2); }
        }
        /* 足元の行（EDA_FOOT）を一本引く */
        if (c.it.foot !== null && c.it.foot <= c.im.height) {
          var fy = oy + c.it.foot * Z;
          g.strokeStyle = '#e06a5a';
          g.beginPath(); g.moveTo(ox, fy + 0.5); g.lineTo(ox + iw, fy + 0.5); g.stroke();
          g.fillStyle = '#e06a5a'; g.fillText('足元 ' + c.it.foot, ox + 4, fy + 3);
        }
        /* 名札 */
        g.fillStyle = ink; g.font = '13px Consolas, monospace';
        g.fillText(c.it.key + '  ' + c.im.width + 'x' + c.im.height, ox, oy + ih + 4);
        x += iw + PAD + GAP;
        bh = Math.max(bh, ih + PAD + 22);
      });
      y += bh + GAP;
    });
    return cv.toDataURL('image/png');
  }

  var out = {
    dark:  draw('#0d1b16', '#f3ece0', 'rgba(255,255,255,0.16)', 'rgba(255,215,110,0.85)'),
    light: draw('#ffffff', '#202020', 'rgba(0,0,0,0.14)',       'rgba(190,120,0,0.9)'),
    rows: bands.map(function(b){ return { title: b.group, n: b.cells.length }; })
  };
  var n = document.createElement('div');
  n.id = 'OUT';
  n.textContent = 'HEAD_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(out)))) + 'HEAD_END';
  document.body.appendChild(n);
})();
</script></body>`;

const browser = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(p => p && fs.existsSync(p))[0];

if (!browser) {
  console.error('ブラウザが見つからないため焼けない（Edge か Chrome が要る）');
  process.exit(3);
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-head-'));
try {
  const page = path.join(tmpDir, 'p.html');
  fs.writeFileSync(page, PAGE, 'utf8');
  const r = spawnSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--window-size=1200,900',
    '--user-data-dir=' + path.join(tmpDir, 'prof'),
    '--virtual-time-budget=30000', '--dump-dom',
    'file:///' + page.replace(/\\/g, '/')],
    { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, windowsHide: true });
  const hit = /HEAD_BEGIN([A-Za-z0-9+/=]+)HEAD_END/.exec(String(r.stdout || ''));
  if (!hit) { console.error('焼けなかった（結果を取り出せない）'); process.exit(4); }
  const out = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8'));
  fs.writeFileSync(path.join(__dirname, 'head-proof-dark.png'), Buffer.from(out.dark.split(',')[1], 'base64'));
  fs.writeFileSync(path.join(__dirname, 'head-proof-light.png'), Buffer.from(out.light.split(',')[1], 'base64'));
  console.log('焼いた : head-proof-dark.png ／ head-proof-light.png');
  out.rows.forEach(r2 => { if (r2.title) console.log('  ' + r2.title + ' … ' + r2.n + '枚'); });
  console.log('  合計 ' + items.length + '枚（目盛り 10px／太線と数字 50px／倍率2倍）');
  console.log('');
  console.log('読み方：頭＝耳を除いた髪と顔の輪郭の、いちばん広い行の幅。');
  console.log('　　　　輪郭のぼかしは数えず「芯」で読む（外まで取ると2〜3px多く出る）。');
  console.log('　　　　基準の三枚は idleRight 52 ／ breathR 49 ／ action 59（2026-08-20 の目視読み）。');
} finally {
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
}
