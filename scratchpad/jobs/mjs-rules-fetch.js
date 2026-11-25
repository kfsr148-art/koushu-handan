// 雲で：雀魂公式の詳細ルール（https://mahjongsoul.com/news/46）を、ブラウザで描画して本文の字だけ取る（2026-11-25・橋の枠 三百三 一）
//   ＊WebFetch では JavaScript で描かれる本文が取れなかった（タイトルだけ）ので、headless の Chrome で描画した後の字を reports/mjs-rules/ へ置く。
//   ＊読むだけ。ドメインの他のページへは行かない（番地は決め打ちの一つ）。
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..', '..'), OUT = path.join(ROOT, 'reports', 'mjs-rules');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'https://mahjongsoul.com/news/46';
const cands = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(p => fs.existsSync(p));
if (!cands.length) { console.log('ブラウザが無い'); process.exit(1); }
const ud = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-mjs-'));
let html = '';
try {
  html = cp.execFileSync(cands[0], ['--headless=new', '--no-sandbox', '--disable-gpu', '--user-data-dir=' + ud, '--virtual-time-budget=20000', '--dump-dom', URL], { encoding: 'utf8', timeout: 120000, maxBuffer: 1 << 26 });
} catch (e) { console.log('描画が失敗: ' + String(e.message).slice(0, 200)); process.exit(1); }
fs.writeFileSync(path.join(OUT, '46.dom.html'), html);
const text = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr)[^>]*>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\n\s*\n+/g, '\n').trim();
fs.writeFileSync(path.join(OUT, '46.txt'), text);
console.log('DOM ' + html.length + '字・本文 ' + text.length + '字');
console.log(text.slice(0, 600));
