# y1115-21：v1492（人格×方言）と panel v152 の雲の検査・納品

状態：終わり（残り：実機確認・直す声5本の確認・stable）

## 原因の確かめ（雲の走りは落ちていない）
- `gh run list`：v1492 の push（43686696558・雲で回す・成功・1m42s）と panel（43686937471・雲で回す・成功・47s）は、どちらも始まって成功していた。「自動検査と配信」の v1492 の走り（13m21s）も成功。
- 落ちたと見えたのは、検査の結果の綴りが届く前に札が立ったため。直す物は無く、投げ直しもしていない。
- 結果：`reports/cloud-check-fast-20261115-064306.md`（v1492）＝ check・adv-check とも全部 PASS（①〜㉒・81秒）／`reports/cloud-panel-check-20261115-064627.md`（panel v152）＝全てPASS（24秒）。

## 人格×方言（v1492）の実機に見る所
判定の画面で、上の段の人格と下の段の方言に合わせて、最初の「攻め／守り」・頭の一言・助言・終わりの一言の字が揃うこと／人格や方言を押すと字だけ書き直ること／金の丸は見方の審判のままであること／版の字が v1492。

## 点検のまとめ
全組み合わせ115,101通りを点検。「いいえ」「いいや」と読める形 2,898件→0、方言の掛からない語尾 1,067種→69種（残りは設計どおり）。人格表の核 `advice-tone-core.js` と check.js ④を足した。

## 直す声5本の一覧
**未了：一覧は控えに残っておらず、ここには書けない。** 控えの待ちには「直す声5本の確認（こちらが見てから作る）」とあるだけで、どの5本かの記録が見当たらなかった。推し量って書くことはしない。どの5本かを教えてもらえれば、声の部品を作り直す。

## パネルの順と作業中の見分け（panel v152）
- 猫と字の順：作業中＞まとめて写す＞待機中＞接続不良（befde453）。雲の panel-check は構文と真似た台まで PASS。
- 実機で見る所：コードタブが作業中に、走る猫と「作業中、、、。」が出ること／版の字が panel v152。（headless では実機の描き方は分からない。人手待ち）

## 残り
実機確認（本体 v1492・panel v152）・直す声5本の確認・stable（版を名指ししたヨシの後）

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **753件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1115-21.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1115-21.md) | 11-15 16:03 | y1115-21：v1492（人格×方言）と panel v152 の雲の検査・納品 |
| [`cloud-panel-check-20261115-064627.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261115-064627.md) | 11-15 15:48 | 雲で回した：`panel-check.js` |
| [`cloud-check-fast-20261115-064306.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261115-064306.md) | 11-15 15:45 | 雲で回した：`check-fast.js` |
| [`cloud-voice-advice-20261115-063302.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-20261115-063302.md) | 11-15 15:34 | 雲で回した：`voice-advice.js` |
| [`y1115-17-b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1115-17-b.md) | 11-15 15:28 | y1115-17 続き：v1492 は本体の前で止めた（資料不足） |
| [`cloud-voice-advice-20261115-061133.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-20261115-061133.md) | 11-15 15:19 | 雲で回した：`voice-advice.js` |
| [`y1115-13.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1115-13.md) | 11-15 14:55 | y1115-13 v1491 攻め守りを最初に戻す・雲の速い検査 |
| [`cloud-check-fast-20261115-055309.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261115-055309.md) | 11-15 14:54 | 雲で回した：`check-fast.js` |
| [`y1115-11.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1115-11.md) | 11-15 14:11 | y1115-11 v1490 頭と終わりの一言（納品） |
| [`cloud-check-fast-20261115-050840.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261115-050840.md) | 11-15 14:10 | 雲で回した：`check-fast.js` |
| [`y1115-voice-open.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1115-voice-open.md) | 11-15 14:08 | 助言の頭・終わりの一言：読ませる字が画面の字と違う部品（y1115-voice-open） |
| [`y1115-10-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1115-10-2.md) | 11-15 13:46 | y1115-10-2 助言の頭・終わりの声：声を置いた／本体 v1490 は宣言待ち |
| [`cloud-voice-advice-20261115-043948.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-20261115-043948.md) | 11-15 13:46 | 雲で回した：`voice-advice.js` |
| [`y1115-8-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1115-8-2.md) | 11-15 13:33 | y1115-8 納品：v1489 助言の重なり直し |
| [`cloud-check-fast-20261115-042815.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261115-042815.md) | 11-15 13:29 | 雲で回した：`check-fast.js` |
| [`cloud-voice-advice-20261115-042344.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-20261115-042344.md) | 11-15 13:25 | 雲で回した：`voice-advice.js` |
| [`cloud-check-fast-20261115-040510.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261115-040510.md) | 11-15 13:06 | 雲で回した：`check-fast.js` |
| [`y1115-5-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1115-5-2.md) | 11-15 13:04 | y1115-5 続き：v1488（リーチの行の声と字から『定石では、』を外す） |
| [`cloud-voice-advice-20261115-040311.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-20261115-040311.md) | 11-15 13:04 | 雲で回した：`voice-advice.js` |
| [`cloud-check-fast-20261115-035605.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261115-035605.md) | 11-15 12:58 | 雲で回した：`check-fast.js` |

<!-- 控えの一覧 ここまで -->
