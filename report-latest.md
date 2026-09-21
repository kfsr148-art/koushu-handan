# 盤の健康・熱・画面バッファの調べ／昇格の問いは閉じられた

**終わり（残り0件）** — 2026-09-21 21:35（VAIO）。**読みだけ。何も直していない。**
`koushu-handan.html`・`stable` には触っていない。

---

## 0. 先に — **SysMain と pagefile は、まだ当たっていない**

頂いた命令をそのまま綴りにして、**昇格の問いを出した**（`dumps\apply-sysmain-pagefile.ps1`）。
返ってきたのはこれ。

```
昇格の問いを出せない : This command cannot be run due to the error: The operation was canceled by the user.
結果の綴り : まだ何も書かれていない（＝走っていない）
```

**いまの姿も変わっていない。**

| | |
|---|---|
| SysMain | **Running ／ Automatic**（変わらず） |
| `Win32_PageFileSetting` | **空**（＝まだ自動まかせ） |
| `AutomaticManagedPagefile` | **True** |

＊**この窓からは昇格できない。** 画面に出た「はい」を押してもらうか、
　**管理者の PowerShell を自分で開いて**、頂いた命令をそのまま貼ってください。
　（綴りは置いてあるので `powershell -File "C:\Users\user\.claude\dumps\apply-sysmain-pagefile.ps1"` でも同じです。
　結果は `dumps\apply-result.txt` に残ります。）

---

## 1. 盤の健康

| 見るもの | 値 |
|---|---|
| 綴り | `Hitachi HTS547575A9E384` ／ **HDD** |
| **HealthStatus** | **Healthy** |
| OperationalStatus | **OK** |
| ReadErrorsTotal ／ Wear ／ Temperature | **読めない** — `Get-StorageReliabilityCounter` が
`クライアントが CIM リソースへのアクセスを取得できませんでした`（**昇格が要る**） |

**SMART の細かい数は、管理者でないと取れない。** 上の三つは昇格した窓でないと出ない。
＊健康の見立て（Healthy／OK）だけは、ふつうの利用者でも読めていて、**異常は出ていない**。

### System の 7・51・153（直近7日）

| id | 件数 | 最後 | 中身 |
|---|---|---|---|
| **7**（不良ブロック） | **0件** | — | — |
| **51**（ページングの誤り） | **0件** | — | — |
| **153**（IO の再試行） | **3件** | 09-21 11:50:42 | **※下記のとおり盤とは無関係だった** |

**153 の三件は、盤の再試行ではない。** 中身を開いたら三件とも

```
Microsoft-Windows-Kernel-Boot  仮想化ベースのセキュリティ (ポリシー: 0) が disabled。
  09-18 22:15:39 ／ 09-20 23:21:52 ／ 09-21 11:50:42
```

**立ち上がりのたびに一度出るお知らせ**で、三つの刻は**三回の起動**とぴったり合う。
`153` は綴りによって意味が違う（`disk` の 153 が IO 再試行）ので、**番号だけで読むと取り違える。**
**この機械では、盤の再試行は直近7日で0件。**

## 2. 熱で絞られたか

| | |
|---|---|
| `Kernel-Processor-Power` の **37番** | **0件**（直近7日） |

**熱で絞られた跡は無い。** 詰まりの説明を熱に求めるのは、いまのところ当たらない。

## 3. 黒い窓の画面バッファ

| どこ | ScreenBufferSize | WindowSize | 字 |
|---|---|---|---|
| cmd の**既定**（`HKCU\Console`） | **幅 80 / 高さ 300** | 幅 80 / 高さ 25 | — |
| **題つきの設定**（`麻雀 攻守判断 (Claude Code)`） | **幅 170 / 高さ 9001** | 幅 170 / 高さ 44 | BIZ UDGothic / 16px |

**効いているのは題つきのほう**（`start "麻雀 攻守判断 (Claude Code)"` で題を付けて開くため）。
**9,001行 × 170桁**の巻き戻しを持っている。

**いまの起動の形**

```
/c start "麻雀 攻守判断 (Claude Code)" /MAX /D "C:\Users\user\Desktop\mahjong\koushu-handan"
   cmd.exe /k C:\Users\user\.claude\claude-loop.cmd
```

＊**起動の側では行数を指定していない。** 行数は**題つきのレジストリの項が決めている**
（`~/.claude/console-koushu.reg` が控え）。**題を変えるとこの設定ごと効かなくなる。**

---

## 4. 残り

**残り0件。** ＊SysMain・pagefile・healthchecks の check 作りは**人手待ち**のまま。

## 5. 実機で見るところ

- 管理者の窓で綴りを走らせたあと、`dumps\apply-result.txt` に
  `SysMain を止めた` `pagefile を 4096/4096 にした` の行が並ぶこと。
- SMART の細かい数（ReadErrors・Wear・Temperature）も、**その窓なら読める**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **372件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0921-1335.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1335.md) | 09-21 13:31 | 09-20 22:00 からの乱れ一枚と、網／ディスクの突き合わせ |
| [`y0921-1250.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1250.md) | 09-21 12:59 | 起き上がりの道を直して、再起動を一日二回にする |

<!-- 控えの一覧 ここまで -->
