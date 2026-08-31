# 手牌の境目-2 — 案Aを実装（v1434）。手元も Actions も 189/189 全通過

**状態：終わり（残り0件・ただし `--vz-show` の745は裁定待ち）／VAIO 2026-09-01 02:0x**

**結論** — 配牌枠の牌と隙間を**幅の固定値ではなく実寸に合わせて詰める**形へ替え、
746〜757px で14枚が最大12px切れていた帯を塞いだ。**手元の完全版 189/189 全てPASS**、
**Actions の完全版も success**（run 33416649968・11分50秒）。公開側も v1434 を配っている。
**1113行の配牌枠の小型化は丸ごと撤去**したが、**260行の `--vz-show` の745は残っており、
そこは実測で段差が出る**（溢れは無い）。連続化は見た目を大きく変えるので裁定を仰ぐ。

---

## ① 実装（v1434）

```css
.hand {
  --tile-w: clamp(30px, calc((100vw - 137px) / 14), 36px);
  gap:      clamp(3px,  calc((100vw - 602px) / 13), 12px);
}
.hand .tile { width: var(--tile-w); height: calc(var(--tile-w) * 7 / 6);
              font-size: calc(var(--tile-w) * 0.444); }
.hand .tile .suf { font-size: calc(var(--tile-w) * 0.25); }
```

- **まず隙間が 12→3px へ詰まり、それでも足りなければ牌が 36→30px へ縮む**。上限・下限は
  v1433 までの二段（36/12 と 30/3）と同じ値で、1111行の「牌を縮めるより先に隙間を削る」を連続にした形。
- 137 = 余白98 ＋ 隙間の下限 3px×13 ／ 602 = 余白98 ＋ 牌の上限 36px×14。枠の幅は「視野の幅 − 26px」。
- **1113行の `.hand` の小型化（牌30×36・隙間3・右余白6）は丸ごと撤去**。右余白は 23px のままで、
  いちばん狭い 568px でも収まることを実測した。残ったのは見張り台まわりだけ。

### `%` ではなく `100vw` を使った理由（実装中に踏んだ）

最初は `100%`（枠の中身の幅）で書いたが、**`%` は使う場所ごとに基準が変わる**——
高さでは親の高さ、字の大きさでは親の字の大きさに解ける。同じ `--tile-w` が
width では36px、height では「(44px−39px)/14 → 下限30px」の35pxに解け、**牌が36×35px**になった。
視野幅（`100vw`）を基準にした式へ直して揃えた。

## ② 744〜758 の一覧（判定前の盤面・14枚）

| 視野の幅 | 枠 | 中身 | 溢れ | 牌 | 隙間 | v1433 では |
|---|---|---|---|---|---|---|
| 568 | 542 | 542 | **0px** | 30.78×35.9 | 3px | 0px（小型化） |
| **744** | 718 | 718 | **0px** | 36×42 | 10.92px | 0px（小型化・牌30） |
| **745** | 719 | 719 | **0px** | 36×42 | 11.00px | 0px（小型化・牌30） |
| **746** | 720 | 720 | **0px** | 36×42 | 11.08px | **12px 切れ** |
| **750** | 724 | 724 | **0px** | 36×42 | 11.38px | **8px 切れ** |
| **754** | 728 | 728 | **0px** | 36×42 | 11.69px | **4px 切れ**（⑦は見逃す） |
| **757** | 731 | 731 | **0px** | 36×42 | 11.92px | **1px 切れ**（⑦は見逃す） |
| **758** | 732 | 732 | **0px** | 36×42 | 12.00px | 0px |

**745→746 の段差が消えた**——牌は 36×42 のまま、隙間が 11.00 → 11.08px と連続に動く。
v1433 では同じ境目で牌が 30→36px へ跳び、そこから12px溢れていた。

## ③ 検査

- **手元の完全版**（`node check-all`）… 00:51:48 → 01:51:07（**59分19秒**）、
  **測った組み合わせ 189/189**、**落ち0件**、`check`・`adv-check` とも **全てPASS**。
  746x375 は board・judged とも溢れなし（二択 bottom=347.3 / 375）。
- **Actions の完全版** … **run 33416649968・success・11分50秒**（16:54:20Z → 17:06:10Z）。
  記録に `board 746x375 溢れなし` ／ `judged 746x375 溢れなし（二択 bottom=337.3 / 375）` ／
  `189 / 189` ／ `全てPASS`。額縁の較正も効いている（幅+0 / 高さ+87）。

## ④ 公開側の実読み

`ver.txt` = **1434**（01:55:06 に確認）。本体も `data-ver="1434"` ／ `verTag` = **v1434** ／
`--tile-w: clamp(30px, calc((100vw - 137px) / 14), 36px)` が入っており、
**旧・小型化の `.hand { padding: 4px 6px 4px 49px; gap: 3px; }` は外れている**。

## 残った745 — `--vz-show`（260行）は段差のまま。裁定をお願いします

`@media (max-width: 745px) { :root { --vz-show: var(--vz-show-narrow); } }` は**そのまま**にした。
指示は「745が残るなら断崖でないことを実測で示す」だったが、**実測すると段差がある**ので、
黙って残さずに数字を出す。

| 視野 | 投票枠 | 攻の箱 | 守の箱 | 中央の列 | 送り | 二択 bottom |
|---|---|---|---|---|---|---|
| 743x375 | 2.5 | 198×**150** | 54×48 | **445** | 0 | 375 |
| 744x375 | 2.5 | 198×**150** | 54×48 | **446** | 0 | 375 |
| 745x375 | 2.5 | 198×**150** | 54×48 | **447** | 0 | 375 |
| **746x375** | **5.5** | **493.5×48** | 70.5×48 | **136** | 0 | 347.3 |
| 747x375 | 5.5 | 493.5×48 | 70.5×48 | 137 | 0 | 347.3 |
| 750x375 | 5.5 | 493.5×48 | 70.5×48 | 140 | 0 | 347.3 |

**溢れも送り（スクロール）も両側0で、二択はどちらも視野の内**。壊れてはいない。
ただし**1pxの違いで攻の箱が 150px（3段）→48px（1段）、中央の列が 447→136px へ跳ぶ**。
これは断崖と呼ぶべき動きなので、「断崖ではない」とは言えない。

**連続化するなら**、`--vz-show` の切り替えをやめ、二箱の合計幅を直に幅へ連動させる形になる。

```css
.verdict-zones { --vz-pair: clamp(252px, calc(100vw - 182px), 564px); }  /* 252=2.5枠相当 / 564=5.5枠相当 */
```

**ただしこれは狭い側の見た目を大きく変える。** いまの 667x375（iPhone 8 横）は投票枠2.5・
中央の列がおよそ371pxだが、この式だと二箱が 485px まで広がり**中央の列が約200px 削られる**。
虎と台詞の置き場が半分近くになるので、**溢れの有無とは別に「そう見せたいか」の判断**が要る。
そこは設計の分かれ道なので、**こちらでは決めずに止める**。

＊なお、この745を動かしても**配牌枠には影響しない**（v1434 の式は `--vz-show` を見ていない）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **91件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`手牌の境目-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-2.md) | 09-01 02:07 | 手牌の境目-2 — 案Aを実装（v1434）。手元も Actions も 189/189 全通過 |
| [`手牌の境目-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-1.md) | 08-31 23:24 | 手牌の境目-1 — 746x375 の手牌が12px切れる件。境目は実測で 758px |
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
| [`猫の常駐-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E5%B8%B8%E9%A7%90-1.md) | 08-30 17:36 | 猫の常駐-1 — 題字の右に RunCat の猫を置いた（panel v103） |
| [`途切れの回収-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%94%E5%88%87%E3%82%8C%E3%81%AE%E5%9B%9E%E5%8F%8E-1-2.md) | 08-30 17:02 | 途切れの回収-1 の裁定 — dead / stale: も一発だけ押し送る |
| [`通知の宛先-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%AE%9B%E5%85%88-1-2.md) | 08-30 16:44 | 通知の宛先-1 — 旧話題へ送る・読む箇所は **0件** |
| [`通知の急ぎ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-3.md) | 08-30 16:33 | 通知の急ぎ-3 — 見切り送信を撤廃した |
| [`穴の直し-1-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-4.md) | 08-30 16:32 | 穴の直し-1 ③ の裁定 — 焼き付けの四枚を消した（6.97MB） |
| [`穴の直し-1-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-3.md) | 08-30 16:12 | 穴の直し-1 ③ — 掃除の候補 25ファイル 32.0MB の一覧（消していない） |

<!-- 控えの一覧 ここまで -->
