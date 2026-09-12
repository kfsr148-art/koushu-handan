# 配信の切り分け-1（印 y0913-0015）

**終わり** — 2026-09-13 00:4x（VAIO）。押し済み（`39425058`）。走りは **scope・check・deploy とも success**。

## 21:30 以降の Actions（40本）

| 段 | 数 |
|---|---|
| **check** | **success 40本**（落ちた回は無い） |
| **deploy** | success 25本／cancelled 11本／**failure 1本** |

**止まっている段は無い。** 控えの押し（state・notices・board・usage・status・pipe-warn）は毎回 check:success → deploy:success で通っていた。
cancelled 11本は `concurrency: pages` の打ち切り＝同じ刻に重なった押しの後発が勝つ形で、こちらは異常ではない。

落ちた1本は **21:49 の `19664dea`（v1439）** … `check:success ／ deploy:failure`。

## 117分の訴えの正体

**止まりではなく、測りの当たり方。** 22:03 から 00:00 まで**新しい札が立たなかった**ので、公開側の `notices.json` は 22:03 のままだった。
00:00 に札が立った瞬間、「公開側の札が手元のいちばん新しい札より117分古い」と出た。押しと配信が追いつく **00:10:27 に ok で消えている**（`pipe-warn.log`）。

いま公開側は追いついている … `state.json` の `at`＝**00:12:55**／`ver.txt`＝**1439**／`panel-ver.txt`＝**132**。

## ただし本物の穴が二つあった

1. **`stable` の付け替えでも走りが立ち、その deploy は必ず落ちる。**
   `github-pages` の環境は **main の枝からしか配信できない**ので、tag の ref から回った deploy は毎回 failure。21:49 の failure がこれ。
2. **その failure が「直前の走りが落ちていないかを見る」関門を濁す。**
   関門は落ちていたら `exit 1` で配信を止めていたが、**止めた回自身も failure になる**ので、次の回の関門がまた落ちを見る——連鎖しうる形だった。

## 直した形（指示どおり分けた）

段を三つに分けた。

| 段 | いつ走る | 配信の掛かり方 |
|---|---|---|
| **scope** | 毎回（数秒） | 何が変わった push かを見るだけ |
| **check** | **本体の回だけ**（`koushu-handan.html`・`ver.txt`・`panel.html`・検査の台本など） | — |
| **deploy** | 毎回 | **控えの回は検査に掛けずそのまま配信**／**本体の回は check が success の回だけ** |

あわせて二つ直した。

- **枝を main に絞った**（`on: push: branches: [main]`）。`stable` の付け替えで走りが立たなくなり、穴①が消える
- **関門を「落とす」から「飛ばす」へ**。走りを failure にせず、その回の配信だけ見送る（穴②が消える）

＊控えの回でも「直前の本体の検査が落ちたまま」なら配信は見送る——落ちた版を、あとの控えの押しが公開してしまうのを止めるため。直った版が通れば次の控えの回から**ひとりでに戻る**。

## 実測

- 分けた後の控えの回 … `d2573bf0`「usage: 更新」で **scope:success ／ check:skipped ／ deploy:success**。検査を通らずに配信された
- 分けた後の本体の回 … `39425058`（この工事そのもの）で **scope:success ／ check:success ／ deploy:success**
- 21:49 の `19664dea` … `check:success ／ deploy:failure`。同じ sha の **21:18 の走り（枝の push）は check・deploy とも success** で、v1439 はそちらで配信済み

## 残り

残り0件。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **219件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0911-0627.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0627.md) | 09-11 06:29 | 0x4A の三（二度目）— 昇格の問いは出したが、約2分で取り消しになった（印 y0911-0627） |

<!-- 控えの一覧 ここまで -->
