# 連携で動いている物の一覧（map-1）

**読むだけ** — 2026-09-28 12:30ごろ（VAIO）。何も触っていない。台本は字を読んだだけで、一本も走らせていない。

＊出どころ … `Get-ScheduledTask`／`Get-ScheduledTaskInfo`（12:20 ごろの値）・`~/.claude/*.ps1|cmd|vbs|js` の頭書きと本文・`~/.claude/settings.json`・Startup の二つの .vbs・リポジトリの `.githooks/pre-push`・`.github/workflows/*.yml`。
＊予定表の子はほぼ全部 **`wscript //B //Nologo run-hidden.vbs powershell.exe -NoProfile -ExecutionPolicy Bypass -File <台本>`** の形（窓を出さず、終わるまで待つ＝IgnoreNew が効く）。下の表では「run-hidden 経由」と書く。
＊合図先の URL・ntfy の話題名・鍵は書かない。

## 1. 予定表（Task Scheduler）

### Claude* の13件（after-reboot.ps1 の点検も「13件」で数えている）

| 名前 | いつ動くか | 何をするか | 何を書くか・誰に知らせるか |
|---|---|---|---|
| ClaudeWatchNotify | 毎2分（Time 20:27:58 起点・PT2M）。**Running**（最終結果 267009＝走行中） | run-hidden 経由で `heavy-gate.ps1 -Run watch-notify.ps1 -EverySec 300 -Tag watch`。重い帯（heavy.txt から30分）では5分より短い呼びを見送り、それ以外は watch-notify.ps1 を回す | watch-state.txt・watch-status.log・watch-notify.log・watch-step*.txt・usage-*.txt／state 系の押し。ntfy（😽終わり・😼ヨシ・🕒延び・🪟 など。詳しくは map-2） |
| ClaudeBoard | 毎10分（00:00 起点）。**Running**（267009） | run-hidden 経由で `board-emit.ps1`。「あなた待ち」と「直近に終わった仕事3件」を組む | リポジトリの board.json（中身が動いた時だけ押す）・board-emit.log。知らせは出さない |
| ClaudeHookHeartbeat | 毎10分（03:18:02 起点） | run-hidden 経由で `heavy-beat.ps1` → `hook-notice.ps1 -Kind heartbeat`。あわせて watch-step-log.txt を外から刈る | hook.log に生存の一行（書けなければ退避先）・watch-step-log.old.txt |
| ClaudePipeCheck | 毎10分（09:50:15 起点） | run-hidden 経由で `pipe-check.ps1`。連携の黙って壊れる所（公開の遅れ20分・state の at 45分・hook の沈黙25分・札の上限・押しの失敗20分 など）を外から見る | pipe-warn.log・pipe-warn.json（公開）。訴えは ntfy へ（🪟 連携に訴えがあります／⏰ まだ続いています／✅ 戻りました。同じ訴えは180分あけて） |
| ClaudeJamWatch | 毎1分（10:09:45 起点） | run-hidden 経由で `jam-watch.ps1`。足跡（watch-step-log.txt）が詰まって見える時だけ、CPU・空き・ディスク・重いプロセスを一枚撮る | jam-snap.log・jam-seen.txt。知らせは出さない |
| ClaudeRevive | 毎1分（19:58:25 起点） | run-hidden 経由で `revive-claude.ps1`。対話の claude.exe が0本のまま2分（$DEAD_MIN）続けば ClaudeCodeAtLogon を叩く。前に起こしてから10分（$GAP_MIN）は叩かない。claude-loop の cmd が生きていれば叩かない | revive.log・ledger-close.ps1 を呼ぶ。ntfy「🪟 窓を起こし直しました（今日N回目）」／「🪟 止まっています（…）」 |
| ClaudeCodeAtLogon | ログオン時（Logon）。ほかに revive-claude・inbox-watch の Restart-Window が `schtasks /Run` で叩く | `cmd /c start "麻雀 攻守判断 (Claude Code)" /MAX /D <リポジトリ> cmd.exe /k claude-loop.cmd`（4節） | 窓を一つ立てる。書くのは claude-loop 側 |
| ClaudeDailyReboot | 毎日 03:00・15:00、そこから30分ごとに1時間30分（03:00／03:30／04:00／04:30） | run-hidden 経由で `daily-reboot.ps1`（4節） | reboot.log。ntfy「🔁 落とします（定時）」→ `shutdown /r /t 60` |
| ClaudeAfterReboot | 毎日 03:10・15:10 | run-hidden 経由で `after-reboot.ps1`（引数なし）。予定表 Claude* 13件の結果・見張りの生存（watch-status.log 5分以内）・ntfy の応答・公開側の二つを点検 | after-reboot.log。ntfy「✅ 再起動の後の点検（返事不要）」／欠けがあれば「🪟 異常です：再起動の後の点検」。最終結果は 1（09-27 15:10） |
| ClaudeDailyNotice | 毎日 09:00・21:00 | run-hidden 経由で `daily-notice.ps1`。状態・台帳の残り・見張り四つの生死・使用量を本文ごと一発 | daily-notice.log・notify-record 経由で status.md／notices.json。ntfy（本文つき）。**来ない日は仕組みが止まった合図** |
| ClaudeEdgeSweep | 毎日 03:00 | run-hidden 経由で `edge-sweep.ps1`。msedge と SearchApp が居れば落とす（claude・powershell・explorer には触らない） | edge-sweep.log（本数と MB。居なければ「居ない」）。知らせは出さない |
| ClaudeHomeBackup | 毎日 03:30 | run-hidden 経由で `home-backup.ps1`。~/.claude を非公開の控えリポジトリ（枝 master）へ一日一回押す | home-backup-last.txt（日付）。知らせは出さない。**最終結果 0x800705AA（資源不足）・09-27 03:30**。09-28 03:30 は回っていない（次は 09-29 03:30） |
| ClaudeSweepChecks | 毎20分（18:31:58 起点）。**Disabled**（最後は 09-21 22:31） | run-hidden 経由で `sweep-checks.ps1`（置き去りの headless Edge を片付ける）。同じ仕事は常駐の Sweep-Stale が持つ | sweep-checks.log |

＊予定表に**無い**もの … `ClaudeWeeklyReboot`（weekly-reboot.ps1・土 01:00）と `ClaudeWifiSwap`（wifi-swap.ps1・毎分）。台本は残っているが、起こす仕事が無いので動いていない。

### 連携に絡むほかの仕事

| 名前 | いつ動くか | 何をするか | 何を書くか・誰に知らせるか |
|---|---|---|---|
| \Microsoft\Windows\Windows Defender\Windows Defender Cache Maintenance | **刻の引き金なし・保守の一部として走る**（09-27 20:07 に tasks-to-0320.ps1 で 03:20 へ寄せたが、09-28 の朝には Defender が元の形へ戻していた。09-28 03:20 には走っていない・前回 09-27 22:59） | `MpCmdRun.exe -IdleTask -TaskName WdCacheMaintenance`（SYSTEM） | 連携へは書かない。前は 23時台に立ち、見張りの止まりと重なった |
| \Microsoft\Windows\DiskCleanup\SilentCleanup | 毎日 03:20（同上で寄せた） | `cleanmgr.exe /autoclean /d %systemdrive%` | 同上。最後は 09-28 03:53 |
| \Microsoft\Windows\Defrag\ScheduledDefrag | 毎日 03:20（09-27 20:07 に足して寄せた） | `defrag.exe -c -h -o -$`（SYSTEM）。09-27 01:06〜01:50 に走り見張りごと固まったので寄せた | 同上 |
| \MicrosoftEdgeUpdateTaskMachineUA | 毎日 03:20（寄せた後の XML の写しから。**予定表からは読めなかった**＝SYSTEM の仕事で「アクセスが拒否」） | `MicrosoftEdgeUpdate.exe /ua /installsource scheduler`（SYSTEM）。前は毎時 :16 | 写しは ~/.claude/tasks-bak-20260927/ |
| \GoogleSystem\GoogleUpdater\GoogleUpdaterTaskSystem152.0.7933.0{…} | 古い 152 の仕事は毎日 03:20（同上・**予定表からは読めなかった**）。**09-28 に 156.0.8067 へ上がり、新しい仕事（GoogleUpdaterTaskSystem156.0.8067…）が毎時 :27 に走っている**（TaskScheduler の記録 03:27〜09:27） | `updater.exe --wake --system`（SYSTEM）。前は毎時 :17 | 同上 |
| \User_Feed_Synchronization-{E9B001EE-…} | 毎日 06:05。**Disabled**（09-27 00:2x に止めた） | `msfeedssync.exe sync`。取りこぼしが夜に回り、見張りの止まりと重なっていた | 戻し方は reports/r0927-0023.md |
| \Adobe Acrobat Update Task | ログオン＋12分後から3時間30分ごと・毎日 01:00 | `AdobeARM.exe` | 連携へは書かない。夜の重なりの候補として並べるだけ |
| \GoogleUserPEH\RunPlatformExperienceHelper_Daily／_Metrics | 毎日 18:32／一度きり。**どちらも Disabled** | Google の補助 | 動いていない |

＊寄せた四つ（＋ Defrag）は `tasks-to-0320.ps1`（管理者で 09-27 19:45 と 20:07 に走った。記録は tasks-bak-20260927/result.txt）。同じ回に仮想メモリを自動管理へ戻している。

## 2. 常駐（inbox-watch.ps1）と起動時の二つ

| 名前 | いつ動くか | 何をするか | 何を書くか・誰に知らせるか |
|---|---|---|---|
| Startup\ClaudeInboxWatch.vbs | ログオン時 | `powershell -File inbox-watch.ps1` を窓なしで起こす（待たない） | 起きた常駐は、先に走っていた同じ常駐（`-File …inbox-watch.ps1` で終わる物）を止め、inbox-watch.log に一行 |
| Startup\ClaudeAfterLogon.vbs | ログオン時＋5分待つ | `after-reboot.ps1 -OnLogon`。直前の落とし（id=1074）が30分以内の時だけ点検 | ntfy「✅ 戻りました（再起動から）」／欠けがあれば「🪟 異常です」。ふつうのログオンは黙る |

**inbox-watch.ps1**（2265行・優先度 AboveNormal で立つ）。巡回は **15秒**（$WAIT_SEC）。立ち上がりに git-push.ps1 と mem-orphan.ps1 を読み込む。巡回の中身を順に。

| 名前 | いつ動くか | 何を見るか・敷居 | 何を書くか・誰に知らせるか |
|---|---|---|---|
| Check-Frames | 毎巡（frames-in.jsonl の大きさが変わった回だけ捌く） | 鉤（frame-in.ps1）が積んだ枠を `frame-work.ps1` で捌く。hook-inflight\<pid>.txt が20秒を過ぎて残っていれば鉤の時間切れとみなす | frame-work 側が台帳・件名・last-order.txt など。時間切れは hook-timeout.log へ一行 |
| Publish-Status | 毎巡 | いまの様子を組む。押しは前から180秒あける・中身が同じなら押さない・ただし25分（$PUSH_ALIVE_SEC）黙れば押す | リポジトリの state.json を押す（「state.json：いまの様子を更新」）。inbox-watch.log |
| Sweep-Stale | 8巡に一度（2分） | koushu- の --user-data-dir を持つ headless Edge で、起動から20分超の物を落とす | inbox-watch.log「置き去りの検査を N 本片付けた」 |
| Sweep-Orphans（mem-orphan.ps1） | 8巡に一度（2分） | 親の居ない（生まれて90秒超）か、20分を超えて CPU が増えない gh・git を落とす | pipe-warn.log へ一行（空きの前後つき） |
| Check-FreeMem（mem-orphan.ps1） | 4巡に一度（1分） | 空き物理メモリが 300MB を割ったら一発。400MB へ戻るまで黙る | ntfy「🪟 異常です（空きメモリが NMB）」 |
| Pull-Mailbox | 12巡に一度（3分） | 私有リポジトリの mailbox.md を API で読み、増えた行を受信箱へ。同じ印の二度目は入れない。「鍵:ESC」の一行は send-esc.ps1 で窓へ Esc を一つ | inbox.txt に「[ ] 刻 （郵便受け）本文」・mailbox-pos.txt・取り込み済みの行は mailbox-archive.md へ移す |
| Check-Todo（→ Wake-Claude） | 毎巡 | inbox.txt の「[ ]」の数が増えたら働き手を起こす旗を立てる。鍵が run: の間・働き手が走っている間は起こさない | `claude -p`（仕事名 claude-worker）を背後で起こす。worker.log／worker.err |
| Check-UsageHold | Wake-Claude の入口で | usage-good.json のどれかが100%なら枠を取らずに手待ち。戻りの刻を過ぎれば取り直す | usage-hold.txt。ntfy「🪟 使用量の上限で手待ち（戻り HH:MM）」を同じ上限で一度 |
| Check-WatchStale | 4巡に一度（1分） | watch-status.log の最後が10分以上古い。5分（起動20分以内は3分）を超えて生きている watch-notify は落とす | watch-stale-seen.txt（一日一回）。ntfy「🪟 見張りが止まっています（最後の記録 HH:MM・N分前）」 |
| Check-ClaudeFrozen | 4巡に一度（1分） | 走っている枠があり（鍵 run:＋台帳の未了）、hook.log（と窓の出し）が10分止まり、CPU 時間も10分増えていない。機械の起動15分未満は見ない | claude を落とし、claude-loop が居なければ ClaudeCodeAtLogon を叩く。claude-frozen.txt。ntfy「🪟 窓を起こし直しました（固まり）」 |
| Check-ClaudeHeavy | 毎巡 | 手待ち（台帳の未了0・ヨシ待ち0・run: でない）で claude の私用メモリが **1500MB** 超（09-27 に 900→1500） | send-text.ps1 で窓へ `/clear`。claude-heavy.txt。ntfy「🪟 控えを畳みました（重さ NMB）」（敷居を下回るまで一度） |
| Check-RcDrop | 毎巡 | 会話の綴りの最後の遠隔の行（type system）が「Remote Control disconnected」か「/rc failed」。同じ行には10分あける | send-text.ps1 で窓へ `/remote-control`。rc-seen.txt。ntfy「🪟 遠隔を繋ぎ直しました」 |
| Check-NewLine | 毎巡 | 対話の claude の pid か遠隔の宛先（sessions/<pid>.json の bridgeSessionId）が替わった。立ち直りの回は --resume が効いたかも判じ、効かなければ claude-loop.cmd の `%RESUME%` を外す | newline-sent.txt・resume-reverted.txt。ntfy「🔗 新しい線」（宛先を押し先に付けて） |
| Set-Priorities | 毎巡 | claude は AboveNormal、run-hidden の子と常駐は BelowNormal へ当て直す | 書かない・鳴らさない |
| Ping-Ashiato | 毎巡 | hook.log が前に打った刻より新しく書かれていたら外の見張り（healthchecks.io・10分＋猶予10分）へ合図。合図先は hc-ashiato.txt | 外の見張りが途切れを知らせる（こちらの ntfy は通らない） |
| Check-ClearNote | 毎巡 | 手待ちで、いまの会話の綴り（jsonl）が **15MB** 超 | 窓へ `/clear`。clear-sent.txt。ntfy「🪟 控えを畳みました（NMB）」 |
| Check-FrameLimit | 毎巡（見るのは一分に一度） | 鍵が run: の枠が **8分**を超えた（空きは見ない） | claude の子（powershell・node・git・gh）を落とし、窓へ Esc。台帳の未了の行へ「時間切れ（N分・再挑戦 n/3）」。frame-cut.txt・frame-cut-hash.tsv（48時間）。ntfy「🪟 時間切れ（再挑戦 n/3）」（枠の字の先頭200字つき）。受信箱へは戻さない |
| Ping-Outside | 巡回の末尾・55秒に一度 | 外の見張り（healthchecks.io）へ生存の合図。claude.exe が0本なら /fail を付けて打つ | hc-ping.log（3000行を超えたら後ろ1440行） |

＊頭書きの「15秒おきに返信話題（ntfy）を見る」は古い。ntfy の購読は 08-26 に畳み、いまの受け口は郵便受け（Pull-Mailbox）。
＊read-screen.ps1 は本文から呼ばれていない（09-24 に Get-RcState へ替えた）。

## 3. 鉤（~/.claude/settings.json の hooks）

どれも `powershell.exe -NoProfile -ExecutionPolicy Bypass -File <台本>`。matcher は PreToolUse／PostToolUse だけ（`Bash|PowerShell`）。リポジトリ側の `.claude/settings.json`・`settings.local.json` に鉤は無い（permissions だけ）。

| 名前 | いつ動くか | 何をするか | 何を書くか・誰に知らせるか |
|---|---|---|---|
| SessionStart → inbox-feed.ps1 -Kind read | 窓（会話）が立つ時。timeout 15・同期 | 受信箱の未処理を標準出力へ出す＝文脈へ入る | 書かない |
| SessionStart → hook-notice.ps1 **-Kind session** | 同上。timeout 45・async | **2026-09-28 に resume から替えた**。hook.log に「session」と書くだけで、開始の時計も鍵の run: も立てない | hook.log（見張りは session の行を読み飛ばす） |
| UserPromptSubmit → frame-in.ps1 | 枠が届くたび。timeout 60・同期 | 届いた枠を frames-in.jsonl へ一行足すだけ（捌きは常駐の Check-Frames） | frames-in.jsonl・hook-inflight\<pid>.txt（始めに置き終わりに消す） |
| UserPromptSubmit → hook-notice.ps1 -Kind resume | 同上。timeout 45・async | 題の印を外し、控えの「開始:」を刻む。hook.log の resume で見張りの鍵が run: になる | hook.log・work-note.txt の開始 |
| Stop → stop-guard.ps1 | 止まる時。timeout 15・同期 | work-note.txt に「待ち:」も「完了:」も無ければ終了コード2で差し戻す | 書かない（差し戻しの字だけ） |
| Stop → inbox-feed.ps1 -Kind stop | 同上。timeout 15・同期 | 受信箱に未処理が残っていれば一度だけ差し戻す（stop_hook_active なら通す） | 書かない |
| Stop → hook-notice.ps1 -Kind stop | 同上。timeout 45・async | 題に「●終わり」、hook.log に stop | hook.log。これを見張り（watch-notify）が読んで 😽 などを出す |
| Notification → hook-notice.ps1 -Kind notification | 入力待ち・権限待ち。timeout 45・async | 題に「★待ち」 | hook.log |
| PreToolUse（Bash\|PowerShell）→ tool-mark.ps1 -Kind pre | 命令の前。timeout 60・async | 「刻 PreToolUse Bash id=… 命令の頭60字」 | hook.log。cmd-watch.ps1 が組にして数える |
| PostToolUse（Bash\|PowerShell）→ tool-mark.ps1 -Kind post | 命令の後。timeout 60・async | 同じ形で PostToolUse | hook.log |

＊ほかの設定 … `remoteControlAtStartup: true`・`autoUpdatesChannel: latest`・env `CLAUDE_CODE_DISABLE_NOTIFICATION_PRESENCE_CHECK=1`／`CLAUDE_CODE_DISABLE_TERMINAL_TITLE=1`。

## 4. claude-loop と起こす道

| 名前 | いつ動くか | 何をするか | 何を書くか・誰に知らせるか |
|---|---|---|---|
| claude-loop.cmd | ClaudeCodeAtLogon の窓の中でずっと | `NODE_OPTIONS=--max-old-space-size=2048`（09-27 に 1024→2048）・`DISABLE_AUTOUPDATER=1`。pick-resume の一行を `%RESUME%` に入れ、`claude %RESUME% --permission-mode auto --remote-control koushu-handan`。終わるたび loop-guard を呼び、10秒待って同じ窓で立て直す | 窓に `[claude-loop] restarting …`。終了コード2で輪を抜ける |
| pick-resume.ps1 | claude-loop が claude を起こす前に毎回 | bridge-session の行を持ついちばん新しい綴りの「--resume <番号>」を一行出す。綴りが20MB超なら何も出さない（新しい会話で立つ）。--continue は使わない | pick-resume.log |
| loop-guard.ps1 | claude が終わるたび | 一時間に5回までは黙って立て直す。6回目で終了コード2 | claude-loop-<tag>.txt・claude-loop.log。ntfy「🪟 異常です（起動が続けて落ちる）」 |
| ClaudeCodeAtLogon（予定表） | ログオン時／revive-claude・Restart-Window が叩く | 題「麻雀 攻守判断 (Claude Code)」・/MAX・リポジトリで claude-loop.cmd を開く（題を変えると console-koushu.reg の字が効かない） | — |
| revive-claude.ps1（ClaudeRevive） | 毎分 | 1節のとおり。輪の cmd が子なし（打ち止め）ならその窓を閉じてから叩く | revive.log・ledger-close.ps1。ntfy 🪟 |
| daily-reboot.ps1（ClaudeDailyReboot） | 03:00・15:00 から30分ごと4回 | 台帳の未了0・走っている道具なし（node の検査・koushu- の Edge・hook.log の最後が stop）・押し残し0 を見て、揃わなければ見送る（三度まで。四回目も残れば次の定時へ）。落とす前に **`claude update`（上限180秒）** を一度回す | reboot.log（見送りも一行）。ntfy「🔁 落とします（定時）」→ shutdown /r /t 60。戻りは ClaudeAfterLogon.vbs が言う |
| unused/rc-restart.ps1 | **~/.claude/unused/ へ移した（09-28・消していない）**。09-12 から使っていない（呼ぶ者なし） | 遠隔の橋が切れた窓を閉じ、WMI から起こし直す | rc-restart.log。ntfy 🪟 |
| unused/window-restart.ps1 | **~/.claude/unused/ へ移した（09-28・消していない）**。09-12 から使っていない | 窓を閉じ、窓を見やすく-1 の形で起こし直して実測を札へ | window-restart.log |

＊revive-test.ps1 も一回きりの試し（09-11）で、呼ぶ者なし。5節に置いた。

## 5. 台本の一覧（~/.claude 直下・*.bak* を除く。上の節で済んだ物は「→n節」）

| 名前 | いつ動くか（誰が呼ぶか） | 何をするか | 何を書くか・誰に知らせるか |
|---|---|---|---|
| after-reboot.ps1 | ClaudeAfterReboot・ClaudeAfterLogon.vbs（-OnLogon）→1・2節 | 再起動の後の四つの点検 | after-reboot.log・ntfy ✅／🪟 |
| board-emit.ps1 | ClaudeBoard →1節 | 板の値 | board.json |
| cmd-watch.ps1 | watch-notify.ps1 が毎回 | PreToolUse／PostToolUse を id で組にし、終わっていない命令の経過を見る。上限は直近の Bash の所要の中央値×倍率（床あり） | cmd-watch.log・cmd-watch-seen.txt。ntfy「⏳ 命令が長く回っています（N分）」 |
| daily-notice.ps1 | ClaudeDailyNotice →1節 | 定時の報せ | ntfy（本文つき） |
| edge-sweep.ps1 | ClaudeEdgeSweep →1節 | Edge・SearchApp を落とす | edge-sweep.log |
| enable-tasklog.ps1 | 手で・管理者 | 予定表の動作記録を有効にし、三通りで読み返す | 画面に出すだけ |
| frame-in.ps1 | 鉤 UserPromptSubmit →3節 | 枠を一行積む | frames-in.jsonl |
| frame-work.ps1 | 常駐の Check-Frames | 枠の種類（order・yoshi・cmd・fragment）・仕事名・全文の控え・件名・台帳の開き・ヨシの返事で待ちを畳む。同じ全文が10分以内に二度なら捨てる | orders-full.jsonl・orders-open.tsv・last-order.txt・work-note.txt・work-started.txt・frames-pos.txt・frames-hash.tsv。「次の枠は無い」の札 |
| git-push.ps1 | 読み込み（watch-notify・inbox-watch・notify-record・board-emit・home-backup・ntfy-say・pipe-check・push-retry ほか） | 押し出しの共通の手。名前つきの錠で一人ずつ・時間の上限・空き不足なら見送り | git-push.log・push-trace.tsv・push-pending.tsv |
| heavy-beat.ps1 | ClaudeHookHeartbeat →1節 | 生存の行 | hook.log |
| heavy-gate.ps1 | ClaudeWatchNotify →1節 | 重い帯で見張りを間引く | 足跡に見送りを残す。見送る回も「走り出した」を鍵へ（😸 走り出したにゃ の題を組む枝あり） |
| heavy-life.ps1 | heavy-on.ps1 が起こす | 重い帯の間、予定表を通さず生存の行を一定の間隔で書く。帯が消えれば終わる | hook.log |
| heavy-off.ps1 | 手で（重い仕事の後）・watch-notify（居座った帯を下ろす） | heavy.txt を消す。消せなければ刻を古くして効力だけ切る | heavy.txt |
| heavy-on.ps1 | 手で（重い仕事の前） | heavy.txt に刻（30分で自動に切れる）。heavy-life を起こす | heavy.txt |
| heavy-push.ps1 | heavy-on／heavy-off・git-push | 重い帯の間も押しだけは通す | 押し |
| home-backup.ps1 | ClaudeHomeBackup →1節 | ~/.claude の控えを押す | home-backup-last.txt |
| hook-notice.ps1 | 鉤（session・resume・stop・notification）・heavy-beat／heavy-life（heartbeat）→3節 | 題の印と hook.log | hook.log・hook-fallback.log（退避先）・hook-check.log |
| inbox-feed.ps1 | 鉤（SessionStart -Kind read・Stop -Kind stop）→3節 | 受信箱の未処理を文脈へ／差し戻し | 書かない |
| inbox-watch.ps1 | ClaudeInboxWatch.vbs →2節 | 常駐 | 2節 |
| jam-watch.ps1 | ClaudeJamWatch →1節 | 詰まりの現場を撮る | jam-snap.log |
| kagi-watch.ps1 | watch-notify.ps1 が毎回 | いちばん新しい会話の綴りの末尾に「authentication_failed」が最後のふつうの返事より後ろにあれば鍵切れ | ntfy「🪟 鍵が切れています。黒い窓で /login」 |
| ledger-close.ps1 | revive-claude.ps1（窓を起こし直す前） | いまの仕事の台帳の行を済にする | orders-open.tsv・ledger-close.log |
| ledger-pickup.ps1 | watch-notify.ps1 | 起き直った窓が閉じ損ねた台帳の行を拾い直す | orders-open.tsv・ledger-pickup.log・ledger-pickup-seen.txt |
| mem-orphan.ps1 | inbox-watch.ps1 が読み込む →2節 | Sweep-Orphans・Check-FreeMem | pipe-warn.log・ntfy 🪟 |
| mix18.js | 手で（09-18 の較正の台・読むだけ） | 八人の重みを最小二乗で決める測り | 画面に出すだけ。連携では動かない |
| mode-check.ps1 | 手で（09-23・見るだけ） | 立った窓の綴りの先頭の permissionMode を読む | mode-check.txt・ntfy 一通 |
| notify-record.ps1 | ntfy-say・watch-notify・daily-notice・pipe-check・inbox-watch | 送った知らせを控え、status.md（直近20件）・notices.json・報告書の「送った知らせ」の節へ写す。話題名は書かない | notify-sent.tsv・status.md・notices.json・report-latest.md の末尾 |
| ntfy-budget.ps1 | ntfy-say・watch-notify | 異常・延びは一日合わせて8件まで（上限20件のうち）。残りはヨシに取っておく | ntfy-budget.tsv |
| ntfy-record-sent.ps1 | ntfy-say・watch-notify | 送れた本文を公開側へ控える（書く手はここ一つ） | ntfy-latest.txt・ntfy-sent.json |
| ntfy-say.ps1 | 🪟 などを鳴らす台本ほぼ全部 | 知らせは短い題だけ一通、全文は返事パネルの札 | ntfy・notices.json（札）・ntfy-count.txt／ntfy-daily.tsv |
| pipe-check.ps1 | ClaudePipeCheck →1節 | 連携の弱い所の見張り | pipe-warn.log／.json・ntfy |
| push-measure.ps1 | 手で（08-30 の測り・一回きり） | 😽 が届いた時点の数を測る | push-measure.txt |
| push-mine.ps1 | 手で（Claude が押すとき。git-push と同じ錠を通す） | 手押しを錠の中で | git-push.log |
| push-retry.ps1 | watch-notify.ps1・git-push | 空き不足で見送った押しを、空いた回に押し直す | push-retry.log・push-retry-count.log。三回続けて空きを待てなければ ntfy「🪟 異常です（押し直しが三回続けて空きを待てません：…）」 |
| quick-measure.ps1 | 手で（08-30 の測り・一回きり） | 釦が開いてから押し送りが出るまでを測る | quick-measure.txt |
| unused/read-screen.ps1 | **~/.claude/unused/ へ移した（09-28・消していない）**。呼ぶ者なし（09-24 まで inbox-watch） | 窓の見えている字を読む（入力はしない） | 書かない |
| restore-two-services.cmd | 手で・管理者 | WSearch・VCService を 09-18 の控えどおりへ戻す | — |
| run-hidden.vbs | 予定表の Claude* 12件（CodeAtLogon を除く全部。うち SweepChecks は止まっている） | 窓を出さずに起こし、終わるまで待つ | 書かない |
| send-esc.ps1 | inbox-watch（鍵:ESC・Check-FrameLimit） | 窓の入力口へ Esc を一つ（前面に出さない） | 書かない |
| send-text.ps1 | inbox-watch（Check-ClaudeHeavy・Check-ClearNote・Check-RcDrop） | 窓の入力口へ一行打って Enter | 書かない |
| stop-guard.ps1 | 鉤 Stop →3節 | 控えが無ければ差し戻す | 書かない |
| stop-two-services.cmd | 手で・管理者（09-18） | WSearch と VCService を止めて起動でも上がらないようにする | service-before-20260918.txt |
| subject.ps1 | frame-work・inbox-feed・inbox-watch | 枠から件名を作る（二箇所の作りを一つへ） | 書かない |
| sweep-checks.ps1 | ClaudeSweepChecks（**Disabled**）→1節 | 置き去りの検査の片付け | sweep-checks.log |
| tasks-to-0320.ps1 | 手で・管理者（09-27 に二度走った） | 夜の保守の仕事を 03:20 に寄せる →1節 | tasks-bak-20260927/ |
| tool-mark.ps1 | 鉤 PreToolUse／PostToolUse →3節 | 命令の始まりと終わり | hook.log |
| watch-notify.ps1 | ClaudeWatchNotify（heavy-gate 経由）→1節 | 主の見張り（3668行）。プロセスと窓・hook.log の生存・控えの待ち・終わりの札・ヨシの出し直し（5分おき・上限12回）・見込み超え・使用量の公開（10分ごと）と敷居・claude の版（一日一度）・外の見張り（hc-watch.txt）。呼ぶ子に cmd-watch・kagi-watch・ledger-pickup・push-retry・weekly-reboot-after・heavy-off | watch-state.txt ほか（1節）。ntfy の知らせの大半はここから（map-2） |
| unused/weekly-reboot.ps1 | **~/.claude/unused/ へ移した（09-28・消していない）**。ClaudeWeeklyReboot が予定表に無い（weekly-reboot-after.ps1 は使っているので残した） | 土 01:00 の再起動（押し残し0・仕事なしの時だけ） | reboot-pending.txt |
| weekly-reboot-after.ps1 | watch-notify（reboot-pending.txt がある時だけ） | 起き上がった後の測りを札に書く | 札・印を消す |
| unused/wifi-swap.ps1 | **~/.claude/unused/ へ移した（09-28・消していない）**。ClaudeWifiSwap が予定表に無い | 有線が繋がれば無線を切る（09-12 の 0x4A の切り分け） | — |
| revive-test.ps1 | **呼ぶ者なし**（09-11 の一回きりの試し） | 窓を閉じて十分以内に戻るかを試す | revive-test.txt |

### リポジトリ側（koushu-handan）

| 名前 | いつ動くか | 何をするか | 何を書くか・誰に知らせるか |
|---|---|---|---|
| reports-index.js | 手で（報告のたび・作法33）／weekly-reboot.ps1 の本文にも出る | reports/ の控えの一覧（新しい順20件）を組み、report-latest.md の末尾の印の間へ貼り直す | report-latest.md |
| .githooks/pre-push | git push の前（core.hooksPath＝.githooks を確かめた） | 構文検査だけ。本体の `<script>` とリポジトリ直下の .js を node --check（頭に await がある物は .mjs で見直す）。Edge は立てない | 落ちれば push を止める |
| .github/workflows/check.yml（雲） | main への push・手で | 三段。scope（何が変わったか）→ check（**本体の回だけ**。check-all --fast → check-all・widget-check・panel-check）→ deploy（Pages）。控えの回（state.json・notices.json・board.json など）は検査に掛けず配信 | 落ちれば配信が止まる |
| .github/workflows/job.yml（雲） | main への push で scratchpad/jobs/*.js／*.ps1・panel.html・本体と検査の台本が変わった時・手で | 重い仕事を雲で回す。変わった台本だけ回し（本体が変われば check-fast.js、パネルなら panel-check.js） | reports/cloud-<台本>-<刻>.md を書いて押し戻す |

＊ほかの workflows … battle.yml（毎日 cron `0 17 * * *`＝JST 02:00・較正の対局）・mitate-fold.yml／mitate-kazoe.yml／neko.yml（手でだけ）。連携の知らせには関わらない。

## 読めなかった物
- **MicrosoftEdgeUpdateTaskMachineUA・GoogleUpdaterTaskSystem** … `Get-ScheduledTask` に出ず、`schtasks /query /tn` は「アクセスが拒否」（SYSTEM の仕事・管理者が要る）。引き金と中身は 09-27 に管理者で取った写し（~/.claude/tasks-bak-20260927/*.new.xml）から書いた。
- **Windows Defender Cache Maintenance** の引き金 … `Get-ScheduledTask` では**無し**・保守の設定は**有り**（09-28 の読み）。09-27 に寄せた 03:20 は、Defender が元へ戻した（09-28 に確かめた。r0928-0950）。
- 表の「最後・次」の刻は 12:20 ごろに読んだ値。
