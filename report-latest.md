# serifu.txt / serifu-adv.txt の再抽出（作法17）

**ずれていたのは行番号だけ。台詞の中身は一字も変わっていない。**
再抽出で `--check` が両方とも「一致しています」になった。本体は変更していない。版番号も上げていない。

## 前後の実測

| | 抽出前 | 抽出後 |
|---|---|---|
| `serifu.txt` | 7,808行 / 1,574,256バイト | **7,808行 / 1,574,256バイト**（同じ） |
| `serifu-adv.txt` | 410行 / 47,019バイト | **410行 / 47,019バイト**（同じ） |
| `--check` | **serifu.txt が本体とずれています**<br>**serifu-adv.txt が本体とずれています** | **serifu.txt は本体と一致しています**<br>**serifu-adv.txt は本体と一致しています** |
| まとめ行 | 合計 7,593行 ／ 口調の混入 **0件** | 合計 7,593行 ／ 口調の混入 **0件** |
| 探偵編 | 238行 | 238行 |
| 版行 | `版 v1437` | `版 v1437`（**上げていない**） |

`koushu-handan.html` の差分は**空**。`data-ver="1437"` ／ `ver.txt` = 1437 も動かしていない。

## ずれの正体 — 行番号が5行ぶん高かった

改行を揃えて字数で比べると、**前後どちらも 792,705字で同じ**。
違っていたのは **7,617行**で、中身はすべて**行番号の桁だけ**。

```
7行目   前: ■ TONE_WORDS　［判定カード］　3143行〜
        後: ■ TONE_WORDS　［判定カード］　3138行〜
10行目  前:    3144 ｜ 執事 ｜ 執事(butler) / 攻め(a) ｜ 攻めるべき局面でございます
        後:    3139 ｜ 執事 ｜ 執事(butler) / 攻め(a) ｜ 攻めるべき局面でございます
```

**全体が −5 行。**兎の三行も 4160/4161 → **4155/4156** になり、本体の実際の行と一致した。

### なぜ5行ずれたか

`koushu-handan.html` は **v1437（`0f92f986`）以降、一度も触っていない**。
その v1437 の中で本体は **+58 / −7 行**変わっており、**serifu の抽出がその編集の途中で走った**。
だから記録された行番号が5行ぶん高いまま commit されていた。

作法17 が「台詞に触れた回は再抽出まで含めて納品」と言っているのは、まさにこの形を避けるため。
**今回は編集が全部済んだ状態で回したので、番号が本体に揃った。**

## 混入検査

規則は `serifu-extract.js` の中にあり、**持ち主でない話者に他人の口癖が出た行**を拾う。

```
他人の口癖（なのだ／にゃ／ぞ・べし／ノン・ウィ／ヨシ）が、持ち主でない話者の台詞に出た行。
複数の話者が一行に入る掛け合いは対象外。見るのは人柄七人の台詞だけで、
『…』で他人の言葉を引いている箇所は数えない。
```

ずんだは **「なのだ」だけ**を見る（`{ name:'ずんだ', owner:['ずんだもん','ずんだ'], words:['なのだ'] }`）。
「〜したのだ／〜されたのだぞ」は他の話者も普通に使う形なので拾わない。

**前 0件 ／ 後 0件。**

## 兎の三行は二欄のまま — 仕様どおり

抽出後も話者と鍵の道筋は付かない。

```
7685:   4155 ｜ ブロックが余っている。攻めだ。
7686:   4156 ｜ 残り枠が愚形で詰まる。守りだ。
7687:   4156 ｜ 形が足りない。守りだ。
```

**兎が特別扱いされているのではない。**`tenLeans` は `FUNCS` 側の節で、そこは字面をこう組む。

```js
const FUNCS = [
  ['toneAngleLine', '人柄ごとの見立て（助言欄）'],
  ['mascotSay',     '獣を押したときの5分岐'],
  ['tenLeans',      '投票欄のアイコンを押したときの一行'],
  ['mdOpen',        '誤診記録の口上'],
  ['mdContents',    '誤診記録の読み上げ']
];
…
fn.items.forEach(function(x){
  out.push('   ' + x.line + ' ｜ ' + x.text);     // ← 二欄。話者も鍵も付けない
});
```

**FUNCS の節は全部二欄。**同じ `[tenLeans]` に並ぶ猫牌・枝豆・紳士の行も二欄
（`4132 ｜ 猫牌0枚、指差し確認——攻めヨシ！` など）。
四欄（`行番号 ｜ 話者 ｜ 鍵の道筋 ｜ 本文`）になるのは、話者の鍵を持つ表から拾う節
（`TONE_WORDS` など）だけ。

> **一行でいうと** … 兎の三行が二欄なのは仕様どおり。`tenLeans` が「関数から字面を拾う節」で、
> その節は設計上いつも `行番号 ｜ 本文` の二欄だから。**直しは入れていない。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **179件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`押し引き表-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8A%BC%E3%81%97%E5%BC%95%E3%81%8D%E8%A1%A8-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:15 | 押し引き表-1 の調べ — 判定盤が持っている物・持っていない物 |
| [`最後に受けた枠の撤去-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%80%E5%BE%8C%E3%81%AB%E5%8F%97%E3%81%91%E3%81%9F%E6%9E%A0%E3%81%AE%E6%92%A4%E5%8E%BB-1.md) | 09-06 14:48 | 最後に受けた枠の撤去-1 — パネルからその一行を外した |
| [`帯の中の走り出し-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1-2.md) | 09-06 13:51 | 帯の中の走り出し-1（実地）— 帯が明けた一回で、一本だけ鳴った |
| [`帯の中の試し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%A9%A6%E3%81%97.md) | 09-06 13:24 | 帯の中の試し |
| [`訴えの記録-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A8%98%E9%8C%B2-1.md) | 09-06 12:58 | 訴えの記録-1 — 記録も、種類ごとに一行だけ |

<!-- 控えの一覧 ここまで -->
