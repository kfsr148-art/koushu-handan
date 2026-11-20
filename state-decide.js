// state-decide.js — 返事パネルの状態を決める所は、ここ一つ（2026-11-19 11:30 本人の枠「状態の決め方を作り直す」）。
//   材料：窓の合図（busy.txt の ev・evAt・stat・subj）／雲の台帳（kumo-wait.txt）／裏の仕事（busy.txt の bg＝Stop の入力の background_tasks）／
//         残りの段（job-steps.txt）／ヨシ待ち（job-steps.txt の [決]）／時計の待ち（kumo-wait.txt の workflow=clock:<epoch>）。
//   上から当てる：ヨシ待ち → 止まり → 作業中 → 検査中 → 待ち → 待機中。待機中は上が全部無く、残りの段が0の時だけ。
//   中身：作業中＝題・裏でN本／検査中＝雲の題・終了予定（無ければ見込み不明）／待ち＝訳・再開の刻。裏の仕事が走る間は作業中。
//   使い方：node state-decide.js [--alive N]   → 標準出力へ JSON { stat, detail, subj, eta, resumeAt, help, steps, next }
//           require('./state-decide.js').decide(材料) → 同じ形（作り値の総当たりはこちらを使う）
'use strict';
const fs = require('fs');
const ROOT = process.env.SD_ROOT || 'C:/Users/user/.claude';
const { helpCount } = require('./help-count.js');
const FOOT = 180, HELP_STALE = 1800;
function hm(t) { const d = new Date(t * 1000); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
function readKv(p) { const o = {}; try { fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).forEach(l => { const i = l.indexOf('='); if (i > 0) { o[l.slice(0, i).trim()] = l.slice(i + 1).trim(); } }); } catch (e) { } return o; }
function readSteps(txt) {
  const rows = []; String(txt || '').split(/\r?\n/).forEach(l => { const z = l.trim(); const m = /^\[( |x|雲|決)\]\s*(.*)$/.exec(z); if (m) { rows.push({ k: m[1], t: m[2] }); } });
  return rows;
}
function cut(s, n) { s = String(s || '').trim(); return s.length > n ? s.slice(0, n) + '…' : s; }
// 材料 m：{ now, alive, busy:{ev,evAt,stat,subj,agents,bg}, kumo:{state,subj,eta,workflow}, steps:[{k,t}] }
// 「▶ 進行中（N分）」の起点（2026-11-19 16:20 本人の枠）：雲待ちの段（[雲]）で雲の走りを待っている間は、今待っている走りの始まり（kumo-wait.txt の runat＝run_started_at、無ければ created_at）。
//   走りが替われば起点も替わる。それ以外の段は step-now.json（仕事の名と段の字の組で覚える。仕事が替われば取り直す）
function nowAtOf(m, first) {
  if (!first) { return 0; }
  const kw = m.kumo || {}, kst = String(kw.state || '');
  if (first.k === '雲' && (kst === 'waiting' || kst === 'ack')) { const ra = Number(kw.runat) || 0; return ra > 0 ? ra : (Number(kw.since) || 0); }
  return (m.nowStep && m.nowStep.t === ((m.job || '') + '|' + first.t)) ? (Number(m.nowStep.at) || 0) : 0;
}
function decide(m) {
  const now = m.now, b = m.busy || {}, kw = m.kumo || {}, steps = m.steps || [];
  const pend = steps.filter(r => r.k !== 'x'); const first = pend[0] || null;
  // 裏の仕事の数（2026-11-20 本人の枠）：SubagentStart/Stop の足し引きはやめ、Stop の入力の background_tasks（busy.bg）を正にする。数え方は help-count.js 一つ。
  //   窓が手待ちで一覧が空なら 0。手番が開いている間は数えない（作業中は合図の足跡で決まる）。teammate は数えない。
  const hc = helpCount(b, now), unk = hc.unk, nHelp = hc.agent, nKumo = hc.remote, nCmd = hc.cmd;
  const back = nHelp + nKumo + nCmd;
  const backTx = hc.text;
  // 題（2026-11-19 13:00 本人の枠）：段の台帳に残りがある間は台帳の「仕事:」の行。無ければ窓の合図の題（受けた枠の頭の一行）
  const out = { stat: '', detail: '', subj: (pend.length && m.job) ? String(m.job) : String(b.subj || ''), eta: 0, resumeAt: 0, help: back > 0 ? backTx : (unk > 0 ? ('手伝い 不明 ' + unk + '本') : ''), steps: pend.length, stepDone: steps.length - pend.length, stepTotal: steps.length, next: first ? first.t : '',
    // 2026-11-19 12:40 本人の枠：パネルの「すんだ：」「いま：（何分たった）」「これから：」の材料（段の台帳の字そのまま）
    sDone: (steps.filter(r => r.k === 'x').slice(-1)[0] || {}).t || '', sNow: first ? first.t : '', sNowAt: nowAtOf(m, first), sNext: pend[1] ? pend[1].t : '' };
  const kst = String(kw.state || ''), clock = /^clock:([0-9]+)$/.exec(String(kw.workflow || ''));
  // 一、ヨシ待ち：残りの段の先頭が [決]
  if (first && first.k === '決') { out.stat = 'ヨシ待ち'; out.detail = cut(first.t, 60); return out; }
  // 二、止まり：窓の合図が StopFailure（使用量なら「止まり（使用量・HH:MM にリセット）」を busy が持つ）
  if (b.ev === 'StopFailure') { out.stat = /^止まり/.test(String(b.stat || '')) ? String(b.stat) : '止まり'; out.detail = ''; return out; }
  // 三、作業中：手番が開いて合図の足跡が3分以内、または裏の仕事が走っている
  const turnOpen = ['UserPromptSubmit', 'PreToolUse', 'PostToolUse'].indexOf(String(b.ev || '')) >= 0;
  if (m.alive > 0 && ((turnOpen && now - (Number(b.evAt) || 0) <= FOOT) || back > 0)) { out.stat = '作業中'; out.detail = back > 0 ? backTx : ''; return out; }   // 「作業中（裏で手伝い1本・雲1本）」の括弧の中身。題は subj で別に渡す
  // 四、検査中：雲の走りを待っている（時計の待ちは除く）
  if (!clock && (kst === 'waiting' || kst === 'ack')) {
    const eta = Number(kw.eta) || 0; out.eta = eta;
    out.stat = '検査中'; out.detail = cut(String(kw.subj || '').replace(/^[^：]*：/, ''), 40) + '・' + (eta > 0 ? ('終了予定 ' + hm(eta)) : '見込み不明'); return out;
  }
  // 五、待ち：時計の待ち／窓が閉じている／手番が開いたまま動きが無い／手伝いの行方が不明／残りの段がある
  if (clock && (kst === 'waiting' || kst === 'ack')) { out.stat = '待ち'; out.resumeAt = Number(clock[1]); out.detail = cut(String(kw.subj || '時計の待ち'), 40) + '・再開 ' + hm(out.resumeAt); return out; }
  if (!(m.alive > 0)) { out.stat = '待ち'; out.detail = '窓が閉じている（Claude Code が動いていない）'; return out; }
  if (turnOpen) { out.stat = '待ち'; out.detail = '動きなし（最後の動き ' + hm(Number(b.evAt) || now) + '）'; return out; }
  if (unk > 0) { out.stat = '待ち'; out.detail = '手伝い 不明 ' + unk + '本（30分どの合図も無い）'; return out; }
  if (pend.length > 0) { out.stat = '待ち'; out.detail = '残りの段 ' + pend.length + '・次「' + cut(first.t, 30) + '」'; return out; }
  // 六、待機中：上が全部無く、残りの段が0
  out.stat = '待機中'; out.detail = ''; return out;
}
function gather(alive) {
  let busy = {}; try { busy = JSON.parse(fs.readFileSync(ROOT + '/busy.txt', 'utf8')); } catch (e) { }
  let st = ''; try { st = fs.readFileSync(ROOT + '/job-steps.txt', 'utf8'); } catch (e) { }
  const now = Math.floor(Date.now() / 1000), steps = readSteps(st), first = steps.filter(r => r.k !== 'x')[0];
  // 「いま」の段が始まった刻を控える（段の字が替わった時に刻を取り直す）。控えは step-now.json
  let ns = null; try { ns = JSON.parse(fs.readFileSync(ROOT + '/step-now.json', 'utf8')); } catch (e) { }
  const jm = /^仕事:[ 　]*(.+)$/m.exec(st || ''), job = jm ? jm[1].trim() : '';
  const key = first ? (job + '|' + first.t) : '';   // 仕事の名と段の字の組で覚える（同じ字の段でも仕事が替われば起点を取り直す・2026-11-19 16:20）
  if (first && (!ns || ns.t !== key)) { ns = { t: key, at: now }; try { fs.writeFileSync(ROOT + '/step-now.json', JSON.stringify(ns)); } catch (e) { } }
  return { now: now, alive: alive, busy: busy, kumo: readKv(ROOT + '/kumo-wait.txt'), steps: steps, nowStep: ns, job: job };
}
module.exports = { decide, gather, readSteps };
if (require.main === module) {
  const i = process.argv.indexOf('--alive'); const alive = i > 0 ? Number(process.argv[i + 1]) : 1;
  process.stdout.write(JSON.stringify(decide(gather(alive))));
}
