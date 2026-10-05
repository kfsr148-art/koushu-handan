# 鍵切れの刻と、kagi-watch が鳴らなかった訳・塞いだ形（r1005-1319）

**終わり（残り0件）** — 2026-10-05 13:19ごろ（VAIO）。本体には触っていない。

## 一行
**鍵は 10-04 11:06〜11:26 の間に切れた（11:26:05 に鍵の期限内なのに使用量が HTTP 401、12:06 からは資格の綴りに鍵そのものが無い）。kagi-watch は会話の綴りに書かれる「鍵切れの返事（authentication_failed）」しか見ておらず、窓が 10-04 03:39 から手待ちで一行も書かれなかったので、10-05 13:12 の /login まで約26時間 鳴らなかった。**

## 並び（記録から）
| 刻 | 起きたこと |
|---|---|
| 10-04 03:39:13 | 会話の最後の行（/remote-control is active）。以後、窓は手待ち |
| 10-04 11:06:06 | 使用量 HTTP 200（最後に通った回） |
| **10-04 11:26:05** | **使用量 HTTP 401**（鍵の期限は 11:48 でまだ内）。記録は「鍵の入れ替えが要る」と書いただけで鳴らさない |
| 11:36・11:46 | 使用量 429 |
| 11:56:05 | 「鍵の期限切れ（11:48）」で取りに行かない |
| **12:06:05〜** | 「アクセストークンが読めない」＝資格の綴りに鍵が無い（10-05 13:12 まで続く） |
| 10-05 13:01:03 | 人が /remote-control →「requires a claude.ai subscription. Run /login」 |
| 10-05 13:12:37 | /login（資格の綴りが書き替わった）。13:14:12 に使用量 HTTP 200 |

## 塞いだ形（~/.claude/kagi-watch.ps1。題は今まで通り「🪟 鍵が切れています。黒い窓で /login」）
今までの見分け（会話の綴りの鍵切れの返事）に三つ足した。札の本文に「見分け」を一行で書く。
1. **/rc の失敗**：綴りの system の行に「/remote-control requires a claude.ai subscription」か、鍵の字（login・auth・401・subscription・token）を含む「/rc failed」「Remote Control disconnected」が、最後の Login successful・/remote-control is active・ふつうの返事より後にある → **その場で鳴らす**
2. **鍵が無い**：資格の綴り（.credentials.json）に accessToken が無い・読めない
3. **使用量の401／403**：usage.json の http（期限切れの鍵では取りに行かない作りなので、ここへ来るのは期限内の締め出し）。資格の綴りがその後に書き替わっていれば数えない
- 2・3 は一度きりの空振りを避けるため、**二回続けて見た時（2分おきの二巡）に鳴らす**。最初に見た刻は kagi-first.txt。鳴らした後は控え（kagi-seen.txt）がある間は鳴らし直さず、戻れば控えを消す
- 写し .bak-20261005・構文0件。watch-notify が2分おきに呼ぶ子なので起こし直しは要らない

## 作り値（会話の綴り・資格の綴り・usage.json・送り手はすべて scratchpad の偽物）
| 場合 | 結果 |
|---|---|
| A 10-04 の形（会話に鍵切れの字なし・使用量が期限内の401） | 一回目「次の回も続いていれば鳴らす」→ **二回目に一発**（見分け：使用量が HTTP 401（鍵の期限内））→ 三回目は鳴らし直さない |
| A2 資格の綴りに鍵が無い | 一回目は記録だけ → **二回目に一発** |
| B /remote-control が鍵で通らない（10-05 13:01 の形） | **その場で一発**（切れ始め 13:01:03） |
| C 鍵は生きている | 黙る（今まで通り） |
| D /login の後、usage.json がまだ401のまま | 黙る（資格の綴りの方が新しい） |
- 本物の綴りでも一度回した：出力なし・控えなし（いまは鍵が生きている）

## 残り
- 0件
- ＊10-04 の形なら、**11:28 ごろ**（401 の次の巡回）に鳴っていた計算
- ＊鍵が切れた元（なぜ期限内に締め出されたか）は、こちらの記録には無い

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **496件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r1001-0338-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1001-0338-2.md) | 10-01 03:38 | 再起動-2（r1001-0338・後の測り） |
| [`r1001-0333-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1001-0333-2.md) | 10-01 03:33 | 再起動-2（r1001-0333・後の測り） |
| [`r0930-1526-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0930-1526-2.md) | 09-30 15:26 | 再起動-2（r0930-1526・後の測り） |
| [`r0930-0336-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0930-0336-2.md) | 09-30 03:36 | 再起動-2（r0930-0336・後の測り） |
| [`r0930-0331-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0930-0331-2.md) | 09-30 03:31 | 再起動-2（r0930-0331・後の測り） |
| [`r0930-0120.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0930-0120.md) | 09-30 01:18 | conhost の落ち（0xc0000409）・窓の設定を素へ戻した（r0930-0120） |

<!-- 控えの一覧 ここまで -->
