#!/usr/bin/env node
/* voice-join.js — 染めの芽で一色11〜13枚の声を、既存の声を切り貼りして作る（2026-11-14・y1114-2045）
   ＊「攻め」の声（attack）→色の声（color-*）→数字の声（11〜13）→尾の一本（scene-some-tail）の順に、
     無音を切り詰め、声の大きさ（声のある所の二乗平均）を揃え、決めた間（無音）を挟んで一本にする。
   ＊出すのは scene-some-{man,pin,sou}-{11,12,13}.wav.wav の9本。入力・出力ともリポジトリ直下。
   ＊つなぎ目ごとに「間（無音の長さ）」「前後の大きさの差（dB）」を出す。目安：間 0.05〜0.20 秒・差 4dB 以内（声の端は語の終わり・始まりで元々揺れる）。
   使い方
     node voice-join.js                … 9本を作る
     node voice-join.js --dry          … 作らず数字だけ出す
     node voice-join.js --tail <wav>   … 尾の一本を別の wav に替えて試す（検査用）
   ＊wav は 24kHz・mono・16bit だけを受ける。 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = __dirname;
const RATE = 24000;
const THR = 500;            // 声とみなす振幅
const TARGET_RMS = 1700;    // 声のある所の二乗平均の目標（既存の声は 1200〜1900）
const GAP = { head: 0.10, color: 0.08, num: 0.06 };   // 攻め→色／色→数字／数字→尾 の間（秒）
const PAD = 0.03, FADE = 0.008, END = 0.15;

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
  const p = Math.round(PAD * RATE);
  a = Math.max(0, a - p); e = Math.min(s.length - 1, e + p);
  return s.slice(a, e + 1);
}
function rmsVoiced(s) { let t = 0, c = 0; for (const v of s) if (Math.abs(v) > THR) { t += v * v; c++; } return Math.sqrt(t / Math.max(1, c)); }
function gainTo(s) {
  const g = Math.min(2.5, Math.max(0.5, TARGET_RMS / rmsVoiced(s)));
  const o = new Int16Array(s.length); let pk = 0;
  for (let i = 0; i < s.length; i++) { const v = Math.round(s[i] * g); o[i] = Math.max(-32000, Math.min(32000, v)); pk = Math.max(pk, Math.abs(v)); }
  const f = Math.round(FADE * RATE);
  for (let i = 0; i < f && i < o.length; i++) { const k = i / f; o[i] = Math.round(o[i] * k); o[o.length - 1 - i] = Math.round(o[o.length - 1 - i] * k); }
  return { s: o, g: g };
}
/* つなぎ目の前後の大きさは、前後の余白（PAD）を除いた「声のある所」の端 0.12 秒で測る */
function lastRms(s, sec) { const e = s.length - Math.round(PAD * RATE), a = Math.max(0, e - Math.round(sec * RATE)); let t = 0; for (let i = a; i < e; i++) t += s[i] * s[i]; return Math.sqrt(t / Math.max(1, e - a)); }
function firstRms(s, sec) { const a = Math.round(PAD * RATE), e = Math.min(s.length, a + Math.round(sec * RATE)); let t = 0; for (let i = a; i < e; i++) t += s[i] * s[i]; return Math.sqrt(t / Math.max(1, e - a)); }
const dB = (a, b) => 20 * Math.log10(Math.max(1, a) / Math.max(1, b));

const argv = process.argv.slice(2);
const dry = argv.indexOf('--dry') >= 0;
const ti = argv.indexOf('--tail');
const TAIL = ti >= 0 ? path.resolve(argv[ti + 1]) : path.join(DIR, 'scene-some-tail.wav.wav');
const piece = (f) => { const t = trim(readWav(f)); const r = gainTo(t); return { s: r.s, g: r.g, rms0: rmsVoiced(t), sec: r.s.length / RATE }; };
/* つなぎ目の差を4dB以内へ収める補正（2026-11-14・実測の差から）：色ごと・尾 */
const COLOR_MUL = { man: 1, pin: 0.85, sou: 1.25 };
const TAIL_MUL = 0.90;
const mul = (p, m) => { const o = new Int16Array(p.s.length); for (let i = 0; i < o.length; i++) o[i] = Math.round(p.s[i] * m); return { s: o, g: p.g * m, rms0: p.rms0, sec: p.sec }; };
const gap = (sec) => new Int16Array(Math.round(sec * RATE));

const head = piece(path.join(DIR, 'attack.wav.wav'));
const tail = mul(piece(TAIL), TAIL_MUL);
let worst = 0;
for (const k of ['man', 'pin', 'sou']) {
  const col = mul(piece(path.join(DIR, 'color-' + k + '.wav.wav')), COLOR_MUL[k]);
  for (const n of [11, 12, 13]) {
    const num = piece(path.join(DIR, n + '.wav.wav'));
    const parts = [['攻め', head, GAP.head], ['色', col, GAP.color], ['数', num, GAP.num], ['尾', tail, 0]];
    const out = [];
    const seams = [];
    parts.forEach((p, i) => {
      out.push(p[1].s);
      if (p[2]) {
        out.push(gap(p[2]));
        const nx = parts[i + 1][1];
        const d = dB(lastRms(p[1].s, 0.12), firstRms(nx.s, 0.12));
        worst = Math.max(worst, Math.abs(d));
        seams.push(p[0] + '→' + parts[i + 1][0] + ' 間' + p[2].toFixed(2) + '秒 差' + d.toFixed(1) + 'dB');
      }
    });
    out.push(gap(END));
    const len = out.reduce((s, a) => s + a.length, 0), all = new Int16Array(len);
    let o = 0; out.forEach(a => { all.set(a, o); o += a.length; });
    const name = 'scene-some-' + k + '-' + n + '.wav.wav';
    if (!dry) writeWav(path.join(DIR, name), all);
    console.log(name.padEnd(26) + (len / RATE).toFixed(2) + '秒  ' + seams.join(' ／ '));
  }
}
console.log('\n声の大きさ合わせ（倍率）：攻め×' + head.g.toFixed(2) + ' 尾×' + tail.g.toFixed(2) + '（元の声のある所の大きさ ' + Math.round(head.rms0) + '／' + Math.round(tail.rms0) + '→目標 ' + TARGET_RMS + '）');
console.log('つなぎ目の大きさの差の最大 ' + worst.toFixed(1) + 'dB（目安 4dB 以内）' + (dry ? '【--dry：書いていない】' : ''));
