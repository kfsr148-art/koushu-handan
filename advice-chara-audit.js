#!/usr/bin/env node
/* advice-chara-audit.js — 人物（人格×方言56人）の点検（2026-11-15・v1497）
   ＊advice-talk-sim.js の全組み合わせを組み、次を数える。本体には入れない。
     ① 同じ語尾が三文続く所（末尾4字）
     ② 方言ありの文に、人物から外れた言葉が混じる所（方言なしの文は対象外）
        ・一姫以外の「にゃ」／外国語の呼びかけ（ウィ・モナミ）／ずんだ以外の「のだ」（方言の語を伴う「のだばい」等は除く）
        ・武士以外の「ござる・ござらぬ・ぞよ」／読点のあとに語尾だけが付く「、にござる」「、でござる」
     ③ 人物の表（ADV_CHARA）の呼びかけ・口癖が、その人物の文に出ているか（呼びかけは終わりの文・口癖は最初のつなぎ）
   ＊使い方：node advice-chara-audit.js（問題があれば終了コード1） */
'use strict';
const S = require('./advice-talk-sim.js');
const C = require('./advice-tone-core.js');
let total = 0, runs = 0, ovl = 0; const bad = {}, miss = { c: 0, k: 0 };
S.each((r, c) => {
  total++;
  if (c.omo && C.advOmoOverlaps(c.omoScene, c.ids)) { ovl++; }   // 一言と助言の中身の意味の重なり（v1503）
  const ss = r.text.split(/(?<=[。！？])/).filter(Boolean); let run = 1;
  for (let k = 1; k < ss.length; k++) { if (ss[k].slice(-4) === ss[k - 1].slice(-4)) { run++; if (run === 3) runs++; } else { run = 1; } }
  if (!c.dial) return;
  const ch = C.ADV_CHARA[c.dial] && C.ADV_CHARA[c.dial][c.tone];
  if (!ch) { bad[c.tone + '|' + c.dial + ' 人物の表に無い'] = 1; return; }
  if (r.text.indexOf('、' + ch.c + '。') < 0 && r.text.indexOf('、' + ch.c + '！') < 0 && r.text.indexOf('、' + ch.c + '？') < 0) miss.c++;
  if (r.text.indexOf(ch.k + '、') < 0) miss.k++;
  ss.forEach(x => {
    const e = x.replace(/[。！？]$/, '').slice(-6), key = c.tone + '|' + c.dial;
    if (c.tone !== 'ichihime' && /にゃ/.test(x)) bad[key + ' にゃ ' + e] = 1;
    if (/ウィ|モナミ/.test(x)) bad[key + ' 外国語 ' + e] = 1;
    if (c.tone !== 'blunt' && /のだ/.test(x.replace(/[。！？]$/, '').slice(-3))) bad[key + ' のだ ' + e] = 1;
    if (c.dial !== 'bushi' && /ござる|ござらぬ|ぞよ。/.test(x)) bad[key + ' 武士の語尾 ' + e] = 1;
    if (/、(にござる|でござる)/.test(x)) bad[key + ' 読点のあとに語尾 ' + e] = 1;
  });
});
const keys = Object.keys(bad);
let omoBad = 0; const seenT = {};   // 一言：人物の数・場面×五通り・形・ほかの人物と同じ文（v1503）
Object.keys(C.ADV_OMO).forEach(k => ['dora', 'far', 'honor', 'guard', 'special', 'nick'].forEach(s => { const a = C.ADV_OMO[k][s]; if (!a || a.length !== 5) { omoBad++; console.log('  一言が五通りで無い ' + k + ' ' + s); return; } a.forEach(x => { if (seenT[x]) { omoBad++; console.log('  同じ文 ' + x + ' ← ' + seenT[x] + ' / ' + k + ' ' + s); } seenT[x] = k + ' ' + s; if (s === 'nick' ? (!/^、/.test(x) || /[。！？]$/.test(x)) : !/[。！？]$/.test(x)) { omoBad++; console.log('  形が違う ' + k + ' ' + s + ': ' + x); } }); }));
if (Object.keys(C.ADV_OMO).length !== 56) { omoBad++; console.log('  一言の人物が56人でない ' + Object.keys(C.ADV_OMO).length); }
let ovlDead = 0; { const TT = require('./voice-advice-catalog.js').T; Object.keys(C.ADV_OMO_OVERLAP).forEach(sn => { if (!Object.keys(TT).some(id => C.ADV_OMO_OVERLAP[sn].test(id))) { ovlDead++; console.log('  重なりの印が台帳に無い ' + sn); } }); }
console.log('一言 ' + Object.keys(C.ADV_OMO).length + '人・' + Object.keys(seenT).length + '文／形・重複の指摘 ' + omoBad);
console.log('組み合わせ ' + total + '通り／同じ語尾が三文続く ' + runs + '件／人物から外れた言葉 ' + keys.length + '種／一言と助言の重なり ' + ovl + '件／呼びかけが出ない ' + miss.c + '件／口癖が出ない ' + miss.k + '件');
keys.slice(0, 40).forEach(k => console.log('  ' + k));
process.exit(runs === 0 && ovl === 0 && omoBad === 0 && ovlDead === 0 && keys.length === 0 && miss.c === 0 && miss.k === 0 ? 0 : 1);
