#!/usr/bin/env node
/* advice-talk-sim.js — 助言をひと続きの話に組む全組み合わせの写し（2026-11-15・y1115-39 のヨシ）
   ＊本体の advCompose と同じ並びで、人格×方言×モード×攻守×見方×くじ×場面の全部を組み、字と「声が要る部品」を数える。
   ＊voice-advice-dial.js（声の台本）と、手元の点検（node advice-talk-sim.js）が使う。本体には入れない。
   ＊組み立ての本体は advice-tone-core.js の advTalk。 */
'use strict';
const { T } = require('./voice-advice-catalog.js');
global.ADV_TEXT = T;
const C = require('./advice-tone-core.js');
const TILE = { m7: '七萬', p6: '六筒', s4: '四索', E: '東', S: '南', P: '白', p5: '五筒', s5: '五索' };
const TEI = 'adv-teiseki';
const VK = ['butler', 'strategist', 'blunt', 'lady', 'french', 'ichihime', 'sensei'];
const TONES = C.ADV_TONE_KEYS, DIALS = ['', 'miyazaki', 'hakata', 'osaka', 'kyoto', 'aomori', 'okinawa', 'bushi', 'yoji'];
const TERM = /[。！？]$/;
const tk = t => ({ t: t, term: TERM.test(t) });
const SCENES = [{ sc: { scene: 'nashi' } }, { sc: { scene: 'yakuhai', lab: '白', code: 'P' } }, { sc: { scene: 'some', yomi: '萬子（マンズ）', n: '8', suit: 'man' } }];
function scenarios(vk) {   // 助言の行の場面（頭・終わりを除く）
  const A = [], D = [], w = 'adva-w-' + vk;
  A.push([[{ t: 'm7' }, 'adva-from', 'adva-t6', w]]);
  ['adva-s-nito', 'adva-s-kasa', 'adva-s-nosafe', 'adva-s-ukai', 'adva-s-soba', 'adva-s-jihai'].forEach(s => A.push([[{ t: 'm7' }, 'adva-from', 'adva-t6', w], [s]]));
  A.push([['adva-weak', 'adva-t3', w]]);
  A.push([['adva-kok-a', { n: 8 }, 'adva-kok-b'], [TEI, 'adva-kok-c'], ['adva-t7']]);
  A.push([['adva-chi-a', { n: 4 }, 'adva-chi-b'], [TEI, 'adva-chi-c'], ['adva-t6']]);
  A.push([['adva-toi-a', { n: 2 }, 'adva-toi-b', { n: 3 }, 'adva-toi-c'], [TEI, 'adva-toi-d'], ['adva-t6']]);
  A.push([['adva-tan-a', { n: 3 }, 'adva-tan-b'], [TEI, 'adva-tan-c'], ['adva-t3']]);
  A.push([['adva-ikk-a'], [TEI, 'adva-ikk-b']]);
  A.push([['adva-neko-a', { n: 4 }, 'adva-neko-b'], [TEI, 'adva-neko-c'], ['adva-t8']]);
  A.push([['adva-yak-a'], [TEI, 'adva-yak-b'], ['adva-t7']]);
  A.push([[SCENES[0]], ['adva-t3']]);
  A.push([[SCENES[1]]]);
  A.push([[SCENES[2]], ['adva-t6']]);
  ['far', 'cheap', 'shape', 'honor', 'few', 'pair'].forEach(k => {
    D.push([['advd-w-' + k], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'E' }, 'advd-and', { t: 'S' }, 'advd-keep'], [{ t: 'E' }, 'advd-s-jihai'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]);
  });
  D.push([['advd-w-far'], [{ t: 'P' }, 'advd-keep'], ['advd-riichi'], ['advd-r2a', { t: 'P' }, 'advd-r2b']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut'], ['advd-riichi'], ['advd-r2c']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'p5' }, 'advd-and', { t: 's5' }, 'advd-keep'], ['advd-s-nito'], ['advd-riichi'], ['advd-r2a', { t: 'p5' }, 'advd-r2b']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut'], ['advd-s-ukai'], ['advd-riichi'], ['advd-r2c']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'P' }, 'advd-keep'], ['advd-s-soba'], ['advd-riichi'], ['advd-r2a', { t: 'P' }, 'advd-r2b']]);
  return { A: A, D: D };
}
function tokens(l, tone) {   // 助言の行の部品 → {t,term} の列
  const out = [];
  l.forEach(t => {
    if (typeof t === 'string') { out.push(tk(C.advToneText(tone, t))); return; }
    if (t.sc) {
      const x = t.sc, s = C.ADV_SCENE[tone];
      if (x.scene === 'nashi') { out.push(tk(s.nashi)); }
      else if (x.scene === 'yakuhai') { out.push({ t: x.lab, term: false }); out.push(tk(s.yakuhai[0])); }
      else { out.push({ t: x.yomi, term: false }); out.push({ t: 'が', term: false }); out.push({ t: String(x.n), term: false }); out.push(tk(s.some[0])); out.push({ t: x.yomi, term: false }); out.push(tk(s.some[1])); }
      return;
    }
    if (t.n !== undefined) { out.push({ t: String(t.n), term: false }); return; }
    out.push({ t: TILE[t.t] || t.t, term: false });
  });
  return out;
}
function build(adviceLines, tone, sd, m, vk, i) {
  const lines = [[tk(C.advToneText(tone, sd === 'a' ? 'adva-head' : 'advd-head'))], [{ t: T['advk-' + vk], term: false }, tk(T['advs-' + tone + '-' + sd + '-' + m + '-' + i])]];
  adviceLines.forEach(l => lines.push(tokens(l, tone)));
  lines.push([tk(T['advc-' + tone + '-' + sd + '-' + m + '-' + i])]);
  return lines;
}
function each(cb) {   // 全組み合わせを回して cb(結果, 条件) を呼ぶ
  TONES.forEach(tone => DIALS.forEach(dial => ['n', 'd', 't'].forEach(m => ['a', 'd'].forEach(sd => VK.forEach(vk => {
    const sc = scenarios(vk), list = sd === 'a' ? sc.A : sc.D;
    for (let i = 0; i < 3; i++) list.forEach((ls, k) => {
      const lines = build(ls, tone, sd, m, vk, i);
      cb(C.advTalk(lines, tone, dial), { tone: tone, dial: dial, m: m, sd: sd, vk: vk, i: i, k: k, lines: lines });
    });
  })))));
}
module.exports = { each, build, scenarios, tokens, VK, TONES, DIALS };
if (require.main === module) {
  let total = 0, runs = 0, conn = 0; const need = new Set(), chg = new Set();
  each((r, c) => {
    total++;
    const ss = r.text.split(/(?<=[。！？])/).filter(Boolean); let run = 1;
    for (let k = 1; k < ss.length; k++) { if (ss[k].slice(-4) === ss[k - 1].slice(-4)) { run++; if (run === 3) runs++; } else { run = 1; } }
    const cs = r.items.filter(x => x.conn).map(x => x.text); for (let k = 1; k < cs.length; k++) { if (cs[k] === cs[k - 1]) { conn++; } }
    r.items.forEach(x => { if (x.conn || x.changed) { chg.add(x.text); } });
  });
  console.log('組み合わせ ' + total + '通り／同じ語尾が三文続く ' + runs + '件／つなぎが続けて同じ ' + conn + '件／声が要る字の種類 ' + chg.size);
}
