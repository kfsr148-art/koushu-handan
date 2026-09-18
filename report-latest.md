# 起こしの重なり-1（乙・刻をずらす）

**終わり（残り0件）** — 2026-09-18（VAIO）。本体には触っていない。
`ClaudeRevive` を **:25**、`ClaudeJamWatch` を **:45** へずらした。**毎分の三本の重なりは 0% になり、山は 234MB → 177MB。**

## 直した刻

| 起こし | 前 | 後 |
|---|---|---|
| ClaudeWatchNotify（`heavy-gate`→`watch-notify`） | :58 | **:58（触っていない）** |
| **ClaudeRevive** | :10 | **:25** |
| **ClaudeJamWatch** | :28 | **:45** |

触ったのは予定表の**始まりの刻（秒）だけ**。繰り返しは三つとも PT1M のまま。
写しは `~/.claude/task-ClaudeRevive.bak-20260918.xml` と `task-ClaudeJamWatch.bak-20260918.xml`（戻せる形）。

## 実測（0.5秒ごとに120〜300秒・自分の窓と常駐 `inbox-watch` は除く）

| | 前（2分） | 直後（5分・入れ替えの乱れ込み） | **後（5分・落ち着いてから）** |
|---|---|---|---|
| 山のいちばん高い | **234MB** | 212MB | **177MB** |
| 上位1割 | 98MB | 92MB | **91MB** |
| 中央 | 0MB | 0MB | **0MB** |
| **三本が二本以上重なった見張り** | あり（:58と:10が約10秒/分） | 23/600回（3.8%） | **0/600回（0%）** |

**立った刻（落ち着いた5分ぶん・きれいに揃っている）**

```
18:56:58 heavy-gate ／ 18:57:25 revive ／ 18:57:45 jam-watch
18:57:58 heavy-gate ／ 18:58:25 revive ／ 18:58:45 jam-watch
18:58:58 heavy-gate ／ 18:59:25 revive ／ 18:59:45 jam-watch
…（19:02:58 まで同じ並び）
```

＊直後の5分に 3.8% 残ったのは、入れ替えた直後に `heavy-gate` が 18:51:29 に**追いつきで立った**回と、
　`watch-notify` が 33.2秒かかった回が :25 に届いたため。落ち着いた後は 0%。

## 残った山（177MB）の中身 … **毎分の三本ではない**

いちばん高い刻（18:58:09）の顔ぶれは `heavy-gate 88MB ／ その他 89MB`。
その「その他」を60秒追いかけて名を取った。

```
kagi-watch.ps1    62MB  立った 19:04:07
push-retry.ps1    52MB  立った 19:04:08
```

**どちらも巡回が自分で起こす子の台本**（鍵の見回り・押し直し）。
つまり残っている山は**起こし同士の重なりではなく、巡回一回ぶんの中身**で、
毎分の三本をこれ以上ずらしても下がらない。

## 下がった量

**234MB → 177MB（-57MB・-24%）。** 中央は前も後も 0MB のまま。
重なりそのもの（毎分の三本）は **0%** で消えた。

＊前の234MBは2分間、後の177MBは5分間の測り。窓の長さが違うので、
　**下がり幅より「重なりが0%になった」ほうが確かな結果**として読むこと。

## 触った所と触らない所

**触った所** … 予定表 `ClaudeRevive` と `ClaudeJamWatch` の**始まりの秒だけ**（:10→:25／:28→:45）。

**触らない所** … 本体・`~/.claude` の台本（`revive-claude.ps1`・`jam-watch.ps1`・`watch-notify.ps1` とも一字も触っていない）・
`$DEAD_MIN`（2分）・`$STUCK_SEC`（90秒）・`heavy-gate` の `-EverySec 300`・`ClaudeWatchNotify` の刻（:58）・
10分ごとの起こし（board :00／hook :02／pipe-check :15）・敷居（譲り700MB／押し768MB）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **265件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0917-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1450.md) | 09-17 14:59 | pub-late の予備の数え方-1 ／ 13:32 の done-stale-note ／ 13:13 の見張りの止まり |
| [`説明欄の直し-v1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E7%9B%B4%E3%81%97-v1450.md) | 09-17 13:32 | 説明欄「二、どう使うの？」の直し（v1450） |
| [`y0917-1145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1145.md) | 09-17 12:48 | 説明欄の点検-1（六節の字と、いまの本体の食い違い） |
| [`猫牌率のEF-v1449.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AEEF-v1449.md) | 09-16 21:26 | 実測帳の E 甲・F 乙（v1449） |
| [`y0916-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-1900.md) | 09-16 19:04 | E と F の字（猫牌率・候補の外の二つ） |

<!-- 控えの一覧 ここまで -->
