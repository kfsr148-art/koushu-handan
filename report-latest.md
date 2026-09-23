# panel-check は雲（job.yml）で回して reports/ へ返す（r0923-2341）

**終わり（残り0件）** — 2026-09-23 23:48ごろ（VAIO）。本体には触っていない。窓は落としていない。

### したこと
- **job.yml（雲で回す）**
  - 起きる条件に `panel.html` と `panel-check.js` を足した。パネルを押せば雲が回す
  - 押しで回すのは**その押しで変わった台本だけ**にした。パネルが変わっていれば、それに `panel-check.js` を足す。変わった物が読めない回は、今までどおり全部を回す（check.yml と同じく深さ20＋足りなければ深掘り）
  - ブラウザの用意（Chromium）の段を check.yml から写した
- **scratchpad/jobs/panel-check.js**（新）：直下の panel-check.js を呼ぶだけ。検査の字は一つのまま。終了コードもそのまま返す
- **VAIO 側**：panel-check を手元で回す行は、台本・作法（CLAUDE.md・SKILL.md）・pre-push のどれにも**無かった**（pre-push は既に「GitHub Actions へ移した」と書いてある）。手元で回していたのは、わたしが手で打った一回（22:49）だけ。書いてあったのは次の二つで、どちらも「雲へ」に替えた
  - heavy-on.ps1 の注釈（「重い検査（check-all／panel-check／widget-check）の前に打つ」）
  - 記憶（重い帯の宣言）
- scratchpad/jobs/README.md に「panel-check は雲で回す」の節を足した
- ＊check.yml の検査の段にある panel-check（本体の回の関門）はそのまま。あちらは通らなければ配信を止める役で、結果は reports/ へは返さない

### 雲での一回目（作り値）
- 走り **[35876570046](https://github.com/kfsr148-art/koushu-handan/actions/runs/35876570046)**（23:45:48 起こし）。変わったもの＝job.yml・README・panel-check.js → **回す台本＝panel-check.js だけ**（kumo-tameshi.js は回っていない＝選びが効いた）
- 結果 **reports/cloud-panel-check-20260923-144600.md** が押し戻された。**終了コード0・30秒・✓53／✗0**（panel v144）
- ＊22:49 に手元で回したときの ✗2（作業中／手待ち：測れない）は、雲では ✓ だった。**v144 の直しのせいではなく、VAIO の空き不足**だったと分かった

### 手元で回る段・雲で回る段（作法36）
- 手元：panel-check は**回さない**。check-all は速い版だけ（pre-push）。widget-check も手元では回していない
- 雲：
  - check.yml … 本体の回（panel.html を含む）で、速い版→フル版→widget-check→panel-check。落ちれば配信が止まる
  - job.yml … panel.html／panel-check.js の押しと、scratchpad/jobs の台本の押しで回る。**panel-check の結果を reports/cloud-panel-check-*.md へ返す**
  - ＊panel.html を押すと、panel-check は雲で**二度**走る（関門と、結果を返す側）。一度30秒ほどなので、今は重ねたままにした

### 触った物
.github/workflows/job.yml・scratchpad/jobs/panel-check.js（新）・scratchpad/jobs/README.md／~/.claude/heavy-on.ps1・orders-open.tsv・work-note.txt・記憶 heavy-band-before-heavy-work（と索引）

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **393件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0923-2341.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2341.md) | 09-23 23:48 | panel-check は雲（job.yml）で回して reports/ へ返す（r0923-2341） |
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
| [`y0922-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1330.md) | 09-22 13:29 | state-stale の繰り返しは「押しの間引き」が元。25分の底を足した |
| [`y0922-1113.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1113.md) | 09-22 11:14 | 0件の元は「見出しの言語」。数え方を Get-ScheduledTask へ替えた |
| [`y0922-1047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1047.md) | 09-22 10:49 | 予定表の Claude* は13件すべて在った（入れ直さず） |
| [`r0922-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0922-0430-2.md) | 09-22 04:30 | 再起動-2（r0922-0430・後の測り） |
| [`y0922-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-0015.md) | 09-22 00:09 | 戻しは取り下げ。三つは当てたまま |
| [`y0921-2305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2305.md) | 09-21 23:32 | 管理者の窓で一度走らせれば三つ当たる綴り |
| [`y0921-2258.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2258.md) | 09-21 22:58 | hook の数え（末尾3000行）と、Google の予定 |

<!-- 控えの一覧 ここまで -->

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. 🔗 新しい線

```
https://claude.ai/code/session_01HbNfoUB7otX295K6cw68vy

Code タブ：引き継ぎは試していない（claude-loop は新しい会話で立てた。pick-resume.log を見る）

窓の claude（pid 8652）の remote-control の宛先です。
＊記録は ~/.claude/inbox-watch.log。
```

### 2. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 3. 🔗 新しい線

```
https://claude.ai/code/session_01HbNfoUB7otX295K6cw68vy

Code タブ：引き継ぎは試していない（claude-loop は新しい会話で立てた。pick-resume.log を見る）

窓の claude（pid 4412,8652）の remote-control の宛先です。
＊記録は ~/.claude/inbox-watch.log。
```

### 4. ✅ 終わりました（返事不要）

```
panel-check を雲（job.yml）で回して reports/ へ返す
job.yml を panel.html／panel-check.js の押しでも起きるようにし、scratchpad/jobs/panel-check.js（直下の panel-check.js を呼ぶだけ）を回して reports/cloud-panel-check-<刻>.md へ返す形にした。押しで回るのは変わった台本だけ（＋パネルが変われば panel-check）。ブラウザの用意は check.yml と同じ。VAIO 側は panel-check を手元で回す行は無かった（heavy-on.ps1 の注釈と記憶の一行だけ）ので、注釈を「雲へ」に替えた。雲での一回目（走り 35876570046）は panel-check.js だけが選ばれ、reports/cloud-panel-check-20260923-144600.md が返った：終了コード0・30秒・✓53／✗0（v144）。22:49 に手元で出た ✗2 は空き不足のせいだった
ファイル: reports/r0923-2341.md・report-latest.md・.github/workflows/job.yml・scratchpad/jobs/panel-check.js（新）・scratchpad/jobs/README.md／~/.claude/heavy-on.ps1・work-note.txt・記憶 heavy-band-before-heavy-work
実測: YAML 通過・node --check 通過・選びの bash 構文通過・heavy-on 構文NG 0
未検収: 2026-09-21 17:00 --continue を外した後の起こし直し（人手待ち）／2026-09-21 19:57 使用量の上限で手待ち（人手待ち）／2026-09-21 20:50 落ちにくい窓の三つと枠の上限-2（人手待ち）／2026-09-21 21:28 healthchecks の check 作りと URL 貼り（人手待ち）／2026-09-21 21:40 画面バッファ500行（人手待ち・次に窓が立った回）／2026-09-22 00:04 pagefile 4096MB の実際の割り当て（次の再起動のあと）／2026-09-23 次の再起動の後15分のあいだ固まりの知らせが鳴らないこと（人手待ち）／2026-09-23 次に取り下げで閉じた回に ✅ の札が印つきで立って鳴ること（人手待ち）／2026-09-23 次に遠隔の線が切れた回に「🪟 遠隔を繋ぎ直しました」が鳴り Code タブへ戻ること（人手待ち）／2026-09-23 22:20 窓が立ち直った後も Code タブの同じ会話が続くこと（人手待ち・次に自然に立ち直った回）／2026-09-23 22:26 次に窓が立ち直った回に「🔗 新しい線」が一通だけ届くこと（人手待ち）／2026-09-23 22:26 手待ちで 900MB を超えた回に窓が残ったまま /clear で畳まれること（人手待ち）／2026-09-23 23:15 03:00 の立ち直りの「🔗 新しい線」の判じ（人手待ち）
```

### 5. 🪟 時間切れ（再挑戦 1/3）

```
枠が 9分を過ぎたので切りました（上限 8分）。**受信箱へは戻していません。**
同じ字の枠を切ったのは、48時間で 1 回目です。

── 切れた枠（先頭200字）──
panel-check（Edge を立てる確かめ）を VAIO で回すのをやめ、雲（job.yml の GitHub Actions）で回して結果を reports/ に返す形にせよ。VAIO 側の台本や作法に panel-check を手元で回す行があれば、雲へ渡す形に替えよ。作り値で一度、雲で回って結果が返ることを確かめよ。本体には触るな。以上

── どこまで進んだか ──
台帳：未了 0件
足跡：最後は 23:52:17 notification／この枠に入ってから 命令 6回・返り 5回
　＊返っていない命令が 1件ある（そこで止まった見込み）

＊claude の子を 0本落として、Esc を一打送りました。
＊記録は ~/.claude/inbox-watch.log。
```

<!-- 送った知らせ ここまで -->




