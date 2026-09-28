# Check-FrameLimit の切り方を「固まり」と「長すぎ」に（r0928-1807）

**終わり（残り0件）** — 2026-09-28 18:07ごろ（VAIO）。本体には触っていない。

## 変えたこと（~/.claude/inbox-watch.ps1 の Check-FrameLimit）
- 前：**開始から8分**で切る（命令が返り続けて進んでいる枠も切っていた）
- いま：
  - **固まり**：最後に命令が返ってから（hook.log の PostToolUse）**8分を超えても次が返らない**と切る。この枠に入ってから一度も返っていなければ、開始の刻から数える
  - **長すぎ**：返り続けていても、**開始から20分を超えたら**切る
- 札の題：「🪟 時間切れ：**固まり（最後の返り HH:MM）**（再挑戦 N/3）」／「🪟 時間切れ：**長すぎ（20分）**（再挑戦 N/3）」
- 札の一行目も書き分けた（固まり＝「最後に命令が返ったのは HH:MM（N分前）で、8分たっても次が返らないので切りました」／長すぎ＝「命令は返り続けていましたが、開始から N分で上限 20分を越えたので切りました」）
- 台帳の追記も「時間切れ（固まり（最後の返り HH:MM）・N分・再挑戦 N/3）」の形
- 作り値用に `$script:FrameFakeIdleMin`（最後の返りからの分）を足した
- 写し .bak-20260928b・構文0件。**常駐を起こし直した**（起動 18:06:43 ＞ 台本 18:05:41・1本）

## 作り値（控えの置き場は scratchpad・落とす／Esc／札／台帳はすべて偽物）
| 場合 | 結果 |
|---|---|
| 返り続けて15分（最後の返り1分前） | **切らない** |
| 返り続けて21分（最後の返り1分前） | **長すぎで切る**：「🪟 時間切れ：長すぎ（20分）（再挑戦 1/3）」 |
| 最後の返りから9分（開始から12分） | **固まりで切る**：「🪟 時間切れ：固まり（最後の返り 17:57）（再挑戦 1/3）」 |
| （前の切り方なら切れた）開始から9分・返り続けている | 切らない |
| 本物の hook.log を読む（開始から12分・いま返っている） | 切らない |

## 実機
- 画面に出る物は無し。**次に時間切れが出たら、札の題に「固まり（最後の返り HH:MM）」か「長すぎ（20分）」が付いていること**（人手待ち）

## ファイル
- ~/.claude/inbox-watch.ps1（写し .bak-20260928b）

## 残り
- 0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **458件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`map-2-alerts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-2-alerts.md) | 09-28 12:31 | 鈴と札の全種類（map-2） |
| [`map-1-parts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-1-parts.md) | 09-28 12:31 | 連携で動いている物の一覧（map-1） |
| [`map-3-incidents.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-3-incidents.md) | 09-28 12:26 | 09-21〜09-28 の出来事（map-3） |
| [`r0928-1216.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216.md) | 09-28 12:18 | SessionStart の resume を仕事の始まりと読む誤りを直した（r0928-1216） |
| [`r0928-1201.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1201.md) | 09-28 12:03 | 「命令0回」で切られた三つの枠の元（r0928-1201・読むだけ） |
| [`r0928-1045.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1045.md) | 09-28 10:42 | 未検収の 🔗 の二行を済へ（r0928-1045） |
| [`r0928-1035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1035.md) | 09-28 10:38 | 未検収を試しで片付ける（二つ目）（r0928-1035） |
| [`r0928-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1020.md) | 09-28 10:16 | 未検収を記録で片付ける（一つ目）（r0928-1020） |
| [`r0928-1010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1010.md) | 09-28 10:11 | 未検収の二行を済へ（記憶の診断・2048）（r0928-1010） |

<!-- 控えの一覧 ここまで -->
