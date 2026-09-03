# 板の欠け-1 — 公開側の `board.json` は無事だった。消えていたのは**手元の値**

**状態：終わり（実機で見てください）／本体（`koushu-handan.html`）には触っていない**

**結論** — `board.json` は**消えても、名前が変わっても、壊れてもいない。書き出しも止まっていない。**
落ちていたのはパネルの側で、**取得が一度こけると前に読めた値を捨てていた**。
2分ごとの取得なので、通信が一度転ぶだけで**最大2分、板の箱と写しの板の行が消える**。

---

## ① 公開側の `board.json` をいま実読みした

```
HTTP/1.1 200 OK
Content-Length : 909
Content-Type   : application/json; charset=utf-8
Last-Modified  : Thu, 03 Sep 2026 02:36:11 GMT （＝ 11:36:11 JST）
Age: 0 ／ X-Cache: MISS
大きさ         : 909 バイト
JSON として通る : 鍵 waiting / recent / at
```

**200・909バイト・JSON も通る。** 手元の `board.json` も同じ 909 バイトで、
最終更新は **10:12:09**。

＊`Last-Modified` の 11:36 は**サイトの配り直しの刻**で、`board.json` が書き換わった刻ではない
　（[[読み口の詰まり-1]] のとおり、Pages は全ファイルに配り直しの刻を付ける）。

## ② 11:27 前後に board.json へ何が起きたか — **何も起きていない**

| 刻 | commit | 触ったもの |
|---|---|---|
| 10:14:02 | `2ed869a` | **board.json：板の値を更新** ← 今日の最後 |
| 11:24:22 | `d35aff7` | usage: 更新 |
| **11:27:26** | `89bc03b` | **state.json：いまの様子を更新** |
| 11:35:21 | `86ad693` | usage: 更新 |
| 11:47:07 / 11:47:28 | — | state.json |

**11:27 前後の押しは `state.json` と `usage.json` だけで、`board.json` には触れていない。**

- 消えた … していない（200 で読める）
- 名前が変わった … していない（同じ道）
- 中身が壊れた … していない（JSON として通る）
- 書き出しが止まった … **止まっていない。**`board-emit.ps1` は**値が動いた回だけ**書く作りで、
  10:14 以降は板の値が動いていないだけ（前日も 16:12／16:44／17:44／18:02… と不定期）

## ③ 直したのはパネルの側

**落ちていた所**（`panel.html`・v112 まで）

```js
.catch(function (e) { board = null; boardErr = e.message; paintBoard(); });
                      ^^^^^^^^^^^^ 取得が転ぶたびに、前に読めた値を捨てていた
```

`board` が `null` になると `boardHtml()` が箱の代わりに
「板の値を読めません（Load failed）」を出し、`bundleBoard()` は空を返すので
**写しからも板の行が消える**。11:45 に見えていたのは、まさにこの姿。

**直し（v113）** — 取れない回は**値を残す**。断りは `boardErr` に持ち、
**一度も読めていないとき（`boardEverRead` が偽）だけ**理由を出す。

```js
.catch(function (e) { boardErr = e.message; paintBoard(); });
```

## 実測

**probe**（`node panel-check.js` の ⑬ を新設。**取得そのものを転ばせて**「Load failed」を作る）

```
⑬ 板が取れない回に前の値を残す
  ✓ 取得が転んでも板の箱が残った（あなた待ち（1件）写す1. 板の欠け-1 の実機確認…）
  ✓ 一度も読めない回は、今までどおり理由を出す
```

**`panel-check.js` は ①〜⑬ すべて PASS。**

**実機で見るところ**
- 版の字が **panel v113**
- 通信が一瞬途切れても、**板の箱（あなた待ち／直近に終わった仕事）が消えない**
- 「まとめて写す」で貼った字に、**板の行が残っている**
- 一度も読めていないときだけ「板の値を読めません（…）」が出る

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **119件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`板の欠け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9D%BF%E3%81%AE%E6%AC%A0%E3%81%91-1.md) | 09-03 12:03 | 板の欠け-1 — 公開側の `board.json` は無事だった。消えていたのは**手元の値** |
| [`写しの切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E5%88%87%E3%82%8C-1.md) | 09-03 10:03 | 写しの切れ-1 — 切っていたのは `buildBundle` ではなく、見張りの控えの読み手 |
| [`札の抜け-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2-2.md) | 09-03 06:43 | 札の抜け-2（続き）— 昨夜の直しは**一度も働いていなかった**。枝の順が原因 |
| [`通知の分け方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%88%86%E3%81%91%E6%96%B9-1.md) | 09-02 23:05 | 通知の分け方-1 — 長い報告は ntfy へ送らない。札にして、釦で一枚で写す |
| [`札の抜け-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2.md) | 09-02 22:55 | 札の抜け-2 — 取り逃がした stop を拾い直す（終わりの札を運任せにしない） |
| [`通知のコピー-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC-1.md) | 09-02 19:48 | 通知のコピー-1 — 送った本文を「まとめて写す」と同じ形で写せるようにした（panel v111） |
| [`読み口の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E5%8F%A3%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-02 17:52 | 読み口の詰まり-1 — `?_t=` は CDN に効いていない。遅れの正体は Pages の配り直し |
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

<!-- 控えの一覧 ここまで -->
