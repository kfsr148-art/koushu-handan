# 夜の鈴の棚卸し（09-28 13:30〜09-29 04:10）（r0929-0412）

**終わり（残り0件）** — 2026-09-29 04:10ごろ（VAIO）。読むだけ。本体には触っていない。＊帯の終わり（09:00）はまだ来ていないので、**04:10 までの分**。
見た物：reboot.log・watch-notify.log・inbox-watch.log・pipe-warn.log・revive.log・after-reboot.log・daily-notice.log・hc-watch.log・hc-ping.log、公開の蔵の notices.json／notices-archive.json／ntfy-sent.json の git の歴（82版・9版）を束ねた札と押しの一覧。

## 0. 09-29 03:00 の定時再起動 … **落とした**
- 03:00:14 見送り 1/3（押し残し1件）→ **03:30:22 三つとも空。落とす** → 03:33:26 claude update が180秒で切れた → **03:33:51 静かな帯に入り shutdown /r /t 60** → 起動 03:35:58。静かな帯の直しで落とす段へ届かなくなってはいない
- 明けの ✅ は **04:04:08 の「✅ 戻りました（再起動・30分・帯の間に黙らせた物 3件）」一通だけ**。帯の間（03:33〜04:04）に 🪟 は出ていない（after-reboot の点検の欠け2件は 04:00:20 に帯の中として黙った）
- **見つけた穴 二つ（直していない）**
  1. **落とす前に「起き上がった後の札」が書かれた**（03:31:35・r0929-0330・claude 627→186MB は落とす前の値）。daily-reboot が reboot-pending.txt を 03:30:22 に書いてから claude update の180秒を待つ間に、watch-notify（03:31）が印を見て「起き上がった後」と読んだ
  2. **同じ枠を落とした後も見直している。**04:00:34 に「見送り 1/3（枠 2026-09-29 03）」。落とした枠の印が無いので、**04:30 の回で三つとも空なら二度目を落とす**（09-28 も 03:00 に落とした後、04:00・04:30 に同じ枠を見送っていた）

## 1. 鈴（札）の数え
**09-28 13:30〜09-29 04:10**（異常の鈴＝🪟🕒🙀📮🙋）
| 刻 | 札 | 偽／本物 | 訳 |
|---|---|---|---|
| 13:38 | 🪟 異常です（手が要ります） | 偽 | 生存の刻を四日前と読んだ（5419分）。20:03 に直した |
| 13:54 | 🪟 時間切れ（再挑戦 1/3） | 偽 | 命令が返り続けていた枠を前の「開始から8分」で切った。18:05 に切り方を直した |
| 14:48 | 🕒 延びています（14:50 に 🙀 の押し） | 偽 | 上で切った枠の予定が過ぎただけ |
| 16:55 | 🪟 異常です：再起動の後の点検 | 偽 | 帯の漏れ。17:50 に直した |
| 16:58 | 🪟 異常です（手が要ります） | 偽 | 帯の漏れ（stale）。17:50 に直した |
| 17:50 | 🪟 異常です（連携に訴え：clock-broken・pub-late） | 偽 | 10分で自然に戻った（18:00 ✅） |
| 19:20 | 🙋 ヨシしてください | 偽 | 断片の続き待ちを「待ち:」に書いたので立った。取り下げ |
| 19:34 | 🪟 異常です（手が要ります） | 偽 | 生存の刻を四日前と読んだ（5776分）。20:03 に直した |
| 23:01 | 📮 郵便受けが詰まっています | 偽 | 最後の読み 22:56:18。3分で解けた（23:04） |
- **異常の鈴：偽 9・本物 0**（うち直した種類 6：13:38・13:54・14:48・16:55・16:58・19:34。直していない種類 3：17:50・19:20・23:01）
- 平常の札 18：✅ 終わりました 10・😺 21:00 の定時 1・🔁 落とします 2（16:30・03:33）・✅ 戻りました（再起動）2・✅ 戻りました（連携）1・✅ 再起動の後の点検 2（15:10・03:10）。＊この二つは**まだ落としていない時刻に出た**（15:10 の枠は見送り、03:10 は落とす前）
- 札にならない押し：😸 走り出し 11（13:44・13:46・17:46・18:06・18:56・19:10・19:36・19:38・19:40・20:14 束ね・04:06）

**09-27 13:30〜09-28 09:00**（同じ数え方）
- **異常の鈴：偽 16・本物 0**（🙋 ヨシしてください 2 は本物の返事待ちで、別に数えた）
  - 15:10 🪟 点検（落としていない枠）／19:31 🪟 連携（hook-quiet・state-stale）・19:34 📮・19:34 🪟 見張りが止まっていました（47分）・19:36 🪟 dead・19:38 🪟 窓を起こし直しました（記憶の差し替えで人が落とした後の立ち直り）／22:30 🪟 subj-gap（9分で戻った）／23:32・23:34 🪟 dead・23:34 🪟 起こし直し（自分で戻った）／23:45 🪟 時間切れ・23:48 🕒（resume の取り違え）／03:37 🪟 見張りが止まっています（再起動）・03:44 🪟 連携（hook-quiet）／03:59 🪟 時間切れ・04:02 🕒（resume の取り違え）
- **並べると：偽 16 → 9**（04:10 まで。09:00 までの残り約5時間ぶんは未集計）

## 2. 23時台・01時台の見張りの止まり … **出ていない**
- 見張り（hc-watch.log）も常駐（hc-ping.log）も、22:00〜03:20 に5分を越える途切れは無い。「見張りが止まって…」の鈴も無い
- 途切れは 03:20〜03:26（6分・両方。03:20 は保守の寄せ先）と 03:34〜03:59（再起動）だけ

## 3. 枠の時間切れ … **1回・前の切り方（開始から8分）**
- 09-28 13:55「三つ目と四つ目」（9分）。「固まり／長すぎ」の書き分けが入る前（18:05 に直す前）の切りで、命令は返り続けていた（新しい切り方なら切らない）
- 18:05 以降の時間切れは **0回**
- ＊09-27 の同じ帯は 2回（23:45・03:59）で、どちらも resume の取り違え

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **466件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0929-0412.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0412.md) | 09-29 04:10 | 夜の鈴の棚卸し（09-28 13:30〜09-29 04:10）（r0929-0412） |
| [`r0929-0330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0330-2.md) | 09-29 03:30 | 再起動-2（r0929-0330・後の測り） |
| [`r0928-2003.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2003.md) | 09-28 19:59 | 「見張りの生存記録が N 分途切れています」の偽（5419分・5776分）を直した（r0928-2003） |
| [`r0928-2005.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2005.md) | 09-28 19:42 | map-3 の未特定・様子見の五行の元を当て直した（r0928-2005） |
| [`r0928-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1945.md) | 09-28 19:38 | 仮置き・未実装の印と、欠けた絵・音の洗い出し（r0928-1945） |
| [`r0928-1922.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1922.md) | 09-28 19:17 | map-2 の要確認（三つ目）：heavy-skip・記録の順・My First Check・使わない台本（r0928-1922） |
| [`map-1-parts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-1-parts.md) | 09-28 19:16 | 連携で動いている物の一覧（map-1） |
| [`r0928-1912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1912.md) | 09-28 19:12 | map-2 の要確認（二つ目）：#49・#50・#44 を作り値で確かめて直した（r0928-1912） |
| [`r0928-1901.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1901.md) | 09-28 19:01 | map-2 の要確認（一つ目）：#16・#19・#35 を作り値で確かめて直した（r0928-1901） |
| [`r0928-1807.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1807.md) | 09-28 18:07 | Check-FrameLimit の切り方を「固まり」と「長すぎ」に（r0928-1807） |
| [`r0928-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1756.md) | 09-28 18:07 | 読むだけ：pathspec の枠・控えの預けの枠・今の予定（r0928-1756） |
| [`r0928-1750.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1750.md) | 09-28 17:48 | 静かな帯の漏れ二通を塞いだ（r0928-1750） |
| [`r0928-1656-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1656-2.md) | 09-28 16:56 | 再起動-2（r0928-1656・後の測り） |
| [`r0928-1654-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1654-2.md) | 09-28 16:54 | 再起動-2（r0928-1654・後の測り） |
| [`r0928-1620.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1620.md) | 09-28 16:11 | notices の押しの pathspec の落ちの元と直し（r0928-1620） |
| [`r0928-1611.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1611.md) | 09-28 16:08 | 使用量の HTTP 401 の元と直し（r0928-1611） |
| [`r0928-1606.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1606.md) | 09-28 16:07 | 台帳の「三つ目と四つ目」を済へ・残りを二枠に割った（r0928-1606） |
| [`r0928-1349.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1349.md) | 09-28 13:49 | 控えの預け（ClaudeHomeBackup）を 05:00 へ・落ちたら一通（r0928-1349） |
| [`r0928-1324.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1324.md) | 09-28 13:32 | 静かな帯（再起動・窓の立ち直りの間は偽の鈴を黙らせる）（r0928-1324） |
| [`r0928-1216-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216-2.md) | 09-28 12:32 | 連携の地図三枚（r0928-1216-2・読むだけ） |

<!-- 控えの一覧 ここまで -->
