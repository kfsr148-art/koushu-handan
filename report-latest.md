# 関門の二段-1（押しの敷居を押す物で二段に）

**終わり** — 2026-09-14 22:2x（VAIO）。本体には触っていない。

## 入れた形

`git-push.ps1` の `Git-CommitPush` に二段の敷居を入れた。

| 段 | 敷居 | 何が来るか |
|---|---|---|
| **軽い側** | **768MB** | `notices.json`・`notices-archive.json`・`state.json`・`board.json`・`usage.json`・`pipe-warn.json`・`ntfy-sent.json`・`ntfy-latest.txt`・末尾が `-count.txt` の綴り |
| **重い側** | **1536MB**（今までのまま） | 本体・`panel.html`・`check.js`・ワークフロー・絵など、それ以外を含む押し |

**見分けるのは押し手の名（`$Who`）ではなく、押す物の道。** 名は付け間違えても道は嘘をつかない。
**一つでも軽い名簿の外があれば重い側**（＝両方が混ざる押しは重い側）。

**`ntfy-latest.txt` は頂いた名簿に無かったが足した。**
`ntfy-sent` の押しは `ntfy-latest.txt` と `ntfy-sent.json` を**必ず二つ一組**で運ぶので、
片方が名簿の外だと「混ざる押し」として重い側へ落ち、**二段にした意味がそのまま消える**——
しかもこの押しが、いちばん凍っていた相手である。中身は数KBの控えで、他の軽い綴りと同じ質。

**見送りの記録**（`heavy-skip.log`・`git-push.log`）に、空きだけでなく
**「敷居NMB・軽い側／重い側」**を書き足した。どちらの段で止まったかが後から読める。

**`push-retry.ps1` の入口の敷居を 1536→768 にした。** ここは粗い篩いだけにして、
軽いか重いかの裁きは `Git-CommitPush` に任せる（重い押しはあちらの 1536MB で止まり、印はそのまま残る）。
**押し直しの印（`push-pending.tsv`）の形と毎分の巡回は今までのまま。**

## 作り値で確かめた（本物の git は一度も叩いていない）

| 押す物 | 敷居 | 期待 | |
|---|---|---|---|
| 札だけ（`notices.json`） | 768MB | 768MB | 合格 |
| 控えと札（`state.json`・`notices.json`・`board.json`） | 768MB | 768MB | 合格 |
| 数の綴り（`ntfy-count.txt`・`usage.json`） | 768MB | 768MB | 合格 |
| 本体だけ（`koushu-handan.html`） | 1536MB | 1536MB | 合格 |
| **混ざり**（`state.json`＋`koushu-handan.html`） | **1536MB** | 1536MB | 合格 |
| 道つきの札（`C:/x/koushu-handan/state.json`） | 768MB | 768MB | 合格 |

**六通りとも合格。**

## 待っていた ntfy-sent の押し

**通った。**

- 22:21:48 … 「空き901MB＜1536MB」で見送られ、`push-pending.tsv` に印が置かれていた
- 二段を入れたあと **22:24:20 に commit `9f2a95ef` として押し通った**（そのときの空き 807〜920MB）
- `push-pending.tsv` は **1件 → 0件**

## 刻の突き合わせ

| | 刻 |
|---|---|
| 手元の `ntfy-sent.json` | **22:21:41** |
| 押し（commit） | **22:24:20**（`9f2a95ef`・`origin/main` も同じ） |
| 公開側（GitHub Pages を取り直した最新の札） | **2026-09-14 22:21:40**（`time=1789392101`） |

**手元・押し・公開の三つが揃っている。** 差の2分39秒は、次の押し直しの巡回を待った分。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **227件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`関門の二段-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%96%A2%E9%96%80%E3%81%AE%E4%BA%8C%E6%AE%B5-1.md) | 09-14 22:26 | 関門の二段-1（押しの敷居を押す物で二段に） |
| [`人柄の言葉の棚卸し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BA%BA%E6%9F%84%E3%81%AE%E8%A8%80%E8%91%89%E3%81%AE%E6%A3%9A%E5%8D%B8%E3%81%97-1.md) | 09-14 22:16 | 人柄の言葉の棚卸し-1（前半四人） |
| [`v1442-確かめ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/v1442-%E7%A2%BA%E3%81%8B%E3%82%81.md) | 09-14 22:13 | v1442 の確かめ（四件）と 見張りの止まり-2 |
| [`y0914-2115.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2115.md) | 09-14 21:17 | 投票欄の角と釦の押せ（印 y0914-2115） |
| [`合わせ技-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-4.md) | 09-14 21:06 | 合わせ技-4（合計を六つの区切りで帯に切る） |
| [`合わせ技-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-3.md) | 09-14 20:58 | 合わせ技-3（五分割の持ち回りで五回測る） |
| [`合わせ技-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-2.md) | 09-14 20:44 | 合わせ技-2（八人の合計の上位だけを攻めにする） |
| [`合わせ技-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-1.md) | 09-14 20:31 | 合わせ技-1（八人の点数の重み付き合計） |
| [`y0913-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0913-0015.md) | 09-13 00:34 | 配信の切り分け-1（印 y0913-0015） |
| [`y0912-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2100.md) | 09-12 21:21 | 選択釦-1 — v1439（印 y0912-2100） |
| [`y0912-2015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2015.md) | 09-12 20:16 | ヨシの猫-7 — ヨシ待ちの頭を現場猫の顔へ（印 y0912-2015） |
| [`y0912-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1940.md) | 09-12 19:44 | ヨシの猫-6 — 現場猫の置き場を三つへ（印 y0912-1940） |
| [`y0912-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1915.md) | 09-12 19:14 | ヨシの猫-5 — 現場猫の絵を綺麗にした（印 y0912-1915） |
| [`検査を雲へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%82%92%E9%9B%B2%E3%81%B8-1.md) | 09-12 13:42 | 検査を雲へ-1 — Actions で検査し、通った版だけ配信する |
| [`知らせの押し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-2.md) | 09-12 12:31 | 知らせの押し-2 — 束ねない題と、小さな押しを通す／㉑〜㉔の今の状態 |
| [`知らせの押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-12 12:04 | 知らせの押し-1 — 03:00 以降に押した一覧と、09:47 の「延びています」が題を失った理由 |
| [`見張りの止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-12 11:04 | 見張りの止まり-1 — 段の時間切れ・空きの関門・止まりの知らせ |
| [`札の本文-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%9C%AC%E6%96%87-1.md) | 09-12 09:54 | 札の本文-1 — 終わりの札が前の仕事の文で出る／遠隔の橋-1 を閉じた |
| [`外の見張り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-2.md) | 09-12 04:09 | 外の見張り-2 — claude.exe が0本なら /fail を打つ |
| [`外の見張り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-1.md) | 09-12 03:46 | 外の見張り-1 — 巡回の末尾で hc-ping.com へ一分に一発 |

<!-- 控えの一覧 ここまで -->
