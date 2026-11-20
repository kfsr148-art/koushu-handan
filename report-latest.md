# 枠 十三：state.json に panelView（本人の画面の頭の字・まとめて写すの残り）（枠の印 2026-11-21 04:12:17・y1121-0415）

状態：終わり — 04:17（機械の刻）

## 一、panelView を足した
- 見張り（inbox-watch.ps1）が state.json を書く直前に、リポジトリ直下の panel-view.js を道で渡して呼び、panelView を足す（PowerShell の文字化けを避けて、入出力とも道で渡す）。こけても state.json は今までどおり書く。
- 中身：head（頭の字）／label（まとめて写す（残N／N件）または（0件））／left／basis／senkoReadAt／at（出した刻）。実物（04:16）：head「作業中、、、。」・label「まとめて写す（0件）」・left 0。
- 常駐を起こし直した（起動 04:16:42 ＞ 台本更新 04:15:57・本数 1）。写し .bak-20261121 あり・構文誤り 0・BOM 残り。
## 二、ずれない仕組み
- panel-view.js は panel.html の headText／cardsPending／cardPendText／kumoEtaSec／isRunning／mergedTodo と同じ決まりの写し。
- panel-check.js に ⑤の十六 を足した：panel.html の headText（と使う関数）を実際に動かし、状態8×中身2×札の印4×雲2×最新札3＝384組で panelView の頭の字と突き合わせる。384組すべて同じ。残りの数え方（刻までは数えない・刻より新しい札だけ・「写せます（N件）」は数えない）と basis の一言も確かめる。
## 三、センコの読みだけで数える
- 本人が端末で押した「写した」印は端末の中だけ。panelView は senkoReadAt だけで数え、basis に一言入れた。本人が手で写した分があると、パネルの方が少なく出る。
## 四、作法44 に足した（十一）
- panelView の中身・組む所（panel-view.js）・直す時の決まり（panel.html を直したら panel-view.js も）・⑤の十六。
- 実測：panel-check --static 全て PASS（⑤の十六 3件）。



---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 戻りました（再起動・39分・帯の間に黙らせた物 3件）

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

### 2. 🔗 新しい線

```
https://claude.ai/code/session_012aGgAFjo8RtLreSR5xKABy

Code タブ：引き継ぎは試していない（claude-loop は新しい会話で立てた。pick-resume.log を見る）

窓の claude（pid 3044）の remote-control の宛先です。
＊記録は ~/.claude/inbox-watch.log。
```

### 3. 🪟 窓を起こす待ち手が居ません（窓は手待ち・受信箱の未処理 1件・雲待ち なし）

```
窓を起こす待ち手が居ません（窓は手待ち・受信箱の未処理 1件・雲待ち なし）
巡回二回続けて、未処理があるのに rewake の待ちが0本でした。一言を送れない訳があります（使用量の止まり・再起動の帯・入力欄に字がある など）。
```

### 4. 🔁 落とします（定時）

```
定時の再起動（枠 2026-11-21 03・11-21 03:00）
空き 4603MB ／ claude 1本・私用 641MB
空きメモリ 4603MB ／ 全体 8071MB
見送り 0/3回
最後の更新：2026-11-21 02:40:41  claude update：終了コード 0・Claude Code is up to date (2.1.329)（35秒）
台帳の未了0・走っている道具なし・押し残し0［台帳の未了 40件（訳にしない）・ヨシ待ち 3件（訳にしない）］
60秒後に落ちる。戻りは「✅ 戻りました（再起動から）」で知らせる。
```

### 5. ✅ 終わりました（返事不要）

```
枠 十一：橋の札を消した件・件名のずれ
見えていた画面が 2 枚から 1 枚になりました。claude のプロセスも 2 本から 1 本へ、同じだけ終わっています。
閉じられたか、こちらで止めたものです。残っている物は無いので、手は要りません。
```

<!-- 送った知らせ ここまで -->

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **1015件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y1120-1945b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-1945b.md) | 11-20 20:23 | 橋の枠 二：15:00 の橋の試しの行を済みとして閉じ、同じ形の行を数える（枠の印 2026-11-20 19:29:27・y1120-1945b） |
| [`y1120-1945.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-1945.md) | 11-20 19:38 | 着手直後の「待ち」と赤い「見込み未記入」を出さない（枠の印 2026-11-20 19:00:26・y1120-1945） |
| [`cloud-panel-check-20261120-102858.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-panel-check-20261120-102858.md) | 11-20 19:38 | 雲で回した：`panel-check.js` |
| [`y1120-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1120-1915.md) | 11-20 19:19 | 橋の文書の「窓へ（枠）」の枠 一（枠の印 2026-11-20 18:06:41・y1120-1915） |

<!-- 控えの一覧 ここまで -->
