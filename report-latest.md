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
パネルの整理-10（上の札の左を枠の印へ）— panel v99
panel.html L2145-2156 で、作業中のときだけ件名を splitSubj()（L637-659）で「印」と「説明」に割り、左に印・右に説明を出す形にした。状態の字は札の左に出さない（下の黄色の行が受け持つ）。説明が無い件名は右を空にし、割れない形のときは印を空にして全部を右へ回す。左の字が長くなり得るので .state .w を flex:0 1 auto・max-width:50%・overflow-wrap:anywhere にした。次の指示待ち・ヨシ待ちは v98 のまま。本体には触っていない。
ファイル: panel.html（L42-46・L352・L374・L637-659・L2145-2156）／panel-ver.txt（99）／reports/パネルの整理-10.md
実測: splitSubj を五通りで確認（説明つき／印だけ／ダッシュ始まり／括弧なし／空）。probe で pullState と同じ枝を通して描かせた結果——作業中・説明つき＝左「パネルの整理-8」右「お知らせを消し、黄色の行を固定位置へ — panel v97」／作業中・印だけ＝左「パネルの整理-9」右は空／手待ち＝左「次の指示待ち」右は件名まるごと／ヨシ待ち＝左「ヨシ待ち・25分0秒」右は件名まるごと。黄色の行は三通りとも v98 のまま。panel 構文OK。
実機: 作業中のとき ①札の左が青い印で「作業中」の字が無い ②右が説明だけ（印が繰り返されていない）③状態は黄色の行が言っている ④次の指示待ち・ヨシ待ちの左は今までどおり ⑤版の字が panel v99
```

### 3. ✅ 終わりました（返事不要）

```
パネルの整理-8（お知らせを消し、黄色の行を固定位置へ）— panel v97
panel.html L203-206 の CSS で #btnCopyAll と #list を display:none にし、お知らせの釦と一覧を画面から消した（中身と記録はそのまま）。黄色の状態の行は板の中から外へ出し、L316-321 の <ul id="stLine"> へ paintStateLine()（L1075-1084）で塗る形にした。pull と pullState の両方で塗る。板は #list から切り離して <ul id="board"> へ移し、札の有無に関わらず常に塗る。道連れを二つ直した——sayWhy の出し先を #board へ（隠れた器に入れると読めない文言が消える）、押したときの受けを ['list','board'] の両方へ（板の写す釦と開閉が効かなくなるため）。本体には触っていない。
ファイル: panel.html（L203-206・L316-321・L326-329・L352・L374・L659-660・L1075-1084・L1227-1232・L1316-1318・L2146-2150・L2166-2186）／panel-ver.txt（97）／reports/パネルの整理-8.md
実測: probe で画面に出ている順を実測——header／h1／state／stLine／btnCopyBoard／board／doneBox／shotsrow／facts／verTag／usageTag／usageWhen。btnCopyAll と list はこの並びに居ない。三通りの状態でも お知らせは「出ていない」（中身は持ったまま）、黄色の行は「出ている」で字は 作業中、13時37分終了予定／次の指示待ち／ヨシを返してください。panel 構文OK。
実機: ①「お知らせ（N件）」の釦と一覧が無い ②一番上の札のすぐ下に黄色の一行が常に出ている ③その下がまとめて写す→板→終わりました ④板の写す釦と開閉が今までどおり効く ⑤版の字が panel v97
```

### 4. ✅ 終わりました（返事不要）

```
パネルの整理-7（M を直近の写せますの N へ）— panel v96
panel.html L841-857 に lastReadyCount() を置き、控えの札の本文から「写せます（N件）」のいちばん新しい数を読む形にした。釦は L868-882 で「まとめて写す（残N／M件）」。知らせが一度も出ていなければ M＝N、知らせのあとに札が増えて N>M になったときも N に揃える（残のほうが多い読めない字を出さない）。未写し0件は v92 の形を維持して釦を畳み、予定は黄色の一行が受け持つ（整理-6 の未検収はこの裁定で閉じ）。押して写る中身と通知の N は無変更。本体には触っていない。
ファイル: panel.html（L352・L374・L841-857・L868-882）／panel-ver.txt（96）／reports/パネルの整理-7.md
実測: probe で四通り（直近の写せますは2件・控えの札20枚）——未写し2枚＝「まとめて写す（残2／2件）」押せる／未写し1枚＝「まとめて写す（残1／2件）」押せる／未写し0枚＝畳んでいる／未写し5枚（M を超える）＝「まとめて写す（残5／5件）」。M は2のまま動かず N だけが減る。panel 構文OK。
実機: ①知らせの直後は「まとめて写す（残N／N件）」②一部写すと「まとめて写す（残n／N件）」で右の数は動かない ③全部写すと釦が畳まれ、作業中なら黄色の一行に終了予定 ④版の字が panel v96
```

### 5. ✅ 終わりました（返事不要）

```
パネルの整理-6（釦の字に残N／全M件）— panel v95
panel.html L843-855。釦の字を「まとめて写す（残N／全M件）」へ。N は未写し（buildBundle().count）、M は控えの札の全数（allRows.length）。押して写る中身は未写しの N だけで v89 のまま、未写し0件のときの動きも今のまま、通知の N（watch-notify.ps1）も触っていない。本体には触っていない。
ファイル: panel.html（L352・L374・L843-855）／panel-ver.txt（95）／reports/パネルの整理-6.md
実測: probe で五通り——甲（作業中・印なし）残20／全20 押せる／丙（手待ち・印なし）同じ／戊（未写し2件・写した印18件）「まとめて写す（残2／全20件）」押せる・count 2／丁（手待ち・未写し0件）畳んでいる／乙（作業中・未写し0件）畳んでいる。個別の写すは36個中0個が押せない。panel 構文OK。
実機: ①釦の字が「まとめて写す（残N／全M件）」②写したあとに残が減り全は変わらない ③押して写るのは残の分だけ ④版の字が panel v95
未検収: 未写し0件・作業中のとき、ご指示は「予定表示」だが、いまは パネルの整理-3（v92）の決めで釦を畳み、予定は黄色の一行が受け持っている。釦の側へ戻すかどうか
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

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **64件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`パネルの整理-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-1.md) | 08-30 11:25 | パネルの整理-1 — 0件の箱を消し、跡地へ終了予定の行を置いた（panel v90） |
| [`写しの一回-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E5%9B%9E-3.md) | 08-30 11:04 | 写しの一回-3 — 読み返しをやめ、未写しの分だけにした（panel v89） |
| [`写しの一回-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E5%9B%9E-2.md) | 08-30 10:51 | 写しの一回-2 — 通知の N を新しい分だけに戻し、釦の字へ内訳を出した（panel v88） |
| [`写しの一回-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E5%9B%9E-1.md) | 08-30 10:40 | 写しの一回-1 — 一回の貼りで全部写るようにした（panel v87） |
| [`写しの独立-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%8B%AC%E7%AB%8B-4.md) | 08-30 10:37 | 写しの独立-4 — 読み返しのときの釦の字を分けた（panel v86） |
| [`途切れの回収-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%94%E5%88%87%E3%82%8C%E3%81%AE%E5%9B%9E%E5%8F%8E-1.md) | 08-30 10:36 | 途切れの回収-1 — 残っていた実の部分をやり直した |
| [`写しの独立-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%8B%AC%E7%AB%8B-3.md) | 08-30 10:25 | 写しの独立-3 — 釦が消えた原因と直し（panel v85）／通知の急ぎ-1 ④ の実測 |
| [`写しの独立-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%8B%AC%E7%AB%8B-2.md) | 08-30 05:42 | 写しの独立-2 — 済んだ札の写しを、作業の状態から切り離した（panel v84） |

<!-- 控えの一覧 ここまで -->
