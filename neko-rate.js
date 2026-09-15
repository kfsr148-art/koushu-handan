/* 猫牌率の測り直し-1（2026-09-15）— 対局の記録から、猫牌の枚数ごとの四つを出す。
 *   ①出現の割合 ②攻めと判定された割合 ③攻めが正解だった割合 ④点棒の平均
 *
 *   ＊条件は調べの札どおりに揃える。
 *     ・**子だけ**を抜く（BASE_CURVE が「赤入り・子・ドラ表示なし」の50000回のため）。
 *     ・②と③は**列を分ける**（BASE_CURVE の atk は「攻めと判定された割合」で、正解の割合ではない）。
 *     ・0枚の段の意味の違いは、出した表の下に断りを添える。
 *   ＊本体（koushu-handan.html）は**読むだけ**。字面から countIsolatedRealTiles を切り出して回す。
 *   ＊使うのは記録の欄 … 親・配牌・verdict・結果・点棒。判定を回し直す必要は無い。
 *
 *   使い方 … node neko-rate.js <記録のtsv> [<記録のtsv> ...]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const HERE = __dirname;
const { parseHand } = require(path.join(HERE, 'core-probe.js'));
const lines = fs.readFileSync(path.join(HERE, 'koushu-handan.html'), 'utf8').split(/\r?\n/);
function func(head) {
  const i = lines.findIndex(l => l.startsWith(head));
  if (i < 0) throw new Error('本体に「' + head + '」が見つからない');
  let d = 0, on = false; const out = [];
  for (let j = i; j < lines.length; j++) {
    const l = lines[j]; out.push(l);
    for (const ch of l) { if (ch === '{') { d++; on = true; } else if (ch === '}') d--; }
    if (on && d <= 0) break;
  }
  return out.join('\n');
}
const countCat = new Function('hand',
  func('  function countIsolatedRealTiles(') + '\n  return countIsolatedRealTiles(hand);');

/* BASE_CURVE の猫牌の段（本体 L8076 付近・無作為50000回・赤入り・子・ドラ表示なし） */
const BASE_PCT = [8.63, 23.90, 30.05, 22.22, 10.55, 3.56, 1.10];
const BASE_ATK = [58.7, 49.9, 43.7, 39.4, 36.2, 37.1, 39.9];

const bins = Array.from({ length: 7 }, () => ({ n: 0, atk: 0, ok: 0, p: 0 }));
let seen = 0, kid = 0, bad = 0;
for (const file of process.argv.slice(2)) {
  const raw = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const hi = raw.findIndex(l => l.split('\t')[0] === '局');
  if (hi < 0) { console.log('題の行が見つからない … ' + file); continue; }
  const cols = raw[hi].split('\t'); const at = {};
  cols.forEach((c, i) => { at[c] = i; });
  for (let i = hi + 1; i < raw.length; i++) {
    if (!raw[i].trim()) continue;
    const q = raw[i].split('\t');
    if (q.length < cols.length) continue;
    seen++;
    if (String(q[at['親']]).trim() !== '0') continue;   // 子だけ
    let n = 0;
    try { n = countCat(parseHand(q[at['配牌']]).filter(t => t.suit !== 'cat')); }
    catch (e) { bad++; continue; }
    kid++;
    const b = bins[Math.min(6, n)];
    b.n++;
    if (q[at['verdict']] === 'attack') b.atk++;
    const pt = Number(q[at['点棒']]);
    if (pt > 0) b.ok++;
    b.p += pt;
  }
}
const pc = (x, d) => (d ? (x / d * 100).toFixed(2) : '—');
const f = v => (v >= 0 ? '+' : '') + v.toFixed(0);
console.log('  読んだ手 … ' + seen + '手（うち子 ' + kid + '手・読めなかった配牌 ' + bad + '手）');
console.log('');
console.log('  猫牌   手数     ①出現     ②攻めと判定   ③攻めが正解   ④点棒の平均   （下敷き①）（下敷き②）');
console.log('  ' + '─'.repeat(92));
bins.forEach((b, i) => {
  const nm = (i === 6 ? '6枚以上' : i + '枚');
  console.log('  ' + nm.padEnd(8)
    + String(b.n).padStart(6)
    + (pc(b.n, kid) + '%').padStart(10)
    + (pc(b.atk, b.n) + '%').padStart(14)
    + (pc(b.ok, b.n) + '%').padStart(14)
    + (b.n ? f(b.p / b.n) + '点' : '—').padStart(14)
    + ('　' + BASE_PCT[i].toFixed(2) + '%').padStart(12)
    + ('　' + BASE_ATK[i].toFixed(1) + '%').padStart(11));
});
const tot = bins.reduce((s, b) => ({ n: s.n + b.n, atk: s.atk + b.atk, ok: s.ok + b.ok, p: s.p + b.p }),
                        { n: 0, atk: 0, ok: 0, p: 0 });
console.log('  ' + '─'.repeat(92));
console.log('  合計    ' + String(tot.n).padStart(6) + '   100.00%'
  + (pc(tot.atk, tot.n) + '%').padStart(14) + (pc(tot.ok, tot.n) + '%').padStart(14)
  + (f(tot.p / tot.n) + '点').padStart(14));
console.log('');
console.log('  ＊②と③は別物。②は「この道具が攻めと言った割合」、③は「その手が実際に点棒を取れた割合」。');
console.log('  ＊下敷き（BASE_CURVE）は無作為50000回・赤入り・子・ドラ表示なしの値で、持っているのは①と②だけ。');
console.log('  ＊0枚の段の意味の違い … 下敷きの「猫牌0枚」は猫牌を混ぜなかった手で、十三枚とも本物の牌。');
console.log('    こちらの「0枚」は孤立した数牌が一枚も無い手で、やはり十三枚とも本物。数え方は揃っているが、');
console.log('    下敷きの1枚以上の段は**猫牌を混ぜたぶん本物の牌が減っている**のに対し、こちらは常に十三枚とも本物。');
console.log('    枚数が増えるほど、二つの段の中身は離れていく。');
