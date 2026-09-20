# v1454 説明欄の三つの直し（納品）

**終わり（残り0件）** — 2026-09-20 11:2x（VAIO）。`stable` は触っていない（検収の後で進める）。

## 入れた三つ（宣言どおり）

| # | 行 | 足した／替えた字 |
|---|---|---|
| ① | **L1495** の末尾 | 「**八人の票は、当てるための物ではなく、どこを見ればいいかを示す物です。当てるのは本判定です。**」（指示の字のまま） |
| ② | **L1490** の末尾 | 「**また、これから面子を作る所の3つ以上が両面などで作れる見込みでも、手の中の良い形が3つ以下なら守り。**」（指示の字のまま） |
| ③ | **L1445** | 兎の釦②の引き方を v1453 の字へ … 前「弱い余りN——この帯は判定に回す」→ 後「**この手は13枚がそろっていないか猫牌が混じっているので、切る一枚を選べない。…攻めか守りかは本判定に任せる**」 |
| 版 | L2・L1424・`ver.txt` | **v1454** |

## 確かめ

1. **`git diff -U0` の塊は5箇所だけ** … L2／L1424／L1445／L1490／L1495。ほかの行は一つも出ていない。**行数の増減は0行。**
2. **足した字は指示と一字一句同じ**（三つとも本体に一箇所ずつ在ることを数えて確かめた）。
3. **`usagiLean` の三つの条件式は字面のまま** … `if(a.fillWeak === 0) return` ／ `if(a.fillWeak >= 2) return` ／
   `if(a.fillGood >= 3 && a.goodShapes <= 3) return`。判定・`analyze()`・v1453 の15文にも触っていない。
4. `node serifu-extract.js` を回した（7599行・口調の混入0件）。
5. **手元の速い版** … 終了コード0・**所要5.3秒**（Edge の段は飛ばす形）。
6. **commit は一度**（258f8330）。
7. **雲（走り 35483283453）… completed / success。** 速い版・**フル版（⑦も㉓も PASS・両方PASS）**・返事パネルの検査・配信すべて success。
   公開側の `ver.txt` は **1454**。

## 実機で見る所

「📖 説明欄 → 🐾 このツール、何がすごいの？」を開いて、

- **四**（八人の材料）の末尾 … 「割れは材料の違いであって……」の後ろに**「八人の票は、当てるための物ではなく、どこを見ればいいかを示す物です。当てるのは本判定です。」**が続く。
- **四**の兎の行 … 「一つも無ければ攻め、二つ以上なら守り。」の後ろに**「また、これから面子を作る所の3つ以上が……守り。」**が続く。
- **二**（使い方）の兎の釦の説明 … 「無ければ『**この手は13枚がそろっていないか猫牌が混じっているので、切る一枚を選べない。…攻めか守りかは本判定に任せる**』と出る」になっている。
- 版の字が **v1454**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **307件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1058-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058-2.md) | 09-20 11:28 | v1454 説明欄の三つの直し（納品） |
| [`y0920-1058.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058.md) | 09-20 10:53 | 【宣言】説明欄に三つ手を入れる（v1454） |
| [`y0920-1055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1055.md) | 09-20 10:52 | subj-gap の見比べと step-slow の上限を直した（push-defer は直さない） |
| [`y0920-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1040.md) | 09-20 10:40 | 訴え三件の元（push-defer・subj-gap・step-slow）と、説明欄の二つの確かめ |
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

<!-- 控えの一覧 ここまで -->
