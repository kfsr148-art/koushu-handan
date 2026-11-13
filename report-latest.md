# 受付ページのカメラの見分けをゆるめる（r1114-camera-2）

**終わり** — 2026-11-14 01:34（VAIO）。残り0件。受付ページ（reader.html）だけの工事（bc64fe96）。本体は v1469 のまま。

| 項目 | 結果 |
|---|---|
| 見分けをゆるめる | 手牌が枠に大体収まる＝枠の列の55%以上に白い面（前は80%）・枠の上へのはみ出し4割まで（前は25%）。左端＝線の左右8%の中で白い面が始まる列が線から4%以内（前は線のすぐ左右の白の有無）。止まっている＝前の一枚との明るさの差14未満（前は6）。白い面の見分けも少しゆるめた（明るさ120以上・色み80以下）。 |
| 緑になったら必ず撮る | 緑になったら0.5秒後に、途中で外れても撮る。 |
| 合わない時 | 手牌らしい物（枠の列の35%以上に白い面）が3秒続けて見えていれば撮る。 |
| どこが合っていないか | 枠の下に短い字（下に場所が無ければ枠のすぐ上）：手牌が見えません／手牌が枠の上にはみ出しています／手牌を枠いっぱいに／左端が赤い線より右です／左端が赤い線より左です／止めてくださいまし／合いました。そのまま／撮ります。手牌らしい物が見えている間は「（あと N 秒で撮ります）」を添える。 |

## 実測（作り物のカメラに作り画面の動画を流し、実時間で）

| カメラに映した物 | 枠の色 | 枠の下の字 | 撮ったか・その後 |
|---|---|---|---|
| 手牌を枠にぴったり | 2.3秒で緑 | 止めてくださいまし→合いました。そのまま→撮ります | 撮った。判定 13/13・声 |
| 3%右へずれ＋手ぶれ（3枚を代わる代わる） | 1.3秒で緑 | 合いました。そのまま→撮ります | 撮った。判定 13/13・声 |
| 8%右へずれ（合わない） | 金のまま | 左端が赤い線より右です（あと3→2→1秒で撮ります） | 約3.7秒で撮った。判定 13/13・声 |
| 手牌なし | 金のまま | 手牌が見えません | 撮らない |

## 気をつける所

- 作り物のカメラと作り画面での結果。実際のテレビで合わない時は、枠の下の字で何が外れているかを見て教えてほしい。
- 字の言い回しは今の形のまま。違えば言ってほしい。

## 実機で見る所

受付ページで「📷 カメラで撮る」→ 手牌を大体枠に入れる → 枠が緑になって撮れる。合わない時も、枠の下の字（例「左端が赤い線より右です（あと2秒で撮ります）」）が出て、3秒ほどで撮れる。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **657件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`cloud-check-fast-20261113-104749.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-104749.md) | 11-13 19:52 | 雲で回した：`check-fast.js` |

<!-- 控えの一覧 ここまで -->
