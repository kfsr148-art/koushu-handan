// v1508：執事×方言の決め（口調表 一人目・2026-11-18）を核 advice-tone-core.js の advTalk へ入れる。
'use strict';
const fs = require('fs');
const p = 'C:/Users/user/Desktop/mahjong/koushu-handan/advice-tone-core.js';
let s = fs.readFileSync(p, 'utf8');
const eol = s.includes('\r\n') ? '\r\n' : '\n';
function rep(a, b) { if (s.split(a).length !== 2) { console.log('NG: ' + a.slice(0, 60)); process.exit(1); } s = s.replace(a, () => b); }
const def = [
"/* v1508 執事×方言の決め（reports/kuchou-hyou.md の一人目・2026-11-18 本人の決め）。advTalk が執事の時だけ使う。",
"   std：標準の丁寧語の字のまま（方言の語尾・呼び名を付けない）に、元のある形だけ足す（fx）。k＝口癖（無ければ標準のつなぎ）。",
"   宮崎＝ございます→ござんす・てください→てくいやんせ（ウィキペディア「宮崎弁」）／博多＝てください→てんしゃい（ウィキペディア「博多弁」・要検証）／",
"   京都＝おVなさいませ→おVおくれやす・名詞＋です→どす（fun-japan 京ことば）／青森＝標準のまま（弘大の辞書で確かめられるまで）／",
"   沖縄＝です・でございます→やいびーん・お願いいたします→うにげーさびら（本人の指摘・okinawa-labo・ウィキブックス「沖縄語/動詞文」。沖縄語の元が無い動詞は作らない）。",
"   大阪＝船場言葉（ねん・どない・やで を使わない・ございます→おます（一つの言葉に一度）・呼び名 だんさん）／武士＝一人称 それがし・呼び名「殿」を付けない／",
"   幼児＝ミント型（標準の執事の字のまま、音だけ す→しゅ・さ→しゃ・し→ち・せ→しぇ・ござ→ごじゃ、最初と最後を「ばぶ」で挟む。漢字は ADV_YOJI_KANA の読みでひらがなに）。 */",
"function advSenba(s0) {",
"  let t = s0, used = false;",
"  t = t.replace(/どないしはりますねん|どないしますねん/g, 'どうなさいますか').replace(/どない/g, 'どう').replace(/お客様|旦那はん|旦那さま/g, 'だんさん');",
"  t = t.replace(/(で|に)ございます(?:で|わ|ねん)?/g, function (m, a) { if (!used) { used = true; return a + 'おます'; } return 'です'; });",
"  t = t.replace(/ございまして/g, 'おまして').replace(/ございません(?:で)?/g, function () { if (used) { return 'ありません'; } used = true; return 'おまへん'; });",
"  t = t.replace(/ようございますなぁ/g, 'ようおますなぁ').replace(/ございます(?:で|ねん)?(?=[。、！？…])/g, function () { if (used) { return 'ます'; } used = true; return 'おます'; });",
"  t = t.replace(/(ます|ました|ません)ねん/g, '$1わ').replace(/(です|だす)ねん/g, 'ですわ').replace(/ますで(?=[。、！？…])/g, 'ますわ').replace(/ませんで(?=[。、！？…])/g, 'ませんわ');",
"  return t.replace(/やろけど/g, 'でっしゃろけど').replace(/やで(?=[。、！？…])/g, 'です').replace(/ねん(?=[。、！？…])/g, 'わ');",
"}",
"const ADV_YOJI_KANA = {};   // 幼児の読み（標準の執事の字 → ひらがなの字）。雲の読みの道具で作って入れる",
"function advMint(s) { const m = { 'ござ': 'ごじゃ', 'す': 'しゅ', 'さ': 'しゃ', 'し': 'ち', 'せ': 'しぇ' }; return s.replace(/ござ|[すさしせ]/g, function (x) { return m[x]; }); }",
"const ADV_BUTLER_DIAL = {",
"  miyazaki: { std: true, k: 'ひとつ申し上げます', fx: function (s) { return s.replace(/てくださいませ|てください/g, 'てくいやんせ').replace(/ございます/g, 'ござんす'); } },",
"  hakata: { std: true, k: 'あきんどの勘どころです', fx: function (s) { return s.replace(/てくださいませ|てください/g, 'てんしゃい'); } },",
"  kyoto: { std: true, k: 'おそれいります', fx: function (s) { return s.replace(/お([^、。！？\\s]{1,6}?)なさいませ/g, 'お$1おくれやす').replace(/([^いますでし])です(?=[。！？])/g, '$1どす'); } },",
"  aomori: { std: true, k: '', fx: null },",
"  okinawa: { std: true, k: '畏れながら', fx: function (s) { return s.replace(/お願いいたします|お願い申し上げます/g, 'うにげーさびら').replace(/でございます(?=[。！？])/g, 'やいびーん').replace(/([^いますでし])です(?=[。！？])/g, '$1やいびーん'); } },",
"  osaka: { std: false, c: 'だんさん', fx: advSenba },",
"  bushi: { std: false, c: '', fx: function (s) { return s.replace(/わたくし/g, 'それがし'); } },",
"  yoji: { std: true, k: '', yoji: true, fx: function (s) { return advMint(ADV_YOJI_KANA[s] || s); } }",
"};",
""
].join(eol);
rep("function advTalk(lines, tone, dial, hasEnd) {", def + "function advTalk(lines, tone, dial, hasEnd) {");
rep("  const polite = !!ADV_POLITE[tone], units = [];" + eol,
  "  const bk = (tone === 'butler' && dial) ? (ADV_BUTLER_DIAL[dial] || null) : null;   // v1508 執事×方言の決め" + eol +
  "  if (bk && bk.std) { dial = ''; }   // 標準の丁寧語の字のまま（方言の語尾・つなぎを通さない）" + eol +
  "  const polite = !!ADV_POLITE[tone], units = [];" + eol);
rep("  const chara = dial ? (ADV_CHARA[dial] && ADV_CHARA[dial][tone]) : null;",
  "  let chara = dial ? (ADV_CHARA[dial] && ADV_CHARA[dial][tone]) : null;" + eol +
  "  if (bk) { chara = bk.std ? (bk.k ? { k: bk.k, c: '' } : null) : { k: chara.k, c: (bk.c !== undefined ? bk.c : chara.c) }; }");
rep("      if (tk.head) { (x.match(", "      if (bk && bk.fx && !tk.lit && !tk.head) { x = bk.fx(x); }   // v1508 執事×方言（頭の一言・面白みは書いた字のまま）" + eol + "      if (tk.head) { (x.match(");
rep("  if (chara && !lines.noAddr) {", "  if (chara && chara.c && !lines.noAddr) {");
rep("  text = items.map(function (x) { return x.text; }).join('');" + eol + "  return { items: items, text: text };",
  "  if (bk && bk.yoji && items.length) {   // 幼児：最初と最後を「ばぶ」で挟む（つなぎと同じ扱いの声）" + eol +
  "    const w = advHash(items.map(function (x) { return x.text; }).join('')).charCodeAt(7) % 2;" + eol +
  "    items.unshift({ conn: true, slot: -1, text: w ? 'ばぶばぶ。' : 'ばぶー。' }); items.push({ conn: true, slot: -1, text: w ? 'ばぶー。' : 'ばぶ。' });" + eol +
  "  }" + eol +
  "  text = items.map(function (x) { return x.text; }).join('');" + eol + "  return { items: items, text: text };");
fs.writeFileSync(p, s);
console.log('ok');
