// advdup-full-run.js — 助言の通し読み＋要る声の洗い出しの全部版を雲で回す呼び手（枠 三百二十三）。速い版（advdup-scan-run.js）と置き場が別（reports/advdup-voice-plan/）。
'use strict';
const cp = require('child_process'), path = require('path');
const r = cp.spawnSync(process.execPath, [path.join(__dirname, 'advdup-voice-plan.js')], { stdio: 'inherit', env: process.env, timeout: 1500000 });
process.exit(r.status === null ? 1 : r.status);
