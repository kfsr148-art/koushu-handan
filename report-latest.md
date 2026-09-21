# 考え込み中は触らない（CPU で振り分け）／定時の札に起こし直しの数

**終わり（残り0件）** — 2026-09-21 20:12（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## 1. 固まりの条件に「CPU 時間」を足した

### なぜ要るか

足跡（`hook.log`）が止まっていても、**長い思案や大きな読み込みは記録を書かずに CPU だけ回す**。
そこを見ないと、**考え込んでいる最中の窓を巻き添えで落とす**。

### 足した条件

| | 見るもの |
|---|---|
| ① | 台帳に走っている枠がある（鍵が `run:` かつ未了1件以上） |
| ② | `hook.log`（と有れば窓の出し）が **10分**止まっている |
| **③（新）** | **claude.exe の CPU 時間が10分で増えていない**（1秒でも増えていれば**考え込み中**として触らない） |

**控えは `claude-cpu.txt`**（`刻<TAB>CPU秒`）。**巡回のたび（一分に一度）積み**、
**10分前の控えと較べる**。古すぎる控え（30分より前）は捨てる。

**較べる控えがまだ無い回は「増えている」側へ倒す**——判じられないなら起こさない。

＊控えは**早戻りより前**に積む。後ろに置くと、静かな回に控えが貯まらず、
　いざ較べたいときに相手がいない。

### 作り値（どちらも 走行中・足跡は12分止まっている）

| 場合 | 落とす当て | 鳴らした題 | 記録 |
|---|---|---|---|
| **甲 CPU が増えている** | **0本** | なし | `足跡は 12分止まっているが、claude の CPU 時間は増えている。考え込み中とみて触らない` |
| **乙 CPU が増えていない** | **1本** | **🪟 窓を起こし直しました（固まり）** | `固まり（足跡が 12分止まっている）：claude を 1本落として起こし直した` |

**控えの積み方も本物で一度回した** … `1789988991<TAB>1115.6` が積まれ、
較べる相手がまだ無いので「増えている」（＝起こさない）側へ倒れた。**狙いどおり。**

---

## 2. 定時の札に「今日の起こし直し」の一行

`daily-notice.ps1` に一行足した。**実際に出してみた姿**（`-DryRun`）。

```
😺 現在も順調にゃ
状態: 作業中 / Check-ClaudeFrozen の固まりの条件に「claude…
台帳: 残り 1件（…）
見張り: 生存○ 見張り○ 片付け○ 受信箱○
使用量: セッション 41% / 週全体 0% / 週Fable 0%
起こし直し: 今日 1回（固まり 0・重さ 0・0本 1） / 最後に落ちた刻 08:55   ← 足した行
訴え: 8件（…）… pipe-warn.log
配分: 全体 あと14.3%/日 ／ Fable あと14.3%/日
```

| 数えるもの | 出どころ |
|---|---|
| **固まり** | `inbox-watch.log` の `固まり（…` の行（今日ぶん） |
| **重さ** | 同じく `重さ（…` の行 |
| **0本** | `revive.log` の `revive  起こし直した` の行 |
| **最後に落ちた刻** | 三つのうち**いちばん新しい刻**（`HH:MM`）。今日まだ落ちていなければ **`今日はまだ落ちていない`** |

＊上の `0本 1 / 最後に落ちた刻 08:55` は、今朝 08:53 に0本になって 08:55:27 に起こし直した実際の一件。
＊行が組めなかった回は**黙って落とす**（空行を足さない）。

---

## 3. 入れたあとの姿

| | |
|---|---|
| `~/.claude/inbox-watch.ps1` | **1672行 → 1714行**・構文0（写し `.bak-20260921g`） |
| `~/.claude/daily-notice.ps1` | **252行 → 283行**・構文0（写し `.bak-20260921`） |
| **常駐** | 旧 pid 11632 → **新 pid 11664・20:10:03 起動**（台本の更新 20:08:37 より後） |

---

## 4. 戻し方

```powershell
Copy-Item 'C:\Users\user\.claude\inbox-watch.ps1.bak-20260921g'  'C:\Users\user\.claude\inbox-watch.ps1'  -Force
Copy-Item 'C:\Users\user\.claude\daily-notice.ps1.bak-20260921' 'C:\Users\user\.claude\daily-notice.ps1' -Force
wscript "C:\Users\user\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\ClaudeInboxWatch.vbs"
```

＊`daily-notice.ps1` は予定表から毎回呼び直されるので、**起こし直しは要らない**。

---

## 5. 残り

**残り0件。**

## 6. 実機で見るところ

- **考え込んでいる最中の窓が落とされないこと。** 足跡が10分止まっても、CPU が回っていれば
  `inbox-watch.log` に `考え込み中とみて触らない` の一行が立つだけで、窓はそのまま。
- **定時の札（😺 現在も順調にゃ）に `起こし直し:` の行が出ること。**
  今日まだ落ちていない日は `今日 0回（固まり 0・重さ 0・0本 0） / 今日はまだ落ちていない` と出る。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **367件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-2012.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2012.md) | 09-21 20:12 | 考え込み中は触らない（CPU で振り分け）／定時の札に起こし直しの数 |
| [`y0921-1957.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1957.md) | 09-21 19:57 | 使用量の上限で手待ちにする（乙で実装） |
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

<!-- 控えの一覧 ここまで -->
