# 検査の重さ-1 の調べ — 21視野の一回に、何がどれだけ掛かっているか

**実装はしていない。**直近の一回（2026-09-07 07:5x〜12:3x）の記録と `check.js` の字面から数えた。

## ① 視野ごとの所要

一回ぶんの全体は **約4時間40分（280分）／21視野＝平均 13.3分/視野**。
途中で拾った刻から、速い所と遅い所がはっきり分かれる。

| 区間 | 視野 | 所要 | 一視野あたり |
|---|---|---|---|
| 08:14 → 10:26 | 1 → 13（12視野） | 132分 | **11.0分** |
| 10:26 → 10:39 | 13 → 15（2視野） | 13分 | **6.5分** |
| 10:39 → 10:56 | 15 → 17（2視野） | 17分 | 8.5分 |
| 10:56 → 12:32 | 17 → 21（4視野） | 96分 | **24.0分** ← 尾が重い |

＊尾が重いのは、後半の視野（800x348 / 800x349 / 800x350 …）で打ち切りが集中したため。

## ② ブラウザの立ち上げ回数

**一つの組み合わせ（画面×視野）につき、毎回一本立ち上げている。**

```
9画面 × 21視野            = 189本
＋ 打ち切りからのやり直し   =  12本
＋ 額縁の較正（最初に一度）  =   1本
                            ─────
                            202本
```

＊立ち上げは `spawnSync(browser, …)`（L764）。**使い回しはしていない。**
＊打ち切った回は、そのつど掃除の手（`powershell` か `pkill`）も起こす（L739・L742）。

## ③ 待ちの秒数

| 何の待ち | 秒 | 回数 | 合計 |
|---|---|---|---|
| 測る前の固定の待ち（`setTimeout(…, 400)` ＋ `setTimeout(measure, 700)`） | **1.1秒** | 189 | **約3.5分** |
| 仮想時間の budget（ふつうの画面） | 9秒 | 168 | 最大25分 |
| 仮想時間の budget（`toriend` だけ） | **70秒** | 21 | **最大24.5分** |
| 額縁の較正 | 3秒 | 1 | 3秒 |

＊budget は「そこまで待つ」ではなく「そこまでの時間を早送りする」上限なので、
　実際にはページが早く終われば短い。**ただし `toriend` は遊びを一度通すので、実測でも長い。**

## ④ 測れなかった回に使った秒数

```
打ち切り（120秒で返らない）        12回 × 120秒 = 1440秒（24分）
やり直しても駄目（もう一度120秒）    6回 × 120秒 =  720秒（12分）
                                            ────────────
                                              2160秒（36分）
```

**全体280分のうち 36分（13%）が、何も測れなかった時間。**
残り244分を189組で割ると **一組あたり約77秒**——ページの待ち（1.1秒）に対して桁が違うので、
**時間のほとんどはブラウザの立ち上げと描き切りに消えている。**

## 削れそうな所（代償つき）

| # | 削り方 | 減る見込み | 代償 |
|---|---|---|---|
| 1 | **ブラウザを使い回す**（一本の中で視野を変えて測る） | 立ち上げ202回→数回。**全体の半分以上** | 起動時の条件（初回描画・`@media` の初回評価）を再現しない。`resize` では出ない溢れを見逃す恐れ。作りの変更が大きい |
| 2 | **画面ごとに視野を絞る**（判定画面だけ21視野、他は代表4視野） | 189組→**53組（72%減）** | 判定以外の画面（title・watch・adv…）の細かい溢れを見逃す。過去に落ちたのは judged が多いので、当たりは悪くない |
| 3 | **打ち切りを120秒→60秒** | 打ち切りの36分→**18分** | 重い日に測れる回が減る。ただし**未測定は落ちにしない**形にしたので、実害は小さい |
| 4 | **`toriend` の budget 70秒を下げる** | 最大24.5分→ 数分 | 勝敗の結果画面を通せなくなる（遊びを一度通す画面なので、短くすると測れない） |
| 5 | **固定の待ち 1.1秒を削る** | **約3.5分** | 測る前に描き切らない恐れ。**効果が小さいので割に合わない** |
| 6 | **二〜三本並べて回す** | 壁時計は半分以下 | 機械が重いと打ち切りが増え、いまでも13%ある未測定がさらに増える。**いちばん危ない** |

**いちばん効くのは 1 と 2。**1 は作りが大きく変わるので、まず 2（画面ごとに視野を絞る）が
費用対効果が高い。3 は小さく確実に効き、既に未測定を落ちにしない形にしてあるので相性がよい。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **166件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`検査の重さ-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-08 00:50 | 検査の重さ-1 の調べ — 21視野の一回に、何がどれだけ掛かっているか |
| [`配牌の目安-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%85%8D%E7%89%8C%E3%81%AE%E7%9B%AE%E5%AE%89-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:18 | 配牌の目安-1 の調べ — 13枚から何を持っているか |
| [`押し引き表-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8A%BC%E3%81%97%E5%BC%95%E3%81%8D%E8%A1%A8-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:15 | 押し引き表-1 の調べ — 判定盤が持っている物・持っていない物 |
| [`最後に受けた枠の撤去-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%80%E5%BE%8C%E3%81%AB%E5%8F%97%E3%81%91%E3%81%9F%E6%9E%A0%E3%81%AE%E6%92%A4%E5%8E%BB-1.md) | 09-06 14:48 | 最後に受けた枠の撤去-1 — パネルからその一行を外した |
| [`帯の中の走り出し-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1-2.md) | 09-06 13:51 | 帯の中の走り出し-1（実地）— 帯が明けた一回で、一本だけ鳴った |
| [`帯の中の試し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%A9%A6%E3%81%97.md) | 09-06 13:24 | 帯の中の試し |
| [`訴えの記録-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A8%98%E9%8C%B2-1.md) | 09-06 12:58 | 訴えの記録-1 — 記録も、種類ごとに一行だけ |
| [`訴えの見直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97-1.md) | 09-06 12:53 | 訴えの見直し-1 — 退避が受けている間は、上限を訴えない |
| [`訴えの数え方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E6%95%B0%E3%81%88%E6%96%B9-1.md) | 09-06 12:48 | 訴えの数え方-1 — 定時の「訴え: N件」を、種類の数にした |
| [`訴えの内訳-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E5%86%85%E8%A8%B3-1.md) | 09-06 12:25 | 訴えの内訳-1 — 31件は何を言っているか（数えただけ） |
| [`帯の中の押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-06 08:43 | 帯の中の押し-1 — 帯の前に押し、帯の間も押しだけは通す |
| [`過去の札の件数-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%81%8E%E5%8E%BB%E3%81%AE%E6%9C%AD%E3%81%AE%E4%BB%B6%E6%95%B0-1.md) | 09-06 03:22 | 過去の札の件数-1 — 「🗄 過去の札」の見出しに件数を出した |
| [`走り出しの題-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%A1%8C-1.md) | 09-06 02:39 | 走り出しの題-1 — 走り出しの題に、仕事の名を入れた |
| [`通知の出口-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-3.md) | 09-06 02:32 | 通知の出口-3 — 見張りの道にも同じ60秒の束ねを置いた |
| [`通知の出口-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-2.md) | 09-06 02:23 | 通知の出口-2 — 出口で60秒のあいだ束ねる |
| [`subj-gapの空振り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/subj-gap%E3%81%AE%E7%A9%BA%E6%8C%AF%E3%82%8A-1.md) | 09-06 01:50 | subj-gapの空振り-1 — 同じ文を違う長さで切っただけ |
| [`入口の時計-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%A5%E5%8F%A3%E3%81%AE%E6%99%82%E8%A8%88-1.md) | 09-06 01:34 | 入口の時計-1 — 入口が20秒を越えた回は、先へ進まずに降りる |
| [`入口の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%A5%E5%8F%A3%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-06 01:27 | 入口の固まり-2 — 入口が重かったのは「足跡の帳面を毎段まるごと読む」から |
| [`地図の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%B0%E5%9B%B3%E3%81%AE%E7%A9%B4-1.md) | 09-06 00:48 | 地図の穴-1 — 八段それぞれの「読む物が壊れたとき」 |
| [`作り値の送り先-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%9C%E3%82%8A%E5%80%A4%E3%81%AE%E9%80%81%E3%82%8A%E5%85%88-1.md) | 09-06 00:34 | 作り値の送り先-1 — 作り値は偽の送り手へ。今夜の分は回し直した |

<!-- 控えの一覧 ここまで -->
