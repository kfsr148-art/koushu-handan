# 止まりの見分け-1 — 生存が書かれないのに「作業中」が延び続ける件

**止まっていたのは書き出しではなく、公開への運び（push）。**
`.git/index.lock` が6時間居座り、自動押しを全部弾いていた。
パネルの側は、凍った値を「作業中」と読み続ける作りになっていた。

## ① 根の実測

### 公開側と手元の食い違い

| | at | 中身 |
|---|---|---|
| **公開側** `state.json` | **11:21:11**（測定 17:58 時点で **397分＝6時間37分前**） | stat 作業中／startedAt 10:33:50 で凍結 |
| 手元 `state.json` | 17:42（30分ごとに更新） | stat 手待ち |

常駐（`inbox-watch.ps1`）は 11:05／11:22／12:13 …16:42／17:12／17:42 と書けており、
生存の刻も 11:00〜18:00 で **45件**ある。**見張りも常駐も落ちていない。**

### 止まった理由（四つのうちどれか）

> **「前の回の居座り」。**11:21:29 の `b91b909` を最後に、以後の自動押しが 11:21:59 から
> 時間切れ（20秒／30秒）で切られ続け、**12:12 に残った `.git/index.lock`（0バイト）**が、
> それ以降すべての押しを「終了コード128 `Unable to create index.lock`」で弾き続けた。

- **帯ではない** … `heavy-skip.log` の 11:00〜17:30 は 11:13／11:21／11:23 の**3行だけ**
- **上限ではない** … 見張りの上限は 11:23:50 に PT10M へ戻っている
- **見張りの落ちではない** … 巡回の足跡は 11:00〜17:30 に**127回の「完了」**が残っている

＊置き去りの錠は 6時間前・0バイト・走っている git 無しだったので外した
　（写しを scratchpad へ取ってある）。外したら `git` が動いた。

### ② 11:21 以降、猫の矛盾-1 は走っていたか

**終わっていた。**11:21 に納品と報告を出し、以後この仕事は走っていない。

```
12:41:04  鍵 run:2026-09-08 10:15:24 -> idle:2026-09-08 11:37:15
12:41 以降  常駐はずっと「手待ち」を書き出している（16:42／17:12／17:42）
```

### ③ パネルが「連絡なし」へ落ちなかった理由

**`STALE_SEC = 2700` の判定は効いていた。効く先が足りなかった。**

```js
L1516  var STALE_SEC = 2700;
L2634  var sec = Math.floor(Date.now() / 1000) - (d.at || 0);
L2608  lastStat = w; lastStartedAt = (d.startedAt || 0); …   ← 早戻りより前に置かれる
L2706  if (sec > STALE_SEC) { … paintState('lost', '連絡なし', …); return; }
```

`paintState`（上の札）は連絡なしになる。しかし **`lastStat` はその早戻りより前**に
「作業中」で置かれ、猫（`runCatTick`）と黄色の行（`stateLineText`）はそちらを見る。
連絡なしが二人に伝わっていなかった。

さらに v123 の `isRunning()` には上限が無く、終わりの札が一枚も書かれていない
（`終わりの札-1`）ので「走り出しが最後の終わりより新しい」が**永久に真**になり、
猫が走り続けて経過だけが伸びた。

## ② 塞いだもの（v124・土台には触っていない）

### パネルの側

| 直し | 中身 |
|---|---|
| **走らせる上限** | `runCapSec()` ＝ 見込み×3（`RUN_MAX_MULT = 3`）／見込みが無ければ6時間（`RUN_MAX_SEC`）。見込みは `state.json` の `mikomi` から控える（`lastMikomiMin`）。**上限は `stat` より強く**、凍った「作業中」でも開き過ぎたら倒す |
| **延ばしの上限** | `endPredText` の延ばしは**一幅まで**。超えたら延ばさず「〈頭〉、HH時MM分終了予定を過ぎています」へ。`guard < 200`（10分刻みで33時間先まで延びていた）は**撤去** |
| **材料の古さは伏せる** | 過ぎ方が `runCapSec()` を超える刻は、数字にしない（`endSec = 0`）。前の仕事の開始を引きずった刻がここで落ちる |
| **判定の順** | `lastLost` を早戻りより前で控え、**ヨシ待ち → 連絡なし → 作業中**を `runCatTick` と `stateLineText` の両方へ。連絡なしの間は猫を寝姿に、黄色の行は「連絡なし」 |
| **上限を超えた回の行** | 「次の指示待ち」ではなく「終了予定を過ぎています（開始HH:MM・経過N分）」。刻が取れた回はその刻ごと出す |

### 押し送りの側

`pipe-check.ps1` に `state-stale` を足した（`$STATE_STALE_MIN = 45`）。
**公開側**の `state.json` の `at` を見て45分以上古ければ 🪟 を一発。
重い帯の間は今までどおり `heavy-skip` で抑える。60秒の束ねは今までの出口をそのまま通る。
＊写し `.bak-20260908` を取り、構文検査は 2905トークン・誤り0。

## ③ 版と panel-check

`PANEL_VER = '124'` ／ `verTag「panel v124（9月8日）」` ／ `panel-ver.txt = 124`。
**panel-check … 全てPASS（✓51／✗0）。**

**四度回した。**落ちた三回は、どれも**こちらの直しが招いたもの**。

| 回 | 落ちた項目 | 何が起きたか | どう直したか |
|---|---|---|---|
| 1 | ⑦「超過中の刻まで消えた」 | 「過ぎています」へ切り替えるとき**刻ごと消していた**。v107 の決め（超過中の終了予定は過去になるのが正しく、経過と並べて読むために要る）に反した | 延ばすのはやめたまま、**過ぎた刻はそのまま出す** |
| 2 | ⑦ 同上（行が**空**） | 「作業中のまま上限を超え、かつ終わりの札が走り出しより新しい」回が、どの枝にも入らず最後の空文字へ落ちた | 枝の条件を `作業中 または 走り出しが終わりより新しい` へ広げた |
| 3 | ⑦「前の仕事の開始を引きずった刻がそのまま出た（11時07分）」 | ⑦は**二つを同時に**見張っている——(甲)引きずった刻は出すな／(乙)超過中の刻は消すな。刻を出す側へ振ったので (乙) は通り (甲) が破れた | **分かれ目を `runCapSec()` に置いた**。過ぎ方がそれを超える刻は「材料が古い」と見て数字にしない |

## ④ 作り値（偽の fetch。本物の ntfy・push・commit は叩いていない）

| 場合 | 判定 | 猫の絵 | 黄色の行 |
|---|---|---|---|
| **(a)** 見込み90分・経過30分 | `true` | `cat1.png` | 作業中、終了予定不明（経過30分） |
| **(b)** 経過390分・見込み不明 | `false` | `cat-sleep.png` | 終了予定を過ぎています（開始12:03・経過390分） |
| **(c)** 生存が45分以上古い | `false` | `cat-sleep.png` | **連絡なし** |
| （参考）ヨシ待ち | — | `panel-icon-white.png` | ヨシを返してください |
| （参考）見込み90分の3倍（272分）超 | `false` | `cat-sleep.png` | 終了予定を過ぎています（経過272分） |
| （⑦の形）開始60分前・見込み20分 | `true` | `cat2.png` | 作業中、**17時53分終了予定を過ぎています**（経過60分） |
| （⑦の穴）作業中・上限超・終わりが新しい | `false` | `cat-sleep.png` | 作業中、17時53分終了予定を過ぎています（開始17:33・経過60分） |
| （⑦の甲）開始を8時間引きずり・見込み40分 | `false` | `cat-sleep.png` | 終了予定を過ぎています（開始10:33・経過480分）＝**刻なし** |

写しの中で拾った画面の誤り … **無し**。

### 押し送り側の作り値（判じる枝を字面のまま抜き出して回した）

```
(甲) 30分前・帯なし   → 鳴らない
(乙) 45分前・帯なし   → state-stale … 公開側の生存が 45分 書かれていない
(丙) 397分前・帯なし  → state-stale … 公開側の生存が 397分 書かれていない
(丁) 397分前・帯あり  → heavy-skip … 重い帯なので生存の古さは訴えない
```

## 公開側の実読み

```
HTTP 200 / 122,312バイト
lastLost の定義        : 1件
RUN_MAX_MULT / RUN_MAX_SEC : 各1件
runCapSec              : 1件
guard 200 の残り       : 0件（撤去できている）
「分終了予定を過ぎています」 : 1件
黄色の行が連絡なしを先に : 有
猫が連絡なしで寝る      : 有
PANEL_VER 124 ／ verTag v124 ／ panel-ver.txt 124
公開側 state.json の at : 18:34:50（27分前）← 運びが戻った
```

## 残す穴（直していない）

- `stat` が十分（`$FRESH_MIN = 10`）で手待ちへ落ちること自体は `watch-notify.ps1` に残る
- 押しが時間切れで切られたとき、**錠を残さない仕組みは無い**。今回は手で外した。
  次に同じ形になれば、`state-stale` の 🪟 が45分で鳴る——**気づく道は付いたが、外す道は無い**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **172件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`走り出しの題-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%A1%8C-1.md) | 09-06 02:39 | 走り出しの題-1 — 走り出しの題に、仕事の名を入れた |
| [`通知の出口-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-3.md) | 09-06 02:32 | 通知の出口-3 — 見張りの道にも同じ60秒の束ねを置いた |

<!-- 控えの一覧 ここまで -->
