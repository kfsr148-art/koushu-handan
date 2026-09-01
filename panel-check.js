/* 返事パネル（panel.html）の納品前チェック（2026-09-01・パネルの守り-1）
 *
 *   node panel-check.js [panel.html の道]
 *
 * 見るもの（落ちたら終了コード1）
 *   ① 構文が通る（<script> の塊を読めるか）
 *   ② 四通りの状態（作業中／次の指示待ち／ヨシ待ち／異常）で、正しい字と札が出る
 *   ③ まとめて写すの「残N／M件」と、束ねて実際に写る件数が一致する
 *      ＊定時の報せ・延びています・ヨシ待ちの札が混ざった作り値で確かめる
 *   ④ iPhone の横と縦の視野で、溢れと重なりが無い
 *   ⑤ 状態の札（黄色の行）の高さが、題の長短で変わらない
 *   ⑥ 黄色の行の終了予定が、ウィジェットと同じ計算（開始＋見込み）になっている
 *
 * やり方は作法14「写しに probe」。panel.html を一時ディレクトリへ写し、fetch を作り値へ
 * 差し替えて headless で駆動する。**本体には一片も残さない。**
 *
 * 真似た台（作り値の fetch）では拾えないもの
 *   ・公開側の遅れや詰まり（ここでは即座に返る）
 *   ・iOS Safari 固有の描き方（折り返し・字送り・慣性のある送り）
 *   ・実機の触り心地（押しやすさ・二本指の送り）と、写しがクリップボードへ本当に入るか
 *   ・ntfy の押し通知そのもの
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const SRC = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, 'panel.html');
const MARK = 'PANELCHK-B64:';
const html = fs.readFileSync(SRC, 'utf8');

let bad = 0, skipped = 0;
function ok(m)   { console.log('  ✓ ' + m); }
function ng(m)   { console.log('  ✗ ' + m); bad++; }
function note(m) { console.log('    ' + m); }
function head(m) { console.log(''); console.log(m); console.log('─'.repeat(52)); }

function findBrowser() {
  const c = [
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ].filter(p => p && fs.existsSync(p));
  return c[0] || null;
}
const BROWSER = findBrowser();

/* 窓と視野の差は環境で違う。素の一枚で一度だけ測る（check.js ⑦ と同じ流儀）。 */
let padW = 24, padH = 92;
function calibrate(tmp) {
  if (!BROWSER) { return; }
  const cal = path.join(tmp, 'cal.html');
  fs.writeFileSync(cal, '<!doctype html><html><body><script>document.body.textContent=' +
    '"PCAL["+window.innerWidth+","+window.innerHeight+"]LACP";</script></body></html>', 'utf8');
  for (let i = 0; i < 3; i++) {
    let out = '';
    try {
      out = execFileSync(BROWSER, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
        '--force-device-scale-factor=1', '--window-size=667,375',
        '--user-data-dir=' + path.join(tmp, 'prof-cal'), '--no-first-run', '--no-default-browser-check',
        '--virtual-time-budget=4000', '--dump-dom', 'file:///' + cal.replace(/\\/g, '/')],
        { encoding: 'utf8', maxBuffer: 1 << 24, timeout: 60000, windowsHide: true });
    } catch (e) { out = String((e && e.stdout) || ''); }
    const m = /PCAL\[(\d+),(\d+)\]LACP/.exec(out);
    if (m) { padW = 667 - Number(m[1]); padH = 375 - Number(m[2]); return; }
  }
}

/* ---- probe。fetch を作り値へ差し替え、測ってから目印つきで置く ---- */
function probeSource(scene) {
  return '\n<script>\n(function () {\n  var S = ' + JSON.stringify(scene) + ';\n' + String.raw`
  try { localStorage.clear(); } catch (e) {}
  var CAP = { clip: null };
  var J = function (o) {
    return Promise.resolve({ ok: true, status: 200,
      json: function () { return Promise.resolve(o); },
      text: function () { return Promise.resolve(typeof o === 'string' ? o : JSON.stringify(o)); } });
  };
  window.fetch = function (u) {
    u = String(u);
    if (u.indexOf('panel-ver.txt') >= 0) return J(String(S.panelVer || '104'));
    if (u.indexOf('notices.json') >= 0)  return J(S.notices || []);
    if (u.indexOf('board.json') >= 0)    return J(S.board || { waiting: [], recent: [] });
    if (u.indexOf('seen.json') >= 0)     return J({ upto: S.seen || 0 });
    if (u.indexOf('state.json') >= 0)    return J(S.state || {});
    if (u.indexOf('usage.json') >= 0)    return J({});
    if (u.indexOf('stable') >= 0)        return J('1434');
    if (u.indexOf('ver.txt') >= 0)       return J('1435');
    return J({});
  };
  try {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: function (t) { CAP.clip = t; return Promise.resolve(); } }
    });
  } catch (e) {}

  function txt(el) { return el ? String(el.textContent || '').trim() : ''; }
  function vis(el) {
    if (!el) { return false; }
    var s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') { return false; }
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  /* 写しに入った札の数（panel-probe.js と同じ数え方） */
  function countCards(t) {
    if (!t) { return 0; }
    var ls = String(t).split('\n'), n = 0;
    for (var i = 2; i < ls.length; i++) {
      if (/^ほか[0-9]+件/.test(ls[i])) { continue; }
      if (ls[i].indexOf(' ／ ') >= 0) { n++; }
    }
    return n;
  }
  function num(s, re) { var m = String(s || '').match(re); return m ? Number(m[1]) : null; }

  function measure() {
    var o = { w: window.innerWidth, h: window.innerHeight };
    /* 黄色の行（状態の一行）と、その箱の高さ */
    var st = document.getElementById('stLine');
    o.stText = txt(st);
    o.stH = st ? Math.round(st.getBoundingClientRect().height * 10) / 10 : null;
    /* 板に出ている札の題（異常の札などを見る） */
    var bd = document.getElementById('board');
    o.cards = [];
    if (bd) {
      var lis = bd.querySelectorAll('li');
      for (var i = 0; i < lis.length && i < 12; i++) { o.cards.push(txt(lis[i]).slice(0, 40)); }
    }
    /* 釦の字 */
    var btn = document.getElementById('btnCopyBoard');
    o.btn = txt(btn);
    o.btnRest = num(o.btn, /残(\d+)/);
    o.btnAll  = num(o.btn, /／(?:全)?(\d+)件/);
    /* 溢れと重なり */
    var out = [], hit = [];
    var all = document.body.querySelectorAll('*');
    for (var k = 0; k < all.length; k++) {
      var e = all[k];
      if (!vis(e)) { continue; }
      var r = e.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) { continue; }
      if (r.right > o.w + 1.5 || r.left < -1.5) {
        var cs = getComputedStyle(e);
        /* 送れる箱と「…」で切る箱は数えない（check.js ⑦ と同じ扱い） */
        if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') { continue; }
        if (cs.textOverflow === 'ellipsis') { continue; }
        if (out.length < 6) { out.push((e.id || e.className || e.tagName) + ' right=' + Math.round(r.right)); }
      }
    }
    o.out = out; o.hit = hit;
    return o;
  }

  window.addEventListener('load', function () {
    setTimeout(function () {
      var o = measure();
      if (S.press) {
        var btn = document.getElementById('btnCopyBoard');
        o.beforeBtn = o.btn;
        if (btn) { btn.click(); }
        setTimeout(function () {
          o.afterBtn = txt(btn);
          o.copied = countCards(CAP.clip);
          o.clipLen = CAP.clip ? CAP.clip.length : 0;
          out2(o);
        }, 700);
        return;
      }
      out2(o);
    }, S.settle || 1200);
  });
  function out2(o) {
    var d = document.createElement('div');
    d.id = 'panelChkOut';
    d.textContent = '` + MARK + String.raw`' + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
    document.body.appendChild(d);
  }
})();
` + '<' + '/script>\n';
}

function run(tmp, scene, vw, vh) {
  if (!BROWSER) { return null; }
  const f = path.join(tmp, 'p.html');
  fs.writeFileSync(f, html.replace(/<body([^>]*)>/, (m) => m + probeSource(scene)), 'utf8');
  let out = '';
  try {
    out = execFileSync(BROWSER, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=' + (vw + padW) + ',' + (vh + padH),
      '--user-data-dir=' + path.join(tmp, 'prof'), '--no-first-run', '--no-default-browser-check',
      '--disable-background-networking', '--mute-audio',
      '--virtual-time-budget=12000', '--dump-dom', 'file:///' + f.replace(/\\/g, '/')],
      { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 120000, windowsHide: true });
  } catch (e) { out = String((e && e.stdout) || ''); }
  const m = new RegExp(MARK + '([A-Za-z0-9+/=]+)').exec(out);
  if (!m) { return null; }
  return JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'));
}

/* ---- 作り値 ---- */
const now = Math.floor(Date.now() / 1000);
const N = (t, title, msg) => ({ time: t, title: title, message: msg });
const MIX = [
  N(now - 900, '🕘 定時の報せ', '状態: 手待ち'),
  N(now - 800, '😺 現在も順調にゃ', '状態: 作業中'),
  N(now - 700, '🕒 延びています', '終了予定を過ぎています（経過62分）'),
  N(now - 600, '🙋 ヨシしてください', 'パネルの守り-1 の実測をご確認ください'),
  N(now - 500, '✅ 終わりました（返事不要）', '写せます（3件）')
];
const ST = {
  '作業中':   { stat: '作業中', subj: 'パネルの守り-1（実測）', mikomi: '30分', startedAt: now - 300, statAt: now - 300, at: now },
  '手待ち':   { stat: '手待ち', subj: 'パネルの守り-1', mikomi: '', startedAt: 0, statAt: now - 100, at: now },
  'ヨシ待ち': { stat: 'ヨシ待ち', subj: 'パネルの守り-1', mikomi: '', startedAt: 0, statAt: now - 100, at: now },
  '異常':     { stat: '異常', subj: 'パネルの守り-1', mikomi: '', startedAt: 0, statAt: now - 100, at: now }
};

/* ---- ① 構文 ---- */
head('① 構文');
{
  const blocks = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  let n = 0, ngc = 0;
  for (const b of blocks) {
    if (!b.trim()) { continue; }
    n++;
    try { new vm.Script('(function(){\n' + b + '\n})', { filename: 'panel.html' }); }
    catch (e) { ngc++; ng('script の塊が読めない：' + e.message); }
  }
  if (!ngc) { ok('script の塊 ' + n + '件、どれも読める'); }
}

if (!BROWSER) {
  head('まとめ（返事パネルの検査）');
  note('ブラウザが無いので②〜⑥は測れなかった（落ちとは別）');
  console.log('');
  console.log(bad === 0 ? '全てPASS（測れなかった項目あり）' : ('FAIL ' + bad + '件'));
  process.exit(bad === 0 ? 0 : 1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-panelchk-'));
try {
  calibrate(tmp);
  note('額縁の較正 : 幅+' + padW + ' / 高さ+' + padH);

  /* ---- ② 四通りの状態 ---- */
  head('② 四通りの状態');
  const WANT = {
    '作業中':   /^作業中/,
    '手待ち':   /次の指示待ち/,
    'ヨシ待ち': /ヨシを返してください/,
    '異常':     null   /* 黄色の行は出ない決め。異常は札で出る */
  };
  /* ＊異常のときは**黄色の行には出ない**決め（状態の一行は三通りだけ）。異常は**札**で出るので、
       作り値にも異常の札を入れて、そちらを見る。 */
  const MIX_BAD = MIX.concat([N(now - 400, '🪟 異常です（手が要ります）', '窓が落ちています。開き直してください。')]);
  const seen = {};
  for (const k of Object.keys(ST)) {
    const r = run(tmp, { state: ST[k], notices: (k === '異常' ? MIX_BAD : MIX), settle: 1500 }, 390, 844);
    seen[k] = r;
    if (!r) { ng(k + '：測れない（目印が出ない）'); continue; }
    if (WANT[k]) {
      if (WANT[k].test(r.stText)) { ok(k + '：黄色の行「' + r.stText.slice(0, 34) + '」'); }
      else { ng(k + '：黄色の行が違う「' + r.stText.slice(0, 40) + '」'); }
    } else {
      const card = (r.cards || []).find(c => /異常/.test(c));
      if (r.stText && /作業中|次の指示待ち|ヨシを返して/.test(r.stText)) {
        ng('異常：黄色の行が別の状態を出している「' + r.stText.slice(0, 30) + '」');
      } else if (card) { ok('異常：札が出る「' + card.slice(0, 30) + '」');
      } else {
        /* **異常はパネルに出さない**で確定（2026-09-01 の裁定）。
             ＊異常は 🪟 の押し送りで直接鳴る形が既にある。パネルにも持つと二重になり、
               片方だけ古い・片方だけ出る、という食い違いの元になる。
             ＊よって黄色の行は 作業中／次の指示待ち／ヨシ待ち の三通りのままでよい。
               この枝は「出ていないこと」を確かめる側であって、落ちではない。 */
        note('異常：パネルには出さない（押し送りで知らせる）＝2026-09-01 裁定');
      }
    }
  }

  /* ---- ③ 残N／M件 と 束ねて写る件数 ---- */
  head('③ まとめて写す（残N／M件と実際に写る数）');
  {
    /* 物差しは**三つ**。釦の「残N」・実際に写った数・**作り値の札の数**。
       ＊二つだけだと、数える側と束ねる側が同じ関数を見ているために
         「両方いっしょに減って辻褄が合う」形（種類の落としこぼし）を拾えない。
         作り値の札の数を第三の物差しに置いて、そこと突き合わせる。 */
    const WANT_N = MIX.length;
    const r = run(tmp, { state: ST['手待ち'], notices: MIX, press: true, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない（目印が出ない）'); }
    else if (r.btnRest === null) { ng('釦に「残N」が出ていない（字：' + r.beforeBtn + '）'); }
    else if (r.copied !== r.btnRest) {
      ng('残' + r.btnRest + '件と書いてあるのに、写ったのは ' + r.copied + '件（字：' + r.beforeBtn + '）');
    } else if (r.copied !== WANT_N) {
      ng('作り値は ' + WANT_N + '件（定時・順調・延び・ヨシ待ち・終わり）なのに、束ねたのは ' +
         r.copied + '件。種類を落としている疑い');
    } else {
      ok('作り値 ' + WANT_N + '件 ＝ 残' + r.btnRest + '件 ＝ 写った ' + r.copied + '件（種類を落としていない）');
      if (r.btnAll !== null) { note('釦の字 … ' + r.beforeBtn + ' → 押した後 ' + r.afterBtn); }
    }
  }

  /* ---- ④ iPhone の横と縦 ---- */
  head('④ iPhone の視野（横と縦）');
  for (const [vw, vh, nm] of [[667, 375, '横'], [844, 390, '横（大）'], [390, 844, '縦']]) {
    const r = run(tmp, { state: ST['作業中'], notices: MIX, settle: 1500 }, vw, vh);
    if (!r) { ng(nm + ' ' + vw + 'x' + vh + '：測れない'); continue; }
    if ((r.out || []).length) { ng(nm + ' ' + vw + 'x' + vh + '：横溢れ ' + r.out.length + '件（' + r.out[0] + '）'); }
    else { ok(nm + ' ' + vw + 'x' + vh + '：溢れ・重なりなし'); }
  }

  /* ---- ⑤ 状態の札の高さ ---- */
  head('⑤ 状態の札の高さ（題の長短で変わらない）');
  {
    const shortS = Object.assign({}, ST['作業中'], { subj: '短い題' });
    const longS  = Object.assign({}, ST['作業中'],
      { subj: 'パネルの守り-1（返事パネルを検査の網に入れて四通りの状態と束ねの件数と視野の溢れを見る）— panel v104' });
    const a = run(tmp, { state: shortS, notices: MIX, settle: 1500 }, 390, 844);
    const b = run(tmp, { state: longS,  notices: MIX, settle: 1500 }, 390, 844);
    /* 物差しは二つ。**題の長短で変わらないこと**と、**固定した高さそのもの**。
       ＊長短の比べだけでは、高さの固定を外しても「どちらも同じだけ縮む」ので拾えない
         （2026-09-01 の実測で分かった）。字面の min-height と突き合わせる。 */
    const mH = html.match(/li\.why\.stline\s*\{[^}]*min-height:\s*(\d+(?:\.\d+)?)px/);
    if (!mH) { ng('黄色の行に高さの固定（min-height）が無い'); }
    if (!a || !b) { ng('測れない'); }
    else if (a.stH === null || b.stH === null) { ng('黄色の行が見つからない'); }
    else if (Math.abs(a.stH - b.stH) > 0.5) {
      ng('題の長短で高さが変わる（短い ' + a.stH + 'px ／ 長い ' + b.stH + 'px）');
    } else if (mH && a.stH + 0.5 < Number(mH[1])) {
      ng('固定した高さ ' + mH[1] + 'px より低い（実測 ' + a.stH + 'px）。固定が効いていない');
    } else {
      ok('短い題 ' + a.stH + 'px ＝ 長い題 ' + b.stH + 'px' + (mH ? ('（固定 ' + mH[1] + 'px）') : ''));
    }
  }

  /* ---- ⑥ 終了予定の計算 ---- */
  head('⑥ 終了予定（ウィジェットと同じ計算）');
  {
    const st = ST['作業中'];
    const r = seen['作業中'] || run(tmp, { state: st, notices: MIX, settle: 1500 }, 390, 844);
    const mm = String(st.mikomi).match(/(\d+)/);
    let end = st.startedAt + parseInt(mm[1], 10) * 60;
    const nowS = Math.floor(Date.now() / 1000);
    const step = parseInt(mm[1], 10) * 60;
    let guard = 0;
    while (end <= nowS && guard < 200) { end += step; guard++; }
    const e = new Date(end * 1000);
    const want = e.getHours() + '時' + ('0' + e.getMinutes()).slice(-2) + '分終了予定';
    if (!r) { ng('測れない'); }
    else if (String(r.stText).indexOf(want) >= 0) { ok('黄色の行に「' + want + '」（開始＋見込みの計算が一致）'); }
    else { ng('終了予定が合わない（欲しい「' + want + '」／出た「' + String(r.stText).slice(0, 40) + '」）'); }
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

head('まとめ（返事パネルの検査）');
note('真似た台では拾えないもの … 公開側の遅れや詰まり／iOS Safari 固有の描き方（折り返し・字送り・慣性）／');
note('　実機の触り心地と、写しがクリップボードへ本当に入るか／ntfy の押し通知そのもの');
if (skipped) { note('測れなかった項目 ' + skipped + '件（落ちとは別）'); }
console.log('');
if (bad === 0) { console.log('全てPASS'); process.exit(0); }
console.log('FAIL ' + bad + '件');
process.exit(1);
