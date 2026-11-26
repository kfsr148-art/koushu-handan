#!/usr/bin/env node
/* post-publish-decide.js — 公開の後の試しの結果から、前の良い版を覚える／自動で戻すを決める（2026-11-26・橋の枠 三百四十七・本人の決め）。
   使い方  node tools/post-publish-decide.js <状態 json> <今の公開の commit> <試し一回目の json> [<二回目の json>] [--dry]
   ＊状態 json（reports/post-publish/state.json）：{ lastGood:{ver,sha,at}, rolled:{<落ちた版>:{to,at}} }
   ＊決め：
       通った（ok）→ lastGood を今の版・commit に進める（ACTION=ok）。
       試しの道具が動かなかった（infra）→ 何もしない（ACTION=infra）。試しの側の不調で良い版を戻さない。
       落ちた（fail が二度続いた）→ 前の良い版が有り、今の版と違い、この版をまだ戻していなければ、koushu-handan.html と ver.txt だけを前の良い版の commit の物へ戻して commit・push し（ACTION=rolled）、
         配信の検査（check.yml）を起こし直すのは呼ぶ側。前の良い版が無い・同じ版・もう戻した版は戻さない（ACTION=fail-no-rollback）。
   ＊戻すのは本体の二つ（koushu-handan.html・ver.txt）だけ。パネル・台詞・声は戻さない。--dry の時は git を触らず、戻す手順が取れるかだけ確かめる（月一の戻しの試し）。
   出力：最後の行が ACTION=…（呼ぶ側の shell が拾う）。 */
'use strict';
const fs = require('fs'), cp = require('child_process');
const a = process.argv.slice(2), dry = a.includes('--dry'), args = a.filter(x => x !== '--dry');
const SF = args[0], SHA = args[1], R1 = args[2], R2 = args[3];
const rj = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const st = rj(SF, { lastGood: null, rolled: {} }); st.rolled = st.rolled || {};
const r1 = rj(R1, { kind: 'infra', why: '一回目の結果が読めない' }), r2 = R2 ? rj(R2, null) : null;
const r = r2 || r1;
const sh = (c, o) => cp.execSync(c, Object.assign({ encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }, o || {}));
const save = () => { if (!dry) { fs.mkdirSync(require('path').dirname(SF), { recursive: true }); fs.writeFileSync(SF, JSON.stringify(st, null, 1)); } };
const fin = (act, msg) => { console.log(msg || ''); console.log('ACTION=' + act); process.exit(0); };
if (r.kind === 'ok') { st.lastGood = { ver: r.ver, sha: SHA, at: new Date().toISOString() }; save(); fin('ok', '通った：版 ' + r.ver + ' を前の良い版に覚えた（' + String(SHA).slice(0, 9) + '）'); }
if (r.kind === 'infra') { fin('infra', '試しの道具が動かなかった：' + (r.why || '')); }
// fail が二度続いた時だけ（一回目が fail で二回目が ok なら通った扱いで上で済んでいる）
if (r1.kind !== 'fail' || (r2 && r2.kind !== 'fail')) { fin('infra', '一回目と二回目で結果が割れた（' + r1.kind + '／' + (r2 ? r2.kind : '—') + '）。戻さない'); }
const lg = st.lastGood;
if (!lg || !lg.sha) { fin('fail-no-rollback', '落ちたが、戻り先の良い版がまだ無い（初めての試し）'); }
if (String(lg.ver) === String(r.ver)) { fin('fail-no-rollback', '落ちたが、前の良い版と同じ版（' + r.ver + '）なので戻す先が無い'); }
if (st.rolled[r.ver]) { fin('fail-no-rollback', '版 ' + r.ver + ' はもう一度戻してある。二度は戻さない'); }
try { sh('git cat-file -e ' + lg.sha + ':koushu-handan.html'); sh('git cat-file -e ' + lg.sha + ':ver.txt'); } catch (e) { fin('fail-no-rollback', '戻り先の commit ' + String(lg.sha).slice(0, 9) + ' に本体が無い（履歴が浅い？）'); }
if (dry) { fin('rollback-possible', '戻しの手順は取れる：' + r.ver + ' → ' + lg.ver + '（commit ' + String(lg.sha).slice(0, 9) + '・--dry なので触っていない）'); }
sh('git checkout ' + lg.sha + ' -- koushu-handan.html ver.txt');
const msg = '自動の戻し：公開の試しに落ちたので 本体を v' + r.ver + ' から v' + lg.ver + '（' + String(lg.sha).slice(0, 9) + '）へ戻す（koushu-handan.html・ver.txt だけ）— ' + (r.bad || []).slice(0, 2).join('／').slice(0, 120);
sh('git add koushu-handan.html ver.txt');
sh('git -c user.name=post-publish-bot -c user.email=post-publish-bot@users.noreply.github.com commit -m ' + JSON.stringify(msg));
st.rolled[r.ver] = { to: lg.ver, at: new Date().toISOString() }; save();
sh('git add ' + SF); try { sh('git -c user.name=post-publish-bot -c user.email=post-publish-bot@users.noreply.github.com commit -m "post-publish: 戻した印"'); } catch (e) { }
for (let i = 0; i < 3; i++) { try { sh('git pull --rebase -q origin main'); sh('git push -q origin HEAD:main'); break; } catch (e) { if (i === 2) { fin('rollback-push-failed', '戻しの push が三度落ちた：' + String(e.message).slice(0, 100)); } } }
fin('rolled', '戻した：v' + r.ver + ' → v' + lg.ver + '（commit ' + String(lg.sha).slice(0, 9) + '）');
