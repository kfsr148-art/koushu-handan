#!/usr/bin/env node
/* 納品前の入口。リポジトリ直下で `node check-all` で実行する。
     check.js     … 本体の納品前チェック
     adv-check.js … 探偵編の回帰（即死罠・時間切れ）
   片方が落ちても止めず、両方を回してから一度にまとめる。
   どちらかが FAIL なら終了コード1、両方 PASS なら0。

   引数はそのまま両方へ渡す（例：`node check-all ../old.html`）。
   2本とも argv[2] に本体のパスを取る流儀なので、旧版に当てて効きを確かめる使い方も揃う。 */
'use strict';

// この機械（VAIO・4GB）では Edge を立てない決め：headless Edge は一枚で数分かかり空きを食って見張りも起こし直しも止める（2026-09-19 に⑦で48分・⑦190秒・⑯30秒で上限）ので、Edge を立てる段は手元の速い版では飛ばし、雲のフル版で回す。
const FAST_SKIP_EDGE_STAGES = ['⑦', '⑯', '⑰', '⑱', '㉓', 'adv-check'];   // 空にすれば手元でも回す。雲（CI）では常に全部回す

/* ---- 速い版の上限（2026-09-19・今日の止まりの直し ②）----
   ＊2026-09-19 19:03 に手元で回した速い版が、⑦（狭い画面での溢れ）の中で50分近く這い続けた。
     空きが700MB台まで落ち、headless の Edge を一枚立てるたびに数分かかった。上限が無いので、
     止まったのか進んでいるのか外から分からず、その間に窓の起こし直しまで重さで空振りした。
   ＊物差しは雲（check.yml の「速い版」の段）の直近5回——83・81・114・109・109秒、中央値109秒。
     段ごとの中央値は、そのうちログが読めた3回から取った（下の表）。
   ＊上限は中央値の3倍。ただし中央値が1秒に満たない段は3倍が0秒になって即座に切れるので、
     段の上限には床（FAST_STAGE_FLOOR_SEC）を置く。
   ＊超えたら、止まった段の名と経過秒を出し、子（孫の Edge ごと）を落として FAIL で抜ける。
   ＊フル版には掛けない（視野が21で、所要がまるで違う）。 */
const FAST_TOTAL_MEDIAN_SEC = 109;
const FAST_TOTAL_LIMIT_SEC = FAST_TOTAL_MEDIAN_SEC * 3;          // 327秒
const FAST_STAGE_FLOOR_SEC = 30;
const FAST_STAGE_MEDIAN_SEC = {
  '⑦': 63.3, '⑯': 5.3, '⑰': 3.8, '⑱': 4.0, 'adv-check': 6.1
};                                                                 // 載っていない段は中央値1秒未満
const stageLimitSec = no => Math.max(FAST_STAGE_FLOOR_SEC, Math.ceil((FAST_STAGE_MEDIAN_SEC[no] || 0) * 3));

const path = require('path');
const { spawn, spawnSync } = require('child_process');

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

/* 段の見出し。check.js の head() が「⑦ 狭い画面での溢れ」の形で一行に出す。 */
const STAGE_HEAD = /^([①-⑳㉑-㉟])[ ](.*)$/;
const T0 = Date.now();
const secSince = t => Math.round((Date.now() - t) / 100) / 10;

/* 子を孫ごと落とす。Windows は taskkill /T、ほかは組ごと SIGKILL。 */
function killTree(child) {
  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    } else {
      process.kill(-child.pid, 'SIGKILL');
    }
  } catch (e) { try { child.kill('SIGKILL'); } catch (e2) { } }
}

function runOne(run) {
  return new Promise(resolve => {
    const own = (run.file === 'check.js' && FAST && FAST_SKIP_EDGE_STAGES.length && !process.env.CI)
      ? ['--skip=' + FAST_SKIP_EDGE_STAGES.join(',')] : [];
    const child = spawn(process.execPath, [path.join(ROOT, run.file)].concat(args, own),
      { stdio: ['ignore', 'pipe', 'inherit'], detached: process.platform !== 'win32', windowsHide: true });
    /* adv-check は中の段を数えず、丸ごと一つの段として見る。 */
    let stage = run.file === 'check.js' ? '（起動）' : 'adv-check';
    let stageTitle = run.file === 'check.js' ? '（最初の段が出る前）' : run.title;
    let stageT = Date.now();
    let cut = null, rest = '';
    child.stdout.on('data', d => {
      process.stdout.write(d);
      if (run.file !== 'check.js') return;
      const lines = (rest + d.toString('utf8')).split('\n');
      rest = lines.pop();
      lines.forEach(l => {
        const m = l.replace(/\r$/, '').match(STAGE_HEAD);
        if (m) { stage = m[1]; stageTitle = m[1] + ' ' + m[2]; stageT = Date.now(); }
      });
    });
    const timer = !FAST ? null : setInterval(() => {
      const st = secSince(stageT), tot = secSince(T0), lim = stageLimitSec(stage);
      let why = '';
      if (st > lim) why = '段の上限 ' + lim + '秒';
      else if (tot > FAST_TOTAL_LIMIT_SEC) why = '全体の上限 ' + FAST_TOTAL_LIMIT_SEC + '秒';
      if (!why) return;
      cut = { stage: stageTitle, stageSec: st, totalSec: tot, why };
      clearInterval(timer);
      killTree(child);
    }, 1000);
    child.on('error', () => { });
    child.on('close', code => {
      if (timer) clearInterval(timer);
      resolve({ ...run, ok: !cut && code === 0, status: cut ? 'cut' : code, cut });
    });
  });
}

(async () => {
  const results = [];
  for (const run of RUNS) {
    console.log('');
    console.log('════ ' + run.file + '　' + run.title + ' ' + '═'.repeat(Math.max(0, 30 - run.file.length)));
    /* adv-check も Edge で駆動する検査なので、手元の速い版では丸ごと飛ばす（雲では回す）。 */
    if (run.file === 'adv-check.js' && FAST && FAST_SKIP_EDGE_STAGES.indexOf('adv-check') >= 0 && !process.env.CI) {
      console.log('    飛ばした（手元の速い版では Edge を立てない）。adv-check は雲のフル版が回す');
      results.push({ ...run, ok: true, skip: true, status: 0 });
      continue;
    }
    const r = await runOne(run);
    results.push(r);
    if (r.cut) {
      console.log('');
      console.log('✗ 上限で切った：止まった段 ' + r.cut.stage + '・段の経過 ' + r.cut.stageSec + '秒・全体の経過 ' +
        r.cut.totalSec + '秒（' + r.cut.why + '）');
      break;                               // 切ったら残りは回さずに抜ける
    }
  }

  console.log('');
  console.log('まとめ（納品前チェック・' + (FAST ? '速い版' : 'フル版') + '）');
  console.log('─'.repeat(52));
  RUNS.forEach(run => {
    const r = results.find(x => x.file === run.file);
    /* 検査そのものが起動できなかった場合（status が数字にならない）も落ちた扱いにする。 */
    const tag = !r ? 'FAIL' : (r.skip ? 'SKIP' : (r.ok ? 'PASS' : 'FAIL'));
    const why = !r ? '（上限で切ったので回していない）'
      : r.cut ? '（上限で切った：' + r.cut.stage + '・' + r.cut.stageSec + '秒）'
      : (r.status === null || r.status === undefined ? '（起動できなかった）' : '');
    console.log('  ' + tag + '  ' + run.name + '  ' + run.title + why);
  });
  const bad = RUNS.filter(run => { const r = results.find(x => x.file === run.file); return !r || !r.ok; }).length;
  console.log('');
  if (FAST) console.log('所要 ' + secSince(T0) + '秒（上限 ' + FAST_TOTAL_LIMIT_SEC + '秒）');
  const skipN = results.filter(r => r.skip).length;
  console.log(bad > 0 ? 'FAIL ' + bad + '件' : (skipN ? 'PASS（' + skipN + '本は飛ばした）' : '両方PASS'));
  process.exit(bad === 0 ? 0 : 1);
})();
