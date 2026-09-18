# 鍵切れの見張り-1

**終わり（残り0件）** — 2026-09-18（VAIO）。**確かめただけ**。本体にも台本にも触っていない。

**先に一つ** … ②の段は**すでに入っている**（09-15 21:13 に作り、毎分の巡回から呼んでいる）。
今回は**足さずに、①の字の在処を出し、③の作り値で通した**。

## ① 09-15 18:43〜20:59 の止まりが、どの綴りに字として残っていたか

**残っていたのは会話の綴り（`~/.claude/projects/C--Users-user-…/f7901906-….jsonl`）だけ。**

```
行12484  2026-09-15 18:43:18  Login expired      ★API誤りの札（"isApiErrorMessage":true）
行12487  2026-09-15 20:59:50  Login successful   （戻った）
```

**ほかの記録には一字も無い。**

| 綴り | 18:43〜20:59 の鍵切れの字 |
|---|---|
| `hook.log` | **無い**（18:41:58 の resume と 18:42 の frame-work が最後で、以降は止まったまま） |
| `watch-notify.log` | **無い**。ここに出る「鍵」は**状態の鍵**（`idle:` / `run:` / `done:`）で**別物** |
| `pipe-warn.log`／`git-push.log` | 無い |

＊止まっている間は**止まる側のフックも走らない**ので、hook 系にはそもそも書かれない。
　**字が残るのは会話の綴りだけ**——これが 09-15 に `kagi-watch.ps1` を作った理由そのもの。

## ② 毎分の巡回の段（すでにある）

```
watch-notify.ps1:443-445
  #   ＊切れていれば「🪟 鍵が切れています。黒い窓で /login」を一発。同じ間は鳴らし続けない。
  $kw = @((Run-Child (Join-Path $Root 'kagi-watch.ps1') 20000) -split [char]10 | …)
  Step '鍵の見回り'
```

- **毎分**（`ClaudeWatchNotify` の巡回の四段目）。**20秒の上限つき**（09-17・譲りの判じの位置-1 で掛けた）
- 中身は `kagi-watch.ps1` … 会話の綴りの**末尾512KB**を共有で開いて読み、
  `"isApiErrorMessage":true` かつ `authentication_failed` または `Login expired` の札を数える
- **`Login successful` より後ろに切れの札があるときだけ**「切れている」と判ずる
- 鳴らすのは**一発だけ**。切れ始めの刻を `kagi-seen.txt` に控え、同じ切れでは二度鳴らさない
- 鍵が戻れば控えを消すので、**次に切れたらまた一発鳴る**

**足す工事は無し。** 今日は一行も触っていない。

## ③ 作り値（五通り・本物の押し送りは叩いていない）

**本物の `kagi-watch.ps1` を、送り手（`ntfy-say.ps1`）と置き場（綴りの棚・控え）だけ偽物へ差し替えて呼んだ**
（写しは作っていない。台本が引数でその三つを受けるため）。

| 場合 | 鳴り | 言い分 |
|---|---|---|
| イ 切れたまま（最後が Login expired） | **🪟 鍵が切れています。黒い窓で /login** ✔ | 鍵切れを見つけて一発鳴らした（切れ始め 2026-09-15 18:43:18） |
| ロ 同じ切れの二度目 | **鳴らない** ✔ | 鍵は切れたまま（既に鳴らした） |
| ハ **09-15 と同じ形**（切れ→戻り） | 鳴らない ✔ | 鍵が戻った。控えを消した |
| ニ 戻ったあと、また切れた | **鳴る** ✔ | 鍵切れを見つけて一発鳴らした |
| ホ 鍵の字が無い回 | 鳴らない ✔ | — |

**イが要**（09-15 18:43 の材料でそのまま鳴る）。**ハも要**——戻った後は鳴らさず、控えを消して次に備える。

## 触った所と触らない所

**触った所** … 無し（確かめだけ）。

**触らない所** … 本体・`kagi-watch.ps1`・`watch-notify.ps1` の鍵の見回りの段・20秒の上限・
`kagi-seen.txt` の再送防止・題の字（🪟 鍵が切れています。黒い窓で /login）・末尾512KBの窓。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **269件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0917-2009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2009.md) | 09-17 20:14 | 古い字の掃除-1 |
| [`y0917-1944.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1944.md) | 09-17 19:55 | 押しの詰まり-1 |
| [`y0917-1611.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1611.md) | 09-17 16:26 | 譲りの判じの位置-1 ／ done-stale-note の空振り-1 |
| [`y0917-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1450.md) | 09-17 14:59 | pub-late の予備の数え方-1 ／ 13:32 の done-stale-note ／ 13:13 の見張りの止まり |

<!-- 控えの一覧 ここまで -->
