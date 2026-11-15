/* adpcm-web.js — ブラウザ側の声の読み（PCM と IMA ADPCM の両方）。2026-11-15・y1115-25 のヨシ
   ＊正本。本体（koushu-handan.html）の ADV_ADPCM_BEGIN〜ADV_ADPCM_END の間に、同じ字面で貼り込んである（check.js が突き合わせる）。
   ＊adpcm.js（node 側の符号化・復号）と、同じ結果の Int16Array を返す。 */
/* ADV_ADPCM_BEGIN */
const ADV_STEP = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];
const ADV_IDX = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];
/* WAV（形式 1＝PCM／形式 0x11＝IMA ADPCM）を Int16Array にする。声の部品は 24kHz・mono。 */
function advDecodeWav(ab) {
  const dv = new DataView(ab);
  let p = 12, tag = 0, align = 0, per = 0, nsamp = -1, ds = -1, dl = 0;
  while (p + 8 <= dv.byteLength) {
    const id = String.fromCharCode(dv.getUint8(p), dv.getUint8(p + 1), dv.getUint8(p + 2), dv.getUint8(p + 3)), len = dv.getUint32(p + 4, true);
    if (id === 'fmt ') { tag = dv.getUint16(p + 8, true); align = dv.getUint16(p + 20, true); if (len >= 20) { per = dv.getUint16(p + 26, true); } }
    else if (id === 'fact') { nsamp = dv.getUint32(p + 8, true); }
    else if (id === 'data') { ds = p + 8; dl = Math.min(len, dv.byteLength - ds); break; }
    p += 8 + len + (len & 1);
  }
  if (ds < 0) { throw new Error('data'); }
  if (tag === 1) { const n = dl >> 1, s = new Int16Array(n); for (let i = 0; i < n; i++) { s[i] = dv.getInt16(ds + i * 2, true); } return s; }
  if (tag !== 0x11) { throw new Error('fmt'); }
  const nb = Math.floor(dl / align), out = new Int16Array(nb * per);
  for (let b = 0; b < nb; b++) {
    const o = ds + b * align;
    let pred = dv.getInt16(o, true), index = dv.getUint8(o + 2), q = b * per;
    out[q++] = pred;
    for (let i = 0; i < align - 4; i++) {
      const byte = dv.getUint8(o + 4 + i);
      for (let h = 0; h < 2; h++) {
        const code = h ? (byte >> 4) : (byte & 15), step = ADV_STEP[index];
        let vp = step >> 3; if (code & 4) { vp += step; } if (code & 2) { vp += step >> 1; } if (code & 1) { vp += step >> 2; }
        pred += (code & 8) ? -vp : vp; if (pred > 32767) { pred = 32767; } else if (pred < -32768) { pred = -32768; }
        index += ADV_IDX[code]; if (index < 0) { index = 0; } else if (index > 88) { index = 88; }
        out[q++] = pred;
      }
    }
  }
  return nsamp >= 0 ? out.subarray(0, nsamp) : out;
}
/* ADV_ADPCM_END */
if (typeof module !== 'undefined') { module.exports = { advDecodeWav }; }
