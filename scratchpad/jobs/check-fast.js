// check-fast.js — 本体の速い版の検査（node check-all --fast）を雲で回す（2026-09-24・手元の検査を雲へ-1）
//   ＊中身はリポジトリ直下の check-all.js そのもの。ここはそれを --fast で呼ぶだけ（検査の字は一つに保つ）。
//   ＊job.yml が koushu-handan.html・check.js・adv-check.js・check-all.js の変わった押しでこれを回し、
//     結果を reports/cloud-check-fast-<刻>.md へ返す。VAIO では回さない（Edge を立てると空きを食う）。
//   ＊配信の関門は今までどおり check.yml（速い版→フル版。落ちれば配信が止まる）。ここは結果を返す側。
//   ＊終了コードは check-all のものをそのまま返す（0＝全部 PASS）。
const { spawnSync } = require('child_process');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const r = spawnSync(process.execPath, [path.join(root, 'check-all.js'), '--fast'], { cwd: root, stdio: 'inherit', timeout: 1400000 });
if (r.error) { console.log('check-all を起こせなかった: ' + r.error.message); }
process.exit(r.status == null ? 1 : r.status);
