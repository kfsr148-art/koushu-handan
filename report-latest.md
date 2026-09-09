# ヨシの猫を差し替え-1 — 素材を測った。**輪郭が潰れるので止まる**

**差し替えていない。**枠の「潰れるなら縮め率を報告して止まる」に当たった。

## 測った素材

`IMG_8974.png`（リポジトリ直下・103,673バイト）。絵柄は**兜をかぶって指差す現場猫のドット絵**。

| 見たもの | 実測 |
|---|---|
| 寸法 | **480x480** |
| 透過 | **有り**（`a<255` が 134,449画素。四隅は `a=0`） |
| 地が白い四角で埋まっているか | **埋まっていない**（縁の白は 10/1,916＝**0.5%**） |
| 色の種類 | 8,331 |
| 中身の入っている枠 | 480x457（上に22pxの余白） |

**白地を抜く手当ては要らなかった。**もともと透過で切り抜かれている。

## 高さ36pxへ縮めたとき — 輪郭が潰れる

```
中身の枠 480x457 → 38x36   縮め率 **1/12.69**
元の輪郭（黒）の横の連なり : **中央値 5px**（827本で測った）
  → 1/12.69 で縮めると、5px の線は **0.39px 相当**になる
```

**線が一画素に満たない。**輪郭は残りようがない。

数でも出ている。

| 縮め方 | 残った画素 | うち黒（輪郭） | 色の種類 |
|---|---|---|---|
| **最近傍**（ドット絵の作法どおり） | 596 | **133** | 279 |
| 滑らか（参考） | 719 | **49** | 469 |

元の中身は 95,951画素。最近傍は「12.69画素に1つ」を拾うので、
**輪郭に当たるかどうかが運任せ**になり、線が虫食いになる。
滑らかにすると線は灰色へ溶けて、黒は 49画素しか残らない。

> **縮め率 1/12.69。輪郭 5px が 0.39px になる。潰れる。**

## どうすれば通るか（案。まだ何もしていない）

| 案 | 中身 |
|---|---|
| 甲 | **元絵を小さく描き直す**。中身の枠が **180px 前後**（＝縮め率 1/5 まで）なら、5px の線が1pxで残る |
| 乙 | **36px の姿を直接描く**（いまの `cat0-w` 等と同じ 56x36 の世界で描く） |
| 丙 | 頭の猫の箱（`#runcat` の 56x36）を大きくする | 

＊`yoshi-cat.png` は**最近傍で縮めた結果**をそのまま置いてある（2,258バイト・38x36）。
　**panel.html からは呼んでいない。**目で見て確かめてもらうために残した。
＊`panel-icon-white.png` ／ `panel-icon-black.png` は消していない。
＊`IMG_8974.png` も残してある。

## 触っていないもの

`runCatTick` の枝（ヨシ待ち・作業中のコマ送り・寝姿）、先読みの一覧、版の三箇所——
**どれも v126 のまま。**panel-check も回していない（差し替えていないため）。


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
　ここに出るのは新しい20件。全部で **186件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`検査の重さ-1の調べ-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9-2.md) | 09-08 07:12 | 検査の重さ-1 の調べ（出し直し）— 21視野のフル版 一回の内訳 |
| [`黒猫の待機-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-2.md) | 09-08 06:25 | 黒猫の待機-2 — ヨシ待ちの猫が地に沈む件 |

<!-- 控えの一覧 ここまで -->
