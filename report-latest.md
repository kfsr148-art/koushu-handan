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
この間にまとまった知らせ 2本

［✅ 終わりました（返事不要）］
パネルの整理-2（板の跡地の状態の行を三通りへ）— panel v91
この回は控えを書いていません（前の回の控えが残っています。中身は当てになりません）。

［✅ 終わりました（返事不要）］
写せます（1件）
```

### 2. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 3. ✅ 終わりました（返事不要）

```
使用量の配分-1（定時の報せへ1日あたりの%の一行）
daily-notice.ps1 L116-166 に、残り% ÷ 次のリセットまでの残り日数（端数含む）で「1日あたり使ってよい%」を出す節を足した。本文の五行目へ「配分: 全体 あとN%/日 ／ Fable あとM%/日」。出どころは usage.json の body.limits（パネルが読むのと同じ一枚）の weekly_all と weekly_scoped(Fable)。読めない・欠ける・resets_at が過ぎている場合は行を出さない。出す回は (Get-Date).Hour -ge 18 の夕方だけ。併せて台帳の落とし忘れ（通知の急ぎ-1 の①②③）を済にした。
ファイル: ~/.claude/daily-notice.ps1（L116-166／写し .bak-20260830c）、reports/使用量の配分-1.md、~/.claude/orders-open.tsv
実測: いまの値で 残り日数1.351日（32.4時間）・週全体81%→残り19%・週Fable58%→残り42% → 「配分: 全体 あと14.1%/日 ／ Fable あと31.1%/日」。朝の回は -DryRun の実物で配分の行が付かないことを確認。構文OK 210行・BOM 有り。予定表の起点は 09:00 と 21:00 で、20:00 の回は無い（18時以降の回で当てている）。
未検収: 20:00 へ動かすかどうか。いまの夕方の回は 21:00。週のリセットが 20:00（現地）なので、20:00 に出すとリセット直前の値、21:00 のままだとリセット日だけリセット直後の値になる
```

### 4. ✅ 終わりました（返事不要）

```
パネルの整理-1（0件の箱を消し、跡地へ終了予定の行）— panel v90
panel.html L607-635 で「あなた待ちは0件」の箱を出さない形にした（有るときの表紙・写す釦・開いた中身はそのまま）。跡地には L637-644 で、作業中のときだけ「作業中、HH時MM分終了予定」の字だけの一行（li.why）を置いた。字の組み立ては endPredText()（L568-588）へ寄せ、釦（L824-826）も同じ関数を呼ぶ形にした——二箇所で作るとずれるため。まとめて写すの釦は v89 のまま（未写しが有れば作業中でも押せる）。本体には触っていない。
ファイル: panel.html（L352・L374・L513-515・L568-588・L607-644・L824-826）／panel-ver.txt（90）／reports/パネルの整理-1.md
実測: probe で板の跡地の並びを三通り——作業中＝［why｜作業中、11時34分終了予定］＋［ack board｜直近に終わった仕事（3件）］／手待ち＝［ack board｜直近に終わった仕事（3件）］のみ／あなた待ち1件（作り値）＝［why ack board｜あなた待ち（1件）写す 1. 試しの待ち（裁定待ち）印 y-test…］が先頭に出る。釦は五通りとも v89 のまま（作業中・未写し20件＝まとめて写す（20件）押せる／作業中・未写し0件＝作業中、11時34分終了予定）。個別の写すは34個中0個が押せない。構文OK。
実機: 未写しが0件になって板の跡地が出ている画面で、①「あなた待ちは0件」の箱が無い（ヨシ待ちが立っているときだけ「あなた待ち（N件）」が出る）②作業中ならその位置に「作業中、HH時MM分終了予定」の字だけの一行がある ③手待ちならその行も無く、いきなり「直近に終わった仕事（3件）」から始まる ④まとめて写すの釦は今までどおり ⑤版の字が panel v90
```

### 5. ✅ 終わりました（返事不要）

```
写せます（3件）
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

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **57件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`パネルの整理-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-4.md) | 08-30 12:59 | パネルの整理-4 — 一番上の状態の札の高さを固定した（panel v93） |
| [`控えの穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8E%A7%E3%81%88%E3%81%AE%E7%A9%B4-1.md) | 08-30 12:06 | 控えの穴-1 — 控えが書かれなかった理由と、届かなかった実測の出し直し |
| [`パネルの整理-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-3.md) | 08-30 12:03 | パネルの整理-3 — 二段になっていた予定表示の、釦の側を外した（panel v92） |
| [`パネルの整理-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-2.md) | 08-30 11:58 | パネルの整理-2 — 状態の行を三通りにした（panel v91） |
| [`使用量の配分-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-1.md) | 08-30 11:36 | 使用量の配分-1 — 定時の報せへ「1日あたり使ってよい%」の一行を足した |
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

<!-- 控えの一覧 ここまで -->
