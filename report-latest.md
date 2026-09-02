# 終わりの黙り-4 — 写せます（ready）を、終わりと同じ道へ乗せた

**状態：終わり（実地は次の写せますで見届ける）／本体（`koushu-handan.html`）には触っていない**

**結論** — **関門に ready を通すのではなく、名乗りを done へ揃えた。**
決め手は「これまで送っていた道」で、記録を辿ると **ready 単独は一度も送られたことがない**。
届いた回は必ず done と一緒に積まれ、**束の名乗りが done になって done の道
（公開の確認 → 送信・題は 😽）を通っていた**。その道に揃えた。

---

## ① どちらが正しいか — 「これまでの道」を辿って決めた

**ready 単独の回（全部、同じ一行で断られている）**

```
2026-09-01 21:48:28  急ぎの知らせ 1本を…（名乗り ready） → 21:48:45 押し送りはしない（送る状態でない: ready）
2026-09-01 22:21:08  同上                                → 22:21:14 同上
2026-09-02 06:57:51  同上                                → 06:57:58 同上
2026-09-02 15:29:12  同上                                → 15:29:19 同上
2026-09-02 15:48:14  同上                                → 15:48:19 同上  ← 今回の件
2026-09-02 16:02:48  同上                                → 16:02:56 同上
```

**届いた回（done と一緒に積まれた）**

```
2026-09-01 20:56:49  急ぎの知らせに積んだ […]（名乗り ready）
2026-09-01 20:57:02  急ぎの知らせ 2本を、この回のうちに出す（名乗り done）   ← 束が done になる
2026-09-01 20:58:29  押し送りOK（HTTP 200）
```

**よって「写せます」が通ってきた道は done の道**。関門だけ開ける案は採らない——
`Push-WhenVisible` は wait/done/over 以外を**一行目で弾いて公開の確認を飛ばす**ので、
ready を関門で通すと**確認せずに送る別の道**になってしまう。

＊札の題はもともと `$T_DONE`（✅ 終わりました（返事不要））で、押し送りの題も 😽。
　**道を揃えても、出る字は今までと同じ。**

**直したのは一箇所** — `Flush-Quick` の名乗りの決め方に一行足した。

```
$script:pushOrigin = 束の元の名乗りを + で繋いだ字（ready / done / ready+done）
$state = 束のいちばん強い名乗り（今までどおり done を優先）
if ($state -eq 'ready') { $state = 'done' }      ← 足した一行
```

## ② 足跡（`push-trace.tsv`）に ready 由来を残す

`Trace-Push` は `Push-WhenVisible` の中にあり、ready は**そこへ届く前に弾かれていた**ので
足跡が一行も残らなかった（15:48 の件は `push-trace.tsv` に無い）。
道を揃えたことで自然に三行残るようになり、加えて**元の名乗りを添える**ようにした。

```
積んだ（done・元 ready） → 読めた → 送った
```

＊元の名乗りは `$script:pushOrigin` に持ち、**送り終えたら落とす**（次の回が引きずらないように）。
＊束の記録にも出る … 「急ぎの知らせ 1本を、この回のうちに出す（名乗り done・**元は ready**）」

## ③ 作り値（写しに probe。本体には仕掛けを入れていない）

`Flush-Quick` と `Push-WhenVisible` を字面のまま抜き出して回した。

```
(甲) ready だけを積む → 送った（名乗り done） ／ 足跡 積んだ（done・元 ready）    → 読めた → 送った
(乙) done だけを積む  → 送った（名乗り done） ／ 足跡 積んだ（done）              → 読めた → 送った
(丙) ready と done    → 送った（名乗り done） ／ 足跡 積んだ（done・元 ready+done）→ 読めた → 送った
```

**(乙) が今までどおりであること**も併せて見た。done の側は何も変わっていない。

**実地** — 見張りは毎分呼び直されるので、直しは既に効いている。
**次に「写せます（N件）」が立った回**で、`押し送りOK` と `push-trace.tsv` の三行を確かめる。

写し `.bak-20260902b`／構文OK **2674行**／BOM 有り／毎分呼び直しなので起こし直し不要。

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **111件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`手牌の境目-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-3.md) | 09-01 03:47 | 手牌の境目-3 — `--vz-show` の745は据え置きで確定（掘り返さないための裁定の控え） |

<!-- 控えの一覧 ここまで -->
