#!/usr/bin/env node
/* voice-pieces.js — 全判定の助言の声の部品を整えて、本体の声の置き場（リポジトリ直下）へ置く（2026-11-14・y1114-2218）
   ＊入力：reports/voice-advice-out/<id>.wav.wav（雲で VOICEVOX:ずんだもん が作った素の声）と、今ある数字の声 0〜13（直下の <n>.wav.wav）
   ＊やること：前後の無音を切り詰め（余白 0.03 秒）、声のある所の二乗平均を揃え（目標 1700・voice-join.js と同じ）、端を 8ms でなめらかにする。
   ＊出すもの：直下の <id>.wav.wav（部品）と advn-<n>.wav.wav（数字 0〜13）。本体はこれらを間の無音ごと繋いで一本で鳴らす。
   ＊24kHz・mono・16bit だけを受ける。 使い方  node voice-pieces.js */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname, RATE = 24000, THR = 500, TARGET_RMS = 1700, PAD = 0.03, FADE = 0.008;
const { T } = require('./voice-advice-catalog.js');
function readWav(f) {
  const b = fs.readFileSync(f);
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.readUInt16LE(22) !== 1 || b.readUInt32LE(24) !== RATE || b.readUInt16LE(34) !== 16) throw new Error('形式が違う: ' + f);
  const d = b.subarray(44), n = Math.floor(d.length / 2), s = new Int16Array(n);
  for (let i = 0; i < n; i++) s[i] = d.readInt16LE(i * 2);
  return s;
}
function writeWav(f, s) {
  const b = Buffer.alloc(44 + s.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + s.length * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(RATE, 24); b.writeUInt32LE(RATE * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(s.length * 2, 40);
  for (let i = 0; i < s.length; i++) b.writeInt16LE(s[i], 44 + i * 2);
  fs.writeFileSync(f, b);
}
function trim(s) {
  let a = -1, e = -1;
  for (let i = 0; i < s.length; i++) if (Math.abs(s[i]) > THR) { if (a < 0) a = i; e = i; }
  if (a < 0) throw new Error('声が無い');
  const p = Math.round(PAD * RATE);
  return s.slice(Math.max(0, a - p), Math.min(s.length - 1, e + p) + 1);
}
function rmsVoiced(s) { let t = 0, c = 0; for (const v of s) if (Math.abs(v) > THR) { t += v * v; c++; } return Math.sqrt(t / Math.max(1, c)); }
function fix(s) {
  const t = trim(s), g = Math.min(2.5, Math.max(0.5, TARGET_RMS / rmsVoiced(t)));
  const o = new Int16Array(t.length);
  for (let i = 0; i < t.length; i++) o[i] = Math.max(-32000, Math.min(32000, Math.round(t[i] * g)));
  const f = Math.round(FADE * RATE);
  for (let i = 0; i < f && i < o.length; i++) { const k = i / f; o[i] = Math.round(o[i] * k); o[o.length - 1 - i] = Math.round(o[o.length - 1 - i] * k); }
  return { s: o, g: g };
}
let n = 0, maxSec = 0, longest = '';
for (const id of Object.keys(T)) {
  const src = path.join(DIR, 'reports', 'voice-advice-out', id + '.wav.wav');
  if (!fs.existsSync(src)) { console.log('素の声が無い: ' + id); process.exitCode = 1; continue; }
  const r = fix(readWav(src));
  writeWav(path.join(DIR, id + '.wav.wav'), r.s);
  const sec = r.s.length / RATE; if (sec > maxSec) { maxSec = sec; longest = id; }
  n++;
}
for (let k = 0; k <= 13; k++) {
  const src = path.join(DIR, k + '.wav.wav');
  if (!fs.existsSync(src)) { console.log('数字の声が無い: ' + k); process.exitCode = 1; continue; }
  writeWav(path.join(DIR, 'advn-' + k + '.wav.wav'), fix(readWav(src)).s);
  n++;
}
console.log('置いた声 ' + n + '本（部品 ' + Object.keys(T).length + '＋数字 14）／いちばん長い部品 ' + longest + ' ' + maxSec.toFixed(2) + '秒');
