# 命令の見張りと、作法36（回る段の突き合わせ）

**終わり（残り0件）** — 2026-09-19 22:0x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 1. claude の窓が回す命令の見張り … **足した**

hook.log にはこれまで PreToolUse／PostToolUse の行が**一つも無かった**ので、まず書く手から足した。

| 物 | 何をするか |
|---|---|
| `~/.claude/tool-mark.ps1`（新） | PreToolUse／PostToolUse（**Bash・PowerShell だけ**）から **async** で呼ばれ、`刻  PreToolUse  Bash id=<tool_use_id> 命令の頭60字` を hook.log へ一行。命令を待たせず、何があっても終了コード0 |
| `~/.claude/settings.json` | `hooks.PreToolUse` と `hooks.PostToolUse` を足した（写し `settings.json.bak-20260919`。ほかの設定は一字も変わっていないことを突き合わせた） |
| `~/.claude/cmd-watch.ps1`（新） | hook.log の尾4000行から id で組を作り、**始まって終わっていない命令**の経過を数える。上限は**直近50回の Bash の所要の中央値×3、下限10分**。超えたら `ntfy-say.ps1` で**札を一枚**（命令は**切らない**）。立てた id は `cmd-watch-seen.txt` に控え、**同じ命令には一度だけ**。始まりより後に `stop` があれば終わった扱い（終わりの行が欠けた回の空振り止め） |
| `~/.claude/watch-notify.ps1` | 毎分の巡回の「生存の合図」の直後に段「命令の見張り」を足した（写し `.bak-20260919c`）。**譲り（軽い巡回）より前**に置いたので、重い帯の最中でも回る。hook.log の尾300行に終わっていない命令が無ければ子を起こさない |

**構文検査** … `tool-mark.ps1`・`cmd-watch.ps1`・`watch-notify.ps1` とも Tokenize OK。

**作り値（一時の所に偽の hook.log・偽の ntfy-say・刻を固定。本物の窓には当てていない）**

| 場合 | 結果 |
|---|---|
| **イ 超えた**（中央値20秒→上限10分・経過11分） | ✔ 札1枚「⏳ 命令が長く回っています（11分）」・本文に命令・始まり・経過・上限の決め |
| **ロ 超えない**（経過5分） | ✔ 札0枚 |
| **ハ 同じ命令を三回見回る** | ✔ 札1枚のまま（二度目・三度目は立てない） |
| （添え）始まりの後に stop がある | ✔ 札0枚 |
| （添え）中央値300秒→上限15分・経過11分 | ✔ 札0枚 |
| （添え）tool-mark に壊れた入力 | ✔ 終了コード0・何も書かない |

**本物の hook** … 足した直後から効いている。21:56:45 に `PreToolUse Bash id=toolu_01Cu…`、21:56:51 に同じ id の `PostToolUse` が入った。

＊札の題「⏳ 命令が長く回っています（N分）」は仮の字。言い回しはこちらで選ばないので、違う方がよければ言ってください。

## 2. CLAUDE.md に一行 … **足した（作法36）**

「**検査（check-all／check.yml）や見張りの台本の決めを変える枠は、変えた後に手元で回る段と雲で回る段の一覧を札に書いて突き合わせる。書かない枠は終わりにしない。**」

## 作法36 の突き合わせ（この枠は見張りの台本を変えたので）

**見張り（`watch-notify.ps1` の毎分の巡回）** … 手元だけで回る。雲では回らない。

| 順 | 段 | 重い帯の最中 |
|---|---|---|
| 1 | 開始 → 巡回の合図 | 回る |
| 2 | 生存の合図 | 回る |
| 3 | **命令の見張り（新）** | **回る** |
| 4 | 譲りの判じ（重い帯ならここで返る） | — |
| 5 | 帯の見回り → 鍵の見回り → 押し直し → 起き上がり・台帳の拾い直し → 窓とプロセス → hook.log → 控え → 知らせ → 使用量 → 完了 | 回らない |

**検査**（この枠では変えていない。いまの形）

| 段 | 手元の速い版 | 雲の速い版 | 雲のフル版 |
|---|---|---|---|
| ①〜⑥・⑧〜⑩・⑫〜⑮・⑲〜㉒（17段） | 回る | 回る | 回る |
| ⑦・⑯・⑰・⑱ | **飛ばす**（SKIP） | 回る（⑦は2視野） | 回る（⑦は21視野） |
| ㉓ | 飛ばす | 飛ばす（速い版のため） | 回る |
| adv-check | **飛ばす** | 回る | 回る |

## 3. koushu-handan.html・stable … **触っていない**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **295件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-0427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0427.md) | 09-19 04:32 | 再起動-2 |

<!-- 控えの一覧 ここまで -->
