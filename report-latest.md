# 写しの一本化-1 — 押す所を一つにした（panel v114）

**状態：終わり（実機で見てください）／本体（`koushu-handan.html`）には触っていない**

**「通知の本文を写す」の釦は畳んだ。** 「まとめて写す」が**札と通知の両方**を数え、
**刻の順で一枚に並べて**写す。印と畳みは今までどおり。

---

## ① 残N／M件が、札と通知の両方を数える

数える所を `mergedTodo()` 一つへ寄せた。

```js
function mergedTodo() {
  未写しの札（shown から copied を外す）  → { kind:'card' }
  未写しの通知（ntfySent から ntfyCopied を外す） → { kind:'ntfy' }
  刻の新しい順に並べて返す
}
```

- **N** … `mergedTodo()` の数（＝押せば必ずこの数が写る）
- **M** … 直近の「写せます（N件）」の数 ＋ 控えにある通知の本数

**写す字も、印を付ける相手も、釦の数も、この一回の並びから取る**（v74 からの決まりをそのまま延ばした）。

## ② 押すと、刻の順で一枚に並ぶ

通知は `ntfyCardOf()` が**札と同じ形（一行＋本文）**にする。
一行の真ん中に **「通知」** と入るので、札と見分けられる。

```
15:07 ／ 終わりました ／ 札その3
札その3
札3の二行目
15:05 ／ 通知 ／ 通知その2          ← 通知はここが「通知」
通知2の本文
15:03 ／ 調べました ／ 札その2
…
```

## ③ 印と畳みは今までどおり

- 印の持ち方は**別のまま**（札は `copied`、通知は `ntfyCopied`）。押す所だけを一つにした
- 写せなかったときは**どちらにも印を付けない**（`copyBundle` の構えのまま）
- 未写しが0件になれば**釦ごと畳む**

＊使わなくなった `ntfyLeft` / `ntfyBundle` / `setCopyNtfyLabel` / `copyNtfyLatest` は畳んだ。
　残したのは `ntfyKeyOf`（印の鍵）と `ntfyCopied`（印）と `pullNtfyLatest`（取得）の三つで、
　まとめて写すの側がそのまま使う。

## ④ 実測（probe。作り値は 札3枚＋通知2本）

```
押す前  : まとめて写す（残5／5件）
押した後: 5件 写した
2.6秒後 : まとめて写す（0件）  ／ 畳んだか=true
写し 15行
   3| 15:07 ／ 終わりました ／ 札その3      ← 新しい順
   6| 15:05 ／ 通知 ／ 通知その2
   8| 15:03 ／ 調べました ／ 札その2
  11| 15:02 ／ 通知 ／ 通知その1
  13| 15:00 ／ 終わりました ／ 札その1
```

**残5／5件 → 5件 写した → 0件で畳む。五つ全部が刻の順で一枚に入っている。**

`panel-check.js` の ⑩ を**統合後の姿へ差し替え**（前は畳んだ釦を測っていた）、
**①〜⑬ すべて PASS**。

**実機で見るところ**
- 版の字が **panel v114**
- 釦は **「まとめて写す（残N／M件）」の一つだけ**（「通知の本文を写す」は無い）
- N が**札と通知の合計**になっている
- 押すと**一度のタップ**で写り、貼ると**札と通知が刻の順**に並び、通知の行には**「通知」**が付く
- 押したあとは **0件で畳まれる**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **121件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`写しの一本化-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E6%9C%AC%E5%8C%96-1.md) | 09-03 15:17 | 写しの一本化-1 — 押す所を一つにした（panel v114） |
| [`通しの試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E3%81%97%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-03 13:28 | 通しの試験-1 — 小さな仕事を一つ流して、端から端まで見届けた |
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

<!-- 控えの一覧 ここまで -->
