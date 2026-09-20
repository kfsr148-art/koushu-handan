# 本体のいま三つ（較正-1 の綻び・猫牌の表・ダブルヨシ）

**終わり（残り0件）** — 2026-09-20 12:1x（VAIO）。**本体は読んだだけ**（v1454）。`stable` も触っていない。

## 1. 08-28 の較正-1 で出た綻び三件 … **三件とも v1429 で直っていて、いまの本体にも残っている**

| # | 綻び | 直した版 | いまの行（v1454） | 直した中身 |
|---|---|---|---|---|
| ① | 撤退予約線の註と実装の食い違い | **v1429** | **L8795**（註）・**L8802**（裏付けの註） | 実装を正とし、註を「受け入れ枚数から」→**「初期シャンテンから」**へ。L8802 に「期限は初期シャンテン別の実測（400局・一向聴到達巡目の中央値から一巡詰めた値）」と裏付けが添えてある |
| ② | `totalBlocks` の七対子の道 493件 | **v1429** | **L3155**（`const totalBlocks = goodShapes + weakShapes;`）・直前の註 **L3152〜L3154** | 七対子の上書き（L3145〜L3150）の**後ろ**へ移した。註に「上書き前に数えると…判定（shapeOK）や虎の台詞が見る goodShapes と食い違う（4000行で493件・12.3%）」と残っている |
| ③ | 執事の票と根拠欄の孤立ドラ1枚 | **v1429** | **L2997**（`const hasValue = doraValue>=1;`）・**L8891〜L8892**（根拠欄①） | 境目を執事と同じ `>=1` に揃え、根拠欄①の印は `a.hasValue`、題と詳細は `valueSources` で分ける形。L8892 に「印（✓×）は hasValue＝執事と同じ境目。題と詳細は valueSources で分ける（v1429）」 |

**いま直す所は無い。**（当時の台帳の行 08-29 15:0x「副産物-1／-2／-3」も三つとも済で、どれも v1429 と書いてある。）

## 2. 説明欄の猫牌の表 … **二つ**（どちらも節五の中。説明欄ぜんたいの表は三つ）

| # | 行 | 表の題（見出しの字） | 中身 |
|---|---|---|---|
| **猫1** | **L1497**（節五「五、猫牌・枝豆・AI——三つの物差し」の中・一つ目の表） | 直前の字「…各枚数1000回の実測は以下の通りです。」 | 欄は**猫牌／攻めの割合／形が整う割合／平均ドラ価値**。0枚 40.8%・22.8%・0.41 〜 8枚 13.7%・0%・0.14 の8段 |
| **猫2** | **L1497**（同じ節の二つ目の表） | 直前の字「…「必要数4」の条件だけを揃えて実測し直したのが下の表です。」 | 欄は**猫牌／残る本物の牌／形が整う割合**。0枚 13枚 19.42% 〜 8枚 5枚 0% の8段 |
| （猫牌ではない） | **L1462〜L1473** | 直前は L1460「軸は二つ。速さ…と、打点…」 | 欄は**打点（ドラ・赤の合計）／求める好形の数**。なし4・ドラ1枚4・ドラ2枚3・ドラ3枚以上2 |

＊**表になっていない猫牌の数の並び**が二つある（節六）… **L1519**「0枚 59%／1枚 51%／2枚 43%／3枚 38%／4枚 36%／5枚 38%／6枚以上 37%。」と、
　**L1524**「0組 25%／1組 35%／2組 47%／3組 24%／4組以上 100%。」（こちらは枝豆の組数）。**表ではないので上の数には入れていない。**

## 3. 「ダブルヨシ」の字 … **本体に4箇所残っている**（どれも現場猫の分。作法11のとおり）

| 行 | 前後の文 |
|---|---|
| **L1497**（節五・読み物） | 「…猫牌の枚数から出した猫の見立て…と本判定を照合し、判定カードに一行の助言が出ます。判定そのものは一切変えません。照合の結果は三種類——本判定と一致すれば**「本判定と一致、ダブルヨシ」**、猫が攻め寄りなのに本判定が守りなら「⚠️現場猫アラート：ヨシと言っ…」 |
| **L1497**（節五・枝豆の説明の中） | 「…配牌5000回の実測では、対子・暗刻が4組以上の手は、本判定でも100%攻めでしたので（該当116例）、ここまでは常に**ダブルヨシ**が出る計算になりますが、まれに食い違えば「🫛枝豆は攻めと言ったが、本…」 |
| **L8715**（註） | 「// 「ヨシ」「**ダブルヨシ**」は現場猫だけの言葉。外しても謝らず、言い直さない。」 |
| **L8721**（現場猫の台詞） | `window._catSwitchNote = '猫牌' + effectiveCatN + '枚。猫の見立てと本判定が同じ向き、**ダブルヨシ**！';` |

＊**喋っているのは現場猫だけ**（L8721）。ほかの三箇所は読み物（L1497 の二つ）と註（L8715）で、台詞ではない。
＊`check.js` の ⑨（「ヨシ」の混入）は、いまの本体で **PASS**（09-20 の雲のフル版）。

## 触った所と触らない所

**触った所** … 無し（読みだけ）。報告と控えのみ。
**触らない所** … `koushu-handan.html`・`stable`。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **309件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1210.md) | 09-20 12:05 | 本体のいま三つ（較正-1 の綻び・猫牌の表・ダブルヨシ） |
| [`y0920-1146.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1146.md) | 09-20 11:56 | 今朝の枠の確かめと、実戦的中-2／持ち上げ-1 |
| [`y0920-1058-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058-2.md) | 09-20 11:28 | v1454 説明欄の三つの直し（納品） |
| [`y0920-1058.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058.md) | 09-20 10:53 | 【宣言】説明欄に三つ手を入れる（v1454） |
| [`y0920-1055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1055.md) | 09-20 10:52 | subj-gap の見比べと step-slow の上限を直した（push-defer は直さない） |
| [`y0920-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1040.md) | 09-20 10:40 | 訴え三件の元（push-defer・subj-gap・step-slow）と、説明欄の二つの確かめ |
| [`y0920-0912-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912-2.md) | 09-20 09:49 | v1453 ずんだもん・枝豆・兎の文面の差し替え（納品） |
| [`y0920-0912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912.md) | 09-20 09:10 | 【宣言】ずんだもん・枝豆・兎の文面を mitate-new-2.txt へ差し替える（v1453） |
| [`y0920-0829.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0829.md) | 09-20 08:32 | 09-19 の調べ四件・台帳の「見張り×2147946720」・ずんだもんと兎の文面 |
| [`y0919-2320.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2320.md) | 09-19 23:17 | stale の回に iPhone が鳴らない穴を塞いだ（🪟 に名乗り bad） |
| [`y0919-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2255.md) | 09-19 23:09 | 連携の総点検（壊さず、作り値と実読みだけで） |
| [`y0919-2210-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2210-2.md) | 09-19 22:55 | panel v138 の納品（雲の検査 両方PASS） |
| [`y0919-2210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2210.md) | 09-19 22:28 | 現況の行が「本体v1451／stable v1451」のまま … パネルが版を開いた一度しか取っていなかった |
| [`y0919-2205.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2205.md) | 09-19 22:06 | hold-stuck の直し（空の札を溜め場へ入れない） |
| [`y0919-2149.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2149.md) | 09-19 21:57 | 命令の見張りと、作法36（回る段の突き合わせ） |
| [`y0919-2147.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2147.md) | 09-19 21:52 | 今日の止まりの三つの確かめと、別件二つ（hold-stuck・見張り×2147946720） |
| [`y0919-2103-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2103-2.md) | 09-19 21:22 | v1452 設定画面に「言葉の一覧」（y0919-1701 の納品） |
| [`y0919-2103.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2103.md) | 09-19 21:04 | 手元の速い版（Edge の五段を飛ばし）… check は通り、adv-check が上限に当たった |
| [`y0919-2057.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2057.md) | 09-19 20:57 | 手元の速い版（⑦飛ばし）… ⑯で上限に当たって抜けた |
| [`y0919-2025.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2025.md) | 09-19 20:33 | 手元の速い版（上限つき）… ⑦で上限に当たって抜けた |

<!-- 控えの一覧 ここまで -->
