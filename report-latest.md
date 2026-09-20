# 公開側40枚の「写せます（N件）」の札は、パネルで使われているか

**終わり（残り0件）** — 2026-09-20 19:5x（VAIO）。**調べだけ。直しは入れていない。**
`koushu-handan.html`・`stable`・見張りの台本には触っていない。

## 答え … **使われていない**（釦にも数にも目次にも入っていない）

| パネルの所 | 「写せます（N件）」の扱い | 行 |
|---|---|---|
| 一覧に並べる札 | **入れない**（`if (/写せます（/.test(…)) { return; }` ＝「数だけの札は仕事ではない」） | **L842** |
| 「まとめて写す（残N／M件）」の **N** | 写した印の無い**中身のある札の数**。写せますの札は数えない | L1231 付近 |
| 同じ釦の **M**（分母） | **v117 で `M = N` に統一**。`lastReadyCount()`（＝写せますの札の数）を**使うのをやめた** | **L1248** `var m = n;` |
| `lastReadyCount()` そのもの | **定義は残っているが、呼んでいる所は一つも無い**（字面で確認） | L1167 |
| 目次・件数 | **入れない**（v116 の裁定「三つとも、写した印の無い中身のある札の数で統一」） | L1349 |

＊`lastReadyCount()` は **v116 の直しの取りこぼしで残った抜け殻**（註にもそう書いてある）。

## いまの公開側の中身（実読み）

| | 値 |
|---|---|
| 公開の `notices.json` | **40件** |
| うち本文が「写せます（N件）」だけの札 | **4件（10%）** … 19:05:39「写せます（1件）」／18:00:40「（2件）」／16:37:39「（3件）」ほか |

**40枚のうち1割が、読む中身を持たない札**で埋まっている（その分だけ古い報告が押し出される）。

## 直し方と代償（**まだ入れていない**）

| 案 | 中身 | 代償 |
|---|---|---|
| **甲** 「写せます（N件）」の札を**出すのをやめる** | 公開側も押し送りも、数だけの札が消える | **iPhone が「写す物がある」と気づけなくなる**。この札は押し送りの合図も兼ねていて、鳴らす役がある（＝いちばん失うものが大きい） |
| **乙** 押し送りだけにして、**公開側（notices.json）には控えない** | 鳴る役は残り、40枚は中身のある札だけになる | 画面の一覧にも残らないので、**「いつ写せますと言ったか」を後から辿れない**（`notify-sent.tsv` には残るので、綴りを見れば辿れる） |
| **丙** 控えは残し、**40枚の並びに入れるときだけ外す**（`notify-record.ps1` 側で判じる） | 鳴る役も辿る道も残り、公開の40枚は中身のある札だけになる | `notify-record.ps1` に**例外の判じが一つ増える**。同じ形の「数だけの札」が将来増えたとき、**その都度この判じを足す**ことになる（見落とすと同じ詰まりが戻る） |

**こちらの見立て** … **丙**（失う物が無く、公開の40枚だけが綺麗になる）。乙は辿り道が綴りだけになる。甲は鳴る役を失うので採らない。
＊**抜け殻の `lastReadyCount()`** は、どの案を採るかに関わらず**消してよい**（呼び手が無い）。消すなら panel の版を上げる回に一緒に。

## 触った所と触らない所

**触った所** … 無し（読みと実読みだけ）。報告と控えのみ。
**触らない所** … `panel.html`・`watch-notify.ps1`・`notify-record.ps1`・`koushu-handan.html`・`stable`。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **328件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1945.md) | 09-20 19:20 | 公開側40枚の「写せます（N件）」の札は、パネルで使われているか |
| [`y0920-1930.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1930.md) | 09-20 19:18 | 「延びています」の時計を、宣言のヨシ待ちの間は止めた |
| [`y0920-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1915.md) | 09-20 19:14 | report-latest.md はどこに書いているか／写しを機械の手にした |
| [`y0920-1900-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1900-2.md) | 09-20 19:03 | 同じ字の枠の二度目は、走り直さず一度目の札を出し直す |
| [`y0920-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1900.md) | 09-20 18:50 | 札抜けの直し（甲）— 控えの写しを見張りが持ち、抜けた札を先に一枚立てる |
| [`y0920-1830.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1830.md) | 09-20 18:35 | 16:40:21 の枠（赤い行の直し）に終わりの札が立たなかった訳 |
| [`y0920-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1756.md) | 09-20 17:58 | 赤い行の件（同じ枠の二度目）— **もう直っていて、公開側も戻っている** |
| [`y0920-1710-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710-2.md) | 09-20 17:23 | v1458 「三」の根拠の段へ一文を足した（納品） |
| [`y0920-1710.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710.md) | 09-20 17:00 | 【宣言】「三」の根拠の段の末尾へ一文を足す（v1458） |
| [`y0920-1640.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1640.md) | 09-20 16:59 | 赤い行「知らせの道が落ちています」が消えなかった元と直し（panel v139） |
| [`y0920-1630.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1630.md) | 09-20 16:35 | 16:11 の訴え二つ（ntfy-down・pub-read）の今 |
| [`y0920-1500-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500-2.md) | 09-20 15:19 | v1457 剣士の八枚を idleRight 52 に揃えて焼き直した（納品） |
| [`y0920-1500.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500.md) | 09-20 14:48 | 【宣言】剣士の八枚を idleRight 52 に揃えて焼き直す（v1457） |
| [`y0920-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1450.md) | 09-20 14:40 | 08-20 の保留三つの今（振りの八枚の倍率・目盛り画像の置き場・sizing-review.png） |
| [`y0920-1406-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406-2.md) | 09-20 14:24 | v1456 A の末尾を実測の数を並べた字へ（納品） |
| [`y0920-1406.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406.md) | 09-20 14:06 | 【宣言】A の末尾の一文を数入りの字へ差し替える（v1456） |
| [`y0920-1400.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1400.md) | 09-20 13:59 | 外した表の前後の字（L1497・そのまま写し） |
| [`y0920-1330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330-2.md) | 09-20 13:50 | v1455 節五から猫牌の表の二つ目を外した（納品） |
| [`y0920-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330.md) | 09-20 13:29 | 【宣言】説明欄の節五から猫牌の表の二つ目を外す（v1455） |
| [`y0920-1210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1210.md) | 09-20 12:05 | 本体のいま三つ（較正-1 の綻び・猫牌の表・ダブルヨシ） |

<!-- 控えの一覧 ここまで -->
