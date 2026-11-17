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
  A.push([[w], [{ t: 'm7' }, 'adva-from', 'adva-t6']]);
  ['adva-s-nito', 'adva-s-nosafe', 'adva-s-ukai', 'adva-s-jihai'].forEach(s => A.push([[w], [{ t: 'm7' }, 'adva-from', 'adva-t6'], [s]]));   // v1500：重なり・近く（切るを重ねる定石）は付けない
  A.push([[w], ['adva-weak']]);   // v1500：「上がれない」と言うので巡目は足さない
  A.push([['adva-kok-a', { n: 8 }, 'adva-kok-b'], [TEI, 'adva-kok-c'], ['adva-t7']]);
  A.push([['adva-kok-a', { n: 10 }, 'adva-kok-b', 'adva-kok-m'], [TEI, 'adva-kok-c'], ['adva-t7']]);   // v1505：10種＝迷い所
  A.push([['adva-chi-a', { n: 4 }, 'adva-chi-b'], [TEI, 'adva-chi-c'], ['adva-t6']]);
  A.push([['adva-toi-a', { n: 2 }, 'adva-toi-b', { n: 3 }, 'adva-toi-c'], [TEI, 'adva-toi-d'], ['adva-t6']]);
  A.push([['adva-tan-a', { n: 3 }, 'adva-tan-b'], [TEI, 'adva-tan-c'], ['adva-t3']]);
  A.push([['adva-ikk-a'], [TEI, 'adva-ikk-b']]);
  A.push([['adva-neko-a', { n: 4 }, 'adva-neko-b'], [TEI, 'adva-neko-c'], ['adva-t8']]);
  A.push([['adva-yak-a'], [TEI, 'adva-yak-b'], ['adva-t7']]);
  A.push([[SCENES[0]]]);   // v1500：「役が無くて上がれない」の後に一向聴は足さない
  A.push([[SCENES[1]]]);
  A.push([[SCENES[2]], ['adva-t6']]);
  ['far', 'cheap', 'shape', 'honor', 'few', 'pair'].forEach(k => {
    D.push([['advd-w-' + k], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'E' }, 'advd-and', { t: 'S' }, 'advd-keep'], [{ t: 'E' }, 'advd-s-jihai'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]);
  });
  D.push([['advd-kyu'], ['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'E' }, 'advd-and', { t: 'S' }, 'advd-keep'], [{ t: 'E' }, 'advd-s-jihai'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]);   // v1505：九種九牌は最初に流すと言う
  D.push([['advd-w-far'], [{ t: 'P' }, 'advd-keep'], ['advd-riichi'], ['advd-r2a', { t: 'P' }, 'advd-r2b']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut'], ['advd-riichi'], ['advd-r2c']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'p5' }, 'advd-and', { t: 's5' }, 'advd-keep'], ['advd-s-nito'], ['advd-riichi'], ['advd-r2a', { t: 'p5' }, 'advd-r2b']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut'], ['advd-s-ukai'], ['advd-riichi'], ['advd-r2c']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'P' }, 'advd-keep'], ['advd-riichi'], ['advd-r2a', { t: 'P' }, 'advd-r2b']]);   // v1500：近くの牌から切る定石は付けない
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
    if (t.lit !== undefined) { out.push({ t: t.lit, term: false, lit: true }); return; }
    if (t.n !== undefined) { out.push({ t: String(t.n), term: false }); return; }
    out.push({ t: TILE[t.t] || t.t, term: false });
  });
  return out;
}
function cutPos(ls) { for (let a = 0; a < ls.length; a++) { for (let b = 0; b < ls[a].length - 1; b++) { const t = ls[a][b], nx = ls[a][b + 1]; if (t && typeof t === 'object' && t.t !== undefined && (nx === 'adva-from' || nx === 'advd-cut')) { return [a, b]; } } } return null; }   // 切る牌を言う所（牌の名の直後・v1503）
function build(adviceLines, tone, sd, m, vk, i, om) {   // om＝{text, kind}（面白みの一言。front＝助言の前／inline＝牌の名の直後／end＝最後）
  const lines = [[tk(C.advToneText(tone, sd === 'a' ? 'adva-head' : 'advd-head'))]];   // v1500：頭の見る所の行は付けない
  const al = adviceLines.map(l => l.slice());
  if (om && om.kind === 'inline') { const cp = cutPos(al); if (cp) { al[cp[0]].splice(cp[1] + 1, 0, { lit: om.text }); } }
  if (om && om.kind === 'front') { lines.push([{ t: om.text, term: false, lit: true }]); }
  al.forEach(l => lines.push(tokens(l, tone)));
  if (om && om.kind === 'end') { lines.push([{ t: om.text, term: false, lit: true }]); }
  if (m !== 'n') { lines.push([tk(T['advc-' + tone + '-' + sd + '-' + m + '-' + i])]); }   // ノーマルの終わりの一言は付けない
  return lines;
}
function each(cb) {   // 全組み合わせを回して cb(結果, 条件) を呼ぶ
  TONES.forEach(tone => DIALS.forEach(dial => ['n', 'd', 't'].forEach(m => ['a', 'd'].forEach(sd => VK.forEach(vk => {
    const sc = scenarios(vk), list = sd === 'a' ? sc.A : sc.D;
    for (let i = 0; i < 3; i++) list.forEach((ls, k) => {
      const lines = build(ls, tone, sd, m, vk, i);
      cb(C.advTalk(lines, tone, dial, m !== 'n'), { tone: tone, dial: dial, m: m, sd: sd, vk: vk, i: i, k: k, lines: lines });
      const ob = C.ADV_OMO[dial + ':' + tone];
      if (ob && i === 0 && (vk === VK[0] || vk === VK[3])) {   // 一言付きは、見方を二つ・くじ一つに絞って回す（量が多いため）
        Object.keys(ob).forEach(sn => {
          if (sn === 'nick' && !cutPos(ls)) { return; }
          if (C.advOmoOverlaps(sn, ls)) { return; }
          ob[sn].forEach(tx => {
            const l2 = build(ls, tone, sd, m, vk, i, { text: tx, kind: C.ADV_OMO_KIND[sn] }), r2 = C.advTalk(l2, tone, dial, m !== 'n');
            if (C.advHasTriple(r2.text)) { return; }
            cb(r2, { tone: tone, dial: dial, m: m, sd: sd, vk: vk, i: i, k: k, lines: l2, omo: tx, omoScene: sn, ids: ls });
          });
        });
      }
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
