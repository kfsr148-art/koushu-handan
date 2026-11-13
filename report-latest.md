# 写真取込の読み直し（y1113-2241・v1466→v1467）

**終わり** — 2026-11-13 23:25（VAIO）。残り0件。v1467（f344059b）で雲の速い版は全てPASS・配信済み。

| 番号 | 結果 |
|---|---|
| 1 受付ページの写真は止めない | 怪しい牌があっても、手牌の列が見つからなくても、判定画面まで進む。赤枠・理由の一行・止める敷居（色の差40・迷いの比1.15）は外した。見本が空の時だけは読めないので止まる。 |
| 2 見本と揃えて比べる（Codeタブの追加の枠も合流） | 見本も牌も、白い面の外枠で切り直して同じ大きさに、色ごとに白を白へ・暗い側を黒へ寄せて同じ明るさに、色の濃さを一定にしてから、上下左右2画素までずらして一番合う所で、形（明るさ）＋色み（重み0.5）で比べる。同じ牌は4枚まで（赤五は五と数え、5枚目は損の少ない牌から次に近い牌へ読み替え）。 |
| 3 縦の写真 | そのままで手牌の列が見つからなければ90度ずつ左右に回して探し、見本との合い方の良い向きで補正する。 |

## 実測（写しに probe）

見本を**昔の形**（まっすぐなスクショを既定の枠で13等分したマス）で登録し、作り写真（受付ページと同じ幅1280・JPEG0.85）を読ませた。正解 一萬 五萬 九萬 二筒 三筒 六筒 八筒 一索 五索 九索 南 發 中。

| 写真 | 直す前 v1465 | 直した後 |
|---|---|---|
| 横・斜め約15° | 13/13 | 13/13 |
| 横・斜め約30°＋傾き | 13/13 | 13/13 |
| 横・斜め約15°・暗く青い | 7/13 | 13/13 |
| 縦（手牌の列が縦向き） | 1/13 | 13/13（270度回し） |
| 縦（テレビは横のまま小さく） | 13/13 | 13/13 |

- 一番と二番の差も広がった（例：一索 25 対 一萬 35。直す前は 39 対 40）。
- 東を5枚描いた写真：4枚を東に残し、5枚目を三筒へ読み替えた。同じ写真で五萬を赤五萬と読んだ1枚あり。
- 受付ページの形で渡すと：似た牌まじり（三筒・四筒・五筒・八索・九索）13/13 で判定画面／見本に無い絵柄まじり・手牌の列が見つからない写真も止まらず判定画面。

## 気をつける所

- **実機の写真の外れ（二筒→一索・六筒→八筒・南→發）はこちらで再現できていない。** 作り写真での結果なので、実機で読みが当たるかはスマホで確かめてほしい（人手待ち）。
- 五萬と赤五萬の見分けは差が小さい。
- v1466 は注釈の「°」で雲の⑬（非日本語文字）に落ちて配信が止まったので、v1467 で「度」に直した。

## 実機で見る所

受付ページで撮る（横でも縦でも）→ 押さずに判定画面が出る。赤枠や理由の一行は出ない。版の字が v1467。

＊シムなし（probe は写しにだけ差し、写しごと消した）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **651件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r1113-0337-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1113-0337-2.md) | 11-13 03:37 | 再起動-2（r1113-0337・後の測り） |
| [`r1112-1524-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1112-1524-2.md) | 11-12 15:24 | 再起動-2（r1112-1524・後の測り） |
| [`r1112-0331-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1112-0331-2.md) | 11-12 03:31 | 再起動-2（r1112-0331・後の測り） |
| [`r1111-1525-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1111-1525-2.md) | 11-11 15:25 | 再起動-2（r1111-1525・後の測り） |
| [`r1111-0334-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1111-0334-2.md) | 11-11 03:34 | 再起動-2（r1111-0334・後の測り） |

<!-- 控えの一覧 ここまで -->
