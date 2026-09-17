# 止まりの札の敷居-1

**終わり（残り0件）** — 2026-09-18（VAIO）。本体には触っていない。
札を立てる敷居を **5分 → 10分**にし、5〜10分未満は**足跡だけ**に残す形へ変えた。作り値は五通りとも合格。

## ① 今の敷居

| 場所 | 敷居 | 何をするか |
|---|---|---|
| `watch-notify.ps1`（巡回の空き） | **5分**（帯の齢が30分以内なら **11分**） | 「🪟 見張りが**止まっていました**」の札＋押し送り |
| `inbox-watch.ps1`（常駐から見る） | 10分 | 「🪟 見張りが**止まっています**」（**いま**止まっている側。今回は触らない） |

鳴っていたのは上の**5分**のほう。譲りの段が入って止まりが5〜6分に縮んでも、敷居が5分のままだったので、
**縮んだ止まりがそのまま札になっていた**。

## ② 譲りの段が入った後の止まり（09-17 02:50 以降）

`watch-status.log`（1分ごとの記録）の刻の差を全部並べた。**5分以上空いたのは3回**。

| 空き | 長さ | 札 |
|---|---|---|
| 09-17 13:13:25 → 13:38:36 | **25.2分** | 立った（20分と表示） |
| 09-18 01:41:25 → 01:47:39 | **6.2分** | 立った（6分） |
| 09-18 03:06:15 → 03:11:51 | **5.6分** | 立った（5分） |

**10分未満 … 2回／10分以上 … 1回。**

＊10分以上の1回（25.2分）は **09-17 13:13 の回**で、譲りの判じがまだ「生存の合図」の後ろにあった時のもの。
　判じを前へ出した 16:24 以降、**10分を超えた止まりは一度も起きていない**。
＊直近2回（6分・5分）は、どちらも次の回で自然に追いつき、仕事は何も落ちていない。

## ③ 直した形

```
（前）5分以上 → 札＋押し送り
（後）5分以上10分未満 → 足跡だけ（watch-notify.log と watch-step-log.txt に一行）
      10分以上         → 今までどおり札＋押し送り
      帯の中（齢30分以内）→ 今までどおり 11分
```

足跡に残す一行はこの形。**黙って捨てない**ので、あとから「その時刻は何分空いたか」を数え直せる。

```
2026-09-18 03:11:51	☂巡回の空き 6分（札は立てない）	2026-09-18 03:06:15
```

### 作り値（五通り・本物の押し送りは叩いていない）

送り手（`ntfy-say.ps1`）だけを偽物へ差し替え、一時の所の記録へ当てた。

| 場合 | 札 | 足跡 |
|---|---|---|
| イ 6分（09-18 01:41 の実地と同じ長さ） | **立てない** ✔ | あり ✔ |
| ロ 5分（03:06 の実地と同じ） | **立てない** ✔ | あり ✔ |
| ハ 20分（本物の止まり） | **立てた** ✔ | （札の側へ） |
| ニ 帯の中で10分 | 立てない ✔ | なし（帯は11分のまま） |
| ホ 帯の中で12分 | **立てた** ✔ | （札の側へ） |

＊ニで足跡も残らないのは**今までどおり**。帯の中は 11分に満たない空きを見ない作りで、そこは変えていない。

## 触った所と触らない所

**触った所** … `watch-notify.ps1` の「巡回の空き」の枝だけ（写し `.bak-20260918`・構文検査 OK）。
足した物は `$gapSay = 10` と、短い空きを足跡へ落とす枝。

**触らない所** … 本体（`koushu-handan.html`）・`inbox-watch.ps1` の「止まっています」（10分・**いま**止まっている側）・
帯の中の11分・`$STALL_MIN`（段が止まったことの見分け・5分）・同じ空きに二度立てない印（`watch-gap-seen.txt`）・
押し送りの割り当て（一日8件）・譲りの段・`watch-status.log` の過去の行。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **258件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`猫牌率の下敷きの入れ替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-1.md) | 09-15 21:07 | 猫牌率の下敷きの入れ替え-1 の下調べ |
| [`八人の数字を説明欄へ-v1446.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%AB%E4%BA%BA%E3%81%AE%E6%95%B0%E5%AD%97%E3%82%92%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%B8-v1446.md) | 09-15 14:03 | 八人の数字を説明欄へ（v1446） |

<!-- 控えの一覧 ここまで -->
