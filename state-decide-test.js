// state-decide-test.js — 状態の決め所（state-decide.js）を作り値で総当たりする（2026-11-19・本人の枠⑥）。panel-check.js から呼ぶ。手元でも数秒。
//   材料の組を全部作り、上から当てる順（ヨシ待ち→止まり→作業中→検査中→待ち→待機中）と中身の決まりを一件ずつ確かめる。終了コード 0＝全部合い。
'use strict';
const { decide } = require('./state-decide.js');
const now = 1795050000;
const EV = { 'UPS3分以内': { ev: 'UserPromptSubmit', evAt: now - 60 }, 'Post3分超': { ev: 'PostToolUse', evAt: now - 400 }, 'Stop': { ev: 'Stop', evAt: now - 30 }, '止まり使用量': { ev: 'StopFailure', evAt: now - 30, stat: '止まり（使用量・13:00 にリセット）' }, 'idle': { ev: 'idle_prompt', evAt: now - 10 } };
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
  const bgFresh = !!BG[g] && BG[g].at >= EV[e].evAt - 5;
  const back = (a === '手伝い1' || (bgFresh)) && alive;
  const expect = s === '決め待ち' ? 'ヨシ待ち' : e === '止まり使用量' ? '止まり' : (alive && (e === 'UPS3分以内' || back)) ? '作業中' : ((k === '雲・見込みあり' || k === '雲・見込みなし')) ? '検査中' : (k === '時計の待ち' || !alive || e === 'UPS3分以内' || e === 'Post3分超' || a === '手伝い不明1' || s === '段残り') ? '待ち' : '待機中';
  const rs = /^止まり/.test(r.stat) ? '止まり' : r.stat;
  if (rs !== expect) { ng(c, r, '順が違う（当て＝' + expect + '）'); continue; }
  if (rs === '止まり' && e === '止まり使用量' && r.stat !== '止まり（使用量・13:00 にリセット）') { ng(c, r, '止まりの字（リセットの刻）'); }
  if (r.stat === '作業中' && bgFresh && r.detail !== '裏で手伝い1本・雲1本' && a !== '手伝い1') { ng(c, r, '作業中の数（teammate を外し、手伝い1・雲1）'); }
  if (r.stat === '作業中' && /teammate|仲間/.test(r.detail)) { ng(c, r, 'teammate を数えた'); }
  if (r.stat === '検査中' && k === '雲・見込みあり' && !/終了予定 [0-9]{2}:[0-9]{2}$/.test(r.detail)) { ng(c, r, '検査中の終了予定'); }
  if (r.stat === '検査中' && k === '雲・見込みなし' && !/見込み不明$/.test(r.detail)) { ng(c, r, '検査中の見込み不明'); }
  if (r.stat === '検査中' && /過ぎ/.test(r.detail)) { ng(c, r, '過ぎた帯'); }
  if (r.stat === '待ち' && k === '時計の待ち' && !/再開 [0-9]{2}:[0-9]{2}$/.test(r.detail)) { ng(c, r, '待ちの再開の刻'); }
  if (r.stat === '待ち' && !r.detail) { ng(c, r, '待ちの訳が空'); }
  if (r.stat === '待機中' && (s === '段残り' || k !== '雲なし' || a !== '手伝いなし' || bgFresh)) { ng(c, r, '待機中なのに残りがある'); }
  if (/（なし）/.test(r.detail)) { ng(c, r, '「（なし）」'); }
}
console.log('状態の決め所の総当たり：' + n + '組・NG ' + bad + '件・内訳 ' + JSON.stringify(seen));
// （終わりは下の進行中の起点の確かめの後）
// 2026-11-19 16:20 本人の枠：「▶ 進行中（N分）」の起点は今待っている走りの始まり。二本続けて走らせると二本目は0分から
{
  const st = [{ k: 'x', t: '一' }, { k: '雲', t: '確かめてから公開している' }];
  const old = { t: '前の仕事|確かめてから公開している', at: now - 9900 };
  const a = decide({ now, alive: 1, busy: { ev: 'Stop', evAt: now - 30 }, kumo: { state: 'waiting', subj: '一本目', workflow: 'check.yml', since: String(now - 700), runid: '1', runat: String(now - 600) }, steps: st, nowStep: old, job: '仕事' });
  const b = decide({ now, alive: 1, busy: { ev: 'Stop', evAt: now - 30 }, kumo: { state: 'waiting', subj: '二本目', workflow: 'check.yml', since: String(now - 20), runid: '2', runat: String(now - 3) }, steps: st, nowStep: old, job: '仕事' });
  if (a.sNowAt !== now - 600) { bad++; console.log('NG 一本目の起点が走りの始まりでない：' + a.sNowAt); }
  if (b.sNowAt !== now - 3) { bad++; console.log('NG 二本目の起点が二本目の走りの始まりでない：' + b.sNowAt); }
  const c = decide({ now, alive: 1, busy: { ev: 'Stop', evAt: now - 30 }, kumo: {}, steps: [{ k: ' ', t: '確かめてから公開している' }], nowStep: old, job: '仕事' });
  if (c.sNowAt === now - 9900) { bad++; console.log('NG 前の仕事の起点を引きずった'); }
  console.log('進行中の起点：二本目は二本目の走りの始まりから（' + (bad ? 'NG あり' : '合い') + '）');
  process.exit(bad ? 1 : 0);
}
