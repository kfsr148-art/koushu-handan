// 雲で：タンヤオ／三色・一通／三元牌（小三元・大三元）の「相手あり」の測り・橋の枠 二百五十六。reports/flush-aite-20261124.js の型を三件へ広げた写し。
//   ＊majiang-core の一局戦。子の一席（1〜3をでたらめ）に作り配牌を積み、その席だけ「その役に決める打ち手」。他三席は @kobalab/majiang-ai のまま。
//   ＊同じ作り配牌・同じ山を、その席の打ち手だけ替えて打つ（腕）。山は種つきで自分で並べる（同じ枠・同じ周・同じ本なら全腕で同じ山）。
//   ＊件は --only tanyao|sanshoku|sangen で別々に回せる（既定は三件とも）。記録は件ごとに別ファイル reports/cloud-<件>-aite-<刻>.tsv。
//   ＊本体（koushu-handan.html）・核には触らない。この台本は reports/ に置く（scratchpad/jobs に置くと雲の自動走りが起きるため）。
//
//   件 tanyao（断么九）  腕：push＝タンヤオに決める（么九牌から切る・么九牌を使わない鳴きは可＝食いタンあり・ダマ）／pushM＝push と同じだが鳴かない（門前のみ・ダマ）／base＝機械の普通打ち
//     枠 y0〜y5：配牌の么九牌（1・9・字牌）が n 枚（n=0〜5）。残りは 2〜8 の数牌。
//   件 sanshoku（三色同順・一気通貫）  腕：push＝その役に決める（鳴き可・ダマ）／pushR＝push と同じだが門前で聴牌したら立直／base
//     枠（三色）：数 k（1〜7）をでたらめに選び、k・k+1・k+2 の順子の素材を三色に置く。
//       sy11＝一色は完成順子＋二色は二枚（k..k+2 のうち二枚）／sy2＝二色で完成順子／sy21＝二色完成＋残る一色は二枚／sy3＝三色とも完成順子
//     枠（一通）：一色（でたらめ）に 123・456・789 の三つの塊の素材を置く。
//       it1p＝一塊完成＋二塊は二枚ずつ／it2＝二塊完成／it2p＝二塊完成＋残る塊は二枚／it3＝三塊とも完成（一通の形が配牌で出来ている）
//     残りの牌は、三色は k..k+2 の数牌を除いた牌から／一通は対象の色を除いた牌から（余計な芽が混ざらない）。
//     push の決め：枠が三色なら三色に、一通なら一通に決め打ち（枠の種類で決める・配牌から見つけ直さない）。捨ては 向聴 → 芽の牌を残す → 残りの少ない牌 の順（向聴は落とさず、同じ向聴なら芽を残す）。
//       鳴きは「芽の牌」で向聴が進む時だけ（ポン・チー）。槓しない・九種九牌は流さない。
//   件 sangen（小三元・大三元）  腕：push＝三元牌を残して鳴く（対子以上の三元牌は捨てない・三元牌の対子があればポン・他は向聴が進む鳴きだけ・ダマ）／pushR／base
//     枠：配牌の三元牌（白發中）の形。残りは三元牌以外の牌。
//       p1＝対子1組／p2＝対子2組／t1＝刻子1／t1p1＝刻子1＋対子1／t2＝刻子2／t1p2＝刻子1＋対子2／t2p1＝刻子2＋対子1（小三元の一歩手前）
//     形の和了＝小三元か大三元。役満＝大三元（役満和了率も出す）。
//
//   使い方：node reports/tanyao-sanshoku-sangen-aite-20261124.js [--only tanyao]   … 雲（4本並列・WORK_S 秒で自分から止まる・既定 1230）
//           node reports/tanyao-sanshoku-sangen-aite-20261124.js --local 1 [--only tanyao]  … 手元の極小の試し（各枠一周）
//           node reports/tanyao-sanshoku-sangen-aite-20261124.js --summarize <tsv>          … 記録の集計（markdown の表）
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
const WORK_MS = Number(process.env.WORK_S || 1230) * 1000, KILL_MS = WORK_MS + 90000, NWORK = 4;
const HEAD = ['本', '周', '枠', '腕', '席', '配牌', '結果', '役満', '形和了', '和了型', '役名', '放銃先リーチ', '受リーチ', '点棒', '巡目', '打数', '件'];

const FAM = {
  tanyao: { label: 'タンヤオ', arms: ['push', 'pushM', 'base'], shapes: ['断幺九'],
    frames: [0, 1, 2, 3, 4, 5].map(n => ({ id: 'y' + n, n: n })) },
  sanshoku: { label: '三色同順・一気通貫', arms: ['push', 'pushR', 'base'], shapes: ['三色同順', '一気通貫'],
    frames: [{ id: 'sy11', kind: 'sanshoku', full: 1, part: 2 }, { id: 'sy2', kind: 'sanshoku', full: 2, part: 0 }, { id: 'sy21', kind: 'sanshoku', full: 2, part: 1 }, { id: 'sy3', kind: 'sanshoku', full: 3, part: 0 },
      { id: 'it1p', kind: 'ittsu', full: 1, part: 2 }, { id: 'it2', kind: 'ittsu', full: 2, part: 0 }, { id: 'it2p', kind: 'ittsu', full: 2, part: 1 }, { id: 'it3', kind: 'ittsu', full: 3, part: 0 }] },
  sangen: { label: '小三元・大三元', arms: ['push', 'pushR', 'base'], shapes: ['小三元', '大三元'],
    frames: [{ id: 'p1', tri: 0, pair: 1 }, { id: 'p2', tri: 0, pair: 2 }, { id: 't1', tri: 1, pair: 0 }, { id: 't1p1', tri: 1, pair: 1 },
      { id: 't2', tri: 2, pair: 0 }, { id: 't1p2', tri: 1, pair: 2 }, { id: 't2p1', tri: 2, pair: 1 }] }
};
const FAMS = Object.keys(FAM);
const numOf = p => +p[1] || 5;
const isYao = p => p[0] === 'z' || numOf(p) === 1 || numOf(p) === 9;

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
    const fill = f => { const op = pool.filter(f); for (let i = 0; hand.length < 13; i++) { const p = op[i]; pool.splice(pool.indexOf(p), 1); hand.push(p); } };
    const pickPart = ns => shuffle(ns.slice(), rnd).slice(0, 2);
    if (fam === 'tanyao') {
      for (let i = 0; i < frame.n; i++) { hand.push(takeIf(isYao)); }
      fill(p => !isYao(p));
    } else if (fam === 'sanshoku') {
      if (frame.kind === 'sanshoku') {
        const k = 1 + Math.floor(rnd() * 7), suits = shuffle(['m', 'p', 's'], rnd);
        meta.kind = 'sanshoku'; meta.k = k;
        suits.forEach((s, i) => {
          const ns = [k, k + 1, k + 2];
          if (i < frame.full) { ns.forEach(n => takeNum(s, n)); } else if (i < frame.full + frame.part) { pickPart(ns).forEach(n => takeNum(s, n)); }
        });
        fill(p => !(p[0] !== 'z' && numOf(p) >= k && numOf(p) <= k + 2));
      } else {
        const s = ['m', 'p', 's'][Math.floor(rnd() * 3)], blocks = shuffle([0, 1, 2], rnd);
        meta.kind = 'ittsu'; meta.suit = s;
        blocks.forEach((b, i) => {
          const ns = [3 * b + 1, 3 * b + 2, 3 * b + 3];
          if (i < frame.full) { ns.forEach(n => takeNum(s, n)); } else if (i < frame.full + frame.part) { pickPart(ns).forEach(n => takeNum(s, n)); }
        });
        fill(p => p[0] !== s);
      }
    } else {
      const kinds = shuffle([5, 6, 7], rnd);
      for (let i = 0; i < frame.tri; i++) { for (let c = 0; c < 3; c++) { hand.push(takeIf(p => p === 'z' + kinds[i])); } }
      for (let i = 0; i < frame.pair; i++) { for (let c = 0; c < 2; c++) { hand.push(takeIf(p => p === 'z' + kinds[frame.tri + i])); } }
      fill(p => !(p[0] === 'z' && numOf(p) >= 5));
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
    /* 芽の牌か（三色・一通の対象牌／三元牌） */
    _isTarget(p) {
      const c = this._ctx;
      if (c.fam === 'sanshoku') {
        if (p[0] === 'z') { return false; }
        if (c.meta.kind === 'sanshoku') { const n = numOf(p); return n >= c.meta.k && n <= c.meta.k + 2; }
        return p[0] === c.meta.suit;
      }
      return p[0] === 'z' && numOf(p) >= 5;
    }
    select_gang(info) { return this._yaku ? undefined : super.select_gang(info); }
    select_pingju() { return this._yaku ? false : super.select_pingju(); }
    select_fulou(dapai, info) {
      if (!this._yaku) { return super.select_fulou(dapai, info); }
      const c = this._ctx;
      if (c.fam === 'tanyao' && c.arm === 'pushM') { return undefined; }
      const d = ['', '+', '=', '-'][(4 + this._model.lunban - this._menfeng) % 4];
      const p = dapai.p.slice(0, 2) + d;
      const sp0 = this.shoupai;
      const peng = this.get_peng_mianzi(sp0, p) || [], chi = this.get_chi_mianzi(sp0, p) || [];
      const ms = peng.concat(chi);
      if (c.fam === 'tanyao') {
        if (isYao(dapai.p)) { return undefined; }
        const xt = Majiang.Util.xiangting(sp0);
        let best = null, bx = xt;
        ms.forEach(m => {
          if (/[19]/.test(m.replace(/[^0-9]/g, ''))) { return; }
          const x = Majiang.Util.xiangting(sp0.clone().fulou(m));
          if (x < bx) { bx = x; best = m; }
        });
        return best || undefined;
      }
      if (c.fam === 'sangen' && dapai.p[0] === 'z' && numOf(dapai.p) >= 5 && sp0._bingpai.z[numOf(dapai.p)] >= 2 && peng.length) { return peng[0]; }
      if (c.fam !== 'sangen' && !this._isTarget(dapai.p)) { return undefined; }
      const xt = Majiang.Util.xiangting(sp0);
      let best = null, bx = xt;
      ms.forEach(m => {
        const x = Majiang.Util.xiangting(sp0.clone().fulou(m));
        if (x < bx) { bx = x; best = m; }
      });
      return best || undefined;
    }
    select_dapai(info) {
      if (!this._yaku) { return super.select_dapai(info); }
      const c = this._ctx, sp = this.shoupai, list = this.get_dapai(sp);
      let best = null, bk = null;
      list.forEach(p => {
        const s = p[0], n = numOf(p), cnt = sp._bingpai[s][n], u = this._suanpai._paishu[s][n];
        const xt = Majiang.Util.xiangting(sp.clone().dapai(p));
        let key;
        if (c.fam === 'tanyao') { key = [isYao(p) ? 0 : 1, xt, u]; }
        else if (c.fam === 'sanshoku') { key = [xt, this._isTarget(p) ? 1 : 0, u]; }
        else { key = [xt, (this._isTarget(p) && cnt >= 2) ? 1 : 0, u]; }
        let cmp = 0;
        if (bk) { for (let i = 0; i < key.length && !cmp; i++) { cmp = key[i] - bk[i]; } }
        if (!bk || cmp < 0) { bk = key; best = p; }
      });
      if (best && c.arm === 'pushR' && sp.menqian && Majiang.Util.xiangting(sp.clone().dapai(best)) === 0 && this.select_lizhi(best)) { return best + '*'; }
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
    fams.forEach((fam, fi) => {
      FAM[fam].frames.forEach((frame, f) => {
        const seed = 100003 * part + 7919 * j + 31 * f + 20261124 + 7777777 * (FAMS.indexOf(fam) + 1) + 1000003 * Number(process.env.SEED_OFF || 0);
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
  P(''); P('＊読み方の注意：機械打ちは聴牌即立直。push／pushM はダマ（鳴けば立直不可）。pushR は門前で聴牌したら立直。作り配牌を積むので他家の配牌からその牌が減る。差は同じ山どうしの欄で読む。');
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
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-tsg-'));
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
  if (process.env.KEEP) { fs.copyFileSync(f, path.join(os.tmpdir(), 'koushu-tsg-keep.tsv')); }
  fs.rmSync(dir, { recursive: true, force: true });
} else {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  if (!fs.existsSync(path.join(ROOT, 'node_modules', '@kobalab'))) { execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' }); }
  console.log('相手あり測り（' + useFams.join('・') + '）を ' + NWORK + '本並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止まる）');
  const t0 = Date.now(), files = [], runs = [];
  for (let k = 0; k < NWORK; k++) {
    const f = path.join(os.tmpdir(), 'tsg-part-' + k + '.tsv');
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
