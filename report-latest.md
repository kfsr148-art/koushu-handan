# Edge の置き去りを閉じた（+210MB）／SysMain は**手が要る**

**終わり（残り0件）** — 2026-09-21 21:20（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## 1. SysMain — **止められなかった。人の手が要る**

```
いまの権限 : ふつうの利用者（昇格していない）
止められない       : Cannot open SysMain service on computer '.'
自動開始を切れない : Access is denied
後 : Running / 開始の種類 Auto   ← 変わっていない
```

**サービスの停止と開始の種類の変更は、管理者でないとできない。** この窓は昇格していないので、
**こちらでは当てられない。** 黙って「済」にはしない。

### やってほしいこと（管理者の PowerShell で一度だけ）

```powershell
Stop-Service -Name SysMain -Force
Set-Service  -Name SysMain -StartupType Disabled
Get-Service  -Name SysMain        # Stopped になっていれば済み
```

＊いまの SysMain は **svchost で私用 65MB**。止めれば、その分と、先読みのディスク仕事が減る。
＊この機械は**回転盤の HDD** なので、SysMain（SuperFetch）の先読みは効きにくく、
　詰まったときには足を引っ張る側に回りやすい。

### 戻し方（元に戻したくなったとき）

```powershell
Set-Service  -Name SysMain -StartupType Automatic
Start-Service -Name SysMain
```

---

## 2. msedge 5本 — **置き去りだった。閉じた**

### 閉じる前の姿（親と命令行）

| pid | 起動 | 私用 | 親 | 命令行の要点 |
|---|---|---|---|---|
| **6400** | 20:23:15 | **53MB** | **（親不在）** | `msedge.exe --flag-switches-begin --flag-switches-end **--no-startup-window**` |
| 12016 | 20:23:33 | 3MB | msedge(6400) | `--type=crashpad-handler` |
| 9084 | 20:23:48 | 15MB | msedge(6400) | `--type=gpu-process` |
| 2852 | 20:23:48 | 14MB | msedge(6400) | `--type=utility --utility-sub-type=network.mojom.NetworkService` |
| 10180 | 20:23:51 | 8MB | msedge(6400) | `--type=utility --utility-sub-type=storage.mojom.StorageService` |

### なぜ「置き去り」と判じたか

| 見たもの | 値 |
|---|---|
| 親の 6400 に **`--no-startup-window`** | **窓を持たずに背後で走る形**（Edge の「バックグラウンドで動かす」） |
| **`--type=renderer` の子** | **0本** ＝ **開いている頁が一つも無い** |
| `koushu-` の印 | 0本 ＝ 検査（`check.js`）由来でもない |
| 残り4本 | すべて 6400 の子（crashpad・gpu・network・storage の下働き） |

**頁を描いている子が一本も無い**ので、**遠隔の画面でも人が見ている物でもない**。
＊もし頁が開いていたら触らない造りにしてある（`--type=renderer` が1本でもあれば閉じずに帰る）。
＊毎朝 03:00 の `ClaudeEdgeSweep` が同じ物を落としている（09-20 は5本231MB、09-21 は8本589MB）。

### 閉じた結果

| | |
|---|---|
| 落としたもの | **親の 6400 を1本**（子4本は道連れで消えた） |
| msedge | **5本 → 0本** |
| **空き** | **814MB → 1,024MB（＋210MB）** |

---

## 3. 残り

**残り0件。**（SysMain は**人手待ち**として未検収に積んだ。台帳の未了ではない。）

## 4. 実機で見るところ

- **管理者の PowerShell で上の3行**を打って、`Get-Service SysMain` が **Stopped** になること。
  そのあと空きが 65MB ぶん増えていれば効いている。
- Edge は閉じてあるが、**使えば普通に立ち上がる**（消したのは背後の居座りだけ）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **370件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0921-1335.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1335.md) | 09-21 13:31 | 09-20 22:00 からの乱れ一枚と、網／ディスクの突き合わせ |
| [`y0921-1250.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1250.md) | 09-21 12:59 | 起き上がりの道を直して、再起動を一日二回にする |
| [`r0921-1246-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0921-1246-2.md) | 09-21 12:46 | 再起動-2（r0921-1246・後の測り） |
| [`y0921-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1040.md) | 09-21 10:41 | 「写した刻」を字面で確かめて消した |

<!-- 控えの一覧 ここまで -->
