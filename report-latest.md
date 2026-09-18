# 空きの内訳-1

**終わり（残り0件）** — 2026-09-18（VAIO）。**数えただけ**。何も落としていない。本体にも触っていない。

## ① いまの空きと、使っている量の上位10本

**2026-09-18 17:47:57 … 空き物理メモリ 920MB／総 3975MB**（測ったのはこの一度きり）

| 名 | pid | 使用MB | 起きた刻 |
|---|---|---|---|
| **claude** | 4796 | **483** | 09-12 21:51:56（**6日**） |
| MsMpEng（Defender） | 3912 | 332 | （取れず） |
| VCAgent | 6236 | 101 | （取れず） |
| explorer | 6648 | 96 | 09-10 18:25:50 |
| powershell（inbox-watch） | 9716 | 89 | 09-15 01:30:48 |
| Memory Compression | 2096 | 85 | （取れず） |
| **msedge（親）** | 4892 | 83 | 09-15 17:33:55（**3日**） |
| powershell（この測りの窓） | 9884 | 70 | 09-18 17:47:55 |
| SearchIndexer | 10960 | 67 | （取れず） |
| svchost | 3276 | 64 | （取れず） |

**上位10本で約1470MB。** うち **claude 483MB が単独で最大**で、総メモリ3975MBの12%を占める。

## ② 常駐の本数と、いまの仕事に要る／要らない

| 名 | 本数 | 合計MB | 中身 | 要るか |
|---|---|---|---|---|
| **claude** | 1 | **500** | 09-12 21:51 から6日。いまの仕事そのもの | **要る** |
| **msedge** | **10** | **175** | 親1・renderer2・utility5・gpu1・crashpad1。**すべて 09-15 17:33〜20:54 起動** | **要らない**（下記） |
| powershell | 5 | 361 | **常駐は inbox-watch.ps1（80MB・09-15 01:30 から）の1本だけ**。残りは毎分の起こし（revive／watch-notify＝heavy-gate 経由／jam-watch）とこの測りの窓で、**いずれも数秒で消える一時の物** | 要る |
| **node** | **0** | 0 | — | — |
| conhost | 5〜7 | 30〜57 | 上の窓に付く物 | 要る |

### 要らないと判じた物 … **Edge 10本・175MB**

```
窓を持つ Edge … pid 4892  題[Sign in - Claude - プロファイル 1 - Microsoft Edge]  83MB
```

- **headless の旗つき 0本／`koushu-` の目印つき 0本** … **古い検査の残りではない**
  （作法14 の「VAIO で headless Edge は二度と立てない」は守られている）
- 窓を持つのは親1本だけで、題は「**Sign in - Claude**」。**09-15 17:33 に開いた署名の頁が3日そのまま**
- 残る9本はその窓にぶら下がる子（renderer・utility・gpu・crashpad）

**落としていない。** 名と使用MBを書くだけに留めた（この枠の決めのとおり）。

## 空きが 358〜549MB まで落ちる時間帯との繋がり（記録から）

いまは 920〜960MB あるが、記録に残る低い刻はこう。

| 刻 | 空き | そのとき |
|---|---|---|
| 09-18 08:14 | 437MB | 軽い巡回で譲った |
| 09-18 08:18 | 524MB | 同上 |
| 09-18 08:22 | 549MB | 同上（git-remote-https 1本） |
| 09-18 08:23 | **358MB** | 押しを見送った（敷居768MB） |
| 09-18 12:24 | 425MB | 軽い巡回で譲った |

**毎分の起こしが三つある**（`ClaudeRevive`／`ClaudeWatchNotify`／`ClaudeJamWatch` がいずれも PT1M）。
powershell 一本が **70〜128MB** 食うので、三本が重なると **200〜380MB** が一時に乗る。
そこへ押し（git）や claude 自身の伸びが重なった刻が、358〜549MB の帯に当たる。

＊数えただけで、直しの候補は出していない（この枠の決めのとおり）。

## 触った所と触らない所

**触った所** … 無し。**落とした物も無し。**

**触らない所** … 本体・`~/.claude` の台本・予定表の起こし（三つの PT1M を含む）・Edge の10本・
`claude` の窓・`inbox-watch.ps1` の常駐・敷居（譲り700MB／押し768MB）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **262件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0917-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1450.md) | 09-17 14:59 | pub-late の予備の数え方-1 ／ 13:32 の done-stale-note ／ 13:13 の見張りの止まり |
| [`説明欄の直し-v1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E7%9B%B4%E3%81%97-v1450.md) | 09-17 13:32 | 説明欄「二、どう使うの？」の直し（v1450） |
| [`y0917-1145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1145.md) | 09-17 12:48 | 説明欄の点検-1（六節の字と、いまの本体の食い違い） |
| [`猫牌率のEF-v1449.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AEEF-v1449.md) | 09-16 21:26 | 実測帳の E 甲・F 乙（v1449） |
| [`y0916-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-1900.md) | 09-16 19:04 | E と F の字（猫牌率・候補の外の二つ） |
| [`猫牌率の文の直し-v1448.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%96%87%E3%81%AE%E7%9B%B4%E3%81%97-v1448.md) | 09-16 13:09 | 猫牌率の文の直し（v1448）と、候補の外の二つ |
| [`y0916-0707.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0707.md) | 09-16 07:09 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`y0916-0436.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0436.md) | 09-16 07:06 | 猫牌率の文の直しの候補 A〜D（v1447） |

<!-- 控えの一覧 ここまで -->
