// v1508：執事×九つの方言を入れた後の声の台本を、全組み合わせを舐めて組み直す（雲で回す・2026-11-19・y1119-0414）。
//   材料と組み方は v1507-findmissing.js と同じ（直下の核・台帳・本体と scratchpad/jobs/v1507/ の写し）。
//   出力：reports/v1508-voice-plan/ に voice-advice-dial.json・.txt（台本・手元で直下と voice-plan/dial.txt へ移す）と reports/v1508-voice-plan.md（新しい声の数・「浮き」を含む声の名）。
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..', '..'), SUB = path.join(__dirname, 'v1507');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v1508-'));
['advice-tone-core.js', 'voice-advice-catalog.js', 'voice-advice-open.js', 'voice-advice-persona.js', 'voice-advice-dial.js'].forEach(f => fs.copyFileSync(path.join(ROOT, f), path.join(tmp, f)));
fs.readdirSync(SUB).forEach(f => fs.copyFileSync(path.join(SUB, f), path.join(tmp, f)));
const old = JSON.parse(fs.readFileSync(path.join(ROOT, 'voice-advice-dial.json'), 'utf8'));
const t0 = Date.now();
cp.execFileSync('node', ['voice-advice-dial.js'], { cwd: tmp, stdio: 'inherit', env: Object.assign({}, process.env, { HEAD_HTML: path.join(ROOT, 'koushu-handan.html') }), timeout: 26 * 60 * 1000 });
const nw = JSON.parse(fs.readFileSync(path.join(tmp, 'voice-advice-dial.json'), 'utf8'));
const OD = path.join(ROOT, 'reports', 'v1508-voice-plan'); fs.mkdirSync(OD, { recursive: true });   // job.yml が押し戻すのは reports/ だけ。手元で直下へ移す
fs.copyFileSync(path.join(tmp, 'voice-advice-dial.json'), path.join(OD, 'voice-advice-dial.json'));
fs.copyFileSync(path.join(tmp, 'voice-advice-dial.txt'), path.join(OD, 'voice-advice-dial.txt'));
const add = Object.keys(nw).filter(k => !(k in old)), gone = Object.keys(old).filter(k => !(k in nw));
const has = n => fs.existsSync(path.join(ROOT, n + '.m4a'));
const uki = Object.keys(nw).filter(k => /浮き/.test(nw[k]));
let md = '# v1508 の声の台本（雲・' + Math.round((Date.now() - t0) / 1000) + '秒）\n\n- 台本 ' + Object.keys(nw).length + ' 本（前 ' + Object.keys(old).length + ' 本）\n- 新しく要る声 ' + add.length + ' 本・台本から外れた声 ' + gone.length + ' 本\n- 声のファイルがまだ無い物 ' + Object.keys(nw).filter(k => !has(k)).length + ' 本\n- 「浮き」を含む声 ' + uki.length + ' 本（うち声のファイルがある物 ' + uki.filter(has).length + ' 本）\n\n## 「浮き」を含む声の名\n\n' + uki.join('\n') + '\n\n## 新しい声（字）\n\n' + add.map(k => '- ' + k + '\t' + nw[k]).join('\n') + '\n';
fs.writeFileSync(path.join(ROOT, 'reports', 'v1508-voice-plan.md'), md);
fs.writeFileSync(path.join(ROOT, 'reports', 'v1508-voice-uki.txt'), uki.join('\n') + '\n');
console.log(md.split('\n').slice(0, 8).join('\n'));
