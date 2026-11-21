// 声が要る字を集める（v1513 の核・本体の advCompose に合わせた写し sim1513.js）。node collect.js <出力.json>（TONE・DIAL・HEADFLAG で絞る）
'use strict';
const fs = require('fs');
const S = require('./sim1513.js');
const ROOT = process.env.KH_ROOT || 'C:/Users/user/Desktop/mahjong/koushu-handan';
const C = require(ROOT + '/advice-tone-core.js');
const out = {}; let n = 0, ngOnly = 0; const t0 = Date.now();
function add(tx, kind, ok) { const nm = C.advDialVoice(tx); const o = out[nm] || (out[nm] = { text: tx, kind: kind, ok: false }); if (ok) { o.ok = true; } }
S.each(function (r, c) {
  n++;
  r.items.forEach(function (x) {
    if (x.conn) { add(x.text, 'conn', c.ok); return; }
    if (x.changed) { add(x.text, 'chg', c.ok); return; }
    const p = c.lines[x.li] && c.lines[x.li][x.ti];
    if (p && p.lit) { add(x.text, 'lit', c.ok); }
  });
});
fs.writeFileSync(process.argv[2], JSON.stringify(out));
console.log('組み合わせ ' + n + '／声の字 ' + Object.keys(out).length + '／' + Math.round((Date.now() - t0) / 1000) + '秒');
