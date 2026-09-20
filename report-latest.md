# 赤い行「知らせの道が落ちています」が消えなかった元と直し（panel v139）

**終わり（残り0件）** — 2026-09-20 17:0x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 赤い行が読んでいる元

**公開側の `pipe-warn.json` の `ntfyDown` の欄**（`panel.html` L2634 `paintPipeWarn`／`PIPEWARN_URL`）。
`ntfyDown` が真のときだけ「⚠ 知らせの道が落ちています … <text>（<at>）」を出し、偽なら隠す。
**書く側は `pipe-check.ps1`**（L744〜「いまの訴えを公開側にも置く」）。

## 元（なぜ ok の後も消えなかったか）

1. **16:10:58** … 訴えが立ち、`pipe-warn.json` に `ntfyDown:true` を書いて押そうとした。
   しかし**その時は線が切れていた**（`git-push.log` 16:11:02「Could not resolve …」・押し直しも 16:11:20 に失敗）。
2. **押しが通った回にしか指紋を控えない**決め（2026-09-12・公開の止まり-1）なので、
   控え（`pipe-warn-json.sig`）は**前の値 `|False|` のまま**残った。
3. commit は手元に残り、**あとの押し（別件）に相乗りして公開側へ出た**——公開は `ntfyDown:true`。
4. **16:20:20** に訴えが消えると、新しい指紋は `|False|`。**控えと同じ**なので「変わっていない」と判じ、
   **消えた状態を書かず押さなかった**。公開は `true` のまま止まり、赤い行が残った。

＊**パネルは正しかった**（`ntfyDown` が偽なら隠す作り）。止まっていたのは**帳面の側**。

## 直した所

### ① `~/.claude/pipe-check.ps1`（写し `.bak-20260920b`・構文検査 OK）

比べる相手を**控えの指紋から「いま綴りに入っている中身」へ**替えた（綴りが無い回だけ指紋に落ちる）。
押しの成否に関わらず、**綴りと今の状態が食い違えば書いて押す**。

**作り値（本物の塊を写し、偽の綴り・偽の押し手で。本物の git は呼んでいない）**

| 台 | イ 落ちた（押しは失敗） | ロ ok に戻った（押しは成功） |
|---|---|---|
| **直す前** | `ntfyDown:true` を書く | **`true` のまま**（書かない）＝今日の形を再現 |
| **直した後** | `ntfyDown:true` を書く | **`false` に書き替えて押す** |

**本物でも直った** … 直した後に見張りを一度回したら `{"at":"2026-09-20 16:44:09","kinds":[],"ntfyDown":false,"text":""}` を書いて押し、
**公開側も `ntfyDown:false` になった**（実読み）。

### ② `panel.html`（**panel v139**・三箇所そろえた）

赤い行は `pullUsage` の**成功の枝でしか**塗り直していなかった（v118 から）。
使用量が読めない間は、訴えが ok へ戻っても赤い行が残る。
**自前の時計（2分ごと）で読み直す**ようにし、**使用量が落ちた回（`.catch`）でも読み直す**一行を足した。

**作り値（本物の `paintPipeWarn` をそのまま写して・偽の帳面で）**

| 場合 | 結果 |
|---|---|
| **イ 落ちた**（`ntfyDown:true`） | **出る**（class `pipe`・「⚠ 知らせの道が落ちています … ntfy.sh が返さない（HTTP 000）…」） |
| **ロ ok に戻った**（`ntfyDown:false`） | **消える**（class `pipe hide`） |
| ハ 帳面が読めない | 前の姿のまま（今までどおり。判じられないものを塗り替えない） |

## 確かめ

- 公開側 `pipe-warn.json` … **`ntfyDown:false`**（実読み）。`pipe-warn.log` の最後も 16:20:20 の `ok`。
- 公開側 `panel-ver.txt` … **139**。パネルの版は `PANEL_VER`・下の字・`panel-ver.txt` の三箇所そろえた。
- パネルの `<script>` の構文検査 NG 0。
- **雲（走り 35497736651）… success**（フル版・**返事パネルの検査**・配信とも success）。

## 実機で見る所

- 返事パネルを開いて、**赤い行が消えている**こと（開きっぱなしでも2分以内に消える）。
- 下の版の字が **panel v139（9月20日）**。
- 次に知らせの道が落ちたときは、**また赤い行が出て、戻れば自分で消える**こと。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **319件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-0912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912.md) | 09-20 09:10 | 【宣言】ずんだもん・枝豆・兎の文面を mitate-new-2.txt へ差し替える（v1453） |
| [`y0920-0829.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0829.md) | 09-20 08:32 | 09-19 の調べ四件・台帳の「見張り×2147946720」・ずんだもんと兎の文面 |
| [`y0919-2320.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2320.md) | 09-19 23:17 | stale の回に iPhone が鳴らない穴を塞いだ（🪟 に名乗り bad） |

<!-- 控えの一覧 ここまで -->
