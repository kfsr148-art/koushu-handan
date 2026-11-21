// 切れ端を合わせ、静かな字（面白み・麻雀の言葉の書いた字・判定の一言・大物）を足し、今の声と突き合わせる
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = process.env.KH_ROOT || 'C:/Users/user/Desktop/mahjong/koushu-handan';
const { T } = require(ROOT + '/voice-advice-catalog.js'); global.ADV_TEXT = T;
const C = require(ROOT + '/advice-tone-core.js');
const HP = require('./head-pool.js');
const OD = path.join(__dirname, process.argv[2] || 'out');
const need = {};   // 名 → {text, kinds:Set, ok}
const add = (tx, kind, ok) => { if (!tx) { return; } const nm = C.advDialVoice(tx); const o = need[nm] || (need[nm] = { text: tx, kinds: new Set(), ok: false }); o.kinds.add(kind); if (ok) { o.ok = true; } };
let files = 0;
fs.readdirSync(OD).filter(f => f.endsWith('.json')).forEach(f => { files++; const o = JSON.parse(fs.readFileSync(path.join(OD, f), 'utf8')); Object.keys(o).forEach(k => add(o[k].text, o[k].kind, o[k].ok)); });
const simN = Object.keys(need).length;
// generate() と同じ静かな字
Object.keys(C.ADV_OMO).forEach(k => Object.keys(C.ADV_OMO[k]).forEach(sn => C.ADV_OMO[k][sn].forEach(tx => add(tx, 'omo', true))));
Object.keys(C.ADV_WORD_LIT).forEach(k => Object.keys(C.ADV_WORD_LIT[k]).forEach(id => add(C.ADV_WORD_LIT[k][id], 'word', true)));
HP.allPhrases().forEach(tx => add(tx, 'head', true));
C.ADV_TONE_KEYS.forEach(t => ['', 'miyazaki', 'hakata', 'osaka', 'kyoto', 'aomori', 'okinawa', 'bushi', 'yoji'].forEach(d => [true, false].forEach(a => add(C.advBigLine(t, d, a), 'big', true))));
// 今の声
const root = new Set(fs.readdirSync(ROOT).filter(f => /^advy-.*\.m4a$/.test(f)).map(f => f.slice(0, -4)));
const outDir = new Set(fs.readdirSync(path.join(ROOT, 'reports', 'voice-m4a-out')).filter(f => /\.m4a$/.test(f)).map(f => f.slice(0, -4)));
const wav = new Set(fs.readdirSync(ROOT).filter(f => /^advy-.*\.wav\.wav$/.test(f)).map(f => f.slice(0, -8)));
const dial = JSON.parse(fs.readFileSync(path.join(ROOT, 'voice-advice-dial.json'), 'utf8'));
const used = new Set(fs.readFileSync(path.join(ROOT, 'voice-used.txt'), 'utf8').split(/\r?\n/).filter(Boolean).map(s => s.replace(/\.m4a$/, '')));
const names = Object.keys(need).sort();
const miss = names.filter(n => !root.has(n));
const missOut = miss.filter(n => outDir.has(n)), missMake = miss.filter(n => !outDir.has(n));
const cnt = {}; missMake.forEach(n => need[n].kinds.forEach(k => { cnt[k] = (cnt[k] || 0) + 1; }));
let ch = 0; missMake.forEach(n => { ch += need[n].text.length; });
const notInDial = names.filter(n => !(n in dial)), dialNotNeeded = Object.keys(dial).filter(k => !need[k]);
console.log(JSON.stringify({ files, simN, need: names.length, inRoot: names.length - miss.length, miss: miss.length, missInOutDir: missOut.length, missMake: missMake.length, missMakeOkOnly: missMake.filter(n => need[n].ok).length, missWavOnly: miss.filter(n => wav.has(n)).length, kinds: cnt, chars: ch, notInDial: notInDial.length, notInUsed: names.filter(n => !used.has(n)).length, dialNotNeeded: dialNotNeeded.length }, null, 1));
fs.writeFileSync(path.join(__dirname, 'need.json'), JSON.stringify(Object.fromEntries(names.map(n => [n, { text: need[n].text, kinds: [...need[n].kinds], ok: need[n].ok, root: root.has(n), out: outDir.has(n) }]))));
fs.writeFileSync(path.join(__dirname, 'miss-make.json'), JSON.stringify(Object.fromEntries(missMake.map(n => [n, need[n].text]))));
fs.writeFileSync(path.join(__dirname, 'miss-out.json'), JSON.stringify(Object.fromEntries(missOut.map(n => [n, need[n].text]))));
