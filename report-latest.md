# 番号の始末と雲の走りの確かめ（panel v140）

**①済・②済。止まったのは雲の走りの結果待ちだけ**——19:25 の枠は①（写せますの札を丙で直す）も②（延びの時計）も終えて札 `y0920-2000` を出してあり、そのあと雲の走りが走行中で読めず手待ちになっていた。**いま completed / success を確かめたので、止まりは解けた。残り0件。**

**終わり（残り0件）** — 2026-09-20 19:53（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 番号ごとの結果（19:25 の枠）

| 番 | 結果 |
|---|---|
| **①「写せます（N件）」の札を丙で直す** | **済**。`notify-record.ps1` が公開の並び（`notices.json`）を組むとき、本文が「写せます（N件）」だけの札を入れない。控え（`notify-sent.tsv`）には残る。抜け殻の `lastReadyCount()` を削除。版は三箇所そろえて **panel v140**。作り値二通り合格（数だけ→入らない／中身あり→今までどおり）。公開 `notices.json` **36枚・数だけ0枚**、公開 `panel-ver.txt` **140** を実読み |
| **②「延びています」の時計をヨシ待ちの間は止める** | **済（受け取り済み）**。19:00 の枠として同じ回に実施してあった。`over-hold.txt` で待ちの間を止め、経過と終了予定から差し引く。作り値三通り合格（札 `y0920-1930`） |

## 何で手待ちになったか

**雲の走り 35505135364（panel v140 の押し）が走行中で、結果を読めなかったため。**
待ち受けを背後に置いたが、**機械の空きが細って止められた**（命令の失敗ではない。起こし直しはしていない）。
この回で一度読み直し、**completed / success** を確かめた。

## 雲の走り 35505135364 の段（全段 success）

| 仕事 | 段 | 結果 |
|---|---|---|
| scope | 検査が要る回かを見る | success |
| check | 速い版（`check-all --fast`） | **success** |
| check | **フル版（`check-all`）** | **success** |
| check | ウィジェットの検査（`widget-check.js`） | success |
| check | **返事パネルの検査（`panel-check.js`）** | **success** |
| check | 落ちたときだけ知らせる | skipped（落ちていない） |
| deploy | 配信（`deploy-pages`） | success |

## 実機で見る所

- 返事パネルの一覧に「写せます（N件）」だけの札が**出てこない**（中身のある札だけが並ぶ）。
- 「まとめて写す（残N／M件）」の数は**今までと同じ**。
- 下の版の字が **panel v140（9月20日）**。
- iPhone の**押し送り（鳴り）は今までどおり**。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **330件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1953.md) | 09-20 19:53 | 番号の始末と雲の走りの確かめ（panel v140） |
| [`y0920-2000.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2000.md) | 09-20 19:29 | 「写せます（N件）」の札を公開の並びから外した（丙）／「延びています」の時計は受け取り済み |
| [`y0920-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1945.md) | 09-20 19:20 | 公開側40枚の「写せます（N件）」の札は、パネルで使われているか |
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

<!-- 控えの一覧 ここまで -->
