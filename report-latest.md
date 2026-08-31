# 待ちの決め-2 — 🙋 の関門に「待ちなしの回は立てない」を実装／⑦の材料

**状態：作業中（残り1件）／VAIO 2026-08-31 12:2x**

**結論** — 控えに「待ち: なし」と明言した回は 🙋 を立てず作業中の扱いを続ける枝を
watch-notify.ps1 に入れ、三通りの作り値で実測した。書き分け（中身あり＝🙋／書き忘れ＝🙋）は崩していない。
⑦の材料（項目名・検査の中身・Actions の実際の出力・環境の違い）は下記のとおり。

---

## 1. 🙋 の関門の直し（`~/.claude/watch-notify.ps1` L1415-1425）

**「待ち: なし」と明言した回は、🙋 ヨシしてください を立てない。作業中の扱いを続ける。**

```powershell
} elseif ($note.askNone) {
  # 「待ち: なし」と明言した回は、🙋 を立てない（2026-08-31・待ちの決め-2）
  #   外の処理の完了待ちは、控えに「待ち: なし」と書いて作業中のまま見込みを延ばして待つ決め。
  #   notification が鳴っても、返事が要る待ちではないので 🙋 は出さない。
  $key = 'run:' + $lastKindTs
  Write-Self '「待ち: なし」の明言があるので、ヨシ待ちは立てない（作業中の扱いを続ける）'
} else {
```

**書き分けは崩していない。**

| 控えの「待ち」 | どうなるか |
|---|---|
| **中身がある**（例「版の字が…」） | 今までどおり **🙋 が出る**（L1286 の枝と L1432 の枝） |
| **「なし」と明言**（`待ち: なし`） | **🙋 を立てず、作業中の扱いを続ける**（新しい枝） |
| **行が無い**（書き忘れ） | 今までどおり **🙋 が出る**（「書き忘れの可能性」の文言つき）——明言と書き忘れを混ぜない（作法25 と同じ書き分け） |

見込みを延ばす側は控えの書き方（`見込み: N分` を長めに打ち直す）で行う——見張りは見込みを発明しない。

### 作り値の実測（本物の判定の枝 L1414-1432 を字面のまま抜き出して回した）

```
(a) 待ちの中身あり             鍵=wait → ヨシ待ち（🙋 が出る）
(b) 「待ち: なし」と明言       鍵=run  → 作業中のまま（🙋 は出ない）
    記録: 「待ち: なし」の明言があるので、ヨシ待ちは立てない（作業中の扱いを続ける）
(c) 待ちの行が無い（書き忘れ） 鍵=wait → ヨシ待ち（🙋 が出る）
```

**指示の二通り（あり＝出る／なし＝出ず作業中が続く）とも確認。**
(c) は書き分けが崩れていないことの確かめ。

構文OK **2295行**／BOM 有り／写し `.bak-20260831a`／予定表が毎分呼び直すので起こし直し不要。

## 2. ⑦ の材料（判断はそちらで）

### 項目名

**⑦ 狭い画面での溢れ**（`check.js` の九つの検査のうちの一つ。①〜⑥は PASS だった）

### 検査の中身

headless ブラウザで本体の9画面を実測し、**はみ出し・重なり・横溢れが無いこと**と、
**判定後（judged）は末尾の二択（連チャン／親流れ）の bottom が視野の高さ以内**であることを見る
（作法16）。視野は完全版で 568×320／667×375／844×390／932×430／900×300／900×340／900×381 ほか
**72組み合わせ**。窓は「視野より 幅+24／高さ+92 大きい」前提で開き、
実際の `innerWidth × innerHeight` を測る（`check.js` L621 の注記）。

### Actions で落ちた実際の出力（そのまま）

```
✗ judged 691x380：8件
    二択が画面の下へ出ている bottom=388.8 > 380
    軍師：二択が画面の下へ出ている bottom=388.8 > 380
    ずんだ：二択が画面の下へ出ている bottom=388.8 > 380
    お嬢様：二択が画面の下へ出ている bottom=388.8 > 380
    マダム：二択が画面の下へ出ている bottom=388.8 > 380
    一姫：二択が画面の下へ出ている bottom=388.8 > 380
    先生：二択が画面の下へ出ている bottom=388.8 > 380
    執事：二択が画面の下へ出ている bottom=388.8 > 380
```

（八人の見立てすべてで同じ 8.8px の下へのはみ出し。走り 33352419958・failure・4分8秒）

### 手元と Actions で違う環境の要素

| 要素 | 手元（VAIO） | Actions |
|---|---|---|
| OS | Windows 10 | Ubuntu（ubuntu-latest） |
| ブラウザ | **Edge**（`msedge.exe`・headless） | **google-chrome**（headless） |
| **窓と視野の差（額縁）** | **幅+24／高さ+92**（check.js の補正値はこれで測った） | **違う値**——同じ補正で開くと視野が **+24／+5** ほど大きくなる |
| 実際に測られた視野 | 指定どおり（568×320 など） | **ずれる**——568×320→592×325／**667×375→691×380**／844×390→868×395 |
| node | v24.18.0 | v24（同じ大版） |

**落ちた 691×380 は、どの端末の想定にも無い「ずれた視野」**。ずれた他の視野は全て通っており、
その一組だけ二択が 8.8px 下へ出た。手元の完全版（正しい視野）は通っている。

**速い版へ戻したのはそのまま**（戻しの走り 33352745162 は success・1分56秒）。

---

## 残り

`orders-open.tsv` の未了 ── **残り1件**（自動検査-2-2＝黒い窓の写しの控えの再掲。写す元の到着待ち）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **85件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`待ちの決め-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%BE%85%E3%81%A1%E3%81%AE%E6%B1%BA%E3%82%81-2.md) | 08-31 12:15 | 待ちの決め-2 — 🙋 の関門に「待ちなしの回は立てない」を実装／⑦の材料 |
| [`自動検査-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-2.md) | 08-31 12:08 | 自動検査-2 — 完全版は環境差で⑦が落ちた。緩めずに報告して速い版へ戻した |
| [`写しの食い違い-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%A3%9F%E3%81%84%E9%81%95%E3%81%84-1.md) | 08-31 11:50 | 写しの食い違い-1 — 束ねる側を数える側に合わせた（panel v104） |
| [`自動検査-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-1.md) | 08-31 09:54 | 自動検査-1 — GitHub Actions で check.js と adv-check.js を push ごとに回す |
| [`使用量の配分-2-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-3.md) | 08-30 20:42 | 使用量の配分-2 の訂正 — ボーダーの式を切り上げへ |
| [`通知の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 08-30 20:30 | 通知の走り出し-1 — 仕事が始まったら「😸 終了予定はHH時MM分ですにゃ」を一発 |
| [`使用量の配分-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-2.md) | 08-30 19:52 | 使用量の配分-2 の続き — usage-widget.js へボーダーの行を実装した |
| [`使用量の配分-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2.md) | 08-30 19:42 | 使用量の配分-2 — 「19:59まで N%」の行は VAIO の側に無い。名と場所を報告して止まる |
| [`猫の常駐-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E5%B8%B8%E9%A7%90-1.md) | 08-30 17:36 | 猫の常駐-1 — 題字の右に RunCat の猫を置いた（panel v103） |
| [`途切れの回収-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%94%E5%88%87%E3%82%8C%E3%81%AE%E5%9B%9E%E5%8F%8E-1-2.md) | 08-30 17:02 | 途切れの回収-1 の裁定 — dead / stale: も一発だけ押し送る |
| [`通知の宛先-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%AE%9B%E5%85%88-1-2.md) | 08-30 16:44 | 通知の宛先-1 — 旧話題へ送る・読む箇所は **0件** |
| [`通知の急ぎ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-3.md) | 08-30 16:33 | 通知の急ぎ-3 — 見切り送信を撤廃した |
| [`穴の直し-1-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-4.md) | 08-30 16:32 | 穴の直し-1 ③ の裁定 — 焼き付けの四枚を消した（6.97MB） |
| [`穴の直し-1-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-3.md) | 08-30 16:12 | 穴の直し-1 ③ — 掃除の候補 25ファイル 32.0MB の一覧（消していない） |
| [`穴の直し-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-2.md) | 08-30 16:04 | 穴の直し-1 ② — Pages の errored の内訳（数えただけ） |
| [`通知の急ぎ-2-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2-4.md) | 08-30 14:51 | 通知の急ぎ-2 ④ — 乙で確定。実測で三点のずれが出たので、知らせに自分の札を足した |
| [`通知の急ぎ-2-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2-3.md) | 08-30 14:40 | 通知の急ぎ-2 ③ — 裁定「乙」を当てた（印を写せますの札まで進める） |
| [`通知の急ぎ-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2-2.md) | 08-30 14:30 | 通知の急ぎ-2 ② — 実際の終わりで測った |
| [`パネルの整理-13.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-13.md) | 08-30 14:26 | パネルの整理-13 — 一番上の状態の札を消し、印を黄色の行へ移した（panel v102） |
| [`パネルの整理-12.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-12.md) | 08-30 14:11 | パネルの整理-12 — 一番上の札の固定高さを 134px → 101px へ縮めた（panel v101） |

<!-- 控えの一覧 ここまで -->
