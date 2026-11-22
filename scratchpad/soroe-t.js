// 親指の絵（二枚目）の、手の所（x 25..100・y 70..140）の外を一枚目と同じ画素にする（切り替えても手の外は一画素も動かない）
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'yoshi-trans.js'), 'utf8');
const m = {}; new Function('module', 'require', 'process', src.split('const [, , IN, OUT, PROOF] = process.argv;')[0] + 'module.dec = dec; module.enc = enc;')(m, require, process);
const [, , A_, B_, OUT] = process.argv, A = m.dec(A_), B = m.dec(B_);
let n = 0;
for (let y = 0; y < 240; y++) for (let x = 0; x < 240; x++) { if (x >= 25 && x <= 100 && y >= 70 && y <= 140) continue; const i = (y * 240 + x) * 4; for (let c = 0; c < 4; c++) { if (B.d[i + c] !== A.d[i + c]) { n++; B.d[i + c] = A.d[i + c]; } } }
m.enc(B, OUT); console.log('揃えた値', n);
