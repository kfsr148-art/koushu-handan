// advdup-scan-run.js — 助言の通し読み（重なり・中身のない一文・語尾の二重と連続・切れ端）の速い数え上げを雲で回す呼び手（枠 三百二十三）
//   本体の台本は advdup-voice-plan.js。ここは PLAN_TAG=fast・DUP_FAST=1 で呼ぶだけ（声の洗い出しの全部は走らせない・速い版）。
'use strict';
const cp = require('child_process'), path = require('path');
const r = cp.spawnSync(process.execPath, [path.join(__dirname, 'advdup-voice-plan.js')], { stdio: 'inherit', env: Object.assign({}, process.env, { PLAN_TAG: 'fast', DUP_FAST: '1' }), timeout: 1500000 });
process.exit(r.status === null ? 1 : r.status);
