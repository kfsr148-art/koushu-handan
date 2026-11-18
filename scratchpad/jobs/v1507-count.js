// 今の声（v1506）の方言の字の崩れを人格×方言で数える（雲で回す・2026-11-18）。
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..', '..'), SUB = path.join(__dirname, 'v1507');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v1507c-'));
['advice-tone-core.js', 'voice-advice-catalog.js', 'voice-advice-open.js', 'voice-advice-persona.js', 'voice-advice-dial.js', 'voice-advice-dial.json'].forEach(f => fs.copyFileSync(path.join(ROOT, f), path.join(tmp, f)));
fs.readdirSync(SUB).forEach(f => fs.copyFileSync(path.join(SUB, f), path.join(tmp, f)));
const t0 = Date.now();
cp.execFileSync('node', ['count-broken.js'], { cwd: tmp, stdio: 'inherit', env: Object.assign({}, process.env, { HEAD_HTML: path.join(ROOT, 'koushu-handan.html') }), timeout: 26 * 60 * 1000 });
console.log('所要', Math.round((Date.now() - t0) / 1000) + '秒');
