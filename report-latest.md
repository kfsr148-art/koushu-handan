# 巡回の止まり-1 — 11:02〜11:45 の43分

**帳面は太っていない。読みは 0.2〜0.4秒で、9/6 の形とは別の止まり。**
原因は外側の**前の回の居座り**。刈る相手が無いので、刈っていない。

## ① 帯の中に終わった仕事はあったか

**あった。猫を全部白へ-1。ただし「終わりの回」ではなく「ヨシ待ちの回」だった。**

```
10:54:31  resume（猫を全部白へ-1 の指示）
11:31:36  stop
11:31:40  stop        ← 納品の報告で止まった
11:56:20  resume
```

その回の控えは `待ち:` が「なし」ではなく、**ヨシ待ちを抱えていた**
（`印: y0909-1` ／ 待ちは土台の直し-1 の宣言と素材待ち）。

| 見たもの | 結果 |
|---|---|
| 終わりの札（✅） | **立っていない**——**それが正しい**。終わりの回ではないため |
| 実際に立った札 | **11:44:11 🙋 ヨシしてください**（猫を全部白へ-1／素材待ち） |
| 立て直し（`done-swept`） | **拾っていない**——`待ち: なし` でないので、⑨は正しく降りている |
| いま立て直せるか | **立て直す相手がいない**（終わりの回ではない） |

＊`note-at-stop.txt` は `at=1788918662`＝**10:51:02** の写しで、11:31 の止まりのものではない。
　`stop-guard` は「控えあり…通す」の道でだけ写すので、11:31 の止まりでは走っていない。
　ただし**この回に関しては要らない**（終わりの札を立てる回ではないため）。

### 立て直しは、別の二回で実地に働いていた

前の枠で「次に起きた回の `done-swept` を出す」と控えていた分。**二回とも働いている。**

```
2026-09-08 22:41:59  done-swept  終わりの札が立っていなかったので立て直した（写しの重さ-1・stop 22:37:15・**4分遅れ**）
2026-09-09 04:01:37  done-swept  終わりの札が立っていなかったので立て直した（兎の台詞-1・stop 03:49:17・**12分遅れ**）
```

**遅れは 4分 と 12分**。どちらも「10分の巡回＋3分の待ち＝最大13分」の見込みの中に収まった。

## ② 止まった理由

### 毎分の巡回が読む三つ — 太っていない

| 帳面 | いま | 9/6 に刈った後 |
|---|---|---|
| `watch-step-log.txt` | **923行 / 45,196バイト** | 800行 / 38KB |
| `work-note.txt` | 36行 / 4,631バイト | — |
| `work-started.txt` | 2行 / 115バイト | — |

`watch-step-log.txt` は 800行から少し伸びているが、刈りの閾値（1,000行）の内側。
**読みの実測はどれも1秒未満**で、9/6 の 904ms のような詰まりは出ていない。

```
11:48:00  開始                   +0秒
11:48:01  窓とプロセスを数えた    +1.1秒
11:48:02  hook.log を読んだ       +0.3秒
11:48:02  控えを読んだ            +0.3秒   ← 三つを読む段はここ
11:48:34  知らせの判定を終えた    +31.6秒  ← 重いのはこちら
```

**重いのは「知らせの判定」の側**で、読みの側ではない。

### 止まりの正体 — 前の回の居座り

```
10:55:12  開始                +0秒
10:55:13  窓とプロセスを数えた +0.9秒
10:55:14  hook.log を読んだ    +0.4秒
10:55:14  控えを読んだ         +0.2秒
11:00:34  知らせの判定を終えた **+320秒**
          （↑ ここで途切れ。「完了」が無い）

11:43:35  開始                ← **43分の穴**
11:43:32  前の回は途中で終わっていた → 2026-09-09 11:00:34 / 知らせの判定を終えた / +320秒（その段のまま 43分）
11:43:50  異常の押し送りを一発出す（stall:2026-09-09 11:00:34）
11:45:09  🪟 異常です（手が要ります）
```

**帯の見送りは 0行**（11:00〜11:50 の `heavy-skip.log` は空）。上限で殺されたのでもない。

見張りの予定の設定を見ると理由が揃う。

```
ExecutionTimeLimit : PT0S      ← 上限**無し**
MultipleInstances  : IgnoreNew ← 走っている間、新しい起動は**捨てられる**
```

> **一行でいうと** … 重い帯で上限が `PT0S`（無制限）へ外れている間に 10:55 の回が
> 「知らせの判定」で固まり、**上限が無いので殺されず**、`IgnoreNew` によって
> **11:01〜11:43 の毎分の起動が全部捨てられた**。帳面の太りでも、帯の見送りでもない。

＊`10:55:11` に「見張りの上限を元（PT10M）へ戻した」記録はあるが、**その1秒後に始まった回**が
　止まっている。予定の上限は**起動のときに効く**ので、戻した設定はこの回には掛からなかった。
＊いまも `PT0S`（`12:00:03` に `pre-push の検査` の帯がまた開いているため）。

## ③ 刈り

**していない。**太っていないため、刈る相手が無い（923行は閾値1,000行の内側）。
土台には触っていない。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **184件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`巡回の止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-09 12:16 | 巡回の止まり-1 — 11:02〜11:45 の43分 |
| [`土台の直し-1の材料.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E6%9D%90%E6%96%99.md) | 09-09 11:59 | 土台の直し-1 ① — 切り候補の四段は、いまどこから値を取っているか |
| [`猫を全部白へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%82%92%E5%85%A8%E9%83%A8%E7%99%BD%E3%81%B8-1.md) | 09-09 11:06 | 猫を全部白へ-1 — 頭の猫が地に沈む件（全状態） |
| [`黒猫の待機-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-3.md) | 09-09 09:54 | 黒猫の待機-3 — ヨシ待ちの猫を白から黒へ戻す |
| [`土台の直し-1の宣言.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%A3%E8%A8%80.md) | 09-09 05:55 | 土台の直し-1 — 宣言（ヨシ待ち） |
| [`serifuの再抽出.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/serifu%E3%81%AE%E5%86%8D%E6%8A%BD%E5%87%BA.md) | 09-09 04:50 | serifu.txt / serifu-adv.txt の再抽出（作法17） |
| [`兎の台詞-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E5%8F%B0%E8%A9%9E-1.md) | 09-09 03:27 | 兎の台詞-1（出し直し）— serifu.txt の中の兎 |
| [`写しの重さ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%87%8D%E3%81%95-1.md) | 09-08 22:26 | 写しの重さ-1 — note-at-stop.txt は帳面として太るか |
| [`取り残しの検収-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97%E3%81%AE%E6%A4%9C%E5%8F%8E-1.md) | 09-08 22:03 | 取り残しの検収-1 |
| [`前の仕事の取り残し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%89%8D%E3%81%AE%E4%BB%95%E4%BA%8B%E3%81%AE%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97.md) | 09-08 21:15 | 前の仕事の取り残し — 次の指示が先に来た回の落ち |
| [`終わりの札-2の検収.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2%E3%81%AE%E6%A4%9C%E5%8F%8E.md) | 09-08 20:28 | 終わりの札-2 の検収と、窓の幅の裁定材料 |
| [`終わりの札-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2.md) | 09-08 20:03 | 終わりの札-2 — 終わりの札が立たない根を直す |
| [`止まりの見分け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AD%A2%E3%81%BE%E3%82%8A%E3%81%AE%E8%A6%8B%E5%88%86%E3%81%91-1.md) | 09-08 19:03 | 止まりの見分け-1 — 生存が書かれないのに「作業中」が延び続ける件 |
| [`猫の矛盾-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E7%9F%9B%E7%9B%BE-1.md) | 09-08 11:18 | 猫の矛盾-1 — 走っているのに頭の猫が寝ている件 |
| [`終わりの札-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-1.md) | 09-08 09:40 | 終わりの札-1 — 終わった知らせが手元に残らない件 |
| [`検査の重さ-1の調べ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9-3.md) | 09-08 07:57 | 検査の重さ-1 の調べ — 四つの数と、削れそうな所 |
| [`検査の重さ-1の調べ-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9-2.md) | 09-08 07:12 | 検査の重さ-1 の調べ（出し直し）— 21視野のフル版 一回の内訳 |
| [`黒猫の待機-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-2.md) | 09-08 06:25 | 黒猫の待機-2 — ヨシ待ちの猫が地に沈む件 |
| [`検査の重さ-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-08 00:50 | 検査の重さ-1 の調べ — 21視野の一回に、何がどれだけ掛かっているか |
| [`配牌の目安-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%85%8D%E7%89%8C%E3%81%AE%E7%9B%AE%E5%AE%89-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:18 | 配牌の目安-1 の調べ — 13枚から何を持っているか |

<!-- 控えの一覧 ここまで -->
