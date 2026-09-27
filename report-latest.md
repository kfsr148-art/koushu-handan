# 09-27 23:25〜23:36 に Claude の窓が消えた元（r0928-0138・読むだけ）

**終わり（残り0件）** — 2026-09-28 01:40ごろ（VAIO）。読むだけ。何も直していない。本体には触っていない。

**一行で：「窓の手が落ちた」。23:31:18 に Claude の窓の conhost.exe（窓を描く手）が例外 0xc0000409 で落ち、窓ごと消えた。人の手でも見張りでもない（見張りは消えた後に立て直しただけ）。**

## 刻の並び
| 刻 | 起きたこと | 出どころ |
|---|---|---|
| 19:38:26 | revive が窓を立て直した（0本が2分続いたため） | revive.log |
| **19:38:27** | **その窓の conhost.exe（pid 9732）が立つ** | Application Error 1000 の「開始時刻」 |
| 19:38:29 | pick-resume（`--resume 50aca653`）→ claude 5168 | pick-resume.log |
| 23:30:37 | 見張りの数え：プロセス1・窓1（まだ生きている） | watch-status.log |
| **23:31:18** | **conhost.exe（pid 9732）が落ちる**。例外コード **0xc0000409**（スタックの破れ／即時の落ち）・障害オフセット 0x68eff・conhost 10.0.19041.5198 | **Application Error 1000** |
| 23:31:21 | WER 1001（BEX64・conhost.exe） | Windows Error Reporting |
| 23:32:14 | 見張りの数え：**プロセス1・窓0**（claude だけ残り、窓が無い） | watch-status.log |
| 23:32:25 | revive：対話の claude が0本 | revive.log |
| 23:34:09 | 見張りの数え：プロセス0 | watch-status.log |
| **23:34:25** | **revive が立て直した**（今日2回目）→ 23:34:26 輪の cmd 7732・23:34:28 claude 10060（`--resume 50aca653`・7.8MB） | revive.log・pick-resume.log |
| 23:34:53 | 「🔗 新しい線」は宛先が同じなので鳴らさない（同じ会話が続いた） | inbox-watch.log |

## 三つのどれか
- **人の手で閉じた → 違う**：帯に UAC の窓は無い（UAC は 23:12〜23:14 の時間切れが最後）。System の記録は 23:25〜23:36 に0件。遠隔の画面（remoting_host の二本）は 19:11／19:12 から走ったままで、帯に記録なし。閉じたのなら conhost の落ちの記録は出ない
- **見張りが落とした → 違う**：inbox-watch.log に固まり・重さでの立て直しの行は無い。revive は落ちた**後**（23:32:25 に0本を見て、2分待って 23:34:25）に起こしただけ
- **窓の手が落ちた → これ**：窓の conhost.exe が自分で落ちた記録（1000・1001）が 23:31:18 にあり、その直後に窓が0になっている

＊同じ conhost.exe の 0xc0000409 の落ちは、**09-27 04:43:42・05:21:51**、**09-21 08:51:15（2件）** にもある。

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **433件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0927-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1940.md) | 09-27 19:41 | 記憶の差し替えの読み（r0927-1940・読むだけ） |
| [`r0927-0023.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-0023.md) | 09-27 00:29 | 夜の保守・更新の仕事の起動条件と、03:20 へ寄せる管理者の一本（r0927-0023） |
| [`r0926-2357.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2357.md) | 09-27 00:08 | 毎晩 23時台に見張りが止まる元（r0926-2357・読むだけ） |
| [`r0926-2007-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2007-2.md) | 09-26 20:14 | 前の枠（19:43）の残り：一時間に書き替わる綴りの数（r0926-2007-2） |
| [`r0926-2007.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2007.md) | 09-26 20:10 | VAIO の型番と記憶の差し口（r0926-2007・読むだけ） |
| [`r0926-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1940.md) | 09-26 19:41 | iCloud の起動を外して止めた（r0926-1940） |
| [`r0926-1927.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1927.md) | 09-26 19:32 | VAIO の iCloud の読み（r0926-1927・読むだけ） |

<!-- 控えの一覧 ここまで -->
