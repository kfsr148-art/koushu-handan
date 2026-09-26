# 「🔗 新しい線」は宛先が替わった時だけ鳴らす（r0926-1911）

**終わり（残り0件）** — 2026-09-26 19:17ごろ（VAIO）。本体には触っていない。

- **inbox-watch.ps1 の Check-NewLine**：pid の組が替わっても、宛先（`https://claude.ai/code/session_…`）が前と同じなら**鳴らさない**。宛先が替わった時だけ「🔗 新しい線」を一通送る
  - 前は「pid か宛先のどちらかが替われば一通」だった。二本目の claude が短く居ただけの回（09-24 00:10・12:35・15:01、09-25 00:08）にも、宛先が同じまま二通ずつ鳴っていた
  - 鳴らさない回も、控えの鍵（newline-sent.txt の「pid｜宛先」）は書き替える。記録（inbox-watch.log）には「宛先は前と同じなので鳴らさない（pid A → B）」と、引き継ぎの判じの字を一行残す
  - ＊そのため、窓が同じ会話へ引き継いで立ち直った回（宛先が同じ）も鳴らない。「同じ会話が続いた」の判じは記録にだけ出る。宛先が替わった回（新しい行が立った）は、今までどおり判じの一行つきで鳴り、引き継ぎの指定も外して戻す
- **作り値**（置き場は scratchpad・送り手は偽物）：

| 例 | 鳴らした | 記録 |
|---|---|---|
| 控えなし | 0通 | 鍵を書くだけ |
| **pid だけ替わる**（5072 → 5072,9548） | **0通** | 宛先は前と同じなので鳴らさない |
| **pid だけ替わる**（5072,9548 → 5072） | **0通** | 同上 |
| **宛先が替わる**（session_01AAA → 01BBB） | **1通** | 新しい線を送った |

- 常駐を 19:16:17 に起こし直した（台本 19:15:15 より後・常駐1本）

### 手元で回る段・雲で回る段（作法36）
- 手元：inbox-watch（常駐）の Check-NewLine（毎巡）。鳴らすのは宛先が替わった時だけ
- 雲：変わりなし

### 触った物
~/.claude/inbox-watch.ps1（写し .bak-20260926b）・orders-open.tsv・work-note.txt／reports/r0926-1911.md・report-latest.md

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **413件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0926-1911.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1911.md) | 09-26 19:17 | 「🔗 新しい線」は宛先が替わった時だけ鳴らす（r0926-1911） |
| [`r0926-1903.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1903.md) | 09-26 19:04 | 未検収の healthchecks の check 作りを取り下げで済へ（r0926-1903） |
| [`r0926-1852.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1852.md) | 09-26 18:54 | 未検収の「画面バッファ500行」を済へ（r0926-1852） |
| [`r0926-1828.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1828.md) | 09-26 18:32 | 未検収の四行を読んで確かめる（r0926-1828） |
| [`r0926-1717.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1717.md) | 09-26 17:20 | claude の大きさと会話の綴りの推移・未検収の四行を済へ（r0926-1717） |
| [`r0926-1706.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1706.md) | 09-26 17:08 | 古い index.lock を押しの前に外す・引き継ぎの判じを窓の刻で（r0926-1706） |
| [`r0926-1127.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1127.md) | 09-26 11:36 | 公開側への押しが通らない元（index.lock）を直す・札の全文を ntfy へ（r0926-1127） |
| [`r0926-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1040.md) | 09-26 10:43 | 公開側の札・09-24 15:00 の再起動と引き継ぎ・無線・いまの様子（r0926-1040・読むだけ） |
| [`r0924-1502-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1502-2.md) | 09-24 15:02 | 再起動-2（r0924-1502・後の測り） |
| [`r0924-1455.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1455.md) | 09-24 14:58 | 14:30〜14:55 に /remote-control を打ったか（r0924-1455・読むだけ） |
| [`r0924-1234.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1234.md) | 09-24 13:23 | claude の自動更新を止めて落とす直前に更新・電源と容量と鍵の読み（r0924-1234） |
| [`r0924-1149.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1149.md) | 09-24 11:54 | 常駐を AboveNormal で立てる・枠の鉤の timeout 60秒・いまのメモリ上位10本（r0924-1149） |
| [`r0924-1117.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1117.md) | 09-24 11:23 | Check-RcDrop の「切れ」を会話の記録で判じる（r0924-1117） |
| [`r0924-1054.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1054.md) | 09-24 11:02 | VAIO に残る Edge・node の確かめを洗って雲へ（r0924-1054） |
| [`cloud-check-fast-20260924-015941.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20260924-015941.md) | 09-24 11:02 | 雲で回した：`check-fast.js` |
| [`r0924-1033.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1033.md) | 09-24 10:35 | 残る y0921-0900 を済へ・ヨシ待ち0件（r0924-1033） |
| [`r0924-1009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-1009.md) | 09-24 10:14 | ヨシ待ちの納品済み7件を済へ・残る1件（r0924-1009） |
| [`r0924-0506.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-0506.md) | 09-24 05:09 | 04:30 の定時・見送りの訳からヨシ待ちを外す・押し残しの数えられず・ヨシ待ち8件（r0924-0506） |
| [`r0924-0421.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0924-0421.md) | 09-24 04:25 | 00:10 の claude（4412）・いまの本数・03:00 の定時（r0924-0421・読むだけ） |
| [`r0923-2341.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0923-2341.md) | 09-23 23:50 | panel-check は雲（job.yml）で回して reports/ へ返す（r0923-2341） |

<!-- 控えの一覧 ここまで -->
