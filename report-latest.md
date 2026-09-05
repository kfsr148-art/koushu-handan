# 走り出しの黙り-3（差し替え版）— 9月1日の直しは残っている。弾いていたのは手前の二つ

**状態** … 終わり／**新しい行も条件も足していない**（本体は一字も触っていない）

## ① 字面の照合 — **五つとも残っている**

いまの `watch-notify.ps1` に、9月1日の直しがそのまま在る。

```
✓ 入口が $ovMin を見ない        …  if ($ovAt -gt 0) {
✓ 形を分ける $startForm         …  $startForm = $(if ($ovMin) { 'time' } else { 'undef' })
✓ 未定の題                      …  '😸 走り出したにゃ（終了予定は未定）'
✓ 9月1日の注記                  …  「見込みが無くても走り出しは鳴らす」
✓ 印に形の名を入れる            …  $startKey = $startForm + "`t" + $ovSubj + …
```

## ② 消えていない — 写しを順に当てた

| 写し | 9月1日の注記 | 未定の題 | 古い条件 `if ($ovMin -and $ovAt -gt 0)` |
|---|---|---|---|
| `.bak-20260901d` | 無 | 無 | **残っている** |
| `.bak-20260901e` | 無 | 無 | **残っている** |
| `.bak-20260902a` | 有 | 有 | 無 |
| `.bak-20260903a` | 有 | 有 | 無 |
| `.bak-20260904b` | 有 | 有 | 無 |
| **いまの本体** | **有** | **有** | **無** |

**直しが入ったのは `.bak-20260901e` の後**（09-01e にはまだ古い条件がある）。
以後どの写しでも消えておらず、**戻す作業は要らない**。

## ③ 弾いていた条件（枝に入る**手前**の二つ）

走り出しの枝は、二重の入れ子の中にある。

```
L2095   if ($key -like 'run:*') {          ← ①巡回の鍵が run: であること
L2106     if ($ovAt -gt 0) {               ← ②開始の時計（work-started.txt）があること
L2127       if ($ovAt -gt 0) {             ← 走り出しの枝（9月1日の形。$ovMin は見ていない）
```

**22:39:55 の枠が黙ったのは②。**`work-started.txt` が空だった。
時計を打つのは `inbox-watch.ps1` L441 で、条件は「鍵が `run:` の回」。
ところが**長い一手番の間は hook が一度も鳴らない**ので鍵が `run:` にならない。
22:39:55 の枠のあと、**次に hook が鳴いたのは 23:57:13 の stop** だった。

**見込みは一度も関わっていない。**枝の入口は `$ovMin` を見ていないため。

## ④ 作り値（本物の枝を字面のまま抜き出して回した・本体には触っていない）

```
(甲) 見込みが無い                   → **鳴った**：😸 走り出したにゃ（終了予定は未定）
(乙) 同じ枠で二度目                 → 鳴らない（印が効いている）
(丙) 見込み40分（新しい仕事）        → **鳴った**：😸 終了予定は0時52分ですにゃ
(丁) 見込みはあるが終了予定が過去    → **鳴った**：😸 走り出したにゃ（終了予定は未定）
```

**(甲) が枠の問いそのもの。**見込みが無くても、枝は入って未定の形で鳴る。

## ④の続き — 22:31 以降に黙った各仕事が、この形なら鳴っていたか

| 仕事 | 黙った理由 | 時計さえあれば |
|---|---|---|
| 22:39:55 の枠（先の穴-2） | ②開始の時計が無い（22:39:55〜23:57:13） | **鳴っていた**（作り値(甲)と同じ形。見込みは無かった） |
| 同・23:57:13〜00:02:21 | 時計は入ったが、**重い帯で巡回が丸ごと見送られていた**（23:59:31 まで） | 帯が明けた一回で鳴るはずだったが、**00:02:21 の新しい枠で印が落ちた** |
| 00:02:21 の枠 | — | **実際に鳴った**（00:04:22「😸 走り出したにゃ（終了予定は未定）」・00:04:25 押し送りOK） |

## 実地

**00:04:22 の一発が、そのまま実地の証拠になっている。**
このときの控えに `見込み:` の行は**無い**。それでも未定の形で鳴った。

＊時計が入るようになったのは、前の枠（走り出しの黙り-3 の初版）で
　`inbox-feed.ps1` に入れた「枠を受けた場で時計を打つ」ため。**この枠では何も足していない。**
＊この枠で一度書きかけた二つ（`order-started.txt` ／ 控えへ「見込み: 未定」）は、
　**枠が差し替わったので両方とも戻した**（`inbox-feed.ps1` は `.bak-20260906b` の姿）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **144件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`読みの道-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-3.md) | 09-03 20:52 | 読みの道-3 — `latest-name.txt` を完全な URL 一行にした |

<!-- 控えの一覧 ここまで -->
