# 軽い巡回の刻-1

**終わり（残り0件）** — 2026-09-18（VAIO）。本体には触っていない。
途中で返る回も**状態へ一行だけ残す**形にした。作り値は五通りとも合格。

## ① 直した形

途中で返る口は二つある。**どちらも、返る前に `watch-status.log` へ一行書く**ようにした。

| 返る口 | 書く一行 |
|---|---|
| 軽い巡回（譲り） | `2026-09-18 13:05:43  軽い巡回（空き 300MB・ふつうの巡回から 2分）` |
| 入口が重かった回 | `2026-09-18 …  入口が重かった（20.5秒）ので、この回は先へ進まない` |

書くのは**刻と訳の一行だけ**。ふつうの回の長い一行（鍵・プロセス・窓…）とは別物だが、
**読む側はどちらも頭の刻しか見ない**ので差し支えない——

- 空きの見張り（`watch-notify.ps1`）… 前回の刻との差だけ
- 「見張りが止まっています」（`inbox-watch.ps1`）… 末尾一行の刻だけ

足したのは `Write-Status` の手ひとつと、二つの返り口への呼び出し。
**行数の刈り込み（2880行）はふつうの回と同じ決めを使う。**

## ② 12:17〜12:45 の29分 … **半分だけ同じ見かけ、半分は本物**

```
12:17:09  ふつうの回が状態を書いた（これが最後）
12:21:27  軽い巡回で譲った（空き 478MB）   ← 状態を書かずに返る
12:22:31  軽い巡回で譲った（空き 504MB）   ← 同じ
12:24:01  開始 → 12:24:14 軽い巡回（空き 425MB）→ 12:24:15 完了
          ……ここから足跡に「開始」が一つも無い……
12:44:37  開始（20分22秒ぶり）→ 12:46:15 完了。12:46:15 に状態を書いた
12:46:15  巡回の空きを見つけた：12:17:09 から 29分。札を立てた
```

**12:17〜12:24 の7分は見かけ**（軽い巡回3回が状態を書かずに返っただけ）。
**12:24:15〜12:44:37 の20分22秒は本物**——回そのものが一度も立っていない。

＊この20分は、こちらが前の札（止まりの読み-4）を書いて押していた時間と重なる。
　空きが 425MB まで落ちた中で、起こしが立てなかった側。
**直した後なら、この回は「29分」ではなく「20分」の札になる（鳴るのは正しい）。**

## ③ 作り値（五通り・本物の合図も押し送りも叩いていない）

前半は**本体の写しを最後まで走らせ**（合図の送り手と空きの読みだけ偽物へ）、
後半は空きの見張りの枝を切り出して当てた。

| 場合 | 結果 |
|---|---|
| イ 軽い巡回を最後まで走らせる | 状態の末尾に **`軽い巡回（空き 300MB・ふつうの巡回から 2分）`** ✔ |
| ロ 軽い回が2分前に書いた記録 | **鳴らない** ✔ |
| ハ 入口の見送りが3分前 | **鳴らない** ✔ |
| ニ 9分前（10分に満たない） | **鳴らない** ✔ |
| ホ **本当に止まった20分** | **鳴る** ✔ `🪟 見張りが止まっていました（12:45〜13:05・20分）` |

**軽い回が続いても鳴らず、本当に止まった回は今までどおり鳴る。**

## 触った所と触らない所

**触った所** … `watch-notify.ps1` だけ（写し `.bak-20260918b`・構文検査 OK）。
`Write-Status` の手を足し、軽い巡回と入口の見送りの二箇所から呼ぶようにした。

**触らない所** … 本体（`koushu-handan.html`）・ふつうの回の状態の一行の形（鍵・プロセス・窓…）・
札の敷居10分・帯の中の11分・`$LIGHT_FREE_MB`（700MB）・`$LIGHT_MAX_MIN`（10分）・
`inbox-watch.ps1` の「止まっています」・`heavy-gate.ps1`・記録の過去の行。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **261件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`猫牌率の下敷きの入れ替え-v1447.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-v1447.md) | 09-16 04:35 | 猫牌率の下敷きの入れ替え（v1447） |

<!-- 控えの一覧 ここまで -->
