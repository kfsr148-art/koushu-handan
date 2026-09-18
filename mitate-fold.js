#!/usr/bin/env node
/* ============================================================
   mitate-fold.js — 見立て行が2行・3行に折り返したときの二択の位置を測る
   ============================================================
   ＊2026-09-19 の指示（字数の上限を外す）で足した。**本体には触らない**——
     作法14「写しに probe」のとおり、写しを一時の所に作って差し込み、終わったら消す。
   ＊測るのは判定後（judged）の **二択（.next-hand-row）の bottom** だけ。
     見立て行の折り返しそのものは咎めない（check.js ⑦ からも外した）。
   ＊視野は check.js ⑦ のフル版と同じ21。
   ＊一回の起動で 1行・2行・3行の三通りを測る（起動を三倍にしない）。
   ＊≤745px幅／≤380px高 は nowrap + ellipsis が効くので折り返さない。
     その回は「折り返さない」と出す（落ちではない）。
*/
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SRC = path.join(__dirname, 'koushu-handan.html');
const VIEWS = [[568, 320], [667, 375], [844, 390], [932, 430],
               [900, 300], [900, 340], [900, 375], [900, 381],
               [780, 360], [800, 360], [812, 375], [800, 480],
               [744, 375], [745, 375], [746, 375],
               [800, 348], [800, 349], [800, 350],
               [800, 379], [800, 380], [800, 381]];

const FLAGS = ['--no-sandbox', '--disable-dev-shm-usage', '--no-first-run', '--no-default-browser-check',
  '--disable-extensions', '--disable-background-networking', '--disable-sync', '--disable-translate',
  '--disable-default-apps', '--disable-component-update', '--disable-breakpad',
  '--disable-client-side-phishing-detection', '--metrics-recording-only', '--mute-audio',
  '--disable-search-engine-choice-screen', '--no-service-autorun', '--password-store=basic'];

const browser = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(p => p && fs.existsSync(p))[0];
if (!browser) { console.log('ブラウザが見つからないので測れない'); process.exit(2); }
console.log('測定に使うブラウザ : ' + path.basename(browser));

const PROBE = `
<script>
window.addEventListener('load', function(){
  var res = { w:0, h:0, rows:[] };
  var out = function(){
    try{
      var b = document.createElement('div');
      b.textContent = 'KOUSHU_FOLD_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(res)))) + 'KOUSHU_FOLD_END';
      document.body.appendChild(b);
    }catch(e){}
  };
  setTimeout(function(){
    try{
      window.closeTitleScreen(); window.ssMarkTool();
      var g = document.getElementById('qiText');
      if(g){ g.value = '3455m2367p1189s7z'; g.dispatchEvent(new Event('input', {bubbles:true})); }
      setTimeout(function(){ var jb = document.getElementById('judgeBtn'); if(jb) jb.click(); }, 300);
    }catch(e){ res.error = e.message; }
  }, 200);
  setTimeout(function(){
    try{
      res.w = window.innerWidth; res.h = window.innerHeight;
      var ang = document.querySelector('.tone-angle');
      var st  = ang ? ang.querySelector('.say-text') : null;
      var tl  = document.querySelector('.next-hand-row');
      if(!ang || !st || !tl){ res.error = '判定後の札が出ていない'; out(); return; }
      var H = function(el){ return Math.round(el.getBoundingClientRect().height * 10) / 10; };
      var B = function(el){ return Math.round(el.getBoundingClientRect().bottom * 10) / 10; };
      var base = (st.textContent || '').trim();
      var one  = H(ang);                     // いまの行の高さ（ふつうは一行）
      var unit = 0;                          // 一行ぶんの高さ
      var GROW = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも';
      // 一行の高さを取る … いまの行が一行なら、それがそのまま単位
      unit = one;
      [1, 2, 3].forEach(function(want){
        var txt = base, guard = 0, h = one;
        while(guard < 40){
          h = H(ang);
          if(h >= unit * want - 0.5) break;
          txt = txt + GROW;
          st.textContent = txt;
          guard++;
        }
        var folded = Math.round((H(ang) / unit) * 100) / 100;
        res.rows.push({ want: want, chars: txt.length, angH: H(ang), lines: folded,
                        tailBottom: B(tl), over: Math.round((B(tl) - window.innerHeight) * 10) / 10,
                        grew: guard });
      });
      st.textContent = base;
    }catch(e){ res.error = e.message; }
    out();
  }, 2600);
});
</script>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-fold-'));
let padW = 0, padH = 0;
try {
  // 額縁の較正（check.js ⑦ と同じ手）
  const cal = path.join(tmp, 'cal.html');
  fs.writeFileSync(cal, '<!doctype html><meta charset="utf-8"><body><script>' +
    'document.body.textContent="KOUSHU_CAL"+window.innerWidth+"x"+window.innerHeight;</script>');
  const r = spawnSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--window-size=667,375', '--user-data-dir=' + path.join(tmp, 'p0')]
    .concat(FLAGS).concat(['--virtual-time-budget=3000', '--dump-dom', 'file:///' + cal.replace(/\\/g, '/')]),
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 60000 });
  const m = /KOUSHU_CAL([0-9]+)x([0-9]+)/.exec(String(r.stdout || ''));
  if (m) { padW = 667 - Number(m[1]); padH = 375 - Number(m[2]); }
  console.log('額縁の較正 : 窓667x375で内寸 ' + (m ? m[1] + 'x' + m[2] : '読めず') + ' → 差 幅+' + padW + ' / 高さ+' + padH);

  const probe = path.join(tmp, 'probe.html');
  fs.writeFileSync(probe, fs.readFileSync(SRC, 'utf8') + PROBE, 'utf8');

  const bad = [];
  console.log('');
  console.log('視野        1行の二択bottom   2行（溢れ）        3行（溢れ）        折り返し');
  VIEWS.forEach(function (v) {
    const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      '--window-size=' + (v[0] + padW) + ',' + (v[1] + padH),
      '--user-data-dir=' + path.join(tmp, 'p' + v[0] + '_' + v[1])]
      .concat(FLAGS).concat(['--virtual-time-budget=9000', '--dump-dom', 'file:///' + probe.replace(/\\/g, '/')]);
    const r = spawnSync(browser, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 120000 });
    const hit = /KOUSHU_FOLD_BEGIN([A-Za-z0-9+/=]+)KOUSHU_FOLD_END/.exec(String(r.stdout || ''));
    const tag = (v[0] + 'x' + v[1]).padEnd(11);
    if (!hit) { console.log(tag + '測れなかった'); bad.push(v.join('x') + '：測れなかった'); return; }
    let d;
    try { d = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8')); }
    catch (e) { console.log(tag + '読めなかった'); bad.push(v.join('x') + '：読めなかった'); return; }
    if (d.error) { console.log(tag + '★' + d.error); bad.push(v.join('x') + '：' + d.error); return; }
    const row = n => (d.rows || []).filter(x => x.want === n)[0] || {};
    const f = (x) => (x.tailBottom === undefined ? '—' :
      (String(x.tailBottom) + (x.over > 0 ? '（+' + x.over + '溢れ）' : '（収まる）')));
    const wrapped = row(2).lines >= 1.5 ? '折り返す' : '折り返さない（nowrap）';
    console.log(tag + String(row(1).tailBottom).padEnd(17) + f(row(2)).padEnd(19) + f(row(3)).padEnd(19) + wrapped);
    [2, 3].forEach(n => { if (row(n).over > 0) bad.push(v.join('x') + ' の' + n + '行：+' + row(n).over + 'px'); });
  });
  console.log('');
  if (bad.length === 0) console.log('溢れる視野は無い（21視野・2行と3行とも二択は画面の中）');
  else { console.log('■ 溢れ／測れなかった ' + bad.length + '件'); bad.forEach(x => console.log('  ' + x)); }
} finally {
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
}
