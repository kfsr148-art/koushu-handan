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
通知の走り出し-1（😸 終了予定はHH時MM分ですにゃ・一発）
元の枠を正として実装した。watch-notify.ps1 の四箇所——L521-525 の $script:startTitle、L590-601 で start を通す関門、L763-766 の印（start-pushed.txt・件名＋開始の刻）、L1702-1731 の判定と送信。run: になり見込みから終了予定が計算できた最初の一回に一発だけ。毎巡回る判定なので未定で走り出した仕事は定まった最初の一回に自然に出る。Push-Ntfy を直に呼び公開側を待たない（bad 系と同じ）。Record-Notice を通さないので札は立たず写せますの数も汚さない。計算は開始＋見込み分でパネル L2212 と同値、形は時は素・分は二桁で endPredText と同じ。文言は訂正どおり「ですにゃ」。
ファイル: ~/.claude/watch-notify.ps1（L521-525・L590-601・L763-766・L1702-1731／写し .bak-20260830m）、reports/通知の走り出し-1.md
実測: 構文OK 2284行・BOM 有り。本物の判定の段（L1702-1731・30行）を字面のまま抜き出し作り値で回した——見込みあり（開始20:32・25分）＝1巡目に一発「😸 終了予定は20時57分ですにゃ」・2/3巡目なし／見込み未定＝1・2巡目黙り・30分が定まった3巡目に一発「21時10分」・4巡目なし／仕事が替わると（見込み10分）また一発「21時15分」。印の置き場は一時の場に差し替え、本物の start-pushed.txt にも ntfy にも触れていない。
実機: 次に枠を送って作業が始まったとき「😸 終了予定はHH時MM分ですにゃ」が一発だけ届き、その刻が返事パネルの黄色の行の終了予定と同じ数字であること
```

### 3. 🙋 ヨシしてください

```
通知の走り出し-1（元の枠が二度とも未着。設計の裁定待ち）
印: y0830-hashiri
待っているのは：通知の走り出し-1 の元の枠の再送、または下の推しの設計へのヨシ。訂正（本文「😸 終了予定はHH時MM分ですにゃ」）は二度届いたが、元の枠はどちらの間にも届いていない（hook.log で確認：19:38→19:46 の間・19:53→20:21 の間に受信なし。台帳にも0件）
答え方：「y0830-hashiri にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
そのまま: 【推しの設計（ヨシで進める場合の中身）】
・いつ … 状態が「作業中」へ入った回（鍵が run: へ変わった巡回）に一発だけ。同じ作業では二度出さない
・何を … 押し送りの本文＝「😸 終了予定はHH時MM分ですにゃ」（HH:MM は 開始＋見込み。パネルの終了予定と同じ値）
・見込みが無い回 … 出さない（「終了予定は未定ですにゃ」は出さない。誤った数字を出さない決まりに合わせる）
・待ち方 … 公開側は待たずにその場で出す（走り出しの知らせは速さが値打ちのため）
・出し先 … watch-notify.ps1（😼😽🙀 と同じ道・Send-Ntfy）
答え方：「y0830-hashiri にヨシ」で上の設計のまま実装します。元の枠を再送いただければ、そちらを正として実装します。
```

### 4. ✅ 終わりました（返事不要）

```
写せます（3件）
```

### 5. ✅ 終わりました（返事不要）

```
使用量の配分-2 の続き（usage-widget.js へボーダーの行）
usage-widget.js L77-97 に borderPct() を実装し、週全体と週Fable の両行へ「20:00まで N%」を添えた（戻るまでの左）。式は直近リセット刻（resets_at−7日）からの経過24時間の数×100÷7。古い「19:59まで」の引き方は採らず一から書いた。実物の resets_at に小数秒が乗り（.469s）二つの物差しで約1秒ずれてもいたため、分へ丸めて境目の1日ずれと二行の食い違いを同時に塞いだ。前の枠で未了にしていた ② もこれで済にした。本体にも panel.html にも触っていない。
ファイル: usage-widget.js（L77-97・L182-189）、reports/使用量の配分-2-2.md、~/.claude/orders-open.tsv
実測: 二つの resets_at の両方で——今日8/30 20:00＝85.7%／明日8/31 20:00＝100%／いま19:48＝71.4%（参考値）、すべて同値。丸める前は今日20:00 が 71.4% と1日ずれていた。公開側は HTTP 200・手元と完全一致。module として node --check OK（199行）。
実機: iPhone の Scriptable で公開の台本（…/usage-widget.js）へ一度だけ貼り替え。貼り替え後、①週全体・週Fable の行に「20:00まで N%」（今夜20:00を過ぎると85.7%）②二行の N が同じ値 ③古い「19:59まで」の行が消えている
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

---

---

---

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **81件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`使用量の配分-2-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-3.md) | 08-30 20:42 | 使用量の配分-2 の訂正 — ボーダーの式を切り上げへ |
| [`通知の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 08-30 20:30 | 通知の走り出し-1 — 仕事が始まったら「😸 終了予定はHH時MM分ですにゃ」を一発 |
| [`使用量の配分-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-2.md) | 08-30 19:52 | 使用量の配分-2 の続き — usage-widget.js へボーダーの行を実装した |
| [`使用量の配分-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2.md) | 08-30 19:42 | 使用量の配分-2 — 「19:59まで N%」の行は VAIO の側に無い。名と場所を報告して止まる |
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

<!-- 控えの一覧 ここまで -->
