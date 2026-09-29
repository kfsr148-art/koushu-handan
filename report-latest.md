# conhost の落ち（0xc0000409）・窓の設定を素へ戻した（r0930-0120）

**終わり（残り0件）** — 2026-09-30 01:20ごろ（VAIO）。本体には触っていない。**いまの窓は落としていない**（設定は次に立つ窓から効く）。三つの枠（01:07 読むだけ・01:09 conhost を止めよ・01:12 窓の設定を素へ）をまとめて答える。

## 1. 落ちの五回と共通点
| 刻 | 落ちた物 | 直前5分の窓 |
|---|---|---|
| 09-21 08:51:15（二つ同時） | conhost.exe・0x68eff | 08:47 に stop（終わり）の後、手待ち。出力・/clear・send-text 無し。空き 480〜650MB（4GB の頃） |
| 09-27 23:31:18 | conhost.exe・0x68eff | 最後の会話の記録は 23:16:32（15分前）。手待ち。鉤は 23:28 の生存だけ |
| 09-29 19:11:49 | conhost.exe・0x68eff | 最後は 18:48:49（23分前）。手待ち。鉤は 19:08 の生存だけ |
| 09-30 00:21:03 | conhost.exe・0x68eff | 最後は 09-29 19:35:16（286分前）。手待ち。鉤は 00:18 の生存だけ |
- ＊09-27 04:43（sechost.dll）・05:21（ucrtbase.dll）は別の所の落ち（仮想メモリ不足の最中）で、数に入れていない
- **共通点（一行）：どれも窓が手待ちで何も書いていない間に、conhost.exe の同じ所（0x68eff・スタックの壊れ検知 0xc0000409）で落ちた。直前5分に /clear・send-text・出力は一つも無く、空きも 480MB〜4GB 台とばらばら——こちらの手の出し入れや空き不足ではなく、conhost そのもの（10.0.19041.5198）の落ち**
- ＊どの回も窓は 09-12 の題つきの設定（BIZ UDゴシック・170桁×44行・控え 9001行・最大化）で立っていた

## 2. 避けられる形 … 窓の設定を素へ戻した（01:12 の枠）
- 写し：~/.claude/window-reset-bak-20260930/（console-title-key.reg・デスクトップの .lnk・ClaudeCodeAtLogon.xml）
- **HKCU\Console\麻雀 攻守判断 (Claude Code) を消した**（09-12 に作った題つきの鍵。字 BIZ UDGothic 16・控え 9001行×170桁・窓 44行×170桁）。HKCU\Console の既定（__DefaultTTFont__・300行×80桁・窓 25×80）は 09-12 より前から触られていないので、そのまま
- **デスクトップの「麻雀 攻守判断 (Claude Code).lnk」を作り直した**（/MAX を外し、中の窓の設定の塊ごと作り直し。2449→2175 バイト）。「Claude Code.lnk」（08-08）は既定のままなので触っていない
- **ClaudeCodeAtLogon の起こす道から /MAX を外した**（題は残す——send-text・遠隔の繋ぎ直しが題で窓を探すため）
- 作り値（同じ起こし方・同じ題で、claude の代わりに測る台本を回して閉じた）：**題「麻雀 攻守判断 (Claude Code)」・字 ＭＳ ゴシック・控え 300行×80桁・窓 25行×80桁・最大化 False**＝既定で立った

## 3. Windows Terminal は入れて確かめた（起こす道は替えていない）
- winget で **Windows Terminal 1.24.11911.0** を入れた（利用者の範囲・管理者なし）
- 作り値（別の窓「WTTEST」を wt.exe -w new で立て、cmd＋受け手の台本を回した。いまの窓には触れていない）
  - **send-text：「sent 42 pid=7192」→ 受け手に「hello-from-send-text」が届いた**
  - **read-screen：「hit Remote Control disconnected …」＝画面の字を読めた**
  - 見張りの窓の数え（WinScan）：受け手・cmd は窓なし（隠れ窓として触らない）、親の WindowsTerminal が「VIS」＝**窓ありと数える**
  - 試しの窓は閉じた（WT の手も止めた）
- **仕組みの選び**：起こす道は **wt.exe に替えず、既定の窓（conhost）のままにした。**あとから来た 01:12 の枠が「既定の窓で立つ形に」と言っており、01:09 の枠も「避けられる形なら直せ、無理なら WT」の順だったため。設定を素へ戻した形で次に落ちるかを見て、落ちれば起こす道を wt.exe へ替える（send-text・read-screen・窓の数えが効くことは確かめ済み）。＊選ばなかった案：いま wt.exe へ替える

## 実機
- **次に窓が立ったら（定時の再起動 03:00 の後）、小さい既定の窓（ＭＳ ゴシック・80桁）で立つこと。字が小さく見づらければ言ってください**（09-12 の設定は写しから戻せる）（人手待ち）
- conhost の落ちが既定の窓でも出るかは、これからの様子見（人手待ち）

## 残り
- 0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **477件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0930-0120.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0930-0120.md) | 09-30 01:18 | conhost の落ち（0xc0000409）・窓の設定を素へ戻した（r0930-0120） |
| [`r0929-1934.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1934.md) | 09-29 19:34 | 窓だけが消えた 🪟 を帯に入れる・19:14 の窓の落ちの元（r0929-1934） |
| [`r0929-1848.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1848.md) | 09-29 18:48 | map-2・map-3 を 09-29 18:00 の姿に書き直した（r0929-1848） |
| [`map-3-incidents.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-3-incidents.md) | 09-29 18:47 | 09-21〜09-29 の出来事（map-3） |
| [`map-2-alerts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-2-alerts.md) | 09-29 18:47 | 鈴と札の全種類（map-2） |
| [`r0929-1844.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1844.md) | 09-29 18:44 | 途中で切れた枠を、続きの「以上」で繋ぐ（r0929-1844） |
| [`r0929-1745.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1745.md) | 09-29 17:45 | 偽の残り三つを塞いだ（延び・pipe-check・郵便受け）（r0929-1745） |
| [`r0929-1633.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1633.md) | 09-29 16:31 | claude update を予定表 ClaudeUpdate へ切り離した（r0929-1633） |
| [`r0929-1616.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1616.md) | 09-29 16:15 | 枠の切れ・ログオン後の二本・03:33 の更新・偽の鈴9通（r0929-1616） |
| [`r0929-1528-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1528-2.md) | 09-29 15:28 | 再起動-2（r0929-1528・後の測り） |
| [`r0929-1524-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1524-2.md) | 09-29 15:24 | 再起動-2（r0929-1524・後の測り） |
| [`r0929-1427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1427.md) | 09-29 14:25 | 同じ枠の二度落としを塞いだ・落とす前の起き上がり札・偽の鈴9通（r0929-1427） |
| [`r0929-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0430-2.md) | 09-29 04:30 | 再起動-2（r0929-0430・後の測り） |
| [`r0929-0412.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0412.md) | 09-29 04:10 | 夜の鈴の棚卸し（09-28 13:30〜09-29 04:10）（r0929-0412） |
| [`r0929-0330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0330-2.md) | 09-29 03:30 | 再起動-2（r0929-0330・後の測り） |
| [`r0928-2003.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2003.md) | 09-28 19:59 | 「見張りの生存記録が N 分途切れています」の偽（5419分・5776分）を直した（r0928-2003） |
| [`r0928-2005.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2005.md) | 09-28 19:42 | map-3 の未特定・様子見の五行の元を当て直した（r0928-2005） |
| [`r0928-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1945.md) | 09-28 19:38 | 仮置き・未実装の印と、欠けた絵・音の洗い出し（r0928-1945） |
| [`r0928-1922.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1922.md) | 09-28 19:17 | map-2 の要確認（三つ目）：heavy-skip・記録の順・My First Check・使わない台本（r0928-1922） |
| [`map-1-parts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-1-parts.md) | 09-28 19:16 | 連携で動いている物の一覧（map-1） |

<!-- 控えの一覧 ここまで -->
