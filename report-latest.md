# 追報：25分の底が効いた（14:04:30・中身が同じまま押した）

**終わり（残り1件）** — 2026-09-22 14:08（VAIO）。前報（[`y0922-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1330.md)）で入れた底が、**実際に効く回を捉えた**。

## 1. 捉えた形

`inbox-watch.log` の状態の行は、13:34 から14:05 のあいだ**二行しかない**。

```
13:34:20  状態を書き出した（前の押しから 162秒。3分あけるので押さない）：手待ち / state-stale の繰り返しを止める
14:04:30  状態を書き出して押した：手待ち / state-stale の繰り返しを止める
```

**この二行の間が 30分10秒 空いているのが、そのまま証しになっている。**

`inbox-watch.ps1` の状態書き出しは、頭に**もう一段の関門**がある。

```powershell
if ($line -eq $script:lastStat -and ($now - $script:lastStatAt) -lt $PULSE_SEC) { return }   # $PULSE_SEC = 1800（30分）
```

**中身が変わらない限り、30分に一度しか中へ入らない。** 13:34:20 の次が 14:04:30 ちょうどだったということは、**その30分のあいだ `$line` が一度も変わっていない**＝14:04:30 に入った回も**中身は前と同じ**だったということ。

その回が「**状態を書き出して押した**」で終わっている。**古い綴りなら、ここは必ず「中身が前と同じなので押さない」だった。**
押したのは新しい底（前の押し 13:31:41 から 1969秒 ≧ 1500秒）が通したから。

## 2. 公開側の実読み

| 刻 | 公開側の `at` | 人の刻 |
|---|---|---|
| 13:26:08 | 1790051003 | 13:23:23 |
| 13:27:23 | 1790051184 | 13:26:24 |
| **14:07:46** | **1790053467** | **14:04:27** |

commit も `14:04:27 ad51504d` で残っている。**`13:30 以降、`pipe-warn.log` に `state-stale` は一度も立っていない。**

## 3. これから先の見え方

手待ちが続くと、押しは**30分ごと**（上の `$PULSE_SEC`）に落ち着く。`at` の古さは最大でも31分ほどで、`state-stale` の敷居45分（`pipe-check.ps1` の `$STATE_STALE_MIN`）に届かない。**06:30・07:20・10:00・12:40 のような繰り返しは、これで出なくなる。**

＊三つの値は**対で決まる**。`$PULSE_SEC`（30分）＜ `$PUSH_ALIVE_SEC`（25分）は底として機能し、その両方が `$STATE_STALE_MIN`（45分）より短い。**どれか一つだけを動かさないこと。**

## 残り

1. `2026-09-22 00:40:39` ヨシ待ちを「ヨシしない・取り下げ」で閉じた回に、終わりの札が立たず鈴も鳴らなかった件（未了：受領／時間切れ）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **381件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0921-1957.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1957.md) | 09-21 19:57 | 使用量の上限で手待ちにする（乙で実装） |
| [`y0921-1936.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1936.md) | 09-21 19:37 | 固まりの判じ方を足跡へ／手待ちで重い窓を立て直す |
| [`y0921-1925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1925.md) | 09-21 19:23 | 使用量の鈴の鍵を **10分の桁**へ（最も近い側へ丸める） |
| [`y0921-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1915.md) | 09-21 19:13 | 綴りを退避して **171.4MB → 4.6MB**／台帳の未了 **0件** |
| [`y0921-1805b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805b.md) | 09-21 18:35 | 未了4項目を一行ずつ／枠の上限の結果／使用量の鈴の丸め |

<!-- 控えの一覧 ここまで -->
