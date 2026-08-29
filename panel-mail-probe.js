/* 状態の帯の「郵便受け 未取り込み N件」を、写しに probe を差して実測する道具（作法14）。
 *
 *   何を測るか
 *     ・mailUnread が 0 のとき …… 行ごと畳まれているか（class に hide が付き、字が空か）
 *     ・mailUnread が N のとき …… 「郵便受け 未取り込み N件」と出ているか
 *
 *   やり方は panel-probe.js と同じ。panel.html を一時ディレクトリへ写し、
 *   <body> の直後へ probe を差して fetch を作り物へ替え、headless の Edge/Chrome を
 *   --dump-dom で回して、base64 の目印から拾う。終わったら写しごと消す。
 *
 *   使い方   node panel-mail-probe.js
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, 'panel.html');
const MARK = 'MAILPROBE-B64:';

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

/* 場面：未取り込みの件数だけを変える。ほかの値は同じにする。 */
const SCENES = [
  { key: '0件', mail: 0 },
  { key: '1件', mail: 1 },
  { key: '3件', mail: 3 },
];

function probeSource(scene) {
  return '\n<script>\n(function () {\n'
    + '  var SCENE = ' + JSON.stringify(scene) + ';\n'
    + String.raw`
  try { localStorage.clear(); } catch (e) {}
  var J = function (o) {
    return Promise.resolve({ ok: true, status: 200,
      json: function () { return Promise.resolve(o); },
      text: function () { return Promise.resolve(typeof o === 'string' ? o : JSON.stringify(o)); } });
  };
  window.fetch = function (u) {
    u = String(u);
    if (u.indexOf('panel-ver.txt') >= 0) return J('74');
    if (u.indexOf('notices.json') >= 0)  return J([]);
    if (u.indexOf('board.json') >= 0)    return J({ waiting: [], recent: [] });
    if (u.indexOf('seen.json') >= 0)     return J({ upto: 0 });
    if (u.indexOf('state.json') >= 0)    return J({
      at: Math.floor(Date.now() / 1000), statAt: Math.floor(Date.now() / 1000),
      stat: '作業中', subj: '郵便詰まりの実測', mikomi: '不明',
      mailUnread: SCENE.mail });
    if (u.indexOf('usage.json') >= 0)    return J({});
    if (u.indexOf('stable') >= 0)        return J('1428');
    if (u.indexOf('ver.txt') >= 0)       return J('1428');
    return Promise.reject(new Error('probe: 想定外の口 ' + u));
  };
  function out(o) {
    var d = document.createElement('div');
    d.id = 'mailProbeOut';
    d.textContent = 'MAILPROBE-B64:' + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
    document.body.appendChild(d);
  }
  window.addEventListener('load', function () {
    setTimeout(function () {
      var el = document.getElementById('stMail');
      if (!el) { out({ scene: SCENE.key, err: '#stMail が無い' }); return; }
      var cs = window.getComputedStyle(el);
      out({
        scene: SCENE.key, mail: SCENE.mail,
        text: el.textContent || '',
        cls: el.className || '',
        display: cs.display,
        h: Math.round(el.getBoundingClientRect().height)
      });
    }, 2500);
  });
})();
</script>
`;
}

function run() {
  const browser = findBrowser();
  if (!browser) { console.log('SKIP  ブラウザが無いので、この検査は飛ばします'); process.exit(0); }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mailprobe-'));
  const src = fs.readFileSync(SRC, 'utf8');
  const rows = [];
  try {
    SCENES.forEach(function (scene, k) {
      const file = path.join(dir, 'm' + k + '.html');
      fs.writeFileSync(file, src.replace('<body>', () => '<body>' + probeSource(scene)), 'utf8');
      let dom = '';
      try {
        dom = execFileSync(browser, [
          '--headless=new', '--disable-gpu', '--no-sandbox', '--dump-dom',
          '--virtual-time-budget=20000',
          '--user-data-dir=' + path.join(dir, 'ud' + k),
          'file:///' + file.replace(/\\/g, '/'),
        ], { encoding: 'utf8', timeout: 90000, maxBuffer: 1 << 26 });
      } catch (e) { dom = (e.stdout || '') + ''; }
      const hits = [...dom.matchAll(new RegExp(MARK + '([A-Za-z0-9+/=]{16,})', 'g'))].map(m => m[1]);
      if (!hits.length) { rows.push({ scene: scene.key, err: '結果を拾えない' }); return; }
      hits.sort((a, b) => b.length - a.length);
      rows.push(JSON.parse(Buffer.from(hits[0], 'base64').toString('utf8')));
    });
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
  }

  const w = s => { let n = 0; for (const c of String(s)) n += (c.codePointAt(0) > 0x2000 ? 2 : 1); return n; };
  const pad = (s, n) => String(s) + ' '.repeat(Math.max(1, n - w(s)));
  console.log(pad('場面', 8) + pad('出た字', 30) + pad('class', 14) + pad('display', 10) + pad('高さ', 8) + '判定');
  console.log('─'.repeat(84));
  let bad = 0;
  for (const r of rows) {
    if (r.err) { console.log(pad(r.scene, 8) + r.err); bad++; continue; }
    let ok;
    if (r.mail === 0) ok = (r.text === '' && /\bhide\b/.test(r.cls) && r.h === 0);
    else ok = (r.text === '郵便受け 未取り込み ' + r.mail + '件' && !/\bhide\b/.test(r.cls) && r.h > 0);
    if (!ok) bad++;
    console.log(pad(r.scene, 8) + pad(r.text || '（空）', 30) + pad(r.cls, 14)
              + pad(r.display, 10) + pad(r.h + 'px', 8) + (ok ? 'OK' : '★違う'));
  }
  console.log('');
  console.log(bad === 0 ? 'PASS  0件は行ごと畳み、1件以上は件数つきで出る' : 'FAIL  ' + bad + ' 通りで違う');
  process.exit(bad === 0 ? 0 : 1);
}

run();
