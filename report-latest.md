# 00:04 以後の札が出なかった訳と直し・input-stall・panel v180／検査の見込みの結果（2026-11-20 00:55）

## 札の頭
- 状態：終わり。残りは「手番が終わって5分以内に札が公開に載る」の実測一つ（この回の Stop の後に、見張りが測って窓を起こす）。

## 二つの結果（一枚の札に載せたもの）
1. **panel v180**：公開の panel-ver.txt＝180・panel.html に新しい字・パネルが読む koushu-state の state.json に stepDone／stepTotal。作業中は「終わる見込み HH:MM（あとN分）」と「段 N/M」、無ければ赤で「見込み未記入」「段の台帳 未記入」、過ぎれば赤で「見込みを過ぎた N分」。検査（check.yml 3eba79ad）は success・13分21秒。
2. **検査の見込み**：Get-KumoEta を回の種類別（パネル替え・本体替え・報告だけ）の前5回の中央値にした。v180 の見込み 13分55秒・実測 13分21秒（旧法は4分で9分21秒ずれ）。報告だけは 3分27秒・実測 3分30秒。

## 札が00:04 より後に出なかった訳（記録で辿った）
00:04:17 の札（rewake）の後、00:38:15 まで札が出ていない。経路ごとの結果は次のとおり。

| 経路 | どうだったか | 原因か |
|---|---|---|
| **札の書き手**（work-note → 札） | 00:05〜00:16 は枠が続けて届き、**一つの手番の中で控えの件名が3回替わった**（取り消し→yoshi-open→v180）。Stop は 00:16:39 の一回だけで、その回は外待ち。件名が替わった控えは 00:10:23 に「札にならずに件名が替わった控えを退避した（取り消し・ヨシ待ちを解く）」と退避された | 発端 |
| **雲待ちの間の止め** | 00:16:39 の Stop は雲待ち（外待ち）で「終わりにせず作業中を続ける」・00:18:12「途中の札を出さない（台帳に [雲] が残る）」。ここまでは仕様どおり | 仕様 |
| **退避の立て方**（`Emit-Missed`） | 00:30:17「退避していた控えの札を先に立てた」と記録したが、同じ秒に `Send-Ntfy` が**新しい仕事の台帳（[ ] 5段）に止められて false** を返していた。`Emit-Missed` は**その結果を見ずに**退避の控えを消し、「立てた」と書いた。→ **取り消しの札が消えた** | **主因（バグ）** |
| **退避の置き場** | 退避は note-missed.txt の**一枠だけ**。00:30:16 に v180 の控えを退避しようとしたが、先の退避が残っていて「`-not (Test-Path $MissedPath)`」で**黙って捨てられた**。→ **v180 の札も消えた** | **主因（バグ）** |
| **30秒の静かさ待ち** | 溜め場（end-pending.json）に残りは無く、詰まっていない。00:36:26 の Stop → 00:38:11 に拾って積み → 00:38:15 に公開（**Stop から約1分49秒**） | 原因ではない |
| **配信**（notices.json → koushu-state → Pages） | 00:38:35 に控えへ入れ、00:40:57 の確認で公開の notices.json の先頭が 00:38:15。手元の控えと公開は一致（51件） | 原因ではない |

- つまり「出なかった」のは配信や静かさ待ちが遅いのではなく、**手番が三枠ぶん一つに続いたために札の元が退避に回り、その退避が二重の穴（止められたら消す・一枠しかない）で落ちた**ため。

## 直したこと（`~/.claude/watch-notify.ps1`・写し watch-notify.ps1.bak-20261120）
1. `Send-Ntfy` に `$noHold`（既定 false）を足し、**退避した前の仕事の札は今の仕事の台帳で止めない**（`Emit-Missed` は `$true` を渡す）。
2. `Emit-Missed` は `Send-Ntfy` の結果を見て、**立てられなければ退避を消さずに残す**。記録も「立てた」「立てられなかった（退避は残す）」を言い分ける。
3. **退避を複数枠にした**：note-missed.txt が残っていれば note-missed-2.txt・-3.txt…へ。`Emit-Missed` は全部を古い順に立てる（`Emit-MissedOne` に分けた）。積んだ札は急ぎの知らせの溜め場に入り、**30秒静かになった後に一枚にまとめて出る**。
- 構文検査 0件・BOM あり・差分21行。`watch-notify.ps1` は毎分呼び直されるので常駐の起こし直しは不要。

## input-stall（`~/.claude/inbox-watch.ps1`・写し inbox-watch.ps1.bak-20261120-3）
- 直す前は、最後の合図が Stop・StopFailure の間だけ入力欄を見た。Stop の約60秒後に idle_prompt が鳴ると見るのをやめ、字の数え直しも消えていた（#93502 は Stop の約1.4秒後に起きた例）。
- **合図が idle_prompt の間も見る**（Stop・StopFailure・idle_prompt の三つ）。手待ちで入力欄の字が30秒変わらなければ Enter を一度だけ送る（同じ字には二度送らない・日本語を含み10字以上の字だけ）。常駐を起こし直した（pid 5976・00:47:19 ＞ 台本 00:44:46）。

## 作り値の確かめ
- **札の抜け（偽の置き場・偽の node で台帳の止めを再現・本物の関数を AST で取り出して実行）14件 PASS**：①退避が二枠あり台帳が止めていても二枚とも立つ（積み2本・退避の控えが消える・止められた記録なし）／②立てる手が失敗なら控えが残る／③本物の `Send-Ntfy` は通常は台帳が止め、`noHold` なら止めない／④先の退避が残っていても次の枠は note-missed-2.txt に退避される。
- **input-stall（偽の入力欄・Enter を数える）**：新しい台本は9件 PASS（Stop で読み始め→idle_prompt に移っても読み続け→30秒で Enter 一度・同じ字に二度送らない・字が変われば数え直す・手番が開いている間は読まない・「Continue」のような薄い字は送らない）。**直す前の写しでは7件 FAIL**（idle_prompt に移った時点で読まなくなる）。
- 途中の失敗：私の置換が `$hold = …; if ($hold) {` の行にコメントを付け、同じ行の続きを隠して構文エラーになった。検査で気づき、コメントを外して 0件に戻した。

## 実機で見る所
- **札が一枚で出ること**：この回の Stop の後、5分以内にパネルの札の先頭に、この回の札（panel v180／検査の見込み／札の抜けの訳と直し／input-stall）が載ること。
- 次に手番が複数枠に続いたとき、watch-notify.log に「退避していた控えの札を先に立てた」（立てられなかった場合は「立てられなかった（退避は残す）」）が出て、札の数が枠の数と合うこと。
- 窓が idle_prompt のまま入力欄に字が残ったとき、30秒後に inbox-watch.log へ「入力欄の止まりを送り直した（Enter 一打…）」が一度だけ出ること。

## 残り
- 「手番が終わって5分以内に札が公開に載る」の実測（見張りが Stop から公開で札が見えるまでの秒を測り、受信箱へ一行入れて窓を起こす）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **944件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1120-0050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-0050.md) | 11-20 00:48 | 00:04 以後の札が出なかった訳と直し・input-stall・panel v180／検査の見込みの結果（2026-11-20 00:55） |
| [`y1120-0030.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-0030.md) | 11-20 00:35 | 検査の見込みを回の種類別の前5回の中央値にした（2026-11-20 00:40） |
| [`cloud-panel-check-20261119-151645.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261119-151645.md) | 11-20 00:35 | 雲で回した：`panel-check.js` |
| [`y1119-2315-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2315-2.md) | 11-20 00:05 | 使用量の止まりを rewake で起こす（rewake-limit.js）・台帳照合の取り下げ（2026-11-20 00:10） |
| [`y1119-2315.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2315.md) | 11-19 23:49 | 立て直しの確かめと「様子を写す」・使用量の待ちで窓を落とさない（2026-11-20 00:00） |
| [`y1119-2300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2300.md) | 11-19 23:40 | SessionStart の rewake を外し、窓を立てる時に最初の一言を渡す（2026-11-19 23:00） |
| [`cloud-panel-check-20261119-143215.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261119-143215.md) | 11-19 23:40 | 雲で回した：`panel-check.js` |
| [`cloud-panel-check-20261119-142210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261119-142210.md) | 11-19 23:30 | 雲で回した：`panel-check.js` |
| [`y1119-2245.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2245.md) | 11-19 22:48 | 窓の起こし役（rewake）を切らさない（二段目・2026-11-19 22:45） |
| [`y1119-2220.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2220.md) | 11-19 22:27 | 札の控えを書く所に錠を掛ける（一段目・2026-11-19 22:20） |
| [`y1119-2205.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2205.md) | 11-19 22:08 | 新しい形へ移すための一覧（2026-11-19 22:05・何も直していない） |
| [`y1119-2200.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2200.md) | 11-19 21:58 | 見張りが裏の働き手（claude -p）を自分で起こす所を止める（2026-11-19 22:00） |
| [`y1119-2150.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2150.md) | 11-19 21:49 | claude -p の仕掛けの受け継ぎを断ち、札の無い手番を拾う網を idle_prompt に戻す（2026-11-19 21:50） |
| [`y1119-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2100.md) | 11-19 20:59 | 17:48 の赤い行「claude -p 1本」を調べて片付ける（2026-11-19 21:00） |
| [`y1119-1645.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1645.md) | 11-19 16:46 | 終わりの後に二行出るのを元から止める（2026-11-19 16:50） |
| [`y1119-1620.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1620.md) | 11-19 16:28 | 「▶ 進行中（N分）」の分数の直し（2026-11-19 16:28） |
| [`cloud-panel-check-20261119-071623.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261119-071623.md) | 11-19 16:27 | 雲で回した：`panel-check.js` |
| [`y1119-1610.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1610.md) | 11-19 16:15 | 😽 の知らせと終わりの札を一つに（2026-11-19 16:15） |
| [`y1119-1605.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1605.md) | 11-19 16:02 | 台帳の済の付け方・終わりの札を一枚に（2026-11-19 16:05） |
| [`y1119-1600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1600.md) | 11-19 15:55 | 台帳の済の付け方の直し（2026-11-19 16:00） |

<!-- 控えの一覧 ここまで -->
