# いまの様子

**作業中** — 状態に「調べた」を足す

未処理 0 件 ／ 2026-08-23 23:24:15 書き出し（VAIOの時計）

＊この頁は知らせが出るたびに書き直されます。話題名は載せません。
＊押し送り（ntfy）へ出るのは異常のときだけです。ここには異常でないものも並びます。

---

## 送った知らせ（新しい順に二十件まで）

### 1. 🔎 調べました

```
報告の型を八項目へ
七項目に⑧そのままを足し、⑦を三つに書き分け、同じ題は上書きする形にした。パネルの一覧では⑧を持つ件を畳み、押すと開く。
ファイル: koushu-handan/panel.html v22（stateWord に調べた／kind に 🔎／sixLines を八項目へ／LABEL に食い違い・答え・そのまま・種類／一覧で⑧持ちを畳む）
実測: notices.json 11件で先頭が 🔎 調べました ／ 一覧の色分け wait ／ 状態欄 調べた ／ 実測が箇条書きで省略なし ／ notify-record.ps1 と panel.html とも構文OK
食い違い: なし
答え: EDA_WHIP.idleFront は枝豆のムチ側でも使われている。よって兎の席だけ別の定数を新設して分ける。
未決: 枝豆のムチ側の三経路（9472 跳躍の線／9503 edaDir の初期値／9550 edaIdleKey の正面）を実際に通して剣士の絵が出ることを確かめてから兎を納品する
そのまま: 【この回に Code タブへ書いた本文】

■ 状態に「調べた」を足した（panel v22）
- panel.html stateWord に 調べました／調べた を足し、終わりましたより先に見る（どちらも「〜ました」で終わるため）
- panel.html kind に 🔎 を足し、色分けは wait（青）。手は入れていないの意
- panel.html sixLines で、状態が調べたのときだけ⑥実測を一項目一行の箇条書きにする。「 ／ 」で区切って書き、行に開く
- watch-notify.ps1 の控えの型に kind を足し、種類: 調べた と書いた回は題を 🔎 調べました にする

■ 兎の件で確かめたこと
- koushu-handan.html:8501 で x.key === 'usagi' が window.KISHI_IDLE_FRONT を読む
- koushu-handan.html:9314 で window.KISHI_IDLE_FRONT = EDA_WHIP.idleFront
- koushu-handan.html:9293 が idleFront の実体（data URI）
- koushu-handan.html:9472 jumpLineFrame: 'idleFront'（跳躍の線を引くコマ）
- koushu-handan.html:9503 edaDir の初期値が 'idleFront'
- koushu-handan.html:9550 edaIdleKey() が正面のとき 'idleFront' を返す
- 焼き上がりの控え kishi_idle_front.png 115x317 59043バイト
- 元絵 kishi_idle_front_src.png 704x1524
- 新しい素材 usagi_v2.png 1024x1024 1342171バイト 外接 y53-960 x309-713
- 結論 EDA_WHIP.idleFront は触らず、兎専用の定数を新設して分ける

■ 報告の型の四点
- ⑧そのまま＝要約せずに貼る欄。字数の上限なし。空なら「なし」
- 報告で表を使わない。ファイル名・行番号・パスは一項目一行の箇条書き。省略記号で切らない
- ①〜⑧のどれかが空のまま書き出そうとしたら、その前に止めて埋める。書けないときは理由を⑧に書く
- 一件を書き出すとき、同じ題が status.md にあれば行を足さず上書きする（notify-record.ps1 で実装）
```

### 2. 🔎 調べました

```
兎の絵の出どころと、枝豆のムチとの共有
EDA_WHIP.idleFront は枝豆のムチ側でも使われている。兎の席だけ別の定数へ分ける必要がある。
ファイル: koushu-handan.html:8501（兎が参照）／koushu-handan.html:9314（KISHI_IDLE_FRONT へ受け渡し）／koushu-handan.html:9293（idleFront の実体・data URI）
実測: koushu-handan.html:9472 jumpLineFrame: 'idleFront'（跳躍の線を引くコマ） ／ koushu-handan.html:9503 edaDir の初期値が 'idleFront' ／ koushu-handan.html:9550 edaIdleKey() が正面のとき 'idleFront' を返す ／ 焼き上がりの控え kishi_idle_front.png 115x317 59043バイト ／ 元絵 kishi_idle_front_src.png 704x1524 ／ 新しい素材 usagi_v2.png 1024x1024 1342171バイト 外接 y53-960 x309-713 ／ 結論 EDA_WHIP.idleFront は触らず兎専用の定数を新設する
```

### 3. ✅ 終わりました（返事不要）

```
写せなかったときの釦
何をしたかの控えがありません（止まる側の書き忘れです）。
ファイル: panel.html v21（copyOne の失敗側を done から failed へ分け、写せません＋手で写す箱＋印を付けない形に／.cp.ng の赤を追加）
実測: 四通りを駆動。成功=写した/cp ok/印付いた/箱出ない、拒まれた=写せません/cp ng/印付かない/箱出た、その場で例外=同じ、clipboard が無い=同じ
```

### 4. ✅ 終わりました（返事不要）

```
写した後の釦の再コピー
写した後の釦でも同じ文面が再コピーできることを確かめ、押した手応えが出るようにした
ファイル: panel.html v20（copyOne に again の見分けを足し、二度目は釦を「また写した」にして1.5秒で戻す／写しに失敗したときも done を通すようにした）
実測: 本体から copyOne を切り出して二度押しを駆動。一回目 釦=写した class=cp ok 写した回数1、二回目 釦=また写した 写した回数2、二回とも同じ文面。七件とも七行・余計な行0・絵文字なし・題の混入なし
```

### 5. ✅ 終わりました（返事不要）

```
写した後の釦の再コピー
何をしたかの控えがありません（止まる側の書き忘れです）。
ファイル: panel.html v20（copyOne に again の見分けを足し、二度目は釦を「また写した」にして1.5秒で戻す／写しに失敗したときも done を通すようにした）
実測: 本体から copyOne を切り出して二度押しを駆動。一回目 釦=写した class=cp ok 写した回数1、二回目 釦=また写した 写した回数2、二回とも同じ文面。七件とも七行・余計な行0・絵文字なし・題の混入なし
```

### 6. ✅ 終わりました（返事不要）

```
パネルの上部三表示と全部写す
写しを七項目へ改定し、全部写すと上部の三表示を入れた。stable を v1421 へ進めた
ファイル: panel.html v18（sixLines の一行目に [時刻] 件名、copyAllText と copyAll と nowLine を新設、paintFacts と .facts と .cpall を追加）／~/.claude/inbox-watch.ps1（state.json に statAt を追加、state-since.txt で状態の変わり目を控える）
実測: 21:04 の実値で 版 本体v1421 公開v1421 ずれなし／最終確認21:04 古さ33秒／状態 作業中。一件ずつの写しは七項目で先頭が [20:18] 件名。全部写すは未写し5件を古い順に連結し末尾に 現況：作業中 本体v1421 公開v1421 最終確認21:04。stable を afe9141（v1421）へ進め、検査は両方PASS
```

### 7. ✅ 終わりました（返事不要）

```
パネルの上部三表示と全部写す
写しを七項目へ改定し、全部写すと上部の三表示を入れた。stable を v1421 へ進めた
ファイル: panel.html v18（sixLines の一行目に [時刻] 件名、copyAllText と copyAll と nowLine を新設、paintFacts と .facts と .cpall を追加）／~/.claude/inbox-watch.ps1（state.json に statAt を追加、state-since.txt で状態の変わり目を控える）
実測: 21:04 の実値で 版 本体v1421 公開v1421 ずれなし／最終確認21:04 古さ33秒／状態 作業中。一件ずつの写しは七項目で先頭が [20:18] 件名。全部写すは未写し5件を古い順に連結し末尾に 現況：作業中 本体v1421 公開v1421 最終確認21:04。stable を afe9141（v1421）へ進め、検査は両方PASS
```

### 8. Claude Code watch (test)

```
ntfy 全廃の後の確かめ。押し送りはせず、控えとパネルの一覧にだけ出るはず。
```

### 9. ✅ 終わりました（返事不要）

```
一覧を最新5件に絞る
一覧も控えの実体も最新5件に揃えた。6件目より古いものは消える
ファイル: panel.html v14（SHOW_MAX=5 と slice を追加）／~/.claude/notify-record.ps1（$KEEP を20から5へ、切る処理を足したときの外へ出した）
実測: 20件の控えを通して一覧は5件（SHOW_MAX=5）。書き出し直しで notify-sent.tsv 20行→5行、notices.json 20→5、status.md の見出し 5。切る処理が足したときの中にしかなく実体が20行のまま残る不具合を実測で見つけて直した
```

### 10. 🪟 異常です（手が要ります）

```
一覧を最新5件に絞る
Claude Code が 1 個、画面の無いまま動いています。画面だけが見えなくなっています。
こちらがすること：開き直してください。古いプロセスが残るので、開き直したあとに古いほうを終わらせてください。
```

### 11. ✅ 終わりました（返事不要）

```
一覧を最新5件に絞る
一覧も控えの実体も最新5件に揃えた。6件目より古いものは消える
ファイル: panel.html v14（SHOW_MAX=5 と slice を追加）／~/.claude/notify-record.ps1（$KEEP を20から5へ、切る処理を足したときの外へ出した）
実測: 20件の控えを通して一覧は5件（SHOW_MAX=5）。書き出し直しで notify-sent.tsv 20行→5行、notices.json 20→5、status.md の見出し 5。切る処理が足したときの中にしかなく実体が20行のまま残る不具合を実測で見つけて直した
```

### 12. ✅ 終わりました（返事不要）

```
押し送りを異常だけに絞る（案B）
ntfy へ出るのは異常だけにし、読み物と状態をリポジトリ経由へ一本化。パネルから送る側の道具を撤去。state.json が59分黙って止まっていた不具合を実測で見つけて直した
```
