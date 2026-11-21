// panel-view.js — 本人の画面（panel.html）が今何と出しているかを、見張りの側で組む（2026-11-21・橋の枠 十三）
//
// 目的：センコは state.json を読めるが、パネルの頭の字・まとめて写すの残りは端末の中で組まれるので見えない。
//   見張り（inbox-watch.ps1）が state.json に panelView を足す。中身は {head, label, left, basis, at}。
// 決まり：panel.html の headText／cardsPending／cardPendText／kumoEtaSec／isRunning／mergedTodo の数え方と同じ。
//   ＊panel.html を直したら、ここも直す。ずれは panel-check.js の「⑤の十六」が panel.html の headText を実際に動かして突き合わせる。
//   ＊端末で本人が押した「写した」印は端末の中だけにある。panelView は senkoReadAt だけで数える（basis に書く）。
//   ＊生存の途切れ（lastLost）は見張りが今書いている時点では偽。
// 使い方：node panel-view.js <state.json の道> [<出し先>]   → panelView の JSON（notices.json・ntfy-sent.json は同じ場所から読む）
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = __dirname;

function senkoEpoch(s) { const m = /^([0-9]{4}-[0-9]{2}-[0-9]{2}) ([0-9]{2}:[0-9]{2}:[0-9]{2})$/.exec(String(s || '')); if (!m) { return 0; } const t = Date.parse(m[1] + 'T' + m[2] + '+09:00'); return isNaN(t) ? 0 : Math.floor(t / 1000); }
function pad2(n) { return ('0' + n).slice(-2); }
function hm(sec) { const d = new Date(sec * 1000); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }
function newestTime(arr) { let t = 0; (arr || []).forEach(d => { if ((d.time || 0) > t) { t = d.time || 0; } }); return t; }
function isCountCard(d) { return /^写せます（[0-9]+件）$/.test(String((d && d.message) || '').trim()); }

// v202（2026-11-21・枠 四十六の三・四十八）：表の仕事と裏方の行。panel.html の omoteLines・uraLines と一字も違わない写し（⑤の十七が字面を突き合わせる）。
function omoteLines(o) {
  o = o || {}; var s = function (v) { return String(v == null ? '' : v); };
  var hm = function (sec) { var d = new Date((Number(sec) + 9 * 3600) * 1000); return ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2); };
  var subj = s(o.subj).trim(), stat = s(o.stat).trim(), st = Number(o.startedAt) || 0;
  var fm = subj.match(/(?:橋の)?枠[ 　]*[一二三四五六七八九十百〇零0-9A-Za-z]+/);
  var tot = Number(o.stepTotal) || 0, dn = Number(o.stepDone) || 0, now = s(o.sNow).trim();
  return ['表の仕事：' + (subj || 'なし') + (stat ? '（' + stat + '）' : ''),
    '枠：' + (fm ? fm[0] : '件名に枠の番号なし'),
    '段：' + ((now && tot > 0) ? (Math.min(tot, dn + 1) + '/' + tot + '　' + now) : 'なし'),
    '始まり：' + (st > 0 ? hm(st) : '不明')];
}
// v203（2026-11-21・本人の枠 五十）：表と裏方の「全部終わる見込み」の一行。E＝{omote, ura}（隣の endat.js が組む。今の枠だけの終わりは出さない）。panel.html の endLine と一字も違わない写し（⑤の十七）。
function endLine(E, k) {
  var s = function (v) { return String(v == null ? '' : v); }, nm = (k === 'ura') ? '裏方' : '表の仕事', x = (E && typeof E === 'object') ? E[k] : null;
  if (!x || typeof x !== 'object' || !('endAt' in x)) { return nm + 'の全部終わる見込み：state.json に載っていない'; }
  return nm + 'の全部終わる見込み：' + (s(x.endAt) || ((k === 'ura') ? 'なし（動いている物が無い）' : 'なし（残りの仕事が無い）')) + (x.src ? '（' + s(x.src) + '）' : '');
}
// v204（2026-11-22・本人の枠 五十一）：パネルの箱に出す字（「全部終わる見込み HH:MM」の一行だけ）と裏方のゲージの数。panel.html の endShort・uraCount と一字も違わない写し（⑤の十七）。
function endShort(E, k) {
  var x = (E && typeof E === 'object') ? E[k] : null;
  return (x && typeof x === 'object' && x.endAt) ? ('全部終わる見込み ' + String(x.endAt)) : '';
}
function uraCount(U) {
  var a = function (x) { return Array.isArray(x) ? x : []; }; U = (U && typeof U === 'object') ? U : {};
  var S = U.sub || {}, C = U.cloud || {};
  return { run: a(S.items).length + a(C.running).length, done: a(S.recent).length + a(C.recent).length };
}
// v205（2026-11-22・本人の枠 五十四〜五十六）：ゲージの箱（全部／表の仕事／裏方）の中身。panel.html の boxSpec と一字も違わない写し（⑤の十七）。
function boxSpec(E, U, k) {
  var s = function (v) { return String(v == null ? '' : v); }, x = (E && typeof E === 'object') ? E[k] : null;
  if (!x || typeof x !== 'object' || !x.seg || typeof x.seg !== 'object') { return null; }
  var tot = Math.max(0, Number(x.seg.total) | 0), dn = Math.max(0, Math.min(tot, Number(x.seg.done) | 0)), run = Math.max(0, Math.min(tot - dn, Number(x.seg.run) | 0));
  var cut = function (t, n) { t = s(t).split(String.fromCharCode(10)).join(' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  var left = function (y) { var g = (y && y.seg) || {}; return Math.max(0, (Number(g.total) | 0) - (Number(g.done) | 0)); };
  var now = '';
  if (k === 'omote') { var c = x.cur || {}, w = x.wait || {}; now = c.job ? cut(c.job, 30) : (Number(w.n) > 0 ? '順番待ち ' + Number(w.n) + '件' : ''); }
  else if (k === 'ura') { var a = function (v) { return Array.isArray(v) ? v : []; }, Uo = (U && typeof U === 'object') ? U : {}, o = []; a((Uo.sub || {}).items).forEach(function (y) { o.push('下請け・' + (s(y.desc) || '名なし')); }); a((Uo.cloud || {}).running).forEach(function (y) { o.push('雲・' + (s(y.name) || '名なし')); }); now = cut(o.join('、'), 40); }
  else { now = '表の仕事 残り' + left(E.omote) + '・裏方 残り' + left(E.ura); }
  return { k: (k === 'all') ? '全部' : ((k === 'ura') ? '裏方' : '表の仕事'), done: dn, run: run, total: tot, now: now, endSec: Number(x.endSec) || 0, endAt: s(x.endAt), over: !!x.over };
}
function uraLines(U) {
  if (!U || typeof U !== 'object') { return ['裏方：state.json に載っていない']; }
  var o = [], S = U.sub || {}, C = U.cloud || {}, a = function (x) { return Array.isArray(x) ? x : []; }, s = function (v) { return String(v == null ? '' : v); };
  var it = a(S.items);
  if (it.length) { it.forEach(function (x) { o.push('下請け 動作中：' + s(x.start) + '〜　' + s(x.desc) + (x.type ? '（' + s(x.type) + '）' : '')); }); } else { o.push('下請け：動いていない'); }
  a(S.recent).forEach(function (x) { o.push('下請け ' + (s(x.state) || '済') + '：' + s(x.start) + '〜' + s(x.end) + '　' + s(x.desc)); });
  var rn = a(C.running);
  if (rn.length) { rn.forEach(function (x) { o.push('雲 ' + (s(x.state) || '走行中') + '：' + s(x.at) + '〜　' + s(x.name) + ((x.title && x.title !== x.name) ? '「' + s(x.title) + '」' : '')); }); } else { o.push('雲：走っていない'); }
  a(C.recent).forEach(function (x) { o.push('雲 ' + (s(x.state) || '済') + '：' + s(x.at) + '〜' + s(x.upd) + '　' + s(x.name) + (x.failStep ? '（落ちた段：' + s(x.failStep) + '）' : '')); });
  return o;
}

// 材料 d＝state.json の中身、notices＝notices.json（配列）、ntfySent＝ntfy-sent.json（配列）、now＝epoch 秒
function panelView(d, notices, ntfySent, now) {
  d = d || {}; now = now || Math.floor(Date.now() / 1000);
  const readAt = senkoEpoch(d.senkoReadAt);
  const covers = (t) => readAt > 0 && Number(t || 0) > 0 && Number(t) <= readAt;
  // ---- 残り（mergedTodo と同じ数え方。端末の写した印は使わない）----
  const rows = (Array.isArray(notices) ? notices : []);
  const shown = rows.filter(r => !covers(r && r.time));
  const cardEid = {}; shown.forEach(r => { if (r && r.eid) { cardEid[r.eid] = 1; } });
  let left = 0;
  shown.forEach(r => { if (!isCountCard(r)) { left++; } });
  (Array.isArray(ntfySent) ? ntfySent : []).forEach(e => { if (e && e.eid && cardEid[e.eid]) { return; } if (!covers(e && e.time)) { left++; } });
  // ---- 頭の字（headText と同じ順）----
  const lastStat = String(d.stat || ''), lastDetail = (typeof d.detail === 'string') ? d.detail.replace(/（なし）/g, '') : '';
  const lastCloud = (typeof d.cloud === 'string') ? d.cloud : '', lastHelp = (typeof d.help === 'string') ? d.help : '';
  const lastKumo = (typeof d.kumo === 'string') ? d.kumo : '';
  const lastEvAt = (typeof d.evAt === 'number') ? d.evAt : 0;
  const owedAt = (typeof d.cardOwedAt === 'number') ? d.cardOwedAt : 0, owedEta = (typeof d.cardOwedEta === 'number') ? d.cardOwedEta : 0;
  const running = (lastStat === '作業中' || lastStat === '検査中');
  const cardsPending = () => {
    if (!(owedAt > 0)) { return false; }
    if (now - owedAt > Math.max(600, (owedEta > owedAt ? owedEta - owedAt + 900 : 0))) { return false; }
    return newestTime(rows) < owedAt;
  };
  const etaSec = () => owedEta > owedAt ? owedEta : (owedAt + 150);
  const late = () => cardsPending() && now > Math.max(owedAt + 180, etaSec() + 30);
  const kumoEta = () => {
    const m = String(lastKumo || '').match(/見込み[ ]*([0-9]{1,2}):([0-9]{2})/); if (!m) { return 0; }
    const t = new Date(now * 1000); t.setHours(Number(m[1]), Number(m[2]), 0, 0);
    let sec = Math.floor(t.getTime() / 1000); if (sec < now - 12 * 3600) { sec += 24 * 3600; }
    return sec > now ? sec : 0;
  };
  const head = () => {
    if (/^止まり/.test(lastStat)) { return lastStat; }
    if (lastStat === '動きなし') { return '動きなし（最後の動き ' + (lastEvAt ? hm(lastEvAt) : '不明') + '）'; }
    if (lastStat === '検査中') { return '検査中：' + (lastDetail || '雲の走り'); }
    if (lastStat === '待ち') { return '待ち：' + (lastDetail || '訳不明'); }
    if (lastStat === '作業中') { return lastDetail ? ('作業中、、、。（' + lastDetail + '）') : '作業中、、、。'; }
    if (running && /^検査中：/.test(lastCloud)) { return lastCloud; }
    if (running) { const wx = [lastCloud, (/^裏で手伝い/.test(lastHelp) ? lastHelp : '')].filter(Boolean).join('・'); return wx ? ('作業中、、、。（' + wx + '）') : '作業中、、、。'; }
    if (lastStat === 'ヨシ待ち') { return 'ヨシ待ち、、、。'; }
    if (cardsPending()) { return late() ? '札が遅れている' : ('札まとめ中、、、。（' + hm(etaSec()) + ' ごろ）'); }
    if (kumoEta() > 0) { return hm(kumoEta()) + ' になったら まとめて写すヨシ！'; }
    if (left > 0) { return 'まとめて写すヨシ！'; }
    return '待機中、、、。';
  };
  return { head: head(), label: left > 0 ? ('まとめて写す（残' + left + '／' + left + '件）') : 'まとめて写す（0件）', left: left, basis: 'センコの読み（senkoReadAt）だけで数えた。本人が端末で押した「写した」印は含まない', senkoReadAt: String(d.senkoReadAt || ''), omote: omoteView(d), ura: uraView(d), all: allView(d), at: now };
}
// v203（枠 五十）：omote／ura は {lines（様子を写すと同じ字。パネルの画面には出さない）, endAt（HH:MM・JST）, endSec, src（元の数の一言）, 元の数…}。E は d.eta（endat.js）。
// v204（枠 五十一）：panel＝パネルの箱が今出している物だけ（gauge＝ゲージの横の小さい字・end＝「全部終わる見込み HH:MM」の一行。裏方は done／run も）。src・始まり・lines は state.json の中だけ。
function omoteView(d) {
  const E = (d.eta && typeof d.eta === 'object') ? d.eta : null, eo = (E && E.omote) || {};
  const st = Number(eo.startSec) > 0 ? Number(eo.startSec) : d.startedAt;
  const tot = Number(d.stepTotal) || 0, dn = Number(d.stepDone) || 0;
  return Object.assign({ lines: [endLine(E, 'omote')].concat(omoteLines({ stat: d.stat, subj: d.subj, sNow: d.sNow, stepDone: d.stepDone, stepTotal: d.stepTotal, startedAt: st, mikomi: d.mikomi })) }, eo, { panel: { gauge: (String(d.sNow || '').trim() && tot > 0) ? (Math.min(tot, dn + 1) + '/' + tot) : '', end: endShort(E, 'omote'), box: boxSpec(E, d.ura, 'omote') } });
}
function uraView(d) {
  const E = (d.eta && typeof d.eta === 'object') ? d.eta : null, c = uraCount(d.ura), end = endShort(E, 'ura');
  return Object.assign({ lines: [endLine(E, 'ura')].concat(uraLines(d.ura)) }, (E && E.ura) || {}, { panel: { gauge: (c.run > 0 || end) ? (c.done + '/' + (c.done + c.run)) : '', done: c.done, run: c.run, end: end, box: boxSpec(E, d.ura, 'ura') } });
}
// v205（枠 五十六）：全部＝表と裏方を合わせた箱（endat.js の all）。panel.box＝パネルの一番上の箱が出している物（名・今動かしている物・区切り・刻）
function allView(d) {
  const E = (d.eta && typeof d.eta === 'object') ? d.eta : null;
  return Object.assign({}, (E && E.all) || {}, { panel: { box: boxSpec(E, d.ura, 'all') } });
}

module.exports = { panelView, senkoEpoch, omoteLines, uraLines, endLine, endShort, uraCount, boxSpec };

if (require.main === module) {
  // 使い方：node panel-view.js <state.json の道> [<出し先の道>]  出し先が無ければ標準出力（PowerShell の文字化けを避けるため、見張りは道を渡す）
  const rd = (f) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^﻿/, '')); } catch (e) { return []; } };
  let d = {}; try { d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8').replace(/^﻿/, '')); } catch (e) { }
  // v202：見張りは ura（裏方）を panelView の後に足すので、state に ura が無ければ見張りの控え（~/.claude/ura-out.json＝一つ前の巡回の物）を読む
  if (!d.ura) { try { d.ura = JSON.parse(fs.readFileSync(path.join(require('os').homedir(), '.claude', 'ura-out.json'), 'utf8').replace(/^﻿/, '')); } catch (e) { } }
  // v203（枠 五十）：表と裏方の全部終わる見込みは、隣の endat.js で組む（~/.claude の台帳・段の台帳・下請けと雲の控えを読む）。こけたら eta 無しで今までどおり
  if (!d.eta) { try { d.eta = require(path.join(ROOT, 'endat.js')).compute(d); } catch (e) { } }
  const out = JSON.stringify(panelView(d, rd('notices.json'), rd('ntfy-sent.json')));
  if (process.argv[3]) { fs.writeFileSync(process.argv[3], out, 'utf8'); } else { process.stdout.write(out); }
}
