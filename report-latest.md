# v1452 設定画面に「言葉の一覧」（y0919-1701 の納品）

**終わり（残り2件・どちらも別件）** — 2026-09-19 21:2x（VAIO）。`stable` は触っていない（検収の後で進める）。

## 手元の速い版（adv-check も外した後）

adv-check を Edge の五段と同じ定数に並べた：
`const FAST_SKIP_EDGE_STAGES = ['⑦', '⑯', '⑰', '⑱', '㉓', 'adv-check'];`（`check-all.js` の頭。雲（CI）では全部回す）

**手元の速い版に残る段（17段）** … ① 版番号3箇所の一致／② 起動時404の数／③ node --check／④ 音声ファイルの突き合わせ／
⑤ 死にコード／⑥ 未使用の埋め込み画像・音声／⑧ 組み立てて出していない入れ物／⑨「ヨシ」の混入／
⑩ ミニゲームの定数と八方位・親補正の写し／⑫ プレースホルダの未置換／⑬ 非日本語文字の混入／⑭ 良形の順位付けの写し／
⑮ 猫牌の判定条件の写し／⑲ 素材の寸法の写し／⑳ 枝豆の目盛りの一本化／㉑ 猫牌の裁定数の一本化／
㉒ 向聴の写しが無く、持ち上げた shanten が元のままか

**飛ばす（SKIP と出す）** … ⑦・⑯・⑰・⑱・㉓ と adv-check。

**一本の所要 4.6秒**（21:10:06〜21:10:11・終了コード0・PASS 17・SKIP 5段＋adv-check）。

## y0919-1701 の続き

1. **字面の突き合わせ** … span を剥いだ説明欄 L1544〜L1555 の sha256 が**前（HEAD）も後も `bf5c1196…`**、`diff` 0行。
2. **本体の差分**（`git diff -U0` の塊）… L2（版）・L1424（版）・L1544（span の頭）・L1555（span の尾）・
   L8537 に釦 +5行・L8564 と L8569 の並び2行・L8592 に重ねの関数 +37行。**これ以外の行は一つも無い。**
3. **版三箇所** … `data-ver="1452"`・`verTag v1452`・`ver.txt 1452`。serifu は本体と一致（`--check`）。
4. **commit は一度**（e219d938）… 本体・`check.js`（⑦に glossary を足す2行＋`--skip=` の口）・`check-all.js`・ver.txt・serifu 二本。
5. **雲（走り 35442143650）… 速い版・フル版・配信とも success。**
   フル版は **①〜㉓ すべて PASS**（⑦・⑯・⑰・⑱・㉓ を含む）、**adv-check も ①即死罠・②時間切れとも PASS**、両方PASS。
   ⑦は **210/210 組**（10画面×21視野）で、新しい **glossary は21視野すべて溢れなし**。
   二択の bottom の最小は 287.3px（900x300）で前の版と同じ。
6. **公開** … `ver.txt` が **1452** を返す。

**判定・条件・光る牌・`analyze()` には一字も触っていない**（本体の差分は上の塊だけ）。

## 実機で見る所

- タイトル → **⚙️ 設定**：釦が **誤診記録 の次・▶️ ずんだもんと現場猫 の前**に「**言葉の一覧**」と出る（金茶の枠）。
- 押すと暗い一枚が開き、頭に「◆ 言葉の一覧」と「閉じる ✕」、下に **聴牌〜打点の10語と「答え合わせで…」の一文**が出る。
- 「閉じる ✕」で**設定画面へ戻る**。
- 📖 説明欄 → 🐾 このツール、何がすごいの？ → 六の末尾「たまに出る言葉」は**前と一字も同じ見え方**。

## 残り（別件・この工事の後に調べる）

1. hold-stuck の訴え（溜め場が読めないまま居座り・notify-hold.tsv）… 台帳 20:55:33
2. パネルの「見張り×2147946720」… 台帳 21:02:37

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **293件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-1255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1255.md) | 09-19 12:54 | stable を v1451 へ進めた |
| [`y0919-0815-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815-2.md) | 09-19 08:54 | 【納品】見立て行と釦の助言の文面を差し替えた（v1451） |
| [`y0919-0815.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815.md) | 09-19 08:19 | 【宣言】見立て行と釦の助言の文面を差し替える（v1451） |
| [`y0919-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0800.md) | 09-19 08:00 | 条件の数の棚卸し（mitate-kazoe.txt） |
| [`y0919-0725.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0725.md) | 09-19 07:43 | 見立て行の尺の縛りを外す |
| [`y0919-0450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0450.md) | 09-19 07:04 | 見立て行の棚卸し（mitate.txt） |
| [`y0919-0427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0427.md) | 09-19 04:32 | 再起動-2 |
| [`y0918-2212-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212-2.md) | 09-19 04:20 | 再起動-1（後の測り） |
| [`y0918-2212.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212.md) | 09-18 22:12 | 再起動-1（前の測り） |

<!-- 控えの一覧 ここまで -->
