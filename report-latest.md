# 「写した刻」を字面で確かめて消した

**終わり（残り0件）** — 2026-09-21 10:40（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## 1. 字面の確かめ — **ファイルとして参照している箇所は0件**

名を当てて出た箇所は七つ。**どれも「写した刻」という言葉を書いた文であって、
この名のファイルを開く手ではない。**

| 場所 | 行 | 素性 |
|---|---|---|
| `panel.html` | 2283 | `/* 写した刻（秒）を控える。… */` — **注釈** |
| `panel.html` | 2328 | `copied[keyOf(d)] = …;   /* 写した刻。届いた印の物差し（v32） */` — **行末の注釈** |
| `panel.html` | 2550・2555 | `/* …写した刻より後に resume が鳴っている… */` — **注釈** |
| `panel-mach-probe.js` | 23-24 | `/* …「写した刻が resume より前」… */` — **注釈** |
| `reports/取り残しの検収-1.md` | 23 | 「一行目に写した刻（epoch）を置き」 — **地の文** |
| `report-latest.md`／`status.md`／`board.json`／`state.json`／`notices*.json` | — | **今回の調べそのものの記録**（機械が書いた写し） |

### 三通りの当て方で、どれも0件

| 当て方 | 結果 |
|---|---|
| 道・引用符に接した使い方（`/写した刻`・`\写した刻`・`'写した刻'`・`"写した刻"`） | **0件** |
| ファイルを開く手の近く（`Get-Content`・`readFile`・`readFileSync`・`Test-Path`・`existsSync`・`open`・`fopen`・`cat`）から60字以内 | **0件** |
| `git ls-files -- 写した刻`（追跡されているか） | **空＝untracked** |

`~/.claude` の側の当たりも見たが、`orders-open.tsv`・`orders-full.jsonl`・`inbox-watch.log`・
`last-order.txt`・会話の綴り（`projects/*.jsonl`）といった**控えと記録だけ**で、台本は一つも無い。

---

## 2. 消した

```powershell
Remove-Item -LiteralPath 'C:\Users\user\Desktop\mahjong\koushu-handan\写した刻' -Force
```

| 見るもの | 消す前 | 消した後 |
|---|---|---|
| 大きさ | **0 バイト** | — |
| 作成／更新／最終アクセス | **2026-09-14 13:32:42**（三つとも同じ） | — |
| `git ls-files` | 空（untracked） | — |
| `Test-Path` | 真 | **偽** |
| `git status` の untracked | **7件** | **6件**（残りは `.bak-*` の控えだけ） |

残った untracked は次の6件で、どれも今回とは関わりがない。

```
.claude/settings.json.bak-20260910      check-all.js.bak-20260919
.claude/settings.json.bak-20260911      check.js.bak-20260914
.claude/settings.local.json.bak-20260910  core-probe.js.bak-20260914
```

＊`-LiteralPath` を使ったので、名の中の字が当てはめと読まれる心配は無い。
＊git 管理下ではないので履歴には何も残らない。**作られた刻はこの札と前の札（`y0921-1020`）に写してある。**

---

## 3. 残り

**残り0件**（`orders-open.tsv` の未了は0）。

## 4. 実機で見るところ

**この回に画面へ出る直しは無い。** 前の回の「青い窓が出ないこと」の確かめだけが人手待ちのまま。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **351件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1040.md) | 09-21 10:41 | 「写した刻」を字面で確かめて消した |
| [`y0921-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1020.md) | 09-21 10:23 | 青い窓の出所と、wscript の包みで隠した話／untracked の「写した刻」 |
| [`y0921-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0950.md) | 09-21 09:49 | 会話の控えの大きさと、畳む支度の点検 |
| [`y0921-0935.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0935.md) | 09-21 09:35 | 「窓を畳むと0枚と読む」の見立ては、実物では成り立たなかった — 直しは入れていない |
| [`y0921-0925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0925.md) | 09-21 09:24 | 公開 state の詰まりと、09:19 の札 |
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

<!-- 控えの一覧 ここまで -->
