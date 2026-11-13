# 写真取込の三件（y1113-2126・v1463〜v1465）

**終わり** — 2026-11-13 22:22（VAIO）。残り0件。三版とも雲の速い版は全てPASS・配信済み。

| 番号 | 結果 |
|---|---|
| 1 テンプレ登録の板 | v1463（48c3f960）。開いている間は取込の画面（写真・読取牌の列・釦の段）を隠し、登録の板だけを画面いっぱいに出す。閉じると元の並びへ戻る。 |
| 2 斜め写真の自動補正（四隅モードの枠も含む） | v1464（1de474f2）。手牌の列（白い面の帯）を自動で探し、上下左右の縁に線を当てて四隅を出し、射影変換でまっすぐな帯に引き直す。牌の隙間で13枚に切り、補正した帯を上の写真にも映す。外れたら前に押した四隅、無ければ四隅合わせ（4点タップ・保存して次も使う）。「四隅合わせ」の釦を足した。 |
| 3 撮ったら判定まで自動 | v1465（e4848b8d）。受付ページから来た写真は取込→補正→読み取り→判定まで押さずに進む。牌が13枚そろわない・見本と合う度合いが低い（平均の色の差 40 超）・二つの見本で迷う（比 1.15 未満）時だけ確認画面で止め、赤枠と文言で示す。 |

## 実測（写しに probe）

**1（844x390・667x375）** 板が画面いっぱい（0,0〜視野いっぱい）、後ろの三つは隠れ、「閉じる」は1つ。牌の列は画面の中。釦42個（見本37＋板の5）すべて押せる（直す前は0個）。閉じると写真・読取牌の列・釦の位置が開く前と同じ。

**2（作り写真：テレビ・卓・捨て牌・手牌13枚＋離れた14枚目、ぼかし1.2px・ざらつき・照り返し）**

| 写真 | 補正 | 四隅のずれ | 13マスの純度／取りこぼし無し | 14枚目 |
|---|---|---|---|---|
| まっすぐ | 自動 | 4.5px（牌の高さの5%） | 100% / 100% | 帯の外 |
| 斜め約15° | 自動 | 4.9px（5%） | 100% / 100% | 帯の外 |
| 斜め約30°＋少し傾き | 自動 | 5.7px（5%） | 100% / 100% | 帯の外 |
| 四隅合わせ（30°・4点） | 押した四隅 | 5.5px（5%） | 100% / 100% | 帯の外 |
| 雀魂のスクショ | 自動 | 8.0px（6%） | 100% / 100% | 帯の外 |

手牌の無い写真 → 四隅合わせへ切り替わる（前の四隅なし）／前に押した四隅で補正（前の四隅あり）。枠合わせ（2点）は今までどおり効く。釦の段（四隅合わせを足した6つ）は 844x390・667x375 で全部押せる。

**3（844x390・受付ページと同じ幅1280・JPEG0.85で渡す）** 判定画面まで押さずに進み、13/13正解（入力欄「123m 66p 77s 東東東中中中」）。見本に無い絵柄を1枚混ぜた写真は確認画面で止まり、7枚目だけ赤枠「見本と合う度合いが低い・近いのは六筒」。

## 気をつける所

- **本物の写真では確かめていない。** 斜めに撮ったテレビの写真が手元に無く、作り写真だけで測った（人手待ち）。
- **似た牌は「迷う」で止まることがある。** 作り写真で三筒と四筒・五筒と六筒は、正しく読めていても二番目との比が 1.08〜1.14 で、敷居 1.15 を下回って止まった。敷居（色の差40・比1.15）は仮。実機で止まり方を見て直す。
- 受付ページの「写真を撮る」釦そのものは機械では押せないので、受付ページが渡すのと同じ形の写真を本体へ渡して確かめた。

## 実機で見る所

スマホを横にして受付ページで撮る → 押さずに判定画面が出る（版の字が v1465）。斜めから撮っても、確認画面の上の写真は手牌の列だけのまっすぐな帯になる。止まった時は読取牌の列の怪しい牌に赤枠が付き、理由が一行出る。テンプレ登録を押すと板だけが画面いっぱいに出て、閉じると元の画面に戻る。

＊シムなし（probe は写しにだけ差し、写しごと消した）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **648件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1113-2126.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2126.md) | 11-13 22:22 | 写真取込の三件（y1113-2126・v1463〜v1465） |
| [`cloud-check-fast-20261113-131005.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-131005.md) | 11-13 22:15 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-130004.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-130004.md) | 11-13 22:09 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-124356.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-124356.md) | 11-13 21:47 | 雲で回した：`check-fast.js` |
| [`y1113-2057.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2057.md) | 11-13 21:39 | 横画面で場を押すと並びがずれる（y1113-2057・v1462） |
| [`cloud-check-fast-20261113-122520.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-122520.md) | 11-13 21:28 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-121529.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-121529.md) | 11-13 21:24 | 雲で回した：`check-fast.js` |
| [`y1113-2020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2020.md) | 11-13 20:39 | 写真取込の後、上の写真を手牌の帯だけに切り抜く（y1113-2020・v1460） |
| [`cloud-check-fast-20261113-112830.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-112830.md) | 11-13 20:33 | 雲で回した：`check-fast.js` |
| [`y1113-1931.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-1931.md) | 11-13 19:58 | 写真取込の後、横画面で下の釦が切れる（y1113-1931・v1459） |
| [`cloud-check-fast-20261113-104749.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-104749.md) | 11-13 19:52 | 雲で回した：`check-fast.js` |
| [`r1113-1528-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1113-1528-2.md) | 11-13 15:28 | 再起動-2（r1113-1528・後の測り） |
| [`r1113-0337-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1113-0337-2.md) | 11-13 03:37 | 再起動-2（r1113-0337・後の測り） |
| [`r1112-1524-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1112-1524-2.md) | 11-12 15:24 | 再起動-2（r1112-1524・後の測り） |
| [`r1112-0331-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1112-0331-2.md) | 11-12 03:31 | 再起動-2（r1112-0331・後の測り） |
| [`r1111-1525-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1111-1525-2.md) | 11-11 15:25 | 再起動-2（r1111-1525・後の測り） |
| [`r1111-0334-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1111-0334-2.md) | 11-11 03:34 | 再起動-2（r1111-0334・後の測り） |
| [`r1111-0329-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1111-0329-2.md) | 11-11 03:29 | 再起動-2（r1111-0329・後の測り） |
| [`r1110-1525-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1110-1525-2.md) | 11-10 15:25 | 再起動-2（r1110-1525・後の測り） |
| [`r1110-0332-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1110-0332-2.md) | 11-10 03:32 | 再起動-2（r1110-0332・後の測り） |

<!-- 控えの一覧 ここまで -->
