# 人柄の釦の縮め-1（印 y0914-2240）

**ヨシ待ち** — 2026-09-14 22:4x（VAIO）。本体はまだ触っていない。裁定は**二つ**。

## いまの実寸（写しに probe・二通りとも同じ値）

| | 幅×高さ | 字 | 余白 | 角 | 枠 |
|---|---|---|---|---|---|
| 人柄の釦（`.tone-btn`） | **38 × 44px** | 10px | 3px 8px | 11px | 1px |
| 方言の釦（`.dialect-btn`） | **38 × 24px** | 10px | 3px 8px | 11px | 1px |
| 四つの釦（`.eye-btn`） | **44 × 44px** | — | 0 | 0 | 0 |
| 　└ 中の絵（`.eye-ic`） | 26 × 26px | — | 0 | 5px | 1px |

**列の高さ** … 人柄 **92px**（568x320・二段に折り返す）／**44px**（844x390）、方言は**どちらも 24px**。

## 分かったこと

**人柄の釦と方言の釦は、字の大きさ・余白・角の丸み・枠線の太さが既に同じ。**
判定画面では L1142 が両方を `font-size:10px / padding:3px 8px / border-radius:11px` に揃えている。

**人柄の釦が 44px になっているのは、同じ列に並ぶ四つの釦（`.eye-btn`）が 44x44 で、
flex の列が背の高い方へ引き伸ばしているから。** つまり**縮めるべきは四つの釦ひとつ**で、
人柄の釦そのものは何も変えなくてよい。

## 直す形

`.eye-btn` の「44x44・余白0・枠なし」をやめ、**方言の釦と同じ箱**にする——
余白 `3px 8px`・角 `11px`・枠 `1px`・背景は人柄と同じ薄い白。
中の絵（`.eye-ic`）は 26px → **方言の字の高さに合わせて 14px**。

これで列の高さが **44px → 24px** になり、人柄の釦も引き伸ばされずに **24px** へ戻る。
**並びは今の順のまま、押せる範囲は枠のまま。**

## 裁定① — 選ばれている時の色

| | いまの色 |
|---|---|
| 方言の選択中 | 金 `rgba(232,192,96,0.85)` で塗り、枠を消して太字 |
| 人柄の選択中 | 白 `rgba(243,236,224,0.92)` で塗り、枠を消して太字 |
| 四つの釦の選択中 | 金の枠＋光 `#e0b25a`（塗らない） |

- **甲（推し）** … **付き方だけ**方言に揃える（背景を塗る・枠を消す）。色は今のまま。
- **乙** … 方言と同じ**金**で塗る。

**甲を推す**——三つの列が色で見分けられなくなるのを避けたい。
ただし**色の選び方はこちらで決めない決まり**なので、乙がよければ一言ください。

## 裁定② — 当たり判定が 44px を割る

作法10 は「指で押す的は 44px 以上」。四つの釦を方言と同じ箱にすると**高さが 24px**になり、44px を割る。
ただし——**方言の釦も人柄の釦も、いま既に 24px で 44px を割っている**（この二列に作法10 は効いていない）。
**四つの釦だけが 44px を保っていた**形なので、揃えるとこの列全体が 24px で揃う。
承知のうえで進めてよいかを、①と一緒に返してください。

## 工事の後に写すもの

両方の列の**釦一つの実寸（幅×高さ）と列の高さ**を、568x320 と 844x390 の二通りで。
版は **v1443**（v1441 は説明欄の作り替えに予約済み、v1442 は入れ済み）。台詞は作らないので `serifu` の取り直しは無し。

## 棚の空き-1（途中）

**① ドライブ** … C: 全体 **670GB**・使用 125GB・**空き 545GB**。

**② 大きいフォルダ十本**

| 場所 | GB |
|---|---|
| `C:\Users\user\AppData` | 12.31 |
| `C:\Users\user\Desktop` | 9.45 |
| `C:\Users\user\Videos` | 7.96 |
| `C:\Users\user\Documents` | 5.78 |
| `C:\Users\user\Music` | 5.01 |
| `C:\Users\user\Pictures` | 2.47 |
| `C:\Users\user\.local` | 1.04 |
| `C:\Users\user\.claude` | 0.96 |
| `C:\Users\user\Downloads` | 0.89 |
| `C:\Users\user\OneDrive` | 0 |

**③ 動画と画像**は数え上げの最中（一度目は**空き不足で殺された**ので、
全部を配列へ溜めず**流しながら数える**形に書き直した）。

**見立て（途中）** … **棚は詰まっていない**（545GB 空き）。
**足りないのは板ではなく空き物理メモリ**で、検査を回すと 385MB まで落ちる。
消してよさそうな物・消してはいけない物の仕分けは、③が終わってから同じ札に書く。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **228件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0914-2240.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2240.md) | 09-14 22:40 | 人柄の釦の縮め-1（印 y0914-2240） |
| [`関門の二段-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%96%A2%E9%96%80%E3%81%AE%E4%BA%8C%E6%AE%B5-1.md) | 09-14 22:26 | 関門の二段-1（押しの敷居を押す物で二段に） |
| [`人柄の言葉の棚卸し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BA%BA%E6%9F%84%E3%81%AE%E8%A8%80%E8%91%89%E3%81%AE%E6%A3%9A%E5%8D%B8%E3%81%97-1.md) | 09-14 22:16 | 人柄の言葉の棚卸し-1（前半四人） |
| [`v1442-確かめ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/v1442-%E7%A2%BA%E3%81%8B%E3%82%81.md) | 09-14 22:13 | v1442 の確かめ（四件）と 見張りの止まり-2 |
| [`y0914-2115.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2115.md) | 09-14 21:17 | 投票欄の角と釦の押せ（印 y0914-2115） |
| [`合わせ技-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-4.md) | 09-14 21:06 | 合わせ技-4（合計を六つの区切りで帯に切る） |
| [`合わせ技-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-3.md) | 09-14 20:58 | 合わせ技-3（五分割の持ち回りで五回測る） |
| [`合わせ技-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-2.md) | 09-14 20:44 | 合わせ技-2（八人の合計の上位だけを攻めにする） |
| [`合わせ技-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-1.md) | 09-14 20:31 | 合わせ技-1（八人の点数の重み付き合計） |
| [`y0913-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0913-0015.md) | 09-13 00:34 | 配信の切り分け-1（印 y0913-0015） |
| [`y0912-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2100.md) | 09-12 21:21 | 選択釦-1 — v1439（印 y0912-2100） |
| [`y0912-2015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2015.md) | 09-12 20:16 | ヨシの猫-7 — ヨシ待ちの頭を現場猫の顔へ（印 y0912-2015） |
| [`y0912-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1940.md) | 09-12 19:44 | ヨシの猫-6 — 現場猫の置き場を三つへ（印 y0912-1940） |
| [`y0912-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1915.md) | 09-12 19:14 | ヨシの猫-5 — 現場猫の絵を綺麗にした（印 y0912-1915） |
| [`検査を雲へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%82%92%E9%9B%B2%E3%81%B8-1.md) | 09-12 13:42 | 検査を雲へ-1 — Actions で検査し、通った版だけ配信する |
| [`知らせの押し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-2.md) | 09-12 12:31 | 知らせの押し-2 — 束ねない題と、小さな押しを通す／㉑〜㉔の今の状態 |
| [`知らせの押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-12 12:04 | 知らせの押し-1 — 03:00 以降に押した一覧と、09:47 の「延びています」が題を失った理由 |
| [`見張りの止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-12 11:04 | 見張りの止まり-1 — 段の時間切れ・空きの関門・止まりの知らせ |
| [`札の本文-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%9C%AC%E6%96%87-1.md) | 09-12 09:54 | 札の本文-1 — 終わりの札が前の仕事の文で出る／遠隔の橋-1 を閉じた |
| [`外の見張り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-2.md) | 09-12 04:09 | 外の見張り-2 — claude.exe が0本なら /fail を打つ |

<!-- 控えの一覧 ここまで -->
