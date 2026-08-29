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
通知の題-5（😽 の押し送りが止まっていた原因と直し）
原因は通知の題-1〜4 ではなく、写せます-1 で足した ready の知らせだった。done（終わり）と ready（写せます）が60秒の溜めに一緒に入り、まとめて出す段（Flush-Held）が名乗りまで最後の一本＝ready のものを使っていたため、押し送りが Push-Ntfy L575 で断られていた。パネルには札が立つのに iPhone が鳴らない形。watch-notify.ps1 L866-885 で、名乗りは溜まっている中のいちばん強い一つ（over>wait>done>その他）を採るようにした。題・重み・印は今までどおり最後の一本。試し送り一本を HTTP 200 で出した。
ファイル: ~/.claude/watch-notify.ps1（L866-885／写し .bak-20260830e）、reports/通知の題-5.md
実測: watch-notify.log の 04:28:10「押し送りはしない（送る状態でない: ready）」＝送る処理へ入る前に断られており、ntfy への通信は一度も起きていない。直した選び方を六通りで確認——done→ready は ready から done へ直り押し送りが出る／ready 一本だけは今までどおり出ない／done→wait は wait のまま。試し送りは題「😽 終わったにゃ、写して」・Title ヘッダ =?UTF-8?B?8J+YvSDntYLjgo/jgaPjgZ/jgavjgoPjgIHlhpnjgZfjgaY=?=・HTTP 200・宛先の末尾 ue6i。構文OK 1971行・BOM 有り。通知の題-4 は済（実機の証しは 4:21 に届いた 🙀 異変発見だにゃ）。
実機: いま届いているはずの試し送りの題が「😽 終わったにゃ、写して」・本文が「試し送りです（通知の題-5）。」。次に仕事が終わったとき、写せますと一緒に溜まっても 😽 が届くこと。

［✅ 終わりました（返事不要）］
写せます（20件）
```

### 2. 🕒 延びています

```
通知の題-4（二字の上書きと、押し送りの🙀 の揃え）
終了予定04:17を過ぎています（経過9分）
```

### 3. ✅ 終わりました（返事不要）

```
写せます（20件）
```

### 4. ✅ 終わりました（返事不要）

```
通知の題-2（定時の報せの題を見張り四つの結果で決める）
daily-notice.ps1 L116 の「🕘 定時の報せ」を、見張り四つが全部○なら「😺 平気だにゃ」、一つでも○でなければ「🙀 なんか変だにゃ、見て」へ替えた（L116-127）。本文は無変更。？（数えられなかった）は○ではないので🙀の側へ入れた——読めないことを「平気」と言わないため。🙀の字は通知の題-1 の $PUSH_TITLE_OVER と同じにしてある。
ファイル: ~/.claude/daily-notice.ps1（L116-127／写し .bak-20260830）、reports/通知の題-2.md、report-latest.md、~/.claude/orders-open.tsv
実測: ○は -DryRun で本物を回して確認（題「😺 平気だにゃ」／見張り: 生存○ 見張り○ 片付け○ 受信箱○）。×は同じ式へ印を与えて三通り組み、いずれも「🙀 なんか変だにゃ、見て」。Title ヘッダは 😺 が =?UTF-8?B?8J+YuiDlubPmsJfjgaDjgavjgoM=?=、🙀 が =?UTF-8?B?8J+ZgCDjgarjgpPjgYvlpInjgaDjgavjgoPjgIHopovjgaY=?=。構文OK 161行・BOM 有り。
実機: 次の定時の報せ（09:00）の題が「😺 平気だにゃ」になっていること（「🕘 定時の報せ」ではない）。本文の四行は今までどおり。
```

### 5. ✅ 終わりました（返事不要）

```
この間にまとまった知らせ 2本

［✅ 終わりました（返事不要）］
四枠まとめ（指示を受けた刻-1／連携の穴-1／欠陥調べ-1／通知の題-1）
四枠すべて済。①指示を受けた刻-1＝フックが標準入力を ANSI(932) で読んでおり日本語の枠を一件も解けていなかった。生の byte を UTF-8 で解く形へ直し、黙る catch もやめた。②連携の穴-1＝常駐・競合・push・Pages・受領・時計の六項目を棚卸し（数えただけ）。③欠陥調べ-1＝パネル・受け口・リポジトリの八項目を棚卸し（数えただけ）。④通知の題-1＝押し送りの題を猫の顔ごとの字へ変えた。
ファイル: ~/.claude/inbox-feed.ps1（L60-80／写し .bak-20260830b）、~/.claude/watch-notify.ps1（L501-511／写し .bak-20260830c）、reports/指示を受けた刻-1.md、reports/連携の穴-1.md、reports/欠陥調べ-1.md、reports/通知の題-1.md、report-latest.md、~/.claude/orders-open.tsv
実測: 【フック】直した後 last-order.txt・state.json の orderAt・hook.log の三つが同じ秒（03:29:37）で動いた。構文OK 167行・BOM 有り。【Pages】push→反映は通った8件で最小42／中央49／最大63秒。全件で built 1743・errored 685（約28%）。【常駐】予定表6・常駐1・フック4種。見張りの無いもの7つ。分の単位で気づくのは生存の途切れ一つだけ。【競合】state.json だけが二者（inbox-watch L469 と inbox-feed L122-134）・排他なし・後勝ち。【パネル】2073行・関数99件。使われていない関数2件（todayText L672・noticesText L731）。届かない分岐0件。fetch 9箇所すべてに catch あり。【リポジトリ】215ファイル・pack 165.4MB。遊ぶ人に要らない物が25ファイル32.0MB。【題】構文OK 1944行・BOM 有り。
実機: 次に届く押し通知の題が「😼 ヨシ頼むにゃ」／「😽 終わったにゃ、写して」／「🙀 なんか変だにゃ、見て」に変わっていること（「返事パネル」ではない）。返事パネルの一覧の字は変わらない。

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

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **44件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`パネルと受け口-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%A8%E5%8F%97%E3%81%91%E5%8F%A3-3.md) | 08-29 21:23 | パネルと受け口-3 — 作業中は帯を畳む／釦の字／指示を受けた刻（panel v81） |
| [`パネルと受け口-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%A8%E5%8F%97%E3%81%91%E5%8F%A3-1-2.md) | 08-29 21:16 | パネルと受け口-1（二度目）— 釦の字に終了予定を出す（panel v80） |
| [`パネルと受け口-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%A8%E5%8F%97%E3%81%91%E5%8F%A3-1.md) | 08-29 20:58 | パネルと受け口-1 — 写しの一行目・指示を受けた刻・同じ印の二度受け |
| [`報告の残し方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A0%B1%E5%91%8A%E3%81%AE%E6%AE%8B%E3%81%97%E6%96%B9-1.md) | 08-29 20:42 | 報告の残し方-1 — 報告を印ごとに reports/ へ残す |

<!-- 控えの一覧 ここまで -->
