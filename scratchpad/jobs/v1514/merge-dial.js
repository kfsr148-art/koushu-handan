#!/usr/bin/env node
/* v1514 の声が揃った後に、声の台本へ足す（v1513/merge-dial.js の写し・2026-11-21・枠 四十三の声づくり）
   ＊voice-plan/v1514-add.json（名→字）を voice-advice-dial.json に足し（前の名は残す・名の順に並べ直す）、
     voice-advice-dial.txt を voice-plan/dial.txt と同じ中身にする。
   ＊足す声が直下に一本でも無ければ、何も書かずに終了コード2で止まる（check.js が「台本の声が無い」で落ちるため）。
   ＊部品の声 28本（advd-sen ほか・voice-plan/parts.txt）は台帳 voice-advice-catalog.js から出るので、ここでは足さない。直下に在るかだけ見る。
   ＊この後に  node pack-site.js --make-manifest  → node pack-site.js --verify  で voice-used.txt を作り直す。
   使い方  node scratchpad/jobs/v1514/merge-dial.js [--dry] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', '..');
const add = JSON.parse(fs.readFileSync(path.join(ROOT, 'voice-plan', 'v1514-add.json'), 'utf8'));
const lack = Object.keys(add).filter(k => !fs.existsSync(path.join(ROOT, k + '.m4a')));
const PARTS = ['advd-sen', 'advd-sen-s', 'advd-s-sobat', 'advd-s-jihaio'];
const partNames = PARTS.slice(); ['butler', 'strategist', 'lady', 'french', 'ichihime', 'sensei'].forEach(t => PARTS.forEach(p => partNames.push('advx-' + t + '-' + p)));
const lackP = partNames.filter(k => !fs.existsSync(path.join(ROOT, k + '.m4a')));
console.log('足す声 ' + Object.keys(add).length + '本／直下に無い ' + lack.length + '本' + (lack.length ? '（例 ' + lack.slice(0, 3).join(', ') + '）' : '') + '／部品の声 ' + partNames.length + '本のうち直下に無い ' + lackP.length + '本');
if (lack.length || lackP.length) { console.log('声が揃っていないので書かない（voice-m4a.yml kind=dial／kind=parts をもう一度起こせば続きから作る）'); process.exit(2); }
const jp = path.join(ROOT, 'voice-advice-dial.json');
const old = JSON.parse(fs.readFileSync(jp, 'utf8'));
const m = Object.assign({}, old, add), o = {};
Object.keys(m).sort().forEach(k => { o[k] = m[k]; });
console.log('voice-advice-dial.json ' + Object.keys(old).length + '本 → ' + Object.keys(o).length + '本');
if (process.argv.indexOf('--dry') >= 0) { process.exit(0); }
fs.writeFileSync(jp, JSON.stringify(o));
fs.copyFileSync(path.join(ROOT, 'voice-plan', 'dial.txt'), path.join(ROOT, 'voice-advice-dial.txt'));
console.log('書いた：voice-advice-dial.json・voice-advice-dial.txt（= voice-plan/dial.txt）。次は node pack-site.js --make-manifest');
