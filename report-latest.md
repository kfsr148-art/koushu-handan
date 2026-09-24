# Check-RcDrop の「切れ」を会話の記録で判じる（r0924-1117）

**終わり（残り0件）** — 2026-09-24 11:23ごろ（VAIO）。本体には触っていない。窓は落としていない。

### 替えたこと（inbox-watch.ps1）
- **画面の字を読むのをやめた。** 前は read-screen.ps1 で窓の見えている行を読み、「/rc failed」か「Remote Control disconnected」があれば切れと判じていた。これだと、こちらの報告の文に入った同じ語まで拾いかねない
- 新しく **Get-RcState** を置いた。判じ方：
  - 窓は **sessions/<pid>.json の sessionId** で決める（Check-NewLine と同じ出どころ。生きている claude だけ）
  - その会話の綴り（jsonl）の中で、**最後に書かれた遠隔の行**を見る
    - `system／bridge_status`（/remote-control is active …）→ **生存**
    - `system／informational` で「Remote Control disconnected」か「/rc failed」→ **切れ**
  - 行は JSON として読み、**type が system のものだけ**を採る。報告の字や道具の出力に同じ語が入っていても、綴りの中では \" に包まれているので数えない
- 実際の記録で形を確かめてから書いた：09-23 01:35 の窓（0c99222c）に「Remote Control disconnected — the server no longer reports this session …」が `system／informational` として残っていた
- 同じ切れの行（uuid）には10分のあいだ二度打たない。打って繋がれば、その後ろに bridge_status の行が立ち「生存」に戻る
- 常駐を 11:22:28 に起こし直した（台本 11:21:44 より後・常駐1本）

### 作り値（本物の窓へは打たず、知らせも鳴らさない。画面の字は二通りとも「Remote Control disconnected (code 4090)」を渡した）
| 例 | 記録の並び | 結果 |
|---|---|---|
| **画面に字あり・bridge 生存** | 切れ → active | **打たない**（0回） |
| **画面に字あり・bridge 切れ** | active → 切れ | **打つ**（1回・知らせ1通） |
| 同じ切れの行で二度目 | active → 切れ（同じ uuid） | 打たない |
| 切れの語が道具の出力の中にあるだけ | active → user の行 | 打たない |
| 本物の記録を見るだけ | いまの窓 | **生存** |

### 手元で回る段・雲で回る段（作法36）
- 手元：inbox-watch（常駐）の Check-RcDrop（4巡に一度）。読むのは会話の綴りだけになり、read-screen.ps1 は呼ばない
- 雲：変わりなし

### 触った物
~/.claude/inbox-watch.ps1（写し .bak-20260924）・orders-open.tsv・work-note.txt／reports/r0924-1117.md・report-latest.md

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **401件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0922-1630-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0922-1630-2.md) | 09-22 16:30 | 再起動-2（r0922-1630・後の測り） |

<!-- 控えの一覧 ここまで -->
