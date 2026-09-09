# 一分おきの走り出し-1-2 — 甲で直した。作り値は三通りとも一本

> **状態 … 終わり（残り0件）／VAIO 01:31**
>
> **一行 … `inbox-watch.ps1` L373 に `Trim()` を一行。鍵は作るときに一度だけ整える形にした。
> 作り値は三通りとも「鍵が毎回同じ・走り出し一本」。塞ぎは解いた。
> .git の壊れで公開へ出ていなかった commit は**1件だけ**で、いまは出ている。**

---

## ① 裁定＝甲を実装した

`inbox-watch.ps1` **L373**（件名を作り終えた直後）に一行。

```powershell
if ($ordMark) { $ordMark = $ordMark.Trim() }
```

- **鍵は作るときに一度だけ整える。** 乙（突き合わせの前に両側で Trim）は採らない——
  直す先が二箇所に増え、次に鍵を使う所が増えたときに**また片方だけ抜ける**。
- 印の枝（`^印[:：]\s*(\S+)`）は空白を含まないので、ここを通っても値は変わらない。
- **常駐を起こし直した**（作法29⑤）… pid 2880・起動 **01:25:32** ＞ 台本の更新 **01:22:00**・本数 **1**。
- 構文 … `inbox-watch.ps1` err=0・**977→988行**・BOM有。

## ② 作り値で検収（三通り × 5巡）

本物の行を**字面のまま**抜き出して回した（`P0`〜`P5`＝inbox-watch／`Q1`〜`Q2`＝watch-notify）。
**送り手は偽物**——本物の ntfy は一度も叩いていない。写しは検査のあと消した。

| 件名の形 | | 鍵が毎回同じか | 開始の刻が同じか | 走り出し |
|---|---|---|---|---|
| **甲** 24字目が空白 | 直す前 | **いいえ（5通り）** | **いいえ（5通り）** | **5本** |
| | **直した後** | **はい** | **はい** | **1本** |
| **乙** 空白で終わらない | 直す前 | はい | はい | 1本 |
| | **直した後** | **はい** | **はい** | **1本** |
| **丙** 末尾が「以上」 | 直す前 | はい | はい | 1本 |
| | **直した後** | **はい** | **はい** | **1本** |

＊「直す前」は、直した本文から**足した一行だけを抜いた**もの。ほかは一字も違わない。
＊甲の鍵（直した後・5巡とも同じ）… `undef/y0909-1921 にヨシ。 土台の直し-1/1788969618`

## ③ 走り出しの口の塞ぎを解いた

| 外したもの | 刻 | 構文 |
|---|---|---|
| `watch-notify.ps1` の関門 | 01:25:52 | err=0・**2909行**・BOM有 |
| `heavy-gate.ps1` の旗 | 01:25:52 | err=0・**175行**（元と同じ）・BOM有 |

**シムの残りは0件**（`塞いである` / `startGag` とも該当なし）。

## ④ 解いた後の五分

**01:25:52〜01:30:52 の走り出し ＝ 0本。**

これが**正しい回数**である理由 … 走り出しは `if ($key -like 'run:*')` の中でしか鳴らない。
この五分のあいだ鍵は **`wait:y0910-0052` のまま**で、`run:` に入っていない。
**実地の一本は、次に鍵が `run:` になる回に出る。**
一本だけであることは②の作り値（本物の行・三通りとも1本）で出してある。

## ⑤ .git の壊れの後始末

**公開へ出ていなかった commit は 1件だけ。**

| commit | 刻 | 題 |
|---|---|---|
| `17126021` | 2026-09-09 20:01:35 | **state.json：いまの様子を更新** |

- **20:01:35 〜 00:57:12 のあいだの commit は 0件。** 帳面が壊れていたので、
  そもそも commit そのものができなかった（`git` が exit 128 で落ちる）。
  よって**取りこぼしはこの1件だけ**で、いまは `origin/main` の歴史に入っている。
- 壊れていた間の押しの失敗 … **723件**（09-09 20:01〜09-10 00:52・18秒ごと）。
  直したあとは **01:26:45 に HTTP 200** で復旧している。
- 遠隔は `584e72f4` まで出ていた（20:01:03 の押しは通っていた）。落ちたのは**その次の一本**。

---

## 残り

`orders-open.tsv` の未了 … **残り0件**（①〜⑤とも済）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **190件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0910-0052-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052-2.md) | 09-10 01:30 | 一分おきの走り出し-1-2 — 甲で直した。作り値は三通りとも一本 |
| [`y0910-0052.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052.md) | 09-10 00:56 | 一分おきの走り出し-1 — 口を塞いだ。原因は**件名の末尾の空白** |
| [`ヨシの猫の組み直し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E7%B5%84%E3%81%BF%E7%9B%B4%E3%81%97.md) | 09-09 19:26 | ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる** |
| [`ヨシの猫のマス目.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E3%83%9E%E3%82%B9%E7%9B%AE.md) | 09-09 16:38 | ヨシの猫を差し替え-1 — マス目の割り出しと、箱を上げる案 |
| [`土台の直し-1の四段.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%9B%9B%E6%AE%B5.md) | 09-09 13:02 | 土台の直し-1 ① — 四段の材料の出どころ（名指しの一覧） |
| [`ヨシの猫を差し替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%82%92%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88-1.md) | 09-09 13:02 | ヨシの猫を差し替え-1 — 素材を測った。**輪郭が潰れるので止まる** |
| [`巡回の止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-09 12:16 | 巡回の止まり-1 — 11:02〜11:45 の43分 |
| [`土台の直し-1の材料.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E6%9D%90%E6%96%99.md) | 09-09 11:59 | 土台の直し-1 ① — 切り候補の四段は、いまどこから値を取っているか |
| [`猫を全部白へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%82%92%E5%85%A8%E9%83%A8%E7%99%BD%E3%81%B8-1.md) | 09-09 11:06 | 猫を全部白へ-1 — 頭の猫が地に沈む件（全状態） |
| [`黒猫の待機-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-3.md) | 09-09 09:54 | 黒猫の待機-3 — ヨシ待ちの猫を白から黒へ戻す |
| [`土台の直し-1の宣言.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%A3%E8%A8%80.md) | 09-09 05:55 | 土台の直し-1 — 宣言（ヨシ待ち） |
| [`serifuの再抽出.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/serifu%E3%81%AE%E5%86%8D%E6%8A%BD%E5%87%BA.md) | 09-09 04:50 | serifu.txt / serifu-adv.txt の再抽出（作法17） |
| [`兎の台詞-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E5%8F%B0%E8%A9%9E-1.md) | 09-09 03:27 | 兎の台詞-1（出し直し）— serifu.txt の中の兎 |
| [`写しの重さ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%87%8D%E3%81%95-1.md) | 09-08 22:26 | 写しの重さ-1 — note-at-stop.txt は帳面として太るか |
| [`取り残しの検収-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97%E3%81%AE%E6%A4%9C%E5%8F%8E-1.md) | 09-08 22:03 | 取り残しの検収-1 |
| [`前の仕事の取り残し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%89%8D%E3%81%AE%E4%BB%95%E4%BA%8B%E3%81%AE%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97.md) | 09-08 21:15 | 前の仕事の取り残し — 次の指示が先に来た回の落ち |
| [`終わりの札-2の検収.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2%E3%81%AE%E6%A4%9C%E5%8F%8E.md) | 09-08 20:28 | 終わりの札-2 の検収と、窓の幅の裁定材料 |
| [`終わりの札-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2.md) | 09-08 20:03 | 終わりの札-2 — 終わりの札が立たない根を直す |
| [`止まりの見分け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AD%A2%E3%81%BE%E3%82%8A%E3%81%AE%E8%A6%8B%E5%88%86%E3%81%91-1.md) | 09-08 19:03 | 止まりの見分け-1 — 生存が書かれないのに「作業中」が延び続ける件 |
| [`猫の矛盾-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E7%9F%9B%E7%9B%BE-1.md) | 09-08 11:18 | 猫の矛盾-1 — 走っているのに頭の猫が寝ている件 |

<!-- 控えの一覧 ここまで -->
