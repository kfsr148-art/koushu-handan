# map-3 の未特定・様子見の五行の元を当て直した（r0928-2005）

**終わり（残り0件）** — 2026-09-28 19:42ごろ（VAIO）。読むだけ。直していない。本体には触っていない。
見た記録：System・Application（イベントログ）・hook.log・revive.log・inbox-watch.log・watch-notify.log・git-push.log。**watch-step-log.txt は 09-28 17:38 からしか無く、どの行にも使えなかった。**予定表（TaskScheduler）の記録も 09-24 まで残っていない。

## 結果
1. **09-21 11:08〜11:39 の固まり … 記録に無い。**分かるのは、11:00 から機械全体が詰まっていたこと（見張りの子が毎回時間切れ・入口 41〜250秒・git-remote-https が18分居座り）と、11:37 に claude 0本・11:39 に人の手で再起動（1074・RuntimeBroker、11:35 に遠隔デスクトップで繋いでいた）まで。何が機械を食っていたか、claude が消えた理由は記録に無い
2. **09-22 08:11・08:15 の claude 0本 … 記録に無い。**どちらも stop の鉤を書かずに消えた（07:27:53 と 08:13:41 に立ち上がり、それぞれ 08:11:26・08:15:25 に0本）。System・Application に落ちの記録は無い。手掛かりは 07:22 の空き 715MB（4GB の頃・下り坂）だけ
3. **09-24 15:03 ログオン〜輪が立つまで25分 … 当たり：ログオンのプロファイル読み込みが802秒。**Winlogon 6005（15:07:46「Logon の処理に長い時間」）→ 6006（15:20:09「<Profiles> の Logon 処理に 802 秒」）。残りの 15:20〜15:27（予定が走り出すまで）の7分は記録に無い
4. **09-26 19:20・21:42 の郵便受けの詰まり**
   - **19:20 … 当たり：常駐の起こし直しの隙。**19:16:21 に新しい常駐が前の常駐（pid 4700・13:52 起動）を止めた。郵便受けを最後に読めたのは 19:15:02 で、新しい常駐の最初の読みまでに5分を越えた（19:22:38 に解けた）
   - **21:42 … 半分：常駐の巡回そのものが 21:31:54〜21:43:31 の11分止まっていた**（inbox-watch.log がこの間一行も無い。重い仕事の帯・空き 611MB）。最後に読めたのは 21:36:15。何で止まったかは記録に無い
5. **09-21 03:00 の見張り38分 … 当たり（重なりから）：Windows の自動保守。**03:01 に Windows Modules Installer が自動起動へ切り替わり、時刻合わせ（03:01:34）・Defender の更新（03:03〜03:25）・BITS（03:31〜03:34）が続いた。03:05:15 に起きた見張りは「開始」の段のまま33分固まり、生存の予定も 02:58〜03:37 は書かず、03:37:36 に三回ぶんをまとめて書いた。09-27 01:06 の自動保守の固まりと同じ形

＊郵便受けの刻（silent:<数>）は PowerShell 5.1 の -UFormat %s が地方時のまま秒にした値。UTC として読むと9時間ずれる。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **463件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0928-1216.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216.md) | 09-28 12:18 | SessionStart の resume を仕事の始まりと読む誤りを直した（r0928-1216） |

<!-- 控えの一覧 ここまで -->
