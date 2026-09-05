# 帯の中の走り出し-1 — 帯をまたいだ走り出しを、関門が持って鳴らす

**状態** … ①②は済み／③（実地）は**次に重い検査を回した帯で見届ける**／巡回の判定には触っていない

## 何が落ちていたか

帯の間は巡回をまるごと見送るので、その間に始まった仕事の走り出しは出ない。
ふつうは帯が明けた一回で出るが、**その前に次の枠が来ると印が落ちて**、
その仕事の走り出しは**出ないまま終わる**。2026-09-05 23:57〜00:02 がこれだった。

## ① 直した形（`heavy-gate.ps1` だけ）

**帯の間** … `last-order.txt` を見て、**帯に入ってから来た指示**の刻と題を控える。

- 控えるのは `heavy-held-order-<tag>.txt`。**最後の一件だけ**（途中の仕事はもう終わっている）
- **問いかけ（`kind=ask`）は控えない**
- **帯より前に来ていた枠も控えない**——その仕事の走り出しは既に鳴っているので、
  控えると帯が明けるたびにもう一度鳴ってしまう
- 控えた回は足跡へ「帯の中に始まった仕事を控えた：〈題〉」と残す

**帯が明けた一回** … 「見送った分をここで走らせる」と同じ場で、控えを拾って**一発鳴らす**。

- 題は **`😸 走り出したにゃ（終了予定は未定）`** の一行だけ（`ntfy-say.ps1` と同じ送り方）
- **札は立てない**（走り出しは写す物が無い知らせで、見張りの側でも控えを通していない）
- 鳴らしたら控えを落とす。**二度は鳴らない**
- 足跡へ「帯の中に始まった仕事の走り出しを鳴らした（HTTP 200）：〈題〉」と残す

**巡回の判定には触っていない。**持つのも鳴らすのも**関門の側**だけ。

## ② 作り値（本物の関門を、当たり障りのない手で回した）

```
(甲) 帯の中・枠その1                     → 控えた（01:00:00 帯の中の一つ目の枠）
(乙) 帯の中・枠その2                     → **最後の一件だけ**に入れ替わった
(丙) 帯の中に問いかけが来た              → 控えは替わらない
(丁) 帯が明けた一回                      → **鳴った（HTTP 200）**／控えは落ちた
(戊) 帯より前に来ていた枠                → **控えない**（正しい）
(己) 帯に入ってから来た枠                → 控えた
(庚) 帯が明けた一回                      → **鳴った（HTTP 200）**／控えは落ちた
```

足跡にもそのまま残っている。

```
00:16:16  test  帯が消えたので、見送った分をここで走らせる（見送り 3回）
00:16:18  test  帯の中に始まった仕事の走り出しを鳴らした（HTTP 200）：帯の中の二つ目の枠
00:17:16  test  帯の中に始まった仕事の走り出しを鳴らした（HTTP 200）：帯に入ってから来た枠
```

＊**この作り値は本物の ntfy へ二通送っている**（HTTP 200 の確かめに要るため）。
　00:16 と 00:17 に「😸 走り出したにゃ（終了予定は未定）」が届いていれば、それはこの作り値のもの。

## ③ 実地

**次に重い検査を回した帯で見届ける。**見るところは三つ。

1. 帯の間に枠が来たら、足跡に「帯の中に始まった仕事を控えた：〈題〉」が出る
2. 帯が明けた一回で「帯の中に始まった仕事の走り出しを鳴らした（HTTP 200）：〈題〉」が出る
3. 端末に「😸 走り出したにゃ（終了予定は未定）」が届く

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **145件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`帯の中の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 09-06 00:17 | 帯の中の走り出し-1 — 帯をまたいだ走り出しを、関門が持って鳴らす |
| [`走り出しの黙り-3-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3-2.md) | 09-06 00:14 | 走り出しの黙り-3（差し替え版）— 9月1日の直しは残っている。弾いていたのは手前の二つ |
| [`走り出しの黙り-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3.md) | 09-06 00:06 | 走り出しの黙り-3 — 弾いていたのは見込みではなく「開始の時計」 |
| [`先の穴-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-2.md) | 09-05 23:15 | 先の穴-2 — 押し出した札を残し、件名を機械が書き、訴えを画面に出す |
| [`先の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-1.md) | 09-05 22:30 | 先の穴-1 — 生存を関門の外へ、訴えをその場で鳴らす |
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

<!-- 控えの一覧 ここまで -->
