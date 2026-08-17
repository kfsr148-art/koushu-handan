#!/usr/bin/env node
/* 納品前チェック。リポジトリ直下で `node check` で実行する。
     ① 版番号3箇所の一致
     ② 起動時404の数
     ③ node --check（<script>ブロックの構文検証）
     ④ 音声ファイルの突き合わせ
   全部PASSなら終了コード0、1つでもFAILなら1。

   音声の候補URLは、この中に定数を書き写すのではなく koushu-handan.html から
   読み出して再現する。書き写すと、HTML側を直したときに静かにズレるため。 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = __dirname;
/* 検査する本体は引数でも指定できる（例：`node check ../old.html`）。
   省略時はリポジトリ直下。旧版に当てて検査そのものの効きを確かめるために要る。
   音声やファイルの実在確認は、指定に関わらずリポジトリ直下を見る。 */
/* --fast は「速い版」。⑦の実測を、いちばん狭い視野ひとつに絞る（画面は全部まわる）。
   通常の納品と push 前はこちら、台詞やレイアウトを触った回はフル版を回す。 */
const ARGS = process.argv.slice(2);
const FAST = ARGS.indexOf('--fast') >= 0;
const TARGET = ARGS.filter(a => a.charAt(0) !== '-')[0];
const HTML_PATH = TARGET ? path.resolve(TARGET) : path.join(ROOT, 'koushu-handan.html');
const VER_PATH = path.join(ROOT, 'ver.txt');

/* ---- 出力 ---- */
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

/* ---- 読み込み ---- */
if (!fs.existsSync(HTML_PATH)) {
  console.error('koushu-handan.html が見つからない: ' + HTML_PATH);
  process.exit(2);
}
const src = fs.readFileSync(HTML_PATH, 'utf8');
/* 剣士の足元の高さ（画面の高さに対する割合）。⑦の toriend は、この線を基準に叩かないと剣が届かない。 */
const FLOOR_RATIO = Number((src.match(/floorRatio:\s*([0-9.]+)/) || [])[1] || 0.5);

let nlPos = null;
function lineOf(idx) {
  if (!nlPos) {
    nlPos = [];
    for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) nlPos.push(i);
  }
  let lo = 0, hi = nlPos.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nlPos[mid] < idx) lo = mid + 1; else hi = mid;
  }
  return lo + 1;
}

/* HTML内の配列リテラルを読み出す（const NAME = ['a','b']） */
function strArray(name) {
  const m = src.match(new RegExp('(?:const|let|var)\\s+' + name + '\\s*=\\s*\\[([^\\]]*)\\]'));
  if (!m) return null;
  const out = [];
  const re = /'([^']*)'|"([^"]*)"/g;
  let g;
  while ((g = re.exec(m[1]))) out.push(g[1] !== undefined ? g[1] : g[2]);
  return out;
}

/* 音声の名前一覧：['attack',...].concat(Array.from({length:13}, ...)) を再現する */
function voiceNames() {
  const m = src.match(/(?:const|let|var)\s+names\s*=\s*\[([^\]]*)\]\s*\.concat\(\s*Array\.from\(\s*\{\s*length\s*:\s*(\d+)\s*\}([\s\S]{0,80})/);
  if (!m) return null;
  const out = [];
  const re = /'([^']*)'|"([^"]*)"/g;
  let g;
  while ((g = re.exec(m[1]))) out.push(g[1] !== undefined ? g[1] : g[2]);
  const len = Number(m[2]);
  if (m[3].indexOf('String(i+1)') === -1) {
    return { names: out, len: len, unknownMapper: m[3].trim().slice(0, 60) };
  }
  for (let i = 1; i <= len; i++) out.push(String(i));
  return { names: out, len: len, unknownMapper: null };
}

/* ============================================================
   ① 版番号3箇所の一致
   ============================================================ */
section('①', '版番号3箇所の一致', () => {
  const dataVer = (src.match(/<html[^>]*\sdata-ver="([^"]*)"/i) || [])[1];
  const verTagRaw = (src.match(/<div\s+id="verTag"[^>]*>([^<]*)<\/div>/i) || [])[1];
  const verTag = verTagRaw === undefined ? undefined : verTagRaw.trim().replace(/^v/i, '');
  const verTxtRaw = fs.existsSync(VER_PATH) ? fs.readFileSync(VER_PATH, 'utf8') : null;
  const verTxt = verTxtRaw === null ? undefined : (verTxtRaw.match(/\d+/) || [])[0];

  const rows = [
    ['data-ver 属性', dataVer],
    ['verTag div  ', verTag],
    ['ver.txt     ', verTxt],
  ];
  const missing = rows.filter(r => r[1] === undefined);
  rows.forEach(r => note(r[0] + ' : ' + (r[1] === undefined ? '(読み取れない)' : r[1])));

  if (missing.length) {
    ng('読み取れない箇所がある: ' + missing.map(r => r[0].trim()).join(', '));
    return;
  }
  const vals = rows.map(r => r[1]);
  if (vals[0] === vals[1] && vals[1] === vals[2]) ok('3箇所とも v' + vals[0] + ' で一致');
  else ng('3箇所が一致していない');
});

/* ============================================================
   ② 起動時404の数
   ============================================================ */
section('②', '起動時404の数', () => {
  const misses = [];   // {url, from}
  let checked = 0;

  /* --- 静的な src= / href= --- */
  const attrRe = /\b(src|href)\s*=\s*"([^"]*)"/gi;
  let m, dynamic = 0;
  while ((m = attrRe.exec(src))) {
    const val = m[2];
    if (val.indexOf("'") !== -1 || val.indexOf('+') !== -1 || val.indexOf('${') !== -1) { dynamic++; continue; }
    if (!val || /^(data:|https?:|#|javascript:|mailto:|blob:)/i.test(val)) continue;
    checked++;
    if (!fs.existsSync(path.join(ROOT, val.split('?')[0]))) {
      misses.push({ url: val, from: '静的' + m[1] + '= (' + lineOf(m.index) + '行)' });
    }
  }
  note('静的 src/href : ' + checked + '件を実在確認（data: とSVGの url(#…) は対象外）');
  note('動的 src/href : ' + dynamic + '件（実行時に組み立てる data: URI。起動時の取得ではない）');

  /* --- 音声プリロード --- */
  const exts = strArray('VOICE_EXTS');
  const dirs = strArray('VOICE_DIRS');
  const seps = strArray('SEPS');
  const nm = voiceNames();
  if (!exts || !dirs || !seps || !nm) {
    ng('音声の候補URLを koushu-handan.html から読み出せない（VOICE_EXTS/VOICE_DIRS/SEPS/names）');
  } else if (nm.unknownMapper) {
    ng('names の Array.from の作り方が想定と違う: ' + nm.unknownMapper);
  } else {
    let voice404 = 0;
    const detail = [];
    nm.names.forEach(n => {
      const cands = [];
      dirs.forEach(d => seps.forEach(sep => exts.forEach(ext => cands.push(d + n + sep + ext))));
      const hit = cands.findIndex(c => fs.existsSync(path.join(ROOT, c)));
      const wasted = hit === -1 ? cands.length : hit;
      voice404 += wasted;
      if (wasted > 0) {
        detail.push('  ' + n + ' : ' + wasted + '件空振り' +
          (hit === -1 ? '（どこにも無い→OS音声）' : ' → ' + cands[hit]));
      }
    });
    note('音声プリロード : ' + nm.names.length + '名 × 候補' +
      (dirs.length * seps.length * exts.length) + '通り、先に当たった時点で打ち切り');
    if (voice404 > 0) {
      detail.forEach(d => note(d));
      for (let i = 0; i < voice404; i++) misses.push({ url: '(音声候補の空振り)', from: '音声プリロード' });
      // 空振りは名前単位でまとめて数える（上の push は件数合わせ）
    }
  }

  /* --- 起動時 fetch --- */
  const fetchRe = /fetch\(([^)]{0,160})\)/g;
  while ((m = fetchRe.exec(src))) {
    const arg = m[1];
    const lit = /'([^']+)'|"([^"]+)"/g;
    let g;
    while ((g = lit.exec(arg))) {
      const v = g[1] !== undefined ? g[1] : g[2];
      if (!/^[\w./-]+\.\w+$/.test(v)) continue;
      const line = lineOf(m.index);
      if (fs.existsSync(path.join(ROOT, v))) note('起動時 fetch  : ' + v + ' (' + line + '行) → 実在');
      else misses.push({ url: v, from: '起動時 fetch (' + line + '行)' });
    }
  }

  console.log('');
  if (misses.length === 0) {
    ok('起動時404: 0件');
  } else {
    const voiceMisses = misses.filter(x => x.from === '音声プリロード').length;
    const other = misses.filter(x => x.from !== '音声プリロード');
    ng('起動時404: ' + misses.length + '件');
    if (voiceMisses) note('音声プリロードの空振り ' + voiceMisses + '件（内訳は上）');
    other.forEach(x => note(x.url + '  ← ' + x.from));
  }
});

/* ============================================================
   ③ node --check
   ============================================================ */
section('③', 'node --check（<script>ブロックの構文検証）', () => {
  const blocks = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(src))) {
    if (/\bsrc\s*=/i.test(m[1])) continue;   // 外部読み込みは中身が無い
    blocks.push({ line: lineOf(m.index), code: m[2] });
  }
  if (blocks.length === 0) { ng('<script> ブロックが見つからない'); return; }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-check-'));
  try {
    blocks.forEach((b, i) => {
      const f = path.join(tmpDir, 'block' + (i + 1) + '.js');
      fs.writeFileSync(f, b.code, 'utf8');
      const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
      if (r.status === 0) ok('<script> #' + (i + 1) + '（' + b.line + '行〜）構文OK');
      else {
        ng('<script> #' + (i + 1) + '（' + b.line + '行〜）構文エラー');
        String(r.stderr || '').split('\n').slice(0, 8).forEach(l => { if (l.trim()) note(l); });
      }
    });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });   // 一時ファイルは残さない
  }
});

/* ============================================================
   ④ 音声ファイルの突き合わせ
   ============================================================ */
section('④', '音声ファイルの突き合わせ', () => {
  const exts = strArray('VOICE_EXTS');
  const dirs = strArray('VOICE_DIRS');
  const seps = strArray('SEPS');
  const nm = voiceNames();
  if (!exts || !dirs || !seps || !nm || nm.unknownMapper) {
    ng('音声の設定を koushu-handan.html から読み出せない');
    return;
  }

  const used = new Set();
  const unresolved = [];
  nm.names.forEach(n => {
    const cands = [];
    dirs.forEach(d => seps.forEach(sep => exts.forEach(ext => cands.push(d + n + sep + ext))));
    const hit = cands.find(c => fs.existsSync(path.join(ROOT, c)));
    if (hit) used.add(hit.replace(/\\/g, '/'));
    else unresolved.push(n);
  });

  note('必要な名前 : ' + nm.names.length + '個');
  note('解決した数 : ' + (nm.names.length - unresolved.length) + '個');
  if (unresolved.length === 0) ok('全ての名前が実ファイルに解決した');
  else ng('ファイルが無い名前（OS音声に落ちる）: ' + unresolved.join(', '));

  /* 孤児：リポジトリにあるが、どの名前からも参照されない音声 */
  const audioRe = /\.(wav|m4a|mp3)$/i;
  const onDisk = [];
  fs.readdirSync(ROOT).forEach(f => { if (audioRe.test(f)) onDisk.push(f); });
  const voiceDir = path.join(ROOT, 'voice');
  if (fs.existsSync(voiceDir)) {
    fs.readdirSync(voiceDir).forEach(f => { if (audioRe.test(f)) onDisk.push('voice/' + f); });
  }
  const orphans = onDisk.filter(f => !used.has(f));
  if (orphans.length === 0) ok('孤児ファイルなし（' + onDisk.length + '個すべて参照されている）');
  else ng('どの名前からも参照されない音声 ' + orphans.length + '件: ' + orphans.join(', '));

  /* 空白入りのファイル名（v1311の事故） */
  const spaced = onDisk.filter(f => /\s/.test(f));
  if (spaced.length === 0) ok('ファイル名に空白なし');
  else ng('ファイル名に空白が入っている ' + spaced.length + '件: ' + spaced.join(', '));
});

/* ⑦で本体の写しに差し込む一片。#board / #watch / #adv で画面を開き、
   はみ出し・重なり・横溢れを数えて、結果を base64 の目印つきで DOM に置く。
   --dump-dom で吐かれた HTML から、その目印を拾って読む。本体には入れない。 */
const VIEW_PROBE = `
<script>
window.addEventListener('load', function(){
  var screen = (location.hash || '').replace('#','') || 'board';
  var res = { w: 0, h: 0, out: [], hit: [], wide: [], tail: null };
  setTimeout(function(){
    try{
      if(screen === 'adv'){ window.closeTitleScreen(); window.advStart(); }
      else if(screen === 'watch'){ window.closeTitleScreen(); window.watchOpen(); }
      /* タイトルは開いた直後の姿そのもの。閉じずに測る。 */
      else if(screen === 'title'){ /* 何もしない */ }
      else if(screen === 'settings'){ window.closeTitleScreen(); window.catRoomOpen(); }
      else if(screen === 'torimenu'){ window.closeTitleScreen(); window.toriOpen(); }
      else if(screen === 'advroom'){ advRoom(); }
      else if(screen === 'toriend'){
        /* headless は最初の2秒ほどで描き直しを止める。遊びの輪は requestAnimationFrame に
           乗っているので、そのままだと鳥が凍り、制限時間も減らず結果画面に届かない。
           写しの中だけタイマー駆動に差し替える（本体はそのまま）。 */
        window.requestAnimationFrame = function(fn){ return setTimeout(function(){ fn(Date.now()); }, 16); };
        window.cancelAnimationFrame = function(id){ clearTimeout(id); };
        window.closeTitleScreen(); window.toriOpen(); window.toriStart('easy');
        toriSweep(0);   /* 勝ち抜けた時点で自分で measure を呼ぶ */
        return;
      }
      else if(screen === 'judged'){
        window.closeTitleScreen(); window.ssMarkTool();
        var g = document.getElementById('qiText');
        /* 13枚。14枚だと多牌で判定ボタンが押せず、カードが出ないまま測ることになる。 */
        if(g){ g.value = '3455m2367p1189s7z'; g.dispatchEvent(new Event('input', {bubbles:true})); }
        setTimeout(function(){ var jb = document.getElementById('judgeBtn'); if(jb) jb.click(); }, 300);
      }
      else {
        window.closeTitleScreen(); window.ssMarkTool();
        var f = document.getElementById('qiText');
        /* 14枚（13枚＋1）を並べた、いちばん幅の要る状態で測る */
        if(f){ f.value = '3455m2367p1189s37z'; f.dispatchEvent(new Event('input', {bubbles:true})); }
      }
    }catch(e){ res.error = e.message; emit(); return; }
    setTimeout(measure, 700);
  }, 400);

  function vis(el){
    var s = getComputedStyle(el);
    if(s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  /* 探偵編の部屋まで開く。乗船の幕を送り、難易度を選び、廊下から猫室へ入る。
     16号室と14号室は罠が待っているので使わない。 */
  function advRoom(){
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
  }
  /* ミニゲームの結果画面まで進める。鳥は逃げるので狙い撃ちは当てにならない。
     画面を24px刻みで一面叩くと、どこに居ても当たる。初級のノルマ3羽で結果画面に着く。 */
  /* v1365 から捕獲は「画面中央の枝豆が鞭を振る」形になった。画面を撫でるように叩いても
     当たらないので、鳥の位置を DOM から読み、届く範囲にいる一羽の方角へ振る。
     連打はクールダウンで捨てられるため、間隔を空けて何度も振る。 */
  function toriSweep(n){
    var root = document.getElementById('toriRoot');
    var panel = document.getElementById('toriPanel');
    var done = panel && /捕まえた|逃げられた/.test(panel.textContent || '');
    if(done || n > 450 || !root){ setTimeout(measure, 300); return; }
    /* 叩く基準は剣士の足元の線。画面の中央で測ると剣が届かず、掃きが空振りになる。 */
    var cx = window.innerWidth / 2, cy = window.innerHeight * __FLOOR__;
    var reach = Math.min(window.innerWidth, window.innerHeight) * 0.35;
    var near = null, nearD = reach * 0.9;   // 端すれすれは狙わない
    [].forEach.call(document.querySelectorAll('.tori-bird'), function(b){
      var r = b.getBoundingClientRect();
      var bx = (r.left + r.right) / 2, by = (r.top + r.bottom) / 2;
      var d = Math.hypot(bx - cx, by - cy);
      if(d < nearD){ nearD = d; near = [bx, by]; }
    });
    if(near){
      /* 触点は鳥そのものでなく、中央から鳥の方角へ伸ばした点。角度だけが効く。 */
      var a = Math.atan2(near[1] - cy, near[0] - cx);
      var x = cx + Math.cos(a) * reach * 0.5, y = cy + Math.sin(a) * reach * 0.5;
      root.dispatchEvent(new MouseEvent('mousedown', { clientX: x, clientY: y, bubbles: true }));
      /* すぐ離す。押しっぱなしにすると 300ms でゾーン移動や跳躍が起きて、掃きが乱れる。 */
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      if('ontouchstart' in window){
        try{
          var t = new Touch({ identifier: 1, target: root, clientX: x, clientY: y });
          root.dispatchEvent(new TouchEvent('touchstart', { changedTouches: [t], bubbles: true, cancelable: true }));
        }catch(e){}
      }
    }
    setTimeout(function(){ toriSweep(n + 1); }, 80);
  }
  /* 別のレイヤー同士（覆いと下の盤面）を重なりと数えないよう、position:fixed の祖先で層を分ける */
  function layer(el){
    var n = el, k = 'base';
    while(n && n !== document.body){
      if(getComputedStyle(n).position === 'fixed') k = (n.id || n.className || 'fixed').toString().slice(0,20);
      n = n.parentElement;
    }
    return k;
  }
  function name(el){
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
      (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0,2).join('.') : '');
  }
  function measure(){
    var W = res.w = window.innerWidth, H = res.h = window.innerHeight;
    /* 判定後は body.judged が縦に送れる作りなので、縦の溢れは咎めない（横だけを見る）。 */
    var judged = (screen === 'judged');
    var over = [];
    document.querySelectorAll('body *').forEach(function(el){
      if(!vis(el)) return;
      /* 画面内エラー窓は溢れとして数えない。出ているのは例外が起きたという合図であって、
         画面の作りの溢れではない（ふだんは display:none なので普通は掛からない）。 */
      if(el.id === 'errBar') return;
      var r = el.getBoundingClientRect();
      if(r.width < 8 || r.height < 8) return;
      if(r.right > W + 1 || (!judged && r.bottom > H + 1) || r.left < -1) over.push({ el: el, r: r });
    });
    /* 親が既に挙がっているものは子を挙げない（同じ溢れを何度も言わない） */
    over.filter(function(o){ return !over.some(function(p){ return p.el !== o.el && p.el.contains(o.el); }); })
      .slice(0, 8)
      .forEach(function(o){ res.out.push({ el: name(o.el), right: Math.round(o.r.right), bottom: Math.round(o.r.bottom) }); });

    var bs = [].slice.call(document.querySelectorAll('button')).filter(vis);
    bs.forEach(function(a, i){
      bs.slice(i + 1).forEach(function(b){
        if(layer(a) !== layer(b)) return;
        var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        var ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        var oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if(ox > 1 && oy > 1 && res.hit.length < 8) res.hit.push({
          a: (a.textContent||'').trim().slice(0,8), b: (b.textContent||'').trim().slice(0,8),
          w: Math.round(ox), h: Math.round(oy) });
      });
    });

    document.querySelectorAll('body *').forEach(function(el){
      if(!vis(el) || res.wide.length >= 8) return;
      /* 判定後の画面には、送れるのが仕様の箱がある（投票欄＝端が半分見切れて送れると分かる作り）。
         指で送れる箱の中身は「隠れた溢れ」ではないので数えない。overflow:hidden の箱は数える。 */
      if(judged){
        var cs = getComputedStyle(el);
        if(cs.overflowX === 'auto' || cs.overflowX === 'scroll') return;
        /* 「…」で切ってあるものも、切れていることが読み手に分かるので溢れとは数えない
           （狭い横画面の根拠欄の見出しが、意図してこの形になっている）。 */
        if(cs.textOverflow === 'ellipsis') return;
      }
      if(el.scrollWidth > el.clientWidth && el.clientWidth > 60)
        res.wide.push({ el: name(el), sw: el.scrollWidth, cw: el.clientWidth, over: el.scrollWidth - el.clientWidth });
    });

    /* 判定後は、末尾の二択（連チャン／親流れ）が画面の中に残っているかまで見る。
       ここが画面の下へ出ると、判定を読んでも次の手へ進めない。 */
    if(judged){
      var tail = document.querySelector('.next-hand-row');
      res.tail = tail ? { bottom: Math.round(tail.getBoundingClientRect().bottom * 10) / 10, vis: vis(tail) } : null;
      /* 人柄七人ぶんの見立て行を、実際に押し替えて測る。
         既定の一人（執事）だけを見ていると、長い台詞を持つ人柄の折り返しを見逃す。
         同じ人柄をもう一度押すと解除されて空行になるので、body の印が付くまで押す。 */
      var TONES = ['strategist','blunt','lady','french','ichihime','sensei','butler'];
      res.tones = [];
      TONES.forEach(function(tn){
        try{
          window.setTone(tn);
          if(!document.body.classList.contains('tone-' + tn)) window.setTone(tn);
        }catch(e){ res.tones.push({ tone: tn, err: e.message }); return; }
        var ang = document.querySelector('.tone-angle');
        var st  = ang ? ang.querySelector('.say-text') : null;
        var ic  = ang ? ang.querySelector('.say-icon') : null;
        var tl  = document.querySelector('.next-hand-row');
        var txt = st ? (st.textContent || '').trim() : '';
        res.tones.push({
          tone: tn,
          chars: txt.length,
          /* 一行かどうかは、話者の箱（.say-icon）の高さを物差しにする。
             一行なら行の高さは箱の高さのまま。折り返すと箱より高くなる。 */
          angH: ang ? Math.round(ang.getBoundingClientRect().height * 10) / 10 : null,
          iconH: ic ? Math.round(ic.getBoundingClientRect().height * 10) / 10 : null,
          sw: st ? st.scrollWidth : null,
          cw: st ? st.clientWidth : null,
          tailBottom: tl ? Math.round(tl.getBoundingClientRect().bottom * 10) / 10 : null,
          tailVis: tl ? vis(tl) : false
        });
      });
    }
    /* ミニゲームのメニューは、指が本当にボタンへ届くかまで見る。
       覆いの touchstart で既定動作を止めていると、iOS はタップから click を作らないので
       「見えているのに一枚も押せない」状態になる（v1331〜v1347 の実機がこれだった）。 */
    if(screen === 'torimenu'){
      var bad = [];
      var rt = document.getElementById('toriRoot');
      [].slice.call(rt ? rt.querySelectorAll('button') : []).forEach(function(b){
        var br = b.getBoundingClientRect();
        if(br.width < 4 || br.height < 4) return;
        var cx = br.left + br.width / 2, cy = br.top + br.height / 2;
        var label = (b.textContent || '').trim().slice(0, 10);
        var top = document.elementFromPoint(cx, cy);
        if(!(top === b || b.contains(top))){
          bad.push(label + '：指が別の物に当たる（' + (top ? (top.id || top.className || top.tagName) : 'なし') + '）');
          return;
        }
        try{
          var tt = new Touch({ identifier: 1, target: b, clientX: cx, clientY: cy });
          var tev = new TouchEvent('touchstart', { changedTouches: [tt], touches: [tt], bubbles: true, cancelable: true });
          b.dispatchEvent(tev);
          if(tev.defaultPrevented) bad.push(label + '：touchstart が止められている（iOSでは反応しない）');
        }catch(e){ /* Touch を作れない環境では、当たり判定の確認だけで済ませる */ }
      });
      res.tap = bad;
      res.tapCount = rt ? rt.querySelectorAll('button').length : 0;
    }
    /* 目当ての画面に本当に着いているかを持ち帰る。着けないまま別の画面を測って
       「溢れなし」と言うのが、いちばん質の悪い通り方なので。 */
    if(screen === 'toriend'){
      var tp = document.getElementById('toriPanel');
      res.state = tp ? (tp.textContent || '').slice(0, 12) : '';
    } else if(screen === 'advroom'){
      /* 見出しは器のいちばん最後の段（head）の中の span。先頭の span は味方牌なので拾わない。 */
      var rootAdv = document.getElementById('advRoot');
      var hd = rootAdv && rootAdv.lastElementChild ? rootAdv.lastElementChild.querySelector('span') : null;
      res.state = hd ? (hd.textContent || '').slice(0, 12) : '';
    }
    emit();
  }
  function emit(){
    var b = btoa(unescape(encodeURIComponent(JSON.stringify(res))));
    var d = document.createElement('div');
    d.textContent = 'KOUSHU_VIEW_BEGIN' + b + 'KOUSHU_VIEW_END';
    d.style.display = 'none';
    document.body.appendChild(d);
  }
});
<\/script>
`;

/* base64 の中身は識別子と紛れるので、行を保ったまま伏せた写しを作る。⑤⑥で使う。 */
const srcNoB64 = src.replace(/(data:[a-z/+.-]+;base64,)[A-Za-z0-9+/=]+/g, '$1B64');
/* 写しは元より短いので、位置→行の索引は元と共用できない。改行の数は変わらないため行番号は一致する。 */
let nlPos2 = null;
function lineOfNoB64(idx) {
  if (!nlPos2) {
    nlPos2 = [];
    for (let i = 0; i < srcNoB64.length; i++) if (srcNoB64.charCodeAt(i) === 10) nlPos2.push(i);
  }
  let lo = 0, hi = nlPos2.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nlPos2[mid] < idx) lo = mid + 1; else hi = mid;
  }
  return lo + 1;
}

/* <script> の外（CSS・HTML）は、字面が同じでも別物。たとえば .reasons というCSSの規則は
   JSの変数 reasons の読み出しではない。位置と行はそのままに、外側を空白で伏せた写しを作る。⑧で使う。 */
const jsOnly = (function () {
  const out = new Array(srcNoB64.length).fill(' ');
  for (let i = 0; i < srcNoB64.length; i++) if (srcNoB64.charCodeAt(i) === 10) out[i] = '\n';
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(srcNoB64))) {
    if (/\bsrc\s*=/i.test(m[1])) continue;               // 外部読み込みは中身が無い
    const start = m.index + m[0].indexOf('>') + 1;
    for (let i = 0; i < m[2].length; i++) out[start + i] = m[2][i];
  }
  return out.join('');
})();

/* ============================================================
   ⑤ 死にコード（どこからも参照されていない宣言）
   ============================================================ */
section('⑤', '死にコード', () => {
  const decls = new Map();   // 名前 -> {種類, 行}
  const put = (name, kind, idx) => { if (name && !decls.has(name)) decls.set(name, { kind, line: lineOfNoB64(idx) }); };
  let m;
  const reFn = /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g;
  while ((m = reFn.exec(srcNoB64))) put(m[1], '関数', m.index);
  const reVar = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g;
  while ((m = reVar.exec(srcNoB64))) put(m[1], '変数', m.index);
  const reWin = /\bwindow\.([A-Za-z_$][\w$]*)\s*=\s*function/g;
  while ((m = reWin.exec(srcNoB64))) put('window.' + m[1], 'window', m.index);

  const dead = [];
  decls.forEach((d, name) => {
    const bare = name.replace(/^window\./, '');
    const re = new RegExp('\\b' + bare.replace(/\$/g, '\\$') + '\\b', 'g');
    let c = 0;
    while (re.exec(srcNoB64)) c++;
    if (c <= 1) dead.push({ name, ...d });
  });
  dead.sort((a, b) => a.line - b.line);

  note('宣言の総数 : ' + decls.size + '（関数・変数・window.*）');
  if (dead.length === 0) { ok('宣言だけで参照されていないものは無し'); return; }
  ng('参照されていない宣言 ' + dead.length + '件');
  dead.forEach(d => note(String(d.line).padStart(5) + '行  ' + d.kind.padEnd(7) + d.name));
  note('※ window[\'名前\'] のように文字列で呼ぶ書き方は参照と見なせない。心当たりがあれば個別に確かめること');
});

/* ============================================================
   ⑥ 未使用の埋め込み画像・音声
   （音声ファイルの孤児は④が見ているので、ここは data: で埋め込んだ資産に絞る）
   ============================================================ */
section('⑥', '未使用の埋め込み画像・音声', () => {
  /* 「名前 = 'data:...'」の形だけを対象にする。
     オブジェクトの値として持つ物（ADV_CHAR_IMG['x'] など）は、鍵を組み立てて引くことがあり
     参照の有無を字面では決められないため、ここでは数えない。 */
  const re = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*['"]data:([a-z]+)\/[a-z0-9.+-]+;base64,([A-Za-z0-9+/=]+)['"]/g;
  let m, total = 0, count = 0;
  const dead = [];
  while ((m = re.exec(src))) {
    count++;
    const kb = Math.round(Buffer.from(m[3], 'base64').length / 1024);
    total += kb;
    const refs = srcNoB64.split(new RegExp('\\b' + m[1] + '\\b')).length - 1;
    if (refs <= 1) dead.push({ name: m[1], kind: m[2], kb, line: lineOf(m.index) });
  }
  note('名前つきで埋め込まれた資産 : ' + count + '件 / 合計 ' + total + 'KB');
  if (dead.length === 0) { ok('参照されていない埋め込み資産は無し'); return; }
  const sum = dead.reduce((a, b) => a + b.kb, 0);
  ng('参照されていない埋め込み資産 ' + dead.length + '件（計 ' + sum + 'KB）');
  dead.forEach(d => note(String(d.line).padStart(5) + '行  ' + d.kind.padEnd(6) + d.name + '  ' + d.kb + 'KB'));
});

/* ============================================================
   ⑦ 狭い画面での溢れ（headless ブラウザで実測）
   ============================================================ */
let viewSkipped = false;   // ブラウザが無くて測れなかったか（まとめで PASS と紛れないように持つ）
section('⑦', '狭い画面での溢れ', () => {
  /* headless の窓は視野より 幅+24 / 高さ+92 大きい。測るのは実際の innerWidth/innerHeight。 */
  /* 速い版はいちばん狭い視野だけ。狭いほど溢れやすいので、画面の取りこぼしは作らずに時間だけ縮む。 */
  const VIEWS = FAST ? [[568, 320]] : [[568, 320], [667, 375], [844, 390], [932, 430]];
  /* judged＝判定後のカード。判定前だけを測っていると、根拠欄のように結果側にしか出ない溢れを見逃す。
     title/settings/advroom/torimenu は、指で触る場所があるのに測っていなかった画面。
     toriend は実際に遊びを通して出す結果画面（画面を一面叩いて勝ち抜ける）。 */
  const SCREENS = ['title', 'board', 'judged', 'settings', 'watch', 'adv', 'advroom', 'torimenu', 'toriend'];
  /* 横溢れは4pxまで見逃す。.tile.pick::before が当たり判定を牌の外へ4px広げており（押し損じ対策）、
     その意図的なはみ出しが3px計上されるため。これを咎めると当たり判定を痩せさせる方向に効いてしまう。 */
  const SLACK = 4;

  const browser = [
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ].filter(p => p && fs.existsSync(p))[0];

  if (!browser) {
    note('ブラウザが見つからないため測定を飛ばす（Edge か Chrome があれば実測する）');
    viewSkipped = true;
    ok('測定なし');
    return;
  }
  note('測定に使うブラウザ : ' + path.basename(browser));

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-view-'));
  try {
    const probe = path.join(tmpDir, 'probe.html');
    fs.writeFileSync(probe, src.replace(/<\/body>\s*$/m,
      VIEW_PROBE.replace('__FLOOR__', FLOOR_RATIO) + '</body>'), 'utf8');

    let bad = 0, done = 0, extra = 0;
    const TONE_JP = { butler:'執事', strategist:'軍師', blunt:'ずんだ', lady:'お嬢様',
                      french:'マダム', ichihime:'一姫', sensei:'先生' };
    const run = (vw, vh, screen) => {
      const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
        '--window-size=' + (vw + 24) + ',' + (vh + 92),
        '--user-data-dir=' + path.join(tmpDir, 'prof'),
        /* ミニゲームだけは、遊びを通すぶんの時間が要る（9秒だと勝ち抜けきる前に打ち切られる回がある）。 */
        /* toriend は制限時間（30秒）を跨げるだけ回す。捕まえられなくても「逃げられた」で
           結果画面には必ず届く。捕獲の条件が鞭になって、叩けば必ず勝てるとは限らなくなった。 */
        /* toriend は走り込み330ms＋喜ぶ動き600ms＋制限時間30秒＋達成の喜び900ms を跨ぐ。 */
        '--virtual-time-budget=' + (screen === 'toriend' ? 70000 : 9000), '--dump-dom',
        'file:///' + probe.replace(/\\/g, '/') + '#' + screen];
      const r = spawnSync(browser, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });
      const hit = /KOUSHU_VIEW_BEGIN([A-Za-z0-9+/=]+)KOUSHU_VIEW_END/.exec(String(r.stdout || ''));
      if (!hit) { ng(screen + ' ' + vw + 'x' + vh + '：測定結果を取り出せない'); bad++; return; }
      let d;
      try { d = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8')); }
      catch (e) { ng(screen + ' ' + vw + 'x' + vh + '：結果を読めない'); bad++; return; }
      done++;
      if (d.error) { ng(screen + ' ' + vw + 'x' + vh + '：画面を開けない（' + d.error + '）'); bad++; return; }

      const wide = (d.wide || []).filter(x => x.over > SLACK);
      const lines = [];
      (d.out || []).forEach(x => lines.push('はみ出し ' + x.el + ' right=' + x.right + ' bottom=' + x.bottom));
      (d.hit || []).forEach(x => lines.push('重なり 「' + x.a + '」×「' + x.b + '」 ' + x.w + 'x' + x.h + 'px'));
      wide.forEach(x => lines.push('横溢れ ' + x.el + ' ' + x.sw + ' > ' + x.cw));
      /* 判定後は、末尾の二択が画面の中に残っていることまでを合格の条件にする。 */
      if (screen === 'judged') {
        if (!d.tail || !d.tail.vis) lines.push('二択（連チャン／親流れ）が出ていない');
        else if (d.tail.bottom > d.h + 1) lines.push('二択が画面の下へ出ている bottom=' + d.tail.bottom + ' > ' + d.h);
        /* 見立て行は人柄で長さが変わる。既定の一人だけ見ていると、長い台詞を持つ人柄が
           折り返して二択を画面の外へ押し出す回を取りこぼす。七人ぶん押し替えて確かめる。
           横の切れ（「…」）は狭い視野の設計どおりなので数えない——数えるのは折り返しと二択。 */
        const T = d.tones || [];
        if (T.length !== 7) lines.push('見立て行を七人ぶん測れていない（' + T.length + '人）');
        T.forEach(x => {
          const who = TONE_JP[x.tone] || x.tone;
          if (x.err) { lines.push(who + '：人柄を押し替えられない（' + x.err + '）'); return; }
          if (!x.chars) { lines.push(who + '：見立て行が空'); return; }
          if (x.angH !== null && x.iconH !== null && x.angH > x.iconH + 1) {
            lines.push(who + '：見立て行が折り返している 行' + x.angH + 'px > 話者の箱' + x.iconH + 'px（' + x.chars + '字）');
          }
          if (!x.tailVis) lines.push(who + '：二択が出ていない');
          else if (x.tailBottom > d.h + 1) {
            lines.push(who + '：二択が画面の下へ出ている bottom=' + x.tailBottom + ' > ' + d.h);
          }
        });
      }
      /* 目当ての画面に着けていない回は、溢れの有無に関わらず落とす。 */
      if (screen === 'toriend' && !/捕まえた|逃げられた/.test(d.state || '')) {
        lines.push('ミニゲームの結果画面に届いていない（いまの表示：' + (d.state || '空') + '）');
      }
      if (screen === 'torimenu') {
        if (!d.tapCount) lines.push('メニューにボタンが出ていない');
        (d.tap || []).forEach(x => lines.push('タップが届かない ' + x));
      }
      if (screen === 'advroom' && (d.state || '').indexOf('猫室') < 0) {
        lines.push('探偵編の部屋に入れていない（いまの見出し：' + (d.state || '空') + '）');
      }
      const label = screen + ' ' + d.w + 'x' + d.h;
      if (lines.length === 0) {
        note(label.padEnd(18) + '溢れなし' + (d.tail ? '（二択 bottom=' + d.tail.bottom + ' / ' + d.h + '）' : ''));
        const T = d.tones || [];
        if (T.length) {
          const long = T.slice().sort((x, y) => (y.sw || 0) - (x.sw || 0))[0];
          const clipped = T.filter(x => x.sw > x.cw).map(x => TONE_JP[x.tone] || x.tone);
          note(''.padEnd(18) + '見立て行 七人とも一行（最長 ' + (TONE_JP[long.tone] || long.tone)
            + ' ' + long.chars + '字 / ' + long.sw + 'px）'
            + (clipped.length ? '　「…」で切る人柄 : ' + clipped.join('・') : ''));
        }
        return;
      }
      bad += lines.length;
      ng(label + '：' + lines.length + '件');
      lines.slice(0, 8).forEach(l => note('  ' + l));
    };

    VIEWS.forEach(([vw, vh]) => { SCREENS.forEach(screen => run(vw, vh, screen)); });
    /* 速い版でも、見立て行の折り返しだけは 844x390 でも見る。
       568x320 は一行に切り詰める指定（nowrap＋「…」）が効いていて折り返しようがなく、
       折り返しが出るのは切り詰めの外れる 844x390——しかも二択の余白がいちばん薄い視野だから。 */
    if (!VIEWS.some(v => v[0] === 844 && v[1] === 390)) { run(844, 390, 'judged'); extra = 1; }
    if (FAST) note('速い版：視野は 568x320 のみ（judged だけ 844x390 も回す）。フル版（4視野）は --fast を外す');
    note('測った組み合わせ : ' + done + ' / ' + (VIEWS.length * SCREENS.length + extra) +
      '（視野 ' + VIEWS.map(v => v[0] + 'x' + v[1]).join(' ') + (extra ? ' ＋ judged だけ 844x390' : '') + '）');
    note('横溢れは ' + SLACK + 'px まで見逃す（.tile.pick::before の当たり判定ぶん）');
    note('judged だけは縦の溢れと、送れる箱（overflow-x:auto/scroll）・「…」で切る箱の横溢れを数えない');
    if (bad === 0) ok('どの視野でも、はみ出し・重なり・横溢れなし');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

/* ============================================================
   ⑧ 組み立てているのに画面に出していない入れ物
   （配列や連想配列を作って詰めるだけで、一度も読み出していないもの。
     v1321 まで残っていた「判定の根拠リスト」がこの形だった）
   ============================================================ */
section('⑧', '組み立てて出していない入れ物', () => {
  /* 空の配列・連想配列で始まる宣言だけを見る。組み立てて使う入れ物の形はこれになる。 */
  const re = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(\[\s*\]|\{\s*\})/g;
  let m;
  const boxes = [];
  while ((m = re.exec(jsOnly))) boxes.push({ name: m[1], line: lineOfNoB64(m.index) });

  const dead = [];
  boxes.forEach(b => {
    const re2 = new RegExp('\\b' + b.name.replace(/\$/g, '\\$') + '\\b', 'g');
    let m2, reads = 0, writes = 0;
    while ((m2 = re2.exec(jsOnly))) {
      const after = jsOnly.slice(m2.index + b.name.length, m2.index + b.name.length + 24);
      const before = jsOnly.slice(Math.max(0, m2.index - 24), m2.index);
      if (/^\s*=\s*(\[\s*\]|\{\s*\})/.test(after) && /(?:const|let|var)\s+$/.test(before)) continue;   // 宣言そのもの
      /* 詰める側：push などの破壊的な呼び出しと、添字・属性への代入 */
      if (/^\s*\.\s*(push|unshift|splice|sort|reverse|fill|pop|shift)\s*\(/.test(after)) { writes++; continue; }
      if (/^\s*\[[^\]]*\]\s*=[^=]/.test(after)) { writes++; continue; }
      if (/^\s*\.\s*[A-Za-z_$][\w$]*\s*=[^=]/.test(after)) { writes++; continue; }
      reads++;
    }
    if (writes >= 1 && reads === 0) dead.push({ ...b, writes });
  });

  note('空の配列・連想配列で始まる宣言 : ' + boxes.length + '件');
  if (dead.length === 0) { ok('組み立てたきり読み出していない入れ物は無し'); return; }
  ng('組み立てているのに読み出していない入れ物 ' + dead.length + '件');
  dead.forEach(d => note(String(d.line).padStart(5) + '行  ' + d.name + '（詰める操作 ' + d.writes + '回・読み出し 0回）'));
  note('※ 同じ名前を別の場所でも使っていると数がまざる。挙がったものは前後を見て確かめること');
});

/* ============================================================
   ⑨ 「ヨシ」の混入
   （「ヨシ」「ダブルヨシ」は現場猫だけの言葉。枝豆・紳士・虎の側に紛れていないか）
   ============================================================ */
section('⑨', '「ヨシ」の混入', () => {
  /* 話者ごとの受け持ち範囲を、字面で切り出す */
  function slice(from, to){
    const i = jsOnly.indexOf(from);
    if (i < 0) return null;
    const j = to ? jsOnly.indexOf(to, i) : -1;
    return jsOnly.slice(i, j > 0 ? j : i + 2000);
  }
  function entryOf(key){
    const i = jsOnly.indexOf("{ key:'" + key + "'");
    if (i < 0) return null;
    let d = 0;
    for (let j = i; j < jsOnly.length; j++) {
      if (jsOnly[j] === '{') d++;
      else if (jsOnly[j] === '}') { d--; if (!d) return jsOnly.slice(i, j + 1); }
    }
    return null;
  }
  const zones = [
    ['枝豆の助言',   (jsOnly.match(/window\._edamameNote\s*=\s*[^;]+;/g) || []).join('\n')],
    ['紳士の助言',   (jsOnly.match(/window\._shinshiNote\s*=\s*[^;]+;/g) || []).join('\n')],
    ['虎の台詞',     (slice('const MASCOT_WORDS = {', '};') || '')],
    ['投票欄（枝豆）', entryOf('eda') || ''],
    ['投票欄（紳士）', entryOf('ai') || '']
  ];
  let bad = 0;
  zones.forEach(z => {
    const [name, text] = z;
    if (!text) { note(name + ' : 範囲を切り出せない'); return; }
    const hit = (text.match(/ヨシ/g) || []).length;
    if (hit) { ng(name + ' に「ヨシ」が ' + hit + '件'); bad++; }
    else note(name + ' : 混入なし');
  });
  /* 現場猫の側には在ってよい（在ることも確かめる） */
  const catText = (jsOnly.match(/window\._catSwitchNote\s*=\s*[^;]+;/g) || []).join('\n');
  note('現場猫の助言 : 「ヨシ」' + (catText.match(/ヨシ/g) || []).length + '件（この話者の言葉なので在ってよい）');
  if (bad === 0) ok('枝豆・紳士・虎の側に「ヨシ」は無い');
});

/* ============================================================
   ⑩ ミニゲームの定数と八方位、親補正の境目の写し
   ============================================================ */
section('⑩', 'ミニゲームの定数と八方位・親補正の写し', () => {
  /* --- ミニゲームの定数 --- */
  const want = {
    easy:   { speed:0.30, turn:2.0, birds:2, quota:3 },
    normal: { speed:0.45, turn:1.2, birds:3, quota:5 },
    hard:   { speed:0.65, turn:0.7, birds:4, quota:7 }
  };
  let bad = 0;
  Object.keys(want).forEach(k => {
    const m = jsOnly.match(new RegExp("key:'" + k + "'[^}]*}"));
    if (!m) { ng(k + ' の段が見つからない'); bad++; return; }
    const row = m[0];
    Object.keys(want[k]).forEach(f => {
      const v = (row.match(new RegExp(f + ':\\s*([0-9.]+)')) || [])[1];
      if (Number(v) !== want[k][f]) { ng(k + ' の ' + f + ' が ' + v + '（仕様は ' + want[k][f] + '）'); bad++; }
    });
  });
  const t30 = (jsOnly.match(/timeLimit:\s*(\d+)/) || [])[1];
  if (Number(t30) !== 30) { ng('制限時間が ' + t30 + '秒（仕様は30秒）'); bad++; }
  ['speedUpStep', 'dodgeRadius', 'dodgeBoost', 'dodgeTime', 'flashTime', 'birdSize'].forEach(f => {
    const v = (jsOnly.match(new RegExp(f + ':\\s*([0-9.]+)')) || [])[1];
    if (v === undefined) { ng(f + ' が定数表に無い'); bad++; }
  });
  note('三段の速度・転換・同時羽数・ノルマ、制限時間、逃げと加速の値を照合');

  /* --- 八方位の割り当て --- */
  /* 切り出しは TORI_DIRS の配列が閉じるところまで。固定の文字数で切ると、
     後ろにある別の方位表（EDA_DIRS＝枝豆の振りの向き）を巻き込んで数が合わなくなる。 */
  const dirStart = jsOnly.indexOf('const TORI_DIRS');
  const dirBlock = jsOnly.slice(dirStart, jsOnly.indexOf('];', dirStart) + 2);
  const dirs = [];
  const re = /key:'(\w+)'[^}]*deg:\s*(-?\d+)/g;
  let m;
  while ((m = re.exec(dirBlock))) dirs.push({ key: m[1], deg: Number(m[2]) });
  const WANT_DIRS = { aomori:-90, yoji:-45, bushi:0, miyazaki:45, okinawa:90, hakata:135, osaka:180, kyoto:-135 };
  if (dirs.length !== 8) { ng('方位が ' + dirs.length + '件（8件のはず）'); bad++; }
  else {
    const degs = dirs.map(d => d.deg).sort((a, b) => a - b);
    const uniq = new Set(degs);
    if (uniq.size !== 8) { ng('角度に重なりがある'); bad++; }
    for (let i = 1; i < degs.length; i++) {
      if (degs[i] - degs[i - 1] !== 45) { ng('角度が45度の等間隔でない : ' + degs.join(' ')); bad++; break; }
    }
    dirs.forEach(d => {
      if (WANT_DIRS[d.key] === undefined) { ng('知らない方言 ' + d.key); bad++; }
      else if (WANT_DIRS[d.key] !== d.deg) { ng(d.key + ' が ' + d.deg + '度（仕様は ' + WANT_DIRS[d.key] + '度）'); bad++; }
    });
    note('方言八種を八方位へ、45度の等間隔で重なりなく割り当て');
  }

  /* --- 親補正の境目の写し ---
     analyze() は window に出ていないので、実際の手を通した照合はできない。
     ここでは analyze() 側の字面と、虎（mascotDealerNudged）が持つ写しを突き合わせる。
     どちらかを直したときに、もう一方が取り残されるのを捕まえるのが狙い。 */
  const nd = (src.match(/acceptTiles\s*<\s*\(isDealer\s*\?\s*(\d+)\s*:\s*(\d+)\)/) || []);
  const wa = (src.match(/acceptTiles\s*>=\s*\(isDealer\s*\?\s*(\d+)\s*:\s*(\d+)\)/) || []);
  const cp = (src.match(/r\s*>=\s*(\d+)\s*&&\s*r\s*<\s*(\d+)\s*\)\s*:\s*\(d\s*>=\s*1\s*&&\s*r\s*>=\s*(\d+)\s*&&\s*r\s*<\s*(\d+)/) || []);
  if (!nd.length || !wa.length || !cp.length) {
    ng('境目の数値を読み取れない（analyze 側または写し側の書き方が変わった）');
    bad++;
  } else {
    const a = [Number(nd[1]), Number(nd[2]), Number(wa[1]), Number(wa[2])];   // 親6 子8 親20 子24
    const b = [Number(cp[1]), Number(cp[2]), Number(cp[3]), Number(cp[4])];
    note('analyze の境目 : 親' + a[0] + '/子' + a[1] + '・親' + a[2] + '/子' + a[3]);
    note('虎が持つ写し   : ' + b[0] + '〜' + b[1] + '枚・' + b[2] + '〜' + b[3] + '枚');
    if (a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2] || a[3] !== b[3]) {
      ng('写しが analyze の境目とずれている');
      bad++;
    } else note('写しは一致（※実際の手を通した照合ではなく、字面の照合）');
  }
  if (bad === 0) ok('定数・八方位・境目の写し、いずれも仕様どおり');
});

/* ============================================================
   ⑫ プレースホルダの未置換
   （台詞の {n} {h} {w} {s} などが、置換されないまま画面へ出ないか）
   ============================================================ */
section('⑫', 'プレースホルダの未置換', () => {
  /* 差し込み口：文字列の中の {名前}。テンプレート文字列の ${…} は別物なので除く。 */
  const holes = new Map();     // 名前 -> 出現数
  const fills = new Map();     // 名前 -> 置換の数
  let m;
  const reHole = /(?<!\$)\{([A-Za-z぀-ヿ一-鿿][\w぀-ヿ一-鿿]*)\}/g;   /* {名} のような日本語の差し込み口も拾う */
  while ((m = reHole.exec(jsOnly))) holes.set(m[1], (holes.get(m[1]) || 0) + 1);
  /* 埋める側：replace('{n}', …) と replace(/\{n\}/g, …) の二つの形。 */
  const reFill = /replace\(\s*(?:['"]\{([^{}'"]+)\}['"]|\/\\\{([^{}/]+)\\\}\/[gimsuy]*)/g;
  while ((m = reFill.exec(jsOnly))) {
    const k = m[1] || m[2];
    fills.set(k, (fills.get(k) || 0) + 1);
  }

  note('差し込み口 : ' + ([...holes.entries()].map(x => '{' + x[0] + '}×' + x[1]).join('  ') || 'なし'));
  note('埋める側   : ' + ([...fills.entries()].map(x => '{' + x[0] + '}×' + x[1]).join('  ') || 'なし'));

  const naked = [...holes.keys()].filter(k => !fills.has(k));
  const idle = [...fills.keys()].filter(k => !holes.has(k));

  if (naked.length === 0) ok('埋める側の無い差し込み口は無し');
  else {
    ng('埋める側の無い差し込み口 ' + naked.length + '件: ' + naked.map(k => '{' + k + '}').join(' '));
    naked.forEach(k => {
      const i = jsOnly.indexOf('{' + k + '}');
      note('  {' + k + '} ' + lineOfNoB64(i) + '行あたり  ' + jsOnly.slice(Math.max(0, i - 30), i + 20).replace(/\s+/g, ' ').trim());
    });
  }
  if (idle.length === 0) ok('差し込み口の無い置換は無し');
  else ng('差し込み口の無い置換 ' + idle.length + '件（綴り違いか、消し忘れ）: ' + idle.map(k => '{' + k + '}').join(' '));

  /* 画面へ直に書いてある本文（<script> の外）に差し込み口が残っていないか。
     こちらは埋める処理が通らないので、書いた時点で出てしまう。 */
  const outside = [];
  const reOut = /(?<!\$)\{([A-Za-z぀-ヿ一-鿿][\w぀-ヿ一-鿿]*)\}/g;   /* {名} のような日本語の差し込み口も拾う */
  /* <script> の中身だけを空白で伏せる（行番号は保つ）。残るのが HTML と CSS の側。 */
  const htmlOnly = srcNoB64.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, s => s.replace(/[^\n]/g, ' '));
  while ((m = reOut.exec(htmlOnly))) outside.push({ k: m[1], line: lineOfNoB64(m.index) });
  if (outside.length === 0) ok('<script> の外の本文に差し込み口は無し');
  else {
    ng('<script> の外に差し込み口が ' + outside.length + '件（そのまま画面に出る）');
    outside.slice(0, 8).forEach(o => note(String(o.line).padStart(5) + '行  {' + o.k + '}'));
  }
});

section('⑬', '非日本語文字の混入', () => {
  /* キリル・ハングルなど、日本語でも記号でもない字が紛れていないか。
     Ａ と А のような見た目の同じ字は目では気づけないので、機械で当たる。
     既知例外は置かない。1件でも出たら FAIL。 */
  const allow = cp =>
    cp < 0x80                                   /* ASCII */
    || cp === 0x00B1 || cp === 0x00D7 || cp === 0x00F7   /* ±×÷ */
    || (cp >= 0x2000 && cp <= 0x206F)           /* ‐–—…※⁈ ほか約物 */
    || (cp >= 0x2190 && cp <= 0x21FF)           /* 矢印 */
    || (cp >= 0x2200 && cp <= 0x23FF)           /* ≦≧−⌫ ほか記号 */
    || (cp >= 0x2460 && cp <= 0x24FF)           /* 丸数字 */
    || (cp >= 0x2500 && cp <= 0x257F)           /* 罫線 */
    || (cp >= 0x25A0 && cp <= 0x27BF)           /* ■●▶✓ ほか */
    || (cp >= 0x2B00 && cp <= 0x2BFF)
    || cp === 0x200D                            /* 絵文字の連結 */
    || (cp >= 0xFE00 && cp <= 0xFE0F)           /* 異体字セレクタ */
    || (cp >= 0x1F000 && cp <= 0x1FAFF)         /* 絵文字 */
    || (cp >= 0x3000 && cp <= 0x30FF)           /* 　、。「」＋かな */
    || (cp >= 0x4E00 && cp <= 0x9FFF)           /* 漢字 */
    || (cp >= 0xFF01 && cp <= 0xFF60)           /* 全角英数・記号 */
    || (cp >= 0xFFE0 && cp <= 0xFFE6);
  /* 埋め込みの base64 は字面ではないので、伏せた側を見る */
  const lines = srcNoB64.split('\n');
  const hits = [];
  lines.forEach((ln, i) => {
    for (const ch of ln) {
      const cp = ch.codePointAt(0);
      if (allow(cp)) continue;
      hits.push({ line: i + 1, ch: ch, cp: cp, text: ln.trim().slice(0, 60) });
    }
  });
  if (hits.length === 0) { ok('日本語・記号・絵文字のほかに紛れた字は無し'); return; }
  ng('日本語でない字が ' + hits.length + '件');
  hits.slice(0, 10).forEach(h => note(String(h.line).padStart(5) + '行  U+'
    + h.cp.toString(16).toUpperCase().padStart(4, '0') + ' 「' + h.ch + '」  ' + h.text));
});

section('⑭', '良形の順位付けの写し', () => {
  /* analyze() の bestShapeOneSuit は、まとまりのうち良形に使った牌しか控えない。
     弱形（嵌張・辺張）まで控える写しが toneBlocksOneSuit として外に置いてあり、
     ずんだと一姫はそちらを見て牌を名指す。片方だけ直すと、名指した中身と
     判定の数字が静かにズレるので、条件と再帰の引数を字面で突き合わせる。 */
  const cut = (name) => {
    const at = src.indexOf('function ' + name + '(c){');
    if (at < 0) return null;
    let i = src.indexOf('{', at), depth = 0, end = -1;
    for (let j = i; j < src.length; j++) {
      const ch = src[j];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { end = j; break; } }
    }
    return end < 0 ? null : src.slice(at, end + 1);
  };
  /* 丸括弧の釣り合いを取って、キーワードの引数をそのまま抜き出す */
  const args = (body, kw) => {
    const out = [];
    let at = 0;
    while ((at = body.indexOf(kw + '(', at)) >= 0) {
      let depth = 0, end = -1;
      for (let j = at + kw.length; j < body.length; j++) {
        if (body[j] === '(') depth++;
        else if (body[j] === ')') { depth--; if (depth === 0) { end = j; break; } }
      }
      if (end < 0) break;
      out.push(body.slice(at + kw.length + 1, end).replace(/\s+/g, ''));
      at = end;
    }
    return out;
  };
  const src1 = cut('bestShapeOneSuit'), src2 = cut('toneBlocksOneSuit');
  if (!src1 || !src2) { ng('bestShapeOneSuit か toneBlocksOneSuit が見つからない'); return; }

  /* ① 順位付けの式そのもの */
  const betterOf = b => {
    const m = /const better\s*=\s*([^;]+);/.exec(b);
    return m ? m[1].replace(/\s+/g, '') : null;
  };
  const b1 = betterOf(src1), b2 = betterOf(src2);
  if (b1 && b2 && b1 === b2) ok('順位付けの式が一致（good最大 → 面子最大 → 弱形最大）');
  else { ng('順位付けの式が食い違っている'); note('  本体 : ' + b1); note('  写し : ' + b2); }

  /* ② 枝の条件の並び */
  const if1 = args(src1, 'if'), if2 = args(src2, 'if');
  if (if1.join('|') === if2.join('|')) ok('枝の条件が ' + if1.length + '本とも同じ並び');
  else {
    ng('枝の条件が食い違っている（本体 ' + if1.length + '本／写し ' + if2.length + '本）');
    const n = Math.max(if1.length, if2.length);
    for (let i = 0; i < n && i < 12; i++) {
      if (if1[i] !== if2[i]) note('  ' + (i + 1) + '番目  本体: ' + (if1[i] || '(なし)') + '  写し: ' + (if2[i] || '(なし)'));
    }
  }

  /* ③ 再帰の引数の並び（暗刻→順子→対子→辺張／両面→嵌張→浮き牌の順に効く） */
  const r1 = args(src1, 'rec'), r2 = args(src2, 'rec');
  if (r1.join('|') === r2.join('|')) ok('再帰の引数が ' + r1.length + '本とも同じ並び');
  else {
    ng('再帰の引数が食い違っている（本体 ' + r1.length + '本／写し ' + r2.length + '本）');
    const n = Math.max(r1.length, r2.length);
    for (let i = 0; i < n && i < 12; i++) {
      if (r1[i] !== r2[i]) note('  ' + (i + 1) + '番目  本体: ' + (r1[i] || '(なし)') + '  写し: ' + (r2[i] || '(なし)'));
    }
  }
});

section('⑮', '猫牌の判定条件の写し', () => {
  /* 猫牌＝1〜9の孤立牌。この判定は枚数を返す関数・位置を拾う側・見張り台の答え合わせと、
     本体の中に何箇所も写しがある（枚数しか返さない関数からは位置が拾えないため）。
     片方だけ直すと、数えた枚数と光る牌が静かにズレる。核の3行を字面で突き合わせる。 */
  const lines = src.split('\n');
  const marks = [];
  lines.forEach((ln, i) => { if (/const hasNeighbor\s*=/.test(ln)) marks.push(i); });
  if (marks.length < 2) { ng('猫牌の判定条件が ' + marks.length + '箇所しか見つからない（目印を変えたか）'); return; }

  /* 直前の関数名を拾う。宣言の形は三通りある（function 名( ／ window.名 = function ／ const 名 = function）。
     行の途中に出てくる無名関数を名前と取り違えないよう、行頭からの宣言だけを見る。 */
  const ownerOf = (idx) => {
    for (let j = idx; j >= 0; j--) {
      /* 字下げ2桁までの宣言＝この一枚岩の中の「外側の関数」。入れ子の無名関数は拾わない。 */
      const m = /^ {0,2}function\s+([A-Za-z_$][\w$]*)\s*\(/.exec(lines[j])
        || /^ {0,2}window\.([A-Za-z_$][\w$]*)\s*=\s*function\s*\(/.exec(lines[j]);
      if (m) return m[1];
    }
    return '(不明)';
  };
  /* 並びの変数名だけ伏せて、核を比べられる形に均す */
  const norm = s => s.replace(/\s+/g, ' ').trim()
    .replace(/[A-Za-z_$][\w$]*\.filter\(function\(o\)\{ return o\.suit === t\.suit; \}\)/, '«並び».filter(...)');

  const cores = [], owners = [], bad = [];
  marks.forEach(i => {
    const owner = ownerOf(i);
    owners.push(owner);
    const core = norm(lines[i - 1] + ' ' + lines[i] + ' ' + lines[i + 1]);
    cores.push(core);
    /* 拾う条件が同じか（n++ / add / hit= の違いは問わない） */
    if (!/!hasNeighbor\s*&&\s*!hasDup/.test(lines[i + 2])) {
      bad.push(owner + '：拾う条件が「!hasNeighbor && !hasDup」でない → ' + lines[i + 2].trim().slice(0, 50));
    }
    /* 数牌だけを見ているか（肯定形・早期returnのどちらでもよいが、三色を名指していること） */
    const guard = lines[i - 2] || '';
    if (!(/'man'/.test(guard) && /'pin'/.test(guard) && /'sou'/.test(guard))) {
      bad.push(owner + '：数牌の絞り込みが三色を名指していない → ' + guard.trim().slice(0, 50));
    }
  });

  note('見つかった写し : ' + marks.length + '箇所（' + owners.join(' / ') + '）');
  const uniq = [...new Set(cores)];
  if (uniq.length === 1) ok('核の3行が ' + marks.length + '箇所とも同じ字面（同色±2に相棒なし・同じ数の重複なし）');
  else {
    ng('猫牌の判定条件が食い違っている（' + uniq.length + '通りある）');
    uniq.forEach((u, k) => {
      const who = owners.filter((o, n) => cores[n] === u).join('・');
      note('  ' + (k + 1) + '通り目（' + who + '）');
      note('    ' + u.slice(0, 150));
    });
  }
  if (bad.length === 0) ok('拾う条件と数牌の絞り込みも、どの写しも揃っている');
  else { ng('揃っていない写しが ' + bad.length + '件'); bad.slice(0, 6).forEach(b => note('  ' + b)); }
});

/* ============================================================
   ⑯ 攻撃のあとの待機の向き
   仕様（v1399〜）：向きは叩いた点の左右だけで決まる。剣士より右なら右、左なら左。
   左右の成分が無い（真上・真下ちょうど）ときだけ直前の向きのまま——開始は正面なので正面。
   振り終わっても向きは保ち、次に向きを決める出来事（別の向きへの攻撃、跳躍）まで戻さない。
   字面では見ない。実際に画面を叩いて、出ている絵で確かめる。
   叩く場所は二通り持つ——鞭が届く内側と、豆投げに落ちる外側。
   v1377 まで外側だけが壊れていた（豆投げが体の向きを左右にしか振らず、真上・真下で
   正面へ戻れなかった）のに、内側しか叩いていない検査では「期待どおり」で通ってしまう。
   八方位ちょうどだけを叩く検査では v1398 以前の実装（八方位へ丸めてから左右を決める）も
   同じ答えを返すので、それでは新しい仕様を守れない。真上・真下から5度だけ傾けた点を
   足してあるのはそのため——ここが旧実装では正面に落ち、新しい仕様では左右を向く。
   ============================================================ */
let idleSkipped = false;   // ブラウザが無くて測れなかったか（まとめで PASS と紛れないように持つ）
section('⑯', '攻撃のあとの待機の向き', () => {
  const browser = [
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ].filter(p => p && fs.existsSync(p))[0];
  if (!browser) {
    note('ブラウザが見つからないため測定を飛ばす（Edge か Chrome があれば実測する）');
    idleSkipped = true;
    ok('測定なし');
    return;
  }
  note('測定に使うブラウザ : ' + path.basename(browser));

  /* 本体から鞭の絵の鍵の並びを取り出す。build() は Object.keys の順に img を appendChild
     するので、この並びがそのまま DOM の並びになる。probe は添字だけで絵を見分ける
     （window に診断口は生やさない＝CLAUDE.md §15）。 */
  const wi = src.indexOf('const EDA_WHIP = {');
  if (wi < 0) { ng('EDA_WHIP が見つからない'); return; }
  const wblock = src.slice(wi, src.indexOf('};', wi) + 2);
  const KEYS = [];
  const kre = /(\w+):'data:image\/png;base64,/g;
  let km;
  while ((km = kre.exec(wblock))) KEYS.push(km[1]);
  if (KEYS.length < 11) { ng('鞭の絵が足りない（' + KEYS.length + '枚）'); return; }

  /* 剣士の足元の高さ。射程も角度もここから測るので、叩く高さもこの線に合わせる。 */
  const floorRatio = Number((src.match(/floorRatio:\s*([0-9.]+)/) || [])[1] || 0.5);
  note('足元の高さ : 画面の高さの ' + floorRatio + '（ここを基準に叩く）');
  const IDLE_PROBE = `
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  var KEYS = ${JSON.stringify(KEYS)};
  var NAGE = ['prepare','grasp','flick','flight','action','tama'];
  var FLOOR = ${floorRatio};
  var DIRS = [{k:'r',deg:0},{k:'dr',deg:45},{k:'d',deg:90},{k:'dl',deg:135},
              {k:'l',deg:180},{k:'ul',deg:-135},{k:'u',deg:-90},{k:'ur',deg:-45},
              /* 真上・真下から5度だけ傾けた点。八方位へ丸めると u・d に落ちるので、
                 旧実装では正面になった。新しい仕様では左右を向く。 */
              {k:'u右',deg:-85},{k:'u左',deg:-95},{k:'d右',deg:85},{k:'d左',deg:95}];
  var out = { trials: [], err: null };
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function shown(){
    var all = document.querySelectorAll('#toriRoot .tori-eda');
    var names = KEYS.concat(NAGE.map(function(n){ return '投:' + n; }));
    var vis = [];
    for(var i = 0; i < names.length && i < all.length; i++){
      if(all[i].style.display === 'block') vis.push(names[i]);
    }
    return vis.length === 1 ? vis[0] : ('(' + vis.join('|') + ')');
  }
  (async function(){
    try{
      /* headless は最初の2秒ほどで描き直しを止める。写しの中だけタイマー駆動に差し替える。 */
      window.requestAnimationFrame = function(fn){ return setTimeout(function(){ fn(Date.now()); }, 16); };
      window.cancelAnimationFrame = function(id){ clearTimeout(id); };
      window.closeTitleScreen(); window.toriOpen();
      await sleep(60);
      var cx = window.innerWidth / 2, cy = window.innerHeight * FLOOR;
      var reach = Math.min(window.innerWidth, window.innerHeight) * 0.35;
      var SPOTS = [{ tag:'鞭', r: Math.round(reach) - 20 }, { tag:'豆', r: Math.round(reach) + 60 }];
      for(var s = 0; s < SPOTS.length; s++){
        for(var d = 0; d < DIRS.length; d++){
          /* 毎回始めからやり直す。edaShow(true) が体の向きを正面へ戻すので、
             その一撃だけの結果が見える。 */
          window.toriStart('hard');
          /* 始めた直後は走り込みと喜ぶ動きで、指を受けない。明けるまで待ってから叩く
             （introMs 330 ＋ joyStartMs 600）。待たずに叩くと、この検査は攻撃が
             一度も出ないまま「正面のまま」と読んで落ちる。 */
          await sleep(1150);
          var deg = DIRS[d].deg * Math.PI / 180;
          var root = document.getElementById('toriRoot');
          root.dispatchEvent(new MouseEvent('mousedown', { bubbles:true, cancelable:true,
            clientX: cx + Math.cos(deg) * SPOTS[s].r, clientY: cy + Math.sin(deg) * SPOTS[s].r }));
          /* 指はすぐ離す。押しっぱなしにすると holdMove(300ms) でゾーン移動が起きて、
             待機の向きではなく走りの絵を読んでしまう。ここで見たいのは一度叩いた時の待機。 */
          window.dispatchEvent(new MouseEvent('mouseup', { bubbles:true }));
          await sleep(1600);
          /* 鳥が触れて仰け反っていたら、明けるまで待ってから読む。
             仰け反りは体の向きを変えないので、明けたあとの待機が答えになる。
             待たずに読むと、この検査が「hit が出ている」と言って落ちる（測り方の問題）。 */
          var got = shown();
          for(var wait = 0; wait < 40 && got === 'hit'; wait++){ await sleep(50); got = shown(); }
          out.trials.push({ dir: DIRS[d].k, spot: SPOTS[s].tag, got: got });
        }
      }
    }catch(e){ out.err = String(e && e.stack || e); }
    var n = document.createElement('div');
    n.textContent = 'KOUSHU_IDLE_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(out)))) + 'KOUSHU_IDLE_END';
    document.body.appendChild(n);
  })();
}, 100); });
</script>
`;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-idle-'));
  try {
    const probe = path.join(tmpDir, 'probe.html');
    fs.writeFileSync(probe, src.replace(/<\/body>\s*$/m, IDLE_PROBE + '</body>'), 'utf8');
    const r = spawnSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
      /* 一索の鳥は横画面専用。縦で開くと催促に委ねて遊びが止まるので、必ず横で回す。 */
      '--force-device-scale-factor=1', '--window-size=844,390',
      '--user-data-dir=' + path.join(tmpDir, 'prof'),
      '--virtual-time-budget=120000', '--dump-dom',
      'file:///' + probe.replace(/\\/g, '/')],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });
    const hit = /KOUSHU_IDLE_BEGIN([A-Za-z0-9+/=]+)KOUSHU_IDLE_END/.exec(String(r.stdout || ''));
    if (!hit) { ng('測定結果を取り出せない'); return; }
    const got = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8'));
    if (got.err) { ng('測定中に例外： ' + got.err.slice(0, 200)); return; }

    /* 真上・真下ちょうどは「直前の向きのまま」。試行ごとに始めからやり直すので、
       直前＝開始の正面になる。 */
    const WANT = { u:'idleFront', d:'idleFront', r:'idleRight', ur:'idleRight', dr:'idleRight',
                   l:'idleLeft', ul:'idleLeft', dl:'idleLeft',
                   'u右':'idleRight', 'd右':'idleRight', 'u左':'idleLeft', 'd左':'idleLeft' };
    const bad = [];
    got.trials.forEach(t => {
      if (t.got !== WANT[t.dir]) {
        bad.push(t.spot + 'で ' + t.dir + ' → ' + t.got + '（' + WANT[t.dir] + ' のはず）');
      }
    });
    note('叩いた組み合わせ : ' + got.trials.length + '（八方位＋真上真下を5度傾けた4点 × 鞭の届く内側／豆投げに落ちる外側）');
    note('豆投げの側も必ず叩く。内側だけ見ていると、真上・真下が正面へ戻らない不良を素通しする');
    note('傾けた4点も必ず叩く。八方位ちょうどだけでは、丸めてから左右を決める旧実装と区別がつかない');
    if (got.trials.length !== 24) { ng('叩き切れていない（' + got.trials.length + ' / 24）'); return; }
    if (bad.length === 0) ok('十二方向とも、鞭でも豆投げでも仕様どおりの向きを保つ');
    else { ng('待機の向きが仕様と違う ' + bad.length + '件'); bad.forEach(b => note('  ' + b)); }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

/* ============================================================
   ⑰ 跳躍中に地上の絵が混ざらないか
   仕様：離陸から着地までの全コマが、空中の三枚（上昇・空中切り・降下）のいずれかであること。
   隣のゾーンへ跳ぶときは、押す点が必ず剣の射程の外に落ちるので豆投げが先に発火する。
   v1400 までは、その投げの絵（構え・掴む・弾く・飛行・戻し）が空中の絵を上書きしていた。
   空中かどうかは「出ている絵」ではなく床の影の大きさで見る——影は高さに応じて縮むので、
   どのコマが出ていようと関係なく空中が分かる。出ている絵で空中を判定すると、
   まさに見つけたい不良で判定そのものが狂う。
   ============================================================ */
let jumpSkipped = false;
section('⑰', '跳躍中に地上の絵が混ざらないか', () => {
  const browser = [
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ].filter(p => p && fs.existsSync(p))[0];
  if (!browser) {
    note('ブラウザが見つからないため測定を飛ばす（Edge か Chrome があれば実測する）');
    jumpSkipped = true;
    ok('測定なし');
    return;
  }
  note('測定に使うブラウザ : ' + path.basename(browser));

  const wi2 = src.indexOf('const EDA_WHIP = {');
  if (wi2 < 0) { ng('EDA_WHIP が見つからない'); return; }
  const wb2 = src.slice(wi2, src.indexOf('};', wi2) + 2);
  const KEYS2 = [];
  { const re = /(\w+):'data:image\/png;base64,/g; let m; while ((m = re.exec(wb2))) KEYS2.push(m[1]); }
  const floorRatio2 = Number((src.match(/floorRatio:\s*([0-9.]+)/) || [])[1] || 0.8);
  const holdMove2 = Number((src.match(/holdMove:\s*(\d+)/) || [])[1] || 300);
  const jumpMs2 = Number((src.match(/jumpMs:\s*(\d+)/) || [])[1] || 700);
  note('長押しで跳ぶまで ' + holdMove2 + 'ms ／ 滞空 ' + jumpMs2 + 'ms');

  const JUMP_PROBE = `
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  var KEYS = ${JSON.stringify(KEYS2)};
  var NAGE = ['prepare','grasp','flick','flight','action','tama'];
  var FLOOR = ${floorRatio2};
  var out = { rows: [], ground: null, err: null };
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  /* 見るのは剣士の体のコマだけ。飛んでいる豆（投:tama）は数に入れない——
     豆は跳躍中も飛んでいて当然で、止めるのは絵の上書きだけだから。
     豆が鳥に当たるかどうかで見える見えないが変わるので、入れると検査が揺れる。 */
  function shown(){
    var all = document.querySelectorAll('#toriRoot .tori-eda');
    var names = KEYS.concat(NAGE.map(function(n){ return '投:' + n; }));
    var vis = [];
    for(var i = 0; i < names.length && i < all.length; i++)
      if(all[i].style.display === 'block' && names[i] !== '投:tama') vis.push(names[i]);
    return vis.length === 1 ? vis[0] : ('(' + vis.join('|') + ')');
  }
  /* 床の影の横幅。地上では等倍、高く上がるほど小さくなる。 */
  function shadowW(){
    var s = document.querySelector('.tori-shadow');
    if(!s || s.style.display === 'none') return null;
    return s.getBoundingClientRect().width;
  }
  function down(x, y){ document.getElementById('toriRoot').dispatchEvent(
    new MouseEvent('mousedown', { bubbles:true, cancelable:true, clientX:x, clientY:y })); }
  function up(){ window.dispatchEvent(new MouseEvent('mouseup', { bubbles:true })); }
  (async function(){
    try{
      window.requestAnimationFrame = function(fn){ return setTimeout(function(){ fn(Date.now()); }, 16); };
      window.cancelAnimationFrame = function(id){ clearTimeout(id); };
      window.closeTitleScreen(); window.toriOpen(); window.toriStart('hard');
      await sleep(1200);                       /* 走り込み＋喜びが明けるまで */
      var W = window.innerWidth, H = window.innerHeight;
      var floor = H * FLOOR;
      out.ground = shadowW();                  /* 地上での影の幅を控える */
      /* 真ん中から右のゾーンへ跳ぶ。押す点は頭より十分上（＝跳躍になる）。 */
      down(W * 0.75, floor * 0.35);
      var t0 = Date.now(), lim = ${holdMove2} + ${jumpMs2} + 600;
      while(Date.now() - t0 < lim){
        out.rows.push({ t: Date.now() - t0, f: shown(), sw: shadowW() });
        await sleep(16);
      }
      up();
    }catch(e){ out.err = String(e && e.stack || e); }
    var n = document.createElement('div');
    n.textContent = 'KOUSHU_JUMP_BEGIN' + btoa(unescape(encodeURIComponent(JSON.stringify(out)))) + 'KOUSHU_JUMP_END';
    document.body.appendChild(n);
  })();
}, 100); });
</script>
`;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-jump-'));
  try {
    const probe = path.join(tmpDir, 'probe.html');
    fs.writeFileSync(probe, src.replace(/<\/body>\s*$/m, JUMP_PROBE + '</body>'), 'utf8');
    const r = spawnSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1', '--window-size=844,390',
      '--user-data-dir=' + path.join(tmpDir, 'prof'),
      '--virtual-time-budget=60000', '--dump-dom',
      'file:///' + probe.replace(/\\/g, '/')],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });
    const hit = /KOUSHU_JUMP_BEGIN([A-Za-z0-9+/=]+)KOUSHU_JUMP_END/.exec(String(r.stdout || ''));
    if (!hit) { ng('測定結果を取り出せない'); return; }
    const got = JSON.parse(Buffer.from(hit[1], 'base64').toString('utf8'));
    if (got.err) { ng('測定中に例外： ' + got.err.slice(0, 200)); return; }
    if (!got.ground) { ng('床の影が読めない'); return; }

    const AIR = ['airUpR', 'airUpL', 'airSlashR', 'airSlashL', 'airDownR', 'airDownL'];
    /* 影が縮んでいる間＝空中。等倍のときは地上（跳び際と着地際は等倍に見える）。 */
    const air = got.rows.filter(r => r.sw !== null && r.sw < got.ground * 0.995);
    if (air.length < 8) { ng('跳んでいない（空中と読めた標本 ' + air.length + '個）'); return; }
    const t0 = air[0].t, t1 = air[air.length - 1].t;
    const bad = air.filter(r => AIR.indexOf(r.f) < 0);
    note('離陸 ' + t0 + 'ms → 着地 ' + t1 + 'ms（空中と読めた標本 ' + air.length + '個・約16ms刻み）');
    note('空中の判定は床の影の縮みで行う（出ている絵では判定しない）');
    if (bad.length === 0) {
      ok('離陸から着地まで、全コマが空中の三枚のいずれかだった');
    } else {
      const kinds = {};
      bad.forEach(r => { kinds[r.f] = (kinds[r.f] || 0) + 1; });
      ng('跳躍中に地上の絵が混ざっている ' + bad.length + '標本');
      Object.keys(kinds).forEach(k => {
        const first = bad.filter(r => r.f === k)[0];
        note('  ' + k + ' が ' + kinds[k] + '標本（最初は離陸から ' + (first.t - t0) + 'ms）');
      });
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

/* ---- まとめ ---- */
console.log('');
console.log('='.repeat(52));
sections.forEach(s => {
  /* 測れなかった項目を PASS と並べない。通ったのか、見ていないのかを取り違えないため。 */
  const skipped = (viewSkipped && /狭い画面/.test(s.title)) || (idleSkipped && /待機の向き/.test(s.title))
                  || (jumpSkipped && /跳躍中/.test(s.title));
  const mark = !s.ok ? 'FAIL  ' : (skipped ? 'SKIP  ' : 'PASS  ');
  console.log(mark + s.title);
});
console.log('='.repeat(52));
if (failCount === 0) {
  console.log('納品前チェック：問題なし');
  process.exit(0);
} else {
  console.log('納品前チェック：' + failCount + '件の指摘あり');
  process.exit(1);
}
