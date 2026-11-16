#!/usr/bin/env node
/* voice-advice-dial.js — 方言・つなぎ・語尾の切り替えの声の台本（2026-11-15・y1115-29／39 のヨシ）
   ＊助言をひと続きの話に組み（advice-tone-core.js の advTalk）、全組み合わせで「字が人格の部品の字から変わった物」と「つなぎの言葉」を集める。
     それぞれをずんだもんの声で読む。声の名は字そのものの印（advy-<8桁>）。同じ字は人格・方言を越えて一つの声を使い回す。
   ＊字が変わらない部品は、人格の口調の声（advx-…・advs-…・advc-… など）をそのまま使う（作らない）。
   ＊本体は、組み立てた各部品の字から名を決め、その声を探す。無ければ元の部品の声（人格の口調）へ落とす。つなぎは、無ければ飛ばす。
   ＊使い方  node voice-advice-dial.js          … 全組み合わせを回して voice-advice-dial.json（名→字）と voice-advice-dial.txt（台本）を書く（約1分）
             node voice-advice-dial.js --names  … 声の名を一行ずつ出す */
'use strict';
const fs = require('fs'), path = require('path');
function entries() {   // Map 名 → { text, say }。voice-advice-dial.json があればそれを読む（検査が速いように）
  const P = require('./voice-advice-persona.js');
  const jp = path.join(__dirname, 'voice-advice-dial.json');
  const m = new Map();
  if (fs.existsSync(jp)) {
    const o = JSON.parse(fs.readFileSync(jp, 'utf8'));
    Object.keys(o).forEach(function (k) { m.set(k, { text: o[k], say: P.say(o[k]) }); });
    return m;
  }
  return generate(P);
}
function generate(P) {
  const C = require('./advice-tone-core.js'), S = require('./advice-talk-sim.js');
  const m = new Map();
  S.each(function (r) { r.items.forEach(function (x) { if (x.conn || x.changed) { const nm = C.advDialVoice(x.text); if (!m.has(nm)) { m.set(nm, { text: x.text, say: P.say(x.text) }); } } }); });
  Object.keys(C.ADV_OMO).forEach(function (k) { Object.keys(C.ADV_OMO[k]).forEach(function (sn) { C.ADV_OMO[k][sn].forEach(function (tx) { const nm = C.advDialVoice(tx); if (!m.has(nm)) { m.set(nm, { text: tx, say: P.say(tx) }); } }); }); });   // v1501：代表三人の面白みの一言（書いた字のまま一文一本）
  return m;
}
module.exports = { entries, generate };
if (require.main === module) {
  const P = require('./voice-advice-persona.js');
  const m = generate(P);
  const names = [...m.keys()].sort();
  const o = {}; names.forEach(function (k) { o[k] = m.get(k).text; });
  fs.writeFileSync(path.join(__dirname, 'voice-advice-dial.json'), JSON.stringify(o));
  const head = '# 方言・つなぎ・語尾の切り替えの声の台本（v1495・y1115-39）。voice-advice-dial.js から作る。手で書き換えない。\n# 名<TAB>読み。声の名は、字そのものの印（advy-<8桁>）。出力は reports/voice-advice-dial-out/<名>.wav.wav（軽い形式）\n';
  fs.writeFileSync(path.join(__dirname, 'voice-advice-dial.txt'), head + names.map(function (k) { return k + '.wav.wav\t' + m.get(k).say; }).join('\n') + '\n');
  if (process.argv.indexOf('--names') >= 0) { names.forEach(function (k) { console.log(k); }); process.exit(0); }
  let ch = 0, missing = 0; m.forEach(function (v, k) { ch += v.text.length; if (!fs.existsSync(path.join(__dirname, k + '.wav.wav'))) { missing++; } });
  console.log('声の字 ' + m.size + '種・' + ch + '字／直下にまだ無い ' + missing + '本 → voice-advice-dial.json・voice-advice-dial.txt');
}
