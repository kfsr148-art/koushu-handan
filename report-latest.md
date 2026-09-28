# 控えの預け（ClaudeHomeBackup）を 05:00 へ・落ちたら一通（r0928-1349）

**終わり（残り2件：三つ目と四つ目は続けて着手）** — 2026-09-28 13:50ごろ（VAIO）。本体には触っていない。窓は落としていない。

## 元（読んだこと）
- 予定：毎日 **03:30**・上限10分・遅れて走る＝はい・重なり＝IgnoreNew。包みは run-hidden.vbs → home-backup.ps1
- 09-27 03:30:30 の結果 **0x800705AA（資源不足）**。git-push.log に home-backup の行が**一つも無い**＝**台本が起きる前に落ちた**
- 03:30 は **03:00 の再起動（30分おきに 04:30 まで繰り返す）と立ち直り**のただ中。空きが一番細い時刻に重なっていた
- 09-28 は走った跡なし（予定表の記録の読みは重く、200秒で返らなかったので数えていない）。home-backup-last.txt は **2026-09-26** のまま
- 台本の中の失敗（拾い・push・鍵の混入）は記録に残すだけで**鳴らない**作りだった

## したこと
1. **引き金を毎日 05:00 へ**（元の XML は `~/.claude/tasks-bak-20260927/ClaudeHomeBackup-before-0500.xml`）。上限・遅れて走る・重なりはそのまま。次回 **09-29 05:00**
2. **落ちたら一通**：`pipe-check.ps1` の末尾に置いた（台本の中に置くと、起きる前に落ちる 0x800705AA を拾えないため）
   - **05:40 を過ぎて home-backup-last.txt が今日でなければ**「**🪟 異常です（控えの預けが落ちました）**」を一通
   - 中身の札：最後に押せた日／git-push.log の home-backup の末尾2行（無ければ「台本が起きる前に落ちた見込み」）
   - **一日一通**（鳴らした日を home-backup-rung.txt に刻む）。拾い・push の失敗・鍵の混入も日付を刻まないので、同じ一通で拾う
   - 構文検査 0件

**仕組みの選び**：鳴らす所は台本の中でなく外（pipe-check の日付見張り）にした。今回の落ち方は台本が起きないので、中では鳴らせない。＊選ばなかった案：home-backup.ps1 の失敗の枝ごとに鳴らす（起きない回を拾えない）。

## 作り値（控えの置き場は scratchpad・送り手は偽物）
| 場合 | 鳴った数 |
|---|---|
| A 05:30（まだ見ない刻）・刻みが前日 | 0 |
| B 05:41・今日押せた | 0 |
| C 05:41・刻みが前日 | **1**（題・最後に押せた日・記録の末尾） |
| D 同じ日の 05:51 にもう一度 | 0（一日一通） |
| E 翌日 06:00 も落ちた | **1** |
| F 記録に一行も無い | **1**（「台本が起きる前に落ちた見込み」） |

## 手で一度走らせた（通った）
- 13:48:48 に予定表から起こした → **結果 0x0**
- git-push.log：`2026-09-28 13:48:58 home-backup 押した：控え: 2026-09-28（95件の変更）`
- 控えの蔵 master の先頭 **c2e4b0e**（13:48:53）・origin と一致。home-backup-last.txt は **2026-09-28**

## ファイル
- ~/.claude/pipe-check.ps1（写し .bak-20260928b）
- 予定表 ClaudeHomeBackup（元 XML は tasks-bak-20260927/）
- home-backup.ps1 は**変えていない**（写し .bak-20260928 だけ取った）

## 実機
- 画面に出る物は無し。**明日 09-29 の 05:00 過ぎに git-push.log へ「home-backup 押した」が出て、05:40 以降に 🪟 が鳴らないこと**（人手待ち）

## 残り
1. 三つ目：使用量の読みの HTTP 401 の元（これから）
2. 四つ目：notices の押しの pathspec の元（これから）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **450件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0928-0950-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950-2.md) | 09-28 09:54 | conhost.exe の 0xc0000409 の落ち四回と、Windows Terminal の見込み（r0928-0950-2・読むだけ） |
| [`r0928-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950.md) | 09-28 09:54 | 09-28 の再起動の後の点検（記憶の診断・仮想メモリ・03:20・NODE_OPTIONS・引き継ぎ）（r0928-0950・読むだけ） |
| [`r0928-0348-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0348-2.md) | 09-28 03:48 | 再起動-2（r0928-0348・後の測り） |
| [`r0928-0345-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0345-2.md) | 09-28 03:45 | 再起動-2（r0928-0345・後の測り） |
| [`r0928-0302-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0302-2.md) | 09-28 03:02 | 再起動-2（r0928-0302・後の測り） |
| [`r0928-0138.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0138.md) | 09-28 01:40 | 09-27 23:25〜23:36 に Claude の窓が消えた元（r0928-0138・読むだけ） |
| [`r0928-0009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0009.md) | 09-28 00:10 | bcdedit の二件と未検収の一行を済へ（r0928-0009） |
| [`r0927-2311.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2311.md) | 09-27 23:15 | bcdedit /bootsequence {memdiag} を管理者でもう一度（また UAC が通らず）（r0927-2311） |

<!-- 控えの一覧 ここまで -->
