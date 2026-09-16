# E と F の字（猫牌率・候補の外の二つ）

**調べた** — 2026-09-16（VAIO）。**本体には触っていない**。入れるのは選ばれた後。`stable` は v1446 のまま。

## E　「無作為」の字（五箇所）

直す場所は `koushu-handan.html` の五箇所 …
L8245 の表の見出し（二列ぶん）／L8189 の一言／L8196／L8197／L8259。

**元の文**

```
無作為
（表の見出し）猫牌　 じぶん 無作為　攻め率 無作為　正解　点棒
（一言）〜の帯は無作為より攻めが多い／少ない
（L8196）じぶんの記録は、50件以上たまった帯では無作為と目立った差がない。
（L8197）ただし無作為の記録でも、…
（L8259）※ 無作為は対局の記録（子60000手）の実測
```

**甲**

```
記録
（表の見出し）猫牌　 じぶん 記録　攻め率 記録　正解　点棒
（一言）〜の帯は記録より攻めが多い／少ない
（L8196）じぶんの記録は、50件以上たまった帯では記録と目立った差がない。
（L8259）※ 記録は対局の記録（子60000手）の実測
```
→ 字数が同じなので**表の幅は変わらない**（見出しは 297.1px のまま）。

**乙**

```
下敷き
（表の見出し）猫牌　 じぶん 下敷き 攻め率 下敷き 正解　点棒
（一言）〜の帯は下敷きより攻めが多い／少ない
（L8196）じぶんの記録は、50件以上たまった帯では下敷きと目立った差がない。
（L8259）※ 下敷きは対局の記録（子60000手）の実測
```
→ 一字増えて見出しが **297.1px → 約323px**。幅375の電話は余りが約14px しか無いので、**細い電話で折れる見込み**。

## F　「50〜150件なら約76%、500件でも59.2%」（L8197）

**元の文**

```
ただし無作為の記録でも、50〜150件なら約76%、500件でも59.2%はこの差が出る。件数が増えるまでは偶然と見ておくこと。
```

**甲**

```
ただし件数の少ない帯では、下敷きと同じ性質の記録でも差は出やすい。件数が増えるまでは偶然と見ておくこと。
```

**乙**

```
ただし下敷きと同じ性質の記録でも、150件なら約15%、500件でも約20%はこの差が出る。件数が増えるまでは偶然と見ておくこと。
```

**丙**

```
（字を変えない）元の 76%・59.2% がどの数え方から出たかを突き止めてから直す。
```

### F の数（今の下敷き・子60000手で測り直した）

本体と同じ数え方 … **50件以上たまった帯だけを見て、じぶんの攻め率と下敷きの差が10ポイント以上なら一言が出る**。
その一言が**一つでも出る割合**を 20000回で数えた。

| 件数 | 50 | 75 | 100 | 125 | 150 | 300 | 500 |
|---|---|---|---|---|---|---|---|
| **いまの下敷き（子60000手）** | 0.0% | 0.0% | 0.0% | **3.1%** | **14.5%** | 23.9% | **19.4%** |
| 前の下敷き（無作為50000回） | 0.0% | — | 0.1% | 6.7% | 27.8% | 42.1% | 37.3% |

- 50件で 0.0% なのは、**50手ではどの帯も50件に届かず**、一言そのものが出ないため。
- **前の下敷きを同じ数え方で測っても 76%・59.2% にはならない**（27.8%・37.3%）。元の数はこちらの知らない数え方から出ている。

## 取り置きの層（古い中身が残っていないか）

**こちらから読むと、素の道でも `?_=時刻` でも `?v=6` でも 7276バイト・候補6件で返る**
（応答の頭は `Content-Length: 7276`／`ETag: "6aaa66f7-1c6c"`／`Last-Modified: Wed, 16 Sep 2026 09:52:55 GMT`＝18:52 JST／`Cache-Control: max-age=600`／`X-Cache: HIT`・`Age: 2`）。
**取り置きの層に古い中身は残っていない**——ただし読む端ごとに別の写しを持ち、**持ちは600秒**なので、
3856バイト・4件で返る端は 18:20 より前に取った写しを抱えている。**10分で切れる**ので、
いま読み直せば 7276バイト・6件になる（すぐ確かめるなら道の末尾に `?v=6` を足す）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **246件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`棚の空き-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A3%9A%E3%81%AE%E7%A9%BA%E3%81%8D-1.md) | 09-14 23:17 | 棚の空き-1 |
| [`y0914-2240.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2240.md) | 09-14 22:40 | 人柄の釦の縮め-1（印 y0914-2240） |
| [`関門の二段-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%96%A2%E9%96%80%E3%81%AE%E4%BA%8C%E6%AE%B5-1.md) | 09-14 22:26 | 関門の二段-1（押しの敷居を押す物で二段に） |

<!-- 控えの一覧 ここまで -->
