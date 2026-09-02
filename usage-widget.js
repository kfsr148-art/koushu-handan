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
/* 終了予定の刻だけに使う明るい水色（2026-09-02・パネルの色-1）。返事パネルの --pred と同じ値。
   ＊二箇所で違う色を使わない。片方だけ変えると、同じ物が別の色で出る。 */
const PRED  = new Color('#7fdfff');


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

/* ボーダーライン（2026-08-30・使用量の配分-2。同日の訂正で切り上げへ）。
 *   「**次の20:00境界までに許される割合**」の目安。
 *   式 … 直近リセット刻からの**経過24時間を切り上げた数 × 100 ÷ 7**。上限100%。
 *        直近リセット刻は resets_at（次のリセット）から週期＝7日を引いて導く。
 *        リセットは毎週 20:00（現地）なので、表示は「20:00まで N%」。
 *   例 … リセットが 8/31(月)20:00 のとき——
 *        8/30(土) 20時台   … 切り上げ7 → **100%**（次の境界はリセットそのもの）
 *        8/30(土) 19:48    … 切り上げ6 → **85.7%**（次の境界＝今日の20:00 までの枠）
 *        8/31(月) 20:01    … 新しい週の切り上げ1 → **14.3%**
 *   ＊はじめは切り捨てで書いたが、それは「済んだ分」の物差しで、
 *     この行が言いたい「**次の境目までに使ってよい上限**」とずれていた（同日の訂正）。
 *   ＊切り上げ0（リセットちょうど）は1に引き上げる——境目の瞬間も「最初の一日ぶん」を許す。
 *   ＊古い台本の「19:59まで」の引き方は**採らない**（この関数がその置き換え）。
 *   ＊週全体も週 Fable も resets_at は同じ刻なので、**各自の物差しで同じ値**になる。 */
function borderPct(iso) {
  if (!iso) { return null; }
  let next = Date.parse(iso);
  if (isNaN(next)) { return null; }
  /* **分へ丸める。** 実物の resets_at には小数秒が乗り（…T11:00:00.469877Z）、
     二つの物差しで約1秒ずれてもいる（weekly_all 11:00:00.697 ／ weekly_scoped 10:59:59.697）。
     そのままだと境目で1日ずれ、二つの行の値も食い違う。分へ丸めれば、どちらも同じ 20:00 になる。 */
  next = Math.round(next / 60000) * 60000;
  const last = next - 7 * 86400000;              /* 直近リセット刻 ＝ 次 − 7日 */
  let days = Math.ceil((Date.now() - last) / 86400000);      /* 経過24時間の**切り上げ** */
  if (days < 1) { days = 1; }                    /* 切り上げ0（境目ちょうど）は1へ */
  return Math.round(Math.min(7, days) * 1000 / 7) / 10;      /* 0.1% 刻み・上限100 */
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

/* ---- 状態まわり（2026-09-01・ウィジェットの状態表示-1）----
   ＊読む先はどれも公開側。返事パネルが見ているものと同じ。
   ＊猫の絵はリポジトリにあるものをそのまま使う（RunCat の走りコマと眠り、現場猫の絵）。
     ウィジェットは動かせないので、走るコマは**静止の一枚**を選ぶ。 */
const URL_STATE   = 'https://kfsr148-art.github.io/koushu-handan/state.json';
const URL_NOTICES = 'https://kfsr148-art.github.io/koushu-handan/notices.json';
const URL_VER     = 'https://kfsr148-art.github.io/koushu-handan/ver.txt';
const URL_PANEL   = 'https://kfsr148-art.github.io/koushu-handan/panel.html';
const URL_IMG     = 'https://kfsr148-art.github.io/koushu-handan/';

/* 状態 → 猫の絵。四通り。**ウィジェットは白い猫**（2026-09-01・ウィジェットの猫の色-1）。
   ＊元の絵（cat2.png など）は残してあり、返事パネルの猫はそちらのまま。
   ＊白い方は cat-white.js で焼き直したもの。黒一色の影絵は色を反転、
     現場猫（panel-icon.png）は透明が無く四角い塊に見えるので、背景を抜いて白い影絵にした。 */
const CAT_OF = {
  '作業中':   'cat2-white.png',        /* 走るコマの一枚 */
  '手待ち':   'cat-sleep-white.png',   /* 眠り */
  'ヨシ待ち': 'panel-icon-white.png',  /* 現場猫の白い影絵（ヨシは現場猫の言葉） */
  '異常':     'cat4-white.png'         /* ふだんと違う姿 */
};

async function loadState() {
  const s = { stat: '', subj: '', mikomi: '', startedAt: 0, ready: null, ver: '' };
  try {
    const r = new Request(URL_STATE + '?_chk=' + Date.now());
    r.timeoutInterval = 8;
    const d = await r.loadJSON();
    if (d) {
      s.stat = String(d.stat || '');
      s.subj = String(d.subj || '');
      s.mikomi = String(d.mikomi || '');
      s.startedAt = Number(d.startedAt || 0);
    }
  } catch (e) { }
  /* 写せますの件数 … いちばん新しい「写せます（N件）」の札から取る（返事パネルと同じ拾い方）。 */
  try {
    const r2 = new Request(URL_NOTICES + '?_chk=' + Date.now());
    r2.timeoutInterval = 8;
    const n = await r2.loadJSON();
    const rows = Array.isArray(n) ? n : (n && n.items ? n.items : []);
    let newest = null;
    for (const x of rows) {
      const m = String((x && x.message) || '').match(/写せます（(\d+)件）/);
      if (m && (!newest || (x.time || 0) > newest.time)) { newest = { time: x.time || 0, n: Number(m[1]) }; }
    }
    if (newest) { s.ready = newest.n; }
  } catch (e) { }
  try {
    const r3 = new Request(URL_VER + '?_chk=' + Date.now());
    r3.timeoutInterval = 8;
    s.ver = String(await r3.loadString()).trim();
  } catch (e) { }
  return s;
}

async function loadCat(stat) {
  const name = CAT_OF[stat] || CAT_OF['手待ち'];
  try {
    const r = new Request(URL_IMG + name);
    r.timeoutInterval = 8;
    return await r.loadImage();
  } catch (e) { return null; }
}

/* 状態の字。**返事パネルの黄色の行と同じ計算・同じ言い回し**。
     ・作業中   … 「作業中、H時MM分終了予定」（開始＋見込み。過ぎていれば見込みの幅で先へ送る）
     ・手待ち   … 「次の指示待ち」
     ・ヨシ待ち … 「ヨシを返してください」
     ・異常     … 「異常です」 */
/* 状態の字を「頭」と「刻」に分ける（2026-09-02・パネルの色-1）。
   ＊Scriptable の addText は色を一つしか持てないので、色を分けるには字を分けるしかない。
     返事パネル側は span で包んでいる。**出る字は両方とも同じ。**
   ＊分けるのは「HH時MM分終了予定」の形だけ。「終了予定不明」には刻が無いので分けない。
   ＊字そのものは stateText が作る。**組み立てを二つ持たない。** */
function stateParts(s) {
  const t = stateText(s);
  const m = t.match(/([0-9]+時[0-9]+分終了予定)/);
  if (!m) { return { head: t, pred: '' }; }
  return { head: t.slice(0, m.index), pred: m[1] };
}

function stateText(s) {
  if (s.stat === '作業中') {
    const mm = s.mikomi.match(/(\d+)/);
    let end = (s.startedAt && mm) ? (s.startedAt + parseInt(mm[1], 10) * 60) : 0;
    if (!end) { return '作業中、終了予定不明'; }
    const now = Math.floor(Date.now() / 1000);
    const step = (mm ? parseInt(mm[1], 10) : 10) * 60;
    let guard = 0;
    while (end <= now && guard < 200) { end += step; guard++; }
    const e = new Date(end * 1000);
    return '作業中、' + e.getHours() + '時' + ('0' + e.getMinutes()).slice(-2) + '分終了予定';
  }
  if (s.stat === '手待ち')   { return '次の指示待ち'; }
  if (s.stat === 'ヨシ待ち') { return 'ヨシを返してください'; }
  if (s.stat === '異常')     { return '異常です'; }
  return '状態が読めません';
}

function stateColor(stat) {
  if (stat === 'ヨシ待ち') { return WARN; }
  if (stat === '異常')     { return HOT; }
  return FG;
}

function readyText(s) {
  return (s.ready === null) ? '写せます—' : ('写せます' + s.ready + '件');
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

  /* ---- 状態の行（2026-09-01・ウィジェットの状態表示-1）----
     ＊返事パネルの黄色の行と**同じ計算・同じ言い回し**。
     ＊猫は state.json の状態で出し分ける。ウィジェットは動かせないので一枚絵。 */
  const st  = await loadState();
  const cat = await loadCat(st.stat);

  const head = w.addStack();
  head.layoutHorizontally();
  head.centerAlignContent();
  if (cat) { const im = head.addImage(cat); im.imageSize = new Size(26, 17); im.resizable = true; }
  else { const sp = head.addText('　'); sp.font = Font.systemFont(11); }
  head.addSpacer(6);
  /* 状態と刻を**縦に積む**（2026-09-02・パネルの色-1）。
     ＊横に並べると折り返せず、狭いウィジェットで刻が切れる。縦なら切れない。
     ＊刻が無い状態（次の指示待ち・ヨシを返してください・異常）は一行のまま——
       いままでと同じ見え方になる。 */
  const parts = stateParts(st);
  const col = head.addStack();
  col.layoutVertically();
  const sl = col.addText(parts.head);
  sl.font = Font.semiboldSystemFont(11);
  sl.textColor = stateColor(st.stat);
  sl.lineLimit = 2;
  sl.minimumScaleFactor = 0.7;
  if (parts.pred) {
    const pv = col.addText(parts.pred);
    pv.font = Font.semiboldSystemFont(11);
    pv.textColor = PRED;
    pv.lineLimit = 1;
    pv.minimumScaleFactor = 0.7;
  }
  head.addSpacer();
  w.addSpacer(4);

  /* 写せますの件数と、本体の版を一行で（同上）。 */
  const sub = w.addText(readyText(st) + ' ・ ' + (st.ver ? ('v' + st.ver) : '版—'));
  sub.font = Font.systemFont(10);
  sub.textColor = DIM;
  sub.lineLimit = 1;
  w.addSpacer(6);

  /* 触ったら返事パネルを開く（同上）。 */
  w.url = URL_PANEL;

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

  /* 値の入っていない本文を、0% として描かない（2026-09-02・使用量の空振り-1）。
     ＊2026-09-02 03:06〜、HTTP 200 のまま全枠が 0 ／ resets_at が null の本文が返り続け、
       ウィジェットは三行とも「0%」・戻る刻を「—」で出していた。**読めていない**のに、
       使い切っていない、という**逆の意味に読める字**が出るのがいちばん悪い。
     ＊空かどうかを判じるのは見張りの側（usage.json の `empty`）。ここでは判じ直さない。
     ＊控え（`good`）があれば**その値を、取得の刻を添えて**出す。無ければ数字を出さない。 */
  const empty = !!(j && j.empty);
  const good  = (j && j.good && j.good.body) ? j.good : null;
  const src   = empty ? (good ? good.body : null) : body;
  if (!src) {
    const e = w.addText('使用量は取れていません');
    e.font = Font.semiboldSystemFont(13);
    e.textColor = HOT;
    const e2 = w.addText('控えもありません');
    e2.font = Font.systemFont(10);
    e2.textColor = DIM;
    w.addSpacer();
    const ft0 = w.addText('更新 ' + (j && j.at && !isNaN(new Date(j.at)) ? hhmm(new Date(j.at)) : '—'));
    ft0.font = Font.systemFont(10);
    ft0.textColor = DIM;
    return w;
  }

  const fh = src.five_hour || {};
  const sd = src.seven_day || {};
  const fb = fableLimit(src);

  row(w, 'セッション', pct(fh.utilization), until(fh.resets_at));
  /* 週の二行には、ボーダー（20:00まで N%）を「戻るまで」の左に添える（2026-08-30）。
     ＊値が出ない回（resets_at が読めない）は添えず、今までどおりの形に落ちる。 */
  const bAll = borderPct(sd.resets_at);
  const bFab = fb ? borderPct(fb.resets_at) : null;
  row(w, '週全体',     pct(sd.utilization),
      (bAll !== null ? ('20:00まで ' + bAll + '%  ') : '') + until(sd.resets_at));
  if (fb) { row(w, '週 Fable', pct(fb.percent),
      (bFab !== null ? ('20:00まで ' + bFab + '%  ') : '') + until(fb.resets_at)); }

  w.addSpacer();
  /* 足元の一行。**控えを出している回は、その値がいつのものかを必ず添える。**
     ＊「更新 06:04」とだけ出すと、いま取れた値のように読める。 */
  const at = j && j.at ? new Date(j.at) : null;
  let foot = '更新 ' + (at && !isNaN(at) ? hhmm(at) : '—');
  if (empty && good) {
    const ga = good.at ? new Date(good.at) : null;
    foot = (ga && !isNaN(ga) ? hhmm(ga) : '—') + '時点の値 ・ いまは取れていません';
  }
  const ft = w.addText(foot);
  ft.font = Font.systemFont(10);
  ft.textColor = (empty && good) ? WARN : DIM;

  return w;
}

/* 殻（usage-widget-loader.js）から呼べるように、組み立てだけを渡す（2026-09-01）。
   ＊殻はこの中身をその場で評価し、build() を受け取って自分で貼る。
   ＊殻を通さずに、この台本そのものを走らせたときは、今までどおり自分で貼る。
     見分けは、殻が module を手渡しているかどうか。**表示も式も今までと同じ**。
   ＊**この末尾で await を使わない**（殻の直し-1）。てっぺんの await があると、
     読み込ませ方によっては module.exports を受け取る前に返ってしまう。 */
if (typeof module !== 'undefined' && module) { module.exports = { build: build }; }

/* 殻から呼ばれた回は、殻が module に viaLoader を立てている。そのときは自分で貼らない。
   ＊Scriptable は台本にも module を渡すので、module の有無では見分けられない。 */
if (!(typeof module !== 'undefined' && module && module.viaLoader)) {
  build().then(function (widget) {
    if (config.runsInWidget) { Script.setWidget(widget); }
    else { widget.presentSmall(); }
    Script.complete();
  });
}
