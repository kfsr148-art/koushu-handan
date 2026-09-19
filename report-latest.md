# 手元の速い版（上限つき）… ⑦で上限に当たって抜けた

**止まり（上限で抜けた）** — 2026-09-19 20:31（VAIO）。**印: y0919-2025**。
指示どおり **y0919-1701 の続き（字面の突き合わせ・版三箇所・commit・雲のフル版）には進んでいない。**
`koushu-handan.html`・`check.js` の書きかけ（+48 −6・+2 −1）はそのまま。`stable` も触っていない。

## 止まった段と経過秒

**⑦ 狭い画面での溢れ・段の経過 190.8秒**（段の上限 190秒）・全体の経過 195.3秒（全体の上限 327秒）。
終了コード1。adv-check は回していない。

```
✗ 上限で切った：止まった段 ⑦ 狭い画面での溢れ・段の経過 190.8秒・全体の経過 195.3秒（段の上限 190秒）
  FAIL  check      本体の納品前チェック（上限で切った：⑦ 狭い画面での溢れ・190.8秒）
  FAIL  adv-check  探偵編の回帰（即死罠・時間切れ）（上限で切ったので回していない）
所要 196.9秒（上限 327秒）
```

## ⑦の中身（どこまで測れたか）

- 起こした刻 20:28:22 → 抜けた刻 20:31:41。起こす前の空き 930MB、残った headless の Edge は0本（孫ごと落ちた）。
- ⑦で済んだのは **額縁の較正と、568x320 の title・board の二画面だけ**。どちらも**溢れなし**。
  三画面目（judged）の途中で切れた。速い版の⑦は全部で21組（10画面×2視野＋judged 844x390）。
- **①〜⑥に FAIL は無い**（✗ は上限の一行だけ）。
- 雲の⑦は同じ21組を中央値63秒で回す。手元はその**三倍でも二画面**しか進まない——
  一組あたり約1分半（雲は約3秒）。今日の19:03 の回（⑦だけで約48分）と同じ重さ。

## 次の手（返事を待つ）

手元の速い版は、この機械では⑦を上限内に回し切れない。続けるには次のどれか。

- **甲** 雲に任せて commit する（雲の速い版・フル版が落ちれば配信は止まる。作法18 の「速い版が通るまで commit しない」は外れる）
- **乙** 手元では⑦だけ飛ばした形で①〜⑥・⑧〜㉓と adv-check を回し、⑦は雲に任せる（`check-all` に飛ばす口を足す工事が要る）
- **丙** 空きを作ってから（Edge・常駐を落とす、再起動の後など）手元でもう一度回す

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **290件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0918-2109.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2109.md) | 09-18 21:12 | 空きの片付け-2 |

<!-- 控えの一覧 ここまで -->
