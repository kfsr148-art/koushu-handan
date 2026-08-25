#!/usr/bin/env node
/* 全画面の写し取り — 第一段
 *
 * 公開ページの koushu-handan.html を Playwright の WebKit で開き、
 * 「いま外から呼べる画面」を1状態1枚の PNG にして shots/ へ置く。
 *
 * 作法6 のとおり、本体には一切手を入れない。写しも作らない。
 * 公開ページをそのまま開き、本体が既に window へ出している入口
 * （closeTitleScreen / advStart / watchOpen / toriOpen / setTone / vzTap …）
 * だけを外から呼ぶ。＊新しい診断口は生やさない（作法15）。
 *
 * 回し方
 *   node shot-all.js                 … 全部撮る
 *   node shot-all.js --only judged   … 名前に judged を含む状態だけ
 *   node shot-all.js --scale 3       … 画素の倍率（既定 2）
 *   node shot-all.js --local         … 公開ページでなく手元のファイルを開く
 *   node shot-all.js --index-only    … 撮らずに shots.json から一覧シートだけ組み直す
 *
 * 撮り終えると shots/shots.json（撮れた／撮れなかったの一覧）と
 * shots/index.html（一覧シート）を組み直す。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const PW_DIR = process.env.PW_DIR || 'C:/Users/user/.claude/tools/pw/node_modules';
let playwright;
try { playwright = require(path.join(PW_DIR, 'playwright')); }
catch (e) {
  console.error('Playwright が見つかりません: ' + PW_DIR);
  console.error('用意する: cd ' + path.dirname(PW_DIR) + ' && npm i playwright && npx playwright install webkit');
  process.exit(2);
}

const ROOT = __dirname;
const OUT  = path.join(ROOT, 'shots');
const argv = process.argv.slice(2);
const arg  = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const has  = k => argv.indexOf(k) >= 0;

/* 日本時刻の刻み。一覧シートに出る「組み直し」の時刻はこれを使う。 */
const stampNow = () =>
  new Date(Date.now() + 9 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' JST';

const SCALE = Number(arg('--scale', 2));
const ONLY  = arg('--only', null);
const BASE  = has('--local')
  ? 'file:///' + path.join(ROOT, 'koushu-handan.html').replace(/\\/g, '/')
  : 'https://kfsr148-art.github.io/koushu-handan/koushu-handan.html';

/* 剣士の足元の線。ミニゲームはここを基準に叩かないと剣が届かない（check.js ⑦ と同じ値）。 */
const FLOOR = (() => {
  try {
    const src = fs.readFileSync(path.join(ROOT, 'koushu-handan.html'), 'utf8');
    return Number((src.match(/floorRatio:\s*([0-9.]+)/) || [])[1] || 0.5);
  } catch (e) { return 0.5; }
})();

/* 13枚（判定が通る手）と14枚（いちばん幅の要る姿）。check.js ⑦ と同じ牌姿を使う。 */
/* 主寸法は横（844x390）。iPhone の論理寸法 390x844 を横に倒した姿で、
   本体が遊べる向き。縦は「回してください」の一枚を撮るためだけに使う。 */
const VIEW_LAND = { width: 844, height: 390 };
const VIEW_PORT = { width: 390, height: 844 };

const HAND13 = '3455m2367p1189s7z';
const HAND14 = '3455m2367p1189s37z';
/* 守りへ振れる牌姿（孤立牌ばかり）と、国士の見える牌姿。
   判定獣は攻めが虎、守りが羊／鼠、国士が見えていれば龍。牌姿でしか出し分けられない。 */
const HAND_DEF = '147m147p258s1357z';
const HAND_KOKUSHI = '19m19p19s1234567z';

const TONE_JA = { butler: '執事', strategist: '軍師', blunt: 'ずんだ', lady: 'お嬢様',
                  french: 'マダム', ichihime: '一姫', sensei: '先生' };
const DIALECT_JA = { miyazaki: '宮崎', hakata: '博多', osaka: '大阪', kyoto: '京都',
                     aomori: '青森', okinawa: '沖縄', bushi: '武士', yoji: '幼児' };
const WATCH_JA = { verdict: '攻守の答え合わせ', cat: '猫牌を数える', eda: '枝豆の的', ai: 'AIの見立て' };

/* ───────── 撮る状態の一覧 ─────────
 * name  … ファイル名になる。状態が分かる名で付ける
 * group … 一覧シートの見出し
 * label … 一覧シートに出す日本語
 * go    … ページの中で走らせる段取り（async）。ここで画面を開く
 * wait  … go のあと、写す前に置く間（ms）
 */
const SHOTS = [
  /* 本体は縦向きでは遊べない。iPhone の論理寸法をそのまま縦（390x844）で開くと、
     「お客様、画面を横にお回しくださいませ」の一枚しか出ない。これも辿り着ける画面
     なので一枚として残し、以降は同じ寸法を横に倒した 844x390 で撮る。 */
  { name: '00-portrait-rotate', group: '入口', label: '縦向き — 画面を横にお回しくださいませ',
    portrait: true, go: async p => {}, wait: 900 },

  { name: '01-title', group: '入口', label: 'タイトル',
    go: async p => {}, wait: 900 },

  { name: '02-info-list', group: '入口', label: '案内の一覧',
    go: async p => p.evaluate(() => window.openInfoList()), wait: 600 },

  { name: '03-info-engine', group: '入口', label: '案内 — このツール、何がすごいの？',
    go: async p => p.evaluate(() => { window.openInfoList(); window.openInfoDetail('engine'); }), wait: 600 },

  { name: '04-board-empty', group: '盤面', label: '盤面（牌を入れる前）',
    go: async p => p.evaluate(() => window.closeTitleScreen()), wait: 600 },

  { name: '05-board-14', group: '盤面', label: '盤面（14枚を並べた姿）',
    go: async p => p.evaluate(h => { window.closeTitleScreen(); window.setHand(h); }, HAND14), wait: 700 },

  { name: '06-judged', group: '判定後', label: '判定の結果（既定＝執事）',
    go: async p => judge(p), wait: 900 },

  ...Object.keys(TONE_JA).map((t, i) => ({
    name: '07-' + String(i + 1) + '-tone-' + t,
    group: '判定後（人柄七人）',
    label: '人柄 — ' + TONE_JA[t],
    go: async p => {
      await judge(p);
      await p.evaluate(tn => {
        window.setTone(tn);
        if (!document.body.classList.contains('tone-' + tn)) window.setTone(tn);
      }, t);
    },
    wait: 700,
  })),

  ...[['cat', '現場猫'], ['eda', '枝豆'], ['om', '紳士'], ['usagi', '兎']].map(([k, ja], i) => ({
    name: '08-' + String(i + 1) + '-tool-' + k,
    group: '判定後（スイッチ四者）',
    label: '道具 — ' + ja,
    go: async p => { await judge(p); await p.evaluate(kk => window.vzTap(kk), k); },
    wait: 700,
  })),

  ...Object.keys(DIALECT_JA).map((d, i) => ({
    name: '09-' + String(i + 1) + '-dialect-' + d,
    group: '判定後（お国訛り八種）',
    label: '訛り — ' + DIALECT_JA[d],
    go: async p => { await judge(p); await p.evaluate(dd => window.setDialect(dd), d); },
    wait: 700,
  })),

  { name: '10-judged-defend', group: '判定後', label: '守りの判定（羊／鼠）',
    go: async p => judge(p, HAND_DEF), wait: 900 },

  { name: '11-judged-kokushi', group: '判定後', label: '国士が見えている判定（役満手前＝鳥）',
    go: async p => judge(p, HAND_KOKUSHI), wait: 900 },

  { name: '12-mascot', group: '判定後', label: '判定獣が述べる（虎・羊・鼠）',
    go: async p => { await judge(p); await p.evaluate(() => window.mascotTap()); }, wait: 700 },

  { name: '13-cat-room', group: 'その他の間', label: '猫部屋（設定）',
    go: async p => p.evaluate(() => { window.closeTitleScreen(); window.catRoomOpen(); }), wait: 700 },

  ...Object.keys(WATCH_JA).map((m, i) => ({
    name: '14-' + String(i + 1) + '-watch-' + m,
    group: '見張り台',
    label: '見張り台 — ' + WATCH_JA[m],
    go: async p => p.evaluate(mm => {
      window.closeTitleScreen(); window.watchOpen(); window.watchSetMode(mm);
    }, m),
    wait: 900,
  })),

  { name: '15-watch-guide', group: '見張り台', label: '見張り台の手引き',
    go: async p => p.evaluate(() => { window.closeTitleScreen(); window.watchOpen(); window.watchGuide(); }), wait: 800 },

  { name: '16-adv-start', group: '探偵編', label: '探偵編 — 乗船の幕',
    go: async p => p.evaluate(() => { window.closeTitleScreen(); window.advStart(); }), wait: 1000 },

  { name: '17-adv-room', group: '探偵編', label: '探偵編 — 猫室（部屋に入った姿）',
    go: async p => p.evaluate(() => window.advRoom()), wait: 1100 },

  { name: '18-tori-menu', group: 'ミニゲーム', label: '一索の鳥 — 品書き',
    go: async p => p.evaluate(() => { window.closeTitleScreen(); window.toriOpen(); }), wait: 800 },

  ...[['easy', '初級（同時2羽・ノルマ3羽）'], ['hard', '上級（同時4羽・ノルマ7羽）'],
      ['endless', '連戦（同時4羽・ノルマなし）']].map(([k, ja], i) => ({
    name: '19-' + String(i + 1) + '-tori-play-' + k,
    group: 'ミニゲーム',
    label: '一索の鳥 — 遊んでいる最中 ' + ja,
    go: async p => p.evaluate(kk => {
      window.closeTitleScreen(); window.toriOpen(); window.toriStart(kk);
    }, k),
    wait: 2200,
  })),

  { name: '20-tori-end', group: 'ミニゲーム', label: '一索の鳥 — 結果の絵（負け「逃げられた」）',
    go: async p => {
      await p.evaluate(() => { window.closeTitleScreen(); window.toriOpen(); window.toriStart('easy'); });
      await p.evaluate(f => window.toriSweep(f), FLOOR);
    }, wait: 900 },

  { name: '21-misdiag', group: 'その他の間', label: '誤診記録',
    go: async p => p.evaluate(() => { window.closeTitleScreen(); window.misdiagOpen(); }), wait: 800 },

  { name: '22-haipai-ledger', group: 'その他の間', label: '配牌帳',
    go: async p => p.evaluate(() => { window.closeTitleScreen(); window.haipaiLedgerOpen(); }), wait: 800 },

  /* reader.html は本体とは別のページ。「読取」から跳ぶ先で、外から開ける。
     本体の中の写真読み取りの盤面（ssShow）は window.ssImg＝実際の写真が要るため、
     第一段では出せない（第二段で写真を与える口を掘る）。 */
  { name: '23-reader-page', group: 'その他の間', label: '読み取りページ（reader.html・別ページ）',
    url: 'https://kfsr148-art.github.io/koushu-handan/reader.html',
    go: async p => {}, wait: 800 },
];

/* ───────── ページの中へ置く手 ─────────
 * 本体には残さない。開くたびに addInitScript で入れ、そのページ限りで消える。
 * ここで足すのは「押す段取り」だけで、本体の内部は覗かない（作法15）。 */
const HELPERS = String.raw`
window.setHand = function(v){
  var f = document.getElementById('qiText');
  if(!f) throw new Error('qiText が無い');
  f.value = v; f.dispatchEvent(new Event('input', { bubbles: true }));
};
/* 探偵編の部屋まで開く。乗船の幕を送り、難易度を選び、廊下から猫室へ入る。
   16号室と14号室は罠が待っているので使わない（check.js ⑦ と同じ道順）。 */
window.advRoom = function(){
  window.closeTitleScreen(); window.advStart();
  var deck = document.getElementById('advDeck');
  var pick = function(box, label){
    var out = null;
    [].slice.call(box.querySelectorAll('button')).forEach(function(b){
      if(!out && (b.textContent || '').indexOf(label) === 0) out = b;
    });
    return out;
  };
  for(var i = 0; i < 5; i++){ var n = pick(deck.children[3], '次へ'); if(n) n.click(); }
  var d = pick(deck.children[1], '初歩'); if(d) d.click();
  var r = pick(deck.children[2], '猫室'); if(r) r.click();
};
/* 結果の絵まで進める。鳥は逃げるので狙い撃ちは当てにならない。
   剣士の足元の線を基準に、届く範囲にいる一羽の方角へ振り続ける（check.js ⑦ と同じ手）。 */
window.toriSweep = function(floor){
  return new Promise(function(resolve){
    var n = 0;
    (function step(){
      var root  = document.getElementById('toriRoot');
      var panel = document.getElementById('toriPanel');
      var done  = panel && /捕まえた|逃げられた/.test(panel.textContent || '');
      if(done || n++ > 450 || !root){ setTimeout(resolve, 300); return; }
      var cx = window.innerWidth / 2, cy = window.innerHeight * floor;
      var reach = Math.min(window.innerWidth, window.innerHeight) * 0.35;
      var near = null, nearD = reach * 0.9;
      [].forEach.call(document.querySelectorAll('.tori-bird'), function(b){
        var r = b.getBoundingClientRect();
        var bx = (r.left + r.right) / 2, by = (r.top + r.bottom) / 2;
        var d = Math.hypot(bx - cx, by - cy);
        if(d < nearD){ nearD = d; near = [bx, by]; }
      });
      if(near){
        var a = Math.atan2(near[1] - cy, near[0] - cx);
        var x = cx + Math.cos(a) * reach * 0.5, y = cy + Math.sin(a) * reach * 0.5;
        root.dispatchEvent(new MouseEvent('mousedown', { clientX: x, clientY: y, bubbles: true }));
        window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        try{
          var t = new Touch({ identifier: 1, target: root, clientX: x, clientY: y });
          root.dispatchEvent(new TouchEvent('touchstart', { changedTouches: [t], bubbles: true, cancelable: true }));
        }catch(e){}
      }
      setTimeout(step, 80);
    })();
  });
};
`;

/* 判定後の画面まで進める。13枚を入れて判定ボタンを押す。
   14枚だと多牌で判定ボタンが押せず、カードが出ないまま写すことになる。 */
async function judge(p, hand) {
  await p.evaluate(h => { window.closeTitleScreen(); window.setHand(h); }, hand || HAND13);
  await p.waitForTimeout(350);
  await p.click('#judgeBtn');
  await p.waitForSelector('.verdict-card', { timeout: 8000 });
}

/* ───────── 一覧シート ───────── */
function buildIndex(rows, stamp) {
  const okRows = rows.filter(r => r.ok);
  const ngRows = rows.filter(r => !r.ok);
  const groups = [];
  okRows.forEach(r => {
    let g = groups.find(x => x.name === r.group);
    if (!g) groups.push(g = { name: r.group, items: [] });
    g.items.push(r);
  });
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<!DOCTYPE html>\n' +
'<html lang="ja">\n' +
'<head>\n' +
'<meta charset="utf-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
'<title>写し取り一覧 — 配牌攻守判定</title>\n' +
'<style>\n' +
'  :root { color-scheme: dark; --bg:#0d1b16; --fg:#e8f2ec; --dim:#8fa89c; --line:#24463a; --jade:#3fbf8f; }\n' +
'  * { box-sizing: border-box; }\n' +
'  body { margin:0; background:var(--bg); color:var(--fg); line-height:1.7;\n' +
'         font-family:system-ui,-apple-system,"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif; }\n' +
'  header { padding:20px 16px 12px; border-bottom:1px solid var(--line); }\n' +
'  h1 { margin:0 0 6px; font-size:20px; }\n' +
'  .meta { color:var(--dim); font-size:13px; }\n' +
'  h2 { margin:28px 16px 10px; font-size:16px; color:var(--jade);\n' +
'       border-left:4px solid var(--jade); padding-left:10px; }\n' +
'  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; padding:0 16px; }\n' +
'  figure { margin:0; }\n' +
'  figure a { display:block; border:1px solid var(--line); border-radius:10px; overflow:hidden; background:#000; }\n' +
'  figure img { display:block; width:100%; height:auto; }\n' +
'  figcaption { font-size:12px; color:var(--dim); padding:6px 2px 0; word-break:break-word; }\n' +
'  figcaption b { display:block; color:var(--fg); font-size:13px; font-weight:600; }\n' +
'  .miss { margin:0 16px; padding:12px 14px; border:1px solid #6b3b3b; border-radius:10px; background:#241618; }\n' +
'  .miss li { font-size:13px; }\n' +
'  footer { color:var(--dim); font-size:12px; padding:28px 16px 40px; }\n' +
'  code { background:rgba(22,48,39,.6); padding:1px 5px; border-radius:4px; font-size:12px; }\n' +
'</style>\n' +
'</head>\n' +
'<body>\n' +
'<header>\n' +
'  <h1>写し取り一覧 — 配牌攻守判定</h1>\n' +
'  <div class="meta">\n' +
'    WebKit ／ iPhone の論理寸法 <b>390×844</b>（本体は横向き専用のため <b>844×390</b> で撮影）\n' +
'    ／ 画素の倍率 <b>' + SCALE + '倍</b><br>\n' +
'    撮れた <b>' + okRows.length + '</b> 枚' +
       (ngRows.length ? ' ／ 撮れなかった <b>' + ngRows.length + '</b> 件' : '') +
'    ・組み直し <b>' + esc(stamp) + '</b>\n' +
'  </div>\n' +
'</header>\n' +
groups.map(g =>
'<h2>' + esc(g.name) + '</h2>\n' +
'<div class="grid">\n' +
g.items.map(r =>
'  <figure>\n' +
'    <a href="' + r.file + '" target="_blank" rel="noopener"><img src="' + r.file + '" alt="' + esc(r.label) + '" loading="lazy"></a>\n' +
'    <figcaption><b>' + esc(r.label) + '</b><code>' + r.file + '</code> <code>' + esc(r.view || '') + '</code></figcaption>\n' +
'  </figure>').join('\n') + '\n' +
'</div>').join('\n') + '\n' +
(ngRows.length ?
'<h2>撮れなかったもの</h2>\n' +
'<div class="miss"><ul>\n' +
ngRows.map(r =>
'  <li><b>' + esc(r.label) + '</b>（<code>' + esc(r.name) + '</code>）— ' + esc(r.err) + '</li>').join('\n') + '\n' +
'</ul></div>\n' : '') +
'<footer>\n' +
'  この一覧は <code>node shot-all.js</code> が組み直します。手で書き換えないでください。<br>\n' +
'  第一段は「いま外から呼べる画面」だけです。探偵編の各場やミニゲームの途中の姿は、\n' +
'  第二段（遷移口を掘る工事）に回しています。\n' +
'</footer>\n' +
'</body>\n' +
'</html>\n';
}

/* ───────── 本体 ───────── */
(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  /* --index-only は撮らない。既にある shots.json から一覧シートだけ組み直す。
     札や見た目を直しただけの回に、45枚を撮り直す7分をかけないため。 */
  if (has('--index-only')) {
    const j = JSON.parse(fs.readFileSync(path.join(OUT, 'shots.json'), 'utf8'));
    const stamp = stampNow();
    j.stamp = stamp;
    fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(j, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(OUT, 'index.html'), buildIndex(j.shots, stamp), 'utf8');
    console.log('一覧シートだけ組み直した（' + j.shots.length + '枚・' + stamp + '）');
    return;
  }
  const list = ONLY ? SHOTS.filter(s => s.name.indexOf(ONLY) >= 0 || s.group.indexOf(ONLY) >= 0) : SHOTS;

  console.log('開く先 : ' + BASE);
  console.log('寸法   : 844x390（横・主）／ 390x844（縦・回転の一枚）／ 倍率 ' + SCALE + ' ／ WebKit');
  console.log('撮る数 : ' + list.length + ' 枚');
  console.log('置き先 : ' + OUT);
  console.log('');

  const browser = await playwright.webkit.launch();
  const mkCtx = async viewport => {
    const c = await browser.newContext({
    viewport,
    deviceScaleFactor: SCALE,
    isMobile: true,
    hasTouch: true,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });
    await c.addInitScript(HELPERS);
    return c;
  };
  const ctxLand = await mkCtx(VIEW_LAND);
  const ctxPort = await mkCtx(VIEW_PORT);

  const rows = [];
  const t0 = Date.now();

  for (const s of list) {
    const file = s.name + '.png';
    const started = Date.now();
    const page = await (s.portrait ? ctxPort : ctxLand).newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message || e)));
    try {
      /* 掴み直しを防ぐため、開くたびに時刻を付ける（本体の ver.txt 方式と同じ考え） */
      await page.goto((s.url || BASE) + '?_shot=' + Date.now(), { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(700);
      await s.go(page);
      await page.waitForTimeout(s.wait || 600);
      await page.screenshot({ path: path.join(OUT, file) });
      const sec = ((Date.now() - started) / 1000).toFixed(1);
      rows.push({ name: s.name, group: s.group, label: s.label, file, ok: true, sec,
                   view: s.portrait ? '390x844（縦）' : '844x390（横）', jsErr: errs.slice(0, 2) });
      console.log('  撮れた   ' + file.padEnd(28) + s.label + '  (' + sec + '秒)');
    } catch (e) {
      const msg = String(e.message || e).split('\n')[0].slice(0, 160);
      rows.push({ name: s.name, group: s.group, label: s.label, file, ok: false, err: msg,
                   view: s.portrait ? '390x844（縦）' : '844x390（横）', jsErr: errs.slice(0, 2) });
      console.log('  撮れず   ' + file.padEnd(28) + s.label + '  ← ' + msg);
    }
    await page.close();
  }

  await browser.close();

  const stamp = stampNow();
  /* 「撮れた」は PNG が書けたという意味でしかない。段取りが効かず前の画面のままでも
     写しは出来てしまうので、指紋を突き合わせて同じ絵が二枚無いかを最後に数える。 */
  const crypto = require('crypto');
  const seen = {};
  rows.filter(r => r.ok).forEach(r => {
    const h = crypto.createHash('md5').update(fs.readFileSync(path.join(OUT, r.file))).digest('hex');
    (seen[h] = seen[h] || []).push(r.file);
  });
  const dup = Object.keys(seen).map(h => seen[h]).filter(a => a.length > 1);
  if (dup.length) {
    console.log('');
    console.log('  ＊同じ絵が出ています（その段取りは効いていない疑い）');
    dup.forEach(a => console.log('    ' + a.join(' ＝ ')));
  }

  const manifest = {
    stamp, base: BASE, viewport: '844x390（横）／390x844（縦・回転の一枚のみ）', scale: SCALE, engine: 'webkit',
    ok: rows.filter(r => r.ok).length,
    ng: rows.filter(r => !r.ok).length,
    dup,
    shots: rows.map(r => ({
      name: r.name, group: r.group, label: r.label, file: r.file,
      ok: r.ok, sec: r.sec || null, err: r.err || null, view: r.view,
      jsErr: (r.jsErr && r.jsErr.length) ? r.jsErr : undefined,
    })),
  };
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(OUT, 'index.html'), buildIndex(rows, stamp), 'utf8');

  console.log('');
  console.log('まとめ');
  console.log('────────────────────────────────────────');
  console.log('  撮れた       ' + manifest.ok + ' 枚');
  console.log('  撮れなかった ' + manifest.ng + ' 件');
  console.log('  かかった時間 ' + ((Date.now() - t0) / 1000).toFixed(1) + ' 秒');
  console.log('  一覧シート   shots/index.html');
  process.exit(manifest.ng > 0 ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
