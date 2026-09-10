# pub-read の始末と、長く走る命令の上限（印 y0910-1305-3）

**終わり（残り2件）** — 二・三・四は済み。一は一行で出した。五は（1）まで進み、残りは押しの黙り-1 と土台の直し-1。

## 一、押しの錠の名（別件として残す）

| | |
|---|---|
| 正しい名 | `Local\ClaudeGitPushGate`（`push-mine.ps1:24`・`heavy-push.ps1:52`） |
| `git-push.ps1:150` の名 | `LocalClaudeGitPushGate`（`\` が一枚落ちている） |
| 食い違いで何が起きるか | **別々の錠**になり、常駐の四人（board／notices／ntfy-sent／usage）と、手押し・重い押しとが**互いに待たない**。2026-09-04 の「24.7分の詰まり」の直しが半分しか効かない |

**直していない。** 次で決める。

### 公開の止まり-1 の前提について（直しは入れていない）

仰せのとおり、この件で**新たな直しは入れていません**。ただ、既に入っている二つ（`git-push.ps1` の
道の落とし／`pipe-check.ps1` の配列）は commit 済みなので、**取り消すかどうかだけ**ご指示ください。

＊こちらの読みは `?_chk=` を付けていました。取り置きとは別に、**`origin/main` そのもの**が
遅れていました——`git show --stat 6439015a` が `notices.json` を **160行**入れ替えており、
公開の元になる枝に16枚が入っていなかったことになります。とはいえ**判断はそちらにお預けします**。

## 二、pub-read を直した

**① 読む字を UTF-8 に釘付けにした** — `curl -o <控え>` で落とし、
`[System.IO.File]::ReadAllBytes` → `[Text.Encoding]::UTF8.GetString` で組み直す。
`Get-Content -Encoding` の解釈にも委ねない。**化けの正体**は、`curl | Out-String` が
機械の字の種別（CP932）で組み直していたこと。

**② 読めない回は一行だけ** — 訳を取り、`' ('` から後ろを落として60字で切る。
`ConvertFrom-Json` の言い分は「`Unterminated string passed in. (49): [{"title":…`」のように
**中身をそのまま抱えて来る**ので、落とさないと化けた札が丸ごと訴えと押し送りに乗る。

### 作り値（作法14「写しに probe」・偽の送り手・写しは消した）

本物の98〜158行を**字面のまま**抜き、`curl` の一行だけを `Fake-Fetch` へ差し替えて回した。
**本物の公開側も ntfy も叩いていない。**

| 作り値 | 読めた刻 | 訴え | 中身 |
|---|---|---|---|
| **読める回**（手元より1時間古い） | `1789016854`（差60分） | `pub-late` **1件・1行・31字** | 公開側が 60分 遅れている（手元のいちばん新しい札より古い） |
| 読める回（遅れ無し） | `1789020454`（差0分） | **0件** | — |
| **読めない回**（途中で切れた JSON） | 読めず | `pub-read` **1件・1行・56字** | 公開側の notices.json が読めなかった：**Unterminated string passed in.** |
| 読めない回（中身が空） | 読めず | `pub-read` 1件・1行・30字 | …読めなかった：**中身が空** |
| 読めない回（控えが落ちてこない） | 読めず | `pub-read` 1件・1行・35字 | …読めなかった：**控えが落ちてこない** |
| 化けた字（CP932 のバイト） | `1789020454`（差0分） | **0件** | 刻は無事なので通る（UTF-8 に釘付けにした効き目） |

**本文は一件も載っていない**（いちばん長い回で56字）。`pipe-check.ps1` err=0・572行・BOM有。

## 三、y0910-0052＝甲は入っている（出し直しの確かめ）

`inbox-watch.ps1:373` に `if ($ordMark) { $ordMark = $ordMark.Trim() }` が在る。
**常駐も新しい台本で走っている** — pid 8180・起動 **09:33:35** ＞ 台本の更新 **01:22:00**・本数1。
黒い窓で通らなかった分は、これで出し直せています。**入れ直しは要りません。**

## 四、自動モードは窓限りのまま

既定にはしません（`~/.claude/settings.json` に `permissions` の節は**無いまま**）。
③の読むだけの台本は、先のヨシどおり `.claude/look.js` ＋ allow 二項で入っています。
＊この回の調べは**すべて `look.js` で通しました**（承認は一度も出ていません）。

## 五(1)、13時間の詰まり — 三と四

**三、何が走っていたか（字面）**

```
cat > "$SC/first-sense.js" <<'JS'  …（台本の全文）… JS
node "$SC/first-sense.js" koushu-handan.html "$SC/fs-before.json" 2>/dev/null
```

説明は `Capture the before answers`、呼びの上限は **500000ms（8分20秒）**。
控えの最後の項目は **2026-09-09T11:00:21Z＝20:00:21**、**その結果は無い**。

**どこで詰まっていたか … 出力待ち。**無限に回っていたのでも、入力待ちでもない。
台本の中の `execFileSync(EDGE, […--dump-dom…], { maxBuffer:1<<28 })` に**上限が無く**、
headless の Edge が終わらないかぎり待ち続ける。**呼びの側の500秒は効かなかった**
（殻を切っても、孫の Edge が出はけの管を握ったままなので返らない）。

**同じ形の詰まりは前にもある。**

| いつ | 何が起きたか |
|---|---|
| 2026-08-23 | 置き去りの検査を `--headless` で数えたら **16本中2本**しか当たらず、`koushu-` の目印で数え直した |
| 2026-08-24 | フル版を前面／背後で回して**四回続けて⑯前後で切断**。以後は `Start-Process` で切り離す（作法18） |
| 2026-09-04 | 常駐の押しと手押しが重なって **24.7分の詰まり**（msedge 5本・git 3本） |
| **2026-09-09** | **13時間5分**。上の一件 |

**なぜ20分で片付かなかったか（今回いちばん効く発見）** — 片付けの見張り
（`inbox-watch.ps1` の `Sweep-Stale`）は `--user-data-dir` の中の **`koushu-`** で置き去りを見分け、
20分超を落とす。ところが台は一時ディレクトリを **`fs36-`** の名で作っていた。
**目印から外れていたので、片付けの手が届かなかった。**

**四、上限を置いた**

| どこ | 値 | 理由 |
|---|---|---|
| 待つ側（`execFileSync`） | **180000ms（3分）** | Edge の起こしに約30秒・4手を流すのに約10秒。その4倍以上の余裕。超えたら `SIGKILL` で殺して**その場で返す** |
| 呼びの側 | **300秒** | 内側より長くする。内側が先に自分を殺し、**どこで切れたか**を残せるようにするため |

＊`first-sense.js` は既に区切り（`<始まり>／<個数>`）と3分の上限を持っていた（前の窓の直し）。
**この回で足したのは一時ディレクトリの名**——`fs36-` → **`koushu-view-fs36-`**（`node --check` 通過）。

**CLAUDE.md へ 作法35 を足した**（長く走る命令は、内側にも上限を置く）。四つの決めごと
——内側の上限180秒／外側は300秒／一度に全部流さない／一時ディレクトリの名に `koushu-`——と、
30分超はそもそも `Start-Process` で切り離す（作法18）を一行で結んである。

## 残り

`残り2件` — ①**押しの黙り-1**、②**土台の直し-1**（y0909-1921 のヨシ済み・実装へ）。
別に、**一の錠の名**をどうするかの裁定と、**公開の止まり-1 で入れた二つの直しを残すか**の裁定。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **194件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0910-1305-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-3.md) | 09-10 15:16 | pub-read の始末と、長く走る命令の上限（印 y0910-1305-3） |
| [`y0910-1305-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-2.md) | 09-10 15:04 | 読むだけの台本と、公開の止まりの割り直し（印 y0910-1305-2） |
| [`y0910-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1330.md) | 09-10 13:36 | 公開の止まり-1（印 y0910-1330） |
| [`y0910-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305.md) | 09-10 13:09 | 承認の足止めと自動モードの戻し道（印 y0910-1305） |
| [`y0910-0052-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052-2.md) | 09-10 01:30 | 一分おきの走り出し-1-2 — 甲で直した。作り値は三通りとも一本 |
| [`y0910-0052.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052.md) | 09-10 00:56 | 一分おきの走り出し-1 — 口を塞いだ。原因は**件名の末尾の空白** |
| [`ヨシの猫の組み直し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E7%B5%84%E3%81%BF%E7%9B%B4%E3%81%97.md) | 09-09 19:26 | ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる** |
| [`ヨシの猫のマス目.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E3%83%9E%E3%82%B9%E7%9B%AE.md) | 09-09 16:38 | ヨシの猫を差し替え-1 — マス目の割り出しと、箱を上げる案 |
| [`土台の直し-1の四段.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%9B%9B%E6%AE%B5.md) | 09-09 13:02 | 土台の直し-1 ① — 四段の材料の出どころ（名指しの一覧） |
| [`ヨシの猫を差し替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%82%92%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88-1.md) | 09-09 13:02 | ヨシの猫を差し替え-1 — 素材を測った。**輪郭が潰れるので止まる** |
| [`巡回の止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-09 12:16 | 巡回の止まり-1 — 11:02〜11:45 の43分 |
| [`土台の直し-1の材料.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E6%9D%90%E6%96%99.md) | 09-09 11:59 | 土台の直し-1 ① — 切り候補の四段は、いまどこから値を取っているか |
| [`猫を全部白へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%82%92%E5%85%A8%E9%83%A8%E7%99%BD%E3%81%B8-1.md) | 09-09 11:06 | 猫を全部白へ-1 — 頭の猫が地に沈む件（全状態） |
| [`黒猫の待機-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-3.md) | 09-09 09:54 | 黒猫の待機-3 — ヨシ待ちの猫を白から黒へ戻す |
| [`土台の直し-1の宣言.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%A3%E8%A8%80.md) | 09-09 05:55 | 土台の直し-1 — 宣言（ヨシ待ち） |
| [`serifuの再抽出.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/serifu%E3%81%AE%E5%86%8D%E6%8A%BD%E5%87%BA.md) | 09-09 04:50 | serifu.txt / serifu-adv.txt の再抽出（作法17） |
| [`兎の台詞-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E5%8F%B0%E8%A9%9E-1.md) | 09-09 03:27 | 兎の台詞-1（出し直し）— serifu.txt の中の兎 |
| [`写しの重さ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%87%8D%E3%81%95-1.md) | 09-08 22:26 | 写しの重さ-1 — note-at-stop.txt は帳面として太るか |
| [`取り残しの検収-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97%E3%81%AE%E6%A4%9C%E5%8F%8E-1.md) | 09-08 22:03 | 取り残しの検収-1 |
| [`前の仕事の取り残し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%89%8D%E3%81%AE%E4%BB%95%E4%BA%8B%E3%81%AE%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97.md) | 09-08 21:15 | 前の仕事の取り残し — 次の指示が先に来た回の落ち |

<!-- 控えの一覧 ここまで -->
