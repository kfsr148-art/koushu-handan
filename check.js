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
const HTML_PATH = path.join(ROOT, 'koushu-handan.html');
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

/* ---- まとめ ---- */
console.log('');
console.log('='.repeat(52));
sections.forEach(s => console.log((s.ok ? 'PASS  ' : 'FAIL  ') + s.title));
console.log('='.repeat(52));
if (failCount === 0) {
  console.log('納品前チェック：問題なし');
  process.exit(0);
} else {
  console.log('納品前チェック：' + failCount + '件の指摘あり');
  process.exit(1);
}
