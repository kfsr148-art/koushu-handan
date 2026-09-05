# 通知の出口-2 — 出口で60秒のあいだ束ねる

**状態** … 作り値は済み／実地は**次の終わりで見届ける**／**送る者の作りには触っていない**

## 入れた形（`ntfy-say.ps1` の出口だけ）

```
同じ60秒の間に既に一本出していれば
  → この一本は**出さずに待たせる**（題を ntfy-exit-hold.tsv へ積む）
     ＊札は先に立っているので、**中身は失われない**
     ＊異常も同じ出口を通る。**止めはしない。待たせるだけ**
次にこの出口を通る回で
  → 待たせた分と一緒に**一本**にして出す
     題 … 🔔 まとめて N件
     本文 … 各行の題を並べる（一本ずつの回は今までどおり題だけ）
出せたら（HTTP 200 のときだけ）
  → 出した刻を控え、待ち行列を空にする
```

＊**出せなかった回は刻を控えない。**失敗した送りで60秒の窓を開けてしまわないため。

## 作り値（偽の送り手・本物へは一通も送っていない）

```
(甲) 60秒の間に三本
     ✅ 終わりました        → 出た（一本目）
     🪟 異常です            → 「前の一本から 1秒。待たせて次と束ねる」
     🔎 調べました          → 「前の一本から 2秒。待たせて次と束ねる」
     出た数 … **1本**

(乙) 61秒あけて、もう一本
     ✅ 終わりました（二本目）→ 「待たせていた 2本と束ねて、一本で出す」
     出た数 … **2本**（累計）

出たものの中身
  02:02:49  ✅ 終わりました（返事不要）
  02:02:51  🔔 まとめて 3件 ／ 本文＝🪟 異常です｜🔎 調べました｜✅ 終わりました（二本目）
```

**異常は止まっていない。**束ねの中に題として並んでいる。

## 残っている一つ（報告だけ）

**待たせた一本は、次にこの出口を通るまで出ない。**
`ntfy-say` を呼ぶ者が二度と来なければ、その一本は待ったままになる。

塞ぐには「待ち行列を見て出す者」が要るが、それは**送る者の作り**に手を入れることになるので、
この枠では入れていない。いまの呼び手（`pipe-check` の訴え・手からの報告）は繰り返し来るので、
実際には次の回で流れる。

## 実地（2026-09-06 02:1x）

**この関門を、本物の送りで一度通した。**

```
札を立てた（1399バイトの全文）
知らせを一通だけ送った … HTTP 200（本文 3バイト）
出口の刻   … 前「無い」→ 後「有る（1788628970）」   ← 60秒の窓が開いた
待ち行列   … 無い（空＝正しい）
```

**一本目が通り、窓が開くところまでは実地で確かめた。**
束ねる側（二本目以降を待たせて一本にする）は、上の作り値で確かめてある。

## 「次の終わりで見届ける」は、この関門では観測できない

**見張り本体の終わり（✅ 終わりました／🐈 写せます）は、この出口を通らない。**
あちらは `Push-Ntfy`（見張りの中の送り口）から出る。

```
この出口（ntfy-say.ps1）を通る者
  ・pipe-check の訴え（🪟 連携に訴えがあります）
  ・手からの報告（札を立てて題を送る回）
通らない者
  ・見張り本体の終わり・写せます・走り出し・異常・延び・定時
```

**だから、次に観測できるのは「次に ntfy-say を通る一本」**——訴えか、報告の札。
見張りの終わりまで同じ出口に集めるのは、**送る者の作り（`Push-Ntfy`）に手を入れる**ことになり、
この枠の「送る者の作りには触らない」に当たるので、していない。
（それを求めていたのが差し替え前の枠「通知の一本化-1」で、こちらは未着手のまま。）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **152件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`通知の出口-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-2.md) | 09-06 02:23 | 通知の出口-2 — 出口で60秒のあいだ束ねる |
| [`subj-gapの空振り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/subj-gap%E3%81%AE%E7%A9%BA%E6%8C%AF%E3%82%8A-1.md) | 09-06 01:50 | subj-gapの空振り-1 — 同じ文を違う長さで切っただけ |
| [`入口の時計-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%A5%E5%8F%A3%E3%81%AE%E6%99%82%E8%A8%88-1.md) | 09-06 01:34 | 入口の時計-1 — 入口が20秒を越えた回は、先へ進まずに降りる |
| [`入口の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%A5%E5%8F%A3%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-06 01:27 | 入口の固まり-2 — 入口が重かったのは「足跡の帳面を毎段まるごと読む」から |
| [`地図の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%B0%E5%9B%B3%E3%81%AE%E7%A9%B4-1.md) | 09-06 00:48 | 地図の穴-1 — 八段それぞれの「読む物が壊れたとき」 |
| [`作り値の送り先-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%9C%E3%82%8A%E5%80%A4%E3%81%AE%E9%80%81%E3%82%8A%E5%85%88-1.md) | 09-06 00:34 | 作り値の送り先-1 — 作り値は偽の送り手へ。今夜の分は回し直した |
| [`見張りの地図.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E5%9C%B0%E5%9B%B3.md) | 09-06 00:34 | 見張りの地図 — `watch-notify.ps1` の巡回を、段ごとに開く |
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

<!-- 控えの一覧 ここまで -->
