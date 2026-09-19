# 手元の速い版（Edge の五段を飛ばし）… check は通り、adv-check が上限に当たった

**止まり（上限で抜けた）** — 2026-09-19 21:04（VAIO）。**印: y0919-2103**。
甲のとおり Edge を立てる五段（⑦⑯⑰⑱㉓）を飛ばす形にして回した。**check.js は通った**が、
続く **adv-check（探偵編の回帰）も headless の Edge で駆動する検査**で、段の上限（30秒）に当たった。
y0919-1701 の続きには進んでいない。`koushu-handan.html`・`stable` は触っていない。

## 止まった段と経過秒

**adv-check 探偵編の回帰（即死罠・時間切れ）・段の経過 30.5秒**（段の上限 30秒）・全体の経過 35.4秒（全体の上限 327秒）。
21:02:50〜21:03:31、終了コード1。残った headless の Edge は0本。

- adv-check の中は **① 即死罠（16号室のナイフ）が3項目とも ✓**、② 時間切れの途中で切れた。
- 雲では adv-check 丸ごとで中央値6.1秒。`adv-check.js` L198〜 が check.js ⑦と同じ流儀で Edge を立てる。

## check.js の結果（通った）

**PASS 17段・SKIP 5段・FAIL 0。** ①〜⑥・⑧〜⑩・⑫〜⑮・⑲〜㉒が PASS、⑦・⑯・⑰・⑱・㉓が SKIP。

## 入れた形（甲）

- **`check-all.js` の頭** … 「この機械では Edge を立てない決め」の理由の一行と、
  `const FAST_SKIP_EDGE_STAGES = ['⑦', '⑯', '⑰', '⑱', '㉓'];`（空にすれば手元でも回す）。
  手元の速い版のときだけ `check.js` へ `--skip=⑦,⑯,⑰,⑱,㉓` を渡す。**雲（CI）では常に全部回す。**
- **`check.js`** … `--skip=` を読む定数一つ、`section()` の頭で並べた段を飛ばす5行、まとめで SKIP と出す一語。
  前の回の⑦だけの口（`--skip-view`）は外した。
- 別件の台帳に **「パネルの見張り×2147946720」** を一行足した（21:02:37・hold-stuck と並べて、この工事の後に調べる）。

## 次の手（返事を待つ）

- **甲** adv-check も「Edge を立てる検査」として手元の速い版では飛ばし、雲に任せる（`FAST_SKIP_EDGE_STAGES` に adv-check を並べる形）
- **乙** adv-check だけ段の床を広げて手元で回し切る（一分以上かかる見込み）
- **丙** 今回の直しは探偵編に触れていないので、adv-check の手元の結果は待たずに続きへ進む（雲のフル版で確かめる）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **292件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0918-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2155.md) | 09-18 22:02 | 押しの敷居-2 |

<!-- 控えの一覧 ここまで -->
