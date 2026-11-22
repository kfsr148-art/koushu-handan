// 雲で：国士無双の和了率を、么九牌の種類×対子の有無ごとに測る（枠 百十三 ②・2026-11-22）
//   ＊設計：reports/y1122-1330-kokushi-suuankou-ronbun.md の 3（共通の作り・国士）。論文（豊山 2016・么九牌11個以上で約9%・10個でも積み込み無しの10倍以上）の数を、こちらの条件で測り直す。
//   ＊こちらの条件：13枚の配牌だけを見る・赤5入り（各色の5の四枚のうち一枚・結果には効かない）・子・独り打ち（ツモだけ・配牌のあと山から18回ツモ）。
//   ＊打ち手（国士を狙う）：么九でない牌から切る→么九の重なり（三枚目・二組目の対子）を切る。十三種そろって対子が一つ＝ツモ和了。
//   ＊配牌：枠ごとの作り配牌（么九の種類 k と対子の有無を先に置き、残りは么九でない牌を山からでたらめに）。基準としてでたらめ配牌（積み込み無し）を別に回し、基準の和了率の何倍かを出す。
//   ＊乱数は種を固定（mulberry32・測り直して同じ数が出る）。台本の中で 1380秒に打ち切る（作法35・job.yml は1500秒）。済んだ枠は残す。
//   使い方：node scratchpad/jobs/yakuman-kokushi-rate.js            … 雲（一枠 30万局・基準 100万局）
//           node scratchpad/jobs/yakuman-kokushi-rate.js --local 2000 … 手元の極小の試し（一枠 2000局・基準 5000局）
'use strict';
const LOCAL = process.argv.indexOf('--local') >= 0 ? Number(process.argv[process.argv.indexOf('--local') + 1]) || 2000 : 0;
const N = LOCAL || 300000, N0 = LOCAL ? LOCAL * 2.5 : 1000000, DRAWS = 18, LIMIT_MS = 1380 * 1000, T0 = Date.now();
const SEED = 20261122;
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const YAO = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];   // m1 m9 p1 p9 s1 s9 東南西北白發中
const isYao = new Array(34).fill(false); YAO.forEach(t => { isYao[t] = true; });
const NONYAO = []; for (let t = 0; t < 34; t++) { if (!isYao[t]) { NONYAO.push(t); } }
// ある一局を打つ。配牌 cnt（34の枚数・13枚）→ ツモ和了した巡（1〜18）か 0
function play(cnt, rnd) {
  const wall = []; for (let t = 0; t < 34; t++) { for (let i = cnt[t]; i < 4; i++) { wall.push(t); } }
  let R = wall.length;
  for (let turn = 1; turn <= DRAWS; turn++) {
    const j = Math.floor(rnd() * R); const t = wall[j]; wall[j] = wall[R - 1]; R--;
    cnt[t]++;
    // 和了：十三種そろって（14枚）一つが二枚
    let kinds = 0, nonYao = 0, dup = 0;
    for (let i = 0; i < 13; i++) { const c = cnt[YAO[i]]; if (c > 0) { kinds++; } if (c >= 2) { dup += c - 1; } }
    for (let i = 0; i < NONYAO.length; i++) { nonYao += cnt[NONYAO[i]]; }
    if (kinds === 13 && nonYao === 0) { return turn; }
    // 切る：么九でない牌→么九の重なり（三枚以上の種類から、無ければ二組目の対子から）
    if (nonYao > 0) { for (let i = 0; i < NONYAO.length; i++) { if (cnt[NONYAO[i]] > 0) { cnt[NONYAO[i]]--; break; } } continue; }
    let pick = -1, best = 1;
    for (let i = 0; i < 13; i++) { const c = cnt[YAO[i]]; if (c > best) { best = c; pick = YAO[i]; } }
    if (pick < 0) { pick = YAO[0]; }   // 起きない（14枚で全部 1 枚ずつは十三種を越える）
    cnt[pick]--;
  }
  return 0;
}
// 作り配牌：么九の種類 k・対子の有無 pair。残りは么九でない牌を山からでたらめに
function dealMade(k, pair, rnd) {
  const cnt = new Array(34).fill(0);
  const ys = YAO.slice(); for (let i = ys.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = ys[i]; ys[i] = ys[j]; ys[j] = x; }
  for (let i = 0; i < k; i++) { cnt[ys[i]] = 1; }
  if (pair) { cnt[ys[0]] = 2; }
  let need = 13 - k - (pair ? 1 : 0);
  const pool = []; NONYAO.forEach(t => { for (let i = 0; i < 4; i++) { pool.push(t); } });
  for (let i = 0; i < need; i++) { const j = Math.floor(rnd() * pool.length); cnt[pool[j]]++; pool[j] = pool[pool.length - 1]; pool.pop(); }
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
console.log('# 国士無双の和了率（作り配牌・独り打ち・ツモのみ・18ツモ）');
console.log('一枠 ' + N + '局・基準（でたらめ配牌）' + N0 + '局・種 ' + SEED + (LOCAL ? '（手元の極小の試し）' : ''));
const base = run(() => dealRandom(mulberry32(SEED + 999)), 0, mulberry32(1));   // 形だけ（下で本番）
const rb = mulberry32(SEED);
const baseR = run(() => dealRandom(rb), N0, mulberry32(SEED ^ 0x5bd1e995));
const p0 = baseR.wins / baseR.n;
console.log('\n基準（でたらめ配牌・国士を狙って打つ）：' + baseR.wins + '／' + baseR.n + ' ＝ ' + pc(baseR.wins, baseR.n) + '（95%の幅 ±' + ci(p0, baseR.n).toFixed(4) + 'pt）');
console.log('\n| 么九の種類 k | 么九の対子 | 么九の枚数 | 局 | 和了 | 和了率 | 95%の幅(pt) | 基準の倍 | 6巡まで | 9巡まで | 12巡まで | 15巡まで | 18巡まで |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|');
const frames = []; for (let k = 9; k <= 13; k++) { frames.push([k, false]); if (k <= 12) { frames.push([k, true]); } }
const out = [];
frames.forEach(([k, pair], idx) => {
  const rnd = mulberry32(SEED + 1000 * (idx + 1));
  const r = run(() => dealMade(k, pair, rnd), N, rnd2(idx));
  function rnd2(i) { return mulberry32(SEED + 7 * (i + 1)); }
  const p = r.wins / r.n;
  console.log('| ' + k + ' | ' + (pair ? 'あり' : 'なし') + ' | ' + (k + (pair ? 1 : 0)) + ' | ' + r.n + ' | ' + r.wins + ' | ' + pc(r.wins, r.n) + ' | ±' + ci(p, r.n).toFixed(3) + ' | ' + (p0 > 0 ? (p / p0).toFixed(1) + '倍' : '基準0') + ' | ' + cum(r, 6) + ' | ' + cum(r, 9) + ' | ' + cum(r, 12) + ' | ' + cum(r, 15) + ' | ' + cum(r, 18) + ' |');
  out.push({ k, pair, r });
});
console.log('\n＊読み方：独り打ち（他家の捨て牌・立直・和了は入らない）で、配牌のあと18回ツモして国士をツモ和了できた率。「N巡まで」はその巡までの累積。基準の倍＝同じ打ち方をでたらめ配牌で始めた時の率との比。論文との直の比較は、論文の条件（相手・分母・個の数え方）が読めてから。');
console.log('＊所要 ' + Math.round((Date.now() - T0) / 1000) + '秒');
