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
パネルの整理-6（釦の字に残N／全M件）— panel v95
panel.html L843-855。釦の字を「まとめて写す（残N／全M件）」へ。N は未写し（buildBundle().count）、M は控えの札の全数（allRows.length）。押して写る中身は未写しの N だけで v89 のまま、未写し0件のときの動きも今のまま、通知の N（watch-notify.ps1）も触っていない。本体には触っていない。
ファイル: panel.html（L352・L374・L843-855）／panel-ver.txt（95）／reports/パネルの整理-6.md
実測: probe で五通り——甲（作業中・印なし）残20／全20 押せる／丙（手待ち・印なし）同じ／戊（未写し2件・写した印18件）「まとめて写す（残2／全20件）」押せる・count 2／丁（手待ち・未写し0件）畳んでいる／乙（作業中・未写し0件）畳んでいる。個別の写すは36個中0個が押せない。panel 構文OK。
実機: ①釦の字が「まとめて写す（残N／全M件）」②写したあとに残が減り全は変わらない ③押して写るのは残の分だけ ④版の字が panel v95
未検収: 未写し0件・作業中のとき、ご指示は「予定表示」だが、いまは パネルの整理-3（v92）の決めで釦を畳み、予定は黄色の一行が受け持っている。釦の側へ戻すかどうか
```

### 3. ✅ 終わりました（返事不要）

```
パネルの整理-5（状態の表記を変える）— panel v94
黄色の行（panel.html L599-612 の stateLineText）を 手待ち→「次の指示待ち」／ヨシ待ち→「ヨシを返してください」へ替え、作業中は今までどおり終了予定のまま。上の札の左の字（L2074-2091）は手待ちだけ「次の指示待ち」にし、経過の数字を出さないようにした（作業中とヨシ待ちは今までどおり）。経過を出さない回は sinceBase を空にする——空にしないと tickSince が毎秒「手待ち・N分N秒」で上書きするため。本体には触っていない。
ファイル: panel.html（L352・L374・L599-612・L2074-2091）／panel-ver.txt（94）／reports/パネルの整理-5.md
実測: probe で三通り——作業中＝上の札「作業中」／黄色「作業中、13時19分終了予定」、手待ち＝上の札「次の指示待ち」／黄色「次の指示待ち」、ヨシ待ち＝上の札「ヨシ待ち・25分0秒」／黄色「ヨシを返してください」。毎秒の書き換え（tickSince）を一度回したあとも三通りとも字が変わらず、手待ちに数字が戻らないことを確認。黄色の色は三通りとも rgb(232,193,74)。panel 構文OK。
実機: 作業中＝上の札「作業中」・黄色「作業中、HH時MM分終了予定」／手待ち＝両方「次の指示待ち」（数字なし）／ヨシ待ち＝上の札「ヨシ待ち・N分N秒」・黄色「ヨシを返してください」。版の字が panel v94
```

### 4. ✅ 終わりました（返事不要）

```
パネルの整理-4（状態の札の高さを固定）— panel v93
一番上の状態の札の min-height を 44px から 134px へ固定した（panel.html L39-47）。値は実測から採った——今日の控えと報告の件名130件からいちばん長い題（61字）を取り、本体の幅390px（iPhone 縦持ち）で三通りを組んだときの高さが 作業中132px／手待ち110px／ヨシ待ち134px で、その最大値。min-height なので想定より長い題は折り返して伸びる（切り捨てない）。本体には触っていない。
ファイル: panel.html（L39-47・L352・L374）／panel-ver.txt（93）／reports/パネルの整理-4.md
実測: 直す前は 札の高さ44〜134px・釦の上端123〜213px で、題の長さで90px 動いていた。直したあとは九通り（三状態×最長61字/次に長い54字/最短4字）すべて 札の高さ134px・釦の上端213px で一致。115字の作り値では 204〜254px へ伸び、どれも切れなし（scrollHeight > clientHeight で判定）。headless の --window-size は内寸に効かなかった（492px）ので、本体の max-width を 390px に絞って測った。panel 構文OK。
実機: ①題が短い件でも長い件でも一番上の札の高さが変わらない（下の釦が動かない）②切れていない（題は折り返して全部出る）③版の字が panel v93。短い題のときは札の中に余白が出るが、下を動かさないための余白
```

### 5. ✅ 終わりました（返事不要）

```
この間にまとまった知らせ 2本

［✅ 終わりました（返事不要）］
パネルの整理-2（板の跡地の状態の行を三通りへ）— panel v91
この回は控えを書いていません（前の回の控えが残っています。中身は当てになりません）。

［✅ 終わりました（返事不要）］
写せます（1件）
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

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **60件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`パネルの整理-7.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-7.md) | 08-30 13:22 | パネルの整理-7 — M を「直近の写せますの N」へ差し替えた（panel v96） |
| [`パネルの整理-6.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-6.md) | 08-30 13:13 | パネルの整理-6 — 釦の字に「残N／全M件」を出した（panel v95） |
| [`パネルの整理-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-5.md) | 08-30 13:06 | パネルの整理-5 — 状態の表記を変えた（panel v94） |
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

<!-- 控えの一覧 ここまで -->
