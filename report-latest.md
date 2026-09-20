# ①古い並びを掴んだら取り直す（panel v142）／②「続けて」「進めて」は合図として扱う

**終わり（残り0件）** — 2026-09-20 23:00（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## ① 返事パネルが古い並びを掴んだら取り直す

**組み方**

| 所 | 足したもの |
|---|---|
| `notify-record.ps1`（写し `.bak-20260920c`） | 並びを書くたび、**いちばん新しい札の刻**を `~/.claude/last-card-at.txt` へ置く |
| `inbox-watch.ps1`（写し `.bak-20260920`） | それを `state.json` の **`cardAt`** へ載せる（数えるのはあちら。こちらは運ぶだけ） |
| `panel.html` → **panel v142** | `notices.json` を読んだあと **`freshen()`** を通す。頭の刻が `cardAt` より古ければ **`latest-name.txt` の道から取り直す** |

**取り直しの筋** … `latest-name.txt` は**毎回名の変わる道**（`notices-<刻>.json`）を指す。
**一度も取られていない道は必ず新しい中身**なので、キャッシュに引っかからずに最新が来る。
取り直しても古ければ、**掴んだ並びをそのまま使って次の巡回を待つ**。

**作り値**（本物の `newestTime`／`freshen` を `panel.html` から切り出し、**偽の fetch** で回す）

| 形 | 取り直し | 使う並びの頭 |
|---|---|---|
| **イ 古い**（`cardAt` 22:40・掴んだ並びは 19:23） | **した**（`latest-name.txt` → その道の2回） | **22:40（2件）** |
| **ロ 新しい**（`cardAt` 19:23・掴んだ並びは 22:40） | **しない** | 22:40（2件） |
| **ハ `latest-name.txt` が読めない**（HTTP 404） | 1回試みて戻る | 19:23（1件・**今までどおり**） |
| ニ 道の形が違う（`https://` で始まらない） | 1回試みて戻る | 19:23（1件・今までどおり） |
| ホ `cardAt` が無い（0） | しない | 19:23（1件） |
| ヘ 取り直しても古い | した（2回） | 19:23（1件・**次の巡回を待つ**） |

**実地** … `last-card-at.txt` に **1789905917**、`state.json` に **`cardAt`（21:05:17）** が載った。
公開 `panel-ver.txt` は **142**（手元142・実読み一致）。

## ② 「続けて」「進めて」だけの枠は合図として扱う

**組み方** … `frame-work.ps1` に枠の種類 **`next`** を足した。空白と改行を落として
**`続けて`／`進めて`** に丸ごと一致する枠は、**台帳に行を作らず・札も出さず・いまの枠としても控えない**
（`last-order.txt` を書かないので、画面の「いまの枠」が「続けて」に置き替わることもない）。

**次の枠が無いときだけ、一行の札を立てる**——合図に何も返さないと、送った側から
「届いたのか、次が無いのか」が分からないため。次の枠の数え方は
**受信箱（`inbox.txt`）の未チェックの行 ＋ 台帳（`orders-open.tsv`）の未了の行**。

＊**句点と「以上」は落として見る**（こちらの裁量）。実際に届く形が「続けて。以上」なので、
　これを外すと決まりが働かない。**「続けて調べよ」のように後ろに字が続く枠は、今までどおりの枠**。

**作り値**（本物の `frame-work.ps1` を写し、道も台帳も受信箱も ntfy も**全部偽物**にして回す）

| 当てた枠 | 種類 | 台帳に足した行 | 札 |
|---|---|---|---|
| **イ 「続けて。以上」＋次の枠あり**（台帳に未了1件） | **next** | **0** | **なし** |
| **ロ 「続けて。以上」だけ**（次の枠が無い） | **next** | **0** | **「次の枠は無い」（一行）** |
| **ハ ふつうの枠**（「パネルの版を上げよ。以上」） | order | **1** | なし |
| ニ 「進めて 以上」＋次あり | next | 0 | なし |
| ホ 「続けて調べよ。以上」 | **order** | 1 | なし |

## 実機で見る所

- 返事パネルの一覧が、**配信の遅れた回でも古い並びのまま座らない**（新しい札が出ていれば数秒で出る）。
- 下の版の字が **panel v142（9月20日）**。
- 「続けて。以上」とだけ送った回に、**台帳に「続けて」という名の仕事が立たない**。

## 触った所と触らない所

**触った所** … `~/.claude/notify-record.ps1`・`inbox-watch.ps1`（常駐は 22:45:17 に起こし直し済み）・
`frame-work.ps1`／`panel.html`・`panel-ver.txt`。
**触らない所** … `koushu-handan.html`・`stable`・判定・条件・光る牌・`analyze()`・押し送りの道。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **334件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1630.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1630.md) | 09-20 16:35 | 16:11 の訴え二つ（ntfy-down・pub-read）の今 |
| [`y0920-1500-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500-2.md) | 09-20 15:19 | v1457 剣士の八枚を idleRight 52 に揃えて焼き直した（納品） |
| [`y0920-1500.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500.md) | 09-20 14:48 | 【宣言】剣士の八枚を idleRight 52 に揃えて焼き直す（v1457） |
| [`y0920-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1450.md) | 09-20 14:40 | 08-20 の保留三つの今（振りの八枚の倍率・目盛り画像の置き場・sizing-review.png） |

<!-- 控えの一覧 ここまで -->
