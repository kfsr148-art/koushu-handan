# 読み口の詰まり-1 — `?_t=` は CDN に効いていない。遅れの正体は Pages の配り直し

**状態：調べただけ（実装はしていない）／本体・パネル・見張りのどれにも手を入れていない**

**いちばん大きい発見** — **`?_t=` を付けても GitHub の CDN の古い写しはそのまま返る。**
問い合わせ（クエリ）が**キャッシュの鍵に入っていない**ため。
一意の値で三度叩いて、三度とも `X-Cache: HIT`、`Age` が **92 → 94 → 96** と増え続けた
（別の edge ノードに当たっても HIT）。**新しい写しを取りに行っているつもりで、行っていない。**

---

## ① いまの配り方（実測）

**頭（ヘッダ）**

| 置き場 | Cache-Control | 実際の頭 |
|---|---|---|
| GitHub Pages | `max-age=600`（10分） | `Via: 1.1 varnish`／`Last-Modified` は**配り直しの刻**（全ファイル同じ値） |
| raw.githubusercontent | `max-age=300`（5分） | 同じ Fastly。`ETag` は中身の指紋 |

**`?_t=` の有無で何が変わるか**

```
同じ道に、毎回ちがう ?_t= を付けて三度：
  1回目  Age: 92   X-Served-By: cache-nrt-…061-NRT   X-Cache: HIT
  2回目  Age: 94   X-Served-By: cache-nrt-…063-NRT   X-Cache: HIT
  3回目  Age: 96   X-Served-By: cache-nrt-…023-NRT   X-Cache: HIT
```

**変わらない。** 一度も使ったことのない問い合わせでも HIT になり、`Age` は同じ写しの齢を
数え続けている。raw も同じ（`?_t=` 付きで HIT）。
一方、**一度も取っていない別の道**は必ず新しい。

```
estimates.json  Age: 0  X-Cache: MISS
seen.json       Age: 0  X-Cache: MISS
board.json      Age: 0  X-Cache: MISS
```

つまり**キャッシュの鍵は「道（パス）」だけ**で、問い合わせは見ていない。

**押してから読める側に出るまで（実測・同じ一回の push を三つの道で追った）**

```
【一度目】push 17:07:12 → Pages 17:09:29（137秒）／ raw 17:11:30（258秒）
【二度目】push 17:46:14 → Pages 17:51:50（336秒）／ raw 17:51:10（295秒）
                          raw（SHA を道に入れた形＝毎回別名）17:51:04（**285秒**）
```

**二度測ってばらつく。** Pages は 137〜336秒、raw は 258〜295秒。
どちらも「数分」の幅で、**数時間にはならない**。

**137秒の正体は edge のキャッシュではなく、Pages の配り直し（deploy）。**
`Last-Modified` が 08:09:16 GMT（＝17:09:16 JST）へ動いており、**出た刻とぴったり合う**。
Pages は push のたびに site を組み直して配り直しており、その段が下限になっている。

**「数時間前が返る」については** — **今日の実測では再現していない。**
17:08:35 にチャット側の取り口で読んだ札は 16:02:51 だったが、**同じ刻に curl で読んでも
16:02:51** だった。16:02 から 17:07 まで**新しい札が一枚も立っていなかった**ためで、
公開側が古い写しを返していたわけではない。

ただし**重なりうる層が二つある**。

- **CDN** … 道ごとに最大 10分（Pages）／5分（raw）。**`?_t=` では避けられない**（上のとおり）
- **チャット側の取り口** … 仕様として **URL ごとに15分の控え**を持つ。
  こちらは**URL の字が変われば別物**になるので、**`?_t=` が効くのはこの層だけ**

二つを足しても 25分ほどで、**数時間にはならない**。数時間ずれる形が続くなら、
Pages の配り直しが失敗・滞留している回（`Last-Modified` が古いまま動かない）を疑うのが早い。
**`Last-Modified` が「いま公開されている版の刻」なので、そこを見れば一目で分かる。**

## ② 古い写しを返さない配り方（案・実測つき）

| 案 | 押してから読めるまで | 実測 | 見立て |
|---|---|---|---|
| **いまのまま（Pages）** | **137秒** | ○ | 配り直しが下限。`?_t=` は無意味 |
| raw.githubusercontent | **258秒** | ○ | Pages より遅い。乗り換える利は無い |
| **gist（API で書き替え・latest の道）** | **66秒 ／ 43秒**（二度測った） | ○ | **いちばん速い。** 配り直しの段が無いぶん縮む。頭は同じ `max-age=300` |
| Cache-Control を短くする | — | **測れない** | Pages も raw も**頭を指定する手が無い**。600／300 は動かせない |
| **ファイル名に刻を含めて毎回別名** | **285秒** | ○ | **効かなかった。** 同じ push の枝の道（295秒）と**10秒しか違わない** |
| Cloudflare 等の別の置き場 | — | **測っていない** | 置き場を作る作業になるため。実装はしない指示に従った |

**gist の測り方** … 秘密の gist を一つ作り、API（`PATCH /gists/:id`）で中身を書き替えて、
`gist.githubusercontent.com/…/raw/…` に出るまでを5秒ごとに叩いた。二度測って 66秒・43秒。
**測り終えたあと gist は消した**（中身は当たり障りのない作り値だけで、この仕事の字は入れていない）。

**別名の案は、測ってみたら効かなかった。**

commit の SHA を道に含めた形（`raw.githubusercontent.com/…/<SHA>/notices.json`）は、
**その push で初めて生まれる道**なので、CDN に古い写しがあり得ない。理屈のうえでは
いちばん速いはずだった。ところが同じ push で測ると **285秒**——枝の道の **295秒** と
**10秒しか違わない**。

つまり **raw の遅れは edge のキャッシュではなく、raw 自身が新しい commit を配り始めるまでの
間**だった。**別名にしても、その間は縮まない。**
＊「冷えた道は `Age:0`／`MISS`」は本当だが、**MISS のときに origin が返してくる中身が
　まだ古い**ので、キャッシュを避けても意味が無い。**ここは測るまで読み違えていた。**

## 添え — すぐ効く小さな手（実装はしていない）

- **`?_t=` は CDN に効かないと分かったので、「付けたから新しいはず」という前提を外す。**
  効くのはチャット側の15分の控えに対してだけ。
- **`Last-Modified` を一緒に読む。** いま公開されている版の刻がそのまま出るので、
  「古い写しなのか、そもそも新しい札が無いのか」を**その場で見分けられる**。
  今日の 16:02 の件は、これを見ていれば「新しい札が無いだけ」とすぐ分かった。

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **113件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`読み口の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E5%8F%A3%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-02 17:20 | 読み口の詰まり-1 — `?_t=` は CDN に効いていない。遅れの正体は Pages の配り直し |
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

<!-- 控えの一覧 ここまで -->

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. 🕒 延びています

```
読み口の詰まり-1（notices.json が古い写しを返す）
終了予定が未定のまま46分が経ちました
```

### 2. 🕒 延びています

```
パネルの色-1（終了予定の刻だけ明るい水色）
終了予定17:03を過ぎています（経過32分）
```

### 3. ✅ 終わりました（返事不要）

```
写せます（3件）
```

### 4. 🔎 調べました

```
終わりの黙り-3（15:47 の一回を調べる）
四つの刻と二つの網を知らせの本文へ直書きで送った（HTTP 200）。
実測: push-trace.tsv にもこの一件は無い（Trace-Push は wait/done/over/bad の枝にしか無いため）。
```

### 5. 🕒 延びています

```
写しの全文-1／仕事の数え方-1・2
終了予定15:15を過ぎています（経過77分）
```

<!-- 送った知らせ ここまで -->

