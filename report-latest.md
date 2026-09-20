# 【宣言】A の末尾の一文を数入りの字へ差し替える（v1456）

**ヨシ待ち** — 2026-09-20 14:0x（VAIO）。**印: y0920-1406**。
本体（`koushu-handan.html`）の工事なので、**ヨシを取るまで一行も触らない**。

## 差し替える一文（L1497・節五の A の末尾）

**前（29字・本体に一箇所だけ）**
```
「必要数4」の条件だけを揃えて実測し直したのが下の表です。
```

**後（95字・指示の字そのまま）**
```
「必要数4」の条件だけを揃えて実測し直すと、形が整う割合は猫牌0枚で19.42%、1枚で9.76%、2枚で4.76%、3枚で1.39%、4枚で0.31%、5枚で0.05%、6枚で0%でした。
```

**+66字。** L1497 は **7173字 → 7239字**。**行数の増減は0行。**

## 触る行

| 行 | どう直すか |
|---|---|
| **L1497** | 上の一文だけを差し替える（A の頭「境目の根拠（なぜ4枚か）」からこの文の前までは不動） |
| **L2** | `data-ver="1455"` → `"1456"` |
| **L1424** | `verTag v1455` → `v1456` |
| `ver.txt` | 1455 → 1456 |

## 一つ添えておくこと（字は指示のまま入れる）

外した表には **8枚（本物5枚）0%** の段もあったが、新しい字は **0〜6枚**まで。
B の段は「本物7枚（猫牌6枚）でついに理屈通りの0%（2000回中0）に達しました」と続くので、**6枚までで話は繋がる**。
8枚の段を足すかどうかは言葉の選びなので、**指示の字のまま入れる**。

## 触らない所

**B の段・一つ目の表・ほかの本文には触らない。** 判定・条件・`analyze()` にも一字も触らない。
`check.js`・`first-sense-base.json`・`stable`・`mitate-new-2.txt` も触らない。

## 確かめ方（工事の後）

1. `git diff -U0` の塊が **L2・L1424・L1497 の3箇所だけ**であることを示す。
2. 入れた字が**指示と一字一句同じ**で、本体に**一箇所だけ**であることを数える。
3. **B の段（169字）と一つ目の表の字が一字も変わっていない**ことを、字の照合で示す。
4. `node serifu-extract.js`（版の字を持つのでずれる。再抽出して `--check` 一致を確かめる）。
5. 手元の速い版（Edge の段は飛ばす）と、雲のフル版（⑦⑯⑰⑱㉓と adv-check を含む）で通す。

## 段取りと見込み

一文を差し替える → 版を三箇所 → `serifu-extract` → **手元の速い版が通ってから一度で commit** → push（雲がフル版を回す）。**見込み 20分。**

**「y0920-1406 にヨシ」で着手します。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **313件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1406.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406.md) | 09-20 14:06 | 【宣言】A の末尾の一文を数入りの字へ差し替える（v1456） |
| [`y0920-1400.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1400.md) | 09-20 13:59 | 外した表の前後の字（L1497・そのまま写し） |
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

<!-- 控えの一覧 ここまで -->
