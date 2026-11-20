// state-decide-test.js — 状態の決め所（state-decide.js）を作り値で総当たりする（2026-11-19・本人の枠⑥）。panel-check.js から呼ぶ。手元でも数秒。
//   材料の組を全部作り、上から当てる順（ヨシ待ち→止まり→作業中→検査中→待ち→待機中）と中身の決まりを一件ずつ確かめる。終了コード 0＝全部合い。
'use strict';
const { decide } = require('./state-decide.js');
const now = 1795050000;
const EV = { 'Post3分以内': { ev: 'PostToolUse', evAt: now - 10 }, 'Pre3分以内': { ev: 'PreToolUse', evAt: now - 100 }, 'UPS3分以内': { ev: 'UserPromptSubmit', evAt: now - 60 }, 'Post3分超': { ev: 'PostToolUse', evAt: now - 400 }, 'Stop': { ev: 'Stop', evAt: now - 30 }, '止まり使用量': { ev: 'StopFailure', evAt: now - 30, stat: '止まり（使用量・13:00 にリセット）' }, 'idle': { ev: 'idle_prompt', evAt: now - 10 } };
const AG = { '手伝いなし': {}, '手伝い1': { a1: { at: now - 100 } }, '手伝い不明1': { a2: { at: now - 4000 } } };
const BG = { 'bgなし': null, 'bg手伝い1雲1仲間1': { at: now - 25, items: [{ type: 'local_agent', status: 'running' }, { type: 'remote_agent', status: 'completed' }, { type: 'in_process_teammate', status: 'running' }] } };
const KW = { '雲なし': {}, '雲・見込みあり': { state: 'waiting', subj: 'v1508 検査と配信', eta: String(now + 600), workflow: 'check.yml' }, '雲・見込みなし': { state: 'waiting', subj: 'v1508 声', workflow: 'voice-m4a.yml' }, '時計の待ち': { state: 'waiting', subj: '使用量のリセット', workflow: 'clock:' + (now + 1800) } };
const ST = { '段なし': [], '段残り': [{ k: 'x', t: '一' }, { k: ' ', t: '二' }], '決め待ち': [{ k: 'x', t: '一' }, { k: '決', t: 'この形でよいか' }], '全部済み': [{ k: 'x', t: '一' }] };
let n = 0, bad = 0; const seen = {};
const ng = (c, r, why) => { bad++; if (bad <= 30) { console.log('NG ' + why + '：' + c + ' → ' + JSON.stringify(r)); } };
for (const e in EV) for (const a in AG) for (const g in BG) for (const k in KW) for (const s in ST) for (const alive of [0, 1]) {
  const busy = Object.assign({ subj: '題' }, EV[e], { agents: AG[a] }); if (BG[g]) { busy.bg = BG[g]; }
  const r = decide({ now, alive, busy, kumo: KW[k], steps: ST[s] }); n++;
  const c = [e, a, g, k, s, 'alive' + alive].join('・'); seen[r.stat] = (seen[r.stat] || 0) + 1;
  const bgFresh = !!BG[g] && ['Stop', 'idle_prompt', 'StopFailure', 'Interrupted', 'EndTurn'].indexOf(EV[e].ev) >= 0;   // 2026-11-20：数えるのは窓が手待ちの間の Stop の入力の一覧だけ。足し引きの agents（AG）は数えない
  const back = bgFresh && alive;
  const expect = s === '決め待ち' ? 'ヨシ待ち' : e === '止まり使用量' ? '止まり' : (alive && (e === 'UPS3分以内' || e === 'Post3分以内' || e === 'Pre3分以内' || back)) ? '作業中' : ((k === '雲・見込みあり' || k === '雲・見込みなし')) ? '検査中' : (k === '時計の待ち' || !alive || e === 'UPS3分以内' || e === 'Post3分超' || s === '段残り') ? '待ち' : '待機中';
  const rs = /^止まり/.test(r.stat) ? '止まり' : r.stat;
  if (rs !== expect) { ng(c, r, '順が違う（当て＝' + expect + '）'); continue; }
  if (rs === '止まり' && e === '止まり使用量' && r.stat !== '止まり（使用量・13:00 にリセット）') { ng(c, r, '止まりの字（リセットの刻）'); }
  if (r.stat === '作業中' && bgFresh && r.detail !== '裏で手伝い1本・雲1本') { ng(c, r, '作業中の数（teammate を外し、手伝い1・雲1）'); }
  if (r.stat === '作業中' && /teammate|仲間/.test(r.detail)) { ng(c, r, 'teammate を数えた'); }
  if (r.stat === '検査中' && k === '雲・見込みあり' && !/終了予定 [0-9]{2}:[0-9]{2}$/.test(r.detail)) { ng(c, r, '検査中の終了予定'); }
  if (r.stat === '検査中' && k === '雲・見込みなし' && !/見込み不明$/.test(r.detail)) { ng(c, r, '検査中の見込み不明'); }
  if (r.stat === '検査中' && /過ぎ/.test(r.detail)) { ng(c, r, '過ぎた帯'); }
  if (r.stat === '待ち' && k === '時計の待ち' && !/再開 [0-9]{2}:[0-9]{2}$/.test(r.detail)) { ng(c, r, '待ちの再開の刻'); }
  if (r.stat === '待ち' && !r.detail) { ng(c, r, '待ちの訳が空'); }
  if (r.stat === '待機中' && (s === '段残り' || k !== '雲なし' || bgFresh)) { ng(c, r, '待機中なのに残りがある'); }
  if (/（なし）/.test(r.detail)) { ng(c, r, '「（なし）」'); }
}
console.log('状態の決め所の総当たり：' + n + '組・NG ' + bad + '件・内訳 ' + JSON.stringify(seen));
// （終わりは下の進行中の起点の確かめの後）
// 2026-11-20 本人の枠：手伝いの数は Stop の入力の background_tasks だけ（help-count.js）。足し引きの agents は数えず、窓が手待ちで一覧が空なら 0。
{
  const { helpCount } = require('./help-count.js');
  let hb = 0; const hn = (n, ok) => { if (!ok) { hb++; bad++; console.log('NG 手伝いの数：' + n); } };
  const D = (busy, steps) => decide({ now, alive: 1, busy: Object.assign({ subj: '題' }, busy), kumo: {}, steps: steps || [] });
  const it = (t) => ({ type: t, status: 'running' });
  let r = D({ ev: 'Stop', evAt: now - 30, bg: { at: now - 25, items: [] } });
  hn('一覧が空（Stop・手待ち）→ 0 で待機中', r.stat === '待機中' && r.help === '');
  r = D({ ev: 'Stop', evAt: now - 30 });
  hn('一覧が無い（Stop の入力に background_tasks が無い）→ 0 で待機中', r.stat === '待機中' && r.help === '');
  r = D({ ev: 'Stop', evAt: now - 30, agents: { a1: { at: now - 100 }, a2: { at: now - 4000 } } });
  hn('足し引きの agents が残っていても数えない（SubagentStop が鳴らなかった跡）→ 待機中', r.stat === '待機中' && r.help === '');
  r = D({ ev: 'Stop', evAt: now - 30, bg: { at: now - 25, items: [it('local_agent')] } });
  hn('Stop の一覧に手伝い1本 → 作業中・裏で手伝い1本', r.stat === '作業中' && r.detail === '裏で手伝い1本');
  r = D({ ev: 'idle_prompt', evAt: now - 5, bg: { at: now - 65, items: [it('local_agent')] } });
  hn('Stop の約60秒後に idle_prompt が鳴っても数え続ける（evAt が一覧より新しくても）', r.stat === '作業中' && r.detail === '裏で手伝い1本');
  r = D({ ev: 'idle_prompt', evAt: now - 5, startedAt: now - 20, bg: { at: now - 65, items: [it('local_agent')] } });
  hn('その後に手番が開いた（startedAt が一覧より新しい）なら、前の一覧は使わない', r.help === '');
  r = D({ ev: 'PreToolUse', evAt: now - 5, bg: { at: now - 65, items: [it('local_agent')] } });
  hn('手番の中（PreToolUse）は一覧を数えない（作業中は合図の足跡で決まる）', r.stat === '作業中' && r.help === '' && r.detail === '');
  r = D({ ev: 'Stop', evAt: now - 2400, bg: { at: now - 2390, items: [it('local_agent')] } });
  hn('一覧が30分前で次の Stop が無い → 数えず「手伝い 不明 1本」で待ち', r.stat === '待ち' && /手伝い 不明 1本/.test(r.help));
  r = D({ ev: 'Stop', evAt: now - 30, bg: { at: now - 25, items: [it('in_process_teammate'), it('local_agent'), it('remote_agent'), it('local_bash')] } });
  hn('teammate は外し、手伝い1・雲1・裏の命令1', r.detail === '裏で手伝い1本・雲1本・裏の命令1本');
  const hc = helpCount({ ev: 'Stop', evAt: now, bg: { at: now, items: [] } }, now);
  hn('help-count：空の一覧は run 0', hc.run === 0 && hc.unk === 0 && hc.text === '');
  console.log('手伝いの数（background_tasks だけ）：' + (hb ? 'NG ' + hb + '件' : '12件 合い'));
}
// 2026-11-20 本人の枠：控えにあるがまだ公開に見えていない札の印 cardOwedAt。gather の読み方は一時の置き場（SD_ROOT）で確かめる。
{
  const fs = require('fs'), os = require('os'), path = require('path');
  const mk = (files) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-sd-')); Object.keys(files).forEach(k => fs.writeFileSync(path.join(d, k), files[k])); return d; };
  const run = (files) => { const d = mk(files); const r = require('child_process').spawnSync(process.execPath, [path.join(__dirname, 'state-decide.js'), '--alive', '1'], { env: Object.assign({}, process.env, { SD_ROOT: d }), encoding: 'utf8' }); fs.rmSync(d, { recursive: true, force: true }); try { return JSON.parse(r.stdout); } catch (e) { return {}; } };
  const t = Math.floor(Date.now() / 1000), ago = n => t - n, iso = n => new Date((t - n) * 1000).toLocaleString('sv-SE');
  const ck = (nm, ok) => { if (!ok) { bad++; console.log('NG 札の印：' + nm); } };
  const noteDone = '開始: x\n件名: 試し\n種類: 終わり\n待ち: なし\n完了: 済んだ\n';
  const stopBusy = JSON.stringify({ ev: 'Stop', evAt: ago(40), stopAt: ago(40), startedAt: ago(300), subj: '題' });
  let r = run({ 'busy.txt': stopBusy, 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone });
  ck('済んだ仕事の止まり（台帳が空き・控えが札になる形・まだ札が無い）→ Stop の刻で立つ', r.cardOwedAt === ago(40));
  r = run({ 'busy.txt': JSON.stringify({ ev: 'idle_prompt', evAt: ago(5), stopAt: ago(65), startedAt: ago(300), subj: '題' }), 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone });
  ck('Stop の約60秒後に idle_prompt が鳴っても、印は Stop の刻のまま', r.cardOwedAt === ago(65));
  r = run({ 'busy.txt': stopBusy, 'job-steps.txt': '仕事: 試し\n[ ] 残り\n', 'work-note.txt': noteDone });
  ck('段の台帳に残りがある途中の止まりでは立てない', r.cardOwedAt === 0);
  r = run({ 'busy.txt': stopBusy, 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone.replace('種類: 終わり', '種類: 外待ち') });
  ck('種類が外待ちでも、待ち:なし・完了:ありなら立てる（札は出る。20:24:18 の「待機中」になった回の再現）', r.cardOwedAt === ago(40));
  r = run({ 'busy.txt': stopBusy, 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone.replace('種類: 終わり', '種類: 外待ち').replace('待ち: なし', '待ち: 雲の検査（check.yml）') });
  ck('種類が外待ちで、待ちに中身があれば（本当に外を待っている）立てない', r.cardOwedAt === 0);
  // 2026-11-20 枠 十：控えが最後の札より古い（札を出した控えのまま・新しい仕事をしていない止まり）なら立てない
  { const d0 = mk({ 'busy.txt': JSON.stringify({ ev: 'Stop', evAt: ago(40), stopAt: ago(40), startedAt: ago(300), subj: '題' }), 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone, 'notify-sent.tsv': iso(100) + '\t✅ 終わりました\tx\n' }); const old = (t - 400); fs.utimesSync(path.join(d0, 'work-note.txt'), old, old); const rr = (() => { const x = require('child_process').spawnSync(process.execPath, [path.join(__dirname, 'state-decide.js'), '--alive', '1'], { env: Object.assign({}, process.env, { SD_ROOT: d0 }), encoding: 'utf8' }); try { return JSON.parse(x.stdout); } catch (e) { return {}; } })(); fs.rmSync(d0, { recursive: true, force: true }); ck('札を出した控えのまま新しい仕事をしない止まり（控えの更新が最後の札より古い）は立てない（22:29:02 の再現）', rr.cardOwedAt === 0); }
  r = run({ 'busy.txt': stopBusy, 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone, 'notify-sent.tsv': iso(10) + '\t✅ 終わりました\tx\n' });
  ck('Stop より後に札が控えに入っていれば立てない', r.cardOwedAt === 0);
  r = run({ 'busy.txt': JSON.stringify({ ev: 'Stop', evAt: ago(900), stopAt: ago(900), startedAt: ago(1200) }), 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone });
  ck('10分たっても札が出なければ印は消える', r.cardOwedAt === 0);
  r = run({ 'busy.txt': JSON.stringify({ ev: 'PreToolUse', evAt: ago(3), stopAt: ago(40), startedAt: ago(10) }), 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone });
  ck('手番が開いている間（作業中）は立てない', r.cardOwedAt === 0);
  const cid = 'cT-1', add = JSON.stringify({ t: 'add', id: cid, at: ago(20), title: 'x', body: 'y', state: 'done' }) + '\n';
  r = run({ 'busy.txt': stopBusy, 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone.replace('完了: 済んだ', '待ち: 何か'), 'card-outbox.jsonl': add });
  ck('先書きの控えに済みでない札があれば（控えが札の形でなくても）立つ。Stop の刻', r.cardOwedAt === ago(40));
  r = run({ 'busy.txt': stopBusy, 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone, 'card-outbox.jsonl': add + JSON.stringify({ t: 'done', id: cid, at: ago(10) }) + '\n', 'notify-sent.tsv': iso(10) + '\t✅ 終わりました\tx\n' });
  ck('先書きの札が済みになり控えに札が入っていれば立てない', r.cardOwedAt === 0);
  // 雲の検査を待つ間：札は控えに置いたまま出さない（watch-notify）ので印は長く残り、見込みの刻は検査の見込み（eta）
  const kw = (st, eta) => 'state=' + st + '\nmark=yT\nworkflow=check.yml\nsince=' + ago(900) + '\nat=' + ago(900) + '\neta=' + (t + eta) + '\n';
  const oldAdd = JSON.stringify({ t: 'add', id: 'cT-2', at: ago(1500), title: 'x', body: 'y', state: 'done' }) + '\n';
  r = run({ 'busy.txt': JSON.stringify({ ev: 'Stop', evAt: ago(1600), stopAt: ago(1600), startedAt: ago(2000) }), 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone, 'card-outbox.jsonl': oldAdd, 'kumo-wait.txt': kw('waiting', 300) });
  ck('雲待ちの間は、25分前から置いてある札の印も消えない（普段は15分で消える）', r.cardOwedAt === ago(1600));
  ck('雲待ちの間の見込みの刻は、検査の見込み（eta）', r.cardOwedEta === t + 300);
  r = run({ 'busy.txt': JSON.stringify({ ev: 'Stop', evAt: ago(1600), stopAt: ago(1600), startedAt: ago(2000) }), 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone, 'card-outbox.jsonl': oldAdd });
  ck('雲待ちが無ければ25分前の印は消える（15分）', r.cardOwedAt === 0 && r.cardOwedEta === 0);
  r = run({ 'busy.txt': stopBusy, 'job-steps.txt': '仕事: 試し\n[x] 一\n', 'work-note.txt': noteDone });
  ck('雲待ちが無い通常の印の見込みの刻は、Stop から150秒', r.cardOwedAt === ago(40) && r.cardOwedEta === ago(40) + 150);
  console.log('札の印（cardOwedAt・cardOwedEta）：' + (bad ? 'NG あり' : '14件 合い'));
}
// 2026-11-19 16:20 本人の枠：「▶ 進行中（N分）」の起点は今待っている走りの始まり。二本続けて走らせると二本目は0分から
{
  const st = [{ k: 'x', t: '一' }, { k: '雲', t: '確かめてから公開している' }];
  const old = { t: '前の仕事|確かめてから公開している', at: now - 9900 };
  // 2026-11-20 枠 十一：段が全部済んだ後の件名（手番が裏の知らせで始まり、busy.subj が直前の人の指示の一行目＝枠 九のまま）
  { let sbad = 0; const ck = (nm, ok) => { if (!ok) { sbad++; console.log('NG 件名：' + nm); } };
    const sj = (jobAt, startedAt) => decide({ now, alive: 1, busy: { ev: 'PreToolUse', evAt: now - 1, subj: '枠 九（古い）', startedAt }, kumo: {}, steps: [], job: '枠 十一：新', jobAt }).subj;
    ck('段が全部済んでも、この手番の間に書いた段の台帳の仕事名が件名（枠 九のままにならない）', sj(now - 100, now - 200) === '枠 十一：新');
    ck('手番より前に書いた段の台帳なら、件名は今の指示（busy.subj）', sj(now - 300, now - 200) === '枠 九（古い）');
    // 2026-11-21 枠 十二：手すき（Stop／idle_prompt）の間は、段の台帳が手番より前でも、最後に済んだ仕事の名（03:00 に枠 九が出ていた）
    const si = (ev, jobAt) => decide({ now, alive: 1, busy: { ev, evAt: now - 1, subj: '枠 九（古い）', startedAt: now - 200 }, kumo: {}, steps: [], job: '枠 十一：新', jobAt }).subj;
    ck('手すき（idle_prompt）なら、手番より前の段の台帳でも最後の仕事名', si('idle_prompt', now - 5000) === '枠 十一：新');
    ck('手すき（Stop）も同じ', si('Stop', now - 5000) === '枠 十一：新');
    console.log('件名（段が全部済んだ後・手すき含む）：' + (sbad ? 'NG あり' : '4件 合い')); }
  const a = decide({ now, alive: 1, busy: { ev: 'Stop', evAt: now - 30 }, kumo: { state: 'waiting', subj: '一本目', workflow: 'check.yml', since: String(now - 700), runid: '1', runat: String(now - 600) }, steps: st, nowStep: old, job: '仕事' });
  const b = decide({ now, alive: 1, busy: { ev: 'Stop', evAt: now - 30 }, kumo: { state: 'waiting', subj: '二本目', workflow: 'check.yml', since: String(now - 20), runid: '2', runat: String(now - 3) }, steps: st, nowStep: old, job: '仕事' });
  if (a.sNowAt !== now - 600) { bad++; console.log('NG 一本目の起点が走りの始まりでない：' + a.sNowAt); }
  if (b.sNowAt !== now - 3) { bad++; console.log('NG 二本目の起点が二本目の走りの始まりでない：' + b.sNowAt); }
  const c = decide({ now, alive: 1, busy: { ev: 'Stop', evAt: now - 30 }, kumo: {}, steps: [{ k: ' ', t: '確かめてから公開している' }], nowStep: old, job: '仕事' });
  if (c.sNowAt === now - 9900) { bad++; console.log('NG 前の仕事の起点を引きずった'); }
  console.log('進行中の起点：二本目は二本目の走りの始まりから（' + (bad ? 'NG あり' : '合い') + '）');
  process.exit(bad ? 1 : 0);
}
