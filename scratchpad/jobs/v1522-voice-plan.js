#!/usr/bin/env node
/* v1522-voice-plan.js — v1522（守りの線・棚 #4）で新しく要る方言の声を、全組み合わせで洗い出す（雲で回す・2026-11-21）
   ＊sim1522（v1522 の守りの並びの写し）を、守りだけ・人格7×方言9＝63の切れ端で全部回す（v1522/slice.js を子として並べて回す）。
     集め方は v1513 と同じ（つなぎ・字が変わった部品・書いた字。名は advDialVoice）。そこへ v1513/merge.js と同じ静かな字（面白み・麻雀の言葉の書いた字・判定の一言・大物／惜しむ）を足し、直下の advy-*.m4a と突き合わせる。
   ＊切れ端の結果は reports/v1522-voice-plan/slices/ に一つずつ残す（済んだ切れ端は次の走りで回さない＝続きから）。
     時間の区切り（新しい切れ端は 1000秒まで・子は 420秒で殺す）で残りが出たら、終了コード3。もう一度 job.yml -f only=v1522-voice-plan.js を起こせば続きから回る。
   ＊63切れ端が揃ったら reports/v1522-voice-plan/ に
       add.json      … 足す声の名→字（直下にも reports/voice-m4a-out にも無い物）
       dial-add.txt  … voice-plan/dial.txt の末尾へ足す行（名.wav.wav<TAB>読み。読みは voice-advice-persona.js の say()）
     と reports/v1522-voice-plan.md（数・字数・大きさの見込み）を書く。台本へ足すのは手元の v1522/append-dial.js（job.yml が押し戻すのは reports/ だけのため）。 */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..', '..');
const SUB = path.join(__dirname, 'v1522');
const OD = path.join(ROOT, 'reports', 'v1522-voice-plan'), SD = path.join(OD, 'slices');
fs.mkdirSync(SD, { recursive: true });
const ENV = Object.assign({}, process.env, { KH_ROOT: ROOT, HEAD_HTML: path.join(ROOT, 'koushu-handan.html'), SIDE: 'd', QS: '0,1' });
const C = require(path.join(ROOT, 'advice-tone-core.js'));
const TONES = C.ADV_TONE_KEYS, DIALS = ['yoji', 'std', 'miyazaki', 'hakata', 'osaka', 'kyoto', 'aomori', 'okinawa', 'bushi'];   // 重い幼児を先に
const LAUNCH_SEC = Number(process.env.LAUNCH_SEC || 1000), CHILD_SEC = Number(process.env.CHILD_SEC || 420);
const PAR = Math.max(1, Math.min(8, os.cpus().length));
const t0 = Date.now(), el = () => Math.round((Date.now() - t0) / 1000);
const todo = [];
DIALS.forEach(d => TONES.forEach(t => { const f = path.join(SD, t + '-' + d + '.json'); if (!fs.existsSync(f)) { todo.push({ t, d, f }); } }));
console.log('切れ端 63／済み ' + (63 - todo.length) + '／これから ' + todo.length + '（並べて ' + PAR + '本）');
let running = 0, failed = [], skipped = 0;
function next() {
  while (running < PAR && todo.length) {
    if (el() > LAUNCH_SEC) { skipped = todo.length; todo.length = 0; break; }
    const j = todo.shift(); running++;
    const tmp = j.f + '.part';
    const ch = cp.spawn(process.execPath, [path.join(SUB, 'slice.js'), tmp], { env: Object.assign({}, ENV, { TONE: j.t, DIAL: j.d }), stdio: ['ignore', 'pipe', 'pipe'] });
    let log = '';
    ch.stdout.on('data', b => { log += b; }); ch.stderr.on('data', b => { log += b; });
    const killer = setTimeout(() => { log += '（' + CHILD_SEC + '秒の上限で殺した）'; ch.kill('SIGKILL'); }, CHILD_SEC * 1000);
    ch.on('close', code => {
      clearTimeout(killer); running--;
      if (code === 0 && fs.existsSync(tmp)) { fs.renameSync(tmp, j.f); process.stdout.write('[' + el() + '秒] ' + log.trim() + '\n'); }
      else { failed.push(j.t + '-' + j.d); try { fs.unlinkSync(tmp); } catch (e) { /* 無い */ } console.log('[' + el() + '秒] 落ちた ' + j.t + '-' + j.d + ' 終了コード ' + code + ' ' + log.trim().slice(-300)); }
      if (running === 0 && !todo.length) { finish(); } else { next(); }
    });
  }
  if (running === 0 && !todo.length) { finish(); }
}
let finished = false;
function finish() {
  if (finished) { return; } finished = true;
  const have = fs.readdirSync(SD).filter(f => /\.json$/.test(f));
  console.log('済んだ切れ端 ' + have.length + '／63（落ちた ' + failed.length + '・時間で始めなかった ' + skipped + '）・' + el() + '秒');
  if (have.length < 63) {
    fs.writeFileSync(path.join(ROOT, 'reports', 'v1522-voice-plan.md'), '# v1522 の声の洗い出し（途中）\n\n- 済んだ切れ端 ' + have.length + '／63（落ちた ' + (failed.join('・') || 'なし') + '・時間で始めなかった ' + skipped + '）\n- もう一度  gh workflow run job.yml -f only=v1522-voice-plan.js  を起こせば続きから回る\n');
    process.exit(3);
  }
  // 切れ端を合わせる
  const need = {}; let combos = 0, ng = 0;
  const addN = (nm, tx, kind) => { const o = need[nm] || (need[nm] = { text: tx, kinds: new Set() }); o.kinds.add(kind); };
  have.forEach(f => { const o = JSON.parse(fs.readFileSync(path.join(SD, f), 'utf8')); combos += o.combos; ng += o.ng; Object.keys(o.miss).forEach(k => addN(k, o.miss[k].text, o.miss[k].kind)); });
  const simMiss = Object.keys(need).length;
  // v1513/merge.js と同じ静かな字
  const { T } = require(path.join(ROOT, 'voice-advice-catalog.js')); global.ADV_TEXT = T;
  process.env.HEAD_HTML = ENV.HEAD_HTML;
  const HP = require(path.join(__dirname, 'v1513', 'head-pool.js'));
  const st = [];
  Object.keys(C.ADV_OMO).forEach(k => Object.keys(C.ADV_OMO[k]).forEach(sn => C.ADV_OMO[k][sn].forEach(tx => st.push([tx, 'omo']))));
  Object.keys(C.ADV_WORD_LIT).forEach(k => Object.keys(C.ADV_WORD_LIT[k]).forEach(id => st.push([C.ADV_WORD_LIT[k][id], 'word'])));
  HP.allPhrases().forEach(tx => st.push([tx, 'head']));
  TONES.forEach(t => ['', 'miyazaki', 'hakata', 'osaka', 'kyoto', 'aomori', 'okinawa', 'bushi', 'yoji'].forEach(d => [true, false].forEach(a => { const b = C.advBigLine(t, d, a); if (b) { st.push([b, 'big']); } })));
  const root = new Set(fs.readdirSync(ROOT).filter(f => /^advy-.*\.m4a$/.test(f)).map(f => f.slice(0, -4)));
  let stMiss = 0;
  st.forEach(([tx, kind]) => { if (!tx) { return; } const nm = C.advDialVoice(tx); if (!root.has(nm)) { if (!need[nm]) { stMiss++; } addN(nm, tx, kind); } });
  let outDir = new Set(); try { outDir = new Set(fs.readdirSync(path.join(ROOT, 'reports', 'voice-m4a-out')).filter(f => /\.m4a$/.test(f)).map(f => f.slice(0, -4))); } catch (e) { /* 無い */ }
  const names = Object.keys(need).filter(k => !root.has(k)).sort();
  const inOut = names.filter(k => outDir.has(k)), make = names.filter(k => !outDir.has(k));
  const PP = require(path.join(ROOT, 'voice-advice-persona.js'));
  const add = {}, lines = []; let chars = 0, paren = 0, empty = 0; const kinds = {};
  make.forEach(k => { const tx = need[k].text, r = PP.say(tx); add[k] = tx; lines.push(k + '.wav.wav\t' + r); chars += tx.length; if (/[（）]/.test(r)) { paren++; } if (!r) { empty++; } need[k].kinds.forEach(x => { kinds[x] = (kinds[x] || 0) + 1; }); });
  let ref = null; try { const m = JSON.parse(fs.readFileSync(path.join(SUB, 'miss-1514.json'), 'utf8')); const ks = Object.keys(m); ref = { miss1514: ks.length, inThis: ks.filter(k => add[k]).length, inRoot: ks.filter(k => root.has(k)).length }; } catch (e) { /* 無い */ }
  fs.writeFileSync(path.join(OD, 'add.json'), JSON.stringify(add));
  fs.writeFileSync(path.join(OD, 'dial-add.txt'), lines.join('\r\n') + '\r\n');
  const mb1 = chars * 1095 / 1048576, mb2 = make.length * 32.9 / 1024;
  const sum = { combos, ng, slices: have.length, simMiss, staticMiss: stMiss, inVoiceM4aOut: inOut.length, make: make.length, kinds, chars, paren, empty, sizeMB: [+mb1.toFixed(1), +mb2.toFixed(1)], ref, sec: el() };
  console.log(JSON.stringify(sum, null, 1));
  fs.writeFileSync(path.join(ROOT, 'reports', 'v1522-voice-plan.md'), '# v1522 の声の洗い出し（雲・' + el() + '秒）\n\n```\n' + JSON.stringify(sum, null, 1) + '\n```\n\n- 足す声 ' + make.length + '本・' + chars + '字（読みの括弧 ' + paren + '・空 ' + empty + '）\n- 大きさの見込み ' + mb1.toFixed(1) + '〜' + mb2.toFixed(1) + 'MB（字あたり 1,095バイト／1本 32.9KB）\n- reports/voice-m4a-out に在って直下に無い物 ' + inOut.length + '本（道具は作らない）\n- 次：手元で  node scratchpad/jobs/v1522/append-dial.js  → commit・push → gh workflow run voice-m4a.yml -f kind=dial\n');
}
next();
