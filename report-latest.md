# 待ちにも終わる見込み・様子を写すの見込み行（panel v182）（2026-11-20 08:15）

## 札の頭
- 状態：終わり（公開の反映待ちだけ。雲の検査 709554ff は success・deploy も success）。

## したこと
1. **待ちの見込み**：検査中・待ち・手待ちの下の雲待ちに「終わる見込み HH:MM（あとN分）」を出す（`waitEtaRow()`）。刻は見張りが種類別（パネル替え・本体替え・報告だけ）の前5回の中央値で出した値（kumo の「見込み」・detail の「終了予定／再開」）をそのまま読む。読めなければ赤「見込み未記入」（「不明」なら「見込み不明」）、過ぎれば赤「見込みを過ぎた N分」。何も待たない手待ちには出さない。
2. **様子を写す**：「見込み：…」の行を足した（`etaLineText()`：作業中は mikomi・待ちは待ちの見込み・無ければ「なし（作業も待ちも無い）」）。
3. **panel-check ⑤の四**：検査中・雲待ち・超過・見込み不明・待ちの刻なし・何も待たない手待ちの6通りと、様子を写すの字面。
4. 版：PANEL_VER・verTag・panel-ver.txt ＝182。

## 雲の検査
- 一度目（dea17fe8）：✗2件。古い検査「検査中・待ちの黄色い帯には字が出ない」が新しい見込みの行に当たった（今回足した ⑤の四は ✓）。deploy は止まって公開は181のまま。
- 直して押し直し（709554ff）：check／deploy とも success。⑤の四は全6件 ✓（検査中「終わる見込み 23:20（あと10分）」・雲待ち・超過「見込みを過ぎた 15分」・見込み不明・見込み未記入・何も待たない手待ちは出ない・様子を写すに「見込み：」）。

## 公開の版
- deploy 完了 23:11:53（UTC）の直後は panel-ver.txt が181のまま（Pages の反映待ち）。反映後に182を確かめる。

## 実機で見る所
- 雲の検査待ちの間、状態の下に水色「終わる見込み HH:MM（あとN分）」・様子を写すの字に「見込み：…」の行・版の字が panel v182。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **950件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1120-0735.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-0735.md) | 11-20 08:13 | 待ちにも終わる見込み・様子を写すの見込み行（panel v182）（2026-11-20 08:15） |
| [`cloud-panel-check-20261119-223956.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261119-223956.md) | 11-20 07:57 | 雲で回した：`panel-check.js` |
| [`y1120-0700.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-0700.md) | 11-20 07:16 | 三段目：仕掛けを外す・道具の前後の走りを一つに・パネルの状態（2026-11-20 07:15） |
| [`y1117-1850.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-1850.md) | 11-20 07:16 | y1117-1850 助言の終わり方をまとめる直し：声の本数と v1506／v1507 の判断 |
| [`y1117-1830.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-1830.md) | 11-20 07:16 | y1117-1830 「判定の上の一言」を助言の頭に入れる直し：声の本数と v1506／v1507 の判断 |
| [`y1117-1500.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-1500.md) | 11-20 07:16 | y1117-1500 本体 v1506 の工事の宣言（四つ一工事＋言葉56人＋国士の直し） |
| [`y1117-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-1330.md) | 11-20 07:16 | y1117-1330 四つ一工事：全文を作り、30秒超0を確認（写しの上） |
| [`y1117-1330-words.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-1330-words.md) | 11-20 07:16 | 麻雀の言葉98語の全文（代表3人・案） |
| [`y1117-1230.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-1230.md) | 11-20 07:16 | y1117-1230 四つ一工事・30秒の詰め（途中まで） |
| [`y1117-1130.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-1130.md) | 11-20 07:16 | y1117-1130 四つを一つの工事に（先の知らせ） |
| [`y1117-0225-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-0225-3.md) | 11-20 07:16 | y1117-0225 声づくり 3回目の走りの後始末（v1503） |
| [`y1116-1-7.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-1-7.md) | 11-20 07:16 | y1116-1 7回目起動 |
| [`y1116-1-6.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-1-6.md) | 11-20 07:16 | y1116-1 追補（6回目起動） |
| [`y1116-1-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-1-4.md) | 11-20 07:16 | y1116-1 助言の声（3回目の後） |
| [`r1120-0355-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1120-0355-2.md) | 11-20 07:16 | 再起動-2（r1120-0355・後の測り） |
| [`r1111-0329-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1111-0329-2.md) | 11-20 07:16 | 再起動-2（r1111-0329・後の測り） |
| [`r1110-0328-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1110-0328-2.md) | 11-20 07:16 | 再起動-2（r1110-0328・後の測り） |
| [`r1109-1523-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1109-1523-2.md) | 11-20 07:16 | 再起動-2（r1109-1523・後の測り） |
| [`r1109-0353-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1109-0353-2.md) | 11-20 07:16 | 再起動-2（r1109-0353・後の測り） |
| [`r1108-0354-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1108-0354-2.md) | 11-20 07:16 | 再起動-2（r1108-0354・後の測り） |

<!-- 控えの一覧 ここまで -->
