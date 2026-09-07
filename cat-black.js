/* 返事パネルの「ヨシ待ち」に出す黒い現場猫を焼く道具（2026-09-07・黒猫の待機-1 ③）。
 *
 *   node cat-black.js
 *
 * 何をするか
 *   ・panel-icon-white.png（ウィジェットの白い影絵）の**色だけ黒へ塗り替える**。
 *     透明の度合い（alpha）はそのまま。形は一切変えない。
 *   ・出来上がりは panel-icon-black.png。
 *
 * 決めごと
 *   ・**元絵は残す。**焼いた物は別名で置く（cat-white.js と同じ扱い）。
 *   ・使うのは**返事パネルだけ**。ウィジェットの猫は白のまま。
 *   ・焼き直しは何度でもできる（この道具を回すだけ）。
 *   ・色は #1b1b1b（真っ黒より少し浮かせる。題の行の地に沈まないように）。
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = 'panel-icon-white.png';
const DST = 'panel-icon-black.png';
const RGB = [27, 27, 27];

if (!fs.existsSync(SRC)) { console.error(SRC + ' が無い'); process.exit(1); }
const b64 = fs.readFileSync(SRC).toString('base64');

const page = `<!doctype html><meta charset="utf-8"><body><script>
const im = new Image();
im.onload = function(){
  const c = document.createElement('canvas');
  c.width = im.naturalWidth; c.height = im.naturalHeight;
  const g = c.getContext('2d');
  g.drawImage(im, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height);
  const a = d.data;
  for (let i = 0; i < a.length; i += 4) {
    if (a[i + 3] === 0) { continue; }       /* 透明はそのまま */
    a[i] = ${RGB[0]}; a[i + 1] = ${RGB[1]}; a[i + 2] = ${RGB[2]};
  }
  g.putImageData(d, 0, 0);
  const out = document.createElement('div');
  out.id = 'OUT';
  out.textContent = c.toDataURL('image/png') + '|' + c.width + 'x' + c.height;
  document.body.appendChild(out);
};
im.src = 'data:image/png;base64,${b64}';
</script></body>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'catblack-'));
const html = path.join(tmp, 'p.html');
fs.writeFileSync(html, page, 'utf8');

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].filter(p => p && fs.existsSync(p))[0];
if (!EDGE) { console.error('msedge が見つからない'); process.exit(1); }

const dom = execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox',
  '--user-data-dir=' + path.join(tmp, 'ud'), '--virtual-time-budget=4000',
  '--dump-dom', 'file:///' + html.split(String.fromCharCode(92)).join('/')], { encoding: 'utf8', maxBuffer: 1 << 28 });

const m = dom.match(/id="OUT"[^>]*>([^<]*)</);
if (!m) { console.error('焼けなかった（OUT が拾えない）'); process.exit(1); }
const [uri, size] = m[1].split('|');
fs.writeFileSync(DST, Buffer.from(uri.split(',')[1], 'base64'));
fs.rmSync(tmp, { recursive: true, force: true });
console.log('焼いた : ' + DST + '  ' + size + '  ' + fs.statSync(DST).size + 'バイト（元 ' + SRC + ' の形そのまま・色だけ #1b1b1b）');
