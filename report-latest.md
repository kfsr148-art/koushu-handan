# 受付ページの中のカメラと、手牌の目印・自動で撮る（r1114-カメラ）

**終わり** — 2026-11-14 01:22（VAIO）。残り0件。受付ページ（reader.html）だけの工事（5e320ddd）。本体は触っていないので版は v1469 のまま、雲の検査は掛からない。

| 枠 | 結果 |
|---|---|
| 1 ページの中でカメラ・目印・撮る釦 | 「📷 カメラで撮る」で、iPhone のカメラを呼ばずにページの中へ横向きの映像を出す。映像の上に手牌の帯の金の枠（既定の枠と同じ割合：横18.55%〜71.05%・縦85.92%〜99.24%）と、左端の赤い線を重ねる。右に「撮る」「戻る」。縦にすると「横向きにしてくださいまし」。 |
| 2 合ったら自動で撮る | 0.2秒ごとに映像を小さく取って見る。枠の列の8割以上に白い面があり、枠の上へはみ出さず（手牌が枠に収まる）、線のすぐ右が白・すぐ左に白が無く（左端が線に合う）、前の一枚との差が小さい（止まっている）——がそろって0.6秒続くと枠を緑にし、さらに0.5秒そろったままなら撮る。外れたら金へ戻す。撮った一枚は「写真を選ぶ」と同じく読み直さず枠で本体を開いて判定まで進め、判定直後に声。「撮る」の釦と「🖼 写真を選ぶ」の道は残した。 |

## 実測（受付ページと本体の写しを http://127.0.0.1 で配り、作り物のカメラに作り画面の動画を流し、実時間で測った）

| カメラに映した物 | 枠の色 | 撮ったか | その後 |
|---|---|---|---|
| 手牌を枠にぴったり | 金 → 3.2秒で緑 | 約3.7秒で自動で撮った | 受付ページは読み直さず、枠の中の本体が判定（入力欄「123m 66p 77s 東東東中中中」）、5.8秒に defend.wav.wav |
| 手牌を右へ8%ずらした | 14.5秒間ずっと金 | 撮らない | カメラのまま |

- 映像の箱に対する金の枠は 18.6%〜71.0%・85.9%〜99.2%、赤い線は 18.6%（狙いどおり）。撮る・戻るの釦は押せる。
- 「カメラで撮る」を押した時に声の無音の一鳴らし（attack・defend・読み上げ）が入るので、自動で撮った後も声が鳴らせる。

## 気をつける所

- **作り物のカメラと作り画面での結果。** 実際のテレビを写すと、枠に対する手牌の大きさが合わないことがある（テレビが画面いっぱいでない時など）。合わない時は撮る釦か写真を選ぶで撮れば、本体の自動の台形補正が手牌の列を探す。
- 枠の位置は「雀魂の画面が映像いっぱいに写った時の手牌の位置」。合わせにくければ、枠の位置・大きさを直す。
- 言い回し（「手牌を金の枠に、左端の牌を赤い線に合わせてくださいまし。枠が緑になったら自動で撮りますわ」等）は今の形のまま。違えば言ってほしい。
- ページの中のカメラは https（GitHub Pages）でだけ動く。初めての時はカメラの許可を聞かれる。

## 実機で見る所

受付ページで「📷 カメラで撮る」→ 横向きの映像に金の枠と赤い線が出る → 手牌を枠に、左端を赤い線に合わせて止めると、枠が緑になってすぐ自動で撮れる → 押さずに判定画面が出て「攻め」か「守り」が聞こえる。「撮る」の釦でも撮れる。「🖼 写真を選ぶ」も今までどおり。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **656件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r1113-1528-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1113-1528-2.md) | 11-13 15:28 | 再起動-2（r1113-1528・後の測り） |

<!-- 控えの一覧 ここまで -->
