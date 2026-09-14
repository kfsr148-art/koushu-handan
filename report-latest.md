# 四枚の札の縮め-1（v1445）

**終わり** — 2026-09-15 02:0x（VAIO）。**押し済み `fde8859d`**／版は三箇所とも **v1445**／`stable` は v1444 のまま。
検査は速い版で check・adv-check とも PASS。

## 丙が何をする物か

**「題が点いている間だけ、四枚の札の帯（`.reasons`）そのものを畳む」一行の決まり。**

```css
body.reason-open .reasons { display: none; }
```

**常の姿は何も変えない。** 押していない間は今までどおり四枚が並び、**押した回だけ帯が消えて**、
そのぶんの高さが**見立て行の二行目**へ回る。

## ④で溢れる高さ … 12px から 0px へ

| 窓（内寸） | 押す前の二択 | 二行にした時の見込み | **丙を入れて押した時** |
|---|---|---|---|
| **800x381**（776x289） | 285px・余り **4.0px** | 301px＝**12px はみ出す** | **275.8px・余り 13.2px** |
| **844x390**（820x298） | 290.8px・余り **7.2px** | 306.8px＝**8.8px はみ出す** | **280.3px・余り 17.7px** |
| 568x320（544x228） | 224px・余り 4.0px | — | 224px・余り 4.0px（変わらず） |

**はみ出しは 12px → 0px。余りは 4.0px → 13.2px（+9.2px）。**
見込みの 19px より大きく空いたのは、**帯の上下の余白も一緒に消える**ため。
568x320 で変わらないのは、この視野では二択が帯より上に来るから。

## 触った所

1. `body.judged .r-detail { display: none; }` を三つの帯（L1159 が出す・L1198 と L1256 が消す）**より後ろ**に置き、**どの視野でも本文を出さない**（いままでは広い視野だけ出ていた）
2. 題（`.r-title`）に `data-r` と `onclick` を付け、**`window.reasonTap(i)` を新設**。押すと見立て行にその本文を**そのまま**出す（**文は縮めない**）
3. `applyToneMark` に `rN` の鍵を足し、`body.reason-open` と題の点灯を切り替える
4. `body.reason-open .say-text` を**二行まで**（`-webkit-line-clamp: 2`）
5. **丙** … `body.reason-open .reasons { display: none; }`

## 触っていない所

- **判定そのもの**（`analyze`・`verdict`・四枚の中身の計算）
- **人柄と四つの釦の文**（今までどおり一行）
- **札の並び順と題・数字の字**
- **四枚の本文の字**（縮めていない）
- 見張り台と説明欄

## 実測

**押し替えは三通り×四枚＝12回とも、題が点き、もう一度押すと元の見立て行へ戻った。**
開いているのは常に一つ（`toolMark` 一本に乗せたので、人柄や四つの釦を押しても自動で戻る）。
**どの視野でも本文が出ている札は無い。**

**見立て行が二行に伸びるのも確かめた** … 568x320（幅が狭い）では「埋まり」の本文が 32px＝二行。
800x381 は幅 746px あるので同じ文が一行に収まり 24px のまま。

## 実機で見るところ

判定画面の四枚の札が**題と数字の一行だけ**で横に並ぶ（本文は出ない）。
**題を押すと**上の見立て行がその札の本文に入れ替わり、題が**金色に点き**、四枚の帯が消える。
**もう一度押すか人柄・四つの釦を押すと元へ戻る。** 末尾の二択は押しても画面の内に残る。
版の字が **v1445**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **236件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0912-2015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2015.md) | 09-12 20:16 | ヨシの猫-7 — ヨシ待ちの頭を現場猫の顔へ（印 y0912-2015） |

<!-- 控えの一覧 ここまで -->

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 終わりました（返事不要）

```
四枚の札の縮め-1（v1445）の工事
この回は控えを書いていません（前の回の控えが残っています。中身は当てになりません）。
```

### 2. 🪟 見張りが止まっていました（01:15〜01:28・13分）

```
見張りの巡回（watch-notify）が前回から 13分空いていました。
前回の記録 2026-09-15 01:15:17／今回 2026-09-15 01:28:04

＊どの段で止まったかは ~/.claude/watch-step-log.txt の足跡にあります。
```

### 3. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 4. 🙋 ヨシしてください

```
四枚の札の縮め-1 の下調べ（①〜④）— 宣言
印: y0915-0130
待っているのは：④で溢れるので、手当ての甲乙丙のどれにするか（丙を推す）。工事はまだ入っていない。
答え方：「y0915-0130 にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
未検収: 四枚の札の縮め-1（この宣言のヨシ待ち）／件名の拾い方-4／保留の棚卸し-1／夜の較正-1／帯の点検-1／猫牌率の材料
```

### 5. 🪟 連携に訴えがあります（subj-gap）

```
連携の見張りから訴えが出ています。

・subj-gap … 作業中の件名が食い違っている（控え「四枚の札の縮め-1 の下調べ（①〜④）— 宣言」／出ている「残りの三件を上から順に。①保留の棚卸し-1＝塞げ」）

＊同じ種類が続く間は、これ以上鳴らしません。
＊全部の記録は ~/.claude/pipe-warn.log にあります。
```

<!-- 送った知らせ ここまで -->
