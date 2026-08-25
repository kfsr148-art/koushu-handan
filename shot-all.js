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
const os   = require('os');

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
/* --published を付けたときだけ、公開ページをそのまま撮る。
   ＊そのときは遷移口が無いので、第二段の場（探偵編の各場・結果の指定・写真読み）は撮れない。 */
const PUBLISHED = 'https://kfsr148-art.github.io/koushu-handan/koushu-handan.html';

/* 剣士の足元の線。ミニゲームはここを基準に叩かないと剣が届かない（check.js ⑦ と同じ値）。 */
const FLOOR = (() => {
  try {
    const src = fs.readFileSync(path.join(ROOT, 'koushu-handan.html'), 'utf8');
    return Number((src.match(/floorRatio:\s*([0-9.]+)/) || [])[1] || 0.5);
  } catch (e) { return 0.5; }
})();

/* ───────── 検査用の写しと、そこへ差し込む遷移口 ─────────
 * 作法14 のとおり、**本体には一行も入れない**。回すたびに本体の写しを一時の場所へ作り、
 * その写しにだけ遷移口を差し込んで駆動し、終わったら写しごと消す。
 * ＊写しと本物がずれないよう、**毎回その場で本物から作り直す**。溜めない・使い回さない。
 * ＊差し込みは「この字面がちょうど1件あること」を確かめてから行う。
 *   本体が変わって当たらなくなったら、黙って撮り続けずに**その場で止める**。
 *
 * 遷移口（写しの上でだけ効く。URL に ?probe=… が無ければ何も走らない）
 *   ?probe=adv&scene=<intro|hall|room|note|diff|end>&room=<部屋のk>&kind=<win|lose>
 *   ?probe=tori&result=<win|lose>&level=<easy|normal|hard|endless>&caught=<数>
 *   ?probe=ss&img=<画の在りか>&calib=1
 */
const PROBE_PATCHES = [
  {
    name: '①URL の読み取り',
    /* 自動更新が ?_v= 付きのとき URL を書き戻すので、**一番はじめの script** で読んでおく。
       あとで読むと消えている。 */
    find: "<script>\n(function(){\n  var bar = document.getElementById('errBar'), n = 0;",
    /* ＊当てる字面が <script> から始まるので、差し込む側で <script> を書かない。
         書くと写しの中で二重になり、内側の <script> を JS として読んで丸ごと落ちる
         （2026-08-25 実測：Unexpected token '<' で PROBE ごと未定義になった）。 */
    add: (a) => a.replace('<script>', `<script>
/* ==== 検査用の遷移口（写しにだけ差し込む。本体には入っていない） ==== */
var PROBE = (function(){
  var q = {};
  try{
    (location.search || '').replace(/^\\?/, '').split('&').forEach(function(kv){
      if(!kv) return;
      var i = kv.indexOf('=');
      var k = decodeURIComponent(i < 0 ? kv : kv.slice(0, i));
      var v = i < 0 ? '' : decodeURIComponent(kv.slice(i + 1).replace(/\\+/g, ' '));
      q[k] = v;
    });
  }catch(e){}
  return q.probe ? q : null;
})();
`),
  },
  {
    name: '②探偵編の場を開く口',
    /* advSt / advView / advRender は探偵編の中だけの持ち物なので、その中へ差し込む。 */
    find: '  window.advStart = advStart;',
    add: (a) => a + `
  /* 検査用：場を名指しで開く。advStart() で一式を組んだあと、見せる場と居る部屋を差し替えて描き直す。
     ＊罠のある部屋（16号室・14号室）も、入る手続きを踏まないので死なずに撮れる。
     ＊犯人や目撃者は advNew() が毎回振り直すので、場は指定できても中身は毎回変わる。 */
  if (typeof PROBE !== 'undefined' && PROBE && PROBE.probe === 'adv') {
    window.addEventListener('load', function(){
      setTimeout(function(){
        try{
          window.closeTitleScreen();
          advStart();
          var sc = PROBE.scene || 'hall';
          if (PROBE.room) { advSt.room = PROBE.room; }
          if (sc === 'end') {
            /* 終局は advEnd(kind) がひと揃いを組む（幕の中身・頁割り・描き直しまで）。
               ＊advBuildEnding() は頁を**返すだけ**で、advEndPages には入れない。
                 そちらを呼んで捨てると、乗船の幕のまま撮れてしまう（2026-08-25 実測：
                 勝ちと敗けが同じ絵になった）。 */
            advEnd(PROBE.kind || 'win');
            return;
          } else {
            advView = sc;
          }
          advRender();
        }catch(e){}
      }, 400);
    });
  }`,
  },
  {
    name: '③ミニゲームの結果を指定する口',
    /* finish() と caught と level は遊びの中だけの持ち物なので、その中へ差し込む。 */
    find: `    if(el) el.classList.remove('show');
    if(window.ssGoTitle) window.ssGoTitle();
  };
})();`,
    add: () => `    if(el) el.classList.remove('show');
    if(window.ssGoTitle) window.ssGoTitle();
  };
  /* 検査用：結果を指定して絵を出す。外から剣を振っても鳥は捕れず（450回振って0/3羽）、
     出るのは負け絵だけだった。難易度を選んで始めたあと、捕った数を入れて結果を直に出す。
     ＊この遊びに**引き分けは無い**。finish(win) の真偽二択で、勝ちと負けの二つだけ。
       ノルマに足りない数で勝ちを指定することはできる（＝絵は勝ち、数は途中）。 */
  if (typeof PROBE !== 'undefined' && PROBE && PROBE.probe === 'tori') {
    window.addEventListener('load', function(){
      setTimeout(function(){
        try{
          window.closeTitleScreen();
          window.toriOpen();
          window.toriStart(PROBE.level || 'easy');
          var win = (PROBE.result !== 'lose');
          var n = parseInt(PROBE.caught, 10);
          caught = isFinite(n) ? n : (win ? level.quota : 0);
          finish(win);
        }catch(e){}
      }, 500);
    });
  }
})();`,
  },
  {
    name: '④写真読みに写真を与える口',
    find: `  if(pz){
    pz.style.display = 'block';
    if(!pz._bound){ pz.addEventListener('paste', window.ssZonePaste); pz._bound = true; }
  }
};
</script>`,
    add: () => `  if(pz){
    pz.style.display = 'block';
    if(!pz._bound){ pz.addEventListener('paste', window.ssZonePaste); pz._bound = true; }
  }
};
/* 検査用：写真を与えてから開く。ssShow() は window.ssImg が無いと何もせず戻るので、
   写真を渡さないかぎり読み取りの盤面は出せなかった。
   ＊img を省くと、その場で描いた試し画（牌を並べた絵）を使う。外の素材に頼らない。
   ＊描いた画は data URL なので canvas が汚れず、目盛り合わせも切り出しも通る。 */
var ssProbePhoto = function(){
  var c = document.createElement('canvas');
  c.width = 900; c.height = 260;
  var g = c.getContext('2d');
  g.fillStyle = '#2b6b4a'; g.fillRect(0, 0, c.width, c.height);
  for (var i = 0; i < 13; i++) {
    var x = 24 + i * 66, y = 60;
    g.fillStyle = '#f3ead6'; g.fillRect(x, y, 56, 140);
    g.fillStyle = '#c9bfa6'; g.fillRect(x, y + 132, 56, 8);
    g.fillStyle = '#1d3a2c';
    g.font = 'bold 34px sans-serif'; g.textAlign = 'center';
    g.fillText(String((i % 9) + 1), x + 28, y + 92);
  }
  return c.toDataURL('image/png');
};
if (typeof PROBE !== 'undefined' && PROBE && PROBE.probe === 'ss') {
  window.addEventListener('load', function(){
    setTimeout(function(){
      try{
        window.closeTitleScreen();
        var im = new Image();
        im.onload = function(){
          window.ssImg = im;
          try{ window.ssShow(); }catch(e){}
          if (PROBE.calib) { setTimeout(function(){ try{ window.ssCalibStart(); }catch(e){} }, 400); }
        };
        im.src = PROBE.img ? PROBE.img : ssProbePhoto();
      }catch(e){}
    }, 400);
  });
}
</script>`,
  },
];

/* 本体の写しを一時の場所へ作り、遷移口を差し込む。返すのは写しの在りか。 */
function makeProbeCopy() {
  /* 本体は改行が CRLF。差し込む字面は LF で書いてあるので、写しの側だけ LF へ均す。
     ＊直すのは写しだけで、本体には触れない。写しは撮り終えたら消える。 */
  const src = fs.readFileSync(path.join(ROOT, 'koushu-handan.html'), 'utf8').replace(/\r\n/g, '\n');
  let out = src;
  PROBE_PATCHES.forEach(p => {
    /* 差し込む前に、その字面がちょうど1件であることを数える（作法5 と同じ考え）。
       本体が変わって当たらなくなったら、黙って撮り続けずにここで止める。 */
    const n = out.split(p.find).length - 1;
    if (n !== 1) {
      throw new Error('遷移口を差し込めない：' + p.name + ' の当たりが ' + n + ' 件（1件であるべき）。'
                    + '本体が変わっています。台本の find を取り直してください。');
    }
    out = out.replace(p.find, p.add(p.find));
  });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-shot-'));
  const file = path.join(dir, 'probe.html');
  fs.writeFileSync(file, out, 'utf8');
  return { dir, file, url: 'file:///' + file.replace(/\\/g, '/') };
}

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

  /* ここから下は**第二段**。写しへ差し込んだ遷移口（?probe=adv）で開く。
     手順の再現ではなく、場と部屋を名指しして直に描き直す。 */
  { name: '17-1-adv-hall', group: '探偵編', label: '探偵編 — 廊下',
    q: 'probe=adv&scene=hall', go: async p => {}, wait: 1400 },
  { name: '17-2-adv-room-office', group: '探偵編', label: '探偵編 — 猫室',
    q: 'probe=adv&scene=room&room=office', go: async p => {}, wait: 1400 },
  { name: '17-3-adv-room-butler', group: '探偵編', label: '探偵編 — 執事の部屋',
    q: 'probe=adv&scene=room&room=butler', go: async p => {}, wait: 1400 },
  { name: '17-4-adv-room16', group: '探偵編', label: '探偵編 — 16号室（罠の部屋。踏まずに撮る）',
    q: 'probe=adv&scene=room&room=room16', go: async p => {}, wait: 1400 },
  { name: '17-5-adv-note', group: '探偵編', label: '探偵編 — 探偵ノート',
    q: 'probe=adv&scene=note', go: async p => {}, wait: 1400 },
  { name: '17-6-adv-diff', group: '探偵編', label: '探偵編 — 難易度の選び',
    q: 'probe=adv&scene=diff', go: async p => {}, wait: 1400 },
  ...[['win', '勝ち（ロン）'], ['ap', '行動力ぎれ'], ['knife', '16号室のナイフ'],
      ['alldead', '皆殺し'], ['bribe', '買収された'], ['aground', '座礁']].map(([k, ja], i) => ({
    name: '17-' + (7 + i) + '-adv-end-' + k,
    group: '探偵編',
    label: '探偵編 — 終局（' + ja + '）',
    q: 'probe=adv&scene=end&kind=' + k,
    go: async p => {},
    wait: 1500,
  })),

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

  /* 第二段。結果を指定して出す（?probe=tori）。外から振っても鳥は捕れず、負け絵しか出せなかった。
     ＊この遊びに引き分けは無い。勝ちと負けの二つだけ。 */
  { name: '20-1-tori-win', group: 'ミニゲーム', label: '一索の鳥 — 結果の絵（勝ち「捕まえた」）',
    q: 'probe=tori&result=win&level=easy', go: async p => {}, wait: 1400 },
  { name: '20-2-tori-lose', group: 'ミニゲーム', label: '一索の鳥 — 結果の絵（負け「逃げられた」）',
    q: 'probe=tori&result=lose&level=easy', go: async p => {}, wait: 1400 },
  { name: '20-3-tori-win-hard', group: 'ミニゲーム', label: '一索の鳥 — 結果の絵（上級を勝ち）',
    q: 'probe=tori&result=win&level=hard', go: async p => {}, wait: 1400 },

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

  /* 第二段。写真を与えてから開く（?probe=ss）。ssShow() は window.ssImg が無いと何もせず戻る。 */
  { name: '24-1-ss-board', group: 'その他の間', label: '写真読み — 読み取りの盤面（試し画を渡した）',
    q: 'probe=ss', go: async p => {}, wait: 1500 },
  { name: '24-2-ss-calib', group: 'その他の間', label: '写真読み — 目盛り合わせ',
    q: 'probe=ss&calib=1', go: async p => {}, wait: 1800 },
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
'  探偵編の各場やミニゲームの結果など、外からは辿り着けない画面は、<b>検査用の写し</b>の側に\n' +
'  掘った遷移口で開いています。写しは<b>回すたびに本体から作り直し、撮り終えたら消します</b>。<br>\n' +
'  <b>本体（koushu-handan.html）には手を入れていません。</b>\n' +
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

  /* 本体の写しを、いまここで作る。作り置きはしない＝本物とずれない。
     --published のときだけ公開ページをそのまま開く（遷移口は無いので第二段の場は撮れない）。 */
  let copy = null, BASE, baseNote;
  if (has('--published')) {
    BASE = PUBLISHED;
    baseNote = '公開ページ（遷移口なし）';
  } else {
    copy = makeProbeCopy();
    BASE = copy.url;
    baseNote = '本体の写し（この回に作り直した。遷移口つき）';
    console.log('写し   : ' + copy.file);
  }

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
      /* 遷移口つきの回は ?probe=… を添える。写しの上でだけ効く。 */
      const q = '?_shot=' + Date.now() + (s.q ? '&' + s.q : '');
      /* 開くのに失敗したら一度だけ開き直す。本体は8MB近くあり、続けて開くと
         30秒に間に合わないことがある（2026-08-25 実測：訛りの2枚が時間切れで落ちた）。
         段取りの誤りと、ただの取りこぼしを混ぜないための受け。 */
      try {
        await page.goto((s.url || BASE) + q, { waitUntil: 'load', timeout: 30000 });
      } catch (e1) {
        await page.waitForTimeout(1200);
        await page.goto((s.url || BASE) + '?_shot=' + Date.now() + (s.q ? '&' + s.q : ''),
                        { waitUntil: 'load', timeout: 45000 });
      }
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
  /* 写しは撮り終えたら消す。溜めない・使い回さない（作法14）。 */
  if (copy) { try { fs.rmSync(copy.dir, { recursive: true, force: true }); } catch (e) {} }

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
    stamp, base: BASE, baseNote, viewport: '844x390（横）／390x844（縦・回転の一枚のみ）', scale: SCALE, engine: 'webkit',
    ok: rows.filter(r => r.ok).length,
    ng: rows.filter(r => !r.ok).length,
    dup,
    shots: rows.map(r => ({
      name: r.name, group: r.group, label: r.label, file: r.file,
      ok: r.ok, sec: r.sec || null, err: r.err || null, view: r.view,
      jsErr: (r.jsErr && r.jsErr.length) ? r.jsErr : undefined,
    })),
  };
  /* --only で一部だけ撮った回は、いまある控えへ**混ぜる**。丸ごと書き換えると、
     撮っていない分が一覧から消える（2026-08-25 に気づいた取りこぼし）。 */
  let merged = manifest.shots;
  if (ONLY) {
    try {
      const old = JSON.parse(fs.readFileSync(path.join(OUT, 'shots.json'), 'utf8'));
      const byName = {};
      (old.shots || []).forEach(x => { byName[x.name] = x; });
      manifest.shots.forEach(x => { byName[x.name] = x; });
      merged = Object.keys(byName).map(k => byName[k]).sort((a, b) => a.name.localeCompare(b.name));
      manifest.shots = merged;
      manifest.ok = merged.filter(x => x.ok).length;
      manifest.ng = merged.filter(x => !x.ok).length;
      console.log('  ＊一部だけ撮った回なので、いまある控えへ混ぜた（全 ' + merged.length + ' 枚）');
    } catch (e) {}
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(OUT, 'index.html'), buildIndex(merged, stamp), 'utf8');

  console.log('');
  console.log('まとめ');
  console.log('────────────────────────────────────────');
  console.log('  撮れた       ' + manifest.ok + ' 枚');
  console.log('  撮れなかった ' + manifest.ng + ' 件');
  console.log('  かかった時間 ' + ((Date.now() - t0) / 1000).toFixed(1) + ' 秒');
  console.log('  一覧シート   shots/index.html');
  process.exit(manifest.ng > 0 ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
