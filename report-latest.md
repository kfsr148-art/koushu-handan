# 連携の改善-1 — 止めた5件を外から見る手で近づけ、訴えを定時へ乗せた

**状態：終わり／土台（本体・パネルの判定・見張りの札の作り）には触っていない**

---

## ① 「大元が要る」と止めた5件の見直し

| # | 止めた件 | 土台に触らず近づけた手 | いま |
|---|---|---|---|
| 1 | **札の上限そのもの** | 枚数だけ **20→40**（札の上限-1）＋ 上限に張り付いたら訴える | **近づけた** |
| 2 | **控えの件名が前の仕事のまま** | 名を伏せる（＝判定）のではなく、**控えと `state.json` の件名の食い違いを訴える**（`subj-gap`） | **足した** |
| 3 | **`kind=ask` の当て損ない** | 判じ直す（＝判定）のではなく、**直近6時間に ask と判じた回を数えて残す**（`ask-note`） | **足した** |
| 4 | **ntfy が落ちたとき** | 別経路で鳴らす（＝札の作り）のではなく、**ntfy.sh を叩いて返らなければ訴える**（`ntfy-down`） | **足した** |
| 5 | **貼り忘れ** | 機械の外。写した印はパネルの `localStorage` にしかなく、外から見えない | **止めたまま** |

＊いずれも **読むだけ・記録するだけ**。判じ直しも、札の中身の書き換えもしていない。

## ② 訴えが誰にも見られない形を直した

`pipe-warn.log` は溜まるだけだった。**定時の報せ（09:00・21:00）へ一行を足した。**

```
😺 現在も順調にゃ
状態: 作業中 / 連携の改善-1（外から見る手と手順で塞ぐ）
台帳: 残り 0件
見張り: 生存○ 見張り○ 片付け○ 受信箱○
使用量: セッション 31% / 週全体 3% / 週Fable 0%
訴え: 6件（cards-full・ask-note）… pipe-warn.log        ← 足した一行
```

- 数えるのは**直近12時間**（前の定時から先）
- `ok` と `heavy-skip` は訴えに数えない
- **訴えが無ければ行ごと出さない**（空の行を並べない）

## ③ 重い調べの帯は、訴えない

**控えに `重い: <理由>` を書いた回は、`hook` の沈黙と公開の遅れを訴えない。**
重い調べのあいだ巡回が止まるのは**分かっている**ので、訴えても手当てのしようがない。

- 見るのは控えの `重い:` の行（控えが3時間以内に書かれているときだけ）
- **札の上限・話題名・送り直し・ntfy の生死は、重い帯でも訴える**（重さと関わりが無い）
- 見送った回は黙って消さず、**`heavy-skip` として残す**（あとで「なぜ訴えなかったか」を辿れる）

## ④ 実測

**作り値（写しに probe。置き場を作り値の台へ向けた）**

```
(甲) 重い の行が無い          → hook-quiet「hook.log が 40分 書かれていない」
(乙) 重い の行がある          → heavy-skip「重い帯なので hook の沈黙（40分）は訴えない：完全版の検査を回している」
(丙) 重い があっても話題名が空 → topic「話題名のファイルが空か無い」＋ heavy-skip
```

**実地（本物で回した）**

```
2026-09-05 14:31:18  ask-note   直近400行に、問いかけと判じた枠が 1件（最後は 2026-09-05 14:15:11）
```

＊`cards-full` は上限を 40 に直したので**鳴らなくなった**（いま24枚）。
＊定時の本文は DryRun で確かめ、上の「訴え: 6件…」の行が出ることを見た。

## 直しの途中で踏んだ罠（記録に残す）

`@(…) | Where-Object {…}` の**結果を `@()` で包み忘れ**、一件のときに配列がほどけて
**`$asks[$asks.Count-1]` が「先頭の一文字」**になった（訴えの刻が空で出た）。
2026-08-26 に一度踏んだのと同じ罠。包み直して直した。

## 土台に触る案（実装せず止めた）

- **写した印の無い札は押し出さない** … 印がパネルの `localStorage` にしかなく、
  札を控える手から見えない。**札の作り**に手が要る
- **控えが古いときに名を伏せる** … **判定そのもの**
- **`kind=ask` を判じ直す** … 同上
- **ntfy が落ちたときにパネルの黄色の行へ出す** … 黄色の行は**パネルの判定**が組んでいる。
  訴えは定時（②）に乗るので、**そちらで足りるか見てから**にしたい

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **135件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`連携の改善-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E6%94%B9%E5%96%84-1.md) | 09-05 14:33 | 連携の改善-1 — 止めた5件を外から見る手で近づけ、訴えを定時へ乗せた |
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

<!-- 控えの一覧 ここまで -->
