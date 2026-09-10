# 公開の止まり-1（印 y0910-1330）

**終わり（残り2件）** — 公開側は追いついた。止まった段は**二つ**あり、どちらも塞いだ。
訴えが出なかった元は**三つ目の穴**（見張り側）で、これも塞いだ。

## 一、測った

| 何を | 実測 |
|---|---|
| 手元の `notices.json` | 40件・最新 `1789013433` ＝ **2026-09-10 13:10:33** |
| 公開側（直す前・pages と raw とも） | 40件・最新 `1788950681` ＝ **2026-09-09 19:44:41** |
| 食い違い | **16件**（下に題の一覧） |
| notify-record は書けていたか | **書けていた。** 16件とも手元の `notices.json` に入っている。**止まったのは押しの段** |
| 未 push の commit | 直す前 **1件**（`cb968e55` state.json）。いまは **0件** |
| `git-push.log` の失敗 | 09-09 20:01 以降 `notices` が **44行**。うち pathspec の誤りは **32行**（16回ぶん）で、初出は **09-10 00:53:47** |
| 20:01〜00:44 の内訳 | `state` 3823件・`usage` 108件・`notices` 6件（`.git` の壊れによる `index file corrupt` ／ `refs/heads/main cannot be resolved`） |

**公開に出ていなかった16件**

```
09-09 20:36:37  🪟 異常です（手が要ります）    y0909-1921 にヨシ。土台の直し-1 の宣言…
09-09 21:01:02  😺 現在も順調にゃ              状態: 手待ち
09-09 21:10:07  ✅ 終わりました                y0909-1921 にヨシ。土台の直し-1 の宣言…
09-10 00:43:19  🔎 調べました                  以上
09-10 00:45:38  ✅ 終わりました                写せます（40件）
09-10 00:53:39  🙋 ヨシしてください            一分おきの走り出し-1
09-10 01:10:25  🪟 連携に訴えがあります        subj-gap
09-10 01:38:27  ✅ 終わりました                一分おきの走り出し-1-2
09-10 09:00:20  😺 現在も順調にゃ              状態: 手待ち
09-10 09:39:13  🪟 異常です（手が要ります）    Capture the before answers が13時間…
09-10 09:54:38  🕒 延びています                Capture the before answers
09-10 09:56:02  ✅ 終わりました                Capture the before answers が13時間…
09-10 10:18:08  ✅ 終わりました                写せます（2件）
09-10 10:47:03  🕒 延びています                Claude Code が落ちたので開き直した
09-10 13:09:02  🙋 ヨシしてください            承認の足止めと自動モードの戻し道
09-10 13:10:33  ✅ 終わりました                写せます（1件）
```

## 二、止まった段（三つの穴）

**① `git add` が丸ごと止まる** — `notify-record.ps1` は「消した写し（`notices-*.json`）」の名も
commit の道に混ぜる（公開側からも消すため）。ところが commit が一度でも落ちると、その写しは
**追跡されないまま**次の巡回で消される。以後 `git add` が
`fatal: pathspec … did not match any files` で**丸ごと**止まり、何も staged されない。

**② 失敗を成功として飲み込む** — 続く `git commit -- <道>` は終了コード **1** を返す。
ところが 1 は「commit するものが無い」と**同じ番号**で、`git-push.ps1` の
`if ($cc -eq 1) { return 0 }` が**成功として返していた**。呼ぶ側は届いたと思い、
訴えも出ない。この二つが噛み合って**17時間半**、静かに止まり続けた。

**③ 見張りの `pub-late` が、開設以来一度も出ていなかった** — `pipe-check.ps1` ③ の
`@( … | ConvertFrom-Json )`。**PS5.1 の `ConvertFrom-Json` は配列を一つの物のまま流す**ので、
`@()` は「40件の配列」を**一件**として包む。Sort も Select も素通りし、
`[int64]$x.time` に `Object[]` が渡って落ち、`catch { }` が黙って飲む。
`pipe-warn.log` に `pub-late` の行は **0件**（開設以来）。

### 塞ぎ

| ファイル | 直し | 検査 |
|---|---|---|
| `git-push.ps1` | ①追跡もされず実体も無い道は渡す前に落とす（一覧は `ls-files` で**一度だけ**引く）／②終了コード1でも `origin/main..HEAD` が残っていれば押す | err=0・227行・BOM有・写し `.bak-20260910a` |
| `pipe-check.ps1` | ③一度変数へ受けてから配る（③と、同じ穴の 371行目の札めぐりも）。読めなかった回は `pub-read` で訴える | err=0・534行・BOM有・写し `.bak-20260910a` |

**札の中身は作り直していない。**手元にあった16件を、書き換えずそのまま押しただけ
（commit `6439015a`）。

## 三、訴えの条件（押しの黙り-1 の理由が確定した）

**足す条件は既にあった。効いていなかっただけ。** `$STALE_PUB_MIN = 20`
——「公開側の最新の札が、**手元の最新の札より** 20分以上古ければ訴える」。③を直した今、
初めて働く。

**値は 20分のまま。理由** … 札は書かれた直後に押されるので、20分の遅れは巡回20回ぶんの
連続失敗＝明らかな異常。raw の反映が押しから約5分遅れることを踏まえても4倍の余裕がある。

**絶対の刻（「最後の札から何時間」）にはしない。** 実測で、静かな夜の間隔は
**最大 19時間16分**（09-08 01:04→20:20）、90%点でも 216分ある。絶対値にすると
**毎晩鳴って読み飛ばされる**。手元との**差**で測る形なら、静かな時間は手元も進まないので
誤報にならない。

＊書く側ごと止まった形（手元も進まない）は、この条件では拾えない。そちらは既にある
`state-stale`（公開側の生存が45分）と `hook-quiet`（hook.log が25分）が受け持つ。

## 四、直した後の実測（取り置きを破る印つき）

| 読み先 | 刻 | 件数 | 最新の札 |
|---|---|---|---|
| `raw.githubusercontent.com/…/notices.json?_chk=…` | 13:31 | **40件** | **1789013433 ＝ 2026-09-10 13:10:33** |
| `kfsr148-art.github.io/…/notices.json?_chk=…` | **13:33:51** | **40件** | **1789013433 ＝ 2026-09-10 13:10:33** |

直した式を手で回すと `local=1789013433 pub=1788950681 gap=1046分` と出る（直す前は
ここで落ちて `$null` になり、`$null -ge 20` が偽になって黙っていた）。

## 別に見つけた一件（直していない）

**押しの錠の名が食い違っている。** `git-push.ps1:150` だけ `'LocalClaudeGitPushGate'` で、
`push-mine.ps1:24` と `heavy-push.ps1:52` は `'Local\ClaudeGitPushGate'`。
**別々の錠**なので、常駐の押しと手押し／重い押しは**互いに待たない**。
2026-09-04 の「24.7分の詰まり」の直しが、半分しか効いていない。作法34（`\` が食われる）の型。
**今回の止まりとは別筋なので触っていない。**直すなら一語。

## 残り

`残り2件` — ①承認の足止め-1 ③（読むだけを一本にまとめる／自動モードの裁定待ち）、
②上の錠の名の食い違い（裁定待ち）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **192件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`終わりの札-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2.md) | 09-08 20:03 | 終わりの札-2 — 終わりの札が立たない根を直す |

<!-- 控えの一覧 ここまで -->
