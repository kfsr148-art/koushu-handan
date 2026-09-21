# 雲へ重い仕事を回す道 — **通った**

**終わり（残り2件）** — 2026-09-21 17:55（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## 1. 作り値 — **一本通して、結果が `reports/` に戻った**

置いた台本 … `scratchpad/jobs/kumo-tameshi.js`（回る所が VAIO か雲かを、機械の顔つきで見せるだけ）。
押した → 走りが立った → **成功**（`35580063775`）→ 結果が押し戻された。

**戻ってきた綴り … `reports/cloud-kumo-tameshi-20260921-085123.md`**

```
host      : runnervmlun5p
platform  : linux / 6.17.0-1022-azure
cpu       : 4個 / AMD EPYC 7763 64-Core Processor
memory    : 全体 15990MB / 空き 14804MB
node      : v20.20.2

試しの計算 : 500万回の平方根 = 7453558807（15ms）
```

**終了コード 0。**

| | VAIO | 戻ってきた綴りの中身 |
|---|---|---|
| 機械 | Windows 10 | **linux 6.17.0-azure** |
| CPU | 2個 | **4個・EPYC 7763** |
| メモリ | **3,975MB** | **15,990MB**（空き14,804MB） |

**数字が別物なので、VAIO では回っていない**——雲で回った、と言い切れる。

---

## 2. 造り

### `.github/workflows/job.yml`（新設）

| | |
|---|---|
| 引き金 | `scratchpad/jobs/*.js` と `*.ps1` が**変わった押し**だけ。＋手起こし（`workflow_dispatch`） |
| 回る所 | `ubuntu-latest`／node 20／`pwsh` |
| 一本の上限 | **1500秒**（`timeout`）。越えたら終了コード **124** で切られ、札にそう出る |
| 走りの上限 | 30分（`timeout-minutes`） |
| 同時 | `concurrency: koushu-cloud-job`（重ならない・途中で打ち切らない） |
| 書く先 | **`reports/cloud-<台本の名>-<刻>.md`** |
| 押し戻し | `github-actions[bot]` が `reports/` だけを commit → `pull --rebase` → push（三度まで） |

**輪にならない。** 引き金は `scratchpad/jobs/` の台本だけ、書き戻す先は `reports/` だけなので、
**書き戻しがもう一度走りを起こすことはない**。同じ台本を置いたままでも、中身が変わらなければ二度は走らない。

### `scratchpad/jobs/`（新設）

`README.md` に使い方と決まりを置いた。**台本は消さない**（何を回したかを綴りに残すため）。

---

## 3. 「雲で：」の決め

**枠の頭に「雲で：」と付いた物は、VAIO では回さない。**

1. 台本を `scratchpad/jobs/` へ置く
2. 押す（＝この道へ渡したことになる）
3. 戻ってきた `reports/cloud-*.md` を読む
4. **札で結果を返す**

一本だけ回したいときは、Actions の「雲で回す」を手起こしし、`only` に `kumo-tameshi.js` のように名を入れる。

＊この決めは `job.yml` の頭と `scratchpad/jobs/README.md` の両方に書いた。

---

## 4. 押しで一度つまずいた（記録として）

最初の押しが `! [rejected] main -> main (fetch first)` で弾かれた。
常駐の押しが先に入っていたため。`pull --rebase --autostash` して押し直し、**通った**
（`961d47d7..312bf724`）。**いまは押し残し0件。**

---

## 5. 前の札の刻を訂正

`reports/y0921-1805.md` の頭を「18:05」と書いたが、**実際の機械の刻は 17:45 前後**だった。
中身（作り値の結果・行数・構文0）は合っている。**刻だけが進んでいる**ので、ここで訂正する。
＊常駐の入れ替えは **pid 9172・17:49:05**（台本の更新 17:45:00 より後）で、枠の上限は**効いている**。

---

## 6. 残り

**残り2件。**

1. `2026-09-21 13:21:07` 機械に乗せている物を測ってから減らせ — ②が未了。
2. `2026-09-21 16:46:53` 機械の負荷を「立てる数」で減らせ — ①②と綴りの退避が未了。

## 7. 実機で見るところ

- `scratchpad/jobs/` へ台本を置いて押すと、数分で **`reports/cloud-<名>-<刻>.md`** が増えること。
- その綴りの「機械」の行が **ubuntu-latest（雲）** になっていること（VAIO の数字でないこと）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **361件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-1755.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1755.md) | 09-21 17:55 | 雲へ重い仕事を回す道 — **通った** |
| [`cloud-kumo-tameshi-20260921-085123.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-kumo-tameshi-20260921-085123.md) | 09-21 17:53 | 雲で回した：`kumo-tameshi.js` |
| [`y0921-1805.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805.md) | 09-21 17:47 | 枠の上限 — 8分を超え、かつ空きが400MBを割ったら仕事を切る |
| [`y0921-1700.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1700.md) | 09-21 17:02 | 立てる数を減らす — **毎分 22.7本 → 10.6本**／`--continue` を外した |
| [`y0921-1635.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1635.md) | 09-21 16:38 | 網の切れの一覧と、窓隠しの検収 |
| [`y0921-1625.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1625.md) | 09-21 16:26 | 包みの待ちの確かめ・再起動の内側の上限・押しの詰まりの元 |
| [`y0921-1600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1600.md) | 09-21 15:53 | 二件の取り下げと、走りかけの子 125本の片付け |
| [`y0921-1335.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1335.md) | 09-21 13:31 | 09-20 22:00 からの乱れ一枚と、網／ディスクの突き合わせ |
| [`y0921-1250.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1250.md) | 09-21 12:59 | 起き上がりの道を直して、再起動を一日二回にする |
| [`r0921-1246-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0921-1246-2.md) | 09-21 12:46 | 再起動-2（r0921-1246・後の測り） |
| [`y0921-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1040.md) | 09-21 10:41 | 「写した刻」を字面で確かめて消した |
| [`y0921-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1020.md) | 09-21 10:23 | 青い窓の出所と、wscript の包みで隠した話／untracked の「写した刻」 |
| [`y0921-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0950.md) | 09-21 09:49 | 会話の控えの大きさと、畳む支度の点検 |
| [`y0921-0935.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0935.md) | 09-21 09:35 | 「窓を畳むと0枚と読む」の見立ては、実物では成り立たなかった — 直しは入れていない |
| [`y0921-0925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0925.md) | 09-21 09:24 | 公開 state の詰まりと、09:19 の札 |
| [`y0921-0845.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0845.md) | 09-21 08:45 | 06:50 の復帰後に溜まっていた枠の行方と、会話の控えの大きさ |
| [`y0921-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0800.md) | 09-21 08:01 | mem-orphan.ps1 の作り値（置き去り落とし・空きの見張り）と、実地の落とし |
| [`y0921-0730.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0730.md) | 09-21 07:39 | 公開側 state は戻っている／置き去りの gh・git を常駐が落とす／空き300MB割れで一発 |
| [`y0921-0655.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0655.md) | 09-21 06:52 | 見張りの止まりの元は「空きメモリ」。使用量の読みではない |
| [`y0921-0245.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0245.md) | 09-21 02:41 | ①使用量の見張りを足した ②控えの押し残し230件を通した ③鍵の作り直し方を置いた |

<!-- 控えの一覧 ここまで -->

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. 🪟 異常です：週全体の使用量が 80% を越えました

```
週全体 80%（敷居 80%）
窓の切り替え 2026-09-21T11:00:00.729898+00:00
```

### 2. 🪟 連携に訴えがあります（subj-gap）

```
連携の見張りから訴えが出ています。

・subj-gap … 作業中の件名が食い違っている（控え「常駐 inbox-watch に枠の上限を足す」／出ている「雲へ重い仕事を回す道を一本作れ」）

＊同じ種類が続く間は、これ以上鳴らしません。
＊全部の記録は ~/.claude/pipe-warn.log にあります。
```

### 3. 🪟 連携に訴えがあります（done-swept）

```
連携の見張りから訴えが出ています。

・done-swept … 終わりの札が立っていなかったので立て直した（--continue の枠は重複。確かめ直して台帳を整えた・stop 2026-09-21 17:20:02・19分遅れ）

＊同じ種類が続く間は、これ以上鳴らしません。
＊全部の記録は ~/.claude/pipe-warn.log にあります。
```

### 4. 🔎 調べました：--continue の枠は重複。確かめ直して台帳を整えた

```
--continue の枠は重複。確かめ直して台帳を整えた
①同じ枠が二度届いたので、触り直さずに字で確かめた——ClaudeCodeAtLogon の引数に --continue は無く164字（題「(Claude Code)」・--remote-control koushu-handan・/MAX はすべて残存）、revive-claude.ps1 に残る2か所は「外した」「付けない」と断る説明の字だけ、daily-reboot.ps1 の L200 に「空きメモリ NMB ／ 全体 NMB」の行がある。写しも両方（revive-claude.ps1.bak-20260921／daily-reboot.ps1.bak-20260921c）残っている。②台帳に済を書き忘れていた行が溜まっていたので、7行まとめて書き替えた。未了は7件→2件になった。
```

### 5. ✅ 終わりました（返事不要）

```
写せます（5件）
```

<!-- 送った知らせ ここまで -->
