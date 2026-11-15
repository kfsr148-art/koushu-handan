#!/usr/bin/env node
/* voice-advice-dial.js — 方言の声の台本（2026-11-15・y1115-29 のヨシ・全8種）
   ＊方言を通した字（人格×方言）のうち、方言なしの字と違う物だけ、ずんだもんの声で読む。声の名は字そのものの印（advy-<8桁>）。
   ＊同じ字は人格・方言を越えて一つの声を使い回す。方言が掛からず字が変わらない物は、方言なしの声をそのまま使う（作らない）。
   ＊本体は、方言を選んだ時、部品ごとに字を方言へ通し、その印の声を探す。無ければ方言なしの声へ落とす。
   ＊使い方  node voice-advice-dial.js          … voice-advice-dial.txt（台本）を書き、数と大きさの見込みを出す
             node voice-advice-dial.js --names  … 声の名を一行ずつ出す */
'use strict';
const fs = require('fs'), path = require('path');
const { T } = require('./voice-advice-catalog.js');
global.ADV_TEXT = T;
const C = require('./advice-tone-core.js');
const P = require('./voice-advice-persona.js');
const DIALS = ['miyazaki', 'hakata', 'osaka', 'kyoto', 'aomori', 'okinawa', 'bushi', 'yoji'];
function entries() {   // Map 名 → { text, say }
  const m = new Map();
  const add = function (base, d) { if (d !== base && d) { const nm = C.advDialVoice(d); if (!m.has(nm)) { m.set(nm, { text: d, say: P.say(d) }); } } };
  DIALS.forEach(function (dial) {
    C.ADV_TONE_KEYS.forEach(function (tone) {
      const pol = !!C.ADV_POLITE[tone], dz = function (x) { return C.advDialectize(x, dial, pol); };
      ['adva-head', 'advd-head'].forEach(function (id) { const b = C.advToneText(tone, id); add(b, dz(b)); });
      Object.keys(T).forEach(function (id) {
        if (new RegExp('^(advs|advc)-' + tone + '-').test(id) || (/^(adva-|advd-|adv-teiseki)/.test(id) && !/^(adva-head|advd-head)$/.test(id))) { const b = C.advToneText(tone, id); add(b, dz(b)); }
      });
      const sc = C.ADV_SCENE[tone];
      [sc.nashi, sc.yakuhai[0], sc.some[0], sc.some[1]].forEach(function (b) { add(b, dz(b)); });
    });
  });
  return m;
}
module.exports = { entries, DIALS };
if (require.main === module) {
  const m = entries();
  if (process.argv.indexOf('--names') >= 0) { m.forEach(function (v, k) { console.log(k); }); process.exit(0); }
  let ch = 0; m.forEach(function (v) { ch += v.text.length; });
  const head = '# 方言の声の台本（v1494・y1115-29）。voice-advice-dial.js から作る。手で書き換えない。\n# 名<TAB>読み。声の名は、方言を通した字の印（advy-<8桁>）。出力は reports/voice-advice-dial-out/<名>.wav.wav（軽い形式）\n';
  fs.writeFileSync(path.join(__dirname, 'voice-advice-dial.txt'), head + [...m].map(function (e) { return e[0] + '.wav.wav\t' + e[1].say; }).join('\n') + '\n');
  console.log('方言の声 ' + m.size + '本・' + ch + '字・約' + (ch * 2185 / 1048576).toFixed(1) + 'MB（1字あたり約2.2KB）→ voice-advice-dial.txt');
}
