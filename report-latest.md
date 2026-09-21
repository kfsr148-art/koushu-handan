# hook の数え（末尾3000行）と、Google の予定

**終わり（残り0件）** — 2026-09-21 22:58（VAIO）。`koushu-handan.html`・`stable` には触っていない。
**hook の減らしと作り値は、言われたとおりこの回ではやっていない。**

---

## 1. hook（tool-mark）の数え — **末尾3000行だけ**

`hook.log` の**末尾3000行**を読んだ（24時間ぶんは読んでいない）。

| | |
|---|---|
| 刻の幅 | **2026-09-20 13:28:04 〜 2026-09-21 22:56:07**（およそ **33.5時間**） |
| **PreToolUse** | **926回** |
| **PostToolUse** | **876回** |
| **tool-mark の合計** | **1,802回** ＝ およそ **54回/時**・**0.9回/分** |

参考までに、同じ3000行の中の内訳。

```
  926 PreToolUse     876 PostToolUse    417 frame-work    239 resume
  181 heartbeat      144 stop            85 inbox-feed     70 stop-guard
```

＊`Pre` が `Post` より **50回多い**。**返っていない命令**（切られた・時間切れ・窓が落ちた回）のぶん。
＊**一回の平均秒と私用MBは、この数えからは出ない。** `hook.log` は刻と種類しか持っておらず、
　`tool-mark` の一本ごとの秒と大きさを記録している綴りが無い（測るなら別に一行足すのが先）。
　**この回では足していない。**

---

## 2. Google の予定 — **その名の物は無かった**

```
GoogleUpdateTaskMachineCore / UA の当たり : 0件（その名の予定は無い）
```

**この機械に在る Google の予定は、次の二つだけ**で、**どちらも既に無効**にしてある
（前の回で切り、控えも取ってある）。

| 予定 | 状態 | 控え |
|---|---|---|
| `\GoogleUserPEH\RunPlatformExperienceHelper_Daily` | **Disabled** | `task-bak-20260921\GoogleUserPEH-Daily-off.xml`（1,541バイト） |
| `\GoogleUserPEH\RunPlatformExperienceHelper_Metrics` | **Disabled** | `task-bak-20260921\GoogleUserPEH-Metrics-off.xml`（1,515バイト） |

＊`GoogleUpdateTaskMachineCore/UA` は、**Google Update（旧 GoogleUpdate.exe）を入れた機械に出る名**。
　この機械は新しい `GoogleUpdater` 系で、**その名の札は作られていない**。
　**無い物を「切った」とは書けない**ので、在る二つを切った、とだけ書く。

### 戻し方

```powershell
Enable-ScheduledTask -TaskName 'RunPlatformExperienceHelper_Daily'   -TaskPath '\GoogleUserPEH\'
Enable-ScheduledTask -TaskName 'RunPlatformExperienceHelper_Metrics' -TaskPath '\GoogleUserPEH\'
```

＊札ごと戻したいときは控えの `.xml` を `Register-ScheduledTask -Xml` で入れ直す。

---

## 3. 前の回でやった引き算（取りこぼさないように、ここに一行ずつ）

| したこと | 結果 |
|---|---|
| **`ClaudeSweepChecks` を無効に** | **Disabled**（控え `ClaudeSweepChecks-off.xml`）。役目は常駐の `Sweep-Stale` と**完全に重なる**——目印 `koushu-`・`--user-data-dir`・**20分**の敷居・msedge だけ、まで同じで、常駐は**2分ごと**に見る（予定は20分ごと） |
| その作り値 | 身代わりの検査 Edge を `koushu-proof-` の印で2本立て、常駐の `Sweep-Stale` をそのまま読み込んで走らせたら **2本→0本**、記録に `置き去りの検査を 2 本片付けた` |
| **`\Sony Corporation\VAIO Care\VAIO Care` を無効に** | **切れなかった**（`Access is denied`＝管理者が要る）。ただし**走っていた `VCSystemTray`（pid 9816・私用77MB）は落とした**ので、いまは居ない。**次のログオンで戻る** |
| Google の二つ | 上記のとおり Disabled |

＊`ClaudeJamWatch`・`ClaudeRevive`・`ClaudeWatchNotify`（毎分の三つ）は、**役目が常駐と重ならない**ので
　印を付けていない——`jam-watch` は詰まりの**現場を撮る**（常駐は撮らない）、`revive` は**0本の起こし直し**
　（常駐が見るのは固まりと重さ）、`watch-notify` は**知らせの本体**。**切ると穴が開く。**

### VCSystemTray を本当に外すには（管理者の PowerShell）

```powershell
Disable-ScheduledTask -TaskName 'VAIO Care' -TaskPath '\Sony Corporation\VAIO Care\'
# 戻すとき
Enable-ScheduledTask  -TaskName 'VAIO Care' -TaskPath '\Sony Corporation\VAIO Care\'
```

---

## 4. 残り

**残り0件。** ＊`VAIO Care`・SysMain・pagefile・healthchecks の check 作りは**人手待ち**のまま。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **374件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0921-1805.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805.md) | 09-21 17:47 | 枠の上限 — 8分を超え、かつ空きが400MBを割ったら仕事を切る |
| [`y0921-1700.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1700.md) | 09-21 17:02 | 立てる数を減らす — **毎分 22.7本 → 10.6本**／`--continue` を外した |
| [`y0921-1635.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1635.md) | 09-21 16:38 | 網の切れの一覧と、窓隠しの検収 |
| [`y0921-1625.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1625.md) | 09-21 16:26 | 包みの待ちの確かめ・再起動の内側の上限・押しの詰まりの元 |
| [`y0921-1600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1600.md) | 09-21 15:53 | 二件の取り下げと、走りかけの子 125本の片付け |

<!-- 控えの一覧 ここまで -->
