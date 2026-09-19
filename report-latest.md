# 今日の止まりの三つの確かめと、別件二つ（hold-stuck・見張り×2147946720）

**終わり（この枠の残り0件）** — 2026-09-19 21:5x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 1. 「今日の止まりを全部直せ」（19:46:14 の枠）の三つ

台帳 19:46:14 の行は「済」、`orders-full.jsonl` の同じ刻の全文と突き合わせた。

| | 状態 | 中身 |
|---|---|---|
| ① 起こし直しが19:35頃に窓を立てなかった訳 | **済**（19:46 の枠） | 起こしは走ったが、窓を立てる前に予定表の上限（2分）で殺された（19:43:25・19:45:30、事象329）。`revive-claude.ps1` を直し、作り値四通り合格（札 y0919-1946） |
| ② 受信箱の「鍵:ESC」 | **済**（19:46 の枠） | `inbox-watch.ps1`＋新しい `send-esc.ps1`。作り値合格・常駐を起こし直した（札 y0919-1946） |
| ③ Code タブが 19:05〜19:15 に「スリープかオフライン」と出た訳 | **前の枠では「起きていた」までしか書いていなかった → いま実施** | 下 |

**③の訳 … 機械は起きていて線も繋がっていたが、空きが350〜400MB まで落ちて claude が息をしていなかった（推定）。**

- **起きていた** … `hook.log` の生存 19:08・19:10・19:12・19:16、`watch-step-log.txt` の巡回 19:06・19:09・19:11・19:14・19:15。
- **線は繋がっていた** … `hc-ping.log` の外への打ち込みが 19:05〜19:12 まで毎分 `code=0 OK`（claude=1）。19:12:40 の次は 19:15:30 で、ここだけ3分空いた。
- **空きが底** … `watch-status.log` 19:02:57「空き 395MB」、`hook.log` 19:15:28「空き 357MB で押しを見送る」、巡回は「重い帯のため見送り」が 19:04 から毎回（詰まり 127〜226秒・`jam-snap.log`）。
- **元** … 19:03:55 に私が手元で起こした速い版（headless の Edge を次々に立てる）。その間 claude はこの命令を前面で待っていて、会話の記録も19:04〜19:47 は一行も増えていない。
- **推定の部分** … Remote Control の繋がりそのものの記録は機械に残っていない。空きの底と巡回の間引き（1分おきが2〜3分おき）から、claude の送る「生きています」の合図が Code タブまで届かなくなったと読んだ。
- **いまの手当て** … 手元の速い版は Edge を立てる段を全部飛ばす形にした（y0919-2103）ので、同じ形では起きない。

## 2. 別件二つ

### hold-stuck（溜め場が読めないまま居座り）… 元は「stale の回に、題も本文も空の本編を溜め場へ入れる」こと。**土台なので直さず報告で止める**

- **いつ** … 20:38:11 に題も本文も空の一本が溜め場（`notify-hold.tsv`）に入り、20:40〜20:55 の16回、毎分「溜めた知らせが読めない（1本・題「」・本文0字）」。
  20:50:40 に訴えが一発鳴った。20:55:13 に「仕事が替わった」で溜め場ごと落ち、いまは溜め場の綴りも無い。
- **どこで** … `watch-notify.ps1` の本編を出す一行（L2380）。鍵が `stale:` の回は `$state` を `bad` にするだけで、
  `$title`・`$body` は空のまま（題と本文を組むのは done／wait の枝だけ）。L2326〜2334 の註は「本編の札がもう異常の札」と
  書いているが、実際の 🪟 は別の道（`$T_BAD_B`）で名乗りなしのまま先に出ていて、本編は空だった。
- **もう一つ見えたこと** … その 🪟 は名乗りなしなので「押し送りはしない（送る状態でない: 名乗りなし）」で断られていた。
  **stale の回に iPhone は鳴っていない**（パネルの札は立つ）。
- **直すなら（案・入れていない）**
  - イ `Send-Ntfy` の入口で「題も本文も空の知らせは溜めない」と断り、足跡に一行残す（空の一本が居座る形は消える）
  - ロ `stale:` の回は、先に出る 🪟 の方へ名乗り `bad` を渡し、本編は出さない（鳴らない穴も塞がる）
- **直さない訳** … 見張りの札の作り（出す・溜める・名乗り）で、作法5 の土台に当たる。

### パネルの「見張り×2147946720」… 元は「前の回が走っている最中に起こしを断られた結果を、定時の知らせが読んだ」こと。**直した**

- 2147946720 ＝ **0x800710E0**。予定表が「同じ仕事の前の回がまだ走っているので、この起こしは断った」ときに付ける結果。
- 20:59:58 に `ClaudeWatchNotify` の起こしが断られ（事象322）、2秒後の 21:00:00 に `daily-notice.ps1` が最終結果を読んで「×」と書いた。
  見張りは死んでおらず、その後も毎分 0 で走っている。
- **直した所**（`~/.claude/daily-notice.ps1`・写し `.bak-20260919`）… 生死の見分けを小さな関数 `Alive-Mark` へ出し、
  **結果が 0x800710E0 で、仕事がいま走っている（Running）ときだけ ○** と読む。走っていなければ今までどおり ×。構文検査 OK。
- **作り値（六通り合格）**

| 結果 | 状態 | 読み |
|---|---|---|
| 0 | Ready | ○ |
| 267009 | Running | ○ |
| **2147946720** | **Running** | **○** |
| 2147946720 | Ready | ×2147946720（今までどおり） |
| 267011 | Ready | ×267011 |
| 0 | Disabled | ×止 |

## 触った所と触らない所

**触った所** … `~/.claude/daily-notice.ps1`（写し `.bak-20260919`）。
**触らない所** … `watch-notify.ps1`（hold-stuck は土台なので報告だけ）・`koushu-handan.html`・`stable`。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **294件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-1255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1255.md) | 09-19 12:54 | stable を v1451 へ進めた |
| [`y0919-0815-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815-2.md) | 09-19 08:54 | 【納品】見立て行と釦の助言の文面を差し替えた（v1451） |
| [`y0919-0815.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815.md) | 09-19 08:19 | 【宣言】見立て行と釦の助言の文面を差し替える（v1451） |
| [`y0919-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0800.md) | 09-19 08:00 | 条件の数の棚卸し（mitate-kazoe.txt） |
| [`y0919-0725.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0725.md) | 09-19 07:43 | 見立て行の尺の縛りを外す |
| [`y0919-0450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0450.md) | 09-19 07:04 | 見立て行の棚卸し（mitate.txt） |
| [`y0919-0427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0427.md) | 09-19 04:32 | 再起動-2 |
| [`y0918-2212-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212-2.md) | 09-19 04:20 | 再起動-1（後の測り） |

<!-- 控えの一覧 ここまで -->
