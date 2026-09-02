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
 *   ⑩ 通知の本文を写す釦が、割れずに一枚で写す（短い／長い／空の三通り）
 *   ⑪ 長い報告の札を、まとめて写すが割らずに一枚で写す
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
    o.stText = txt(st);
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
    o.ntfyClip = CAP.clip;
    o.ntfyBtn2 = bn ? txt(bn) : null;
    o.stH = st ? Math.round(st.getBoundingClientRect().height * 10) / 10 : null;
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

  /* ---- ⑦ 遠すぎる終了予定を数字にしない（2026-09-02・走り出しの時刻ずれ-1） ---- */
  /*   仕事が替わってから work-started.txt が書き換わるまでの十数秒に読むと、
   *   **前の仕事の開始 ＋ 新しい見込み** で足してしまう。実際に押し送りが
   *   2026-09-02 06:11:55 に「22時58分」（16時間46分先）を出した。
   *   ここでは、開始を8時間前に置いた作り値で **数字が出ないこと** を見る。
   *   ＊いまより前の刻は伏せないのが正しい（超過して走っている回がそれ）。併せて見る。 */
  head('⑦ 遠すぎる終了予定は数字にしない');
  {
    /* 黄色の行（stLine）が出す刻を拾って、**いまから12時間以内**であることを見る。
       ＊材料が狂うと、この行は平然と16時間先の刻を出す。字の形は同じなので、
         「数字が出ているか」では捕まらない。**出た数字を刻に戻して測る**。 */
    const far = Object.assign({}, ST['作業中'], { startedAt: now - 8 * 3600, mikomi: '40分' });
    const bad = new Date((now - 8 * 3600 + 40 * 60) * 1000);
    const badText = bad.getHours() + '時' + ('0' + bad.getMinutes()).slice(-2) + '分';
    const r = run(tmp, { state: far, notices: MIX, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      const t = String(r.stText);
      const m = t.match(/([0-9]+)時([0-9]+)分終了予定/);
      if (t.indexOf(badText) >= 0) {
        ng('前の仕事の開始を引きずった刻がそのまま出た（' + badText + '）');
      } else if (!m) {
        ok('前の仕事の開始（8時間前）を引きずった形で、刻を出していない（' + t.slice(0, 40) + '）');
      } else {
        const e = new Date(); e.setHours(Number(m[1]), Number(m[2]), 0, 0);
        let ahead = (e.getTime() / 1000) - now;
        if (ahead < -12 * 3600) { ahead += 24 * 3600; }
        if (ahead <= 12 * 3600) {
          ok('引きずった刻（' + badText + '）は出ず、いまから' +
             Math.round(ahead / 60) + '分先の刻に収まった（' + m[0] + '）');
        } else {
          ng('12時間より先の刻が出た（' + m[0] + '・' + Math.round(ahead / 3600) + '時間先）');
        }
      }
    }
    /* 超過して走っている回は、これまでどおり（endPredText が先へ送る）。
       伏せるのは先へ飛んだ刻だけで、超過そのものを消さないことを見る。 */
    const over = Object.assign({}, ST['作業中'], { startedAt: now - 3600, mikomi: '20分' });
    const r2 = run(tmp, { state: over, notices: MIX, settle: 1500 }, 390, 844);
    if (!r2) { ng('測れない'); }
    else if (/[0-9]+時[0-9]+分終了予定/.test(String(r2.stText))) {
      ok('超過中（開始60分前・見込み20分）でも刻は消えない（' + String(r2.stText).slice(0, 34) + '）');
    } else { ng('超過中の刻まで消えた（' + String(r2.stText).slice(0, 50) + '）'); }
  }


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


  /* ---- ⑨ 終了予定の刻だけが別色（2026-09-02・パネルの色-1） ---- */
  /*   ＊刻は明るい水色（--pred:#7fdfff）、それ以外は今までどおり黄色（--ask:#e8c14a）。
   *   ＊描かれた実際の色を読み、**地とのコントラスト比も出して 4.5 以上**を見る。
   *   ＊刻の無い状態（次の指示待ち・ヨシを返してください）では、包む相手がいないので
   *     .pred が出ないことを見る。 */
  head('⑨ 終了予定の刻だけが別色');
  {
    const rgb = (c) => { const m = String(c || '').match(/([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+)/); return m ? [ +m[1], +m[2], +m[3] ] : null; };
    const lum = (c) => { const v = c.map(x => x / 255).map(x => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const cr  = (a, b) => { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };
    const ASK  = [232, 193, 74];
    const PRED = [127, 223, 255];
    const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

    const r = run(tmp, { state: ST['作業中'], notices: MIX, settle: 1500 }, 390, 844);
    if (!r) { ng('測れない'); }
    else {
      const pc = rgb(r.predColor), sc = rgb(r.stColor), bg = rgb(r.stBg);
      if (!pc) { ng('作業中：刻が包まれていない（' + String(r.stText).slice(0, 40) + '）'); }
      else if (!same(pc, PRED)) { ng('作業中：刻の色が違う（' + r.predColor + '）'); }
      else if (!/[0-9]+時[0-9]+分終了予定/.test(r.predText)) { ng('作業中：包んだ字が刻でない（' + r.predText + '）'); }
      else if (!same(sc, ASK)) { ng('作業中：刻の外が黄色でない（' + r.stColor + '）'); }
      else if (!bg) { ng('作業中：地の色が読めない'); }
      else {
        const c1 = cr(pc, bg), c2 = cr(sc, bg);
        if (c1 < 4.5) { ng('刻と地のコントラスト比が足りない（' + c1.toFixed(2) + '）'); }
        else { ok('作業中：刻「' + r.predText + '」が水色（比 ' + c1.toFixed(2) + '）／外は黄色（比 ' + c2.toFixed(2) + '）'); }
      }
    }
    for (const nm of ['手待ち', 'ヨシ待ち']) {
      const r2 = run(tmp, { state: ST[nm], notices: MIX, settle: 1200 }, 390, 844);
      if (!r2) { ng(nm + '：測れない'); }
      else if (r2.predColor) { ng(nm + '：刻が無いのに包まれている（' + r2.predText + '）'); }
      else if (same(rgb(r2.stColor), ASK)) { ok(nm + '：包まず黄色のまま（' + String(r2.stText).slice(0, 20) + '）'); }
      else { ng(nm + '：色が黄色でない（' + r2.stColor + '）'); }
    }
  }


  /* ---- ⑩ 通知の本文を写す釦（2026-09-02・通知のコピー-1） ---- */
  /*   ＊三通り：短い通知／長い報告（送る側では7通に割れる長さ）／空。
   *   ＊眼目は**割れずに一枚で写る**こと。置き場には割る前の一枚しか無いので、
   *     写しの字数が置き場の字数とぴったり合えば、一枚で写せている。 */
  head('⑩ 通知の本文を写す釦');
  {
    /* 一度のタップで写れるかは、真似た台では拾えない（iOS の「触られた」印は node に無い）。
       代わりに**字面で**見る——押したときの手（copyNtfyLatest）の中で取りに行っていないこと。
       押してから取りに行くと、待つあいだに印が切れて一度目で写せない。 */
    const a = html.indexOf('function copyNtfyLatest(btn) {');
    const b = a >= 0 ? html.indexOf(String.fromCharCode(10) + '  }', a) : -1;
    if (a < 0 || b < 0) { ng('押したときの手が見つからない'); }
    else {
      const fn = html.slice(a, b).split('pullNtfyLatest()').join('');
      if (fn.indexOf('fetch(') >= 0) { ng('押したときの手の中で取りに行っている（一度のタップで写せない）'); }
      else { ok('押したときの手は写すだけ（取りに行く待ちを挟んでいない）'); }
    }
    if (html.indexOf('function tick() { pull(); pullState(); pullSeen(); pullNtfyLatest(); }') >= 0) {
      ok('本文は開いたときと15秒ごとに先に取ってある');
    } else { ng('本文を先に取る手が無い'); }
  }
  {
    /* 作り値は ntfy-sent.json の形（古い順の一覧）。
       ＊三通り … 短い一本／7通に割れる長さの一本／空の一覧。
       ＊眼目は**割れずに一枚で写る**ことと、**残N／M件**と**畳み**。 */
    const mk = (t, title, body, parts) => ({ time: t, at: '2026-09-02 18:50:33', title: title, parts: parts || 1, body: body });
    const SHORT = '積んだ刻 15:48:13／預けた刻 無し／読めた刻 無し／送った刻 無し';
    let long = '';
    for (let i = 0; i < 205; i++) { long += '行' + i + '：実測の数字と字がここに並ぶ。長さを稼ぐための行。' + String.fromCharCode(10); }

    const CASES = [
      ['短い通知', [mk(1, '調べ 終わりの黙り-3', SHORT, 1)], 1],
      ['長い報告', [mk(2, '報告 長いもの', long, 7)], 1],
      ['空',     [], 0]
    ];
    for (const [nm, list, want] of CASES) {
      const r = run(tmp, { state: ST['手待ち'], notices: MIX, ntfy: list, pressNtfy: true, settle: 1200 }, 390, 844);
      if (!r) { ng(nm + '：測れない'); continue; }
      const clip = String(r.ntfyClip || '');
      if (!want) {
        /* 写すものが無い回は**釦ごと畳む**（「まとめて写す」と同じ）。
           ＊畳んだ釦は押せないので、断りの字は出ない——出す相手がいない。 */
        if (clip) { ng(nm + '：写すものが無いのに写した（' + clip.length + '字）'); }
        else if (!r.ntfyShown && /（0件）/.test(String(r.ntfyBtn || ''))) { ok(nm + '：釦ごと畳んだ（字は「' + r.ntfyBtn + '」・押せない）'); }
        else { ng(nm + '：畳んでいない（見えている=' + r.ntfyShown + '・字「' + String(r.ntfyBtn) + '」）'); }
        continue;
      }
      /* 一枚で写れたか … 本文が丸ごと入っていて、頭の一行が付いていること */
      const one = list[0];
      if (clip.indexOf(one.body) < 0) { ng(nm + '：本文が丸ごと入っていない（写し ' + clip.length + '字／本文 ' + one.body.length + '字）'); continue; }
      if (clip.indexOf(one.title) < 0) { ng(nm + '：頭の一行が無い'); continue; }
      /* 押す前の字が「残N／M件」であること（まとめて写すと同じ形） */
      const before = String(r.ntfyBtn || '');
      if (!/残1／1件/.test(before)) { ng(nm + '：押す前の字が残N／M件でない（「' + before + '」）'); continue; }
      /* 写したあとは印が付いて畳む */
      const after = String(r.ntfyBtn2 || '');
      if (!/1件 写した/.test(after)) { ng(nm + '：写したあとの字が違う（「' + after + '」）'); continue; }
      const bytes = Buffer.byteLength(one.body, 'utf8');
      ok(nm + '：残1／1件 → 一枚で写した（' + one.body.length + '字・送る側なら' + Math.ceil(bytes / 2600) + '通に割れる長さ）');
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
