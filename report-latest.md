# stable を v1451 へ進めた

**終わり（残り0件）** — 2026-09-19（VAIO）。**v1451 のヨシを頂いたので `stable` を進めた。**
本体には触っていない（タグを動かしただけ）。

## 進めた先

```
$ git log -1 --format="%h %s" stable
89eeb305 first-sense-base.json：v1451 の文面に合わせて angle の基準だけを取り直す

$ git ls-remote origin refs/tags/stable
89eeb3057df72643fc1b1960bbd3e52ce1cf215d	refs/tags/stable
```

| | |
|---|---|
| 前 | `ed7ce66d`（v1450 説明欄の二の字を直した） |
| **後** | **`89eeb305`**（v1451 の本体 ＋ ㉓ の基準の取り直しまで入った形） |
| `stable` の中の本体の版 | **`data-ver="1451"`** ／ `git show stable:ver.txt` → **1451** |
| 手元の版の字（三箇所） | `data-ver="1451"` ／ `verTag">v1451` ／ `ver.txt` 1451（揃っている） |

＊**なぜ本体の commit（`03d14d2a`）ではなく `89eeb305` か** … `03d14d2a` の時点では
　㉓ の基準（`first-sense-base.json`）が古いままで、雲のフル版が落ちる形だった。
　**検査が通った形**＝基準を取り直した `89eeb305` を指しておくほうが、戻り先として使える。
　中身の本体（`koushu-handan.html`）はどちらも同じ v1451。

## 併せて確かめたこと

- **雲のフル版は success**（走り **35406645289**・12分22秒・`check` と `adv-check` の両方 PASS）
- 公開側の `ver.txt` は実読みで **1451**
- 押しは `--no-verify`（作法19 のとおり。タグの付け替えは関門を通さない）

## 触った所と触らない所

**触った所** … `stable` タグだけ（`ed7ce66d` → `89eeb305`）。

**触らない所** … 本体（`koushu-handan.html`）・`ver.txt`・`serifu.txt`・`first-sense-base.json`・
`check.js`・`~/.claude` の台本。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **282件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0919-1255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1255.md) | 09-19 12:54 | stable を v1451 へ進めた |
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

<!-- 控えの一覧 ここまで -->
