# 前の仕事の取り残し — 次の指示が先に来た回の落ち

**過去14日で 184件の仕事のうち 36件（19.6%）が、終わったのに札が立たないまま
次の仕事へ移っていた。**そのうち 31件は控えに完了が書かれていた。
`pipe-check` ⑨に「前の仕事の取り残し」を足して埋めた。

＊窓の幅（`$FRESH_MIN`）は**10分のまま据え置き**。この件は蒸し返さない。

## ① 何件あったか

数える単位は**止まり**ではなく**仕事**（指示 → 次の指示の手前）。
一つの仕事の中で止まりは何度も起きるので、札が要るのは最後の一つだけ。

| | 件数 |
|---|---|
| 受けた指示（仕事） | 184件（いま走っている分は除く） |
| 札が立った | 139件 |
| 止まりが無かった | 9件 |
| **取り残し** | **36件（19.6%）** |
| うち控えに完了あり | **31件** |

判じ方 … 札は `watch-notify.log` の `-> done:` で数え、控えは `hook.log` の
stop-guard「控えあり（この回に書いた）」で見た。

### 日ごと

`08/28` 8件 ／ `08/30` 3 ／ `08/31` 3 ／ `09/01` 4 ／ `09/02` 4 ／
`09/05` 1 ／ `09/06` 4 ／ `09/07` 4 ／ `09/08` 5

### 題（新しい順・9件）

| 指示 | 控え | 最後の止まり | 題 |
|---|---|---|---|
| 09/08 17:55 | 不明 | 09/08 19:15 | 止まりの見分け-1 |
| 09/08 10:15 | あり | 09/08 11:36 | 猫の矛盾-1 |
| 09/08 09:34 | あり | 09/08 09:52 | 終わりの札-1 |
| 09/08 07:55 | あり | 09/08 08:29 | 検査の重さ-1の調べ |
| 09/08 01:05 | あり | 09/08 07:26 | 黒猫の待機-2 |
| 09/07 17:47 | あり | 09/07 20:10 | 現況の「本体v未確認／stable v未確認」 |
| 09/07 10:25 | 不明 | 09/07 10:27 | 選択釦-1 の21視野の進み |
| 09/07 07:22 | あり | 09/07 07:23 | 選択釦-1 を実装へ |
| 09/06 19:37 | あり | 09/06 19:38 | 切り候補-1 の報告 |

## ② 塞いだもの

`pipe-check.ps1` ⑨に、拾う相手の選び方を足した。

```powershell
if ([datetime]$lastResume -gt [datetime]$lastStop) {
  # 前の仕事の最後の stop を探す（resume より前で、いちばん新しいもの）
  …
  if ($prevStop) { $lastStop = $prevStop; $leftover = $true } else { $go = $false }
}
```

**いま走っている仕事の stop には手を出さない。**触るのは `resume` より前の stop だけ。

### 控えをどう守るか

控えは、指示を受けた場で**件名の行だけ**が差し替わり、`完了:` は前の仕事のまま残る
（`inbox-feed.ps1` L181〜）。だから取り残しの本文は控えから拾える——**ただし
こちらが控えを書き直した後は、完了は新しい仕事の物になる。**

そこで、**控えの更新時刻が `resume` より前のときだけ本文を使う**。後なら拾わず、
`done-stale-note` の訴えを一行残す。

```powershell
if ($noteAt -eq $null -or $noteAt -ge [datetime]$lastResume) {
  Add-Warn 'done-stale-note' ('前の仕事の終わりの札を立て直せない（控えは既に次の仕事へ書き換わっている…）')
```

### 題は「その stop が属していた指示の題」

枠は「題は控えの件名」としていたが、**取り残しの回には使えない**——件名は既に
次の仕事へ動いているので、そのまま使うと**前の仕事の中身に新しい題が付く**。
そこで取り残しの回だけ、`hook.log` の「受け取った指示を控えた」から、
**その stop より前の最後の指示の題**を採る。ここだけ枠の字面から外れた。

二重防止の六条件（自分の印／ふつうの道の印／`待ち: なし`／同じ名の札／
`$SWEEP_MIN` 3分／`$afterResume`）は**そのまま掛かる**。

## ③ 作り値（偽の送り手。本物の ntfy・push・commit は叩いていない）

⑨を字面のまま抜き出し（本物の L232〜L368・137行）、一時ディレクトリを見立て、
`$Root` に偽の `ntfy-say.ps1` を置いて回した。

| 場合 | 立った札 | 訴え |
|---|---|---|
| **(a)** 取り残しあり | **1枚**　題 `✅ 終わりました（返事不要）：前の仕事-9`<br>本文 `前の仕事-9（取り残しの作り値） / 前の仕事の中身。 / 二行目。` | `done-swept`（**前の仕事の取り残し**・60分遅れ） |
| **(b)** ふつうの道の印が指している | **0枚** | なし |
| **(c)** 控えが空 | **0枚** | `done-unwritten` |
| **(d)** 控えが既にいまの仕事の物 | **0枚** | `done-stale-note` |

**(a) の題が「前の仕事-9」になっている**——控えの件名（「いまの仕事-9」）ではなく、
その stop が属していた指示の題を採れている。

前からの四通り（ふつうの道）も回し直して、**(a) 1枚／(b) 0枚／(c) 0枚・二度目は訴えない／
(d) 0枚**のまま変わらないことを確かめた。

## ④ 台帳

「終わりの札-1」の二行は**同じ件**だった——④「上限を40→80へ上げる」と
⑦「41〜80枚目の作り値」で、どちらも (b)「そもそも書かれていない」が原因と分かって
不要になった一対。**一行へ寄せた。**

**残り1件**（帯の中の黙り-1・実地待ち）。

## 残す穴

- 控えを書き直したあとに次の指示が来た回は、本文が拾えないので `done-stale-note` に回る。
  **札は立たない。**拾えるようにするには、止まった時点で控えの写しを取る要があり、
  それは知らせが止まる要（`hook-notice` か `inbox-feed`）に手を入れることになる。今回はしていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **175件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`帯の中の押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-06 08:43 | 帯の中の押し-1 — 帯の前に押し、帯の間も押しだけは通す |

<!-- 控えの一覧 ここまで -->
