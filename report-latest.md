# 06:50 の復帰後に溜まっていた枠の行方と、会話の控えの大きさ

**終わり（残り0件）** — 2026-09-21 08:45（VAIO）。**読みだけ。台本は一字も直していない。**
`koushu-handan.html`・`stable` には触っていない。

## 1. 溜まっていた枠は **実行された**（捨てられていない）

台帳に二行そろって残っている。**同じ字の枠が二度届いた分**で、どちらも済。

| 受領 | 枠の頭 | 結末 |
|---|---|---|
| **06:42:06** | watch-notify が 03:00 から止まり state.json も … | 済 |
| **06:42:10** | 同上（二度目） | 済 |
| 06:44:45 | 42 から claude の窓が応答なしで固まり … | 済 |

**結末の全文（台帳の字そのまま）**

```
済：元は空きメモリの枯渇。使用量の読みは 02:46・02:57・03:56 と正常に通っており犯人ではない
（止まった段は押し直し）。置き去りの gh 53分・git 72分と居座った巡回を落として空き 256→407MB、
足跡と手元 state.json の at が動くのを実測（札 y0921-0655）
```

**つまり「02:43 前の写しへ戻す」は、実行したうえで“戻さない”と判じられている。**
枠の後段に「**メモリが元ならそのままにして結論だけ書け**」とあったので、その通りに動いた形。

## 2. 使用量の見張り（80%／95%）は **今の台本に残っている**

`watch-notify.ps1`（**更新 09-21 02:31:00・3552行**）を字面で数えた。

| 探した字 | 件数 |
|---|---|
| `USAGE_MARKS` | **2** |
| `Check-UsageOver` | **2** |
| `Usage-Fail` | **6** |
| `usage-over.txt` | **2** |

**四つとも在る。消えていないので、入れ直しは要らない。**
＊台本の更新時刻が **02:31 のまま**であることが裏付けになる——**02:43 以降、誰もこの綴りを触っていない**。
＊直近の写しは `.bak-20260920d`（09-20 23:07・3453行）。いまの 3552行との差 99行が、
　使用量の敷居（＋`Emit-Missed` の括り出し）にあたる。

## 3. 会話の控えの大きさと、claude.exe の使用メモリ

| 見るもの | 値 |
|---|---|
| 控えの綴り（この窓の全部） | **59.7 MB／55,366,334 字／26,960 行**（うち 09-20〜21 が 3,162 行） |
| **直近200行の字数** | **449,751 字**（おおよそ **20万 token** の目安） |
| claude.exe pid 4412（06:36:13 起動） | 作業域 **433 MB**／私用 **580 MB**／応答あり |
| claude.exe pid 4764（06:44:52 起動） | 作業域 **365 MB**／私用 **578 MB**／応答あり |
| 機械 | 空き **532 MB**／全体 **3,975 MB**／**claude 二本の私用計 1,155 MB** |

### **46万字のままなので `/clear` が要る**

直近200行だけで **449,751 字**——ご指摘の「46万字」はここ。**一回の応答ごとに、この量を読み直している。**
3,975 MB の機械で **claude 二本が私用 1,155 MB（約29%）**を占めており、
**03:00〜05:00 の止まり（空き 256MB・段が軒並み時間切れ）と同じ姿へ戻りやすい。**

**畳む前の支度は済んでいる**（作法30）。

- `report-latest.md` … この札で最新（直前は `y0921-0800`）。push 済み。
- 積み残し … **台帳の未了は 0 件**。
- 控え（`work-note.txt`）… この回の中身へ書き直してある。

**＊`/clear` を打つのは人の側。こちらからは打てないので、支度が済んだことだけ伝える。**

**あわせて、窓が二つ開いている。** 片方（**pid 4412**）は 06:36 に
`schtasks /Run /TN ClaudeCodeAtLogon` を手で起こしたときの窓で、**仕事をしていない**。
**閉じれば約 580 MB が戻る**——`/clear` より効き目が大きい。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **346件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-0845.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0845.md) | 09-21 08:45 | 06:50 の復帰後に溜まっていた枠の行方と、会話の控えの大きさ |
| [`y0921-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0800.md) | 09-21 08:01 | mem-orphan.ps1 の作り値（置き去り落とし・空きの見張り）と、実地の落とし |
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

<!-- 控えの一覧 ここまで -->
