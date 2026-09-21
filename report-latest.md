# 二件の取り下げと、走りかけの子 125本の片付け

**終わり（残り1件）** — 2026-09-21 15:53（VAIO）。`koushu-handan.html`・`stable` には触っていない。

> **片付けの途中で、予想していなかった物が出た。**
> 走りかけの子は「残っていた」どころではなく、**113本たまって機械を食い潰していた**。
> 空きは 13:20 の **1,038MB** から 15:50 には **391MB** まで落ちていた。

---

## 1. 取り下げ（指示どおり二件）

| 台帳の行 | 前 | 後 |
|---|---|---|
| `2026-09-21 13:14:43` 乱れの時系列 | 未了：受領 | **済（取り下げ）** |
| `2026-09-21 13:21:13` 網の切れとの突き合わせ | 未了：受領 | **済（取り下げ）** |

＊**札そのものは書き上げてある。** `reports/y0921-1335.md` に、乱れ10件（元／手当て／残る穴）と
　網の突き合わせ（**Wi-Fi 一本・印が付くのは 09-20 16:11 の一件だけ・ディスクは HDD**）が残っている。
　取り下げたのは**台帳の行**であって、中身は消していない。

---

## 2. 走りかけの子 — **125本落とした**

### 出てきた姿（15:50 時点）

| 何 | 本数 | 作業域 | いちばん古い |
|---|---|---|---|
| `jam-watch.ps1` | **54本** | 663MB | 5,690秒（1時間35分） |
| `revive-claude.ps1` | **19本** | 211MB | 5,093秒 |
| `watch-notify.ps1`（heavy-gate 経由） | 9本 | 104MB | 5,868秒 |
| `pipe-check.ps1` | 9本 | 74MB | 5,786秒 |
| `heavy-beat.ps1` | 7本→15本 | 114MB | 4,690秒 |
| `board-emit.ps1` | 7本 | 63MB | 4,561秒 |
| `sweep-checks.ps1` | 4本 | 66MB | 4,422秒 |
| `daily-reboot.ps1` | 2本 | 10MB | 2,755秒 |
| `after-reboot.ps1` | 2本 | 9MB | 1,875秒 |
| **powershell 計** | **113本** | **約1,300MB** | |
| `conhost.exe`（上の子） | 113本 | 67MB | |
| `wscript.exe`（包み） | 13〜15本 | | |

**どれも「親不在」**——包みの `wscript` は先に消えているのに、中の `powershell` だけが残っていた。

### 落とした結果

| | 空き |
|---|---|
| 一度目の掃き出し前（15:50） | **504MB**（この少し前は 391MB） |
| 一度目で120本 → 落ち着くまで | **1,021MB** |
| 二度目（取りこぼし5本＋置き去りの conhost 1本） | **1,015MB** |
| **いま（15:53）** | **785MB**（波がある） |

落としたのは **125本**（powershell・wscript 125／置き去りの conhost 1）。
**常駐 `inbox-watch`（pid 7052）と claude（pid 13120）には触っていない。**
残りは `powershell 2本 / wscript 0本 / conhost 3本` で、ふつうの姿に戻っている。

### 気づいたこと（直していない）

- **`IgnoreNew` が効いていない。** `ClaudeRevive`・`ClaudeWatchNotify`・`ClaudePipeCheck`・
  `ClaudeBoard`・`ClaudeSweepChecks` は「前の回が走っていたら次を起こさない」設定なのに、
  **19本・9本・9本・7本・4本とたまっていた**。予定表から見ると**札は終わったことになっている**
  ——つまり**包み（`wscript`）が先に返り、中の `powershell` だけが残る**形になっている。
  今日 10:15 に入れた `run-hidden.vbs` の `Run(cmd, 0, True)`（＝終わるまで待つ）が、
  **意図どおりに待っていない**疑いが濃い。
- **15:00 の定時再起動は動いたが、一行も書かずに止まった。** `reboot.log` に 14〜15時台の行は無く、
  `daily-reboot.ps1` の走りかけが2本残っていた（15:05 ごろ始まり・46分）。
  **落ちもせず、見送りの札も立てないまま固まった**——`git rev-list` か `Get-CimInstance` で
  返らなくなった形で、**内側に上限を置いていない**（作法35 を踏んでいない）。
- **今日入れた「固まりの起こし直し」は一度も鳴っていない。** `inbox-watch.log` に `固まり` の行は無い。
  窓は応答を返し続けていたので、**この形の詰まりは拾えない**。
- claude の pid が **4384 → 13120** に変わっている。`revive.log` には何も残っていないので、
  **誰が起こし直したのかは辿れない**。

＊**直しはしていない。** 元に戻すなら `~/.claude/task-bak-20260921/*.xml` を
　`Register-ScheduledTask -Xml` で入れ直すだけで、10:15 より前の呼び方へ戻る。

---

## 3. 参考 — 積の大きい順（枠13:21 の①ぶん・24時間の実測）

予定表は `Microsoft-Windows-TaskScheduler/Operational` の 100／102 から、
私用MBは 13:39:47〜13:46:17 の390秒の実測から。

| 何 | 回数/24h | 平均秒 | 私用MB | **積** |
|---|---|---|---|---|
| **hook `tool-mark`**（Pre 706＋Post 670） | **1,376** | 短い | **57** | **78,432** |
| **`ClaudeJamWatch`** | **995** | 7.6 | **60** | **59,700** |
| `ClaudeRevive` | 859 | 18.1 | 64 | 54,976 |
| `ClaudeWatchNotify` | 643 | 54.8 | 79 | 50,797 |
| `ClaudeBoard` | 100 | 81.5 | 76 | 7,600 |
| `ClaudePipeCheck` | 99 | 68.4 | 69 | 6,831 |
| `ClaudeHookHeartbeat` | 100 | 54.8 | （測れず） | — |
| `ClaudeSweepChecks` | 50 | 67.0 | （測れず） | — |
| `ClaudeCodeAtLogon` | 4 | 15.3 | — | — |
| `ClaudeDailyNotice` | 2 | 121.0 | — | — |
| `ClaudeHomeBackup` | 1 | 425.8 | — | — |
| `ClaudeEdgeSweep` | 1 | 3.9 | — | — |
| `ClaudeDailyReboot`／`ClaudeAfterReboot` | 0 | — | — | 今日作ったばかり |
| 常駐 `inbox-watch` | 常時1本 | — | 75 | — |
| 常駐 `cmd-watch`／`kagi-watch`／`push-retry` | 常時 | — | 67／61／44 | — |

**上二つは `tool-mark`（hook）と `ClaudeJamWatch`。** ただし**②の「止めるか延ばすか」には入っていない**
——15:43 の指示で片付けへ切り替えたため。台帳の行は**取り下げの指示を受けていないので残してある**。

---

## 4. 残り

**残り1件。**

1. `2026-09-21 13:21:07` **機械に乗せている物を測ってから減らせ** — ①の測りは済み（上の表）。
   **②の「上二つを止めるか延ばすか」と③の前後の空きが未了。**

＊指示は「取り下げ後の未了0件」でしたが、**名指しされた二件を落としても、この一件が残ります**。
　黙って落とすのは台帳の決め（作法31）に反するので、残したうえでここに書きます。
　取り下げてよければ、その一言で落とします。

## 5. いまの空き

**785MB ／ 全体 3,975MB**（15:53 時点。掃き出し直後は 1,021MB、そのあと 862MB → 785MB と波がある）。
claude 1本・私用 508MB／常駐 `inbox-watch` 1本／`powershell` 3本・`wscript` 1本・`conhost` 5本（ふつうの姿）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **355件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-1600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1600.md) | 09-21 15:51 | 二件の取り下げと、走りかけの子 125本の片付け |
| [`y0921-1335.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1335.md) | 09-21 13:31 | 09-20 22:00 からの乱れ一枚と、網／ディスクの突き合わせ |
| [`y0921-1250.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1250.md) | 09-21 12:59 | 起き上がりの道を直して、再起動を一日二回にする |
| [`r0921-1246-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0921-1246-2.md) | 09-21 12:46 | 再起動-2（r0921-1246・後の測り） |
| [`y0921-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1040.md) | 09-21 10:41 | 「写した刻」を字面で確かめて消した |
| [`y0921-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1020.md) | 09-21 10:23 | 青い窓の出所と、wscript の包みで隠した話／untracked の「写した刻」 |
| [`y0921-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0950.md) | 09-21 09:49 | 会話の控えの大きさと、畳む支度の点検 |
| [`y0921-0935.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0935.md) | 09-21 09:35 | 「窓を畳むと0枚と読む」の見立ては、実物では成り立たなかった — 直しは入れていない |
| [`y0921-0925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0925.md) | 09-21 09:24 | 公開 state の詰まりと、09:19 の札 |
| [`y0921-0845.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0845.md) | 09-21 08:45 | 06:50 の復帰後に溜まっていた枠の行方と、会話の控えの大きさ |
| [`y0921-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0800.md) | 09-21 08:01 | mem-orphan.ps1 の作り値（置き去り落とし・空きの見張り）と、実地の落とし |
| [`y0921-0730.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0730.md) | 09-21 07:39 | 公開側 state は戻っている／置き去りの gh・git を常駐が落とす／空き300MB割れで一発 |
| [`y0921-0655.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0655.md) | 09-21 06:52 | 見張りの止まりの元は「空きメモリ」。使用量の読みではない |
| [`y0921-0245.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0245.md) | 09-21 02:41 | ①使用量の見張りを足した ②控えの押し残し230件を通した ③鍵の作り直し方を置いた |
| [`y0921-0140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0140.md) | 09-21 01:36 | ①写しの頭の道を一意の名にした（panel v143） ②使用量の敷居と、~/.claude の写しの調べ |
| [`y0921-0115.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0115.md) | 09-21 01:13 | 再起動で切れた二つの直しは**入っている** — 作り値の結果と予定表の写し |
| [`y0921-0110.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0110.md) | 09-21 00:55 | 電源復帰からログオンまでの17.5分 — 自動ログオンは61秒で通っていた。待っていたのは「プロファイルの読み込み16分40秒」 |
| [`y0921-0050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0050.md) | 09-21 00:48 | 再起動で切れた二つを塞いだ／WeeklyReboot と AfterReboot を止めた |
| [`y0921-0030.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0030.md) | 09-21 00:33 | 再起動の稽古の戻り — 26分の穴は「ログオンしていない間、予定表が一つも走らない」 |
| [`y0920-2320-reboot.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2320-reboot.md) | 09-20 23:17 | ③ 再起動の稽古 — 手順と、戻らなかったときの戻し方（再起動の直前に書いた） |

<!-- 控えの一覧 ここまで -->

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. 🪟 異常です（手が要ります）

```
二件の取り下げと、走りかけの子の片付け
見張りの生存記録が 50 分途切れています。仕組みのどこかが止まっています。
こちらがすること：端末の様子を見て、動いていなければ開き直してください。
```

### 2. 🪟 異常です（連携に訴え：push-fail・state-stale）

```
連携の見張りから訴えが出ています。

・state-stale … 公開側の生存が 149分 書かれていない（state.json の at）。パネルは凍った状態を出し続ける
・push-fail … 押しが続けて失敗している（最初の失敗 14:00 から 110分・押せていない commit 1件・押しの失敗 0回）。直近：pull --rebase が通らなかった（-1）。押し直さない

＊同じ種類が続く間は、これ以上鳴らしません。
＊全部の記録は ~/.claude/pipe-warn.log にあります。
```

### 3. 🪟 異常です（空きメモリが 217MB）

```
空きメモリが 217MB まで落ちています（敷居 300MB）。

＊この帯では見張りの段が時間切れで切られ、押しが通らなくなります。
＊置き去りの gh／git は常駐が2分ごとに落としています。
＊400MB へ戻るまで、この知らせは二度鳴りません。
```

### 4. 👀 見てください（返事不要）

```
この間にまとまった知らせ 2本

［✅ 終わりました（返事不要）］
untracked の「写した刻」を字面で確かめてから消す
（札が立たないまま次の仕事へ移っていた分）
完了: ①字面で参照を当て直した——panel.html L2283/2328/2550/2555 と panel-mach-probe.js L23-24 は /* */ の中の説明、reports/取り残しの検収-1.md L23 は地の文。道や引用符に接した使い方は0件、開く手（Get-Content・readFile・Test-Path・existsSync）の近くも0件。git ls-files も空。②参照が無いので消した。0バイト・作成 2026-09-14 13:32:42 を控えてから Remove-Item -LiteralPath で落とし、untracked は6件（.bak だけ）に戻った。本体には触っていない。
ファイル: 消した＝リポジトリ直下の「写した刻」／控え＝orders-open.tsv・work-note.txt・reports/y0921-1040.md・report-latest.md
実測: 参照の当たり＝説明文6箇所（panel.html 4・panel-mach-probe.js 2）＋地の文1（reports/取り残しの検収-1.md）＋今回の報告と機械の記録。ファイルとして開く箇所 0件。消す前 0バイト・作成/更新/最終アクセスとも 2026-09-14 13:32:42。消した後 Test-Path 偽・untracked 7件→6件。

［👀 見てください（返事不要）］
起き上がりの道を直して、再起動を一日二回にする
①ClaudeAfterLogon.vbs の落ちを直した——「Set の抜け」ではなく綴りの字。UTF-8 の日本語注釈を WSH が cp932 で読み、行末の先頭バイトが改行を食って行が繋がり、Set 行が注釈の中へ入っていた。ASCII＋CRLF で書き直した。②10:43 以降は「再起動」だった（ログオンし直しではない）。1074→6006→id13→id12→6005→7001 の順で、41/6008 は24時間0件＝きれいな落ち。③inbox-watch へ Check-ClaudeFrozen を足した。窓を持つのは claude.exe ではなく親 cmd.exe なので祖先をたどる形にした。④ClaudeWeeklyReboot を消して ClaudeDailyReboot（03:00／15:00・30分ごとに三度まで見送り）を作り、daily-reboot.ps1 を新設。ClaudeAfterReboot も 03:10／15:10 で有効化し、after-reboot.ps1 の予定の数を 11→13 へ直した。
ファイル: Startup/ClaudeAfterLogon.vbs／~/.claude/daily-reboot.ps1（新）／~/.claude/inbox-watch.ps1（+105行・写し .bak-20260921）／~/.claude/after-reboot.ps1（写し .bak-20260921）／予定表 ClaudeDailyReboot・ClaudeAfterReboot・ClaudeWeeklyReboot（消した）／task-bak-20260921/*.xml
実測: vbs＝食われる改行5本→直して非ASCII0・CRLF20、写しを wscript で走らせて終了0・after-reboot.log に 12:41:42 の一行。札は -Dry で「✅ 戻りました（再起動から）」四つとも○（予定表13件）。再起動＝1074 11:39:02／id12 11:50:42／7001 11:51:51・落ちていた時間20秒・41/6008 は0件。固まりの見張り＝1209→1314行・構文0・作り値三通り合格（5分→落として鳴らす／1分→待つ／応答あり→触らない）・常駐 pid 7052（12:55:38）。定時再起動の作り値＝三通り合格、shutdown は偽物、本物は打っていない。
実機: 15:00 の枠で ClaudeDailyReboot が動く。残っている物が無ければ「🔁 落とします（定時）」が鳴って60秒後に落ち、戻ったら5分後に「✅ 戻りました（再起動から）」が出る。残っていれば reboot.log に「見送り 1/3」の行が立つ。
未検収: 2026-09-21 10:20 窓隠しの実機確認（人手待ち）／2026-09-21 15:00 定時再起動の初回（人手待ち）
```

### 5. ✅ 終わりました（返事不要）

```
写せます（1件）
```

<!-- 送った知らせ ここまで -->

