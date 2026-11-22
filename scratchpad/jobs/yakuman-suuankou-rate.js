// 雲で：四暗刻（ツモ和了）の和了率を、配牌の（暗刻の数 k・対子の数 p）ごとに測る（枠 百十四 ②・2026-11-22）
//   ＊設計：reports/y1122-1330-kokushi-suuankou-ronbun.md の 3（共通の作り・四暗刻）。こちらの条件：13枚の配牌だけを見る・独り打ち（ツモだけ・配牌のあと山から18回ツモ）・鳴かない。赤5は結果に効かないので山は赤なしの34種×4。
//   ＊打ち手：孤立牌（1枚）から切る→四枚目を切る→孤立牌が無ければ対子を一組くずす。暗刻は切らない。ツモ和了だけが四暗刻（ロンは数えない）。
//   ＊和了：暗刻（3枚以上の種類）がちょうど4つ＋残り2枚が対子。
//   ＊基準：でたらめ配牌（積み込み無し）で同じ打ち方。種は固定・台本の中で 1380秒に打ち切り。
//   使い方：node scratchpad/jobs/yakuman-suuankou-rate.js [--local 2000]
'use strict';
const LOCAL = process.argv.indexOf('--local') >= 0 ? Number(process.argv[process.argv.indexOf('--local') + 1]) || 2000 : 0;
const N = LOCAL || 300000, N0 = LOCAL ? LOCAL * 5 : 1000000, DRAWS = 18, LIMIT_MS = 1380 * 1000, T0 = Date.now(), SEED = 20261123;
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function play(cnt, rnd) {
  const wall = []; for (let t = 0; t < 34; t++) { for (let i = cnt[t]; i < 4; i++) { wall.push(t); } }
  let R = wall.length;
  for (let turn = 1; turn <= DRAWS; turn++) {
    const j = Math.floor(rnd() * R); const t = wall[j]; wall[j] = wall[R - 1]; R--;
    cnt[t]++;
    let T = 0, two = 0, one = -1, four = -1, pairTile = -1;
    for (let i = 0; i < 34; i++) { const c = cnt[i]; if (c >= 3) { T++; if (c === 4) { four = i; } } else if (c === 2) { two++; pairTile = i; } else if (c === 1 && one < 0) { one = i; } }
    if (T === 4 && two === 1 && cnt[pairTile] === 2) {
      // 14枚＝暗刻4つ(12)＋対子(2)。四枚の種類があれば 3+1 になるので数えない（four>=0 は 13+…を超える）
      if (four < 0) { return turn; }
    }
    // 切る：四枚目→孤立牌→対子の一組
    if (four >= 0) { cnt[four]--; continue; }
    if (one >= 0) { cnt[one]--; continue; }
    if (pairTile >= 0) { cnt[pairTile]--; continue; }
    // ここへは来ない
    return 0;
  }
  return 0;
}
function dealMade(k, p, rnd) {
  const cnt = new Array(34).fill(0);
  const iso = 13 - 3 * k - 2 * p;
  const ts = []; for (let i = 0; i < 34; i++) { ts.push(i); }
  for (let i = 33; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = ts[i]; ts[i] = ts[j]; ts[j] = x; }
  let q = 0;
  for (let i = 0; i < k; i++) { cnt[ts[q++]] = 3; }
  for (let i = 0; i < p; i++) { cnt[ts[q++]] = 2; }
  for (let i = 0; i < iso; i++) { cnt[ts[q++]] = 1; }
  return cnt;
}
function dealRandom(rnd) {
  const all = []; for (let t = 0; t < 34; t++) { for (let i = 0; i < 4; i++) { all.push(t); } }
  const cnt = new Array(34).fill(0);
  for (let i = 0; i < 13; i++) { const j = Math.floor(rnd() * all.length); cnt[all[j]]++; all[j] = all[all.length - 1]; all.pop(); }
  return cnt;
}
function run(deal, n, rnd) {
  const byTurn = new Array(DRAWS + 1).fill(0); let wins = 0, done = 0;
  for (let i = 0; i < n; i++) {
    if ((i & 8191) === 0 && Date.now() - T0 > LIMIT_MS) { break; }
    const t = play(deal(), rnd); done++; if (t) { wins++; byTurn[t]++; }
  }
  return { n: done, wins, byTurn };
}
const ci = (p, n) => 1.96 * Math.sqrt(p * (1 - p) / (n || 1)) * 100;
const pc = (w, n) => (100 * w / (n || 1)).toFixed(3) + '%';
const cum = (r, k) => { let s = 0; for (let t = 1; t <= k; t++) { s += r.byTurn[t]; } return pc(s, r.n); };
console.log('# 四暗刻（ツモ和了）の和了率（作り配牌・独り打ち・鳴かない・18ツモ）');
console.log('一枠 ' + N + '局・基準（でたらめ配牌）' + N0 + '局・種 ' + SEED + (LOCAL ? '（手元の極小の試し）' : ''));
const rb = mulberry32(SEED);
const baseR = run(() => dealRandom(rb), N0, mulberry32(SEED ^ 0x5bd1e995));
const p0 = baseR.wins / baseR.n;
console.log('\n基準（でたらめ配牌・同じ打ち方）：' + baseR.wins + '／' + baseR.n + ' ＝ ' + pc(baseR.wins, baseR.n) + '（95%の幅 ±' + ci(p0, baseR.n).toFixed(4) + 'pt）');
console.log('\n| 暗刻 k | 対子 p | 暗刻＋対子 | 孤立 | 局 | 和了 | 和了率 | 95%の幅(pt) | 基準の倍 | 6巡まで | 9巡まで | 12巡まで | 15巡まで | 18巡まで |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
let idx = 0;
for (let k = 0; k <= 4; k++) {
  for (let p = 0; p <= 6; p++) {
    if (3 * k + 2 * p > 13) { continue; }
    idx++;
    const rnd = mulberry32(SEED + 1000 * idx), rp = mulberry32(SEED + 7 * idx);
    const r = run(() => dealMade(k, p, rnd), N, rp);
    const q = r.wins / r.n;
    console.log('| ' + k + ' | ' + p + ' | ' + (k + p) + ' | ' + (13 - 3 * k - 2 * p) + ' | ' + r.n + ' | ' + r.wins + ' | ' + pc(r.wins, r.n) + ' | ±' + ci(q, r.n).toFixed(3) + ' | ' + (p0 > 0 ? (q / p0).toFixed(1) + '倍' : '基準0') + ' | ' + cum(r, 6) + ' | ' + cum(r, 9) + ' | ' + cum(r, 12) + ' | ' + cum(r, 15) + ' | ' + cum(r, 18) + ' |');
  }
}
console.log('\n＊読み方：独り打ち（他家の捨て牌・立直・和了は入らない）で、配牌のあと18回ツモして四暗刻をツモ和了できた率。ロン和了は数えない（双碰のロンは役満にならない）。基準の倍＝でたらめ配牌で同じ打ち方をした時の率との比（基準は稀で幅が広い）。');
console.log('＊所要 ' + Math.round((Date.now() - T0) / 1000) + '秒');
