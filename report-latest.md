# 古い index.lock を押しの前に外す・引き継ぎの判じを窓の刻で（r0926-1706）

**終わり（残り0件）** — 2026-09-26 17:08ごろ（VAIO）。本体には触っていない。二つの「一つだけ」は、13:43 の枠（再挑戦 1/3）で入れた物がそのまま当たる。ほかは触っていない。

1. **古い index.lock を、押しの前に外す**（~/.claude/git-push.ps1）
   - 常駐（inbox-watch）は git-push.ps1 を読み込んで押す（state.json など）。押しの錠を取った直後、**add・commit・push の前**に `.git/index.lock` を見る
   - **走っている git が0本で、錠が5分より古い**→外し、git-push.log に「置き去りの index.lock を外した（N分前の錠・走っている git 0本）」と一行
   - それ以外は触らず、「index.lock はあるが触らない（N分前の錠・走っている git N本）」と一行
   - 作り値（使い捨ての repo）：

| 例 | 錠 | 戻り |
|---|---|---|
| 10分前の錠・git 0本 | **外れた** | 0（commit・push が通った） |
| 1分前の錠・git 0本 | **残る** | 128 |
| 10分前の錠・git 1本走行中 | **残る** | 128 |

2. **引き継ぎの判じを、20分の窓から「窓の立った刻より後の行」へ**（~/.claude/inbox-watch.ps1 の Judge-Resume・Get-WindowStart）
   - 窓＝新しい claude の親の **claude-loop の cmd**。その起動の刻より後に書かれた pick-resume.log の最後の行が `--resume` なら「試した」
   - ＊claude 自身の起動の刻は使わない：pick-resume は claude を起こす**直前**に書く（09-24 は pick 15:31:03・claude 15:31:56）。claude の刻を基準にすると必ず見落とす
   - ＊綴りの頭の BOM も剥ぐ。09-24 の pick-resume.log は一行だけで、行頭の BOM のせいで「^数字」が当たらず、20分以内でも見落とす作りだった
   - 作り値：

| 例 | 判じ |
|---|---|
| 09-24 の再現（窓 15:31:00・BOM つきの --resume 15:31:03・24分後に判じ・同じ宛先） | **同じ会話が続いた** |
| resume の行が窓の刻より前 | **引き継ぎは試していない（新しい会話で立てた）** |
| 窓の後だが「新しく立てる」の行 | 引き継ぎは試していない |
| 窓の後に --resume・宛先が替わった | 新しい行が立った → 写しの loop から %RESUME% を外した（本物の loop はそのまま） |
| いまの claude の窓の刻（本物・読むだけ） | 09-24 15:20:59 |

3. **公開側 state.json**：**Pages の `at` = 09-26 13:52:46**（13:53:29 に読んだ・差43秒）。raw も 13:52:46。錠は無く、押しが通らない印（push-stuck.txt）も無い
   - 常駐は 13:52:38 に起こし直した（inbox-watch 13:50:50・git-push 13:46:45 より後）

### 手元で回る段・雲で回る段（作法36）
- 手元：常駐 inbox-watch（押しの前の錠の見張り・Check-NewLine の判じ）／watch-notify（毎分・git-push.ps1 を読む）
- 雲：変わりなし

### 触った物
~/.claude/git-push.ps1（写し .bak-20260926b）・inbox-watch.ps1（.bak-20260926）・orders-open.tsv・work-note.txt／reports/r0926-1706.md・report-latest.md（ほかに前の枠の r0926-1040・r0926-1127 もここで commit）

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **408件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0923-2212.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2212.md) | 09-23 22:21 | mode-check を見るだけに・窓を立て直しても同じ遠隔の会話へ（r0923-2212） |
| [`r0923-2141.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2141.md) | 09-23 21:57 | claude の本数整理・起こす手を一本に・遠隔の繋ぎ直し・auto 起動（r0923-2141） |

<!-- 控えの一覧 ここまで -->
