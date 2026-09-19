# stale の回に iPhone が鳴らない穴を塞いだ（🪟 に名乗り bad）

**終わり（残り0件）** — 2026-09-19 23:2x（VAIO）。`koushu-handan.html`・`stable` には触っていない。本物の ntfy には当てていない。

## 元（直す前に読んで分かったこと）

`watch-notify.ps1` の 🪟 の塊（L2339〜L2411）で、鍵が `stale:` の回は `$badKind = 'stale'` と置く（L2342）。
ところが名乗りを付ける行（L2359）は **`$badKind -like 'stale:*'`** で見ていた。`'stale'` は `'stale:*'` に**一度も当たらない**。そのため stale の回は、

1. 本編の 🪟（題も本文もある）が**名乗りなし**で出て、押し送りの関門に「送る状態でない: 名乗りなし」で断られる → **iPhone が鳴らない**
2. 名乗りの行を外れた分が「別の一枚を立てる」側（`$badOn`）へ落ち、**題も本文も空の二枚目**を作る → 20:40〜20:55 の hold-stuck

今日 20:38:05〜20:38:11 の記録がこの二つそのまま。hold-stuck（空の札）と「鳴らない」は、**同じ一行の取り違え**から出ていた。

＊ここで言う stale は**見張りの生存記録が途切れた回**（鍵 `stale:`）。20:38 はこの回だった。
　「公開側が古い」ときの押し送りは、別の決め（`ntfy-pending.txt` へ預けて、出たら送る）で持っており、今回は触っていない。

## 直した一箇所

`~/.claude/watch-notify.ps1`（写し `.bak-20260919e`）L2359 の見分けを一語だけ替えた。
```
前  if ($badKind -eq 'dead' -or $badKind -like 'stale:*') { $state = 'bad' }
後  if ($badKind -eq 'dead' -or $badKind -eq 'stale') { $state = 'bad' }
```
これで stale の回は本編の 🪟 に名乗り `bad` が付き（題は `$PUSH_TITLE_BAD`）、二枚目は立たない。
**札の本文・溜め場の作り・預け（`ntfy-pending.txt`）・敷居は変えていない。** 構文検査 OK。

## 作り値（三通り合格・偽の送り手）

本物の台本から、頭（L1〜324）・知らせの道（L686〜1536）・🪟 の塊（L2339〜L2411）をそのまま写し、`curl.exe` と commit／push を偽物に替えて一時の所で回した。

| 場合 | 記録 | ntfy（偽）へ | 溜め場 |
|---|---|---|---|
| **イ stale で 🪟** | `異常の押し送りを一発出す（stale）` → `待たせずに出す [🪟 …]` → `束ねずに単独で出す` → **`押し送りOK（HTTP 200）`** | **1回・題「🪟 異常です（手が要ります）」** | 0行 |
| **ロ ふつうの回**（ヨシ待ち） | `待たせずに出す [🙋 …]` → `公開側に出たのを確かめた` → `押し送りOK（HTTP 200）` | 1回・題「😼 ヨシ頼むにゃ」（今までどおり） | 0行 |
| **ハ 同じ stale が続く**（一発目は済） | `押し送りはしない（stale は既に一発送った。戻るまで出さない）` → 名乗りなしで控えだけ | **0回（一度だけ）** | 0行 |

## 今日の 20:38〜20:55 の型を再現して

同じ stale の鍵を、**直す前の台本（`.bak-20260919e`）は「名乗りなし」で断られて ntfy 0回・空の札を断った**（20:38:05〜11 の記録と同じ並び）、
**直した台本は「押し送りOK（HTTP 200）」まで進み ntfy 1回**——鳴る側へ進んだ。

## 作法36 の突き合わせ（見張りの台本を変えたので）

見張りの段の並びは変えていない（開始 → 生存の合図 → 命令の見張り → 譲りの判じ → 帯 → 鍵 → 押し直し → … → 知らせ → 完了）。変えたのは「知らせ」の段の中の一語だけ。雲で回る見張りは無い。検査の段もこの枠では変えていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **300件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-1343.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1343.md) | 09-19 13:46 | 台帳の「黒猫の待機-2」を読む |
| [`y0919-1255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1255.md) | 09-19 12:54 | stable を v1451 へ進めた |
| [`y0919-0815-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815-2.md) | 09-19 08:54 | 【納品】見立て行と釦の助言の文面を差し替えた（v1451） |

<!-- 控えの一覧 ここまで -->
