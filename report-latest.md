# 空きの片付け-1

**終わり（残り0件）** — 2026-09-18（VAIO）。**Edge の10本だけを落とした。** 本体には触っていない。

## 落とす前と後

| | 刻 | 空き物理メモリ | Edge |
|---|---|---|---|
| **落とす前** | 17:57:39 | **999MB** | **10本・174MB** |
| 落とした直後 | 17:58:08 | 1135MB | 0本 |
| **落とした後（20秒置いて）** | 17:58:40 | **1165MB** | **0本** |

**+166MB**（999 → 1165MB）。総メモリ 3975MB に対して **4.2ポイント**ぶん空きが増えた。

＊Edge の合計使用は174MBだったが、空きの増えは**それより少し多い166MB**で収まっている。
　落とした直後（1135MB）から20秒で30MB戻っているのは、後片付けが済んだぶん。

## 落とした10本

| pid | 種別 | MB | 起きていた刻 |
|---|---|---|---|
| 4892 | **親**（題「Sign in - Claude」） | 83 | 09-15 17:33 |
| 1300 | utility | 22 | 09-15 17:34 |
| 9480 | renderer | 15 | 09-15 20:53 |
| 1220 | utility | 13 | 09-15 20:54 |
| 2544 | renderer | 12 | 09-15 20:54 |
| 5768 | gpu-process | 7 | 09-15 17:34 |
| 6080 | utility | 7 | 09-15 20:54 |
| 11720 | utility | 7 | 09-15 20:54 |
| 7128 | utility | 6 | 09-15 17:34 |
| 8704 | crashpad-handler | 2 | 09-15 17:33 |

**十本とも「落とした」で返った。** 落とす前に一本ずつ名を確かめ、`msedge` でなければ触らない形にした
（別の物に当たらないため）。**三日居た署名の頁が消えたので、次に使うときは開き直しが要る。**

## 触っていないことの確かめ（落とした後に実測）

| | 実測 |
|---|---|
| `claude` | **1本・pid 4796**（09-12 21:51 起動のまま） |
| `inbox-watch.ps1` | **1本・pid 9716・09-15 01:30 起動のまま**（起こし直していない） |
| 予定表の起こし | **10件とも Ready**（`ClaudeWatchNotify` ほか、間隔も触っていない） |

## 触った所と触らない所

**触った所** … Edge の10本を落としただけ（綴りは一つも触っていない）。

**触らない所** … 本体（`koushu-handan.html`）・`~/.claude` の台本・予定表の起こしと間隔・
`claude` の窓・`inbox-watch.ps1` の常駐・敷居（譲り700MB／押し768MB）・記録の過去の行。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **263件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0916-0707.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0707.md) | 09-16 07:09 | 猫牌率の文の直しの候補 A〜D（v1447） |

<!-- 控えの一覧 ここまで -->
