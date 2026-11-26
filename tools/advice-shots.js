#!/usr/bin/env node
/* advice-shots.js — 判定カードの絵（iPhone の幅 390px）と、字の枠のはみ出し・切れの機械の検査（2026-11-26・枠 三百四十二①・本人の決め）。
   決まった30局（advice-common.js の khFixed＝advice-sample.js の「固定」と同じ配牌・人格・方言・くじ）を本体の画面で判定し、判定カード（.verdict-card）を
   iPhone の横向き 844x390 の窓で撮り（本体は横向き専用で、縦の 390px だと『横向き専用』の幕になる）、はみ出し（右端が窓の外）・切れ（overflow が隠れていて中身が溢れている）を
   本体の検査で一番狭い 568x320 の窓で調べる。
   ＊読むだけ。本体には触らない（写しに probe を差し込む・作法14）。VAIO では回さない（雲の advice-sample.yml が回す）。
   ＊出し先 <senko>/advice-shots/<版>/fixed-NN.png と report.json（局ごとの印）。新しい5版だけ残す（古い物は workflow が消す）。
   使い方  node tools/advice-shots.js <handan の置き場> <出し先の senko フォルダ> */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const common = require('./advice-common.js');
const ROOT = path.resolve(process.argv[2] || '.'), OD = path.resolve(process.argv[3] || '.'), NF = 30;
const src = fs.readFileSync(path.join(ROOT, 'koushu-handan.html'), 'utf8');
const ver = (fs.readFileSync(path.join(ROOT, 'ver.txt'), 'utf8').match(/[0-9]+/) || ['?'])[0];
const PROBE = `
${common.FIXED_JS}
window.addEventListener('load', function(){ setTimeout(function(){
  var res = { err: null, w: window.innerWidth, issues: [], card: false };
  try {
    var idx = Number((location.hash || '#0').replace('#', '')) || 0;
    var dials = [''].concat(Object.keys(ADV_DIALECT));
    try { window.closeTitleScreen(); } catch (e0) { }   /* タイトル画面を閉じて判定の画面へ */
    var f = khFixed(idx, ADV_TONE_KEYS, dials);
    document.getElementById('qiText').value = tilesToInput(f.tiles);
    rebuildHand();
    currentTone = f.tone; currentDialect = f.dial;
    khSeed(idx);
    document.getElementById('judgeBtn').click();
    khUnseed();
    setTimeout(function(){
      try {
        var card = document.querySelector('.verdict-card');
        res.card = !!card;
        if (card) {
          card.scrollIntoView();
          var W = window.innerWidth;
          var all = [card].concat([].slice.call(card.querySelectorAll('*')));
          all.forEach(function(el){
            var r = el.getBoundingClientRect(), cs = getComputedStyle(el);
            if (r.width === 0 && r.height === 0) return;
            var tag = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '');
            var txt = (el.textContent || '').replace(/\\s+/g, ' ').slice(0, 24);
            if (r.right > W + 1 || r.left < -1) res.issues.push('はみ出し：' + tag + '（右端 ' + Math.round(r.right) + '／窓 ' + W + '）「' + txt + '」');
            else if (cs.overflowX === 'hidden' && cs.textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 4) res.issues.push('切れ：' + tag + '（中身 ' + el.scrollWidth + '／枠 ' + el.clientWidth + '）「' + txt + '」');
          });
          if (document.documentElement.scrollWidth > W + 1) res.issues.push('横溢れ：ページの幅 ' + document.documentElement.scrollWidth + '／窓 ' + W);
          res.issues = res.issues.slice(0, 6);
        }
      } catch (e) { res.err = String(e && e.message || e); }
      var d = document.createElement('div'); d.id = 'khsh'; d.style.cssText = 'position:fixed;left:0;bottom:0;font-size:1px;color:transparent';
      d.textContent = 'KHSH_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(res)))) + 'KHSH_END';
      document.body.appendChild(d);
    }, 700);
  } catch (e) { res.err = String(e && e.message || e); var d2 = document.createElement('div'); d2.textContent = 'KHSH_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(res)))) + 'KHSH_END'; document.body.appendChild(d2); }
}, 600); });
`;
const browser = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(p => p && fs.existsSync(p))[0];
if (!browser) { console.error('ブラウザが無い'); process.exit(2); }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-shots-'));
const probe = path.join(tmp, 'probe.html');
fs.writeFileSync(probe, src.replace('window.shuffleHand = shuffleHand;', () => 'window.shuffleHand = shuffleHand;' + PROBE), 'utf8');
const OUTD = path.join(OD, 'advice-shots', ver);
fs.mkdirSync(OUTD, { recursive: true });
/* 本体は横向き専用（縦だと『横向き専用』の幕が出る）ので、iPhone の横向き（844x390）で絵を撮り、検査は本体の検査で一番狭い 568x320 で行う */
const base = sz => ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--window-size=' + sz, '--force-device-scale-factor=1', '--mute-audio'];
const rep = [], t0 = Date.now();
const limit = Number(process.env.SHOTS_N) || NF;
for (let i = 0; i < limit; i++) {
  if (Date.now() - t0 > 600000) { rep.push({ n: i + 1, skip: '時間切れ（10分）' }); continue; }
  const url = 'file:///' + probe.replace(/\\/g, '/') + '#' + i;
  const nn = String(i + 1).padStart(2, '0');
  const r1 = cp.spawnSync(browser, base('568,320').concat(['--user-data-dir=' + path.join(tmp, 'p1-' + i), '--virtual-time-budget=15000', '--dump-dom', url]), { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024, timeout: 60000 });
  const hit = /KHSH_BEGIN([A-Za-z0-9+/=]+)KHSH_END/.exec(String(r1.stdout || ''));
  let m = { err: '結果を取り出せない' };
  if (hit) { try { m = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8')); } catch (e) { m = { err: '結果を読めない' }; } }
  const png = path.join(OUTD, 'fixed-' + nn + '.png');
  cp.spawnSync(browser, base('844,390').concat(['--user-data-dir=' + path.join(tmp, 'p2-' + i), '--virtual-time-budget=15000', '--screenshot=' + png, url]), { encoding: 'utf8', timeout: 60000 });
  rep.push({ n: i + 1, w: m.w, card: m.card, issues: m.issues || [], err: m.err || null, shot: fs.existsSync(png) ? 'advice-shots/' + ver + '/fixed-' + nn + '.png' : null });
}
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
fs.writeFileSync(path.join(OUTD, 'report.json'), JSON.stringify({ ver: ver, rows: rep }, null, 1), 'utf8');
const bad = rep.filter(x => (x.issues && x.issues.length) || x.err || x.card === false);
console.log('版 ' + ver + '・' + rep.length + '局・絵 ' + rep.filter(x => x.shot).length + '枚・印 ' + bad.length + '局・窓の幅 ' + (rep[0] && rep[0].w));
