# map-2 の要確認（二つ目）：#49・#50・#44 を作り値で確かめて直した（r0928-1912）

**終わり（残り1件：三つ目に続けて着手）** — 2026-09-28 19:12ごろ（VAIO）。本体には触っていない。三つとも外れていたので直した。

## 三行
1. **#49 revive**：外れ。再起動の前に書いた revive-dead.txt が残ると、ログオン直後の一回目が「0本が35分」と読み、ClaudeCodeAtLogon の窓が立つ前に叩いていた → 落ちの刻はログオン（explorer の起きた刻）より前に遡らせない。静かな帯（再起動）の間は、ログオンから10分は叩かず ClaudeCodeAtLogon に任せる（10分で戻らなければ今まで通り起こす）
2. **#50 止まっています（Interrupted）**：外れ（筋としては鳴る）。実際は Esc の後に notification が来ず生存の行が続くので鳴っていなかったが、notification が挟まれば時間切れの札に続けて鳴る → Interrupted の記録の刻が枠の切り（frame-cut.txt の書かれた刻）から3分以内なら、こちらの Esc として鳴らさない
3. **#44 異変発見だにゃ**：外れ。居座りを落とした直後は見張りの最終結果が非0のまま残り、その隙に読むと「見張り×4294967295」の偽になる（これまでの落としは 04:56・23:2x・03:40 で 09:00／21:00 には当たっていない）→ 落としが15分以内で、見張りの前回がそれより前なら ○

## 作り値（控えは scratchpad・起こす／鳴らすは偽物）
**#49**（revive-claude.ps1）
| 場合 | 前 | 後 |
|---|---|---|
| A 再起動の帯・ログオン1分・落ちの控えは再起動前（35分前） | **起こす** | **叩かない**（bootwait） |
| B 再起動の帯・ログオン12分・0本が3分 | 起こす | 起こす |
| C 帯の外・0本が3分 | 起こす | 起こす |
| D 窓の立ち直りの帯・0本が3分 | 起こす | 起こす |

**#50**（revive-claude.ps1 の Check-Stuck）
| 場合 | 前 | 後 |
|---|---|---|
| A 枠の上限が Esc を送った後の Interrupted | **鳴る** | **鳴らない**（記録に一行） |
| B 人が止めた Interrupted（枠の切りは2時間前） | 鳴る | 鳴る |

**#44**（daily-notice.ps1）
| 場合 | 前 | 後 |
|---|---|---|
| A 1分前に居座りを落とした・見張りの前回はその回 | **×4294967295** | **○** |
| B 落としたのは2時間前・前回も非0 | × | × |
| C 落とした後に次の回が走ったが非0 | × | × |
| D 見張り以外の予定が非0 | × | × |

## ファイル
- ~/.claude/revive-claude.ps1（写し .bak-20260928b）：#49・#50
- ~/.claude/daily-notice.ps1（写し .bak-20260928）：#44
- 構文0件ずつ。どちらも予定表から毎回起こされるので、起こし直しは要らない

## 実機
- 画面に出る物は無し。**次の再起動の直後に「🪟 窓を起こし直しました」が出ないこと**（人手待ち）

## 残り
1. map-2 の要確認（三つ目）（これから）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **460件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0928-1912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1912.md) | 09-28 19:12 | map-2 の要確認（二つ目）：#49・#50・#44 を作り値で確かめて直した（r0928-1912） |
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

<!-- 控えの一覧 ここまで -->
