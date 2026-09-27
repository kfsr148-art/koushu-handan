# 09-27 01:00〜10:40 に VAIO が止まっていた元（r0927-1945・読むだけ）

**終わり（残り0件）** — 2026-09-27 19:48ごろ（VAIO）。読むだけ。何も直していない。本体には触っていない。

**一行で：落ちたのではなく、動いたまま固まっていた。01:06:53 に Windows の自動保守（C: の最適化＝デフラグ 〜01:50:51・SilentCleanup ほか）が一斉に立って見張りが回らなくなり、02:30 からは仮想メモリの不足で新しい手が立てなくなった。10:34 の立ち上がりは人の手（ロック画面／Ctrl+Alt+Del の画面からの再起動）。0x4A ではない。**

## 止まりの記録
| 見たもの | 結果 |
|---|---|
| Kernel-Power 41（電源が急に落ちた） | **無し** |
| EventLog 6008（前回の終わりが予期しない） | **無し** |
| BugCheck 1001（停止コード） | **無し**。**0x4A ではない**（前の無線の口の話には当たらない） |
| WLAN-AutoConfig 8003（切れ） | **無し**（10:35:37 の繋ぎ 8001 だけ） |
| ディスクの誤り（disk・Ntfs・storahci の警告以上） | **0件** |
| Resource-Exhaustion-Detector 2004（仮想メモリの不足） | **81回**（02:30〜09:14）。多く使っていたのは claude.exe（5072）710MB・MsMpEng 357MB・SearchApp 131MB |
| Application Popup 26（手が立てない） | **113回**。powershell.exe などが 0xc0000142／0xc000012d で起動に失敗 |
| Service Control Manager 7000／7009 | 02:47〜 AppX Deployment・Microsoft Account Sign-in Assistant が時間切れで立たない |

## 並べた刻
| 刻 | 起きたこと |
|---|---|
| 01:00:01 | Adobe Acrobat Update Task（01:00:06 に終わる） |
| 01:06:02／01:06:40 | **見張りの最後の行**（watch-status.log／inbox-watch.log）。空き 648MB |
| **01:06:53** | **Windows の自動保守が一斉に立つ**：Defrag\ScheduledDefrag・DiskCleanup\SilentCleanup（〜01:21:53）・WER QueueReporting（〜01:25:10）・SkyDrive の保守二つ（ログオンの形で立てず）ほか |
| 01:08:45〜 | 見張りの仕事（ClaudeJamWatch・ClaudeRevive・ClaudeWatchNotify）が「前の回がまだ走っている」（322）・「時間の上限を越えた」（329）で回らなくなる |
| 01:16〜01:39 | Edge の更新・Google の更新・McAfee・VAIO 登録の仕事 |
| 01:18:18 | Volsnap 33（C: の古い影の写しを消した） |
| **01:50:51** | **C: の最適化（デフラグ）が終わる**（トリムは盤が対応せず） |
| **02:30〜09:14** | 仮想メモリの不足が続く（2004 が5分ごと）。手が立てない（Popup 26） |
| 03:00〜04:30 | daily-reboot の枠。reboot.log に**一行も無い**（台本そのものが立てなかった見込み） |
| **10:34:06** | **User32 1074：winlogon.exe が NT AUTHORITY\SYSTEM の代わりに再起動・理由 0x500ff** |
| 10:34:28／10:34:45 | 整った終わり（Kernel-General 13）と起動（12）。10:35:37 に無線が繋がる |

## 10:34 は人の手か自動か → **人の手の見込み**
| 刻 | 起こした手 | 誰の代わり | 理由 |
|---|---|---|---|
| 09-20〜09-24 の定時（daily-reboot） | shutdown.exe | VAIO\user | 0x800000ff |
| **09-27 10:34:06** | **winlogon.exe** | **NT AUTHORITY\SYSTEM** | **0x500ff** |

daily-reboot の形（shutdown.exe・利用者の名）とは違う。winlogon が SYSTEM の代わりに 0x500ff で起こすのは、**ロック画面やCtrl+Alt+Del の画面の電源の釦から再起動を選んだとき**の形（確かめたのは記録の形まで。押した人は記録からは分からない）。

＊前の夜（09-26）の 23:06 の一式（Defender Cache Maintenance・SilentCleanup ほか）とは別に、この 01:06 には C: のデフラグ（ScheduledDefrag）が加わっていた。

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **421件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0927-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1945.md) | 09-27 19:48 | 09-27 01:00〜10:40 に VAIO が止まっていた元（r0927-1945・読むだけ） |
| [`r0927-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1940.md) | 09-27 19:41 | 記憶の差し替えの読み（r0927-1940・読むだけ） |
| [`r0927-0023.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-0023.md) | 09-27 00:29 | 夜の保守・更新の仕事の起動条件と、03:20 へ寄せる管理者の一本（r0927-0023） |
| [`r0926-2357.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2357.md) | 09-27 00:08 | 毎晩 23時台に見張りが止まる元（r0926-2357・読むだけ） |
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

<!-- 控えの一覧 ここまで -->
