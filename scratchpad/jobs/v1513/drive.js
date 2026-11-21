// 人格×方言の切れ端を順に回し、済んだ物は飛ばす。60秒を過ぎたら新しい切れ端を始めない（一回の呼び出しを3分以内に収める）
'use strict';
const fs = require('fs'), path = require('path');
process.env.QS = process.env.QS || '0,1';
const S = require('./sim1513.js');
const ROOT = process.env.KH_ROOT || 'C:/Users/user/Desktop/mahjong/koushu-handan';
const C = require(ROOT + '/advice-tone-core.js');
const OD = path.join(__dirname, process.env.HEADFLAG ? 'outH' : 'out'); fs.mkdirSync(OD, { recursive: true });
const t0 = Date.now(); let left = 0;
for (const tone of S.TONES) {
  for (const dial of S.DIALS) {
    const f = path.join(OD, tone + '-' + (dial || 'std') + '.json');
    if (fs.existsSync(f)) { continue; }
    const el = (Date.now() - t0) / 1000;
    if (el > (dial === 'yoji' ? 55 : 125)) { left++; continue; }
    process.env.TONE = tone; process.env.DIAL = dial || 'std';
    const out = {}; let n = 0; const t1 = Date.now();
    const add = (tx, kind, ok) => { const nm = C.advDialVoice(tx); const o = out[nm] || (out[nm] = { text: tx, kind: kind, ok: false }); if (ok) { o.ok = true; } };
    S.each(function (r, c) {
      n++;
      r.items.forEach(function (x) {
        if (x.conn) { add(x.text, 'conn', c.ok); return; }
        if (x.changed) { add(x.text, 'chg', c.ok); return; }
        const p = c.lines[x.li] && c.lines[x.li][x.ti];
        if (p && p.lit) { add(x.text, 'lit', c.ok); }
      });
    });
    fs.writeFileSync(f, JSON.stringify(out));
    console.log(tone + ' ' + (dial || 'std') + '：' + n + '通り・' + Object.keys(out).length + '字・' + Math.round((Date.now() - t1) / 1000) + '秒');
  }
}
console.log('のこりの切れ端 ' + left);
