# パネルの色-1 — 終了予定の刻だけを明るい水色にした（panel v108）

**状態：終わり（実機で見てください）／本体（`koushu-handan.html`）には触っていない**

**選んだ色は `#7fdfff`（明るい水色）。** 実測のコントラスト比は
**札の地（`--card:#1d3328`）に 8.93 ／ 頁の地（`--bg:#14241c`）に 10.70** で、どちらも 4.5 を超える。

---

## ① 色の選び方 — 白ではなく水色にした

暗い緑の地で読める候補を並べて測った（比は 札の地 ／ 頁の地）。

| 色 | 札の地 | 頁の地 | 4.5以上 |
|---|---|---|---|
| いまの黄色 `#e8c14a`（`--ask`） | 7.81 | 9.36 | ○ |
| **明るい水色 `#7fdfff`（採用）** | **8.93** | **10.70** | ○ |
| 白 `#ffffff` | 13.49 | 16.17 | ○ |
| 水色 `#9fe8ff` | 9.93 | 11.90 | ○ |
| 青緑 `#5ad0e0` | 7.41 | 8.88 | ○ |

**白を採らなかった理由** — 本文の色（`--fg:#f3ece0`）と近く、**ふつうの字に見えてしまう**。
水色は**黄色の補色**にあたるので、同じ行に並べたときの見分けがいちばん付き、
本文の色とも取り違えない。比も 8.93 と十分にある。

＊比は WCAG の式（相対輝度から `(L明+0.05)/(L暗+0.05)`）で出した。
　**検査でも同じ式で、描かれた実際の色から測り直している**（下の ④）。

## ② 刻の字だけを別の色に

```
作業中（パネルの色-1）、16時53分終了予定（開始15:28・経過25分・指示15:20）
└──────── 黄色 ────────┘└─ 水色 ─┘└──────── 黄色 ────────┘
```

塗る所（`paintStateLine`）で、**逃がしたあとに**刻を `<span class="pred">` で包む。
包んでから逃がすと、足した札そのものが字として出てしまう。刻は数字と漢字だけなので、
逃がしても形は変わらない。

＊包むのは **「HH時MM分終了予定」の形だけ**。「終了予定不明」「終了予定 未定」は包まない
　（刻が無いので、目立たせる相手がいない）。
＊**太さは変えていない。** 字幅が変わると、固定した高さ（79px）の見積もりが崩れるため。

## ③ ウィジェットも同じ色に

`Color('#7fdfff')` を `PRED` として持たせ、返事パネルの `--pred` と**同じ値**にした。

Scriptable の `addText` は色を一つしか持てないので、色を分けるには字を分けるしかない。
`stateParts()` が `stateText()` の返り字から刻だけを切り出し（**組み立ては二つ持たない**）、
状態と刻を**縦に積む**。横に並べると折り返せず、狭いウィジェットで刻が切れる。

＊刻の無い状態（次の指示待ち・ヨシを返してください・異常）は**一行のまま**で、
　いままでと同じ見え方になる。

## ④ 実測

**返事パネル**（`node panel-check.js` の ⑨ を新設。描かれた実際の色を読んで比を出す）

```
⑨ 終了予定の刻だけが別色
  ✓ 作業中：刻「16時53分終了予定」が水色（比 8.93）／外は黄色（比 7.81）
  ✓ 手待ち：包まず黄色のまま（次の指示待ち）
  ✓ ヨシ待ち：包まず黄色のまま（ヨシを返してください）
```

**`panel-check.js` は ①〜⑨ すべて PASS。** 高さの固定（⑤・79px）も崩れていない。
**ウィジェット**（`node widget-check.js`）も ①〜⑦ すべて PASS。

**実機で見るところ**
- 版の字が **panel v108**
- 黄色の行で、**「HH時MM分終了予定」だけが水色**。「作業中（…）」と括弧の中の
  開始・経過・指示は**今までどおり黄色**
- 「次の指示待ち」「ヨシを返してください」は**全部黄色のまま**（変わっていないこと）
- ウィジェットは、状態の下に**水色の一行で終了予定**が出る

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **112件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`パネルの色-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E8%89%B2-1.md) | 09-02 16:33 | パネルの色-1 — 終了予定の刻だけを明るい水色にした（panel v108） |
| [`終わりの黙り-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E9%BB%99%E3%82%8A-4.md) | 09-02 16:06 | 終わりの黙り-4 — 写せます（ready）を、終わりと同じ道へ乗せた |
| [`仕事の数え方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BB%95%E4%BA%8B%E3%81%AE%E6%95%B0%E3%81%88%E6%96%B9-1.md) | 09-02 14:40 | 仕事の数え方-1 — 生存確認を仕事に数えない。**できる。狭く取れば当てられる** |
| [`走り出しの時刻ずれ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E6%99%82%E5%88%BB%E3%81%9A%E3%82%8C-1.md) | 09-02 06:49 | 走り出しの時刻ずれ-1 — 「22時58分」は**前の仕事の開始 ＋ いまの見込み**だった |
| [`使用量の空振り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E7%A9%BA%E6%8C%AF%E3%82%8A-1.md) | 09-02 06:48 | 使用量の空振り-1 — 06:04 の取得は**成功していた**。本文が「枠の立っていない形」だった |
| [`走り出しの黙り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-2.md) | 09-01 21:17 | 走り出しの黙り-2 — 黙っていた理由は「見込みが無い」。見込み無しでも鳴らす形へ |
| [`持ち越しの根治-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8C%81%E3%81%A1%E8%B6%8A%E3%81%97%E3%81%AE%E6%A0%B9%E6%B2%BB-1.md) | 09-01 20:53 | 持ち越しの根治-1 — 仕事に属する印を、切り替わりで一箇所から落とす |
| [`巡回の固まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-1.md) | 09-01 20:31 | 巡回の固まり-1 — 13分の固まりの中身と、預かりの期限・固まりの一発 |
| [`知らせの止まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-2.md) | 09-01 20:12 | 知らせの止まり-2 — 😽 は25分遅れて出た。止めたのは巡回の固まり（空振り除けは無関係） |
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

<!-- 控えの一覧 ここまで -->
