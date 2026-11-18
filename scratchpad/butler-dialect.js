// 執事（butler）×方言の書き換えの規則（v1508・口調表の執事九行の決め 2026-11-18）。
//   fix(text, dial)：一つの字を、その方言の執事の決めに合わせて書き換える。
//   本体・核へ入れる前の道具。書いた字（頭の一言・面白み）の前→後の一覧を reports へ出す。
'use strict';
const STD = { miyazaki: 1, hakata: 1, kyoto: 1, aomori: 1, okinawa: 1 };   // 標準の丁寧語＋元のある形だけ
const END = '(?:とよ|っちゃ|ちゃ|けん|ばい|たい|びょん|だべ|べ|さー|やさ|え|わ|のう|ぞ)';
function stripStd(t) {
  let s = t;
  s = s.replace(/(旦那さま|旦那さん|旦那はん|殿)、/g, '').replace(/、(旦那さま|旦那さん|旦那はん|殿)(?=[。！？…])/g, '');
  s = s.replace(new RegExp('(る|た|い|す|ん|う)' + END + '(でございます)', 'g'), '$1の$2');   // 攻めるっちゃでございます→攻めるのでございます
  s = s.replace(new RegExp('(ございます|ございません|ございましょう|います|ます|ません|ました|でしょう|です|ませ|ください|なさい|存じます|参ります|申し上げます|かと)' + END + '(?=[、。！？…」]|$)', 'g'), '$1');
  s = s.replace(/ますえ(?=[、。！？…]|$)/g, 'ます');
  return s;
}
const ADD = {
  miyazaki: s => s.replace(/てくださいませ|てください/g, 'てくいやんせ').replace(/ございます/g, 'ござんす'),   // 元：ウィキペディア「宮崎弁」（依頼「〜くいやんせ」・ございます相当「ござんす」）
  hakata: s => s.replace(/てくださいませ|てください/g, 'てんしゃい'),   // 元：ウィキペディア「博多弁」（丁寧な命令「〜てんしゃい」・要検証）
  kyoto: s => s.replace(/お([^、。！？\s]{1,6}?)なさいませ/g, 'お$1おくれやす').replace(/([^いますでし])です(?=[。！？])/g, '$1どす'),   // 元：fun-japan 京ことば（おくれやす・どす）
  okinawa: s => s.replace(/お願いいたします|お願い申し上げます/g, 'うにげーさびら').replace(/でございます(?=[。！？])/g, 'やいびーん').replace(/([^いますでし])です(?=[。！？])/g, '$1やいびーん'),   // 元：本人の指摘・okinawa-labo・ウィキブックス（やいびーん＝です／うにげーさびら）。動詞の沖縄語の元が無い所は作らない
  aomori: s => s
};
function senba(s0) {   // 大阪＝船場言葉（reports/v1508-senba-butler-osaka.txt と同じ規則）
  let t = s0;
  t = t.replace(/どないしはりますねん|どないしますねん/g, 'どうなさいますか').replace(/どない/g, 'どう');
  t = t.replace(/お客様|旦那はん|旦那さま/g, 'だんさん');
  let used = false;
  t = t.replace(/(で|に)ございます(?:で|わ|ねん)?/g, (m, a) => { if (!used) { used = true; return a + 'おます'; } return 'です'; });
  t = t.replace(/ございまして/g, 'おまして');
  t = t.replace(/ございません(?:で)?/g, m => (used ? 'ありません' : (used = true, 'おまへん')));
  t = t.replace(/ようございますなぁ/g, 'ようおますなぁ');
  t = t.replace(/ございます(?:で|ねん)?(?=[。、！？…])/g, () => (used ? 'ます' : (used = true, 'おます')));
  t = t.replace(/(ます|ました|ません)ねん/g, (m, a) => (a === 'ます' ? 'ますわ' : a === 'ました' ? 'ましたわ' : 'ませんわ'));
  t = t.replace(/(です|だす)ねん/g, 'ですわ').replace(/ますで(?=[。、！？…])/g, 'ますわ').replace(/ませんで(?=[。、！？…])/g, 'ませんわ');
  t = t.replace(/やろけど/g, 'でっしゃろけど').replace(/やで(?=[。、！？…])/g, 'です').replace(/ねん(?=[。、！？…])/g, 'わ');
  return t;
}
function bushi(s) { return s.replace(/わたくし/g, 'それがし').replace(/(殿)、/g, '').replace(/、殿(?=[。！？…])/g, ''); }
function mintSound(s) {   // 幼児（ミント）：言葉は替えず音だけ。す→しゅ・さ→しゃ・し→ち・せ→しぇ・ござ→ごじゃ
  const M = { 'ござ': 'ごじゃ', 'す': 'しゅ', 'さ': 'しゃ', 'し': 'ち', 'せ': 'しぇ' };   // 一回の置き換えで（さ→しゃ の後に し→ち が掛かって「ちゃ」になるのを防ぐ）
  return s.replace(/ござ|[すさしせ]/g, m => M[m]);
}
function fix(text, dial) {
  if (STD[dial]) { return ADD[dial](stripStd(text)); }
  if (dial === 'osaka') { return senba(text); }
  if (dial === 'bushi') { return bushi(text); }
  if (dial === 'yoji') { return mintSound(text); }
  return text;
}
module.exports = { fix, stripStd, senba, bushi, mintSound, STD };
if (require.main === module) {
  const fs = require('fs'), path = require('path');
  const R = path.join(__dirname, '..');
  global.ADV_TEXT = require(R + '/voice-advice-catalog.js').T;
  const C = require(R + '/advice-tone-core.js'), HP = require('./jobs/v1507/head-pool.js');
  const DIALS = ['miyazaki', 'hakata', 'osaka', 'kyoto', 'aomori', 'okinawa', 'bushi', 'yoji'];
  const out = ['# 執事×方言の書き換え（v1508・①の道具の出力）：書いた字（頭の一言・面白み）の前→後。欄＝方言｜種類｜前｜後', '',
    '注：宮崎・博多・京都・青森・沖縄の頭の一言は、方言の表ではなく標準の表（同じ文に方言の語尾を足しただけの物）を使い、元のある形だけ足す。幼児は音だけ（漢字は読みの辞書が無いのでまだ残る＝ひらがな化は②で読みの道具を当てる）。', ''];
  const cnt = {};
  DIALS.forEach(d => {
    const heads = new Set(), headsStd = new Set();
    ['n', 'd', 't'].forEach(m => ['a', 'd'].forEach(sd => { const p = HP.pool(d, 'butler', m, sd); Object.values(p).forEach(a => a.forEach(x => heads.add(x))); const q = HP.pool('', 'butler', m, sd); Object.values(q).forEach(a => a.forEach(x => headsStd.add(x))); }));
    const src = STD[d] ? [...headsStd] : [...heads];
    let ch = 0, n = 0;
    src.forEach(x => { const y = fix(x, d); n++; if (y !== x || STD[d]) ch++; out.push([d, STD[d] ? '頭の一言（標準の表から）' : '頭の一言', x, y].join('\t')); });
    const om = C.ADV_OMO[d + ':butler'] || {};
    Object.keys(om).forEach(k => om[k].forEach(x => { const y = fix(x, d); n++; if (y !== x) ch++; out.push([d, '面白み・' + k, x, y].join('\t')); }));
    cnt[d] = n + '本中 ' + ch + '本を書き換え';
  });
  fs.writeFileSync(R + '/reports/v1508-butler-dialect.txt', out.join('\n') + '\n');
  console.log(JSON.stringify(cnt, null, 1));
}
