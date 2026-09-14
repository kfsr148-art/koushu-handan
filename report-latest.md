# 説明欄の作り替え（v1444）

**終わり** — 2026-09-15 00:5x（VAIO）。**押し済み `ca25c52d`**／版は三箇所とも **v1444**／`stable` は v1443 のまま。
検査は**速い版**で check・adv-check とも PASS（フル版は空き物理メモリ 2048MB の敷居に届かず、台本が自分で見送った）。

## 六節へ組み替えた

置き場は宣言どおり **`#engineHelpOverlay` の `.engine-help-body`**。**題の字は今のまま**（◆ この判定、信用できるの？）。

| 節 | 見出し | 元 |
|---|---|---|
| 一 | どんな時に役立つの？ | 元の「どんな時に役立つの？」の本文 |
| 二 | どう使うの？ | **新しく書き起こした四段**（3/5・4/5） |
| 三 | この判定、信用できるの？ | 「先に答えを」〜「で、これってどれくらいすごいの？」 |
| 四 | 八人はそれぞれ別の材料を見ている | 見かたの「七人はそれぞれ」「投票欄のスイッチ三者」「物差しが割れた手ほど」 |
| 五 | 猫牌・枝豆・AI——三つの物差し | 猫牌の長い説明（`#catHelpPop`） |
| 六 | 船長の見張り台の見かた | 見かたの残り |

**元の文は一字も削っていない。**

## 足した文

- **一の末尾**（2/5）… 「ただ、この道具の本当の使い道は…答えより、見る場所を覚えるための道具。」
- **二の四段**（3/5・4/5）… 牌の入れ方／席の選び方／判定カード／四つの釦
- **三のその六**（5/5）… 「ただし、受けの広さで格上げするのは…子の三向聴から遠い手は、受けが広くても格上げしない」
- **三の根拠の段の末尾**（5/5）… 「線の位置は、麻雀プログラム同士に一万局（四万手）を打たせた結果で確かめてある。」
- **六の四つの練習の後**（2/5）… 「八人が何を見ているかと、投票欄の三者の色は「四」に。」
- **五の「特別ルーム」四箇所**（2/5）… 「設定（⚙️）にあるスイッチ」へ直した

## 中身を二重に持たない形にした

見かたの箱（`.watch-guide-body`）と猫牌の箱（`#catHelpPop`）は**空にして、開く時に「六」「五」から写す**。
markup の控えを一つにしたのは、**二重に持つと片方だけ直して静かにずれる**ため（作法20 の「片方だけ直さない」と同じ理由）。
**見かたも猫牌の説明も、今までどおり開ける。**

## 兎の一行 — 選んでください

| | 文 |
|---|---|
| **甲**（5/5 の元の文） | `・兎＝残り枠。手の中の塊（ブロック）を数え、六つ以上なら攻め。塊にならない弱い余りが二つ以上なら守り。` |
| **乙**（いま置いてある方・y0914-1950 で名指しのヨシが出た文） | `・兎＝残り枠。塊にならない弱い余りを数え、一つも無ければ攻め、二つ以上なら守り。` |

**いまは乙を置いてある。** 判定の式（`usagiLean`）は**塊の数ではなく弱い余りだけ**を見ているので、
甲を入れると説明欄に**事実でない一行**が載る。甲がよければ**一行の入れ替え**で済む。

乙には続けて次の一行も足してある … 「兎は牌を光らせない——見ているのが牌ではなく、残り枠の埋まり方だから。」

## 版と台本

**版は v1444。** 宣言では v1441 だったが、その後 **v1442・v1443** が入ったので番号を繰り上げた
（作法4 の三箇所＝`data-ver`・`verTag`・`ver.txt` を同時に直した）。

**serifu を取り直した**（作法17）… 合計 **7593行**・口調の混入 **0件**・探偵編 238行。`--check` で本体と一致。
本体の `<script>` 四塊は `node --check` で四本とも通った。

## 高さ（800x381・内寸 776x289）

| | px |
|---|---|
| 畳んで空く（見かたから四へ移す三段） | 386 |
| 増える（足す文） | 1086 |
| **差し引き** | **+700** |

**溢れは出ない。** 説明欄も見かたも入れ物が `position:absolute; inset:0; overflow-y:auto` で、
中身は縦に送れる作り。作法16 でも「送れる箱の溢れは数えない」。**送りが長くなるだけ。**

## 実機で見るところ

題の画面から「この判定、信用できるの？」を開くと、**一〜六の見出しが順に並ぶ**。
四に兎の行があり、五に猫牌・枝豆・AI の長い説明、六に見張り台の見かたが入る。
船長の見張り台の「見かた」を開くと**今までどおりの中身**が出る。説明欄の猫の釦を押すと**今までどおり猫牌の説明**が出る。
版の字が **v1444**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **233件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0913-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0913-0015.md) | 09-13 00:34 | 配信の切り分け-1（印 y0913-0015） |
| [`y0912-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2100.md) | 09-12 21:21 | 選択釦-1 — v1439（印 y0912-2100） |
| [`y0912-2015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2015.md) | 09-12 20:16 | ヨシの猫-7 — ヨシ待ちの頭を現場猫の顔へ（印 y0912-2015） |
| [`y0912-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1940.md) | 09-12 19:44 | ヨシの猫-6 — 現場猫の置き場を三つへ（印 y0912-1940） |
| [`y0912-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1915.md) | 09-12 19:14 | ヨシの猫-5 — 現場猫の絵を綺麗にした（印 y0912-1915） |
| [`検査を雲へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%82%92%E9%9B%B2%E3%81%B8-1.md) | 09-12 13:42 | 検査を雲へ-1 — Actions で検査し、通った版だけ配信する |

<!-- 控えの一覧 ここまで -->
