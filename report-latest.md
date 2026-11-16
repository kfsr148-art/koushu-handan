# y1116-6-2 v1499 納品・引退した声の整理

状態: 終わり（残り0件）

- 走りは落ちていなかった。v1499 の check.yml（43849232840）は、直後の自動押しに追い越されて cancelled になっただけ。雲の速い検査（job.yml・43849232876・reports/cloud-check-fast-20261116-102938.md）は ①〜㉒ 全 PASS、adv-check も PASS。後続の check.yml は全て success で、公開側の ver.txt は 1499。
- 引退した声（台本 voice-advice-dial.js に無い advy-…）を数えた：5,504本・約194MB（直下の advy- は 11,828本・420.1MB だった）。本体・check.js・serifu・advice-tone-core.js のどれも advy-<8桁> を直書きしていないことを確認してから git rm・push（bb310d92）。
- 外した後：advy- は 6,324本（台本と同数）・226.2MB。引退0本。
- 注意：事前の見込み「約1,190本」より多いのは、前の版（v1495 など）で引退した分が残っていたため。
- 実機で見る所：なし（声の名は本体から解決されるまま。助言を読み上げる画面で、方言の声が鳴らなければ知らせてください）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **812件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1116-6-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-6-2.md) | 11-16 19:53 | y1116-6-2 v1499 納品・引退した声の整理 |
| [`y1116-10.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-10.md) | 11-16 19:47 | 56人の助言：「ぼやきながら世話を焼く」言い回しの案（代表3人）（y1116-10） |
| [`y1116-9.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-9.md) | 11-16 19:38 | 56人の助言：ネットの麻雀の型を借りた「面白み」の案（代表3人）（y1116-9） |
| [`cloud-check-fast-20261116-102938.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261116-102938.md) | 11-16 19:32 | 雲で回した：`check-fast.js` |
| [`cloud-voice-advice-dial-20261116-095736.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-095736.md) | 11-16 19:15 | 雲で回した：`voice-advice-dial.js` |
| [`cloud-voice-advice-dial-20261116-093558.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-093558.md) | 11-16 18:56 | 雲で回した：`voice-advice-dial.js` |
| [`y1116-8.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-8.md) | 11-16 18:32 | 56人の助言：麻雀の言い回しと駆け引きの話の案（代表3人）（y1116-8） |
| [`y1116-7.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-7.md) | 11-16 18:27 | 56人の助言：言い回しの表と「面白み」の案（代表3人）（y1116-7） |
| [`y1116-6.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-6.md) | 11-16 18:15 | 56人の助言の文を方言と人物の目で読み直した（y1116-6） |
| [`y1116-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-5.md) | 11-16 14:49 | y1116-5 殿の読みを直した声170本の作り直し（雲・1回） |
| [`cloud-voice-advice-dial-20261116-054141.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-054141.md) | 11-16 14:48 | 雲で回した：`voice-advice-dial.js` |
| [`y1116-4-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-4-2.md) | 11-16 12:41 | y1116-4-2 括弧を二回読む声123本の作り直し（雲）の取り込み |
| [`cloud-voice-advice-dial-20261116-033245.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261116-033245.md) | 11-16 12:39 | 雲で回した：`voice-advice-dial.js` |
| [`cloud-check-fast-20261116-032009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261116-032009.md) | 11-16 12:22 | 雲で回した：`check-fast.js` |
| [`y1116-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-3.md) | 11-16 08:11 | y1116-3：v1498（助言の声を本体へ結ぶ）の雲の検査と配信 |
| [`cloud-check-fast-20261115-225630.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261115-225630.md) | 11-16 07:59 | 雲で回した：`check-fast.js` |
| [`y1116-1-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-1-3.md) | 11-16 07:23 | 助言の声 4,700本（8回目で完了） |
| [`cloud-voice-advice-dial-20261115-220011.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261115-220011.md) | 11-16 07:11 | 雲で回した：`voice-advice-dial.js` |
| [`cloud-voice-advice-dial-20261115-213714.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-voice-advice-dial-20261115-213714.md) | 11-16 06:58 | 雲で回した：`voice-advice-dial.js` |
| [`y1116-1-7.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1116-1-7.md) | 11-16 06:36 | y1116-1 7回目起動 |

<!-- 控えの一覧 ここまで -->
