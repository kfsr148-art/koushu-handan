# 途中で切れた枠を、続きの「以上」で繋ぐ（r0929-1844）

**終わり（残り1件：map の書き直しに続けて着手）** — 2026-09-29 18:44ごろ（VAIO）。本体には触っていない。

## したこと（~/.claude/frame-work.ps1 に Join-Part を足した）
- **前半を控える**：「以上」で終わらない枠のうち、**40字以上**で、ヨシ・印（y…）・「続けて」・命令の形でない物を、**frame-part.json に10分だけ**控える。続けて切れて届いた物は前半の後ろへ足す
- **繋ぐ**：「以上」で終わる枠が**10分以内**に届いたら、**前半＋それ**を一つの枠として捌く（台帳の行・件名・orders-full.jsonl の全文は繋いだ字）
  - 届いた枠が**前半の頭（20字）から始まっていれば全文の出し直し**とみなし、繋がずにそれだけを捌く（09-29 14:23 の形）
- **捨てる**：10分を過ぎた前半は捨て、「以上」の枠はそれだけで捌く
- 前半そのものは今までどおり fragment として orders-full.jsonl に残る。記録は hook.log の frame-work の行
- 写し .bak-20260929・構文0件。常駐が毎回起こす子なので起こし直しは要らない

## 作り値（前半の置き場は scratchpad。字は 09-29 14:20:51 の断片157字と 14:23:50 の全文246字をそのまま使った）
| 場合 | 結果 |
|---|---|
| 前半（14:20:51）＋後半89字（2分あと） | **246字の一つの枠**（全文と一字違わず一致） |
| 後半だけ（前半の控え無し） | **89字のまま**捌く |
| 前半（14:20:51）＋後半（14:31:52・11分あと） | 前半は**捨てた**。後半89字だけ捌く |
| （おまけ）前半のあとに全文の出し直し | 繋がず、全文246字だけ |
| （おまけ）「y0928-1919 は取り下げ」 | 前半にしない |

## 残る穴（選ばなかった案）
- **前半の10分以内に、続きではない新しい枠が「以上」で届くと、繋いでしまう。**09-29 16:05 の断片（「…（版」）のあと 16:11 に別の枠が届いた形がこれに当たる（6分後）
- 仕組みの選び：頼まれたとおり「10分以内の『以上』は続き」とし、全文の出し直しだけを外した。＊選ばなかった案：続きと新しい枠を字の形で見分ける（「読むだけ」「1.」で始まる枠は新しい枠とみなす等）——当てずっぽうが混じるので入れていない
- ＊働き手の側には鉤の出力で繋いだ字を渡していない（台帳・件名・控えの側だけ）。窓に届く二件は今までどおり作法23で繋いで読む

## 残り
1. map-2・map-3 を 09-29 18:00 の姿に書き直す（これから）

---

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **474件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0929-1844.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1844.md) | 09-29 18:44 | 途中で切れた枠を、続きの「以上」で繋ぐ（r0929-1844） |
| [`r0929-1745.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1745.md) | 09-29 17:45 | 偽の残り三つを塞いだ（延び・pipe-check・郵便受け）（r0929-1745） |
| [`r0929-1633.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1633.md) | 09-29 16:31 | claude update を予定表 ClaudeUpdate へ切り離した（r0929-1633） |
| [`r0929-1616.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1616.md) | 09-29 16:15 | 枠の切れ・ログオン後の二本・03:33 の更新・偽の鈴9通（r0929-1616） |
| [`r0929-1528-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1528-2.md) | 09-29 15:28 | 再起動-2（r0929-1528・後の測り） |
| [`r0929-1524-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1524-2.md) | 09-29 15:24 | 再起動-2（r0929-1524・後の測り） |
| [`r0929-1427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1427.md) | 09-29 14:25 | 同じ枠の二度落としを塞いだ・落とす前の起き上がり札・偽の鈴9通（r0929-1427） |
| [`r0929-0430-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0430-2.md) | 09-29 04:30 | 再起動-2（r0929-0430・後の測り） |
| [`r0929-0412.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0412.md) | 09-29 04:10 | 夜の鈴の棚卸し（09-28 13:30〜09-29 04:10）（r0929-0412） |
| [`r0929-0330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-0330-2.md) | 09-29 03:30 | 再起動-2（r0929-0330・後の測り） |
| [`r0928-2003.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2003.md) | 09-28 19:59 | 「見張りの生存記録が N 分途切れています」の偽（5419分・5776分）を直した（r0928-2003） |
| [`r0928-2005.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-2005.md) | 09-28 19:42 | map-3 の未特定・様子見の五行の元を当て直した（r0928-2005） |
| [`r0928-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1945.md) | 09-28 19:38 | 仮置き・未実装の印と、欠けた絵・音の洗い出し（r0928-1945） |
| [`r0928-1922.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1922.md) | 09-28 19:17 | map-2 の要確認（三つ目）：heavy-skip・記録の順・My First Check・使わない台本（r0928-1922） |
| [`map-1-parts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-1-parts.md) | 09-28 19:16 | 連携で動いている物の一覧（map-1） |
| [`r0928-1912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1912.md) | 09-28 19:12 | map-2 の要確認（二つ目）：#49・#50・#44 を作り値で確かめて直した（r0928-1912） |
| [`r0928-1901.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1901.md) | 09-28 19:01 | map-2 の要確認（一つ目）：#16・#19・#35 を作り値で確かめて直した（r0928-1901） |
| [`r0928-1807.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1807.md) | 09-28 18:07 | Check-FrameLimit の切り方を「固まり」と「長すぎ」に（r0928-1807） |
| [`r0928-1756.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1756.md) | 09-28 18:07 | 読むだけ：pathspec の枠・控えの預けの枠・今の予定（r0928-1756） |
| [`r0928-1750.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1750.md) | 09-28 17:48 | 静かな帯の漏れ二通を塞いだ（r0928-1750） |

<!-- 控えの一覧 ここまで -->
