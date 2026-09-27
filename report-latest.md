# tasks-to-0320.ps1 に二つ足した（断片の整理・仮想メモリの自動管理）（r0927-1955）

**終わり（残り0件）** — 2026-09-27 19:56ごろ（VAIO）。本体には触っていない。**台本は走らせていない。**

## 足したこと
1. **断片の整理（\Microsoft\Windows\Defrag\ScheduledDefrag）も毎日 03:20 の一つに寄せる。** 今は刻の引き金が無い保守の仕事で、09-27 は 01:06:53〜01:50:51 に C: の最適化が走り、見張りごと固まった。ほかの四つと同じく、**写しを取ってから**引き金を 03:20 の一つにし、保守の起動と遅れて走る設定を外す
2. **仮想メモリの固定（C:\pagefile.sys 初期4096・最大4096）を外し、Windows の自動管理へ戻す**（Win32_ComputerSystem の AutomaticManagedPagefile を True）。変える前のいまの値は、写しの置き場の **pagefile-before.txt** へ書く。**効くのは次の再起動から**
3. **戻し方**を台本の末尾の注に書いた（仕事は写しの XML を schtasks で書き戻す／仮想メモリは固定の4096・4096 へ戻す一行）

## 見つけて足した守り
- **この台本は 09-27 19:45:55 に一度、管理者で走っている**（~/.claude/tasks-bak-20260927/result.txt）。Defender Cache Maintenance・SilentCleanup・Edge の更新・Google の更新の四つは**既に 03:20 へ寄せてある**。写し（.xml）は元の設定のまま残っている（MaintenanceSettings・毎時 PT1H が入っている）
- そのまま二度目を走らせると、**既に寄せた後の設定で写しを上書きし、戻り先が消える**。そこで「**写しが既にあれば上書きしない**」を足した（pagefile-before.txt も同じ）。四つは同じ形で書き直されるだけで、変わらない
- 構文検査 NG 0・BOM つき・CRLF

## 起こす一行（管理者の窓を出す。UAC の「はい」が要る）
```powershell
Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File "C:\Users\user\.claude\tasks-to-0320.ps1"'
```
＊先に中身だけ見るなら、`-File` の後ろに ` -DryRun` を足す（予定表にも仮想メモリにも触らない）。
＊走らせた後、仮想メモリの自動管理は**次の再起動から**効く。

## 台本の全文（~/.claude/tasks-to-0320.ps1）
```powershell
# tasks-to-0320.ps1 — 夜 23時台に一斉に立つ保守・更新の仕事を、毎日 03:20 に寄せる（2026-09-27）。
#   ＊管理者で走らせる（Defender・SilentCleanup・Edge・Google の仕事は管理者でないと書き替えられない）。
#   ＊変える前に、各仕事の設定（XML）を ~/.claude/tasks-bak-20260927/ へ写す。
#     戻すときは：schtasks /Create /TN "<道と名>" /XML "<写しの .xml>" /F
#   ＊変えること：
#     ① 引き金を「毎日 03:20」の一つにする（Edge・Google の毎時の引き金も、これ一つに置き換わる）
#     ② 保守の仕事としての起動（MaintenanceSettings）を外す
#     ③ 取りこぼしを後で走らせる設定（StartWhenAvailable）を切る——切らないと、
#        03:20 に走れなかった日は、手の空いた夜（23時台）にまた回ってくる
#   ＊-DryRun を付けると、書き替えた XML を写しの置き場に出すだけで、予定表にも仮想メモリにも触らない。
#   ＊2026-09-27 に二つ足した：断片の整理（ScheduledDefrag）も 03:20 へ寄せる／仮想メモリの固定を外して自動管理へ戻す。
#     戻し方は台本の末尾の注にある。
param([switch]$DryRun)
$ErrorActionPreference = 'Stop'
$bak = 'C:/Users/user/.claude/tasks-bak-20260927'
New-Item -ItemType Directory -Force $bak | Out-Null
$log = Join-Path $bak 'result.txt'
function W([string]$m) { Add-Content -LiteralPath $log -Encoding UTF8 -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $m); $m }
$targets = @(
  @('\Microsoft\Windows\Windows Defender\', 'Windows Defender Cache Maintenance'),
  @('\Microsoft\Windows\DiskCleanup\', 'SilentCleanup'),
  @('\', 'MicrosoftEdgeUpdateTaskMachineUA'),
  @('\GoogleSystem\GoogleUpdater\', 'GoogleUpdaterTaskSystem152.0.7933.0{3F953A55-30FA-4720-B325-752885319732}'),
  # 断片の整理（2026-09-27 に足した）。09-27 01:06:53〜01:50:51 に C: の最適化が走り、見張りごと固まった。
  @('\Microsoft\Windows\Defrag\', 'ScheduledDefrag')
)
$NS = 'http://schemas.microsoft.com/windows/2004/02/mit/task'
foreach ($t in $targets) {
  $path = $t[0]; $name = $t[1]
  $safe = ($name -replace '[^A-Za-z0-9 ._-]', '_')
  try {
    $xmlText = Export-ScheduledTask -TaskPath $path -TaskName $name
    # 写しは一度だけ取る。既にある写しは上書きしない（2026-09-27）——二度目に走らせると、既に 03:20 へ寄せた後の
    #   設定を写しとして書いてしまい、戻り先（最初の設定）が消える。09-27 19:45 に一度走っているので要る。
    $bf = Join-Path $bak ($safe + '.xml')
    if (-not $DryRun -and -not (Test-Path -LiteralPath $bf)) { [IO.File]::WriteAllText($bf, $xmlText, [Text.Encoding]::Unicode) }
    [xml]$x = $xmlText
    $m = New-Object System.Xml.XmlNamespaceManager($x.NameTable); $m.AddNamespace('t', $NS)
    $task = $x.SelectSingleNode('/t:Task', $m)
    # ① 引き金を毎日 03:20 の一つにする
    $old = $x.SelectSingleNode('/t:Task/t:Triggers', $m); if ($old) { [void]$task.RemoveChild($old) }
    $trg = $x.CreateElement('Triggers', $NS); $cal = $x.CreateElement('CalendarTrigger', $NS)
    $sb = $x.CreateElement('StartBoundary', $NS); $sb.InnerText = '2026-09-27T03:20:00'
    $en = $x.CreateElement('Enabled', $NS); $en.InnerText = 'true'
    $sd = $x.CreateElement('ScheduleByDay', $NS); $di = $x.CreateElement('DaysInterval', $NS); $di.InnerText = '1'; [void]$sd.AppendChild($di)
    [void]$cal.AppendChild($sb); [void]$cal.AppendChild($en); [void]$cal.AppendChild($sd); [void]$trg.AppendChild($cal)
    $reg = $x.SelectSingleNode('/t:Task/t:RegistrationInfo', $m)
    if ($reg) { [void]$task.InsertAfter($trg, $reg) } else { [void]$task.PrependChild($trg) }
    $settings = $x.SelectSingleNode('/t:Task/t:Settings', $m)
    # ② 保守の仕事としての起動を外す
    $ms = $x.SelectSingleNode('/t:Task/t:Settings/t:MaintenanceSettings', $m); if ($ms) { [void]$settings.RemoveChild($ms) }
    # ③ 取りこぼしを後で走らせない
    $swa = $x.SelectSingleNode('/t:Task/t:Settings/t:StartWhenAvailable', $m); if ($swa) { $swa.InnerText = 'false' }
    $out = Join-Path $bak ($safe + '.new.xml')
    [IO.File]::WriteAllText($out, $x.OuterXml, [Text.Encoding]::Unicode)
    if ($DryRun) { W ('（試し）書き替えた XML を出した：' + $out); continue }
    $r = & schtasks.exe /Create /TN ($path + $name) /XML $out /F 2>&1
    W ('寄せた：' + $path + $name + '（' + (($r | Out-String).Trim()) + '）')
  } catch { W ('寄せられなかった：' + $path + $name + '：' + $_.Exception.Message) }
}

# ---- 仮想メモリの固定を外し、Windows の自動管理へ戻す（2026-09-27 に足した）----
#   ＊いまは C:\pagefile.sys を初期4096MB・最大4096MB に固定している（09-22 に入れた）。記憶を 8GB に足したので、
#     固定の上限（実の記憶＋4GB）で仮想メモリが尽きる形（09-27 02:30〜09:14 の不足 81回）を、自動の伸び縮みへ戻す。
#   ＊変える前に、いまの値を写しの置き場の pagefile-before.txt へ書く。効くのは次の再起動から。
try {
  $cs = Get-CimInstance Win32_ComputerSystem
  $pfs = @(Get-CimInstance Win32_PageFileSetting)
  $before = @('AutomaticManagedPagefile=' + $cs.AutomaticManagedPagefile) + @($pfs | ForEach-Object { $_.Name + ' InitialSize=' + $_.InitialSize + ' MaximumSize=' + $_.MaximumSize })
  if ($DryRun) {
    W ('（試し）仮想メモリ：いまは ' + ($before -join ' ／ ') + '。自動管理へ戻すところ')
  } else {
    $pb = Join-Path $bak 'pagefile-before.txt'
    if (-not (Test-Path -LiteralPath $pb)) { [IO.File]::WriteAllLines($pb, [string[]]$before, (New-Object System.Text.UTF8Encoding($true))) }
    Set-CimInstance -InputObject $cs -Property @{ AutomaticManagedPagefile = $true }
    $after = (Get-CimInstance Win32_ComputerSystem).AutomaticManagedPagefile
    W ('仮想メモリを自動管理へ戻した（前：' + ($before -join ' ／ ') + '・後：AutomaticManagedPagefile=' + $after + '）。効くのは次の再起動から')
  }
} catch { W ('仮想メモリを戻せなかった：' + $_.Exception.Message) }
W '済'

# ---- 戻し方（管理者の PowerShell で一行ずつ）----
#   仕事の引き金：~/.claude/tasks-bak-20260927/ の写し（<名>.xml）を一つずつ書き戻す
#     schtasks /Create /TN "<道と名>" /XML "C:\Users\user\.claude\tasks-bak-20260927\<名>.xml" /F
#   仮想メモリの固定（初期4096・最大4096）へ戻す：
#     $cs=Get-CimInstance Win32_ComputerSystem; Set-CimInstance -InputObject $cs -Property @{AutomaticManagedPagefile=$false}; $pf=Get-CimInstance Win32_PageFileSetting -Filter "Name='C:\\pagefile.sys'"; if (-not $pf) { $pf=New-CimInstance -ClassName Win32_PageFileSetting -Property @{Name='C:\pagefile.sys'} }; Set-CimInstance -InputObject $pf -Property @{InitialSize=4096; MaximumSize=4096}
#     （効くのは次の再起動から）
```

### 触った物
~/.claude/tasks-to-0320.ps1（足した・走らせていない）・orders-open.tsv・work-note.txt／reports/r0927-1955.md・report-latest.md

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **422件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0927-1955.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1955.md) | 09-27 19:56 | tasks-to-0320.ps1 に二つ足した（断片の整理・仮想メモリの自動管理）（r0927-1955） |
| [`r0927-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1945.md) | 09-27 19:49 | 09-27 01:00〜10:40 に VAIO が止まっていた元（r0927-1945・読むだけ） |
| [`r0927-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-1940.md) | 09-27 19:41 | 記憶の差し替えの読み（r0927-1940・読むだけ） |
| [`r0927-0023.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-0023.md) | 09-27 00:29 | 夜の保守・更新の仕事の起動条件と、03:20 へ寄せる管理者の一本（r0927-0023） |
| [`r0926-2357.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2357.md) | 09-27 00:08 | 毎晩 23時台に見張りが止まる元（r0926-2357・読むだけ） |
| [`r0926-2007-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2007-2.md) | 09-26 20:14 | 前の枠（19:43）の残り：一時間に書き替わる綴りの数（r0926-2007-2） |
| [`r0926-2007.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-2007.md) | 09-26 20:10 | VAIO の型番と記憶の差し口（r0926-2007・読むだけ） |
| [`r0926-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1940.md) | 09-26 19:41 | iCloud の起動を外して止めた（r0926-1940） |
| [`r0926-1927.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0926-1927.md) | 09-26 19:32 | VAIO の iCloud の読み（r0926-1927・読むだけ） |
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

<!-- 控えの一覧 ここまで -->
