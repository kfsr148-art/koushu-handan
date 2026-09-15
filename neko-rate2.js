/* 猫牌率の測り直し-2（2026-09-15）— 下敷きを差し替える前の二つを片付ける。
 *   ① 枝豆（eda）と AIスイッチ（om）も、猫牌と同じ記録・同じ条件（子だけ）で
 *      ①出現 ②攻めと判定 ③攻めが正解 ④点棒の平均 を出す。
 *   ② 記録の verdict 欄を今の本体で判じ直し、②を出し直す。記録の欄との食い違いも数える。
 *
 *   ＊数え方は本体と同じ。
 *     猫牌 … countIsolatedRealTiles（本体の字面をそのまま切り出す）
 *     枝豆 … 本物の牌で二枚以上ある種類の数（edaSwitchLean に渡す pairTripletN と同じ）
 *     AI   … 一枚きりの字牌の数（紳士の omamoriN と同じ）
 *   ＊判じ直しは core-battle.js と同じ呼び方にする … analyze(配牌, 自風, 場風, 0)。
 *     自風は「親からの座順」、場風は一局戦なので東。親の席は同じ局の「親=1」の行から取る。
 *   ＊本体（koushu-handan.html）は読むだけ。
 *
 *   使い方 … node neko-rate2.js <記録のtsv> [<記録のtsv> ...]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const HERE = __dirname;
const { makeAnalyze, parseHand } = require(path.join(HERE, 'core-probe.js'));
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
const verLine = lines.find(l => l.indexOf('data-ver="') >= 0) || '';
const VER = (verLine.match(/data-ver="([0-9]+)"/) || [])[1] || '?';
const analyze = makeAnalyze();
const WIND = ['E', 'S', 'W', 'N'];

/* 本体の BASE_CURVE（無作為50000回・赤入り・子・ドラ表示なし） */
const BASE = {
  cat: { pct: [8.63, 23.90, 30.05, 22.22, 10.55, 3.56, 1.10], atk: [58.7, 49.9, 43.7, 39.4, 36.2, 37.1, 39.9], name: '猫牌', unit: '枚' },
  eda: { pct: [12.95, 37.24, 34.69, 13.03, 1.97, 0.12, 0.00], atk: [29.5, 38.2, 51.7, 49.0, 100.0, 93.2, null], name: '枝豆', unit: '組' },
  om:  { pct: [8.19, 25.99, 33.36, 22.31, 8.31, 1.66, 0.17], atk: [68.6, 55.1, 42.6, 33.5, 28.5, 24.2, 28.6], name: 'AIスイッチ', unit: '枚' }
};
const KEYS = ['cat', 'eda', 'om'];
const mk = () => Array.from({ length: 7 }, () => ({ n: 0, atkLog: 0, atkNow: 0, ok: 0, p: 0 }));
const bins = { cat: mk(), eda: mk(), om: mk() };
const perFile = [];
let kid = 0, bad = 0;

for (const file of process.argv.slice(2)) {
  const raw = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const hi = raw.findIndex(l => l.split('\t')[0] === '局');
  if (hi < 0) { console.log('題の行が見つからない … ' + file); continue; }
  const cols = raw[hi].split('\t'); const at = {};
  cols.forEach((c, i) => { at[c] = i; });
  const rows = [];
  const oyaOf = {};
  for (let i = hi + 1; i < raw.length; i++) {
    if (!raw[i].trim()) continue;
    const q = raw[i].split('\t');
    if (q.length < cols.length) continue;
    rows.push(q);
    if (String(q[at['親']]).trim() === '1') oyaOf[q[at['局']]] = Number(q[at['席']]);
  }
  const pf = { name: path.basename(file), kid: 0, diff: 0, a2d: 0, d2a: 0 };
  for (const q of rows) {
    if (String(q[at['親']]).trim() !== '0') continue;   // 子だけ
    const oya = oyaOf[q[at['局']]];
    if (oya === undefined) { bad++; continue; }
    let hand;
    try { hand = parseHand(q[at['配牌']]).filter(t => t.suit !== 'cat'); } catch (e) { bad++; continue; }
    const seat = Number(q[at['席']]);
    let now = '';
    try { now = (analyze(parseHand(q[at['配牌']]), WIND[(seat - oya + 4) % 4], 'E', 0) || {}).verdict || ''; }
    catch (e) { bad++; continue; }
    const logV = q[at['verdict']];
    kid++; pf.kid++;
    if (logV !== now) { pf.diff++; if (logV === 'attack') pf.a2d++; else pf.d2a++; }
    const cnt = {};
    hand.forEach(t => { cnt[t.code] = (cnt[t.code] || 0) + 1; });
    const val = {
      cat: countCat(hand),
      eda: Object.keys(cnt).filter(k => cnt[k] >= 2).length,
      om: hand.filter(t => t.suit === 'honor' && cnt[t.code] === 1).length
    };
    const pt = Number(q[at['点棒']]);
    KEYS.forEach(k => {
      const b = bins[k][Math.min(6, val[k])];
      b.n++;
      if (logV === 'attack') b.atkLog++;
      if (now === 'attack') b.atkNow++;
      if (pt > 0) b.ok++;
      b.p += pt;
    });
  }
  perFile.push(pf);
}

const pc = (x, d) => (d ? (x / d * 100).toFixed(2) + '%' : '—');
const f = v => (v >= 0 ? '+' : '') + v.toFixed(0);
console.log('  読んだ子の手 … ' + kid + '手（読めなかった配牌 ' + bad + '手）／判じ直しは本体 v' + VER);
console.log('');
console.log('■ 記録の verdict 欄と、いまの本体で判じ直した verdict の食い違い（子だけ）');
perFile.forEach(pf => {
  console.log('  ' + pf.name.padEnd(26) + ' 子 ' + String(pf.kid).padStart(6) + '手　食い違い ' + String(pf.diff).padStart(4)
    + '手（攻め→守り ' + pf.a2d + '・守り→攻め ' + pf.d2a + '）');
});
KEYS.forEach(k => {
  const B = BASE[k], G = bins[k];
  const tot = G.reduce((s, b) => ({ n: s.n + b.n, atkLog: s.atkLog + b.atkLog, atkNow: s.atkNow + b.atkNow, ok: s.ok + b.ok, p: s.p + b.p }),
                       { n: 0, atkLog: 0, atkNow: 0, ok: 0, p: 0 });
  console.log('');
  console.log('■ ' + B.name + '（' + B.unit + '）');
  console.log('  段      手数     ①出現   ②攻めと判定(いま)  ②(記録の欄)  ③攻めが正解  ④点棒の平均  下敷き①  下敷き②');
  console.log('  ' + '─'.repeat(104));
  G.forEach((b, i) => {
    console.log('  ' + (i === 6 ? '6' + B.unit + '以上' : i + B.unit).padEnd(7)
      + String(b.n).padStart(6)
      + pc(b.n, tot.n).padStart(10)
      + pc(b.atkNow, b.n).padStart(15)
      + pc(b.atkLog, b.n).padStart(14)
      + pc(b.ok, b.n).padStart(13)
      + (b.n ? f(b.p / b.n) + '点' : '—').padStart(12)
      + (B.pct[i].toFixed(2) + '%').padStart(10)
      + (B.atk[i] === null ? '—' : B.atk[i].toFixed(1) + '%').padStart(9));
  });
  console.log('  ' + '─'.repeat(104));
  console.log('  合計   ' + String(tot.n).padStart(6) + '   100.00%' + pc(tot.atkNow, tot.n).padStart(15) + pc(tot.atkLog, tot.n).padStart(14)
    + pc(tot.ok, tot.n).padStart(13) + (f(tot.p / tot.n) + '点').padStart(12));
});
console.log('');
console.log('  ＊②(いま) は今の本体で判じ直した値、②(記録の欄) は記録に書かれていた値。③④は判定に依らない。');
console.log('  ＊枝豆とAIの0の段も、猫牌と同じく十三枚とも本物の牌の手。下敷きは猫牌を混ぜた手を含むので、段の中身は同じではない。');
