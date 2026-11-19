# 使用量の止まりを rewake で起こす（rewake-limit.js）・台帳照合の取り下げ（2026-11-20 00:10）

## 札の頭
- 状態：終わり。残りは実機の確かめ一つ（実際に上限で止まったとき）。

## 本人の裁定の実施
- 台帳 orders-open.tsv の未了10件の照合は**しない**（1日を超えたら自動の時間切れに任せる）。段の台帳の `[決]` を外した。
- ヨシ待ちを解いた：yoshi-open.tsv（昨日の古い印 51行）を空にした（写し yoshi-open.tsv.bak-20261120）。

## 大事な穴：autoContinueAtUsageLimit は遠隔の会話では始まらない
- 代わりに **StopFailure にも rewake を掛けた**。使用量の止まりなら、戻る刻＋2分まで待って exit 2 で窓を起こし「続きをせよ」と渡す。
- 新しい道具 `~/.claude/rewake-limit.js`（rewake.js は触らず別立て）。settings.json の StopFailure に `async:true・asyncRewake:true・timeout:86400` で掛けた（写し settings.json.bak-20261120・足したのは1件・差分は足した11行だけ）。
- 動き
  1. 使用量の止まりか判じる：usage.json の5時間枠・週枠が 95%以上でリセット前、または返事の本文に limit／usage／rate。判じられなければ待たず 0 で抜ける。
  2. 戻る刻：usage.json（二つのうち遅い方）→ 無ければ返事の「resets HH:MM」。どちらも無ければ待たない。24時間の鉤の上限に収まらなければ待たない。
  3. 戻る刻＋2分（REWAKE_GRACE_SEC=120）に stderr へ「使用量の上限が戻りました…続きをしてください。work-note・job-steps・inbox の未処理から続きを始めること」を出し exit 2。
  4. 待つ間に指示（UserPromptSubmit）か手番の閉じ（Stop 等）が来たら、本人が戻ったとして待ちを止める。二重に待たない（rewake-limit.lock）。claude -p では待たない。
- 経過は rewake.log に「[使用量]」の印で残る。

## 作り値の確かめ（偽の置き場・偽の usage.json・猶予1秒）
| 試し | 期待 | 結果 |
|---|---|---|
| A 使用量99%・戻る刻が4秒後 | 約5秒で exit 2＋「続きを」 | **PASS**（5.1秒・exit 2・文面が出た） |
| B 他の誤り・使用量50% | 待たず exit 0 | PASS（0.2秒・「判じられない」） |
| C 待ち始めた後に指示が来る | 止めて exit 0 | PASS（「本人が戻った」） |
| D claude -p | 待たず exit 0・ログなし | PASS |
| E usage.json 無し・返事に resets 11pm | 11pm まで待ち始め、Stop で止まる | PASS |
- 初回は作りの穴で B〜D が別の理由で通っていた（刻を最初に一度だけ取っていた）。刻を走らせるたびに取り直して再実測し、全 PASS。テストは scratchpad（リポジトリ外）。
- 構文検査：rewake-limit.js `node --check` 通過／settings.json は JSON として読め、読み書きの往復で一致。

## まだ確かめられていない所（正直に）
1. **窓が実際に StopFailure の rewake で起きるか**。公式の書きぶりでは StopFailure の出力は無視される扱いなので、asyncRewake が StopFailure で効くかは**実機で止まらないと分からない**。作り値が確かめたのは道具の中身（判じ・待ち・exit 2）だけ。
2. **今の窓には効かない**かもしれない。フックは窓の立ち上げ時に読むので、掛けた後に立つ窓（次は 03:00 の定時以降、または立て直し）から確実。いまの窓は 02:50 のリセットを待つなら**このフックを読んでいない可能性がある**。
3. 効かなかったときの保険は、見張り（常駐）の Esc・send-text 側に残してある。

## 実機で見る所
- 使用量が上限で止まったあと、戻る刻＋2分（5時間枠なら 02:52 ごろ）に、窓が落ちずに「使用量の上限が戻りました」で起きて続きを始めること。rewake.log に `[使用量] 待ちを始めた` → `起こした（exit 2）` が付くこと。付かない（待ちが始まらない）なら StopFailure では asyncRewake が走らないということ。

## 残り
- 実機の確かめ一つ（上記）。orders-open.tsv の未了10件は、本人の裁定どおり触らない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **941件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1119-2315-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1119-2315-2.md) | 11-20 00:01 | 使用量の止まりを rewake で起こす（rewake-limit.js）・台帳照合の取り下げ（2026-11-20 00:10） |
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

<!-- 控えの一覧 ここまで -->
