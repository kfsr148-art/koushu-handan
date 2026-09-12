# 選択釦-1 — v1439（印 y0912-2100）

**終わり（残り1件）** — 2026-09-12 21:0x（VAIO）。押し済み（`19664dea`）。公開側 `ver.txt` は押してから **126秒**で 1439 になった。

## 直したのは一行だけ

```
- return tileChip(c.code) + 'が浮いている。切りだ。';
+ return '切るなら' + tileChip(c.code);
```

`koushu-handan.html` L4771、`window.toolEyeSay('usagi')` の戻り。版は三箇所そろえ（`data-ver`・`verTag`・`ver.txt`）、`serifu.txt` / `serifu-adv.txt` を再抽出して `--check` で本体との一致を確かめた（合計7593行・口調の混入0件）。

## 指示の五点と、本体の実際

| 指示 | 本体 |
|---|---|
| 判定画面の枝豆・AI・現場猫の**常設の行を撤去** | **v1437（09-07）で撤去済み**。`div` は無く、CSS の三つの規則が字だけ残る |
| 人柄の「ランダム」の横に**四角の釦を四つ** | **設置済み**（L8816・`.eye-btn` 44px の入れ子＝作法10） |
| 押した時だけ**見立て行の場所に一行、入れ替えで** | **実装済み**（`toolTap` → `saySet`。`toolMark` 一本で点くのは常に一つ） |
| 切り候補-1 で足した**見立て行の下の一行を撤去** | **本体に無い**（既に撤去済み） |
| 兎は**「切るなら〈牌〉」と候補の牌の光り** | **文言を今回替えた。**光りは `body.tool-usagi .tile.cut-mark`（琥珀の outline）で元から点く |

**判定の中身（攻守・判定獣・第一感の見立て・光る牌）には一字も触っていない。**

## 検査

- `check.js` 速い版 … **問題なし**（①〜㉒ 全てPASS。㉓「第一感が移す前と変わらないか」は速い版なので SKIP）
- `adv-check.js` … **全てPASS**
- **フル版（21視野）は未了** — 空き物理メモリ **1145MB** で関門（2048MB）に掛かった。宣言では「21視野で溢れ0」まで含めていたので、**空いた回に回して追って報告する**。
  直したのは台詞の一行（`が浮いている。切りだ。` 12字 → `切るなら` 4字）で、**見立て行は短くなる**ため溢れが増える向きではない

## 実機で見るところ

判定画面で**兎の釦**を押すと、見立て行の場所に「**切るなら〈牌〉**」が一行だけ出て、その牌が**琥珀の枠**で光ること。もう一度押すと元の見立てへ戻ること。版の字が **v1439**。

## 残り

1. **過去の札の上限-1** — `notices-archive.json` を新しい50件だけ残し、以後も50件を上限に古い方から落とす（この工事の後、という指示どおり次に着手）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **218件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0911-0047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0047.md) | 09-11 00:47 | 落ちた後の起こし-1 と 帯の中の黙り-1（乙）— 三件とも済 |

<!-- 控えの一覧 ここまで -->
