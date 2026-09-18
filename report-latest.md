# 【宣言】見立て行と釦の助言の文面を差し替える（v1451）

**ヨシ待ち** — 2026-09-19（VAIO）。**印: y0919-0815**
本体（`koushu-handan.html`）の工事なので、**ヨシを頂いてから**入れる。まだ一字も触っていない。

## 何をどう変えるか

`mitate-new.txt`（直下・12991バイト・89行）の文面**どおり**に差し替える。**条件・判定・光る牌・`analyze` には触らない。**

| 区分 | 差し替える所 | 分岐の数 |
|---|---|---|
| 人柄七人 `toneAngleLine`（L4659-4736） | 執事2・軍師6・ずんだ4・お嬢様3・マダム2・一姫8・先生3 | **28** |
| 枝豆 | スイッチ2（L8688・L8699）＋投票欄2（L4203-4205）＋食い違い2（L8690・L8701） | **6** |
| AI | 一致2（L8733）＋黙る1（L4855）＋投票欄2（L4206-4207）＋食い違い2（L8737-8738） | **7** |
| 現場猫 | アラート2（L8669・L8671）＋一致1（L8673）＋黙る1（L4864）＋投票欄2（L4199-4202） | **6** |
| 兎 | 釦2（L4868-4869）＋投票欄3（L4221-4224） | **5** |
| 執事の**役の名** | `roles.push('盾')`／`('雀頭')`／`('攻めの種')`（L4434-4436）を新しい長い名へ | **3** |
| **〈色〉の名** | 軍師へ差し込む色に読みを付ける（萬子（マンズ）ほか） | **3** |
| | **合わせて** | **58箇所** |

## 一つだけ、形を変えずに済まない所がある（ここのヨシも頂きたい）

**`TONE_SUIT_JP`（L4279）は、文面の差し込みだけでなく〈条件の照合〉にも使われている。**

```
L4455  if(!someSuit && d.indexOf(TONE_SUIT_JP[su]) === 0) someSuit = su;   ← 染めの向きを当てる所
```

ここの値を「萬子（マンズ）」へ書き替えると、`analyze` が返す `directions`（「萬子…」）と
**当たらなくなり、染め手の判定そのものが変わる**。条件を触らない約束に反する。

**そこで … `TONE_SUIT_JP` は一字も触らず、差し込むときだけ読みを足す**。
表示用の対応表（例 `TONE_SUIT_YOMI = { 萬子:'萬子（マンズ）', … }`）を新しく足し、
**`toneAngleLine` の中で色を差し込む所だけ**それを通す。照合（L4455）は今のまま。

＊執事の役の名（`'盾'`／`'雀頭'`／`'攻めの種'`）は `F.multi.roles` に入って**文面へ差し込まれるだけ**で、
　条件にも印にも使っていない。こちらは値をそのまま新しい名に替える。

## 併せてやること

- **版は v1451 を三箇所同時**（`data-ver`／`verTag`／`ver.txt`。作法4）
- **`serifu.txt` は再抽出**（`node serifu-extract.js`。台詞に触るので作法17。版を上げてから回す）
- **検査は雲のフル版**（手元では速い版まで。作法18。押した回に `check.yml` が回す）
- 終わったら、**差し替えた分岐の数**と**⑦の二択 bottom の最小値**を札に書く

## 触らない所

**判定（`analyze`）・条件（`toneFacts`・`tenLeans` の `lean`・`usagiLean`・スイッチの帯の式）・
光る牌（`multiIdx`／`nakiIdx`／`dupIdx`／`ladyIdx`／`floatIdx`／`edgeIdx`／`headIdx`／
`catIdx`／`edaIdx`／`omIdx`）・`TONE_SUIT_JP` の値・`stable`。**

## 見込み

45分（差し替え → 版 → `serifu.txt` 再抽出 → 手元の速い版 → 押し → 雲のフル版の見届け）。

**この札にヨシを頂ければ着手する。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **280件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0918-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1305.md) | 09-18 13:06 | 軽い巡回の刻-1 |

<!-- 控えの一覧 ここまで -->
