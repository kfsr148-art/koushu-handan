# 予定表の Claude* は13件すべて在った（入れ直さず）

**終わり（残り1件）** — 2026-09-22 10:47（VAIO）。控えの xml からの入れ直しは**行っていない**。予定表の Claude* は13件すべて登録されたまま生きており、入れ直すと現状を壊す側になるため。

## 1. 入っている件数と各件の状態

**13件**（`Get-ScheduledTask -TaskName 'Claude*'`）。

| 予定 | 状態 | 直近の走り | 次の走り | 結果 |
|---|---|---|---|---|
| ClaudeAfterReboot | Ready | 09-22 03:10:10 | 09-22 15:10:10 | **1** |
| ClaudeBoard | Ready | 09-22 10:40:40 | 09-22 10:50:50 | 0 |
| ClaudeCodeAtLogon | Ready | 09-22 08:24:24 | （サインイン時） | 0 |
| ClaudeDailyNotice | Ready | 09-22 09:00:00 | 09-22 21:00:00 | 0 |
| ClaudeDailyReboot | Ready | 09-22 04:30:30 | 09-22 15:00:00 | 0 |
| ClaudeEdgeSweep | Ready | 09-22 03:00:00 | 09-23 03:00:00 | 0 |
| ClaudeHomeBackup | Ready | 09-22 03:30:30 | 09-23 03:30:30 | 0 |
| ClaudeHookHeartbeat | Ready | 09-22 10:38:38 | 09-22 10:48:48 | 0 |
| ClaudeJamWatch | Ready | 09-22 10:46:46 | 09-22 10:47:47 | 0 |
| ClaudePipeCheck | Ready | 09-22 10:40:40 | 09-22 10:50:50 | 0 |
| ClaudeRevive | **Running** | 09-22 10:46:46 | 09-22 10:47:47 | 0 |
| ClaudeSweepChecks | **Disabled** | 09-21 22:31:31 | 09-22 10:51:51 | 0 |
| ClaudeWatchNotify | Ready | 09-22 10:45:45 | 09-22 10:47:47 | 0 |

Ready 11・Running 1・Disabled 1。`ClaudeRevive` の Running は毎分の走りの最中で、正常。
`ClaudeSweepChecks` の Disabled は **2026-09-21 22:31 に引き算の回で意図して無効にした物**で、直すところではない。
`ClaudeAfterReboot` だけ結果 1 だが、これは再起動直後に走って「起こす物が無い」で返る形。

## 2. なぜ入れ直さなかったか

**① 13件とも生きていて、入れ直す先が無い。**

**② 入れ直すと現状を二箇所壊す。**
- `ClaudeSweepChecks.xml` から入れ直すと、昨夜わざと無効にした物が**有効に戻る**
- 控えにあるのは `ClaudeWeeklyReboot.xml`。生きている側は `ClaudeDailyReboot` で、名が違う。入れ直せば**使われていない予定が1件増える**（控えの13件と生きている13件の違いはこの1件だけ）

**③ 走りの記録が消える。** `Register-ScheduledTask` で入れ直すと `LastRunTime` が落ちる。いまは登録が途切れていない証拠として使えている（下記）。

## 3. 0件は一時の読み取り失敗（一行）

**予定は一度も消えていない。** `ClaudeEdgeSweep` 03:00:00／`ClaudeHomeBackup` 03:30:30／`ClaudeAfterReboot` 03:10:10 の走りが**そのまま残っている**——登録が消えていれば、この刻も一緒に消える。04:30 の再起動より前の刻が残っているので、消えたのは登録ではなく**その時の問い合わせの答え**だった。
＊原因の掘り下げは指示どおり行っていない。

## 4. 見張りと公開側が動いていることの実測

- 公開側 `state.json` … 10:46:18 更新・`at=1790041576`
- `watch-step.txt` … 10:46:20 更新
- 毎分の三つ（`ClaudeJamWatch`／`ClaudeRevive`／`ClaudeWatchNotify`）が 10:45〜10:46 に走っている

いずれも問い合わせの1分以内。**見張りは止まっていない。**

## 5. 選ばなかった案

**控えの xml から強いて入れ直す。** やるなら `ClaudeSweepChecks.xml` を除き、`ClaudeWeeklyReboot.xml` も入れずに11件だけを当てる形になる。いまは要らないと判じたので当てていない。要るなら言ってください。

## 残り

1. `2026-09-22 00:40:39` ヨシ待ちを「ヨシしない・取り下げ」で閉じた回に、終わりの札が立たず鈴も鳴らなかった件（未了：受領／時間切れ）

**本体（`koushu-handan.html`）には触っていない。** 予定表にも書き込みをしていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **378件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0922-1047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1047.md) | 09-22 10:49 | 予定表の Claude* は13件すべて在った（入れ直さず） |
| [`r0922-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0922-0430-2.md) | 09-22 04:30 | 再起動-2（r0922-0430・後の測り） |
| [`y0922-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-0015.md) | 09-22 00:09 | 戻しは取り下げ。三つは当てたまま |
| [`y0921-2305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2305.md) | 09-21 23:32 | 管理者の窓で一度走らせれば三つ当たる綴り |
| [`y0921-2258.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2258.md) | 09-21 22:58 | hook の数え（末尾3000行）と、Google の予定 |
| [`y0921-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2140.md) | 09-21 21:57 | 黒い窓の巻き戻しを 9001行 → 500行 に |
| [`y0921-2135.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2135.md) | 09-21 21:50 | 盤の健康・熱・画面バッファの調べ／昇格の問いは閉じられた |
| [`y0921-2128.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2128.md) | 09-21 21:28 | 足跡の合図と、手待ちの畳み／pagefile は**手が要る** |
| [`y0921-2120.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2120.md) | 09-21 21:22 | Edge の置き去りを閉じた（+210MB）／SysMain は**手が要る** |
| [`y0921-2110.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2110.md) | 09-21 21:08 | 押しの敷居を 400MB へ／機械に乗っている物の調べ |
| [`y0921-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2050.md) | 09-21 20:50 | 落ちにくい窓（三つ）／枠の上限を刻ひとつに |
| [`y0921-2012.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2012.md) | 09-21 20:12 | 考え込み中は触らない（CPU で振り分け）／定時の札に起こし直しの数 |
| [`y0921-1957.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1957.md) | 09-21 19:57 | 使用量の上限で手待ちにする（乙で実装） |
| [`y0921-1936.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1936.md) | 09-21 19:37 | 固まりの判じ方を足跡へ／手待ちで重い窓を立て直す |
| [`y0921-1925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1925.md) | 09-21 19:23 | 使用量の鈴の鍵を **10分の桁**へ（最も近い側へ丸める） |
| [`y0921-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1915.md) | 09-21 19:13 | 綴りを退避して **171.4MB → 4.6MB**／台帳の未了 **0件** |
| [`y0921-1805b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805b.md) | 09-21 18:35 | 未了4項目を一行ずつ／枠の上限の結果／使用量の鈴の丸め |
| [`y0921-1755.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1755.md) | 09-21 17:55 | 雲へ重い仕事を回す道 — **通った** |
| [`cloud-kumo-tameshi-20260921-085123.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-kumo-tameshi-20260921-085123.md) | 09-21 17:53 | 雲で回した：`kumo-tameshi.js` |
| [`y0921-1805.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805.md) | 09-21 17:47 | 枠の上限 — 8分を超え、かつ空きが400MBを割ったら仕事を切る |

<!-- 控えの一覧 ここまで -->
