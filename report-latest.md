# 走り出しの黙り-3 — 弾いていたのは見込みではなく「開始の時計」

**状態** … 終わり／判定の大元には触っていない

## ① 22:31 以降の各仕事（刻つき）

| 刻 | 仕事 | 枝に入ったか | 弾かれた条件 |
|---|---|---|---|
| 22:13:45 | 22:11:10 の枠 | **入った** | — 「😸 走り出したにゃ（終了予定は未定）」で鳴った |
| 22:31:08 | 同上（形が変わって二度目） | **入った** | — 同上 |
| **22:39:55 〜 23:57:13** | **22:39:55 の枠（先の穴-2）** | **入らない** | **`if ($ovAt -gt 0)`** … `work-started.txt` が無い |
| 23:57:13 〜 00:02:21 | 同上 | 入れる形にはなったが鳴らず | **巡回が重い帯で丸ごと見送られていた**（帯は 23:29:31 に継ぎ足され 23:59:31 まで）。明けた直後の 00:02:21 に**新しい枠が来て印が落ちた** |
| 00:02:21 | 走り出しの黙り-3 | **入った** | — 00:03:08 に時計、**00:04:22 に「😸 走り出したにゃ（終了予定は未定）」**、00:04:25 に押し送りOK |

**なぜ時計が無かったか** … 時計（`work-started.txt`）を打つのは `inbox-watch.ps1` L441 で、
条件は **「鍵が `run:` の回」**。ところが**長い一手番の間は hook が一度も鳴らない**ので、
鍵が `run:` にならない。22:39:55 の枠のあと、**次に hook が鳴いたのは 23:57:13 の stop** だった。
その間ずっと `$ovAt` が 0 で、走り出しの枝の入口で弾かれていた。

＊**前の回にこちらが「見込みが無いからだ」と一行で答えたのは誤り。**弾いていたのは
　`$ovMin`（見込み）ではなく `$ovAt`（開始の時計）。見込みは未定のままでよい作りになっている（下記②）。

## ② 9月1日の直しは**生きている**

`watch-notify.ps1` に、そのまま残っている。

```
L2127  if ($ovAt -gt 0) {                                   ← 入口。$ovMin は見ていない
L2128    $startForm = $(if ($ovMin) { 'time' } else { 'undef' })
L2166      $script:startTitle = '😸 走り出したにゃ（終了予定は未定）'
```

注記も残っている——「**見込みが無くても走り出しは鳴らす**（2026-09-01・走り出しの黙り-2）。
v1 は `if ($ovMin -and …)` だった」。

**実地でも三度、この形で鳴っている**（22:13:45 ／ 22:31:08 ／ 00:04:22）。**枝は無事。**

## ③ 直した形 — 枠を受けた場で、開始の時計も打つ

`inbox-feed.ps1`（枠を受ける hook）に足した。**鍵の判定には触っていない。**

- **枠を受けた場が、作業の始まりそのもの**なので、ここで `work-started.txt` を打つ
- **指示の回だけ**（`kind=ask` では打たない。前の仕事の開始が上書きされるため）
- **件名が同じなら打ち直さない**（同じ枠が二度届いても、開始が後ろへずれない）
- `inbox-watch` 側の条件は**そのまま**。あちらは「件名が変わった回に打ち直す」ので、
  こちらが先に打っていれば同じ値になり、何もしない

**作り値（本物の枝を字面のまま抜き出して回した）**

```
(甲) 指示の回・時計が無い   → 打った（subj＝枠の題／at＝いまの刻）
(乙) 同じ指示で二度目       → 打ち直さない
(丙) 問いかけの回           → 触らない
(丁) 別の新しい指示         → 打ち直した（新しい題と刻）
```

**実地** … 00:02:21 の枠（この枠）で 00:03:08 に時計が打たれ、**00:04:22 に😸が鳴った**。
これは直す前の道（`inbox-watch` が run: の回に打つ）で通ったものだが、
**次の枠からは、hook が鳴かない長い一手番でも、受けたその場で時計が入る。**

## 残る一つ（報告だけ・直していない）

**重い帯の間は巡回が丸ごと見送られる**ので（残りの根-1 ①）、帯の中に始まった仕事の
走り出しは**帯が明けるまで出ない**。ふつうは明けた直後の一回で出るが、
**その前に次の枠が来ると印が落ちて、その仕事の走り出しは出ないまま終わる**（23:57〜00:02 がこれ）。

塞ぐには「帯の中でも走り出しだけは出す」形になるが、**それは巡回の判定に触る**ので、
ここには書くだけにする。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **143件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`読みの道-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-2.md) | 09-03 20:31 | 読みの道-2 — 名を変えた写しを置く（読む側が待たずに最新を取れる） |

<!-- 控えの一覧 ここまで -->
