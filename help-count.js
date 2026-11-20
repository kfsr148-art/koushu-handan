// help-count.js — 裏の仕事（手伝い・雲・裏の命令）の数を数える所は、ここ一つ（2026-11-20 本人の枠）。
//   ＊前は SubagentStart／SubagentStop の足し引き（busy.txt の agents）で数えていた。SubagentStop は手伝いを止めた時や不具合の続く時に鳴らない事があり（#92716・#78463）、
//     数が残ると札が永久に出なかった。足し引きはやめ、**Stop の入力の background_tasks（turn-mark.js が busy.txt の bg に写す）を正**にする。
//   ＊窓が手待ち（Stop・idle_prompt・StopFailure・Interrupted・EndTurn）で、一覧が無い・空なら 0。
//   ＊手番が開いている間（UserPromptSubmit・PreToolUse・PostToolUse）は数えない（開いていればそれだけで作業中）。前の Stop の一覧は、その後に手番が開いたら使わない。
//   ＊一覧を書いた刻（bg.at）から30分たっても次の Stop が無い物は「不明」（走っているとは数えない）。teammate は数えない。
//   使い方：const { helpCount } = require('help-count.js'); helpCount(busy, now) → { agent, remote, cmd, run, unk, text }
'use strict';
const STALE = 1800;
const IDLE = ['Stop', 'idle_prompt', 'StopFailure', 'Interrupted', 'EndTurn'];
function helpCount(busy, now) {
  const b = busy || {}, out = { agent: 0, remote: 0, cmd: 0, run: 0, unk: 0, text: '' };
  now = Number(now) || Math.floor(Date.now() / 1000);
  if (IDLE.indexOf(String(b.ev || '')) < 0) { return out; }
  const bg = b.bg;
  if (!bg || !Array.isArray(bg.items)) { return out; }
  if ((Number(bg.at) || 0) < (Number(b.startedAt) || 0)) { return out; }
  const it = bg.items.filter(x => !/teammate/i.test(String((x && x.type) || '')));
  if (now - (Number(bg.at) || 0) > STALE) { out.unk = it.length; return out; }
  out.agent = it.filter(x => /agent/i.test(String(x.type || '')) && !/remote/i.test(String(x.type || ''))).length;
  out.remote = it.filter(x => /remote/i.test(String(x.type || ''))).length;
  out.cmd = it.filter(x => !/agent|remote/i.test(String(x.type || ''))).length;
  out.run = out.agent + out.remote + out.cmd;
  out.text = [out.agent ? '裏で手伝い' + out.agent + '本' : '', out.remote ? '雲' + out.remote + '本' : '', out.cmd ? '裏の命令' + out.cmd + '本' : ''].filter(Boolean).join('・');
  return out;
}
module.exports = { helpCount, STALE, IDLE };
