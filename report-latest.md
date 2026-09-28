# 「見張りの生存記録が N 分途切れています」の偽（5419分・5776分）を直した（r0928-2003）

**終わり（残り0件）** — 2026-09-28 19:59ごろ（VAIO）。本体には触っていない。

## 元（一行）
**hook.log から生存が一本も拾えなかった回に、退避先 hook-fallback.log の最後の生存（2026-09-24 19:18:37・四日前に「hook.log へ3回とも書けず退避」した一本）を「最後の生存」として採っていた。**
- watch-notify.log：13:38:49「鍵 done → **stale:2026-09-24 19:18:37**」／19:34:14「鍵 wait:y0928-1919 → **stale:2026-09-24 19:18:37**」。どちらも次の回で戻っている（一回だけの空振り）
- 13:38 は hook.log の生存（13:38:05）と同じ刻の読みで、書き込みと重なって読みが空振りしたと見る（読みの例外は記録していなかったので、例外か空かまでは分からない）
- ＊静かな帯の直し（13:29）で触ったのは、この下の「dead／stale の鈴を帯の中で黙らせる」所で、生存の刻の読み方は前からこの形だった

## 直し（~/.claude/watch-notify.ps1 の「(2)(3) hook.log を読む」）
1. hook.log の読みが例外になったら、300ms おいて**三度まで読み直す**
2. 退避先（hook-fallback.log）は**60分より新しい生存だけ**を採る
3. 生存の刻が読めない回は**途切れの鈴を出さず**、「生存の刻が読めない（hook.log の読み 成功・生存の行なし／三度とも失敗）。途切れの鈴は出さない」を記録だけ残す
- 作り値用に `$script:HbFakeLines`・`$script:HbFakeFallback` を足した。写し .bak-20260928e・構文0件。予定表から2分おきに起こされるので起こし直しは要らない

## 作り値（hook.log・退避先とも scratchpad。退避先は四日前の一本を置いた）
| 場合 | 前 | 後 |
|---|---|---|
| 生存が1分前 | 出ない | **出ない** |
| 生存が31分前 | 鳴る（31分） | **鳴る**（31分） |
| 読む先が空（hook.log から生存が拾えない） | **鳴る（5801分・最後の生存 2026-09-24 19:18:37）**＝今回の偽の再現 | **出ない**・記録だけ |

## 実機
- 画面に出る物は無し。**この先「生存記録が N 分途切れています」の N が数千分で出ないこと**（人手待ち）

## ファイル
- ~/.claude/watch-notify.ps1（写し .bak-20260928e）

## 残り
- 0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **464件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0928-2003.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2003.md) | 09-28 19:59 | 「見張りの生存記録が N 分途切れています」の偽（5419分・5776分）を直した（r0928-2003） |
| [`r0928-2005.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2005.md) | 09-28 19:42 | map-3 の未特定・様子見の五行の元を当て直した（r0928-2005） |
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

<!-- 控えの一覧 ここまで -->
