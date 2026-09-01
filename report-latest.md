# ウィジェットの猫の色-1 — ウィジェットの猫を白へ（元絵とパネルはそのまま）

**状態：終わり（残り0件）／VAIO 2026-09-01 13:0x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — ウィジェットに出る四枚を白へ焼き直した。三枚は**黒一色の影絵**だったので色を反転。
**`panel-icon.png` は透明が無く**（深緑の背景が65%）そのままでは四角い塊に見えるので、
**背景を抜いて白い影絵**にした（差し替えではなく白へ寄せた）。焼き直しは `cat-white.js` で
何度でもやり直せる。**元絵は残し、返事パネルの猫は変えていない。**

---

## ① いまの絵の作り（headless の canvas で数えた）

| 絵 | 大きさ | 透明 | 明るさの幅 | いちばん多い色 |
|---|---|---|---|---|
| `cat2.png` | 56x36 | 66% | **0〜0** | 黒 100% |
| `cat-sleep.png` | 56x36 | 52% | **0〜28** | 黒 84%（残りは縁の淡い灰） |
| `cat4.png` | 56x36 | 68% | **0〜0** | 黒 100% |
| `panel-icon.png` | 180x180 | **0%** | 0〜255 | **深緑 20,36,28 が 65%**／白 7% |

**三枚（cat2・cat-sleep・cat4）は黒一色の影絵**なので、色だけ反転して白にした
（透明の度合いはそのまま。縁の淡い灰は 229 前後の淡い白になる）。

焼いた物（元絵は残す）

| 焼いた物 | 大きさ |
|---|---|
| `cat2-white.png` | 56x36 |
| `cat-sleep-white.png` | 56x36 |
| `cat4-white.png` | 56x36 |
| `panel-icon-white.png` | **164x152**（余白を落として切り詰めた） |

道具は **`cat-white.js`**（リポジトリ直下）。`node cat-white.js` で四枚とも焼き直せる。

## ② `panel-icon.png`（現場猫）の判断 — **白へ寄せた**（差し替えではなく）

- **差し替えなかった理由** … 「ヨシ待ち」に現場猫を当てているのは、**ヨシが現場猫の言葉**だから（作法11）。
  ほかの走り猫に替えると、その筋が切れる。
- **そのままにしなかった理由** … この絵は**透明が0%**で、深緑の背景ごと不透明。
  ウィジェットの地（`#0d1b16`）とは違う緑なので、**猫ではなく四角い塊**に見える。
- **採った形** … 四隅の色を背景とみなし、そこから離れた画素だけを**白一色**で残して切り詰めた。
  **兜と指差しの形は残る**ので、小さくても現場猫と分かる。

暗背景（本番と同じ `#0d1b16`）に並べて目視したところ、四枚とも白く出て、
26px 幅に縮めても走る猫・眠り猫・現場猫・跳ねる猫の区別が付いた（作法21 の「暗背景で目視」）。

## ③ 白にしたのはウィジェットだけ

- 替えたのは `usage-widget.js` の `CAT_OF`（絵の名だけ）。
- **返事パネル（`panel.html`）は `cat0〜4.png` と `cat-sleep.png` のまま**——一字も触っていない。
- 元絵四枚もそのまま残してある。

## ④ 実測（公開から取ってきた実物 11039字で、四通りの状態を差し替えて）

```
作業中     絵=cat2-white.png        字=["作業中、13時15分終了予定", "写せます2件 ・ v1435"]
手待ち     絵=cat-sleep-white.png   字=["次の指示待ち",             "写せます2件 ・ v1435"]
ヨシ待ち   絵=panel-icon-white.png  字=["ヨシを返してください",     "写せます2件 ・ v1435"]
異常       絵=cat4-white.png        字=["異常です",                 "写せます2件 ・ v1435"]

使用量の行         : ["セッション","週全体","週 Fable"]
ボーダーの行       : ["20:00まで 14.3%  6日後","20:00まで 14.3%  6日後"]
触ったときの開き先 : https://kfsr148-art.github.io/koushu-handan/panel.html
取りに行った先     : usage.json / state.json / notices.json / ver.txt / cat2-white.png
```

公開側の四枚も **HTTP 200** で配られていることを確かめた（12:59:25 push → 13:00:50 反映）。

## 実機で見るところ

ウィジェットの猫が**白**になっていること——作業中＝走る猫／次の指示待ち＝眠り猫（Z付き）／
ヨシ待ち＝現場猫（兜と指差し）／異常＝跳ねる猫。**返事パネルの猫は今までどおり黒のまま**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **98件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`使用量の配分-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-2.md) | 08-30 19:52 | 使用量の配分-2 の続き — usage-widget.js へボーダーの行を実装した |

<!-- 控えの一覧 ここまで -->
