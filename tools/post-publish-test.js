#!/usr/bin/env node
/* post-publish-test.js — 公開の後の試し（2026-11-26・橋の枠 三百四十七①・本人の決め）。
   公開されている本物のページ（Pages で配られている koushu-handan.html）を取ってきて、配牌を数局打ち（本体の判定ボタンを押す）、判定カードと助言が出るか・画面に赤いエラーが無いかを見る。
   ＊読むだけ。本体には触らない。取ってきた公開の物の写しに探索用の一片（probe）を差し込んで headless Chrome で駆動する（作法14）。差し込むのは本体の包みの内側（window.shuffleHand の行の後ろ）。
   ＊終了コード：0＝通った／10＝試しに落ちた（判定カードが出ない・助言が空・赤いエラーがある）／20＝試しの道具の側が動かなかった（ブラウザが無い・公開の物が取れない・結果を取り出せない）。
     自動の戻し（post-publish.yml）は 10 のときだけ、二度続けて落ちた時に動く。20 は戻さない（試しの側の不調で良い版を戻さないため）。
   使い方  node tools/post-publish-test.js <公開ページの URL（…/koushu-handan.html を含む）> <結果を書く json> [局数=5]
   ＊作り値：PPT_LOCAL＝公開の代わりに読む本体の道（試しの試し）／PPT_BREAK＝1 なら probe の中で judge の結果を壊して『落ちる』形にする（戻しの試し用）。 */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const URLX = process.argv[2] || '', OUTJ = process.argv[3] || 'post-publish-result.json', N = Number(process.argv[4]) || 5;
function out(o, code) { try { fs.writeFileSync(OUTJ, JSON.stringify(o, null, 1)); } catch (e) { } console.log(JSON.stringify(o).slice(0, 600)); process.exit(code); }
let src = '';
try { src = process.env.PPT_LOCAL ? fs.readFileSync(process.env.PPT_LOCAL, 'utf8') : cp.execFileSync('curl', ['-fsSL', '--max-time', '60', '-H', 'Cache-Control: no-cache', URLX + (URLX.includes('?') ? '&' : '?') + '_=' + Date.now()], { encoding: 'utf8', maxBuffer: 1 << 28 }); }
catch (e) { out({ kind: 'infra', why: '公開の本体が取れない：' + String(e.message).slice(0, 100) }, 20); }
if (!/<html/i.test(src) || src.indexOf('window.shuffleHand = shuffleHand;') < 0) { out({ kind: 'infra', why: '公開の物が本体の形で読めない（差し込む行が無い・長さ ' + src.length + '）' }, 20); }
const ver = (/data-ver="([0-9]+)"/.exec(src) || [])[1] || '?';
const PROBE = `
window.__ppErr = [];
window.addEventListener('error', function(e){ window.__ppErr.push(String(e && e.message || e).slice(0, 120)); });
window.addEventListener('unhandledrejection', function(e){ window.__ppErr.push('rejection:' + String(e && e.reason && e.reason.message || e && e.reason || '').slice(0, 100)); });
window.addEventListener('load', function(){ setTimeout(function(){
  var res = { rows: [], errs: [], err: null };
  try {
    try { window.closeTitleScreen(); } catch (e0) { }
    for (var i = 0; i < ${N}; i++) {
      shuffleHand();
      document.getElementById('judgeBtn').click();
      var card = document.querySelector('.verdict-card');
      var txt = card ? (card.textContent || '').replace(/\\s+/g, ' ') : '';
      var adv = (window._advCtx ? 1 : 0);
      ${process.env.PPT_BREAK === '1' ? "txt = '';" : ''}
      res.rows.push({ n: i + 1, tiles: tilesToInput(hand), card: !!card, len: txt.length, adv: adv });
    }
  } catch (e) { res.err = String(e && e.message || e); }
  res.errs = (window.__ppErr || []).slice(0, 8);
  var d = document.createElement('div'); d.id = 'khpp';
  d.textContent = 'KHPP_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(res)))) + 'KHPP_END';
  document.body.appendChild(d);
}, 800); });
`;
const browser = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(p => p && fs.existsSync(p))[0];
if (!browser) { out({ kind: 'infra', why: 'ブラウザが無い' }, 20); }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-pp-'));
const probe = path.join(tmp, 'probe.html');
fs.writeFileSync(probe, src.replace('window.shuffleHand = shuffleHand;', () => 'window.shuffleHand = shuffleHand;' + PROBE), 'utf8');
const r = cp.spawnSync(browser, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--window-size=844,390', '--mute-audio', '--user-data-dir=' + path.join(tmp, 'prof'), '--virtual-time-budget=60000', '--dump-dom', 'file:///' + probe.replace(/\\/g, '/')], { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024, timeout: 120000 });
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
const hit = /KHPP_BEGIN([A-Za-z0-9+/=]+)KHPP_END/.exec(String(r.stdout || ''));
if (!hit) { out({ kind: 'infra', ver: ver, why: '結果を取り出せない（ブラウザの出力に目印が無い）' }, 20); }
const res = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8'));
const bad = [];
if (res.err) { bad.push('試しの中で例外：' + res.err); }
res.rows.forEach(x => { if (!x.card) { bad.push('局' + x.n + '：判定カードが出ない（配牌 ' + x.tiles + '）'); } else if (x.len < 30) { bad.push('局' + x.n + '：判定カードの字が短すぎる（' + x.len + '字）'); } else if (!x.adv) { bad.push('局' + x.n + '：助言が組まれていない'); } });
(res.errs || []).forEach(e => bad.push('画面のエラー：' + e));
if (!res.rows.length && !res.err) { bad.push('局が一つも打てなかった'); }
const o = { kind: bad.length ? 'fail' : 'ok', ver: ver, rows: res.rows.length, bad: bad.slice(0, 10), at: new Date().toISOString() };
out(o, bad.length ? 10 : 0);
