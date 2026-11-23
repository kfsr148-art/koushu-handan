#!/usr/bin/env node
/* v1522/append-dial.js — 雲の洗い出し（reports/v1522-voice-plan/）を声の台本 voice-plan/dial.txt の末尾へ足す（手元で回す・数秒）
   ＊reports/v1522-voice-plan/add.json を voice-plan/v1522-add.json へ写し、dial-add.txt の行を dial.txt の末尾へ（区切りの注釈1行を付けて）足す。
   ＊もう dial.txt に在る名は足さない（二度回しても増えない）。dial.txt は CRLF のまま。
   ＊この後  git add voice-plan/ → commit・push（~/.claude/push-mine.ps1）→ gh workflow run voice-m4a.yml -f kind=dial
   使い方  node scratchpad/jobs/v1522/append-dial.js [--dry] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', '..');
const SRC = path.join(ROOT, 'reports', 'v1522-voice-plan');
const add = JSON.parse(fs.readFileSync(path.join(SRC, 'add.json'), 'utf8'));
const rows = fs.readFileSync(path.join(SRC, 'dial-add.txt'), 'utf8').split(/\r?\n/).filter(Boolean);
const dp = path.join(ROOT, 'voice-plan', 'dial.txt');
const cur = fs.readFileSync(dp, 'utf8');
const have = new Set(cur.split(/\r?\n/).filter(l => l && l[0] !== '#').map(l => l.split('\t')[0]));
const put = rows.filter(l => !have.has(l.split('\t')[0]));
console.log('足す声 ' + Object.keys(add).length + '本／行 ' + rows.length + '／dial.txt に無い ' + put.length + '本');
if (process.argv.indexOf('--dry') >= 0 || !put.length) { process.exit(0); }
const head = '# v1522 の足し（守りの線・棚 #4。守りだけ全組み合わせで新しく要る声 ' + put.length + '本）。名→字は voice-plan/v1522-add.json。scratchpad/jobs/v1522-voice-plan.js（雲）で洗い出した';
fs.writeFileSync(dp, cur + (cur.endsWith('\n') ? '' : '\r\n') + head + '\r\n' + put.join('\r\n') + '\r\n');
fs.writeFileSync(path.join(ROOT, 'voice-plan', 'v1522-add.json'), JSON.stringify(add));
console.log('書いた：voice-plan/dial.txt（+' + (put.length + 1) + '行）・voice-plan/v1522-add.json');
