// v1507 の確かめ（雲で回す・2026-11-18）：面白みが終わりに来る時は closer を付けない形で、30秒に収まる一言が無い組の数を前回（v1506＝132組）と同じ物差し（nofit3.js）で数える。
// 材料：リポジトリ直下の核（advice-tone-core.js）・台帳（voice-advice-*.js）・本体 koushu-handan.html（head-pool が一言の候補を読む）と、scratchpad/jobs/v1507/ の写し（sim・head-pool・nofit3）。
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..', '..'), SUB = path.join(__dirname, 'v1507');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v1507-'));
['advice-tone-core.js', 'voice-advice-catalog.js', 'voice-advice-open.js', 'voice-advice-persona.js', 'voice-advice-dial.js', 'voice-advice-dial.json'].forEach(f => fs.copyFileSync(path.join(ROOT, f), path.join(tmp, f)));
fs.readdirSync(SUB).forEach(f => fs.copyFileSync(path.join(SUB, f), path.join(tmp, f)));
const t0 = Date.now();
cp.execFileSync('node', ['nofit3.js'], { cwd: tmp, stdio: 'inherit', env: Object.assign({}, process.env, { HEAD_HTML: path.join(ROOT, 'koushu-handan.html') }), timeout: 25 * 60 * 1000 });
console.log('nofit3 所要', Math.round((Date.now() - t0) / 1000) + '秒');
