# 静かな帯の漏れ二通を塞いだ（r0928-1750）

**終わり（残り0件）** — 2026-09-28 17:50ごろ（VAIO）。本体には触っていない。

## 漏れた元
| 刻 | 漏れた 🪟 | 元 |
|---|---|---|
| 16:55 | after-reboot -OnLogon の「再起動の後の点検」の欠け | after-reboot.ps1 が帯を見ていなかった |
| 16:58 | watch-notify の「見張りの生存記録が N 分途切れています」 | 帯で止めていたのは**押し送りだけ**。stale は**本編の札そのもの**が 🪟 なので、Send-Ntfy の「待たせずに出す」から素通りした（16:58:08 に「stale の鈴は出さない」と書いた同じ秒に「待たせずに出す [🪟 異常です（手が要ります）]」） |

## 直し
1. **after-reboot.ps1**：欠けがあって帯の中なら、🪟 を出さず `Hush-InBand '再起動の後の点検の欠け'` で数え、after-reboot.log に一行残す。欠けが無い回・帯の外は今まで通り。作り値用に `-FakeBandPath` を足した（写し .bak-20260928b）
2. **watch-notify.ps1**：dead／stale を帯で黙らせた回は、**本編の札も出さない**（`$qbMainHushed`）。帯の外は今まで通り（写し .bak-20260928c）
- 構文0件ずつ

## 作り値（帯の印は scratchpad・送り手は偽物。本物の quiet-band.txt は作られていない）
| | 帯の外 | 帯の中（再起動・40分） |
|---|---|---|
| watch-notify 本編の 🪟（生存記録） | 出す | **出さない** |
| watch-notify 押し送り | 出す | **出さない** |
| after-reboot 点検の欠け（予定12件） | 「🪟 異常です：再起動の後の点検」 | **出さない**（記録に一行） |
| 明けの ✅ | — | 「✅ 戻りました（再起動・40分・帯の間に黙らせた物 **2件**）」本文に「stale・再起動の後の点検の欠け」 |

## 実機
- 画面に出る物は無し。**次の再起動で、帯の間に 🪟 が一通も届かず、明けの ✅ の本文に黙らせた物が載ること**（人手待ち）

## ファイル
- ~/.claude/after-reboot.ps1 ／ ~/.claude/watch-notify.ps1

## 残り
- 0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **456件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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

<!-- 控えの一覧 ここまで -->
