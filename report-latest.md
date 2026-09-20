# 【宣言】説明欄に三つ手を入れる（v1454）

**ヨシ待ち** — 2026-09-20 11:0x（VAIO）。**印: y0920-1058**。
本体（`koushu-handan.html`）の工事なので、**ヨシを取るまで一行も触らない**。

## 触る行と足す字（三箇所・版の三箇所）

### ① L1495 の末尾へ一文を足す（「割れは材料の違い」の後ろ）

```
…割れは材料の違いであって、手の際どさの合図ではない。八人の票は、当てるための物ではなく、どこを見ればいいかを示す物です。当てるのは本判定です。<br><br>
```
＊足すのは**指示の字そのまま**。前の文は一字も変えない。

### ② L1490 の末尾へ一文を足す（兎の説明の「二つ以上なら守り」の後ろ）

```
・<b>兎</b>＝残り枠。塊にならない弱い余りを数え、一つも無ければ攻め、二つ以上なら守り。また、これから面子を作る所の3つ以上が両面などで作れる見込みでも、手の中の良い形が3つ以下なら守り。<br>
```

**`usagiLean` の条件の順との突き合わせ**（`koushu-handan.html` L4156〜L4163）

| 順 | 式 | いまの説明欄 | 足す字 |
|---|---|---|---|
| 1 | `fillWeak === 0` → 攻め | 「一つも無ければ攻め」 | — |
| 2 | `fillWeak >= 2` → 守り | 「二つ以上なら守り」 | — |
| 3 | `fillGood >= 3 && goodShapes <= 3` → 守り | **無し** | 「また、これから面子を作る所の3つ以上が両面などで作れる見込みでも、手の中の良い形が3つ以下なら守り。」 |

**順は食い違っていない**（式も①②③の順で見る）。字も合っている。
＊一つだけ添えておくと、③が効くのは**弱い余りがちょうど一つのとき**だけ（0は①、2以上は②で先に決まるため）。
　指示の字のままでも**間違いではない**——①②を読んだ後に続けて読む形なので、残るのは「一つのとき」だけになる。
　もし明記したいなら「（弱い余りが一つのとき）」を足す形になるが、**言葉はこちらで選ばないので、指示の字のまま入れる。**

### ③ L1445 の兎の釦②の言い回しを v1453 の字へ揃える

```
前  …無ければ「弱い余りN——この帯は判定に回す」と出る。
後  …無ければ「この手は13枚がそろっていないか猫牌が混じっているので、切る一枚を選べない。…攻めか守りかは本判定に任せる」と出る。
```
＊釦②の本文は長いので、**頭と締めを引いて間を「…」で繋ぐ**（説明欄はいまも釦①を「切るなら〈牌〉」と縮めて引いている）。
　全文をそのまま載せる形にもできる。**どちらが良いかは言葉の選びなので、いまは縮めた形で出す**——違うと思われたら言ってください。
＊この行のほかの字（釦①の引き方・「どの釦を押しても、判定そのものは一切変わらない」）は変えない。

### 版

| 行 | いま | どう直すか |
|---|---|---|
| **L2** | `data-ver="1453"` | `"1454"` |
| **L1424** | `verTag v1453` | `v1454` |
| `ver.txt` | 1453 | 1454 |

**触る行は5行（L2・L1424・L1445・L1490・L1495）＋`ver.txt`。行数の増減は0行**（どれも行の中へ字を足すだけ）。

## 触らない所

**判定・条件・`analyze()` に一字も触らない。** `usagiLean` の式（`fillWeak`・`fillGood`・`goodShapes` の境目）も**読むだけ**で触らない。
見立て行・釦・投票欄の**台詞そのもの**（v1453 で入れた15文）も触らない。`check.js`・`first-sense-base.json`・`stable`・`mitate-new-2.txt` も触らない。

## 確かめ方（工事の後）

1. `git diff -U0` の塊が **L2・L1424・L1445・L1490・L1495 の5箇所だけ**であることを示す。
2. 足した三つの字が、**指示の字と一字一句同じ**であることを突き合わせる（③は引き方だけ縮める）。
3. `usagiLean` の三つの条件式が**字面のまま**であることを示す。
4. `node serifu-extract.js` を回す（説明欄の字は台詞として載らないが、行番号がずれるため）。
5. 手元の速い版（Edge の段は飛ばす）と、雲のフル版（⑦⑯⑰⑱㉓と adv-check を含む）で通す。

## 段取りと見込み

三箇所へ字を足す → 版を三箇所 → `node serifu-extract.js` → **手元の速い版が通ってから一度で commit** → push（雲がフル版を回す）。
**見込み 30分。**

**「y0920-1058 にヨシ」で着手します。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **306件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-1701-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1701-2.md) | 09-19 17:46 | 【宣言・全文】設定画面に「言葉の一覧」の釦を足す（v1452） |

<!-- 控えの一覧 ここまで -->
