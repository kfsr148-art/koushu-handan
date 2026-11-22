# 枠 九十・九十一：ヨシ待ちの猫を枠に収める／版の行の「更新」を右端へ寄せない（panel v214）

状態：終わり（commit・push は親）— 09:10

## 九十 ヨシ待ちの猫

**拡大されて切れていた訳**：頭の猫の枠 `#runcat` は 80x80 で `object-fit:none`（中身を素の大きさで真ん中に置く。80px の猫のための決め）。ヨシ待ちの二枚は 240x240 なので、素の大きさのまま真ん中の 80x80 だけが出ていた。字（左上）も手足も枠の外へ切れ、真ん中が拡大されたように見えた。地は JPEG 由来の白で、透けていなかった。

**直した所**
- 絵：縁からつながる外側の白だけを透明にした新しい名の PNG を二枚作った（作法21：明るさで抜かず、縁から繋がる所だけ。前の絵と原版は残した）。
  - `yoshi-machi-t-240.png`（こぶし）・`yoshi-machi2-t-240.png`（親指）。どちらも 240x240・RGBA（色の型 6）・四隅の alpha 0。
  - 作り方：四辺の縁から、各色が 235 以上の画素だけを flood fill で透明にした。縁から2画素までの白っぽい画素（各色 180 以上）だけを半透明にして白を抜き（アンマット）、馴染ませた。黒縁・灰の毛・山吹色の字は当たらない。縁に繋がらない内側の白（お腹・顔・耳・足先）は残る。
  - 二枚目は、手の所（x 25〜100・y 70〜140）の外を一枚目と同じ画素にそろえた。切り替えた時に動くのは手だけ。
  - 道具：`scratchpad/yoshi-trans.js`・`scratchpad/soroe-t.js`（git には入れていない）。
- panel.html：ヨシ待ちの間だけ `#runcat` に `class="yoshi"` を付ける。`#runcat.yoshi{object-fit:contain; box-sizing:border-box; background:var(--bg);}` で絵全体を 80x80 の枠に収め、箱の地はパネルの黒い地（body と同じ `--bg` #14241c）にした。`YOSHI_FRAMES` は新しい二枚で、0.5秒ずつ交互のまま。ほかの猫・枠の 80x80・見出しの固定寸法は変えていない。

**確認画像の目視**（暗い地 #14241c と白地の両方・3倍に拡大）：白い縁は残っていない。お腹・顔・耳・足先の白はそのまま。「ヨシ！待ち。」の字も欠けていない。

## 九十一 版の行
- `.facts .upd{margin-left:auto;}`（v48）を外した。「更新 HH:MM」は「最終確認 HH:MM」のすぐ後ろに、ほかと同じ間（gap 14px）で並ぶ。320px の時の決め（`@media (max-width: 359px) { .facts #fVer{flex:0 0 100%;} }`）はそのまま。
- panel-check の静かな部分に「`.facts .upd` に margin-left:auto が無い」を足した。⑤の二十二（ブラウザ）の版の行の確かめ（同じ段・高さ・右端 ≦ 幅−13）は、寄せを外しても字面のとおり通る形。そこに「最終確認との間が 14px±2」も一つ足した。

## 版と検査
- 版は v214：PANEL_VER・verTag・panel-ver.txt・`panel-core.js?_v=214`・panel-core.js の VER。
- `node panel-check.js --static`：**167 件 PASS・FAIL 0**（約7秒）。足した項目は四つ：絵の名と寸法／contain・地の色・class の付け外し／二枚の揃い（透明の形も込み）／透明（色の型 6・四隅 alpha 0・お腹の白が不透明のまま）。
- `node --check`：panel.html の script・panel-core.js・panel-check.js・scratchpad/jobs/panel-yoshi-shot.js は、どれも通った。

## 見本の写し（雲）
- 台本 `scratchpad/jobs/panel-yoshi-shot.js`。押すと job.yml が回し、headless Chromium（390x844・倍率3・mobile）でパネルの写しを開く。state はヨシ待ちの作り値で、外へは何も送らない。絵の何枚目が出るかは Date.now を留めて決める。
- 出る場所：`reports/panel-yoshi-shot-1.png`（親指）・`-2.png`（こぶし）・`-1-head.png`／`-2-head.png`（頭の枠の拡大）・`reports/panel-facts-390.png`／`-375.png`／`-320.png`（版の行だけ）。結果の字は `reports/cloud-panel-yoshi-shot-<刻>.md`。
- 手元では `--dry`（ブラウザ無し）だけ回した。写しの組み立て・作り値・Date.now の留め方で、二枚それぞれが出ることを確かめて全て PASS。

## 実機
- ヨシ待ちの時、頭の猫の枠（80x80）に、字「ヨシ！待ち。」と猫の全身が切れずに収まっている。猫の周りに白い四角が無く、パネルと同じ黒い地。0.5秒ごとに、こぶしと親指が入れ替わっても字・猫は動かず、手だけ変わる。
- 下の版の行で、「更新 HH:MM」が「最終確認 HH:MM」のすぐ後ろに並び、間に大きなすき間が無い（390・375）。320 では版の字が一段、下の段に最終確認・更新。版の字が panel v214。
