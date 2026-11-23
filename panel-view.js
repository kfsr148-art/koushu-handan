// panel-view.js — 本人の画面（panel.html）が今何と出しているかを、見張りの側で組む（2026-11-21・橋の枠 十三）
//
// 目的：センコは state.json を読めるが、パネルの頭の字・まとめて写すの残りは端末の中で組まれるので見えない。
//   見張り（inbox-watch.ps1）が state.json に panelView を足す。中身は {head, label, left, basis, coreVer, at, omote, ura, all}。
// 決まり（v210・本人の枠 七十四）：数え方と字の組み立ては隣の panel-core.js 一つ。パネル（panel.html）も同じ物を
//   <script src="panel-core.js?_v=<版>"> で読む。ここに同じ字の写しを置かない（前は写しで、片方だけ先に公開されると数がずれた）。
//   ＊端末で本人が押した「写した」印は端末の中だけにある。panelView は senkoReadAt だけで数える（basis に書く）。
//   ＊生存の途切れ（lastLost）は見張りが今書いている時点では偽。
//   ＊coreVer＝この panelView を組んだ panel-core.js の版。公開のパネルの版（panel-ver.txt）と違う間は、数え方が違い得る
//     （VAIO はリポジトリの panel-core.js をすぐ読むが、公開のパネルは検査を通って配られてから替わる）。
//   ＊pub＝公開のパネルの版（v212・枠 七十七）：state.json の pubVer（見張りが compare-dest.js の控えから運ぶ実物）。段の字からは読まない。
//   ＊omote.panel.steps＝段の数と今の段（v212）：panel-core.js の stepsOf で生の段（state.json の steps.rows）から数えた物。パネルの段 N/M と同じ。
// 使い方：node panel-view.js <state.json の道> [<出し先>]   → panelView の JSON（notices.json・ntfy-sent.json は同じ場所から読む）
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = __dirname;
const PC = require(path.join(ROOT, 'panel-core.js'));

// v206（本人の枠 六十二）：noEstimate＝作業中なのに窓が見込み（分の数）を書いていない。パネルの箱には赤い「見込み未記入」を出さず、ここ（state.json の panelView）にだけ残す。
// 材料 d＝state.json の中身、notices＝notices.json（配列）、ntfySent＝ntfy-sent.json（配列）、now＝epoch 秒
// v224（枠 百五十六）：影の仕事の箱。材料は ~/.claude/shadow-last.json（走り手 shadow-run.js が書く）。影が走っている間（状態『走行中』・始まりから10分以内）だけ載せる。済んだら null（パネルは箱ごと出さない）。金額は載せない。
function shadowBox(now) {
  try {
    const home = process.env.SHADOW_HOME || path.join(require('os').homedir(), '.claude');
    const rd = f => JSON.parse(fs.readFileSync(path.join(home, f), 'utf8').replace(/^﻿/, ''));
    const s = rd('shadow-last.json');
    now = now || Math.floor(Date.now() / 1000);
    if (!s || s.state !== '走行中' || !(Number(s.startSec) > 0) || now - Number(s.startSec) > 600) { return null; }
    let day = {}; try { day = rd('shadow-day.json'); } catch (e) { }
    const tot = Math.max(1, Number(day.total) || 1), dn = Math.max(0, Math.min(tot - 1, Number(day.done) || 0));
    const end = Number(s.endSec) > 0 ? Number(s.endSec) : 0;
    const d = new Date((end || now) * 1000 + 9 * 3600 * 1000), p2 = n => String(n).padStart(2, '0');
    const t = String(s.title || '').split(String.fromCharCode(10)).join(' ').trim();
    return { k: '影の仕事', done: dn, run: 1, total: tot, now: t.length > 30 ? t.slice(0, 29) + '…' : t, endSec: end, endAt: end ? p2(d.getUTCHours()) + ':' + p2(d.getUTCMinutes()) : '', over: false, unk: false, lab: dn + '/' + tot };
  } catch (e) { return null; }
}
// v225（枠 百六十二）：棚（余った使用量で回す溜め場）の釦と一覧の材料。~/.claude/shelf.json（走り手 shadow-run.js が控える）。無ければ null。
function shelfView() {
  try {
    const home = process.env.SHADOW_HOME || path.join(require('os').homedir(), '.claude');
    const s = JSON.parse(fs.readFileSync(path.join(home, 'shelf.json'), 'utf8').replace(/^\uFEFF/, ''));
    if (!s || !Array.isArray(s.items)) { return null; }
    return { n: s.items.length, pct: Math.round((Number(s.pct) || 0) * 10) / 10, items: s.items.slice(0, 30).map(x => ({ no: x.no, title: String(x.title || '').slice(0, 80), pct: Number(x.pct) || 0, type: String(x.type || '').slice(0, 30) })) };
  } catch (e) { return null; }
}
function panelView(d, notices, ntfySent, now) {
  d = d || {}; now = now || Math.floor(Date.now() / 1000);
  const rows = Array.isArray(notices) ? notices : [];
  // ---- 残り（パネルの mergedTodo と同じ PC.todoList。端末の写した印は渡さない）----
  const left = PC.todoList({ rows: rows, ntfySent: ntfySent, readAt: PC.senkoEpoch(d.senkoReadAt) }).length;
  // ---- 頭の字（パネルの headText と同じ PC.headText）----
  const head = PC.headText({ stat: d.stat, cloud: (typeof d.cloud === 'string') ? d.cloud : '', detail: (typeof d.detail === 'string') ? d.detail.replace(/（なし）/g, '') : '', ura: d.ura || null, lost: false,
    owedAt: (typeof d.cardOwedAt === 'number') ? d.cardOwedAt : 0, owedEta: (typeof d.cardOwedEta === 'number') ? d.cardOwedEta : 0, rows: rows, kumo: ((typeof d.kumo === 'string') && d.kumo) ? d.kumo : ((typeof d.temoto === 'string') ? d.temoto : ''), left: left, now: now });
  return { shadowBox: shadowBox(now), shelf: shelfView(), head: head, label: PC.todoLabel(left), left: left, basis: 'センコの読み（senkoReadAt）だけで数えた。本人が端末で押した「写した」印は含まない', senkoReadAt: String(d.senkoReadAt || ''), coreVer: PC.VER, pub: { ver: String(d.pubVer || ''), at: Number(d.pubVerAt) || 0, line: PC.pubLine({ pubVer: d.pubVer, pubVerAt: d.pubVerAt, coreVer: PC.VER }) }, noEstimate: (String(d.stat || '') === '作業中' && !/[0-9]/.test(String(d.mikomi == null ? '' : d.mikomi))), jobEnd: jobEnd(d), omote: omoteView(d, now), ura: uraView(d, now), all: allView(d, now), at: now };
}
// v203（枠 五十）：omote／ura は {lines（様子を写すと同じ字。パネルの画面には出さない）, endAt（HH:MM・JST）, endSec, src（元の数の一言）, 元の数…}。E は d.eta（endat.js）。
// v204（枠 五十一）：panel＝パネルの箱が今出している物だけ（gauge＝ゲージの横の小さい字・end＝「全部終わる見込み HH:MM」の一行。裏方は done／run も）。src・始まり・lines は state.json の中だけ。
// v210（枠 七十四）：panel.eta＝箱の頭の「あと N分（HH:MM ごろ）」（パネルと同じ PC.headEta。表と全部は今の仕事の見込みを過ぎたら赤＝PC.workLate）。
// v213（本人の枠 八十三）：今の仕事の見込みの終わりは PC.mikomiEnd 一つ（見込みを書いた刻 mikomiAt＋見込み・増えた段は endat.js の cur.endSec）
function curEndOf(d) { const E = (d.eta && typeof d.eta === 'object') ? d.eta : null; return (E && E.omote && E.omote.cur && Number(E.omote.cur.endSec) > 0) ? Number(E.omote.cur.endSec) : 0; }
function jobEnd(d) { const e = PC.mikomiEnd({ mikomi: d.mikomi, mikomiAt: d.mikomiAt, startedAt: d.startedAt, curEnd: curEndOf(d) }); const hm = (x) => { const t = new Date((x + 9 * 3600) * 1000); return ('0' + t.getUTCHours()).slice(-2) + ':' + ('0' + t.getUTCMinutes()).slice(-2); }; return { mikomi: String(d.mikomi || ''), mikomiAt: Number(d.mikomiAt) || 0, endSec: e, endAt: e > 0 ? hm(e) : '' }; }
function lateOf(d, now) { return PC.workLate(d.stat, d.startedAt, d.mikomi, now, d.mikomiAt, curEndOf(d)); }
function etaOf(box, late, now) { const has = !!(box && box.total > 0 && box.total - box.done > 0); return PC.headEta(has ? box : null, now, late); }
function omoteView(d, now) {
  now = now || Math.floor(Date.now() / 1000);
  const E = (d.eta && typeof d.eta === 'object') ? d.eta : null, eo = (E && E.omote) || {};
  const st = Number(eo.startSec) > 0 ? Number(eo.startSec) : d.startedAt;
  const box = PC.boxSpec(E, d.ura, 'omote');
  const so = PC.stepsOf(d);   // v212（枠 七十七）：段は生の段（d.steps.rows）から毎回数える。無い古い state は stepTotal/stepDone/sNow
  return Object.assign({ lines: [PC.endLine(E, 'omote')].concat(PC.omoteLines({ stat: d.stat, subj: d.subj, steps: d.steps, sNow: d.sNow, stepDone: d.stepDone, stepTotal: d.stepTotal, startedAt: st, mikomi: d.mikomi })) }, eo, { panel: { gauge: PC.omoteGauge(so.now, so.done, so.total), steps: { from: so.from, done: so.done, total: so.total, now: so.now }, end: PC.endShort(E, 'omote'), box: box, eta: box ? etaOf(box, lateOf(d, now), now) : null } });
}
function uraView(d, now) {
  now = now || Math.floor(Date.now() / 1000);
  const E = (d.eta && typeof d.eta === 'object') ? d.eta : null, c = PC.uraCount(d.ura), g = PC.uraGauge(d.ura, E), box = PC.boxSpec(E, d.ura, 'ura');
  return Object.assign({ lines: [PC.endLine(E, 'ura')].concat(PC.uraLines(d.ura)) }, (E && E.ura) || {}, { panel: { gauge: g ? g.lab : '', done: c.done, run: c.run, end: PC.endShort(E, 'ura'), box: box, eta: box ? etaOf(box, false, now) : null } });
}
// v205（枠 五十六）：全部＝表と裏方を合わせた箱（endat.js の all）。panel.box＝パネルの一番上の箱が出している物（名・今動かしている物・区切り・刻）
function allView(d, now) {
  now = now || Math.floor(Date.now() / 1000);
  const E = (d.eta && typeof d.eta === 'object') ? d.eta : null, box = PC.boxSpec(E, d.ura, 'all');
  return Object.assign({}, (E && E.all) || {}, { panel: { box: box, eta: box ? etaOf(box, lateOf(d, now), now) : null } });
}

// 字の組み立ては panel-core.js の物をそのまま出す（panel-check.js・endat の検査が読む口。写しではない）
module.exports = { panelView, senkoEpoch: PC.senkoEpoch, omoteLines: PC.omoteLines, uraLines: PC.uraLines, endLine: PC.endLine, endShort: PC.endShort, uraCount: PC.uraCount, boxSpec: PC.boxSpec, uraBusyText: PC.uraBusyText, ntfyOfCard: PC.ntfyOfCard, core: PC };

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
