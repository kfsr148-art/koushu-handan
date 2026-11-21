#!/usr/bin/env node
/* v1513 の声が揃った後に、声の台本へ足す（2026-11-21・枠 三十三の声づくり）
   ＊voice-plan/v1513-add.json（名→字・1934本）を voice-advice-dial.json に足し（前の名は残す・名の順に並べ直す）、
     voice-advice-dial.txt を voice-plan/dial.txt と同じ中身にする（v1513 まで二つは一字も違わなかった）。
   ＊足す声が直下に一本でも無ければ、何も書かずに終了コード2で止まる（check.js が「台本の声が無い」で落ちるため）。
   ＊この後に  node pack-site.js --make-manifest  → node pack-site.js --verify  で voice-used.txt を作り直す。
   使い方  node scratchpad/jobs/v1513/merge-dial.js [--dry] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', '..');
const add = JSON.parse(fs.readFileSync(path.join(ROOT, 'voice-plan', 'v1513-add.json'), 'utf8'));
const lack = Object.keys(add).filter(k => !fs.existsSync(path.join(ROOT, k + '.m4a')));
console.log('足す声 ' + Object.keys(add).length + '本／直下に無い ' + lack.length + '本' + (lack.length ? '（例 ' + lack.slice(0, 3).join(', ') + '）' : ''));
if (lack.length) { console.log('声が揃っていないので書かない（voice-m4a.yml kind=dial をもう一度起こせば続きから作る）'); process.exit(2); }
const jp = path.join(ROOT, 'voice-advice-dial.json');
const old = JSON.parse(fs.readFileSync(jp, 'utf8'));
const m = Object.assign({}, old, add), o = {};
Object.keys(m).sort().forEach(k => { o[k] = m[k]; });
console.log('voice-advice-dial.json ' + Object.keys(old).length + '本 → ' + Object.keys(o).length + '本');
if (process.argv.indexOf('--dry') >= 0) { process.exit(0); }
fs.writeFileSync(jp, JSON.stringify(o));
fs.copyFileSync(path.join(ROOT, 'voice-plan', 'dial.txt'), path.join(ROOT, 'voice-advice-dial.txt'));
console.log('書いた：voice-advice-dial.json・voice-advice-dial.txt（= voice-plan/dial.txt）。次は node pack-site.js --make-manifest');
