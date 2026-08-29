/* 返事パネルの「まとめて写す」の件数を、写しに probe を差して実測する道具（作法14）。
 *
 *   何を測るか
 *     ・押す前に釦へ出ている数（読み手が見る数）
 *     ・押した直後に釦へ出る数（「N件 写した」）
 *     ・実際に写しへ入った札の数（クリップボードへ渡った字を数える）
 *     この三つを場面ごとに並べる。
 *
 *   やり方
 *     ・panel.html を一時ディレクトリへ写し、<body> の直後に probe を差し込む。
 *     ・fetch を場面ごとの作り物へ差し替える（notices / board / seen / state / ver）。
 *     ・navigator.clipboard.writeText を横取りして、渡った字を控える。
 *     ・釦を押し、結果を base64 の目印つきで DOM へ置く。
 *     ・headless の Edge / Chrome ＋ --dump-dom で吐かせ、目印から拾って読む。
 *     ・終わったら写しごと消す。本体には一片も残さない。
 *
 *   使い方   node panel-probe.js [--keep]
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, 'panel.html');
const MARK = 'PROBE-RESULT-B64:';

/* ---- ブラウザの在り処 ---- */
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

/* ---- 場面 ----
 *   甲   数える処理と写す処理のあいだに15秒の読み直しが挟まった
 *   乙   写せなかった（クリップボードが断った）
 *   丙0  あなた待ち・直近に終わった仕事の枠が0件
 *   丙2  同じ枠が1件以上（待ち1・直近1）
 *   丁   済んだ札の箱に未達がある（seen で既読になった札が混じる）
 */
const N = (t, title, msg) => ({ time: t, title: title, message: msg });
const BASE = [
  N(1756400000, '🙋 ヨシしてください', '虎の親補正の写しを層別へ揃えました。'),
  N(1756400100, '✅ 終わりました（返事不要）', '較正-2 の五数要約を出しました。'),
  N(1756400200, '👀 異常です（待てば戻ります）', '生存記録に穴がありました。'),
  N(1756400300, '📥 返事を受けました', '指示を受け取りました。'),
  N(1756400400, '✅ 終わりました（返事不要）', '較正-3 の層別×五分位を出しました。'),
];
const LATER = BASE.concat([N(1756400500, '✅ 終わりました（返事不要）', '読み直しで増えた一件。')]);
const BOARD2 = {
  waiting: [{ at: '2026-08-29 11:31', name: '較正-1の線引き確定', no: 'y0829-tora' }],
  recent: [{ name: '較正-6 材料ごとの発火件数', no: '較正-6' }],
};
const BOARD0 = { waiting: [], recent: [] };

const SCENES = [
  { key: '甲',  name: '数えたあと写す前に15秒の読み直しが挟まる', notices: BASE, notices2: LATER, board: BOARD2, wait: 16000, clipFail: false, seen: 0 },
  { key: '乙',  name: '写せなかった（クリップボードが断る）',     notices: BASE, board: BOARD2, wait: 0, clipFail: true,  seen: 0 },
  { key: '丙0', name: '板の二枠が0件',                            notices: BASE, board: BOARD0, wait: 0, clipFail: false, seen: 0 },
  { key: '丙2', name: '板の二枠が1件以上（待ち1・直近1）',        notices: BASE, board: BOARD2, wait: 0, clipFail: false, seen: 0 },
  { key: '丁',  name: '済んだ札の箱に未達がある（既読の札が混じる）', notices: BASE, board: BOARD2, wait: 0, clipFail: false, seen: 1756400200 },
];

/* ---- probe の中身 ---- */
function probeSource(scene) {
  return '\n<script>\n(function () {\n'
    + '  var SCENE = ' + JSON.stringify(scene) + ';\n'
    + String.raw`
  var CAP = { clip: null, before: null, nPull: 0 };
  window.__probe = CAP;
  try { localStorage.clear(); } catch (e) {}

  var J = function (o) {
    return Promise.resolve({ ok: true, status: 200,
      json: function () { return Promise.resolve(o); },
      text: function () { return Promise.resolve(typeof o === 'string' ? o : JSON.stringify(o)); } });
  };
  window.fetch = function (u) {
    u = String(u);
    if (u.indexOf('panel-ver.txt') >= 0) return J('73');
    if (u.indexOf('notices.json') >= 0) {
      CAP.nPull++;
      /* 二度目より後は、読み直しで一件増えた姿を返す（場面 甲 だけ） */
      var arr = (SCENE.notices2 && CAP.nPull >= 2) ? SCENE.notices2 : SCENE.notices;
      return J(arr);
    }
    if (u.indexOf('board.json') >= 0) return J(SCENE.board);
    if (u.indexOf('seen.json') >= 0)  return J({ upto: SCENE.seen || 0 });
    if (u.indexOf('state.json') >= 0) return J({ at: '2026-08-29 12:00:00', word: '作業中', subject: '実測', mikomi: '45分' });
    if (u.indexOf('usage.json') >= 0) return J({});
    if (u.indexOf('stable') >= 0)     return J('1427');
    if (u.indexOf('ver.txt') >= 0)    return J('1428');
    return Promise.reject(new Error('probe: 想定外の口 ' + u));
  };

  try {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: function (t) {
        if (SCENE.clipFail) { return Promise.reject(new Error('probe: 写せない')); }
        CAP.clip = t; return Promise.resolve();
      } }
    });
  } catch (e) {}

  function out(o) {
    var d = document.createElement('div');
    d.id = 'probeOut';
    d.textContent = 'PROBE-RESULT-B64:' + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
    document.body.appendChild(d);
  }

  /* 写しに入った札の数を、写った字から数える。
     ・一件一行の形も全文の形も、頭は必ず「HH:MM ／ 種別 ／ 件名」。
     ・板の二枠も同じ形（待ちは時刻あり・直近は時刻なし）。
     ・先頭2行（URL・現況）と、締めの「ほかN件」は札ではない。 */
  function countCards(text) {
    if (!text) return 0;
    var lines = String(text).split('\n');
    var n = 0;
    for (var i = 2; i < lines.length; i++) {
      if (/^ほか[0-9]+件/.test(lines[i])) continue;
      if (lines[i].indexOf(' ／ ') >= 0) n++;
    }
    return n;
  }

  function num(s) { var m = String(s || '').match(/([0-9]+)/); return m ? Number(m[1]) : null; }

  window.addEventListener('load', function () {
    setTimeout(function () {
      var btn = document.getElementById('btnCopyBoard');
      if (!btn) { out({ scene: SCENE.key, name: SCENE.name, err: '釦が無い' }); return; }
      CAP.before = btn.textContent;   /* 読み手が見る数（押す前） */
      setTimeout(function () {
        var mid = btn.textContent;    /* 読み直しの後、押す直前の字 */
        btn.click();
        setTimeout(function () {
          out({
            scene: SCENE.key, name: SCENE.name,
            before: CAP.before, mid: mid, after: btn.textContent,
            beforeN: num(CAP.before), midN: num(mid), afterN: num(btn.textContent),
            copied: countCards(CAP.clip),
            clipLen: CAP.clip ? CAP.clip.length : 0
          });
        }, 400);
      }, SCENE.wait || 0);
    }, 1200);
  });
})();
</script>
`;
}

/* ---- 走らせる ---- */
function run() {
  const browser = findBrowser();
  if (!browser) {
    console.log('SKIP  ブラウザ（Edge / Chrome）が無いので、この検査は飛ばします');
    process.exit(0);
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'panelprobe-'));
  const keep = process.argv.indexOf('--keep') >= 0;
  const src = fs.readFileSync(SRC, 'utf8');
  const rows = [];
  try {
    SCENES.forEach(function (scene, k) {
      const file = path.join(dir, 'p' + k + '.html');
      /* probe は panel の script より前に置く（fetch を差し替えてから読ませる） */
      fs.writeFileSync(file, src.replace('<body>', () => '<body>' + probeSource(scene)), 'utf8');
      let dom = '';
      try {
        dom = execFileSync(browser, [
          '--headless=new', '--disable-gpu', '--no-sandbox', '--dump-dom',
          '--virtual-time-budget=' + (25000 + (scene.wait || 0)),
          '--user-data-dir=' + path.join(dir, 'ud' + k),
          'file:///' + file.replace(/\\/g, '/'),
        ], { encoding: 'utf8', timeout: 90000, maxBuffer: 1 << 26 });
      } catch (e) { dom = (e.stdout || '') + ''; }
      /* 目印は probe の台本そのものにも写っているので、拾えた中でいちばん長いものを採る。 */
      const hits = [...dom.matchAll(new RegExp(MARK + '([A-Za-z0-9+/=]{16,})', 'g'))].map(m => m[1]);
      if (!hits.length) { rows.push({ scene: scene.key, name: scene.name, err: '結果を拾えない' }); return; }
      hits.sort((a, b) => b.length - a.length);
      rows.push(JSON.parse(Buffer.from(hits[0], 'base64').toString('utf8')));
    });
  } finally {
    if (keep) console.log('（写しを残しました: ' + dir + '）');
    else { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} }
  }

  const w = s => { let n = 0; for (const c of String(s)) n += (c.codePointAt(0) > 0x2000 ? 2 : 1); return n; };
  const pad = (s, n) => String(s) + ' '.repeat(Math.max(1, n - w(s)));
  console.log(pad('場面', 6) + pad('中身', 42) + pad('押す前', 22) + pad('押す直前', 22) + pad('押した後', 16) + pad('写しの札', 10) + 'ずれ');
  console.log('─'.repeat(126));
  let bad = 0;
  for (const r of rows) {
    if (r.err) { console.log(pad(r.scene, 6) + pad(r.name, 42) + r.err); bad++; continue; }
    /* 写せなかった回は数を出さない（「写せません」）。写しも0で、札も落とさないのが正。
       この回だけは数の突き合わせではなく、その形になっているかを見る。 */
    let gap;
    if (r.afterN === null) {
      gap = (String(r.after).indexOf('写せません') >= 0 && r.copied === 0) ? '—（数は出さない）' : '★形が違う';
      if (gap === '★形が違う') bad++;
    } else {
      gap = r.afterN - r.copied;
      if (gap !== 0) bad++;
    }
    console.log(pad(r.scene, 6) + pad(r.name, 42) + pad(r.before, 22) + pad(r.mid, 22) + pad(r.after, 16) + pad(r.copied, 10) + gap);
  }
  console.log('');
  console.log(bad === 0 ? 'PASS  全通りで釦の字と写しの実数が一致' : 'FAIL  ' + bad + ' 通りでずれている');
  process.exit(bad === 0 ? 0 : 1);
}

run();
