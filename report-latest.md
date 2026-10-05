# 10-06 04:00〜06:40 に押しが止まった元（r1006-0704）

**終わり（残り0件）** — 2026-10-06 07:04ごろ（VAIO）。読むだけ。本体には触っていない。

## 一行
**止まったのは手元の押しではなく GitHub 側の配信。**手元の git push は帯の間も 22回 通っていた（git-push.log に失敗の行は無く、push-retry.log は0行）。GitHub Actions の「自動検査と配信」が **04:36〜06:12、動かす機械（hosted runner）を割り当てられず**——注に「The job was not acquired by Runner of type hosted even after multiple attempts」——scope／deploy の段が歩みも無いまま15分で切れて、公開側（Pages）が 04:08 の姿のまま止まった。

## 記録
- **手元**：git-push.log の失敗の字は 03:26〜03:34 の四行だけ（再起動直後の「時間切れで切った（20秒）push」「pull --rebase が通らなかった（-1）」）。04:00〜06:40 は失敗の行なし。origin/main が push で進んだ刻は 04:06・04:08・04:36・04:40・05:00・05:07・05:12・05:20×3・05:30・05:42・05:50×3・06:12・06:20・06:40×4 の **22回**（前日の同じ帯は6回）
- **GitHub 側（Actions の走り）**
  | 立った刻 | 終わり | 結果 |
  |---|---|---|
  | 〜04:08:11 | 1分以内 | success（ふだん通り） |
  | 04:36:57 | 04:48:04（11分） | success（遅い） |
  | 04:40:11〜05:50:38 の **10本** | それぞれ15〜26分 | **failure**（ほかに取り消し3本） |
  | 06:12:12 | 06:16:23（4分） | success |
  | 06:20:52 | 06:32:46（12分） | success |
  | 06:40:25〜 | 1分以内 | success（戻った） |
  - 落ちた走りの中身：最初の段 scope が **runner なし・歩み0・15分で cancelled** → check／deploy は skipped。scope が通った走りでも deploy が runner なしで cancelled
- **見張りの側**：05:00 に state-stale（公開の state.json が54分古い）→ 二巡待って **05:20 に 🪟**、05:30 に pub-late（104分遅れ）→ **05:50 に 🪟**、06:40 に「✅ 戻りました（state-stale・1時間20分／pub-late・50分）」。20分続いてから鳴る決まりのとおり動いた（本物の訴え）

## 残り
- 0件
- ＊こちらで直す所は無い。GitHub の hosted runner が戻るまで待つしかない形

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **502件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r1006-0704.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1006-0704.md) | 10-06 07:04 | 10-06 04:00〜06:40 に押しが止まった元（r1006-0704） |
| [`r1006-0336-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1006-0336-2.md) | 10-06 03:36 | 再起動-2（r1006-0336・後の測り） |
| [`r1006-0334-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1006-0334-2.md) | 10-06 03:34 | 再起動-2（r1006-0334・後の測り） |
| [`r1006-0330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1006-0330-2.md) | 10-06 03:30 | 再起動-2（r1006-0330・後の測り） |
| [`r1005-1526-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1005-1526-2.md) | 10-05 15:26 | 再起動-2（r1005-1526・後の測り） |
| [`r1005-1524-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1005-1524-2.md) | 10-05 15:24 | 再起動-2（r1005-1524・後の測り） |
| [`r1005-1319.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1005-1319.md) | 10-05 13:19 | 鍵切れの刻と、kagi-watch が鳴らなかった訳・塞いだ形（r1005-1319） |
| [`r1005-0334-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1005-0334-2.md) | 10-05 03:34 | 再起動-2（r1005-0334・後の測り） |
| [`r1005-0329-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1005-0329-2.md) | 10-05 03:29 | 再起動-2（r1005-0329・後の測り） |
| [`r1004-1528-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1004-1528-2.md) | 10-04 15:28 | 再起動-2（r1004-1528・後の測り） |
| [`r1004-1525-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1004-1525-2.md) | 10-04 15:25 | 再起動-2（r1004-1525・後の測り） |
| [`r1004-0333-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1004-0333-2.md) | 10-04 03:33 | 再起動-2（r1004-0333・後の測り） |
| [`r1003-1525-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1003-1525-2.md) | 10-03 15:25 | 再起動-2（r1003-1525・後の測り） |
| [`r1003-0336-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1003-0336-2.md) | 10-03 03:36 | 再起動-2（r1003-0336・後の測り） |
| [`r1003-0332-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1003-0332-2.md) | 10-03 03:32 | 再起動-2（r1003-0332・後の測り） |
| [`r1002-1525-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1002-1525-2.md) | 10-02 15:25 | 再起動-2（r1002-1525・後の測り） |
| [`r1002-0334-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1002-0334-2.md) | 10-02 03:34 | 再起動-2（r1002-0334・後の測り） |
| [`r1002-0330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1002-0330-2.md) | 10-02 03:30 | 再起動-2（r1002-0330・後の測り） |
| [`r1001-1526-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1001-1526-2.md) | 10-01 15:26 | 再起動-2（r1001-1526・後の測り） |
| [`r1001-1524-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1001-1524-2.md) | 10-01 15:24 | 再起動-2（r1001-1524・後の測り） |

<!-- 控えの一覧 ここまで -->
