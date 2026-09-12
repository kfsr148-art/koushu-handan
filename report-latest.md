# ヨシの猫-6 — 現場猫の置き場を三つへ（印 y0912-1940）

**終わり（残り1件）** — 2026-09-12 19:40（VAIO）。panel v130。押し済み（`943f5bba`）。

## 置き場

| どこ | 絵 | 大きさ |
|---|---|---|
| ①ヨシ待ちの黄色い札の中 | `genba-cat-160.png` | **160px の等倍**（伸縮なし・`image-rendering: pixelated`） |
| ②ウィジェットのヨシ待ち | `genba-cat-80.png` | **原寸** |
| ③ntfy「🙋 ヨシしてください」の Icon: | `genba-cat-240.png` | そのまま |
| 頭の36pxの枠 | `panel-icon-white.png`（**元の影絵**） | 56x36 のまま |

`genba-cat-40.png` は消した。三枚はチャット側で作り直した物（六色）を `git pull` で取り込み、手元の同名を上書きした。

**札の高さ** — 猫の入るヨシ待ちの回だけ **176px**（猫160＋上下8）。ほかの三通り（作業中・次の指示待ち・ヨシを返してください以外）は今までどおり **79px**。
**どちらも固定値**なので、字の長さで下の釦が動くことはない。猫は縮ませない（`flex:0 0 auto`）。

## 測ったマス目

**1マス 5.333px ＝ 90マス。6・8・10 のどれでもなかった。**

縁の段差の並びを自家相関に掛けると、山が **5・11・16・21**（＝周期 5.333px）に立つ。
境目の段差の強さ（境目の平均 ÷ 中の平均）も 90マスが最も強い。

| マス | 1マス | 横 | 縦 |
|---|---|---|---|
| 48 | 10.000px | 1.22倍 | 1.35倍 |
| 60 | 8.000px | 1.09倍 | 1.40倍 |
| 80 | 6.000px | 1.08倍 | 1.11倍 |
| **90** | **5.333px** | **1.26倍** | **1.55倍** |
| 96 | 5.000px | 1.09倍 | 1.31倍 |
| 120 | 4.000px | 1.02倍 | 1.16倍 |

元絵は 90マスの絵を 480px へ**整数倍でなく**引き伸ばした物なので、6・8・10 では拾い切れない。

## 検査

- `panel-check` … **全てPASS**（版が三箇所とも v130）
- `widget-check` … **全てPASS**（`genba-cat-80.png` … 200）
- 公開側 … `genba-cat-80／160／240.png` と `panel-icon-white.png` はいずれも **200**。
  `genba-cat-40.png` は消したが、次の配信が回るまで公開側に 200 で残る。

## 実機で見るところ

返事パネルをヨシ待ちで開き、**黄色い札の左に色付きの現場猫が160px**で入っていること（**頭の36pxの枠は白い影絵のまま**）。
下の緑の「ヨシ」釦が、ほかの状態と同じ幅・高さで札の下に続いていること。
ウィジェットのヨシ待ちは色付きの猫が80px。ntfy の「🙋 ヨシしてください」の丸い絵が色付きの現場猫になること。

## 残り

1. **選択釦-1（v1439）** — 宣言済み・ヨシ待ち（印 `y0912-1900`）。兎の一行を「切るなら〈牌〉」へ替えるだけ。

＊途中で焼いた `genba-cat-90.png` と `genba-cat-180.png`（元のマス目で拾い直した物）は、いまはどこからも使っていない。
　git の中の物なので勝手には消さない（作法29 ④）。消してよければ一声ください。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **216件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0912-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1940.md) | 09-12 19:44 | ヨシの猫-6 — 現場猫の置き場を三つへ（印 y0912-1940） |
| [`y0912-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1915.md) | 09-12 19:14 | ヨシの猫-5 — 現場猫の絵を綺麗にした（印 y0912-1915） |
| [`検査を雲へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%82%92%E9%9B%B2%E3%81%B8-1.md) | 09-12 13:42 | 検査を雲へ-1 — Actions で検査し、通った版だけ配信する |
| [`知らせの押し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-2.md) | 09-12 12:31 | 知らせの押し-2 — 束ねない題と、小さな押しを通す／㉑〜㉔の今の状態 |
| [`知らせの押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-12 12:04 | 知らせの押し-1 — 03:00 以降に押した一覧と、09:47 の「延びています」が題を失った理由 |
| [`見張りの止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-12 11:04 | 見張りの止まり-1 — 段の時間切れ・空きの関門・止まりの知らせ |
| [`札の本文-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%9C%AC%E6%96%87-1.md) | 09-12 09:54 | 札の本文-1 — 終わりの札が前の仕事の文で出る／遠隔の橋-1 を閉じた |
| [`外の見張り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-2.md) | 09-12 04:09 | 外の見張り-2 — claude.exe が0本なら /fail を打つ |
| [`外の見張り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-1.md) | 09-12 03:46 | 外の見張り-1 — 巡回の末尾で hc-ping.com へ一分に一発 |
| [`読むだけの台本-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%82%80%E3%81%A0%E3%81%91%E3%81%AE%E5%8F%B0%E6%9C%AC-1.md) | 09-12 03:26 | 読むだけの台本-1 ／ 鉤の軽量化-1 ／ 巡回の空き-1 ／ 人手待ち-1 ／ 知らせの割り当て-1 ／ 重複の枠-1 |
| [`y0912-0300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-0300.md) | 09-12 02:54 | 連携の穴（09-12）— 枠の全文・板と訴えの押し直し・台帳の開き方・知らせの題・フル版の関門・止まった窓（印 y0912-0300） |
| [`連携の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E7%A9%B4-1.md) | 09-12 02:54 | 連携の穴-1 — Codeタブ・返事パネル・GitHub の連携の棚卸し |
| [`y0912-0200.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-0200.md) | 09-12 01:54 | 0x4A の切り分け-1 — 無線LANを外して有線へ、Event 41 で数える（印 y0912-0200） |
| [`0x4A の三（四度目）.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/0x4A%20%E3%81%AE%E4%B8%89%EF%BC%88%E5%9B%9B%E5%BA%A6%E7%9B%AE%EF%BC%89.md) | 09-11 20:57 | 0x4A の三（四度目）— 管理者の窓を開かずに、読める分を片付けた |
| [`落ちた後の起こし-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%90%BD%E3%81%A1%E3%81%9F%E5%BE%8C%E3%81%AE%E8%B5%B7%E3%81%93%E3%81%97-2.md) | 09-11 20:35 | 落ちた後の起こし-2 — 窓の起こし直しと🪟・RC 切れの数え・遠隔の会話名 |
| [`y0911-0701.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0701.md) | 09-11 07:02 | 0x4A の三（三度目）— 昇格の問いは四回とも約2分で取り消し（印 y0911-0701） |
| [`y0911-0627.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0627.md) | 09-11 06:29 | 0x4A の三（二度目）— 昇格の問いは出したが、約2分で取り消しになった（印 y0911-0627） |
| [`y0911-0047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0047.md) | 09-11 00:47 | 落ちた後の起こし-1 と 帯の中の黙り-1（乙）— 三件とも済 |
| [`y0910-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-2255.md) | 09-10 22:53 | 帯の中の黙り-1 — 直し方の裁定のお願い（印 y0910-2255） |
| [`土台の直し-1の実装.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%9F%E8%A3%85.md) | 09-10 20:27 | 土台の直し-1（実装）— shanten を analyze() の外へ持ち上げ、写し二つを廃した（v1438） |

<!-- 控えの一覧 ここまで -->
