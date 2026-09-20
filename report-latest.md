# pub-late（公開が56分遅れ）の元 — 長い回の配信が、古い版を後から上書きしていた

**終わり（残り0件）** — 2026-09-20 20:40（VAIO）。`koushu-handan.html`・`stable` には触っていない。

## 元（確かめた筋道）

**配信の段は「その走りの commit」を配る。**`actions/checkout@v4` は走りを起こした `github.sha` を取るので、
**検査に時間のかかった回は、古い中身を抱えたまま後から配信に着く**。
2026-09-18 の「配信の譲り-1 乙」で `cancel-in-progress: false`（打ち切らず順に通す）にしたため、
**遅れて着いた古い配信も、必ず最後まで通って上書きする**ようになっていた。

| 刻 | 起きたこと |
|---|---|
| 20:09:46 | **panel v141 の押し**。走り 35507059555 が起きる（本体まわりなので**フル版の検査＝17分**） |
| 20:19:18 | 控えの押しで `notices.json` が進む（いちばん新しい札 **20:19:12**） |
| 20:20:28／20:22:57 | その回の配信が通る。**公開はここで 20:19 の中身になった** |
| **20:26:51** | **panel v141 の回の配信がここで着く**。中身は **20:09:46 の commit**＝`notices.json` のいちばん新しい札は **19:23:09**。**公開が 19:23 の中身へ戻る** |
| 20:30:20 | 巡回が公開を読む … 押しが済んだ札 **20:19:12** − 公開 **19:23:09** ＝ **56分** → `pub-late` |
| 20:30:53 | 一発鳴らした（`rung pub-late`） |

**数字の裏取り** … `git show 2919f9c3:notices.json`（panel v141 の commit）のいちばん新しい札は **19:23:09**。
56分の引き算とぴったり合う。**配信そのものは一本も落ちていない**（下の一覧のとおり全て success）。

＊19:23〜20:19 のあいだ `notices.json` が動かなかったのは、**空の「そのまま:」で札が立たなかった**別件
　（札 `y0920-2010`）のため。そこが空いていたので、**一回の巻き戻しが56分に見えた**。

## 直した（甲乙丙のうち**乙**）

`check.yml` の配信の段に関門を一つ足した——**この回の commit が `main` の先端でなければ配信しない**。
先端の回が自分で配るので、配る者が居なくなることはない（押しは必ず走りを起こす）。

```
git fetch --quiet --depth=1 origin main
TIP=$(git rev-parse FETCH_HEAD)   # 先端と github.sha を比べ、違えば stale=1 で飛ばす
```

**採らなかった案** … **甲**＝配信の段で `main` を checkout して先端の中身を配る。遅れは無くなるが、
**検査を通していない先端**を別の回が配ってしまい、作法18 の「落ちれば配信が止まる」が抜ける。
**丙**＝そのままにして次の押しを待つ。遅れは最長で**検査の尺（フル版17分）**ぶん開く。

## 今日 19:30 以降の雲の走り（一本ずつ）

**queued も失敗も取り消しも無い。29本すべて success（最後の一本だけ走行中）。**

| 起きた刻 | 終わった刻 | 尺 | 走り | 結果 | 題 |
|---|---|---|---|---|---|
| 19:30:26 | 19:31:02 | 36秒 | 35505260663 | success | board.json：板の値を更新 |
| 19:32:41 | 19:33:11 | 30秒 | 35505368719 | success | state.json：いまの様子を更新 |
| 19:35:02 | 19:35:36 | 34秒 | 35505479430 | success | usage: 更新 |
| 19:40:29 | 19:40:59 | 30秒 | 35505728349 | success | board.json：板の値を更新 |
| 19:41:03 | 19:41:36 | 33秒 | 35505754975 | success | state.json：いまの様子を更新 |
| 19:53:35 | 19:54:04 | 29秒 | 35506316876 | success | state.json：いまの様子を更新 |
| 19:54:30 | 19:55:35 | 1分5秒 | 35506356474 | success | 報告：19:25 の枠は①②とも済／雲の走り 35505135364 |
| 19:54:59 | 19:55:54 | 55秒 | 35506375602 | success | state.json：いまの様子を更新 |
| 19:57:29 | 19:57:56 | 27秒 | 35506484318 | success | usage: 更新 |
| 19:57:37 | 19:58:18 | 41秒 | 35506490641 | success | state.json：いまの様子を更新 |
| 20:00:19 | 20:00:51 | 32秒 | 35506612891 | success | state.json：いまの様子を更新 |
| 20:00:45 | 20:01:19 | 34秒 | 35506636642 | success | board.json：板の値を更新 |
| 20:01:29 | 20:02:04 | 35秒 | 35506673308 | success | state.json：いまの様子を更新 |
| 20:03:53 | 20:04:27 | 34秒 | 35506788652 | success | state.json：いまの様子を更新 |
| 20:09:33 | 20:10:05 | 32秒 | 35507048511 | success | usage: 更新 |
| 20:09:46 | 20:26:52 | 17分6秒 | 35507059555 | success | panel v141：黄色い行の「数だけの札」外しを丸ごと一致へ絞る |
| 20:09:51 | 20:10:23 | 32秒 | 35507063016 | success | state.json：いまの様子を更新 |
| 20:10:58 | 20:11:30 | 32秒 | 35507114904 | success | 報告：黄色い行が動かない元は空のそのまま欄／猫は軽い巡回で鍵が凍る（ |
| 20:11:29 | 20:11:57 | 28秒 | 35507138240 | success | state.json：いまの様子を更新 |
| 20:20:01 | 20:20:29 | 28秒 | 35507529892 | success | status.md／notices.json：知らせの写しを更新 |
| 20:20:48 | 20:21:54 | 1分6秒 | 35507571092 | success | board.json：板の値を更新 |
| 20:22:05 | 20:22:33 | 28秒 | 35507634626 | success | usage: 更新 |
| 20:22:25 | 20:22:58 | 33秒 | 35507650975 | success | status.md／notices.json：知らせの写しを更新 |
| 20:30:44 | 20:31:13 | 29秒 | 35508040781 | success | pipe-warn.json：連携の訴えを更新 |
| 20:30:59 | 20:32:16 | 1分17秒 | 35508052764 | success | status.md／notices.json：知らせの写しを更新 |
| 20:31:09 | 20:31:37 | 28秒 | 35508060133 | success | ntfy：押し送った本文を控える |
| 20:34:37 | 20:35:12 | 35秒 | 35508223000 | success | state.json：いまの様子を更新 |
| 20:34:58 | 20:35:36 | 38秒 | 35508238408 | success | state.json：いまの様子を更新 |
| 20:38:37 | （走行中） | 10秒 | 35508407982 | in_progress | check.yml：先端でない回は配信を飛ばす（古い版の後出し上書き |

＊`check=skipped` は控えだけの押し（検査の要らない回）。`check=success` は本体・パネルまわりの押し。
＊**尺の長い一本が 35507059555（20:09:46→20:26:52・17分6秒）**で、これが巻き戻しの元。
　次に長いのは 35508052764（1分17秒）で、他は全て1分未満。

## 手元と公開の突き合わせ（実読み）

| 見るもの | 手元 | 公開（実読み） |
|---|---|---|
| `panel-ver.txt` | 141 | **141**（HTTP 200） |
| `notices.json` | 36枚・いちばん新しい **20:30:31** | **36枚・いちばん新しい 20:30:31** |

**一致している。**20:30:59／20:31:46 の配信が新しい中身を配り直したので、**遅れは既に解けていた**
（落ちた配信は無いので、起こし直しは要らなかった）。

## 手元で回る段と雲で回る段（作法36）

| 段 | 手元（`node check-all --fast`） | 雲（`check.yml`） |
|---|---|---|
| ①〜⑥・⑧〜⑮・⑲〜㉒ | 回る | 回る |
| ⑦（画面の溢れ・Edge） | **飛ばす** | 回る（フル版・21視野） |
| ⑯⑰⑱㉓・adv-check | **飛ばす** | 回る |
| ウィジェット・返事パネルの検査 | 回らない | 回る |
| **配信** | — | **先端の回だけ配る（この回で足した関門）** |

＊今回**足したのは配信の関門だけ**で、検査の段は手元・雲とも**一つも増減していない**。

## 実機で見る所

- 返事パネルの札の一覧が、**押した直後の中身のまま戻らない**（長い検査の回の後でも古い並びに戻らない）。
- 下の版の字は **panel v141（9月20日）**のまま（この回で版は上げていない）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **332件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0920-1406.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406.md) | 09-20 14:06 | 【宣言】A の末尾の一文を数入りの字へ差し替える（v1456） |

<!-- 控えの一覧 ここまで -->
