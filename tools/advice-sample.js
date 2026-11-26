#!/usr/bin/env node
/* advice-sample.js — 助言の見本（2026-11-26・枠 三百四十②・本人の決め）。
   公開の版が上がるたび、雲で「無作為の配牌 100 局」に、人格と方言をばらして付け、本体が実際に出す助言の文（adviceFor）を並べた一枚を作る。
   センコが先に読んで、変な文を見つけるための見本。VAIO では回さない（koushu-state の雲の走り advice-sample.yml が回す）。
   ＊本体（koushu-handan.html）には触らない。写しを一時の所に作り、後ろへ探索用の一片（probe）を差し込んで、headless Chrome／Edge ＋ --dump-dom で駆動する（作法14）。
     結果は base64 の目印つきで DOM に置き、吐かれた HTML から拾う。window に診断口は生やさない（別の script から本体の大域の let を読み書きするだけ）。
   使い方  node tools/advice-sample.js <handan の置き場> <出力.md> [局数=100]
   ＊配牌は本体の shuffleHand と同じ牌山（赤五は各色1枚）から無作為に13枚。判定は本体の judgeBtn と同じく analyze()→revoteVerdict で攻守を決め、adviceFor で文を出す。
     人格は ADV_TONE_KEYS、方言は ADV_DIALECT のキーと標準（''）から一局ごとにばらす。口調モード（ノーマル）は動かさない。 */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const ROOT = path.resolve(process.argv[2] || '.'), OUT = process.argv[3] || path.join(ROOT, 'advice-sample.md'), N = Number(process.argv[4]) || 100;
const src = fs.readFileSync(path.join(ROOT, 'koushu-handan.html'), 'utf8');
const ver = (fs.readFileSync(path.join(ROOT, 'ver.txt'), 'utf8').match(/[0-9]+/) || ['?'])[0];
const PROBE = `
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  var res = { rows: [], err: null };
  try {
    var N = ${N};
    var dials = [''].concat(Object.keys(ADV_DIALECT));
    for (var i = 0; i < N; i++) {
      shuffleHand();
      currentTone = ADV_TONE_KEYS[Math.floor(Math.random() * ADV_TONE_KEYS.length)];
      currentDialect = dials[Math.floor(Math.random() * dials.length)];
      var a = analyze();
      var catN = hand.filter(function(t){ return t.suit === 'cat'; }).length;
      var eff = catN + countIsolatedRealTiles(hand.filter(function(t){ return t.suit !== 'cat'; }));
      var rv = revoteVerdict(a, eff);
      if (rv) { a.revote = rv; a.verdict = rv.to; }
      var attack = a.verdict === 'attack';
      var r = null; try { r = adviceFor(a, hand, attack); } catch (e) { r = null; }
      res.rows.push({ n: i + 1, tiles: tilesToInput(hand), tone: currentTone, dial: currentDialect, attack: attack, text: r ? String(r.text || '') : '' });
    }
  } catch (e) { res.err = String(e && e.message || e); }
  var d = document.createElement('div'); d.id = 'khas';
  d.textContent = 'KHAS_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(res)))) + 'KHAS_END';
  document.body.appendChild(d);
}, 600); });
</script>`;
const browser = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(p => p && fs.existsSync(p))[0];
if (!browser) { console.error('ブラウザが無い'); process.exit(2); }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-advs-'));
const probe = path.join(tmp, 'probe.html');
fs.writeFileSync(probe, src.replace(/<\/body>\s*$/m, () => PROBE + '</body>'), 'utf8');
const args = ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--window-size=900,700', '--mute-audio', '--user-data-dir=' + path.join(tmp, 'prof'),
  '--virtual-time-budget=120000', '--dump-dom', 'file:///' + probe.replace(/\\/g, '/')];
const r = cp.spawnSync(browser, args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout: 170000 });
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
const hit = /KHAS_BEGIN([A-Za-z0-9+/=]+)KHAS_END/.exec(String(r.stdout || ''));
if (!hit) { console.error('結果を取り出せない'); process.exit(3); }
const res = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8'));
if (res.err) { console.error('probe の誤り：' + res.err); process.exit(4); }
const TONE_JA = { butler: '執事', strategist: '軍師', blunt: 'ずんだ', lady: 'お嬢様', french: 'マダム', ichihime: '一姫', sensei: '先生' };
const d = new Date(Date.now() + 9 * 3600 * 1000), z2 = n => (n < 10 ? '0' : '') + n;
const stamp = d.getUTCFullYear() + '-' + z2(d.getUTCMonth() + 1) + '-' + z2(d.getUTCDate()) + ' ' + z2(d.getUTCHours()) + ':' + z2(d.getUTCMinutes());
const empty = res.rows.filter(x => !x.text).length;
const L = ['# 助言の見本（センコ用・変な文を探す）', '', '版：' + ver, '作った刻：' + stamp + '（日本時間）', '局数：' + res.rows.length + '（無作為の配牌・人格と方言は一局ごとにばらす・口調はノーマル）／文が空の局：' + empty, '', '読むだけの見本です。本体が実際に出す文（adviceFor）をそのまま並べています。', ''];
res.rows.forEach(x => { L.push('### 局 ' + x.n + '｜' + (TONE_JA[x.tone] || x.tone) + '・' + (x.dial || '標準') + '｜' + (x.attack ? '攻め' : '守り')); L.push('配牌：' + x.tiles); L.push(''); L.push(x.text || '（文なし）'); L.push(''); });
fs.mkdirSync(path.dirname(path.resolve(OUT)), { recursive: true });
fs.writeFileSync(OUT, L.join('\n'), 'utf8');
console.log('版 ' + ver + '・' + res.rows.length + '局・空 ' + empty + '・' + OUT);
