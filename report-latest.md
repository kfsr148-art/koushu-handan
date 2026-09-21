# 枠の上限 — 8分を超え、かつ空きが400MBを割ったら仕事を切る

**終わり（残り2件）** — 2026-09-21 18:05（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## 1. 入れた形

`inbox-watch.ps1` に **`Check-FrameLimit`** を足した（1356行 → **1485行**・構文の誤り0）。
巡回の中で**一分に一度**（15秒の四回に一度）見る。

### 切る条件は**二つ揃ったときだけ**

| | 敷居 |
|---|---|
| いまの枠の経過 | **8分を超えている**（`work-started.txt` の `at=` から数える） |
| 空きメモリ | **400MB を割っている** |

**片方だけでは切らない。** 長いだけの仕事も、空きが細いだけの手待ちも、切る理由にならないため。
＊**走っている回（鍵が `run:`）だけ**見る。手待ち・ヨシ待ちは切らない。

### 切るときにすること（この順）

1. **`claude` の子を落とす** … `powershell` `node` `git` `gh` のうち、**親をたどって `claude.exe` に行き着く物**だけ。
   常駐（`inbox-watch`）は `claude` の子ではないので当たらない。
2. **`claude` へ Esc を一打送る** … 仕事そのものを切る。**窓は落とさない**（`send-esc.ps1` を使う）。
3. **台帳のいまの行に「時間切れ（NN分・空きNNNMB）」を足す** … 黙って落とさない。

**一つの枠につき一度だけ。** 枠の題と開始の刻を `frame-cut.txt` に控え、同じ枠では二度切らない。

---

## 2. 作り値（三通り＋念のための一つ）

**写しに切り出して差し替えた**（`$script:Frame*`）。**本物の子は一本も落としていない・Esc も送っていない・
本物の台帳も書いていない。**

| 場合 | 切ったか | 落とす当て | Esc | 台帳へ書く字 |
|---|---|---|---|---|
| **甲 9分・350MB** | **切った** | **1本**（pid 12780） | **送った** | **`時間切れ（9分・空き350MB）`** |
| **乙 9分・600MB** | **切らない** | 0本 | 送っていない | （無し） |
| **丙 3分・350MB** | **切らない** | 0本 | 送っていない | （無し） |

**念のための一つ … 同じ枠で二度目** — `frame-cut.txt` を消さずに続けて呼ぶと、
**1度目は切り、2度目は切らない**。一枠一度が効いている。

**台帳の書き込みだけ、本当に書かせて確かめた**（写しの台帳へ）。

```
受領時刻          番号   項目      状態
2026-09-21 16:00  古い   前の枠    済：これは触ってはいけない        ← 触っていない
2026-09-21 17:00  作り値 作り値の枠 未了：受領／時間切れ（9分・空き350MB） ← ここだけ足された
```

**いちばん新しい「未了」の行だけ**に足り、済んだ行には触らない。

---

## 3. 差し替えの口（作り値のため）

| 名 | 何を差し替えるか |
|---|---|
| `$script:FrameFakeMin` | 枠の経過（分）を直に渡す。0以上なら `run:` の検めも飛ばす |
| `$script:FrameFakeFree` | 空き（MB）を直に渡す |
| `$script:FrameKilled` | 落とした pid をここへ積む（**本物は落とさない**） |
| `$script:FrameEsc` | Esc の印をここへ積む（**本物は送らない**） |
| `$script:FrameLedger` | 台帳へ書く字をここへ積む（**本物は書かない**） |
| `$script:FrameEvery` | 何巡に一度見るか（既定4＝一分） |
| `$FRAME_MAX_MIN` / `$FRAME_LOW_MB` | 敷居（既定 8分 / 400MB） |

---

## 4. 順番について、ひとこと

**この札を出し終えてから、常駐を入れ替える。**
いまの枠は既に8分を超えており、空きは 400MB の前後を行き来している。
**先に常駐を入れ替えると、この報告を書いている最中に自分が切られる**——
それは仕掛けとしては正しい動きだが、**報告が残らない**。
入れ替えたら、次の巡回から効き始める。

＊つまり**この回の枠は切られない**（古い常駐が回っているあいだに終わる）。
　効くのは**次の枠から**。

---

## 5. 戻し方

| 直した綴り | 写し |
|---|---|
| `~/.claude/inbox-watch.ps1` | **`inbox-watch.ps1.bak-20260921d`** |

```powershell
Copy-Item 'C:\Users\user\.claude\inbox-watch.ps1.bak-20260921d' 'C:\Users\user\.claude\inbox-watch.ps1' -Force
wscript "C:\Users\user\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\ClaudeInboxWatch.vbs"
```

**敷居だけ変えたいとき**は、`inbox-watch.ps1` の `$FRAME_MAX_MIN`（既定8）と
`$FRAME_LOW_MB`（既定400）を書き替えて、常駐を起こし直す。

---

## 6. 残り

**残り2件。**

1. `2026-09-21 13:21:07` 機械に乗せている物を測ってから減らせ — ②が未了。
2. `2026-09-21 16:46:53` 機械の負荷を「立てる数」で減らせ — ①②と綴りの退避が未了。

## 7. 実機で見るところ

- **長引いた枠が、空きの細い時に切られること** … `inbox-watch.log` に
  `枠の上限：時間切れ（NN分・空きNNNMB）。claude の子を N本落とし、Esc を一打送った` の一行が立ち、
  台帳のその行の末尾に `／時間切れ（NN分・空きNNNMB）` が付く。
- **空きが足りていれば切られないこと**（長いだけでは切らない）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **359件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0921-0140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0140.md) | 09-21 01:36 | ①写しの頭の道を一意の名にした（panel v143） ②使用量の敷居と、~/.claude の写しの調べ |
| [`y0921-0115.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-0115.md) | 09-21 01:13 | 再起動で切れた二つの直しは**入っている** — 作り値の結果と予定表の写し |

<!-- 控えの一覧 ここまで -->
