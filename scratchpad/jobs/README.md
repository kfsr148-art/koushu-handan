# scratchpad/jobs — 雲で回す台本の置き場

**VAIO（4GB・回転盤の HDD）で回すと重い仕事を、雲へ逃がすための置き場。**

## 使い方

1. 回したい台本をここへ置く。
   - `*.js` … node 20 で回る
   - `*.ps1` … pwsh で回る
2. 押す。その押しが `.github/workflows/job.yml` の引き金になる。
3. 走りが **`reports/cloud-<台本の名>-<刻>.md`** を書いて押し戻す。
4. その綴りを読んで札にする。

＊一本だけ回したいときは、Actions の「雲で回す」を `workflow_dispatch` で起こし、
　`only` に `kumo-tameshi.js` のように台本の名を入れる。

## 返事パネルの検査（panel-check）は雲で回す（2026-09-23）

**`panel-check` は VAIO で回さない。** `panel.html` か `panel-check.js` を押せば、
`job.yml` がここの `panel-check.js`（直下の panel-check.js を呼ぶだけ）を回し、
**`reports/cloud-panel-check-<刻>.md`** に結果を返す。手で回したいときは
`workflow_dispatch` の `only` に `panel-check.js`。

## 本体の速い版の検査（check-all --fast）も雲で回す（2026-09-24）

**`check-all` は VAIO で回さない。** `koushu-handan.html`・`check.js`・`adv-check.js`・`check-all.js` を押せば、
`job.yml` がここの `check-fast.js`（直下の check-all.js を --fast で呼ぶだけ）を回し、
**`reports/cloud-check-fast-<刻>.md`** に結果を返す。配信の関門は今までどおり check.yml。

＊押しで回るのは**その押しで変わった台本だけ**（＋パネルが変わっていれば panel-check.js・本体が変わっていれば check-fast.js）。

## 「雲で：」の決め

**枠の頭に「雲で：」と付いた物は、VAIO では回さない。** ここへ台本を置いて押し、
戻ってきた `reports/cloud-*.md` を読んで札で返す。

## 決まり

- **台本は消さない。** 何を回したかが綴りに残るようにするため。
  中身が変わらなければ二度は走らない（引き金は「台本が変わった押し」だけ）。
- **一本あたりの上限は1500秒**（`timeout`）。越えたら終了コード124で切られ、札にそう出る。
- **書き戻す先は `reports/` だけ。** 引き金は `scratchpad/jobs/*.js` と `*.ps1` なので、
  書き戻しがもう一度走りを起こすことはない（輪にならない）。
- **本体（`koushu-handan.html`）には触らせない。** ここに置く台本は、読むか測るか作るだけにする。

## 今ある台本

| 台本 | 何をするか |
|---|---|
| `kumo-tameshi.js` | 道の作り値。回っている機械の顔つき（host・CPU・メモリ）と、500万回の平方根 |
