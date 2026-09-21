# 足跡の合図と、手待ちの畳み／pagefile は**手が要る**

**終わり（残り0件）** — 2026-09-21 21:28（VAIO）。`koushu-handan.html`・`stable` には触っていない。
**三つのうち二つは入り、一つ（pagefile）は昇格が要って当てられなかった。**

---

## 1. 「claude の足跡」の合図 — **打つ側は入った。check はまだ作れない**

### 入れたもの（打つ側）

常駐の巡回に **`Ping-Ashiato`** を足した。

| | |
|---|---|
| いつ打つか | **`hook.log` が書かれるたび**（最終書きが前に打った刻より新しいときだけ） |
| 合図先 | **`~/.claude/hc-ashiato.txt` の一行目**（`hc-watch.txt` と同じ置き方） |
| 記録 | `hc-ping.log` に `足跡  hook.log=HH:MM:SS  code=…` の一行 |
| 貼られていないとき | **黙って飛ばす**（うるさくしない） |

**鍵は台本にも札にも書いていない。** 綴りには**雛形だけ**を置いた（URL の行は空）。

### **check そのものは、こちらでは作れなかった**

healthchecks.io に check を作るには**管理用の API 鍵**が要る。
`~/.claude` を当たったが、**管理 API の鍵は一つも無い**（`hc-watch.txt` にあるのは打つ先の URL だけ）。
**鍵が無いので、こちらからは作れない。**

### やってほしいこと

1. healthchecks.io で check を一本作る … **Period 10分／Grace 10分／ntfy を ON**、名は「claude の足跡」
2. その **Ping URL を `~/.claude/hc-ashiato.txt` に一行**貼る（`#` で始まる説明行はそのままでよい）

**貼れば次の巡回から打ち始める。** こちらは何もしなくてよい。

---

## 2. 手待ちで綴りが太ったら `/clear` を打つ — **入った**

| | |
|---|---|
| 打つ条件 | **手待ち**（鍵が `run:` でない・台帳の未了0件・ヨシ待ち0件）**かつ 綴りが15MB超** |
| 何を打つか | **`/clear`**。道は **`鍵:ESC` と同じ**（コンソールの入力口へ直接。焦点も動かさない） |
| 鳴らす物 | **「🪟 控えを畳みました（NNMB）」を一度だけ**（敷居を下回るまで黙る・控えは `clear-sent.txt`） |
| 見るもの | `projects/…` の中で**いちばん新しく書かれた** `.jsonl` |

新しい送り手は **`~/.claude/send-text.ps1`**（`send-esc.ps1` の写し。一行打って Enter）。
**`send-esc.ps1` には触っていない。**

### 作り値

| 場合 | 打ったか | 鳴らした題 |
|---|---|---|
| **甲 手待ち・20MB** | **打った（`/clear`）** | **🪟 控えを畳みました（20MB）** |
| **乙 走行中・20MB** | 打たない | なし |
| **丙 手待ち・5MB** | 打たない | なし |
| 念のため：同じ太さで二度目 | **打たない** | なし |

**本物の窓へは一字も打っていない・本物の ntfy も鳴らしていない。**

＊**いまの綴りは 6.4MB** なので、まだ敷居の下。`clear-sent.txt` も無い。

---

## 3. pagefile 4096MB の固定 — **当てられなかった（昇格が要る）**

```
自動まかせ（AutomaticManagedPagefile） : True
いま : C:\pagefile.sys / 割り当て 7303MB / 使用 274MB / 最大使用 794MB
自動まかせを切れない : アクセスは拒否されました
```

SysMain と同じで、**この窓はふつうの利用者**なので当てられない。

### やってほしいこと（管理者の PowerShell で一度だけ）

```powershell
$cs = Get-CimInstance Win32_ComputerSystem
Set-CimInstance -InputObject $cs -Property @{ AutomaticManagedPagefile = $false }
$pf = Get-CimInstance Win32_PageFileSetting -Filter "Name='C:\\\\pagefile.sys'"
Set-CimInstance -InputObject $pf -Property @{ InitialSize = 4096; MaximumSize = 4096 }
# 再起動してから確かめる
Get-CimInstance Win32_PageFileUsage | Select-Object Name, AllocatedBaseSize
```

＊**再起動するまで反映されない。** 定時の再起動（03:00／15:00）で入る。

### 戻し方（自動まかせへ返す）

```powershell
$cs = Get-CimInstance Win32_ComputerSystem
Set-CimInstance -InputObject $cs -Property @{ AutomaticManagedPagefile = $true }
```

---

## 4. 入れたあとの姿

| | |
|---|---|
| `~/.claude/inbox-watch.ps1` | **1846行 → 1959行**・構文0（写し `.bak-20260921k`） |
| `~/.claude/send-text.ps1` | 新設（`send-esc.ps1` の写し・ASCII 出力） |
| `~/.claude/hc-ashiato.txt` | 雛形（URL の行は空） |
| **常駐** | **pid 10540・21:26:01 起動**（台本の更新 21:24:58 より後）・例外なし |
| 空き | 1,037MB |

＊定義の突き合わせも掛けた。**足した手はすべて定義済み**（残る `Check-FreeMem`・`Get-Subject` は元からの
　任意の手と `subject.ps1` 側の手）。

---

## 5. 残り

**残り0件。** ＊pagefile と healthchecks の check 作りは**人手待ち**として未検収に積んだ。

## 6. 実機で見るところ

- **`hc-ashiato.txt` に URL を貼ったら**、`hc-ping.log` に `足跡 …` の行が増えること。
- 手待ちのまま綴りが **15MB** を越えたら、窓に **`/clear`** が入り
  **「🪟 控えを畳みました（NNMB）」**が鳴ること（いまは 6.4MB）。
- 管理者で pagefile を当てたあと、**再起動してから** `AllocatedBaseSize` が **4096** になること。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **371件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0921-1246-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0921-1246-2.md) | 09-21 12:46 | 再起動-2（r0921-1246・後の測り） |

<!-- 控えの一覧 ここまで -->
