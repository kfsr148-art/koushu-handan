# SessionStart の resume を仕事の始まりと読む誤りを直した（r0928-1216）

**終わり（残り3件）** — 2026-09-28 12:18ごろ（VAIO）。本体には触っていない。窓は落としていない。

## 直したこと
- **~/.claude/settings.json**：SessionStart の鉤 `hook-notice.ps1 -Kind resume` を **`-Kind session`** に替えた（UserPromptSubmit の `-Kind resume` はそのまま）。差分は1行（写し .bak-20260928）
- **~/.claude/hook-notice.ps1**（知らせの要の一つ・写し .bak-20260928・構文 NG 0・BOM＋CRLF のまま）：
  - 受ける種類に **session** を足した。hook.log には「session」と書く（「resume」とは書かない）
  - session では控え（work-note.txt）の「開始:」を刻み直さない（resume だけがする）。題の印の貼り直しも繰り返さない
- これで、窓が `--resume` で立ち直っただけの回は hook.log の最後が前の stop のままになり、見張り（watch-notify）の鍵は **idle（手待ち）** のまま。枠の時計（inbox-watch の Check-FrameLimit）は鍵が `run:` の時しか回らないので、回らない。**UserPromptSubmit で枠が届いた時だけ**、frame-in が件名と開始の時計を打ち、hook-notice の resume で鍵が `run:` になる
- ＊hook.log を読む見張り（watch-notify・pipe-check・daily-reboot）は種類を名指しで拾う（resume|stop|notification|heartbeat）ので、「session」の行は読み飛ばされる

## 作り値（watch-notify の hook.log の読みと鍵の決めを抜き出し、作った hook.log で回した）
| 例 | hook.log の並び | 鍵 |
|---|---|---|
| **resume だけ（窓が立っただけ）** | stop 01:41 → **session 03:49** → 生存 | **idle:01:41:04**（時計を回さない・手待ち） |
| **resume の後に枠が届く** | stop 01:41 → session 03:49 → **resume 04:05**（枠） | **run:04:05:10**（その枠の刻で回る） |
| （前の作り） | stop 01:41 → resume 03:49（SessionStart が書いていた） | run:03:49:56（取り違えていた形） |

- 効くのは次に claude が立つ時から（鉤の設定は窓が立つときに読まれる）

### 残り
1. 2026-09-28 12:16:58 の枠：連携で動いている物の一覧（reports/map-1-parts.md）
2. 2026-09-28 12:17:09 の枠：鈴と札の全種類（reports/map-2-alerts.md）
3. 2026-09-28 12:17:22 の枠：09-21〜09-28 の出来事（reports/map-3-incidents.md）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **444件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0927-2226.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2226.md) | 09-27 22:30 | pipe-warn の鈴を「続く間も3時間ごと・消えたら戻り」に（r0927-2226） |
| [`r0927-2215.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2215.md) | 09-27 22:17 | healthchecks の down と、押しの止まりの間の pipe-warn の鈴（r0927-2215・読むだけ） |
| [`r0927-2046.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2046.md) | 09-27 20:47 | 定時再起動を写しから戻し、03:00 と 15:00 の二本立てに（r0927-2046） |
| [`r0927-2040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2040.md) | 09-27 20:41 | 定時再起動を 03:00 の一回だけに（r0927-2040） |
| [`r0927-2027.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2027.md) | 09-27 20:28 | 未検収の二行の手入れ（r0927-2027） |

<!-- 控えの一覧 ここまで -->
