#!/usr/bin/env node
/* tools/voice-m4a.js — 助言の声を AAC（m4a・24kHz・mono・48kbps）で作る（2026-11-18・y1118-0400 の枠：声の詰め方を変える）
   ＊雲（voice-m4a.yml）の分割（SHARD／SHARDS）で回す。名簿を並べて、番号が自分の分担の物だけを作る。
   ＊種類（KIND）
       dial    … voice-plan/dial.txt（方言の声。名は advy-<印>.wav.wav）→ VOICEVOX ずんだもんで作り、整えて AAC へ
       parts   … voice-plan/parts.txt（人格の部品の声）→ 同上
       convert … リポジトリ直下の今の声（adv*.wav.wav・IMA ADPCM）を復号して AAC へ（VOICEVOX は使わない）。advy は台本 voice-plan/dial.txt にある物だけ
   ＊出力 … $OUT_DIR（既定 reports/voice-m4a-out-s<番号>）/<名から .wav.wav を除いた物>.m4a
   ＊もう直下か reports/voice-m4a-out に在る物は作らない（続きから）。
   ＊整え方は scratchpad/jobs/voice-advice-dial.js と同じ（前後の無音を余白 0.03 秒まで詰め、声の二乗平均を 1700 に揃え、端 8ms をなめらかに）。 */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const ADPCM = require(path.join(ROOT, 'adpcm.js'));
const KIND = process.env.KIND || 'dial', SHARD = Number(process.env.SHARD || 0), SHARDS = Number(process.env.SHARDS || 1);
const OUT = process.env.OUT_DIR || path.join(ROOT, 'reports', 'voice-m4a-out-s' + SHARD);
const MAX_SEC = Number(process.env.MAX_SEC || 1380), BITRATE = process.env.BITRATE || '48k';
const BASE = 'http://127.0.0.1:50021', SPEAKER = Number(process.env.VV_SPEAKER || 3);
const RATE = 24000, THR = 500, TARGET_RMS = 1700, PAD = 0.03, FADE = 0.008;
fs.mkdirSync(OUT, { recursive: true });
const sh = (c, o) => cp.execSync(c, Object.assign({ stdio: 'inherit' }, o || {}));
function wavFromPcm(s) { const b = Buffer.alloc(44 + s.length * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + s.length * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(RATE, 24); b.writeUInt32LE(RATE * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(s.length * 2, 40); for (let i = 0; i < s.length; i++) { b.writeInt16LE(s[i], 44 + i * 2); } return b; }
function toM4a(pcm, outPath) {   // Int16Array（24kHz）→ m4a（AAC-LC・mono・24kHz）
  cp.execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'wav', '-i', 'pipe:0', '-c:a', 'aac', '-profile:a', 'aac_low', '-b:a', BITRATE, '-ar', String(RATE), '-ac', '1', '-movflags', '+faststart', outPath], { input: wavFromPcm(pcm) });
  return fs.statSync(outPath).size;
}
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
const stem = n => n.replace(/\.wav\.wav$/, '');
let _doneDirs = null;
function exists(n) {   // 直下か reports/voice-m4a-out* に、もう m4a が在るか
  const f = stem(n) + '.m4a';
  if (fs.existsSync(path.join(ROOT, f))) { return true; }
  if (!_doneDirs) { try { _doneDirs = fs.readdirSync(path.join(ROOT, 'reports')).filter(d => /^voice-m4a-out/.test(d)).map(d => path.join(ROOT, 'reports', d)); } catch (e) { _doneDirs = []; } }
  return _doneDirs.some(d => fs.existsSync(path.join(d, f)));
}
function lines(f) { return fs.readFileSync(path.join(ROOT, f), 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#').map(l => l.split('\t')); }
async function waitUp() { for (let i = 0; i < 90; i++) { try { const r = await fetch(BASE + '/version'); if (r.ok) return await r.text(); } catch (e) { /* まだ */ } await new Promise(r => setTimeout(r, 2000)); } throw new Error('エンジンが立たない'); }
async function synth(text) {
  const q = await (await fetch(BASE + '/audio_query?speaker=' + SPEAKER + '&text=' + encodeURIComponent(text), { method: 'POST' })).json();
  q.outputSamplingRate = RATE; q.outputStereo = false; q.prePhonemeLength = 0.12; q.postPhonemeLength = 0.12;
  const r = await fetch(BASE + '/synthesis?speaker=' + SPEAKER, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(q) });
  if (!r.ok) throw new Error('synthesis ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}
(async () => {
  let todo = [];   // [名, 字（作る時だけ）]
  if (KIND === 'dial') { todo = lines('voice-plan/dial.txt'); }
  else if (KIND === 'parts') { todo = lines('voice-plan/parts.txt'); }
  else if (KIND === 'convert') {
    const plan = new Set(lines('voice-plan/dial.txt').map(x => x[0]));
    todo = fs.readdirSync(ROOT).filter(f => /^(adv|color-).*\.wav\.wav$/.test(f) && (!/^advy-/.test(f) || plan.has(f))).sort().map(f => [f, null]);
  } else { throw new Error('KIND?'); }
  todo = todo.filter(x => x[0]).sort((a, b) => a[0] < b[0] ? -1 : 1);
  const mine = todo.filter((x, i) => i % SHARDS === SHARD && !exists(x[0]));
  console.log(KIND + ' 名簿 ' + todo.length + '本／この分担 ' + SHARD + '/' + SHARDS + ' のこり ' + mine.length + '本');
  if (!mine.length) { console.log('この分担は全部できている'); return; }
  const synthMode = KIND !== 'convert';
  if (synthMode) {
    sh('docker pull voicevox/voicevox_engine:cpu-latest'); sh('docker rm -f vv 2>/dev/null || true');
    sh('docker run -d --name vv -p 127.0.0.1:50021:50021 voicevox/voicevox_engine:cpu-latest');
    console.log('エンジンの版: ' + await waitUp()); try { const ud = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'voice-user-dict.json'), 'utf8')); for (const w of ud) { const r = await fetch(BASE + '/user_dict_word?surface=' + encodeURIComponent(w.surface) + '&pronunciation=' + encodeURIComponent(w.pronunciation) + '&accent_type=' + (w.accent_type || 0), { method: 'POST' }); console.log('ユーザー辞書：' + w.surface + '→' + w.pronunciation + '（' + r.status + '）'); } } catch (e) { console.log('ユーザー辞書を入れられなかった：' + e.message); }   // 2026-11-19：読み違いの言葉をユーザー辞書で直す（voice-user-dict.json）
  }
  const t0 = Date.now(); let ok = 0, bytes = 0, fail = 0;
  for (const [name, text] of mine) {
    if ((Date.now() - t0) / 1000 > MAX_SEC) { console.log('時間の区切り（' + MAX_SEC + '秒）で切る'); break; }
    try {
      let pcm;
      if (synthMode) { if (!text) { continue; } pcm = fix(ADPCM.decode(await synth(text)).s); }
      else { pcm = ADPCM.decode(fs.readFileSync(path.join(ROOT, name))).s; }
      bytes += toM4a(pcm, path.join(OUT, stem(name) + '.m4a')); ok++;
    } catch (e) { fail++; console.log('失敗 ' + name + ' ' + String(e.message).slice(0, 80)); }
    if (ok % 100 === 0 && ok) { console.log(ok + '本済み（' + Math.round((Date.now() - t0) / 1000) + '秒）'); }
  }
  console.log('\n作った声 ' + ok + '本・' + (bytes / 1048576).toFixed(1) + 'MB（AAC ' + BITRATE + '）／失敗 ' + fail + '／のこり ' + (mine.length - ok - fail) + '本');
  if (synthMode) { try { sh('docker rm -f vv || true'); } catch (e) { /* */ } }
})().catch(e => { console.log('失敗: ' + e.message); process.exit(1); });
