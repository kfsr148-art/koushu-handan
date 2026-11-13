# ②を本体に入れる（y1114-0431・y1114-0526・v1473→v1474）

**終わり** — 2026-11-14 06:54（VAIO）。v1474（5fee24c4）で雲の速い版・フル版とも通り、配信済み。

| 項目 | 結果 |
|---|---|
| ② | revoteVerdict を足し、際どい手と良形があと1つ足りない手だけを、判定獣を除く11人の重み付きの票（精度×重なりの割引＋普段割れる審判同士の一致。v1471 の雲1000局の偶数局で測った値）で決め直す。得点>0で攻め・<0で守り・0は本判定のまま。記録に revote（前・後・得点）を残す。analyze() と投票欄の見た目は変えていない。 |
| 虎の台詞 | 決め直した手の三行を足した（y1114-0526 で全文を見せて裁定）。serifu.txt 再抽出（6955行・口調の混入0）。 |
| v1473 | 注釈の「κ」で雲の⑬（非日本語文字）に落ちて配信が止まった。v1474 で「一致の度合い」に直した。 |
| フル版㉓ | 16手の基準（first-sense-base.json）のうち4手が②で意図して守→攻へ変わったので、その4手の攻／守だけを直し、check.js に注記した（見立て行・光る牌は前のまま）。 |

## 実測

- 本体から読み出した revoteVerdict を v1471 の雲1000局の4000手に当て、測りの台と4000手とも同じ決め直し：守り→攻め761手（平均 +237）・攻め→守り0・攻め43.5%。
- 写し（844x390）：1245678m667p8s14z は守り→攻め（得点0.234）でカードが攻め・虎「…審判たちの票が攻めに傾いたので、判定は攻めです」・記録に revote。決め直す所でも票が守りの手と、所の外の手は守りのまま。

## 実機で見る所

良形があと一つ足りない手の一部が攻めになり、虎（判定獣）を押すと「審判たちの票が攻めに傾いたので、判定は攻めです」と言う。版の字が v1474。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **677件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1114-0526.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0526.md) | 11-14 06:54 | ②を本体に入れる（y1114-0431・y1114-0526・v1473→v1474） |
| [`y1114-0654.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0654.md) | 11-14 06:54 | 一番軽くなった審判の材料を作り替える案（y1114-0654・測るだけ） |
| [`cloud-check-fast-20261113-214003.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-214003.md) | 11-14 06:42 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-212731.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-212731.md) | 11-14 06:30 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-212235.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-212235.md) | 11-14 06:24 | 雲で回した：`check-fast.js` |
| [`y1114-0509.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0509.md) | 11-14 05:35 | 写真から取り込んだ後のドラ表示牌の場面（y1114-0509・v1472） |
| [`cloud-check-fast-20261113-202537.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-202537.md) | 11-14 05:29 | 雲で回した：`check-fast.js` |
| [`y1114-0431.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0431.md) | 11-14 04:31 | 席を外した版（v1471）で雲1000局を回し直し、②の重みを測り直した（y1114-0431） |
| [`cloud-core-battle-1000-20261113-191605.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-core-battle-1000-20261113-191605.md) | 11-14 04:29 | 雲で回した：`core-battle-1000.js` |
| [`cloud-check-fast-20261113-190543.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-190543.md) | 11-14 04:08 | 雲で回した：`check-fast.js` |
| [`y1114-0333.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0333.md) | 11-14 03:33 | 選ばれた組み合わせを測った結果（y1114-0333）——本体を直す前の確かめ |
| [`y1114-0321.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0321.md) | 11-14 03:22 | 重みを「本判定と食い違った手」だけで測る（y1114-0321） |
| [`y1114-0304.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0304.md) | 11-14 03:04 | 際どい手と攻守の線に近い手だけを、審判の重み付きの票で決め直す（y1114-0304） |
| [`y1114-0300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0300.md) | 11-14 03:01 | 審判の重み付きの票（精度×重なりの割引）で、守り→攻めへ移す線の候補（y1114-0300） |
| [`y1114-0258.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0258.md) | 11-14 02:58 | 審判の重み付きの票で、守り→攻めへ移す線の候補（y1114-0258） |
| [`y1114-0255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0255.md) | 11-14 02:55 | 守りの中で点が取れている手を攻めへ移す候補（y1114-0255） |
| [`r1114-battle.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1114-battle.md) | 11-14 02:43 | core-battle 1000局を雲で回し直す（r1114-battle） |
| [`cloud-core-battle-1000-20261113-172926.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-core-battle-1000-20261113-172926.md) | 11-14 02:43 | 雲で回した：`core-battle-1000.js` |
| [`y1114-0144.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0144.md) | 11-14 02:08 | 読取釦から受付ページへ直に飛ぶ（y1114-0144・v1470）／core-battle の回し直し |
| [`cloud-check-fast-20261113-165458.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-165458.md) | 11-14 02:08 | 雲で回した：`check-fast.js` |

<!-- 控えの一覧 ここまで -->
