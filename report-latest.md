# 選ばれた組み合わせを測った結果（y1114-0333）——本体を直す前の確かめ

**ヨシ待ち（確かめてもらう）** — 2026-11-14 03:33（VAIO）。本体は触っていない。

「y1114-0304 にヨシ。乙で、後から送った二つ（食い違う手で重みを測る・普段割れる審判同士の一致を重く）も入れて」を受けて、本体を直す前にその組み合わせを雲の1000局で測った。**この形のまま本体に入れても、判定はほぼ何も変わらない**ので、直す前に止まって確かめる。

## 足した「割れる審判同士の一致」

同じ側に倒れた審判の二人ごとに、**普段の一致の薄さ（1 − κ）× 二人の重みの相乗平均** を得点に足す（攻めなら＋、守りなら−）。普段よく揃う似た者同士（κ が高い）の一致はほとんど足されず、普段は割れる二人が揃った時に重く数える。重なりの割引・決め直す所（乙）・「得点>0 で攻め／<0 で守り／ちょうど0 は本判定のまま」はそのまま。

## 結果（雲の1000局・4000手。点数は確かめだけ）

| 形 | 範囲 | 守り→攻め（その平均点） | 攻め→守り（その平均点） | 攻めの割合 | 攻めの平均点 | 守りの平均点 |
|---|---|---|---|---|---|---|
| 今の版 | 全部 | — | — | 26.1% | +1107 | −134 |
| **① 指示どおり：乙＋食い違う手の重み＋割れる審判の一致** | 全部 | 0 | 1（+19000） | 26.1% | +1090 | −127 |
| ① | 決める用／確かめる用 | 0／0 | 1／0 | 26.8%／25.4% | — | — |
| ② 乙＋**全部の手で測った重み**＋割れる審判の一致 | 全部 | 806（+327） | 0 | 46.3% | +767 | −307 |
| ② | 決める用／確かめる用 | 412（+158）／394（+504） | 0／0 | 47.4%／45.1% | +822／+709 | −383／−234 |
| ③ 乙＋全部の手で測った重み（y1114-0304 の乙そのもの） | 全部 | 802（+322） | 0 | 46.2% | +766 | −304 |

## なぜ①は何も変わらないか

食い違った手だけで測ると、**審判が「攻め」・本判定が「守り」と割れた手で、攻めが正しかった審判が一人もいない**（全員 50% 未満・y1114-0321）。攻めの票の重みが全員0なので、割れる審判同士の一致を重くしても攻めの側には何も足されず、守り→攻めは0手。守りの票に重みが付く執事・現場猫の二人だけが効いて、攻め→守りへ1手（その局 +19000 点の和了の手）が動くだけになる。

## 選んでほしいこと

- **①のまま本体に入れる**：判定はほぼ変わらない（4000手で1手、それも点の取れた手が守りへ）。入れる値打ちは無いと見る。
- **②**（全部の手で測った重み＋割れる審判の一致）：守り→攻め806手・平均 +327（両方の半分でプラス）。攻め46.3%。
- **③**（y1114-0304 の乙）：②とほぼ同じ（割れる審判の一致の上乗せは、全部の手の重みでは差が小さい）。
- **今のまま**（本体を直さない）。

「y1114-0333 に ②」のように返してほしい。選ばれた形で本体を直す宣言を出す（判定の物差しに触るので、宣言とヨシを取ってから）。

## 気をつける所

- 母集団は機械打ち同士で、判定の字は打ち方を変えていない。実際に「守り＝完全にオリ」で打てば守りの手の結末は変わる。
- 一局で数千点動くので、数百手の平均には ±200〜300 のぶれがある。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **667件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1114-0333.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0333.md) | 11-14 03:33 | 選ばれた組み合わせを測った結果（y1114-0333）——本体を直す前の確かめ |
| [`y1114-0321.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0321.md) | 11-14 03:22 | 重みを「本判定と食い違った手」だけで測る（y1114-0321） |
| [`y1114-0304.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0304.md) | 11-14 03:04 | 際どい手と攻守の線に近い手だけを、審判の重み付きの票で決め直す（y1114-0304） |
| [`y1114-0300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0300.md) | 11-14 03:01 | 審判の重み付きの票（精度×重なりの割引）で、守り→攻めへ移す線の候補（y1114-0300） |
| [`y1114-0258.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0258.md) | 11-14 02:58 | 審判の重み付きの票で、守り→攻めへ移す線の候補（y1114-0258） |
| [`y1114-0255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0255.md) | 11-14 02:55 | 守りの中で点が取れている手を攻めへ移す候補（y1114-0255） |
| [`r1114-battle.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1114-battle.md) | 11-14 02:43 | core-battle 1000局を雲で回し直す（r1114-battle） |
| [`cloud-core-battle-1000-20261113-172926.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-core-battle-1000-20261113-172926.md) | 11-14 02:43 | 雲で回した：`core-battle-1000.js` |
| [`y1114-0144.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0144.md) | 11-14 02:08 | 読取釦から受付ページへ直に飛ぶ（y1114-0144・v1470）／core-battle の回し直し |
| [`cloud-check-fast-20261113-165458.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-165458.md) | 11-14 02:08 | 雲で回した：`check-fast.js` |
| [`r1114-camera-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1114-camera-2.md) | 11-14 01:34 | 受付ページのカメラの見分けをゆるめる（r1114-camera-2） |
| [`r1114-camera.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1114-camera.md) | 11-14 01:22 | 受付ページの中のカメラと、手牌の目印・自動で撮る（r1114-カメラ） |
| [`y1114-0022.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1114-0022.md) | 11-14 00:46 | 受付ページで押した時に音を取っておき、読み直さず判定まで進めて声を鳴らす（y1114-0022・v1469） |
| [`cloud-check-fast-20261113-153609.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-153609.md) | 11-14 00:40 | 雲で回した：`check-fast.js` |
| [`y1113-2354.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2354.md) | 11-14 00:17 | 撮って自動で判定した時の声（y1113-2354・v1468） |
| [`cloud-check-fast-20261113-150313.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-150313.md) | 11-14 00:07 | 雲で回した：`check-fast.js` |
| [`y1113-2241.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2241.md) | 11-13 23:25 | 写真取込の読み直し（y1113-2241・v1466→v1467） |
| [`cloud-check-fast-20261113-141206.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-141206.md) | 11-13 23:15 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-140705.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-140705.md) | 11-13 23:09 | 雲で回した：`check-fast.js` |
| [`y1113-2126.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2126.md) | 11-13 22:22 | 写真取込の三件（y1113-2126・v1463〜v1465） |

<!-- 控えの一覧 ここまで -->
