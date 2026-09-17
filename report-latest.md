# 夜の較正-2

**終わり（残り0件）** — 2026-09-18（VAIO）。**本体には触っていない**。数字まで。

## ① 昨夜の走り … **起きた**

| | |
|---|---|
| 走り番号 | **35269084117** |
| 起き方 | **schedule**（`battle.yml` の `cron: '0 17 * * *'` ＝ JST 02:00） |
| 刻 | **2026-09-18 05:09:10 → 07:15:38（126分）** |
| 結果 | **success** |
| 中身 | battle(1) 05:09:13→07:15:37（126分）／battle(2) 05:09:14→07:11:37（122分）。各5000局＝**各20000手** |

＊**cron は 02:00 のつもりが、実際に立ったのは 05:09。** GitHub の schedule は混み具合で遅れる決まりで、
　今回は **3時間9分**遅れて立った。走り自体は毎晩立っている（09-16 05:07／09-17 04:57／09-18 05:09）。

## 台についての断り（先に書く）

**前の三つを測った台（`scratchpad/mix2.js`）は残っていない。** 一時の所に置いたままだったため。
そこで**同じ材料で台を組み直し、四つ全部をその台で測り直した**。

組み直した台と古い台は**高さが違う**。同じ「前の晩40000手」で、

| | 攻めと言った手 | 攻めの平均点棒 |
|---|---|---|
| 古い台（残っていない） | 2402手 | +1100 |
| 組み直した台 | **2518手** | **+1083** |

＊古い台は何かで手を絞っていた（子だけ＝1865手、borderline 除く＝2364手のどれとも合わない）。
　絞り方が字に残っていないので、**古い三つの数字と新しい数字を直に引き算しない**。
　下の③は**四つとも同じ台で測り直した値**で並べる。

## ② 今朝の数字（手数を揃えた土俵）

決め用＝局の前75%／測り用＝後25%。八人の点数は「材料の値ごとの点棒の平均」を決め用で作り、
点棒への最小二乗（切片つき）で重みを決めた。判じは「上から本判定と**同じ手数**だけ攻めにする」。

| 台 | 手数 | 全部の平均 | 本判定の攻め | 八人（手数を揃えた） | 差 |
|---|---|---|---|---|---|
| **今朝1（09-18）** | 20000 | +182 | +996（1308手） | **+1266** | **+270** |
| **今朝2（09-18）** | 20000 | +173 | +909（1337手） | **+1094** | **+185** |
| **今朝の二本合わせ** | 40000 | +178 | +952（2645手） | **+1157** | **+205** |

## ③ 四つの差を並べる

| 台 | 組み直した台の差 | （参考）古い台の差 |
|---|---|---|
| 前の晩40000手 | **+90** | +179 |
| seed1（09-15） | **+211** | +218 |
| seed2（09-15） | **+106** | +223 |
| **今朝（09-18・二本合わせ）** | **+205** | — |

**向きは四つとも揃っている（八人の重み付きが本判定を上回る側で、一度も逆転していない）。
幅は +90〜+211 と倍以上に散り、今朝の +205 はその上寄りで、古い台の三つ（+179〜+223）の帯とも重なる。**

＊今朝の二本の間でも +270 と +185 で 85点の開きがある。**同じ晩・同じ作りでもこれだけ揺れる**ので、
　一本の数字を根拠に動かないほうがよい（夜の較正-1 で見た seed 間の揺れと同じ性質）。

## 触った所と触らない所

**触った所** … 無し（数えただけ）。台は scratchpad の `mix18.js`（読むだけ）。

**触らない所** … 本体（`koushu-handan.html`）・`core-battle-log*.tsv`・`BASE_CURVE`（実測帳の下敷き）・
`battle.yml`・八人の重み・説明欄の数字。**工事は何も入れていない。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **259件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0918-0716.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0716.md) | 09-18 07:19 | 夜の較正-2 |
| [`y0918-0352.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0352.md) | 09-18 03:56 | 止まりの札の敷居-1 |
| [`y0917-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2140.md) | 09-17 21:35 | 呼び名の揃え-1 の下調べ |
| [`y0917-2122.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2122.md) | 09-17 21:25 | 問いかけの判じ-1 |
| [`y0917-2102.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2102.md) | 09-17 21:14 | 訴えの棚卸し-1 |
| [`y0917-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2050.md) | 09-17 20:52 | 古い字の掃除-2 |
| [`y0917-2009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2009.md) | 09-17 20:14 | 古い字の掃除-1 |
| [`y0917-1944.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1944.md) | 09-17 19:55 | 押しの詰まり-1 |
| [`y0917-1611.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1611.md) | 09-17 16:26 | 譲りの判じの位置-1 ／ done-stale-note の空振り-1 |
| [`y0917-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1450.md) | 09-17 14:59 | pub-late の予備の数え方-1 ／ 13:32 の done-stale-note ／ 13:13 の見張りの止まり |
| [`説明欄の直し-v1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E7%9B%B4%E3%81%97-v1450.md) | 09-17 13:32 | 説明欄「二、どう使うの？」の直し（v1450） |
| [`y0917-1145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1145.md) | 09-17 12:48 | 説明欄の点検-1（六節の字と、いまの本体の食い違い） |
| [`猫牌率のEF-v1449.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AEEF-v1449.md) | 09-16 21:26 | 実測帳の E 甲・F 乙（v1449） |
| [`y0916-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-1900.md) | 09-16 19:04 | E と F の字（猫牌率・候補の外の二つ） |
| [`猫牌率の文の直し-v1448.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%96%87%E3%81%AE%E7%9B%B4%E3%81%97-v1448.md) | 09-16 13:09 | 猫牌率の文の直し（v1448）と、候補の外の二つ |
| [`y0916-0707.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0707.md) | 09-16 07:09 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`y0916-0436.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0436.md) | 09-16 07:06 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`猫牌率の下敷きの入れ替え-v1447.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-v1447.md) | 09-16 04:35 | 猫牌率の下敷きの入れ替え（v1447） |
| [`猫牌率の測り直し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%B8%AC%E3%82%8A%E7%9B%B4%E3%81%97-2.md) | 09-15 22:31 | 猫牌率の測り直し-2 |
| [`猫牌率の下敷きの入れ替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-1.md) | 09-15 21:07 | 猫牌率の下敷きの入れ替え-1 の下調べ |

<!-- 控えの一覧 ここまで -->
