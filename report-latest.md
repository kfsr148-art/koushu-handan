# ヨシの猫-5 — 現場猫の絵を綺麗にした（印 y0912-1915）

**終わり（残り1件）** — 2026-09-12 19:15（VAIO）。genba-cat-40/80/160.png を新しい作り方で焼き直し、push した（`e53b1f29`）。

## 作り方（指示の五段そのまま）

| 段 | したこと |
|---|---|
| ① | 480px の元絵を**先に**六色のべた塗りへ丸めた。元絵は滲みで 8331 色あり、白240〜／灰147／濃灰85／黒32 の谷で切った。中間色はここで消える |
| ② | 12x12 マスごとに**最多色**で拾って 40x40（平均はやめた） |
| ③ | 孤立した一マス（周り8マスに同じ色が無い）は、周りの多数色へ均した |
| ④ | 透けに接する中身のマスを黒1マスの輪郭に。目は**黄2x2 を二つ**、舌は**桃2x2** を、元絵の有彩の重心へ置き直した |
| ⑤ | 濃灰は帽子の帯と体の縞だけに限り、小さな塊は周りの灰（白が多ければ白）へ均した |

＊⑤の「灰」は**濃灰（90）**と読んだ。元絵の灰は二段あり、体の毛が147・帽子の帯と体の右縁の縞が85。
　まだらになっていたのは濃灰のほうで、毛の灰（170）まで落とすと猫の体が無くなる。

## 前と後

| | 白 | 灰 | 濃灰 | 黒 | 黄 | 桃 | 透け |
|---|---|---|---|---|---|---|---|
| 前（÷12 の平均） | 155 | 210 | 140 | 175 | 3 | 4 | 913 |
| 後（最多色＋均し） | 216 | 165 | **46** | 207 | **8** | 4 | 954 |

濃灰 140 → 46。体じゅうに散っていたまだらが、帽子の帯と右縁の縞だけに寄った。
目は 3マス → 黄2x2 が二つ（8マス）、舌は桃2x2（4マス）。三枚とも**六色＋透けちょうど**で、
40x40・80x80・160x160。目の置き場は x15,y11 と x21,y11、舌は x18,y17。

## ついでに直した穴（枠の取り違え-1）

この枠（「ヨシの猫の絵を綺麗にしろ…」）が**ヨシの返事と読まれ**、選択釦-1 の待ちが控えから畳まれていた。
`frame-work.ps1` の見分けが `^…ヨシ` で頭だけを見ていたため。**末尾まで見る形**へ直した（写し `.bak-20260912c`・構文OK）。

実測8通り … `ヨシ`／`ダブルヨシ`／`y0912-1900 にヨシ`／同（空白なし）／`ヨシ。以上` → **返事**。
`ヨシの猫の絵を…以上`／`選択釦-1を進めろ。以上` → **仕事**。

印 `y0912-1900`（選択釦-1 の工事のヨシ）は `yoshi-open.tsv` に残っていたので、**待ちは生きている**。

## 実機で見るところ

返事パネルのヨシ待ちの札の猫（40マス等倍・高さ36の枠）と、ウィジェットの猫（80px）。
**目が黄の四角二つ・舌が桃の四角一つ**で、**体の灰にまだらが無い**こと。

## 残り

1. **選択釦-1（v1439）** — 宣言済み・ヨシ待ち（印 `y0912-1900`）。兎の一行を「切るなら〈牌〉」へ替えるだけ。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **215件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0910-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-2255.md) | 09-10 22:53 | 帯の中の黙り-1 — 直し方の裁定のお願い（印 y0910-2255） |
| [`土台の直し-1の実装.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%9F%E8%A3%85.md) | 09-10 20:27 | 土台の直し-1（実装）— shanten を analyze() の外へ持ち上げ、写し二つを廃した（v1438） |
| [`y0910-1752.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1752.md) | 09-10 17:53 | 押しの黙り-1 — 押しの失敗と .git の壊れを訴えへ足した（印 y0910-1752） |

<!-- 控えの一覧 ここまで -->
