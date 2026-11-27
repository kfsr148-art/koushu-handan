#!/usr/bin/env node
/* advice-sample.js — 助言の見本・版ごとの比べ・機械の篩（2026-11-26・枠 三百四十②・三百四十一①②・三百四十二②・本人の決め）。
   公開の版が上がるたび、雲で次を作る（VAIO では回さない＝koushu-state の雲の走り advice-sample.yml が回す）。読むだけで何も直さない。
     ①無作為の配牌 100 局に人格と方言をばらして付け、本体が実際に出す助言の文（adviceFor）を並べた見本 → advice-sample.md
       （枠 三百九十二：この100局は毎回配り直さず、tools/advice-hands.json に保存した同じ局。くじは局ごとの種で固定し、助言の「直前を避ける」覚えは局ごとに初期化する。
         局は版1546の公開見本の無作為100局。同じ版は何度回しても同じ文になる）
     ②決まった 30 局（種つきの乱数で配牌・人格・方言・くじを固定）の文 → advice-sample/<版>-fixed.json。前の版のそれと見比べ、変わった文だけを advice-diff.md に版つきで並べる
     ③見本・決まった30局の文を、機械で篩う（語尾の二文続き・切れ文・配っていない牌の名）。引っかかった文に印と訳を付け、advice-sample.md の頭にまとめる
     ④見本を版ごとに advice-sample/<版>.md にも残す
   ＊本体（koushu-handan.html）には触らない。写しを一時の所に作り、本体の包みの内側（window.shuffleHand の行の後ろ）へ探索用の一片（probe）を差し込んで、
     headless Chrome／Edge ＋ --dump-dom で駆動する（作法14）。結果は base64 の目印つきで DOM に置き、吐かれた HTML から拾う。window に診断口は生やさない。
   使い方  node tools/advice-sample.js <handan の置き場> <出し先のフォルダ（senko）> [局数=100] [--prev <前の版の fixed.json>]
   比べ    node tools/advice-sample.js <handan の置き場> <出し先> --compare <前の版の html> [--now <今の版の html。無ければ置き場の本体>]
           → <出し先>/advice-compare/<前の版>-<今の版>.md（型ごとの件数の増減と、変わった文だけ）。各版は二度回し（二度目は局の順を逆にする）、
             文と件数が一致しなければ終了コード 5。比べの回は見本の綴り（advice-sample.md など）に触らない。
   ＊見本の回も <出し先>/advice-sample/<版>-hands.json を残し、前の版の物があれば同じ100局の比べを advice-diff.md に並べる（件数は両方とも今の篩で数える）。
   ＊篩は文を見る目安で、役の名の食い違い（言っていない役を言う）は今は見ていない。 */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const common = require('./advice-common.js');
const args = process.argv.slice(2);
function opt(name) { const i = args.indexOf(name); if (i < 0) { return ''; } const v = args.splice(i, 2)[1]; if (!v) { console.error(name + ' の値が無い'); process.exit(1); } return v; }
const PREV = opt('--prev'), COMPARE = opt('--compare'), NOW = opt('--now');
const ROOT = path.resolve(args[0] || '.'), OD = path.resolve(args[1] || '.'), N = Number(args[2]) || 100, NF = 30;
const HANDS_ALL = JSON.parse(fs.readFileSync(path.join(__dirname, 'advice-hands.json'), 'utf8'));
if (N > HANDS_ALL.length) { console.error('保存した配牌は ' + HANDS_ALL.length + '局まで'); process.exit(1); }
const HANDS = HANDS_ALL.slice(0, N);
/* reverse：保存した局を逆順で回す（比べの二度目。前の局の覚えが残っていれば食い違いに出る）。resetFixed：決まった30局も局ごとに覚えを初期化する（比べの回だけ） */
const makeProbe = (reverse, resetFixed) => `
/* ---- probe（写しの中だけ・本体の包みの内側へ差し込む。大域に出ていない const/let を読むため） ---- */
${common.FIXED_JS}
window.addEventListener('load', function(){ setTimeout(function(){
  var res = { rows: [], fixed: [], err: null, noMem: [] };
  var HANDS = ${JSON.stringify(HANDS)};
  /* 助言の「直前に選んだ物を避ける」覚えを初期化する。面白みの一言は回数で四回に一回省くので、回数は局の番号にする */
  function khFresh(n){
    ['koushu_adv_last', 'koushu_adv_omo', 'koushu_adv_word'].forEach(function(k){ try { localStorage.removeItem(k); } catch(e){} });
    var miss = [];
    if(typeof _advLastMem !== 'undefined'){ Object.keys(_advLastMem).forEach(function(k){ delete _advLastMem[k]; }); } else { miss.push('_advLastMem'); }
    if(typeof _advOmoMem !== 'undefined'){ _advOmoMem.n = n; _advOmoMem.last = {}; } else { miss.push('_advOmoMem'); }
    if(typeof _advWordMem !== 'undefined'){ _advWordMem.recent = []; } else { miss.push('_advWordMem'); }
    res.noMem = miss;
  }
  function judgeText(){
    var a = analyze();
    var catN = hand.filter(function(t){ return t.suit === 'cat'; }).length;
    var eff = catN + countIsolatedRealTiles(hand.filter(function(t){ return t.suit !== 'cat'; }));
    var rv = revoteVerdict(a, eff);
    if (rv) { a.revote = rv; a.verdict = rv.to; }
    var attack = a.verdict === 'attack';
    var r = null; try { r = adviceFor(a, hand, attack); } catch (e) { r = null; }
    return { attack: attack, text: r ? String(r.text || '') : '', dirs: (a.directions || []).slice() };
  }
  try {
    var dials = [''].concat(Object.keys(ADV_DIALECT));
    /* 決まった30局を先に回す（本体の「直前に選んだ言葉を避ける」記憶が、無作為の百局に左右されず同じ文になるように） */
    for (var k = 0; k < ${NF}; k++) {
      var f = khFixed(k, ADV_TONE_KEYS, dials);
      document.getElementById('qiText').value = tilesToInput(f.tiles);
      rebuildHand();
      currentTone = f.tone; currentDialect = f.dial;
      if (${!!resetFixed}) { khFresh(k); }
      khSeed(k);
      var j2 = judgeText();
      khUnseed();
      res.fixed.push({ n: k + 1, tiles: tilesToInput(hand), tone: currentTone, dial: currentDialect, attack: j2.attack, text: j2.text, dirs: j2.dirs });
    }
    var order = HANDS.map(function(h, i){ return i; });
    if (${!!reverse}) { order.reverse(); }
    order.forEach(function(i){
      var h = HANDS[i];
      document.getElementById('qiText').value = h.tiles;
      rebuildHand();
      currentTone = h.tone; currentDialect = h.dial;
      khFresh(h.n);
      khSeed(100000 + h.n);
      var j = judgeText();
      khUnseed();
      res.rows[i] = { n: h.n, tiles: tilesToInput(hand), tone: currentTone, dial: currentDialect, attack: j.attack, text: j.text, dirs: j.dirs };
    });
  } catch (e) { res.err = String(e && e.message || e); }
  var d = document.createElement('div'); d.id = 'khas';
  d.textContent = 'KHAS_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(res)))) + 'KHAS_END';
  document.body.appendChild(d);
}, 600); });
`;
const browser = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(p => p && fs.existsSync(p))[0];
if (!browser) { console.error('ブラウザが無い'); process.exit(2); }
function drive(html, reverse, resetFixed) {
  const mark = 'window.shuffleHand = shuffleHand;';
  if (html.indexOf(mark) < 0) { console.error('probe の差し込み先が無い'); process.exit(3); }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-advs-'));
  const probe = path.join(tmp, 'probe.html');
  const body = makeProbe(reverse, resetFixed);
  fs.writeFileSync(probe, html.replace(mark, () => mark + body), 'utf8');
  const cargs = ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--window-size=900,700', '--mute-audio', '--user-data-dir=' + path.join(tmp, 'prof'),
    '--virtual-time-budget=120000', '--dump-dom', 'file:///' + probe.replace(/\\/g, '/')];
  const r = cp.spawnSync(browser, cargs, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout: 170000, killSignal: 'SIGKILL' });
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
  const hit = /KHAS_BEGIN([A-Za-z0-9+/=]+)KHAS_END/.exec(String(r.stdout || ''));
  if (!hit) { console.error('結果を取り出せない'); process.exit(3); }
  const res = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8'));
  if (res.err) { console.error('probe の誤り：' + res.err); process.exit(4); }
  if (res.noMem.length) { console.error('注意：初期化する覚えが本体に見つからない：' + res.noMem.join('・')); }
  return res;
}

/* ---- 機械の篩 ---- */
let dupMod = null; try { dupMod = require(path.join(ROOT, 'scratchpad', 'jobs', 'v1522', 'advdup.js')); } catch (e) { }
const SENT = t => String(t || '').split(/(?<=[。！？])/).map(s => s.trim()).filter(Boolean);
/* 牌の名は『持っていると言う』言い方の時だけ見る（面白みの一言の豆知識『東は朝日、發は吉兆』は配牌の話ではないので数えない） */
const CLAIM = '(?=(?:の対子|の暗刻|の刻子|を切|から切|を残|は残|を抱|は抱|が(?:あ|ござ|二枚|三枚|2枚|3枚)))';
const TILE_RE = new RegExp('([一二三四五六七八九][萬筒索]|(?:^|[^一-龥])[東南西北白發発中])' + CLAIM, 'g');
const KIRE_RE = /(?:^|[、。！？ ])(?:されば|ならば|それなら|よって|ゆえに|だから|ですから|だが|しかし|また|さて|つまり)[、,]?$/;
const REP_LABEL = { rep: '語尾の二文続き', frag: '切れ端（述語の無い短い一文）', empty: '中身のない一文', dbl: '語尾の二重', dup: '隣り合う二文に同じ理由の言葉' };
function sift(row) {
  const out = [], names = common.handNames(row.tiles);
  if (!row.text) { out.push({ k: '空', why: '文が空（adviceFor が何も返さなかった）' }); return out; }
  if (dupMod) { try { dupMod.scan(row.text, row.dial, row.tone).forEach(i => { if (REP_LABEL[i.k] && i.k !== 'dup') { out.push({ k: i.k, why: REP_LABEL[i.k] + (i.s ? '：' + String(i.s).slice(0, 40) : '') }); } }); } catch (e) { } }
  SENT(row.text).forEach(s => {
    const body = s.replace(/[。！？]$/, '');
    if (KIRE_RE.test(body) || /[、,]$/.test(body)) { out.push({ k: '切れ文', why: '接続の言葉・読点で終わる：' + s.slice(-24) }); }
  });
  require('./advice-sift-extra.js').siftAdd(row).forEach(f => out.push(f));   // 枠 三百七十四：二重語尾・格言が逆・二度言い・決まり文句・口ごもり・染め
  let m; TILE_RE.lastIndex = 0;
  const said = new Set();
  while ((m = TILE_RE.exec(row.text))) { const nm = String(m[1]).replace(/^[^一二三四五六七八九東南西北白發発中]/, ''); if (!names.has(nm === '発' ? '發' : nm) && !said.has(nm)) { said.add(nm); out.push({ k: '牌の名', why: '配っていない牌の名「' + nm + '」を言っている（配牌：' + row.tiles + '）' }); } }
  return out;
}
const TONE_JA = { butler: '執事', strategist: '軍師', blunt: 'ずんだ', lady: 'お嬢様', french: 'マダム', ichihime: '一姫', sensei: '先生' };
const label = x => (TONE_JA[x.tone] || x.tone) + '・' + (x.dial || '標準') + '｜' + (x.attack ? '攻め' : '守り');

/* ---- 同じ局で二つの版を比べる（枠 三百九十二） ---- */
function count(rows) {
  const inst = {}, hands = {}; let flagged = 0;
  rows.forEach(x => { const fl = sift(x); if (fl.length) { flagged++; } fl.forEach(f => { inst[f.k] = (inst[f.k] || 0) + 1; }); new Set(fl.map(f => f.k)).forEach(k => { hands[k] = (hands[k] || 0) + 1; }); });
  return { inst, hands, flagged };
}
/* 二つの文の一覧の差（共通の並びを除いて、前だけの文と今だけの文） */
function sentDiff(a, b) {
  const x = SENT(a), y = SENT(b), t = [];
  for (let i = 0; i <= x.length; i++) { t.push(new Array(y.length + 1).fill(0)); }
  for (let i = x.length - 1; i >= 0; i--) { for (let j = y.length - 1; j >= 0; j--) { t[i][j] = x[i] === y[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]); } }
  const del = [], add = []; let i = 0, j = 0;
  while (i < x.length || j < y.length) {
    if (i < x.length && j < y.length && x[i] === y[j]) { i++; j++; }
    else if (j >= y.length || (i < x.length && t[i + 1][j] >= t[i][j + 1])) { del.push(x[i++]); }
    else { add.push(y[j++]); }
  }
  return { del, add };
}
/* sets：[{name, title, prev:[...], now:[...]}]。局は番号で結び、牌・人格・方言が違う局は比べない */
function compareLines(pv, nv, sets) {
  const L = [], sign = n => (n > 0 ? '+' : '') + n, sum = o => Object.values(o).reduce((x, y) => x + y, 0);
  const paired = sets.map(S => {
    const pm = {}; S.prev.forEach(x => { pm[x.n] = x; });
    const pairs = S.now.filter(x => pm[x.n] && pm[x.n].tiles === x.tiles && pm[x.n].tone === x.tone && pm[x.n].dial === x.dial).map(x => [pm[x.n], x]);
    return { name: S.name, title: S.title, pairs: pairs, total: S.now.length };
  });
  const groups = paired.map(S => ({ title: S.title + ' ' + S.pairs.length + '局' + (S.pairs.length !== S.total ? '（局が合わず比べない：' + (S.total - S.pairs.length) + '局）' : ''), pairs: S.pairs }));
  if (paired.length > 1) { const all = [].concat(...paired.map(S => S.pairs)); groups.push({ title: '合わせて ' + all.length + '局', pairs: all }); }
  groups.forEach(G => {
    const a = count(G.pairs.map(p => p[0])), b = count(G.pairs.map(p => p[1]));
    L.push('## 型ごとの件数：' + G.title, '', '| 型 | 件数 ' + pv + ' | 件数 ' + nv + ' | 増減 | 局数 ' + pv + ' | 局数 ' + nv + ' |', '|---|---|---|---|---|---|');
    Array.from(new Set(Object.keys(a.inst).concat(Object.keys(b.inst)))).sort().forEach(k => { L.push('| ' + (REP_LABEL[k] || k) + ' | ' + (a.inst[k] || 0) + ' | ' + (b.inst[k] || 0) + ' | ' + sign((b.inst[k] || 0) - (a.inst[k] || 0)) + ' | ' + (a.hands[k] || 0) + ' | ' + (b.hands[k] || 0) + ' |'); });
    L.push('| 件数の計 | ' + sum(a.inst) + ' | ' + sum(b.inst) + ' | ' + sign(sum(b.inst) - sum(a.inst)) + ' | | |');
    L.push('| 引っかかった局 | | | ' + sign(b.flagged - a.flagged) + ' | ' + a.flagged + ' | ' + b.flagged + ' |', '');
  });
  paired.forEach(S => {
    const ch = S.pairs.filter(p => p[0].text !== p[1].text);
    L.push('## 変わった文：' + S.title + '（文が変わった局 ' + ch.length + '／' + S.pairs.length + '）', '');
    ch.forEach(p => {
      const df = sentDiff(p[0].text, p[1].text), kinds = x => sift(x).map(f => f.k).join('・') || 'なし';
      L.push('### ' + S.name + ' ' + p[1].n + '｜' + label(p[1]) + (p[0].attack !== p[1].attack ? '（前は' + (p[0].attack ? '攻め' : '守り') + '）' : '') + '｜印：' + kinds(p[0]) + ' → ' + kinds(p[1]), '配牌：' + p[1].tiles, '');
      df.del.forEach(x => L.push('- 前（' + pv + '）：' + x));
      df.add.forEach(x => L.push('- 今（' + nv + '）：' + x));
      L.push('');
    });
    if (!ch.length) { L.push('変わった文はありません。', ''); }
  });
  return L;
}
if (COMPARE) {
  const load = f => { const t = fs.readFileSync(f, 'utf8'); return { html: t, ver: (/data-ver="v?([0-9]+)"/.exec(t) || [0, '?'])[1] }; };
  const P = load(path.resolve(COMPARE)), Q = load(NOW ? path.resolve(NOW) : path.join(ROOT, 'koushu-handan.html'));
  const twice = V => {
    const one = drive(V.html, false, true), two = drive(V.html, true, true);
    const all = r => r.rows.concat(r.fixed), x = all(one), y = all(two);
    const bad = x.filter((v, i) => JSON.stringify(v) !== JSON.stringify(y[i])).length;
    return { res: one, bad: bad, same: bad === 0 && x.length === y.length, c1: count(x), c2: count(y), n: x.length, noMem: one.noMem };
  };
  const A = twice(P), B = twice(Q);
  const det = (V, R) => '- 版 ' + V.ver + '：二度目（保存した局は逆順）と' + (R.same ? '一致' : '不一致（違う局 ' + R.bad + '）') + '（' + R.n + '局）。引っかかった局 ' + R.c1.flagged + '／' + R.c2.flagged + '、型ごとの件数 ' + JSON.stringify(R.c1.inst) + '／' + JSON.stringify(R.c2.inst) + (R.noMem.length ? '。初期化できなかった覚え：' + R.noMem.join('・') : '');
  const out = ['# 同じ局で比べる：版 ' + P.ver + ' → ' + Q.ver, '', '保存した配牌 ' + N + '局（tools/advice-hands.json）と決まった30局。件数は両方の版を同じ今の篩で数えた物。', '', '## 同じ版を二度回した確かめ', '', det(P, A), det(Q, B), '']
    .concat(compareLines(P.ver, Q.ver, [{ name: '局', title: '保存した配牌', prev: A.res.rows, now: B.res.rows }, { name: '固定', title: '決まった30局', prev: A.res.fixed, now: B.res.fixed }]));
  fs.mkdirSync(path.join(OD, 'advice-compare'), { recursive: true });
  const dest = path.join(OD, 'advice-compare', P.ver + '-' + Q.ver + '.md');
  fs.writeFileSync(dest, out.join('\n'), 'utf8');
  console.log(out.slice(0, out.findIndex(l => l.indexOf('## 変わった文') === 0)).join('\n'));
  console.log('書いた：' + dest);
  process.exit(A.same && B.same ? 0 : 5);
}

const ver = (fs.readFileSync(path.join(ROOT, 'ver.txt'), 'utf8').match(/[0-9]+/) || ['?'])[0];
const res = drive(fs.readFileSync(path.join(ROOT, 'koushu-handan.html'), 'utf8'), false, false);
const d = new Date(Date.now() + 9 * 3600 * 1000), z2 = n => (n < 10 ? '0' : '') + n;
const stamp = d.getUTCFullYear() + '-' + z2(d.getUTCMonth() + 1) + '-' + z2(d.getUTCDate()) + ' ' + z2(d.getUTCHours()) + ':' + z2(d.getUTCMinutes());
const all = res.rows.map(x => Object.assign({ set: '見本' }, x)).concat(res.fixed.map(x => Object.assign({ set: '固定' }, x)));
all.forEach(x => { x.flags = sift(x); });
const flagged = all.filter(x => x.flags.length);
const byKind = {}; flagged.forEach(x => x.flags.forEach(f => { byKind[f.k] = (byKind[f.k] || 0) + 1; }));
const empty = res.rows.filter(x => !x.text).length;
const L = ['# 助言の見本（センコ用・変な文を探す）', '', '版：' + ver, '作った刻：' + stamp + '（日本時間）',
  '局数：無作為 ' + res.rows.length + '局（人格と方言は一局ごとにばらす・口調はノーマル）＋決まった ' + res.fixed.length + '局（固定。senko/advice-diff.md の比べの元）／文が空の局：' + empty, '',
  '## 機械の篩（引っかかった文）', '',
  '見る物：語尾の二文続き・切れ端・中身のない一文・語尾の二重（advdup.js）／接続の言葉や読点で終わる切れ文／配っていない牌の名。役の名の食い違いは今は見ていない。目安なので、見て違うと思えば無視してよい。',
  '引っかかった文：' + flagged.length + '／' + all.length + '件（' + (Object.keys(byKind).map(k => (REP_LABEL[k] || k) + ' ' + byKind[k]).join('・') || 'なし') + '）', ''];
flagged.slice(0, 60).forEach(x => { L.push('- ' + x.set + ' 局' + x.n + '｜' + label(x) + '｜印：' + x.flags.map(f => f.k).join('・') + '｜訳：' + x.flags.map(f => f.why).join('／')); });
if (flagged.length > 60) { L.push('- …ほか ' + (flagged.length - 60) + '件（下の各局に印あり）'); }
/* 判定カードの絵（advice-shots.js が先に作る）：はみ出し・切れの印 */
try {
  const sr = JSON.parse(fs.readFileSync(path.join(OD, 'advice-shots', ver, 'report.json'), 'utf8')), bad = sr.rows.filter(x => (x.issues && x.issues.length) || x.err || x.card === false);
  L.push('', '## 判定カードの絵（iPhone 横向き 844x390 で撮り、568x320 の窓で枠の検査）', '', '絵：advice-shots/' + ver + '/fixed-NN.png（決まった30局）／印の付いた局：' + bad.length + '／' + sr.rows.length);
  bad.forEach(x => { L.push('- 固定 局' + x.n + '：' + ((x.issues || []).join('／') || x.err || (x.card === false ? '判定カードが出ていない' : '')) + (x.shot ? '（' + x.shot + '）' : '')); });
} catch (e) { L.push('', '## 判定カードの絵', '', '（この版の絵の記録が読めなかった）'); }
L.push('', '## 無作為の百局', '', '読むだけの見本です。本体が実際に出す文（adviceFor）をそのまま並べています。局は版が替わっても同じ（保存した配牌・くじの種も固定）。', '');
res.rows.forEach(x => { const f = x.flags || all.find(a => a.set === '見本' && a.n === x.n).flags; L.push('### 局 ' + x.n + '｜' + label(x) + (f && f.length ? '｜印：' + f.map(y => y.k).join('・') : '')); L.push('配牌：' + x.tiles); L.push(''); L.push(x.text || '（文なし）'); L.push(''); });
L.push('## 決まった30局（版ごとの比べの元）', '');
res.fixed.forEach(x => { const f = all.find(a => a.set === '固定' && a.n === x.n).flags; L.push('### 固定 ' + x.n + '｜' + label(x) + (f.length ? '｜印：' + f.map(y => y.k).join('・') : '')); L.push('配牌：' + x.tiles); L.push(''); L.push(x.text || '（文なし）'); L.push(''); });
fs.mkdirSync(path.join(OD, 'advice-sample'), { recursive: true });
fs.writeFileSync(path.join(OD, 'advice-sample.md'), L.join('\n'), 'utf8');
fs.writeFileSync(path.join(OD, 'advice-sample', ver + '.md'), L.join('\n'), 'utf8');
fs.writeFileSync(path.join(OD, 'advice-sample', ver + '-fixed.json'), JSON.stringify({ ver: ver, at: stamp, rows: res.fixed }, null, 1), 'utf8');

/* ---- 前の版との比べ（決まった30局） ---- */
let prev = null; try { if (PREV) { prev = JSON.parse(fs.readFileSync(PREV, 'utf8')); } } catch (e) { }
const D = ['# 助言の版ごとの比べ（決まった30局・前の版と変わった文だけ）', '', '版：' + ver, '作った刻：' + stamp + '（日本時間）'];
if (!prev || String(prev.ver) === ver) { D.push('前の版：（無い。この版が最初の元）', '', '決まった30局の文を advice-sample/' + ver + '-fixed.json に残しました。次の版から、変わった文だけがここに並びます。'); }
else {
  const pm = {}; (prev.rows || []).forEach(x => { pm[x.n] = x; });
  const ch = res.fixed.filter(x => pm[x.n] && pm[x.n].text !== x.text);
  D.push('前の版：' + prev.ver + '（' + prev.at + '）', '変わった局：' + ch.length + '／' + res.fixed.length + '（配牌・人格・方言・くじは固定なので、文が変わったのは助言の組み立てか言葉の直しによる）', '');
  ch.forEach(x => { D.push('### 固定 ' + x.n + '｜' + label(x), '配牌：' + x.tiles, '', '前（' + prev.ver + '）：' + pm[x.n].text, '', '今（' + ver + '）：' + x.text, ''); });
  if (!ch.length) { D.push('変わった文はありません。'); }
}
/* ---- 前の版との比べ（保存した同じ局） ---- */
let ph = null;
try {
  const older = fs.readdirSync(path.join(OD, 'advice-sample')).map(f => /^([0-9]+)-hands\.json$/.exec(f)).filter(m => m && Number(m[1]) < Number(ver)).map(m => Number(m[1])).sort((a, b) => b - a)[0];
  if (older) { ph = JSON.parse(fs.readFileSync(path.join(OD, 'advice-sample', older + '-hands.json'), 'utf8')); }
} catch (e) { console.error('前の版の保存した局の文が読めない：' + e.message); }
D.push('', '# 保存した同じ' + res.rows.length + '局の比べ', '');
if (ph) { D.push(...compareLines(String(ph.ver), ver, [{ name: '局', title: '保存した配牌', prev: ph.rows, now: res.rows }])); }
else { D.push('前の版の記録が無い。この版の文を advice-sample/' + ver + '-hands.json に残した。次の版から比べが並ぶ（今すぐ比べるなら --compare）。'); }
fs.writeFileSync(path.join(OD, 'advice-sample', ver + '-hands.json'), JSON.stringify({ ver: ver, at: stamp, rows: res.rows }, null, 1), 'utf8');
fs.writeFileSync(path.join(OD, 'advice-diff.md'), D.join('\n'), 'utf8');
console.log('版 ' + ver + '・無作為' + res.rows.length + '局・固定' + res.fixed.length + '局・空 ' + empty + '・篩 ' + flagged.length + '件・比べ ' + (prev && String(prev.ver) !== ver ? '前' + prev.ver : '元のみ'));
