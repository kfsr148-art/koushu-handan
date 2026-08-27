/* Claude 使用量ウィジェット（Scriptable）— 割合と「何時間後に戻る」だけ
 *
 * 出すのは四つだけ。
 *   ・セッション（5時間枠）の割合と、戻るまで
 *   ・週全体の割合と、戻るまで
 *   ・週 Fable の割合と、戻るまで
 *   ・最後に読めた時刻
 *
 * **状態の行（作業中／手待ちなど）と claude の本数は出さない。**
 *   ＊二重表示をやめるため（2026-08-27）。状態は返事パネルで見る。
 *     usage.json には watch.state も watch.claude も入ったままだが、
 *     このウィジェットは**読まない**。消すのは見せ方の側だけにする。
 *
 * 置き方
 *   1. Scriptable で新しい台本を作り、この中身を貼る（名は「Claude 使用量」）
 *   2. ホーム画面のウィジェット（小 or 中）に Scriptable を置き、
 *      Script にこの台本、When Interacting は Run Script
 *
 * 読み先
 *   https://kfsr148-art.github.io/koushu-handan/usage.json
 *   ＊公開ページ側にする。raw.githubusercontent は max-age=300 で古い値が返る。
 */

const URL_USAGE = 'https://kfsr148-art.github.io/koushu-handan/usage.json';

const BG    = new Color('#0d1b16');
const FG    = new Color('#e8f0ea');
const DIM   = new Color('#7f9a8c');
const OK    = new Color('#4fb286');
const WARN  = new Color('#d9a441');
const HOT   = new Color('#c0392b');

/* 割合の色。80% から橙、95% から赤。 */
function hue(p) {
  if (p >= 95) { return HOT; }
  if (p >= 80) { return WARN; }
  return OK;
}

/* 戻るまでを短く。1時間未満は分、48時間未満は時間、それ以上は日。 */
function until(iso) {
  if (!iso) { return '—'; }
  const t = Date.parse(iso);
  if (isNaN(t)) { return '—'; }
  const ms = t - Date.now();
  if (ms <= 0) { return 'まもなく'; }
  const min = Math.round(ms / 60000);
  if (min < 60) { return min + '分後'; }
  const hr = ms / 3600000;
  if (hr < 48) { return (hr < 10 ? hr.toFixed(1) : Math.round(hr)) + '時間後'; }
  return Math.round(hr / 24) + '日後';
}

function pct(v) {
  const n = Number(v);
  return isFinite(n) ? Math.round(n) : null;
}

/* 週 Fable は limits の中にいる。kind=weekly_scoped で、scope.model.display_name が Fable。
   ＊名が変わっても落ちないよう、見つからなければその行ごと出さない。 */
function fableLimit(body) {
  const ls = (body && Array.isArray(body.limits)) ? body.limits : [];
  for (const l of ls) {
    if (l && l.kind === 'weekly_scoped' && l.scope && l.scope.model &&
        String(l.scope.model.display_name || '').toLowerCase() === 'fable') {
      return l;
    }
  }
  return null;
}

function hhmm(d) {
  const p = n => String(n).padStart(2, '0');
  return p(d.getHours()) + ':' + p(d.getMinutes());
}

/* 一行 ＝ 名前・割合・棒・戻るまで。 */
function row(stack, name, p, back) {
  const line = stack.addStack();
  line.layoutHorizontally();
  line.centerAlignContent();

  const nm = line.addText(name);
  nm.font = Font.systemFont(12);
  nm.textColor = DIM;
  nm.lineLimit = 1;
  line.addSpacer();

  const pv = line.addText(p === null ? '—' : p + '%');
  pv.font = Font.semiboldSystemFont(13);
  pv.textColor = p === null ? DIM : hue(p);

  const bk = line.addText('  ' + back);
  bk.font = Font.systemFont(11);
  bk.textColor = DIM;
  bk.lineLimit = 1;

  /* 棒。割合そのものを長さで出す。 */
  const bar = stack.addStack();
  bar.layoutHorizontally();
  bar.size = new Size(0, 3);
  bar.cornerRadius = 1.5;
  bar.backgroundColor = new Color('#1e3329');
  if (p !== null && p > 0) {
    const fill = bar.addStack();
    fill.backgroundColor = hue(p);
    fill.cornerRadius = 1.5;
    fill.size = new Size(Math.max(2, Math.round(140 * Math.min(100, p) / 100)), 3);
    fill.addSpacer();
  }
  bar.addSpacer();
  stack.addSpacer(6);
}

async function build() {
  const w = new ListWidget();
  w.backgroundColor = BG;
  w.setPadding(12, 13, 12, 13);

  let j = null, err = '';
  try {
    const r = new Request(URL_USAGE + '?_chk=' + Date.now());
    r.timeoutInterval = 10;
    j = await r.loadJSON();
  } catch (e) {
    err = '読めません';
  }

  const head = w.addStack();
  head.layoutHorizontally();
  head.centerAlignContent();
  const ttl = head.addText('Claude 使用量');
  ttl.font = Font.semiboldSystemFont(12);
  ttl.textColor = FG;
  head.addSpacer();
  w.addSpacer(8);

  /* 中身が壊れていたら、古い値を新しい値として見せない。**読めないと書く。**
     ＊書きかけの JSON を掴んだときに、前の値が残って見えるのがいちばん危ない。 */
  const body = (j && j.body) ? j.body : null;
  if (!body) {
    const e = w.addText(err || '中身がありません');
    e.font = Font.systemFont(13);
    e.textColor = HOT;
    w.addSpacer();
    return w;
  }

  const fh = body.five_hour || {};
  const sd = body.seven_day || {};
  const fb = fableLimit(body);

  row(w, 'セッション', pct(fh.utilization), until(fh.resets_at));
  row(w, '週全体',     pct(sd.utilization), until(sd.resets_at));
  if (fb) { row(w, '週 Fable', pct(fb.percent), until(fb.resets_at)); }

  w.addSpacer();
  const at = j && j.at ? new Date(j.at) : null;
  const ft = w.addText('更新 ' + (at && !isNaN(at) ? hhmm(at) : '—'));
  ft.font = Font.systemFont(10);
  ft.textColor = DIM;

  return w;
}

const widget = await build();
if (config.runsInWidget) { Script.setWidget(widget); }
else { widget.presentSmall(); }
Script.complete();
