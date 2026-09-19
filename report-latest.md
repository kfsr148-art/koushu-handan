# hold-stuck の直し（空の札を溜め場へ入れない）

**終わり（残り0件）** — 2026-09-19 22:0x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 直した所

`~/.claude/watch-notify.ps1`（写し `.bak-20260919d`）の **`Send-Ntfy` の溜め場へ入れる入口**（`Add-Held` の直前・L1484 付近）。
L2380 付近の本編の呼び出しは、この入口を通って溜め場へ入る。ここで断れば、ほかの呼び出しにも同じ止めが効く。

- **題と本文がどちらも空**のときだけ、溜め場へ入れずに返す（戻りは `$false`。呼び手は全部 `[void]` で受けているので流れは変わらない）。
- 記録（`watch-notify.log`）に一行 … **「空の札を断った（stale の回）」**（鍵が `stale:` でない回に来たら「鍵 <鍵>」と書く）。
- 片方でも中身があれば今までどおり溜める。
- **構文検査** Tokenize OK。

## 作り値（三通り合格・偽の溜め場と偽の記録・本物の送り手は偽物に差し替え）

本物の台本から `Send-Ntfy`・`Add-Held`・`B64`・`Now-Epoch` をそのまま写し、鍵を `stale:2026-09-19 19:38:57` にして回した。

| 場合 | 戻り | 溜め場 | 記録 |
|---|---|---|---|
| **空（題も本文も無い）** | False | **0行（入れない）** | 「空の札を断った（stale の回）」 |
| **題だけ空**（本文あり） | True | 1行（入れる） | 「知らせを溜めた []」 |
| **両方ある** | True | 2行（入れる） | 「知らせを溜めた [🔔 知らせ]」 |

＊本物の溜め場（`notify-hold.tsv`）はいまは無く、作り値でも作っていない。本物の送り手（`Send-NtfyNow`）は一度も呼ばれていない。

## 一つ気になる所（直していない）

「題だけ空→入れる」の一本は、出す側（L1413 付近）が「題か本文が空なら読めない」と見て**出さずに居座る**判じのまま。
いま題が空で本文だけある札を作る道は見当たらないが、もし来れば同じ居座りになる。直すなら出す側の判じも揃える必要がある。

## 台帳

hold-stuck の行（20:55:33）を済にした。**台帳の残りは0件。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **296件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-1255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1255.md) | 09-19 12:54 | stable を v1451 へ進めた |
| [`y0919-0815-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815-2.md) | 09-19 08:54 | 【納品】見立て行と釦の助言の文面を差し替えた（v1451） |
| [`y0919-0815.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815.md) | 09-19 08:19 | 【宣言】見立て行と釦の助言の文面を差し替える（v1451） |
| [`y0919-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0800.md) | 09-19 08:00 | 条件の数の棚卸し（mitate-kazoe.txt） |
| [`y0919-0725.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0725.md) | 09-19 07:43 | 見立て行の尺の縛りを外す |
| [`y0919-0450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0450.md) | 09-19 07:04 | 見立て行の棚卸し（mitate.txt） |

<!-- 控えの一覧 ここまで -->
