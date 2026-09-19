# 【宣言】設定画面に「言葉の一覧」の釦を足す（v1452）

**ヨシ待ち** — 2026-09-19 17:01（VAIO）。**印: y0919-1701**。
本体（`koushu-handan.html`）の工事なので、**ヨシを取るまで一行も触らない**。

## 何をするか

設定画面（`catRoomBuild()`）に釦 **「言葉の一覧」** を一つ足し、押すと
説明欄「たまに出る言葉」の **10語（L1545〜L1554）と締めの一文（L1555）** が出る重ねを開く。

## 文を二重に持たない形

**新しい定数は作らない。説明欄の字を、そのまま読む。**

説明欄の該当箇所 **L1544〜L1555** を `<span id="glossaryBlock">…</span>` で囲み、
設定側は `document.getElementById('glossaryBlock').innerHTML` を写して出す。
**字は本体に一つきり**で、説明欄を直せば設定側も同じに変わる。

＊これは既にある手と同じ。猫牌の説明（`toggleCatHelp`・**L4966〜L4975**）が
　`helpSec5` の `innerHTML` を写して使っている。同じ流儀に揃える。
＊`<span>` は**行内の札**なので、囲んでも改行も間も増えない——**説明欄の見え方は変わらない**。

## 触る行と足す行数

| ファイル | 行 | 何を |
|---|---|---|
| `koushu-handan.html` | **L2** | `data-ver="1451"` → `"1452"`（書き替え1行） |
| `koushu-handan.html` | **L1424** | `verTag` の `v1451` → `v1452`（書き替え1行） |
| `koushu-handan.html` | **L1544** | 行の**頭**に `<span id="glossaryBlock">` を足す（字は変えない） |
| `koushu-handan.html` | **L1555** | 行の**末**に `</span>` を足す（字は変えない） |
| `koushu-handan.html` | **L8537 の前** | 釦を作る **7行**を足す（`kotobaBtn`。押すと `glossaryOpen()`） |
| `koushu-handan.html` | **L8559** | `appendChild` の並びへ差し込む（書き替え1行） |
| `koushu-handan.html` | **L8564** | 格子の整列の配列へ `kotobaBtn` を足す（書き替え1行） |
| `koushu-handan.html` | **L8586 の後** | 重ねを作る／開く関数 **約38行**（`glossaryBuild` / `glossaryOpen` / `window.glossaryOpen`） |
| `check.js` | **L303 付近** | `screen === 'glossary'` の枝を1行 |
| `check.js` | **L667** | `SCREENS` へ `'glossary'` を足す（書き替え1行） |
| `ver.txt` | 全体 | `1451` → `1452` |
| `serifu.txt` | — | `node serifu-extract.js` で**再抽出**（台詞は足さないが、行番号がずれるため） |

**足すのは合わせて約45行、書き替えは6行。** 説明欄の**字は一字も増減しない**。

**釦の位置** … 指示どおり **「誤診記録」の次・「▶️ ずんだもんと現場猫」の前**（並びの8番目と9番目の間）。
枠の色は**既定の金茶のまま**にする（記録の二つと同じ青灰にもできる。色は選ばないので、
違う方がよければ言ってください）。

## 触らない所

**`analyze()`・判定・条件・光る牌には一字も触らない。**
`toneFacts` / `toneAngleLine` / `toolEyeSay` / `tenLeans` / `bestShapeOneSuit` / 印の付け方、
`mitate-new.txt`、`stable`、`adv-check.js`、説明欄の**文面そのもの**（`<span>` で囲むだけ）。

## 変わっていないことの示し方（工事の後）

1. **説明欄 L1544〜L1555 の字**から `<span id="glossaryBlock">` と `</span>` を剥いだものが、
   工事前と**完全一致**することを示す（前後の sha256 と `diff` の0行）。
2. `git diff` の本体側が、**版の2行＋span の2行＋設定側の足し分だけ**であることを示す。
3. **⑦（画面の溢れ）に新しい重ねを足して測る**——`check.js` の `SCREENS` を9→**10画面**にし、
   手元は速い版（568x320 のひと視野）、雲はフル版（21視野）で通す。
   ＊ここは仕組みの分かれ道なので、こちらで「測る側」を選んだ（測らないままだと、
   　新しい重ねだけ溢れの見張りから外れる）。

## 段取りと見込み

`<span>` を巻く → 釦と重ねを足す → 版を三箇所 → `check.js` に画面を足す →
`node serifu-extract.js` → **速い版（`node check-all --fast`）が通ってから一度で commit** →
push（雲がフル版を回す）。**見込み 60分。**

**「y0919-1701 にヨシ」で着手します。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **286件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0918-2055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2055.md) | 09-18 21:01 | 空きの内訳-2 |
| [`y0918-2049.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2049.md) | 09-18 20:53 | 鍵切れの見張り-1 |
| [`y0918-2035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2035.md) | 09-18 20:38 | 配信の譲り-1（乙・通し切る形へ） |
| [`y0918-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1953.md) | 09-18 20:00 | 配信の譲り-1 の下調べ |

<!-- 控えの一覧 ここまで -->
