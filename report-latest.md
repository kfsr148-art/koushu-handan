# ウィジェットの守り-1 — ウィジェット側を検査の網に入れた

**状態：終わり（残り0件）／VAIO 2026-09-01 15:2x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — `widget-check.js` を新設し、**Actions の網へ入れた**（`check.yml` の `paths` に
`usage-widget.js`／`usage-widget-loader.js`／`widget-check.js` を足し、完全版の後ろに段を追加）。
六つを見る。**わざと壊した四通りすべてで落ち、いまの姿では通る**。
Actions でも **success**（run 33476454678・12分55秒）で18項目すべて ✓。

---

## ① 押すたびに機械が確かめる形

```yaml
on:
  push:
    paths:
      - 'koushu-handan.html'
      - 'check.js' / 'adv-check.js' / 'check-all.js' / 'ver.txt'
      - 'usage-widget.js'          # ← 足した
      - 'usage-widget-loader.js'   # ← 足した
      - 'widget-check.js'          # ← 足した
      - '.github/workflows/check.yml'
…
      - name: ウィジェットの検査（widget-check.js）
        run: node widget-check.js
```

手元でも `node widget-check.js` で同じものが回る。落ちたら終了コード1（Actions は 🚨 を鳴らす）。

## ② 見る中身（六つ）

| | 何を見るか |
|---|---|
| ① 構文 | 二枚とも module として読めるか |
| ② 出し口 | 本体に `module.exports` と **`build`（関数）** が在るか |
| ③ 控えの名 | 殻の `CACHE` が本体の名と別か／`Script.name()` と突き合わせているか／**台本と同じ名のとき上書きしないか**（作り値でも） |
| ④ 四通り | 作業中・手待ち・ヨシ待ち・異常で、`build` が例外を出さずウィジェットを返し、**状態の字と猫の絵**が揃うか |
| ⑤ ボーダー | 境目の三点（リセット直後 **14.3%**／境目前 **85.7%**／境目後 **100%**） |
| ⑥ 猫の絵 | 四枚が公開側に在るか（**404 は落ち**。通信そのものが出来ない回だけ「測れなかった」として落ちと分ける） |

## ③ 真似た台と、そこでは拾えないもの

Scriptable の道具（`Color`／`Font`／`ListWidget`／`Size`／`Request`／`Script`／`config`／`FileManager`）は
node に無いので、**使う分だけ真似た台**を作って走らせる。台は本物ではないので、**次のものは拾えない**
——検査そのものが末尾に毎回書き出す。

- **`importModule` と台本の置き場（iCloud か local か）まわりの振る舞い**
  ＊ここで実際に食い違い、**実機だけで落ちた前例がある**（2026-09-01・殻の直し-1）。
    いまは `importModule` を使わない形にしたが、**台では「使わないこと」しか確かめられない**。
- `loadImage` が返す実体（台では名を返すだけ）と、**絵の見え方・大きさ**
- **ウィジェットの見た目**（はみ出し・折り返し・色）と、触ったときの遷移
- iOS 側の取得の間隔と控えの持ち方

## ④ 実測

**わざと壊した作り値**（本体には触らず、写しを一時ディレクトリで壊して検査に掛けた）

| 壊し方 | 終了コード | 落ちた項目 |
|---|---|---|
| (甲) `build` を消す | **1** | 「build が出ていない（殻が受け取れない）」＋四通りも全滅 |
| (乙) 絵の道を間違える | **1** | 「cat2-white-NOTEXIST.png … HTTP 404（公開側に無い）」 |
| (丙) 式を切り捨てへ戻す | **1** | 「境目前 … 71.4%（85.7% のはず）」「境目後 … 85.7%（100% のはず）」 |
| (丁) 控えの名を本体と同じに | **1** | 「控えの名が本体と同じ（usage-widget.js）。台本名と重なると自分を上書きする」 |
| (戊) いまの姿 | **0** | 通った |

**Actions（run 33476454678・success・12分55秒）** … ウィジェットの検査の段で18項目すべて ✓。

```
✓ usage-widget.js は読める / usage-widget-loader.js は読める
✓ module.exports が在る / build が関数として出ている
✓ 控えの名は claude-usage-cache.js（本体の名と別）
✓ 殻は台本の名と突き合わせている / 台本と同じ名でも、控えを上書きしない
✓ 作業中：作業中、6時38分終了予定／絵 cat2-white.png
✓ 手待ち：次の指示待ち／絵 cat-sleep-white.png
✓ ヨシ待ち：ヨシを返してください／絵 panel-icon-white.png
✓ 異常：異常です／絵 cat4-white.png
✓ リセット直後 … 14.3% / 境目前 … 85.7% / 境目後 … 100%
✓ cat2-white.png … 200 / cat-sleep-white.png … 200 / panel-icon-white.png … 200 / cat4-white.png … 200
```

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **99件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`自動検査-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-1.md) | 08-31 09:54 | 自動検査-1 — GitHub Actions で check.js と adv-check.js を push ごとに回す |
| [`使用量の配分-2-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-3.md) | 08-30 20:42 | 使用量の配分-2 の訂正 — ボーダーの式を切り上げへ |
| [`通知の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 08-30 20:30 | 通知の走り出し-1 — 仕事が始まったら「😸 終了予定はHH時MM分ですにゃ」を一発 |

<!-- 控えの一覧 ここまで -->
