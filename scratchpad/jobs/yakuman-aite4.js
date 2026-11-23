// 雲で：国士9〜11種の「九種九牌を必ず流す」腕（棚 #8・枠 百八十九）。yakuman-aite.js の写し。腕 flush＝最初のツモで九種九牌が宣言できれば必ず流す（0点）／push＝流さず狙い切る（九種九牌なし・他は従来どおり）／base＝機械の普通打ち（機械が自分で九種九牌を流すこともある＝その割合を『九種流し』の列で数える）。
//   ＊枠は国士の k9・k10・k11（同じ作り配牌・同じ山を三腕で打つ）。記録は reports/cloud-yakuman-aite4-<刻>.tsv。
//   ＊majiang-core の一局戦。子の一席（1〜3をでたらめ）に作り配牌（国士の么九の種類・四暗刻の暗刻と対子）を積み、その席だけ「役満を狙う打ち手」。他三席は @kobalab/majiang-ai のまま。
//   ＊腕（同じ作り配牌・同じ山を、その席の打ち手だけ替えて打つ）：push＝狙い切る／fold＝狙うが、他家の立直を受けて二向聴以上なら降りる（現物・安い格から）／base＝元の機械打ち（基準）。
//   ＊狙う席：鳴かない・槓しない・立直しない（ダマ）・九種九牌で流さない。和了の形になれば上がる（ツモもロンも・役満以外でも）。base は元のまま（九種九牌も流す）。
//   ＊山は自分で並べる（種つき・同じ枠・同じ周なら三腕で同じ山）。_baopai／_fubaopai は並べ替えの後で取り直す。
//   ＊本体（koushu-handan.html）・核には触らない。記録は reports/cloud-yakuman-aite-<刻>.tsv。走るたびに前の記録も足した通しの表を出す。
//   使い方：node scratchpad/jobs/yakuman-aite.js            … 雲（npm ci→4本並列・一本 1230秒で自分から止まる）
//           node scratchpad/jobs/yakuman-aite.js --local 2  … 手元の極小の試し（一枠×三腕を2周・記録は一時の所に書いて消す）
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const WORK_MS = 1230 * 1000, KILL_MS = 1320 * 1000, NWORK = 4;
const STAGE = process.env.AITE_STAGE === '2' ? '2' : '1';   /* 一段目／二段目（yakuman-aite2.js が AITE_STAGE=2 を立てて読み込む） */
const NAME = 'cloud-yakuman-aite4-';
const ARMS = ['push', 'flush', 'base'];
const armsOf = f => ARMS;
const FRAMES = [{ id: 'k9', kind: 'k', k: 9 }, { id: 'k10', kind: 'k', k: 10 }, { id: 'k11', kind: 'k', k: 11 }];
const HEAD = ['本', '周', '枠', '腕', '席', '配牌', '結果', '役満', '和了型', '役名', '放銃先リーチ', '受リーチ', '点棒', '巡目', '打数'];
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const YAO = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7'];
const ALL = []; ['m', 'p', 's'].forEach(s => { for (let n = 1; n <= 9; n++) { ALL.push(s + n); } }); for (let n = 1; n <= 7; n++) { ALL.push('z' + n); }
function shuffle(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
const kk = p => p[0] + (+p[1] || 5);   /* 赤5(0)は5として数える */

/* ---------- 格（危険度）：core-battle-fold2.js と同じ決め ---------- */
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
function riichiSeats(sp, me) { const out = []; for (let l = 0; l < 4; l++) { if (l !== me && sp._lizhi[l]) { out.push(l); } } return out; }

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
    if (frame.kind === 'k') {
      const ys = shuffle(YAO.slice(), rnd).slice(0, frame.k);
      ys.forEach(y => hand.push(take(y)));
      const non = shuffle(pool.filter(p => YAO.indexOf(kk(p)) < 0), rnd);
      for (let i = 0; hand.length < 13; i++) { hand.push(take(non[i])); }
    } else {
      const ts = shuffle(ALL.slice(), rnd);
      let q = 0;
      for (let i = 0; i < frame.kt; i++) { const ty = ts[q++]; for (let c = 0; c < 3; c++) { hand.push(take(ty)); } }
      for (let i = 0; i < frame.p; i++) { const ty = ts[q++]; for (let c = 0; c < 2; c++) { hand.push(take(ty)); } }
      while (hand.length < 13) { hand.push(take(ts[q++])); }
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

  class YakuAI extends AI {
    constructor(ctx) { super(); this._ctx = ctx; this._yaku = false; }
    qipai(qipai) {
      super.qipai(qipai);
      this._yaku = (this._ctx.arm !== 'base') && this._ctx.t === this._menfeng;
    }
    select_fulou(dapai, info) { return this._yaku ? undefined : super.select_fulou(dapai, info); }
    select_gang(info) { return this._yaku ? undefined : super.select_gang(info); }
    select_pingju() { if (!this._yaku) { return super.select_pingju(); } return this._ctx.arm === 'flush' ? this.allow_pingju(this.shoupai) : false; }   /* flush＝九種九牌が宣言できる時は必ず流す */
    select_hule(data, hupai, info) {
      /* norn：ロンを見送る（ツモ＝data が無い時は上がる）。暗刻が4つ（単騎待ち）の時だけロンも上がる */
      if (this._yaku && this._ctx.arm === 'norn' && data) {
        const b = this.shoupai._bingpai; let t = 0;
        ['m', 'p', 's', 'z'].forEach(k => { for (let n = 1; n <= (k === 'z' ? 7 : 9); n++) { if (b[k][n] >= 3) { t++; } } });
        if (t < 4) { return false; }
      }
      return super.select_hule(data, hupai, info);
    }
    select_dapai(info) {
      if (!this._yaku) { return super.select_dapai(info); }
      const sp = this._suanpai, me = this._menfeng, lz = riichiSeats(sp, me);
      const list = this.get_dapai(this.shoupai);
      if (this._ctx.arm === 'fold' && lz.length && Majiang.Util.xiangting(this.shoupai) >= 2) {
        let best = null, bk = null;
        list.forEach(p => {
          const s = p[0], n = +p[1] || 5;
          let mx = 0, sum = 0; lz.forEach(l => { const r = rankVs(sp, l, s, n); if (r > mx) { mx = r; } sum += r; });
          const key = [mx, sum];
          if (!bk || key[0] < bk[0] || (key[0] === bk[0] && key[1] < bk[1])) { bk = key; best = p; }
        });
        if (best) { return best; }
      }
      return this._ctx.frame.kind === 'k' ? this.kokushiDapai(list) : this.suuankouDapai(list);
    }
    kokushiDapai(list) {
      let best = null, bk = null;
      list.forEach(p => {
        const s = p[0], n = +p[1] || 5, ty = s + n, c = this.shoupai._bingpai[s][n];
        const yao = YAO.indexOf(ty) >= 0;
        const key = !yao ? [0, 0] : (c >= 2 ? [1, -c] : [2, 0]);
        if (!bk || key[0] < bk[0] || (key[0] === bk[0] && key[1] < bk[1])) { bk = key; best = p; }
      });
      return best;
    }
    suuankouDapai(list) {
      let best = null, bk = null;
      list.forEach(p => {
        const s = p[0], n = +p[1] || 5, c = this.shoupai._bingpai[s][n], u = this._suanpai._paishu[s][n];
        const key = c >= 4 ? [0, 0] : c === 1 ? [1, u] : c === 2 ? [2, u] : [3, u];
        if (!bk || key[0] < bk[0] || (key[0] === bk[0] && key[1] < bk[1])) { bk = key; best = p; }
      });
      return best;
    }
  }

  function playOne(part, j, frame, arm, seed) {
    const rnd = mulberry32(seed);
    const t = 1 + Math.floor(rnd() * 3);
    const built = buildShan(frame, t, rnd);
    const ctx = { t: t, arm: arm, frame: frame };
    class G extends Majiang.Game { qipai(shan) { if (this._aiteUsed) { return super.qipai(); } this._aiteUsed = true; return super.qipai(built.shan); } }   /* 流局の連荘で次の局が始まった時は、普通の山（記録は最初の局だけ読む） */
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
      const seed = 100003 * part + 7919 * j + 31 * f + 20261123;
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
function summarize(rows, title) {
  const P = s => console.log(s);
  P(''); P('## ' + title); P('');
  P('| 枠 | 腕 | 局 | 役満和了 | 役満ツモ | 役満ロン | 他の和了 | 放銃 | （立直者へ） | 被ツモ | 流局 | 九種流し | 平均点棒 | 立直が入った局 | 巡目の平均 |');
  P('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  FRAMES.forEach(f => armsOf(f).forEach(a => {
    const xs = rows.filter(r => r['枠'] === f.id && r['腕'] === a), n = xs.length;
    const ym = xs.filter(r => r['結果'] === '和了' && r['役満'] === '1'), ot = xs.filter(r => r['結果'] === '和了' && r['役満'] !== '1');
    const dl = xs.filter(r => r['結果'] === '放銃');
    P('| ' + f.id + ' | ' + a + ' | ' + n + ' | ' + pc(ym.length, n) + ' ' + ci(ym.length, n) + ' | ' + pc(ym.filter(r => r['和了型'] === 'ツモ').length, n) + ' | ' + pc(ym.filter(r => r['和了型'] === 'ロン').length, n)
      + ' | ' + pc(ot.length, n) + ' | ' + pc(dl.length, n) + ' | ' + pc(dl.filter(r => r['放銃先リーチ'] === '1').length, n) + ' | ' + pc(xs.filter(r => r['結果'] === '被ツモ').length, n)
      + ' | ' + pc(xs.filter(r => r['結果'] === '流局').length, n) + ' | ' + pc(xs.filter(r => r['結果'] === '九種流し').length, n) + ' | ' + mean(xs.map(r => num(r['点棒']))).toFixed(0) + ' | ' + pc(xs.filter(r => r['受リーチ'] === '1').length, n) + ' | ' + mean(xs.map(r => num(r['巡目']))).toFixed(1) + ' |');
  }));
  P(''); P('### 同じ山どうしの差（腕 − base・同じ枠・同じ周・同じ本）');
  P(''); P('| 枠 | 腕 | 組 | 役満和了率の差 | 点棒の差（平均±標準誤差×1.96） | 放銃率の差 |'); P('|---|---|---|---|---|---|');
  FRAMES.forEach(f => ['push', 'flush'].filter(a => armsOf(f).indexOf(a) >= 0).forEach(a => {
    const idx = {};
    rows.filter(r => r['枠'] === f.id).forEach(r => { const k = r['本'] + '-' + r['周']; (idx[k] = idx[k] || {})[r['腕']] = r; });
    const pairs = Object.keys(idx).map(k => idx[k]).filter(o => o[a] && o['base']);
    const dy = pairs.map(o => (o[a]['役満'] === '1' && o[a]['結果'] === '和了' ? 1 : 0) - (o['base']['役満'] === '1' && o['base']['結果'] === '和了' ? 1 : 0));
    const dp = pairs.map(o => num(o[a]['点棒']) - num(o['base']['点棒']));
    const dd = pairs.map(o => (o[a]['結果'] === '放銃' ? 1 : 0) - (o['base']['結果'] === '放銃' ? 1 : 0));
    P('| ' + f.id + ' | ' + a + ' | ' + pairs.length + ' | ' + (mean(dy) * 100).toFixed(1) + 'pt ±' + (196 * se(dy)).toFixed(1) + ' | ' + mean(dp).toFixed(0) + ' ±' + (1.96 * se(dp)).toFixed(0) + ' | ' + (mean(dd) * 100).toFixed(1) + 'pt ±' + (196 * se(dd)).toFixed(1) + ' |');
  }));
  P(''); P('＊独り打ち（reports/y1122-2255-yakuman-rate.md）との比べは、その表の 国士10種 9.7%・11種 21.7%／四暗刻 暗刻3対子2 47.5%・暗刻3対子1 20.6%・暗刻2対子3 17.8%（18ツモまで・ツモのみ）。');
  P('＊読み方の注意：機械打ちは聴牌即立直で、国士の河を警戒しない＝ロンで拾える分は人の卓より多めに出る見込み。作り配牌を積むので他家の配牌からその牌が減る。点棒は役満32000点で幅が広い＝差は同じ山どうしの欄で読む。');
}

const argv = process.argv.slice(2);
if (argv[0] === '--worker') {
  work(argv[1], Number(argv[2]), Number(argv[3]), Infinity);
} else if (argv[0] === '--local') {
  const n = Math.max(1, Math.min(5, Number(argv[1]) || 2));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-aite-'));
  const f = path.join(dir, 'part-0.tsv');
  work(f, 150 * 1000, 0, n);
  const rows = readRows(f) || [];
  console.log(HEAD.join('\t'));
  rows.slice(0, 10).forEach(r => console.log(HEAD.map(h => r[h]).join('\t')));
  summarize(rows, '手元の極小の試し（' + n + '周・数は当てにならない）');
  /* 同じ山の確かめ：同じ枠・同じ周の三腕は、配牌が同じ */
  const by = {}; rows.forEach(r => { const k = r['枠'] + r['周']; (by[k] = by[k] || {})[r['腕']] = r['配牌'] + '@' + r['席']; });
  const same = Object.keys(by).filter(k => { const o = by[k]; return o.push && o.flush && o.base && o.push === o.flush && o.flush === o.base; }).length;
  console.log('同じ山の確かめ：三腕とも配牌と席が同じだった枠×周 ' + same + '／' + Object.keys(by).length);
  fs.rmSync(dir, { recursive: true, force: true });
} else {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const OUT = path.join(ROOT, 'reports', NAME + stamp + '.tsv');
  console.log('依存を入れる（npm ci）…');
  execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit', timeout: 180000, killSignal: 'SIGKILL' });
  console.log('相手ありの測り・一段目を ' + NWORK + '本並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止まる）');
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
    fs.writeFileSync(OUT, '# 雲で回した 国士・四暗刻の相手あり測り・一段目（' + stamp + ' UTC・push/fold/base の三腕・同じ山）。\n' + HEAD.join('\t') + '\n' + body.join('\n') + '\n');
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
