/* 猫牌率の測り直し-2 の割り（2026-09-15）— core-battle-log-10k.tsv の verdict 欄の食い違いを二つに割る。
 *
 *   ＊10k の verdict 欄は 09-14 に rejudge.js --fill で埋めた物で、その台は風を数字（WIND=[1,2,3,4]・席番号そのまま）、
 *     場風を 1 で渡していた。本体は風を 'E'/'S'/'W'/'N' の字で読む（L1877・L2967・L3157）ので、
 *     埋めた時は自風・場風が一つも効いていなかった。そのうえ埋めたのは v1440 より前（v1439）。
 *   ＊食い違いは二つの元が混ざっている。今の本体で三通りに判じて割る。
 *     記録の欄  … v1439・風は数字（効いていない）
 *     今・数字  … v1446・風は数字（効いていない）   → 記録の欄との差 ＝ v1439→v1446 の本体の差だけ
 *     今・字    … v1446・風は字（core-battle.js と同じ）→ 今・数字との差 ＝ 風の渡し方の差だけ
 *   ＊子だけを数える。本体は読むだけ。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { makeAnalyze, parseHand } = require(path.join(__dirname, 'core-probe.js'));
const analyze = makeAnalyze();
const LET = ['E', 'S', 'W', 'N'];
const NUM = [1, 2, 3, 4];

const file = process.argv[2] || path.join(__dirname, 'core-battle-log-10k.tsv');
const raw = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const hi = raw.findIndex(l => l.split('\t')[0] === '局');
const cols = raw[hi].split('\t'); const at = {};
cols.forEach((c, i) => { at[c] = i; });
const rows = []; const oyaOf = {};
for (let i = hi + 1; i < raw.length; i++) {
  if (!raw[i].trim()) continue;
  const q = raw[i].split('\t');
  if (q.length < cols.length) continue;
  rows.push(q);
  if (String(q[at['親']]).trim() === '1') oyaOf[q[at['局']]] = Number(q[at['席']]);
}
const pair = () => ({ n: 0, a2d: 0, d2a: 0 });
const c1 = pair(), c2 = pair(), c3 = pair();
const put = (c, x, y) => { if (x === y) return; c.n++; if (x === 'attack') c.a2d++; else c.d2a++; };
let kid = 0, bad = 0, gate = 0;
for (const q of rows) {
  if (String(q[at['親']]).trim() !== '0') continue;
  const seat = Number(q[at['席']]);
  const oya = oyaOf[q[at['局']]];
  if (oya === undefined) { bad++; continue; }
  let rn, rl;
  try {
    rn = analyze(parseHand(q[at['配牌']]), NUM[seat % 4], 1, 0) || {};
    rl = analyze(parseHand(q[at['配牌']]), LET[(seat - oya + 4) % 4], 'E', 0) || {};
  } catch (e) { bad++; continue; }
  kid++;
  const vl = q[at['verdict']];
  put(c1, vl, rn.verdict);
  put(c2, rn.verdict, rl.verdict);
  put(c3, vl, rl.verdict);
  if (vl === 'attack' && rn.verdict === 'defend' && Number(rn.baseShanten) === 3) gate++;
}
const row = (nm, c) => console.log('  ' + nm.padEnd(34) + String(c.n).padStart(5) + '手（攻め→守り ' + c.a2d + '・守り→攻め ' + c.d2a + '）');
console.log('  子の手 … ' + kid + '手（読めなかった ' + bad + '手）');
console.log('');
row('記録の欄 → 今・風は数字（本体の差だけ）', c1);
console.log('    うち 向聴3 で攻め→守り（v1440 の幅の関門を外した分） … ' + gate + '手');
row('今・風は数字 → 今・風は字（風の渡し方だけ）', c2);
row('記録の欄 → 今・風は字（合わせた差）', c3);
