// endat.js — 表（窓が受けた枠の全部）と裏方（下請けと雲の全部）の「全部終わる見込みの刻」を組む（2026-11-21・本人の枠 五十）。
//   リポジトリ直下に置く（雲の panel-check --static が作り値で回せるように）。読む控えは ~/.claude の物。
//   require して compute(d) を呼ぶ（d＝state.json の中身）。panel-view.js が panelView の omote／ura に足す。
//   単独で：node endat.js <state.json の道>  → {omote, ura} の JSON を標準出力へ（確かめ用）。
//
// 決まり：
//   ＊表＝今の仕事（job-steps.txt）の残り＋順番待ち（state.json の foot：台帳の未了で控えの「枠:」に載っていない物）。
//     今の仕事の終わり＝「見込みを書いた刻（v213・state.json の mikomiAt）」＋（見込みの分＋増えた段×一段の分）。始まり（その仕事を初めて見た刻）は endat-base.json に控えて「始まり」に出すだけ。
//     ＊始まりは付け直さない。段が増えた・枠が来た時は、終わりだけを足し算で延ばす（控えの「開始:」は読むだけで直さない）。
//     ＊見込みが書き替えられた時は、書き替えを見た刻から新しい見込みで数え直す（v212・枠 七十七。前は「その時の開始:」からの刻と比べて遅い方）。
//       その後に増えた段は「新しい見込み÷その時の残りの段」で延ばす。段は state.json の生の段（d.steps）を先に使う（panel-core.js の stepsOf と同じ数え方）。
//     ＊比＝直近24時間の「実測÷見込み」の中央値。見込みは note-missed-dropped.log の控えの写し（開始・件名・見込み）、実測は台帳の「終わりの札 HH:MM」まで。
//     順番待ち一件＝直近24時間の台帳の一枠あたりの実測（前の枠の終わりか受領の遅い方から、終わりの札まで）の中央値。合図だけの行（橋（合図 …））は数えない。
//   ＊裏方＝動いている下請け（subagents.jsonl）と雲の走り（ura-cloud.json）の全部。一本の終わり＝始まり＋直近24時間の済んだ物の中央値（雲は流れの名ごと）。
//     全部終わる刻＝その中で一番遅い物。
//   ＊今の刻は使わない（state.json の指紋が毎分変わらないように）。過ぎた刻もそのまま出す。日付の境（直近24時間）と下請けの打ち切り（30分）だけ今の刻を見る。
//   ＊v205（本人の枠 五十五・五十六）：ゲージの区切り（seg＝{done,total,run}）を omote／ura に、二つを合わせた all（全部）を足す。区切りの束は endat-bundle.json に控える（bundle() の頭）。
//   ＊v213（本人の枠 八十三）：今の仕事の終わり＝見込みを書いた刻（state.json の mikomiAt）＋見込みの分（＋増えた段×一段の分）。比は掛けない。見込みが無ければ出さない。
//     （本人の枠 八十四）：雲の一本の所要は、その流れ自身の直近5本の中央値（24時間→7日→30日と広げる）。記録が無い流れは「見込み不明」（unknown）。
//   ＊作り値：ENDAT_NOW・ENDAT_STEPS・ENDAT_ORDERS・ENDAT_NOTES・ENDAT_SUBLOG・ENDAT_CLOUD・ENDAT_BASE（控えの置き場）・ENDAT_BUNDLE（束の控え）・ENDAT_EST（estimates.json）。
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const H = path.join(os.homedir(), '.claude');
const P = (k, f) => process.env[k] || path.join(H, f);
const NL = String.fromCharCode(10), TAB = String.fromCharCode(9);
const KAN = '[一二三四五六七八九十百〇零0-9]+';

function rd(p) { try { return fs.readFileSync(p, 'utf8').replace(/^﻿/, ''); } catch (e) { return ''; } }
function rj(p, d) { try { return JSON.parse(rd(p)); } catch (e) { return d; } }
function med(a) { a = a.filter(x => isFinite(x)).sort((x, y) => x - y); if (!a.length) { return 0; } const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
function hm(sec) { if (!(sec > 0)) { return ''; } const d = new Date((sec + 9 * 3600) * 1000); return ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2); }
function jstSec(s) { const m = /^([0-9]{4}-[0-9]{2}-[0-9]{2})[ T]([0-9]{2}:[0-9]{2}(?::[0-9]{2})?)/.exec(String(s || '')); if (!m) { return 0; } const t = Date.parse(m[1] + 'T' + (m[2].length === 5 ? m[2] + ':00' : m[2]) + '+09:00'); return isNaN(t) ? 0 : Math.floor(t / 1000); }
function day0(now) { return Math.floor((now + 9 * 3600) / 86400) * 86400 - 9 * 3600; }
function nums(s) {   // 「枠 三十・三十一」「枠 二十五〜二十八」→ 番号の集まり
  const o = new Set(), re = new RegExp('枠[ 　]*(' + KAN + '(?:[・〜～]' + KAN + ')*)', 'g'); let m;
  while ((m = re.exec(String(s || '')))) { m[1].split(/[・〜～]/).forEach(x => { if (x) { o.add(x); } }); }
  return o;
}
function r1(x) { return Math.round(x * 10) / 10; }

// ---- 直近24時間の台帳：一枠あたりの実測と、枠の番号ごとの終わりの刻 ----
function ordersToday(now) {
  const t0 = now - 86400, rows = [];
  rd(P('ENDAT_ORDERS', 'orders-open.tsv')).split(/\r?\n/).forEach(l => {
    const a = l.split(TAB); if (a.length < 4) { return; }
    const rc = jstSec(a[0]); if (!(rc >= t0)) { return; }
    if (/頭：橋（合図/.test(a[2])) { return; }
    const m = /終わりの札 ([0-9]{1,2}):([0-9]{2})/.exec(a[3]); if (!/^済/.test(a[3]) || !m) { return; }
    let cl = day0(rc) + Number(m[1]) * 3600 + Number(m[2]) * 60; if (cl < rc) { cl += 86400; }
    rows.push({ rc, cl, nums: nums(a[2]) });
  });
  rows.sort((x, y) => x.cl - y.cl || x.rc - y.rc);
  const svc = []; let prev = 0;
  rows.forEach(r => { const s = r.cl - Math.max(r.rc, prev); if (s >= 60) { svc.push(s / 60); } prev = Math.max(prev, r.cl); });
  return { rows, frameMin: med(svc), frameN: svc.length };
}
// ---- 直近24時間の「実測÷見込み」：控えの写し（開始・件名・見込み）と、台帳の終わりの札 ----
function ratioToday(now, rows) {
  const t0 = now - 86400, seen = {}, rs = [];
  let cur = {};
  const flush = () => {
    const st = jstSec(cur.st), mk = cur.mk || 0;
    if (st >= t0 && mk > 0 && !seen[st]) {
      seen[st] = 1; const ns = nums(cur.subj); let cl = 0;
      rows.forEach(r => { let hit = false; ns.forEach(n => { if (r.nums.has(n)) { hit = true; } }); if (hit && r.cl > cl) { cl = r.cl; } });
      if (cl > st) { rs.push(((cl - st) / 60) / mk); }
    }
    cur = {};
  };
  rd(P('ENDAT_NOTES', 'note-missed-dropped.log')).split(/\r?\n/).forEach(l => {
    if (/^--- /.test(l)) { flush(); return; }
    let m;
    if ((m = /^開始:[ ]*(.+)$/.exec(l))) { cur.st = m[1].trim(); }
    else if ((m = /^件名:[ ]*(.+)$/.exec(l))) { cur.subj = m[1]; }
    else if ((m = /^見込み:[ ]*([0-9]+)[ ]*分/.exec(l))) { cur.mk = Number(m[1]); }
  });
  flush();
  // estimates.json に直近24時間の行（mikomi と min の組）があれば足す
  const E = rj(P('ENDAT_EST', 'estimates.json'), null);
  if (E && Array.isArray(E.rows)) { E.rows.forEach(x => { const at = Math.floor(Date.parse(x.at || '') / 1000); if (at >= t0 && Number(x.mikomi) > 0 && Number(x.min) > 0) { rs.push(Number(x.min) / Number(x.mikomi)); } }); }
  const r = med(rs);
  return { r: r > 0 ? r : 1, n: rs.length };
}
// ---- 今の仕事（job-steps.txt）と、その始まりの控え（endat-base.json） ----
function curJob(d, now) {
  // v212（本人の枠 七十七）：段は state.json の生の段（d.steps＝{job, rows:[{k,t}]}・見張りが job-steps.txt から写す）を先に使う（panel-core.js の stepsOf と同じ数え方：
  //   済みは k が 'x' の段だけ・[雲]／[決] は未済）。生の段が無い時（古い state・作り値）は job-steps.txt を同じ決まりで読む（行を詰めて頭が [ ]・[x]・[雲]・[決]）。
  let job = '', flags = [];
  const SR = (d.steps && typeof d.steps === 'object' && Array.isArray(d.steps.rows)) ? d.steps.rows : null;
  if (SR) { job = String(d.steps.job || '').trim(); flags = SR.filter(x => x && typeof x === 'object').map(x => String(x.k) === 'x'); }
  else {
    const tx = rd(P('ENDAT_STEPS', 'job-steps.txt')), m = /^仕事:[ 　]*(.+)$/m.exec(tx);
    job = m ? m[1].trim() : '';
    tx.split(/\r?\n/).forEach(l => { const z = /^\[( |x|雲|決)\]/.exec(l.trim()); if (z) { flags.push(z[1] === 'x'); } });   // v205：段ごとの済み（上から順）。束の区切りに使う
  }
  const all = flags.length, left = flags.filter(f => !f).length;
  const mk = (String(d.mikomi || '').match(/([0-9]+)/) || [])[1]; const mikomi = mk ? Number(mk) : 0;
  const st = Number(d.startedAt) || Number(d.statAt) || 0;
  // v213（本人の枠 八十三・作法25 の裁定）：見込みは「窓が見込みを書いた刻」（state.json の mikomiAt・書き手は inbox-watch.ps1 の Publish-Status 一人）から数える。
  //   ＊mikomiAt が載っていない古い state（作り値）だけ、前の決め（最初は始まり・書き替えは見た刻）で数える。
  const hasAt = typeof d.mikomiAt === 'number', mAt = hasAt ? Math.max(0, Number(d.mikomiAt) || 0) : 0;
  const bp = P('ENDAT_BASE', 'endat-base.json'); let b = rj(bp, null), ch = false;
  if (!job || !left) { return { job, all, left: 0, base: null, flags, mikomi }; }
  if (!b || b.job !== job) { b = { job, start: st, mikomi0: mikomi, steps0: all, mk: 0, mkAt: 0 }; ch = true; }
  if (!(b.mikomi0 > 0) && mikomi > 0) { b.mikomi0 = mikomi; ch = true; }
  if (mikomi > 0) {
    const first = !(b.mk > 0 && b.mkAt > 0 && b.mkSteps > 0);
    // 最初の見込みは仕事の全部の段にかかる（一段＝見込み÷その時の段数）・書き替えはその時の残りの段にかかる（一段＝見込み÷残り）
    const set = (at) => { b.rew = !first; b.mk = mikomi; b.mkAt = at; b.mkSteps = all; b.mkLeft = first ? all : left; ch = true; };
    if (hasAt) { if (mAt > 0 && (mAt !== b.mkAt || mikomi !== b.mk || first)) { set(mAt); } }
    else if (first) { set(st); }
    else if (mikomi !== b.mk) { set(now); }
  }
  // ↑ v212（枠 七十七）：書き替えの刻と、その時の段の数・残りを控えに持つ。v213：刻は state.json の mikomiAt（見張りが控える）をそのまま写す。今の刻は使わない（古い state の書き替えだけ見た刻）。
  if (ch) { try { fs.writeFileSync(bp, JSON.stringify(b)); } catch (e) { } }
  return { job, all, left, base: b, flags, mikomi, hasAt, mAt };
}
// ---- 束（v205・本人の枠 五十五・五十六）：ゲージの区切りの集まり。控え＝endat-bundle.json（endat-base.json と同じ流儀・今の刻は指紋に使わない） ----
//   表＝今の仕事の段（一段一区切り）＋順番待ちの枠（一枠一区切り・合図だけの行は数えない）。裏方＝今の束で動き出した下請けと雲（一本一区切り）。
//   ＊来た区切りは足す（M が増える）。見えなくなった区切りは消さずに済み（塗る）。ただし順番待ちの枠が今の仕事になった（新しい仕事の段が現れた）回は、
//     その枠の区切りは段に置き換わったので外す。
//   ＊残りが0になったら束は「手すき」。手すきの後に新しい区切りが来たら束を始め直す（済みを捨てる）。手すきが30分続いたら束を空にする（日付の境と同じく今の刻を見るのはここだけ）。
//   ＊裏方は state.json の ura（下請けの items・雲の running）が無い回は触らない。
function bundle(d, J, wl, now) {
  const bp = P('ENDAT_BUNDLE', 'endat-bundle.json'), b0 = rj(bp, null), was = JSON.stringify(b0);
  const b = (b0 && typeof b0 === 'object' && b0.o && b0.u) ? b0 : { o: {}, u: {}, oIdle: 0, uIdle: 0 };
  // 表
  const live = {};
  if (J.job) { (J.flags || []).forEach((f, i) => { live['s:' + J.job + '#' + (i + 1)] = f ? 1 : 0; }); }
  wl.forEach(x => { live['w:' + String((x && x.at) || '') + ' ' + String((x && x.head) || '')] = 0; });
  let oLeft = Object.keys(live).filter(k => !live[k]).length;
  if (oLeft > 0 && b.oIdle > 0) { b.o = {}; b.oIdle = 0; }
  const newJob = Object.keys(live).some(k => /^s:/.test(k) && !(k in b.o));
  // 枠 四百一：順番待ちから「手を付けた（下請け・雲）」へ移った枠は、済んでいないので緑に塗らず区切りから外す（下請けは裏方の区切りで数える）
  ((d.foot && Array.isArray(d.foot.handedList)) ? d.foot.handedList : []).forEach(x => { delete b.o['w:' + String((x && x.at) || '') + ' ' + String((x && x.head) || '')]; });
  Object.keys(b.o).forEach(k => { if (!(k in live)) { if (/^w:/.test(k) && newJob && !b.o[k]) { delete b.o[k]; } else { b.o[k] = 1; } } });
  const jobOpen = (J.flags || []).some(f => !f);   // 新しく見えた済みの段は、その仕事に残りの段がある時だけ数える（済んだ仕事の段が次の束に紛れない）
  Object.keys(live).forEach(k => { if ((k in b.o) || !live[k] || jobOpen) { b.o[k] = live[k]; } });
  if (oLeft === 0) { if (!(b.oIdle > 0)) { b.oIdle = now; } else if (now - b.oIdle > 1800) { b.o = {}; } }
  // 裏方
  const U = (d.ura && typeof d.ura === 'object') ? d.ura : null;
  if (U) {
    const A = x => Array.isArray(x) ? x : [], ul = {};
    A((U.sub || {}).items).forEach(x => { if (x && x.id != null) { ul['sub:' + x.id] = 0; } });
    A((U.cloud || {}).running).forEach(x => { if (x && x.id != null) { ul['cloud:' + x.id] = 0; } });
    // v207（本人の枠 六十四）：一塊＝0本から動き出し、また全部済んで0本に戻るまで。その間に始まった物は全部数え（巡回の合間に始まって済んだ物も、
    //   下請けと雲の済んだ一覧＝recent に新しく現れた id から拾う）、済んだ物は消さず済み（緑）で残す。塊の前から済んだ一覧にあった id（uPre）は数えない。
    const rIds = [];
    A((U.sub || {}).recent).forEach(x => { if (x && x.id != null) { rIds.push('sub:' + x.id); } });
    A((U.cloud || {}).recent).forEach(x => { if (x && x.id != null) { rIds.push('cloud:' + x.id); } });
    if (!Array.isArray(b.uPre)) { b.uPre = rIds.filter(k => !(k in b.u)); }   // 古い控え（uPre が無い）：今ある済みの物は前の塊の物とみなす
    const uRun = Object.keys(ul).length;
    if (uRun > 0 && b.uIdle > 0) { b.u = {}; b.uIdle = 0; }
    Object.keys(b.u).forEach(k => { if (!(k in ul)) { b.u[k] = 1; } });
    Object.keys(ul).forEach(k => { b.u[k] = 0; });
    if (uRun > 0 || (!(b.uIdle > 0) && Object.keys(b.u).length)) { rIds.forEach(k => { if (!(k in b.u) && b.uPre.indexOf(k) < 0) { b.u[k] = 1; } }); }
    if (uRun === 0) { b.uPre = rIds; if (!(b.uIdle > 0)) { b.uIdle = now; } else if (now - b.uIdle > 1800) { b.u = {}; } }
  }
  if (JSON.stringify(b) !== was) { try { fs.writeFileSync(bp, JSON.stringify(b)); } catch (e) { } }
  const cnt = m => { const ks = Object.keys(m); const dn = ks.filter(k => m[k]).length; return { done: dn, total: ks.length, left: ks.length - dn }; };
  const o = cnt(b.o), u = cnt(b.u);
  return { o: { done: o.done, total: o.total, run: o.left > 0 ? 1 : 0 }, u: { done: u.done, total: u.total, run: u.left } };
}
// ---- 裏方：下請けと雲 ----
function subsNow(now) {
  const by = new Map(), t0 = now - 86400;
  rd(P('ENDAT_SUBLOG', 'subagents.jsonl')).split(/\r?\n/).forEach(l => {
    let r; try { r = JSON.parse(l); } catch (e) { return; } if (!r || !r.id) { return; }
    const o = by.get(r.id) || { start: 0, end: 0 };
    if (r.ev === 'start') { if (r.at >= o.end) { o.end = 0; } o.start = r.at; }
    if (r.ev === 'stop') { o.end = r.at; if (!o.start) { o.start = r.at; } }
    by.set(r.id, o);
  });
  const run = [], dur = [];
  by.forEach(o => { if (o.end) { if (o.start >= t0 && o.end >= o.start) { dur.push((o.end - o.start) / 60); } } else if (now - o.start <= 30 * 60) { run.push(o.start); } });
  return { run, min: med(dur), n: dur.length };
}
// v213（本人の枠 八十四）：雲の一本の所要は、その流れ自身の過去の所要（直近の数回＝最大5本の中央値）だけから出す。
//   ＊探す幅は 直近24時間 → 7日 → 30日 の順に広げ、5本そろった幅で止める（30日でそろわなければ有る分だけ）。材料は ura-cloud.json の list（直近10本）と hist（ura.js が、
//     走っている流れの済んだ走りを gh run list --workflow で取って控えた物）。
//   ＊それでも記録が無い流れは、他の流れの値を借りない（前は24時間の全部の中央値を借りていた）。min＝0 で「見込み不明」（unknown）にする。
const FLOW_DAYS = [1, 7, 30], FLOW_N = 5;
function cloudNow(now) {
  const c = rj(P('ENDAT_CLOUD', 'ura-cloud.json'), null), t0 = now - 86400;
  const L = (c && Array.isArray(c.list)) ? c.list : [], HI = (c && c.hist && typeof c.hist === 'object') ? c.hist : {}, sec = s => (s ? Math.floor(Date.parse(s) / 1000) : 0);
  const done = {}, all = [];
  const add = (r, k0) => {
    if (!r || r.status !== 'completed') { return; }
    const a = sec(r.createdAt), m = (sec(r.updatedAt) - a) / 60, k = k0 || r.workflowName || r.name || ''; if (!(a > 0) || !(m >= 0)) { return; }
    const M = (done[k] = done[k] || {}), id = String(r.databaseId != null ? r.databaseId : (k + '@' + a));
    if (!M[id]) { M[id] = { at: a, min: m }; if (a >= t0) { all.push(m); } }
  };
  L.forEach(r => add(r));
  Object.keys(HI).forEach(k => { const h = HI[k], rs = Array.isArray(h) ? h : (h && Array.isArray(h.runs) ? h.runs : []); rs.forEach(r => add(r, k)); });
  const flow = k => {
    const arr = Object.keys(done[k] || {}).map(i => done[k][i]).sort((x, y) => y.at - x.at);
    // 直近の数回：24時間→7日→30日と広げ、5本そろった幅（そろわなければ30日）の新しい方から5本まで。一本も無ければ見込み不明
    for (const dd of FLOW_DAYS) { const w = arr.filter(x => x.at >= now - dd * 86400).slice(0, FLOW_N); if (w.length >= FLOW_N || (dd === FLOW_DAYS[FLOW_DAYS.length - 1] && w.length)) { return { min: med(w.map(x => x.min)), n: w.length, days: dd }; } }
    return { min: 0, n: 0, days: 0 };
  };
  const run = L.filter(r => r.status !== 'completed').map(r => { const k = r.workflowName || r.name || '', f = flow(k); return { at: sec(r.createdAt), min: f.min, n: f.n, days: f.days, name: k }; });
  return { run, min: med(all), n: all.length, seen: !!c };
}

function compute(d, now) {
  d = d || {}; now = now || Number(process.env.ENDAT_NOW) || Math.floor(Date.now() / 1000);
  // 表
  const O = ordersToday(now), R = ratioToday(now, O.rows), J = curJob(d, now);
  const frameMin = O.frameMin > 0 ? O.frameMin : 30;   // 直近24時間の実測が無ければ30分（その旨を src に書く）
  let curEnd = 0, extra = 0, stepMin = 0, reb = false;
  if (J.base && J.mikomi > 0 && J.base.mkAt > 0 && J.base.mk > 0 && J.base.mkSteps > 0) {
    // v213（本人の枠 八十三）：今の仕事の終わり＝見込みを書いた刻（mikomiAt）＋見込みの分＋増えた段×一段の分。
    //   ＊見込みを書き替えたら、書き替えた刻から新しい見込みで数え直す（v212 と同じ・前の見込みの延びは捨てる）。
    //   ＊見込みと実測の比は掛けない（パネルの赤・brief・見込み超過の知らせと同じ刻にするため。比は src に参考で出す）。
    //   ＊見込みを書いていない間は終わりを出さない（枠 六十二の noEstimate）。
    const b = J.base; reb = !!b.rew;
    stepMin = b.mk / Math.max(1, b.mkLeft || J.left); extra = Math.max(0, J.all - b.mkSteps);
    curEnd = b.mkAt + Math.round((b.mk + extra * stepMin) * 60);
  }
  const F = d.foot || {}, wl = Array.isArray(F.waitList) ? F.waitList : [];
  const sig = wl.filter(x => /^橋（合図/.test(String((x && x.head) || ''))).length;
  const waitN = Math.max(0, (typeof F.wait === 'number' ? F.wait : wl.length) - sig);
  const wReal = wl.filter(x => !/^橋（合図/.test(String((x && x.head) || '')));
  for (let i = wReal.length; i < waitN; i++) { wReal.push({ at: 'ほか', head: String(i + 1) }); }   // 一覧に載らない分（waitMore）も一枠一区切り
  const SEG = bundle(d, J, wReal, now);   // v205：ゲージの区切り（束）
  const base0 = curEnd > 0 ? curEnd : (Number(d.statAt) || 0);
  let omEnd = (curEnd > 0 || waitN > 0) && base0 > 0 ? base0 + Math.round(waitN * frameMin * 60) : 0, omOver = false;
  // 見込みを過ぎてまだ残っている時だけ、今の刻を5分刻みに切り上げた刻へ延ばす（指紋が変わるのは5分に一度まで）
  const fl = Math.ceil(now / 300) * 300;
  if (omEnd > 0 && omEnd < now) { omEnd = fl; omOver = true; }
  const omote = {
    endAt: omEnd ? hm(omEnd) : '', endSec: omEnd, over: omOver, startSec: J.base ? J.base.start : 0, mikomiAt: curEnd > 0 ? J.base.mkAt : 0, seg: SEG.o,
    cur: { job: J.job, left: J.left, all: J.all, steps0: J.base ? J.base.steps0 : 0, addSteps: extra, mikomi: J.base ? J.base.mikomi0 : 0, mk: curEnd > 0 ? J.base.mk : 0, mikomiAt: curEnd > 0 ? J.base.mkAt : 0, stepMin: r1(stepMin), endAt: curEnd ? hm(curEnd) : '', endSec: curEnd },
    wait: { n: waitN, signals: sig, frameMin: r1(frameMin), frameN: O.frameN },
    ratio: { v: Math.round(R.r * 100) / 100, n: R.n },
    src: (J.base ? ('今の仕事 残り' + J.left + '段（始まり ' + hm(J.base.start) + (curEnd > 0 ? (reb ? '・見込みを ' + hm(J.base.mkAt) + ' に ' + J.base.mk + '分へ書き替え' : '・見込み ' + J.base.mk + '分（' + hm(J.base.mkAt) + ' に書いた）') : '・見込み 未記入（終わりは出さない）') + (extra ? '・段+' + extra + '×' + r1(stepMin) + '分' : '') + '）') : '今の仕事なし') +
      '＋順番待ち ' + waitN + '件×' + r1(frameMin) + '分（直近24時間の' + (O.frameN ? O.frameN + '枠の中央値' : '実測なし・仮に30分') + (sig ? '・合図' + sig + '件は数えない' : '') + '）・見込みと実測の比 ' + (Math.round(R.r * 100) / 100) + '（直近24時間 ' + R.n + '組・参考：今の仕事の終わりには掛けない）' + (omOver ? '・見込みを過ぎて残っているので今から5分刻みで延ばした' : '')
  };
  // 裏方
  const S = subsNow(now), C = cloudNow(now), sMin = S.min > 0 ? S.min : 15, ends = [];
  S.run.forEach(t => ends.push(t + Math.round(sMin * 60)));
  const cUnk = C.run.filter(x => !(x.min > 0));   // v213（枠 八十四）：その流れの記録が30日に一本も無い雲は「見込み不明」（他の流れの値を借りない）
  C.run.forEach(x => { if (x.min > 0) { ends.push(x.at + Math.round(x.min * 60)); } });
  let uEnd = (ends.length && !cUnk.length) ? Math.max.apply(null, ends) : 0, uOver = false;   // 見込み不明の雲が一本でも走っていれば、裏方の終わりの刻は出さない
  if (uEnd > 0 && uEnd < now) { uEnd = fl; uOver = true; }
  const cw = C.run.map(x => x.name + ' ' + (x.min > 0 ? r1(x.min) + '分＝直近' + (x.days === 1 ? '24時間' : x.days + '日') + ' ' + x.n + '本の中央値' : '見込み不明（この流れの記録が30日に無い）'));
  const ura = {
    endAt: uEnd ? hm(uEnd) : '', endSec: uEnd, over: uOver, unknown: cUnk.length, seg: SEG.u,
    sub: { n: S.run.length, min: r1(sMin), done: S.n }, cloud: { n: C.run.length, min: r1(C.min > 0 ? C.min : 0), done: C.n, unknown: cUnk.length, flows: C.run.map(x => ({ name: x.name, min: r1(x.min), n: x.n, days: x.days })) },
    src: '下請け ' + S.run.length + '本（1本 ' + r1(sMin) + '分＝直近24時間' + (S.n ? ' ' + S.n + '本の中央値' : 'の実測なし・仮に15分') + '）・雲 ' + C.run.length + '本' + (cw.length ? '（流れごと：' + cw.join('、') + '）' : '') + (cUnk.length ? '・見込み不明の雲があるので終わりの刻は出さない' : '') + (uOver ? '・見込みを過ぎて動いているので今から5分刻みで延ばした' : '')
  };
  // 全部（v205・本人の枠 五十六）：表と裏方を合わせる。終わり＝遅い方・区切り＝両方の区切りの和
  const aEnd = Math.max(omEnd, uEnd), all = {
    endAt: aEnd ? hm(aEnd) : '', endSec: aEnd, over: aEnd > 0 && ((aEnd === omEnd && omOver) || (aEnd === uEnd && uOver)), unknown: (!aEnd && cUnk.length) ? cUnk.length : 0,
    seg: { done: SEG.o.done + SEG.u.done, total: SEG.o.total + SEG.u.total, run: SEG.o.run + SEG.u.run },
    src: '表の仕事 ' + (omote.endAt || 'なし') + '・裏方 ' + (ura.endAt || (cUnk.length ? '見込み不明' : 'なし')) + ' の遅い方'
  };
  return { omote, ura, all };
}
module.exports = { compute, nums, med };
if (require.main === module) {
  let d = {}; try { d = JSON.parse(rd(process.argv[2])); } catch (e) { }
  process.stdout.write(JSON.stringify(compute(d), null, 1) + NL);
}
