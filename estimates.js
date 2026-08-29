#!/usr/bin/env node
/* ============================================================
   estimates.js — 過去の作業の所要時間を実測から集め、estimates.json を書く
   ============================================================
   ＊何を測るか … 報告を押し出した commit の刻の**間隔**。
     一つの窓で順に片付けているので、「前の報告を出してから次の報告を出すまで」が
     その一件に掛かった刻になる（枠を待っていた間も含む＝多めに出る）。

   ＊なぜ台帳の刻を使わないか … 台帳（orders-open.tsv）の受領時刻は**手で打っている**。
     2026-08-29 に確かめたところ、機械の刻が 23:08 のとき台帳の最終行は 03:40 で、
     **約4時間半ずれていた**。手で打った刻は物差しに使えない。
     commit の刻は機械が打つので、こちらだけを使う。

   ＊系統 … 印の末尾の連番と枝を落とした名（「兎の攻守-4-2」→「兎の攻守」）。
   ＊種類 … 控え（reports/<印>.md）の中身から三つに分ける。
       本体   … 本体の版（v14xx）を上げた回
       パネル … panel の版（panel vNN）を上げた回で、本体は触っていない
       調べ   … どちらの版も上げていない回

   使い方
     node estimates.js            … estimates.json を書く
     node estimates.js --print    … 書かずに中身を出す
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DIR = path.join(__dirname, 'reports');
const OUT = path.join(__dirname, 'estimates.json');
const MIN_MIN = 1;      /* これ未満は数えない（同じ回の押し出し直し） */
const MAX_MIN = 240;    /* これを超える間隔は「離席」とみなして数えない */

function seriesOf(mark) {
  return String(mark).replace(/-\d+(-\d+)?$/, '').replace(/-\d+[a-z]$/, '').replace(/-\d+$/, '');
}
function kindOf(text) {
  /* ＊「本体には触っていない」と書いてある回は、版の字が出てきても本体ではない。
       控えの現況の行には必ず「本体v1431」が入るので、字の有無だけでは分けられない。 */
  const noBody = /本体（.{0,24}koushu-handan\.html.{0,4}）(は|には).{0,8}(触|書き換え)/.test(text)
              || /本体は無変更/.test(text)
              || /本体には触っていない/.test(text);
  if (!noBody && /data-ver|ver\.txt/.test(text)) { return '本体'; }
  if (/panel v\d+/.test(text)) { return 'パネル'; }
  return '調べ';
}
function median(a) {
  if (!a.length) { return null; }
  const s = a.slice().sort((x, y) => x - y);
  const i = Math.floor(s.length / 2);
  return s.length % 2 ? s[i] : Math.round((s[i - 1] + s[i]) / 2);
}

/* 控えの一覧（印の名）。長い名から先に当てる（「兎の攻守-4-2」が「兎の攻守-4」に食われないため） */
let marks = [];
try { marks = fs.readdirSync(DIR).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, '')); }
catch (e) { marks = []; }
marks.sort((a, b) => b.length - a.length);

/* 報告を押し出した commit を古い順に */
let log = '';
try {
  log = execFileSync('git', ['log', '--reverse', '--format=%cI|%s', '--', 'report-latest.md'],
                     { encoding: 'utf8', maxBuffer: 1 << 26 });
} catch (e) { log = ''; }
const commits = log.split(/\r?\n/).filter(l => l.indexOf('|') > 0).map(l => {
  const i = l.indexOf('|');
  return { t: Date.parse(l.slice(0, i)), subj: l.slice(i + 1) };
}).filter(c => !Number.isNaN(c.t));

const rows = [];
for (let i = 1; i < commits.length; i++) {
  const min = Math.round((commits[i].t - commits[i - 1].t) / 60000);
  if (min < MIN_MIN || min > MAX_MIN) { continue; }
  const subj = commits[i].subj;
  const mark = marks.find(m => subj.indexOf(m) === 0) || '';
  if (!mark) { continue; }              /* 印の分からない回は数えない */
  let text = '';
  try { text = fs.readFileSync(path.join(DIR, mark + '.md'), 'utf8'); } catch (e) { }
  rows.push({ mark: mark, series: seriesOf(mark), kind: kindOf(text), min: min,
              at: new Date(commits[i].t).toISOString() });
}

const bySeries = {}, byKind = {};
rows.forEach(r => {
  (bySeries[r.series] = bySeries[r.series] || []).push(r.min);
  (byKind[r.kind] = byKind[r.kind] || []).push(r.min);
});
const out = {
  at: new Date().toISOString(),
  note: '報告を押し出した commit の間隔。台帳の受領時刻は手打ちでずれるため使っていない',
  n: rows.length,
  all: median(rows.map(r => r.min)),
  series: {}, kind: {},
  rows: rows.slice().sort((a, b) => a.min - b.min)
};
Object.keys(bySeries).forEach(k => { out.series[k] = { n: bySeries[k].length, min: median(bySeries[k]) }; });
Object.keys(byKind).forEach(k => { out.kind[k] = { n: byKind[k].length, min: median(byKind[k]) }; });

if (process.argv.includes('--print')) {
  console.log('元にした件数 : ' + out.n + '件（全体の中央値 ' + out.all + '分）');
  console.log('');
  console.log(['系統', '件数', '中央値(分)'].join('\t'));
  Object.keys(out.series).sort().forEach(k => console.log([k, out.series[k].n, out.series[k].min].join('\t')));
  console.log('');
  console.log(['種類', '件数', '中央値(分)'].join('\t'));
  Object.keys(out.kind).sort().forEach(k => console.log([k, out.kind[k].n, out.kind[k].min].join('\t')));
  console.log('');
  console.log(['印', '系統', '種類', '分'].join('\t'));
  out.rows.forEach(r => console.log([r.mark, r.series, r.kind, r.min].join('\t')));
} else {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n', 'utf8');
  console.log('estimates.json を書いた : ' + out.n + '件・全体の中央値 ' + out.all + '分');
}
