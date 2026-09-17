# 押しの詰まり-1

**終わり（残り0件）** — 2026-09-17（VAIO）。**押しは詰まっていなかった。**
鳴ったのは訴えの**数えの穴**で、手元と origin/main は最初から一致していた。本体には触っていない。

## ① 元を一つに決める … **数えの穴**（衝突でも分かれでも鍵でも空きでもない）

### 押せていない commit（1件）の正体

16:20:33 に pipe-check が走った**その瞬間**に押し待ちだった、見張りの自動 commit 1件。
**6秒後の 16:20:39 に通っている。**

```
16:20:31  origin/main へ push（通った）
16:20:33  pipe-check が走る ← ここで「押せていない commit 1件」
16:20:36  commit  pipe-warn.json：連携の訴えを更新
16:20:39  origin/main へ push（通った）
16:20:44 / 16:20:48 / 16:20:52 / 16:20:56  commit と push が続く
```

### 「11076分・231回」の出どころ

数える枝は二つの git を続けて呼ぶ。**その間に押しが通ると、後ろの呼びが空で返る。**

```powershell
$ahead = rev-list --count origin/main..HEAD     → 1（この時点では押し待ち）
$cts   = log --reverse --format=%ct  同じ範囲    → 空（もう押し終わっていた）
$pfSince = FromUnixTimeSeconds([int64]([string]$cts[0]).Trim())
```

**PS5.1 の `[int64]''` は 0**（例外ではない）。実測で確かめた。

```
[int64] の結果 … [0]（型 Int64）
できた刻 … 1970-01-01 09:00:00
```

刻が 1970 まで落ちると、失敗の行を拾う窓（`git-push.log` の末尾1500行）が**丸ごと当たる**。
その窓の先頭が **2026-09-09 23:44:50**、窓の中の「push が通らなかった」が **231行**。
訴えの二つの数字はここから出ていた。**続けて失敗していたのではなく、8日ぶんを一度に数えていた。**

| 刻 | 当たる失敗の行 |
|---|---|
| 1970-01-01（穴） | **508行**（うち push が通らなかった 231行） |
| 2026-09-17 16:19 （本来） | **0行** |

### 「直近は pull --rebase が通らない」の一本

窓の**最後の行**で、**13:34:51** のもの。三時間前の記録が窓に残っていただけで、16:20 の話ではない。

```
13:34:17  notices  時間切れで切った（20秒）: git push --no-verify -q origin main
13:34:20  notices  push が通らなかった（-1）。pull --rebase して一度だけ押し直す
13:34:51  notices  時間切れで切った（30秒）: git pull --rebase --autostash -q origin main
13:34:51  notices  pull --rebase が通らなかった（-1）。押し直さない
```

**元は衝突でも鍵でもなく、重さ（空き）。** 13:13〜13:33 の見張りの止まりと同じ時間帯で、
13:28:43 に「空きが乏しいので押しを見送る（**空き 369MB**）」が出ている回。
`git-push.log` はこの 13:34:51 を最後に**一行も増えていない**（記録に載るのは失敗と見送りだけ）。

### ついでに出た本物の詰まり … pub-defer が10分ごと（29回）

押しの控え（`origin/main:notices.json`）が**毎回読めていなかった**。15:00 から 19:50 まで29回。

**元は字の種別。** この台本は予定表（`ClaudePipeCheck`）から `-NoProfile` で起こされ、
そこでは `[Console]::OutputEncoding` が **CP932** のまま。git の出す日本語が化けて JSON が壊れる。
隠し窓で実測した。

```
（直す前）show の長さ 36171／★例外 ':' または '}' ではなく無効なオブジェクトが渡されました。
          "title": "笨・邨ゅｏ繧翫∪縺励◆…"
（直した後）show の長さ 26901／一番新しい札の刻 1789630256
```

14:50 の「pub-late 70分」も、元をたどればこれ。**公開側の見張りは実質ずっと目が見えていなかった。**

## ② 手元と origin/main の差 … **0件**（判じる分かれは無い）

```
手元 dcb7b3dd  origin/main dcb7b3dd  FETCH_HEAD dcb7b3dd
手元にだけ 0件 ／ 向こうにだけ 0件
rebase の残り 無し ／ .git の lock 無し
```

`git fetch origin main` で**向こうの実物**とも突き合わせた。分かれていないので、
**どちらを残すかを選ぶ場面が無い。** 履歴には一切手を付けていない（reset も rebase も force も無し）。

## ③ 直した所と、通したあとの確かめ

### 触った所（`pipe-check.ps1` だけ・写しは `.bak-20260917c`）

| 直し | 中身 |
|---|---|
| 字の種別 | 冒頭に `[Console]::OutputEncoding` を UTF-8 で釘付ける一行。`watch-notify.ps1` と同じ形 |
| 刻の取り方 | `$cts` が空なら**数えない**。記録へ `push-defer …次の回で数え直す` の一行だけ残す |

### 触らない所

**本体（`koushu-handan.html`）・`git-push.ps1`・`push-mine.ps1`・敷居**（`$PUSH_FAIL_MIN` 20分／
`$STALE_PUB_MIN` 20分）・**公開側の読み方**・`git-push.log` の過去の行・**リポジトリの履歴**。

### 作り値（三通り・本物の訴え・押し・git は叩いていない）

| 場合 | 鳴り | 記録 |
|---|---|---|
| イ 刻が取れない（数える間に押しが通った） | **鳴らない** ✔ | `push-defer …` の一行 |
| ロ 本当に古い押し残し（9日前） | **push-fail** ✔ | （無し） |
| ハ さっきの押し残し（いまの刻） | 鳴らない ✔ | （無し） |

構文検査 OK（token 6298）。

### 実地で効いたか

予定表の回（`ClaudePipeCheck`）を一度起こして確かめた。

```
前の回 2026-09-17 19:54:54  結果 0
pipe-warn.log の末尾 … 19:50:22 の pub-defer が最後。19:54:54 の回は**一行も書いていない**
```

15:00 から 19:50 まで**10分ごとに必ず出ていた** pub-defer が、直した後の回で**止まった**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **252件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0915-1130.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0915-1130.md) | 09-15 12:53 | 八人の数字を説明欄へ（丙の字を確定） |
| [`件名の拾い方-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BB%B6%E5%90%8D%E3%81%AE%E6%8B%BE%E3%81%84%E6%96%B9-4.md) | 09-15 04:59 | 件名の拾い方-4 と stable の進め（v1445） |
| [`四枚の札の縮め-1-v1445.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9B%9B%E6%9E%9A%E3%81%AE%E6%9C%AD%E3%81%AE%E7%B8%AE%E3%82%81-1-v1445.md) | 09-15 01:28 | 四枚の札の縮め-1（v1445） |
| [`y0915-0130.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0915-0130.md) | 09-15 01:00 | 四枚の札の縮め-1 の下調べ（印 y0915-0130） |
| [`兎の一行の確定-v1444.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E4%B8%80%E8%A1%8C%E3%81%AE%E7%A2%BA%E5%AE%9A-v1444.md) | 09-15 00:51 | 兎の一行の確定と stable の進め（v1444） |
| [`説明欄の作り替え-v1444.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E4%BD%9C%E3%82%8A%E6%9B%BF%E3%81%88-v1444.md) | 09-15 00:44 | 説明欄の作り替え（v1444） |

<!-- 控えの一覧 ここまで -->
