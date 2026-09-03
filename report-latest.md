# 写しの切れ-1 — 切っていたのは `buildBundle` ではなく、見張りの控えの読み手

**状態：終わり（実機で見てください）／本体（`koushu-handan.html`）には触っていない**

**名指し** — `buildBundle`（`bundleCards`）は**前から本文を丸ごと束ねていた**。
落としていたのは **`watch-daily`… ではなく `watch-notify.ps1` の控えの読み手（`Get-Note`）**で、
**行ごとに見出しを当て、見出しに当たらない続きの行をどの枝でも拾わずに捨てていた。**

---

## ① 字面のまま抜き出して、止まる箇所を名指しする

**まず `buildBundle` の側**（`panel.html`）。

```js
function bundleCards(todo) {
  return (todo || []).map(function (d) {
    var body = trimForCopy(d.title, String(d.message || ''));
    var head = body.split(NL)[0];                 ← 一行目を取るのは**見出し用**（brief）
    var line = briefOf(hhmm(d.time), kindWord(d.title), plain(head) || '（件名なし）', '');
    return { brief: line, full: line + NL + body, ask: … };   ← full は**本文を丸ごと**繋いでいる
  });
}
```

`head` は一行目だが、**使い道は畳んだときの一行（`brief`）**。写しに入るのは `full` で、
そこには `body` が丸ごと入っている。**ここでは切れていない。**

**作り値で裏を取った**（本文5行＋ファイル＋実測＋実機の札を一枚だけ置いて、まとめて写すを押す）。

```
写しの行数 11
  4| 写しの切れ-1（作り値）
  5| 本文の一行目です。      ← 5行とも入っている
  …
  9| 本文の五行目です。
 10| 実測: 作り値で5行を確かめた
 11| 実機: 版の字が新しくなっていること
```
＊`ファイル:` の行が無いのは**写しの絞り（v106）の仕事**で、切れではない。

**では、どこで一行になっていたか。** 実物の札を開くと**4行しか無い**。

```
札 07:30:40  行数 4
  1| 札の抜け-2（続き・枝の順を直す）
  2| 昨夜入れた「取り逃がした stop を拾い直す」枝は、一度も働いていなかった。
  3| ファイル: ~/.claude/watch-notify.ps1（写し .bak-20260903a・構文OK 2732行・BOM有）／
  4| 実測: 枝の順の作り値4通りPASS（待ちの行が無い→終わりへ／「待ち: なし」→終わりへ／
```

控えの `完了:` は10行以上あるのに、**各欄の一行目しか残っていない**。
読み手（`watch-notify.ps1` の `Get-Note`）はこう書かれていた。

```powershell
if     ($t -match '^件名[:：]\s*(.+)$')   { $r.subject = … }
elseif ($t -match '^待ち[:：]\s*(.*)$')   { … }
elseif ($t -match '^完了[:：]\s*(.+)$')   { $r.done  = $matches[1].Trim() }   ← 一行だけ
elseif ($t -match '^ファイル[:：]\s*(.+)$') { $r.files = … }
elseif ($t -match '^実測[:：]\s*(.+)$')   { $r.meas  = … }
elseif ($t -match '^種類[:：]\s*(.+)$')   { $r.kind  = … }
}                                          ← **ここで終わり。受け皿が無い**
```

**止まる箇所はこの `if / elseif` の連なりの末尾。** 見出しに当たらない続きの行は
どの枝にも入らず、**`else` が無いので黙って落ちる**。
複数行を拾えていたのは `そのまま:`（`$inRaw` で行を溜める）**だけ**だった。

## ② 直し — 続きの行を、いまの欄へ足す

```powershell
$cur = ''                      # いま読んでいる欄
… 見出しの枝がそれぞれ $cur を置く（完了・ファイル・実測・実機・未検収・待ち・外待ち）
elseif ($t -eq '') { $cur = '' }          # 空行で欄を閉じる
elseif ($cur) { …いまの欄へ改行つきで足す… }
```

＊**件名・印・種類は続きを取らない**（一行で足りるので `$cur` を空にする）。
＊次の見出しが来れば、その枝が `$cur` を置き直す。

## ③ 実測

**控えの読み手**（写しに probe。本文5行＋ファイル＋実測＋実機の控えで回した）

```
件名 : 写しの切れ-1（作り値）
完了 : 5行   ← 直す前は 1行
       | 本文の一行目です。 … | 本文の五行目です。
ファイル : panel.html／panel-check.js
実測 : 作り値で5行を確かめた
実機 : 版の字が新しくなっていること
→ 本文5行が全部入ったか : ○ 5行
```

**パネル**（`node panel-check.js` の ⑫ を新設）

```
⑫ 本文の全行が写しへ入る
  ✓ 本文5行＋実測＋実機が入り、ファイルの行だけ落ちた（写し 11行）
```

**`panel-check.js` は ①〜⑫ すべて PASS。**

**版** — `panel.html` は切れていなかったので**動きは変えていない**。
`bundleCards` の上へ**この件の裏（ここではなかったこと）を注記**として残し、**panel v112** とした。

**実機で見るところ**
- 版の字が **panel v112**
- **次の終わりの札から、本文が一行で切れず、控えに書いた行数ぶん載っている**
- 「まとめて写す」で貼ると、その本文が**全行**入っている（`ファイル:` の行だけは今までどおり落ちる）

写し `.bak-20260903b`／構文OK **2752行**／BOM 有り。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **118件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`写しの切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E5%88%87%E3%82%8C-1.md) | 09-03 10:03 | 写しの切れ-1 — 切っていたのは `buildBundle` ではなく、見張りの控えの読み手 |
| [`札の抜け-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2-2.md) | 09-03 06:43 | 札の抜け-2（続き）— 昨夜の直しは**一度も働いていなかった**。枝の順が原因 |
| [`通知の分け方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%88%86%E3%81%91%E6%96%B9-1.md) | 09-02 23:05 | 通知の分け方-1 — 長い報告は ntfy へ送らない。札にして、釦で一枚で写す |
| [`札の抜け-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2.md) | 09-02 22:55 | 札の抜け-2 — 取り逃がした stop を拾い直す（終わりの札を運任せにしない） |
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

<!-- 控えの一覧 ここまで -->
