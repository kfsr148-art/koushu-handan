# 毎晩 23時台に見張りが止まる元（r0926-2357・読むだけ）

**終わり（残り0件）** — 2026-09-27 00:07ごろ（VAIO）。読むだけ。何も直していない。本体には触っていない。

**一行で：刻が合うのは、毎晩 23:06 ごろに一斉に立つ Windows の保守の仕事（Defender Cache Maintenance・SilentCleanup・User_Feed_Synchronization ほか）。この間、盤の読み書きが詰まり（2345%）、見張りの段が20分以上動けなくなる。CPU（7%）と空き（826MB）は足りていた。**

## 見張りの止まり（watch-status.log の刻の飛び）
| 夜 | 止まり |
|---|---|
| 09-23 | 22:46→22:52（6分） |
| 09-24 | **23:10→23:26（16分）** |
| 09-25 | **23:08→23:22（14分）** |
| 09-26 | **23:04→23:29（25分）** |

## 1. 予定表で 22:30〜23:30 に走る物（Claude* 以外も）
**今夜（09-26）に立った物**（TaskScheduler の記録。Claude* は除く）
| 始 | 終 | 仕事 | 見立て |
|---|---|---|---|
| **23:06:53** | **23:21:44** | \Microsoft\Windows\Windows Defender\**Windows Defender Cache Maintenance** | 刻の引き金なし（保守の仕事）。**止まりとほぼ重なる** |
| **23:06:53** | **23:21:53** | \Microsoft\Windows\DiskCleanup\**SilentCleanup** | 刻の引き金なし（保守の仕事）。**止まりとほぼ重なる** |
| 23:06:53 | 23:07:11 | Windows Defender Scheduled Scan | 走査は始めてすぐ止めた（下の2） |
| 23:06:53 | 23:07:58 | Windows Defender Verification／Cleanup | 短い |
| 23:06:53 | — | WindowsUpdate\AUScheduledInstall | 結果 2148007941＝0x80080005（サーバーの実行に失敗） |
| 23:07:25 | 23:20:08 | **User_Feed_Synchronization**（引き金は 06:05。取りこぼしを後で走らせる形） | 止まりと重なる |
| 23:16:55 | 23:23:15 | MicrosoftEdgeUpdateTaskMachineUA | 後半に重なる |
| 23:17:10 | 23:23:03 | GoogleUpdaterTaskSystem | 後半に重なる |
| 23:19:37 | — | McAfee\WPS\McAfee Message Check | |
| 23:23:14 | 23:24:19 | Sony\VAIO Registration Client\Half One hour | |
| — | — | Data Integrity Check And Scan（引き金 23:00） | 前回は 11-30。今夜は走っていない |

＊前の夜（09-23〜09-25）の立ち上がりは、TaskScheduler の記録が今夜の分しか残っておらず（古い分は流れていた）、読めなかった。

## 2. 守りの定期の走査・自動保守の刻
- **守りの定期の走査**：毎日（ScanScheduleDay 0）・**02:00**・簡易走査（ScanParameters 1）・CPU の上限 50%
- **自動保守（Automatic Maintenance）**：開始の刻 **03:00**（Activation Boundary）・起こし（WakeUp）1
- ところが守りの走査の記録（Defender の Operational）は毎晩 **23時台**に始まっている：09-23 23:09:29→23:12:53／**09-24 23:06:47→23:21:43**（止まり 23:10→23:26 と重なる）／09-25 23:06:50（すぐ止めた）／09-26 23:07:06（すぐ止めた）
- ＊定時の 03:00・02:00 に機械が忙しい・落ちている回は、保守が後の手待ちの時間へずれて走る。この機械では毎晩それが 23:06 ごろに来ている見込み（確かめてはいない）

## 3. 今夜 23:00〜23:30 の姿
- **詰まりの見張り（jam-snap）23:08:50**：全体 **CPU 7.1%／空きメモリ 826MB／ディスク 2345.9%**。claude の作業セットは 175MB まで押し出されていた。git 2本・powershell 18本・conhost 15本
- **見張りの段（watch-step-log）**：23:06 に始めた回の「**使用量を終えた**」が **+1364.8秒（22.7分）**。23:29 の回は「入口が重かった（98.3秒・131.7秒）」で先へ進まず
- **pipe-warn**：23:27 hook-quiet（hook.log が26〜29分書かれていない）／23:28:51 step-slow 1364.8秒／23:30:38 state-stale（公開側の生存が47分止まり）
- **イベント記録**：System は 23:08:53 の DCOM 10010（登録の時間切れ）だけ。Application は 23:07 の SecurityCenter（Defender の状態の更新）だけ
- ＊09-24 も同じ形（jam-snap 23:23 に CPU 7.8%／空き 1001MB／ディスク 1560%）

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **418件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0926-2357.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2357.md) | 09-27 00:07 | 毎晩 23時台に見張りが止まる元（r0926-2357・読むだけ） |
| [`r0926-2007-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2007-2.md) | 09-26 20:14 | 前の枠（19:43）の残り：一時間に書き替わる綴りの数（r0926-2007-2） |
| [`r0926-2007.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2007.md) | 09-26 20:10 | VAIO の型番と記憶の差し口（r0926-2007・読むだけ） |
| [`r0926-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1940.md) | 09-26 19:41 | iCloud の起動を外して止めた（r0926-1940） |
| [`r0926-1927.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1927.md) | 09-26 19:32 | VAIO の iCloud の読み（r0926-1927・読むだけ） |
| [`r0926-1911.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1911.md) | 09-26 19:17 | 「🔗 新しい線」は宛先が替わった時だけ鳴らす（r0926-1911） |
| [`r0926-1903.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1903.md) | 09-26 19:04 | 未検収の healthchecks の check 作りを取り下げで済へ（r0926-1903） |
| [`r0926-1852.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1852.md) | 09-26 18:54 | 未検収の「画面バッファ500行」を済へ（r0926-1852） |
| [`r0926-1828.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1828.md) | 09-26 18:32 | 未検収の四行を読んで確かめる（r0926-1828） |
| [`r0926-1717.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1717.md) | 09-26 17:20 | claude の大きさと会話の綴りの推移・未検収の四行を済へ（r0926-1717） |
| [`r0926-1706.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1706.md) | 09-26 17:08 | 古い index.lock を押しの前に外す・引き継ぎの判じを窓の刻で（r0926-1706） |
| [`r0926-1127.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1127.md) | 09-26 11:36 | 公開側への押しが通らない元（index.lock）を直す・札の全文を ntfy へ（r0926-1127） |
| [`r0926-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1040.md) | 09-26 10:43 | 公開側の札・09-24 15:00 の再起動と引き継ぎ・無線・いまの様子（r0926-1040・読むだけ） |
| [`r0924-1502-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1502-2.md) | 09-24 15:02 | 再起動-2（r0924-1502・後の測り） |
| [`r0924-1455.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1455.md) | 09-24 14:58 | 14:30〜14:55 に /remote-control を打ったか（r0924-1455・読むだけ） |
| [`r0924-1234.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1234.md) | 09-24 13:23 | claude の自動更新を止めて落とす直前に更新・電源と容量と鍵の読み（r0924-1234） |
| [`r0924-1149.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1149.md) | 09-24 11:54 | 常駐を AboveNormal で立てる・枠の鉤の timeout 60秒・いまのメモリ上位10本（r0924-1149） |
| [`r0924-1117.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1117.md) | 09-24 11:23 | Check-RcDrop の「切れ」を会話の記録で判じる（r0924-1117） |
| [`r0924-1054.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1054.md) | 09-24 11:02 | VAIO に残る Edge・node の確かめを洗って雲へ（r0924-1054） |
| [`cloud-check-fast-20260924-015941.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20260924-015941.md) | 09-24 11:02 | 雲で回した：`check-fast.js` |

<!-- 控えの一覧 ここまで -->
