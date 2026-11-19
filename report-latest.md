# 検査の見込みを回の種類別の前5回の中央値にした（2026-11-20 00:40）

## 札の頭
- 状態：終わり。残りなし。

## 何が外れていたか
- 見込みを出す `Get-KumoEta`（`~/.claude/kumo-wait.ps1`）は、同じ workflow（check.yml）の**直近5回の成功を種類を分けずに**混ぜて中央値を取っていた。
- 実際の所要は、パネルの版を上げた回が 10〜16分（v178 15分54秒・v179 10分35秒）、報告だけの回が約3分。混ぜると 3〜4分に引きずられる。
- 今回の実例（kumo-wait.log）：00:18:16 の見込みは「前5回 3分・3分・4分・11分・15分 の中央値 4分」。実際の v180 は **13分21秒**（00:31 に終了）。**9分21秒外れ**。この見込みだと、00:22 ごろに赤い「起きる刻を過ぎた」が誤って出ていた。

## 直したこと（`~/.claude/kumo-wait.ps1`・写し kumo-wait.ps1.bak-20261120）
1. **回の種類を commit が触ったファイルで決める**（`Get-RunKind`）：本体替え＝koushu-handan.html・check.js・adv-check.js・check-all.js・ver.txt／パネル替え＝panel.html・panel-check.js・panel-ver.txt／それ以外＝報告だけ。本体を触っていれば本体替えが先。答えは `kumo-kind.tsv`（sha と種類）に控え、同じ commit を二度引かない。
2. **`Get-KumoEta` を種類別にした**：今の走りと同じ種類の、直近40回の成功のうち**前5回だけ**の所要（updated_at − created_at）の中央値。check.yml だけがこの形で、job.yml・voice-m4a.yml などは従来どおり。
3. 同じ種類が直近40回に一つも無ければ **見込みなし（0）**。混ぜた中央値へは戻さない。
4. `Get-KumoRun` が走りの `head_sha` を返し、見込みを出す呼び元（Check-KumoWait）がそれを渡す。
5. **赤い「起きる刻を過ぎた」**（inbox-watch.ps1）は台帳の `eta` を見る作りで、その `eta` を出すのがこの `Get-KumoEta`。なので**同じ見込みで判じられる**（inbox-watch 側は直していない）。
- 常駐（inbox-watch.ps1）は kumo-wait.ps1 を起動時に読み込むので、起こし直した（pid 9204・00:33:18 起動 ＞ 台本 00:33:04）。構文検査 0件・BOMあり・定義は一つずつ。

## 今の回で確かめた（本物の GitHub を読むだけ・何も送らない）
| 回 | 種類 | 前5回（成功）の所要 | 中央値＝見込み | 実測 |
|---|---|---|---|---|
| panel v180（3eba79ad） | パネル替え | 11分35秒・16分54秒・16分8秒・12分58秒・13分55秒 | **13分55秒** | **13分21秒**（差34秒） |
| 報告だけ（ce3e6865） | 報告だけ | 3分3秒・3分27秒・15分46秒・4分51秒・3分49秒 | **3分27秒** | 3分30秒（差3秒） |
- 旧法（混ぜる）は 4分で、v180 の実測と 9分21秒ずれた。新法は 34秒。
- 通しの確認：差し込んだ本物の kumo-wait.ps1 を一時の置き場で読み込み、`Get-KumoRun`（HeadSha 一致）→ `Get-KumoEta`（13分55秒）の順で通った。
- 報告だけの回の前5回に 15分46秒が一つ混じる（報告の分類だが重い走りだった回）。中央値なので 3分27秒は動かない。

## 公開の確認（前の枠の panel v180 の分も併せて）
- 公開の panel-ver.txt＝180。公開の panel.html に「終わる見込み」「見込み未記入」「段の台帳 未記入」（9件）。
- パネルが読む koushu-state の state.json に stepDone＝0・stepTotal＝5・mikomi＝40分・sNow が載る（この枠の台帳そのもの）。

## 実機で見る所
- 次に検査の雲待ちを立てたとき、台帳の見込み（パネルの雲待ちの一行・kumo-wait.log の「見込み：」の行）が、パネル替えなら 11〜17分・報告だけなら 3〜4分の値で、**種類の名（パネル替え／報告だけ）つき**で出ること。赤い「起きる刻を過ぎた」が、実測より早く出ないこと。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **942件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1120-0030.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-0030.md) | 11-20 00:34 | 検査の見込みを回の種類別の前5回の中央値にした（2026-11-20 00:40） |
| [`y1119-2315-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2315-2.md) | 11-20 00:05 | 使用量の止まりを rewake で起こす（rewake-limit.js）・台帳照合の取り下げ（2026-11-20 00:10） |
| [`y1119-2315.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2315.md) | 11-19 23:49 | 立て直しの確かめと「様子を写す」・使用量の待ちで窓を落とさない（2026-11-20 00:00） |
| [`y1119-2300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2300.md) | 11-19 23:40 | SessionStart の rewake を外し、窓を立てる時に最初の一言を渡す（2026-11-19 23:00） |
| [`cloud-panel-check-20261119-143215.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261119-143215.md) | 11-19 23:40 | 雲で回した：`panel-check.js` |
| [`cloud-panel-check-20261119-142210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261119-142210.md) | 11-19 23:30 | 雲で回した：`panel-check.js` |
| [`y1119-2245.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2245.md) | 11-19 22:48 | 窓の起こし役（rewake）を切らさない（二段目・2026-11-19 22:45） |
| [`y1119-2220.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2220.md) | 11-19 22:27 | 札の控えを書く所に錠を掛ける（一段目・2026-11-19 22:20） |
| [`y1119-2205.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2205.md) | 11-19 22:08 | 新しい形へ移すための一覧（2026-11-19 22:05・何も直していない） |
| [`y1119-2200.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2200.md) | 11-19 21:58 | 見張りが裏の働き手（claude -p）を自分で起こす所を止める（2026-11-19 22:00） |
| [`y1119-2150.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2150.md) | 11-19 21:49 | claude -p の仕掛けの受け継ぎを断ち、札の無い手番を拾う網を idle_prompt に戻す（2026-11-19 21:50） |
| [`y1119-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2100.md) | 11-19 20:59 | 17:48 の赤い行「claude -p 1本」を調べて片付ける（2026-11-19 21:00） |
| [`y1119-1645.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1645.md) | 11-19 16:46 | 終わりの後に二行出るのを元から止める（2026-11-19 16:50） |
| [`y1119-1620.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1620.md) | 11-19 16:28 | 「▶ 進行中（N分）」の分数の直し（2026-11-19 16:28） |
| [`cloud-panel-check-20261119-071623.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261119-071623.md) | 11-19 16:27 | 雲で回した：`panel-check.js` |
| [`y1119-1610.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1610.md) | 11-19 16:15 | 😽 の知らせと終わりの札を一つに（2026-11-19 16:15） |
| [`y1119-1605.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1605.md) | 11-19 16:02 | 台帳の済の付け方・終わりの札を一枚に（2026-11-19 16:05） |
| [`y1119-1600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1600.md) | 11-19 15:55 | 台帳の済の付け方の直し（2026-11-19 16:00） |
| [`y1119-1555.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1555.md) | 11-19 15:50 | 定時の再起動の見送りを今の実物で見る形に・台帳の行を自動で済に（2026-11-19 15:55） |
| [`y1119-1540.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1540.md) | 11-19 15:39 | 定時の再起動の見送りと、台帳の未了の内訳（数えるだけ・何も消していない）2026-11-19 15:40 |

<!-- 控えの一覧 ここまで -->
