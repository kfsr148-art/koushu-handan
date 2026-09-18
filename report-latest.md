# 起こしの重なり-1 の下調べ

**終わり（残り0件）** — 2026-09-18（VAIO）。**数えて判じただけ**。工事は入れていない。本体にも触っていない。

**先に一つ** … 三本は**同じ刻には立っていなかった**。実測では **:58／:10／:28** と、すでに12〜18秒ずつずれている。

## ① 三本の役目と、一回の実測

0.5秒ごとに120秒、powershell の顔ぶれを控えて数えた（自分の窓は除く）。

| 起こし | 役目 | 立つ刻 | 居た間 | 使うMB |
|---|---|---|---|---|
| **ClaudeWatchNotify**（`heavy-gate`→`watch-notify`） | 毎分の巡回。生存の合図・帯と鍵の見回り・押し直し・知らせの判定 | **:58** | **12.2〜22秒** | **106〜111MB** |
| **ClaudeRevive**（`revive-claude`） | 対話の窓（claude.exe）が落ちたら起こし直す。**0本が2分続いたら**起こす | **:10** | **4〜6秒** | **30〜71MB** |
| **ClaudeJamWatch**（`jam-watch`） | 巡回が詰まった**現場**を一枚撮る。**最後の段から90秒**経って「完了」が無ければ撮る | **:28** | **3.8〜4.2秒** | **30〜65MB** |

＊`watch-notify` の一回は、記録（足跡の 開始→完了）では**中央7秒・上位1割21秒・最長73秒**。
　上の「居た間」はそれに窓の立ち上げと後始末が乗った値。

## ② いま重なっている量と、まとめた場合

**一時の山（常駐 `inbox-watch` を除く powershell の合計）**

| | MB |
|---|---|
| いちばん高い | **234MB** |
| 上位1割 | 98MB |
| **中央** | **0MB** |
| いちばん低い | 0MB |

**中央が 0MB** ——**ほとんどの瞬間は、毎分の起こしが一本も居ない。**
重なるのは `heavy-gate`（:58 から12〜22秒）と `revive`（:10 から4〜6秒）が噛む
**1分のうち約10秒**だけ。234MB の山はその10秒に立つ。

**まとめて順に走らせた場合**

| | いま | 一本にまとめた場合 |
|---|---|---|
| 一時の山 | **234MB** | **約111MB**（いちばん重い一本ぶんだけ） |
| 減る量 | — | **-123MB（-53%）** |
| 窓の立ち上げ | 3回/分 | 1回/分 |

**代償（詰まったときの遅れ）**

| 何が遅れるか | 遅れの幅 |
|---|---|
| `revive` が `watch-notify` の後ろに並ぶ | ふつう **+12〜22秒**／上位1割で +21秒／**最悪 +2分20秒**（子の上限 30+20+90秒） |
| そのぶん「窓が落ちた」の立ち直り | いまは最悪3分（2分＋毎分の巡回）→ **最悪5分20秒** |
| `jam-watch` が後ろに並ぶ | 同じだけ遅れる |

## ③ 三つの案 … 代償と利

### 甲 まとめる（一本の起こしで順に走らせる）

- **利** … 一時の山が **234MB → 約111MB**（-123MB）。窓の立ち上げも3回→1回
- **代償①（重い）** … **`jam-watch` の役目が壊れる。** この手は「巡回が90秒詰まっている**最中**に現場を撮る」物で、
  詰まらせている当人（`watch-notify`）の後ろに並べると、**詰まっている間は撮りに行けない**
- 代償② … `revive` の立ち直りが最悪3分→5分20秒
- 代償③ … 一本が詰まると残り全部が止まる（いまは独立して走る）

### 乙 刻をずらす（いまも12〜18秒ずれている。もっと離す）

- **利** … `watch-notify` の居た間が12〜22秒なので、`revive` を **:25**、`jam-watch` を **:45** にすれば
  **重なりはほぼ消え**、山は 234MB → 約111MB に近づく。**役目はどれも壊れない**
- 代償① … `watch-notify` が20秒を超えた回（上位1割21秒・最長73秒）では**依然重なる**
- 代償② … 予定表を三つ触る（起こしの刻を変える）。効き目は「重なる10秒を消す」だけ

### 丙 今のまま

- **利** … 何も触らない。**中央0MB**で、重なるのは1分のうち約10秒
- 代償 … その10秒に **234MB** の山が立つ。空きが 400MB 台の時間帯では、この山が
  押しの見送り（敷居768MB）や「入口が重かった」を誘う

＊どれを採るかは**仕組みの分かれ道**なので、ここでは選ばず並べるまで（枠の決めのとおり）。
　判じの材料として一つだけ書き添えると、**甲は `jam-watch` の役目と噛み合わない**——
　詰まりを撮る手を、詰まる手の後ろに置くことになる。

## 触った所と触らない所

**触った所** … 無し（数えただけ）。

**触らない所** … 本体・`~/.claude` の台本・予定表の三つの起こし（刻も間隔も）・`$DEAD_MIN`（2分）・
`$STUCK_SEC`（90秒）・`heavy-gate` の `-EverySec 300`・敷居（譲り700MB／押し768MB）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **264件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0917-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1450.md) | 09-17 14:59 | pub-late の予備の数え方-1 ／ 13:32 の done-stale-note ／ 13:13 の見張りの止まり |
| [`説明欄の直し-v1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E7%9B%B4%E3%81%97-v1450.md) | 09-17 13:32 | 説明欄「二、どう使うの？」の直し（v1450） |
| [`y0917-1145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1145.md) | 09-17 12:48 | 説明欄の点検-1（六節の字と、いまの本体の食い違い） |
| [`猫牌率のEF-v1449.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AEEF-v1449.md) | 09-16 21:26 | 実測帳の E 甲・F 乙（v1449） |
| [`y0916-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-1900.md) | 09-16 19:04 | E と F の字（猫牌率・候補の外の二つ） |
| [`猫牌率の文の直し-v1448.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%96%87%E3%81%AE%E7%9B%B4%E3%81%97-v1448.md) | 09-16 13:09 | 猫牌率の文の直し（v1448）と、候補の外の二つ |

<!-- 控えの一覧 ここまで -->
