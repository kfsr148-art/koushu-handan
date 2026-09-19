# 現況の行が「本体v1451／stable v1451」のまま … パネルが版を開いた一度しか取っていなかった

**終わり（残り0件）** — 2026-09-19 22:1x（VAIO）。`koushu-handan.html`・`stable` のタグには触っていない。

## 測った三つ

| | 測り | 値 |
|---|---|---|
| ① | `git ls-remote --tags origin` の stable | **e219d938**（v1452 の commit） |
| ① | `git show stable:ver.txt` | **1452** |
| ② | 公開側 `https://kfsr148-art.github.io/koushu-handan/ver.txt` の実読み | **1452** |
| ② | stable の raw（`raw.githubusercontent.com/…/stable/ver.txt`）の実読み | **1452**（`Cache-Control: max-age=300`） |
| ③ | `state.json` を書く台本が読んでいる版の出どころ | **無い**。`state.json` には版の欄が一つも無い（あるのは件名・指示など） |

**③の中身** … 現況の行（「本体v…／stable v…」）を組んでいるのは台本ではなく **`panel.html` 自身**。
左の数は `VER_URL`（公開側の ver.txt）、右の数は `STB_URL`（stable の枝の raw の ver.txt）を、パネルが直に取りに行っている（`pullVer()`・L1742）。

## 元 … 読み違いではなく、**取りに行くのが開いた一度だけ**だった

`pullVer()` を呼ぶのは `showMain()`（パネルを開いたとき）の**一回だけ**。状態は15秒ごと、使用量と板は2分ごとに取り直しているが、
版だけは取り直していなかった。**開きっぱなしのパネルは、21:10 の v1452 公開・21:39 の stable の移動のあとも、開いた時の 1451 を出し続ける。**
②③は 1452 なので、行を作る側（パネル）の直し。

## 直した所 … **panel v138**（29c6e5cc）

- `showMain()` に **`setInterval(pullVer, 120000)`**（2分ごとに本体と stable の版を取り直す）を足した。時計の変数 `honTimer` を一つ足した。
- stable 側は raw の手前に5分の預かりがあるので、タグを動かしてから**最大7分ほど**で追いつく。
- パネルの版は三箇所同時に上げた … `PANEL_VER '138'`・`verTag panel v138（9月19日）`・`panel-ver.txt 138`。
- 構文検査（パネルの `<script>` を切り出して `node --check`）NG 0。
- **雲（走り 35445368170）** … 22:1x の一度読みで、速い版は success、フル版と返事パネルの検査（panel-check.js）は**走行中**。
  公開側の `panel-ver.txt` は既に **138**。
  ＊走りの見張りは空き不足で Claude Code に止められたので、起こし直していない。結果は次の枠で確かめる。

## 実機で見る所

- 返事パネルの下の版の字が **panel v138（9月19日）** になっている（開きっぱなしの端末は5分以内に自分で読み直す）。
- 現況の行が **「本体v1452／stable v1452」** になっている。
- 次に版が上がったとき、パネルを開き直さなくても**2分（stable は最大7分）ほどで数が動く**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **297件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0919-0815.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815.md) | 09-19 08:19 | 【宣言】見立て行と釦の助言の文面を差し替える（v1451） |
| [`y0919-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0800.md) | 09-19 08:00 | 条件の数の棚卸し（mitate-kazoe.txt） |
| [`y0919-0725.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0725.md) | 09-19 07:43 | 見立て行の尺の縛りを外す |

<!-- 控えの一覧 ここまで -->
