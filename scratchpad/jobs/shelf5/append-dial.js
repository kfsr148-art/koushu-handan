#!/usr/bin/env node
/* shelf5/append-dial.js — 雲の洗い出し（reports/shelf5-voice-plan/）を声の台本 voice-plan/dial.txt の末尾へ足す（手元で回す・数秒・v1522/append-dial.js の写し）
   ＊reports/shelf5-voice-plan/add.json を voice-plan/shelf5-add.json へ写し、dial-add.txt の行を dial.txt の末尾へ（区切りの注釈1行を付けて）足す。
   ＊もう dial.txt に在る名は足さない（二度回しても増えない）。dial.txt は CRLF のまま。
   ＊この後 voice-plan/ を commit・push（~/.claude/push-mine.ps1）→ voice-m4a.yml を kind=dial で起こす
   使い方  node scratchpad/jobs/shelf5/append-dial.js [--dry] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', '..');
const SRC = path.join(ROOT, 'reports', 'shelf5-voice-plan');
const add = JSON.parse(fs.readFileSync(path.join(SRC, 'add.json'), 'utf8'));
const rows = fs.readFileSync(path.join(SRC, 'dial-add.txt'), 'utf8').split(/\r?\n/).filter(Boolean);
const dp = path.join(ROOT, 'voice-plan', 'dial.txt');
const cur = fs.readFileSync(dp, 'utf8');
const have = new Set(cur.split(/\r?\n/).filter(l => l && l[0] !== '#').map(l => l.split('\t')[0]));
const put = rows.filter(l => !have.has(l.split('\t')[0]));
const paren = put.filter(l => /[（）]/.test(l.split('\t')[1] || '')).length, empty = put.filter(l => !(l.split('\t')[1])).length;
console.log('足す声 ' + Object.keys(add).length + '本／行 ' + rows.length + '／dial.txt に無い ' + put.length + '本（読みの括弧 ' + paren + '・空 ' + empty + '）');
if (paren || empty) { console.error('読みに括弧か空がある（say() を通していない）ので書かない'); process.exit(2); }
if (process.argv.indexOf('--dry') >= 0 || !put.length) { process.exit(0); }
const head = '# 棚 #5 の足し（2026-11-24・字の磨き：adva-weak を一文に・軍師の方言・お嬢様の言い伝えほか。攻め守りの全組み合わせで新しく要る声 ' + put.length + '本）。名→字は voice-plan/shelf5-add.json。scratchpad/jobs/shelf5-voice-plan.js（雲）で洗い出した';
fs.writeFileSync(dp, cur + (cur.endsWith('\n') ? '' : '\r\n') + head + '\r\n' + put.join('\r\n') + '\r\n');
fs.writeFileSync(path.join(ROOT, 'voice-plan', 'shelf5-add.json'), JSON.stringify(add));
console.log('書いた：voice-plan/dial.txt（+' + (put.length + 1) + '行）・voice-plan/shelf5-add.json');
