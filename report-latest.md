# v1453 ずんだもん・枝豆・兎の文面の差し替え（納品）

**終わり（残り0件）** — 2026-09-20 09:3x（VAIO）。`stable` は触っていない（検収の後で進める）。

## 差し替えた15文（宣言どおり・条件は不動）

| # | 分岐 | 行（v1453） |
|---|---|---|
| 1〜4 | ずんだの見立て行（かぶり無し×2・二度受け・筋被り） | L4696・L4697・L4700・L4701 |
| 5〜8 | 枝豆の釦（攻め一致・守り一致・食い違い二つ） | L8736・L8747・L8738・L8749 |
| 9・10 | 枝豆の投票欄（攻め・守り） | L4204〜L4206 |
| 11・12 | 兎の釦（切る候補あり・なし） | L4872・L4874 |
| 13〜15 | 兎の投票欄（攻め・守りイ・守りロ） | L4225・L4226 |
| 版 | `data-ver` / `verTag` / `ver.txt` | L2・L1424・`ver.txt` |

＊**釦③と「票を出さない回」は今のまま**（`mitate-new-2.txt` の指示どおり触っていない）。

## 変わっていないことの確かめ

1. **`git diff -U0` の塊は宣言どおりの12箇所だけ** … L2／L1424／L4204-4206／L4225-4226／L4696-4697／L4700-4701／L4872／L4874／L8736／L8738／L8747／L8749。
   ほかの行は一つも出ていない。
   ＊**行数は +1行**（枝豆の投票欄が、共通の前置き＋尾の2行から、全文を二つ返す3行になったため）。宣言では「増減0行」と書いたので、ここだけ食い違っている。
2. **差し込みは本体の今のものをそのまま**（数えて確かめた）… `a.weakShapes`・`F.dup.name`×3・`F.dup.a`・`F.dup.b`・`pairTripletN`×4・`pairKinds`×2・`tileChip(c.code)`・`n.usagi`。
3. **条件の字面は一つも変えていない** … `if(!F.dup)`／`F.dup.kind === 'double'`／`a.fillWeak === 0`／`a.fillWeak >= 2`／
   `a.fillGood >= 3 && a.goodShapes <= 3`／`edaVoteLean(pairKinds) === 'attack'`／`edaLean === 'attack'`／`a.verdict === 'attack'`／`a.verdict === 'defend'` を字面で確かめた。
4. **台詞の抽出** … `node serifu-extract.js` を回した（合計7599行・口調の混入0件）。
5. **手元の速い版** … 終了コード0・**所要8秒**（PASS 17段・SKIP 5段＋adv-check。Edge の段は飛ばす形）。
6. **commit は一度**（31effcc1）。本体・`ver.txt`・`serifu.txt`・`serifu-adv.txt` だけ。
7. **雲（走り 35479038347）… completed / success。** 速い版・フル版・ウィジェット・返事パネル・配信すべて success。
   フル版は **両方PASS**（check・adv-check）。**㉓「第一感が移す前と変わらないか」も PASS**——宣言どおり、控えの angle は執事の行だけなので取り直しは要らなかった。
   公開側の `ver.txt` は **1453**。

## 実機で見る所

判定のあと、**人柄を「ずんだもん」にした見立て行**と、**枝豆の釦・兎の釦**、**投票欄の枝豆と兎の一言**が新しい字になっている。
- ずんだ（かぶり無し・弱い形あり）…「同じ牌を二つの形で取り合う待ちは無いのだ。でも、1と3を持って間の2だけを待つ嵌張（カンチャン）や……」
- 枝豆の釦（攻め一致）…「同じ牌を二枚以上持っている種類が〈N〉つ。四つ以上あると、対子（トイツ＝同じ牌が二枚）や……」
- 兎の釦（切る候補あり）…「最初に切るなら〈牌の絵〉だ。切っても聴牌（テンパイ）までの遠さ＝向聴数（シャンテンすう）が変わらない牌の中から……」
- 兎の投票欄（攻め）…「これから面子（メンツ）を作る所に、一種類の牌しか待てない嵌張（カンチャン）・辺張（ペンチャン）頼みの所が一つも無い。……」
- 版の字が **v1453**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **303件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-0912-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912-2.md) | 09-20 09:49 | v1453 ずんだもん・枝豆・兎の文面の差し替え（納品） |
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

<!-- 控えの一覧 ここまで -->
