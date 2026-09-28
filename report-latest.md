# 静かな帯（再起動・窓の立ち直りの間は偽の鈴を黙らせる）（r0928-1324）

**終わり（残り0件）** — 2026-09-28 13:32ごろ（VAIO）。本体には触っていない。窓は落としていない。

## 作り
- **印**：~/.claude/**quiet-band.txt**（start＝入った刻・why＝再起動／窓の立ち直り・alarm＝戻りませんを鳴らしたか・hush＝黙らせた物の名）
- **手**：~/.claude/**quiet-band.ps1**（新）。各台本が読み込んで使う
  - `Enter-QuietBand` … 帯に入る（既に帯の中なら、先に入った方の刻と訳を保つ）
  - `Hush-InBand <名>` … 帯の中なら数えて「出さない」を返す（同じ名は一件）。帯の外なら今まで通り
  - `Step-QuietBand` … watch-notify が毎回呼ぶ。**明け**＝claude が居て、hook.log の**生存以外の行**（session・resume・stop・notification）が帯の始まりより後に書かれた → **「✅ 戻りました（〈訳〉・〈何分〉・帯の間に黙らせた物 N件）」を一通**して印を消す。**60分**を越えたら一度だけ **「🪟 異常です（戻りません・60分）」を強さ5** で
- **帯に入る所**
  - **再起動**：daily-reboot.ps1 が「🔁 落とします」の後・shutdown の前
  - **窓の立ち直り**：claude が0本を見た所（revive-claude.ps1 の dead の一回目・watch-notify の鍵 dead・inbox-watch の healthchecks の合図）
- **帯の間に黙らせる物**（出さずに数える。一発の印も立てないので、明けても続いていれば、その時に一度鳴る）
  | 物 | 台本 |
  |---|---|
  | dead・stale の鈴（#12・#13） | watch-notify.ps1 |
  | 📮 郵便受け silent（#20） | watch-notify.ps1 |
  | 🪟 見張りが止まっていました（#22） | watch-notify.ps1 |
  | 🪟 見張りが止まっています（#29） | inbox-watch.ps1（居座った見張りを落とす手はそのまま） |
  | hook-quiet・state-stale・pub-late・ntfy-down | pipe-check.ps1（pipe-warn.log に「quiet 静かな帯なので鳴らさない」の一行） |
  | healthchecks への /fail | inbox-watch.ps1 → **帯の間はふつうの合図を打つ** |
- **割り当て**（異常・延び一日8件）：ntfy-budget.ps1 は**帯の間は数えず止めない**。帯の外の訴えだけを数える
- **after-reboot.ps1**：ログオンで札を立てる窓を **30分 → 60分**
- ntfy-say.ps1 に `-Priority`（既定3）を足した（戻りませんの強さ5のため）

**仕組みの選び**：healthchecks の /fail は、帯の間は「打たない」でなく「**ふつうの合図に替える**」にした。打たずに黙ると、向こうの期限切れ（Period 1分）で結局 DOWN が出るため。本当に戻らない時は帯の60分の強い鈴で知らせる。＊選ばなかった案：帯の間は合図を打たない。
＊明けの見分けに hook.log の書きの刻を使わないのは、生存（heartbeat）を予定表が claude と関わりなく書くため。

## 作り値（帯の印は scratchpad・送り手は偽物）
| 例 | 結果 |
|---|---|
| **再起動が40分で戻る** | 帯の中の dead・hook-quiet・#29 は「出さない」（dead の二度目も）。+10分 claude 無し → 待つ。+40分 claude 有り・hook +39分 → 明け。**送ったのは一通「✅ 戻りました（再起動・40分・帯の間に黙らせた物 3件）」**（強さ3）・印は消えた |
| **70分戻らない** | +30分 待つ → **+61分「🪟 異常です（戻りません・60分）」を強さ5で一通** → +70分 待つ（二度目は無し） |
| **帯の外の dead** | 「出さない」＝False（**今まで通り鳴らす**）・Step は none |
| 割り当ての数え | 帯の外の🪟一件 → 数え1 ／ 帯の中の🪟一件 → 数え1のまま |
| daily-reboot（作り値の置き場） | 「静かな帯に入った（再起動）」→ 印 why=再起動 |
| revive（作り値・0本の一回目） | 印 why=窓の立ち直り |

- 構文 NG 0（quiet-band・watch-notify・inbox-watch・pipe-check・daily-reboot・revive-claude・after-reboot・ntfy-say・ntfy-budget）・BOM 保持
- 常駐を 13:31:37 に起こし直した（台本 13:29:24 より後）。watch-notify・pipe-check・revive・daily-reboot は予定表が次の走りから読む
- 触った台本はどれも `.bak-20260928` の写しあり

### 手元で回る段・雲で回る段（作法36）
- 手元：watch-notify（2分ごと・帯を進める／dead・stale・silent・#22 を黙らせる）／inbox-watch（常駐・#29 と /fail）／pipe-check（毎分・四つの訴え）／revive（毎分・帯に入る）／daily-reboot（03:00・15:00・帯に入る）／after-reboot（ログオン・60分）
- 雲：変わりなし

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **449件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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

<!-- 控えの一覧 ここまで -->
