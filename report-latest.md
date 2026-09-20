# subj-gap の見比べと step-slow の上限を直した（push-defer は直さない）

**終わり（残り0件）** — 2026-09-20 11:0x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 1. subj-gap … **括弧から後ろを落としてから比べる**（`pipe-check.ps1`・写し `.bak-20260920`）

- 控えと画面の件名の**両方**から、**最初の「（」か「(」より後ろを落として**から突き合わせる。
- **下限8字は変えていない。** ただし、落とした後に**同じ字になった回**は、長さを問わず同じ仕事とみなす一行を足した
  （今朝の「連携の総点検」は落とすと**6字**で、下限8字の門では拾えないため）。
- 触ったのは比べ方だけ。控え・画面・件名の作り・訴えの字は変えていない。構文検査 OK。

**作り値（本物の見比べの塊をそのまま写して回した・六通り）**

| 場合 | 控え／画面 | 結果 |
|---|---|---|
| **イ 今朝の型** | 「連携の総点検（予定表・起こし直し・札の道・命令の見張り）」／「連携の総点検」 | **見送った** |
| ロ 別件 | 「連携の総点検（予定表・起こし直し）」／「命令の見張り」 | **訴えた** |
| ハ 頭が似た別件 | 「調べ-1（三つの穴）」／「調べ-2」 | **訴えた** |
| ニ 8字以上の頭一致（今までの形） | 「設定画面に「言葉の一覧」の釦（v1452）の宣言」／「設定画面に「言葉の一覧」の釦」 | 見送った |
| ホ 半角の括弧 | 「v1453 の検収 (stable)」／「v1453 の検収」 | 見送った |
| ヘ 画面の件名が空 | 「連携の総点検」／（空） | 訴えない（今までどおり） |

## 2. step-slow … **押し直しの段だけ90秒**（`watch-notify.ps1`・写し `.bak-20260920`）

- 段ごとの上限の表 `$STEP_MAX_BY = @{ '押し直し' = 90 }` を頭に置き、`Step()` はその段の上限で測るようにした。
  **ほかの段は60秒のまま。** 足跡と訴えの字にも、その段の上限がそのまま出る。
- 90秒にしたのは、この段が起こす子（`push-retry.ps1`）の上限が90秒だから。**子より短い上限で段を測っていたのが食い違いだった。**
- 構文検査 OK。

**作り値（本物の `Step` と上限の決めを写して回した・四通り）**

| 段 | 経過 | 結果 |
|---|---|---|
| **押し直し** | 65秒 | **訴えない**（今朝の 64.3秒がこれ） |
| **押し直し** | 95秒 | **訴える（上限90秒）** |
| 鍵の見回り | 65秒 | 訴える（上限60秒） |
| 完了 | 30秒 | 訴えない |

## 3. push-defer … **直していない**（決めどおりの見送りで、鳴ってもいない）

## 触った所と触らない所

**触った所** … `~/.claude/pipe-check.ps1`（比べ方）／`~/.claude/watch-notify.ps1`（段の上限の表と `Step`）。どちらも写しと構文検査つき。
**触らない所** … `push-retry.ps1`・`Run-Child` の上限・`heavy-on` の見分け・訴えの字・`koushu-handan.html`・`stable`。

## 作法36 の突き合わせ（見張りの決めを変えたので）

見張りの段の並びは変えていない（開始 → 生存の合図 → 命令の見張り → 譲りの判じ → 帯 → 鍵 → **押し直し** → … → 完了）。
変えたのは「押し直し」の段を測る上限（60→90秒）と、`pipe-check` の件名の比べ方だけ。**雲で回る見張りは無い。**
検査の段（手元の速い版17段／雲の速い版とフル版は全部）は、この枠では変えていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **305件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-1701.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1701.md) | 09-19 17:01 | 【宣言】設定画面に「言葉の一覧」の釦を足す（v1452） |

<!-- 控えの一覧 ここまで -->
