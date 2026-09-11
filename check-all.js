#!/usr/bin/env node
/* 納品前の入口。リポジトリ直下で `node check-all` で実行する。
     check.js     … 本体の納品前チェック
     adv-check.js … 探偵編の回帰（即死罠・時間切れ）
   片方が落ちても止めず、両方を回してから一度にまとめる。
   どちらかが FAIL なら終了コード1、両方 PASS なら0。

   引数はそのまま両方へ渡す（例：`node check-all ../old.html`）。
   2本とも argv[2] に本体のパスを取る流儀なので、旧版に当てて効きを確かめる使い方も揃う。 */
'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = __dirname;
const args = process.argv.slice(2);
/* --fast は速い版（⑦の実測を 568x320 のひと視野に絞る）。目安2〜3分。
   通常の納品と push 前はこちら。台詞・レイアウトを触った回と、まとめ報告の前はフル版（約9分）。 */
const FAST = args.indexOf('--fast') >= 0;

/* ---- フル版の関門（2026-09-12・連携の穴-3 ⑩）----
   空き物理メモリが 2GB を切っている間は、フル版を回さない（終了コード3で抜ける）。
   速い版は今までどおり回す（push 前の pre-push は速い版だけ）。フル版は空いてから回す。
   ＊重いまま回すと、時間を測る節（⑯〜⑱）が重さでこけて FAIL に見える（2026-09-12 01:56 の pre-push）。 */
const FULL_MIN_FREE = 2 * 1024 * 1024 * 1024;
if (!FAST && require('os').freemem() < FULL_MIN_FREE) {
  console.log('フル版は回さない：空き物理メモリ ' + Math.round(require('os').freemem() / 1048576) +
    'MB（2048MB 未満）。速い版で押し、フル版は空いてから回す');
  process.exit(3);
}

const RUNS = [
  { name: 'check    ', file: 'check.js', title: '本体の納品前チェック' },
  { name: 'adv-check', file: 'adv-check.js', title: '探偵編の回帰（即死罠・時間切れ）' }
];

const results = [];
RUNS.forEach(run => {
  console.log('');
  console.log('════ ' + run.file + '　' + run.title + ' ' + '═'.repeat(Math.max(0, 30 - run.file.length)));
  const r = spawnSync(process.execPath, [path.join(ROOT, run.file)].concat(args), { stdio: 'inherit' });
  /* 検査そのものが起動できなかった場合（status が数字にならない）も落ちた扱いにする。 */
  results.push({ ...run, ok: r.status === 0, status: r.status });
});

console.log('');
console.log('まとめ（納品前チェック・' + (FAST ? '速い版' : 'フル版') + '）');
console.log('─'.repeat(52));
results.forEach(r => {
  console.log('  ' + (r.ok ? 'PASS' : 'FAIL') + '  ' + r.name + '  ' + r.title +
    (r.status === null || r.status === undefined ? '（起動できなかった）' : ''));
});
const bad = results.filter(r => !r.ok).length;
console.log('');
console.log(bad === 0 ? '両方PASS' : 'FAIL ' + bad + '件');
process.exit(bad === 0 ? 0 : 1);
