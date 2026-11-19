# 立て直しの確かめと「様子を写す」・使用量の待ちで窓を落とさない（2026-11-20 00:00）

## 札の頭
- 状態：終わり（残りは台帳の照合だけ）。今動いている物：常駐 inbox-watch（pid 10796・23:49:04 起動）。

## ① 立て直しの見張りを本物で確かめた
- 23:37:51 手待ちを確認（最後の合図 idle_prompt・181秒前・待ち手1本）→ 旧窓を落とし、予定表 ClaudeCodeAtLogon で立て直し。
- 新しい窓 pid 4704（23:38:04）・遠隔 rcName koushu-handan-50／rcPid 4704・待ち手1本（pid 11136）。確かめの一行で rewake が exit 2 で窓を起こした。詳細は reports/y1119-2300.md 末尾「立て直しの記録」。

## ② 「様子を写す」（panel v179）
- 公開の panel-ver.txt = 179。公開の panel.html に「様子を写す」6箇所・statusText 3箇所。
- 同じ枠が二つ届いた件は、一つの仕事にした（**二つ目は合わせた**）。

## ③ 使用量の待ちの間は窓を落とさない
使用量の上限で止まると、02:50（5時間枠のリセット）に窓が自分で続きをやる。窓を落とすとその待ちが消えるので、窓を落とす道を全部洗った。

| 道 | 使用量の待ちを見るか | 状態 |
|---|---|---|
| 03:00 の定時の再起動（daily-reboot.ps1） | reboot-hold.js が訳を返す（見送りの訳に「使用量の上限の待ち」が入る） | 23:35 に済み・今回再確認 |
| 立て直しの見張り（restart-proof.ps1） | reboot-hold.js --usage-only が訳を返す間は待つ | 23:35 に済み |
| ClaudeRevive（revive-claude.ps1） | 生きた窓は落とさない。閉じるのは**子の居ない打ち止めの輪の窓だけ**（203〜207行）。窓が居れば loopok で何もしない | 直さず（もともと落とさない形） |
| 固まりの見極め（inbox-watch.ps1 の Restart-Window） | **見ていなかった** → 今回、頭に関門を足した | **直した** |

- 直した所：`inbox-watch.ps1` の `Restart-Window` の頭に、`reboot-hold.js --usage-only` が訳を返したら**落とさず `Say` に記録して 0 を返す**関門（6行）。作り値（FrozenKilled）の間は見ない。呼び元は「固まり」の一箇所だけ。
- 見分けの条件（reboot-hold.js）：最後の合図が StopFailure／状態が「止まり…」、または usage.json の5時間枠・週枠が 95% 以上でリセット前。今は 5時間枠 86%・週枠 64% なので `--usage-only` は空（落とす側は今までどおり動く）。
- 手順：写し inbox-watch.ps1.bak-20261120 → 直す → 構文検査 0件・BOM あり・差分は足した6行だけ → 常駐を起こし直し（pid 10796・23:49:04 ＞ 台本 23:48:42）。
- 途中で踏んだ穴：置換文字列の `\r\n` が本物の改行に化けた（作法34）。`"`r?`n"` に直して通した。
- **見送りの訳**（reboot-hold.js）には使用量の訳が入っている。今回 Restart-Window も同じ訳を見る形になり、三本（定時・立て直し・固まり）が揃った。

## 残り
- 台帳 orders-open.tsv の「未了：受領」10件（2026-11-19 21:43〜23:30）。コミット履歴では panel v179 までの分は済んでいる様子。**照合は本人の指示待ち**（黙って落とさない）。
- 使用量が 100% で止まった場合の 02:50 の自動の続きは、実機で止まったときにしか確かめられない（人手待ち・見るのは窓が落ちずに続くか）。

## 実機で見る所
- 使用量が上限で止まったあと、02:50 に窓が自分で続きを始めること（窓が落ちて新しく立っていないこと）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **940件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y1119-1520.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1520.md) | 11-19 15:19 | 定時の再起動の後の点検の直し（2026-11-19 15:20） |
| [`y1119-1505.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-1505.md) | 11-19 15:05 | パネルの止まり扱いの分数と、控えの関門の訳の出し先（2026-11-19 15:06） |

<!-- 控えの一覧 ここまで -->
