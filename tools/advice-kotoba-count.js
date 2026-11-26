#!/usr/bin/env node
/* advice-kotoba-count.js — 仕込んである人格の言葉が、見本（advice-sample.md）で何通り出たかを数える（枠 三百八十二）。読むだけ。ブラウザは使わない。
   使い方  node tools/advice-kotoba-count.js <advice-sample.md> [handan の置き場=.] [--out <一覧の出し先のフォルダ> [--table <人物ごとの表の出し先>]]
   出す物  集計の生の数（JSON）を標準出力へ。--out で一覧（advice-kotoba-count-list.md）、--table で人物ごとの表を書く。
   照らし方
     ・引き出し（ADV_OMO：special／nick／honor／dora／far／guard）… 方言を通さず書いた字のまま入るので、句読点を外した字の丸ごと一致。
       丸ごとで外れた時は頭の7割（8字以上）の一致も拾う（語尾の直し＝枠 324/328 で末尾が欠けることがあるため）。
     ・麻雀の言葉（ADV_WORDS）… 題の字（「…」の中。言い伝えは題の直後が「と」）で照らす。語尾は方言で変わるので見ない。
       幼児は本体の ADV_YOJI_KANA_P／advMint で題を同じ読みに直してから照らす。書き下ろし（ADV_WORD_LIT）は一文目で照らす。
     ・どれにも当たらないのに言葉らしい文がある局は「拾い損ねの疑い」として数える。 */
'use strict';
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2);
const oi = args.indexOf('--out'); const OUT = oi >= 0 ? args.splice(oi, 2)[1] : '';
const ti = args.indexOf('--table'); const TABLE = ti >= 0 ? args.splice(ti, 2)[1] : '';
const SAMPLE = args[0],ROOT = path.resolve(args[1] || '.');
const html = fs.readFileSync(path.join(ROOT, 'koushu-handan.html'), 'utf8');
const block = html.slice(html.indexOf('/* ADV_TONE_BEGIN */'), html.indexOf('/* ADV_TONE_END */'));
const advText = html.match(/^ *const ADV_TEXT = (\{.*\});/m)[1];
const K = new Function('var ADV_TEXT=' + advText + ';' + block +
  ';return {ADV_OMO,ADV_WORDS,ADV_WORD_LIT,ADV_TONE,ADV_TONE_KEYS,ADV_DIALECT,ADV_CHARA,ADV_PERSONA_DIAL,ADV_YOJI_KANA_P,ADV_YOJI_KANA,ADV_BLUNT_NEW,advMint,advKuseOk,advKScene}')();
const es = html.indexOf('const ADV_WORD_ENGINE = (function(){'), ee = html.indexOf('function advWordCands(a, tiles)');
const ENGINE = new Function(html.slice(es, ee) + ';return ADV_WORD_ENGINE;')();

const TONE_JA = { butler: '執事', strategist: '軍師', blunt: 'ずんだ', lady: 'お嬢様', french: 'マダム', ichihime: '一姫', sensei: '先生' };
const DIAL_JA = { '': '標準', miyazaki: '宮崎', hakata: '博多', osaka: '大阪', kyoto: '京都', aomori: '青森', okinawa: '沖縄', bushi: '武士', yoji: '幼児' };
const SCENE_JA = { special: '人物のずれ', nick: '牌のあだ名', honor: '格言（字牌の言い伝え）', dora: 'けなげ・ドラ', far: 'けなげ・手が遠い', guard: 'けなげ・守り' };
const SCENES = ['special', 'nick', 'honor', 'dora', 'far', 'guard'];
const jaTone = {}; Object.keys(TONE_JA).forEach(k => { jaTone[TONE_JA[k]] = k; });
const norm = s => String(s).replace(/[、。！？!?…「」『』（）()・\s　]/g, '');
const pname = (d, t) => DIAL_JA[d] + '・' + TONE_JA[t] + (d ? '（' + K.ADV_CHARA[d][t].n + '）' : '');

/* ---- 見本を読む ---- */
const md = fs.readFileSync(SAMPLE, 'utf8').split(/\r?\n/);
const ver = ((md.find(l => /^版：/.test(l)) || '').match(/[0-9]+/) || ['?'])[0];
const rows = []; let started = false;
for (let i = 0; i < md.length; i++) {
  if (/^## 無作為の百局/.test(md[i])) { started = true; }
  const m = started && /^### (局|固定) ([0-9]+)｜([^・]+)・([a-z]*|標準)｜(攻め|守り)/.exec(md[i]);
  if (!m) { continue; }
  let j = i + 1; const tiles = md[j].replace(/^配牌：/, ''); j += 2; const body = [];
  while (j < md.length && md[j] !== '' && !/^##/.test(md[j])) { body.push(md[j]); j++; }
  rows.push({ id: m[1] + m[2], tone: jaTone[m[3]], dial: m[4] === '標準' ? '' : m[4], attack: m[5] === '攻め', tiles: tiles, text: body.join('') });
}

/* ---- 照らし ---- */
function has(text, s) {
  const a = norm(text), b = norm(s);
  if (!b) { return ''; }
  if (a.indexOf(b) >= 0) { return 'full'; }
  const n = Math.max(8, Math.ceil(b.length * 0.7));
  return (b.length > n && a.indexOf(b.slice(0, n)) >= 0) ? 'head' : '';
}
function wordKeys(id, tone, dial) {
  const lit = K.ADV_WORD_LIT[dial + ':' + tone];
  if (lit && lit[id]) { return [norm(lit[id].split('。')[0])]; }
  const w = K.ADV_WORDS.find(x => x[0] === id), term = w[3];
  const raw = tone === 'blunt' ? K.ADV_BLUNT_NEW['advw-' + id] : K.ADV_TONE[tone]['advw-' + id];
  const quoted = raw.charAt(0) === '「';
  const keys = quoted ? ['「' + term + '」'] : [term + 'と'];
  if (dial === 'yoji') {
    const tab = tone === 'butler' ? K.ADV_YOJI_KANA : (K.ADV_YOJI_KANA_P[tone] || {});
    const conv = K.advMint(tab[raw] || raw);
    const q = /^「([^」]+)」/.exec(conv); keys.push(q ? '「' + q[1] + '」' : conv.split(/とも|と言う|という/)[0] + 'と');
    keys.push('「' + K.advMint(term) + '」');
  }
  return keys;
}
function findWords(row) {
  const t = row.text.replace(/\s/g, '');
  return K.ADV_WORDS.map(w => w[0]).filter(id => wordKeys(id, row.tone, row.dial).some(k => {
    if (K.ADV_WORD_LIT[row.dial + ':' + row.tone]) { return norm(t).indexOf(k) >= 0; }
    return t.indexOf(k.replace(/\s/g, '')) >= 0;
  }));
}
const SIGN = /」と(申|言|いう|いい|もう)|という事|ということ|というこちょ|言い伝え|いいちゅたえ|」と呼ぶ|」って呼ぶ|」とよぶ/;
const wordSeen = {}, omoSeen = {}, per = {};
let suspect = [], headOnly = 0;
rows.forEach(r => {
  const key = r.dial + ':' + r.tone;
  const P = per[key] || (per[key] = { n: 0, words: new Set(), omo: new Set() });
  P.n++;
  r.words = findWords(r);
  r.words.forEach(id => { P.words.add(id); wordSeen[id] = (wordSeen[id] || 0) + 1; });
  r.omo = [];
  const tb = K.ADV_OMO[key];
  if (tb) {
    SCENES.forEach(sc => tb[sc].forEach((s, i) => {
      const h = has(r.text, s);
      if (h) { const id = key + '|' + sc + '|' + i; r.omo.push({ sc: sc, i: i }); P.omo.add(id); omoSeen[id] = (omoSeen[id] || 0) + 1; if (h === 'head') { headOnly++; } }
    }));
  }
  if (!r.words.length && SIGN.test(r.text)) { suspect.push(r.id); }
  const ch = r.dial ? K.ADV_CHARA[r.dial][r.tone] : null;
  const pd = (K.ADV_PERSONA_DIAL[r.tone] || {})[r.dial || 'std'];
  r.kuse = !!(ch && [ch.k, pd && pd.k].filter(Boolean).some(k => norm(r.text).indexOf(norm(r.dial === 'yoji' ? K.advMint(k) : k)) >= 0));
});

/* ---- 手の牌だけで決まる言葉の当たりやすさ（無作為の配牌・種つき） ---- */
const NEEDS = /f\.a\b|f\.sh\b|f\.atk|f\.def|dirHas|f\.dora|f\.ds\b|f\.dn\b/;
const tileOnly = ENGINE.W.filter(w => !NEEDS.test(String(w.test)) && !/^w09[567]$/.test(w.id));
let seed = 382; const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const wall = []; ['m', 'p', 's'].forEach(s => { for (let n = 1; n <= 9; n++) { for (let i = 0; i < 4; i++) { wall.push({ suit: s, code: s + n }); } } });
['E', 'S', 'W', 'N', 'P', 'F', 'C'].forEach(c => { for (let i = 0; i < 4; i++) { wall.push({ suit: 'honor', code: c }); } });
const SIM = 100000, rate = {}; let top3 = 0, top2 = 0;
const stub = { baseShanten: 3, verdict: 'attack', directions: [] };
for (let h = 0; h < SIM; h++) {
  const w = wall.slice(); for (let i = 0; i < 13; i++) { const j = i + Math.floor(rnd() * (w.length - i)); const t = w[i]; w[i] = w[j]; w[j] = t; }
  const f = ENGINE.feats(w.slice(0, 13), stub, null); let top = -1;
  tileOnly.forEach(x => { if (x.test(f)) { rate[x.id] = (rate[x.id] || 0) + 1; if (x.tier > top) { top = x.tier; } } });
  if (top >= 3) { top3++; } if (top >= 2) { top2++; }
}

/* ---- まとめ ---- */
const words = K.ADV_WORDS.map(w => { const e = ENGINE.W.find(x => x.id === w[0]), src = e ? String(e.test) : ''; return { id: w[0], tier: w[1], kind: w[2], term: w[3], mean: w[4], seen: wordSeen[w[0]] || 0,
  rate: tileOnly.some(x => x.id === w[0]) ? (rate[w[0]] || 0) / SIM : null, dora: /f\.dora/.test(src), cat: /^w09[567]$/.test(w[0]), inEngine: !!e }; });
const dialRows = rows.filter(r => r.dial);
const cnt = (arr, f) => arr.filter(f).length;
const sceneCount = {}; SCENES.forEach(s => { sceneCount[s] = { used: 0, distinct: Object.keys(omoSeen).filter(k => k.split('|')[1] === s).length }; });
rows.forEach(r => r.omo.forEach(o => { sceneCount[o.sc].used++; }));
const dialects = Object.keys(K.ADV_DIALECT), persons = [];
dialects.forEach(d => K.ADV_TONE_KEYS.forEach(t => { const P = per[d + ':' + t] || { n: 0, words: new Set(), omo: new Set() }; persons.push({ key: d + ':' + t, name: pname(d, t), n: P.n, w: P.words.size, o: P.omo.size }); }));
const summary = {
  ver: ver, rows: rows.length, dialRows: dialRows.length, stdRows: rows.length - dialRows.length,
  persons: persons.length, wordsPerPerson: words.length, omoPerPerson: SCENES.length * 5, omoTotal: Object.keys(K.ADV_OMO).length * 30,
  wordKindsSeen: words.filter(w => w.seen).length, wordPairsSeen: persons.reduce((a, p) => a + p.w, 0), omoPairsSeen: persons.reduce((a, p) => a + p.o, 0),
  rowsWithWord: cnt(rows, r => r.words.length), rowsWithOmoDial: cnt(dialRows, r => r.omo.length), rowsBothDial: cnt(dialRows, r => r.omo.length && r.words.length), rowsNoneDial: cnt(dialRows, r => !r.omo.length && !r.words.length),
  attack: { rows: cnt(dialRows, r => r.attack), word: cnt(dialRows, r => r.attack && r.words.length), omo: cnt(dialRows, r => r.attack && r.omo.length) },
  defend: { rows: cnt(dialRows, r => !r.attack), word: cnt(dialRows, r => !r.attack && r.words.length), omo: cnt(dialRows, r => !r.attack && r.omo.length) },
  stdWord: cnt(rows, r => !r.dial && r.words.length),
  rowsMultiWord: rows.filter(r => r.words.length > 1).map(r => r.id + ':' + r.words.join('+')),
  suspect: suspect, headOnly: headOnly, kuseRows: cnt(dialRows, r => r.kuse), sceneCount: sceneCount,
  personsNone: persons.filter(p => !p.n).length, kNever: persons.filter(p => { const [d, t] = p.key.split(':'); return K.advKScene(K.ADV_CHARA[d][t].k) === 'never' || !K.advKuseOk(K.ADV_CHARA[d][t].k, t, d); }).map(p => p.name + '「' + K.ADV_CHARA[p.key.split(':')[0]][p.key.split(':')[1]].k + '」'),
  sim: { n: SIM, tileOnly: tileOnly.length, top2: top2 / SIM, top3: top3 / SIM }
};
console.log(JSON.stringify(summary, null, 1));
console.log('言葉の出た順（固定が先＝生成順）:', rows.filter(r => /^固定/.test(r.id)).concat(rows.filter(r => !/^固定/.test(r.id))).filter(r => r.words.length).map(r => r.words[0]).join(' '));
console.log('出た言葉:', words.filter(w => w.seen).sort((a, b) => b.seen - a.seen).map(w => w.id + ' ' + w.term + ' x' + w.seen + ' 段' + w.tier).join(' / '));

if (OUT) {
  const pct = (a, b) => (100 * a / b).toFixed(1) + '%';
  const T = ['| 人物 | 見本の局数 | 麻雀の言葉（98） | 引き出し（30） | 一度も出ない（128のうち） |', '|---|---|---|---|---|'];
  persons.forEach(p => T.push('| ' + p.name + ' | ' + p.n + ' | ' + p.w + ' | ' + p.o + ' | ' + (128 - p.w - p.o) + '（' + pct(128 - p.w - p.o, 128) + '） |'));
  T.push('', '### 方言なし（標準）の七人（引き出しは持っていない）', '', '| 人物 | 見本の局数 | 麻雀の言葉（98） |', '|---|---|---|');
  K.ADV_TONE_KEYS.forEach(t => { const P = per[':' + t] || { n: 0, words: new Set() }; T.push('| 標準・' + TONE_JA[t] + ' | ' + P.n + ' | ' + P.words.size + ' |'); });
  if (TABLE) { fs.writeFileSync(TABLE, T.join('\n') + '\n', 'utf8'); }
  const defOnly = w => /f\.def/.test(String((ENGINE.W.find(x => x.id === w.id) || {}).test));
  const why = w => defOnly(w) && summary.defend.word === 0 ? '守りの局だけの言葉。この見本の守りの局では、麻雀の言葉が一つも残らなかった（30秒の詰め）' : w.dora ?'ドラ表示牌を入れた時だけ当たる（見本はドラ無し）' : w.cat ? '猫牌の入った手だけ当たる（無作為の配牌には猫牌が無い）' : w.tier === 0 ? '段0。ほかの言葉が一つでも当たると候補から外れる' : w.tier === 1 ? '段1。段2・3が一つでも当たると候補から外れる' : '段' + w.tier + '。条件が当たらないか、同じ段の中のくじに当たらなかったか、30秒の詰めで落ちた';
  const L = ['# 一度も出なかった言葉の一覧（版 ' + ver + ' の見本 ' + rows.length + ' 局）', '', '作り方は advice-kotoba-count.md と tools/advice-kotoba-count.js を参照。「出なかった」は、この見本で出なかったという意味。', '',
    '## 1. 麻雀の言葉：どの人物でも一度も出なかった物（' + words.filter(w => !w.seen).length + '／' + words.length + '）', '',
    '当たる率は、無作為の配牌 ' + SIM + ' 局でその条件が当たる割合（手の牌だけで決まる言葉に限る。「−」は向聴・攻守・ドラ・猫牌などが要る物で、数えていない）。', '',
    '| 番号 | 段 | 種類 | 言葉 | 条件の意味 | 当たる率 | 考えられる訳 |', '|---|---|---|---|---|---|---|'];
  words.filter(w => !w.seen).forEach(w => L.push('| ' + [w.id, w.tier, w.kind, w.term, w.mean, w.rate === null ? '−' : pct(w.rate, 1), why(w)].join(' | ') + ' |'));
  L.push('', '## 2. 麻雀の言葉：どこかの人物で出た物（参考・' + words.filter(w => w.seen).length + '）', '', words.filter(w => w.seen).map(w => w.id + '「' + w.term + '」' + w.seen + '回').join('／'), '', 'ほかの人物の口では、これらも出ていない（人物ごとに出た数は本文の表）。', '',
    '## 3. 引き出し：一度も出なかった字（' + (summary.omoTotal - Object.keys(omoSeen).length) + '／' + summary.omoTotal + '）', '');
  dialects.forEach(d => K.ADV_TONE_KEYS.forEach(t => {
    const key = d + ':' + t; L.push('### ' + pname(d, t), '');
    SCENES.forEach(sc => K.ADV_OMO[key][sc].forEach((s, i) => { if (!omoSeen[key + '|' + sc + '|' + i]) { L.push('- ［' + SCENE_JA[sc] + ' ' + (i + 1) + '］' + s); } }));
    L.push('');
  }));
  fs.writeFileSync(path.join(OUT, 'advice-kotoba-count-list.md'), L.join('\n'), 'utf8');
}
