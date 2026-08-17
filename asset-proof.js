#!/usr/bin/env node
/* 剣士まわりの埋め込み素材を、目で検分するための一覧に焼く。
   出力は二枚組——本番と同じ暗い背景 #0d1b16 と、白地。足元を揃えて並べる。

   なぜ要るか：v1399 で見つかった刀身の欠け（銀の刀身・白い耳・白いタイツが
   「明るさ＝不透明度」の白抜きで落ちていた）は、平均や割合といった数値の検査を
   すべてすり抜けた。暗い背景に置いて目で見るまで分からない。素材を差し替えたら、
   この二枚を見ることを検収の手順にする。

   使い方: node asset-proof.js [koushu-handan.html]
   出力  : asset-proof-dark.png ／ asset-proof-light.png

   画像の読み書きは headless の Edge / Chrome にやらせる（この環境には画像の外部部品が無く、
   勝敗の絵は JPEG なので素の PNG 読みでは開けない）。本体には触れない。
   写しは作らず、素材の data URL だけを取り出して別の頁で描く（CLAUDE.md §14 の精神）。 */
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
function pickOne(name) {
  const re = new RegExp('const ' + name + "\\s*=\\s*'(data:image\\/[a-z]+;base64,[A-Za-z0-9+/=]+)'");
  const m = src.match(re);
  return m ? m[1] : null;
}

const WHIP = pickObj('EDA_WHIP');
const NAGE = pickObj('EDA_NAGE');
const FOOT = pickNums('EDA_FOOT');
const NAGE_FOOT = pickNums('EDA_NAGE_FOOT');
const WIN = pickOne('TORI_WIN_IMG');
const LOSE = pickOne('TORI_LOSE_IMG');

/* 並べる順。役どころで括ると、どれが欠けたか目で辿りやすい。 */
const GROUPS = [
  { title: '待機（3）', keys: ['idleFront', 'idleRight', 'idleLeft'], from: 'whip' },
  { title: '振り（8）', keys: ['u', 'ur', 'r', 'dr', 'd', 'dl', 'l', 'ul'], from: 'whip' },
  { title: '跳躍（6）', keys: ['airUpR', 'airUpL', 'airSlashR', 'airSlashL', 'airDownR', 'airDownL'], from: 'whip' },
  { title: '息切れ（2）・走り（2）・喜び（2）・仰け反り（1）',
    keys: ['breathR', 'breathL', 'runR', 'runL', 'joyJump', 'joyLand', 'hit'], from: 'whip' },
  { title: '投げ（5）・飛ぶ星（1）', keys: ['prepare', 'grasp', 'flick', 'flight', 'action', 'tama'], from: 'nage' },
  { title: '勝敗（2）', keys: ['win', 'lose'], from: 'other' },
];

const items = [];
GROUPS.forEach(g => g.keys.forEach(k => {
  const url = g.from === 'whip' ? WHIP[k]
            : g.from === 'nage' ? NAGE[k]
            : (k === 'win' ? WIN : LOSE);
  const foot = g.from === 'whip' ? FOOT[k] : g.from === 'nage' ? NAGE_FOOT[k] : null;
  items.push({ group: g.title, key: k, url: url || null, foot: (foot === undefined ? null : foot) });
}));

const missing = items.filter(x => !x.url);
if (missing.length) {
  console.error('本体から拾えない素材があります : ' + missing.map(x => x.key).join(', '));
  process.exit(1);
}
/* 本体に居るのに一覧へ入れ忘れていないか（差し替えのたびに増えるので見張る） */
const listed = new Set(items.map(x => x.key));
const strays = [].concat(Object.keys(WHIP), Object.keys(NAGE)).filter(k => !listed.has(k));

const browser = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(p => p && fs.existsSync(p))[0];
if (!browser) { console.error('Edge か Chrome が要ります'); process.exit(1); }

const MK = '#' + 'ASSET' + 'PROOF#';
const page = `<!doctype html><meta charset="utf-8"><body><script>
const MK = ${JSON.stringify(MK)};
const ITEMS = ${JSON.stringify(items)};
const GROUPS = ${JSON.stringify(GROUPS.map(g => g.title))};
const SCALE = 0.62;            /* 32枚が一枚に収まる倍率 */
const PAD = 14, LBL = 18, HEAD = 26, GAP = 8;
function load(u){ return new Promise((ok,ng)=>{ const i=new Image(); i.onload=()=>ok(i); i.onerror=()=>ng(new Error('読めない')); i.src=u; }); }
(async function(){
  const out = { err:null, dark:null, light:null, rows:[] };
  try{
    for(const it of ITEMS){ it.img = await load(it.url); }
    /* 群れごとに行を作る。行の高さは「足元より上」と「足元より下」の最大で決める。 */
    const rows = [];
    GROUPS.forEach(function(title){
      const list = ITEMS.filter(function(x){ return x.group === title; });
      let up = 0, dn = 0, wid = 0;
      list.forEach(function(x){
        const w = x.img.naturalWidth * SCALE, h = x.img.naturalHeight * SCALE;
        const f = (x.foot === null) ? h : x.foot * SCALE;   /* 足元の無い絵は下端を足元とみなす */
        up = Math.max(up, f); dn = Math.max(dn, h - f);
        wid += w + GAP;
      });
      rows.push({ title:title, list:list, up:up, dn:dn, wid:wid });
    });
    const W = Math.ceil(Math.max.apply(null, rows.map(function(r){ return r.wid; })) + PAD*2);
    const H = Math.ceil(rows.reduce(function(s,r){ return s + HEAD + r.up + r.dn + LBL + PAD; }, PAD));
    function draw(bg, fg){
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d');
      x.fillStyle = bg; x.fillRect(0,0,W,H);
      let y = PAD;
      rows.forEach(function(r){
        x.fillStyle = fg; x.font = 'bold 14px sans-serif'; x.textAlign = 'left';
        x.fillText(r.title, PAD, y + 14);
        y += HEAD;
        const base = y + r.up;                       /* この行の足元の線 */
        x.strokeStyle = fg === '#000000' ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.18)';
        x.beginPath(); x.moveTo(PAD, base + 0.5); x.lineTo(W - PAD, base + 0.5); x.stroke();
        let cx = PAD;
        r.list.forEach(function(it){
          const w = it.img.naturalWidth * SCALE, h = it.img.naturalHeight * SCALE;
          const f = (it.foot === null) ? h : it.foot * SCALE;
          x.drawImage(it.img, cx, base - f, w, h);
          x.fillStyle = fg; x.font = '11px monospace'; x.textAlign = 'center';
          x.fillText(it.key, cx + w/2, base + r.dn + 13);
          cx += w + GAP;
        });
        y = base + r.dn + LBL + PAD;
      });
      return c.toDataURL('image/png');
    }
    out.dark  = draw('#0d1b16', '#ffffff');
    out.light = draw('#ffffff', '#000000');
    out.rows = rows.map(function(r){ return { title:r.title, n:r.list.length }; });
  }catch(e){ out.err = String(e && e.message || e); }
  const v = document.createElement('div'); v.id = 'OUT';
  v.textContent = MK + btoa(unescape(encodeURIComponent(JSON.stringify(out)))) + MK;
  document.body.appendChild(v);
})();
</script></body>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'assetproof-'));
try {
  const f = path.join(tmp, 'sheet.html');
  fs.writeFileSync(f, page, 'utf8');
  const r = spawnSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--window-size=1400,1000',
    '--user-data-dir=' + path.join(tmp, 'prof'),
    '--virtual-time-budget=60000', '--dump-dom',
    'file:///' + f.replace(/\\/g, '/')],
    { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, windowsHide: true });
  const mm = new RegExp(MK + '([A-Za-z0-9+/=]+)' + MK).exec(String(r.stdout || ''));
  if (!mm) { console.error('焼けなかった（ブラウザから結果を取り出せない）'); process.exit(1); }
  const out = JSON.parse(Buffer.from(mm[1], 'base64').toString('utf8'));
  if (out.err) { console.error('しくじった: ' + out.err); process.exit(1); }
  fs.writeFileSync('asset-proof-dark.png', Buffer.from(out.dark.split(',')[1], 'base64'));
  fs.writeFileSync('asset-proof-light.png', Buffer.from(out.light.split(',')[1], 'base64'));
  console.log('焼いた : asset-proof-dark.png ／ asset-proof-light.png');
  out.rows.forEach(r => console.log('  ' + r.title + ' … ' + r.n + '枚'));
  console.log('  合計 ' + items.length + '枚');
  if (strays.length) {
    console.log('');
    console.log('※ 本体に在るのに一覧へ入っていない素材 : ' + strays.join(', '));
    console.log('  GROUPS に足すこと（差し替えのたびに増える）');
  }
  console.log('');
  console.log('検分の要点：刀身が銀に見えるか／耳とタイツの白が残っているか／');
  console.log('　　　　　　白地の側で輪郭に白い縁が残っていないか（アンマットの取りこぼし）');
} finally {
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
}
