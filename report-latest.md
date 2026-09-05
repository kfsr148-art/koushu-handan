# 飽和の回避-1 — 重い帯だけ、起こしを間引く

**状態：終わり／土台（本体・パネルの判定・見張りの札の作り）には触っていない**

**要** — 中の手は一行も変えていない。**「今回は走らせるか」を決める関門を、起こしの前に立てた**だけ。

---

## ① `heavy.txt` の決め

```
重い検査（check-all・panel-check・widget-check）と手押しの**前**に
  powershell -File ~/.claude/heavy-on.ps1 -Why '<理由>'
終わったら
  powershell -File ~/.claude/heavy-off.ps1
```

- 中身は**一行**（`2026-09-05 15:45:07 panel-check の実地`）
- **書いた刻から30分で自動に切れる**。消し忘れても、いつまでも効き続けない

## ② 起こしの前に立つ関門

`heavy-gate.ps1`（見張り用）と `heavy-beat.ps1`（生存用）を足し、
**予定表の呼び先だけ**をそちらへ向けた。**刻みは変えていない**（見張りは毎分、生存は10分ごとのまま）。

| 仕事 | ふだん | 重い帯 |
|---|---|---|
| `ClaudeWatchNotify` | 毎分 | **5分に一度**（それより短い呼び出しは見送る） |
| `ClaudeHookHeartbeat` | 10分ごと | **20分に一度** |

```
前 : -File "…\watch-notify.ps1"
後 : -File "…\heavy-gate.ps1" -Run "…\watch-notify.ps1" -EverySec 300 -Tag watch

前 : -File "…\hook-notice.ps1" -Kind heartbeat
後 : -File "…\heavy-beat.ps1"        ← 生存は -Kind が要るので包みで渡す
```

**見送った回は黙って消さない。**足跡（`watch-step-log.txt`）へ
**「重い帯のため見送り」**を残し、`heavy-skip.log` にも理由つきで書く。
＊この行は `開始` でも `完了` でもないので、**固まりの数え方には影響しない**。

## ③ `pipe-check` も同じ帯を見る

`heavy.txt` が効いている帯では、**hook の沈黙と公開の遅れを訴えない**
（見送った回は `heavy-skip` として残す）。控えの `重い:` の行より**先に** `heavy.txt` を見る。
**札の上限・話題名・送り直し・ntfy の生死は、重い帯でも訴える。**

## ④ 実測

**作り値（本物の関門を、当たり障りのない手で回した）**

```
(甲) heavy.txt が無い             → 3回呼んで **3回走った**
(乙) heavy.txt が新しい（5分間隔） → 3回呼んで **1回だけ走った**
(丙) heavy.txt が45分前（切れた）  → 3回呼んで **3回走った**

見送りの記録
  15:44:44  test  重い帯のため見送り（前の回から 6秒・要る間隔 300秒）：作り値の重い検査
```

**実地（重い検査を一回、帯の中で回した）**

```
15:45:07  重い帯に入った（panel-check の実地）
15:45〜15:54  panel-check … **全てPASS**
15:54:41  重い帯を出た

生存の刻 : 15:28:21 → 15:38:09 → **15:48:44**   ← **途切れていない**（10分35秒）
見送り   : 15:50:03 と 15:54:34 に watch を見送り（足跡にも記録）
巡回     : 15:47:26 と 15:53:22 に走った（間隔が空いた）
```

**今日の 39分の穴（13:27・15:08）と同じ長さの重い帯で、生存が一度も落ちなかった。**
＊前は 2分の上限で beat が三回続けて殺されていた。いまは**そもそも呼ばない**ので、殺されない。

## 止めた案（実装していない）

- **重い帯にパネルの黄色の行で断る**（「いま重い検査中」）… **パネルの判定**に触る
- **重い帯を機械が自動で見分ける**（CPU やディスクから）… 判じ方を増やす話。
  いまは**こちらが宣言する**形にした。30分で切れるので、消し忘れても害は残らない

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **136件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`飽和の回避-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1.md) | 09-05 15:55 | 飽和の回避-1 — 重い帯だけ、起こしを間引く |
| [`連携の改善-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E6%94%B9%E5%96%84-1.md) | 09-05 14:33 | 連携の改善-1 — 止めた5件を外から見る手で近づけ、訴えを定時へ乗せた |
| [`札の上限-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E4%B8%8A%E9%99%90-1.md) | 09-05 12:51 | 札の上限-1／手押しの錠-1 — 枚数を増やし、手押しも同じ錠を通した |
| [`連携の弱い所-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E5%BC%B1%E3%81%84%E6%89%80-1.md) | 09-05 09:48 | 連携の弱い所-1 — 黙って壊れる所を洗い、外から見る手を立てた |
| [`機械の詰まり-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1-2.md) | 09-05 09:37 | 機械の詰まり-1（数え）— 夜は明確に減った。残っているのは**こちらが検査を回している帯** |
| [`矛盾の三つ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%9B%E7%9B%BE%E3%81%AE%E4%B8%89%E3%81%A4-1.md) | 09-04 12:31 | 矛盾の三つ-1 — 三つとも「材料を読む所」がずれていた |
| [`見張りの×-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%C3%97-1.md) | 09-04 10:09 | 見張りの×-1 — 「×2147946720」は死んでいた印ではなく、**その一分の起こしを見送った印** |
| [`機械の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-04 06:06 | 機械の詰まり-1 — 現場を押さえる手を入れ、押す者を一度に一人にした |
| [`数の不一致-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%95%B0%E3%81%AE%E4%B8%8D%E4%B8%80%E8%87%B4-1.md) | 09-04 01:24 | 数の不一致-1 — 三つを「写した印の無い、中身のある札の数」で揃えた（panel v116） |
| [`生存の途切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%94%9F%E5%AD%98%E3%81%AE%E9%80%94%E5%88%87%E3%82%8C-1.md) | 09-04 00:44 | 生存の途切れ-1 — 詰まった一本が10分ぶら下がり、次の刻が「見送り」で捨てられた |
| [`パネルの立て直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E7%AB%8B%E3%81%A6%E7%9B%B4%E3%81%97-1.md) | 09-03 21:30 | パネルの立て直し-1 — 開いた瞬間に「何が終わって何が待っているか」が読める形へ（panel v115） |
| [`読みの道-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-3.md) | 09-03 20:52 | 読みの道-3 — `latest-name.txt` を完全な URL 一行にした |
| [`読みの道-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-2.md) | 09-03 20:31 | 読みの道-2 — 名を変えた写しを置く（読む側が待たずに最新を取れる） |
| [`札の押し出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%BC%E3%81%97%E5%87%BA%E3%81%97-1.md) | 09-03 17:27 | 札の押し出し-1 — 🪟 が終わりの札を上書きしていた。二枚とも立てる形にした |
| [`巡回の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-03 16:02 | 巡回の固まり-2 — 止まっていたのは「使用量の段」。上限の無い呼び出しが一つあった |
| [`写しの一本化-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E6%9C%AC%E5%8C%96-1.md) | 09-03 15:17 | 写しの一本化-1 — 押す所を一つにした（panel v114） |
| [`通しの試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E3%81%97%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-03 13:28 | 通しの試験-1 — 小さな仕事を一つ流して、端から端まで見届けた |
| [`板の欠け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9D%BF%E3%81%AE%E6%AC%A0%E3%81%91-1.md) | 09-03 12:03 | 板の欠け-1 — 公開側の `board.json` は無事だった。消えていたのは**手元の値** |
| [`写しの切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E5%88%87%E3%82%8C-1.md) | 09-03 10:03 | 写しの切れ-1 — 切っていたのは `buildBundle` ではなく、見張りの控えの読み手 |
| [`札の抜け-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2-2.md) | 09-03 06:43 | 札の抜け-2（続き）— 昨夜の直しは**一度も働いていなかった**。枝の順が原因 |

<!-- 控えの一覧 ここまで -->
