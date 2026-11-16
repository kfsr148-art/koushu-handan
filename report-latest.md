# y1117-0100b v1501／v1502 納品（代表三人の面白みの一言・雲の検査の結果）

状態: 終わり（残り0件・この件）

## したこと
- **v1501**（298b3557）代表三人の面白みの一言 36文を本体へ当てた。声36本は直前の commit で直下へ。
- **v1502**（a540b3f4）参照ゼロの `advOmoText` を削った。v1501 で雲の検査⑤（死にコード）が落ちたための直し。

## 雲の検査（v1502）
- 速い検査（job.yml・走り 43911502290）：**全PASS**（①〜㉓・adv-check も PASS）。所要 70秒。控え `reports/cloud-check-fast-20261116-164858.md`。
- 自動検査と配信（check.yml・走り 43911502366）：scope／check／deploy すべて success。
- 公開側の `ver.txt` は **1502**（読み直して確認）。

## 実機で見る所
代表三人の助言で、結論・訳・やる事の後に付く面白みの一言が出る。版の字が v1502。

## 残し事
- 一言が前の文と同じ意味を重ねる件は、v1503 の宣言（y1117-0208）で別に扱う。このヨシ待ちは本体の工事の宣言のみ。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **827件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1117-0100b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-0100b.md) | 11-17 02:10 | y1117-0100b v1501／v1502 納品（代表三人の面白みの一言・雲の検査の結果） |
| [`cloud-check-fast-20261116-164858.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261116-164858.md) | 11-17 01:50 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261116-162349.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261116-162349.md) | 11-17 01:26 | 雲で回した：`check-fast.js` |
| [`y1117-0100-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1117-0100-2.md) | 11-17 01:23 | y1117-0100 続き：v1501 を当てた |
| [`cloud-voice-advice-dial-20261116-160824.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-160824.md) | 11-17 01:10 | 雲で回した：`voice-advice-dial.js` |
| [`y1116-13-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-13-2.md) | 11-17 00:07 | 納品報告 y1116-13-2（v1500 雲の速い検査） |
| [`cloud-check-fast-20261116-144858.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261116-144858.md) | 11-16 23:51 | 雲で回した：`check-fast.js` |
| [`cloud-voice-advice-dial-20261116-134544.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-134544.md) | 11-16 23:01 | 雲で回した：`voice-advice-dial.js` |
| [`cloud-voice-advice-dial-20261116-130511.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-130511.md) | 11-16 22:40 | 雲で回した：`voice-advice-dial.js` |
| [`cloud-voice-advice-dial-20261116-124330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-124330.md) | 11-16 22:03 | 雲で回した：`voice-advice-dial.js` |
| [`cloud-voice-advice-dial-20261116-122250.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-122250.md) | 11-16 21:42 | 雲で回した：`voice-advice-dial.js` |
| [`cloud-voice-advice-dial-20261116-120437.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-120437.md) | 11-16 21:42 | 雲で回した：`voice-advice-dial.js` |
| [`cloud-voice-advice-dial-20261116-111623.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-111623.md) | 11-16 20:35 | 雲で回した：`voice-advice-dial.js` |
| [`y1116-13.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-13.md) | 11-16 20:00 | 助言の文：意味の繰り返しと、話のまとまりの直し（案・数え直し）（y1116-13） |
| [`y1116-11.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-11.md) | 11-16 19:54 | 56人の助言：面白みの出し方の仕組みと、けなげなぼやき（代表3人）（y1116-11） |
| [`y1116-6-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-6-2.md) | 11-16 19:53 | y1116-6-2 v1499 納品・引退した声の整理 |
| [`y1116-10.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-10.md) | 11-16 19:47 | 56人の助言：「ぼやきながら世話を焼く」言い回しの案（代表3人）（y1116-10） |
| [`y1116-9.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-9.md) | 11-16 19:38 | 56人の助言：ネットの麻雀の型を借りた「面白み」の案（代表3人）（y1116-9） |
| [`cloud-check-fast-20261116-102938.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261116-102938.md) | 11-16 19:32 | 雲で回した：`check-fast.js` |
| [`cloud-voice-advice-dial-20261116-095736.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-095736.md) | 11-16 19:15 | 雲で回した：`voice-advice-dial.js` |

<!-- 控えの一覧 ここまで -->
