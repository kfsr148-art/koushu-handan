# 地図の穴-1 — 八段それぞれの「読む物が壊れたとき」

**状態** … ①③は書いた／②は三つ直した／④作り値は**偽の送り手**で回し、実地も一回見た

## ① 段ごとの穴（無い・古い・壊れている、のとき何が起きるか）

| # | 段 | 読む物 | 無い | 古い | 壊れている |
|---|---|---|---|---|---|
| 1 | 開始 | — | — | — | 足跡が書けないだけ … **進む** |
| 2 | 窓とプロセス | プロセス表・窓 | 数えられず `$alive=0` … **誤って鳴る**（🪟 窓が落ちた） | — | 同左 |
| 3 | hook.log | `hook.log` | 位相の鍵が決まらない … **黙る**（何も立たない） | 鍵が前のまま … **黙る**（終わりが出ない） | 途中で切れた行 … 鍵が `idle` に落ち **黙る** |
| 4 | 控え | `work-note.txt` | 件名も待ちも空 … **黙る**（🙋 が立たない） | 前の件名のまま … **誤って鳴る**（別件の題で知らせる） | 見出しが欄を開かない … **黙る**（本文が空の札） |
| 4 | 開始の時計 | `work-started.txt` | `$ovAt=0` … **黙る**（走り出しも経過も出ない） | 前の仕事の刻 … **誤って鳴る**（終了予定がずれる。09-02 に実際） | `at=` が数字でない … **黙る** |
| 5 | 知らせの判定 | `notify-hold.tsv` | 溜めが無いだけ … **進む** | — | **読めないまま居座る … 黙る**（09-03 に **680回**積もった） |
| 5 | 一発の印 | `start-pushed.txt` ほか | 一発が二度出る … **誤って鳴る** | 仕事が替われば落ちる … **進む** | 鍵が合わず … **誤って鳴る** |
| 5 | 送り先 | `rc-ntfy-topic.txt` | 押し送りが**黙って**失敗 … **黙る** | — | 同左 |
| 6 | 使用量 | `usage.json` | 前の値を出す … **進む**（`usage-good.json` が受ける） | 同左 | 空を見分けて控えへ落ちる … **進む** |
| 6 | 版 | `claude --version` | 一日一度・上限8秒で諦める … **進む** | 前日の値 … **進む** | 同左 |
| 7 | 完了 | — | — | — | **進む** |
| 8 | 押しの足跡 | `push-trace.tsv` | 記録が欠けるだけ … **進む** |

**巡回そのものが「止まる」形は無い。**読む所はすべて `try { } catch { }` で包んであり、
壊れた入力は**黙るか、誤って鳴るか**に倒れる。**止まるのは外側**——上限（PT10M）で殺されるか、
前の回が残って予定表が起こしを捨てる（ID=322）か、重い帯で見送られるか。

## ② 塞いだ三つ（四つの大元には触っていない）

`pipe-check.ps1`（読むだけの見張り）に足した。訴えは**その回に一発鳴る**（先の穴-1 ②の道）。

| 印 | 見るもの | 何を防ぐか |
|---|---|---|
| `hold-stuck` | `watch-notify.log` の直近60行に「溜めた知らせが読めない」が**5回以上** | **09-03 の680回**と同じ形。出すべき知らせが出ないまま誰も気づかない |
| `clock-broken` | `work-started.txt` の `at=` が数字か・`subj=` が有るか | 走り出しも経過も出なくなる（黙る） |
| `hook-none` | `hook.log` が無い／空 | 位相の鍵が決まらず、知らせの出方が全部変わる |

**どれも読んで数えるだけ。**位相の鍵にも札の作りにも印にも `analyze()` にも触っていない。

## ③ 触らないと塞げないもの（実装せず、ここに書き止める）

| 穴 | 何が起きるか | どれくらい | 触る所と代償 |
|---|---|---|---|
| **控えが前の件名のまま** | 別件の題で知らせる（誤って鳴る） | 手で書き替えていた頃は日に数回。いまは枠を受けた場で機械が書くので**ほぼ無い** | 控えの読み（**判定**）。古い控えを「無い」と見なす形にすると、**書きかけの回に黙る**代償 |
| **一発の印が壊れる／消える** | 同じ知らせが何度も鳴る | 印は毎回上書きなので稀。仕事が替わる回に集中 | **一発の印**そのもの。鍵に何を入れるかを変えると、過去の印が全部合わなくなり**一度は全部鳴り直す** |
| **溜め場が読めないまま居座る** | 出すべき知らせが永久に出ない | 09-03 に一度（680回積もった） | **札の作り**。溜め場を捨てる形にすると**中身が永久に失われる**（いまは残して気づけるほうを選んでいる）。②の訴えで「気づく」ところまでを外から塞いだ |
| **hook.log が壊れて鍵が `dead` に落ちる** | 窓は生きているのに🪟が鳴る（誤って鳴る） | 断線のたび。8月に3回 | **位相の鍵**。窓の数で上書きする形にすると、**本当に落ちた回を見逃す**代償 |
| **話題名が空** | 押し送りが黙って失敗する | 設定を触った回だけ | 送り口（`Push-Ntfy`）。既に `topic` の訴えが出るので、**外からは塞げている** |

## ④ 実測

**作り値（`pipe-check.ps1` の写しを砂場で回し、送り手は偽物に差し替え。本物へは一通も送っていない）**

```
(甲) 三つとも正しい          → 新しい訴えは出ない
(乙) 溜め場が読めないまま8回  → **hold-stuck** が鳴った
(丙) 開始の時計が壊れている    → **clock-broken** が鳴った
(丁) hook.log が無い          → **hook-none** が鳴った
偽の送り手が受けた題 … 🪟 連携に訴えがあります（hold-stuck）／（clock-broken）／（hook-none）
```

**実地（本物を一回）**

```
00:47:09  三つとも鳴らない（溜め場は無し／時計は at= が数字／hook.log は 7431行）＝正しい
          同じ回に cards-full が鳴った … **札が 40/40 に張り付いた**
```

＊`cards-full` が出たということは、**ここから押し出しが始まる**。
　先の穴-2 ②で入れた `notices-archive.json` が、いよいよ働き始める所。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **148件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`地図の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%B0%E5%9B%B3%E3%81%AE%E7%A9%B4-1.md) | 09-06 00:48 | 地図の穴-1 — 八段それぞれの「読む物が壊れたとき」 |
| [`作り値の送り先-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%9C%E3%82%8A%E5%80%A4%E3%81%AE%E9%80%81%E3%82%8A%E5%85%88-1.md) | 09-06 00:34 | 作り値の送り先-1 — 作り値は偽の送り手へ。今夜の分は回し直した |
| [`見張りの地図.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E5%9C%B0%E5%9B%B3.md) | 09-06 00:34 | 見張りの地図 — `watch-notify.ps1` の巡回を、段ごとに開く |
| [`帯の中の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 09-06 00:17 | 帯の中の走り出し-1 — 帯をまたいだ走り出しを、関門が持って鳴らす |
| [`走り出しの黙り-3-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3-2.md) | 09-06 00:14 | 走り出しの黙り-3（差し替え版）— 9月1日の直しは残っている。弾いていたのは手前の二つ |
| [`走り出しの黙り-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3.md) | 09-06 00:06 | 走り出しの黙り-3 — 弾いていたのは見込みではなく「開始の時計」 |
| [`先の穴-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-2.md) | 09-05 23:15 | 先の穴-2 — 押し出した札を残し、件名を機械が書き、訴えを画面に出す |
| [`先の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-1.md) | 09-05 22:30 | 先の穴-1 — 生存を関門の外へ、訴えをその場で鳴らす |
| [`根の試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A0%B9%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-05 21:57 | 根の試験-1 — 本物の pre-push を一回通して、直りを見届けた |
| [`残りの根-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AE%8B%E3%82%8A%E3%81%AE%E6%A0%B9-1.md) | 09-05 21:22 | 残りの根-1 — 今日止めた分をまとめて直した |
| [`帯の漏れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E6%BC%8F%E3%82%8C-1.md) | 09-05 20:53 | 帯の漏れ-1 — 重い帯を pre-push 自身に持たせた |
| [`飽和の回避-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1-2.md) | 09-05 18:23 | 飽和の回避-1（追補）— 札を立て直した／控えが空だった理由 |
| [`飽和の回避-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1.md) | 09-05 16:29 | 飽和の回避-1 — 重い帯だけ、起こしを間引く |
| [`連携の改善-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E6%94%B9%E5%96%84-1.md) | 09-05 14:33 | 連携の改善-1 — 止めた5件を外から見る手で近づけ、訴えを定時へ乗せた |
| [`札の上限-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E4%B8%8A%E9%99%90-1.md) | 09-05 12:51 | 札の上限-1／手押しの錠-1 — 枚数を増やし、手押しも同じ錠を通した |
| [`連携の弱い所-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E5%BC%B1%E3%81%84%E6%89%80-1.md) | 09-05 09:48 | 連携の弱い所-1 — 黙って壊れる所を洗い、外から見る手を立てた |
| [`機械の詰まり-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1-2.md) | 09-05 09:37 | 機械の詰まり-1（数え）— 夜は明確に減った。残っているのは**こちらが検査を回している帯** |
| [`矛盾の三つ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%9B%E7%9B%BE%E3%81%AE%E4%B8%89%E3%81%A4-1.md) | 09-04 12:31 | 矛盾の三つ-1 — 三つとも「材料を読む所」がずれていた |
| [`見張りの×-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%C3%97-1.md) | 09-04 10:09 | 見張りの×-1 — 「×2147946720」は死んでいた印ではなく、**その一分の起こしを見送った印** |
| [`機械の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-04 06:06 | 機械の詰まり-1 — 現場を押さえる手を入れ、押す者を一度に一人にした |

<!-- 控えの一覧 ここまで -->
