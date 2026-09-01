/* ウィジェットの納品前チェック（2026-09-01・ウィジェットの守り-1）
 *
 *   node widget-check.js [usage-widget.js の道] [usage-widget-loader.js の道]
 *
 * 見るもの（⑦の作りに倣って、落ちたら終了コード1）
 *   ① 構文が通る（どちらも module として）
 *   ② 本体に module.exports と build が在る
 *   ③ 殻が控えの名と台本の名を取り違えない（字面と、作り値の両方で）
 *   ④ 四通りの状態（作業中／手待ち／ヨシ待ち／異常）で build が例外を出さずウィジェットを返す
 *   ⑤ ボーダーの式が境目の三点で正しい（リセット直後14.3％／境目前85.7％／境目後100％）
 *   ⑥ 猫の絵四枚が公開側に在る（**404 は落ち**。通信そのものが出来ない回だけ「測れなかった」）
 *
 * 真似た台のこと
 *   Scriptable の道具（Color/Font/ListWidget/Request…）は node に無いので、**使う分だけ真似た台**を
 *   作って走らせる。台は本物ではないので、**拾えないものがある**（下に列挙し、まとめにも出す）。
 *     ・importModule／台本の置き場（iCloud か local か）まわりの振る舞い
 *       ＊実際にここで食い違い、実機だけで落ちた（2026-09-01・殻の直し-1）
 *     ・loadImage が返す実体（ここでは名を返すだけ）と、絵の見え方・大きさ
 *     ・ウィジェットの見た目（はみ出し・折り返し・色）と、触ったときの遷移
 *     ・iOS 側の取得の間隔や控えの持ち方
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');

const ROOT = __dirname;
const W_PATH = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'usage-widget.js');
const L_PATH = process.argv[3] ? path.resolve(process.argv[3]) : path.join(ROOT, 'usage-widget-loader.js');

let bad = 0, skipped = 0;
function ok(m)   { console.log('  ✓ ' + m); }
function ng(m)   { console.log('  ✗ ' + m); bad++; }
function note(m) { console.log('    ' + m); }
function head(m) { console.log(''); console.log(m); console.log('─'.repeat(52)); }

const W = fs.readFileSync(W_PATH, 'utf8');
const L = fs.readFileSync(L_PATH, 'utf8');

/* ---- Scriptable を真似た台（使う分だけ） ---- */
function stage(opts) {
  const drawn = [], asked = [];
  let url = null;
  class Color { constructor(h) { this.h = h; } }
  class Size { constructor(w, h) { this.w = w; this.h = h; } }
  const Font = { systemFont: s => ({ s }), semiboldSystemFont: s => ({ s }),
                 boldSystemFont: s => ({ s }), mediumSystemFont: s => ({ s }) };
  class Stack {
    constructor() { this.items = []; }
    layoutHorizontally() {} layoutVertically() {} centerAlignContent() {}
    setPadding() {} addSpacer() {}
    addText(t) { drawn.push(String(t)); return {}; }
    addImage(i) { drawn.push('[絵]'); return {}; }
    addStack() { const s = new Stack(); this.items.push(s); return s; }
  }
  class ListWidget extends Stack {
    set url(u) { url = u; } get url() { return url; }
    presentSmall() {} presentMedium() {}
  }
  const Script = { name: () => opts.scriptName || 'Claude 使用量', setWidget() {}, complete() {} };
  const config = { runsInWidget: true, runsInApp: false };
  class Request {
    constructor(u) { this.url = u; this.timeoutInterval = 0; asked.push(String(u).split('?')[0]); }
    async loadJSON() {
      if (/state\.json/.test(this.url))   { return opts.state || {}; }
      if (/notices\.json/.test(this.url)) { return opts.notices || []; }
      if (/usage\.json/.test(this.url))   { return opts.usage || {}; }
      throw new Error('台に無い道: ' + this.url);
    }
    async loadString() {
      if (/ver\.txt/.test(this.url)) { return opts.ver || '0'; }
      if (/usage-widget\.js/.test(this.url)) {
        if (opts.netFails) { throw new Error('取れない（作り値）'); }
        return opts.serve || W;
      }
      throw new Error('台に無い道: ' + this.url);
    }
    async loadImage() {
      const m = String(this.url).match(/([^/]+\.png)$/);
      if (!m) { throw new Error('絵が無い'); }
      return m[1];
    }
  }
  const files = opts.files || {};
  const FileManager = { local: () => ({
    documentsDirectory: () => '/scriptable',
    joinPath: (a, b) => a + '/' + b,
    fileExists: p => Object.prototype.hasOwnProperty.call(files, p),
    readString: p => files[p],
    writeString: (p, t) => { files[p] = t; }
  }) };
  return { drawn, asked, files, get url() { return url; },
           g: { Color, Size, Font, ListWidget, Script, config, Request, FileManager } };
}

const AsyncFn = Object.getPrototypeOf(async function () { }).constructor;

async function loadWidget(src, opts) {
  const t = stage(opts || {});
  const names = Object.keys(t.g);
  const mod = { exports: {}, viaLoader: true };
  await new AsyncFn(...names, 'module', 'exports', src)(...names.map(n => t.g[n]), mod, mod.exports);
  return { t, mod };
}

async function runLoader(src, opts) {
  const t = stage(opts || {});
  const names = Object.keys(t.g);
  await new AsyncFn(...names, 'module', src)(...names.map(n => t.g[n]), { exports: {} });
  return t;
}

/* ---- ① 構文 ---- */
head('① 構文');
for (const [nm, src] of [['usage-widget.js', W], ['usage-widget-loader.js', L]]) {
  try { new vm.Script('(async () => {\n' + src + '\n})', { filename: nm }); ok(nm + ' は読める'); }
  catch (e) { ng(nm + ' の構文が壊れている：' + e.message); }
}

/* ---- ② module.exports と build ---- */
head('② 本体の出し口');
(async () => {
  if (!/module\.exports/.test(W)) { ng('usage-widget.js に module.exports が無い'); }
  else { ok('module.exports が在る'); }

  let build = null;
  try {
    const { mod } = await loadWidget(W, {});
    build = (mod.exports && mod.exports.build) || null;
    if (typeof build === 'function') { ok('build が関数として出ている'); }
    else { ng('build が出ていない（殻が受け取れない）'); }
  } catch (e) { ng('本体を評価できない：' + e.message); }

  /* ---- ③ 殻が控えの名と台本の名を取り違えない ---- */
  head('③ 殻の控えの名');
  const mC = L.match(/const\s+CACHE\s*=\s*'([^']+)'/);
  const cache = mC ? mC[1] : '';
  if (!cache) { ng('殻に CACHE の指定が見つからない'); }
  else if (cache === 'usage-widget.js') {
    ng('控えの名が本体と同じ（' + cache + '）。台本名と重なると自分を上書きする');
  } else { ok('控えの名は ' + cache + '（本体の名と別）'); }
  if (!/Script\.name\(\)/.test(L)) { ng('殻が台本の名を見ていない（自分を上書きする恐れ）'); }
  else { ok('殻は台本の名と突き合わせている'); }

  /* 作り値でも見る … 台本の名が控えと同じとき、書きも読みもしないこと */
  try {
    const before = '/* これは台本そのもの */';
    const files = {}; files['/scriptable/' + cache] = before;
    const t = await runLoader(L, { scriptName: cache.replace(/\.js$/, ''), serve: W, files,
                                   state: {}, notices: [], usage: {} });
    if (files['/scriptable/' + cache] === before) { ok('台本と同じ名でも、控えを上書きしない'); }
    else { ng('台本と同じ名のとき、控えで上書きしてしまう'); }
  } catch (e) { ng('殻を走らせられない：' + e.message); }

  /* ---- ④ 四通りの状態 ---- */
  head('④ 四通りの状態');
  const usage = { at: new Date().toISOString(), body: {
    five_hour: { utilization: 12, resets_at: new Date(Date.now() + 3600e3).toISOString() },
    seven_day: { utilization: 34, resets_at: new Date(Date.now() + 86400e3).toISOString() },
    limits: [{ kind: 'weekly_scoped', percent: 5,
               resets_at: new Date(Date.now() + 86400e3).toISOString(),
               scope: { model: { display_name: 'Fable' } } }] } };
  const notices = [{ title: '✅', time: 100, message: '写せます（3件）' }];
  const now = Math.floor(Date.now() / 1000);
  const CASES = [
    ['作業中',   { stat: '作業中', subj: 'x', mikomi: '25分', startedAt: now - 600 }],
    ['手待ち',   { stat: '手待ち', subj: 'x', mikomi: '', startedAt: 0 }],
    ['ヨシ待ち', { stat: 'ヨシ待ち', subj: 'x', mikomi: '', startedAt: 0 }],
    ['異常',     { stat: '異常', subj: 'x', mikomi: '', startedAt: 0 }]
  ];
  const WANT = { '作業中': /^作業中、/, '手待ち': /^次の指示待ち$/,
                 'ヨシ待ち': /^ヨシを返してください$/, '異常': /^異常です$/ };
  for (const [nm, st] of CASES) {
    try {
      const { t, mod } = await loadWidget(W, { state: st, notices, usage, ver: '1435' });
      if (typeof mod.exports.build !== 'function') { ng(nm + '：build が無い'); continue; }
      const w = await mod.exports.build();
      if (!w) { ng(nm + '：ウィジェットが返らない'); continue; }
      const line = t.drawn.find(x => WANT[nm].test(x));
      const img  = t.asked.find(u => /\.png$/.test(u));
      if (!line) { ng(nm + '：状態の字が出ない（描いた字 ' + JSON.stringify(t.drawn.slice(0, 3)) + '）'); }
      else if (!img) { ng(nm + '：猫の絵を取りに行っていない'); }
      else { ok(nm + '：' + line + '／絵 ' + img.split('/').pop()); }
    } catch (e) { ng(nm + '：build が例外を出した：' + e.message); }
  }

  /* ---- ⑤ ボーダーの式 ---- */
  head('⑤ ボーダーの式（境目の三点）');
  try {
    const { mod } = await loadWidget(W + '\nmodule.exports.borderPct = borderPct;', {});
    const bp = mod.exports.borderPct;
    if (typeof bp !== 'function') { ng('borderPct を取り出せない'); }
    else {
      const day = 86400000;
      const mk = ms => new Date(ms).toISOString();
      const points = [
        ['リセット直後', mk(Date.now() + 7 * day - 60000), 14.3],   /* 次まで7日弱 ＝ 経過1日目 */
        ['境目前',       mk(Date.now() + day + 60000),     85.7],   /* 次まで1日と少し ＝ 経過6日目 */
        ['境目後',       mk(Date.now() + 60000),          100]      /* 次がすぐ ＝ 経過7日目 */
      ];
      for (const [nm, iso, want] of points) {
        const got = bp(iso);
        if (got === want) { ok(nm + ' … ' + got + '%'); }
        else { ng(nm + ' … ' + got + '%（' + want + '% のはず）'); }
      }
    }
  } catch (e) { ng('ボーダーの式を確かめられない：' + e.message); }

  /* ---- ⑥ 猫の絵が公開側に在るか ---- */
  head('⑥ 猫の絵（公開側）');
  const base = (W.match(/const\s+URL_IMG\s*=\s*'([^']+)'/) || [])[1] || '';
  const names = [...W.matchAll(/'([\w.-]+\.png)'/g)].map(m => m[1]);
  const uniq = [...new Set(names)];
  if (!base || !uniq.length) { ng('絵の道か名が読み取れない'); }
  else {
    for (const n of uniq) {
      const code = await new Promise(res => {
        https.get(base + n + '?_chk=' + Date.now(), r => { r.resume(); res(r.statusCode); })
             .on('error', () => res(0));
      });
      if (code === 200) { ok(n + ' … 200'); }
      else if (code === 0) { note(n + ' … 通信できないので測れない'); skipped++; }
      else { ng(n + ' … HTTP ' + code + '（公開側に無い）'); }
    }
  }

  /* ---- まとめ ---- */
  head('まとめ（ウィジェットの検査）');
  note('真似た台では拾えないもの … importModule と台本の置き場／loadImage の実体と絵の見え方／');
  note('　ウィジェットの見た目（はみ出し・折り返し・色）／触ったときの遷移／iOS の取得の間隔と控えの持ち方');
  if (skipped) { note('通信できずに測れなかった項目 ' + skipped + '件（落ちとは別）'); }
  if (bad === 0) { console.log(''); console.log('全てPASS'); process.exit(0); }
  console.log('');
  console.log('FAIL ' + bad + '件');
  process.exit(1);
})();
