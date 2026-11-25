// tanyao-aite-run.js — tanyao の相手あり測りを雲で回す呼び手（橋の枠 二百五十六）。本体の台本は reports/dora-aite-20261125.js（scratchpad/jobs に置くと自動走りが起きるため reports/ に置いてある）。
// 既定 1230 秒・4本並列。結果は reports/cloud-dora-aite-<刻>.tsv に書かれ、job.yml が reports/ を押し戻す。
'use strict';
const cp = require('child_process'), path = require('path');
const r = cp.spawnSync(process.execPath, [path.join(__dirname, '..', '..', 'reports', 'dora-aite-20261125.js')], { stdio: 'inherit', env: process.env, timeout: 1500000 });
process.exit(r.status === null ? 1 : r.status);
