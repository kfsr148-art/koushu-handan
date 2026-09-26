# 未検収の四行を読んで確かめる（r0926-1828）

**終わり（残り0件）** — 2026-09-26 18:32ごろ（VAIO）。読んで確かめただけ。本体には触っていない。三行を済へ移し、一行を残した。

| # | 行 | 読んだ値 | 扱い |
|---|---|---|---|
| ① | 2026-09-22 00:04 pagefile 4096MB の実際の割り当て | Win32_PageFileUsage の **AllocatedBaseSize = 4096MB**（C:\pagefile.sys・いまの使用 391MB・最大 939MB）。設定は InitialSize 4096／MaximumSize 4096、自動管理は切。09-24 15:06 の起動の後の値 | **済** |
| ② | 2026-09-21 21:40 画面バッファ500行 | レジストリ（`HKCU\Console\麻雀 攻守判断 (Claude Code)` の ScreenBufferSize）は **0x01F400AA＝高さ500・幅170** のまま。ところが**いまの窓（claude 5072）に繋いで読んだバッファは幅148／高さ46**で、見えている行（46）と同じ | **残す**：設定は500だが、いまの窓の控えは46行で、500行として効いていることは確かめられない（claude の画面が窓と同じ大きさのバッファを使っている見込み） |
| ③ | 2026-09-21 17:00 --continue を外した後の起こし直し | 以後の立ち直り6回がどれも戻った：09-22 07:25（2分で戻り）・08:13（revive）・08:24（revive・0本が9分）・23:30（戻り）・09-23 21:59（輪が同じ窓で）・09-24 15:31（再起動の後・`--resume`）。いまも claude 1本 | **済** |
| ④ | 2026-09-21 20:50 落ちにくい窓の三つと枠の上限-2 | 三つ：`NODE_OPTIONS=--max-old-space-size=1024` が claude-loop.cmd に在る／claude の優先度 **AboveNormal**／**同じ窓で立て直した**（loop-guard の控え 09-23 21:59:44）。枠の上限：「**🪟 時間切れ（再挑戦 N/3）**」を **8回**出している（09-23 21:59・23:23・23:55、09-24 12:51・13:03・15:54、09-26 11:37・13:54）。今日の「再挑戦 1/3」の枠はこの札から来ている | **済** |

- 閉じた三行は **~/.claude/kenshu-closed.tsv** へ、閉じた刻と訳を添えて移した
- ＊②の窓のバッファは、read-screen.ps1 と同じ手（窓へ AttachConsole して GetConsoleScreenBufferInfo）で読んだ。読むだけで、窓には何も書いていない

**残した未検収（8行）**
- 2026-09-21 19:57 使用量の上限で手待ち（人手待ち）
- 2026-09-21 21:28 healthchecks の check 作りと URL 貼り（人手待ち）
- 2026-09-21 21:40 画面バッファ500行（上の②）
- 2026-09-23 次に取り下げで閉じた回に ✅ の札が印つきで立って鳴ること（人手待ち）
- 2026-09-23 次に遠隔の線が切れた回に「🪟 遠隔を繋ぎ直しました」が鳴り Code タブへ戻ること（人手待ち）
- 2026-09-23 22:26 次に窓が立ち直った回に「🔗 新しい線」が一通だけ届くこと（人手待ち）
- 2026-09-23 22:26 手待ちで 900MB を超えた回に窓が残ったまま /clear で畳まれること（人手待ち）
- 2026-09-23 23:15 03:00 の立ち直りの「🔗 新しい線」の判じ（人手待ち）

### 触った物
~/.claude/kenshu-closed.tsv・work-note.txt・orders-open.tsv／reports/r0926-1828.md・report-latest.md

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **410件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0926-1828.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1828.md) | 09-26 18:32 | 未検収の四行を読んで確かめる（r0926-1828） |
| [`r0926-1717.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1717.md) | 09-26 17:20 | claude の大きさと会話の綴りの推移・未検収の四行を済へ（r0926-1717） |
| [`r0926-1706.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1706.md) | 09-26 17:08 | 古い index.lock を押しの前に外す・引き継ぎの判じを窓の刻で（r0926-1706） |
| [`r0926-1127.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1127.md) | 09-26 11:36 | 公開側への押しが通らない元（index.lock）を直す・札の全文を ntfy へ（r0926-1127） |
| [`r0926-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1040.md) | 09-26 10:43 | 公開側の札・09-24 15:00 の再起動と引き継ぎ・無線・いまの様子（r0926-1040・読むだけ） |
| [`r0924-1502-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1502-2.md) | 09-24 15:02 | 再起動-2（r0924-1502・後の測り） |
| [`r0924-1455.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1455.md) | 09-24 14:58 | 14:30〜14:55 に /remote-control を打ったか（r0924-1455・読むだけ） |
| [`r0924-1234.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1234.md) | 09-24 13:23 | claude の自動更新を止めて落とす直前に更新・電源と容量と鍵の読み（r0924-1234） |
| [`r0924-1149.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1149.md) | 09-24 11:54 | 常駐を AboveNormal で立てる・枠の鉤の timeout 60秒・いまのメモリ上位10本（r0924-1149） |
| [`r0924-1117.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1117.md) | 09-24 11:23 | Check-RcDrop の「切れ」を会話の記録で判じる（r0924-1117） |
| [`r0924-1054.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1054.md) | 09-24 11:02 | VAIO に残る Edge・node の確かめを洗って雲へ（r0924-1054） |
| [`cloud-check-fast-20260924-015941.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20260924-015941.md) | 09-24 11:02 | 雲で回した：`check-fast.js` |
| [`r0924-1033.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1033.md) | 09-24 10:35 | 残る y0921-0900 を済へ・ヨシ待ち0件（r0924-1033） |
| [`r0924-1009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1009.md) | 09-24 10:14 | ヨシ待ちの納品済み7件を済へ・残る1件（r0924-1009） |
| [`r0924-0506.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-0506.md) | 09-24 05:09 | 04:30 の定時・見送りの訳からヨシ待ちを外す・押し残しの数えられず・ヨシ待ち8件（r0924-0506） |
| [`r0924-0421.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-0421.md) | 09-24 04:25 | 00:10 の claude（4412）・いまの本数・03:00 の定時（r0924-0421・読むだけ） |
| [`r0923-2341.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2341.md) | 09-23 23:50 | panel-check は雲（job.yml）で回して reports/ へ返す（r0923-2341） |
| [`cloud-panel-check-20260923-144600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20260923-144600.md) | 09-23 23:50 | 雲で回した：`panel-check.js` |
| [`r0923-2305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2305.md) | 09-23 23:13 | いまの線を送る・パネルと定時の札に宛先・引き継ぎの確かめ・22:50 の切れの調べ（r0923-2305） |
| [`r0923-2222.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2222.md) | 09-23 22:26 | 重いときは /clear だけ・起こす手は一つ・🔗 新しい線・繋ぎ直しの手（r0923-2222） |

<!-- 控えの一覧 ここまで -->
