#!/usr/bin/env node
/* ============================================================
   mitate-kazoe.js — 見立て行の条件に出てくる数を、13枚の実例で読む
   ============================================================
   ＊2026-09-19 の指示（mitate.txt の数が何を数えているかを実例つきで残す）で足した。
   ＊**本体には触らない**。作法14「写しに probe」——写しを一時の所に作って差し込み、終わったら消す。
   ＊作法15「window に診断口を残さない」も守る。読むのは**本体が元から持っている控え**だけ
     （window._lastA ／ window._lastFacts ／ window._toolCount ／ window._lastCut）。
   ＊この機械では headless を立てない決めなので、雲（Actions）で回す。
*/
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SRC = path.join(__dirname, 'koushu-handan.html');
const HANDS = [
  ['3455m2367p1189s7z', '検査の見本（既定の13枚）'],
  ['112233m456p789s1z', '対子が三種・順子が二つ'],
  ['1122334455667m',   '同じ色で対子が七種（七対子の形）'],
  ['1112345678999m',   '九蓮の形（良形が多い）'],
  ['1345m1345p1345s1z', '嵌張と辺張が並ぶ（弱形が多い）'],
  ['19m19p19s1234567z', '么九と字牌だけ（国士の形）'],
  ['234m567p234s1122z', '役牌の対子が二種'],
  ['1234567m123p12s',  '数牌が伸びる（浮き牌が少ない）'],
  ['5m1p9s1234567z2z',  '字牌が一枚きりで多い'],
  ['456m456p456s1199z', '面子が三つ揃い、対子が二種']
];

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

const PROBE = (hand) => `
<script>
window.addEventListener('load', function(){
  var res = {};
  var out = function(){
    try{
      var b = document.createElement('div');
      b.textContent = 'KOUSHU_KAZOE_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(res)))) + 'KOUSHU_KAZOE_END';
      document.body.appendChild(b);
    }catch(e){}
  };
  setTimeout(function(){
    try{
      window.closeTitleScreen(); window.ssMarkTool();
      var g = document.getElementById('qiText');
      g.value = ${JSON.stringify(hand)};
      g.dispatchEvent(new Event('input', {bubbles:true}));
      setTimeout(function(){ document.getElementById('judgeBtn').click(); }, 300);
    }catch(e){ res.error = e.message; }
  }, 200);
  setTimeout(function(){
    try{
      var a = window._lastA || {}, F = window._lastFacts || {}, n = window._toolCount || {};
      var sz = function(s){ return (s && typeof s.size === 'number') ? s.size : null; };
      res.hand = ${JSON.stringify(hand)};
      res.a = { baseShanten:a.baseShanten, goodShapes:a.goodShapes, weakShapes:a.weakShapes,
                totalBlocks:a.totalBlocks, fillRemain:a.fillRemain, fillGood:a.fillGood, fillWeak:a.fillWeak,
                defHonors:a.defHonors, defTerminals:a.defTerminals, acceptTiles:a.acceptTiles,
                yakuhaiPair:!!a.yakuhaiPair, verdict:a.verdict };
      res.F = {
        multi: F.multi ? { name:F.multi.name, roles:F.multi.roles } : null,
        multiIdx: sz(F.multiIdx),
        naki: F.naki ? { kind:F.naki.kind, name:F.naki.name } : null,
        dup: F.dup ? { kind:F.dup.kind, name:F.dup.name, a:F.dup.a, b:F.dup.b } : null,
        lady: F.lady ? { kind:F.lady.kind, plan:F.lady.plan, rest:F.lady.rest } : null,
        floatN: sz(F.floatIdx), floatTop: F.floatTop,
        ichi: F.ichi ? { kind:F.ichi.kind, name:F.ichi.name, n:F.ichi.n, top:F.ichi.top } : null,
        sensei: F.sensei ? { n:F.sensei.n, top:F.sensei.top } : null,
        catN: sz(F.catIdx), edaN: sz(F.edaIdx), omN: sz(F.omIdx)
      };
      res.count = { cat:n.cat, ai:n.ai, usagi:n.usagi };
      res.cut = (window._lastCut && window._lastCut.code) ? window._lastCut.code : null;
      var st = document.querySelector('.tone-angle .say-text');
      res.say = st ? (st.textContent || '').trim() : '';
    }catch(e){ res.error = e.message; }
    out();
  }, 2400);
});
</script>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-kazoe-'));
const src = fs.readFileSync(SRC, 'utf8');
const all = [];
try {
  HANDS.forEach(function (h, i) {
    const probe = path.join(tmp, 'p' + i + '.html');
    fs.writeFileSync(probe, src + PROBE(h[0]), 'utf8');
    const r = spawnSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1', '--window-size=1000,800',
      '--user-data-dir=' + path.join(tmp, 'u' + i)]
      .concat(FLAGS).concat(['--virtual-time-budget=9000', '--dump-dom', 'file:///' + probe.replace(/\\/g, '/')]),
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 120000 });
    const hit = /KOUSHU_KAZOE_BEGIN([A-Za-z0-9+/=]+)KOUSHU_KAZOE_END/.exec(String(r.stdout || ''));
    if (!hit) { console.log('★測れなかった : ' + h[0]); return; }
    let d;
    try { d = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8')); }
    catch (e) { console.log('★読めなかった : ' + h[0]); return; }
    d.note = h[1];
    all.push(d);
    console.log('');
    console.log('■ ' + h[0] + '　（' + h[1] + '）' + (d.error ? '　★' + d.error : ''));
    if (d.error) return;
    const a = d.a, F = d.F;
    console.log('  analyze  向聴=' + a.baseShanten + '  良形=' + a.goodShapes + '  弱形=' + a.weakShapes +
                '  枠=' + a.totalBlocks + '  受け入れ=' + a.acceptTiles + '  判定=' + a.verdict);
    console.log('  枠の埋まり  fillRemain=' + a.fillRemain + '  fillGood=' + a.fillGood + '  fillWeak=' + a.fillWeak);
    console.log('  盾  defHonors=' + a.defHonors + '  defTerminals=' + a.defTerminals + '  役牌の対子=' + a.yakuhaiPair);
    console.log('  執事 multi=' + JSON.stringify(F.multi) + '  掛け持ちの枚数=' + F.multiIdx);
    console.log('  軍師 naki=' + JSON.stringify(F.naki));
    console.log('  ずんだ dup=' + JSON.stringify(F.dup));
    console.log('  お嬢様 lady=' + JSON.stringify(F.lady));
    console.log('  マダム 浮き牌=' + F.floatN + '  筆頭=' + (F.floatTop || 'なし'));
    console.log('  一姫 ichi=' + JSON.stringify(F.ichi));
    console.log('  先生 sensei=' + JSON.stringify(F.sensei));
    console.log('  帯  猫牌=' + d.count.cat + '（印' + F.catN + '）  一枚きりの字牌=' + d.count.ai + '（印' + F.omN +
                '）  二枚以上の種類=' + F.edaN + '  弱い余り=' + d.count.usagi + '  切る候補=' + (d.cut || 'なし'));
    console.log('  見立て行 … ' + d.say);
  });
  fs.writeFileSync(path.join(process.cwd(), 'mitate-kazoe.json'), JSON.stringify(all, null, 1), 'utf8');
  console.log('');
  console.log('測れた手 … ' + all.length + '／' + HANDS.length);
} finally {
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
}
