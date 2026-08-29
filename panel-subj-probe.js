/* 畳んだ札の表紙に件名が出るかを、写しに probe を差して実測する道具（作法14）。
 *
 *   何を測るか
 *     ・畳んだ「✅ 終わりました（返事不要）」の札に、本文の一行目（件名）が出ているか
 *     ・そのとき本文（.m）は隠れているか
 *     ・題の行を押して開いたら、本文が出て件名の行が引っ込むか
 *
 *   使い方   node panel-subj-probe.js
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, 'panel.html');
const MARK = 'SUBJPROBE-B64:';
const SUBJ = '数字の再掲（郵便詰まり-3／通し試し／未達1件）';

function findBrowser() {
  const cands = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  for (const c of cands) { if (fs.existsSync(c)) return c; }
  return null;
}

function probeSource() {
  return '\n<script>\n(function () {\n'
    + '  var SUBJ = ' + JSON.stringify(SUBJ) + ';\n'
    + String.raw`
  try { localStorage.clear(); } catch (e) {}
  var NL = String.fromCharCode(10);
  var NOTES = [
    { time: 1756450000, title: '✅ 終わりました（返事不要）',
      message: SUBJ + NL + '【a】書き足し13:12:45→受信箱13:13:34（49秒）→着手13:14:51（126秒）。' },
    { time: 1756449000, title: '🙋 ヨシしてください',
      message: '別の件の札' + NL + '待っているのは：実機の確認' }
  ];
  var J = function (o) {
    return Promise.resolve({ ok: true, status: 200,
      json: function () { return Promise.resolve(o); },
      text: function () { return Promise.resolve(typeof o === 'string' ? o : JSON.stringify(o)); } });
  };
  window.fetch = function (u) {
    u = String(u);
    if (u.indexOf('panel-ver.txt') >= 0) return J('75');
    if (u.indexOf('notices.json') >= 0)  return J(NOTES);
    if (u.indexOf('board.json') >= 0)    return J({ waiting: [], recent: [] });
    if (u.indexOf('seen.json') >= 0)     return J({ upto: 0 });
    if (u.indexOf('state.json') >= 0)    return J({ at: Math.floor(Date.now()/1000),
      statAt: Math.floor(Date.now()/1000), stat: '作業中', subj: '実測', mikomi: '不明', mailUnread: 0 });
    if (u.indexOf('usage.json') >= 0)    return J({});
    if (u.indexOf('stable') >= 0)        return J('1428');
    if (u.indexOf('ver.txt') >= 0)       return J('1428');
    return Promise.reject(new Error('probe: 想定外の口 ' + u));
  };
  function out(o) {
    var d = document.createElement('div');
    d.id = 'subjProbeOut';
    d.textContent = 'SUBJPROBE-B64:' + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
    document.body.appendChild(d);
  }
  function look(li) {
    var sj = li.querySelector('.sj'), m = li.querySelector('.m');
    return {
      sjText: sj ? (sj.textContent || '') : null,
      sjShown: sj ? (window.getComputedStyle(sj).display !== 'none') : false,
      mShown:  m  ? (window.getComputedStyle(m).display  !== 'none') : false
    };
  }
  window.addEventListener('load', function () {
    setTimeout(function () {
      var ul = document.getElementById('list');
      var lis = ul ? ul.querySelectorAll('li') : [];
      var done = null;
      for (var i = 0; i < lis.length; i++) {
        if ((lis[i].textContent || '').indexOf('終わりました') >= 0) { done = lis[i]; break; }
      }
      if (!done) { out({ err: '終わりましたの札が見つからない', n: lis.length }); return; }
      var before = look(done);
      var t = done.querySelector('.t');
      if (t) { t.click(); }
      setTimeout(function () {
        out({ before: before, after: look(done), want: SUBJ });
      }, 400);
    }, 2500);
  });
})();
</script>
`;
}

function run() {
  const browser = findBrowser();
  if (!browser) { console.log('SKIP  ブラウザが無いので、この検査は飛ばします'); process.exit(0); }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'subjprobe-'));
  const src = fs.readFileSync(SRC, 'utf8');
  let r = null;
  try {
    const file = path.join(dir, 's0.html');
    fs.writeFileSync(file, src.replace('<body>', () => '<body>' + probeSource()), 'utf8');
    let dom = '';
    try {
      dom = execFileSync(browser, [
        '--headless=new', '--disable-gpu', '--no-sandbox', '--dump-dom',
        '--virtual-time-budget=20000', '--user-data-dir=' + path.join(dir, 'ud'),
        'file:///' + file.replace(/\\/g, '/'),
      ], { encoding: 'utf8', timeout: 90000, maxBuffer: 1 << 26 });
    } catch (e) { dom = (e.stdout || '') + ''; }
    const hits = [...dom.matchAll(new RegExp(MARK + '([A-Za-z0-9+/=]{16,})', 'g'))].map(m => m[1]);
    if (hits.length) { hits.sort((a, b) => b.length - a.length); r = JSON.parse(Buffer.from(hits[0], 'base64').toString('utf8')); }
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
  }
  if (!r) { console.log('FAIL  結果を拾えない'); process.exit(1); }
  if (r.err) { console.log('FAIL  ' + r.err); process.exit(1); }

  const okBefore = (r.before.sjText === r.want) && r.before.sjShown && !r.before.mShown;
  const okAfter  = r.after.mShown && !r.after.sjShown;
  console.log('畳んだとき  件名の字 : ' + JSON.stringify(r.before.sjText));
  console.log('            件名が出ている : ' + r.before.sjShown + ' ／ 本文が出ている : ' + r.before.mShown
            + '  → ' + (okBefore ? 'OK' : '★違う'));
  console.log('開いたとき  本文が出ている : ' + r.after.mShown + ' ／ 件名が出ている : ' + r.after.sjShown
            + '  → ' + (okAfter ? 'OK' : '★違う'));
  console.log('');
  console.log((okBefore && okAfter) ? 'PASS  畳んだ札に件名が出て、開けば本文に替わる' : 'FAIL');
  process.exit((okBefore && okAfter) ? 0 : 1);
}

run();
