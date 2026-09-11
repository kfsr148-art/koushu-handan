# look.ps1 — 読むだけの命令を一本で通す（2026-09-12・読むだけの台本-1・y0912-0300 の裁定は乙）
#
# 使い方（allow に入っているのはこの形だけ）
#   powershell -NoProfile -ExecutionPolicy Bypass -File C:/Users/user/Desktop/mahjong/koushu-handan/.claude/look.ps1 -Cmd '<命令>'
#   例：-Cmd 'Get-ScheduledTask ClaudeBoard | Select-Object TaskName,State'
#       -Cmd 'Select-String -Path C:\Users\user\.claude\hook.log -Pattern notification | Select-Object -Last 5'
#   ＊| や ; は -Cmd の字の中に入れる（外に出すと、許しの照らし合わせが命令ごとに割れる）。
#
# 通すもの（これ以外の命令が一つでも混ざったら、走らせずに断る）
#   Get-* ／ Select-String ／ Test-Path ／ Get-Content ／ Get-ScheduledTask ／ Get-CimInstance（どれも Get- か読むだけ）
#   並べ替え・絞り込み・形の整え：Where-Object ／ Select-Object ／ ForEach-Object ／ Sort-Object ／ Measure-Object ／
#   Group-Object ／ Format-Table ／ Format-List ／ Out-String ／ Write-Output ／ ConvertFrom-Json ／ ConvertTo-Json ／
#   Split-Path ／ Join-Path ／ Resolve-Path ／ Compare-Object ／ New-TimeSpan
#   ＊別名（% ? select gc gci ls cat など）は元の名へ引き直して照らす。
#
# 断るもの
#   ＊上に無い命令（Set-* ／ Remove-* ／ Stop-* ／ Start-* ／ Out-File ／ Invoke-* ／ 外の実行ファイル など）
#   ＊書き出しの向き（> >> 2> など）
#   ＊& と、行頭の . （別の台本を呼ぶ・読み込む）
#   ＊書く・消す・起こす形のメソッド（Delete ／ Write* ／ Append* ／ Kill ／ Start ／ Create* ／ Move* ／ Copy* ／
#     Invoke* ／ Save ／ Set* ／ Remove*）。字の Substring や [Math]::Min のような読むだけのものは通す
#
# ＊このファイルは BOM 付きの UTF-8 で保存すること（Windows PowerShell 5.1 は BOM が無いと日本語を読み違える）。
param([Parameter(Mandatory = $true)][string]$Cmd)

try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) } catch { }

$ALLOW = @('Select-String', 'Test-Path', 'Where-Object', 'Select-Object', 'ForEach-Object', 'Sort-Object',
           'Measure-Object', 'Group-Object', 'Format-Table', 'Format-List', 'Out-String', 'Write-Output',
           'ConvertFrom-Json', 'ConvertTo-Json', 'Split-Path', 'Join-Path', 'Resolve-Path', 'Compare-Object',
           'New-TimeSpan')
$BAD_METHOD = '^(Delete|Write|Append|Kill|Start|Create|Move|Copy|Invoke|Save|Set|Remove|Close|Open)'

function Refuse([string]$why) { [Console]::Error.WriteLine('look.ps1: 断った … ' + $why); exit 2 }

$err = $null
$toks = [System.Management.Automation.PSParser]::Tokenize($Cmd, [ref]$err)
if ($err -and $err.Count) { Refuse ('字の組み立てが読めない：' + $err[0].Message) }

$prev = $null
for ($i = 0; $i -lt $toks.Count; $i++) {
  $t = $toks[$i]
  $ty = [string]$t.Type
  $c = [string]$t.Content
  if ($ty -eq 'Command') {
    $name = $c
    $al = Get-Alias -Name $c -ErrorAction SilentlyContinue
    if ($al) { $name = [string]$al.Definition }
    if (-not ($name -like 'Get-*' -or $ALLOW -contains $name)) { Refuse ('通さない命令：' + $c) }
  }
  elseif ($ty -eq 'Operator') {
    if ($c -match '^[0-9*]?>') { Refuse ('書き出しの向き：' + $c) }
    $head = (-not $prev) -or ([string]$prev.Type -in @('NewLine', 'StatementSeparator', 'GroupStart')) -or
            ([string]$prev.Type -eq 'Operator' -and [string]$prev.Content -eq '|')
    if ($c -eq '&') { Refuse '& で呼ぶ形' }
    if ($c -eq '.' -and $head) { Refuse '行頭の . で読み込む形' }
    if ($c -eq '.' -or $c -eq '::') {
      $nx = $(if ($i + 1 -lt $toks.Count) { $toks[$i + 1] } else { $null })
      $nx2 = $(if ($i + 2 -lt $toks.Count) { $toks[$i + 2] } else { $null })
      if ($nx -and [string]$nx.Type -eq 'Member' -and $nx2 -and [string]$nx2.Type -eq 'GroupStart' -and
          [string]$nx.Content -match $BAD_METHOD) { Refuse ('書く・消す・起こす形のメソッド：' + $nx.Content) }
    }
  }
  if ($ty -ne 'Comment') { $prev = $t }
}

Invoke-Expression $Cmd
