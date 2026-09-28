# 「命令0回」で切られた三つの枠の元（r0928-1201・読むだけ）

**終わり（残り0件）** — 2026-09-28 12:03ごろ（VAIO）。読むだけ。何も直していない。本体には触っていない。

## 1. 三つの枠：窓が立ち直ってから切られるまで
**一行で：枠の字はどれも窓に届いていない。窓が `--resume` で立ち直った直後の SessionStart の鉤が「resume」を hook.log に書き、見張りがそれを「仕事が始まった」と読んで、控えに残っていた前の件名で枠の時計を回し、9分後に命令0回で切った。**

| | 窓の立ち直り | hook.log（SessionStart） | 見張りの鍵 | 会話の記録（利用者の文） | 切られた刻・枠の名（＝控えに残っていた前の件名） |
|---|---|---|---|---|---|
| ① | 09-27 11:13 ごろ（claude 9984） | 11:13:03 inbox-feed「read 未処理なし」／11:13:04 **resume** | 11:14:26 idle → **run:11:13:04** | **無し**（11:13:54 の bridge_status だけ） | **11:24:19**「夜の保守・更新の仕事の起動条件と 03:20 へ寄せる管理者の一本」（00:23 の仕事） |
| ② | 09-27 23:34 ごろ（conhost の落ちの後・claude 10060） | 23:34:34 inbox-feed「read 未処理なし」／23:34:34 **resume** | 23:36:06 dead → **run:23:34:34** | **無し**（23:34:44 の bridge_status だけ） | **23:45:14**「bcdedit /bootsequence {memdiag} を管理者でもう一度（UAC が通らず）」（23:11 の仕事） |
| ③ | 09-28 03:49 ごろ（定時の再起動の後・claude 10492） | 03:49:56 **resume**／03:49:58 inbox-feed「read 未処理なし」 | 03:50:17 idle → **run:03:49:56**・03:52:05 に 😸 走り出しを一発 | **無し**（03:50:11 の bridge_status だけ） | **03:59:49**「09-27 23:25〜23:36 に Claude の窓が消えた元（読むだけ）」（01:38 の仕事） |

- **settings.json の鉤**：`hook-notice.ps1 -Kind resume` は **UserPromptSubmit と SessionStart の両方**に付いている。SessionStart の「resume」は、枠が届いていなくても書かれる
- **orders-full.jsonl**（届いた枠の全文）に、三つの刻の枠は**無い**。frame-in（枠を控える）の記録も無い
- **send-text**（窓へ字を打つ手）の記録も三つの帯に**無い**。read-screen は 09-24 から使っていない（遠隔の切れは会話の記録で判じる形）
- 切られた後に打った Esc 一打は、立ち直ったばかりで入力待ちの窓へ入っただけ（claude の子は0本）

## 2. 09-28 03:59 の枠が 01:42 に済んだ枠と同じ名で走りかけた訳
**一行で：受信箱・郵便受け・台帳のどこからも戻っていない。01:38 の仕事の件名が控え（work-note.txt）に残ったまま、03:49 の立ち直りの SessionStart の resume で見張りが「仕事が始まった」と読み、その件名を枠の名に使った。**
- 台帳：2026-09-28 01:38:48 の行は **済**（窓の手が落ちた…）のまま
- 受信箱（inbox.txt）：未処理 **0**
- 郵便受け：mailbox-pos.txt は **08-29 13:53** から動いていない
- 03:52:05 の「😸 終了予定は4時00分ですにゃ：09-27 23:25〜23:36 に Claude の…」も、同じ取り違えから出た走り出しの知らせ

### 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **443件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0928-1201.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1201.md) | 09-28 12:03 | 「命令0回」で切られた三つの枠の元（r0928-1201・読むだけ） |
| [`r0928-1045.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1045.md) | 09-28 10:42 | 未検収の 🔗 の二行を済へ（r0928-1045） |
| [`r0928-1035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1035.md) | 09-28 10:38 | 未検収を試しで片付ける（二つ目）（r0928-1035） |
| [`r0928-1020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1020.md) | 09-28 10:16 | 未検収を記録で片付ける（一つ目）（r0928-1020） |
| [`r0928-1010.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-1010.md) | 09-28 10:11 | 未検収の二行を済へ（記憶の診断・2048）（r0928-1010） |
| [`r0928-0950-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950-2.md) | 09-28 09:54 | conhost.exe の 0xc0000409 の落ち四回と、Windows Terminal の見込み（r0928-0950-2・読むだけ） |
| [`r0928-0950.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0950.md) | 09-28 09:54 | 09-28 の再起動の後の点検（記憶の診断・仮想メモリ・03:20・NODE_OPTIONS・引き継ぎ）（r0928-0950・読むだけ） |
| [`r0928-0348-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0348-2.md) | 09-28 03:48 | 再起動-2（r0928-0348・後の測り） |
| [`r0928-0345-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0345-2.md) | 09-28 03:45 | 再起動-2（r0928-0345・後の測り） |
| [`r0928-0302-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0302-2.md) | 09-28 03:02 | 再起動-2（r0928-0302・後の測り） |
| [`r0928-0138.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0138.md) | 09-28 01:40 | 09-27 23:25〜23:36 に Claude の窓が消えた元（r0928-0138・読むだけ） |
| [`r0928-0009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0928-0009.md) | 09-28 00:10 | bcdedit の二件と未検収の一行を済へ（r0928-0009） |
| [`r0927-2311.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2311.md) | 09-27 23:15 | bcdedit /bootsequence {memdiag} を管理者でもう一度（また UAC が通らず）（r0927-2311） |
| [`r0927-2257.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2257.md) | 09-27 23:01 | y0927-2251 にヨシ → 次の起動を記憶の診断に（UAC が取り消され、走っていない）（r0927-2257） |
| [`r0927-2226.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2226.md) | 09-27 22:30 | pipe-warn の鈴を「続く間も3時間ごと・消えたら戻り」に（r0927-2226） |
| [`r0927-2215.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2215.md) | 09-27 22:17 | healthchecks の down と、押しの止まりの間の pipe-warn の鈴（r0927-2215・読むだけ） |
| [`r0927-2046.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2046.md) | 09-27 20:47 | 定時再起動を写しから戻し、03:00 と 15:00 の二本立てに（r0927-2046） |
| [`r0927-2040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2040.md) | 09-27 20:41 | 定時再起動を 03:00 の一回だけに（r0927-2040） |
| [`r0927-2027.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2027.md) | 09-27 20:28 | 未検収の二行の手入れ（r0927-2027） |
| [`r0927-2013.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0927-2013.md) | 09-27 20:21 | 記憶 8GB に合わせて締め付けを緩めた（NODE_OPTIONS 2048・/clear の敷居 1500MB）（r0927-2013） |

<!-- 控えの一覧 ここまで -->
