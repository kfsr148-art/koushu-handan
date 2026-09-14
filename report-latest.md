# 件名の拾い方-4 と stable の進め（v1445）

**終わり** — 2026-09-15 01:4x（VAIO）。本体には触っていない。

## 取り出し経路（先に一行ずつ）

| | 経路 |
|---|---|
| **控え側** | 枠が届くと `frame-work.ps1` が `subject.ps1` の `Get-Subject` に通して件名を作り（L122-123）、`work-note.txt` の `件名:` へ書く |
| **出ている側** | `inbox-watch.ps1` が巡回のたびに `last-order.txt` の二行目を読み、**頭24字をそのまま切って** `$ordMark` にしていた（L358-359）。これが `state.json` の「作業中の件名」とパネルに出る |

## どちらが誤りか → **出ている側**

控えは `Get-Subject` を通っており、指示の文の切り方——**「〜にヨシ。」の文を飛ばす／最初の「。」か改行まで／頭の番号（1. ②（3））を落とす**——に従っている。
**出ている側だけが生の頭24字**で、句点をまたいで本文を拾っていた。

## 直し

`inbox-watch.ps1` の L358 の枝を、`subject.ps1` を読み込んで **`Get-Subject` に通す**形にした。
読めなかった時だけ、今までどおり頭24字へ落ちる。

- 写し … `inbox-watch.ps1.bak-20260915`
- 構文検査 … OK
- 作法29 ⑤のとおり**常駐を起こし直した** … 台本の更新 **01:30:07** ＜ 常駐の起動 **01:30:48**

## 偽の送り手で二件とも通した

本物の ntfy・push・commit は一度も叩いていない（作法14）。

| | 控え | いままで（頭24字） | 直した後 |
|---|---|---|---|
| 一件目 | `合わせ技-2` | `合わせ技-2。本体には触らず、合わせ技-1 と同` **★食い違う** | `合わせ技-2` **一致** |
| 二件目 | `関門の二段-1` | `関門の二段-1。pre-push の敷居を押す物` **★食い違う** | `関門の二段-1` **一致** |

二件とも控えと出ている字が揃うので、**subj-gap（件名の食い違いの訴え）は立たない**。

## stable

**v1445 ヨシ**を受けて進めた。

```
stable  ca25c52d（v1444）  →  fde8859d（v1445）
```

## 残り 4件

夜の較正-1 ／ 保留の棚卸し-1 ／ 帯の点検-1 ／ 猫牌率の材料

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **237件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0913-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0913-0015.md) | 09-13 00:34 | 配信の切り分け-1（印 y0913-0015） |
| [`y0912-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2100.md) | 09-12 21:21 | 選択釦-1 — v1439（印 y0912-2100） |

<!-- 控えの一覧 ここまで -->
