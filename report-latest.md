# 審判の重み付きの票で、守り→攻めへ移す線の候補（y1114-0258）

**ヨシ待ち（選んでもらう）** — 2026-11-14 02:58（VAIO）。本体は触っていない（測るだけ）。前の「守りの中を点数の帯で分けて移す」案（y1114-0255）は取りやめ。

## 測り方

- 雲の1000局（reports/cloud-core-battle-1000-20261113-172926.tsv・4000手）の一手ずつに、本体の  と審判の票（・・・猫牌の数え方）を本体の字面のまま当て直した（写しを持たない。本判定は記録と4000手とも一致）。判定獣＝本判定。
- **偶数局＝線を決める用（重みもここで決める）／奇数局＝確かめる用。**
- **的中の物差し**：その局で点が増えた手は「攻めが正解」、減った手は「守りが正解」。増減0の手は数えない。地の値は攻めが正解 36.1%・守りが正解 63.9%。
- **重み**：その審判の的中率が地の値をどれだけ上回るか（対数オッズの差）。地より当たらない票は0。得点＝攻めの票の重みの和 − 守りの票の重みの和。

## 審判ごとの精度（決める用・2000手）

| 審判 | 口を開いた割合 | 攻めと言った（的中） | 守りと言った（的中） | 攻めの票の重み | 守りの票の重み |
|---|---|---|---|---|---|
| 執事 | 100.0% | 41.4%（42.1%） | 58.6%（68.0%） | 0.25 | 0.18 |
| 軍師 | 100.0% | 50.9%（41.7%） | 49.0%（70.0%） | 0.23 | 0.28 |
| ずんだ | 30.8% | 20.8%（49.1%） | 10.0%（79.3%） | 0.53 | 0.77 |
| お嬢様 | 100.0% | 53.1%（39.5%） | 46.9%（67.7%） | 0.14 | 0.17 |
| マダム | 30.8% | 8.6%（43.9%） | 22.1%（68.2%） | 0.32 | 0.20 |
| 一姫 | 21.0% | 21.0%（51.0%） | 0.0%（—） | 0.61 | 0.00 |
| 先生 | 24.9% | 10.7%（48.3%） | 14.2%（77.9%） | 0.50 | 0.69 |
| 現場猫 | 23.6% | 8.5%（47.3%） | 15.2%（69.4%） | 0.46 | 0.25 |
| 枝豆 | 100.0% | 50.5%（38.9%） | 49.5%（66.7%） | 0.12 | 0.12 |
| 紳士 | 34.4% | 2.8%（48.8%） | 31.6%（70.4%） | 0.52 | 0.30 |
| 兎 | 59.5% | 33.1%（40.8%） | 26.4%（66.7%） | 0.20 | 0.12 |
| 判定獣 | 100.0% | 26.9%（49.8%） | 73.2%（69.3%） | 0.56 | 0.24 |

いつも口を開く四人（執事・軍師・お嬢様・枝豆）は当たり方が地の値に近く軽い。たまにしか口を開かない審判（ずんだ・先生・一姫・紳士の攻め）が重い。

## 移す線の候補（本判定が守りの手のうち、得点が線を超えたら攻めへ）

| 候補 | 移す手の平均点（決める用／確かめる用） | 攻めの割合 | 攻めの平均点 | 守りの平均点 |
|---|---|---|---|---|
| 今のまま | — | 26.1% | +1107 | −134 |
| **甲 重みの票で攻めが勝てば（得点>0）** | +495／+549 | 44.6% | +864 | −354 |
| **乙 厳しめ（得点>0.45・守りの上位10%）** | +319／+166 | 33.4% | +917 | −175 |
| **丙 ゆるめ（得点>−0.11・守りの上位30%）** | +336／+503 | 47.8% | +795 | −363 |

（割合・平均点は4000手ぜんぶ。和了率・放銃率は 甲 攻め28.9%・12.7%／守り15.3%・13.2%、乙 攻め29.8%・13.1%／守り17.2%・12.9%、丙 攻め28.5%・13.0%／守り14.8%・13.0%。）

- 甲が言葉どおりの形（攻めの票が勝てば移す）。移す742手は両方の半分で +500前後と揃っていて、前の帯の案（±300のぶれの内）より確か。
- 乙は移す数が少なく、守りの平均点はあまり下がらない（守り＝オリから遠い）。丙は甲より少し多く移す。

## 気をつける所

- 母集団は機械打ち同士で、判定の字は打ち方を変えていない。実際に「守り＝完全にオリ」で打てば守りの手の結末は変わる。
- 重みは決める用だけで決めた。確かめる用で崩れていないことを頼りにしている。
- 本体を直す時は、判定の物差しと投票欄の重みに手を入れるので、宣言とヨシを取り直してから。

## 選び方

「y1114-0258 に 甲」「y1114-0258 に 乙」「y1114-0258 に 丙」のように返してほしい。選ばれた線で本体を直す宣言を出す。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **663件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`cloud-check-fast-20261113-141206.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-141206.md) | 11-13 23:15 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-140705.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-140705.md) | 11-13 23:09 | 雲で回した：`check-fast.js` |
| [`y1113-2126.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2126.md) | 11-13 22:22 | 写真取込の三件（y1113-2126・v1463〜v1465） |
| [`cloud-check-fast-20261113-131005.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-131005.md) | 11-13 22:15 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-130004.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-130004.md) | 11-13 22:09 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-124356.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-124356.md) | 11-13 21:47 | 雲で回した：`check-fast.js` |
| [`y1113-2057.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2057.md) | 11-13 21:39 | 横画面で場を押すと並びがずれる（y1113-2057・v1462） |

<!-- 控えの一覧 ここまで -->
