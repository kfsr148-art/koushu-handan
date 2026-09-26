# VAIO の iCloud の読み（r0926-1927・読むだけ）

**終わり（残り0件）** — 2026-09-26 19:32ごろ（VAIO）。読むだけ。何も止めていない。本体には触っていない。

## 1. iCloud の手（19:28）
| 名 | pid | 私用 | 使用 | CPU | 起動 |
|---|---|---|---|---|---|
| iCloudServices（iCloud 7.5 の本体） | 8668 | **76MB** | 98MB | 直近10秒 **0.00%**・起動から累計3秒 | 09-24 15:22 |
| APSDaemon（Apple の押し通知の受け） | 10204 | 5MB | 18MB | 0.00%・累計1秒 | 09-24 15:24 |
| AppleMobileDeviceProcess（iTunes の機器の手） | 4952 | 3MB | 13MB | 0.00%・累計7秒 | 09-24 15:22 |
| **計 3本** | | **84MB** | 129MB | | |

＊入っている物：iCloud 7.5.0.34（旧い形の iCloud for Windows）・Apple Application Support 6.5（32／64）・iTunes（ストア版 12139）。

## 2. 同期の姿
| 物 | 置き場 | 大きさ・綴り | 最後に書かれた刻 | 見立て |
|---|---|---|---|---|
| iCloud 写真 | ~/Pictures/iCloud Photos（Downloads・Uploads） | **0件・0MB**（二つとも空） | **2021-01-24 22:09／22:10**（箱ができた刻のまま） | 動いていない |
| 写真の手元の控え | ~/AppData/Local/Apple Inc（CloudKit・iCloudPhotoLibrary） | 4件・0.2MB | **2021-01-24**（ckcachedatabase.db） | 動いていない |
| iCloud Drive | ~/iCloudDrive・~/iCloud Drive | **置き場なし** | — | 入っていない |
| 予定・連絡先（Outlook の足し物 Apple.DAV.Addin） | 登録あり（LoadBehavior 3） | — | — | Outlook（Office 15）は入っているが、いま走っていない |
| ブックマーク・パスワード | 手が走っていない | — | — | 動いていない |
| iCloud の記録 | ~/AppData/Roaming/Apple Computer/Logs | 4本（09-22〜09-24）・8.0MB（フォルダ全体・36件） | 09-24 15:24 | 中身は起動の挨拶と字形の断りだけ。**同期（upload／download／sync 等）の語は一つも無い** |

- **最後に同期した刻として手元で拾えるのは 2021-01-24 が最後**。それより後に写真・Drive が動いた跡は無い
- ＊iCloud に入っている（サインインしている）かは、画面を開かないと読めないので確かめていない

## 3. 起動時に iCloud が立つ設定
- **HKCU\Software\Microsoft\Windows\CurrentVersion\Run の「iCloudServices」**（`"C:\Program Files (x86)\Common Files\Apple\Internet Services\iCloudServices.exe"`）。スタートアップの切り替え（StartupApproved）は**有効**。**これ一つだけ**
- 予定表・スタートアップの箱・サービスには iCloud の物は無い
- ＊同じ所に iTunesHelper の切り替えも残っている（Run32 は有効・Run は値6）が、いま iTunesHelper は走っていない

## 4. 止めたときに失う物
- **手元で見える限り写真と Drive の同期は 2021年から動いていないので、止まるのは Outlook の予定・連絡先の iCloud 連携（Outlook を使っていれば）と、Apple 機器からの押し通知の受け（APSDaemon）くらい。空くのは私用で約84MB。**

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **414件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0924-1033.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1033.md) | 09-24 10:35 | 残る y0921-0900 を済へ・ヨシ待ち0件（r0924-1033） |
| [`r0924-1009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1009.md) | 09-24 10:14 | ヨシ待ちの納品済み7件を済へ・残る1件（r0924-1009） |
| [`r0924-0506.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-0506.md) | 09-24 05:09 | 04:30 の定時・見送りの訳からヨシ待ちを外す・押し残しの数えられず・ヨシ待ち8件（r0924-0506） |
| [`r0924-0421.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-0421.md) | 09-24 04:25 | 00:10 の claude（4412）・いまの本数・03:00 の定時（r0924-0421・読むだけ） |

<!-- 控えの一覧 ここまで -->
