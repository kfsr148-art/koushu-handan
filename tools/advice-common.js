/* advice-common.js — 助言の見本（advice-sample.js）と判定カードの絵（advice-shots.js）が共有する物（2026-11-26・枠 三百四十〜三百四十二）。
   ＊FIXED_JS … 写しの中へ差し込む一片（ブラウザの中で動く字）。決まった30局を、種つきの乱数で毎回同じに作る（khFixed(i)）。
     乱数の種は一局ごとに決める（khSeed(i)）。助言の「くじ」（advPickOne）が Math.random を使うので、差し込んだ時に Math.random を種つきに替えて同じ文を再現する。
   ＊findHandStr … 配牌の字（1259m 12236p 116s 中）から、持っている牌の名の集合を出す（配っていない牌の名の検査用）。 */
'use strict';
const FIXED_JS = `
function khMul(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
var khRealRandom = Math.random;
function khSeed(i){ Math.random = khMul(7000 + i); }
function khUnseed(){ Math.random = khRealRandom; }
function khWall(){
  var wall = [];
  ['man','pin','sou'].forEach(function(suit){ for(var n = 1; n <= 9; n++){ if(n === 5){ for(var i = 0; i < 3; i++) wall.push({suit:suit, num:5, red:false}); wall.push({suit:suit, num:5, red:true}); } else { for(var i2 = 0; i2 < 4; i2++) wall.push({suit:suit, num:n, red:false}); } } });
  ['E','S','W','N','P','F','C'].forEach(function(code){ for(var i = 0; i < 4; i++) wall.push({suit:'honor', code:code}); });
  return wall;
}
/* 決まった30局：種つきの乱数で配牌と人格・方言を決める。人格は7人を順に、方言は標準＋各方言を飛び飛びに当てる */
function khFixed(i, tones, dials){
  khSeed(i);
  var wall = khWall();
  for(var k = wall.length - 1; k > 0; k--){ var j = Math.floor(Math.random() * (k + 1)); var t = wall[k]; wall[k] = wall[j]; wall[j] = t; }
  return { tiles: wall.slice(0, 13), tone: tones[i % tones.length], dial: dials[(i * 4 + Math.floor(i / 7)) % dials.length] };
}
`;
const SUIT_JA = { m: '萬', p: '筒', s: '索' }, NUM_JA = '〇一二三四五六七八九';
/* 配牌の字 → 持っている牌の名の集合（二萬・五筒・東 など）。赤五（0）は五。字牌は字のまま（發は発も） */
function handNames(str) {
  const set = new Set(); let digits = '';
  for (const ch of String(str || '')) {
    if (/[0-9]/.test(ch)) { digits += ch; continue; }
    if (SUIT_JA[ch]) { for (const d of digits) { set.add(NUM_JA[d === '0' ? 5 : Number(d)] + SUIT_JA[ch]); } digits = ''; continue; }
    if (/[東南西北白發発中]/.test(ch)) { set.add(ch === '発' ? '發' : ch); }
    if (/[ 　]/.test(ch)) { digits = ''; }
  }
  return set;
}
module.exports = { FIXED_JS, handNames };
