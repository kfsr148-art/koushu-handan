# 枠 三百六十二：欠けた助言の声の部品を作り足し、欠けを知らせる（y1126-w362）

**終わり** — 2026-11-26 20:06（VAIO）。v1541 を公開した。**順番待ち**：三百六十四・三百六十五（三百六十三は問い y1126-2005 の返事待ち）。

- 声を足した：枠の手（一姫×青森）で、主の声が無かった部品は7つでした。内訳は「7巡目までに一向聴…にゃびょん」の2本と、終わりの一言の5本です。7本を作り足し、公開先で7本とも取れることを確かめました（約134KB）。
- 知らせる：部品が欠けた時は、部品の名と数を client-errors へ送ります。印は、(予)＝予備の声に落ちた、(省)＝飛ばした、(止)＝助言を読めず判定の一言だけになった、です。鳴らし方は変えていません。
- 「攻め」だけの原因：再現できていません。7部品はどれも予備の声があり、公開先の部品だけでは「攻め」だけになりません。次に起きたら、(止)の付いた部品の名が届くので、そこから追えます。
- 指定の2部品：「西のあだ名」と「受け入れ二十枚以上」の声は、前から公開にありました。
- 試せていない所：金の丸が軍師になる条件は再現できず、審判を軍師に固定して試しました。実機で声が最後まで通るかは確かめていません。
- やらない事：助言の文と攻守の判定は変えていません。
- 公開：v1541（雲の検査と配信は成功、公開の版は1541）。公開の荷は599MBです。
- 実機で見る所：版が v1541 で、この手の助言が終わりの一言まで声で読まれれば合格です。- 確かめ：check.yml run 45804891606 success・公開の ver.txt 1541・7本の公開 200。部品は本体の写しの probe で組んだ（作法14）。声の台本は voice-plan/m362-add.json。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **1293件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1126-w362.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1126-w362.md) | 11-26 20:06 | 枠 三百六十二：欠けた助言の声の部品を作り足し、欠けを知らせる（y1126-w362） |
| [`y1126-w363-an.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1126-w363-an.md) | 11-26 19:52 | 枠 三百六十三：「〜と言う」の用語の表の案（本体はまだ変えていない） |
| [`y1126-w361.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1126-w361.md) | 11-26 19:31 | 枠 三百六十一：完成面子が他色にある手は染めを本線に勧めない（y1126-w361） |
| [`y1126-w360.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1126-w360.md) | 11-26 17:12 | 枠 三百六十：ヨシ待ちの釦に推しの白枠と直しの案（y1126-w360） |
| [`r1126-1632-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1126-1632-2.md) | 11-26 16:32 | 再起動-2（r1126-1632・後の測り） |
| [`r1126-1628-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1126-1628-2.md) | 11-26 16:28 | 再起動-2（r1126-1628・後の測り） |
| [`r1126-1625-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1126-1625-2.md) | 11-26 16:25 | 再起動-2（r1126-1625・後の測り） |
| [`y1126-kan4-table.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1126-kan4-table.md) | 11-26 01:43 | 配牌に同じ牌四枚の時、暗槓するか・ばらすか（棚 #28・枠 三百十六） |
| [`cloud-kan4-aite-run-20261125-161904.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-kan4-aite-run-20261125-161904.md) | 11-26 01:43 | 雲で回した：`kan4-aite-run.js` |
| [`cloud-panel-check-20261125-092040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261125-092040.md) | 11-25 21:06 | 雲で回した：`panel-check.js` |
| [`cloud-panel-check-20261125-091006.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261125-091006.md) | 11-25 21:06 | 雲で回した：`panel-check.js` |
| [`y1125-dora-table.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1125-dora-table.md) | 11-25 21:02 | ドラの枚数ごとの「守りの手でも押してよいか」の相手あり測り（枠 三百十・棚 #29・11-25） |
| [`cloud-dora-aite-run-20261125-113533.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-dora-aite-run-20261125-113533.md) | 11-25 20:59 | 雲で回した：`dora-aite-run.js` |
| [`r1125-1558-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1125-1558-2.md) | 11-25 18:04 | 再起動-2（r1125-1558・後の測り） |
| [`cloud-voice-length-300-20261125-053630.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-length-300-20261125-053630.md) | 11-25 18:03 | 雲で回した：`voice-length-300.js` |
| [`cloud-voice-length-300-20261125-052949.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-length-300-20261125-052949.md) | 11-25 18:03 | 雲で回した：`voice-length-300.js` |
| [`cloud-panel-check-20261125-041234.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261125-041234.md) | 11-25 18:03 | 雲で回した：`panel-check.js` |
| [`cloud-mjs-rules-fetch-20261125-055850.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-mjs-rules-fetch-20261125-055850.md) | 11-25 18:03 | 雲で回した：`mjs-rules-fetch.js` |
| [`cloud-voice-sample-20261125-023136.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-sample-20261125-023136.md) | 11-25 17:51 | 雲で回した：`voice-sample.js` |
| [`cloud-shelf5-voice-plan-20261124-071753.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-shelf5-voice-plan-20261124-071753.md) | 11-25 17:51 | 雲で回した：`shelf5-voice-plan.js` |

<!-- 控えの一覧 ここまで -->
