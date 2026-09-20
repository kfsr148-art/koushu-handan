# 赤い行の件（同じ枠の二度目）— **もう直っていて、公開側も戻っている**

**終わり（残り0件）** — 2026-09-20 17:5x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

同じ枠が **16:40:21** と **17:56:21** の二度届いた。**16:40 の枠で直し切っており**（札 `reports/y0920-1640.md`）、
この回は**求めどおり作り値を回し直して、いまの公開側を実読みで確かめた**。

## 赤い行が読んでいる元

**公開側の `pipe-warn.json` の `ntfyDown` の欄**。
読む側は `panel.html` の `paintPipeWarn()`（`PIPEWARN_URL` = `https://kfsr148-art.github.io/koushu-handan/pipe-warn.json`）。
`ntfyDown` が真のときだけ「⚠ 知らせの道が落ちています … <text>（<at>）」を出す。
**書く側は `pipe-check.ps1`** の「いまの訴えを公開側にも置く」塊。

## 元（16:20 の ok の後も消えなかった訳）

16:10:58 に `true` を書いた回は**線が切れていて押しが落ちた**（`git-push.log` 16:11:02「Could not resolve …」）。
指紋（`pipe-warn-json.sig`）は**押しが通った回にしか控えない**決めなので前の値のまま残り、
16:20:20 に訴えが消えたとき「指紋は変わっていない」と判じて、**消えた状態を書かなかった**。

## 直し（16:40 の枠で入れた）

| 所 | 中身 |
|---|---|
| `~/.claude/pipe-check.ps1`（写し `.bak-20260920b`） | 比べる相手を**控えの指紋から「いま綴りに入っている中身」へ**替えた。押しの成否に関わらず、食い違えば書いて押す |
| `panel.html` → **panel v139** | 赤い行を**自前の時計（2分）で読み直す**。使用量の取得が落ちた回（`.catch`）でも読み直す |

**panel の版は三箇所そろえた** … `PANEL_VER = '139'`／下の字 `panel v139（9月20日）`／`panel-ver.txt` = 139。

## 作り値（この回に回し直した）

**赤い行（本物の `paintPipeWarn` をそのまま写して・偽の帳面）**

| 場合 | 結果 |
|---|---|
| **イ 落ちた**（`ntfyDown:true`） | **出る**（class `pipe`・「⚠ 知らせの道が落ちています … ntfy.sh が返さない（HTTP 000）…」） |
| **ロ ok に戻った**（`ntfyDown:false`） | **消える**（class `pipe hide`） |
| ハ 帳面が読めない | 前の姿のまま（判じられないものは塗り替えない） |

**書く側（本物の塊・偽の綴り・偽の押し手。本物の git は呼んでいない）**
指紋を `|False|` にしてから、イ 落ちた（押しは失敗）→ `ntfyDown:true` を書く。
続けて ロ ok に戻った（押しは成功）→ **`ntfyDown:false` に書き替えて押す**（17:57:14 の回で確認）。
＊**直す前の台**では、同じ筋で ロ の後も `true` のまま残る（16:40 の枠で再現済み）。

## いまの実読み（17:56）

| 見た所 | 値 |
|---|---|
| 公開 `pipe-warn.json` | **`{"at":"2026-09-20 16:44:09","kinds":[],"ntfyDown":false,"text":""}`** |
| 公開 `panel-ver.txt` | **139** |
| 手元 `pipe-warn.json` | 同じ（`ntfyDown:false`） |
| `pipe-warn.log` の最後 | `2026-09-20 16:20:20  ok            訴えは無くなった` |

**赤い行が出る条件（`ntfyDown` が真）は、いまどこにも立っていない。**

## 実機で見る所

- 返事パネルで**赤い行が消えている**こと。開きっぱなしの端末でも、**2分以内に自分で読み直して消える**。
- 下の版の字が **panel v139（9月20日）**。まだ v138 と出ていれば、その端末が古い頁を掴んでいる——
  **5分以内に自分で読み直す**（`panel-ver.txt` を見て跳ぶ作り）か、一度開き直せば v139 になる。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **322件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1756.md) | 09-20 17:58 | 赤い行の件（同じ枠の二度目）— **もう直っていて、公開側も戻っている** |
| [`y0920-1710-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710-2.md) | 09-20 17:23 | v1458 「三」の根拠の段へ一文を足した（納品） |
| [`y0920-1710.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710.md) | 09-20 17:00 | 【宣言】「三」の根拠の段の末尾へ一文を足す（v1458） |
| [`y0920-1640.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1640.md) | 09-20 16:59 | 赤い行「知らせの道が落ちています」が消えなかった元と直し（panel v139） |
| [`y0920-1630.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1630.md) | 09-20 16:35 | 16:11 の訴え二つ（ntfy-down・pub-read）の今 |
| [`y0920-1500-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500-2.md) | 09-20 15:19 | v1457 剣士の八枚を idleRight 52 に揃えて焼き直した（納品） |
| [`y0920-1500.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500.md) | 09-20 14:48 | 【宣言】剣士の八枚を idleRight 52 に揃えて焼き直す（v1457） |
| [`y0920-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1450.md) | 09-20 14:40 | 08-20 の保留三つの今（振りの八枚の倍率・目盛り画像の置き場・sizing-review.png） |
| [`y0920-1406-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406-2.md) | 09-20 14:24 | v1456 A の末尾を実測の数を並べた字へ（納品） |
| [`y0920-1406.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406.md) | 09-20 14:06 | 【宣言】A の末尾の一文を数入りの字へ差し替える（v1456） |
| [`y0920-1400.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1400.md) | 09-20 13:59 | 外した表の前後の字（L1497・そのまま写し） |
| [`y0920-1330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330-2.md) | 09-20 13:50 | v1455 節五から猫牌の表の二つ目を外した（納品） |
| [`y0920-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330.md) | 09-20 13:29 | 【宣言】説明欄の節五から猫牌の表の二つ目を外す（v1455） |
| [`y0920-1210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1210.md) | 09-20 12:05 | 本体のいま三つ（較正-1 の綻び・猫牌の表・ダブルヨシ） |
| [`y0920-1146.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1146.md) | 09-20 11:56 | 今朝の枠の確かめと、実戦的中-2／持ち上げ-1 |
| [`y0920-1058-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058-2.md) | 09-20 11:28 | v1454 説明欄の三つの直し（納品） |
| [`y0920-1058.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058.md) | 09-20 10:53 | 【宣言】説明欄に三つ手を入れる（v1454） |
| [`y0920-1055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1055.md) | 09-20 10:52 | subj-gap の見比べと step-slow の上限を直した（push-defer は直さない） |
| [`y0920-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1040.md) | 09-20 10:40 | 訴え三件の元（push-defer・subj-gap・step-slow）と、説明欄の二つの確かめ |
| [`y0920-0912-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912-2.md) | 09-20 09:49 | v1453 ずんだもん・枝豆・兎の文面の差し替え（納品） |

<!-- 控えの一覧 ここまで -->
