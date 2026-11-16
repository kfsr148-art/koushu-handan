#!/usr/bin/env node
/* voice-advice-persona.js — 助言の文の声を、人格の口調（方言なし）で作る台本（2026-11-15・y1115-25 のヨシ・範囲は「方言なし」）
   ＊字に出る文をそのまま、ずんだもんの声で読む。部品の名：advx-<人格>-<部品の名>（助言の部品・人格表の字）／advx-<人格>-scene-<nashi|yakuhai|some1|some2>（場面の文）／advx-ga（「が」）。
   ＊ずんだもん（blunt）の助言の部品は、今ある声がそのまま字と一致するので作らない（場面の文だけ作る）。
   ＊音は軽い形式（IMA ADPCM・adpcm.js）で置く（voice-pieces.js が書く）。
   ＊voice-advice-catalog.js が all() を読み、部品として台帳へ入れる。 */
'use strict';
const C = require('./advice-tone-core.js');
/* 声に渡す読み（読み違いやすい語だけ置き換える。字は変えない）。長い語が先。v1498後：人物の呼びかけ・口癖の殿（しんがりと読まれた）・畏れ・潮目・勘どころ（y1116-5） */
const YOMI = [['殿方', 'とのがた'], ['殿', 'との'], ['畏れ', 'おそれ'], ['潮目', 'しおめ'], ['勘どころ', 'かんどころ'], ['一向聴', 'イーシャンテン'], ['聴牌', 'テンパイ'], ['七対子', 'チートイツ'], ['対々和', 'トイトイホー'], ['国士', 'コクシ'], ['刻子', 'コーツ'], ['順子', 'ジュンツ'], ['対子', 'トイツ'],
  ['雀頭', 'ジャントウ'], ['字牌', 'ジハイ'], ['安全牌', 'アンゼンパイ'], ['役満', 'ヤクマン'], ['二兎', 'にと'], ['定石', 'ジョウセキ'], ['立直', 'リーチ'], ['鳴いて', 'ないて'], ['打点', 'ダテン'],
  ['受け入れ', 'うけいれ'], ['受けの', 'うけの'], ['受けを', 'うけを'], ['浮いた', 'ういた'], ['浮いて', 'ういて'], ['浮いて', 'ういて'], ['重なり', 'かさなり'], ['一組', 'ひとくみ'], ['一枚', 'いちまい'],
  ['拝見', 'はいけん'], ['高う', 'たこう'], ['遠う', 'とおう'], ['安う', 'やすう'], ['少のう', 'すくのう'], ['速う', 'はよう'], ['端の', 'はしの'], ['端と', 'はしと'], ['牌', 'ハイ'], ['染め', 'そめ'],
  ['役', 'やく'], ['形', 'かたち'], ['点', 'てん'], ['手が', 'てが'], ['手は', 'ては'], ['何巡目', 'なんじゅんめ'], ['巡目', 'じゅんめ']];
/* 「漢字（カナ）」の並びは、括弧の中の読みだけを一回読む（立直（リーチ）→リーチ。字の方は変えない）。先にこれを通す（y1115-48） */
const PAREN = new RegExp('[一-龥々〆ヵヶ]+（([ぁ-んァ-ヶー・]+)）', 'g');
function say(t) { let s = t.replace(PAREN, '$1'); YOMI.forEach(function (p) { s = s.split(p[0]).join(p[1]); }); return s; }
function all() {
  const out = [];
  C.ADV_TONE_KEYS.filter(function (k) { return k !== 'blunt'; }).forEach(function (tone) {
    Object.keys(C.ADV_TONE[tone]).forEach(function (id) {
      if (id === 'adva-head' || id === 'advd-head') { return; }   // 最初の攻め／守りは advh-… が別にある
      const t = C.ADV_TONE[tone][id]; out.push(['advx-' + tone + '-' + id, t, say(t)]);
    });
  });
  C.ADV_TONE_KEYS.forEach(function (tone) {
    const s = C.ADV_SCENE[tone];
    [['scene-nashi', s.nashi], ['scene-yakuhai', s.yakuhai[0]], ['scene-some1', s.some[0]], ['scene-some2', s.some[1]]].forEach(function (x) { out.push(['advx-' + tone + '-' + x[0], x[1], say(x[1])]); });
  });
  out.push(['advx-ga', 'が', 'が']);
  return out;
}
module.exports = { all, say };
if (require.main === module) { const a = all(); console.log('人格の助言の声 ' + a.length + '本'); }
