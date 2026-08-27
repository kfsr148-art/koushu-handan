#!/usr/bin/env node
/* ============================================================
   core-probe.js — 配牌判定の中核（analyze()）を node から呼ぶための取り出し器
   ============================================================
   ＊本体（koushu-handan.html）には一字も触れない。
     実行のたび本体から analyze() の字面をそのまま読み出して評価するので、
     写しを持たない＝本体とズレることが原理的に起きない。
     （作法20 の toneBlocksOneSuit が二本立てで抱えている問題を、こちらへ持ち込まない）

   ＊analyze() が外から読む値は hand / seatWind / roundWind / doraCount の四つだけで、
     document にも window にも触らない。だから引数として差し込めば素で走る。
     本体側の呼び出し方は変えていない（CLAUDE.md 作法5・SKILL.md 作法10）。

   使い方
     node core-probe.js "234m567p88s123z"             … 判定を JSON で出す
     node core-probe.js "234m..." --seat S --round E  … 自風・場風を指定する
     node core-probe.js "234m..." --dora 2            … ドラの枚数を指定する
     node core-probe.js --selftest                    … 10通りの手牌をまとめて出す
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const BODY = path.join(__dirname, 'koushu-handan.html');
const HEAD = '  function analyze() {';   // 2434行。行番号ではなく字面で探す
const TAIL = '  }';                      // 同じ字下げで閉じる行

/* analyze() が外の見晴らしから読む定数。これも写さず、本体から字面で抜く。 */
const DECLS = ['  const YAKUHAI = ', '  const honorData = '];

/* 名前で始まる宣言を、括弧の釣り合いが取れて「;」で閉じる行まで抜く。 */
function readDecl(lines, head) {
  const i = lines.findIndex(l => l.startsWith(head));
  if (i < 0) { throw new Error('宣言が見つかりません: ' + head.trim()); }
  let depth = 0;
  const out = [];
  for (let j = i; j < lines.length; j++) {
    const l = lines[j];
    out.push(l);
    for (const ch of l) {
      if (ch === '{' || ch === '[' || ch === '(') { depth++; }
      else if (ch === '}' || ch === ']' || ch === ')') { depth--; }
    }
    if (depth <= 0 && /;\s*(\/\/.*)?$/.test(l)) { break; }
  }
  return out.join('\n');
}

/* 本体から analyze() の字面をそのまま切り出す。行番号は決め打ちにしない。 */
function readAnalyzeSource(file) {
  const lines = fs.readFileSync(file || BODY, 'utf8').split(/\r?\n/);
  let a = -1;
  for (let i = 0; i < lines.length; i++) { if (lines[i] === HEAD) { a = i; break; } }
  if (a < 0) { throw new Error('analyze() の頭が見つかりません（字面が変わった可能性）'); }
  let b = -1;
  for (let i = a + 1; i < lines.length; i++) { if (lines[i] === TAIL) { b = i; break; } }
  if (b < 0) { throw new Error('analyze() の尾が見つかりません'); }
  const deps = DECLS.map(d => readDecl(lines, d)).join('\n');
  return { src: lines.slice(a, b + 1).join('\n'), deps, from: a + 1, to: b + 1 };
}

/* 差し込んで呼べる形にする。四つの値は引数で渡す。
   ＊この四つが analyze() の外にある値のすべて（本体 1750〜1755行の見晴らし）。 */
function makeAnalyze(file) {
  const got = readAnalyzeSource(file);
  const fn = new Function('hand', 'seatWind', 'roundWind', 'doraCount',
                          got.deps + '\n' + got.src + '\nreturn analyze();');
  const call = (hand, seatWind, roundWind, doraCount) =>
    fn(hand, seatWind || null, roundWind || null, doraCount || 0);
  call.from = got.from;
  call.to = got.to;
  call.lines = got.to - got.from + 1;
  return call;
}

/* ---- 手牌の組み立て ----
   本体の parseDigits と同じ牌の形（{suit,label,num,code,red}）を作る。
   analyze() が見るのは suit / code / num / red の四つだけ。
     "234m567p88s123z" … m=萬 p=筒 s=索 z=字（1東2南3西4北5白6發7中）
     0 は赤五。猫 は猫牌。 */
const HONOR_BY_Z = { '1': 'E', '2': 'S', '3': 'W', '4': 'N', '5': 'P', '6': 'F', '7': 'C' };
const HONOR_LABEL = { E: '東', S: '南', W: '西', N: '北', P: '白', F: '發', C: '中' };

function parseHand(raw) {
  const tiles = [];
  let buf = [];
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch >= '0' && ch <= '9') { buf.push(ch); continue; }
    const low = ch.toLowerCase();
    const suit = (low === 'm') ? 'man' : (low === 'p') ? 'pin' : (low === 's') ? 'sou' : null;
    if (suit) {
      buf.forEach(d => {
        const red = d === '0';
        const num = red ? 5 : +d;
        tiles.push({ suit, label: String(num), num, code: suit[0] + num, red });
      });
      buf = [];
      continue;
    }
    if (low === 'z') {
      buf.forEach(d => {
        const code = HONOR_BY_Z[d];
        if (code) { tiles.push({ suit: 'honor', label: HONOR_LABEL[code], num: 0, code, red: false }); }
      });
      buf = [];
      continue;
    }
    if (ch === '猫') { tiles.push({ suit: 'cat', label: '🐱', num: 0, code: 'cat', red: false }); }
  }
  return tiles;
}

/* 画面と突き合わせる項目。analyze() の返しのうち、数と真偽と字で比べられるもの。 */
const FIELDS = [
  'verdict', 'borderline', 'baseShanten', 'acceptTypes', 'acceptTiles',
  'widthLabel', 'widthGood', 'goodShapes', 'weakShapes', 'totalBlocks',
  'shapeOK', 'shapeNeeded', 'fillGood', 'fillWeak', 'fillRemain',
  'hasValue', 'doraValue', 'doraCount', 'redCount', 'yakuhaiPair',
  'kokushiSeen', 'kokushiKinds', 'kokushiShanten',
  'yakumanReach', 'yakumanName', 'isDealer', 'defHonors', 'defTerminals'
];

/* 突き合わせ用の10通り。狙いを散らしてある。
   ＊枚数は 10〜13 に収める。本体の判定釦は 1991行で
     `judgeBtn.disabled = (hand.length < 10 || hand.length > 13)` と決めており、
     9枚以下・14枚以上は画面から判定を押せない＝突き合わせの相手が出ない。 */
const TEN = [
  { name: '1_門前の良形',     hand: '234m567p88s234s1z', seat: 'E', round: 'E', dora: 0 },
  { name: '2_染め寄り',       hand: '123456789m11p2z',   seat: 'S', round: 'E', dora: 0 },
  { name: '3_字牌が厚い',     hand: '19m19p19s1234567z', seat: 'W', round: 'E', dora: 0 },
  { name: '4_七対子の手',     hand: '1199m2288p3377s',   seat: 'N', round: 'S', dora: 0 },
  { name: '5_国士が見える',   hand: '119m19p19s12345z',  seat: 'E', round: 'E', dora: 0 },
  { name: '6_赤五を含む',     hand: '2340m567p88s12z',   seat: 'E', round: 'E', dora: 0 },
  { name: '7_猫牌を含む',     hand: '234m567p88s2z猫猫', seat: 'S', round: 'E', dora: 0 },
  { name: '8_十三枚そろい',   hand: '234m567p888s1234z', seat: 'E', round: 'E', dora: 0 },
  { name: '9_十枚ぎりぎり',   hand: '234m567p88s12z',    seat: 'E', round: 'E', dora: 0 },
  { name: '10_役牌が厚い',    hand: '555z666z777z11m2m', seat: 'E', round: 'E', dora: 0 }
];

function pick(res) {
  const o = {};
  FIELDS.forEach(k => { if (k in res) { o[k] = res[k]; } });
  if (res.tooMany) { o.tooMany = true; }
  return o;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const analyze = makeAnalyze();
  if (args.includes('--selftest') || args.length === 0) {
    const out = TEN.map(t => ({
      name: t.name, hand: t.hand, seat: t.seat, round: t.round, dora: t.dora,
      result: pick(analyze(parseHand(t.hand), t.seat, t.round, t.dora))
    }));
    console.log(JSON.stringify({ from: analyze.from, to: analyze.to, lines: analyze.lines, cases: out }, null, 1));
  } else {
    const si = args.indexOf('--seat');
    const ri = args.indexOf('--round');
    const di = args.indexOf('--dora');
    const seat = si >= 0 ? args[si + 1] : 'E';
    const round = ri >= 0 ? args[ri + 1] : 'E';
    const dora = di >= 0 ? +args[di + 1] : 0;
    console.log(JSON.stringify(pick(analyze(parseHand(args[0]), seat, round, dora)), null, 1));
  }
}

module.exports = { makeAnalyze, readAnalyzeSource, parseHand, FIELDS, TEN, pick };
