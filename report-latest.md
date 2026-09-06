# 訴えの内訳-1 — 31件は何を言っているか（数えただけ）

**状態** … 終わり／**何も直していない**

## 台帳の二件

| 件 | 片付け方 |
|---|---|
| **先の穴-2-1**（写した印を公開側へ） | **取下**。受け口が無く塞げない … `panel.html` は GET だけ／GitHub Pages は静的／唯一の道の ntfy POST は**話題名を公開ページへ書く**ことになる。受け口を立てるのは**土台の外**なので取り下げ。読む側（`copied.json` があれば避ける）は入れてある |
| **帯の中の走り出し-1** | **済**。①②は作り値7通りで確認。**③実地はまだ鳴っていない**——昨夜以降、**帯の中に枠が来た回が無い**ため。`heavy-skip.log` の「走り出しを鳴らした」は **00:16:18 と 00:17:16 の二件だけで、どちらも `tag=test` の作り値**。仕掛けは入っており、帯の中に枠が来た次の回に鳴る |

## 訴えの内訳（`pipe-warn.log` 全体 40行）

| 種類 | 件数 | 何を言っているか |
|---|---|---|
| `cards-full` | **26** | 札が上限に張り付いている。最初 09-05 09:44:18 ／ 最後 09-06 03:01:31 |
| `ask-note` | 7 | 問いかけと判じた枠がある。**見返してほしい**という報せ（09-05 のうち6件は数え直しの重複で、いまは一度だけ鳴る形に直してある） |
| `subj-gap` | 5 | 作業中の件名が食い違っている。**うち少なくとも直近の1件は空振り**（60字と34字の切り違い）で、いまは食い違いとしない形に直してある |
| `rung` | 2 | **訴えではない**（下記） |

**数え方で件数が変わる。**

```
全部                          … 40件
ok と heavy-skip を除く       … 40件（ok の行は残っていない）
さらに rung も除く            … 38件
直近12時間だけ                … 16件
```

## `rung` は訴えではない — **鳴らした記録**

```
2026-09-05 22:21:50  rung  一発鳴らした：cards-full・subj-gap
2026-09-06 01:31:26  rung  一発鳴らした：subj-gap
```

**「訴えが出たので一発鳴らした」という控え**で、問題を訴えているのではない。
ところが**定時の報せの数え方は「`ok` と `heavy-skip` 以外」**なので、
**`rung` も訴えとして数えられている**（2件ぶん多く出る）。

＊直すなら数え方から `rung` を外すだけだが、**この枠は数えるだけ**なので手を付けていない。

## 「出口の束ねで待たされた回」を、送れなかったと数えていないか — **数えていない**

| 見る所 | いま |
|---|---|
| `retry` の訴え（送り直しの控えが15分以上残っている） | **0件** |
| `ntfy-retry.txt`（送り直しの控えそのもの） | **無い** |
| 束ねで待たせた記録 | `watch-notify.log` に1件（「押し送りは待たせる…」） |

**待たせた回は「送った」として返している**ので、上流に送り直しの控えが立たない。
だから `retry` は増えず、**束ねが失敗として数えられることはない**。
（もし `$false` を返していれば `ntfy-retry.txt` が立ち、15分後に `retry` の訴えになっていた。）

## いちばん多いのは `cards-full` の26件

**札が 40/40 に張り付いている**という報せ。09-05 09:44 から 09-06 03:01 まで、
巡回のたびに条件が続く限り出る（同じ種類が続く間の再送は止めたが、**記録そのものは残る**）。
押し出しは既に始まっており、退避（`notices-archive.json`）が16枚受けている。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **157件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`訴えの内訳-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E5%86%85%E8%A8%B3-1.md) | 09-06 12:25 | 訴えの内訳-1 — 31件は何を言っているか（数えただけ） |
| [`帯の中の押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-06 08:43 | 帯の中の押し-1 — 帯の前に押し、帯の間も押しだけは通す |
| [`過去の札の件数-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%81%8E%E5%8E%BB%E3%81%AE%E6%9C%AD%E3%81%AE%E4%BB%B6%E6%95%B0-1.md) | 09-06 03:22 | 過去の札の件数-1 — 「🗄 過去の札」の見出しに件数を出した |
| [`走り出しの題-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%A1%8C-1.md) | 09-06 02:39 | 走り出しの題-1 — 走り出しの題に、仕事の名を入れた |
| [`通知の出口-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-3.md) | 09-06 02:32 | 通知の出口-3 — 見張りの道にも同じ60秒の束ねを置いた |
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

<!-- 控えの一覧 ここまで -->
