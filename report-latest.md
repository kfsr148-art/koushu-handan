# 写しの絞り-2 — 写しの絞りを検査で守る

**状態：終わり（残り0件）／VAIO 2026-09-01 19:4x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — `panel-check.js` に **「③の続き 写しの絞り」** を足した。作り値の札から**貼る字そのもの**を
組ませ、七項目を見る。**わざと壊した二通りとも落ち、いまの姿では通る**。
作る途中で**判定の抜けが一つ**見つかったので直した（下記②）。

---

## ① 足した項目（七つ）

作り値 … ふつうの回（`✅ 終わりました`／`ファイル:`・`実測:`・`実機:` あり）と、
調べの回（`🔎 調べました`／`ファイル:` あり）の札を各一枚、板は あなた待ち1件・**直近に終わった仕事3件**。
これで「まとめて写す」を押させ、クリップボードへ渡った字を読む。

| 見るもの | 結果 |
|---|---|
| 「直近に終わった仕事」の行が混ざっていないか | ✓ 混ざっていない |
| ふつうの回の「ファイル:」が落ちているか | ✓ 落ちている |
| **調べの回の「ファイル:」が残っているか**（例外の枝） | ✓ 残っている |
| 「実測:」の行が残っているか（**ふつうの回の字で見る**） | ✓ 残っている |
| 「実機:」の行が残っているか | ✓ 残っている |
| 報告の本文（件名の行・完了の行）が落ちていないか | ✓ 落ちていない |
| 「あなた待ち」が残っているか | ✓ 残っている |

## ② 直した判定の抜け

最初は `実測:` を **`/^実測[:：]/m`**（写し全体に一行でもあるか）で見ていた。
これだと**調べの回（絞りを掛けない側）の実測に釣られて**、ふつうの回から実測が落ちても通ってしまう。
実際、壊し (乙)「実測の行まで落とす」が**一度通ってしまった**。
**ふつうの回の実測の字そのもの**で見るように直し、落ちるようになった。

## ③ わざと壊した作り値（本体には触らず、写しを壊して検査に掛けた）

| 壊し方 | 終了コード | 落ちた項目 |
|---|---|---|
| **(甲) 絞りを外して三行を混ぜる**（`bundleBoard` に直近を戻し、`trimForCopy` を素通しに） | **1** | 「ふつうの回の『ファイル:』が写しに残っている」 |
| **(乙) 実測の行まで落とす**（絞りに `実測:` も足す） | **1** | 「ふつうの回の『実測:』の行が落ちている」 |
| (丙) いまの姿 | **0** | 通った |

## ④ 写しの絞り-1 の push で回った Actions

| 走り | 結果 | 所要 | 題 |
|---|---|---|---|
| **33488859585** | **success** | **12分12秒**（08:47:34Z → 08:59:46Z） | 「panel v106 貼る写しから『直近に終わった仕事』の三行とファイルの行を落とす（調べの回はファイルを残す）」 |

同じ走りで**返事パネルの検査・ウィジェットの検査とも全てPASS**だった。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **103件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`写しの絞り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%B5%9E%E3%82%8A-2.md) | 09-01 19:41 | 写しの絞り-2 — 写しの絞りを検査で守る |
| [`写しの絞り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%B5%9E%E3%82%8A-1.md) | 09-01 18:00 | 写しの絞り-1 — 貼る写しから、判断に使わない行を落とした（panel v106） |
| [`受け渡しの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%97%E3%81%91%E6%B8%A1%E3%81%97%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 17:30 | 受け渡しの守り-1 — Code タブと知らせのあいだに、二つの網を足した |
| [`パネルの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 16:57 | パネルの守り-1 — 返事パネルを検査の網に入れた |
| [`ウィジェットの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 15:24 | ウィジェットの守り-1 — ウィジェット側を検査の網に入れた |
| [`ウィジェットの猫の色-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E7%8C%AB%E3%81%AE%E8%89%B2-1.md) | 09-01 13:01 | ウィジェットの猫の色-1 — ウィジェットの猫を白へ（元絵とパネルはそのまま） |
| [`ウィジェットの状態表示-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E7%8A%B6%E6%85%8B%E8%A1%A8%E7%A4%BA-1.md) | 09-01 12:10 | ウィジェットの状態表示-1 — 返事パネルと同じ状態をウィジェットにも出した |
| [`殻の直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AE%BB%E3%81%AE%E7%9B%B4%E3%81%97-1.md) | 09-01 11:54 | 殻の直し-1 — 実機の `importModule` エラーは台本名と控え名の衝突。直に評価する形へ |
| [`知らせの詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-01 11:29 | 知らせの詰まり-1 — 「外待ち」の消し忘れで198分止まっていた。網を足した |
| [`ウィジェットの自動更新-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0-1.md) | 09-01 08:02 | ウィジェットの自動更新-1 — 殻を新設して、Scriptable への貼り替えを不要にした |
| [`検査の取りこぼし-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E5%8F%96%E3%82%8A%E3%81%93%E3%81%BC%E3%81%97-1.md) | 09-01 06:02 | 検査の取りこぼし-1 — 打ち切りは「落ちた」ではなく「測れなかった」として扱う |
| [`手牌の境目-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-3.md) | 09-01 03:47 | 手牌の境目-3 — `--vz-show` の745は据え置きで確定（掘り返さないための裁定の控え） |
| [`手牌の境目-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-2.md) | 09-01 03:07 | 手牌の境目-2 — 案Aを実装（v1434）。手元も Actions も 189/189 全通過 |
| [`手牌の境目-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-1.md) | 09-01 03:07 | 手牌の境目-1 — 746x375 の手牌が12px切れる件。境目は実測で 758px |
| [`状態の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8A%B6%E6%85%8B%E3%81%AE%E7%A9%B4-1.md) | 08-31 22:45 | 状態の穴-1 — 走っている最中に「次の指示待ち」へ落ちる件（外待ちで作業中を保つ） |
| [`検査の網-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E7%B6%B2-1.md) | 08-31 22:44 | 検査の網-1 — ⑦の視野を網の隙間まで広げた。境目 746x375 で手牌が12px切れている |
| [`自動検査-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-5.md) | 08-31 21:36 | 自動検査-5 — 丙を実装（v1432）。手元も Actions も完全版で全通過 |
| [`自動検査-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-4.md) | 08-31 20:53 | 自動検査-4 — 667x375 の溢れは v1431 で入った（.next-hand-row・21.3px） |
| [`待ちの決め-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%BE%85%E3%81%A1%E3%81%AE%E6%B1%BA%E3%82%81-2.md) | 08-31 12:15 | 待ちの決め-2 — 🙋 の関門に「待ちなしの回は立てない」を実装／⑦の材料 |
| [`自動検査-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-2.md) | 08-31 12:08 | 自動検査-2 — 完全版は環境差で⑦が落ちた。緩めずに報告して速い版へ戻した |

<!-- 控えの一覧 ここまで -->
