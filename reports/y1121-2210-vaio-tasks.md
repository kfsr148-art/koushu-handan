# VAIO の決まった時刻の仕事（読むだけの調べ・y1121-2210）

状態：調べた（何も直していない・消していない・commit も push もしていない） — 22:01

## 一、ClaudeHomeBackup（~/.claude を非公開の蔵 claude-home-backup へ押す・毎日 05:00）

| 見たもの | 値 |
|---|---|
| Get-ScheduledTaskInfo | State Ready／LastRunTime 2026-11-21 05:00:00／LastTaskResult 0x0／NextRunTime 2026-11-22 05:00:00／Missed 0 |
| 台本 | `~/.claude/home-backup.ps1`（wscript → run-hidden.vbs → powershell） |
| 記録（`~/.claude/git-push.log`） | L2966 `2026-11-21 05:00:24 home-backup 終了コード 128：warning: … LF will be replaced by CRLF … 末尾：fatal: updating files failed`／L2967 `拾いが落ちた（終了コード 128）。日付は刻まず、次の回に持ち越す` |
| 最後に通った刻 | **2026-11-20 05:01:13**（L2955「押した：控え: 2026-11-20（335件の変更）」・commit 1180e80・origin/master も 1180e80）。`home-backup-last.txt` も 2026-11-20 のまま |
| 05:00 の後の走り | **無い**。この仕事は一日一回（05:00）だけで、ほかに home-backup.ps1 を呼ぶ所は無い。次は 11-22 05:00 |
| いま押せていない変更 | ~/.claude に 209件（git status --porcelain） |

- **結果コード 0x0 は「通った」ではない。** 台本は落ちても `return`（L52〜55）で終わるので、予定表には 0 が返る。落ちたかは git-push.log と `home-backup-last.txt` で見るしかない。
- **11-21 の落ちは index.lock ではなかった。** 記録の字は `fatal: updating files failed`（`git add -A` が中で一つの綴りを読めず、索引の書き換えに失敗した形）。index.lock で落ちたのは **11-19 05:00**（L2940〜2942：`add -A` が30秒の上限で切られ、続く `reset` が `index.lock: File exists` で 128）。11-20 にはそれが解けて押せている。
- 11-21 の記録は真ん中が切れている（`git-push.ps1` L98〜100 が誤りの字を頭160字＋末尾160字に詰める）ので、**どの綴りが読めなかったかは記録に残っていない**。いま `git add -A --dry-run` を回すと誤り0件（268行・`remove` と `add` だけ）なので、05:00:24 の一瞬だけ何かが綴りを掴んでいた（書いている最中のファイル等）見込み。
- 拾いが落ちた後、台本は `git reset -q`（L54）を打つ。`.git/index` の更新刻は 11-21 05:00:25 で、この reset の跡。

**index.lock は今は残っていない**

| 道 | 有無 |
|---|---|
| `C:/Users/user/.claude/.git/index.lock` | 無し |
| `C:/Users/user/Desktop/mahjong/koushu-handan/.git/index.lock` | 無し |
| バックアップ先 | 手元の写しは無い（押す先は GitHub の `kfsr148-art/claude-home-backup` だけ。手元のリポジトリは ~/.claude そのもの） |
| 走っている git.exe | 0本（Get-CimInstance Win32_Process・22:00 ごろ） |

**落ちたのに 🪟 が鳴らなかった訳**：落ちを外から見て鳴らす仕組み（`pipe-check.ps1` L939〜965：05:40 を過ぎて `home-backup-last.txt` が今日でなければ一通）は、予定表 **ClaudePipeCheck** が回していた。ClaudePipeCheck は **11-20 に登録から外した**（reports/y1120-0700.md 項2・XML は `~/.claude/tasks-bak-20261120/ClaudePipeCheck.xml`）。そのため 11-21 は鳴らず、`home-backup-rung.txt` も 2026-11-19 のまま、`pipe-warn.log` の「控えの預け」も 11-19 05:40 が最後。

## 二、文書「使用限度」の書き込み

| 見たもの | 値 |
|---|---|
| ClaudeShiyouGendo | State Ready／LastRunTime 2026-11-21 21:48:48／LastTaskResult 0x0／NextRunTime 21:58:58（10分おき）。**動いている** |
| ローカルの一行（`memory/topics/shiyou-gendo.md`） | 21:48:51 に書かれ、中身「21:47 5時間枠 10%（02:20リセット） 週枠 35%（11/23 20:00リセット）」。**こちらは止まっていない** |
| Docs への書き手 `shiyou-docs.js` の記録（`~/.claude/shiyou-docs.log`） | 最後の行 `2026-11-20 06:59:01 OK 「06:54 5時間枠 4%（07:50リセット） 週枠 66%（11/23 20:00リセット）」`。`shiyou-docs-last.txt` も 11-20 06:59:01 |

**止まった訳：落ちたのではなく、外した。** 06:54 の行は **11-20（昨日）の 06:54**。
- `~/.claude/shiyou-gendo.ps1` L42〜43：「2026-11-20 三段目：Claude Docs の「使用限度」への書き込み（shiyou-docs.js）は外した（本人の枠）。ローカルの一行だけ書く。」— 台本の更新刻 11-20 07:06:46。
- reports/y1120-0700.md 項3：「shiyou-docs：`shiyou-gendo.ps1` の `shiyou-docs.js` を呼ぶ一行を外した（ローカルの一行を書く本体はそのまま）」。外す前の決めは reports/y1119-2205.md L55（「gendo は残す／docs は外す」。docs は claude -p を10分おきに起こすため）。
- 失敗ログ・認証切れ・文書側の問題・台本の例外の、**どれでもない**。shiyou-docs.log は最後まで全部 OK で、その後に一行も無い（呼ばれていない）。

## 三、ほかの決まった時刻の仕事（Claude 関連・22:00 ごろ）

| 名前 | 状態 | 最後に走った刻 | 結果 | 次 | 失敗 |
|---|---|---|---|---|---|
| ClaudeAfterReboot | Ready | 11-20 15:10（予定表の記録） | 0x1 | 11-22 03:10 | 0x1 は台本の「欠けあり」の終わり（after-reboot.ps1 L209・216）。台本そのものは 11-21 03:27 にも走っている（after-reboot.log：欠け2件＝ClaudeBoard=267014／ClaudeWatchNotify=-1・見張りの生存27分前）。Missed 2 |
| ClaudeBoard | Ready | 11-21 21:50 | 0x0 | 22:00 | 無し |
| ClaudeCodeAtLogon | Ready | 11-21 15:19 | 0x0 | （ログオン時） | 無し |
| ClaudeDailyReboot | Ready | 11-21 16:30 | 0x0 | 11-22 03:00 | 無し（15:00 に落とし・15:03 に起動） |
| ClaudeEdgeSweep | Ready | 11-21 03:00 | 0x0 | 11-22 03:00 | 無し |
| ClaudeHomeBackup | Ready | 11-21 05:00 | 0x0 | 11-22 05:00 | **有り**（上の一。0x0 でも中で落ちている） |
| ClaudeHookHeartbeat | Ready | 11-21 21:48 | 0x0 | 21:58 | 無し |
| ClaudeJamWatch | Ready | 11-21 21:56 | 0x0 | 毎分 | 無し |
| ClaudeRevive | Ready | 11-21 21:56 | 0x0 | 毎分 | 無し |
| ClaudeShiyouGendo | Ready | 11-21 21:48 | 0x0 | 21:58 | 無し（Docs への写しは外してある） |
| ClaudeSweepChecks | **Disabled** | 09-21 22:31 | 0x0 | — | 止めてある（Missed 4390 は止めてからの数） |
| ClaudeUpdate | Ready | 11-21 14:40 | 0x0 | 11-22 02:40 | 無し |
| ClaudeWatchNotify | Running | 11-21 21:59 | 0x41301（走っている最中） | 毎分 | 無し |

登録から外したもの（11-20）：ClaudeDailyNotice・ClaudePipeCheck。

## 直し方の案（直すのは本人の決めを待つ）

一、控えの預け
- 甲：何もしない。今夜 11-22 05:00 の回が 11-20 以降の変更をまとめて押す（落ちが一瞬の掴みなら通る見込み）。
- 乙：拾いが落ちた時、台本の中で一度だけ数十秒置いて `add -A` を打ち直す（home-backup.ps1 L51〜56）。一瞬の掴みならこれで通る。
- 丙：落ちの知らせを戻す。ClaudePipeCheck を外したので、home-backup の落ちだけを見る小さな印（例：ClaudeHomeBackup の台本が落ちた時に ntfy-say で 🪟 を一通）を足す。今は落ちても誰も鳴らさない。
- 丁：誤りの字を切らずに残す（どの綴りで落ちたか分かるよう、home-backup の時だけ全文を別の記録へ）。

二、文書「使用限度」
- 本人の枠で外したものなので、今のままなら「止まって正しい」。文書が 06:54 で止まって見えるのが紛らわしいなら：
  - 甲：文書の頭に「11-20 07:06 で書き込みを止めた。最新は state.json／パネル」と一行書く（文書の書き替えなので本人のヨシが要る）。
  - 乙：Docs へ書き戻す（claude -p を10分おきに起こすのが外した訳なので、戻すなら「一時間おき」など間を延ばす案）。

## 要点
- 控えの預け：最後に通ったのは 11-20 05:01。11-21 05:00 は `git add -A` が `fatal: updating files failed` で落ち（index.lock ではない。index.lock は 11-19 の分）、その後の走りは無い。次は 11-22 05:00。index.lock はどこにも残っておらず、git.exe も0本。ClaudePipeCheck を 11-20 に外したので、落ちても 🪟 は鳴らなかった。
- 使用限度：予定表は動いており、ローカルの一行は 21:48 まで新しい。文書が 06:54（11-20）で止まっているのは、11-20 07:06 に本人の枠で Docs への書き手を外したため（shiyou-gendo.ps1 L43・y1120-0700 項3）。
- ほかの予定表に失敗は無い（AfterReboot の 0x1 は「欠けあり」の終わり・SweepChecks は止めてある）。
