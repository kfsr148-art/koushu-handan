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

### 1. 🕒 延びています

```
作業：返事パネル（panel.html）のヘッダ
終了予定17:29を過ぎています（経過6分）
```

### 2. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 3. ✅ 終わりました（返事不要）

```
RunCat の走る猫のコマ絵を集める（二度目の受領・回し直しで確認）
同じ枠を二度受けた。一度目（17:05 ごろ）に一本のスクリプト ~/Desktop/neko-koma-collect.js で実施済みだったので、同じスクリプトを回し直して現状を確かめた。clone 済みの二フォルダは「既に在るので clone しない」で残っており、集め直しも同じ結果。
ファイル: ~/Desktop/neko-koma-collect.js、~/Desktop/neko-koma/（99枚＋_collected.json）、~/Desktop/RunCatNeo、~/Desktop/RunnerGallery
実測: 総99枚（RunCatNeo 56＋RunnerGallery 43）。猫のコマ10枚、うちデフォルトの走りのコマは5枚で全部 56×36px（cat-frame-0〜4）。縦36px の規格は全体95枚・猫のコマ9枚が満たす。規格外は Assets_cat.png（1617×1043）ほかコマでない絵。二フォルダとも消していない。
そのまま: デフォルトの猫のコマ（コマ送りの順）
1. cat-frame-0.imageset_cat-frame-0.png   56×36px
2. cat-frame-1.imageset_cat-frame-1.png   56×36px
3. cat-frame-2.imageset_cat-frame-2.png   56×36px
4. cat-frame-3.imageset_cat-frame-3.png   56×36px
5. cat-frame-4.imageset_cat-frame-4.png   56×36px
（sleeping-cat.imageset_sleeping-cat.png 56×36px は眠りの静止絵で、走りのコマではない）
```

### 4. ✅ 終わりました（返事不要）

```
push-trace.tsv の 16:34 以降を写す
~/.claude/push-trace.tsv の 2026-08-30 16:34 以降の全12行を、この知らせの本文へそのまま写した。各札について「送った刻が読めた刻より後か」の判定も添えた。作業はしていない。
そのまま: push-trace.tsv の 2026-08-30 16:34 以降・全12行（そのまま）

【1】札の刻 epoch 1788075244（16:34:04）
  2026-08-30 16:34:12 ／ 積んだ（done） ／ 1788075244
  2026-08-30 16:37:04 ／ 読めた ／ 1788075244
  2026-08-30 16:37:05 ／ 送った ／ 1788075244
  判定: 送った刻は読めた刻より 後（＋1秒）＝**正しい順** ／ 積んだ→読めた 172秒

【2】札の刻 epoch 1788075907（16:45:07）
  2026-08-30 16:45:18 ／ 積んだ（done） ／ 1788075907
  2026-08-30 16:48:06 ／ 読めた ／ 1788075907
  2026-08-30 16:48:07 ／ 送った ／ 1788075907
  判定: 送った刻は読めた刻より 後（＋1秒）＝**正しい順** ／ 積んだ→読めた 168秒

【3】札の刻 epoch 1788076265（16:51:05）
  2026-08-30 16:51:14 ／ 積んだ（done） ／ 1788076265
  2026-08-30 16:54:04 ／ 読めた ／ 1788076265
  2026-08-30 16:54:05 ／ 送った ／ 1788076265
  判定: 送った刻は読めた刻より 後（＋1秒）＝**正しい順** ／ 積んだ→読めた 170秒

【4】札の刻 epoch 1788076984（17:03:04）
  2026-08-30 17:03:14 ／ 積んだ（done） ／ 1788076984
  2026-08-30 17:06:04 ／ 読めた ／ 1788076984
  2026-08-30 17:06:05 ／ 送った ／ 1788076984
  判定: 送った刻は読めた刻より 後（＋1秒）＝**正しい順** ／ 積んだ→読めた 170秒
```

### 5. ✅ 終わりました（返事不要）

```
途切れの回収-1 の裁定（dead・stale: も一発だけ押し送る）
新しい枝（run: のまま N 分）は裁定どおり見送り、実装していない。代わりに報告で挙げた穴を塞いだ——dead と stale: は札が立つのに押し送りが出ていなかった（状態を決める一行が空の名乗りを返し Push-Ntfy が断っていた）。watch-notify.ps1 の四箇所を直した：L514-520 に $PUSH_TITLE_BAD='🪟 異常です（手が要ります）'、L753 に印の置き場 $BadPushPath、L586-592 で bad を通して題を割り当て、L766-769 で bad は公開側を待たずにその場で出す、L1590-1621 で種類（dead/stale）の印を持ち続く間は二度目を出さない。stale: は後ろの刻が毎回変わるので鍵ではなく種類で持つ。本体にも panel.html にも触っていない。
ファイル: ~/.claude/watch-notify.ps1（L514-520・L586-592・L753・L766-769・L1590-1621／写し .bak-20260830l）、reports/途切れの回収-1-2.md
実測: 構文OK 2240行・BOM 有り。本物の判定の段（L1590〜L1621・32行）を字面のまま抜き出し、印の置き場だけ一時の場へ差し替えて十一通り回した。dead＝1回目 出る／2回目・3回目 出ない／戻ると印が落ちる／再発でまた出る。stale:＝1回目 出る／刻だけ違う2回目・3回目 出ない／戻ると印が落ちる／再発でまた出る。混在＝dead のあとの stale: は種類が違うので出る、その stale: の2回目は出ない。十一通りとも指示どおり。本物の bad-pushed.txt には触っていない。
実機: 窓が落ちたとき、または見張りの生存が途切れたとき、「🪟 異常です（手が要ります）」が一発だけ iPhone へ届くこと。放っておいても鳴り続けない。直って再発したら、また一発届く
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

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **77件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`猫の常駐-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E5%B8%B8%E9%A7%90-1.md) | 08-30 17:36 | 猫の常駐-1 — 題字の右に RunCat の猫を置いた（panel v103） |
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

<!-- 控えの一覧 ここまで -->
