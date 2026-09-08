# 土台の直し-1 — 宣言（ヨシ待ち）

**まだ何も実装していない。**この一枚にヨシをもらってから実装へ入る。
印は **`y0909-1`**。

## 測って分かったこと（宣言の土台）

| 関数 | 位置 | 行数 | |
|---|---|---|---|
| `analyze` | L2501〜L3135 | 635行 | 判定そのもの |
| **`shanten`** | **L2690〜L2777** | **88行** | `analyze()` の中の向聴の物差し |
| `cutShanten` | L4525〜L4612 | 88行 | **その写し** |
| `cutShantenMin` | L4617〜L4629 | 13行 | 七対子・国士の最小を取り直す包み |
| `pickCutTile` | L4637〜L4693 | 57行 | 切り候補を選ぶ（写しを呼ぶ側） |

### ① 写しは、名前以外まったく同じ

空白と註を落として突き合わせた実測：

```
本体 shanten の実行行 59行 ／ 写し cutShanten 59行
一致 58行 ／ 違う 1行
    本体: function shanten(tiles, mode){
    写し: function cutShanten(tiles, mode){
```

**違いは関数の名だけ。**

### ② `cutShantenMin` は三つ目の写し

`shanten` は末尾（L2760〜L2776）で七対子・国士も測り、
`return Math.min(minSt, chiitoiSt, kokushiSt);` と**三役の最小を返している**。
`cutShanten` にも同じ式が入っている（`chiitoiSt` 2回・`kokushiSt` 2回、本体側と同数）。
その上に `cutShantenMin` が**もう一度**同じ最小を取り直している。

### ③ `shanten` は純粋 — だから外へ出せる

`analyze()` の閉包の名を、`shanten` の中から一つも参照していない。

```
rhand 0回 ／ catCount 0回 ／ hand 0回 ／ tilesArray 0回 ／
normalizeForShanten 0回 ／ bestShapeOneSuit 0回
```

**`window` に診断口を開ける必要は無い**（作法15 に触れずに済む）。
`analyze()` の一つ外の段へ、そのまま持ち上げるだけでよい。

## 何をどう変えるか

### 触る所

| # | 何を | どこ | どうする |
|---|---|---|---|
| 1 | `shanten` | L2690〜L2777 | **`analyze()` の外へ持ち上げる**。本文は一字も変えない。名も変えない |
| 2 | `analyze()` の中の `shanten(...)` 呼び出し | L2816・2822・2829・2842・2853・2860 ほか | **一字も変えない**（名が同じなので、そのまま外の一つを呼ぶ） |
| 3 | `pickCutTile` | L4637〜L4693 | `cutShanten` → `shanten`、`cutShantenMin` → `shanten` へ向け直す |
| 4 | `cutShanten` | L4525〜L4612 | **削る**（88行） |
| 5 | `cutShantenMin` | L4617〜L4629 | **削る**（13行） |
| 6 | `check.js` ㉒ | L1849〜 | 写しが消えるので役目が終わる。**「写しが無いこと」を見る節へ置き換える** |
| 7 | `check.js` に一節追加 | 末尾 | **第一感が変わっていないこと**を字面と値の両方で見る（下記） |
| 8 | `CLAUDE.md` 作法5 | — | 「変更禁止」→「**宣言とヨシを取ってから**」。**ヨシの後に直す** |

＊本体から **101行**（88＋13）が消え、`analyze()` の外へ88行が移る。増える行は無い。

### 触らない所（宣言して固定する）

- **`analyze()` の判定そのもの** … 返す値の組み立て、攻守の裁き、`borderline` などの閾値
- **`bestShapeOneSuit`**（作法5 のもう一方）
- **位相の鍵**（`watch-notify.ps1` の `$key`）
- **札の作り**（`Record-Notice` ／ `notify-record.ps1`）
- **一発の印**（`done-said.txt` ／ `done-sweep-said.txt` ほか）
- **人柄の一覧・ランダムの作り・見立ての材料**（`toneFacts`）
- **`panel.html` ／ 見張りの台本一式**

## 第一感が変わらないことの確かめ方（`check.js`）

**字面と値の両方**で見て、一つでも動いたら **FAIL**。

| 見るもの | 方法 |
|---|---|
| **字面** | 持ち上げた `shanten` の実行59行が、移す前と**一字一句同じ**か（移す前の写しを控えて突き合わせ） |
| **値・裁き** | 決まった配牌の並びを流し、**攻め／守りの裁き**が移動前後で全件同じか |
| **値・見立て** | 既定の目（第一感）の**見立て行の文字列**が全件同じか |
| **値・光る牌** | 既定の人柄の**金枠（`multi-mark`）が付く牌**が全件同じか |

＊配牌は種を固定して並べる（同じ手が毎回出る形）。
＊移す前の答えを先に控えてから工事する。**控えが無いまま触らない。**

## 段取りと見込み

| # | すること | 見込み |
|---|---|---|
| 1 | 移す前の答えを控える台を作り、答えを取る | 30分 |
| 2 | `shanten` を持ち上げ、写し二つを削り、`pickCutTile` を向け直す | 30分 |
| 3 | `check.js` の㉒を置き換え、不変の節を足す | 40分 |
| 4 | **フル版（21視野）** ＋ `adv-check` | **約4時間** |
| 5 | 通ってから**一度で** commit → push | 10分 |
| | **合計** | **約6時間**（うちフル版が4時間） |

**本体の工事はフル版が通るまで commit しない**（2026-09-07 の決め・作法18）。
検査が落ちたら、戻さず前へ直してから改めて一度で commit する。

## ヨシをもらいたい点

1. **`shanten` を `analyze()` の外へ持ち上げる**形でよいか（`window` に口を開ける案は採らない）
2. 写し二つ（`cutShanten` 88行・`cutShantenMin` 13行）を**削って**よいか
3. `check.js` ㉒ を**置き換え**てよいか（写しが無くなるため）
4. **作法5** を「変更禁止」→「宣言とヨシを取ってから」へ改めてよいか

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **180件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`最後に受けた枠の撤去-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%80%E5%BE%8C%E3%81%AB%E5%8F%97%E3%81%91%E3%81%9F%E6%9E%A0%E3%81%AE%E6%92%A4%E5%8E%BB-1.md) | 09-06 14:48 | 最後に受けた枠の撤去-1 — パネルからその一行を外した |
| [`帯の中の走り出し-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1-2.md) | 09-06 13:51 | 帯の中の走り出し-1（実地）— 帯が明けた一回で、一本だけ鳴った |
| [`帯の中の試し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%A9%A6%E3%81%97.md) | 09-06 13:24 | 帯の中の試し |

<!-- 控えの一覧 ここまで -->
