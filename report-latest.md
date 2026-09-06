# 訴えの記録-1 — 記録も、種類ごとに一行だけ

**状態** … 終わり／訴えの条件・一発の道・定時の数え方・判定には触っていない

## 直した所（`pipe-check.ps1` の記録の付け方だけ）

**もとは**「訴えの顔ぶれが変わった回に、そのとき出ている**全部を書き直す**」形だった。
ひとつ増えるたびに**続いている訴えまで書き直す**ので、`cards-full` だけで26行になっていた。

**これからは種類ごとに一行。**続いている間は二行目を書かない。
**一度消えてまた出れば、そのときに新しい一行**を書く。

```
控え … pipe-warn-logged.txt（いま記録済みの種類）
出た種類のうち、控えに無いものだけ書く
全部消えた回だけ「ok 訴えは無くなった」の区切りを一行
```

## 作り値（本物の写しを砂場で回した・送り手は偽物）

```
(甲) cards-full が5回続く      → 記録 **1行**
(乙) 訴えが消えた              → cards-full は1行のまま／「ok 訴えは無くなった」が1行
(丙) 消えたあと、また出た（2回）→ 記録 **2行**（現れるたびに一行）
```

記録の中身も、そのとおりに並んだ。

```
12:56:40  cards-full  札が上限に張り付いている（40/40枚）…
12:56:42  rung        一発鳴らした：cards-full
12:57:10  ok          訴えは無くなった
12:57:13  cards-full  札が上限に張り付いている（40/40枚）…      ← 二度目の出現
12:57:14  rung        一発鳴らした：cards-full
```

## 実地と、定時の数えとの関係

本物を一回回しても**記録は増えない**（いま出ている種類は既に控えにある）。

これで**記録の行数 ＝ 種類の現れた回数**になり、
定時の「訴え: N件」（**種類の数**で数える）と**同じものを指す**ようになった。

＊定時の一行がいまも「2件（cards-full・subj-gap）」と出るのは、
　**12時間の窓に古い行がまだ残っている**ため。窓から出れば消える
　（`cards-full` の最後 03:01:31 → 15:01 以降、`subj-gap` の最後 01:31:26 → 13:31 以降）。
　**21:00 の定時では、どちらも窓の外。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **160件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`先の穴-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-2.md) | 09-05 23:15 | 先の穴-2 — 押し出した札を残し、件名を機械が書き、訴えを画面に出す |
| [`先の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-1.md) | 09-05 22:30 | 先の穴-1 — 生存を関門の外へ、訴えをその場で鳴らす |

<!-- 控えの一覧 ここまで -->

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 終わりました（返事不要）

```
写せます（1件）
```

### 2. ✅ 終わりました（返事不要）

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

### 3. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 4. 🔎 調べました

```
台帳の2件を片付け／訴えの内訳を数えた
台帳を二件片付け、訴えを種類ごとに数えた。何も直していない。
【先の穴-2-1】取下。受け口が無く塞げない——panel.html は GET だけで POST が無く、
GitHub Pages は静的。唯一の道の ntfy POST は話題名を公開ページへ書くことになる。
受け口を立てるのは土台の外の話なので取り下げた。読む側（copied.json があれば避ける）は
入れてある。
【帯の中の走り出し-1】済。①②は作り値7通りで確認したが、③実地はまだ鳴っていない。
昨夜以降、帯の中に枠が来た回が無いため。heavy-skip.log の「走り出しを鳴らした」は
00:16:18 と 00:17:16 の二件だけで、どちらも tag=test の作り値。仕掛けは入っており、
帯の中に枠が来た次の回に鳴る。
【訴えの内訳】pipe-warn.log は全40行。cards-full 26／ask-note 7／subj-gap 5／rung 2。
数え方で変わる＝全部40件／ok と heavy-skip を除いても40件（ok の行は残っていない）／
さらに rung も除くと38件／直近12時間だけなら16件。
【rung の正体】訴えではなく「訴えが出たので一発鳴らした」という控え。ところが定時の
報せの数え方は「ok と heavy-skip 以外」なので、rung も訴えとして数えられている（2件ぶん
多く出る）。直すなら数え方から rung を外すだけだが、この枠は数えるだけなので触っていない。
【束ねを失敗と数えていないか】数えていない。retry の訴えは0件、送り直しの控え
（ntfy-retry.txt）も無い。待たせた回は「送った」として返しているので上流に送り直しの控えが
立たず、retry は増えない。もし false を返していれば控えが立ち、15分後に retry の訴えに
なっていた。
【いちばん多いのは cards-full の26件】札が 40/40 に張り付いているという報せで、
09-05 09:44 から 09-06 03:01 まで条件が続く限り記録に残る（同じ種類の再送は止めたが、
記録そのものは残る）。押し出しは既に始まり、退避が16枚受けている。
ファイル: reports/訴えの内訳-1.md ／ report-latest.md ／ ~/.claude/orders-open.tsv
実測: pipe-warn.log 40行（cards-full 26／ask-note 7／subj-gap 5／rung 2）。
retry 0件・ntfy-retry.txt 無し・束ねで待たせた記録は watch-notify.log に1件。
帯の中の走り出しの実地は0件（作り値2件のみ）。
```

### 5. 🙀 異変発見だにゃ

```
状態: 手待ち / 帯の中の押し-1（帯の前に押し、帯の間も押しだけ通す）
台帳: 残り 2件（先の穴-2-1・帯の中の走り出し-1）
見張り: 生存○ 見張り×2147946720 片付け○ 受信箱○
使用量: セッション 33% / 週全体 24% / 週Fable 36%
訴え: 31件（subj-gap・ask-note・cards-full・rung）… pipe-warn.log
```

<!-- 送った知らせ ここまで -->

