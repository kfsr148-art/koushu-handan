#!/usr/bin/env node
/* shelf5/parts-plan.js — 棚 #5 で字が変わった部品・新しい部品の声を voice-plan/parts.txt に載せる（手元・数秒・2026-11-24）
   ＊読みは voice-advice.txt（node voice-advice-catalog.js が台帳から組む・SAY 込み）から取る。字は台帳が正本。
   ＊parts.txt に同じ名の行が在れば、その行の読みを書き替える（同じ名が二行あると雲の分担が二つで同じ声を作り、どちらが残るか決まらないため）。
     無ければ末尾に区切りの注釈と一緒に足す。CRLF のまま。二度回しても増えない。
   ＊同じ名の古い声（直下と reports/voice-m4a-out の .m4a）が在る間は、雲（tools/voice-m4a.js）は「もう在る」とみなして作らない。消すのは呼び元が決める（--list で名を出す）。
   使い方  node scratchpad/jobs/shelf5/parts-plan.js [--dry] [--list] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', '..');
const NAMES = ['adva-weak', ...['035', '036', '039', '067', '068', '098', '099', '100', '101', '102', '103', '104'].map(n => 'advx-lady-advw-w' + n),
  ...['butler', 'strategist', 'lady', 'french', 'ichihime', 'sensei'].map(t => 'advx-' + t + '-adva-weak'),
  /* 棚 #9（2026-11-24）：七文 K1〜K7＝adva-yk-1〜7（ずんだの標準の声）と人格6人ぶん */
  ...[1, 2, 3, 4, 5, 6, 7].map(n => 'adva-yk-' + n), ...['butler', 'strategist', 'lady', 'french', 'ichihime', 'sensei'].flatMap(t => [1, 2, 3, 4, 5, 6, 7].map(n => 'advx-' + t + '-adva-yk-' + n))];
const say = {};
fs.readFileSync(path.join(ROOT, 'voice-advice.txt'), 'utf8').split(/\r?\n/).forEach(l => { if (!l || l[0] === '#') { return; } const c = l.split('\t'); say[c[0].replace(/\.wav\.wav$/, '')] = c[c.length - 1]; });
const lack = NAMES.filter(n => !say[n]);
if (lack.length) { console.error('voice-advice.txt に無い名：' + lack.join(', ') + '（先に node voice-advice-catalog.js）'); process.exit(2); }
const pp = path.join(ROOT, 'voice-plan', 'parts.txt');
const rows = fs.readFileSync(pp, 'utf8').split('\r\n');
let rep = 0, same = 0; const seen = new Set();
rows.forEach((l, i) => { if (!l || l[0] === '#') { return; } const c = l.split('\t'), n = c[0].replace(/\.wav\.wav$/, ''); if (NAMES.indexOf(n) < 0) { return; } if (seen.has(n)) { console.error('parts.txt に同じ名が二行：' + n); process.exit(3); } seen.add(n); if (c[1] === say[n]) { same++; } else { rows[i] = c[0] + '\t' + say[n]; rep++; } });
const add = NAMES.filter(n => !seen.has(n));
console.log('部品 ' + NAMES.length + '本：parts.txt の行を書き替える ' + rep + '・そのまま ' + same + '・末尾に足す ' + add.length);
if (process.argv.indexOf('--list') >= 0) {
  const old = []; NAMES.forEach(n => [n + '.m4a', 'reports/voice-m4a-out/' + n + '.m4a'].forEach(f => { if (fs.existsSync(path.join(ROOT, f))) { old.push(f); } }));
  console.log('雲が作り直すために先に外す古い声 ' + old.length + '本：\n' + old.join('\n'));
}
if (process.argv.indexOf('--dry') >= 0 || (!rep && !add.length)) { process.exit(0); }
let out = rows.join('\r\n');
if (add.length) { if (!out.endsWith('\r\n')) { out += '\r\n'; } out += '# 棚 #5 の足し（2026-11-24：adva-weak を一文に・人格6人の adva-weak・お嬢様の言い伝え12本の字直し。読みは voice-advice.txt）\r\n' + add.map(n => n + '.wav.wav\t' + say[n]).join('\r\n') + '\r\n'; }
fs.writeFileSync(pp, out);
console.log('書いた：voice-plan/parts.txt');
