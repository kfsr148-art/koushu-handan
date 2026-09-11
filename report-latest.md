# 連携の穴（09-12）— 枠の全文・板と訴えの押し直し・台帳の開き方・知らせの題・フル版の関門・止まった窓（印 y0912-0300）

状態：ヨシ待ち（残り1件：⑦の裁定）　2026-09-12 03:00

＊仕事名「連携の穴-1〜4」は 08-30 の「連携の穴-1」（reports/連携の穴-1.md）と名が重なるので、控えの名は印にした。

## 最優先
- y0912-0200（線を挿す待ち）を yoshi-open.tsv から落とした（10→9行・写し .bak-20260912）
- 0x4A の切り分け-1 は台帳で取消（打ち切り・線は挿さない）
- 予定の仕事 ClaudeWifiSwap を消した（Wi-Fi は Up のまま・無線は一度も切っていない）
- 検査の node 8512 は既に終わっていた（出直しの結果は全部 PASS。01:56 の FAIL は重さのせい）

## 字面で出したもの（一項目一行）
- ②board.json … 書くのは `board-emit.ps1` L88（ClaudeBoard・10分ごと・結果0で走っていた）。09-11 20:40 から押しが -4（ほかの押しが続いている）で見送られ、L81 が**手元に書き終えたファイル**と突き合わせるので、次の回も「変わっていない」と読んで押し直さなかった
- ③pipe-warn.json … 書くのは `pipe-check.ps1` L599-621（ClaudePipeCheck・10分ごと・02:50:50 結果0）。中身は 09-11 09:10:19 の「訴えは無くなった」から変わっていないので、刻も同じ（kinds 空は正しい中身）。ただし押す前に指紋を控え、押しの結果を捨てていた＝見送られた回は二度と押さない穴があった
- ④rcName … 今の値は koushu-handan-66・7272。7124（7a）は 09-11 20:11:59 の試しで閉じたもの。道は正しく切り替わっていた
- ⑧report-latest.md … main・公開ページ（github.io）・raw のどれも 09-12 02:00 の版。v1415 のままではない
- 公開ページ … Pages の組み立ては 02:36 まで成功・配信元は main。board.json は直したあと 02:40:08 の刻で出た

## 直したもの
- **board-emit.ps1** … 押しが届かなかった回は押し残しの印（`board-push-pending.txt`）を置き、次の回は中身が同じでも押し直す。印は届いた回に消す
- **pipe-check.ps1** … 指紋を控えるのは押しが届いてから。push-fail・pub-late を含む訴えは題を「🪟 異常です（連携に訴え：…）」に（⑨⑭）
- **watch-notify.ps1** … 見込み超過の題を「🙀 延びています（異変発見だにゃ）」に（⑭）。status.md の上限20件には触らない
- **inbox-feed.ps1**（①⑤⑥⑪⑫）… 枠を四つに分ける
  - order（末尾が「以上」）… 台帳に「未了：受領」で一行開く／件名は仕事名（「名-番号」があればそれ、無ければ最初の意味のある一文）／前の印と待ちは控えから外す（待ちは yoshi-open.tsv に別行で残る）
  - yoshi（「<印> にヨシ」「ヨシ」で始まる）… 仕事にも件名にもしない。控えの待ちを「なし」へ畳み印を外す＝新しいヨシ待ちが立たない
  - cmd（claude -c・powershell の一行）／fragment（「以上」の無い断片）… 仕事にも件名にもしない
  - 枠の全文は `~/.claude/orders-full.jsonl` へ一件一行の JSON で丸ごと（改行も札も届いた字のまま）。state.json の order は短いまま
- **check-all.js・check.js**（⑩）… 空き物理メモリ 2GB 未満ならフル版を回さない（終了コード3・「フル版は回さない：空き N MB」）。pre-push は元から速い版だけ
- **revive-claude.ps1**（⑮）… 止まりの見分け。hook.log の最後が notification で、会話の最後の記録が答えの無い tool_use（許可の問い）か Interrupted、10分書かれず、その間に claude の子が立っていない→「🪟 止まっています（形・N分）」を一発
- **CLAUDE.md 作法5**（⑬）… 宣言とヨシは土台（本体・判定・見張りの札の作り）に触る仕事だけ。読むだけ・台帳の書き替え・報告は宣言なし

## 検収（写しで・作法14）
- inbox-feed の写しに四つの枠 … 仕事＝件名「連携の穴-9」・印外れ・待ち なし・台帳+1・全文1行／ヨシ＝待ち なし・印外れ・件名そのまま・台帳増えず／claude -c・断片＝控えも台帳も触らず全文にだけ入る
- revive-claude の写し（送り手は偽物へ差し替え）… 許可の問い15分＝一発／同じ止まり二度目＝鳴らない／ふつうに終わった回＝鳴らない／Interrupted 15分＝一発
- 構文 … inbox-feed 348行・board-emit 105行・pipe-check 665行・watch-notify 2910行・revive-claude 169行、どれも誤り0・BOM 有り。check.js・check-all.js は node --check 通過

## 裁定をお願いしたいこと（⑦・印 y0912-0300）
承認の足止め-1 ③（読むだけの命令を一本の台本にまとめ allow へ入れられるか）は、**09-10 14:57 に y0910-1305 のヨシで実施済み**（`.claude/look.js` を置き allow へ二項）。板に残って見えたのは公開の板が古かったためで、いまの板の待ちは0件。
- 甲＝これで閉じる（推し）
- 乙＝読むだけの命令をもう一段広く、一本の台本へまとめ直す

## 残り
1. ⑦承認の足止め-1 ③の裁定（y0912-0300）

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. 🙋 連携の穴 ⑦の裁定をお願いします（y0912-0300）

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

### 4. 🪟 異常です（手が要ります）

```
見張りの巡回が 10分ぶん止まっていました（段：控えを読んだ）。
その間、終わりの札や預けた押し送りは出ていません。いまは動いています。
こちらがすること：知らせが遅れていないかを確かめてください。続くようなら見張りを起こし直してください。
```

### 5. ✅ 終わりました（返事不要）

```
写せます（1件）
```

<!-- 送った知らせ ここまで -->

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **206件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`ヨシの猫の組み直し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E7%B5%84%E3%81%BF%E7%9B%B4%E3%81%97.md) | 09-09 19:26 | ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる** |

<!-- 控えの一覧 ここまで -->
