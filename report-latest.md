# pub-late の予備の数え方-1 ／ 13:32 の done-stale-note ／ 13:13 の見張りの止まり

**終わり** — 2026-09-17（VAIO）。①は直して作り値まで、②③は**調べだけ**（直しは入れていない）。本体には触っていない。

## ① pub-late の予備の数え方-1（直した）

**14:50 の「70分」は空振りだった。** 押しの控え（`origin/main` の notices.json）が読めなかった回で、
予備として**手元の札と引き算していた**ためで、それは数え直し-1 で捨てたはずの数え方だった。

**直し** … 読めない回は**訴えない**。記録（`pipe-warn.log`）へ

```
pub-defer     押しの控え（origin/main の notices.json）が読めず見送り。次の回で数え直す
```

の一行だけ残して、次の回へ持ち越す。`Add-Warn` は訴えの束へ積んでその回に鳴らすので、**記録へ直に書く形**にした。

**作り値で三通り**（本物の訴え・押し送り・git は叩いていない）

| 場合 | 鳴り | 記録 |
|---|---|---|
| 押しの控えが読めない回 | **鳴らない** ✔ | `pub-defer …` の一行 |
| 読めて本当に遅い回（70分） | **pub-late** ✔ | （無し） |
| 読めて遅れていない回 | 鳴らない ✔ | （無し） |

**触った所** … `pipe-check.ps1` の pub-late の枝だけ。**敷居20分と公開側の読み方は触っていない。**

## ② 13:32 の done-stale-note（stop 13:16:17）

**元は「写しが無かった」側。** stop と合わなかったのではない。

```
13:13:18  resume（「① は甲、② は乙、③ は乙で入れて」の枠が届く）
13:13:29  frame-work  前の仕事の本文 10行を控えから外した（work-note-prev.txt へ退けた）
          ＊退け先の 1159行目 … 「---- 2026-09-17 13:13:18  前の件名: 説明欄の直しの候補を綴りへ…」
13:16:13  stop（v1450 の工事の報告を出した回）
          ＊この回に stop-guard の行が hook.log に無い＝控えを写していない
13:32:29  done-stale-note（止まった時点の控えの写しが無い／stop と合わない・stop 13:16:17）
13:34:15  stop-guard  控えあり（この回に書いた・待ちの行あり）。通す ← ここで初めて写しが残る
```

**筋** … 13:13:29 に本文が退けられた直後、こちらは v1450 の工事に入り、**控えを書き直す前に 13:16:13 の stop が来た**。
控えに `完了` が無いので止まる側の関門は写しを残さず（`Save-NoteAtStop` は通った回だけ）、
立て直しの手はその stop に対する写しを見つけられなかった。
いまの `note-at-stop.txt` の刻は **14:47:13** で、13:16 のものではない——**写しが作られなかった**ことの裏取りになる。

**朝の「札の落ち-1」の直しとの関わり** … あちらは *frame-work が「まだ札にしていない本文」を退けない*ようにする直しで、
**13:13:29 の退けは正しい**（退けた本文は 13:12 に札として出した「説明欄の直しの候補を綴りへ」のもの）。
今回の一件は退けの側ではなく、**控えを書く前に stop が来た回**の話なので、朝の直しがすり抜けたわけではない。

## ③ 13:13 の見張りの止まり（20分）

**止まった段は「帯の見回り」。**

```
13:13:06  開始 → 帯の見回り+0.2秒 → … → 完了+3.4秒（13:13:28）  ← ここまで正常
13:20:57  開始 +0秒
13:21:18  帯の見回り +21.6秒        ← この段のまま 11分 止まった
13:29:55  inbox-watch  居座っていた見張りを落とした（pid 8624・6分）
13:31:59  開始（次の回）／記録に「前の回は途中で終わっていた → 13:21:18 / 帯の見回り / +21.6秒（その段のまま 11分）」
13:32:48  入口が重かったので、この回は先へ進まない（49.1秒）
13:33:11  開始 → 最後まで通る（知らせの判定 +21.9秒）
```

**譲りの段は働かなかった。** 「軽い巡回で回った」の行は今日二本あるが、**13:40:15（git-remote-https1本）と 14:05:08（gh1本）**で、
13:13〜13:32 の間には無い。13:20:57 の回は**譲りの判じへ辿り着く前に止まっている**——
判じは「生存の合図」の後ろに置いてあり、この回は**その二段手前の帯の見回りで固まった**ため。

**落とした回が掴んでいたもの** … 13:28:43 に `ntfy-sent` の押しが「空きが乏しいので押しを見送る（**空き 369MB**・敷居768MB・軽い側）」。
13:27 と 13:32 に押しが走っており、13:32 には v1450 の本体の押しも通っている。
**空きが 369MB まで落ちた最中**に、居座った見張り（pid 8624・6分）が落とされた。

**分かったこと（直しはまだ入れない）**
- 譲りの判じの**位置が遅い**。いまは「生存の合図」の後ろだが、帯の見回り・鍵の見回りより**前**に置けば、この回も軽い巡回で抜けられた
- ただし前に出すと、**合図を打つ前に返る**ことになる。合図だけは先に打つ形を保ったまま、判じを前へ出す組み替えが要る

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **250件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0917-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1450.md) | 09-17 14:59 | pub-late の予備の数え方-1 ／ 13:32 の done-stale-note ／ 13:13 の見張りの止まり |
| [`説明欄の直し-v1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E7%9B%B4%E3%81%97-v1450.md) | 09-17 13:32 | 説明欄「二、どう使うの？」の直し（v1450） |
| [`y0917-1145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1145.md) | 09-17 12:48 | 説明欄の点検-1（六節の字と、いまの本体の食い違い） |
| [`猫牌率のEF-v1449.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AEEF-v1449.md) | 09-16 21:26 | 実測帳の E 甲・F 乙（v1449） |
| [`y0916-1900.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-1900.md) | 09-16 19:04 | E と F の字（猫牌率・候補の外の二つ） |
| [`猫牌率の文の直し-v1448.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%96%87%E3%81%AE%E7%9B%B4%E3%81%97-v1448.md) | 09-16 13:09 | 猫牌率の文の直し（v1448）と、候補の外の二つ |
| [`y0916-0707.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0707.md) | 09-16 07:09 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`y0916-0436.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0916-0436.md) | 09-16 07:06 | 猫牌率の文の直しの候補 A〜D（v1447） |
| [`猫牌率の下敷きの入れ替え-v1447.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-v1447.md) | 09-16 04:35 | 猫牌率の下敷きの入れ替え（v1447） |
| [`猫牌率の測り直し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E6%B8%AC%E3%82%8A%E7%9B%B4%E3%81%97-2.md) | 09-15 22:31 | 猫牌率の測り直し-2 |
| [`猫牌率の下敷きの入れ替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E7%89%8C%E7%8E%87%E3%81%AE%E4%B8%8B%E6%95%B7%E3%81%8D%E3%81%AE%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88-1.md) | 09-15 21:07 | 猫牌率の下敷きの入れ替え-1 の下調べ |
| [`八人の数字を説明欄へ-v1446.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%AB%E4%BA%BA%E3%81%AE%E6%95%B0%E5%AD%97%E3%82%92%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%B8-v1446.md) | 09-15 14:03 | 八人の数字を説明欄へ（v1446） |
| [`y0915-1130.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0915-1130.md) | 09-15 12:53 | 八人の数字を説明欄へ（丙の字を確定） |
| [`件名の拾い方-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BB%B6%E5%90%8D%E3%81%AE%E6%8B%BE%E3%81%84%E6%96%B9-4.md) | 09-15 04:59 | 件名の拾い方-4 と stable の進め（v1445） |
| [`四枚の札の縮め-1-v1445.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9B%9B%E6%9E%9A%E3%81%AE%E6%9C%AD%E3%81%AE%E7%B8%AE%E3%82%81-1-v1445.md) | 09-15 01:28 | 四枚の札の縮め-1（v1445） |
| [`y0915-0130.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0915-0130.md) | 09-15 01:00 | 四枚の札の縮め-1 の下調べ（印 y0915-0130） |
| [`兎の一行の確定-v1444.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E4%B8%80%E8%A1%8C%E3%81%AE%E7%A2%BA%E5%AE%9A-v1444.md) | 09-15 00:51 | 兎の一行の確定と stable の進め（v1444） |
| [`説明欄の作り替え-v1444.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AC%E6%98%8E%E6%AC%84%E3%81%AE%E4%BD%9C%E3%82%8A%E6%9B%BF%E3%81%88-v1444.md) | 09-15 00:44 | 説明欄の作り替え（v1444） |
| [`見張りの止まり-3-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-3-2.md) | 09-15 00:12 | 見張りの止まり-3（三度の止まり） |
| [`人柄の言葉の棚卸し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BA%BA%E6%9F%84%E3%81%AE%E8%A8%80%E8%91%89%E3%81%AE%E6%A3%9A%E5%8D%B8%E3%81%97-2.md) | 09-14 23:39 | 人柄の言葉の棚卸し-2（後半四人） |

<!-- 控えの一覧 ここまで -->
