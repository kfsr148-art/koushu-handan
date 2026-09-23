# 台帳の寄せ・取り下げの札・片付け×止の元（r0923-1033）

**終わり（残り1件）** — 2026-09-23（VAIO）。本体には触っていない。

① **寄せた** — `2026-09-22 21:47:14`（予定四件の状態）は `19:30:40` の1と同じ調べなので、取り下げ済にして 19:30:40 へ寄せた。残した 19:30:40 の1は y0922-2155 で「消えるだけ」と答え済み。2（見送り3/3で落とさず次の定時へ回す）は**未実装**で、`daily-reboot.ps1` は 09-21 17:01 のまま「打ち止めで落とす」形。

② **入っていなかったので入れた** — 「取り下げ」の字は見張り一式のどこにも無かった。09-22 00:12 の記録では、取り下げの回の札は 👀 で立ち、印も理由も無く、00:26 に 😸（走り出し）の題で束ねて押されていた。
- `inbox-feed.ps1` … `Take-Withdraw`：「`<印>` はヨシしない／取り下げ」で、その印が `yoshi-open.tsv` に開いていれば落とし、`yoshi-withdrawn.txt` へ控える
- `watch-notify.ps1` … 終わりの枝で控えを読み、題を ✅ に揃えて **印・取り下げた理由・いまの姿** を載せる。`Flush-Quick` で束ねても、題と重みは取り下げの札が持つ。出したら控えを消す（6時間より古い控えは捨てる）

| 作り値 | 結果 |
|---|---|
| ヨシで進めた回 | 札1本・👀・印なし（今までどおり） |
| 取り下げた回 | 札1本・**✅**・名乗り done（押しの道）・印/理由/いまの姿あり・一覧 1→0件・控え消える |
| 待ちが無い回 | 止まり無し→0本／止まり有り→1本（👀・印なし）＝取り下げの札は立たない |

③ **片付け×止の元** — `ClaudeSweepChecks` は 09-21 22:31 の引き算の回（y0921-2258）で**わざと Disabled** にした物。役目は常駐の `Sweep-Stale`（2分ごと）と丸ごと重なる。朝の札 `daily-notice.ps1` は予定の状態だけで判じていたので、止めた日から毎回「片付け×止」と出していた。**予定が無効なら常駐の本数で判じる**形に直した。`-DryRun` の行＝`見張り: 生存○ 見張り○ 片付け○ 受信箱○`。
- 選んだ理由：予定を Enabled に戻すと、決めて外した重なりが戻る
- 選ばなかった案：予定を Enabled に戻す

④ **台帳の未了 = 1件**
1. 2026-09-22 19:30:40 の2 — 定時再起動の見送り3/3で落とさず、次の定時へ回す（未実装）

**回る段（作法36）** — 手元：`inbox-feed.ps1`（フックごと）・`watch-notify.ps1`（毎分）・`daily-notice.ps1`（09:00／21:00）が変わる。常駐 `inbox-watch.ps1` には触っていないので起こし直しは不要。雲：`check.yml`・`check-all` は触らず変化なし。

構文 NG 0（3本とも）・BOM 保持・写し各 `.bak-20260923`。watch-notify 3573→3622行／inbox-feed 344→374行／daily-notice 283→290行。

**未検収** — 次に取り下げで閉じた回に、✅ の札が印つきで立って鳴ること（人手待ち）。

---

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **386件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0923-1033.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-1033.md) | 09-23 10:44 | 台帳の寄せ・取り下げの札・片付け×止の元（r0923-1033） |
| [`r0923-0646.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-0646.md) | 09-23 06:52 | 再起動直後の固まり誤鳴りを止めた（r0923-0646） |
| [`r0923-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-0430-2.md) | 09-23 04:30 | 再起動-2（r0923-0430・後の測り） |
| [`y0922-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-2155.md) | 09-22 21:55 | 予定四件の悪い結果は「消えるだけ」（y0922-2155） |
| [`r0922-1630-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0922-1630-2.md) | 09-22 16:30 | 再起動-2（r0922-1630・後の測り） |
| [`y0922-1330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1330-2.md) | 09-22 14:08 | 追報：25分の底が効いた（14:04:30・中身が同じまま押した） |
| [`y0922-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1330.md) | 09-22 13:29 | state-stale の繰り返しは「押しの間引き」が元。25分の底を足した |
| [`y0922-1113.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1113.md) | 09-22 11:14 | 0件の元は「見出しの言語」。数え方を Get-ScheduledTask へ替えた |
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

<!-- 控えの一覧 ここまで -->
