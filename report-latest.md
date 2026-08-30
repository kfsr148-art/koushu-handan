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
写せます（20件）
```

### 2. ✅ 終わりました（返事不要）

```
写しの独立-3（釦が消えた件の直し）— panel v85 ／ 通知の急ぎ-1 ④ の実測
【写しの独立-3】v84 の「0件かつ手待ちなら畳む」が効いていた。N は誤っておらず、写した印が全部の札に付いていて未写しが0枚だった。ご覧の14件は「終わりました」の箱（写した印の付いた札）で、v84 の N はそれを数えていなかった。panel v85 で、未写しが0件なら終わりましたの箱を読み返しで写す形にした（L920-931）。頭に「読み返し N件：…」の断り書きを立てる（L933-937）。順は未写しが先・読み返しが後。畳むのは両方0件のときだけ。三件の札の行方も調べ、穴の直し-1① は置き換えで消え、写しの網-1・札の題-1 はそもそも作られていなかった（応答が途切れず run: のままだったため）。【通知の急ぎ-1 ④】釦が開いてから通知が届くまでを実測した。
ファイル: panel.html（L352・L374・L920-931・L933-937）／panel-ver.txt（85）／reports/写しの独立-3.md
実測: probe で四通り。直す前は 丁（手待ち・全部に写した印）＝shown 0枚・釦「まとめて写す（0件）」押せない・畳んでいる・終わりました14件。直したあとは 丁＝「まとめて写す（14件）」押せる・出ている・個別の写す34個中0個が押せない。読み返しの写しは5373字・14件で、二行目が「読み返し 14件：未写しは0件なので、終わりましたの箱をそのまま写します」。【急ぎ】T1＝05:46:04（state.json が手待ちになった commit 36ab079 の Pages 組み立て終了＝釦が開く刻）、T2＝05:47:08（押し送りOK HTTP 200）、間隔64秒。溜めの60秒は消えた（05:45:11 積む→05:45:12 同じ回で出す）。残る待ちは控えが公開側に出るまでの分。
実機: 手待ちで全部写したあと、①「まとめて写す（14件）」が出ていて押せる（釦が消えていない）②押すと写しの二行目が「読み返し 14件：未写しは0件なので、終わりましたの箱をそのまま写します」③版の字が panel v85
```

### 3. 😺 現在も順調にゃ

```
状態: 手待ち / 写しの独立-2（済んだ札の写しを作業の状態から切り離す）— pane…
台帳: 残り 9件（穴の直し-1-2・穴の直し-1-3・通知の宛先-1-1・通知の宛先-1-2・通知の宛先-1-3・通知の急ぎ-1-1）
見張り: 生存○ 見張り○ 片付け○ 受信箱○
使用量: セッション 0% / 週全体 79% / 週Fable 56%
```

### 4. ✅ 終わりました（返事不要）

```
写しの独立-2（済んだ札の写しを作業の状態から切り離す）— panel v84
panel.html を v84 に。①L162-168 の body.busy で畳む決まりを外した（作業中でもお知らせの釦と一覧を出す）②L763-826 で釦の順序を「写すが先、予定表示が後」へ——写せる札が1件以上なら作業中でも「まとめて写す（N件）」を出して押せる、0件になって初めて「作業中、HH時MM分終了予定」の押せない形へ、作業中でなく0件なら畳む ③L822-825 で個別の写すを常に押せる形に ④L899-909 で写しの頭の一行を「未了 N件：（題）…」から「作業中 1件：（印）」へ ⑤L928 で板の行を count から外し、N＝写る札の数に揃えた。本体（koushu-handan.html）には触っていない。
ファイル: panel.html（L162-168・L352・L374・L763-826・L899-909・L928）／panel-ver.txt（84）／reports/写しの独立-2.md
実測: 作法14 の probe で両方の状態を取った。甲＝釦「まとめて写す（20件）」押せる・畳んでいない・個別の写す35個中0個が押せない・お知らせの一覧 出ている・body の class は空。乙（shown を空にして組み直し）＝釦「作業中、5時46分終了予定」押せない・count 0。数の一致は shown 20枚／todo 20枚／count 20 の三つとも同じ（v83 までは札20枚に対して count 23）。写しの文は甲5130字・乙340字を報告へ写した。構文検査は script を切り出して node --check で OK。
実機: 作業中のまま、①「まとめて写す（N件）」が出ていて押せる ②お知らせの釦と一覧が出ている ③個別の「写す」が押せる ④全部写したあと釦が「作業中、HH時MM分終了予定」に変わって押せなくなる ⑤写した文の二行目が「作業中 1件：（いまの件の印）」 ⑥版の字が panel v84
```

### 5. ✅ 終わりました（返事不要）

```
この間にまとまった知らせ 2本

［✅ 終わりました（返事不要）］
通知の題-5（😽 の押し送りが止まっていた原因と直し）
原因は通知の題-1〜4 ではなく、写せます-1 で足した ready の知らせだった。done（終わり）と ready（写せます）が60秒の溜めに一緒に入り、まとめて出す段（Flush-Held）が名乗りまで最後の一本＝ready のものを使っていたため、押し送りが Push-Ntfy L575 で断られていた。パネルには札が立つのに iPhone が鳴らない形。watch-notify.ps1 L866-885 で、名乗りは溜まっている中のいちばん強い一つ（over>wait>done>その他）を採るようにした。題・重み・印は今までどおり最後の一本。試し送り一本を HTTP 200 で出した。
ファイル: ~/.claude/watch-notify.ps1（L866-885／写し .bak-20260830e）、reports/通知の題-5.md
実測: watch-notify.log の 04:28:10「押し送りはしない（送る状態でない: ready）」＝送る処理へ入る前に断られており、ntfy への通信は一度も起きていない。直した選び方を六通りで確認——done→ready は ready から done へ直り押し送りが出る／ready 一本だけは今までどおり出ない／done→wait は wait のまま。試し送りは題「😽 終わったにゃ、写して」・Title ヘッダ =?UTF-8?B?8J+YvSDntYLjgo/jgaPjgZ/jgavjgoPjgIHlhpnjgZfjgaY=?=・HTTP 200・宛先の末尾 ue6i。構文OK 1971行・BOM 有り。通知の題-4 は済（実機の証しは 4:21 に届いた 🙀 異変発見だにゃ）。
実機: いま届いているはずの試し送りの題が「😽 終わったにゃ、写して」・本文が「試し送りです（通知の題-5）。」。次に仕事が終わったとき、写せますと一緒に溜まっても 😽 が届くこと。

［✅ 終わりました（返事不要）］
写せます（20件）
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

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **48件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`台帳の刻-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%B0%E5%B8%B3%E3%81%AE%E5%88%BB-1.md) | 08-29 23:28 | 台帳の刻-1 — 受領時刻のずれの原因・使っている場所・直し・照合 |
| [`パネルと受け口-7.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%A8%E5%8F%97%E3%81%91%E5%8F%A3-7.md) | 08-29 23:15 | パネルと受け口-7 — 終了予定を実測から当てる／釦の字を状態から読む（panel v82） |
| [`パネルと受け口-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%A8%E5%8F%97%E3%81%91%E5%8F%A3-5.md) | 08-29 22:48 | パネルと受け口-5 — 「写せます（N件）」の押し送りの可否と手順（実装はしていない） |
| [`パネルと受け口-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%A8%E5%8F%97%E3%81%91%E5%8F%A3-2.md) | 08-29 21:23 | パネルと受け口-2 — 個別の写すを止める／釦の字／指示を受けた刻 |

<!-- 控えの一覧 ここまで -->
