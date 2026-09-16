# 猫牌率の文の直し（v1448）と、候補の外の二つ

**終わり** — 2026-09-16（VAIO）。**押し済み `641e6057`**／版は三箇所とも **v1448**／`stable` は v1446 のまま。
検査は速い版で check・adv-check とも PASS。

## 入れた四つ（選ばれたとおり）

| 印 | 場所 | 入れた字 |
|---|---|---|
| **A（乙）** | L8172 | 猫牌の線は数えるほど下がり続け、4枚から先は一割を切る。 |
| **B（乙）** | L8174 | 猫牌とAIスイッチは揃って下がり、枝豆だけが逆向きに上がる。三本は2のあたりで交わる。 |
| **C（甲）** | L8201 | 破線＝対局の記録の子60000手。 |
| **D（甲）** | L8259 | ※ 無作為は対局の記録（子60000手）の実測 |

四つとも**本体に一つしか無い字を錨**にして入れ替え、入れ替えた後の行を字面で確かめた。
`<script>` 四塊は `node --check` 通過、`serifu` も取り直して `--check` で一致。

## E　「無作為」の字（候補・字は今のまま）

実測帳に残っているのは**五箇所**。

1. 表の見出し（L8245・二列ぶん）「猫牌　 じぶん **無作為**　攻め率 **無作為**　正解　点棒」
2. 比べの一言（L8189）「〜の帯は**無作為**より攻めが多い／少ない」
3. L8196「50件以上たまった帯では**無作為**と目立った差がない。」
4. L8197「ただし**無作為**の記録でも…」
5. L8259（D で直した断り）「※ **無作為**は対局の記録（子60000手）の実測」

**甲** … 五箇所を「**記録**」に替える。見出しは「猫牌　 じぶん 記録　攻め率 記録　正解　点棒」。
→ **字数が同じなので表の幅は変わらない。**

**乙** … 五箇所を「**下敷き**」に替える。見出しは「猫牌　 じぶん 下敷き 攻め率 下敷き 正解　点棒」。
→ 一字増えて見出しが約13px 太る（297.1px → 約323px）。幅375の電話は余りが約14px しか無いので、**細い電話で折れる見込み**。

## F　「50〜150件なら約76%、500件でも59.2%」（L8197）

本体の判じ方をそのまま写して測り直した——**50件以上たまった帯だけを見て、じぶんの攻め率と下敷きの差が
10ポイント以上なら一言が出る**（L8188）。その一言が**一つでも出る割合**を 20000回で数えた。

| 件数 | いまの下敷き（子60000手） | 前の下敷き（無作為50000回） |
|---|---|---|
| 50件 | 0.0% | 0.0% |
| 150件 | **14.9%** | 27.8% |
| 500件 | **19.6%** | 36.9% |
| 1000件 | 14.5% | 21.1% |

50件で0%なのは、**50手ではどの帯も50件に届かず**一言が出ないため。

**前の下敷きを同じ数え方で測っても 76%・59.2% にはならない**（27.8%・36.9%）。
いまの文の数は別の数え方から出た物で、こちらでは元の数え方が分からない。

**甲** … 数を出さない言い方にする。
「ただし件数の少ない帯では、下敷きと同じ性質の記録でも差は出やすい。件数が増えるまでは偶然と見ておくこと。」

**乙** … こちらの数え方の数に入れ替える。
「ただし下敷きと同じ性質の記録でも、150件なら約15%、500件でも約20%はこの差が出る。件数が増えるまでは偶然と見ておくこと。」

**丙** … 元の 76%・59.2% がどの数え方から出たかを突き止めてから直す（今は字を変えない）。

## 実機で見るところ

設定の「猫牌率」を**縦向き**で開くと、図の下の読み文が
「猫牌の線は数えるほど下がり続け、4枚から先は一割を切る。」
「猫牌とAIスイッチは揃って下がり、枝豆だけが逆向きに上がる。三本は2のあたりで交わる。」になっている。
その下の小さな断りが「破線＝対局の記録の子60000手。」、表の下が「※ 無作為は対局の記録（子60000手）の実測」。
版の字が **v1448**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **245件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`棚の空き-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A3%9A%E3%81%AE%E7%A9%BA%E3%81%8D-1.md) | 09-14 23:17 | 棚の空き-1 |
| [`y0914-2240.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2240.md) | 09-14 22:40 | 人柄の釦の縮め-1（印 y0914-2240） |
| [`関門の二段-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%96%A2%E9%96%80%E3%81%AE%E4%BA%8C%E6%AE%B5-1.md) | 09-14 22:26 | 関門の二段-1（押しの敷居を押す物で二段に） |
| [`人柄の言葉の棚卸し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BA%BA%E6%9F%84%E3%81%AE%E8%A8%80%E8%91%89%E3%81%AE%E6%A3%9A%E5%8D%B8%E3%81%97-1.md) | 09-14 22:16 | 人柄の言葉の棚卸し-1（前半四人） |

<!-- 控えの一覧 ここまで -->
