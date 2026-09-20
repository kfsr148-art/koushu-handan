# 【宣言】「三」の根拠の段の末尾へ一文を足す（v1458）

**ヨシ待ち** — 2026-09-20 17:1x（VAIO）。**印: y0920-1710**。
本体（`koushu-handan.html`）の工事なので、**ヨシを取るまで一行も触らない**。

## 足す所

**L1477**（節三「この判定、信用できるの？」の中の**根拠の段**。合わせ技の数字が載っている段）の**末尾**。
いまの終わりは

> …投票欄の八人の票を材料ごとの点棒の平均で重み付けして足し、同じ手数だけ攻めに取ると +1131〜+1338点で、本判定を 179〜223点うわまわる。当たった割合（的中率）は使わない——全部「守り」と言い続けるだけで 73% 当たってしまい、**良し悪しが測れないからである。**

この直後へ、**指示の字をそのまま**足す。

```
四万手で、攻めと言った手と守りと言った手の平均点棒を比べると、本判定は+1169点、AIは+1967点の差がありました。差が大きいほど、その物差しの攻守の見分けが実戦の点に出ています。
```

＊当て先の「良し悪しが測れないからである。」は**本体に一箇所だけ**（数えて確かめた）。
＊足すのは**86字**。L1477 は **527字 → 613字**（行数の増減は0行）。

## 触る行

| 行 | どう直すか |
|---|---|
| **L1477** | 段の末尾へ上の一文を足す（前の字は一字も変えない） |
| **L2** | `data-ver="1457"` → `"1458"` |
| **L1424** | `verTag v1457` → `v1458` |
| `ver.txt` | 1457 → 1458 |

## 添えておくこと（字は指示のまま入れる）

- この段は**いままで「一手あたりの点棒」の数字**（+180点／+913〜+1115点／+1131〜+1338点）で語っている。
  足す一文は **「攻めと言った手」と「守りと言った手」の平均点棒の差**という**別の測り方**の数字（09-14 の実戦的中-2）。
  読む人が同じ物差しの続きと取らないか気になるが、**言葉はこちらで選ばない**ので指示の字のまま入れる。
- 数字の出どころは 09-14 の測り（40000手・機械打ち同士の一局戦）。**本判定 +1169点・AI +1967点**は台帳の記録と一致している。

## 触らない所

**ほかの文には触らない**（同じ段の前の字・節三の他の段・表・ほかの節）。
**判定・条件・光る牌・`analyze()`** にも一字も触らない。`check.js`・`first-sense-base.json`・`stable` も触らない。

## 確かめ方（工事の後）

1. `git diff -U0` の塊が **L2・L1424・L1477 の3箇所だけ**であることを示す。
2. 足した字が**指示と一字一句同じ**で、本体に**一箇所だけ**であることを数える。
3. **段の前の字（527字ぶん）が一字も変わっていない**ことを、工事の前に控えた字と突き合わせて示す。
4. `node serifu-extract.js`（版の字のため再抽出）→ 手元の速い版 → 雲のフル版。

## 段取りと見込み

一文を足す → 版を三箇所 → `serifu-extract` → **手元の速い版が通ってから一度で commit** → push（雲がフル版を回す）。**見込み 20分。**

**「y0920-1710 にヨシ」で着手します。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **320件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1058.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058.md) | 09-20 10:53 | 【宣言】説明欄に三つ手を入れる（v1454） |
| [`y0920-1055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1055.md) | 09-20 10:52 | subj-gap の見比べと step-slow の上限を直した（push-defer は直さない） |
| [`y0920-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1040.md) | 09-20 10:40 | 訴え三件の元（push-defer・subj-gap・step-slow）と、説明欄の二つの確かめ |
| [`y0920-0912-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912-2.md) | 09-20 09:49 | v1453 ずんだもん・枝豆・兎の文面の差し替え（納品） |
| [`y0920-0912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912.md) | 09-20 09:10 | 【宣言】ずんだもん・枝豆・兎の文面を mitate-new-2.txt へ差し替える（v1453） |
| [`y0920-0829.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0829.md) | 09-20 08:32 | 09-19 の調べ四件・台帳の「見張り×2147946720」・ずんだもんと兎の文面 |

<!-- 控えの一覧 ここまで -->
