# 定時再起動を 03:00 の一回だけに（r0927-2036）

**終わり（残り0件）** — 2026-09-27 20:41ごろ（VAIO）。本体には触っていない。

- **写し**：予定表の ClaudeDailyReboot の設定（XML）を **~/.claude/ClaudeDailyReboot.xml.bak-20260927** に取った（4346バイト・引き金2つが入っている）
- **変えた**：15:00 の引き金を外した（利用者の仕事なので管理者なしで変えられた）

| | 前 | 後 |
|---|---|---|
| 引き金1 | 毎日 **03:00**・30分ごとに1時間30分（03:00／03:30／04:00／04:30） | **そのまま** |
| 引き金2 | 毎日 **15:00**・30分ごとに1時間30分（15:00／15:30／16:00／16:30） | **外した** |

- **後の引き金（読み直し）**：`DailyTrigger 始まり 2026-09-21T03:00:00+09:00・間隔1日・繰り返し PT30M・期間 PT1H30M・有効` の**一つだけ**。次回 **09-28 03:00**
- 動かす物（wscript.exe → daily-reboot.ps1）と作り主（user）は変わっていない
- ＊daily-reboot.ps1 の頭の注には「一日二回（03:00 と 15:00）」の字が残っている（台本の動きは引き金まかせで、15時の枠は来なくなるだけ）。今回は触っていない
- 戻すとき：`Register-ScheduledTask -TaskName ClaudeDailyReboot -Xml (Get-Content 'C:\Users\user\.claude\ClaudeDailyReboot.xml.bak-20260927' -Raw) -Force`

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **426件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0927-2036.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2036.md) | 09-27 20:41 | 定時再起動を 03:00 の一回だけに（r0927-2036） |
| [`r0927-2027.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2027.md) | 09-27 20:28 | 未検収の二行の手入れ（r0927-2027） |
| [`r0927-2013.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2013.md) | 09-27 20:21 | 記憶 8GB に合わせて締め付けを緩めた（NODE_OPTIONS 2048・/clear の敷居 1500MB）（r0927-2013） |
| [`r0927-2006.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2006.md) | 09-27 20:07 | y0927-2003 にヨシ → tasks-to-0320.ps1 を管理者で走らせた（r0927-2006） |
| [`r0927-1955.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1955.md) | 09-27 19:56 | tasks-to-0320.ps1 に二つ足した（断片の整理・仮想メモリの自動管理）（r0927-1955） |
| [`r0927-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1945.md) | 09-27 19:49 | 09-27 01:00〜10:40 に VAIO が止まっていた元（r0927-1945・読むだけ） |
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

<!-- 控えの一覧 ここまで -->
