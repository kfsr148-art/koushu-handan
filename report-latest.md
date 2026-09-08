# 終わりの札-2 の検収と、窓の幅の裁定材料

**作り値は四通りとも通った。実地では、ふつうの道が 6分01秒で札を立て、
立て直しの手は正しく手を出さなかった。**
窓を広げる案は、**単独では空札を増やす**——理由を下に置く。

## ① 作り値（偽の送り手。本物の ntfy・push・commit は叩いていない）

`pipe-check.ps1` の⑨を**字面のまま**抜き出し（本物の L232〜L329・98行）、一時ディレクトリを
`$Root` / `$Repo` に見立て、`$Root` に**偽の `ntfy-say.ps1`**（呼ばれたことと題・本文を控える
だけの物）を置いて回した。

| 場合 | 立った札 | 訴え |
|---|---|---|
| **(a)** 控えあり・札なし | **1枚**　題 `✅ 終わりました（返事不要）：作り値の件-9`<br>本文 `作り値の件-9（…） / 一行目の中身。 / 二行目の続き。`（`実測:` は入らない） | `done-swept`（30分遅れと記録） |
| **(b)** 控えあり・札あり | **0枚**（二重防止が効く） | なし |
| **(c)** 控えが空（**二度回した**） | **0枚** | 一度目 `done-unwritten` ／ **二度目 なし** |
| **(d)** ふつうの道の印（`done-said.txt`）が指している | **0枚** | なし |

＊(c) の二度目が黙るのは、訴えと同時に自分の印（`done-sweep-said.txt`）を書くため。
＊題は控えの `件名` の括弧より前。`種類: 調べた` の回は `🔎 調べました` になる（字面で分岐）。

## ② 実地

**本物の一仕事（終わりの札-2）で、ふつうの道が札を立てた。**

```
20:14:57  stop（hook.log）
20:20:20  鍵 run:2026-09-08 19:58:05 -> done:2026-09-08 20:14:57
20:20:58  ✅ 終わりました（返事不要）｜ 終わりの札-2（終わりの札が立たない根を直す）
```

> **遅れ … 6分01秒**（stop 20:14:57 → 札 20:20:58）。10分の窓に収まったので、
> ふつうの道が拾った。

**そのとき立て直しの手は、正しく手を出さなかった。**

```
done-said.txt        = 2026-09-08 20:14:57   ← ふつうの道の印
done-sweep-said.txt  = 2026-09-08 20:14:57   ← こちらの印（立てずに書いただけ）
pipe-warn.log の done-swept / done-unwritten … 0件
```

**(d) が実地で確かめられた。**

＊**立て直しが実際に札を立てる側は、まだ実地で回っていない。**ふつうの道が10分以内に
　拾ってしまうと、こちらの出番が無いため。出番が来るのは「stop から10分以内に巡回が
　当たらず、かつ次の指示がまだ来ていない」回で、下の分布では**14日で23件（4.8%）**。

## ③ 窓の幅の材料

### 過去14日の遅れの分布

止まり **484件**（5秒以内の重複はまとめた）。遅れは「stop の刻 → 巡回が次に何か書いた刻」。
巡回が黙って終わった回は捕まらないので、**この値は上振れ側**。

| | |
|---|---|
| 中央値 | **0.6分** |
| 25% ／ 75% ／ 90% | 0.2分 ／ 1.3分 ／ **3.5分** |
| 最大 | **230.7分** |

| 超えた幅 | 件数 | 割合 | |
|---|---|---|---|
| **10分** | 23件 | **4.8%** | ← いまの `$FRESH_MIN` |
| **13分** | 20件 | 4.1% | ← 拾い直しの最大遅れ（10分の巡回＋3分の待ち） |
| **20分** | 13件 | 2.7% | |
| **30分** | 11件 | 2.3% | |

**九割は3.5分以内に当たっている。**問題は尾で、しかも尾が長い（最大230分）。

### 窓を広げたときの危険（字面）

`$FRESH_MIN` が効く所は四つ。

```powershell
L1399  $kindFresh = ($kindAge -ne $null -and $kindAge -le $FRESH_MIN)
L1426  if ($stopAge -ne $null -and $stopAge -le $FRESH_MIN -and $afterResume) { $stopPending = $true }
L1742  } elseif ($lastKind -eq 'notification' -and $kindFresh -and …     # ヨシ待ちの枝
L1804  } elseif ((($lastKind -eq 'stop' -and $kindFresh) -or $stopPending) -and $note.outwait … # 外待ちの枝
L1812  } elseif (($lastKind -eq 'stop' -and $kindFresh) -or $stopPending) {                     # 終わりの枝
```

**二重に立てる恐れは無い。**歯止めは年齢ではなく印だから。

```powershell
L1418  if (Test-Path $DoneSaidPath) { $saidStop = … }
L1419  if ($saidStop -ne $lastStopAll) {          ← 既に札にした stop は拾わない
L1424  $afterResume = ([datetime]$lastResumeAll -lt [datetime]$lastStopAll)   ← 次の仕事が始まっていたら拾わない
```

窓を広げても、この二つはそのまま効く。**古い stop を拾い直して二重に立てることは起きない。**

**代わりに、別の危険がある。**

1. **空札が増える。**控えの古さは別の物差しで見ている。
   ```powershell
   L76   $ASK_FRESH_MIN = 10     # 控えが状態行からこれ以上離れていたら、古い問いなので使わない
   L304  $r.stale = ($gap -gt $ASK_FRESH_MIN)
   ```
   `$FRESH_MIN` だけを30分にすると、**10分〜30分の帯**では終わりの枝が通る一方
   `$note.stale` が真になり、控え由来の欄が全部落ちる。出るのは
   **「この回は控えを書いていません」——2026-09-08 01:04 の空札とまったく同じ形**。
   広げるなら `$ASK_FRESH_MIN` も一緒に動かす要がある（＝二つの物差しを同時に触る）。
2. **落ちた回の状態を「いまの状態」として送り直す幅も広がる。**
   `$FRESH_MIN` の但し書き（L75）と落ちどころの注（L1855〜L1863）が、
   まさにそれを避けるために置かれている。窓を30分にすると、**本当に落ちていた30分間**、
   パネルと知らせが古い状態を主張し続ける。
3. **効く先が三つある。**終わりの枝だけでなく、ヨシ待ちの枝（L1742）と外待ちの枝（L1804）も
   同時に広がる。終わりの札のためだけに動かす値ではない。

### 二案の代償

| | 広げる（10分 → 20分／30分） | 拾い直しで足りるとする（いまの形） |
|---|---|---|
| 救える範囲 | 23件のうち **20分で10件・30分で12件**。尾（最大230分）には届かない | **年齢の上限が無い**ので、230分の回も拾う |
| 取りこぼす形 | 30分を超える 11件（2.3%）は結局落ちる | **次の指示が先に来た回**は落ちる（`resume` が `stop` より後で降りるため） |
| 札の遅れ | ふつうの道のまま（0〜30分） | **最大13分**（10分の巡回＋3分の待ち） |
| 副作用 | **空札が増える**（`$ASK_FRESH_MIN` を同時に動かさない限り）／ヨシ待ち・外待ちの枝も一緒に広がる／落ちた回の状態を最大30分主張する | 札が `ntfy-say` の口から出るので**60秒の束ね**に乗る（他の知らせと「🔔 まとめて N件」に混ざる） |
| 触る所 | `watch-notify.ps1` の定数（＝知らせが止まる要） | 触らない（既に入れた⑨だけ） |

### 判断材料（数で見ると）

- **広げる案は、費用の割に取り分が小さい。**30分まで広げても救えるのは 23件中12件で、
  代わりに「空札」「落ちた回の主張」「三つの枝が同時に広がる」を引き受ける。
- **拾い直しは、尾に強い。**年齢の上限が無いので 230分の回も拾える。
  代償は「最大13分の遅れ」と「次の指示が先に来た回は落ちる」の二つ。
- **二つは排他ではない。**拾い直しの唯一の穴（次の指示が先に来た回）は、
  窓を広げても塞がらない——`$afterResume` が同じ理由で降りるため。
  **つまり窓を広げても、拾い直しの穴は埋まらない。**

＊**この裁定はこちらでは決めない。**直しは入れていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **174件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`終わりの札-2の検収.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2%E3%81%AE%E6%A4%9C%E5%8F%8E.md) | 09-08 20:28 | 終わりの札-2 の検収と、窓の幅の裁定材料 |
| [`終わりの札-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2.md) | 09-08 20:03 | 終わりの札-2 — 終わりの札が立たない根を直す |
| [`止まりの見分け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AD%A2%E3%81%BE%E3%82%8A%E3%81%AE%E8%A6%8B%E5%88%86%E3%81%91-1.md) | 09-08 19:03 | 止まりの見分け-1 — 生存が書かれないのに「作業中」が延び続ける件 |
| [`猫の矛盾-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E7%9F%9B%E7%9B%BE-1.md) | 09-08 11:18 | 猫の矛盾-1 — 走っているのに頭の猫が寝ている件 |
| [`終わりの札-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-1.md) | 09-08 09:40 | 終わりの札-1 — 終わった知らせが手元に残らない件 |
| [`検査の重さ-1の調べ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9-3.md) | 09-08 07:57 | 検査の重さ-1 の調べ — 四つの数と、削れそうな所 |
| [`検査の重さ-1の調べ-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9-2.md) | 09-08 07:12 | 検査の重さ-1 の調べ（出し直し）— 21視野のフル版 一回の内訳 |
| [`黒猫の待機-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-2.md) | 09-08 06:25 | 黒猫の待機-2 — ヨシ待ちの猫が地に沈む件 |
| [`検査の重さ-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-08 00:50 | 検査の重さ-1 の調べ — 21視野の一回に、何がどれだけ掛かっているか |
| [`配牌の目安-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%85%8D%E7%89%8C%E3%81%AE%E7%9B%AE%E5%AE%89-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:18 | 配牌の目安-1 の調べ — 13枚から何を持っているか |
| [`押し引き表-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8A%BC%E3%81%97%E5%BC%95%E3%81%8D%E8%A1%A8-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:15 | 押し引き表-1 の調べ — 判定盤が持っている物・持っていない物 |
| [`最後に受けた枠の撤去-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%80%E5%BE%8C%E3%81%AB%E5%8F%97%E3%81%91%E3%81%9F%E6%9E%A0%E3%81%AE%E6%92%A4%E5%8E%BB-1.md) | 09-06 14:48 | 最後に受けた枠の撤去-1 — パネルからその一行を外した |
| [`帯の中の走り出し-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1-2.md) | 09-06 13:51 | 帯の中の走り出し-1（実地）— 帯が明けた一回で、一本だけ鳴った |
| [`帯の中の試し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%A9%A6%E3%81%97.md) | 09-06 13:24 | 帯の中の試し |
| [`訴えの記録-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A8%98%E9%8C%B2-1.md) | 09-06 12:58 | 訴えの記録-1 — 記録も、種類ごとに一行だけ |
| [`訴えの見直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97-1.md) | 09-06 12:53 | 訴えの見直し-1 — 退避が受けている間は、上限を訴えない |
| [`訴えの数え方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E6%95%B0%E3%81%88%E6%96%B9-1.md) | 09-06 12:48 | 訴えの数え方-1 — 定時の「訴え: N件」を、種類の数にした |
| [`訴えの内訳-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E5%86%85%E8%A8%B3-1.md) | 09-06 12:25 | 訴えの内訳-1 — 31件は何を言っているか（数えただけ） |
| [`帯の中の押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-06 08:43 | 帯の中の押し-1 — 帯の前に押し、帯の間も押しだけは通す |
| [`過去の札の件数-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%81%8E%E5%8E%BB%E3%81%AE%E6%9C%AD%E3%81%AE%E4%BB%B6%E6%95%B0-1.md) | 09-06 03:22 | 過去の札の件数-1 — 「🗄 過去の札」の見出しに件数を出した |

<!-- 控えの一覧 ここまで -->
