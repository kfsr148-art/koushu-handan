# 残りの根-1 — 今日止めた分をまとめて直した

**状態** … 終わり／触ったのは**見張りの起こし方**と**関門**まで。判定と札の作りには触っていない

## ① 帯へ入って最初の一回が関門を通ってしまう件

**もとの作り** … 「帯へ入って最初の一回は必ず通す」。次からは5分の間隔で間引く。

**何が起きていたか** … その一回が、重い検査のいちばん重い立ち上がりに当たって長引き、
以後の起こしが**予定表の側で ID=322（前の回がまだ走っている）として全部落ちる**。
19:19:50 の帯がこれで、**関門の見送りは0件なのに、巡回は19分で2回しか走っていない**。

**直した形** … `heavy-gate.ps1` を「**帯の間は最初の一回も含めて全部見送る**」に変えた。
見送った回数は `heavy-skipped-<tag>.txt` に数え、**帯が消えた直後の一回で必ず走る**。
そのとき足跡へ「帯が消えたので、見送った分をここで走らせる（見送り N回）」と残す。

＊`-EverySec` は帯の中では使わなくなった（呼び方を変えないため引数は残してある）。

## ② 見張りの一回が実行時間の上限で殺される件

**上限は PT2M ではなく PT10M だった**（PT2M は生存の側）。18:34:41 に始まった回が
**18:48:03 に ID=329** で殺されており、13分22秒で上限に当たっている。

**直した形** … **帯の間だけ上限を外す**（`PT0S`＝上限なし）。

- `heavy-on.ps1` … 帯へ入るとき `ClaudeWatchNotify` の上限を `PT0S` にする
- `heavy-off.ps1` … 帯を出るとき `PT10M` へ戻す。**帯を消すより先に戻す**
  （`heavy.txt` が消せなかった回でも、上限だけは戻るように）
- `heavy-gate.ps1` … 戻し損ねの受け皿。`heavy-off` が打たれずに帯が30分で切れた回は、
  **帯が消えたと気づいた一回で `PT10M` へ戻す**

＊もう一つの案（巡回の途中で帯を検知して残りの段を飛ばす）は**採らなかった**。
　段を飛ばすと**札を作る段**まで飛ぶ恐れがあり、札の作りに触ることになるため。

## ③ 生存の手が同じ上限で殺される件

**`ClaudeHookHeartbeat` の上限を外した（`PT2M` → `PT0S`）。帯に関わらず、常に。**
生存の手は `hook.log` へ一行足すだけ（`hook-notice.ps1` の heartbeat の枝）なので、
上限を掛ける意味がない。掛けていたために、重い時間帯に**一回分が丸ごと消えていた**
（17:48:03 起こし → 17:50:03 に ID=329／18:40:05 も同じ）。

＊間引きの方は既に外してある（飽和の回避-1 の確定）。**生存は帯でも毎回走り、殺されもしない。**

## ④ 訴え9件の中身

| # | 刻 | 種類 | 中身 | いま |
|---|---|---|---|---|
| 1 | 09:44:18 | cards-full | 札が上限に張り付いている（20/20） | **済み**。上限を 20→40 にした回より前の訴え |
| 2 | 14:29:40 | cards-full | 同（24/20） | **済み**。いまは 24/40 で鳴らない |
| 3 | 14:29:40 | ask-note | 問いかけと判じた枠が2件 | 仕様どおりの報せ |
| 4 | 14:30:20 | ask-note | 1件（**最後は 空**） | **済み**。`@()` の包み忘れで刻が落ちていた回 |
| 5 | 14:30:43 | ask-note | 1件（**最後は 空**） | 同上 |
| 6 | 14:31:18 | ask-note | 1件（刻あり） | 包み直したあと。仕様どおり |
| 7 | 19:31:48 | subj-gap | 控えの件名と出ている件名が食い違う | **本当に食い違っていた**。控えの件名を書き替える前の一瞬 |
| 8 | 19:31:48 | ask-note | 4件 | 仕様どおりの報せ |
| 9 | 20:21:07 | ask-note | 3件 | 仕様どおりの報せ |

**直せるものを直した** … **9件のうち6件が ask-note で、同じ問いかけを何度も数え直していた。**
`pipe-check.ps1` に「**最後に訴えた問いかけの刻**」を控えさせ、**それより新しいものが無ければ黙る**。
これで同じ件が巡回のたびに積もらない。

＊`cards-full` の2件と `ask-note` の空刻2件は、**どちらも直したあとの訴えではない**（記録に残っているだけ）。
＊`subj-gap` は**正しく鳴っている**ので触っていない。

## ⑤ 実測

**作り値（本物の関門を、当たり障りのない手で回した）**

```
① 帯なし               → **走った**
  帯へ入って 一回目     → 見送った      ← ここが変わった所
  帯の中 二回目         → 見送った
  帯の中 三回目         → 見送った
  見送りの数え          → 3回
  帯が消えた直後の一回   → **走った**／数えの控えは落ちた
② 帯の中の上限         → PT0S（上限なし）
  帯を出たあとの上限     → PT10M（元へ戻った）
③ 生存の上限           → PT0S（常に上限なし）
```

**実地（帯を一回作った。重い検査は回していない）**

```
21:11:35  帯に入った（見張りの上限を外した）
21:11〜21:21  巡回は **9回とも見送り**（足跡に「帯に入ってから N回目」と残る）
生存 … 21:08:33 → **21:18:36**   ← **帯の中でも途切れていない**
21:21:11  帯を出た（上限を PT10M へ戻した）
21:21:13  足跡「帯が消えたので、見送った分をここで走らせる（見送り 9回）」
21:21:27  **巡回が戻った（帯を出てから16秒）**
```

**帯の中で生存が一度も落ちず、帯が消えて16秒で巡回が戻った。**

## 触っていないもの

`koushu-handan.html` ／ `panel.html` ／ `watch-notify.ps1` の判定と札の作り ／
`notify-record.ps1` の札の組み立て ／ `check.js` の合格条件。
`analyze()` と `bestShapeOneSuit` も当然触っていない。

＊触ったのは `heavy-gate.ps1` ／ `heavy-on.ps1` ／ `heavy-off.ps1` ／ `pipe-check.ps1` と、
　予定表の二つの**上限の設定**だけ。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **139件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`残りの根-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AE%8B%E3%82%8A%E3%81%AE%E6%A0%B9-1.md) | 09-05 21:22 | 残りの根-1 — 今日止めた分をまとめて直した |
| [`帯の漏れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E6%BC%8F%E3%82%8C-1.md) | 09-05 20:53 | 帯の漏れ-1 — 重い帯を pre-push 自身に持たせた |
| [`飽和の回避-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1-2.md) | 09-05 18:23 | 飽和の回避-1（追補）— 札を立て直した／控えが空だった理由 |
| [`飽和の回避-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1.md) | 09-05 16:29 | 飽和の回避-1 — 重い帯だけ、起こしを間引く |
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

<!-- 控えの一覧 ここまで -->
