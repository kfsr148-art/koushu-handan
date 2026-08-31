# 自動検査-5 — 丙を実装（v1432）。手元も Actions も完全版で全通過

**状態：終わり（残り2件）／VAIO 2026-08-31 21:3x**

**結論** — 判定後の二択の貼り付けを **高さ349px以下から380px以下へ**広げ、667x375 で 21.3px はみ出していた
帯を塞いだ。**手元の完全版（72/72・全てPASS）**、**Actions の完全版も success（run 33391832358・3分58秒）**。
公開側も v1432 を配っていることを実読みで確認した。甲（余白削り）は指示どおり**併用していない**。

---

## ① 実装（丙のみ・規則の変更は一箇所）

`koushu-handan.html` の安全網（現 1177行）を広げた。

```diff
- @media (orientation: landscape) and (max-height: 349px) {
+ @media (orientation: landscape) and (max-height: 380px) {
    body.judged .verdict-card { overflow: visible; }
    body.judged .next-hand-row {
      position: sticky; bottom: 0; z-index: 4;
      background: linear-gradient(to bottom, rgba(13,27,22,0) 0, rgba(13,27,22,0.92) 6px);
      padding-bottom: 4px;
    }
  }
```

中身（貼り付け・地の色・カードの `overflow` 解除）は v1427 のまま一字も変えていない。
**甲（1221〜1229行の余白削り）は現状のまま。**

安全網の頭の注記へ、なぜ帯を広げたか（v1431 の折り返しが幅の条件なしで入り、埋め合わせは幅844px以上、
安全網は高さ349px以下で、**幅746〜843px × 高さ350〜380px** がどちらの網からも漏れていたこと）と、
**380px が上の切り詰めと同じ境目**であること（作法16 の連動は三つ巴から四つになる）を書き足した。

## ② 手元の完全版（`node check-all`）

21:04:44 開始 → 21:26:32 終了（**21分48秒**）。**測った組み合わせ 72/72**、`check` も `adv-check` も **全てPASS**。

| 視野 | judged の二択 bottom | |
|---|---|---|
| 568x320 | 320 / 320 | 溢れなし |
| **667x375** | **375 / 375** | **溢れなし（直った。素は396.3）** |
| 844x390 | 362.5 / 390 | 溢れなし |
| 932x430 | 382 / 430 | 溢れなし |
| 900x300 | 300 / 300 | 溢れなし |
| 900x340 | 329.8 / 340 | 溢れなし |
| 900x375 | 338.8 / 375 | 溢れなし |
| 900x381 | 339.8 / 381 | 溢れなし |

## ③ v1431 の注記への追記（261〜272行）

> ＊**667x375 は v1431 では測っていなかった**（v1432 で測った）。そこだけ二択が
> bottom=396.3 > 375 と 21.3px はみ出していた——幅844px未満なので余白削り（1221〜1229行）が
> 効かず、高さ350px以上なので当時の安全網（349px以下）にも入らない帯だったため。
> v1432 で安全網の帯を 380px まで広げて塞いだ（1177行）。同視野の実測は bottom=375.0（溢れなし）。

## ④ 版を上げて push・公開側の実読み

版は三箇所（`data-ver` ／ `verTag` ／ `ver.txt`）とも **1432**。commit `f6c548e`。

公開側を 21:28 に読み直した結果——`ver.txt` = **1432**／本体の `data-ver` = **1432**・`verTag` = **v1432**／
安全網の帯が **380px** で入っている。**新しい版が配られている。**

＊その後、注記に書いた行番号が編集後の実際とずれていたので直し、**v1433** として押した（規則は不変・注記のみ）。
公開側の `ver.txt` = **1433** を 21:32:56 に実読みで確認。**v1433 の走り 33392224036 も success（4分10秒）**。

## ⑤ Actions を完全版へ戻して実測

`check.yml` の入口を `node check-all --fast` → **`node check-all`** へ戻した（同じ commit `f6c548e`）。

| 走り | 結果 | 所要 |
|---|---|---|
| **33391832358**（v1432） | **success** | **3分58秒**（12:27:17Z → 12:31:15Z） |
| 33389165607（v1431・参考） | failure | 5分20秒。⑦の 667x375 で 8件（bottom=386.3 > 375） |

Actions 側の出力（v1432 の走り）:

```
額縁の較正 : 窓667x375で内寸667x288 → 差は 幅+0 / 高さ+87
judged 667x375    溢れなし（二択 bottom=375 / 375）
測った組み合わせ : 72 / 72（視野 568x320 667x375 844x390 932x430 900x300 900x340 900x375 900x381）
全てPASS
  PASS  check      本体の納品前チェック
  PASS  adv-check  探偵編の回帰（即死罠・時間切れ）
```

**額縁の較正が Linux でも効いている**（Windows の Edge は 幅+24/高さ+92、Actions の google-chrome は 幅+0/高さ+87）。
自動検査-2 で完全版を諦めた理由（視野がずれて 691x380 を測っていた）は消えた。

## 残り（`orders-open.tsv` の未了）

| 番号 | 中身 | いま |
|---|---|---|
| **自動検査-2-2** | 候補「黒い窓の写しの自動化（確度中）」の控えの全文を知らせの本文へ再掲（写すだけ） | **写す元が無い**。`~/.claude` の txt/tsv/md・memory・inbox・reports・git の全履歴（`-S`）まで当てて0件で、見つかったのは指示の台帳の行だけ。作り話では埋めないので、お手元の控えを貼っていただければそのまま写す |
| **自動検査-3-1** | ⑦を額縁補正から内寸基準へ（自動較正か viewport 直指定）。実測＝手元Edge完全版が全項目通る／check.yml を完全版へ戻し Actions が success・所要つき／Actions の記録で⑦の内寸が 667x375 | **三つとも満たした**（手元 72/72 全PASS／run 33391832358 success 3分58秒／Actions の記録に `judged 667x375  溢れなし`）。この報告をもって済にする |
| **自動検査-3-2** | 候補「黒い窓の写しの自動化（確度中）」の台帳・候補の控えの全文を再掲（前の枠の未了分） | 台帳の行は写せるが、**候補の控えの本文が無い**（-2-2 と同じ理由）。原文の到着待ち |

## 実機で見るところ

判定後の画面を **iPhone 横向き（667x375 相当）** で開き、末尾の二択（連チャン／親流れ）が
**画面の下に貼り付いて常に押せる**こと。版の字が **v1433**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **87件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`自動検査-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-5.md) | 08-31 21:33 | 自動検査-5 — 丙を実装（v1432）。手元も Actions も完全版で全通過 |
| [`自動検査-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-4.md) | 08-31 20:53 | 自動検査-4 — 667x375 の溢れは v1431 で入った（.next-hand-row・21.3px） |
| [`待ちの決め-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%BE%85%E3%81%A1%E3%81%AE%E6%B1%BA%E3%82%81-2.md) | 08-31 12:15 | 待ちの決め-2 — 🙋 の関門に「待ちなしの回は立てない」を実装／⑦の材料 |
| [`自動検査-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-2.md) | 08-31 12:08 | 自動検査-2 — 完全版は環境差で⑦が落ちた。緩めずに報告して速い版へ戻した |
| [`写しの食い違い-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%A3%9F%E3%81%84%E9%81%95%E3%81%84-1.md) | 08-31 11:50 | 写しの食い違い-1 — 束ねる側を数える側に合わせた（panel v104） |
| [`自動検査-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-1.md) | 08-31 09:54 | 自動検査-1 — GitHub Actions で check.js と adv-check.js を push ごとに回す |
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

<!-- 控えの一覧 ここまで -->

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 終わりました（返事不要）

```
自動検査-5（丙を実装・v1432／注記直しで v1433）— 終わり（残り2件）
①丙を実装（1177行の安全網 349px→380px・中身は v1427 のまま・甲は併用せず）②手元の完全版 21:04:44〜21:26:32（21分48秒）で 72/72・全てPASS（667x375 の二択 bottom=375/375）③v1431 の注記へ 667x375 の実測を追記 ④版を三箇所とも1432にして push（f6c548e）、公開実読みで ver.txt=1432・data-ver=1432・verTag=v1432・安全網380px を確認 ⑤check.yml を完全版へ戻して push、Actions 33391832358 が success・3分58秒。注記の行番号を実際へ直して v1433 として押し直し（公開 ver.txt=1433 を21:32:56に確認）。台帳は 自動検査-3-1 も含めて済。
ファイル: koushu-handan.html、ver.txt、.github/workflows/check.yml、reports/自動検査-5.md、report-latest.md
実測: 手元完全版 72/72 全PASS／Actions 33391832358 success 3分58秒（12:27:17Z→12:31:15Z）／Actions の較正 幅+0/高さ+87・judged 667x375 溢れなし（bottom=375/375）／公開 ver.txt=1432（21:28:15）→1433（21:32:56）
実機: 判定後の画面を iPhone 横向き（667x375 相当）で開き、末尾の二択（連チャン／親流れ）が画面の下に貼り付いて常に押せること。版の字が v1433
```

### 2. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 3. ✅ 終わりました（返事不要）

```
自動検査-5（丙を実装・v1432）— Actions の決着待ち
丙を実装（安全網の帯を 349px→380px）。甲は併用せず現状のまま。v1431 の注記へ 667x375 の実測を追記。版は三箇所とも1432。手元の完全版は21:04〜21:26で全通過（72/72・667x375 の二択 bottom=375/375）。本体・ver.txt・check.yml（完全版へ）を push（f6c548e）。公開側の実読みで ver.txt=1432・本体 data-ver=1432／verTag=v1432・安全網380px が入っていることを確認（21:28）。Actions の完全版 33391832358 は進行中。注記の行番号が編集後の実際とずれていたので直した（余白削り1221〜1229行・折り返し274行・安全網1177行）が、走りを打ち切らないよう決着後に v1433 として押す。
ファイル: koushu-handan.html（1177行の帯、注記二箇所、版三箇所）、ver.txt、.github/workflows/check.yml
実測: 手元完全版 全てPASS・72/72。公開 ver.txt=1432（21:28:15）。公開本体 data-ver=1432・verTag=v1432・安全網380px 入り
実機: 判定後の画面を iPhone 横向き（667x375 相当）で開き、二択（連チャン／親流れ）が画面の下に貼り付いて常に押せること。版の字が v1432
```

### 4. ✅ 終わりました（返事不要）

```
写せます（3件）
```

### 5. ✅ 終わりました（返事不要）

```
自動検査-5（丙を実装・v1432）— Actions と公開の実読み待ち
丙を実装（1167行の安全網を 349px→380px）。甲は併用せず現状のまま。v1431 の注記へ 667x375 の実測を追記。版は三箇所とも1432。手元の完全版 node check-all は21:04〜21:26で全通過（72/72・⑦の667x375 は bottom=375/375）。本体・ver.txt・check.yml（完全版へ）を一度に push（f6c548e）。Actions の走り 33391832358 が完全版で進行中。公開側の ver.txt が 1432 になるのも併せて見張り中。
ファイル: koushu-handan.html（1167行と注記二箇所、版三箇所）、ver.txt、.github/workflows/check.yml
実測: 手元完全版 全てPASS・72/72（judged の二択 bottom＝568x320:320／667x375:375／844x390:362.5／932x430:382／900x300:300／900x340:329.8／900x375:338.8／900x381:339.8）
実機: 判定後の画面を iPhone 横向き（667x375 相当）で開き、二択（連チャン／親流れ）が画面の下に貼り付いて常に押せること。版の字が v1432
```

<!-- 送った知らせ ここまで -->
