#!/usr/bin/env node
/* 状態の一行を、一箇所で作る — state.json から組んで、報告書へ写す
 *
 * これまで、状態の一行は二箇所で別々に作られていた。
 *   ・state.json … 見張り（inbox-watch.ps1 の Publish-Status）が機械で書く
 *   ・report-latest.md の先頭 … こちらが手で書く
 * 二つがずれると、どちらが本当か分からなくなる。**値を作るのはここ一箇所**にして、
 * 報告書へはこの出力を写す。
 *
 * 回し方
 *   node state-line.js            状態の一行を出す
 *   node state-line.js --json     元にした値もあわせて出す
 *   node state-line.js --apply <報告書>   その報告書の先頭の状態行を、いまの値で書き換える
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const argv = process.argv.slice(2);
const has = k => argv.indexOf(k) >= 0;
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };

function read(f) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^﻿/, '')); }
  catch (e) { return null; }
}

const st = read('state.json');
const us = read('usage.json');

/* 状態の言葉は state.json の stat をそのまま使う。言い換えない。
   ＊「終わり」は報告書の側の言い方なので、手待ちのときだけそう読み替える。
     ここが唯一の読み替えで、ほかは state.json の字をそのまま出す。 */
function word(stat) {
  if (stat === '手待ち') { return '終わり'; }
  return stat || '不明';
}

function hhmm(sec) {
  if (!sec) { return '—'; }
  const d = new Date(sec * 1000);
  const p = n => String(n).padStart(2, '0');
  return p(d.getHours()) + ':' + p(d.getMinutes());
}

if (!st) {
  console.log('**状態：不明** — state.json が読めません');
  process.exit(1);
}

const line = '**状態：' + word(st.stat) + '** — '
           + (st.at ? new Date(st.at * 1000).toISOString().slice(0, 10).replace(/-/g, '-') : '')
           + ' ' + hhmm(st.at) + ' 時点';

if (has('--json')) {
  console.log(JSON.stringify({
    line,
    state: st.stat, subj: st.subj, at: st.at, atText: hhmm(st.at),
    watch: us && us.watch ? us.watch : null,
  }, null, 2));
  process.exit(0);
}

const target = arg('--apply', null);
if (target) {
  const p = path.join(ROOT, target);
  let s;
  try { s = fs.readFileSync(p, 'utf8'); }
  catch (e) { console.error('読めません: ' + target); process.exit(1); }
  /* 先頭の「**状態：…**」の一行だけを差し替える。無ければ題の次へ挿し込む。 */
  if (/^\*\*状態：.*$/m.test(s)) {
    s = s.replace(/^\*\*状態：.*$/m, () => line);
    console.log('先頭の状態行を書き換えました');
  } else {
    const i = s.indexOf('\n');
    s = s.slice(0, i + 1) + '\n' + line + '\n' + s.slice(i + 1);
    console.log('状態行が無かったので、題の次へ挿し込みました');
  }
  fs.writeFileSync(p, s, 'utf8');
  console.log('  ' + line);
  process.exit(0);
}

console.log(line);
