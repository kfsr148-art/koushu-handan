# 一分おきの走り出し-1 — 口を塞いだ。原因は**件名の末尾の空白**

> **状態 … ヨシ待ち（印 `y0910-0052`）／VAIO 00:55**
>
> **一行 … 走り出しは塞いだ（五分で0件）。原因は「指示の頭24字」が今回ちょうど空白で終わったこと。
> 書くときは空白ごと書き、読むときに `.Trim()` が落とすので、控えの件名が永久に一致せず、
> 巡回のたびに開始の刻を打ち直していた。印は書かれていた——**鍵が毎回変わっていた**。**

---

## 一、いますぐ鳴る口を塞いだ

`watch-notify.ps1` の `Push-Ntfy` の**一行目**に、`start`（走り出し）だけを断る関門を入れた。

```powershell
if ($state -eq 'start') { Write-Self '押し送りはしない（走り出しは塞いである：2026-09-10…）'; return }
```

- **止めたのは走り出しの一種類だけ。** 終わり（`done`）・異常の一発（`bad`）・ヨシ待ち（`wait`）・
  超過（`over`）は今までどおり通る。
- 帯明けに鳴るもう一つの口（`heavy-gate.ps1` L129）も旗で塞いだ。控え（`$Held`）は今までどおり落とす。**鳴らさないだけ。**
- **この枠を受けたこと自体では鳴っていない**（下の実測のとおり、00:46:20 以降0件）。

## 二、止まったことの実測

| 見たもの | 値 |
|---|---|
| 塞ぐ前（00:26〜00:42） | 走り出し **17分で17件**（毎分1件） |
| 塞いだ後（00:46:20〜00:52:13・5分53秒） | 走り出し **0件** |
| `Push-Ntfy 'start'` の呼び出し口 | **L2253 の一箇所だけ**。関門（L648）は送る手より必ず前 |

＊**断り** … いまの仕事は件名が「以上」で、末尾に空白が付かない。**塞がなくても鳴らない回**なので、
この0件は関門だけの手柄ではない。関門そのものの足跡（`押し送りはしない（走り出しは塞いである…）`）は、
鍵が `run:` に戻る回に `watch-notify.log` へ出る。

## 三、原因（測って割れた）

### 印は書かれていた。書かれないのではなく、**鍵が毎回変わっていた**

| 問い | 答え |
|---|---|
| 印はどこに書かれるか | `~/.claude/start-pushed.txt`。書くのは `watch-notify.ps1` L2250 |
| いつ読まれるか | 同 L2221。**毎分の巡回で読み書きする** |
| 書かれていたか | **書かれていた。**00:43:15 の記録に `走り出しの印=undef y0909-1921 にヨシ。 土台の直し-1 1788968505…` |

印の鍵は「**形＋件名＋開始の刻**」。この**開始の刻**が毎回違っていた。

### 開始の刻が、巡回のたびに書き替わっていた

| 見たもの | 値 |
|---|---|
| `inbox-feed` が打った本当の開始 | **19:59:07**（1788951548） |
| 00:42:02 の印に入っていた刻 | **00:41:45**（1788968505）＝ **4時間42分ぶん進んでいる** |
| 書き替えの周期 | `inbox-watch` は**約18秒ごと**（00:37:35〜00:42:43 が18秒間隔）。`watch-notify` が毎分読むので**鳴るのは一分おき** |

### なぜ書き替わるのか — **24字目がちょうど空白だった**

`inbox-watch.ps1` が刻を打ち直す条件は L442 の「控えの件名 ≠ いまの件名」。ここが**常に真**になっていた。

| 段 | どうなっているか |
|---|---|
| 件名の作り方（L360） | 指示の**頭24字**を件名にする。`Substring(0,24)`——**Trim をしない** |
| 今回の指示 | `y0909-1921 にヨシ。 土台の直し-1 の宣言、…` の**24字目がちょうど空白** |
| 書くとき | `subj=y0909-1921 にヨシ。 土台の直し-1␣`（空白ごと書く） |
| 読み直すとき（L400） | `.Trim()` が末尾の空白を落とす → `…土台の直し-1` |
| 突き合わせ | **書いた値と読んだ値が永久に一致しない** → 毎回 `at=いま` を打ち直す |

実測（字面で確かめた）… 頭24字 `[y0909-1921 にヨシ。 土台の直し-1 ]`・長さ24・末尾が空白 **True**・Trim後と一致 **False**。

### 何本走っているか

| 数えたもの | 本数 |
|---|---|
| `inbox-watch` の常駐 | **1本**（pid 7032） |
| `claude` の窓 | **1本**（pid 10352） |

**二本以上は無い。止めたものは無い。**

## 四、直しは入れていない

③の答えが出るまで入れない、との指示どおり。入れたのは①の関門（口を塞ぐ）だけ。

＊直しの当ては二つある（**まだ入れていない**）——
（甲）件名を切るところで `Trim()` する（`inbox-watch.ps1` L360）、
（乙）突き合わせる前に両側を `Trim()` する（同 L442）。
**どちらを採るか、あるいは両方か**は裁定を待つ。

## 別件 — **git の帳面が壊れていた（20:01 から4時間50分）**

この件を調べる途中で見つけた。**直した。**

| 見たもの | 中身 |
|---|---|
| `.git/index` | 壊れていた（`bad signature 0x00000000`） |
| `.git/refs/heads/main` | **41バイトが全部 NUL**（枝そのものが読めない） |
| `.git/refs/remotes/origin/main` | 同じく全部 NUL |
| 時刻 | いずれも **2026-09-09 20:01**。落ち方は**書きかけで電源が飛んだ形** |

**直した手順** … reflog から本当の先端を拾い（`17126021`・20:01:35）、枝を戻し、index を HEAD から組み直し、
遠隔の枝は `fetch` で本当の値（`584e72f4`）に直した。**作業の木は一つも失っていない**（変更19件がそのまま残っている）。

＊**この壊れが、`状態の push が届かなかった（128）` を18秒ごとに出していた元。**
20:01 から自動押しが一つも通っておらず、**パネルも status も20:01で止まっていた。**

---

## 残り

`orders-open.tsv` の未了 … **残り0件**（①〜⑤とも済）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **189件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`終わりの札-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-1.md) | 09-08 09:40 | 終わりの札-1 — 終わった知らせが手元に残らない件 |

<!-- 控えの一覧 ここまで -->
