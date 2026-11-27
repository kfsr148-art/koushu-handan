/* panel-core.js — 返事パネルの数え方と字の組み立て（2026-11-22・本人の枠 七十四・panel v210）
 *
 * 目的：まとめて写すの残り・頭の字・三つの箱・見込みの字を、パネル（panel.html・端末のブラウザ）と
 *   VAIO の panelView（panel-view.js・node）が**同じ一つの物**で組む。前は二か所に同じ字の写しがあり、
 *   片方だけ先に公開されると数が食い違った（11-22 03:41：panelView 0件・本人の画面 残1）。
 * 読み方：ブラウザは <script src="panel-core.js?_v=<版>"> で読み、window.PanelCore に置く。
 *   node は require('./panel-core.js')。どちらも同じ関数を返す（UMD の形）。
 * 決まり：ここには端末だけの物を持たない。今の刻（now）・写した印（端末の localStorage）・センコの印の刻は、
 *   呼ぶ側が引数で渡す。DOM・fetch・localStorage・Date.now() はここで使わない。
 *   ＊pad2s と kumoEtaSec だけは「呼ぶ側の時計の帯」で HH:MM を読む（端末は端末の帯・VAIO は日本の帯。どちらも日本で使う）。
 * 版：VER は panel.html の PANEL_VER・verTag・panel-ver.txt と同じ数（panel-check.js の ⑰ が揃うかを見る）。
 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module && module.exports) { module.exports = m; }
  else { root.PanelCore = m; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var VER = '282';
  var WAIT_TEXT = '待機中、、、。', POINT_TEXT = 'まとめて写すヨシ！', WORK_TEXT = '作業中、、、。', LOST_TEXT = '接続不良、、、。', CHECKING_TEXT = '確認中、、、。', REST_TEXT = '休憩中、、、。', YOSHI_TEXT = 'ヨシ待ち、、、。', CHECK_TEXT = '検査中、、、。';

  /* ---- 刻 ---- */
  /* センコが読んだ刻（state.json の senkoReadAt「YYYY-MM-DD HH:mm:ss」・日本の時計）を epoch 秒に。読めなければ 0（v200） */
  function senkoEpoch(s) { var m = /^([0-9]{4}-[0-9]{2}-[0-9]{2}) ([0-9]{2}:[0-9]{2}:[0-9]{2})$/.exec(String(s || '')); if (!m) { return 0; } var t = Date.parse(m[1] + 'T' + m[2] + '+09:00'); return isNaN(t) ? 0 : Math.floor(t / 1000); }
  /* 刻を「HH:MM」の字にする（呼ぶ側の時計の帯・v98） */
  function pad2s(sec) {
    var t = new Date(sec * 1000);
    return ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
  }
  function newestTime(arr) {
    var t = 0;
    (arr || []).forEach(function (d) { if (d && (d.time || 0) > t) { t = d.time || 0; } });
    return t;
  }

  /* ---- まとめて写すの残り ---- */
  /* 「写せます（N件）」の札は数にも目次にも入れない（v116） */
  function isCountCard(d) {
    return /^写せます（[0-9]+件）$/.test(String((d && d.message) || '').trim());
  }
  /* 押し通知が、どれかの札と同じ出来事か（v209）。印（eid）が有れば印で、無ければ同じ題で札の刻の60秒前〜15分後。札は写した物も含めて見る */
  function ntfyOfCard(e, cards) { if (!e) { return false; } var tt = String(e.title || '').trim(), et = Number(e.time || 0); return (cards || []).some(function (c) { if (!c) { return false; } if (e.eid) { return c.eid === e.eid; } var ct = Number(c.time || 0); return !!tt && String(c.title || '').trim() === tt && et >= ct - 60 && et <= ct + 900; }); }
  /* 写していない札と押し通知を、刻の新しい順に一本にする（v114・v177・v200・v209 の決まりを一つに）。
     o.rows＝札の全件（写した物も含む）／o.ntfySent＝押し通知の全件／o.readAt＝センコが読んだ刻（epoch 秒・0 で無し）
     o.cardCopied(d)・o.ntfyCopied(e)＝端末で本人が押した写した印（端末の中だけ。VAIO は渡さない）。
     返す物：[{ t, kind: 'card'|'ntfy', card|ntfy, pushed }]。まとめて写すの残りはこの長さ。 */
  function todoList(o) {
    o = o || {};
    var rows = Array.isArray(o.rows) ? o.rows : [], sent = Array.isArray(o.ntfySent) ? o.ntfySent : [], readAt = Number(o.readAt) || 0;
    var cardCopied = (typeof o.cardCopied === 'function') ? o.cardCopied : function () { return false; };
    var ntfyCopied = (typeof o.ntfyCopied === 'function') ? o.ntfyCopied : function () { return false; };
    var covers = function (t) { return readAt > 0 && Number(t || 0) > 0 && Number(t) <= readAt; };
    var a = [], pushEid = {};
    sent.forEach(function (e) { if (e && e.eid) { pushEid[e.eid] = 1; } });
    rows.forEach(function (d) {
      if (!d || isCountCard(d)) { return; }
      if (cardCopied(d) || covers(d.time)) { return; }
      a.push({ t: d.time || 0, kind: 'card', card: d, pushed: !!(d.eid && pushEid[d.eid]) });
    });
    sent.forEach(function (e) {
      if (!e || ntfyOfCard(e, rows)) { return; }   /* 札と同じ出来事の押し通知は札の行にまとめる（写した札も含めて見る） */
      if (ntfyCopied(e) || covers(e.time)) { return; }
      a.push({ t: e.time || 0, kind: 'ntfy', ntfy: e });
    });
    a.sort(function (x, y) { return y.t - x.t; });
    return a;
  }
  /* 釦の字（v117：M＝N。v211（本人の枠 七十八）：0件は「まとめて写す」の字だけ（0件とは書かない）。パネルの釦は上に「まとめて写す」・下に小さく「N件」を出し、この字は釦の aria-label と panelView.label に入る） */
  function todoLabel(n) { n = Math.max(0, Number(n) | 0); return n > 0 ? ('まとめて写す（残' + n + '／' + n + '件）') : 'まとめて写す'; }

  /* ---- 頭の字 ---- */
  /* 札まとめ中（v188・v189）：止まってから札が一覧に出るまで。o＝{ owedAt, owedEta, rows, now } */
  function cardsPending(o) {
    o = o || {}; var owedAt = Number(o.owedAt) || 0, owedEta = Number(o.owedEta) || 0, now = Number(o.now) || 0;
    if (!(owedAt > 0)) { return false; }
    if (now - owedAt > Math.max(600, (owedEta > owedAt ? owedEta - owedAt + 900 : 0))) { return false; }   /* v189：雲の検査を待つ間は見込みの後15分まで */
    return newestTime(o.rows || []) < owedAt;
  }
  function cardEtaSec(o) { o = o || {}; var owedAt = Number(o.owedAt) || 0, owedEta = Number(o.owedEta) || 0; return owedEta > owedAt ? owedEta : (owedAt + 150); }
  function cardLate(o) { o = o || {}; return cardsPending(o) && (Number(o.now) || 0) > Math.max((Number(o.owedAt) || 0) + 180, cardEtaSec(o) + 30); }
  function cardPendText(o) { return cardLate(o) ? '札が遅れている' : '札まとめ中、、、。'; }   /* v207：短い一言だけ */
  /* 雲待ちの一行（kumo）の「見込み HH:MM」を秒に。見込みの前なら刻を、過ぎていれば 0（v169） */
  function kumoEtaSec(kumo, now) {
    var m = String(kumo || '').match(/見込み[ ]*([0-9]{1,2}):([0-9]{2})/); if (!m) { return 0; }
    now = Number(now) || 0;
    var d = new Date(now * 1000); d.setHours(Number(m[1]), Number(m[2]), 0, 0);
    var sec = Math.floor(d.getTime() / 1000);
    if (sec < now - 12 * 3600) { sec += 24 * 3600; }
    return sec > now ? sec : 0;
  }
  /* 待ちでも下請けか雲が動いている間の頭の字（v206・v207：括弧と次「…」は付けない。det は使わない） */
  function uraBusyText(U, det) {
    var a = function (x) { return Array.isArray(x) ? x : []; }; U = (U && typeof U === 'object') ? U : {};
    var S = U.sub || {}, C = U.cloud || {};
    var ns = Math.max(Math.max(0, Number(S.running) | 0), a(S.items).length), nc = Array.isArray(C.running) ? C.running.length : Math.max(0, Number(C.running) | 0);
    if (!(ns > 0 || nc > 0)) { return ''; }
    return '裏方作業中、、、。';
  }
  /* 頭の字（v207：短い一言だけ）。順は 止まり→動きなし→検査中→待ち→作業中→（走っていて雲の検査中）→走っている→ヨシ待ち→札まとめ中→雲の見込みの前→写す物あり→接続不良→待機中。
     o＝{ stat, cloud, detail, ura, lost（生存の途切れ）, owedAt, owedEta, rows（札の全件）, kumo, left（まとめて写すの残り）, now } */
  /* 走る猫の間か（v172：作業中と検査中。生存が途切れていたら走らせない） */
  function isRunning(stat, lost) { return !lost && (String(stat || '') === '作業中' || String(stat || '') === '検査中'); }
  /* 枠 三百二十六（v263）：仕事が残っているか＝表の仕事の段（stepTotal>stepDone）・順番待ち（waitN）・裏方（ura）・ヨシ待ち・作業中／検査中／止まり／動きなし。頭の字と猫の絵（headCat）が同じ一つの判定を使う */
  function workLeft(o) {
    o = o || {}; var stat = String(o.stat || '');
    return (Number(o.yoshiN) || 0) > 0 || (Number(o.waitN) || 0) > 0 || (Number(o.stepTotal) || 0) > (Number(o.stepDone) || 0) || !!uraBusyText(o.ura || null, o.detail) || stat === '作業中' || stat === '検査中' || /^止まり/.test(stat) || stat === '動きなし' || stat === 'ヨシ待ち';
  }
  function headText(o) {
    o = o || {};
    var stat = String(o.stat || ''), lost = !!o.lost, running = isRunning(stat, lost);
    if ((o.resting || o.checking) && (stat === '待ち' || stat === '') && !lost && !workLeft(o)) { return REST_TEXT; }   /* 枠 三百二十六（v263）：『休憩中』（寝ている猫）は、表の仕事の段・裏方・順番待ち・ヨシ待ちが全部無い時だけ */   /* 枠 三百十四：窓が待ちの時（寝ている猫）は、記録が5分途切れて『確認中』の時も『休憩中』（接続不良は残す） */   /* 枠 三百五：最後の合図が idle_prompt で窓が生きていて枠0件なら、記録が古くても『休憩中』（確認中・接続不良にしない） */
    if (!lost && o.checking) { return CHECKING_TEXT; }   /* v256（枠 二百八十七）：記録が5分途切れたら『確認中』（15分戻らない時だけ下の『接続不良』） */
    if (lost) { return LOST_TEXT; }   /* v251（枠 二百七十二）：見張りの記録が3分途切れたら、作業中・ヨシ待ちより上に接続不良（凍った『作業中』を出し続けない） */
    if (/^止まり/.test(stat)) { return '止まり'; }
    if (stat === '動きなし') { return '動きなし'; }
    if ((Number(o.yoshiN) || 0) > 0) { return YOSHI_TEXT; }   /* v250（枠 二百七十一）：順は ヨシ待ち＞作業中＞まとめて写す＞待機中＞接続不良。ヨシ待ちが一件でもあれば、作業中でもヨシ待ち */
    if (stat === '検査中') { return CHECK_TEXT; }
    if (stat === '待ち') { var ub = uraBusyText(o.ura || null, o.detail); return ub || (workLeft(o) ? WAIT_TEXT : REST_TEXT); }   /* 枠 三百十四：待ちの時の字は『待機中』でなく『休憩中』（brief.txt の head も同じ） */
    if (stat === '作業中') { return WORK_TEXT; }
    if (running && /^検査中：/.test(String(o.cloud || ''))) { return CHECK_TEXT; }
    if (running) { return WORK_TEXT; }
    if (stat === 'ヨシ待ち') { return YOSHI_TEXT; }
    if (cardsPending(o)) { return cardPendText(o); }
    if (kumoEtaSec(o.kumo, o.now) > 0) { return POINT_TEXT; }
    if ((Number(o.left) || 0) > 0) { return POINT_TEXT; }
    if (lost) { return LOST_TEXT; }
    return workLeft(o) ? WAIT_TEXT : REST_TEXT;   /* 枠 三百二十六（v263）：仕事が残るのに休憩中と出さない */
  }

  /* 枠 三百二十六（v263）：頭の猫の絵を、頭の字と同じ判定から決める。'sleep'＝寝ている猫（休憩中・接続不良）／'green'＝緑の服の猫（確認中・待機中＝仕事が残っている）／''＝ほかの絵は今までの順（作業中のコマ送り・指差し・ヨシ待ち） */
  function headCat(o) {
    var t = headText(o);
    return (t === REST_TEXT || t === LOST_TEXT) ? 'sleep' : ((t === CHECKING_TEXT || t === WAIT_TEXT) ? 'green' : '');
  }

  /* 枠の番号を字から外す（枠 三百七十五）。「次の仕事が3件」のような数は残す（件・本・個・つ・通が続く物は枠の番号と見ない）。 */
  function noFrame(s) {
    return String(s == null ? '' : s)
      .replace(/(?:橋の)?枠[ 　]*[#＃]?[一二三四五六七八九十百千〇零0-9０-９]+(?:[・、〜～-][一二三四五六七八九十百千〇零0-9０-９]+)*(?![一二三四五六七八九十百千〇零0-9０-９件本個つ通覧])(?:番)?(?:[ 　]*[：:]|の|で)?/g, '')
      .replace(/（[ 　・、]*）|\([ 　・、]*\)|「[ 　]*」/g, '')
      .replace(/[ 　]{2,}/g, ' ')
      .replace(/^[ 　：:、。・]+/, '').trim();
  }

  /* 枠 三百三十八（v267）：頭の字（猫の横）は状態の短い字でなく詳しい文。枠 三百八十九（v278）：普通の丁寧な言葉（三百七十五の猫の口ぶりはやめた・伝える中身は同じ）・枠の番号は出さない・何をしているか／なぜか・いつ終わるか・本人がする事。色は g＝緑（何もしなくてよい）・y＝黄（見ておく）・r＝赤（手が要る）。
     ＊元の判定は headText（状態の短い字）のまま使い、その字から場面を決める（絵の headCat・panelView の head と同じ一つの判定）。
     ＊「何をしているか・なぜか」は o.nya（窓が控えの「ねこ:」の行に平たい言葉で書き、panelView.nya で届く）。無ければ場面ごとの決まった一文。作業中・雲の検査・待ちの場面だけで使う。
     ＊終わる刻はある欄からだけ出す：o.endSec（今の仕事の見込みの終わり・秒）か o.etaMin（あと分）か雲の一行の「見込み HH:MM」（kumo）。どれも無ければ刻は書かない。
     ＊返すのは {t, c}。元の字は headText で取れる（検査・様子を写す・brief.txt はそちらを読む）。 */
  function headAct(o) {
    o = o || {};
    var lab = headText(o), n = function (v) { return Number(v) || 0; }, now = n(o.now);
    var hm = function (sec) { var d = new Date(sec * 1000); return d.getHours() + '時' + ('0' + d.getMinutes()).slice(-2) + '分'; };
    var cloudEnd = kumoEtaSec(o.kumo, o.now);
    var jobEnd = n(o.endSec) > now ? n(o.endSec) : (n(o.etaMin) > 0 && now > 0 ? now + n(o.etaMin) * 60 : 0);
    var nya = noFrame(o.nya).replace(/にゃ[ーぁ]*(?=[ 　。．.、！!？?」』）)]|$)/g, '').replace(/[ 　。．.！!]+$/, '');   /* v278（枠 三百八十九）：普通の言葉。控えに前の口ぶりが残っていても、文末の語尾は落とす */
    var say = function (dflt) { return nya || dflt; };
    var wait = function (dflt, end) { return say(dflt) + '。' + (end > 0 ? hm(end) + 'ごろ終わる見込みです。' : '') + '今は何もしなくて大丈夫です'; };
    var stepsLeft = n(o.stepTotal) > n(o.stepDone);
    if (lab === REST_TEXT) { return { t: 'いまは休憩中です。残っている仕事は無いので、次の枠を送れます', c: 'g' }; }
    if (lab === LOST_TEXT) { return { t: 'VAIOの記録が届いていません。VAIOの電源と網を確認してください', c: 'r' }; }
    if (lab === YOSHI_TEXT) { return { t: 'ヨシの返事を' + Math.max(1, n(o.yoshiN)) + '件待っています。問いを読んで、Codeタブでヨシを返してください', c: 'r' }; }
    if (lab === CHECKING_TEXT) { return { t: 'VAIOの記録が少し途切れています。戻るかどうか見ておいてください', c: 'y' }; }
    if (/^止まり/.test(lab) || lab === '動きなし') {
      var what = lab === '動きなし' ? '窓が動いていません' : '窓が止まっています';
      return stepsLeft ? { t: '仕事の段が残っているのに' + what + '。Codeタブに一言打ってください', c: 'r' } : { t: what + '。残りの段は無いので、様子だけ見ておいてください', c: 'y' };
    }
    if (lab === CHECK_TEXT) { return { t: wait('直した物を雲で検査しています', cloudEnd || jobEnd), c: 'g' }; }
    if (lab === WORK_TEXT) {
      if (cloudEnd > 0 && !(jobEnd > 0)) { return { t: wait('雲の結果を待っています', cloudEnd), c: 'g' }; }
      return { t: wait('頼まれた仕事を進めています', jobEnd), c: 'g' };
    }
    if (lab === POINT_TEXT) { return { t: '写していない札が' + (n(o.left) > 0 ? n(o.left) + '件' : '') + 'あります。まとめて写せるので見ておいてください' + (cloudEnd > 0 ? '。雲の結果は' + hm(cloudEnd) + 'ごろ出ます' : ''), c: 'y' }; }
    if (/^札が遅れている/.test(lab)) { return { t: '札が出るのが遅れています。様子を見ておいてください', c: 'r' }; }
    if (/^札まとめ中/.test(lab)) { return { t: '済んだ仕事の札をまとめています。' + (cloudEnd > 0 ? hm(cloudEnd) + 'ごろ出ます。' : '') + '札が出たら見ておいてください', c: 'y' }; }
    if (/^裏方作業中/.test(lab)) { return { t: wait('裏方が手分けして働いています', cloudEnd), c: 'g' }; }
    if (lab === WAIT_TEXT) { return { t: wait(n(o.waitN) > 0 ? '次の仕事が' + n(o.waitN) + '件、順番を待っています' : '仕事の続きが残っています', cloudEnd), c: 'g' }; }
    return { t: '様子を見ておいてください', c: 'y' };
  }

  /* ---- 段（v212・本人の枠 七十七）：段の数・今の段は state.json の生の段（steps＝{job, rows:[{k, t}]}・見張りが job-steps.txt から写す）から毎回数える ----
     k は ' '（まだ）・'x'（済み）・'雲'（雲待ち）・'決'（ヨシ待ち）。済みは 'x' だけ（state-decide.js の readSteps・decide と同じ数え方）。
     返す物：{ from: 'rows'|'old', job, total, done, now（最初の未済の段の字）, nowK（その k）, last（最後の済みの段の字）, next（二つ目の未済の段の字） }。
     生の段が無い古い state.json は、今までの欄（stepTotal・stepDone・sNow・sDone・sNext）へ落ちる（from: 'old'）。 */
  function stepsOf(o) {
    o = o || {}; var s = function (v) { return String(v == null ? '' : v); };
    var S = (o.steps && typeof o.steps === 'object') ? o.steps : null, r = (S && Array.isArray(S.rows)) ? S.rows : null;
    if (!r) { return { from: 'old', job: '', total: Math.max(0, Number(o.stepTotal) || 0), done: Math.max(0, Number(o.stepDone) || 0), now: s(o.sNow).trim(), nowK: '', last: s(o.sDone).trim(), next: s(o.sNext).trim() }; }
    var rows = r.filter(function (x) { return x && typeof x === 'object'; });
    var pend = rows.filter(function (x) { return s(x.k) !== 'x'; }), dn = rows.filter(function (x) { return s(x.k) === 'x'; });
    return { from: 'rows', job: s(S.job).trim(), total: rows.length, done: dn.length, now: pend[0] ? s(pend[0].t).trim() : '', nowK: pend[0] ? s(pend[0].k) : '', last: dn.length ? s(dn[dn.length - 1].t).trim() : '', next: pend[1] ? s(pend[1].t).trim() : '' };
  }
  /* 公開の版の一行（v212・本人の枠 七十七）：state.json の pubVer（見張りが compare-dest.js の控えから運ぶ・公開の panel-ver.txt の実物）。
     段の字（「v208 を公開し直す」）からは読まない。o＝{ pubVer, pubVerAt（その版を初めて見た刻）, coreVer（手元の部品の版） }。pubVer が無ければ空 */
  function pubLine(o) {
    o = o || {}; var v = String(o.pubVer == null ? '' : o.pubVer).trim(), at = Number(o.pubVerAt) || 0, cv = String(o.coreVer == null ? '' : o.coreVer).trim();
    if (!v) { return ''; }
    var hm = function (sec) { var d = new Date((Number(sec) + 9 * 3600) * 1000); return ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2); };
    return '公開のパネル：v' + v + (at > 0 ? '（' + hm(at) + ' から）' : '') + ((cv && cv !== v) ? '・手元の部品は v' + cv + '（まだ公開されていない）' : '');
  }

  /* ---- 表の仕事と裏方の字（様子を写す・state.json の panelView） ---- */
  /* 表の仕事の行（v202）。刻は日本の時計。「何分前」は出さない。段は stepsOf（v212） */
  function omoteLines(o) {
    o = o || {}; var s = function (v) { return String(v == null ? '' : v); };
    var hm = function (sec) { var d = new Date((Number(sec) + 9 * 3600) * 1000); return ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2); };
    var subj = s(o.subj).trim(), stat = s(o.stat).trim(), st = Number(o.startedAt) || 0;
    var fm = subj.match(/(?:橋の)?枠[ 　]*[一二三四五六七八九十百〇零0-9A-Za-z]+/);
    var so = stepsOf(o), tot = so.total, dn = so.done, now = so.now;
    return ['表の仕事：' + (subj || 'なし') + (stat ? '（' + stat + '）' : ''),
      '枠：' + (fm ? fm[0] : '件名に枠の番号なし'),
      '段：' + ((now && tot > 0) ? (Math.min(tot, dn + 1) + '/' + tot + '　' + now) : 'なし'),
      '始まり：' + (st > 0 ? hm(st) : '不明')];
  }
  /* 表と裏方の「全部終わる見込み」の一行（v203）。E＝{omote, ura}（endat.js が組む） */
  function endLine(E, k) {
    var s = function (v) { return String(v == null ? '' : v); }, nm = (k === 'ura') ? '裏方' : '表の仕事', x = (E && typeof E === 'object') ? E[k] : null;
    if (!x || typeof x !== 'object' || !('endAt' in x)) { return nm + 'の全部終わる見込み：state.json に載っていない'; }
    return nm + 'の全部終わる見込み：' + (s(x.endAt) || ((k === 'ura') ? 'なし（動いている物が無い）' : 'なし（残りの仕事が無い）')) + (x.src ? '（' + s(x.src) + '）' : '');
  }
  /* 裏方の行（v202）。刻は state.json の値のまま */
  function uraLines(U) {
    if (!U || typeof U !== 'object') { return ['裏方：state.json に載っていない']; }
    var o = [], S = U.sub || {}, C = U.cloud || {}, a = function (x) { return Array.isArray(x) ? x : []; }, s = function (v) { return String(v == null ? '' : v); };
    var it = a(S.items);
    if (it.length) { it.forEach(function (x) { o.push('下請け 動作中：' + s(x.start) + '〜　' + s(x.desc) + (x.type ? '（' + s(x.type) + '）' : '')); }); } else { o.push('下請け：動いていない'); }
    a(S.recent).forEach(function (x) { o.push('下請け ' + (s(x.state) || '済') + '：' + s(x.start) + '〜' + s(x.end) + '　' + s(x.desc)); });
    var rn = a(C.running);
    if (rn.length) { rn.forEach(function (x) { o.push('雲 ' + (s(x.state) || '走行中') + '：' + s(x.at) + '〜　' + s(x.name) + ((x.title && x.title !== x.name) ? '「' + s(x.title) + '」' : '')); }); } else { o.push('雲：走っていない'); }
    a(C.recent).forEach(function (x) { o.push('雲 ' + (s(x.state) || '済') + '：' + s(x.at) + '〜' + s(x.upd) + '　' + s(x.name) + (x.failStep ? '（落ちた段：' + s(x.failStep) + '）' : '')); });
    return o;
  }

  /* ---- 箱とゲージ ---- */
  /* 箱の一行（v204）：「全部終わる見込み HH:MM」だけ。刻が無ければ空 */
  function endShort(E, k) {
    var x = (E && typeof E === 'object') ? E[k] : null;
    return (x && typeof x === 'object' && x.endAt) ? ('全部終わる見込み ' + String(x.endAt)) : '';
  }
  /* 裏方のゲージの数（v204）。done＝直近に終わった分・run＝動いている分 */
  function uraCount(U) {
    var a = function (x) { return Array.isArray(x) ? x : []; }; U = (U && typeof U === 'object') ? U : {};
    var S = U.sub || {}, C = U.cloud || {};
    return { run: a(S.items).length + a(C.running).length, done: a(S.recent).length + a(C.recent).length };
  }
  /* 区切りの無い古い state の時の裏方のゲージ（v204）。動いている物も刻も無ければ null */
  function uraGauge(U, E) {
    var c = uraCount(U), end = endShort(E, 'ura');
    if (!(c.run > 0 || end)) { return null; }
    return { done: c.done, run: c.run, total: c.done + c.run, lab: c.done + '/' + (c.done + c.run), end: end };
  }
  /* 手順のゲージの横の小さい字「今の番号/全体」（v185） */
  function stepLab(done, total) { var n = Math.max(1, total | 0), d = Math.max(0, Math.min(n, done | 0)); return Math.min(n, d + 1) + '/' + n; }
  /* 表の仕事のゲージの字（今やる段があり、段の台帳がある時だけ・無ければ空） */
  function omoteGauge(sNow, done, total) { return (String(sNow || '').trim() && (Number(total) || 0) > 0) ? stepLab(Number(done) || 0, Number(total) || 0) : ''; }
  /* v280（枠 三百九十四）：件名の「枠」のすぐ後の漢数字だけを、百・十の位を足し上げて普通の数字にする（三百七十七→377・百十五→115・二十→20）。位の字が無い並び（三九四）は一字ずつ。件名の他の漢数字は触らない */
  function wakuNum(t) {
    return String(t == null ? '' : t).replace(/(枠[ 　]*)([〇零一二三四五六七八九十百千]+)(?![〇零一二三四五六七八九十百千覧つ本件個枚周番])/g, function (m, head, k) {
      var D = { '〇': 0, '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 }, U = { '十': 10, '百': 100, '千': 1000 };
      if (!/[十百千]/.test(k)) { return head + k.split('').map(function (c) { return D[c]; }).join(''); }
      var sum = 0, d = 0;
      k.split('').forEach(function (c) { if (U[c]) { sum += (d || 1) * U[c]; d = 0; } else { d = D[c]; } });
      return head + (sum + d);
    });
  }
  /* ゲージの箱（全部／表の仕事／裏方）の中身（v205・v207）。E＝{omote, ura, all}（区切り seg は endat.js の束）・U＝state.json の ura。区切りが無い古い state は null */
  function boxSpec(E, U, k) {
    var s = function (v) { return String(v == null ? '' : v); }, x = (E && typeof E === 'object') ? E[k] : null;
    if (!x || typeof x !== 'object' || !x.seg || typeof x.seg !== 'object') { return null; }
    var tot = Math.max(0, Number(x.seg.total) | 0), dn = Math.max(0, Math.min(tot, Number(x.seg.done) | 0)), run = Math.max(0, Math.min(tot - dn, Number(x.seg.run) | 0));
    var cut = function (t, n) { t = s(t).split(String.fromCharCode(10)).join(' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
    var left = function (y) { var g = (y && y.seg) || {}; return Math.max(0, (Number(g.total) | 0) - (Number(g.done) | 0)); };
    var a = function (v) { return Array.isArray(v) ? v : []; }, Uo = (U && typeof U === 'object') ? U : {}, So = Uo.sub || {}, Co = Uo.cloud || {};
    var ug = (E.ura && E.ura.seg) || {}, uT = Math.max(0, Number(ug.total) | 0), uD = Math.max(0, Math.min(uT, Number(ug.done) | 0));
    var now = '';
    if (k === 'omote') { var c = x.cur || {}, w = x.wait || {}; now = c.job ? cut(wakuNum(c.job), 30) : (Number(w.n) > 0 ? '順番待ち ' + Number(w.n) + '件' : ''); }
    else if (k === 'ura') { var o = []; a(So.items).forEach(function (y) { o.push('下請け・' + (s(y.desc) || '名なし')); }); a(Co.running).forEach(function (y) { o.push('雲・' + (s(y.name) || '名なし')); }); now = cut(o.join('、'), 40); }
    else { now = '表の仕事 残り' + left(E.omote) + '・裏方 残り' + (uT - uD); }
    return { k: (k === 'all') ? '全部' : ((k === 'ura') ? '裏方' : '表の仕事'), done: dn, run: run, total: tot, now: now, endSec: Number(x.endSec) || 0, endAt: s(x.endAt), over: !!x.over, unk: Number(x.unknown) > 0, lab: (k === 'ura') ? (dn + '/' + tot) : '' };
  }
  /* 今の仕事の見込みの終わり（v213・本人の枠 八十三・作法25 の裁定）：数える所はここ一つ。
     終わり＝見込みを書いた刻（state.json の mikomiAt・書き手は見張りの Publish-Status 一人）＋見込みの分。
     o＝{ mikomi（「40分」など）, mikomiAt（epoch 秒）, startedAt, curEnd（endat.js の omote.cur.endSec＝増えた段の分も足した刻。有ればこれ） }。
     ＊見込み（分の数）が無ければ 0（終わりを出さない）。mikomiAt が載っていない古い state だけ startedAt から数える（mikomiAt が 0 と載っていれば 0）。
     ＊開始（startedAt）は「いつから動いているか」の元で、見込みの数えには使わない。 */
  function mikomiEnd(o) {
    o = o || {}; var m = String(o.mikomi == null ? '' : o.mikomi).match(/([0-9]+)/), min = m ? parseInt(m[1], 10) : 0;
    if (!(min > 0)) { return 0; }
    if (Number(o.curEnd) > 0) { return Number(o.curEnd); }
    var has = (o.mikomiAt !== undefined && o.mikomiAt !== null && o.mikomiAt !== ''), at = has ? (Number(o.mikomiAt) || 0) : (Number(o.startedAt) || 0);
    return at > 0 ? at + min * 60 : 0;
  }
  /* 今の仕事の見込みを過ぎたか（v180・v213：終わりは mikomiEnd）。表の仕事と全部の箱の頭を赤にする。mikomiAt・curEnd は v213 で足した（無ければ古い state として startedAt から） */
  function workLate(stat, startedAt, mikomi, now, mikomiAt, curEnd) {
    var e = mikomiEnd({ mikomi: mikomi, mikomiAt: mikomiAt, startedAt: startedAt, curEnd: curEnd });
    return String(stat || '') === '作業中' && e > 0 && e <= (Number(now) || 0);
  }
  /* 箱の頭（名の右）の「あと N分（HH:MM ごろ）」（v206）。v213（本人の枠 八十四）：記録の無い雲が走っていて刻が出ない箱（b.unk）は「見込み不明」を赤にせず出す */
  function headEta(b, nowS, late) {
    var e = (b && b.endSec > 0) ? b.endSec : 0, left = b ? Math.max(0, (b.total | 0) - (b.done | 0)) : 0;
    if (e > nowS) { return { t: 'あと ' + Math.ceil((e - nowS) / 60) + '分（' + pad2s(e) + ' ごろ）', c: (b.over || late) ? 'bad' : 'eta' }; }
    if (e > 0 && left > 0) { return { t: '見込みを過ぎた ' + Math.floor((nowS - e) / 60) + '分', c: 'bad' }; }
    if (left > 0 && b && b.unk) { return { t: '見込み不明', c: 'eta' }; }
    if (left > 0) { return { t: 'あと 未定', c: 'eta' }; }   /* 残りがあるのに刻がまだ無い */
    return { t: 'あと 0分', c: 'eta' };
  }
  /* 箱の終わりの一行（v205）。刻が無ければ null */
  function etaRow(b, nowS, late) {
    if (!b || !(b.endSec > 0)) { return null; }
    if (b.endSec > nowS) { return { t: '全部終わる見込み ' + pad2s(b.endSec) + '（あと' + Math.ceil((b.endSec - nowS) / 60) + '分）', c: (b.over || late) ? 'bad' : 'eta' }; }
    return { t: '見込みを過ぎた ' + Math.floor((nowS - b.endSec) / 60) + '分', c: 'bad' };
  }

  /* v278（枠 三百七十六）：直しの輪の一行。材料は fix-loop.json（輪の札を書く時に書き替える一つの元）{rounds:周, before:回す前の件数, after:残りの件数} */
  function loopLine(L) {
    var n = function (x) { return (typeof x === 'number' && x >= 0 && Math.floor(x) === x) ? x : -1; };
    if (!L || typeof L !== 'object' || n(L.rounds) < 1 || n(L.before) < 0 || n(L.after) < 0) { return '直しの輪：まだ'; }
    return L.after > 0 ? ('直しの輪：残り' + L.after + '件') : ('直しの輪：' + L.rounds + '周で' + L.before + '件→0件');
  }

  return {
    VER: VER, TEXT: { WAIT: WAIT_TEXT, POINT: POINT_TEXT, WORK: WORK_TEXT, LOST: LOST_TEXT, CHECKING: CHECKING_TEXT, REST: REST_TEXT, YOSHI: YOSHI_TEXT, CHECK: CHECK_TEXT },
    senkoEpoch: senkoEpoch, pad2s: pad2s, newestTime: newestTime,
    isCountCard: isCountCard, ntfyOfCard: ntfyOfCard, todoList: todoList, todoLabel: todoLabel,
    cardsPending: cardsPending, cardEtaSec: cardEtaSec, cardLate: cardLate, cardPendText: cardPendText, kumoEtaSec: kumoEtaSec, uraBusyText: uraBusyText, isRunning: isRunning, headText: headText, headCat: headCat, headAct: headAct, noFrame: noFrame, loopLine: loopLine, workLeft: workLeft,
    stepsOf: stepsOf, pubLine: pubLine, omoteLines: omoteLines, endLine: endLine, uraLines: uraLines,
    endShort: endShort, uraCount: uraCount, uraGauge: uraGauge, stepLab: stepLab, omoteGauge: omoteGauge, boxSpec: boxSpec, wakuNum: wakuNum, mikomiEnd: mikomiEnd, workLate: workLate, headEta: headEta, etaRow: etaRow
  };
});
