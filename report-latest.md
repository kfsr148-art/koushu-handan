# 終わりの札-1 — 終わった知らせが手元に残らない件

**結論は (b)。押し出されたのではなく、そもそも一枚も書かれていない。**
枠のとおり、原因を名指しするところで止め、**直しは入れていない**。
(a) の「上限を 40→80 へ上げる」も**実施していない**——上限は原因ではないため（下記）。

## ① notices.json の枚数と内訳

**40枚（上限ちょうど）。** 最新 09/08 01:04 ／ 最古 09/06 02:02。

| 枚 | 種類 |
|---|---|
| 26 | ✅ 終わりました |
| 5 | 🔎 調べました |
| 3 | 🙋 ヨシしてください |
| 2 | 🙀 異変発見だにゃ |
| 1 | 😺 現在も順調にゃ |
| 1 | 🪟 異常です（手が要ります） |
| 1 | 🪟 連携に訴えがあります |
| 1 | 🕒 延びています |

**定時の札は 0枚。**

## ② notices-archive.json と、直近24時間の退避

**46枚。** 最新 **09/06 01:51:20** ／ 最古 09/03 23:01。
内訳＝終わりました27／🪟異常8／調べました4／🙀異変2／🕒延び2／😺順調2／🪟連携1。

> **直近24時間に退避した札 … 0件。**
> archive の最新が 09/06 01:51:20 で、**それ以降、押し出しは一度も起きていない**。

notices.json の最古（09/06 02:02）が archive の最新（09/06 01:51）のすぐ後に続いており、
**押し出しは 09/06 の未明で止まったまま**であることが両側の刻から確かめられる。

## ③ 名指し — 「検査の重さ-1の調べ（再送）」の③④⑤

| 探した物 | notices | archive |
|---|---|---|
| 検査の重さ（③立ち上げ201本／④固定の待ち217.7秒／⑤削り所6つ） | **0枚** | **0枚** |
| 黒猫の待機-2 | **0枚** | **0枚** |

＊notices に在る「検査の重さ」の札は **09/08 01:04:41 の一枚だけ**で、中身は
　「この回は控えを書いていません（前の回の控えが残っています）」——**空札**。
　21視野の内訳も、四つの数も、削り所も、**どちらのファイルにも無い**。

**→ (b)「そもそも書かれていない」に当たる。**

## (b) 書く経路のどの段で落ちたか

三段で落ちている。

**［一段目］重い帯のあいだ、巡回が79回まるごと見送られた。**

```
01:04 〜 07:46 の heavy-skip.log … 79行
  02:43:43  重い帯のため見送り（1回目）：panel-check の再走ち（黒猫の待機-2）
  …
  07:36:58  重い帯のため見送り（7回目）：pre-push の検査
  07:46:49  帯が消えたので、見送った分をここで走らせる（見送り 7回）
```

**［二段目］帯が明けたときには、終わりの状態行が鮮度を過ぎていた。**

`watch-notify.ps1` L75 … `$FRESH_MIN = 10`（状態行がこれより古ければ、その状態は送らない）。
実際の記録：

```
07:47:59  鍵 run:… -> idle:…（状態行が古いので送らず: 21分前・notification）
09:23:31  鍵 run:… -> idle:…（状態行が古いので送らず: 52分前・notification）
```

`$kindFresh` が偽になると、`stop` から終わりの札を組む分岐（L1804・L1812）を素通りし、
落ちどころの **L1871 `$key = 'idle:' + $lastKindTs`** に落ちる。

**［三段目］`idle:` は送らない。そして控えは送る道の中にしかない。**

```powershell
# L2102（送る条件）
elseif ((($key -notlike 'run:*') -or ($state -eq 'bad')) -and $key -notlike 'wait-unwritten:*' `
        -and $key -notlike 'idle:*' -and -not $sameBody) { [void](Send-Ntfy …) }
```

`Record-Notice`（notices.json への控え）は **L1022、`Send-Ntfy` の中でだけ**呼ばれる。
送らない回は控えも取らない。だから **notices.json に一枚も残らない**。

> **一行でいうと** … 重い帯で巡回が79回見送られ、帯が明けたときには終わりの状態行が
> 10分の鮮度（`$FRESH_MIN`）を過ぎていたため鍵が `idle:` に落ち、**送らない＝控えない**で
> 札が一枚も書かれなかった。

**直しは入れていない**（枠のとおり）。

## (a) を実施しない理由（上限は原因ではない）

押し出しは **09/06 01:51 以降一度も起きていない**ので、上限40は今回の消失に関わっていない。
参考までに直近7日の日別枚数（notices＋archive を合わせて数えた）：

| 日 | 枚 |
|---|---|
| 09/03 | 1 |
| 09/04 | 10 |
| 09/05 | 27 |
| **09/06** | **30** |
| 09/07 | 17 |
| 09/08 | 1 |

いちばん多い日で **30枚**。**40 で足りている。**
＊09/03 が1枚なのは、archive が 09/03 23:01 から始まっているため（それ以前は残っていない）。

上限を上げていないので、**④の作り値（41枚目〜80枚目を立てる検収）も回していない。**
上限が原因でない以上、上げても札は戻らないため。

## ③ 黄色の行（`lastDone()`）が古い終わりを指す件

**退避済みの札が `allRows` に入らないのは、字面のとおり仕様。**

```js
// L610 / L1666 … 一覧の出どころは notices.json だけ
var NOTICES_URL = 'https://kfsr148-art.github.io/koushu-handan/notices.json';
// L1693
allRows = rows.slice();      // 写した札も含む全件（notices.json のぶん）
```

`notices-archive.json` は「🗄 過去の札」の箱が**別に**読む（L433）。
`lastDone()`（L781〜793）は `allRows` しか見ないので、退避済みの札は入らない。

**ただし、枠の見立てとは因果が違う。**

- 押し出しは**古い方から**起きる（`notify-record.ps1` L146-147。`$rows` は `+=` の追記なので古い順、
  `$rows[0..($rows.Count - $KEEP - 1)]` が落ちる分＝**いちばん古い側**）
- `lastDone()` は `allRows` の中で **`time` が最大**の札を選ぶ（L787）

つまり**退避が起きても黄色の行は動かない**。いま黄色の行が 01:04 を指し続けているのは
退避のせいではなく、**(b) と同じ「01:04 以降そもそも一枚も書かれていない」ため**。

**直しは入れていない**（枠のとおり）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **170件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`通知の出口-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-2.md) | 09-06 02:23 | 通知の出口-2 — 出口で60秒のあいだ束ねる |
| [`subj-gapの空振り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/subj-gap%E3%81%AE%E7%A9%BA%E6%8C%AF%E3%82%8A-1.md) | 09-06 01:50 | subj-gapの空振り-1 — 同じ文を違う長さで切っただけ |

<!-- 控えの一覧 ここまで -->
