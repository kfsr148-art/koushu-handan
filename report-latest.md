# 枠 十六：枠 十四の札が出なかった訳・済んだ仕事の札が出ない形を作りごと塞ぐ・last-reply.txt の遅れ（枠の印 2026-11-21 04:54:28・y1121-0455）

状態：終わり — 05:01（機械の刻）

## 一、枠 十四の札が出なかった訳（記録で辿った）
- 04:28:21 hook.log「resume」＝新しい手番の始まり。これは**背後で走らせた git pull の完了通知**（作法40が避ける形）が手番を始めたもの。resume は hook-notice.ps1 が「開始:」を刻み、**控えの指紋（note-at-start.txt）を取り直す**。この時の控えは枠 十四の完了を書き終えた版（札はまだ出ていない）だった。
- 04:28:36 Stop → 04:30:09 watch-notify「取り逃がしていた stop を拾った（04:28:40）…この回は控えを書いていない（前の回の控えが残っている）ので、終わりの札は出さない」。指紋が控えの中身と同じ＝「書いていない回」と判じた（Get-Note の unwritten）。04:32/04:40 に wait-unwritten→idle。
- 札が出たのは 04:54:11、枠 十五へ仕事が替わって退避した控え（note-stop-snap）から（「退避していた控えの札を先に立てた」04:54:13）。台帳の枠 十四の行は 04:54:13 に自動で済になった（ledger-close.log）。
- **効かなかった直し**：枠 九・十の直し（退避・Stop の写し）は「止まった時の控えを落とさない」ためで、**指紋の取り直し**には触れていない。枠 八の直し（控えを書いていない回は札を出さない）が、指紋が取り直されると「書き終えた控え」にも当たってしまった（今回の直接の原因）。
## 二、作りごとの直し（二段の網）
- **note-baseline.ps1（新規・hook-notice.ps1 の resume から呼ぶ）**：控えに完了が書いてあり、控えが notify-sent.tsv の最後の札より新しい（札がまだ出ていない）間は、指紋を取り直さない。「開始:」の刻み直しは今までどおり。
- **watch-notify.ps1 の Get-Note**：指紋が合っても、完了の頭40字がまだ直近100本の出した札の本文に入っていなければ、「書いていない回」にしない（退避の二度出しの見分けと同じ見方）。入っていれば今までどおり（枠 八の「該当せず」の回は札を出さない形は保つ）。
- 案として挙がっていた「橋に札を書いた時点をパネルの札の合図にも使う」は採らなかった：橋は窓が手で書くので、その時点を機械の合図にすると、書き忘れ・二度書きがそのまま札の抜け・二度出しになる。控えの完了と出した札の突き合わせ（上の二段）が、同じ穴を機械の側だけで塞ぐ。
- 作り値（一時の置き場・本物には書かない）：note-baseline 8件（初回は取る／完了つき・札がまだの控えは取り直さない／完了なしは取り直す／札が出た後は取り直す／開始の刻み）・Get-Note 4件（札がまだの完了は unwritten にしない／札が出ていれば今までどおり／完了なしは今までどおり）全て合い。構文 0件（hook-notice・note-baseline・watch-notify・turn-push）。写し .bak-20261121（hook-notice・watch-notify・turn-push・inbox-watch ほか）。実際の窓での再現（背後の完了通知→止まり）までは回していない。
## 三、last-reply.txt の遅れ（04:28:35 → 04:49:25）
- 訳：Stop の二つの hook（turn-mark.js と非同期の turn-push.ps1）は並んで走る。04:28 は turn-push が先に走り、last-reply.txt がまだ無く（初回）、載らなかった。以後も turn-push が先だと一つ前の返事を押す恐れがあった。押しは次の Stop まで来ない。
- 直し：turn-push.ps1 が Stop の時、last-reply.txt が今から20秒以内に書かれるのを最大3秒待ってから押す（非同期なので窓は止まらない）。枠 十四の続きで入れた「見張りの state.json の押しにも未送を載せる」と合わせて、遅れは最大でも十数秒。
## 四、枠 十四の台帳の行：04:54:13 に自動で済（ledger-close）。手では触っていない。
## 作法44 十三に足した。



---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. 🔎 調べました

```
この間にまとまった知らせ 2本

［✅ 終わりました（返事不要）］
枠 十四：Stop の最後の返事を koushu-state に置く
（次の枠が先に届いたため、止まる前に出した札。札の抜けではありません）
種類: 外待ち
完了: 一・二：Stop の合図（turn-mark.js）が last_assistant_message から last-reply.txt（刻・件名・本文）を組む。鍵・トークン・ntfy の宛先は伏せ、4000字で切って注記。三：turn-push.ps1 が Stop の時だけ state.json と同じ一回の押しに載せる（git-push.ps1 の STATE_NAMES に足した）。四：作法44 十二に足した。
ファイル: ~/.claude/turn-mark.js・turn-push.ps1・git-push.ps1・.gitignore・CLAUDE.md・reports/y1121-0425.md
実測: 作り値（一時の置き場）で伏せ3種・4000字切り・空は置かない。構文誤り0。
実機: この手番が止まった後、koushu-state の last-reply.txt に今の返事が出る。

［🔎 調べました］
枠 十五：口調表の本人待ちの洗い出し（調べ）
口調表は執事9行だけ。63行＝済み5／本人待ち4／未着手54。本人の選び：一 宮崎（くいやんせ・ござんすだけ方言）これでよいか。二 博多（んしゃる・ですね・依頼形は要検証）これでよいか。三 京都（おくれやす・どすだけ）これでよいか。四 武士（それがし・殿は付けない）これでよいか。五 沖縄の論文が読めない：探すか、今の形で止めるか。六 元の裏付けを辞典で取るか。進められる：軍師の9行を案として下調べ（約40〜60分・Opus・粗い見込み）。軍師以降は執事の4行が決まるまで正式には始めない約束。
ファイル: reports/y1121-0450.md
実測: 口調表 83行を全部読み、v1508 の経緯 commit を確かめた。手は入れていない。
```

### 2. 👀 見てください（返事不要）

```
枠 十三：state.json に panelView を足す
一・二：見張りが state.json に panelView（頭の字・まとめて写すの残り・出した刻）を足す。組む所は panel-view.js 一つ（panel.html の headText と同じ決まりの写し）。ずれは panel-check ⑤の十六（panel.html の headText を実際に動かして384組を突き合わせ）が見張る。三：senkoReadAt だけで数えた旨を basis に入れた。四：作法44 十一に足した。常駐を起こし直した（起動 04:16:42）。
ファイル: panel-view.js・panel-check.js・CLAUDE.md・inbox-watch.ps1（~/.claude）・reports/y1121-0415.md
実測: panel-check --static 全て PASS（⑤の十六 384組 同じ）。state.json に panelView が出た（04:16）。
実機: なし（本人の画面は変えていない）。センコが state.json の panelView を読んで、パネルの頭の字を言えること。
```

### 3. ✅ 戻りました（再起動・39分・帯の間に黙らせた物 3件）

```
この間にまとまった知らせ 3本

［👀 見てください（返事不要）］
枠 十二：橋の札を済んだ札へ移す・件名のずれ
一：橋の文書の古い札（枠 六〜一）を末尾の節「済んだ札」へ move で移した（消さない・hash 一致）。作法44 三を「移す」に書き替えた。二：件名が戻った訳＝枠 十一の直しは手番の間に段の台帳を書いた時だけ効き、手すきの窓（01:54〜）では busy.subj に戻った。手すきの間は最後に済んだ仕事の名を出すよう直した。
ファイル: state-decide.js・state-decide-test.js・CLAUDE.md・reports/y1121-0340.md
実測: state-decide-test 件名 4件 合い（直す前 NG）・札の印 14件・総当たり 1344組 NG 0件。
実機: 窓が手すきで仕事が無い時、パネルの件名が「枠 九」でなく最後に済んだ仕事（枠 十二…）の名になる。橋の文書は「窓から（札）」が五枚・末尾に節「済んだ札」。

［✅ 終わりました（返事不要）］
写せます（6件）

［✅ 戻りました（再起動・39分・帯の間に黙らせた物 3件）］
再起動の静かな帯が明けました（11-21 03:00〜03:40・39分）。
帯の間に黙らせた物：healthchecks の /fail・見張りの止まり（#29）・再起動の後の点検の欠け
＊claude が立ち、hook.log が動き出したのを見て明けとしました。
```

### 4. 🔗 新しい線

```
https://claude.ai/code/session_012aGgAFjo8RtLreSR5xKABy

Code タブ：引き継ぎは試していない（claude-loop は新しい会話で立てた。pick-resume.log を見る）

窓の claude（pid 3044）の remote-control の宛先です。
＊記録は ~/.claude/inbox-watch.log。
```

### 5. 🪟 窓を起こす待ち手が居ません（窓は手待ち・受信箱の未処理 1件・雲待ち なし）

```
窓を起こす待ち手が居ません（窓は手待ち・受信箱の未処理 1件・雲待ち なし）
巡回二回続けて、未処理があるのに rewake の待ちが0本でした。一言を送れない訳があります（使用量の止まり・再起動の帯・入力欄に字がある など）。
```

<!-- 送った知らせ ここまで -->

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **1019件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1121-0455.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1121-0455.md) | 11-21 05:01 | 枠 十六：枠 十四の札が出なかった訳・済んだ仕事の札が出ない形を作りごと塞ぐ・last-reply.txt の遅れ（枠の印 2026-11-21 04:54:28・y1121-0455） |
| [`y1121-0450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1121-0450.md) | 11-21 04:52 | 枠 十五：口調表の本人待ちの洗い出し（調べ）（枠の印 2026-11-21 04:48:30・y1121-0450） |
| [`y1121-0425.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1121-0425.md) | 11-21 04:27 | 枠 十四：Stop の最後の返事を koushu-state に置く（枠の印 2026-11-21 04:21:54・y1121-0425） |
| [`cloud-panel-check-20261120-191832.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261120-191832.md) | 11-21 04:27 | 雲で回した：`panel-check.js` |
| [`y1121-0415.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1121-0415.md) | 11-21 04:17 | 枠 十三：state.json に panelView（本人の画面の頭の字・まとめて写すの残り）（枠の印 2026-11-21 04:12:17・y1121-0415） |
| [`y1121-0340.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1121-0340.md) | 11-21 03:44 | 枠 十二：橋の札を「済んだ札」へ移す・件名のずれ（枠の印 2026-11-21 03:25:14・y1121-0340） |
| [`r1121-0334-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1121-0334-2.md) | 11-21 03:34 | 再起動-2（r1121-0334・後の測り） |
| [`r1121-0327-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1121-0327-2.md) | 11-21 03:27 | 再起動-2（r1121-0327・後の測り） |
| [`y1120-2314.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2314.md) | 11-20 23:28 | 枠 十一：橋の札を消した件・state.json の subj が枠 九のまま（枠の印 2026-11-20 23:11:51・y1120-2314） |
| [`y1120-2236.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2236.md) | 11-20 23:04 | 枠 十：札まとめ中の印が新しい札の無い止まりで立った訳・「終わったにゃ、写して」の順（枠の印 2026-11-20 22:33:27・y1120-2236） |
| [`y1120-2208.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2208.md) | 11-20 22:18 | 枠 九：済んだ枠 七の行が結べず残った件・今日の結べなかった札 53件の訳・作りごとの直し（枠の印 2026-11-20 22:08:41・22:09:16・y1120-2208） |
| [`y1120-2205.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2205.md) | 11-20 22:01 | 橋の枠 八：21:42:09 の「✅ 終わりました」の札の道・該当せず／控えを書かなかった回は札を出さない（枠の印 2026-11-20 21:46:07・y1120-2205） |
| [`y1120-2148.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2148.md) | 11-20 21:56 | 橋の枠 七の受け漏れを直す・枠 七（ヨシの解除・作法1の替え）（枠の印 2026-11-20 21:44:46・21:22:57・y1120-2148） |
| [`y1120-2118.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2118.md) | 11-20 21:31 | 橋の枠 六：センコが読んだ札を写した扱いに・枠 四の札の二度出し・窓が書く刻（枠の印 2026-11-20 21:16:09・y1120-2118） |
| [`y1120-2105.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2105.md) | 11-20 21:31 | 橋の枠 五：枝 senko の合図を見張りが見て、橋と同じ道で窓を動かす（枠の印 2026-11-20 21:01:53・y1120-2105） |
| [`cloud-panel-check-20261120-122153.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261120-122153.md) | 11-20 21:31 | 雲で回した：`panel-check.js` |
| [`y1120-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2050.md) | 11-20 20:58 | 橋の枠 四：仕事が終わる直前の間は「待機中」でなく「札まとめ中」と出す（枠の印 2026-11-20 20:28:07・y1120-2050） |
| [`cloud-panel-check-20261120-115051.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261120-115051.md) | 11-20 20:58 | 雲で回した：`panel-check.js` |
| [`y1120-2025.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-2025.md) | 11-20 20:43 | 橋の枠 三：時計の待ちが起きなかった訳・時計の待ちで next・現況は待ち（時計）（枠の印 2026-11-20 20:21:42・y1120-2025） |
| [`cloud-panel-check-20261120-113356.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261120-113356.md) | 11-20 20:43 | 雲で回した：`panel-check.js` |

<!-- 控えの一覧 ここまで -->
