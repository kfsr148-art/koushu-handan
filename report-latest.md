# 帯の中の黙り-1 — 直し方の裁定のお願い（印 y0910-2255）

**ヨシ待ち（残り2件）**（VAIO 22:56）— 立ち上げ直後の申告。**台帳の残りは2件**で、どちらも**こちらの手だけでは進めない**。
うち一件は設計の分かれ道（作法29 ①）なので、案を二つ出して止まる。

## 残り

| # | 件 | 状態 |
|---|---|---|
| 1 | **帯の中の黙り-1** | **直し方の裁定待ち**（下の甲・乙）。印 **`y0910-2255`** |
| 2 | 見張りの後始末-1 ③（0x4A の追い込み） | **昇格の問いを VAIO の画面で押してもらう待ち**（「出して」の合図で、もう一度問いを出す） |

＊前の報告で残りに挙げた「押しの錠の名の食い違い（公開の止まり-1 の別件）」は、**既に直っていた**ので済にした。
　`git-push.ps1` L154・`push-mine.ps1` L24・`heavy-push.ps1` L52 の**三つとも `Local\ClaudeGitPushGate`**（`git-push.ps1` L150 に 2026-09-10 の直しの註）。
＊台帳の古い行を二つ済にした（消していない）：`土台の直し-1 ③（09-09）`＝実装は 93ad99e3 で済／`承認の足止め-1 ③（09-10 13:05）`＝同じ項目を 14:57 の行で実施済み。

## 帯の中の黙り-1 — なぜ一度も鳴らないか（確かめ直した）

前の報告では「`heavy-on.ps1` が `-MaxMin` を渡さず、既定40分で手が終わるから」と書いた。**それだけでは無かった。**
`-MaxMin` を渡しても直らない。

| どこ | 何をしている |
|---|---|
| `heavy-gate.ps1` L25 | `$HEAVY_MAX_MIN = 30`。**帯は `heavy.txt` に書いた刻から30分で切れる** |
| `heavy-on.ps1` L6–7 | 継ぎ足すたびに `heavy.txt` を**いまの刻で上書き**する |
| `heavy-life.ps1` L39–46 | 帯の齢を **`heavy.txt` の一行目の刻から**数える |
| `heavy-life.ps1` L64 | 齢が **60分以上**なら途中経過を鳴らす |

＊継ぎ足さなければ、帯は30分で切れる（手も40分で終わる）。
＊継ぎ足せば、刻が上書きされて齢が0へ戻る。
＊**どちらの道でも、齢が60分に届かない。**作り値の5通り（59分→鳴らない／61分→一発…）は、齢を直に作って通していたので通った。

実地の記録：`heavy-life.log` は**一度も作られていない**（09-08 03:00〜07:26 の4時間半の帯でも、今夜の47分のフル版でも）。

## 直し方 — どちらにしますか

どちらも「**帯の最初の刻**を、継ぎ足しで上書きされない所に持つ」。60分・30分の物差しはそこから測る。
切れる30分（`heavy-gate`）と、手の終わり（`-MaxMin`）は、今までどおり**最後の刻**から測る。

| 案 | 中身 | 触る台本 | 代償 |
|---|---|---|---|
| **乙（推し）** | 最初の刻を**別のファイル** `heavy-first.txt` に持つ。`heavy-on` は**生きている帯が無いときだけ**書く／`heavy-off` が消す／`heavy-life` はそこから齢を測る | `heavy-on`・`heavy-off`・`heavy-life` | ファイルが一つ増える。**`heavy.txt` の形は変えない**ので、ほかの読み手（`heavy-gate`・`heavy-push`・巡回）に響かない |
| 甲 | `heavy.txt` の**二行目**に最初の刻を持ち越す | `heavy-on`・`heavy-life` | `heavy-life` L71 は刻の後ろを丸ごと「帯の理由」として題に使う。二行目を足すと**題に刻が混じる**。読み手を全部あらためる要がある |

**推しは乙。**`heavy.txt` の形を変えないので、読み手を探して回る要が無い。

＊どちらも凍結-0 の「修理」の範囲（新しい働きは足さない。入れたはずの働きを実地で届くようにするだけ）。
＊直したら、作り値は**継ぎ足しを挟んだ形**（最初の刻から61分・最後の刻から5分）で通す。本物の ntfy は叩かない（作法14）。

## 答え方

- 乙で進める … **`y0910-2255 にヨシ`**（または裸の「ヨシ」）
- 甲にする・別の案 … その旨を一行で

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **199件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0910-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-2255.md) | 09-10 22:53 | 帯の中の黙り-1 — 直し方の裁定のお願い（印 y0910-2255） |
| [`土台の直し-1の実装.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%9F%E8%A3%85.md) | 09-10 20:27 | 土台の直し-1（実装）— shanten を analyze() の外へ持ち上げ、写し二つを廃した（v1438） |
| [`y0910-1752.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1752.md) | 09-10 17:53 | 押しの黙り-1 — 押しの失敗と .git の壊れを訴えへ足した（印 y0910-1752） |
| [`y0910-1727.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1727.md) | 09-10 17:30 | 旧版の窓を止め、ログオン時の起こしを置いた（印 y0910-1727） |
| [`y0910-1655.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1655.md) | 09-10 17:00 | 錠の名を揃え、落ちの正体を割った（印 y0910-1655） |
| [`y0910-1305-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-3.md) | 09-10 15:16 | pub-read の始末と、長く走る命令の上限（印 y0910-1305-3） |
| [`y0910-1305-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-2.md) | 09-10 15:04 | 読むだけの台本と、公開の止まりの割り直し（印 y0910-1305-2） |
| [`y0910-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1330.md) | 09-10 13:36 | 公開の止まり-1（印 y0910-1330） |
| [`y0910-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305.md) | 09-10 13:09 | 承認の足止めと自動モードの戻し道（印 y0910-1305） |
| [`y0910-0052-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052-2.md) | 09-10 01:30 | 一分おきの走り出し-1-2 — 甲で直した。作り値は三通りとも一本 |
| [`y0910-0052.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052.md) | 09-10 00:56 | 一分おきの走り出し-1 — 口を塞いだ。原因は**件名の末尾の空白** |
| [`ヨシの猫の組み直し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E7%B5%84%E3%81%BF%E7%9B%B4%E3%81%97.md) | 09-09 19:26 | ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる** |
| [`ヨシの猫のマス目.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E3%83%9E%E3%82%B9%E7%9B%AE.md) | 09-09 16:38 | ヨシの猫を差し替え-1 — マス目の割り出しと、箱を上げる案 |
| [`土台の直し-1の四段.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%9B%9B%E6%AE%B5.md) | 09-09 13:02 | 土台の直し-1 ① — 四段の材料の出どころ（名指しの一覧） |
| [`ヨシの猫を差し替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%82%92%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88-1.md) | 09-09 13:02 | ヨシの猫を差し替え-1 — 素材を測った。**輪郭が潰れるので止まる** |
| [`巡回の止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-09 12:16 | 巡回の止まり-1 — 11:02〜11:45 の43分 |
| [`土台の直し-1の材料.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E6%9D%90%E6%96%99.md) | 09-09 11:59 | 土台の直し-1 ① — 切り候補の四段は、いまどこから値を取っているか |
| [`猫を全部白へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%82%92%E5%85%A8%E9%83%A8%E7%99%BD%E3%81%B8-1.md) | 09-09 11:06 | 猫を全部白へ-1 — 頭の猫が地に沈む件（全状態） |
| [`黒猫の待機-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-3.md) | 09-09 09:54 | 黒猫の待機-3 — ヨシ待ちの猫を白から黒へ戻す |
| [`土台の直し-1の宣言.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%A3%E8%A8%80.md) | 09-09 05:55 | 土台の直し-1 — 宣言（ヨシ待ち） |

<!-- 控えの一覧 ここまで -->
