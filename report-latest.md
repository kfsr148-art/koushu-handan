# 落ちた後の起こし-1 と 帯の中の黙り-1（乙）— 三件とも済

**終わり（残り1件）**（VAIO 00:48）— 頼まれた順（落ちた後の起こし-1 を先に）で三件を済ませた。本体（`koushu-handan.html`）には触っていない。

## 一、ログオン時に claude --continue を起こす仕事

| | |
|---|---|
| 置き場 | **`ClaudeCodeAtLogon`** は 2026-09-10 に置いたものが**既に在った**（作り直していない） |
| 中身 | ログオン時・user・対話・上限なし・`IgnoreNew`。`powershell -NoExit` で `koushu-handan` へ移り `claude.exe --continue` |
| 手で叩く前 | 前の窓（claude 6360・09-10 18:30〜・遊んでいた）が走っており、`IgnoreNew` のため叩いても起きない状態だった → **止めて Ready に戻した** |
| 手で叩いた | **00:42:14** → 00:42:16 に claude 5684 が起きた |
| 一覧の実測 | 叩いた直後の一覧に **`koushu-handan-b5 · interactive · idle · started 1m ago`** と **`Claude Code crash recovery · Remote Control · idle`**（叩く前には無かった行＝Code タブに出る行）が現れた |
| 増えた窓 | **00:43:55 に止めた**。残る claude はこの窓（1928）だけ・task は Ready・ログオンの引き金は有効 |

＊止めた後も、Remote Control の行「Claude Code crash recovery」は数分 `idle` のまま一覧に残っていた（ローカルの行はすぐ消えた）。一覧の側の反映の遅れと見ている。
＊**気を付ける点**：`--continue` は**この場所でいちばん新しい会話**を継ぐ。窓が生きているときに叩くと、**その同じ会話をもう一本の窓で開く**。ログオン時（窓が無いとき）に起きる分には問題ない。

## 二、読むだけの形を allow へ

| | |
|---|---|
| 足した所 | `koushu-handan/.claude/settings.json` の `permissions.allow`（**20→24件**・写し `.bak-20260911`） |
| 足した四項 | `Bash(tail *)`／`Read(~/.claude/**)`／`Read(//c/Users/user/.claude/**)`／`Read(//c/Users/user/AppData/Local/Temp/**)` |
| 元から在った | `awk`・`cat`・`ls`・`head`・`git log`・`git status`（Bash）と `Read`・`Glob`・`Grep` |
| 訊かれていた元 | 命令そのものは許されていても、**作業場の外（`~/.claude`・`AppData\Local\Temp`）の道**に触ると道の決まりで止まる。そこを Read の決まりで開けた |
| 足していない | 書き換え・削除・commit・push。＊ただし `Bash(rm *)`・`Bash(git rm *)`・`Bash(git commit *)`・`Bash(git push *)` は**元から在る**（触っていない） |
| 実測 | **別の `claude -p`**（`--permission-mode default`・フックは切った＝本物の知らせは鳴らない）で10の形（Bash 8＝`ls ~/.claude \| head`・`cat … \| head`・`tail`・`awk … \| tail`・Temp の `head`・Temp の `ls \| head`・`git log`・`git status \| head`／Read 2＝`~/.claude` と Temp のファイル）を順に走らせ、**承認が要った数 0**（`permission_denials` 空・10件とも一度ずつ走った） |

＊この窓は自動モードで回っているので、この窓で走らせても「分類器が通した」と見分けが付かない。だから**承認が出れば必ず拒みとして残る default の別の窓**で測った。
＊`.claude/settings.local.json` の `defaultMode` は `bypassPermissions`（触っていない）。

## 三、帯の中の黙り-1（乙）— 最初の刻を heavy-first.txt に持つ

| 台本 | 直したこと |
|---|---|
| `heavy-on.ps1`（50→74行） | **生きている帯が無いとき**（`heavy.txt` が無いか30分を過ぎている）だけ `heavy-first.txt` に最初の刻を書く。継ぎ足しでは触らない。直す前から続く帯は、いまの `heavy.txt` の刻を最初とみなす |
| `heavy-off.ps1`（63→70行） | `heavy-first.txt` を消す（`heavy.txt` の有無より先に） |
| `heavy-life.ps1`（108→122行） | 途中経過の齢・区切り・「鳴らした」の鍵を **`heavy-first.txt` の刻**から取る。無ければ `heavy.txt` の刻に落とす |

＊`heavy.txt` の形は変えていない。三つとも写し `.bak-20260911`・構文OK（Tokenize で err 0）・BOM 有。
＊三つの台本は**改行が混ざっている**（CRLF の中に LF の行）。直しは錨の行の後ろの改行に合わせて入れた。

**写しに偽の送り手を差した試し（六通り・本物の ntfy は叩いていない）**

| 形 | 結果 |
|---|---|
| 最初から61分・最後の刻から5分 | ✓ 一発 |
| 同じ帯（最初の刻の字面そのまま）でもう一度 | ✓ 鳴らない |
| 同じ帯へ継ぎ足し（最後の刻だけ新しく） | ✓ 鳴らない（**直す前はここで鍵が変わっていた**） |
| 別の帯・最初から91分 | ✓ 区切り1で一発 |
| `heavy-first.txt` が無い（最後の刻から5分） | ✓ 鳴らない |
| 最初から59分 | ✓ 鳴らない |

**本物の heavy-on／heavy-off で四通り**

| 形 | heavy.txt | heavy-first.txt | |
|---|---|---|---|
| 新しい帯 | 00:46:26 | 00:46:26 | ✓ 最初＝刻 |
| 継ぎ足し | 00:46:32 | 00:46:26 | ✓ 最初はそのまま |
| 切れた帯（40分前）へ heavy-on | 00:46:36 | 00:46:36 | ✓ 新しい帯として書き直し |
| heavy-off | 無し | 無し | ✓ 両方消えた |

＊実地で60分の途中経過が鳴るのは、次に60分を超える重い帯（フル版など）。

## 途中のしくじり（隠さずに）

- 台本の直しの一回目は、**錨を改行ごと探した**ため混ざった改行に合わず、**何も書かずに止まった**（三つとも元のまま）。一行の錨に替えて入れ直した。
- 六通りの試しの一回目は二件落ちた。**試しの側が同じ帯の刻を毎回作り直していた**ため（別の帯として鳴るのが正しい）。同じ帯は字面を使い回す形に直して六通りとも通った。
- 本物の四通りの一回目は、読む手の名を **`rd`** にしてしまい、PowerShell では **`rd` が Remove-Item の別名**なので、読むたびに `heavy.txt`／`heavy-first.txt` を**消していた**。結果は無効とし、名を替えて取り直した。消えたのは試しの帯の二つだけで、最後に heavy-off を通して見張りの上限（PT10M）も戻っている。
- 台帳（`orders-open.tsv`）も改行が混ざっていて、書き替えの一回目が0行に当たった（書かずに止まった）。行ごとの改行を保つ形で書き直した。

## 残り

**残り1件**

1. **見張りの後始末-1 ③** … 0x4A の追い込み。昇格の問いを VAIO の画面で押してもらう待ち（「出して」の合図で、もう一度問いを出す）

＊凍結-0 は決まりとして発効中（仕事ではないので数えない）。
＊v1438 の実機は検収待ち（右下の版の字が v1438・判定の中身は不変が合格）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **200件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0911-0047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0047.md) | 09-11 00:47 | 落ちた後の起こし-1 と 帯の中の黙り-1（乙）— 三件とも済 |
| [`y0910-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-2255.md) | 09-10 22:53 | 帯の中の黙り-1 — 直し方の裁定のお願い（印 y0910-2255） |
| [`土台の直し-1の実装.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%9F%E8%A3%85.md) | 09-10 20:27 | 土台の直し-1（実装）— shanten を analyze() の外へ持ち上げ、写し二つを廃した（v1438） |
| [`y0910-1752.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1752.md) | 09-10 17:53 | 押しの黙り-1 — 押しの失敗と .git の壊れを訴えへ足した（印 y0910-1752） |
| [`y0910-1727.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1727.md) | 09-10 17:30 | 旧版の窓を止め、ログオン時の起こしを置いた（印 y0910-1727） |
| [`y0910-1655.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1655.md) | 09-10 17:00 | 錠の名を揃え、落ちの正体を割った（印 y0910-1655） |
| [`y0910-1305-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-3.md) | 09-10 15:16 | pub-read の始末と、長く走る命令の上限（印 y0910-1305-3） |
| [`y0910-1305-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-2.md) | 09-10 15:04 | 読むだけの台本と、公開の止まりの割り直し（印 y0910-1305-2） |
| [`y0910-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1330.md) | 09-10 13:36 | 公開の止まり-1（印 y0910-1330） |
| [`y0910-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305.md) | 09-10 13:09 | 承認の足止めと自動モードの戻し道（印 y0910-1305） |
| [`y0910-0052-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052-2.md) | 09-10 01:30 | 一分おきの走り出し-1-2 — 甲で直した。作り値は三通りとも一本 |
| [`y0910-0052.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052.md) | 09-10 00:56 | 一分おきの走り出し-1 — 口を塞いだ。原因は**件名の末尾の空白** |
| [`ヨシの猫の組み直し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E7%B5%84%E3%81%BF%E7%9B%B4%E3%81%97.md) | 09-09 19:26 | ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる** |
| [`ヨシの猫のマス目.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E3%83%9E%E3%82%B9%E7%9B%AE.md) | 09-09 16:38 | ヨシの猫を差し替え-1 — マス目の割り出しと、箱を上げる案 |
| [`土台の直し-1の四段.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%9B%9B%E6%AE%B5.md) | 09-09 13:02 | 土台の直し-1 ① — 四段の材料の出どころ（名指しの一覧） |
| [`ヨシの猫を差し替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%82%92%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88-1.md) | 09-09 13:02 | ヨシの猫を差し替え-1 — 素材を測った。**輪郭が潰れるので止まる** |
| [`巡回の止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-09 12:16 | 巡回の止まり-1 — 11:02〜11:45 の43分 |
| [`土台の直し-1の材料.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E6%9D%90%E6%96%99.md) | 09-09 11:59 | 土台の直し-1 ① — 切り候補の四段は、いまどこから値を取っているか |
| [`猫を全部白へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%82%92%E5%85%A8%E9%83%A8%E7%99%BD%E3%81%B8-1.md) | 09-09 11:06 | 猫を全部白へ-1 — 頭の猫が地に沈む件（全状態） |
| [`黒猫の待機-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-3.md) | 09-09 09:54 | 黒猫の待機-3 — ヨシ待ちの猫を白から黒へ戻す |

<!-- 控えの一覧 ここまで -->
