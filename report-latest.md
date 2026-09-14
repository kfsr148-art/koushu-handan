# 合わせ技-2（八人の合計の上位だけを攻めにする）

**終わり** — 2026-09-14 20:4x（VAIO）。本体・`core-battle-log.tsv` には触っていない。台は `scratchpad/mix2.js`（読むだけ）。
決め用（局1〜7500・30000手）で決めた重みは 合わせ技-1 と同じ … 執事 915／軍師 564／ずんだ 232／お嬢様 664／マダム 208／一姫 -942／先生 446／兎 698／切片 -322。

## ①② 測り用（後10000手）を合計の高い順に並べ、上から N% だけ攻めにする

| 決め方 | 攻めと言った手 | 守りと言った手 | 全体の的中 | 合計の敷居 |
|---|---|---|---|---|
| **本判定** | 31.8%・+1100点（2402手） | 17.8%・-115点（7598手） | 67.8% | — |
| **上位10%** | **35.8%・+1881点**（1000手） | 19.5%・-12点（9000手） | **72.5%** | 1144点 |
| **上位24.02%（本判定と同数）** | 31.7%・**+1279点**（2402手） | 17.8%・-171点（7598手） | **68.4%** | 614点 |
| **上位35%** | 29.7%・+1005点（3500手） | 16.5%・-269点（6500手） | 64.1% | 363点 |

＊勝率は和了率。点棒は一局あたりの平均。

**同じ手数まで絞れば、八人の合計は本判定を上回る。**
上位24.02%（＝本判定と同じ2402手）で、攻めの点棒が **+1100 → +1279点（+179点）**、的中が
**67.8% → 68.4%（+0.6ポイント）**。守り側も -115 → -171点と下がっており、
**攻守の差は +1215点 → +1450点**へ開いた。

**合わせ技-1 で負けたのは、並べ方ではなく敷居。** 「合計 > 0」で切ると攻めが 5496手（55.0%）になり、
的中が 54.5% まで落ちていた。順位そのものは本判定より良かったのに、切る位置が浅すぎただけである。

**絞るほど濃くなる。** 上位10%では攻めの点棒が **+1881点**、的中 **72.5%**。
逆に上位35%まで広げると +1005点・64.1% と、本判定より両方悪くなる。
**攻めと言う手数は 10%〜24% のあたりが働きどころ**で、そこから先は薄い手を拾っている。

## ③ 紙一重の定め

**本体の定めは `analyze()` の `edgeFlag`**（`koushu-handan.html` L3105〜3127）。二つの口がある。

- 形が足りている側（`shapeOK`）… **受けが狭くて守へ倒した手**
  （`acceptTiles < (isDealer ? 6 : 8) && doraValue <= 1` → `narrowDefend`）
- 形が足りていない側 … **受けの広さで攻へ格上げした手**（`wideAttack`）
- 国士が見えた手・役満手前の手は、`verdict` を攻めに固定したうえで `edgeFlag` を **false へ戻す**

**合わせ技-1 で使ったのは `a.borderline`、すなわち同じ `edgeFlag`。定めは同じ。**

**ただし記録の欄と引き直しの値は食い違う。**

| | 測り用10000手のうち紙一重 |
|---|---|
| `core-battle-log-10k.tsv` の `borderline` 欄 | **159手（1.6%）** |
| いまの本体で引き直し | **43手（0.4%）** |

記録は **v1439 の頃**に書いたもの。**v1440 が向聴3の子の幅の関門を外した**ので、
そこで `wideAttack` になっていた手が丸ごと消え、紙一重もそのぶん減った。
合わせ技-1 の「紙一重43手」は**いまの本体の定めでの数**であり、記録の欄ではない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **221件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`合わせ技-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-2.md) | 09-14 20:44 | 合わせ技-2（八人の合計の上位だけを攻めにする） |
| [`合わせ技-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-1.md) | 09-14 20:31 | 合わせ技-1（八人の点数の重み付き合計） |
| [`y0913-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0913-0015.md) | 09-13 00:34 | 配信の切り分け-1（印 y0913-0015） |
| [`y0912-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2100.md) | 09-12 21:21 | 選択釦-1 — v1439（印 y0912-2100） |
| [`y0912-2015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2015.md) | 09-12 20:16 | ヨシの猫-7 — ヨシ待ちの頭を現場猫の顔へ（印 y0912-2015） |
| [`y0912-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1940.md) | 09-12 19:44 | ヨシの猫-6 — 現場猫の置き場を三つへ（印 y0912-1940） |
| [`y0912-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1915.md) | 09-12 19:14 | ヨシの猫-5 — 現場猫の絵を綺麗にした（印 y0912-1915） |
| [`検査を雲へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%82%92%E9%9B%B2%E3%81%B8-1.md) | 09-12 13:42 | 検査を雲へ-1 — Actions で検査し、通った版だけ配信する |
| [`知らせの押し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-2.md) | 09-12 12:31 | 知らせの押し-2 — 束ねない題と、小さな押しを通す／㉑〜㉔の今の状態 |
| [`知らせの押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-12 12:04 | 知らせの押し-1 — 03:00 以降に押した一覧と、09:47 の「延びています」が題を失った理由 |
| [`見張りの止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-12 11:04 | 見張りの止まり-1 — 段の時間切れ・空きの関門・止まりの知らせ |
| [`札の本文-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%9C%AC%E6%96%87-1.md) | 09-12 09:54 | 札の本文-1 — 終わりの札が前の仕事の文で出る／遠隔の橋-1 を閉じた |
| [`外の見張り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-2.md) | 09-12 04:09 | 外の見張り-2 — claude.exe が0本なら /fail を打つ |
| [`外の見張り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-1.md) | 09-12 03:46 | 外の見張り-1 — 巡回の末尾で hc-ping.com へ一分に一発 |
| [`読むだけの台本-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%82%80%E3%81%A0%E3%81%91%E3%81%AE%E5%8F%B0%E6%9C%AC-1.md) | 09-12 03:26 | 読むだけの台本-1 ／ 鉤の軽量化-1 ／ 巡回の空き-1 ／ 人手待ち-1 ／ 知らせの割り当て-1 ／ 重複の枠-1 |
| [`y0912-0300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-0300.md) | 09-12 02:54 | 連携の穴（09-12）— 枠の全文・板と訴えの押し直し・台帳の開き方・知らせの題・フル版の関門・止まった窓（印 y0912-0300） |
| [`連携の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E7%A9%B4-1.md) | 09-12 02:54 | 連携の穴-1 — Codeタブ・返事パネル・GitHub の連携の棚卸し |
| [`y0912-0200.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-0200.md) | 09-12 01:54 | 0x4A の切り分け-1 — 無線LANを外して有線へ、Event 41 で数える（印 y0912-0200） |
| [`0x4A の三（四度目）.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/0x4A%20%E3%81%AE%E4%B8%89%EF%BC%88%E5%9B%9B%E5%BA%A6%E7%9B%AE%EF%BC%89.md) | 09-11 20:57 | 0x4A の三（四度目）— 管理者の窓を開かずに、読める分を片付けた |
| [`落ちた後の起こし-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%90%BD%E3%81%A1%E3%81%9F%E5%BE%8C%E3%81%AE%E8%B5%B7%E3%81%93%E3%81%97-2.md) | 09-11 20:35 | 落ちた後の起こし-2 — 窓の起こし直しと🪟・RC 切れの数え・遠隔の会話名 |

<!-- 控えの一覧 ここまで -->
