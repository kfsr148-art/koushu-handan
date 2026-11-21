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
    (function () { var ids = ['btnShots', 'btnCopyUrl', 'usageTag', 'fVer', 'verTag', 'footGroup']; var els = ids.map(function (i) { return document.getElementById(i); }); if (els.some(function (e) { return !e; })) { o.ordMissing = ids.filter(function (i, k) { return !els[k]; }).join('・'); return; }
      var sorted = els.slice().sort(function (a, b) { return (a.compareDocumentPosition(b) & 4) ? -1 : 1; }); o.ordDoc = sorted.map(function (e) { return e.id; }).join('>');
      o.ordCss = els.map(function (e) { return getComputedStyle(e).order !== '0' ? e.id + ':' + getComputedStyle(e).order : ''; }).filter(Boolean).join(','); o.ordTops = els.map(function (e) { return Math.round(e.getBoundingClientRect().top); });
      o.ordOverflow = document.documentElement.scrollWidth > window.innerWidth + 1; })();
    /* v185：手順のゲージ（使用量の三本と同じ見た目か）。区切りの数・済み・今・小さい N/M・高さ・幅・横溢れ */
    (function () { var g = document.querySelector('#progBox .stg'); if (!g) { return; } var is = [].slice.call(g.querySelectorAll('.stg-bar i')); o.gSegs = is.length; o.gDone = is.filter(function (e) { return e.className === 'd'; }).length; o.gCur = is.map(function (e) { return e.className; }).indexOf('c'); o.gLabel = txt(g.querySelector('.stg-n')); var b = g.querySelector('.stg-bar').getBoundingClientRect(); o.gBarW = b.width; o.gBarH = b.height; o.gBg = is.map(function (e) { return getComputedStyle(e).backgroundColor; }); o.gRad = getComputedStyle(is[0]).borderTopLeftRadius; var ub = document.querySelector('.usage .u-bar'); o.uBarH = ub ? ub.getBoundingClientRect().height : -1; o.uRad = ub ? getComputedStyle(ub).borderTopLeftRadius : ''; o.gOver = g.scrollWidth > g.clientWidth + 1 || document.documentElement.scrollWidth > window.innerWidth + 1; })();
    /* v186：見込みとゲージの箱（#progBox）。見出しの直後・一つの箱・行の数・出る／出ない・iPhone の幅 */
    (function () { var b = document.getElementById('progBox'); o.pbExists = !!b; if (!b) { return; } var cs = getComputedStyle(b), r = b.getBoundingClientRect(); o.pbShown = cs.display !== 'none' && r.height > 0; o.pbPrev = (b.previousElementSibling && b.previousElementSibling.tagName) || ''; o.pbRows = b.querySelectorAll('.pb').length; o.pbEta = !!b.querySelector('.m.eta'); o.pbGauge = !!b.querySelector('.stg'); o.pbBorder = parseFloat(cs.borderTopWidth) || 0; o.pbW = r.width; o.pbLeft = r.left; o.pbRight = r.right; o.pbTop = r.top; var hd = document.querySelector('header'); o.pbHeadBottom = hd ? hd.getBoundingClientRect().bottom : -1; o.pbOver = document.documentElement.scrollWidth > window.innerWidth + 1 || b.scrollWidth > b.clientWidth + 1; })();
    /* v187：遠隔と終わりました N件 の二つ並び・写し取り一覧／直近に終わった仕事／様子を写す の三つ並び */
    (function () { function R(id) { var e = document.getElementById(id); if (!e) { return null; } var r = e.getBoundingClientRect(); var vis = getComputedStyle(e).display !== 'none' && r.width > 0 && r.height > 0; return vis ? { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height } : null; }
      o.rcR = R('rcLink'); o.doneR = R('doneHead'); o.shR = R('btnShots'); o.recR = R('btnRecent'); o.urlR = R('btnCopyUrl');
      var hr = document.getElementById('halfRow'); o.halfInHeader = !!(document.querySelector('header') && document.querySelector('header').querySelector('#rcLink')); o.halfExists = !!hr;
      o.btnOver = document.documentElement.scrollWidth > window.innerWidth + 1;
      o.halfDump = ['rcLink', 'doneBox', 'doneHead'].map(function (id) { var e = document.getElementById(id); if (!e) { return id + ':無し'; } var s = getComputedStyle(e); return id + '{w' + Math.round(e.getBoundingClientRect().width) + ',pad' + s.paddingLeft + '/' + s.paddingRight + ',bs:' + s.boxSizing + ',flex:' + s.flex + ',mar' + s.marginLeft + '/' + s.marginRight + '}'; }).join(' '); })();
    /* 視野の幅が言った幅より広がった時のために、右端が一番外にある要素を三つ控える（どこが溢れているかを辿る） */
    (function () { var all = [].slice.call(document.body.querySelectorAll('*')).filter(function (e) { var r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; }); all.sort(function (a, b) { return b.getBoundingClientRect().right - a.getBoundingClientRect().right; }); o.rightmost = all.slice(0, 3).map(function (e) { return e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ').join('.') : '') + '@' + Math.round(e.getBoundingClientRect().right) + '/w' + Math.round(e.getBoundingClientRect().width); }); })();
    /* v188：札まとめ中の頭の字（#headWait）の class・色・札の取得の数 */
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
    o.headWait = hw ? String(hw.textContent || '').trim() : null;
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
        setTimeout(function () { o.recAfter = txt(rbt); o.recClip = String(CAP.clip || ''); out2(o); }, 700);
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
      const mk = (started, mikomiMin, raw) => new Function('lastStat', 'lastStartedAt', 'lastMikomiMin', 'lastMikomiRaw', 'pad2s', 'waitEtaRow', fsrc + String.fromCharCode(10) + 'return etaLineText;')('作業中', started, mikomiMin, raw, (e) => '00:00', () => null);
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
      const mk = (readAt) => new Function(e1 + String.fromCharCode(10) + 'var lastSenkoReadAt = senkoEpoch(' + JSON.stringify(readAt) + ');' + String.fromCharCode(10) + e2 + String.fromCharCode(10) + 'return { cov: senkoReadCovers, ep: lastSenkoReadAt };')();
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
    if (html.indexOf('!ntfyCopied[ntfyKeyOf(e)] && !senkoReadCovers(e && e.time)') >= 0) { ok('知らせ（押し通知）の未写しも senko の刻までは落とす'); } else { ng('知らせの側が senko の刻を見ていない'); }
    if (html.indexOf('lastSenkoReadAt = senkoEpoch(d.senkoReadAt);') >= 0) { ok('state.json の senkoReadAt を読む'); } else { ng('state.json の senkoReadAt を読んでいない'); }
  }
  /* ---- ⑤の十六 panelView（panel-view.js）は panel.html の頭の字と残りの数え方とずれない（橋の枠 十三） ---- */
  head('⑤の十六 panelView の頭の字・残りは panel.html の headText と同じ（作り値・総当たり）');
  {
    const fn = (name) => { const i = html.indexOf('  function ' + name + '('); if (i < 0) { return ''; } const j = html.indexOf(String.fromCharCode(10) + '  }', i); return html.slice(i, j + 4); };
    const names = ['pad2s', 'newestTime', 'cardsPending', 'cardEtaSec', 'cardLate', 'cardPendText', 'kumoEtaSec', 'isRunning', 'uraBusyText', 'headText'];
    const src = names.map(fn);
    if (src.some(s => !s)) { ng('panel.html の関数が拾えない：' + names.filter((n, i) => !src[i]).join('・')); }
    else {
      const PV = require(path.join(path.dirname(SRC), 'panel-view.js'));
      const NOW = 1795200000;
      const pre = "var WAIT_TEXT='待機中、、、。',POINT_TEXT='まとめて写すヨシ！',WORK_TEXT='作業中、、、。',LOST_TEXT='接続不良、、、。',YOSHI_TEXT='ヨシ待ち、、、。';";
      const mk = (d, left, rows) => new Function('Date0', 'lastStat', 'lastDetail', 'lastCloud', 'lastHelp', 'lastKumo', 'lastEvAt', 'lastCardOwedAt', 'lastCardOwedEta', 'allRows', 'copyLeft', 'lastLost', 'lastUra',
        'var Date=Date0;' + pre + src.join(String.fromCharCode(10)) + String.fromCharCode(10) + 'return headText();')(
        class extends global.Date { constructor(...a) { if (a.length) { super(...a); } else { super(NOW * 1000); } } static now() { return NOW * 1000; } },
        String(d.stat || ''), String(d.detail || ''), String(d.cloud || ''), String(d.help || ''), String(d.kumo || ''), d.evAt || 0, d.cardOwedAt || 0, d.cardOwedEta || 0, rows, left, false, d.ura || null);
      let n = 0, bad0 = 0;
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
      /* v206（枠 五十八）：待ちでも下請けか雲が動いていれば「裏方作業中、、、。（下請け N本・雲 N本）」＋次「…」・どちらも動いていない時だけ「待ち：…」 */
      const hw = (ura, det) => PV.panelView({ stat: '待ち', detail: det, ura: ura }, [], [], NOW).head;
      const w1 = hw(URAS[1], '残りの段 2・次「作り値の段」'), w2 = hw(URAS[2], '残りの段 1・次「x」'), w3 = hw(URAS[2], '窓が閉じている'), w4 = hw(null, '残りの段 2・次「作り値の段」'), w5 = hw({ sub: { running: 0, items: [], recent: [{ id: 'z' }] }, cloud: { running: [], recent: [{ id: 2 }] } }, '残りの段 2');
      if (w1 === '裏方作業中、、、。（下請け 2本・雲 0本）・次「作り値の段」' && w2 === '裏方作業中、、、。（下請け 0本・雲 1本）・次「x」' && w3 === '裏方作業中、、、。（下請け 0本・雲 1本）' && w4 === '待ち：残りの段 2・次「作り値の段」' && w5 === '待ち：残りの段 2') { ok('待ちの頭の字：動いていれば「' + w1 + '」・動いていなければ「' + w4 + '」（済んだ物だけでは待ちのまま）'); } else { ng('待ちの頭の字が違う：' + [w1, w2, w3, w4, w5].join('｜')); }
      const pvc = PV.panelView({ senkoReadAt: '2026-11-20 21:12:17' }, [{ time: Date.parse('2026-11-20T21:00:00+09:00') / 1000, title: 'a', message: 'b' }, { time: Date.parse('2026-11-20T22:00:00+09:00') / 1000, title: 'c', message: 'd' }, { time: Date.parse('2026-11-20T22:01:00+09:00') / 1000, title: 'e', message: '写せます（2件）' }], [], NOW);
      if (pvc.left === 1 && pvc.label === 'まとめて写す（残1／1件）') { ok('残り：刻までの札は数えず、刻より新しい札だけ・「写せます（N件）」は数えない'); } else { ng('残りの数え方が違う：' + JSON.stringify(pvc)); }
      if (/senkoReadAt/.test(pvc.basis)) { ok('中身に「センコの読みだけで数えた」の一言が入る'); } else { ng('basis が無い'); }
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
    ['omoteLines', 'uraLines', 'endLine', 'endShort', 'uraCount', 'boxSpec'].forEach(n => { const a = cut(H, n, '  '), b = cut(PVS, n, ''); if (!a || !b) { ng(n + ' が拾えない（panel.html ' + !!a + '／panel-view.js ' + !!b + '）'); } else if (norm(a) !== norm(b)) { ng(n + ' の字面が panel.html と panel-view.js で違う'); } else { ok(n + ' は panel.html と panel-view.js で字面が同じ'); } });
    const fo = new Function(cut(H, 'omoteLines', '  ') + String.fromCharCode(10) + 'return omoteLines;')(), fu = new Function(cut(H, 'uraLines', '  ') + String.fromCharCode(10) + 'return uraLines;')();
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
    if (/分前|Date\.now/.test(cut(H, 'uraLines', '  ') + cut(H, 'omoteLines', '  ') + cut(H, 'endLine', '  '))) { ng('表の仕事・裏方に「何分前」や今の刻が入っている（state.json の指紋が変わる）'); } else { ok('表の仕事・裏方は今の刻を使わない（何分前を出さない）'); }
    const pv = PV.panelView(Object.assign({ ura: U1 }, O1), [], [], 1795280000);
    const ln = (x) => (x && Array.isArray(x.lines)) ? x.lines.slice(1).join('|') : '';
    if (ln(pv.omote) === wantO && ln(pv.ura) === wantU && /^表の仕事の全部終わる見込み：state\.json に載っていない$/.test(pv.omote.lines[0]) && /^裏方の全部終わる見込み：/.test(pv.ura.lines[0])) { ok('panelView の omote・ura は {lines…}：頭に全部終わる見込みの一行・続きは panel.html と同じ字'); } else { ng('panelView の omote・ura が違う：' + JSON.stringify({ omote: pv.omote, ura: pv.ura })); }
    /* v204（本人の枠 五十一）：字の箱（#workBox）は外し、表の仕事と裏方は見出しの下の箱（#progBox）にゲージで出す */
    const iP = H.indexOf('id="progBox"'), iB = H.indexOf('id="btnSteps"'), iS = H.indexOf('<ul id="stLine" hidden>');
    if (iP > 0 && iB > iP && iS > iB && H.indexOf('id="workBox"') < 0 && H.indexOf('paintWorkBox()') < 0) { ok('並び：表の仕事と裏方のゲージの箱 → 三行を開く釦 → 三行（ふだんは hidden）・字の箱（#workBox）は無い'); } else { ng('ゲージの箱・釦・三行の並びか hidden が違う／字の箱が残っている（' + [iP, iB, iS, H.indexOf('id="workBox"')].join('・') + '）'); }
    /* v204：ゲージ（gaugeHtml を切り出して回す）。表＝段の済み緑・今の段一つ青・横に今の番号/全体／裏方＝済み緑・動いている本数ぶん青・横に済み/全体 */
    {
      const fg = new Function('esc', cut(H, 'gaugeHtml', '  ') + String.fromCharCode(10) + 'return gaugeHtml;')(t => String(t));
      const cls = (h) => (h.match(/<i class="([a-z]*)"><\/i>/g) || []).map(x => x.replace(/<i class="([a-z]*)"><\/i>/, '$1') || '-').join('');
      const gO = fg({ c: 'gauge', k: '表の仕事', done: 2, total: 5 }, true), gU = fg({ c: 'gauge', k: '裏方', done: 3, run: 2, total: 5, lab: '3/5' }, true), g0 = fg({ c: 'gauge', done: 3, total: 4 }, true);
      if (cls(gO) === 'ddc--' && /<span class="stg-k">表の仕事<\/span>/.test(gO) && /<span class="stg-n">3\/5<\/span>/.test(gO)) { ok('表の仕事のゲージ：済み緑2・今の段青1・横に 3/5・頭に小さく「表の仕事」'); } else { ng('表の仕事のゲージが違う：' + cls(gO) + ' ' + gO); }
      if (cls(gU) === 'dddcc' && /<span class="stg-k">裏方<\/span>/.test(gU) && /<span class="stg-n">3\/5<\/span>/.test(gU)) { ok('裏方のゲージ：直近に終わった分 緑3・動いている分 青2・横に 3/5'); } else { ng('裏方のゲージが違う：' + cls(gU) + ' ' + gU); }
      if (cls(g0) === 'dddc' && /<span class="stg-n">4\/4<\/span>/.test(g0) && g0.indexOf('stg-k') < 0) { ok('名を付けない時は v185 と同じ（済み3・今1・4/4）'); } else { ng('v185 の形が崩れた：' + g0); }
    }
    /* v204：箱の字は「全部終わる見込み HH:MM」の一行だけ（src・始まり・元の数は箱に出さない。state.json の panelView にだけ） */
    {
      const fe = new Function(cut(H, 'endShort', '  ') + String.fromCharCode(10) + 'return endShort;')(), fc = new Function(cut(H, 'uraCount', '  ') + String.fromCharCode(10) + 'return uraCount;')();
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
      // 比 0.5（20/40・40/80）・一枠 30分（20・30・40 の中央値）：今の仕事 22:00＋60分×0.5＝22:30、順番待ち 1件（合図は数えない）×30分 → 23:00
      if (e1.omote.endAt === '23:00' && e1.omote.ratio.v === 0.5 && e1.omote.ratio.n === 2 && e1.omote.wait.n === 1 && e1.omote.wait.signals === 1 && e1.omote.wait.frameMin === 30 && e1.omote.cur.left === 3) { ok('表：今の仕事の残り＋順番待ち（合図は数えない）×今日の一枠の中央値・見込みと実測の比で 23:00'); } else { ng('表の全部終わる刻が違う：' + JSON.stringify(e1.omote)); }
      if (/順番待ち 1件×30分/.test(e1.omote.src) && /比 0\.5（直近24時間 2組）/.test(e1.omote.src)) { ok('表の元の数（件・分・比）が src に入る：' + e1.omote.src); } else { ng('表の src が違う：' + e1.omote.src); }
      // 段が二つ増え、控えの「開始:」が 22:35 に刻み直されても、始まりは 22:00 のまま・終わりだけ 一段15分×2×0.5 延びる → 23:15
      fs.appendFileSync(env.ENDAT_STEPS, '[ ] 段5' + LF + '[ ] 段6' + LF);
      const e2 = EA.compute(Object.assign({}, d1, { startedAt: J('22:35'), stepTotal: 6 }), J('22:40'));
      if (e2.omote.endAt === '23:15' && e2.omote.startSec === J('22:00') && e2.omote.cur.addSteps === 2) { ok('段が増えても始まりは付け直さず（22:00 のまま）、終わりだけ延びる（23:00 → 23:15）'); } else { ng('段が増えた時の終わりが違う：' + JSON.stringify(e2.omote)); }
      const e3 = EA.compute(Object.assign({}, d1, { startedAt: J('22:35'), stepTotal: 6 }), J('23:31'));
      if (e3.omote.endAt === '23:35' && e3.omote.over === true) { ok('見込みを過ぎて残っている時は、今を5分刻みに切り上げた刻（23:35）へ延ばす'); } else { ng('過ぎた時の表の刻が違う：' + JSON.stringify(e3.omote)); }
      // 裏方：下請け 1本（22:35〜・今日の済んだ2本 10分と20分の中央値 15分 → 22:50）・雲 1本（22:38〜・流れ A の 6分と4分の中央値 5分 → 22:43）→ 遅い方 22:50
      if (e1.ura.endAt === '22:50' && e1.ura.sub.n === 1 && e1.ura.sub.min === 15 && e1.ura.cloud.n === 1 && e1.ura.cloud.min === 5) { ok('裏方：下請けと雲の全部のうち一番遅い終わり（22:50）・1本あたりは今日の中央値'); } else { ng('裏方の全部終わる刻が違う：' + JSON.stringify(e1.ura)); }
      const pv = PV.panelView(Object.assign({ eta: e1, ura: { sub: {}, cloud: {} } }, d1), [], [], J('22:40'));
      if (pv.omote.endAt === '23:00' && pv.omote.lines[0].indexOf('表の仕事の全部終わる見込み：23:00（') === 0 && pv.ura.endAt === '22:50' && pv.ura.lines[0].indexOf('裏方の全部終わる見込み：22:50（') === 0 && pv.omote.lines[4] === '始まり：22:00') { ok('panelView.omote／ura に endAt と元の数・頭の一行は一つずつだけ'); } else { ng('panelView の全部終わる見込みが違う：' + JSON.stringify({ o: pv.omote, u: pv.ura })); }
      fs.writeFileSync(env.ENDAT_STEPS, ['仕事: 枠 九：作り値', '[x] 段1', ''].join(LF)); fs.writeFileSync(env.ENDAT_SUBLOG, ''); fs.writeFileSync(env.ENDAT_CLOUD, '{"list":[]}');
      const e4 = EA.compute(Object.assign({}, d1, { foot: { wait: 0, waitList: [] } }), J('22:40')), l4 = PV.endLine(e4, 'omote') + '|' + PV.endLine(e4, 'ura');
      if (l4 === '表の仕事の全部終わる見込み：なし（残りの仕事が無い）（今の仕事なし＋順番待ち 0件×30分（直近24時間の3枠の中央値）・見込みと実測の比 0.5（直近24時間 2組））|裏方の全部終わる見込み：なし（動いている物が無い）（下請け 0本（1本 15分＝直近24時間の実測なし・仮に15分）・雲 0本（1本 10分＝直近24時間の実測なし・仮に10分））') { ok('残りが無い時は「なし」と元の数（空にしない）'); } else { ng('残りが無い時の字が違う：' + l4); }
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
      const fb = new Function(cut('boxSpec') + LF + 'return boxSpec;')(), fr = new Function('pad2s', cut('etaRow') + LF + 'return etaRow;')(sec => { const d = new Date(sec * 1000); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }), fg = new Function(cut('uraGroups') + LF + 'return uraGroups;')();
      const U3 = { sub: { items: [{ id: 'b', desc: '台帳の整理', start: '01:12' }], recent: [{ id: 'a', desc: 'パネル直し', start: '01:01', end: '01:20', state: '終' }] }, cloud: { running: [{ id: 8, name: '札と状態の配信', at: '01:19', state: '待ち' }], recent: [{ id: 7, name: '自動検査と配信', at: '01:12', upd: '01:20', state: '落ちた', failStep: '速い版' }] } };
      const bA = fb(c4, U3, 'all'), bO = fb(c4, U3, 'omote'), bU = fb(c4, U3, 'ura');
      if (bA && bA.k === '全部' && bA.now === '表の仕事 残り3・裏方 残り2' && bA.total === 9 && bA.run === 3 && bU.done === 2 && bU.total === 4 && bU.run === 2 && bU.lab === '2/4' && bO.k === '表の仕事' && bO.now === '枠 九：ゲージに戻す' && bU.k === '裏方' && bU.now === '下請け・台帳の整理、雲・札と状態の配信' && fb({ omote: { endAt: '01:00' } }, null, 'omote') === null) { ok('箱の頭：全部「' + bA.now + '」／表の仕事「' + bO.now + '」／裏方「' + bU.now + '」・区切りの無い古い state は null'); } else { ng('箱の中身が違う：' + JSON.stringify([bA, bO, bU])); }
      const nS = Math.floor(Date.now() / 1000), r1 = fr({ endSec: nS + 1500 }, nS, false), r2 = fr({ endSec: nS + 600, over: true }, nS, false), r3 = fr({ endSec: nS - 960 }, nS, false), r4 = fr({ endSec: 0 }, nS, false);
      if (/^全部終わる見込み [0-9]{2}:[0-9]{2}（あと25分）$/.test(r1.t) && r1.c === 'eta' && r2.c === 'bad' && /（あと10分）/.test(r2.t) && r3.t === '見込みを過ぎた 16分' && r3.c === 'bad' && r4 === null) { ok('終わりの一行は v180 と同じ数え方：「' + r1.t + '」・延ばした刻は赤・過ぎたら赤「見込みを過ぎた 16分」・刻が無ければ出さない'); } else { ng('終わりの一行が違う：' + JSON.stringify([r1, r2, r3, r4])); }
      const g3 = fg(U3);
      if (g3.run.join('|') === '下請け：台帳の整理（01:12〜）' && g3.wait.join('|') === '雲：札と状態の配信（01:19〜・待ち）' && g3.done.join('|') === '下請け：パネル直し（01:01〜01:20・終）|雲：自動検査と配信（01:12〜01:20・落ちた・落ちた段：速い版）') { ok('裏方の一本ずつ：動作中＝進行中・待ち＝予定・終／落ちた＝完了（落ちた段の名も）'); } else { ng('裏方の分け方が違う：' + JSON.stringify(g3)); }
      /* paintStateLine を偽の器で回す（state.json の panelView を通した値で） */
      const src = ['paintStateLine', 'gaugeHtml', 'endShort', 'uraCount', 'boxSpec', 'headEta', 'etaRow', 'uraGroups', 'waitEtaRow', 'pad2s'].map(cut);
      if (src.some(x => !x)) { ng('切り出せない関数がある（' + ['paintStateLine', 'gaugeHtml', 'endShort', 'uraCount', 'boxSpec', 'headEta', 'etaRow', 'uraGroups', 'waitEtaRow', 'pad2s'].filter((n, i) => !src[i]).join('・') + '）'); }
      else {
        const VARS = ['lastEta', 'lastUra', 'lastSNow', 'lastStepTotal', 'lastStepDone', 'lastStat', 'lastStartedAt', 'lastMikomiMin', 'lastMikomiRaw', 'lastSDone', 'lastSNowAt', 'lastSNext', 'stepsOpen', 'lastKumo', 'lastDetail'];
        const fp = new Function('S', 'var ' + VARS.map(v => v + ' = S.' + v).join(', ') + ';' + LF + 'function $(id) { return S.el[id] || null; }' + LF + "function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }" + LF + "function stateLineText() { return ''; }" + LF + "function headText() { return ''; }" + LF + src.join(LF) + LF + 'paintStateLine();');
        const paint = (d, ura, open, ov) => {
          const el = { progBox: { innerHTML: '', className: '' }, btnSteps: { className: '', textContent: '', setAttribute: function () { } }, stLine: { hidden: true, innerHTML: '' }, headWait: { textContent: '' } };
          const pv = d ? PV.panelView(Object.assign({ eta: d, ura: ura }, st({})), [], [], nS) : null;
          fp(Object.assign({ el: el, lastEta: pv ? { omote: pv.omote, ura: pv.ura, all: pv.all } : null, lastUra: ura, lastSNow: '段3', lastStepTotal: 3, lastStepDone: 2, lastStat: '作業中', lastStartedAt: nS - 300, lastMikomiMin: 30, lastMikomiRaw: '30分', lastSDone: '段2', lastSNowAt: nS - 60, lastSNext: '', stepsOpen: !!open, lastKumo: '', lastDetail: '' }, ov || {}));
          return el;
        };
        const ids = (h) => (h.match(/<div class="pg-sec" id="([a-zA-Z]+)">/g) || []).map(x => x.replace(/.*id="([a-zA-Z]+)".*/, '$1')).join(',');
        const heads = (h) => (h.match(/<b class="pg-k">([^<]*)<\/b>/g) || []).map(x => x.replace(/<[^>]+>/g, '')).join(',');
        const bars = (h) => h.split('<span class="stg-bar">').slice(1).map(x => x.split('</span>')[0].replace(/<i class="([a-z]*)"><\/i>/g, (m, c) => c || '-')).join(' ');
        const labs = (h) => (h.match(/<span class="stg-n">([^<]*)<\/span>/g) || []).map(x => x.replace(/<[^>]+>/g, '')).join(' ');
        const set = (e, a, o, u) => { e = JSON.parse(JSON.stringify(e)); [a, o, u].forEach((x, i) => { e[['all', 'omote', 'ura'][i]].endSec = x ? nS + x : 0; }); return e; };
        const E4 = set(c4, 2400, 1800, 2400), e4 = paint(E4, U3, false), h4 = e4.progBox.innerHTML;
        if (ids(h4) === 'allSec,omoteSec,uraSec' && heads(h4) === '全部,表の仕事,裏方' && e4.progBox.className === 'progbox') { ok('箱は三つ・上から「全部」「表の仕事」「裏方」・それぞれ頭に名'); } else { ng('箱の並び・名が違う：' + ids(h4) + '／' + heads(h4)); }
        /* v206（枠 六十一）：束が裏方を1本しか数えていなくても、ura で動いている2本（下請け1・雲1）に足りない1本を青で足す（裏方 2/3→2/4・全部 4/8→4/9）。裏方の横の字は 済み/全体 */
        if (bars(h4) === 'ddddccc-- ddc-- ddcc' && labs(h4) === '5/9 3/5 2/4') { ok('ゲージ：全部 ddddccc--（5/9）・表 ddc--（3/5）・裏方 ddcc（済み2/全体4）＝済みは緑・今は青・まだは灰'); } else { ng('三つのゲージが違う：' + bars(h4) + '／' + labs(h4)); }
        /* v206（枠 五十九の一・六十）：三つの箱の頭（名の右）に「あと N分（HH:MM ごろ）」・ゲージの下に「全部終わる見込み HH:MM（あと N分）」（裏方の箱にも必ず） */
        const etas = (h4.match(/<div class="pb pg-h"><b class="pg-k">[^<]*<\/b><span class="pg-eta eta">([^<]*)<\/span>/g) || []).map(x => x.replace(/<b class="pg-k">[^<]*<\/b>/, '').replace(/<[^>]+>/g, ''));
        const ends = (h4.match(/<p class="m eta">全部終わる見込み [^<]*<\/p>/g) || []).map(x => x.replace(/<[^>]+>/g, ''));
        if (etas.length === 3 && /^あと 40分（[0-9]{2}:[0-9]{2} ごろ）$/.test(etas[0]) && /^あと 30分（[0-9]{2}:[0-9]{2} ごろ）$/.test(etas[1]) && /^あと 40分（[0-9]{2}:[0-9]{2} ごろ）$/.test(etas[2])) { ok('三つの箱の頭に「あと N分（HH:MM ごろ）」：' + etas.join('／')); } else { ng('箱の頭のあと N分が違う：' + etas.join('／')); }
        if (ends.length === 3 && /（あと40分）$/.test(ends[0]) && /（あと30分）$/.test(ends[1]) && /（あと40分）$/.test(ends[2]) && h4.indexOf('id="uraSec"') < h4.lastIndexOf('全部終わる見込み')) { ok('三つの箱とも（裏方も）ゲージの下に「全部終わる見込み HH:MM（あと N分）」：' + ends.join('／')); } else { ng('全部終わる見込みの行が違う：' + ends.join('／')); }
        /* v206（枠 六十）：動いている物も待っている物も無く全部済んだ箱は出さない・全部済めば箱ごと隠す・動き出したらまた出る */
        const E0b = JSON.parse(JSON.stringify(E4)); E0b.ura.seg = { done: 4, total: 4, run: 0 }; E0b.ura.endSec = 0; E0b.all.seg = { done: 6, total: 9, run: 1 };
        const h0b = paint(E0b, U([]), false).progBox.innerHTML;
        if (ids(h0b) === 'allSec,omoteSec' && h0b.indexOf('裏方 残り0') >= 0) { ok('裏方 4/4（全部済み・動いている物なし）は箱ごと出さない：' + ids(h0b)); } else { ng('済んだ裏方の箱が残っている：' + ids(h0b)); }
        const E6 = JSON.parse(JSON.stringify(E4)); ['all', 'omote', 'ura'].forEach(k => { E6[k].seg = { done: 3, total: 3, run: 0 }; E6[k].endSec = 0; });
        const e6 = paint(E6, U([]), false);
        if (e6.progBox.innerHTML === '' && e6.progBox.className === 'progbox hide') { ok('三つとも全部済んだ：箱ごと出さない'); } else { ng('全部済んだのに箱が出ている：' + e6.progBox.innerHTML.replace(/<[^>]+>/g, '|').slice(0, 160)); }
        const E61 = JSON.parse(JSON.stringify(E0b)); E61.ura.endSec = nS + 900;
        const h61 = paint(E61, U([{ id: 'p', desc: '下請けの名', start: '01:47' }, { id: 'q', desc: '', start: '01:47' }]), false).progBox.innerHTML, u61 = h61.slice(h61.indexOf('id="uraSec"'));
        if (ids(h61) === 'allSec,omoteSec,uraSec' && bars(u61).split(' ')[0] === 'ddddcc' && labs(u61).split(' ')[0] === '4/6' && /あと 15分（[0-9]{2}:[0-9]{2} ごろ）/.test(u61) && /全部終わる見込み [0-9]{2}:[0-9]{2}（あと15分）/.test(u61) && h61.indexOf('裏方 残り2') >= 0 && /<span class="pg-now">下請け・下請けの名、下請け・名なし<\/span>/.test(u61)) { ok('裏方 4/4 のまま下請け2本が動き出した：裏方の箱がまた出て ddddcc（4/6）・あと15分・全部の箱は「裏方 残り2」'); } else { ng('動き出した裏方が違う：' + ids(h61) + '／' + bars(u61) + '／' + labs(u61) + '／' + u61.replace(/<[^>]+>/g, '|').slice(0, 200)); }
        /* v206（枠 六十二）：作業中で見込みが書かれていなくても、箱に赤い「見込み未記入」「見込み不明」は出さない。panelView.noEstimate にだけ残す */
        const h62 = paint(E4, U3, false, { lastMikomiMin: 0, lastMikomiRaw: '' }).progBox.innerHTML, h62b = paint(E4, U3, false, { lastMikomiMin: 0, lastMikomiRaw: '不明' }).progBox.innerHTML;
        const ne1 = PV.panelView({ stat: '作業中', mikomi: '' }, [], [], nS).noEstimate, ne2 = PV.panelView({ stat: '作業中', mikomi: '30分' }, [], [], nS).noEstimate, ne3 = PV.panelView({ stat: '待ち', mikomi: '' }, [], [], nS).noEstimate;
        if (h62.indexOf('見込み未記入') < 0 && h62b.indexOf('見込み不明') < 0 && /全部終わる見込み/.test(h62) && ne1 === true && ne2 === false && ne3 === false) { ok('見込みを書いていない作業中：箱に赤い「見込み未記入／不明」は出ず、state.json の panelView.noEstimate=true に残る（書いてあれば false）'); } else { ng('見込み未記入の扱いが違う：' + [h62.indexOf('見込み未記入'), h62b.indexOf('見込み不明'), ne1, ne2, ne3].join('｜')); }
        if (h4.indexOf('<span class="pg-now">下請け・台帳の整理、雲・札と状態の配信</span>') >= 0 && h4.indexOf('下請け：') < 0 && h4.indexOf('落ちた段') < 0) { ok('箱の上には今動かしている物の一行だけ（裏方の一本ずつの行は箱に出さない）'); } else { ng('箱の上に裏方の一本ずつが残っている／今動かしている物が無い'); }
        const sl = e4.stLine.innerHTML;
        if (e4.stLine.hidden === true && e4.btnSteps.textContent === 'くわしく' && /▶ 進行中：下請け：台帳の整理（01:12〜）/.test(sl) && /⏳ 予定：雲：札と状態の配信/.test(sl) && /✅ 完了：雲：自動検査と配信（01:12〜01:20・落ちた・落ちた段：速い版）/.test(sl) && sl.indexOf('✅ 完了：段2') >= 0 && sl.indexOf('✅') < sl.indexOf('▶') && sl.indexOf('▶') < sl.indexOf('⏳')) { ok('釦は「くわしく」・ふだんは閉じる。中は完了→進行中→予定の順に、段と裏方の一本ずつが分かれて入る'); } else { ng('くわしくの中身が違う：' + e4.btnSteps.textContent + '・hidden=' + e4.stLine.hidden + '・' + sl.replace(/<[^>]+>/g, '|').slice(0, 300)); }
        const e4o = paint(E4, U3, true);
        if (e4o.btnSteps.textContent === 'とじる' && e4o.stLine.hidden === false) { ok('押すと開き、字は「とじる」'); } else { ng('開いた時が違う：' + e4o.btnSteps.textContent + '・hidden=' + e4o.stLine.hidden); }
        const E2 = set(c2, 3000, 3000, 1200), E3 = set(c3, 3000, 3000, 1200), h2 = paint(set(c1, 2400, 2400, 1200), U([{ id: 'a', desc: 'パネル直し', start: '01:01' }]), false).progBox.innerHTML, h2b = paint(E2, U([{ id: 'a', desc: 'パネル直し', start: '01:01' }]), false).progBox.innerHTML, h3 = paint(E3, U([{ id: 'a', desc: 'パネル直し', start: '01:01' }, { id: 'b', desc: '台帳の整理', start: '01:12' }]), false).progBox.innerHTML;
        if (labs(h2) === '2/5 2/4 0/1' && labs(h2b) === '2/6 2/5 0/1' && labs(h3) === '2/8 2/5 0/3' && bars(h3).split(' ')[2] === 'ccc') { ok('増えた時：枠が来て 2/5→2/6（表 2/4→2/5）・下請けと雲が動き出して裏方 0/1→0/3（三本とも青・裏方の横の字は済み/全体）'); } else { ng('増えた時のゲージが違う：' + [labs(h2), labs(h2b), labs(h3), bars(h3)].join('／')); }
        const e0 = paint(null, U3, false), h0 = e0.progBox.innerHTML;
        if (ids(h0) === 'omoteSec,uraSec' && h0.indexOf('pg-k') < 0) { ok('区切りの無い古い state（panelView が無い）は v204 の二つの箱のまま'); } else { ng('古い state の時の箱が違う：' + ids(h0)); }
        const fpBad = paint(set(c4, 2400, -600, 2400), U3, false).progBox.innerHTML;
        if (/<b class="pg-k">表の仕事<\/b><span class="pg-eta bad">見込みを過ぎた 10分<\/span>/.test(fpBad)) { ok('表の仕事の終わりを過ぎたら、その箱の頭は赤「見込みを過ぎた 10分」（作法39 ①）'); } else { ng('過ぎた時の赤が出ない'); }
      }
    } catch (e) { ng('三つの箱が回らない：' + e.message); }
    finally { Object.keys(keep).forEach(k => { if (keep[k] === undefined) { delete process.env[k]; } else { process.env[k] = keep[k]; } }); try { fs.rmSync(T, { recursive: true, force: true }); } catch (e) { } }
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
      '作業中': [{ stat: '作業中', detail: '裏で手伝い1本・雲1本' }, /^作業中、、、。（裏で手伝い1本・雲1本）$/],
      '検査中': [{ stat: '検査中', detail: 'v1508 検査と配信・終了予定 12:30' }, /^検査中：v1508 検査と配信・終了予定 12:30$/],
      '待ち':   [{ stat: '待ち', detail: '残りの段 2・次「声の繋ぎ」' }, /^待ち：残りの段 2・次「声の繋ぎ」$/],
      'ヨシ待ち': [{ stat: 'ヨシ待ち', detail: 'まとめ札' }, /ヨシ待ち、、、。/],
      '止まり': [{ stat: '止まり（使用量・13:00 にリセット）', detail: '' }, /^止まり（使用量・13:00 にリセット）$/],
      '待機中': [{ stat: '待機中', detail: '' }, /待機中、、、。|まとめて写すヨシ/]
    };
    for (const k of Object.keys(SIX)) {
      const r = run(tmp, { state: Object.assign({}, base, SIX[k][0]), notices: MIX, settle: 1500 }, 390, 844);
      if (!r) { ng(k + '：測れない（目印が出ない）'); continue; }
      if (SIX[k][1].test(String(r.headWait || ''))) { ok(k + '：題の行「' + String(r.headWait).slice(0, 34) + '」'); }
      else { ng(k + '：題の行が違う「' + String(r.headWait).slice(0, 40) + '」'); }
      if (k === '作業中') {   /* v180：作業中は「見込み未記入」「手順の一覧 未記入」を赤で出す（下の base は見込み・段の台帳が無い） */
        if (/見込み未記入/.test(String(r.stBad || '')) && /手順の一覧 未記入/.test(String(r.stBad || ''))) { ok(k + '：見込み・段の台帳が無い回は赤で未記入を出す'); } else { ng(k + '：赤の未記入が出ない（赤「' + String(r.stBad || '') + '」）'); }
      } else if (String(r.stText || '') && !((k === '検査中' || k === '待ち') && /^(終わる見込み|見込み未記入|見込み不明|見込みを過ぎた)/.test(String(r.stText || '')))) {   /* v182：検査中・待ちは見込みの行だけ出る */ ng(k + '：黄色い帯の跡に字が出た「' + String(r.stText).slice(0, 30) + '」'); }
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
    else if (!/手順の一覧 未記入/.test(String(r2.stBad || ''))) { ng('やる段が無い作業中に赤の「手順の一覧 未記入」が出ない（' + String(r2.stText || '').slice(0, 40) + '）'); }
    else { ok('やる段が無い回は三行を出さず、赤で「手順の一覧 未記入」を出す（v180）'); }
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
      if (/終わる見込み [0-9]{2}:[0-9]{2}（あと(24|25|26)分）/.test(T(r))) { ok('見込みあり：「' + (T(r).match(/終わる見込み[^\n]*/) || [''])[0] + '」'); } else { ng('見込みありの字が違う（' + T(r).slice(0, 50) + '）'); }
      if (r.gSegs === 5 && r.gDone === 2 && r.gCur === 2 && /^3\/5$/.test(String(r.gLabel || '')) && !/段 [0-9]/.test(T(r))) { ok('段は字でなく横長ゲージ：5区切り・済み2・今の手順3・横に「3/5」（v185）'); } else { ng('手順のゲージが違う（区切り' + r.gSegs + '・済み' + r.gDone + '・今' + r.gCur + '・字「' + r.gLabel + '」）'); }
      if (B(r)) { ng('見込みも段もあるのに赤が出た（' + B(r) + '）'); } else { ok('見込み・段があれば赤は出ない'); }
    }
    r = mk({ mikomi: '10分', startedAt: nowF - 1500 });
    if (!r) { ng('測れない（過ぎた）'); }
    else if (/見込みを過ぎた (14|15|16)分/.test(B(r))) { ok('見込みを過ぎたら赤「' + B(r) + '」'); } else { ng('「見込みを過ぎた N分」が赤で出ない（赤「' + B(r) + '」）'); }
    r = mk({ mikomi: '' });
    if (!r) { ng('測れない（未記入）'); }
    else if (/見込み未記入/.test(B(r))) { ok('見込みが空なら赤「見込み未記入」'); } else { ng('「見込み未記入」が赤で出ない（赤「' + B(r) + '」）'); }
    r = mk({ mikomi: '不明' });
    if (!r) { ng('測れない（不明）'); }
    else if (/見込み不明/.test(B(r))) { ok('「不明」と書かれた回は赤「見込み不明」'); } else { ng('「見込み不明」が赤で出ない（赤「' + B(r) + '」）'); }
    r = mk({ sNow: '', sDone: '', sNext: '', stepDone: 0, stepTotal: 0 });
    if (!r) { ng('測れない（台帳なし）'); }
    else if (/手順の一覧 未記入/.test(B(r)) && !r.gSegs) { ok('台帳が無ければ赤「手順の一覧 未記入」（段 N/M は出さない）'); } else { ng('台帳なしの字が違う（赤「' + B(r) + '」／' + T(r).slice(0, 40) + '）'); }
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
    else if (/終わる見込み [0-9]{2}:[0-9]{2}（あと(9|10|11)分）/.test(T(r)) && !B(r)) { ok('検査中：「' + (T(r).match(/終わる見込み[^）]*）/) || [''])[0] + '」（赤なし）'); } else { ng('検査中の見込みが出ない（' + T(r).slice(0, 80) + '・赤「' + B(r) + '」）'); }
    r = mk(Object.assign({}, ST['手待ち'], { kumo: '雲：パネル替え・見込み ' + hm(Math.floor(Date.now() / 1000) + 420) }));
    if (!r) { ng('測れない（手待ち＋雲待ち）'); }
    else if (/終わる見込み [0-9]{2}:[0-9]{2}（あと(6|7|8)分）/.test(T(r))) { ok('手待ちの下の雲待ちにも出る'); } else { ng('雲待ちの見込みが出ない（' + T(r).slice(0, 80) + '）'); }
    r = mk(Object.assign({}, ST['手待ち'], { kumo: '雲：パネル替え・見込み ' + hm(Math.floor(Date.now() / 1000) - 900) }));
    if (!r) { ng('測れない（雲待ちの見込み超過）'); }
    else if (/見込みを過ぎた (14|15|16)分/.test(B(r))) { ok('見込みを過ぎたら赤「' + B(r) + '」'); } else { ng('雲待ちの超過が赤で出ない（赤「' + B(r) + '」）'); }
    r = mk(Object.assign({}, ST['手待ち'], { stat: '検査中', detail: '雲の検査・見込み不明' }));
    if (!r) { ng('測れない（見込み不明）'); }
    else if (/見込み不明/.test(B(r))) { ok('検査中で刻が無ければ赤「見込み不明」'); } else { ng('「見込み不明」が赤で出ない（赤「' + B(r) + '」）'); }
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
  head('⑤の六 並び（HTML の順そのもの）：一覧／様子を写す → 使用量 → 本体の版 → panel の版 → 下の三行');
  {
    const nowE = Math.floor(Date.now() / 1000);
    const stt = Object.assign({}, ST['手待ち'], { ev: 'Stop', evAt: nowE - 30, foot: { wait: 3, unlinked: 2, revive: '今日 3回（固まり 1・重さ 1・0本 1）', reviveLast: '04:12' } });
    const WANT = 'btnShots>btnCopyUrl>usageTag>fVer>verTag>footGroup';
    for (const [w, h] of [[390, 844], [375, 667], [320, 568]]) {
      const r = run(tmp, { state: stt, notices: MIX, usage: U_OK, settle: 1500 }, w, h);
      if (!r) { ng(w + 'x' + h + '：測れない（並び）'); continue; }
      if (r.ordMissing) { ng(w + 'x' + h + '：要素が無い（' + r.ordMissing + '）'); continue; }
      const tops = r.ordTops || [];
      if (r.ordDoc !== WANT) { ng(w + 'x' + h + '：HTML の順が違う（' + r.ordDoc + '）'); }
      else if (r.ordCss) { ng(w + 'x' + h + '：CSS の order／flex で並べ替えている（' + r.ordCss + '）'); }
      else if (tops.some((t, i) => i > 0 && t < tops[i - 1])) { ng(w + 'x' + h + '：画面の上下の並びが HTML の順と食い違う（' + tops.join(',') + '）'); }
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
    else if (/手順の一覧 未記入/.test(String(r0.stBad || '')) && !r0.gSegs) { ok('手順の一覧が無ければ赤字「手順の一覧 未記入」（ゲージは出さない）'); } else { ng('「手順の一覧 未記入」が赤で出ない（赤「' + String(r0.stBad || '') + '」）'); }
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
      else if (r.pbPrev !== 'HEADER') { ng(w + 'x' + h + '：箱が見出し（header）の直後にない（直前＝' + r.pbPrev + '）'); }
      else if (r.pbTop < r.pbHeadBottom - 1 || r.pbTop - r.pbHeadBottom > 24) { ng(w + 'x' + h + '：箱が見出しのすぐ下でない（見出しの下端 ' + r.pbHeadBottom + '・箱の上端 ' + r.pbTop + '）'); }
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
    const sc = { state: Object.assign({}, ST['手待ち'], { rcName: 'koushu-handan-93', rcPid: 6308, rcUrl: 'https://claude.ai/code/session_X' }), notices: [N(nowE - 500, '✅ 終わりました（返事不要）', '済んだ件の本文')], board: { waiting: [], recent: [{ name: '直近その一', result: '済んだ' }, { name: '直近その二', result: '済んだ' }] }, usage: U_OK, settle: 1500 };
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
      }
      if (!r.shR || !r.recR || !r.urlR) { why.push('三つ並びの釦が出ていない'); }
      else {
        if (!(r.shR.l < r.recR.l && r.recR.l < r.urlR.l)) { why.push('順が 写し取り一覧→直近に終わった仕事→様子を写す でない'); }
        if (Math.max(Math.abs(r.shR.t - r.recR.t), Math.abs(r.recR.t - r.urlR.t)) > 1) { why.push('三つが同じ高さに並んでいない'); }
        if (r.urlR.r > w + 1 || r.shR.l < -1) { why.push('三つ並びが横に溢れる'); }
        if (r.shR.h < 44 || r.recR.h < 44 || r.urlR.h < 44) { why.push('三つの当たりが44px未満'); }
      }
      if (r.btnOver) { why.push('画面が横に溢れる'); }
      if (why.length) { ng(w + 'x' + h + '：' + why.join('／') + '［' + r.halfDump + '］'); } else { ok(w + 'x' + h + '：遠隔と終わりました N件は半分ずつの二つ並び（' + Math.round(r.rcR.w) + '・' + Math.round(r.doneR.w) + 'px）／写し取り一覧・直近に終わった仕事・様子を写すは同じ高さの三つ並び（高さ ' + Math.round(r.recR.h) + 'px）'); }
    }
    const rp = run(tmp, Object.assign({}, sc, { pressRecent: true }), 390, 844);
    if (!rp) { ng('測れない（直近の釦を押す）'); }
    else if (/直近に終わった仕事（2件）/.test(String(rp.recBefore || '')) && /^写した$/.test(String(rp.recAfter || '')) && /直近その一/.test(String(rp.recClip || '')) && /直近その二/.test(String(rp.recClip || ''))) { ok('直近に終わった仕事は箱ごと押して全文が写る（押す前「' + rp.recBefore + '」・押した後「' + rp.recAfter + '」）'); }
    else { ng('直近の釦を押しても写らない／字が違う（前「' + rp.recBefore + '」・後「' + rp.recAfter + '」・写し「' + String(rp.recClip || '').slice(0, 30) + '」）'); }
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
      if (/札まとめ中、、、。（[0-9]{2}:[0-9]{2} ごろ）/.test(t) && !/待機中/.test(t) && r.hwCls !== 'late') { ok(w + 'x' + h + '：印がある間は待機中でなく「' + t + '」（見込みの刻つき・赤でない）'); } else { ng(w + 'x' + h + '：札まとめ中が出ない（頭の字「' + t + '」・class「' + r.hwCls + '」）'); }
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
    else if (/待機中/.test(String(r.headWait || '')) && !/まとめ中|遅れ/.test(String(r.headWait || ''))) { ok('印が無ければ今までどおり「待機中」'); } else { ng('印が無いのに待機中でない（頭の字「' + String(r.headWait) + '」）'); }
    r = run1({ cardOwedAt: nf() - 700 }, []);
    if (!r) { ng('測れない（印が古い）'); }
    else if (/待機中/.test(String(r.headWait || ''))) { ok('10分たった印は消えて「待機中」に戻る（永久に居座らない）'); } else { ng('10分たった印が居座っている（頭の字「' + String(r.headWait) + '」）'); }
    const hit1 = run1({ cardOwedAt: nf() - 20 }, MIX, 390, 844, 12500), hit0 = run1({ cardOwedAt: 0 }, MIX, 390, 844, 12500);
    if (!hit1 || !hit0) { ng('測れない（読み直し）'); }
    else if (hit1.noticeHits >= hit0.noticeHits + 1) { ok('印がある間は10秒おきに札を読み直す（札の取得 ' + hit1.noticeHits + '回・印なしは ' + hit0.noticeHits + '回）'); } else { ng('印があっても読み直しが増えない（' + hit1.noticeHits + '回・印なし ' + hit0.noticeHits + '回）'); }
    /* v189：雲の検査を待つ間は、札は控えに置いたまま出さない。見込みの刻は検査の見込み・遅れの赤は見込みの30秒後から */
    r = run1({ cardOwedAt: nf() - 400, cardOwedEta: nf() + 600 }, []);   /* 札の一覧は空：検査の頭の now から離れた MIX の札を「出た札」と数えないため */
    if (!r) { ng('測れない（雲待ちの間）'); }
    else if (/札まとめ中、、、。（[0-9]{2}:[0-9]{2} ごろ）/.test(String(r.headWait || '')) && r.hwCls !== 'late') { ok('雲の検査を待つ間は、待ち始めから400秒たっても赤にならず「' + r.headWait + '」（検査の見込みの刻）'); } else { ng('雲待ちの間に遅れの赤が出た／まとめ中が出ない（「' + String(r.headWait) + '」・class「' + r.hwCls + '」）'); }
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
    const els = { pipeWarn: { className: 'pipe', textContent: '止まっとるかも：作り値の赤い行' }, wakeWarn: { className: 'pipe hide', textContent: '' } };
    let txt = '';
    try {
      const wi = H.indexOf('  function waitListLines('), wj = (wi >= 0) ? H.indexOf(String.fromCharCode(10) + '  }', wi) : -1; const wlsrc = (wi >= 0 && wj > wi) ? H.slice(wi, wj + 4) : '';   // v197：statusText が使う waitListLines も一緒に切り出す
      const cutF = (n) => { const a = H.indexOf('  function ' + n + '('), b = (a >= 0) ? H.indexOf(String.fromCharCode(10) + '  }', a) : -1; return (a >= 0 && b > a) ? H.slice(a, b + 4) : ''; };   // v202：表の仕事と裏方の組み立ても一緒に切り出す
      const oml = H.slice(H.indexOf('  function omoteNow('), H.indexOf(String.fromCharCode(10), H.indexOf('  function omoteNow(')));
      const fn0 = new Function('headText', 'lastSubj', 'lastState', 'lastEvName', 'lastEvAt', 'lastRcName', 'lastRcPid', '$', 'allRows', 'PANEL_VER', 'copySrcUrl', 'nowLine', 'lastStat', 'lastSNow', 'lastStepDone', 'lastStepTotal', 'lastStartedAt', 'lastMikomiRaw', 'lastUra', wlsrc + '\n' + cutF('omoteLines') + '\n' + cutF('uraLines') + '\n' + cutF('endLine') + '\n' + oml + '\n' + body + '\nreturn statusText();');
      const URA0 = { sub: { running: 1, items: [{ id: 'a1', type: 'general-purpose', desc: '作り値の下請け', start: '23:39' }], recent: [] }, cloud: { running: [], recent: [{ id: 9, name: '自動検査と配信', title: '自動検査と配信', at: '23:28', upd: '23:32', state: '落ちた', failStep: '速い版' }] } };
      const fn = function () { const a = [].slice.call(arguments); return fn0.apply(null, a.concat(['作業中', '作り値の段', 1, 4, 1795089000, '30分', URA0])); };
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
