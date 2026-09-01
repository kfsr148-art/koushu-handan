/* ウィジェットに出す猫を白へ焼き直す道具（2026-09-01・ウィジェットの猫の色-1）
 *
 *   node cat-white.js
 *
 * 何をするか
 *   ・cat2.png / cat-sleep.png / cat4.png … 黒一色の影絵なので、**色を反転**して白にする
 *     （透明の度合いはそのまま。縁の薄い灰も 229 前後の淡い白になる）
 *   ・panel-icon.png … 現場猫の色付きの絵で、**透明が無い**（背景の深緑 20,36,28 が 65%）。
 *     そのままウィジェットへ置くと四角い塊に見えるので、**背景を抜いて白い影絵**にする。
 *     ＊小さく出す（26px 幅）ので、兜と指差しの形だけが残れば見分けは付く。
 *
 * 決めごと
 *   ・**元絵は残す。** 焼いた物は別名（*-white.png）で置く。
 *   ・使うのは**ウィジェットだけ**。返事パネルの猫は元の絵のまま。
 *   ・焼き直しは何度でもできる（この道具を回すだけ）。
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = __dirname;
const MK = 'CATWHITE';

/* 焼く相手。mode … invert＝色を反転／silhouette＝背景を抜いて白一色 */
const JOBS = [
  { src: 'cat2.png',       dst: 'cat2-white.png',       mode: 'invert' },
  { src: 'cat-sleep.png',  dst: 'cat-sleep-white.png',  mode: 'invert' },
  { src: 'cat4.png',       dst: 'cat4-white.png',       mode: 'invert' },
  { src: 'panel-icon.png', dst: 'panel-icon-white.png', mode: 'silhouette' }
];

const feed = JOBS.map(j => ({
  dst: j.dst, mode: j.mode,
  uri: 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, j.src)).toString('base64')
}));

const html = '<!doctype html><html><body><script>\n' +
  'const JOBS = ' + JSON.stringify(feed) + ';\n' + `
(async () => {
  const out = [];
  for (const j of JOBS) {
    const im = new Image();
    await new Promise(r => { im.onload = r; im.onerror = r; im.src = j.uri; });
    const c = document.createElement('canvas');
    c.width = im.width; c.height = im.height;
    const x = c.getContext('2d');
    x.drawImage(im, 0, 0);
    const g = x.getImageData(0, 0, c.width, c.height);
    const d = g.data;
    if (j.mode === 'invert') {
      /* 影絵。色だけ反転し、透明の度合いはそのまま残す。 */
      for (let i = 0; i < d.length; i += 4) {
        d[i] = 255 - d[i]; d[i + 1] = 255 - d[i + 1]; d[i + 2] = 255 - d[i + 2];
      }
      x.putImageData(g, 0, 0);
      out.push({ dst: j.dst, uri: c.toDataURL('image/png'), w: c.width, h: c.height });
    } else {
      /* 色付きの絵。四隅の色を背景とみなし、そこから遠い画素だけを白で残す。
         ＊しきい値は 60（256階調の距離）。兜の白も体の灰も、背景の深緑からは十分遠い。 */
      const bg = [d[0], d[1], d[2]];
      const far = (i) => {
        const dr = d[i] - bg[0], dg = d[i + 1] - bg[1], db = d[i + 2] - bg[2];
        return Math.sqrt(dr * dr + dg * dg + db * db) > 60;
      };
      let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
      const mask = new Uint8Array(c.width * c.height);
      for (let p = 0; p < mask.length; p++) {
        const i = p * 4;
        if (far(i)) {
          mask[p] = 1;
          const px = p % c.width, py = (p / c.width) | 0;
          if (px < x0) { x0 = px; } if (px > x1) { x1 = px; }
          if (py < y0) { y0 = py; } if (py > y1) { y1 = py; }
        }
      }
      const w2 = Math.max(1, x1 - x0 + 1), h2 = Math.max(1, y1 - y0 + 1);
      const c2 = document.createElement('canvas');
      c2.width = w2; c2.height = h2;
      const x2 = c2.getContext('2d');
      const g2 = x2.createImageData(w2, h2);
      for (let yy = 0; yy < h2; yy++) {
        for (let xx = 0; xx < w2; xx++) {
          const p = (yy + y0) * c.width + (xx + x0);
          const q = (yy * w2 + xx) * 4;
          const on = mask[p] === 1;
          g2.data[q] = 255; g2.data[q + 1] = 255; g2.data[q + 2] = 255;
          g2.data[q + 3] = on ? 255 : 0;
        }
      }
      x2.putImageData(g2, 0, 0);
      out.push({ dst: j.dst, uri: c2.toDataURL('image/png'), w: w2, h: h2 });
    }
  }
  const v = document.createElement('div');
  v.id = '${MK}';
  v.textContent = btoa(unescape(encodeURIComponent(JSON.stringify(out))));
  document.body.appendChild(v);
})();
` + '<' + '/script></body></html>';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-catw-'));
const f = path.join(tmp, 'bake.html');
fs.writeFileSync(f, html, 'utf8');
const exe = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome'
].filter(p => p && fs.existsSync(p))[0];
if (!exe) { console.error('ブラウザが無いので焼けない'); process.exit(2); }

const r = spawnSync(exe, ['--headless=new', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=20000',
                          '--dump-dom', 'file:///' + f.replace(/\\/g, '/')],
                    { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 180000, windowsHide: true });
fs.rmSync(tmp, { recursive: true, force: true });
const m = new RegExp('<div id="' + MK + '">([A-Za-z0-9+/=]+)</div>').exec(String(r.stdout || ''));
if (!m) { console.error('焼けた絵を取り出せない'); process.exit(1); }

JSON.parse(Buffer.from(m[1], 'base64').toString('utf8')).forEach(o => {
  const b = Buffer.from(o.uri.split(',')[1], 'base64');
  fs.writeFileSync(path.join(ROOT, o.dst), b);
  console.log('焼いた : ' + o.dst.padEnd(22) + o.w + 'x' + o.h + '  ' + Math.round(b.length / 1024) + 'KB');
});
