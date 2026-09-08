# 終わりの札-2 — 終わりの札が立たない根を直す

**根は「stat が終わりを通らなかった」。9月8日の五件すべてが、11〜63分の遅れで
物差し（`$FRESH_MIN = 10`）から外れ、札は一枚も立たなかった。**
書く側に**外から見る手**を足し、落ちた回はあとから一枚立て直すようにした。

## ① stat を「終わり」へ落とす条件（字面）

```powershell
# watch-notify.ps1 L1812
} elseif (($lastKind -eq 'stop' -and $kindFresh) -or $stopPending) {
  $stopTs = $(if ($lastStopAll) { $lastStopAll } else { $lastKindTs })
  …
  $key   = 'done:' + $stopTs
```

二つの入口しかない。**どちらも10分の窓を要る。**

```powershell
# L1399   いちばん新しいフックが新しいか
$kindFresh = ($kindAge -ne $null -and $kindAge -le $FRESH_MIN)     # $FRESH_MIN = 10（L75）

# L1426   まだ札にしていない stop を拾い直す道（2026-09-02・札の抜け-2）
if ($stopAge -ne $null -and $stopAge -le $FRESH_MIN -and $afterResume) { $stopPending = $true }
```

`$stopPending` は「巡回が stop の直後に当たるかは運任せ」を直すために入った道だが、
**同じ 10分の窓を持っている**。十分以上ひと続きで働くと、両方まとめて外れる。

## ② 9月8日の五件

鍵が `done:` を通ったのは **01:04:02 の一度きり**。立った札も**一枚だけ**で、
中身は「この回は控えを書いていません」の空札だった。

| 仕事 | 終わりの札 | stat が終わりを通ったか | 落ちた先 |
|---|---|---|---|
| 検査の重さ-1の調べ（一度目） | **立った**（01:04・ただし空札） | `done:2026-09-08 01:03:53` | — |
| **黒猫の待機-2** | **立たない** | 通らない | `idle:2026-09-08 07:27:14`（07:47:59 に判定） |
| **検査の重さ-1の調べ（出し直し・再送）** | **立たない** | 通らない | `idle:2026-09-08 08:31:03`（09:23:31） |
| **終わりの札-1** | **立たない** | 通らない | `idle:2026-09-08 09:53:55`（10:07:28） |
| **猫の矛盾-1** | **立たない** | 通らない | `idle:2026-09-08 11:37:15`（12:41:04） |
| **止まりの見分け-1** | **立たない** | 通らない | `idle:2026-09-08 19:15:47`（19:27:20） |

### 遅れの実測

| フックの刻 | 巡回が見た刻 | 遅れ |
|---|---|---|
| 07:27:14 | 07:47:59 | **20分** |
| 08:31:03 | 09:23:31 | **52分** |
| 09:53:55 | 10:07:28 | **13分** |
| 11:37:15 | 12:41:04 | **63分** |
| 19:15:47 | 19:27:20 | **11分** |

**五件とも 10分の窓を超えている。**いちばん短い遅れでも11分で、窓は1分足りなかった。

## ③ 落ちた回の直前に、控えへ終わりは書かれていたか

**五件とも書かれていた。**巡回自身がそう記録している。

```
07:47:59  この回は終わりを出しており控えにも待ちが無いので、ヨシ待ちの知らせは出さない
09:23:31  同上
10:07:28  同上
12:41:04  同上
19:27:20  同上
```

この一行は「**この回は終わりを出しており**、控えにも待ちが無い」と読んでいる。
つまり巡回は**終わったことを知りながら**、鍵を `idle:` にして札を作らずに通り過ぎていた。
＊`stop-guard` の「控えあり（この回に書いた・待ちの行あり）。通す」も
　01:04:51／02:41:29／08:22:44／09:52:30／10:32:37 に残っている。

## ② 塞いだもの — pipe-check ⑨「終わりの札の立て直し」

**札の作り・位相の鍵・一発の印には触っていない。**見るのは `hook.log` ／
`work-note.txt` ／ `notices.json` の三つだけで、立てるときは**手からの報告と同じ口**
（`ntfy-say.ps1`）を通す。`pipe-check` は10分ごとに走る別の見張りなので、
巡回の位相とも無関係に動く。

### 立てる条件（順に）

1. `hook.log` のいちばん新しい `stop` が、いちばん新しい `resume` より後
2. その `stop` から **3分以上**経っている（`$SWEEP_MIN`。ふつうの道の邪魔をしない）
3. こちらの印（`done-sweep-said.txt`）が、その `stop` を指していない
4. ふつうの道の印（`done-said.txt`）も、その `stop` を指していない（**読むだけ・書き換えない**）
5. 控えの `待ち:` が「なし」（ヨシ待ちの回は終わりではない）
6. `notices.json` に、**同じ仕事の名**の「終わりました／調べました」が無い（二重防止）

題は控えの `件名`（括弧より前を名として題に添える）、中身は控えの `件名` ＋ `完了` の本文。
`種類: 調べた` の回は `🔎 調べました` にする。

### 立てられない回

`完了` が空なら **`done-unwritten` の訴えを一行**残す。黙って落ちない。
＊印も同時に書くので、同じ `stop` で何度も訴えない。

立てた回は `done-swept` の訴えも残す（何分遅れで立て直したかが後から辿れる）。

## ③ 作り値（偽の送り手。本物の ntfy・push・commit は叩いていない）

`pipe-check.ps1` の⑨を**字面のまま**抜き出し（本物の L232〜L329・98行）、
一時ディレクトリを `$Root` / `$Repo` に見立て、`$Root` に**偽の `ntfy-say.ps1`**
（呼ばれたことと題・本文を控えるだけの物）を置いて回した。

| 場合 | 立った札 | 中身 | 訴え |
|---|---|---|---|
| **(a)** 控えあり・札なし | **1枚** `✅ 終わりました（返事不要）：作り値の件-9` | 件名 ／ 一行目の中身。 ／ 二行目の続き。（`実測:` は入らない） | `done-swept`（30分遅れ） |
| **(b)** 控えあり・札あり | **0枚**（増えない） | — | なし |
| **(c)** 控えが空 | **0枚** | — | `done-unwritten`（控えの完了が空・stop の刻つき） |

実地でも `pipe-check.ps1` を一度通した。誤りは出ず、いまの回は
「resume が stop より後」なので何も立てていない（正しい振る舞い）。

## 残す穴（直していない）

- `$FRESH_MIN = 10` そのものは動かしていない。**巡回の側は今までどおり**で、
  外から見る手が10分ごとに拾い直す形。**札が立つのは最大10分遅れる。**
- 立て直しの札は `ntfy-say` の口から出るので、**押し送りは60秒の束ねを通る**。
  同じ窓に他の知らせがあれば「🔔 まとめて N件」に混ざる。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **173件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`走り出しの題-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%A1%8C-1.md) | 09-06 02:39 | 走り出しの題-1 — 走り出しの題に、仕事の名を入れた |

<!-- 控えの一覧 ここまで -->
