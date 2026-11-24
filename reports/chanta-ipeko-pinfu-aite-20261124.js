// 雲で：チャンタ・純チャン／一盃口・二盃口／平和 の「相手あり」の測り・橋の枠 二百六十。reports/tanyao-sanshoku-sangen-aite-20261124.js の型を三件へ広げた写し。風牌は見ない決め（平和の雀頭は『三元牌でない』だけを見る）。
//   ＊majiang-core の一局戦。子の一席（1〜3をでたらめ）に作り配牌を積み、その席だけ「その役に決める打ち手」。他三席は @kobalab/majiang-ai のまま。
//   ＊同じ作り配牌・同じ山を、その席の打ち手だけ替えて打つ（腕）。山は種つきで自分で並べる（同じ枠・同じ周・同じ本なら全腕で同じ山）。
//   ＊件は --only chantai|ipeko|pinfu で別々に回せる（既定は三件とも）。記録は件ごとに別ファイル reports/cloud-<件>-aite-<刻>.tsv。
//   ＊本体（koushu-handan.html）・核には触らない。この台本は reports/ に置く（scratchpad/jobs に置くと雲の自動走りが起きるため）。
//
//   ■ 件 chantai（チャンタ・純チャン）  形の和了＝混全帯幺九／純全帯幺九
//     腕：push＝チャンタに決める（鳴き可＝喰い下がりも使う・ダマ）／pushM＝push と同じだが門前のみ（鳴かない・ダマ）／base＝機械の普通打ち
//     枠（么九を含む面子候補の数＋雀頭が么九牌）：
//       ch2＝么九入りの完成面子2組＋么九の雀頭（残り5枚は2〜8の数牌）
//       ch3＝完成面子3組＋么九の雀頭（残り2枚）
//       ch4＝完成面子3組＋么九入りのターツ1組（12・13・23／78・79・89）＋么九の雀頭（残りなし・13枚ちょうど）
//     面子候補の作り：2/3 は 123 か 789 の順子（色はでたらめ）、1/3 は么九牌（1・9・字牌）の刻子（残りが足りる牌から選ぶ）。字牌の刻子が入ると純チャンにはならない。
//     雀頭＝么九牌（1・9・字牌）の対子（残りが足りる牌から）。
//     push の捨て：生きた牌（么九牌と 2・3・7・8）を残し、死んだ牌（4・5・6）から切る。ただし向聴は守る
//       （向聴の最小を minXt とし、minXt が 0 なら 0 のまま／1 以上なら minXt+1 までの捨てだけを候補にする）。候補の中で 死んだ牌先 → 向聴 → 2・3・7・8 を么九牌より先に切る → 残りの少ない牌。
//     鳴き：向聴が進み、かつ鳴いた面子が么九牌を含む時だけ（ポン・チー）。槓しない・九種九牌は流さない。
//
//   ■ 件 ipeko（一盃口・二盃口）  形の和了＝一盃口／二盃口
//     腕：push＝門前で待つ（鳴かない・聴牌したら立直）／pushD＝門前・ダマ／base
//     枠（同じ並びの順子の素材）：順子 abc（色・起点はでたらめ）を一組の素材とする。
//       ib1＝一盃口の芽：a a b b c の5枚が1組（あと1枚 c で aabbcc）
//       ib1c＝一盃口の完成：a a b b c c の6枚が1組（配牌で一盃口の形が出来ている）
//       ib2＝二盃口の芽：5枚の組が2組（10枚・残り3枚）
//       ib2c＝二盃口の片側完成：6枚の組＋5枚の組（11枚・残り2枚）
//     二組の色と起点は別々にでたらめ（同色でもよい。牌は各4枚までなので足りる）。残りの牌は、その組の色の起点〜起点+2 の数牌を除いた牌から。
//     push の捨て：向聴 → 素材の牌（その組の数牌で、手の枚数が2枚以下のもの）を残す → 残りの少ない牌。
//
//   ■ 件 pinfu（平和）  形の和了＝平和
//     腕：push＝門前で平和を狙う（両面を残す・鳴かない・聴牌したら立直）／pushD＝ダマ／base
//     枠（両面ターツの数＋雀頭が三元牌でない）：
//       pf2＝両面ターツ2組＋雀頭（残り9枚）／pf3＝両面ターツ3組＋雀頭（残り5枚）／pf4＝両面ターツ4組＋雀頭（残り3枚）
//     両面ターツ＝数牌 n・n+1（n は 2〜7＝両面になる起点・色はでたらめ）の2枚。雀頭＝数牌の対子（三元牌でも風牌でもない。風牌は見ない決めなので、雀頭は数牌から選ぶ）。
//     残りの牌は、三元牌でなく、かつ各ターツの色の n-1〜n+2 の数牌を除いた牌から（待ちの牌が配牌に混ざらないように）。
//     push の捨て：向聴 → 牌の生き具合（字牌の孤立・孤立牌を先に切る／対子・嵌張・辺張が次／両面の候補になる牌を残す）→ 残りの少ない牌。
//
//   使い方：node reports/chanta-ipeko-pinfu-aite-20261124.js [--only chantai]   … 雲（4本並列・WORK_S 秒で自分から止まる・既定 1230）
//           node reports/chanta-ipeko-pinfu-aite-20261124.js --local 1 [--only chantai]  … 手元の極小の試し（各枠一周）
//           node reports/chanta-ipeko-pinfu-aite-20261124.js --summarize <tsv>          … 記録の集計（markdown の表）
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
const WORK_MS = Number(process.env.WORK_S || 1230) * 1000, KILL_MS = WORK_MS + 90000, NWORK = 4;
const HEAD = ['本', '周', '枠', '腕', '席', '配牌', '結果', '役満', '形和了', '和了型', '役名', '放銃先リーチ', '受リーチ', '点棒', '巡目', '打数', '件'];

const FAM = {
  chantai: { label: 'チャンタ・純チャン', arms: ['push', 'pushM', 'base'], shapes: ['混全帯幺九', '純全帯幺九'],
    frames: [{ id: 'ch2', full: 2, part: 0 }, { id: 'ch3', full: 3, part: 0 }, { id: 'ch4', full: 3, part: 1 }] },
  ipeko: { label: '一盃口・二盃口', arms: ['push', 'pushD', 'base'], shapes: ['一盃口', '二盃口'],
    frames: [{ id: 'ib1', groups: [5] }, { id: 'ib1c', groups: [6] }, { id: 'ib2', groups: [5, 5] }, { id: 'ib2c', groups: [6, 5] }] },
  pinfu: { label: '平和', arms: ['push', 'pushD', 'base'], shapes: ['平和'],
    frames: [{ id: 'pf2', ry: 2 }, { id: 'pf3', ry: 3 }, { id: 'pf4', ry: 4 }] }
};
const FAMS = Object.keys(FAM);
const numOf = p => +p[1] || 5;
const isYao = p => p[0] === 'z' || numOf(p) === 1 || numOf(p) === 9;
const aliveCh = p => isYao(p) || [2, 3, 7, 8].indexOf(numOf(p)) >= 0;

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }

function makeTable() {
  const Majiang = require('@kobalab/majiang-core');
  const AI = require('@kobalab/majiang-ai');
  const rule = Majiang.rule({ '場数': 0 });

  /* 作り配牌と山：pop の順に 席0の13・席1の13・席2の13・席3の13・残り。meta は push が使う芽の目印。 */
  function buildShan(fam, frame, t, rnd) {
    const shan = new Majiang.Shan(rule);
    const pool = shuffle(shan._pai.slice().sort(), rnd);
    const takeIf = f => { const i = pool.findIndex(f); if (i < 0) { throw new Error('牌が足りない'); } return pool.splice(i, 1)[0]; };
    const hand = [], meta = {};
    const takeNum = (s, n) => hand.push(takeIf(p => p[0] === s && numOf(p) === n));
    const fill = f => { const op = pool.filter(f); for (let i = 0; hand.length < 13; i++) { const p = op[i]; if (!p) { throw new Error('残りが足りない'); } pool.splice(pool.indexOf(p), 1); hand.push(p); } };
    /* pool の中に n 枚以上ある牌（赤を数字の5と同じに見ない・同じ綴りで数える）のうち f に合う綴りを返す（でたらめ順） */
    const kindsWith = (f, n) => { const c = {}; pool.forEach(p => { if (f(p)) { c[p] = (c[p] || 0) + 1; } }); return shuffle(Object.keys(c).filter(k => c[k] >= n), rnd); };
    const takeKind = (k, n) => { for (let i = 0; i < n; i++) { hand.push(takeIf(p => p === k)); } };
    const pickPart = ns => shuffle(ns.slice(), rnd).slice(0, 2);
    if (fam === 'chantai') {
      const suits = ['m', 'p', 's'];
      const addBlock = full => {
        const triplet = rnd() < 1 / 3;
        if (triplet) {
          const ks = kindsWith(isYao, full ? 3 : 2);
          if (ks.length) { takeKind(ks[0], full ? 3 : 2); return; }
        }
        const s = suits[Math.floor(rnd() * 3)], ns = rnd() < 0.5 ? [1, 2, 3] : [7, 8, 9];
        (full ? ns : pickPart(ns)).forEach(n => takeNum(s, n));
      };
      for (let i = 0; i < frame.full; i++) { addBlock(true); }
      for (let i = 0; i < frame.part; i++) {
        const s = suits[Math.floor(rnd() * 3)], ns = rnd() < 0.5 ? [1, 2, 3] : [7, 8, 9];
        pickPart(ns).forEach(n => takeNum(s, n));
      }
      const pk = kindsWith(isYao, 2); takeKind(pk[0], 2);
      fill(p => !isYao(p));
    } else if (fam === 'ipeko') {
      meta.groups = [];
      frame.groups.forEach(size => {
        const s = ['m', 'p', 's'][Math.floor(rnd() * 3)], k = 1 + Math.floor(rnd() * 7);
        meta.groups.push({ s: s, k: k });
        const seq = size === 6 ? [k, k, k + 1, k + 1, k + 2, k + 2] : [k, k, k + 1, k + 1, k + 2];
        seq.forEach(n => takeNum(s, n));
      });
      fill(p => !meta.groups.some(g => p[0] === g.s && numOf(p) >= g.k && numOf(p) <= g.k + 2));
    } else {
      meta.blocks = [];
      for (let i = 0; i < frame.ry; i++) {
        const s = ['m', 'p', 's'][Math.floor(rnd() * 3)], n = 2 + Math.floor(rnd() * 6);
        meta.blocks.push({ s: s, n: n });
        takeNum(s, n); takeNum(s, n + 1);
      }
      const near = p => p[0] !== 'z' && meta.blocks.some(b => b.s === p[0] && numOf(p) >= b.n - 1 && numOf(p) <= b.n + 2);
      const pk = kindsWith(p => p[0] !== 'z' && !near(p), 2); takeKind(pk[0], 2);
      fill(p => !(p[0] === 'z' && numOf(p) >= 5) && !near(p));
    }
    shuffle(pool, rnd);
    const order = [];
    for (let l = 0; l < 4; l++) {
      if (l === t) { hand.forEach(h => order.push(h)); } else { for (let i = 0; i < 13; i++) { order.push(pool.pop()); } }
    }
    shan._pai = pool.slice().concat(order.slice().reverse());
    shan._baopai = [shan._pai[4]];
    shan._fubaopai = rule['裏ドラあり'] ? [shan._pai[9]] : null;
    return { shan: shan, hand: hand, meta: meta };
  }

  class ShapeAI extends AI {
    constructor(ctx) { super(); this._ctx = ctx; this._yaku = false; }
    qipai(qipai) { super.qipai(qipai); this._yaku = (this._ctx.arm !== 'base') && this._ctx.t === this._menfeng; }
    /* 一盃口の素材の牌か */
    _inGroup(p) { return this._ctx.meta.groups.some(g => p[0] === g.s && numOf(p) >= g.k && numOf(p) <= g.k + 2); }
    /* 平和：牌の生き具合（0＝孤立・字牌／1＝対子・嵌張・辺張だけ／2＝両面の候補） */
    _pinLevel(p, bing) {
      if (p[0] === 'z') { return 0; }
      const s = p[0], n = numOf(p), c = bing[s];
      const ryan = (c[n + 1] > 0 && n >= 2 && n + 1 <= 8) || (c[n - 1] > 0 && n - 1 >= 2 && n <= 8);
      if (ryan) { return 2; }
      if (c[n] >= 2 || c[n + 1] > 0 || c[n - 1] > 0 || c[n + 2] > 0 || c[n - 2] > 0) { return 1; }
      return 0;
    }
    select_gang(info) { return this._yaku ? undefined : super.select_gang(info); }
    select_pingju() { return this._yaku ? false : super.select_pingju(); }
    select_fulou(dapai, info) {
      if (!this._yaku) { return super.select_fulou(dapai, info); }
      const c = this._ctx;
      if (c.fam !== 'chantai' || c.arm === 'pushM') { return undefined; }
      const d = ['', '+', '=', '-'][(4 + this._model.lunban - this._menfeng) % 4];
      const p = dapai.p.slice(0, 2) + d;
      const sp0 = this.shoupai;
      const ms = (this.get_peng_mianzi(sp0, p) || []).concat(this.get_chi_mianzi(sp0, p) || []);
      const xt = Majiang.Util.xiangting(sp0);
      let best = null, bx = xt;
      ms.forEach(m => {
        const ds = m.replace(/[^0-9]/g, '');
        if (m[0] !== 'z' && !/[19]/.test(ds)) { return; }
        const x = Majiang.Util.xiangting(sp0.clone().fulou(m));
        if (x < bx) { bx = x; best = m; }
      });
      return best || undefined;
    }
    select_dapai(info) {
      if (!this._yaku) { return super.select_dapai(info); }
      const c = this._ctx, sp = this.shoupai;
      let list = this.get_dapai(sp);
      const xts = {};
      list.forEach(p => { xts[p] = Majiang.Util.xiangting(sp.clone().dapai(p)); });
      if (c.fam === 'chantai') {
        const mn = Math.min.apply(null, list.map(p => xts[p])), lim = mn >= 1 ? mn + 1 : 0;
        list = list.filter(p => xts[p] <= lim);
      }
      let best = null, bk = null;
      list.forEach(p => {
        const s = p[0], n = numOf(p), cnt = sp._bingpai[s][n], u = this._suanpai._paishu[s][n], xt = xts[p];
        let key;
        if (c.fam === 'chantai') { key = [aliveCh(p) ? 1 : 0, xt, isYao(p) ? 1 : 0, u]; }
        else if (c.fam === 'ipeko') { key = [xt, (this._inGroup(p) && cnt <= 2) ? 1 : 0, u]; }
        else { key = [xt, this._pinLevel(p, sp._bingpai), u]; }
        let cmp = 0;
        if (bk) { for (let i = 0; i < key.length && !cmp; i++) { cmp = key[i] - bk[i]; } }
        if (!bk || cmp < 0) { bk = key; best = p; }
      });
      if (best && c.fam !== 'chantai' && c.arm === 'push' && sp.menqian && xts[best] === 0 && this.select_lizhi(best)) { return best + '*'; }
      return best || super.select_dapai(info);
    }
  }

  function playOne(part, j, fam, frame, arm, seed) {
    const rnd = mulberry32(seed);
    const t = 1 + Math.floor(rnd() * 3);
    const built = buildShan(fam, frame, t, rnd);
    const ctx = { t: t, arm: arm, fam: fam, frame: frame, meta: built.meta };
    class G extends Majiang.Game { qipai(shan) { if (this._aiteUsed) { return super.qipai(); } this._aiteUsed = true; return super.qipai(built.shan); } }
    let paipu = null;
    const players = [0, 1, 2, 3].map(() => new ShapeAI(ctx));
    const game = new G(players, p => { paipu = p; }, rule, 'aite');
    game.speed = 0; game.stop = null;
    game.do_sync();
    if (!paipu || !paipu.log || !paipu.log.length) { return null; }
    const kyoku = paipu.log[0];
    let z = 0, nd = 0;
    const riichi = {};
    kyoku.forEach(e => {
      if (!e) { return; }
      if (e.zimo) { z++; }
      if (e.dapai) { if (e.dapai.l === t) { nd++; } if (e.dapai.p.slice(-1) === '*') { riichi[e.dapai.l] = true; } }
    });
    const hules = kyoku.filter(e => e && e.hule).map(e => e.hule);
    const pingju = (kyoku.filter(e => e && e.pingju)[0] || {}).pingju;
    let res = '無関係', yaku = '', shape = '', type = '', names = '', toR = '', pts = 0;
    if (hules.length) {
      const won = hules.filter(h => h.l === t), dealt = hules.filter(h => typeof h.baojia === 'number' && h.baojia === t);
      if (won.length) {
        const h = won[0]; res = '和了'; yaku = h.damanguan ? 1 : 0; type = (typeof h.baojia === 'number') ? 'ロン' : 'ツモ';
        const hn = (h.hupai || []).map(x => x.name); names = hn.join('+');
        shape = hn.some(x => FAM[fam].shapes.indexOf(x) >= 0) ? 1 : 0;
      }
      else if (dealt.length) { res = '放銃'; toR = dealt.some(h => riichi[h.l]) ? 1 : 0; }
      else if (hules.some(h => typeof h.baojia !== 'number')) { res = '被ツモ'; }
      hules.forEach(h => { pts += (h.fenpei && h.fenpei[t]) || 0; });
    } else if (pingju) { res = '流局'; pts = (pingju.fenpei && pingju.fenpei[t]) || 0; }
    let ro = 0; for (let l = 0; l < 4; l++) { if (l !== t && riichi[l]) { ro = 1; } }
    return [part, j, frame.id, arm, t, built.hand.join(''), res, yaku, shape, type, names, toR, ro, pts, Math.ceil(z / 4), nd, fam];
  }
  return { playOne: playOne };
}

function work(out, ms, part, maxCycles, fams) {
  const table = makeTable();
  const t0 = Date.now(); let n = 0, err = 0;
  fs.writeFileSync(out, HEAD.join('\t') + '\n');
  for (let j = 1; j <= maxCycles && Date.now() - t0 < ms; j++) {
    fams.forEach(fam => {
      FAM[fam].frames.forEach((frame, f) => {
        const seed = 100003 * part + 7919 * j + 31 * f + 20261124 + 8888881 * (FAMS.indexOf(fam) + 1) + 1000003 * Number(process.env.SEED_OFF || 0);
        FAM[fam].arms.forEach(arm => {
          if (Date.now() - t0 >= ms) { return; }
          try {
            const r = table.playOne(part, j, fam, frame, arm, seed);
            if (r) { fs.appendFileSync(out, r.join('\t') + '\n'); n++; }
          } catch (e) { err++; if (err <= 5) { console.error('本' + part + ' 周' + j + ' ' + fam + ' ' + frame.id + ' ' + arm + ' で落ちた: ' + ((e && e.stack) || e)); } }
        });
      });
    });
  }
  console.error('本' + part + ' … ' + n + '局・落ちた ' + err + '・' + Math.round((Date.now() - t0) / 1000) + '秒');
}

function readRows(file) {
  const ls = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#');
  if (!ls.length || ls[0] !== HEAD.join('\t')) { return null; }
  return ls.slice(1).map(l => { const c = l.split('\t'), o = {}; HEAD.forEach((h, i) => { o[h] = (c[i] === undefined ? '' : c[i]); }); return o; });
}
const num = v => Number(v) || 0;
const pc = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-';
const ci = (a, b) => b ? '±' + (196 * Math.sqrt((a / b) * (1 - a / b) / b)).toFixed(1) : '';
function mean(xs) { return xs.length ? xs.reduce((x, y) => x + y, 0) / xs.length : 0; }
function se(xs) { if (xs.length < 2) { return 0; } const m = mean(xs); return Math.sqrt(xs.reduce((x, y) => x + (y - m) * (y - m), 0) / (xs.length - 1) / xs.length); }
function summarize(rows, fam, title) {
  const P = s => console.log(s), F = FAM[fam];
  P(''); P('## ' + F.label + '：' + title); P('');
  P('| 枠 | 腕 | 局 | 和了（全部） | 形の和了（' + F.shapes.join('・') + '） | 役満和了 | 放銃 | （立直者へ） | 被ツモ | 流局 | 平均点棒 | 立直が入った局 | 巡目の平均 |');
  P('|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  F.frames.forEach(f => F.arms.forEach(a => {
    const xs = rows.filter(r => r['枠'] === f.id && r['腕'] === a), n = xs.length;
    const wn = xs.filter(r => r['結果'] === '和了'), dl = xs.filter(r => r['結果'] === '放銃');
    P('| ' + f.id + ' | ' + a + ' | ' + n + ' | ' + pc(wn.length, n) + ' ' + ci(wn.length, n) + ' | ' + pc(wn.filter(r => r['形和了'] === '1').length, n) + ' | ' + pc(wn.filter(r => r['役満'] === '1').length, n)
      + ' | ' + pc(dl.length, n) + ' | ' + pc(dl.filter(r => r['放銃先リーチ'] === '1').length, n) + ' | ' + pc(xs.filter(r => r['結果'] === '被ツモ').length, n)
      + ' | ' + pc(xs.filter(r => r['結果'] === '流局').length, n) + ' | ' + mean(xs.map(r => num(r['点棒']))).toFixed(0) + ' | ' + pc(xs.filter(r => r['受リーチ'] === '1').length, n) + ' | ' + mean(xs.map(r => num(r['巡目']))).toFixed(1) + ' |');
  }));
  F.arms.filter(a => a !== 'base').forEach(arm => {
    P(''); P('### 同じ山どうしの差（' + arm + ' − base・同じ枠・同じ周・同じ本）');
    P(''); P('| 枠 | 組 | 和了率の差 | 形の和了率の差 | 点棒の差（平均±標準誤差×1.96） | 放銃率の差 |'); P('|---|---|---|---|---|---|');
    F.frames.forEach(f => {
      const idx = {};
      rows.filter(r => r['枠'] === f.id).forEach(r => { const k = r['本'] + '-' + r['周']; (idx[k] = idx[k] || {})[r['腕']] = r; });
      const pairs = Object.keys(idx).map(k => idx[k]).filter(o => o[arm] && o['base']);
      const W = r => r['結果'] === '和了' ? 1 : 0, S = r => (r['結果'] === '和了' && r['形和了'] === '1') ? 1 : 0;
      const dw = pairs.map(o => W(o[arm]) - W(o['base'])), ds = pairs.map(o => S(o[arm]) - S(o['base']));
      const dp = pairs.map(o => num(o[arm]['点棒']) - num(o['base']['点棒']));
      const dd = pairs.map(o => (o[arm]['結果'] === '放銃' ? 1 : 0) - (o['base']['結果'] === '放銃' ? 1 : 0));
      P('| ' + f.id + ' | ' + pairs.length + ' | ' + (mean(dw) * 100).toFixed(1) + 'pt ±' + (196 * se(dw)).toFixed(1) + ' | ' + (mean(ds) * 100).toFixed(1) + 'pt ±' + (196 * se(ds)).toFixed(1) + ' | ' + mean(dp).toFixed(0) + ' ±' + (1.96 * se(dp)).toFixed(0) + ' | ' + (mean(dd) * 100).toFixed(1) + 'pt ±' + (196 * se(dd)).toFixed(1) + ' |');
    });
  });
  P(''); P('＊読み方の注意：機械打ちは聴牌即立直。chantai の push／pushM はダマ（鳴けば立直不可）。ipeko・pinfu の push は聴牌したら立直・pushD はダマ。作り配牌を積むので他家の配牌からその牌が減る。差は同じ山どうしの欄で読む。風牌は見ない決め（平和の雀頭は数牌から選ぶ）。');
}
function summarizeFile(file) {
  const rows = readRows(file);
  if (!rows || !rows.length) { console.log('読めない記録：' + file); return false; }
  const fams = FAMS.filter(f => rows.some(r => r['件'] === f));
  fams.forEach(f => summarize(rows.filter(r => r['件'] === f), f, path.basename(file)));
  return true;
}

const argv = process.argv.slice(2);
const oi = argv.indexOf('--only');
const only = oi >= 0 ? argv[oi + 1] : '';
if (only && FAMS.indexOf(only) < 0) { console.error('--only は ' + FAMS.join('|') + ' のどれか'); process.exit(2); }
const useFams = only ? [only] : FAMS;
if (argv[0] === '--worker') {
  work(argv[1], Number(argv[2]), Number(argv[3]), Infinity, argv[4].split(','));
} else if (argv[0] === '--summarize') {
  process.exit(summarizeFile(argv[1]) ? 0 : 1);
} else if (argv[0] === '--local') {
  const n = Math.max(1, Math.min(5, Number(argv[1]) || 1));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-cip-'));
  const f = path.join(dir, 'part-0.tsv');
  const t0 = Date.now();
  work(f, 150 * 1000, 0, n, useFams);
  const rows = readRows(f) || [];
  console.log(HEAD.join('\t'));
  rows.slice(0, 4).forEach(r => console.log(HEAD.map(h => r[h]).join('\t')));
  console.log('極小の試し：' + rows.length + '局・' + Math.round((Date.now() - t0) / 1000) + '秒');
  const by = {}; rows.forEach(r => { const k = r['件'] + r['枠'] + r['周']; (by[k] = by[k] || {})[r['腕']] = r['配牌'] + '@' + r['席']; });
  const ks = Object.keys(by), same = ks.filter(k => { const v = Object.keys(by[k]).map(a => by[k][a]); return v.every(x => x === v[0]); }).length;
  console.log('同じ山の確かめ：全腕で配牌と席が同じだった枠×周 ' + same + '／' + ks.length);
  summarizeFile(f);
  fs.rmSync(dir, { recursive: true, force: true });
} else {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  if (!fs.existsSync(path.join(ROOT, 'node_modules', '@kobalab'))) { execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' }); }
  console.log('相手あり測り（' + useFams.join('・') + '）を ' + NWORK + '本並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止まる）');
  const t0 = Date.now(), files = [], runs = [];
  for (let k = 0; k < NWORK; k++) {
    const f = path.join(os.tmpdir(), 'cip-part-' + k + '.tsv');
    files.push(f);
    runs.push(new Promise(res => {
      const p = spawn(process.execPath, [__filename, '--worker', f, String(WORK_MS), String(k), useFams.join(',')], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
      const timer = setTimeout(() => { try { p.kill('SIGKILL'); } catch (e) { } }, KILL_MS);
      p.on('exit', code => { clearTimeout(timer); res(code); });
    }));
  }
  Promise.all(runs).then(codes => {
    let body = [];
    files.forEach(f => {
      if (!fs.existsSync(f)) { return; }
      const ls = fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l);
      body = body.concat(ls.slice(1).filter(l => l.split('\t').length === HEAD.length));
      fs.unlinkSync(f);
    });
    if (!body.length) { console.log('記録が一行も書けなかった（終了コード ' + JSON.stringify(codes) + '）'); process.exit(1); }
    console.log('');
    console.log('終了コード ' + JSON.stringify(codes) + '／' + Math.round((Date.now() - t0) / 1000) + '秒／' + body.length + '行');
    useFams.forEach(fam => {
      const mine = body.filter(l => l.split('\t')[HEAD.length - 1] === fam);
      if (!mine.length) { return; }
      const OUT = path.join(ROOT, 'reports', 'cloud-' + fam + '-aite-' + stamp + '.tsv');
      fs.writeFileSync(OUT, '# 雲で回した ' + FAM[fam].label + ' の相手あり測り（' + stamp + ' UTC・' + FAM[fam].arms.join('/') + ' の腕・同じ山）。\n' + HEAD.join('\t') + '\n' + mine.join('\n') + '\n');
      console.log('記録 … reports/' + path.basename(OUT));
      summarizeFile(OUT);
    });
  });
}
