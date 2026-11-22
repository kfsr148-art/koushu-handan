# 枠 百五十六：影の一行を三つ目の箱「影の仕事」に替えた（panel v224）

状態：入れた・雲の検査 success・公開 panel-ver.txt 224 — 08:1x

## したこと
- 返事パネルの「影の走り：…・$」の一行（#shadowLine）を外し、表の仕事・裏方と同じ形の三つ目の箱 `影の仕事`（`#shadowSec`）にした。並びは 表の仕事／裏方／影の仕事。
- 箱の中身：頭に名と「あと N分（HH:MM ごろ）」／今の課題の名の一行／ゲージ（済んだ課題＝緑・今走っている＝青）＋右に N/M。**金額は載せない**（`panelView.shadowBox` に cost を持たない・panel-check の静かな部分が字面で見張る）。
- 出し方：影が走っている間（`shadow-last.json` の state が「走行中」・始まりから10分以内）だけ `panelView.shadowBox` に載り、パネルは箱を出す。済んだら null＝箱ごと出ない（数秒で終わる試しはほぼ出ない形）。
- N/M の材料：走り手 `~/.claude/shadow-run.js` が `shadow-day.json`（今日取った課題 total・終えた課題 done・日が替われば0）を持つ。走る時に total+1、終えたら done+1。「あと N分」は前の走りの秒＋10秒（30〜180秒）で見積もる。
- 組む所は panel-view.js の `shadowBox` 一つ、パネルは `lastShadowBox`（state.json の panelView.shadowBox）を `secH('shadowSec', …)` で出すだけ（表の仕事・裏方と同じ関数）。

## 確かめ
- 手元 `panel-check.js --static` 全PASS（新しい二項目：箱が走行中だけ載る・3/4・金額なし・済み／10分より古い走行中は null／パネルに shadowSec の字面があり #shadowLine が無い）。
- 雲の check.yml success（commit c118df37c）・公開 panel-ver.txt 224。
- state.json 実地：走行中の控えを手で一瞬立てると、見張りの次の巡で `panelView.shadowBox`（影の仕事・0/1・影の枠 3：箱の試し・あと〜08:13）が載った（試しの後、控えは元へ戻した）。

## 実機で見る所
影が走っている間（課題を立てて約3分以内に拾われた時の数秒〜十数秒）、返事パネルの表の仕事・裏方の下に「影の仕事」の箱がゲージつきで出て、済んだら消え、「$」の字が無い。版 panel v224。
