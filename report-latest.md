# 青い窓の出所と、wscript の包みで隠した話／untracked の「写した刻」

**終わり（残り0件）** — 2026-09-21 10:20（VAIO）。
`koushu-handan.html`・`stable` には触っていない。直したのは**予定表の呼び方だけ**で、
見張りの台本の中身は一行も変えていない。

---

## 1（枠 10:01）untracked の「写した刻」— 読みだけ。消していない

`git status` が `"\345\206\231\343\201\227\343\201\237\345\210\273"` と出していた綴りの正体。

| 見るもの | 値 |
|---|---|
| **本当の名** | **`写した刻`**（`core.quotepath=false` で表示。UTF-8 4文字・12バイト・拡張子なし） |
| 置き場 | `C:\Users\user\Desktop\mahjong\koushu-handan\写した刻`（リポジトリ直下） |
| **大きさ** | **0 バイト** |
| **作られた刻** | **2026-09-14 13:32:42**（作成・更新・最終アクセスの三つとも同じ） |
| 追跡 | untracked（git には一度も入っていない） |
| 読む台本 | **無い**。リポジトリ全体と `~/.claude` を当てて、この名でファイルを開く箇所は0件 |

### 作った台本 — **台本ではなく、振り向けの取りこぼし**

この名を含む字は三箇所にあるが、どれも**説明の文**で、ファイルを作る手ではない。

| 場所 | 中身 |
|---|---|
| `panel.html` L2283・L2328・L2550・L2555 | 「写した刻（秒）を控える」——届いた印の物差し（v32） |
| `panel-mach-probe.js` L23-24 | 作り値の説明文 |
| `reports/取り残しの検収-1.md` L23 | 同じ仕組みの説明 |

同じ時期の控え・報告には **`lastResume>写した刻`** という書き方が何度も出てくる
（「`lastResume` が `写した刻` より後なら届いた」の意）。**この字が引用符の外で PowerShell を
通ると、`>` が振り向けと読まれ、`写した刻` という名のファイルが空で作られる。**
0バイトなのは、走った手が**画面へ出す物を持たない手**（控えへ書くだけの手）だったため。
**作った一行そのものは綴りに残っていない**ので、ここは推定と断る——確かなのは
「読む台本は無い」「0バイト」「2026-09-14 13:32:42」の三つ。

### 要らない物なら、消し方と代償

```powershell
Remove-Item -LiteralPath 'C:\Users\user\Desktop\mahjong\koushu-handan\写した刻'
```

＊**`-LiteralPath` を必ず付ける。** 付けないと名の中の字が当てはめと読まれることがある。

| 代償 | 中身 |
|---|---|
| 仕組みへの害 | **無い。** 0バイト・git 未追跡・読む台本0件。消しても何も壊れない |
| 失う物 | **作られた刻の手掛かり**。`git status` から消えると、いつ何が取りこぼしたかの唯一の証拠が消える（この札に刻を写したので、それで足りる） |
| 作法 | 自分で作った物ではなく、**git 管理下でもない**ので作法29 ④には当たらない。とはいえ**指示どおり、まだ消していない** |

---

## 2（枠 10:03）青い窓の呼び手 — **予定表。`-WindowStyle Hidden` が効いていなかった**

### ① 呼び手の突き止め

100秒ぶん、立ち上がった `powershell.exe` を 0.4 秒おきに拾い、**窓が見えているか**を
`EnumWindows` ＋ `IsWindowVisible` で見た（`MainWindowHandle` は隠れと窓なしを見分けられないため）。

| 刻 | pid | 窓 | 呼び手 |
|---|---|---|---|
| 10:07:59 | 6800 | **見えている** | `heavy-gate.ps1 -Run watch-notify.ps1`（**ClaudeWatchNotify**・毎分） |
| 10:08:02 | 8720 | **見えている** | `heavy-beat.ps1`（**ClaudeHookHeartbeat**・10分毎） |
| 10:08:26 | 3128 | **見えている** | `revive-claude.ps1`（**ClaudeRevive**・毎分） |
| 10:08:59 | 1952 | **見えている** | `heavy-gate.ps1 -Run watch-notify.ps1`（毎分の次の回） |

**親はすべて `svchost.exe` ＝ 予定表（Task Scheduler）。**
常駐の子（`inbox-watch`・`cmd-watch`・`kagi-watch`・`push-retry`・`tool-mark`）は
**全部 `no-window`** で、こちらは出所ではない。`revive` の窓でもない。

**四つの候補のうち、当たったのは「予定表」。** 毎分の札が三つ（WatchNotify・Revive・JamWatch）
あるので、**20秒に一度くらい**の間隔で光る。「数十秒ごと」と合う。

### **肝心の発見 — 旗は付いていた。効いていなかった**

四つとも `-WindowStyle Hidden` を**既に付けている**。にもかかわらず窓が見えた。
**予定表から起こすと、`powershell.exe` はまず窓を作り、それから自分で隠す。**
その隙が青い光になる。**旗を足す直しは、ここには効かない**（足す物がもう無い）。

### ② 直し — wscript の包み `run-hidden.vbs`

`~/.claude/run-hidden.vbs`（新設・ASCII のみ）。

```vbs
rc = sh.Run(cmd, 0, True)   ' 0 = 窓を作らない／True = 終わるまで待つ
WScript.Quit rc
```

**`wscript.exe` は窓を持たない種類の手**なので、隙そのものが無い。
**第三引数を `True`（待つ）にしてあるのが要**——予定表から見た札は走っている間ずっと
「実行中」のままで、**`IgnoreNew`（前の回が走っていたら次を起こさない）がこれまでどおり効く**。
`heavy-gate.ps1` の注意書きにある「ID=322 で巡回が落ちた」の穴を、作り直さないため。

**付け替えたのは10件**（`ClaudeBoard` `ClaudeDailyNotice` `ClaudeEdgeSweep` `ClaudeHomeBackup`
`ClaudeHookHeartbeat` `ClaudeJamWatch` `ClaudePipeCheck` `ClaudeRevive` `ClaudeSweepChecks`
`ClaudeWatchNotify`）。**中の手は一行も触っていない。**
`ClaudeCodeAtLogon`（わざと見せている窓）と、止めてある二件は触っていない。

**元の札は `~/.claude/task-bak-20260921/*.xml` に10件控えた**（戻すのは `Register-ScheduledTask -Xml`）。

### 作り値

**包みだけの作り値**（本物の札に触る前）

| 見るもの | 結果 |
|---|---|
| 6秒走る手の間、窓が見えた回数 | **0回** |
| 終了コードの素通し | **7 → 7**（予定表が結果を読めることの確かめ） |
| 記録 | `payload-ran.txt` に `10:10:42 payload ran` |

**直した後の実地**（10:16:22〜10:18:37・135秒）

| 見るもの | 直し前 | 直し後 |
|---|---|---|
| 窓が見えた回数 | **4回**／100秒 | **0回**／135秒 |
| 立ち上がった札 | — | **9回**（全部 `wscript` 経由・全部 hidden） |
| **記録は残ったか** | — | **残った**。`~/.claude` の **23ファイル**が更新 |

更新された記録の抜き（**今までどおり**）

```
10:18:28  watch-step.txt        10:18:28  watch-step-log.txt
10:16:37  watch-notify.log      10:17:38  watch-state.txt
10:16:30  pipe-warn.log         10:18:22  hc-ping.log
10:16:37  usage-pub-key.txt     10:17:07  usage-pub-cpu.txt
```

### 回る段の突き合わせ（作法36）

| 段 | どこで回る | 直しの前後 |
|---|---|---|
| `ClaudeWatchNotify`（毎分）→ `heavy-gate` → `watch-notify.ps1` | 手元・予定表 | 呼び方だけ `wscript` 経由へ。**中の手・間隔・IgnoreNew は同じ** |
| `ClaudeRevive` `ClaudeJamWatch`（毎分） | 手元・予定表 | 同上 |
| `ClaudeHookHeartbeat` `ClaudePipeCheck` `ClaudeBoard`（10分）・`ClaudeSweepChecks`（20分） | 手元・予定表 | 同上 |
| `ClaudeDailyNotice` `ClaudeHomeBackup` `ClaudeEdgeSweep`（日次） | 手元・予定表 | 同上 |
| `inbox-watch.ps1` とその子（`cmd-watch` ほか） | 手元・常駐 | **触っていない**（元から窓なし） |
| `check.yml` の check／deploy | 雲 | **触っていない**（予定表とは繋がっていない） |
| `.githooks/pre-push`（速い版・`serifu --check`） | 手元・押しの時 | **触っていない** |

**雲の側に、予定表の札を呼ぶ段は無い。** よって今回の直しが雲へ及ぶ経路は無い。

### 選ばなかった案

- **札を「ログオンしていなくても実行する」（S4U）へ替える** — 窓は完全に消えるが、
  セッション0へ回るので `watch-notify.ps1` の `WinScan` や `revive-claude.ps1` の
  窓の起こし直しが**画面を見られなくなる**。見張りの本体が壊れるので採らない。
- **中の手から `-WindowStyle Hidden` を残す** — 包みが隠す以上、二重になる。
  覚え書き（`window-vanishes-process-alive`）が「この旗は繋がっている窓を無条件に隠す」と
  戒めているので、**旗は落として包み一本にした**。

---

## 3. 残り

**残り0件**（`orders-open.tsv` の未了は0）。

## 4. 実機で見るところ

- **数分ふつうに使って、青い PowerShell の窓が一度も出ないこと**（20秒おきに光っていたもの）
- **Claude Code の黒い窓は今までどおり見えたまま**であること（消えていたら異常・すぐ知らせてください）
- 知らせ（ntfy）とパネルの更新が**止まっていないこと**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **350件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-2315.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2315.md) | 09-20 23:16 | ①done-swept の元を塞いだ ②ClaudeAfterReboot を作った ④蔵と記録の大きさ ⑤期限の調べ |
| [`y0920-2300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2300.md) | 09-20 22:52 | ①古い並びを掴んだら取り直す（panel v142）／②「続けて」「進めて」は合図として扱う |
| [`y0920-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2100.md) | 09-20 21:02 | pub-late は ok へ戻った／配信の関門を偽の走りで当てた |
| [`y0920-2040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2040.md) | 09-20 20:39 | pub-late（公開が56分遅れ）の元 — 長い回の配信が、古い版を後から上書きしていた |
| [`y0920-2010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2010.md) | 09-20 20:10 | 黄色い行が動かない・猫が走らない — 元を突き止めて三つ直した |

<!-- 控えの一覧 ここまで -->
