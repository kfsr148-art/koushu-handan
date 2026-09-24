# 常駐を AboveNormal で立てる・枠の鉤の timeout 60秒・いまのメモリ上位10本（r0924-1149）

**終わり（残り0件）** — 2026-09-24 11:54ごろ（VAIO）。本体には触っていない。窓は落としていない（claude 8652 のまま）。

## 三. 優先度と timeout
- **inbox-watch.ps1・watch-notify.ps1**：頭で自分の優先度を **AboveNormal** にしてから立つ形にした（`(Get-Process -Id $PID).PriorityClass = 'AboveNormal'`）。watch-notify は heavy-gate.ps1 から `&` で呼ばれるので、$PID は走っている heavy-gate の powershell そのもの
- **Set-Priorities**（常駐が一分ごとに当て直す）：前は **inbox-watch と watch-notify も BelowNormal へ落としていた**（見張りの台本を一まとめに下げる形だったため）。この二つだけ **AboveNormal へ上げる**ように替えた。ほかの見張り（revive・pipe-check・board-emit など）は今までどおり BelowNormal
- **settings.json**：UserPromptSubmit の「枠を控える」（frame-in.ps1）の timeout を **15 → 60** にした。変わったのはその一行だけ（git の差分で1行）
- 起こし直したのは常駐（inbox-watch）だけ。watch-notify は予定表が毎分起こすので、次の走りから効く

**実読み**
| もの | 読んだ値 |
|---|---|
| inbox-watch（pid 4280・11:51:14 起こし直し・台本 11:50:37 より後） | **AboveNormal** |
| watch-notify の走り（11:52:00・pid 6548） | **AboveNormal** |
| watch-notify の走り（11:54:00・pid 1212） | **AboveNormal** |
| settings.json UserPromptSubmit frame-in.ps1 | **timeout=60**（隣の hook-notice resume は 45 のまま） |
＊鉤の timeout は設定の綴りから読んだ値。走っている Claude Code が設定を読み直すまでは前の値で動く見込み（次に窓が立ち直れば確実に60）

## 四. いま（手待ち）のメモリ上位10本（読むだけ・止めていない）
**空き 799MB／全体 3975MB**（11:54:19）。並びは使用（作業セット）の多い順。

| # | 名 | pid | 使用MB | 私用MB | 何の物か | 印 |
|---|---|---|---|---|---|---|
| 1 | claude | 8652 | 595 | 650 | いまの窓の Claude Code（--remote-control koushu-handan・親は claude-loop の cmd） | |
| 2 | MsMpEng | 3864 | 370 | 359 | Windows Defender のウイルス対策 | |
| 3 | explorer | 6732 | 152 | 67 | Windows のデスクトップ・タスクバー | |
| 4 | powershell | 4280 | 108 | 95 | 常駐の見張り inbox-watch.ps1 | |
| 5 | Registry | 92 | 105 | 8 | Windows のレジストリ（OS の中身） | |
| 6 | SearchApp | 10144 | 90 | 100 | Windows の検索（Cortana の画面） | **◇止めてよさそう**（使っていない。03:00 の edge-sweep も落とす対象） |
| 7 | iCloudServices | 7852 | 81 | 54 | Apple の iCloud の常駐（explorer から立っている） | **◇止めてよさそう**（この仕事には要らない。iCloud を使っていれば別） |
| 8 | powershell | 10164 | 77 | 67 | この一覧を取った、こちらの手の PowerShell そのもの（測り終われば消える） | |
| 9 | StartMenuExperienceHost | 7148 | 69 | 27 | Windows のスタートメニュー | |
| 10 | dwm | 1204 | 56 | 32 | Windows の画面の合成（止めると画面が出ない） | |

## 手元で回る段・雲で回る段（作法36）
- 手元：inbox-watch（常駐・AboveNormal）／watch-notify（予定表・毎分・AboveNormal）／ほかの見張りは BelowNormal のまま
- 雲：変わりなし

## 触った物
~/.claude/inbox-watch.ps1（写し .bak-20260924b）・watch-notify.ps1（.bak-20260924）・settings.json（.bak-20260924）・orders-open.tsv・work-note.txt／reports/r0924-1149.md・report-latest.md

## 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **402件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0923-2212.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2212.md) | 09-23 22:21 | mode-check を見るだけに・窓を立て直しても同じ遠隔の会話へ（r0923-2212） |
| [`r0923-2141.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2141.md) | 09-23 21:57 | claude の本数整理・起こす手を一本に・遠隔の繋ぎ直し・auto 起動（r0923-2141） |
| [`r0923-1401.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-1401.md) | 09-23 14:19 | 窓を auto で立てる・0本の回の終わり方（r0923-1401） |
| [`r0923-1335.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-1335.md) | 09-23 13:39 | 定時再起動の見送り3/3は落とさず次の定時へ（r0923-1335） |
| [`r0923-1033.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-1033.md) | 09-23 10:44 | 台帳の寄せ・取り下げの札・片付け×止の元（r0923-1033） |
| [`r0923-0646.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-0646.md) | 09-23 06:52 | 再起動直後の固まり誤鳴りを止めた（r0923-0646） |
| [`r0923-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-0430-2.md) | 09-23 04:30 | 再起動-2（r0923-0430・後の測り） |
| [`y0922-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-2155.md) | 09-22 21:55 | 予定四件の悪い結果は「消えるだけ」（y0922-2155） |

<!-- 控えの一覧 ここまで -->
