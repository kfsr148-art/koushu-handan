# 猫牌率の下敷きの入れ替え-1 の下調べ

**調べた** — 2026-09-15 18:5x（VAIO）。**工事はまだ入っていない**（判じと測りまで）。本体には触っていない。

## ① 差し替えられるか・数え方は揃っているか

**数え方は揃っている。** 本体の `effectiveCatN` は「手の中の実物の猫牌の枚数（`catN`）＋本物の牌の孤立牌（`countIsolatedRealTiles`）」。
今回の実測は本体から `countIsolatedRealTiles` を**字面のまま切り出して**本物の十三枚に当てたので、
猫牌を入れない手（`catN=0`）では `effectiveCatN` と一字違わず同じ数になる。
出現の割合が下敷きと **0.1〜0.2pt 以内**で重なったのも、その裏付け。

**判じ … 差し替えは「できる」。ただし入れる前に二つ要る。**

1. **差し替えられるのは猫牌の一本だけ。** `BASE_CURVE` は 猫牌（`cat`）・枝豆（`eda`）・AIスイッチ（`om`）の三本を持ち、
   実測帳の図は**三本を一枚に重ねる**。今回測ったのは猫牌だけなので、差し替えると
   **猫牌の線だけが対局の記録、残り二本が無作為50000回**という土台の違う線が並ぶ。
   → **枝豆と AI の二本も同じ記録から測って、揃えて入れる**のが筋。
2. **②の列に古い判定が混じっている。** `core-battle-log-10k.tsv` の verdict 欄は **v1439 の頃**に書いた物で、
   v1440 の「子の三向聴の幅の関門を外す」（**471手・攻め→守り**）が入っていない。その471手は**すべて子**なので、
   子60000手のうち **約0.8pt ぶん②が高めに出ている**（今夜の二本は v1445 で書かれているので問題ない）。
   → **10000局ぶんの verdict を今の本体で判じ直してから②を出し直す。**

どちらも**雲で回せば本体は触らずに済む**。

## ② 差し替えると実測帳の見え方がどう変わるか

**猫牌の「攻め率」の線がどの段も下がる**

| 猫牌 | いま（下敷き） | 差し替え後 | 差 |
|---|---|---|---|
| 0枚 | 58.7% | 47.8% | -10.9pt |
| 1枚 | 49.9% | 37.1% | -12.8pt |
| 2枚 | 43.7% | 25.2% | -18.5pt |
| 3枚 | 39.4% | 14.4% | -25.0pt |
| 4枚 | 36.2% | 7.4% | **-28.8pt** |
| 5枚 | 37.1% | 4.1% | -33.0pt |
| 6枚以上 | 39.9% | 3.3% | **-36.6pt** |

いまの線は **4枚から先で平らになり6枚以上でわずかに上がる**が、新しい線は**最後まで下がり続ける**。

**図の下の固定の読み文のうち二文が事実でなくなる**（L8157〜）

- 「猫牌の線は4枚あたりで平らになり、そこから先は数えても攻め率が動かない」 → 新しい線は下がり続けるので**外れる**
- 「三本は中央で交わり、枚数の少ない側ではAIスイッチが一番高く、多い側では一番低い」 → 多い側で猫牌が **3.3%** と AI（28.6%）より下になるので**外れる**

言葉の選び方はこちらで決めないので、文の直しは候補を出すところまでにする。

**一人ひとりの比べも動く** … 実測帳は、使う人の記録の攻め率を段ごとに下敷きと引き算して
「無作為より高い／低い」を文にしている（L8170〜）。下敷きが下がると、**同じ記録でも「無作為より高い」と出る段が増える**。

**新しく出せる列** … **③攻めが正解だった割合**（32.96%→14.45%）と **④点棒の平均**（+466点→-502点）。
下敷きは①②しか持っていなかったので、この二列は**いまの画面には無い**。
出すなら、文字の表（「猫牌　じぶん 無作為　攻め率 無作為」）の右に二列足すか、表の下に七段の表をもう一枚置く形になる。

## ③ 足す高さと 800x381 の差し引き

**800x381 での差し引きは 0px。** 実測帳は**横向きのとき本体を出さない作り**（`haipaiLedgerRotSync`）で、
800x381（内寸 776x289）では「画面を縦にしてお使いください」の札だけが出ている（カードの高さ 147px）。
**何を足しても横向きの見え方は変わらず、溢れも出ない。**

**参考に縦向き（窓 381x800・内寸 492x708）でも測った**

| | px |
|---|---|
| 実測帳の本体の高さ（いま） | 764 |
| カード（max-height 86vh） | 見えている 608.9／中身 872 |
| ③④の七段の表を一枚足す | **+136** |
| 読み文を一行足す | **+34** |
| **合わせて** | **+170** |

カードの中で送りが **872 → 1042px** に伸びるだけで、`overflow-y:auto` の送れる箱なので**溢れは出ない**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **240件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`猫牌率の下敷きの入れ替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-1.md) | 09-15 21:07 | 猫牌率の下敷きの入れ替え-1 の下調べ |
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

<!-- 控えの一覧 ここまで -->
