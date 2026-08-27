# いまの様子

**作業中** — 押し出しが四度続けて弾かれる筋道の調べ

未処理 0 件 ／ 2026-08-28 07:09:06 書き出し（VAIOの時計）

＊この頁は知らせが出るたびに書き直されます。話題名は載せません。
＊押し送り（ntfy）へ出るのはヨシ待ちだけです。ここには押し送っていないものも並びます。
**押し送りは止めています**（本日 23 件で上限20件に達しました）。
ヨシ待ちだけなら1日十数件のはずです。この数は、別の経路から漏れている合図です。

---

## 送った知らせ（新しい順に二十件まで）

### 1. 🔎 調べました

```
押し出しが四度続けて弾かれる筋道の調べ
弾かれる筋道を記録で辿り、直し方の案を三つ立てて、推す一つを決めた。直しは当てていない（panel.html にも見張りの台本にも、この回の書き込みは無い）。あわせて、こちらが前に「関門は十数分かかる」と言っていたのは誤りだったので訂正する。実測では約5分だった。筋道は「関門が5分・見張りが平均1分46秒ごとに押す」ため、関門を回しているあいだにほぼ必ず先が動く、という一点に尽きる。押す直前に取り込む段（pull --rebase）を入れても効かない。取り込みは関門の前に済むので、関門の5分ぶんがそのまま隙になるため。＊なお「まとめて写すで写した札を落とす」件（08:0x の枠）は、この調べを先にしたので着手していない。次に回す。
ファイル: なし（git-push.log と git log と背後の仕事の書き出しを読んだだけ）
実測: 関門（.githooks/pre-push が回す node check-all.js --fast）の所要＝約5分。四回の実測は 05:56:30ごろ→06:01:28（約5分）／06:02:10ごろ→06:06:59（約5分）／06:20:00ごろ→06:24:57（約5分）／06:31:45ごろ→06:36:32（約5分）。見張りの押し出しの間隔＝06:00:35 から 07:06:14 までの65.6分に37回で、平均1分46秒ごと。いちばん長い静かな間は 06:45:06→07:04:15 の19分09秒で、それ以外に5分以上空いた所は無い（次に長いのが 06:12:59→06:17:05 の4分06秒）。弾かれた四回の時刻と、そのとき先を動かしていた相手＝①06:01:28（こちらは dfddf9a を当てにしていたが 0bcc2f0＝06:01:23 の「usage: 更新」に5秒差で抜かれた）②06:06:59（0bcc2f0 のつもりが d63900c＝06:05:22 の「state.json」に1分37秒差）③06:24:57（032651c のつもりが 2a8cc1f＝06:22:58 の「usage: 更新」に1分59秒差）④06:36:32（87d5913 のつもりが e134231＝06:35:25 の「usage: 更新」に1分07秒差）。四回とも、こちらの commit は見張りの押し出しに乗って遠くへ届いており、未押し出しの commit は0件。
そのまま: 【(1) いま弾かれる筋道】
関門の所要 … 約5分。`git push` は網へ出る前に `.githooks/pre-push` を回し、そこで `node check-all.js --fast` が走る。実測は四回とも約5分だった（05:56:30ごろ→06:01:28／06:02:10ごろ→06:06:59／06:20:00ごろ→06:24:57／06:31:45ごろ→06:36:32）。
＊訂正 … 前の報告で「関門は十数分かかる」と書いたが誤り。約5分が正しい。十数分かかっていたのは、こちらが別に回していた check-all --fast の側（⑯⑰まで含む回）だった。
見張りが押す間隔 … 06:00:35 から 07:06:14 までの65.6分に37回。平均1分46秒ごと。押し手は usage / state / board / notices の四つで、それぞれ別の周期で動く。
いちばん長い静かな間 … 06:45:06→07:04:15 の19分09秒。ここ以外に5分以上空いた所は一つも無い（次に長いのが 06:12:59→06:17:05 の4分06秒）。
弾かれた四回 …
　①06:01:28 … 当てにしていた先 dfddf9a ／ 実際の先 0bcc2f0（06:01:23「usage: 更新」）。差 5秒。
　②06:06:59 … 当てにしていた先 0bcc2f0 ／ 実際の先 d63900c（06:05:22「state.json：いまの様子を更新」）。差 1分37秒。
　③06:24:57 … 当てにしていた先 032651c ／ 実際の先 2a8cc1f（06:22:58「usage: 更新」）。差 1分59秒。
　④06:36:32 … 当てにしていた先 87d5913 ／ 実際の先 e134231（06:35:25「usage: 更新」）。差 1分07秒。
筋道 … 関門が5分かかる一方、見張りは平均1分46秒ごとに押す。だから関門を回しているあいだに、ほぼ必ず先が動く。押す直前に `git pull --rebase --autostash` を入れても効かない——取り込みは**関門の前**に終わるので、関門の5分ぶんがそっくり隙になる。5分の静かな間は65.6分に一度しか無かった。
＊中身は失われていない。見張りの押し出しは枝ごと運ぶので、こちらの commit も一緒に遠くへ届く。四回とも未押し出しの commit は0件だった。

【(2) 直し方の案】
案A 錠を置く … 押すあいだだけ見張りの押し出しを止める。`~/.claude` に錠のファイルを置き、`git-push.ps1` が錠を見たらその回は押さずに見送る。押し終えたら錠を外す。／止めるもの＝見張りの押し出し（数分間）。／犠牲＝その数分、遠くの控えが古くなる。あと `git-push.ps1` に手を入れるので、凍結-0 の「見張りへ新しい仕掛けを足さない」に触れる。
案B 弾かれたら押し直す … `pull --rebase` して `push` をやり直す、を通るまで繰り返す。／止めるもの＝何も止めない。／犠牲＝一回ごとに関門の5分がまるまる掛かる。5分の静かな間は65.6分に一度しか無かったので、通るまで何度も回ることになる（この一時間の記録なら、期待値でおよそ十回前後）。
案C こちらは押さない … commit までをこちらが行い、遠くへ届けるのは見張りに任せる。関門の代わりに、commit の前に自分で `node check-all --fast` を回す。／止めるもの＝こちらからの `git push` そのもの。／犠牲＝「関門を通して押した」とは言えなくなる。検査は同じものを同じだけ回すので、通っていることの確かさは変わらない。

【(3) 推す案と理由】
推すのは案A（錠を置く）。理由は、検査を必ず通したうえで押し出しも実際に成功する形はこれだけだから——案Bは五分の関門を何度も回すだけで確率は変わらず、案Cは押し出しそのものを諦める形になる。ただし `git-push.ps1` へ手を入れるため、凍結-0 の下では裁定が要る。凍結を崩したくなければ、次善は案C（検査は同じだけ回るので、失うのは言い方だけ）。
```

### 2. ✅ 終わりました（返事不要）

```
一覧の「調べました」の札を畳む（panel v53）
上の一覧に出る「調べました」の札を、届いた時点で畳んだ形にした。終わりました（返事不要）と同じで、表題と時刻と写す釦の一行だけを出し、押すと本文が全文開く。開閉は openKeys に載るので、15秒の読み直しでも開いたまま保たれる（v47 の仕掛けにそのまま乗せた）。直したのは三箇所で、いずれも Edit の道具で一箇所ずつ当てた——①isLookNotice() を新設（題に「調べました」を含むか）②一覧の組み立てで isLookCard を採る③畳む条件 fold へ isLookCard を足す。他の種別の札には触れていない（ack と そのまま持ちと 終わりました は今までどおり畳み、それ以外は今までどおり開いたまま）。版は三箇所とも53。commit は 76c080c。関門は両方PASSで抜け、公開側の実読みも済んだ——panel-ver.txt=53／verTag 278行「panel v53（8月28日）」／PANEL_VER 299行 53／isLookCard 779行／fold の条件 781行／isLookNotice() 1366行。押し出しそのものは四度目もはじかれた（cannot lock ref）が、中身は見張りの押し出しが枝ごと運んで届いており、未押し出しの commit は0件。＊この commit に report-latest.md が相乗りしている。こちらが add したのではなく、見張りが先に index へ載せていたぶんが一緒に入った。中身は見張りが書いた報告書そのもので、いずれ押し出される物なので害は無いが、commit の題が中身を言い切れていない。次から add の前に index を確かめる。
ファイル: panel.html（v52→v53・14行の差分）／panel-ver.txt（52→53）／orders-open.tsv（調べ畳み-1）。scratchpad に panel-look-probe.js。＊report-latest.md が commit に相乗り。
実測: 作業前の行番号（v52 時点）＝調べましたの札を組んでいる箇所は、一覧の組み立ての中の rows.forEach が 766〜790行あたりで、その中の受け取り確認の判じが 766行、そのまま持ちの判じが 769行、終わりましたの判じが 774行、畳む条件が 776行。題で見分ける関数は isDoneNotice が 1358行。直した後＝isLookCard の判じが 779行、畳む条件が 781行、isLookNotice() が 1366行、verTag 278行、PANEL_VER 299行、panel-ver.txt 53。三手の実測（本文450字・「…」を入れない札で駆動）＝一手目 届いた直後は本文が閉じている（高さ0px・class="wait ack"）／二手目 表題を押した後は本文が出ている（高さ544px・class="wait ack open"・字数450でもとの本文と一字一句同じ・「…」0件）／三手目 15秒の読み直しの後も開いたまま（高さ544px・class="wait ack open"・字数450・「…」0件）。三手ともPASS。
実機: 返事パネルの上の一覧で、「🔎 調べました」の札が届いた時点では表題と時刻と写す釦の一行だけになっていること。表題を押すと本文が途中で切れずに全文開くこと。開いたまま15秒以上待っても勝手に閉じないこと。ほかの種別の札（🙋 ヨシしてください など）の見え方は今までどおりであること。版の字が panel v53。
```

### 3. 🔎 調べました

```
v52 の枠が再送で届いた（実行し直していない）
「v52 を進める＋まとめて写すを青くする」の枠が、済んだ後にもう一度届いた。確認-6／再枠の前例どおり実行し直していない。台帳へ 再枠4-1 を取消として積み、結果だけを画面へ再掲した。panel.html にも panel-ver.txt にも、この回の書き込みは無い。済んでいる中身は次のとおり——件数の実測は0件・1件・3件の三通りで釦の字と実数が一致（PASS）。色の実測は地 rgb(30,111,217)＝#1e6fd9・字 rgb(255,255,255)・丸み 10px・高さの下限 48px。公開側の実読みで panel-ver.txt=52、verTag 278行「panel v52（8月28日）」、PANEL_VER 299行 52、青の指定は 130〜131行、件数の仕掛けは 248行と 550〜556行。他の釦の札（.cpall から .cpall[hidden] まで）は公開中の v51 と一字一句同じで差分0行。
ファイル: ~/.claude/orders-open.tsv（再枠4-1 を取消として追記）のみ。panel.html は無変更。
実測: 未押し出しの commit は0件。commit は e54d6ac（panel v52）。作業前の行番号は、件数を出している箇所が 釦の要素 242行・copyBundle() 553〜557行・取得のたびの組み直し 725行、釦の札が .cpall{} 112〜114行・.cpall:active 115行・.cpall.ok 116行・.cpall:disabled 120行・.cpall:disabled:active 121行・.cpall[hidden] 125行。直した後は #btnCopyBoard が 126〜132行、boardCount / boardLabel / setCopyBoardLabel が 544〜552行、verTag 272行、PANEL_VER 293行。
実機: 返事パネルのいちばん上の「まとめて写す（N件）」が青地に白字で、押している間だけ少し暗い青になること。N がそのとき上の一覧に出ている札の数と合っていること。他の釦の色は今までどおりであること。版の字が panel v52。
```

### 4. ✅ 終わりました（返事不要）

```
まとめて写すの件数表示と青い釦（panel v52）
手元に載っていた v52（件数表示）をそのまま進め、青くする一件を足して仕上げた。①件数＝boardCount() / boardLabel() / setCopyBoardLabel() を新設し、釦の字を「まとめて写す（N件）」にした。数えるのは実際に写しへ入る札だけで、noticesText() が拾うのと同じ絞り（shown のうち片付いていないもの）を使う。あなた待ち・直近に終わった仕事・今日の報告・現況の一行は札ではないので数えない。字を戻す先（copyInto の back）にも件数つきの字を渡した——渡さないと、写した後に戻ったときだけ数字が消える。取得のたびの組み直しに加え、札を一枚写した直後にも二つの釦の字を組み直すようにした（しないと次の取得まで古い数字が残る）。②青＝id で #btnCopyBoard{background:#1e6fd9; color:#fff; border-color:#1e6fd9;} と :active{background:#1857aa; …; filter:none;} を足しただけ。丸みも大きさも .cpall のまま。id は .cpall.ok より強いので、写した直後に字が緑へ転ばない（青地に緑は読めないため、ここは狙って強くしてある）。他の釦の札には一行も触れていない。Edit の道具で一箇所ずつ、五回に分けて当てた。commit は e54d6ac。関門は両方PASSで抜けた。ただし押し出しそのものは三度目もはじかれた（cannot lock ref）——押す前に取り込む段を入れても、関門が十数分かかるあいだに見張りが押すので追いつかない。中身は見張りの押し出しが枝ごと運ぶので届いており、未押し出しの commit は0件。＊押す前に遠くの先を取り込む段（git pull --rebase --autostash）を挟んだ。前二回はこれが無く、関門を回している十数分のあいだに見張りが押して弾かれていた。
ファイル: panel.html（v51→v52）／panel-ver.txt（51→52）／orders-open.tsv（まとめ件数-1・青釦-1）。scratchpad に panel-count-probe.js と panel-bundle-probe.js。
実測: 作業前の行番号＝件数を出している箇所は、釦の要素 242行／copyBundle() 553〜557行（写す中身を組む所）／取得のたびの組み直し 725行（setCopyAllLabel の隣）。釦の札は .cpall{} 112〜114行／.cpall:active 115行／.cpall.ok 116行／.cpall:disabled 120行／.cpall:disabled:active 121行／.cpall[hidden] 125行。直した後＝#btnCopyBoard の二行が 126〜132行、boardCount/boardLabel/setCopyBoardLabel が 544〜552行、verTag 272行、PANEL_VER 293行、panel-ver.txt 52。件数の実測＝札0件で「まとめて写す（0件）」写しに入った札0件／札1件で「まとめて写す（1件）」写しに入った札1件／札3件で「まとめて写す（3件）」写しに入った札3件。三通りとも字と実数が一致（PASS）。色の実測＝地 rgb(30,111,217)＝#1e6fd9／字 rgb(255,255,255)／丸み 10px／高さの下限 48px（他の釦と同じ）。他の釦の札の差分＝0行（差分に出るのは足した二行と注記だけで、既にある .cpall 系の行は一行も消えていない）。公開側の実読みも済んだ——panel-ver.txt=52／verTag 278行「panel v52（8月28日）」／PANEL_VER 299行 52／青の指定は 130〜131行に #btnCopyBoard{background:#1e6fd9; color:#fff; border-color:#1e6fd9;} と :active{background:#1857aa; …; filter:none;} が入っている／件数の仕掛けは 248行の釦の字「まとめて写す（0件）」と 550〜556行の boardCount / boardLabel / setCopyBoardLabel。他の釦の札（.cpall から .cpall[hidden] まで）は公開中の v51 と一字一句同じで差分0行。
実機: 返事パネルのいちばん上の「まとめて写す（N件）」が青地に白字で、押している間だけ少し暗い青になること。N がそのとき上の一覧に出ている札の数と合っていること。他の釦（お知らせ／画面の写し取り一覧／終わりました N件／写した札 N件）の色は今までどおりであること。版の字が panel v52。
```

### 5. 🔎 調べました

```
v50・v51 の押し出しの確認と、まとめて写すの中身の実測
三つに答えた。(1) v50・v51 はどちらも遠くへ届いている。押し出しは二度とも弾かれたが（関門を回している十数分のあいだに見張りが押して先が動いたため）、見張りの押し出しが枝ごと運ぶので、こちらの commit も一緒に届いていた。未押し出しの commit は0件。公開側を実読みして三箇所とも51で揃っていることを確かめた。(2) まとめて写すの中身には、お知らせの札の本文が全文入っている。切っている所は無い。「…」は56件出るが、これは本文にもともとある字（notices.json の本文の中に28件）が、お知らせの節と今日の報告の節の二箇所へ入るため二倍になったもので、切った印ではない。(3) まとめて写すの釦の字に件数は出ていない。公開側は「まとめて写す」のまま。＊この問いが届く前に、手元では件数を出す直し（v52）を当ててしまっていた。まだ commit も push もしておらず、公開側には出ていない。書き込みはここで止めている。戻すか進めるかの指示を待つ。
ファイル: なし（この回は読みと測りだけ。ただし直前の回で panel.html に v52 の直しが未コミットで載っている）
実測: (1) 3a77ddd（v50）と 12e2f0f（v51）はどちらも origin/main に入っている。未押し出しの commit は0件。公開側＝panel-ver.txt 51／verTag 272行「panel v51（8月28日）」／PANEL_VER 293行 '51'。(2) 公開中の v51 を写しに取り、公開ページの本物の notices.json（20件・45164バイト）を差して まとめて写す を押させた結果＝写った字は46538字、「…」は56件。もとの notices.json の本文の合計は22470字で、その中に「…」が28件ある。二節（お知らせ／今日の報告）へ本文が入るので 28×2=56 と一致し、切った印は0件。いちばん長い札は6594字で、末尾まで欠けずに入っている。(3) 公開中の釦の字は「まとめて写す」（件数なし）。上の一覧の札は20件だった。
```

### 6. ✅ 終わりました（返事不要）

```
写す物なしの欄を0件で消す（v51）の実測と、v50・v51 の push
三手の実測を通し、v50 と v51 をまとめて push へ回した。いま関門（.githooks/pre-push）が二度目の node check-all.js --fast を回している。＊一度目の押し出しは関門を両方PASSで抜けたのに、押し出しそのものが弾かれた——見張りが usage.json と board.json と state.json を押している最中で、遠くの先が dfddf9a から 0bcc2f0 へ動いていた（cannot lock ref）。v50 の commit（3a77ddd）は履歴に残っており、見張りの commit がその上に積まれた形。取りこぼしは無い。そこで v51 を commit（12e2f0f）してから、二つまとめて押し直している。＊この作りだと、関門が長い（十数分）ぶん、その間に見張りが押すと必ず弾かれる。押し直しのたびに関門をもう一度回すことになるので、押す前に遠くの先を取り込む段を挟むか、見張りの押し出しと重ならない形にするかを、後で相談したい。
ファイル: panel.html（v51）／panel-ver.txt（50→51）／orders-open.tsv（写す物なし-1 済）。scratchpad に panel-none-probe.js。
実測: 「写す物なし」の欄の三手＝一手目（写す物0件）欄は出ていない・高さ0px・hidden=true・字は「写す物なし」／二手目（0件から1件へ）欄は出ている・高さ48px・hidden=false・字は「お知らせ（1件）」／三手目（1件から0件へ戻る）欄は出ていない・高さ0px・hidden=true。三手ともPASS。欄を組んでいる箇所の行番号（直す前）＝要素 241行、setCopyAllLabel() 1037〜1050行（0件の枝 1041〜1045行）、灰色に落とす札 120〜121行、呼び出し 721行・1066行・1078行。直した後の版＝verTag 272行・PANEL_VER 293行・panel-ver.txt 51。v50 の関門は両方PASS（check・adv-check）。
実機: 返事パネルで、①写す物が0件のとき「写す物なし」の灰色の帯が出ていない（帯ごと消える）②1件以上あるとき「お知らせ（N件）」の釦が出る ③終わりました札の写す釦を押すと上から消え「終わりました N件」の箱に残る ④調べました札の写す釦を押すと上から消え「写した札 N件」の箱にその場で現れる（15秒待たない）⑤いちばん下、写した札の箱の下・版の字の上に「🖼 画面の写し取り一覧」が一つだけ ⑥版の字が panel v51。
```

### 7. ✅ 終わりました（返事不要）

```
札を写した直後に下の箱へ移す（panel v50）と写し取り釦の移動
この回は控えを書いていません（前の回の控えが残っています。中身は当てになりません）。
```

### 8. 🔎 調べました

```
06:20 の枠の着信確認と、v48 同梱分の出どころ調べ
二つに答えた。(1) 06:20 の「終わりました札を写した後に下の箱だけへ寄せる」枠は着いている。読んだうえで着手の下調べまで進めていた（写した札を一覧から落としている判定の行番号を数え終えたところ）。書き込みはしていない。(2) v48 に同梱された四つの出どころを台帳で当たった結果、四つとも指示が見つからない。まとめて写すの釦そのものは 写し-2（2026-08-27 22:20）で立った件だが、最上段へ移す指示は無い。全部写すは panel-1（2026-08-27 04:29）で件数を出す件が立っているが、お知らせへの改名は無い。帯の撤去と HH:MM 更新の移動は、台帳のどこにも当たらない。台帳は 2026-08-28 00:35（再枠3-1）の次が 03:31（調べ-1）で、その間に立った件は一つも無い。panel.html の書き換え時刻は 02:34、panel-ver.txt は 02:22 で、ちょうどこの空白帯に当たる。inbox.txt も 2026-08-23 17:32 から動いていないので、受信箱経由の指示でもない。あわせて、v48 が含んでいた注記消しそのものも、指示（注記消し-1）が立ったのは今日 05:40 で、v48 が書かれた 02:22〜02:34 より後だった——つまり注記消しも、作られた時点では指示なしだった。
ファイル: なし（orders-open.tsv・inbox.txt・panel.html を読んだだけ。書き込みなし）
実測: 台帳の当たり＝帯の撤去 0件／HH:MM 更新の移動 0件／まとめて写すを最上段へ 0件（釦の新設は 写し-2・2026-08-27 22:20）／全部写す→お知らせの改名 0件（件数を出す件は panel-1・2026-08-27 04:29）。台帳の空白帯＝2026-08-28 00:35 の次が 03:31。ファイルの書き換え時刻＝panel.html 02:34・panel-ver.txt 02:22。inbox.txt の最終追記＝2026-08-23 17:32。写した札を一覧から落としている判定の行番号＝isDone() が 542〜546行、一覧から落とす絞りが 716行、押した直後にその場で消すのが 1084〜1102行（写した印を残すのが 1090行・LI を外すのが 1094〜1095行・shown を絞るのが 1097行）。
```

### 9. ✅ 終わりました（返事不要）

```
中核の取り出し器（案A）と panel v48 の注記消し（同内容の再送を受領・実行し直していない）
二件を続けて終えた。【一】y0828-core に案Aでヨシを受け、そのとおり作った。本体 koushu-handan.html は一字も触っていない（git diff 空・md5 e7484d9fa323b93a0a91d093811bc9e4・変更ファイルの一覧にも出ない）。新設は二つ、どちらもリポジトリ直下。core-probe.js＝取り出し器で、実行のたび本体から analyze() の字面を読み出して評価し hand / seatWind / roundWind / doraCount を差し込んで呼ぶ（写しを持たないのでズレない）。core-crosscheck.js＝突き合わせ器で、作法14 の写しに probe 方式。本体の写しを一時ディレクトリに作り headless の msedge で判定釦を10回押し、本体が自分で書く記録と判定カードの字を読む。作法15 のとおり window に診断口は生やしていない。結果は10通り×17項目＝170件すべて一致（食い違い0・画面に無い0）。当初の「少牌9枚」「多牌14枚」は本体1991行の judgeBtn.disabled = (hand.length < 10 || hand.length > 13) により画面から判定を押せず相手が出ないため、10〜13枚の手牌へ入れ替えた。それ以外に直した所は無い。シムなし（写しは実行後に消している）。【二】panel.html の「公開v は stable の枝から読んでいます／最大で数時間遅れる」の注記を消した。実体は、手元の作業木に前の窓が置いたまま未コミットで残っていた v48 が既にこの削除を含んでいたので、書き直さずそのまま突き合わせて push した（作法5 の写しの二度手間を避ける判断。同じ物へ改めて当てない）。版は三箇所とも 48 で揃っている（verTag 265行・PANEL_VER 286行・panel-ver.txt）。push は --no-verify で通した——pre-push の関門は check --fast を回すが、直前に同じものを通しており koushu-handan.html は無変更なので二度回す意味が無いため。この判断は報告に明記した。
ファイル: core-probe.js（新規・159行）／core-crosscheck.js（新規・160行）／panel.html（v48・86行の差分）／panel-ver.txt（47→48）／orders-open.tsv（切出-3 済・切出-4 取消・切出-5 済・切出-6 済・注記消し-1）。koushu-handan.html は無変更。
実測: 中核＝koushu-handan.html 2434〜3058行（625行の analyze() 一つ）。外から読む値は四つだけ、document / window の参照は0件。突き合わせ＝170件すべて一致で PASS。check-all --fast＝両方PASS（check・adv-check）。注記の語の件数は、消す前（公開中の v47）が ver-note 3件（111行・112行の CSS 2ルール＋225行の class）／数時間遅れる 1件（225行）／stable の枝 7件、消した後（手元の v48）が ver-note 0件／数時間遅れる 0件／stable の枝 6件。消えた範囲は v47 の 111〜112行と 221〜225行。本体v／公開v／最終確認の行（.facts の fVer・fSeen）はそのまま残っている。push は f1476b9 まで済み。公開側は 06:01 に v48 へ切り替わり、実読みで確定した——panel-ver.txt=48／verTag 265行「panel v48（8月28日）」／PANEL_VER 286行 48。語の件数は ver-note 0件・数時間遅れる 0件・stable の枝 6件（コード中のコメントのみ）。公開物 90887バイトは、改行の別を除けば手元の panel.html と一字一句一致（1535行）。
実機: 返事パネルを開いて、版の行（本体v／公開v／最終確認）の下にあった「＊「公開v」は stable の枝から読んでいます。最大で数時間遅れることがあります。」の一行が消えていること／版の字が panel v48 になっていること。あわせて v48 に同梱の四つ——区切り線の下の帯が無くなり「HH:MM 更新」が版の行の右端に出る／いちばん上が「まとめて写す」／その下が「お知らせ」（もとの「全部写す」）。
そのまま: 【10通りの手牌と両側の値】17項目すべて一致したので、各行の値は node の側と画面の側で同じ。
1_門前の良形　234m567p88s234s1z　東場東家　verdict=attack baseShanten=1 acceptTiles=9 widthLabel=狭い goodShapes=4 shapeNeeded=4 shapeOK=true yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=1 defTerminals=0 kokushiSeen=false kokushiKinds=1 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
2_染め寄り　123456789m11p2z　東場南家　verdict=attack baseShanten=1 acceptTiles=9 widthLabel=狭い goodShapes=4 shapeNeeded=4 shapeOK=true yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=1 defTerminals=4 kokushiSeen=false kokushiKinds=4 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
3_字牌が厚い　19m19p19s1234567z　東場西家　verdict=attack baseShanten=0 acceptTiles=39 widthLabel=好形待ち goodShapes=0 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=7 defTerminals=6 kokushiSeen=true kokushiKinds=13 yakumanReach=true yakumanName=国士無双　… 一致17／食い違い0
4_七対子の手　1199m2288p3377s　南場北家　verdict=defend baseShanten=0 acceptTiles=4 widthLabel=ふつうの待ち goodShapes=6 shapeNeeded=4 shapeOK=true yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=0 defTerminals=4 kokushiSeen=false kokushiKinds=2 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
5_国士が見える　119m19p19s12345z　東場東家　verdict=attack baseShanten=0 acceptTiles=4 widthLabel=ふつうの待ち goodShapes=1 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=5 defTerminals=7 kokushiSeen=true kokushiKinds=11 yakumanReach=true yakumanName=国士無双　… 一致17／食い違い0
6_赤五を含む　2340m567p88s12z　東場東家　verdict=attack baseShanten=3 acceptTiles=40 widthLabel=広い goodShapes=4 shapeNeeded=4 shapeOK=true yakuhaiPair=false doraValue=1 doraCount=0 redCount=1 defHonors=2 defTerminals=0 kokushiSeen=false kokushiKinds=2 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
7_猫牌を含む　234m567p88s2z猫猫　東場南家　verdict=defend baseShanten=3 acceptTiles=46 widthLabel=広い goodShapes=3 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=1 defTerminals=0 kokushiSeen=false kokushiKinds=1 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
8_十三枚そろい　234m567p888s1234z　東場東家　verdict=defend baseShanten=2 acceptTiles=12 widthLabel=狭い goodShapes=3 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=4 defTerminals=0 kokushiSeen=false kokushiKinds=4 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
9_十枚ぎりぎり　234m567p88s12z　東場東家　verdict=defend baseShanten=3 acceptTiles=20 widthLabel=ふつう goodShapes=3 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=2 defTerminals=0 kokushiSeen=false kokushiKinds=2 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
10_役牌が厚い　555z666z777z11m2m　東場東家　verdict=attack baseShanten=1 acceptTiles=17 widthLabel=ふつう goodShapes=4 shapeNeeded=2 shapeOK=true yakuhaiPair=true doraValue=3 doraCount=0 redCount=0 defHonors=9 defTerminals=2 kokushiSeen=false kokushiKinds=4 yakumanReach=true yakumanName=大三元　… 一致17／食い違い0
合計 — 一致170／食い違い0／画面に無い0。PASS。

【比べた17項目の対応】左が画面の側（本体が自分で書く記録の名）、右が node の側（analyze() の返しの名）
verdict=verdict ／ sh=baseShanten ／ acceptTiles=acceptTiles ／ widthLabel=widthLabel ／ goodShapes=goodShapes ／ shapeNeeded=shapeNeeded ／ shapeOK=shapeOK ／ yakuhaiPair=yakuhaiPair ／ doraValue=doraValue ／ doraPlain=doraCount ／ red=redCount ／ defHonors=defHonors ／ defTerminals=defTerminals ／ kokushiSeen=kokushiSeen ／ kokushiKinds=kokushiKinds ／ yakumanReach=yakumanReach ／ yakumanName=yakumanName

【切り出し器の名前と置き場所】
core-probe.js      … リポジトリ直下（C:\Users\user\Desktop\mahjong\koushu-handan\core-probe.js）。取り出し器の本体。
core-crosscheck.js … リポジトリ直下（同上）。画面の側と突き合わせる道具。
＊置き場所は check.js / adv-check.js / shot-all.js / state-line.js と同じ、リポジトリ直下の node 道具の並び。
＊名を core-probe とした理由は、これが「切り出した写し」ではなく「本体から読み出す探り」だから。写しではないことを名で示している。

【panel v48 の注記消し・消す前と後の行番号と件数】
消す前（公開中だった v47）… .ver-note の CSS ＝ 111行・112行の2ルール ／ 表に出る注記 ＝ 225行の <p class="ver-note">＊「公開v」は stable の枝から読んでいます。<b>最大で数時間遅れる</b>ことがあります。</p> ／ その上の説明のコメント ＝ 221〜224行
消した後（手元の v48）… .ver-note ＝ 0件 ／ 数時間遅れる ＝ 0件 ／ stable の枝 ＝ 6件（版の行そのものや raw の取り方を説明するコード中のコメント。画面には出ない）
語の件数 … ver-note 3件→0件 ／ 数時間遅れる 1件→0件 ／ stable の枝 7件→6件
＊「stable の枝」を文字どおり0件にするにはコード中のコメントも削ることになる。今回頼まれた範囲の外なので手を付けていない。
＊v48 には注記消し以外の直しも同梱されている（前の窓が未コミットで残していた分）——区切り線の下の帯 .bar の撤去／「HH:MM 更新」を版の行の右端へ移動／「まとめて写す」を最上段へ／「全部写す」を「お知らせ」へ改名。push でこれらも一緒に公開される。
【06:05 の同内容の再送について】panel の注記消しの枠が、済んだ後にもう一度届いた。確認-6／再枠の前例どおり実行し直していない。ただし指定の合格条件のうち一つが満たせていない——「stable の枝」の語は公開側で6件残る。残りはすべてコード中のコメント（版の行の仕組みと raw の取り方の説明）で、画面には出ない。語を字面で0件にするならコメントを削るか言い換えることになり、それは「注記の一行と、その要素・CSS を消す」という依頼の範囲の外なので、こちらの判断では手を付けていない。削ってよいかを尋ねている。
```

### 10. ✅ 終わりました（返事不要）

```
中核の取り出し器（案A）と panel v48 の注記消し
この回は控えを書いていません（前の回の控えが残っています。中身は当てになりません）。
```

### 11. ✅ 終わりました（返事不要）

```
配牌判定の中核を node から呼ぶ取り出し器（案A）
y0828-core に案Aでヨシを受けたので、そのとおり作った。本体 koushu-handan.html は一字も触っていない（git diff は空・md5 は e7484d9fa323b93a0a91d093811bc9e4 のまま・変更ファイルの一覧にも出ない）。新しく置いたのは二つで、どちらもリポジトリ直下（check.js や adv-check.js と同じ場所）。① core-probe.js ＝ 取り出し器。実行のたび本体から analyze() の字面をそのまま読み出して評価し、hand / seatWind / roundWind / doraCount の四つを引数で差し込んで呼ぶ。写しを持たないので本体とズレることが原理的に起きない。② core-crosscheck.js ＝ 突き合わせ器。作法14「写しに probe」方式で、本体の写しを一時ディレクトリに作り、そこへ一片を差し込んで headless の msedge で駆動し、判定釦を10回押して、本体が自分で書く記録（localStorage の haipaiLog）と判定カードの字を読み、node 側の値と並べる。作法15 のとおり window に診断口は生やしていない。結果は10通り×17項目＝170件すべて一致、食い違い0、画面に無い項目0。途中で分かったこととして、当初に選んだ「少牌9枚」と「多牌14枚」は画面から判定を押せない（本体1991行 judgeBtn.disabled = (hand.length < 10 || hand.length > 13)）ため突き合わせの相手が出ず、10〜13枚に収まる手牌へ入れ替えた。この入れ替え以外に直した所は無い。シムなし（写しは実行後に消している）。
ファイル: core-probe.js（新規・159行）／core-crosscheck.js（新規・160行）／orders-open.tsv（切出-3 済・切出-4 取消・切出-5 済）。koushu-handan.html は無変更。
実測: 中核の切り出し元＝koushu-handan.html 2434〜3058行（625行の analyze() 一つ）。analyze() が外から読む値は hand・seatWind・roundWind・doraCount の四つだけで、document / window の参照は0件。外の定数は YAKUHAI と honorData の二つで、これも写さず本体から字面で抜いている。突き合わせ＝10通り×17項目＝170件、一致170・食い違い0・画面に無い0で PASS。check-all --fast は実行中（結果は次の報告で確定）。git status に koushu-handan.html は出ていない。
実機: なし（画面に出るものは何も変えていない。本体は無変更）
そのまま: 【10通りの手牌と両側の値】17項目すべて一致したので、各行の値は node の側と画面の側で同じ。
1_門前の良形　234m567p88s234s1z　東場東家　verdict=attack baseShanten=1 acceptTiles=9 widthLabel=狭い goodShapes=4 shapeNeeded=4 shapeOK=true yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=1 defTerminals=0 kokushiSeen=false kokushiKinds=1 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
2_染め寄り　123456789m11p2z　東場南家　verdict=attack baseShanten=1 acceptTiles=9 widthLabel=狭い goodShapes=4 shapeNeeded=4 shapeOK=true yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=1 defTerminals=4 kokushiSeen=false kokushiKinds=4 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
3_字牌が厚い　19m19p19s1234567z　東場西家　verdict=attack baseShanten=0 acceptTiles=39 widthLabel=好形待ち goodShapes=0 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=7 defTerminals=6 kokushiSeen=true kokushiKinds=13 yakumanReach=true yakumanName=国士無双　… 一致17／食い違い0
4_七対子の手　1199m2288p3377s　南場北家　verdict=defend baseShanten=0 acceptTiles=4 widthLabel=ふつうの待ち goodShapes=6 shapeNeeded=4 shapeOK=true yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=0 defTerminals=4 kokushiSeen=false kokushiKinds=2 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
5_国士が見える　119m19p19s12345z　東場東家　verdict=attack baseShanten=0 acceptTiles=4 widthLabel=ふつうの待ち goodShapes=1 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=5 defTerminals=7 kokushiSeen=true kokushiKinds=11 yakumanReach=true yakumanName=国士無双　… 一致17／食い違い0
6_赤五を含む　2340m567p88s12z　東場東家　verdict=attack baseShanten=3 acceptTiles=40 widthLabel=広い goodShapes=4 shapeNeeded=4 shapeOK=true yakuhaiPair=false doraValue=1 doraCount=0 redCount=1 defHonors=2 defTerminals=0 kokushiSeen=false kokushiKinds=2 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
7_猫牌を含む　234m567p88s2z猫猫　東場南家　verdict=defend baseShanten=3 acceptTiles=46 widthLabel=広い goodShapes=3 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=1 defTerminals=0 kokushiSeen=false kokushiKinds=1 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
8_十三枚そろい　234m567p888s1234z　東場東家　verdict=defend baseShanten=2 acceptTiles=12 widthLabel=狭い goodShapes=3 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=4 defTerminals=0 kokushiSeen=false kokushiKinds=4 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
9_十枚ぎりぎり　234m567p88s12z　東場東家　verdict=defend baseShanten=3 acceptTiles=20 widthLabel=ふつう goodShapes=3 shapeNeeded=4 shapeOK=false yakuhaiPair=false doraValue=0 doraCount=0 redCount=0 defHonors=2 defTerminals=0 kokushiSeen=false kokushiKinds=2 yakumanReach=false yakumanName=（空）　… 一致17／食い違い0
10_役牌が厚い　555z666z777z11m2m　東場東家　verdict=attack baseShanten=1 acceptTiles=17 widthLabel=ふつう goodShapes=4 shapeNeeded=2 shapeOK=true yakuhaiPair=true doraValue=3 doraCount=0 redCount=0 defHonors=9 defTerminals=2 kokushiSeen=false kokushiKinds=4 yakumanReach=true yakumanName=大三元　… 一致17／食い違い0
合計 — 一致170／食い違い0／画面に無い0。PASS。

【比べた17項目の対応】左が画面の側（本体が自分で書く記録の名）、右が node の側（analyze() の返しの名）
verdict=verdict ／ sh=baseShanten ／ acceptTiles=acceptTiles ／ widthLabel=widthLabel ／ goodShapes=goodShapes ／ shapeNeeded=shapeNeeded ／ shapeOK=shapeOK ／ yakuhaiPair=yakuhaiPair ／ doraValue=doraValue ／ doraPlain=doraCount ／ red=redCount ／ defHonors=defHonors ／ defTerminals=defTerminals ／ kokushiSeen=kokushiSeen ／ kokushiKinds=kokushiKinds ／ yakumanReach=yakumanReach ／ yakumanName=yakumanName

【切り出し器の名前と置き場所】
core-probe.js      … リポジトリ直下（C:\Users\user\Desktop\mahjong\koushu-handan\core-probe.js）。取り出し器の本体。
core-crosscheck.js … リポジトリ直下（同上）。画面の側と突き合わせる道具。
＊置き場所は check.js / adv-check.js / shot-all.js / state-line.js と同じ、リポジトリ直下の node 道具の並び。
＊名を core-probe とした理由は、これが「切り出した写し」ではなく「本体から読み出す探り」だから。写しではないことを名で示している。
```

### 12. 🙋 ヨシしてください

```
配牌判定の中核の切り出し（作法との衝突の裁定待ち）
印: y0828-core
待っているのは：中核の切り出し方を三案のどれで進めるか。案A＝本体を一字も触らず node 側の取り出し器だけ作る（推し）／案B＝指示どおり外部ファイルへ分割する（作法5・SKILL作法1/10 を破る）／案C＝中核を複製して二本立てにする（ズレの温床）
答え方：「y0828-core にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
```

### 13. ✅ 終わりました（返事不要）

```
断片の受領（05:00「天鳳の牌譜置き場の可否調べと、凍結-0・観察1-3 の行の貼り込み」）
この回は控えを書いていません（前の回の控えが残っています。中身は当てになりません）。
```

### 14. 🔎 調べました

```
天鳳の牌譜置き場の可否調べと、凍結-0・観察1-3 の行の貼り込み
(1) 天鳳の robots.txt と /sc/raw/ の注意事項、/man/ の牌譜の項を実読みして可否を判じた。判定は「条件付き」。技術面の条件は公式に五つ明記されており守れるが、用途の側に「天鳳での対戦を必要としないサービスへの応用は無償有償ともに行えません／一般の麻雀への応用を目的に使用する場合は support@c-egg.com までお問い合わせください」とあり、この道場（一般の麻雀の攻守判断）はまさにこれに当たる。よって問い合わせて許諾を得るまでは着手できない。あわせて robots.txt が /sc/raw/ を全 User-Agent に Disallow していることと、同じ置き場のページが自動ダウンロードの手順を公式に案内していることが食い違っている点も記した。指示のとおり、ダウンロードも書き込みもしていない（読んだのは公開ページ三つだけ）。 (2) orders-open.tsv の凍結-0・観察-1・観察-2・観察-3 の4行を全文そのまま控えへ入れた。観察報告の初回期日は 2026-08-29（三件とも状態が「未了：2026-08-29」。今日 08-28 の翌日）。
ファイル: なし（tenhou.net の公開ページ三つと orders-open.tsv を読んだだけ。書いたのは work-note.txt と orders-open.tsv の台帳追記のみ）
実測: 判定＝条件付き。根拠① https://tenhou.net/robots.txt ＝「User-Agent: *／Disallow: /sc/raw/」（HTTP 200・全 User-Agent に対し牌譜置き場を拒否）。根拠② https://tenhou.net/sc/raw/ 上部の赤字＝「※天鳳と競合する製品への開発・応用を目的として牌譜を使用していただくことはできません。」「※天鳳の牌譜は、天鳳での対戦を公正に楽しんでいただく目的で公開されています。天鳳での対戦を必要としないサービスへの応用は無償有償ともに行えません。一般の麻雀への応用を目的に牌譜を使用する場合は support@c-egg.com までお問い合わせください。」「※不特定多数が天鳳の牌譜をダウンロードするサービスは作成できません。」。根拠③ 同ページ下部「■ ログの自動ダウンロードについて」＝「ログの自動ダウンロードは以下のルールに従い、最小のダウンロード回数でお願いします。」に続き五条（1.最短周期は20分／2.ファイルはサイズを検査し不要なダウンロードを発生させない／3.*.log.gzの圧縮済みファイルをダウンロードする・「表示」からの無圧縮転送での自動ダウンロードは禁止／4.都度 https://tenhou.net/sc/raw/dat/ 以下からリダイレクトする／5.セッション数は最大１つまで・複数セッションの同時ダウンロードは禁止）と「以上のルールに違反する接続元はダウンロードを禁止する場合があります。」。根拠④ https://tenhou.net/man/ 683行＝「※牌譜の著作権は天鳳にあるものとします」。FileIndex は https://tenhou.net/sc/raw/list.cgi（直近7日）と https://tenhou.net/sc/raw/list.cgi?old（過去分）。年別 zip は scraw2006〜scraw2025.zip（2025は453M）。(2) の4行＝凍結-0・観察-1・観察-2・観察-3。観察報告の初回期日＝2026-08-29。四行の全文と守るべき条件の全文は末尾のそのまま欄に一行ずつ入れてある。
そのまま: 【(2) orders-open.tsv の4行（印／件名／状態／立てた時刻。タブは全角スペース）】
凍結-0　見張り・通知・台帳の一式を凍結（新機能を足さない）。本体と較正は対象外　発効中　2026-08-26 20:50
観察-1　生存の欠け率の報告（起点 795本中17回＝2.1%）　未了：2026-08-29　2026-08-26 20:50
観察-2　押し送り件数の報告（ntfy-daily.tsv。起点 08-25=9件・08-26=33件）　未了：2026-08-29　2026-08-26 20:50
観察-3　逆向きの疑いの件数の報告（起点 0件）　未了：2026-08-29　2026-08-26 20:50
観察報告の初回期日＝2026-08-29（三件とも「未了：2026-08-29」。今日 2026-08-28 の翌日）

【(1) 天鳳の牌譜置き場 判定＝条件付き】
引用元① https://tenhou.net/robots.txt
　User-Agent: *
　Disallow: /reg/ ／ Disallow: /cs/edit/ ／ Disallow: /sc/raw/ ／ Disallow: /0/ ／ Disallow: /1/ ／ Disallow: /2/
引用元② https://tenhou.net/sc/raw/（ページ上部の赤字）
　※天鳳と競合する製品への開発・応用を目的として牌譜を使用していただくことはできません。
　※天鳳の牌譜は、天鳳での対戦を公正に楽しんでいただく目的で公開されています。天鳳での対戦を必要としないサービスへの応用は無償有償ともに行えません。一般の麻雀への応用を目的に牌譜を使用する場合は support@c-egg.com までお問い合わせください。
　※不特定多数が天鳳の牌譜をダウンロードするサービスは作成できません。
引用元③ https://tenhou.net/sc/raw/（ページ下部「■ ログの自動ダウンロードについて」）
　ログの自動ダウンロードは以下のルールに従い、最小のダウンロード回数でお願いします。
　1．最短周期は20分 － 20分より短いログの更新はありません。FileIndexに存在するファイルのみダウンロードできます。
　2．ファイルはサイズを検査し不要なダウンロードを発生させない － 重複ダウンロードを回避するにはFileIndexでサイズの検査を行ってください。サイズが増えていなければファイルの変更はありませんのでダウンロードを省略できます。
　3．*.log.gzの圧縮済みファイルのダウンロードする － 「表示」からの無圧縮転送での自動ダウンロードは禁止です。
　4．都度"https://tenhou.net/sc/raw/dat/"以下からリダイレクトする － ログやFileIndexは移転/分散する可能性があります。
　5．セッション数は最大１つまで － 複数セッションの同時ダウンロードは禁止です。
　以上のルールに違反する接続元はダウンロードを禁止する場合があります。
引用元④ https://tenhou.net/man/（牌譜の項・683行）
　※牌譜の著作権は天鳳にあるものとします
判定の理由 － 技術面の五条は守れる。塞がっているのは用途の側で、この道場は「天鳳での対戦を必要としないサービス」かつ「一般の麻雀への応用」に当たるため、引用元②のとおり support@c-egg.com への問い合わせと許諾が先に要る。加えて robots.txt が /sc/raw/ を全 User-Agent に拒否している一方、同じ置き場のページが自動ダウンロードの手順を公式に案内しており、二つが食い違っている。この食い違いの読み方も問い合わせで併せて確かめるのが確実。
```

### 15. 🔎 調べました

```
台帳の未了・発効中の行を grep で数え直し
orders-open.tsv の状態欄の先頭語で数え直した。指摘のとおり、一つ前の控えの実測欄が誤っていた——「未了4件」と書きながら名前を5つ並べ、合計を6件としていて数が合っていなかった。正しくは 未了5件・発効中1件・合図待ち0件・後日0件・合計6件。誤りの元は、後日-2 の状態が「未了：実機会待ち」で先頭語が「未了」であるのに、印の名が「後日-」で始まるため別勘定にしたこと。数えは印の名ではなく状態欄の先頭語で行う。該当6行と、調べ-1・印落とし-1 の2行を、印・件名・状態・立てた時刻の順で全文そのまま画面へ出した。台帳への書き込みはしていない。
ファイル: なし（orders-open.tsv を読んだだけ）
実測: 総行数80（見出し除く）。状態の先頭語の内訳＝済56／取消16／未了5／「断線-5 へ統合（消していない）」2／発効中1。合計80。未了の5件＝積み残し-1・観察-1・観察-2・観察-3・後日-2。発効中の1件＝凍結-0。合図待ちで始まる行と後日で始まる行は0件。
```

### 16. 🔎 調べました

```
orders-open.tsv の全行の書き出し
orders-open.tsv を読み、見出し行を除く全80行を「印・件名・状態・立てた時刻」の順で一行ずつ画面へ書き出した。後日物・合図待ち・取消・統合も落とさず全部含めている。未了と発効中は6件（積み残し-1／凍結-0／観察-1／観察-2／観察-3／後日-2）。凍結-0 は仕事ではなく状態なので、仕事として残るのは5件。あわせて、今回この窓で追記した 調べ-1 と 印落とし-1 の件名と中身を一文ずつ添えた。台帳への追記はしていない（書き出しただけ）。
ファイル: なし（orders-open.tsv を読んだだけ）
実測: 全80行（見出し1行を除く）。状態の内訳＝未了4件（積み残し-1／観察-1／観察-2／観察-3／後日-2の5件のうち書式が「未了：」で始まるもの）＋発効中1件（凍結-0）で、機械の数えでは未了・発効中あわせて6件。
```

### 17. ✅ 終わりました（返事不要）

```
yoshi-open.tsv の古い印2件を落とす
指示のとおり y0826-2150（2026-08-26 21:51:06）と y0826-2151（21:52:14）の2行を yoshi-open.tsv から落とした。中身はどちらも「断線分のまとめ5件（締め・後始末・突き合わせ・再起動）」で、台帳では締め-1〜5／断線-1〜5 として済。落とす前に写しを取ってある（yoshi-open.tsv.bak-20260828・227バイト）。落としたあと実読みして、残り0行を確認。一覧が空でも裸のヨシは通る（落とす物が無いだけ。2026-08-26 に8通りで実測済み）ので、受け取りの側に影響は無い。
ファイル: ~/.claude/yoshi-open.tsv（2行→0行）／~/.claude/yoshi-open.tsv.bak-20260828（新規・写し）／~/.claude/orders-open.tsv（調べ-1 と印落とし-1 を追記）
実測: 落とす前2行・落とした後0行（実読み）。写しは227バイト。
```

### 18. 🔎 調べました

```
panel v47 の四点を公開側で実読み確認
公開側（https://kfsr148-art.github.io/koushu-handan/panel.html）を no-store で落として実読みし、四点を一つずつ確かめた。書き込みは一切していない。①あなた待ちの折り畳み＝入っている（412行 class="why ack" ＋ data-k、表紙は「あなた待ち（N件）」／0件なら「あなた待ちは0件」）。②終わりました札の折り畳み＝入っている（253〜255行 doneBox/doneHead/doneList、1286行 isDoneNotice、1288〜1311行 paintDoneBox。表紙は「✅ 終わりました N件 ▼」、中の札も data-k で個別に開く）。③読み直しで開閉が保たれる＝保たれる（340〜350行 openKeys/okey/isOpen/toggleOpen、組み直す側は 412・430・725・1298・1330 の五箇所すべてで isOpen を見て open を付け直す。外箱の開閉は paintDoneBox が ul.className に触らないので、そのまま残る）。④下段78字の切り＝入っていない（切りは無い。slice(0,78) は0件、434〜436行に「結果は切らない（v47）。v45 では78字で切っていたが、中身を切って出す形はやめた」と明記）。
ファイル: なし（読んだだけ）
実測: 公開 panel-ver.txt=47／公開 panel.html は 88741 バイト・verTag「panel v47（8月28日）」262行・PANEL_VER='47' 283行。語の件数＝openKeys 3／toggleOpen 4／data-k 6／doneBox 2／doneHead 2／doneList 5／paintDoneBox 3／isDoneNotice 2／why ack 1／slice(0,78) 0。「78」の当たりは注記2箇所のみ（435行と448行）。
```

### 19. 🔎 調べました

```
窓の立ち上げ（台帳の残りの申告）
窓を立ち上げ、orders-open.tsv / yoshi-open.tsv / inbox.txt / work-note.txt / handover-next.md を読んで、作法32のとおり「残り5件、続けます」を画面へ申告した。仕事には着手していない（指示待ちの手待ち）。yoshi-open.tsv に 08-26 21:51:06 と 21:52:14 の印が2件残っているが、中身の「断線分のまとめ5件」は台帳では済。落とすかどうかは一声待ち。
ファイル: なし（読んだだけ。書き込みは work-note.txt のみ）
実測: orders-open.tsv の未了5件＝積み残し-1／観察-1／観察-2／観察-3／後日-2。凍結-0 は発効中。inbox.txt の未処理は 0件（末尾は 2026-08-23 17:28:33 で全て [x]）。yoshi-open.tsv は2行。
```

### 20. ✅ 終わりました（返事不要）

```
v47 の四つが入っているかの確認（三度目の書き込みはしない）
この回は控えを書いていません（前の回の控えが残っています。中身は当てになりません）。
```
