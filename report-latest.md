# 再起動で切れた二つを塞いだ／WeeklyReboot と AfterReboot を止めた

**終わり（残り0件）** — 2026-09-21 00:50（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## ① 居座りは「常駐が起動後の間だけ3分で落とす」形にした（乙）

**採った理由（甲を採らなかった訳）** … 09-20 の居座り（pid 6772）は**記録を一行も書いていない**。
つまり**入口の段へ入る前に詰まっていた**ので、**watch-notify 自身に上限を置く形（甲）は届かない**。
外から見て落とす常駐の手（乙）なら、どこで詰まっても効く。直しも3行で済む。

**中身** … `inbox-watch.ps1` の居座り落としの敷居を、**起動から20分の間だけ 5分→3分**にした。
20分を過ぎれば今までどおり5分（重い回＝押し・検査を途中で殺さないため）。

```
$stuckMin = 5
try {
  $upMin = ((Get-Date) - (Get-CimInstance Win32_OperatingSystem -ErrorAction Stop).LastBootUpTime).TotalMinutes
  if ($upMin -lt 20) { $stuckMin = 3 }
} catch { }
```

**作り値**（本物の字を切り出し、起動の刻だけ偽って回した）

| 起動からの経過 | 敷居 |
|---|---|
| 2分／6分／19分 | **3分** |
| 21分／300分 | 5分（今までどおり） |

＊09-20 の回に当てると、居座りは **23:43 台**に落ちる（実際は 23:45:29 だった）。**約2分の短縮**。
＊写し `inbox-watch.ps1.bak-20260921`・構文NG 0・**常駐は 00:44:14 に起こし直し済み**（台本 00:43:56 より新しい）。

## ② ログオンのたびに点検し、落とし直後なら「戻りました」を出す

**中身** … `after-reboot.ps1` に **`-OnLogon`** を足した。**直前の落とし（システムの記録 id=1074）が
30分以内のときだけ**四つを点検して札を立て、ふつうのログオンは**黙って返る**（記録に一行だけ残す）。
四つが全部○なら題は **「✅ 戻りました（再起動から）」**、欠けがあれば今までどおり **「🪟 異常です」**。

**作り値**（本物の台本の写しを、**偽の送り手**に差し替えて回した。本物の ntfy・押しは叩いていない）

| 形 | 札 | 題と中身 |
|---|---|---|
| **イ 落とし直後のログオン（8分前）** | **あり** | **✅ 戻りました（再起動から）**／① 予定 11件・最終結果は全て良い ② 見張りの生存 1分前 ③ ntfy HTTP 200 ④ notices.json 00:35:07・panel-ver 142／「四つとも○。戻っている。」 |
| **ロ ふつうのログオン（400分前）** | **なし** | 「直前の落としが 400分前なので、札は立てない」（記録に一行だけ） |
| ハ 落とし直後だが ntfy が 503 | あり | **🪟 異常です：再起動の後の点検** |

**走らせ方は Startup の置き場にした。** 予定表の「ログオン時」は**作るのに管理者の許しが要り**
（`schtasks /SC ONLOGON` が **Access denied**）、常駐（`ClaudeInboxWatch.vbs`）と同じ
**Startup の vbs** なら許し無しで同じ刻に走る。

```
C:\Users\user\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\ClaudeAfterLogon.vbs
  → 5分待ってから powershell -File after-reboot.ps1 -OnLogon（窓は出さない）
```

＊**5分待つ**のは、ログオン直後は機械が混んでいて見張りの生存も公開の刻もまだ動かないため。
＊**数えるのは有効な予定だけ**に変えた（下の③で二つ止めたので、**11件**が基準）。
　無効の二つも数に入れると、止めたことに気づけなくなる。

## ③ WeeklyReboot と AfterReboot を止めた（schtasks の写し）

```
--- ClaudeWeeklyReboot ---
TaskName:                             \ClaudeWeeklyReboot
Next Run Time:                        N/A
Last Run Time:                        1999/11/30 0:00:00
Last Result:                          267011
Task To Run:                          C:\WINDOWS\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile
                                      -ExecutionPolicy Bypass -WindowStyle Hidden
                                      -File "C:\Users\user\.claude\weekly-reboot.ps1"
Scheduled Task State:                 Disabled
Schedule Type:                        Weekly     Start Time: 1:00:00     Days: SAT

--- ClaudeAfterReboot ---
TaskName:                             \ClaudeAfterReboot
Next Run Time:                        N/A
Last Run Time:                        1999/11/30 0:00:00
Last Result:                          267011
Task To Run:                          powershell.exe -NoProfile -ExecutionPolicy Bypass
                                      -File C:\Users\user\.claude\after-reboot.ps1
Scheduled Task State:                 Disabled
Schedule Type:                        Weekly     Start Time: 1:10:00     Days: SAT
```

＊**どちらも `Next Run Time: N/A`**。週の自動再起動はもう起きない。
＊`after-reboot.ps1` そのものは消していない——**ログオンの枝（②）が同じ台本を使う**ため。
＊手で通し点検したいときは `powershell -File after-reboot.ps1 -Dry` で四つを見られる。

## 実機で見る所

- 次にログオンしたとき、**落とし直後なら5分後に「✅ 戻りました（再起動から）」**が iPhone に届く。
- **ふつうのログオン（落としていない回）では何も来ない**。
- 予定表に **`ClaudeWeeklyReboot` と `ClaudeAfterReboot` が Disabled** で並んでいる。

## 触った所と触らない所

**触った所** … `~/.claude/inbox-watch.ps1`（写し `.bak-20260921`・常駐起こし直し済み）／
`~/.claude/after-reboot.ps1`／Startup の `ClaudeAfterLogon.vbs`（新）／予定表の二つを無効化。
**触らない所** … `koushu-handan.html`・`stable`・`panel.html`・`watch-notify.ps1`・押し送りの道。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **338件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1710.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710.md) | 09-20 17:00 | 【宣言】「三」の根拠の段の末尾へ一文を足す（v1458） |
| [`y0920-1640.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1640.md) | 09-20 16:59 | 赤い行「知らせの道が落ちています」が消えなかった元と直し（panel v139） |

<!-- 控えの一覧 ここまで -->
