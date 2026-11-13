# 席を外した版（v1471）で雲1000局を回し直し、②の重みを測り直した（y1114-0431）

**ヨシ待ち（本体の工事の宣言）** — 2026-11-14 04:31（VAIO）。

## ① 席を外した版（v1471・aae1ff5c）

雲の速い版は全てPASS（⑩ 攻守の境目＝子の線だけ・席の名残なし も）・配信済み。
雲の1000局の4000手で前の版（v1470）と比べると：変わらない3912手、**攻→守88手**（親の手48＝親の甘めが外れた分・子の手40＝場風東や自風の対子が役牌から外れた分）、守→攻0。

## ② 席を外した版で雲1000局（reports/cloud-core-battle-1000-20261113-191605.md・.tsv）

| | 手 | 和了率 | 放銃率 | 平均の点棒 |
|---|---|---|---|---|
| 8月28日・攻め | 1939 | 25.7% | 12.5% | +568 |
| 11月13日（v1470）・攻め | 1044 | 31.3% | 12.5% | +1107 |
| **v1471・攻め** | **980** | **32.2%** | **11.8%** | **+1250** |
| 8月28日・守り | 2061 | 17.0% | 13.2% | −200 |
| 11月13日（v1470）・守り | 2956 | 17.9% | 13.1% | −134 |
| **v1471・守り** | **3020** | **17.8%** | **12.8%** | **−161** |

## ③ ②（乙＋全部の手で測った重み×重なりの割引＋普段割れる審判同士の一致）を測り直した

v1471 の記録の4000手に、本体の analyze() と審判の票を字面のまま当て直した（本判定は記録と4000手とも一致）。偶数局で重みを決め、奇数局で確かめた。決め直すのは際どい手と良形があと1つ足りない手（1432手）だけ。

| 形 | 守り→攻め（その平均点：決める用／確かめる用） | 攻めの割合 | 攻めの平均点 | 守りの平均点 |
|---|---|---|---|---|
| 今の版（v1471） | — | 24.5% | +1250 | −161 |
| **②（割れる審判の一致を重く）** | 761手 +237（+306／+171） | 43.5% | +807 | −296 |
| ③（②から一致の上乗せを外した物） | 733手 +335（+377／+294） | 42.8% | +858 | −320 |

- ②は両方の半分で移す手がプラスに残った（+306／+171）。席を外す前（+158／+504）と比べ、確かめる用の側が小さくなった。
- この記録では、**一致の上乗せを外した③の方が移す手の平均点が高い**（+335 対 +237）。選ばれたのは②なので、宣言は②で出す。③に替えたい時は言ってほしい。

### 重みの変わり方（攻め／守り）

| 審判 | 席を外す前（v1470） | 席を外した後（v1471） |
|---|---|---|
| 執事 | 0.179／0.131 | 0.031／0.016 |
| 軍師 | 0.098／0.118 | 0.144／0.164 |
| ずんだ | 0.112／0.162 | 0.133／0.166 |
| お嬢様 | 0.094／0.113 | 0.102／0.123 |
| マダム | 0.107／0.065 | 0.132／0.091 |
| 一姫 | 0.608／0.000 | 0.073／0.000 |
| 先生 | 0.105／0.144 | 0.092／0.112 |
| 現場猫 | 0.159／0.086 | 0.202／0.142 |
| 枝豆 | 0.061／0.064 | 0.060／0.062 |
| 紳士 | 0.214／0.122 | 0.147／0.113 |
| 兎 | 0.104／0.066 | 0.099／0.151 |

一姫（役牌の対子・対子4種）の攻めの重みが 0.608 → 0.073 と大きく下がった。席を外して風の対子が役牌から外れ、一姫の「攻め」が当たらなくなった分。執事も 0.179 → 0.031。

## 宣言：②を本体に入れる（y1114-0431）

1. **新しい関数 revoteVerdict(a, catN)** を足す。既存の tenLeans() の票（判定獣を除く11人）を使い、**際どい手（borderline）と、良形が必要数のあと1つ足りない手**（国士・役満の芽は除く）だけ、得点＝攻めの票の重みの和 − 守りの票の重みの和 ＋ 普段割れる審判同士の一致の上乗せ（同じ側に倒れた二人ごとに（1−κ）×二人の重みの相乗平均）を出し、**>0 なら攻め・<0 なら守り・ちょうど0は本判定のまま**。重み（11人の攻め／守り）と κ（11×11）は v1471 の雲1000局の決める用で測った値を定数で埋め、出どころを注記する。
2. 「判定する」の処理で、猫牌の数を出した直後に呼び、決め直した時は a.verdict を差し替える。判定の記録・虎の絵と台詞・カードの言い回しは差し替えた判定に従う。記録には revote（前の判定・得点）を残す。
3. analyze() そのものは変えない（core-probe・core-battle の測りが今の analyze と揃うように）。投票欄の見た目も変えない。
4. 版を v1472 へ（三箇所）・node --check・commit・push・雲の速い版。

**確かめ方**：node で v1471 の記録の4000手に本体から読み出した revoteVerdict を当て、この報告の②と一手残らず同じ決め直し（761手）になること。写しで、決め直す所の手と外の手を判定させて画面の攻守が変わる／変わらないこと。

## 気をつける所

- 母集団は機械打ち同士で、判定の字は打ち方を変えていない。実際に「守り＝完全にオリ」で打てば守りの手の結末は変わる。
- 一局で数千点動くので、数百手の平均には ±200〜300 のぶれがある。

「y1114-0431 にヨシ」（②で入れる）、または「y1114-0431 に ③」のように返してほしい。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **670件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1114-0431.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0431.md) | 11-14 04:31 | 席を外した版（v1471）で雲1000局を回し直し、②の重みを測り直した（y1114-0431） |
| [`cloud-core-battle-1000-20261113-191605.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-core-battle-1000-20261113-191605.md) | 11-14 04:29 | 雲で回した：`core-battle-1000.js` |
| [`cloud-check-fast-20261113-190543.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-190543.md) | 11-14 04:08 | 雲で回した：`check-fast.js` |
| [`y1114-0333.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0333.md) | 11-14 03:33 | 選ばれた組み合わせを測った結果（y1114-0333）——本体を直す前の確かめ |
| [`y1114-0321.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0321.md) | 11-14 03:22 | 重みを「本判定と食い違った手」だけで測る（y1114-0321） |
| [`y1114-0304.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0304.md) | 11-14 03:04 | 際どい手と攻守の線に近い手だけを、審判の重み付きの票で決め直す（y1114-0304） |
| [`y1114-0300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0300.md) | 11-14 03:01 | 審判の重み付きの票（精度×重なりの割引）で、守り→攻めへ移す線の候補（y1114-0300） |
| [`y1114-0258.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0258.md) | 11-14 02:58 | 審判の重み付きの票で、守り→攻めへ移す線の候補（y1114-0258） |
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

<!-- 控えの一覧 ここまで -->
