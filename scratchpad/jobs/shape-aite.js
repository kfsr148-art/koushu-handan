// 雲で：七対子・染め・対々の「相手あり」の測り（棚 #16）。yakuman-aite.js／yakuman-aite4.js の写し。
//   ＊majiang-core の一局戦。子の一席（1〜3をでたらめ）に作り配牌を積み、その席だけ「形を狙う打ち手」。他三席は @kobalab/majiang-ai のまま。
//   ＊腕（同じ作り配牌・同じ山を、その席の打ち手だけ替えて打つ）：push＝形に決めて打つ／base＝元の機械打ち（基準）。
//   ＊push の決め：七対子＝鳴かない・槓しない・立直しない（ダマ）・対子を残し一枚物から切る／染め＝配牌で一番多い色に決め、他の色の数牌から切る・鳴くのは決めた色か字牌で向聴が進む時だけ（ポン・チー）・立直しない／対々和＝ポンだけ鳴く（対子が相手の捨て牌で刻子になる時）・暗刻と対子を残し一枚物から切る・立直しない。
//   ＊和了の形になれば形以外でも上がる（ツモもロンも）。九種九牌は流さない（push）。山は種つきで自分で並べる（同じ枠・同じ周なら二腕で同じ山）。
//   ＊本体（koushu-handan.html）・核には触らない。通信は npm ci だけ。記録は reports/cloud-shape-aite-<刻>.tsv。走るたびに前の記録も足した通しの表を出す。
//   使い方：node scratchpad/jobs/shape-aite.js            … 雲（npm ci→4本並列・一本 1230秒で自分から止まる）
//           node scratchpad/jobs/shape-aite.js --local 1  … 手元の極小の試し（全枠×二腕を1周・記録は一時の所に書いて消す）
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const WORK_MS = 1230 * 1000, KILL_MS = 1320 * 1000, NWORK = 4;
const NAME = 'cloud-shape-aite-';
const ARMS = ['push', 'base'];
/* 枠：q＝七対子（対子 k 組＋残りは重ならない一枚物）／f＝染め（一色の数牌 n 枚＋字牌 h 枚＋残りは他の二色の数牌）／p＝対々（暗刻 kt 組＋対子 p 組＋残りの一枚物） */
const FRAMES = [
  { id: 'q3', kind: 'q', k: 3 }, { id: 'q4', kind: 'q', k: 4 }, { id: 'q5', kind: 'q', k: 5 }, { id: 'q6', kind: 'q', k: 6 },
  { id: 'f7', kind: 'f', n: 7, h: 0 }, { id: 'f8', kind: 'f', n: 8, h: 0 }, { id: 'f9', kind: 'f', n: 9, h: 0 }, { id: 'f10', kind: 'f', n: 10, h: 0 },
  { id: 'g8', kind: 'f', n: 6, h: 2 }, { id: 'g10', kind: 'f', n: 7, h: 3 }, { id: 'g12', kind: 'f', n: 8, h: 4 },
  { id: 't14', kind: 'p', kt: 1, p: 4 }, { id: 't22', kind: 'p', kt: 2, p: 2 }, { id: 't23', kind: 'p', kt: 2, p: 3 }, { id: 't31', kind: 'p', kt: 3, p: 1 }, { id: 't32', kind: 'p', kt: 3, p: 2 }
];
const SHAPE_NAMES = { q: ['七対子'], f: ['混一色', '清一色'], p: ['対々和'] };
const HEAD = ['本', '周', '枠', '腕', '席', '配牌', '結果', '役満', '形和了', '和了型', '役名', '放銃先リーチ', '受リーチ', '点棒', '巡目', '打数'];
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const ALL = []; ['m', 'p', 's'].forEach(s => { for (let n = 1; n <= 9; n++) { ALL.push(s + n); } }); for (let n = 1; n <= 7; n++) { ALL.push('z' + n); }
function shuffle(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
const kk = p => p[0] + (+p[1] || 5);   /* 赤5(0)は5として数える */

function makeTable() {
  const Majiang = require('@kobalab/majiang-core');
  const AI = require('@kobalab/majiang-ai');
  const rule = Majiang.rule({ '場数': 0 });

  /* 作り配牌と山：pop の順に 席0の13・席1の13・席2の13・席3の13・残り。 */
  function buildShan(frame, t, rnd) {
    const shan = new Majiang.Shan(rule);
    const pool = shan._pai.slice().sort();   /* Shan は Math.random で並ぶので、並びを決めてから種つきで混ぜる */
    const take = p => { const i = pool.indexOf(p); if (i < 0) { throw new Error('牌が足りない ' + p); } pool.splice(i, 1); return p; };
    const hand = [];
    if (frame.kind === 'q') {
      const ts = shuffle(ALL.slice(), rnd); let q = 0;
      for (let i = 0; i < frame.k; i++) { const ty = ts[q++]; for (let c = 0; c < 2; c++) { hand.push(take(ty)); } }
      while (hand.length < 13) { hand.push(take(ts[q++])); }
    } else if (frame.kind === 'p') {
      const ts = shuffle(ALL.slice(), rnd); let q = 0;
      for (let i = 0; i < frame.kt; i++) { const ty = ts[q++]; for (let c = 0; c < 3; c++) { hand.push(take(ty)); } }
      for (let i = 0; i < frame.p; i++) { const ty = ts[q++]; for (let c = 0; c < 2; c++) { hand.push(take(ty)); } }
      while (hand.length < 13) { hand.push(take(ts[q++])); }
    } else {
      const suit = ['m', 'p', 's'][Math.floor(rnd() * 3)];
      const sp = shuffle(pool.filter(p => p[0] === suit), rnd), hp = shuffle(pool.filter(p => p[0] === 'z'), rnd), op = shuffle(pool.filter(p => p[0] !== suit && p[0] !== 'z'), rnd);
      sp.slice(0, frame.n).forEach(p => hand.push(take(p)));
      hp.slice(0, frame.h).forEach(p => hand.push(take(p)));
      for (let i = 0; hand.length < 13; i++) { hand.push(take(op[i])); }
    }
    shuffle(pool, rnd);
    const order = [];
    for (let l = 0; l < 4; l++) {
      if (l === t) { hand.forEach(h => order.push(h)); } else { for (let i = 0; i < 13; i++) { order.push(pool.pop()); } }
    }
    const rest = pool.slice();
    shan._pai = rest.concat(order.slice().reverse());   /* 末尾から pop される＝order の先頭が最初に配られる */
    shan._baopai = [shan._pai[4]];
    shan._fubaopai = rule['裏ドラあり'] ? [shan._pai[9]] : null;
    return { shan: shan, hand: hand };
  }

  /* 対々の向聴（鳴いた面子 m ＋ 手の暗刻・対子で数える簡易）：8 − 2×刻子 − 対子 */
  function toitoiXt(sp) {
    const b = sp._bingpai; let sets = sp._fulou.length, pairs = 0;
    ['m', 'p', 's', 'z'].forEach(k => { for (let n = 1; n <= (k === 'z' ? 7 : 9); n++) { if (b[k][n] >= 3) { sets++; } else if (b[k][n] === 2) { pairs++; } } });
    if (sets + pairs > 5) { pairs = 5 - sets; }
    return 8 - 2 * sets - pairs;
  }

  class ShapeAI extends AI {
    constructor(ctx) { super(); this._ctx = ctx; this._yaku = false; this._suit = null; }
    qipai(qipai) {
      super.qipai(qipai);
      this._yaku = (this._ctx.arm !== 'base') && this._ctx.t === this._menfeng;
      if (this._yaku && this._ctx.frame.kind === 'f') {
        const b = this.shoupai._bingpai; let best = 'm', bc = -1;
        ['m', 'p', 's'].forEach(s => { let c = 0; for (let n = 1; n <= 9; n++) { c += b[s][n]; } if (c > bc) { bc = c; best = s; } });
        this._suit = best;
      }
    }
    select_gang(info) { return this._yaku ? undefined : super.select_gang(info); }
    select_pingju() { return this._yaku ? false : super.select_pingju(); }
    select_fulou(dapai, info) {
      if (!this._yaku) { return super.select_fulou(dapai, info); }
      const kind = this._ctx.frame.kind;
      if (kind === 'q') { return undefined; }
      const d = ['', '+', '=', '-'][(4 + this._model.lunban - this._menfeng) % 4];
      const p = dapai.p.slice(0, 2) + d;
      if (kind === 'p') {
        const ms = this.get_peng_mianzi(this.shoupai, p);
        if (!ms.length) { return undefined; }
        const b = this.shoupai._bingpai, s = dapai.p[0], n = +dapai.p[1] || 5;
        return b[s][n] >= 2 ? ms[0] : undefined;
      }
      /* 染め：決めた色か字牌で、向聴が進む時だけ */
      if (dapai.p[0] !== this._suit && dapai.p[0] !== 'z') { return undefined; }
      const xt = Majiang.Util.xiangting(this.shoupai);
      const ms = this.get_peng_mianzi(this.shoupai, p).concat(this.get_chi_mianzi(this.shoupai, p));
      let best = null, bx = xt;
      ms.forEach(m => {
        const sp = this.shoupai.clone().fulou(m);
        const x = Majiang.Util.xiangting(sp);
        if (x < bx) { bx = x; best = m; }
      });
      return best || undefined;
    }
    select_dapai(info) {
      if (!this._yaku) { return super.select_dapai(info); }
      const kind = this._ctx.frame.kind, sp = this.shoupai, list = this.get_dapai(sp);
      let best = null, bk = null;
      list.forEach(p => {
        const s = p[0], n = +p[1] || 5, c = sp._bingpai[s][n], u = this._suanpai._paishu[s][n];
        const after = sp.clone().dapai(p);
        let key;
        if (kind === 'q') { key = [Majiang.Util.xiangting_qidui(after), c >= 3 ? 0 : c === 1 ? 1 : 2, u]; }
        else if (kind === 'p') { key = [toitoiXt(after), c >= 3 ? 1 : c === 1 ? 0 : 1, u]; }
        else {
          const off = (s !== this._suit && s !== 'z') ? 0 : 1;
          key = [off, Majiang.Util.xiangting(after), s === 'z' && c === 1 ? 0 : 1, u];
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
    class G extends Majiang.Game { qipai(shan) { if (this._aiteUsed) { return super.qipai(); } this._aiteUsed = true; return super.qipai(built.shan); } }   /* 流局の連荘で次の局が始まった時は、普通の山（記録は最初の局だけ読む） */
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
        shape = hn.some(x => SHAPE_NAMES[frame.kind].indexOf(x) >= 0) ? 1 : 0;
      }
      else if (dealt.length) { res = '放銃'; toR = dealt.some(h => riichi[h.l]) ? 1 : 0; }
      else if (hules.some(h => typeof h.baojia !== 'number')) { res = '被ツモ'; }
      hules.forEach(h => { pts += (h.fenpei && h.fenpei[t]) || 0; });
    } else if (pingju) { res = '流局'; pts = (pingju.fenpei && pingju.fenpei[t]) || 0; }
    let ro = 0; for (let l = 0; l < 4; l++) { if (l !== t && riichi[l]) { ro = 1; } }
    return [part, j, frame.id, arm, t, built.hand.join(''), res, yaku, shape, type, names, toR, ro, pts, Math.ceil(z / 4), nd];
  }
  return { playOne: playOne };
}

function work(out, ms, part, maxCycles) {
  const table = makeTable();
  const t0 = Date.now(); let n = 0, err = 0;
  fs.writeFileSync(out, HEAD.join('\t') + '\n');
  for (let j = 1; j <= maxCycles && Date.now() - t0 < ms; j++) {
    for (let f = 0; f < FRAMES.length; f++) {
      const seed = 100003 * part + 7919 * j + 31 * f + 20261124;
      ARMS.forEach(arm => {
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
function summarize(rows, title) {
  const P = s => console.log(s);
  P(''); P('## ' + title); P('');
  P('| 枠 | 腕 | 局 | 和了（全部） | 形の和了 | 役満和了 | 放銃 | （立直者へ） | 被ツモ | 流局 | 平均点棒 | 立直が入った局 | 巡目の平均 |');
  P('|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  FRAMES.forEach(f => ARMS.forEach(a => {
    const xs = rows.filter(r => r['枠'] === f.id && r['腕'] === a), n = xs.length;
    const wn = xs.filter(r => r['結果'] === '和了'), dl = xs.filter(r => r['結果'] === '放銃');
    P('| ' + f.id + ' | ' + a + ' | ' + n + ' | ' + pc(wn.length, n) + ' ' + ci(wn.length, n) + ' | ' + pc(wn.filter(r => r['形和了'] === '1').length, n) + ' | ' + pc(wn.filter(r => r['役満'] === '1').length, n)
      + ' | ' + pc(dl.length, n) + ' | ' + pc(dl.filter(r => r['放銃先リーチ'] === '1').length, n) + ' | ' + pc(xs.filter(r => r['結果'] === '被ツモ').length, n)
      + ' | ' + pc(xs.filter(r => r['結果'] === '流局').length, n) + ' | ' + mean(xs.map(r => num(r['点棒']))).toFixed(0) + ' | ' + pc(xs.filter(r => r['受リーチ'] === '1').length, n) + ' | ' + mean(xs.map(r => num(r['巡目']))).toFixed(1) + ' |');
  }));
  P(''); P('### 同じ山どうしの差（push − base・同じ枠・同じ周・同じ本）');
  P(''); P('| 枠 | 組 | 和了率の差 | 形の和了率の差 | 点棒の差（平均±標準誤差×1.96） | 放銃率の差 |'); P('|---|---|---|---|---|---|');
  FRAMES.forEach(f => {
    const idx = {};
    rows.filter(r => r['枠'] === f.id).forEach(r => { const k = r['本'] + '-' + r['周']; (idx[k] = idx[k] || {})[r['腕']] = r; });
    const pairs = Object.keys(idx).map(k => idx[k]).filter(o => o['push'] && o['base']);
    const W = r => r['結果'] === '和了' ? 1 : 0, S = r => (r['結果'] === '和了' && r['形和了'] === '1') ? 1 : 0;
    const dw = pairs.map(o => W(o['push']) - W(o['base'])), ds = pairs.map(o => S(o['push']) - S(o['base']));
    const dp = pairs.map(o => num(o['push']['点棒']) - num(o['base']['点棒']));
    const dd = pairs.map(o => (o['push']['結果'] === '放銃' ? 1 : 0) - (o['base']['結果'] === '放銃' ? 1 : 0));
    P('| ' + f.id + ' | ' + pairs.length + ' | ' + (mean(dw) * 100).toFixed(1) + 'pt ±' + (196 * se(dw)).toFixed(1) + ' | ' + (mean(ds) * 100).toFixed(1) + 'pt ±' + (196 * se(ds)).toFixed(1) + ' | ' + mean(dp).toFixed(0) + ' ±' + (1.96 * se(dp)).toFixed(0) + ' | ' + (mean(dd) * 100).toFixed(1) + 'pt ±' + (196 * se(dd)).toFixed(1) + ' |');
  });
  P(''); P('＊読み方の注意：機械打ちは聴牌即立直。push はダマ（染め・対々で鳴けば立直不可）＝立直の分の差は出ない。作り配牌を積むので他家の配牌からその牌が減る。差は同じ山どうしの欄で読む。');
}

const argv = process.argv.slice(2);
if (argv[0] === '--worker') {
  work(argv[1], Number(argv[2]), Number(argv[3]), Infinity);
} else if (argv[0] === '--local') {
  const n = Math.max(1, Math.min(5, Number(argv[1]) || 1));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-aite-'));
  const f = path.join(dir, 'part-0.tsv');
  work(f, 150 * 1000, 0, n);
  const rows = readRows(f) || [];
  console.log(HEAD.join('\t'));
  rows.slice(0, 6).forEach(r => console.log(HEAD.map(h => r[h]).join('\t')));
  summarize(rows, '手元の極小の試し（' + n + '周・数は当てにならない）');
  const by = {}; rows.forEach(r => { const k = r['枠'] + r['周']; (by[k] = by[k] || {})[r['腕']] = r['配牌'] + '@' + r['席']; });
  const same = Object.keys(by).filter(k => { const o = by[k]; return o.push && o.base && o.push === o.base; }).length;
  console.log('同じ山の確かめ：二腕とも配牌と席が同じだった枠×周 ' + same + '／' + Object.keys(by).length);
  fs.rmSync(dir, { recursive: true, force: true });
} else {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const OUT = path.join(ROOT, 'reports', NAME + stamp + '.tsv');
  console.log('依存を入れる（npm ci）…');
  execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' });
  console.log('形の相手あり測りを ' + NWORK + '本並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止まる）');
  const t0 = Date.now(), files = [], runs = [];
  for (let k = 0; k < NWORK; k++) {
    const f = path.join(ROOT, 'reports', '.aite-part-' + k + '.tsv');
    files.push(f);
    runs.push(new Promise(res => {
      const p = spawn(process.execPath, [__filename, '--worker', f, String(WORK_MS), String(k)], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
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
    fs.writeFileSync(OUT, '# 雲で回した 七対子・染め・対々の相手あり測り（' + stamp + ' UTC・push/base の二腕・同じ山）。\n' + HEAD.join('\t') + '\n' + body.join('\n') + '\n');
    const rows = readRows(OUT) || [];
    console.log('');
    console.log('終了コード ' + JSON.stringify(codes) + '／' + Math.round((Date.now() - t0) / 1000) + '秒／' + rows.length + '行');
    console.log('記録 … reports/' + path.basename(OUT));
    summarize(rows, '今回の走り');
    const olds = fs.readdirSync(path.join(ROOT, 'reports')).filter(n => n.indexOf(NAME) === 0 && n.slice(-4) === '.tsv').sort();
    if (olds.length > 1) {
      let all = []; const used = [];
      olds.forEach((n, i) => { const r = readRows(path.join(ROOT, 'reports', n)); if (!r) { return; } r.forEach(x => { x['本'] = i + '-' + x['本']; }); all = all.concat(r); used.push(n); });
      summarize(all, '通し（' + used.length + '本の記録を足した・' + used.join('、') + '）');
    }
  });
}
