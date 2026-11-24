// 雲で：残りの役満五つ（字一色・四喜和・九蓮宝燈・緑一色・清老頭）の「相手あり」の測り（枠 二百五十七）。flush-aite-20261124.js・yakuman-aite4.js の型。
//   ＊majiang-core の一局戦。子の一席（1〜3をでたらめ）に作り配牌を積み、その席だけ「役満を狙う打ち手」。他三席は @kobalab/majiang-ai のまま。山は種つきで自分で並べる（同じ枠・同じ周なら腕を替えても同じ山）。
//   ＊腕：push＝その役満に決めて打つ／base＝機械の普通打ち（同じ配牌・同じ山）。字牌の取り合いの比べ（cmp の枠）は 国士 kok／字一色 zi／四喜和 xi／base の四腕で同じ配牌を打つ。
//   ＊push の決め（共通）：ダマ（立直しない）・槓しない・九種九牌は流さない。打牌は「狙う牌の外を先に切る→向聴が進む→山に残り多い牌」の順（四喜和・国士は下記）。
//       字一色＝字牌が狙い。鳴いてよい（ポン。向聴が進む時だけ）。
//       四喜和＝東南西北が狙い。風牌の対子・刻子（2〜3枚）は切らない・向聴の進み→風でない牌を先に切る。ポンは風牌で向聴が進む時だけ（小四喜は風の刻子3つ＋風の雀頭＋もう一組）。
//       九蓮宝燈＝配牌で一番多い色が狙い。鳴かない（門前）。色の外を先に切る。
//       緑一色＝索の2・3・4・6・8と發が狙い。鳴いてよい（ポン・チーとも、狙う牌だけでできる面子で向聴が進む時だけ）。
//       清老頭＝一・九の数牌（字牌なし）が狙い。鳴いてよい（ポンだけ）。
//       国士（cmp のみ）＝么九牌を残し、么九でない牌→么九の重なりを先に切る。鳴かない。
//   ＊枠（配牌に積む形。残りは狙い以外の牌からでたらめ）：
//       zi8〜zi11  字一色  字牌を n 枚（山の字牌28枚からでたらめ＝対子・刻子も混ざる）
//       xi8        四喜和  風の刻子2＋対子1（8枚）           xi9   風の刻子3（9枚）
//       xi10       四喜和  風の刻子2＋対子2（10枚）           xi11  風の刻子3＋対子1（11枚＝小四喜の形が揃う手前）
//       ch9〜ch12  九蓮宝燈 一色の 1112345678999 の13枚から n 枚（残りは他の色・字牌）
//       gr9〜gr12  緑一色  緑の牌（索2346８・發の24枚）から n 枚（残りは緑以外）
//       ro8〜ro11  清老頭  一・九の数牌（6種24枚）から n 枚（残りは字牌・中張牌）
//       v6・v8・v10  字牌の取り合いの比べ  字牌を n 枚（残りは字牌以外）に対して 国士腕／字一色腕／四喜和腕／base を打つ
//   ＊本体（koushu-handan.html）・核には触らない。この台本は reports/ に置く（scratchpad/jobs に置くと雲の自動走りが起きるため）。
//   使い方：node reports/yakuman5-aite-20261124.js                    … 雲（五つ全部・4本並列・WORK_S 秒で自分から止まる・既定 1230）
//           node reports/yakuman5-aite-20261124.js --only zi|xi|ch|gr|ro|cmp  … 一つの役の枠だけ（cmp＝字牌の比べ）
//           node reports/yakuman5-aite-20261124.js --local 1          … 手元の極小の試し（全枠を1周）
//           node reports/yakuman5-aite-20261124.js --summarize <tsv>  … 記録から表（markdown）を出す
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
const WORK_MS = Number(process.env.WORK_S || 1230) * 1000, KILL_MS = WORK_MS + 90000, NWORK = 4;
const NAME = 'cloud-yakuman5-aite-';
const onlyIdx = process.argv.indexOf('--only');
const ONLY = (onlyIdx >= 0 ? process.argv[onlyIdx + 1] : process.env.ONLY) || '';
const FRAMES_ALL = [];
[8, 9, 10, 11].forEach(n => FRAMES_ALL.push({ id: 'zi' + n, group: 'zi', yaku: 'zi', n: n }));
[[2, 1], [3, 0], [2, 2], [3, 1]].forEach(tp => FRAMES_ALL.push({ id: 'xi' + (tp[0] * 3 + tp[1] * 2), group: 'xi', yaku: 'xi', t: tp[0], p: tp[1] }));
[9, 10, 11, 12].forEach(n => FRAMES_ALL.push({ id: 'ch' + n, group: 'ch', yaku: 'ch', n: n }));
[9, 10, 11, 12].forEach(n => FRAMES_ALL.push({ id: 'gr' + n, group: 'gr', yaku: 'gr', n: n }));
[8, 9, 10, 11].forEach(n => FRAMES_ALL.push({ id: 'ro' + n, group: 'ro', yaku: 'ro', n: n }));
[6, 8, 10].forEach(n => FRAMES_ALL.push({ id: 'v' + n, group: 'cmp', yaku: 'cmp', n: n }));
const FRAMES = ONLY ? FRAMES_ALL.filter(f => f.group === ONLY) : FRAMES_ALL;
const armsOf = f => f.group === 'cmp' ? ['kok', 'zi', 'xi', 'base'] : ['push', 'base'];
const NAMES = {
  zi: ['字一色'], xi: ['小四喜', '大四喜'], ch: ['九蓮宝燈', '純正九蓮宝燈'], gr: ['緑一色'], ro: ['清老頭'], kok: ['国士無双', '国士無双十三面']
};
function hitNames(frame, arm) {
  if (frame.group === 'cmp') { return arm === 'base' ? NAMES.zi.concat(NAMES.xi, NAMES.kok) : NAMES[arm]; }
  return NAMES[frame.group];
}
const HEAD = ['本', '周', '枠', '腕', '席', '配牌', '結果', '役満', '和了型', '役名', '放銃先リーチ', '受リーチ', '点棒', '巡目', '打数'];
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
const kk = p => p[0] + (+p[1] || 5);   /* 赤5(0)は5として数える */
const YAO = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7'];
const GREEN = ['s2', 's3', 's4', 's6', 's8', 'z6'];
const ROTO = ['m1', 'm9', 'p1', 'p9', 's1', 's9'];
const WINDS = ['z1', 'z2', 'z3', 'z4'];
const CHUUREN = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9];

function makeTable() {
  const Majiang = require('@kobalab/majiang-core');
  const AI = require('@kobalab/majiang-ai');
  const rule = Majiang.rule({ '場数': 0 });

  /* 作り配牌と山：pop の順に 席0の13・席1の13・席2の13・席3の13・残り。 */
  function buildShan(frame, t, rnd) {
    const shan = new Majiang.Shan(rule);
    const pool = shan._pai.slice().sort();
    const take = p => { const i = pool.indexOf(p); if (i < 0) { throw new Error('牌が足りない ' + p); } pool.splice(i, 1); return p; };
    const hand = [];
    const fill = pred => { const r = shuffle(pool.filter(pred), rnd); for (let i = 0; hand.length < 13; i++) { hand.push(take(r[i])); } };
    if (frame.group === 'zi' || frame.group === 'cmp') {
      shuffle(pool.filter(p => p[0] === 'z'), rnd).slice(0, frame.n).forEach(p => hand.push(take(p)));
      fill(p => p[0] !== 'z');
    } else if (frame.group === 'xi') {
      const ws = shuffle(WINDS.slice(), rnd);
      for (let i = 0; i < frame.t; i++) { for (let c = 0; c < 3; c++) { hand.push(take(ws[i])); } }
      for (let i = 0; i < frame.p; i++) { for (let c = 0; c < 2; c++) { hand.push(take(ws[frame.t + i])); } }
      fill(p => WINDS.indexOf(kk(p)) < 0);
    } else if (frame.group === 'ch') {
      const suit = ['m', 'p', 's'][Math.floor(rnd() * 3)];
      shuffle(CHUUREN.slice(), rnd).slice(0, frame.n).forEach(n => hand.push(take(suit + n)));
      fill(p => p[0] !== suit);
    } else if (frame.group === 'gr') {
      shuffle(pool.filter(p => GREEN.indexOf(kk(p)) >= 0), rnd).slice(0, frame.n).forEach(p => hand.push(take(p)));
      fill(p => GREEN.indexOf(kk(p)) < 0);
    } else {
      shuffle(pool.filter(p => ROTO.indexOf(kk(p)) >= 0), rnd).slice(0, frame.n).forEach(p => hand.push(take(p)));
      fill(p => ROTO.indexOf(kk(p)) < 0);
    }
    shuffle(pool, rnd);
    const order = [];
    for (let l = 0; l < 4; l++) {
      if (l === t) { hand.forEach(h => order.push(h)); } else { for (let i = 0; i < 13; i++) { order.push(pool.pop()); } }
    }
    const rest = pool.slice();
    shan._pai = rest.concat(order.slice().reverse());
    shan._baopai = [shan._pai[4]];
    shan._fubaopai = rule['裏ドラあり'] ? [shan._pai[9]] : null;
    return { shan: shan, hand: hand };
  }

  /* 面子の文字（例 s234- ／ z111= ）の牌が全部、狙う集合に入っているか */
  function mianziIn(m, set) {
    const s = m[0], ds = m.replace(/[^0-9]/g, '').split('');
    return ds.every(d => set.indexOf(s + (+d || 5)) >= 0);
  }
  const SETS = { zi: ['z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7'], xi: WINDS, gr: GREEN, ro: ROTO };

  class YakuAI extends AI {
    constructor(ctx) { super(); this._ctx = ctx; this._yaku = false; this._target = null; this._suit = null; }
    qipai(qipai) {
      super.qipai(qipai);
      const c = this._ctx;
      this._yaku = (c.arm !== 'base') && c.t === this._menfeng;
      if (!this._yaku) { return; }
      this._target = c.arm === 'push' ? c.frame.yaku : c.arm;   /* zi/xi/ch/gr/ro/kok */
      if (this._target === 'ch') {
        const b = this.shoupai._bingpai; let best = 'm', bc = -1;
        ['m', 'p', 's'].forEach(s => { let k = 0; for (let n = 1; n <= 9; n++) { k += b[s][n]; } if (k > bc) { bc = k; best = s; } });
        this._suit = best;
      }
    }
    select_gang(info) { return this._yaku ? undefined : super.select_gang(info); }
    select_pingju() { return this._yaku ? false : super.select_pingju(); }
    select_fulou(dapai, info) {
      if (!this._yaku) { return super.select_fulou(dapai, info); }
      const T = this._target;
      if (T === 'ch' || T === 'kok') { return undefined; }
      const set = SETS[T];
      if (set.indexOf(kk(dapai.p)) < 0) { return undefined; }
      const d = ['', '+', '=', '-'][(4 + this._model.lunban - this._menfeng) % 4];
      const p = dapai.p.slice(0, 2) + d;
      const xt = Majiang.Util.xiangting(this.shoupai);
      const ms = this.get_peng_mianzi(this.shoupai, p).concat(this.get_chi_mianzi(this.shoupai, p)).filter(m => mianziIn(m, set));
      let best = null, bx = xt;
      ms.forEach(m => {
        const x = Majiang.Util.xiangting(this.shoupai.clone().fulou(m));
        if (x < bx) { bx = x; best = m; }
      });
      return best || undefined;
    }
    select_dapai(info) {
      if (!this._yaku) { return super.select_dapai(info); }
      const sp = this.shoupai, list = this.get_dapai(sp), T = this._target;
      let best = null, bk = null;
      list.forEach(p => {
        const s = p[0], n = +p[1] || 5, ty = s + n, c = sp._bingpai[s][n], u = this._suanpai._paishu[s][n];
        let key;
        if (T === 'kok') {
          const yao = YAO.indexOf(ty) >= 0;
          key = !yao ? [0, 0] : (c >= 2 ? [1, -c] : [2, 0]);
        } else if (T === 'xi') {
          const protect = (WINDS.indexOf(ty) >= 0 && (c === 2 || c === 3)) ? 1 : 0;
          key = [protect, Majiang.Util.xiangting(sp.clone().dapai(p)), WINDS.indexOf(ty) >= 0 ? 1 : 0, u];
        } else {
          const inSet = T === 'ch' ? s === this._suit : SETS[T].indexOf(ty) >= 0;
          key = [inSet ? 1 : 0, Majiang.Util.xiangting(sp.clone().dapai(p)), u];
        }
        let cmp = 0;
        if (bk) { for (let i = 0; i < key.length && !cmp; i++) { cmp = key[i] - bk[i]; } }
        if (!bk || cmp < 0) { bk = key; best = p; }
      });
      return best || super.select_dapai(info);
    }
  }

  function playOne(part, j, frame, arm, seed) {
    const rnd = mulberry32(seed);
    const t = 1 + Math.floor(rnd() * 3);
    const built = buildShan(frame, t, rnd);
    const ctx = { t: t, arm: arm, frame: frame };
    class G extends Majiang.Game { qipai(shan) { if (this._aiteUsed) { return super.qipai(); } this._aiteUsed = true; return super.qipai(built.shan); } }
    let paipu = null;
    const players = [0, 1, 2, 3].map(() => new YakuAI(ctx));
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
    let res = '無関係', yaku = '', type = '', names = '', toR = '', pts = 0;
    if (hules.length) {
      const won = hules.filter(h => h.l === t), dealt = hules.filter(h => typeof h.baojia === 'number' && h.baojia === t);
      if (won.length) { const h = won[0]; res = '和了'; yaku = h.damanguan ? 1 : 0; type = (typeof h.baojia === 'number') ? 'ロン' : 'ツモ'; names = (h.hupai || []).map(x => x.name).join('+'); }
      else if (dealt.length) { res = '放銃'; toR = dealt.some(h => riichi[h.l]) ? 1 : 0; }
      else if (hules.some(h => typeof h.baojia !== 'number')) { res = '被ツモ'; }
      hules.forEach(h => { pts += (h.fenpei && h.fenpei[t]) || 0; });
    } else if (pingju) { res = (/九種/.test(String(pingju.name || '')) ? '九種流し' : '流局'); pts = (pingju.fenpei && pingju.fenpei[t]) || 0; }
    let ro = 0; for (let l = 0; l < 4; l++) { if (l !== t && riichi[l]) { ro = 1; } }
    return [part, j, frame.id, arm, t, built.hand.join(''), res, yaku, type, names, toR, ro, pts, Math.ceil(z / 4), nd];
  }
  return { playOne: playOne };
}

function work(out, ms, part, maxCycles) {
  const table = makeTable();
  const t0 = Date.now(); let n = 0, err = 0;
  fs.writeFileSync(out, HEAD.join('\t') + '\n');
  for (let j = 1; j <= maxCycles && Date.now() - t0 < ms; j++) {
    for (let f = 0; f < FRAMES.length; f++) {
      const seed = 100003 * part + 7919 * j + 31 * f + 20261126 + 1000003 * Number(process.env.SEED_OFF || 0);
      armsOf(FRAMES[f]).forEach(arm => {
        if (Date.now() - t0 >= ms) { return; }
        try {
          const r = table.playOne(part, j, FRAMES[f], arm, seed);
          if (r) { fs.appendFileSync(out, r.join('\t') + '\n'); n++; }
        } catch (e) { err++; if (err <= 5) { console.error('本' + part + ' 周' + j + ' ' + FRAMES[f].id + ' ' + arm + ' で落ちた: ' + ((e && e.stack) || e)); } }
      });
    }
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
function isHit(r, frame) {
  if (r['結果'] !== '和了') { return 0; }
  const nm = hitNames(frame, r['腕']), got = String(r['役名']).split('+');
  return got.some(x => nm.indexOf(x) >= 0) ? 1 : 0;
}
function summarize(rows, title) {
  const P = s => console.log(s);
  P(''); P('## ' + title); P('');
  P('| 枠 | 腕 | 局 | 狙いの役満和了 | 役満和了（何でも） | 和了（全部） | 放銃 | （立直者へ） | 被ツモ | 流局 | 九種流し | 平均点棒 | 立直が入った局 | 巡目の平均 |');
  P('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  FRAMES_ALL.forEach(f => armsOf(f).forEach(a => {
    const xs = rows.filter(r => r['枠'] === f.id && r['腕'] === a), n = xs.length;
    if (!n) { return; }
    const wn = xs.filter(r => r['結果'] === '和了'), dl = xs.filter(r => r['結果'] === '放銃');
    const hit = xs.filter(r => isHit(r, f)).length;
    P('| ' + f.id + ' | ' + a + ' | ' + n + ' | ' + pc(hit, n) + ' ' + ci(hit, n) + ' | ' + pc(wn.filter(r => r['役満'] === '1').length, n) + ' | ' + pc(wn.length, n)
      + ' | ' + pc(dl.length, n) + ' | ' + pc(dl.filter(r => r['放銃先リーチ'] === '1').length, n) + ' | ' + pc(xs.filter(r => r['結果'] === '被ツモ').length, n)
      + ' | ' + pc(xs.filter(r => r['結果'] === '流局').length, n) + ' | ' + pc(xs.filter(r => r['結果'] === '九種流し').length, n) + ' | ' + mean(xs.map(r => num(r['点棒']))).toFixed(0)
      + ' | ' + pc(xs.filter(r => r['受リーチ'] === '1').length, n) + ' | ' + mean(xs.map(r => num(r['巡目']))).toFixed(1) + ' |');
  }));
  P(''); P('### 同じ山どうしの差（腕 − base・同じ枠・同じ周・同じ本）');
  P(''); P('| 枠 | 腕 | 組 | 狙いの役満和了率の差 | 和了率の差 | 点棒の差（平均±標準誤差×1.96） | 放銃率の差 |'); P('|---|---|---|---|---|---|---|');
  FRAMES_ALL.forEach(f => armsOf(f).filter(a => a !== 'base').forEach(a => {
    const idx = {};
    rows.filter(r => r['枠'] === f.id).forEach(r => { const k = r['本'] + '-' + r['周']; (idx[k] = idx[k] || {})[r['腕']] = r; });
    const pairs = Object.keys(idx).map(k => idx[k]).filter(o => o[a] && o['base']);
    if (!pairs.length) { return; }
    const W = r => r['結果'] === '和了' ? 1 : 0, D = r => r['結果'] === '放銃' ? 1 : 0;
    const dy = pairs.map(o => isHit(o[a], f) - isHit(o['base'], f)), dw = pairs.map(o => W(o[a]) - W(o['base']));
    const dp = pairs.map(o => num(o[a]['点棒']) - num(o['base']['点棒'])), dd = pairs.map(o => D(o[a]) - D(o['base']));
    P('| ' + f.id + ' | ' + a + ' | ' + pairs.length + ' | ' + (mean(dy) * 100).toFixed(1) + 'pt ±' + (196 * se(dy)).toFixed(1) + ' | ' + (mean(dw) * 100).toFixed(1) + 'pt ±' + (196 * se(dw)).toFixed(1)
      + ' | ' + mean(dp).toFixed(0) + ' ±' + (1.96 * se(dp)).toFixed(0) + ' | ' + (mean(dd) * 100).toFixed(1) + 'pt ±' + (196 * se(dd)).toFixed(1) + ' |');
  }));
  P(''); P('＊狙いの役満和了＝その腕の狙う役満の名が役名に入った和了（base は、枠の役満のどれでも。cmp の base は字一色・小四喜・大四喜・国士のどれでも）。');
  P('＊読み方の注意：機械打ちは聴牌即立直。push／kok／zi／xi はダマ。作り配牌を積むので他家の配牌からその牌が減る。点棒は役満の幅が広い＝差は同じ山どうしの欄で読む。cmp の三腕の比べは、同じ枠の行の点棒・狙いの役満和了を並べて読む。');
}

const argv = process.argv.slice(2);
if (argv[0] === '--summarize') {
  const rows = readRows(argv[1]);
  if (!rows) { console.error('記録の見出しが合わない: ' + argv[1]); process.exit(1); }
  summarize(rows, '集計（' + path.basename(argv[1]) + '・' + rows.length + '行）');
} else if (argv[0] === '--worker') {
  work(argv[1], Number(argv[2]), Number(argv[3]), Infinity);
} else if (argv[0] === '--local') {
  const n = Math.max(1, Math.min(5, Number(argv[1]) || 1));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-yk5-'));
  const f = path.join(dir, 'part-0.tsv');
  work(f, 150 * 1000, 0, n);
  const rows = readRows(f) || [];
  console.log(HEAD.join('\t'));
  rows.slice(0, 6).forEach(r => console.log(HEAD.map(h => r[h]).join('\t')));
  summarize(rows, '手元の極小の試し（' + n + '周・数は当てにならない）');
  const by = {}; rows.forEach(r => { const k = r['枠'] + r['周']; (by[k] = by[k] || {})[r['腕']] = r['配牌'] + '@' + r['席']; });
  const ks = Object.keys(by), same = ks.filter(k => { const v = Object.keys(by[k]).map(a => by[k][a]); return v.every(x => x === v[0]); }).length;
  console.log('同じ山の確かめ：全腕で配牌と席が同じだった枠×周 ' + same + '／' + ks.length);
  fs.rmSync(dir, { recursive: true, force: true });
} else {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const OUT = path.join(ROOT, 'reports', NAME + stamp + '.tsv');
  if (!fs.existsSync(path.join(ROOT, 'node_modules', '@kobalab'))) { execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' }); }
  console.log('役満五つの相手あり測りを ' + NWORK + '本並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止まる・枠 ' + FRAMES.length + (ONLY ? '・' + ONLY + 'だけ' : '') + '）');
  const t0 = Date.now(), files = [], runs = [];
  for (let k = 0; k < NWORK; k++) {
    const f = path.join(os.tmpdir(), 'yk5-part-' + k + '.tsv');
    files.push(f);
    runs.push(new Promise(res => {
      const p = spawn(process.execPath, [__filename, '--worker', f, String(WORK_MS), String(k)], { cwd: ROOT, env: Object.assign({}, process.env, { ONLY: ONLY }), stdio: ['ignore', 'ignore', 'inherit'] });
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
    fs.writeFileSync(OUT, '# 雲で回した 役満五つの相手あり測り（' + stamp + ' UTC・push/base・cmp は kok/zi/xi/base・同じ山）。\n' + HEAD.join('\t') + '\n' + body.join('\n') + '\n');
    const rows = readRows(OUT) || [];
    console.log('');
    console.log('終了コード ' + JSON.stringify(codes) + '／' + Math.round((Date.now() - t0) / 1000) + '秒／' + rows.length + '行');
    console.log('記録 … reports/' + path.basename(OUT));
    summarize(rows, '今回の走り');
  });
}
