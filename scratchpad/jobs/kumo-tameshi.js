// kumo-tameshi.js — 雲へ回す道の作り値（2026-09-21・雲へ回す-1）
//   ＊軽い。回る所が VAIO ではなく雲であることを、機械の顔つきで見せるだけ。
//   ＊この綴りが reports/cloud-kumo-tameshi-<刻>.md になって戻れば、道は通っている。
const os = require('os');

const mb = (n) => Math.round(n / 1024 / 1024);
console.log('ここは雲か VAIO か、機械の顔で見る');
console.log('  host      : ' + os.hostname());
console.log('  platform  : ' + os.platform() + ' / ' + os.release());
console.log('  cpu       : ' + os.cpus().length + '個 / ' + os.cpus()[0].model);
console.log('  memory    : 全体 ' + mb(os.totalmem()) + 'MB / 空き ' + mb(os.freemem()) + 'MB');
console.log('  node      : ' + process.version);
console.log('');
console.log('＊VAIO は全体 3,975MB・2コアの Windows。上がそれと違えば、雲で回っている。');

// 少しだけ働いてみる（重い仕事の代わり）
const t0 = Date.now();
let s = 0;
for (let i = 0; i < 5e6; i++) { s += Math.sqrt(i); }
console.log('');
console.log('試しの計算 : 500万回の平方根 = ' + s.toFixed(0) + '（' + (Date.now() - t0) + 'ms）');
