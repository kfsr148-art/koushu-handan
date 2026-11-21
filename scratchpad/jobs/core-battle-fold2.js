// 雲で：降り切る打ち手の測り（二段目）——撤退予約線の守り版「6巡目までに字牌と端と対子を合わせて7枚」の数を確かめる（2026-11-21・枠 三十四）
//   ＊元の設計は reports/y1121-1830.md の「雲で回す設計」の二段目。本体（koushu-handan.html）と核（advice-tone-core.js）には触らない。
//     配牌の判定は core-probe.js 越しに本体の analyze() の字面を読むだけ（core-battle.js と同じ・ドラ枚数は 0 で渡す）。
//   ＊打ち手：@kobalab/majiang-ai を継いだ「降り切る打ち手」。守りと出た席だけがこう打つ。
//       ・鳴かない・槓しない・リーチしない（和了の形になった時だけは上がる。九種九牌は元の打ち手と同じく流す）
//       ・リーチが来る前：浮いた数牌（2〜8の一枚きり）を真ん中から切る（456→37→28）。字牌・端（19）・対子以上は最後まで抱える。
//         ドラとその隣（赤五も）は、自分の6打目までは同じ格の中で先に切り、7打目からは浮いた数牌の中で最後に回す（本人の決め③）。
//         浮いた数牌が尽きたら：端の一枚→暗刻の一枚→字牌の一枚（見えていない字牌から）→真ん中の対子→端の対子→字牌の対子。
//       ・他家のリーチが入った後：下の「格」が一番小さい牌を切る（リーチ者が二人以上なら、一番悪い格で比べる）。
//         同じ格なら、自分の前の打牌の後に他家が切った牌（合わせ打ち）→他の席の河にもある牌→抱える値打ちの低い牌、の順。
//       ・格：0 現物／1 字牌（残り0枚＝自分しか持っていない）／2 スジの19・字牌（残り1枚）／3 字牌（残り2枚）／4 スジの28／
//             5 スジの37・無スジの19・生牌の字牌／6 両スジの456／7 無スジの28／8 無スジの37・片スジの456／9 無スジの456
//   ＊的（まと）：降り切る打ち手は一席ごとに、でたらめに 5・6・7・99 のどれかの的を持つ。リーチが来る前、手の「字牌＋端＋対子以上」が的を越えたら、
//     浮いた数牌でなく、その中の値打ちの低い牌（端の一枚→字牌の一枚…）の方を切る。的 99 は全部抱える（上の決まりそのまま）。
//     「7枚の線」を 5枚・6枚・7枚・抱えるだけ抱える、で比べるための腕。リーチの後の降り方は、どの的も同じ。
//   ＊場は二通り。4本を並べて回す（一本は時間で止める。局は毎回でたらめに配られる。種は固定しない）。
//       all … 守りと出た席が全部、降り切る打ち手（卓の三人前後が降りるので、リーチが少なく流局が多い場になる）
//       one … 守りと出た席のうち一席だけが降り切る打ち手。残りは元の機械打ち（同じ卓の機械打ちの守りの席が、そのまま比べる相手になる）
//   ＊記録は一席一行。reports/cloud-core-battle-fold2-<刻>.tsv に残す。走るたびに、前の走りの tsv も足した通しの表を出す。
//   ＊手元の極小の試し： node scratchpad/jobs/core-battle-fold2.js --local 2  （npm ci をせず、二通りを2局ずつ。記録は一時の所に書いて消す）
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const MODES = ['all', 'all', 'one', 'one'];          /* 4本の割り振り */
const WORK_MS = 1230 * 1000, KILL_MS = 1320 * 1000;  /* job.yml の上限は台本ごと1500秒 */
const NAME = 'cloud-core-battle-fold2-';
const WIND = ['E', 'S', 'W', 'N'];
const TARGETS = [5, 6, 7, 99];                       /* 降り切る打ち手の的（リーチの前に抱える枚数の上限） */
const HEAD = ['本', '局', '場', '席', '親', '配牌', 'verdict', '分け', 'baseShanten', '打ち手', '的',
  '安全0', '安全6', '字6', '端6', '対6', '打数', '自リーチ打目',
  '受リーチ', 'リーチ者', 'リーチ巡', '受時の自打数', '安全R', '字R', '現物R', '向聴R',
  '後の打数', '後の現物切り', '後の非現物切り', '現物切れ打目', '最大の格',
  '結果', '放銃先リーチ', '放銃牌の格', '点棒', '順位', '巡目', 'ドラ表示牌', '打牌列'];

/* ---------- 格（危険度の段）。sp は SuanPai（その席から見えている牌の数えと、席ごとの現物） ---------- */
function rankVs(sp, l, s, n) {
  const gen = sp._dapai[l] || {};
  if (gen[s + n]) { return 0; }
  const u = sp._paishu[s][n];
  if (s === 'z') { return u <= 0 ? 1 : u === 1 ? 2 : u === 2 ? 3 : 5; }
  const lo = (n >= 4) && !!gen[s + (n - 3)], hi = (n <= 6) && !!gen[s + (n + 3)];
  if (n === 1 || n === 9) { return (lo || hi) ? 2 : 5; }
  if (n === 2 || n === 8) { return (lo || hi) ? 4 : 7; }
  if (n === 3 || n === 7) { return (lo || hi) ? 5 : 8; }
  return (lo && hi) ? 6 : (lo || hi) ? 8 : 9;
}
function riichiSeats(sp, me) {
  const out = [];
  for (let l = 0; l < 4; l++) { if (l !== me && sp._lizhi[l]) { out.push(l); } }
  return out;
}
function rankAll(sp, lz, s, n) {
  let mx = 0, sum = 0;
  lz.forEach(l => { const r = rankVs(sp, l, s, n); if (r > mx) { mx = r; } sum += r; });
  return [mx, sum];
}
/* 手の中の「字牌＋端＋対子以上」の枚数（core-battle.js の安全列と同じ数え）。 */
function countSafe(shoupai) {
  let s = 0, h = 0, t = 0, p = 0;
  ['m', 'p', 's', 'z'].forEach(k => {
    const b = shoupai._bingpai[k];
    for (let n = 1; n <= (k === 'z' ? 7 : 9); n++) {
      const c = b[n];
      if (!c) { continue; }
      const hon = (k === 'z'), ter = (k !== 'z' && (n === 1 || n === 9));
      if (hon) { h += c; } else if (ter) { t += c; }
      if (c >= 2) { p++; }
      if (hon || ter || c >= 2) { s += c; }
    }
  });
  return { s: s, h: h, t: t, p: p };
}
function cmpArr(a, b) {
  for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) { return a[i] - b[i]; } }
  return 0;
}

/* ---------- 対局の側（--worker と --local が使う） ---------- */
function makeTable() {
  const Majiang = require('@kobalab/majiang-core');
  const AI = require('@kobalab/majiang-ai');
  const SuanPai = require(path.join(ROOT, 'node_modules', '@kobalab', 'majiang-ai', 'lib', 'suanpai.js'));
  const { makeAnalyze, parseHand } = require(path.join(ROOT, 'core-probe.js'));
  const analyze = makeAnalyze();
  const rule = Majiang.rule({ '場数': 0 });   /* 一局戦 */

  function toProbeHand(s) {
    const out = [], re = /([mpsz])([0-9]+)/g;
    let m;
    while ((m = re.exec(String(s || '')))) { out.push(m[2] + m[1]); }
    return out.join('');
  }
  /* 配牌の判定と六つの分け（本体 advLines0 の守りの分け方と同じ決まり）。 */
  function judge(paistr, l, zhuang) {
    const hand = toProbeHand(paistr), tiles = parseHand(hand);
    let a;
    try { a = analyze(tiles, WIND[l], WIND[zhuang] || 'E', 0); } catch (e) { a = {}; }
    const cnt = {};
    tiles.forEach(t => { const k = (t.suit === 'honor') ? t.code : (t.suit[0] + t.num); cnt[k] = (cnt[k] || 0) + 1; });
    const pairKinds = Object.keys(cnt).filter(k => cnt[k] >= 2).length;
    const sh = a.baseShanten, def = (a.defHonors || 0) + (a.defTerminals || 0);
    const defLine = (sh <= 3) ? 5 : 6;
    let w = 'shape';
    if (sh >= 3 && !a.hasValue && !a.doraValue) { w = 'cheap'; }
    else if (sh >= 3) { w = 'far'; }
    else if (a.goodShapes <= 1) { w = 'shape'; }
    else if (def >= defLine) { w = 'honor'; }
    else if (def <= 1) { w = 'few'; }
    else if (pairKinds >= 3) { w = 'pair'; }
    return { hand: hand, verdict: a.verdict || '', sh: (sh === undefined ? '' : sh), w: (a.verdict === 'defend') ? w : '' };
  }

  /* 降り切る打ち手。_fold が偽の席は、元の機械打ちのまま。 */
  class FoldAI extends AI {
    constructor(ctx) { super(); this._ctx = ctx; this._fold = false; this._target = 99; this._since = {}; this._nd = 0; }
    qipai(qipai) {
      this._since = {}; this._nd = 0; this._fold = false;
      super.qipai(qipai);
      this._fold = this._ctx.isFolder(this._menfeng);
      this._target = this._fold ? this._ctx.target[this._menfeng] : 99;
    }
    dapai(dapai) {
      const k = dapai.p[0] + (+dapai.p[1] || 5);
      if (dapai.l === this._menfeng) { this._since = {}; this._nd++; } else { this._since[k] = true; }
      super.dapai(dapai);
    }
    select_fulou(dapai, info) { return this._fold ? undefined : super.select_fulou(dapai, info); }
    select_gang(info) { return this._fold ? undefined : super.select_gang(info); }
    select_dapai(info) { return this._fold ? this.foldDapai() : super.select_dapai(info); }
    doraNear(p, s, n) {
      if (s === 'z') { return false; }
      if (p[1] === '0') { return true; }
      for (const bp of this._suanpai._baopai) {
        const d = Majiang.Shan.zhenbaopai(bp);
        if (d[0] === s && Math.abs((+d[1] || 5) - n) <= 1) { return true; }
      }
      return false;
    }
    keepValue(p, s, n) {
      const c = this.shoupai._bingpai[s][n], u = this._suanpai._paishu[s][n];
      if (s === 'z') { return c >= 2 ? 18 : 13 + (3 - u); }
      if (n === 1 || n === 9) { return c >= 3 ? 12 : c === 2 ? 16 : 10; }
      if (c >= 3) { return 11; }
      if (c === 2) { return 15; }
      const base = (n >= 4 && n <= 6) ? 0 : (n === 3 || n === 7) ? 1 : 2;
      if (this.doraNear(p, s, n)) { return (this._nd + 1 <= 6) ? base - 0.5 : base + 5; }
      return base;
    }
    foldDapai() {
      const sp = this._suanpai, me = this._menfeng, lz = riichiSeats(sp, me);
      let best = null, bestKey = null;
      const over = !lz.length && countSafe(this.shoupai).s > this._target;
      const seen = {};
      for (const p of this.get_dapai(this.shoupai)) {
        const s = p[0], n = +p[1] || 5, k = s + n;
        if (seen[k]) { continue; }
        seen[k] = true;
        const kv = this.keepValue(p, s, n);
        let key;
        if (lz.length) {
          const r = rankAll(sp, lz, s, n);
          let others = 0;
          for (let l = 0; l < 4; l++) { if (l !== me && sp._dapai[l][k]) { others++; } }
          const c = this.shoupai._bingpai[s][n];
          key = [r[0], r[1], this._since[k] ? 0 : 1, -others, (r[0] > 0 ? -c : 0), kv];
        } else {
          key = [(over && kv < 10) ? 1 : 0, kv];
        }
        if (!bestKey || cmpArr(key, bestKey) < 0) { bestKey = key; best = p; }
      }
      return best;
    }
  }

  /* 一局を打って、四席ぶんの行（配列の配列）を返す。 */
  function playOne(mode, part, no) {
    const ctx = {
      game: null, judged: null, folders: null, target: {},
      isFolder(l) {
        if (!this.folders) {
          const m = this.game.model;
          this.judged = [0, 1, 2, 3].map(x => judge(m.shoupai[x].toString(), x, m.zhuangfeng));
          const defs = [0, 1, 2, 3].filter(x => this.judged[x].verdict === 'defend');
          this.folders = {};
          defs.forEach(x => { this.target[x] = TARGETS[Math.floor(Math.random() * TARGETS.length)]; });
          if (mode === 'all') { defs.forEach(x => { this.folders[x] = true; }); }
          else if (defs.length) { this.folders[defs[Math.floor(Math.random() * defs.length)]] = true; }
        }
        return !!this.folders[l];
      }
    };
    let paipu = null;
    const players = [0, 1, 2, 3].map(() => new FoldAI(ctx));
    const game = new Majiang.Game(players, p => { paipu = p; }, rule, 'fold2');
    ctx.game = game;
    game.speed = 0;
    game.stop = null;
    game.do_sync();
    if (!paipu || !paipu.log || !paipu.log.length || !ctx.judged) { return []; }
    const kyoku = paipu.log[0], qipai = (kyoku[0] || {}).qipai;
    if (!qipai) { return []; }
    let z = 0;
    kyoku.forEach(e => { if (e && e.zimo) { z++; } });
    const jun = Math.ceil(z / 4);
    const hules = kyoku.filter(e => e && e.hule).map(e => e.hule);
    const pingju = (kyoku.filter(e => e && e.pingju)[0] || {}).pingju;
    const rows = [];
    for (let l = 0; l < 4; l++) {
      const j = ctx.judged[l];
      const sp = new SuanPai(rule['赤牌']);
      sp.qipai(qipai, l);
      const hand = Majiang.Shoupai.fromString(qipai.shoupai[l]);
      const s0 = countSafe(hand);
      const nds = [0, 0, 0, 0], cuts = [];
      let s6 = null, selfRiichi = '', rc = null, lastRank = '';
      const post = { n: 0, gen: 0, non: 0, firstNon: '', max: '' };
      for (const e of kyoku) {
        if (!e) { continue; }
        if (e.zimo) { if (e.zimo.l === l) { hand.zimo(e.zimo.p, false); } sp.zimo(e.zimo); }
        else if (e.gangzimo) { if (e.gangzimo.l === l) { hand.zimo(e.gangzimo.p, false); } sp.zimo(e.gangzimo); }
        else if (e.fulou) { if (e.fulou.l === l) { hand.fulou(e.fulou.m, false); } sp.fulou(e.fulou); }
        else if (e.gang) { if (e.gang.l === l) { hand.gang(e.gang.m, false); } sp.gang(e.gang); }
        else if (e.kaigang) { sp.kaigang(e.kaigang); }
        else if (e.dapai) {
          const d = e.dapai, s = d.p[0], n = +d.p[1] || 5;
          nds[d.l]++;
          if (d.l === l) {
            const lz = riichiSeats(sp, l);
            lastRank = '';
            if (lz.length) {
              const r = rankAll(sp, lz, s, n)[0];
              lastRank = r;
              post.n++;
              if (r === 0) { post.gen++; } else { post.non++; if (post.firstNon === '') { post.firstNon = post.n; } }
              if (post.max === '' || r > post.max) { post.max = r; }
            }
            hand.dapai(d.p, false);
            sp.dapai(d);
            cuts.push(d.p);
            if (d.p.slice(-1) === '*') { selfRiichi = nds[l]; }
            if (nds[l] === 6) { s6 = countSafe(hand); }
          } else {
            sp.dapai(d);
            if (d.p.slice(-1) === '*' && !rc) {
              const c = countSafe(hand);
              let g = 0;
              ['m', 'p', 's', 'z'].forEach(k => {
                for (let x = 1; x <= (k === 'z' ? 7 : 9); x++) { if (hand._bingpai[k][x] && sp._dapai[d.l][k + x]) { g += hand._bingpai[k][x]; } }
              });
              rc = { by: d.l, turn: nds[d.l], my: nds[l], s: c.s, h: c.h, g: g, x: Majiang.Util.xiangting(hand) };
            }
          }
        }
      }
      let res = '無関係', toRiichi = '', pts = 0;
      if (hules.length) {
        const won = hules.some(h => h.l === l), dealt = hules.filter(h => typeof h.baojia === 'number' && h.baojia === l);
        if (won) { res = '和了'; }
        else if (dealt.length) { res = '放銃'; toRiichi = dealt.some(h => sp._lizhi[h.l]) ? 1 : 0; }
        else if (hules.some(h => typeof h.baojia !== 'number')) { res = '被ツモ'; }
        hules.forEach(h => { pts += (h.fenpei && h.fenpei[l]) || 0; });
      } else if (pingju) {
        res = '流局';
        pts = (pingju.fenpei && pingju.fenpei[l]) || 0;
      }
      const id = (paipu.qijia + l) % 4;
      const fold = !!ctx.folders[l];
      rows.push([part, no, mode, l, (l === 0 ? 1 : 0), j.hand, j.verdict, j.w, j.sh, (fold ? 'fold' : 'ai'), (fold ? ctx.target[l] : ''),
        s0.s, (s6 ? s6.s : ''), (s6 ? s6.h : ''), (s6 ? s6.t : ''), (s6 ? s6.p : ''), nds[l], selfRiichi,
        (rc ? 1 : 0), (rc ? rc.by : ''), (rc ? rc.turn : ''), (rc ? rc.my : ''), (rc ? rc.s : ''), (rc ? rc.h : ''), (rc ? rc.g : ''), (rc ? rc.x : ''),
        post.n, post.gen, post.non, post.firstNon, post.max,
        res, toRiichi, (res === '放銃' ? lastRank : ''), pts, ((paipu.rank || [])[id] || ''), jun, (qipai.baopai || ''), (fold ? cuts.join(',') : '')]);
    }
    return rows;
  }
  return { playOne: playOne };
}

/* 時間か局数の先に来た方で止まる。一局ごとに書き足すので、切られても済んだ局は残る。 */
function work(mode, out, ms, part, maxGames) {
  const table = makeTable();
  const t0 = Date.now();
  let n = 0, err = 0;
  fs.writeFileSync(out, HEAD.join('\t') + '\n');
  while (Date.now() - t0 < ms && n < maxGames) {
    n++;
    try {
      const rows = table.playOne(mode, part, part * 100000 + n);
      if (rows.length) { fs.appendFileSync(out, rows.map(r => r.join('\t')).join('\n') + '\n'); }
    } catch (e) {
      err++;
      if (err <= 5) { console.error('本' + part + '（' + mode + '）' + n + '局目で落ちた: ' + ((e && e.stack) || e)); }
    }
  }
  console.error('本' + part + '（' + mode + '） … ' + n + '局・落ちた局 ' + err + '・' + Math.round((Date.now() - t0) / 1000) + '秒');
}

/* ---------- 数える側 ---------- */
function readRows(file) {
  const ls = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#');
  if (!ls.length || ls[0] !== HEAD.join('\t')) { return null; }
  return ls.slice(1).map(l => { const c = l.split('\t'), o = {}; HEAD.forEach((h, i) => { o[h] = (c[i] === undefined ? '' : c[i]); }); return o; });
}
const num = v => Number(v) || 0;
const pct = (a, b) => b ? (a / b * 100).toFixed(1) + '%（' + a + '）' : '-';
const avg = (xs, d) => xs.length ? (xs.reduce((x, y) => x + y, 0) / xs.length).toFixed(d === undefined ? 1 : d) : '-';
const bucket = v => (v === '' ? '6打目の前に終局' : (+v <= 4) ? '4枚以下' : (+v >= 8) ? '8枚以上' : (+v + '枚'));
const BUCKETS = ['4枚以下', '5枚', '6枚', '7枚', '8枚以上'];
const got = r => r['受リーチ'] === '1' && num(r['後の打数']) >= 1;          /* 他家のリーチを受け、その後一度以上切った */
const dealR = r => r['結果'] === '放銃' && r['放銃先リーチ'] === '1';
const clean = r => num(r['後の非現物切り']) === 0;                          /* リーチの後に切った牌が全部現物 */
const GROUPS = [
  ['one・降り切る打ち手', r => r['場'] === 'one' && r['打ち手'] === 'fold'],
  ['one・機械打ちのまま（同じ卓）', r => r['場'] === 'one' && r['打ち手'] === 'ai'],
  ['all・降り切る打ち手', r => r['場'] === 'all' && r['打ち手'] === 'fold']
];
function lineA(label, xs) {
  const rc = xs.filter(r => got(r) && num(r['受時の自打数']) >= 6);
  return '| ' + label + ' | ' + xs.length + ' | ' + pct(xs.filter(r => r['結果'] === '和了').length, xs.length) + ' | ' + pct(xs.filter(r => r['結果'] === '放銃').length, xs.length)
    + ' | ' + avg(xs.map(r => num(r['点棒'])), 0) + ' | ' + avg(xs.map(r => num(r['順位'])), 2) + ' | ' + pct(xs.filter(r => r['順位'] === '4').length, xs.length)
    + ' | ' + rc.length + ' | ' + pct(rc.filter(dealR).length, rc.length) + ' | ' + pct(rc.filter(r => r['結果'] === '放銃').length, rc.length) + ' | ' + pct(rc.filter(clean).length, rc.length) + ' |';
}
function lineB(label, xs) {
  const cut = xs.filter(r => r['現物切れ打目'] !== '').map(r => num(r['現物切れ打目']));
  return '| ' + label + ' | ' + xs.length + ' | ' + avg(xs.map(r => num(r['現物R']))) + ' | ' + pct(xs.filter(dealR).length, xs.length) + ' | ' + pct(xs.filter(r => r['結果'] === '放銃').length, xs.length)
    + ' | ' + pct(xs.filter(clean).length, xs.length) + ' | ' + avg(cut) + ' | ' + avg(xs.map(r => num(r['点棒'])), 0) + ' | ' + avg(xs.map(r => num(r['順位'])), 2) + ' |';
}
function summarize(rows, title) {
  const P = s => console.log(s);
  P(''); P('## ' + title); P('');
  ['all', 'one'].forEach(m => {
    const xs = rows.filter(r => r['場'] === m);
    const games = {};
    xs.forEach(r => { const g = games[r['局']] || (games[r['局']] = { ri: 0, end: r['結果'] === '流局' ? '流局' : '', jun: num(r['巡目']) }); if (r['自リーチ打目'] !== '') { g.ri++; } });
    const gs = Object.keys(games).map(k => games[k]);
    const fo = xs.filter(r => r['打ち手'] === 'fold').length, de = xs.filter(r => r['verdict'] === 'defend').length;
    P('- 場 ' + m + '：' + gs.length + '局／守りと出た席 ' + pct(de, xs.length) + '／降り切る打ち手の席 ' + fo + '／リーチが入った局 ' + pct(gs.filter(g => g.ri > 0).length, gs.length)
      + '／流局 ' + pct(gs.filter(g => g.end === '流局').length, gs.length) + '／終わった巡目の平均 ' + avg(gs.map(g => g.jun)));
  });
  const def = rows.filter(r => r['verdict'] === 'defend');
  P(''); P('### イ、6打目を切った後の「字牌＋端＋対子」の枚数ごと（守りと出た席・全部の結末）');
  P(''); P('＊右の四列は、自分の6打目より後に他家の最初のリーチが来て、その後一度以上切った手だけ。「降り切れた」＝リーチの後に切った牌が全部現物。'); P('');
  GROUPS.forEach(g => {
    const xs = def.filter(g[1]);
    P('**' + g[0] + '**（' + xs.length + '手）'); P('');
    P('| 6打目の後の枚数 | 手 | 和了 | 放銃 | 平均の点棒 | 平均の順位 | ラス | リーチを受けた手 | リーチ者へ放銃 | 放銃（全部） | 降り切れた |');
    P('|---|---|---|---|---|---|---|---|---|---|---|');
    BUCKETS.forEach(b => P(lineA(b, xs.filter(r => bucket(r['安全6']) === b))));
    P(lineA('**線の内（7枚以上）**', xs.filter(r => r['安全6'] !== '' && +r['安全6'] >= 7)));
    P(lineA('**線の外（6枚以下）**', xs.filter(r => r['安全6'] !== '' && +r['安全6'] <= 6)));
    P(lineA('6打目の前に終局', xs.filter(r => r['安全6'] === '')));
    P('');
  });
  P('### ロ、最初のリーチを受けた時の「字牌＋端＋対子」の枚数ごと（守りと出た席・リーチの後に一度以上切った手）'); P('');
  GROUPS.forEach(g => {
    const xs = def.filter(g[1]).filter(got);
    P('**' + g[0] + '**（' + xs.length + '手）'); P('');
    P('| リーチの時の枚数 | 手 | その時の現物の平均 | リーチ者へ放銃 | 放銃（全部） | 降り切れた | 現物が切れた打目の平均 | 平均の点棒 | 平均の順位 |');
    P('|---|---|---|---|---|---|---|---|---|');
    BUCKETS.forEach(b => P(lineB(b, xs.filter(r => bucket(r['安全R']) === b))));
    P(lineB('7枚以上', xs.filter(r => +r['安全R'] >= 7)));
    P(lineB('6枚以下', xs.filter(r => +r['安全R'] <= 6)));
    P(lineB('（うち 6巡目までのリーチ）', xs.filter(r => num(r['リーチ巡']) <= 6)));
    P(lineB('（うち 7巡目からのリーチ）', xs.filter(r => num(r['リーチ巡']) >= 7)));
    P('');
  });
  P('### ハ、六つの分けごと（降り切る打ち手・one と all を足す）'); P('');
  P('| 分け | 手 | 6打目の後の枚数の平均 | 7枚以上だった手 | リーチを受けた手 | リーチ者へ放銃 | 降り切れた | 平均の点棒 | 平均の順位 |');
  P('|---|---|---|---|---|---|---|---|---|');
  ['cheap', 'far', 'shape', 'honor', 'few', 'pair'].forEach(w => {
    const xs = def.filter(r => r['打ち手'] === 'fold' && r['分け'] === w), six = xs.filter(r => r['安全6'] !== ''), rc = xs.filter(got);
    P('| ' + w + ' | ' + xs.length + ' | ' + avg(six.map(r => num(r['安全6']))) + ' | ' + pct(six.filter(r => +r['安全6'] >= 7).length, six.length) + ' | ' + rc.length
      + ' | ' + pct(rc.filter(dealR).length, rc.length) + ' | ' + pct(rc.filter(clean).length, rc.length) + ' | ' + avg(xs.map(r => num(r['点棒'])), 0) + ' | ' + avg(xs.map(r => num(r['順位'])), 2) + ' |');
  });
  P(''); P('### ヘ、的ごと（降り切る打ち手・リーチの前に抱える枚数の上限を 5／6／7／99＝全部 に振った腕）');
  P(''); P('＊右の四列は イ と同じ（自分の6打目より後に最初のリーチが来て、その後一度以上切った手）。all は卓の守りの席が全部降りる場なので、点棒と順位は one の方を読む。'); P('');
  ['one', 'all'].forEach(m => {
    const xs = def.filter(r => r['場'] === m && r['打ち手'] === 'fold');
    P('**' + m + '・降り切る打ち手**（' + xs.length + '手）'); P('');
    P('| 的 | 手 | 和了 | 放銃 | 平均の点棒 | 平均の順位 | ラス | リーチを受けた手 | リーチ者へ放銃 | 放銃（全部） | 降り切れた |');
    P('|---|---|---|---|---|---|---|---|---|---|---|');
    TARGETS.forEach(t => { const ys = xs.filter(r => r['的'] === String(t)); P(lineA((t === 99 ? '全部抱える' : t + '枚まで') + '（6打目の後 平均' + avg(ys.filter(r => r['安全6'] !== '').map(r => num(r['安全6']))) + '枚）', ys)); });
    P('');
  });
  P('### ニ、放銃した牌の格（降り切る打ち手・リーチ者へ放銃した手）'); P('');
  const dl = def.filter(r => r['打ち手'] === 'fold' && dealR(r)), byRank = {};
  dl.forEach(r => { byRank[r['放銃牌の格']] = (byRank[r['放銃牌の格']] || 0) + 1; });
  P('格ごとの手数 … ' + (Object.keys(byRank).sort().map(k => '格' + k + '＝' + byRank[k]).join('／') || '無し') + '（格0の放銃は、リーチ者でない席への放銃か数えの誤りなので、出たら調べる）');
  P(''); P('### ホ、攻めと出た席（比べる相手）'); P('');
  P('| 場 | 手 | 和了 | 放銃 | 平均の点棒 | 平均の順位 |'); P('|---|---|---|---|---|---|');
  ['all', 'one'].forEach(m => {
    const xs = rows.filter(r => r['場'] === m && r['verdict'] === 'attack');
    P('| ' + m + ' | ' + xs.length + ' | ' + pct(xs.filter(r => r['結果'] === '和了').length, xs.length) + ' | ' + pct(xs.filter(r => r['結果'] === '放銃').length, xs.length)
      + ' | ' + avg(xs.map(r => num(r['点棒'])), 0) + ' | ' + avg(xs.map(r => num(r['順位'])), 2) + ' |');
  });
}

/* ---------- 入口 ---------- */
const argv = process.argv.slice(2);
if (argv[0] === '--worker') {
  work(argv[1], argv[2], Number(argv[3]), Number(argv[4]), Infinity);
} else if (argv[0] === '--local') {
  const n = Math.max(1, Math.min(5, Number(argv[1]) || 2));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-fold2-'));
  let rows = [];
  ['all', 'one'].forEach((m, k) => {
    const f = path.join(dir, 'part-' + k + '.tsv');
    work(m, f, 80 * 1000, k, n);
    rows = rows.concat(readRows(f) || []);
  });
  console.log(HEAD.join('\t'));
  rows.slice(0, 8).forEach(r => console.log(HEAD.map(h => r[h]).join('\t')));
  summarize(rows, '手元の極小の試し（' + n + '局ずつ・数は当てにならない）');
  fs.rmSync(dir, { recursive: true, force: true });
} else {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const OUT = path.join(ROOT, 'reports', NAME + stamp + '.tsv');
  console.log('依存を入れる（npm ci）…');
  execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' });
  console.log('降り切る打ち手の測りを ' + MODES.length + '本（' + MODES.join('・') + '）並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止まる・' + KILL_MS / 1000 + '秒で切る）');
  const t0 = Date.now(), files = [], runs = [];
  MODES.forEach((m, k) => {
    const f = path.join(ROOT, 'reports', '.fold2-part-' + k + '.tsv');
    files.push(f);
    runs.push(new Promise(res => {
      const p = spawn(process.execPath, [__filename, '--worker', m, f, String(WORK_MS), String(k)], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
      const timer = setTimeout(() => { try { p.kill('SIGKILL'); } catch (e) { } }, KILL_MS);
      p.on('exit', code => { clearTimeout(timer); res(code); });
    }));
  });
  Promise.all(runs).then(codes => {
    let rows = [], body = [];
    files.forEach(f => {
      if (!fs.existsSync(f)) { return; }
      const ls = fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l);
      /* 切られた本は、最後の行が途中で終わっている事がある。列の数が足りない行は捨てる。 */
      body = body.concat(ls.slice(1).filter(l => l.split('\t').length === HEAD.length));
      fs.unlinkSync(f);
    });
    if (!body.length) { console.log('記録が一行も書けなかった（終了コード ' + JSON.stringify(codes) + '）'); process.exit(1); }
    fs.writeFileSync(OUT, '# 雲で回した 降り切る打ち手の測り（二段目・' + MODES.join('/') + '・' + stamp + ' UTC）。守りと出た席を降り切る打ち手に差し替えた。他は機械打ち（@kobalab/majiang-ai）\n' + HEAD.join('\t') + '\n' + body.join('\n') + '\n');
    rows = readRows(OUT) || [];
    console.log('');
    console.log('終了コード ' + JSON.stringify(codes) + '／' + Math.round((Date.now() - t0) / 1000) + '秒／' + rows.length + '行');
    console.log('記録 … reports/' + path.basename(OUT));
    summarize(rows, '今回の走り');
    /* 前の走りの記録も足した通しの表（見出しが同じ物だけ）。 */
    const olds = fs.readdirSync(path.join(ROOT, 'reports')).filter(n => n.indexOf(NAME) === 0 && n.slice(-4) === '.tsv').sort();
    if (olds.length > 1) {
      let all = [];
      const used = [];
      olds.forEach((n, i) => {
        const r = readRows(path.join(ROOT, 'reports', n));
        if (!r) { return; }
        r.forEach(x => { x['局'] = i + '-' + x['局']; });
        all = all.concat(r);
        used.push(n);
      });
      summarize(all, '通し（' + used.length + '本の記録を足した・' + used.join('、') + '）');
    }
  });
}
