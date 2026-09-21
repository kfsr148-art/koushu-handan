# 管理者の窓で一度走らせれば三つ当たる綴り

**終わり（残り0件）** — 2026-09-21 23:05（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## 1. 何をした

`~/.claude/dumps/apply-sysmain-pagefile.ps1` に **③ VAIO Care の予定の無効化**を足した。
これで **管理者の窓で一度走らせれば、三つとも当たる**。

| | 当てる物 |
|---|---|
| ① | **SysMain** … 止めて、自動開始を無効に |
| ② | **pagefile** … 自動まかせを切り、`C:\pagefile.sys` を **4096MB の固定**（初期＝最大） |
| ③ | **VAIO Care の予定** … `VCSystemTray`（私用77MB）を立てている札を無効に＋いま走っている物も落とす |

**戻し方は、同じ綴りのいちばん下に注として書いた**（走らせずに貼る形）。

| | |
|---|---|
| 大きさ | **5,612バイト / 89行** |
| BOM | **あり**（PowerShell の決まりどおり） |
| 構文の誤り | **0** |
| 結果の置き場 | `dumps\apply-result.txt`（一行ずつ残る） |

### 走らせ方

```
管理者の PowerShell で
  powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\user\.claude\dumps\apply-sysmain-pagefile.ps1"
```

＊**pagefile は再起動してから効く**（定時の 03:00／15:00 で入る）。
＊管理者でない窓で走らせると、**三つとも「アクセスは拒否されました」で終わる**。
　その場合でも一行目に `管理者か : False` と残るので、すぐ分かる。

---

## 2. 中身の写し（全文）

```powershell
# apply-sysmain-pagefile.ps1 — 管理者の窓で一度だけ走らせる（2026-09-21）
#
#   当てる物は三つ。
#     ① SysMain … 止めて、自動開始を無効にする
#     ② pagefile … 自動まかせを切り、C:\pagefile.sys を 4096MB の固定（初期＝最大）にする
#     ③ VAIO Care の予定 … VCSystemTray（私用77MB）を立てている札を無効にする
#
#   ＊どれも**管理者でないと当たらない**。ふつうの窓で走らせると、全部「アクセスは拒否されました」で終わる。
#   ＊結果は dumps\apply-result.txt に一行ずつ残る。走らせたあと、その綴りを見れば当たったか分かる。
#   ＊**pagefile は再起動してから効く**（定時の再起動 03:00／15:00 で入る）。
#   ＊戻し方は、この綴りのいちばん下の注に書いてある。
$out = 'C:\Users\user\.claude\dumps\apply-result.txt'
function W([string]$m) {
  try { Add-Content -LiteralPath $out -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $m) -Encoding UTF8 } catch { }
  Write-Output $m
}
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
W ('--- 始め。管理者か : ' + $isAdmin)
if (-not $isAdmin) { W '＊管理者ではありません。このまま走らせても三つとも当たりません。' }

# ---- ① SysMain ----
try { Stop-Service SysMain -Force -ErrorAction Stop; W '① SysMain を止めた' }
catch { W ('① SysMain を止められない : ' + $_.Exception.Message.Split([char]10)[0].Trim()) }
try { Set-Service SysMain -StartupType Disabled -ErrorAction Stop; W '① SysMain の自動開始を無効にした' }
catch { W ('① SysMain を無効にできない : ' + $_.Exception.Message.Split([char]10)[0].Trim()) }

# ---- ② pagefile ----
try {
  $cs = Get-CimInstance Win32_ComputerSystem
  $cs.AutomaticManagedPagefile = $false
  Set-CimInstance -InputObject $cs -ErrorAction Stop
  W '② 自動まかせを切った'
} catch { W ('② 自動まかせを切れない : ' + $_.Exception.Message.Split([char]10)[0].Trim()) }
try {
  $pf = Get-CimInstance Win32_PageFileSetting
  if (-not $pf) { $pf = New-CimInstance -ClassName Win32_PageFileSetting -Property @{ Name = 'C:\pagefile.sys' } }
  $pf.InitialSize = 4096
  $pf.MaximumSize = 4096
  Set-CimInstance -InputObject $pf -ErrorAction Stop
  W '② pagefile を 4096/4096 にした（再起動してから効く）'
} catch { W ('② pagefile を当てられない : ' + $_.Exception.Message.Split([char]10)[0].Trim()) }

# ---- ③ VAIO Care の予定（VCSystemTray を立てる物）----
try {
  $bak = 'C:\Users\user\.claude\task-bak-20260921\SonyVAIOCare-off.xml'
  $x = Export-ScheduledTask -TaskName 'VAIO Care' -TaskPath '\Sony Corporation\VAIO Care\' -ErrorAction Stop
  Set-Content -LiteralPath $bak -Value $x -Encoding UTF8
  W ('③ VAIO Care の札を控えた : ' + $bak)
} catch { W ('③ VAIO Care を控えられない : ' + $_.Exception.Message.Split([char]10)[0].Trim()) }
try {
  Disable-ScheduledTask -TaskName 'VAIO Care' -TaskPath '\Sony Corporation\VAIO Care\' -ErrorAction Stop | Out-Null
  W '③ VAIO Care の予定を無効にした'
} catch { W ('③ VAIO Care を無効にできない : ' + $_.Exception.Message.Split([char]10)[0].Trim()) }
try {
  $v = @(Get-Process VCSystemTray -ErrorAction SilentlyContinue)
  foreach ($p in $v) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }
  W ('③ いま走っている VCSystemTray を ' + $v.Count + '本 落とした')
} catch { }

# ---- 確かめ ----
try { $s = Get-Service SysMain; W ('確かめ SysMain : ' + $s.Status + ' / ' + $s.StartType) } catch { }
W ('確かめ AutomaticManagedPagefile : ' + (Get-CimInstance Win32_ComputerSystem).AutomaticManagedPagefile)
$any = @(Get-CimInstance Win32_PageFileSetting)
if ($any.Count -eq 0) { W '確かめ pagefile : 設定は空（＝まだ自動まかせ）' }
foreach ($x in $any) { W ('確かめ pagefile : ' + $x.Name + ' 初期 ' + $x.InitialSize + ' 最大 ' + $x.MaximumSize) }
try { $t = Get-ScheduledTask -TaskName 'VAIO Care' -TaskPath '\Sony Corporation\VAIO Care\'; W ('確かめ VAIO Care : ' + $t.State) } catch { W '確かめ VAIO Care : 読めない' }
W '--- 終わり。pagefile は再起動してから効きます。'

# ============================================================================
# 戻し方（この綴りは走らせず、下の行を管理者の窓へ貼る）
#
#   ① SysMain を元へ
#        Set-Service  -Name SysMain -StartupType Automatic
#        Start-Service -Name SysMain
#
#   ② pagefile を自動まかせへ返す（再起動してから効く）
#        $cs = Get-CimInstance Win32_ComputerSystem
#        $cs.AutomaticManagedPagefile = $true
#        Set-CimInstance -InputObject $cs
#      ＊大きさだけ変えたいときは
#        $pf = Get-CimInstance Win32_PageFileSetting
#        $pf.InitialSize = <MB>; $pf.MaximumSize = <MB>; Set-CimInstance -InputObject $pf
#
#   ③ VAIO Care の予定を元へ（次のログオンから VCSystemTray がまた立つ）
#        Enable-ScheduledTask -TaskName 'VAIO Care' -TaskPath '\Sony Corporation\VAIO Care\'
#      ＊札ごと戻すなら
#        Register-ScheduledTask -Xml (Get-Content 'C:\Users\user\.claude\task-bak-20260921\SonyVAIOCare-off.xml' -Raw) `
#          -TaskName 'VAIO Care' -TaskPath '\Sony Corporation\VAIO Care\' -Force
# ============================================================================
```

---

## 3. 残り

**残り0件。** ＊この綴りを**管理者で走らせること**が人手待ち。走らせれば
SysMain・pagefile・VAIO Care の三つが片付く。

## 4. 実機で見るところ

- 走らせたあと `dumps\apply-result.txt` に
  `① SysMain を止めた` `② pagefile を 4096/4096 にした` `③ VAIO Care の予定を無効にした` が並ぶこと。
- 末尾の「確かめ」の行が **SysMain : Stopped / Disabled**、**VAIO Care : Disabled** になっていること。
- **pagefile だけは再起動のあと**、`確かめ pagefile : C:\pagefile.sys 初期 4096 最大 4096` になること。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **375件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0921-1805.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805.md) | 09-21 17:47 | 枠の上限 — 8分を超え、かつ空きが400MBを割ったら仕事を切る |
| [`y0921-1700.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1700.md) | 09-21 17:02 | 立てる数を減らす — **毎分 22.7本 → 10.6本**／`--continue` を外した |
| [`y0921-1635.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1635.md) | 09-21 16:38 | 網の切れの一覧と、窓隠しの検収 |
| [`y0921-1625.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1625.md) | 09-21 16:26 | 包みの待ちの確かめ・再起動の内側の上限・押しの詰まりの元 |

<!-- 控えの一覧 ここまで -->
