# 連携の地図三枚（r0928-1216-2・読むだけ）

**終わり（残り0件）** — 2026-09-28 12:32ごろ（VAIO）。読むだけ。三枚とも何も触らずに書いた（台本は回していない・知らせは送っていない）。本体には触っていない。

| 枠 | 綴り | 中身 |
|---|---|---|
| 12:16:58 書き出しの一つ目 | **reports/map-1-parts.md**（183行） | 連携で動いている物の一覧。予定表21（Claude の13＋関わる他の8）・常駐19（起こす .vbs 2＋inbox-watch の見張り17）・鉤10・claude-loop と起こす道8・台本49＋リポジトリ側4。列は名前／いつ動くか／何をするか／何を書くか・誰に知らせるか |
| 12:17:09 書き出しの二つ目 | **reports/map-2-alerts.md**（156行） | 鈴と札の全種類60＋pipe-check の訴え21。列は題の字／鳴る条件／敷居／二度目の扱い／消えた時の扱い／どの台本が出すか。偽の鈴になり得る物に **⚠偽**（60のうち28・訴え21のうち8） |
| 12:17:22 書き出しの三つ目 | **reports/map-3-incidents.md**（53行） | 09-21〜09-28 の出来事40行。列は刻／起きたこと／元／直したか・直し方／まだ残るか。**残る6**・様子見11・未特定2 |

## 書いている途中で見つかったこと（どれも直していない）
- **Defender Cache Maintenance は元の形（刻の引き金なし・保守）に戻っている**。Google の更新は 156 へ上がり、新しい仕事が毎時 :27 に走っている（map-1 の行はこの姿に直した）
- **偽の鈴が割り当て（異常と延び一日8件）を食う**：09-27 は 19:33 までに8件に達し、23:34 の本物の窓の落ち（dead）は札だけで、電話には鳴らなかった（map-2）
- **inbox-watch は claude が0本の間、healthchecks へ失敗の合図を打つ**。再起動や保守の固まりのたびに DOWN が出る。healthchecks の check は二本ある（inbox-watch の一本と hc-watch.txt の一本）が、どちらが「My First Check」かは要確認（map-2）
- **立ち直りに 38〜44分かかった回（09-27 19:34・09-28 03:39）は、after-reboot の30分の決めで「✅ 戻りました」が出ていない**（map-2）
- **ClaudeHomeBackup** の前回の結果が 0x800705AA（資源不足・09-27 03:30）で、09-28 は走っていない。**ClaudeAfterReboot** の前回の結果は 1（09-27 15:10）（map-1）
- **notices の押しに「pathspec notices-*.json did not match」が 09-25〜09-28 09:00 に出ている**（元は未特定・map-3）
- 使用量の読みが HTTP 401 で5回落ちている（鍵の取り替えが要る見込み・map-3）
- 8分の枠の上限は今週23回ほど長い仕事を切っている（map-3）
- 09-24 16:00〜09-27 の定時の再起動の見送り「hook.log の最後が resume」も、今日直した SessionStart の取り違えと同じ形（map-3）
- 使われていない物：read-screen.ps1・rc-restart.ps1・window-restart.ps1・weekly-reboot.ps1・wifi-swap.ps1（予定表の仕事が無い）（map-1）
- 👀 異常です（待てば戻ります）は作りはあるが、出す所が無い（map-2）

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **448件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0928-1216-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216-2.md) | 09-28 12:32 | 連携の地図三枚（r0928-1216-2・読むだけ） |
| [`map-2-alerts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-2-alerts.md) | 09-28 12:31 | 鈴と札の全種類（map-2） |
| [`map-1-parts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-1-parts.md) | 09-28 12:31 | 連携で動いている物の一覧（map-1） |
| [`map-3-incidents.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-3-incidents.md) | 09-28 12:26 | 09-21〜09-28 の出来事（map-3） |
| [`r0928-1216.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1216.md) | 09-28 12:18 | SessionStart の resume を仕事の始まりと読む誤りを直した（r0928-1216） |
| [`r0928-1201.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1201.md) | 09-28 12:03 | 「命令0回」で切られた三つの枠の元（r0928-1201・読むだけ） |
| [`r0928-1045.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1045.md) | 09-28 10:42 | 未検収の 🔗 の二行を済へ（r0928-1045） |
| [`r0928-1035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1035.md) | 09-28 10:38 | 未検収を試しで片付ける（二つ目）（r0928-1035） |
| [`r0928-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1020.md) | 09-28 10:16 | 未検収を記録で片付ける（一つ目）（r0928-1020） |
| [`r0928-1010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1010.md) | 09-28 10:11 | 未検収の二行を済へ（記憶の診断・2048）（r0928-1010） |
| [`r0928-0950-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950-2.md) | 09-28 09:54 | conhost.exe の 0xc0000409 の落ち四回と、Windows Terminal の見込み（r0928-0950-2・読むだけ） |
| [`r0928-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950.md) | 09-28 09:54 | 09-28 の再起動の後の点検（記憶の診断・仮想メモリ・03:20・NODE_OPTIONS・引き継ぎ）（r0928-0950・読むだけ） |
| [`r0928-0348-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0348-2.md) | 09-28 03:48 | 再起動-2（r0928-0348・後の測り） |
| [`r0928-0345-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0345-2.md) | 09-28 03:45 | 再起動-2（r0928-0345・後の測り） |
| [`r0928-0302-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0302-2.md) | 09-28 03:02 | 再起動-2（r0928-0302・後の測り） |
| [`r0928-0138.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0138.md) | 09-28 01:40 | 09-27 23:25〜23:36 に Claude の窓が消えた元（r0928-0138・読むだけ） |
| [`r0928-0009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0009.md) | 09-28 00:10 | bcdedit の二件と未検収の一行を済へ（r0928-0009） |
| [`r0927-2311.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2311.md) | 09-27 23:15 | bcdedit /bootsequence {memdiag} を管理者でもう一度（また UAC が通らず）（r0927-2311） |
| [`r0927-2257.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2257.md) | 09-27 23:01 | y0927-2251 にヨシ → 次の起動を記憶の診断に（UAC が取り消され、走っていない）（r0927-2257） |
| [`r0927-2226.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2226.md) | 09-27 22:30 | pipe-warn の鈴を「続く間も3時間ごと・消えたら戻り」に（r0927-2226） |

<!-- 控えの一覧 ここまで -->
