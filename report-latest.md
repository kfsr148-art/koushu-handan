# 同じ字の枠の二度目は、走り直さず一度目の札を出し直す

**終わり（残り0件）** — 2026-09-20 19:1x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 入れた形

| 所 | 中身 |
|---|---|
| `frame-work.ps1`（写し `.bak-20260920`） | 枠の全文の指紋を **`frames-hash.tsv`**（刻・指紋・頭四十字／48時間ぶん）へ控える。**24時間の内に同じ指紋**が在り、その**台帳の行が「済」**なら、**走り直さず** `dup-done.txt` を置き、台帳へ「二度目・済：一度目は HH:MM に済…」の行を足して返る |
| `watch-notify.ps1`（写し `.bak-20260920d`） | `dup-done.txt` が在れば、**一度目に実際に送った札の本文**（`notify-sent.tsv` から仕事名で引く）を、頭に「**一度目は HH:MM に済（同じ字の枠なので走り直していません）**」を付けて**一枚出し直す**。引けない回は台帳の状態の字で出す |

**一度目が「未了」なら今までどおり**（受け入れて進む。10分以内の同じ全文を捨てる決めもそのまま）。
札の出し直しは**本編の札とは別の枝**に置いたので、二度目の枠で本編の札が立たない回でも出る。**構文検査は二本とも OK。**

## 作り値（本物の二つの塊を写し、偽の台帳・偽の札・偽の送り手で）

| 場合 | 結果 |
|---|---|
| **イ 一度目が済**（09:00 に済 → 18:00 に同じ字が再来） | `frame`「一度目（09:00）は済なので走り直さず、札を出し直す」／`dup-done.txt` に `hhmm=09:00`／台帳に「二度目・済」の行／**札は一枚**「✅ 終わりました … **一度目は 09:00 に済（同じ字の枠なので走り直していません）** ＋ 一度目の札の本文」 |
| **ロ 一度目が未了** | `frame`「一度目（09:00）は未了なので**今までどおり進める**」／`dup-done.txt` は**無し**／**札は0枚**（＝走って終わった時に今までどおり立つ） |

## 触った所と触らない所

**触った所** … `~/.claude/frame-work.ps1`・`~/.claude/watch-notify.ps1`（どちらも写しと構文検査つき）。
**触らない所** … 台帳の書き方・10分の捨ての決め・札の題や本文の作り・`koushu-handan.html`・`stable`。

## 作法36 の突き合わせ

見張りの段の並びは変えていない（知らせの段の中に「二度目の出し直し」を一つ足しただけ）。雲で回る見張りは無く、検査の段も変えていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **325件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1058-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058-2.md) | 09-20 11:28 | v1454 説明欄の三つの直し（納品） |
| [`y0920-1058.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058.md) | 09-20 10:53 | 【宣言】説明欄に三つ手を入れる（v1454） |

<!-- 控えの一覧 ここまで -->
