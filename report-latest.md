# 条件の数の棚卸し（mitate-kazoe.txt）

**済** — 2026-09-19（VAIO）。**調べだけ。本体には触っていない。文面も直していない。**

## 押した結果

```
$ git ls-tree origin/main mitate-kazoe.txt
100644 blob 61d09d3ef911409fcca40e22d81d88e877a29f00	mitate-kazoe.txt
```

raw も **HTTP 200**。**リポジトリ直下**に 14400バイトで置いた。

## 値は全部**実測**

書いた数は目で追った見積もりではなく、**本体の写しに probe を差して雲で13枚を判定させた実測**。
読んだのは**本体が元から持っている控え**だけ（`window._lastA`／`_lastFacts`／`_toolCount`／`_lastCut`）で、
診断口は足していない（作法15）。写しは終わったら消す（作法14）。
台は `mitate-kazoe.js`（新）、走りは **35403631391（success）**。

## 中に書いた物（頼まれた全項目）

| 区分 | 項目 | 定義の行 |
|---|---|---|
| 七人 | `F.multi` | L4430-4441 |
| | `F.naki`（yakuhai／somete／atsumi） | L4446-4471 |
| | `F.dup`（double／suji） | L4490-4512 |
| | `weakShapes` | L2671（数え方 L2736-） |
| | `F.lady` の `plan`・`restTate` | L4513-4528 |
| | `F.floatIdx`／`floatTop` | L4518-4525 |
| | `F.ichi`（strong／edge／honor／none） | L4531-4551 |
| | `F.sensei` | L4553-4566 |
| 帯 | 枝豆（二枚以上ある種類） | L4170／L5220／L5221-5225 |
| | AI（一枚きりの字牌） | L4171-4172／L8714-8733 |
| | 現場猫（猫牌＝孤立した数牌） | L5306-5318／L8598 |
| | 兎（残り枠） | L4156-4163／L8769／L8787 |
| 枠 | `fillRemain`／`fillGood`／`fillWeak` | L2765-2814・値は L2816-2818 |
| 兎の式 | `goodShapes` | L2670／使う所 L4161 |

**それぞれに13枚の実例を一つずつ**（牌の並びと、実際に出た値）。末尾に測った10手の一覧も付けた。

## 実測で分かったこと（三つだけ書き出す）

- **兎の「弱い余りN」は `a.fillWeak` そのもの**（L8769）。別に数えている物ではない
- **現場猫の猫牌は「孤立した数牌」だけ**で、**字牌は数えない**（L5316）。
  `19m19p19s1234567z` で猫牌は6枚＝么九の数牌6枚がすべて孤立、字牌7枚は数に入らない
- **役牌の対子でも `F.naki` が `yakuhai` にならない席がある**。`234m567p234s1122z` は東が2枚だが
  場風でも自風でもないため `atsumi`（`a.yakuhaiPair` も false）

## 測っていない枝（正直に）

`F.naki` の **①yakuhai**（役牌の対子が立つ席）と、`F.dup` の **②suji**（筋かぶり）は、
この十手では成立しなかった。**条件の字は綴りに書いてあるが、値の実例は無い。**

## 触った所と触らない所

**触った所** … `mitate-kazoe.txt`（新・直下）／`mitate-kazoe.js`（新・測りの台）／
`.github/workflows/mitate-kazoe.yml`（新・手で起こす）。

**触らない所** … 本体（`koushu-handan.html`）・`mitate.txt`・`serifu.txt`・`check.js`・
`ver.txt`・`stable`・`~/.claude` の台本。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **279件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0919-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0800.md) | 09-19 08:00 | 条件の数の棚卸し（mitate-kazoe.txt） |
| [`y0919-0725.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0725.md) | 09-19 07:43 | 見立て行の尺の縛りを外す |
| [`y0919-0450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0450.md) | 09-19 07:04 | 見立て行の棚卸し（mitate.txt） |
| [`y0919-0427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0427.md) | 09-19 04:32 | 再起動-2 |
| [`y0918-2212-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212-2.md) | 09-19 04:20 | 再起動-1（後の測り） |
| [`y0918-2212.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212.md) | 09-18 22:12 | 再起動-1（前の測り） |
| [`y0918-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2155.md) | 09-18 22:02 | 押しの敷居-2 |
| [`y0918-2145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2145.md) | 09-18 21:47 | 空きの片付け-2（後の測り） |
| [`y0918-2109.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2109.md) | 09-18 21:12 | 空きの片付け-2 |
| [`y0918-2055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2055.md) | 09-18 21:01 | 空きの内訳-2 |
| [`y0918-2049.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2049.md) | 09-18 20:53 | 鍵切れの見張り-1 |
| [`y0918-2035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2035.md) | 09-18 20:38 | 配信の譲り-1（乙・通し切る形へ） |
| [`y0918-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1953.md) | 09-18 20:00 | 配信の譲り-1 の下調べ |
| [`y0918-1923.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1923.md) | 09-18 19:24 | 公開の追いつき-1 |
| [`y0918-1846.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1846.md) | 09-18 19:05 | 起こしの重なり-1（乙・刻をずらす） |
| [`y0918-1831.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1831.md) | 09-18 18:35 | 起こしの重なり-1 の下調べ |
| [`y0918-1757.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1757.md) | 09-18 17:59 | 空きの片付け-1 |
| [`y0918-1747.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1747.md) | 09-18 17:50 | 空きの内訳-1 |
| [`y0918-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1305.md) | 09-18 13:06 | 軽い巡回の刻-1 |
| [`y0918-1221.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1221.md) | 09-18 12:24 | 止まりの読み-4 |

<!-- 控えの一覧 ここまで -->
