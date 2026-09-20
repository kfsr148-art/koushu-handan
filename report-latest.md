# report-latest.md はどこに書いているか／写しを機械の手にした

**終わり（残り0件）** — 2026-09-20 19:2x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 1. 実際に書いている場所

| | 道 |
|---|---|
| 手元 | **`C:\Users\user\Desktop\mahjong\koushu-handan\report-latest.md`**（リポジトリ直下） |
| raw | `https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/report-latest.md` |
| 公開（Pages） | `https://kfsr148-art.github.io/koushu-handan/report-latest.md` |

**`reports/` の中には無い**（`reports/` は印ごとの控え 325件。`report-latest.md` は**直下のただ一つ**）。
札の「ファイル:」の行に出る `reports/y0920-xxxx.md（新）／report-latest.md` は、**二つ別々の綴り**を並べたもので、
`reports/report-latest.md` という綴りは**存在しない**（そこを見ると404になる）。

## 2. 「08-20 の古い物」は手元にも公開側にも無かった（実読み）

| 見た所 | 結果 |
|---|---|
| 直下の綴りの刻 | **09-20 19:05**（いちばん新しい報告と同じ中身） |
| 直下の commit の直近 | 09-20 19:03／18:51／18:35／17:58／17:23／17:00 …**報告のたびに書き替わっている** |
| raw（main） | **HTTP 200**・中身はいちばん新しい報告 |
| 公開（Pages） | **HTTP 200**・同じ |
| ほかの写し | `~/.claude` にも家のどこにも `report-latest.md` は**無い**（探した） |
| `stable` の中の同じ綴り | v1458 の宣言（17:10）。**タグは動かした時点で止まる**ので、`stable` を見ていると古く見える |

＊08-20 の字が見えていたとすれば、**古い頁を掴んだ端末の写し**か、**`stable`（または古い commit）の道**を見ていた可能性が高い。
　いまの main／Pages はどちらも最新。

## 3. 直した所（写しを機械の手にした）

これまでは**報告を書く手が `reports/<印>.md` を直下へ写していた**（手で）。写し忘れれば直下だけ古くなる。
**`reports-index.js` が写す形にした**——一覧を貼る前に、**`reports/` のいちばん新しい控えを直下へそのまま写す**。
既に同じ中身なら触らない（無駄な commit を作らない）。

```
$ node reports-index.js
直下の report-latest.md ← reports/y0920-1900-2.md（写した）
控えの一覧を report-latest.md の末尾へ貼った : 20件（全部で 325件）
```

**作り値** … 直下をわざと**一つ前の報告（18:52 の分）**にしてから回したところ、
**いちばん新しい控えへ戻り**、中身も一致した（✓）。

## 4. 18:52 の報告での実読み

| 見た所 | 結果 |
|---|---|
| `reports/y0920-1900.md`（18:52 の報告）の raw | **HTTP 200** |
| その raw と手元の中身 | **✓ 同じ（1877字）** |
| 18:51 の commit の直下の `report-latest.md` | **✓ 18:52 の報告と同じ**（その時は直下がこの報告だった） |
| いまの公開の `report-latest.md` | HTTP 200（いまの最新＝19:0x の報告） |

## 触った所と触らない所

**触った所** … `reports-index.js`（写しの一段を足しただけ）。
**触らない所** … 報告の中身・`reports/` の綴り・`koushu-handan.html`・`stable`・見張りの台本。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **326件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1146.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1146.md) | 09-20 11:56 | 今朝の枠の確かめと、実戦的中-2／持ち上げ-1 |
| [`y0920-1058-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058-2.md) | 09-20 11:28 | v1454 説明欄の三つの直し（納品） |

<!-- 控えの一覧 ここまで -->
