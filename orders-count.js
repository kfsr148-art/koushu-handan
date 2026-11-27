// orders-count.js — 台帳（~/.claude/orders-open.tsv）の「残り」を数える所は、ここ一つ（2026-11-20 本人の裁定「数え手を一つに」）。
//   ＊前は読む物ごとに数え方が違った（パネル下の数＝済・取消・取下・へ統合・発効・該当せず 以外すべて＝時間切（自動）も数えて243件／inbox-watch・daily-reboot・frame-work＝「未了」で始まる行だけ＝114件）。
//   ＊決め：**残り＝状態が「未了」で始まる行だけ**。時間切（自動）・済・取消・取下・へ統合・発効・該当せず は閉じた行（数えない）。
//   ＊順番待ち＝届いてまだ着手していない枠の数（パネルの下に出す）。言い切れる時だけ数を返し、言い切れない時は null（パネルは行ごと出さない）。
//        受けて1日以内の「未了」の行のうち、いま窓が受け持っている枠（控え work-note.txt の「枠:」の刻）を除いた数。
//        ・受けて1日以内の未了が0件なら 0（言い切れる）。
//        ・窓が手待ち（手番が開いていない）なら、受け持つ枠は無いので、1日以内の未了すべてが順番待ち（言い切れる）。
//        ・窓が作業中で、控えに「枠:」が無ければ、どれを受け持っているか分からないので null（言い切れない）。
//   ＊枠の様子の元はここ一つ（2026-11-27 橋の枠 四百一）：下請けや雲で手を付けた枠は、台帳の状態を「未了：手を付けた（下請け HH:MM）」「未了：手を付けた（雲 HH:MM）」にする（markHanded）。
//        この行は「残り」（未了）には数えるが、順番待ち（waitRows・数・一覧・一番古い待ち）には数えない。手を付けた枠の一覧は handedList。
//        書き手は二つ：node ~/.claude/job-sync.js hand-off <枠の番号|刻> --to 下請け|雲（戻すのは --undo）と、下請けの始まりの鉤（~/.claude/ura-sub.js・頼みの文の枠を promptFrames で読む）。
//        順番待ちを数える所（foot-stats.js・oldest-wait.js・stop-continue.js・job-sync count・vaio-look.js）は、この台本の判じを使う。別の所で状態の字を読んで数え直さない。
//   使い方
//     node orders-count.js --count   … 残り（未了で始まる行）の数を標準出力へ。読めなければ -1。
//     node orders-count.js --list    … 残りの行を JSON（[{id,at,state}]）で。ASCII の \u 出し。
//     node orders-count.js --wait    … 順番待ちの数（言い切れなければ空）。
//   require('./orders-count.js') → { isOpen, openRows, countOpen, waitRows, waitCount, waitList, handedBy, handedList, frameNo, promptFrames, markHanded, markHandedFile }
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
// ---- 手を付けた（下請け・雲）の印（枠 四百一） ----
const HANDED_RE = /^未了：手を付けた（(下請け|雲)(?:[ ]([0-9]{2}:[0-9]{2}))?）/;
function handedBy(state) { const m = HANDED_RE.exec(String(state || '')); return m ? m[1] : ''; }
// 順番待ちに数えない未了の行（後の枠が引き継いだ行・一件目と同じ行・手を付けた行）
function notWaiting(state) { return /引き継ぎ先|^未了：一件目と同じ/.test(String(state || '')) || !!handedBy(state); }
// 漢数字（千の位まで）か算用数字 → 数。読めなければ 0
function toNum(s) {
  s = String(s || ''); if (/^[0-9]+$/.test(s)) { return Number(s); }
  if (!/^[〇零一二三四五六七八九十百千]+$/.test(s)) { return 0; }
  const D = { '〇': 0, '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 }, U = { '十': 10, '百': 100, '千': 1000 };
  if (!/[十百千]/.test(s)) { return Number(s.split('').map(c => D[c]).join('')); }
  let sum = 0, d = 0; s.split('').forEach(c => { if (U[c]) { sum += (d || 1) * U[c]; d = 0; } else { d = D[c]; } }); return sum + d;
}
// 台帳の行の項目 → その行自身の枠の番号（頭の「（橋）枠 N」だけ。本文に出る別の枠の番号は読まない）。無ければ 0
function frameNo(item) {
  const s = String(item || ''), k = s.indexOf('頭：'), t = k >= 0 ? s.slice(k + 2) : s;
  const m = /^(?:【[^】]*】)?[ 　]*(?:（橋）)*(?:橋の)?枠[ 　]*([0-9〇零一二三四五六七八九十百千]+)/.exec(t);
  return m ? toNum(m[1]) : 0;
}
// 下請けへの頼みの文 → 手を付ける枠の番号。読むのは決まった二つの形だけ（ほかの所に出る枠の番号は読まない）：
//   ①「手を付ける枠: 398・399」の行（行の頭。何本でも並べられる）  ②①が無い時だけ、最初の「frame N (Japanese)」一つ
function promptFrames(prompt) {
  const s = String(prompt || '');
  const m = /^[ \t　>*-]*手を付ける枠[ 　]*[:：][ 　]*(.+)$/m.exec(s);
  if (m) {
    const o = [], x = /^(?:(?:橋の)?(?:枠[ 　]*)?[0-9〇零一二三四五六七八九十百千]+(?:[ 　]*[・、,，/／と][ 　]*)?)+/.exec(m[1]);
    if (x) { (x[0].match(/[0-9〇零一二三四五六七八九十百千]+/g) || []).forEach(p => { const n = toNum(p); if (n && o.indexOf(n) < 0) { o.push(n); } }); }
    return o;
  }
  const f = /\bframe[ ]+#?([0-9]{1,4})[ ]*[(（]Japanese[)）]/i.exec(s);
  return f ? [Number(f[1])] : [];
}
// keys＝枠の刻（'YYYY-MM-DD HH:mm:ss'）か番号（401・「枠 四百一」）。当たった未了の行の状態の字だけを替える（行は足さない・消さない・BOM と改行は元のまま）。
//   opt＝{ by:'下請け'|'雲', hm:'HH:MM', undo:true（手を付けた行を「未了：受領」へ戻す）, now（番号で引くのは受けてから2日以内の行だけ） }
function markHanded(raw, keys, opt) {
  opt = opt || {}; const by = opt.by === '雲' ? '雲' : '下請け', now = Number(opt.now) || Math.floor(Date.now() / 1000);
  const want = (keys || []).map(k => { const s = String(k).trim(); if (/^20[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(s)) { return { s: s, at: s, no: 0 }; } return { s: s, at: '', no: toNum(s.replace(/^(橋の)?枠[ 　]*/, '')) }; });
  const hit = [], found = new Set();
  const out = String(raw || '').split('\n').map(l => {
    const cr = l.endsWith('\r'), c = (cr ? l.slice(0, -1) : l).split('\t');
    if (c.length < 4 || !isOpen(c[3]) || /引き継ぎ先|^未了：一件目と同じ/.test(c[3])) { return l; }
    const no = frameNo(c[2]), recent = now - epoch(c[0]) <= 2 * 86400;
    const w = want.filter(x => (x.at && x.at === c[0]) || (x.no && x.no === no && recent));
    if (!w.length) { return l; }
    w.forEach(x => found.add(x.s));
    if (opt.undo ? !handedBy(c[3]) : handedBy(c[3]) === by) { return l; }
    c[3] = opt.undo ? '未了：受領' : '未了：手を付けた（' + by + (opt.hm ? ' ' + opt.hm : '') + '）';
    hit.push({ at: c[0], no: no });
    return c.join('\t') + (cr ? '\r' : '');
  }).join('\n');
  return { txt: out, hit: hit, miss: want.filter(x => !found.has(x.s)).map(x => x.s) };
}
// 台帳のファイルへ当てる（書く直前に読み直し、替わっていたらやり直す・三回まで）
function markHandedFile(file, keys, opt) {
  for (let i = 0; i < 3; i++) {
    const raw = fs.readFileSync(file, 'utf8'), r = markHanded(raw, keys, opt);
    if (!r.hit.length || (opt && opt.dry)) { return r; }
    const tmp = file + '.' + process.pid + '.handoff.tmp'; fs.writeFileSync(tmp, r.txt);
    if (fs.readFileSync(file, 'utf8') !== raw) { fs.unlinkSync(tmp); continue; }
    fs.renameSync(tmp, file); return r;
  }
  throw new Error('台帳が書く間に替わり続けた');
}
// 順番待ち。note＝work-note.txt の中身、busy＝busy.txt の中身（JSON）。
// 2026-11-20 枠N：順番待ちに数えるのは「枠の印を出し始めた刻（14:19:48 の枠）より後に受けた未了」だけ。印が入る前に受けて結べなかった未了（この一日ぶん）は、待っている枠ではないので数えない（台帳の行には触らない）。
//   ＊並びは新しい枠から（上から読めば、本当に待っている新しい枠が先に見える）。環境変数 OC_SINCE（作り値用）で刻を差し替えられる。
const WAIT_SINCE = '2026-11-20 14:19:48';
function waitRows(raw, note, busy, now) {
  now = Number(now) || Math.floor(Date.now() / 1000);
  const since = String(process.env.OC_SINCE || WAIT_SINCE);
  const fresh = openRows(raw).filter(r => { const t = epoch(r.at); return t > 0 && now - t <= 86400 && String(r.at) >= since && !notWaiting(r.state); })   /* 枠 四百一：手を付けた行・一件目と同じ行も外す。枠 百三十五：後の枠が引き継いだ行（状態が「未了：引き継ぎ先 <刻>」）は順番待ちに数えない（その枠の札で一緒に済になる） */.sort((a, b) => (String(a.at) < String(b.at) ? 1 : (String(a.at) > String(b.at) ? -1 : 0)));
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
  return r.map(entry);
}
// 一覧の一行の組み立て（順番待ちと「手を付けた」で同じ）
function entry(x) { let h = String(x.item || ''); const k = h.indexOf('頭：'); if (k >= 0) { h = h.slice(k + 2); } h = h.replace(/^【[^】]*】[ 　]*/, '').replace(/^(今の仕事が済んでから|前の枠と重なれば合わせよ)[。.]?[ 　]*/, '').replace(/[ \t]+/g, ' ').trim(); if (h.length > 40) { h = h.slice(0, 40) + '…'; } return { at: String(x.at).slice(5, 16), head: h }; }
// 手を付けた枠の一覧（順番待ちと同じ幅：受けて1日以内・新しい順）。一行＝{at, head, by:'下請け'|'雲', no:枠の番号（読めなければ 0）}
function handedList(raw, now) {
  now = Number(now) || Math.floor(Date.now() / 1000);
  const since = String(process.env.OC_SINCE || WAIT_SINCE);
  return openRows(raw).filter(r => { const t = epoch(r.at); return handedBy(r.state) && t > 0 && now - t <= 86400 && String(r.at) >= since; })
    .sort((a, b) => (String(a.at) < String(b.at) ? 1 : (String(a.at) > String(b.at) ? -1 : 0)))
    .map(x => Object.assign(entry(x), { by: handedBy(x.state), no: frameNo(x.item) }));
}
module.exports = { isOpen, parse, openRows, countOpen, waitRows, waitCount, waitList, epoch, handedBy, handedList, frameNo, toNum, promptFrames, markHanded, markHandedFile, WAIT_SINCE };
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
