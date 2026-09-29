# 窓だけが消えた 🪟 を帯に入れる・19:14 の窓の落ちの元（r0929-1934）

**終わり（残り0件）** — 2026-09-29 19:34ごろ（VAIO）。本体には触っていない。

## 2. 19:14 の窓の落ちの元（一行）
**19:11:49 に conhost.exe が 0xc0000409（障害オフセット 0x68eff）で落ちて窓が消え、窓を失った claude が約2分半残ってから落ちた**（09-21 08:51・09-27 23:31 と同じ所の落ち）。
- 並び：19:11:49 conhost の落ち（Application 1000・WER 1001 BEX64）→ 19:12:09 見張り「画面だけが減った 1→0（プロセス 1→1）」→ **19:14:12 一回待った見直しでまだ claude が居たので「🪟 異常です（手が要ります）…窓だけが消えています」**（札。鈴は名乗りなしで送らず）→ 19:14:26 revive「0本」→ 19:16:26 起こし直し（--resume 50aca653）→ 19:18:23 静かな帯が明けた
- 会話は同じ 50aca653 を継いだ（15.6MB）

## 1. 窓が消えた回は帯に入れ、claude も落ちれば黙らせた物に数える（~/.claude/watch-notify.ps1）
- 窓だけが減った回に **静かな帯（窓の立ち直り）へ入り**、win-gone-pending.txt に「前の窓の数・前の本数・最初に見た刻」を控える
- **二巡（240秒）まで**見直す間に claude も落ちれば、**「窓だけが消えた（claude も続けて落ちた）」を帯の黙らせた物に数えて鳴らさない**（明けの「✅ 戻りました」に載る）。dead も帯の中なので黙る
- 窓が戻れば鳴らさず、この件で入った帯（まだ何も黙らせていない物）は畳む（残すと60分の「戻りません」が偽で鳴るため）
- 240秒たっても窓だけのままなら、今まで通り「🪟 窓だけが消えています」
- 仕組みの選び：待つ長さは「2分以内」ではなく**二巡（4分）**にした。見張りは2分おきにしか見ないうえ、19:14 は claude が窓の消えから約2分半後に落ちており、2分で切ると頼まれたこの形そのものが鳴るため。＊選ばなかった案：2分ちょうどで判じる（19:14 は鳴る）
- 写し .bak-20260929c・構文0件。予定表から2分おきに起こされるので起こし直しは要らない

## 作り値（帯の印・控えは scratchpad・送り手は偽物）
| 場合 | 結果 |
|---|---|
| A 19:14 の再現（窓 1→0・claude は +245秒の見直しで 0） | **鳴らさない**（+0・+123 は待つ、+245 で黙らせた物に数えた。帯の黙らせた物「窓だけが消えた（claude も続けて落ちた）」） |
| B 窓だけのまま claude が残る | +0・+120 は待ち、**+241 で 🪟**（今まで通り） |
| C 待つ間に窓が戻る | 鳴らさない・**帯を畳んだ** |
| D 窓と claude が同じ回に消えた | ✅（閉じられた形・今まで通り） |

## 実機
- 画面に出る物は無し。**次に conhost の落ちで窓が消えても「🪟 窓だけが消えています」が出ず、起こし直しの後の「✅ 戻りました（窓の立ち直り…）」に黙らせた物として載ること**（人手待ち）

## 残り
- 0件
- ＊conhost の落ちそのもの（0x68eff）は今日も起きた（map-3 の「残る」の二行に三度目）。直していない

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **476件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`r0929-1934.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1934.md) | 09-29 19:34 | 窓だけが消えた 🪟 を帯に入れる・19:14 の窓の落ちの元（r0929-1934） |
| [`r0929-1848.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r0929-1848.md) | 09-29 18:48 | map-2・map-3 を 09-29 18:00 の姿に書き直した（r0929-1848） |
| [`map-3-incidents.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-3-incidents.md) | 09-29 18:47 | 09-21〜09-29 の出来事（map-3） |
| [`map-2-alerts.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/map-2-alerts.md) | 09-29 18:47 | 鈴と札の全種類（map-2） |
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

<!-- 控えの一覧 ここまで -->
