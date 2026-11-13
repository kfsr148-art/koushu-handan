# 横画面で場を押すと並びがずれる（y1113-2057・v1462）

**終わり** — 2026-11-13 21:39（VAIO）。

| 番号 | 結果 |
|---|---|
| 1 | 場と自の段（.wind-2step）の高さを min-height 42px で先に取り、自風の釦が出ても段の高さが変わらないようにした。場を押す前後で牌の表・配牌表示枠・釦が動かない。v1462（6eae6f22）で雲の速い版は全てPASS、配信も成功。 |

## いきさつ

- v1461 は「自風の段を visibility:hidden で場所を取ったまま隠す」形にしたが、雲の ⑦ が 568x320 で FAIL（値の列 138 > 100 の横溢れ）。配信が止まったので、v1462 で前へ直した。
- v1462 は自風の段を前どおり display で出し入れし、段の高さだけ先に取る（指示の「visibility:hidden 等で」の「等」で選んだ。visibility だと狭い画面で隠れた釦が横幅を食う）。

## 実測（写しに probe・0.4秒待って測る）

| 窓 | 実の視野 | 場を押す前→東場→南場＋西→解除 | 自風の釦 |
|---|---|---|---|
| 844x390 | 820x298 | 牌の表・配牌表示枠・釦の段・東場/南場とも動いた物なし | 場を押すと出て押せる |
| 667x375 | 643x283 | 動いた物なし | 出るが幅2pxに潰れる（前から） |
| 568x320 | 544x228 | 動いた物なし | 値の列 155/100 で溢れ、押せない（前から） |

＊直す前（v1460）は場を押すと牌の表・配牌表示枠・釦が 7px 上へずれていた（844x390・667x375 とも）。
＊**前からの穴**：667x375 以下では値の列が狭く（127px・100px）、自風の4つが潰れて押せない。今回の頼みの外なので触っていない。

## 実機で見る所

スマホを横にして「東場」「南場」を押しても、牌の表と配牌表示枠が一切動かない。場を押すと右に東南西北が出る。版の字が v1462。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **644件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r1111-0329-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1111-0329-2.md) | 11-11 03:29 | 再起動-2（r1111-0329・後の測り） |
| [`r1110-1525-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1110-1525-2.md) | 11-10 15:25 | 再起動-2（r1110-1525・後の測り） |
| [`r1110-0332-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1110-0332-2.md) | 11-10 03:32 | 再起動-2（r1110-0332・後の測り） |
| [`r1110-0328-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1110-0328-2.md) | 11-10 03:28 | 再起動-2（r1110-0328・後の測り） |
| [`r1109-1526-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1109-1526-2.md) | 11-09 15:26 | 再起動-2（r1109-1526・後の測り） |
| [`r1109-1523-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1109-1523-2.md) | 11-09 15:23 | 再起動-2（r1109-1523・後の測り） |
| [`r1109-0356-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1109-0356-2.md) | 11-09 03:56 | 再起動-2（r1109-0356・後の測り） |

<!-- 控えの一覧 ここまで -->
