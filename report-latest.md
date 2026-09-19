# 手元の速い版（⑦飛ばし）… ⑯で上限に当たって抜けた

**止まり（上限で抜けた）** — 2026-09-19 20:57（VAIO）。**印: y0919-2057**。
乙のとおり⑦を飛ばす形にして回したが、**⑦の次に Edge を立てる⑯で段の上限（30秒）に当たった。**
y0919-1701 の続き（突き合わせ・版三箇所・commit・雲のフル版）には進んでいない。`koushu-handan.html`・`stable` は触っていない。

## 止まった段と経過秒

**⑯ 攻撃のあとの待機の向き・段の経過 30.6秒**（段の上限 30秒）・全体の経過 35.4秒（全体の上限 327秒）。
20:55:55〜20:56:34、終了コード1。adv-check は回していない。残った headless の Edge は0本。

- **①〜⑥・⑧〜⑮ は通った**（✗ は0件）。⑦は「飛ばした」と出て、まとめでは SKIP 扱い。
- ⑯は ⑦と同じく **headless の Edge を立てる段**（`check.js` L1304 付近）。雲では5.3秒の段で、手元では30秒で
  足元の高さを測ったところまでしか進まなかった。

## 入れた形（乙）

- **`check-all.js` の頭** … 理由の一行と `const FAST_SKIP_VIEW = true;`（false で手元でも⑦を回す）。
  手元の速い版のときだけ `check.js` へ `--skip-view` を渡す。**雲（CI）では常に⑦を回す。**
- **`check.js`** … `--skip-view` を受ける定数一つと、⑦の頭で飛ばす5行。飛ばした⑦は SKIP と出す（PASS と紛れない）。
  ＊check.js には y0919-1701 の書きかけ（⑦の画面を10へ）も入っている。今回の足し分はその外。

## 次の手（返事を待つ）

Edge を立てる段は ⑦ のほかに **⑯・⑰・⑱・㉓** がある（どれも同じ探し方でブラウザを起こす）。
手元でこの四つが通る見込みは、⑦と同じ理由で薄い。

- **甲** 定数を「Edge を立てる段を全部飛ばす」形に広げる（⑦・⑯・⑰・⑱・㉓ を手元で SKIP、雲のフル版に任せる）
- **乙** ⑦に加えて ⑯・⑰・⑱ だけ飛ばし、㉓（第一感が移す前と変わらないか）は手元でも回してみる
- **丙** 段の床（30秒）を Edge の段だけ広げて手元で回し切る（一段あたり数分かかる見込み）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **291件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0918-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2155.md) | 09-18 22:02 | 押しの敷居-2 |
| [`y0918-2145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2145.md) | 09-18 21:47 | 空きの片付け-2（後の測り） |

<!-- 控えの一覧 ここまで -->
