# 二件の取り下げと、走りかけの子 125本の片付け

**終わり（残り1件）** — 2026-09-21 16:05（VAIO）。`koushu-handan.html`・`stable` には触っていない。

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
| **いま（16:05）** | **862MB**（波がある） |

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

**862MB ／ 全体 3,975MB**（16:05 時点。掃き出し直後は 1,015MB、波がある）。
claude 1本・私用 508MB／常駐 `inbox-watch` 1本／`powershell` 2本・`wscript` 0本・`conhost` 3本。

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
