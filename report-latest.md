# 写しの重さ-1 — note-at-stop.txt は帳面として太るか

**太らない。上書きなので、止まりが何回起きても行は増えない。**
毎分の巡回も読まない（読むのは10分ごとの `pipe-check` だけ）。**調べだけで、直しは入れていない。**

## ① 作り

```powershell
function Save-NoteAtStop() {
  try {
    $dst = Join-Path 'C:/Users/user/.claude' 'note-at-stop.txt'
    $src = Join-Path 'C:/Users/user/.claude' 'work-note.txt'
    if (-not (Test-Path -LiteralPath $src)) { return }
    $at = [int]((Get-Date).ToUniversalTime() - [datetime]'1970-01-01').TotalSeconds
    $body = @(('at=' + [string]$at)) + @(Get-Content -LiteralPath $src -Encoding UTF8)
    Set-Content -LiteralPath $dst -Value $body -Encoding UTF8
  } catch { }
}
```

| 見た所 | 答え |
|---|---|
| 書き方 | **`Set-Content` ＝ 上書き**。`Add-Content`（追記）ではない |
| 止まり一回あたり増える行 | **0行**（毎回まるごと書き替える） |
| 中身 | `at=<epoch>` の一行 ＋ そのときの `work-note.txt` まるごと |

### いまの行数と大きさ

**まだ無い。**足したのが 21時台で、それ以降まだ止まっていないため。
直前の止まり（20:38:02）は足す前だった。**次に止まった時点で置かれる。**

大きさは**控えの大きさ ＋ 1行**で決まる。最近の控えの実測：

| | 行数 | バイト |
|---|---|---|
| `work-note.txt`（いま・書き始め） | 5行 | 237 |
| `work-note.bak-20260905b` | 30行 | 3,096 |
| `work-note.bak-20260905c` | 36行 | 3,051 |

**厚めの控えで 30〜36行・約3.0KB。**写しはこれに1行足しただけ。

### 30日後の見込み

止まりの実測（過去14日・478件）：

```
一日あたり  平均 34.1回 ／ 最大 85回 ／ 最小 9回
```

30日で **約1,023回**の止まりになるが、**上書きなので行も大きさも増えない**。

| | いま | 30日後 |
|---|---|---|
| 行数 | 控えの行数＋1（厚めで37行） | **同じ** |
| 大きさ | 約3KB | **同じ** |

＊もし追記（`Add-Content`）だったら、1,023回 × 37行 ＝ **約38,000行・3MB** になっていた。
　そこは `Set-Content` で分かれている。

## ② 毎分の巡回が読む帳面に加わるか

**加わらない。読むのは `pipe-check.ps1` だけ。**

| 台本 | `note-at-stop` の出現 | 何をするか |
|---|---|---|
| `stop-guard.ps1` | 書く | 止まるたびに上書き |
| `pipe-check.ps1` | 読む | **10分ごと**（`ClaudePipeCheck` は PT10M） |
| `watch-notify.ps1`（毎分の巡回） | **0** | 触らない |
| `inbox-watch.ps1`（常駐） | **0** | 触らない |
| `daily-notice.ps1` ／ `hook-notice.ps1` ／ `inbox-feed.ps1` ／ `notify-record.ps1` | **0** | 触らない |

9/6 に数えた「毎分の巡回が丸ごと読む三つ」——`watch-step-log.txt` ／ `work-note.txt` ／
`work-started.txt` ——は**三つのまま**。写しは四つ目にならない。

＊読むのは10分に一度・約3KB。`watch-step-log.txt` が毎分48KB を丸ごと読んでいた
　（9/6 に刈った）のと比べて、桁が二つ違う。

## ③ 刈り方の案

**要らない。**太る形ではないので、刈る相手がいない。

9/6 に `watch-step-log.txt` を 7,486行 → 800行へ外から刈った前例は、**この写しには当てはまらない**。
あちらは `Add-Content` で積み上がる帳面で、刈らなければ止まらなかった。こちらは毎回上書きなので、
**刈っても翌回に同じ大きさへ戻るだけ**で、何も減らない。

### 唯一の効き所（案として一つだけ）

写しの大きさは**控えの大きさにそのまま従う**。控えが太れば写しも太る。
もし将来ここを抑えたくなったら、**写す欄を絞る**（`件名` ／ `待ち` ／ `種類` ／ `完了` の四つだけ写し、
`実測` ／ `ファイル` ／ `そのまま` は落とす）のが唯一効く形。

| | |
|---|---|
| 減る見込み | 厚めの控え37行のうち、拾う側が使うのは4欄。**おおむね半分**（3KB → 1.5KB 程度） |
| 代償 | 立て直した札の本文が**いまの札と食い違う**。ふつうの道の札は `実測` も `ファイル` も載せるので、**取り残しの札だけ薄い**という差ができる |
| いま要るか | **要らない。**3KB を10分に一度読むだけで、効果より差の方が目につく |

＊**実装はしていない。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **177件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`写しの重さ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%87%8D%E3%81%95-1.md) | 09-08 22:26 | 写しの重さ-1 — note-at-stop.txt は帳面として太るか |
| [`取り残しの検収-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97%E3%81%AE%E6%A4%9C%E5%8F%8E-1.md) | 09-08 22:03 | 取り残しの検収-1 |
| [`前の仕事の取り残し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%89%8D%E3%81%AE%E4%BB%95%E4%BA%8B%E3%81%AE%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97.md) | 09-08 21:15 | 前の仕事の取り残し — 次の指示が先に来た回の落ち |
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

<!-- 控えの一覧 ここまで -->
