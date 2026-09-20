# ①写しの頭の道を一意の名にした（panel v143） ②使用量の敷居と、~/.claude の写しの調べ

**終わり（残り0件）** — 2026-09-21 01:40（VAIO）。②は**読みだけ・直しはしていない**。
`koushu-handan.html`・`stable` には触っていない。

## ① 「写す」の頭の道を `notices-〈刻〉.json` にした（**panel v143**）

**なぜ** … `notices.json` は**毎回同じ道**なので、受け取る側の読み口が**前に読んだ中身を返す**ことがある。
`latest-name.txt` が指す `notices-<刻>.json` は**一度も取られていない道**なので、必ずその時の中身が来る。

**組み方** … 巡回のたびに `latest-name.txt` を一行だけ取り（`refreshCopyUrl()`）、
`https://` で始まり `notices-` を含むときだけ**写しの頭に置く道**（`copySrcUrl`）を差し替える。
読めない回・形が違う回は**今までどおり `notices.json`**。使う先は二つ——
**まとめて写す**（`buildBundle` の一行目）と**個別の写す**（`withPage`）。

**作り値**（本物の `refreshCopyUrl`／`withPage` を切り出し、**偽の fetch** で回す）

| 形 | 写しの頭 |
|---|---|
| **イ `latest-name.txt` が読める** | **…/notices-1789905918.json**（一意の名） |
| **ロ 読めない（HTTP 404）** | …/notices.json（今までどおり） |
| ハ 道の形が違う（名だけ） | …/notices.json |
| ニ 一意でない名を指している | …/notices.json |
| ホ 網が落ちた（例外） | …/notices.json |

**版は三箇所そろえた** … `PANEL_VER = '143'` ／ 下の字 `panel v143（9月21日）` ／ `panel-ver.txt` = 143。
＊「URLを写す」の釦（`#btnCopyUrl`）は**今までどおり `notices.json`**を渡す。あちらは道だけを渡す口なので触っていない。

## ② 読みの結果

### 2-1 使用量が敷居を越えたときに鳴る札は **無い**

**いま在るのは二つとも「記録するだけ」。**

| 仕掛け | すること | 敷居 |
|---|---|---|
| `watch-notify.ps1` の使用量の段 | `five_hour` ／ `seven_day` ／ `weekly_all` ／ `weekly_scoped/Fable` を読み、**値が動いた回だけ** `usage.json` を押す | **無し**（何％でも鳴らない） |
| `daily-notice.ps1`（毎朝9時） | 週全体・週Fable・残り日数を**一日一回の便りに書く** | **無し**（便りに数が載るだけ） |

**つまり 90% を越えても、越えた瞬間には何も鳴らない。** 気づけるのは翌朝の便りか、パネルの数を見たときだけ。

**直し方（案）** … 使用量の段の終わりで、四つの数を敷居と突き合わせ、**初めて越えた回だけ**
「🪟 異常です：使用量が90%を越えました（週全体92%／週Fable88%／セッション95%）」を一発出す。
一度だけにする仕掛けは既にある形をそのまま使う——**`~/.claude/usage-over.txt` に
「種類＝越えた刻」を控え、同じ種類では二度鳴らさない。窓が変われば（`resets_at` を跨げば）印を落とす。**

| | 中身 |
|---|---|
| **敷居** | **90%**（四つとも同じ。週全体・週Fable・セッション＝`five_hour`・`seven_day`） |
| **一度だけ** | `usage-over.txt` に `種類=刻` を置き、**同じ窓の間は再び鳴らさない**。`resets_at` を過ぎたら印を落として次の窓で鳴れるようにする |
| **代償** | ①**数が上下すると、落ちて戻った回にもう一度鳴る**恐れ（`resets_at` を跨いだかで見分けるので、窓の中なら鳴らない）②90%は**手遅れに近い**——止めるには遅い。80%で予告、90%で異常の**二段**にすると鳴りすぎる恐れがある ③使用量の取得が落ちている回は**黙る**（いまも同じ） |

### 2-2 `~/.claude` の写しは **外にある。ただし 09-07 から止まっている**

**写し先** … `https://github.com/kfsr148-art/claude-home-backup`（**非公開**・1.8 MiB）。
毎日 03:30 に `ClaudeHomeBackup`（`home-backup.ps1`）が commit ＋ push する作り。

**いまの姿**

| 見るもの | 値 |
|---|---|
| 蔵の最後の commit | **09-07 23:32**（**14日前**） |
| GitHub 側の最後の押し | **09-11 18:31** |
| 押し残し | **229件**（`projects/` 15・`backups/` 11・`*.bak-*` 多数） |
| 予定の最終実行 | 09-20 03:30・**結果 0**（走ってはいる） |

**止まっている訳（押しの記録から）**

```
09-17 03:30  押さない：鍵か話題名が混じっている → orders-open.tsv（話題名） / …
09-18 03:30  押さない：鍵か話題名が混じっている → orders-open.tsv（話題名） / …
09-19 03:30  押さない：鍵か話題名が混じっている → orders-open.tsv（話題名） / …
09-20 03:30  終了コード 128：warning: in the working copy of '.gitignore', LF will be replaced by CRLF …
09-20 03:30  commit するものが無かった
```

**台帳（`orders-open.tsv`）に話題名が載っている**ので、混入検査が毎回止めている。
09-20 は `git add` が **128** で落ち、**何も拾えないまま「commit するものが無かった」で日付だけ刻んだ**——
**この日から、止まっていることすら記録に出なくなった**。

**一覧（台本と設定）**

| 物 | 数・大きさ | 非公開の蔵に入るか |
|---|---|---|
| `*.ps1` | **45本・744 KiB** | **入る** |
| `settings.json` | 5.0 KiB（09-19） | 入る |
| `settings.local.json` | 0.4 KiB（08-08） | 入る |
| `hc-watch.txt` | 0.6 KiB（09-14） | **入る**（中身は hc-ping の合図の道。非公開の蔵なので今のところ可） |
| `CLAUDE.md` | **`~/.claude` には無い**（作法は蔵の中 `koushu-handan/CLAUDE.md`） | 蔵にある |
| **鍵を含む綴り** | `.credentials.json`（0.5 KiB・09-20）／`rc-ntfy-topic.txt` ほか話題名の綴り **7本** | **入らない（`.gitignore` で除外）** |
| 除外されている物 | **128件** | — |

**つまり … 台本と設定は非公開の蔵に写せる形になっているが、14日ぶん止まっている。
鍵と話題名は、どこにも写しが無い**（除外されているので、VAIO が壊れたら失われる）。

**直し方（案）と代償**

| 案 | 直し方 | 代償 |
|---|---|---|
| **甲 いまの非公開リポジトリを直す** | ①混入検査を**「台帳は話題名を伏せて写す」**形にする（`orders-open.tsv` を写すときだけ話題名を `＜伏せ＞` に置換）②`git add` の 128 を**失敗として扱い**、日付を刻まずに次の回へ持ち越す③**3日続けて押せなければ「🪟 異常です」を一発** | ①伏せた台帳は**そのままでは戻せない**（復元時に話題名を手で入れ直す）②失敗のまま毎日鳴ると**うるさい**（3日の猶予で緩める）③**鍵はやはり入らない**——甲だけでは鍵の写しは作れない |
| **乙 鍵だけ別に OneDrive へ毎日一回** | `.credentials.json` と `rc-ntfy-*` を**一つの書庫にまとめ、合言葉で包んで** OneDrive の非同期フォルダへ日に一度写す（`Compress-Archive` ＋ `Protect-CmsMessage` か 7-Zip の `-p`） | ①**合言葉をどこに置くか**が新しい難題（機械に置けば意味が薄い・人が覚えるなら忘れる恐れ）②OneDrive は**同期先が人の目に触れる**（家族の端末にも降りる）③包み方を誤ると**鍵が平文で雲に載る**——いちばん危ない失敗 |
| **丙 両方**（勧め） | 台本と設定＝甲（非公開リポジトリ・毎日）／鍵と話題名＝乙（包んで OneDrive・毎日）。**分けて置く**ので、片方が漏れても他方は無事 | 仕掛けが二つになり、**どちらが止まっても気づく見張り**が要る（3日の沈黙で鳴らす形を両方に付ける） |

＊**いますぐ効く小さな手**もある … `git add -A` の 128 を直し、台帳の話題名を伏せるだけで、
　**14日ぶんの押し残し229件が一度に片付く**。鍵の写しは別立てで考える。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **341件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1900.md) | 09-20 18:50 | 札抜けの直し（甲）— 控えの写しを見張りが持ち、抜けた札を先に一枚立てる |
| [`y0920-1830.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1830.md) | 09-20 18:35 | 16:40:21 の枠（赤い行の直し）に終わりの札が立たなかった訳 |
| [`y0920-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1756.md) | 09-20 17:58 | 赤い行の件（同じ枠の二度目）— **もう直っていて、公開側も戻っている** |

<!-- 控えの一覧 ここまで -->
