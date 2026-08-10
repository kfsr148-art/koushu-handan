#!/usr/bin/env node
/* 探偵編（ミシシッピー現場猫事件）の回帰。リポジトリ直下で `node adv-check` で実行する。
     ① 即死罠 …… 16号室で「しらべる」→ ナイフで終わる経路（v1334 の二重発火の回帰つき）
     ② 時間切れ … 行動力を使い切って終わる経路（完全黙秘の幕）
   全部PASSなら終了コード0、1つでもFAILなら1。

   探偵編の内部状態（advSt）は DOMContentLoaded の中に閉じていて外から読めない。
   よって画面の文字とボタンだけで辿る。判定材料は見出しの「行動力:NN」と、帯・場面の文言。

   ②について。単純に行動力を使い切ると、先に6人が殺されて「流局」の幕に落ちる
   （killOrder が犯人以外の6人ぶんあり、仲間が増えないと必ずそちらが先に来る）。
   行動力0の幕を安定して踏めるのは、証拠を持たぬまま犯人に二度「きく」経路なので、そちらを通す。
   ネルソンと「電話する」は座礁の幕へ逸れるため触らない。 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = __dirname;
/* 検査する本体は引数でも指定できる（例：`node adv-check ../old.html`）。
   旧版に当てて、検査そのものの効きを確かめるために要る。 */
const HTML_PATH = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'koushu-handan.html');

/* ---- 出力（check.js と同じ体裁） ---- */
let failCount = 0;
const sections = [];
function head(no, title) {
  console.log('');
  console.log(no + ' ' + title);
  console.log('─'.repeat(52));
}
function ok(msg) { console.log('  ✓ ' + msg); }
function ng(msg) { console.log('  ✗ ' + msg); failCount++; }
function note(msg) { console.log('    ' + msg); }
function section(no, title, fn) {
  head(no, title);
  const before = failCount;
  fn();
  sections.push({ title: no + ' ' + title, ok: failCount === before });
}

if (!fs.existsSync(HTML_PATH)) {
  console.error('koushu-handan.html が見つからない: ' + HTML_PATH);
  process.exit(2);
}
const src = fs.readFileSync(HTML_PATH, 'utf8');

/* 本体の写しに差し込む一片。探偵編を開いて、決めた経路をボタンの文字で辿り、
   結果を base64 の目印つきで DOM に置く。--dump-dom で吐かれた HTML から拾って読む。本体には入れない。 */
const ADV_PROBE = `
<script>
window.addEventListener('load', function(){
  var route = (location.hash || '').replace('#','') || 'knife';
  var res = { route: route, steps: [], knife: 0, ap: null, aps: [], pages: [], line: '', who: '', err: null };
  var knifeSeen = 0, obs = null, ticks = 0, done = false, timer = null;
  var f = { entered:false, searched:false, tapped:false, i:0, round:1, cur:'', heard:false, taps:0 };
  var ORDER = ['執事','軍師','ずんだ','お嬢様','マダム','一姫','先生'];

  setTimeout(start, 400);

  function root(){ return document.getElementById('advRoot'); }
  function deck(){ return document.getElementById('advDeck'); }
  function scene(){ return deck().previousElementSibling; }
  function msgEl(){ return deck().children[0]; }
  function diffRow(){ return deck().children[1]; }
  function hallRow(){ return deck().children[2]; }
  function row(){ return deck().children[3]; }
  function headText(){
    var h = root().lastElementChild, s = h ? h.querySelector('span') : null;
    return s ? (s.textContent || '') : '';
  }
  function vis(e){ return !!e && getComputedStyle(e).display !== 'none'; }
  function btn(box, label){
    var out = null;
    [].slice.call(box.querySelectorAll('button')).forEach(function(b){
      if(!out && (b.textContent || '').indexOf(label) === 0) out = b;
    });
    return out;
  }
  function click(b, what){
    if(!b){ fail('押せない：' + what); return; }
    res.steps.push(what);
    b.click();
  }
  function apOf(h){ var m = /行動力:(\\d+)/.exec(h); return m ? Number(m[1]) : null; }
  function fail(m){ if(!res.err) res.err = m; finish(); }

  function start(){
    try{
      window.closeTitleScreen();
      window.advStart();
      /* ナイフの絵は advRender のたびに作り直される。飛ばした回数を数えるため、
         場面の枠に足された節を見張って 'knifeFly' を含むものを勘定する。 */
      obs = new MutationObserver(function(rs){ count(rs); });
      obs.observe(scene(), { childList:true, subtree:true });
      timer = setInterval(tick, 60);
    }catch(e){ res.err = '開けない：' + (e && e.message); emit(); }
  }
  function count(rs){
    rs.forEach(function(r){
      [].slice.call(r.addedNodes).forEach(function(n){
        if(n.nodeType === 1 && (n.outerHTML || '').indexOf('knifeFly') >= 0) knifeSeen++;
      });
    });
  }
  function tick(){
    if(done) return;
    ticks++;
    if(ticks > 400){ fail('手数が尽きた'); return; }
    try{ drive(); }catch(e){ fail('途中で転んだ：' + (e && e.message)); }
  }
  function drive(){
    var r = root();
    if(!r || r.style.display === 'none'){ finish(); return; }   // 幕が引けた
    var h = headText(), m = msgEl().textContent || '';
    if(h.indexOf('乗船') >= 0){ click(btn(row(), '次へ'), '次へ（乗船の幕）'); return; }
    if(vis(diffRow())){ click(btn(diffRow(), '初歩'), '難易度：初歩'); return; }
    if(h.indexOf('終局') >= 0){
      var p = (scene().textContent || '').trim();
      if(res.pages[res.pages.length - 1] !== p) res.pages.push(p);
      click(btn(row(), '次へ'), '次へ（終局の幕）');
      return;
    }
    if(route === 'ap') driveAp(h, m); else driveKnife(h, m);
  }
  /* ① 即死罠：廊下 → 16号室 → しらべる → 帯をタップ → 幕 */
  function driveKnife(h, m){
    if(vis(hallRow())){
      if(f.entered){ fail('16号室から廊下へ戻ってしまった'); return; }
      f.entered = true;
      click(btn(hallRow(), '16号室'), '16号室へ入る');
      return;
    }
    if(!f.searched){
      f.searched = true;
      res.ap = apOf(h);
      click(btn(row(), 'しらべる'), '「しらべる」');
      return;
    }
    if(f.tapped){ fail('タップしても終局へ行かない：' + m.slice(0, 40)); return; }
    if(m.indexOf('刃が、一直線に') < 0){ fail('ナイフの帯が出ない：' + m.slice(0, 40)); return; }
    f.tapped = true;
    res.line = m;
    click(msgEl(), '帯をタップ（幕へ）');
  }
  /* ② 時間切れ：人柄7部屋を順に「きく」で二周する。犯人の二度目で見透かされ、行動力を失う。 */
  function driveAp(h, m){
    if(vis(hallRow())){
      if(f.i >= ORDER.length){
        f.i = 0; f.round++;
        if(f.round > 3){ fail('二周しても犯人に当たらない'); return; }
      }
      f.cur = ORDER[f.i++]; f.heard = false; f.taps = 0;
      click(btn(hallRow(), f.cur), f.cur + 'の部屋へ（' + f.round + '周目）');
      return;
    }
    if(m.indexOf('不敵な笑み') >= 0){
      if(f.tapped){ fail('タップしても終局へ行かない：' + m.slice(0, 40)); return; }
      f.tapped = true;
      res.ap = apOf(h); res.line = m; res.who = f.cur;
      click(msgEl(), '帯をタップ（幕へ）');
      return;
    }
    if(!f.heard){
      f.heard = true;
      res.aps.push(apOf(h));
      click(btn(row(), 'きく'), f.cur + 'に「きく」（' + f.round + '周目）');
      return;
    }
    f.taps++;
    if(f.taps > 4){ click(btn(row(), 'ろうかへ'), '「ろうかへ」で戻る'); return; }
    click(msgEl(), '帯を読み進める');
  }
  function finish(){
    if(done) return;
    done = true;
    if(timer) clearInterval(timer);
    if(obs){ count(obs.takeRecords()); obs.disconnect(); }
    res.knife = knifeSeen;
    emit();
  }
  function emit(){
    var b = btoa(unescape(encodeURIComponent(JSON.stringify(res))));
    var d = document.createElement('div');
    d.textContent = 'KOUSHU_ADV_BEGIN' + b + 'KOUSHU_ADV_END';
    d.style.display = 'none';
    document.body.appendChild(d);
  }
});
<\/script>
`;

/* ---- 駆動（headless Edge / Chrome ＋ --dump-dom。check.js ⑦ と同じ流儀） ---- */
const browser = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(p => p && fs.existsSync(p))[0];

let skipped = false;
let tmpDir = null;
let probePath = null;

function play(route) {
  const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=900,700', '--mute-audio',
    '--user-data-dir=' + path.join(tmpDir, 'prof'),
    '--virtual-time-budget=60000', '--dump-dom',
    'file:///' + probePath.replace(/\\/g, '/') + '#' + route];
  const r = spawnSync(browser, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });
  const hit = /KOUSHU_ADV_BEGIN([A-Za-z0-9+/=]+)KOUSHU_ADV_END/.exec(String(r.stdout || ''));
  if (!hit) return { fatal: '結果を取り出せない（船に乗れていない可能性）' };
  try { return JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8')); }
  catch (e) { return { fatal: '結果を読めない' }; }
}

function trail(d) {
  note('辿った手 ' + d.steps.length + '手 : ' + d.steps.slice(0, 6).join(' → ') +
    (d.steps.length > 6 ? ' → …… → ' + d.steps[d.steps.length - 1] : ''));
}

if (browser) {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-adv-'));
  probePath = path.join(tmpDir, 'probe.html');
  fs.writeFileSync(probePath, src.replace(/<\/body>\s*$/m, ADV_PROBE + '</body>'), 'utf8');
  console.log('駆動に使うブラウザ : ' + path.basename(browser));
} else {
  skipped = true;
}

try {
  /* ============================================================
     ① 即死罠（16号室のナイフ）
     ============================================================ */
  section('①', '即死罠（16号室のナイフ）', () => {
    if (skipped) { note('ブラウザが見つからないため駆動を飛ばす（Edge か Chrome があれば通す）'); ok('駆動なし'); return; }
    const d = play('knife');
    if (d.fatal) { ng(d.fatal); return; }
    trail(d);
    if (d.err) { ng('経路を通せない：' + d.err); return; }

    if (d.line.indexOf('刃が、一直線に') >= 0) ok('16号室の「しらべる」で刃が飛ぶ');
    else ng('刃の帯が出ない：' + String(d.line).slice(0, 40));

    /* v1334 の回帰。発動の直後は advRender が続けて呼ばれるので、素直に書くと二回飛ぶ。 */
    if (d.knife === 1) ok('ナイフの絵は1回だけ飛ぶ（v1334 の二重発火の回帰）');
    else ng('ナイフの絵が ' + d.knife + ' 回飛んでいる（1回であるべき）');

    const pages = d.pages.join('\n');
    if (pages.indexOf('死角なし、ヨシではなかった') >= 0) ok('労災の幕で終わる（死角なし、ヨシではなかった）');
    else ng('労災の幕に届かない。読んだ幕 ' + d.pages.length + '枚：' + pages.replace(/\n/g, ' ').slice(0, 60));
    if (pages.indexOf('流　局') >= 0) ng('流局の幕が混ざっている（別の終わり方に落ちている）');
  });

  /* ============================================================
     ② 時間切れ（行動力0・完全黙秘の幕）
     ============================================================ */
  section('②', '時間切れ（行動力を使い切る）', () => {
    if (skipped) { note('ブラウザが見つからないため駆動を飛ばす（Edge か Chrome があれば通す）'); ok('駆動なし'); return; }
    const d = play('ap');
    if (d.fatal) { ng(d.fatal); return; }
    trail(d);
    if (d.aps.length) note('行動力の推移 : ' + d.aps.join(' → ') + '（「きく」の直前で読んだ値）');
    if (d.err) { ng('経路を通せない：' + d.err); return; }

    if (d.line.indexOf('不敵な笑み') >= 0) ok('犯人（' + d.who + '）に二度「きく」と見透かされる');
    else ng('見透かされる帯が出ない：' + String(d.line).slice(0, 40));

    if (d.ap === 0) ok('その場で行動力が0になる');
    else ng('行動力が0になっていない（' + d.ap + '）');

    const pages = d.pages.join('\n');
    if (pages.indexOf('犯人は、また乗船する') >= 0) ok('完全黙秘の幕で終わる（犯人は、また乗船する）');
    else ng('完全黙秘の幕に届かない。読んだ幕 ' + d.pages.length + '枚：' + pages.replace(/\n/g, ' ').slice(0, 60));
    if (pages.indexOf('流　局') >= 0) ng('流局の幕が混ざっている（先に全員殺されている）');
  });
} finally {
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
}

/* ---- まとめ ---- */
console.log('');
console.log('まとめ');
console.log('─'.repeat(52));
sections.forEach(s => console.log('  ' + (s.ok ? 'PASS' : 'FAIL') + '  ' + s.title));
if (skipped) console.log('  ※ ブラウザが無いため実際には駆動していない');
console.log('');
console.log(failCount === 0 ? '全てPASS' : 'FAIL ' + failCount + '件');
process.exit(failCount === 0 ? 0 : 1);
