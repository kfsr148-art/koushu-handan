# 「延びています」の時計を、宣言のヨシ待ちの間は止めた

**終わり（残り0件）** — 2026-09-20 19:4x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 入れた形（`watch-notify.ps1`・写し `.bak-20260920d`）

- 持ち物は **`over-hold.txt`**（`subj` / `at`＝その仕事の開始の刻 / `held`＝止めた通算の秒 / `since`＝いま止め始めた刻）。
  **仕事が替われば（`subj` か `at` が違えば）0 から数え直す。**
- 鍵が **`wait:`（ヨシ待ち）の回に時計を止め**（`since` を打つ）、**ヨシが来て `wait:` を抜けた回に、止めていた分を `held` へ足す**
  ＝**ヨシの刻から測り直す**のと同じ。記録に「終了予定の時計を止めた（ヨシ待ち）」「動かし直した（止めていた通算 N分は経過に数えない）」を残す。
- 「延びています」の判定は **経過＝（いま − 開始）−`held`**。**終了予定の刻も `held` のぶん後ろへずらす**（待った時間は仕事に使っていないため）。
- 一つの作業につき一発の決め・見込みが未定のときの扱い・走り出しの札は**そのまま**。構文検査 OK。

## 作り値（本物の二つの塊を写し、偽の控え・偽の送り手で）

| 場合 | 結果 |
|---|---|
| **イ ヨシ待ちが20分続いている**（見込み20分・開始25分前） | **経過5分・止めた分20分・札なし**（待ちを数えていない） |
| **ロ ヨシが来て、そこから本当に延びた**（開始45分前・うち待ち20分・見込み20分） | **経過25分・札あり**「終了予定**19:12**を過ぎています（経過25分）」＝**終了予定も20分後ろへずれた** |
| ハ ヨシ待ちが無い回（素直に25分） | **今までどおり札あり**「終了予定19:12を過ぎています（経過25分）」 |

＊本物の台本では、そもそも**ヨシ待ちの回は「延びています」の判定に入らない**（作業中のときだけ出す決め）。
　この直しが効くのは**ヨシが来たあと**——待っていた分を経過から差し引く所。

## 触った所と触らない所

**触った所** … `~/.claude/watch-notify.ps1`（時計を止める塊・経過の式・終了予定の刻の三つ）。
**触らない所** … 一発だけの決め・未定のときの扱い・走り出しの札・`inbox-watch.ps1` の状態行・`koushu-handan.html`・`stable`。

## 作法36 の突き合わせ

見張りの段の並びは変えていない（知らせの段の中の時計の数え方だけ）。雲で回る見張りは無く、検査の段も変えていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **327件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1930.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1930.md) | 09-20 19:18 | 「延びています」の時計を、宣言のヨシ待ちの間は止めた |
| [`y0920-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1915.md) | 09-20 19:14 | report-latest.md はどこに書いているか／写しを機械の手にした |
| [`y0920-1900-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1900-2.md) | 09-20 19:03 | 同じ字の枠の二度目は、走り直さず一度目の札を出し直す |
| [`y0920-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1900.md) | 09-20 18:50 | 札抜けの直し（甲）— 控えの写しを見張りが持ち、抜けた札を先に一枚立てる |
| [`y0920-1830.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1830.md) | 09-20 18:35 | 16:40:21 の枠（赤い行の直し）に終わりの札が立たなかった訳 |
| [`y0920-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1756.md) | 09-20 17:58 | 赤い行の件（同じ枠の二度目）— **もう直っていて、公開側も戻っている** |
| [`y0920-1710-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710-2.md) | 09-20 17:23 | v1458 「三」の根拠の段へ一文を足した（納品） |
| [`y0920-1710.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1710.md) | 09-20 17:00 | 【宣言】「三」の根拠の段の末尾へ一文を足す（v1458） |
| [`y0920-1640.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1640.md) | 09-20 16:59 | 赤い行「知らせの道が落ちています」が消えなかった元と直し（panel v139） |
| [`y0920-1630.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1630.md) | 09-20 16:35 | 16:11 の訴え二つ（ntfy-down・pub-read）の今 |
| [`y0920-1500-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500-2.md) | 09-20 15:19 | v1457 剣士の八枚を idleRight 52 に揃えて焼き直した（納品） |
| [`y0920-1500.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500.md) | 09-20 14:48 | 【宣言】剣士の八枚を idleRight 52 に揃えて焼き直す（v1457） |
| [`y0920-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1450.md) | 09-20 14:40 | 08-20 の保留三つの今（振りの八枚の倍率・目盛り画像の置き場・sizing-review.png） |
| [`y0920-1406-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406-2.md) | 09-20 14:24 | v1456 A の末尾を実測の数を並べた字へ（納品） |
| [`y0920-1406.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406.md) | 09-20 14:06 | 【宣言】A の末尾の一文を数入りの字へ差し替える（v1456） |
| [`y0920-1400.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1400.md) | 09-20 13:59 | 外した表の前後の字（L1497・そのまま写し） |
| [`y0920-1330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330-2.md) | 09-20 13:50 | v1455 節五から猫牌の表の二つ目を外した（納品） |
| [`y0920-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330.md) | 09-20 13:29 | 【宣言】説明欄の節五から猫牌の表の二つ目を外す（v1455） |
| [`y0920-1210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1210.md) | 09-20 12:05 | 本体のいま三つ（較正-1 の綻び・猫牌の表・ダブルヨシ） |
| [`y0920-1146.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1146.md) | 09-20 11:56 | 今朝の枠の確かめと、実戦的中-2／持ち上げ-1 |

<!-- 控えの一覧 ここまで -->
