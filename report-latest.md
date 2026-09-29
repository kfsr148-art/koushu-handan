# 偽の残り三つを塞いだ（延び・pipe-check・郵便受け）（r0929-1745）

**終わり（残り0件）** — 2026-09-29 17:45ごろ（VAIO）。本体には触っていない。

## 1. 時間切れで切った枠は終了予定を消し「延びています」を出さない
- 元：切った後も開始の時計（work-started.txt）と見込みが残り、終了予定を過ぎると「🕒 延びています」が鳴っていた（09-28 14:48・14:50 🙀）
- 直し：Check-FrameLimit が書く **frame-cut.txt（開始の刻<TAB>件名）がいまの仕事を指していれば**
  - **watch-notify.ps1**：延び（over／undef）を出さず「時間切れで切った枠なので延びは出さない」を記録だけ
  - **inbox-watch.ps1**：state.json の見込み（mikomi）を空にする＝パネルの終了予定が消える
- 作り値：**A 切った枠 → 延び出ない・見込み空**／**B 切っていない枠（frame-cut は前の仕事）→ 延び出る・見込み「60分」**

## 2. pipe-check の訴えは二巡（20分）続いた時だけ鳴らす
- 元：見たその回に鳴らしていた。09-28 17:50 の clock-broken・pub-late、09-27 22:30 の subj-gap は次の巡回で消え、🪟 と ✅ が対で出ていた
- 直し（**pipe-check.ps1**）：初めて見た種類は **pipe-warn-first.txt** に刻を書いて pipe-warn.log へ「first 初めて見たので記録だけ」。**19分以上続いていれば一発目を鳴らす**（10分おきの巡回で三回目）。その前に消えれば「20分続かずに消えた（鳴らさない）」と書いて落とし、✅ も出さない。鳴らした後（⏰ まだ続いています・✅ 戻りました）は今まで通り
- 作り値：**A 0分に clock-broken → 10分で消えた → 鳴らない**／**B pub-late が 0・10・20分と続いた → 20分に「🪟 異常です（連携に訴え：pub-late）」を一発**

## 3. 郵便受けの詰まりは10分続いた時だけ鳴らす
- 元：詰まり（読みが5分止まる／読み残しが3分）を見たその回に鳴らしていた。09-26 21:42・23:32、09-28 23:01 はどれも2〜4分で解けた
- 直し（**watch-notify.ps1**）：**mail-stuck-first.txt** に「種類（silent／pending）<TAB>最初に見た刻」を置き、**同じ種類が10分続いたら一度だけ**鳴らす。10分より前に解ければ「10分続かずに解けた（鳴らさず記録だけ）」で消す。静かな帯の間は今まで通り黙って数える
- 作り値：**A 0・2分と詰まり 4分で解けた → 鳴らない**／**B 0・6・10・12分と続いた → 10分に一度だけ鳴る（12分は鳴らない）**

## ファイル
- ~/.claude/watch-notify.ps1（写し .bak-20260929b）：1・3
- ~/.claude/inbox-watch.ps1（写し .bak-20260929）：1。**常駐を起こし直した**（起動 17:44:56 ＞ 台本 17:43:14・1本）
- ~/.claude/pipe-check.ps1（写し .bak-20260929）：2
- 構文0件ずつ

## 回る段の突き合わせ（作法36）
- 手元：ClaudeWatchNotify（2分おき・1・3）／ClaudePipeCheck（10分おき・2）／常駐 inbox-watch（1）。予定表の顔ぶれ（Claude* 14件）は変えていない
- 雲：check.yml・job.yml は変えていない

## 実機
- 画面に出る物は無し。**次に時間切れが出ても「🕒 延びています」が続かず、パネルの終了予定が消えること／pipe-check の 🪟 は20分続いた訴えだけ・郵便受けの 📮 は10分続いた詰まりだけ**（人手待ち）

## 残り
- 0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **473件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`r0928-1656-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1656-2.md) | 09-28 16:56 | 再起動-2（r0928-1656・後の測り） |

<!-- 控えの一覧 ここまで -->
