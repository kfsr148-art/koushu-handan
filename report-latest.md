# 猫の矛盾-1 — 走っているのに頭の猫が寝ている件

**根は「9:35 の走り出しが反映されなかった」ではない。反映はされ、32分後に取り消された。**
取り消したのは `watch-notify.ps1` の「状態行の古さで鍵を決める」段で、そこは走り出しの控えを
一切見ない。猫と黄色の行の側を、`stat` 一本に頼らない判定へ広げた。

## ① 根の実測

### state.json のいまの値（2026-09-08 10:15 台）

| 鍵 | 値 | |
|---|---|---|
| `stat` | `"手待ち"` | |
| `at` | 1788830131 | 10:15:31 |
| `statAt` | 1788829663 | **10:07:43** |
| `startedAt` | 1788830125 | **10:15:25** |
| `subj` | `"猫の矛盾-1（走っているのに頭の猫が寝ている件）"` | |
| `mikomi` | `"不明"` | |

**`startedAt`（10:15:25）が `statAt`（10:07:43）より新しいのに、`stat` は「手待ち」。**
矛盾がそのまま値に出ている。

### stat が最後に変わった刻

```
09:35:25  鍵 idle:2026-09-08 08:31:03 -> run:2026-09-08 09:34:56       ← 最後に「作業中」へ
10:07:28  鍵 run:2026-09-08 09:34:56 -> idle:2026-09-08 09:53:55       ← 最後に「手待ち」へ
          （状態行が古いので送らず: 14分前・notification）
```

### 9:35 の走り出しで work-started.txt は打たれたか

**打たれた。**

```
2026-09-08 09:34:56  inbox-feed  開始の時計を打った 1788827697 「終わりの札-1（終わった知らせが…」
2026-09-08 09:34:56  inbox-feed  控えの件名を機械が書いた 「終わりの札-1（終わった知らせが…」
```

### ④ 落ちた段（一行）

**落ちたのは `inbox-feed → state` の書き出しではない。9:35 の走り出しは 09:35:25 に
「作業中」として反映されている。**落ちたのはそのあと——

> **`watch-notify.ps1` の落ちどころ（L1855〜L1871）。**フックの最後の刻（09:53:55）が
> 10:07 の回には14分前になり、`$FRESH_MIN = 10`（L75）を超えて `$kindFresh` が偽になったため、
> `$key = 'idle:' + $lastKindTs`（L1871）へ落ちて `stat` が手待ちへ戻った。
> **この落ちどころは `work-started.txt` / `startedAt` を一切見ない**（見るのは
> `$lastKind -eq 'resume'` と `$note.outwait` だけ）。

つまり **十分以上ひと続きで働くとフックが古くなり、走り出しの控えが新しいままでも
`stat` が手待ちへ戻る。**

＊これは `終わりの札-1` で名指しした `$FRESH_MIN = 10` と**同じ物差し**。あちらは
　「札が書かれない」形で、こちらは「猫が寝る」形で出ている。

## ② 猫の側を外から塞ぐ

```js
/* 動いているか（v123・猫の矛盾-1）。state.json の stat 一本に頼らない。 */
function isRunning() {
  if (lastStat === '作業中') { return true; }
  return lastStartedAt > 0 && lastStartedAt > lastDoneAt();
}
```

**材料は二つとも、パネルが既に読んでいる値。**

- `lastStartedAt` … `state.json` の `startedAt`（L2608 で既に控えていた）
- `lastDoneAt()` … `notices.json` の札（`allRows`）から、いちばん新しい「終わりました／調べました」の刻

**新しい取得口は増やしていない。`state.json` への追加も要らなかった。**

札を選ぶ所は `lastDonePick()` に一本化した。名を出す `lastDone()` と刻だけ要る
`lastDoneAt()` が別々に絞ると、片方だけ直したときに静かにずれるため。

`runCatTick` … `lastStat === '作業中'` → `isRunning()`。
**寝姿へ戻すのは、終わりの札が走り出しより新しいときだけ**（`else` の枝はそのまま）。
**ヨシ待ちの枝（現場猫で静止）と、作業中のコマ送りの絵は変えていない。**

## ③ 黄色の行

`stateLineText()` も `isRunning()` で見る。

**ヨシ待ちの判定は関数の頭へ移した。**`isRunning()` は「走り出しが最後の終わりより新しい」
だけでも真になるので、後ろに置くと**ヨシ待ちの回まで「作業中」で潰れる**。
作り値で実際に潰れたのを見てから直した（下記 (c) の一度目）。
下に残った同じ枝は届かなくなるので外した。

## ④ 版と panel-check

| 場所 | 値 |
|---|---|
| `PANEL_VER` | `'123'` |
| `verTag` の字 | `panel v123（9月8日）` |
| `panel-ver.txt` | `123` |

**panel-check … 全てPASS（✓51／✗0）。**

## ⑤ 作り値（三通り）

写しに probe を差し、`fetch` と `XMLHttpRequest` を**偽物へ差し替えて**回した。
**本物の ntfy・push・commit は一度も叩いていない。**

| 場合 | 動いている判定 | 猫の絵 | 黄色の行 |
|---|---|---|---|
| **(a)** 走り出しあり・終わり無し | `true` | `cat1.png`（コマ送り） | 作業中、終了予定不明（経過30分） |
| **(b)** 終わりが走り出しより新しい | `false` | `cat-sleep.png` | 作り値の終わり が終わりました 10:28・次の指示待ち |
| **(c)** ヨシ待ち | `true` | `panel-icon-white.png`（静止） | ヨシを返してください |
| （参考）stat が作業中 | `true` | `cat2.png` | 作業中、終了予定不明（経過5分） |
| （参考）走り出し無し・終わり無し | `false` | `cat-sleep.png` | 次の指示待ち |

写しの中で拾った画面の誤り … **無し**。

## 公開側の実読み

```
HTTP 200 / 119,253バイト
isRunning の定義            : 1件
runCatTick が isRunning     : 有
黄色の行が isRunning        : 有（ヨシ待ちが先）
lastDonePick / lastDoneAt   : 各1件
旧 lastStat === '作業中' の残り : 3件
  （isRunning の中／v82 の由来を書いた注記／「作業中 1件：」の写しの行。どれも意図して残す）
PANEL_VER 123 ／ verTag v123 ／ panel-ver.txt 123
```

**版は三箇所とも 123 で一致。**

## 残す穴（直していない）

`stat` が十分で手待ちへ落ちること自体は、`watch-notify.ps1` の側にそのまま残っている。
今回はパネルの側を外から塞いだだけで、**知らせ（😸 走り出した／✅ 終わりました）の判定は
今までどおり `stat` の鍵で動く**。`終わりの札-1` で名指しした「札が書かれない」は、
この物差しを直さない限り残る。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **171件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`通知の出口-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-2.md) | 09-06 02:23 | 通知の出口-2 — 出口で60秒のあいだ束ねる |

<!-- 控えの一覧 ここまで -->
