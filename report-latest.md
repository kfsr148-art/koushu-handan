# 【宣言】ずんだもん・枝豆・兎の文面を mitate-new-2.txt へ差し替える（v1453）

**ヨシ待ち** — 2026-09-20 09:1x（VAIO）。**印: y0920-0912**。
本体（`koushu-handan.html`）の工事なので、**ヨシを取るまで一行も触らない**。いまは読んだだけ。

## 何をするか

`mitate-new-2.txt`（origin/main・64行）の文面どおりに、**15の文**を差し替える。
並びと分岐名は `reports/y0920-0829.md` の表と同じ。**〈…〉の差し込みは今の本体のものをそのまま使う。**

## 触る行（ファイル名と行番号）と足す行数

### `koushu-handan.html`（v1452 の行番号）

| # | 分岐 | 行 | いまの差し込み（そのまま使う） |
|---|---|---|---|
| 1 | ずんだ① かぶり無し・`weakShapes > 0` | **L4695** | `a.weakShapes`（〈N〉） |
| 2 | ずんだ② かぶり無し・`weakShapes === 0` | **L4696** | 差し込み無し |
| 3 | ずんだ③ 二度受け | **L4699** | `F.dup.name`（〈牌〉。新しい文では**三箇所**） |
| 4 | ずんだ④ 筋被り | **L4700** | `F.dup.a`／`F.dup.b`（〈A〉〈B〉） |
| 5 | 枝豆・釦 攻め一致 | **L8735** | `pairTripletN`（〈N〉） |
| 6 | 枝豆・釦 守り一致 | **L8746** | `pairTripletN` |
| 7 | 枝豆・釦 食い違い（攻め側） | **L8737** | `pairTripletN` |
| 8 | 枝豆・釦 食い違い（守り側） | **L8748** | `pairTripletN` |
| 9・10 | 枝豆・投票欄 攻め／守り | **L4204〜L4205** | `pairKinds`（〈N〉）。いまは「前の字＋分岐の尾」の形だが、新しい文は二つで**全文が違う**ので、二つの全文を返す形へ組み替える（式の形だけ・条件は不動） |
| 11 | 兎・釦① 切る候補あり | **L4871** | `tileChip(c.code)`（〈牌〉＝牌の絵） |
| 12 | 兎・釦② 切る候補なし | **L4873** | `n.usagi`（〈N〉） |
| 13 | 兎・投票欄 攻め | **L4224** | 差し込み無し |
| 14・15 | 兎・投票欄 守り（イ）／（ロ） | **L4225** | 差し込み無し（一行に二つ入っている） |
| 版 | `data-ver` | **L2** | 1452 → **1453** |
| 版 | `verTag` | **L1424** | v1452 → **v1453** |

**触る行は14行（うち L4204〜L4205 と L4225 は一行に複数の文）＋版の2行。行数の増減は0行**（どれも一行の中の字の差し替え。長くなるだけ）。

### そのほか

- **`ver.txt`** … 1452 → **1453**（版の三箇所目）
- **`serifu.txt`** … `node serifu-extract.js` で**再抽出**（作法17。この15文は台詞として載っている）
- **`check.js`・`check-all.js`・`first-sense-base.json`・`mitate-new-2.txt`・`mitate-new.txt` … 触らない**
  ＊㉓（第一感）の控えに入っている `angle` は**16件とも執事の行**で、ずんだの行は一つも無い。今回は取り直しが要らない見込み。
  　もし雲の㉓が落ちたら、作法18のとおり**戻さず**、雲の記録から新しい字を拾って `angle` だけ取り直す。

## 触らない所

**条件・判定・光る牌・`analyze()` に一字も触らない。**
`analyze()`／`bestShapeOneSuit`／`toneFacts`／`usagiLean`／`edaVoteLean`／`edaSwitchLean`／`tenLeans` の**条件式**／
光る牌の印（`multi`〜`om-mark`）／`mitate-new-2.txt`・`mitate-new.txt`・`stable`・`adv-check.js`。
**この15文以外の文**（ほかの人柄の見立て行・現場猫・AI・虎・説明欄・誤診記録・探偵編）も触らない。

## 変わっていないことの示し方（工事の後）

1. `git diff -U0` の塊が **L2・L1424・上の14行だけ**であることを、塊の一覧で示す。
2. **差し込みの字面**（`a.weakShapes`・`F.dup.name`・`F.dup.a/b`・`pairTripletN`・`pairKinds`・`tileChip(c.code)`・`n.usagi`）が
   工事の後も同じ数だけ残っていることを数えて示す。
3. 条件の字面（`if(!F.dup)`・`F.dup.kind === 'double'`・`a.fillWeak === 0`・`a.fillWeak >= 2`・`a.fillGood >= 3 && a.goodShapes <= 3`・
   `edaVoteLean(pairKinds) === 'attack'`・`edaLean === 'attack'`・`a.verdict === 'attack'`）が**一つも変わっていない**ことを示す。
4. 手元の速い版（Edge の段は飛ばす）と、雲のフル版（⑦⑯⑰⑱㉓と adv-check を含む）で通す。

## 段取りと見込み

15文を差し替え → 版を三箇所 → `node serifu-extract.js` → **手元の速い版が通ってから一度で commit** → push（雲がフル版を回す）。
**見込み 50分。**

**「y0920-0912 にヨシ」で着手します。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **302件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-0912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912.md) | 09-20 09:10 | 【宣言】ずんだもん・枝豆・兎の文面を mitate-new-2.txt へ差し替える（v1453） |
| [`y0920-0829.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0829.md) | 09-20 08:32 | 09-19 の調べ四件・台帳の「見張り×2147946720」・ずんだもんと兎の文面 |
| [`y0919-2320.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2320.md) | 09-19 23:17 | stale の回に iPhone が鳴らない穴を塞いだ（🪟 に名乗り bad） |
| [`y0919-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2255.md) | 09-19 23:09 | 連携の総点検（壊さず、作り値と実読みだけで） |
| [`y0919-2210-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2210-2.md) | 09-19 22:55 | panel v138 の納品（雲の検査 両方PASS） |
| [`y0919-2210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2210.md) | 09-19 22:28 | 現況の行が「本体v1451／stable v1451」のまま … パネルが版を開いた一度しか取っていなかった |
| [`y0919-2205.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2205.md) | 09-19 22:06 | hold-stuck の直し（空の札を溜め場へ入れない） |
| [`y0919-2149.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2149.md) | 09-19 21:57 | 命令の見張りと、作法36（回る段の突き合わせ） |
| [`y0919-2147.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2147.md) | 09-19 21:52 | 今日の止まりの三つの確かめと、別件二つ（hold-stuck・見張り×2147946720） |
| [`y0919-2103-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2103-2.md) | 09-19 21:22 | v1452 設定画面に「言葉の一覧」（y0919-1701 の納品） |
| [`y0919-2103.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2103.md) | 09-19 21:04 | 手元の速い版（Edge の五段を飛ばし）… check は通り、adv-check が上限に当たった |
| [`y0919-2057.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2057.md) | 09-19 20:57 | 手元の速い版（⑦飛ばし）… ⑯で上限に当たって抜けた |
| [`y0919-2025.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2025.md) | 09-19 20:33 | 手元の速い版（上限つき）… ⑦で上限に当たって抜けた |
| [`y0919-1946.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1946.md) | 09-19 20:23 | 今日の止まりの直し（起こし直し・速い版の上限・鍵の言葉） |
| [`y0919-1701-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1701-3.md) | 09-19 18:24 | 【宣言・全文（再掲）】設定画面に「言葉の一覧」の釦を足す（v1452） |
| [`y0919-1701-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1701-2.md) | 09-19 17:46 | 【宣言・全文】設定画面に「言葉の一覧」の釦を足す（v1452） |
| [`y0919-1701.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1701.md) | 09-19 17:01 | 【宣言】設定画面に「言葉の一覧」の釦を足す（v1452） |
| [`y0919-1627.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1627.md) | 09-19 16:36 | 用語の突き合わせ（説明欄「たまに出る言葉」と設定画面） |
| [`y0919-1343-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1343-2.md) | 09-19 13:59 | 起こし直しのときの台帳の閉じ（①〜④） |
| [`y0919-1343.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1343.md) | 09-19 13:46 | 台帳の「黒猫の待機-2」を読む |

<!-- 控えの一覧 ここまで -->
