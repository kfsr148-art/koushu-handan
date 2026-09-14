# 合わせ技-1（八人の点数の重み付き合計）

**終わり** — 2026-09-14 20:4x（VAIO）。本体・`core-battle-log.tsv` には触っていない。台は `scratchpad/mix.js`（読むだけ）。

## 組み方

- `core-battle-log-10k.tsv`（40000手）を**局番号**で割った。**決め用＝局1〜7500（30000手）／測り用＝局7501〜10000（10000手）**。
- 八人それぞれの点数は、**その人の材料の値ごとの「点棒の平均」**（人柄の較正-1 の②と同じ表を、決め用だけで作り直したもの）。三段の線では切らない。
- その八つを並べ、**点棒に合わせた最小二乗（切片つき）**で重みを決めた。決めるのは決め用の30000手だけ。
- 判じ方は「重み付き合計 > 0 なら攻め」。

**決まった重み**

| 執事 | 軍師 | ずんだ | お嬢様 | マダム | 一姫 | 先生 | 兎 | 切片 |
|---|---|---|---|---|---|---|---|---|
| 915 | 564 | 232 | 664 | 208 | **-942** | 446 | 698 | -322 |

一姫だけ**符号が逆**に出た。対子の種類が多い手は先生・ずんだ・兎の点数にも同じ中身が乗っているので、
**重なって二度数えたぶんを差し引く向き**に働いている（一姫単独では +850点の差があったのに、である）。

## 測り（後10000手）

| 決め方 | 攻めと言った手 | 守りと言った手 | 全体の的中 | 口を開く |
|---|---|---|---|---|
| **本判定** | 31.8%・**+1100点**（2402手） | 17.8%・-115点（7598手） | **67.8%** | 100.0% |
| **八人の合計** | 26.5%・+636点（5496手） | 14.5%・**-382点**（4504手） | 54.5% | 100.0% |
| **紙一重だけ八人** | 31.8%・+1103点（2407手） | 17.8%・-116点（7593手） | **67.8%** | 100.0% |
| **孤立×字牌の二段** | 25.5%・+531点（5680手） | 15.4%・-288点（4320手） | 52.5% | 100.0% |

＊勝率は和了率。点棒は一局あたりの平均。

## 読み

**点棒の開きでは八人の合計がいちばん広い側に見えるが、的中では本判定に 13.3ポイント負ける。**
八人の合計は攻めと言う手が **5496手（55.0%）**——本判定の 2402手（24.0%）の倍以上ある。
点棒に合わせて重みを決めたので「攻めても損しない手」を全部拾いにいき、**攻めに寄りすぎた**。
攻守の差そのものは +1018点（+636 と -382）で、本判定の +1215点（+1100 と -115）に届かない。

**紙一重の手だけ八人の合計に任せる形は、ほぼ何も動かない。** 測り用の紙一重が **43手（0.4%）**しかなく、
攻めの手数が 2402→2407 の**5手**変わるだけ。的中も点棒も本判定と区別が付かない。
紙一重を判じ直す価値を測るには、**紙一重の定義そのものを広げる**必要がある。

**孤立牌×一枚きりの字牌の二段の決まりは、四つの中でいちばん弱い。**（決め用のマスの点棒の平均が正なら攻め、
30手に満たないマスは守り、とした。）攻め 5680手で +531点は、八人の合計と同じ「攻めに寄りすぎ」の形で、
そのうえ材料が二つしかないぶん分け方が粗い。

**四つとも口を開く割合は 100%。** どの決まりも必ず攻めか守りを言う作りなので、黙る手が無い。
黙る形を入れるなら、合計の絶対値が小さい帯を「黙る」に回す線を別に引くことになる。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **220件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`合わせ技-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-1.md) | 09-14 20:31 | 合わせ技-1（八人の点数の重み付き合計） |
| [`y0913-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0913-0015.md) | 09-13 00:34 | 配信の切り分け-1（印 y0913-0015） |
| [`y0912-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2100.md) | 09-12 21:21 | 選択釦-1 — v1439（印 y0912-2100） |
| [`y0912-2015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2015.md) | 09-12 20:16 | ヨシの猫-7 — ヨシ待ちの頭を現場猫の顔へ（印 y0912-2015） |
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

<!-- 控えの一覧 ここまで -->
