# mem-orphan.ps1 の作り値（置き去り落とし・空きの見張り）と、実地の落とし

**終わり（残り0件）** — 2026-09-21 08:00（VAIO）。**作り値と読みだけ。台本は一字も直していない。**
`koushu-handan.html`・`stable` には触っていない。

＊`mem-orphan.ps1`（8.4 KiB・09-21 07:24 更新）は**この回より前に入っていた物**。
　作り値の台（`mem-orphan-test.ps1`）は**無かった**ので、こちらで組んで回した。
　組み方は**本物の台本をそのまま読み込み、外の世界だけを偽物に差し替える**形——
　プロセスの一覧（`Get-CimInstance`）・殺す手（`Stop-Process`）・空きの数・知らせの送り手。
　**本物の `pipe-warn.log` も ntfy も押しも叩いていない**（`$Root` は写しの置き場）。

## ① 置き去り落とし（`Sweep-Orphans`）— 三通りとも期待どおり

居させた物 … 親（pid 100・600分）／**イ** 25分・CPU が増えない子（pid 201・git）／
**ロ** 5分の子（pid 202・git）／**ハ** 25分だが CPU が増える子（pid 203・gh）。
一度目の巡回で CPU の控えを作り、二度目で判じさせた。

| 当てた形 | 結果 |
|---|---|
| **イ 25分放置の偽の子（pid 201）** | **落ちる** |
| **ロ 5分の子（pid 202）** | **落ちない** |
| **ハ 親が居て動いている子（pid 203）** | **落ちない** |

一度目（控えを作る回）は**誰も落とさない**ことも確かめた。

**書かれた行（写しの `pipe-warn.log`）**

```
2026-09-21 08:00:14  orphan-kill   置き去りの gh／git を 1本 落とした（git.exe pid=201・25分・20分超・無動作）。空き 1000MB → 1000MB
```

＊**台の不備をひとつ踏んだ**ので直してから回した——二度目の回で偽のプロセスを作り直すと
　**起動の刻が変わり**、本物の「pid の使い回しの見分け」（`$prev.Start -eq $st`）に掛かって
　イが落ちなくなる。**起動の刻は一度だけ決めて使い回す**形に直した。

## ② 空きの見張り（`Check-FreeMem`）— 四通りとも期待どおり

| 当てた形 | 鳴った札 | 印（`mem-low.txt`） |
|---|---|---|
| **イ 299MB** | **あり**「🪟 異常です（空きメモリが 299MB）」 | ある |
| **ロ その後 350MB** | **なし** | ある（まだ戻っていない） |
| **ハ 400MB へ戻る** | なし（`mem-ok` を記録に書くだけ） | **無い（印が消える）** |
| **ニ 再び 299MB** | **あり**（また一発） | ある |

**書かれた行（写しの `pipe-warn.log`）**

```
2026-09-21 08:00:14  mem-low       空きメモリが 299MB（敷居 300MB）。一発鳴らした。400MB へ戻るまで鳴らさない
2026-09-21 08:00:14  mem-ok        空きメモリが 400MB へ戻った（敷居 400MB）
2026-09-21 08:00:14  mem-low       空きメモリが 299MB（敷居 300MB）。一発鳴らした。400MB へ戻るまで鳴らさない
```

## ③ 実地 — 07:50 までに落とした物（`pipe-warn.log` の原文）

```
2026-09-21 07:39:13  orphan-kill   置き去りの gh／git を 2本 落とした（git.exe pid=7364・3分・親不在／git.exe pid=5600・3分・落とす物の子）。空き 440MB → 433MB
2026-09-21 07:44:57  orphan-kill   置き去りの gh／git を 2本 落とした（git.exe pid=8200・2分・親不在／git.exe pid=7068・2分・落とす物の子）。空き 597MB → 600MB
```

**二回・計4本**（どちらも「親不在」の git と、その子）。
＊参考までに、**07:53:43 にもう一回**落ちている（`git.exe pid=2708・2分・親不在`ほか1本／空き 636→641MB）。
＊**`mem-low` の行は実地では一度も出ていない**——この帯では空きが 400MB を下回っていないため。

## 気づいたこと（直していない）

- **落とした前後の空きが、ほとんど動いていない**（440→433／597→600／636→641）。
  置き去りの git は**一本あたりの取り分が小さい**ので、**空きを取り戻す手としては効き目が薄い**。
  効いているのは「**押しが詰まらなくなる**」ほうで、そこは狙いどおり。
- 実地の三回はいずれも**「親不在」**で落ちており、**「20分超・無動作」で落ちた実例はまだ無い**。
  作り値のイがその筋を通してある。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **345件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1953.md) | 09-20 19:53 | 番号の始末と雲の走りの確かめ（panel v140） |
| [`y0920-2000.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2000.md) | 09-20 19:29 | 「写せます（N件）」の札を公開の並びから外した（丙）／「延びています」の時計は受け取り済み |
| [`y0920-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1945.md) | 09-20 19:20 | 公開側40枚の「写せます（N件）」の札は、パネルで使われているか |
| [`y0920-1930.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1930.md) | 09-20 19:18 | 「延びています」の時計を、宣言のヨシ待ちの間は止めた |
| [`y0920-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1915.md) | 09-20 19:14 | report-latest.md はどこに書いているか／写しを機械の手にした |

<!-- 控えの一覧 ここまで -->
