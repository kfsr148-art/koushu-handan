# 土台の直し-1（実装）— shanten を analyze() の外へ持ち上げ、写し二つを廃した（v1438）

**終わり（残り3件）**（VAIO 20:27）— ①〜⑥ 済。**フル版 PASS**（19:31:06→20:18:09・47分・㉓ 16手とも同じ）／**速い版 PASS**（㉒ PASS・㉓ SKIP）／**adv-check PASS**。v1438 として一度で commit・push。

実機: 画面の右下の版の字が **v1438**。**判定の中身（攻守・判定獣・見立て行・光る牌・切り候補）は一つも変わらない**のが合格。

## 何を変えたか

| # | どこ | どうした |
|---|---|---|
| ② | `shanten` | `analyze()` の中から**直前へ字のまま**移した。指紋（名を X に換え空白を畳んだ字面の sha256）は **`caee8a3d…` のまま**・実行59行 |
| ② | `cutShanten`・`cutShantenMin` | **削った（107行）**。`pickCutTile` の3箇所（候補の向聴・受け入れの土台・受け入れの一牌ごと）を `shanten(` へ |
| ② 甲 | `analyze()` の戻り値 | `doraCode: doraIndicator ? indicatorToDora(doraIndicator) : null` を一つ足した（式は `analyze()` の中 L2923 と同じ） |
| ② | `window._doraCode` | **外した**（作法15）。`valueTile` は `a.doraCode` を読む |
| ③ | `check.js` ㉒ | 「写しが本体と同じか」→「**写しが無く、持ち上げた shanten が元のままか**」。写しの定義・呼び出し・`window._doraCode` が0件／`shanten` は一つで `analyze()` の外／指紋一致／配線 |
| ③ | `check.js` ㉓（新） | **16手の第一感を移す前（v1437）と突き合わせる**。攻／守と判定獣・見立て行・光る牌（金枠7種・道具3種・切り候補）。**フル版だけ**（16手で数分）。速い版は SKIP |
| ④ | `CLAUDE.md` 作法5 | 「変更禁止」→「**宣言とヨシを取ってから**」。改めた日と理由を一行 |
| ⑤ | 版 | **v1438** を三箇所同時（`data-ver`・`verTag`・`ver.txt`） |

＊本体の差分 … **+97／−206**（差し引き −109行＝写し107行と `window._doraCode` の二行。`shanten` の90行は字のまま移動）
＊ほかに `check.js`（㉒の置き換え・㉓の追加）／`CLAUDE.md`（作法5）／`ver.txt`／`first-sense-base.json`（新・16手）／`serifu.txt`・`serifu-adv.txt`（再抽出 7593行・口調の混入0。**違いは行番号と版だけ**——数字を除けば一字違わないことを確かめた）
＊`node --check` … 本体の script 4塊とも通過／`check.js` 通過
＊**シムなし**（本体に仕掛けは入れていない。probe は写しにだけ差した）

## 一、移す前の答えと、移した後の答え

**16手とも、移す前（v1437）と移した後（v1438）で一字も違わない。**

比べたもの … 攻／守と判定獣／見立て行（執事）／光る牌12種（金枠7種・現場猫・枝豆・紳士）／切り候補（`cut-mark`）。
裁きの文は乱数で言い回しが替わるため、攻／守と判定獣だけを比べた（同じ手を二度流して言い回しが替わることを実測で確かめた）。

| 手 | 裁き | 切り候補 | |
|---|---|---|---|
| 3455m2367p1189s7z | 🐅攻 | 12:C | ✓ |
| 123m456p789s1122z | 🐑守 | 9:E | ✓ |
| 1119m1112345p11s | 🐅攻 | 3:九萬 | ✓ |
| 19m19p19s1234567z | 🐦‍🔥攻 | 6:E | ✓ |
| 1122334455667m | 🐦‍🔥攻 | 0:一萬 | ✓ |
| 2345678m234p55s | 🐅攻 | （無し） | ✓ |
| 1234m1234p1234s5z | 🐑守 | 12:P | ✓ |
| 5556667778889m | 🐦‍🔥攻 | 3:六萬 | ✓ |
| 1112345678999m | 🐦‍🔥攻 | 3:二萬 | ✓ |
| 3334m5556p7778s | 🐦‍🔥攻 | （無し） | ✓ |
| 1289m1289p1289s1z | 🐑守 | 12:E | ✓ |
| 4567m4567p4567s | 🐅攻 | （無し） | ✓ |
| 1133557799m11p1s | 🐑守 | 12: | ✓ |
| 2233m4455p6677s1z | 🐭守 | 12:E | ✓ |
| 1234567m123456p | 🐅攻 | 0:一萬 | ✓ |
| 9999m8888p7777s1z | 🐦‍🔥攻 | 12:E | ✓ |

＊切り候補が（無し）の三手は12枚の手（13枚のときだけ言う作り）。
＊この移す前の答えを `first-sense-base.json` に置き、`check.js` ㉓ がフル版のたびに突き合わせる。
＊`shanten` の字面の指紋 … 移す前 `caee8a3d…`（`analyze()` の中）＝ 移した後 `caee8a3d…`（`analyze()` の外）。
＊移す前の写しは、改行を揃えれば HEAD（v1437）と一字違わないことを確かめてから録った。

## 検査

| | 結果 |
|---|---|
| フル版（21視野） | **PASS**。19:31:06 起動 → 20:18:09 終わり（**47分**）。⑦の `judged 800x381` は二択 bottom 377／381（v1436 で10px溢れた視野） |
| ㉓（フル版の中） | **16手とも、裁き・見立て行・光る牌が移す前と同じ** |
| 速い版 | **PASS**（20:19:43 → 20:26:10）。㉒ PASS／㉓ SKIP |
| adv-check | **全てPASS**（①即死罠・②時間切れ） |

## ついでに分かったこと

- **㉒ は、もともとまとめの一覧に出ていなかった。**`head()` だけで見出しを出し、一覧へ積む `section()` を通していなかったため
  （落ちれば終了コードには効くが、まとめの PASS／FAIL の並びに現れない）。㉓ も同じ形で書いてしまったので、**二つとも `section()` で包んだ**。
  これで速い版のまとめに `PASS ㉒`・`SKIP ㉓` が並ぶ（包まないと、㉓ の SKIP の印が死んだ行になる）。
- `window._doraCode` は、ドラを解除しても**前の値のまま残っていた**（`refreshDora` の解除の枝が早く返り、書き替えない）。
  甲で戻り値から読む形にしたので、この残りは消えた。**第一感の16手はドラ無しなので、ここは突き合わせに出ない。**
- 前の窓の `first-sense.js` は、一時の名が `fs36-`・内側の上限なし・16手を一度に流す形だった（作法35 の元になった台）。
  名を `koushu-fs-` に、上限180秒・3手ずつ・出はけはファイルへ、に直して回した。
  **一度に数手を流すと二手目から止まる**のは、判定後の画面を戻さずに次の手を入れていたため（`resetBoard()` を挟んで解けた）。
- 最初の並びの **14枚の二手**（`1112345678999m1z`・`1234567m1234567p`）は判定釦が押せず、**前の手の画面を読んでいた**。
  13枚の手へ替え、手ごとに「判定に入れたか」を控えて、入れていない手は落ちにした（台・㉓とも）。
- フル版の待ち手（背後の見回り）が**空き物理メモリ不足で二度落とされた**（20:04・20:06。空きは 711〜836MB／4GB）。
  フル版そのものは生きていたので、前面で9分ずつ待ち、そのたびに帯を継ぎ足して通した。
- `SKILL.md` §10 は、まだ「変更禁止・呼び出し方を変えるのも不可」のまま。作法5 と食い違う。**直すなら一段**（頼まれていないので触っていない）。

## ⑥ 09-09 の枠の様子

| 件 | 様子 |
|---|---|
| 帯の中の黙り-1 | **実地で一度も鳴っていない。**`heavy-life.log` が一度も作られていない（09-08 03:00〜07:26 の長い帯でも無音）。`heavy-on.ps1` が `heavy-life.ps1` を `-MaxMin` 無しで起こし、**既定40分で手が終わる**（帯そのものも30分で切れる）ため、**60分の枝に届かない**。作り値の5通りは通っていたが、実地の道では届かない形 |
| 黒猫の待機-2 | ①〜⑤済・⑥該当せず（比1.07 → 白版で16.17・panel v122）。その後 黒猫の待機-3 で黒版へ戻した（v125） |
| 巡回の止まり-1 | ①〜③済。三つの読みは太っていない（923行/45KB・0.3秒）。原因は前の回の居座り（PT0S で殺されず IgnoreNew で43分ぶん捨てられた） |

## 残り

**残り3件**（`orders-open.tsv` の未了）

1. **帯の中の黙り-1** … 進行中。上の⑥の穴（`-MaxMin` 既定40分で60分の枝に届かない）が残っている。直すかどうかの裁定待ち
2. **見張りの後始末-1 ③** … 0x4A の追い込み。昇格の問いに誰も押さず止まっている（「出して」待ち）
3. **公開の止まり-1（別に見つけた）** … 押しの錠の名が `git-push.ps1` だけ食い違っている、で裁定待ち。
   ＊ただし `git-push.ps1` L150 に「**`\` を落とさない（2026-09-10・作法34 の型）**」の註と `'Local\ClaudeGitPushGate'` があり、**既に直っている恐れがある**。台帳は未了のまま触っていない

＊凍結-0 は決まりとして発効中（仕事ではないので数えない）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **198件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`土台の直し-1の宣言.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%A3%E8%A8%80.md) | 09-09 05:55 | 土台の直し-1 — 宣言（ヨシ待ち） |
| [`serifuの再抽出.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/serifu%E3%81%AE%E5%86%8D%E6%8A%BD%E5%87%BA.md) | 09-09 04:50 | serifu.txt / serifu-adv.txt の再抽出（作法17） |

<!-- 控えの一覧 ここまで -->
