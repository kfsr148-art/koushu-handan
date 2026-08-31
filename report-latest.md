# 手牌の境目-3 — `--vz-show` の745は据え置きで確定（掘り返さないための裁定の控え）

**状態：終わり／VAIO 2026-09-01 03:0x ／ 見た目は変えていない（注記のみ・v1435）**

**裁定** — 260行の `@media (max-width: 745px) { :root { --vz-show: var(--vz-show-narrow); } }` は
**連続化せず、現状のまま据え置き**（2026-09-01）。**この点は今後掘り返さない。**

---

## 理由

1. **実害が無い。** 1px で見た目は跳ぶが、**溢れも送り（スクロール）も両側0**で、
   末尾の二択はどちらの側でも視野の内に残る。
2. **連続化は設計変更になる。** `--vz-pair` を幅に連動させる形（例
   `clamp(252px, calc(100vw - 182px), 564px)`）にすると、**667x375＝iPhone 8 の横で
   中央の列が約200px 削られる**。虎と台詞の置き場が半分近くになるため採らない。

## 実測（裁定の根拠。判定後の画面）

| 視野 | 投票枠 | 攻の箱 | 守の箱 | 中央の列 | 送り | 二択 bottom |
|---|---|---|---|---|---|---|
| 743x375 | 2.5 | 198×**150** | 54×48 | **445** | 0 | 375 |
| 744x375 | 2.5 | 198×**150** | 54×48 | **446** | 0 | 375 |
| 745x375 | 2.5 | 198×**150** | 54×48 | **447** | 0 | 375 |
| **746x375** | **5.5** | **493.5×48** | 70.5×48 | **136** | 0 | 347.3 |
| 747x375 | 5.5 | 493.5×48 | 70.5×48 | 137 | 0 | 347.3 |
| 750x375 | 5.5 | 493.5×48 | 70.5×48 | 140 | 0 | 347.3 |

**攻の箱が 150px（3段）→48px（1段）、中央の列が 447→136px** へ 1px で跳ぶ。
けれども**どちらの側でも溢れ0・送り0**で、二択は視野内。

## 併せて（混同しないための一行）

**配牌枠（`.hand`）はこの745を見ていない。** v1434 で牌と隙間を実寸に合わせる形
（`--tile-w` と `gap` の `clamp`）へ移したので、**この745を動かしても手牌には影響しない**。
v1433 まであった「746〜757px で14枚が最大12px切れる」問題は、この745とは別の
1113行の小型化が原因で、そちらは撤去済み。

## どこに残したか

- **本体** … 260行の直前に注記（据え置きの確定・上の実測・連続化を採らない理由・
  配牌枠は745を見ていないこと）。v1435。
- **この控え** … `reports/手牌の境目-3.md`。
- 経緯は `reports/手牌の境目-1.md`（境目の実測と二案）と `reports/手牌の境目-2.md`（案Aの実装）に。

## 検査（注記だけの回）

速い版 `node check-all --fast`。**二回目で 19/19・全てPASS**（`check`・`adv-check` とも）。

一回目は ✗ が2件出たが、どちらも「**ブラウザが120秒で返らないため打ち切った**」（title 568x320 と
judged 568x320）で、**溢れではない**。前の回で打ち切った検査の msedge が2本残っており、CPU も 66% だった。
掃除して（残骸0本・CPU 44%）回し直したところ**両方とも普通に測れて溢れなし**。機械側の一過性と判じる。
＊同じ視野は v1434 の完全版（189/189）でも Actions の完全版でも通っている。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **92件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`手牌の境目-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-3.md) | 09-01 03:34 | 手牌の境目-3 — `--vz-show` の745は据え置きで確定（掘り返さないための裁定の控え） |
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
| [`猫の常駐-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E5%B8%B8%E9%A7%90-1.md) | 08-30 17:36 | 猫の常駐-1 — 題字の右に RunCat の猫を置いた（panel v103） |
| [`途切れの回収-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%94%E5%88%87%E3%82%8C%E3%81%AE%E5%9B%9E%E5%8F%8E-1-2.md) | 08-30 17:02 | 途切れの回収-1 の裁定 — dead / stale: も一発だけ押し送る |
| [`通知の宛先-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%AE%9B%E5%85%88-1-2.md) | 08-30 16:44 | 通知の宛先-1 — 旧話題へ送る・読む箇所は **0件** |
| [`通知の急ぎ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-3.md) | 08-30 16:33 | 通知の急ぎ-3 — 見切り送信を撤廃した |
| [`穴の直し-1-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-4.md) | 08-30 16:32 | 穴の直し-1 ③ の裁定 — 焼き付けの四枚を消した（6.97MB） |

<!-- 控えの一覧 ここまで -->
