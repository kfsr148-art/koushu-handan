# パネルと受け口-8 — 下の二箱を常に出す（panel v83）

**状態：終わり（残り0件）／VAIO 2026-08-30 03:2x**

**結論** — 作業中に畳むのは「お知らせ」の釦と一覧の二つだけになり、
**「終わりました N件」と「ヨシした数」は常に出る**。中の個別の「写す」は作業中のあいだ押せないまま。
**本体（`koushu-handan.html`）には触っていない。**

---

# パネルと受け口-8 — 下の二箱を畳む対象から外した（panel v83）

**VAIO 2026-08-30 03:2x ／ panel v83 ／ 本体（`koushu-handan.html`）には触っていない**

## 直した所

`panel.html` **L162-168**。畳む対象から `#doneBox`（終わりました N件）と
`#copiedBox`（ヨシした数）を**外した**。

```css
/* 前（v81・v82） */
body.busy #btnCopyAll,
body.busy #list,
body.busy #doneBox,
body.busy #copiedBox { display:none !important; }

/* 後（v83） */
body.busy #btnCopyAll,
body.busy #list { display:none !important; }
```

- **上の「お知らせ（N件）」の釦と一覧を畳む作りは今のまま。**
- **中の個別の「写す」釦は、作業中のあいだ押せない形のまま**
  （`.cp:disabled` の見た目と、`setCopyBoardLabel` が `button.cp` を `disabled` にする側が持つ）。
  二箱が出ていても、作業中は押せない。

## 実測（写しに probe・作法14）

| 画面の物 | **作業中のとき** | 作業中0件のとき |
|---|---|---|
| 作業中の札（`#state`） | **出ている** | 出ている |
| まとめて写す（`#btnCopyBoard`） | **出ている** | 出ている |
| お知らせの釦（`#btnCopyAll`） | **出ていない** | 出ている |
| お知らせの一覧（`#list`） | **出ていない** | 出ている |
| **終わりました N件（`#doneBox`）** | **出ている** | 出ている |
| **ヨシした数（`#copiedBox`）** | **出ている** | 出ている |
| 写し取り一覧（`#btnShots`） | **出ている** | 出ている |
| URLを写す（`#btnCopyUrl`） | **出ている** | 出ている |
| 版と最終確認（`.facts`） | **出ている** | 出ている |
| 版の字（`#verTag`） | **出ている** | 出ている |

**釦と個別の写す**

```
作業中のとき     : "作業中、4時09分終了予定"（押せない）
                   個別の写す 5個中 押せないもの 5個 ／ body の class="busy"
作業中0件のとき  : "まとめて写す（5件）"（押せる）
                   個別の写す 4個中 押せないもの 0個 ／ body の class=""
```

## 版と公開

`PANEL_VER`（L374）／`verTag`（L352）／`panel-ver.txt` を同時に **82 → 83**。構文検査OK。

```
$ curl .../main/panel-ver.txt → 83
167:  body.busy #btnCopyAll,
168:  body.busy #list { display:none !important; }
352:  <p class="ver" id="verTag">panel v83（8月30日）</p>
374:  var PANEL_VER = '83';
$ 公開側に body.busy #doneBox / #copiedBox が残っていないか → 0件
$ diff 公開物 手元 → 完全一致
```

---

## 残り

**残り0件**（機械の数え＝`state-line.js` も0件）。

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 2. ✅ 終わりました（返事不要）

```
途切れの回収-1 の台帳の3行（写しのみ）
orders-open.tsv の「途切れの回収-1」の3行（284〜286行目）を、報告ファイルではなくこの知らせの本文へそのまま写した。タブはスラッシュに置き換えてある。作業はしていない。併せて、その前の枠（RunCat のコマ絵集め）の結果も出した——総99枚・猫のコマ10枚・縦36pxが95枚。
そのまま: 284行目 ／ 2026-08-30 10:31 ／ 途切れの回収-1-1 ／ 札の題-1 の残り＝作業中の札の題の出どころを行番号付きで書き、受けた枠の印を題に使う形へ直す ／ 済：報告そのものは reports/ に在り commit 1d82b96 で push 済み（作られなかったのは知らせの札）。残っていた実は「直しが効いていなかった」こと。出どころは inbox-watch.ps1 L306（件名を読む）・L340（置き字）・L488（state.json へ）・panel.html L1943/L1945。札の題-1 で入れた刻の比べが、同じ秒に両方書かれると外れていた（実測：枠 10:31:26 対 控え 10:31:26.301）。L310-355 を組み直し、刻を見ずに subj-seen.txt へ「印と件名の組」を控える形にした。実測で subj=途切れの回収-1 に。構文OK 960行・BOM 有り・常駐 PID 2916 起動10:33:41>台本10:33:29
285行目 ／ 2026-08-30 10:31 ／ 途切れの回収-1-2 ／ 写しの網-1 の残り＝数えと拾いの不一致の原因説明。写しの独立-2 で済んでいるなら「済」とだけ ／ 済
286行目 ／ 2026-08-30 10:31 ／ 途切れの回収-1-3 ／ run: のまま途切れた場合の検出と知らせがあるか。無ければ N 分で 🙀 を出せるかの可否だけ（実装はしない） ／ 済：在るのは二つ（watch-notify.ps1 L1543-1580）——over（見込みを過ぎた）と undef（未定のまま UNDEF_MIN=30分）。どちらも一発だけ。run: のまま何分経ったかだけを見る仕掛けは無い。窓が落ちた（dead）・生存が途切れた（stale:）は札は立つが押し送りが出ない（L1489 で $state が空）。可否＝できる。L1543 の中に既に work-started.txt の at と経過分があり、三つ目の枝を足すだけ。決める要は N の分数（undef の30分と二重に鳴らない値）と、見込みが在る仕事にも掛けるか。実装はしていない
```

### 3. ✅ 終わりました（返事不要）

```
通知の宛先-1（旧話題へ送る箇所は0件）と、途切れの回収-1 の台帳の行
【通知の宛先-1】~/.claude 直下の台本と設定52ファイル＋予定表六つ＋settings.json を数えた。旧話題（（話題名は伏せます）…）へ送る・読む箇所は0件。現れるのは4箇所だが、orders-open.tsv L255（この指示の控えそのもの）／rc-ntfy-topic.txt.retired-20260823 L1・retired-20260826 L1（引退の写し。watch-notify.ps1 L348 が *.retired-* を明示的に飛ばす）／watch-notify.log L1・3・5 ほか（2026-08-21 の送信の記録に ntfy の返した JSON が入っている）のいずれも送る・読むではない。0件なので置き換えも試験送信もしていない。台帳の三件を済にした。【途切れの回収-1】台帳の3行（284〜286行目）を全文そのまま報告に出した。
ファイル: reports/通知の宛先-1-2.md、~/.claude/orders-open.tsv
実測: 送る側は全部 rc-ntfy-topic.txt の一枚から取る——watch-notify.ps1 L443/L626、daily-notice.ps1 L33/L205、home-backup.ps1 L25/L54、inbox-watch.ps1 L94（置き場のみ）。いま入っているのは kh-5te46s…（末尾 ue6i）。settings.json の話題名は0件、予定表六つの引数にも話題名なし。現行が生きていることは本日の押し送り23件が HTTP 200 で通っていることで示される。話題名は公開リポジトリに書かない決まり（notify-record.ps1 L46 が控えからも伏せる）なので報告では先頭だけを出した。
実機: iPhone 側に残っている旧話題の購読は、VAIO の側からは止められない（購読は端末が持つ）。消すなら ntfy アプリでその購読を解除していただく形になる
```

### 4. ✅ 終わりました（返事不要）

```
通知の急ぎ-3（見切り送信の撤廃）と 穴の直し-1③ の裁定（四枚の削除）
【通知の急ぎ-3】5分で見切って「（反映が遅れています）」を付けて送る枝を撤廃した。待つ上限を300秒から1800秒（30分）へ上げ、上限まで出なければ押し送りはやめて $T_BAD_B（🪟 異常です（手が要ります））で「公開の詰まり」を知らせる形にした。題へ断りを足す行も外した。検収用に Trace-Push を置き、積んだ／読めた／送った の三つの刻を ~/.claude/push-trace.tsv へ控える（Push-WhenVisible と Resume-Pending の両方）。【穴の直し-1③ の裁定】CLAUDE.md 作法21 へ「この四枚は消してよい・要るときは焼き直す」と実コマンドを追記し、asset-proof-*／head-proof-* の4件6.97MB を git rm して push（726a10c）。公開側で四枚とも404、残す三枚と元絵は200、本体と panel.html は無事。
ファイル: ~/.claude/watch-notify.ps1（L481-484・L588-589・L749-765・L783-792・L806-826／写し .bak-20260830k）、CLAUDE.md（作法21）、asset-proof-dark.png ほか3枚を削除、reports/通知の急ぎ-3.md、reports/穴の直し-1-4.md
実測: 【急ぎ-3】構文OK 2193行・BOM 有り。根拠は 16:19 の実測（見切り5分に対し端末の反映は約7分＝16:14終わり→16:21反映）と ②の実測（98%＝751/765 が15分以内に公開へ追い付く）。30分は15分の倍の余裕。【③】消す前に asset-proof.js と head-proof.js の構文OKを確認し、読む者が居ないことも確認（当たった二つはどちらも書く側）。公開側は 四枚とも HTTP 404、usagi-proof-*・sizing-review.png・元絵は 200、ver.txt=1431・panel-ver.txt=102 で中身は手元と完全一致（panel.html の2327byte 差は行数ぶんの改行）。追跡ファイルは 63.3MB→56.3MB。git の履歴には中身が残るため縮んだのは作業木・配布の6.97MB分のみ（pack は 165.68MiB のまま）。
実機: ①😽 が届いたとき開けば必ず中身が読める（「（反映が遅れています）」は二度と出ない）②公開が30分止まったときだけ「🪟 異常です（手が要ります）」で公開の詰まりが届く ③本体と返事パネルが今までどおり開く
```

### 5. ✅ 終わりました（返事不要）

```
穴の直し-1 ③（掃除の候補25ファイル32.0MB の一覧）
穴の直し-1 ② を裁定どおり済にした（errored は容認・押しの間隔は変えない）。続けて③の一覧を作った。25ファイル32.0MB について パス・大きさ・最終commit日・参照元・焼き直せるか の五点を出した。消す作業は行っていない。参照の見方を三つに分けた——読む者（画面やコードが実際に開く先）／道具の入力（char_export.js は元絵を引数で受け取るのでコードに名前が出ない）／字面の言及（報告や注記に名が出るだけ）。本体にも panel.html にも触っていない。
ファイル: reports/穴の直し-1-3.md、~/.claude/orders-open.tsv
実測: 画面やコードが読んでいるものは25件のうち一つも無い（本体の絵は base64 で埋め込み済み）。koushu-handan.html L5394 の usagi_idle_front_src.png は注記の一行で読んではいない。内訳は 元絵（*_src.png）18件17.7MB＋焼き付け・確認の絵7件14.3MB。焼き直せるのは asset-proof-* と head-proof-* の4件6.97MB のみで、usagi-proof-* と sizing-review.png の3件7.32MB は書く道具が repo に見当たらない。最終commit は元絵が 2026-08-16〜08-24、確認の絵が 08-19〜08-24。明らかに要らないもの（.bak・一時ファイル・node_modules）は25件にもリポジトリ全体にも無い。
実機: なし（一覧のみ。画面に出るものは変えていない）
未検収: 消す・消さないの判断。①asset-proof-*／head-proof-*（4件6.97MB）は道具で焼き直せるので消せるが、作法21 が検収の手順で名指ししているため焼き直す手順を残す要がある ②usagi-proof-*／sizing-review.png（3件7.32MB）は焼いた道具が無く、消すと戻らない ③*_src.png（18件17.7MB）は作法21 が原版として残すよう定めており、消すなら作法21 の書き換えが先
```

<!-- 送った知らせ ここまで -->
























































---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **76件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`途切れの回収-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%94%E5%88%87%E3%82%8C%E3%81%AE%E5%9B%9E%E5%8F%8E-1-2.md) | 08-30 17:02 | 途切れの回収-1 の裁定 — dead / stale: も一発だけ押し送る |
| [`通知の宛先-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%AE%9B%E5%85%88-1-2.md) | 08-30 16:44 | 通知の宛先-1 — 旧話題へ送る・読む箇所は **0件** |
| [`通知の急ぎ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-3.md) | 08-30 16:33 | 通知の急ぎ-3 — 見切り送信を撤廃した |
| [`穴の直し-1-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-4.md) | 08-30 16:32 | 穴の直し-1 ③ の裁定 — 焼き付けの四枚を消した（6.97MB） |
| [`穴の直し-1-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-3.md) | 08-30 16:12 | 穴の直し-1 ③ — 掃除の候補 25ファイル 32.0MB の一覧（消していない） |
| [`穴の直し-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-2.md) | 08-30 16:04 | 穴の直し-1 ② — Pages の errored の内訳（数えただけ） |
| [`通知の急ぎ-2-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2-4.md) | 08-30 14:51 | 通知の急ぎ-2 ④ — 乙で確定。実測で三点のずれが出たので、知らせに自分の札を足した |
| [`通知の急ぎ-2-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2-3.md) | 08-30 14:40 | 通知の急ぎ-2 ③ — 裁定「乙」を当てた（印を写せますの札まで進める） |
| [`通知の急ぎ-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2-2.md) | 08-30 14:30 | 通知の急ぎ-2 ② — 実際の終わりで測った |
| [`パネルの整理-13.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-13.md) | 08-30 14:26 | パネルの整理-13 — 一番上の状態の札を消し、印を黄色の行へ移した（panel v102） |
| [`パネルの整理-12.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-12.md) | 08-30 14:11 | パネルの整理-12 — 一番上の札の固定高さを 134px → 101px へ縮めた（panel v101） |
| [`パネルの整理-11.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-11.md) | 08-30 14:08 | パネルの整理-11 — 黄色の行の高さを固定した（panel v100） |
| [`通知の急ぎ-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2.md) | 08-30 13:59 | 通知の急ぎ-2 — 😽 を「写せます」の札が出てから送る形にした |
| [`パネルの整理-10.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-10.md) | 08-30 13:48 | パネルの整理-10 — 上の札の左を「枠の印」にした（panel v99） |
| [`パネルの整理-9.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-9.md) | 08-30 13:43 | パネルの整理-9 — 時間の刻を黄色の行へ移した（panel v98） |
| [`パネルの整理-8.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-8.md) | 08-30 13:31 | パネルの整理-8 — お知らせを画面から消し、黄色の行を固定位置へ出した（panel v97） |
| [`パネルの整理-7.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-7.md) | 08-30 13:22 | パネルの整理-7 — M を「直近の写せますの N」へ差し替えた（panel v96） |
| [`パネルの整理-6.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-6.md) | 08-30 13:13 | パネルの整理-6 — 釦の字に「残N／全M件」を出した（panel v95） |
| [`パネルの整理-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-5.md) | 08-30 13:06 | パネルの整理-5 — 状態の表記を変えた（panel v94） |
| [`パネルの整理-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-4.md) | 08-30 12:59 | パネルの整理-4 — 一番上の状態の札の高さを固定した（panel v93） |

<!-- 控えの一覧 ここまで -->
