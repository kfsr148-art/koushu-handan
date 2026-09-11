# 読むだけの台本-1 ／ 鉤の軽量化-1 ／ 巡回の空き-1 ／ 人手待ち-1 ／ 知らせの割り当て-1 ／ 重複の枠-1

状態：終わり（残り0件・未検収2件＝実地の出番待ち）　2026-09-12 03:40

## 読むだけの台本-1（y0912-0300 は乙）
- `.claude/look.ps1`（新）… `-Cmd '<命令>'` を受け、Get-* ／ Select-String ／ Test-Path ／ Get-Content ／ Get-ScheduledTask ／ Get-CimInstance と、並べ替え・絞り込み・形の整えだけを通す。ほかの命令・書き出しの向き（>）・& ・書く／消す／起こす形のメソッドが一つでも混ざれば、走らせずに「断った」で終了コード2
- 試し … `Get-ScheduledTask ClaudeBoard | Select-Object …` は走った／`… | Remove-Item -WhatIf` は「通さない命令：Remove-Item」で断った
- allow（`.claude/settings.json`）… 直に呼ぶ形 `PowerShell(C:/…/.claude/look.ps1 *)`・`PowerShell(.claude/look.ps1 *)` と、Bash から呼ぶ形 `Bash(powershell -NoProfile -ExecutionPolicy Bypass -File …look.ps1 *)` の二つずつ
- 実測 … 鉤を切った別の `claude -p`（許可は既定の扱い）で、直に呼ぶ形・Bash から呼ぶ形とも**弾かれた数 0**
- 分かったこと … `PowerShell(powershell -File …)` の形は、道具が「入れ子の PowerShell は確かめられない」として allow に関わらず弾く（弾かれた数 1）。09-11 に足した `Bash(Get-*)` などは PowerShell の道具には効かない

## 鉤の軽量化-1（⑯）
- UserPromptSubmit の同期の鉤を `inbox-feed.ps1 -Kind read` から **`frame-in.ps1`（新・33行）**へ差し替えた（`~/.claude/settings.json`・写し .bak-20260912b）。することは「届いた枠を `frames-in.jsonl` へ一行足す」だけ
- 件名貼り・台帳の開き・ヨシの畳み・last-order.txt・全文の控えは **`frame-work.ps1`（新・183行）**へ移し、常駐（`inbox-watch.ps1` の `Check-Frames`）が `frames-in.jsonl` の大きさが変わった回だけ呼ぶ。state.json への差し込み（錠を5秒待つ）はやめ、常駐が巡回ごとに last-order.txt から入れ直す
- 時間切れ … 鉤は始めに `hook-inflight\<pid>.txt` を置き終わりに消す。20秒を過ぎて残った印は常駐が `hook-timeout.log` へ「時間切れ」で移す。鉤の中で8秒を超えた回は鉤が「遅い」で一行残す
- 試し（写し）… 鉤の中 1.0〜1.5秒・印の残り0・時間切れの控え無し
- 常駐 … 起こし直した（pid 8760・起動 03:21:02 ＞ 台本 03:18:56・1本）
- SessionStart・Stop の inbox-feed はそのまま

## 巡回の空き-1（⑰）
- 02:30〜02:40 の空き … 02:30:10 に始まった回が「控えを読んだ」（02:30:26）の次の段＝知らせの判定で固まり、10分の上限で切られるまで次の回が始まらなかった（次の 02:40 の回も同じ段に 38.7秒）
- `watch-notify.ps1` … 書き足す前に前回の刻を読み、5分以上空いていたら札「🪟 見張りが止まっていました（HH:MM〜HH:MM・N分）」を一枚立てる（押し送りなし）。同じ空きには二度立てない（`watch-gap-seen.txt`）。重い帯の中は起こしが5分おきに間引かれるので11分から

## 人手待ち-1（⑱）
- CLAUDE.md 作法29 に「人手が要る待ち（UAC・線を挿す・実機で見る）はヨシ待ちにせず 未検収:（人手待ち）へ回して次へ進む。ヨシ待ちは甲乙の裁定だけ」を足した。記憶にも残した

## 知らせの割り当て-1（⑲）
- `ntfy-budget.ps1`（新）… 異常（異常です・止まっています・🪟）と延び（延びています）は**一日合わせて8件まで**、同じ件名の延びは一日一回。ヨシは数えない。当たったら押し送りだけ見送り、札は立てたまま
- `ntfy-say.ps1` と `watch-notify.ps1`（bad・over の押し送り）の前に通す。status.md の上限20件には触らない
- 試し … 異常9件目で止まる／同じ件名の延び二度目で止まる／別件名とヨシは通る

## 重複の枠-1（⑳）
- `frame-work.ps1` が枠の全文の MD5 を `frames-seen.tsv` に10分控え、同じなら捌かず、台帳に「済：重複・捨てた」の一行だけ残す
- 試し（写し）… 同じ全文の二度目で「重複・捨てた」の一行だけ・件名も台帳の仕事の行も増えない

## 構文
- look.ps1・frame-in.ps1（33行）・frame-work.ps1（183行）・ntfy-budget.ps1（47行）・inbox-watch.ps1（1045行）・watch-notify.ps1（2955行）・ntfy-say.ps1（134行）、どれも誤り0・BOM 有り

## 未検収（実地の出番待ち）
1. 鉤の差し替え（⑯）が今の窓に効いているか … 次の枠で hook.log に `frame-work` の行が出れば効いている（窓が設定を読み直すまでは古い鉤のまま動く）
2. 巡回の空きの札（⑰）… 次に巡回が5分以上空いたとき、札が一枚だけ立つこと

## 残り
残り0件

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 読むだけの台本-1 ほか五件 終わり（残り0件）

```
読むだけの台本-1 ほか五件 — 終わり（残り0件）
乙：.claude/look.ps1 に読むだけの命令をまとめ allow へ。別の claude -p で許可の問い0（直に呼ぶ形・Bash から呼ぶ形とも）。powershell -File の形は道具が入れ子として弾くので使えない
⑯：UserPromptSubmit の鉤は「枠を一行足すだけ」に。件名・台帳・ヨシの畳みは見張り側。時間切れは hook-timeout.log。鉤の中 1.0〜1.5秒
⑰：02:30 の回が知らせの判定で固まり10分で切られた。5分以上の空きで「🪟 見張りが止まっていました」の札を一度だけ
⑱：人手待ちはヨシ待ちにせず未検収へ（CLAUDE.md 作法29）
⑲：異常と延びは一日8件まで・同じ件名の延びは一日一回（札は立てたまま）
⑳：10分以内の同じ全文の枠は捨て、台帳に「重複・捨てた」の一行だけ
未検収：鉤の差し替えは次の枠で効きを見る／巡回の空きの札は次の空きで見る
```

### 2. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 3. 🙋 ヨシしてください

```
連携の穴-1 — 枠の全文・板と訴えの押し直し・台帳の開き方・知らせの題・フル版の関門・止まった窓
印: y0912-0300
待っているのは：⑦承認の足止め-1 ③の裁定。③は 09-10 14:57 に y0910-1305 のヨシで実施済み（look.js を置き allow へ二項）。板に残って見えたのは公開の板が古かったため（いまの板の待ちは0件）。甲＝これで閉じる（推し）／乙＝読むだけの命令をもう一段広く一本の台本へまとめ直す
答え方：「y0912-0300 にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
```

### 4. 🙋 連携の穴 ⑦の裁定をお願いします（y0912-0300）

```
連携の穴（09-12・印 y0912-0300）— ⑦の裁定待ち（残り1件）
最優先：y0912-0200 を落とした／0x4A の切り分け-1 は取消／ClaudeWifiSwap を消した
②board.json：board-emit.ps1 L88 の押しが 09-11 20:40 から -4 で見送られ、L81 が手元と比べて押し直さなかった。押し残しの印で押し直す形にし、02:40 に公開側へ出た
③pipe-warn.json：中身は 09-11 09:10 の「訴え0件」から変わっていない（止まりではない）。先に指紋を控える穴は、届いてから控える形に直した
④rcName：今の値は 66・7272（7124 は試しで閉じた）。道は正しい
⑧report-latest.md：main も公開も 09-12 の版。v1415 のままではない
①⑤⑥⑪⑫：inbox-feed が「以上」で閉じた枠だけ台帳に開き件名は仕事名。ヨシの返事・claude -c・断片は仕事にしない。ヨシでは待ちを畳む。全文は orders-full.jsonl
⑨⑭：push-fail・pub-late は「🪟 異常です（連携に訴え：…）」、見込み超過は「🙀 延びています」
⑩：空き2GB未満ならフル版を回さない（終了コード3）
⑬：作法5 の宣言とヨシは土台に触る仕事だけ
⑮：許可の問いか Interrupted のまま10分動かない窓を「🪟 止まっています」で一発
⑦の裁定：承認の足止め-1 ③は 09-10 14:57 に y0910-1305 のヨシで実施済み（look.js）。甲＝閉じる（推し）／乙＝もっと広く一本にまとめ直す
```

### 5. 🪟 異常です（手が要ります）

```
見張りの巡回が 10分ぶん止まっていました（段：控えを読んだ）。
その間、終わりの札や預けた押し送りは出ていません。いまは動いています。
こちらがすること：知らせが遅れていないかを確かめてください。続くようなら見張りを起こし直してください。
```

<!-- 送った知らせ ここまで -->

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **207件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`読むだけの台本-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%82%80%E3%81%A0%E3%81%91%E3%81%AE%E5%8F%B0%E6%9C%AC-1.md) | 09-12 03:26 | 読むだけの台本-1 ／ 鉤の軽量化-1 ／ 巡回の空き-1 ／ 人手待ち-1 ／ 知らせの割り当て-1 ／ 重複の枠-1 |
| [`y0912-0300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-0300.md) | 09-12 02:54 | 連携の穴（09-12）— 枠の全文・板と訴えの押し直し・台帳の開き方・知らせの題・フル版の関門・止まった窓（印 y0912-0300） |
| [`連携の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E7%A9%B4-1.md) | 09-12 02:54 | 連携の穴-1 — Codeタブ・返事パネル・GitHub の連携の棚卸し |
| [`y0912-0200.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-0200.md) | 09-12 01:54 | 0x4A の切り分け-1 — 無線LANを外して有線へ、Event 41 で数える（印 y0912-0200） |
| [`0x4A の三（四度目）.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/0x4A%20%E3%81%AE%E4%B8%89%EF%BC%88%E5%9B%9B%E5%BA%A6%E7%9B%AE%EF%BC%89.md) | 09-11 20:57 | 0x4A の三（四度目）— 管理者の窓を開かずに、読める分を片付けた |
| [`落ちた後の起こし-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%90%BD%E3%81%A1%E3%81%9F%E5%BE%8C%E3%81%AE%E8%B5%B7%E3%81%93%E3%81%97-2.md) | 09-11 20:35 | 落ちた後の起こし-2 — 窓の起こし直しと🪟・RC 切れの数え・遠隔の会話名 |
| [`y0911-0701.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0701.md) | 09-11 07:02 | 0x4A の三（三度目）— 昇格の問いは四回とも約2分で取り消し（印 y0911-0701） |
| [`y0911-0627.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0627.md) | 09-11 06:29 | 0x4A の三（二度目）— 昇格の問いは出したが、約2分で取り消しになった（印 y0911-0627） |
| [`y0911-0047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0047.md) | 09-11 00:47 | 落ちた後の起こし-1 と 帯の中の黙り-1（乙）— 三件とも済 |
| [`y0910-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-2255.md) | 09-10 22:53 | 帯の中の黙り-1 — 直し方の裁定のお願い（印 y0910-2255） |
| [`土台の直し-1の実装.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%9F%E8%A3%85.md) | 09-10 20:27 | 土台の直し-1（実装）— shanten を analyze() の外へ持ち上げ、写し二つを廃した（v1438） |
| [`y0910-1752.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1752.md) | 09-10 17:53 | 押しの黙り-1 — 押しの失敗と .git の壊れを訴えへ足した（印 y0910-1752） |
| [`y0910-1727.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1727.md) | 09-10 17:30 | 旧版の窓を止め、ログオン時の起こしを置いた（印 y0910-1727） |
| [`y0910-1655.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1655.md) | 09-10 17:00 | 錠の名を揃え、落ちの正体を割った（印 y0910-1655） |
| [`y0910-1305-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-3.md) | 09-10 15:16 | pub-read の始末と、長く走る命令の上限（印 y0910-1305-3） |
| [`y0910-1305-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-2.md) | 09-10 15:04 | 読むだけの台本と、公開の止まりの割り直し（印 y0910-1305-2） |
| [`y0910-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1330.md) | 09-10 13:36 | 公開の止まり-1（印 y0910-1330） |
| [`y0910-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305.md) | 09-10 13:09 | 承認の足止めと自動モードの戻し道（印 y0910-1305） |
| [`y0910-0052-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052-2.md) | 09-10 01:30 | 一分おきの走り出し-1-2 — 甲で直した。作り値は三通りとも一本 |
| [`y0910-0052.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052.md) | 09-10 00:56 | 一分おきの走り出し-1 — 口を塞いだ。原因は**件名の末尾の空白** |

<!-- 控えの一覧 ここまで -->
