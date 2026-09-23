# mode-check を見るだけに・窓を立て直しても同じ遠隔の会話へ（r0923-2212）

**終わり（残り0件）** — 2026-09-23 22:21ごろ（VAIO）。本体には触っていない。

### ① mode-check.ps1 は窓を落とさない

- **落とす手（Stop-Process）を消した。** claude を起こすこともしない。窓を落とすのは、claude が本当に0本・固まり・重さのときだけにした（revive-claude.ps1 と inbox-watch.ps1 の仕事で、ここは触っていない）
- 確かめ方は、**次に自然に立った窓の会話の記録（jsonl）** の先頭にある permissionMode を読んで mode-check.txt へ一行書き、ntfy へ「🪟 窓の許可の形を確かめました」を一通送る。同じ記録では二度書かず、二度鳴らさない。-Since を渡せば、その刻より後に立った記録だけを見る
- 走っている mode-check は0本、予定表からの呼び出しも0件。今は手で呼んだときだけ動く
- 作り値（偽の送り手・偽の置き場）で三通り試し、三通りとも合った：記録なし→何もしない／新しい記録 auto→一行書いて一通送る／同じ記録で二度目→何もしない
- ＊22:01 に立った窓が **auto** だったことは、既に mode-check.txt にある（前の形で落として確かめた最後の一回）

### ② 立て直した後も同じ遠隔の会話へ——**手はあった**

**公式の説明**（code.claude.com/docs/en/remote-control）：
> To bring back a session you started with `claude --remote-control` or `/remote-control`, resume the conversation with `claude --continue` or `claude --resume`. Whether Claude Code reconnects, and to which session, depends on the conversation's reconnection record.

- 繋ぎ直しの記録は、会話の綴りにある `"type":"bridge-session"` の行（遠隔の会話の番号 `cse_…` を持つ）
- claude --help（2.1.280）には `--resume`・`--continue`・`--session-id`・`--remote-control` がある。ただ、Code タブの一覧に同じ項目が出るのか新しい項目が立つのかまでは、説明に書かれていない

**入れた形**

| 物 | 中身 |
|---|---|
| `~/.claude/pick-resume.ps1`（新） | bridge-session の行を持つ一番新しい綴りを選び、`--resume <会話の番号>` を一行出す。**20MB を超えていたら何も出さない**（新しく立てる）。何が起きても落ちず、出せなければ空で返す。記録は pick-resume.log |
| `~/.claude/claude-loop.cmd` | 起こす前に pick-resume を呼び、`claude %RESUME% --permission-mode auto --remote-control koushu-handan` で起こす。ASCII・CRLF のまま |
| revive の起動 | revive-claude.ps1 は `ClaudeCodeAtLogon` を叩くだけで、その先が claude-loop.cmd なので、**同じ道に乗る**（revive 側の字は変えていない） |

**仕組みの選び**：`--continue` ではなく `--resume <番号>` を選んだ。`--continue` は同じ場所の一番新しい会話を拾うので、claude -p の会話（sdk-cli）を掴むことがあるため。
＊**選ばなかった案**：`--continue` をそのまま付ける／`claude remote-control --session-id`（窓で対話するのではなく、待ち受けの形になる）。
＊**20MB の上限を置いた理由**：09-21 に 60MB の会話を読み込んで固まり、落とされてはまた読み込む輪になった（`--continue` を外した理由）。今の綴りは 0.5〜1.8MB。

**作り値**（偽の claude が引数を書き留め、偽の見張りが一周で止める。本物の claude は起こしていない）

| 例 | 渡った引数 |
|---|---|
| A 記録あり 0MB（より新しい sdk-cli の綴りも置いた） | `--resume 1111… --permission-mode auto --remote-control koushu-handan` |
| B 記録あり 21MB | `--permission-mode auto --remote-control koushu-handan`（上限超えで新しく立てる） |
| C 記録なし | `--permission-mode auto --remote-control koushu-handan` |
| 本物の綴りで見るだけ | `--resume 50aca653-…`（**いまこの窓の会話**） |

**Code タブで同じ会話が切れないかは、まだ見ていない。** 本物の窓を落とすと①の決めに反するので、**次に自然に立ち直った回に見る**（人手待ち）。
＊rc-restart.ps1・window-restart.ps1 には `--continue` がまだ残っている（09-21 に「他は変えるな」で残した二つ）。今回は触っていない。

### 実機で見る所
- 次に窓が立ち直ったとき、Code タブの一覧に**前と同じ会話が続いて**いて、新しい項目が増えていないこと
- ~/.claude/pick-resume.log の最後の行が `--resume <番号>` になっていること

### 触った物
~/.claude/mode-check.ps1（写し .bak-20260923c）・pick-resume.ps1（新）・claude-loop.cmd（写し .bak-20260923c）・orders-open.tsv・work-note.txt

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **390件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0921-2128.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2128.md) | 09-21 21:28 | 足跡の合図と、手待ちの畳み／pagefile は**手が要る** |

<!-- 控えの一覧 ここまで -->
