# 再起動で切れた二つの直しは**入っている** — 作り値の結果と予定表の写し

**終わり（残り0件）** — 2026-09-21 01:15（VAIO）。**確かめ直しただけ。新しい直しはしていない。**
`koushu-handan.html`・`stable` には触っていない。

## 入っていることの確かめ（実物の字）

| 直し | 在り処 | 実物 |
|---|---|---|
| **①居座りを塞ぐ** | `~/.claude/inbox-watch.ps1` L1146〜1156 | `$stuckMin = 5` ／ `if ($upMin -lt 20) { $stuckMin = 3 }` ／ 落とす条件が `-gt $stuckMin` ／ 記録に「敷居N分」を添える |
| **②ログオンで戻りの札** | `~/.claude/after-reboot.ps1` L34・L50・L140 | `[switch]$OnLogon` ／ `$SHUT_MIN = 30` ／ 題が `'✅ 戻りました（再起動から）'` |
| ②の走らせ方 | Startup の `ClaudeAfterLogon.vbs`（09-21 00:45） | `WScript.Sleep 300000` ／ `sh.Run "powershell.exe … after-reboot.ps1 -OnLogon", 0, False` |

**常駐は直したあとに起こし直してある** … `inbox-watch` **pid 9496・09-21 00:44:14 起動**ＶＳ
台本の更新 **00:43:56**（**常駐のほうが新しい**＝直しが効いている）。

## 作り値（いま回し直した結果）

**① 居座りの敷居**（本物の字を切り出し、**起動の刻だけ偽って**回す）

| 起動からの経過 | 敷居 |
|---|---|
| 2分 | **3分** |
| 6分 | **3分** |
| 19分 | **3分** |
| 21分 | 5分（今までどおり） |
| 300分 | 5分（今までどおり） |

＊09-20 の稽古（居座り pid 6772・23:39:58 起動）に当てると **23:43 台に落ちる**。実際は 23:45:29 だったので**約2分の短縮**。

**② ログオンの札**（本物の台本の写しを、**偽の送り手**に差し替えて回す。本物の ntfy・押しは叩いていない）

```
--- イ 落とし直後のログオン（落としは 8分前）　札=あり　終了コード 0
     === ✅ 戻りました（再起動から）
     再起動から戻った（落としは 8分前・09-21 01:12）
     ① 予定表 Claude* … 11件・最終結果は全て良い
     ② 見張りの生存 … 1分前
     ③ ntfy.sh の応答 … HTTP 200
     ④ 公開側 … notices.json のいちばん新しい札 09-21 00:57:06／panel-ver.txt 142
     四つとも○。戻っている。
--- ロ ふつうのログオン（落としは 400分前）　札=**なし**　終了コード 0
```

＊**ハ 落とし直後だが ntfy が 503** の形も当てた（00:47）→ 題は **「🪟 異常です：再起動の後の点検」**。

## 予定表の写し（いま）

```
ClaudeAfterReboot      状態=Disabled  次回=N/A                    最終結果=267011
ClaudeBoard            状態=Enabled   次回=2026/09/21 1:20:00     最終結果=0
ClaudeCodeAtLogon      状態=Enabled   次回=N/A（ログオン時）      最終結果=0
ClaudeDailyNotice      状態=Enabled   次回=2026/09/21 9:00:00     最終結果=0
ClaudeEdgeSweep        状態=Enabled   次回=2026/09/21 3:00:00     最終結果=0
ClaudeHomeBackup       状態=Enabled   次回=2026/09/21 3:30:00     最終結果=0
ClaudeHookHeartbeat    状態=Enabled   次回=2026/09/21 1:18:02     最終結果=0
ClaudeJamWatch         状態=Enabled   次回=2026/09/21 1:13:45     最終結果=0
ClaudePipeCheck        状態=Enabled   次回=2026/09/21 1:20:15     最終結果=0
ClaudeRevive           状態=Enabled   次回=2026/09/21 1:13:25     最終結果=0
ClaudeSweepChecks      状態=Enabled   次回=2026/09/21 1:31:58     最終結果=0
ClaudeWatchNotify      状態=Enabled   次回=2026/09/21 1:13:58     最終結果=267009（走行中）
ClaudeWeeklyReboot     状態=Disabled  次回=N/A                    最終結果=267011
```

**有効は11件**（点検①が数える基準もこの11件）。**無効は二つ**——`ClaudeWeeklyReboot` と `ClaudeAfterReboot`。

**②は予定表に載っていない。** `schtasks /SC ONLOGON` は**管理者の許しが要り Access denied** だったので、
常駐（`ClaudeInboxWatch.vbs`）と同じ **Startup の置き場**に入れてある。ログオンで走る物はこの二つ。

```
ClaudeAfterLogon.vbs     09-21 00:45   ← 5分待って after-reboot.ps1 -OnLogon
ClaudeInboxWatch.vbs     08-22 19:54   ← 常駐（inbox-watch.ps1）
```

## 実機で見る所

- 次に**落としてから戻ったとき**、ログオンの**5分後**に **「✅ 戻りました（再起動から）」**が iPhone に届く。
- **ふつうのログオン（落としていない回）では何も来ない**。
- 予定表の一覧で **`ClaudeWeeklyReboot` と `ClaudeAfterReboot` だけが Disabled**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **340件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-0115.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0115.md) | 09-21 01:13 | 再起動で切れた二つの直しは**入っている** — 作り値の結果と予定表の写し |
| [`y0921-0110.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0110.md) | 09-21 00:55 | 電源復帰からログオンまでの17.5分 — 自動ログオンは61秒で通っていた。待っていたのは「プロファイルの読み込み16分40秒」 |
| [`y0921-0050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0050.md) | 09-21 00:48 | 再起動で切れた二つを塞いだ／WeeklyReboot と AfterReboot を止めた |
| [`y0921-0030.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0030.md) | 09-21 00:33 | 再起動の稽古の戻り — 26分の穴は「ログオンしていない間、予定表が一つも走らない」 |
| [`y0920-2320-reboot.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2320-reboot.md) | 09-20 23:17 | ③ 再起動の稽古 — 手順と、戻らなかったときの戻し方（再起動の直前に書いた） |
| [`y0920-2315.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2315.md) | 09-20 23:16 | ①done-swept の元を塞いだ ②ClaudeAfterReboot を作った ④蔵と記録の大きさ ⑤期限の調べ |
| [`y0920-2300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2300.md) | 09-20 22:52 | ①古い並びを掴んだら取り直す（panel v142）／②「続けて」「進めて」は合図として扱う |
| [`y0920-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2100.md) | 09-20 21:02 | pub-late は ok へ戻った／配信の関門を偽の走りで当てた |
| [`y0920-2040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2040.md) | 09-20 20:39 | pub-late（公開が56分遅れ）の元 — 長い回の配信が、古い版を後から上書きしていた |
| [`y0920-2010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2010.md) | 09-20 20:10 | 黄色い行が動かない・猫が走らない — 元を突き止めて三つ直した |
| [`y0920-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1953.md) | 09-20 19:53 | 番号の始末と雲の走りの確かめ（panel v140） |
| [`y0920-2000.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2000.md) | 09-20 19:29 | 「写せます（N件）」の札を公開の並びから外した（丙）／「延びています」の時計は受け取り済み |
| [`y0920-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1945.md) | 09-20 19:20 | 公開側40枚の「写せます（N件）」の札は、パネルで使われているか |
| [`y0920-1930.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1930.md) | 09-20 19:18 | 「延びています」の時計を、宣言のヨシ待ちの間は止めた |
| [`y0920-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1915.md) | 09-20 19:14 | report-latest.md はどこに書いているか／写しを機械の手にした |
| [`y0920-1900-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1900-2.md) | 09-20 19:03 | 同じ字の枠の二度目は、走り直さず一度目の札を出し直す |
| [`y0920-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1900.md) | 09-20 18:50 | 札抜けの直し（甲）— 控えの写しを見張りが持ち、抜けた札を先に一枚立てる |
| [`y0920-1830.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1830.md) | 09-20 18:35 | 16:40:21 の枠（赤い行の直し）に終わりの札が立たなかった訳 |
| [`y0920-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1756.md) | 09-20 17:58 | 赤い行の件（同じ枠の二度目）— **もう直っていて、公開側も戻っている** |
| [`y0920-1710-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710-2.md) | 09-20 17:23 | v1458 「三」の根拠の段へ一文を足した（納品） |

<!-- 控えの一覧 ここまで -->
