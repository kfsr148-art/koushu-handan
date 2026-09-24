# claude の自動更新を止めて落とす直前に更新・電源と容量と鍵の読み（r0924-1234）

**終わり（残り0件）** — 2026-09-24 13:23ごろ（VAIO）。本体には触っていない。窓は落としていない。六は読むだけで、何も直していない。

## 五. 自動更新を止め、落とす直前に一度だけ更新する

### claude-loop.cmd（足した3行・ASCII＋CRLF のまま）
```bat
set "NODE_OPTIONS=--max-old-space-size=1024"
rem   * DISABLE_AUTOUPDATER (2026-09-24): claude does not update itself while the window runs.
rem     daily-reboot.ps1 runs "claude update" once, right before it reboots the machine.
set "DISABLE_AUTOUPDATER=1"
if not defined GUARD set "GUARD=C:\Users\user\.claude\loop-guard.ps1"
```
＊`:loop` より前なので、輪が claude を起こすたびに毎回効く。**いまの窓（8652）は前の環境のまま走っている**ので、効くのは次に立ち直った窓から。

### daily-reboot.ps1（足した所）
- 頭の注釈に `-UpdateCmd <道> … 空なら本物の「claude update」。作り値では偽の綴り（.ps1）を渡す`、param に `[string]$UpdateCmd = ''`
- 「前の測り」の後・「🔁 落とします（定時）」の知らせの前に、次の段を入れた：
```powershell
# ---- claude の更新を一度だけ回す（2026-09-24・自動更新の止め-1）----
$UPD_SEC = 180
$updLine = ''
try {
  …（出し先の一時綴りを作る）
  if ($UpdateCmd) { $up = Start-Process powershell.exe … -File $UpdateCmd }
  else { $up = Start-Process 'C:\Users\user\.local\bin\claude.exe' … -ArgumentList @('update') }
  $null = $up.Handle
  if ($up.WaitForExit($UPD_SEC * 1000)) { $updLine = 'claude update：終了コード ' + $up.ExitCode + '・' + <出力の最後の行> }
  else { try { $up.Kill() } catch { }; $updLine = 'claude update：180秒の上限で切った' }
} catch { $updLine = 'claude update：起こせなかった（…）' }
Note ($updLine …)
```
- 「🔁 落とします（定時）」の本文に `$updLine` の一行を足した
- 落とすと決めた回だけ走る（見送り・打ち止めの回は、この段まで来ない）。更新が落ちても、再起動は止めない

### 作り値（偽の shutdown・偽の update・偽の送り手。本物の reboot.log・claude には触れていない）
| 例 | 呼ばれた物 |
|---|---|
| **落とす回**（三つとも空） | **12:36:19.062 UPDATE → 12:36:19.789 SHUTDOWN**（更新が先）。記録に「claude update：終了コード 0・Claude Code is up to date (fake)（作り値）」、知らせの本文にも同じ一行 |
| **見送る回**（押し残し1） | **何も呼ばれない**（update も shutdown も） |

＊settings.json の `"autoUpdatesChannel": "latest"` はそのまま（更新の出どころの指定で、自動で走るかどうかは DISABLE_AUTOUPDATER が決める）

## 六. 読むだけ（直していない）

| # | 項 | 読んだ値 | 直す要否 |
|---|---|---|---|
| 1 | 電源（AC・バランス） | 眠り **0秒**・休止 **0秒**・画面の消灯 **0秒**（どれも「しない」）。hiberfil.sys なし | **要なし** |
| 2 | 無線の口（Qualcomm Atheros AR9485WB-EG） | 「**電力の節約のために、コンピューターでこのデバイスの電源をオフにできるようにする**」が**有効**（MSPower_DeviceEnable Enable=True・PnPCapabilities=16）。電源計画の無線アダプターの省電力モード（AC）は 0＝最大パフォーマンス | **◆要**（電源の管理で無線が切られうる） |
| 3 | Windows Update | アクティブ時間 **11時〜4時**（自動調整あり＝SmartActiveHoursState 1）。保留の再起動：WU RebootRequired **なし**・CBS RebootPending **なし**・PendingFileRenameOperations は Office の一時綴り3行だけ。最後の起動 09-23 04:33・最後に入った更新 KB5126256（09-09） | **要なし**（03:00 の定時はアクティブ時間の中なので、WU が勝手に落とすこともない） |
| 4 | C: と大きさ | C: 空き **544GB**／670GB。**~/.claude 587MB**（file-history 323MB・transcript-bak 167MB・projects 24MB・.git 8.9MB）。**リポジトリ 508MB**（.git 443MB・reports 3.0MB）。**notices-*.json は直下に5個・git の管理では18個**（13個は消えたが、消したことが commit されていない） | **○小さな要**（容量は十分。notices の消し残し13個の commit と、file-history／transcript-bak の古い物の整理は、いずれ） |
| 5 | gh の鍵 | 鍵は **OAuth（gho_）**。GitHub の返事に期限の見出し（github-authentication-token-expiration）が**無い**＝**期限なし**。scopes は gist・read:org・repo | **要なし**（＊`gh auth status` は60秒で返らなかった。`gh api` と push は通る） |

＊読んでいる途中の注意：Git Bash は `gh api /user` の `/user` を道に書き換える（`C:/Program Files/Git/user`）。`gh api user` と書けば通る。

## 手元で回る段・雲で回る段（作法36）
- 手元：claude-loop（窓・DISABLE_AUTOUPDATER=1）／daily-reboot（03:00・15:00。落とす回だけ claude update を一度）
- 雲：変わりなし

## 触った物
~/.claude/claude-loop.cmd（写し .bak-20260924）・daily-reboot.ps1（.bak-20260924b）・orders-open.tsv・work-note.txt／reports/r0924-1234.md・report-latest.md

## 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **403件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0924-1234.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1234.md) | 09-24 13:23 | claude の自動更新を止めて落とす直前に更新・電源と容量と鍵の読み（r0924-1234） |
| [`r0924-1149.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1149.md) | 09-24 11:54 | 常駐を AboveNormal で立てる・枠の鉤の timeout 60秒・いまのメモリ上位10本（r0924-1149） |
| [`r0924-1117.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1117.md) | 09-24 11:23 | Check-RcDrop の「切れ」を会話の記録で判じる（r0924-1117） |
| [`r0924-1054.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1054.md) | 09-24 11:02 | VAIO に残る Edge・node の確かめを洗って雲へ（r0924-1054） |
| [`cloud-check-fast-20260924-015941.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20260924-015941.md) | 09-24 11:02 | 雲で回した：`check-fast.js` |
| [`r0924-1033.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1033.md) | 09-24 10:35 | 残る y0921-0900 を済へ・ヨシ待ち0件（r0924-1033） |
| [`r0924-1009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1009.md) | 09-24 10:14 | ヨシ待ちの納品済み7件を済へ・残る1件（r0924-1009） |
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

<!-- 控えの一覧 ここまで -->
