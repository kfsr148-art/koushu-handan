# 機械の詰まり-1 — 現場を押さえる手を入れ、押す者を一度に一人にした

**状態：終わり（④の数えは明日）／本体・`panel.html`・見張りの判定や札の作りには触っていない**

**但し書きのとおり、直したのは二つだけ。**
①固まりの現場を記録する手を足した ②押す処理の同時に走る数を絞った。
**作りを変える案は下の「report して止めた案」に書き、実装していない。**

---

## ① 負荷とプロセスの記録 — **五度とも残っていなかった**

`watch-status.log` が毎分残しているのは
「鍵／プロセス数／窓／迷子／隠れ戻し／生存／最後の状態」だけで、
**CPU・メモリ・ディスクも、走っていたプロセスの一覧も無い**。
12:22／13:46／15:34／17:46／01:49 のいずれについても**出せない**。

**そこで、次の固まりで現場を押さえる手を先に入れた。**

`~/.claude/jam-watch.ps1`（新しい仕事 `ClaudeJamWatch`・毎分・上限2分・多重は Parallel）

- 足跡（`watch-step-log.txt`）を**外から読むだけ**。見張りには触らない
- 最後の段が「完了」でなく、そこから **90秒**たっていれば「詰まり」とみなす
- そのとき **CPU ／ 空きメモリ ／ ディスクの忙しさ ／ 重いプロセス上位8 ／ 顔ぶれの本数**を
  `jam-snap.log` へ一枚だけ書く（**同じ詰まりで何枚も撮らない**）

**作り値（四通り）**

```
(甲) 最後が「完了」（300秒前）      → 撮らない
(乙) 途中の段のまま300秒            → **撮った（11行）**
(丙) 同じ詰まりで二度目             → 撮らない
(丁) 途中の段だが30秒               → 撮らない
```

**試しに撮れた一枚（詰まっていない平常時でもこれだけ出る）**

```
全体 : CPU 77.4% ／ 空きメモリ 591MB ／ ディスク 103.8%
重い : claude pid=12224 CPU秒=52495 メモリ=553MB
       explorer / remoting_host / claude(2本目) / conhost / svchost …
顔ぶれ : claude=2 / msedge=5 / powershell=4 / conhost=6
```

**空きメモリ 591MB・ディスク 100%超・msedge が5本**。
これが平常時の姿なので、**固まりの帯ではもっと悪い**と見てよい。

## ② なぜ「知らせの判定を終えた」の直後に集中するのか

その前後で走るものを、字面で並べるとこうなる。

| 段 | その段が起こすもの |
|---|---|
| 知らせの判定を終えた | 札を控える（`notify-record.ps1`）→ **git add / commit / push**（`status.md`・`notices.json`・名つきの写し）／公開側に出たかを **curl で数回** |
| **↓ その直後** | |
| 使用量を終えた | 使用量を **curl**（25秒の上限）→ **git add / commit / push**（`usage.json`） |

**一つの巡回のうちに、網ごしの押しが二度走る。** しかも押す者は全部で四人
（`board` ／ `notices` ／ `ntfy-sent` ／ `usage`）で、**互いに順番が無かった**。
上限つきの最悪値を足すと push まわりだけで 105秒、curl を足して 130秒。
**固まりがこの継ぎ目に出るのは、ここが一巡回でいちばん重いから。**

## ③ 直し — 押す者を一度に一人にする

`git-push.ps1` の `Git-CommitPush` を、名前つきの錠（`Local\ClaudeGitPushGate`）で囲った。

- 押すのは**一度に一人**。待つのは最大 **45秒**
- 取れなければ**この回は見送り**、次の回が出し直す（呼ぶ側はもともと「届かなかった」を扱える）
- 錠は `add` / `commit` も含めて掛ける（commit だけ先に走ると、待っている側が枝ごと運んでしまう）

**判定も札の作りも変えていない。順番を付けただけ。**

**作り値**

```
ひとり目が掛かった時間 : 6.9秒（add/commit/push で 2秒×3）
ふたり目が掛かった時間 : 11.3秒   ← ひとり目のぶんだけ待たされている
```

## ④ 数えの起点（明日、これと比べる）

```
2026-09-03  巡回 773回 ／ 3分以上の穴 36 ／ 5分以上 25 ／ 最長 17.6分
2026-09-04  巡回 301回 ／ 3分以上の穴  7 ／ 5分以上  4 ／ 最長 20.4分（06:05 時点）
```

**明日、同じ数え方で並べて報告する。**

## report して止めた案（実装していない）

但し書きにより、**作りを変える案はここに書くだけ**にした。

1. **一巡回で押すのは一度だけにする**（notices と usage を別の回へ分ける）。
   いまは同じ回で二度押している。分ければ継ぎ目の重さが半分になるが、
   **知らせが出るまでの間が延びる**ので、判定の作りに関わる。
2. **公開側に出たかの確かめ（curl の粘り）を、押しの回から外す**。
   いまは押した直後に数回叩いている。別の回へ回せば巡回は軽くなるが、
   **札と押し送りの順の担保**が変わる。
3. **検査のブラウザを絞る**。`msedge` が5本残っていた。
   `panel-check` は視野ごとに一枚起こすので、同時に走る数を1本へ絞れば軽くなる。
   ＊これは「同時に走る数を絞る」に当たるので**やってよい側**かもしれないが、
   　検査の作りに触るため、いったん止めて伺う。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **129件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`パネルの色-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E8%89%B2-1.md) | 09-02 16:33 | パネルの色-1 — 終了予定の刻だけを明るい水色にした（panel v108） |
| [`終わりの黙り-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E9%BB%99%E3%82%8A-4.md) | 09-02 16:06 | 終わりの黙り-4 — 写せます（ready）を、終わりと同じ道へ乗せた |
| [`仕事の数え方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BB%95%E4%BA%8B%E3%81%AE%E6%95%B0%E3%81%88%E6%96%B9-1.md) | 09-02 14:40 | 仕事の数え方-1 — 生存確認を仕事に数えない。**できる。狭く取れば当てられる** |

<!-- 控えの一覧 ここまで -->
