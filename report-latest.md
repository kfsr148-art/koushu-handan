# 【宣言】説明欄の節五から猫牌の表の二つ目を外す（v1455）

**ヨシ待ち** — 2026-09-20 13:3x（VAIO）。**印: y0920-1330**。
本体（`koushu-handan.html`）の工事なので、**ヨシを取るまで一行も触らない**。

## 外す物

節五（**L1497**）の中の **二つ目の表**（猫牌／残る本物の牌／形が整う割合）。

| 猫牌 | 残る本物の牌 | 形が整う割合 |
|---|---|---|
| 0枚 | 13枚 | 19.42% |
| 1枚 | 12枚 | 9.76% |
| 2枚 | 11枚 | 4.76% |
| 3枚 | 10枚 | 1.39% |
| 4枚 | 9枚 | 0.31% |
| 5枚 | 8枚 | 0.05% |
| 6枚 | 7枚 | 0.00% |
| 8枚 | 5枚 | 0% |

**一つ目の表（猫牌／攻めの割合／形が整う割合／平均ドラ価値）と本文の字には触らない。**

## 触る行と字数

| 行 | どう直すか |
|---|---|
| **L1497** | `<table …>` から `</table>` までの **2612字**を落とす（この行だけ・9785字 → **7173字**）。前後の `<br>` と本文は残す |
| **L2** | `data-ver="1454"` → `"1455"` |
| **L1424** | `verTag v1454` → `v1455` |
| `ver.txt` | 1454 → 1455 |

**行数の増減は0行**（L1497 は一行のまま。落とすのは行の中の一区切り）。

## 外した表を指していた本文の字（**二つある。どちらも残る**）

**① 表の直前**（同じ L1497）
> **境目の根拠（なぜ4枚か）**　判定エンジンは、打点（ドラ等）が薄い手では「良形（リョウケイ）の塊が4つ以上」で形が整っていると認めます。良形の塊は2枚一組が基本ですから、4つ揃えるには最低8枚の本物の牌が要ります。猫牌の分だけ本物の牌が減っていく中で、「必要数4」の条件だけを揃えて実測し直したのが**下の表です**。

**② 表の直後**（同じ L1497）
> **本物の牌が1枚減るごとに、割合はほぼ半分から数分の一へなだらかに落ち、本物7枚（猫牌6枚）でついに理屈通りの0%（2000回中0）に達しました。** 8枚に届かない以上、良形4つは作りようがないためです。猫牌4枚のあたりが「実用上ほぼ消える境目」、猫牌6枚のあたりが「理屈の上でも不可能になる境目」——この二段構えが、猫牌攻守指数の裏付けです。

**どちらも本文なので、指示どおり触らない。** ただし表を外すと、
①の「下の表です」は**指す先が無くなり**、②は**表に載っていた数を地の文だけで語る**形になる。
直すなら①の一文を言い替えるか、②の頭に数を書き足す形だが、**言葉はこちらで選ばないので、いまは字のまま置く。**
言い替えの字をもらえれば、その回に一緒に入れる。

## 触らない所

**判定・条件・`analyze()` に一字も触らない。** 節五の一つ目の表・本文・ほかの節・見立て行・釦・投票欄の台詞・
`check.js`・`first-sense-base.json`・`stable`・`mitate-new-2.txt` も触らない。

## 確かめ方（工事の後）

1. `git diff -U0` の塊が **L2・L1424・L1497 の3箇所だけ**であることを示す。
2. **L1497 に残る `<table>` が一つだけ**（一つ目の表）で、その字が**一字も変わっていない**ことを示す。
3. 落としたのが `<table>` から `</table>` までの**2612字ちょうど**で、前後の本文の字が**そのまま繋がっている**ことを示す。
4. `node serifu-extract.js --check`（説明欄の字は台詞に載らず行数も変わらないので、**ずれない見込み**。ずれたら再抽出する）。
5. 手元の速い版（Edge の段は飛ばす）と、雲のフル版（⑦⑯⑰⑱㉓と adv-check を含む）で通す。

## 段取りと見込み

表を落とす → 版を三箇所 → `serifu-extract --check` → **手元の速い版が通ってから一度で commit** → push（雲がフル版を回す）。**見込み 25分。**

**「y0920-1330 にヨシ」で着手します。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **310件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-2057.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2057.md) | 09-19 20:57 | 手元の速い版（⑦飛ばし）… ⑯で上限に当たって抜けた |

<!-- 控えの一覧 ここまで -->
