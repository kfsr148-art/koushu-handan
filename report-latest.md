# 【納品】見立て行と釦の助言の文面を差し替えた（v1451）

**終わり（残り0件）** — 2026-09-19（VAIO）。印 **y0919-0815** のヨシを頂いて入れた。
**雲のフル版は success。`check` と `adv-check` の両方 PASS。**

## 差し替えた分岐の数 … **58**（置換は33箇所）

| 区分 | 分岐 |
|---|---|
| 人柄七人 `toneAngleLine` | **28**（執事2・軍師6・ずんだ4・お嬢様3・マダム2・一姫8・先生3） |
| 枝豆（スイッチ2・投票欄2・食い違い2） | **6** |
| AI（一致2・黙る1・投票欄2・食い違い2） | **7** |
| 現場猫（アラート2・一致1・黙る1・投票欄2） | **6** |
| 兎（釦2・投票欄3） | **5** |
| 執事の**役の名** | **3** |
| **〈色〉の名** | **3** |
| **合計** | **58** |

`mitate-new.txt` の字を**そのまま**入れた。置換はすべて**一意を確かめてから**当て、
置換文字列は関数で返した（作法28）。**シムなし。**

## ⑦ の二択 bottom … **最小値 287.3px**（900x300）

21視野すべて「溢れなし」で PASS。下が低い順に五つ。

| 視野 | 二択 bottom | 視野の高さ | 余白 |
|---|---|---|---|
| **900x300** | **287.3** | 300 | 12.7px |
| 900x340 | 307.3 | 340 | 32.7px |
| 800x348 | 311.3 | 348 | 36.7px |
| 800x349 | 311.8 | 349 | 37.2px |
| 800x350 | 312.3 | 350 | 37.7px |

＊`568x320`／`667x375`／`744x375`／`745x375` は **bottom が高さちょうど**（余白0.0px）。
　これは安全網が二択を画面の下端へ貼り付ける帯で、**前からこの値**（溢れではない）。
＊いちばん大きいのは 800x480 の 389.8 / 480。

## 条件・判定・光る牌・analyze は一字も触っていない

- diff に出た「条件に関わる字」9行は、すべて**既存の条件を読んで文を選んでいるだけ**
  （`edaVoteLean` の戻り／`a.fillWeak >= 2`／`shinshiLean`）
- **`TONE_SUIT_JP` は触っていない。** 表示用の `TONE_SUIT_YOMI` と `toneSuitYomi()` を新しく足し、
  `toneAngleLine` の差し込む所だけ通した。**L4455 の照合（染め手の判定）は素の名のまま**
- 執事の役の名は `F.multi.roles`（文面へ差し込むだけ）の値を替えただけ
- ⑦ の七人巡回も、`㉓ 第一感` の**光る牌・判定獣・攻守**も**前と同じ**

## 一度落ちて、前へ直した（作法18）

最初の走り（**35405797187**）は **㉓「第一感が移す前と変わらないか」で16件 FAIL**。
壊れたのではなく、**見立て行の字を替えたので基準が古くなった**だけ（⑦ はこの時も PASS）。

戻さず、落ちた16手の**新しい字を雲の記録からそのまま拾って** `first-sense-base.json` の
**`angle` だけ**を取り直した。**変わった欄は angle の16件だけ**で、残る13欄
（`vkey`・`multi`・`naki`・`dup`・`safe`・`float`・`edge`・`head`・`cut`・`cat`・`eda`・`om`）は**一つも動いていない**
＝**判定と光る牌は前と同じ**ことの裏取りにもなっている。

## 版と台詞

- **v1451 を三箇所同時**（`data-ver`／`verTag`／`ver.txt`）
- `serifu.txt`・`serifu-adv.txt` を**版を上げてから再抽出**し、`--check` で本体と一致を確認
  （合計 **7597行**・口調の混入 **0件**）

## 雲のフル版

| 走り | 刻 | 結果 |
|---|---|---|
| 35405797187（押しで自動） | 12分 | **failure**（㉓ の基準が古い16件） |
| **35406645289（手で起こした）** | **23:40:59Z → 23:53:21Z（12分22秒）** | **success ／ 両方PASS** |

＊`first-sense-base.json` は重い回の名簿に無いので、押しでは検査が走らない。手で起こして確かめた。

## 触った所と触らない所

**触った所** … `koushu-handan.html`（文面33箇所＋色の読みの表＋版2箇所）／`ver.txt`／
`serifu.txt`／`serifu-adv.txt`／`first-sense-base.json`（angle 16件）。

**触らない所** … `analyze`・`toneFacts` の条件・`tenLeans` の `lean`・`usagiLean`・
`edaVoteLean`／`edaSwitchLean`・スイッチの帯の式・光る牌の印（`multiIdx` ほか10種）・
`TONE_SUIT_JP` の値・`check.js`・`stable`（v1450 のまま）。

＊`stable` は実機で見て頂いてから進める（作法19）。**実機で見る所** … 判定カードの見立て行が
　新しい長い文になっていること、四つの釦（枝豆・AI・現場猫・兎）を押したときの一行も新しい字であること、
　版の字が **v1451** であること。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **281件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0919-0815-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815-2.md) | 09-19 08:54 | 【納品】見立て行と釦の助言の文面を差し替えた（v1451） |
| [`y0919-0815.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815.md) | 09-19 08:19 | 【宣言】見立て行と釦の助言の文面を差し替える（v1451） |
| [`y0919-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0800.md) | 09-19 08:00 | 条件の数の棚卸し（mitate-kazoe.txt） |
| [`y0919-0725.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0725.md) | 09-19 07:43 | 見立て行の尺の縛りを外す |
| [`y0919-0450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0450.md) | 09-19 07:04 | 見立て行の棚卸し（mitate.txt） |
| [`y0919-0427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0427.md) | 09-19 04:32 | 再起動-2 |
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

<!-- 控えの一覧 ここまで -->
