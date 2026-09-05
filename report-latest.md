# 過去の札の件数-1 — 「🗄 過去の札」の見出しに件数を出した

**状態** … 終わり（公開側実読みまで済み）

## 入れた形

**数だけを別の一行にして置き、見出しはそれを読む。**

```
notify-record.ps1 … 札を退避するたび archive-count.txt に枚数を一行書く（押しの対象にも入れた）
panel.html v119   … 起動時に archive-count.txt を読み、見出しを「🗄 過去の札 16件 ▼」にする
```

- **本体（`notices-archive.json`）は開いたときにしか取りに行かない。**
  件数のためだけに大きい方を毎回取るのは重いので、**数だけを別に置いた**
- 0件なら「0件」。読めない回は数を出さない（見出しはそのまま）
- 箱を開けば、そのとき数え直した実数で置き換わる（`arcLabel` は実数を優先）
- **札の中身には触っていない。**数を写すだけ

## 検査と版

- `panel-check.js` の ⑰ へ三つ足した … **件数の読む元**（`archive-count.txt`）／
  **件数の控え**（`arcCount`）／**起動で件数を読む**（`loadArcCount(head, ul);`）
- 版は **v118 → v119**。`PANEL_VER` ／ `verTag` ／ `panel-ver.txt` の**三箇所を同時に**

**panel-check … 全てPASS**（⑰ は14項目とも通り、版も三箇所とも v119）。

## 公開側実読み

```
panel-ver.txt      … 119
archive-count.txt  … HTTP 200／中身「16」
panel.html         … archive-count.txt ／ arcCount ／ loadArcCount(head, ul); ／
                     var PANEL_VER = '119' ／ panel v119   … 五つとも入っている
```

## 実機で見るところ

返事パネルを開いて、下の方の箱の見出しが **「🗄 過去の札 16件 ▼」**（数入り）になっていること。
押せば過去の札が並び、見出しの数はそのときの実数に置き換わる。

## ついでに分かったこと（報告だけ）

**重い帯の間は、公開が止まる。**帯は巡回をまるごと見送るので、
**見張りの自動押しも走らない**（02:53〜03:18 の panel-check の間、02:52 の commit が公開側へ出なかった）。
帯を出た80秒後に押されて公開された。

＊直すなら「押しだけは帯の中でも走らせる」形になるが、それは関門の判じ方を変える話なので、
　ここには書くだけにする。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **155件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`根の試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A0%B9%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-05 21:57 | 根の試験-1 — 本物の pre-push を一回通して、直りを見届けた |
| [`残りの根-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AE%8B%E3%82%8A%E3%81%AE%E6%A0%B9-1.md) | 09-05 21:22 | 残りの根-1 — 今日止めた分をまとめて直した |
| [`帯の漏れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E6%BC%8F%E3%82%8C-1.md) | 09-05 20:53 | 帯の漏れ-1 — 重い帯を pre-push 自身に持たせた |
| [`飽和の回避-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1-2.md) | 09-05 18:23 | 飽和の回避-1（追補）— 札を立て直した／控えが空だった理由 |
| [`飽和の回避-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1.md) | 09-05 16:29 | 飽和の回避-1 — 重い帯だけ、起こしを間引く |

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
過去の札の件数-1（見出しに件数を出した）
「🗄 過去の札」の見出しに件数を出した。数だけを別の一行にして置き、見出しはそれを読む。
notify-record は札を退避するたび archive-count.txt に枚数を一行書き、押しの対象にも入れた。
panel v119 は起動時にそれを読んで見出しを「🗄 過去の札 16件 ▼」にする。本体
（notices-archive.json）は開いたときにしか取りに行かない——件数のためだけに大きい方を
毎回取るのは重いため。0件なら「0件」、読めない回は数を出さず見出しはそのまま。箱を開けば
そのとき数え直した実数に置き換わる。札の中身には触っていない。
panel-check の ⑰ へ三つ足した（件数の読む元・件数の控え・起動で件数を読む）。版は
v118→v119 で三箇所を同時に直した。
ファイル: panel.html（v119）／panel-ver.txt／panel-check.js（⑰へ三項目）／archive-count.txt
~/.claude/notify-record.ps1 ／ reports/過去の札の件数-1.md ／ report-latest.md
実測: panel-check 全てPASS（⑰は14項目とも通り、版も三箇所とも v119）。
公開側実読み＝panel-ver.txt が119／archive-count.txt が HTTP 200 で中身「16」／
panel.html に archive-count.txt・arcCount・loadArcCount(head, ul);・
var PANEL_VER = '119'・panel v119 の五つとも入っている。
ついでに分かったこと＝重い帯の間は公開も止まる。帯は巡回をまるごと見送るので見張りの
自動押しも走らない（02:53〜03:18 の panel-check の間、02:52 の commit が公開側へ出なかった）。
帯を出た80秒後に押されて公開された。直すなら関門の判じ方を変える話になるので報告だけ。
実機: 返事パネルの下の方の箱の見出しが「🗄 過去の札 16件 ▼」（数入り）になっていること。
押せば過去の札が並び、見出しの数はそのときの実数に置き換わる。
```

### 3. 🕒 延びています

```
過去の札の件数-1＝「🗄 過去の札」の見出しに
終了予定が未定のまま30分が経ちました
```

### 4. ✅ 終わりました（返事不要）

```
写せます（1件）
```

### 5. ✅ 終わりました（返事不要）

```
走り出しの題-1（走り出しの題に仕事の名を入れた）
走り出しの通知の題に仕事の名を入れた。題を組む所だけで、判定と札の作りには触っていない。
形＝見込みがある回は「😸 終了予定はHH時MM分ですにゃ：〈題〉」、見込みが無い回は
「😸 走り出したにゃ：〈題〉（終了予定は未定）」、名が取れない回は今までどおり。
名の取り方は終わりの題と同じで、控えの件名の括弧より前を28字まで。区切りは（ ( ＝ = の
いずれか。名の出どころは控えの件名で、読めない回は開始の時計の件名を使う。
どの回に鳴らすか・どの形（time／undef）にするかの判定は、そのまま触っていない。
ファイル: ~/.claude/watch-notify.ps1（写し .bak-20260906c）／reports/走り出しの題-1.md
report-latest.md ／ ~/.claude/orders-open.tsv
実測: 作り値4通り（本物の枝 L2225〜L2246 を字面のまま抜き出して回した・本物へは送っていない）＝
括弧つきの件名「走り出しの題-1（通知の題に仕事の名を入れる）」→
「😸 走り出したにゃ：走り出しの題-1（終了予定は未定）」／
＝つきの件名で見込み40分→「😸 終了予定は3時17分ですにゃ：通知の出口-3」／
件名が空→「😸 走り出したにゃ（終了予定は未定）」（今までどおり）／
長い件名→28字で切って入る。
実機: 次の枠を送ったときの走り出しの題に「：〈枠の題〉」が入っていること。
ただし直前に何か出ていれば60秒の束ね（通知の出口-3）で「🔔 まとめて N件」になることがあり、
その回は束ねの本文側に題が並ぶ。
```

<!-- 送った知らせ ここまで -->

