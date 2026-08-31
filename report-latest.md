# 自動検査-4 — 667x375 の溢れは v1431 で入った（.next-hand-row・21.3px）

**状態：終わり（残り3件）／VAIO 2026-08-31 20:5x ／ 本体には触っていない**

**結論** — **v1431 が原因の版**。v1421〜v1430 は judged 667x375 の二択 bottom が **345.3 で不動**、
v1431 だけ **396.3**（＋51.0px＝投票欄が一段（44+8px）増えたぶん）で 21.3px 視野の下へ出る。
効いているのは v1431 が足した**一行だけ**（270行 `body.judged .verdict-zones .vz { flex-wrap: wrap; overflow: visible; }`）。
直しは三案を写しの上で実測し、**丙（二択の貼り付けを高さ380pxまで広げる）だけが全視野で溢れなし**。**実装はしていない。**

---

## ① 版ごとの実測（judged・内寸667x375・`.next-hand-row` の bottom）

| 版 | commit | 二択 bottom | 判定 |
|---|---|---|---|
| v1421（基準） | 402f8f1 | **345.3** | 溢れなし |
| v1422 | abf61ee | 345.3 | 溢れなし |
| v1423 | b14e513 | 345.3 | 溢れなし |
| v1424 | b00459c | 345.3 | 溢れなし |
| v1425 | 512c6da | 345.3 | 溢れなし |
| v1426 | 2e0d731 | 345.3 | 溢れなし |
| v1427 | f39bb1d | 345.3 | 溢れなし |
| v1428 | 86d5d87 | 345.3 | 溢れなし |
| v1429 | 0a04752 | 345.3 | 溢れなし |
| v1430 | d96c565 | 345.3 | 溢れなし |
| **v1431** | **8f3cc08** | **396.3** | **← 21.3px 溢れ** |

測り方は作法14「写しに probe」——`check.js` の `VIEW_PROBE` をそのまま借り、各版の本体を写しへ焼いて
judged の `.next-hand-row` の bottom だけ読む（Edge・窓691x467＝内寸667x375）。基準の v1421 が
記録どおり 345.3 で出たので、物差しは合っている。

＊一回目の一覧が全て「読めない」だったのは道具側の取り違え——`VIEW_PROBE` を字面で抜くと末尾が
`<\/script>`（JS のテンプレート用の逃がし）のままで、HTML では閉じ札にならず script が閉じない。
逃がしを戻して測り直した。

## ② 跳ねた版と、効いている箇所

**v1431（8f3cc08）「投票欄は判定後に折り返す」。** 差分は 12行追加・2行削除で、うち**規則は一行だけ**。

| 行 | 中身 | 役目 |
|---|---|---|
| **270行** | `body.judged .verdict-zones .vz { flex-wrap: wrap; overflow: visible; }` | **原因**。判定後の投票欄を**幅の条件なしで**折り返す。段が増えたぶん、下の並びがそのまま押し下がる |
| 261〜269行 | 上の一行に付いた注記 | 「568x320・844x390・745x380・1024x600 で二択は視野内」と実測が書いてあるが、**667x375 は測っていない** |
| 1202行 | `@media (orientation: landscape) and (min-width: 844px) and (min-height: 350px) {` | 折り返しの**埋め合わせ**（余白削り）の入口。**幅844px以上にしか掛からない** |
| 1211〜1219行 | `padding-top:4px` ／ `.tone-angle` `.tone-row` `.dialect-row` `.reasons` `.reason` `.judged-hand` `.judged-note` `.next-hand-row` の余白削り（実測 +23.0px ぶん） | 伸びたぶんを余白から返す。**667x375 には届かない** |
| 1167行 | `@media (orientation: landscape) and (max-height: 349px) {`（二択を画面下へ貼り付ける安全網） | **高さ349px以下だけ**。375px には掛からない |
| 260行 | `@media (max-width: 745px) { :root { --vz-show: var(--vz-show-narrow); } }`（2.5枠） | 667px は**この狭い側**。箱が狭いので折り返しの段数が増えやすい |

**要するに**、v1431 は折り返しを**全幅に**入れたのに、伸びを返す仕掛け（1211〜1219行）は**幅844px以上**、
二択を守る安全網（1167行）は**高さ349px以下**にしかない。**幅746〜843px かつ高さ350〜380px の帯だけが
どちらの網にも入らない**——667x375 がちょうどそこ（幅667は745以下の狭い側で、なお844未満）。

## ③ 直しの案（三つとも写しの上で実測。**実装はしていない**）

| 案 | 中身 | 667x375 の実測 |
|---|---|---|
| **甲** | 埋め合わせ（1211〜1219行）を幅の条件から外し、`min-height:350px` だけで効かせる | bottom=**387.8**（12.8px 溢れ）**足りない** |
| **乙** | 折り返し（270行）を幅745px以下だけに絞る | bottom=**396.3**（変わらず）——667px は**もともと745px以下**なので、この帯を外しても667には効かない |
| **丙** | 二択の貼り付け（1167行の安全網）を **高さ380pxまで**広げる | bottom=**375.0 溢れなし** |

**丙を推す。** 他の視野でも測って、崩れないことを確かめた。

| 視野 | 丙を当てた二択 bottom | 判定 |
|---|---|---|
| 568x320 | 320 | 溢れなし（今までどおり貼り付き） |
| **667x375** | **375** | **溢れなし（直る）** |
| 900x375 | 338.8（素は336.8） | 溢れなし |
| 900x381 | 339.8 | 溢れなし（380px を超えるので掛からない） |
| 844x390 | 362.5 | 溢れなし |
| 932x430 | 382 | 溢れなし |

はみ出し0件・重なり0件も併せて確認した。丙は**既にある安全網の帯を 349px から 380px へ広げるだけ**で、
新しい仕掛けを増やさない。作法16 の「判定後の縦の送りは咎めない」とも噛み合う（二択は必ず視野の内に残り、
カードの続きは送って読める）。

＊**甲と丙は併用できる。** 甲を足すと二択の裏に隠れるカードの分が 8.5px 減る。ただし甲だけでは足りない。
＊作法16 の三つ巴（`max-height:380px` の切り詰め・`min-height:350px` の折り返し・381〜383px の一組）に
　丙の 380px が**同じ境目で並ぶ**ので、入れるなら注記もそこへ足すのが筋。

**裁定を待つ。** どれを採るか決まったら実装する。



---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 終わりました（返事不要）

```
自動検査-4（667x375 の溢れの原因の版を特定）— 版ごとの実測を回し直し中
この回は控えを書いていません（前の回の控えが残っています。中身は当てになりません）。
```

### 2. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 3. 🔎 調べました

```
自動検査-3の現況の直書き
現況（フル版の完走・⑦の8件の内訳・Edge 667x375の実測）を知らせの本文へ直書きした。報告ファイルには書いていない。
そのまま: 【自動検査-3の現況】
① フル版の走り＝完走した。ただし GitHub Actions ではなく手元（VAIO・Edge）の走り——check.yml はまだ push しておらず、Actions に自動検査-3 の走りは無い。手元のフル版（node check-all）は 15:22:02 開始→15:42:35 終了、所要20分33秒、測った組み合わせ72/72、結果 FAIL 1件（check 側の⑦のみ。adv-check は全てPASS）。参考：Actions の前回の完全版の走りは run 33352419958（自動検査-2・failure・4分8秒）。
② ⑦で溢れた8件の内訳（要素は8件とも同じ .next-hand-row＝判定後の末尾の二択「連チャン／親流れ」の行。画面は8件とも判定盤の判定後（judged）で、ADVではない。内寸は8件とも667x375）
  1. 無印（既定の人柄のまま）　.next-hand-row　判定盤judged　内寸667x375　bottom=396.3　はみ出し21.3px
  2. 軍師に押し替え　.next-hand-row　判定盤judged　内寸667x375　bottom=396.3　はみ出し21.3px
  3. ずんだに押し替え　.next-hand-row　判定盤judged　内寸667x375　bottom=396.3　はみ出し21.3px
  4. お嬢様に押し替え　.next-hand-row　判定盤judged　内寸667x375　bottom=396.3　はみ出し21.3px
  5. マダムに押し替え　.next-hand-row　判定盤judged　内寸667x375　bottom=396.3　はみ出し21.3px
  6. 一姫に押し替え　.next-hand-row　判定盤judged　内寸667x375　bottom=396.3　はみ出し21.3px
  7. 先生に押し替え　.next-hand-row　判定盤judged　内寸667x375　bottom=396.3　はみ出し21.3px
  8. 執事に押し替え　.next-hand-row　判定盤judged　内寸667x375　bottom=396.3　はみ出し21.3px
  ＊八人とも同値＝見立て行の長短の差ではなく、判定後の並びそのものが常に21.3px下へ出ている。
③ Edge の 667x375 でも溢れるか＝溢れる。この8件はそもそも Edge の667x375での実測そのもの（⑦へ額縁の自動較正を入れた後の手元フル版で、実際の内寸667x375を確かめた上での bottom=396.3>375）。Actions（google-chrome・ずれた視野691x380・bottom=388.8）と同根で、環境差ではなく本体 v1431 の溢れ。他の視野は全て通る（568x320=320／844x390=362.5／900x375=336.8／900x381=339.8／932x430=382）。900x375 が通って 667x375 だけ落ちるので、幅667のときだけ判定後の並びが約60px低くなる（投票欄の折り返し）。v1421 のフル版記録では同視野の bottom=345.3 で、v1422〜v1431 のどこかで入った退行。
```

### 4. 🕒 延びています

```
自動検査-3 — 本体の溢れを発見（667x375・環境差ではない）。フル版の完走待ち
終了予定15:43を過ぎています（経過18分）
```

### 5. ✅ 終わりました（返事不要）

```
この間にまとまった知らせ 2本

［✅ 終わりました（返事不要）］
待ちの決め-2（🙋 の関門に「待ちなしは立てない」）と ⑦の材料 — 終わり（残り1件）
①watch-notify.ps1 L1415-1425 に「待ち: なし と明言した回は 🙋 を立てず run:（作業中）の扱いを続ける」枝を実装。書き分けは維持——中身あり＝🙋／なしと明言＝作業中のまま／行が無い（書き忘れ）＝🙋。実測三通りとも指示どおり。構文OK 2295行・BOM 有り・写し .bak-20260831a。②⑦の材料（項目名・検査の中身・Actions の実際の出力 ✗ judged 691x380：8件 bottom=388.8>380・環境差＝Edge の額縁 +24/+92 と google-chrome の額縁の違いで視野が 667x375→691x380 へずれる）を reports/待ちの決め-2.md と report-latest.md に明記。台帳2行を済にし、reports-index を貼り直して push 済み（origin 反映確認）。速い版へ戻したのはそのまま。
ファイル: ~/.claude/watch-notify.ps1（L1415-1425／写し .bak-20260831a）、reports/待ちの決め-2.md、report-latest.md、~/.claude/orders-open.tsv、~/.claude/yoshi-open.tsv
実測: 判定の枝 L1414-1432 を字面のまま抜き出して三通り——(a)待ちの中身あり＝wait（🙋 出る）／(b)なしと明言＝run（出ない）／(c)行が無い＝wait（🙋 出る）。PSParser 構文OK 2295行。
実機: 外の処理を待つ回（控えが 待ち: なし）で iPhone に 🙋 が来ないこと。返事が要る待ちでは今までどおり 🙋 が来ること

［✅ 終わりました（返事不要）］
写せます（2件）
```

<!-- 送った知らせ ここまで -->

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **86件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`パネルの整理-13.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-13.md) | 08-30 14:26 | パネルの整理-13 — 一番上の状態の札を消し、印を黄色の行へ移した（panel v102） |

<!-- 控えの一覧 ここまで -->
