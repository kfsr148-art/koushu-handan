# 押しの敷居-2

**終わり（残り0件）** — 2026-09-18（VAIO）。本体・`check.js`・`adv-check.js` には触っていない。
敷居を **軽い側 768→500MB／重い側 1536→1024MB** へ下げ、作り値八通りで通した。

## ① 今日の見送りは3回。下げた敷居なら **2回減っていた**

今日の押し **179回**のうち、空き不足で見送ったのは **3回**（どれも軽い側）。

| 刻 | そのときの空き | 敷居768MB | **敷居500MB** |
|---|---|---|---|
| 01:47:38 | **712MB** | 見送り | **押せた** |
| 08:23:17 | **358MB** | 見送り | 見送り（変わらず） |
| 18:40:46 | **668MB** | 見送り | **押せた** |

**3回中2回が減る。** 残る一回（358MB）は、ほんとうに空きが乏しかった刻。

**重い側（1536MB）の見送りは、記録に一度も無い**（`git-push.log` 全期間で0件）。
だから 1536→1024 で今日減る回は **0回**——**将来の重い押しに備えて余裕を残したまま下げる**だけの直し。

＊見送りの数は日によって大きく違う（09-12 は75回、09-13 は8回、09-14 は11回）。
　09-12 のような日なら、500MB の効きはもっと大きく出る。

## ② 押し一回が実際に使う量 … **git-remote-https 最大9MB／git 合わせて最大26MB**

こちらから空の押しを一本起こし、0.5秒ごとに測った（22回捕まえた）。

```
21:59:07  git-remote-https  9MB  git 24MB  5本  空き 1066MB
21:59:09  git-remote-https  9MB  git 19MB  4本  空き 1005MB
21:59:12  git-remote-https  9MB  git 19MB  4本  空き 1010MB
  いちばん高い … git-remote-https 9MB ／ git（合わせて）26MB
  押しの間の空きの底 … 998MB
```

**押し一回で乗るのは 35MB ほど。** 500MB の敷居に対して**14倍**の余裕がある。
しかも押しの最中の空きの底は **998MB** で、**元の768MBすら割っていなかった**——
768／1536MB は実測の **30〜40倍**の余裕で、守っている物に見合っていなかった。

## ③ 手元でフル版を起こす枝 … **台本には無かった**。決めのほうを直した

探した結果、**手元でフル版を起こす枝は一つも無い**。

| 見た所 | 中身 |
|---|---|
| `.githooks/pre-push` | **構文検査だけ**（`node --check`）。画面の実測は既に雲へ移してある |
| `~/.claude/git-push.ps1`／`heavy-on.ps1`／`inbox-watch.ps1`／`sweep-checks.ps1` | `check-all` の字はあるが**すべて註**（走らせる行は無い） |

**手元でフル版を回させていたのは `CLAUDE.md` の作法18 の決めだった。** そこを直した。

```
（前）フル版を回すのは、台詞を触った回・レイアウトを触った回・まとめ報告の前
（後）手元で回すのは速い版だけ。フル版は手元で起こさない。雲（check.yml の check の段）に任せる
（前）フル版は Start-Process で切り離して回す
（後）（廃止）手元では回さないので要らない。字は残す
（前）本体の工事は、フル版が通るまで commit しない
（後）本体の工事は、速い版が通るまで commit しない
      ＊フル版は押した後に雲が回す。落ちれば配信が止まるので、通らない版が公開へ出ることはない
```

**通らない版が世に出ない仕掛けは変わっていない** … `check.yml` の `deploy` は `check` の後段で、
本体の回は check が success の回だけ配信する。

## ④ 作り値（八通り・本物の押しは叩いていない）

本物の `git-push.ps1` から「敷居を決めて見送る枝」を字面のまま切り出し、作り値の空きへ当てた。

| 場合 | 側 | 敷居 | 空き | 結果 |
|---|---|---|---|---|
| イ 今日 01:47 の回 | 軽い | 500MB | 712MB | **押す** ✔ |
| ロ 今日 18:40 の回 | 軽い | 500MB | 668MB | **押す** ✔ |
| ハ 今日 08:23 の回 | 軽い | 500MB | 358MB | 見送る ✔ |
| ニ ちょうど500MB | 軽い | 500MB | 500MB | 押す ✔ |
| ホ 499MB | 軽い | 500MB | 499MB | 見送る ✔ |
| ヘ 重い側・1024MB | 重い | 1024MB | 1024MB | 押す ✔ |
| ト 重い側・1023MB | 重い | 1024MB | 1023MB | 見送る ✔ |
| チ **軽い物に本体が一つ混ざる**・800MB | **重い** | 1024MB | 800MB | 見送る ✔ |

**チが要** … 混ざる押しは今までどおり重い側で扱う（二段の決めは崩していない）。

## 触った所と触らない所

**触った所** … `~/.claude/git-push.ps1` の敷居の一行と註（写し `.bak-20260918`・構文検査 OK）／
`CLAUDE.md` の作法18 の三箇所。

**触らない所** … 本体（`koushu-handan.html`）・`check.js`・`adv-check.js`・`check-all.js`・
`.github/workflows/check.yml`・`.githooks/pre-push`（構文検査のまま）・
`$SMALL_WHO` と `$LIGHT_NAMES` の名簿・押し直しの印（`push-pending.tsv`）・
譲りの敷居700MB・見張りの段・記録の過去の行。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **273件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0918-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2155.md) | 09-18 22:02 | 押しの敷居-2 |
| [`y0918-2145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2145.md) | 09-18 21:47 | 空きの片付け-2（後の測り） |
| [`y0918-2109.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2109.md) | 09-18 21:12 | 空きの片付け-2 |
| [`y0918-2055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2055.md) | 09-18 21:01 | 空きの内訳-2 |
| [`y0918-2049.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2049.md) | 09-18 20:53 | 鍵切れの見張り-1 |
| [`y0918-2035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2035.md) | 09-18 20:38 | 配信の譲り-1（乙・通し切る形へ） |
| [`y0918-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1953.md) | 09-18 20:00 | 配信の譲り-1 の下調べ |
| [`y0918-1923.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1923.md) | 09-18 19:24 | 公開の追いつき-1 |
| [`y0918-1846.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1846.md) | 09-18 19:05 | 起こしの重なり-1（乙・刻をずらす） |
| [`y0918-1831.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1831.md) | 09-18 18:35 | 起こしの重なり-1 の下調べ |
| [`y0918-1757.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1757.md) | 09-18 17:59 | 空きの片付け-1 |
| [`y0918-1747.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1747.md) | 09-18 17:50 | 空きの内訳-1 |
| [`y0918-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1305.md) | 09-18 13:06 | 軽い巡回の刻-1 |
| [`y0918-1221.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1221.md) | 09-18 12:24 | 止まりの読み-4 |
| [`y0918-0716.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0716.md) | 09-18 07:19 | 夜の較正-2 |
| [`y0918-0352.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0352.md) | 09-18 03:56 | 止まりの札の敷居-1 |
| [`y0917-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2140.md) | 09-17 21:35 | 呼び名の揃え-1 の下調べ |
| [`y0917-2122.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2122.md) | 09-17 21:25 | 問いかけの判じ-1 |
| [`y0917-2102.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2102.md) | 09-17 21:14 | 訴えの棚卸し-1 |
| [`y0917-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2050.md) | 09-17 20:52 | 古い字の掃除-2 |

<!-- 控えの一覧 ここまで -->
