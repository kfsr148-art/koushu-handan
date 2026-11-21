# 枠 七十四：まとめて写すの残り・頭の字・箱・見込みを panel-core.js 一つに（panel v210）

状態：終わり（commit・push は親の窓が七十一と一緒に行う）— 04:11

## 結論
- 数え方と字の組み立てを **`panel-core.js` 一つ**に置いた。パネル（panel.html）は `<script src="panel-core.js?_v=210">` で読み、VAIO の panelView（panel-view.js）は `require` する。二か所の写しは無くした（panel.html は端末の値を渡すだけの包み、panel-view.js には同じ名の関数が一つも無い）。
- 同じ作り値（札・押し通知・センコの印・state）**9600組**で、パネルと panelView の残り・頭の字・釦の字が全部同じ。03:41 の形（印 03:10:22・札 03:10:21＋押し通知 03:11:20）は両方 0件。
- `node panel-check.js --static`：**145件 PASS・0件 FAIL**（9.9秒）。

## 直したファイル
| ファイル | 中身 |
|---|---|
| `panel-core.js`（新） | 共有の関数。UMD（node は module.exports・ブラウザは window.PanelCore）。DOM・localStorage・fetch・Date.now() は使わない。VER＝'210' |
| `panel.html` | 22の関数を panel-core.js への包みに。`<script src="panel-core.js?_v=210">`・`core()`・`checkCore()`（読めない／版が違う時は取り置きを破る字を付けて一度だけ読み直す）。釦の字・裏方のゲージ・見込みを過ぎた赤・段の小さい字も core の物。版 v210（PANEL_VER・verTag・panel-ver.txt） |
| `panel-view.js` | 写しを全部消し、panel-core.js を require。panelView に `coreVer`（組んだ部品の版）と各箱の `panel.eta`（箱の頭「あと N分」）を足した |
| `panel-check.js` | 字面の写しの突き合わせは「どちらも panel-core.js の一つを使う」の確かめに置き替え（項目は減らしていない）。⑤の二十五（静か）・⑤の十九の箱の頭の突き合わせ・⑯の二（ブラウザ）・⑰の版の揃いを足した |
| `scope-pick.js`・`scope-pick-test.js` | panel-core.js をパネルの物に（panel-core.js だけの押しでも panel-check を回してから配る） |
| `panel-ver.txt` | 210 |

## 共有にした関数（panel-core.js）
- 残り：`senkoEpoch`・`isCountCard`・`ntfyOfCard`・`todoList`（前の mergedTodo と panelView の数え方を一つに）・`todoLabel`（釦の字）・`newestTime`
- 頭の字：`headText`（順も一つ）・`isRunning`・`cardsPending`・`cardEtaSec`・`cardLate`・`cardPendText`・`kumoEtaSec`・`uraBusyText`
- 箱と見込み：`boxSpec`・`headEta`（箱の頭）・`etaRow`・`workLate`（今の仕事の見込みを過ぎたか）・`endShort`・`uraCount`・`uraGauge`（古い state の裏方のゲージ）・`stepLab`・`omoteGauge`・`pad2s`
- 字の行：`omoteLines`・`uraLines`・`endLine`

## 共有にできず残した所と訳
| 所 | 訳 |
|---|---|
| 端末で本人が押した「写した」印（localStorage） | 端末の中にしか無い。パネルは `todoList` に渡し、panelView は渡さない（basis に書いてある）。差はこの一つだけ（⑤の二十五で確かめた） |
| 今の刻・生存の途切れ（lastLost） | 端末の時計で決まる。どちらも引数で渡す。panelView は見張りが書いている時点なので lost＝偽 |
| `pad2s`・`kumoEtaSec` の時計の帯 | 呼ぶ側の帯で HH:MM を読む（端末も VAIO も日本の帯） |
| state.json の読み取り（typeof の確かめ・「（なし）」を外す） | パネルの pullState は他の事も多くしているので、同じ形の読み取りが二か所に残る。検査は同じ読み取りを通して比べている |
| パネルにだけある物（nowLine・etaLineText・waitEtaRow・箱の赤い「記入待ち」・くわしくの uraGroups・HTML の組み立て・様子を写す・写しの束） | VAIO に写しが無い（一か所だけ）ので共有の要が無い |
| VAIO にだけある物（endat.js・noEstimate・lines・basis） | ~/.claude の台帳を読むので端末では組めない。パネルは結果（state.json の panelView）を読むだけ |
| 公開の時差 | VAIO はリポジトリの panel-core.js をすぐ読むが、公開のパネルは検査を通って配られてから替わる。間は数え方が違い得る。**panelView.coreVer と公開の panel-ver.txt が違えば時差の最中**とセンコが見分けられる |

03:41 の食い違い（panelView 0件・本人の画面 残1）の考えられる訳：panel-view.js（v209 の題と刻で結ぶ数え方）が VAIO で先に効き、公開のパネルは v206〜v208（印だけで結ぶ）のままだった＝上の「公開の時差」。

## 同じ作り値で両方が同じ数になる確かめ（静かな部分）
- ⑤の二十五：パネルの包み（mergedTodo・headText を panel.html から切り出し panel-core.js と一緒に回す）と PV.panelView に、札4通り×押し通知5通り×印5通り×状態8×裏方2×札まとめ3×雲2＝**9600組**→ 残り・頭の字・釦の字が全部同じ（残り 0〜6件・頭の字10種が出る）。
- 03:41 の形：両方 0件・coreVer 210。端末の写した印だけは パネル0／panelView1（basis に明記）。
- ⑤の十九：箱の頭「あと N分（HH:MM ごろ）」と赤が、パネルの塗りと panelView の panel.eta で同じ。
- ⑤の十六（1728組）・⑤の二十四（v209 の七つの形）も、包み＋panel-core.js で通る。

## ブラウザで落ちないか
- 静か：script の指定が一つ・本の script より前・?_v＝PANEL_VER＝panel-core.js の VER・UMD・公開の荷に入る（pack-site.js は直下を全部載せる）を字面で見る。
- ブラウザ（雲）：⑯の二が、tmp に panel-core.js を写して `<script src>` で読ませ（中に埋めない）、読めた版と、釦の字・頭の字を同じ作り値の panelView と比べる（印 now-400＝残2／印 now＝0件の二つ）。**手元では回していない（作法43）。雲の panel-check で初めて回る。**
- 読めない時（404 等）：一度だけ読み直す。それでも駄目なら頭の字「部品が読めない」、数は黙って0件にせず投げる（一覧の読み取りが落ちた表示になる）。check.js ② の起動時404は本体だけを見ており、パネルは対象外（check.js にパネルを開く所は無い）。

## 親の窓へ（workflows は触っていない）
雲の配信の「検査を通っていない物を戻す」一覧に panel-core.js が無い。**次を足さないと、控えの回に検査前の panel-core.js が配られ得る**（panel.html は検査済みの版へ戻されるのに部品だけ新しい）：
1. `.github/workflows/check.yml` 225行の `FILES=` と、`state-deploy.yml` 63行の `FILES=` に `panel-core.js`
2. 両方の「戻す」段の `case " $NEWER " in *" panel.html "*) NEWER="$NEWER panel-ver.txt"` に panel-core.js も（パネルと部品を一緒に戻す）
3. `job.yml` 100行の `grep -qE '^(panel\.html|panel-check\.js)$'` に `panel-core\.js`
- 今回の初回は、check-pass の版に panel-core.js が無く panel.html も v209 に戻るだけなので害は無い。
- CLAUDE.md 作法44 十一の「panel.html の headText…と同じ決まりの写し…⑤の十六が見張る」は古くなった（今は panel-core.js 一つ）。直すかは本人の決め。

## 回る段の突き合わせ（作法36）
- 手元：`node panel-check.js --static`（⑤の二十五・⑤の十九の足し・⑰の版を含む）・scope-pick-test（panel-core.js の一件を足した）。
- 雲：check.yml の panel-check（⑯の二＝ブラウザで panel-core.js を読む）。panel-core.js だけの押しも scope-pick でパネルの回になる。上の FILES の足しは親の窓。

## 本人が端末で見る所（実機）
- 返事パネルの下の版の字が **panel v210**。
- 頭の字と「まとめて写す（残N／N件）」が今までどおり出る（「部品が読めない」と出たら panel-core.js が読めていない）。
- センコの読んだ刻の後の数が、state.json の panelView.left と同じ（本人が手で写した分だけ端末の方が少ない）。

## 三（公開後の比べ）
公開されたら、雲のブラウザで開いたパネルの数と panelView を比べてから札に——これは親の窓が配信の後に行う（⑯の二は同じ比べを作り値で雲の検査に入れた）。
