# 今朝の枠の確かめと、実戦的中-2／持ち上げ-1

**終わり（残り0件）** — 2026-09-20 12:0x（VAIO）。`koushu-handan.html` には触っていない（読んだだけ）。`stable` も触っていない。

## 1. 今朝の枠 … **二つとも入っている**（作り値の結果つき）

| 直し | いまの字 |
|---|---|
| subj-gap の見比べ | `pipe-check.ps1` に括弧落としの手（`cutParen`・3箇所）。控えと画面の両方から**最初の「（」か「(」より後ろを落として**比べ、落として同じ字になった回は長さを問わず同じ仕事とみなす。**下限8字は不変。** |
| step-slow の上限 | `watch-notify.ps1` L223 に `$STEP_MAX_BY = @{ '押し直し' = 90 }`、L265 に `$lim`。**押し直しの段だけ90秒、ほかは60秒。** |

**作り値（subj-gap・六通り／本物の見比べの塊をそのまま写して回した）**

| 場合 | 控え／画面 | 結果 |
|---|---|---|
| 今朝の型 | 「連携の総点検（予定表・…）」／「連携の総点検」 | **見送った** |
| 別件 | 「連携の総点検（…）」／「命令の見張り」 | 訴えた |
| 頭が似た別件 | 「調べ-1（三つの穴）」／「調べ-2」 | 訴えた |
| 8字以上の頭一致 | 「設定画面に「言葉の一覧」の釦（v1452）の宣言」／「設定画面に「言葉の一覧」の釦」 | 見送った |
| 半角の括弧 | 「v1453 の検収 (stable)」／「v1453 の検収」 | 見送った |
| 画面が空 | 「連携の総点検」／（空） | 訴えない |

**作り値（step-slow・四通り／本物の `Step` を写して回した）** … 押し直し65秒→**訴えない**（今朝の64.3秒がこれ）／押し直し95秒→訴える（上限90秒）／鍵の見回り65秒→訴える（上限60秒）／完了30秒→訴えない。

## 2-① 物差しの実戦的中-2 … **済み**（09-14 20:10）

台帳に残っている結果 … **「AI が差 +1967点で最大、本判定は +1169点。一姫は差が出ない（攻めしか言わない）」**。
＊「差」＝**攻めと言った手の平均点棒 − 守りと言った手の平均点棒**。
＊**十二行の細かい表は、報告の綴り（`reports/`）に残っていない**（当時の札は「終わりの札を出した」で閉じている）。
　同じ40000手で測り直せば出せるので、要るときは言ってください。

## 2-② 持ち上げ-1 … **記録が無く未着手だったので、いま測った**

**測り方**（本体には触っていない）
- `core-probe.js` が**本体から `analyze()` の字面をそのまま取り出して node から呼ぶ**（写しを持たない仕掛け）。ブラウザは立てない。
- 兎の票は `usagiLean` と同じ順で数えた … `fillWeak === 0`→**攻め**／`fillWeak >= 2`→**守り**／`fillGood >= 3 かつ goodShapes <= 3`→**守り**／それ以外→**無票**。
- 母集団は `core-battle-log-10k.tsv`（機械打ち同士の一局戦10000局＝**40000手**・09-14 の較正-2）。所要 374秒。
- **裏取り** … 取り出した `analyze()` の返す **良形・弱形・塊・向聴・受けは、記録の欄と1000手で100%一致**。
  `verdict` だけ 97.7% の一致で、差は**風とドラの渡し方**（記録は場風を持っていない）。**兎の票はこの四つしか見ないので、票そのものには効かない。**

**結果（40000手）**

| 兎の票 | 手数 | 割合 | **和了率** | 放銃率 | 被ツモ率 | 流局率 | 平均点棒 |
|---|---|---|---|---|---|---|---|
| **攻め**（弱い余り0） | 13741 | 34.4% | **23.7%** | 13.0% | 23.5% | 14.7% | **+431** |
| **守り**（弱い余り2以上／良形3つ以下） | 10146 | 25.4% | **17.4%** | 12.8% | 25.5% | 16.2% | **−154** |
| 無票（黙る） | 16113 | 40.3% | 21.4% | 13.3% | 24.3% | 15.1% | +175 |

**読み**
- **攻めと言った手は、守りと言った手より和了率が 6.3 ポイント高い**（23.7% ↔ 17.4%）。点棒の差は **585点**。
- **放銃率はほぼ同じ**（13.0% ↔ 12.8%）。兎が見ているのは**手の伸びやすさ**で、**振り込みの危なさではない**——票の向きと放銃は結び付いていない。
- 守りの手は**被ツモが多く（25.5%）、流局も多い**（16.2%）。伸びない手がそのまま押し負ける形。
- **黙る回が4割**あり、その帯は攻めと守りの中間（和了21.4%）。**口を開いた回だけを見れば、向きは正しい。**

＊この数字は**機械打ち同士の一局戦**の母集団によるもの。人の打ち筋ではない（`core-battle-log-10k.tsv` の頭書きのとおり）。

## 触った所と触らない所

**触った所** … 無し（読みと測りだけ）。集計の台は scratchpad に置き、リポジトリには入れていない。
**触らない所** … `koushu-handan.html`・`stable`・`core-battle-log-10k.tsv`（読んだだけ）・`pipe-check.ps1`・`watch-notify.ps1`（今朝の直しのまま）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **308件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1146.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1146.md) | 09-20 11:56 | 今朝の枠の確かめと、実戦的中-2／持ち上げ-1 |
| [`y0920-1058-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058-2.md) | 09-20 11:28 | v1454 説明欄の三つの直し（納品） |
| [`y0920-1058.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058.md) | 09-20 10:53 | 【宣言】説明欄に三つ手を入れる（v1454） |
| [`y0920-1055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1055.md) | 09-20 10:52 | subj-gap の見比べと step-slow の上限を直した（push-defer は直さない） |
| [`y0920-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1040.md) | 09-20 10:40 | 訴え三件の元（push-defer・subj-gap・step-slow）と、説明欄の二つの確かめ |
| [`y0920-0912-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912-2.md) | 09-20 09:49 | v1453 ずんだもん・枝豆・兎の文面の差し替え（納品） |
| [`y0920-0912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912.md) | 09-20 09:10 | 【宣言】ずんだもん・枝豆・兎の文面を mitate-new-2.txt へ差し替える（v1453） |
| [`y0920-0829.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0829.md) | 09-20 08:32 | 09-19 の調べ四件・台帳の「見張り×2147946720」・ずんだもんと兎の文面 |
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

<!-- 控えの一覧 ここまで -->
