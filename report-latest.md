# claude の本数整理・起こす手を一本に・遠隔の繋ぎ直し・auto 起動（r0923-2141）

**終わり（残り0件）** — 2026-09-23 22:00ごろ（VAIO）。本体には触っていない。

### 枠一（21:41:52）

① **claude.exe は3本あった。** どれも起動は 14:21 で、親はどれも `claude-loop.cmd` の cmd だった。つまり輪の窓が3つ並んでいた。

| pid | 起動 | 親（cmd） | 扱い |
|---|---|---|---|
| 1216 | 09-23 14:21:23 | 7976 `cmd /k claude-loop.cmd` | **残した**（Code タブと繋がっているこの窓） |
| 8116 | 09-23 14:21:24 | 6604 `cmd /k claude-loop.cmd` | 輪の cmd ごと閉じた |
| 1892 | 09-23 14:21:24 | 6968 `cmd /k claude-loop.cmd` | 輪の cmd ごと閉じた |

- 3本とも `--remote-control koushu-handan` 付きなので、引数では見分けられない。自分の親を辿って 1216 を当てた
- 窓が増えた元：起こす手が `ClaudeCodeAtLogon` を叩くと、輪が生きていても**新しい輪の窓がもう一つ開く**。`cmd /c start` はすぐ終わるので、IgnoreNew も効かない

② **起こす手は claude-loop の一つに絞った。** 輪の cmd が生きていて何かを回している間は、`ClaudeCodeAtLogon` を叩かない。

- `revive-claude.ps1`：0本が2分続いても、輪の cmd が生きていれば `loopok` を記録して終わる。cmd は居るのに子が無い場合（打ち止めで止まった輪）は、その窓を閉じてから叩く
- `mode-check.ps1`：もともと自分では起こさない。落とすのを**輪の cmd の子の claude だけ**に絞った。輪が無ければ何も落とさずに終わる
- `inbox-watch.ps1` の `Restart-Window`（固まり・重さの起こし直し）も同じ穴を持っていたので、同じ形にした。落とした後、輪が居れば叩かない
- 作り値（`-FakeTalk 0 -FakeLoop …`・控えは scratchpad）で二通りを試した：loop 生存 → `loopok`（起こさない）／loop も claude も無い → `revive (fake)`（起こす）。**二通りとも合った**

③ **閉じた後：claude 1本（1216）・輪の窓 1つ。** 空きは閉じる前 523MB → 閉じた直後 646MB → 21:56ごろ 688MB（全体 3975MB）。

### 枠二（21:41:57）

① **遠隔の繋ぎ直しを常駐に入れた**（`inbox-watch.ps1` の `Check-RcDrop`。見るのは一分に一度）。

- 新しく `read-screen.ps1` を作った。send-text と同じ道で窓の cmd に付き、**見えている行だけ**を読む。流れて消えた字は数えない
- 「/rc failed」か「Remote Control disconnected」があれば、`send-text.ps1` で `/remote-control` を打ち、「🪟 遠隔を繋ぎ直しました」を一発鳴らす。打った後も字が画面に残るので、**同じ字の行には10分打たない**（控えは `rc-seen.txt`）
- いまの窓で読めるかを写しで試した：最下行の `auto mode on (shift+tab to cycle)…` まで読めた（今は `clean`）
- 作り値で三通りを試した：切れの字あり → 打って鳴らす／字なし → 触らない／同じ字の二度目 → 打たない。**三つとも合った**
- 常駐は 21:55:58 に起こし直した。台本の更新は 21:55:31 なので、直しは効いている（作法29 ⑤）

② **`claude-loop.cmd` の起動の引数に `--permission-mode auto` を足した**（届いた一行をそのまま回した。写しは `claude-loop.cmd.bak-20260923`）。

- 窓で確かめるには、この窓を落として輪に立て直させるしかない。そこで、報告と押しを済ませた**最後に** `mode-check.ps1` を切り離して回す。60秒後に落とし、立ち直った窓の記録の先頭にある `permissionMode` を `mode-check.txt` と ntfy「🪟 窓の許可の形を確かめました」に出す
- **記録は最初の入力で立つ**ので、窓に一言入れると確かめが進む（人手待ち）
- 参考：いまの窓の最下行には `auto mode on` が出ている。ただし、14:22 の記録の先頭は `default` だった

### 写し
`revive-claude.ps1` と `mode-check.ps1` と `inbox-watch.ps1` の写しは `.bak-20260923b`、台帳の写しは `orders-open.tsv.bak-20260923c`。

**台帳の未了 = 0件**

**回る段（作法36）** — 手元で回る段は、常駐（inbox-watch の固まり・重さ・遠隔の繋ぎ直し）と、毎分の ClaudeRevive と、輪（claude-loop）。雲の `check.yml`・`check-all` は変わっていない。

---



---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 終わりました（返事不要）

```
claude の本数整理・起こす手を loop に一本化・遠隔の繋ぎ直し・auto 起動
見えていた画面が 3 枚から 1 枚になりました。claude のプロセスも 3 本から 1 本へ、同じだけ終わっています。
閉じられたか、こちらで止めたものです。残っている物は無いので、手は要りません。
```

### 2. 😺 現在も順調にゃ

```
状態: 作業中 / 窓を auto で立てる・0本の回の終わり方
台帳: 残り 0件
見張り: 生存○ 見張り○ 片付け○ 受信箱○
使用量: セッション 6% / 週全体 19% / 週Fable 13%
起こし直し: 今日 2回（固まり 2・重さ 0・0本 0） / 最後に落ちた刻 05:08
訴え: 2件（mem-low・done-swept）… pipe-warn.log
配分: 全体 あと16.3%/日 ／ Fable あと17.5%/日
```

### 3. ✅ 再起動の後の点検（返事不要）

```
再起動の10分後の通し点検（09-23 15:10）
① 予定表 Claude* … 13件（無効 ClaudeSweepChecks）・最終結果は全て良い
② 見張りの生存 … 0分前
③ ntfy.sh の応答 … HTTP 200
④ 公開側 … notices.json のいちばん新しい札 09-23 14:30:44／panel-ver.txt 143
四つとも○。戻っている。
```

### 4. 🪟 連携に訴えがあります（done-swept）

```
連携の見張りから訴えが出ています。

・done-swept … 終わりの札が立っていなかったので立て直した（前の仕事の取り残し・定時再起動の見送り3/3は落とさず次の定時へ・stop 2026-09-23 14:21:08・9分遅れ）

＊同じ種類が続く間は、これ以上鳴らしません。
＊全部の記録は ~/.claude/pipe-warn.log にあります。
```

### 5. ✅ 終わりました（返事不要）：定時再起動の見送り3/3は落とさず次の定時へ

```
定時再起動の見送り3/3は落とさず次の定時へ
① Shift+Tab の auto に当たる値は "auto"（claude --help の --permission-mode の選択肢）。リポジトリの .claude/settings.json（acceptEdits）と settings.local.json（bypassPermissions）の defaultMode は新しい claude に効いておらず、auto に替えても記録の先頭は default のままだった。~/.claude/settings.json に permissions.defaultMode="auto" を入れると auto で立った。リポジトリ側は元へ戻した。起こし直しは切り離した mode-check.ps1 が60秒後に対話の claude を落とし、claude-loop が同じ窓で起こし直す。新しい記録の先頭を読んで mode-check.txt と ntfy に出す。② claude-loop.log・claude-loop-koushu.txt の末尾50行にメモリ上限の印は0件。最後の行は 05:08:24 で、07:26・08:15 の行そのものが無い（この二つは立て直しの回数だけを記録し、claude の出力は残らない）。NODE_OPTIONS（1024）は触っていない。台帳の未了0件。回る段：手元＝claude の起動の既定だけが変わる／雲＝check.yml・check-all は変化なし
```

<!-- 送った知らせ ここまで -->

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **389件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0921-2120.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2120.md) | 09-21 21:22 | Edge の置き去りを閉じた（+210MB）／SysMain は**手が要る** |

<!-- 控えの一覧 ここまで -->
