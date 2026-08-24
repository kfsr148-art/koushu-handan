# 4100 警告の出どころを特定して直しました ／ 動作記録は無効に戻っています

**状態：ヨシ待ち（動作記録の有効化をもう一度）** — 2026-08-25 07:15 時点

## まず、動作記録について

**こちらで読むと、まだ無効です。** 三通りで読みました。

| 読み方 | 値 |
|---|---|
| `wevtutil gl` | `enabled: false` |
| `Get-WinEvent -ListLog` | `IsEnabled: False` |
| レジストリ `WINEVT\Channels\…\Enabled` | `0` |

管理者の窓で「後: enabled: true」と出たとのことなので、**そのときは入っていたはずです**。
あとで戻ったことになりますが、**戻った理由はまだ分かりません。**

そこで手順を強くしました（`~/.claude/enable-tasklog.ps1` を書き直し）。

- `wevtutil` ／ レジストリ ／ `Get-WinEvent` の**三通りで読み返す**
- `wevtutil` で入らなければ**レジストリへ直に書く**
- 最後に三つの値を並べて出す

これで「入ったのに戻った」のか「そもそも入っていない」のかが切り分けられます。
お手数ですが、もう一度これでお願いできますか。

```
! powershell.exe -NoProfile -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','C:\Users\user\.claude\enable-tasklog.ps1'"
```

---

## 1. どの行が警告を出していたか

**`~/.claude/inbox-watch.ps1:183`**

```powershell
$key = ((Get-Content -LiteralPath $StatePath -Encoding UTF8 | Select-Object -First 1) …
```

**辿り方（二分）**

| 外したもの | 4周での 4100 |
|---|---|
| 何も外さない | 4件 |
| `Publish-Status` を外す | **0件** ← ここに居る |
| `curl` を外す | 4件のまま（無関係） |
| `Sweep-Stale` を外す | 4件のまま（無関係） |

`curl` の `2>$null` も疑いましたが、単体で回すと0件でした。

**行の特定（それぞれ5回）**

| 書き方 | 4100 |
|---|---|
| `Get-Content \| Select-Object -First 1`（現行） | **5件** ← 1回につき1件。完全に一致 |
| `Get-Content -TotalCount 1` | 0件 |
| 全部読んで `[0]` | 1件（ノイズ） |
| `[System.IO.File]::ReadAllLines` | 0件 |

## 2. なぜ出るのか

`Select-Object -First` は、必要な数が揃った時点で**上流の走を途中で止めます**。その止め方が
内部の例外（`StopUpstreamCommandsException`）で、**PowerShell 5.1 はそれを警告4100
「システム エラーです」として記録に残します。**

つまり**誤りではなく、止め方そのものが記録されている**だけです。`$Error` にも入らないので、
スクリプトの側からは見えません。16秒ごとの巡回で毎回1件、一日にすると5000件を超えます。

## 3. 直した中身

同じ書き方が3箇所あったので、まとめて `-TotalCount 1` へ。

| 場所 | |
|---|---|
| `~/.claude/inbox-watch.ps1:76` | `Is-Waiting` の中 |
| `~/.claude/inbox-watch.ps1:183` | `Publish-Status` の中（**16秒ごとに出ていたのはここ**） |
| `~/.claude/notify-record.ps1:135` | 同じ書き方 |

それぞれの上に、なぜ使わないかの注記を置いてあります。

- `watch-notify.ps1:275,288` にも `Select-Object -First` がありますが、こちらは配列の切り出しで
  毎回は通らない枝にあります（記録にも watch-notify からの4100 は出ていません）。触っていません。
- **動いていた実体は 2026-08-23 23:54 起動**で、直した版を読みません。入れ替えました
  （新しい実体 PID=11332）。

> 入れ替えのとき、絞り込みの文字列に自分のコマンド行が引っ掛かり、**自分の窓まで一度
> 止めてしまいました。** すぐ立て直しています。

## 4. 実測

| | 直す前 | 直したあと |
|---|---|---|
| 写しで4周 | 4件 | **0件** |
| 本番で3分 | 約11件（16秒ごと1件） | **0件** |

## いまの版

本体 **v1426** ／ stable **`f3837e8`** ／ panel **v29**。本体もパネルも触っていません。
