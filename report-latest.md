# ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる**

> **一行 … 組み直しで輪郭は「マス」としては残った（268マス）が、その黒と地の比は 1.3 で、
> 3.0 に届かない。よって二の条件で止め、四のとおり取り下げる。実装はしていない。**

## 一、組み直した（縮小ではなく描き直し）

出す画素ごとに、元の枠の中を見て**何を残すか**を決める形で組んだ。

| 残したもの | 決め方 |
|---|---|
| 輪郭の黒 | 枠の中の黒が **22%以上**なら、その画素を黒にする（＝細い線でも消えない） |
| 目の黄 | 枠の中の黄が不透明ぶんの 12%以上なら黄 |
| ヘルメットの白・体・指差しの前脚・尻尾 | 白へ寄せる |
| 落としたもの | 体の濃淡の中間色・ひげ・口の中の色・肉球の線 |

**結果 … 38x36 で、黒 268マス ／ 黄 1マス ／ 白 365マス ／ 透明 734マス。**

> **輪郭の黒は1マス以上残った。**縮小（最近傍）では黒が 133 まで欠けたが、
> 組み直しでは 268 まで残っている。**一の目的（輪郭を残す）は達している。**

## 二、パネルの地に置いて測った → **3.0 に届かない**

地は `--bg #14241c`（RGB 20,36,28）、WCAG式。

| | 画素 | 比 |
|---|---|---|
| **輪郭の黒** RGB(0,0,0) | **268** | **1.3** ← **3.0 未満** |
| 白 RGB(255,255,255) | 365 | 16.17 |
| 目の黄 RGB(245,200,40) | 1 | 11.0 前後 |
| **3.0 以上に届いた割合** | **366/634** | **57.7%** |

**残すよう言われた輪郭の黒そのものが、地に沈む。**
黒（0,0,0）と地（20,36,28）はどちらも暗いので、比は 1.3 にしかならない。
**42.3% の画素が地に溶ける**ので、絵は「白い塊に穴が空いた形」になり、輪郭として働かない。

参考 … いま使っている `panel-icon-white.png` は **8,642画素すべてが 16.17**（100%が3.0以上）。

## 三・五、していないこと

- `yoshi-cat.png` に**していない**。`runCatTick` のヨシ待ちの枝も**触っていない**
- 版は **v126 のまま**。`panel-check` も回していない
- `panel-icon-white.png` ／ `panel-icon-black.png` は消していない

## 四、取り下げ

**ヨシ待ちの猫は `panel-icon-white.png` のまま据え置き。**

＊組み直した絵は `yoshi-cat-rebuilt.png`（38x36・818バイト）として置いた。
　**`panel.html` からは呼んでいない。**目で見て確かめてもらうために残す。
＊`yoshi-cat.png`（最近傍で縮めたもの）も呼んでいない。


---

# 土台の直し-1 ① — 四段の材料の出どころ（名指しの一覧）

**四段のうち `analyze()` の内側から取っているものは一つも無い。**

## 一覧

切り候補の並べ替えの鍵は、本体 L4692 の `const key = [st, rank, keepsValue, -acc, i];`。

| 段 | 名 | どこから取っているか | 名指し |
|---|---|---|---|
| ① | **向聴最小** `st` | **写し** | `cutShantenMin`（**L4617〜L4629・13行**）→ その中で `cutShanten`（**L4525〜L4612・88行**） |
| ② | **孤立牌の順** `rank` | **後段で数え直している** | `lonelyRank`（**L4644〜L4654・11行**）。`pickCutTile` の中で定義。手牌の並び `codes` だけから数える |
| ③ | **打点見込み** `keepsValue` | **後段で数え直している**（＋公開の口） | `valueTile`（**L4656〜L4664・9行**）。材料は `t.red`／**`window._doraCode`（L2371 で公開）**／字牌の対子 |
| ④ | **受け入れの種類数** `acc` | **後段で数え直している。ただし中身は写し** | `acceptTypes`（**L4669〜L4680・12行**）。その中で `cutShantenMin` を **34回＋1回**呼ぶ |

`analyze()` の内側（`shanten` L2690〜L2777 ほか）から取っている段は **0段**。

＊`analyze()` の戻り値には `baseShanten` / `acceptTypes` / `doraValue` / `doraCount` / `redCount` /
　`yakuhaiPair` が並ぶが、**どれも手を丸ごと見た一つの答え**。切り候補が要るのは
　**「この一枚を切ったらどうなるか」の牌ごとの答え**なので使えない。
　ドラについては、要るのは**牌の名**で、戻り値には入っていない。

## 持ち上げるのは `shanten` だけで足りるか

> **足りる。四段ぶんは要らない。**`shanten`（L2690〜L2777・88行）を外へ持ち上げれば
> ①と④は片づき（④は `cutShantenMin` を呼ぶだけ）、②は写しではないので持ち上げる相手が無く、
> 残る③の `window._doraCode` は **甲＝`analyze()` の戻り値に `doraCode` を一つ足す**で始末する
> （値は L2369 の `indicatorToDora` L2303〜L2314 が既に出している）。

## ③の始末は 甲 に決まった（2026-09-09 の裁定）

- **甲** … `analyze()` の戻り値に `doraCode` を足す ← **採る**
- 乙 … `indicatorToDora` をもう一つ持ち上げる ← 持ち上げる関数が二つに増え、写しを廃す件が広がるので**採らない**
- 丙 … `window` に口を開けたまま ← ①の前提として初めから外してあるので**採らない**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **188件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`ヨシの猫の組み直し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E7%B5%84%E3%81%BF%E7%9B%B4%E3%81%97.md) | 09-09 19:26 | ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる** |
| [`ヨシの猫のマス目.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E3%83%9E%E3%82%B9%E7%9B%AE.md) | 09-09 16:38 | ヨシの猫を差し替え-1 — マス目の割り出しと、箱を上げる案 |
| [`土台の直し-1の四段.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%9B%9B%E6%AE%B5.md) | 09-09 13:02 | 土台の直し-1 ① — 四段の材料の出どころ（名指しの一覧） |
| [`ヨシの猫を差し替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%82%92%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88-1.md) | 09-09 13:02 | ヨシの猫を差し替え-1 — 素材を測った。**輪郭が潰れるので止まる** |
| [`巡回の止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-09 12:16 | 巡回の止まり-1 — 11:02〜11:45 の43分 |
| [`土台の直し-1の材料.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E6%9D%90%E6%96%99.md) | 09-09 11:59 | 土台の直し-1 ① — 切り候補の四段は、いまどこから値を取っているか |
| [`猫を全部白へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%82%92%E5%85%A8%E9%83%A8%E7%99%BD%E3%81%B8-1.md) | 09-09 11:06 | 猫を全部白へ-1 — 頭の猫が地に沈む件（全状態） |
| [`黒猫の待機-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-3.md) | 09-09 09:54 | 黒猫の待機-3 — ヨシ待ちの猫を白から黒へ戻す |
| [`土台の直し-1の宣言.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%A3%E8%A8%80.md) | 09-09 05:55 | 土台の直し-1 — 宣言（ヨシ待ち） |
| [`serifuの再抽出.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/serifu%E3%81%AE%E5%86%8D%E6%8A%BD%E5%87%BA.md) | 09-09 04:50 | serifu.txt / serifu-adv.txt の再抽出（作法17） |
| [`兎の台詞-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E5%8F%B0%E8%A9%9E-1.md) | 09-09 03:27 | 兎の台詞-1（出し直し）— serifu.txt の中の兎 |
| [`写しの重さ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%87%8D%E3%81%95-1.md) | 09-08 22:26 | 写しの重さ-1 — note-at-stop.txt は帳面として太るか |
| [`取り残しの検収-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97%E3%81%AE%E6%A4%9C%E5%8F%8E-1.md) | 09-08 22:03 | 取り残しの検収-1 |
| [`前の仕事の取り残し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%89%8D%E3%81%AE%E4%BB%95%E4%BA%8B%E3%81%AE%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97.md) | 09-08 21:15 | 前の仕事の取り残し — 次の指示が先に来た回の落ち |
| [`終わりの札-2の検収.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2%E3%81%AE%E6%A4%9C%E5%8F%8E.md) | 09-08 20:28 | 終わりの札-2 の検収と、窓の幅の裁定材料 |
| [`終わりの札-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2.md) | 09-08 20:03 | 終わりの札-2 — 終わりの札が立たない根を直す |
| [`止まりの見分け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AD%A2%E3%81%BE%E3%82%8A%E3%81%AE%E8%A6%8B%E5%88%86%E3%81%91-1.md) | 09-08 19:03 | 止まりの見分け-1 — 生存が書かれないのに「作業中」が延び続ける件 |
| [`猫の矛盾-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E7%9F%9B%E7%9B%BE-1.md) | 09-08 11:18 | 猫の矛盾-1 — 走っているのに頭の猫が寝ている件 |
| [`終わりの札-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-1.md) | 09-08 09:40 | 終わりの札-1 — 終わった知らせが手元に残らない件 |
| [`検査の重さ-1の調べ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9-3.md) | 09-08 07:57 | 検査の重さ-1 の調べ — 四つの数と、削れそうな所 |

<!-- 控えの一覧 ここまで -->
