#!/usr/bin/env node
/* ============================================================
   reports-index.js — reports/ の控えの一覧を組み、report-latest.md の末尾へ貼る
   ============================================================
   ＊控えは「印ごとの報告の写し」。report-latest.md は上書きで消えるので、
     印の名で reports/ に残し、あとから raw で読み直せるようにする。
   ＊同じ印で二度書くときは、ファイル名の末尾に -2・-3 …と付ける（呼ぶ側で決める）。

   使い方
     node reports-index.js            … 一覧を組んで report-latest.md の末尾へ貼る
     node reports-index.js --print    … 貼らずに一覧だけ出す
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'reports');
const LATEST = path.join(__dirname, 'report-latest.md');
const RAW = 'https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/';
const HEAD = '<!-- 控えの一覧 ここから -->';
const TAIL = '<!-- 控えの一覧 ここまで -->';
const KEEP = 20;

/* 控えの一行目（# で始まる題）を拾う。無ければ最初の中身のある行。 */
function titleOf(file) {
  const lines = fs.readFileSync(path.join(DIR, file), 'utf8').split(/\r?\n/);
  for (const l of lines) {
    const s = l.trim();
    if (s.startsWith('#')) { return s.replace(/^#+\s*/, ''); }
    if (s) { return s; }
  }
  return '(題なし)';
}

function build() {
  if (!fs.existsSync(DIR)) { return { text: '', n: 0, all: 0 }; }
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md'));
  /* 新しい順＝書き込みの刻の新しい順。同じ刻なら名前の逆順。 */
  files.sort((a, b) => {
    const ta = fs.statSync(path.join(DIR, a)).mtimeMs;
    const tb = fs.statSync(path.join(DIR, b)).mtimeMs;
    return tb - ta || (a < b ? 1 : -1);
  });
  const rows = files.slice(0, KEEP).map(f => {
    const d = new Date(fs.statSync(path.join(DIR, f)).mtimeMs);
    const p = n => String(n).padStart(2, '0');
    const when = p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    return '| [`' + f + '`](' + RAW + encodeURIComponent(f) + ') | ' + when + ' | ' + titleOf(f) + ' |';
  });
  const text = [
    HEAD, '',
    '## 控えの一覧（reports/・新しい順に' + KEEP + '件）',
    '',
    '＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。',
    '　ここに出るのは新しい' + KEEP + '件。全部で **' + files.length + '件**ある。',
    '　raw で読める（下の名を押すとその控えへ飛ぶ）。',
    '',
    '| 控え | 書いた刻 | 題 |',
    '|---|---|---|',
    ...rows,
    '',
    TAIL, ''
  ].join('\n');
  return { text, n: rows.length, all: files.length };
}

const r = build();
if (process.argv.includes('--print')) {
  console.log(r.text);
} else {
  let s = fs.existsSync(LATEST) ? fs.readFileSync(LATEST, 'utf8') : '';
  const i = s.indexOf(HEAD), j = s.indexOf(TAIL);
  if (i >= 0 && j > i) { s = s.slice(0, i) + s.slice(j + TAIL.length); }
  s = s.replace(/\s*$/, '\n') + '\n---\n\n' + r.text;
  fs.writeFileSync(LATEST, s, 'utf8');
  console.log('控えの一覧を report-latest.md の末尾へ貼った : ' + r.n + '件（全部で ' + r.all + '件）');
}
