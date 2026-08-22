# stable を進めて、グロードへの連絡文の下書きを作る。
#
#   使い方
#     .\release-stable.ps1 -Commit <sha|HEAD>          … 進めて、投げて、報告書へ残す
#     .\release-stable.ps1 -Commit HEAD -DryRun        … 何も動かさず、文面だけ見る
#     .\release-stable.ps1 -Commit HEAD -NoTag         … タグは動かさず、連絡だけ出す（試し運転）
#     .\release-stable.ps1 -Commit HEAD -Lines "行1","行2"  … 文言だけ手で差し替える
#
# ＊これは stable を進めたときだけ走る。見張り（watch-notify.ps1）とフック（hook-notice.ps1）
#   には一切繋がっていない。ヨシ待ちや完了の知らせに混ざることはない。
#
# ＊変わり目の材料は「前回 stable から今回 stable までのコミットの題」から拾う。
#   本体を触った回は作法§4・§6により必ず題が「v<番号> 」で始まるので、そこだけ残せば
#   検査・報告書・見張りの回は自然に落ちる。言葉で除外するより確実。
#
# ＊このファイルは必ず BOM 付きの UTF-8 で保存すること。
#   Windows PowerShell 5.1 は BOM の無い .ps1 を ANSI として読むため、日本語が壊れて構文エラーになる。

param(
  [string]$Commit = 'HEAD',
  [string[]]$Lines = @(),
  [switch]$DryRun,
  [switch]$NoTag,
  [switch]$NoPush
)

$ErrorActionPreference = 'Continue'   # git の終了コードは自分で見る

# git の出力は UTF-8。コンソールの文字コードが違うと復号を誤り、
# 日本語の直後の改行が食われて題どうしが繋がる（数え落とし）。
# 実測：Bash から起動すると OutputEncoding が shift_jis になり、60件が16件に見えた。
# 起動元によって変わるので、ここで固定する。
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) } catch { }
$Repo      = 'C:\Users\user\Desktop\mahjong\koushu-handan'
$Report    = Join-Path $Repo 'report-latest.md'
$TopicPath = 'C:\Users\user\.claude\rc-ntfy-topic.txt'
$ToolUrl   = 'https://kfsr148-art.github.io/koushu-handan/'
$Closing   = '触ってみて'
$NtfyTitle = 'グロード連絡どき'
$MaxLines  = 3

# 言い換え表。上から順に一度ずつ当てる。増やすときはここへ足す。
# 左は「題から括弧を落とした形」に対する正規表現、右は差し替え。
$SAYING = @(
  @{ p = '^説明文の一文を';                r = '遊び方の説明を' },
  @{ p = '実行時の文言に合わせた$';        r = '実際の動きに合わせた' },
  @{ p = 'を[^を]*から[^を]*へ替えた$';    r = 'の絵が変わった' },
  @{ p = 'を入れた$';                      r = 'が付いた' },
  @{ p = 'を足した$';                      r = 'が増えた' },
  @{ p = 'を追加した$';                    r = 'が増えた' }
)

# これが残っている行は内部の話。落とす。
$INNER = 'check|検査|報告|見張り|フック|ntfy|hook|commit|push|申し送り|probe|headless'

# ---- 連絡文の材料を拾う ----
function Get-Changes([string]$from, [string]$to) {
  $subs = @(& git -C $Repo log --format=%s "$from..$to")
  $out = @()
  foreach ($s in $subs) {
    if ($s -notmatch '^v\d+\s') { continue }           # 本体を触った回だけ
    $t = $s -replace '^v\d+\s+', ''                    # 版番号を落とす
    $t = ($t -split '[（(]')[0]                        # 最初の括弧で切る（中は必ず内部の話）
    $t = $t.Trim() -replace '[、。／/]+$', ''
    foreach ($k in $SAYING) { $t = $t -replace $k.p, $k.r }
    $t = $t -replace 'v\d+', ''                        # 版番号の残りを落とす
    $t = $t.Trim()
    if (-not $t) { continue }
    if ($t -match $INNER) { continue }                 # 内部の言葉が残る行は出さない
    $out += $t
  }
  # git log は元から新しい順。並べ替えない（大きい報せが先頭に来る）
  if ($out.Count -gt $MaxLines) { $out = $out[0..($MaxLines - 1)] }
  return $out          # 包み直さない。呼び手の @() で配列に戻す
}

# ---- 連絡文を組む ----
function Build-Draft([string[]]$ch) {
  $b = New-Object System.Text.StringBuilder
  [void]$b.AppendLine($ToolUrl)
  [void]$b.AppendLine('')
  foreach ($c in $ch) { [void]$b.AppendLine('・' + $c) }
  [void]$b.AppendLine('')
  [void]$b.Append($Closing)
  return $b.ToString()
}

# ---- ntfy へ投げる ----
function Send-Draft([string]$draft) {
  if (-not (Test-Path -LiteralPath $TopicPath)) { Write-Host '  NG 話題名のファイルが無い'; return $false }
  $topic = (Get-Content -LiteralPath $TopicPath -Raw -Encoding UTF8).Trim()
  if (-not $topic) { Write-Host '  NG 話題名が空'; return $false }
  # 題は RFC 2047 で符号化して日本語を通す。ヘッダに生の日本語は載せない。
  $enc = '=?UTF-8?B?' + [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($NtfyTitle)) + '?='
  $tmp = [System.IO.Path]::GetTempFileName()
  try {
    [System.IO.File]::WriteAllText($tmp, $draft, (New-Object System.Text.UTF8Encoding($false)))
    $out = & curl.exe -s -S --max-time 20 `
      -H ('Title: ' + $enc) -H 'Priority: default' -H 'Tags: mailbox' `
      -H 'Content-Type: text/plain; charset=utf-8' `
      --data-binary ('@' + $tmp) ('https://ntfy.sh/' + $topic) 2>&1
    $code = $LASTEXITCODE
    Write-Host ('  送信 exit=' + $code + ' 返り=' + (($out | Out-String).Trim() -replace '\s+', ' '))
    # 送れたものは、報告書の末尾の「送った知らせ」へそのまま書き写す。
    if ($code -eq 0) {
      try {
        $t64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($NtfyTitle))
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File 'C:\Users\user\.claude\notify-record.ps1' -TitleB64 $t64 -BodyFile $tmp | Out-Null
      } catch { }
    }
    return ($code -eq 0)
  } finally { try { [System.IO.File]::Delete($tmp) } catch { } }
}
# ---- 報告書の末尾へ残す ----
function Append-Report([string]$draft) {
  $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
  $block = @()
  $block += ''
  $block += '---'
  $block += ''
  $block += ('## グロード連絡どき（' + $stamp + ' の下書き）')
  $block += ''
  $block += 'そのまま写して送れます。'
  $block += ''
  $block += '```'
  $block += ($draft -split "`r?`n")
  $block += '```'
  Add-Content -LiteralPath $Report -Value $block -Encoding UTF8
}

# ================= ここから本番 =================
Write-Output '=== stable を進める ==='

# 1) 前回 stable
$prev = ''
try { $prev = (& git -C $Repo rev-parse stable 2>$null | Select-Object -First 1) } catch { }
if ($prev) { $prev = $prev.Trim() }
if (-not $prev) { Write-Output 'NG stable タグが無い。初回は手で付けること。'; exit 1 }
$t1 = (& git -C $Repo log -1 --format='%h  %s' $prev)
Write-Output ('  前回 stable : ' + $t1.Substring(0, [Math]::Min(74, $t1.Length)))

# 2) 進める先
$target = (& git -C $Repo rev-parse $Commit | Select-Object -First 1).Trim()
$t2 = (& git -C $Repo log -1 --format='%h  %s' $target)
Write-Output ('  進める先    : ' + $t2.Substring(0, [Math]::Min(74, $t2.Length)))
if ($prev -eq $target) { Write-Output '  → 同じ commit。動かすものがない。'; exit 0 }

# 3) origin/main に載っているか（載っていない先へ stable を進めない）
& git -C $Repo fetch -q origin
& git -C $Repo merge-base --is-ancestor $target origin/main
if ($LASTEXITCODE -ne 0) { Write-Output 'NG 進める先が origin/main に載っていない。先に push すること。'; exit 1 }
Write-Output '  origin/main に載っている … OK'

# 4) タグを動かす
if ($DryRun)      { Write-Output '  [DryRun] タグは動かさない' }
elseif ($NoTag)   { Write-Output '  [NoTag] タグは動かさない（連絡だけ出す）' }
else {
  & git -C $Repo tag -f stable $target | Out-Null
  & git -C $Repo push -f origin stable | Out-Null
  if ($LASTEXITCODE -ne 0) { Write-Output 'NG stable の push に失敗'; exit 1 }
  Write-Output '  タグを動かして push した'
}

# 5) 変わり目を拾う
Write-Output ''
Write-Output '=== 変わり目 ==='
$ch = @()
if ($Lines.Count -gt 0) {
  $ch = $Lines
  # -File で起動されたとき、'a','b','c' は一個の文字列 "a,b,c" として届く（Bash から呼ぶと必ずこうなる）。
  # 一個きりで読点混じりなら、潰れた配列とみなして開き直す。
  if ($ch.Count -eq 1 -and $ch[0] -match ',') {
    $ch = @($ch[0].Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ })
    Write-Output ("  （一個の文字列で届いたので " + $ch.Count + " 行へ開き直した）")
  }
  Write-Output '  （-Lines で手渡された文言を使う）'
} else {
  Write-Output ('  区間 : ' + $prev.Substring(0, 7) + '..' + $target.Substring(0, 7))
  $all  = @(& git -C $Repo log --format=%s "$prev..$target")
  # 数え落としの関門。題の数と commit の数が合わなければ、材料が欠けている恐れがある。
  # 欠けたまま連絡を組むと「言っていない変わり目」が生まれるので、送らずに止まる。
  $cnt = 0
  try { $cnt = [int]((& git -C $Repo rev-list --count "$prev..$target" | Select-Object -First 1).Trim()) } catch { $cnt = -1 }
  if ($cnt -ge 0 -and $all.Count -ne $cnt) {
    Write-Output ('  NG 題の数が合わない（題 ' + $all.Count + ' 件 / commit ' + $cnt + ' 件）。')
    Write-Output '     数え落としの恐れがあるので、連絡は組まずに止まる。もう一度走らせること。'
    exit 1
  }
  $kept = @($all | Where-Object { $_ -match '^v\d+\s' })
  Write-Output ('  題の総数 ' + $all.Count + ' 件 → 本体を触った回 ' + $kept.Count + ' 件')
  $ch = @(Get-Changes $prev $target)
}
foreach ($c in $ch) { Write-Output ('    ・' + $c) }
if ($ch.Count -eq 0) {
  Write-Output ''
  Write-Output '  遊ぶ人に見える変わり目がない。連絡は出さない。'
  exit 0
}

# 6) 連絡文
$draft = Build-Draft $ch
Write-Output ''
Write-Output '=== 連絡文（そのまま写して送れます） ==='
Write-Output '-----------------------------------------'
Write-Output $draft
Write-Output '-----------------------------------------'
if ($DryRun) { Write-Output ''; Write-Output '[DryRun] 送らず、報告書にも書かない。'; exit 0 }

# 7) 投げる
Write-Output ''
Write-Output '=== ntfy へ投げる ==='
[void](Send-Draft $draft)

# 8) 報告書へ残す
Append-Report $draft
Write-Output '  report-latest.md の末尾へ残した'

# 9) push
if ($NoPush) { Write-Output '  [NoPush] commit と push はしない（呼び手が行う）' }
else {
  & git -C $Repo add report-latest.md | Out-Null
  & git -C $Repo commit --no-verify -q -m 'report-latest.md：グロード連絡どきの下書きを追記' | Out-Null
  & git -C $Repo push --no-verify -q origin main | Out-Null
  if ($LASTEXITCODE -eq 0) { Write-Output '  報告書を push した' } else { Write-Output '  NG 報告書の push に失敗' }
}
Write-Output ''
Write-Output '=== 終わり ==='
