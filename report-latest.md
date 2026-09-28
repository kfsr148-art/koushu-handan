# 未検収を記録で片付ける（一つ目）（r0928-1020）

**終わり（残り0件）** — 2026-09-28 10:16ごろ（VAIO）。本体には触っていない。

## 1. 09-28 03:38 の立ち直りの「🔗 新しい線」 → **0通**。二行は**残した**
- **ntfy の取り置き**（24時間分・15件）に「🔗」の題は**0件**。03:00〜04:30 に届いたのは 🔁 落とします（03:01）・My First Check is DOWN（03:13）・🪟 見張りが止まっています（03:38）・My First Check is UP（03:39）・🪟 連携に訴え（hook-quiet・03:44）・✅ 戻りました（hook-quiet・5分・03:50）・🪟 時間切れ（再挑戦 1/3・03:59）の7件
- **inbox-watch.log の判じ**：
  - 03:00:22「宛先は前と同じなので鳴らさない（pid 10060 → 2916,10060）・Code タブ：引き継ぎは試していない」（落とす前に claude update が一瞬立てた claude）
  - 03:01:01「宛先は前と同じなので鳴らさない（pid 2916,10060 → 10060）・Code タブ：同じ会話が続いた」
  - **03:50:24「宛先は前と同じなので鳴らさない（pid 10060 → 10492）・Code タブ：同じ会話が続いた（宛先が立ち直る前と同じ・一覧に新しい行は立っていない）」** ← 03:38 の立ち直りの判じ
- **一通だけ・同じ会話が続いた」の条件のうち「一通」に当たらない**（0通）。0通なのは、09-26 19:11 に入れた「宛先が替わった時だけ鳴らす」のとおりで、宛先が同じ立ち直りでは鳴らない作りになったため
- そこで **「2026-09-23 22:26 次に窓が立ち直った回に「🔗 新しい線」が一通だけ届くこと」と「2026-09-23 23:15 03:00 の立ち直りの「🔗 新しい線」の判じ」の二行は閉じずに残した**。＊判じの字そのものは「同じ会話が続いた」で正しく出ている。22:26 の行は、いまの作りでは「宛先が替わった立ち直りの回に一通だけ」と書き替えないと当たらない（書き替えてはいない）

## 2. 「09-27 20:07」の行を閉じ、代わりに一行足した
**閉じた行**（kenshu-closed.tsv へ）
- 2026-09-27 20:07 次の再起動の後、仮想メモリが自動管理で効き、03:20 に五つが走って 23時台・01時台の固まりが出ないこと（人手待ち）
- 訳：仮想メモリの自動管理は 09-28 の起動の後に効いている（AutomaticManagedPagefile=True・割り当て 1344MB）＝済。03:20 の寄せは Google・Edge・断片の整理・SilentCleanup が動いた。Defender Cache Maintenance と Google（156 の新しい仕事）は作り主が上書きしたので追わない。夜の固まりは別の行（〜10-01 の三夜）で見る

**足した行**
- 2026-09-28 10:20 23時台・01時台に見張りが止まらないこと（〜10-01 の三夜・人手待ち）

**いまの未検収（8行）**
- 2026-09-21 19:57 使用量の上限で手待ち（人手待ち）
- 2026-09-23 次に取り下げで閉じた回に ✅ の札が印つきで立って鳴ること（人手待ち）
- 2026-09-23 次に遠隔の線が切れた回に「🪟 遠隔を繋ぎ直しました」が鳴り Code タブへ戻ること（人手待ち）
- 2026-09-23 22:26 次に窓が立ち直った回に「🔗 新しい線」が一通だけ届くこと（人手待ち）
- 2026-09-23 22:26 手待ちで 1500MB を超えた回に窓が残ったまま /clear で畳まれること（人手待ち）
- 2026-09-23 23:15 03:00 の立ち直りの「🔗 新しい線」の判じ（人手待ち）
- 2026-09-27 19:40 差し替え後の一週、空き 300MB 割れの鈴が鳴らないこと（〜10-04・人手待ち）
- 2026-09-28 10:20 23時台・01時台に見張りが止まらないこと（〜10-01 の三夜・人手待ち）

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **440件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0928-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1020.md) | 09-28 10:16 | 未検収を記録で片付ける（一つ目）（r0928-1020） |
| [`r0928-1010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1010.md) | 09-28 10:11 | 未検収の二行を済へ（記憶の診断・2048）（r0928-1010） |
| [`r0928-0950-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950-2.md) | 09-28 09:54 | conhost.exe の 0xc0000409 の落ち四回と、Windows Terminal の見込み（r0928-0950-2・読むだけ） |
| [`r0928-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950.md) | 09-28 09:54 | 09-28 の再起動の後の点検（記憶の診断・仮想メモリ・03:20・NODE_OPTIONS・引き継ぎ）（r0928-0950・読むだけ） |
| [`r0928-0348-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0348-2.md) | 09-28 03:48 | 再起動-2（r0928-0348・後の測り） |
| [`r0928-0345-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0345-2.md) | 09-28 03:45 | 再起動-2（r0928-0345・後の測り） |
| [`r0928-0302-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0302-2.md) | 09-28 03:02 | 再起動-2（r0928-0302・後の測り） |
| [`r0928-0138.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0138.md) | 09-28 01:40 | 09-27 23:25〜23:36 に Claude の窓が消えた元（r0928-0138・読むだけ） |
| [`r0928-0009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0009.md) | 09-28 00:10 | bcdedit の二件と未検収の一行を済へ（r0928-0009） |
| [`r0927-2311.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2311.md) | 09-27 23:15 | bcdedit /bootsequence {memdiag} を管理者でもう一度（また UAC が通らず）（r0927-2311） |
| [`r0927-2257.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2257.md) | 09-27 23:01 | y0927-2251 にヨシ → 次の起動を記憶の診断に（UAC が取り消され、走っていない）（r0927-2257） |
| [`r0927-2226.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2226.md) | 09-27 22:30 | pipe-warn の鈴を「続く間も3時間ごと・消えたら戻り」に（r0927-2226） |
| [`r0927-2215.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2215.md) | 09-27 22:17 | healthchecks の down と、押しの止まりの間の pipe-warn の鈴（r0927-2215・読むだけ） |
| [`r0927-2046.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2046.md) | 09-27 20:47 | 定時再起動を写しから戻し、03:00 と 15:00 の二本立てに（r0927-2046） |
| [`r0927-2040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2040.md) | 09-27 20:41 | 定時再起動を 03:00 の一回だけに（r0927-2040） |
| [`r0927-2027.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2027.md) | 09-27 20:28 | 未検収の二行の手入れ（r0927-2027） |
| [`r0927-2013.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2013.md) | 09-27 20:21 | 記憶 8GB に合わせて締め付けを緩めた（NODE_OPTIONS 2048・/clear の敷居 1500MB）（r0927-2013） |
| [`r0927-2006.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2006.md) | 09-27 20:07 | y0927-2003 にヨシ → tasks-to-0320.ps1 を管理者で走らせた（r0927-2006） |
| [`r0927-1955.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1955.md) | 09-27 19:56 | tasks-to-0320.ps1 に二つ足した（断片の整理・仮想メモリの自動管理）（r0927-1955） |
| [`r0927-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1945.md) | 09-27 19:49 | 09-27 01:00〜10:40 に VAIO が止まっていた元（r0927-1945・読むだけ） |

<!-- 控えの一覧 ここまで -->
