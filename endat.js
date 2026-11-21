// endat.js — 表（窓が受けた枠の全部）と裏方（下請けと雲の全部）の「全部終わる見込みの刻」を組む（2026-11-21・本人の枠 五十）。
//   リポジトリ直下に置く（雲の panel-check --static が作り値で回せるように）。読む控えは ~/.claude の物。
//   require して compute(d) を呼ぶ（d＝state.json の中身）。panel-view.js が panelView の omote／ura に足す。
//   単独で：node endat.js <state.json の道>  → {omote, ura} の JSON を標準出力へ（確かめ用）。
//
// 決まり：
//   ＊表＝今の仕事（job-steps.txt）の残り＋順番待ち（state.json の foot：台帳の未了で控えの「枠:」に載っていない物）。
//     今の仕事の終わり＝「始まり（その仕事を初めて見た刻・endat-base.json に控える）」＋（見込みの分＋増えた段×一段の分）×比。
//     ＊始まりは付け直さない。段が増えた・枠が来た時は、終わりだけを足し算で延ばす（控えの「開始:」は読むだけで直さない）。
//     ＊見込みが書き替えられた時だけ、その時の「開始:」から新しい見込みを足した刻とも比べ、遅い方を取る。
//     ＊比＝直近24時間の「実測÷見込み」の中央値。見込みは note-missed-dropped.log の控えの写し（開始・件名・見込み）、実測は台帳の「終わりの札 HH:MM」まで。
//     順番待ち一件＝直近24時間の台帳の一枠あたりの実測（前の枠の終わりか受領の遅い方から、終わりの札まで）の中央値。合図だけの行（橋（合図 …））は数えない。
//   ＊裏方＝動いている下請け（subagents.jsonl）と雲の走り（ura-cloud.json）の全部。一本の終わり＝始まり＋直近24時間の済んだ物の中央値（雲は流れの名ごと）。
//     全部終わる刻＝その中で一番遅い物。
//   ＊今の刻は使わない（state.json の指紋が毎分変わらないように）。過ぎた刻もそのまま出す。日付の境（直近24時間）と下請けの打ち切り（30分）だけ今の刻を見る。
//   ＊作り値：ENDAT_NOW・ENDAT_STEPS・ENDAT_ORDERS・ENDAT_NOTES・ENDAT_SUBLOG・ENDAT_CLOUD・ENDAT_BASE（控えの置き場）・ENDAT_EST（estimates.json）。
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
function curJob(d) {
  const tx = rd(P('ENDAT_STEPS', 'job-steps.txt')), m = /^仕事:[ ]*(.+)$/m.exec(tx);
  const job = m ? m[1].trim() : '';
  const all = (tx.match(/^\[[ xX]\]/mg) || []).length, left = (tx.match(/^\[ \]/mg) || []).length;
  const mk = (String(d.mikomi || '').match(/([0-9]+)/) || [])[1]; const mikomi = mk ? Number(mk) : 0;
  const st = Number(d.startedAt) || Number(d.statAt) || 0;
  const bp = P('ENDAT_BASE', 'endat-base.json'); let b = rj(bp, null), ch = false;
  if (!job || !left) { return { job, all, left: 0, base: null }; }
  if (!b || b.job !== job) { b = { job, start: st, mikomi0: mikomi, steps0: all, mk: mikomi, mkAt: 0 }; ch = true; }
  if (!(b.mikomi0 > 0) && mikomi > 0) { b.mikomi0 = mikomi; b.mk = mikomi; ch = true; }
  else if (mikomi > 0 && mikomi !== b.mk) { b.mk = mikomi; b.mkAt = st; ch = true; }   // 見込みを書き替えた：その時の「開始:」から数える
  if (ch) { try { fs.writeFileSync(bp, JSON.stringify(b)); } catch (e) { } }
  return { job, all, left, base: b };
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
function cloudNow(now) {
  const c = rj(P('ENDAT_CLOUD', 'ura-cloud.json'), null), t0 = now - 86400;
  const L = (c && Array.isArray(c.list)) ? c.list : [], sec = s => (s ? Math.floor(Date.parse(s) / 1000) : 0);
  const by = {}, all = [];
  L.forEach(r => { if (r.status === 'completed' && sec(r.createdAt) >= t0) { const m = (sec(r.updatedAt) - sec(r.createdAt)) / 60; if (m >= 0) { const k = r.workflowName || r.name || ''; (by[k] = by[k] || []).push(m); all.push(m); } } });
  const run = L.filter(r => r.status !== 'completed').map(r => { const k = r.workflowName || r.name || '', mm = by[k] && by[k].length ? med(by[k]) : med(all); return { at: sec(r.createdAt), min: mm, name: k }; });
  return { run, min: med(all), n: all.length, seen: !!c };
}

function compute(d, now) {
  d = d || {}; now = now || Number(process.env.ENDAT_NOW) || Math.floor(Date.now() / 1000);
  // 表
  const O = ordersToday(now), R = ratioToday(now, O.rows), J = curJob(d);
  const frameMin = O.frameMin > 0 ? O.frameMin : 30;   // 直近24時間の実測が無ければ30分（その旨を src に書く）
  let curEnd = 0, extra = 0, stepMin = 0;
  if (J.base) {
    const b = J.base; stepMin = (b.mikomi0 > 0 && b.steps0 > 0) ? b.mikomi0 / b.steps0 : frameMin / R.r;
    extra = Math.max(0, J.all - b.steps0);
    const plan = (b.mikomi0 > 0 ? b.mikomi0 : J.left * stepMin) + extra * stepMin;
    curEnd = b.start + Math.round(plan * R.r * 60);
    if (b.mkAt > 0 && b.mk > 0) { curEnd = Math.max(curEnd, b.mkAt + Math.round(b.mk * R.r * 60)); }
  }
  const F = d.foot || {}, wl = Array.isArray(F.waitList) ? F.waitList : [];
  const sig = wl.filter(x => /^橋（合図/.test(String((x && x.head) || ''))).length;
  const waitN = Math.max(0, (typeof F.wait === 'number' ? F.wait : wl.length) - sig);
  const base0 = curEnd > 0 ? curEnd : (Number(d.statAt) || 0);
  let omEnd = (curEnd > 0 || waitN > 0) && base0 > 0 ? base0 + Math.round(waitN * frameMin * 60) : 0, omOver = false;
  // 見込みを過ぎてまだ残っている時だけ、今の刻を5分刻みに切り上げた刻へ延ばす（指紋が変わるのは5分に一度まで）
  const fl = Math.ceil(now / 300) * 300;
  if (omEnd > 0 && omEnd < now) { omEnd = fl; omOver = true; }
  const omote = {
    endAt: omEnd ? hm(omEnd) : '', endSec: omEnd, over: omOver, startSec: J.base ? J.base.start : 0,
    cur: { job: J.job, left: J.left, all: J.all, steps0: J.base ? J.base.steps0 : 0, addSteps: extra, mikomi: J.base ? J.base.mikomi0 : 0, stepMin: r1(stepMin), endAt: curEnd ? hm(curEnd) : '' },
    wait: { n: waitN, signals: sig, frameMin: r1(frameMin), frameN: O.frameN },
    ratio: { v: Math.round(R.r * 100) / 100, n: R.n },
    src: (J.base ? ('今の仕事 残り' + J.left + '段（始まり ' + hm(J.base.start) + '・見込み ' + (J.base.mikomi0 || '未記入') + '分' + (extra ? '・段+' + extra + '×' + r1(stepMin) + '分' : '') + '）') : '今の仕事なし') +
      '＋順番待ち ' + waitN + '件×' + r1(frameMin) + '分（直近24時間の' + (O.frameN ? O.frameN + '枠の中央値' : '実測なし・仮に30分') + (sig ? '・合図' + sig + '件は数えない' : '') + '）・見込みと実測の比 ' + (Math.round(R.r * 100) / 100) + '（直近24時間 ' + R.n + '組）' + (omOver ? '・見込みを過ぎて残っているので今から5分刻みで延ばした' : '')
  };
  // 裏方
  const S = subsNow(now), C = cloudNow(now), sMin = S.min > 0 ? S.min : 15, ends = [];
  S.run.forEach(t => ends.push(t + Math.round(sMin * 60)));
  C.run.forEach(x => ends.push(x.at + Math.round((x.min > 0 ? x.min : 10) * 60)));
  let uEnd = ends.length ? Math.max.apply(null, ends) : 0, uOver = false;
  if (uEnd > 0 && uEnd < now) { uEnd = fl; uOver = true; }
  const ura = {
    endAt: uEnd ? hm(uEnd) : '', endSec: uEnd, over: uOver,
    sub: { n: S.run.length, min: r1(sMin), done: S.n }, cloud: { n: C.run.length, min: r1(C.min > 0 ? C.min : 10), done: C.n },
    src: '下請け ' + S.run.length + '本（1本 ' + r1(sMin) + '分＝直近24時間' + (S.n ? ' ' + S.n + '本の中央値' : 'の実測なし・仮に15分') + '）・雲 ' + C.run.length + '本（1本 ' + r1(C.min > 0 ? C.min : 10) + '分＝直近24時間' + (C.n ? ' ' + C.n + '本の中央値（流れの名ごと）' : 'の実測なし・仮に10分') + '）' + (uOver ? '・見込みを過ぎて動いているので今から5分刻みで延ばした' : '')
  };
  return { omote, ura };
}
module.exports = { compute, nums, med };
if (require.main === module) {
  let d = {}; try { d = JSON.parse(rd(process.argv[2])); } catch (e) { }
  process.stdout.write(JSON.stringify(compute(d), null, 1) + NL);
}
