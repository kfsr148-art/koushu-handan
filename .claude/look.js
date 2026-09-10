/* look.js — 読むだけの台本（2026-09-10・承認の足止め-1 ③）
 *
 * なぜ在るか
 *   ＊調べの命令が毎回ひとつずつ承認を訊かれる。allow は**下位命令ごと**に当たるので、
 *     `cd … && ls … | sort … | tail` のような形は、片ごとに項が要る。
 *     `cd` と `echo` には項が無く、`Bash(node -e ' *)` は引用符が単なので `node -e "…"` に当たらない。
 *   ＊そこで**読むだけの手を一本へ寄せ**、その一本だけを allow に入れる。
 *
 * 使い方（かならずこの形で呼ぶ。`cd` も `|` も `&&` も付けない——付けると項から外れる）
 *   node .claude/look.js <役> [引数…]
 *
 *   ls    <道> [並びの型] [--n=数]        … 名・大きさ・更新時刻（新しい順）
 *   read  <道> [始まり行] [行数]           … 行番号つきで読む（cat / head / sed -n の代わり）
 *   tail  <道> [行数]                      … 末尾（既定20行）
 *   find  <字形> <道…> [--i] [--n=数]      … 行番号つきの当たり（grep -n の代わり。道が folder なら潜る）
 *   stat  <道…>                            … 大きさ・行数・更新時刻・BOM の有無
 *   git   <読むだけの下位命令> [引数…]      … status / log / diff / show / rev-list / ls-files ほか
 *   get   <url> [--max=数]                 … 取り置きを破る印を付けて GET（?_chk=<刻>）
 *   json  <道 か url> <op> [欄]            … count / keys / max / min / newest
 *
 * 決まり
 *   ＊**書かない・消さない・押さない。** 走らせるのは git の読む下位命令だけで、殻は通さない。
 *   ＊出しすぎない。既定の上限は 400行 ／ 60000字。`--n=` で増やせる。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const MAX_LINES = 400;
const MAX_CHARS = 60000;

/* ~ と / を、この機械の道へ直す */
function fix(p) {
  if (!p) return p;
  let s = String(p);
  if (s === '~' || s.startsWith('~/') || s.startsWith('~\\')) s = path.join(os.homedir(), s.slice(1));
  return s;
}
function jst(d) {
  const t = new Date(d.getTime() + 9 * 3600 * 1000);
  return t.toISOString().replace('T', ' ').slice(0, 19);
}
function opts(argv) {
  const o = { n: 0, i: false, max: 0, rest: [] };
  for (const a of argv) {
    let m;
    if ((m = /^--n=([0-9]+)$/.exec(a))) o.n = +m[1];
    else if ((m = /^--max=([0-9]+)$/.exec(a))) o.max = +m[1];
    else if (a === '--i') o.i = true;
    else o.rest.push(a);
  }
  return o;
}
function out(lines) {
  let s = lines.join('\n');
  if (s.length > MAX_CHARS) s = s.slice(0, MAX_CHARS) + '\n… （' + MAX_CHARS + '字で切った）';
  process.stdout.write(s + '\n');
}

/* ---- ls ---- */
function doLs(a) {
  const o = opts(a);
  const dir = fix(o.rest[0] || '.');
  const pat = o.rest[1] ? new RegExp(o.rest[1].split('*').map(x => x.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*')) : null;
  const lim = o.n || 80;
  const rows = fs.readdirSync(dir).filter(n => !pat || pat.test(n)).map(n => {
    const full = path.join(dir, n);
    let st = null;
    try { st = fs.statSync(full); } catch (e) { }
    return { n, st };
  }).filter(r => r.st).sort((x, y) => y.st.mtimeMs - x.st.mtimeMs);
  const res = [dir + '  （' + rows.length + '件・新しい順・上位' + Math.min(lim, rows.length) + '）'];
  for (const r of rows.slice(0, lim)) {
    res.push('  ' + jst(r.st.mtime) + '  ' + String(r.st.isDirectory() ? '<dir>' : r.st.size).padStart(10) + '  ' + r.n);
  }
  out(res);
}

/* ---- read / tail ---- */
function doRead(a, tailMode) {
  const o = opts(a);
  const file = fix(o.rest[0]);
  const all = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').split(/\r?\n/);
  let start, count;
  if (tailMode) { count = +(o.rest[1] || 20); start = Math.max(1, all.length - count + 1); }
  else { start = +(o.rest[1] || 1); count = +(o.rest[2] || o.n || MAX_LINES); }
  count = Math.min(count, o.n || MAX_LINES);
  const res = [file + '  （全' + all.length + '行・' + start + '行目から' + count + '行）'];
  for (let i = start; i < start + count && i <= all.length; i++) res.push(String(i).padStart(6) + '  ' + all[i - 1]);
  out(res);
}

/* ---- find ---- */
function walk(p, acc, depth) {
  let st;
  try { st = fs.statSync(p); } catch (e) { return; }
  if (st.isFile()) { acc.push(p); return; }
  if (!st.isDirectory() || depth > 6) return;
  for (const n of fs.readdirSync(p)) {
    if (n === '.git' || n === 'node_modules') continue;
    walk(path.join(p, n), acc, depth + 1);
  }
}
function doFind(a) {
  const o = opts(a);
  const re = new RegExp(o.rest[0], o.i ? 'i' : '');
  const files = [];
  for (const p of o.rest.slice(1).map(fix)) walk(p, files, 0);
  const lim = o.n || 60;
  const res = [];
  let hit = 0;
  for (const f of files) {
    let txt;
    try { txt = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
    if (txt.indexOf('\u0000') >= 0) continue;              // 中身が字でない物は飛ばす
    const lines = txt.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (!re.test(lines[i])) continue;
      hit++;
      if (res.length < lim) res.push(f + ':' + (i + 1) + ':  ' + lines[i].slice(0, 220));
    }
  }
  out([('当たり ' + hit + '件（出したのは' + Math.min(hit, lim) + '件・見た物 ' + files.length + '）')].concat(res));
}

/* ---- stat ---- */
function doStat(a) {
  const res = [];
  for (const p of opts(a).rest.map(fix)) {
    let st;
    try { st = fs.statSync(p); } catch (e) { res.push(p + '  → 無い'); continue; }
    let extra = '';
    if (st.isFile() && st.size < (1 << 26)) {
      const b = fs.readFileSync(p);
      const bom = (b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF);
      let ln = 0;
      for (let i = 0; i < b.length; i++) if (b[i] === 10) ln++;
      extra = '  行=' + (ln + 1) + '  BOM=' + (bom ? '有' : '無');
    }
    res.push(jst(st.mtime) + '  ' + String(st.isDirectory() ? '<dir>' : st.size).padStart(10) + '  ' + p + extra);
  }
  out(res);
}

/* ---- git（読むだけ）---- */
const GIT_OK = ['status', 'log', 'diff', 'show', 'rev-list', 'rev-parse', 'ls-files', 'branch', 'tag',
  'remote', 'describe', 'shortlog', 'blame', 'cat-file', 'count-objects', 'reflog', 'stash'];
function doGit(a) {
  const args = opts(a).rest;
  const sub = args[0];
  if (GIT_OK.indexOf(sub) < 0) { out(['読むだけの下位命令ではない：' + sub + '\n通すのは ' + GIT_OK.join(' / ')]); process.exitCode = 2; return; }
  if (sub === 'stash' && args[1] !== 'list') { out(['stash は list だけ通す']); process.exitCode = 2; return; }
  if (args.indexOf('-p') >= 0 && sub === 'reflog') { /* そのまま */ }
  let r;
  try {
    r = execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 26, cwd: process.cwd() });
  } catch (e) {
    r = (e.stdout || '') + (e.stderr || '') + '\n（終了コード ' + e.status + '）';
  }
  const lines = r.split(/\r?\n/);
  const lim = opts(a).n || MAX_LINES;
  out(lines.slice(0, lim).concat(lines.length > lim ? ['… （' + lines.length + '行のうち' + lim + '行）'] : []));
}

/* ---- get（取り置きを破る印つき）---- */
function fetchText(url, cb) {
  const u = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_chk=' + Math.floor(Date.now() / 1000);
  const lib = u.startsWith('https:') ? require('https') : require('http');
  lib.get(u, { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }, res => {
    let b = '';
    res.setEncoding('utf8');
    res.on('data', d => { b += d; });
    res.on('end', () => cb(null, res.statusCode, b, u));
  }).on('error', e => cb(e));
}
function doGet(a) {
  const o = opts(a);
  fetchText(o.rest[0], (e, code, body, u) => {
    if (e) { out(['読めず：' + e.message]); process.exitCode = 1; return; }
    const cap = o.max || 4000;
    out([u, 'HTTP ' + code + '  ' + body.length + '字', body.slice(0, cap) + (body.length > cap ? '\n… （' + cap + '字で切った）' : '')]);
  });
}

/* ---- json（数える・いちばん新しいを出す）---- */
function jsonReport(src, arrOrObj, op, field) {
  const a = Array.isArray(arrOrObj) ? arrOrObj : [arrOrObj];
  const res = [src + '  （' + (Array.isArray(arrOrObj) ? a.length + '件の配列' : '一つの物') + '）'];
  if (op === 'count') { /* 上の一行で足りる */ }
  else if (op === 'keys') { res.push('  欄: ' + Object.keys(a[0] || {}).join(' / ')); }
  else if (op === 'max' || op === 'min' || op === 'newest') {
    const f = field || 'time';
    const vals = a.map(x => x[f]).filter(v => v !== undefined && v !== null);
    if (!vals.length) { res.push('  欄 ' + f + ' が無い'); }
    else {
      const v = op === 'min' ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
      res.push('  ' + f + ' の' + (op === 'min' ? '最小' : '最大') + ' = ' + v +
        (v > 1e9 && v < 2e9 ? '  = ' + jst(new Date(v * 1000)) : ''));
      if (op === 'newest') {
        const one = a.filter(x => x[f] === v)[0];
        res.push('  中身: ' + JSON.stringify(one).slice(0, 400));
      }
    }
  } else { res.push('  知らない op：' + op + '（count / keys / max / min / newest）'); }
  out(res);
}
function doJson(a) {
  const o = opts(a);
  const src = o.rest[0], op = o.rest[1] || 'count', field = o.rest[2];
  if (/^https?:/.test(src)) {
    fetchText(src, (e, code, body, u) => {
      if (e) { out(['読めず：' + e.message]); process.exitCode = 1; return; }
      try { jsonReport(u + '  HTTP ' + code, JSON.parse(body), op, field); }
      catch (x) { out(['JSON として読めず：' + x.message]); process.exitCode = 1; }
    });
  } else {
    const f = fix(src);
    try { jsonReport(f, JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, '')), op, field); }
    catch (x) { out(['JSON として読めず：' + x.message]); process.exitCode = 1; }
  }
}

/* ---- 入口 ---- */
const [, , verb, ...rest] = process.argv;
try {
  switch (verb) {
    case 'ls': doLs(rest); break;
    case 'read': doRead(rest, false); break;
    case 'tail': doRead(rest, true); break;
    case 'find': doFind(rest); break;
    case 'stat': doStat(rest); break;
    case 'git': doGit(rest); break;
    case 'get': doGet(rest); break;
    case 'json': doJson(rest); break;
    default:
      out(['読むだけの台本。役は ls / read / tail / find / stat / git / get / json',
        '例）node .claude/look.js tail ~/.claude/pipe-warn.log 20',
        '　　node .claude/look.js json notices.json newest time',
        '　　node .claude/look.js git log -3 --oneline']);
  }
} catch (e) {
  out(['誤り：' + e.message]);
  process.exitCode = 1;
}
