# pipe-warn の鈴を「続く間も3時間ごと・消えたら戻り」に（r0927-2226）

**終わり（残り0件）** — 2026-09-27 22:30ごろ（VAIO）。本体には触っていない。

## 変えたこと（~/.claude/pipe-check.ps1・写し .bak-20260927）
- **前**：訴えの種類が出た回に一発鳴らし、**同じ種類が続く間は鳴らさない**。消えても何も鳴らさない（09-24 16:20 の state-stale は一度鳴らしたきりで、残り約45時間黙っていた）
- **後**：
  - 新しい種類 … 今までどおり一発（「🪟 連携に訴えがあります（…）」／押しの失敗・公開の遅れは「🪟 異常です（…）」）
  - **続いている種類 … 前に鳴らしてから3時間たつごとに「⏰ まだ続いています（〈種類〉・〈続いた時間〉）」を一通**。同じ回に複数あれば一通にまとめる
  - **消えた種類 … 「✅ 戻りました（〈種類〉・〈続いた時間〉）」を一通**。控えから落とす（また出れば、もう一度一発から）
- 控え **pipe-warn-rung.txt** は一行に「種類〈TAB〉出始めた刻〈TAB〉最後に鳴らした刻」を持つ形にした。種類だけの古い行は、いまを両方の刻として読む（いまの控えは空なので、切り替えの影響は無い）
- 鳴らした記録は pipe-warn.log に「rung 鳴らし直した：…」「rung 戻りを鳴らした：…」の一行ずつ
- 札の本文の断り書きも「3時間ごとに鳴らし直します。消えたら戻りを一通」に直した
- 作り値のために `$script:PipeFakeNow`（いまの刻）・`$script:PipeFakeSay`（送る代わりに題を積む）を足した

## 作り値（いま＝09-27 22:30 とみなす・送り手は偽物）
| 例 | 控え（出始め／最後に鳴らした） | 鳴らした |
|---|---|---|
| **続いて3時間** | 18:30／19:25（3時間5分前） | **一通：「⏰ まだ続いています（state-stale・4時間0分）」**。最後に鳴らした刻が 22:30 へ進む |
| **続いて1時間** | 21:30／21:30 | **鳴らさない** |
| **消えた** | 20:15／20:15 | **一通：「✅ 戻りました（state-stale・2時間15分）」**。控えから落ちた |
| （新しい種類） | 無し | 一通：「🪟 異常です（連携に訴え：push-fail）」。控えに 22:30／22:30 で入る |

- 構文 NG 0・BOM 保持。pipe-check は予定表（ClaudePipeCheck）が毎分起こすので、次の走りから効く（常駐の起こし直しは要らない）

### 手元で回る段・雲で回る段（作法36）
- 手元：ClaudePipeCheck（毎分）→ pipe-check.ps1 の鈴（一発・3時間ごとの鳴らし直し・戻り）
- 雲：変わりなし

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **429件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0927-2226.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2226.md) | 09-27 22:30 | pipe-warn の鈴を「続く間も3時間ごと・消えたら戻り」に（r0927-2226） |
| [`r0927-2215.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2215.md) | 09-27 22:17 | healthchecks の down と、押しの止まりの間の pipe-warn の鈴（r0927-2215・読むだけ） |
| [`r0927-2046.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2046.md) | 09-27 20:47 | 定時再起動を写しから戻し、03:00 と 15:00 の二本立てに（r0927-2046） |
| [`r0927-2040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2040.md) | 09-27 20:41 | 定時再起動を 03:00 の一回だけに（r0927-2040） |
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

<!-- 控えの一覧 ここまで -->
