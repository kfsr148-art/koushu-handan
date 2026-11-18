// 公開の荷（pack-site.js が _site/ に組む物）の内訳を、HEAD の木から数える（写しはしない）。2026-11-18 丙の枠④。
'use strict';
const cp = require('child_process'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { isManaged, readManifest } = require(path.join(ROOT, 'pack-site.js'));
const src = require('fs').readFileSync(path.join(ROOT, 'pack-site.js'), 'utf8');
const SKIP_TOP = new Set(eval(src.match(/SKIP_TOP = new Set\((\[[^\]]*\])\)/)[1]));
const man = readManifest();
const out = cp.execFileSync('git', ['-C', ROOT, 'ls-tree', '-r', '-l', 'HEAD'], { maxBuffer: 1 << 28 }).toString().split('\n').filter(Boolean);
const cat = {}; let tot = 0, n = 0;
function add(k, s) { if (!cat[k]) { cat[k] = [0, 0]; } cat[k][0]++; cat[k][1] += s; }
out.forEach(l => {
  const m = l.match(/^\S+ blob \S+\s+(\d+)\t(.+)$/); if (!m) { return; }
  const size = +m[1], rel = m[2], name = rel.split('/').pop(), top = rel.split('/')[0];
  if (rel.includes('/') && SKIP_TOP.has(top)) { return; }
  if (!rel.includes('/') && SKIP_TOP.has(name)) { return; }
  if (/^reports\//.test(rel) && /\.(wav(\.wav)?|m4a)$/.test(name)) { return; }
  if (rel === name && isManaged(name) && !man.has(name)) { return; }
  n++; tot += size;
  let k;
  if (rel === name && /^advy-/.test(name)) { k = '声：方言の声 advy-*'; }
  else if (rel === name && /^advx-/.test(name)) { k = '声：advx-*'; }
  else if (rel === name && /\.(m4a|wav|mp3|ogg)$/.test(name)) { k = '声：その他の直下の声'; }
  else if (/\.(png|jpe?g|gif|webp)$/i.test(name)) { k = '絵（' + (rel.includes('/') ? top + '/' : '直下') + '）'; }
  else if (rel.includes('/')) { k = '道の下：' + top + '/'; }
  else { k = '直下：' + (path.extname(name) || '拡張子なし'); }
  add(k, size);
});
console.log('公開の荷（HEAD の木から）：' + n + '本・' + Math.round(tot / 1048576) + 'MB');
Object.entries(cat).sort((a, b) => b[1][1] - a[1][1]).slice(0, 25).forEach(([k, v]) => console.log('  ' + k + '：' + v[0] + '本・' + (v[1] / 1048576).toFixed(1) + 'MB'));
