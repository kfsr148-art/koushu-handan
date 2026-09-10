# 読むだけの台本と、公開の止まりの割り直し（印 y0910-1305-2）

**終わり（残り1件）** — `look.js` を置いて allow へ入れた。公開の止まりは、いま**両側とも動いている**。

## 一、読むだけを一本にまとめた（承認の足止め-1 ③）

`.claude/look.js`（246行・`node --check` 通過）。**書かない・消さない・押さない。**殻を通さず、
git は読む下位命令だけを白名簿で通す。

| 役 | 何をする | 代わりになる形 |
|---|---|---|
| `ls <道> [型] [--n=]` | 名・大きさ・更新時刻（新しい順） | `cd … && ls -la … \| sort \| head` |
| `read <道> [始まり] [行数]` | 行番号つきで読む | `cat` / `head` / `sed -n` |
| `tail <道> [行数]` | 末尾 | `tail -n` |
| `find <字形> <道…> [--i] [--n=]` | 行番号つきの当たり（folder は潜る） | `grep -rn` |
| `stat <道…>` | 大きさ・行数・更新時刻・**BOM の有無** | `ls -la` ＋ `od -An -tx1` |
| `git <読む下位命令> …` | status / log / diff / show / rev-list / ls-files ほか16種 | `git …` |
| `get <url> [--max=]` | **取り置きを破る印（`?_chk=<刻>`）つきの GET** | `curl` / `Invoke-WebRequest` |
| `json <道 か url> <op> [欄]` | count / keys / max / min / **newest** | `node -e "…JSON.parse…"` |

**allow へ入れた形** — `.claude/settings.json` の allow に二項（18件 → **20件**）。

```
"Bash(node .claude/look.js)",
"Bash(node .claude/look.js *)"
```

**呼ぶときの決まり** … `cd` も `|` も `&&` も付けない。付けると下位命令ごとの照合で外れ、
また訊かれる。道は台本の側が `~` を開くので、`node .claude/look.js tail ~/.claude/pipe-warn.log 20`
のまま通る。

**残る穴（名指し）** … 書く手（`Write`/`Edit` は別項で allow 済み）・`check.js` などの重い検査・
`git commit`/`push`・その場かぎりの `node -e` は、**今までどおり訊かれる**。読むだけを一本に
寄せただけで、書く側は寄せていない。

## 二、公開の止まりの割り直し（実読み）

**押しの経路も、書く側も、いまは動いている。**

| 見た物 | 実測（15:00〜15:02） |
|---|---|
| 手元 `notices.json` | 40件・最新 `1789015228` ＝ **13:40:28**（更新 13:40:30） |
| 公開 `notices.json` | 40件・最新 `1789015228` ＝ **13:40:28**（**差 0秒**） |
| 公開 `state.json` | `at` ＝ **14:56:57**（生きている） |
| 未 push の commit | **0件** |

**13:40 以降に札が無いのは、立てる出来事が無かったから。**13:09（🙋）・13:10（✅）・13:40（🪟）の
三枚とも公開へ出ており、**新しい札は運ばれている**。

## 三、ただし、直した直後に一つ出ていた（もう消えている）

13:40 の札は `🪟 連携に訴えがあります（pub-read）`——**こちらが足した訴え**が鳴ったもの。
中身を読むと原因が書いてあった。

```
pub-read … 公開側の遅れを見張れない：':' または '}' ではなく無効なオブジェクトが渡されました。(65): [
    { "title": "笨・邨ゅｏ繧翫∪縺励◆…
```

**`curl | Out-String` が、機械の文字の種別（CP932）で受けていた。**札の本文は日本語なので
化け、化けた先に JSON を壊す字が混じって `ConvertFrom-Json` が投げる。**もとの `catch { }` は
これを黙って飲んでいた**——`pub-late` が開設以来0件だった、もう一つの元がこれ。

**直し** … `curl -o <控え>` で落として `Get-Content -Raw -Encoding UTF8` で読み直す
（`pipe-check.ps1`・err=0・545行・BOM有）。

**実測で消えた** … `pipe-warn.log` に `2026-09-10 15:00:19  ok  訴えは無くなった`。

## 残り

`残り1件` — 押しの錠の名の食い違い（`git-push.ps1:150` だけ `'LocalClaudeGitPushGate'`、
`push-mine.ps1` と `heavy-push.ps1` は `'Local\ClaudeGitPushGate'`）。裁定待ちで、まだ触っていない。

＊余談ながら、この回も**作法34 の穴を踏んだ**。`look.js` へ「値0の字」を書き込もうとしたら
`\` が一枚食われて**生の制御文字**が入り、`grep` が「Binary file」と言い出した。
`String.fromCharCode(92)` で組み直して直した（値0の字は0件・`node --check` 通過）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **193件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0910-1305-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-2.md) | 09-10 15:04 | 読むだけの台本と、公開の止まりの割り直し（印 y0910-1305-2） |
| [`y0910-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1330.md) | 09-10 13:36 | 公開の止まり-1（印 y0910-1330） |
| [`y0910-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305.md) | 09-10 13:09 | 承認の足止めと自動モードの戻し道（印 y0910-1305） |
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

<!-- 控えの一覧 ここまで -->
