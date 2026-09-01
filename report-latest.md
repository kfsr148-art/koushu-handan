# ウィジェットの状態表示-1 — 返事パネルと同じ状態をウィジェットにも出した

**状態：終わり（残り0件）／VAIO 2026-09-01 12:1x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — `usage-widget.js` に**状態の行**（猫の絵＋パネルと同じ言い回し）、**写せますの件数と本体の版**、
**触ったら返事パネルが開く**動きを足した。使用量の三行とボーダーの行はそのまま。
公開から取ってきた実物で**四通りの状態すべて**を確かめ、正しい絵と字が出ることを実測した。
**殻経由で届くので、端末の貼り替えは要らない。**

---

## ① 猫の出し分け（四通り）

| 状態 | 絵 | 選んだ理由 |
|---|---|---|
| 作業中 | **`cat2.png`** | RunCat の走るコマの**静止の一枚**（ウィジェットは動かせない） |
| 次の指示待ち（手待ち） | **`cat-sleep.png`** | 眠り。パネルの猫と同じ振る舞い |
| ヨシ待ち | **`panel-icon.png`** | 現場猫。「ヨシ」は現場猫の言葉（作法11）なので筋が合う |
| 異常 | **`cat4.png`** | ふだんと違う姿の一枚 |

読み先は公開側の `state.json` の `stat`。絵もリポジトリにある既存のものをそのまま使う。

## ② 状態の字（パネルの黄色の行と**同じ計算・同じ言い回し**）

| 状態 | 出る字 |
|---|---|
| 作業中 | `作業中、H時MM分終了予定`（**開始＋見込み**。過ぎていれば見込みの幅で先へ送るところまで同じ） |
| 手待ち | `次の指示待ち` |
| ヨシ待ち | `ヨシを返してください`（橙で出す） |
| 異常 | `異常です`（赤で出す） |
| 読めない | `状態が読めません` |

見込みが無い回は `作業中、終了予定不明`（パネルの `endPredText` と同じ落としどころ）。

## ③ 写せますの件数と本体の版

`写せます2件 ・ v1435` の形で一行。件数は `notices.json` の**いちばん新しい「写せます（N件）」**から取る
（返事パネルと同じ拾い方）。版は `ver.txt`。

## ④ 触ったら返事パネル

`widget.url = https://kfsr148-art.github.io/koushu-handan/panel.html`。

## ⑤ 使用量

**三行ともそのまま**（セッション／週全体／週 Fable）。**ボーダーの行（`20:00まで N%`）も残した**。
詰めてはいない——実測で全部出ている。

## ⑥ 実測（公開から取ってきた実物・10827字で、四通りの状態を差し替えて）

```
作業中     絵=cat2.png        字=["作業中、12時24分終了予定", "写せます2件 ・ v1435"]
手待ち     絵=cat-sleep.png   字=["次の指示待ち",             "写せます2件 ・ v1435"]
ヨシ待ち   絵=panel-icon.png  字=["ヨシを返してください",     "写せます2件 ・ v1435"]
異常       絵=cat4.png        字=["異常です",                 "写せます2件 ・ v1435"]

使用量の行         : ["セッション","週全体","週 Fable"]
ボーダーの行       : ["20:00まで 14.3%  6日後","20:00まで 14.3%  6日後"]
触ったときの開き先 : https://kfsr148-art.github.io/koushu-handan/panel.html
取りに行った先     : usage.json / state.json / notices.json / ver.txt / cat2.png
```

作業中の作り値は「開始10分前・見込み25分」なので、**12時24分終了予定**＝開始＋25分。パネルと同じ計算。

**公開側の更新が次の取得で届くこと**も同じ走りで確かめた——12:07:37 に push、**12:09:02 に公開側が
新しい中身（`stateText` を含む10827字）へ入れ替わり**、その実物を取ってきて上の四通りを回している。
殻は毎回 `?_chk=<時刻>` で取りに行くので、**端末側の貼り替えは要らない**。

## 実機で見るところ

ウィジェットの一行目に**猫と状態の字**（作業中なら `作業中、H時MM分終了予定`）、二行目に
**`写せますN件 ・ v1435`**、その下に使用量の三行とボーダー。**触ると返事パネルが開く**こと。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **97件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`使用量の配分-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-2.md) | 08-30 19:52 | 使用量の配分-2 の続き — usage-widget.js へボーダーの行を実装した |
| [`使用量の配分-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2.md) | 08-30 19:42 | 使用量の配分-2 — 「19:59まで N%」の行は VAIO の側に無い。名と場所を報告して止まる |

<!-- 控えの一覧 ここまで -->
