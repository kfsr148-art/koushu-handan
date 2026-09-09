# 土台の直し-1 ① — 切り候補の四段は、いまどこから値を取っているか

**結論 … `shanten` を持ち上げるだけで片づくのは ①と④。②は持ち上げる相手が無く、
③は `window` に開けた口に頼っている。**四段ぶん持ち上げる話にはならないが、
**③だけは別の始末が要る。**

## 四段の並び（本体 L4692）

```js
const key = [st, rank, keepsValue, -acc, i];
```

| 段 | 名 | 値をどこから取っているか | 分類 |
|---|---|---|---|
| ① | **向聴最小** `st` | `cutShantenMin(left.concat([fill]))` → `cutShanten` | **写し** |
| ② | **孤立牌の順** `rank` | `lonelyRank(code, all)` … `pickCutTile` の中で定義。手牌の並び（`codes`）だけから数える | **後段の数え直し** |
| ③ | **打点見込み** `keepsValue` | `valueTile(code, t)` … 材料は `t.red`（牌そのもの）／**`window._doraCode`**（本体 L2371 で公開）／字牌の対子（`codes` から数える） | **後段の数え直し＋公開の口** |
| ④ | **受け入れの種類数** `acc` | `acceptTypes(left)` … 中で `cutShantenMin` を **34回＋1回**呼ぶ | **写し**（①と同じ） |

**`analyze()` の内側から取っている段は一つも無い。**①と④は写し経由、②③は `pickCutTile` の中で新しく数えている。

## `analyze()` が返している値との関係

`analyze()` の戻り値には、名前だけ見れば近いものが並んでいる。

```js
return { … hasValue, valueSources, doraValue, doraCount, redCount, yakuhaiPair, verdict,
         baseShanten, acceptTypes, acceptTiles, … };
```

しかし**どれも「手を丸ごと見た一つの答え」**で、切り候補が要るのは
**「この一枚を切ったらどうなるか」の牌ごとの答え**。だから使えない。

- `baseShanten` … 13枚のときの向聴。**12枚＋埋め草の向聴**は入っていない
- `acceptTypes` … その手の受け入れ種類数。**一枚切った後**の種類数は入っていない
- `doraValue` / `doraCount` … **枚数と価値**。`pickCutTile` が要るのは
  **ドラの牌の名**（`_doraCode`）で、これは戻り値に**入っていない**

## 持ち上げるのは `shanten` だけで足りるか

| 段 | `shanten` の持ち上げで片づくか | 理由 |
|---|---|---|
| ① 向聴最小 | **片づく** | `cutShanten` は `shanten` と名前以外同一（実行59行のうち58行一致）。`cutShantenMin` は `shanten` が既に返す三役の最小を取り直しているだけ |
| ④ 受け入れの種類数 | **片づく** | `acceptTypes` は `cutShantenMin` を呼ぶだけ。①が片づけば同時に片づく |
| ② 孤立牌の順 | **片づかない（が、要らない）** | `lonelyRank` は**写しではない**。`analyze()` の内側に同じ物差しが無い（あちらは孤立牌の**枚数**を数えており、こちらは**切る順**の物差し）。持ち上げる相手がいない |
| ③ 打点見込み | **片づかない。別の手当てが要る** | `window._doraCode`（L2371）に頼っている。これは**作法15「window に診断口を残さない」に触れる形**で v1437 に入った口。`shanten` を持ち上げても消えない |

## ③ の始末（案。まだ決めていない）

| 案 | 中身 | 代償 |
|---|---|---|
| **甲** | `analyze()` の戻り値に **`doraCode` を一つ足す**（値は既に L2369 で持っている） | `analyze()` の戻り値に手を入れる＝**判定の外側だが analyze を触る**。作法5 の宣言に含める要がある |
| **乙** | ドラの名を持つ所（`indicatorToDora`）を `analyze()` の外へ持ち上げ、`pickCutTile` が自分で呼ぶ | `analyze()` に触らずに済む。`shanten` と同じ形の持ち上げが**もう一つ**増える |
| **丙** | `window._doraCode` のまま残す | 作法15 に触れたままになる。**この件の目的（土台を直す）と噛み合わない** |

**乙が `shanten` の持ち上げと同じ形**で、`analyze()` の戻り値にも触らずに済む。
ただし**持ち上げるものが二つ**（`shanten` と `indicatorToDora`）になる。

## まとめ（①への答え）

> 四段のうち **`analyze()` の内側から取っているものは一つも無い**。
> ①④は写し（`cutShanten` / `cutShantenMin`）から、②③は `pickCutTile` の中の数え直しから取っている。
> **`shanten` を外へ持ち上げれば ①④は片づき、②は元々持ち上げる相手が無い。**
> 残るのは ③ の `window._doraCode` だけで、ここは **`indicatorToDora` をもう一つ持ち上げる**か、
> **`analyze()` の戻り値に `doraCode` を足す**かの裁定が要る。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **183件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`検査の重さ-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-08 00:50 | 検査の重さ-1 の調べ — 21視野の一回に、何がどれだけ掛かっているか |
| [`配牌の目安-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%85%8D%E7%89%8C%E3%81%AE%E7%9B%AE%E5%AE%89-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:18 | 配牌の目安-1 の調べ — 13枚から何を持っているか |
| [`押し引き表-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8A%BC%E3%81%97%E5%BC%95%E3%81%8D%E8%A1%A8-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:15 | 押し引き表-1 の調べ — 判定盤が持っている物・持っていない物 |

<!-- 控えの一覧 ここまで -->
