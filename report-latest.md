# v1457 剣士の八枚を idleRight 52 に揃えて焼き直した（納品）

**終わり（残り0件）** — 2026-09-20 16:0x（VAIO）。`stable` は触っていない（検収の後で進める）。
**投げ（action 59）には触っていない。** 判定・条件・光る牌・`analyze()` にも触っていない。

## 測り直し（頭の幅）

- **八枚の画素は 08-20 から一度も変わっていない**ことを先に確かめた（08-21 の commit 62cc7754 の data URL と**字数まで一致**・8枚とも）。
- **自動の物差しは使えない**ことを実測で確かめ直した … 金髪の芯だけを拾う判定（`r>170 && g>140 && g-b>42 && r-b>58`）では
  **idleRight 52・breathR 47** と基準は合うのに、**d 34・u 31** と八枚は低く出る（髪が影に沈む）。
  影まで含める緩い判定も試したが、**服や弧へ漏れる**（`l` が 279 と出た）ので捨てた。
- そこで**目盛りつきの拡大図を焼いて目で読んだ**（素の node だけで焼いた。**Edge は立てていない**）。
  頭の帯を6倍に拡大し、元画素10px ごとに目盛りを重ねた三枚を見て、**両端（`l` と `ul`）と `dl` を抜き取りで読み直した**——
  読みは **±2〜3px で 08-20 の値と一致**（`ul` 約46／`dl` 約56／`l` 約60。08-20 は 47／54／57）。
  画素が同じで読みも一致したので、**08-20 の八枚の読みを「今の実測」として採った**。

| コマ | 頭の幅（実測） | 倍率（52 ÷ 実測） |
|---|---|---|
| u | 57 | **×0.912** |
| ur | 55 | ×0.945 |
| r | 54 | ×0.963 |
| dr | 55 | ×0.945 |
| d | 51 | **×1.020** |
| dl | 54 | ×0.963 |
| l | 57 | ×0.912 |
| ul | 47 | **×1.106**（唯一の大きな拡大） |

＊基準は `idleRight` **52**（同じ読み方での較正値）。掛けた後の頭の幅は**八枚とも 52.0**（計算どおり）。
＊`d` の ×1.020 は**読みの誤差（±2px）の内側**だが、指示どおり八枚すべてを揃えた。

## 焼いた後の八枚（幅×高さ・足元）

| コマ | 倍率 | 前 | **後** | 足元 前→後 | 綴りの重さ 前→後 |
|---|---|---|---|---|---|
| u | 0.912 | 186x387 | **170x353** | 384→350 | 119→104KB |
| ur | 0.945 | 328x380 | **310x359** | 375→355 | 145→132KB |
| r | 0.963 | 294x262 | **283x252** | 261→251 | 108→103KB |
| dr | 0.945 | 259x281 | **245x266** | 259→245 | 126→117KB |
| d | 1.020 | 244x268 | **249x273** | 264→269 | 108→113KB |
| dl | 0.963 | 279x256 | **269x247** | 244→235 | 119→113KB |
| l | 0.912 | 423x388 | **386x354** | 360→328 | 193→162KB |
| ul | 1.106 | 235x281 | **260x311** | 279→309 | 99→119KB |

**高さの並び（後）** … u 353／ur 359／r 252／dr 266／d 273／dl 247／l 354／ul 311。
**本体の重さ** … 10,724,732 → **10,668,612 バイト**（−56KB。焼き直しでかえって軽くなった）。

## 焼き方（道具が使えなかったので新しく書いた）

- `char_export.js` も `head-proof.js` も **headless の Edge が要る**ので使えない（この機械では立てない決め）。
- **素の node だけで PNG を読み書きする手**を書いた（zlib で展開 → フィルタ戻し → 面積平均で縮め → 行ごとに五つのフィルタを試して再圧縮）。
  読み書きの往復で**画素が完全一致**することを先に確かめてから使った。道具は scratchpad に置き、**リポジトリには入れていない**。
- α は**先に掛けてから混ぜた**（縁に暈が出ないように）。

## 目で見た（作法21）

焼いた八枚を**暗背景（#0d1b16）と白地**の二枚組に並べて見た。
**刀身の欠け・白い縁・弧の途切れは無し。** 弧は縮めただけなので濃さは変わっていない。

## 確かめ

1. **`git diff -U0` の塊は4箇所** … L2（版）・L1424（版）・**L9792（`EDA_WHIP` の八枚）**・**L9794（`EDA_FOOT`）**。
2. **`EDA_WHIP` の残り19枚は一枚も変わっていない**（字で突き合わせ）。**`EDA_WHIP_AXIS`・`EDA_NAGE`（投げ）も不動**。
3. `node serifu-extract.js` 再抽出（7599行・口調の混入0件・`--check` 一致）。
4. 手元の速い版 … **終了コード0・4.4秒**。
5. **雲（走り 35493162382）… completed / success。** 速い版・フル版・配信すべて success。
   **⑯⑰⑱（一索の鳥の動きの実測）も通った**ので、焼き直した八枚でも遊びは壊れていない。公開の `ver.txt` は **1457**。

## 宣言と違った所（一つ）

**`check.js` を触った。** 宣言では「触らない」と書いたが、⑲（素材の寸法の写し）が**八枚の寸法を表で持っている**ため、
焼き直すと必ず落ちる（実際に「寸法が表と違う素材 8件」で FAIL した）。
**表の八行だけ**を新しい寸法へ直した（`WANT` の `u`〜`ul`）。判定の条件には触っていない。

## 実機で見る所

**🐦 一索の鳥**を遊んで、

- 剣を**振った八方向**（上・右上・右・右下・下・左下・左・左上）で、**剣士の頭の大きさが立ち姿とそろって見える**こと。
  とくに**左上（ul）は一割ほど大きく**、**上と左（u・l）は一割ほど小さく**なっている。
- 足元が床の線から浮いたり沈んだりしていないこと（足元の値も同じ倍率で掛け直した）。
- 弧（斬撃）の見え方が前と変わっていないこと。
- 版の字が **v1457**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **317件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-2320.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2320.md) | 09-19 23:17 | stale の回に iPhone が鳴らない穴を塞いだ（🪟 に名乗り bad） |
| [`y0919-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2255.md) | 09-19 23:09 | 連携の総点検（壊さず、作り値と実読みだけで） |
| [`y0919-2210-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2210-2.md) | 09-19 22:55 | panel v138 の納品（雲の検査 両方PASS） |

<!-- 控えの一覧 ここまで -->
