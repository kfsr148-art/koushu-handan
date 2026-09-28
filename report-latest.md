# 仮置き・未実装の印と、欠けた絵・音の洗い出し（r0928-1945）

**終わり（残り1件：map-3 の元の当て直しに続けて着手）** — 2026-09-28 19:38ごろ（VAIO）。読むだけ。本体には触っていない。

## 結論
- **仮置き・未実装・TODO・後で・placeholder・素材待ちの印が付いた「作りかけ」は0件。**当たった字は全部、別の意味だった（下の表）
- **綴りの無い絵・音は0件。**img の src、ADV の部屋・人物の絵、ミニゲームの勝ち負け絵、猫牌、兎、枝豆の投げ、声の20本、どれも中身がある

## 印の字に当たった所（どれも作りかけではない）
| 行 | 字 | 何か |
|---|---|---|
| 488・1757 | placeholder | 牌を打ち込む欄の例文（「例 18m 1357p 3368s 1z5z」）と、その色の指定 |
| 773・1042・3152・7286・7297・10689 | 後で／あとで | 注の中の「この後で」（処理の順） |
| 2650 | 後で | 「猫の枚数。後で擬似受け入れを注入する」＝同じ関数の下の方で足している（2924行） |
| 2763 | 仮置き | 向聴を数える手順の「雀頭を1つ仮置き」 |
| 1497・2839・2840・2924・2925 | ダミー | 猫牌の代わりに入れる「ダミー字牌」（判定の手順と説明文） |
| 2002 | 準備中 | 声の読み込みが済むまでの扱いの注 |
| 3281・3374・3467・3560・3653・3746・3839・3932 | あとで | 一姫の台詞（方言八通り）「あとで「すごいにゃ」って言われ…」 |
| 5980・6061 | あとで | ずんだの台詞（探偵編）「お礼は、あとでずんだ餅で…」 |
- serifu-adv.txt・serifu.txt・README.md には当たり無し
- 画像の中身（data:）の字に偶然当たった行（9・1697・2241 など）は数えていない

## 絵・音の置き場
| 物 | 置き場（行） | 様子 |
|---|---|---|
| img（src 無し）catCardTileImg | 1564 | JS（4957行）が CAT_TILE_GENBA を流し込む。欠けではない |
| img（src 無し） | 2103 | 猫牌の描き分けの中で CAT_TILE_GENBA を入れる。欠けではない |
| CAT_TILE_GENBA | 2241 | data 1件 |
| ADV_ROOM_IMG | 5702〜5704 | 11部屋（captain・office・人柄7・room12・room16）。探偵編が使う部屋はすべてある（欠け0） |
| ADV_CHAR_IMG | 5705 | 人柄7。captain・office・room12・room16 は別の絵か絵を出さない分岐（6694〜6699行）で、欠けではない |
| ADV_CAPTAIN・KITTEN・FACE・SHIP・AGROUND・CHART・HALL・BODY | 5706〜5717 | どれも data あり |
| USAGI_IMG | 5711 | data あり |
| EDA_NAGE | 9799 | prepare・grasp・flick・flight・action・tama の6枚 |
| TORI_WIN_IMG／TORI_LOSE_IMG | 9816・9817 | data あり |
| canvas ssCanvas・ssCutCanvas・ssTplStrip | 9743〜9749 | 写し取りの画面。JS（9143・9306・9398行ほか）が描く |
| 声 | 1957〜（リポジトリ直下） | 呼ぶ20本（attack・defend・yoshi・dame・0・star・hash・1〜13）がすべて *.wav.wav で在る |
- 綴りの外への参照（manifest.json・templates.json・ver.txt）も在る

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **462件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0928-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1945.md) | 09-28 19:38 | 仮置き・未実装の印と、欠けた絵・音の洗い出し（r0928-1945） |
| [`r0928-1922.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1922.md) | 09-28 19:17 | map-2 の要確認（三つ目）：heavy-skip・記録の順・My First Check・使わない台本（r0928-1922） |
| [`map-1-parts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-1-parts.md) | 09-28 19:16 | 連携で動いている物の一覧（map-1） |
| [`r0928-1912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1912.md) | 09-28 19:12 | map-2 の要確認（二つ目）：#49・#50・#44 を作り値で確かめて直した（r0928-1912） |
| [`r0928-1901.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1901.md) | 09-28 19:01 | map-2 の要確認（一つ目）：#16・#19・#35 を作り値で確かめて直した（r0928-1901） |
| [`r0928-1807.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1807.md) | 09-28 18:07 | Check-FrameLimit の切り方を「固まり」と「長すぎ」に（r0928-1807） |
| [`r0928-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1756.md) | 09-28 18:07 | 読むだけ：pathspec の枠・控えの預けの枠・今の予定（r0928-1756） |
| [`r0928-1750.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1750.md) | 09-28 17:48 | 静かな帯の漏れ二通を塞いだ（r0928-1750） |
| [`r0928-1656-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1656-2.md) | 09-28 16:56 | 再起動-2（r0928-1656・後の測り） |
| [`r0928-1654-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1654-2.md) | 09-28 16:54 | 再起動-2（r0928-1654・後の測り） |
| [`r0928-1620.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1620.md) | 09-28 16:11 | notices の押しの pathspec の落ちの元と直し（r0928-1620） |
| [`r0928-1611.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1611.md) | 09-28 16:08 | 使用量の HTTP 401 の元と直し（r0928-1611） |
| [`r0928-1606.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1606.md) | 09-28 16:07 | 台帳の「三つ目と四つ目」を済へ・残りを二枠に割った（r0928-1606） |
| [`r0928-1349.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1349.md) | 09-28 13:49 | 控えの預け（ClaudeHomeBackup）を 05:00 へ・落ちたら一通（r0928-1349） |
| [`r0928-1324.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1324.md) | 09-28 13:32 | 静かな帯（再起動・窓の立ち直りの間は偽の鈴を黙らせる）（r0928-1324） |
| [`r0928-1216-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216-2.md) | 09-28 12:32 | 連携の地図三枚（r0928-1216-2・読むだけ） |
| [`map-2-alerts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-2-alerts.md) | 09-28 12:31 | 鈴と札の全種類（map-2） |
| [`map-3-incidents.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-3-incidents.md) | 09-28 12:26 | 09-21〜09-28 の出来事（map-3） |
| [`r0928-1216.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216.md) | 09-28 12:18 | SessionStart の resume を仕事の始まりと読む誤りを直した（r0928-1216） |
| [`r0928-1201.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1201.md) | 09-28 12:03 | 「命令0回」で切られた三つの枠の元（r0928-1201・読むだけ） |

<!-- 控えの一覧 ここまで -->
