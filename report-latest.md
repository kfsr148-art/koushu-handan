# 古い字の掃除-2

**終わり（残り0件）** — 2026-09-17（VAIO）。本体には触っていない。
`pipe-check.ps1` の ⑦（問いかけと判じた枠の数え）を、**両方の字に当たる形**へ直した。

## ① 直した一行

前の札で示した形をそのまま入れた。

```powershell
（前） $_ -like  '*受け取った問いかけを控えた*'
（後） $_ -match '受け取った([A-Za-z0-9_-]+（)?問いかけ(）)?を控えた'
```

真ん中の丸括弧は**全角のまま**（記録に出る字がそれ）。`[A-Za-z0-9_-]` を使い、`\w` は使っていない（作法34）。
これで古い `受け取った問いかけを控えた` と、いまの `受け取った<枠の種>（問いかけ）を控えた`
（種は `order`／`yoshi`／`cmd`／`fragment`）の**両方**に当たる。

## ② 09-12 以降に実際に数えられる件数 … **0件**

直した形で `hook.log` を丸ごと当て直した。

| 当て方 | 当たる行 | 最後 |
|---|---|---|
| 直した形（記録ぜんぶ） | **7件** | 2026-09-05 20:56:18 |
| うち **09-12 03:09:54 以降** | **0件** | — |
| 古い字だけ（直す前） | 7件 | 2026-09-05 20:56:18 |
| 新しい字（`<種>（問いかけ）`） | **0件** | — |

**0件の訳は「見落とし」ではなく「そもそも無い」。**
字が切り替わった 09-12 03:09 以降に届いた枠 **196件は、すべて「指示」と判じられていた**。

```
09-12 03:09:54 以降の枠の数え
  受け取ったorder（指示）を控えた     181件
  受け取ったyoshi（指示）を控えた      10件
  受け取ったfragment（指示）を控えた    3件
  受け取ったcmd（指示）を控えた         2件
  受け取った…（問いかけ）を控えた        0件
```

つまり、**直す前も直した後も、いまの記録から ⑦ の訴えは立たない。**
差が出るのは**次に問いかけと判じた枠が届いたとき**——直す前はそれを取りこぼしていた。

＊問いかけの判じは `frame-work.ps1:161-163`（頭が `問い＝`／`確認＝`、または120字以下で
　問いの語を含み仕事の語を含まない）。09-12 以降は一度も当たっていない。

## ③ 偽の送り手で通した（四通り）

⑦ の枝を字面のまま切り出し、**訴えの口（`Add-Warn`）を偽物へ差し替えて**回した。
本物の訴えも押し送りも一通も出していない。

| 場合 | 偽の訴えへ渡った字 |
|---|---|
| イ 新しい字の問いかけ | `直近400行に、問いかけと判じた枠が 1件…` ✔ |
| ロ 古い字の問いかけ | `直近400行に、問いかけと判じた枠が 1件…` ✔ |
| ハ 指示だけの回 | （立たない） ✔ |
| ニ **直す前の形 × 新しい字** | （立たない） ✔ ← これが塞いだ穴 |

**ニが要**。同じ材料でも、直す前の形では新しい字を取りこぼして黙っていた。

## 触った所と触らない所

**触った所** … `pipe-check.ps1` の ⑦ の当て方の**一行だけ**（写し `.bak-20260917e`）。

**触らない所** … 本体（`koushu-handan.html`）・**問いかけの判じ**（`frame-work.ps1:161-163`。
判定に触るので今回も触らない。⑦ が「数えて残すだけ」の枝である理由がこれ）・
`inbox-feed.ps1`・`watch-notify.ps1`・`stop-guard.ps1`・`notify-record.ps1`・`inbox-watch.ps1`・
6時間の窓・400行の窓・`pipe-ask-seen.txt` の再送防止・`hook.log` の過去の行。

構文検査 OK（token 6285）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **254件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0917-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2050.md) | 09-17 20:52 | 古い字の掃除-2 |
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

<!-- 控えの一覧 ここまで -->
