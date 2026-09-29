# 同じ枠の二度落としを塞いだ・落とす前の起き上がり札・偽の鈴9通（r0929-1427）

**終わり（残り0件）** — 2026-09-29 14:25ごろ（VAIO）。本体には触っていない。

## 1. 同じ枠で二度落とす穴 … 塞いだ
- **実際に二度落ちていた：**09-29 03:33 に落とした後、**04:30:03 に同じ枠（2026-09-29 03）で「三つとも空」→ 04:31:06 にもう一度 shutdown**（claude は 2.1.283→2.1.284 に上がった）
- 直し（~/.claude/daily-reboot.ps1）：落とす前（「三つとも空。落とす」の直後・前の測りより前）に **reboot-done-<枠>.txt**（例 reboot-done-2026-09-29-15.txt）へ刻を書く。回の頭で同じ枠の印があれば「この枠は落とし済み（刻）。何もしない」と一行書いて返る。二日より古い印は消す
- 作り値（-Root を scratchpad・shutdown／claude update／押し送りは偽物）
  | 場合 | 結果 |
  |---|---|
  | 枠 2026-09-29 15 の一度目 | **落とす**（偽の shutdown が1回） |
  | 同じ枠の二度目 | **何もしない**（「この枠（2026-09-29 15）は落とし済み」） |
  | 次の枠 2026-09-30 03 | **落とす**（累計2回） |
- 本物の ~/.claude には印を作っていない。**最初に効くのは今日 15:00 の枠**

## 2. 落とす前の起き上がり札 … 一行と直し
- **一行：**daily-reboot が reboot-pending.txt を書いてから claude update（180秒まで）と shutdown の60秒を待つ間に、2分おきの watch-notify が印を見て「起き上がった後」と読み、落とす前の値で札を書いて印を消していた（09-29 03:31:35 と 04:30:11 の二回）
- 直し（~/.claude/watch-notify.ps1）：印があるときだけ起動の刻（LastBootUpTime）を一度読み、**起動が印の at= より後のときだけ**札を書く。前なら「まだ書かない（…まだ落ちていない）」と記録だけ
- 作り値：印の1分後・起動は昨日 → **書かない**／起動が印より後 → **書く**

## 3. 偽の鈴 9通（09-28 13:30〜09-29 04:12。r0929-0412 と同じ）
| 刻 | 題 | 訳 |
|---|---|---|
| 09-28 13:38 | 🪟 異常です（手が要ります） | 生存の刻を退避先の四日前（09-24 19:18:37）と読んだ（5419分）。20:03 に直した |
| 13:54 | 🪟 時間切れ（再挑戦 1/3） | 命令が返り続けていた枠を前の「開始から8分」で切った。18:05 に切り方を直した |
| 14:48 | 🕒 延びています（14:50 に 🙀 の押し） | 上で切った枠の終了予定が過ぎただけ |
| 16:55 | 🪟 異常です：再起動の後の点検 | 静かな帯の漏れ（after-reboot が帯を見ていなかった）。17:50 に直した |
| 16:58 | 🪟 異常です（手が要ります） | 静かな帯の漏れ（stale の本編の札が素通り）。17:50 に直した |
| 17:50 | 🪟 異常です（連携に訴え：clock-broken・pub-late） | 10分で自然に戻った（18:00 ✅） |
| 19:20 | 🙋 ヨシしてください | 断片の続き待ちを「待ち:」に書いたので立った。取り下げ |
| 19:34 | 🪟 異常です（手が要ります） | 生存の刻を四日前と読んだ（5776分）。20:03 に直した |
| 23:01 | 📮 郵便受けが詰まっています | 最後の読み 22:56:18。3分で解けた（23:04） |
- ＊04:12 以降 09:00 までの分は、04:30 の二度目の再起動の帯（04:31〜）を含めて数えていない

## ファイル
- ~/.claude/daily-reboot.ps1（写し .bak-20260929）／~/.claude/watch-notify.ps1（写し .bak-20260929）。構文0件ずつ。どちらも予定表から毎回起こされるので起こし直しは要らない

## 実機
- 画面に出る物は無し。**今日 15:00 の枠で落ちたら、16:00・16:30 の回の reboot.log に「この枠（2026-09-29 15）は落とし済み」が出て二度目が無いこと／起き上がった後の札が起動の後に一枚だけ立つこと**（人手待ち）

## 残り
- 0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **468件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0929-1427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1427.md) | 09-29 14:25 | 同じ枠の二度落としを塞いだ・落とす前の起き上がり札・偽の鈴9通（r0929-1427） |
| [`r0929-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0430-2.md) | 09-29 04:30 | 再起動-2（r0929-0430・後の測り） |
| [`r0929-0412.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0412.md) | 09-29 04:10 | 夜の鈴の棚卸し（09-28 13:30〜09-29 04:10）（r0929-0412） |
| [`r0929-0330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0330-2.md) | 09-29 03:30 | 再起動-2（r0929-0330・後の測り） |
| [`r0928-2003.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2003.md) | 09-28 19:59 | 「見張りの生存記録が N 分途切れています」の偽（5419分・5776分）を直した（r0928-2003） |
| [`r0928-2005.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2005.md) | 09-28 19:42 | map-3 の未特定・様子見の五行の元を当て直した（r0928-2005） |
| [`r0928-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1945.md) | 09-28 19:38 | 仮置き・未実装の印と、欠けた絵・音の洗い出し（r0928-1945） |
| [`r0928-1922.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1922.md) | 09-28 19:17 | map-2 の要確認（三つ目）：heavy-skip・記録の順・My First Check・使わない台本（r0928-1922） |
| [`map-1-parts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-1-parts.md) | 09-28 19:16 | 連携で動いている物の一覧（map-1） |
| [`r0928-1912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1912.md) | 09-28 19:12 | map-2 の要確認（二つ目）：#49・#50・#44 を作り値で確かめて直した（r0928-1912） |
| [`r0928-1901.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1901.md) | 09-28 19:01 | map-2 の要確認（一つ目）：#16・#19・#35 を作り値で確かめて直した（r0928-1901） |
| [`r0928-1807.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1807.md) | 09-28 18:07 | Check-FrameLimit の切り方を「固まり」と「長すぎ」に（r0928-1807） |
| [`r0928-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1756.md) | 09-28 18:07 | 読むだけ：pathspec の枠・控えの預けの枠・今の予定（r0928-1756） |
| [`r0928-1750.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1750.md) | 09-28 17:48 | 静かな帯の漏れ二通を塞いだ（r0928-1750） |
| [`r0928-1656-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1656-2.md) | 09-28 16:56 | 再起動-2（r0928-1656・後の測り） |
| [`r0928-1654-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1654-2.md) | 09-28 16:54 | 再起動-2（r0928-1654・後の測り） |
| [`r0928-1620.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1620.md) | 09-28 16:11 | notices の押しの pathspec の落ちの元と直し（r0928-1620） |
| [`r0928-1611.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1611.md) | 09-28 16:08 | 使用量の HTTP 401 の元と直し（r0928-1611） |
| [`r0928-1606.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1606.md) | 09-28 16:07 | 台帳の「三つ目と四つ目」を済へ・残りを二枠に割った（r0928-1606） |
| [`r0928-1349.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1349.md) | 09-28 13:49 | 控えの預け（ClaudeHomeBackup）を 05:00 へ・落ちたら一通（r0928-1349） |

<!-- 控えの一覧 ここまで -->
