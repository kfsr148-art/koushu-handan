# 重いときは /clear だけ・起こす手は一つ・🔗 新しい線・繋ぎ直しの手（r0923-2222）

**終わり（残り0件）** — 2026-09-23 22:26ごろ（VAIO）。本体には触っていない。

一. **重い窓は立て直さず、/clear を打つだけにした。**
- **mode-check.ps1**：前の枠（r0923-2212）で書き替え済み。窓を落とさず、claude も起こさない。次に自然に立った窓の記録を読むだけ
- **inbox-watch.ps1 の Check-ClaudeHeavy**：手待ちで claude の私用メモリが 900MB を超えたとき、`Restart-Window`（落として立て直す）を呼ぶのをやめた。代わりに send-text.ps1 の道で窓へ `/clear` を打ち、「🪟 控えを畳みました（重さ NNNMB）」を一通送る。一度打ったら 900MB を下回るまで黙る（控えは claude-heavy.txt、今までどおり）
- 作り値（偽の打ち手・偽の送り手）で5通り試し、**5通りとも合った**：950MB 手待ち→/clear 1回・1通／同じ重さで二度目→何もしない／800MB に下がる→何もしない／950MB 走行中→何もしない／下がった後にまた 950MB→/clear 1回・1通。**窓の立て直しは5通りとも0回**
- ＊窓を落とす手（Restart-Window）が残っているのは**固まり**のときだけ。0本のときは revive の仕事で、ここは変えていない

二. **起こす手は claude-loop の一つ。r0923-2141 で入れた形のまま効いている。**
- revive-claude.ps1：輪の cmd が生きていれば `loopok` を記録して起こさない。作り値で二通りを試し直し、合った（輪あり→loopok／輪も claude も無し→起こす）
- mode-check.ps1：もう起こさない（一のとおり）。inbox-watch の Restart-Window も、輪が居れば ClaudeCodeAtLogon を叩かない
- **いま**：claude.exe **1本**（pid 8652・21:59:54 起動・`--permission-mode auto --remote-control koushu-handan`・親は輪の cmd 7976）・輪の窓 **1つ**。**2本以上ではなかったので、閉じた物は無い**。空き **624MB／全体 3975MB**

三. **窓が新しく立つたびに「🔗 新しい線」を送るようにした**（inbox-watch.ps1 の Check-NewLine・巡回ごと）。
- 拾い方：会話の綴り（jsonl）の `"subtype":"bridge_status"` の行にある url（https://claude.ai/code/session_…）。行を持つ綴りのうち一番新しく書かれたものの、最後の行を使う
- 対話の claude の pid か宛先が替わったら、宛先を本文の一行目に載せて **一通だけ**送る。控えは newline-sent.txt。控えが無い初回は鍵を書くだけで送らない（常駐を起こし直しただけで鳴らさないため）
- 作り値で6通り試し、**6通りとも合った**：控えなし→書くだけ／同じ窓→何もしない／窓が立ち直る（pid が替わり、宛先は同じ）→1通／宛先が替わる→1通／宛先の行なし→何もしない／本物の綴りを見るだけ→`session_01HbNfoUB7otX295K6cw68vy`（いまの窓）を拾った
- 常駐を 22:24:58 に起こし直した（台本 22:24:25 より後）。常駐は1本。控えには `8652|https://claude.ai/code/session_01HbNf…` が入った（送ってはいない）

四. **ある**（読むだけ。この件では直していない）。
- 公式（code.claude.com/docs/en/remote-control）：「`claude --remote-control` か `/remote-control` で始めた会話は、`claude --continue` か `claude --resume` で戻せる。繋ぎ直すかどうか・どの遠隔の会話へかは、その会話の繋ぎ直しの記録で決まる」
- **書き方**：`claude --resume <会話の番号> --remote-control koushu-handan`（または `claude --continue --remote-control koushu-handan`）。会話の番号は、綴りのファイル名（`<番号>.jsonl`）
- 記録が残るのは停止から約4時間まで（`claude remote-control` の待ち受けの形についての記述）
- **説明に無いこと**：Code タブの一覧に同じ項目が出るのか、新しい項目が立つのか
- ＊前の枠（r0923-2212 の②「あれば入れよ」）で、この形は既に claude-loop に入れてある（pick-resume.ps1・20MB 超は新しく立てる）。四の「直しはするな」を受けて、今回は戻してもいない。**戻すなら** `~/.claude/claude-loop.cmd.bak-20260923c` を claude-loop.cmd へ写すだけ

### 実機で見る所
- 手待ちで重くなったとき、窓に `/clear` が打たれて会話が畳まれ、窓は開いたままで Code タブも繋がったままであること（ntfy「🪟 控えを畳みました（重さ NNNMB）」）
- 次に窓が立ち直ったとき、ntfy に「🔗 新しい線」が一通だけ届き、本文の一行目の宛先を押すと、その窓の会話が開くこと

### 手元で回る段・雲で回る段（作法36）
- 手元：inbox-watch（常駐・毎分）… Check-ClaudeHeavy（4巡に一度）・Check-RcDrop・**Check-NewLine（新・毎巡）**・Check-ClearNote ほか／revive-claude（予定・毎分）／claude-loop（窓）… pick-resume／mode-check … 呼ばれたときだけ（予定に無い）
- 雲：check.yml は本体の押しだけ。今回は ~/.claude だけなので、雲では何も回らない

### 触った物
~/.claude/inbox-watch.ps1（写し .bak-20260923d）・orders-open.tsv（写し .bak-20260923d。手で重ねて積んだ行を消し、常駐が積んだ行へ寄せた）・work-note.txt

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **391件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0922-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1330.md) | 09-22 13:29 | state-stale の繰り返しは「押しの間引き」が元。25分の底を足した |
| [`y0922-1113.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1113.md) | 09-22 11:14 | 0件の元は「見出しの言語」。数え方を Get-ScheduledTask へ替えた |
| [`y0922-1047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1047.md) | 09-22 10:49 | 予定表の Claude* は13件すべて在った（入れ直さず） |
| [`r0922-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0922-0430-2.md) | 09-22 04:30 | 再起動-2（r0922-0430・後の測り） |
| [`y0922-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-0015.md) | 09-22 00:09 | 戻しは取り下げ。三つは当てたまま |
| [`y0921-2305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2305.md) | 09-21 23:32 | 管理者の窓で一度走らせれば三つ当たる綴り |
| [`y0921-2258.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2258.md) | 09-21 22:58 | hook の数え（末尾3000行）と、Google の予定 |
| [`y0921-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2140.md) | 09-21 21:57 | 黒い窓の巻き戻しを 9001行 → 500行 に |
| [`y0921-2135.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2135.md) | 09-21 21:50 | 盤の健康・熱・画面バッファの調べ／昇格の問いは閉じられた |

<!-- 控えの一覧 ここまで -->
