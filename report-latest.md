# 「写せます（N件）」の札を公開の並びから外した（丙）／「延びています」の時計は受け取り済み

**終わり（残り0件）** — 2026-09-20 20:0x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 1. 丙で直した（控えは残し、公開の並びからだけ外す）

| 所 | 中身 |
|---|---|
| `~/.claude/notify-record.ps1`（写し `.bak-20260920`） | 公開の並び（`notices.json`）を組む所で、**本文が「写せます（N件）」だけの札は入れない**。控え（`notify-sent.tsv`）には今までどおり残す。押し送り（iPhone の鳴り）は別の道なので**鳴る役は変わらない** |
| `panel.html` → **panel v140** | **抜け殻の `lastReadyCount()` を消した**（v117 で呼び手が無くなっていた）。残っているのは註の二行だけ。版は `PANEL_VER`／下の字／`panel-ver.txt` の三箇所そろえた |

**作り値（本物の `notify-record.ps1` の写し・偽の控え・偽の押し手）**

控えに4枚（**中身のある札2枚／数だけの札2枚**）を置いて組み直した結果：

| | 結果 |
|---|---|
| **数だけの札** | **公開の並びに入らない**（0枚） |
| **中身のある札** | **今までどおり入る**（2枚：「中身のある札B」「中身のある札A」） |
| 控え（`notify-sent.tsv`） | **4枚とも残っている**（辿れる） |

**本物でも組み直した** … 手元・公開とも **36枚・数だけの札0枚**（実読み。前は40枚中4枚が数だけの札）。
＊36枚なのは、控えの40行のうち4行が数だけの札だったため。**新しい中身のある札が来れば40枚まで戻る。**

## 2. 「延びています」の時計（三つ目の枠）… **受け取って、もう入れてある**

19:00:37 の枠として受け取り、**同じ回で実施済み**（札 `reports/y0920-1930.md`・台帳も済）。

- 持ち物は `over-hold.txt`（`subj`／`at`／`held`＝止めた通算／`since`）。**ヨシ待ちの回に止め、ヨシで抜けた回に止めた分を足す**＝**ヨシの刻から測り直す**。
- 経過＝（いま − 開始）−`held`。**終了予定の刻も `held` のぶん後ろへずらす**。
- **作り値** … **ヨシ待ち20分 → 経過5分・札なし**／**ヨシ後に本当に延びた（開始45分前・うち待ち20分）→ 経過25分・札あり**（終了予定も20分ずれて 19:12）／待ちが無い回 → 今までどおり札あり。

## 実機で見る所

- 返事パネルの一覧に、**「写せます（N件）」だけの札が出てこない**こと（中身のある札だけが並ぶ）。
- 「まとめて写す（残N／M件）」の数は**今までと同じ**（この札は元から数に入れていない）。
- 下の版の字が **panel v140（9月20日）**。
- iPhone の**押し送り（鳴り）は今までどおり**——写せる札が出たら鳴る。

## 触った所と触らない所

**触った所** … `~/.claude/notify-record.ps1`（並びに入れない一行）／`panel.html`・`panel-ver.txt`（抜け殻の削除と版）。
**触らない所** … 押し送りの道・控えの綴り・釦の数の数え方・`watch-notify.ps1`・`koushu-handan.html`・`stable`。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **329件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330.md) | 09-20 13:29 | 【宣言】説明欄の節五から猫牌の表の二つ目を外す（v1455） |

<!-- 控えの一覧 ここまで -->
