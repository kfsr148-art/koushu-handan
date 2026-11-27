// orders-count-test.js — 台帳の数え手（orders-count.js）の作り値（2026-11-20）。panel-check.js から呼ぶ。終了コード 0＝全部合い。
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
process.env.OC_SINCE = '1970-01-01 00:00:00';   // 従来の項目は刻の縛りなしで（刻の縛りは下の枠N の項目で見る）
const oc = require('./orders-count.js');
let bad = 0, all = 0; const ck = (n, ok) => { all++; if (!ok) { bad++; console.log('NG ' + n); } };
const now = Math.floor(Date.now() / 1000), iso = n => new Date((now - n) * 1000).toLocaleString('sv-SE');
const HEAD = '受領時刻\t番号\t項目\t状態\n';
const row = (ago, id, st) => iso(ago) + '\t' + id + '\t項目\t' + st + '\n';
const raw = HEAD + row(900000, 'a', '済（手）') + row(900000, 'b', '取消') + row(900000, 'c', '時間切（自動）：受けて1日を超え、ヨシ待ちでも雲待ちでもない未了（前の字「未了：受領」）')
  + row(800000, 'd', '取下：やめた') + row(800000, 'e', '済（自動・終わりの札 10:00・枠 x）') + row(800000, 'f', '該当せず') + row(800000, 'g', '発効中') + row(800000, 'h', 'へ統合')
  + row(100000, 'old', '未了：受領') + row(3000, 'm1', '未了：受領') + row(2000, 'm2', '未了：受領') + row(1000, 'm3', '未了：受領');
// ①数え手：未了で始まる行だけ・時間切は閉じた行
ck('残り＝未了だけ（4件。時間切・済・取消・取下・該当せず・発効・へ統合は数えない）', oc.countOpen(raw) === 4);
ck('isOpen：時間切（自動）は閉じた行', !oc.isOpen('時間切（自動）：受けて1日を超え') && oc.isOpen('未了：受領') && oc.isOpen('未了：沖縄の直し'));
// ③順番待ち：言い切れる時だけ数・言い切れなければ null
const idle = { ev: 'Stop', evAt: now - 30 }, working = { ev: 'PostToolUse', evAt: now - 3 };
const note = (frames) => '開始: x\n件名: y\n' + (frames ? '枠: ' + frames + '\n' : '') + '待ち: なし\n';
ck('受けて1日を超えた未了（old）は順番待ちに入れない。窓が手待ちなら、1日以内の未了3件がすべて順番待ち', oc.waitCount(raw, note(''), idle, now) === 3);
ck('窓が作業中で控えに「枠:」が無ければ言い切れない（null）', oc.waitCount(raw, note(''), working, now) === null);
ck('作業中でも「枠:」に受け持つ枠が一つあればそれを除いて数える（2件）', oc.waitCount(raw, note(iso(3000)), working, now) === 2);
ck('二枠受け持つ時は二つ（「・」区切り）除く（1件）', oc.waitCount(raw, note(iso(3000) + '・' + iso(2000)), working, now) === 1);
ck('1日以内の未了が無ければ 0（言い切れる）', oc.waitCount(HEAD + row(900000, 'a', '済'), note(''), working, now) === 0);
// 命令行：置き場を差し替えて
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-oc-')); fs.writeFileSync(path.join(d, 'orders-open.tsv'), '﻿' + raw); fs.writeFileSync(path.join(d, 'work-note.txt'), note(iso(3000))); fs.writeFileSync(path.join(d, 'busy.txt'), JSON.stringify(working));
const run = a => cp.spawnSync(process.execPath, [path.join(__dirname, 'orders-count.js'), a], { env: Object.assign({}, process.env, { OC_ROOT: d }), encoding: 'utf8' }).stdout;
ck('--count＝4', run('--count') === '4');
ck('--list は ASCII の \\u 出しで4件', JSON.parse(run('--list')).length === 4 && !/[^\x20-\x7e]/.test(run('--list')));
ck('--wait＝2（作業中・枠:に1枠）', run('--wait') === '2');
fs.writeFileSync(path.join(d, 'work-note.txt'), note(''));
ck('--wait は作業中で枠:が無ければ空（出さない）', run('--wait') === '');
// 枠J：順番待ちの一覧（様子を写す）。数は一覧の行の数と必ず同じ（同じ数え手 waitRows から）
{
  const iso2 = n => new Date((now - n) * 1000).toLocaleString('sv-SE');
  const rr = (ago, id, item, st) => iso2(ago) + '\t' + id + '\t' + item + '\t' + st + '\n';
  const raw2 = HEAD + rr(5000, 'w1', '（枠）全文は orders-full.jsonl の x・頭：【Codeタブへ】 今の仕事が済んでから。順番待ちを見えるようにせよ。様子を写すに一行ずつ出せ、それから指さすの名を直せ、それからもう少し長く書いておく', '未了：受領') + rr(4000, 'w2', '（枠）全文は orders-full.jsonl の y・頭：【Codeタブへ】 二つ直せ', '未了：受領') + rr(3000, 'w3', '項目', '済（手）');
  const note2 = '枠: ' + iso2(4000) + '\n';
  const wr = oc.waitRows(raw2, note2, { ev: 'PreToolUse' }, now), wlst = oc.waitList(raw2, note2, { ev: 'PreToolUse' }, now), wc = oc.waitCount(raw2, note2, { ev: 'PreToolUse' }, now);
  ck('順番待ちの行＝受け持つ枠（w2）と済（w3）を除いた w1 だけ', wr.length === 1 && wr[0].id === 'w1');
  ck('数は一覧の行の数と同じ', wc === wr.length && wlst.length === wr.length);
  ck('一覧の一行は「届いた刻（MM-DD HH:MM）」と件名の頭（【Codeタブへ】と今の仕事が済んでから。を除き40字まで）', /^[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/.test(wlst[0].at) && wlst[0].head.indexOf('順番待ちを見えるようにせよ') === 0 && wlst[0].head.length <= 41);
  ck('言い切れない時（作業中で枠:が無い）は一覧も null', oc.waitList(raw2, '', { ev: 'PreToolUse' }, now) === null && oc.waitCount(raw2, '', { ev: 'PreToolUse' }, now) === null);
  ck('未了が無ければ空の一覧・数は0', oc.waitList(HEAD, '', {}, now).length === 0 && oc.waitCount(HEAD, '', {}, now) === 0);
}
// 枠N：印より前の未了は数えない・後は数える・新しい枠から並べる
{
  const R = (at, id, st) => at + '\t' + id + '\t（枠）全文は orders-full.jsonl の ' + at + '・頭：【Codeタブへ】 ' + id + '\t' + st + '\n';
  const day = new Date(now * 1000).toLocaleDateString('sv-SE');
  const rawN = HEAD + R(day + ' 09:00:00', 'before1', '未了：受領') + R(day + ' 13:38:51', 'before2', '未了：受領') + R(day + ' 14:19:48', 'edge', '未了：受領') + R(day + ' 15:00:31', 'mid', '未了：受領') + R(day + ' 17:40:18', 'new1', '未了：受領') + R(day + ' 18:06:41', 'new2', '済（自動）') + R(day + ' 18:30:43', 'mine', '未了：受領');
  const nowN = Math.floor(new Date(day + 'T20:00:00').getTime() / 1000);
  const noteN = '枠: ' + day + ' 18:30:43\n';
  process.env.OC_SINCE = day + ' 14:19:48';
  const rn = oc.waitRows(rawN, noteN, { ev: 'PreToolUse' }, nowN);
  ck('印（14:19:48）より前の未了は数えない（before1・before2 は出ない）', rn.every(r => r.id.indexOf('before') < 0));
  ck('印の刻ちょうど以後は数える（edge・mid・new1）・済は数えない（new2）・いま受け持つ枠（mine）は除く', rn.map(r => r.id).join(',') === 'new1,mid,edge');
  ck('新しい枠から並べる（new1 → mid → edge）', rn[0].id === 'new1' && rn[2].id === 'edge');
  ck('数＝行の数（3）・一覧の先頭は新しい枠', oc.waitCount(rawN, noteN, { ev: 'PreToolUse' }, nowN) === 3 && oc.waitList(rawN, noteN, { ev: 'PreToolUse' }, nowN)[0].head.indexOf('new1') === 0);
  ck('手待ち（受け持つ枠なし）でも印以前は数えない', oc.waitCount(rawN, '', { ev: 'Stop' }, nowN) === 4);
  delete process.env.OC_SINCE;
  ck('既定の刻は 2026-11-20 14:19:48（枠の印を出し始めた刻）', oc.WAIT_SINCE === '2026-11-20 14:19:48');
}
// 枠 四百一：下請け・雲で手を付けた枠は順番待ちから外し、手を付けた一覧に出る（14:24 の形を作り値で）
{
  const day = '2026-11-27', at = h => day + ' ' + h, nowH = Math.floor(Date.parse(day + 'T14:24:00') / 1000);
  const R = (h, item, st) => at(h) + '\t橋（文書の枠を読む）\t' + item + '\t' + st + '\n';
  const raw = HEAD + R('13:04:30', '（橋）（橋）枠 三百九十五：指さす（枠 四百の話も本文に出る）', '未了：受領') + R('13:05:28', '（橋）（橋）枠 三百九十六：篩', '未了：受領') + R('13:38:46', '（橋）枠 三百九十九：帯', '未了：引き継ぎ先 ' + at('13:37:55')) + R('14:10:00', '（橋）枠 四百：見出し', '未了：受領') + R('13:00:00', '（橋）枠 三百八十：重ね', '未了：一件目と同じ') + R('12:00:00', '（橋）枠 三百九十：済んだ', '済（手）');
  ck('行の番号は頭の「枠 N」だけ（本文の別の番号は読まない）', oc.frameNo('（橋）（橋）枠 三百九十五：指さす（枠 四百の話）') === 395 && oc.frameNo('（枠）全文は orders-full.jsonl の x・頭：橋（合図 13:04）') === 0 && oc.frameNo('（枠）全文は x・頭：【Codeタブへ】 枠 401：y') === 401);
  ck('手を付ける前：395・396・400 の3件が順番待ち（引き継ぎ先・一件目と同じ・済は数えない）', oc.waitCount(raw, '', { ev: 'Stop' }, nowH) === 3);
  const m = oc.markHanded(raw, ['395', '枠 三百九十六'], { by: '下請け', hm: '13:41', now: nowH });
  ck('印：番号（算用・漢数字）で2行だけ替わる・行の数は同じ', m.hit.length === 2 && m.miss.length === 0 && m.txt.split('\n').length === raw.split('\n').length);
  const wl = oc.waitList(m.txt, '', { ev: 'Stop' }, nowH), hl = oc.handedList(m.txt, nowH);
  ck('順番待ちは 400 の1件（数＝一覧の行）', oc.waitCount(m.txt, '', { ev: 'Stop' }, nowH) === 1 && wl.length === 1 && wl[0].head.indexOf('枠 四百：') >= 0);
  ck('手を付けた一覧は 396・395（下請け）', hl.map(x => x.no + x.by).join(',') === '396下請け,395下請け');
  ck('残り（未了）の数は変わらない（手を付けても台帳は閉じない）', oc.countOpen(m.txt) === oc.countOpen(raw));
  ck('戻す（--undo）と順番待ちは3件', oc.waitCount(oc.markHanded(m.txt, ['395', '396'], { undo: true, now: nowH }).txt, '', { ev: 'Stop' }, nowH) === 3);
  ck('刻でも引ける・雲の印', oc.handedList(oc.markHanded(raw, [at('14:10:00')], { by: '雲', hm: '14:20', now: nowH }).txt, nowH)[0].by === '雲');
  ck('当たらない番号・済の行は替えない（miss に出る）', oc.markHanded(raw, ['390', '999'], { now: nowH }).miss.join(',') === '390,999');
  const crlf = oc.markHanded('\uFEFF' + raw.replace(/\n/g, '\r\n'), ['395'], { now: nowH }).txt;
  ck('BOM と CRLF を保つ', crlf.charCodeAt(0) === 0xFEFF && crlf.split('\r\n').length === raw.split('\n').length && !/[^\r]\n/.test(crlf));
  const pf = x => oc.promptFrames(x).join(',');
  ck('頼みの文：「frame N (Japanese)」は最初の一つだけ', pf('Repos: x. Task, bridge frame 401 (Japanese): 「…」 Frame 381 (Japanese): 「…」') === '401');
  ck('頼みの文：「手を付ける枠:」の行が先（何本でも・漢数字も）', pf('Panel batch\n手を付ける枠: 398・399・枠 四百、403（まとめ）\nTask, bridge frame 397 (Japanese)') === '398,399,400,403');
  ck('頼みの文：ほかの形で出る番号は読まない', pf('edited today for frame 397; since v1545 (frame 390) persona words') === '' && pf('') === '');
}
fs.rmSync(d, { recursive: true, force: true });
console.log('台帳の数え手（orders-count.js）：' + (bad ? 'NG ' + bad + '件' : all + '件 合い'));
process.exit(bad ? 1 : 0);
