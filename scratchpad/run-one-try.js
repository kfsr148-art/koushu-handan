// run-one-try.js — 枠一つを claude -p の一走りで回す試作（枠 百四十九・2026-11-22）。本物の台帳・見張り・panel には一切触れない（一時の置き場の中だけで動く）。
//   流れ：枠の文（frame.md）→ claude -p（--output-format json）の一走り → 結果から札を機械が作る → 済みの確かめ役（読むだけ・条件を実行して ○×）→ ○なら閉じる・×なら訳を付けて差し戻す。
//   ＊hooks を避けるため --setting-sources project（user の設定＝turn-mark.js などを読まない）。--bare は OAuth を使わず（Not logged in）使えない。
//   ＊上限：外から timeout（既定 240秒）・--max-budget-usd（既定 0.5）。時間の上限の旗は無い。
//   使い方：node scratchpad/run-one-try.js <作業dir> <枠のmd> [<済みの条件の js（○なら exit 0）>]
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const dir = path.resolve(process.argv[2] || '.'), frameMd = path.resolve(process.argv[3] || 'frame.md'), cond = process.argv[4] ? path.resolve(process.argv[4]) : '';
const TIMEOUT = Number(process.env.RUN_TIMEOUT_SEC || 240) * 1000, BUDGET = process.env.RUN_BUDGET_USD || '0.5';
const frame = fs.readFileSync(frameMd, 'utf8');
const t0 = Date.now();
const prompt = '次の枠を、この作業ディレクトリの中だけで実行せよ。終わったら、した事を二文以内で報告せよ（返事はそのまま札の本文になる）。\n\n' + frame;
const args = ['-p', '--output-format', 'json', '--setting-sources', 'project', '--allowedTools', 'Read', 'Write', 'Edit', '--max-budget-usd', BUDGET];
const r = cp.spawnSync('claude', args, { cwd: dir, input: prompt, encoding: 'utf8', timeout: TIMEOUT, killSignal: 'SIGKILL', shell: process.platform === 'win32', maxBuffer: 1 << 26 });
const sec = Math.round((Date.now() - t0) / 1000);
let o = null; try { o = JSON.parse(String(r.stdout || '').trim().split('\n').pop()); } catch (e) { }
if (!o) { console.log(JSON.stringify({ ok: false, why: r.error ? '走りが落ちた（' + r.error.code + '）' : '結果の json が読めない', stderr: String(r.stderr || '').slice(0, 200), stdout: String(r.stdout || '').slice(0, 200), sec })); process.exit(2); }
const card = { title: o.is_error ? '🪟 走りが落ちました' : '✅ 終わりました（返事不要）', body: String(o.result || '').trim(), meta: { session_id: o.session_id, cost_usd: o.total_cost_usd, turns: o.num_turns, terminal: o.terminal_reason, stop: o.stop_reason, denials: (o.permission_denials || []).length, sec } };
// 済みの確かめ役：条件（js）を実行して ○×。窓の「済んだ」の申し出は信じない（枠 百五十一）
let verdict = { ok: null, why: '済みの条件が無い＝本人のヨシで閉じる' };
if (cond) { const v = cp.spawnSync(process.execPath, [cond, dir], { encoding: 'utf8', timeout: 30000 }); verdict = { ok: v.status === 0, why: String(v.stdout || v.stderr || '').trim().slice(0, 200) }; }
const closed = !o.is_error && verdict.ok === true;
console.log(JSON.stringify({ card, verdict, 閉じてよい: closed, 差し戻し: !o.is_error && verdict.ok === false }, null, 1));
