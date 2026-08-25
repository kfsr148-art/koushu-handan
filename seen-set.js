#!/usr/bin/env node
/* 「ここまで読んだ」を置く — seen.json
 *
 * 返事パネルの札は、いままで「写す」を押したものだけが一覧から落ちていた。
 * チャットの側で state.json や報告書を直に読んで済ませた回は、押していないので
 * 札が残り続け、どれが未読か分からなくなる。その受け。
 *
 * seen.json は {at, upto} の二つだけを持つ。
 *   upto … この時刻（エポック秒）**以前**の札は読み終えたものとして扱う
 *   at   … この控えを書いた時刻。いつの判断かを後から見るため
 *
 * ＊この道具は Claude Code の側から使う。iPhone から直に書く道は無い。
 *   「◯◯まで読んだ」と伝えてもらえば、こちらがこれを回す。
 *
 * 回し方
 *   node seen-set.js                      いまの時刻までを読んだことにする
 *   node seen-set.js "2026-08-26 05:10"   その時刻までを読んだことにする
 *   node seen-set.js --title "😽"          その題を持つ**いちばん新しい**札までを読んだことにする
 *   node seen-set.js --show               いまの中身を出すだけ（書き換えない）
 *   node seen-set.js --clear              取り消す（upto を 0 に戻す）
 *
 * 書いたあと commit と push まで行う。--no-push を付ければ手元だけ。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const SEEN = path.join(ROOT, 'seen.json');
const NOTICES = path.join(ROOT, 'notices.json');
const argv = process.argv.slice(2);
const has = k => argv.indexOf(k) >= 0;
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };

const jst = t => new Date(t * 1000).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

function read() {
  try { return JSON.parse(fs.readFileSync(SEEN, 'utf8').replace(/^﻿/, '')); }
  catch (e) { return { at: 0, upto: 0 }; }
}

function notices() {
  try { return JSON.parse(fs.readFileSync(NOTICES, 'utf8').replace(/^﻿/, '')) || []; }
  catch (e) { return []; }
}

/* 「2026-08-26 05:10」や「05:10」を刻へ直す。時刻だけなら今日の分として読む。 */
function toEpoch(s) {
  let m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s);
  if (m) {
    return Math.floor(new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)).getTime() / 1000);
  }
  m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s);
  if (m) {
    const n = new Date();
    return Math.floor(new Date(n.getFullYear(), n.getMonth(), n.getDate(),
                               +m[1], +m[2], +(m[3] || 0)).getTime() / 1000);
  }
  return null;
}

const cur = read();

if (has('--show')) {
  console.log('seen.json');
  console.log('  upto : ' + (cur.upto ? cur.upto + '（' + jst(cur.upto) + '）' : '0（取り消し済み）'));
  console.log('  at   : ' + (cur.at ? cur.at + '（' + jst(cur.at) + '）' : '—'));
  const left = notices().filter(n => !cur.upto || (n.time || 0) > cur.upto);
  console.log('  この時刻より新しい札 : ' + left.length + ' 件');
  left.slice(0, 5).forEach(n => console.log('    ' + jst(n.time) + '  ' + (n.title || '')));
  process.exit(0);
}

let upto;
if (has('--clear')) {
  upto = 0;
} else if (has('--title')) {
  const t = String(arg('--title', ''));
  const hit = notices().filter(n => String(n.title || '').indexOf(t) >= 0)
                       .sort((a, b) => (b.time || 0) - (a.time || 0))[0];
  if (!hit) { console.error('その題の札が見つかりません: ' + t); process.exit(1); }
  upto = hit.time;
  console.log('見つけた札 : ' + jst(hit.time) + '  ' + hit.title);
} else {
  const free = argv.filter(a => a.indexOf('--') !== 0);
  if (free.length) {
    upto = toEpoch(free.join(' ').trim());
    if (upto === null) { console.error('時刻の形が読めません: ' + free.join(' ')); process.exit(1); }
  } else {
    upto = Math.floor(Date.now() / 1000);
  }
}

/* この操作で新たに片付く札を、名前を挙げて出す（2026-08-26）。
   ＊いちばん危ういのは「見ていない札を巻き込む」こと。時刻で切るので、
     直前に届いたばかりの札まで読んだことにしてしまう窓がある。
   ＊黙って消さない。何が片付くかを毎回並べる。取り違えたら --clear で戻せる。
   ＊パネル側でも消えはせず「写した札」の箱へ入る（青い「チャットで読んだ」の印つき）。 */
const before = cur.upto || 0;
const newly = notices()
  .filter(n => (n.time || 0) > before && upto && (n.time || 0) <= upto)
  .sort((a, b) => (b.time || 0) - (a.time || 0));
if (newly.length) {
  console.log('この操作で新たに片付く札 ' + newly.length + ' 件');
  newly.forEach(n => console.log('  ' + jst(n.time) + '  ' + (n.title || '')));
} else if (upto) {
  console.log('この操作で新たに片付く札はありません（既に片付いているか、対象が無い）');
}

const out = { at: Math.floor(Date.now() / 1000), upto };
fs.writeFileSync(SEEN, JSON.stringify(out, null, 2) + '\n', 'utf8');

const left = notices().filter(n => !upto || (n.time || 0) > upto);
console.log('seen.json を書いた');
console.log('  upto : ' + (upto ? upto + '（' + jst(upto) + '）' : '0（取り消し）'));
console.log('  残る札 : ' + left.length + ' 件' + (left.length ? '（いちばん古いのは ' + jst(left[left.length - 1].time) + '）' : ''));

if (has('--no-push')) { console.log('  ＊--no-push なので手元だけ'); process.exit(0); }

/* 押し出しは見張りと同じ形にする。commit には道を名指しし、検査は掛けない。 */
try {
  const git = (...a) => execFileSync('git', ['-C', ROOT, ...a], { stdio: 'pipe' });
  git('add', 'seen.json');
  try { git('commit', '--no-verify', '-q', '-m', 'seen.json：ここまで読んだ', '--', 'seen.json'); }
  catch (e) { console.log('  ＊commit するものが無い（中身が同じ）'); }
  git('push', '--no-verify', '-q', 'origin', 'main');
  console.log('  push した');
} catch (e) {
  console.log('  ＊push で失敗: ' + String(e.message || e).split('\n')[0].slice(0, 120));
  console.log('    手元には書けているので、次の押し出しで一緒に運ばれます');
}
