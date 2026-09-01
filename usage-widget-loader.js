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
