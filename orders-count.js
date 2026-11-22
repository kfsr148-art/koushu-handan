// orders-count.js — 台帳（~/.claude/orders-open.tsv）の「残り」を数える所は、ここ一つ（2026-11-20 本人の裁定「数え手を一つに」）。
//   ＊前は読む物ごとに数え方が違った（パネル下の数＝済・取消・取下・へ統合・発効・該当せず 以外すべて＝時間切（自動）も数えて243件／inbox-watch・daily-reboot・frame-work＝「未了」で始まる行だけ＝114件）。
//   ＊決め：**残り＝状態が「未了」で始まる行だけ**。時間切（自動）・済・取消・取下・へ統合・発効・該当せず は閉じた行（数えない）。
//   ＊順番待ち＝届いてまだ着手していない枠の数（パネルの下に出す）。言い切れる時だけ数を返し、言い切れない時は null（パネルは行ごと出さない）。
//        受けて1日以内の「未了」の行のうち、いま窓が受け持っている枠（控え work-note.txt の「枠:」の刻）を除いた数。
//        ・受けて1日以内の未了が0件なら 0（言い切れる）。
//        ・窓が手待ち（手番が開いていない）なら、受け持つ枠は無いので、1日以内の未了すべてが順番待ち（言い切れる）。
//        ・窓が作業中で、控えに「枠:」が無ければ、どれを受け持っているか分からないので null（言い切れない）。
//   使い方
//     node orders-count.js --count   … 残り（未了で始まる行）の数を標準出力へ。読めなければ -1。
//     node orders-count.js --list    … 残りの行を JSON（[{id,at,state}]）で。ASCII の \u 出し。
//     node orders-count.js --wait    … 順番待ちの数（言い切れなければ空）。
//   require('./orders-count.js') → { isOpen, openRows, countOpen, waitCount }
//   環境変数 OC_ROOT（~/.claude の置き場）・OC_NOW（今の epoch・作り値）で差し替えられる。
'use strict';
const fs = require('fs');
const ROOT = process.env.OC_ROOT || 'C:/Users/user/.claude';
function isOpen(state) { return /^未了/.test(String(state || '')); }
function parse(raw) {
  const out = [], lines = String(raw || '').replace(/^\uFEFF/, '').split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) { const c = lines[i].split('\t'); if (c.length >= 4) { out.push({ at: c[0], id: c[1], item: c[2], state: c[3] }); } }
  return out;
}
function openRows(raw) { return parse(raw).filter(r => isOpen(r.state)); }
function countOpen(raw) { return openRows(raw).length; }
function epoch(s) { const t = Date.parse(String(s).replace(' ', 'T')); return isNaN(t) ? 0 : Math.floor(t / 1000); }
// 順番待ち。note＝work-note.txt の中身、busy＝busy.txt の中身（JSON）。
// 2026-11-20 枠N：順番待ちに数えるのは「枠の印を出し始めた刻（14:19:48 の枠）より後に受けた未了」だけ。印が入る前に受けて結べなかった未了（この一日ぶん）は、待っている枠ではないので数えない（台帳の行には触らない）。
//   ＊並びは新しい枠から（上から読めば、本当に待っている新しい枠が先に見える）。環境変数 OC_SINCE（作り値用）で刻を差し替えられる。
const WAIT_SINCE = '2026-11-20 14:19:48';
function waitRows(raw, note, busy, now) {
  now = Number(now) || Math.floor(Date.now() / 1000);
  const since = String(process.env.OC_SINCE || WAIT_SINCE);
  const fresh = openRows(raw).filter(r => { const t = epoch(r.at); return t > 0 && now - t <= 86400 && String(r.at) >= since && !/引き継ぎ先/.test(String(r.state || '')); })   /* 枠 百三十五：後の枠が引き継いだ行（状態が「未了：引き継ぎ先 <刻>」）は順番待ちに数えない（その枠の札で一緒に済になる） */.sort((a, b) => (String(a.at) < String(b.at) ? 1 : (String(a.at) > String(b.at) ? -1 : 0)));
  if (fresh.length === 0) { return []; }
  const m = /^枠:[ 　]*(.+)$/m.exec(String(note || '').replace(/^\uFEFF/, ''));
  const mine = m ? m[1].split(/[・,、]/).map(s => s.trim()).filter(Boolean) : [];
  const b = busy || {}, open = ['UserPromptSubmit', 'PreToolUse', 'PostToolUse'].indexOf(String(b.ev || '')) >= 0;
  if (mine.length) { return fresh.filter(r => mine.indexOf(r.at) < 0); }
  if (!open) { return fresh; }
  return null;
}
// 2026-11-20 枠J：数は行の数。様子を写すの「順番待ち：〈届いた刻〉〈件名〉」の一覧と同じ数え手（waitRows）から出す。
function waitCount(raw, note, busy, now) { const r = waitRows(raw, note, busy, now); return r === null ? null : r.length; }
// 一覧の一行＝{at:届いた刻（MM-DD HH:MM）, head:件名（項目の頭の一行・「頭：」があればその後ろ・40字まで）}
function waitList(raw, note, busy, now) {
  const r = waitRows(raw, note, busy, now); if (r === null) { return null; }
  return r.map(x => { let h = String(x.item || ''); const k = h.indexOf('頭：'); if (k >= 0) { h = h.slice(k + 2); } h = h.replace(/^【[^】]*】[ 　]*/, '').replace(/^(今の仕事が済んでから|前の枠と重なれば合わせよ)[。.]?[ 　]*/, '').replace(/[ \t]+/g, ' ').trim(); if (h.length > 40) { h = h.slice(0, 40) + '…'; } return { at: String(x.at).slice(5, 16), head: h }; });
}
module.exports = { isOpen, parse, openRows, countOpen, waitRows, waitCount, waitList, WAIT_SINCE };
if (require.main === module) {
  const arg = process.argv[2] || '--count';
  let raw = null; try { raw = fs.readFileSync(ROOT + '/orders-open.tsv', 'utf8'); } catch (e) { }
  if (raw === null) { process.stdout.write(arg === '--count' ? '-1' : (arg === '--list' ? '[]' : '')); process.exit(0); }
  if (arg === '--count') { process.stdout.write(String(countOpen(raw))); }
  else if (arg === '--list') { process.stdout.write(JSON.stringify(openRows(raw).map(r => ({ id: r.id, at: r.at, state: r.state }))).replace(/[^\x20-\x7e]/g, c => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4))); }
  else if (arg === '--wait') {
    let note = '', busy = {}; try { note = fs.readFileSync(ROOT + '/work-note.txt', 'utf8'); } catch (e) { } try { busy = JSON.parse(fs.readFileSync(ROOT + '/busy.txt', 'utf8').replace(/^\uFEFF/, '')); } catch (e) { }
    const w = waitCount(raw, note, busy, process.env.OC_NOW); process.stdout.write(w === null ? '' : String(w));
  }
}
