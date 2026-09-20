# 黄色い行が動かない・猫が走らない — 元を突き止めて三つ直した

**終わり（残り0件）** — 2026-09-20 20:10（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 黄色い行が読む公開側の欄

| 出るもの | 読む先 |
|---|---|
| **題と刻**（いちばん新しく終わった仕事） | **公開側の `notices.json`（札の並び）**。題が「終わりました／調べました」の札のうち、いちばん刻の新しいものを `lastDonePick()` が採る |
| 括弧の中（作業中・開始・経過・いまの枠の印） | `state.json`（`stat`／`startedAt`／`subj`） |
| 頭の猫が走るか | `state.json` の `stat`（元は `watch-state.txt` の**鍵**） |

## 止めていたのは、今日の三つの直しの**どれでもなかった**

**控えの末尾にあった空の `そのまま:` 一行**が元。2026-09-01 の「写しの空振りは送らない」の関門
（`$note.rawThin`）が立ち、**その回の札が丸ごと出なくなっていた**。完了も実測も載っていたのに、
空の写し一つで全部が消える作りだった。

**19:34・19:44・19:51・19:57 の四回**が記録に残っている（`watch-notify.log`）。

```
2026-09-20 19:34:40  「そのまま」の中身が 0字しかないので送らない（20字未満は空振りとみなす）
```

＊`notify-sent.tsv` の最後の札は **19:24:39**。以後、丙の直しも「続けて」も調べも、札が一枚も立っていない。
＊**三つの直し（note-shadow の退避・frames-hash の出し直し・写せますを40枚から外す）はどれも無関係**。
　退避と出し直しは 19:23 に正しく働いて札を二枚立てているし、写せますの丙は**並びから数だけの札を外すだけ**で、
　「終わりました」の札には触れていない。

**もう一つ、古い穴が重なっていた。** `panel.html` は v115 以来「本文のどこかに `写せます（` が在れば
仕事ではない」と外しており、**まとめた札の中に「写せます（2件）」が入っているだけで外れていた**。
19:23 の「🔎 調べました」がこれで落ち、**その一つ前の 19:04 が黄色い行に残っていた**。

**猫が走らない方は別の元。** 鍵（`watch-state.txt` の一行目）は**ふつうの巡回でしか書かれない**。
ところが軽い巡回の引き金は **node・gh・空き不足**で、**こちらが働いている間はほぼ毎回立つ**。
20:00〜20:03 は軽い巡回が続き、鍵が `done:19:54:57` のまま凍って `state.json` が「手待ち」だった。

## 直した三つ

| 所 | 直し |
|---|---|
| `watch-notify.ps1`（写し `.bak-20260920b`） | **空の写しで札ごと止めない**。完了・実測・ファイル・実機・種類が一つでもあれば、**「そのまま」だけを落として札は出す**。写しが全部の回は今までどおり出さない |
| `watch-notify.ps1` 軽い巡回の枝 | 譲る回も **`hook.log` を見て「走り出した」だけ鍵へ書く**（`done:` → `run:` の**上げる向きだけ**）。下げとヨシ待ちの見分けはふつうの巡回に任せる |
| `panel.html` → **panel v141** | 数だけの札の外しを**丸ごと一致**へ絞った（`^写せます（N件）$`）。まとめた札は外れない。版は三箇所そろえた |

## 作り値（本物は一つも叩いていない）

**イ 空の写しの関門**（本物の `Get-Note` を切り出して偽の道で回す）

| 控えの形 | 旧 | 新 |
|---|---|---|
| 完了あり＋**空の**そのまま | **札が出ない** | **札が出る**（そのまま欄は載らない） |
| 完了なし＋空のそのまま | 出ない | 出ない（今までどおり） |
| 完了あり＋中身のあるそのまま | 出る・写し39字 | 出る・写し39字（変わらず） |
| そのまま欄が無い | 出る | 出る（変わらず） |

**ロ 黄色い行**（本物の `lastDonePick`／`lastDone` を `panel.html` から切り出して回す）

| 並び | 旧 v140 | 新 v141 |
|---|---|---|
| 19:04 の札＋19:23 のまとめた札＋19:24 の数だけの札 | **同じ字の枠の二度目…（19:04）** | **この間にまとまった知らせ 2本（19:23）** |
| **仕事が終わる**（20:12 の終わりの札を足す） | 黄色い行が動かない・猫が走らない（**20:12**） | 黄色い行が動かない・猫が走らない（**20:12**） |
| 数だけの札しか無い | 出ない | 出ない |

**ハ 軽い巡回の鍵**（本物の枝を切り出して偽の道で回す）

| 形 | 結果 |
|---|---|
| 走り出した（resume が新しい） | `done:19:54:57` → **`run:20:20:00`**（二行目以降はそのまま） |
| 終わった後（stop が新しい） | `done:19:54:57` のまま（上げない） |
| 既に `run:` で同じ刻 | 書き直さない |
| ヨシ待ちの鍵 | `wait:` のまま（**下げない**） |

**実地** … 控えを今の仕事へ書き直したところ、鍵が `done:19:54:57` → **`run:20:01:01`**、
`state.json` が **`stat = 作業中`（20:09:20）** に変わった。猫が走る条件が立っている。

## 三つ目の枠（「延びています」の時計をヨシ待ちの間は止める）

**済**。19:00:37 の枠として同じ回に実施済みで、台帳も閉じてある。
持ち物は `over-hold.txt`（`subj`／`at`／`held`／`since`）で、**ヨシ待ちの回に止め、ヨシで抜けた回に
止めた分を足す＝ヨシの刻から測り直す**。経過＝（いま − 開始）−`held`、終了予定も `held` ぶん後ろへずらす。
作り値三通り合格（待ち20分→札なし／ヨシ後に延びた→札あり・終了予定も20分ずれ／待ち無し→今までどおり）。札は `y0920-1930`。

## 実機で見る所

- 返事パネルの**黄色い行**が、**いちばん新しく終わった仕事の題と刻**になる（この札を出した回なら「黄色い行が動かない・猫が走らない」と 20:1x）。
- 仕事の最中は**頭の猫が走る**（止まった猫ではなく走る絵）。
- 下の版の字が **panel v141（9月20日）**。

## 触った所と触らない所

**触った所** … `~/.claude/watch-notify.ps1`（空の写しの関門・軽い巡回の鍵）／`panel.html`・`panel-ver.txt`。
**触らない所** … 判定・条件・光る牌・`analyze()`・`koushu-handan.html`・`stable`・押し送りの道・控えの綴り。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **331件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1406.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406.md) | 09-20 14:06 | 【宣言】A の末尾の一文を数入りの字へ差し替える（v1456） |
| [`y0920-1400.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1400.md) | 09-20 13:59 | 外した表の前後の字（L1497・そのまま写し） |

<!-- 控えの一覧 ここまで -->
