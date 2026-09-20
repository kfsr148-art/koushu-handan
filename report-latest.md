# 電源復帰からログオンまでの17.5分 — 自動ログオンは61秒で通っていた。待っていたのは「プロファイルの読み込み16分40秒」

**終わり（残り0件）** — 2026-09-21 01:10（VAIO）。**読みだけ。直しはしていない。**
`koushu-handan.html`・`stable` には触っていない。

## 1. 時系列（イベント記録から）

| 刻 | 記録 | 出どころ |
|---|---|---|
| 23:19:07 | `shutdown.exe` が再起動を始めた | System id=1074 |
| 23:21:27 | 落ちきった | System id=13 |
| **23:21:52** | **電源が戻った** | System id=12 |
| 23:22:26 | 記録の役が開いた（稼働33秒） | System id=6005／6013 |
| **23:22:53** | **認証が開始 → 停止・結果 0**＝**自動ログオンは通っている**（復帰から**61秒**） | Winlogon/Operational id=1／2 |
| 23:22:53 | winlogon の通知先 **`<Profiles>` が「ログオン」の処理を開始** | Winlogon/Operational id=811 |
| 23:22:53 | 「セッション 1 でユーザー ログオン通知を受信」／23:22:54 `ntuser.dat`・`UsrClass.dat` を読み込み | User Profile Service id=1／5 |
| **23:23:53** | **「`<Profiles>` による通知イベント (Logon) の処理に長い時間がかかっています」** | Application id=6005 |
| 23:25:08 | Google Update サービスが**30秒の時間切れ**で開始できず | System id=7000／7009 |
| 23:27:29 | セキュア ブート CA/キーの更新が要る、の報せ | System id=1801 |
| 23:33:38 | Windows Update が更新を探す（16個見つかった） | WindowsUpdateClient id=26 |
| **23:33:43** | **更新の当て込み開始 … KB2267602**（Microsoft Defender セキュリティ インテリジェンス・**1.459.304.0**） | System id=43／44 |
| **23:38:56** | **当て込み成功**（**5分13秒**かかった） | System id=19 |
| **23:39:33** | **`<Profiles>` の処理が終わった＝ログオンが成立**（23:22:53 から **16分40秒**） | Winlogon id=812／User Profile id=2 |
| 23:39:37 | `ClaudeCodeAtLogon` が走る（結果 0）。予定表の `id=332`（ログオンしていない）はここで止まる | 予定表 |
| 23:39:53 | claude.exe が立つ | プロセス |

＊**`Setup` の記録はこの間ゼロ**——**積み上げ更新（CU）やサービス スタックは当たっていない**。
＊自動ログオンの設定は入っている（`AutoAdminLogon = 1`／`DefaultUserName = user`）。

## 2. つまり何が起きていたか

**更新の当て込みは「あった」。** KB2267602（Defender の定義・1.459.304.0）が **23:33:43〜23:38:56 の5分13秒**。

**ただし17.5分の主因はそれではない。** 自動ログオンは **23:22:53 に結果0で通って**おり、
そこから **winlogon の `<Profiles>`（ユーザー プロファイルの読み込み）が16分40秒**かかっている。
Defender の定義更新は**その中に含まれる5分13秒**で、**残る11.5分はプロファイルの読み込みそのもの**。

**内訳の目安**

| 区間 | 長さ | 中身 |
|---|---|---|
| 23:22:53〜23:33:43 | **10分50秒** | プロファイル読み込みの前半。Defender の設定変更が17件・Google Update の30秒時間切れ・セキュア ブートの報せ。**この機械（4GB）で、起動直後の読み込みが詰まっている** |
| 23:33:43〜23:38:56 | **5分13秒** | **KB2267602 の当て込み**（Defender 定義） |
| 23:38:56〜23:39:33 | 37秒 | 後片付けとログオンの成立 |

＊予定表の `Claude*` は **`Logon Mode: Interactive only`** なので、**この16分40秒はまるごと「走らない時間」**になる。
　`id=332`（ログオンしていないので起動せず）が56回積まれたのは、ここ。

## 3. 直し方と代償（**直しはまだしない**）

**前提**：09-21 に **`ClaudeWeeklyReboot` は無効にした**ので、**土曜の自動再起動はもう起きない**。
下は「人が再起動したとき」に効く話として書く。

| 案 | 直し方 | 代償 |
|---|---|---|
| **甲 再起動の前に更新を当てない** | Windows Update の**アクティブ時間**を落とす時刻に掛けて当て込みを止める／Defender の定義更新の刻を `Set-MpPreference -SignatureScheduleDay/-SignatureScheduleTime` で再起動の時刻から離す | **効くのは5分13秒だけ**（主因の11.5分は残る）。定義が古いまま走る時間が延びる。アクティブ時間は**最大18時間**しか取れず、夜中の再起動とは相性が悪い |
| **乙 点検の刻を延ばす** | ~~`ClaudeAfterReboot` を10分→25分~~ → **いまは `ClaudeAfterLogon`（Startup・ログオンの5分後）**なので、**そのままで足りる**。Startup の物は**プロファイルが読み終わってから**走るため、16分40秒の中では走らない | 延ばすほど**異常に気づくのが遅れる**。いまの形（ログオン＋5分）は、遅いログオンでも自然に後ろへずれる |
| **丙 プロファイルの読み込みを速くする**（主因に効く） | ①Defender のリアルタイム検査から `~/.claude` と蔵（`koushu-handan`）を除く ②Startup と自動起動の重い物を減らす（RealPlayer Cloud・Google Update は起動に失敗している）③常駐の起こしを遅らせる | ①**検査の穴になる**（外から来た綴りも素通りする）。②③は**戻りが遅くなる**物が出る。どれも**測り直さないと効き目が分からない**（16分40秒の内訳は記録からは割れない） |
| **丁 ログオンを待たない** | `Claude*` の予定を**「ログオンしていなくても実行」**へ変える | 画面に触れる仕事（`ClaudeCodeAtLogon`・`send-esc.ps1`）は移せない。パスワード保管か SYSTEM 実行が要る（09-21 00:30 の札に同じ表） |

**いちばん筋がよいのは丙①**（主因に当たる唯一の手）だが、**検査の穴**という代償が重い。
**甲は5分13秒しか縮まない。乙は既に済んでいる**（`ClaudeAfterLogon` がログオンの5分後に走る形）。

＊**今回の形なら、戻りの札は出ていた**——`ClaudeAfterLogon` は 23:44:33 ごろに走り、
　落とし（23:19:07）から25分なので**30分以内に収まる**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **339件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1710-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710-2.md) | 09-20 17:23 | v1458 「三」の根拠の段へ一文を足した（納品） |
| [`y0920-1710.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710.md) | 09-20 17:00 | 【宣言】「三」の根拠の段の末尾へ一文を足す（v1458） |

<!-- 控えの一覧 ここまで -->
