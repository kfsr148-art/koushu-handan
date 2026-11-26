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
 *   ⑦ 遠すぎる終了予定（前の仕事の開始を引きずった形）を、数字にせず「未定」と出す
 *   ⑧ 値の入っていない使用量を 0% として描かず、控えがあれば刻を添えて出す
 *   ⑨ 黄色の行のうち終了予定の刻だけが別色（明るい水色）で、地とのコントラスト比が 4.5 以上
 *   ⑩ まとめて写すが札と通知の両方を束ね、刻の順で一枚に写す（押す所は一つ）
 *   ⑪ 長い報告の札を、まとめて写すが割らずに一枚で写す
 *   ⑫ 本文の全行（5行）が写しへ入る（写しの絞りで落ちるのはファイルの行だけ）
 *   ⑬ 板の取得が転んでも、前に読めた値を捨てない
 *   ⑭ 通知の印は札に掛からない／黄色の行に終わった題／釦の下に写せる札の目次
 *   ⑮ 札だけの回の通し（残3／3件→押して0・写しに本文全部・題・目次）
 *   ⑯ 釦の残N／M件・目次の行数・写せますの札の N が、中身のある札の数で揃う
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

const STATIC = process.argv.indexOf('--static') >= 0;   // 2026-11-20 枠K：ブラウザを使わない部分だけを秒で回す（押す前に手元で。全部＝ブラウザ込みは手元で13〜16分かかるので雲に任せる）
const ARG_SRC = process.argv.slice(2).filter(a => a.indexOf('--') !== 0)[0];
const SRC = ARG_SRC ? path.resolve(ARG_SRC) : path.join(__dirname, 'panel.html');
const MARK = 'PANELCHK-B64:';
const html = fs.readFileSync(SRC, 'utf8');
/* v210（本人の枠 七十四）：数え方と字の組み立ては panel-core.js 一つ（panel.html は <script src> で読み、panel-view.js は require する）。
   検査は panel.html の包み（端末の値を渡すだけの関数）を切り出し、同じ panel-core.js を window.PanelCore として渡して回す。 */
const CORE_FILE = path.join(path.dirname(SRC), 'panel-core.js');
const PCORE = require(CORE_FILE);
const WIN = { PanelCore: PCORE };
/* 関数を一つ切り出す。一行で閉じる関数（包み）はその一行、そうでなければ次の「改行＋字下げ＋}」まで（改行の混ざりは揃えてから渡す） */
function cutFn(src, name, ind) {
  ind = (ind == null) ? '  ' : ind;
  const LF = String.fromCharCode(10), a = src.indexOf(ind + 'function ' + name + '(');
  if (a < 0) { return ''; }
  const le = src.indexOf(LF, a), first = src.slice(a, le < 0 ? src.length : le).replace(/\r$/, '');
  if (first.split('{').length === first.split('}').length && /\}/.test(first)) { return first; }
  const b = src.indexOf(LF + ind + '}', a);
  return (b > a) ? src.slice(a, b + ind.length + 2) : '';
}

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
const BROWSER = STATIC ? null : findBrowser();

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
  /* 通知だけ写した状態を作れるようにする（2026-09-03・パネルの立て直し-1）。 */
  try { if (S.ntfyCopied) { localStorage.setItem('ntfyCopied.v1', JSON.stringify(S.ntfyCopied)); } } catch (e) {}
  var CAP = { clip: null };
  var boardHits = 0;
  var J = function (o) {
    return Promise.resolve({ ok: true, status: 200,
      json: function () { return Promise.resolve(o); },
      text: function () { return Promise.resolve(typeof o === 'string' ? o : JSON.stringify(o)); } });
  };
  window.fetch = function (u) {
    u = String(u);
    if (u.indexOf('panel-ver.txt') >= 0) return J(String(S.panelVer || '104'));
    if (u.indexOf('notices.json') >= 0)  { window.__noticeHits = (window.__noticeHits || 0) + 1; return J(S.notices || []); }
    if (u.indexOf('board.json') >= 0) {
      /* S.boardFailAfter 回目から先は取得そのものを失敗させる（v113・板の欠け-1）。
         iPhone の「Load failed」と同じ、fetch が転ぶ形を作る。 */
      boardHits++;
      if (typeof S.boardFailAfter === 'number' && boardHits > S.boardFailAfter) { return Promise.reject(new Error('Load failed')); }
      return J(S.board || { waiting: [], recent: [] });
    }
    if (u.indexOf('seen.json') >= 0)     return J({ upto: S.seen || 0 });
    if (u.indexOf('state.json') >= 0)    return J(S.state || {});
    if (u.indexOf('ntfy-sent.json') >= 0) {
      if (S.ntfy === null) { return Promise.resolve({ ok: false, status: 404, json: function () { return Promise.resolve(null); } }); }
      return J(S.ntfy || []);
    }
    if (u.indexOf('usage.json') >= 0)    return J(S.usage || {});
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

  /* 釦を押して、写しへ入った字を拾う（v109・通知のコピー-1）。
     ＊押したあとの取得と写しは非同期なので、settle のあいだ待ってから測る。 */
  function pressNtfy() {
    var b = document.getElementById('btnCopyNtfy');
    if (b) { b.click(); }
  }

  function measure() {
    var o = { w: window.innerWidth, h: window.innerHeight };
    /* 黄色の行（状態の一行）と、その箱の高さ */
    var st = document.getElementById('stLine');
    var pbx = document.getElementById('progBox');   /* v186：見込みとゲージは #progBox へ移った。両方を合わせて読む */
    o.stText = (txt(pbx) + ' ' + txt(st)).trim();
    /* v183：下の三行の詰まり。見えている行の上下の座標・包みの高さと並べ方・横溢れ */
    (function () { var g = document.getElementById('footGroup'); o.footGroup = !!g; if (!g) { return; } var gs = getComputedStyle(g); o.footDisp = gs.display; o.footJust = gs.justifyContent; o.footH = g.getBoundingClientRect().height; o.footFixedH = (g.style.height || '') !== '';
      o.footLines = [].slice.call(g.children).filter(function (e) { return !e.hidden && e.getBoundingClientRect().height > 0; }).map(function (e) { var r = e.getBoundingClientRect(); return { id: e.id, top: r.top, bottom: r.bottom, h: r.height, w: r.width, mt: parseFloat(getComputedStyle(e).marginTop) || 0, mb: parseFloat(getComputedStyle(e).marginBottom) || 0 }; });
      o.docOverflow = document.documentElement.scrollWidth > window.innerWidth + 1; })();
    /* v184：下の並び（HTML の順そのもの）。見える物の文書順・上端・CSS の order・横溢れ */
    (function () { var ids = ['usageTag', 'progBox', 'btnSteps', 'btnShots', 'btnCopyUrl', 'fVer', 'verTag', 'footGroup']; var els = ids.map(function (i) { return document.getElementById(i); }); if (els.some(function (e) { return !e; })) { o.ordMissing = ids.filter(function (i, k) { return !els[k]; }).join('・'); return; }
      var sorted = els.slice().sort(function (a, b) { return (a.compareDocumentPosition(b) & 4) ? -1 : 1; }); o.ordDoc = sorted.map(function (e) { return e.id; }).join('>');
      o.ordCss = els.map(function (e) { return getComputedStyle(e).order !== '0' ? e.id + ':' + getComputedStyle(e).order : ''; }).filter(Boolean).join(','); o.ordTops = els.map(function (e) { return Math.round(e.getBoundingClientRect().top); });
      o.ordOverflow = document.documentElement.scrollWidth > window.innerWidth + 1; })();
    /* v185：手順のゲージ（使用量の三本と同じ見た目か）。区切りの数・済み・今・小さい N/M・高さ・幅・横溢れ */
    (function () { var g = document.querySelector('#progBox .stg'); if (!g) { return; } var is = [].slice.call(g.querySelectorAll('.stg-bar i')); o.gSegs = is.length; o.gDone = is.filter(function (e) { return e.className === 'd'; }).length; o.gCur = is.map(function (e) { return e.className; }).indexOf('c'); o.gLabel = txt(g.querySelector('.stg-n')); var b = g.querySelector('.stg-bar').getBoundingClientRect(); o.gBarW = b.width; o.gBarH = b.height; o.gBg = is.map(function (e) { return getComputedStyle(e).backgroundColor; }); o.gRad = getComputedStyle(is[0]).borderTopLeftRadius; var ub = document.querySelector('.usage .u-bar'); o.uBarH = ub ? ub.getBoundingClientRect().height : -1; o.uRad = ub ? getComputedStyle(ub).borderTopLeftRadius : ''; o.gOver = g.scrollWidth > g.clientWidth + 1 || document.documentElement.scrollWidth > window.innerWidth + 1; })();
    /* v186：見込みとゲージの箱（#progBox）。見出しの直後・一つの箱・行の数・出る／出ない・iPhone の幅 */
    (function () { var b = document.getElementById('progBox'); o.pbExists = !!b; if (!b) { return; } var cs = getComputedStyle(b), r = b.getBoundingClientRect(); o.pbShown = cs.display !== 'none' && r.height > 0; o.pbPrev = (b.previousElementSibling && b.previousElementSibling.tagName) || ''; o.pbRows = b.querySelectorAll('.pb').length; o.pbEta = !!b.querySelector('.m.eta'); o.pbGauge = !!b.querySelector('.stg'); o.pbBorder = parseFloat(cs.borderTopWidth) || 0; o.pbW = r.width; o.pbLeft = r.left; o.pbRight = r.right; o.pbTop = r.top; var hd = document.querySelector('header'); o.pbHeadBottom = hd ? hd.getBoundingClientRect().bottom : -1; o.pbOver = document.documentElement.scrollWidth > window.innerWidth + 1 || b.scrollWidth > b.clientWidth + 1; })();
    /* v187：遠隔と終わりました N件 の二つ並び・写し取り一覧／直近に終わった仕事／様子を写す の三つ並び */
    (function () { function R(id) { var e = document.getElementById(id); if (!e) { return null; } var r = e.getBoundingClientRect(); var vis = getComputedStyle(e).display !== 'none' && r.width > 0 && r.height > 0; return vis ? { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height } : null; }
      o.rcR = R('rcLink'); o.doneR = R('doneHead'); o.stepsR = R('btnSteps'); o.stepsIn = !!document.querySelector('#halfRow > #btnSteps'); (function () { var e = document.getElementById('btnSteps'), d = document.getElementById('doneHead'); o.stepsSpill = !!(e && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1)); o.doneSpill = !!(d && d.scrollWidth > d.clientWidth + 1); })(); o.hTitleR = R('hTitle'); o.statR = R('stat'); o.seenR = R('fSeen'); o.statTxt = (document.getElementById('stat') || {}).textContent || ''; o.catR = R('runcat'); o.hTitleSpill = (function () { var e = document.getElementById('hTitle'); return !!(e && (e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().height > 40)); })(); o.shR = R('btnShots'); o.recR = R('btnRecent'); o.urlR = R('btnCopyUrl');
      var hr = document.getElementById('halfRow'); o.halfInHeader = !!(document.querySelector('header') && document.querySelector('header').querySelector('#rcLink')); o.halfExists = !!hr;
      o.btnOver = document.documentElement.scrollWidth > window.innerWidth + 1;
      o.halfDump = ['rcLink', 'doneBox', 'doneHead'].map(function (id) { var e = document.getElementById(id); if (!e) { return id + ':無し'; } var s = getComputedStyle(e); return id + '{w' + Math.round(e.getBoundingClientRect().width) + ',pad' + s.paddingLeft + '/' + s.paddingRight + ',bs:' + s.boxSizing + ',flex:' + s.flex + ',mar' + s.marginLeft + '/' + s.marginRight + '}'; }).join(' '); })();
    /* 視野の幅が言った幅より広がった時のために、右端が一番外にある要素を三つ控える（どこが溢れているかを辿る） */
    (function () { var all = [].slice.call(document.body.querySelectorAll('*')).filter(function (e) { var r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; }); all.sort(function (a, b) { return b.getBoundingClientRect().right - a.getBoundingClientRect().right; }); o.rightmost = all.slice(0, 3).map(function (e) { return e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ').join('.') : '') + '@' + Math.round(e.getBoundingClientRect().right) + '/w' + Math.round(e.getBoundingClientRect().width); }); })();
    /* v188：札まとめ中の頭の字（#headWait）の class・色・札の取得の数 */
    o.hwText = (function () { var h = document.getElementById('headWait'); return h ? (h.getAttribute('data-label') || txt(h)) : ''; })(); o.hwAct = txt(document.getElementById('headWait'));   /* v267：hwText は元の状態の字（data-label）・hwAct は本人が今する事の字 */ o.coreVer = (window.PanelCore && window.PanelCore.VER) || '';   /* v210：頭の字と、読めた panel-core.js の版 */
    (function () { var hw = document.getElementById('headWait'); o.hwCls = hw ? hw.className : ''; o.hwColor = hw ? getComputedStyle(hw).color : ''; o.hwWeight = hw ? getComputedStyle(hw).fontWeight : ''; o.noticeHits = window.__noticeHits || 0; })();
    o.evTag = txt(document.getElementById('evTag')); o.footTag = txt(document.getElementById('footTag')); o.footHidden = !!(document.getElementById('footTag') || {}).hidden;   /* v181 */
    o.stBad = [].map.call([].concat([].slice.call(pbx ? pbx.querySelectorAll('p.m.bad') : []), [].slice.call(st ? st.querySelectorAll('p.m.bad') : [])), function (x) { return x.textContent; }).join('／');   /* v180：赤の行 */
    /* 黄色の行の色（v108・パネルの色-1）。刻だけ別色にしてあるので、二つ測る。
       ＊地の色は、行の箱（li）から取る。CSS の字面ではなく**描かれた実際の色**を見る。 */
    o.stColor = st ? getComputedStyle(st.querySelector('p.m') || st).color : null;
    /* 通知の本文を写す釦（v109） */
    var bn = document.getElementById('btnCopyNtfy');
    o.ntfyBtn = bn ? txt(bn) : null;
    o.ntfyShown = vis(bn);
    var pr = st ? st.querySelector('.pred') : null;
    o.predText  = pr ? String(pr.textContent || '').trim() : '';
    o.predColor = pr ? getComputedStyle(pr).color : null;
    var li = st ? st.querySelector('li') : null;
    o.stBg = li ? getComputedStyle(li).backgroundColor : null;
    o.boardText = txt(document.getElementById('board'));
    /* 写せる札の目次と、札の印そのもの（v115） */
    var tl = document.getElementById('todoList');
    o.todoText = tl ? String(tl.innerText || '').replace(/s+/g, ' ').trim() : '';
    o.todoRows = tl ? tl.querySelectorAll('li').length : 0;
    o.btnHidden = (function () { var bb = document.getElementById('btnCopyBoard'); return bb ? bb.hidden : null; })();
    try { o.cardMarks = localStorage.getItem('kh-panel-copied') || ''; } catch (e) { o.cardMarks = ''; }
    o.ntfyClip = CAP.clip;
    o.ntfyBtn2 = bn ? txt(bn) : null;
    o.stH = st ? Math.round(st.getBoundingClientRect().height * 10) / 10 : null;
    /* 題の行の三つ目（2026-09-13・頭の猫-4）。ヨシ待ちの字はここへ移った。 */
    /* v173：遠隔の釦（字・はみ出し）と、消した「遠隔：」の行 */
    var rcA = document.getElementById('rcLink'), rcT = document.getElementById('rcTag');
    o.rcText = rcA ? String(rcA.textContent || '').trim() : ''; o.rcShown = vis(rcA); o.rcSW = rcA ? rcA.scrollWidth : 0; o.rcCW = rcA ? rcA.clientWidth : 0; o.rcTagShown = rcT ? !rcT.hidden : false;
    /* 字そのものの幅（headless の窓はスマホの幅まで縮まないので、釦の実測ではなく字の幅と釦の内側の幅の計算で比べる） */
    /* v175：釦を各スマホの幅（外の余白28pxを引いた幅）に絞り、折り返し込みで字が釦から溢れないか・「…」で切っていないかを見る（字の幅は電話と雲で違うので測って比べない） */
    o.rcFit = []; if (rcA) { var cs0 = getComputedStyle(rcA); o.rcEllipsis = (cs0.textOverflow === 'ellipsis'); var w0 = rcA.style.width; [390, 375, 360, 320].forEach(function (W) { rcA.style.width = (W - 28) + 'px'; var top = rcA.querySelector('.rc-top'), sub = rcA.querySelector('.rc-sub'); var over = (rcA.scrollWidth > rcA.clientWidth + 1) || (rcA.scrollHeight > rcA.clientHeight + 1); [top, sub].forEach(function (e) { if (e && (e.scrollWidth > e.clientWidth + 1)) { over = true; } }); o.rcFit.push({ w: W, over: over, h: Math.round(rcA.getBoundingClientRect().height), subLines: sub ? Math.round(sub.getBoundingClientRect().height / 16) : 0 }); }); rcA.style.width = w0; o.rcTop = (rcA.querySelector('.rc-top') || {}).textContent || ''; o.rcSub = (rcA.querySelector('.rc-sub') || {}).textContent || ''; }
    var hw = document.getElementById('headWait');
    o.headWait = hw ? String(hw.getAttribute('data-label') || hw.textContent || '').trim() : null;   /* v267：元の状態の字（data-label）で測る */
    o.headAct = hw ? String(hw.textContent || '').trim() : null; o.headActColor = hw ? hw.getAttribute('data-c') : null;
    o.headWaitColor = hw ? getComputedStyle(hw).color : null;
    o.headWaitSize = hw ? getComputedStyle(hw).fontSize : null;
    /* 使用量の三行と、その足元の一行 */
    o.uText = txt(document.getElementById('usageTag'));
    o.uShown = vis(document.getElementById('usageTag'));
    o.uMsg  = txt(document.getElementById('usageMsg'));
    o.uWhen = txt(document.getElementById('usageWhen'));
    /* 板に出ている札の題（異常の札などを見る） */
    var bd = document.getElementById('board');
    o.cards = [];
    if (bd) {
      var lis = bd.querySelectorAll('li');
      for (var i = 0; i < lis.length && i < 12; i++) { o.cards.push(txt(lis[i]).slice(0, 40)); }
    }
    /* 釦の字 */
    var btn = document.getElementById('btnCopyBoard');
    o.btn = btn ? (btn.getAttribute('aria-label') || txt(btn)) : '';   /* v211：見える字は二行（まとめて写す／N件）。字（todoLabel）は aria-label に入る */
    o.cbTop = btn ? txt(btn.querySelector('.cb-top')) : ''; o.cbSub = btn ? txt(btn.querySelector('.cb-sub')) : ''; o.cbDisabled = btn ? !!btn.disabled : null; o.cbBg = btn ? getComputedStyle(btn).backgroundColor : '';
    o.b8 = ['rcLink', 'doneBox', 'btnSteps', 'btnCopyBoard', 'btnShots', 'btnRecent', 'btnCopyUrl', 'btnPoint'].map(function (id) { var e = document.getElementById(id); if (!e) { return null; } var r = e.getBoundingClientRect(), cs = getComputedStyle(e); return { id: id, l: Math.round(r.left * 10) / 10, t: Math.round((r.top + window.scrollY) * 10) / 10, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, disp: cs.display, vis: cs.visibility, fs: cs.fontSize }; });   /* v211：底の八つの場所（文書の上からの座標） */
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
      /* 通知の本文を写す釦（v109・通知のコピー-1）。押してから写しを拾う。 */
      if (S.pressNtfy) {
        pressNtfy();
        setTimeout(function () {
          o.ntfyClip = CAP.clip;
          o.ntfyBtn2 = txt(document.getElementById('btnCopyNtfy'));
          out2(o);
        }, 900);
        return;
      }
      if (S.point) {   /* v191：指さす。押す→幕と案内→下の釦の上を押しても動かない→様子を写すの上を押す→写る→戻る→もう一度押してやめる */
        var bp = document.getElementById('btnPoint'), cb = document.getElementById('btnCopyBoard'), v = document.getElementById('pointVeil'), clicks = 0;
        if (cb) { cb.addEventListener('click', function () { clicks++; }); }
        var rr = function (id) { var e = document.getElementById(id); if (!e) { return null; } var b = e.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height }; };
        o.pBtn = { shots: rr('btnShots'), rec: rr('btnRecent'), url: rr('btnCopyUrl'), point: rr('btnPoint') }; o.pOver = document.documentElement.scrollWidth > window.innerWidth + 1;
        if (bp) { bp.click(); }
        setTimeout(function () {
          var vr = v.getBoundingClientRect(), cs = getComputedStyle(v);
          o.pVeil = { hidden: v.hidden, parent: v.parentElement && v.parentElement.tagName, w: vr.width, h: vr.height, pos: cs.position, ta: cs.touchAction, alpha: cs.backgroundColor };
          o.pBanner = txt(document.getElementById('pointBanner')); o.pBodyCls = document.body.className; o.pLabel = txt(bp);
          var cr = cb.getBoundingClientRect(); v.dispatchEvent(new MouseEvent('click', { clientX: cr.left + 3, clientY: cr.top + cr.height / 2, bubbles: true }));   /* 下の釦（まとめて写す）の上を押す */
          o.pBoardClicks1 = clicks; o.pClipAfterBoard = CAP.clip;
          var ur = document.getElementById('btnCopyUrl').getBoundingClientRect();
          if (document.getElementById('pointVeil').hidden) { bp.click(); }
          v.dispatchEvent(new MouseEvent('click', { clientX: ur.left + ur.width / 2, clientY: ur.top + ur.height / 2, bubbles: true }));   /* 様子を写すの上を押す */
          setTimeout(function () {
            o.pClip = String(CAP.clip || ''); o.pVeilHiddenAfter = v.hidden; o.pLabelAfter = txt(bp); o.pBodyClsAfter = document.body.className; o.pBoardClicks2 = clicks;
            bp.click(); o.pCancelOn = !v.hidden; bp.click(); o.pCancelOff = v.hidden;
            out2(o);
          }, 400);
        }, 200);
        return;
      }
      if (S.pressRecent) {   /* v187：直近に終わった仕事の釦（箱ごと押して写す） */
        var rbt = document.getElementById('btnRecent'); o.recBefore = txt(rbt); if (rbt) { rbt.click(); }
        setTimeout(function () { o.recAfter = txt(rbt); o.recClip = String(CAP.clip || ''); var sb = document.getElementById('shelfBox'); o.shelfOpen = !!(sb && !sb.hidden); o.shelfText = sb ? txt(sb) : ''; if (rbt) { rbt.click(); } o.shelfClosed = !!(sb && sb.hidden); out2(o); }, 700);
        return;
      }
      if (S.press) {
        var btn = document.getElementById('btnCopyBoard');
        o.beforeBtn = o.btn;
        if (btn) { btn.click(); }
        setTimeout(function () {
          o.afterBtn = txt(btn);
          o.copied = countCards(CAP.clip);
          o.clipLen = CAP.clip ? CAP.clip.length : 0;
          o.clip = String(CAP.clip || '').slice(0, 4000);   /* 貼る字そのもの（絞りを見るため） */
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
  fs.copyFileSync(CORE_FILE, path.join(tmp, 'panel-core.js'));   /* v210：公開と同じく、隣の panel-core.js を <script src> で読ませる（中に埋めない） */
  /* 2026-11-20 本人の枠：幅は --window-size でなく DevTools の Emulation.setDeviceMetricsOverride（mobile:true）で与える（cdp-run.js）。
     ＊--window-size だと headless の Chrome／Edge は約500pxより狭くできず、iPhone 幅（390・375・320）を一度も試していなかった。 */
  let out = '';
  try {
    out = execFileSync(process.execPath, [path.join(__dirname, 'cdp-run.js'), BROWSER, f, String(vw), String(vh), tmp, '40'],
      { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 120000, windowsHide: true });
  } catch (e) { out = String((e && e.stdout) || ''); }
  const m = new RegExp(MARK + '([A-Za-z0-9+/=]+)').exec(out);
  if (!m) { return null; }
  const res = JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'));
  /* 視野の幅が言った幅と合わなければ落とす（2026-11-20）。合わないまま「iPhone 幅で崩れない」と言わないため。 */
  if (typeof res.w === 'number' && res.w !== vw) { ng('視野の幅が言った幅と合わない（言った ' + vw + '・innerWidth ' + res.w + '・右端の要素 ' + (res.rightmost || []).join(' ／ ') + '）'); }
  return res;
}

/* ---- 作り値 ---- */
const now = Math.floor(Date.now() / 1000);
const N = (t, title, msg) => ({ time: t, title: title, message: msg });
const MIX = [
  N(now - 900, '🕘 定時の報せ', '状態: 手待ち'),
  N(now - 800, '😺 現在も順調にゃ', '状態: 作業中'),
  N(now - 700, '🕒 延びています', '終了予定を過ぎています（経過62分）'),
  N(now - 600, '🙋 ヨシしてください', 'パネルの守り-1 の実測をご確認ください'),
  N(now - 500, '✅ 終わりました（返事不要）', 'パネルの守り-1（実測）／中身のある札')   /* v116：写せますの札は数にも束にも入らないので、中身のある札にした */
];
/* 使用量の作り値（2026-09-02・使用量の空振り-1）。
   ＊読める … 戻る刻の入った本文。三行に数字が出る。
   ＊空・控えあり … 全枠 0 ／ resets_at が null（実物の 06:04 と同じ形）。控えの値を出す。
   ＊空・控えなし … 同上で控えが無い。数字を出さず「取れていません」と言う。 */
const U_LIM = (pc) => ([
  { kind: 'session',       group: 'session', percent: pc[0], resets_at: new Date((now + 3600) * 1000).toISOString() },
  { kind: 'weekly_all',    group: 'weekly',  percent: pc[1], resets_at: new Date((now + 86400) * 1000).toISOString() },
  { kind: 'weekly_scoped', group: 'weekly',  percent: pc[2], resets_at: new Date((now + 86400) * 1000).toISOString(),
    scope: { model: { display_name: 'Fable' } } }
]);
const U_BODY_OK = { five_hour: { utilization: 21, resets_at: new Date((now + 3600) * 1000).toISOString() },
                    seven_day: { utilization: 11, resets_at: new Date((now + 86400) * 1000).toISOString() },
                    limits: U_LIM([21, 11, 5]) };
const U_BODY_EMPTY = { five_hour: { utilization: 0, resets_at: null },
                       seven_day: { utilization: 0, resets_at: null },
                       limits: [{ kind: 'session', group: 'session', percent: 0, resets_at: null },
                                { kind: 'weekly_all', group: 'weekly', percent: 0, resets_at: null }] };
const U_OK    = { at: new Date(now * 1000).toISOString(), http: 200, empty: false, body: U_BODY_OK, good: { at: new Date(now * 1000).toISOString(), body: U_BODY_OK } };
const U_HELD  = { at: new Date(now * 1000).toISOString(), http: 200, empty: true,  body: U_BODY_EMPTY, good: { at: new Date((now - 7200) * 1000).toISOString(), body: U_BODY_OK } };
const U_NONE  = { at: new Date(now * 1000).toISOString(), http: 200, empty: true,  body: U_BODY_EMPTY, good: null };

const ST = {
  '作業中':   { stat: '作業中', subj: 'パネルの守り-1（実測）', mikomi: '30分', startedAt: now - 300, statAt: now - 300, at: now },
  '手待ち':   { stat: '手待ち', subj: 'パネルの守り-1', mikomi: '', startedAt: 0, statAt: now - 100, at: now },
  'ヨシ待ち': { stat: 'ヨシ待ち', subj: 'パネルの守り-1', mikomi: '', startedAt: 0, statAt: now - 700, at: now },
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

/* ---- 状態の決め所（state-decide.js）の総当たり（2026-11-19 本人の枠⑥）：ヨシ待ち→止まり→作業中→検査中→待ち→待機中の順と中身 ---- */
{
  head('雲の検査の振り分け（scope-pick-test.js）：差がパネルとウィジェットだけなら本体の検査を飛ばす');
  {
    const r1 = require('child_process').spawnSync(process.execPath, [path.join(path.dirname(SRC), 'scope-pick-test.js')], { encoding: 'utf8', timeout: 60000 });
    const t1 = String(r1.stdout || '').trim().split(String.fromCharCode(10)).slice(-6).join(' ／ ');
    if (r1.status === 0) { ok(t1); } else { ng('雲の検査の振り分けの作り値が合わない（' + t1.slice(0, 200) + '）'); }
  }
  head('台帳の数え手（orders-count-test.js）');
  {
    const r0 = require('child_process').spawnSync(process.execPath, [path.join(path.dirname(SRC), 'orders-count-test.js')], { encoding: 'utf8', timeout: 60000 });
    const t0 = String(r0.stdout || '').trim().split(String.fromCharCode(10)).slice(-6).join(' ／ ');
    if (r0.status === 0) { ok(t0); } else { ng('台帳の数え手の作り値が合わない（' + t0.slice(0, 200) + '）'); }
  }
  head('状態の決め所の総当たり（state-decide-test.js）');
  const r = require('child_process').spawnSync(process.execPath, [path.join(path.dirname(SRC), 'state-decide-test.js')], { encoding: 'utf8', timeout: 60000 });
  const last = String(r.stdout || '').trim().split(/\r?\n/).pop() || '';
  if (r.status === 0) { ok(last); } else { ng(last || ('起こせなかった：' + (r.error ? r.error.message : r.status))); String(r.stdout || '').split(/\r?\n/).filter(l => /^NG/.test(l)).slice(0, 10).forEach(note); }
}

/* ブラウザを使わない部分（作り値と字面）。通常の回でも --static の回でも同じ物を回す。 */
function staticParts() {
  /* ---- ⑤の十二 まとめて写すの頭の現況（v196・枠G）：状態の言葉＋終わる見込みの刻（件名の頭の一語でなく） ---- */
  head('⑤の十二 まとめて写すの頭の現況は状態の言葉と見込みの刻（作り値・字面）');
  {
    const i0 = html.indexOf('  function nowLine(withEta) {');
    const j0 = i0 >= 0 ? html.indexOf(String.fromCharCode(10) + '  }', i0) : -1;
    const fsrc = (i0 >= 0 && j0 > i0) ? html.slice(i0, j0 + 4) : '';
    if (!fsrc) { ng('nowLine(withEta) が無い'); }
    else {
      const mk = (stat, kumo, eta, wordv) => new Function('lastStat', 'lastKumo', 'lastState', 'etaLineText', 'honVer', 'stbVer', 'hhmm', 'cardsPending', fsrc + String.fromCharCode(10) + 'return nowLine;')(stat, kumo, { word: wordv, since: '', at: 1 }, () => eta, '1', '1', () => '00:00', () => !!globalThis.__cardsPendingTest);
      const a = mk('作業中', '', '終わる見込み 17:45（あと12分）', '台帳')(true);
      if (a.indexOf('現況：作業中・終わる見込み 17:45（あと12分）') === 0 && a.indexOf('台帳') < 0) { ok('作業中：頭は「現況：作業中・終わる見込み HH:MM」で、件名の頭の一語（台帳）は出ない'); } else { ng('作業中の現況の頭が違う：' + a.slice(0, 60)); }
      const b = mk('手待ち', '検査中：panel v196（見込み 17:30）', '終わる見込み 17:30（あと3分）', '次の指示待ち')(true);
      if (b.indexOf('現況：手待ち（検査中）・終わる見込み 17:30') === 0) { ok('手待ち＋雲待ち：「手待ち（検査中）・終わる見込み」'); } else { ng('手待ち＋雲待ちの現況が違う：' + b.slice(0, 60)); }
      const c2 = mk('手待ち', '', 'なし（作業も待ちも無い）', '次の指示待ち')(true);
      if (c2.indexOf('現況：手待ち ／ ') === 0) { ok('見込みが無い時は見込みの字を足さない'); } else { ng('見込みなしの現況が違う：' + c2.slice(0, 60)); }
      globalThis.__cardsPendingTest = true;
      const cp1 = mk('手待ち', '', '終わる見込み 20:30（あと2分）', '次の指示待ち')(true);
      if (cp1.indexOf('現況：札まとめ中・') === 0) { ok('止まってから札が載るまでの間は、現況も「札まとめ中」（待機中・手待ちでなく）'); } else { ng('札まとめ中の現況が違う：' + cp1.slice(0, 40)); }
      const cp2 = mk('作業中', '', '終わる見込み 20:30（あと2分）', '台帳')(true);
      if (cp2.indexOf('現況：作業中') === 0) { ok('作業中は札まとめ中にならない'); } else { ng('作業中の現況が変わった：' + cp2.slice(0, 40)); }
      globalThis.__cardsPendingTest = false;
      const cp3 = mk('手待ち', '', 'なし（作業も待ちも無い）', '次の指示待ち')(true);
      if (cp3.indexOf('現況：手待ち') === 0) { ok('札が載った後（印なし）は今までどおり「手待ち」'); } else { ng('札が載った後の現況が違う：' + cp3.slice(0, 40)); }
      const tk = mk('待ち', '時計：橋の枠 二・起きる刻 19:48', '終わる見込み 19:48（あと0分）', '次の指示待ち')(true);
      if (tk.indexOf('現況：待ち（時計）・') === 0) { ok('時計の待ちの現況は「待ち（時計）」'); } else { ng('時計の待ちの現況が違う：' + tk.slice(0, 40)); }
      const kc = mk('待ち', '雲：検査・見込み 19:48', 'なし（作業も待ちも無い）', '次の指示待ち')(true);
      if (kc.indexOf('現況：待ち（雲）') === 0) { ok('雲の待ちは今までどおり「待ち（雲）」'); } else { ng('雲の待ちの現況が変わった：' + kc.slice(0, 40)); }
      const d = mk('作業中', '', 'x', '台帳')(false);
      if (d.indexOf('現況：台帳') === 0) { ok('様子を写す（withEta なし）は今までの形のまま'); } else { ng('様子を写すの形が変わった：' + d.slice(0, 40)); }
    }
    if (html.split('nowLine(true)').length === 3) { ok('まとめて写す・全部写すの二箇所が withEta で呼ぶ'); } else { ng('nowLine(true) の呼びが二箇所でない'); }
  }
  /* ---- ⑤の十三 様子を写すの順番待ち一覧・指さすの帯の名（v197・枠J） ---- */
  head('⑤の十三 様子を写すに順番待ちを一行ずつ・指さすは帯の名を読む（作り値・字面）');
  {
    const sl = (name) => { const i = html.indexOf('  function ' + name + '('); if (i < 0) { return ''; } const j = html.indexOf(String.fromCharCode(10) + '  }', i); return (j > i) ? html.slice(i, j + 4) : ''; };
    const wsrc = sl('waitListLines');
    if (!wsrc) { ng('waitListLines が無い'); }
    else {
      const wl = new Function(wsrc + String.fromCharCode(10) + 'return waitListLines;')();
      const NL = String.fromCharCode(10);
      const a = wl({ wait: 2, waitList: [{ at: '11-20 14:19', head: '見込みの種類は走りの jobs から' }, { at: '11-20 14:23', head: '順番待ちを見えるようにする' }] });
      if (a === '順番待ち：11-20 14:19　見込みの種類は走りの jobs から' + NL + '順番待ち：11-20 14:23　順番待ちを見えるようにする') { ok('順番待ち：〈届いた刻〉〈件名〉を一行ずつ'); } else { ng('順番待ちの行の形が違う：' + a.slice(0, 80)); }
      if (wl({ wait: 0 }) === '順番待ち：なし') { ok('0件は「順番待ち：なし」'); } else { ng('0件の字が違う'); }
      if (/言い切れない/.test(wl({}))) { ok('数が無い（言い切れない）時はその旨'); } else { ng('言い切れない時の字が無い'); }
      if (/一覧は state に載っていない/.test(wl({ wait: 3 }))) { ok('数だけ有って一覧が無い時はその旨'); } else { ng('一覧が無い時の字が無い'); }
      if (/ほか 5件$/.test(wl({ wait: 7, waitList: [{ at: 'a', head: 'b' }, { at: 'c', head: 'd' }], waitMore: 5 }))) { ok('一覧が長い時は「ほか N件」'); } else { ng('「ほか N件」が無い'); }
    }
    if (html.indexOf('<header data-pname="見出しの帯">') >= 0) { ok('見出しの帯（header）に名（data-pname）がある'); } else { ng('header に data-pname が無い'); }
    const pc = sl('pointClean') || '', pn = sl('pointName');
    const pc1 = html.indexOf('  function pointClean('), pc2 = html.indexOf(String.fromCharCode(10), pc1);
    if (!pn) { ng('pointName が無い'); }
    else {
      const fake = (sel) => ({ id: '', tagName: 'HEADER', className: '', closest: (q) => (q === '[data-pname]' ? { getAttribute: () => '見出しの帯' } : null), textContent: '' });
      const f = new Function(html.slice(pc1, pc2) + String.fromCharCode(10) + pn + String.fromCharCode(10) + 'return pointName;')();
      const nm = f(fake());
      if (nm === '見出しの帯') { ok('指さす：帯の余白（header）を押すと「見出しの帯」と出る（「header」でなく）'); } else { ng('指さすの名が違う：' + nm); }
      const fake2 = { id: '', tagName: 'DIV', className: 'zzz', closest: () => null, textContent: '' };
      if (f(fake2) === 'div.zzz') { ok('どの名にも当たらない所だけ平たい名（タグ名.class）に落ちる'); } else { ng('平たい名への落ち方が違う'); }
    }
  }
  /* ---- ⑤の十四 着手から90秒以内の「見込み未記入」は赤くしない（v198・枠R） ---- */
  head('⑤の十四 着手の直後は「見込み未記入」を赤くしない（作り値・字面）');
  {
    const i0 = html.indexOf('  function etaLineText() {');
    const j0 = i0 >= 0 ? html.indexOf(String.fromCharCode(10) + '  }', i0) : -1;
    const fsrc = (i0 >= 0 && j0 > i0) ? html.slice(i0, j0 + 4) : '';
    if (!fsrc) { ng('etaLineText が無い'); }
    else {
      const NOW = Math.floor(Date.now() / 1000);
      const mk = (started, mikomiMin, raw) => new Function('lastStat', 'lastStartedAt', 'lastMikomiMin', 'lastMikomiRaw', 'pad2s', 'waitEtaRow', 'mkEndSec', fsrc + String.fromCharCode(10) + 'return etaLineText;')('作業中', started, mikomiMin, raw, (e) => '00:00', () => null, () => (mikomiMin > 0 ? started + mikomiMin * 60 : 0));   /* v213：終わりは mkEndSec（見込みを書いた刻＋見込み）一つ */
      const a = mk(NOW - 30, 0, '')();
      if (/記入待ち/.test(a) && !/未記入/.test(a)) { ok('着手30秒・見込みを書く前：赤い「見込み未記入」でなく「記入待ち」'); } else { ng('着手直後の字が違う：' + a); }
      const b = mk(NOW - 200, 0, '')();
      if (b === '見込み未記入') { ok('着手200秒（90秒を過ぎた）でも書かれていなければ「見込み未記入」'); } else { ng('90秒を過ぎた後の字が違う：' + b); }
      const c = mk(NOW - 30, 0, '不明')();
      if (c === '見込み不明') { ok('窓が「不明」と書いていれば、着手直後でも「見込み不明」'); } else { ng('「不明」の字が違う：' + c); }
      const d = mk(NOW - 30, 40, '40分')();
      if (/^終わる見込み /.test(d)) { ok('見込みが書かれていれば、いつでも「終わる見込み HH:MM」'); } else { ng('見込みありの字が違う：' + d); }
    }
    if (html.indexOf("{ t: '見込み 記入待ち（着手から90秒以内）', c: '' }") >= 0) { ok('手順のゲージの箱も、着手から90秒以内は赤くしない（c が空）'); } else { ng('箱の側の記入待ちが無い'); }
  }
  /* ---- ⑤の十五 センコが読んだ刻までの札と知らせは写した扱い（v200・橋の枠 六） ---- */
  head('⑤の十五 センコが読んだ刻（senkoReadAt）までの札と知らせは写した扱い（作り値・字面）');
  {
    const sl = (name) => { const i = html.indexOf('  function ' + name + '('); if (i < 0) { return ''; } const j = html.indexOf(String.fromCharCode(10), i); return html.slice(i, j); };
    const e1 = sl('senkoEpoch'), e2 = sl('senkoReadCovers');
    if (!e1 || !e2) { ng('senkoEpoch／senkoReadCovers が無い'); }
    else {
      const mk = (readAt) => new Function('window', cutFn(html, 'core') + String.fromCharCode(10) + e1 + String.fromCharCode(10) + 'var lastSenkoReadAt = senkoEpoch(' + JSON.stringify(readAt) + ');' + String.fromCharCode(10) + e2 + String.fromCharCode(10) + 'return { cov: senkoReadCovers, ep: lastSenkoReadAt };')(WIN);   /* v210：senkoEpoch は panel-core.js の包み */
      const k = mk('2026-11-20 21:12:17');
      const T0 = Date.parse('2026-11-20T21:12:17+09:00') / 1000;
      if (k.ep === T0) { ok('senkoReadAt「2026-11-20 21:12:17」を日本時間の epoch 秒に読む'); } else { ng('epoch が違う：' + k.ep + '／' + T0); }
      if (k.cov(T0 - 600) && k.cov(T0)) { ok('刻までの札・知らせ（刻ちょうどを含む）は写した扱い'); } else { ng('刻までが写した扱いになっていない'); }
      if (!k.cov(T0 + 1) && !k.cov(T0 + 3600)) { ok('刻より新しい札は未写しのまま残る'); } else { ng('刻より新しい札まで写した扱いになった'); }
      const k0 = mk('');
      if (k0.ep === 0 && !k0.cov(T0 - 600)) { ok('senkoReadAt が無ければ何も写した扱いにしない（今までどおり）'); } else { ng('senkoReadAt なしの扱いが違う'); }
      const kb = mk('ばらばら');
      if (kb.ep === 0 && !kb.cov(T0 - 600)) { ok('読めない字は無視する（写した扱いにしない）'); } else { ng('読めない字の扱いが違う'); }
    }
    if (html.indexOf("function isCopied(d) { return !!copied[keyOf(d)] || senkoReadCovers(d && d.time); }") >= 0) { ok('札の写した扱い（isCopied）は、端末の印か senko の刻のどちらかで写した'); } else { ng('isCopied が senko の刻を見ていない'); }
    /* v210：押し通知の未写しは panel-core.js の todoList が readAt（senko の刻）で落とす。パネルの mergedTodo は刻と端末の印を渡すだけ */
    { const T1 = Date.parse('2026-11-20T21:12:17+09:00') / 1000, tl = PCORE.todoList({ rows: [], ntfySent: [{ time: T1 - 60, title: 'a' }, { time: T1 + 60, title: 'b' }], readAt: T1 }); const mt = cutFn(html, 'mergedTodo');
      if (tl.length === 1 && tl[0].ntfy.title === 'b' && mt.indexOf('readAt: lastSenkoReadAt') >= 0 && mt.indexOf('ntfyCopied: function (e) { return !!ntfyCopied[ntfyKeyOf(e)]; }') >= 0) { ok('知らせ（押し通知）の未写しも senko の刻までは落とす（panel-core.js の todoList・パネルは刻と端末の印を渡す）'); } else { ng('知らせの側が senko の刻を見ていない（' + tl.length + '・' + mt.slice(0, 80) + '）'); } }
    if (html.indexOf('lastSenkoReadAt = senkoEpoch(d.senkoReadAt);') >= 0) { ok('state.json の senkoReadAt を読む'); } else { ng('state.json の senkoReadAt を読んでいない'); }
  }
  /* ---- ⑤の十六 panelView（panel-view.js）は panel.html の頭の字と残りの数え方とずれない（橋の枠 十三） ---- */
  head('⑤の十六 panelView の頭の字・残りは panel.html の headText と同じ（作り値・総当たり）');
  {
    const fn = (name) => cutFn(html, name);   /* v210：包み（一行）も切り出せる */
    const names = ['core', 'cardArg', 'pad2s', 'newestTime', 'cardsPending', 'cardEtaSec', 'cardLate', 'cardPendText', 'kumoEtaSec', 'isRunning', 'uraBusyText', 'yoshiWaitN', 'headObj', 'headText'];   /* v210：パネルの包み（state.json から控えた値と端末の刻を panel-core.js へ渡す）を回し、VAIO の panelView と同じ字になるか */
    const src = names.map(fn);
    if (src.some(s => !s)) { ng('panel.html の関数が拾えない：' + names.filter((n, i) => !src[i]).join('・')); }
    else {
      const PV = require(path.join(path.dirname(SRC), 'panel-view.js'));
      const NOW = 1795200000;
      const pre = "var WAIT_TEXT='待機中、、、。',POINT_TEXT='まとめて写すヨシ！',WORK_TEXT='作業中、、、。',LOST_TEXT='接続不良、、、。',CHECKING_TEXT='確認中、、、。',REST_TEXT='休憩中、、、。',YOSHI_TEXT='ヨシ待ち、、、。',CHECK_TEXT='検査中、、、。';";
      const mk = (d, left, rows) => new Function('window', 'Date0', 'lastStat', 'lastDetail', 'lastCloud', 'lastHelp', 'lastKumo', 'lastEvAt', 'lastCardOwedAt', 'lastCardOwedEta', 'allRows', 'copyLeft', 'lastLost', 'lastChecking', 'lastResting', 'lastUra', 'lastYoshiOpen', 'lastStepTotal', 'lastStepDone', 'lastFoot',
        'var Date=Date0;' + pre + src.join(String.fromCharCode(10)) + String.fromCharCode(10) + 'return headText();')(
        WIN, class extends global.Date { constructor(...a) { if (a.length) { super(...a); } else { super(NOW * 1000); } } static now() { return NOW * 1000; } },
        String(d.stat || ''), String(d.detail || ''), String(d.cloud || ''), String(d.help || ''), String(d.kumo || ''), d.evAt || 0, d.cardOwedAt || 0, d.cardOwedEta || 0, rows, left, false, false, false, d.ura || null, d.yoshiOpen || [], require(path.join(path.dirname(SRC), 'panel-core.js')).stepsOf(d).total, require(path.join(path.dirname(SRC), 'panel-core.js')).stepsOf(d).done, d.foot || {});
      let n = 0, bad0 = 0;
      const SH0 = process.env.SHADOW_HOME, tmpHome = fs.mkdtempSync(path.join(require('os').tmpdir(), 'pc-yo-')); process.env.SHADOW_HOME = tmpHome;   /* v250（枠 二百七十一）：ヨシ待ちの一覧は空の置き場で数える */
      const stats = ['', '作業中', '検査中', '待ち', 'ヨシ待ち', '動きなし', '止まり（使用量・13:00 にリセット）', '待機中'];
      const rowsOf = (t) => t ? [{ time: t, title: 'x', message: 'y' }] : [];
      const URAS = [null, { sub: { running: 2, items: [{ id: 'a' }, { id: 'b' }], recent: [] }, cloud: { running: [], recent: [] } }, { sub: { items: [], recent: [{ id: 'c' }] }, cloud: { running: [{ id: 1, name: 'x' }], recent: [] } }];   // v206（枠 五十八）：裏方なし／下請け2本／雲1本
      stats.forEach(stat => [0, 1, 2].forEach(det => URAS.forEach(ura => [0, NOW - 60, NOW - 400, NOW - 3000].forEach(owed => [0, 1].forEach(kum => [0, NOW - 3600, NOW - 20].forEach(newest => {
        const d = { stat, detail: ['', '残りの段 2', '残りの段 2・次「作り値の段」'][det], ura: ura, cardOwedAt: owed, cardOwedEta: owed ? owed + 150 : 0, kumo: kum ? '雲：検査 見込み 23:59' : '', evAt: NOW - 30, help: '', cloud: '' };
        const rows = rowsOf(newest);
        const left = rows.length;   // この組では写していない札は rows の数（senkoReadAt なし）
        const pv = PV.panelView(d, rows, [], NOW);
        const want = mk(d, pv.left, rows); n++;
        if (pv.head !== want) { bad0++; if (bad0 <= 3) { console.log('   差：' + JSON.stringify({ stat, det, owed, kum, newest }) + '／見張り「' + pv.head + '」／panel「' + want + '」'); } }
      }))))));
      if (bad0 === 0) { ok('頭の字：' + n + '組すべて panel.html の headText と同じ'); } else { ng('頭の字がずれた組 ' + bad0 + '／' + n); }
      /* v250（枠 二百七十一）：順は ヨシ待ち＞作業中＞まとめて写す＞待機中＞接続不良。作業中＋ヨシ待ち→ヨシ待ちの字（panel.html の headText も panelView も） */
      {
        const dW = { stat: '作業中', detail: '', cloud: '', ura: null, cardOwedAt: 0, cardOwedEta: 0, kumo: '', evAt: NOW - 30, help: '' };
        const pYes = mk(Object.assign({ yoshiOpen: ['y1124-9999'] }, dW), 0, []), pNo = mk(dW, 0, []);
        fs.writeFileSync(path.join(tmpHome, 'yoshi-open.tsv'), 'y1124-9999' + String.fromCharCode(9) + '2026-11-24 21:30:00' + String.fromCharCode(9) + 'テスト\n');
        const vYes = PV.panelView(dW, [], [], NOW).head; fs.writeFileSync(path.join(tmpHome, 'yoshi-open.tsv'), ''); const vNo = PV.panelView(dW, [], [], NOW).head;
        if (pYes === 'ヨシ待ち、、、。' && pNo === '作業中、、、。' && vYes === 'ヨシ待ち、、、。' && vNo === '作業中、、、。') { ok('猫と字の順：作業中でもヨシ待ちが一件あればヨシ待ち（panel.html と panelView・ヨシ待ちが無ければ作業中）'); } else { ng('猫と字の順が違う：' + [pYes, pNo, vYes, vNo].join(' | ')); }
      }
      /* v251（枠 二百七十二）：見張りの記録が途切れたら（lost）、作業中・ヨシ待ちより上に接続不良。戻れば（lost でない）元の順 */
      {
        const PCx = require(path.join(path.dirname(SRC), 'panel-core.js'));
        const a1 = PCx.headText({ stat: '作業中', lost: true, yoshiN: 1, rows: [], left: 0, now: NOW }), a2 = PCx.headText({ stat: '作業中', lost: false, yoshiN: 1, rows: [], left: 0, now: NOW }), a3 = PCx.headText({ stat: '作業中', lost: false, yoshiN: 0, rows: [], left: 0, now: NOW });
        const tx = PCx.TEXT;
        if (a1 === tx.LOST && a2 === tx.YOSHI && a3 === tx.WORK && html.indexOf('lastLost = (sec > LOST_SEC);') >= 0 && html.indexOf('CHECK_SEC = 300') >= 0 && (function () { var m = /LOST_SEC = ([0-9]+)/.exec(html), n = /CHECK_SEC = ([0-9]+)/.exec(html); return !!m && !!n && !(840 > +m[1]) && (960 > +m[1]) && !(240 > +n[1]) && (360 > +n[1]); })() && PCx.headText({ stat: '作業中', lost: false, checking: true, yoshiN: 1, rows: [], left: 0, now: NOW }) === tx.CHECKING && html.indexOf('lastChecking = (!lastLost && sec > CHECK_SEC);') >= 0 && html.indexOf("el.src.indexOf('cat-sleep-w') < 0") >= 0) { ok('接続不良の猫：記録が5分（LOST_SEC=300）途切れたら作業中・ヨシ待ちより上に接続不良（作業中＋記録4分前→元の猫・6分前→寝姿の猫）・戻れば元の順'); } else { ng('接続不良の猫の順が違う：' + [a1, a2, a3].join(' | ')); }
        /* 枠 二百七十三：画面の写し取り一覧の釦（btnShots）を公開の大きさの釦に替えた */
        if (html.indexOf('id="btnShots" aria-expanded="false">公開 —MB／1GB</button>') >= 0 && html.indexOf('site-size.json') >= 0 && html.indexOf('lastSite.mb >= 900') >= 0 && html.indexOf('shots/index.html') < 0) { ok('公開の大きさの釦：btnShots は『公開 NNNMB／1GB』（900MB から赤・押すと内訳・site-size.json を読む）・shots への番地は無い'); } else { ng('公開の大きさの釦が違う'); }
      }
      /* 枠 三百二十六（v263）：頭の猫の絵（headCat）と頭の字（headText）は同じ判定。食い違い 0 件：寝ている猫は『休憩中』『接続不良』だけ／仕事が残る確認中・待機中は緑の服の猫／休憩中は仕事（段・順番待ち・裏方・ヨシ待ち）が全部無い時だけ */
      {
        const PCh = require(path.join(path.dirname(SRC), 'panel-core.js')), TX = PCh.TEXT;
        let n = 0, bad = [];
        ['待ち', '', '作業中', '検査中', '止まり', '動きなし', 'ヨシ待ち'].forEach(stat => [false, true].forEach(lost => [false, true].forEach(checking => [false, true].forEach(resting => [0, 1].forEach(yoshiN => [null, { sub: { running: 1 } }].forEach(ura => [0, 2].forEach(waitN => [[0, 0], [3, 1], [3, 3]].forEach(st => {
          const o = { stat: stat, lost: lost, checking: checking, resting: resting, yoshiN: yoshiN, ura: ura, waitN: waitN, stepTotal: st[0], stepDone: st[1], rows: [], left: 0, now: 1700000000 };
          const t = PCh.headText(o), c = PCh.headCat(o), left = PCh.workLeft(o); n++;
          const sleepT = (t === TX.REST || t === TX.LOST), greenT = (t === TX.CHECKING || t === TX.WAIT);
          if ((c === 'sleep') !== sleepT || (c === 'green') !== greenT) { bad.push(JSON.stringify(o) + ' → ' + t + '／' + c); }
          if (t === TX.REST && left && !lost) { bad.push('仕事が残るのに休憩中：' + JSON.stringify(o)); }
          if (!lost && (resting || checking) && (stat === '待ち' || stat === '') && !left && t !== TX.REST) { bad.push('仕事が無いのに休憩中でない：' + JSON.stringify(o) + ' → ' + t); }
          if (!lost && checking && (stat === '待ち' || stat === '') && left && t !== TX.CHECKING && t !== TX.YOSHI && t !== TX.WORK && t !== TX.CHECK) { bad.push('仕事が残る確認中が確認中でない：' + JSON.stringify(o) + ' → ' + t); }
        }))))))));
        const hsrc = fs.readFileSync(SRC, 'utf8');
        const wired = hsrc.indexOf('core().headCat(headObj())') >= 0 && hsrc.indexOf("el.src = 'genba-taiki-80.png'") >= 0 && hsrc.indexOf('function headObj()') >= 0;
        if (!bad.length && wired) { ok('頭の猫と字の食い違い：' + n + '通りで 0 件（寝ている猫＝休憩中・接続不良だけ／仕事が残る確認中・待機中＝緑の服の猫／休憩中は仕事が全部無い時だけ）・panel.html は headCat を使う'); }
        else { ng('頭の猫と字の食い違い ' + bad.length + ' 件' + (wired ? '' : '（panel.html が headCat を使っていない）') + '：' + bad.slice(0, 3).join(' ／ ')); }
      }
      /* 枠 三百三十二〜三百三十五（v265）：「様子を写す」＝今まで通り写し、最後に vaio-snap.md の番地を一行足し、同時に ntfy の話題へ『vaio-look』＋写した字を送る（待たない）。「👆 指さす」はそのまま。VAIO の側（yoshi-btn-recv.js・vaio-look.js）は ~/.claude の台本で、手元の作り値で別に確かめた（字面の検査） */
      {
        const hv = fs.readFileSync(SRC, 'utf8');
        const need = ["VAIO_SNAP_URL = 'https://kfsr148-art.github.io/koushu-state/vaio-snap.md'", "var body = 'vaio-look' + String.fromCharCode(10) + String(panelText || '')", 'vaioSignal(base);', "text + String.fromCharCode(10) + 'VAIOの状態：' + VAIO_SNAP_URL", 'id="btnPoint">👆 指さす</button>', "$('btnPoint').addEventListener('click', function () { pointToggle(); })", 'try { vaioSignal(statusText()); } catch (xv) { }'];
        const miss = need.filter(x => hv.indexOf(x) < 0);
        if (!miss.length && hv.indexOf('function vaioLook') < 0) { ok('「様子を写す」＝写す字の最後に vaio-snap.md の番地を一行・同時に ntfy へ vaio-look＋字を送る／「👆 指さす」はそのまま（VAIOを見る釦は作らない）'); }
        else { ng('「様子を写す」の VAIO 合図の字面が足りない：' + miss.join(' ／ ') + (hv.indexOf('function vaioLook') >= 0 ? '（vaioLook が残っている）' : '')); }
      }
      /* 枠 三百三十八（v267）：頭の字（猫の横）＝本人が今する事。形は「する事。訳、いつまで」・色は g＝緑・y＝黄・r＝赤。場面ごとの字と色・数はパネルにある物だけ・元の字（headText）はそのまま・全部の元の字に行き先がある、を総当たりで確かめる */
      {
        const PCa = require(path.join(path.dirname(SRC), 'panel-core.js'));
        const NOWS = 1700000000, bad = [];
        const case1 = (nm, o, wantT, wantC) => { const r = PCa.headAct(Object.assign({ now: NOWS, rows: [], left: 0 }, o)); if (!(wantT instanceof RegExp ? wantT.test(r.t) : r.t === wantT) || r.c !== wantC) { bad.push(nm + '：「' + r.t + '」' + r.c + '（想定 ' + wantT + ' ' + wantC + '）'); } };
        case1('作業中（枠の名・あと分）', { stat: '作業中', subj: '枠 三百三十七：VAIOの写し', etaMin: 30 }, '待っておればよい。枠 三百三十七をやっておる、あと30分', 'g');
        case1('作業中（見込み無し）', { stat: '作業中', subj: '枠 三百三十七' }, '待っておればよい。枠 三百三十七をやっておる', 'g');
        case1('雲待ち（検査中）', { stat: '検査中', kumo: '雲：検査 見込み ' + (function () { const d = new Date((NOWS + 300) * 1000); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); })() }, /^待っておればよい。雲の検査待ち、あと[0-9]+分$/, 'g');
        case1('止まり＋段が残る', { stat: '止まり（使用量）', stepTotal: 5, stepDone: 2 }, 'Codeタブに一言打って。窓が止まっておる', 'r');
        case1('止まり＋段が無い', { stat: '止まり（使用量）', stepTotal: 0, stepDone: 0 }, /^見ておく。/, 'y');
        case1('ヨシ待ち', { stat: '作業中', yoshiN: 1 }, 'Codeタブでヨシを。1件', 'r');
        case1('ヨシ待ち（2件）', { stat: '待ち', yoshiN: 2 }, 'Codeタブでヨシを。2件', 'r');
        case1('接続不良', { stat: '作業中', lost: true }, 'VAIOの電源と網を見て', 'r');
        case1('全部無い', { stat: '待ち', resting: true }, '休憩中。次の枠を送れる', 'g');
        case1('確認中（記録の途切れ）', { stat: '作業中', checking: true }, /^見ておく。/, 'y');
        case1('写す物がある', { stat: '', left: 3 }, /^見ておく。写していない札が3件/, 'y');
        const LABELS = new Set();
        ['待ち', '', '作業中', '検査中', '止まり', '動きなし', 'ヨシ待ち'].forEach(stat => [false, true].forEach(lost => [false, true].forEach(checking => [false, true].forEach(resting => [0, 1].forEach(yoshiN => [null, { sub: { running: 1 } }].forEach(ura => [0, 2].forEach(waitN => [[0, 0], [3, 1]].forEach(st => [0, 4].forEach(left => {
          const o = { stat: stat, lost: lost, checking: checking, resting: resting, yoshiN: yoshiN, ura: ura, waitN: waitN, stepTotal: st[0], stepDone: st[1], left: left, rows: [], now: NOWS };
          const a = PCa.headAct(o), lab = PCa.headText(o); LABELS.add(lab);
          if (!a || typeof a.t !== 'string' || !a.t || ['g', 'y', 'r'].indexOf(a.c) < 0) { bad.push('字か色が無い：' + lab); }
          if (a && /、、、。|（なし）/.test(a.t)) { bad.push('元の字が残っている：' + a.t); }
          if (lab === PCa.TEXT.YOSHI && a.c !== 'r') { bad.push('ヨシ待ちが赤でない'); }
          if (lab === PCa.TEXT.LOST && a.c !== 'r') { bad.push('接続不良が赤でない'); }
          if (lab === PCa.TEXT.REST && a.c !== 'g') { bad.push('休憩中が緑でない'); }
        })))))))));
        const hs = fs.readFileSync(SRC, 'utf8');
        const wired = hs.indexOf('function paintHeadAct(hw)') >= 0 && hs.indexOf("hw.setAttribute('data-c', a.c)") >= 0 && hs.indexOf("hw.setAttribute('data-label', lb)") >= 0 && hs.indexOf('#headWait[data-c="r"]') >= 0;
        if (!bad.length && wired) { ok('頭の字＝本人が今する事（場面ごとの字と色・赤＝ヨシ待ち・接続不良／緑＝休憩中・待つだけ／黄＝見ておく）：' + LABELS.size + ' 種の元の字すべてに行き先があり、数はパネルにある物だけ・panel.html は色と元の字を持つ'); }
        else { ng('頭の字（本人が今する事）が違う ' + bad.length + ' 件' + (wired ? '' : '（panel.html の塗り手・色が足りない）') + '：' + bad.slice(0, 3).join(' ／ ')); }
      }
      /* v254（枠 二百七十八）：ヨシの釦の『通った』は約2秒・『送れなかった』は約4秒で元の『ヨシ待ち N件』へ戻る（押して2秒後→元の字） */
      {
        const lblSrc = cutFn(html, 'ybLabel');
        if (!lblSrc) { ng('ybLabel が拾えない'); }
        else {
          const T0 = { t: 1000000 };
          const mkL = (open, sent, kind, passed, fail) => new Function('S', 'var lastYoshiOpen = S.open, ybSent = S.sent, ybKind = S.kind, ybPassedAt = S.passed, ybFailAt = S.fail, YB_FAIL_MS = 4000, YB_PASS_MS = 2000, Date = { now: function () { return S.T.t; } }, setTimeout = function () { }, paintYoshiBtn = function () { };' + lblSrc + ' return function () { return ybLabel(); };')({ open: open, sent: sent, kind: kind, passed: passed, fail: fail, T: T0 });
          const fP = mkL([], 'y1124-9999', 'go', 0, 0), p1 = fP(); T0.t += 2500; const p2 = fP();   // 通った（一覧から落ちた）→ 2.5秒後は元の字（0件なら0件）
          const fX = mkL(['a', 'b'], '', '', 0, T0.t), x1 = fX(); T0.t += 1500; const x2 = fX(); T0.t += 3000; const x3 = fX();   // しくじった → 1.5秒後も『送れなかった』・4.5秒後は元の字（2件）
          if (p1 === '👈 ヨシが通った' && p2 === '👈 ヨシ待ち 0件' && x1 === '👈 送れなかった' && x2 === '👈 送れなかった' && x3 === '👈 ヨシ待ち 2件') { ok('ヨシの釦：通った字は約2秒（押して2秒後→元の字 0件）・しくじった字は約4秒で元の字（件数つき）'); } else { ng('ヨシの釦の戻りが違う：' + [p1, p2, x1, x2, x3].join(' | ')); }
        }
      }
      /* v255（枠 二百七十七）：一番古い待ちが60分を過ぎたら赤く『枠 N が 何分 待ち』（作り値：61分前→出る・59分前→出ない） */
      {
        const mkW = (n, since, label, nowS) => { const wo = { n: n, since: since, label: label }, wmin = (wo && typeof wo.since === 'number') ? Math.floor((nowS - wo.since) / 60) : 0; return (wo && wo.n > 0 && wmin >= 60) ? (String(wo.label || '枠') + ' が ' + wmin + '分 待ち') : ''; };
        const w1 = mkW(1, 1000000 - 61 * 60, '枠 二百六十二', 1000000), w2 = mkW(1, 1000000 - 59 * 60, '枠 二百六十二', 1000000), w3 = mkW(0, 0, '', 1000000);
        if (w1 === '枠 二百六十二 が 61分 待ち' && w2 === '' && w3 === '' && html.indexOf('id="wjLate"') >= 0 && html.indexOf("(wo && wo.n > 0 && wmin >= 60) ? (String(wo.label || '枠') + ' が ' + wmin + '分 待ち') : ''") >= 0) { ok('古い待ちの時間：60分から赤く『枠 N が 何分 待ち』・59分では出ない（panel.html の式と同じ）'); } else { ng('古い待ちの表示が違う：' + [w1, w2, w3].join(' | ')); }
      }
      if (SH0 === undefined) { delete process.env.SHADOW_HOME; } else { process.env.SHADOW_HOME = SH0; } try { fs.rmSync(tmpHome, { recursive: true, force: true }); } catch (e) { }
      /* v206（枠 五十八）：待ちでも下請けか雲が動いていれば「裏方作業中、、、。（下請け N本・雲 N本）」＋次「…」・どちらも動いていない時だけ「待ち：…」 */
      const hw = (ura, det) => PV.panelView({ stat: '待ち', detail: det, ura: ura }, [], [], NOW).head;
      const w1 = hw(URAS[1], '残りの段 2・次「作り値の段」'), w2 = hw(URAS[2], '残りの段 1・次「x」'), w3 = hw(URAS[2], '窓が閉じている'), w4 = hw(null, '残りの段 2・次「作り値の段」'), w5 = hw({ sub: { running: 0, items: [], recent: [{ id: 'z' }] }, cloud: { running: [], recent: [{ id: 2 }] } }, '残りの段 2');
      if (w1 === '裏方作業中、、、。' && w2 === '裏方作業中、、、。' && w3 === '裏方作業中、、、。' && w4 === '休憩中、、、。' && w5 === '休憩中、、、。') { ok('待ちの頭の字（v207・枠 六十六）：下請けか雲が動いていれば「' + w1 + '」・何も動いていなければ「' + w4 + '」（括弧・次「…」は付けない・済んだ物だけでは裏方作業中にしない）'); } else { ng('待ちの頭の字が違う：' + [w1, w2, w3, w4, w5].join('｜')); }
      const pvc = PV.panelView({ senkoReadAt: '2026-11-20 21:12:17' }, [{ time: Date.parse('2026-11-20T21:00:00+09:00') / 1000, title: 'a', message: 'b' }, { time: Date.parse('2026-11-20T22:00:00+09:00') / 1000, title: 'c', message: 'd' }, { time: Date.parse('2026-11-20T22:01:00+09:00') / 1000, title: 'e', message: '写せます（2件）' }], [], NOW);
      if (pvc.left === 1 && pvc.label === 'まとめて写す（残1／1件）') { ok('残り：刻までの札は数えず、刻より新しい札だけ・「写せます（N件）」は数えない'); } else { ng('残りの数え方が違う：' + JSON.stringify(pvc)); }
      if (/senkoReadAt/.test(pvc.basis)) { ok('中身に「センコの読みだけで数えた」の一言が入る'); } else { ng('basis が無い'); }
    }
  }
  /* ---- ⑤の二十四 印（eid）の無い札の押し通知も、印より前の札なら写した扱い（v209・本人の枠 七十一） ---- */
  head('⑤の二十四 印の無い札（見張りの札）の押し通知は札の行にまとめる・センコの印より前の札は押し通知ごと写した（作り値）');
  {
    const NL = String.fromCharCode(10);
    const line = (name) => { const i = html.indexOf('  function ' + name + '('); if (i < 0) { return ''; } const j = html.indexOf(NL, i); return html.slice(i, j).replace(/\r$/, ''); };
    const blk = (name) => { const i = html.indexOf('  function ' + name + '('); if (i < 0) { return ''; } const j = html.indexOf(NL + '  }', i); return html.slice(i, j + 4); };
    const PV = require(path.join(path.dirname(SRC), 'panel-view.js'));
    const PVS = fs.readFileSync(path.join(path.dirname(SRC), 'panel-view.js'), 'utf8');
    const nh = line('ntfyOfCard').trim(), mt = cutFn(html, 'mergedTodo'), ic = cutFn(html, 'isCountCard'), se = line('senkoEpoch'), sc = line('senkoReadCovers'), cp = line('isCopied'), cr = cutFn(html, 'core');   /* v210：包みは一行 */
    if (!nh || !mt || !ic || !se || !sc || !cp || !cr) { ng('panel.html の関数が拾えない（ntfyOfCard・mergedTodo・isCountCard・senkoEpoch・senkoReadCovers・isCopied）'); }
    else {
      if (nh === 'function ntfyOfCard(e, cards) { return core().ntfyOfCard(e, cards); }' && PVS.indexOf('function ntfyOfCard(') < 0 && PV.ntfyOfCard === PCORE.ntfyOfCard) { ok('ntfyOfCard は panel.html も panel-view.js も panel-core.js の一つを使う（写しが無い）'); } else { ng('ntfyOfCard が panel-core.js の一つでない（panel.html「' + nh.slice(0, 60) + '」）'); }
      if (mt.indexOf('core().todoList({ rows: allRows || []') >= 0 && PCORE.todoList.toString().indexOf('ntfyOfCard(e, rows)') >= 0) { ok('mergedTodo は写した札も含めて（allRows）押し通知の持ち主を探す（panel-core.js の todoList）'); } else { ng('mergedTodo が allRows で ntfyOfCard を呼んでいない'); }
      // 本物の二枚の形（notices.json：eid 空・pushedAt 0／ntfy-sent.json：同じ題・eid 空・札の 59秒後と10秒後に送った）
      const C1 = { title: '⏭ 定時の再起動は見送った（点検・返事不要）', time: 1795284621, message: '再起動の10分後の通し点検（11-22 03:10）', eid: '', pushedAt: 0 };
      const C2 = { title: '🪟 自動の続きが止まった（起こした）', time: 1795281728, message: '使用量の枠は 02:20 にリセットされたが…', eid: '', pushedAt: 0 };
      const N1 = { time: 1795284680, at: '2026-11-22 03:11:20', title: C1.title, parts: 1, body: '', eid: '' };
      const N2 = { time: 1795281738, at: '2026-11-22 02:22:18', title: C2.title, parts: 1, body: '', eid: '' };
      const run = (readAt, cards, ntfys, copiedKeys) => {
        const keyOf = (d) => String(d.time) + '|' + String(d.title);
        const copied = {}; (copiedKeys || []).forEach(k => { copied[k] = 1; });
        const f = new Function('window', 'allRows', 'ntfySent', 'copied', 'ntfyCopied', 'keyOf', 'ntfyKeyOf',
          cr + NL + se + NL + 'var lastSenkoReadAt = senkoEpoch(' + JSON.stringify(readAt) + ');' + NL + sc + NL + cp + NL + ic + NL + nh + NL + 'var shown = allRows.filter(function (d) { return !isCopied(d); });' + NL + mt + NL + 'return mergedTodo();');
        const m = f(WIN, cards, ntfys, copied, {}, keyOf, keyOf).length;
        const p = PV.panelView({ senkoReadAt: readAt }, cards, ntfys, 1795285000).left;
        return [m, p];
      };
      const eq = (r, w) => r[0] === w && r[1] === w;
      const a = run('2026-11-22 03:10:22', [C1, C2], [N1, N2]);
      if (eq(a, 0)) { ok('本人の画面（印 03:10:22）：札 03:10:21＋押し通知 03:11:20、札 02:22:08＋押し通知 02:22:18 → 残り0（panel・panelView とも）'); } else { ng('印 03:10:22 の残りが0でない：panel ' + a[0] + '／panelView ' + a[1]); }
      const b = run('2026-11-22 02:22:10', [C2], [N2]);
      if (eq(b, 0)) { ok('02:22 の形（印 02:22:10・押し通知 02:22:18 は印より後）→ 残り0'); } else { ng('02:22 の形の残りが0でない：' + b.join('／')); }
      const c = run('', [C2], [N2]);
      if (eq(c, 1)) { ok('印が無ければ、札と押し通知は一行（2件でなく1件）'); } else { ng('印なしで札と押し通知が一行にならない：' + c.join('／')); }
      const d0 = run('', [C2], [N2], [String(C2.time) + '|' + C2.title]);
      if (d0[0] === 0) { ok('端末で写した札の押し通知も残らない（panel）'); } else { ng('写した札の押し通知が残った：' + d0[0]); }
      const e1 = run('2026-11-22 03:10:22', [C1], [N1, { time: 1795284700, title: '☁️ 雲の走りが落ちた（x）', eid: '' }]);
      if (eq(e1, 1)) { ok('印より後の、どの札にも当たらない押し通知は今までどおり残る'); } else { ng('札に当たらない押し通知の扱いが違う：' + e1.join('／')); }
      const f1 = run('2026-11-22 03:10:22', [C1], [Object.assign({}, N1, { time: C1.time + 1200 })]);
      if (eq(f1, 1)) { ok('同じ題でも札から15分より後の押し通知は別の出来事として残る'); } else { ng('15分より後の押し通知の扱いが違う：' + f1.join('／')); }
      const g1 = run('2026-11-22 03:10:22', [{ title: '✅ 終わりました（返事不要）', time: 1795284370, message: 'x', eid: 'e1795284367', pushedAt: 0 }], [{ time: 1795284800, title: '😽 終わったにゃ、写して', eid: 'e1795284367' }]);
      if (eq(g1, 0)) { ok('印（eid）の有る札は今までどおり印で結ぶ（押し通知が印の後でも残らない）'); } else { ng('eid の有る札の押し通知が残った：' + g1.join('／')); }
    }
  }
  /* ---- ⑤の十七 表の仕事と裏方（v202・枠 四十六の三・四十七・四十八）：三行は釦に畳む・跡に表の仕事と裏方・panel-view.js と同じ字 ---- */
  head('⑤の十七 表の仕事と裏方（三行は釦に畳む・panel-view.js と字面も出す字も同じ）');
  {
    const H = html.split(String.fromCharCode(13) + String.fromCharCode(10)).join(String.fromCharCode(10));
    const PVS = fs.readFileSync(path.join(path.dirname(SRC), 'panel-view.js'), 'utf8').split(String.fromCharCode(13) + String.fromCharCode(10)).join(String.fromCharCode(10));
    const norm = (t) => t.split(String.fromCharCode(10)).map(l => l.replace(/^ +/, '')).join(String.fromCharCode(10)).trim();
    const cut = (src, n, ind) => { const a = src.indexOf(ind + 'function ' + n + '('); if (a < 0) { return ''; } const b = src.indexOf(String.fromCharCode(10) + ind + '}', a); return (b > a) ? src.slice(a, b + ind.length + 2) : ''; };
    const PV = require(path.join(path.dirname(SRC), 'panel-view.js'));
    /* v210（本人の枠 七十四）：字面の写しの突き合わせは、写しそのものを無くしたので「どちらも panel-core.js の一つを使う」の確かめに置き替えた（panel.html は包みの一行・panel-view.js に同じ名の関数が無い・出す物は panel-core.js の物そのもの） */
    ['omoteLines', 'uraLines', 'endLine', 'endShort', 'uraCount', 'boxSpec'].forEach(n => { const a = cutFn(H, n), sig = a.replace(/^ *function [A-Za-z]+\(([^)]*)\).*$/, '$1'); if (!a) { ng(n + ' が panel.html に無い'); } else if (a.trim() !== 'function ' + n + '(' + sig + ') { return core().' + n + '(' + sig + '); }') { ng(n + ' が panel.html の中で自分の中身を持っている（panel-core.js への包みでない）：' + a.trim().slice(0, 80)); } else if (PVS.indexOf('function ' + n + '(') >= 0 || PV[n] !== PCORE[n]) { ng(n + ' の写しが panel-view.js に残っている'); } else { ok(n + ' は panel.html も panel-view.js も panel-core.js の一つを使う'); } });
    const fo = PCORE.omoteLines, fu = PCORE.uraLines;
    const ST0 = Date.parse('2026-11-21T23:42:00+09:00') / 1000;
    const O1 = { stat: '作業中', subj: '枠 四十三：守りの線を本体へ', sNow: '本体の工事', stepDone: 2, stepTotal: 7, startedAt: ST0, mikomi: '150分' };
    const U1 = { sub: { running: 1, items: [{ id: 'a', type: 'general-purpose', desc: 'パネルを一度で仕上げる', start: '23:39' }], recent: [{ id: 'b', desc: '裏方の進み', start: '23:38', end: '23:38', state: '終' }] }, cloud: { running: [{ id: 1, name: '自動検査と配信', title: '声の台帳', at: '23:37', upd: '23:37', state: '走行中' }], recent: [{ id: 2, name: '自動検査と配信', title: '自動検査と配信', at: '23:28', upd: '23:32', state: '落ちた', failStep: '速い版' }, { id: 3, name: '声をm4aで作る', title: '声をm4aで作る', at: '23:01', upd: '23:06', state: '成功' }] } };
    const o1 = fo(O1).join('|'), u1 = fu(U1).join('|');
    const wantO = '表の仕事：枠 四十三：守りの線を本体へ（作業中）|枠：枠 四十三|段：3/7　本体の工事|始まり：23:42';
    if (o1 === wantO) { ok('表の仕事：枠・段 N/M・始まり（日本の時計）。今の枠だけの終わりは出さない（v203）'); } else { ng('表の仕事の字が違う：' + o1); }
    const wantU = '下請け 動作中：23:39〜　パネルを一度で仕上げる（general-purpose）|下請け 終：23:38〜23:38　裏方の進み|雲 走行中：23:37〜　自動検査と配信「声の台帳」|雲 落ちた：23:28〜23:32　自動検査と配信（落ちた段：速い版）|雲 成功：23:01〜23:06　声をm4aで作る';
    if (u1 === wantU) { ok('裏方：下請けと雲を一本ずつ、state.json の刻のまま'); } else { ng('裏方の字が違う：' + u1); }
    const e1 = fu(null).join('|'), e2 = fu({ sub: {}, cloud: {} }).join('|'), e3 = fo({}).join('|');
    if (/載っていない/.test(e1) && e2 === '下請け：動いていない|雲：走っていない' && /表の仕事：なし\|枠：件名に枠の番号なし\|段：なし\|始まり：不明$/.test(e3)) { ok('材料が無い時はその旨（空にしない）'); } else { ng('材料が無い時の字が違う：' + [e1, e2, e3].join(' ／ ')); }
    if (/分前|Date\.now/.test(PCORE.uraLines.toString() + PCORE.omoteLines.toString() + PCORE.endLine.toString())) { ng('表の仕事・裏方に「何分前」や今の刻が入っている（state.json の指紋が変わる）'); } else { ok('表の仕事・裏方は今の刻を使わない（何分前を出さない）'); }
    const pv = PV.panelView(Object.assign({ ura: U1 }, O1), [], [], 1795280000);
    const ln = (x) => (x && Array.isArray(x.lines)) ? x.lines.slice(1).join('|') : '';
    if (ln(pv.omote) === wantO && ln(pv.ura) === wantU && /^表の仕事の全部終わる見込み：state\.json に載っていない$/.test(pv.omote.lines[0]) && /^裏方の全部終わる見込み：/.test(pv.ura.lines[0])) { ok('panelView の omote・ura は {lines…}：頭に全部終わる見込みの一行・続きは panel.html と同じ字'); } else { ng('panelView の omote・ura が違う：' + JSON.stringify({ omote: pv.omote, ura: pv.ura })); }
    /* v204（本人の枠 五十一）：字の箱（#workBox）は外し、表の仕事と裏方は見出しの下の箱（#progBox）にゲージで出す */
    const iP = H.indexOf('id="progBox"'), iU = H.indexOf('id="usageTag"'), iB = H.indexOf('id="btnSteps"'), iS = H.indexOf('<ul id="stLine" hidden>');
    if (iU > 0 && iP > iU && iB > iP && iS > iB && H.slice(iU, iP).split('<div').length === 2 && H.indexOf('id="workBox"') < 0 && H.indexOf('paintWorkBox()') < 0) { ok('並び（v220）：使用量の三本（見出しのすぐ下）→ ゲージの箱 → くわしく → 三行（ふだんは hidden）・字の箱（#workBox）は無い'); } else { ng('ゲージの箱・釦・三行の並びか hidden が違う／字の箱が残っている（' + [iP, iB, iS, H.indexOf('id="workBox"')].join('・') + '）'); }
    /* v204：ゲージ（gaugeHtml を切り出して回す）。表＝段の済み緑・今の段一つ青・横に今の番号/全体／裏方＝済み緑・動いている本数ぶん青・横に済み/全体 */
    {
      const fg = new Function('esc', 'window', cutFn(H, 'core') + String.fromCharCode(10) + cut(H, 'gaugeHtml', '  ') + String.fromCharCode(10) + 'return gaugeHtml;')(t => String(t), WIN);
      const cls = (h) => (h.match(/<i class="([a-z]*)"><\/i>/g) || []).map(x => x.replace(/<i class="([a-z]*)"><\/i>/, '$1') || '-').join('');
      const gO = fg({ c: 'gauge', k: '表の仕事', done: 2, total: 5 }, true), gU = fg({ c: 'gauge', k: '裏方', done: 3, run: 2, total: 5, lab: '3/5' }, true), g0 = fg({ c: 'gauge', done: 3, total: 4 }, true);
      if (cls(gO) === 'ddc--' && /<span class="stg-k">表の仕事<\/span>/.test(gO) && /<span class="stg-n">3\/5<\/span>/.test(gO)) { ok('表の仕事のゲージ：済み緑2・今の段青1・横に 3/5・頭に小さく「表の仕事」'); } else { ng('表の仕事のゲージが違う：' + cls(gO) + ' ' + gO); }
      if (cls(gU) === 'dddcc' && /<span class="stg-k">裏方<\/span>/.test(gU) && /<span class="stg-n">3\/5<\/span>/.test(gU)) { ok('裏方のゲージ：直近に終わった分 緑3・動いている分 青2・横に 3/5'); } else { ng('裏方のゲージが違う：' + cls(gU) + ' ' + gU); }
      if (cls(g0) === 'dddc' && /<span class="stg-n">4\/4<\/span>/.test(g0) && g0.indexOf('stg-k') < 0) { ok('名を付けない時は v185 と同じ（済み3・今1・4/4）'); } else { ng('v185 の形が崩れた：' + g0); }
    }
    /* v204：箱の字は「全部終わる見込み HH:MM」の一行だけ（src・始まり・元の数は箱に出さない。state.json の panelView にだけ） */
    {
      const fe = PCORE.endShort, fc = PCORE.uraCount;
      const E0 = { omote: { endAt: '23:00', src: '今の仕事 残り3段…' }, ura: { endAt: '', src: '下請け 0本…' } };
      if (fe(E0, 'omote') === '全部終わる見込み 23:00' && fe(E0, 'ura') === '' && fe(null, 'omote') === '') { ok('箱の一行は「全部終わる見込み 23:00」だけ（src は出さない・刻が無ければ行を出さない）'); } else { ng('箱の一行が違う：' + [fe(E0, 'omote'), fe(E0, 'ura'), fe(null, 'omote')].join('｜')); }
      const c1 = fc(U1), c0 = fc(null);
      if (c1.run === 2 && c1.done === 3 && c0.run === 0 && c0.done === 0) { ok('裏方の数：動いている 2（下請け1・雲1）・直近に終わった 3'); } else { ng('裏方の数が違う：' + JSON.stringify([c1, c0])); }
      const P = cut(H, 'paintStateLine', '  ');
      if (P.indexOf("k: '表の仕事'") >= 0 && P.indexOf("k: '裏方'") >= 0 && P.indexOf('id="omoteSec"') >= 0 && P.indexOf('id="uraSec"') >= 0 && P.indexOf('endShort(E4') >= 0 && !/endLine|omoteLines|uraLines|\.src/.test(P)) { ok('見出しの下の箱に表の仕事と裏方のゲージ＋一行（箱の中では endLine・omoteLines・uraLines・src を使わない）'); } else { ng('箱の組み立てが新しい形でない'); }
      const pv4 = PV.panelView(Object.assign({ ura: U1, eta: { omote: { endAt: '23:50', src: 'x' }, ura: { endAt: '23:45', src: 'y' } } }, O1), [], [], 1795280000);
      if (pv4.omote.panel && pv4.omote.panel.gauge === '3/7' && pv4.omote.panel.end === '全部終わる見込み 23:50' && pv4.ura.panel && pv4.ura.panel.gauge === '3/5' && pv4.ura.panel.run === 2 && pv4.ura.panel.end === '全部終わる見込み 23:45' && pv4.omote.src === 'x' && pv4.ura.src === 'y') { ok('panelView.omote／ura.panel＝箱が出している物（ゲージの小さい字と一行）・src と元の数は state.json の中に残る'); } else { ng('panelView の panel が違う：' + JSON.stringify({ o: pv4.omote.panel, u: pv4.ura.panel })); }
    }
    if (H.indexOf("el.hidden = !(stepsOpen && rows.length);") >= 0 && H.indexOf("$('btnSteps').addEventListener('click'") >= 0) { ok('三行は釦を押した時だけ開く'); } else { ng('三行の開け閉めの手が無い'); }
    if (H.indexOf("lastUra = (d.ura && typeof d.ura === 'object') ? d.ura : null;") >= 0) { ok('state.json の ura を読む'); } else { ng('state.json の ura を読んでいない'); }
  }
  /* ---- ⑤の十八 全部終わる見込み（v203・本人の枠 五十）：endat.js を偽の台帳・偽の段・偽の下請けと雲で回す。本物の控えは読まない・書かない ---- */
  head('⑤の十八 全部終わる見込み（表＝今の仕事の残り＋順番待ち／裏方＝下請けと雲の全部・始まりは付け直さず終わりを延ばす）');
  {
    const os = require('os'), T = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-endat-')), W = (n, t) => { const p = path.join(T, n); fs.writeFileSync(p, t); return p; };
    const J = (s) => Math.floor(Date.parse('2026-11-21T' + s + ':00+09:00') / 1000), LF = String.fromCharCode(10), TB = String.fromCharCode(9);
    const keep = {}; const env = { ENDAT_ORDERS: W('orders.tsv', ['2026-11-21 10:00:00', '橋', '（橋）枠 一（11-21 センコ）a', '済（自動・終わりの札 10:20・枠 x）'].join(TB) + LF + ['2026-11-21 10:10:00', '橋', '（橋）枠 二（11-21 センコ）b', '済（自動・終わりの札 10:50・枠 x）'].join(TB) + LF + ['2026-11-21 11:00:00', '橋', '（枠）全文は orders-full.jsonl・頭：橋（合図 11:00）', '該当せず：合図だけ'].join(TB) + LF + ['2026-11-21 12:00:00', '橋', '（橋）枠 三（11-21 センコ）c', '済（自動・終わりの札 12:40・枠 x）'].join(TB) + LF),
      ENDAT_NOTES: W('notes.log', ['--- 2026-11-21 10:05:00 x', '開始: 2026-11-21 10:00:00', '件名: 枠 一：a', '見込み: 40分', '--- 2026-11-21 12:01:00 x', '開始: 2026-11-21 12:00:00', '件名: 枠 三：c', '見込み: 80分', ''].join(LF)),
      ENDAT_STEPS: W('steps.txt', ['仕事: 枠 九：作り値', '枠: x', '[x] 段1', '[ ] 段2', '[ ] 段3', '[ ] 段4', ''].join(LF)),
      ENDAT_SUBLOG: W('sub.jsonl', [{ ev: 'start', id: 'a', at: J('22:00') }, { ev: 'stop', id: 'a', at: J('22:10') }, { ev: 'start', id: 'b', at: J('22:20') }, { ev: 'stop', id: 'b', at: J('22:40') }, { ev: 'start', id: 'c', at: J('22:35') }].map(x => JSON.stringify(x)).join(LF) + LF),
      ENDAT_CLOUD: W('cloud.json', JSON.stringify({ list: [{ workflowName: 'A', status: 'completed', conclusion: 'success', createdAt: '2026-11-21T12:00:00Z', updatedAt: '2026-11-21T12:06:00Z' }, { workflowName: 'A', status: 'completed', conclusion: 'success', createdAt: '2026-11-21T12:10:00Z', updatedAt: '2026-11-21T12:14:00Z' }, { workflowName: 'A', status: 'in_progress', conclusion: '', createdAt: '2026-11-21T13:38:00Z', updatedAt: '2026-11-21T13:39:00Z' }] })),
      ENDAT_BASE: path.join(T, 'base.json'), ENDAT_BUNDLE: path.join(T, 'bundle.json'), ENDAT_EST: path.join(T, 'none.json') };
    Object.keys(env).forEach(k => { keep[k] = process.env[k]; process.env[k] = env[k]; });
    try {
      const EA = require(path.join(path.dirname(SRC), 'endat.js')), PV = require(path.join(path.dirname(SRC), 'panel-view.js'));
      const d1 = { stat: '作業中', subj: '枠 九：作り値', sNow: '段2', stepDone: 1, stepTotal: 4, startedAt: J('22:00'), statAt: J('22:00'), mikomi: '60分', foot: { wait: 2, waitList: [{ at: '11-21 22:10', head: '（橋）枠 十（11-21 センコ）d' }, { at: '11-21 22:30', head: '橋（合図 22:30）' }] } };
      const e1 = EA.compute(d1, J('22:40'));
      // v213（枠 八十三）：比 0.5 は参考だけ（今の仕事の終わりに掛けない）。mikomiAt の無い古い state なので見込みは始まり 22:00 から：22:00＋60分＝23:00、順番待ち 1件（合図は数えない）×30分 → 23:30
      if (e1.omote.endAt === '23:30' && e1.omote.cur.endSec === J('23:00') && e1.omote.ratio.v === 0.5 && e1.omote.ratio.n === 2 && e1.omote.wait.n === 1 && e1.omote.wait.signals === 1 && e1.omote.wait.frameMin === 30 && e1.omote.cur.left === 3) { ok('表：今の仕事（見込みの分のまま・比は掛けない）＋順番待ち（合図は数えない）×今日の一枠の中央値で 23:30'); } else { ng('表の全部終わる刻が違う：' + JSON.stringify(e1.omote)); }
      if (/順番待ち 1件×30分/.test(e1.omote.src) && /比 0\.5（直近24時間 2組・参考：今の仕事の終わりには掛けない）/.test(e1.omote.src)) { ok('表の元の数（件・分・比）が src に入る：' + e1.omote.src); } else { ng('表の src が違う：' + e1.omote.src); }
      // 段が二つ増え、控えの「開始:」が 22:35 に刻み直されても、始まりは 22:00 のまま・終わりだけ 一段15分×2 延びる → 今の仕事 23:30・全部 00:00
      fs.appendFileSync(env.ENDAT_STEPS, '[ ] 段5' + LF + '[ ] 段6' + LF);
      const e2 = EA.compute(Object.assign({}, d1, { startedAt: J('22:35'), stepTotal: 6 }), J('22:40'));
      if (e2.omote.endAt === '00:00' && e2.omote.cur.endSec === J('23:30') && e2.omote.startSec === J('22:00') && e2.omote.cur.addSteps === 2) { ok('段が増えても始まりは付け直さず（22:00 のまま）、終わりだけ延びる（23:30 → 00:00）'); } else { ng('段が増えた時の終わりが違う：' + JSON.stringify(e2.omote)); }
      const e3 = EA.compute(Object.assign({}, d1, { startedAt: J('22:35'), stepTotal: 6 }), e2.omote.endSec + 60);
      if (e3.omote.endAt === '00:05' && e3.omote.over === true) { ok('見込みを過ぎて残っている時は、今を5分刻みに切り上げた刻（00:05）へ延ばす'); } else { ng('過ぎた時の表の刻が違う：' + JSON.stringify(e3.omote)); }
      // 裏方：下請け 1本（22:35〜・今日の済んだ2本 10分と20分の中央値 15分 → 22:50）・雲 1本（22:38〜・流れ A の 6分と4分の中央値 5分 → 22:43）→ 遅い方 22:50
      if (e1.ura.endAt === '22:50' && e1.ura.sub.n === 1 && e1.ura.sub.min === 15 && e1.ura.cloud.n === 1 && e1.ura.cloud.min === 5) { ok('裏方：下請けと雲の全部のうち一番遅い終わり（22:50）・1本あたりは今日の中央値'); } else { ng('裏方の全部終わる刻が違う：' + JSON.stringify(e1.ura)); }
      const pv = PV.panelView(Object.assign({ eta: e1, ura: { sub: {}, cloud: {} } }, d1), [], [], J('22:40'));
      if (pv.omote.endAt === '23:30' && pv.omote.lines[0].indexOf('表の仕事の全部終わる見込み：23:30（') === 0 && pv.ura.endAt === '22:50' && pv.ura.lines[0].indexOf('裏方の全部終わる見込み：22:50（') === 0 && pv.omote.lines[4] === '始まり：22:00') { ok('panelView.omote／ura に endAt と元の数・頭の一行は一つずつだけ'); } else { ng('panelView の全部終わる見込みが違う：' + JSON.stringify({ o: pv.omote, u: pv.ura })); }
      fs.writeFileSync(env.ENDAT_STEPS, ['仕事: 枠 九：作り値', '[x] 段1', ''].join(LF)); fs.writeFileSync(env.ENDAT_SUBLOG, ''); fs.writeFileSync(env.ENDAT_CLOUD, '{"list":[]}');
      const e4 = EA.compute(Object.assign({}, d1, { foot: { wait: 0, waitList: [] } }), J('22:40')), l4 = PV.endLine(e4, 'omote') + '|' + PV.endLine(e4, 'ura');
      if (l4 === '表の仕事の全部終わる見込み：なし（残りの仕事が無い）（今の仕事なし＋順番待ち 0件×30分（直近24時間の3枠の中央値）・見込みと実測の比 0.5（直近24時間 2組・参考：今の仕事の終わりには掛けない））|裏方の全部終わる見込み：なし（動いている物が無い）（下請け 0本（1本 15分＝直近24時間の実測なし・仮に15分）・雲 0本）') { ok('残りが無い時は「なし」と元の数（空にしない）'); } else { ng('残りが無い時の字が違う：' + l4); }
      if (html.indexOf("lastEta = (d.panelView && d.panelView.omote") >= 0 && html.indexOf("eo = endShort(E4, 'omote'), eu = endShort(E4, 'ura')") >= 0) { ok('パネルは state.json の panelView.omote／ura を読み、表の仕事と裏方のゲージの下に一行ずつ出す（v204）'); } else { ng('パネルが全部終わる見込みを読んでいない／箱に出していない'); }
    } catch (e) { ng('全部終わる見込みが回らない：' + e.message); }
    finally { Object.keys(keep).forEach(k => { if (keep[k] === undefined) { delete process.env[k]; } else { process.env[k] = keep[k]; } }); try { fs.rmSync(T, { recursive: true, force: true }); } catch (e) { } }
  }
  /* ---- ⑤の十九 三つの箱（v205・本人の枠 五十二・五十四〜五十六）：全部／表の仕事／裏方。区切りは endat.js の束（来たら M が増え・済みは塗る・消さない）。
     作り値（偽の段の台帳・偽の順番待ち・偽の ura）だけで回す。本物の控えは読まない・書かない。paintStateLine は切り出して偽の器で回す ---- */
  head('⑤の十九 三つの箱（全部・表の仕事・裏方）：区切りが増えたら M が増え・済みは塗り・あとN分が延びる／裏方の一本ずつは「くわしく」の中');
  {
    const os = require('os'), T = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-endat19-')), W = (n, t) => { const p = path.join(T, n); fs.writeFileSync(p, t); return p; };
    const J = (s) => Math.floor(Date.parse('2026-11-22T' + s + ':00+09:00') / 1000), LF = String.fromCharCode(10);
    const keep = {}, env = { ENDAT_ORDERS: W('orders.tsv', ''), ENDAT_NOTES: W('notes.log', ''), ENDAT_STEPS: W('steps.txt', ['仕事: 枠 九：ゲージに戻す', '[x] 段1', '[ ] 段2', '[ ] 段3', ''].join(LF)), ENDAT_SUBLOG: W('sub.jsonl', ''), ENDAT_CLOUD: W('cloud.json', '{"list":[]}'), ENDAT_BASE: path.join(T, 'base.json'), ENDAT_BUNDLE: path.join(T, 'bundle.json'), ENDAT_EST: path.join(T, 'none.json') };
    Object.keys(env).forEach(k => { keep[k] = process.env[k]; process.env[k] = env[k]; });
    const H = html.split(String.fromCharCode(13) + LF).join(LF);
    const cut = (n) => { const a = H.indexOf('  function ' + n + '('); if (a < 0) { return ''; } const b = H.indexOf(LF + '  }', a); return (b > a) ? H.slice(a, b + 4) : ''; };
    try {
      const EA = require(path.join(path.dirname(SRC), 'endat.js')), PV = require(path.join(path.dirname(SRC), 'panel-view.js'));
      const seg = (e) => [e.omote.seg, e.ura.seg, e.all.seg].map(g => g.done + '/' + g.total + 'r' + g.run).join(' ');
      const W1 = { at: '11-22 01:00', head: '（橋）枠 十（センコ）a' }, W2 = { at: '11-22 01:05', head: '（橋）枠 十一（センコ）b' }, SG = { at: '11-22 01:06', head: '橋（合図 01:06）' };
      const U = (items, running, recent) => ({ sub: { items: items, recent: recent || [] }, cloud: { running: running || [], recent: [] } });
      const d0 = { stat: '作業中', subj: '枠 九：ゲージに戻す', sNow: '段2', stepDone: 1, stepTotal: 3, startedAt: J('01:00'), statAt: J('01:00'), mikomi: '30分' };
      const st = (o) => Object.assign({}, d0, o);
      const c1 = EA.compute(st({ foot: { wait: 2, waitList: [W1, SG] }, ura: U([{ id: 'a', desc: 'パネル直し', start: '01:01' }]) }), J('01:10'));
      if (seg(c1) === '1/4r1 0/1r1 1/5r2') { ok('始め：表＝段3（済み1）＋順番待ち1（合図は数えない）＝1/4・裏方＝下請け1本 0/1・全部＝1/5'); } else { ng('始めの区切りが違う：' + seg(c1)); }
      const c2 = EA.compute(st({ foot: { wait: 3, waitList: [W1, W2, SG] }, ura: U([{ id: 'a', desc: 'パネル直し', start: '01:01' }]) }), J('01:11'));
      if (seg(c2) === '1/5r1 0/1r1 1/6r2' && c2.omote.endSec > c1.omote.endSec && c2.all.endSec >= c1.all.endSec) { ok('枠が来た：表の M が 4→5・全部 5→6・表の終わりが延びた（' + c1.omote.endAt + '→' + c2.omote.endAt + '）'); } else { ng('枠が来た時が違う：' + seg(c2) + '・' + c1.omote.endAt + '→' + c2.omote.endAt); }
      const c3 = EA.compute(st({ foot: { wait: 3, waitList: [W1, W2, SG] }, ura: { sub: { items: [{ id: 'a', desc: 'パネル直し', start: '01:01' }, { id: 'b', desc: '台帳の整理', start: '01:12' }], recent: [] }, cloud: { running: [{ id: 7, name: '自動検査と配信', at: '01:12', state: '走行中' }], recent: [] } } }), J('01:12'));
      if (seg(c3) === '1/5r1 0/3r3 1/8r4') { ok('下請けと雲が動き出した：裏方の M が 1→3（動いている3本は青）・全部 6→8'); } else { ng('裏方が増えた時が違う：' + seg(c3)); }
      fs.writeFileSync(env.ENDAT_STEPS, ['仕事: 枠 九：ゲージに戻す', '[x] 段1', '[x] 段2', '[ ] 段3', ''].join(LF));
      const c4 = EA.compute(st({ stepDone: 2, foot: { wait: 3, waitList: [W1, W2, SG] }, ura: { sub: { items: [{ id: 'b', desc: '台帳の整理', start: '01:12' }], recent: [{ id: 'a', desc: 'パネル直し', start: '01:01', end: '01:20', state: '終' }] }, cloud: { running: [], recent: [{ id: 7, name: '自動検査と配信', at: '01:12', upd: '01:20', state: '落ちた', failStep: '速い版' }] } } }), J('01:20'));
      if (seg(c4) === '2/5r1 2/3r1 4/8r2') { ok('段が一つ済み・下請け1本と雲1本が済んだ：済みは塗る（表 2/5・裏方 2/3）・M は減らない（全部 4/8）'); } else { ng('済んだ時が違う：' + seg(c4)); }
      fs.writeFileSync(env.ENDAT_STEPS, ['仕事: 枠 十：次の仕事', '[ ] 段1', '[ ] 段2', ''].join(LF));
      const c5 = EA.compute(st({ subj: '枠 十：次の仕事', stepDone: 0, stepTotal: 2, foot: { wait: 1, waitList: [W2] }, ura: U([{ id: 'b', desc: '台帳の整理', start: '01:12' }]) }), J('01:30'));
      if (seg(c5) === '3/6r1 2/3r1 5/9r2') { ok('前の仕事が済み、順番待ちの枠 十が今の仕事になった：前の段3つは済み・枠 十の区切りは段2つに置き換わる（表 3/6）'); } else { ng('仕事が替わった時が違う：' + seg(c5)); }
      fs.writeFileSync(env.ENDAT_STEPS, ['仕事: 枠 十：次の仕事', '[x] 段1', '[x] 段2', ''].join(LF));
      const c6 = EA.compute(st({ stat: '手待ち', foot: { wait: 0, waitList: [] }, ura: U([]) }), J('01:40'));
      if (seg(c6) === '6/6r0 3/3r0 9/9r0' && c6.all.endAt === '') { ok('全部済んだ：区切りは消さず全部塗る（9/9）・終わりの刻は無し'); } else { ng('全部済んだ時が違う：' + seg(c6) + '・' + c6.all.endAt); }
      const c7 = EA.compute(st({ stat: '手待ち', foot: { wait: 1, waitList: [W1] }, ura: U([]) }), J('01:45'));
      if (seg(c7) === '0/1r1 3/3r0 3/4r1') { ok('手すきの後に新しい枠：表の束は始め直す（0/1）・裏方は動き出すまで前の束のまま'); } else { ng('手すきの後の枠が違う：' + seg(c7)); }
      /* 箱の中身（boxSpec）と終わりの一行（etaRow）・裏方の分け方（uraGroups） */
      const fb = PCORE.boxSpec, fr = PCORE.etaRow, fg = new Function(cut('uraGroups') + LF + 'return uraGroups;')();   /* v210：箱の中身と終わりの一行は panel-core.js */
      const U3 = { sub: { items: [{ id: 'b', desc: '台帳の整理', start: '01:12' }], recent: [{ id: 'a', desc: 'パネル直し', start: '01:01', end: '01:20', state: '終' }] }, cloud: { running: [{ id: 8, name: '札と状態の配信', at: '01:19', state: '待ち' }], recent: [{ id: 7, name: '自動検査と配信', at: '01:12', upd: '01:20', state: '落ちた', failStep: '速い版' }] } };
      const bA = fb(c4, U3, 'all'), bO = fb(c4, U3, 'omote'), bU = fb(c4, U3, 'ura');
      if (bA && bA.k === '全部' && bA.now === '表の仕事 残り3・裏方 残り1' && bA.total === 8 && bA.run === 2 && bU.done === 2 && bU.total === 3 && bU.run === 1 && bU.lab === '2/3' && bO.k === '表の仕事' && bO.now === '枠 九：ゲージに戻す' && bU.k === '裏方' && bU.now === '下請け・台帳の整理、雲・札と状態の配信' && fb({ omote: { endAt: '01:00' } }, null, 'omote') === null) { ok('箱の頭：全部「' + bA.now + '」／表の仕事「' + bO.now + '」／裏方「' + bU.now + '」・区切りの無い古い state は null'); } else { ng('箱の中身が違う：' + JSON.stringify([bA, bO, bU])); }
      const nS = Math.floor(Date.now() / 1000), r1 = fr({ endSec: nS + 1500 }, nS, false), r2 = fr({ endSec: nS + 600, over: true }, nS, false), r3 = fr({ endSec: nS - 960 }, nS, false), r4 = fr({ endSec: 0 }, nS, false);
      if (/^全部終わる見込み [0-9]{2}:[0-9]{2}（あと25分）$/.test(r1.t) && r1.c === 'eta' && r2.c === 'bad' && /（あと10分）/.test(r2.t) && r3.t === '見込みを過ぎた 16分' && r3.c === 'bad' && r4 === null) { ok('終わりの一行は v180 と同じ数え方：「' + r1.t + '」・延ばした刻は赤・過ぎたら赤「見込みを過ぎた 16分」・刻が無ければ出さない'); } else { ng('終わりの一行が違う：' + JSON.stringify([r1, r2, r3, r4])); }
      const g3 = fg(U3);
      if (g3.run.join('|') === '下請け：台帳の整理（01:12〜）' && g3.wait.join('|') === '雲：札と状態の配信（01:19〜・待ち）' && g3.done.join('|') === '下請け：パネル直し（01:01〜01:20・終）|雲：自動検査と配信（01:12〜01:20・落ちた・落ちた段：速い版）') { ok('裏方の一本ずつ：動作中＝進行中・待ち＝予定・終／落ちた＝完了（落ちた段の名も）'); } else { ng('裏方の分け方が違う：' + JSON.stringify(g3)); }
      /* paintStateLine を偽の器で回す（state.json の panelView を通した値で） */
      const SRCN = ['core', 'paintStateLine', 'gaugeHtml', 'endShort', 'uraCount', 'boxSpec', 'headEta', 'etaRow', 'uraGroups', 'waitEtaRow', 'pad2s', 'mkEndSec'], src = SRCN.map(n => cutFn(H, n));   /* v210：包み（一行）も切り出す・panel-core.js は window.PanelCore で渡す */
      if (src.some(x => !x)) { ng('切り出せない関数がある（' + SRCN.filter((n, i) => !src[i]).join('・') + '）'); }
      else {
        const VARS = ['lastEta', 'lastUra', 'lastSNow', 'lastStepTotal', 'lastStepDone', 'lastStat', 'lastStartedAt', 'lastMikomiMin', 'lastMikomiRaw', 'lastSDone', 'lastSNowAt', 'lastSNext', 'stepsOpen', 'lastKumo', 'lastDetail', 'lastMikomiAt', 'lastShadowBox'];
        const fp = new Function('S', 'var window = S.win, ' + VARS.map(v => v + ' = S.' + v).join(', ') + ';' + LF + 'function $(id) { return S.el[id] || null; }' + LF + "function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }" + LF + "function stateLineText() { return ''; }" + LF + "function headText() { return ''; }" + LF + "function paintHeadAct(hw) { hw.textContent = headText(); }" + LF + src.join(LF) + LF + 'paintStateLine();');
        const paint = (d, ura, open, ov) => {
          const el = { progBox: { innerHTML: '', className: '' }, btnSteps: { className: '', textContent: '', setAttribute: function () { } }, stLine: { hidden: true, innerHTML: '' }, headWait: { textContent: '' } };
          const pv = d ? PV.panelView(Object.assign({ eta: d, ura: ura }, st({})), [], [], nS) : null;
          fp(Object.assign({ win: WIN, el: el, lastEta: pv ? { omote: pv.omote, ura: pv.ura, all: pv.all } : null, lastUra: ura, lastSNow: '段3', lastStepTotal: 3, lastStepDone: 2, lastStat: '作業中', lastStartedAt: nS - 300, lastMikomiMin: 30, lastMikomiRaw: '30分', lastSDone: '段2', lastSNowAt: nS - 60, lastSNext: '', stepsOpen: !!open, lastKumo: '', lastDetail: '' }, ov || {}));
          return el;
        };
        const ids = (h) => (h.match(/<div class="pg-sec" id="([a-zA-Z]+)">/g) || []).map(x => x.replace(/.*id="([a-zA-Z]+)".*/, '$1')).join(',');
        const heads = (h) => (h.match(/<b class="pg-k">([^<]*)<\/b>/g) || []).map(x => x.replace(/<[^>]+>/g, '')).join(',');
        const bars = (h) => h.split('<span class="stg-bar">').slice(1).map(x => x.split('</span>')[0].replace(/<i class="([a-z]*)"><\/i>/g, (m, c) => c || '-')).join(' ');
        const labs = (h) => (h.match(/<span class="stg-n">([^<]*)<\/span>/g) || []).map(x => x.replace(/<[^>]+>/g, '')).join(' ');
        const set = (e, a, o, u) => { e = JSON.parse(JSON.stringify(e)); [a, o, u].forEach((x, i) => { e[['all', 'omote', 'ura'][i]].endSec = x ? nS + x : 0; }); if (e.omote.cur) { e.omote.cur.endSec = o ? nS + o : 0; } return e; };   /* v213：今の仕事の終わり（cur.endSec＝見込みを書いた刻＋見込み）も同じだけずらす */
        const E4 = set(c4, 2400, 1800, 2400), e4 = paint(E4, U3, false), h4 = e4.progBox.innerHTML;
        if (ids(h4) === 'omoteSec,uraSec' && heads(h4) === '表の仕事,裏方' && e4.progBox.className === 'progbox') { ok('箱は二つ（v219：「全部」の箱は外した）・上から「表の仕事」「裏方」・それぞれ頭に名'); } else { ng('箱の並び・名が違う：' + ids(h4) + '／' + heads(h4)); }
        /* v207（枠 六十四）：裏方は束（一塊）の数のまま。ura の本数で足す手（v206 の六十一）は外した。裏方の横の字は 済んだ本数／始まった本数 */
        if (bars(h4) === 'ddc-- ddc' && labs(h4) === '3/5 2/3') { ok('ゲージ：表 ddc--（3/5）・裏方 ddc（済んだ2／始まった3）＝済みは緑・今は青・まだは灰（ura の本数で足さない）'); } else { ng('三つのゲージが違う：' + bars(h4) + '／' + labs(h4)); }
        /* v206（枠 五十九の一・六十）：三つの箱の頭（名の右）に「あと N分（HH:MM ごろ）」・ゲージの下に「全部終わる見込み HH:MM（あと N分）」（裏方の箱にも必ず） */
        const etas = (h4.match(/<div class="pb pg-h"><b class="pg-k">[^<]*<\/b><span class="pg-eta eta">([^<]*)<\/span>/g) || []).map(x => x.replace(/<b class="pg-k">[^<]*<\/b>/, '').replace(/<[^>]+>/g, ''));
        const ends = (h4.match(/<p class="m eta">全部終わる見込み [^<]*<\/p>/g) || []).map(x => x.replace(/<[^>]+>/g, ''));
        if (etas.length === 2 && /^あと 30分（[0-9]{2}:[0-9]{2} ごろ）$/.test(etas[0]) && /^あと 40分（[0-9]{2}:[0-9]{2} ごろ）$/.test(etas[1])) { ok('二つの箱の頭に「あと N分（HH:MM ごろ）」：' + etas.join('／')); } else { ng('箱の頭のあと N分が違う：' + etas.join('／')); }
        /* v207（本人の枠 六十七）：時間は頭の「あと N分（HH:MM ごろ）」だけ。ゲージの下の「全部終わる見込み」の行は三つの箱とも出さない */
        if (ends.length === 0 && h4.indexOf('全部終わる見込み') < 0 && (h4.match(/<div class="pb pg-n">/g) || []).length === 2) { ok('三つの箱ともゲージの下の「全部終わる見込み」の行は無い（時間は頭の一つだけ・今動かしている物の一行は残る）'); } else { ng('ゲージの下に時間の行が残っている：' + ends.join('／')); }
        /* v206（枠 六十）：動いている物も待っている物も無く全部済んだ箱は出さない・全部済めば箱ごと隠す・動き出したらまた出る */
        const E0b = JSON.parse(JSON.stringify(E4)); E0b.ura.seg = { done: 4, total: 4, run: 0 }; E0b.ura.endSec = 0; E0b.all.seg = { done: 6, total: 9, run: 1 };
        const h0b = paint(E0b, U([]), false).progBox.innerHTML;
        if (ids(h0b) === 'omoteSec' && h0b.indexOf('裏方') < 0) { ok('裏方 4/4（全部済み・動いている物なし）は箱ごと出さない：' + ids(h0b)); } else { ng('済んだ裏方の箱が残っている：' + ids(h0b)); }
        const E6 = JSON.parse(JSON.stringify(E4)); ['all', 'omote', 'ura'].forEach(k => { E6[k].seg = { done: 3, total: 3, run: 0 }; E6[k].endSec = 0; });
        const e6 = paint(E6, U([]), false);
        if (e6.progBox.innerHTML === '' && e6.progBox.className === 'progbox hide') { ok('三つとも全部済んだ：箱ごと出さない'); } else { ng('全部済んだのに箱が出ている：' + e6.progBox.innerHTML.replace(/<[^>]+>/g, '|').slice(0, 160)); }
        const E61 = JSON.parse(JSON.stringify(E0b)); E61.ura.endSec = nS + 900; E61.ura.seg = { done: 0, total: 2, run: 2 };   /* v207（枠 六十四）：済んだ一塊の後に動き出したら束は 0 から（0/2） */
        const h61 = paint(E61, U([{ id: 'p', desc: '下請けの名', start: '01:47' }, { id: 'q', desc: '', start: '01:47' }]), false).progBox.innerHTML, u61 = h61.slice(h61.indexOf('id="uraSec"'));
        if (ids(h61) === 'omoteSec,uraSec' && bars(u61).split(' ')[0] === 'cc' && labs(u61).split(' ')[0] === '0/2' && /あと 15分（[0-9]{2}:[0-9]{2} ごろ）/.test(u61) && u61.indexOf('全部終わる見込み') < 0 && /<span class="pg-now">下請け・下請けの名、下請け・名なし<\/span>/.test(u61)) { ok('一塊が済んだ後に下請け2本が動き出した：裏方の箱がまた出て 0 から cc（0/2）・頭に あと15分・全部の箱は「裏方 残り2」'); } else { ng('動き出した裏方が違う：' + ids(h61) + '／' + bars(u61) + '／' + labs(u61) + '／' + u61.replace(/<[^>]+>/g, '|').slice(0, 200)); }
        /* v206（枠 六十二）：作業中で見込みが書かれていなくても、箱に赤い「見込み未記入」「見込み不明」は出さない。panelView.noEstimate にだけ残す */
        const h62 = paint(E4, U3, false, { lastMikomiMin: 0, lastMikomiRaw: '' }).progBox.innerHTML, h62b = paint(E4, U3, false, { lastMikomiMin: 0, lastMikomiRaw: '不明' }).progBox.innerHTML;
        const ne1 = PV.panelView({ stat: '作業中', mikomi: '' }, [], [], nS).noEstimate, ne2 = PV.panelView({ stat: '作業中', mikomi: '30分' }, [], [], nS).noEstimate, ne3 = PV.panelView({ stat: '待ち', mikomi: '' }, [], [], nS).noEstimate;
        if (h62.indexOf('見込み未記入') < 0 && h62b.indexOf('見込み不明') < 0 && /あと [0-9]+分/.test(h62) && ne1 === true && ne2 === false && ne3 === false) { ok('見込みを書いていない作業中：箱に赤い「見込み未記入／不明」は出ず、state.json の panelView.noEstimate=true に残る（書いてあれば false）'); } else { ng('見込み未記入の扱いが違う：' + [h62.indexOf('見込み未記入'), h62b.indexOf('見込み不明'), ne1, ne2, ne3].join('｜')); }
        if (h4.indexOf('<span class="pg-now">下請け・台帳の整理、雲・札と状態の配信</span>') >= 0 && h4.indexOf('下請け：') < 0 && h4.indexOf('落ちた段') < 0) { ok('箱の上には今動かしている物の一行だけ（裏方の一本ずつの行は箱に出さない）'); } else { ng('箱の上に裏方の一本ずつが残っている／今動かしている物が無い'); }
        const sl = e4.stLine.innerHTML;
        if (e4.stLine.hidden === true && e4.btnSteps.textContent === 'くわしく' && /▶ 進行中：下請け：台帳の整理（01:12〜）/.test(sl) && /⏳ 予定：雲：札と状態の配信/.test(sl) && /✅ 完了：雲：自動検査と配信（01:12〜01:20・落ちた・落ちた段：速い版）/.test(sl) && sl.indexOf('✅ 完了：段2') >= 0 && sl.indexOf('✅') < sl.indexOf('▶') && sl.indexOf('▶') < sl.indexOf('⏳')) { ok('釦は「くわしく」・ふだんは閉じる。中は完了→進行中→予定の順に、段と裏方の一本ずつが分かれて入る'); } else { ng('くわしくの中身が違う：' + e4.btnSteps.textContent + '・hidden=' + e4.stLine.hidden + '・' + sl.replace(/<[^>]+>/g, '|').slice(0, 300)); }
        const e4o = paint(E4, U3, true);
        if (e4o.btnSteps.textContent === 'とじる' && e4o.stLine.hidden === false) { ok('押すと開き、字は「とじる」'); } else { ng('開いた時が違う：' + e4o.btnSteps.textContent + '・hidden=' + e4o.stLine.hidden); }
        const E2 = set(c2, 3000, 3000, 1200), E3 = set(c3, 3000, 3000, 1200), h2 = paint(set(c1, 2400, 2400, 1200), U([{ id: 'a', desc: 'パネル直し', start: '01:01' }]), false).progBox.innerHTML, h2b = paint(E2, U([{ id: 'a', desc: 'パネル直し', start: '01:01' }]), false).progBox.innerHTML, h3 = paint(E3, U([{ id: 'a', desc: 'パネル直し', start: '01:01' }, { id: 'b', desc: '台帳の整理', start: '01:12' }]), false).progBox.innerHTML;
        if (labs(h2) === '2/4 0/1' && labs(h2b) === '2/5 0/1' && labs(h3) === '2/5 0/3' && bars(h3).split(' ')[1] === 'ccc') { ok('増えた時：枠が来て 2/5→2/6（表 2/4→2/5）・下請けと雲が動き出して裏方 0/1→0/3（三本とも青・裏方の横の字は済み/全体）'); } else { ng('増えた時のゲージが違う：' + [labs(h2), labs(h2b), labs(h3), bars(h3)].join('／')); }
        /* v210（本人の枠 七十四）：箱の頭の「あと N分（HH:MM ごろ）」と赤は、パネルの塗り（paintStateLine）と panelView の panel.eta で同じ（同じ state・同じ今の刻） */
        {
          const SD = st({ eta: E4, ura: U3 }), pvE = PV.panelView(SD, [], [], nS), eP = paint(E4, U3, false, { lastStat: SD.stat, lastStartedAt: SD.startedAt, lastMikomiRaw: SD.mikomi, lastMikomiMin: 30 }).progBox.innerHTML;
          const got = (eP.match(/<span class="pg-eta (eta|bad)">[^<]*<\/span>/g) || []).map(x => x.replace(/<span class="pg-eta (eta|bad)">([^<]*)<\/span>/, '$2|$1')).join(' ／ ');
          const want = ['omote', 'ura'].map(k => pvE[k].panel.eta ? pvE[k].panel.eta.t + '|' + pvE[k].panel.eta.c : '').join(' ／ ');
          if (got && got === want) { ok('箱の頭：パネル「' + got + '」＝ panelView の panel.eta（今の仕事の見込みを過ぎた赤も同じ）'); } else { ng('箱の頭がパネルと panelView でずれた：パネル「' + got + '」／panelView「' + want + '」'); }
        }
        const e0 = paint(null, U3, false), h0 = e0.progBox.innerHTML;
        if (ids(h0) === 'omoteSec,uraSec' && h0.indexOf('pg-k') < 0) { ok('区切りの無い古い state（panelView が無い）は v204 の二つの箱のまま'); } else { ng('古い state の時の箱が違う：' + ids(h0)); }
        const fpBad = paint(set(c4, 2400, -600, 2400), U3, false).progBox.innerHTML;
        if (/<b class="pg-k">表の仕事<\/b><span class="pg-eta bad">見込みを過ぎた 10分<\/span>/.test(fpBad)) { ok('表の仕事の終わりを過ぎたら、その箱の頭は赤「見込みを過ぎた 10分」（作法39 ①）'); } else { ng('過ぎた時の赤が出ない'); }
      }
    } catch (e) { ng('三つの箱が回らない：' + e.message); }
    finally { Object.keys(keep).forEach(k => { if (keep[k] === undefined) { delete process.env[k]; } else { process.env[k] = keep[k]; } }); try { fs.rmSync(T, { recursive: true, force: true }); } catch (e) { } }
  }
  /* ---- ⑤の二十一 v207（本人の枠 六十三〜六十七）：くわしくの三つ並び・裏方の一塊・ヨシ待ちの新しい絵・頭の字は短い一言で見出しは固定・時間は箱の頭だけ。
     静かな部分（字面と作り値）。画面の実寸（iPhone の幅で字がはみ出さないか・見出しが動かないか）は ⑤の九・⑤の二十二（ブラウザ・雲）が測る ---- */
  head('⑤の二十一 v207：三つ並び・一塊・新しい絵・短い一言と固定の見出し・時間は頭だけ（字面・作り値）');
  {
    const LF = String.fromCharCode(10), H = html.split(String.fromCharCode(13) + LF).join(LF);
    /* 六十三 → v211（本人の枠 七十八）：くわしくは上の段（#halfRow）の三つ目。三行（#stLine）・終わりましたの一覧（#doneList）は底の八つの下に開く */
    const iH = H.indexOf('<div class="halfrow btn4row" id="halfRow">'), iE = H.indexOf('</div>', H.indexOf('id="doneBox"')), iB = H.indexOf('id="btnSteps"'), iC = H.indexOf(LF + '  </div>', iE), iSh = H.indexOf('<div class="shotsrow btn4row">'), iS = H.indexOf('<ul id="stLine" hidden>'), iD = H.indexOf('<ul id="doneList">');
    if (iH > 0 && iB > iE && iB < iC && iSh > iC && iS > iSh && iD > iS && (H.match(/id="btnSteps"/g) || []).length === 1) { ok('くわしく（#btnSteps）は #halfRow の中の三つ目（遠隔→終わりました→くわしく→まとめて写す）・三行と一覧は底の八つの下・一段まるごとの釦は無い'); } else { ng('くわしくの置き場が違う（' + [iH, iE, iB, iC, iSh, iS, iD].join('・') + '）'); }
    const cssOk = H.indexOf('.btn4row > .cpall, .btn4row > .done-box{flex:1 1 25%; min-width:0; width:auto; margin:0; box-sizing:border-box; min-height:72px; height:72px;}') >= 0 && H.indexOf('.btn4row > .cpall.steps-t{margin:0; font-size:13px;}') >= 0 && /\.btn4row > \.cpall, \.btn4row > \.done-box > \.cpall\{display:flex;[^}]*font-size:13px;[^}]*overflow-wrap:anywhere;[^}]*\}/.test(H);
    if (cssOk) { ok('四つ並びの CSS（v211）：flex:1 1 25%・min-width:0・box-sizing:border-box で四つ等分・高さ72px以上（359px 以下は88px）・字は13pxで折り返す（overflow-wrap:anywhere）・くわしくも同じ字の大きさ'); } else { ng('四つ並びの CSS が無い／違う'); }
    /* 字数の見積もり：320px の視野で一つの釦の幅＝(320−左右の余白28−隙間8×3)÷4＝67px。「くわしく」「とじる」は13px×4字＝52px＋左右8pxで収まる */
    const bw = Math.floor((320 - 28 - 24) / 4), lw = Math.max('くわしく'.length, 'とじる'.length) * 13 + 8;
    if (lw <= bw && H.indexOf("stB.textContent = stepsOpen ? 'とじる' : 'くわしく';") >= 0) { ok('320px でも「くわしく」（' + lw + 'px）は四つ並びの釦の幅（' + bw + 'px）に一行で収まる見積もり（390・375 はもっと広い）'); } else { ng('くわしくの字が釦の幅に収まらない見積もり（' + lw + '／' + bw + '）'); }
    if (H.indexOf("$('btnSteps').addEventListener('click', function () { stepsOpen = !stepsOpen; paintStateLine(); try { paintDoneFold(); } catch (e) { } });") >= 0 && H.indexOf('el.hidden = !(stepsOpen && rows.length);') >= 0) { ok('押した時の動き（完了・進行中・予定が開く／とじる）は今のまま'); } else { ng('くわしくの押した時の動きが変わった'); }
    const dir = path.dirname(SRC), ex = (n) => { try { return fs.statSync(path.join(dir, n)).size; } catch (e) { return 0; } };
    const png = (n) => { try { const b = fs.readFileSync(path.join(dir, n)); return b.readUInt32BE(16) + 'x' + b.readUInt32BE(20); } catch (e) { return ''; } };
    /* 六十五 → v211（本人の枠 七十三）：ヨシ待ちの猫は二枚を交互に（こぶし＝yoshi-machi-240.png・親指＝yoshi-machi2-soroe-240.png）。前の絵 yoshi-machi2-240.png と原版は残す */
    /* v214（本人の枠 九十）：二枚は縁から繋がる外側の白だけを透明にした新しい名の絵（yoshi-machi2-t-240.png・yoshi-machi-t-240.png）。前の絵（soroe・240）と原版は残す */
    if (H.indexOf('var YOSHI_FLIP_MS = 500;') >= 0 && H.indexOf("var YOSHI_FRAMES = ['yoshi-machi2-t-240.png', 'yoshi-machi-t-240.png'];") >= 0 && H.indexOf('var yf = YOSHI_FRAMES[Math.floor(Date.now() / YOSHI_FLIP_MS) % YOSHI_FRAMES.length];') >= 0 && H.indexOf('if (el.src.indexOf(yf) < 0) { el.src = yf; }') >= 0 && H.indexOf("'genba-taiki-80.png'], YOSHI_FRAMES)") >= 0 && png('yoshi-machi2-t-240.png') === '240x240' && png('yoshi-machi-t-240.png') === '240x240' && ex('yoshi-machi2-soroe-240.png') > 0 && ex('yoshi-machi-240.png') > 0 && ex('yoshi-machi2-240.png') > 0 && ex('yoshi-machi2_src.jpeg') > 0 && ex('yoshi-machi_src.jpeg') > 0) { ok('ヨシ待ちの猫は二枚（yoshi-machi2-t-240.png・yoshi-machi-t-240.png・どちらも 240x240）を YOSHI_FLIP_MS＝500ms ごとに交互に・二枚とも先読み・前の絵（soroe・240）と原版は残る'); } else { ng('ヨシ待ちの二枚の置き方が違う（' + png('yoshi-machi2-t-240.png') + '・' + png('yoshi-machi-t-240.png') + '・前の絵 ' + ex('yoshi-machi2-soroe-240.png') + '/' + ex('yoshi-machi-240.png') + '・原版 ' + ex('yoshi-machi2_src.jpeg') + '/' + ex('yoshi-machi_src.jpeg') + '）'); }
    /* v214（本人の枠 九十）・v215：絵の全体を枠に収める（contain）・箱の地はパネルの黒い地（--bg）・ヨシ待ちの間だけ class="yoshi-fit"・枠の 80x80 は今のまま */
    if (H.indexOf('#runcat.yoshi-fit{object-fit:contain; background:var(--bg);}') >= 0 && H.indexOf('var yoshiNow = yoshiWaitN() > 0 && !lastLost;') >= 0 && H.indexOf("if (el.className !== (yoshiNow ? 'yoshi-fit' : '')) { el.className = yoshiNow ? 'yoshi-fit' : ''; }") >= 0 && /html,body\{margin:0; background:var\(--bg\);/.test(H) && /#runcat\{width:80px; height:80px; flex:0 0 auto;/.test(H)) { ok('ヨシ待ちの絵は object-fit:contain で全体が 80x80 の枠に収まる・箱の地は body と同じ --bg・class="yoshi-fit" はヨシ待ちの間だけ（ほかの猫は object-fit:none のまま）'); } else { ng('ヨシ待ちの絵の収め方（contain・地の色・class の付け外し）が無い／違う'); }
    /* v215（雲の ⑤の二十二で落ちた：ヨシ待ちだけ猫の上端が 10 → 5）：v214 の class="yoshi" はヨシの釦の .yoshi（display:block・min-height:76px・margin:0 0 10px）にも当たり、
       h1（flex・align-items:center・高さ 80px）の中で猫の余白の箱が 90px になって 5px 上へずれた。#runcat に付ける class に当たる CSS の決まりを全部拾い、
       ①その名だけの決まり（.名{…}）が無い ②#runcat.名 の決まりは描き方（object-fit・background・image-rendering）だけで、箱の寸法・位置・余白を持たない、を字面で見る。
       これで、ヨシ待ちの一言とほかの一言で、⑤の二十二の六値（題の左・上・幅・高さ、猫の左・上）は同じになる。 */
    {
      const css = (H.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || []).join(LF).replace(/\/\*[\s\S]*?\*\//g, '');
      const names = Array.from(new Set((H.match(/el\.className = yoshiNow \? '([A-Za-z0-9_-]+)'/g) || []).map(x => x.replace(/^.*\? '([^']+)'$/, '$1'))));
      const why = [];
      if (!names.length) { why.push('#runcat に付ける class の名が読めない'); }
      names.forEach(nm => {
        const re = new RegExp('([^{}]*)\\{([^{}]*)\\}', 'g'); let m;
        while ((m = re.exec(css))) {
          const sels = m[1].split(',').map(x => x.trim()).filter(x => new RegExp('\\.' + nm + '(?![A-Za-z0-9_-])').test(x));
          sels.forEach(sel => {
            if (sel !== '#runcat.' + nm) { why.push('「' + sel + '」の決まりにも当たる（' + m[2].trim().slice(0, 60) + '）'); return; }
            const props = m[2].split(';').map(x => x.split(':')[0].trim()).filter(Boolean);
            const badP = props.filter(p => ['object-fit', 'background', 'background-color', 'image-rendering'].indexOf(p) < 0);
            if (badP.length) { why.push('#runcat.' + nm + ' が箱を変える指定を持つ（' + badP.join('・') + '）'); }
          });
        }
      });
      if (!why.length) { ok('ヨシ待ちの class（' + names.join('・') + '）に当たる CSS は #runcat.' + names.join('/') + ' だけで、描き方（contain・地の色）しか持たない＝猫の箱の位置・大きさ・余白はほかの一言と同じ（⑤の二十二の六値が揃う。v214 は釦の .yoshi の margin:0 0 10px で上端が 5px ずれた）'); } else { ng('ヨシ待ちの class が猫の箱を変える：' + why.join('／')); }
    }
    /* 二枚の揃い（画素）：RGB の差の和が60を超える画素が、手の所（x 25〜100・y 70〜140）の外に一つも無い＝字も猫の位置と大きさも同じ。切り替えて動くのは手だけ */
    {
      const zlib = require('zlib');
      const dec = (n) => { const b = fs.readFileSync(path.join(dir, n)); let p = 8, w = 0, h = 0, ct = 0; const id = []; while (p < b.length) { const L = b.readUInt32BE(p), t = b.toString('ascii', p + 4, p + 8), d = b.slice(p + 8, p + 8 + L); if (t === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; if (d[8] !== 8 || d[12]) { throw new Error(n + '：8bit の非インタレースでない'); } } if (t === 'IDAT') { id.push(d); } p += 12 + L; }
        const ch = { 2: 3, 6: 4 }[ct]; if (!ch) { throw new Error(n + '：色の型 ' + ct); } const raw = zlib.inflateSync(Buffer.concat(id)), st = w * ch, out = Buffer.alloc(h * st); let prev = Buffer.alloc(st);
        for (let y = 0; y < h; y++) { const ft = raw[y * (st + 1)], cur = Buffer.alloc(st); for (let x = 0; x < st; x++) { const a = x >= ch ? cur[x - ch] : 0, u = prev[x], c = x >= ch ? prev[x - ch] : 0; let v = raw[y * (st + 1) + 1 + x]; if (ft === 1) { v += a; } else if (ft === 2) { v += u; } else if (ft === 3) { v += (a + u) >> 1; } else if (ft === 4) { const pp = a + u - c, pa = Math.abs(pp - a), pb = Math.abs(pp - u), pc = Math.abs(pp - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? u : c); } cur[x] = v & 255; } cur.copy(out, y * st); prev = cur; }
        return { w, h, ch, d: out }; };
      try {
        /* v214：透明を持つ二枚。alpha の差と、alpha を掛けた RGB の差の和（>60）を数える（半透明の縁は薄いので差も薄く数える）。手の所の外では 0 */
        const A = dec('yoshi-machi-t-240.png'), B = dec('yoshi-machi2-t-240.png'); let outN = 0, inN = 0;
        for (let y = 0; y < A.h; y++) { for (let x = 0; x < A.w; x++) { const i = (y * A.w + x) * A.ch, j = (y * B.w + x) * B.ch; const aA = A.ch === 4 ? A.d[i + 3] : 255, aB = B.ch === 4 ? B.d[j + 3] : 255; const df = Math.abs(aA - aB) + [0, 1, 2].reduce((t, c) => t + Math.abs(A.d[i + c] * aA - B.d[j + c] * aB) / 255, 0); if (df > 60) { if (x >= 25 && x <= 100 && y >= 70 && y <= 140) { inN++; } else { outN++; } } } }
        if (A.w === B.w && A.h === B.h && outN === 0 && inN > 0) { ok('二枚の揃い（画素）：手の所の外で違う画素は 0（字・猫の位置・大きさ・透明の形が同じ）・手の所は ' + inN + ' 画素違う（こぶしと親指）'); } else { ng('二枚がずれている：手の所の外で違う画素 ' + outN + '（手の所 ' + inN + '・' + A.w + 'x' + A.h + '／' + B.w + 'x' + B.h + '）'); }
        /* v214：透明を持つこと＝色の型 6・四隅の alpha が 0・外側の白が透明で、お腹（真ん中 x 110〜130・y 140〜160）は不透明の白のまま */
        const tr = [A, B].map((P) => { const al = (x, y) => P.d[(y * P.w + x) * P.ch + 3]; const corners = [al(0, 0), al(P.w - 1, 0), al(0, P.h - 1), al(P.w - 1, P.h - 1)]; let clear = 0, belly = 0, bellyN = 0; for (let k = 3; k < P.d.length; k += 4) { if (P.d[k] === 0) { clear++; } } for (let y = 140; y <= 160; y++) { for (let x = 110; x <= 130; x++) { const o = (y * P.w + x) * 4; bellyN++; if (P.d[o + 3] === 255 && P.d[o] >= 215 && P.d[o + 1] >= 215 && P.d[o + 2] >= 215) { belly++; } } } return { ok: P.ch === 4 && corners.every(v => v === 0) && clear > P.w * P.h / 4 && belly === bellyN, s: 'ch' + P.ch + '・四隅 ' + corners.join(',') + '・透明 ' + clear + '・お腹の白 ' + belly + '/' + bellyN }; });
        if (tr[0].ok && tr[1].ok) { ok('二枚とも透明を持つ PNG（色の型 6・四隅の alpha 0・外側の白が透明・お腹の白は不透明のまま）：' + tr.map(t => t.s).join('／')); } else { ng('二枚の透明が違う：' + tr.map(t => t.s).join('／')); }
      } catch (e) { ng('二枚の画素が読めない：' + e.message); }
    }
    if (H.indexOf("el.src = 'genba-cat-80.png'") >= 0 && H.indexOf("'cat-sleep-w.png', 'genba-cat-80.png', 'genba-taiki-80.png'") >= 0) { ok('ほかの猫（作業中・待ち・指差し）の絵は今のまま'); } else { ng('ほかの猫の絵が変わった'); }
    /* 六十六：見出しの「返事パネル」は一行・固定幅・猫は 80x80 で縮まない・行の高さは 80px 固定 */
    const hOk = H.indexOf('<h1><span id="hTitle"></span><img id="runcat"') >= 0 && /#hTitle\{flex:0 0 auto; white-space:nowrap; width:6em;/.test(H) && H.indexOf('h1{height:80px;') >= 0 && /#runcat\{width:80px; height:80px; flex:0 0 auto;/.test(H);
    if (hOk) { ok('見出し：「返事パネル」は white-space:nowrap・幅 6em 固定・縮まない（flex:0 0 auto）／猫は 80x80・縮まない／行の高さ 80px 固定'); } else { ng('見出しの固定の指定が無い／違う'); }
    /* 頭の字は短い一言だけ：総当たりで出る字の種類を数え、括弧・次「・刻が一つも無いこと */
    {
      const PV = require(path.join(dir, 'panel-view.js')), NOW = 1795200000, seen = {};
      const URAS = [null, { sub: { running: 1, items: [{ id: 'a' }], recent: [] }, cloud: { running: [], recent: [] } }, { sub: { items: [], recent: [] }, cloud: { running: [{ id: 1 }], recent: [] } }];
      ['', '作業中', '検査中', '待ち', 'ヨシ待ち', '動きなし', '止まり（使用量・13:00 にリセット）', '待機中', '手待ち'].forEach(st => URAS.forEach(u => [0, NOW - 60, NOW - 400].forEach(ow => [0, 1].forEach(k => [0, 1].forEach(rw => {
        const h = PV.panelView({ stat: st, detail: '残りの段 2・次「作り値」', ura: u, cardOwedAt: ow, cardOwedEta: ow ? ow + 150 : 0, kumo: k ? '雲：検査 見込み 23:59' : '', cloud: st === '' ? '検査中：v1 の走り' : '', help: '裏で手伝い 1本', evAt: NOW - 30 }, rw ? [{ time: NOW - 20, title: 'x', message: 'y' }] : [], [], NOW).head;
        seen[h] = 1;
      })))));
      const ks = Object.keys(seen), badK = ks.filter(t => /[（(「：:]|[0-9]/.test(t) || t.length > 10);
      if (!badK.length) { ok('頭の字は短い一言だけ（' + ks.length + '種：' + ks.join('／') + '）・括弧・次「…」・件名・刻は付かない'); } else { ng('頭の字に括弧・刻などが残る：' + badK.join('／')); }
      const h1 = PV.panelView({ stat: '作業中', ura: URAS[1] }, [], [], NOW).head, h2 = PV.panelView({ stat: '待ち', ura: URAS[1] }, [], [], NOW).head, h3 = PV.panelView({ stat: '待ち', ura: null }, [], [], NOW).head;
      if (h1 === '作業中、、、。' && h2 === '裏方作業中、、、。' && h3 === '休憩中、、、。') { ok('出し分け：窓が手を動かす＝「' + h1 + '」（下請けが動いていてもこちらが先）／窓は待つが裏方が動く＝「' + h2 + '」／何も動かない＝「' + h3 + '」'); } else { ng('出し分けが違う：' + [h1, h2, h3].join('｜')); }
    }
    /* 六十八：版の行の右端は「更新 HH:MM」（字が前・刻が後ろ）。行は今までどおり flex-wrap（版の字が長いので「版…」の下の行に「最終確認 HH:MM」と並ぶ）。下の行の見積もり：最終確認 HH:MM（4字×13px＋5字×7px）＋隙間14px＋更新 HH:MM（2字×13px＋6字×7px）≦ 320px の行幅 292px */
    {
      const lw2 = (4 * 13 + 6 * 7) + 14 + (2 * 13 + 6 * 7);
      if (H.indexOf("$('stat').textContent = '更新 ' + hhmm(Math.floor(Date.now() / 1000));") >= 0 && H.indexOf("+ ' 更新'") < 0 && H.indexOf("s.textContent = '最終確認 ' + (atSec ? hhmm(atSec) : '—');") >= 0 && !/\.facts \.upd\{[^}]*margin-left:auto/.test(H) && /\.facts\{display:flex; flex-wrap:wrap; gap:4px 14px;/.test(H) && H.indexOf('@media (max-width: 359px) { .facts #fVer{flex:0 0 100%;} }') >= 0 && lw2 <= 292) { ok('版の行の終わりは「更新 HH:MM」（最終確認と同じく字が前）・v214（枠 九十一）：.facts .upd に margin-left:auto が無い＝右の端へ寄せず、最終確認のすぐ後ろに gap 14px で並ぶ・359px 以下では版の字を一段まるごとにし（v208）、最終確認と並ぶ下の段は約' + lw2 + 'px で 320px の行幅 292px に一行で収まる見積もり（実寸は ⑤の二十二・雲）'); } else { ng('「更新 HH:MM」の字面か行の指定が違う'); }
    }
    /* 六十九：使用量の三本（#usageTag・#usageMsg）はゲージの箱（#progBox）のすぐ下の兄弟（箱の中ではないので、箱が隠れても同じ場所に出る）・くわしくより上。見た目（.usage の CSS）は今のまま */
    {
      const a = H.indexOf('<div class="progbox hide" id="progBox" data-pname="表の仕事と裏方のゲージの箱"></div>'), u = H.indexOf('<div class="usage" id="usageTag" hidden></div>'), m = H.indexOf('<p class="usage-msg" id="usageMsg" hidden></p>'), k = H.indexOf('id="btnSteps"'), hd = H.indexOf('</header>'), sh = H.indexOf('<div class="shotsrow btn4row">');
      const between = (hd >= 0 && u > hd) ? H.slice(hd + 9, u).split('<!--').map((x, i) => i ? x.slice(x.indexOf('-->') + 3) : x).join('').trim() : 'x';   /* v220：見出し（</header>）と使用量の間に何も無い */
      if (hd >= 0 && u > hd && m > u && a > m && k > a && sh > a && between === '' && (H.match(/id="usageTag"/g) || []).length === 1 && H.indexOf('.usage{display:flex; gap:8px; justify-content:center; align-items:flex-end;') >= 0) { ok('使用量の三本は見出しのすぐ下＝一番上（間に何も無い・箱の外）→ ゲージの箱 → くわしく・ボタンの段・.usage の見た目は今のまま（v220）'); } else { ng('使用量の置き場が違う（' + [a, u, m, k, sh, JSON.stringify(between.slice(0, 40))].join('・') + '）'); }
    }
    /* 六十七：箱の組み立てにゲージの下の「全部終わる見込み」の行が無い（時間は頭の headEta だけ） */
    const P = (function () { const a = H.indexOf('  function paintStateLine('); const b = H.indexOf(LF + '  }', a); return a >= 0 ? H.slice(a, b) : ''; })(), sh = P.slice(P.indexOf('var secH = function'), P.indexOf('html5 = secH('));
    if (sh && sh.indexOf('etaRow(') < 0 && sh.indexOf('全部終わる見込み 未定') < 0 && sh.indexOf('headEta(') >= 0) { ok('三つの箱の組み立て（secH）は頭の「あと N分」（headEta）だけで、ゲージの下の終わりの行を積まない（過ぎた時の赤も頭の一行）'); } else { ng('箱の組み立てにゲージの下の終わりの行が残っている'); }
  }
  /* ---- ⑤の二十三 一塊の数え方（v207・本人の枠 六十四）：endat.js の束を作り値で回す。本物の控えは読まない・書かない ---- */
  head('⑤の二十三 裏方の一塊（0本から動き出し全部済んで0本に戻るまで・済んだ物は緑で残す・次は0から）');
  {
    const os = require('os'), T = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-endat23-')), LF = String.fromCharCode(10), W = (n, t) => { const p = path.join(T, n); fs.writeFileSync(p, t); return p; };
    const J = (x) => Math.floor(Date.parse('2026-11-22T' + x + ':00+09:00') / 1000);
    const keep = {}, env = { ENDAT_ORDERS: W('orders.tsv', ''), ENDAT_NOTES: W('notes.log', ''), ENDAT_STEPS: W('steps.txt', ''), ENDAT_SUBLOG: W('sub.jsonl', ''), ENDAT_CLOUD: W('cloud.json', '{"list":[]}'), ENDAT_BASE: path.join(T, 'base.json'), ENDAT_BUNDLE: path.join(T, 'bundle.json'), ENDAT_EST: path.join(T, 'none.json') };
    Object.keys(env).forEach(k => { keep[k] = process.env[k]; process.env[k] = env[k]; });
    try {
      const EA = require(path.join(path.dirname(SRC), 'endat.js')), PV = require(path.join(path.dirname(SRC), 'panel-view.js'));
      const U = (items, recent, cl, cr) => ({ sub: { items: items, recent: recent || [] }, cloud: { running: cl || [], recent: cr || [] } });
      const g = (ura, t) => { const e = EA.compute({ stat: '手待ち', ura: ura }, J(t)); const b = PV.boxSpec(e, ura, 'ura'); return { s: e.ura.seg.done + '/' + e.ura.seg.total + 'r' + e.ura.seg.run, lab: b ? b.lab : '', shown: !!(b && b.total - b.done > 0) }; };
      const old = { id: 'old', desc: '前の塊', start: '01:00', end: '01:05' };
      const r0 = g(U([], [old]), '02:00');
      const r1 = g(U([{ id: 'a', desc: 'A', start: '02:01' }, { id: 'b', desc: 'B', start: '02:01' }], [old]), '02:02');
      const r2 = g(U([{ id: 'b', desc: 'B', start: '02:01' }], [{ id: 'a', desc: 'A', start: '02:01', end: '02:05' }, old]), '02:06');
      const r2b = g(U([{ id: 'b', desc: 'B', start: '02:01' }], [{ id: 'c', desc: 'C', start: '02:07', end: '02:08' }, { id: 'a' }, old], [], [{ id: 9, name: '雲の速い走り', at: '02:07', upd: '02:08' }]), '02:09');
      const r3 = g(U([], [{ id: 'b' }, { id: 'c' }, { id: 'a' }, old], [], [{ id: 9 }]), '02:15');
      const r4 = g(U([{ id: 'd', desc: 'D', start: '02:20' }], [{ id: 'b' }, { id: 'c' }, { id: 'a' }, old], [], [{ id: 9 }]), '02:20');
      const seq = [r0, r1, r2, r2b, r3, r4].map(x => x.s + '(' + x.lab + (x.shown ? '' : '・箱なし') + ')').join(' → ');
      if (r0.s === '0/0r0' && !r0.shown && r1.s === '0/2r2' && r1.lab === '0/2' && r1.shown && r2.s === '1/2r1' && r2.lab === '1/2' && r2b.s === '3/4r1' && r2b.lab === '3/4' && r3.s === '4/4r0' && !r3.shown && r4.s === '0/1r1' && r4.lab === '0/1' && r4.shown) { ok('一塊：' + seq + '（巡回の合間に始まって済んだ下請け C と雲 9 も数える・塊の前に済んだ「old」は数えない・全部済めば箱は消え・次は 0/1 から）'); } else { ng('一塊の数え方が違う：' + seq); }
      const all4 = EA.compute({ stat: '手待ち', ura: U([{ id: 'd' }], [{ id: 'b' }]) }, J('02:21')).all.seg;
      if (all4.total >= 1 && all4.run === 1) { ok('全部の箱は表と裏方の束の和のまま（枠 五十五の数え方は崩さない）'); } else { ng('全部の箱の数えが違う：' + JSON.stringify(all4)); }
    } catch (e) { ng('一塊が回らない：' + e.message); }
    finally { Object.keys(keep).forEach(k => { if (keep[k] === undefined) { delete process.env[k]; } else { process.env[k] = keep[k]; } }); try { fs.rmSync(T, { recursive: true, force: true }); } catch (e) { } }
  }
  /* ---- ⑤の二十五 v210（本人の枠 七十四）：数え方と字の組み立ては panel-core.js 一つ。
     パネル（panel.html の包み＋panel-core.js）と VAIO の panelView（panel-view.js）に同じ作り値（札・押し通知・センコの印・state）を渡し、同じ残り・同じ頭の字・同じ釦の字を返すかを総当たりで見る。
     あわせて、二か所に写しが残っていないこと・ブラウザが panel-core.js を読む道（script の指定・版・公開の荷・雲の振り分け）を字面で見る（ブラウザでの実際の読み込みは ⑯の二・雲） ---- */
  head('⑤の二十五 panel-core.js 一つ：同じ札・押し通知・印・state で、パネルと panelView が同じ残り・同じ頭の字（作り値・総当たり）／写しが無い／読み込みの道');
  {
    const LF = String.fromCharCode(10), H = html.split(String.fromCharCode(13) + LF).join(LF), dir = path.dirname(SRC);
    const PV = require(path.join(dir, 'panel-view.js')), PVS = fs.readFileSync(path.join(dir, 'panel-view.js'), 'utf8');
    /* 一、写しが無い：panel.html の同じ名の関数は panel-core.js への包み（一行）。panel-view.js には同じ名の関数が一つも無い */
    const WR = ['omoteLines', 'endLine', 'endShort', 'uraCount', 'boxSpec', 'headEta', 'etaRow', 'uraLines', 'isCountCard', 'ntfyOfCard', 'senkoEpoch', 'uraBusyText', 'newestTime', 'pad2s'];
    const WR2 = { mergedTodo: 'todoList', cardsPending: 'cardsPending', cardEtaSec: 'cardEtaSec', cardLate: 'cardLate', cardPendText: 'cardPendText', kumoEtaSec: 'kumoEtaSec', isRunning: 'isRunning', headText: 'headText' };
    const own = WR.filter(n => { const a = cutFn(H, n); return !a || a.indexOf(LF) >= 0 || a.indexOf('return core().' + n + '(') < 0; }).concat(Object.keys(WR2).filter(n => { const a = cutFn(H, n); return !a || a.indexOf('core().' + WR2[n] + '(') < 0; }));
    const pvOwn = WR.concat(Object.keys(WR2), ['todoList', 'todoLabel', 'workLate', 'uraGauge', 'stepLab', 'omoteGauge', 'cardArg']).filter(n => PVS.indexOf('function ' + n + '(') >= 0);
    if (!own.length && !pvOwn.length && PVS.indexOf("require(path.join(ROOT, 'panel-core.js'))") >= 0 && PV.core === PCORE) { ok('写しが無い：panel.html の ' + (WR.length + Object.keys(WR2).length) + ' の関数は panel-core.js への包みだけ・panel-view.js は panel-core.js を require して同じ名の関数を持たない'); } else { ng('写しが残っている（panel.html ' + own.join('・') + '／panel-view.js ' + pvOwn.join('・') + '）'); }
    const lab = H.indexOf('var lab = core().todoLabel(n);') >= 0 && H.indexOf("b.setAttribute('aria-label', lab);") >= 0, ugo = H.indexOf("var ug = core().uraGauge(") >= 0 && H.indexOf('core().workLate(lastStat, lastStartedAt, lastMikomiRaw, nS, lastMikomiAt, (lastEta && lastEta.omote && lastEta.omote.cur) ? lastEta.omote.cur.endSec : 0)') >= 0 && H.indexOf('core().stepLab(d, n)') >= 0;
    if (lab && ugo) { ok('釦の字（todoLabel）・裏方のゲージ（uraGauge）・見込みを過ぎた赤（workLate）・段の小さい字（stepLab）もパネルは panel-core.js の物を使う（panelView の label・ura.panel・箱の eta・omote.panel.gauge と同じ）'); } else { ng('釦の字・裏方のゲージ・見込みの赤・段の字のどれかを panel.html が自分で組んでいる（' + [lab, ugo].join('・') + '）'); }
    /* 二、読み込みの道：<script src="panel-core.js?_v=<PANEL_VER>"> が一つ・本の <script> より前・panel-core.js の VER＝PANEL_VER・UMD・読めない時は一度だけ読み直す */
    const pv0 = (H.match(/var PANEL_VER = '([0-9]+)'/) || [])[1] || '', tag = '<script src="panel-core.js?_v=' + pv0 + '"></script>';
    const iT = H.indexOf(tag), iM = H.indexOf('<script>'), nT = H.split('panel-core.js?_v=').length - 1, CS = fs.readFileSync(CORE_FILE, 'utf8');
    if (pv0 && iT > 0 && iM > iT && H.split(tag).length === 2 && PCORE.VER === pv0 && /module\.exports = m/.test(CS) && /root\.PanelCore = m/.test(CS) && !/document\.|localStorage|fetch\(|Date\.now\(/.test(CS.replace(/\/\*[\s\S]*?\*\//g, ''))) { ok('読み込み：' + tag + ' が一つ・本の script より前・panel-core.js の VER も ' + pv0 + '・UMD（node は module.exports／ブラウザは window.PanelCore）・中で DOM／localStorage／fetch／今の刻を使わない'); } else { ng('panel-core.js の読み込みの道が違う（PANEL_VER ' + pv0 + '・script の位置 ' + iT + '／' + iM + '・指定 ' + nT + '件・VER ' + PCORE.VER + '）'); }
    const ck = cutFn(H, 'checkCore');
    if (ck.indexOf("'panel-core.js?_v=' + PANEL_VER + '&_r=' + Date.now()") >= 0 && ck.indexOf('coreTried') >= 0 && H.indexOf('    checkCore();   /* v210 */') >= 0 && cutFn(H, 'headText').indexOf("if (!window.PanelCore) { return '部品が読めない'; }") >= 0 && cutFn(H, 'core').indexOf("throw new Error('panel-core.js が読めない')") >= 0) { ok('読めない・版が違う時：取り置きを破る字を付けて一度だけ読み直す（堂々巡りしない）・頭の字は「部品が読めない」・数は黙って0件にせず投げる'); } else { ng('panel-core.js が読めない時の落ち方が違う'); }
    /* 三、公開の荷と雲の振り分け：pack-site.js は直下の物を全部載せる（飛ばす段・声の台帳の名に当たらない）・scope-pick はパネルの物と見る */
    { const PS = fs.readFileSync(path.join(dir, 'pack-site.js'), 'utf8'), pk = require(path.join(dir, 'pack-site.js')), sp = require(path.join(dir, 'scope-pick.js'));
      const skip = (PS.match(/SKIP_TOP = new Set\(\[([^\]]*)\]\)/) || [])[1] || '';
      if (skip && skip.indexOf('panel-core') < 0 && !pk.isManaged('panel-core.js') && sp.pick('panel-core.js').heavy === 1 && sp.pick('panel-core.js').body === 0) { ok('公開の荷に入る（pack-site.js は直下の panel-core.js を載せる）・panel-core.js だけの押しでもパネルの検査を回してから配る（scope-pick）'); } else { ng('panel-core.js が公開の荷に入らない／雲の振り分けでパネルの物と見られない'); } }
    /* 四、同じ作り値の総当たり：パネルの包み（mergedTodo・headText）を panel-core.js と一緒に回した残り・頭の字・釦の字と、panelView の left・head・label が全部同じか */
    const PN = ['core', 'cardArg', 'cardsPending', 'cardEtaSec', 'cardLate', 'cardPendText', 'kumoEtaSec', 'uraBusyText', 'yoshiWaitN', 'headObj', 'headText', 'mergedTodo', 'senkoEpoch'], psrc = PN.map(n => cutFn(H, n));
    if (psrc.some(x => !x)) { ng('パネルの包みが切り出せない（' + PN.filter((n, i) => !psrc[i]).join('・') + '）'); }
    else {
      const VV = ['lastStat', 'lastCloud', 'lastDetail', 'lastUra', 'lastLost', 'lastChecking', 'lastResting', 'lastCardOwedAt', 'lastCardOwedEta', 'allRows', 'lastKumo', 'ntfySent', 'copied', 'ntfyCopied', 'Date'];
      const pf = new Function('S', 'var window = S.win, keyOf = S.keyOf, ntfyKeyOf = S.keyOf, copyLeft = 0, lastYoshiOpen = [], lastStepTotal = 0, lastStepDone = 0, lastFoot = {}, ' + VV.map(v => v + ' = S.' + v).join(', ') + ';' + LF + psrc.join(LF) + LF + 'var lastSenkoReadAt = senkoEpoch(S.senkoReadAt);' + LF + 'copyLeft = mergedTodo().length;' + LF + 'return { left: copyLeft, head: headText(), label: core().todoLabel(copyLeft) };');
      const NOW = 1795290000, Dfix = class extends global.Date { constructor(...a) { if (a.length) { super(...a); } else { super(NOW * 1000); } } static now() { return NOW * 1000; } };
      const keyOf = (d) => String(d.time || 0) + '|' + String(d.title || '');
      const panelOf = (d, cards, ntfys, cp) => { const c = {}; (cp || []).forEach(k => { c[k] = 1; }); return pf({ win: WIN, keyOf: keyOf, Date: Dfix, senkoReadAt: d.senkoReadAt, lastStat: String(d.stat || ''), lastCloud: (typeof d.cloud === 'string') ? d.cloud : '', lastDetail: (typeof d.detail === 'string') ? d.detail.replace(/（なし）/g, '') : '', lastUra: (d.ura && typeof d.ura === 'object') ? d.ura : null, lastLost: false, lastChecking: false, lastResting: false, lastCardOwedAt: (typeof d.cardOwedAt === 'number') ? d.cardOwedAt : 0, lastCardOwedEta: (typeof d.cardOwedEta === 'number') ? d.cardOwedEta : 0, allRows: cards, lastKumo: (typeof d.kumo === 'string') ? d.kumo : '', ntfySent: ntfys, copied: c, ntfyCopied: {} }); };
      const C1 = { title: '⏭ 定時の再起動は見送った（点検・返事不要）', time: 1795284621, message: '再起動の10分後の通し点検', eid: '', pushedAt: 0 }, C2 = { title: '🪟 自動の続きが止まった（起こした）', time: 1795281728, message: '使用量の枠は…', eid: '', pushedAt: 0 };
      const C3 = { title: '✅ 終わりました（返事不要）', time: 1795284370, message: 'x', eid: 'e1795284367', pushedAt: 0 }, CN = { title: '✅ 終わりました（返事不要）', time: 1795289000, message: '写せます（2件）' }, C4 = { title: '🔎 調べました', time: 1795288800, message: '印より後の札' };
      const N1 = { time: 1795284680, title: C1.title, eid: '' }, N2 = { time: 1795281738, title: C2.title, eid: '' }, N3 = { time: 1795284800, title: '😽 終わったにゃ、写して', eid: 'e1795284367' }, N4 = { time: 1795288900, title: '☁️ 雲の走りが落ちた（x）', eid: '' }, N5 = { time: C1.time + 1200, title: C1.title, eid: '' };
      const CARDS = [[], [C1, C2], [C3, CN], [C1, C2, C3, C4, CN]], NTFYS = [[], [N1, N2], [N3], [N4, N5], [N1, N2, N3, N4, N5]], READS = ['', '2026-11-22 02:22:10', '2026-11-22 03:10:22', '2026-11-22 04:30:00', 'ばらばら'];
      const URAS = [null, { sub: { running: 1, items: [{ id: 'a' }], recent: [] }, cloud: { running: [], recent: [] } }];
      const STATS = ['', '作業中', '検査中', '待ち', 'ヨシ待ち', '動きなし', '止まり（使用量・13:00 にリセット）', '手待ち'];
      let n = 0, badN = 0, seenL = {}, seenH = {};
      CARDS.forEach(cards => NTFYS.forEach(ntfys => READS.forEach(rd => STATS.forEach(st => URAS.forEach(ura => [0, NOW - 60, NOW - 400].forEach(ow => [0, 1].forEach(k => {
        const d = { stat: st, detail: '残りの段 2・次「作り値」（なし）', ura: ura, cardOwedAt: ow, cardOwedEta: ow ? ow + 150 : 0, kumo: k ? '雲：検査 見込み 23:59' : '', cloud: st === '' ? '検査中：v1 の走り' : '', senkoReadAt: rd };
        const p = panelOf(d, cards, ntfys), v = PV.panelView(d, cards, ntfys, NOW); n++; seenL[v.left] = 1; seenH[v.head] = 1;
        if (p.left !== v.left || p.head !== v.head || p.label !== v.label) { badN++; if (badN <= 3) { note('差：' + JSON.stringify({ st, rd, cards: cards.length, ntfys: ntfys.length, ow, k }) + '／パネル ' + JSON.stringify(p) + '／panelView ' + JSON.stringify({ left: v.left, head: v.head, label: v.label })); } }
      })))))));
      if (badN === 0 && Object.keys(seenL).length >= 3 && Object.keys(seenH).length >= 6) { ok('同じ作り値 ' + n + '組すべてで、パネルと panelView の残り・頭の字・釦の字が同じ（残りは ' + Object.keys(seenL).sort().join('・') + ' 件の組・頭の字は ' + Object.keys(seenH).length + '種）'); } else { ng('パネルと panelView がずれた組 ' + badN + '／' + n + '（残りの種類 ' + Object.keys(seenL).join('・') + '・頭の字 ' + Object.keys(seenH).length + '種）'); }
      /* 03:41 の形（本人の画面 残1・panelView 0件）：印 03:10:22 の後に、印より前の札と同じ題の押し通知が来た。同じ物で数えれば両方0 */
      const a341 = panelOf({ stat: '手待ち', senkoReadAt: '2026-11-22 03:10:22' }, [C1, C2], [N1, N2]), v341 = PV.panelView({ stat: '手待ち', senkoReadAt: '2026-11-22 03:10:22' }, [C1, C2], [N1, N2], NOW);
      if (a341.left === 0 && v341.left === 0 && a341.head === v341.head && v341.coreVer === PCORE.VER) { ok('03:41 の形（印 03:10:22・札 03:10:21＋押し通知 03:11:20）：パネルも panelView も 0件・頭の字「' + v341.head + '」・panelView に組んだ部品の版（coreVer ' + v341.coreVer + '）が載る'); } else { ng('03:41 の形がずれた：パネル ' + JSON.stringify(a341) + '／panelView ' + v341.left + '・' + v341.head); }
      /* 端末だけの入力：本人が端末で押した写した印はパネルだけが知る（panelView は senkoReadAt だけ）。差はこの一つだけで、basis に書いてある */
      const cpd = panelOf({ stat: '手待ち' }, [C4], [], [keyOf(C4)]), cpv = PV.panelView({ stat: '手待ち' }, [C4], [], NOW);
      if (cpd.left === 0 && cpv.left === 1 && /写した」印は含まない/.test(cpv.basis)) { ok('端末の写した印だけは端末の中（パネル 0件／panelView 1件）。panelView の basis にその旨が載る'); } else { ng('端末の写した印の扱いが違う：' + cpd.left + '／' + cpv.left); }
    }
  }
  /* ---- ⑤の二十六 v211（本人の枠 七十八・七十九）：底のボタンは四つ×二段の八つを一つの決め（.btn4row）で並べる／まとめて写すは隠さず上の段の四つ目／押し通知や板の行をボタンの上に足さない。
     静かな部分（字面）。0件・1件・10件以上と押し通知の有無で八つの場所が動かないかは ⑤の二十六の二（ブラウザ・雲）が 390・375・320 で測る ---- */
  head('⑤の二十六 v211：底の八つ（四つ×二段・同じ決め）・まとめて写すは常に出る・ボタンの上に知らせの行を足さない（字面）');
  {
    const LF = String.fromCharCode(10), H = html.split(String.fromCharCode(13) + LF).join(LF);
    const blk = (open) => { const a = H.indexOf(open); if (a < 0) { return ''; } const b = H.indexOf(LF + '  </div>', a); return b > a ? H.slice(a, b) : ''; };
    const ids = (t) => (t.match(/ id="[A-Za-z]+"/g) || []).map(x => x.slice(5, -1));
    const hb = blk('<div class="halfrow btn4row" id="halfRow">'), sb = blk('<div class="shotsrow btn4row">');
    const hi = ids(hb).filter(x => x !== 'halfRow'), si = ids(sb);
    /* 一、八つの並び：上の段＝遠隔・終わりました（箱）・くわしく・まとめて写す、下の段＝写し取り一覧・直近・様子を写す・指さす。二つの段は続けて並ぶ（間は注だけ） */
    const iHe = H.indexOf(LF + '  </div>', H.indexOf('<div class="halfrow btn4row" id="halfRow">')), iS = H.indexOf('<div class="shotsrow btn4row">');
    const gap = (iHe > 0 && iS > iHe) ? H.slice(iHe + 9, iS).replace(/<!--[\s\S]*?-->/g, '').trim() : 'x';
    if (hi.join(',') === 'rcLink,doneBox,doneHead,btnSteps,btnCopyBoard' && si.join(',') === 'btnShots,btnRecent,btnCopyUrl,btnPoint' && gap === '') { ok('八つ：上の段 遠隔→終わりました→くわしく→まとめて写す ／ すぐ下の段 写し取り一覧→直近に終わった仕事→様子を写す→指さす（二つの段の間に何も無い）'); } else { ng('八つの並びが違う（上 ' + hi.join(',') + '／下 ' + si.join(',') + '／間 ' + JSON.stringify(gap.slice(0, 40)) + '）'); }
    /* 二、一つの決め：二つの段とも class に btn4row・中の四つは同じ指定（25%・border-box・min-height・13px）・折り返さない・隠す物は場所を取る */
    const css = ['.btn4row{display:flex; flex-wrap:nowrap; gap:8px; margin:8px 14px 0; align-items:stretch;}', '.btn4row > .cpall, .btn4row > .done-box{flex:1 1 25%; min-width:0; width:auto; margin:0; box-sizing:border-box; min-height:72px; height:72px;}', '.btn4row > a.cpall.rc{display:flex; padding:6px 4px; line-height:1.25;}', '.btn4row > .cpall.hide, .btn4row > a.cpall.rc.hide, .btn4row > .cpall.steps-t.hide, .btn4row > .done-box.hide{display:flex; visibility:hidden;}', '@media (max-width: 359px) { .btn4row > .cpall, .btn4row > .done-box{min-height:88px; height:88px;} }'];
    const missC = css.filter(c => H.indexOf(c) < 0);
    const oldC = ['.halfrow > .cpall, .halfrow > .done-box{', '.shotsrow > .cpall{', '.shotsrow{flex-wrap:wrap;}'].filter(c => H.indexOf(c) >= 0);
    if (!missC.length && !oldC.length && (H.match(/class="[^"]*btn4row[^"]*"/g) || []).length === 2) { ok('二つの段は同じ一つの決め（.btn4row：四つ等分 flex:1 1 25%・border-box・高さ72px以上（359px 以下は88px）・折り返さない・隠す物は visibility:hidden で場所を取る）・前の段ごとの指定（.halfrow／.shotsrow）は残っていない'); } else { ng('四つ並びの決めが揃っていない（無い ' + missC.length + '件：' + missC.map(c => c.slice(0, 30)).join('｜') + '／残る前の指定 ' + oldC.join('｜') + '）'); }
    /* 三、まとめて写す：id は一つだけ・隠さない（hidden を立てない）・上「まとめて写す」下「N件」（0件は空で高さを取る）・0件は押せない普段の色・1件以上は青 */
    const sc = cutFn(H, 'setCopyBoardLabel');
    const cbOk = (H.match(/id="btnCopyBoard"/g) || []).length === 1 && sc.indexOf('b.hidden = true') < 0 && sc.indexOf('b.hidden = false;') >= 0 && sc.indexOf("b.innerHTML = '<span class=\"cb-top\">まとめて写す</span><span class=\"cb-sub\">' + (n > 0 ? esc(n + '件') : '') + '</span>';") >= 0 && sc.indexOf('b.disabled = !(n > 0);') >= 0
      && H.indexOf('#btnCopyBoard .cb-sub{display:block; font-size:11px; line-height:14px; min-height:14px; min-width:3em;}') >= 0 && /#btnCopyBoard:disabled\{background:var\(--card\); color:var\(--fg\);\s*border-color:var\(--line\); opacity:1;/.test(H) && H.indexOf('#btnCopyBoard{background:#1e6fd9;') >= 0;
    const l0 = PCORE.todoLabel(0), l1 = PCORE.todoLabel(1), l12 = PCORE.todoLabel(12);
    if (cbOk && l0 === 'まとめて写す' && /^まとめて写す（残1／1件）$/.test(l1) && /残12／12件/.test(l12)) { ok('まとめて写す：一つだけ・隠さない・上「まとめて写す」下「N件」（0件は下の行を空のまま14pxの高さと3字の幅を取る）・0件は押せない普段の色／1件以上は青・字（aria-label・panelView.label）は todoLabel（0件「' + l0 + '」・1件「' + l1 + '」）'); } else { ng('まとめて写すの出し方が違う（字面 ' + cbOk + '・0件「' + l0 + '」・1件「' + l1 + '」）'); }
    /* 四、押し通知と板の行をボタンの上に足さない（枠 七十九）：見出しの下の箱からボタンの段までの間に有るのは、決まった器だけ。目次（#todoList）は八つの下で、押し通知の行は塗らない。板・お知らせの一覧は画面に出さない */
    const iP = H.indexOf('<div class="usage" id="usageTag"'), iHr = H.indexOf('<div class="halfrow btn4row" id="halfRow">');
    const above = (iP > 0 && iHr > iP) ? ids(H.slice(iP, iHr).replace(/<!--[\s\S]*?-->/g, '')) : [];
    const pt = cutFn(H, 'paintTodoList');
    const t9 = above.join(',') === 'usageTag,usageMsg,progBox,pipeWarn,kumoLine,btnCopyAll,list,board' && H.indexOf('#btnCopyAll, #list{display:none !important;}') >= 0 && H.indexOf('#board{display:none !important;}') >= 0 && H.indexOf('<ul id="todoList" class="todoList"></ul>') > iS && pt.indexOf("var a = mergedTodo().filter(function (m) { return m.kind === 'card'; });") >= 0 && pt.indexOf("'📣'") < 0;
    /* v216（本人の枠 九十二・百十二）：目次（#todoList）と雲の一行（#kumoLine）は画面に出さない（器と中身は残す＝数・写す中身は変わらない） */
    if (H.indexOf('#todoList{display:none !important;}') >= 0 && H.indexOf('#kumoLine{display:none !important;}') >= 0 && H.indexOf('<p class="kumo-line hide" id="kumoLine"></p>') >= 0) { ok('目次（#todoList）と雲の一行（#kumoLine）は display:none で画面に出さない（器は残す・まとめて写すの中身と N件はそのまま）'); } else { ng('目次か雲の一行が画面に出得る（#todoList・#kumoLine の display:none が無い）'); }
    if (t9) { ok('ボタンの上に知らせの行を足さない：見出しの下の箱からボタンの段までの器は ' + above.length + ' 個（決まった物だけ）・板（あなた待ち）とお知らせの一覧は画面に出さない・目次は八つの下で押し通知（📣）の行を塗らない'); } else { ng('ボタンの上に行が足され得る（間の器 ' + above.join(',') + '・目次の塗り ' + (pt.indexOf("m.kind === 'card'") >= 0) + '）'); }
  }
  /* ---- ⑤の二十七 v212（本人の枠 七十七）：段は state.json の生の段（steps.rows）から毎回数える（panel-core.js の stepsOf 一つ）。
     生の段が無い古い state は stepTotal・stepDone・sNow へ落ちる。パネル（applySteps）と panelView が同じ段の数・今の段を返す。公開の版は pubVer（実物）から。
     endat.js も生の段を使い、見込みの書き替えはその刻から数え直す（作り値の台帳・本物の控えは読まない） ---- */
  head('⑤の二十七 v212：段は生の段から stepsOf で毎回数える（rows あり／なし・k が x／雲／決）・パネルと panelView が同じ・公開の版は pubVer・endat の見込みの書き替え');
  {
    const LF = String.fromCharCode(10), H = html.split(String.fromCharCode(13) + LF).join(LF), dir = path.dirname(SRC), SO = PCORE.stepsOf;
    const PV = require(path.join(dir, 'panel-view.js')), SD = require(path.join(dir, 'state-decide.js'));
    const rw = (a) => a.map(x => ({ k: x[0], t: x[1] }));
    const R1 = rw([['x', '一'], [' ', '二'], ['雲', '三'], ['決', '四']]), R2 = rw([['x', '一'], ['雲', '雲を待つ'], [' ', '次']]), R3 = rw([['x', '一'], ['決', 'ヨシを待つ']]), R4 = rw([['x', '一'], ['x', '二']]);
    const OLD = { stepTotal: 7, stepDone: 2, sNow: '古い字', sDone: '古い済み', sNext: '古い次' };
    const j = (o) => JSON.stringify(o);
    /* 一、stepsOf：rows があれば rows だけで数える（古い欄が食い違っていても rows が勝つ）・無ければ古い欄 */
    const a1 = SO(Object.assign({ steps: { job: '枠 九十', rows: R1 } }, OLD)), a2 = SO({ steps: { job: 'j', rows: R2 } }), a3 = SO({ steps: { job: 'j', rows: R3 } }), a4 = SO({ steps: { job: 'j', rows: R4 } }), a5 = SO(Object.assign({ steps: { job: 'j', rows: [] } }, OLD)), a6 = SO(OLD), a7 = SO(Object.assign({ steps: null }, OLD)), a8 = SO({});
    const s1 = a1.from === 'rows' && a1.job === '枠 九十' && a1.total === 4 && a1.done === 1 && a1.now === '二' && a1.nowK === ' ' && a1.last === '一' && a1.next === '三';
    const s2 = a2.total === 3 && a2.done === 1 && a2.now === '雲を待つ' && a2.nowK === '雲' && a2.next === '次' && a3.total === 2 && a3.done === 1 && a3.now === 'ヨシを待つ' && a3.nowK === '決' && a4.total === 2 && a4.done === 2 && a4.now === '' && a4.last === '二';
    const s3 = a5.from === 'rows' && a5.total === 0 && a5.now === '' && a6.from === 'old' && a6.total === 7 && a6.done === 2 && a6.now === '古い字' && a6.last === '古い済み' && a6.next === '古い次' && j(a7) === j(a6) && a8.total === 0 && a8.now === '';
    if (s1 && s2 && s3) { ok('stepsOf：rows あり＝rows だけで数える（済みは x だけ・[雲]［決］は未済・古い欄が食い違っても rows が勝つ・空の rows は0段）／rows なし（無い・null）＝古い欄（stepTotal・stepDone・sNow・sDone・sNext）'); } else { ng('stepsOf が違う：' + j({ a1, a2, a3, a4, a5, a6, a7 })); }
    /* 二、state-decide.js（見張りの決め所）と同じ数え方：同じ段で stepDone・stepTotal・sNow・sDone・sNext が揃う */
    let sdOk = true; [R1, R2, R3, R4, []].forEach(R => { const d = SD.decide({ now: 1795290000, alive: 1, busy: {}, kumo: {}, steps: R }), s = SO({ steps: { job: '', rows: R } }); if (d.stepDone !== s.done || d.stepTotal !== s.total || d.sNow !== s.now || d.sDone !== s.last || d.sNext !== s.next) { sdOk = false; note('差：' + j({ d: [d.stepDone, d.stepTotal, d.sNow, d.sDone, d.sNext], s })); } });
    if (sdOk) { ok('stepsOf は state-decide.js の decide と同じ数え方（5通りで stepDone・stepTotal・sNow・sDone・sNext が揃う）'); } else { ng('stepsOf と state-decide.js の数え方がずれた'); }
    /* 三、パネル（applySteps を切り出して回す）と panelView が同じ段の数・今の段・ゲージの字・段の行 */
    const ap = cutFn(H, 'applySteps'), om = H.slice(H.indexOf('  function omoteNow('), H.indexOf(LF, H.indexOf('  function omoteNow(')));
    if (!ap || !om) { ng('panel.html に applySteps／omoteNow が無い'); }
    else {
      const pf = new Function('window', 'd', 'var lastStepTotal = 0, lastStepDone = 0, lastSNow = \'\', lastSDone = \'\', lastSNext = \'\', lastStat = \'作業中\', lastSubj = \'枠 九十：作り値\', lastStartedAt = 1795290000, lastMikomiRaw = \'30分\', lastEta = null;' + LF + cutFn(H, 'core') + LF + ap + LF + om + LF + 'applySteps(d); var c = core(); return { total: lastStepTotal, done: lastStepDone, now: lastSNow, last: lastSDone, next: lastSNext, gauge: c.omoteGauge(lastSNow, lastStepDone, lastStepTotal), dan: c.omoteLines(omoteNow())[2] };');
      const CASES = [Object.assign({ steps: { job: 'j', rows: R1 } }, OLD), { steps: { job: 'j', rows: R2 }, sNow: '雲を待つ', stepDone: 0, stepTotal: 0 }, { steps: { job: 'j', rows: R3 } }, { steps: { job: 'j', rows: R4 } }, Object.assign({ steps: { job: 'j', rows: [] } }, OLD), OLD, Object.assign({ steps: null }, OLD), {}];
      let bad = 0, n = 0;
      CASES.forEach(c0 => { const d = Object.assign({ stat: '作業中', subj: '枠 九十：作り値', startedAt: 1795290000, mikomi: '30分' }, c0), p = pf(WIN, d), v = PV.panelView(d, [], [], 1795290600), vs = v.omote.panel.steps, vd = v.omote.lines.filter(l => /^段：/.test(l))[0];
        n++; if (p.total !== vs.total || p.done !== vs.done || p.now !== vs.now || p.gauge !== v.omote.panel.gauge || p.dan !== vd) { bad++; note('差：' + j({ c0, p, v: { vs, gauge: v.omote.panel.gauge, vd } })); } });
      const p1 = pf(WIN, CASES[0]);
      if (bad === 0 && p1.gauge === '2/4' && p1.dan === '段：2/4　二' && p1.last === '一' && p1.next === '三' && pf(WIN, OLD).dan === '段：3/7　古い字') { ok('パネル（applySteps）と panelView：同じ state ' + n + '通りで段の数・今の段・ゲージの字（rows あり 2/4・古い欄 3/7）・様子を写すの段の行が同じ（rows があれば古い欄の食い違いは出ない）'); } else { ng('パネルと panelView の段がずれた（' + bad + '／' + n + '）'); }
      const wW = (() => { try { return new Function('window', 'd', 'var lastStepTotal = 0, lastStepDone = 0, lastSNow = \'\', lastSDone = \'\', lastSNext = \'\';' + LF + 'function core() { throw new Error(\'x\'); }' + LF + ap + LF + 'applySteps(d); return [lastStepDone, lastStepTotal, lastSNow].join(\'|\');')({}, OLD); } catch (e) { return 'err ' + e.message; } })();
      if (wW === '2|7|古い字' && H.indexOf('applySteps(d);   /* v180・v212') >= 0 && H.indexOf('lastStepDone = (typeof d.stepDone') < 0) { ok('パネルは読み込みのたびに applySteps(d) で数える（前の stepDone/stepTotal の直の写しは無い）・部品が読めない時は古い欄へ落ちる'); } else { ng('パネルの段の読み方が違う（部品なし ' + wW + '）'); }
    }
    /* 四、公開の版：state.json の pubVer（見張りが compare-dest.js の控えから運ぶ）を panelView.pub に。段の字からは読まない */
    const vp1 = PV.panelView({ pubVer: '211', pubVerAt: Date.parse('2026-11-22T05:15:00+09:00') / 1000 }, [], [], 1795290600).pub, vp2 = PV.panelView({ pubVer: PCORE.VER }, [], [], 1795290600).pub, vp3 = PV.panelView({ steps: { job: 'j', rows: rw([[' ', 'v208 を公開し直す']]) } }, [], [], 1795290600).pub;
    const okP = vp1.ver === '211' && vp1.line === '公開のパネル：v211（05:15 から）' + (PCORE.VER !== '211' ? '・手元の部品は v' + PCORE.VER + '（まだ公開されていない）' : '') && vp2.line === '公開のパネル：v' + PCORE.VER && vp3.ver === '' && vp3.line === '';
    if (okP) { ok('公開の版は state.json の pubVer から（「' + vp1.line + '」・手元と同じなら版だけ・pubVer が無ければ空で、段の字「v208 を公開し直す」からは出さない）'); } else { ng('公開の版の一行が違う：' + j([vp1, vp2, vp3])); }
    /* 五、運ぶ手（VAIO の ~/.claude にある時だけ字面で見る。雲には無い）：inbox-watch.ps1 が steps と pubVer を足す・compare-dest.js が pub を控える・turn-mark.js は段の欄を書かない */
    { const HOME = path.join(require('os').homedir(), '.claude'), rdH = (f) => { try { return fs.readFileSync(path.join(HOME, f), 'utf8'); } catch (e) { return null; } };
      const IW = rdH('inbox-watch.ps1'), CD = rdH('compare-dest.js'), TM = rdH('turn-mark.js');
      if (IW == null || CD == null || TM == null) { note('~/.claude の台本が無い（雲）ので、運ぶ手の字面は見ない'); }
      else if (IW.indexOf("'\"steps\":'     + $stepsJson") >= 0 && IW.indexOf("'\"pubVer\":'    + (ToJson $pubVer)") >= 0 && IW.indexOf("Join-Path $Root 'compare-dest-state.json'") >= 0 && IW.indexOf("-cmatch '^\\[( |x|雲|決)\\]") >= 0 && /mem\.pub = \{ ver: String\(r\.pubPanel\), since: NOW/.test(CD) && !/s\.sNow = d\.sNow/.test(TM)) { ok('運ぶ手：inbox-watch.ps1 が state.json に steps（readSteps と同じ読み方）と pubVer／pubVerAt を足す・compare-dest.js が公開の版を pub に控える（版が替わった時だけ since を打つ）・turn-mark.js は段の欄を書かない'); }
      else { ng('運ぶ手の字面が違う（inbox-watch.ps1・compare-dest.js・turn-mark.js）'); } }
    /* 六、endat.js：生の段（[雲] も未済の段に数える）・見込みの書き替えはその刻から数え直す（前の見込みの延びを捨てる）・その後の段は 新しい見込み÷その時の残り で延ばす */
    { const os = require('os'), T = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-steps-')), W = (n, t) => { const p = path.join(T, n); fs.writeFileSync(p, t); return p; };
      const env = { ENDAT_ORDERS: W('o.tsv', ''), ENDAT_NOTES: W('n.log', ''), ENDAT_STEPS: path.join(T, 'none.txt'), ENDAT_SUBLOG: W('s.jsonl', ''), ENDAT_CLOUD: W('c.json', '{"list":[]}'), ENDAT_BASE: path.join(T, 'base.json'), ENDAT_BUNDLE: path.join(T, 'bundle.json'), ENDAT_EST: path.join(T, 'none.json') }, keep = {};
      Object.keys(env).forEach(k => { keep[k] = process.env[k]; process.env[k] = env[k]; });
      try {
        delete require.cache[require.resolve(path.join(dir, 'endat.js'))]; const EA = require(path.join(dir, 'endat.js'));
        const J0 = Date.parse('2026-11-22T05:00:00+09:00') / 1000, M = (m) => J0 + m * 60, base = { stat: '作業中', subj: '枠 九十：作り値', startedAt: J0, statAt: J0, foot: { wait: 0, waitList: [] } };
        const st = (rows, mk) => Object.assign({}, base, { mikomi: mk, steps: { job: '枠 九十：作り値', rows: rw(rows) } });
        const r3 = [['x', '一'], [' ', '二'], ['雲', '三']], r6 = r3.concat([[' ', '四'], [' ', '五'], [' ', '六']]), r8 = r6.concat([[' ', '七'], [' ', '八']]);
        const e1 = EA.compute(st(r3, '40分'), M(1)), e2 = EA.compute(st(r6, '40分'), M(20)), e3 = EA.compute(st(r6, '20分'), M(30)), e4 = EA.compute(st(r8, '20分'), M(35)), e5 = EA.compute(st(r8, '20分'), M(40));
        const b = JSON.parse(fs.readFileSync(env.ENDAT_BASE, 'utf8'));
        const o = e1.omote.cur.all === 3 && e1.omote.cur.left === 2 && e1.omote.endSec === M(40) && e2.omote.endSec === M(80) && e3.omote.endSec === M(50) && e4.omote.endSec === M(58) && e5.omote.endSec === M(58) && b.mkAt === M(30) && b.mkSteps === 6 && b.mkLeft === 5 && /見込みを 05:30 に 20分へ書き替え・段\+2×4分/.test(e4.omote.src);
        if (o) { ok('endat：生の段で数える（[雲] も未済）・段が増えると 最初の見込み÷最初の段数 で延びる（05:40→06:20）・見込みを 05:30 に 20分へ書き替えたら その刻から数え直す（06:20→05:50）・その後の2段は 20分÷残り5段＝4分 で延ばす（05:58）・刻を控えに一度書くだけで次の回も同じ刻'); } else { ng('endat の見込みの書き替えが違う：' + j({ e: [e1, e2, e3, e4, e5].map(e => [e.omote.endAt, e.omote.cur.all, e.omote.cur.left]), b, src: e4.omote.src })); }
      } catch (e) { ng('endat の作り値が回らない：' + e.message); }
      finally { Object.keys(keep).forEach(k => { if (keep[k] === undefined) { delete process.env[k]; } else { process.env[k] = keep[k]; } }); try { fs.rmSync(T, { recursive: true, force: true }); } catch (e) { } } }
  }
  /* ---- ⑤の二十八 v213（本人の枠 八十三・八十四）：見込みは「窓が見込みを書いた刻」（state.json の mikomiAt）から数える（panel-core.js の mikomiEnd 一つ）。
     パネル（mkEndSec・etaLineText・箱の赤）・panelView（jobEnd・箱の eta）・endat.js（cur.endSec）が同じ終わりの刻を返す。雲の一本は、その流れ自身の過去（24時間→7日→30日）だけから・記録が無ければ「見込み不明」で赤にしない ---- */
  head('⑤の二十八 v213：見込みは書いた刻から（開始 03:00・03:30 に 40分→04:10／04:00 に 20分へ書き替え→04:20／段が増えれば延びる／書いていなければ出さない）・雲は流れ自身の過去だけ（作り値）');
  {
    const LF = String.fromCharCode(10), H = html.split(String.fromCharCode(13) + LF).join(LF), dir = path.dirname(SRC), j = (o) => JSON.stringify(o);
    const J = (t) => Math.floor(Date.parse('2026-11-22T' + t + ':00+09:00') / 1000), hmJ = (x) => { const d = new Date((x + 9 * 3600) * 1000); return ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2); };
    const ME = PCORE.mikomiEnd;
    /* 一、mikomiEnd：書いた刻＋見込み／書き替え／見込みが無ければ 0／mikomiAt が 0 と載っていれば 0／載っていない古い state だけ開始から／増えた段の刻（curEnd）が有ればそれ */
    const m1 = ME({ mikomi: '40分', mikomiAt: J('03:30'), startedAt: J('03:00') }), m2 = ME({ mikomi: '20分', mikomiAt: J('04:00'), startedAt: J('03:00') }), m3 = ME({ mikomi: '', mikomiAt: J('03:30'), startedAt: J('03:00') }), m4 = ME({ mikomi: '不明', mikomiAt: 0, startedAt: J('03:00') }), m5 = ME({ mikomi: '40分', mikomiAt: 0, startedAt: J('03:00') }), m6 = ME({ mikomi: '40分', startedAt: J('03:00') }), m7 = ME({ mikomi: '40分', mikomiAt: J('03:30'), startedAt: J('03:00'), curEnd: J('04:30') });
    if (m1 === J('04:10') && m2 === J('04:20') && m3 === 0 && m4 === 0 && m5 === 0 && m6 === J('03:40') && m7 === J('04:30')) { ok('mikomiEnd：開始 03:00・03:30 に 40分→04:10／04:00 に 20分→04:20／見込みが無い・不明→出さない（0）／mikomiAt が 0→出さない／mikomiAt の無い古い state だけ開始から（03:40）／増えた段の刻が有ればそれ（04:30）'); } else { ng('mikomiEnd が違う：' + j([m1, m2, m3, m4, m5, m6, m7].map(x => x ? hmJ(x) : 0))); }
    const wl = PCORE.workLate;
    if (!wl('作業中', J('03:00'), '40分', J('04:09'), J('03:30')) && wl('作業中', J('03:00'), '40分', J('04:10'), J('03:30')) && !wl('作業中', J('03:00'), '40分', J('03:45'), J('03:30')) && !wl('手待ち', J('03:00'), '40分', J('05:00'), J('03:30')) && !wl('作業中', J('03:00'), '', J('09:00'), 0)) { ok('workLate：開始＋見込み（03:40）では赤にせず、書いた刻＋見込み（04:10）を過ぎてから赤・作業中だけ・見込みが無ければ赤にしない'); } else { ng('workLate が書いた刻から数えていない'); }
    /* 二、endat.js：作り値の台帳で回す（本物の控えは読まない・書かない） */
    const os = require('os'), T = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-mkat-')), W = (n, t) => { const p = path.join(T, n); fs.writeFileSync(p, t); return p; };
    const env = { ENDAT_ORDERS: W('o.tsv', ''), ENDAT_NOTES: W('n.log', ''), ENDAT_STEPS: path.join(T, 'none.txt'), ENDAT_SUBLOG: W('s.jsonl', ''), ENDAT_CLOUD: W('c.json', '{"list":[]}'), ENDAT_BASE: path.join(T, 'base.json'), ENDAT_BUNDLE: path.join(T, 'bundle.json'), ENDAT_EST: path.join(T, 'none.json') }, keep = {};
    Object.keys(env).forEach(k => { keep[k] = process.env[k]; process.env[k] = env[k]; });
    try {
      delete require.cache[require.resolve(path.join(dir, 'endat.js'))]; delete require.cache[require.resolve(path.join(dir, 'panel-view.js'))];
      const EA = require(path.join(dir, 'endat.js')), PV = require(path.join(dir, 'panel-view.js'));
      const rw = (a) => a.map(x => ({ k: x, t: '段' })), base = { stat: '作業中', subj: '枠 八十三：作り値', startedAt: J('03:00'), statAt: J('03:00'), foot: { wait: 0, waitList: [] } };
      const st = (rows, mk, at) => Object.assign({}, base, { mikomi: mk, mikomiAt: at, steps: { job: '枠 八十三：作り値', rows: rw(rows) } });
      const R4 = ['x', ' ', ' ', ' '], R6 = R4.concat([' ', ' ']), R6b = ['x', ' ', ' ', ' ', ' ', ' '], R7 = R6b.concat([' ']);
      const e0 = EA.compute(st(R4, '', 0), J('03:10'));   // 見込みを書く前
      const e1 = EA.compute(st(R4, '40分', J('03:30')), J('03:35')), e1b = EA.compute(st(R4, '40分', J('03:30')), J('03:50'));
      const e2 = EA.compute(st(R6, '40分', J('03:30')), J('03:55'));   // 段が二つ増えた（一段＝40÷4＝10分）
      const e3 = EA.compute(st(R6b, '20分', J('04:00')), J('04:01'));  // 04:00 に 20分へ書き替え
      const e4 = EA.compute(st(R7, '20分', J('04:00')), J('04:05'));   // その後に一段（20÷残り5＝4分）
      const c = (e) => e.omote.cur.endSec;
      const okE = c(e0) === 0 && e0.omote.endAt === '' && c(e1) === J('04:10') && e1.omote.endAt === '04:10' && c(e1b) === c(e1) && c(e2) === J('04:30') && c(e3) === J('04:20') && c(e4) === J('04:24') && e1.omote.startSec === J('03:00') && /見込み 40分（03:30 に書いた）/.test(e1.omote.src) && /見込みを 04:00 に 20分へ書き替え・段\+1×4分/.test(e4.omote.src);
      if (okE) { ok('endat：書く前は終わり無し・03:30 に 40分→04:10（今の刻が進んでも同じ刻）・段+2（一段10分）→04:30・04:00 に 20分へ書き替え→04:20・その後の段+1（20÷残り5＝4分）→04:24・始まりは 03:00 のまま'); } else { ng('endat の見込みの数えが違う：' + j([e0, e1, e1b, e2, e3, e4].map(e => [e.omote.cur.endAt, e.omote.endAt])) + ' ' + e4.omote.src); }
      /* 三、panelView（jobEnd・箱の eta）とパネル（mkEndSec・etaLineText）が同じ刻 */
      const d1 = Object.assign(st(R4, '40分', J('03:30')), { eta: e1 }), pv = PV.panelView(d1, [], [], J('03:35'));
      const ce = (name) => cutFn(H, name);
      const fsrc = ['core', 'mkEndSec', 'etaLineText', 'pad2s'].map(ce);
      if (fsrc.some(x => !x)) { ng('panel.html に core／mkEndSec／etaLineText／pad2s が無い'); }
      else {
        const run = (ov) => new Function('window', 'S', 'var lastStat = S.lastStat, lastStartedAt = S.lastStartedAt, lastMikomiMin = S.lastMikomiMin, lastMikomiRaw = S.lastMikomiRaw, lastMikomiAt = S.lastMikomiAt, lastEta = S.lastEta;' + LF + 'function waitEtaRow() { return null; }' + LF + fsrc.join(LF) + LF + 'return { e: mkEndSec(), t: etaLineText() };')(WIN, Object.assign({ lastStat: '作業中', lastStartedAt: J('03:00'), lastMikomiMin: 40, lastMikomiRaw: '40分', lastMikomiAt: J('03:30'), lastEta: { omote: pv.omote, ura: pv.ura, all: pv.all } }, ov || {}));
        const p1 = run(), p2 = run({ lastEta: null }), p3 = run({ lastMikomiRaw: '', lastMikomiMin: 0, lastMikomiAt: 0, lastStartedAt: Math.floor(Date.now() / 1000) - 200 });
        if (pv.jobEnd.endSec === J('04:10') && pv.jobEnd.endAt === '04:10' && p1.e === pv.jobEnd.endSec && p2.e === J('04:10') && p3.e === 0 && p3.t === '見込み未記入' && pv.omote.cur.endSec === p1.e) { ok('同じ終わり 04:10：panelView.jobEnd＝パネルの mkEndSec（panelView あり・無し）＝endat の cur.endSec・見込みを書いていなければパネルも「見込み未記入」で刻を出さない'); } else { ng('パネルと panelView の終わりがずれた：' + j({ jobEnd: pv.jobEnd, p1, p2, p3 })); }
        const late1 = PV.panelView(d1, [], [], J('04:05')).omote.panel.eta, late2 = PV.panelView(d1, [], [], J('04:12')).omote.panel.eta;
        if (late1 && late2 && late1.c === 'eta' && late2.c === 'bad') { ok('panelView の表の箱の頭：04:05（開始＋見込みの 03:40 は過ぎた）は赤にせず、04:12（書いた刻＋見込みの 04:10 を過ぎた）で赤'); } else { ng('panelView の箱の赤が書いた刻から数えていない：' + j([late1, late2])); }
      }
      /* 四、雲の一本（枠 八十四）：較正の対局の過去が 24時間に無い／7日にある／まったく無い */
      const N = J('07:10'), Z = (t) => new Date(t * 1000).toISOString();
      const other = [{ databaseId: 1, workflowName: '札と状態の配信', status: 'completed', conclusion: 'success', createdAt: Z(N - 3600), updatedAt: Z(N - 3600 + 156) }, { databaseId: 2, workflowName: '札と状態の配信', status: 'completed', conclusion: 'success', createdAt: Z(N - 7200), updatedAt: Z(N - 7200 + 156) }];
      const runB = { databaseId: 9, workflowName: '較正の対局', status: 'in_progress', conclusion: '', createdAt: Z(J('07:06')), updatedAt: Z(J('07:06')) };
      const hist = (ago, mins) => mins.map((m, i) => ({ databaseId: 100 + i, workflowName: '較正の対局', status: 'completed', conclusion: 'success', createdAt: Z(N - ago - i * 86400), updatedAt: Z(N - ago - i * 86400 + m * 60) }));
      const cl = (h) => { fs.writeFileSync(env.ENDAT_CLOUD, j({ list: other.concat([runB]), hist: h })); return EA.compute({ stat: '待ち', foot: { wait: 0, waitList: [] }, ura: { sub: { items: [] }, cloud: { running: [{ id: 9, name: '較正の対局' }], recent: [] } } }, N); };
      const many = [40, 42, 44, 46, 48, 50].map((m, i) => ({ databaseId: 300 + i, status: 'completed', createdAt: Z(N - 3600 * (i + 1)), updatedAt: Z(N - 3600 * (i + 1) + m * 60) }));
      const u0 = cl({}), u7 = cl({ '較正の対局': { at: N, runs: hist(2 * 86400, [100, 110, 120]) } }), u1 = cl({ '較正の対局': { at: N, runs: many } });
      const f = (u) => u.ura.cloud.flows[0] || {};
      const b0 = PCORE.boxSpec(u0, null, 'ura'), h0 = PCORE.headEta(b0, N, false), b7 = PCORE.boxSpec(u7, null, 'ura'), h7 = PCORE.headEta(b7, N, false);
      const okU = u0.ura.endAt === '' && u0.ura.unknown === 1 && f(u0).min === 0 && /較正の対局 見込み不明/.test(u0.ura.src) && h0.t === '見込み不明' && h0.c === 'eta' && PCORE.headEta(PCORE.boxSpec(u0, null, 'all'), N, false).t === '見込み不明' &&
        f(u7).min === 110 && f(u7).days === 30 && f(u7).n === 3 && u7.ura.endSec === J('07:06') + 110 * 60 && u7.ura.unknown === 0 && h7.c === 'eta' && /^あと 106分/.test(h7.t) &&
        f(u1).min === 44 && f(u1).days === 1 && f(u1).n === 5;
      if (okU) { ok('較正の対局：過去がまったく無い→他の流れ（札と状態の配信 2.6分）を借りず「見込み不明」（赤にしない・全部の箱も）／24時間に無く7日に3本ある→5本に満たないので30日まで見て、その流れの3本の中央値 110分（あと106分）／24時間に6本ある→新しい5本の中央値 44分'); } else { ng('雲の流れの所要が違う：' + j({ u0: [u0.ura.endAt, u0.ura.unknown, f(u0), u0.ura.src, h0], u7: [u7.ura.endAt, f(u7), h7], u1: f(u1) })); }
    } catch (e) { ng('v213 の作り値が回らない：' + e.message); }
    finally { Object.keys(keep).forEach(k => { if (keep[k] === undefined) { delete process.env[k]; } else { process.env[k] = keep[k]; } }); try { fs.rmSync(T, { recursive: true, force: true }); } catch (e) { } }
    /* 五、待ちの行（waitEtaRow）：雲の見込みが「不明」なら赤にしない・刻が全く無い「未記入」は今までどおり赤 */
    const wsrc = cutFn(H, 'waitEtaRow');
    if (!wsrc) { ng('panel.html に waitEtaRow が無い'); }
    else {
      const wr = (st, det, kumo) => new Function('lastStat', 'lastDetail', 'lastKumo', 'pad2s', wsrc + LF + 'return waitEtaRow();')(st, det, kumo, (x) => '00:00');
      const w1 = wr('検査中', '雲の検査・見込み不明', ''), w2 = wr('待ち', '窓が閉じている', '');
      if (w1 && w1.t === '見込み不明' && w1.c !== 'bad' && w2 && w2.t === '見込み未記入' && w2.c === 'bad') { ok('待ちの行：雲の見込みが「不明」の間は「見込み不明」を赤にしない／刻の手掛かりが全く無い待ちは今までどおり赤「見込み未記入」'); } else { ng('待ちの行の見込み不明が違う：' + j([w1, w2])); }
    }
    /* 六、書き手と読み手（VAIO の ~/.claude にある時だけ字面で見る。雲には無い）：mikomiAt を書くのは inbox-watch.ps1 の Publish-Status 一人・brief・見張りの超過・止まっとるかもは読むだけ */
    { const HOME = path.join(require('os').homedir(), '.claude'), rdH = (f2) => { try { return fs.readFileSync(path.join(HOME, f2), 'utf8'); } catch (e) { return null; } };
      const IW = rdH('inbox-watch.ps1'), BM = rdH('brief-make.ps1'), WN = rdH('watch-notify.ps1'), KW = rdH('kumo-wait.ps1'), UR = rdH('ura.js');
      if (IW == null || BM == null || WN == null || KW == null || UR == null) { note('~/.claude の台本が無い（雲）ので、書き手と読み手の字面は見ない'); }
      else if (IW.indexOf("'\"mikomiAt\":'  + [string]$mikomiAt") >= 0 && IW.indexOf("mikomi-at.txt") >= 0 && BM.indexOf('jobEnd') >= 0 && WN.indexOf('mikomiAt') >= 0 && KW.indexOf('mikomiAt') >= 0 && UR.indexOf("'--workflow'") >= 0) { ok('書き手と読み手：inbox-watch.ps1 が mikomi-at.txt に控えて state.json の mikomiAt を書く（一人）・brief-make.ps1（jobEnd）・watch-notify.ps1（見込み超過）・kumo-wait.ps1（止まっとるかもの窓の見込み）が読む・ura.js が流れの過去を gh run list --workflow で取る'); }
      else { ng('書き手と読み手の字面が違う（inbox-watch・brief-make・watch-notify・kumo-wait・ura）'); } }
  }
}

if (!BROWSER) {
  head('まとめ（返事パネルの検査）');
  if (STATIC) {
    note('--static：ブラウザを使わない部分だけ（①構文・三つの作り値の台・⑤の十二〜十三・⑰）。②〜⑯の画面の実測は雲（check.yml）が回す');
    staticParts(); part17();
  } else {
    note('ブラウザが無いので②〜⑥は測れなかった（落ちとは別）');
  }
  console.log('');
  console.log(bad === 0 ? '全てPASS（測れなかった項目あり）' : ('FAIL ' + bad + '件'));
  process.exit(bad === 0 ? 0 : 1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-panelchk-'));
try {
  note('視野の幅は DevTools の Emulation.setDeviceMetricsOverride（mobile:true）で与える（cdp-run.js）。較正は要らない');

  /* ---- ② 六つの状態（v173・2026-11-19 本人の枠）：題の行（#headWait）の字と、黄色い帯が出ないこと ----
     ＊状態は見張りの決め所（state-decide.js）が六つから一つ選び、state.json の stat と detail に書く。パネルは字にするだけ。 */
  head('② 六つの状態（題の行）');
  {
    const base = { subj: '題', mikomi: '', startedAt: now - 300, statAt: now - 60, at: now };
    const SIX = {
      '作業中': [{ stat: '作業中', detail: '裏で手伝い1本・雲1本' }, /^作業中、、、。$/],   /* v207（本人の枠 六十六）：頭の字は短い一言だけ */
      '検査中': [{ stat: '検査中', detail: 'v1508 検査と配信・終了予定 12:30' }, /^検査中、、、。$/],
      '待ち':   [{ stat: '待ち', detail: '残りの段 2・次「声の繋ぎ」' }, /^休憩中、、、。$/],
      '裏方':   [{ stat: '待ち', detail: '残りの段 2・次「声の繋ぎ」', ura: { sub: { running: 1, items: [{ id: 'a', desc: 'x', start: '02:00' }], recent: [] }, cloud: { running: [], recent: [] } } }, /^裏方作業中、、、。$/],
      'ヨシ待ち': [{ stat: 'ヨシ待ち', detail: 'まとめ札' }, /ヨシ待ち、、、。/],
      '止まり': [{ stat: '止まり（使用量・13:00 にリセット）', detail: '' }, /^止まり$/],
      '待機中': [{ stat: '待機中', detail: '' }, /休憩中、、、。|待機中、、、。|まとめて写すヨシ/]
    };
    for (const k of Object.keys(SIX)) {
      const r = run(tmp, { state: Object.assign({}, base, SIX[k][0]), notices: MIX, settle: 1500 }, 390, 844);
      if (!r) { ng(k + '：測れない（目印が出ない）'); continue; }
      if (SIX[k][1].test(String(r.headWait || ''))) { ok(k + '：題の行「' + String(r.headWait).slice(0, 34) + '」'); }
      else { ng(k + '：題の行が違う「' + String(r.headWait).slice(0, 40) + '」'); }
      if (k === '作業中') {   /* v180：作業中は「見込み未記入」「手順の一覧 未記入」を赤で出す（下の base は見込み・段の台帳が無い） */
        if (!/手順の一覧 未記入/.test(String(r.stBad || ''))) { ok(k + '：段の台帳が無い回でも赤の「手順の一覧 未記入」は出さない（v219）'); } else { ng(k + '：赤の「手順の一覧 未記入」が出ている（赤「' + String(r.stBad || '') + '」）'); }
      } else if (String(r.stText || '') && !((k === '検査中' || k === '待ち' || k === '裏方') && /^(終わる見込み|見込み未記入|見込み不明|見込みを過ぎた)/.test(String(r.stText || '')))) {   /* v182：検査中・待ちは見込みの行だけ出る */ ng(k + '：黄色い帯の跡に字が出た「' + String(r.stText).slice(0, 30) + '」'); }
      if (/（なし）/.test(String(r.headWait || ''))) { ng(k + '：「（なし）」が出た'); }
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

  /* ---- ③の続き 写しの絞り（2026-09-01・写しの絞り-2）----
     ＊貼る写しから落とすもの … 板の「直近に終わった仕事」の三行／ふつうの回の「ファイル:」
     ＊残すもの … 「実測:」「実機:」と報告の本文／あなた待ち／**壊れの調べの回の「ファイル:」**
     ＊reports 側や画面は絞らない決めなので、ここで見るのは**貼る字だけ**。 */
  head('③の続き 写しの絞り');
  {
    const F_PLAIN = 'panel.html（写しの組み立て）、panel-ver.txt';
    const F_SHIRA = 'panel.html（1074行あたり）、watch-notify.ps1';
    const NL = '\n';
    const plainCard = { time: now - 300, title: '✅ 終わりました（返事不要）',
      message: ['写しの絞り-2（作り値のふつうの回）',
                '完了: 貼る写しの絞りを検査で守る形にした。',
                'ファイル: ' + F_PLAIN,
                '実測: 甲＝落ちる／乙＝落ちる／丙＝通る',
                '実機: パネルで「まとめて写す」を押して貼った字を見ること'].join(NL) };
    const shiraCard = { time: now - 200, title: '🔎 調べました',
      message: ['写しの絞り-2（作り値の調べの回・原因の特定）',
                '完了: 落ちた原因を追った。',
                'ファイル: ' + F_SHIRA,
                '実測: 幅746のときだけ落ちる'].join(NL) };
    const boardMix = { waiting: [{ at: '2026-09-01 17:00', name: '待っている件', no: 'y0901-x' }],
                       recent: [{ name: '直近その一', result: '済んだ' },
                                { name: '直近その二', result: '済んだ' },
                                { name: '直近その三', result: '済んだ' }] };
    const r = run(tmp, { state: ST['手待ち'], notices: [plainCard, shiraCard], board: boardMix,
                         press: true, settle: 1500 }, 390, 844);
    if (!r || !r.clip) { ng('写しを組めない（貼る字が取れない）'); }
    else {
      const t = r.clip;
      if (/／ 直近に終わった仕事 ／/.test(t)) { ng('写しに「直近に終わった仕事」の行が混ざっている'); }
      else { ok('「直近に終わった仕事」の行は混ざっていない'); }
      if (t.indexOf(F_PLAIN) >= 0) { ng('ふつうの回の「ファイル:」が写しに残っている'); }
      else { ok('ふつうの回の「ファイル:」は落ちている'); }
      if (t.indexOf(F_SHIRA) >= 0) { ok('調べの回の「ファイル:」は残っている（例外の枝）'); }
      else { ng('調べの回の「ファイル:」まで落ちている（例外が効いていない）'); }
      /* ＊「実測:」は**ふつうの回の字そのもの**で見る（2026-09-01・写しの絞り-2 の実測で分かった）。
           `^実測[:：]` だけだと、調べの回（絞りを掛けない側）の実測に釣られて、
           ふつうの回から実測が落ちても通ってしまう。 */
      if (t.indexOf('実測: 甲＝落ちる／乙＝落ちる／丙＝通る') >= 0) { ok('「実測:」の行が残っている（ふつうの回）'); }
      else { ng('ふつうの回の「実測:」の行が落ちている'); }
      if (/^実機[:：]/m.test(t)) { ok('「実機:」の行が残っている'); }
      else { ng('「実機:」の行が落ちている'); }
      if (/^完了[:：]/m.test(t) && t.indexOf('写しの絞り-2（作り値のふつうの回）') >= 0) {
        ok('報告の本文（件名の行・完了の行）が落ちていない');
      } else { ng('報告の本文が落ちている'); }
      if (/／ あなた待ち ／/.test(t)) { ok('「あなた待ち」は残っている'); }
      else { ng('「あなた待ち」まで落ちている'); }
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

  /* ---- ⑤ すんだ・いま・これから（v173・2026-11-19 本人の枠）：黄色い帯の跡に、段の台帳の三行を出す。いまやる段が無い時は何も出さない ---- */
  head('⑤ すんだ・いま・これから（段の台帳の三行）');
  {
    const withSteps = Object.assign({}, ST['作業中'], { sDone: 'パネルの字', sNow: '声の繋ぎ', sNowAt: now - 600, sNext: '検査と配信' });
    const r = run(tmp, { state: withSteps, notices: MIX, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      const t = String(r.stText || '');
      const a = t.indexOf('✅ 完了：パネルの字'), b = t.indexOf('▶ 進行中：声の繋ぎ（'), c = t.indexOf('⏳ 予定：検査と配信');   // v176：頭の字を替えた
      if (/すんだ|いま：|これから：/.test(t)) { ng('前の頭の字（すんだ・いま・これから）が残っている（' + t.slice(0, 40) + '）'); }
      if (a >= 0 && b > a && c > b) { ok('三行が順に出る（' + t.slice(0, 50) + '）'); } else { ng('三行が違う（' + t.slice(0, 60) + '）'); }
      if (r.headWait && t.indexOf(String(r.headWait)) >= 0) { ng('題の行と同じ字が下にも出ている（' + r.headWait + '）'); } else { ok('題の行と同じ字は下に出ない'); }
    }
    const noNow = Object.assign({}, ST['作業中'], { sDone: 'パネルの字', sNow: '', sNext: '' });
    const r2 = run(tmp, { state: noNow, notices: MIX, settle: 1500 }, 390, 844);
    if (!r2) { ng('測れない（やる段が無い回）'); }
    else if (/✅ 完了|▶ 進行中|⏳ 予定/.test(String(r2.stText || ''))) { ng('やる段が無いのに三行が出た（' + String(r2.stText).slice(0, 40) + '）'); }
    else if (/手順の一覧 未記入/.test(String(r2.stBad || ''))) { ng('やる段が無い作業中に赤の「手順の一覧 未記入」が出ている（' + String(r2.stText || '').slice(0, 40) + '）'); }
    else { ok('やる段が無い回は三行も赤の「手順の一覧 未記入」も出さない（v219）'); }
  }
  /* ---- ⑤の二 作業中の「終わる見込み」と「段 N/M」（v180・2026-11-20 本人の枠） ---- */
  head('⑤の二 作業中の終わる見込みと段 N/M（無ければ赤）');
  {
    const nowF = Math.floor(Date.now() / 1000);   /* 検査の頭の now から離れていくので、このブロックはその場の時刻から組む */
    const base2 = Object.assign({}, ST['作業中'], { startedAt: nowF - 300, statAt: nowF - 300, at: nowF, sNow: '声の繋ぎ', sNowAt: nowF - 600, sDone: 'パネルの字', sNext: '検査と配信', stepDone: 2, stepTotal: 5 });
    const mk = extra => run(tmp, { state: Object.assign({}, base2, extra), notices: MIX, settle: 1500 }, 390, 844);
    const T = r => String(r && r.stText || ''), B = r => String(r && r.stBad || '');
    let r = mk({});
    if (!r) { ng('測れない（見込みあり）'); }
    else {
      if (/終わる見込み [0-9]{2}:[0-9]{2}（あと(2[0-6])分）/.test(T(r))) { ok('見込みあり：「' + (T(r).match(/終わる見込み[^\n]*/) || [''])[0] + '」'); } else { ng('見込みありの字が違う（' + T(r).slice(0, 50) + '）'); }
      if (r.gSegs === 5 && r.gDone === 2 && r.gCur === 2 && /^3\/5$/.test(String(r.gLabel || '')) && !/段 [0-9]/.test(T(r))) { ok('段は字でなく横長ゲージ：5区切り・済み2・今の手順3・横に「3/5」（v185）'); } else { ng('手順のゲージが違う（区切り' + r.gSegs + '・済み' + r.gDone + '・今' + r.gCur + '・字「' + r.gLabel + '」）'); }
      if (B(r)) { ng('見込みも段もあるのに赤が出た（' + B(r) + '）'); } else { ok('見込み・段があれば赤は出ない'); }
    }
    r = mk({ mikomi: '10分', startedAt: nowF - 1500 });
    if (!r) { ng('測れない（過ぎた）'); }
    else if (/見込みを過ぎた (1[4-9])分/.test(B(r))) { ok('見込みを過ぎたら赤「' + B(r) + '」'); } else { ng('「見込みを過ぎた N分」が赤で出ない（赤「' + B(r) + '」）'); }
    r = mk({ mikomi: '' });
    if (!r) { ng('測れない（未記入）'); }
    else if (/見込み未記入/.test(B(r))) { ok('見込みが空なら赤「見込み未記入」'); } else { ng('「見込み未記入」が赤で出ない（赤「' + B(r) + '」）'); }
    r = mk({ mikomi: '不明' });
    if (!r) { ng('測れない（不明）'); }
    else if (/見込み不明/.test(B(r))) { ok('「不明」と書かれた回は赤「見込み不明」'); } else { ng('「見込み不明」が赤で出ない（赤「' + B(r) + '」）'); }
    r = mk({ sNow: '', sDone: '', sNext: '', stepDone: 0, stepTotal: 0 });
    if (!r) { ng('測れない（台帳なし）'); }
    else if (!/手順の一覧 未記入/.test(B(r)) && !r.gSegs) { ok('台帳が無ければ赤「手順の一覧 未記入」もゲージも出さない（v219）'); } else { ng('台帳なしの字が違う（赤「' + B(r) + '」／' + T(r).slice(0, 40) + '）'); }
    r = run(tmp, { state: ST['手待ち'], notices: MIX, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない（手待ち）'); }
    else if (/終わる見込み|見込み未記入|見込みを過ぎた|段 [0-9]|段の台帳|手順の一覧/.test(T(r))) { ng('作業中でないのに見込み・段の行が出た（' + T(r).slice(0, 40) + '）'); } else { ok('作業中でない回（手待ち）には出ない'); }
  }
  /* ---- ⑤の続き 遠隔の釦（v175・2026-11-19 本人の枠）：二行（上に大きく「🔗 遠隔」・下に小さく「名・pid N」）。狭い時は下の行が折り返し、「…」で切らない ---- */
  head('⑤の続き 遠隔の釦（二行・折り返し込みで溢れない）');
  {
    const rcS = Object.assign({}, ST['作業中'], { rcUrl: 'https://claude.ai/code/session_012aGgAFf5sHMiT4QraMojQR', rcName: 'koushu-handan-93', rcPid: 6308 });
    const r = run(tmp, { state: rcS, notices: MIX, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      if (r.rcTop === '🔗 遠隔' && r.rcSub === 'koushu-handan-93・pid 6308') { ok('上「' + r.rcTop + '」／下「' + r.rcSub + '」'); } else { ng('釦の字が違う（上「' + r.rcTop + '」／下「' + r.rcSub + '」）'); }
      if (r.rcTagShown) { ng('消したはずの「遠隔：」の行が出ている'); } else { ok('「遠隔：」の行は出ない'); }
      if (r.rcEllipsis) { ng('釦に「…」切り（text-overflow: ellipsis）が残っている'); } else { ok('「…」で切らない'); }
      for (const x of (r.rcFit || [])) {
        if (x.over) { ng(x.w + 'px：釦の中で字が溢れる（高さ ' + x.h + 'px）'); }
        else { ok(x.w + 'px：折り返し込みで釦に収まる（高さ ' + x.h + 'px・下の行 ' + x.subLines + '行）'); }
      }
      if (!(r.rcFit || []).length) { ng('釦の幅を絞った測りができない'); }
    }
  }
  /* ---- ⑤の三 最後の合図と刻をそのまま・パネルの下の数（v181・2026-11-20 本人の枠） ---- */
  head('⑤の三 最後の合図と刻・下の数（台帳・起こし直し）');
  {
    const nowE = Math.floor(Date.now() / 1000);
    let r = run(tmp, { state: Object.assign({}, ST['手待ち'], { ev: 'Stop', evAt: nowE - 125, foot: { wait: 3, unlinked: 2, revive: '今日 3回（固まり 1・重さ 1・0本 1）', reviveLast: '04:12' } }), notices: MIX, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない（合図・下の数）'); }
    else {
      if (/最後の合図：Stop（[0-9]{2}:[0-9]{2}:[0-9]{2}・2分前）/.test(r.evTag || '')) { ok('最後の合図と刻をそのまま出す「' + r.evTag + '」'); } else { ng('最後の合図の字が違う（' + (r.evTag || '') + '）'); }
      if (/順番待ち 3件/.test(r.footTag || '') && !/台帳 残り/.test(r.footTag || '') && /起こし直し 今日 3回/.test(r.footTag || '') && /最後 04:12/.test(r.footTag || '') && !r.footHidden) { ok('下の数が出る「' + r.footTag + '」'); } else { ng('下の数が出ない（' + (r.footTag || '') + '）'); }
    }
    r = run(tmp, { state: Object.assign({}, ST['手待ち'], { ev: 'PreToolUse', evAt: nowE - 5 }), notices: MIX, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない（foot なし）'); }
    else if (/最後の合図：PreToolUse（/.test(r.evTag || '') && r.footHidden) { ok('合図は作業の途中でもそのまま出し、foot が無ければ下の数は畳む'); } else { ng('PreToolUse／foot なしの出方が違う（' + (r.evTag || '') + '・hidden=' + r.footHidden + '）'); }
  }
  /* ---- ⑤の四 待ちにも「終わる見込み HH:MM（あとN分）」・様子を写すに見込みの行（v182・2026-11-20 本人の枠） ---- */
  head('⑤の四 待ちの終わる見込み（検査中・待ち・雲待ち）と様子を写すの見込み行');
  {
    const hm = sec => { const d = new Date(sec * 1000); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); };
    const T = r => String(r && r.stText || ''), B = r => String(r && r.stBad || '');
    const mk = st => run(tmp, { state: Object.assign({}, st, { at: Math.floor(Date.now() / 1000), statAt: Math.floor(Date.now() / 1000) - 100 }), notices: MIX, settle: 1500 }, 390, 844);
    let r = mk(Object.assign({}, ST['手待ち'], { stat: '検査中', detail: '雲の検査・終了予定 ' + hm(Math.floor(Date.now() / 1000) + 600) }));
    if (!r) { ng('測れない（検査中）'); }
    else if (/終わる見込み [0-9]{2}:[0-9]{2}（あと([5-9]|10|11)分）/.test(T(r)) && !B(r)) { ok('検査中：「' + (T(r).match(/終わる見込み[^）]*）/) || [''])[0] + '」（赤なし）'); } else { ng('検査中の見込みが出ない（' + T(r).slice(0, 80) + '・赤「' + B(r) + '」）'); }
    r = mk(Object.assign({}, ST['手待ち'], { kumo: '雲：パネル替え・見込み ' + hm(Math.floor(Date.now() / 1000) + 420) }));
    if (!r) { ng('測れない（手待ち＋雲待ち）'); }
    else if (/終わる見込み [0-9]{2}:[0-9]{2}（あと([2-8])分）/.test(T(r))) { ok('手待ちの下の雲待ちにも出る'); } else { ng('雲待ちの見込みが出ない（' + T(r).slice(0, 80) + '）'); }
    r = mk(Object.assign({}, ST['手待ち'], { kumo: '雲：パネル替え・見込み ' + hm(Math.floor(Date.now() / 1000) - 900) }));
    if (!r) { ng('測れない（雲待ちの見込み超過）'); }
    else if (/見込みを過ぎた (1[4-9])分/.test(B(r))) { ok('見込みを過ぎたら赤「' + B(r) + '」'); } else { ng('雲待ちの超過が赤で出ない（赤「' + B(r) + '」）'); }
    r = mk(Object.assign({}, ST['手待ち'], { stat: '検査中', detail: '雲の検査・見込み不明' }));
    if (!r) { ng('測れない（見込み不明）'); }
    else if (/見込み不明/.test(T(r)) && !/見込み不明/.test(B(r))) { ok('検査中で刻が無ければ「見込み不明」（v213・枠 八十四：赤にしない）'); } else { ng('「見込み不明」の出し方が違う（字「' + T(r).slice(0, 60) + '」・赤「' + B(r) + '」）'); }
    r = mk(Object.assign({}, ST['手待ち'], { stat: '待ち', detail: '窓が閉じている' }));
    if (!r) { ng('測れない（待ち・刻なし）'); }
    else if (/見込み未記入/.test(B(r))) { ok('待ちで刻が無ければ赤「見込み未記入」'); } else { ng('待ちの「見込み未記入」が赤で出ない（赤「' + B(r) + '」）'); }
    r = mk(ST['手待ち']);
    if (!r) { ng('測れない（何も待たない手待ち）'); }
    else if (/終わる見込み|見込み未記入|見込みを過ぎた|見込み不明/.test(T(r))) { ng('何も待たない手待ちに見込みが出ている（' + T(r).slice(0, 60) + '）'); } else { ok('何も待たない手待ちには見込みを出さない'); }
    const LF = String.fromCharCode(10), H2 = html.split(String.fromCharCode(13) + LF).join(LF);
    const si = H2.indexOf('  function statusText() {'), sj = si >= 0 ? H2.indexOf(LF + '  }' + LF, si) : -1, sb = (si >= 0 && sj > si) ? H2.slice(si, sj + 4) : '';
    if (sb.indexOf("'見込み：'") >= 0 && H2.indexOf('function etaLineText()') >= 0) { ok('様子を写すの字に「見込み：」の行がある（作業中は mikomi・待ちは待ちの見込み・無ければ赤と同じ字）'); } else { ng('様子を写すに見込みの行が無い'); }
  }
  /* ---- ⑤の五 下の三行（取得の刻・最後の合図・台帳と起こし直し）を詰める（v183・2026-11-20 本人の枠） ---- */
  head('⑤の五 下の三行が一つのまとまりに詰まっている（iPhone の幅）');
  {
    const nowE = Math.floor(Date.now() / 1000);
    const stt = Object.assign({}, ST['手待ち'], { ev: 'Stop', evAt: nowE - 30, foot: { wait: 3, unlinked: 2, revive: '今日 3回（固まり 1・重さ 1・0本 1）', reviveLast: '04:12' } });
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      const r = run(tmp, { state: stt, notices: MIX, usage: U_OK, settle: 1500 }, w, h);
      if (!r) { ng(w + 'x' + h + '：測れない（下の三行）'); continue; }
      const L = r.footLines || [];
      if (!r.footGroup) { ng(w + 'x' + h + '：下の三行の包み（#footGroup）が無い'); continue; }
      if (L.length !== 3) { ng(w + 'x' + h + '：見えている行が3本でない（' + L.map(x => x.id).join('・') + '）'); continue; }
      const gaps = [L[1].top - L[0].bottom, L[2].top - L[1].bottom];
      const sumH = L.reduce((a, x) => a + x.h, 0);
      if (gaps.some(g => g > 4 || g < -1)) { ng(w + 'x' + h + '：行の間が空いている／重なっている（' + gaps.map(g => g.toFixed(1)).join('・') + 'px）'); }
      else if (r.footDisp === 'flex' || r.footDisp === 'grid' || /space-/.test(String(r.footJust || '')) || r.footFixedH) { ng(w + 'x' + h + '：余りを配る作り・高さ決め打ち（' + r.footDisp + '／' + r.footJust + '／固定高=' + r.footFixedH + '）'); }
      else if (r.footH > sumH + 12) { ng(w + 'x' + h + '：包みの高さが三行より大きい（' + r.footH.toFixed(1) + '＞' + sumH.toFixed(1) + '）'); }
      else if (r.docOverflow) { ng(w + 'x' + h + '：横に溢れている'); }
      else { ok(w + 'x' + h + '：三行が詰まっている（行の間 ' + gaps.map(g => g.toFixed(1)).join('・') + 'px・包み ' + r.footH.toFixed(1) + 'px・display=' + r.footDisp + '）'); }
    }
  }
  /* ---- ⑤の六 下の並び（v184・2026-11-20 本人の枠）：写し取り一覧／様子を写す → 使用量の三本 → 本体の版の行 → panel の版の行 → 下の三行。HTML の順そのもの ---- */
  head('⑤の六 並び（HTML の順そのもの）：ゲージの箱 → 使用量 → くわしく → 一覧／様子を写す → 本体の版 → panel の版 → 下の三行');
  {
    const nowE = Math.floor(Date.now() / 1000);
    const stt = Object.assign({}, ST['手待ち'], { ev: 'Stop', evAt: nowE - 30, foot: { wait: 3, unlinked: 2, revive: '今日 3回（固まり 1・重さ 1・0本 1）', reviveLast: '04:12' } });
    const WANT = 'usageTag>progBox>btnSteps>btnShots>btnCopyUrl>fVer>verTag>footGroup';   /* v207（本人の枠 六十九）：使用量はゲージの箱のすぐ下・くわしくの上 */
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      const r = run(tmp, { state: stt, notices: MIX, usage: U_OK, settle: 1500 }, w, h);
      if (!r) { ng(w + 'x' + h + '：測れない（並び）'); continue; }
      if (r.ordMissing) { ng(w + 'x' + h + '：要素が無い（' + r.ordMissing + '）'); continue; }
      const tops = r.ordTops || [];
      if (r.ordDoc !== WANT) { ng(w + 'x' + h + '：HTML の順が違う（' + r.ordDoc + '）'); }
      else if (r.ordCss) { ng(w + 'x' + h + '：CSS の order／flex で並べ替えている（' + r.ordCss + '）'); }
      else if (tops.filter(t => t > 0).some((t, i, a) => i > 0 && t < a[i - 1])) { ng(w + 'x' + h + '：画面の上下の並びが HTML の順と食い違う（' + tops.join(',') + '）'); }
      else if (r.ordOverflow) { ng(w + 'x' + h + '：横に溢れている'); }
      else { ok(w + 'x' + h + '：HTML の順＝画面の順（' + r.ordDoc + '）・order 不使用・横溢れなし'); }
    }
  }
  /* ---- ⑤の七 手順のゲージ：使用量の三本と同じ見た目の横長ゲージ（v185・2026-11-20 本人の枠） ---- */
  head('⑤の七 手順のゲージ（使用量と同じ高さ・角丸・色分け・iPhone の幅）');
  {
    const nowE = Math.floor(Date.now() / 1000);
    const base = Object.assign({}, ST['作業中'], { sNow: '検査', sNowAt: nowE - 300, sDone: '直し', sNext: '札', mikomi: '30分', startedAt: nowE - 300 });
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      const r = run(tmp, { state: Object.assign({}, base, { stepDone: 3, stepTotal: 4 }), notices: MIX, usage: U_OK, settle: 1500 }, w, h);
      if (!r) { ng(w + 'x' + h + '：測れない（ゲージ）'); continue; }
      const bg = r.gBg || [];
      if (r.gSegs !== 4 || r.gDone !== 3 || r.gCur !== 3 || r.gLabel !== '4/4') { ng(w + 'x' + h + '：区切り・済み・今・小さい N/M が違う（' + r.gSegs + '・' + r.gDone + '・' + r.gCur + '・「' + r.gLabel + '」）'); }
      else if (!(bg[0] === bg[1] && bg[1] === bg[2] && bg[2] !== bg[3])) { ng(w + 'x' + h + '：済みと今の色が分かれていない（' + bg.join(' / ') + '）'); }
      else if (Math.abs(r.gBarH - r.uBarH) > 1 || r.gRad !== r.uRad) { ng(w + 'x' + h + '：使用量の三本と高さ・角丸が違う（ゲージ ' + r.gBarH + '/' + r.gRad + '・使用量 ' + r.uBarH + '/' + r.uRad + '）'); }
      else if (r.gBarW < 100 || r.gOver) { ng(w + 'x' + h + '：ゲージが狭い／横に溢れる（幅 ' + r.gBarW + '）'); }
      else { ok(w + 'x' + h + '：4/4 のゲージ（済み緑3・今の手順は別色・使用量と同じ高さ ' + r.gBarH + 'px・幅 ' + Math.round(r.gBarW) + 'px）'); }
    }
    const r0 = run(tmp, { state: Object.assign({}, base, { sNow: '', sDone: '', sNext: '', stepDone: 0, stepTotal: 0 }), notices: MIX, usage: U_OK, settle: 1500 }, 390, 844);
    if (!r0) { ng('測れない（手順の一覧なし）'); }
    else if (!/手順の一覧 未記入/.test(String(r0.stBad || '')) && !r0.gSegs) { ok('手順の一覧が無ければ赤字も出さず、ゲージも出さない（v219）'); } else { ng('「手順の一覧 未記入」が赤で出ない（赤「' + String(r0.stBad || '') + '」）'); }
  }
  /* ---- ⑤の八 見込みとゲージを一つの箱に・見出しのすぐ下・無い時は箱ごと出さない（v186・2026-11-20 本人の枠） ---- */
  head('⑤の八 見込みとゲージの箱（見出しの直後・一つの箱・無い時は出さない・iPhone の幅）');
  {
    const nowE = Math.floor(Date.now() / 1000);
    const work = Object.assign({}, ST['作業中'], { sNow: '検査', sNowAt: nowE - 300, sDone: '直し', sNext: '札', mikomi: '30分', startedAt: nowE - 300, stepDone: 3, stepTotal: 4 });
    const hmm = sec => { const d = new Date(sec * 1000); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); };
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      const r = run(tmp, { state: work, notices: MIX, usage: U_OK, settle: 1500 }, w, h);
      if (!r) { ng(w + 'x' + h + '：測れない（箱）'); continue; }
      if (!r.pbExists) { ng(w + 'x' + h + '：箱（#progBox）が無い'); continue; }
      if (!r.pbShown) { ng(w + 'x' + h + '：作業中なのに箱が出ない'); }
      else if (r.pbPrev !== 'P') { ng(w + 'x' + h + '：箱が使用量（#usageMsg）の直後にない（直前＝' + r.pbPrev + '）'); }   /* v220（枠 百四十三）：見出し→使用量の三つ→箱。箱の直前は使用量の説明の行（#usageMsg の <p>） */
      else if (r.pbTop < r.pbHeadBottom - 1 || r.pbTop - r.pbHeadBottom > 120) { ng(w + 'x' + h + '：箱が見出しと使用量のすぐ下でない（見出しの下端 ' + r.pbHeadBottom + '・箱の上端 ' + r.pbTop + '）'); }
      else if (r.pbRows !== 2 || !r.pbEta || !r.pbGauge) { ng(w + 'x' + h + '：箱の中が「終わる見込み」と手順のゲージの二行でない（' + r.pbRows + '行・見込み' + r.pbEta + '・ゲージ' + r.pbGauge + '）'); }
      else if (r.pbBorder < 1) { ng(w + 'x' + h + '：一つの箱に見えない（枠が無い）'); }
      else if (r.pbOver || r.pbLeft < 0 || r.pbRight > r.w + 1) { ng(w + 'x' + h + '：箱が横に溢れる（' + Math.round(r.pbLeft) + '〜' + Math.round(r.pbRight) + '・実際の視野の幅 ' + r.w + '）'); }   /* 視野の幅は headless の窓の下限で指定より広い事がある（実際の幅 r.w と比べる） */
      else { ok(w + 'x' + h + '：箱は見出しの直後・二行（見込み＋ゲージ）・枠あり・幅 ' + Math.round(r.pbW) + 'px（実際の視野 ' + r.w + 'px）で溢れない'); }
    }
    let r2 = run(tmp, { state: Object.assign({}, ST['手待ち'], { kumo: '雲：パネル替え・見込み ' + hmm(nowE + 420), sNow: '', stepDone: 0, stepTotal: 0 }), notices: MIX, usage: U_OK, settle: 1500 }, 390, 844);
    if (!r2) { ng('測れない（待ちの箱）'); }
    else if (r2.pbShown && r2.pbEta && /終わる見込み/.test(String(r2.stText || ''))) { ok('雲待ちの間も箱が出て「終わる見込み」が入る'); } else { ng('雲待ちで箱が出ない／見込みが無い（箱 ' + r2.pbShown + '）'); }
    r2 = run(tmp, { state: ST['手待ち'], notices: MIX, usage: U_OK, settle: 1500 }, 390, 844);
    if (!r2) { ng('測れない（何も無い）'); }
    else if (!r2.pbShown && r2.pbRows === 0) { ok('作業も待ちも無い時は箱ごと出ない'); } else { ng('何も無いのに箱が出ている（行 ' + r2.pbRows + '）'); }
  }
  /* ---- ⑤の九 ボタンの並び（v187・2026-11-20 本人の枠）：遠隔と終わりました N件の二つ並び／写し取り一覧・直近に終わった仕事・様子を写すの三つ並び／直近は箱ごと押して写す ---- */
  head('⑤の九 ボタンの並び（二つ並び・三つ並び・iPhone の幅）');
  {
    const nowE = Math.floor(Date.now() / 1000);
    const sc = { state: Object.assign({}, ST['手待ち'], { rcName: 'koushu-handan-93', rcPid: 6308, rcUrl: 'https://claude.ai/code/session_X', ura: { sub: { running: 1, items: [{ id: 'a', desc: '作り値の下請け', start: '02:00' }], recent: [] }, cloud: { running: [], recent: [] } } }), notices: [N(nowE - 500, '✅ 終わりました（返事不要）', '済んだ件の本文')], board: { waiting: [], recent: [{ name: '直近その一', result: '済んだ' }, { name: '直近その二', result: '済んだ' }] }, usage: U_OK, settle: 1500 };
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      const r = run(tmp, sc, w, h);
      if (!r) { ng(w + 'x' + h + '：測れない（並び）'); continue; }
      const why = [];
      if (!r.rcR || !r.doneR) { why.push('遠隔か終わりましたの釦が出ていない（' + !!r.rcR + '・' + !!r.doneR + '）'); }
      else {
        if (r.halfInHeader) { why.push('遠隔が見出しの中に残っている'); }
        if (Math.abs(r.rcR.w - r.doneR.w) > 2) { why.push('半分ずつでない（' + Math.round(r.rcR.w) + '・' + Math.round(r.doneR.w) + '）'); }
        if (Math.abs(r.rcR.t - r.doneR.t) > 1 || Math.abs(r.rcR.b - r.doneR.b) > 1) { why.push('二つが同じ高さに並んでいない（上 ' + Math.round(r.rcR.t) + '/' + Math.round(r.doneR.t) + '・下 ' + Math.round(r.rcR.b) + '/' + Math.round(r.doneR.b) + '）'); }
        if (!(r.rcR.r <= r.doneR.l + 1) || r.doneR.r > w + 1) { why.push('二つ並びが横に溢れる／重なる'); }
        if (r.rcR.h < 44 || r.doneR.h < 44) { why.push('当たりが44px未満（' + Math.round(r.rcR.h) + '・' + Math.round(r.doneR.h) + '）'); }
        /* v207（本人の枠 六十三）：「くわしく」は同じ段の三つ目・同じ高さ・同じ幅・字が溢れない */
        if (!r.stepsR || !r.stepsIn) { why.push('くわしくが遠隔・終わりましたの段に出ていない'); }
        else {
          if (Math.abs(r.stepsR.w - r.doneR.w) > 2) { why.push('三つが等分でない（' + Math.round(r.rcR.w) + '・' + Math.round(r.doneR.w) + '・' + Math.round(r.stepsR.w) + '）'); }
          if (Math.abs(r.stepsR.t - r.doneR.t) > 1 || Math.abs(r.stepsR.b - r.doneR.b) > 1) { why.push('くわしくが同じ高さに並んでいない'); }
          if (!(r.doneR.r <= r.stepsR.l + 1) || r.stepsR.r > w + 1) { why.push('三つ並びが横に溢れる／重なる'); }
          if (r.stepsR.h < 44) { why.push('くわしくの当たりが44px未満'); }
          if (r.stepsSpill || r.doneSpill) { why.push('釦の中で字がはみ出す（くわしく ' + r.stepsSpill + '・終わりました ' + r.doneSpill + '）'); }
        }
      }
      if (!r.shR || !r.recR || !r.urlR) { why.push('三つ並びの釦が出ていない'); }
      else {
        if (!(r.shR.l < r.recR.l && r.recR.l < r.urlR.l)) { why.push('順が 写し取り一覧→直近に終わった仕事→様子を写す でない'); }
        if (Math.max(Math.abs(r.shR.t - r.recR.t), Math.abs(r.recR.t - r.urlR.t)) > 1) { why.push('三つが同じ高さに並んでいない'); }
        if (r.urlR.r > w + 1 || r.shR.l < -1) { why.push('三つ並びが横に溢れる'); }
        if (r.shR.h < 44 || r.recR.h < 44 || r.urlR.h < 44) { why.push('三つの当たりが44px未満'); }
      }
      if (r.btnOver) { why.push('画面が横に溢れる'); }
      if (why.length) { ng(w + 'x' + h + '：' + why.join('／') + '［' + r.halfDump + '］'); } else { ok(w + 'x' + h + '：遠隔・終わりました N件・くわしくは同じ段の三つ並び（' + Math.round(r.rcR.w) + '・' + Math.round(r.doneR.w) + '・' + Math.round(r.stepsR.w) + 'px・字ははみ出さない）／写し取り一覧・直近に終わった仕事・様子を写すは同じ高さの三つ並び（高さ ' + Math.round(r.recR.h) + 'px）'); }
    }
    const rp = run(tmp, Object.assign({}, sc, { pressRecent: true }), 390, 844);
    if (!rp) { ng('測れない（直近の釦を押す）'); }
    else if (/^棚 0件$/.test(String(rp.recBefore || '')) && rp.shelfOpen === true && rp.shelfClosed === true && /寝ているものはありません/.test(String(rp.shelfText || ''))) { ok('v225：二段目の釦は「棚 N件・約M%」（棚が無ければ「棚 0件」・雲の待ちは横に「・雲 N件・M%」と足すだけ）・押すと棚の一覧が開き、もう一度押すと閉じる（押す前「' + rp.recBefore + '」）'); }
    else { ng('棚の釦の字・開閉が違う（前「' + rp.recBefore + '」・後「' + rp.recAfter + '」・開 ' + rp.shelfOpen + '・閉 ' + rp.shelfClosed + '・中「' + String(rp.shelfText || '').slice(0, 40) + '」）'); }
  }
  /* ---- ⑤の二十六の二 v211（本人の枠 七十八・七十九）：底の八つは、まとめて写すが0件・1件・10件以上の時も、押し通知が有る時も無い時も、場所が少しも動かない（390・375・320） ---- */
  head('⑤の二十六の二 底の八つの場所は 0件・1件・10件以上・押し通知の有無で動かない（四つ×二段・同じ幅と高さ・iPhone の幅）');
  {
    const nE = Math.floor(Date.now() / 1000);
    const base = Object.assign({}, ST['手待ち'], { at: nE, rcName: 'koushu-handan-93', rcPid: 6308, rcUrl: 'https://claude.ai/code/session_X' });
    const cards = (k) => Array.from({ length: k }, (_, i) => N(nE - 900 + i * 10, '🔎 調べました', '作り値の札その' + (i + 1)));
    const pushes = [{ time: nE - 300, at: '2026-11-22 04:00:00', title: '🪟 使用量の敷居（作り値）', parts: 1, body: '使用量の作り値' }, { time: nE - 200, at: '2026-11-22 04:01:40', title: '🙋 ヨシ待ち（作り値）', parts: 1, body: 'ヨシ待ちの作り値' }];
    const CASES = [['0件', cards(0), [], ''], ['1件', cards(1), [], '1件'], ['12件', cards(12), [], '12件'], ['押し通知だけ', cards(0), pushes, '2件'], ['1件＋押し通知', cards(1), pushes, '3件']];
    const near = (a, b) => Math.abs(a - b) <= 0.6;
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      let first = null; const why = [];
      for (const [nm, nt, pu, sub] of CASES) {
        const r = run(tmp, { state: base, notices: nt, ntfy: pu, usage: U_OK, settle: 1500 }, w, h);
        if (!r || !r.b8) { why.push(nm + '：測れない'); continue; }
        if (r.b8.some(x => !x)) { why.push(nm + '：八つのどれかが無い'); continue; }
        const b = r.b8, top = b.slice(0, 4), bot = b.slice(4);
        if (r.cbTop !== 'まとめて写す' || r.cbSub !== sub) { why.push(nm + '：まとめて写すの字が違う（「' + r.cbTop + '」「' + r.cbSub + '」・期待「' + sub + '」）'); }
        if (b[3].disp === 'none' || b[3].vis === 'hidden' || b[3].w < 1) { why.push(nm + '：まとめて写すが隠れた'); }
        if (sub === '' && r.cbDisabled !== true) { why.push(nm + '：0件なのに押せる'); }
        if (sub !== '' && (r.cbDisabled !== false || !/^rgb\(30, 111, 217/.test(String(r.cbBg)))) { why.push(nm + '：1件以上なのに青くない／押せない（' + r.cbBg + '）'); }
        if (b.some(x => Math.abs(x.w - b[0].w) > 1)) { why.push(nm + '：八つの幅が揃わない（' + b.map(x => x.w).join('・') + '）'); }
        if (top.some(x => !near(x.t, top[0].t) || !near(x.h, top[0].h)) || bot.some(x => !near(x.t, bot[0].t) || !near(x.h, bot[0].h))) { why.push(nm + '：段の中で高さが揃わない（上 ' + top.map(x => x.t + '/' + x.h).join('・') + '／下 ' + bot.map(x => x.t + '/' + x.h).join('・') + '）'); }
        if (Math.abs(top[0].h - bot[0].h) > 1) { why.push(nm + '：上の段と下の段の高さが違う（' + top[0].h + '・' + bot[0].h + '）'); }
        if (Math.abs((top[0].t + top[0].h + 8) - bot[0].t) > 1) { why.push(nm + '：二つの段が続いていない（上の段の下 ' + (top[0].t + top[0].h) + '・下の段の上 ' + bot[0].t + '）'); }
        if (top[0].h < 44 || b.some(x => x.w < 44)) { why.push(nm + '：当たりが44px未満'); }
        if (b.some(x => x.id !== 'doneBox' && x.fs !== '13px')) { why.push(nm + '：字の大きさが揃わない（' + b.map(x => x.fs).join('・') + '）'); }
        if (r.btnOver) { why.push(nm + '：画面が横に溢れる'); }
        if (!first) { first = { nm, b }; } else { const mv = b.filter((x, i) => !near(x.l, first.b[i].l) || !near(x.t, first.b[i].t) || !near(x.w, first.b[i].w) || !near(x.h, first.b[i].h)); if (mv.length) { why.push(nm + '：' + first.nm + 'の時から動いた（' + mv.map(x => x.id + ' ' + [x.l, x.t, x.w, x.h].join(',')).join('｜') + '）'); } }
      }
      if (why.length) { ng(w + 'x' + h + '：' + why.join('／')); } else { ok(w + 'x' + h + '：' + CASES.map(c => c[0]).join('・') + ' の五つで、八つの場所と大きさが同じ（幅 ' + first.b[0].w + 'px・高さ ' + first.b[0].h + 'px・上の段の上 ' + first.b[0].t + '・下の段の上 ' + first.b[4].t + '）・まとめて写すは常に出て 0件は字だけ／1件以上は N件と青'); }
    }
  }
  /* ---- ⑤の二十二 見出しが動かない（v207・本人の枠 六十六）：どの一言の時も「返事パネル」と猫の位置・大きさが同じ（iPhone の幅・ブラウザ） ---- */
  head('⑤の二十二 見出しの「返事パネル」と猫は、頭の字がどの一言でも同じ位置・同じ大きさ（iPhone の幅）');
  {
    const nh = Math.floor(Date.now() / 1000), UR = { sub: { running: 1, items: [{ id: 'a', desc: 'x', start: '02:00' }], recent: [] }, cloud: { running: [], recent: [] } };
    const CASES = [['作業中', Object.assign({}, ST['作業中'], { ura: UR }), []], ['裏方作業中', Object.assign({}, ST['手待ち'], { stat: '待ち', detail: '残りの段 2・次「長い長い段の名前」', ura: UR }), []], ['待機中', Object.assign({}, ST['手待ち']), []], ['札まとめ中', Object.assign({}, ST['手待ち'], { cardOwedAt: nh - 30 }), MIX], ['ヨシ待ち', Object.assign({}, ST['ヨシ待ち']), MIX], ['まとめて写す', Object.assign({}, ST['手待ち']), MIX]];
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      let base = null; const why = [], words = [];
      for (const [nm, st, nt] of CASES) {
        const r = run(tmp, { state: Object.assign({}, st, { at: nh }), notices: nt, usage: U_OK, settle: 1500 }, w, h);
        if (!r || !r.catR) { why.push(nm + '：測れない'); continue; }   /* v253 で題の字を消したので hTitle は幅0（測れない）。猫の位置・大きさで見る */
        words.push(String(r.headWait || ''));
        if (r.hTitleSpill) { why.push(nm + '：「返事パネル」が折り返す／はみ出す'); }
        if (Math.round(r.catR.w) !== 80 || Math.round(r.catR.h) !== 80) { why.push(nm + '：猫が80x80でない（' + Math.round(r.catR.w) + 'x' + Math.round(r.catR.h) + '）'); }
        const k = [(r.hTitleR || {}).l, (r.hTitleR || {}).t, (r.hTitleR || {}).w, (r.hTitleR || {}).h, r.catR.l, r.catR.t].map(x => Math.round(x)).join(',');
        if (base === null) { base = k; } else if (k !== base) { why.push(nm + '：見出しか猫が動いた（' + base + ' → ' + k + '）'); }
        /* v207（枠 六十八）：版の行の右端は「更新 HH:MM」。最終確認と同じ行に一行で収まる */
        if (!/^更新 [0-9]{2}:[0-9]{2}$/.test(r.statTxt)) { why.push(nm + '：右端が「更新 HH:MM」でない（' + r.statTxt + '）'); }
        else if (!r.statR || !r.seenR || Math.abs(r.statR.t - r.seenR.t) > 1 || r.statR.h > 24 || r.statR.r > w - 13) { why.push(nm + '：「' + r.statTxt + '」が最終確認と同じ一行に収まらない'); }
        else if (Math.abs(r.statR.l - r.seenR.r - 14) > 2) { why.push(nm + '：「' + r.statTxt + '」が最終確認のすぐ後ろ（間 14px）でない（間 ' + Math.round(r.statR.l - r.seenR.r) + 'px・v214 枠 九十一）'); }   /* v214（本人の枠 九十一）：右の端へ寄せない */
      }
      if (why.length) { ng(w + 'x' + h + '：' + why.join('／')); } else { ok(w + 'x' + h + '：' + words.length + 'つの一言（' + words.join('／') + '）で「返事パネル」と猫は同じ位置・同じ大きさ（' + base + '）'); }
    }
  }
  /* ---- ⑤の十 札まとめ中（v188・2026-11-20 本人の枠）：控えにあるがまだ公開に見えていない札の印（cardOwedAt）がある間は待機中でなく「札まとめ中、、、」・出たら「まとめて写すヨシ！」・3分で赤「札が遅れている」・印が無ければ待機中・10秒おきに読み直す ---- */
  head('⑤の十 札まとめ中（待機中でなく・見込みの刻・赤・10秒おき・EventSource を増やさない）');
  {
    const nf = () => Math.floor(Date.now() / 1000);
    const quiet = Object.assign({}, ST['手待ち']);
    const run1 = (extra, notices, vw, vh, settle) => run(tmp, { state: Object.assign({}, quiet, { at: nf(), statAt: nf() - 100 }, extra), notices: notices, usage: U_OK, settle: settle || 1500 }, vw || 390, vh || 844);
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      const r = run1({ cardOwedAt: nf() - 30 }, MIX, w, h);
      if (!r) { ng(w + 'x' + h + '：測れない（札まとめ中）'); continue; }
      const t = String(r.headWait || '');
      if (t === '札まとめ中、、、。' && r.hwCls !== 'late') { ok(w + 'x' + h + '：印がある間は待機中でなく「' + t + '」（v207：刻は付けない一言・赤でない）'); } else { ng(w + 'x' + h + '：札まとめ中が出ない（頭の字「' + t + '」・class「' + r.hwCls + '」）'); }
    }
    let r = run1({ cardOwedAt: nf() - 200 }, MIX);
    if (!r) { ng('測れない（札が遅れている）'); }
    else if (/札が遅れている/.test(String(r.headWait || '')) && r.hwCls === 'late' && /^rgb\(/.test(String(r.hwColor || '')) && Number(r.hwWeight) >= 600) { ok('3分たっても出なければ赤く太く「札が遅れている」（色 ' + r.hwColor + '）'); } else { ng('「札が遅れている」が赤で出ない（「' + String(r.headWait) + '」・class「' + r.hwCls + '」・色 ' + r.hwColor + '）'); }
    const fresh = [N(nf() - 5, '✅ 終わりました（返事不要）', '済んだ仕事の本文')];
    r = run1({ cardOwedAt: nf() - 30 }, MIX.concat(fresh));
    if (!r) { ng('測れない（札が出た）'); }
    else if (/まとめて写すヨシ！/.test(String(r.headWait || '')) && !/まとめ中|遅れ/.test(String(r.headWait || ''))) { ok('札が一覧に出たら「まとめて写すヨシ！」へ（頭の字「' + r.headWait + '」）'); } else { ng('札が出ても「まとめて写すヨシ！」にならない（頭の字「' + String(r.headWait) + '」）'); }
    r = run1({ cardOwedAt: 0 }, []);
    if (!r) { ng('測れない（印なし）'); }
    else if (/待機中|休憩中/.test(String(r.headWait || '')) && !/まとめ中|遅れ/.test(String(r.headWait || ''))) { ok('印が無ければ今までどおり「待機中」'); } else { ng('印が無いのに待機中でない（頭の字「' + String(r.headWait) + '」）'); }
    r = run1({ cardOwedAt: nf() - 700 }, []);
    if (!r) { ng('測れない（印が古い）'); }
    else if (/待機中|休憩中/.test(String(r.headWait || ''))) { ok('10分たった印は消えて「待機中」に戻る（永久に居座らない）'); } else { ng('10分たった印が居座っている（頭の字「' + String(r.headWait) + '」）'); }
    const hit1 = run1({ cardOwedAt: nf() - 20 }, MIX, 390, 844, 12500), hit0 = run1({ cardOwedAt: 0 }, MIX, 390, 844, 12500);
    if (!hit1 || !hit0) { ng('測れない（読み直し）'); }
    else if (hit1.noticeHits >= hit0.noticeHits + 1) { ok('印がある間は10秒おきに札を読み直す（札の取得 ' + hit1.noticeHits + '回・印なしは ' + hit0.noticeHits + '回）'); } else { ng('印があっても読み直しが増えない（' + hit1.noticeHits + '回・印なし ' + hit0.noticeHits + '回）'); }
    /* v189：雲の検査を待つ間は、札は控えに置いたまま出さない。見込みの刻は検査の見込み・遅れの赤は見込みの30秒後から */
    r = run1({ cardOwedAt: nf() - 400, cardOwedEta: nf() + 600 }, []);   /* 札の一覧は空：検査の頭の now から離れた MIX の札を「出た札」と数えないため */
    if (!r) { ng('測れない（雲待ちの間）'); }
    else if (String(r.headWait || '') === '札まとめ中、、、。' && r.hwCls !== 'late') { ok('雲の検査を待つ間は、待ち始めから400秒たっても赤にならず「' + r.headWait + '」'); } else { ng('雲待ちの間に遅れの赤が出た／まとめ中が出ない（「' + String(r.headWait) + '」・class「' + r.hwCls + '」）'); }
    r = run1({ cardOwedAt: nf() - 900, cardOwedEta: nf() - 60 }, []);
    if (!r) { ng('測れない（検査の見込みを過ぎた）'); }
    else if (/札が遅れている/.test(String(r.headWait || '')) && r.hwCls === 'late') { ok('検査の見込みを30秒過ぎたら赤「札が遅れている」'); } else { ng('検査の見込みを過ぎても赤にならない（「' + String(r.headWait) + '」）'); }
    r = run1({ cardOwedAt: nf() - 900, cardOwedEta: nf() - 10 }, []);
    if (!r) { ng('測れない（見込みの直後）'); }
    else if (/札まとめ中/.test(String(r.headWait || '')) && r.hwCls !== 'late') { ok('検査の見込みを過ぎて30秒以内はまだ赤にしない'); } else { ng('見込みの直後に赤になった（「' + String(r.headWait) + '」）'); }
    const es = (html.match(/new EventSource\(/g) || []).length;
    if (es === 0 && !/koushu-st-/.test(html) && !/STATE_TOPIC|startStateSse/.test(html)) { ok('EventSource は無く、状態の聞き取りの話題名（koushu-st-）も頁に残っていない（v194で外した）'); } else { ng('EventSource か話題名が頁に残っている（EventSource ' + es + '箇所）'); }
  }
  staticParts();   // ⑤の十二・⑤の十三（ブラウザを使わない部分・--static でも回る）
  /* ---- ⑤の十一 指さす（v191・2026-11-20 本人の枠） ---- */
  head('⑤の十一 指さす（釦の置き場・透明な幕・部品の名とid・写す字・下の釦を動かさない・取り消し・iPhone の幅）');
  {
    const sc = { state: Object.assign({}, ST['手待ち'], { at: Math.floor(Date.now() / 1000), rcName: 'koushu-handan-93', rcPid: 6308, rcUrl: 'https://claude.ai/code/session_X', foot: { wait: 3, unlinked: 2 } }), notices: [], board: { waiting: [], recent: [{ name: '直近その一', result: '済んだ' }] }, usage: U_OK, point: true, settle: 1500 };
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      const r = run(tmp, sc, w, h);
      if (!r) { ng(w + 'x' + h + '：測れない（指さす）'); continue; }
      const why = [], B = r.pBtn || {};
      if (!B.point || !B.url || !B.shots || !B.rec) { why.push('釦が出ていない'); }
      else {
        if (B.point.h < 44) { why.push('指さすの当たりが44px未満（' + Math.round(B.point.h) + '）'); }
        const sameRow = Math.abs(B.point.t - B.url.t) < 2, below = B.point.t >= B.url.b - 1;
        if (!sameRow && !below) { why.push('指さすが様子を写すの隣でも下の一段でもない'); }
        if (sameRow && B.point.l < B.url.l) { why.push('指さすが様子を写すの左にある'); }
        if (B.point.r > w + 1 || B.point.l < -1) { why.push('指さすが横にはみ出す'); }
      }
      if (r.pOver) { why.push('画面が横に溢れる'); }
      const V = r.pVeil || {};
      if (V.hidden !== false || V.parent !== 'BODY' || V.pos !== 'fixed' || Math.abs(V.w - w) > 1 || Math.abs(V.h - h) > 1) { why.push('幕が画面いっぱいの固定になっていない（' + JSON.stringify(V) + '）'); }
      if (!/pan-x/.test(String(V.ta || '')) || !/pan-y/.test(String(V.ta || ''))) { why.push('幕の上からスクロールできない作り（touch-action ' + V.ta + '）'); }
      if (!/rgba\(0, 0, 0, 0\)|transparent/.test(String(V.alpha || ''))) { why.push('幕が透明でない（' + V.alpha + '）'); }
      if (r.pBanner !== 'おかしい所を押して' || r.pBodyCls.indexOf('pointing') < 0 || !/もう一度押すとやめる/.test(String(r.pLabel || ''))) { why.push('案内・釦の字が違う（' + r.pBanner + '／' + r.pLabel + '）'); }
      if (r.pBoardClicks1 !== 0) { why.push('幕の間に下の釦が動いた（まとめて写す ' + r.pBoardClicks1 + '回）'); }
      const clip = String(r.pClip || '');
      if (clip.indexOf('ここがおかしい：') !== 0) { why.push('写す字の頭が「ここがおかしい：」でない（' + clip.slice(0, 20) + '）'); }
      if (!/部品：様子を写す（id btnCopyUrl／button）/.test(clip)) { why.push('部品の名と id が違う（' + clip.split('\n')[1] + '）'); }
      if (!/出ていた字：様子を写す/.test(clip)) { why.push('その時出ていた字が無い'); }
      if (!/現況：/.test(clip) || !/状態：/.test(clip) || !/押した刻：/.test(clip)) { why.push('「様子を写す」と同じ字が入っていない'); }
      if (!/札の結び：結べなかった札 2件（今日）／順番待ち 3件/.test(clip)) { why.push('様子を写すに「札の結び：結べなかった札 N件」「順番待ち」が入っていない'); }
      if (r.pVeilHiddenAfter !== true || r.pBodyClsAfter.indexOf('pointing') >= 0 || r.pLabelAfter !== '写した') { why.push('写した後に戻っていない（幕 ' + r.pVeilHiddenAfter + '・釦「' + r.pLabelAfter + '」）'); }
      if (r.pCancelOn !== true || r.pCancelOff !== true) { why.push('釦をもう一度押してもやめられない'); }
      if (why.length) { ng(w + 'x' + h + '：' + why.join('／')); } else { ok(w + 'x' + h + '：指さす→幕と案内→下の釦は動かない→様子を写すの上を押すと「ここがおかしい：／部品：様子を写す（id btnCopyUrl）／出ていた字」＋様子を写すと同じ字が写り、戻る／もう一度押すとやめる（釦は' + (Math.abs(B.point.t - B.url.t) < 2 ? '様子を写すの隣' : '下の一段') + '）'); }
    }
  }
  /* ---- ⑥⑦ 終了予定（黄色い帯の刻）：v173 で帯を外したので測る相手が無い ---- */








  head('⑥⑦ 黄色い帯の終了予定（v173 で外した）');
  note('黄色い帯を外した（v173）。終了予定は検査中の中身だけに出し、状態の決め所の総当たりで見る');

  /* ---- ⑧ 値の無い使用量を 0% として描かない（2026-09-02・使用量の空振り-1） ---- */
  head('⑧ 値の無い使用量を 0% と描かない');
  {
    const a = run(tmp, { state: ST['手待ち'], notices: MIX, usage: U_OK, settle: 1200 }, 390, 844);
    if (!a) { ng('測れない'); }
    else if (a.uShown && /21/.test(a.uText) && /11/.test(a.uText)) { ok('読める回：三行に数字が出る（' + a.uText.replace(/s+/g, ' ').slice(0, 30) + '）'); }
    else { ng('読める回に数字が出ない（出た「' + String(a.uText).slice(0, 40) + '」）'); }

    const b = run(tmp, { state: ST['手待ち'], notices: MIX, usage: U_HELD, settle: 1200 }, 390, 844);
    if (!b) { ng('測れない'); }
    else if (!b.uShown || /0%/.test(String(b.uText))) { ng('空の回に 0% を描いた（' + String(b.uText).slice(0, 40) + '）'); }
    else if (/21/.test(b.uText) && /時点の値/.test(String(b.uWhen))) { ok('空・控えあり：控えの値を出し、足元に「' + String(b.uWhen).slice(0, 26) + '」'); }
    else { ng('空・控えありの出し方が違う（値「' + String(b.uText).slice(0, 24) + '」／足元「' + String(b.uWhen).slice(0, 30) + '」）'); }

    const c = run(tmp, { state: ST['手待ち'], notices: MIX, usage: U_NONE, settle: 1200 }, 390, 844);
    if (!c) { ng('測れない'); }
    else if (c.uShown) { ng('空・控えなしで数字の箱が出た（' + String(c.uText).slice(0, 40) + '）'); }
    else if (/取れていません/.test(String(c.uMsg))) { ok('空・控えなし：数字を出さず「' + String(c.uMsg) + '」'); }
    else { ng('空・控えなしの断りが出ない（' + String(c.uMsg) + '）'); }
  }


  /* ---- ⑨ 終了予定の刻の色分け：v173（2026-11-19）で黄色い帯を外したので測る相手が無い。検査中の終了予定は state-decide-test.js が見る ---- */
  head('⑨ 終了予定の刻だけが別色（v173 で黄色い帯を外した）');
  note('黄色い帯を外した（v173）。検査中の「終了予定 HH:MM／見込み不明」は状態の決め所の総当たりで見る');

  /* ---- ⑩ 通知の本文を写す釦（2026-09-02・通知のコピー-1） ---- */
  /*   ＊三通り：短い通知／長い報告（送る側では7通に割れる長さ）／空。
   *   ＊眼目は**割れずに一枚で写る**こと。置き場には割る前の一枚しか無いので、
   *     写しの字数が置き場の字数とぴったり合えば、一枚で写せている。 */
  head('⑩ まとめて写すが札と通知の両方を束ねる');
  {
    /* ---- 押す所は一つ（2026-09-03・写しの一本化-1）----
     *   ＊「通知の本文を写す」の釦は畳んだ。まとめて写すが**札と通知の両方**を数え、
     *     刻の順（新しい順）で一枚に並べて写す。通知には頭に「通知」が付く。
     *   ＊作り値は 札3枚＋通知2本＝5件。残5／5件 → 押す → 5件 写した → 0件で畳む。 */
    const t0 = now;
    const cards = [
      { time: t0 - 500, title: '✅ 終わりました（返事不要）', message: '札その1' + String.fromCharCode(10) + '札1の二行目' },
      { time: t0 - 300, title: '🔎 調べました',               message: '札その2' + String.fromCharCode(10) + '札2の二行目' },
      { time: t0 - 100, title: '✅ 終わりました（返事不要）', message: '札その3' + String.fromCharCode(10) + '札3の二行目' }
    ];
    const ntfy = [
      { time: t0 - 400, at: '2026-09-03 13:40:00', title: '通知その1', parts: 1, body: '通知1の本文' },
      { time: t0 - 200, at: '2026-09-03 13:45:00', title: '通知その2', parts: 1, body: '通知2の本文' }
    ];
    const r = run(tmp, { state: ST['手待ち'], notices: cards, ntfy: ntfy, press: true, settle: 1800 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      const before = String(r.beforeBtn || '');
      const clip = String(r.clip || '');
      const lines = clip.split(String.fromCharCode(10));
      const want = ['札その1', '札その2', '札その3', '通知その1', '通知その2'];
      const miss = want.filter(w => clip.indexOf(w) < 0);
      const idx = want.map(w => clip.indexOf(w));
      /* 刻の順（新しい順）… 札3 → 通知2 → 札2 → 通知1 → 札1 */
      const order = ['札その3', '通知その2', '札その2', '通知その1', '札その1'].map(w => clip.indexOf(w));
      const sorted = order.every((v, i) => i === 0 || (v > order[i - 1]));
      if (!/残5／5件/.test(before)) { ng('押す前の字が残5／5件でない（「' + before + '」）'); }
      else if (miss.length) { ng('写しに入っていないものがある（' + miss.join('・') + '）'); }
      else if (clip.indexOf('／ 通知 ／ 通知その1') < 0) { ng('通知の頭（「通知」）が付いていない'); }
      else if (!sorted) { ng('刻の順に並んでいない（' + order.join('/') + '）'); }
      else if (!/5件 写した/.test(String(r.afterBtn || ''))) { ng('押した後の字が違う（「' + String(r.afterBtn) + '」）'); }
      else { ok('残5／5件 → 5件 写した。札3＋通知2が刻の順で一枚に入った（写し ' + lines.length + '行）'); }
    }
  }

  /* ---- ⑪ 長い報告の札を、まとめて写すが一枚で写す（2026-09-02・通知の分け方-1） ---- */
  /*   ＊長い報告は ntfy へ送らない。**札として立てて、釦で写す**形にした。
   *   ＊眼目は、6000字級の札でも**割れずに丸ごと**写しへ入ること。 */
  head('⑪ 長い報告の札を一枚で写す');
  {
    let long = '';
    for (let i = 0; i < 205; i++) { long += '行' + i + '：実測の数字と字がここに並ぶ。長さを稼ぐための行。' + String.fromCharCode(10); }
    const cards = [ { time: now - 60, title: '報告 長いもの', message: long } ];
    const r = run(tmp, { state: ST['手待ち'], notices: cards, press: true, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      const clip = String(r.clip || '');
      const full = String(r.clipLen || 0);
      if (r.clipLen >= long.length && clip.indexOf(long.slice(0, 80)) >= 0) {
        ok('6000字級の札が一枚で写しへ入った（本文 ' + long.length + '字／写し ' + full + '字）');
      } else {
        ng('長い札が丸ごと入っていない（本文 ' + long.length + '字／写し ' + full + '字）');
      }
    }
  }


  /* ---- ⑫ 本文の全行が写しへ入る（2026-09-03・写しの切れ-1） ---- */
  /*   ＊落ちていたのは見張りの控えの読み手（行ごとに見出しを当て、続きの行を捨てていた）で、
   *     まとめて写す自身は前から全行を束ねていた。**ここはその裏を取り続けるための網。**
   *   ＊作り値は 本文5行＋ファイル＋実測＋実機。ファイルの行だけは写しの絞り（v106）で落ちる。 */
  head('⑫ 本文の全行が写しへ入る');
  {
    const NLc = String.fromCharCode(10);
    const body = ['写しの切れ-1（作り値）', '本文の一行目です。', '本文の二行目です。',
                  '本文の三行目です。', '本文の四行目です。', '本文の五行目です。',
                  'ファイル: panel.html／panel-check.js', '実測: 作り値で5行を確かめた',
                  '実機: 版の字が新しくなっていること'].join(NLc);
    const cards = [ { time: now - 60, title: '✅ 終わりました（返事不要）', message: body } ];
    const r = run(tmp, { state: ST['手待ち'], notices: cards, press: true, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      const clip = String(r.clip || '');
      const want = ['本文の一行目です。', '本文の二行目です。', '本文の三行目です。',
                    '本文の四行目です。', '本文の五行目です。'];
      const miss = want.filter(w => clip.indexOf(w) < 0);
      if (miss.length) { ng('本文の行が落ちた（' + miss.length + '行／' + miss[0] + '）'); }
      else if (clip.indexOf('実測: 作り値で5行を確かめた') < 0) { ng('実測の行が落ちた'); }
      else if (clip.indexOf('実機: 版の字が新しくなっていること') < 0) { ng('実機の行が落ちた'); }
      else if (clip.indexOf('ファイル: panel.html') >= 0) { ng('ファイルの行が落ちていない（写しの絞りが効いていない）'); }
      else { ok('本文5行＋実測＋実機が入り、ファイルの行だけ落ちた（写し ' + clip.split(NLc).length + '行）'); }
    }
  }


  /* ---- ⑬ 板の取得が転んでも、前に読めた値を捨てない（2026-09-03・板の欠け-1） ---- */
  /*   ＊2分ごとの取得が一度こけただけで、板の箱と写しの板の行が消えていた。
   *   ＊一度読めたあとに転ばせて、箱が残り「読めません」に化けないことを見る。
   *   ＊一度も読めていないときは、今までどおり理由を出す。 */
  head('⑬ 板が取れない回に前の値を残す');
  {
    const B = { waiting: [{ at: '2026-09-03 10:00', name: '板の欠け-1 の実機確認', no: '1' }], recent: [] };
    const a = run(tmp, { state: ST['手待ち'], notices: MIX, board: B, boardFailAfter: 1, settle: 2600 }, 390, 844);
    if (!a) { ng('測れない'); }
    else if (/板の値を読めません/.test(String(a.boardText || ''))) {
      ng('一度読めたのに「読めません」へ化けた（' + String(a.boardText).slice(0, 40) + '）');
    } else if (String(a.boardText || '').indexOf('あなた待ち') >= 0) {
      ok('取得が転んでも板の箱が残った（' + String(a.boardText).replace(/s+/g, ' ').slice(0, 34) + '）');
    } else { ng('板の箱が出ていない（' + String(a.boardText).slice(0, 40) + '）'); }

    const b = run(tmp, { state: ST['手待ち'], notices: MIX, board: B, boardFailAfter: 0, settle: 1500 }, 390, 844);
    if (!b) { ng('測れない'); }
    else if (/板の値を読めません/.test(String(b.boardText || ''))) { ok('一度も読めない回は、今までどおり理由を出す'); }
    else { ng('一度も読めないのに理由が出ない（' + String(b.boardText).slice(0, 40) + '）'); }
  }


  /* ---- ⑭ 通知の印は札に掛からない／黄色の行に題／釦の下に目次（2026-09-03・パネルの立て直し-1） ---- */
  head('⑭ 通知の印は札に掛からない・題が出る・目次が並ぶ');
  {
    const t0 = now;
    const NLc = String.fromCharCode(10);
    const cards = [
      { time: t0 - 900, title: '✅ 終わりました（返事不要）', message: '札その1（作り値）' + NLc + '二行目' },
      { time: t0 - 600, title: '🔎 調べました',               message: '札その2（作り値）' + NLc + '二行目' },
      { time: t0 - 100, title: '✅ 終わりました（返事不要）', message: '札その3（作り値）' + NLc + '二行目' }
    ];
    const ntfy = [
      { time: t0 - 700, at: '2026-09-03 21:00:00', title: '通知その1', parts: 1, body: '通知1の本文' },
      { time: t0 - 300, at: '2026-09-03 21:05:00', title: '通知その2', parts: 1, body: '通知2の本文' }
    ];
    /* 通知だけを写した状態にする（札には一つも印を置かない） */
    const seeded = {};
    ntfy.forEach(e => { seeded[String(e.time) + '|' + e.title] = 1; });
    const r = run(tmp, { state: ST['手待ち'], notices: cards, ntfy: ntfy, ntfyCopied: seeded, settle: 1800 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      const btn = String(r.btn || '');
      if (!/残3／3件/.test(btn)) { ng('通知を写したのに札の残が動いた（釦「' + btn + '」）'); }
      else if (r.cardMarks) { ng('札の側にも印が付いている（' + String(r.cardMarks).slice(0, 40) + '）'); }
      else { ok('通知だけ写しても札の残は 残3／3件のまま。札の印は空'); }

      const st = String(r.stText || '');
      if (!st) { ok('黄色い帯は出ない（v173 で外した）'); } else { ng('黄色い帯の跡に字が出た（段の台帳が無い回なのに）「' + st.slice(0, 40) + '」'); }

      const td = String(r.todoText || '');
      if (r.todoRows === 3 && /札その3/.test(td) && /✅/.test(td) && /🔎/.test(td)) {
        ok('釦の下に写せる札の目次が3行（題＋印＋刻）');
      } else { ng('目次が違う（' + r.todoRows + '行／' + td.slice(0, 50) + '）'); }
    }
  }


  /* ---- ⑮ 札だけの回の通し（2026-09-03・連携の立て直し-1） ---- */
  /*   ＊一つの作り値（札3件・本文3行ずつ）で、四つを続けて見る——
   *     残3／3件 → 押して 0件で畳む ／ 写しに本文が全部 ／ 黄色の行に終わった題 ／ 釦の下に目次。 */
  head('⑮ 札だけの回（残3／3件→押して0・本文全部・題・目次）');
  {
    const NLc = String.fromCharCode(10);
    const cards = [
      { time: now - 900, title: '✅ 終わりました（返事不要）', message: '読みの道-2（名を変えた写しを置く）' + NLc + '本文の二行目' + NLc + '本文の三行目' },
      { time: now - 500, title: '🔎 調べました',               message: '巡回の固まり-2（根を当てる）' + NLc + '本文の二行目' + NLc + '本文の三行目' },
      { time: now - 100, title: '✅ 終わりました（返事不要）', message: '読みの道-3（URL 一行にする）' + NLc + '本文の二行目' + NLc + '本文の三行目' }
    ];
    const r = run(tmp, { state: ST['手待ち'], notices: cards, ntfy: [], press: true, settle: 1800 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      const before = String(r.beforeBtn || ''), after = String(r.afterBtn || '');
      const clip = String(r.clip || ''), st = String(r.stText || ''), td = String(r.todoText || '');
      if (!/残3／3件/.test(before)) { ng('押す前が残3／3件でない（「' + before + '」）'); }
      else if (!/3件 写した/.test(after)) { ng('押した後の字が違う（「' + after + '」）'); }
      else if (['本文の二行目', '本文の三行目', '読みの道-2', '読みの道-3', '巡回の固まり-2'].some(w => clip.indexOf(w) < 0)) {
        ng('写しに欠けがある（' + clip.split(NLc).length + '行）');
      }
      else if (st) { ng('黄色い帯の跡に字が出た（' + st.slice(0, 40) + '）'); }
      else if (r.todoRows !== 3) { ng('目次が3行でない（' + r.todoRows + '行）'); }
      else { ok('残3／3件 → 3件 写した。写し ' + clip.split(NLc).length + '行に本文全部、黄色い帯は出ない、目次3行'); }
    }
  }


  /* ---- ⑯ 三つの数が揃う（2026-09-04・数の不一致-1） ---- */
  /*   ＊釦の残N／M件・目次の行数・知らせの「写せます（N件）」の三つは、
   *     **写した印の無い、中身のある札の数**で揃える。
   *   ＊「写せます（N件）」の札そのものは、数にも目次にも写しにも入れない。
   *   ＊作り値は 中身のある札2枚＋写せますの札1枚。三つとも 2 になるのが正。 */
  head('⑯ 釦・目次・写せますの札の数が揃う');
  {
    const NLc = String.fromCharCode(10);
    const cards = [
      { time: now - 600, title: '✅ 終わりました（返事不要）', message: '中身のある札その1' + NLc + '二行目' },
      { time: now - 300, title: '🔎 調べました',               message: '中身のある札その2' + NLc + '二行目' },
      { time: now - 60,  title: '✅ 終わりました（返事不要）', message: '写せます（3件）' }   /* v117：札が3件と言っても分母は2 */
    ];
    const r = run(tmp, { state: ST['手待ち'], notices: cards, ntfy: [], press: true, settle: 1800 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      const before = String(r.beforeBtn || ''), clip = String(r.clip || '');
      /* v117：写せますの札が「3件」と言っていても、分母は**いま残っている数**に揃う。 */
      if (!/残2／2件/.test(before)) { ng('釦が残2／2件でない（「' + before + '」）'); }
      else if (r.todoRows !== 2) { ng('目次が2行でない（' + r.todoRows + '行）'); }
      else if (clip.indexOf('写せます（') >= 0) { ng('写しに「写せます」の札が入っている'); }
      else if (!/2件 写した/.test(String(r.afterBtn || ''))) { ng('押した後の字が違う（「' + String(r.afterBtn) + '」）'); }
      else { ok('釦 残2／2件 ／ 目次2行 ／ 写せますの札は数にも目次にも写しにも入らない'); }
    }
  }

  head('⑯の二 ブラウザで開いたパネル（panel-core.js を <script src> で読む）の残り・頭の字が、同じ作り値の panelView と同じ');
  {
    const PV = require(path.join(path.dirname(SRC), 'panel-view.js'));
    const jst = (t) => new Date((t + 9 * 3600) * 1000).toISOString().slice(0, 19).replace('T', ' ');
    const pvv = (html.match(/var PANEL_VER = '([0-9]+)'/) || [])[1];
    const cards = [{ time: now - 600, title: '✅ 終わりました（返事不要）', message: '印より前の札' }, { time: now - 300, title: '🔎 調べました', message: '印より後の札' }, { time: now - 60, title: '✅ 終わりました（返事不要）', message: '写せます（2件）' }];
    const ntfys = [{ time: now - 250, title: '🔎 調べました', eid: '' }, { time: now - 200, title: '☁️ 雲の走りが落ちた（x）', eid: '' }, { time: now - 500, title: '🕒 延びています', eid: '' }];
    [['印 now-400', jst(now - 400)], ['印 now（全部読んだ）', jst(now)]].forEach(([nm, rd]) => {
      const stt = Object.assign({}, ST['手待ち'], { senkoReadAt: rd, at: Math.floor(Date.now() / 1000) });   /* 検査が長く回った後でも記録が新しい（LOST_SEC=300 で接続不良に倒れない） */
      const r = run(tmp, { state: stt, notices: cards, ntfy: ntfys, settle: 1800 }, 390, 844);
      const v = PV.panelView(stt, cards, ntfys, now);
      if (!r) { ng(nm + '：測れない'); return; }
      if (r.coreVer !== pvv) { ng(nm + '：ブラウザが panel-core.js を読めていない／版が違う（読めた版「' + r.coreVer + '」・PANEL_VER ' + pvv + '）'); return; }
      if (String(r.btn || '') === v.label && String(r.hwText || '') === v.head) { ok(nm + '：パネル「' + r.btn + '」「' + r.hwText + '」＝ panelView（left ' + v.left + '・head「' + v.head + '」）・読めた部品は v' + r.coreVer); } else { ng(nm + '：パネル「' + r.btn + '」「' + r.hwText + '」／panelView「' + v.label + '」「' + v.head + '」'); }
    });
  }
} finally {
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* Windows では Edge の置き場がまだ掴まれていて消せない事がある。検査の結果には関わらない */ }
}

/* ---- ⑰ v118 で足した三つが、字面のとおり繋がっているか（2026-09-05・先の穴-2）----
     ＊ここは真似た台を立てずに**字面で照合する**。器・読む元・呼び出しの三点が
       揃っていることだけを見る（描き方そのものは⑦の画面の実測が見ている）。 */
function part17() {
head('⑰ v118 の三つ（過去の札・訴えの行・最後に受けた枠）');
{
  /* ＊正規表現は使わない。**字面をそのまま探す**（indexOf）。
     　書き出しの途中で escape が落ちて、パターンが別物になる事故を避けるため
     　（2026-09-05、ここで一度踏んだ）。 */
  const need = [
    ['過去の札の器',       'id="arcBox"',                   '器（arcBox）が無い'],
    ['過去の札の読む元',   'notices-archive.json',           '読む元が無い'],
    ['過去の札の呼び出し', 'paintArcBox();',                 '起動での呼び出しが無い'],
    ['過去の札の押し受け', "$('arcList').addEventListener",  '押し受けが無い'],
    ['訴えの行の器',       'id="pipeWarn"',                 '器（pipeWarn）が無い'],
    ['訴えの行の読む元',   'pipe-warn.json',                 '読む元が無い'],
    ['訴えの行の見る鍵',   'ntfyDown',                       'ntfyDown を見ていない'],
    ['訴えの行の呼び出し', 'paintPipeWarn();',               '起動での呼び出しが無い'],
    ['過去の札の件数の読む元', 'archive-count.txt',              '件数の読む元が無い'],
    ['過去の札の件数の控え',   'arcCount',                       '件数を控える変数が無い'],
    ['過去の札の件数を先に読む','loadArcCount(head, ul);',        '起動で件数を読んでいない'],
    ['コマ送りは白版',     "'cat0-w.png'",                    'コマ送りが白版でない'],
    ['指示待ちで寝姿',     "el.src = 'cat-sleep-w.png'",      '寝姿へ戻す枝が無い'],
    /* 2026-09-13・頭の猫-5 で object-fit:contain → none へ。枠は 80x80 のまま、
       中身は原寸で置く（白猫 56x36 は枠の中ほど、現場猫 80x80 は枠いっぱい）。
       none は絵を一切伸縮しないので、contain より強く「潰さない」。 */
    ['絵を伸縮しない',     'object-fit:none',                 '題の猫の箱の指定が無い'],
    ['頭の枠は二通りとも80px', '#runcat{width:80px; height:80px', '頭の枠が 80x80 でない'],
    ['題の行の高さを固定',  'min-height:80px;', '題の行の高さの固定が無い'],
    ['ヨシ待ちの字は題の行へ', 'headWait',              '題の行の三つ目が無い'],
  ];
  for (const [name, needle, msg] of need) {
    if (html.indexOf(needle) >= 0) { ok(name); } else { ng(name + ' … ' + msg); }
  }
  /* 頭の36pxの枠に、ヨシ待ち専用の絵を置かない（2026-09-12・ヨシの猫-8）。
     ＊2026-09-07 から 09-12 まで、ここには影絵・ドット絵・顔が入れ替わりで置かれていた。
       ヨシ待ちの印は**黄色い札の中の全身だけ**が受け持つ決めにしたので、字面で見張る。
     ＊runCatTick の中だけを見る。札の側（paintStateLine）の猫まで数えないため。 */
  (function () {
    const i = html.indexOf('function runCatTick()');
    const body = (i >= 0) ? html.slice(i, i + 2000) : '';
    // 2026-09-13・頭の猫-1 で、ヨシ待ちの回だけ全身の原寸80px を出す形にした。
    //   置いては外してきた三枚（影絵・ドット絵・顔）が残っていないかだけを見る。
    const bad = ['genba-face', 'genba-cat-40', 'panel-icon-white'].filter(n => body.indexOf(n) >= 0);
    const need80 = body.indexOf('genba-cat-80.png') >= 0;
    if (!i) { ng('頭の猫 … runCatTick が見つからない'); }
    else if (bad.length) { ng('頭の猫 … 外したはずの ' + bad.join('・') + ' が残っている'); }
    else if (!need80) { ng('頭の猫 … ヨシ待ちの原寸80px（genba-cat-80.png）が無い'); }
    else { ok('頭の猫はヨシ待ちだけ80px'); }
  })();
  /* 様子を写す（v178・2026-11-19 本人の枠）：番地でなく字を写す。字はパネルが持つ値から同期で組む。
     ＊statusText を偽の値で回し、七つ（現況・最終確認・最後の合図と刻・遠隔の名と pid・赤い行・一番新しい札の刻と題・押した刻）が入るかを見る。
     ＊statusText の中で読みに行かない（fetch・then・await・XMLHttpRequest が無い）。写す手は押した直後に statusText() を呼ぶ。固定名の番地を写さない。 */
  (function () {
    const H = html.split(String.fromCharCode(13) + String.fromCharCode(10)).join(String.fromCharCode(10));   // 改行の混ざりを揃えてから切り出す
    const i = H.indexOf('  function statusText() {');
    const j = (i >= 0) ? H.indexOf('\n  }\n', i) : -1;
    const body = (i >= 0 && j > i) ? H.slice(i, j + 4) : '';
    if (!body) { ng('様子を写す … statusText が無い'); return; }
    if (/fetch\(|\.then\(|await |XMLHttpRequest/.test(body)) { ng('様子を写す … statusText の中で読みに行っている'); return; }
    const els = { pipeWarn: { className: 'pipe', textContent: '止まっとるかも：作り値の赤い行' } };
    let txt = '';
    try {
      const wi = H.indexOf('  function waitListLines('), wj = (wi >= 0) ? H.indexOf(String.fromCharCode(10) + '  }', wi) : -1; const wlsrc = (wi >= 0 && wj > wi) ? H.slice(wi, wj + 4) : '';   // v197：statusText が使う waitListLines も一緒に切り出す
      const cutF = (n) => cutFn(H, n);   // v202：表の仕事と裏方の組み立ても一緒に切り出す（v210：包みは一行・中身は panel-core.js）
      const oml = H.slice(H.indexOf('  function omoteNow('), H.indexOf(String.fromCharCode(10), H.indexOf('  function omoteNow(')));
      const fn0 = new Function('window', 'headText', 'lastSubj', 'lastState', 'lastEvName', 'lastEvAt', 'lastRcName', 'lastRcPid', '$', 'allRows', 'PANEL_VER', 'copySrcUrl', 'nowLine', 'lastStat', 'lastSNow', 'lastStepDone', 'lastStepTotal', 'lastStartedAt', 'lastMikomiRaw', 'lastUra', cutF('core') + '\n' + wlsrc + '\n' + cutF('omoteLines') + '\n' + cutF('uraLines') + '\n' + cutF('endLine') + '\n' + oml + '\n' + body + '\nreturn statusText();');
      const URA0 = { sub: { running: 1, items: [{ id: 'a1', type: 'general-purpose', desc: '作り値の下請け', start: '23:39' }], recent: [] }, cloud: { running: [], recent: [{ id: 9, name: '自動検査と配信', title: '自動検査と配信', at: '23:28', upd: '23:32', state: '落ちた', failStep: '速い版' }] } };
      const fn = function () { const a = [].slice.call(arguments); return fn0.apply(null, [WIN].concat(a).concat(['作業中', '作り値の段', 1, 4, 1795089000, '30分', URA0])); };
      const URL1 = 'https://kfsr148-art.github.io/koushu-state/notices-1795089000.json';
      txt = fn(() => '待機中', '作り値の件名', { at: 1795090000 }, 'idle_prompt', 1795089990, 'koushu-handan-93', 6308, id => els[id] || null,
        [{ time: 1795080000, title: '✅ 古い札' }, { time: 1795089000, title: '👀 作り値の新しい札' }], '179', URL1, () => '現況：待機中 ／ 本体v1508 ／ stable v1507 ／ 最終確認23:20');
      if (txt.split(String.fromCharCode(10))[0].indexOf('現況：') !== 0 || txt.indexOf('notices-') >= 0) { ng('様子を写す … 頭が現況の行でない／番地（notices-<刻>.json）が残っている（v202 で外した）'); return; }
      const txt0 = fn(() => '待機中', '', { at: 1795090000 }, '', 0, '', 0, () => null, [], '179', URL1, () => '現況：待機中');
      if (txt0.indexOf('一番新しい札：なし') < 0) { ng('様子を写す … 札が0件の時に写せない'); return; }
    } catch (e) { ng('様子を写す … statusText が回らない：' + e.message); return; }
    const want = [['表の仕事', '表の仕事：作り値の件名（作業中）'], ['段', '段：2/4　作り値の段'], ['始まり', '始まり：'], ['全部終わる見込み（表・裏方）', '表の仕事の全部終わる見込み：'], ['裏方の全部終わる見込み', '裏方の全部終わる見込み：'],['裏方の下請け', '下請け 動作中：23:39〜　作り値の下請け'], ['裏方の雲', '雲 落ちた：23:28〜23:32　自動検査と配信（落ちた段：速い版）'], ['現況の行', '現況：待機中 ／ 本体v'], ['状態', '状態：待機中／作り値の件名'], ['最終確認', '最終確認23:20'], ['最後の合図と刻', '最後の合図：idle_prompt（'], ['遠隔の名と pid', '遠隔：koushu-handan-93・pid 6308'], ['赤い行', '赤い行：止まっとるかも：作り値の赤い行'], ['一番新しい札の刻と題', '「👀 作り値の新しい札」'], ['押した刻', '押した刻：']];
    const miss = want.filter(w => txt.indexOf(w[1]) < 0).map(w => w[0]);
    const cp = H.slice(H.indexOf('  function copyUrl(btn) {'), H.indexOf('  function copyWait(btn)'));
    if (miss.length) { ng('様子を写す … 字に無い：' + miss.join('・')); }
    else if (cp.indexOf('var text = statusText();') < 0 || cp.indexOf('writeText(text)') < 0) { ng('様子を写す … 写す手が押した直後に statusText() を組んで写していない'); }
    else if (/raw\.githubusercontent|notices\.json/.test(cp) || H.indexOf('>URLを写す<') >= 0 || H.indexOf('>様子を写す<') < 0) { ng('様子を写す … 固定名の番地か前の釦の名が残っている'); }
    else { ok('様子を写すは現況の行（番地なし）＋表の仕事＋裏方＋六つを同期で字にして写す（札0件でも写せる）'); }
  })();
  /* 版の三箇所（作法4）。ここも字面で切り出す。 */
  function pick(src, head, tail) {
    const a = src.indexOf(head);
    if (a < 0) { return ''; }
    const b = src.indexOf(tail, a + head.length);
    if (b < 0) { return ''; }
    return src.slice(a + head.length, b);
  }
  const vScript = pick(html, "var PANEL_VER = '", "'");
  /* ＊「panel v」は注記にも出る（6箇所）ので、**verTag の器から**切り出す。 */
  const vTag    = pick(html, 'id="verTag">panel v', '（');
  let vFile = '';
  try { vFile = fs.readFileSync(path.join(path.dirname(SRC), 'panel-ver.txt'), 'utf8').trim(); } catch (e) { vFile = ''; }
  if (!vScript || !vTag || !vFile) { ng('版の三箇所のどれかが読めない（PANEL_VER「' + vScript + '」／verTag「' + vTag + '」／panel-ver.txt「' + vFile + '」）'); }
  else if (vScript !== vTag || vScript !== vFile) { ng('版が揃っていない（PANEL_VER ' + vScript + ' ／ verTag ' + vTag + ' ／ panel-ver.txt ' + vFile + '）'); }
  else { ok('版が三箇所とも v' + vScript); }
  /* v226（枠 百六十五）：今の仕事の週の使用量（weekJobStep は純粋）。見込み＝似た型の実測3件以上の中央値・無ければ「—」／今まで＝始まりからの差（1%未満の表記）／仕事が無ければ null／終わると実測の一行が返る。パネルは #weekJob を出す字面がある */
  {
    const PVw = require(path.join(path.dirname(SRC), 'panel-view.js'));
    const H = [{ mikomi: 30, delta: 3, minutes: 28 }, { mikomi: 25, delta: 2, minutes: 20 }, { mikomi: 40, delta: 5, minutes: 42 }, { mikomi: 300, delta: 30, minutes: 200 }];
    const dj = { stat: '作業中', startedAt: 1000, subj: 'x', mikomi: '30分' };
    const a1 = PVw.weekJobStep({}, dj, 50, 1060, H), a2 = PVw.weekJobStep(a1.store, dj, 52, 1600, H), a3 = PVw.weekJobStep(a2.store, { stat: '待機中' }, 52, 2000, H), a4 = PVw.weekJobStep({}, dj, 50, 1060, []);
    const good = a1.view && a1.view.est === '見込み 約3%' && a1.view.now === '今まで 1%未満' && a2.view.now === '今まで 2%' && a3.view === null && a3.finish && a3.finish.delta === 2 && a3.finish.mikomi === 30 && a4.view.est === '見込み —' && !/[$＄]|ドル/.test(JSON.stringify(a1.view));
    if (good) { ok('今の仕事の週の使用量：実測3件で「見込み 約3%」・実測なしは「見込み —」・始まりからの差は「1%未満」「2%」・仕事が終わると null と実測の一行・金額の字なし'); }
    else { ng('週の使用量の組み立てが違う：' + JSON.stringify([a1.view, a2.view, a3.view, a3.finish, a4.view])); }
    /* v227（枠 百七十六）：週%を小数で。額→週% の換算 k は convK（週%が上がった変わり目の点・最初と最後の差）。k が立てば『今まで 0.3%』『見込み 約0.2%』（小数一桁）・立たない間は整数のまま。終わると額の差も実測に残る */
    {
      const kk = PVw.convK([{ pct: 90, cost: 20 }, { pct: 91, cost: 27.6 }]), k0 = PVw.convK([{ pct: 90, cost: 20 }]);
      const Hc = [{ mikomi: 30, delta: 3, minutes: 28, cost: 1.2 }, { mikomi: 25, delta: 2, minutes: 20, cost: 0.9 }, { mikomi: 40, delta: 5, minutes: 42, cost: 1.8 }];
      const djc = { stat: '作業中', startedAt: 1000, subj: 'x', mikomi: '30分' };
      const c1 = PVw.weekJobStep({}, djc, 90, 1060, Hc, 20.0, kk), c2 = PVw.weekJobStep(c1.store, djc, 90, 1700, Hc, 22.3, kk), c3 = PVw.weekJobStep(c2.store, { stat: '待機中' }, 91, 2000, Hc, 23.0, kk), c4 = PVw.weekJobStep({}, djc, 90, 1060, Hc.map(h => Object.assign({}, h, { cost: null })), 20.0, null);
      const okc = k0 === null && Math.abs(kk - 1 / 7.6) < 0.001 && c1.view.now === '今まで 0.1%未満' && c2.view.now === '今まで 0.3%' && /^見込み 約0\.[0-9]%$/.test(c1.view.est) && c3.finish && Math.abs(c3.finish.cost - 3.0) < 0.001 && c4.view.now === '今まで 1%未満' && /^見込み 約3%$/.test(c4.view.est);
      if (okc) { ok('週の使用量を小数で：換算 k が立てば「今まで 0.3%」「見込み 約0.2%」・点が1つなら k なし・k が立たない間は整数のまま・終わると額の差が実測に残る'); }
      else { ng('週の使用量の小数が違う：' + JSON.stringify([kk, k0, c1.view, c2.view, c3.finish, c4.view])); }
    }
    if (html.indexOf('id="weekJob"') >= 0 && html.indexOf('id="wjEst"') >= 0 && html.indexOf('panelView.weekJob') >= 0 && html.indexOf('.weekjob[hidden]{display:none;}') >= 0 && html.indexOf('id="wjEnd"') >= 0 && html.indexOf("'終了予定 ' + (eAt || '0:00')") >= 0) { ok('パネル：「返事パネル」の字の下に #weekJob（見込み・今まで）を state.json の panelView.weekJob から出す字面がある'); }
    else { ng('パネルの週の使用量の字面が無い'); }
  }
  /* v225（枠 百六十二）：棚（panelView.shelf）。shelf.json から n・pct・items が組まれ、無ければ null。パネルは釦を「棚 N件・約M%」にし、直近に終わった三件は「くわしく」の rows に入る字面がある */
  {
    const os2 = require('os'), fs2 = require('fs'), pth2 = require('path');
    const dir2 = fs2.mkdtempSync(pth2.join(os2.tmpdir(), 'koushu-shelf-')), keep2 = process.env.SHADOW_HOME;
    try {
      process.env.SHADOW_HOME = dir2;
      const PV2 = require(pth2.join(path.dirname(SRC), 'panel-view.js'));
      const n0 = PV2.panelView({}, [], [], 1).shelf;
      fs2.writeFileSync(pth2.join(dir2, 'shelf.json'), JSON.stringify({ at: 'x', n: 2, pct: 18, items: [{ no: 4, title: '守りの種', pct: 3, type: 'ふだん' }, { no: 5, title: '通し読み', pct: 15, type: 'Fable' }] }));
      const n1 = PV2.panelView({}, [], [], 1).shelf;
      if (n0 === null && n1 && n1.n === 2 && n1.pct === 18 && n1.items.length === 2 && n1.items[1].title === '通し読み' && n1.items[1].pct === 15) { ok('棚の材料：shelf.json が無ければ null・有れば n=2・約18%・一枠ずつ題と見積もり%が載る'); }
      else { ng('棚の材料が違う：無し ' + JSON.stringify(n0) + '／有り ' + JSON.stringify(n1)); }
      // v236（枠 二百三十一）：棚（shelf.json）はいつも元のまま。雲の待ち（cloud-queue.json）は shelf.cloud として横に足す。雲だけ・棚だけ・古い雲・どちらも無い、を確かめる。
      const nowE = Math.floor(Date.now() / 1000);
      fs2.writeFileSync(pth2.join(dir2, 'cloud-queue.json'), JSON.stringify({ at: 'x', epoch: nowE, n: 2, pct: 9.5, items: [{ no: 1, title: '棚 #6 並べ直し', pct: 3, est: true, status: '走行中' }, { no: 2, title: '別の枠', pct: 6.5, est: false, status: '待ち' }] }));
      const c1 = PV2.panelView({}, [], [], 1).shelf;
      fs2.writeFileSync(pth2.join(dir2, 'cloud-queue.json'), JSON.stringify({ at: 'x', epoch: nowE, n: 0, pct: 0, items: [] }));
      const c0 = PV2.panelView({}, [], [], 1).shelf;
      fs2.writeFileSync(pth2.join(dir2, 'cloud-queue.json'), JSON.stringify({ at: 'x', epoch: nowE - 2000, n: 1, pct: 3, items: [{ no: 1, title: '古い', pct: 3, status: '待ち' }] }));
      const c2 = PV2.panelView({}, [], [], 1).shelf;
      fs2.unlinkSync(pth2.join(dir2, 'shelf.json'));
      fs2.writeFileSync(pth2.join(dir2, 'cloud-queue.json'), JSON.stringify({ at: 'x', epoch: nowE, n: 1, pct: 3, items: [{ no: 9, title: '雲だけ', pct: 3, status: '待ち' }] }));
      const c3 = PV2.panelView({}, [], [], 1).shelf;
      const htmlP = fs2.readFileSync(SRC, 'utf8');
      // v237（枠 二百三十五）：送った枠（窓＋雲を合わせて）の件数と使用予定%。窓＝作業中の一件＋順番待ち、雲＝待ち・走行中。窓の一件は fb（既定3）で数え、小数一桁。
      { const sv = PV2.sentView, st1 = sv({ stat: '作業中', foot: { wait: 3 } }, { n: 2, pct: 9.5, fb: 3 }), st2 = sv({ stat: '待機中', foot: { wait: 0 } }, null), st3 = sv({ stat: '作業中', foot: { wait: 1 } }, { n: 0, pct: 0, fb: 1.5 });
        const hp = fs2.readFileSync(SRC, 'utf8');
        if (st1.n === 6 && st1.nw === 4 && st1.nc === 2 && st1.pct === 21.5 && st2.n === 0 && st2.pct === 0 && st3.n === 2 && st3.pct === 3 && hp.indexOf("'枠 ' + (sn.n | 0) + '件・予定 '") >= 0 && st1.sess === 134.4 && sv({ stat: '作業中', foot: { wait: 3 } }, { n: 2, pct: 9.5, fb: 3 }, 20).sess === 107.5 && st2.sess === 0 && hp.indexOf("'セッション ' + (Math.round((Number(sn.sess) || 0) * 10) / 10).toFixed(1) + '%'") >= 0) {   /* 枠 二百四十二：セッション N% ＝ 予定% ÷ 1セッション≒棚 N% ×100（既定16・整数・約なし）が wjNow に出る */ ok('送った枠：窓（作業中＋順番待ち）と雲を合わせた件数と使用予定%（窓の一件は fb・小数一桁）・返事パネルの下は「送った枠 N件・使用予定 M%」で「見込み」「今まで」は出さない'); }
        else { ng('送った枠の数えが違う：' + JSON.stringify([st1, st2, st3])); } }
      /* v272（枠 三百五十二）：予定%は台帳と実測から出す（件数×1%の決め打ちをしない）。台帳の残り＋待ち×実測の中央値・元の短い字・実測も台帳も無い時だけ昔の数え */
      { const sv = PV2.sentView, e1 = { per: 0.8, nPer: 5, cur: { est: 1.5, used: 0.4 } }, t1 = sv({ stat: '作業中', foot: { wait: 5 } }, null, 16, e1), t2 = sv({ stat: '待機中', foot: { wait: 5 } }, null, 16, { per: 0.8, nPer: 5, cur: null }), t3 = sv({ stat: '作業中', foot: { wait: 3 } }, { n: 2, pct: 9.5, fb: 3 }, 16, null), hp2 = fs2.readFileSync(SRC, 'utf8');
        if (t1.pct === 5.1 && t1.src === '台帳 1件＋実測の中央値 5件' && t2.pct === 4 && t2.src === '実測の中央値 5件' && t3.pct === 21.5 && t3.src === '' && typeof PV2.sentEst === 'function' && hp2.indexOf("(sn.src ? '（' + sn.src + '）' : '')") < 0 && hp2.indexOf("$('wjEst').textContent = sn ? ('枠 ' + (sn.n | 0) + '件・予定 ' + (Math.round((Number(sn.pct) || 0) * 10) / 10).toFixed(1) + '%') : '';") >= 0) { ok('予定%は台帳と実測から出す：台帳の残り1.1＋待ち5件×0.8＝5.1%（元「台帳 1件＋実測の中央値 5件」）／台帳が無く待ちだけなら 4%／実測も台帳も無い時だけ昔の数え（21.5%）・パネルは元の字を赤い行には出さない（v273・値は sent.src に残る）'); }
        else { ng('予定%の元の出し方が違う：' + JSON.stringify([t1, t2, t3])); } }
      /* v268・v269（枠 三百五十九）：脈の赤い行と「鳴った！（試し）」釦（v268）・拾われなかったエラーの送り（v269）の検査。新しい表示・釦・送りを足す直しは、同じ commit でここに検査を足す。 */
      { const hp3 = fs2.readFileSync(SRC, 'utf8');
        let r1 = null;
        try {
          const lateSrc = cutFn(hp3, 'beatLateList'), f = vm.runInNewContext('(' + lateSrc.replace(/^\s*function beatLateList/, 'function') + ')', {}), NOW3 = 1000000;
          r1 = { a: f({ x: { label: 'X', at: NOW3 - 3600, every: 5, grace: 10 } }, NOW3).length, b: f({ x: { label: 'X', at: NOW3 - 60, every: 5, grace: 10 } }, NOW3).length, c: f({ x: { label: 'X', at: NOW3 - 99999, every: 0, grace: 0 } }, NOW3).length, d: f({ test: { monthly: {} } }, NOW3).length, e: f(null, NOW3).length };
        } catch (e3) { r1 = { err: String(e3) }; }
        if (r1 && r1.a === 1 && r1.b === 0 && r1.c === 0 && r1.d === 0 && r1.e === 0 && hp3.indexOf("'beat-ack ' + id") >= 0 && hp3.indexOf('id="beatAck"') >= 0 && /\.beat-ack \{[^}]*min-height: 44px/.test(hp3) && hp3.indexOf('setInterval(pullBeats, 120000)') >= 0 && hp3.indexOf('rl.missing > 0') >= 0 && hp3.indexOf("m && m.id && !m.pressedAt && now - m.sentAt < 3 * 86400") >= 0) { ok('脈（v268）：見込み＋猶予を過ぎた物だけ赤い（見込み 0 の物・test の欄・null は赤くしない）・「鳴った！（試し）」釦は押されていない月一の試しが3日以内の時だけ出て beat-ack <id> を送る・釦の外箱は44px・2分おきに読む・橋の札の差（relay.missing）の一言'); }
        else { ng('脈（v268）の表示の決めが違う：' + JSON.stringify(r1)); }
        const em = /<script id="khErr">([\s\S]*?)<\/script>/.exec(hp3);
        if (!em) { ng('エラーの送り（v269）の script（khErr）が panel.html に無い'); }
        else {
          const run3 = (proto) => {
            const ev = {}, beacons = [], store = {};
            const sb = { Date: Date, JSON: JSON, String: String, Object: Object, Math: Math, location: { protocol: proto },
              navigator: { sendBeacon: function (u, b) { beacons.push([String(u), String(b)]); return true; } },
              localStorage: { getItem: function (k) { return store[k] || null; }, setItem: function (k, v) { store[k] = v; } },
              document: { querySelector: function () { return null; }, documentElement: { getAttribute: function () { return null; } }, getElementById: function (id) { return id === 'verTag' ? { textContent: 'panel v271（11月26日）' } : null; }, body: { children: [{ id: 'main', offsetParent: {}, offsetHeight: 300 }] } },
              window: { addEventListener: function (t, f) { ev[t] = f; } } };
            sb.window.window = sb.window; vm.createContext(sb); vm.runInContext(em[1], sb);
            const e1 = { message: 'x is not defined at https://a.b/c?q=secret#h', filename: 'https://h/panel.html?_v=1', lineno: 12, colno: 3 };
            ev.error(e1); ev.error(e1); ev.unhandledrejection({ reason: { message: 'boom' } });
            return beacons;
          };
          const bs = run3('https:'), bf = run3('file:');
          if (bs.length === 2 && /^https:[/][/]ntfy[.]sh[/]/.test(bs[0][0]) && bs[0][1].indexOf('<url>') >= 0 && bs[0][1].indexOf('secret') < 0 && bs[0][1].indexOf('kind=panel') >= 0 && bs[0][1].indexOf('ver=271') >= 0 && bs[0][1].indexOf('at=panel.html:12:3') >= 0 && bs[1][1].indexOf('rejection') >= 0 && bf.length === 0 && em[1].indexOf('3600000') >= 0) { ok('エラーの送り（v269）：https の時だけ送る（file:// の検査機からは送らない）・同じエラーは1通だけ（1時間）・URL は <url> に替えて問い（?q=…）を送らない・版は verTag から・場所はファイル名と行だけ・別の話題へ sendBeacon'); }
          else { ng('エラーの送りの決めが違う：https ' + bs.length + ' 通・file ' + bf.length + ' 通・' + JSON.stringify(bs[0] || null).slice(0, 160)); }
        }
      }
      if (c1 && c1.n === 2 && c1.pct === 18 && c1.items[1].title === '通し読み' && c1.cloud && c1.cloud.n === 2 && c1.cloud.pct === 9.5 && c1.cloud.items[0].type === '走行中・見込み推定' && c1.cloud.items[1].type === '待ち' &&
        c0 && c0.n === 2 && c0.cloud && c0.cloud.n === 0 && c2 && c2.n === 2 && c2.cloud === null && c3 && c3.n === 0 && c3.cloud && c3.cloud.n === 1 &&
        htmlP.indexOf("'棚 ' + n + '件・約'") >= 0 && htmlP.indexOf('function cloudLabel()') >= 0 && htmlP.indexOf('function cloudBox()') >= 0 && htmlP.indexOf("'雲 ' + ") >= 0) { ok('棚と雲：棚（shelf.json）は雲があっても2件のまま・雲は shelf.cloud に別の欄で載る（0件でも棚は消えない）・900秒より古い雲は null・棚が無く雲だけでも空の棚に雲が載る・釦の字は「棚 N件・約M%」の横に「雲 N件・M%」'); }
      else { ng('棚と雲の材料が違う：' + JSON.stringify(c1) + '／0件 ' + JSON.stringify(c0) + '／古い ' + JSON.stringify(c2) + '／雲だけ ' + JSON.stringify(c3)); }
    } finally { if (keep2 === undefined) { delete process.env.SHADOW_HOME; } else { process.env.SHADOW_HOME = keep2; } try { fs2.rmSync(dir2, { recursive: true, force: true }); } catch (e) { } }
    if (html.indexOf("function shelfLabel()") >= 0 && html.indexOf('id="shelfBox"') >= 0 && html.indexOf('✅ 直近に終わった：') >= 0 && html.indexOf('>直近に終わった仕事（0件）<') < 0) { ok('パネル：釦は棚・一覧 #shelfBox・直近に終わった三件は「くわしく」の rows（✅ 直近に終わった：）に入る字面がある'); }
    else { ng('パネルの棚の字面が無い／古い直近の釦が残っている'); }
  }
  /* v227（枠 百九十三・棚 #11）：棚の一覧の頭に素振りの最後の結果の一行（sweepLine）。入る・入らない・時間の外・戻り間近・材料なしの五つと、パネルが #shelfBox の頭に出す字面がある */
  {
    const PV3 = require(path.join(path.dirname(SRC), 'panel-view.js')), at3 = new Date(2026, 10, 23, 12, 0, 0).toISOString();
    const it3 = [{ no: 4, pct: 3 }, { no: 9, pct: 8 }];
    const a3 = PV3.sweepLine({ at: at3, would: { no: 4, pct: 3 }, hLeft: 6, week: 90, room: 5 }, it3), b3 = PV3.sweepLine({ at: at3, would: null, reason: '収まる課題が無い（残り 3%）', hLeft: 6, week: 92, room: 3 }, it3);
    const c3 = PV3.sweepLine({ at: at3, would: null, reason: '戻りまで 10.0 時間（8時間前から動く）', hLeft: 10, week: 80 }, it3), d3 = PV3.sweepLine({ at: at3, would: null, reason: '戻りまで1時間を切った（新しく起こさない）', hLeft: 0.5, week: 99 }, it3);
    if (/素振り 12:00 時点：起こすなら #4（見積もり 3%）/.test(a3) && /今は入らん（残り 3%・一番軽い #4 は 4.5%）/.test(b3) && /動く時間の外（次は 14:00 から）/.test(c3) && /戻りまで1時間を切った/.test(d3) && PV3.sweepLine(null, it3) === '' && html.indexOf('lastShelf.sweep') >= 0) { ok('棚の素振りの一行：入る／入らん（残りと一番軽い枠×1.5）／動く時間の外（次の刻）／戻り間近／材料なしは空・パネルが一覧の頭に出す字面がある'); }
    else { ng('棚の素振りの一行が違う：' + [a3, b3, c3, d3].join(' | ')); }
  }
  /* v230（枠 二百七）：1セッション≒棚 N%。3件未満は16（仮）・3件でちょうどの数（仮なし）・釦の字に入る・古い「あと…件仕掛けられる」は無い */
  {
    const PV4 = require(path.join(path.dirname(SRC), 'panel-view.js'));
    const r4 = [{ s: 3, w: 0.5 }, { s: 3, w: 0.5 }, { s: 4, w: 1 }], e0 = PV4.shelfCapacity([]), e2 = PV4.shelfCapacity(r4.slice(0, 2)), e3 = PV4.shelfCapacity(r4), e3z = PV4.shelfCapacity([{ s: 0, w: 1 }, { s: 0, w: 1 }, { s: 3, w: 0.5 }]);
    if (e0 === '1セッション≒棚 16.0%' && e2 === e0 && e3 === '1セッション≒棚 16.7%' && e3z === e0 && html.slice(html.indexOf('function shelfLabel()'), html.indexOf('function paintShelf()')).indexOf('lastShelf.capacity') < 0 && html.indexOf('id="wjCap"') >= 0 && html.indexOf('wjCapT') >= 0 && html.indexOf('.weekjob .wj-cap') >= 0 && e3.indexOf('1セッション≒棚') === 0 && html.indexOf('件仕掛けられる') < 0 && html.indexOf('（仮）') < 0 && PV4.shelfCapacity.toString().indexOf('あと') < 0) { ok('1セッション≒棚 N%：3件未満も16（言葉は付けない）・3件で中央値・s<=0は数えない・棚の釦の字には足さず返事パネルの今までの行の下（#wjCap）に出す・「あと…件仕掛けられる」「（仮）」は無い'); }
    else { ng('1セッション≒棚の一行が違う：' + [e0, e2, e3, e3z].join(' | ')); }
  }
  /* v228（枠 百九十七・棚 #10）：ヨシの釦。panelView.yoshiOpen は yoshi-open.tsv の印だけ（古い順・話題名は載らない）。パネルは #doneHead をヨシの釦にし、青・N件・送った・通ったの字と、話題名は電話（localStorage）に覚える字面がある。終わりましたの一覧の口は #doneToggle へ移した */
  {
    const os4 = require('os'), fs4 = require('fs'), pth4 = require('path');
    const dir4 = fs4.mkdtempSync(pth4.join(os4.tmpdir(), 'koushu-yo-')), keep4 = process.env.SHADOW_HOME;
    try {
      process.env.SHADOW_HOME = dir4;
      const PV4 = require(pth4.join(path.dirname(SRC), 'panel-view.js'));
      const e0 = PV4.panelView({}, [], [], 1).yoshiOpen;
      fs4.writeFileSync(pth4.join(dir4, 'yoshi-open.tsv'), ['y1123-1111', '2026-11-23 19:00:00', '件A'].join(String.fromCharCode(9)) + String.fromCharCode(10) + ['y1123-2222', '2026-11-23 19:10:00', '件B'].join(String.fromCharCode(9)) + String.fromCharCode(10));
      const e1 = PV4.panelView({}, [], [], 1).yoshiOpen;
      if (Array.isArray(e0) && e0.length === 0 && e1.join(',') === 'y1123-1111,y1123-2222' && JSON.stringify(e1).indexOf('件') < 0) { ok('ヨシの釦の材料：一覧が無ければ空・有れば印だけ（古い順）'); }
      else { ng('ヨシの釦の材料が違う：' + JSON.stringify(e0) + ' / ' + JSON.stringify(e1)); }
    } finally { if (keep4 === undefined) { delete process.env.SHADOW_HOME; } else { process.env.SHADOW_HOME = keep4; } try { fs4.rmSync(dir4, { recursive: true, force: true }); } catch (e) { } }
    if (html.indexOf('id="doneHead">👈 ヨシ待ち</button>') >= 0 && html.indexOf('id="doneFold"') >= 0 && html.indexOf('id="doneToggle"') < 0 && html.indexOf('function paintDoneFold()') >= 0 && html.indexOf('function paintYoshiBtn()') >= 0 && html.indexOf("'kh-yoshi-topic'") >= 0 && html.indexOf("'yoshi ' + mark") >= 0 && html.indexOf('👈 ヨシを送った') >= 0 && html.indexOf('👈 ヨシが通った') >= 0 && html.indexOf('#doneHead.yb-on') >= 0 && html.indexOf('ntfy.sh/') >= 0 && !/kh-yoshi-topic'[ ]*,[ ]*'[A-Za-z0-9]/.test(html)) { ok('パネル：ヨシの釦（#doneHead・👈 ヨシ待ち／青N件／送った／通った）・話題名は電話に覚える（公開の字に名前を書かない）・終わりましたの一覧は くわしくの中の畳み #doneFold（#doneToggle は無い）'); }
    else { ng('パネルのヨシの釦の字面が無い／話題名が書かれている'); }
  }
  /* v229（棚 #10 段③）：指さす。panelView.yubisashi は yubisashi.json の name・at（無ければ null）。パネルは指さした部品の名を『point 名』で話題へ送る */
  {
    const os5 = require('os'), fs5 = require('fs'), pth5 = require('path');
    const dir5 = fs5.mkdtempSync(pth5.join(os5.tmpdir(), 'koushu-yu-')), keep5 = process.env.SHADOW_HOME;
    try {
      process.env.SHADOW_HOME = dir5;
      const PV5 = require(pth5.join(path.dirname(SRC), 'panel-view.js'));
      const y0 = PV5.panelView({}, [], [], 1).yubisashi;
      fs5.writeFileSync(pth5.join(dir5, 'yubisashi.json'), JSON.stringify({ name: '状態の帯', at: '2026-11-23 20:00:00' }));
      const y1 = PV5.panelView({}, [], [], 1).yubisashi;
      if (y0 === null && y1 && y1.name === '状態の帯' && y1.at === '2026-11-23 20:00:00') { ok('指さすの材料：yubisashi.json が無ければ null・有れば name と at'); }
      else { ng('指さすの材料が違う：' + JSON.stringify(y0) + ' / ' + JSON.stringify(y1)); }
    } finally { if (keep5 === undefined) { delete process.env.SHADOW_HOME; } else { process.env.SHADOW_HOME = keep5; } try { fs5.rmSync(dir5, { recursive: true, force: true }); } catch (e) { } }
    if (html.indexOf("body: 'point ' + pointClean(pointName(el), 40)") >= 0 && html.indexOf("'point ' + ptopic") < 0) { ok('パネル：指さした部品の名を『point 名』で話題へ送る字面がある（話題名は書かない）'); }
    else { ng('パネルの指さしの送りの字面が無い'); }
  }
  /* v231（枠 二百八・棚 #10）：ヨシの釦の鍵は話題名を打たずに渡す。パネルは入れ物（prompt）を出さず、開いた時の『#k=<鍵>』を localStorage に覚えて # を消し、鍵が無い時は釦の下に案内の一行を出す。鍵そのものはパネルに書かない */
  {
    const okPrompt = html.split('window.prompt(').length === 2 && html.indexOf('ヨシを送る先の名前を、一度だけ入れてください') >= 0, okHash = html.indexOf('/^#k=([A-Za-z0-9_-]{8,80})$/') >= 0 && html.indexOf('history.replaceState(null') >= 0 && html.indexOf('localStorage.setItem(YB_KEY, hk[1])') >= 0, okHint = html.indexOf('id="ybHint"') < 0 && html.indexOf('知らせを一度押すと使えます') < 0, noKey = !/kh-yb-[0-9a-f]{8}/.test(html);
    if (okPrompt && okHash && okHint && noKey) { ok('ヨシの釦の鍵：開いた時の #k= を覚えて # を消す・鍵が無い時はヨシの釦を押した所で入れ口（prompt・一か所だけ）を出して覚える・「知らせを一度押す」の案内は無い・パネルに鍵は書かれていない（枠 二百四十一）'); }
    else { ng('ヨシの釦の鍵の渡し方の字面が違う（入れ口一か所 ' + okPrompt + '・#k= ' + okHash + '・案内 ' + okHint + '・鍵なし ' + noKey + '）'); }
  }
  /* v243（枠 二百四十五）：ヨシの釦を押すと中身と四つの釦（ヨシを送る・直して・後で・やめる）。ヨシ＝『yoshi <印>』・直して＝『yoshi-fix <印> <一言>』・後で＝送らず次の待ちへ・やめる＝閉じるだけ。宛先の名前は公開に書かない */
  {
    const bi = html.indexOf('function ybPopOpen('), bj = html.indexOf('function paintYoshiBtn') > bi ? html.length : html.indexOf('/* ---- 過去の札', bi), pop = bi >= 0 ? html.slice(bi, bj > bi ? bj : bi + 6000) : '';
    const okBtns = ['data-yb="go"', 'data-yb="fix"', 'data-yb="later"', 'data-yb="close"'].every(x => pop.indexOf(x) >= 0);
    const okGo = pop.indexOf("ybPost('yoshi ' + mark, mark)") >= 0, okFix = pop.indexOf("ybPost('yoshi-fix ' + mark + ' '") >= 0;
    const okLater = /act === 'later'\) \{ ybPopOpen\(idx \+ 1\); \}/.test(pop), okClose = /act === 'close'\) \{ ybPost\('yoshi-stop ' \+ mark, mark, 'stop'\); ybPopClose\(\); \}/.test(pop);
    const okNoSend = pop.indexOf("act === 'later'") >= 0 && !/act === 'later'[^}]*ybPost/.test(pop) && true;   /* v257：やめるは『yoshi-stop』を送る（後では何も送らない） */
    const okOnclick = html.indexOf('ybPopOpen(0);') >= 0 && html.indexOf("body: 'yoshi ' + mark }") < 0;
    if (okBtns && okGo && okFix && okLater && okClose && okNoSend && okOnclick) { ok('ヨシの釦の中身：押すと待ちの題と本文＋四つの釦・ヨシ＝yoshi <印>／直して＝yoshi-fix <印> <一言>／後では何も送らない・やめる＝yoshi-stop <印>（枠 二百八十九）'); }
    else { ng('ヨシの釦の中身の字面が違う（四釦 ' + okBtns + '・ヨシ ' + okGo + '・直して ' + okFix + '・後で ' + okLater + '・やめる ' + okClose + '・送らない ' + okNoSend + '・釦 ' + okOnclick + '）'); }
  }
  /* v274（枠 三百六十）：札の『推し：』の釦は白の太枠（ヨシを送るの青より後ろの指定）・行頭の『直しの案：』は直しての入れ欄に最初から入る・どちらも無ければ枠なし・空欄。ybOshi を取り出して動かす */
  {
    const a = html.indexOf('function ybOshi('), b = html.indexOf('function ybPopClose(', a);
    let f = null; try { f = new Function(html.slice(a, b) + '\nreturn ybOshi;')(); } catch (e) { f = null; }
    let okRun = false, okWire = false, okCss = false;
    if (f) {
      const x = f('本文\n推し：直して\n直しの案：枠を白にして'), y = f('本文\n推し：ヨシを送る'), z = f('本文だけ。札に直しの案：の行があれば入る'), w = f('本文\n直しの案：三行にして'), v = f('本文\n推し：直して｜前の形');
      okRun = x.pick === 'fix' && x.text === '枠を白にして' && x.rest === '本文' && y.pick === 'go' && y.text === '' && y.rest === '本文'
        && z.pick === '' && z.text === '' && z.rest === '本文だけ。札に直しの案：の行があれば入る' && w.pick === '' && w.text === '三行にして' && w.rest === '本文' && v.pick === 'fix' && v.text === '前の形';
    }
    okWire = html.indexOf("esc(os.text) + '</textarea>") >= 0 && ['go', 'fix', 'later', 'close'].every(k => html.indexOf("rc('" + k + "')") >= 0);
    const go = html.indexOf('#ybPop .yb-row button.yb-go{'), rec = html.indexOf('#ybPop .yb-row button.yb-rec{');
    okCss = go >= 0 && rec > go && html.slice(rec, rec + 120).indexOf('border:4px solid #fff;') >= 0;
    if (okRun && okWire && okCss) { ok('ヨシの釦の推しと直しの案：推しの釦だけ白の太枠（ヨシを送るでも白）・直しの案は入れ欄に最初から・無ければ枠なしで空欄（枠 三百六十）'); }
    else { ng('推しと直しの案が違う（読み ' + okRun + '・結び ' + okWire + '・白枠 ' + okCss + '）'); }
  }
  /* v224（枠 百五十六）：影の仕事の箱（panelView.shadowBox）。走っている間だけ載る・済んだら null・金額の字が無い・パネルが箱を出す字面がある */
  {
    const os = require('os'), fsx = require('fs'), pth = require('path');
    const dir = fsx.mkdtempSync(pth.join(os.tmpdir(), 'koushu-shbox-')), keep = process.env.SHADOW_HOME;
    try {
      process.env.SHADOW_HOME = dir;
      const nowS = Math.floor(Date.now() / 1000), PV = require(pth.join(path.dirname(SRC), 'panel-view.js'));
      fsx.writeFileSync(pth.join(dir, 'shadow-last.json'), JSON.stringify({ state: '走行中', issue: 3, title: '影の枠 3', startSec: nowS - 5, endSec: nowS + 40, cost: 0.06 }));
      fsx.writeFileSync(pth.join(dir, 'shadow-day.json'), JSON.stringify({ total: 4, done: 3 }));
      const b1 = PV.panelView({}, [], [], nowS).shadowBox;
      fsx.writeFileSync(pth.join(dir, 'shadow-last.json'), JSON.stringify({ state: '済', issue: 3 }));
      const b2 = PV.panelView({}, [], [], nowS).shadowBox;
      fsx.writeFileSync(pth.join(dir, 'shadow-last.json'), JSON.stringify({ state: '走行中', issue: 3, title: 'x', startSec: nowS - 3600, endSec: nowS - 3500 }));
      const b3 = PV.panelView({}, [], [], nowS).shadowBox;
      const good = b1 && b1.k === '影の仕事' && b1.done === 3 && b1.total === 4 && b1.run === 1 && b1.lab === '3/4' && b1.now === '影の枠 3' && !/[$＄]|cost|ドル/.test(JSON.stringify(b1));
      if (good && b2 === null && b3 === null) { ok('影の仕事の箱：走っている間だけ載る（3/4・金額なし）・済んだら null・10分より古い走行中も null'); }
      else { ng('影の仕事の箱が違う：走行中 ' + JSON.stringify(b1) + '／済 ' + JSON.stringify(b2) + '／古い ' + JSON.stringify(b3)); }
    } finally { if (keep === undefined) { delete process.env.SHADOW_HOME; } else { process.env.SHADOW_HOME = keep; } try { fsx.rmSync(dir, { recursive: true, force: true }); } catch (e) { } }
    if (html.indexOf("secH('shadowSec'") >= 0 && html.indexOf('lastShadowBox') >= 0 && html.indexOf('id="shadowLine"') < 0) { ok('パネルは三つ目の箱 shadowSec を出す字面がある（影の一行 #shadowLine は無い）'); }
    else { ng('パネルの影の仕事の箱の字面が無い／古い #shadowLine が残っている'); }
  }
  /* v210：panel-core.js の指定（?_v=）と中の VER も同じ数（違うと古い取り置きを掴むか、部品と本の版がずれる） */
  { const vSrc = pick(html, '<script src="panel-core.js?_v=', '"'); if (vSrc && vSrc === vScript && PCORE.VER === vScript) { ok('panel-core.js の指定（?_v=' + vSrc + '）と中の VER（' + PCORE.VER + '）も同じ版'); } else { ng('panel-core.js の版がずれた（?_v=' + vSrc + '・VER ' + PCORE.VER + '・PANEL_VER ' + vScript + '）'); } }
}

}
part17();   // ⑰（ブラウザを使わない部分・--static でも回る）

head('まとめ（返事パネルの検査）');
note('真似た台では拾えないもの … 公開側の遅れや詰まり／iOS Safari 固有の描き方（折り返し・字送り・慣性）／');
note('　実機の触り心地と、写しがクリップボードへ本当に入るか／ntfy の押し通知そのもの');
if (skipped) { note('測れなかった項目 ' + skipped + '件（落ちとは別）'); }
console.log('');
if (bad === 0) { console.log('全てPASS'); process.exit(0); }
console.log('FAIL ' + bad + '件');
process.exit(1);
