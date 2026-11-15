// 雲で：voice-advice-dial.txt の台本（方言の字）から、方言の声（VOICEVOX:ずんだもん）を作る（2026-11-15・y1115-29 のヨシ・全8種）
//   ＊1回の走りの上限は25分（job.yml の timeout 1500）。1回に LIMIT 本まで、**まだ無い物だけ**作る（続きから）。全部できるまで、同じ台本を何度か回す。
//   ＊雲の中で、前後の無音を詰め・声の大きさを揃え（voice-pieces.js と同じ整え方）、軽い形式（IMA ADPCM・adpcm.js）にして
//     reports/voice-advice-dial-out/<名>.wav.wav へ書く。**素の声（整える前）は書かない**——公開側の大きさを守るため（素の声は約4倍）。
//   ＊声の名は台本の一列目（advy-<字の印>）。こちらは書き戻された声を、リポジトリ直下（本体の声の置き場）へ移す。
//   ＊エンジン（Docker・CPU版）の立て方は voice-advice.js と同じ。
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'reports', 'voice-advice-dial-out');
const BASE = 'http://127.0.0.1:50021';
const SPEAKER = Number(process.env.VV_SPEAKER || 3);
const LIMIT = Number(process.env.VV_LIMIT || 1000);
const ADPCM = require(path.join(ROOT, 'adpcm.js'));
const RATE = 24000, THR = 500, TARGET_RMS = 1700, PAD = 0.03, FADE = 0.008;

function sh(c, o) { return execSync(c, Object.assign({ stdio: 'inherit' }, o || {})); }
async function waitUp() {
  for (let i = 0; i < 90; i++) {
    try { const r = await fetch(BASE + '/version'); if (r.ok) return (await r.text()); } catch (e) { /* まだ */ }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('エンジンが立たない');
}
async function synth(text) {
  const q = await (await fetch(BASE + '/audio_query?speaker=' + SPEAKER + '&text=' + encodeURIComponent(text), { method: 'POST' })).json();
  q.outputSamplingRate = RATE; q.outputStereo = false; q.prePhonemeLength = 0.12; q.postPhonemeLength = 0.12;
  const r = await fetch(BASE + '/synthesis?speaker=' + SPEAKER, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(q) });
  if (!r.ok) throw new Error('synthesis ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}
/* voice-pieces.js と同じ整え方：前後の無音を余白 0.03 秒まで詰め、声のある所の二乗平均を 1700 に揃え、端を 8ms でなめらかに */
function fix(s) {
  let a = -1, e = -1;
  for (let i = 0; i < s.length; i++) if (Math.abs(s[i]) > THR) { if (a < 0) a = i; e = i; }
  if (a < 0) throw new Error('声が無い');
  const p = Math.round(PAD * RATE), t = s.slice(Math.max(0, a - p), Math.min(s.length - 1, e + p) + 1);
  let tt = 0, c = 0; for (const v of t) if (Math.abs(v) > THR) { tt += v * v; c++; }
  const g = Math.min(2.5, Math.max(0.5, TARGET_RMS / Math.sqrt(tt / Math.max(1, c))));
  const o = new Int16Array(t.length);
  for (let i = 0; i < t.length; i++) o[i] = Math.max(-32000, Math.min(32000, Math.round(t[i] * g)));
  const f = Math.round(FADE * RATE);
  for (let i = 0; i < f && i < o.length; i++) { const k = i / f; o[i] = Math.round(o[i] * k); o[o.length - 1 - i] = Math.round(o[o.length - 1 - i] * k); }
  return o;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const lines = fs.readFileSync(path.join(ROOT, 'voice-advice-dial.txt'), 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#');
  const todo = lines.filter(l => { const nm = l.split('\t')[0]; return nm && !fs.existsSync(path.join(OUT, nm)) && !fs.existsSync(path.join(ROOT, nm)); });   // 直下に既にある声（前に作って移した物）も飛ばす（y1115-39）
  console.log('台本 ' + lines.length + '本／もう有る ' + (lines.length - todo.length) + '本／のこり ' + todo.length + '本／今回は先頭から ' + Math.min(LIMIT, todo.length) + '本');
  if (todo.length === 0) { console.log('全部できている'); return; }
  console.log('VOICEVOX エンジン（Docker・CPU）を立てる…');
  sh('docker pull voicevox/voicevox_engine:cpu-latest');
  sh('docker rm -f vv 2>/dev/null || true');
  sh('docker run -d --name vv -p 127.0.0.1:50021:50021 voicevox/voicevox_engine:cpu-latest');
  console.log('エンジンの版: ' + await waitUp());
  const t0 = Date.now(); let ok = 0, bytes = 0;
  for (const l of todo.slice(0, LIMIT)) {
    const [name, text] = l.split('\t');
    if (!name || !text) continue;
    const raw = ADPCM.decode(await synth(text));
    const enc = ADPCM.encode(fix(raw.s), RATE);
    fs.writeFileSync(path.join(OUT, name), enc);
    bytes += enc.length; ok++;
    if (ok % 100 === 0) console.log(ok + '本済み（' + Math.round((Date.now() - t0) / 1000) + '秒）');
  }
  console.log('\n作った声 ' + ok + '本・' + (bytes / 1048576).toFixed(1) + 'MB（軽い形式）／のこり ' + (todo.length - ok) + '本 → reports/voice-advice-dial-out/');
  sh('docker rm -f vv || true');
})().catch(e => { console.log('失敗: ' + e.message); try { execSync('docker logs vv | tail -20', { stdio: 'inherit' }); } catch (x) { /* */ } process.exit(1); });
