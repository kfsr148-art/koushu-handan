# 綴りを退避して **171.4MB → 4.6MB**／台帳の未了 **0件**

**終わり（残り0件）** — 2026-09-21 19:15（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## 1. 動かす前に、**危ない所が一つあった**

`~/.claude/.gitignore` は `projects/**/*.jsonl` を**わざと除いている**。理由も書いてある——

> 話題名が本文に混じる記録。実測：`projects/*.jsonl` の5本と `watch-notify.log` に話題名が入っていた

**退避先 `transcript-bak/` は、その除外に入っていなかった。**
そのまま動かすと、**167MB の綴りごと、話題名（＝知っている人は誰でも読める ntfy の鍵）が GitHub へ載る**。

**先に `.gitignore` へ足してから動かした。**

```
projects/**/*.jsonl
#    退避先も同じ扱い（2026-09-21）。綴りを動かしても中身は同じで、話題名が入ったまま。
transcript-bak/
```

**確かめ** … 動かしたあとの `git status` は72行あるが、**`transcript-bak` の行は0件**＝無視できている。

---

## 2. 退避した

**退避先 … `~/.claude/transcript-bak/20260921/`**（名は `<最終書きの刻>_<元の名>.jsonl`）

| | 前 | 後 |
|---|---|---|
| `projects/…/` の綴り | **50本・171.4MB** | **1本・4.6MB** |
| 動かした物 | — | **49本・166.8MB** |

**残した一本は、いま書かれている綴り**（`a40a8df8-…jsonl`・4.6MB・最終書き 19:11:34）＝**この窓**。
走っている窓が掴んでいる綴りは抜かない。

**60.7MB の綴りは、この中にあった** … `20260921-095653_f7901906-7b9f-4cf1-b756-4edaec86447e.jsonl`。
**最終書きは 09-21 09:56:53** で、11:37 に落ちた**前の窓**のもの。**いま走っている窓の物ではなかった**ので、
危なげなく動かせた。

＊`--continue` は既に外してあるので、**この綴りはもう起動時に読み込まれない**。
　60.7MB を読み込んで固まる輪は、これで両側（読む側・置く側）とも断たれた。
＊`revive-claude.ps1` の `Check-Stuck` は「いちばん新しい `.jsonl`」を見る。
　いま残るのは走っている一本だけなので、**見る先はむしろ正しくなった**。

---

## 3. 未了4項目の始末

| # | 項目 | どうしたか |
|---|---|---|
| **①** | 常駐への相乗り | **取り下げ**（指示による）。`watch-notify.ps1` の `exit` を runspace で受ける造りは作らない |
| **②** | hook（`tool-mark`）を cmd の一行へ | **取り下げ**（指示による）。`tool_use_id` は落とさずに済む |
| **③** | `--continue` を外し、綴りを退避 | **済**。`--continue` は 17:00 に外し、綴りは今回 49本166.8MB を退避 |
| **④** | 1時間の `gh` と `git` の本数 | **見込みで済**。郵便受けの `gh` は **60本/時 → 0本/時**、`state` の押しは **平均9回/時 → 上限20回/時かつ中身が変わった時のみ** |

＊もう一つ開いていた `13:21:07`（機械に乗せている物を測ってから減らせ）の②も**済**にした。
　**積の上位だった hook の置き替えが①②の取り下げに含まれ**、もう一方の `ClaudeJamWatch` は
　`Parallel → IgnoreNew` にして**たまる害を消してある**ため。

---

## 4. 台帳の未了 — **0件**

```
台帳の未了 = 0件
```

＊この枠そのものの行も、報告と一緒に済にした。

---

## 5. 今日ここまでの効き（まとめ）

| 見るもの | 朝〜昼 | いま |
|---|---|---|
| 毎分立つ子 | **22.7本** | **10.6本** |
| `powershell` の居座り | **113本**（15:50） | **2〜4本** |
| `projects/` の綴り | **171.4MB** | **4.6MB** |
| 郵便受けの `gh` | 60本/時 | **0本/時** |
| 起動時の `--continue` | 60.7MB を読み込む | **読み込まない** |
| 枠の上限 | 無し | **8分かつ空き400MB未満で切る**（実地で一度働いた：`時間切れ（8分・空き266MB）`） |
| 定時の再起動 | 週一（固まると一行も残らない） | **一日二回＋内側の上限300秒** |
| 重い仕事 | VAIO で回す | **雲へ回す道**（`scratchpad/jobs/` → `reports/cloud-*.md`） |

---

## 6. 実機で見るところ

- **窓を開き直したとき、前の会話を読み込まずにすぐ立つこと**（60.7MB の読み込みが無い）。
- `~/.claude/transcript-bak/20260921/` に49本あること。**GitHub には載らない**（`.gitignore` 済み）。
- 古い会話を読み返したくなったら、この退避先から探す。**消してはいない。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **363件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1915.md) | 09-21 19:13 | 綴りを退避して **171.4MB → 4.6MB**／台帳の未了 **0件** |
| [`y0921-1805b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805b.md) | 09-21 18:35 | 未了4項目を一行ずつ／枠の上限の結果／使用量の鈴の丸め |
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

<!-- 控えの一覧 ここまで -->
