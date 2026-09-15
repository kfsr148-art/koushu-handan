# 八人の数字を説明欄へ（v1446）

**終わり** — 2026-09-15 12:0x（VAIO）。**押し済み `d61173da`**／版は三箇所とも **v1446**／`stable` は v1445 のまま。
検査は速い版で check・adv-check とも PASS。

## 置いた字（丙・246字・一字も変えていない）

> どれくらい効いているか、数字で置いておく。麻雀プログラム同士に一万局（四万手）を打たせると、一手あたりの点棒はならして +180点。この判定が「攻め」と言った手だけを取ると +913〜+1115点で、五倍から六倍になる。投票欄の八人の票を材料ごとの点棒の平均で重み付けして足し、同じ手数だけ攻めに取ると +1131〜+1338点で、本判定を 179〜223点うわまわる。当たった割合（的中率）は使わない——全部「守り」と言い続けるだけで 73% 当たってしまい、良し悪しが測れないからである。

## 置いた場所

**「三、この判定、信用できるの？」の根拠の段の末尾**（`koushu-handan.html` L1477 の行末）。

錨は **「そこから出た線。」**。本体の中に**一つしか無いことを数えてから**当てている（二つ以上あれば止める形にした）。
置き方は `<br>` を一つ挟んで続ける、**段の中の新しい一文**。その前の
「線の位置は、麻雀プログラム同士に一万局（四万手）を打たせた結果で確かめてある。…」は今までどおり。

## 高さ

| | px |
|---|---|
| 足す高さ（800x381・内寸 776x289・説明欄の幅 776px） | **+130** |
| 畳んで空く高さ | 0 |
| **差し引き** | **+130** |

説明欄の全体は **5674px → 5804px**（+2.3%）。`overflow-y:auto` の送れる箱なので**溢れは出ない**。

## 数字の出どころ

| | 前の晩（40000手） | seed 1（20000手） | seed 2（20000手） |
|---|---|---|---|
| 手ぜんぶの平均点棒 | **+180** | +179 | +181 |
| 本判定の攻めと言った手 | +1100 | **+913** | **+1115** |
| 八人の重み付き（手数を揃えた） | +1279 | **+1131** | **+1338** |
| 差 | +179 | +218 | +223 |
| 全部守りの的中 | 73.3% | 73.2% | 73.3% |

**的中率を外した訳** … 本判定の的中 66.8〜67.7% は、**全部守りと言い続けるだけの 73.2〜73.3% を下回る**。
そのまま出すと**逆さに読める**数字なので、使わないことと、その訳を文の中に書いた。

## 触った所と触らない所

**触った所** … L1477 の行末（丙の一文を `<br>` で続けた）／版の二箇所／`ver.txt`／`serifu.txt`・`serifu-adv.txt`。

**触らない所** … 判定そのもの／他の五節（一・二・四・五・六）／見張り台と猫牌の説明（五・六から写す形もそのまま）／四枚の札／投票欄／人柄の列。

`<script>` 四塊は `node --check` で四本とも通過。serifu は取り直して `--check` で本体と一致。

## 実機で見るところ

題の画面から「この判定、信用できるの？」を開き、「三、この判定、信用できるの？」を下まで送ると、
**根拠の段（「根拠はどこにあるか。配牌はならすと…」で始まる段）の末尾**に、
**＋180点・＋913〜＋1115点・＋1131〜＋1338点**の並んだ一文が増えている。版の字が **v1446**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **239件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`八人の数字を説明欄へ-v1446.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%AB%E4%BA%BA%E3%81%AE%E6%95%B0%E5%AD%97%E3%82%92%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%B8-v1446.md) | 09-15 14:03 | 八人の数字を説明欄へ（v1446） |
| [`y0915-1130.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0915-1130.md) | 09-15 12:53 | 八人の数字を説明欄へ（丙の字を確定） |
| [`件名の拾い方-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BB%B6%E5%90%8D%E3%81%AE%E6%8B%BE%E3%81%84%E6%96%B9-4.md) | 09-15 04:59 | 件名の拾い方-4 と stable の進め（v1445） |
| [`四枚の札の縮め-1-v1445.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9B%9B%E6%9E%9A%E3%81%AE%E6%9C%AD%E3%81%AE%E7%B8%AE%E3%82%81-1-v1445.md) | 09-15 01:28 | 四枚の札の縮め-1（v1445） |
| [`y0915-0130.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0915-0130.md) | 09-15 01:00 | 四枚の札の縮め-1 の下調べ（印 y0915-0130） |
| [`兎の一行の確定-v1444.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E4%B8%80%E8%A1%8C%E3%81%AE%E7%A2%BA%E5%AE%9A-v1444.md) | 09-15 00:51 | 兎の一行の確定と stable の進め（v1444） |
| [`説明欄の作り替え-v1444.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E4%BD%9C%E3%82%8A%E6%9B%BF%E3%81%88-v1444.md) | 09-15 00:44 | 説明欄の作り替え（v1444） |
| [`見張りの止まり-3-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-3-2.md) | 09-15 00:12 | 見張りの止まり-3（三度の止まり） |
| [`人柄の言葉の棚卸し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BA%BA%E6%9F%84%E3%81%AE%E8%A8%80%E8%91%89%E3%81%AE%E6%A3%9A%E5%8D%B8%E3%81%97-2.md) | 09-14 23:39 | 人柄の言葉の棚卸し-2（後半四人） |
| [`見張りの止まり-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-3.md) | 09-14 23:31 | 見張りの止まり-3（二度の止まり） |
| [`棚の空き-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A3%9A%E3%81%AE%E7%A9%BA%E3%81%8D-1.md) | 09-14 23:17 | 棚の空き-1 |
| [`y0914-2240.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2240.md) | 09-14 22:40 | 人柄の釦の縮め-1（印 y0914-2240） |
| [`関門の二段-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%96%A2%E9%96%80%E3%81%AE%E4%BA%8C%E6%AE%B5-1.md) | 09-14 22:26 | 関門の二段-1（押しの敷居を押す物で二段に） |
| [`人柄の言葉の棚卸し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BA%BA%E6%9F%84%E3%81%AE%E8%A8%80%E8%91%89%E3%81%AE%E6%A3%9A%E5%8D%B8%E3%81%97-1.md) | 09-14 22:16 | 人柄の言葉の棚卸し-1（前半四人） |
| [`v1442-確かめ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/v1442-%E7%A2%BA%E3%81%8B%E3%82%81.md) | 09-14 22:13 | v1442 の確かめ（四件）と 見張りの止まり-2 |
| [`y0914-2115.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2115.md) | 09-14 21:17 | 投票欄の角と釦の押せ（印 y0914-2115） |
| [`合わせ技-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-4.md) | 09-14 21:06 | 合わせ技-4（合計を六つの区切りで帯に切る） |
| [`合わせ技-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-3.md) | 09-14 20:58 | 合わせ技-3（五分割の持ち回りで五回測る） |
| [`合わせ技-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-2.md) | 09-14 20:44 | 合わせ技-2（八人の合計の上位だけを攻めにする） |
| [`合わせ技-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-1.md) | 09-14 20:31 | 合わせ技-1（八人の点数の重み付き合計） |

<!-- 控えの一覧 ここまで -->
