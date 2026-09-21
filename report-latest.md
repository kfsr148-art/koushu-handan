# 固まりの判じ方を足跡へ／手待ちで重い窓を立て直す

**終わり（残り1件）** — 2026-09-21 19:36（VAIO）。`koushu-handan.html`・`stable` には触っていない。
**あとから届いた「429 で手待ち」の枠は未了**。理由は第5節に書いた。

---

## 1. 固まりの判じ方を、窓の応答から**足跡**へ替えた

### なぜ替えたか

前の造りは**窓の応答（`Responding`）**で判じていた。**入れた日から一度も鳴っていない。**
固まっていても窓は応答を返し続けるからで、**物差しそのものが当たっていなかった**。

**足跡で判じる。**「動いていれば必ず増える物が、増えていない」で見る。

### 三つが揃ったときだけ落とす

| | 見るもの |
|---|---|
| ① | 台帳に**走っている枠**がある（状態の鍵が `run:` **かつ** 台帳の未了が1件以上） |
| ② | **`hook.log` が10分書かれていない** |
| ③ | 窓の出しの記録（`window-out.log`）も同じだけ止まっている … **無ければ見ない** |

手待ち・ヨシ待ちでは見ない（足跡が止まっているのが当たり前）。
足跡が**読めない**回も触らない（数えられない側は起こさない方へ倒す）。
落としたら `ClaudeCodeAtLogon` で起こし直し、**「🪟 窓を起こし直しました（固まり）」**を一発。
**一つの固まりにつき一度だけ**（`claude-frozen.txt`）。

### 作り値

| 場合 | 落とす当て | 鳴らした題 |
|---|---|---|
| **甲 走行中・足跡が12分止まっている** | **1本** | **🪟 窓を起こし直しました（固まり）** |
| **乙 走行中・足跡あり（2分）** | 0本 | なし |
| **丙 手待ち・足跡が12分止まっている** | 0本 | なし |

＊`window-out.log` は**いま在りません**。claude の標準出力は誰も拾っていないので、
　当面は `hook.log` だけで判じます。**置けば自動で見ます**（在れば見る造りにしてある）。

---

## 2. 手待ちで窓が重ければ、立て直す

**手待ち**（状態の鍵が `run:` でない ＋ **台帳の未了0件** ＋ **ヨシ待ち0件**）なのに
claude の私用メモリが **900MB** を越えていたら、**新しい窓に替える**。
仕事を持っていないのだから、畳んで立て直すのがいちばん安い。

- **走っている最中は替えない**（仕事が飛ぶ）。
- **「🪟 窓を立て直しました（重さ）」**を一発。**900MB を下回るまで黙る**（`claude-heavy.txt`）。
- 数えられない回（台帳やヨシ待ちが読めない）は**替えない側へ倒す**。

### 作り値

| 場合 | 落とす当て | 鳴らした題 |
|---|---|---|
| **甲 手待ち・私用950MB** | **1本** | **🪟 窓を立て直しました（重さ）** |
| **乙 走行中・私用950MB** | 0本 | なし |
| **丙 手待ち・私用500MB** | 0本 | なし |
| 念のため：同じ重さで二度目 | — | **鳴らない**（正しい） |

**本物の claude は一本も落としていない・本物の ntfy も鳴らしていない**（写しに切り出して差し替えた）。

---

## 3. 入れた形

| | |
|---|---|
| 綴り | `~/.claude/inbox-watch.ps1`（**1485行 → 1581行**・構文の誤り0） |
| 消えた物 | `Get-ClaudeWindowState`（応答で判じる手）＝**0件** |
| 足した物 | `Check-ClaudeFrozen`（作り直し）・`Check-ClaudeHeavy`・`Restart-Window`・`Get-QuietMin`・`Is-FrameRunning`・`Is-Idle`・`Count-OpenOrders`・`Count-OpenYoshi` |
| 巡回からの呼び | `Check-ClaudeFrozen` 1件／`Check-ClaudeHeavy` 1件（どちらも一分に一度） |
| 敷居 | `$FROZEN_QUIET_MIN = 10`（分）／`$HEAVY_MB = 900`（MB） |
| **常駐** | 旧 pid 9172 → **新 pid 13636・19:35:14 起動**（台本の更新 19:33:47 より後）＝効いている |

入れ替え後の `inbox-watch.log` に**例外の行は無い**。

---

## 4. 戻し方

```powershell
Copy-Item 'C:\Users\user\.claude\inbox-watch.ps1.bak-20260921e' 'C:\Users\user\.claude\inbox-watch.ps1' -Force
wscript "C:\Users\user\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\ClaudeInboxWatch.vbs"
```

敷居だけ変えるなら `$FROZEN_QUIET_MIN` と `$HEAVY_MB` を書き替えて常駐を起こし直す。

---

## 5. 未了 — 「429 で手待ち」の枠

**入れていない。理由は、判じる元になる字がどこにも残っていないため。**

- 「**Retrying が3回続いた**」は **claude が窓へ出す字**で、**誰も拾っていない**
  （`window-out.log` は在りません＝第1節の③と同じ穴）。
- `hook.log` にも `429` の記録は無い。**いま在る材料では三連を数えられない。**

**採れる道は二つ。どちらかの一言が要る。**

| 案 | 中身 | 代わりに要る物 |
|---|---|---|
| **甲** 窓の出しを拾う | 窓を `… claude.exe … > window-out.log 2>&1` の形で起こし、`Retrying` を数える | `ClaudeCodeAtLogon` の起こし方を変える（窓の見え方が変わるかもしれない） |
| **乙** 使用量で判じる | `usage-good.json` の `five_hour` / `seven_day` が上限に張り付いたら手待ちにし、`resets_at` を過ぎたら取り直す | **字は既に在る**（いま `five_hour 38%` / `seven_day 81%`・`resets_at` も入っている）。ただし「Retrying 三連」そのものではない |

**乙なら今の材料で今日中に入ります。** 甲は窓の起こし方に触るので、別に一言を頂きたい。

---

## 6. 残り

**残り1件。**

1. `2026-09-21 19:33` Anthropic への問いが 429 で弾かれ続けた回の手待ち — **甲乙の裁定待ち**（上記）。

## 7. 実機で見るところ

- 枠を走らせている最中に窓が黙り込んだら、**10分で**「🪟 窓を起こし直しました（固まり）」が鳴ること。
- 手待ちのまま claude が 900MB を越えたら、**「🪟 窓を立て直しました（重さ）」**が鳴って新しい窓になること。
  （いまは手待ちで **613MB**。越えるまでは鳴りません。）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **365件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-1936.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1936.md) | 09-21 19:37 | 固まりの判じ方を足跡へ／手待ちで重い窓を立て直す |
| [`y0921-1925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1925.md) | 09-21 19:23 | 使用量の鈴の鍵を **10分の桁**へ（最も近い側へ丸める） |
| [`y0921-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1915.md) | 09-21 19:13 | 綴りを退避して **171.4MB → 4.6MB**／台帳の未了 **0件** |
| [`y0921-1805b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805b.md) | 09-21 18:35 | 未了4項目を一行ずつ／枠の上限の結果／使用量の鈴の丸め |
| [`y0921-1755.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1755.md) | 09-21 17:55 | 雲へ重い仕事を回す道 — **通った** |
| [`cloud-kumo-tameshi-20260921-085123.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-kumo-tameshi-20260921-085123.md) | 09-21 17:53 | 雲で回した：`kumo-tameshi.js` |
| [`y0921-1805.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805.md) | 09-21 17:47 | 枠の上限 — 8分を超え、かつ空きが400MBを割ったら仕事を切る |
| [`y0921-1700.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1700.md) | 09-21 17:02 | 立てる数を減らす — **毎分 22.7本 → 10.6本**／`--continue` を外した |
| [`y0921-1635.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1635.md) | 09-21 16:38 | 網の切れの一覧と、窓隠しの検収 |
| [`y0921-1625.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1625.md) | 09-21 16:26 | 包みの待ちの確かめ・再起動の内側の上限・押しの詰まりの元 |
| [`y0921-1600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1600.md) | 09-21 15:53 | 二件の取り下げと、走りかけの子 125本の片付け |
| [`y0921-1335.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1335.md) | 09-21 13:31 | 09-20 22:00 からの乱れ一枚と、網／ディスクの突き合わせ |
| [`y0921-1250.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1250.md) | 09-21 12:59 | 起き上がりの道を直して、再起動を一日二回にする |
| [`r0921-1246-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0921-1246-2.md) | 09-21 12:46 | 再起動-2（r0921-1246・後の測り） |
| [`y0921-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1040.md) | 09-21 10:41 | 「写した刻」を字面で確かめて消した |
| [`y0921-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1020.md) | 09-21 10:23 | 青い窓の出所と、wscript の包みで隠した話／untracked の「写した刻」 |
| [`y0921-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0950.md) | 09-21 09:49 | 会話の控えの大きさと、畳む支度の点検 |
| [`y0921-0935.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0935.md) | 09-21 09:35 | 「窓を畳むと0枚と読む」の見立ては、実物では成り立たなかった — 直しは入れていない |
| [`y0921-0925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0925.md) | 09-21 09:24 | 公開 state の詰まりと、09:19 の札 |
| [`y0921-0845.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0845.md) | 09-21 08:45 | 06:50 の復帰後に溜まっていた枠の行方と、会話の控えの大きさ |

<!-- 控えの一覧 ここまで -->
