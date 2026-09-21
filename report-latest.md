# 使用量の鈴の鍵を **10分の桁**へ（最も近い側へ丸める）

**終わり（残り0件）** — 2026-09-21 19:25（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## 1. なぜ分の桁では足りなかったか

分で丸めても、**窓の境目をまたいだだけ**で鍵が割れる。

```
10:59:59.9  → 10:59Z
11:00:00.9  → 11:00Z     ← 同じ窓なのに別の鍵。もう一度鳴る
```

**10分の桁へ、しかも「最も近い側」へ丸める**と、両方とも同じ鍵になる。

```
10:59:59.9  → 11:00Z
11:00:00.9  → 11:00Z     ← 同じ鍵
```

**切り捨てでは直らない。** 切り捨てだと `10:59:59.9` が `10:50Z` に落ちて、やはり割れる。
**必ず四捨五入**にする、と台本の注にも書いた。

---

## 2. 直し

`watch-notify.ps1` の `Win-Key` を書き替え、刻みを `$WIN_ROUND_MIN = 10` で持つようにした。

```powershell
$u    = ([datetimeoffset]::Parse($s)).ToUniversalTime().UtcDateTime
$step = [timespan]::FromMinutes($WIN_ROUND_MIN).Ticks
$r    = [long]([math]::Round($u.Ticks / [double]$step)) * $step
return ([datetime]::new($r, [System.DateTimeKind]::Utc)).ToString('yyyy-MM-ddTHH:mmZ')
```

行数 **3564 → 3573**・構文の誤り **0**。写しは `watch-notify.ps1.bak-20260921b`。

＊札に出す字は**丸める前**（`winRaw`）のまま。読む人には秒まで見せる。
＊読めない字はそのまま返す（丸められない物を捨てない）。

---

## 3. 作り値

### 丸め

| 入れた字 | 出た鍵 |
|---|---|
| `2026-09-21T10:59:59.900000+00:00` | **`2026-09-21T11:00Z`** |
| `2026-09-21T11:00:00.900000+00:00` | **`2026-09-21T11:00Z`** ← **同じ** |
| `2026-09-21T10:54:59.000000+00:00` | `2026-09-21T10:50Z`（近いほうへ） |
| `2026-09-21T10:55:01.000000+00:00` | `2026-09-21T11:00Z`（近いほうへ） |
| `2026-09-21T15:59:59.999999+00:00` | `2026-09-21T16:00Z` |
| `よめない字` | `よめない字`（そのまま） |

### 鳴るか鳴らないか

| 場合 | 鍵 | 鳴ったか | 控え |
|---|---|---|---|
| **甲 窓 10:59:59.9（はじめて）** | `11:00Z` | **鳴った** | `週全体\|80=2026-09-21T11:00Z` |
| **乙 窓 11:00:00.9（境目をまたいだだけ）** | `11:00Z` | **鳴らない** | 変わらず |
| **丙 窓 15:59:59.999999（本当に別の窓）** | `16:00Z` | **鳴った** | `週全体\|80=2026-09-21T16:00Z` |

**本物の ntfy は一度も鳴らしていない・本物の控えにも触れていない**（写しに切り出して差し替えた）。

---

## 4. いまの控えも丸め直した

```
控えを丸め直した : 週全体|80 … 2026-09-21T11:00Z → 2026-09-21T11:00Z
```

＊**前の丸め（分）を掛けた時点では `10:59Z` だったが、その後に見張りが回って
　`11:00Z` へ書き替わっていた**——まさに今回直した「境目で割れる」形が一度起きていた跡。
　10分の桁なら、どちらから来ても `11:00Z` に収まる。
＊写しは `usage-over.txt.bak-20260921b`。

---

## 5. 戻し方

```powershell
Copy-Item 'C:\Users\user\.claude\watch-notify.ps1.bak-20260921b' 'C:\Users\user\.claude\watch-notify.ps1' -Force
Copy-Item 'C:\Users\user\.claude\usage-over.txt.bak-20260921b'  'C:\Users\user\.claude\usage-over.txt'  -Force
```

**刻みだけ変えたいとき**は `$WIN_ROUND_MIN`（既定10）を書き替える。
`watch-notify.ps1` は毎回呼び直されるので、**起こし直しは要らない**。

---

## 6. 残り

**残り0件。**

## 7. 実機で見るところ

- 使用量が 80%（または95%）を越えた窓で、**鈴が一度だけ鳴ること**。
  窓の境目をまたいでも、**同じ窓なら二度は鳴らない**。
- 札の「窓の切り替え」の行は、これまでどおり**秒まで**出る。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **364件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-1925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1925.md) | 09-21 19:23 | 使用量の鈴の鍵を **10分の桁**へ（最も近い側へ丸める） |
| [`y0921-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1915.md) | 09-21 19:13 | 綴りを退避して **171.4MB → 4.6MB**／台帳の未了 **0件** |
| [`y0921-1805b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805b.md) | 09-21 18:35 | 未了4項目を一行ずつ／枠の上限の結果／使用量の鈴の丸め |
| [`y0921-1755.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1755.md) | 09-21 17:55 | 雲へ重い仕事を回す道 — **通った** |
| [`cloud-kumo-tameshi-20260921-085123.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-kumo-tameshi-20260921-085123.md) | 09-21 17:53 | 雲で回した：`kumo-tameshi.js` |
| [`y0921-1805.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805.md) | 09-21 17:47 | 枠の上限 — 8分を超え、かつ空きが400MBを割ったら仕事を切る |
| [`y0921-1700.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1700.md) | 09-21 17:02 | 立てる数を減らす — **毎分 22.7本 → 10.6本**／`--continue` を外した |
| [`y0921-1635.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1635.md) | 09-21 16:38 | 網の切れの一覧と、窓隠しの検収 |
| [`y0921-1625.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1625.md) | 09-21 16:26 | 包みの待ちの確かめ・再起動の内側の上限・押しの詰まりの元 |
| [`y0921-1600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1600.md) | 09-21 15:53 | 二件の取り下げと、走りかけの子 125本の片付け |
| [`y0921-1335.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1335.md) | 09-21 13:31 | 09-20 22:00 からの乱れ一枚と、網／ディスクの突き合わせ |
| [`y0921-1250.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1250.md) | 09-21 12:59 | 起き上がりの道を直して、再起動を一日二回にする |
| [`r0921-1246-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0921-1246-2.md) | 09-21 12:46 | 再起動-2（r0921-1246・後の測り） |
| [`y0921-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1040.md) | 09-21 10:41 | 「写した刻」を字面で確かめて消した |
| [`y0921-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1020.md) | 09-21 10:23 | 青い窓の出所と、wscript の包みで隠した話／untracked の「写した刻」 |
| [`y0921-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0950.md) | 09-21 09:49 | 会話の控えの大きさと、畳む支度の点検 |
| [`y0921-0935.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0935.md) | 09-21 09:35 | 「窓を畳むと0枚と読む」の見立ては、実物では成り立たなかった — 直しは入れていない |
| [`y0921-0925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0925.md) | 09-21 09:24 | 公開 state の詰まりと、09:19 の札 |
| [`y0921-0845.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0845.md) | 09-21 08:45 | 06:50 の復帰後に溜まっていた枠の行方と、会話の控えの大きさ |
| [`y0921-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0800.md) | 09-21 08:01 | mem-orphan.ps1 の作り値（置き去り落とし・空きの見張り）と、実地の落とし |

<!-- 控えの一覧 ここまで -->
