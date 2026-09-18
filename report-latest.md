# 再起動-2

**終わり（残り0件）** — 2026-09-19 04:3x（VAIO）。本体には触っていない。
**毎週土曜01:00 の再起動**と**毎日03:00 の掃除**を予定表へ足し、作り値七通りで通した。

## 足した起こし

| 名 | いつ | 何をするか |
|---|---|---|
| **ClaudeWeeklyReboot** | **毎週土曜 01:00**（10分ごとに**1時間**繰り返す） | 条件が揃った回だけ再起動。次＝**09-26 01:00** |
| **ClaudeEdgeSweep** | **毎日 03:00** | `msedge` と `SearchApp` が居れば落とし、本数とMBを記録。次＝**09-20 03:00** |
| ClaudeRebootAfter（ログオン時） | — | **足せなかった**（`Access is denied`）。代わりに**毎分の巡回から**呼ぶ形にした（下記③） |

## ① 条件（揃った回だけ再起動する）

`weekly-reboot.ps1` が三つを見る。**一つでも駄目なら何もせず返る。**

| 見る物 | 揃っている形 |
|---|---|
| 押し残し | `git rev-list --count origin/main..HEAD` が **0件** |
| 押し直しの印 | `push-pending.tsv` が **0行** |
| 仕事 | `hook.log` の最後の `resume`／`stop` が **stop**（手待ち） |

**駄目な回は10分後の回が見直す。** 引き金が10分ごとに1時間繰り返すので、
01:00 に走っていても **02:00 までに手待ちになれば再起動する**。見送った回は `reboot.log` に一行残す。

```
見送る（押し残し 2件／押し直しの印 0件／仕事は 手待ち）。10分後の回で見直す
```

## ② 再起動の前に札を出す

条件が揃うと、落ちる前に**空きと claude の使用MB**を札にして押す（`reports/r<MMdd-HHmm>.md`）。
そのあと `reboot-pending.txt` へ前の測りを書き残し、`shutdown /r /t 30` を打つ。

## ③ 起き上がった後の札

**毎分の巡回が、印（`reboot-pending.txt`）を見つけた最初の回**に `weekly-reboot-after.ps1` を呼び、
前と後を並べた札（`r<印>-2.md`）を書いて印を消す。

```
| 空き物理メモリ | 1035MB | **1046MB** | +11MB |
```

**ふだんの回は `Test-Path` 一回で終わる**（印が無ければ子を起こさない）ので、毎分の重さは増えない。

## 作り値（七通り・本物の再起動も本物の押しも叩いていない）

再起動の手を**偽の綴り**へ、押しを `-NoPush` へ差し替え、記録の置き場も一時の所にした。

| 場合 | 結果 |
|---|---|
| イ 押し残し2件 | **再起動しない** ✔（見送りの一行が残る） |
| ロ 押し直しの印あり | **再起動しない** ✔ |
| ハ 仕事が走っている（最後が resume） | **再起動しない** ✔ |
| ニ 全部よい | **再起動した** ✔／前の札1枚・渡す印あり |
| ホ 起き上がった後 | 後の札1枚・**印は消えた** ✔ |
| ヘ 印が無い回 | 札は増えない ✔ |
| ト 掃除の台（落とさず数えるだけ） | `msedge 5本 226MB／SearchApp 1本 88MB＝6本 314MB` ✔ |

＊**ニの直前に一つ直した** … 後の札の台本で、印の道（`$Mark`）と印の名（`$mark`）が
　**同じ変数だった**（PowerShell は大小を区別しない）。名を `$id` へ変えた。
　作り値が無ければ、**印が消えず毎分書き続ける**ところだった。

## 触った所と触らない所

**触った所**
- 新しい台本三枚 … `weekly-reboot.ps1`／`weekly-reboot-after.ps1`／`edge-sweep.ps1`（構文検査 OK）
- `watch-notify.ps1` … 押し直しの段の後ろに**印があるときだけ**後の札を呼ぶ枝（写し `.bak-20260919`・構文検査 OK・実地の巡回 04:31:12 も通った）
- 予定表 … `ClaudeWeeklyReboot` と `ClaudeEdgeSweep` を新しく足した

**触らない所** … 本体（`koushu-handan.html`）・`ClaudeWatchNotify`（:58）／`ClaudeRevive`（:25）／
`ClaudeJamWatch`（:45）の刻と間隔・`ClaudeCodeAtLogon`・`WSearch`／`VCService`（Disabled のまま）・
Defender・押しの敷居（500／1024MB）・譲りの敷居700MB。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **276件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0919-0427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0427.md) | 09-19 04:32 | 再起動-2 |
| [`y0918-2212-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212-2.md) | 09-19 04:20 | 再起動-1（後の測り） |
| [`y0918-2212.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212.md) | 09-18 22:12 | 再起動-1（前の測り） |
| [`y0918-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2155.md) | 09-18 22:02 | 押しの敷居-2 |
| [`y0918-2145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2145.md) | 09-18 21:47 | 空きの片付け-2（後の測り） |
| [`y0918-2109.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2109.md) | 09-18 21:12 | 空きの片付け-2 |
| [`y0918-2055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2055.md) | 09-18 21:01 | 空きの内訳-2 |
| [`y0918-2049.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2049.md) | 09-18 20:53 | 鍵切れの見張り-1 |
| [`y0918-2035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2035.md) | 09-18 20:38 | 配信の譲り-1（乙・通し切る形へ） |
| [`y0918-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1953.md) | 09-18 20:00 | 配信の譲り-1 の下調べ |
| [`y0918-1923.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1923.md) | 09-18 19:24 | 公開の追いつき-1 |
| [`y0918-1846.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1846.md) | 09-18 19:05 | 起こしの重なり-1（乙・刻をずらす） |
| [`y0918-1831.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1831.md) | 09-18 18:35 | 起こしの重なり-1 の下調べ |
| [`y0918-1757.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1757.md) | 09-18 17:59 | 空きの片付け-1 |
| [`y0918-1747.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1747.md) | 09-18 17:50 | 空きの内訳-1 |
| [`y0918-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1305.md) | 09-18 13:06 | 軽い巡回の刻-1 |
| [`y0918-1221.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1221.md) | 09-18 12:24 | 止まりの読み-4 |
| [`y0918-0716.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0716.md) | 09-18 07:19 | 夜の較正-2 |
| [`y0918-0352.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0352.md) | 09-18 03:56 | 止まりの札の敷居-1 |
| [`y0917-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2140.md) | 09-17 21:35 | 呼び名の揃え-1 の下調べ |

<!-- 控えの一覧 ここまで -->
