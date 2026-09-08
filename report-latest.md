# 取り残しの検収-1

**作り値は五通りとも通った。ただし②を数える途中で、入れた守りが
「ほぼ必ず降りる」ことが分かったので、拾い方を作り直した。**

## ②（先に書く）守りが効かないことが分かった

前の回に入れた守りは「**控えの更新時刻が `resume` より前のときだけ本文を使う**」だった。
これを数えたら、**ほぼ必ず降りる**と分かった。

```
指示 187件 ／ 機械が控えの件名を書いた 46件 ／ 組めた 46件
  差（秒） 中央値 0 ／ 最大 0 ／ 0〜2秒に収まった割合 100.0%
```

`inbox-feed` は指示を受けた**その秒のうちに**控えの件名を書き替える。つまり控えの
更新時刻は `resume` と同じ秒になる。`更新時刻 >= resume` で降ろす守りは、**46件すべてで降りる**。
前の回に入れた「前の仕事の取り残し」は、そのままでは**一枚も立てられない**。

### 作り直した — 止まった時点の控えを写す

`stop-guard.ps1` に、**止まるたびに控えを写す**手を足した(`note-at-stop.txt`)。
一行目に写した刻（epoch）を置き、拾う側が `stop` の刻と突き合わせる（±300秒）。

```powershell
function Save-NoteAtStop() { … Set-Content $dst (@(('at=' + $at)) + @(Get-Content $src)) … }
…
if ($has -and $fresh -and $hasAsk) { Save-NoteAtStop; Note '控えあり（この回に書いた・待ちの行あり）。通す'; exit 0 }
```

**判定も知らせも変えていない。写すだけ。**写しを取り、構文検査（1023トークン・誤り0）を通した。
`pipe-check` ⑨の取り残しの側は、いまの控えではなく**この写し**から読む。

### 立て直せる分の数

| | 件数 |
|---|---|
| 過去14日の取り残し | 36件 |
| いま本文が拾える | **0件** |
| 上書きされて拾えない | **36件** |

**過去の36件は一枚も立て直さない。**写しは今日から取り始めたので、
それ以前の止まりには写しが無い。枠のとおり、拾えない分は立て直さない。

＊古い守り（更新時刻で見る）でも 0件だった。理由は上の「差0秒」。
＊**これから起きる取り残しは拾える。**次に止まった時点から写しが残る。

## ① 作り値（偽の送り手。本物の ntfy・push・commit は叩いていない）

⑨を字面のまま抜き出し（本物の L232〜L396・165行）、一時ディレクトリを見立て、
`$Root` に偽の `ntfy-say.ps1` を置いて回した。並びは
`指示1 → 止まり1 → 指示2 → 止まり2 → 指示3`（＋(c) だけ指示3のあとに途中の止まり）。

| 場合 | 拾った止まり | 取り残しか | 立った札 | 訴え |
|---|---|---|---|---|
| **(a)** 取り残し・印なし・写しあり | 止まり2 | True | **1枚**　題 `…：二つ目の仕事-9`<br>本文 `二つ目の仕事-9（前の仕事） / 前の仕事の中身。 / 二行目。` | `done-swept`（前の仕事の取り残し・60分遅れ） |
| **(b)** 写しが `stop` と合わない | 止まり2 | True | **0枚** | `done-stale-note` |
| **(c)** いま走っている仕事の止まり | **途中の止まり** | **False** | 1枚（`…：三つ目の仕事-9`） | `done-swept` |
| **(d)** 前の仕事の `stop` に `done-said` | 止まり2 | True | **0枚** | なし |
| **(e)** 指示が三つ続いた並び | **止まり2** | True | **1枚**（`…：二つ目の仕事-9`） | `done-swept` |

**(a)(e) の題が「二つ目の仕事-9」になっている。**いまの控えの件名（「三つ目の仕事-9」）では
なく、その `stop` が属していた指示の題を採れている。
**(e) は止まり1（一つ目の仕事）を拾っていない**——`resume` より前でいちばん新しい一つだけ。
**(c) は前の仕事に手を出していない**——`取り残しか = False` で、いまの仕事の止まりを拾っている。

### 作り値の側で踏んだ穴（本体の話ではない）

作り値の関数の引数名を `[bool]$snap` にしていたため、抜き出した枝の中の
`$snap = Join-Path $Root 'note-at-stop.txt'` が**型に縛られて `$true` に化け**、
`Test-Path -LiteralPath $true` が偽になって四通りが空振りした。引数名を変えて直した。
**字面を抜き出して回す作り値では、枠の変数名と作り値の変数名がぶつかる**という一点。

## ③ 作法へ一行

`CLAUDE.md` に **作法34「PowerShell へ regex を差し込むときは `\d`・`\s`・`\w` を使わない」** を足した。
`[0-9]` ／ `[ ]` ／ `[A-Za-z0-9_]` で書き、差し込んだ後は字面を読み返す。
道も同じ穴を踏むので、差し込む台本の中では `C:/Users/user/.claude` と前向き斜線で書く。

**二度踏んでいる**（どちらも今日）——`^(d{4}-...)s+stops` になって作り値が四通りとも0枚になった件と、
`C:\Users` が `\U` になって node が `Invalid Unicode escape sequence` で止まった件。

## ④ 実地

**こちらからは作らない。**次に取り残しが起きた回で自動的に働く。
働いた回は `pipe-warn.log` の `done-swept` に遅れの分が残るので、次の報告でその一行を出す。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **176件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`訴えの内訳-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E5%86%85%E8%A8%B3-1.md) | 09-06 12:25 | 訴えの内訳-1 — 31件は何を言っているか（数えただけ） |

<!-- 控えの一覧 ここまで -->
