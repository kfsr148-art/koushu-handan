// flush-aite-run.js — 染めの相手あり測りを雲で回す呼び手（棚 #21・枠 二百五十五）。本体の台本は reports/flush-aite-20261124.js（scratchpad/jobs に置くと自動走りが起きるため reports/ に置いてある）。
// 既定 1230 秒・4本並列。結果は reports/cloud-flush-aite-<刻>.tsv に書かれ、job.yml が reports/ を押し戻す。
'use strict';
const cp = require('child_process'), path = require('path');
const r = cp.spawnSync(process.execPath, [path.join(__dirname, '..', '..', 'reports', 'flush-aite-20261124.js')], { stdio: 'inherit', env: process.env, timeout: 1500000 });
process.exit(r.status === null ? 1 : r.status);
