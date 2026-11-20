# 枠 十二：橋の札を「済んだ札」へ移す・件名のずれ（枠の印 2026-11-21 03:25:14・y1121-0340）

状態：終わり — 03:44（機械の刻）

## 一、橋の札の残し方（本人のヨシ＝乙）
- 橋の文書の「窓から（札）」を新しい五枚（枠 十二〜八・七は移し済み）に保ち、古い札は文書末尾の節「済んだ札」へ move で移した（消さない・新しい順）。今回移したのは枠 六〜一の十三ブロック（rev 45）。移した後の各ブロックの h（hash）は移す前と同じ＝一字も変わっていない。
- 作法44 三を「移す」に書き替えた。移すのは以後ヨシ無しで可。消す・まとめる・書き替えるは今までどおり本人のヨシ。
## 二、件名のずれ
- 訳：枠 十一の直し（state-decide.js）は「段の台帳の更新が手番の始まり以後」の時だけ効く。03:00 の窓は 01:54 から手すきで、その後の手番で段の台帳を書かなかったため、段が全部済み・台帳が手番より前＝busy.subj（直前の人の指示＝枠 九）に戻った。
- 直し：手すき（ev が Stop／idle_prompt／Interrupted／EndTurn）の間は、段の台帳が手番より前でも、最後に済んだ仕事の名（台帳の「仕事:」）を件名にする。
- 待機中で仕事が無い時に出すもの：最後に済んだ仕事の名。台帳が空なら今まで通り busy.subj。新しい指示が来て手番が開いたら、段を書くまでは busy.subj（今の指示）。
- 作り値：state-decide-test 件名 4件 合い（手すきの2件は直す前 NG）・札の印 14件・総当たり 1344組 NG 0件。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **1014件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1121-0340.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1121-0340.md) | 11-21 03:44 | 枠 十二：橋の札を「済んだ札」へ移す・件名のずれ（枠の印 2026-11-21 03:25:14・y1121-0340） |
| [`r1121-0334-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1121-0334-2.md) | 11-21 03:34 | 再起動-2（r1121-0334・後の測り） |
| [`r1121-0327-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1121-0327-2.md) | 11-21 03:27 | 再起動-2（r1121-0327・後の測り） |
| [`y1120-2314.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2314.md) | 11-20 23:28 | 枠 十一：橋の札を消した件・state.json の subj が枠 九のまま（枠の印 2026-11-20 23:11:51・y1120-2314） |
| [`y1120-2236.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2236.md) | 11-20 23:04 | 枠 十：札まとめ中の印が新しい札の無い止まりで立った訳・「終わったにゃ、写して」の順（枠の印 2026-11-20 22:33:27・y1120-2236） |
| [`y1120-2208.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2208.md) | 11-20 22:18 | 枠 九：済んだ枠 七の行が結べず残った件・今日の結べなかった札 53件の訳・作りごとの直し（枠の印 2026-11-20 22:08:41・22:09:16・y1120-2208） |
| [`y1120-2205.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2205.md) | 11-20 22:01 | 橋の枠 八：21:42:09 の「✅ 終わりました」の札の道・該当せず／控えを書かなかった回は札を出さない（枠の印 2026-11-20 21:46:07・y1120-2205） |
| [`y1120-2148.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2148.md) | 11-20 21:56 | 橋の枠 七の受け漏れを直す・枠 七（ヨシの解除・作法1の替え）（枠の印 2026-11-20 21:44:46・21:22:57・y1120-2148） |
| [`y1120-2118.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2118.md) | 11-20 21:31 | 橋の枠 六：センコが読んだ札を写した扱いに・枠 四の札の二度出し・窓が書く刻（枠の印 2026-11-20 21:16:09・y1120-2118） |
| [`y1120-2105.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2105.md) | 11-20 21:31 | 橋の枠 五：枝 senko の合図を見張りが見て、橋と同じ道で窓を動かす（枠の印 2026-11-20 21:01:53・y1120-2105） |
| [`cloud-panel-check-20261120-122153.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261120-122153.md) | 11-20 21:31 | 雲で回した：`panel-check.js` |
| [`y1120-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2050.md) | 11-20 20:58 | 橋の枠 四：仕事が終わる直前の間は「待機中」でなく「札まとめ中」と出す（枠の印 2026-11-20 20:28:07・y1120-2050） |
| [`cloud-panel-check-20261120-115051.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261120-115051.md) | 11-20 20:58 | 雲で回した：`panel-check.js` |
| [`y1120-2025.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2025.md) | 11-20 20:43 | 橋の枠 三：時計の待ちが起きなかった訳・時計の待ちで next・現況は待ち（時計）（枠の印 2026-11-20 20:21:42・y1120-2025） |
| [`cloud-panel-check-20261120-113356.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261120-113356.md) | 11-20 20:43 | 雲で回した：`panel-check.js` |
| [`y1120-1945b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-1945b.md) | 11-20 20:23 | 橋の枠 二：15:00 の橋の試しの行を済みとして閉じ、同じ形の行を数える（枠の印 2026-11-20 19:29:27・y1120-1945b） |
| [`y1120-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-1945.md) | 11-20 19:38 | 着手直後の「待ち」と赤い「見込み未記入」を出さない（枠の印 2026-11-20 19:00:26・y1120-1945） |
| [`cloud-panel-check-20261120-102858.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261120-102858.md) | 11-20 19:38 | 雲で回した：`panel-check.js` |
| [`y1120-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-1915.md) | 11-20 19:19 | 橋の文書の「窓へ（枠）」の枠 一（枠の印 2026-11-20 18:06:41・y1120-1915） |
| [`y1120-1905.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-1905.md) | 11-20 19:09 | 止まっとるかもの鳴らす条件（枠の印 2026-11-20 17:40:18・y1120-1905） |

<!-- 控えの一覧 ここまで -->
