/* 返事パネルの頭に出す猫を、六枚まとめて白へ焼く道具（2026-09-09・猫を全部白へ-1）。
 *
 *   node cat-frames-white.js
 *
 * 何をするか
 *   ・cat0〜cat4 と cat-sleep（どれも 56x36 の黒一色の影絵）の**色だけ白へ塗り替える**。
 *     透明の度合い（alpha）はそのまま。形も余白も一画素も変えない。
 *   ・出来上がりは cat0-w〜cat4-w ／ cat-sleep-w。
 *
 * なぜ焼くか
 *   ・元の六枚は真っ黒（不透明な画素はほぼ RGB(0,0,0)）で、返事パネルの地
 *     （--bg #14241c＝RGB 20,36,28）とのコントラスト比が **1.3** しかない。地に沈む。
 *   ・白（255,255,255）にすると比は 16.2 まで上がる。
 *
 * 決めごと
 *   ・**元絵は残す。**焼いた物は別名（*-w.png）で置く（cat-black.js / cat-white.js と同じ扱い）。
 *   ・使うのは**返事パネルだけ**。ウィジェットの猫（*-white.png）はそのまま。
 *   ・焼き直しは何度でもできる（この道具を回すだけ）。
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const PAIRS = [
  ['cat0.png', 'cat0-w.png'],
  ['cat1.png', 'cat1-w.png'],
  ['cat2.png', 'cat2-w.png'],
  ['cat3.png', 'cat3-w.png'],
  ['cat4.png', 'cat4-w.png'],
  ['cat-sleep.png', 'cat-sleep-w.png'],
];
const RGB = [255, 255, 255];

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].filter(p => fs.existsSync(p))[0];
if (!EDGE) { console.error('msedge が見つからない'); process.exit(1); }

const items = PAIRS.filter(([src]) => {
  if (fs.existsSync(src)) { return true; }
  console.error(src + ' が無い');
  return false;
}).map(([src, dst]) => ({ src: src, dst: dst, b64: fs.readFileSync(src).toString('base64') }));

const list = items.map(it => "{n:'" + it.dst + "',s:'data:image/png;base64," + it.b64 + "'}").join(',');

const page = '<!doctype html><meta charset="utf-8"><body><script>\n'
  + 'var list=[' + list + '];\n'
  + 'var out=[]; var k=0;\n'
  + 'function step(){ if(k>=list.length){ var d=document.createElement("div"); d.id="OU"+"TX";\n'
  + '  d.textContent=btoa(unescape(encodeURIComponent(JSON.stringify(out)))); document.body.appendChild(d); return; }\n'
  + ' var it=list[k++]; var im=new Image();\n'
  + ' im.onload=function(){ var c=document.createElement("canvas"); c.width=im.naturalWidth; c.height=im.naturalHeight;\n'
  + '  var g=c.getContext("2d"); g.drawImage(im,0,0);\n'
  + '  var d=g.getImageData(0,0,c.width,c.height); var a=d.data;\n'
  + '  for(var i=0;i<a.length;i+=4){ if(a[i+3]===0) continue; a[i]=' + RGB[0] + '; a[i+1]=' + RGB[1] + '; a[i+2]=' + RGB[2] + '; }\n'
  + '  g.putImageData(d,0,0);\n'
  + '  out.push({n:it.n, u:c.toDataURL("image/png"), w:c.width, h:c.height});\n'
  + '  step(); };\n'
  + ' im.src=it.s; }\n'
  + 'step();\n</script></body>';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'catw-'));
const html = path.join(tmp, 'p.html');
fs.writeFileSync(html, page, 'utf8');

const dom = execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox',
  '--user-data-dir=' + path.join(tmp, 'ud'), '--virtual-time-budget=8000',
  '--dump-dom', 'file:///' + html.split(String.fromCharCode(92)).join('/')],
  { encoding: 'utf8', maxBuffer: 1 << 28 });

const m = dom.match(/id="OUTX">([A-Za-z0-9+/=]*)</);
if (!m) { console.error('焼けなかった（目印が拾えない）'); process.exit(1); }
JSON.parse(Buffer.from(m[1], 'base64').toString('utf8')).forEach(function (r) {
  fs.writeFileSync(r.n, Buffer.from(r.u.split(',')[1], 'base64'));
  console.log('焼いた : ' + r.n + '  ' + r.w + 'x' + r.h + '  ' + fs.statSync(r.n).size + 'バイト');
});
fs.rmSync(tmp, { recursive: true, force: true });
