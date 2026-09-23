# 04:30 の定時・見送りの訳からヨシ待ちを外す・押し残しの数えられず・ヨシ待ち8件（r0924-0506）

**終わり（残り0件）** — 2026-09-24 05:09ごろ（VAIO）。本体には触っていない。窓は落としていない。

1. **04:30 の定時は、落とさず次の定時（15:00）へ回した。**（04:30:10「見送りは 3回で打ち止め。落とさず次の定時へ回す：ヨシ待ち 8件／押し残し 数えられず」）

2. **daily-reboot.ps1 の見送りの訳から「ヨシ待ち」を外した。** 数は数え続け、記録の行の末尾へ「［ヨシ待ち 8件（訳にしない）］」と添えるだけにした。頭の決まりも「三つを見る」に書き替えた

3. **「押し残し 数えられず」の元は、git の終了コードを読み損ねていたこと。**
   - 押し残しは `Start-Process git.exe … -PassThru` で数えている。**Handle を掴まずに WaitForExit すると、ExitCode が空（null）で返る**（PowerShell 5.1 の癖）。git は 0 で終わり「0」と出していたのに、`ExitCode -eq 0` が偽になり、**毎回 -1＝数えられず**になっていた
   - 手で同じ形を回して確かめた：Handle なし → ExitCode 空・出力「0」／Handle を先に掴む → ExitCode 0・出力「0」
   - 直し：Start-Process のすぐ後に ` = .Handle`。**それでも数えられない回は0件（残りなし）として扱い**、記録に「押し残しは数えられず→0件として扱った」と添える
   - 作り値（置き場は scratchpad・偽の shutdown・偽の送り手。本物の reboot.log には書いていない）：
     - **A ヨシ待ち8・押し残し0 → 落とす**（「三つとも空。落とす［ヨシ待ち 8件（訳にしない）］」→ 偽の shutdown が呼ばれた）
     - **B ヨシ待ち8・押し残し1 → 見送る**（「見送り 1/3：押し残し 1件」→ 偽の shutdown は呼ばれない）
     - C 本物の git で数える（ほかは作り値）→ 0件と数えられ、「数えられず」の添え書きなしで落とす側へ
   - ＊次の本物は 15:00。ほかの訳（台帳の未了・走っている道具・押し直しの印）が無ければ落ちる

4. **ヨシ待ち8件**（yoshi-open.tsv）

| 印 | 立った刻 | 件名 | いまの姿 |
|---|---|---|---|
| y0919-0815 | 09-19 08:21 | 見立て行と釦の助言の文面を差し替える（v1451）の宣言 | v1451 は 09-19 08:27 に commit 済み |
| y0920-0912 | 09-20 09:20 | ずんだもん・枝豆・兎の文面の差し替え（v1453）の宣言 | v1453 は 09-20 09:31 に commit 済み |
| y0920-1058 | 09-20 10:55 | 説明欄の三つの直し（v1454）の宣言 | v1454 は 09-20 11:09 に commit 済み |
| y0920-1330 | 09-20 13:30 | 節五の猫牌の表の二つ目を外す（v1455）の宣言 | v1455 は 09-20 13:33 に commit 済み |
| y0920-1406 | 09-20 14:07 | A の末尾の一文を数入りの字へ（v1456）の宣言 | v1456 は 09-20 14:10 に commit 済み |
| y0920-1500 | 09-20 14:51 | 剣士の八枚を idleRight 52 に揃える（v1457）の宣言 | v1457 は 09-20 15:01 に commit 済み |
| y0920-1710 | 09-20 17:01 | 「三」の根拠の段へ一文を足す（v1458）の宣言 | v1458 は 09-20 17:06 に commit 済み（いまの本体の版） |
| y0921-0900 | 09-21 09:01 | claude を落とす命令の宛先を確かめた | 本体の宣言ではない |

＊上の7件は、宣言したとおり納品まで済んでいる。**答えが済んだのに一覧から落ちていない残り**に見える。消してはいない（今回の指示に無いため）

### 触った物
~/.claude/daily-reboot.ps1（写し .bak-20260924）・orders-open.tsv・work-note.txt／reports/r0924-0506.md・report-latest.md

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **396件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0924-0506.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-0506.md) | 09-24 05:09 | 04:30 の定時・見送りの訳からヨシ待ちを外す・押し残しの数えられず・ヨシ待ち8件（r0924-0506） |
| [`r0924-0421.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-0421.md) | 09-24 04:25 | 00:10 の claude（4412）・いまの本数・03:00 の定時（r0924-0421・読むだけ） |
| [`r0923-2341.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2341.md) | 09-23 23:50 | panel-check は雲（job.yml）で回して reports/ へ返す（r0923-2341） |
| [`cloud-panel-check-20260923-144600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20260923-144600.md) | 09-23 23:50 | 雲で回した：`panel-check.js` |
| [`r0923-2305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2305.md) | 09-23 23:13 | いまの線を送る・パネルと定時の札に宛先・引き継ぎの確かめ・22:50 の切れの調べ（r0923-2305） |
| [`r0923-2222.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2222.md) | 09-23 22:26 | 重いときは /clear だけ・起こす手は一つ・🔗 新しい線・繋ぎ直しの手（r0923-2222） |
| [`r0923-2212.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2212.md) | 09-23 22:21 | mode-check を見るだけに・窓を立て直しても同じ遠隔の会話へ（r0923-2212） |
| [`r0923-2141.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2141.md) | 09-23 21:57 | claude の本数整理・起こす手を一本に・遠隔の繋ぎ直し・auto 起動（r0923-2141） |
| [`r0923-1401.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-1401.md) | 09-23 14:19 | 窓を auto で立てる・0本の回の終わり方（r0923-1401） |
| [`r0923-1335.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-1335.md) | 09-23 13:39 | 定時再起動の見送り3/3は落とさず次の定時へ（r0923-1335） |
| [`r0923-1033.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-1033.md) | 09-23 10:44 | 台帳の寄せ・取り下げの札・片付け×止の元（r0923-1033） |
| [`r0923-0646.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-0646.md) | 09-23 06:52 | 再起動直後の固まり誤鳴りを止めた（r0923-0646） |
| [`r0923-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-0430-2.md) | 09-23 04:30 | 再起動-2（r0923-0430・後の測り） |
| [`y0922-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-2155.md) | 09-22 21:55 | 予定四件の悪い結果は「消えるだけ」（y0922-2155） |
| [`r0922-1630-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0922-1630-2.md) | 09-22 16:30 | 再起動-2（r0922-1630・後の測り） |
| [`y0922-1330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1330-2.md) | 09-22 14:08 | 追報：25分の底が効いた（14:04:30・中身が同じまま押した） |
| [`y0922-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1330.md) | 09-22 13:29 | state-stale の繰り返しは「押しの間引き」が元。25分の底を足した |
| [`y0922-1113.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1113.md) | 09-22 11:14 | 0件の元は「見出しの言語」。数え方を Get-ScheduledTask へ替えた |
| [`y0922-1047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1047.md) | 09-22 10:49 | 予定表の Claude* は13件すべて在った（入れ直さず） |
| [`r0922-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0922-0430-2.md) | 09-22 04:30 | 再起動-2（r0922-0430・後の測り） |

<!-- 控えの一覧 ここまで -->
