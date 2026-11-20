// cdp-run.js — panel-check.js の run() が使う、スマホ幅の本物の視野で一枚を開いて測る小さな手（2026-11-20 本人の枠）。
//   ＊前は --window-size で幅を与えていたが、Chrome／Edge の headless は窓を約500pxより狭くできず、iPhone 幅（390・375・320）を一度も試していなかった。
//   ＊ここでは DevTools プロトコルの Emulation.setDeviceMetricsOverride（mobile:true）で視野そのものを指定した幅・高さにする。
//   使い方：node cdp-run.js <ブラウザ> <html> <幅> <高さ> <作業の置き場> [<待つ上限の秒>]   → 標準出力へ、probe が DOM に置いた目印つきの文字列
//   ＊probe は DOM に「PANELCHK-B64:<base64>」を置く。見つかるまで 0.2 秒おきに読み、上限で諦める（何も出さない）。
//   ＊Node 22 以降の標準の WebSocket を使う（雲は node 24）。終わったらブラウザを必ず落とす。
'use strict';
const cp = require('child_process'), path = require('path');
const [browser, htmlPath, W, H, tmp, limitS] = process.argv.slice(2);
const MARK = 'PANELCHK-B64:';
const vw = Number(W), vh = Number(H), LIMIT = (Number(limitS) || 40) * 1000;
const prof = path.join(tmp, 'prof-cdp-' + process.pid);
const child = cp.spawn(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--remote-debugging-port=0', '--user-data-dir=' + prof, '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--mute-audio', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
let finished = false;
const bye = (code) => { if (finished) { return; } finished = true; try { child.kill('SIGKILL'); } catch (e) { } setTimeout(() => process.exit(code), 50); };
const hardStop = setTimeout(() => bye(0), LIMIT + 15000);
let errBuf = '';
child.stderr.on('data', (d) => {
  errBuf += d;
  const m = /DevTools listening on (ws:\/\/[^\s]+)/.exec(errBuf);
  if (m && !child._started) { child._started = true; start(m[1]).catch(() => bye(0)); }
});
child.on('exit', () => { if (!finished) { setTimeout(() => bye(0), 100); } });

async function start(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pend = new Map();
  ws.onmessage = (ev) => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } };
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('ws')); });
  const send = (method, params, sessionId) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify(Object.assign({ id: i, method, params: params || {} }, sessionId ? { sessionId } : {}))); });
  const t = await send('Target.createTarget', { url: 'about:blank' });
  const a = await send('Target.attachToTarget', { targetId: t.targetId, flatten: true });
  const sid = a.sessionId;
  await send('Page.enable', {}, sid);
  await send('Emulation.setDeviceMetricsOverride', { width: vw, height: vh, deviceScaleFactor: 1, mobile: true, screenWidth: vw, screenHeight: vh }, sid);
  await send('Page.navigate', { url: 'file:///' + htmlPath.replace(/\\/g, '/') }, sid);
  const t0 = Date.now(); let out = '';
  while (Date.now() - t0 < LIMIT) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const r = await send('Runtime.evaluate', { expression: "(function(){var m=/" + MARK + "([A-Za-z0-9+\\/=]+)/.exec(document.documentElement.outerHTML);return m?m[1]:'';})()", returnByValue: true }, sid);
      if (r && r.result && r.result.value) { out = r.result.value; break; }
    } catch (e) { /* 読み込み中 */ }
  }
  if (out) { process.stdout.write(MARK + out + '\n'); }
  try { await send('Browser.close', {}); } catch (e) { }
  clearTimeout(hardStop);
  bye(0);
}
