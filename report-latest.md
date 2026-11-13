# 読取釦から受付ページへ直に飛ぶ（y1114-0144・v1470）／core-battle の回し直し

**終わり（残り1件：core-battle 1000局の回し直しは指示待ち）** — 2026-11-14 02:05（VAIO）。

| 番号 | 結果 |
|---|---|
| 読取 | v1470（7ecf0660）。本体の下の段の「読取」は、貼り付けの枠（途中の画面）を挟まず、テンプレ登録の印を外してすぐ受付ページ（カメラで撮る／写真を選ぶ）へ飛ぶ。雲の速い版は全てPASS・配信済み。 |
| core-battle 1000局 | 未了：01:39 に始めたが、空きメモリ不足で Claude Code の見張りが止めた（95局まで）。一局7.7秒で1000局は約2時間。自分からは回し直さない。 |

## 実測

**読取**（写し）：押すと受付ページに着き、カメラで撮る・写真を選ぶの釦がある。取込の画面は一度も出ず、テンプレ登録の印も外れた。

**core-battle**（本体は無変更）

| | 手 | 和了率 | 放銃率 | 平均の点棒 |
|---|---|---|---|---|
| 8月28日・攻め（1000局） | 1939 | 25.7% | 12.5% | +568 |
| 8月28日・守り | 2061 | 17.0% | 13.2% | −200 |
| 今回・攻め（95局で止まった分） | 85 | 27.1% | 14.1% | +259 |
| 今回・守り（同） | 295 | 23.4% | 13.2% | +159 |

＊今回分は手数が少なく、8月28日と比べて良くなったか悪くなったかは言えない。回し直すなら、雲（job.yml・VAIO の空きを食わない）か夜の空いた時間に。

## 実機で見る所

本体の下の段の「読取」を押すと、すぐ受付ページ（カメラで撮る／写真を選ぶ）が出る。版の字が v1470。

---

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **658件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1114-0144.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0144.md) | 11-14 02:05 | 読取釦から受付ページへ直に飛ぶ（y1114-0144・v1470）／core-battle の回し直し |
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
| [`y1113-2020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2020.md) | 11-13 20:39 | 写真取込の後、上の写真を手牌の帯だけに切り抜く（y1113-2020・v1460） |
| [`cloud-check-fast-20261113-112830.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-112830.md) | 11-13 20:33 | 雲で回した：`check-fast.js` |
| [`y1113-1931.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-1931.md) | 11-13 19:58 | 写真取込の後、横画面で下の釦が切れる（y1113-1931・v1459） |

<!-- 控えの一覧 ここまで -->
