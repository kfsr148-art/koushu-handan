# 枠 十四：Stop の最後の返事を koushu-state に置く（枠の印 2026-11-21 04:21:54・y1121-0425）

状態：終わり — 04:25（機械の刻）

## 一、last-reply.txt
- turn-mark.js（Stop の合図）が、Stop の入力の last_assistant_message から last-reply.txt を組む。頭に「刻:」「件名:」（控えの件名・無ければ busy の題）、空行、本文。毎回上書き（札になる回もならない回も）。transcript_path は使わない。
## 二、伏せと長さ
- 鍵・トークン（sk-／ghp_／github_pat_／xox／AKIA／AIza／JWT）・token=／password= などの値・ntfy の宛先は【伏せ】。4000字を超えたら頭から切り、末尾に「長いので頭から4000字で切った。元は N 字」。空の返事は置かない（前のまま）。
## 三、押し
- turn-push.ps1 が Stop の時だけ last-reply.txt を state.json と同じ一回の Git-CommitPush に載せる（押しの数は増えない）。git-push.ps1 の STATE_NAMES に足したので koushu-state（公開の読み口）へ行く。koushu-handan には入れない（.gitignore）。
## 四、作法44 十二に足した
## 作り値（本物に書かない：TM_KEY・TM_SJ・TM_NOTE・TM_REPLY を一時の置き場へ）
- 秘密3種（token=・ghp_・ntfy 宛先）が伏せられ・4500字が4000字＋切り注記になり・空の返事は何も置かない。構文（node --check・PowerShell Parser 0件）通り。写し .bak-20261121（turn-mark.js・turn-push.ps1・git-push.ps1）。
- 実物で効くのは、次の Stop の後（この手番の Stop で koushu-state の last-reply.txt が出るはず）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **1016件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1121-0425.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1121-0425.md) | 11-21 04:25 | 枠 十四：Stop の最後の返事を koushu-state に置く（枠の印 2026-11-21 04:21:54・y1121-0425） |
| [`y1121-0415.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1121-0415.md) | 11-21 04:17 | 枠 十三：state.json に panelView（本人の画面の頭の字・まとめて写すの残り）（枠の印 2026-11-21 04:12:17・y1121-0415） |
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

<!-- 控えの一覧 ここまで -->
