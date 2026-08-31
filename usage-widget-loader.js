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
 */

const SRC   = 'https://kfsr148-art.github.io/koushu-handan/usage-widget.js';
const NAME  = 'usage-widget.js';   /* 端末のローカルに置く控えの名 */
const TIMEO = 10;                  /* 取得の待ち（秒） */

const BG  = new Color('#0d1b16');
const FG  = new Color('#e8f0ea');
const HOT = new Color('#c0392b');

const fm   = FileManager.local();
const path = fm.joinPath(fm.documentsDirectory(), NAME);

/* 取りに行く。中間の控えを挟まないよう、毎回ちがう問い合わせにする（本体の ver.txt と同じ流儀）。 */
let fresh = null;
try {
  const r = new Request(SRC + '?_chk=' + Date.now());
  r.timeoutInterval = TIMEO;
  const t = await r.loadString();
  /* 途中で切れた中身を控えへ書かない。**最後まで来た印**（module.exports）が無ければ捨てる。 */
  if (t && t.indexOf('module.exports') >= 0) { fresh = t; }
} catch (e) { /* 取れないだけ。控えで描く */ }

if (fresh) { try { fm.writeString(path, fresh); } catch (e) { /* 書けなくても描ける */ } }

/* 控え（さっき書いた分か、前に取れた分）を読む。 */
let code = null;
try { if (fm.fileExists(path)) { code = fm.readString(path); } } catch (e) { }

if (!code) {
  /* 控えも無い＝いちばん最初の一回だけここへ来る。 */
  const w = new ListWidget();
  w.backgroundColor = BG;
  const t1 = w.addText('取得できませんでした');
  t1.font = Font.semiboldSystemFont(13);
  t1.textColor = HOT;
  w.addSpacer(4);
  const t2 = w.addText('中身をまだ一度も取れていません。通信を確かめて、もう一度お試しください。');
  t2.font = Font.systemFont(11);
  t2.textColor = FG;
  if (config.runsInWidget) { Script.setWidget(w); } else { w.presentSmall(); }
  Script.complete();
} else {
  /* 中身の側に「殻から呼ばれた」と伝える。中身は自分では貼らず、build() を渡してくる。 */
  globalThis.__USAGE_LOADER = true;
  const mod = importModule(path);
  const widget = await mod.build();
  if (config.runsInWidget) { Script.setWidget(widget); } else { widget.presentSmall(); }
  Script.complete();
}
