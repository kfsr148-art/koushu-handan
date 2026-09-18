# 空きの内訳-2

**終わり（残り0件）** — 2026-09-18（VAIO）。**数えただけ**。何も止めていないし、触ってもいない。

**一行で** … 三つ合わせて **約310〜360MB**。いまの空き（中央1092MB）が **約1400〜1450MB** になる当て。

## ① claude を開き直した直後は何MBか … **270〜360MB**（いまは447〜483MB）

`jam-snap.log`（詰まりのたびに撮った31枚）から、claude の使用MBを全部拾った。

| 起き直した後の早い時期 | 使用MB |
|---|---|
| 09-12 02:32:32（pid 7272） | **270MB** |
| 09-11 14:12:41（pid 7124） | **303MB** |
| 09-10 17:38:45（pid 4080） | **357MB** |

**いまの pid 4796（09-12 21:51 起動）** … 09-16 21:25 **427MB** ／ 09-17 13:35 **395MB** ／
09-18 01:45 **399MB** ／ 今日の150秒の実測 **447〜477MB**（中央461MB）・一度きりの測りで483MB。

**当て … 開き直せば 270〜360MB（中ほど303MB）へ落ちる見込みで、戻りは約150〜180MB。**

＊ただし**単調に膨らんではいない**。同じ pid が 395〜483MB を六日間行き来しており、
　09-08 の古い pid も 231MB〜565MB の幅で揺れていた。**戻りは一時的**と見ておくこと。

## ② MsMpEng（Defender）は押し・検査の刻にどれだけ伸びるか … **十数MB**

**記録には残っていない。** `jam-snap.log` の「重い」は**CPU秒の上位**で選ぶので、MsMpEng は一度も載っていない。
そこで1.2秒ごとに100回（約2分）測り、押しの刻を捕まえた。

```
21:00:28  MsMpEng 338MB  空き 904MB  git,git
21:00:37  MsMpEng 339MB  空き 938MB  git,git,git,git-remote-https
21:00:39  MsMpEng 342MB  空き 926MB  git×4,git-remote-https   ← いちばん高い
```

| | MsMpEng |
|---|---|
| 押しが居た回（7回） | 中央 **339MB**／いちばん高い 342MB |
| 押しが居ない回（93回） | 中央 **328MB**／いちばん高い 342MB |
| 別の150秒の測り | 305〜334MB（中央327MB） |

**伸びは中央の差で +11MB。いちばん高い値はどちらも342MBで同じ。**
押しの刻に大きく伸びてはいない。

**作業場を除外に入れた場合** … **実測では当てられない**（除外を入れないと測れず、この枠は「触る所は無し」）。
上の数字から言えるのは、**常駐の大きさは 305〜342MB の狭い帯で、押しの刻の伸びも十数MB**ということ。
除外は**走査の手間（CPU）を減らす物**で常駐の大きさはほとんど変わらないので、
**減っても十数MB**という当てになる。

## ③ VCAgent と SearchIndexer を止めた場合の戻り … **約160MB**

| | いまの使用MB（150秒の実測） |
|---|---|
| **VCAgent** | **109MB**（ずっと109MB・揺れない） |
| **SearchIndexer** | **61〜67MB**（中央62MB） |
| 合わせて | **約171MB** |

実際の空きの増えは使用MBより少し少ない。今日の Edge の実測が目安になる
（**174MB の十本を落として、空きの増えは166MB＝95%**）。同じ割合なら **約160MB**。

＊止めると落ちる働き … `SearchIndexer` は**探し物の索引**（エクスプローラの検索が遅くなる）、
　`VCAgent` は**VAIO の道具**（機械の設定まわり）。**止めていないし、止めるかはこちらで決めない。**

## 三つの合計

| | 戻りの当て |
|---|---|
| ① claude を開き直す | **+150〜180MB**（一時的） |
| ② 作業場を除外に入れる | **+0〜十数MB** |
| ③ VCAgent と SearchIndexer を止める | **+約160MB** |
| **合わせて** | **+約310〜360MB** |

**いまの空き（中央1092MB・幅1014〜1118MB）＋310〜360MB ＝ 約1400〜1450MB。**
総メモリ3975MBに対して 27%→36% ほどになる当て。

## 触った所と触らない所

**触った所** … 無し。**止めた物も無し。**

**触らない所** … 本体・`~/.claude` の台本・`claude` の窓（開き直していない）・Defender の除外の決め・
`VCAgent`／`SearchIndexer`・予定表の起こし・敷居（譲り700MB／押し768MB）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **270件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0918-0716.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0716.md) | 09-18 07:19 | 夜の較正-2 |
| [`y0918-0352.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0352.md) | 09-18 03:56 | 止まりの札の敷居-1 |
| [`y0917-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2140.md) | 09-17 21:35 | 呼び名の揃え-1 の下調べ |
| [`y0917-2122.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2122.md) | 09-17 21:25 | 問いかけの判じ-1 |
| [`y0917-2102.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2102.md) | 09-17 21:14 | 訴えの棚卸し-1 |
| [`y0917-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2050.md) | 09-17 20:52 | 古い字の掃除-2 |
| [`y0917-2009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2009.md) | 09-17 20:14 | 古い字の掃除-1 |
| [`y0917-1944.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1944.md) | 09-17 19:55 | 押しの詰まり-1 |
| [`y0917-1611.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1611.md) | 09-17 16:26 | 譲りの判じの位置-1 ／ done-stale-note の空振り-1 |

<!-- 控えの一覧 ここまで -->
