# 包みの待ちの確かめ・再起動の内側の上限・押しの詰まりの元

**終わり（残り1件）** — 2026-09-21 16:24（VAIO）。`koushu-handan.html`・`stable` には触っていない。
**本物の再起動はしていない**（作り値は偽の shutdown）。

---

## ① `run-hidden.vbs` の待ち — **直す所は無かった。効いていることを作り値で確かめた**

開けてみると、**Run の待つ引数は最初から真**だった（10:15 に入れたまま）。

```vbs
rc = sh.Run(cmd, 0, True)   ' 0 = 窓を作らない／True = 終わるまで待つ
WScript.Quit rc
```

**書き替えていない。** 代わりに、頼まれた二つを実測した。

**作り値** … 150秒走る台本を `IgnoreNew` の札（`ClaudeVbsProof`）に載せ、`schtasks /Run` で起こし、
**60秒後にもう一度叩いた**。

| 見るもの | 結果 |
|---|---|
| **二本目は立ったか** | **立たない。** `INFO: scheduled task "ClaudeVbsProof" is currently running.` で弾かれた |
| 走った本数 | **一本だけ**（`16:12:27 start pid=14316` → `16:14:57 end pid=14316`） |
| 札の状態 | 150秒のあいだ **`Running`** のまま＝**包みが待っている** |
| **終了コード** | 台本の `exit 3` が**そのまま** Last Result に **3** で出た |
| **見えた窓** | **0**（`EnumWindows`＋`IsWindowVisible` で見張りながら回した） |

### **たまっていた本当の元は、包みではなかった**

`MultipleInstances` を数え直したら、**13件のうち二つだけが `Parallel`** だった。

| 札 | 前 | 後 | 15:50 にたまっていた本数 |
|---|---|---|---|
| **`ClaudeJamWatch`** | **Parallel** | **IgnoreNew** | **54本** |
| **`ClaudeHookHeartbeat`** | **Parallel** | **IgnoreNew** | **15本** |
| 残る11件 | IgnoreNew | IgnoreNew | — |

**この二つで69本**、たまっていた113本の6割。残り（revive 19・watch-notify 9・pipe-check 9 ほか）は
`IgnoreNew` の札だが、**一度目の掃き出しで包みの `wscript` を先に落としたため親不在に見えていた**
——前の札で「包みが先に返っている疑い」と書いたのは、**こちらの掃き出しが作った見かけ**だった。訂正する。
**13件すべて `IgnoreNew` に揃えた。**

＊`Parallel` を `IgnoreNew` にした代償 … 一回が長引くと、その札は次の回を**飛ばす**。
　`heavy-beat`（生存の打刻）が飛べば `hook-quiet` が鳴るので、黙って止まることはない。

---

## ② `daily-reboot.ps1` に内側の上限

| 置いた蓋 | 値 |
|---|---|
| **全体（見送り判定を含む）** | **300秒** |
| 外の手 `git rev-list` | **60秒**（`Start-Process` ＋ `WaitForExit(ms)`、越えたら `Kill()`） |
| `Get-CimInstance`（node／msedge） | `-OperationTimeoutSec 20` |

越えたときは**落とさず**に、`reboot.log` へ一行残して終わる。

```
見送り（時間切れ）：見送り判定が N秒かかり、上限 300秒を越えた。落とさずに終わる。30分後の回で見直す
見送り（時間切れ）：落とす支度に入る前で N秒。上限 300秒を越えたので落とさない
```

**作り値**（`shutdown` は偽物・押し送りは綴りへ逃がした）

| 場合 | かかった秒 | shutdown | 押し送り |
|---|---|---|---|
| 甲 ふつうの回 | **2.5秒** | 呼んだ（偽物） | 出した |
| 乙 写しで上限を0秒に | — | **呼ばない** | **出さない**。時間切れの行だけ残る |

＊15:00 の初回が**一行も残さず46分固まった**のは、この蓋が無かったため（作法35 を踏んでいた）。
　次からは、どこで詰まっても `reboot.log` に理由が残る。

---

## ③ push-fail の元 — **git の壊れではなく、機械の詰まり**

失敗は `13:18 / 13:22 / 13:31 / 13:47 / 14:01 / 15:52` に集中し、**どれも同じ形**だった。

```
時間切れで切った（30秒）: git -C …\koushu-handan pull --rebase --autostash -q origin main
pull --rebase が通らなかった（-1）。押し直さない
```

この帯は **powershell が113本たまり、空きが391MB、HDD の `% Disk Time` が300%** だった帯と**ぴったり重なる**。
つまり**元は「30秒に収まらなかった」ことだけ**で、git 側の異常ではない。

**通した確かめ（手で同じ命令を打った）**

```
git -C …\koushu-handan pull --rebase --autostash origin main
  From https://github.com/kfsr148-art/koushu-handan
   * branch  main -> FETCH_HEAD
  Already up to date.
終了コード 0 / 8.1秒
```

**30秒の上限に対して 8.1秒。** 山を片付けたあと、`git-push.log` に**時間切れは一件も出ていない**
（最後の失敗は `15:52:36`、以後は 15:59:45 の無害な一行だけ）。

**公開側 `state.json` の `at` — 実読みで二度**

| 実読みの刻 | `at` | 差 |
|---|---|---|
| **16:17:00** | **09-21 16:11:41** | 320秒前 |
| **16:23:06** | **09-21 16:21:07** | 120秒前 |

**`at` は 16:11:41 → 16:21:07 へ動いている。** `stat` は両方とも `作業中`。**凍っていない。**

---

## ④ 直してから10分の帯（6.0分〜9.5分を五度読んだ）

直したのは **16:16:30**。

| 刻 | 空きメモリ | `powershell.exe` |
|---|---|---|
| 直す前（15:50） | **391MB** | **113本** |
| 6分後（16:22:38） | 756MB | **2本** |
| 7.7分後（16:24:10） | 845MB | **2本** |
| 7.9分後（16:24:26） | 827MB | **2本** |
| 8.7分後（16:25:14） | 767MB | 4本（予定の札が一つ走っていた） |
| **9.5分後（16:25:58）** | **850MB** | **2本** |

9.5分後の内訳 … CLAUDE_CODE_SHELL 1本／inbox-watch 1本／wscript 0本・conhost 3本・claude 1本（私用 593MB）

**たまりは戻っていない。** `powershell` は「この窓の手」と「常駐 `inbox-watch`」の二本だけで、
これが**本来の姿**（15:50 は 113本だった）。

＊**ちょうど10分で一度だけ読む手を背後で回していたが、Claude Code に止められた**——「機械の空きが足りない」ため
　16:20 ごろに二本とも落とされた。**言われるまで起こし直さない**決まりなので、
　代わりに**前面で五度読んだ**のが上の表。ちょうど 10:00 の点は取れていないが、6.0〜9.5分の五点で姿は見える。

---

## 残り

**残り1件。**

1. `2026-09-21 13:21:07` **機械に乗せている物を測ってから減らせ** — ①の測りは済み（`reports/y0921-1600.md`）。
   **②の「積の大きい上二つ（hook `tool-mark` と `ClaudeJamWatch`）を止めるか延ばすか」が未了。**
   ＊ただし `ClaudeJamWatch` は今回 `Parallel → IgnoreNew` にしたので、**たまる側の害は消えている**。

## 実機で見るところ

- **青い窓が出ないこと**（包みは変えていないので、これまでどおり）。
- **次の定時再起動（03:00／15:00）** … 落ちるか、`reboot.log` に `見送り N/3` か `見送り（時間切れ）` の
  **どれか一行が必ず立つ**こと。前回のように**何も残らない**のは異常。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **356件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-1625.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1625.md) | 09-21 16:24 | 包みの待ちの確かめ・再起動の内側の上限・押しの詰まりの元 |
| [`y0921-1600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1600.md) | 09-21 15:53 | 二件の取り下げと、走りかけの子 125本の片付け |
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

<!-- 控えの一覧 ここまで -->
