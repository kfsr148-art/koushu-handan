# 再起動-1（後の測り）

**終わり（残り0件）** — 2026-09-19 04:19（VAIO）。**機械は 22:15:38 に起き上がり、6時間走っている。**
**WSearch と VCService は Stopped のまま**——ここが本当の確かめで、**通った**。

## ① 起き上がった後の実測（04:19:51）

| | |
|---|---|
| 起き上がった刻 | **2026-09-18 22:15:38**（それから **364分**＝6時間4分） |
| **空き物理メモリ** | **1052MB** ／ 総 3975MB（26.5%） |
| **claude** | **1本・pid 6960・456MB**・起きたのは **09-18 22:33:11**（再起動の18分後） |
| **WSearch** | 起き方=**Disabled**・状態=**Stopped** ✔ |
| **VCService** | 起き方=**Disabled**・状態=**Stopped** ✔ |
| VCAgent ／ SearchIndexer | **どちらも 0本** ✔ |

**上位6本** … claude 457MB ／ MsMpEng 298MB ／ explorer 257MB ／ msedge 133MB ／
SearchApp 92MB ／ powershell 88MB

## ② 再起動の前と並べる

| | 前（09-18 22:12） | 後（09-19 04:19） | 差 |
|---|---|---|---|
| 空き | **1122MB** | **1052MB** | **-70MB** |
| claude | **456MB**（6日走った pid 4796） | **456MB**（6時間走った pid 6960） | **±0** |
| WSearch／VCService | Disabled・Stopped | **Disabled・Stopped（変わらず）** | — |

**一行で** … **止めた二本は再起動を越えて上がらなかったが、空きは70MB下がり、claude は6時間で前と同じ456MBまで戻った。**

### 当てが外れた所（正直に）

**「開き直せば claude は 270〜360MB へ落ちる」（空きの内訳-2 ①）は、6時間後には残っていない。**
6日走った 456MB と、**6時間走った 456MB が同じ値**だった。
**claude の使用MBは走った長さでは決まらない**——開き直しで一時的に下がっても、半日で戻る。

**空きが下がった訳** … 二本が居なくなった190MBぶんより、**新しく立った物のほうが多い**。

| | 前 | 後 |
|---|---|---|
| explorer | 157MB | **257MB**（+100） |
| msedge | 0本 | **5本・133MB**（開き直された） |
| SearchApp | 居ない | **92MB**（新顔） |
| MsMpEng | 336MB | 298MB（-38） |

**+287MB ぶんが新しく乗り、-190MB（二本）と -38MB（Defender）を食い切った。**

## ③ 再起動-2（毎週土曜 01:00 の起こし）の枠 … **受け取っていない**

台帳に `再起動-2` の字は一件あるが、**2026-08-26 の別件**（「立ち上がり後、自動で戻った物と
手動だった物を時刻つきで報告」）。**毎週土曜01:00 の起こしの枠は台帳にも `orders-full.jsonl` にも無い。**
予定表にも**毎週の起こしは一件も無い**（`Claude*` の予定に Weekly の引き金はゼロ）。

## 触った所と触らない所

**触った所** … 無し（測っただけ）。

**触らない所** … 本体・`~/.claude` の台本・`WSearch`／`VCService` の設定（**Disabled のまま**）・
Defender・予定表の起こし・`claude` の窓。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **275件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0918-2212-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212-2.md) | 09-19 04:20 | 再起動-1（後の測り） |
| [`y0918-2212.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212.md) | 09-18 22:12 | 再起動-1（前の測り） |
| [`y0918-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2155.md) | 09-18 22:02 | 押しの敷居-2 |
| [`y0918-2145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2145.md) | 09-18 21:47 | 空きの片付け-2（後の測り） |
| [`y0918-2109.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2109.md) | 09-18 21:12 | 空きの片付け-2 |
| [`y0918-2055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2055.md) | 09-18 21:01 | 空きの内訳-2 |
| [`y0918-2049.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2049.md) | 09-18 20:53 | 鍵切れの見張り-1 |
| [`y0918-2035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2035.md) | 09-18 20:38 | 配信の譲り-1（乙・通し切る形へ） |
| [`y0918-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1953.md) | 09-18 20:00 | 配信の譲り-1 の下調べ |
| [`y0918-1923.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1923.md) | 09-18 19:24 | 公開の追いつき-1 |
| [`y0918-1846.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1846.md) | 09-18 19:05 | 起こしの重なり-1（乙・刻をずらす） |
| [`y0918-1831.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1831.md) | 09-18 18:35 | 起こしの重なり-1 の下調べ |
| [`y0918-1757.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1757.md) | 09-18 17:59 | 空きの片付け-1 |
| [`y0918-1747.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1747.md) | 09-18 17:50 | 空きの内訳-1 |
| [`y0918-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1305.md) | 09-18 13:06 | 軽い巡回の刻-1 |
| [`y0918-1221.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1221.md) | 09-18 12:24 | 止まりの読み-4 |
| [`y0918-0716.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0716.md) | 09-18 07:19 | 夜の較正-2 |
| [`y0918-0352.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0352.md) | 09-18 03:56 | 止まりの札の敷居-1 |
| [`y0917-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2140.md) | 09-17 21:35 | 呼び名の揃え-1 の下調べ |
| [`y0917-2122.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2122.md) | 09-17 21:25 | 問いかけの判じ-1 |

<!-- 控えの一覧 ここまで -->
