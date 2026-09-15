# 猫牌率の下敷きの入れ替え（v1447）

**終わり** — 2026-09-16（VAIO）。**押し済み `99b87317`**／版は三箇所とも **v1447**／`stable` は v1446 のまま。
検査は速い版で check・adv-check とも PASS。**文の候補 A〜D は裁定待ち**（字は今のまま残してある）。

## 入れたもの

**`BASE_CURVE` の三本（猫牌・枝豆・AIスイッチ）を、子60000手の実測へ差し替えた。**

- `pct`＝出現の割合、`atk`＝攻めと判定された割合（**v1446 で判じ直した「いま」の列**）
- 新しく `ok`＝攻めが正解だった割合、`pt`＝点棒の平均 を三本とも持たせた
- 枝豆の6組以上は0手なので `atk`・`ok`・`pt` とも `null`

**③④の二列を出した。** 実測帳の文字の表を

```
猫牌　 じぶん 無作為　攻め率 無作為　正解　点棒
```

にして、右の二列に `BASE_CURVE.cat.ok` と `pt` を出す。**じぶんの記録には結末が無い**ので、この二列は下敷きの値だけ。
図（三本の線）はそのまま三本とも描けている（path 6本＝下敷き3本＋じぶん3本）。

## 表の幅

窓 381x800（内寸 492x708・表の箱 419px）で、いちばん長い行は見出しの **297.1px**、**余り 121.9px で折れない**。

headless は窓の幅を 492px より狭くできないので、細い電話は計算で当てた（表の箱の幅はおおよそ「92vw − 34px」）。

| 電話の幅 | 表の箱 | 見出し 297px |
|---|---|---|
| 375 | 約311px | 折れない（余り約14px） |
| 360 | 約297px | ほぼぴったり |
| 320 | 約260px | **折れる** |

前の表は見出しが約219px だったので、足した二列ぶん（約78px）細い電話で余りが減った。

## 直しの候補（字は今のまま・選ぶのはそちら）

**A 図の下の読み文（L8157）**
- 今 … 「猫牌の線は4枚あたりで平らになり、そこから先は数えても攻め率が動かない。」
- 甲 … 「猫牌の線は0枚から6枚以上まで一貫して下がり、4枚を越えると攻めはほぼ出ない。」
- 乙 … 「猫牌の線は数えるほど下がり続け、4枚から先は一割を切る。」

**B 図の下の読み文（L8157）**
- 今 … 「三本は中央で交わり、枚数の少ない側ではAIスイッチが一番高く、多い側では一番低い。」
- 甲 … 「三本は2のあたりで交わり、少ない側ではAIスイッチが一番高く、多い側では枝豆だけが跳ね上がる。」
- 乙 … 「猫牌とAIスイッチは揃って下がり、枝豆だけが逆向きに上がる。三本は2のあたりで交わる。」
- ＊今の値では、AI が一番低いのは4枚と5枚だけで、6枚以上では猫牌の方が低い。

**C 図の下の小さな断り（L8187）**（差し替えで事実でなくなった）
- 今 … 「破線＝無作為50000回。」
- 甲 … 「破線＝対局の記録の子60000手。」
- 乙 … 「破線＝機械打ち同士の一局戦から子だけ60000手。」

**D 表の下の断り（L8240）**（差し替えで事実でなくなった）
- 今 … 「※ 無作為は赤入りの山から50000回配った実測」
- 甲 … 「※ 無作為は対局の記録（子60000手）の実測」
- 乙 … 「※ 無作為は機械打ち同士の一局戦10000局×2から子だけ60000手の実測」

## 気づいた所（触っていない）

- 表の見出しの「**無作為**」と、じぶんの記録を比べる文の「ただし無作為の記録でも、50〜150件なら約76%、500件でも59.2%はこの差が出る」（L8183）は、元の50000回に合わせた言い方・数字のまま。
- 説明欄の L1495・L1518 の「無作為50000回で測ると…」は下敷きとは別の測りを語っているので、今回の差し替えとは関わらない。

## 実機で見るところ

設定の「猫牌率」を**縦向き**で開くと、文字の表に「正解」「点棒」の二列が増え、0枚が **33%・+466**、6枚以上が **14%・-502** になっている。
「無作為」の攻め率の列は 0枚 **48%**・4枚 **8%** と、前（58%・36%）より低い。図の破線（下敷き）も三本とも下がって見える。
版の字が **v1447**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **242件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`棚の空き-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A3%9A%E3%81%AE%E7%A9%BA%E3%81%8D-1.md) | 09-14 23:17 | 棚の空き-1 |
| [`y0914-2240.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2240.md) | 09-14 22:40 | 人柄の釦の縮め-1（印 y0914-2240） |
| [`関門の二段-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%96%A2%E9%96%80%E3%81%AE%E4%BA%8C%E6%AE%B5-1.md) | 09-14 22:26 | 関門の二段-1（押しの敷居を押す物で二段に） |
| [`人柄の言葉の棚卸し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BA%BA%E6%9F%84%E3%81%AE%E8%A8%80%E8%91%89%E3%81%AE%E6%A3%9A%E5%8D%B8%E3%81%97-1.md) | 09-14 22:16 | 人柄の言葉の棚卸し-1（前半四人） |
| [`v1442-確かめ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/v1442-%E7%A2%BA%E3%81%8B%E3%82%81.md) | 09-14 22:13 | v1442 の確かめ（四件）と 見張りの止まり-2 |
| [`y0914-2115.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2115.md) | 09-14 21:17 | 投票欄の角と釦の押せ（印 y0914-2115） |
| [`合わせ技-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-4.md) | 09-14 21:06 | 合わせ技-4（合計を六つの区切りで帯に切る） |

<!-- 控えの一覧 ここまで -->
