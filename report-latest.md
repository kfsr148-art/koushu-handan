# 公開側 state は戻っている／置き去りの gh・git を常駐が落とす／空き300MB割れで一発

**終わり（残り0件）** — 2026-09-21 07:41（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## ① 公開側 state.json の at は今の刻へ動き、state-stale は ok へ戻った（実読み）

`https://kfsr148-art.github.io/koushu-handan/state.json?_chk=…` を二度、実際に取って読んだ。

| 読んだ刻 | HTTP | 公開側 `at` | 遅れ |
|---|---|---|---|
| 07:17:32 | 200 | 1789941789 ＝ **07:03:09** | 14分 |
| 07:30:15 | 200 | 1789942905 ＝ **07:21:45** | 9分 |

前の回（06:44）に凍っていた **05:00:23** から動き、**二度の実読みのあいだにも 07:03:09 → 07:21:45 と進んだ**。
公開側の `subj` も「公開側 state.json の at が今の刻へ動き、state-sta」＝いまの件名に替わっている。

**訴えも戻っている。**

```
2026-09-21 06:51:19  state-stale   公開側の生存が 110分 書かれていない（state.json の at）。…
2026-09-21 07:11:00  ok            訴えは無くなった
```

`pipe-warn.json` も `at 2026-09-21 07:11:02` ／ `kinds []` ／ `text ""` で空。

### 戻ってはいるが、押しの時間切れは続いている（②の元）

`git-push.log` の「時間切れで切った」は **09-21 だけで31件**（09-20＝7件・09-19＝6件・開設以来101件）。
形はいつも同じで、**切ったのは包みだけで、中身の git は生き残る**。

```
07:11:27  board  時間切れで切った（20秒）: git … push --no-verify -q origin main
07:11:27  board  push が通らなかった（-1）。pull --rebase して一度だけ押し直す
07:11:57  board  時間切れで切った（30秒）: git … pull --rebase --autostash -q origin main
07:11:57  board  pull --rebase が通らなかった（-1）。押し直さない
```

07:17 に数えた実物がこれ。

```
git.exe pid=9492 ppid=8620（GONE） 07:11:27 起動 … 上の pull の中身。親は時間切れで殺された側
git.exe pid=8304 ppid=9492        07:11:27 起動 … その子（git merge-base）
```

**親を失った git が走り続け、次の押しと取り合って、また時間切れになる。**
これが自分で自分を養う輪になっていた。②はこの輪を切る。

---

## ② 置き去りの gh・git を、常駐 inbox-watch の巡回が落とす

### 置いた物

| ファイル | 何を足したか |
|---|---|
| `~/.claude/mem-orphan.ps1`（新規・170行） | `Sweep-Orphans` と `Check-FreeMem` |
| `~/.claude/inbox-watch.ps1` | L52-59 で dot-source、L1191-1196 で巡回から呼ぶ |
| `~/.claude/daily-notice.ps1` | L197-198 `mem-ok` を訴えの数から外す |

### 落とす決め

- **親が居ない**（かつ生まれて **90秒**を過ぎている）→ 落とす
- **20分を超えて動かない**（前の巡回から CPU 秒が 0.05 秒も増えていない）→ 落とす
- 落とす物の **gh／git の子孫も一緒に**落とす（親だけ落とすと孤児が2分居座るため）
- 見るのは **2分に一度**（15秒 × 8巡）。pid の使い回しは「親の起動が自分より後なら親は居ない」で避ける

**甲乙丙の裁定はこちらで一つ選んだ（作法5②）。**
採ったのは「**親不在 または 20分超**」の**または**の読み。
**採らなかったのは「親不在 かつ 20分超」の AND の読み**——07:11 の置き去り（git pull）は
生まれて6分だったので、AND だと**あと14分**居座り、そのあいだ押しが通らないため。
代わりに親不在の側へ **90秒の猶予**を置いて、走り出しの一瞬と pid の使い回しを避けた。

### 記録（`~/.claude/pipe-warn.log`）

落とした回だけ、**落とす前と後の空きを同じ一行**に書く。

```
2026-09-21 07:27:44  orphan-kill   置き去りの gh／git を 4本 落とした（git.exe pid=4204・5分・親不在／
git.exe pid=976・0分・親不在／git.exe pid=7332・0分・落とす物の子／git.exe pid=4144・0分・落とす物の子）。
空き 445MB → 449MB
```

### 作り値

**偽の並びで16通り**（写しに probe を差し込み、`Stop-Process` は記録係に差し替え・作法14）。

| | 場面 | 望み | 結果 |
|---|---|---|---|
| 甲 | **25分放置の偽の子**（親不在） | 落ちる | **PASS**（90001 を落とした） |
| 乙 | **5分の子**（親が居て働いている） | 落ちない | **PASS**（0本） |
| 丙 | **親が居る子**（25分だが CPU が動いている） | 落ちない | **PASS**（0本） |
| 丁 | 親不在・5分 | 落ちる（**または**の読み） | PASS |
| 戊 | 親不在・30秒 | 落ちない（猶予90秒） | PASS |
| 己 | 親あり・25分・無動作 | 落ちる | PASS |
| 庚 | 落とす物の子も一緒に | 両方落ちる | PASS |
| — | 行に落とす前／後の空きが両方入る | 入る | PASS |

**実物でも一本**（`Stop-Process` と process の読みは本物のまま・猶予だけ 90→3秒）。
本物の `git.exe hash-object --stdin` を親無しで立て、巡回に落とさせた。

```
立てた偽の子: git.exe pid=976 親pid=2348 生存=False
落とす前：git 4204(親不在・5分)／gh 1812(親生存・2分)／git 7332／git 976(親不在)／git 4144
→ 4本落とした（空き 445→449MB）
落とした後：gh.exe pid=1812 だけが残った
```

**同じ回で、本物の置き去り（pid 4204・5分・親不在＝また別の `pull --rebase` の中身）も一緒に落ちた。**
**親の生きている gh（pid 1812・2分）は落ちていない**——これが乙・丙の実物での裏付けになる。

合計 **PASS=16 FAIL=0**（偽の並び）＋ **PASS**（写しでの実物）。

### 通しの確認（本番の常駐が落とすか）

上の二つは**写し**を駆動した物なので、**本番の巡回に載っているか**を別に見た。
本物の `git.exe` を親無しで立て、こちらは何もせず、常駐（pid 6604）が落とすのを待った。

```
07:36:37  立てた: git.exe pid=5600（親 7364）
07:39:13  常駐が落とした
          pipe-warn.log … orphan-kill  置き去りの gh／git を 2本 落とした
                          （git.exe pid=7364・3分・親不在／git.exe pid=5600・3分・落とす物の子）。
                          空き 440MB → 433MB
          inbox-watch.log … 置き去りの gh／git を 2本 落とした（空き 440→433MB）
07:39:18  生死を見て落ちていることを確かめた（立ててから 160秒）
```

**PASS。** 160秒は「親不在の猶予 90秒 ＋ 2分ごとの巡回」の合わさった値で、決めどおり。
＊この回の空きは **440 → 433MB と下がっている**。落として返る分より、同じ帯で動いている
　ほかの仕事が食う分のほうが大きかったためで、**数字は取り繕わずそのまま載せる**。
　空きが返るのは、07:27 の実物の回（445 → 449MB）のように**置き去りが重い時**。

---

## ③ 空きメモリが 300MB を割ったら一発だけ鳴らす

- 見るのは **1分に一度**（15秒 × 4巡）
- **300MB 未満**で `🪟 異常です（空きメモリが NNNMB）` を**一発**。印は `~/.claude/mem-low.txt`
- **400MB へ戻るまで二度鳴らさない**。戻ったら印を消し、`pipe-warn.log` へ `mem-ok` を一行
- 戻ってから再び割れば、また一発だけ鳴る
- `koushu-handan.html` には**一行も触っていない**

### 作り値（見せかけの空きを差し込み、送り手は偽物）

| 空き | 望み | 結果 |
|---|---|---|
| 350MB | 鳴らない | PASS（0発） |
| 280MB | 一発鳴る | PASS（1発・題 `🪟 異常です（空きメモリが 280MB）`） |
| 250 → 120MB | 二度目は鳴らない | PASS（1発のまま） |
| 380MB | まだ解けない | PASS（印あり） |
| 410MB | 印が消える・鳴らさない | PASS |
| 290MB | また一発鳴る | PASS（2発） |

鳴った本文（一発目）。

```
空きメモリが 280MB まで落ちています（敷居 300MB）。

＊この帯では見張りの段が時間切れで切られ、押しが通らなくなります。
＊置き去りの gh／git は常駐が2分ごとに落としています。
＊400MB へ戻るまで、この知らせは二度鳴りません。
```

---

## 作法29 の順（知らせの要に手を入れたので）

1. 写しを取った … `inbox-watch.ps1.bak-20260921`（77036バイト）／`daily-notice.ps1.bak-20260921`（13496バイト）
2. 直した
3. **構文検査を通した**（`PSParser::Tokenize`）… `inbox-watch.ps1` OK・1209行／`daily-notice.ps1` OK・252行／`mem-orphan.ps1` OK・170行。**三つとも BOM 付き UTF-8**
4. 通らなかった物は無いので、戻していない
5. **常駐を起こし直した** … 旧 pid 9496（00:44:14 起動）を止め、新 pid **6604（07:29:23 起動）**。
   台本の更新は **07:28:29** なので「常駐の起動 ＞ 台本の更新」を満たす

---

## 作法36 の突き合わせ（回る段の一覧）

**手元で回る段**（常駐 `inbox-watch.ps1` の巡回・15秒ごと）

| 順 | 段 | 間 | 今回 |
|---|---|---|---|
| 1 | `Check-Frames` | 毎巡 | — |
| 2 | `Publish-Status` | 毎巡 | — |
| 3 | `Sweep-Stale`（置き去りの msedge） | 2分 | — |
| 4 | **`Sweep-Orphans`（置き去りの gh・git）** | **2分** | **足した** |
| 5 | **`Check-FreeMem`（空きメモリ）** | **1分** | **足した** |
| 6 | `Pull-Mailbox` | 1分 | — |
| 7 | `Check-Todo` | 毎巡 | — |
| 8 | `Check-WatchStale` | 1分 | — |
| 9 | `Ping-Outside` | 毎巡 | — |

**毎分の `watch-notify.ps1` 側** … `pipe-check` が `pipe-warn.log`／`pipe-warn.json` を組む。
新しい種 `orphan-kill`・`mem-low` は**訴えとして数える**（起きたことを定時に知らせたいため）。
`mem-ok` は**戻りの控え**なので `daily-notice.ps1` の除外へ足した（`ok`・`heavy-skip`・`rung` と同じ扱い）。

**雲で回る段**（`check.yml`）… `check`（`check.js` フル版・21視野）→ `deploy`。
**今回は本体・`check.js`・`ver.txt` を一行も触っていないので、雲の段は無変更で、掛からない**
（控えの押しは検査に掛けずそのまま配信される）。

---

## 残り

**残り0件。**

- ① 公開側 state の実読み-1 … 済
- ② 置き去り落とし-2 … 済
- ③ 空き300の見張り-3 … 済

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **344件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-0730.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0730.md) | 09-21 07:39 | 公開側 state は戻っている／置き去りの gh・git を常駐が落とす／空き300MB割れで一発 |
| [`y0921-0655.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0655.md) | 09-21 06:52 | 見張りの止まりの元は「空きメモリ」。使用量の読みではない |
| [`y0921-0245.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0245.md) | 09-21 02:41 | ①使用量の見張りを足した ②控えの押し残し230件を通した ③鍵の作り直し方を置いた |
| [`y0921-0140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0140.md) | 09-21 01:36 | ①写しの頭の道を一意の名にした（panel v143） ②使用量の敷居と、~/.claude の写しの調べ |
| [`y0921-0115.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0115.md) | 09-21 01:13 | 再起動で切れた二つの直しは**入っている** — 作り値の結果と予定表の写し |
| [`y0921-0110.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0110.md) | 09-21 00:55 | 電源復帰からログオンまでの17.5分 — 自動ログオンは61秒で通っていた。待っていたのは「プロファイルの読み込み16分40秒」 |
| [`y0921-0050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0050.md) | 09-21 00:48 | 再起動で切れた二つを塞いだ／WeeklyReboot と AfterReboot を止めた |
| [`y0921-0030.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0030.md) | 09-21 00:33 | 再起動の稽古の戻り — 26分の穴は「ログオンしていない間、予定表が一つも走らない」 |
| [`y0920-2320-reboot.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2320-reboot.md) | 09-20 23:17 | ③ 再起動の稽古 — 手順と、戻らなかったときの戻し方（再起動の直前に書いた） |
| [`y0920-2315.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2315.md) | 09-20 23:16 | ①done-swept の元を塞いだ ②ClaudeAfterReboot を作った ④蔵と記録の大きさ ⑤期限の調べ |
| [`y0920-2300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2300.md) | 09-20 22:52 | ①古い並びを掴んだら取り直す（panel v142）／②「続けて」「進めて」は合図として扱う |
| [`y0920-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2100.md) | 09-20 21:02 | pub-late は ok へ戻った／配信の関門を偽の走りで当てた |
| [`y0920-2040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2040.md) | 09-20 20:39 | pub-late（公開が56分遅れ）の元 — 長い回の配信が、古い版を後から上書きしていた |
| [`y0920-2010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2010.md) | 09-20 20:10 | 黄色い行が動かない・猫が走らない — 元を突き止めて三つ直した |
| [`y0920-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1953.md) | 09-20 19:53 | 番号の始末と雲の走りの確かめ（panel v140） |
| [`y0920-2000.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2000.md) | 09-20 19:29 | 「写せます（N件）」の札を公開の並びから外した（丙）／「延びています」の時計は受け取り済み |
| [`y0920-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1945.md) | 09-20 19:20 | 公開側40枚の「写せます（N件）」の札は、パネルで使われているか |
| [`y0920-1930.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1930.md) | 09-20 19:18 | 「延びています」の時計を、宣言のヨシ待ちの間は止めた |
| [`y0920-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1915.md) | 09-20 19:14 | report-latest.md はどこに書いているか／写しを機械の手にした |
| [`y0920-1900-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1900-2.md) | 09-20 19:03 | 同じ字の枠の二度目は、走り直さず一度目の札を出し直す |

<!-- 控えの一覧 ここまで -->
