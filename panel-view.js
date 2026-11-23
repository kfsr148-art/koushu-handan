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
// v228（枠 百九十七・棚 #10）：今ヨシ待ちの印の一覧（~/.claude/yoshi-open.tsv の一列目＝印・古い順）。ヨシの釦の件数と、押した時に付ける『いちばん新しい印』の元。印は話題名ではないので公開してよい。
// v229（棚 #10 段③）：指さした部品（~/.claude/yubisashi.json の name・at）。無ければ null。
function yubisashiView() {
  try {
    const home = process.env.SHADOW_HOME || path.join(require('os').homedir(), '.claude');
    const o = JSON.parse(fs.readFileSync(path.join(home, 'yubisashi.json'), 'utf8').replace(/^﻿/, ''));
    if (!o || typeof o.name !== 'string' || !o.name) { return null; }
    return { name: o.name.slice(0, 40), at: String(o.at || '') };
  } catch (e) { return null; }
}
function yoshiOpenList() {
  try {
    const home = process.env.SHADOW_HOME || path.join(require('os').homedir(), '.claude');
    return fs.readFileSync(path.join(home, 'yoshi-open.tsv'), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).map(l => l.split('\t')[0]).filter(m => /^y[0-9]{4}-[0-9]{4}/.test(m)).slice(-20);
  } catch (e) { return []; }
}
// v227（枠 百九十三・棚 #11）：棚の割り振り係の素振りの最後の結果を一行にする（純粋）。材料＝~/.claude/shelf-run.json（at／would／reason／hLeft／week／room）と棚の一覧。
//   ＊「起こすなら #N（見積もり M%）」／「今は入らん（残り A%・一番軽い #N は B%）」／「動く時間の外（次は HH:MM から）」。見た刻（素振りの at）を HH:MM で添える。
function sweepLine(r, items) {
  if (!r || typeof r !== 'object' || !r.at) { return ''; }
  const t = Date.parse(r.at); if (!t) { return ''; }
  const hm = ms => { const d = new Date(ms); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  let body = '';
  const hLeft = Number(r.hLeft);
  if (r.would && r.would.no != null) { body = '起こすなら #' + r.would.no + '（見積もり ' + (Number(r.would.pct) || 0) + '%）'; }
  else if (isFinite(hLeft) && /戻りまで [0-9.]+ 時間/.test(String(r.reason || '')) && hLeft > 8) { body = '動く時間の外（次は ' + hm(t + (hLeft - 8) * 3600000) + ' から）'; }
  else if (/1時間を切った/.test(String(r.reason || ''))) { body = '戻りまで1時間を切った（新しく起こさない）'; }
  else if (typeof r.room === 'number') {
    const arr = (Array.isArray(items) ? items : []).filter(x => Number(x.pct) > 0), min = arr.length ? arr.reduce((a, b) => (Number(b.pct) < Number(a.pct) ? b : a)) : null;
    body = '今は入らん（残り ' + r.room + '%' + (min ? '・一番軽い #' + min.no + ' は ' + (Math.round(Number(min.pct) * 15) / 10) + '%' : '') + '）';
  } else { body = String(r.reason || '').slice(0, 60); }
  return '素振り ' + hm(t) + ' 時点：' + body;
}
// 枠 二百七：1セッション≒棚 N%＝セッション100%で棚が何%ぶん（週%の単位）進むか。rows の各行は {s:セッション%, w:週%}（分け前）。s<=0 の行は使わない。
//   使える行が3件未満は今の値16を（仮）で出す。3件以上は 週%÷セッション%×100 の中央値（整数に丸める）。
function shelfCapacity(rows) {
  const r = (Array.isArray(rows) ? rows : []).filter(x => x && Number(x.s) > 0 && isFinite(Number(x.w))).slice(-20);
  if (r.length < 3) { return '1セッション≒棚 16%'; }   // 枠 二百十五：元が少ない間も同じ形（言葉は付けない）
  return '1セッション≒棚 ' + Math.round(median(r.map(x => Number(x.w) / Number(x.s) * 100))) + '%';
}
// v225（枠 百六十二）：棚（余った使用量で回す溜め場）の釦と一覧の材料。~/.claude/shelf.json（走り手 shadow-run.js が控える）。無ければ null。
function shelfView() {
  try {
    const home = process.env.SHADOW_HOME || path.join(require('os').homedir(), '.claude');
    // v235（枠 二百三十）：棚の釦は『計N件・使用予定M%』＝雲に並べてまだ札が出ていない枠の件数と週の見込み%の合計。元は ~/.claude/cloud-queue.json（cloud-queue.js が60秒に一度組む）。あればこれを使い、無ければ従来の shelf.json。
    //   ＊検査（SHADOW_HOME 指定）では台本を呼ばない。
    try {
      const cqf = path.join(home, 'cloud-queue.json'), bomRe = new RegExp('^' + String.fromCharCode(0xFEFF));
      if (!process.env.SHADOW_HOME) {
        let age = 1e9; try { age = Date.now() / 1000 - Number(JSON.parse(fs.readFileSync(cqf, 'utf8').replace(bomRe, '')).epoch || 0); } catch (e) { }
        if (age > 60) { require('child_process').spawnSync(process.execPath, [path.join(home, 'cloud-queue.js')], { timeout: 45000, windowsHide: true }); }
      }
      const q = JSON.parse(fs.readFileSync(cqf, 'utf8').replace(bomRe, ''));
      if (q && Array.isArray(q.items) && (Date.now() / 1000 - Number(q.epoch || 0)) < 900) { return { n: q.items.length, sweep: '', capacity: null, pct: Math.round((Number(q.pct) || 0) * 10) / 10, cloud: true, items: q.items.slice(0, 30).map(x => ({ no: x.no, title: String(x.title || '').slice(0, 80), pct: Number(x.pct) || 0, type: String(x.status || '') + (x.est ? '・見込み推定' : '') })) }; }
    } catch (e) { }
    const s = JSON.parse(fs.readFileSync(path.join(home, 'shelf.json'), 'utf8').replace(/^\uFEFF/, ''));
    if (!s || !Array.isArray(s.items)) { return null; }
    let sw = ''; try { sw = sweepLine(JSON.parse(fs.readFileSync(path.join(home, 'shelf-run.json'), 'utf8').replace(/^﻿/, '')), s.items); } catch (e) { sw = ''; }
    let cap = null; try { const tab = String.fromCharCode(9), nl = String.fromCharCode(10); const rows = fs.readFileSync(path.join(home, 'shelf-history.tsv'), 'utf8').split(nl).filter(l => l && l.charAt(0) !== '#').map(l => { const c = l.split(tab); return { s: Number(c[2]), w: Number(c[3]) }; }); cap = shelfCapacity(rows); } catch (e) { cap = shelfCapacity([]); }
    return { n: s.items.length, sweep: sw, capacity: cap, pct: Math.round((Number(s.pct) || 0) * 10) / 10, items: s.items.slice(0, 30).map(x => ({ no: x.no, title: String(x.title || '').slice(0, 80), pct: Number(x.pct) || 0, type: String(x.type || '').slice(0, 30) })) };
  } catch (e) { return null; }
}
// v226（枠 百六十五）：今走っている仕事一つの週の使用量。見込み＝似た型（見込み時間が近い）の終わった仕事の実測の中央値から。今まで＝仕事の始まりの週%と今の週%の差。
//   ＊週%は整数なので粗い。終わった仕事の実測は ~/.claude/job-week-history.tsv（刻／見込み分／増えた週%／経過分）に貯める（棚の見積もりの学びにも使う）。
//   ＊weekJobStep は純粋（ファイルを触らない）。weekJobUpdate が ~/.claude の job-week.json・job-week-history.tsv を読み書きする（CLI の見張りの呼びだけから呼ぶ。検査の panelView は書かない）。
function mikomiMin(v) { const m = String(v == null ? '' : v).match(/([0-9]+)/); return m ? parseInt(m[1], 10) : 0; }
function median(a) { const b = a.slice().sort((x, y) => x - y), n = b.length; return n ? (n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2) : 0; }
// 枠 百七十六：額→週% の換算 k（週% / USD）。点＝週%が一つ上がった変わり目の額（statusline-usage.js が cost-pct.json に控える）。最初と最後の点の差から出す。点が2つ未満・額が増えていない時は null（換算が立つまで整数の今まで）。
function convK(points) {
  const p = Array.isArray(points) ? points.filter(x => x && typeof x.pct === 'number' && typeof x.cost === 'number') : [];
  if (p.length < 2) { return null; }
  const a = p[0], b = p[p.length - 1], dc = b.cost - a.cost, dp = b.pct - a.pct;
  return (dc > 0.5 && dp > 0) ? dp / dc : null;
}
function pct1(v) { return v < 0.05 ? '0.1%未満' : (Math.round(v * 10) / 10).toFixed(1) + '%'; }
function weekJobStep(store, d, pct, now, hist, cost, k) {
  store = (store && typeof store === 'object') ? store : {}; hist = Array.isArray(hist) ? hist : [];
  const out = { store: store, view: null, finish: null };
  const working = d && d.stat === '作業中' && Number(d.startedAt) > 0;
  const key = working ? (String(d.startedAt) + '|' + String(d.subj || '')) : '';
  const havePct = (typeof pct === 'number' && isFinite(pct));
  if (store.key && store.key !== key) {   /* 前の仕事が終わった（別の仕事に替わった）。実測を一行返す */
    const dl = havePct || typeof store.lastPct === 'number' ? ((typeof store.lastPct === 'number' ? store.lastPct : pct) - store.startPct) : null;
    const el = Math.max(0, Math.round((now - (store.startedAt || now)) / 60));
    const endCost = (typeof cost === 'number' && isFinite(cost)) ? cost : store.lastCost;
    const dcs = (typeof endCost === 'number' && typeof store.startCost === 'number') ? Math.max(0, endCost - store.startCost) : null;
    if (dl !== null && el >= 2 && store.mikomi > 0 && dl >= 0) { out.finish = { at: now, mikomi: store.mikomi, delta: dl, minutes: el, cost: dcs }; }
    store = out.store = {};
  }
  if (!working) { return out; }
  const haveCost = (typeof cost === 'number' && isFinite(cost));
  if (!store.key) { store = out.store = { key: key, startedAt: Number(d.startedAt), startPct: havePct ? pct : null, lastPct: havePct ? pct : null, mikomi: mikomiMin(d.mikomi), startCost: haveCost ? cost : null, lastCost: haveCost ? cost : null }; }
  if (haveCost) { if (store.startCost === null || store.startCost === undefined) { store.startCost = cost; } store.lastCost = cost; }
  if (havePct) { if (store.startPct === null || store.startPct === undefined) { store.startPct = pct; } store.lastPct = pct; }
  if (mikomiMin(d.mikomi) > 0) { store.mikomi = mikomiMin(d.mikomi); }
  const dn = (typeof store.lastPct === 'number' && typeof store.startPct === 'number') ? Math.max(0, store.lastPct - store.startPct) : null;
  const mk = store.mikomi || 0, near = hist.filter(h => h.mikomi > 0 && mk > 0 && h.mikomi >= mk * 0.5 && h.mikomi <= mk * 2 && h.minutes > 0).slice(-20);
  let est = '—';
  const kk = (typeof k === 'number' && k > 0) ? k : null, nearC = near.filter(h => typeof h.cost === 'number' && h.cost > 0);
  if (kk && nearC.length >= 3 && mk > 0) { const v = median(nearC.map(h => h.cost / h.minutes)) * mk * kk; est = '約' + pct1(v); }   // 換算が立っていれば額から（小数一桁）
  else if (near.length >= 3 && mk > 0) { const v = median(near.map(h => h.delta / h.minutes)) * mk; est = v < 1 ? '1%未満' : ('約' + Math.round(v) + '%'); }
  const dcNow = (typeof store.lastCost === 'number' && typeof store.startCost === 'number') ? Math.max(0, store.lastCost - store.startCost) : null;
  const nowTxt = (kk && dcNow !== null) ? pct1(dcNow * kk) : (dn === null ? '—' : (dn < 1 ? '1%未満' : (Math.round(dn) + '%')));
  out.view = { est: '見込み ' + est, now: '今まで ' + nowTxt, n: near.length, k: kk };
  return out;
}
function weekJobUpdate(d, now) {
  const home = process.env.SHADOW_HOME || path.join(require('os').homedir(), '.claude');
  const rdj = f => { try { return JSON.parse(fs.readFileSync(path.join(home, f), 'utf8').replace(/^\uFEFF/, '')); } catch (e) { return null; } };
  now = now || Math.floor(Date.now() / 1000);
  const u = rdj('usage.json'); let pct = null;
  try { const at = Date.parse(u.at || ''); const wk = u.rate_limits && u.rate_limits.seven_day; if (wk && typeof wk.used_percentage === 'number' && at > 0 && Date.now() - at < 30 * 60 * 1000) { pct = wk.used_percentage; } } catch (e) { }
  let hist = [];
  try { hist = fs.readFileSync(path.join(home, 'job-week-history.tsv'), 'utf8').split(String.fromCharCode(10)).filter(l => l && l[0] !== '#').map(l => { const c = l.split(String.fromCharCode(9)); return { at: Number(c[0]), mikomi: Number(c[1]), delta: Number(c[2]), minutes: Number(c[3]), cost: (c[4] !== undefined && c[4] !== '') ? Number(c[4]) : null }; }); } catch (e) { }
  let cost = null; try { if (u && typeof u.cost_usd === 'number' && Date.now() - Date.parse(u.at || '') < 30 * 60 * 1000) { cost = u.cost_usd; } } catch (e) { }
  const cpj = rdj('cost-pct.json'), kconv = (cpj && u && cpj.session === u.session_id) ? convK(cpj.points) : null;
  const r = weekJobStep(rdj('job-week.json'), d, pct, now, hist, cost, kconv);
  try { fs.writeFileSync(path.join(home, 'job-week.json'), JSON.stringify(r.store)); } catch (e) { }
  if (r.finish) { try { fs.appendFileSync(path.join(home, 'job-week-history.tsv'), [r.finish.at, r.finish.mikomi, r.finish.delta, r.finish.minutes, (r.finish.cost === null || r.finish.cost === undefined) ? '' : r.finish.cost.toFixed(3)].join(String.fromCharCode(9)) + String.fromCharCode(10)); } catch (e) { } }
  return r.view;
}
function panelView(d, notices, ntfySent, now) {
  d = d || {}; now = now || Math.floor(Date.now() / 1000);
  const rows = Array.isArray(notices) ? notices : [];
  // ---- 残り（パネルの mergedTodo と同じ PC.todoList。端末の写した印は渡さない）----
  const left = PC.todoList({ rows: rows, ntfySent: ntfySent, readAt: PC.senkoEpoch(d.senkoReadAt) }).length;
  // ---- 頭の字（パネルの headText と同じ PC.headText）----
  const head = PC.headText({ stat: d.stat, cloud: (typeof d.cloud === 'string') ? d.cloud : '', detail: (typeof d.detail === 'string') ? d.detail.replace(/（なし）/g, '') : '', ura: d.ura || null, lost: false,
    owedAt: (typeof d.cardOwedAt === 'number') ? d.cardOwedAt : 0, owedEta: (typeof d.cardOwedEta === 'number') ? d.cardOwedEta : 0, rows: rows, kumo: ((typeof d.kumo === 'string') && d.kumo) ? d.kumo : ((typeof d.temoto === 'string') ? d.temoto : ''), left: left, now: now });
  return { shadowBox: shadowBox(now), shelf: shelfView(), yoshiOpen: yoshiOpenList(), yubisashi: yubisashiView(), head: head, label: PC.todoLabel(left), left: left, basis: 'センコの読み（senkoReadAt）だけで数えた。本人が端末で押した「写した」印は含まない', senkoReadAt: String(d.senkoReadAt || ''), coreVer: PC.VER, pub: { ver: String(d.pubVer || ''), at: Number(d.pubVerAt) || 0, line: PC.pubLine({ pubVer: d.pubVer, pubVerAt: d.pubVerAt, coreVer: PC.VER }) }, noEstimate: (String(d.stat || '') === '作業中' && !/[0-9]/.test(String(d.mikomi == null ? '' : d.mikomi))), jobEnd: jobEnd(d), omote: omoteView(d, now), ura: uraView(d, now), all: allView(d, now), at: now };
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
module.exports = { shelfCapacity, sweepLine, convK, weekJobStep, panelView, senkoEpoch: PC.senkoEpoch, omoteLines: PC.omoteLines, uraLines: PC.uraLines, endLine: PC.endLine, endShort: PC.endShort, uraCount: PC.uraCount, boxSpec: PC.boxSpec, uraBusyText: PC.uraBusyText, ntfyOfCard: PC.ntfyOfCard, core: PC };

if (require.main === module) {
  // 使い方：node panel-view.js <state.json の道> [<出し先の道>]  出し先が無ければ標準出力（PowerShell の文字化けを避けるため、見張りは道を渡す）
  const rd = (f) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^﻿/, '')); } catch (e) { return []; } };
  let d = {}; try { d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8').replace(/^﻿/, '')); } catch (e) { }
  // v202：見張りは ura（裏方）を panelView の後に足すので、state に ura が無ければ見張りの控え（~/.claude/ura-out.json＝一つ前の巡回の物）を読む
  if (!d.ura) { try { d.ura = JSON.parse(fs.readFileSync(path.join(require('os').homedir(), '.claude', 'ura-out.json'), 'utf8').replace(/^﻿/, '')); } catch (e) { } }
  // v203（枠 五十）：表と裏方の全部終わる見込みは、隣の endat.js で組む（~/.claude の台帳・段の台帳・下請けと雲の控えを読む）。こけたら eta 無しで今までどおり
  if (!d.eta) { try { d.eta = require(path.join(ROOT, 'endat.js')).compute(d); } catch (e) { } }
  const pvo = panelView(d, rd('notices.json'), rd('ntfy-sent.json')); try { pvo.weekJob = weekJobUpdate(d); } catch (e) { pvo.weekJob = null; }   /* v226：見張りの呼びの時だけ週の使用量を控えて載せる */
  const out = JSON.stringify(pvo);
  if (process.argv[3]) { fs.writeFileSync(process.argv[3], out, 'utf8'); } else { process.stdout.write(out); }
}
