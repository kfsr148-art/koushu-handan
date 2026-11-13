# core-battle 1000局を雲で回し直す（r1114-battle）

**終わり** — 2026-11-14 02:43（VAIO）。残り0件。本体は触っていない（測るだけ・v1470 のまま）。

| 項目 | 結果 |
|---|---|
| 回し方 | 雲（job.yml・ubuntu-latest）で scratchpad/jobs/core-battle-1000.js。npm ci のあと 250局×4本を並べ、762秒で1000局（4000行）を打ち切った。VAIO の空きは食っていない。 |
| 記録 | reports/cloud-core-battle-1000-20261113-172926.md（表）／.tsv（今回の4000行） |

## 攻めと出た手・守りと出た手（母集団は機械打ち同士）

| | 手 | 和了率 | 放銃率 | 平均の点棒 |
|---|---|---|---|---|
| 8月28日・攻め（1000局） | 1939 | 25.7% | 12.5% | +568 |
| **今回・攻め（1000局）** | **1044** | **31.3%** | **12.5%** | **+1107** |
| 8月28日・守り | 2061 | 17.0% | 13.2% | −200 |
| **今回・守り** | **2956** | **17.9%** | **13.1%** | **−134** |

**一行：良くなった——攻めと出た手は和了率 25.7→31.3%・平均 +568→+1107点（放銃率は12.5%のまま）、守りと出た手も −200→−134点。ただし攻めと出す割合は 48%→26% に減り、攻めの判定が厳しく（選り抜きに）なった分の上積みが大きい。**

＊局は毎回でたらめに配られるので、同じ手を比べたものではない（どちらも1000局の母集団どうし）。
＊8月28日の数字はリポジトリ直下の core-battle-log.tsv（commit 11cb3aed のまま変わっていない）から数えた。
＊VAIO で先に回した分は、空きメモリ不足で95局で止められたので使っていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **661件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`cloud-check-fast-20261113-121529.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-121529.md) | 11-13 21:24 | 雲で回した：`check-fast.js` |

<!-- 控えの一覧 ここまで -->
