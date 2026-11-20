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
function waitCount(raw, note, busy, now) {
  now = Number(now) || Math.floor(Date.now() / 1000);
  const fresh = openRows(raw).filter(r => { const t = epoch(r.at); return t > 0 && now - t <= 86400; });
  if (fresh.length === 0) { return 0; }
  const m = /^枠:[ 　]*(.+)$/m.exec(String(note || '').replace(/^\uFEFF/, ''));
  const mine = m ? m[1].split(/[・,、]/).map(s => s.trim()).filter(Boolean) : [];
  const b = busy || {}, open = ['UserPromptSubmit', 'PreToolUse', 'PostToolUse'].indexOf(String(b.ev || '')) >= 0;
  if (mine.length) { return fresh.filter(r => mine.indexOf(r.at) < 0).length; }
  if (!open) { return fresh.length; }
  return null;
}
module.exports = { isOpen, parse, openRows, countOpen, waitCount };
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
