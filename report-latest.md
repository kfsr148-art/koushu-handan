# 入口の固まり-2 — 入口が重かったのは「足跡の帳面を毎段まるごと読む」から

**状態** … 終わり／**巡回の作りには触っていない**（外から帳面を小さくしただけ）

## ① 入口〜控えを読む段が読むファイル

| ファイル | いま | 何のために |
|---|---|---|
| `watch-step.txt` | 348バイト・7行 | 前の回がどの段で終わったか |
| **`watch-step-log.txt`** | **355KB・7486行** | 足跡の積み上げ |
| `hook.log` | 743KB・7468行 | 位相の鍵（**末尾しか読まない**） |
| `work-note.txt` | 2.2KB・25行 | 控え |
| `work-started.txt` ／ `last-order.txt` ／ `done-said.txt` | 各100バイト前後 | 開始の時計・枠・終わりの印 |

**入口で丸ごと読んでいるのは `watch-step-log.txt` だけ。**しかも読むのは一度ではない。

```
function Step … 段を刻むたびに
  Add-Content $StepLog $line
  $lg = @(Get-Content -LiteralPath $StepLog)     ← **丸ごと読む**
  if ($lg.Count -gt ($STEPLOG_KEEP + 500)) { 刈る }
```

**段は八つ。つまり一巡回で八度、355KB を読み直していた。**
`$STEPLOG_KEEP = 7000` なので、帳面は 7000〜7500行で**居座り続ける**（刈られない）。

実測 … 一度読むのに **113ms**。八度で **904ms**。入口の一段だけで一秒近くを使う。

## ② 9/5 夕方以降に足した物のうち、入口で読まれる物 — **無い**

訴えの控え（`pipe-warn.log`）・退避・関門の控え（`heavy-*`）は、**どれも入口では読んでいない**。

- `pipe-check.ps1` は**巡回とは別に走る**（巡回からは呼んでいない）
- 関門（`heavy-gate.ps1`）が読むのは `heavy.txt` と `last-order.txt` だけで、**巡回の外**
- 巡回の台本そのものは **09-04 12:17 が最後の書き替え**。9/5 以降**一字も足していない**

**つまり、重くなったのは足した物のせいではない。**帳面が上限（7000行）まで育ちきり、
そこへ夜の重い仕事（検査・押し）が重なって、八度の読みが上限を食い破った。

## ③ 直した形 — 帳面を外から小さく保つ

`heavy-beat.ps1`（10分ごとに走る、こちらの手）に**刈り取り**を足した。

- `watch-step-log.txt` が 1000行を超えたら、**新しい800行だけ残す**
- 刈った分は捨てず `watch-step-log.old.txt` へ送る（後から辿れる）。送り先も20000行で頭打ち
- **巡回の作りは一字も変えていない。**帳面が小さくなれば、同じ読みがそのまま軽くなる

**効き目（実測）**

```
帳面        7486行/355KB → 800行/38KB
一度読む    113ms → 8ms
八度ぶん    904ms → 64ms      （14分の1）
```

## ④ 実地 — 次の巡回三回

```
01:25:15  入口〜控えを読んだ … 4.3秒   開始+0 ／ 窓とプロセス+3.6 ／ hook+0.4 ／ 控え+0.3
01:26:03  入口〜控えを読んだ … 1.3秒   開始+0 ／ 窓とプロセス+0.9 ／ hook+0.2 ／ 控え+0.2
01:26:19  入口〜控えを読んだ … 1.7秒   開始+0 ／ 窓とプロセス+0.9 ／ hook+0.4 ／ 控え+0.4
```

**三回とも5秒以内。**一巡回そのものも6秒で終わっている。

＊残る重さは「窓とプロセスを数えた」の段（0.9〜3.6秒）。ここは `Get-CimInstance` の値で、
　帳面とは別の話。**いまは上限（PT10M）に対して十分に軽い。**

## ⑤ 固まりの現場（jam-snap.log）

**今夜の分は撮れていない。**`jam-watch.ps1` は「最後の段が完了でなく90秒より古い」ときに撮るが、
今夜の固まりは**巡回が丸ごと起きていない**形（予定表が 322 で捨てる）だったため、
足跡の最後の行は「完了」のままで、条件に当たらなかった。

＊撮れるようにするには jam-watch の判じ方を変える要がある（**巡回の判定ではない**が、
　今回の枠の外なので手を付けていない）。

## ついでに入れた一つ（通知の出口-1 ②の分）

枠が差し替わる前に `ntfy-say.ps1` へ入れた**題の関門**は、そのまま残してある。

> 題が空の送りは拒まず、**呼び出し元の名を題に入れて送る**（`終わりました：〈呼び出し元〉`）。
> 黙って落とすと、送ろうとした事実ごと消えるため。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **149件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`入口の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%A5%E5%8F%A3%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-06 01:27 | 入口の固まり-2 — 入口が重かったのは「足跡の帳面を毎段まるごと読む」から |
| [`地図の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%B0%E5%9B%B3%E3%81%AE%E7%A9%B4-1.md) | 09-06 00:48 | 地図の穴-1 — 八段それぞれの「読む物が壊れたとき」 |
| [`作り値の送り先-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%9C%E3%82%8A%E5%80%A4%E3%81%AE%E9%80%81%E3%82%8A%E5%85%88-1.md) | 09-06 00:34 | 作り値の送り先-1 — 作り値は偽の送り手へ。今夜の分は回し直した |
| [`見張りの地図.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E5%9C%B0%E5%9B%B3.md) | 09-06 00:34 | 見張りの地図 — `watch-notify.ps1` の巡回を、段ごとに開く |
| [`帯の中の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 09-06 00:17 | 帯の中の走り出し-1 — 帯をまたいだ走り出しを、関門が持って鳴らす |
| [`走り出しの黙り-3-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3-2.md) | 09-06 00:14 | 走り出しの黙り-3（差し替え版）— 9月1日の直しは残っている。弾いていたのは手前の二つ |
| [`走り出しの黙り-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3.md) | 09-06 00:06 | 走り出しの黙り-3 — 弾いていたのは見込みではなく「開始の時計」 |
| [`先の穴-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-2.md) | 09-05 23:15 | 先の穴-2 — 押し出した札を残し、件名を機械が書き、訴えを画面に出す |
| [`先の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-1.md) | 09-05 22:30 | 先の穴-1 — 生存を関門の外へ、訴えをその場で鳴らす |
| [`根の試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A0%B9%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-05 21:57 | 根の試験-1 — 本物の pre-push を一回通して、直りを見届けた |
| [`残りの根-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AE%8B%E3%82%8A%E3%81%AE%E6%A0%B9-1.md) | 09-05 21:22 | 残りの根-1 — 今日止めた分をまとめて直した |
| [`帯の漏れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E6%BC%8F%E3%82%8C-1.md) | 09-05 20:53 | 帯の漏れ-1 — 重い帯を pre-push 自身に持たせた |
| [`飽和の回避-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1-2.md) | 09-05 18:23 | 飽和の回避-1（追補）— 札を立て直した／控えが空だった理由 |
| [`飽和の回避-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1.md) | 09-05 16:29 | 飽和の回避-1 — 重い帯だけ、起こしを間引く |
| [`連携の改善-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E6%94%B9%E5%96%84-1.md) | 09-05 14:33 | 連携の改善-1 — 止めた5件を外から見る手で近づけ、訴えを定時へ乗せた |
| [`札の上限-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E4%B8%8A%E9%99%90-1.md) | 09-05 12:51 | 札の上限-1／手押しの錠-1 — 枚数を増やし、手押しも同じ錠を通した |
| [`連携の弱い所-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E5%BC%B1%E3%81%84%E6%89%80-1.md) | 09-05 09:48 | 連携の弱い所-1 — 黙って壊れる所を洗い、外から見る手を立てた |
| [`機械の詰まり-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1-2.md) | 09-05 09:37 | 機械の詰まり-1（数え）— 夜は明確に減った。残っているのは**こちらが検査を回している帯** |
| [`矛盾の三つ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%9B%E7%9B%BE%E3%81%AE%E4%B8%89%E3%81%A4-1.md) | 09-04 12:31 | 矛盾の三つ-1 — 三つとも「材料を読む所」がずれていた |
| [`見張りの×-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%C3%97-1.md) | 09-04 10:09 | 見張りの×-1 — 「×2147946720」は死んでいた印ではなく、**その一分の起こしを見送った印** |

<!-- 控えの一覧 ここまで -->
