# 配牌の目安-1 の調べ — 13枚から何を持っているか

**実装はしていない。**`koushu-handan.html` を字面で読んだだけ。
＊先の「押し引き表-1 の調べ」は**取り下げ**（台帳も取下にした）。

## 早見

| # | 見た物 | いま |
|---|---|---|
| ① | トイツの数 | **持っている** |
| ② | **第一打の提示** | **無い**（内部の切り順だけ在る） |
| ③ | ブロックの数え | **持っている** |
| ④ | 役牌トイツ | **持っている** |
| ⑤ | ドラと役からの打点見込み | **持っている**（点数ではなく「種の数」） |
| ⑥ | 受け入れ枚数 | **持っている**（枚数ではなく**種類数**） |

**無いのは②だけ。**

## ① トイツの数 … 持っている

```
L2745  let kinds=0, pairs=0;
       Object.values(allCnt).forEach(c=>{ kinds++; if(c>=2) pairs++; });
L2747  const chiitoiSt = 6 - pairs + Math.max(0, 7 - kinds);
```

- `pairs` … **対子（2枚以上）の種類数**。`kinds` … 手にある牌の種類数
- ここから**七対子の向聴**を出し、国士・標準形と合わせた**三つの最小**を採る
- 字牌は別に `honorCount` でも数えており、④の役牌判定に使う
- 七対子へ倒れた回は `goodShapes = 揃った対子の数`／`weakShapes = 0` に置き換わる（L3071-3072）

## ② 第一打の提示 … **無い**

「第一打」「打牌」「discard」は**0件**。画面に切る牌を出す枝は無い。

**内部にだけ、切り順の規則がある。**ただし**14枚以上を渡された回に限る**。

```
L2818  let bestBase=99, bestLeft=null;
L2823  if(st<bestBase){ bestBase=st; bestLeft=left; }
L2827  const ref = bestLeft || baseTiles.slice(0,13);
```

- 規則は「**切ったあとの向聴がいちばん小さくなる牌**」。同点は**先に見つかった方**
- 目的は**受け入れを測る基準の手を作ること**で、選んだ牌は画面に出さない
- そもそも 14枚以上は「配牌判定の対象外」として弾く枝もある（L2487）

## ③ ブロックの数え … 持っている（**雀頭＋面子4枠＝実質5ブロック**）

```
L2649  const fillProf = blockProfile();                       // 最良の分解（melds/good/weak/hasPair）
L2650  const fillRemain = Math.max(0, 4 - fillProf.melds);    // 雀頭別・面子4枠の残り
L2651  const fillGood = Math.min(fillProf.good, fillRemain);  // 好形で埋まる見込み
L2652  const fillWeak = Math.min(fillProf.weak, ...);         // 愚形どまり
L3078  const totalBlocks = goodShapes + weakShapes;
```

- **「5ブロック」という語は無い**が、数え方は**雀頭を別に置いて面子4枠**（`4 - melds`）＝実質それ
- `blockProfile()` が総当たりで最良の分解を選ぶ（`score` の四段で比べる）
- **判定が見るのは `fillWeak`。**注記に「v1430 で攻の材料を `totalBlocks` から `fillWeak` へ移した。
  旧③（`totalBlocks>=6` で攻）は**50件しか発火しなかった**」とある（L4120-4121）
- `fillGood` / `fillWeak` / `fillRemain` は判定の返り値にも入る（L3107）＝**兎の材料**（作法20）

## ④ 役牌トイツ … 持っている

```
L2884-2896
  Object.keys(honorCount).forEach(code=>{
    if(honorCount[code] < 2) return;          // **対子以上だけ**
    let han = 0;
    if(YAKUHAI.has(code)) han += 1;           // 三元牌（白發中）
    if(code === seatWind)  han += 1;          // 自風
    if(code === roundWind) han += 1;          // 場風
    ...
  });
  const yakuhaiPair = yakuhaiValue > 0;
```

- **翻の数まで数える**（三元牌1＋自風1＋場風1）。二つ以上なら名前に「**ダブ**」が付く
- 名は `yakuhaiNames`（「發の対子」「ダブ東の対子」）として画面へ
- **自風・場風を見るので、盤面の風の升（`seatWind` / `roundWind`）が効いている**

## ⑤ ドラと役からの打点見込み … 持っている（**点数ではない**）

```
L2912  const doraValue = doraEff + redCount + yakuhaiValue;
```

- `doraEff` … ドラの枚数。**孤立した一枚は 0.5**（同色±2に仲間がいなければ孤立）
- `redCount` … 赤五 ／ `yakuhaiValue` … ④の翻
- **判定に効く** … 打点が厚いほど要る良形が減る（L2929：0・1→良形4／2→3／3以上→2）
- **点数は出さない。**「翻」0件・「満貫」0件・「符」は説明文のみ。
  **3900／7700 のような数字は、いまの盤面からは出せない**

## ⑥ 受け入れ … 持っている（専用の関数名は無い）

- 数える所 … `analyze()` の中の節（L2655〜）
- 使う手 … **`shanten(tiles, mode)`**（L2670）、`tilesArray(h)`、`normalizeForShanten(...)`
- 数え方 … 34種を1枚ずつ足し、**向聴が減る牌を有効牌**として**種類数**で広い／狭いを見る
  （**枚数ではない**。四枚持ちは `have>=4` で除く）

**複合形（カンチャン＋リャンメンが重なる形）の扱い**

**形ごとに数えていない。**「引いたら向聴が減るか」だけを見るので、
`4568m` のような重なりは**牌の種類として自然に合算**される。**特別扱いの枝は無く、二度数えも起きない。**

＊良形／愚形の別は**別の所**（`bestShapeOneSuit`＝**変更禁止**）で見る。
　注記に「良形カウントを総当たりに直したのに合わせ、受け入れの土台もここへ寄せた」（L2741）。

## 無い物（②）を足す場合に触る所

| 所 | 何をする | 目安 |
|---|---|---|
| 切る牌を選ぶ手 | いまの規則は**14枚以上のときだけ**動く。13枚から第一打を言うには、**「浮いている牌」を選ぶ規則**を別に決める要がある（向聴が変わらない牌が複数出るため、同点の割り方＝安全度・打点・受け入れのどれで裁くか） | 40〜80行 |
| `analyze()` | **変更禁止**（作法5）。**触れない**。返り値（`ref` / `bestLeft` に当たる物）を外へ出す形にするなら、**返り値へ足すだけ**でも `analyze()` の書き換えになる | — |
| 判定の後段 | `analyze()` の外で、返ってきた材料から第一打を決める | 30〜60行 |
| 画面 | 判定後の欄に一行。牌を光らせるなら**印の色と光らせ方**を決める（作法20 の一覧に無い八人目になる） | 20〜40行 |
| 人柄との整合 | 「見立て行と光る牌は同じ材料」（作法20）。第一打を光らせるなら**どの人柄の担当か**を決めるか、**道具側（スイッチ）**に置く | 要判断 |
| 検査 | `check.js` に作り値。⑦の画面の溢れ（判定後の二択が視野を越えやすい） | 30〜50行 |
| 版・台詞 | 版の三箇所（作法4）。台詞を足すなら `serifu.txt` の再抽出まで（作法17） | 別途 |

**いちばんの難所は「同点の割り方」。**13枚から向聴が変わらない捨て牌は普通いくつも出るので、
**何を優先するかを決めない限り、第一打は一意に決まらない。**
いまの盤面は**安全度（相手の情報）を持っていない**ので、割れるのは打点と受け入れの二つだけになる。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **165件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`配牌の目安-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%85%8D%E7%89%8C%E3%81%AE%E7%9B%AE%E5%AE%89-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:18 | 配牌の目安-1 の調べ — 13枚から何を持っているか |
| [`押し引き表-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8A%BC%E3%81%97%E5%BC%95%E3%81%8D%E8%A1%A8-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:15 | 押し引き表-1 の調べ — 判定盤が持っている物・持っていない物 |
| [`最後に受けた枠の撤去-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%80%E5%BE%8C%E3%81%AB%E5%8F%97%E3%81%91%E3%81%9F%E6%9E%A0%E3%81%AE%E6%92%A4%E5%8E%BB-1.md) | 09-06 14:48 | 最後に受けた枠の撤去-1 — パネルからその一行を外した |
| [`帯の中の走り出し-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1-2.md) | 09-06 13:51 | 帯の中の走り出し-1（実地）— 帯が明けた一回で、一本だけ鳴った |
| [`帯の中の試し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%A9%A6%E3%81%97.md) | 09-06 13:24 | 帯の中の試し |
| [`訴えの記録-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A8%98%E9%8C%B2-1.md) | 09-06 12:58 | 訴えの記録-1 — 記録も、種類ごとに一行だけ |
| [`訴えの見直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97-1.md) | 09-06 12:53 | 訴えの見直し-1 — 退避が受けている間は、上限を訴えない |
| [`訴えの数え方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E6%95%B0%E3%81%88%E6%96%B9-1.md) | 09-06 12:48 | 訴えの数え方-1 — 定時の「訴え: N件」を、種類の数にした |
| [`訴えの内訳-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A8%B4%E3%81%88%E3%81%AE%E5%86%85%E8%A8%B3-1.md) | 09-06 12:25 | 訴えの内訳-1 — 31件は何を言っているか（数えただけ） |
| [`帯の中の押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-06 08:43 | 帯の中の押し-1 — 帯の前に押し、帯の間も押しだけは通す |
| [`過去の札の件数-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%81%8E%E5%8E%BB%E3%81%AE%E6%9C%AD%E3%81%AE%E4%BB%B6%E6%95%B0-1.md) | 09-06 03:22 | 過去の札の件数-1 — 「🗄 過去の札」の見出しに件数を出した |
| [`走り出しの題-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%A1%8C-1.md) | 09-06 02:39 | 走り出しの題-1 — 走り出しの題に、仕事の名を入れた |
| [`通知の出口-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-3.md) | 09-06 02:32 | 通知の出口-3 — 見張りの道にも同じ60秒の束ねを置いた |
| [`通知の出口-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%87%BA%E5%8F%A3-2.md) | 09-06 02:23 | 通知の出口-2 — 出口で60秒のあいだ束ねる |
| [`subj-gapの空振り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/subj-gap%E3%81%AE%E7%A9%BA%E6%8C%AF%E3%82%8A-1.md) | 09-06 01:50 | subj-gapの空振り-1 — 同じ文を違う長さで切っただけ |
| [`入口の時計-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%A5%E5%8F%A3%E3%81%AE%E6%99%82%E8%A8%88-1.md) | 09-06 01:34 | 入口の時計-1 — 入口が20秒を越えた回は、先へ進まずに降りる |
| [`入口の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%A5%E5%8F%A3%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-06 01:27 | 入口の固まり-2 — 入口が重かったのは「足跡の帳面を毎段まるごと読む」から |
| [`地図の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%B0%E5%9B%B3%E3%81%AE%E7%A9%B4-1.md) | 09-06 00:48 | 地図の穴-1 — 八段それぞれの「読む物が壊れたとき」 |
| [`作り値の送り先-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%9C%E3%82%8A%E5%80%A4%E3%81%AE%E9%80%81%E3%82%8A%E5%85%88-1.md) | 09-06 00:34 | 作り値の送り先-1 — 作り値は偽の送り手へ。今夜の分は回し直した |
| [`見張りの地図.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E5%9C%B0%E5%9B%B3.md) | 09-06 00:34 | 見張りの地図 — `watch-notify.ps1` の巡回を、段ごとに開く |

<!-- 控えの一覧 ここまで -->

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 終わりました（返事不要）

```
写せます（3件）
```

### 2. 🙋 ヨシしてください

```
y0906-1にヨシ。条件は枠のとおり＝analyze()に触らない・人柄の一覧
印: y0906-1
待っているのは：切り候補-1 の宣言へのヨシ（本体の工事なので作法29 ②③で止まっている）
答え方：「y0906-1 にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
```

### 3. 🙋 ヨシしてください

```
切り候補-1（第一打の候補を一枚示す）
印: y0906-1
待っているのは：切り候補-1 の宣言へのヨシ（本体の工事なので作法29 ②③で止まっている）
答え方：「y0906-1 にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
```

### 4. 🔎 調べました

```
切り候補-1＝13枚から第一打の候補を一枚示す。①analyze()には触らず判
字面で読んだだけ。実装はしていない。先の押し引き表-1の調べは取り下げ、台帳も取下にした
（報告そのものは記録として残す）。無いのは②の第一打だけで、残る五つは持っている。
【①トイツの数】持っている。L2745 で kinds と pairs（2枚以上の種類数）を数え、L2747 で
七対子の向聴を出す。国士・標準形と合わせた三つの最小を採る。字牌は honorCount でも数え、
④の役牌判定に使う。七対子へ倒れた回は goodShapes＝揃った対子の数・weakShapes＝0 になる。
【②第一打】示していない（第一打・打牌・discard は0件）。内部にだけ切り順の規則があり、
14枚以上の回に限り「切ったあとの向聴がいちばん小さくなる牌」を選ぶ（同点は先に見つかった方・
L2818-2827）。目的は受け入れを測る基準の手を作ることで、画面には出さない。
【③ブロックの数え】持っている。blockProfile() が総当たりで最良の分解を返し、
fillRemain＝4-melds（雀頭別・面子4枠の残り）、fillGood＝好形で埋まる見込み、
fillWeak＝愚形どまり。「5ブロック」という語は無いが、雀頭を別に置いて面子4枠を数える形＝
実質それ。判定が見るのは fillWeak で、v1430 で totalBlocks から移した（旧③は50件しか
発火しなかったと注記）。fillGood/fillWeak/fillRemain は返り値にも入る＝兎の材料。
【④役牌トイツ】持っている。対子以上（2枚以上）だけを見て、三元牌1＋自風1＋場風1で翻を数え、
二つ以上なら名前に「ダブ」が付く。名は yakuhaiNames として画面へ。自風・場風を見るので
盤面の風の升が効いている。
【⑤打点見込み】持っている。doraValue＝doraEff+redCount+yakuhaiValue（孤立ドラは0.5）。
判定に効き、打点が厚いほど要る良形が減る。ただし点数は出さない（翻0件・満貫0件）。
3900／7700 のような数字は出せない。
【⑥受け入れ】持っている。専用の関数名は無く、analyze() の節（L2655〜）で shanten() と
tilesArray／normalizeForShanten を使い、34種を1枚ずつ足して向聴が減る牌を有効牌とし、
枚数ではなく種類数で測る（四枚持ちは have>=4 で除く）。複合形は形ごとに数えないので
カンチャン＋リャンメンの重なりは種類として自然に合算され、二度数えは起きない。
良形／愚形は bestShapeOneSuit（変更禁止）の側。
【②を足す場合に触る所】切る牌を選ぶ手は14枚以上のときだけ動くので、13枚から第一打を言うには
「浮いている牌」を選ぶ規則を別に決める要がある（40〜80行）。analyze() は変更禁止なので
返り値へ足すことすら書き換えになる。判定の後段30〜60行／画面20〜40行／人柄との整合は要判断
（作法20 の一覧に無い八人目になる）／検査30〜50行／版と台詞は別途。
いちばんの難所は同点の割り方で、向聴が変わらない捨て牌は普通いくつも出る。盤面は安全度
（相手の情報）を持っていないので、割れるのは打点と受け入れの二つだけになる。
ファイル: reports/配牌の目安-1の調べ.md ／ report-latest.md ／ ~/.claude/orders-open.tsv
実測: 対子 L2745-2747／第一打 0件・内部の切り順 L2818-2827／ブロック L2649-2652・L3078・
L4120-4121／役牌 L2884-2896／打点 L2912・L2929／受け入れ L2655〜・shanten() L2670。
```

### 5. ✅ 終わりました（返事不要）

```
写せます（2件）
```

<!-- 送った知らせ ここまで -->





