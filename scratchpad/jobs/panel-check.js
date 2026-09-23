// panel-check.js — 返事パネルの検査を雲で回す（2026-09-23・panel-check は雲で-1）
//   ＊中身はリポジトリ直下の panel-check.js そのもの。ここはそれを呼ぶだけ（検査の字は一つに保つ）。
//   ＊job.yml が panel.html か panel-check.js の変わった押しでこれを回し、
//     結果を reports/cloud-panel-check-<刻>.md へ返す。VAIO では回さない（Edge が空きを食い、常駐の見張りが止まった）。
//   ＊終了コードは panel-check.js のものをそのまま返す（0＝全部合い）。
const { spawnSync } = require('child_process');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const r = spawnSync(process.execPath, [path.join(root, 'panel-check.js')], { cwd: root, stdio: 'inherit', timeout: 1400000 });
if (r.error) { console.log('panel-check を起こせなかった: ' + r.error.message); }
process.exit(r.status == null ? 1 : r.status);
