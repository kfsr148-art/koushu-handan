# 説明欄「二、どう使うの？」の直し（v1450）

**終わり** — 2026-09-17（VAIO）。**押し済み `ed7ce66d`**／版は三箇所とも **v1450**／`stable` は v1449 のまま。
検査は速い版で check・adv-check とも PASS。

## 入れた三つ（選ばれたとおり）

| 印 | 場所 | 入れた字 |
|---|---|---|
| **①（甲）** | L1442 | `例 18m 1357p 3368s 東南西` |
| **②（乙）** | L1442 の末尾 | `牌がそろったら「判定する」。十枚から押せて、十三枚が上限。` |
| **③（乙）** | L1445 | `兎を押すと、切る候補があれば「切るなら〈牌〉」が一行出てその牌が琥珀で光り、無ければ「弱い余りN——この帯は判定に回す」と出る。` |

**直した後の二の一段目（そのまま）**

```
牌の入れ方は二通り。盤面の牌を押すか、数字で打つ。m=萬 p=筒 s=索で、数字のあとに種類——18m＝一萬・八萬。
字牌はキーボードなら 1z〜7z（東南西北白發中）。赤五は 0（0m＝赤五萬）。例 18m 1357p 3368s 東南西。
漢字・英字どちらでも通る。牌がそろったら「判定する」。十枚から押せて、十三枚が上限。
```

## 確かめ

- **例の牌は13枚**になった（数牌10＋字牌3）。数えて確かめた
- 押せる枚数は本体の `judgeBtn.disabled = (hand.length < 10 || hand.length > 13)` と揃った
- 兎の落ちの枝（`L4868` の「弱い余りN——この帯は判定に回す」）が字に入った
- 三つとも**本体に一つしか無い字を錨**にして入れ替え、入れ替えた後の行を字面で確かめた
- `<script>` 四塊は `node --check` 通過、`serifu` も取り直して `--check` で一致

## 実機で見るところ

題の画面から「この判定、信用できるの？」を開き、**「二、どう使うの？」**の一段目を読むと、
例が **`18m 1357p 3368s 東南西`**（13枚）になり、末尾が **「牌がそろったら「判定する」。十枚から押せて、十三枚が上限。」**。
四段目の兎の行が **「…切る候補があれば「切るなら〈牌〉」が…無ければ「弱い余りN——この帯は判定に回す」と出る。」**。
版の字が **v1450**。

## 残り

説明欄の点検-1 で挙げた食い違いは、これで三つとも片付いた。
候補に入れていない一点（二の節の「AI」と四の節の「紳士」の呼び名の違い）は、**外れてはいない**ので今のまま。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **249件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`説明欄の直し-v1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E7%9B%B4%E3%81%97-v1450.md) | 09-17 13:32 | 説明欄「二、どう使うの？」の直し（v1450） |
| [`y0917-1145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1145.md) | 09-17 12:48 | 説明欄の点検-1（六節の字と、いまの本体の食い違い） |
| [`猫牌率のEF-v1449.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AEEF-v1449.md) | 09-16 21:26 | 実測帳の E 甲・F 乙（v1449） |
| [`y0916-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-1900.md) | 09-16 19:04 | E と F の字（猫牌率・候補の外の二つ） |
| [`猫牌率の文の直し-v1448.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%96%87%E3%81%AE%E7%9B%B4%E3%81%97-v1448.md) | 09-16 13:09 | 猫牌率の文の直し（v1448）と、候補の外の二つ |
| [`y0916-0707.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0707.md) | 09-16 07:09 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`y0916-0436.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0436.md) | 09-16 07:06 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`猫牌率の下敷きの入れ替え-v1447.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-v1447.md) | 09-16 04:35 | 猫牌率の下敷きの入れ替え（v1447） |
| [`猫牌率の測り直し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%B8%AC%E3%82%8A%E7%9B%B4%E3%81%97-2.md) | 09-15 22:31 | 猫牌率の測り直し-2 |
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

<!-- 控えの一覧 ここまで -->
