// 雲で：審判の重み（②の形）を、席を外した版の上で測り直す（棚 #6・11-14 の続き）。
//   ＊今の本体（席を外した v1471 以降の analyze()）で core-battle.js を回して作り直した4000手ほどの記録に、
//     本体から字面で読み出した審判の票（tenLeans ほか）を当て、reports/y1114-0431.md の③と同じ手順で重みを出す。
//       偶数局＝重みを決める用／奇数局＝確かめる用。的中＝その局で点が増えた手は攻め・減った手は守りが正解（増減0は数えない）。
//       重み＝精度（的中率の対数オッズが地の値をどれだけ上回るか・下回れば0）× 重なりの割引（1÷(1＋他の審判との一致の度合い×共に口を開いた割合の和)）
//       一致の度合い κ＝二人とも口を開いた手の同じ側の割合から偶然の一致を引いた値（0〜1）。
//     決め直しの式は本体の revoteVerdict と同じ（際どい手と良形があと1つ足りない手・国士役満の芽は外す・得点＝攻めの重み和−守りの重み和＋同じ側に揃った二人ごとの（1−κ）×相乗平均）。
//   ＊出すのは表だけ。本体（koushu-handan.html）の重みは変えない（差し替えは人のヨシが要る別の段）。
//   ＊読むもの：koushu-handan.html（字面のみ）・core-probe.js・core-battle.js（本体の判定を呼ぶ台）・node_modules（雲では npm ci）。
//   ＊時間：雲は一本 1100秒で自分から止める×4本並列（npm ci と集計を足して 1500秒の上限に収める）。記録は reports/cloud-shinpan-omomi-rec-<刻>.tsv。
//   使い方：node scratchpad/jobs/shinpan-omomi.js                 … 雲（4本並列）
//           node scratchpad/jobs/shinpan-omomi.js --local 1       … 手元の極小の試し（一局だけ回して集計の道を通す・記録は一時の所に書いて消す）
//           node scratchpad/jobs/shinpan-omomi.js --tsv <記録>    … 回さず、既存の記録（例 reports/cloud-core-battle-1000-20261113-191605.tsv）だけを集計し直す（手順の再現の確かめ）
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const BODY = path.join(ROOT, 'koushu-handan.html');
const NWORK = 4, WORK_MS = 1100 * 1000;
const MIN_N = 20;   /* 票の数がこれに満たない側の精度は0とみなす／一致の度合いは共に口を開いた手がこれに満たなければ0 */
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);

/* ---------- 本体から字面で読み出す（写しを持たない） ---------- */
function readBlock(lines, head, open, close) {
  const i = lines.findIndex(l => l.startsWith(head));
  if (i < 0) { throw new Error('本体に見つからない: ' + head.trim()); }
  let depth = 0, started = false; const out = [];
  for (let j = i; j < lines.length; j++) {
    out.push(lines[j]);
    for (const ch of lines[j]) { if (ch === open) { depth++; started = true; } else if (ch === close) { depth--; } }
    if (started && depth <= 0) { break; }
  }
  return out.join('\n');
}
function loadJudges() {
  const lines = fs.readFileSync(BODY, 'utf8').split(/\r?\n/);
  const src = ['  function usagiLean(', '  function tenLeans(', '  function edaVoteLean(', '  function countIsolatedRealTiles(']
    .map(h => readBlock(lines, h, '{', '}')).join('\n');
  const W = readBlock(lines, '  const REVOTE_W = ', '{', '}'), K = readBlock(lines, '  const REVOTE_K = ', '{', '}');
  const f = new Function('localStorage', 'var hand=null;\n' + src + '\n' + W + '\n' + K +
    '\nreturn { setHand:function(h){hand=h;}, tenLeans:tenLeans, countIso:countIsolatedRealTiles, W:REVOTE_W, K:REVOTE_K };');
  return f({ getItem: function () { return null; } });
}

/* ---------- 記録の読み書き ---------- */
function readRows(file) {
  const ls = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#');
  if (!ls.length) { return []; }
  const head = ls[0].split('\t'); const out = [];
  ls.slice(1).forEach(l => { const c = l.split('\t'); if (c.length < head.length - 8) { return; } const o = {}; head.forEach((h, i) => { o[h] = c[i]; }); out.push(o); });
  return out;
}

/* ---------- 集計 ---------- */
const logit = p => { p = Math.min(1 - 1e-3, Math.max(1e-3, p)); return Math.log(p / (1 - p)); };
const f3 = x => (Math.round(x * 1000) / 1000).toFixed(3);
const pct = x => (x * 100).toFixed(1) + '%';
const sgn = x => (x >= 0 ? '+' : '') + Math.round(x);

function judgeAll(rows, J) {
  const { makeAnalyze, parseHand } = require(path.join(ROOT, 'core-probe.js'));
  const analyze = makeAnalyze(BODY);
  const out = []; let mismatch = 0, failed = 0;
  rows.forEach(r => {
    const pts = Number(r['点棒']); if (!isFinite(pts) || r['点棒'] === '') { return; }
    const tiles = parseHand(r['配牌']);
    let a; try { a = analyze(tiles, 'E', 'E', 0); } catch (e) { failed++; return; }
    if (!a || a.tooMany) { return; }
    if (a.verdict !== r['verdict']) { mismatch++; }
    const catN = tiles.filter(t => t.suit === 'cat').length + J.countIso(tiles.filter(t => t.suit !== 'cat'));
    J.setHand(tiles);
    const v = {};
    J.tenLeans(a, catN).forEach(x => { if (J.W[x.key]) { v[x.key] = x.lean || ''; } });
    const half = (Number(r['局']) % 2 === 0) ? 'fit' : 'chk';
    out.push({ half: half, pts: pts, a: a, v: v });
  });
  return { rows: out, mismatch: mismatch, failed: failed };
}

function measure(rowsFit, keys) {
  const nz = rowsFit.filter(x => x.pts !== 0);
  const baseA = nz.length ? nz.filter(x => x.pts > 0).length / nz.length : 0.5;
  const W = {}, info = {};
  keys.forEach(k => {
    W[k] = { a: 0, d: 0 }; info[k] = { open: 0, na: 0, nd: 0, accA: NaN, accD: NaN, wAccA: 0, wAccD: 0 };
    const o = info[k];
    nz.forEach(x => { const l = x.v[k]; if (!l) { return; } o.open++; if (l === 'a') { o.na++; if (x.pts > 0) { o.hitA = (o.hitA || 0) + 1; } } else { o.nd++; if (x.pts < 0) { o.hitD = (o.hitD || 0) + 1; } } });
    if (o.na >= MIN_N) { o.accA = (o.hitA || 0) / o.na; o.wAccA = Math.max(0, logit(o.accA) - logit(baseA)); }
    if (o.nd >= MIN_N) { o.accD = (o.hitD || 0) / o.nd; o.wAccD = Math.max(0, logit(o.accD) - logit(1 - baseA)); }
  });
  /* κ：全部の手（点0も含む）で二人とも口を開いた手の一致 */
  const K = {}; keys.forEach(i => { K[i] = {}; });
  const ovl = {}; keys.forEach(i => { ovl[i] = 0; });
  const openAll = {}; keys.forEach(k => { openAll[k] = rowsFit.filter(x => x.v[k]).length; });
  for (let x = 0; x < keys.length; x++) {
    for (let y = x + 1; y < keys.length; y++) {
      const i = keys[x], j = keys[y]; let n = 0, ag = 0, ai = 0, aj = 0;
      rowsFit.forEach(r => { const li = r.v[i], lj = r.v[j]; if (li && lj) { n++; if (li === lj) { ag++; } if (li === 'a') { ai++; } if (lj === 'a') { aj++; } } });
      let kap = 0;
      if (n >= MIN_N) { const po = ag / n, pi = ai / n, pj = aj / n, pe = pi * pj + (1 - pi) * (1 - pj); kap = pe >= 1 ? 1 : Math.max(0, Math.min(1, (po - pe) / (1 - pe))); }
      K[i][j] = kap; K[j][i] = kap;
      if (openAll[i]) { ovl[i] += kap * n / openAll[i]; }
      if (openAll[j]) { ovl[j] += kap * n / openAll[j]; }
    }
  }
  keys.forEach(k => { const disc = 1 / (1 + ovl[k]); info[k].ovl = ovl[k]; info[k].disc = disc; W[k] = { a: info[k].wAccA * disc, d: info[k].wAccD * disc }; });
  return { W: W, K: K, info: info, baseA: baseA, nz: nz.length };
}

function applyForm(r, W, K) {
  const a = r.a;
  if (a.kokushiSeen || a.yakumanReach) { return null; }
  if (!(a.borderline || a.goodShapes - a.shapeNeeded === -1)) { return null; }
  const J = Object.keys(W); let s = 0;
  J.forEach(j => { if (r.v[j] === 'a') { s += W[j].a; } else if (r.v[j] === 'd') { s -= W[j].d; } });
  for (let x = 0; x < J.length; x++) {
    for (let y = x + 1; y < J.length; y++) {
      const i = J[x], j = J[y]; if (!r.v[i] || r.v[i] !== r.v[j]) { continue; }
      const side = r.v[i], b = (1 - K[i][j]) * Math.sqrt(W[i][side] * W[j][side]); s += side === 'a' ? b : -b;
    }
  }
  return s > 0 ? 'attack' : (s < 0 ? 'defend' : a.verdict);
}

function evalForm(rows, W, K) {
  const res = { fit: { mv: 0, sum: 0 }, chk: { mv: 0, sum: 0 }, n: 0, atk: 0, atkPts: 0, defPts: 0, atkWin: 0, defWin: 0, d2a: 0, a2d: 0 };
  rows.forEach(r => {
    let vd = r.a.verdict;
    if (W) { const t = applyForm(r, W, K); if (t && t !== r.a.verdict) { vd = t; if (t === 'attack') { res[r.half].mv++; res[r.half].sum += r.pts; res.d2a++; } else { res.a2d++; } } }
    res.n++; if (vd === 'attack') { res.atk++; res.atkPts += r.pts; } else { res.defPts += r.pts; }
  });
  return res;
}
function formRow(label, e) {
  const nd = e.n - e.atk, mv = e.fit.mv + e.chk.mv;
  const avg = (s, c) => c ? sgn(s / c) : '—';
  return '| ' + label + ' | ' + e.d2a + '／' + e.a2d + ' | ' + (mv ? sgn((e.fit.sum + e.chk.sum) / mv) + '（' + avg(e.fit.sum, e.fit.mv) + '／' + avg(e.chk.sum, e.chk.mv) + '）' : '—') +
    ' | ' + pct(e.atk / Math.max(1, e.n)) + ' | ' + avg(e.atkPts, e.atk) + ' | ' + avg(e.defPts, nd) + ' |';
}

function report(recFile, tag) {
  const J = loadJudges(); const keys = Object.keys(J.W);
  const rows = readRows(recFile);
  console.log('記録 … ' + tag + '（' + rows.length + '行・局数 ' + new Set(rows.map(r => r['局'])).size + '）');
  const j = judgeAll(rows, J);
  console.log('当て直した手 ' + j.rows.length + '（analyze が落ちた ' + j.failed + '／記録の判定と合わなかった ' + j.mismatch + '）＝今の本体で作った記録なら合わない手は0のはず');
  console.log('');
  const fit = j.rows.filter(r => r.half === 'fit');
  const m = measure(fit, keys);
  console.log('決める用（偶数局）' + fit.length + '手のうち点が動いた ' + m.nz + '手。地の値：攻めが正解 ' + pct(m.baseA) + '・守りが正解 ' + pct(1 - m.baseA));
  console.log('');
  console.log('### 測り直した重み（攻め／守り）と、いま本体に入っている重み');
  console.log('');
  console.log('| 審判 | 口を開いた割合 | 攻めの的中 | 守りの的中 | 重なりの割引 | 測り直し 攻め／守り | 本体の今 攻め／守り |');
  console.log('|---|---|---|---|---|---|---|');
  keys.forEach(k => {
    const o = m.info[k];
    console.log('| ' + k + ' | ' + pct(o.open / Math.max(1, fit.length)) + ' | ' + (isNaN(o.accA) ? '—' : pct(o.accA) + '（' + o.na + '）') + ' | ' + (isNaN(o.accD) ? '—' : pct(o.accD) + '（' + o.nd + '）') +
      ' | ×' + o.disc.toFixed(2) + ' | ' + f3(m.W[k].a) + '／' + f3(m.W[k].d) + ' | ' + f3(J.W[k].a) + '／' + f3(J.W[k].d) + ' |');
  });
  console.log('');
  console.log('### 決め直しの結果（本体の式のまま。重みだけ入れ替えた比べ。決める用・確かめる用は偶数局・奇数局）');
  console.log('');
  console.log('| 形 | 守り→攻め／攻め→守り（手） | 守り→攻めの平均点（決める用／確かめる用） | 攻めの割合 | 攻めの平均点 | 守りの平均点 |');
  console.log('|---|---|---|---|---|---|');
  console.log(formRow('今の版（決め直さない）', evalForm(j.rows, null, null)));
  console.log(formRow('本体の今の重み', evalForm(j.rows, J.W, J.K)));
  console.log(formRow('測り直した重み', evalForm(j.rows, m.W, m.K)));
  console.log('');
  console.log('＊測り直した重みは「決める用」の手で出した値を、決める用・確かめる用の両方に当てている。「確かめる用」の列だけが外の標本の値。');
  console.log('＊記録が本体の今の重みを出した記録（v1471・1000局）と別物なら、重みの数字は一致しない（局がでたらめに配られるため）。手順の再現の確かめは --tsv で既存の記録を渡す。');
}

/* ---------- 回し方 ---------- */
function runBattle(n, file, limitMs) {
  return new Promise(res => {
    const p = spawn(process.execPath, [path.join(ROOT, 'core-battle.js'), String(n), file], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
    const timer = limitMs ? setTimeout(() => { try { p.kill('SIGKILL'); } catch (e) { } }, limitMs) : null;
    p.on('exit', code => { if (timer) { clearTimeout(timer); } res(code); });
  });
}
function merge(files, out) {
  let header = null; const body = [];
  files.forEach((f, k) => {
    if (!fs.existsSync(f)) { return; }
    const ls = fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#');
    if (!ls.length) { return; }
    if (!header) { header = ls[0]; }
    const hc = ls[0].split('\t'), ik = hc.indexOf('局');
    ls.slice(1).forEach(l => { const c = l.split('\t'); if (c.length !== hc.length) { return; } c[ik] = String(k * 1000 + Number(c[ik])); body.push(c.join('\t')); });
    fs.unlinkSync(f);
  });
  if (!header) { return false; }
  fs.writeFileSync(out, header + '\n' + body.join('\n') + '\n'); return true;
}

const argv = process.argv.slice(2);
if (argv[0] === '--tsv') {
  report(path.resolve(argv[1]), path.basename(argv[1]));
} else if (argv[0] === '--local') {
  const n = Math.max(1, Math.min(3, Number(argv[1]) || 1));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-shinpan-'));
  const f = path.join(dir, 'part0.tsv'), out = path.join(dir, 'rec.tsv');
  console.log('手元の極小の試し：' + n + '局だけ回して集計の道を通す（重みの数字に意味は無い）');
  runBattle(n, f, 150 * 1000).then(code => {
    if (!merge([f], out)) { console.log('記録が書けなかった（終了コード ' + code + '）'); process.exit(1); }
    report(out, '一時の記録');
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('\nOK --local');
  });
} else {
  console.log('依存を入れる（npm ci）…');
  execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit' });
  console.log('core-battle を ' + NWORK + '本並べて回す（一本 ' + WORK_MS / 1000 + '秒で自分から止める・今の本体の判定）');
  const t0 = Date.now(); const files = [];
  const runs = [];
  for (let k = 0; k < NWORK; k++) { const f = path.join(ROOT, 'reports', '.shinpan-part-' + k + '.tsv'); files.push(f); runs.push(runBattle(100000, f, WORK_MS)); }
  Promise.all(runs).then(codes => {
    const out = path.join(ROOT, 'reports', 'cloud-shinpan-omomi-rec-' + stamp + '.tsv');
    console.log('終了コード ' + JSON.stringify(codes) + '／' + Math.round((Date.now() - t0) / 1000) + '秒');
    if (!merge(files, out)) { console.log('記録が一行も書けなかった'); process.exit(1); }
    console.log('');
    report(out, 'reports/' + path.basename(out));
  });
}
