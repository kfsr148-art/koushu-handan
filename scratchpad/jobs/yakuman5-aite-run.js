// yakuman5-aite-run.js — 残りの役満五つの相手あり測りを雲で回す呼び手（枠 二百五十七）。本体の台本は reports/yakuman5-aite-20261124.js（scratchpad/jobs に置くと自動走りが起きるため reports/ に置いてある）。
// 既定 1230 秒・4本並列・五つ全部。結果は reports/cloud-yakuman5-aite-<刻>.tsv に書かれ、job.yml が reports/ を押し戻す。
'use strict';
const cp = require('child_process'), path = require('path');
const r = cp.spawnSync(process.execPath, [path.join(__dirname, '..', '..', 'reports', 'yakuman5-aite-20261124.js')], { stdio: 'inherit', env: process.env, timeout: 1500000 });
process.exit(r.status === null ? 1 : r.status);
