# notices の押しの pathspec の落ちの元と直し（r0928-1620）

**終わり（残り0件）** — 2026-09-28 16:20ごろ（VAIO）。本体には触っていない。

## 元
1. 台本の `git.exe` は **`C:\Program Files\Git\cmd\git.exe`＝包み**で、本物の git（mingw64）を子として起こす
2. Git-Run の時間切れ（`$p.Kill()`）は**包みだけ**を殺す。中の `git add` は走り続け、**commit の後で**新しい写しを索引に積む
   - 09-28 03:44:51 に add が15秒で切れた。03:44:52 の commit は写し notices-1790534676.json をまだ知らず、pathspec で落ちた
   - その後 add が積み終え、写しは **HEAD に無く索引にだけ**残った
3. 04:02 から 09:00 まで知らせが無かったので、その間 notices の commit は無い。09:00 の回で片付け（直近5個を残す）が写しを消し、消した名を道に混ぜる
4. 「git が知らない道を外す」の判定が **`ls-files`（索引）**で見ていたので、索引にだけある写しを「追跡されている」とみなして残した → `add` が索引から落とし → commit が **`pathspec … did not match any file(s) known to git`**（終了コード1）
5. 1 は「commit するものが無い」と同じ番号なので、**その回の notices.json は出ないまま成功として数えられていた**

## 直し（~/.claude/git-push.ps1 の Git-CommitPush）
- 「追跡されている」を **HEAD にあるか（`ls-tree HEAD`）**で見る。手元にも HEAD にも無い道は外す
- 外した道が索引にだけ残っていれば **`git rm --cached` で降ろし**、記録に「索引にだけ残っていた道を降ろした」と一行
- 写し .bak-20260928b・構文0件

**仕組みの選び**：pathspec の判定を HEAD 基準にした。これは Git-CommitPush の中だけの直しで、他の押し手には響かない。＊選ばなかった案：Git-Run の時間切れで**子まで殺す**（taskkill /T）。こちらが根本だが、全部の git の呼び出しに効き、書きかけで殺すと index.lock が残る回が増える

## 作り値（scratchpad の蔵・送り先も scratchpad の空の蔵）
| 場合 | 前の台本 | 直した台本 |
|---|---|---|
| 索引にだけある写しを消してから押す（09:00 の再現） | **pathspec で落ち**、戻り 0、公開側の status.md は古いまま（a） | 外して降ろし、**押せた**（公開側 b） |
| HEAD にある写しを消す／新しい写しを足す／知らない名を混ぜる | — | 消したのも足したのも公開側に出た。知らない名は外しただけ |

## 見つけたが直していない物（頼まれていない）
- 公開の蔵の作業木に **HEAD にあるのに消えている写し（` D notices-1789…json` ほか）が20件**残っている。消した回の commit が落ちたもので、後の回は名を渡さないので永久に commit されない（公開側に古い写しが残る）。片付けるなら一回の commit で済む

## 実機
- 画面に出る物は無し。**次に add が時間切れになった後も、git-push.log に `pathspec … known to git` が出ず、出る時は「索引にだけ残っていた道を降ろした」になること**（人手待ち）

## ファイル
- ~/.claude/git-push.ps1（写し .bak-20260928b）

## 残り
- 0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **453件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0928-1010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1010.md) | 09-28 10:11 | 未検収の二行を済へ（記憶の診断・2048）（r0928-1010） |
| [`r0928-0950-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950-2.md) | 09-28 09:54 | conhost.exe の 0xc0000409 の落ち四回と、Windows Terminal の見込み（r0928-0950-2・読むだけ） |
| [`r0928-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950.md) | 09-28 09:54 | 09-28 の再起動の後の点検（記憶の診断・仮想メモリ・03:20・NODE_OPTIONS・引き継ぎ）（r0928-0950・読むだけ） |
| [`r0928-0348-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0348-2.md) | 09-28 03:48 | 再起動-2（r0928-0348・後の測り） |
| [`r0928-0345-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0345-2.md) | 09-28 03:45 | 再起動-2（r0928-0345・後の測り） |
| [`r0928-0302-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0302-2.md) | 09-28 03:02 | 再起動-2（r0928-0302・後の測り） |

<!-- 控えの一覧 ここまで -->
