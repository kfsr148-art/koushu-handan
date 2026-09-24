# VAIO に残る Edge・node の確かめを洗って雲へ（r0924-1054）

**終わり（残り0件）** — 2026-09-24 11:02ごろ（VAIO）。本体には触っていない。

### 洗った所と中身

| 所 | Edge・ブラウザを立てるか | node を回すか | 扱い |
|---|---|---|---|
| **pre-push の鉤**（.githooks/pre-push） | 立てない（09-12 から構文検査だけ） | `node --check`（本体の <script> と直下の .js。数秒） | **残した**（軽い・壊れた字を押し出さない最低限） |
| **Claude Code の鉤**（settings.json：frame-in・hook-notice・inbox-feed・stop-guard・tool-mark） | 立てない | 回さない | 残した（関わりなし） |
| **予定表の13件**（ClaudeWatchNotify・Revive・DailyReboot・EdgeSweep・SweepChecks・JamWatch・PipeCheck・Board・DailyNotice・AfterReboot・HomeBackup・HookHeartbeat・CodeAtLogon） | 立てない。EdgeSweep・SweepChecks・常駐の Sweep-Stale は**置き去りの Edge を落とす側**、daily-reboot・jam-watch は**数えて見るだけ** | weekly-reboot（予定表に無い）だけが `node reports-index.js`（字の組み直し・ブラウザなし） | 残した（Edge を起こす行は一つも無い） |
| **常駐**（inbox-watch.ps1） | 立てない（Sweep-Stale は落とす側） | 回さない | 残した |
| **作法18（CLAUDE.md）**「手元で回すのは速い版だけ」＝ `node check-all --fast` | **立てる**（check.js ⑦ と adv-check が headless の Edge） | 回す | **雲へ渡した**（下） |
| 作法21 の素材の道具（asset-proof・head-proof・char_export）・shot-all・cat-*・core-crosscheck・panel-*-probe | 立てる | 回す | **残した**（下の訳） |
| mitate-fold・mitate-kazoe | 立てる | 回す | 既に雲（mitate-fold.yml・mitate-kazoe.yml） |
| check-all フル版・widget-check・panel-check | 立てる | 回す | 既に雲（check.yml／panel-check は昨日 job.yml にも） |

### 替えた物
- **scratchpad/jobs/check-fast.js**（新）：直下の check-all.js を `--fast` で呼ぶだけ。終了コードもそのまま返す
- **job.yml**：起きる条件に koushu-handan.html・check.js・adv-check.js・check-all.js を足した。変わっていれば check-fast.js を回し、**reports/cloud-check-fast-<刻>.md** に返す。node を 20 → 24 にした（check.yml と同じ）
  - 選びを手元で作り値4通り：本体だけ→check-fast.js／パネルだけ→panel-check.js／本体＋パネル＋台本→三本／控えだけ→無し。**4通りとも合った**
- **CLAUDE.md 作法18**：「手元で回すのは速い版だけ」を「**速い版も手元では回さない**。本体を押せば job.yml が回し、reports/cloud-check-fast-*.md を読んで納品する」に替えた。「本体は速い版が通るまで commit しない」は「構文検査を通して一度で commit し押す。関門は check.yml（落ちれば配信が止まる）」に替えた。「pre-push が速い版を自動で回す」という古い一行も「構文検査だけ」に直した
- **記憶**：check-fast-and-full・delivery-runs-check-all を雲の形に書き替えた
- **雲での一回目**：走り **35945315803**。回す台本＝**check-fast.js だけ**。**reports/cloud-check-fast-20260924-015941.md**：check・adv-check とも **PASS**、終了コード0・**89秒**

### 残した物とその訳
- **pre-push の構文検査**：ブラウザを立てない。数秒で済み、壊れた字を押し出さない最後の手なので残した
- **素材の道具**（asset-proof・head-proof・char_export）と **shot-all・cat-*・core-crosscheck・panel-*-probe**：どれも台本・予定表・鉤から呼ばれる行が無く、**人が要るときに手で打つ道具**。しかも出来上がりが画像（PNG）やリポジトリ直下の綴りで、job.yml は reports/ しか押し戻さない。雲へ渡すには道具ごとに出し先を reports/ へ向ける写しが要る。今回はそこまで手を広げず残した。**使うときは手元で打たず、その回に scratchpad/jobs へ呼び手を置いて雲で回す**（作法18 と同じ考え）
- **Edge を落とす・数える見張り**（EdgeSweep・SweepChecks・Sweep-Stale・daily-reboot・jam-watch）：立てる側ではないので、そのまま

### 手元で回る段・雲で回る段（作法36）
- 手元：pre-push（構文検査だけ）／常駐・予定表の見張り（Edge を立てない）／本体の工事の前の `node --check`
- 雲：
  - check.yml … 本体・パネルの押しで 速い版→フル版→widget-check→panel-check。落ちれば配信が止まる（関門）
  - job.yml … 本体の押しで **check-fast.js**、パネルの押しで **panel-check.js**、scratchpad/jobs の台本の押しでその台本。結果を reports/cloud-*.md へ返す
  - mitate-fold.yml・mitate-kazoe.yml・battle.yml・neko.yml … 今までどおり
- ＊本体を押すと、速い版は雲で二度走る（関門と、結果を返す側）。雲なら90秒ほどなので重ねたままにした

### 触った物
.github/workflows/job.yml・scratchpad/jobs/check-fast.js（新）・scratchpad/jobs/README.md・CLAUDE.md／~/.claude の記憶（check-fast-and-full・delivery-runs-check-all・MEMORY.md）・orders-open.tsv・work-note.txt

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **400件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0922-1630-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0922-1630-2.md) | 09-22 16:30 | 再起動-2（r0922-1630・後の測り） |
| [`y0922-1330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1330-2.md) | 09-22 14:08 | 追報：25分の底が効いた（14:04:30・中身が同じまま押した） |

<!-- 控えの一覧 ここまで -->
