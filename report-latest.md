# 根の試験-1 — 本物の pre-push を一回通して、直りを見届けた

**状態** … 終わり／`reports/根の試験-1.md` の一行だけを押した（本体には影響しない）

## 見届けた一覧

| 見る物 | 実測 |
|---|---|
| 帯が自動で出た刻 | **21:29:09**（押しを起こしたのは 21:28:45） |
| 検査の所要 | **約24分41秒**（21:29:09 → 21:53:50） |
| 帯が消えた刻 | **21:53:50**（関門が気づいたのは 21:55:18） |
| 帯の間の巡回の見送り | **関門で5回**（足跡に「帯に入ってから N回目」）＋**予定表の ID=322 が21件** |
| 帯が消えてから巡回が戻るまで | **2分11秒**（21:53:50 → 21:56:01） |
| 生存の刻 | 21:28:37 → 21:39:00 → 21:52:50。**途切れていない**（最大 13分50秒） |
| 途切れの網（15分）に掛かったか | **掛かっていない**（13分50秒 ＜ 15分） |
| 🪟 が鳴ったか | **鳴っていない**（0件） |
| **上限で殺された回（ID=329）** | **0件** ← ここが今日いちばん変わった所 |

## いちばんはっきり出たところ — 生存が「殺されず、遅れて届いた」

予定表の起こしと、`hook.log` に書けた刻を並べると、直りがそのまま見える。

```
起こし 21:38:02  →  書けた 21:39:00   （58秒）
起こし 21:48:03  →  書けた 21:52:50   （**4分47秒**）
```

**二つ目は、前なら失われていた。**上限は `PT2M` だったので **21:50:03 に ID=329 で殺され**、
その回の生存は `hook.log` に載らない。今日 17:48 と 18:40 に起きたのがこれ。
上限を外した（③）ので、**重くて遅れても、殺されずに書けた**。

＊生存の間隔が 13分50秒まで伸びたのは、重い検査で立ち上がりが遅れたため。
　**15分の網には掛かっていない**ので、嘘の🪟は鳴らない。

## 巡回のほうの見え方

```
21:28:48  最後の巡回（帯へ入る直前）
21:29:09〜21:53:50  帯の中 … 関門が5回見送り、予定表が21回見送り（ID=322）
21:55:18  足跡「帯が消えたので、見送った分をここで走らせる（見送り 5回）」
21:56:01  **巡回が戻った**
```

**27分ぶん、巡回は止まっていた。**これは**狙いどおり**（①で帯の間はまるごと見送る形にした）。
重い検査の間は巡回を走らせず、**終わったら必ず一回走る**。

＊戻りが作り値の16秒より遅く**2分11秒**かかったのは、帯が消えた直後の起こしがまだ
　**予定表の側で 322**（前の回が残っている）に当たっていたため。関門が実際に走れたのは 21:55:18。
　**16秒は「関門が呼ばれれば即」という値**で、呼ばれるまでの待ちは別にある。

## 前との比べ

| | 9月5日 18:23 の押し（直す前） | 今回 21:29 の押し（直したあと） |
|---|---|---|
| 帯 | 手で書き、**検査の途中で消した**（13分が帯の外） | **hook が自動で開け閉め**（漏れなし） |
| 上限で殺された回 | 見張り1回・生存2回（ID=329） | **0回** |
| 生存の穴 | **18分56秒**（18:29:19 → 18:48:15） | **13分50秒**（網に掛からず） |
| 巡回の戻り | 上限で殺されるまで**戻らなかった**（18:48:03） | 帯が消えて**2分11秒**で戻った |
| 🪟 | — | **鳴っていない** |

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **140件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`根の試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A0%B9%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-05 21:57 | 根の試験-1 — 本物の pre-push を一回通して、直りを見届けた |
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

<!-- 控えの一覧 ここまで -->
