# 札の上限-1／手押しの錠-1 — 枚数を増やし、手押しも同じ錠を通した

**状態：終わり（実地は下の push そのもの）／札の作りにも判定にも触っていない**

---

# 1. 札の上限-1

## ① いま何枚で回っていたか／押し出された札

```
いまの札 : 20枚（上限 20 に張り付き）
     幅 : 2026-09-03 20:49 〜 2026-09-05 09:51 ＝ 約37時間ぶん
```

**押し出された札を、`notices.json` の全履歴から数え直した。**

```
これまでに立った札 629枚 ／ いま残っている 20枚 ／ **押し出された 609枚**

押し出された 609枚の内訳
   223枚  終わりました（中身のある札）   ← 報告そのもの
   177枚  ヨシ待ち
    85枚  写せますの数
    44枚  延びています
    32枚  調べました（中身のある札）     ← 報告そのもの
    23枚  異常 ／ 16枚 定時 ／ 9枚 その他
```

**中身のある札は 255枚（終わり223＋調べ32）が押し出されている。**
＊本文は `reports/*.md` にも残っているので**永久に失われてはいない**。
　消えたのは**パネルから写せる形**。

## ② 枚数を増やした（**20 → 40**）

**札の作りには触っていない。`$KEEP` の数だけを変えた。**

**なぜ 40 か（実測で決めた）**

```
日ごとの札の数 : 08-30 66枚／08-31 45／09-01 37／09-02 25／09-03 37／09-04 8／09-05 4
一枚の大きさ   : 20枚で 23,187バイト ＝ 約1.2KB/枚
```

- **20枚では忙しい日の半日ぶんも持てない**（37〜66枚/日）
- **40枚**なら直近の忙しい日（37枚）を**一日ぶん抱えられる**。ファイルは約47KB
- 60（66枚の日も抱える）は約70KB。**パネルは15秒ごとに取りに行く**ので、
  大きくするほど毎回の取得が重くなる。**40 で止めた**

**増やしても、既に消えた札は戻らない。** これから40枚まで溜まる
（いまは 20枚のまま＝控えの実体が既に切られていたため）。

## ③ 止めた案

**「写した印の無い札は押し出さない」形にはしていない。**
写した印は**パネルの側（`localStorage`）にしか無く**、札を控える手からは見えない。
**あれをやるには札の作りに手が要る**ので、実装せず止めた。

---

# 2. 手押しの錠-1

## 直し — 手押しも同じ錠を通す

`~/.claude/push-mine.ps1` を足した。**押しの中身は変えていない**——
`git push` をそのまま呼び、**pre-push の検査も今までどおり走る**（`--no-verify` は付けない）。
変えたのは「**打つ前に、常駐と同じ名前つきの錠を取る**」ことだけ。

```
錠 : Local\ClaudeGitPushGate（常駐の Git-CommitPush と同じ）
待ち: 既定 600秒。取れなければ押さずに終わる（あとで押し直せばよい）
```

**なぜ要ったか** — 常駐の押しは 09-04 から一人ずつになったが、**手押しは錠の外**だった。
しかも pre-push の検査は**この機械でいちばん重い**（Edge を何枚も起こす）。
09-04 12:24〜12:58 に常駐の押しと重なり、**24.7分の詰まり**を作った
（撮れた現場：ディスク 482.7%／msedge 5本／**git 3本**）。

## 実測

**作り値**（本物の push は打たず、錠の取り合いだけを見た）

```
(甲) 常駐が錠をつかんでいる間の手押し → **錠を待った 8.8秒**（合計 11.1秒）。待ってから押した
(乙) 誰もつかんでいない               → 2.7秒（待たずに押した）
```

**実地** — **この報告の push そのものを `push-mine.ps1` で打った**（下の記録）。

＊これから手で押すときは、`git push` ではなく **`push-mine.ps1` を使う**。記憶へ残した。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **134件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`札の上限-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E4%B8%8A%E9%99%90-1.md) | 09-05 12:51 | 札の上限-1／手押しの錠-1 — 枚数を増やし、手押しも同じ錠を通した |
| [`連携の弱い所-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E5%BC%B1%E3%81%84%E6%89%80-1.md) | 09-05 09:48 | 連携の弱い所-1 — 黙って壊れる所を洗い、外から見る手を立てた |
| [`機械の詰まり-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1-2.md) | 09-05 09:37 | 機械の詰まり-1（数え）— 夜は明確に減った。残っているのは**こちらが検査を回している帯** |
| [`矛盾の三つ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%9B%E7%9B%BE%E3%81%AE%E4%B8%89%E3%81%A4-1.md) | 09-04 12:31 | 矛盾の三つ-1 — 三つとも「材料を読む所」がずれていた |
| [`見張りの×-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%C3%97-1.md) | 09-04 10:09 | 見張りの×-1 — 「×2147946720」は死んでいた印ではなく、**その一分の起こしを見送った印** |
| [`機械の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-04 06:06 | 機械の詰まり-1 — 現場を押さえる手を入れ、押す者を一度に一人にした |
| [`数の不一致-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%95%B0%E3%81%AE%E4%B8%8D%E4%B8%80%E8%87%B4-1.md) | 09-04 01:24 | 数の不一致-1 — 三つを「写した印の無い、中身のある札の数」で揃えた（panel v116） |
| [`生存の途切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%94%9F%E5%AD%98%E3%81%AE%E9%80%94%E5%88%87%E3%82%8C-1.md) | 09-04 00:44 | 生存の途切れ-1 — 詰まった一本が10分ぶら下がり、次の刻が「見送り」で捨てられた |
| [`パネルの立て直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E7%AB%8B%E3%81%A6%E7%9B%B4%E3%81%97-1.md) | 09-03 21:30 | パネルの立て直し-1 — 開いた瞬間に「何が終わって何が待っているか」が読める形へ（panel v115） |
| [`読みの道-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-3.md) | 09-03 20:52 | 読みの道-3 — `latest-name.txt` を完全な URL 一行にした |
| [`読みの道-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-2.md) | 09-03 20:31 | 読みの道-2 — 名を変えた写しを置く（読む側が待たずに最新を取れる） |
| [`札の押し出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%BC%E3%81%97%E5%87%BA%E3%81%97-1.md) | 09-03 17:27 | 札の押し出し-1 — 🪟 が終わりの札を上書きしていた。二枚とも立てる形にした |
| [`巡回の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-03 16:02 | 巡回の固まり-2 — 止まっていたのは「使用量の段」。上限の無い呼び出しが一つあった |
| [`写しの一本化-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E6%9C%AC%E5%8C%96-1.md) | 09-03 15:17 | 写しの一本化-1 — 押す所を一つにした（panel v114） |
| [`通しの試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E3%81%97%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-03 13:28 | 通しの試験-1 — 小さな仕事を一つ流して、端から端まで見届けた |
| [`板の欠け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9D%BF%E3%81%AE%E6%AC%A0%E3%81%91-1.md) | 09-03 12:03 | 板の欠け-1 — 公開側の `board.json` は無事だった。消えていたのは**手元の値** |
| [`写しの切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E5%88%87%E3%82%8C-1.md) | 09-03 10:03 | 写しの切れ-1 — 切っていたのは `buildBundle` ではなく、見張りの控えの読み手 |
| [`札の抜け-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2-2.md) | 09-03 06:43 | 札の抜け-2（続き）— 昨夜の直しは**一度も働いていなかった**。枝の順が原因 |
| [`通知の分け方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%88%86%E3%81%91%E6%96%B9-1.md) | 09-02 23:05 | 通知の分け方-1 — 長い報告は ntfy へ送らない。札にして、釦で一枚で写す |
| [`札の抜け-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2.md) | 09-02 22:55 | 札の抜け-2 — 取り逃がした stop を拾い直す（終わりの札を運任せにしない） |

<!-- 控えの一覧 ここまで -->
