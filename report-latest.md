# map-2 の要確認（三つ目）：heavy-skip・記録の順・My First Check・使わない台本（r0928-1922）

**終わり（残り0件）** — 2026-09-28 19:17ごろ（VAIO）。本体には触っていない。

## 結果
1. **heavy-skip は自分が鳴る作りだった → 直した。** Add-Warn で積むので、鳴らしの段で新しい種類に数えられ「🪟 連携に訴えがあります（…heavy-skip）」、消えれば ✅、続けば ⏰ まで出る筋だった。鳴らしの段の種類から heavy-skip を外し、控え（pipe-warn-rung.txt）に残っていても落とす。pipe-warn.log の記録は今まで通り残る
2. **hold-stuck・clock-broken・hook-none の字が残らない件 → 直した。** 種類ごとの一行を書く段が（イ）（ロ）（ハ）より前にあったため、三つは rung の行しか残らなかった（09-28 17:50 の clock-broken がこれ）。その段を（ハ）の後へ移した
3. **「My First Check」は inbox-watch の合図（HC_URL・hc-ping.log）の方。** 09-27 の DOWN の明けで照合した——inbox-watch の合図は 10:57〜10:59 が /fail（claude=0）で、**11:00:36 に最初のふつうの合図** → 向こうの「My First Check is UP」が **11:00:38**（2秒後）。hc-watch.txt の合図が戻ったのは **11:03:03** で、UP より後。＊r0927-2215 で「hc-watch.txt の一本」と書いたのは誤りだった。宛先の字（UUID）はここには書かない
4. **五本を ~/.claude/unused/ へ移した（消していない）。** read-screen・rc-restart・window-restart・weekly-reboot・wifi-swap。どれも予定表・台本から呼ばれていない（字の上では注にだけ出る）。**weekly-reboot-after.ps1 は watch-notify が呼んでいるので残した。** reports/map-1-parts.md の一覧の各行を「unused/ へ移した（09-28・消していない）」に書き替えた

## 作り値（1・2。控えは scratchpad・送り手は偽物）
| | 前 | 後 |
|---|---|---|
| pipe-warn.log の種類の行（heavy-skip＋clock-broken を積んだ回） | heavy-skip だけ | **heavy-skip・clock-broken** |
| 鳴った題 | 🪟 連携に訴えがあります（clock-broken・**heavy-skip**） | 🪟 連携に訴えがあります（**clock-broken**） |

## ファイル
- ~/.claude/pipe-check.ps1（写し .bak-20260928c）・構文0件
- ~/.claude/unused/（五本を移した）
- reports/map-1-parts.md（五行）

## 残り
- 0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **461件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0928-1045.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1045.md) | 09-28 10:42 | 未検収の 🔗 の二行を済へ（r0928-1045） |

<!-- 控えの一覧 ここまで -->
