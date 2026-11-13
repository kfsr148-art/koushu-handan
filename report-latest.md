# 守りの中で点が取れている手を攻めへ移す候補（y1114-0255）

**ヨシ待ち（選んでもらう）** — 2026-11-14 02:55（VAIO）。本体は触っていない（測るだけ）。

## やったこと

雲の1000局（reports/cloud-core-battle-1000-20261113-172926.tsv・4000手）を、**偶数局＝線を決める用／奇数局＝確かめる用**に半分ずつ分けた。線を決める用の守りの手（1463手）を、向聴・受け入れ・打点・役牌の対子・良形の数・親で帯に分け、平均点がプラスの帯を探した。プラスに見えた帯は、役牌の対子あり（+189）・良形3つ以上（+28、4向聴の中では+321）・受け入れ35〜49（+71）・ドラ1（+33）。それを組んだ移す候補を、確かめる用で当て直した。

**役牌の対子ありは確かめる用で −146 に落ちたので外した**（決める用だけの偶然）。良形3つ以上を軸にした物が、両方の半分でプラスに残った。

## 移す候補（守り→攻め）

| 候補 | 移す手（4000手中） | 移す手の平均点（決める用／確かめる用） | 攻めの割合 | 攻めの平均点 | 守りの平均点 |
|---|---|---|---|---|---|
| 今のまま | 0 | — | 26.1% | +1107 | −134 |
| **A 良形3つ以上・かつ打点の種あり（ドラ1以上か役牌の対子）** | 493 | +69±302／+458±262 | 38.4% | +838 | −214 |
| **B 良形3つ以上・かつ受け入れ40枚以上** | 875 | +152±211／+326±197 | 48.0% | +711 | −290 |
| **C 良形3つ以上・かつ4向聴以内** | 1265 | +89±178／+338±173 | 57.7% | +616 | −392 |

（攻め・守りの平均点と割合は4000手ぜんぶで数えた値。±は平均の標準誤差。）

- A は移す数が少なく攻めの平均点が高いまま。B は守りがほぼ半分に減る。C は守りの平均点がいちばん低くなり「守り＝オリ」にいちばん近いが、攻めが6割に増える。
- 和了率・放銃率：A 攻め 28.4%・13.3%／守り 17.0%・12.8%、B 攻め 27.4%・12.8%／守り 15.9%・13.1%、C 攻め 26.1%・13.5%／守り 14.9%・12.2%。

## 気をつける所

- **点のぶれが大きい。** 一局で数千点動くので、数百手の帯でも平均に ±200〜300 のぶれがある。決める用だけで見ると A・C はプラスとは言い切れない（ぶれの内）。両方の半分でプラスに残ったことを頼りにしている。
- **母集団は機械打ち同士で、判定の字は打ち方を変えていない。** 実際に「守り＝完全にオリ」で打てば、守りの手の点（放銃が減る・和了も減る）は変わる。ここで比べたのは「同じ打ち方での結末」。
- 本体を直す時は、判定の物差し（analyze の攻守の線）に手を入れるので、宣言とヨシを取り直してから。

## 選び方

「y1114-0255 に A」「y1114-0255 に B」「y1114-0255 に C」のように、選んだ候補を返してほしい。選ばれた物で本体を直す宣言を出す。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **662件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1114-0255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0255.md) | 11-14 02:55 | 守りの中で点が取れている手を攻めへ移す候補（y1114-0255） |
| [`r1114-battle.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1114-battle.md) | 11-14 02:43 | core-battle 1000局を雲で回し直す（r1114-battle） |
| [`cloud-core-battle-1000-20261113-172926.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-core-battle-1000-20261113-172926.md) | 11-14 02:43 | 雲で回した：`core-battle-1000.js` |
| [`y1114-0144.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0144.md) | 11-14 02:08 | 読取釦から受付ページへ直に飛ぶ（y1114-0144・v1470）／core-battle の回し直し |
| [`cloud-check-fast-20261113-165458.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-165458.md) | 11-14 02:08 | 雲で回した：`check-fast.js` |
| [`r1114-camera-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1114-camera-2.md) | 11-14 01:34 | 受付ページのカメラの見分けをゆるめる（r1114-camera-2） |
| [`r1114-camera.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1114-camera.md) | 11-14 01:22 | 受付ページの中のカメラと、手牌の目印・自動で撮る（r1114-カメラ） |
| [`y1114-0022.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0022.md) | 11-14 00:46 | 受付ページで押した時に音を取っておき、読み直さず判定まで進めて声を鳴らす（y1114-0022・v1469） |
| [`cloud-check-fast-20261113-153609.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-153609.md) | 11-14 00:40 | 雲で回した：`check-fast.js` |
| [`y1113-2354.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2354.md) | 11-14 00:17 | 撮って自動で判定した時の声（y1113-2354・v1468） |
| [`cloud-check-fast-20261113-150313.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-150313.md) | 11-14 00:07 | 雲で回した：`check-fast.js` |
| [`y1113-2241.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2241.md) | 11-13 23:25 | 写真取込の読み直し（y1113-2241・v1466→v1467） |
| [`cloud-check-fast-20261113-141206.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-141206.md) | 11-13 23:15 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-140705.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-140705.md) | 11-13 23:09 | 雲で回した：`check-fast.js` |
| [`y1113-2126.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2126.md) | 11-13 22:22 | 写真取込の三件（y1113-2126・v1463〜v1465） |
| [`cloud-check-fast-20261113-131005.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-131005.md) | 11-13 22:15 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-130004.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-130004.md) | 11-13 22:09 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-124356.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-124356.md) | 11-13 21:47 | 雲で回した：`check-fast.js` |
| [`y1113-2057.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2057.md) | 11-13 21:39 | 横画面で場を押すと並びがずれる（y1113-2057・v1462） |
| [`cloud-check-fast-20261113-122520.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-122520.md) | 11-13 21:28 | 雲で回した：`check-fast.js` |

<!-- 控えの一覧 ここまで -->
