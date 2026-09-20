# ③ 再起動の稽古 — 手順と、戻らなかったときの戻し方（再起動の直前に書いた）

**この札は再起動の直前に書いている。** 以下の手順で機械を落とし、ログオン時の起こしで戻る。
**戻らなかった場合は、下の「戻し方」を上から順に人の手で当てる。**

## いまの状態（落とす直前）

| 見るもの | 値 |
|---|---|
| 予定表 `Claude*` | **13件**（`ClaudeAfterReboot` を足した直後。最終結果は全て 0／267009／267011） |
| 常駐 `inbox-watch.ps1` | 1本（pid 2116・22:45:17 起動） |
| 見張りの生存（`watch-status.log`） | 23:08 台に更新あり |
| ntfy.sh | HTTP **200** |
| 公開 `notices.json` | いちばん新しい札 **09-20 23:02:11** |
| 公開 `panel-ver.txt` | **142**（手元142） |
| 台帳の未了 | **1件（この稽古そのもの）** |
| 押し残し | 無し（この札まで push 済み） |

## 手順

1. いまの状態を札に一枚立てる（`ntfy-say.ps1`）
2. **この札を push する**（いま済ませた）
3. `shutdown /r /t 5` で再起動
4. ログオンすると **`ClaudeCodeAtLogon`**（予定表・ログオン時）が Claude Code を起こす
5. 起きた側が **見張りの生存・ntfy の応答・公開側の刻**を確かめ、**「戻りました」の札を押し送る**
6. 台帳の「再起動の稽古」の行を済にする

## 戻らなかったときの戻し方（上から順に）

**A 窓が起きない（Claude Code が立ち上がらない）**

```
wscript "C:\Users\user\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\ClaudeInboxWatch.vbs"
schtasks /Run /TN ClaudeCodeAtLogon
```

＊`ClaudeCodeAtLogon` は「ログオン時」の予定。手で起こすときは上の `/Run`。
＊常駐（`inbox-watch.ps1`）は **Startup の vbs** が起こす。二重起動は新しい側が古い側を止めるので、そのまま叩いてよい。

**B 知らせが来ない（札は立つが iPhone が鳴らない）**

```
powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\user\.claude\pipe-check.ps1
type C:\Users\user\.claude\pipe-warn.log     （末尾を見る）
```

＊`ntfy-down` が立っていれば外の詰まり。`push-fail` なら押しの側。

**C 予定表が動いていない**

```
schtasks /Query /FO TABLE /V | findstr Claude
schtasks /Run /TN ClaudeWatchNotify
```

＊最終結果 **267011**＝まだ走っていない、**267009**＝走行中、**0**＝成功。それ以外の非ゼロは異常。

**D 公開が止まっている**

```
cd C:\Users\user\Desktop\mahjong\koushu-handan
git status
powershell -NoProfile -File C:\Users\user\.claude\push-mine.ps1
gh run list --limit 5
```

＊配信は `check.yml` の deploy。**先端でない回は配らない**関門を 09-20 に入れてあるので、
　古い回が飛ばされていても異常ではない（先端の回が配る）。

**E 何も分からないとき**

- `~/.claude/orders-open.tsv` … 何が残っているかはここに全部ある（`/clear` でも再起動でも消えない）
- `~/.claude/work-note.txt` … いま何をしていたか
- `reports/` … 直近の報告（この札を含む）
- `git log --oneline -20` … 直前に何を押したか

## 戻ってからやること

1. 生存・ntfy・公開の刻を確かめる（`after-reboot.ps1` を `-Dry` で回せば四つまとめて見られる）
2. **「戻りました」の札を押し送る**
3. 台帳の「再起動の稽古」を済にする

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **336件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1640.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1640.md) | 09-20 16:59 | 赤い行「知らせの道が落ちています」が消えなかった元と直し（panel v139） |
| [`y0920-1630.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1630.md) | 09-20 16:35 | 16:11 の訴え二つ（ntfy-down・pub-read）の今 |
| [`y0920-1500-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500-2.md) | 09-20 15:19 | v1457 剣士の八枚を idleRight 52 に揃えて焼き直した（納品） |

<!-- 控えの一覧 ここまで -->
