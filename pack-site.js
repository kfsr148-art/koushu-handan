#!/usr/bin/env node
/* pack-site.js — 公開（GitHub Pages）に載せる荷を _site/ に組む（2026-11-17・y1117-1900 のヨシ）
   ＊目的：公開の大きさを 1GB（Pages の上限）より十分手前に保つ。置き場（リポジトリ）は分けない。
   ＊載せる物：リポジトリの中身のうち、次を除いた全部。
       ①作りかけの声（reports/ の下の .wav／.wav.wav。reports/voice-advice-out・voice-advice-dial-out など）
       ②今使わない古い声・まだ使わない新しい声（advy-…・advx-… の声のうち、台帳 voice-used.txt に無い物）
       ③.git・.github・node_modules・scratchpad・_site（公開に要らない物）
   ＊voice-used.txt は「本体が今使う声」の台帳。本体を出す回（v番号を上げる回）に、台本から作り直して一緒に commit する
     （node pack-site.js --make-manifest）。声づくりの途中で台本だけ先に進んでも、台帳が古いままなので、今の本体が使う声は公開から落ちない。
   使い方  node pack-site.js            … _site/ を作る（件数・大きさを出す。大きさは site-size.txt にも書く）
           node pack-site.js --make-manifest [dial.json] [voice-advice.txt] … voice-used.txt を作り直す
           node pack-site.js --verify   … voice-used.txt の名が全部、直下に実在するかだけを見る */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = __dirname, OUT = process.env.PACK_OUT || path.join(ROOT, '_site');
const MANAGED = /^(advy|advx)-.*\.(wav\.wav|m4a)$/;   // 台帳で絞る声（方言の声・人格の部品の声）。v1506 から声は m4a（AAC）。古い .wav.wav も台帳に無ければ載せない
const SKIP_TOP = new Set(['.git', '.github', 'node_modules', 'scratchpad', '_site', 'reports', 'shots']);   // 枠 二百六十七（本人の答え y1124-2117）：記録（reports/）と画面写し（shots/）は公開に載せない（ツールに要らない物・約50MB）。直下の .tsv も外す（下の walk）
const isManaged = f => MANAGED.test(f);
function readManifest() {
  const p = path.join(ROOT, 'voice-used.txt');
  if (!fs.existsSync(p)) { return null; }
  return new Set(fs.readFileSync(p, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean));
}
function makeManifest(dialJson, advTxt) {
  const names = new Set();
  const d = JSON.parse(fs.readFileSync(dialJson || path.join(ROOT, 'voice-advice-dial.json'), 'utf8'));
  Object.keys(d).forEach(k => names.add(k.replace(/[.]wav[.]wav$/, '') + '.m4a'));   // v1506：声の名は .m4a
  fs.readFileSync(advTxt || path.join(ROOT, 'voice-advice.txt'), 'utf8').split(/\r?\n/).forEach(l => { if (!l || l[0] === '#') { return; } const n = l.split('\t')[0].replace(/[.]wav[.]wav$/, '') + '.m4a'; if (isManaged(n)) { names.add(n); } });
  fs.writeFileSync(path.join(ROOT, 'voice-used.txt'), [...names].sort().join('\n') + '\n');
  return names.size;
}
function walk(dir, rel, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const r = rel ? rel + '/' + e.name : e.name;
    if (!rel && SKIP_TOP.has(e.name)) { return; }
    if (e.isDirectory()) { walk(path.join(dir, e.name), r, cb); } else if (e.isFile()) { cb(path.join(dir, e.name), r, e.name); }
  });
}
const DRY = process.argv.indexOf('--dry') >= 0;
function pack() {
  const man = readManifest();
  if (!man) { console.error('voice-used.txt が無い'); process.exit(1); }
  if (!DRY) { fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true }); }
  const parts = { advy: { n: 0, b: 0 }, advx: { n: 0, b: 0 }, html: { n: 0, b: 0 }, other: { n: 0, b: 0 } };   // 枠 二百七十三：公開の内訳（声・本体と画面・ほか）
  let skipTsv = 0, skipTsvBytes = 0; let n = 0, bytes = 0, skipReports = 0, skipManaged = 0, skipManagedBytes = 0, skipReportsBytes = 0; const have = new Set();
  walk(ROOT, '', (full, rel, name) => {
    const size = fs.statSync(full).size;
    if (/^reports\//.test(rel) && /\.(wav(\.wav)?|m4a)$/.test(name)) { skipReports++; skipReportsBytes += size; return; }
    if (rel === name && /\.tsv$/.test(name)) { skipTsv++; skipTsvBytes += size; return; }   // 直下の記録（.tsv）は公開に載せない
    if (rel === name && isManaged(name)) { if (!man.has(name)) { skipManaged++; skipManagedBytes += size; return; } have.add(name); }
    const kind = /^advy-/.test(name) && rel === name ? 'advy' : (/^advx-/.test(name) && rel === name ? 'advx' : (/^(koushu-handan|panel)\.html$/.test(rel) ? 'html' : 'other')); parts[kind].n++; parts[kind].b += size;
    if (!DRY) { const to = path.join(OUT, rel); fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(full, to); }
    n++; bytes += size;
  });
  const missing = [...man].filter(x => !have.has(x));
  const mb = Math.round(bytes / 1048576);
  console.log('公開の荷：' + n + '本・' + mb + 'MB（上限の目安 1024MB）');
  console.log('載せなかった物：作りかけの声 ' + skipReports + '本・' + Math.round(skipReportsBytes / 1048576) + 'MB／台帳に無い advy-・advx- の声 ' + skipManaged + '本・' + Math.round(skipManagedBytes / 1048576) + 'MB');
  console.log('載せなかった物（記録）：直下の .tsv ' + skipTsv + '本・' + Math.round(skipTsvBytes / 1048576) + 'MB／reports/・shots/ は丸ごと載せない');
  console.log('台帳の声 ' + man.size + '本のうち、荷に入った ' + have.size + '本／直下に無い ' + missing.length + '本');
  const mbOf = o => Math.round(o.b / 1048576 * 10) / 10;
  const info = { at: Math.floor(Date.now() / 1000), mb: mb, n: n, limit: 1024, voices: { advy: { n: parts.advy.n, mb: mbOf(parts.advy) }, advx: { n: parts.advx.n, mb: mbOf(parts.advx) } }, html: { n: parts.html.n, mb: mbOf(parts.html) }, other: { n: parts.other.n, mb: mbOf(parts.other) }, prevMb: null, prevAt: null };
  try { const prev = JSON.parse(String(require('child_process').execFileSync('curl', ['-s', '--max-time', '10', 'https://kfsr148-art.github.io/koushu-handan/site-size.json?x=' + Date.now()], { encoding: 'utf8', timeout: 15000 }))); if (prev && typeof prev.mb === 'number') { info.prevMb = prev.mb; info.prevAt = prev.at || null; } } catch (e) { /* 取れなければ増え分は出さない */ }
  if (!DRY) { fs.writeFileSync(path.join(OUT, 'site-size.json'), JSON.stringify(info)); }
  console.log('内訳：方言の声 ' + parts.advy.n + '本 ' + mbOf(parts.advy) + 'MB・人格の声 ' + parts.advx.n + '本 ' + mbOf(parts.advx) + 'MB・本体と画面の html ' + mbOf(parts.html) + 'MB・ほか ' + parts.other.n + '本 ' + mbOf(parts.other) + 'MB' + (info.prevMb !== null ? '／前の配信 ' + info.prevMb + 'MB から ' + (mb - info.prevMb) + 'MB' : ''));
  if (!DRY) { fs.writeFileSync(path.join(ROOT, 'site-size.txt'), mb + '\n'); }
  if (missing.length) { console.error('台帳の声が直下に無い（荷から欠ける）：' + missing.slice(0, 5).join(', ')); process.exit(2); }
}
module.exports = { isManaged, readManifest };
if (require.main === module) {
  const a = process.argv.slice(2);
  if (a[0] === '--make-manifest') { console.log('voice-used.txt ' + makeManifest(a[1], a[2]) + '本'); }
  else if (a[0] === '--verify') {
    const man = readManifest(); if (!man) { console.error('voice-used.txt が無い'); process.exit(1); }
    const miss = [...man].filter(x => !fs.existsSync(path.join(ROOT, x))); console.log('台帳 ' + man.size + '本／直下に無い ' + miss.length + '本'); process.exit(miss.length ? 2 : 0);
  } else { pack(); }
}
