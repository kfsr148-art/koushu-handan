# 機械の詰まり-1（数え）— 夜は明確に減った。残っているのは**こちらが検査を回している帯**

**状態：終わり（台帳の2件とも済）**

---

## ① 見張りの×-1-④ — 二回とも○

```
2026-09-04 21:02:05  😺 現在も順調にゃ   見張り: 生存○ 見張り○ 片付け○ 受信箱○
2026-09-05 09:01:51  😺 現在も順調にゃ   見張り: 生存○ 見張り○ 片付け○ 受信箱○
```

**×2147946720 は再発していない。** 済にした。

## ② 固まりの回数（同じ数え方＝巡回の「開始」どうしの間隔）

| 日 | 数えた範囲 | 巡回 | 3分以上の穴 | 5分以上 | 最長 | 1時間あたり |
|---|---|---|---|---|---|---|
| **09-03** | 全日（当時の実測） | 773回 | **36** | **25** | **17.6分** | **2.79** |
| **09-04** | **15:06〜23:59** | 497回 | **3** | **0** | 4.9分 | **0.34** |
| **09-05** | 00:00〜09:35 | 527回 | **2** | **0** | 3.4分 | **0.21** |

**5分以上の穴は 25 → 0 → 0。1時間あたりは 2.79 → 0.34 → 0.21（八分の一以下）。**

### ただし、数えられていない帯がある（正直に）

足跡（`watch-step-log.txt`）は**行数で古い分を落とす**ので、いま残っているのは
**09-04 15:05 以降だけ**。**09-03 は一行も残っていない**——上の 09-03 の数字は、
09-04 06:05 にこちらが数えて控えた値である（作り直せない）。

**そして 09-04 の日中（15:05 より前）には、いまも詰まりが起きていた。**
撮る手（jam-watch）が二回、現場を押さえている。

```
12:30:18  詰まり  339秒（段：知らせの判定を終えた）
12:58:39  詰まり 1482秒（＝24.7分・段：知らせの判定を終えた）
```

**この二回は上の表の「09-04」には入っていない**（数えた範囲の外）。

## 撮れた現場 — 根はまだ残っている

```
=== 2026-09-04 12:30:18  詰まり 339秒（段：知らせの判定を終えた） ===
  全体 : CPU 53.9% ／ 空きメモリ 758MB ／ **ディスク 482.7%**
  顔ぶれ : claude=2 / **msedge=5** / **git=3** / powershell=4 / conhost=8
```

**ディスクが 482.7%**（待ち行列が深い）。**msedge が5本**（検査の headless）、**git が3本**。
時刻の 12:24〜12:58 は、こちらが `panel-check` を回し、`git push`（pre-push の検査つき）を
走らせていた帯そのもの。

**入れた錠は、常駐どうしの押し（`Git-CommitPush`）しか揃えていない。**
**こちらが手で打つ `git push` は錠の外**で、しかも pre-push の検査が
**この機械でいちばん重い仕事**（Edge を何枚も起こす）。**そこが残った根。**

## 撮る手の小さな傷（見つけたので書く）

12:30:18 の見出しが**二行**出ている。`jam-watch` を `Parallel` にしたため、
同じ秒に走った二本が**どちらも「まだ撮っていない」と読んでから**書いた。
中身は一枚ぶんなので読むのに支障は無いが、**見出しだけ重なる**。

## report して止めた案（実装していない）

- **検査のブラウザを一度に1本へ絞る**（いまは視野ごとに起こす）。
  「同時に走る数を絞る」に当たるので**やってよい側**に見えるが、**検査の作りに触る**ので伺う。
- **こちらの手押しも錠の内側に入れる**（`git push` の前に錠を取る）。
  同じく「同時に走る数」だが、**押しの経路を変える**ので伺う。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **132件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`機械の詰まり-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1-2.md) | 09-05 09:37 | 機械の詰まり-1（数え）— 夜は明確に減った。残っているのは**こちらが検査を回している帯** |
| [`矛盾の三つ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%9B%E7%9B%BE%E3%81%AE%E4%B8%89%E3%81%A4-1.md) | 09-04 12:31 | 矛盾の三つ-1 — 三つとも「材料を読む所」がずれていた |
| [`見張りの×-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%C3%97-1.md) | 09-04 10:09 | 見張りの×-1 — 「×2147946720」は死んでいた印ではなく、**その一分の起こしを見送った印** |
| [`機械の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-04 06:06 | 機械の詰まり-1 — 現場を押さえる手を入れ、押す者を一度に一人にした |
| [`数の不一致-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%95%B0%E3%81%AE%E4%B8%8D%E4%B8%80%E8%87%B4-1.md) | 09-04 01:24 | 数の不一致-1 — 三つを「写した印の無い、中身のある札の数」で揃えた（panel v116） |
| [`生存の途切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%94%9F%E5%AD%98%E3%81%AE%E9%80%94%E5%88%87%E3%82%8C-1.md) | 09-04 00:44 | 生存の途切れ-1 — 詰まった一本が10分ぶら下がり、次の刻が「見送り」で捨てられた |
| [`パネルの立て直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E7%AB%8B%E3%81%A6%E7%9B%B4%E3%81%97-1.md) | 09-03 21:30 | パネルの立て直し-1 — 開いた瞬間に「何が終わって何が待っているか」が読める形へ（panel v115） |
| [`読みの道-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-3.md) | 09-03 20:52 | 読みの道-3 — `latest-name.txt` を完全な URL 一行にした |
| [`読みの道-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-2.md) | 09-03 20:31 | 読みの道-2 — 名を変えた写しを置く（読む側が待たずに最新を取れる） |
| [`札の押し出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%BC%E3%81%97%E5%87%BA%E3%81%97-1.md) | 09-03 17:27 | 札の押し出し-1 — 🪟 が終わりの札を上書きしていた。二枚とも立てる形にした |
| [`巡回の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-03 16:02 | 巡回の固まり-2 — 止まっていたのは「使用量の段」。上限の無い呼び出しが一つあった |
| [`写しの一本化-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E6%9C%AC%E5%8C%96-1.md) | 09-03 15:17 | 写しの一本化-1 — 押す所を一つにした（panel v114） |
| [`通しの試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E3%81%97%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-03 13:28 | 通しの試験-1 — 小さな仕事を一つ流して、端から端まで見届けた |
| [`板の欠け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9D%BF%E3%81%AE%E6%AC%A0%E3%81%91-1.md) | 09-03 12:03 | 板の欠け-1 — 公開側の `board.json` は無事だった。消えていたのは**手元の値** |
| [`写しの切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E5%88%87%E3%82%8C-1.md) | 09-03 10:03 | 写しの切れ-1 — 切っていたのは `buildBundle` ではなく、見張りの控えの読み手 |
| [`札の抜け-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2-2.md) | 09-03 06:43 | 札の抜け-2（続き）— 昨夜の直しは**一度も働いていなかった**。枝の順が原因 |
| [`通知の分け方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%88%86%E3%81%91%E6%96%B9-1.md) | 09-02 23:05 | 通知の分け方-1 — 長い報告は ntfy へ送らない。札にして、釦で一枚で写す |
| [`札の抜け-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2.md) | 09-02 22:55 | 札の抜け-2 — 取り逃がした stop を拾い直す（終わりの札を運任せにしない） |
| [`通知のコピー-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC-1.md) | 09-02 19:48 | 通知のコピー-1 — 送った本文を「まとめて写す」と同じ形で写せるようにした（panel v111） |
| [`読み口の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E5%8F%A3%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-02 17:52 | 読み口の詰まり-1 — `?_t=` は CDN に効いていない。遅れの正体は Pages の配り直し |

<!-- 控えの一覧 ここまで -->
