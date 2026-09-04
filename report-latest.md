# 矛盾の三つ-1 — 三つとも「材料を読む所」がずれていた

**状態：終わり（実機で見てください）／判定や札の作りの大元には触っていない**

---

## ① 10:14 の終わりの通知に題が無い

**理由** — その一本は **10:12:59 に積まれた「写せます」の分**で、
**10:14:17 に「預かっていた押し送り」として出た**。押し送りの題へ名を足す手は
`$script:doneSubj` を見ていたが、**それを立てるのは `done:` の枝だけ**。
預けた分が出る回は鍵が **`idle:`** で、その枝を通らない——**名が空のまま**だった。

```
10:10:46  鍵 run: → done:        ← ここでは名が立つ
10:12:55  鍵 done: → idle:
10:12:59  写せますを積む（名乗り done・元は ready）
10:14:17  預かっていた押し送りを出す   ← この回は idle: なので名が無い
10:14:19  押し送りOK（本日11件目）
```

**直し** — 名の出どころを**控えの件名そのもの**にも広げた。
`$script:doneSubj` が立っていればそれを使い、無ければ **`$note.subject`**（どの回でも読んである）を使う。
**判定は変えていない。題に何を書くかだけ。**

## ② 10:06 の走り出しは「機械の詰まり-1」で鳴っていた

**何の仕事か** — 鳴った名は **機械の詰まり-1（今夜五度の固まりの根を当てる）**。
実際にその時始まったのは **見張りの×-1** の回。

**パネルに作業中として出なかった理由 — 出てはいた。ただし前の仕事の名で。**

```
10:05:38  state.json  stat=作業中  subj=機械の詰まり-1   mikomi=60分
10:10:00  state.json  stat=作業中  subj=見張りの×-1      mikomi=30分  ← 控えを書き直したあと
10:10:51  state.json  stat=手待ち
```

**10:04:56 に run: へ移った時点で、控えはまだ前の件名のまま**だった。
走り出しもパネルも同じ控えを読むので、**両方とも前の名で出た**
（10:05 ＋ 見込み60分 ＝ **11:05**。刻の計算自体は正しい）。
[[走り出しの時刻ずれ-1]] と**同じ型**——材料が控えより先に読まれている。

**直し（こちらの手順で塞ぐ）** — **新しい枠を受けたら、最初の一手で控えの件名を書き直す。**
今回は台帳へ積んでから控えを直しており、そのあいだの5分42秒が前の名で出ていた。
＊記憶（`note-subject-first`）へ残した。

＊**機械の側で塞ぐ案は実装せず止めた**（下記）。

## ③ 釦「残1／3件」の分母3

**何を数えていたか** — **直近の「写せます（N件）」の札に書いてある数**（`lastReadyCount()`）。
10:13:01 の札が「写せます（3件）」で、そのあと2件を写したので **残1／3件**。
**分母は知らせを出した時点の写しで、こちらが写しても減らない。**

**崩れていた箇所の名指し** — `panel.html` の `setCopyBoardLabel()` の

```js
var m = lastReadyCount();
```

**数の不一致-1（v116）で「通知の在庫」を分母から外したとき、この一行を残したのが取りこぼし。**
裁定は「三つとも**写した印の無い中身のある札の数**で統一」なので、分母もその数でなければならない。

**直し** — **M ＝ N**（`var m = n;`）。残っている数と母数が同じものを指す。**panel v117**。

## 実測

**作り値**（`panel-check.js` の ⑯ を強めた。**写せますの札を「3件」にしても分母が引きずられないこと**を見る）

```
⑯ 釦・目次・写せますの札の数が揃う
  ✓ 釦 残2／2件 ／ 目次2行 ／ 写せますの札は数にも目次にも写しにも入らない
      （作り値の写せます札は「3件」。分母は 2 のまま＝引きずられない）
```

**`panel-check.js` は ①〜⑯ すべて PASS。**

**実地** — ①は次の「預かっていた押し送り」が出る回で、題に「：〈題〉」が付くかを見る。
③は次に札が立った回で、釦・目次・知らせの三つが同じ数になるかを見る。

## report して止めた案（実装していない）

- **走り出しとパネルが、控えより新しい材料を掴んだときに名を伏せる。**
  刻には既に12時間の見張りがあるが、**名には無い**。
  ただし「控えが古ければ名を出さない」は**判定そのもの**なので、実装せず伺う。

**実機で見るところ**
- 版の字が **panel v117**
- 釦の **残N／M の M が、目次の行数・次に届く「写せます（N件）」と同じ数**になる
- 次の終わりの押し通知の題に **「：〈題〉」が付く**（預けて出た回でも）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **131件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`矛盾の三つ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%9B%E7%9B%BE%E3%81%AE%E4%B8%89%E3%81%A4-1.md) | 09-04 12:31 | 矛盾の三つ-1 — 三つとも「材料を読む所」がずれていた |
| [`見張りの×-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%C3%97-1.md) | 09-04 10:09 | 見張りの×-1 — 「×2147946720」は死んでいた印ではなく、**その一分の起こしを見送った印** |
| [`機械の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-04 06:06 | 機械の詰まり-1 — 現場を押さえる手を入れ、押す者を一度に一人にした |
| [`数の不一致-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%95%B0%E3%81%AE%E4%B8%8D%E4%B8%80%E8%87%B4-1.md) | 09-04 01:24 | 数の不一致-1 — 三つを「写した印の無い、中身のある札の数」で揃えた（panel v116） |
| [`生存の途切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%94%9F%E5%AD%98%E3%81%AE%E9%80%94%E5%88%87%E3%82%8C-1.md) | 09-04 00:44 | 生存の途切れ-1 — 詰まった一本が10分ぶら下がり、次の刻が「見送り」で捨てられた |
| [`パネルの立て直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E7%AB%8B%E3%81%A6%E7%9B%B4%E3%81%97-1.md) | 09-03 21:30 | パネルの立て直し-1 — 開いた瞬間に「何が終わって何が待っているか」が読める形へ（panel v115） |
| [`読みの道-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-3.md) | 09-03 20:52 | 読みの道-3 — `latest-name.txt` を完全な URL 一行にした |
| [`読みの道-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-2.md) | 09-03 20:31 | 読みの道-2 — 名を変えた写しを置く（読む側が待たずに最新を取れる） |
| [`札の押し出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%BC%E3%81%97%E5%87%BA%E3%81%97-1.md) | 09-03 17:27 | 札の押し出し-1 — 🪟 が終わりの札を上書きしていた。二枚とも立てる形にした |
| [`巡回の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-03 16:02 | 巡回の固まり-2 — 止まっていたのは「使用量の段」。上限の無い呼び出しが一つあった |
| [`写しの一本化-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E6%9C%AC%E5%8C%96-1.md) | 09-03 15:17 | 写しの一本化-1 — 押す所を一つにした（panel v114） |
| [`通しの試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E3%81%97%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-03 13:28 | 通しの試験-1 — 小さな仕事を一つ流して、端から端まで見届けた |
| [`板の欠け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9D%BF%E3%81%AE%E6%AC%A0%E3%81%91-1.md) | 09-03 12:03 | 板の欠け-1 — 公開側の `board.json` は無事だった。消えていたのは**手元の値** |
| [`写しの切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E5%88%87%E3%82%8C-1.md) | 09-03 10:03 | 写しの切れ-1 — 切っていたのは `buildBundle` ではなく、見張りの控えの読み手 |
| [`札の抜け-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2-2.md) | 09-03 06:43 | 札の抜け-2（続き）— 昨夜の直しは**一度も働いていなかった**。枝の順が原因 |
| [`通知の分け方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%88%86%E3%81%91%E6%96%B9-1.md) | 09-02 23:05 | 通知の分け方-1 — 長い報告は ntfy へ送らない。札にして、釦で一枚で写す |
| [`札の抜け-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2.md) | 09-02 22:55 | 札の抜け-2 — 取り逃がした stop を拾い直す（終わりの札を運任せにしない） |
| [`通知のコピー-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC-1.md) | 09-02 19:48 | 通知のコピー-1 — 送った本文を「まとめて写す」と同じ形で写せるようにした（panel v111） |
| [`読み口の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E5%8F%A3%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-02 17:52 | 読み口の詰まり-1 — `?_t=` は CDN に効いていない。遅れの正体は Pages の配り直し |
| [`パネルの色-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E8%89%B2-1.md) | 09-02 16:33 | パネルの色-1 — 終了予定の刻だけを明るい水色にした（panel v108） |

<!-- 控えの一覧 ここまで -->
