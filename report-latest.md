# 兎の台詞-1（出し直し）— serifu.txt の中の兎

**兎の行は三つだけ。しかも話者の欄が無い形で、`[tenLeans]`（投票欄）に並んでいる。
七人の見立て行（`[toneAngleLine]`）には0件。**調べだけで、実装はしていない。

## ① serifu.txt の兎に関わる行

`grep 兎／usagi／USAGI` … **0件。**名前では一行も引っかからない。
字面で探すと三行あり、**話者も鍵の道筋も付いていない**（二欄の形）。

| serifu の行 | 本体の行 | 話者 | 鍵の道筋 | 本文 |
|---|---|---|---|---|
| 7685 | 4160 | **無い** | **無い** | ブロックが余っている。攻めだ。 |
| 7686 | 4161 | **無い** | **無い** | 残り枠が愚形で詰まる。守りだ。 |
| 7687 | 4161 | **無い** | **無い** | 形が足りない。守りだ。 |

節は `[tenLeans]　4100行〜 : 投票欄のアイコンを押したときの一行`。
七人が持つ `行番号 ｜ 話者 ｜ 鍵の道筋 ｜ 本文` の四欄ではなく、**`行番号 ｜ 本文` の二欄**。

### 兎が担当する分岐

`usagiLean()`（本体 L4087〜）の枝は四つ。

```js
if (a.fillWeak === 0) return 'a';                       // ③ 攻
if (a.fillWeak >= 2) return 'd';                        // 守
if (a.fillGood >= 3 && a.goodShapes <= 3) return 'd';   // 守
return '';                                              // 黙る（票も出ない）
```

**③ `fillWeak === 0` の攻で出る行は在る**——`ブロックが余っている。攻めだ。`（serifu 7685／本体 4160）。
名指しできる。残り二つの守りの行も在る。**黙る枝には行が無い**（そもそも喋らない枝）。

### 切り候補の一行は serifu に無い

```js
// 本体 L4880
return tileChip(c.code) + 'が浮いている。切りだ。';
```

`が浮いている。切りだ。` を serifu.txt で探すと **0件**。
**実行時に牌の字と繋いで組む形**なので、`serifu-extract.js` の目に入らない。
`攻めだ。` の三行が拾えているのは、あちらが**丸ごと一つの字面**として書かれているから。

＊**いま `serifu.txt` は本体とずれている**（`node serifu-extract.js --check` が
　「serifu.txt が本体とずれています」「serifu-adv.txt が本体とずれています」）。
　作法17 の再抽出が要る。**この回は調べだけなので回していない。**

## ② 七人と同じ形で言えるか

### 尺に収まる型は在るか → **無い**

| | |
|---|---|
| 七人の見立て行 | `[toneAngleLine]　4704行〜`。**兎の出現 0件** |
| 兎が持つ三行の長さ | **15字 / 15字 / 11字** |
| 切り候補の一行 | 牌の字を除いて **11字** |
| 七人の見立て行の尺 | 66字目標・77字上限 |

**66字に届く型を、兎は一つも持っていない。**いちばん長い行で15字。
＊見立て行の側も実行時に繋ぐ断片で並んでおり（`… に、` ／ `… を掛け持ちさせております。人手が足りませぬ。`）、
　四欄で並ぶのは判定カードの攻守の一言（`TONE_WORDS`）など、丸ごと書いてある所だけ。

### 語尾・一人称・口癖の被り

兎の三行は**すべて「〜だ。」の言い切り**。一人称は無く、口癖も無い（主語を置かない）。

「だ。」で終わる行を持つ話者を全部数えると：

| 話者 | 行数 | |
|---|---|---|
| **ずんだもん** | **198行** | ← **正面から被る** |
| 枝豆スイッチ | 15行 | ← マスコット四者の一人 |
| 七人共通・青森 | 7行 | 方言チップ |
| 現場猫 | 2行 | マスコット |
| 軍師 | 2行 | |
| 先生 | 1行 | |

**被るのは「ずんだ」と「語尾（だ。）」。**198行と桁が違うので、
兎の言い切りは**ずんだの領分に重なって聞こえる**。
＊一人称は兎に無いので被りようがない。口癖も無い。
＊七人のふだんの語尾は別物——執事「ます」114／軍師「よー」99／お嬢様「すわ」80／
　マダム「ウィ」116／一姫「にゃ」709／先生「ょん」93。ここには被らない。

## ③ 「切るなら〈牌〉」をどの分岐に置くか（いま在る材料だけ）

**新しい台詞は書いていない。**置き場の候補は二つしかない。

| # | 置き場 | いまの中身 | 代償 |
|---|---|---|---|
| **A** | **いまのまま**＝`toolEyeSay('usagi')`（目の釦を押したときの一行・本体 L4877〜4881） | `tileChip(code) + 'が浮いている。切りだ。'` | 押さないと出ない。**判定カードを開いただけでは見えない** |
| **B-1** | `tenLeans` の兎の**③攻**（`fillWeak === 0`・本体 L4155） | `ブロックが余っている。攻めだ。` | 攻めの回にだけ切り牌が出る。**守りの回は出ない**——切り候補がいちばん要るのは守りの回 |
| **B-2** | 同・**守（`fillWeak >= 2`）**（L4156） | `残り枠が愚形で詰まる。守りだ。` | 守りの片方だけ。もう一つの守り（`fillGood>=3 && goodShapes<=3`）では出ない |
| **B-3** | 同・**守（それ以外）**（L4156） | `形が足りない。守りだ。` | 上と同じ、片側だけ |
| **C** | `usagiLean` が `''` を返す**黙る枝** | 行が無い（票も出ない） | **黙りが破れる。**いま兎が黙るのは「言えることが無い」枝なので、ここで喋ると兎の作り自体が変わる |

**人柄の枠（`toneAngleLine` ／ `TONE_WORDS`）は候補に入らない。**
作法20 のとおり兎は人柄七人の担当ではなく、牌も光らせない。ここへ入れると
「見立て行と金枠は必ず同じ材料を指す」という決めと正面からぶつかる。

### 材料から言えること

- **三つの言い切りは、どれも攻守の判じそのもの**（攻めだ／守りだ）。切り牌は**別の材料**
  （`window._lastCut`）なので、B へ置くと**一行に二つの材料が乗る**
- A のままなら材料は一つずつのまま。ただし**押さないと出ない**
- **どの枝も、いま在る言葉に繋ぐ形になる。**新しい一文を足さずに済ませるなら
  A（いまのまま）以外は「既存の一行の後ろへ足す」ことになる

＊**裁定はしていない。実装もしていない。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **178件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`訴えの記録-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A8%98%E9%8C%B2-1.md) | 09-06 12:58 | 訴えの記録-1 — 記録も、種類ごとに一行だけ |
| [`訴えの見直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97-1.md) | 09-06 12:53 | 訴えの見直し-1 — 退避が受けている間は、上限を訴えない |

<!-- 控えの一覧 ここまで -->
