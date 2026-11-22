# 枠 百四十六：パネルの赤い警告の行（warn）を出さない（panel v222）

状態：直した・押した（雲の検査の結果待ち） — 20:4x

## 本人の決め
パネルの赤い警告の行（warn・例「起きる刻 19:47 を過ぎた（y1122-1945・2分）」）は丸ごと出さない。訳：止まりには Claude Code を見て気づくので、パネルに出ると煩わしい。19:47 の行は2分の空鳴りで、19:49 に自分で消えた。一、panel から warn の行を外す（どの種類も）・指さすの名と panel-check を合わせる。二、見張りの裏の動き（起こし直し・記録）は変えない・押し送り（ntfy）も今のまま。三、390px で確かめ札一枚。

## 直した所（panel.html・v222）
| 所 | 直し |
|---|---|
| 器 `<p id="wakeWarn">` | 外した（注の一行だけ残した）。`state.json` の `warn`（起こせない・終了予定を過ぎた・止まっとるかも 等の赤い行）を画面に塗る道 `$('wakeWarn')` の塗りの行も外した |
| 様子を写す（`statusText` の赤い行） | 赤い行の読み元から `wakeWarn` を外した（`pipeWarn` だけ）＝様子を写すにも warn の赤い行は入らない |
| `#pipeWarn`（知らせの道が落ちています＝ntfy が返さない時） | **変えていない**（warn の行とは別・本人の決めの「warn」は state.json の warn の行） |
| 版 | panel v222（PANEL_VER・verTag・panel-ver.txt・panel-core.js の VER・`?_v=222`） |

## 変えていない物（本人の二）
`state.json` の `warn` を書く側（inbox-watch.ps1・kumo-wait.ps1 の `Get-WarnLine`）・`pipe-warn.log` の記録・起こし直し・ntfy／🪟の押し送り・stuck-alert。panelView・brief.txt も無変更（センコが読む `warn` は今のまま）。

## 検査（panel-check.js）
- 並びの期待 `usageTag,usageMsg,progBox,pipeWarn,wakeWarn,kumoLine,…` から `wakeWarn` を外した。statusText の作り値の器から `wakeWarn` を外した。
- 手元の `--static` 全て PASS・インラインの script の構文検査も通った。ブラウザ込みの検査は雲が回す（今日の v219・v220 のように手元で出ない所が出たら、訳を見て前へ直す）。

## 実機で見る所
返事パネルに、赤い「⚠ …」の警告の行（起きる刻を過ぎた・止まっとるかも 等）が出ない。止まりは Claude Code の側で見る。「知らせの道が落ちています」（ntfy 落ち）の行だけは、落ちた時に出る。版 panel v222。

見込み20分・実測 約15分。
