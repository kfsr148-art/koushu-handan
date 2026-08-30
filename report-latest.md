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
写せます（3件）
```

### 2. ✅ 終わりました（返事不要）

```
写しの一回-3（読み返しをやめ、未写しの分だけに）— panel v89
panel.html L910-917 で写す札を shown.filter(!isDone)＝未写しだけに戻し、釦は L776-782 で「まとめて写す（N件）」の一つにした。読み返しの枝と断り書き（未写し N件＋読み返し M件）を消し、buildBundle の戻りも { text, todo, count } に戻した。v88 の釦の三分岐も取り消し。未写し0件のときは作業中なら「作業中、HH時MM分終了予定」、手待ちなら畳む。通知の N（watch-notify.ps1 L1714-1740）は写しの一回-2 のままで、釦の N と同じ「まだ写していない分」を指す。併せてヨシ待ちの y0830-utsuseru（甲案で実装済み）と y0830-1058（続きが届いた）を落とした。
ファイル: panel.html（L352・L374・L776-782・L910-917・L924・L948）／panel-ver.txt（89）／~/.claude/yoshi-open.tsv／reports/写しの一回-3.md
実測: probe で五通り——甲（作業中・未写しあり）まとめて写す（20件）押せる・出ている／丙（手待ち・未写しあり）同じ／丁（手待ち・未写し0件）まとめて写す（0件）押せない・畳んでいる／戊（未写し2件・写した印18件）まとめて写す（2件）count 2／乙（作業中・未写し0件）作業中、11時10分終了予定・押せない・出ている。個別の写すは33個中0個が押せない。甲の写し5461字の頭から「未写し…＋読み返し…」の行が消えている。panel 構文OK。残るヨシ待ちは7件。
実機: ①未写しがあるとき釦が「まとめて写す（N件）」で N は未写しの数だけ ②押したあと、手待ちなら釦が畳まれる／作業中なら「作業中、HH時MM分終了予定」③写した札は「終わりました」の箱の個別の「写す」で取れる ④貼った文の頭に「未写し…＋読み返し…」の行が無い ⑤版の字が panel v89
```

### 3. 🙋 ヨシしてください

```
写しの一回-3（断片を受領・続き待ち）
印: y0830-1058
待っているのは：枠の続き。末尾の「以上」の行が届くまで着手しない（作法23）。届いた断片は控えてある
答え方：「y0830-1058 にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
```

### 4. ✅ 終わりました（返事不要）

```
写せます（20件）
```

### 5. ✅ 終わりました（返事不要）

```
写しの一回-2（通知の N を新しい分だけに戻し、釦の字へ内訳）— panel v88
写しの一回-1 の②を直しすぎていた。通知の N も控えの札ぜんぶにしたため、新しく終わったのが2件でも「写せます（20件）」と出ていた。watch-notify.ps1 L1714-1740 で「前に知らせたときより後に立った札」だけを数える形に戻し、印は copy-ready.txt の upto= に持たせた（知らせた回だけ打ち直す・0件なら知らせない）。panel v88 では釦の字へ内訳を出す——両方在る→まとめて写す（新N件＋読み返しM件）／読み返し0→まとめて写す（N件）／新しい分0→読み返す（M件）。押せば全部が一本で写るのと、文の頭の断り書きは v87 のまま。
ファイル: panel.html（L352・L374・L776-793・L957）／panel-ver.txt（88）／~/.claude/watch-notify.ps1（L1714-1740／写し .bak-20260830h）／reports/写しの一回-2.md
実測: probe で釦の字を四通り——甲/丙＝まとめて写す（20件）／丁＝読み返す（20件）／戊（新2件＋読み返し18件）＝まとめて写す（新2件＋読み返し18件）。四つとも押せて count は20。通知の数え方は台本と同じ式で三通り確かめた：upto=0→写せます（20件）／upto=1788053345→写せます（2件）／upto=1788054247→出さない。panel 構文OK、watch-notify 構文OK 2048行・BOM 有り。
実機: ①次に仕事が終わったときの知らせが「写せます（新しく終わった件数）」（20ではない）②釦の字が「まとめて写す（新N件＋読み返しM件）」（新しい分0なら「読み返す（M件）」、読み返し0なら「まとめて写す（N件）」）③押せば今までどおり全部が一本で写る（貼り付けは一回）④版の字が panel v88
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

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **52件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`パネルの整理-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-1.md) | 08-30 11:25 | パネルの整理-1 — 0件の箱を消し、跡地へ終了予定の行を置いた（panel v90） |
| [`写しの一回-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E5%9B%9E-3.md) | 08-30 11:04 | 写しの一回-3 — 読み返しをやめ、未写しの分だけにした（panel v89） |
| [`写しの一回-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E5%9B%9E-2.md) | 08-30 10:51 | 写しの一回-2 — 通知の N を新しい分だけに戻し、釦の字へ内訳を出した（panel v88） |
| [`写しの一回-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E5%9B%9E-1.md) | 08-30 10:40 | 写しの一回-1 — 一回の貼りで全部写るようにした（panel v87） |
| [`写しの独立-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%8B%AC%E7%AB%8B-4.md) | 08-30 10:37 | 写しの独立-4 — 読み返しのときの釦の字を分けた（panel v86） |
| [`途切れの回収-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%94%E5%88%87%E3%82%8C%E3%81%AE%E5%9B%9E%E5%8F%8E-1.md) | 08-30 10:36 | 途切れの回収-1 — 残っていた実の部分をやり直した |
| [`写しの独立-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%8B%AC%E7%AB%8B-3.md) | 08-30 10:25 | 写しの独立-3 — 釦が消えた原因と直し（panel v85）／通知の急ぎ-1 ④ の実測 |
| [`写しの独立-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%8B%AC%E7%AB%8B-2.md) | 08-30 05:42 | 写しの独立-2 — 済んだ札の写しを、作業の状態から切り離した（panel v84） |
| [`写しの網-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%B6%B2-1.md) | 08-30 05:36 | 写しの網-1 — 報告の札が写しに入らなかった原因と直し |
| [`札の題-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E9%A1%8C-1.md) | 08-30 05:34 | 札の題-1 — 作業中の札の題が前の仕事の名のままだった |
| [`通知の題-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E9%A1%8C-5.md) | 08-30 05:01 | 通知の題-5 — 😽 の押し送りが止まっていた原因と直し |
| [`穴の直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1.md) | 08-30 04:23 | 穴の直し-1 ①state.json の競合 — 名前つきの錠で直列にした |
| [`通知の題-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E9%A1%8C-4.md) | 08-30 04:09 | 通知の題-4 — 二字を上書きし、押し送りの🙀 も揃えた |
| [`通知の題-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E9%A1%8C-2.md) | 08-30 03:58 | 通知の題-2 — 定時の報せの題を、見張り四つの結果で決めるようにした |
| [`通知の題-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E9%A1%8C-1.md) | 08-30 03:50 | 通知の題-1 — ntfy の押し送りの題を、猫の顔ごとに変えた |
| [`欠陥調べ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AC%A0%E9%99%A5%E8%AA%BF%E3%81%B9-1.md) | 08-30 03:48 | 欠陥調べ-1 — 三つの持ち場それぞれの欠陥の棚卸し |
| [`連携の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E7%A9%B4-1.md) | 08-30 03:41 | 連携の穴-1 — Codeタブ・返事パネル・GitHub の連携の棚卸し |
| [`指示を受けた刻-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8C%87%E7%A4%BA%E3%82%92%E5%8F%97%E3%81%91%E3%81%9F%E5%88%BB-1.md) | 08-30 03:35 | 指示を受けた刻-1 — 止まっていた原因と直し |
| [`パネルと受け口-8.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%A8%E5%8F%97%E3%81%91%E5%8F%A3-8.md) | 08-30 03:26 | パネルと受け口-8 — 下の二箱を畳む対象から外した（panel v83） |
| [`写せます-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%9B%E3%81%BE%E3%81%99-1.md) | 08-29 23:28 | 写せます-1 — 作業中0件へ転じたら「写せます（N件）」を一発（甲案） |

<!-- 控えの一覧 ここまで -->
