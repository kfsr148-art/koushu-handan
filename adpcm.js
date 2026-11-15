#!/usr/bin/env node
/* adpcm.js — IMA ADPCM（WAV 形式タグ 0x11・4ビット）の符号化と復号（2026-11-15・y1115-25 のヨシ）
   ＊目的：助言の声の部品（24kHz・mono・16bit の PCM）を、同じ24kHzのまま 4 分の 1 弱の大きさにする。
   ＊本体（koushu-handan.html）の playAdvice も、同じ復号を使う（adviceAdpcmDecode）。ここが正本。
   ＊ブロックは 256 バイト（先頭 4 バイト＋252 バイト＝504 個の4ビット符号）、1 ブロック 505 サンプル。 */
'use strict';
const STEP = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];
const IDX = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];
const BLOCK = 256, PER = 505;
function clamp16(v) { return v > 32767 ? 32767 : (v < -32768 ? -32768 : v); }
function encode(s, rate) {   // s：Int16Array → WAV の Buffer
  const nb = Math.ceil(s.length / PER), data = Buffer.alloc(nb * BLOCK);
  let index = 0;
  for (let b = 0; b < nb; b++) {
    const o = b * BLOCK, base = b * PER;
    let pred = s[base] === undefined ? 0 : s[base];
    data.writeInt16LE(pred, o); data.writeUInt8(index, o + 2); data.writeUInt8(0, o + 3);
    let lo = true, byte = 0, w = o + 4;
    for (let k = 1; k < PER; k++) {
      const v = (base + k < s.length) ? s[base + k] : pred;
      let diff = v - pred, code = 0, step = STEP[index];
      if (diff < 0) { code = 8; diff = -diff; }
      if (diff >= step) { code |= 4; diff -= step; }
      if (diff >= (step >> 1)) { code |= 2; diff -= (step >> 1); }
      if (diff >= (step >> 2)) { code |= 1; }
      let vp = step >> 3; if (code & 4) vp += step; if (code & 2) vp += step >> 1; if (code & 1) vp += step >> 2;
      pred = clamp16(pred + ((code & 8) ? -vp : vp));
      index += IDX[code]; if (index < 0) index = 0; if (index > 88) index = 88;
      if (lo) { byte = code; lo = false; } else { data.writeUInt8(byte | (code << 4), w++); lo = true; }
    }
  }
  const fmt = Buffer.alloc(20); fmt.writeUInt16LE(0x11, 0); fmt.writeUInt16LE(1, 2); fmt.writeUInt32LE(rate, 4);
  fmt.writeUInt32LE(Math.round(rate * BLOCK / PER), 8); fmt.writeUInt16LE(BLOCK, 12); fmt.writeUInt16LE(4, 14); fmt.writeUInt16LE(2, 16); fmt.writeUInt16LE(PER, 18);
  const fact = Buffer.alloc(4); fact.writeUInt32LE(s.length, 0);
  const total = 4 + (8 + 20) + (8 + 4) + (8 + data.length);
  const h = Buffer.alloc(12); h.write('RIFF', 0); h.writeUInt32LE(total, 4); h.write('WAVE', 8);
  const c = (id, len) => { const x = Buffer.alloc(8); x.write(id, 0); x.writeUInt32LE(len, 4); return x; };
  return Buffer.concat([h, c('fmt ', 20), fmt, c('fact', 4), fact, c('data', data.length), data]);
}
function decode(buf) {   // WAV の Buffer → { rate, s:Int16Array }。PCM（形式 1）も読む
  if (buf.toString('ascii', 0, 4) !== 'RIFF') throw new Error('RIFF でない');
  let p = 12, fmtTag = 0, rate = 0, align = 0, per = 0, nsamp = -1, dStart = -1, dLen = 0;
  while (p + 8 <= buf.length) {
    const id = buf.toString('ascii', p, p + 4), len = buf.readUInt32LE(p + 4);
    if (id === 'fmt ') { fmtTag = buf.readUInt16LE(p + 8); rate = buf.readUInt32LE(p + 12); align = buf.readUInt16LE(p + 20); if (len >= 20) per = buf.readUInt16LE(p + 26); }
    else if (id === 'fact') { nsamp = buf.readUInt32LE(p + 8); }
    else if (id === 'data') { dStart = p + 8; dLen = Math.min(len, buf.length - dStart); break; }
    p += 8 + len + (len & 1);
  }
  if (dStart < 0) throw new Error('data が無い');
  if (fmtTag === 1) { const n = dLen >> 1, s = new Int16Array(n); for (let i = 0; i < n; i++) s[i] = buf.readInt16LE(dStart + i * 2); return { rate: rate, s: s }; }
  if (fmtTag !== 0x11) throw new Error('未対応の形式 ' + fmtTag);
  const nb = Math.floor(dLen / align), out = new Int16Array(nb * per);
  for (let b = 0; b < nb; b++) {
    const o = dStart + b * align; let pred = buf.readInt16LE(o), index = buf[o + 2], q = b * per;
    out[q++] = pred;
    for (let i = 0; i < align - 4; i++) {
      const byte = buf[o + 4 + i];
      for (let h = 0; h < 2; h++) {
        const code = h ? (byte >> 4) : (byte & 15), step = STEP[index];
        let vp = step >> 3; if (code & 4) vp += step; if (code & 2) vp += step >> 1; if (code & 1) vp += step >> 2;
        pred = clamp16(pred + ((code & 8) ? -vp : vp));
        index += IDX[code]; if (index < 0) index = 0; if (index > 88) index = 88;
        out[q++] = pred;
      }
    }
  }
  return { rate: rate, s: nsamp >= 0 ? out.subarray(0, nsamp) : out };
}
module.exports = { encode, decode, STEP, IDX, BLOCK, PER };
