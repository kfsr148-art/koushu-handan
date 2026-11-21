#!/usr/bin/env node
/* advice-441.js — 口調表（reports/kuchou-441.tsv）の 63行×7種＋大物の一言・惜しむ一言を、核（advice-tone-core.js）の組み立てと一字ずつ比べる（2026-11-21・段1）。
   ＊node だけ・数秒。ブラウザも通知も使わない。本体は check.js が「核の写し」を見張るので、核で合えば本体の ADV_TONE の中も同じ字。
   ＊種類の行：表の部品id の字を advTalk([[部品]], 人格, 方言) に一つだけ通した字 と 表の「入れる字」を比べる（幼児は頭と終わりの「ばぶ」を外して比べる）。
   ＊大物・惜しむの行：advBigLine の字を頭に置いた一行を advTalk に通した字と比べる。幼児は、大物の一言が頭の「ばぶ」を替えているか（頭に「ばぶー。」等が残らないか）も見る。
   ＊呼び名（大阪の執事の「、だんさん」等）は話の最後の文に一度だけ付くので、比べる時は外す。
   ＊いま入れ終えた人格（DONE）だけを合否に数え、ほかは「未実装」として別に数える。
   使い方：node advice-441.js [--all]（--all＝未実装の食い違いも全部出す）。執事の食い違いが1つでもあれば終了コード1。 */
'use strict';
const fs = require('fs'), path = require('path');
global.ADV_TEXT = require('./voice-advice-catalog.js').T;
const C = require('./advice-tone-core.js');
const DONE = ['butler'];
const ALL = process.argv.indexOf('--all') >= 0;
const rows = fs.readFileSync(path.join(__dirname, 'reports', 'kuchou-441.tsv'), 'utf8').split(/\r?\n/).filter(Boolean).map(function (l) { return l.split('\t'); });
const head = rows.shift(), col = {}; head.forEach(function (h, i) { col[h] = i; });
const strip = function (s) { return String(s).replace(/^(ばぶー。|ばぶばぶ。|ばぶ。)/, '').replace(/(ばぶー。|ばぶ。)$/, ''); };
const stat = {}; const bad = [];
rows.forEach(function (r) {
  const tone = r[col['人格']], dial = r[col['方言']] === 'std' ? '' : r[col['方言']], kind = r[col['種類']], id = r[col['部品id']];
  const want = r[col['入れる字']];
  let got = '', note = '';
  if (kind === '大物' || kind === '惜しむ') {
    const big = C.advBigLine(tone, dial, kind === '大物');
    if (big) {
      const t = C.advTalk([[{ t: big, lit: true, term: false }]], tone, dial, false).text;
      got = t;
      const pd = (C.ADV_PERSONA_DIAL[tone] || {})[dial || 'std'] || {};
      if (pd.bigHead && t.indexOf(big) !== 0) { note = '頭の「ばぶ」が替わっていない'; }
    }
  } else {
    const t = id && id !== '?' ? C.advToneText(tone, id) : '';
    if (t) { got = C.advTalk([[{ t: t, term: /[。！？]$/.test(t), id: id }]], tone, dial, true).text; }
    else { note = '部品の字が無い（' + id + '）'; }
  }
  // 呼び名（「、だんさん」等）は話の最後の文に一度だけ付く物なので、比べる時は外す
  const pdx = (C.ADV_PERSONA_DIAL[tone] || {})[dial || 'std'] || {}, ch = dial && C.ADV_CHARA[dial] ? (C.ADV_CHARA[dial][tone] || {}) : {};
  const addr = [pdx.c, ch.c].filter(Boolean);
  const unaddr = function (s) { addr.forEach(function (a) { s = s.replace(new RegExp('、' + a + '(?=[。！？]$)'), ''); }); return s; };
  const ok = !note && unaddr(strip(got)) === unaddr(strip(want));
  const grp = DONE.indexOf(tone) >= 0 ? tone : '未実装';
  const s = stat[grp] || (stat[grp] = { n: 0, ok: 0 }); s.n++; if (ok) { s.ok++; }
  if (!ok && (grp !== '未実装' || ALL)) { bad.push([grp, tone, r[col['方言']], kind, id, want, got, note].join(' | ')); }
});
// 未実装の人格の内訳（人格ごとの一致数）
const per = {};
rows.forEach(function (r) { const t = r[col['人格']]; if (DONE.indexOf(t) < 0) { per[t] = (per[t] || 0) + 1; } });
Object.keys(stat).forEach(function (g) { console.log(g + '：' + stat[g].ok + '／' + stat[g].n + ' 一致・食い違い ' + (stat[g].n - stat[g].ok)); });
console.log('未実装の人格：' + Object.keys(per).map(function (t) { return t + ' ' + per[t] + '行'; }).join('・'));
if (bad.length) { console.log('--- 食い違い（組・人格・方言・種類・部品id・表の字・核の字・注）'); bad.forEach(function (b) { console.log(b); }); }
const fail = DONE.some(function (g) { return stat[g] && stat[g].ok !== stat[g].n; });
process.exit(fail ? 1 : 0);
