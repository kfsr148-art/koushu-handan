#!/usr/bin/env node
/* shelf5/merge-dial.js — 棚 #5 の声が揃った後に、声の台本へ足す（v1522/merge-dial.js の写し・2026-11-24）
   ＊voice-plan/m1537-add.json（名→字）を voice-advice-dial.json に足し（前の名は残す・名の順に並べ直す）、
     voice-advice-dial.txt を voice-plan/dial.txt と同じ中身にする。
   ＊足す声が直下に一本でも無ければ、何も書かずに終了コード2で止まる（check.js が「台本の声が無い」で落ちるため）。
   ＊部品の声 19本（adva-weak・人格6人の adva-weak・お嬢様の言い伝え12本）は台帳 voice-advice-catalog.js から出るので、ここでは足さない。
     直下に在るかと、字を直した13本が直下で作り直されたか（git の HEAD の物と中身が違うか）は scratchpad/jobs/shelf5/parts-plan.js と目で見る。ここでは在るかだけ見る。
   ＊この後に  node pack-site.js --make-manifest  → node pack-site.js --verify  で voice-used.txt を作り直す。
   使い方  node scratchpad/jobs/shelf5/merge-dial.js [--dry] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', '..');
const add = JSON.parse(fs.readFileSync(path.join(ROOT, 'voice-plan', 'm1537-add.json'), 'utf8'));
const lack = Object.keys(add).filter(k => !fs.existsSync(path.join(ROOT, k + '.m4a')));
const partNames = ["advx-butler-advd-e-far","advx-butler-advd-e-cheap","advx-butler-advd-e-shape","advx-butler-advd-e-honor","advx-butler-advd-e-few","advx-butler-advd-e-pair","advx-strategist-advd-e-far","advx-strategist-advd-e-cheap","advx-strategist-advd-e-shape","advx-strategist-advd-e-honor","advx-strategist-advd-e-few","advx-strategist-advd-e-pair","advx-lady-advd-e-far","advx-lady-advd-e-cheap","advx-lady-advd-e-shape","advx-lady-advd-e-honor","advx-lady-advd-e-few","advx-lady-advd-e-pair","advx-french-advd-e-far","advx-french-advd-e-cheap","advx-french-advd-e-shape","advx-french-advd-e-honor","advx-french-advd-e-few","advx-french-advd-e-pair","advx-ichihime-advd-e-far","advx-ichihime-advd-e-cheap","advx-ichihime-advd-e-shape","advx-ichihime-advd-e-honor","advx-ichihime-advd-e-few","advx-ichihime-advd-e-pair","advx-sensei-advd-e-far","advx-sensei-advd-e-cheap","advx-sensei-advd-e-shape","advx-sensei-advd-e-honor","advx-sensei-advd-e-few","advx-sensei-advd-e-pair","advd-e-far","advd-e-cheap","advd-e-shape","advd-e-honor","advd-e-few","advd-e-pair"];
const lackP = partNames.filter(k => !fs.existsSync(path.join(ROOT, k + '.m4a')));
console.log('足す声 ' + Object.keys(add).length + '本／直下に無い ' + lack.length + '本' + (lack.length ? '（例 ' + lack.slice(0, 3).join(', ') + '）' : '') + '／部品の声 ' + partNames.length + '本のうち直下に無い ' + lackP.length + '本' + (lackP.length ? '（' + lackP.join(', ') + '）' : ''));
if (lack.length || lackP.length) { console.log('声が揃っていないので書かない（voice-m4a.yml を kind=dial／kind=parts でもう一度起こせば続きから作る）'); process.exit(2); }
const jp = path.join(ROOT, 'voice-advice-dial.json');
const old = JSON.parse(fs.readFileSync(jp, 'utf8'));
const m = Object.assign({}, old, add), o = {};
Object.keys(m).sort().forEach(k => { o[k] = m[k]; });
console.log('voice-advice-dial.json ' + Object.keys(old).length + '本 → ' + Object.keys(o).length + '本');
if (process.argv.indexOf('--dry') >= 0) { process.exit(0); }
fs.writeFileSync(jp, JSON.stringify(o));
fs.copyFileSync(path.join(ROOT, 'voice-plan', 'dial.txt'), path.join(ROOT, 'voice-advice-dial.txt'));
console.log('書いた：voice-advice-dial.json・voice-advice-dial.txt（= voice-plan/dial.txt）。次は node pack-site.js --make-manifest');
