# 【宣言】剣士の八枚を idleRight 52 に揃えて焼き直す（v1457）

**ヨシ待ち** — 2026-09-20 15:0x（VAIO）。**印: y0920-1500**。
本体（`koushu-handan.html`）の工事なので、**ヨシを取るまで一行も触らない**。

## 先に分かったこと（読むだけで確かめた）

| | 中身 |
|---|---|
| 八枚の置き場 | `EDA_WHIP`（**L9776**）の中。いまの原寸は **u 186x387／ur 328x380／r 294x262／dr 259x281／d 244x268／dl 279x256／l 423x388／ul 235x281**（08-20 の記録と同じ＝一度も焼き直されていない） |
| 添えの三つ | `EDA_FOOT`（L9793・足元の行）／`EDA_WHIP_AXIS`（L9808・体軸の割合）／`EDA_SIZE`（L9797・倍率の基準） |
| **元絵が無い** | `*_src.png` は kishi_air_* / breath / hit / idle_front / joy / run だけ。**八枚の元絵はリポジトリに無い**（記憶「元絵が無いコマは逆算で焼く」の場合） |
| **道具が使えない** | `char_export.js` も `head-proof.js` も **headless の Edge が要る**。この機械では立てない決め（今日の止まりの元） |
| 代わりの手 | **素の node だけで PNG を読み書きできることを実測で確かめた**（zlib で展開→フィルタ戻し→再圧縮。`d` 244x268 を読み書きして画素が一致） |

## やること

1. **測り直し**（本体には触らない）
   - 八枚と基準（`idleRight`・`breathR`）の**頭の帯を6倍に拡大し、元画素の10px ごとに目盛りを重ねた絵**を焼く（素の node で。Edge は立てない）。
   - **目で読む**（作法21「目視読みが最終」）。色による自動判定は使わない——八枚は弧が金髪の色域に入るため。
   - 読んだ値は札に**八枚ぶん並べる**（08-20 の値とも並べて、変わっていないかを示す）。
2. **倍率を出す** … **52 ÷ 実測の頭の幅**。`idleRight` の実測も同じやり方で読み、**52px の基準そのものを確かめてから**割る。
3. **焼き直す** … 八枚それぞれを倍率で縮め／拡げる（画素は面積平均で間引き、拡げる側は双一次）。
   - `EDA_FOOT` の八枚ぶんを**同じ倍率で掛け直す**（足元の行も縮むため）。
   - `EDA_WHIP_AXIS` は**割合なので不動**（確かめて札に書く）。
   - `EDA_SIZE` は**触らない**。
4. **目で見る** … 焼いた八枚を**暗背景（#0d1b16）と白地の二枚組**に並べて確かめる（作法21）。刀身の欠け・白い縁が出ていないかを見る。
5. **札に書く** … **焼いた後の八枚の高さ**（と幅・倍率・足元の新しい値）。

## 触る行（ヨシの後）

| 行 | どう直すか |
|---|---|
| **L9776**（`EDA_WHIP`） | 八枚の data URL を焼き直した物へ差し替え（**u・ur・r・dr・d・dl・l・ul の8箇所だけ**） |
| **L9793〜L9795**（`EDA_FOOT`） | 八枚ぶんの値を倍率で掛け直す |
| **L2 / L1424 / `ver.txt`** | v1456 → **v1457** |

**触らない所** … `EDA_WHIP` の**残り19枚**（airUp*・airSlash*・airDown*・joy*・breath*・run*・hit・idle*）、
**投げの五枚（`EDA_NAGE`・`EDA_NAGE_FOOT`・`EDA_AXIS`。action 59 を含む）**、`EDA_WHIP_AXIS`、`EDA_SIZE`、
**判定・条件・光る牌・`analyze()`**、見立て行・釦・投票欄の台詞、説明欄、`check.js`、`stable`。

## 確かめ方（工事の後）

1. `git diff -U0` の塊が **L2・L1424・L9776・L9793〜L9795 だけ**であることを示す。
2. 焼いた八枚の**幅×高さ**を並べ、**倍率どおりに縮んでいる**ことを示す（札に表で）。
3. **頭の幅を焼いた後にもう一度読み**、八枚が **52px ±2** に収まったことを示す。
4. 暗背景と白地の二枚組を**目で見て**、欠けと白縁が出ていないことを書く。
5. `node serifu-extract.js`（版の字のため再抽出）→ 手元の速い版 → 雲のフル版。

## 代償と気をつける所

- **元絵が無いので、いまの絵を縮める形になる**（焼き直しではなく作り直しに近い）。縮める側（六枚）は画素が減るだけだが、
  **`ul` だけは拡げる向き**になる見込みで、**拡げると輪郭が甘くなる**。読んだ値によっては `ul` を据え置く判断もありうる——その時は札に書いて据え置く。
- 弧を持つコマは**旧法で薄く焼いてある**ので、**弧そのものは焼き直さない**（縮めるだけなら濃さは変わらない）。
- 八枚の見かけが変わるので、**一索の鳥の遊びの画面が変わる**（実機で見てもらう所になる）。

## 段取りと見込み

測り直し（約20分）→ 倍率を出す → 焼き直し（約20分）→ 目で見る → 本体へ差し替え → 版 → 検査 → 一度で commit → push。
**見込み 70分。**

**「y0920-1500 にヨシ」で着手します。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **316件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-2320.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2320.md) | 09-19 23:17 | stale の回に iPhone が鳴らない穴を塞いだ（🪟 に名乗り bad） |
| [`y0919-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2255.md) | 09-19 23:09 | 連携の総点検（壊さず、作り値と実読みだけで） |
| [`y0919-2210-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2210-2.md) | 09-19 22:55 | panel v138 の納品（雲の検査 両方PASS） |
| [`y0919-2210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2210.md) | 09-19 22:28 | 現況の行が「本体v1451／stable v1451」のまま … パネルが版を開いた一度しか取っていなかった |

<!-- 控えの一覧 ここまで -->
