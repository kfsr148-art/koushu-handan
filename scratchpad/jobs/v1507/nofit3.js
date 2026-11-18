'use strict';
const fs = require('fs');
const S = require('./advice-talk-sim.js'), C = require('./advice-tone-core.js');
const res = new Map(); let mxOk = 0, soft = 0, okN = 0, over33 = 0;
S.TONES.forEach(tone => S.DIALS.forEach(dial => ['n', 'd', 't'].forEach(m => ['a', 'd'].forEach(sd => {
  const hs = S.headSamples(dial, tone, m, sd, [0, 0.25, 0.5, 0.75, 1]);
  S.VK.forEach(vk => {
    const sc = S.scenarios(vk), list = sd === 'a' ? sc.A : sc.D;
    for (let i = 0; i < 3; i++) list.forEach((ls, k) => {
      hs.forEach(h => {
        const f = S.compose(ls, { tone, dial, m, sd, vk, i, k }, null, null, h.head);
        const e = C.advEst(f.r.text, f.lines.length);
        const key = [tone, dial, m, sd, vk, i, k, h.cat].join('|');
        const o = res.get(key) || { ok: false, bestE: 1e9, soft: false };
        if (f.ok) { o.ok = true; okN++; if (e > mxOk) mxOk = e; if (e > 33) over33++; if (e > 30) { soft++; } }
        if (e < o.bestE) { o.bestE = e; }
        res.set(key, o);
      });
    });
  });
}))));
let n = 0, bad = 0, worst = 0; const g = {};
res.forEach((o, key) => { n++; if (!o.ok) { bad++; if (o.bestE > worst) worst = o.bestE; const p = key.split('|'); const gk = p[0] + ' m=' + p[2] + ' ' + p[7]; g[gk] = (g[gk] || 0) + 1; } });
console.log(JSON.stringify({ 組: n, 収まる一言なし: bad, 標本のうち緩めた段で収まった: soft, 収まった標本の最長: +mxOk.toFixed(2), 超33: over33, 収まらない組の最短の見積: +worst.toFixed(1), 内訳: g }));
