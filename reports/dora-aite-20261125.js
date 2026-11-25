// 雲で：ドラの枚数ごとに「守りの手でも押してよいか」の相手あり測り・橋の枠 三百十（棚 #29）。reports/tanyao-sanshoku-sangen-aite-20261124.js の型の写し。
//   ＊majiang-core の一局戦。子の一席（1〜3をでたらめ）に作り配牌を積み、その席だけ腕を替える。他三席は @kobalab/majiang-ai のまま。
//   ＊同じ作り配牌・同じ山を、その席の腕だけ替えて打つ（同じ枠・同じ周・同じ本なら全腕で同じ山・同じ席）。
//   ＊本体（koushu-handan.html）・核・analyze() には触らない。この台本は reports/ に置く（scratchpad/jobs に置くと雲の自動走りが起きるため）。
//   ＊守りの手の作り方（近似）：配牌13枚のうち、字牌＋端牌（19）がちょうど 4 枚（判定の「字牌＋端牌が2枚以上＝守り（羊）」を満たす側）。残り9枚は 2〜8 の数牌。
//     判定そのもの（analyze）は呼ばない。ここでの「守りの手」は、この近似で作った手。
//   ＊ドラ：ドラ牌の数 D（2〜8の数牌をでたらめ）を決め、表示牌（D−1）を山の決まった所に置く。配牌の数牌 9 枚の中に D の牌を m 枚（m＝0〜4・枠 d0〜d4）入れる。
//     赤五（赤5×3・雀魂の決まり）は残りの牌の中に自然に混ざる。記録の「ドラ数」＝配牌13枚の中の（ドラ牌の枚数＋赤五の枚数）。集計はこの実際の数で分ける。裏ドラあり（山に置く）。
//   ＊腕：push＝押す（鳴かない決めは無し：向聴が進む鳴きは鳴く・聴牌したら立直・捨ては 向聴→ドラと赤を残す→残りの多い牌 の順・他家のリーチを見ても降りない）
//         fold＝守る（鳴かない・槓しない・リーチしない・他家のリーチが入ったら一番危険の低い牌を切る・入るまでは元の機械打ちと同じ捨て方）
//         base＝機械の普通打ち（majiang-ai そのまま）
//   使い方：node reports/dora-aite-20261125.js   … 雲（4本並列・WORK_S 秒で自分から止まる・既定 1230）
//           node reports/dora-aite-20261125.js --local 1   … 手元の極小の試し（各枠一周）
//           node reports/dora-aite-20261125.js --summarize <tsv>   … 記録の集計（markdown の表）
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
const WORK_MS = Number(process.env.WORK_S || 1230) * 1000, KILL_MS = WORK_MS + 90000, NWORK = 4;
const HEAD = ['本', '周', '枠', '腕', '席', '配牌', 'ドラ数', '結果', '点棒', '和了型', '放銃先リーチ', '受リーチ', '巡目', '打数', '件'];
const ARMS = ['push', 'fold', 'base'];
const FRAMES = [0, 1, 2, 3, 4].map(m => ({ id: 'd' + m, m: m }));
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
    const D = 2 + Math.floor(rnd() * 7), suit = ['m', 'p', 's'][Math.floor(rnd() * 3)];
    const isD = p => p[0] === suit && numOf(p) === D;
    for (let i = 0; i < frame.m; i++) { hand.push(takeIf(isD)); }
    for (let i = 0; i < 4; i++) { hand.push(takeIf(isYao)); }
    const rest = () => pool.filter(p => !isYao(p) && !isD(p));
    for (let i = 0; hand.length < 13; i++) { const op = rest(); const p = op[0]; pool.splice(pool.indexOf(p), 1); hand.push(p); }
    const ind = takeIf(p => p[0] === suit && numOf(p) === D - 1);
    shuffle(pool, rnd);
    const order = [];
    for (let l = 0; l < 4; l++) {
      if (l === t) { hand.forEach(h => order.push(h)); } else { for (let i = 0; i < 13; i++) { order.push(pool.pop()); } }
    }
    pool.splice(4, 0, ind);
    shan._pai = pool.slice().concat(order.slice().reverse());
    shan._baopai = [shan._pai[4]];
    shan._fubaopai = rule['裏ドラあり'] ? [shan._pai[9]] : null;
    const doraN = hand.filter(isD).length + hand.filter(p => p[1] === '0').length;
    return { shan: shan, hand: hand, doraN: doraN };
  }

  class DoraAI extends AI {
    constructor(ctx) { super(); this._ctx = ctx; this._on = false; }
    qipai(qipai) { super.qipai(qipai); this._on = (this._ctx.arm !== 'base') && this._ctx.t === this._menfeng; }
    _riichiRival() { const L = this._suanpai._lizhi || []; for (let l = 0; l < 4; l++) { if (l !== this._menfeng && L[l]) { return true; } } return false; }
    select_gang(info) { return this._on ? undefined : super.select_gang(info); }
    select_pingju() { return this._on ? false : super.select_pingju(); }
    select_lizhi(p) { if (this._on && this._ctx.arm === 'fold') { return false; } return super.select_lizhi(p); }
    select_fulou(dapai, info) {
      if (!this._on) { return super.select_fulou(dapai, info); }
      if (this._ctx.arm === 'fold') { return undefined; }
      const d = ['', '+', '=', '-'][(4 + this._model.lunban - this._menfeng) % 4];
      const p = dapai.p.slice(0, 2) + d;
      const sp0 = this.shoupai;
      const ms = (this.get_peng_mianzi(sp0, p) || []).concat(this.get_chi_mianzi(sp0, p) || []);
      const xt = Majiang.Util.xiangting(sp0);
      let best = null, bx = xt;
      ms.forEach(m => { const x = Majiang.Util.xiangting(sp0.clone().fulou(m)); if (x < bx) { bx = x; best = m; } });
      return best || undefined;
    }
    _isDora(p) {
      if (p[1] === '0') { return true; }
      const bp = (this._suanpai._baopai || []);
      return bp.some(b => Majiang.Shan.zhenbaopai(b).slice(0, 2).replace('0', '5') === p.slice(0, 2).replace('0', '5'));
    }
    select_dapai(info) {
      if (!this._on) { return super.select_dapai(info); }
      const c = this._ctx, sp = this.shoupai, list = this.get_dapai(sp);
      if (c.arm === 'fold') {
        if (!this._riichiRival()) { return super.select_dapai(info); }
        const wx = this._suanpai.suan_weixian_all(sp._bingpai);
        let best = null, bk = null;
        list.forEach(p => {
          const k = [wx[p.slice(0, 2).replace('0', '5')] === undefined ? 0 : wx[p.slice(0, 2).replace('0', '5')], Majiang.Util.xiangting(sp.clone().dapai(p))];
          if (!bk || k[0] < bk[0] || (k[0] === bk[0] && k[1] < bk[1])) { bk = k; best = p; }
        });
        return best || super.select_dapai(info);
      }
      let best = null, bk = null;
      list.forEach(p => {
        const s = p[0], n = numOf(p), u = this._suanpai._paishu[s][n];
        const key = [Majiang.Util.xiangting(sp.clone().dapai(p)), this._isDora(p) ? 1 : 0, u];
        let cmp = 0;
        if (bk) { for (let i = 0; i < key.length && !cmp; i++) { cmp = key[i] - bk[i]; } }
        if (!bk || cmp < 0) { bk = key; best = p; }
      });
      if (best && sp.menqian && Majiang.Util.xiangting(sp.clone().dapai(best)) === 0 && super.select_lizhi(best)) { return best + '*'; }
      return best || super.select_dapai(info);
    }
  }

  function playOne(part, j, frame, arm, seed) {
    const rnd = mulberry32(seed);
    const t = 1 + Math.floor(rnd() * 3);
    const built = buildShan(frame, t, rnd);
    const ctx = { t: t, arm: arm };
    class G extends Majiang.Game { qipai(shan) { if (this._aiteUsed) { return super.qipai(); } this._aiteUsed = true; return super.qipai(built.shan); } }
    let paipu = null;
    const players = [0, 1, 2, 3].map(() => new DoraAI(ctx));
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
    let res = '無関係', type = '', toR = '', pts = 0;
    if (hules.length) {
      const won = hules.filter(h => h.l === t), dealt = hules.filter(h => typeof h.baojia === 'number' && h.baojia === t);
      if (won.length) { res = '和了'; type = (typeof won[0].baojia === 'number') ? 'ロン' : 'ツモ'; }
      else if (dealt.length) { res = '放銃'; toR = dealt.some(h => riichi[h.l]) ? 1 : 0; }
      else if (hules.some(h => typeof h.baojia !== 'number')) { res = '被ツモ'; }
      hules.forEach(h => { pts += (h.fenpei && h.fenpei[t]) || 0; });
    } else if (pingju) { res = '流局'; pts = (pingju.fenpei && pingju.fenpei[t]) || 0; }
    let ro = 0; for (let l = 0; l < 4; l++) { if (l !== t && riichi[l]) { ro = 1; } }
    return [part, j, frame.id, arm, t, built.hand.join(''), built.doraN, res, pts, type, toR, ro, Math.ceil(z / 4), nd, 'dora'];
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
  P(''); P('## ドラの枚数ごと（配牌13枚のドラ牌＋赤五の数）：' + title); P('');
  const keys = Array.from(new Set(rows.map(r => r['ドラ数']))).sort((a, b) => a - b);
  P('| ドラ数 | 腕 | 局 | 和了 | 放銃 | 被ツモ | 流局 | 平均点棒 | 立直が入った局 |'); P('|---|---|---|---|---|---|---|---|---|');
  keys.forEach(k => ARMS.forEach(a => {
    const xs = rows.filter(r => r['ドラ数'] === k && r['腕'] === a), n = xs.length, cnt = v => xs.filter(r => r['結果'] === v).length;
    P('| ' + k + ' | ' + a + ' | ' + n + ' | ' + pc(cnt('和了'), n) + ' | ' + pc(cnt('放銃'), n) + ' | ' + pc(cnt('被ツモ'), n) + ' | ' + pc(cnt('流局'), n) + ' | ' + mean(xs.map(r => num(r['点棒']))).toFixed(0) + ' | ' + pc(xs.filter(r => r['受リーチ'] === '1').length, n) + ' |');
  }));
  [['push', 'fold'], ['push', 'base'], ['fold', 'base']].forEach(pr => {
    P(''); P('### 同じ山どうしの差（' + pr[0] + ' − ' + pr[1] + '・同じ枠・同じ周・同じ本）'); P('');
    P('| ドラ数 | 組 | 和了率の差 | 点棒の差（平均±標準誤差×1.96） | 放銃率の差 |'); P('|---|---|---|---|---|');
    keys.forEach(k => {
      const idx = {};
      rows.filter(r => r['ドラ数'] === k).forEach(r => { const q = r['本'] + '-' + r['周'] + '-' + r['枠']; (idx[q] = idx[q] || {})[r['腕']] = r; });
      const pairs = Object.keys(idx).map(q => idx[q]).filter(o => o[pr[0]] && o[pr[1]]);
      const W = r => r['結果'] === '和了' ? 1 : 0, Dd = r => r['結果'] === '放銃' ? 1 : 0;
      const dw = pairs.map(o => W(o[pr[0]]) - W(o[pr[1]])), dp = pairs.map(o => num(o[pr[0]]['点棒']) - num(o[pr[1]]['点棒'])), dd = pairs.map(o => Dd(o[pr[0]]) - Dd(o[pr[1]]));
      P('| ' + k + ' | ' + pairs.length + ' | ' + (mean(dw) * 100).toFixed(1) + 'pt ±' + (196 * se(dw)).toFixed(1) + ' | ' + mean(dp).toFixed(0) + ' ±' + (1.96 * se(dp)).toFixed(0) + ' | ' + (mean(dd) * 100).toFixed(1) + 'pt ±' + (196 * se(dd)).toFixed(1) + ' |');
    });
  });
  P(''); P('＊読み方の注意：守りの手は「字牌＋端牌がちょうど4枚」の近似で作った手。配牌の途中のドラ数は実際の数で分けている。腕の席以外は機械打ち。差は同じ山どうしの欄で読む。');
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
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-dora-'));
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
  console.log('ドラの相手あり測りを ' + NWORK + '本並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止まる）');
  const t0 = Date.now(), files = [], runs = [];
  for (let k = 0; k < NWORK; k++) {
    const f = path.join(os.tmpdir(), 'dora-part-' + k + '.tsv');
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
    const OUT = path.join(ROOT, 'reports', 'cloud-dora-aite-' + stamp + '.tsv');
    fs.writeFileSync(OUT, '# 雲で回したドラの相手あり測り（' + stamp + ' UTC・push/fold/base の腕・同じ山）。\n' + HEAD.join('\t') + '\n' + body.join('\n') + '\n');
    console.log('記録 … reports/' + path.basename(OUT));
    summarizeFile(OUT);
  });
}
