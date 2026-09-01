# 殻の直し-1 — 実機の `importModule` エラーは台本名と控え名の衝突。直に評価する形へ

**状態：終わり（残り0件）／VAIO 2026-09-01 11:5x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — 落ちた元は **`importModule` に渡した控えの置き先**。控えを
`documentsDirectory/usage-widget.js` に置いていたので、**台本の名が `usage-widget` だと
自分自身を上書きし、自分自身を読み込みにいく**形になっていた（エラーが
`in usage-widget module` の中で出ていたのがその印）。**`importModule` をやめて直に評価する形**へ
作り替え、控えの名も台本名と衝突しないものにした。公開の実物で五通り実測して合格。

---

## ① 原因

実機のエラー … `Error on line 39:27 in usage-widget module: TypeError: undefined is not an object (evaluating 'importModule(path)')`

- **`in usage-widget module`** … 落ちた場所が「usage-widget という名の台本」の中。
  つまり**貼った台本の名が `usage-widget`** で、殻はそこから走っていた。
- 旧・殻は控えを **`documentsDirectory/usage-widget.js`** に書いていた。これは
  **その台本のファイルそのもの**。`fm.writeString` で**自分を上書き**し、
  `importModule(path)` で**自分を読み込む**ことになる。
- `importModule` は Scriptable の台本として読み込む仕掛けなので、**名前・拡張子・置き場（ローカル／iCloud）に
  依存する**。台本名と重なると、この形で壊れる。

**加えて危うかった点** … 旧・本体はてっぺんに `await`（`const widget = await build();`）を持っていた。
`importModule` は中身にトップレベル await があると**約束（Promise）を返す**ので、
`mod.build` を掴めない形になり得た。ここも合わせて外した。

## ② `importModule` に頼らない形（採った案）

| 案 | 中身 | 判断 |
|---|---|---|
| 旧：`importModule(path)` | 控えを台本として読み込む | **不採用**。名前・置き場に依存し、台本名と重なると自分を読む |
| 採用：**`AsyncFunction` で直に評価** | 取ってきた字をその場で関数にして `module.exports` を受け取る | **採用**。ファイル名にも置き場にも依存しない |
| `eval` | 同上 | 不採用。スコープが曖昧で、道具の見え方が読めない |

採った形の要点。

- 控えの名を **`claude-usage-cache.js`** に変えた（台本の名と重ならない）。
  さらに **走っている台本と同名なら書きも読みもしない**（`Script.name() + '.js'` と突き合わせる）。
- 中身は `new AsyncFunction('module','exports','Color','Font','ListWidget','Size','Request','Script','config', src)`
  として評価し、**道具は引数で手渡す**。台本ごとの見え方に頼らない。
- 殻は `module.viaLoader = true` を立てる。**本体はこれを見て「自分では貼らない」**と決める
  （Scriptable は台本にも `module` を渡すので、`module` の有無では見分けられない）。
- 本体のてっぺんの `await` は撤去（`build().then(...)` へ）。
- 中身で誤りが出た回は、**その字を札に出す**（真っ白にしない）。

## ③ 直した殻の全文

このあとの節に、前置きも囲みも付けずに載せる（知らせの本文にも同じものを写した）。

## ④ 確かめ方と結果（真似た中身ではなく、**公開から取ってきた実物**で）

`https://kfsr148-art.github.io/koushu-handan/usage-widget.js` を実際に取得し、**殻と同じ道筋**
（`AsyncFunction` で評価して `build` を受け取る）で走らせた。取ってきた中身は
**6867字・`module.exports` あり・てっぺんの await なし**。

| 通り | 何を再現したか | 結果 |
|---|---|---|
| **(甲)** 公開の実物で描く | 端末が毎回する動き | `Claude 使用量／セッション／26%／7分後／週全体／7%`。控えは **`claude-usage-cache.js`** に保存 |
| **(乙)** 台本名が `usage-widget` | **実機で落ちた形そのもの** | 描けた（`Claude 使用量／セッション／26%`）。**台本を上書きしていない** |
| **(丙)** 取得できない | 圏外・公開の詰まり | **控えで描けた** |
| **(丁)** 控えも無い | いちばん最初の一回 | `取得できませんでした` ＋ 案内の一行 |
| **(戊)** 本体を直に走らせる | 殻を通さない従来の使い方 | **自分で貼った**（従来どおり動く） |

＊端末そのものでの確認は残っています——**貼り替えた殻でウィジェットが描けること（エラー窓が出ないこと）**。
数字は `usage.json` と同じものが出ます。

---

/* Claude 使用量ウィジェットの殻（Scriptable）— 中身を取りに行って走らせるだけ
 *
 * これを **一度だけ** Scriptable に貼れば、あとは中身（usage-widget.js）を
 * こちらで直すだけで端末に届く。**貼り替えは要らない。**
 *
 * 置き方
 *   1. Scriptable で新しい台本を作り、この中身を貼る（名は「Claude 使用量」）
 *   2. ホーム画面のウィジェット（小 or 中）に Scriptable を置き、
 *      Script にこの台本、When Interacting は Run Script
 *
 * 何をするか
 *   ・公開側から usage-widget.js を取ってきて、端末のローカルへ控える
 *   ・取れた回は、その中身で描く（控えも新しくする）
 *   ・取れなかった回は、**控えで描く**（真っ白にしない）
 *   ・控えも無い初回だけ「取得できませんでした」と出す
 *
 * 直し（2026-09-01・殻の直し-1）
 *   ・**importModule は使わない。** 控えを台本として読み込ませる形は、
 *     台本の名と控えの名が重なると自分自身を読みにいって落ちる。
 *     実機で `TypeError: undefined is not an object (evaluating 'importModule(path)')` が出た。
 *   ・控えの名を **claude-usage-cache.js** にして、台本の名と重ならないようにした。
 *     走っている台本と同じ名になる場合は、書き込みも読み込みもしない（自分を上書きしない）。
 *   ・中身は **AsyncFunction で直に評価**し、道具（Color/Font/ListWidget/Size/Request/Script/config）は
 *     引数で手渡す。台本ごとの見え方に頼らないので、どの置き方でも同じに動く。
 */

const SRC   = 'https://kfsr148-art.github.io/koushu-handan/usage-widget.js';
const CACHE = 'claude-usage-cache.js';   /* 控えの名。台本の名と重ならないものにする */
const TIMEO = 10;                        /* 取得の待ち（秒） */

const BG  = new Color('#0d1b16');
const FG  = new Color('#e8f0ea');
const HOT = new Color('#c0392b');

const fm   = FileManager.local();
const path = fm.joinPath(fm.documentsDirectory(), CACHE);

/* 走っている台本そのものを指していないか。指していれば控えは使わない（自分を上書きしない）。 */
let selfHit = false;
try { selfHit = (Script.name() + '.js') === CACHE; } catch (e) { }

/* 取りに行く。中間の控えを挟まないよう、毎回ちがう問い合わせにする（本体の ver.txt と同じ流儀）。 */
let fresh = null;
try {
  const r = new Request(SRC + '?_chk=' + Date.now());
  r.timeoutInterval = TIMEO;
  const t = await r.loadString();
  /* 途中で切れた中身を控えへ書かない。**最後まで来た印**（module.exports）が無ければ捨てる。 */
  if (t && t.indexOf('module.exports') >= 0) { fresh = t; }
} catch (e) { /* 取れないだけ。控えで描く */ }

if (fresh && !selfHit) { try { fm.writeString(path, fresh); } catch (e) { /* 書けなくても描ける */ } }

/* 使う中身を決める。取れた分が最優先、無ければ控え。 */
let code = fresh;
if (!code && !selfHit) {
  try { if (fm.fileExists(path)) { code = fm.readString(path); } } catch (e) { }
}

/* 中身から build を取り出す。**importModule は使わない**——台本として読み込ませず、
   その場で評価して module.exports を受け取る。道具は引数で手渡す。 */
async function takeBuild(src) {
  const AsyncFn = Object.getPrototypeOf(async function () { }).constructor;
  const mod = { exports: {}, viaLoader: true };   /* 中身は これを見て「自分では貼らない」と決める */
  const fn = new AsyncFn('module', 'exports', 'Color', 'Font', 'ListWidget', 'Size',
                         'Request', 'Script', 'config', src);
  await fn(mod, mod.exports, Color, Font, ListWidget, Size, Request, Script, config);
  return (mod.exports && typeof mod.exports.build === 'function') ? mod.exports.build : null;
}

function panel(head, note) {
  const w = new ListWidget();
  w.backgroundColor = BG;
  const t1 = w.addText(head);
  t1.font = Font.semiboldSystemFont(13);
  t1.textColor = HOT;
  w.addSpacer(4);
  const t2 = w.addText(note);
  t2.font = Font.systemFont(11);
  t2.textColor = FG;
  return w;
}

let widget = null;
if (code) {
  try {
    const build = await takeBuild(code);
    if (build) { widget = await build(); }
    else { widget = panel('中身が読めません', '取ってきた中身に build がありません。次の更新でやり直します。'); }
  } catch (e) {
    widget = panel('中身で誤りが出ました', String(e));
  }
} else {
  /* 控えも無い＝いちばん最初の一回だけここへ来る。 */
  widget = panel('取得できませんでした',
                 '中身をまだ一度も取れていません。通信を確かめて、もう一度お試しください。');
}

if (config.runsInWidget) { Script.setWidget(widget); } else { widget.presentSmall(); }
Script.complete();

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **96件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`殻の直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AE%BB%E3%81%AE%E7%9B%B4%E3%81%97-1.md) | 09-01 11:54 | 殻の直し-1 — 実機の `importModule` エラーは台本名と控え名の衝突。直に評価する形へ |
| [`知らせの詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-01 11:29 | 知らせの詰まり-1 — 「外待ち」の消し忘れで198分止まっていた。網を足した |
| [`ウィジェットの自動更新-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0-1.md) | 09-01 08:02 | ウィジェットの自動更新-1 — 殻を新設して、Scriptable への貼り替えを不要にした |
| [`検査の取りこぼし-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E5%8F%96%E3%82%8A%E3%81%93%E3%81%BC%E3%81%97-1.md) | 09-01 06:02 | 検査の取りこぼし-1 — 打ち切りは「落ちた」ではなく「測れなかった」として扱う |
| [`手牌の境目-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-3.md) | 09-01 03:47 | 手牌の境目-3 — `--vz-show` の745は据え置きで確定（掘り返さないための裁定の控え） |
| [`手牌の境目-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-2.md) | 09-01 03:07 | 手牌の境目-2 — 案Aを実装（v1434）。手元も Actions も 189/189 全通過 |
| [`手牌の境目-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-1.md) | 09-01 03:07 | 手牌の境目-1 — 746x375 の手牌が12px切れる件。境目は実測で 758px |
| [`状態の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8A%B6%E6%85%8B%E3%81%AE%E7%A9%B4-1.md) | 08-31 22:45 | 状態の穴-1 — 走っている最中に「次の指示待ち」へ落ちる件（外待ちで作業中を保つ） |
| [`検査の網-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E7%B6%B2-1.md) | 08-31 22:44 | 検査の網-1 — ⑦の視野を網の隙間まで広げた。境目 746x375 で手牌が12px切れている |
| [`自動検査-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-5.md) | 08-31 21:36 | 自動検査-5 — 丙を実装（v1432）。手元も Actions も完全版で全通過 |
| [`自動検査-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-4.md) | 08-31 20:53 | 自動検査-4 — 667x375 の溢れは v1431 で入った（.next-hand-row・21.3px） |
| [`待ちの決め-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%BE%85%E3%81%A1%E3%81%AE%E6%B1%BA%E3%82%81-2.md) | 08-31 12:15 | 待ちの決め-2 — 🙋 の関門に「待ちなしの回は立てない」を実装／⑦の材料 |
| [`自動検査-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-2.md) | 08-31 12:08 | 自動検査-2 — 完全版は環境差で⑦が落ちた。緩めずに報告して速い版へ戻した |
| [`写しの食い違い-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%A3%9F%E3%81%84%E9%81%95%E3%81%84-1.md) | 08-31 11:50 | 写しの食い違い-1 — 束ねる側を数える側に合わせた（panel v104） |
| [`自動検査-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-1.md) | 08-31 09:54 | 自動検査-1 — GitHub Actions で check.js と adv-check.js を push ごとに回す |
| [`使用量の配分-2-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-3.md) | 08-30 20:42 | 使用量の配分-2 の訂正 — ボーダーの式を切り上げへ |
| [`通知の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 08-30 20:30 | 通知の走り出し-1 — 仕事が始まったら「😸 終了予定はHH時MM分ですにゃ」を一発 |
| [`使用量の配分-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-2.md) | 08-30 19:52 | 使用量の配分-2 の続き — usage-widget.js へボーダーの行を実装した |
| [`使用量の配分-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2.md) | 08-30 19:42 | 使用量の配分-2 — 「19:59まで N%」の行は VAIO の側に無い。名と場所を報告して止まる |
| [`猫の常駐-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E5%B8%B8%E9%A7%90-1.md) | 08-30 17:36 | 猫の常駐-1 — 題字の右に RunCat の猫を置いた（panel v103） |

<!-- 控えの一覧 ここまで -->
