# パネルの立て直し-1 — 開いた瞬間に「何が終わって何が待っているか」が読める形へ（panel v115）

**状態：終わり（実機で見てください）／本体（`koushu-handan.html`）には触っていない**

---

## ① 通知の印と札の印 — **もともと混ざっていなかった。外す印は無い**

置き場が別で、書く相手も別。

| | 置き場（localStorage） | 書く所 |
|---|---|---|
| 札 | `kh-panel-copied` | `copyBundle` の `copied[keyOf(d)]` |
| 通知 | `ntfyCopied.v1` | 同じ `copyBundle` の `ntfyCopied[ntfyKeyOf(e)]` |

**では「残3／9件」の6は何だったか — 分母の作り方でした。**

```
直近の「写せます（N件）」 = 2件（21:10:48）
控えにある通知の本数     = 7本
M = 2 + 7 = 9 ／ N = 3   →  「残3／9件」
```

`M` に**通知の在庫**（直近30本を溜めて持つ）を足していたのが誤り（v114 で入れた）。
在庫は**いまの束の大きさではない**ので、足すと分母だけが膨らみ、
**押してもいない札が写した扱いに見える**。**引き算の6は、誰も写していません。**

**直し** … `M` を元の意味（直近の「写せます（N件）」の数）へ戻した。
`N` は今までどおり**札と通知の両方**を数える。`N` が `M` より大きい回は `M` を `N` に揃える。

## ② 黄色の行 — 終わった題を先に

```
前 … 次の指示待ち
後 … 読みの道-3 が終わりました 21:16・次の指示待ち
```

題は最後に終わった札の一行目から**括弧より前**だけを採る（長い件名で行が溢れないため）。
刻は小さく添える。終わった札が見つからない回は、今までどおり「次の指示待ち」だけ。

## ③ 終わりの通知 😽 に、終わった仕事の題を入れる

```
前 … 😽 終わったにゃ、写して
後 … 😽 終わったにゃ、写して：読みの道-3
```

名は控えの件名から、**括弧より前**を28字まで。押し通知は題しか見えない場面が多いので、そこへ入れる。

## ④ 釦の下に、写せる札の目次

```
まとめて写す（残3／3件）
  札その3（作り値）              ✅ 21:19
  札その2（作り値）              🔎 21:11
  札その1（作り値）              ✅ 21:06
```

並びは釦の数と**同じ一回の走査**（`mergedTodo`）から取るので、数と中身がずれない。
通知は 📣。長い題は「…」で切る。

**併せて（パネルの見え方-1 ②）** 「直近に終わった仕事」は、**畳んだままでも題が読める**ように
表紙の下へ小さな行を足した（中身＝result は開いてから読む）。

## ⑤ 実測

**probe（札3枚＋通知2本。通知だけ写した印を先に置いて開いた）**

```
釦        : まとめて写す（残3／3件）      ← 通知を写しても札の残は動かない
札の印    : （空＝札には一つも付いていない）
黄色の行  : 札その3 が終わりました 21:19・次の指示待ち
目次      : 札その3 ✅ 21:19 ／ 札その2 🔎 21:11 ／ 札その1 ✅ 21:06
```

**溢れ（iPhone 縦・横）**

```
390x844 … 横溢れ 0件 ／ 文書幅 492（視野と同じ）
844x390 … 横溢れ 0件 ／ 文書幅 836（視野と同じ）
```

**`panel-check.js` の ⑭ を新設**し、**①〜⑭ すべて PASS**。

```
⑭ 通知の印は札に掛からない・題が出る・目次が並ぶ
  ✓ 通知だけ写しても札の残は 残3／3件のまま。札の印は空
  ✓ 黄色の行に題が先に出る（札その3 が終わりました 21:20・次の指示待ち）
  ✓ 釦の下に写せる札の目次が3行（題＋印＋刻）
```

## 併せて — ntfy へは題の一行だけ（2026-09-03 の決め）

**報告の本文・直書き・調べの答えを ntfy へ流す枝は止めた。** 中身は必ず札に立てる。

- 見張り（`watch-notify.ps1`）は **2026-08-24 から既に題だけ**（本文は受け取るが使わない）
- 手で送る `ntfy-say.ps1` も**題だけ**に揃えた（本文は幅ゼロ空白で潰す）
- **今後「知らせの本文へ直書き」の指示が来ても、パネルの札に書く**

**実機で見るところ**
- 版の字が **panel v115**
- 釦の下に**写せる札の題と刻が一行ずつ**並ぶ
- 黄色の行が「**〈題〉が終わりました HH:MM・次の指示待ち**」
- 「直近に終わった仕事」が**畳んだままで題が読める**
- 次の終わりの押し通知が「**😽 終わったにゃ、写して：〈題〉**」

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **126件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`終わりの黙り-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E9%BB%99%E3%82%8A-4.md) | 09-02 16:06 | 終わりの黙り-4 — 写せます（ready）を、終わりと同じ道へ乗せた |
| [`仕事の数え方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BB%95%E4%BA%8B%E3%81%AE%E6%95%B0%E3%81%88%E6%96%B9-1.md) | 09-02 14:40 | 仕事の数え方-1 — 生存確認を仕事に数えない。**できる。狭く取れば当てられる** |
| [`走り出しの時刻ずれ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E6%99%82%E5%88%BB%E3%81%9A%E3%82%8C-1.md) | 09-02 06:49 | 走り出しの時刻ずれ-1 — 「22時58分」は**前の仕事の開始 ＋ いまの見込み**だった |
| [`使用量の空振り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E7%A9%BA%E6%8C%AF%E3%82%8A-1.md) | 09-02 06:48 | 使用量の空振り-1 — 06:04 の取得は**成功していた**。本文が「枠の立っていない形」だった |
| [`走り出しの黙り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-2.md) | 09-01 21:17 | 走り出しの黙り-2 — 黙っていた理由は「見込みが無い」。見込み無しでも鳴らす形へ |

<!-- 控えの一覧 ここまで -->
