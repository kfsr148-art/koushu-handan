# y0927-2251 にヨシ → 次の起動を記憶の診断に（UAC が取り消され、走っていない）（r0927-2257）

**終わり（残り1件）** — 2026-09-27 23:01ごろ（VAIO）。本体には触っていない。

- **y0927-2251**（断片の一行：`bcdedit /bootsequence {memdiag}` を管理者で打つ）へのヨシを受け、印を yoshi-closed.tsv へ移した（ヨシ待ちは0件）
- 22:57:45 に管理者の窓を起こした。形は断片の一行どおり（`bcdedit /bootsequence {memdiag}` と `bcdedit /enum {memdiag}`）で、確かめのために `bcdedit /enum {bootmgr}` の読みを ~/.claude/memdiag-bcdedit-20260927.txt へ書く段を同じ窓に足した
- **UAC が取り消された**：`Start-Process : This command cannot be run due to the error: The operation was canceled by the user.`（UAC の窓で「いいえ」か、答えが無いまま時間切れ）。**bcdedit は一度も走っていない**。読みの綴りもできていない
- **次の起動は記憶の診断になっていない**（bootsequence は設定されていない）。bcdedit の読みそのものは管理者でないとできないので、札に載せられる読みは無い

## 未検収に足した二行
- 2026-09-27 22:58 bcdedit /bootsequence {memdiag} を管理者で走らせ直すこと（22:57 は UAC が取り消された・人手待ち）
- 2026-09-27 22:58 記憶の診断を走らせた次の起動の後に、System の Microsoft-Windows-MemoryDiagnostics-Results（1101／1201 など）を読むこと（人手待ち）

## 走らせ直す一行（同じ形・読みを綴りに残す）
```powershell
Start-Process powershell -Verb RunAs -ArgumentList '-NoExit -Command "bcdedit /bootsequence {memdiag}; bcdedit /enum {bootmgr}; bcdedit /enum {memdiag}"'
```
＊走ったあと、`bcdedit /enum {bootmgr}` の `bootsequence` の行に `{memdiag}` が出ていれば、次の起動は記憶の診断になる（一度きり）。

### 残り
1. 2026-09-27 22:57:12 の枠：bcdedit /bootsequence {memdiag} を走らせる（UAC が取り消され未了）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **430件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0926-1911.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1911.md) | 09-26 19:17 | 「🔗 新しい線」は宛先が替わった時だけ鳴らす（r0926-1911） |
| [`r0926-1903.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1903.md) | 09-26 19:04 | 未検収の healthchecks の check 作りを取り下げで済へ（r0926-1903） |
| [`r0926-1852.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1852.md) | 09-26 18:54 | 未検収の「画面バッファ500行」を済へ（r0926-1852） |

<!-- 控えの一覧 ここまで -->
