# 08-20 の保留三つの今（振りの八枚の倍率・目盛り画像の置き場・sizing-review.png）

**終わり（残り0件）** — 2026-09-20 14:5x（VAIO）。**本体は読んだだけ**（v1456）。`stable` も触っていない。

＊台帳（`orders-open.tsv`）は **08-22 から**しか無いので、三つとも**台帳には行が無い**。
　追ったのは git の履歴・報告の綴り・記憶・綴りの実物。

## ① 振りの八枚の倍率 … **開いたまま**（読んだ値は残っている。当てる工事は一度も入っていない）

- **済んでいる所** … 2026-08-20 に**目視で読んだ値**が記憶に残っている（`swing-eight-head-widths`）。
  8倍拡大＋5px目盛り・±2px で、頭の幅は **u 57／ur 55／r 54／dr 55／d 51／dl 54／l 57／ul 47**。
  要る倍率は **u ×0.89・ur ×0.92・r ×0.94・dr ×0.92・d ×0.99（据え置き）・dl ×0.94・l ×0.89・ul ×1.07（唯一の拡大）**。
  基準は `idleRight` 52・`breathR` 49・`action` 59 で、**49〜52px の帯は直立・息切れを指し、投げ（action）は外れる**。
- **当たっていない所** … 本体の剣士のコマは **v1385（2026-08-16）から一度も焼き直されていない**
  （`git log -S"airSlashR" -- koushu-handan.html` の最後が v1385。`kishi_*_src.png` も 08-16〜08-17 のまま）。
  **倍率はどのコマにも掛かっていない。**
- **何が決まれば動けるか**
  1. **どの基準へ揃えるか**（`idleRight` 52 に寄せるのか、八枚の中央値に寄せるのか）。
     ＊記憶 `body-size-metric-two-rules` … 揃った群10枚が互いに5%以内に収まる単一の数値は無い。
  2. **投げ（action 59）を揃えの外に置くか**（外さないと基準が動く）。
  3. 焼き直すコマの範囲（**弧を持つコマは旧法で薄く焼いてある**ので、焼き直したら暗背景で新旧を見比べる＝作法21）。
  この三つが決まれば、`char_export.js` で焼き直し→`head-proof.js` で目盛りつきの確認→本体へ差し替え、の順で進められる。

## ② 目盛り画像の置き場 … **済み**（道具も置き場も決まっている。焼いた絵は置き続けない）

| | 中身 |
|---|---|
| 焼く道具 | **`head-proof.js`**（2026-08-20 23:35 の commit **0b43586a** で新設。「剣士のコマに目盛りを重ねた一覧（振りの八枚＋基準三枚）」） |
| 置き場 | **リポジトリ直下**。`node head-proof.js` → `head-proof-dark.png` ／ `head-proof-light.png` |
| 目盛りの決め | 元画像の画素で **10px ごとに細線・50px ごとに太線と数字**、倍率は2倍、数字のための余白 46px（`head-proof.js` L14・L83） |
| いまの有無 | **二枚とも置いていない**（作法21・2026-08-30 の裁定で「**焼き付けの四枚はリポジトリに置き続けない**」＝`asset-proof-*` と `head-proof-*`。**道具で何度でも焼き直せる**ため） |
| 角度の目盛り | `char_export.js` も別に焼く … `eda_<KEY>_check.png`（左＝角度の目盛り／中＝本番の暗地／右＝白地。L306〜L397）。**角度の自動判定は止めてあり、目盛りを見て目で読む**のが決め |

**開いている所は無い。**

## ③ `sizing-review.png` の正体 … **済み（正体は判明・残す物と決まっている）**

| | 中身 |
|---|---|
| 実物 | リポジトリ直下 **`sizing-review.png`**・**4,978,158 バイト（4.75MB）**・**2366 × 5140 px**・綴りの日付 **08-19** |
| 正体 | **剣士のコマの大きさ合わせの確認画像**（`reports/欠陥調べ-1.md` L227「コマの大きさ合わせの確認画像」） |
| 読む者 | **無し**（本体も台本も参照していない。字面の言及は `reports/欠陥調べ-1.md` だけ。`reports/穴の直し-1-3.md` L26 の表でも「読む者は無し」） |
| 焼いた道具 | **リポジトリに無い**（`穴の直し-1-3` で「書く道具が見当たらない」と確定。`head-proof.js` は 08-20 に**後から**作った別物） |
| 裁定 | **消さない。** 作法21 に「`usagi-proof-dark.png` ／ `usagi-proof-light.png` ／ `sizing-review.png` の三枚は、**焼いた道具がリポジトリに無いので消さない（消すと戻らない）**」と明記（`CLAUDE.md` L378 付近） |

**開いている所は無い。**（「消すか残すか」は 08-30 の裁定で**残す**に決着している。）

## まとめ

| 保留 | 今 | 動くのに要る決め |
|---|---|---|
| ① 振りの八枚の倍率 | **開いたまま**（読んだ値だけ・本体は v1385 のコマのまま） | 揃える基準／投げを外すか／焼き直す範囲 |
| ② 目盛り画像の置き場 | **済み**（`head-proof.js` → 直下。焼いた絵は置き続けない） | — |
| ③ `sizing-review.png` | **済み**（大きさ合わせの確認画像・道具は無い・作法21 で残す） | — |

## 触った所と触らない所

**触った所** … 無し（読みだけ）。報告と控えのみ。
**触らない所** … `koushu-handan.html`・`stable`・素材の綴り。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **315件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1450.md) | 09-20 14:40 | 08-20 の保留三つの今（振りの八枚の倍率・目盛り画像の置き場・sizing-review.png） |
| [`y0920-1406-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406-2.md) | 09-20 14:24 | v1456 A の末尾を実測の数を並べた字へ（納品） |
| [`y0920-1406.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406.md) | 09-20 14:06 | 【宣言】A の末尾の一文を数入りの字へ差し替える（v1456） |
| [`y0920-1400.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1400.md) | 09-20 13:59 | 外した表の前後の字（L1497・そのまま写し） |
| [`y0920-1330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330-2.md) | 09-20 13:50 | v1455 節五から猫牌の表の二つ目を外した（納品） |
| [`y0920-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330.md) | 09-20 13:29 | 【宣言】説明欄の節五から猫牌の表の二つ目を外す（v1455） |
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

<!-- 控えの一覧 ここまで -->
