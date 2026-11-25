// 雲で：配牌に同じ牌が四枚ある手で、暗槓するか・ばらすかの相手あり測り・橋の枠 三百十六（棚 #28）。reports/dora-aite-20261125.js の型の写し
//   ＊majiang-core の一局戦。子の一席（1〜3をでたらめ）に作り配牌を積み、その席だけ腕を替える。他三席は @kobalab/majiang-ai のまま。
//   ＊同じ作り配牌・同じ山を、その席の腕だけ替えて打つ（同じ枠・同じ周・同じ本なら全腕で同じ山・同じ席）。
//   ＊本体（koushu-handan.html）・核・analyze() には触らない。この台本は reports/ に置く。
//   ＊枠：z＝四枚が字牌／y＝四枚が一九牌／c＝四枚が中張牌（2〜8）。残り9枚は山からでたらめ（その牌以外）。
//   ＊腕：kan＝暗槓できる時はいつも暗槓する（配牌の四枚も、あとで四枚そろった時も）。他は機械打ち
//         nokan＝槓しない（四枚は面子＋1枚や対子としてばらして使う）。他は機械打ち
//         base＝機械の普通打ち（majiang-ai そのまま）
//   ＊新ドラ・嶺上は majiang-core の決まりのまま自然に入る。
//   使い方：node reports/kan4-aite-20261126.js   … 雲（4本並列・WORK_S 秒で自分から止まる・既定 1230）
//           node reports/kan4-aite-20261126.js --local 1   … 手元の極小の試し（各枠一周）
//           node reports/kan4-aite-20261126.js --summarize <tsv>   … 記録の集計（markdown の表）
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
const WORK_MS = Number(process.env.WORK_S || 1230) * 1000, KILL_MS = WORK_MS + 90000, NWORK = 4;
const HEAD = ['本', '周', '枠', '腕', '席', '配牌', '槓数', '結果', '点棒', '和了型', '放銃先リーチ', '受リーチ', '巡目', '打数', '件'];
const ARMS = ['kan', 'nokan', 'base'];
const FRAMES = ['z', 'y', 'c'].map(k => ({ id: k, k: k }));
const numOf = p => +p[1] || 5;
const isYao = p => p[0] === 'z' || numOf(p) === 1 || numOf(p) === 9;

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }

function makeTable() {
  const Majiang = require('@kobalab/majiang-core');
  const AI = require('@kobalab/majiang-ai');
  const rule = Majiang.rule({ '場数': 0 });

  function buildShan(frame, t, rnd) {
    const shan = new Majiang.Shan(rule);
    const pool = shuffle(shan._pai.slice().sort(), rnd);
    const takeIf = f => { const i = pool.findIndex(f); if (i < 0) { throw new Error('牌が足りない'); } return pool.splice(i, 1)[0]; };
    const hand = [];
    const cands = [...new Set(pool.map(p => p.slice(0, 2).replace('0', '5')))].filter(k => frame.k === 'z' ? k[0] === 'z' : frame.k === 'y' ? (k[0] !== 'z' && (numOf(k) === 1 || numOf(k) === 9)) : (k[0] !== 'z' && numOf(k) >= 2 && numOf(k) <= 8));
    const X = cands[Math.floor(rnd() * cands.length)];
    const isX = p => p.slice(0, 2).replace('0', '5') === X;
    for (let i = 0; i < 4; i++) { hand.push(takeIf(isX)); }
    shuffle(pool, rnd);
    while (hand.length < 13) { hand.push(pool.pop()); }
    shuffle(pool, rnd);
    const order = [];
    for (let l = 0; l < 4; l++) {
      if (l === t) { hand.forEach(h => order.push(h)); } else { for (let i = 0; i < 13; i++) { order.push(pool.pop()); } }
    }
    shan._pai = pool.slice().concat(order.slice().reverse());
    shan._baopai = [shan._pai[4]];
    shan._fubaopai = rule['裏ドラあり'] ? [shan._pai[9]] : null;
    return { shan: shan, hand: hand };
  }

  class KanAI extends AI {
    constructor(ctx) { super(); this._ctx = ctx; this._on = false; }
    qipai(qipai) { super.qipai(qipai); this._on = (this._ctx.arm !== 'base') && this._ctx.t === this._menfeng; }
    select_gang(info) {
      if (!this._on) { return super.select_gang(info); }
      if (this._ctx.arm === 'nokan') { return undefined; }
      const an = (this.get_gang_mianzi(this.shoupai) || []).filter(m => /^[mpsz][0-9]{4}$/.test(m));
      return an.length ? an[0] : undefined;
    }
  }

  function playOne(part, j, frame, arm, seed) {
    const rnd = mulberry32(seed);
    const t = 1 + Math.floor(rnd() * 3);
    const built = buildShan(frame, t, rnd);
    const ctx = { t: t, arm: arm };
    class G extends Majiang.Game { qipai(shan) { if (this._aiteUsed) { return super.qipai(); } this._aiteUsed = true; return super.qipai(built.shan); } }
    let paipu = null;
    const players = [0, 1, 2, 3].map(() => new KanAI(ctx));
    const game = new G(players, p => { paipu = p; }, rule, 'aite');
    game.speed = 0; game.stop = null;
    game.do_sync();
    if (!paipu || !paipu.log || !paipu.log.length) { return null; }
    const kyoku = paipu.log[0];
    let z = 0, nd = 0, ng = 0;
    const riichi = {};
    kyoku.forEach(e => {
      if (!e) { return; }
      if (e.zimo) { z++; }
      if (e.gang && e.gang.l === t && /^[mpsz][0-9]{4}$/.test(e.gang.m)) { ng++; }
      if (e.dapai) { if (e.dapai.l === t) { nd++; } if (e.dapai.p.slice(-1) === '*') { riichi[e.dapai.l] = true; } }
    });
    const hules = kyoku.filter(e => e && e.hule).map(e => e.hule);
    const pingju = (kyoku.filter(e => e && e.pingju)[0] || {}).pingju;
    let res = '無関係', type = '', toR = '', pts = 0;
    if (hules.length) {
      const won = hules.filter(h => h.l === t), dealt = hules.filter(h => typeof h.baojia === 'number' && h.baojia === t);
      if (won.length) { res = '和了'; type = (typeof won[0].baojia === 'number') ? 'ロン' : 'ツモ'; }
      else if (dealt.length) { res = '放銃'; toR = dealt.some(h => riichi[h.l]) ? 1 : 0; }
      else if (hules.some(h => typeof h.baojia !== 'number')) { res = '被ツモ'; }
      hules.forEach(h => { pts += (h.fenpei && h.fenpei[t]) || 0; });
    } else if (pingju) { res = '流局'; pts = (pingju.fenpei && pingju.fenpei[t]) || 0; }
    let ro = 0; for (let l = 0; l < 4; l++) { if (l !== t && riichi[l]) { ro = 1; } }
    return [part, j, frame.id, arm, t, built.hand.join(''), ng, res, pts, type, toR, ro, Math.ceil(z / 4), nd, 'kan4'];
  }
  return { playOne: playOne };
}

function work(out, ms, part, maxCycles) {
  const table = makeTable();
  const t0 = Date.now(); let n = 0, err = 0;
  fs.writeFileSync(out, HEAD.join('\t') + '\n');
  for (let j = 1; j <= maxCycles && Date.now() - t0 < ms; j++) {
    FRAMES.forEach((frame, f) => {
      const seed = 100003 * part + 7919 * j + 31 * f + 20261125 + 1000003 * Number(process.env.SEED_OFF || 0);
      ARMS.forEach(arm => {
        if (Date.now() - t0 >= ms) { return; }
        try {
          const r = table.playOne(part, j, frame, arm, seed);
          if (r) { fs.appendFileSync(out, r.join('\t') + '\n'); n++; }
        } catch (e) { err++; if (err <= 5) { console.error('本' + part + ' 周' + j + ' ' + frame.id + ' ' + arm + ' で落ちた: ' + ((e && e.stack) || e)); } }
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
function mean(xs) { return xs.length ? xs.reduce((x, y) => x + y, 0) / xs.length : 0; }
function se(xs) { if (xs.length < 2) { return 0; } const m = mean(xs); return Math.sqrt(xs.reduce((x, y) => x + (y - m) * (y - m), 0) / (xs.length - 1) / xs.length); }
function summarize(rows, title) {
  const P = s => console.log(s);
  P(''); P('## 四枚の種類ごと（z＝字牌・y＝一九牌・c＝中張）：' + title); P('');
  const keys = Array.from(new Set(rows.map(r => r['枠']))).sort((a, b) => 'zyc'.indexOf(a) - 'zyc'.indexOf(b));
  P('| 枠 | 腕 | 局 | 和了 | 放銃 | 被ツモ | 流局 | 平均点棒 | 立直が入った局 | 槓した局 |'); P('|---|---|---|---|---|---|---|---|---|---|');
  keys.forEach(k => ARMS.forEach(a => {
    const xs = rows.filter(r => r['枠'] === k && r['腕'] === a), n = xs.length, cnt = v => xs.filter(r => r['結果'] === v).length;
    P('| ' + k + ' | ' + a + ' | ' + n + ' | ' + pc(cnt('和了'), n) + ' | ' + pc(cnt('放銃'), n) + ' | ' + pc(cnt('被ツモ'), n) + ' | ' + pc(cnt('流局'), n) + ' | ' + mean(xs.map(r => num(r['点棒']))).toFixed(0) + ' | ' + pc(xs.filter(r => r['受リーチ'] === '1').length, n) + ' | ' + pc(xs.filter(r => num(r['槓数']) > 0).length, n) + ' |');
  }));
  [['kan', 'nokan'], ['kan', 'base'], ['nokan', 'base']].forEach(pr => {
    P(''); P('### 同じ山どうしの差（' + pr[0] + ' − ' + pr[1] + '・同じ枠・同じ周・同じ本）'); P('');
    P('| 枠 | 組 | 和了率の差 | 点棒の差（平均±標準誤差×1.96） | 放銃率の差 |'); P('|---|---|---|---|---|');
    keys.forEach(k => {
      const idx = {};
      rows.filter(r => r['枠'] === k).forEach(r => { const q = r['本'] + '-' + r['周'] + '-' + r['枠']; (idx[q] = idx[q] || {})[r['腕']] = r; });
      const pairs = Object.keys(idx).map(q => idx[q]).filter(o => o[pr[0]] && o[pr[1]]);
      const W = r => r['結果'] === '和了' ? 1 : 0, Dd = r => r['結果'] === '放銃' ? 1 : 0;
      const dw = pairs.map(o => W(o[pr[0]]) - W(o[pr[1]])), dp = pairs.map(o => num(o[pr[0]]['点棒']) - num(o[pr[1]]['点棒'])), dd = pairs.map(o => Dd(o[pr[0]]) - Dd(o[pr[1]]));
      P('| ' + k + ' | ' + pairs.length + ' | ' + (mean(dw) * 100).toFixed(1) + 'pt ±' + (196 * se(dw)).toFixed(1) + ' | ' + mean(dp).toFixed(0) + ' ±' + (1.96 * se(dp)).toFixed(0) + ' | ' + (mean(dd) * 100).toFixed(1) + 'pt ±' + (196 * se(dd)).toFixed(1) + ' |');
    });
  });
  P(''); P('＊読み方の注意：配牌に四枚を入れた作り手（残り9枚はでたらめ）。kan は暗槓できる時は必ず槓、nokan は槓しない。腕の席以外は機械打ち。差は同じ山どうしの欄で読む。');
}
function summarizeFile(file) {
  const rows = readRows(file);
  if (!rows || !rows.length) { console.log('読めない記録：' + file); return false; }
  summarize(rows, path.basename(file));
  return true;
}

const argv = process.argv.slice(2);
if (argv[0] === '--worker') {
  work(argv[1], Number(argv[2]), Number(argv[3]), Infinity);
} else if (argv[0] === '--summarize') {
  process.exit(summarizeFile(argv[1]) ? 0 : 1);
} else if (argv[0] === '--local') {
  const n = Math.max(1, Math.min(8, Number(argv[1]) || 1));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-kan4-'));
  const f = path.join(dir, 'part-0.tsv');
  const t0 = Date.now();
  work(f, 150 * 1000, 0, n);
  const rows = readRows(f) || [];
  console.log(HEAD.join('\t'));
  rows.slice(0, 4).forEach(r => console.log(HEAD.map(h => r[h]).join('\t')));
  console.log('極小の試し：' + rows.length + '局・' + Math.round((Date.now() - t0) / 1000) + '秒');
  const by = {}; rows.forEach(r => { const k = r['枠'] + r['周']; (by[k] = by[k] || {})[r['腕']] = r['配牌'] + '@' + r['席']; });
  const ks = Object.keys(by), same = ks.filter(k => { const v = Object.keys(by[k]).map(a => by[k][a]); return v.every(x => x === v[0]); }).length;
  console.log('同じ山の確かめ：全腕で配牌と席が同じだった枠×周 ' + same + '／' + ks.length);
  summarizeFile(f);
  fs.rmSync(dir, { recursive: true, force: true });
} else {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  if (!fs.existsSync(path.join(ROOT, 'node_modules', '@kobalab'))) { execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' }); }
  console.log('四枚の相手あり測りを ' + NWORK + '本並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止まる）');
  const t0 = Date.now(), files = [], runs = [];
  for (let k = 0; k < NWORK; k++) {
    const f = path.join(os.tmpdir(), 'kan4-part-' + k + '.tsv');
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
    console.log('');
    console.log('終了コード ' + JSON.stringify(codes) + '／' + Math.round((Date.now() - t0) / 1000) + '秒／' + body.length + '行');
    const OUT = path.join(ROOT, 'reports', 'cloud-kan4-aite-' + stamp + '.tsv');
    fs.writeFileSync(OUT, '# 雲で回した同じ牌四枚の相手あり測り（' + stamp + ' UTC・kan/nokan/base の腕・同じ山）。\n' + HEAD.join('\t') + '\n' + body.join('\n') + '\n');
    console.log('記録 … reports/' + path.basename(OUT));
    summarizeFile(OUT);
  });
}
