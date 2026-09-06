# 帯の中の走り出し-1（実地）— 帯が明けた一回で、一本だけ鳴った

**状態** … 終わり（実地まで確認）

## 通した筋

```
13:22:01  帯に入った（panel-check を回すため）
13:22:26  巡回の見送り 1回目
13:24:31  **帯の中で小さな枠を受けさせた**
          reports/帯の中の試し.md に刻を一行／last-order.txt に三行（inbox-feed が書くのと同じ形）
          題「帯の中の試し（帯の中に枠が来たときに走り出しが鳴るか）」
13:27:09  **関門が控えた**（tag=watch＝実地の道）
          足跡「帯の中に始まった仕事を控えた：帯の中の試し（…）」
  〜      見送りは 18回まで続いた（巡回は一度も走っていない）
13:48:50  帯を出た
13:49:24  足跡「帯が消えたので、見送った分をここで走らせる（見送り 18回）」
13:49:27  **足跡「帯の中に始まった仕事の走り出しを鳴らした（HTTP 200）：帯の中の試し（…）」**
          関門の控えは落ちた（鳴らしたあと）
```

**鳴ったのは一本だけ**（`heavy-skip.log` の「走り出しを鳴らした」で `tag=watch` は**1件**。
ほかの2件は 00:16／00:17 の作り値＝`tag=test`）。

## 題

関門の題にも、終わりと同じ取り方で**仕事の名**を入れた（括弧より前を28字まで）。
本物の組み立てを字面のまま抜き出して回した結果。

```
控えた題 … 帯の中の試し（帯の中に枠が来たときに走り出しが鳴るか）
組んだ題 … 😸 走り出したにゃ：帯の中の試し（終了予定は未定）
枠の求めた形と … **同じ**
```

＊関門の送りは**自前**（`Invoke-WebRequest`）なので、`ntfy-sent.json` には残らない。
　残るのは足跡の「鳴らした（HTTP 200）」の一行。**題そのものは字面で確かめた。**

## 後始末

`last-order.txt` は、試しの前の中身（本物の枠）へ**戻した**。
`reports/帯の中の試し.md` は残してある（この実地の証跡）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **162件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`帯の中の走り出し-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1-2.md) | 09-06 13:51 | 帯の中の走り出し-1（実地）— 帯が明けた一回で、一本だけ鳴った |
| [`帯の中の試し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%A9%A6%E3%81%97.md) | 09-06 13:24 | 帯の中の試し |
| [`訴えの記録-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A8%98%E9%8C%B2-1.md) | 09-06 12:58 | 訴えの記録-1 — 記録も、種類ごとに一行だけ |
| [`訴えの見直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97-1.md) | 09-06 12:53 | 訴えの見直し-1 — 退避が受けている間は、上限を訴えない |
| [`訴えの数え方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E6%95%B0%E3%81%88%E6%96%B9-1.md) | 09-06 12:48 | 訴えの数え方-1 — 定時の「訴え: N件」を、種類の数にした |
| [`訴えの内訳-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E5%86%85%E8%A8%B3-1.md) | 09-06 12:25 | 訴えの内訳-1 — 31件は何を言っているか（数えただけ） |
| [`帯の中の押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-06 08:43 | 帯の中の押し-1 — 帯の前に押し、帯の間も押しだけは通す |
| [`過去の札の件数-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%81%8E%E5%8E%BB%E3%81%AE%E6%9C%AD%E3%81%AE%E4%BB%B6%E6%95%B0-1.md) | 09-06 03:22 | 過去の札の件数-1 — 「🗄 過去の札」の見出しに件数を出した |
| [`走り出しの題-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%A1%8C-1.md) | 09-06 02:39 | 走り出しの題-1 — 走り出しの題に、仕事の名を入れた |
| [`通知の出口-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-3.md) | 09-06 02:32 | 通知の出口-3 — 見張りの道にも同じ60秒の束ねを置いた |
| [`通知の出口-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-2.md) | 09-06 02:23 | 通知の出口-2 — 出口で60秒のあいだ束ねる |
| [`subj-gapの空振り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/subj-gap%E3%81%AE%E7%A9%BA%E6%8C%AF%E3%82%8A-1.md) | 09-06 01:50 | subj-gapの空振り-1 — 同じ文を違う長さで切っただけ |
| [`入口の時計-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%A5%E5%8F%A3%E3%81%AE%E6%99%82%E8%A8%88-1.md) | 09-06 01:34 | 入口の時計-1 — 入口が20秒を越えた回は、先へ進まずに降りる |
| [`入口の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%A5%E5%8F%A3%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-06 01:27 | 入口の固まり-2 — 入口が重かったのは「足跡の帳面を毎段まるごと読む」から |
| [`地図の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%B0%E5%9B%B3%E3%81%AE%E7%A9%B4-1.md) | 09-06 00:48 | 地図の穴-1 — 八段それぞれの「読む物が壊れたとき」 |
| [`作り値の送り先-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%9C%E3%82%8A%E5%80%A4%E3%81%AE%E9%80%81%E3%82%8A%E5%85%88-1.md) | 09-06 00:34 | 作り値の送り先-1 — 作り値は偽の送り手へ。今夜の分は回し直した |
| [`見張りの地図.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E5%9C%B0%E5%9B%B3.md) | 09-06 00:34 | 見張りの地図 — `watch-notify.ps1` の巡回を、段ごとに開く |
| [`帯の中の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 09-06 00:17 | 帯の中の走り出し-1 — 帯をまたいだ走り出しを、関門が持って鳴らす |
| [`走り出しの黙り-3-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3-2.md) | 09-06 00:14 | 走り出しの黙り-3（差し替え版）— 9月1日の直しは残っている。弾いていたのは手前の二つ |
| [`走り出しの黙り-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3.md) | 09-06 00:06 | 走り出しの黙り-3 — 弾いていたのは見込みではなく「開始の時計」 |

<!-- 控えの一覧 ここまで -->

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 2. ✅ 終わりました（返事不要）

```
帯の中の走り出し-1 の実地（帯が明けた一回で一本だけ鳴った）
重い検査（panel-check）を帯の中で回し、その帯の中に小さな枠を受けさせて、帯が明けた
一回で走り出しが一本だけ鳴ることを見届けた。
筋＝13:22:01 帯に入る／13:22:26 見送り1回目／13:24:31 帯の中で枠を受けさせた
（reports/帯の中の試し.md に刻を一行、last-order.txt に inbox-feed と同じ三行。題は
「帯の中の試し（帯の中に枠が来たときに走り出しが鳴るか）」）／13:27:09 関門が控えた
（tag=watch＝実地の道）／見送りは18回まで続き、巡回は一度も走っていない／13:48:50 帯を出る／
13:49:24「帯が消えたので、見送った分をここで走らせる（見送り 18回）」／
13:49:27「帯の中に始まった仕事の走り出しを鳴らした（HTTP 200）：帯の中の試し（…）」。
関門の控えは鳴らしたあとに落ちた。鳴ったのは一本だけ（tag=watch は1件、ほかの2件は
00:16／00:17 の作り値 tag=test）。
題＝関門の題にも終わりと同じ取り方で仕事の名を入れた（括弧より前を28字まで）。本物の
組み立てを字面のまま抜き出して回すと「😸 走り出したにゃ：帯の中の試し（終了予定は未定）」で、
枠の求めた形と同じ。関門の送りは自前なので ntfy-sent.json には残らず、足跡の
「鳴らした（HTTP 200）」の一行と、この字面の確かめが証跡。
後始末＝last-order.txt は試しの前の中身（本物の枠）へ戻した。reports/帯の中の試し.md は
実地の証跡として残してある。
ファイル: ~/.claude/heavy-gate.ps1（題に名を入れた）／reports/帯の中の走り出し-1-2.md
reports/帯の中の試し.md ／ report-latest.md ／ ~/.claude/orders-open.tsv
実測: 帯 13:22:01〜13:48:50（26分49秒）。枠 13:24:31／控え 13:27:09／見送り18回／
まとめ 13:49:24／鳴らした 13:49:27（HTTP 200）。tag=watch の「鳴らした」は1件。
題は「😸 走り出したにゃ：帯の中の試し（終了予定は未定）」。
```

### 3. 🪟 連携に訴えがあります（subj-gap）

```
連携の見張りから訴えが出ています。

・subj-gap … 作業中の件名が食い違っている（控え「帯の中の走り出し-1の実地＝次に重い検査（panel-checkかcheck-a」／出ている「帯の中の試し（帯の中に枠が来たときに走り出しが鳴」）

＊同じ種類が続く間は、これ以上鳴らしません。
＊全部の記録は ~/.claude/pipe-warn.log にあります。
```

### 4. ✅ 終わりました（返事不要）

```
写せます（1件）
```

### 5. ✅ 終わりました（返事不要）

```
訴えの記録-1（記録も種類ごとに一行だけ）
pipe-check の記録の付け方だけを直した。訴えの条件・一発の道・定時の数え方・判定には
触っていない。
もとは「訴えの顔ぶれが変わった回に、そのとき出ている全部を書き直す」形で、ひとつ増える
たびに続いている訴えまで書き直していた（cards-full だけで26行になっていた原因）。
これからは種類ごとに一行で、続いている間は二行目を書かない。一度消えてまた出れば、
そのときに新しい一行を書く。全部消えた回だけ「ok 訴えは無くなった」の区切りを一行残す。
控えは pipe-warn-logged.txt（いま記録済みの種類）。
これで記録の行数＝種類の現れた回数になり、定時の「訴え: N件」（種類の数）と同じものを
指すようになった。
定時の一行がいまも2件と出るのは、12時間の窓に古い行が残っているため。cards-full の最後は
03:01:31（15:01以降に窓の外）、subj-gap の最後は 01:31:26（13:31以降）。21:00 の定時では
どちらも窓の外になる。
ファイル: ~/.claude/pipe-check.ps1（写し .bak-20260906c）／reports/訴えの記録-1.md
report-latest.md ／ ~/.claude/orders-open.tsv
実測: 作り値（本物の写しを砂場で回し、送り手は偽物）＝cards-full が5回続く→記録1行／
訴えが消えた→cards-full は1行のまま・「ok 訴えは無くなった」が1行／また出た（2回）→記録2行。
実地＝本物を一回回して記録41行→41行で増えない。いま控えている種類は無し
（cards-full は退避が働いているので止まり、subj-gap は切り違いを直したので出ない）。
```

<!-- 送った知らせ ここまで -->

