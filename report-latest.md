# pub-late は ok へ戻った／配信の関門を偽の走りで当てた

**終わり（残り0件）** — 2026-09-20 21:00（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## ① pub-late は ok へ戻っている

**`pipe-warn.log` の最後の行**

```
2026-09-20 20:30:20  pub-late      公開側が 56分 遅れている（押しが済んだ札より古い）
2026-09-20 20:30:53  rung          一発鳴らした：pub-late
2026-09-20 20:40:27  ok            訴えは無くなった      ← いちばん最後の行
```

**`pipe-seen.txt` の中身** … **空**（5バイト＝BOM 3バイト ＋ 改行2バイトだけ。訴えの名は一つも無い）。

```
0000000 357 273 277  \r  \n
```

この綴りは「**いま立っている訴えの名をカンマで並べた物**」で（`pipe-check.ps1` L697）、
**空＝残っている訴えは無い**。20:30 に立った `pub-late` は **20:40:27 の巡回で落ちている**（10分で戻った）。

## ② 配信の関門を、古い commit を指す偽の走りで当てた

**当て方** … 本物の `check.yml` から関門の `run:` の中身だけを字面で切り出し、**写しの蔵**で回した。
本物の main は毎分進む（控えの押し）ので、**蔵を凍らせて**（`--bare` の写しを相手に）当てている。
本物の配信も push も commit も叩いていない。

**切り出した関門（本物の字）**

```sh
git fetch --quiet --depth=1 origin main
TIP=$(git rev-parse FETCH_HEAD)
echo "先端 $TIP ／ この回 $GITHUB_SHA"
if [ "$TIP" = "$GITHUB_SHA" ]; then
  echo "stale=0" >> "$GITHUB_OUTPUT"
else
  echo "stale=1" >> "$GITHUB_OUTPUT"
  echo "先端が進んでいるので、この回は配信を飛ばす（先端の回が配る）"
fi
```

| 当てた形 | 出た値 | 配信の三段（`if: … stale != '1'`） |
|---|---|---|
| **イ 古い commit を指す偽の走り**（先端の4つ前） | **`stale=1`** ＋「先端が進んでいるので、この回は配信を飛ばす」 | **三段とも飛ぶ＝配らずに終わる** |
| ロ 先端を指す走り（ふつうの回） | `stale=0` | 三段とも走る＝**今までどおり配る** |

**実地でも効いた。** 関門を入れた押しの走り **35508407982**（20:38:37 起き・検査が長く、終わる頃には
新しい押しが先端になっていた）の配信の段は、こうなっている。

```
直前の検査が落ちていないかを見る : skipped
Run actions/checkout@v4          : success
この回の commit がまだ先端かを見る : success
Run actions/configure-pages@v5   : skipped
Run actions/upload-pages-artifact@v3 : skipped
Run actions/deploy-pages@v4      : skipped
```

**古い中身を配らずに終わり、走り自体は success のまま**（`failure` にしないので、次の控えの回の
「直前の検査が落ちていないか」の関門を濁さない）。これが 20:26:51 に起きた巻き戻しを止める形。

## 触った所と触らない所

**触った所** … なし（この回は読みと作り値だけ。札と控えと台帳のみ）。
**触らない所** … `koushu-handan.html`・`stable`・`check.yml`（前の回で入れたまま）・押し送りの道。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **333件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2100.md) | 09-20 21:02 | pub-late は ok へ戻った／配信の関門を偽の走りで当てた |
| [`y0920-2040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2040.md) | 09-20 20:39 | pub-late（公開が56分遅れ）の元 — 長い回の配信が、古い版を後から上書きしていた |
| [`y0920-2010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-2010.md) | 09-20 20:10 | 黄色い行が動かない・猫が走らない — 元を突き止めて三つ直した |
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

<!-- 控えの一覧 ここまで -->
