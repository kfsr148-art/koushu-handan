#!/usr/bin/env node
/* advice-sample.js — 助言の見本・版ごとの比べ・機械の篩（2026-11-26・枠 三百四十②・三百四十一①②・三百四十二②・本人の決め）。
   公開の版が上がるたび、雲で次を作る（VAIO では回さない＝koushu-state の雲の走り advice-sample.yml が回す）。読むだけで何も直さない。
     ①無作為の配牌 100 局に人格と方言をばらして付け、本体が実際に出す助言の文（adviceFor）を並べた見本 → advice-sample.md
     ②決まった 30 局（種つきの乱数で配牌・人格・方言・くじを固定）の文 → advice-sample/<版>-fixed.json。前の版のそれと見比べ、変わった文だけを advice-diff.md に版つきで並べる
     ③見本・決まった30局の文を、機械で篩う（語尾の二文続き・切れ文・配っていない牌の名）。引っかかった文に印と訳を付け、advice-sample.md の頭にまとめる
     ④見本を版ごとに advice-sample/<版>.md にも残す
   ＊本体（koushu-handan.html）には触らない。写しを一時の所に作り、本体の包みの内側（window.shuffleHand の行の後ろ）へ探索用の一片（probe）を差し込んで、
     headless Chrome／Edge ＋ --dump-dom で駆動する（作法14）。結果は base64 の目印つきで DOM に置き、吐かれた HTML から拾う。window に診断口は生やさない。
   使い方  node tools/advice-sample.js <handan の置き場> <出し先のフォルダ（senko）> [局数=100] [--prev <前の版の fixed.json>]
   ＊篩は文を見る目安で、役の名の食い違い（言っていない役を言う）は今は見ていない。 */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const common = require('./advice-common.js');
const args = process.argv.slice(2);
const pi = args.indexOf('--prev'); const PREV = pi >= 0 ? args.splice(pi, 2)[1] : '';
const ROOT = path.resolve(args[0] || '.'), OD = path.resolve(args[1] || '.'), N = Number(args[2]) || 100, NF = 30;
const src = fs.readFileSync(path.join(ROOT, 'koushu-handan.html'), 'utf8');
const ver = (fs.readFileSync(path.join(ROOT, 'ver.txt'), 'utf8').match(/[0-9]+/) || ['?'])[0];
const PROBE = `
/* ---- probe（写しの中だけ・本体の包みの内側へ差し込む。大域に出ていない const/let を読むため） ---- */
${common.FIXED_JS}
window.addEventListener('load', function(){ setTimeout(function(){
  var res = { rows: [], fixed: [], err: null };
  function judgeText(){
    var a = analyze();
    var catN = hand.filter(function(t){ return t.suit === 'cat'; }).length;
    var eff = catN + countIsolatedRealTiles(hand.filter(function(t){ return t.suit !== 'cat'; }));
    var rv = revoteVerdict(a, eff);
    if (rv) { a.revote = rv; a.verdict = rv.to; }
    var attack = a.verdict === 'attack';
    var r = null; try { r = adviceFor(a, hand, attack); } catch (e) { r = null; }
    return { attack: attack, text: r ? String(r.text || '') : '' };
  }
  try {
    var dials = [''].concat(Object.keys(ADV_DIALECT));
    /* 決まった30局を先に回す（本体の「直前に選んだ言葉を避ける」記憶が、無作為の百局に左右されず同じ文になるように） */
    for (var k = 0; k < ${NF}; k++) {
      var f = khFixed(k, ADV_TONE_KEYS, dials);
      document.getElementById('qiText').value = tilesToInput(f.tiles);
      rebuildHand();
      currentTone = f.tone; currentDialect = f.dial;
      khSeed(k);
      var j2 = judgeText();
      khUnseed();
      res.fixed.push({ n: k + 1, tiles: tilesToInput(hand), tone: currentTone, dial: currentDialect, attack: j2.attack, text: j2.text });
    }
    for (var i = 0; i < ${N}; i++) {
      shuffleHand();
      currentTone = ADV_TONE_KEYS[Math.floor(Math.random() * ADV_TONE_KEYS.length)];
      currentDialect = dials[Math.floor(Math.random() * dials.length)];
      var j = judgeText();
      res.rows.push({ n: i + 1, tiles: tilesToInput(hand), tone: currentTone, dial: currentDialect, attack: j.attack, text: j.text });
    }
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
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-advs-'));
const probe = path.join(tmp, 'probe.html');
fs.writeFileSync(probe, src.replace('window.shuffleHand = shuffleHand;', () => 'window.shuffleHand = shuffleHand;' + PROBE), 'utf8');
const cargs = ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--window-size=900,700', '--mute-audio', '--user-data-dir=' + path.join(tmp, 'prof'),
  '--virtual-time-budget=120000', '--dump-dom', 'file:///' + probe.replace(/\\/g, '/')];
const r = cp.spawnSync(browser, cargs, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout: 170000 });
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
const hit = /KHAS_BEGIN([A-Za-z0-9+/=]+)KHAS_END/.exec(String(r.stdout || ''));
if (!hit) { console.error('結果を取り出せない'); process.exit(3); }
const res = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8'));
if (res.err) { console.error('probe の誤り：' + res.err); process.exit(4); }

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
  let m; TILE_RE.lastIndex = 0;
  const said = new Set();
  while ((m = TILE_RE.exec(row.text))) { const nm = String(m[1]).replace(/^[^一二三四五六七八九東南西北白發発中]/, ''); if (!names.has(nm === '発' ? '發' : nm) && !said.has(nm)) { said.add(nm); out.push({ k: '牌の名', why: '配っていない牌の名「' + nm + '」を言っている（配牌：' + row.tiles + '）' }); } }
  return out;
}
const TONE_JA = { butler: '執事', strategist: '軍師', blunt: 'ずんだ', lady: 'お嬢様', french: 'マダム', ichihime: '一姫', sensei: '先生' };
const d = new Date(Date.now() + 9 * 3600 * 1000), z2 = n => (n < 10 ? '0' : '') + n;
const stamp = d.getUTCFullYear() + '-' + z2(d.getUTCMonth() + 1) + '-' + z2(d.getUTCDate()) + ' ' + z2(d.getUTCHours()) + ':' + z2(d.getUTCMinutes());
const label = x => (TONE_JA[x.tone] || x.tone) + '・' + (x.dial || '標準') + '｜' + (x.attack ? '攻め' : '守り');
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
L.push('', '## 無作為の百局', '', '読むだけの見本です。本体が実際に出す文（adviceFor）をそのまま並べています。', '');
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
fs.writeFileSync(path.join(OD, 'advice-diff.md'), D.join('\n'), 'utf8');
console.log('版 ' + ver + '・無作為' + res.rows.length + '局・固定' + res.fixed.length + '局・空 ' + empty + '・篩 ' + flagged.length + '件・比べ ' + (prev && String(prev.ver) !== ver ? '前' + prev.ver : '元のみ'));
