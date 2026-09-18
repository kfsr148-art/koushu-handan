# 見立て行の尺の縛りを外す

**終わり（残り0件）** — 2026-09-19（VAIO）。**本体（`koushu-handan.html`）には触っていない。**
21視野で測った結果、**2行でも3行でも溢れる視野は一つも無かった。**

## 外した所

| 何 | どうした |
|---|---|
| `CLAUDE.md` | **尺の縛りは元から書かれていなかった**（「66字」「77字」「字数」いずれも0件）。触っていない |
| `SKILL.md` | 同じく**元から無い**（0件）。触っていない |
| **memory** `mitate-line-length-budget.md` | 「66字目標・77字上限」を**消し**、「縛りは無い／折り返しは FAIL にしない」へ書き替えた。`MEMORY.md` の一行も差し替え |
| **`check.js` ⑦** | 「見立て行が折り返している」で落とす枝を**外した**（註だけ残した） |
| `check.js` ⑦ の二択 | **そのまま残した**（`二択が画面の下へ出ている bottom=… > …`／七人ぶんの `tailBottom` も残す） |

## 21視野の実測（雲で測った）

測ったのは**判定後の二択（`.next-hand-row`）の bottom**。一回の起動で1行・2行・3行を測る。
写しに probe を差し、終わったら写しごと消す（作法14）。**この機械では headless を立てず、雲で回した。**

| 視野 | 1行の bottom | 2行 | 3行 | 折り返し |
|---|---|---|---|---|
| 568x320 | 320 | 320（収まる） | 320（収まる） | 折り返さない（nowrap） |
| 667x375 | 375 | 375 | 375 | 折り返さない |
| **844x390** | 321.8 | **337.3**（収まる） | **348.3**（収まる） | **折り返す** |
| **932x430** | 341.8 | **357.3** | **368.3** | **折り返す** |
| 900x300 | 287.3 | 287.3 | 287.3 | 折り返さない |
| 900x340 | 307.3 | 307.3 | 307.3 | 折り返さない |
| 900x375 | 316.3 | 316.3 | 316.3 | 折り返さない |
| 900x381 | 317.3 | 317.3 | 317.3 | 折り返さない |
| 780x360 | 317.3 | 317.3 | 317.3 | 折り返さない |
| 800x360 | 317.3 | 317.3 | 317.3 | 折り返さない |
| 812x375 | 324.8 | 324.8 | 324.8 | 折り返さない |
| **800x480** | 389.8 | **405.3** | **416.3** | **折り返す** |
| 744x375 | 375 | 375 | 375 | 折り返さない |
| 745x375 | 375 | 375 | 375 | 折り返さない |
| 746x375 | 324.8 | 324.8 | 324.8 | 折り返さない |
| 800x348 | 311.3 | 311.3 | 311.3 | 折り返さない |
| 800x349 | 311.8 | 311.8 | 311.8 | 折り返さない |
| 800x350 | 312.3 | 312.3 | 312.3 | 折り返さない |
| 800x379 | 326.8 | 326.8 | 326.8 | 折り返さない |
| 800x380 | 327.3 | 327.3 | 327.3 | 折り返さない |
| **800x381** | 340.3 | **355.8** | **366.8** | **折り返す** |

### 溢れる視野 … **0件。溢れ幅 … 0px**

**21視野のうち、折り返すのは4視野だけ**（844x390・932x430・800x480・800x381）。
**残る17視野は `nowrap` + `ellipsis` が効いて折り返さない**（≤745px幅／≤380px高の設計どおり。
長い字は「…」で切れるが、二択は動かない）。

**折り返した4視野の余白**

| 視野 | 3行のときの bottom | 視野の高さ | **余白** | 1行増える量 |
|---|---|---|---|---|
| 800x381 | 366.8 | 381 | **14.2px** ← いちばん狭い | +15.5／+11.0 |
| 844x390 | 348.3 | 390 | **41.7px** | +15.5／+11.0 |
| 932x430 | 368.3 | 430 | **61.7px** | +15.5／+11.0 |
| 800x480 | 416.3 | 480 | **63.7px** | +15.5／+11.0 |

**いちばん際どいのは 800x381 の 14.2px。** 1行増が約11pxなので、**4行までは収まり、5行で溢れる**見込み
（4行 ≒377.8／5行 ≒388.8 > 381）。844x390 は 7行あたりが境目になる。

＊古い memory は「844x390 の二択の余白は 4.5px・折り返し1行で FAIL」と書いていたが、
　**いまは 3行でも 41.7px 余る**。v1427 の切り詰めと安全網が入って形が変わっており、
　**縛りの根拠だった数字そのものが古かった**。

## 触った所と触らない所

**触った所** … `check.js`（⑦ の折り返しの枝を外した）／`mitate-fold.js`（新・測りの台）／
`.github/workflows/mitate-fold.yml`（新・手で起こす測り）／memory の二枚。

**触らない所** … **本体（`koushu-handan.html`）**・`serifu.txt`・`adv-check.js`・`panel-check.js`・
`CLAUDE.md`・`SKILL.md`（どちらも尺の縛りは元から無い）・⑦ の二択の検査・21視野の並び・
`ver.txt`・`stable`。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **278件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0918-1923.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1923.md) | 09-18 19:24 | 公開の追いつき-1 |
| [`y0918-1846.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1846.md) | 09-18 19:05 | 起こしの重なり-1（乙・刻をずらす） |
| [`y0918-1831.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1831.md) | 09-18 18:35 | 起こしの重なり-1 の下調べ |
| [`y0918-1757.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1757.md) | 09-18 17:59 | 空きの片付け-1 |
| [`y0918-1747.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1747.md) | 09-18 17:50 | 空きの内訳-1 |
| [`y0918-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1305.md) | 09-18 13:06 | 軽い巡回の刻-1 |
| [`y0918-1221.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1221.md) | 09-18 12:24 | 止まりの読み-4 |
| [`y0918-0716.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0716.md) | 09-18 07:19 | 夜の較正-2 |

<!-- 控えの一覧 ここまで -->
