# 写真取込の後、上の写真を手牌の帯だけに切り抜く（y1113-2020・v1460）

**終わり** — 2026-11-13 20:39（VAIO）。残り0件。

| 番号 | 結果 |
|---|---|
| 1 | 取込後の上の写真を、読取りの枠＋余白（上下25%・左右4%）だけに切り抜いて映すようにした（高さは画面の30%まで）。枠合わせの間は盤面全体に切り替え、終わると直した枠の帯へ戻る。v1460（a7adea9e）で押し、雲の速い版は全てPASS、配信も成功。 |

## 実測（写しに probe・取込後）

| 窓 | 実の視野 | 手牌の帯 | 読取牌の列 | 釦の段 | 重なり | 釦5つ |
|---|---|---|---|---|---|---|
| 844x390 | 820x298 | 16-107 | 121-192 | 200-283 | 無し | 全部押せる |
| 667x375 | 643x283 | 16-102 | 116-175 | 183-267 | 無し | 全部押せる |

＊枠合わせ：盤面全体（2340x1080）に切り替わり、狙い [0.20,0.85,0.70,0.99] へのタップで枠 [0.199,0.846,0.700,0.986]。終わると帯の表示へ戻った。
＊雲の速い版：reports/cloud-check-fast-20261113-112830.md（check・adv-check とも PASS）。
＊シムなし（probe は写しにだけ差し、写しごと消した）。

## 実機で見る所

スマホを横にして写真を取り込むと、上の写真が手牌の列の帯（赤い13枠つき）だけになり、卓や他家は映らない。その下に読取牌の列、さらに下に釦の段が重ならずに並んで押せる。「枠合わせ」を押すと盤面全体に戻り、二点を押すと帯へ戻る。版の字が v1460。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **641件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r1111-0329-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1111-0329-2.md) | 11-11 03:29 | 再起動-2（r1111-0329・後の測り） |
| [`r1110-1525-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1110-1525-2.md) | 11-10 15:25 | 再起動-2（r1110-1525・後の測り） |
| [`r1110-0332-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1110-0332-2.md) | 11-10 03:32 | 再起動-2（r1110-0332・後の測り） |
| [`r1110-0328-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1110-0328-2.md) | 11-10 03:28 | 再起動-2（r1110-0328・後の測り） |
| [`r1109-1526-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1109-1526-2.md) | 11-09 15:26 | 再起動-2（r1109-1526・後の測り） |
| [`r1109-1523-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1109-1523-2.md) | 11-09 15:23 | 再起動-2（r1109-1523・後の測り） |
| [`r1109-0356-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1109-0356-2.md) | 11-09 03:56 | 再起動-2（r1109-0356・後の測り） |
| [`r1109-0353-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1109-0353-2.md) | 11-09 03:53 | 再起動-2（r1109-0353・後の測り） |
| [`r1108-1528-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1108-1528-2.md) | 11-08 15:28 | 再起動-2（r1108-1528・後の測り） |
| [`r1108-1526-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1108-1526-2.md) | 11-08 15:26 | 再起動-2（r1108-1526・後の測り） |

<!-- 控えの一覧 ここまで -->
