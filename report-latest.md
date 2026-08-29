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
パネルと受け口-8（下の二箱を畳む対象から外す）— panel v83
panel.html L162-168 の body.busy の並びから #doneBox（終わりました N件）と #copiedBox（ヨシした数）を外し、作業中に畳むのは #btnCopyAll（お知らせの釦）と #list（その一覧）の二つだけにした。中の個別の「写す」釦は作業中のあいだ押せない形のまま。本体（koushu-handan.html）には触っていない
ファイル: panel.html（L162-168・L352・L374）／panel-ver.txt（83）／reports/パネルと受け口-8.md／report-latest.md
実測: 作業中のとき＝作業中の札・まとめて写す・終わりました N件・ヨシした数・写し取り一覧・URLを写す・版と最終確認・版の字 が「出ている」、お知らせの釦と一覧だけ「出ていない」。0件のとき＝十個すべて「出ている」。釦は 作業中「作業中、4時09分終了予定」（押せない・個別の写す5個中5個が押せない・body class="busy"）、0件「まとめて写す（5件）」（押せる・4個中0個・body class=""）。公開側 panel-ver.txt=83・panel v83・body.busy に #doneBox と #copiedBox が0件・diff 完全一致
実機: 返事パネル ── 作業中のあいだも下の「✅ 終わりました N件」と「ヨシした数 N件（ヨシ済み確認 N件）」の箱が見える（開いて中身も読める）が、中の「写す」釦は薄くて押せない／消えているのは上の「お知らせ」の釦とその一覧だけ／版の字が panel v83
```

### 2. ✅ 終わりました（返事不要）

```
写せます（20件）
```

### 3. ✅ 終わりました（返事不要）

```
写せます-1（甲案の押し送り）／台帳の刻-1（受領時刻のずれの原因・使う場所・直し・照合）
【写せます-1】甲案で watch-notify.ps1 L1600-1660 に足した。state.json の stat が作業中から外れた回だけ「写せます（N件）」を一発。印は copy-ready.txt で、作業中へ戻れば次の転じでまた一度だけ鳴る。パネルを開き直しても鳴らない。【台帳の刻-1】台帳へ書く者は機械の中に一つも無く、私が手で打っていたのが原因。触る物四つは全て読むだけ。刻の欄はパネルの「立てた HH:MM」にも出ていた。これから date で取る形にし、過去の行は真の刻が残っていないため揃え直さず、台帳へ境目の一行を残した。照合は一致0件。あわせて 被り-1 の状態の字を「済：記録のみ」へ揃え、機械の数えと合わせた（残り0件）。panel.html にも koushu-handan.html にも触っていない
ファイル: ~/.claude/watch-notify.ps1（L1600-1660）／~/.claude/orders-open.tsv（境目の一行・被り-1 の字）／reports/写せます-1.md・台帳の刻-1.md／report-latest.md／memory/ledger-time-from-clock.md
実測: 【写せます】素で試して upto=0・N=20・いまの状態は「作業中」で鳴らない（正しい）。構文OK 1941行・BOM 有り・Send-Ntfy の重複なし・写し .bak-20260830b。毎分呼び直されるので起こし直し不要。【台帳の刻】書く者0・読む者4（board-emit.ps1 L28/L52-62 は刻を使う／daily-notice.ps1 L32 と state-line.js L97-111 は件数だけ／estimates.js は今回やめた）。刻の行き先は panel.html L595・L648・L852。ずれは -14分から -357分まで広がる（一定でない）。直近20件の照合＝一致0件・一致しない18件・照合できない2件。境目の断り行は欄1つなので board-emit も state-line も飛ばすことを確認し、state-line.js の残り件数が変わらないことも確かめた。【数えの食い違い】被り-1 が「記録のみ」で始まっていたため機械の数えが1件を残していた。「済：記録のみ」へ揃えて残り0件になった
実機: iPhone ── 作業中が終わった直後（最大60秒以内）に「写せます（N件）」が届く。続けてパネルを開き直しても二度目は鳴らない。次に作業中へ入って終わったとき、また一度だけ鳴る
```

### 4. ✅ 終わりました（返事不要）

```
パネルと受け口-7（終了予定を実測から当てる・釦の字を状態から読む）— panel v82
四件とも通した。1＝estimates.js と estimates.json を足し、系統→種類→全体の順に当てて「作業中、HH時MM分終了予定」を出す。2＝元にした件数は20件。台帳の受領時刻は手打ちで4時間半ずれていて使えず、機械が打つ commit の刻の間隔を使った。3＝過ぎた刻は当てた分を足して先へ延ばす。4＝ヨシ待ちなのに作業中と出ていたのは札の題から数え直していたためで、state.json の stat から読む形へ直した。本体（koushu-handan.html）には触っていない
ファイル: panel.html（L423・L427-455・L766-793・L803-806・L884・L1018・L1934・L349・L371）／panel-ver.txt（82）／estimates.js（新規）／estimates.json（新規）／reports/パネルと受け口-7.md／report-latest.md／memory/ledger-time-from-clock.md（新規）
実測: 【台帳の刻のずれ】機械 2026-08-29 23:08:57 に対し台帳の最終行が 2026-08-30 03:40＝約4時間半先。台帳の刻で所要を出すと30件中28件が負（例 兎の攻守-1 は受領18:35・控え17:41 で -54分）。【実測の元】報告を押し出した commit の間隔から20件。系統別＝パネルと受け口85分(n1)・兎の攻守10分(n10)・兎の材料調べ9分(n7)・直し60分(n1)・被り65分(n1)。種類別＝調べ9分(n17)・本体73分(n2)・パネル65分(n1)。全体10分。【釦の字】(a)見込みあり＝「作業中、23時58分終了予定」(押せない)／(b)系統から＝「作業中、23時53分終了予定」(パネルと受け口85分)／(c)系統が無い＝「作業中、23時41分終了予定」(種類 本体73分)／(d)過ぎている＝着手300分前・当て10分・いま23時13分で「作業中、23時23分終了予定」／(e)ヨシ待ち＝「まとめて写す（4件）」(押せる・body class は空)／(f)手待ち＝同じ。【公開】panel-ver.txt=82・estimates.json は n=20/all=10・該当行すべて確認・diff 完全一致
実機: 返事パネル ── 作業中のあいだ「まとめて写す」の釦に「作業中、HH時MM分終了予定」が出る（見込みが無い回も時刻が出て、「終了予定不明」は出ない）／時刻が過ぎると次の刻へ延びる／ヨシ待ち・手待ちのときは「まとめて写す（N件）」に戻って押せる／版の字が panel v82
```

### 5. 🕒 延びています

```
パネルと受け口-5（「写せます（N件）」の押し送りの可否と手順）— 調べのみ、実装はしていない
終了予定23:09を過ぎています（経過21分）
```

<!-- 送った知らせ ここまで -->


---

---

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **36件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`パネルの写し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E5%86%99%E3%81%97-1.md) | 08-29 20:42 | パネルの写し-1 — 作業中は「まとめて写す」を止め、写しの頭へ「未了 N件」を立てる（panel v78） |
| [`直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9B%B4%E3%81%97-1.md) | 08-29 20:41 | 直し-1 — パネルの題の箱／現況の行の版／投票欄の切れ |
| [`パネルの題-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E9%A1%8C-1.md) | 08-29 20:41 | パネルの題-1 — 済んだ札の見出しを書き換えた（panel v76） |
| [`兎の攻守-10.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E6%94%BB%E5%AE%88-10.md) | 08-29 19:44 | v1430 — 兎の攻の材料を fillWeak へ移した／panel v76 見出しの書き換え |
| [`兎の攻守-9.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E6%94%BB%E5%AE%88-9.md) | 08-29 19:02 | 兎の攻守-9 — fillWeak 単独案を当てる前の確かめ（数字と写しのみ） |
| [`兎の攻守-8.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E6%94%BB%E5%AE%88-8.md) | 08-29 18:54 | 兎の攻守-8 — fillWeak と fillGood を両側へ割った（数字のみ） |
| [`兎の攻守-7.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E6%94%BB%E5%AE%88-7.md) | 08-29 18:45 | 兎の攻守-7 — 染めA（字牌を除く最多色の枚数）を測った（数字のみ） |
| [`兎の攻守-6.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E6%94%BB%E5%AE%88-6.md) | 08-29 18:35 | 兎の攻守-6 — 染めBの線を詰めた（数字のみ） |

<!-- 控えの一覧 ここまで -->
