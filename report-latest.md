# map-2 の要確認（一つ目）：#16・#19・#35 を作り値で確かめて直した（r0928-1901）

**終わり（残り0件）** — 2026-09-28 19:01ごろ（VAIO）。本体には触っていない。三つとも外れていたので直した。

## 三行
1. **#16 巡回の止まり**：外れ。03:45 の回は「43分」と読んで stall を立てたが、同じ回が「入口が重かった」で降りて『完了』を書き、次の回は止まりを見られず消えていた → 降りる回は stall-carry.txt へ持ち越し、次の回が拾って鳴らす。帯の中では出さず「巡回の止まり（stall）」として数える（再起動は走っている回を殺すので、持ち越しだけだと毎朝偽の 🪟 になる）
2. **#19 窓だけが消えた**：外れ（🪟 側へ倒れていた）→ 窓だけの形は一回（2分）待って見直す。claude も落ちていれば ✅（閉じられた）、窓が戻っていれば黙る、窓だけのままなら 🪟
3. **#35 遠隔の繋ぎ直し**：外れ（立ち直り直後に前の窓の「切れ」で /remote-control を打っていた）→ 窓の claude が起きた刻より前の「切れ」は数えない。新しい窓は --remote-control で自分から繋ぐ

## 作り値（控えは scratchpad・送り手／打ち手は偽物）
**#16**（watch-notify.ps1）
| 場合 | 結果 |
|---|---|
| 帯の外：一回目が43分の止まりを見つけて降りる → 二回目 | 持ち越し → **二回目で鈴を出す**（stall:03:02:03・43分・鍵の見回り）。持ち越しは消える |
| 帯の中（再起動） | 持ち越し → **出さない**。帯の黙らせた物に「巡回の止まり（stall）」 |

**#19**（watch-notify.ps1）
| 場合 | 一回目 | 二回目 |
|---|---|---|
| A 窓が先に消え、claude が次の回までに落ちた | 鳴らさない（一回待つ） | **✅ 終わりました**（閉じられた） |
| B 窓だけ消えて claude が生き残った | 鳴らさない | **🪟 異常です**「窓だけが消えています」 |
| C 窓が一時消えて戻った | 鳴らさない | 鳴らさない |
| D 窓と claude が同じ回に消えた | ✅（前と同じ） | — |
| E 前の本数が控えに無い古い形 | 🪟（前と同じ） | — |

**#35**（inbox-watch.ps1。窓の起きた刻 16:57）
| 場合 | 前の台本 | 直した台本 |
|---|---|---|
| 立ち直り直後・最後の遠隔の行が前の窓の切れ（16:40） | **打つ**＋🪟 | **打たない** |
| この窓が繋いだ後（16:58 bridge_status） | 打たない | 打たない |
| この窓で切れた（17:10） | 打つ | **打つ**＋🪟（前と同じ） |
- 本物の読み（作り値なし）：State=alive（16:58 の bridge_status を拾う）

## ファイル
- ~/.claude/watch-notify.ps1（写し .bak-20260928d）：#16・#19
- ~/.claude/inbox-watch.ps1（写し .bak-20260928c）：#35。**常駐を起こし直した**（起動 19:00:47 ＞ 台本 19:00:09・1本）
- 構文0件ずつ

## 実機
- 画面に出る物は無し。**次の再起動の後、🪟「窓だけが消えています」「遠隔を繋ぎ直しました」「巡回が止まっていました」が出ず、明けの ✅ に黙らせた物が載ること**（人手待ち）

## 残り
- 0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **459件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0928-1901.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1901.md) | 09-28 19:01 | map-2 の要確認（一つ目）：#16・#19・#35 を作り値で確かめて直した（r0928-1901） |
| [`r0928-1807.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1807.md) | 09-28 18:07 | Check-FrameLimit の切り方を「固まり」と「長すぎ」に（r0928-1807） |
| [`r0928-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1756.md) | 09-28 18:07 | 読むだけ：pathspec の枠・控えの預けの枠・今の予定（r0928-1756） |
| [`r0928-1750.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1750.md) | 09-28 17:48 | 静かな帯の漏れ二通を塞いだ（r0928-1750） |
| [`r0928-1656-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1656-2.md) | 09-28 16:56 | 再起動-2（r0928-1656・後の測り） |
| [`r0928-1654-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1654-2.md) | 09-28 16:54 | 再起動-2（r0928-1654・後の測り） |
| [`r0928-1620.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1620.md) | 09-28 16:11 | notices の押しの pathspec の落ちの元と直し（r0928-1620） |
| [`r0928-1611.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1611.md) | 09-28 16:08 | 使用量の HTTP 401 の元と直し（r0928-1611） |
| [`r0928-1606.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1606.md) | 09-28 16:07 | 台帳の「三つ目と四つ目」を済へ・残りを二枠に割った（r0928-1606） |
| [`r0928-1349.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1349.md) | 09-28 13:49 | 控えの預け（ClaudeHomeBackup）を 05:00 へ・落ちたら一通（r0928-1349） |
| [`r0928-1324.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1324.md) | 09-28 13:32 | 静かな帯（再起動・窓の立ち直りの間は偽の鈴を黙らせる）（r0928-1324） |
| [`r0928-1216-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216-2.md) | 09-28 12:32 | 連携の地図三枚（r0928-1216-2・読むだけ） |
| [`map-2-alerts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-2-alerts.md) | 09-28 12:31 | 鈴と札の全種類（map-2） |
| [`map-1-parts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-1-parts.md) | 09-28 12:31 | 連携で動いている物の一覧（map-1） |
| [`map-3-incidents.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-3-incidents.md) | 09-28 12:26 | 09-21〜09-28 の出来事（map-3） |
| [`r0928-1216.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216.md) | 09-28 12:18 | SessionStart の resume を仕事の始まりと読む誤りを直した（r0928-1216） |
| [`r0928-1201.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1201.md) | 09-28 12:03 | 「命令0回」で切られた三つの枠の元（r0928-1201・読むだけ） |
| [`r0928-1045.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1045.md) | 09-28 10:42 | 未検収の 🔗 の二行を済へ（r0928-1045） |
| [`r0928-1035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1035.md) | 09-28 10:38 | 未検収を試しで片付ける（二つ目）（r0928-1035） |
| [`r0928-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1020.md) | 09-28 10:16 | 未検収を記録で片付ける（一つ目）（r0928-1020） |

<!-- 控えの一覧 ここまで -->
