# 写しの絞り-1 — 貼る写しから、判断に使わない行を落とした（panel v106）

**状態：終わり（残り0件）／VAIO 2026-09-01 17:4x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — 貼る写しから **「直近に終わった仕事」の三行** と **「ファイル:」の行** を落とした。
ただし**壊れの調べ・原因の特定が本題の回は「ファイル:」を残す**。
**「実機:」「実測:」と報告の本文は今までどおり全部**。**絞りは貼る写しだけ**で、
画面も `reports/` の記録も一字も減らしていない。

---

## ① 「直近に終わった仕事」の三行 — 写しから落とした

`bundleBoard()` から `board.recent` の行を外した。**既に検収の済んだ分の繰り返し**で、
貼った先での判断には使わないため。

- **画面には今までどおり出る**（畳んだ箱「直近に終わった仕事（N件）」の中）。
- **「あなた待ち」は残す**——こちらは返事の要る側なので、写しに要る。

## ② 「ファイル:」の行 — 落とす。ただし調べの回は残す

写しを組むときに `ファイル:` の行（と、その続きの字下げ）を落とす。
**残す回の見分け**は、題か本文に次の字があるとき——

```
調べました／調べた／原因／不具合／壊れ／こわれ／落ちた／落ちて／失敗／誤り／直し／直す／異常／穴／取りこぼし／詰まり
```

壊れの調べや原因の特定では、**どのファイルを見たかが答えの一部**になるため。

## ③ 残すもの

- **`実機:`** … 触って確かめるのは読む側なので残す。
- **`実測:` と報告の本文** … 今までどおり全部。

## ④ 絞りは写しだけ

- `reports/<印>.md` … **一字も変えていない**（`ファイル:` も従来どおり全部載る）。
- パネルの画面 … 「直近に終わった仕事」の箱も、札の本文も従来どおり。
- 変えたのは `panel.html` の**写しを組む二箇所**（`bundleCards()` の `trimForCopy()` と `bundleBoard()`）。

## 実測（写しを実際に組ませて、貼る字を読んだ）

作り値 … ふつうの回（`✅ 終わりました`／本文に `ファイル:` あり）と、調べの回（`🔎 調べました`／同）を各一枚、
板は あなた待ち1件・直近に終わった仕事3件。

```
 1: https://kfsr148-art.github.io/koushu-handan/notices.json
 2: 現況：次の指示待ち ／ 本体v1435 ／ stable v1434 ／ 最終確認17:43
 3: 17:37 ／ 調べました ／ パネルの調べ（原因の特定）
 4: パネルの調べ（原因の特定）
 5: 完了: 落ちた原因を追った。
 6: ファイル: panel.html（1074行あたり）、watch-notify.ps1     ← **調べの回なので残る**
 7: 実測: 落ちるのは幅746のときだけ
 8: 17:35 ／ 終わりました ／ 写しの絞り-1（…）
 9: 写しの絞り-1（…）
10: 完了: 直近に終わった仕事の三行とファイルの行を写しから落とした。
11: 実測: 甲＝ファイルの行なし／乙＝残る                        ← ふつうの回は **ファイル: が無い**
12: 実機: パネルで「まとめて写す」を押し、貼った字にファイルの行が無いこと
13: 17:00 ／ あなた待ち ／ 待っている件 ／ 印 y0901-x            ← あなた待ちは残る
```

| 見たところ | 結果 |
|---|---|
| 写しに「直近に終わった仕事」の行 | **入っていない** |
| 画面の「直近に終わった仕事」の箱 | **出ている**（落としたのは写しだけ） |
| 写しの「あなた待ち」 | 入っている |
| 写しに残った `ファイル:` | **調べの回の一行だけ**（ふつうの回は落ちている） |
| 写しの `実機:` ／ `実測:` | どちらも在る |

＊はじめ判定が「本文に出てくる『直近に終わった仕事』の語」にも釣られて誤って旗が立った。
　**板の行の形（`／ 直近に終わった仕事 ／`）で見る**ように直して測り直した。

**返事パネルの検査（`panel-check.js`）も全てPASS**（構文・四通り・束ねの数・三視野・札の高さ・終了予定）。
版は三箇所とも **106**。

## 公開と Actions

- 公開側 … `panel-ver.txt` = **106**（17:48:50）。本体も `verTag`=**panel v106**、`trimForCopy` と
  「v106 で写しから落とした」の注記が入っていることを実読みで確認。
- Actions … **run 33488859585・success・12分12秒**（08:47:34Z → 08:59:46Z）。
  返事パネルの検査・ウィジェットの検査とも **全てPASS**。

## 実機で見るところ

パネルで「まとめて写す」を押し、貼った字に **「直近に終わった仕事」の行が無い**こと、
ふつうの回の **「ファイル:」が無い**こと（壊れの調べの回には在る）。版の字が **panel v106**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **102件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`写しの食い違い-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%A3%9F%E3%81%84%E9%81%95%E3%81%84-1.md) | 08-31 11:50 | 写しの食い違い-1 — 束ねる側を数える側に合わせた（panel v104） |

<!-- 控えの一覧 ここまで -->
