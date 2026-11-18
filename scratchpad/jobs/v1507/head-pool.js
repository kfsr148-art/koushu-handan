#!/usr/bin/env node
/* head-pool.js — 判定の「一言」（助言の頭に入れる文）の候補を、本体の pickVerdictWord と同じ規則で集める（v1506・y1118）
   ＊本体の TONE_WORDS・DIALECT_WORDS を koushu-handan.html から取り出して使う（写しは作らない）。
   ＊pool(dial, tone, m, sd) → { normal:[字…], border:[…], ph:[…], dr:[…] }（本体の選び方：役満→国士→際どい→通常。各区分は「ツン／デレ版があればそれ、無ければ素」）
   ＊字は normHead() で整える：文の終わりの印（。！？…）が無ければ「。」を足す。声の名は advDialVoice(整えた字)。 */
'use strict';
const fs = require('fs');
const HTML = process.env.HEAD_HTML || 'C:/Users/user/Desktop/mahjong/koushu-handan/koushu-handan.html';
let _D = null, _T = null;
function grab(h, name) { const i = h.indexOf('const ' + name + ' = {'); let j = h.indexOf('{', i), d = 0, k = j; for (; k < h.length; k++) { const c = h[k]; if (c === '{') { d++; } else if (c === '}') { d--; if (d === 0) { break; } } } return h.slice(j, k + 1); }
function load() { if (_D) { return; } const h = fs.readFileSync(HTML, 'utf8'); _T = (0, eval)('(' + grab(h, 'TONE_WORDS') + ')'); _D = (0, eval)('(' + grab(h, 'DIALECT_WORDS') + ')'); }
function flat(x) { return x === undefined || x === null ? [] : (Array.isArray(x) ? x : [x]); }
function normHead(s) { s = s.replace(/\s+$/, ''); return /[。！？!?…]$/.test(s) ? s : s + '。'; }
function src(dial, tone) {   // 本体の wordSrc と同じ
  load();
  if (dial && _D[dial]) { const d = _D[dial], bt = d.byTone && d.byTone[tone]; return { v: bt ? bt.v : d.v, sp: { ph: ((d.byTone && d.byTone[tone]) || {}).ph || d.ph, dr: ((d.byTone && d.byTone[tone]) || {}).dr || d.dr, ae: ((d.byTone && d.byTone[tone]) || {}).ae || d.ae, ed: ((d.byTone && d.byTone[tone]) || {}).ed || d.ed } }; }
  const bv = _T[tone]; return { v: bv, sp: bv };
}
function pool(dial, tone, m, sd) {
  const s = src(dial, tone), v = s.v || {}, sp = s.sp || {};
  const T = (m === 't') ? (v.taunt || null) : (m === 'd') ? (v.dere || null) : null;
  const k = sd === 'a' ? 'a' : 'd', kb = sd === 'a' ? 'ae' : 'ed';
  const pick = (a, b) => { const x = flat(a); return x.length ? x : flat(b); };
  const o = {
    ph: pick(T && T.ph, sp.ph), dr: pick(T && T.dr, sp.dr), border: pick(T && T[kb], sp[kb]),
    normal: (T && flat(T[k]).length) ? flat(T[k]) : flat(v[k])
  };
  Object.keys(o).forEach(c => { o[c] = [...new Set(o[c].map(normHead))]; });
  return o;
}
function allPhrases() {   // 全組み合わせの一言（重複なし）：Map 字 → 件数
  load(); const set = new Set();
  const dials = [''].concat(Object.keys(_D)), tones = Object.keys(_T);
  dials.forEach(dl => tones.forEach(t => ['n', 'd', 't'].forEach(m => ['a', 'd'].forEach(sd => { const p = pool(dl, t, m, sd); Object.keys(p).forEach(c => p[c].forEach(x => set.add(x))); }))));
  return set;
}
module.exports = { pool, normHead, allPhrases };
if (require.main === module) {
  const s = allPhrases(); let mx = 0, mxs = ''; s.forEach(x => { if (x.length > mx) { mx = x.length; mxs = x; } });
  console.log('一言の字の種類', s.size, '／最長', mx, '字：', mxs);
  const D = _D; console.log('方言', Object.keys(D).join(','), '／人柄', Object.keys(_T).join(','));
}
