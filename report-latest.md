# 未検収を試しで片付ける（二つ目）（r0928-1035）

**終わり（残り0件）** — 2026-09-28 10:38ごろ（VAIO）。本体には触っていない。窓は落としていない。Code タブも切っていない。

## 2. 作り値で三つを回した → **三つとも合った**（置き場は scratchpad・送り手も打ち手も偽物・本物の窓には打っていない）
| 仕掛け | 例 | 結果 |
|---|---|---|
| 使用量の上限で手待ち（Check-UsageHold） | 週全体100%・戻りは先 | 手待ち・知らせ一通「🪟 使用量の上限で手待ち（戻り HH:MM）」 |
| | 同じ上限で二度目 | 手待ち・知らせ無し |
| | どれも100%未満 | 取る（手待ちにしない） |
| | 100%だが戻りの刻を過ぎた | 取る |
| 遠隔の切れの繋ぎ直し（Check-RcDrop・会話の記録で判じる） | 記録の最後が切れ（Remote Control disconnected） | /remote-control を一回・知らせ一通 |
| | 記録の最後が active | 打たない |
| 手待ちで 1500MB の /clear（Check-ClaudeHeavy・読んだ敷居 1500） | 1600MB・手待ち | /clear 一回・知らせ一通「🪟 控えを畳みました（重さ 1600MB）」 |
| | 1600MB・二度目 | 打たない |
| | 1400MB（敷居を割った） | 打たない |
| | 1600MB・走行中 | 打たない |
| | 下がった後にまた 1600MB | /clear 一回・知らせ一通 |

**kenshu-closed.tsv へ移した三行**（訳：作り値で合い・実地は起きた時の札で見る）
- 2026-09-21 19:57 使用量の上限で手待ち（人手待ち）
- 2026-09-23 次に遠隔の線が切れた回に「🪟 遠隔を繋ぎ直しました」が鳴り Code タブへ戻ること（人手待ち）
- 2026-09-23 22:26 手待ちで 1500MB を超えた回に窓が残ったまま /clear で畳まれること（人手待ち）

## 1. 取り下げの ✅（本物の道）→ **立って鳴った。「09-23 取り下げの ✅」を済へ**
- 偽のヨシ待ち **y0928-shiken1**（件名「（試し）取り下げの ✅ の札の確かめ」）を yoshi-open.tsv に立てた
- inbox-feed.ps1 の取り下げの手（Take-Withdraw）をそのまま使い、「y0928-shiken1 取り下げ（試し：…）」で閉じた → 一覧から消えた・yoshi-withdrawn.txt が書かれた
- **10:22:05**：watch-notify「取り下げで閉じた回なので ✅ に印と理由を載せた：y0928-shiken1」。札の題は **✅ 終わりました（返事不要）**、本文に **「印: y0928-shiken1（取り下げ）」「取り下げた理由：…」「いまの姿：…」**。yoshi-withdrawn.txt は使った後に消えた
- 10:22:48・10:25:13・10:35:13：「公開側にまだ出ない（30秒）。次の回へ預ける」（公開に出てから押す作り）
- **10:38:06「預かっていた押し送り：公開側に出たので送る」→ 10:38:07「押し送りOK（HTTP 200）」**。公開側の notices.json の頭にも、印を含む ✅ の札が並んだ
- **偽の待ちは残っていない**（yoshi-open.tsv に y0928-shiken1 は0件）
- kenshu-closed.tsv へ：「2026-09-23 次に取り下げで閉じた回に ✅ の札が印つきで立って鳴ること」
- ＊公開に出るまで約16分かかった（押しは公開を待つ作り）

**いまの未検収（4行）**
- 2026-09-23 22:26 次に窓が立ち直った回に「🔗 新しい線」が一通だけ届くこと（人手待ち）
- 2026-09-23 23:15 03:00 の立ち直りの「🔗 新しい線」の判じ（人手待ち）
- 2026-09-27 19:40 差し替え後の一週、空き 300MB 割れの鈴が鳴らないこと（〜10-04・人手待ち）
- 2026-09-28 10:20 23時台・01時台に見張りが止まらないこと（〜10-01 の三夜・人手待ち）

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **441件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0928-1035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1035.md) | 09-28 10:38 | 未検収を試しで片付ける（二つ目）（r0928-1035） |
| [`r0928-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1020.md) | 09-28 10:16 | 未検収を記録で片付ける（一つ目）（r0928-1020） |
| [`r0928-1010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1010.md) | 09-28 10:11 | 未検収の二行を済へ（記憶の診断・2048）（r0928-1010） |
| [`r0928-0950-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950-2.md) | 09-28 09:54 | conhost.exe の 0xc0000409 の落ち四回と、Windows Terminal の見込み（r0928-0950-2・読むだけ） |
| [`r0928-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950.md) | 09-28 09:54 | 09-28 の再起動の後の点検（記憶の診断・仮想メモリ・03:20・NODE_OPTIONS・引き継ぎ）（r0928-0950・読むだけ） |
| [`r0928-0348-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0348-2.md) | 09-28 03:48 | 再起動-2（r0928-0348・後の測り） |
| [`r0928-0345-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0345-2.md) | 09-28 03:45 | 再起動-2（r0928-0345・後の測り） |
| [`r0928-0302-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0302-2.md) | 09-28 03:02 | 再起動-2（r0928-0302・後の測り） |
| [`r0928-0138.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0138.md) | 09-28 01:40 | 09-27 23:25〜23:36 に Claude の窓が消えた元（r0928-0138・読むだけ） |
| [`r0928-0009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0009.md) | 09-28 00:10 | bcdedit の二件と未検収の一行を済へ（r0928-0009） |
| [`r0927-2311.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2311.md) | 09-27 23:15 | bcdedit /bootsequence {memdiag} を管理者でもう一度（また UAC が通らず）（r0927-2311） |
| [`r0927-2257.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2257.md) | 09-27 23:01 | y0927-2251 にヨシ → 次の起動を記憶の診断に（UAC が取り消され、走っていない）（r0927-2257） |
| [`r0927-2226.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2226.md) | 09-27 22:30 | pipe-warn の鈴を「続く間も3時間ごと・消えたら戻り」に（r0927-2226） |
| [`r0927-2215.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2215.md) | 09-27 22:17 | healthchecks の down と、押しの止まりの間の pipe-warn の鈴（r0927-2215・読むだけ） |
| [`r0927-2046.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2046.md) | 09-27 20:47 | 定時再起動を写しから戻し、03:00 と 15:00 の二本立てに（r0927-2046） |
| [`r0927-2040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2040.md) | 09-27 20:41 | 定時再起動を 03:00 の一回だけに（r0927-2040） |
| [`r0927-2027.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2027.md) | 09-27 20:28 | 未検収の二行の手入れ（r0927-2027） |
| [`r0927-2013.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2013.md) | 09-27 20:21 | 記憶 8GB に合わせて締め付けを緩めた（NODE_OPTIONS 2048・/clear の敷居 1500MB）（r0927-2013） |
| [`r0927-2006.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2006.md) | 09-27 20:07 | y0927-2003 にヨシ → tasks-to-0320.ps1 を管理者で走らせた（r0927-2006） |
| [`r0927-1955.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1955.md) | 09-27 19:56 | tasks-to-0320.ps1 に二つ足した（断片の整理・仮想メモリの自動管理）（r0927-1955） |

<!-- 控えの一覧 ここまで -->
