// v1508：執事×幼児の字（ひらがな寄り）を、雲の読み reports/v1508-yoji-yomi.json から組む。
//   ＊元の字（t）→ 声に渡す字（said）の漢字の並びだけを、VOICEVOX のモーラの読みで仮名にする。仮名・数字・記号はそのまま。
//   ＊漢字の後ろに送り仮名（ひらがな・助詞でない）が続けば和語＝長音を書き言葉に（モオ→もう・セエ→せい）、
//     それ以外は漢語＝長音を「ー」に（ショオブ→しょーぶ）。片仮名はひらがなに（ーは残す）。
//   ＊合わせられなかった字は表に入れず、一覧に「合わず」と出す（その字は漢字のまま音の規則だけ掛かる）。
//   ＊出力：reports/v1508-yoji-kana.json（{元の字: 幼児の字}）と reports/v1508-yoji-kana.txt（前→後の一覧）。
'use strict';
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const rows = JSON.parse(fs.readFileSync(path.join(R, 'reports', 'v1508-yoji-yomi.json'), 'utf8'));
const K2H = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const H2K = s => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
const isKanji = c => /[一-鿿々〆]/.test(c);
const isHira = c => /[ぁ-ゖ]/.test(c);
const isKata = c => /[ァ-ヶー]/.test(c);
const VOW = { ア: 'ア', カ: 'ア', ガ: 'ア', サ: 'ア', ザ: 'ア', タ: 'ア', ダ: 'ア', ナ: 'ア', ハ: 'ア', バ: 'ア', パ: 'ア', マ: 'ア', ヤ: 'ア', ャ: 'ア', ラ: 'ア', ワ: 'ア',
  イ: 'イ', キ: 'イ', ギ: 'イ', シ: 'イ', ジ: 'イ', チ: 'イ', ヂ: 'イ', ニ: 'イ', ヒ: 'イ', ビ: 'イ', ピ: 'イ', ミ: 'イ', リ: 'イ',
  ウ: 'ウ', ク: 'ウ', グ: 'ウ', ス: 'ウ', ズ: 'ウ', ツ: 'ウ', ヅ: 'ウ', ヌ: 'ウ', フ: 'ウ', ブ: 'ウ', プ: 'ウ', ム: 'ウ', ユ: 'ウ', ュ: 'ウ', ル: 'ウ',
  エ: 'エ', ケ: 'エ', ゲ: 'エ', セ: 'エ', ゼ: 'エ', テ: 'エ', デ: 'エ', ネ: 'エ', ヘ: 'エ', ベ: 'エ', ペ: 'エ', メ: 'エ', レ: 'エ',
  オ: 'オ', コ: 'オ', ゴ: 'オ', ソ: 'オ', ゾ: 'オ', ト: 'オ', ド: 'オ', ノ: 'オ', ホ: 'オ', ボ: 'オ', ポ: 'オ', モ: 'オ', ヨ: 'オ', ョ: 'オ', ロ: 'オ', ヲ: 'オ' };
const PUNCT = /[、。！？!?…「」『』（）()・\s,.]/g;
// 仮名一字 → モーラの並びで受けてよい形（は→ワ・へ→エ・を→オ・う／い の長音・ー）
function kanaAlt(c, prev) {
  const k = H2K(c), alts = new Set([k]);
  if (k === 'ハ') { alts.add('ワ'); } if (k === 'ヘ') { alts.add('エ'); } if (k === 'ヲ') { alts.add('オ'); }
  const pv = prev ? VOW[prev] : null;
  if (k === 'ウ' && pv === 'オ') { alts.add('オ'); }
  if (k === 'イ' && pv === 'エ') { alts.add('エ'); }
  if (k === 'ー' && pv) { alts.add(pv); }
  return '(?:' + [...alts].map(x => x.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')).join('|') + ')';
}
function longVowel(kata, native) {   // 読みの中の母音の重なりを、和語は書き言葉・漢語は「ー」に
  let out = '';
  for (let i = 0; i < kata.length; i++) {
    const c = kata[i], pv = out ? VOW[out[out.length - 1]] : null;
    if (pv && VOW[c] === c && 'アイウエオ'.includes(c)) {
      if ((pv === 'オ' && (c === 'オ' || c === 'ウ')) || (pv === 'ウ' && c === 'ウ') || (pv === 'エ' && (c === 'イ' || c === 'エ'))) {   // あ・い段の重なりは語の境（マイ＋イジョウ）の事があるので触らない
        if (native) { out += (pv === 'オ' ? 'ウ' : pv === 'エ' ? 'イ' : c); } else { out += 'ー'; }
        continue;
      }
    }
    out += c;
  }
  return out;
}
const PARTICLE = /^[のをはがにでともへやかね]/;
const table = {}, list = [], miss = [];
rows.forEach(({ t, said, kana }) => {
  if (!/[一-鿿]/.test(said) && !/[ァ-ヶ]/.test(said)) { return; }
  const src = said;
  const segs = []; let i = 0;   // {type:'k'|'kana'|'other', s}
  while (i < src.length) {
    const c = src[i];
    if (isKanji(c)) { let j = i; while (j < src.length && isKanji(src[j])) { j++; } segs.push({ type: 'k', s: src.slice(i, j) }); i = j; }
    else if (isHira(c) || isKata(c)) { segs.push({ type: 'kana', s: c }); i++; }
    else if (/[0-9０-９A-Za-z]/.test(c)) { let j = i; while (j < src.length && /[0-9０-９A-Za-z]/.test(src[j])) { j++; } segs.push({ type: 'num', s: src.slice(i, j) }); i = j; }
    else { segs.push({ type: 'other', s: c }); i++; }
  }
  let re = '^', prevK = '';
  segs.forEach(g => {
    if (g.type === 'k' || g.type === 'num') { re += '(.+?)'; prevK = ''; }
    else if (g.type === 'kana') { re += kanaAlt(g.s, prevK); prevK = H2K(g.s) === 'ー' ? prevK : H2K(g.s); }
  });
  re += '$';
  const mora = kana.replace(PUNCT, '');
  const m = mora.match(new RegExp(re));
  if (!m) { miss.push(t); return; }
  let gi = 1, out = '';
  segs.forEach((g, idx) => {
    if (g.type === 'k') {
      const rd = m[gi++]; const nx = segs[idx + 1];
      const native = !!(nx && nx.type === 'kana' && isHira(nx.s) && !PARTICLE.test(nx.s));
      out += K2H(longVowel(rd, native));
    } else if (g.type === 'num') { gi++; out += g.s; }
    else if (g.type === 'kana') { out += isKata(g.s) && g.s !== 'ー' ? K2H(g.s) : g.s; }
    else { out += g.s; }
  });
  table[t] = out; list.push(t + '\t' + out);
});
fs.writeFileSync(path.join(R, 'reports', 'v1508-yoji-kana.json'), JSON.stringify(table, null, 1));
fs.writeFileSync(path.join(R, 'reports', 'v1508-yoji-kana.txt'), '# 執事×幼児の字（元の字→ひらがな寄り。音の規則 す→しゅ等 は核が後で掛ける）\n' + list.join('\n') + '\n\n# 合わず（漢字のまま）' + miss.length + '本\n' + miss.join('\n') + '\n');
console.log('表 ' + Object.keys(table).length + '本・合わず ' + miss.length + '本');
