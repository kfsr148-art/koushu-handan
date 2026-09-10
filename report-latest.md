# 押しの黙り-1 — 押しの失敗と .git の壊れを訴えへ足した（印 y0910-1752）

**終わり（残り2件）** — 一〜四は済み。本番の巡回も新しい台本で通った（17:50:50・結果0・訴え0件）。

## 一、測った

| 何を | 実測 |
|---|---|
| 押しの失敗を書いていた場所 | **`~/.claude/git-push.log`**（`git-push.ps1` の `Git-Note`） |
| いま残っている範囲 | **09-09 23:09:54 から**。4000行を超えると2000行へ刈るので、**20:01〜23:09 の分はもう無い** |
| 23:09:54〜01:26:45 の中身 | 「push が通らなかった」**328回**／`index file corrupt` **977行**／`refs/heads/main cannot be resolved` **326行** |
| その記録を読む者 | **0**。台本の中で `git-push.log` を開く所は無い（`inbox-watch.ps1:593`・`notify-record.ps1:346` は註、`watch-notify.ps1:1009` は知らせの文面に名を出すだけ） |
| pipe-check が見ている種類 | cards-full・cards-read・topic・pub-late・pub-read・heavy-skip・state-stale・hook-quiet・retry・subj-gap・ask-note・ntfy-down・done-*・hold-stuck・clock-broken・hook-none。**押しの失敗は無い** |

### なぜ入っていなかったか

pipe-check は**結果（公開側に出ているか）だけ**を見る作りで、**原因（押し）は公開の遅れで間接に拾う**つもりだった。
その間接の二つが、どちらも役に立たなかった。

- **pub-late** … 配列の穴で**開設以来0件**（09-10 13:30 に直した）
- **state-stale** … **20:50:22 に一度だけ**出た（生存49分）→ 20:50:39 に一発。以後は「同じ種類が続く間は鳴らさない」で **01:10:19 まで黙った**。20:50:39 の一発が届いた跡は、残っている記録には無い

`git-push.ps1` の側は「記録に残して諦める（次の回が出し直す）」作りで、**訴えへ繋ぐ口がそもそも無かった**。

### 過去14日の帯

`git-push.log` は14日ぶん残っていないので、**origin/main と HEAD の reflog から組み直した**。
帯＝「通った push のあと commit が出たのに、次に通った push まで届かなかった区間」。

| | |
|---|---|
| 帯の数 | **3,135本**（通った push 3,233件・commit 3,510件） |
| 長さ | 中央 **0.1分**／90% 0.3分／**99% 13.7分**／99.9% 105.8分／最長 **217.4分** |
| 本数 | 5分以上 73本／10分以上 40本／15分以上 29本／**20分以上 19本**／30分以上 9本／60分以上 5本 |

**30分以上の帯（件数は押せなかった commit の数）**

| 始まり → 終わり | 長さ | commit |
|---|---|---|
| 09-04 09:22 → 13:00 | **217.4分** | 31件 |
| 09-07 08:46 → 10:46 | 119.6分 | 7件 |
| 09-06 22:15 → 09-07 00:13 | 117.7分 | 7件 |
| 09-07 18:18 → 20:04 | 105.8分 | 7件 |
| 09-08 01:39 → 02:39 | 60.1分 | 5件 |
| 09-07 13:12 → 13:59 | 46.9分 | 3件 |
| 09-07 11:14 → 11:49 | 34.4分 | 3件 |
| 09-02 14:41 → 15:11 | 30.4分 | 4件 |
| 09-03 06:44 → 07:14 | 30.2分 | 3件 |

＊今回の件は、**通った push が 09-09 20:00:14 → 09-10 01:01:38 の 301.4分空いた**形で出る。
　`.git` が壊れて commit もできなかったので、その間の commit は3件しかない。
＊**失敗か見送り（錠・重い帯）かは、ここからは分けられない。** 失敗の行が残っていないため。

## 二、塞いだ — ⑩ `push-fail`

**拾う条件（三つとも揃ったとき）**

1. 押していない commit が手元にある（`origin/main..HEAD` が1件以上）
2. その commit より後に、`git-push.log` へ失敗の行がある
3. 最初の失敗から **`$PUSH_FAIL_MIN` = 20分** を過ぎた

**20分の理由** — 14日の帯の **99%点が13.7分**。20分ならその上に余裕を取れ、`pub-late` と同じ物差しで並ぶ。

**鳴らし方は既にある一発の道のまま**（`pipe-warn-rung.txt`）。同じ種類が続く間は鳴らさない。
押しが通れば①が0になって種類が消え、控えから落ちる。次に落ちたらまた鳴る。
重い帯のあいだは、ほかと同じく `heavy-skip` へ回す。

出る一行の例（作り値）：

```
push-fail  押しが続けて失敗している（最初の失敗 17:19 から 30分・押せていない commit 1件・押しの失敗 4回）。直近：押し直しても通らなかった（1）。次の回に持ち越す
```

## 三、`.git` の壊れ — ⑪ `git-broken`（拾える）

**別の一行として足した。** git は起こさず、**ファイルの字面だけ**で見る。

| 見る所 | 正しい形 |
|---|---|
| `.git/index` の頭4バイト | `DIRC` |
| `.git/HEAD` | `ref: refs/heads/…`（NUL が無いこと） |
| `.git/refs/heads/main` | 40桁の十六進（ばらで無ければ `packed-refs` に在ること） |

**壊れている間は push-fail を出さない**（押し直しても通らないので、直す手が違う）。
字面そのものが読めなかった回は `git-read` の一行にする。

## 四、作り値の検収

写しを一時ディレクトリに作り、**送り手・押しを偽物へ差し替え**、仮の repo と偽の origin で回した。
本物への道が写しに残っていないことを確かめてから回し、**終わったあと写しごと消した**。

| # | 場面 | push-fail の一発（累計） | git-broken の一発（累計） | 控え（rung） |
|---|---|---|---|---|
| 0 | はじめ（押せていない commit なし） | 0 | 0 | — |
| 1 | 失敗が30分続く | **1** | 0 | push-fail |
| 2 | まだ続く（二度目） | **1**（鳴らない） | 0 | push-fail |
| 3 | 押しが通った | 1 | 0 | **外れた** |
| 4 | また落ちて25分 | **2**（また鳴る） | 0 | push-fail |
| 5 | 通った | 2 | 0 | 外れた |
| 6 | 失敗が10分だけ | 2（**鳴らない**） | 0 | — |
| 7 | 通った | 2 | 0 | — |
| 8 | index を NUL で埋めた | 2 | **1** | git-broken |
| 9 | index を戻した | 2 | 1 | **外れた** |
| 10 | refs/heads/main を NUL で埋めた | 2 | **2** | git-broken |
| 11 | 押しも落ち、.git も壊れている | 2（**出さない**） | 2（続いているので鳴らない） | git-broken |

＊偽の送り手が受けた題は5通。ほかに、写しの外へ出る道を塞いだために `ntfy-down・pub-read` が一通混じる（想定どおり）。

**本物の側** — いまの repo は `DIRC`・`ref: refs/heads/main`・refs 40桁とも正しく、押していない commit は0件。
**本番の巡回 17:50:50（台本の更新 17:47:41 の後）は結果0・訴え0件。**

| ファイル | 直し | 検査 |
|---|---|---|
| `~/.claude/pipe-check.ps1` | ⑪ git-broken と ⑩ push-fail を、一発の道の手前に足した | 写し `.bak-20260910c`・**573→658行**・err=0・BOM有 |

## 五、読むだけの調べ

ファイルの読みは **look.js**（read／tail／find／ls／stat／git）で通した。
**集計だけは look.js に役が無い**ので、読むだけの台を一枚（作業場の `bands.js`）書いて `node` で一回呼んだ。
`.git` の頭のバイトと予定の仕事の様子は PowerShell で直に読んだ。

## 残り

`残り2件` — ①**0x4A の追い込み**（VAIO の前から「出して」が来るまで止めている）、②**土台の直し-1**（次に着手）。

---

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **197件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0910-1752.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1752.md) | 09-10 17:53 | 押しの黙り-1 — 押しの失敗と .git の壊れを訴えへ足した（印 y0910-1752） |
| [`y0910-1727.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1727.md) | 09-10 17:30 | 旧版の窓を止め、ログオン時の起こしを置いた（印 y0910-1727） |
| [`y0910-1655.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1655.md) | 09-10 17:00 | 錠の名を揃え、落ちの正体を割った（印 y0910-1655） |
| [`y0910-1305-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-3.md) | 09-10 15:16 | pub-read の始末と、長く走る命令の上限（印 y0910-1305-3） |
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

<!-- 控えの一覧 ここまで -->
