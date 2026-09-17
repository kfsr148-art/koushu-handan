# 訴えの棚卸し-1

**終わり（残り0件）** — 2026-09-17（VAIO）。本体には触っていない。
五つのうち**四つは今日の直しより前**の空振りで、残った一つ（`pub-late`）は**本物**だった。元を決めて直した。

## ① 五つの最後の刻と、その回の元

| 訴え | 最後に鳴った刻 | その回の元 |
|---|---|---|
| `done-stale-note` | **13:32:29** | 控えを書き直す前に stop が来た回。前の仕事の札は 12:57 に立っており、**立て直す物が無かった**（空振り） |
| `step-slow` | **13:38:36** | 段が 287.1秒。13:13〜13:33 の見張りの止まり（**鍵の見回りの子が返らず11分**）が解けた直後の回 |
| `push-fail` | **16:20:33** | 数えの取り合いで刻が **1970-01-01** へ落ち、窓に残る**8日ぶんの失敗231回**を丸ごと数えた（空振り）。押しは6秒後に通っていた |
| `pub-defer` | **19:50:22** | 予定表から `-NoProfile` で起きるため `[Console]::OutputEncoding` が **CP932**。`git show` の日本語が化けて JSON が壊れ、押しの控えが読めなかった |
| `pub-late` | **20:30:25** | **本物**。雲の走りが「本体の回」と誤って判じ、**フル版（732秒）**を回した。配信がその間止まり、公開が20分遅れた |

## ② 今日の直しより前のものを落とす

| 直し | 効きはじめ | 落ちる訴え |
|---|---|---|
| 譲りの判じの位置-1（段の組み替え・子に上限） | 実地 **16:24** から | `step-slow`（13:38） |
| done-stale-note の空振り-1 | **16:2x** | `done-stale-note`（13:32） |
| 押しの詰まり-1（字の種別・押しの刻の取り方） | **19:51** | `push-fail`（16:20）／`pub-defer`（19:50） |
| 古い字の掃除-1／-2 | 20:1x ／ 21:0x | （該当なし） |

**落ちた四つ … `done-stale-note`・`step-slow`・`push-fail`・`pub-defer`。**
**残った一つ … `pub-late`（20:30:25）。** 直しの後に鳴った唯一の訴えで、しかも**空振りではなかった**。

## ③ 残った `pub-late` の元と、直し

### 元（実測でここまで辿った）

```
20:14:21  押し（二件入り：「報告：古い字の掃除-1」＋「usage: 更新」）
20:14:43  雲の走りが立つ
20:14:49  scope の判じ … 「変わったもの: ALL」 ← ここが誤り
20:14:53  check（フル版 732秒・速い版 105秒も含めて 861秒）
20:29:33  走り終わり。配信はここまで**15分止まっていた**
20:30:25  pipe-check 「公開側が 20分 遅れている」← 本物の遅れ
20:31:57  次の走りで配信が追いつく
```

**なぜ ALL になったか。** `scope` は `fetch-depth: 2` の浅い写しで
`git diff <before> <sha>` を取っていた。**押しに二件以上入っていると `before` が写しに無く**、
diff が落ちて `|| echo ALL` の安全側へ落ちる。ALL は「本体の回」と判じられ、フル版が回る。

今日の走りでも起きていた。直近100件（13:33 以降）のうち 300秒を超えたのは6件で、
`ALL` と判じていたのは **16:27:07** と **20:14:43**（どちらも二件入りの押し）。
13:33:50 は v1450 の本体を含む押しなので、**これは正しく重い回**。

### 直した所（`.github/workflows/check.yml` の `scope` の一段だけ）

```
fetch-depth: 2 → 20
before が写しに無ければ git fetch --deepen=200 で深掘りし、それでも無ければ今までどおり ALL
```

**安全側は崩していない。** 取れない回は今までどおり検査に掛ける（本体の直しを素通りさせない）。

＊この直し自体は `check.yml` を触るので、**この回の押しは正しくフル版が回る**（12分ほど）。
　次の二件入りの押しから、`変わったもの:` にファイル名が並ぶようになる。

### 確かめ（手元に深さ2の写しを作って、同じ形を当てた）

雲を待たずに確かめられる。本物の走りは立てていない（`git clone --depth 2` の写しの上だけ）。

| 形 | 見立てた押し | 判じ |
|---|---|---|
| **直す前**（深さ2のまま diff） | 三件入り | `変わったもの: ALL` → 本体の回（フル版） |
| **直した形**（深掘りする） | 同じ三件入り | `.github/workflows/check.yml` ほか4件 → **本体の回**（`check.yml` が入っているので正しく重い） |
| 直した形 | 控えだけの三件入り | `state.json` `usage.json` → **控えの回**（検査に掛けず、そのまま配信） |

三つ目が要。**これまでは控えだけの押しでも二件入れば ALL に落ち、12分のフル版が回っていた。**

## 落とした後の訴えの件数

**0件**（説明のついていない訴えは残っていない）。

＊様子見の札が数えるのは**直近12時間ぶんの種類**なので、札の「5件」は
　窓が流れるまで出続ける。窓の始まりはいま 09:08 で、
　**最後の一つ（`done-stale-note` 13:32:29）が窓から出るのは 01:32**。
　それまでは「5件」と出ても、中身は上の四つ＋直した `pub-late` で、新しい訴えではない。

## 触った所と触らない所

**触った所** … `.github/workflows/check.yml` の `scope` の一段だけ（写しは git の履歴）。

**触らない所** … 本体（`koushu-handan.html`）・`check.js`／`adv-check.js`（検査の中身）・
重い回と判ずるファイルの一覧・速い版とフル版の使い分け・`deploy` の段・
`pipe-check.ps1`（敷居20分・公開側の読み方・pub-late の数え方）・`~/.claude` の台本・
`pipe-warn.log` の過去の行。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **255件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0917-2102.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2102.md) | 09-17 21:14 | 訴えの棚卸し-1 |
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

<!-- 控えの一覧 ここまで -->
