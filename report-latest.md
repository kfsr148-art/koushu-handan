# v1455 節五から猫牌の表の二つ目を外した（納品）

**終わり（残り0件）** — 2026-09-20 13:5x（VAIO）。`stable` は触っていない（検収の後で進める）。

## 外した物

節五（**L1497**）の**二つ目の表**（猫牌／残る本物の牌／形が整う割合・8段）。
`<table>` から `</table>` までの **2612字ちょうど**を落とした。**L1497 は 9785字 → 7173字**、行数の増減は0行。

## 確かめ

1. **`git diff -U0` の塊は3箇所だけ** … L2（版）・L1424（版）・L1497。ほかの行は一つも出ていない。
2. **L1497 に残る `<table>` は一つだけ**（一つ目の表）。中身は **猫牌／攻めの割合／形が整う割合／平均ドラ価値**（0枚 40.8%・22.8%・0.41 〜 8枚 13.7%・0%・0.14）で、**一字も変わっていない**。
3. **前後の本文はそのまま繋がった** … 「…実測し直したのが下の表です。」→（`<br>`）→「本物の牌が1枚減るごとに、割合はほぼ半分から…」。
4. **`serifu` は版の字を持っているのでずれた** → 宣言どおり `node serifu-extract.js` で再抽出（7599行・口調の混入0件・`--check` 一致）。
5. **手元の速い版** … 終了コード0・**所要5.4秒**（Edge の段は飛ばす形）。
6. **commit は一度**（828abfde）。本体・`ver.txt`・`serifu.txt`・`serifu-adv.txt`。
7. **雲（走り 35489479457）… completed / success。** 速い版・フル版・配信すべて success。公開側の `ver.txt` は **1455**。

## 残っている「表を指す字」（宣言のとおり触っていない）

- 直前 … 「…「必要数4」の条件だけを揃えて実測し直したのが**下の表です**。」（指す先が無くなった）
- 直後 … 「**本物の牌が1枚減るごとに、割合はほぼ半分から数分の一へなだらかに落ち、本物7枚（猫牌6枚）でついに理屈通りの0%（2000回中0）に達しました。**…」（表の数を地の文だけで語る形）

言い替えの字をもらえれば、その回に入れる。

## 実機で見る所

「📖 説明欄 → 🐾 このツール、何がすごいの？」の **五**（猫牌・枝豆・AI）で、

- 猫牌の表が**一つだけ**になっている（猫牌／攻めの割合／形が整う割合／平均ドラ価値）。
- 「境目の根拠（なぜ4枚か）」の段は、**表が消えて文が続けて読める**形になっている。
- 版の字が **v1455**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **311件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330-2.md) | 09-20 13:50 | v1455 節五から猫牌の表の二つ目を外した（納品） |
| [`y0920-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330.md) | 09-20 13:29 | 【宣言】説明欄の節五から猫牌の表の二つ目を外す（v1455） |
| [`y0920-1210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1210.md) | 09-20 12:05 | 本体のいま三つ（較正-1 の綻び・猫牌の表・ダブルヨシ） |
| [`y0920-1146.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1146.md) | 09-20 11:56 | 今朝の枠の確かめと、実戦的中-2／持ち上げ-1 |
| [`y0920-1058-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058-2.md) | 09-20 11:28 | v1454 説明欄の三つの直し（納品） |
| [`y0920-1058.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058.md) | 09-20 10:53 | 【宣言】説明欄に三つ手を入れる（v1454） |
| [`y0920-1055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1055.md) | 09-20 10:52 | subj-gap の見比べと step-slow の上限を直した（push-defer は直さない） |
| [`y0920-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1040.md) | 09-20 10:40 | 訴え三件の元（push-defer・subj-gap・step-slow）と、説明欄の二つの確かめ |
| [`y0920-0912-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912-2.md) | 09-20 09:49 | v1453 ずんだもん・枝豆・兎の文面の差し替え（納品） |
| [`y0920-0912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912.md) | 09-20 09:10 | 【宣言】ずんだもん・枝豆・兎の文面を mitate-new-2.txt へ差し替える（v1453） |
| [`y0920-0829.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0829.md) | 09-20 08:32 | 09-19 の調べ四件・台帳の「見張り×2147946720」・ずんだもんと兎の文面 |
| [`y0919-2320.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2320.md) | 09-19 23:17 | stale の回に iPhone が鳴らない穴を塞いだ（🪟 に名乗り bad） |
| [`y0919-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2255.md) | 09-19 23:09 | 連携の総点検（壊さず、作り値と実読みだけで） |
| [`y0919-2210-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2210-2.md) | 09-19 22:55 | panel v138 の納品（雲の検査 両方PASS） |
| [`y0919-2210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2210.md) | 09-19 22:28 | 現況の行が「本体v1451／stable v1451」のまま … パネルが版を開いた一度しか取っていなかった |
| [`y0919-2205.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2205.md) | 09-19 22:06 | hold-stuck の直し（空の札を溜め場へ入れない） |
| [`y0919-2149.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2149.md) | 09-19 21:57 | 命令の見張りと、作法36（回る段の突き合わせ） |
| [`y0919-2147.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2147.md) | 09-19 21:52 | 今日の止まりの三つの確かめと、別件二つ（hold-stuck・見張り×2147946720） |
| [`y0919-2103-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2103-2.md) | 09-19 21:22 | v1452 設定画面に「言葉の一覧」（y0919-1701 の納品） |
| [`y0919-2103.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2103.md) | 09-19 21:04 | 手元の速い版（Edge の五段を飛ばし）… check は通り、adv-check が上限に当たった |

<!-- 控えの一覧 ここまで -->
