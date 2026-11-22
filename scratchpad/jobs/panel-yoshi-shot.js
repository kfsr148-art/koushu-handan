// panel-yoshi-shot.js — ヨシ待ちを出した返事パネルの見本の写しを、雲（ubuntu-latest の headless Chromium）で撮る（2026-11-22・本人の枠 九十）。
//   ＊VAIO ではブラウザを立てない（作法18・41）。job.yml がこの台本の変わった押しで回し、写しを reports/ へ置いて押し戻す。
//   ＊写しの元は panel.html の写し（一時の置き場 koushu-yoshi-shot-*）。本体の panel.html には何も入れない（作法14：写しに probe）。
//     probe は fetch を作り値へ差し替え（state はヨシ待ち）、外へは何も送らない。Date.now は「秒の頭＋FRAME×500ms＋100ms」に留めて、
//     YOSHI_FRAMES の何枚目が出るかを決める（FRAME 0＝親指 yoshi-machi2-t-240.png・FRAME 1＝こぶし yoshi-machi-t-240.png）。
//   ＊視野は iPhone の 390x844（DevTools の Emulation.setDeviceMetricsOverride・mobile:true・deviceScaleFactor 3）。cdp-run.js と同じ起こし方。
//   出る物：reports/panel-yoshi-shot-1.png（親指）・reports/panel-yoshi-shot-2.png（こぶし）・それぞれの頭の枠を拡大した -1-head.png・-2-head.png
//           ＋枠 九十一：版の行だけの写し reports/panel-facts-390.png・-375.png・-320.png（「更新」が最終確認のすぐ後ろか）
//   使い方：node scratchpad/jobs/panel-yoshi-shot.js        （雲）
//           node scratchpad/jobs/panel-yoshi-shot.js --dry  （手元・ブラウザ無し：写しの組み立てと作り値だけ確かめる）
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const DRY = process.argv.includes('--dry');
const VW = 390, VH = 844, DSF = 3, LIMIT_MS = 60000;
const html = fs.readFileSync(path.join(ROOT, 'panel.html'), 'utf8');
const PANEL_VER = (/var PANEL_VER = '([0-9]+)';/.exec(html) || [])[1] || '';
const FRAMES = ((/var YOSHI_FRAMES = \[([^\]]*)\];/.exec(html) || [])[1] || '').split(',').map(s => s.trim().replace(/^'|'$/g, '')).filter(Boolean);
let bad = 0;
const ok = (m) => console.log('  ✓ ' + m), ng = (m) => { console.log('  ✗ ' + m); bad++; };

/* 作り値：ヨシ待ちの state と、ヨシ待ちの札一枚（panel-check.js の ST['ヨシ待ち'] と MIX の形） */
function scene(frame) {
  const now = Math.floor(Date.now() / 1000);
  return {
    frame: frame, panelVer: PANEL_VER,
    state: { stat: 'ヨシ待ち', subj: 'ヨシ待ちの猫を枠に収める（見本）', mikomi: '', startedAt: 0, statAt: now - 700, at: now },
    notices: [{ time: now - 600, title: '🙋 ヨシしてください', message: 'ヨシ待ちの見本（作り値）' }],
    ntfy: [], board: { waiting: [], recent: [] }, usage: {}
  };
}
/* Date.now を留める式（probe と --dry の両方で使う） */
const PIN = 'function (real, f) { return real - (real % 1000) + f * 500 + 100; }';

function probe(sc) {
  return '\n<script>\n(function () {\n  var S = ' + JSON.stringify(sc) + ';\n' + String.raw`
  try { localStorage.clear(); } catch (e) {}
  var pin = ` + PIN + String.raw`, realNow = Date.now.bind(Date);
  Date.now = function () { return pin(realNow(), S.frame); };
  var J = function (o) { return Promise.resolve({ ok: true, status: 200, json: function () { return Promise.resolve(o); }, text: function () { return Promise.resolve(typeof o === 'string' ? o : JSON.stringify(o)); } }); };
  window.fetch = function (u) {   /* 作り値だけを返す。外へは送らない */
    u = String(u);
    if (u.indexOf('panel-ver.txt') >= 0) return J(String(S.panelVer));
    if (u.indexOf('notices.json') >= 0) return J(S.notices);
    if (u.indexOf('board.json') >= 0) return J(S.board);
    if (u.indexOf('seen.json') >= 0) return J({ upto: 0 });
    if (u.indexOf('state.json') >= 0) return J(S.state);
    if (u.indexOf('ntfy-sent.json') >= 0) return J(S.ntfy);
    if (u.indexOf('usage.json') >= 0) return J(S.usage);
    if (u.indexOf('stable') >= 0) return J('1505');
    if (u.indexOf('ver.txt') >= 0) return J('1505');
    return J({});
  };
})();
` + '<' + '/script>\n';
}

function build(dir, frame) {
  const f = path.join(dir, 'p' + frame + '.html');
  fs.writeFileSync(f, html.replace(/<body([^>]*)>/, (m) => m + probe(scene(frame))), 'utf8');
  return f;
}
function copyAssets(dir) {
  fs.copyFileSync(path.join(ROOT, 'panel-core.js'), path.join(dir, 'panel-core.js'));
  const names = Array.from(new Set((html.match(/[A-Za-z0-9_-]+\.png/g) || [])));
  let n = 0; for (const nm of names) { const s = path.join(ROOT, nm); if (fs.existsSync(s)) { fs.copyFileSync(s, path.join(dir, nm)); n++; } }
  return n;
}
function findBrowser() {
  const c = [
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ].filter(p => p && fs.existsSync(p));
  return c[0] || null;
}

/* 一枚を開いて撮る（cdp-run.js と同じ起こし方・内側の上限 LIMIT_MS） */
function shoot(browser, htmlPath, tmp, frame, vw, vh) {
  vw = vw || VW; vh = vh || VH;
  return new Promise((resolve) => {
    const prof = path.join(tmp, 'prof-' + frame + '-' + vw);
    const child = cp.spawn(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0',
      '--user-data-dir=' + prof, '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--mute-audio', 'about:blank'],
      { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
    let done = false, errBuf = '';
    const fin = (r) => { if (done) { return; } done = true; clearTimeout(hard); try { child.kill('SIGKILL'); } catch (e) { } resolve(r); };
    const hard = setTimeout(() => fin({ err: '上限 ' + LIMIT_MS + 'ms で切った' }), LIMIT_MS);
    child.on('exit', () => fin({ err: 'ブラウザが先に落ちた' }));
    child.stderr.on('data', (d) => {
      errBuf += d; const m = /DevTools listening on (ws:\/\/[^\s]+)/.exec(errBuf);
      if (m && !child._started) { child._started = true; run(m[1]).then(fin, (e) => fin({ err: e.message })); }
    });
    async function run(wsUrl) {
      const ws = new WebSocket(wsUrl); let id = 0; const pend = new Map();
      ws.onmessage = (ev) => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } };
      await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('ws')); });
      const send = (method, params, sid) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify(Object.assign({ id: i, method, params: params || {} }, sid ? { sessionId: sid } : {}))); });
      const t = await send('Target.createTarget', { url: 'about:blank' });
      const sid = (await send('Target.attachToTarget', { targetId: t.targetId, flatten: true })).sessionId;
      await send('Page.enable', {}, sid);
      await send('Emulation.setDeviceMetricsOverride', { width: vw, height: vh, deviceScaleFactor: DSF, mobile: true, screenWidth: vw, screenHeight: vh }, sid);
      await send('Page.navigate', { url: 'file:///' + htmlPath.replace(/\\/g, '/') }, sid);
      await new Promise((r) => setTimeout(r, 3000));   /* 取得と runCatTick（100ms）が回るのを待つ */
      const ev = await send('Runtime.evaluate', { returnByValue: true, expression: "(function(){var e=document.getElementById('runcat');if(!e){return null;}var s=getComputedStyle(e),r=e.getBoundingClientRect();return {src:e.getAttribute('src'),cls:e.className,fit:s.objectFit,bg:s.backgroundColor,bodyBg:getComputedStyle(document.body).backgroundColor,w:r.width,h:r.height,x:r.left,y:r.top,nw:e.naturalWidth,nh:e.naturalHeight,head:(document.getElementById('headWait')||{}).textContent||'',iw:window.innerWidth,facts:(function(){var f=document.querySelector('.facts'),a=document.getElementById('fSeen'),b=document.getElementById('stat');if(!f||!a||!b){return null;}var R=function(e){var r=e.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height};};return {box:R(f),seen:R(a),stat:R(b),txt:f.innerText.trim(),ml:getComputedStyle(b).marginLeft};})()};})()" }, sid);
      const info = ev && ev.result ? ev.result.value : null;
      const full = await send('Page.captureScreenshot', { format: 'png' }, sid);
      let headShot = null;
      if (info) { headShot = await send('Page.captureScreenshot', { format: 'png', clip: { x: Math.max(0, info.x - 10), y: Math.max(0, info.y - 10), width: info.w + 20, height: info.h + 20, scale: 2 } }, sid); }
      let factsShot = null;
      if (info && info.facts) { const fb = info.facts.box; /* 頭の帯は sticky なので巻き上げずに captureBeyondViewport で撮る（座標は文書の上から） */ factsShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: Math.max(0, fb.t - 6), width: vw, height: fb.h + 12, scale: 1 } }, sid); }
      try { await send('Browser.close', {}); } catch (e) { }
      return { info, full: full.data, head: headShot ? headShot.data : null, facts: factsShot ? factsShot.data : null };
    }
  });
}

(async function main() {
  console.log('ヨシ待ちの見本の写し（panel v' + PANEL_VER + '・' + VW + 'x' + VH + '・倍率 ' + DSF + '）');
  if (FRAMES.length !== 2) { ng('YOSHI_FRAMES が二枚でない：' + FRAMES.join('・')); }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-yoshi-shot-'));   /* 目印 koushu-（作法35：置き去りの片付けが拾う） */
  try {
    const nA = copyAssets(tmp);
    const pages = [0, 1].map((fr) => build(tmp, fr));
    if (DRY) {
      /* 手元の確かめ（ブラウザ無し）：写しの組み立て・作り値・Date.now の留め方で何枚目が出るか */
      const pin = new Function('return ' + PIN)();
      for (const fr of [0, 1]) {
        const s = fs.readFileSync(pages[fr], 'utf8'), real = Date.now();
        const idx = Math.floor(pin(real, fr) / 500) % FRAMES.length, near = Math.abs(pin(real, fr) - real) < 1000;
        if (s.indexOf('var S = ') > 0 && s.indexOf('"stat":"ヨシ待ち"') > 0 && s.indexOf('"panelVer":"' + PANEL_VER + '"') > 0 && s.indexOf('<script src="panel-core.js?_v=' + PANEL_VER + '"></script>') > 0) { ok('FRAME ' + fr + '：写しに probe（state ヨシ待ち・panel-ver ' + PANEL_VER + '）が入り、panel-core.js?_v=' + PANEL_VER + ' を読む'); } else { ng('FRAME ' + fr + '：写しの組み立てが違う'); }
        if (idx === fr && near) { ok('FRAME ' + fr + '：Date.now の留め方で YOSHI_FRAMES[' + idx + ']＝' + FRAMES[idx] + ' が出る（本当の刻との差は1秒未満）'); } else { ng('FRAME ' + fr + '：出る絵が違う（' + idx + '）'); }
      }
      for (const nm of FRAMES) { if (fs.existsSync(path.join(tmp, nm))) { ok('絵 ' + nm + ' を写しの置き場へ写した'); } else { ng('絵 ' + nm + ' が無い'); } }
      ok('写しの置き場へ写した絵 ' + nA + '枚・panel-core.js');
      console.log(bad ? 'FAIL ' + bad + '件' : '全てPASS（--dry：ブラウザは立てていない）');
      return;
    }
    const br = findBrowser();
    if (!br) { ng('ブラウザが無い（撮れない）'); return; }
    fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
    for (const fr of [0, 1]) {
      const r = await shoot(br, pages[fr], tmp, fr), no = fr + 1;
      if (!r || r.err || !r.full) { ng('FRAME ' + fr + '：撮れなかった（' + (r && r.err) + '）'); continue; }
      const out = path.join(ROOT, 'reports', 'panel-yoshi-shot-' + no + '.png');
      fs.writeFileSync(out, Buffer.from(r.full, 'base64'));
      if (r.head) { fs.writeFileSync(path.join(ROOT, 'reports', 'panel-yoshi-shot-' + no + '-head.png'), Buffer.from(r.head, 'base64')); }
      const i = r.info || {};
      console.log('  写し ' + path.relative(ROOT, out) + '：' + JSON.stringify(i));
      const want = FRAMES[fr];
      if (i.src === want && i.cls === 'yoshi-fit' && i.fit === 'contain' && i.w === 80 && i.h === 80 && i.nw === 240 && i.nh === 240 && i.bg === i.bodyBg && i.iw === VW) { ok('FRAME ' + fr + '：' + want + '・class yoshi-fit・object-fit contain・枠 80x80・絵 240x240・箱の地＝body の地（' + i.bg + '）・頭の字「' + i.head + '」'); }
      else { ng('FRAME ' + fr + '：出方が違う（' + JSON.stringify(i) + '）'); }
    }
    /* 本人の枠 九十一：版の行（.facts）の写しを 390・375・320 の幅で。「更新 HH:MM」は「最終確認 HH:MM」のすぐ後ろ（間 14px）・右の端へ寄せない */
    for (const [w, h] of [[390, 844], [375, 812], [320, 568]]) {
      const r = await shoot(br, pages[0], tmp, 0, w, h);
      if (!r || r.err || !r.facts || !r.info || !r.info.facts) { ng(w + 'px：版の行が撮れなかった（' + (r && r.err) + '）'); continue; }
      const out = path.join(ROOT, 'reports', 'panel-facts-' + w + '.png');
      fs.writeFileSync(out, Buffer.from(r.facts, 'base64'));
      const F = r.info.facts, gap = Math.round(F.stat.l - F.seen.r), same = Math.abs(F.stat.t - F.seen.t) <= 1;
      console.log('  写し ' + path.relative(ROOT, out) + '：' + JSON.stringify(F));
      if (same && Math.abs(gap - 14) <= 2 && F.ml === '0px' && r.info.iw === w) { ok(w + 'px：版の行「' + F.txt.split(String.fromCharCode(10)).join(' ／ ') + '」・「更新」は最終確認のすぐ後ろ（間 ' + gap + 'px・margin-left 0px）'); }
      else { ng(w + 'px：版の行の並びが違う（同じ段 ' + same + '・間 ' + gap + 'px・margin-left ' + F.ml + '）'); }
    }
    console.log(bad ? 'FAIL ' + bad + '件' : '全てPASS');
  } finally {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
    process.exitCode = bad ? 1 : 0;
  }
})();
