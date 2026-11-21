// 守りだけ・くじ3・見方1・一言の両端・面白み/言葉/大物なし の縮めた回し。SIM=sim1514|v1513、TONE/DIAL で絞れる。声の名と30秒の数を出す
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = 'C:/Users/user/Desktop/mahjong/koushu-handan';
const S = require(process.env.SIM === 'v1513' ? '../v1513/sim1513.js' : './sim1514.js');
const C = require(ROOT + '/advice-tone-core.js');
const HP = require('../v1513/head-pool.js');
const TF = process.env.TONE ? process.env.TONE.split(',') : S.TONES, DF = process.env.DIAL ? process.env.DIAL.split(',').map(d => d === 'std' ? '' : d) : S.DIALS;
const D = S.scenarios('far').D;
const names = {}; let grpOk = 0, grpNo = 0, grpMax = 0; const why = {}, ex = {}; let n = 0, over30 = 0, notok = 0, soft = 0, mx = 0, mxText = '';
TF.forEach(tone => DF.forEach(dial => ['n', 'd', 't'].forEach(m => {
  const hs = S.headSamples(dial, tone, m, 'd', [0, 1]);
  for (let i = 0; i < 3; i++) D.forEach((ls, k) => { let anyOk = false, best = 99; hs.forEach(h => {
    const f = S.compose(ls, { tone, dial, m, sd: 'd', vk: 'far', i, k }, null, null, h.head);
    n++; const e = C.advEst(f.r.text, f.lines.length); if (f.ok) anyOk = true; if (e < best) best = e;
    if (!f.ok) { notok++; const t=f.r.text; const r=(e>33?'L':'')+(C.advLongRun(t)?'R':'')+(C.advHasTriple(t)?'T':''); why[r]=(why[r]||0)+1; if(!ex[r]) ex[r]=t; } else if (e > 30) soft++;
    if (e > mx) { mx = e; mxText = f.r.text; }
    f.r.items.forEach(x => { if (x.conn || x.changed) { names[C.advDialVoice(x.text)] = x.text; } else { const p = f.lines[x.li] && f.lines[x.li][x.ti]; if (p && p.lit) names[C.advDialVoice(x.text)] = x.text; } });
  }); if (anyOk) grpOk++; else { grpNo++; if (best > grpMax) grpMax = best; } });
})));
const root = new Set(fs.readdirSync(ROOT).filter(f => /^advy-.*\.m4a$/.test(f)).map(f => f.slice(0, -4)));
const miss = Object.keys(names).filter(k => !root.has(k));
let ch = 0; miss.forEach(k => ch += names[k].length);
const out = { grpOk, grpNo, grpMax: +grpMax.toFixed(1), why, n, notok, soft30to33: soft, maxSec: +mx.toFixed(1), need: Object.keys(names).length, miss: miss.length, missChars: ch };
console.log(JSON.stringify(out));
if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify({ out, ex, miss: Object.fromEntries(miss.map(k => [k, names[k]])), mxText }));
