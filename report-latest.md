# 写真取込の後、横画面で下の釦が切れる（y1113-1931・v1459）

**終わり** — 2026-11-13 19:58（VAIO）。残り0件。

| 番号 | 結果 |
|---|---|
| 1 | 写真取込の画面（#ssOverlay）を縦に送れる形にし、下の釦の段を画面下へ貼り付けた（position:sticky・背景つき・狭い時は折り返す）。v1459（9d3dc7b3）で押し、雲の速い版は全てPASS、配信も成功。 |

## 実測（写しに probe・取込後＝読取牌の段を出した状態）

| 版 | 窓 | 実の視野 | 釦5つ | 押せる |
|---|---|---|---|---|
| 直す前 | 667x375 | 643x283 | bottom 300〜301 で画面の外 | 0/5 |
| v1459 | 844x390 | 820x298 | 全部画面の中 | 5/5 |
| v1459 | 667x375 | 643x283 | 全部画面の中 | 5/5 |

＊押せる＝釦の真ん中を指したときに当の釦に当たる。試しでは表紙（titleScreen）を隠してから開いた（実際の使い方と同じ）。
＊雲の速い版：reports/cloud-check-fast-20261113-104749.md（check・adv-check とも PASS、⑦ 狭い画面での溢れ PASS）。
＊シムなし（probe は写しにだけ差し、写しごと消した）。

## 実機で見る所

スマホを横にして写真を取り込んだ後、画面の下の端に「枠合わせ／読取牌表示／テンプレ登録／写真取込牌で判定／閉じる」の段が貼り付いて見え、どれも押せる。写真が長いときは写真のほうが段の下へ送れる。版の字が v1459。

## 手を付けなかったこと

- 釦の高さは 30〜32px（前からの大きさ）。作法10 の 44px には届かないが、頼まれた範囲の外なので変えていない。
- 14枚目・白の読みの頼みは取り消し（手は付けていない）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **639件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r1108-0356-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1108-0356-2.md) | 11-08 03:56 | 再起動-2（r1108-0356・後の測り） |
| [`r1108-0354-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1108-0354-2.md) | 11-08 03:54 | 再起動-2（r1108-0354・後の測り） |

<!-- 控えの一覧 ここまで -->
