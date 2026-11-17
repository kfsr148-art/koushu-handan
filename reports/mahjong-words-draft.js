// 手の形で選べる麻雀の言葉（案・百語ほど）。条件は、配られた13枚（と判定の結果 a、ドラの牌 dora）だけで決まる物。
// 各語 = [id, 段(条件の数), 区分, 言葉, 意味（こちらの言葉）, 条件]
'use strict';
const M = ['m', 'p', 's'], HN = ['E', 'S', 'W', 'N'], DR = ['P', 'F', 'C'], ALLH = HN.concat(DR);
function feats(tiles, a, dora) {
  const cnt = {}; let cat = 0;
  tiles.forEach(t => { if (t.suit === 'cat') { cat++; return; } const k = t.suit === 'honor' ? t.code : t.code; cnt[k] = (cnt[k] || 0) + 1; });
  const c = k => cnt[k] || 0, has = (s, n) => c(s + n) > 0;
  const keys = Object.keys(cnt), sc = {}; M.forEach(s => { sc[s] = 0; for (let n = 1; n <= 9; n++) sc[s] += c(s + n); });
  const honorN = ALLH.reduce((x, k) => x + c(k), 0), honorKinds = ALLH.filter(k => c(k) > 0).length;
  const runs = {}; M.forEach(s => { let r = 0; for (let n = 1; n <= 7; n++) if (has(s, n) && has(s, n + 1) && has(s, n + 2)) r++; runs[s] = r; });
  const runsAll = runs.m + runs.p + runs.s;
  const taat = {}; M.forEach(s => { taat[s] = []; for (let n = 1; n <= 8; n++) if (has(s, n) && has(s, n + 1)) taat[s].push(n); });
  const kan = M.reduce((x, s) => { for (let n = 1; n <= 7; n++) if (has(s, n) && has(s, n + 2) && !has(s, n + 1)) x++; return x; }, 0);
  const near = (s, n) => [-2, -1, 1, 2].some(d => n + d >= 1 && n + d <= 9 && has(s, n + d));
  const isoMid = []; M.forEach(s => { for (let n = 2; n <= 8; n++) if (c(s + n) === 1 && !near(s, n)) isoMid.push(s + n); });
  const isoEdge = []; M.forEach(s => [1, 9].forEach(n => { if (c(s + n) === 1 && !near(s, n)) isoEdge.push(s + n); }));
  const pairs = keys.filter(k => cnt[k] === 2), trips = keys.filter(k => cnt[k] >= 3);
  const term = M.reduce((x, s) => x + c(s + 1) + c(s + 9), 0), yao = term + honorN;
  const mid = M.reduce((x, s) => { for (let n = 4; n <= 6; n++) x += c(s + n); return x; }, 0);
  const sanshokuN = (() => { let best = 0; for (let n = 1; n <= 8; n++) { let q = 0; M.forEach(s => { if (has(s, n) && has(s, n + 1)) q++; }); best = Math.max(best, q); } return best; })();
  const sansh3 = (() => { for (let n = 1; n <= 7; n++) { if (M.every(s => has(s, n) && has(s, n + 1) && has(s, n + 2))) return true; } return false; })();
  const dn = dora ? +dora[1] : 0, ds = dora ? dora[0] : '';
  return { c, has, cnt, keys, sc, honorN, honorKinds, runs, runsAll, taat, kan, isoMid, isoEdge, pairs, trips, term, yao, mid, sanshokuN, sansh3, cat, dora, dn, ds, a, sh: a.baseShanten, dirs: a.directions || [], atk: a.verdict === 'attack', def: a.verdict !== 'attack',
    maxSuit: Math.max(sc.m, sc.p, sc.s), maxSuitKey: M.slice().sort((x, y) => sc[y] - sc[x])[0], suitsUsed: M.filter(s => sc[s] > 0).length,
    pairH: pairs.filter(k => ALLH.indexOf(k) >= 0), pairDr: pairs.filter(k => DR.indexOf(k) >= 0), pairHn: pairs.filter(k => HN.indexOf(k) >= 0),
    dirHas: re => (a.directions || []).some(d => re.test(d)) };
}
const W = [];
const add = (id, tier, kind, term, mean, test) => W.push({ id, tier, kind, term, mean, test });
// ---- 定番（段0〜1）----
add('w001', 0, '本物', '第一打牌にすべての鍵あり', '最初の捨て牌に手の読みがある', f => true);
add('w002', 1, '本物', '手を見ずに場を見よ', '自分の手より場の様子を見る', f => f.def);
add('w003', 1, '本物', '好牌先打', '使いやすい浮き牌は早めに切る', f => f.isoMid.length >= 1);
add('w004', 1, '本物', '配牌見たら三色探せ', '配牌で三色の芽を見る', f => f.sanshokuN >= 2);
add('w005', 1, '本物', '孤立牌から切れ', 'つながらない牌から先に切る', f => f.isoMid.length + f.isoEdge.length >= 3);
add('w006', 1, '本物', '字牌は早めに整理', '使わない字牌は早いうちに切る', f => f.honorN - f.pairH.length * 2 >= 3 && f.atk);
add('w007', 1, '本物', '愚形を嫌え', '嵌張や辺張が多い手は伸びにくい', f => (f.a.weakShapes || 0) >= 3);
add('w008', 1, '本物', '両面を残せ', '良い形のまとまりを崩さない', f => (f.a.goodShapes || 0) >= 4);
add('w009', 1, '本物', '急がば回れ', '一向聴まで遠い手は形を整える', f => f.sh >= 3 && f.atk);
add('w010', 1, '本物', '金持ち喧嘩せず', '点棒に余裕があれば無理をしない（守りの手の心得）', f => f.def && f.yao >= 6);
// ---- 数牌の形（段1〜2）----
add('w011', 1, '用語', '中ぶくれ', '真ん中がふくらんだ形（4567など）', f => M.some(s => [3, 4, 5].some(n => has4(f, s, n))));
function has4(f, s, n) { return f.has(s, n) && f.has(s, n + 1) && f.has(s, n + 2) && f.has(s, n + 3); }
add('w012', 2, '用語', '五連形', '5枚つながった形', f => M.some(s => [1, 2, 3, 4, 5].some(n => has4(f, s, n) && f.has(s, n + 4))));
add('w013', 1, '用語', '嵌張はツモが遠い', '真ん中が空いた待ちは出にくい', f => f.kan >= 2);
add('w014', 2, '用語', '辺張だらけ', '1・2や8・9の辺張が複数', f => M.reduce((x, s) => x + ((f.has(s, 1) && f.has(s, 2) ? 1 : 0) + (f.has(s, 8) && f.has(s, 9) ? 1 : 0)), 0) >= 2);
add('w015', 2, '用語', '飛び対子は間を落とせ', '2・4・6の対子は真ん中を切る', f => M.some(s => f.c(s + 2) >= 2 && f.c(s + 4) >= 2) || M.some(s => f.c(s + 4) >= 2 && f.c(s + 6) >= 2) || M.some(s => f.c(s + 3) >= 2 && f.c(s + 5) >= 2));
add('w016', 1, '用語', '対子の重なり', '同じ数の対子が二つ以上', f => f.pairs.length >= 2);
add('w017', 2, '用語', '対子が三つ以上は七対子も見る', '対子が多ければ七対子に寄せる道がある', f => f.pairs.length >= 3);
add('w018', 3, '用語', '七対子の入り口', '対子が四つ以上', f => f.pairs.length >= 4);
add('w019', 2, '用語', '暗刻持ち', '三枚そろった刻子を持っている', f => f.trips.length >= 1);
add('w020', 3, '用語', '暗刻が二つ', '刻子が二組、対々和の道も見える', f => f.trips.length >= 2);
add('w021', 3, '用語', 'もう一枚で槓', '同じ牌が四枚そろった（槓子）', f => f.keys.some(k => f.cnt[k] >= 4));
add('w022', 2, '用語', '一気通貫の芽', '同じ色で123・456・789のどれかが二つ以上そろう気配', f => M.some(s => [[1, 2, 3], [4, 5, 6], [7, 8, 9]].filter(g => g.every(n => f.has(s, n))).length >= 2));
add('w023', 3, '本物', '三色同順の入り口', '三つの色で同じ並びが見える', f => f.sanshokuN >= 3);
add('w024', 2, '用語', '三色の芽が二色まで', '同じ並びが二色でそろっている', f => f.sanshokuN === 2 && !f.sansh3);
add('w025', 1, '用語', '染め手の気配', 'ある一色が10枚以上', f => f.maxSuit >= 10);
add('w026', 2, '用語', '混一色の道', '一色＋字牌で11枚以上', f => M.some(s => f.sc[s] + f.honorN >= 11) && f.honorN >= 2);
add('w027', 3, '用語', '清一色の道', '一色が10枚以上で字牌が無い', f => f.maxSuit >= 10 && f.honorN === 0);

add('w029', 1, '用語', '一色は三色に勝る', '一色に寄る手は強い（本物のたとえ）', f => f.maxSuit >= 8 && f.maxSuit <= 9);
add('w030', 1, '用語', '断么九の素材', '2〜8の牌ばかり', f => f.yao <= 1 && f.cat === 0);
// ---- 字牌・役牌（段1〜3）----
add('w031', 1, '用語', 'ポン材', '役牌の対子は鳴きの材料', f => f.pairDr.length >= 1);
add('w032', 2, '用語', '役牌が二組', '三元牌の対子が二つ', f => f.pairDr.length >= 2);
add('w033', 3, '用語', '大三元の入り口', '白發中が三種そろって、うち一つが対子以上', f => DR.every(k => f.c(k) >= 1) && f.pairDr.length >= 1);
add('w034', 3, '用語', '小三元の気配', '三元牌の対子と一枚で二種以上、もう一種あり', f => DR.filter(k => f.c(k) >= 2).length >= 1 && DR.filter(k => f.c(k) >= 1).length >= 3 && DR.filter(k => f.c(k) >= 2).length < 3);
add('w035', 2, '眉つば', '東發つきもの', '東と發はセットで来ると言われる（眉つば）', f => f.c('E') >= 1 && f.c('F') >= 1 && (f.c('E') >= 2 || f.c('F') >= 2));
add('w036', 2, '眉つば', '東發つきもの・両方対子', '東と發の対子が両方', f => f.c('E') >= 2 && f.c('F') >= 2);
add('w037', 1, '用語', '風牌は客風', '南西北の対子は役にならない風（客風）の気配', f => f.pairs.filter(k => ['S', 'W', 'N'].indexOf(k) >= 0).length >= 1);
add('w038', 2, '用語', '風牌が四種そろい', '東南西北が全部ある', f => HN.every(k => f.c(k) >= 1));
add('w039', 3, '眉つば', '四喜の夢', '風牌の対子が二種以上（めったにない）', f => f.pairHn.length >= 2);
add('w040', 1, 'あだ名', '白ポッチ', '白の俗称。一枚だけの白', f => f.c('P') === 1);
add('w041', 1, 'あだ名', '發は緑のやつ', '發の俗称。一枚だけの發', f => f.c('F') === 1);
add('w042', 1, 'あだ名', '北はペー', '北の俗称', f => f.c('N') >= 1);
add('w043', 1, 'あだ名', '中はチュン', '中の俗称', f => f.c('C') >= 1);
add('w044', 2, '用語', '字牌が五枚以上', '字牌が多い手', f => f.honorN >= 5);
add('w045', 3, '用語', '字牌だらけ', '字牌が八枚以上', f => f.honorN >= 8);
add('w046', 2, '用語', '字一色の香り', '字牌が七枚以上＋同じ字牌の対子が複数', f => f.honorN >= 7 && f.pairH.length >= 2);
add('w047', 1, '用語', '字牌は一枚ずつ', '字牌の対子が一つも無く四枚以上', f => f.honorN >= 4 && f.pairH.length === 0);
add('w048', 2, '用語', '雀頭は字牌で', '字牌の対子が一つ、他に対子なし', f => f.pairH.length === 1 && f.pairs.length === 1);
// ---- 端牌・么九（段1〜3）----
add('w049', 1, '用語', '老頭牌のあだ名', '1と9の数牌がまとまる', f => f.term >= 3);
add('w050', 2, '用語', '端牌が多い手', '1・9の数牌が四枚以上', f => f.term >= 4);
add('w051', 2, '用語', '混老頭の気配', '1・9の数牌と字牌ばかり（么九牌が10枚以上）', f => f.yao >= 10 && f.yao < 13);
add('w052', 3, '用語', '么九牌が11枚', '么九牌が11枚以上', f => f.yao >= 11);
add('w053', 2, '用語', '端のターツ', '1・2か8・9の組が二つ以上', f => M.reduce((x, s) => x + (f.has(s, 1) && f.has(s, 2) ? 1 : 0) + (f.has(s, 8) && f.has(s, 9) ? 1 : 0), 0) >= 2);
add('w054', 1, '用語', '純全帯の芽', '数牌の面子が全部端を含む気配', f => f.term >= 5 && f.honorN === 0);
// ---- ドラ（段1〜3）----
add('w055', 1, '用語', 'ドラ持ち', 'ドラを一枚持っている', f => f.dora && f.c(f.dora) >= 1);
add('w056', 2, '用語', 'ドラ暗刻・対子', 'ドラが二枚以上', f => f.dora && f.c(f.dora) >= 2);
add('w057', 3, '用語', 'ドラ三枚', 'ドラが三枚以上', f => f.dora && f.c(f.dora) >= 3);
add('w058', 2, '用語', 'ドラ浮き', 'ドラが他の牌とつながらず浮いている', f => f.dora && f.c(f.dora) === 1 && ALLH.indexOf(f.dora) < 0 && !near2(f));
function near2(f) { const s = f.ds, n = f.dn; return [-2, -1, 1, 2].some(d => n + d >= 1 && n + d <= 9 && f.has(s, n + d)); }
add('w059', 2, '用語', 'ドラそば', 'ドラの隣の牌を持っている', f => f.dora && f.c(f.dora) === 0 && ALLH.indexOf(f.dora) < 0 && near2(f));
add('w060', 2, '用語', 'ドラは字牌', 'ドラが字牌で、対子で持っている', f => f.dora && ALLH.indexOf(f.dora) >= 0 && f.c(f.dora) >= 2);
add('w061', 2, '用語', 'ドラが字牌の浮き牌', 'ドラの字牌が一枚だけ', f => f.dora && ALLH.indexOf(f.dora) >= 0 && f.c(f.dora) === 1);
add('w062', 1, '用語', '赤五を持つ', '赤い五を持っている', f => f.a.redCount >= 1);
add('w063', 2, '用語', '赤が二枚', '赤い五を二枚持っている', f => f.a.redCount >= 2);
add('w064', 3, '用語', '赤ドラ三枚', '赤い五を三枚持っている', f => f.a.redCount >= 3);
add('w065', 2, '用語', '打点が見える', '役がある上にドラが乗る', f => f.a.hasValue && f.a.doraValue >= 1);
// ---- 向聴・手の進み（段1〜3）----
add('w066', 2, '本物', '配牌一向聴は天の恵み', '配牌から一向聴以下', f => f.sh <= 1 && f.sh >= 0);
add('w067', 3, '眉つば', '配牌聴牌は夢物語', '配牌から聴牌の形（めったにない）', f => f.sh === 0);
add('w068', 3, '眉つば', '天和を和がると死ぬ', '運を使い果たすと言われる（眉つば）', f => f.sh <= 0 && f.atk);
add('w069', 1, '用語', '三向聴は見切り所', '三向聴以上は早めに見切る手も', f => f.sh >= 3 && f.def);
add('w070', 2, '用語', '四向聴はほぼ配り直し', '四向聴以上', f => f.sh >= 4);
add('w071', 3, '用語', '五向聴は祈るだけ', '五向聴以上', f => f.sh >= 5);
add('w072', 2, '用語', '二向聴は押し所', '二向聴で攻め', f => f.sh === 2 && f.atk);
add('w073', 2, '用語', '二向聴は引き所', '二向聴で守り', f => f.sh === 2 && f.def);
add('w074', 1, '用語', '受け入れが広い', '有効牌の種類が多い手', f => (f.a.acceptTypes || 0) >= 9);
add('w075', 2, '用語', '受け入れが狭い', '有効牌の種類が少ない手', f => (f.a.acceptTypes || 0) <= 4 && f.sh <= 3);
add('w076', 3, '用語', '受け入れ二十枚以上', '有効牌の枚数が特に多い手', f => (f.a.acceptTiles || 0) >= 55);
add('w077', 2, '用語', '手広く構える', '有効牌が多く、まとまりも多い', f => (f.a.totalBlocks || 0) >= 5);
add('w078', 2, '用語', 'ブロック不足', 'まとまりが少ない手', f => (f.a.totalBlocks || 0) <= 2);
add('w079', 3, '用語', 'まとまりが六つ', 'まとまりが六つ以上', f => (f.a.totalBlocks || 0) >= 6);
// ---- 守り（段1〜3）----
add('w080', 1, '用語', 'ベタオリの準備', '安全牌（字牌と端牌）が多い守りの手', f => f.def && (f.a.defHonors + f.a.defTerminals) >= 4);
add('w081', 2, '用語', '安全牌を温存', '字牌が一枚ずつで守りに向く', f => f.def && f.honorN >= 3 && f.pairH.length === 0);
add('w082', 2, '用語', '現物はまだ無い', '守りだが安全牌が少ない', f => f.def && (f.a.defHonors + f.a.defTerminals) <= 1);

add('w084', 2, '用語', '回し打ちの構え', '守りだが一向聴まで遠くない', f => f.def && f.sh <= 2);
add('w085', 2, '用語', '降りる勇気', '守りで手がとても遠い', f => f.def && f.sh >= 5);
add('w086', 3, '用語', '降りて正解の手', '守りで安全牌が多く手がとても遠い', f => f.def && f.sh >= 5 && (f.a.defHonors + f.a.defTerminals) >= 5);
add('w087', 2, '用語', '壁は頼りになる', '同じ牌を四枚近く抱えて守る', f => f.def && f.keys.some(k => f.cnt[k] >= 3));
// ---- 七対子・国士・対々和（段2〜3）----
add('w088', 2, '用語', '七対子の道', '七対子の形が見える', f => f.dirHas(/七対子/));
add('w089', 3, '用語', '七対子は一向聴から', '対子が五つ以上', f => f.pairs.length >= 5);
add('w090', 2, '用語', '対々和の形', '刻子と対子が多い手', f => f.dirHas(/対々和/));
add('w091', 2, '用語', 'タンヤオの形', '2〜8で作る手', f => f.dirHas(/タンヤオ/));
add('w092', 3, '用語', '国士の芽', '么九牌の種類が十種以上', f => f.a.kokushiKinds >= 10);
add('w093', 3, '用語', '九種九牌の入り口', '么九牌の種類がちょうど九種', f => f.a.kokushiKinds === 9);
add('w094', 2, '用語', '混一色の道・字牌多め', '一色＋字牌が多い', f => f.dirHas(/混一色|染め/));
// ---- 猫牌・変わり種（段1〜2）----
add('w095', 1, '用語', '猫牌が出た', '猫牌（1〜9の孤立牌・猫が書いてある牌）がある', f => f.cat >= 1);
add('w096', 2, '用語', '猫牌が二枚', '猫牌が二枚以上', f => f.cat >= 2);
add('w097', 3, '用語', '猫牌が四枚', '猫牌が四枚以上', f => f.cat >= 4);
// ---- 眉つば・験担ぎ（段2〜3）----
add('w098', 2, '眉つば', '辺張ツモなら即立直', '辺張で聴牌したら勢いがあると言われる（眉つば）', f => f.sh <= 1 && M.some(s => f.has(s, 1) && f.has(s, 2) || f.has(s, 8) && f.has(s, 9)));
add('w099', 3, '眉つば', '早い立直は一・四索', '早いリーチは一索・四索待ちが多いと言われる（眉つば）', f => f.sh <= 1 && (f.c('s1') >= 2 || f.c('s4') >= 2));
add('w100', 2, '眉つば', '裏目牌は当たり牌', '裏目を引くと、その牌が当たりになると言われる（眉つば）', f => f.def && f.isoMid.length >= 2 && f.sh <= 3);
add('w101', 2, '眉つば', '五索は縁起がいい', '五索を二枚以上持つと運が向くと言われる（眉つば）', f => f.c('s5') >= 2);
add('w102', 2, '眉つば', '九萬が来れば和了る', '九萬を二枚持つと和了ると言われる（眉つば）', f => f.c('m9') >= 2);
add('w103', 3, '眉つば', '東南西北そろえば運が回る', '風牌の四種がそろうと運が回ると言われる（眉つば）', f => HN.every(k => f.c(k) >= 1) && f.honorN >= 5);
add('w104', 2, '眉つば', '二五八は鳴くな', '終盤に出やすい牌は鳴かない（眉つば気味）', f => M.some(s => [2, 5, 8].filter(n => f.c(s + n) >= 1).length === 3));
add('w105', 2, '用語', '真ん中が多い', '4・5・6の牌が五枚以上', f => f.mid >= 5);
module.exports = { W, feats };
