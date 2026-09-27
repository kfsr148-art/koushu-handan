# 記憶 8GB に合わせて締め付けを緩めた（NODE_OPTIONS 2048・/clear の敷居 1500MB）（r0927-2013）

**終わり（残り0件）** — 2026-09-27 20:21ごろ（VAIO）。本体には触っていない。いまの窓は落としていない（次に立った窓から効く）。

## 1. NODE_OPTIONS の --max-old-space-size 1024 → 2048
**起こす道の洗い出し**：NODE_OPTIONS を立てているのは **claude-loop.cmd だけ**。窓を起こす道は ClaudeCodeAtLogon（予定表）→ claude-loop.cmd、revive-claude.ps1 → ClaudeCodeAtLogon → claude-loop.cmd で、**どれも claude-loop.cmd を通る**。利用者・機械の環境変数に NODE_OPTIONS は無い。
＊ほかに claude を直に起こす台本が二つ（rc-restart.ps1・window-restart.ps1）あり、今は呼ばれていない（記録は 09-12 が最後）が、「起こす道すべて」に入れて同じ 2048 を立てた。

**~/.claude/claude-loop.cmd**（ASCII＋CRLF のまま・写し .bak-20260927）
```bat
rem     2026-09-27: 1024 -> 2048 (the machine now has 8GB).
set "NODE_OPTIONS=--max-old-space-size=2048"
```
（前：`set "NODE_OPTIONS=--max-old-space-size=1024"`）

**~/.claude/rc-restart.ps1**（36行目・写し .bak-20260927）
```powershell
$cl = 'cmd.exe /c start "麻雀 攻守判断 (Claude Code)" /MAX /D "C:\Users\user\Desktop\mahjong\koushu-handan" cmd.exe /k "set NODE_OPTIONS=--max-old-space-size=2048& C:\Users\user\.local\bin\claude.exe --continue --remote-control ' + $Name + '"'
# ＊NODE_OPTIONS は上の一行の中で立てる（2026-09-27・記憶 8GB に合わせ 2048）。Win32_Process Create は呼んだ側の環境を渡さない
```
**~/.claude/window-restart.ps1**（66行目・写し .bak-20260927）
```powershell
$cl = 'cmd.exe /c start "麻雀 攻守判断 (Claude Code)" /MAX /D "C:\Users\user\Desktop\mahjong\koushu-handan" cmd.exe /k "set NODE_OPTIONS=--max-old-space-size=2048& C:\Users\user\.local\bin\claude.exe --continue --remote-control koushu-handan"'
# ＊NODE_OPTIONS は上の一行の中で立てる（2026-09-27・記憶 8GB に合わせ 2048）。Win32_Process Create は呼んだ側の環境を渡さない
```
＊この二つは Win32_Process の Create で起こすので、呼んだ側の環境変数が子へ渡らない。そこで起こす一行の中で `set NODE_OPTIONS=…` を立てる形にした。**同じ形で node を起こし、子に `--max-old-space-size=2048` が届くことを確かめた**（claude は起こしていない）。

## 2. 手待ちで /clear を打つ重さの敷居 900MB → 1500MB
**~/.claude/inbox-watch.ps1**（写し .bak-20260927）
```powershell
#     claude の私用メモリが **1500MB** を越えていたら、窓へ **`/clear`** を打つ（send-text.ps1 の道）。
#     （2026-09-27 に 900MB → 1500MB。記憶を 8GB に足したため）
#   ＊「🪟 控えを畳みました（重さ NNNMB）」を一発。**一度打ったら、敷居（$HEAVY_MB）を下回るまで黙る**
$HEAVY_MB             = 1500
    if ($seen) { return }                             # 敷居を下回るまで黙る
          ('＊' + $HEAVY_MB + 'MB を下回るまで、この知らせは出しません。記録は ~/.claude/inbox-watch.log。'))
```
（前：`$HEAVY_MB = 900`、注と知らせの字の「900MB」）
- 知らせの本文の「＊900MB を下回るまで…」は、敷居の値を読む形（`$HEAVY_MB`）にした
- daily-notice.ps1 の注の「手待ちで900MB超」も「1500MB超・09-27 までは900MB」に直した（注だけ）
- 構文 NG 0（inbox-watch・rc-restart・window-restart・daily-notice）・BOM 保持
- 常駐を **20:20:30** に起こし直した（台本 20:20:06 より後）。敷居 1500MB はいまから効く

### 手元で回る段・雲で回る段（作法36）
- 手元：常駐 inbox-watch の Check-ClaudeHeavy（敷居 1500MB）／claude-loop（次に窓が立ったとき 2048）
- 雲：変わりなし

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **424件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0927-2013.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2013.md) | 09-27 20:21 | 記憶 8GB に合わせて締め付けを緩めた（NODE_OPTIONS 2048・/clear の敷居 1500MB） |
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
| [`r0926-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1040.md) | 09-26 10:43 | 公開側の札・09-24 15:00 の再起動と引き継ぎ・無線・いまの様子（r0926-1040・読むだけ） |
| [`r0924-1502-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1502-2.md) | 09-24 15:02 | 再起動-2（r0924-1502・後の測り） |

<!-- 控えの一覧 ここまで -->
