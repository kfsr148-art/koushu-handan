# 古い字の掃除-1

**終わり（残り0件）** — 2026-09-17（VAIO）。本体には触っていない。
古い字を探している枝は**二つだけ**で、そのうち指示のあった一つを直した。

## 字が切り替わったのはいつか（実測）

`hook.log` に残る形を数えた。**2026-09-12 02:38 を境に、指示の控えの字が変わっている。**

| 字 | 件数 | 最後／最初 |
|---|---|---|
| `受け取った指示を控えた`（古い） | **238件** | 最後 **2026-09-12 02:38:22** |
| `受け取ったorder（指示）を控えた` | 180件 | 最初 **2026-09-12 03:09:54** |
| `受け取ったyoshi（指示）を控えた` | 10件 | — |
| `受け取ったfragment（指示）を控えた` | 3件 | — |
| `受け取ったcmd（指示）を控えた` | 2件 | — |
| `受け取った問いかけを控えた`（古い） | **7件** | 最後 **2026-09-05 20:56:18** |

いまの書き手（`frame-work.ps1:245` と `inbox-feed.ps1:268`）は
`受け取った<枠の種>（指示｜問いかけ）を控えた` の形で書く。種は `order`／`yoshi`／`cmd`／`fragment` の四つ。

## ① 立て直しの枝を直した（`pipe-check.ps1:521`）

**直す前** … `hook.log` の古い字だけを探していた。その字は5日半前に途絶えているので、
当たるのは**もう済んだ古い仕事の題**ばかり。実測で確かめた。

```
（同じ材料を古い字だけで拾うと）
直す前の拾い（古い字だけ）… 「五日前の古い仕事（もう済んでいる）」   ← 別の仕事の名で札が立つ
```

**直した後** … 空振りの見分け（`done-quiet`）と同じ `Get-PrevJobName` へ寄せた。
拾う順は **①退け先（`work-note-prev.txt`）の「前の件名」→ ②新しい字 → ③古い字**。

あわせて、題から名を切る所（`'（' で切る`）を `Get-JobName` の一箇所へまとめた。
`Get-PrevJobName` は**題のまま**返す——札の一行目にそのまま載る側があるため、ここでは削らない。

## ② 台本ぜんぶの洗い出し（行番号つき）

`watch-notify` ／ `pipe-check` ／ `inbox-watch` ／ `frame-work` ／ `stop-guard` ／ `notify-record`
（＋書き手の `inbox-feed`・`kagi-watch`）を洗った。**古い字を探している枝は二つだけ。**

| 綴り:行 | 探している字 | いま | 扱い |
|---|---|---|---|
| `pipe-check.ps1:521` | `受け取った指示を控えた` | 09-12 02:38 で途絶 | **直した**（①） |
| `pipe-check.ps1:333` | `受け取った問いかけを控えた` | 09-05 20:56 で途絶 | **直していない**（下記） |
| `pipe-check.ps1:90` | `受け取った(order（指示）\|指示)を控えた` | 両方に当たる | 09-17 に直し済み |

**`pipe-check.ps1:333` は ⑦「問いかけと判じた枠を数える」の枝。**
いまの書き手は `受け取ったask（問いかけ）を控えた` の形で書くので、**09-12 以降は一件も当たらない**
（当て損ないを見返すための数えが、黙って0件になっている）。
②は「洗って出す」までの指示なので**直していない**。直すなら一行で足りる。

```powershell
（いま） $_ -like '*受け取った問いかけを控えた*'
（案）   $_ -match '受け取った([A-Za-z0-9_-]+（)?問いかけ(）)?を控えた'
```

**古い字が残っていなかった所**（＝直す要りが無い）

- `watch-notify.ps1:1588` … `hook.log` は **ASCII の種別**（`heartbeat｜notification｜stop｜resume`）だけで拾う。
  この四語は今も同じ字で書かれている
- `pipe-check.ps1:407` … `stop` の行を刻と種別だけで拾う（日本語を見ない）
- `stop-guard.ps1` ／ `notify-record.ps1` ／ `inbox-watch.ps1` … `hook.log` を**書く側**で、
  日本語の字で**探している所は無い**
- `frame-work.ps1` … 書く側（`:245`）

## ③ 偽の送り手で通した（三通り）

立て直しの枝を字面のまま切り出し、**送り手（`ntfy-say.ps1`）だけを偽物へ差し替えて**回した。
本物の押し送りは一通も出していない。

| 場合 | 偽の送り手へ渡った題 |
|---|---|
| イ 退け先に前の件名がある回 | `✅ 終わりました（返事不要）：退け先にある前の件名` ✔ |
| ロ 退け先が無く、新しい字だけの回 | `✅ 終わりました（返事不要）：いまの仕事` ✔ |
| ハ 古い字しか無い回（09-12 より前） | `✅ 終わりました（返事不要）：五日前の古い仕事` ✔ |

**ロが要**。直す前は同じ材料で「五日前の古い仕事」を掴んでいた。

## 触った所と触らない所

**触った所** … `pipe-check.ps1` だけ（写し `.bak-20260917d`）。

- `:521` 立て直しの名の拾いを `Get-PrevJobName` へ寄せた
- `Get-PrevJobName` の返しを**題のまま**に変え、名を切る `Get-JobName` を足した（呼び元も合わせた）

**触らない所** … 本体（`koushu-handan.html`）・`frame-work.ps1`・`inbox-feed.ps1`（**書き手の字は変えない**）・
`watch-notify.ps1`・`stop-guard.ps1`・`notify-record.ps1`・`inbox-watch.ps1`・
`pipe-check.ps1:333`（②の指示は洗い出しまで）・敷居・公開側の読み方・`hook.log` の過去の行。

構文検査 OK（token 6275）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **253件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0917-2009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2009.md) | 09-17 20:14 | 古い字の掃除-1 |
| [`y0917-1944.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1944.md) | 09-17 19:55 | 押しの詰まり-1 |
| [`y0917-1611.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1611.md) | 09-17 16:26 | 譲りの判じの位置-1 ／ done-stale-note の空振り-1 |
| [`y0917-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1450.md) | 09-17 14:59 | pub-late の予備の数え方-1 ／ 13:32 の done-stale-note ／ 13:13 の見張りの止まり |
| [`説明欄の直し-v1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E7%9B%B4%E3%81%97-v1450.md) | 09-17 13:32 | 説明欄「二、どう使うの？」の直し（v1450） |
| [`y0917-1145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1145.md) | 09-17 12:48 | 説明欄の点検-1（六節の字と、いまの本体の食い違い） |
| [`猫牌率のEF-v1449.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AEEF-v1449.md) | 09-16 21:26 | 実測帳の E 甲・F 乙（v1449） |
| [`y0916-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-1900.md) | 09-16 19:04 | E と F の字（猫牌率・候補の外の二つ） |
| [`猫牌率の文の直し-v1448.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%96%87%E3%81%AE%E7%9B%B4%E3%81%97-v1448.md) | 09-16 13:09 | 猫牌率の文の直し（v1448）と、候補の外の二つ |
| [`y0916-0707.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0707.md) | 09-16 07:09 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`y0916-0436.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0436.md) | 09-16 07:06 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`猫牌率の下敷きの入れ替え-v1447.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-v1447.md) | 09-16 04:35 | 猫牌率の下敷きの入れ替え（v1447） |
| [`猫牌率の測り直し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%B8%AC%E3%82%8A%E7%9B%B4%E3%81%97-2.md) | 09-15 22:31 | 猫牌率の測り直し-2 |
| [`猫牌率の下敷きの入れ替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-1.md) | 09-15 21:07 | 猫牌率の下敷きの入れ替え-1 の下調べ |
| [`八人の数字を説明欄へ-v1446.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%AB%E4%BA%BA%E3%81%AE%E6%95%B0%E5%AD%97%E3%82%92%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%B8-v1446.md) | 09-15 14:03 | 八人の数字を説明欄へ（v1446） |
| [`y0915-1130.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0915-1130.md) | 09-15 12:53 | 八人の数字を説明欄へ（丙の字を確定） |
| [`件名の拾い方-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BB%B6%E5%90%8D%E3%81%AE%E6%8B%BE%E3%81%84%E6%96%B9-4.md) | 09-15 04:59 | 件名の拾い方-4 と stable の進め（v1445） |
| [`四枚の札の縮め-1-v1445.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9B%9B%E6%9E%9A%E3%81%AE%E6%9C%AD%E3%81%AE%E7%B8%AE%E3%82%81-1-v1445.md) | 09-15 01:28 | 四枚の札の縮め-1（v1445） |
| [`y0915-0130.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0915-0130.md) | 09-15 01:00 | 四枚の札の縮め-1 の下調べ（印 y0915-0130） |
| [`兎の一行の確定-v1444.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E4%B8%80%E8%A1%8C%E3%81%AE%E7%A2%BA%E5%AE%9A-v1444.md) | 09-15 00:51 | 兎の一行の確定と stable の進め（v1444） |

<!-- 控えの一覧 ここまで -->
