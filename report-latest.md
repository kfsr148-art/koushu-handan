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
穴の直し-1 ②（Pages の errored 765件の内訳）
使用量の配分-1 の未検収を「21:00 据え置きで確定」として済にした。続けて穴の直し-1 の② を数えた。gh api の pages/builds を全件（2678件）取り、built 1910件・errored 765件（28.6%）・building 3件。error.message は765件すべて「Page build failed.」で分けられないので、振る舞いで種類分けした。多い順に——走っている最中に次の押しに追い越された 710件（92.8%）／直後の組み立てが成功して埋め合わせた 21件（2.7%）／直後も失敗 17件（2.2%）／孤立した失敗 16件（2.1%）／0秒で落ちた 1件（0.1%）。取りこぼしは実質ゼロ（751件は15分以内に成功が続き、残る14件も後で公開されている）。本体にも panel.html にも触っていない。
ファイル: reports/穴の直し-1-2.md、~/.claude/orders-open.tsv
実測: 追い越された710件の「次の押しまでの間隔」は 最小2／四分位11／中央20／四分位34／最大2401秒で、60秒以内が681件（95.9%）。組み立ては42〜63秒かかるので、中央20秒で次が来れば必ず捨てられる。errored の所要は中央19秒（built は中央41秒）で、走り切る前に打ち切られている。日ごとの割合は押しの数と連れて動く——8/21 は16件中1件で6%、8/26 は283件中134件で47%。原因は GitHub の不調でもこちらの押し方の誤りでもなく、押しの「間隔」。直すなら押しの回数を減らすことになり、返事パネルの追随の速さと引き換えになる（この枠は数えるだけなので実施していない）。
実機: なし（数えただけ。画面に出るものは変えていない）
```

### 3. ✅ 終わりました（返事不要）

```
通知の急ぎ-2 の確定（乙のまま）と、実測で出たずれの直し
裁定どおり乙のままで確定し、甲へは切り替えない。台帳のこの件は済にした。一回目の実測で三点のずれが出たので直した——乙で印が写せますの札まで進むようになり、次に数えるのが仕事の札だけになった一方、貼る文にはその回の写せますの札も入る。そのため 知らせ1件・釦「残2／2件」・貼る文2件 と、知らせだけが1少なかった（釦が合って見えたのは v96 の m<n の備えが M を引き上げて隠していたため）。裁定の「N の意味は貼ると入る件数」に合わせ、watch-notify.ps1 L1779-1795 で知らせの数に自分の一枚を足す形にした。併せて push-measure.ps1 の一件配列のほどけ（作法26 と同型）も塞いだ。
ファイル: ~/.claude/watch-notify.ps1（L1779-1795／写し .bak-20260830j）、~/.claude/push-measure.ps1、reports/通知の急ぎ-2-4.md、~/.claude/orders-open.tsv
実測: 一回目＝前の印14:33:07・押し送り14:43:20。ひとまとまりは 14:41:10 の報告の札と 14:42:37 の「写せます（1件）」の二枚で、どちらも押し送りより前。N（パネルの未写し）2件・M 1件・仕事の数1件・押し送りより後の札0件。乙が効いた記録も出た（14:42:42「写せますの印を控えのいちばん新しい札まで進めた：1788068470 → 1788068557」）。足し算は四通りで確認（仕事0件→出さない／1件→写せます（2件）／2件→3件／5件→6件）。構文OK watch-notify 2148行・push-measure 102行、どちらも BOM 有り。測りは PID 1532 で起こし直した。
実機: 次に 😽 が届いたとき ①知らせの本文が「写せます（N件）」で N が貼ったときの件数と同じ ②釦が「まとめて写す（残N／N件）」で左右が同じ ③貼ると N件 入る
```

### 4. ✅ 終わりました（返事不要）

```
写せます（1件）
```

### 5. ✅ 終わりました（返事不要）

```
通知の急ぎ-2 の裁定「乙」を当てた（印を写せますの札の刻まで進める）
裁定「乙」を当てた。watch-notify.ps1 L1789-1793 で知らせた回に目印（$script:readyBumped）を立て、L2091-2133 の Flush-Quick のあとで控えのいちばん新しい札の刻まで upto を進める。Flush-Quick より前では写せますの札がまだ控えに無いため、そこが要点。甲（数から写せますの札を外す）を採らなかったのは、釦の「残N／M件」・知らせの「写せます（N件）」・貼る文の件数が同じ数を指す決まりを崩さないため。いま残っていた印も一度だけ手で揃えた（1788067929→1788067987＝14:32:09→14:33:07）。台帳のこの件は済にした。
ファイル: ~/.claude/watch-notify.ps1（L1789-1793・L2091-2133／写し .bak-20260830j）、~/.claude/push-measure.ps1（符号化の穴を直した）、~/.claude/copy-ready.txt、reports/通知の急ぎ-2-3.md、~/.claude/orders-open.tsv
実測: 構文OK 2138行・BOM 有り。push-measure.ps1 は構文OK 99行で、PID 10532 として切り離して回している（次の押し送りで N／M／仕事の数／押し送りより後に立った札 を出す）。前回この道具は curl の出力を ANSI で読む穴を踏んだので、ファイルへ落として UTF-8 で読む形へ直した。
実機: 次に 😽 が届いたとき、釦が「まとめて写す（残N／N件）」で左右が同じであること。前の回の写せますの札が混ざっていないこと
未検収: 乙では「N＝仕事の数」にはならない。ひとまとまりにその回の写せますの札自身が入るため、仕事1件なら N=2・M=2・仕事の数1。乙が守るのは N と M（と釦・貼る文）の一致で、仕事の数を N に出すのは甲の姿。測りでは三つとも出す。甲へ切り替えるなら釦と貼る文の数え方も揃える要がある
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

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **72件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`控えの穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8E%A7%E3%81%88%E3%81%AE%E7%A9%B4-1.md) | 08-30 12:06 | 控えの穴-1 — 控えが書かれなかった理由と、届かなかった実測の出し直し |
| [`パネルの整理-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-3.md) | 08-30 12:03 | パネルの整理-3 — 二段になっていた予定表示の、釦の側を外した（panel v92） |
| [`パネルの整理-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-2.md) | 08-30 11:58 | パネルの整理-2 — 状態の行を三通りにした（panel v91） |
| [`使用量の配分-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-1.md) | 08-30 11:36 | 使用量の配分-1 — 定時の報せへ「1日あたり使ってよい%」の一行を足した |

<!-- 控えの一覧 ここまで -->
