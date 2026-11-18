// 今の声（v1506）の方言の字で、人格の口癖の語尾に方言の語尾が重なった崩れを、人格×方言で数える。
const S = require('./advice-talk-sim.js'), C = require('./advice-tone-core.js'), fs = require('fs');
const dialJson = JSON.parse(fs.readFileSync('voice-advice-dial.json', 'utf8'));
const cur = new Set(Object.keys(dialJson).map(k => k.replace(/[.]wav[.]wav$/, '')));   // 今の声（v1506）の声の名
const seen = new Map();
S.each((r, c) => { r.items.forEach(x => { if (!(x.conn || x.changed)) return; const nm = C.advDialVoice(x.text); if (cur.has(nm) && !seen.has(nm)) seen.set(nm, { text: x.text, tone: c.tone, dial: c.dial }); }); });
const M = 'やー|や|で|ん|ば|べ|っちゃ|ばい|ど|さー|やで|だべ|とよ|けん|ずら';
const RULES = [
  ['のだ＋方言の語尾（のだやー・のだで・のだっちゃ 等）', new RegExp('のだ(?:' + M + ')')],
  ['方言の語尾＋でございます（っちゃでございます 等）', new RegExp('(?:っちゃ|ばい|とよ|やで|だべ|さー|けん)でございます')],
  ['丁寧語＋方言の語尾（ございますっちゃ・ですわっちゃ 等）', new RegExp('(?:ですわ|ですの|ますわ|ますの|ございます|くださいませ|なさいませ)(?:' + M + ')(?=[、。！？…]|$)')],
  ['にゃ＋方言の語尾', new RegExp('にゃ(?:' + M + ')')]
];
const cell = {}, byRule = {}, ex = {}; let bad = 0, tot = 0, unk = cur.size - seen.size;
seen.forEach((v, nm) => {
  tot++; const hit = RULES.filter(r => r[1].test(v.text)).map(r => r[0]);
  const k = v.tone + '|' + (v.dial || '標準');
  cell[k] = cell[k] || { all: 0, bad: 0 }; cell[k].all++;
  if (hit.length) { bad++; cell[k].bad++; hit.forEach(h => { byRule[h] = (byRule[h] || 0) + 1; (ex[h] = ex[h] || []).length < 4 && ex[h].push(v.tone + '・' + v.dial + '：' + v.text); }); }
});
console.log(JSON.stringify({ 今の声の本数: cur.size, 組み立てで当たった本数: tot, 当たらなかった本数: unk, 崩れの目安に当たる本数: bad, 規則別: byRule }));
console.log('\n## 人格×方言の崩れ（崩れ本数／その人格×方言の本数）');
const tones = [...new Set(Object.keys(cell).map(k => k.split('|')[0]))], dials = [...new Set(Object.keys(cell).map(k => k.split('|')[1]))];
console.log(['人格＼方言'].concat(dials).join('\t'));
tones.forEach(t => console.log([t].concat(dials.map(d => { const c = cell[t + '|' + d]; return c ? c.bad + '/' + c.all : '-'; })).join('\t')));
console.log('\n## 例'); Object.keys(ex).forEach(h => { console.log(h); ex[h].forEach(e => console.log('  ' + e)); });
