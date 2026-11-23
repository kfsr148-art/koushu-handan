// 雲で：染め（混一色・清一色）の「相手あり」の測り・棚 #16 段2/3（枠 染めの相手あり）。scratchpad/jobs/shape-aite.js の写しで、染めだけを細かく測る。
//   ＊majiang-core の一局戦。子の一席（1〜3をでたらめ）に作り配牌を積み、その席だけ「染めを狙う打ち手」。他三席は @kobalab/majiang-ai のまま。
//   ＊腕（同じ作り配牌・同じ山を、その席の打ち手だけ替えて打つ）：push＝染めに決めて打つ（ダマ）／pushR＝push と同じだが門前で聴牌したら立直する／base＝元の機械打ち（基準）。
//   ＊push の決め：配牌で一番多い色に決め、他の色の数牌から切る・鳴くのは決めた色か字牌で向聴が進む時だけ（ポン・チー）・九種九牌は流さない・槓しない。
//   ＊枠：c＝一色の数牌 n 枚（字牌なし）／h＝一色 n 枚＋字牌 h 枚。残りは他の二色の数牌。山は種つきで自分で並べる（同じ枠・同じ周なら三腕で同じ山）。
//   ＊本体（koushu-handan.html）・核には触らない。この台本は reports/ に置く（scratchpad/jobs に置くと雲の自動走りが起きるため）。
//   使い方：node reports/flush-aite-20261124.js            … 雲（4本並列・WORK_S 秒で自分から止まる・既定 1230）
//           node reports/flush-aite-20261124.js --local 1  … 手元の極小の試し
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
const WORK_MS = Number(process.env.WORK_S || (process.argv[2] === '--secs' ? process.argv[3] : 0) || 1230) * 1000, KILL_MS = WORK_MS + 90000, NWORK = 4;
const NAME = 'cloud-flush-aite-';
const ARMS = ['push', 'pushR', 'base'];
const FRAMES = [
  { id: 'c6', n: 6, h: 0 }, { id: 'c7', n: 7, h: 0 }, { id: 'c8', n: 8, h: 0 }, { id: 'c9', n: 9, h: 0 }, { id: 'c10', n: 10, h: 0 }, { id: 'c11', n: 11, h: 0 },
  { id: 'h6', n: 5, h: 1 }, { id: 'h7', n: 5, h: 2 }, { id: 'h8', n: 6, h: 2 }, { id: 'h9', n: 6, h: 3 }, { id: 'h10', n: 7, h: 3 }, { id: 'h11', n: 8, h: 3 }, { id: 'h12', n: 8, h: 4 }
];
const SHAPE_NAMES = ['混一色', '清一色'];
const HEAD = ['本', '周', '枠', '腕', '席', '配牌', '結果', '役満', '形和了', '和了型', '役名', '放銃先リーチ', '受リーチ', '点棒', '巡目', '打数'];
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }

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
    const suit = ['m', 'p', 's'][Math.floor(rnd() * 3)];
    const sp = shuffle(pool.filter(p => p[0] === suit), rnd), hp = shuffle(pool.filter(p => p[0] === 'z'), rnd), op = shuffle(pool.filter(p => p[0] !== suit && p[0] !== 'z'), rnd);
    sp.slice(0, frame.n).forEach(p => hand.push(take(p)));
    hp.slice(0, frame.h).forEach(p => hand.push(take(p)));
    for (let i = 0; hand.length < 13; i++) { hand.push(take(op[i])); }
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

  class ShapeAI extends AI {
    constructor(ctx) { super(); this._ctx = ctx; this._yaku = false; this._suit = null; }
    qipai(qipai) {
      super.qipai(qipai);
      this._yaku = (this._ctx.arm !== 'base') && this._ctx.t === this._menfeng;
      if (this._yaku) {
        const b = this.shoupai._bingpai; let best = 'm', bc = -1;
        ['m', 'p', 's'].forEach(s => { let c = 0; for (let n = 1; n <= 9; n++) { c += b[s][n]; } if (c > bc) { bc = c; best = s; } });
        this._suit = best;
      }
    }
    select_gang(info) { return this._yaku ? undefined : super.select_gang(info); }
    select_pingju() { return this._yaku ? false : super.select_pingju(); }
    select_fulou(dapai, info) {
      if (!this._yaku) { return super.select_fulou(dapai, info); }
      const d = ['', '+', '=', '-'][(4 + this._model.lunban - this._menfeng) % 4];
      const p = dapai.p.slice(0, 2) + d;
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
      const sp = this.shoupai, list = this.get_dapai(sp);
      let best = null, bk = null;
      list.forEach(p => {
        const s = p[0], n = +p[1] || 5, c = sp._bingpai[s][n], u = this._suanpai._paishu[s][n];
        const after = sp.clone().dapai(p);
        const off = (s !== this._suit && s !== 'z') ? 0 : 1;
        const key = [off, Majiang.Util.xiangting(after), s === 'z' && c === 1 ? 0 : 1, u];
        let cmp = 0;
        if (bk) { for (let i = 0; i < key.length && !cmp; i++) { cmp = key[i] - bk[i]; } }
        if (!bk || cmp < 0) { bk = key; best = p; }
      });
      if (best && this._ctx.arm === 'pushR' && sp.menqian && Majiang.Util.xiangting(sp.clone().dapai(best)) === 0 && this.select_lizhi(best)) { return best + '*'; }
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
        shape = hn.some(x => SHAPE_NAMES.indexOf(x) >= 0) ? 1 : 0;
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
      const seed = 100003 * part + 7919 * j + 31 * f + 20261125 + 1000003 * Number(process.env.SEED_OFF || 0);
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
  ['push', 'pushR'].forEach(arm => {
    P(''); P('### 同じ山どうしの差（' + arm + ' − base・同じ枠・同じ周・同じ本）');
    P(''); P('| 枠 | 組 | 和了率の差 | 形の和了率の差 | 点棒の差（平均±標準誤差×1.96） | 放銃率の差 |'); P('|---|---|---|---|---|---|');
    FRAMES.forEach(f => {
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
  P(''); P('＊読み方の注意：機械打ちは聴牌即立直。push はダマ（鳴けば立直不可）。pushR は門前で聴牌したら立直（機械打ちと同じく）。作り配牌を積むので他家の配牌からその牌が減る。差は同じ山どうしの欄で読む。');
}

const argv = process.argv.slice(2);
if (argv[0] === '--worker') {
  work(argv[1], Number(argv[2]), Number(argv[3]), Infinity);
} else if (argv[0] === '--local') {
  const n = Math.max(1, Math.min(5, Number(argv[1]) || 1));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-flush-'));
  const f = path.join(dir, 'part-0.tsv');
  work(f, 150 * 1000, 0, n);
  const rows = readRows(f) || [];
  console.log(HEAD.join('\t'));
  rows.slice(0, 6).forEach(r => console.log(HEAD.map(h => r[h]).join('\t')));
  summarize(rows, '手元の極小の試し（' + n + '周・数は当てにならない）');
  const by = {}; rows.forEach(r => { const k = r['枠'] + r['周']; (by[k] = by[k] || {})[r['腕']] = r['配牌'] + '@' + r['席']; });
  const same = Object.keys(by).filter(k => { const o = by[k]; return o.push && o.base && o.pushR && o.push === o.base && o.push === o.pushR; }).length;
  console.log('同じ山の確かめ：三腕とも配牌と席が同じだった枠×周 ' + same + '／' + Object.keys(by).length);
  fs.rmSync(dir, { recursive: true, force: true });
} else {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const OUT = path.join(ROOT, 'reports', NAME + stamp + '.tsv');
  if (!fs.existsSync(path.join(ROOT, 'node_modules', '@kobalab'))) { execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' }); }
  console.log('染めの相手あり測りを ' + NWORK + '本並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止まる）');
  const t0 = Date.now(), files = [], runs = [];
  for (let k = 0; k < NWORK; k++) {
    const f = path.join(os.tmpdir(), 'flush-part-' + k + '.tsv');
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
    fs.writeFileSync(OUT, '# 雲で回した 染めの相手あり測り（' + stamp + ' UTC・push/pushR/base の三腕・同じ山）。\n' + HEAD.join('\t') + '\n' + body.join('\n') + '\n');
    const rows = readRows(OUT) || [];
    console.log('');
    console.log('終了コード ' + JSON.stringify(codes) + '／' + Math.round((Date.now() - t0) / 1000) + '秒／' + rows.length + '行');
    console.log('記録 … reports/' + path.basename(OUT));
    summarize(rows, '今回の走り');
  });
}
