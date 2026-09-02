# 通知のコピー-1 — 送った本文を「まとめて写す」と同じ形で写せるようにした（panel v111）

**状態：終わり（実機で見てください）／本体（`koushu-handan.html`）には触っていない**

**先に一つ申し送り** — この枠より前に届いたはずの **`札の抜け-2` と「通知のコピー-1 の取り下げ」は、
こちらに届いていません。** `hook.log` に残っている今日の枠は
`札の抜け-1`（18:22:09）と `通知のコピー-1`（18:32:08）の二つだけで、台帳にも `札の抜け-2` はありません。
指示の順（札の抜け-2 → 通知のコピー-1）は守れなかったので、**届いている側だけを進めました。**

---

## ① 送るのと同じ字を、同じ刻に公開側へ控える

**書く手は一つ** — `~/.claude/ntfy-record-sent.ps1`。手で送る `ntfy-say.ps1` も、
見張り（`watch-notify.ps1` の `Push-Ntfy`）も、**同じこの手を呼ぶ**。置き場の形が二つに割れない。

置くのは二つ。

| 置き場 | 中身 |
|---|---|
| `ntfy-latest.txt` | 最後の一本だけ。素の字 |
| `ntfy-sent.json` | 直近30本の一覧。釦が「残N／M件」を数える相手 |

- **送れた回だけ控える**（控えへ入れただけ・関門で断られた回は控えない）
- **分割して送った回も、控えるのは割る前の一枚**
- **本文の無い知らせ（走り出し・超過など）は控えない** — 写す相手がいないのに「残N」だけ増えるため

## ② 返事パネルの釦 —「まとめて写す」と同じ形

**panel v111**。「まとめて写す」の隣に置いた。

- **一度のタップで写る** … 本文は**先に取っておく**（開いたときと15秒ごと）。
  押してから取りに行くと、**取得を待つあいだに iOS Safari の「触られた」印が切れ、
  一度目のタップで写せない**。押したときにするのは写すことだけ。
- **印と残N／M件** … 写した本文には印を付け（`localStorage`）、釦は
  「通知の本文を写す（**残N／M件**）」を出す。押すごとに N が減る。
- **畳み** … 未写しが0本になったら**釦ごと畳む**。
- **分割は結合して一枚** … 未写しが複数あれば古い順に繋ぎ、**一度に一枚**で写す。

＊写せなかったときは印を付けない（`copyBundle` と同じ構え）。
＊「N件 写した」の字は、取り直しの返りで**上書きさせない**（`ntfyBusy`）。
　消えると押せたのか分からなくなる。

## ③ 長い報告が一枚で写ること

控えには**割る前の一枚**しか無い。検査は**写した字に本文が丸ごと入っていること**で見る。

## ④ 実測

**作り値（`node panel-check.js` の ⑩）**

```
✓ 押したときの手は写すだけ（取りに行く待ちを挟んでいない）
✓ 本文は開いたときと15秒ごとに先に取ってある
✓ 短い通知：残1／1件 → 一枚で写した（37字・送る側なら1通に割れる長さ）
✓ 長い報告：残1／1件 → 一枚で写した（6040字・送る側なら7通に割れる長さ）
✓ 空：釦ごと畳んだ（字は「通知の本文を写す（0件）」・押せない）
```

**`panel-check.js` は ①〜⑩ すべて PASS。**

**実地（本当に送って確かめた）**

```
短い … 1通 HTTP 200 → 控え「2026-09-02 19:44:35・1通・112字」
長い … 7通すべて HTTP 200（1/7〜7/7）→ 控え「19:45:31・7通・6085字」
        本文の尾「行204：…」まで入っている＝**割れずに一本**
公開側 … ntfy-sent.json に 2本、いちばん新しいのが 6085字で読めることを確認
```

## 直しの途中で自分が壊した所（記録に残す）

作業中、`ntfyBundle` を書く際の置換で **`buildBundle()` の返しの行を上書きしてしまい**
（`return { text: out.join(NL), todo: todo, count: count };` を潰した）、
**返事パネルの黄色の行が全状態で空になった**。構文は通るので検査の字面では出ず、
`panel-check` が14件落ちて初めて分かった。

写しに probe を差して画面の字を読み、**「状態を読めません（a is not defined）」**を捕まえて特定し、
元の行へ戻した。**置換の前後で「一意か」を数えていても、潰した相手までは見ていなかった**のが穴。

**実機で見るところ**
- 版の字が **panel v111**
- 「まとめて写す」の隣に **「通知の本文を写す（残N／M件）」**
- **一度のタップ**で「N件 写した」に変わり、貼ると**頭に題と刻の付いた本文が一枚**で入る
- もう一度押すと（未写しが無いので）**釦ごと畳まれている**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **114件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`通知のコピー-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC-1.md) | 09-02 19:48 | 通知のコピー-1 — 送った本文を「まとめて写す」と同じ形で写せるようにした（panel v111） |
| [`読み口の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E5%8F%A3%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-02 17:52 | 読み口の詰まり-1 — `?_t=` は CDN に効いていない。遅れの正体は Pages の配り直し |
| [`パネルの色-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E8%89%B2-1.md) | 09-02 16:33 | パネルの色-1 — 終了予定の刻だけを明るい水色にした（panel v108） |
| [`終わりの黙り-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E9%BB%99%E3%82%8A-4.md) | 09-02 16:06 | 終わりの黙り-4 — 写せます（ready）を、終わりと同じ道へ乗せた |
| [`仕事の数え方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BB%95%E4%BA%8B%E3%81%AE%E6%95%B0%E3%81%88%E6%96%B9-1.md) | 09-02 14:40 | 仕事の数え方-1 — 生存確認を仕事に数えない。**できる。狭く取れば当てられる** |
| [`走り出しの時刻ずれ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E6%99%82%E5%88%BB%E3%81%9A%E3%82%8C-1.md) | 09-02 06:49 | 走り出しの時刻ずれ-1 — 「22時58分」は**前の仕事の開始 ＋ いまの見込み**だった |
| [`使用量の空振り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E7%A9%BA%E6%8C%AF%E3%82%8A-1.md) | 09-02 06:48 | 使用量の空振り-1 — 06:04 の取得は**成功していた**。本文が「枠の立っていない形」だった |
| [`走り出しの黙り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-2.md) | 09-01 21:17 | 走り出しの黙り-2 — 黙っていた理由は「見込みが無い」。見込み無しでも鳴らす形へ |
| [`持ち越しの根治-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8C%81%E3%81%A1%E8%B6%8A%E3%81%97%E3%81%AE%E6%A0%B9%E6%B2%BB-1.md) | 09-01 20:53 | 持ち越しの根治-1 — 仕事に属する印を、切り替わりで一箇所から落とす |
| [`巡回の固まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-1.md) | 09-01 20:31 | 巡回の固まり-1 — 13分の固まりの中身と、預かりの期限・固まりの一発 |
| [`知らせの止まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-2.md) | 09-01 20:12 | 知らせの止まり-2 — 😽 は25分遅れて出た。止めたのは巡回の固まり（空振り除けは無関係） |
| [`写しの絞り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%B5%9E%E3%82%8A-2.md) | 09-01 19:41 | 写しの絞り-2 — 写しの絞りを検査で守る |
| [`写しの絞り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%B5%9E%E3%82%8A-1.md) | 09-01 18:00 | 写しの絞り-1 — 貼る写しから、判断に使わない行を落とした（panel v106） |
| [`受け渡しの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%97%E3%81%91%E6%B8%A1%E3%81%97%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 17:30 | 受け渡しの守り-1 — Code タブと知らせのあいだに、二つの網を足した |
| [`パネルの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 16:57 | パネルの守り-1 — 返事パネルを検査の網に入れた |
| [`ウィジェットの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 15:24 | ウィジェットの守り-1 — ウィジェット側を検査の網に入れた |
| [`ウィジェットの猫の色-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E7%8C%AB%E3%81%AE%E8%89%B2-1.md) | 09-01 13:01 | ウィジェットの猫の色-1 — ウィジェットの猫を白へ（元絵とパネルはそのまま） |
| [`ウィジェットの状態表示-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E7%8A%B6%E6%85%8B%E8%A1%A8%E7%A4%BA-1.md) | 09-01 12:10 | ウィジェットの状態表示-1 — 返事パネルと同じ状態をウィジェットにも出した |
| [`殻の直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AE%BB%E3%81%AE%E7%9B%B4%E3%81%97-1.md) | 09-01 11:54 | 殻の直し-1 — 実機の `importModule` エラーは台本名と控え名の衝突。直に評価する形へ |
| [`知らせの詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-01 11:29 | 知らせの詰まり-1 — 「外待ち」の消し忘れで198分止まっていた。網を足した |

<!-- 控えの一覧 ここまで -->
