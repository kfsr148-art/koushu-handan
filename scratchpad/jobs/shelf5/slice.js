#!/usr/bin/env node
/* shelf5/slice.js — 一つの切れ端（人格 TONE × 方言 DIAL × 攻守 SIDE）を sim1522 で全部回し、声が要る字（名→字）と、そのうち直下に無い物を出す（棚 #5・2026-11-24）
   ＊v1522/slice.js の写し。違いは SIDE を呼び手から受ける（a／d）ことと、要る名の全部（need）も書くこと（使われなくなった声を数えるため）。
   ＊集め方は v1513／v1522 と同じ（つなぎ conn・字が変わった部品 changed・書いた字 lit を advDialVoice の名で）。QS=0,1（一言は両端の分位）。
   使い方  TONE=butler DIAL=osaka SIDE=a node slice.js <出力.json> */
'use strict';
const fs = require('fs'), path = require('path');
process.env.SIDE = process.env.SIDE || 'a,d';
process.env.QS = process.env.QS || '0,1';
const ROOT = process.env.KH_ROOT || path.join(__dirname, '..', '..', '..');
process.env.KH_ROOT = ROOT;
process.env.HEAD_HTML = process.env.HEAD_HTML || path.join(ROOT, 'koushu-handan.html');
const S = require('../v1522/sim1522.js');
const C = require(path.join(ROOT, 'advice-tone-core.js'));
const t0 = Date.now(); let n = 0, ngN = 0;
const out = {};
const add = (tx, kind, ok) => { const nm = C.advDialVoice(tx); const o = out[nm] || (out[nm] = { text: tx, kind: kind, ok: false }); if (ok) { o.ok = true; } };
S.each(function (r, c) {
  n++; if (!c.ok) { ngN++; }
  r.items.forEach(function (x) {
    if (x.conn) { add(x.text, 'conn', c.ok); return; }
    if (x.changed) { add(x.text, 'chg', c.ok); return; }
    const p = c.lines[x.li] && c.lines[x.li][x.ti];
    if (p && p.lit) { add(x.text, 'lit', c.ok); }
  });
});
const root = new Set(fs.readdirSync(ROOT).filter(f => /^advy-.*\.m4a$/.test(f)).map(f => f.slice(0, -4)));
const miss = {}; Object.keys(out).filter(k => !root.has(k)).sort().forEach(k => { miss[k] = out[k]; });
fs.writeFileSync(process.argv[2], JSON.stringify({ tone: process.env.TONE, dial: process.env.DIAL, side: process.env.SIDE, combos: n, ng: ngN, need: Object.keys(out).sort(), miss: miss, sec: Math.round((Date.now() - t0) / 1000) }));
console.log(process.env.TONE + ' ' + process.env.DIAL + ' ' + process.env.SIDE + '：' + n + '通り・要る字 ' + Object.keys(out).length + '・無い ' + Object.keys(miss).length + '・' + Math.round((Date.now() - t0) / 1000) + '秒');
