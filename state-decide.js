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
  const cd = m.cards || { owedAt: 0, owedEta: 0 };   // 控えにあるがまだ公開に見えていない札の印（panel が「札をまとめ中、、、」を出す）
  const out = { cardOwedAt: Number(cd.owedAt) || 0, cardOwedEta: Number(cd.owedEta) || 0, stat: '', detail: '', subj: (m.job && (pend.length || (Number(m.jobAt) || 0) >= (Number(b.startedAt) || 0) || ['Stop', 'idle_prompt', 'Interrupted', 'EndTurn'].indexOf(String(b.ev || '')) >= 0)) ? String(m.job) : String(b.subj || ''),   // 2026-11-20 枠 十一：段が全部済んだ後も、この手番の間に書いた段の台帳の仕事名を件名にする（手番が裏の知らせで始まると busy.subj は直前の人の指示の一行目＝枠 九のままだった）
   eta: 0, resumeAt: 0, help: back > 0 ? backTx : (unk > 0 ? ('手伝い 不明 ' + unk + '本') : ''), steps: pend.length, stepDone: steps.length - pend.length, stepTotal: steps.length, next: first ? first.t : '',
    // 2026-11-19 12:40 本人の枠：パネルの「すんだ：」「いま：（何分たった）」「これから：」の材料（段の台帳の字そのまま）
    sDone: (steps.filter(r => r.k === 'x').slice(-1)[0] || {}).t || '', sNow: first ? first.t : '', sNowAt: nowAtOf(m, first), sNext: pend[1] ? pend[1].t : '' };
  const kst = String(kw.state || ''), clock = /^clock:([0-9]+)$/.exec(String(kw.workflow || ''));
  // 一、ヨシ待ち：残りの段の先頭が [決]
  //   2026-11-22 枠 九十三（見直し役の狭めた案）：[決] でも、手番が開いて合図の足跡（evAt・toolAt の新しい方）が3分以内の間だけは「作業中（許可待ちの段が残っている）」。
  //   動きが止まれば（Stop・足跡が3分を超える）ヨシ待ちに戻る。材料は busy.txt の既存の欄だけ（user-activity.json は使わない）。
  const turnOpen = ['UserPromptSubmit', 'PreToolUse', 'PostToolUse'].indexOf(String(b.ev || '')) >= 0;
  const footAt = Math.max(Number(b.evAt) || 0, Number(b.toolAt) || 0);
  if (first && first.k === '決') {
    if (m.alive > 0 && turnOpen && now - footAt <= FOOT) { out.stat = '作業中'; out.detail = '許可待ちの段が残っている' + (back > 0 ? '・' + backTx : ''); return out; }
    out.stat = 'ヨシ待ち'; out.detail = cut(first.t, 60); return out;
  }
  // 二、止まり：窓の合図が StopFailure（使用量なら「止まり（使用量・HH:MM にリセット）」を busy が持つ）
  if (b.ev === 'StopFailure') { out.stat = /^止まり/.test(String(b.stat || '')) ? String(b.stat) : '止まり'; out.detail = ''; return out; }
  // 三、作業中：手番が開いて合図の足跡が3分以内、または裏の仕事が走っている
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
  let jobAt = 0; try { jobAt = Math.floor(fs.statSync(ROOT + '/job-steps.txt').mtimeMs / 1000); } catch (e) { }
  const jm = /^仕事:[ 　]*(.+)$/m.exec(st || ''), job = jm ? jm[1].trim() : '';
  const key = first ? (job + '|' + first.t) : '';   // 仕事の名と段の字の組で覚える（同じ字の段でも仕事が替われば起点を取り直す・2026-11-19 16:20）
  if (first && (!ns || ns.t !== key)) { ns = { t: key, at: now }; try { fs.writeFileSync(ROOT + '/step-now.json', JSON.stringify(ns)); } catch (e) { } }
  // 2026-11-20 本人の枠：「控えにあるがまだ公開に見えていない札がある」印（cardOwedAt＝その札を待ち始めた刻。0なら無し）。パネルは、その札が一覧に出るまで待機中でなく「札をまとめ中、、、」を出す。
  //   ①先書きの控え（card-outbox.jsonl）で済みでない札（15分以内）がある → 窓が手待ちならその Stop の刻（無ければ積んだ刻）。
  //   ②窓が手待ちで、段の台帳に残りが無く、控え（work-note.txt）が札になる形（待ち:なし・完了:がある。2026-11-20 枠 四：種類が外待ちでも、待ち:なし・完了:ありなら札は出る＝印を立てる。実測 20:24:18 に止まった回は、控えの種類が「外待ち」のまま待ち:なしで終わり、印が立たず頭の字が「待機中」になった）で、その Stop より後にまだ札が控えに入っていない → Stop の刻。
  //   ＊Stop の押し（turn-mark.js が state.json を書いて押す）に間に合わせるため、札が積まれる前の控えからも立てる。10分たっても札が出なければ印は消える（パネルは3分で赤く「札が遅れている」）。
  let owedAt = 0, owedEta = 0;
  // 雲の検査を待つ間（kumo-wait.txt が waiting／ack／ready／resumed／failed）は札を控えに置いたまま出さない（watch-notify.ps1）ので、印は長く（1時間まで）残し、見込みの刻は雲の検査の見込み（eta）を使う
  const kwv = readKv(ROOT + '/kumo-wait.txt'), kwHold = ['waiting', 'ack', 'ready', 'resumed', 'failed'].indexOf(String(kwv.state || '')) >= 0;
  try {
    const IDLE = ['Stop', 'idle_prompt', 'StopFailure', 'Interrupted', 'EndTurn'], idle = IDLE.indexOf(String(busy.ev || '')) >= 0;
    // 手待ちになった Stop の刻（idle_prompt が後から鳴っても、Stop の刻を使う。busy.stopAt が無ければ evAt）
    const stopAt = Number(busy.stopAt) || Number(busy.evAt) || 0;
    const adds = {}, done = {}; try { fs.readFileSync(ROOT + '/card-outbox.jsonl', 'utf8').split(/\r?\n/).forEach(l => { if (!l.trim()) { return; } try { const r = JSON.parse(l); if (r.t === 'add') { adds[r.id] = r; } else if (r.t === 'done') { done[r.id] = true; } } catch (e) { } }); } catch (e) { }
    const ids = Object.keys(adds).filter(id => !done[id] && now - Number(adds[id].at) <= (kwHold ? 3600 : 900));
    if (ids.length) { const oldest = ids.reduce((a, id) => (a === 0 || Number(adds[id].at) < a) ? Number(adds[id].at) : a, 0); owedAt = (idle && stopAt > 0 && stopAt <= oldest && oldest - stopAt <= 600) ? stopAt : oldest; }
    else if (idle && stopAt > 0 && now - stopAt <= (kwHold ? 3600 : 600) && !steps.some(r => r.k !== 'x')) {
      let note = ''; let nm = 0; try { note = fs.readFileSync(ROOT + '/work-note.txt', 'utf8').replace(/^\uFEFF/, ''); nm = Math.floor(fs.statSync(ROOT + '/work-note.txt').mtimeMs / 1000); } catch (e) { }
      const kind = (/^種類[:：][ ]*(.*)$/m.exec(note) || [])[1] || '', wait = (/^待ち[:：][ ]*(.*)$/m.exec(note) || [])[1] || '', hasDone = /^完了[:：]/m.test(note);
      let lastCard = 0; try { fs.readFileSync(ROOT + '/notify-sent.tsv', 'utf8').split(/\r?\n/).slice(-30).forEach(l => { const t = Date.parse(l.replace(/^\uFEFF/, '').slice(0, 19).replace(' ', 'T')); if (t > 0) { lastCard = Math.max(lastCard, Math.floor(t / 1000)); } }); } catch (e) { }
      if (hasDone && /^(なし|無し|—|)$/.test(wait.trim()) && nm >= stopAt - 900 && lastCard < stopAt && nm > lastCard) { owedAt = stopAt; }   // 2026-11-20 枠 十：控えが**最後の札より新しい**時だけ（札を出した控えのまま、新しい仕事をしない止まり＝枠 九の札が22:28:35 に出たあとの 22:29:02 の止まりで、控えの更新刻 22:2x が 15分以内で印が立ち、札まとめ中が2分続いた）。新しい札が出ない回（控えを書いていない回）は印を立てない
    }
  } catch (e) { }
  if (owedAt > 0) { owedEta = (kwHold && (kwv.state === 'waiting' || kwv.state === 'ack') && Number(kwv.eta) > 0) ? Number(kwv.eta) : owedAt + 150; }
  const cards = { owedAt: owedAt, owedEta: owedEta };
  return { now: now, alive: alive, busy: busy, kumo: readKv(ROOT + '/kumo-wait.txt'), steps: steps, nowStep: ns, job: job, jobAt: jobAt, cards: cards };
}
module.exports = { decide, gather, readSteps };
if (require.main === module) {
  const i = process.argv.indexOf('--alive'); const alive = i > 0 ? Number(process.argv[i + 1]) : 1;
  process.stdout.write(JSON.stringify(decide(gather(alive))));
}
