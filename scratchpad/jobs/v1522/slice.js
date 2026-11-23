#!/usr/bin/env node
/* v1514/slice.js — 一つの切れ端（人格 TONE × 方言 DIAL）の守りだけを sim1514 で全部回し、声が要る字のうち直下に無い物を出す（2026-11-21・枠 四十三の声づくり）
   ＊v1513/drive.js と同じ集め方（つなぎ conn・字が変わった部品 changed・書いた字 lit を advDialVoice の名で）。SIDE=d・QS=0,1（一言は両端の分位）。
   ＊呼び手は ../v1514-voice-plan.js（雲）。KH_ROOT・HEAD_HTML は呼び手が渡す。
   使い方  TONE=butler DIAL=osaka node slice.js <出力.json> */
'use strict';
const fs = require('fs'), path = require('path');
process.env.SIDE = 'd';
process.env.QS = process.env.QS || '0,1';
const ROOT = process.env.KH_ROOT || path.join(__dirname, '..', '..', '..');
process.env.KH_ROOT = ROOT;
process.env.HEAD_HTML = process.env.HEAD_HTML || path.join(ROOT, 'koushu-handan.html');
const S = require('./sim1522.js');
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
fs.writeFileSync(process.argv[2], JSON.stringify({ tone: process.env.TONE, dial: process.env.DIAL, combos: n, ng: ngN, need: Object.keys(out).length, miss: miss, sec: Math.round((Date.now() - t0) / 1000) }));
console.log(process.env.TONE + ' ' + process.env.DIAL + '：' + n + '通り・要る字 ' + Object.keys(out).length + '・無い ' + Object.keys(miss).length + '・' + Math.round((Date.now() - t0) / 1000) + '秒');
