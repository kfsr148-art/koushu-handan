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
  return { head: head(), label: left > 0 ? ('まとめて写す（残' + left + '／' + left + '件）') : 'まとめて写す（0件）', left: left, basis: 'センコの読み（senkoReadAt）だけで数えた。本人が端末で押した「写した」印は含まない', senkoReadAt: String(d.senkoReadAt || ''), at: now };
}

module.exports = { panelView, senkoEpoch };

if (require.main === module) {
  // 使い方：node panel-view.js <state.json の道> [<出し先の道>]  出し先が無ければ標準出力（PowerShell の文字化けを避けるため、見張りは道を渡す）
  const rd = (f) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^﻿/, '')); } catch (e) { return []; } };
  let d = {}; try { d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8').replace(/^﻿/, '')); } catch (e) { }
  const out = JSON.stringify(panelView(d, rd('notices.json'), rd('ntfy-sent.json')));
  if (process.argv[3]) { fs.writeFileSync(process.argv[3], out, 'utf8'); } else { process.stdout.write(out); }
}
