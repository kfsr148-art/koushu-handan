# 止まりの読み-4

**終わり（残り0件）** — 2026-09-18（VAIO）。**読みだけ**。直しは入れていない。本体にも触っていない。

**結論から** … これは**止まりではない**。譲り（軽い巡回）と入口の見送りが**状態の書き足しまで行かずに返る**ので、
空きの見張りが「12分止まっていた」と読み違えた。**譲りで避けられたはずの回ではなく、譲りが作った見かけの空き。**

## ① 足跡（08:12〜08:25）

| 刻 | その回がどう終わったか | 譲りの判じ |
|---|---|---|
| 08:12:09 | 最後まで通った（完了 08:12:40）。**この回が状態を書いた最後** | 重くない |
| 08:13:13 | **入口が重かった（20.5秒）**ので先へ進まない（完了 08:13:34） | （判じまで行かず） |
| 08:14:09 | **軽い巡回で回った（空き 437MB）**・完了 08:14:15 | **重い**（ふつうの巡回から1分） |
| 08:18:05 | **軽い巡回で回った（空き 524MB）**・完了 08:18:15 | **重い**（5分） |
| 08:22:32 | **軽い巡回で回った（空き 549MB／git-remote-https1本）**・完了 08:22:55 | **重い**（9分） |
| 08:24:19 | ふつうに回った（10分の決めを超えたため）。08:24:59 に状態を書いた | 重いが10分超 |

**どの段でも固まっていない。** いちばん長い段でも 08:12:24 の「鍵の見回り +11.8秒」。
**四回続けて、状態を書く前に返っていた**（入口の見送り1回＋軽い巡回3回）。

```
08:24:59  巡回の空きを見つけた：2026-09-18 08:12:34 から 12分。札を立てた
```

## ② 重い仕事との重なり（刻で突き合わせ）

| 何と重なったか | 実測 |
|---|---|
| **雲の配信** | 08:00〜08:23 は**一本も走っていない**。最初の走りは 08:23:14（28秒） |
| **押し** | 08:23:16〜17 に「**空きが乏しいので押しを見送る（空き 358MB**・敷居768MB）」 |
| **帯（heavy.txt）** | **上がっていない**（いまも無い）。`heavy-skip.log` にも 08時台の見送りは無い |
| **機械の空き** | 08:14 **437MB** → 08:18 **524MB** → 08:22 **549MB** → 08:23 **358MB** |

**重なっていたのは外の仕事ではなく、機械の空きそのもの。** 譲りの判じが言う「重い」は
**空きが700MBを切っていること**を指していて、この12分はずっとその下にいた。
08:22 だけ `git-remote-https` が1本立っていた（押しの送り）。

＊起こしの間隔も延びている（08:14 → 08:18 → 08:22 と**4分おき**）。帯は上がっていないので
　間引きの関門ではなく、**空きが乏しくて台本の立ち上がりが遅れた**側（08:13 の「入口が重かった 20.5秒」が同じ現れ）。

## ③ 元は一つ … **軽い巡回が状態を書かずに返ること**

譲りは**正しく働いていた**。空きは437〜549MBで、譲る決め（700MB未満）のとおり。
避けられたはずの回ではない。

元は**空きの見張りの読み方**にある。

- 空きの見張りは `watch-status.log` の**前回の刻との差**だけを見る
- ところが**軽い巡回は「生存の合図」を打った直後に返る**ので、状態の一行を書かない
  （入口が重かった回も同じく書かずに返る）
- だから譲った回が続くと、**巡回は毎分生きているのに記録だけが空く**

10分の決め（`$LIGHT_MAX_MIN`）で 08:24 にふつうへ戻り、そこで差が **12分**と出て、
昨日入れた**10分の敷居**（止まりの札の敷居-1）をわずかに超えて札が立った。

＊**直しの向きだけ一行**（入れていない）… 軽い巡回でも状態の一行は書いて返るか、
　空きの見張りを `watch-step-log.txt` の最終行（軽い回も刻む）で見るかの、どちらか。

## 触った所と触らない所

**触った所** … 無し（読んだだけ）。

**触らない所** … 本体・`watch-notify.ps1`（譲りの段・状態の書き足し・空きの見張り）・
10分の敷居・`$LIGHT_FREE_MB`（700MB）・`$LIGHT_MAX_MIN`（10分）・`heavy-gate.ps1`・記録の過去の行。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **260件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0917-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1450.md) | 09-17 14:59 | pub-late の予備の数え方-1 ／ 13:32 の done-stale-note ／ 13:13 の見張りの止まり |
| [`説明欄の直し-v1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E7%9B%B4%E3%81%97-v1450.md) | 09-17 13:32 | 説明欄「二、どう使うの？」の直し（v1450） |
| [`y0917-1145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1145.md) | 09-17 12:48 | 説明欄の点検-1（六節の字と、いまの本体の食い違い） |
| [`猫牌率のEF-v1449.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AEEF-v1449.md) | 09-16 21:26 | 実測帳の E 甲・F 乙（v1449） |
| [`y0916-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-1900.md) | 09-16 19:04 | E と F の字（猫牌率・候補の外の二つ） |
| [`猫牌率の文の直し-v1448.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%96%87%E3%81%AE%E7%9B%B4%E3%81%97-v1448.md) | 09-16 13:09 | 猫牌率の文の直し（v1448）と、候補の外の二つ |
| [`y0916-0707.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0707.md) | 09-16 07:09 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`y0916-0436.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0436.md) | 09-16 07:06 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`猫牌率の下敷きの入れ替え-v1447.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-v1447.md) | 09-16 04:35 | 猫牌率の下敷きの入れ替え（v1447） |
| [`猫牌率の測り直し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%B8%AC%E3%82%8A%E7%9B%B4%E3%81%97-2.md) | 09-15 22:31 | 猫牌率の測り直し-2 |

<!-- 控えの一覧 ここまで -->
