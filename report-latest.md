# 使用量の HTTP 401 の元と直し（r0928-1611）

**終わり（残り1件：notices の pathspec に続けて着手）** — 2026-09-28 16:11ごろ（VAIO）。本体には触っていない。

## 元（鍵の場所・期限）
- 鍵の場所：`~/.claude/.credentials.json` の `claudeAiOauth`（accessToken・refreshToken・**expiresAt**）。watch-notify.ps1 が accessToken を読んで `api/oauth/usage` を引く
- 期限：**8時間**（いまの鍵は 11:45:11 に書かれ、切れは 19:45:11）。**更新するのは claude だけ**（claude が使う時に書き替える）
- 401 が出るのは、夜・再起動で claude が長く黙って**鍵が切れた後、claude が次に動くまでの一回**。最近の3件はどれも次の回で 200
  | 401 | 次の回 |
  |---|---|
  | 09-26 07:48 | 07:58 に 200 |
  | 09-27 11:08 | 11:20 に 200 |
  | 09-27 19:34 | 19:46 に 200 |
- つまり「鍵の入れ替えが要る」という記録の字は誤り。**入れ替えは要らない**

## 直し（機械だけで直せた）
- watch-notify.ps1 の使用量の段：**鍵の expiresAt を見て、切れていれば（60秒前から）取りに行かない**。「使用量：鍵の期限切れ（MM-dd HH:mm）。claude が次に動けば更新される。取りに行かない」を書き、usage.json は触らない（前の値が残る）。10分後にまた見る。入れたのは 13:51、写し .bak-20260928b、構文0件
- **こちらで鍵の更新はしない**。更新の鍵は使うたびに替わるので、claude と取り合うと claude の側が締め出されるため。＊選ばなかった案：refresh_token でこちらから更新する

## 作り値（本物の鍵・本物の読みは使わない）
| 鍵の残り | 振る舞い |
|---|---|
| 10時間前に切れた | 行かない（切れた刻を記録） |
| 30分前に切れた | 行かない |
| あと30秒 | 行かない（60秒の余裕） |
| あと2分 | 取りに行く |
| あと2時間 | 取りに行く |
| expiresAt が読めない | 取りに行く（今まで通り） |
- 本物：13:51 以降の読みは全部 HTTP 200（16:02 まで）。直しが今の読みを壊していない

## 人の手
- **要らない。**＊ただし「鍵の期限内なのに 401」が記録に出たら、それは本当の締め出しなので、そのときは窓で `/login` を打ち直す

## 実機
- 画面に出る物は無し。**次に claude が長く黙った後（夜・再起動）、watch-notify.log に「HTTP 401」でなく「鍵の期限切れ」の行が出ること**（人手待ち）

## ファイル
- ~/.claude/watch-notify.ps1（写し .bak-20260928b）

## 残り
1. notices の押しの pathspec の元と直し（割り-2・これから）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **452件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0928-1611.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1611.md) | 09-28 16:08 | 使用量の HTTP 401 の元と直し（r0928-1611） |
| [`r0928-1606.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1606.md) | 09-28 16:07 | 台帳の「三つ目と四つ目」を済へ・残りを二枠に割った（r0928-1606） |
| [`r0928-1349.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1349.md) | 09-28 13:49 | 控えの預け（ClaudeHomeBackup）を 05:00 へ・落ちたら一通（r0928-1349） |
| [`r0928-1324.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1324.md) | 09-28 13:32 | 静かな帯（再起動・窓の立ち直りの間は偽の鈴を黙らせる）（r0928-1324） |
| [`r0928-1216-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216-2.md) | 09-28 12:32 | 連携の地図三枚（r0928-1216-2・読むだけ） |
| [`map-2-alerts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-2-alerts.md) | 09-28 12:31 | 鈴と札の全種類（map-2） |
| [`map-1-parts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-1-parts.md) | 09-28 12:31 | 連携で動いている物の一覧（map-1） |
| [`map-3-incidents.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-3-incidents.md) | 09-28 12:26 | 09-21〜09-28 の出来事（map-3） |
| [`r0928-1216.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216.md) | 09-28 12:18 | SessionStart の resume を仕事の始まりと読む誤りを直した（r0928-1216） |
| [`r0928-1201.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1201.md) | 09-28 12:03 | 「命令0回」で切られた三つの枠の元（r0928-1201・読むだけ） |
| [`r0928-1045.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1045.md) | 09-28 10:42 | 未検収の 🔗 の二行を済へ（r0928-1045） |
| [`r0928-1035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1035.md) | 09-28 10:38 | 未検収を試しで片付ける（二つ目）（r0928-1035） |
| [`r0928-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1020.md) | 09-28 10:16 | 未検収を記録で片付ける（一つ目）（r0928-1020） |
| [`r0928-1010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1010.md) | 09-28 10:11 | 未検収の二行を済へ（記憶の診断・2048）（r0928-1010） |
| [`r0928-0950-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950-2.md) | 09-28 09:54 | conhost.exe の 0xc0000409 の落ち四回と、Windows Terminal の見込み（r0928-0950-2・読むだけ） |
| [`r0928-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950.md) | 09-28 09:54 | 09-28 の再起動の後の点検（記憶の診断・仮想メモリ・03:20・NODE_OPTIONS・引き継ぎ）（r0928-0950・読むだけ） |
| [`r0928-0348-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0348-2.md) | 09-28 03:48 | 再起動-2（r0928-0348・後の測り） |
| [`r0928-0345-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0345-2.md) | 09-28 03:45 | 再起動-2（r0928-0345・後の測り） |
| [`r0928-0302-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0302-2.md) | 09-28 03:02 | 再起動-2（r0928-0302・後の測り） |
| [`r0928-0138.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0138.md) | 09-28 01:40 | 09-27 23:25〜23:36 に Claude の窓が消えた元（r0928-0138・読むだけ） |

<!-- 控えの一覧 ここまで -->
