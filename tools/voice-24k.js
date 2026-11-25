#!/usr/bin/env node
/* tools/voice-24k.js — 公開の声（voice-used.txt）を 24kbps の AAC（m4a・24kHz・mono）へ作り直す（2026-11-25・橋の枠 二百九十六）
   ＊元は今の m4a（VOICEVOX の素の声は残っていない）。分割（SHARD／SHARDS）で雲（voice-24k.yml）から回す。
   ＊もう 30kbps 以下の声は作り直さない（続きから・二度回しても劣化が重ならない）。出力は $OUT_DIR/<名>.m4a */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const SHARD = Number(process.env.SHARD || 0), SHARDS = Number(process.env.SHARDS || 1), OUT = process.env.OUT_DIR || path.join(ROOT, 'reports', 'voice-24k-out');
const MAX_SEC = Number(process.env.MAX_SEC || 1500), PAR = Number(process.env.PAR || 4);
fs.mkdirSync(OUT, { recursive: true });
const all = fs.readFileSync(path.join(ROOT, 'voice-used.txt'), 'utf8').split(/\r?\n/).filter(Boolean).sort();
const mine = all.filter((n, i) => i % SHARDS === SHARD && fs.existsSync(path.join(ROOT, n)));
const run = (cmd, args) => new Promise(res => cp.execFile(cmd, args, { maxBuffer: 1 << 22 }, (e, so) => res({ e, so: String(so || '') })));
let ok = 0, skip = 0, fail = 0, before = 0, after = 0, i = 0; const t0 = Date.now();
async function worker() {
  while (i < mine.length) {
    if ((Date.now() - t0) / 1000 > MAX_SEC) { return; }
    const n = mine[i++], src = path.join(ROOT, n), dst = path.join(OUT, n);
    const p = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'csv=p=0', src]);
    const [dur, size] = p.so.trim().split(',').map(Number);
    if (p.e || !dur) { fail++; console.log('測れない ' + n); continue; }
    if (size * 8 / dur / 1000 <= 30) { skip++; continue; }
    const r = await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-c:a', 'aac', '-profile:a', 'aac_low', '-b:a', '24k', '-ar', '24000', '-ac', '1', '-movflags', '+faststart', dst]);
    if (r.e) { fail++; console.log('失敗 ' + n); continue; }
    ok++; before += size; after += fs.statSync(dst).size;
    if (ok % 500 === 0) { console.log(ok + '本済み（' + Math.round((Date.now() - t0) / 1000) + '秒）'); }
  }
}
(async () => {
  console.log('分担 ' + SHARD + '/' + SHARDS + '：' + mine.length + '本');
  await Promise.all(Array.from({ length: PAR }, worker));
  console.log('作り直した ' + ok + '本・' + (before / 1048576).toFixed(1) + 'MB → ' + (after / 1048576).toFixed(1) + 'MB／もう軽い ' + skip + '本／失敗 ' + fail + '／のこり ' + (mine.length - i) + '本');
  if (fail) { process.exit(1); }
})();
