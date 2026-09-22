# 0件の元は「見出しの言語」。数え方を Get-ScheduledTask へ替えた

**終わり（残り1件）** — 2026-09-22 11:13（VAIO）。`after-reboot.ps1` の①を直し、作り値二通り（13件→13件／本当に0件→0件）を**窓なしの同じ道**で確かめた。本体には触っていない。

## 1. 落ちていた元

**昇格でも TaskPath でもない。`schtasks` の CSV の見出しが表示言語で変わるのが元。**

直す前の①はこう数えていた。

```powershell
schtasks /Query /FO CSV /V | ConvertFrom-Csv |
  Where-Object { $_.TaskName -like '*\Claude*' -and $_.'Scheduled Task State' -eq 'Enabled' }
```

`TaskName` と `Scheduled Task State` は**英語の綴り**。ところが `schtasks` の出す見出しは走る場所で変わる。

| 走らせ方 | 見出し | `$_.TaskName` | 当たり |
|---|---|---|---|
| 窓あり（この窓から手で） | `HostName,TaskName,…,Scheduled Task State,…` | 読める | 12件 |
| **窓なし（予定表 → `run-hidden.vbs` → powershell）** | `ホスト名,タスク名,…,スケジュールされたタスクの状態,…` | **$null** | **0件** |

窓なしでは全列が日本語になるので `$_.TaskName` が `$null` になり、`-like '*\Claude*'` が一件も当たらない。
**例外も投げないので `catch` にも入らず、素通りで「0件・最終結果は全て良い」と出る。** これが 03:10 と 04:55 の札。

**昇格は関係ない**（実測：窓なしの回も `elevated=False`・`RunLevel=Limited` で、同じ場所の `Get-ScheduledTask` は**13件返った**）。
**TaskPath も関係ない**（13件とも `\` 直下）。

＊窓なしでの実測値 … `whoami=vaio\user` ／ `elevated=False` ／ `OutputEncoding=shift_jis` ／ `rawlines=410` ／ `csvrows=409` ／ **`clrows=0`** ／ **`enabled_distinct=0`** ／ **`getsched=13`**

## 2. 直したところ（`~/.claude/after-reboot.ps1`・写し `.bak-20260922`）

**① `schtasks` の CSV 解析をやめ、`Get-ScheduledTask` で数える。** 表示言語に依らず、昇格も要らない。
最終結果は `Get-ScheduledTaskInfo -TaskName … -TaskPath …` から取る。

**② 数える対象を「有効な物だけ」→「登録されている物」へ。**
2026-09-21 の決めのままだと、わざと無効にした `ClaudeSweepChecks`（09-21 22:31）が落ちて **12件**になり、`$WANT_TASKS = 13` に足りず欠けが立つ。
いまは13件を数え、**意図しない無効だけを別に欠けとして挙げる**（`$OFF_OK = @('ClaudeSweepChecks')`）。消えたことと無効になったこと、どちらも取りこぼさない形。

**③ `ClaudeAfterReboot` の前回結果 `1` は数に入れない。**
`1` はこの点検そのものが「欠けあり」で返した値。**一度 1 になると次の回もそれを見て欠けを立て、永久に直らない**（実際そうなっていた）。`1` 以外の非零は今までどおり挙げる。

＊照合の綴りは `$TASK_PAT` の一行に出した（作り値で差し替えるため）。

## 3. 作り値の二通り（どちらも窓なしの同じ道で実行）

`run-hidden.vbs` → `powershell` → `after-reboot.ps1 -Dry` の順で、**予定表から走るときと同じ console-less の場所**で回した。`-Dry` なので札は送っていない。

**① 実物（`$TASK_PAT = 'Claude*'`）→ 13件**

```
題 ✅ 再起動の後の点検（返事不要）
   ① 予定表 Claude* … 13件（無効 ClaudeSweepChecks）・最終結果は全て良い
   ② 見張りの生存 … 0分前
   ③ ntfy.sh の応答 … HTTP 200
   ④ 公開側 … notices.json のいちばん新しい札 09-22 10:52:08／panel-ver.txt 143
   四つとも○。戻っている。
```

**② 本当に0件（写しの `$TASK_PAT = 'ZZClaude*'`・当たる予定が無い）→ 0件**

```
題 🪟 異常です：再起動の後の点検
   ① 予定表 Claude* … 0件・最終結果は全て良い
   …
   欠け 1件：予定が 0件しかない（13件要る）
```

**0件のときはちゃんと 0件と出て、🪟 の題になる。** 写しは実行後に消した（作法14）。

## 4. 検め

- 構文検査（`PSParser::Tokenize`）… **NG 0件**
- BOM … 保持（`EF BB BF`）／行数 175／改行は LF のまま
- 写し … `~/.claude/after-reboot.ps1.bak-20260922`
- **`koushu-handan.html` には触れていない。** 予定表への書き込みもしていない

## 残り

1. `2026-09-22 00:40:39` ヨシ待ちを「ヨシしない・取り下げ」で閉じた回に、終わりの札が立たず鈴も鳴らなかった件（未了：受領／時間切れ）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **379件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0922-1113.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1113.md) | 09-22 11:14 | 0件の元は「見出しの言語」。数え方を Get-ScheduledTask へ替えた |
| [`y0922-1047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-1047.md) | 09-22 10:49 | 予定表の Claude* は13件すべて在った（入れ直さず） |
| [`r0922-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0922-0430-2.md) | 09-22 04:30 | 再起動-2（r0922-0430・後の測り） |
| [`y0922-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0922-0015.md) | 09-22 00:09 | 戻しは取り下げ。三つは当てたまま |
| [`y0921-2305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2305.md) | 09-21 23:32 | 管理者の窓で一度走らせれば三つ当たる綴り |
| [`y0921-2258.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2258.md) | 09-21 22:58 | hook の数え（末尾3000行）と、Google の予定 |
| [`y0921-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2140.md) | 09-21 21:57 | 黒い窓の巻き戻しを 9001行 → 500行 に |
| [`y0921-2135.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2135.md) | 09-21 21:50 | 盤の健康・熱・画面バッファの調べ／昇格の問いは閉じられた |
| [`y0921-2128.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2128.md) | 09-21 21:28 | 足跡の合図と、手待ちの畳み／pagefile は**手が要る** |
| [`y0921-2120.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2120.md) | 09-21 21:22 | Edge の置き去りを閉じた（+210MB）／SysMain は**手が要る** |
| [`y0921-2110.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2110.md) | 09-21 21:08 | 押しの敷居を 400MB へ／機械に乗っている物の調べ |
| [`y0921-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2050.md) | 09-21 20:50 | 落ちにくい窓（三つ）／枠の上限を刻ひとつに |
| [`y0921-2012.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2012.md) | 09-21 20:12 | 考え込み中は触らない（CPU で振り分け）／定時の札に起こし直しの数 |
| [`y0921-1957.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1957.md) | 09-21 19:57 | 使用量の上限で手待ちにする（乙で実装） |
| [`y0921-1936.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1936.md) | 09-21 19:37 | 固まりの判じ方を足跡へ／手待ちで重い窓を立て直す |
| [`y0921-1925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1925.md) | 09-21 19:23 | 使用量の鈴の鍵を **10分の桁**へ（最も近い側へ丸める） |
| [`y0921-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1915.md) | 09-21 19:13 | 綴りを退避して **171.4MB → 4.6MB**／台帳の未了 **0件** |
| [`y0921-1805b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805b.md) | 09-21 18:35 | 未了4項目を一行ずつ／枠の上限の結果／使用量の鈴の丸め |
| [`y0921-1755.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1755.md) | 09-21 17:55 | 雲へ重い仕事を回す道 — **通った** |
| [`cloud-kumo-tameshi-20260921-085123.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-kumo-tameshi-20260921-085123.md) | 09-21 17:53 | 雲で回した：`kumo-tameshi.js` |

<!-- 控えの一覧 ここまで -->
