// 縁からつながる外側の白だけを透明にする（作法21：明るさだけで抜かない・縁から繋がる所だけ）
// 使い方: node yoshi-trans.js <入力png> <出力png> [proof-prefix]
const fs = require('fs'), zlib = require('zlib');
function dec(file) {
  const b = fs.readFileSync(file); let p = 8, w = 0, h = 0, ct = 0; const id = [];
  while (p < b.length) { const L = b.readUInt32BE(p), t = b.toString('ascii', p + 4, p + 8), d = b.slice(p + 8, p + 8 + L);
    if (t === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; if (d[8] !== 8 || d[12]) throw new Error('8bit非インタレースでない'); }
    if (t === 'IDAT') id.push(d); p += 12 + L; }
  const ch = { 2: 3, 6: 4 }[ct]; if (!ch) throw new Error('色の型 ' + ct);
  const raw = zlib.inflateSync(Buffer.concat(id)), st = w * ch, out = Buffer.alloc(w * h * 4); let prev = Buffer.alloc(st);
  for (let y = 0; y < h; y++) { const ft = raw[y * (st + 1)], cur = Buffer.alloc(st);
    for (let x = 0; x < st; x++) { const a = x >= ch ? cur[x - ch] : 0, u = prev[x], c = x >= ch ? prev[x - ch] : 0; let v = raw[y * (st + 1) + 1 + x];
      if (ft === 1) v += a; else if (ft === 2) v += u; else if (ft === 3) v += (a + u) >> 1; else if (ft === 4) { const pp = a + u - c, pa = Math.abs(pp - a), pb = Math.abs(pp - u), pc = Math.abs(pp - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? u : c); }
      cur[x] = v & 255; }
    for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; out[o] = cur[x * ch]; out[o + 1] = cur[x * ch + 1]; out[o + 2] = cur[x * ch + 2]; out[o + 3] = ch === 4 ? cur[x * ch + 3] : 255; }
    prev = cur; }
  return { w, h, d: out };
}
const CRC = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc(buf) { let c = 0xffffffff; for (const x of buf) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(t, d) { const L = Buffer.alloc(4); L.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t, 'ascii'), d]); const C = Buffer.alloc(4); C.writeUInt32BE(crc(td)); return Buffer.concat([L, td, C]); }
function enc(img, file) {
  const { w, h, d } = img, ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6; ih[10] = 0; ih[11] = 0; ih[12] = 0;
  const raw = Buffer.alloc(h * (w * 4 + 1)); for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; d.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
}
const [, , IN, OUT, PROOF] = process.argv;
const img = dec(IN), { w, h, d } = img, TH = 235;
const white = (i) => d[i * 4] >= TH && d[i * 4 + 1] >= TH && d[i * 4 + 2] >= TH;
const bg = new Uint8Array(w * h), q = [];
const seed = (x, y) => { const i = y * w + x; if (!bg[i] && white(i)) { bg[i] = 1; q.push(i); } };
// 縁の一周は色を問わず種（作法21：元絵の縁に薄い枠が一画素回ることがある）。ただし白でない縁は背景に含めない
for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
while (q.length) { const i = q.pop(), x = i % w, y = (i / w) | 0;
  if (x > 0) seed(x - 1, y); if (x < w - 1) seed(x + 1, y); if (y > 0) seed(x, y - 1); if (y < h - 1) seed(x, y + 1); }
// 背景からの距離（4近傍・2画素まで）
const dist = new Uint8Array(w * h).fill(255); let fr = [];
for (let i = 0; i < w * h; i++) if (bg[i]) { dist[i] = 0; fr.push(i); }
for (let k = 1; k <= 2; k++) { const nx = []; for (const i of fr) { const x = i % w, y = (i / w) | 0;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue; const j = Y * w + X; if (dist[j] > k) { dist[j] = k; nx.push(j); } } } fr = nx; }
let nT = 0, nS = 0;
for (let i = 0; i < w * h; i++) {
  const o = i * 4;
  if (bg[i]) { d[o] = d[o + 1] = d[o + 2] = 0; d[o + 3] = 0; nT++; continue; }
  if (dist[i] <= 2) { // 縁2画素だけ：白っぽい（白に混ざった）画素を半透明にしてアンマット
    const r = d[o], g = d[o + 1], b = d[o + 2], mn = Math.min(r, g, b);
    if (mn >= 180) { // 黄色の字（B≈79）・黒縁・灰は当たらない
      const a = Math.max(0, Math.min(1, (TH - mn) / (TH - 180)));
      if (a <= 0.02) { d[o + 3] = 0; d[o] = d[o + 1] = d[o + 2] = 0; nT++; continue; }
      const un = (c) => Math.max(0, Math.min(255, Math.round((c - (1 - a) * 255) / a)));
      d[o] = un(r); d[o + 1] = un(g); d[o + 2] = un(b); d[o + 3] = Math.round(a * 255); nS++;
    }
  }
}
enc(img, OUT);
console.log(OUT, w + 'x' + h, '透明', nT, '半透明', nS, '四隅alpha', [0, w - 1, (h - 1) * w, h * w - 1].map(i => d[i * 4 + 3]).join(','));
if (PROOF) { // 暗背景（#14241c パネルの地）と白地に合成して3倍に拡大
  for (const [nm, bgc] of [['dark', [0x14, 0x24, 0x1c]], ['light', [255, 255, 255]]]) {
    const S = 3, W = w * S, H = h * S, o = Buffer.alloc(W * H * 4);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const s = (((y / S) | 0) * w + ((x / S) | 0)) * 4, t = (y * W + x) * 4, a = d[s + 3] / 255;
      for (let c = 0; c < 3; c++) o[t + c] = Math.round(d[s + c] * a + bgc[c] * (1 - a)); o[t + 3] = 255; }
    enc({ w: W, h: H, d: o }, PROOF + '-' + nm + '.png');
  }
}
