// orders-count-test.js — 台帳の数え手（orders-count.js）の作り値（2026-11-20）。panel-check.js から呼ぶ。終了コード 0＝全部合い。
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const oc = require('./orders-count.js');
let bad = 0; const ck = (n, ok) => { if (!ok) { bad++; console.log('NG ' + n); } };
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
fs.rmSync(d, { recursive: true, force: true });
console.log('台帳の数え手（orders-count.js）：' + (bad ? 'NG ' + bad + '件' : '15件 合い'));
process.exit(bad ? 1 : 0);
