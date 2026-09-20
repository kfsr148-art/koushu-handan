# 札抜けの直し（甲）— 控えの写しを見張りが持ち、抜けた札を先に一枚立てる

**終わり（残り0件）** — 2026-09-20 19:0x（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 入れた形（甲）

**退避を「控えを書く手」ではなく、`watch-notify.ps1`（毎分の巡回）に持たせた。**

＊宣言の甲は「`frame-work` が上書きする前に退避」だったが、**16:40 の取りこぼしは `frame-work` の上書きではなく、
　こちらが控えを書き替えた回**で起きている（16:59:29 に書いて 17:00:43 に自分で上書き）。
　控えを書く手に頼る形では同じ穴が残るので、**毎分そこを通る見張りに写しを持たせた**。守れる範囲が広い。

| 綴り | 役目 |
|---|---|
| `note-shadow.txt` | 巡回ごとに控えをそのまま写す（前の回の姿） |
| `note-missed.txt` | 件名が替わったのに**札になっていなかった**写しの退避（一枚だけ持つ） |
| `card-last-body.sig` | **本編の札を出した回**の控えの指紋。札になったかの見分け |

**流れ** … 巡回で控えを読む → 写しの件名が今と違い、写しに本文（完了・実測・ファイル・実機・種類・そのまま）があり、
**その指紋が「最後に札になった指紋」と違えば** `note-missed.txt` へ退避 → 次に**本編の札を出す回**に、
**退避の札を先に一枚**（`✅ 終わりました（返事不要）`・本文は「（札が立たないまま次の仕事へ移っていた分）」＋控えの本文）立ててから、今の札を出す → 退避は消す。

**触った所** … `~/.claude/watch-notify.ps1`（写し `.bak-20260920c`）。**二箇所**——控えを読んだ直後の写し・退避と、本編を出す枝の先頭。
**触らない所** … `frame-work.ps1`・`pipe-check.ps1`・札の題や本文の作り・`koushu-handan.html`・`stable`。構文検査 OK。

## 作り値（本物の二つの塊をそのまま写し、偽の送り手で）

| 場合 | 結果 |
|---|---|
| **イ 一つの応答で二枠を続けて片付けた型**（枠A の控え → 巡回 → 枠B の控えで上書き → 札を出す回） | **札は二枚**。順は **① `✅ 終わりました` 枠A「（札が立たないまま次の仕事へ移っていた分）A を直した」→ ② 本編（枠B）**。記録にも「札にならずに件名が替わった控えを退避した」「退避していた控えの札を先に立てた」が残る |
| **ロ ふつうの一枠**（同じ件名のまま三度巡回） | **退避の札は0枚**（本編だけ。二重にならない） |
| **ハ 件名は替わるが、前の控えが既に札になっていた回** | **退避の札は0枚**（指紋が一致するので退避しない） |

**本物の巡回でも確かめた** … 直した後の実際の回で `note-shadow.txt` が書かれ（18:50:10・118B）、例外は出ていない。

## 残る穴（正直に）

- **写しが取れるのは「ふつうの巡回」の回だけ。** 空きが足りない帯は軽い巡回で返るので写しが更新されない。
  ただし**札を出すのも同じふつうの回**なので、札が出る帯では写しも取れている。
- **一分の間に件名が二度替わると、間の一つは拾えない**（巡回が見る前に二度上書きされるため）。
  16:40 の型（74秒）は拾えるが、**30秒で二枠を片付けると取りこぼす**。
- 退避は**一枚だけ**持つ。続けて二つ抜けた場合、古い方は拾えない（二枚目の退避で上書きしない作りにしてある）。

## 作法36 の突き合わせ（見張りの決めを変えたので）

見張りの段の並びは変えていない（開始 → 生存の合図 → 命令の見張り → 譲りの判じ → 帯 → 鍵 → 押し直し → …
**控えを読んだ（ここに写し・退避を足した）** → … → 知らせ（**ここで退避の札を先に立てる**）→ 完了）。
**雲で回る見張りは無い。** 検査の段（手元の速い版17段／雲は全部）はこの枠で変えていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **324件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1055.md) | 09-20 10:52 | subj-gap の見比べと step-slow の上限を直した（push-defer は直さない） |

<!-- 控えの一覧 ここまで -->
