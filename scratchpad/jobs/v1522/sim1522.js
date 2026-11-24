#!/usr/bin/env node
/* sim1514.js（v1514 の守りの並びに合わせた写し・元は v1513/sim1513.js）— 助言をひと続きの話に組む全組み合わせの写し（2026-11-15・y1115-39 のヨシ／v1506・y1117-1500 のヨシで長さの詰めと麻雀の言葉を足した）
   ＊本体の advCompose と同じ並びで、人格×方言×モード×攻守×見方×くじ×場面の全部を組み、字と「声が要る部品」を数える。
   ＊v1506：声の長さを30秒以内に詰める段（一言→言葉→短い言い方→つなぎ→リーチ一文化→呼びかけ）を通した最後の形だけを返す。
   ＊voice-advice-dial.js（声の台本）と、手元の点検（node advice-talk-sim.js）が使う。本体には入れない。
   ＊組み立ての本体は advice-tone-core.js の advTalk・advVariants。 */
'use strict';
const ROOT = process.env.KH_ROOT || 'C:/Users/user/Desktop/mahjong/koushu-handan';
const { T } = require(ROOT + '/voice-advice-catalog.js');
global.ADV_TEXT = T;
const C = require(ROOT + '/advice-tone-core.js');
const HP = require('../v1513/head-pool.js');
const TILE = { m7: '七萬', p6: '六筒', s4: '四索', E: '東', S: '南', P: '白', p5: '五筒', s5: '五索' };
const TEI = 'adv-teiseki';
const VK = ['butler', 'strategist', 'blunt', 'lady', 'french', 'ichihime', 'sensei'];
const TONES = C.ADV_TONE_KEYS, DIALS = ['', 'miyazaki', 'hakata', 'osaka', 'kyoto', 'aomori', 'okinawa', 'bushi', 'yoji'];
const TERM = /[。！？]$/;
const tk = t => ({ t: t, term: TERM.test(t) });
const SCENES = [{ sc: { scene: 'nashi' } }, { sc: { scene: 'yakuhai', lab: '白', code: 'P' } }, { sc: { scene: 'some', yomi: '萬子（マンズ）', n: '8', suit: 'man' } }];
function scenarios(vk) {   // 助言の行の場面（頭・終わりを除く）。v1506：巡目の補い・受け直しを含む
  const A = [], D = [], w = 'adva-w-' + vk;
  A.push([[w], [{ t: 'm7' }, 'adva-from', 'adva-t6']]);
  ['adva-s-nito', 'adva-s-nosafe', 'adva-s-ukai', 'adva-s-jihai'].forEach(s => A.push([[w], [{ t: 'm7' }, 'adva-from', 'adva-t6'], [s]]));
  A.push([[w], ['adva-weak', 'adva-t6']]);   // v1506：「つながりの薄い牌から切って、」に巡目を続ける
  A.push([['adva-kok-a', { n: 8 }, 'adva-kok-b'], [TEI, 'adva-kok-c']]);   // v1506：国士・役満は巡目を言わない（線が出ない）
  A.push([['adva-kok-a', { n: 10 }, 'adva-kok-b', 'adva-kok-m'], [TEI, 'adva-kok-c']]);
  A.push([['adva-chi-a', { n: 4 }, 'adva-chi-b'], [TEI, 'adva-chi-c'], ['adva-t6']]);
  A.push([['adva-toi-a', { n: 2 }, 'adva-toi-b', { n: 3 }, 'adva-toi-c'], [TEI, 'adva-toi-d'], ['adva-t6']]);
  A.push([['adva-tan-a', { n: 3 }, 'adva-tan-b'], [TEI, 'adva-tan-c'], ['adva-t3']]);
  A.push([['adva-ikk-a'], [TEI, 'adva-ikk-b']]);
  A.push([['adva-neko-a', { n: 4 }, 'adva-neko-b'], [TEI, 'adva-neko-c'], ['adva-tc']]);   // v1506：猫牌4枚以上は「期限は引けない」
  A.push([['adva-yak-a'], [TEI, 'adva-yak-b']]);
  /* v1531（棚 #21・枠 二百五十五）：七対子・対々・染めの測った数の一文＝本体 advLines0（withT の第二引数）と同じ並び。巡目は t6（向聴2以上）と tn の両方 */
  ['adva-ch-1', 'adva-ch-2', 'adva-ch-3', 'adva-ch-4'].forEach(c => ['', 'adva-fl-1', 'adva-fl-2'].forEach(fl => ['adva-t6', 'adva-tn'].forEach(tt => { A.push([['adva-chi-a', { n: 4 }, 'adva-chi-b'], [TEI, 'adva-chi-c'], [c]].concat(fl ? [[fl]] : [], [[tt]])); })));
  ['adva-tt-1', 'adva-tt-2'].forEach(c => ['', 'adva-fl-1', 'adva-fl-2'].forEach(fl => ['adva-t6', 'adva-tn'].forEach(tt => { A.push([['adva-toi-a', { n: 2 }, 'adva-toi-b', { n: 3 }, 'adva-toi-c'], [TEI, 'adva-toi-d'], [c]].concat(fl ? [[fl]] : [], [[tt]])); })));
  ['adva-fl-1', 'adva-fl-2'].forEach(fl => { ['adva-t3', 'adva-tn'].forEach(tt => { A.push([['adva-tan-a', { n: 3 }, 'adva-tan-b'], [TEI, 'adva-tan-c'], [fl], [tt]]); }); A.push([[w], [{ t: 'm7' }, 'adva-from', 'adva-t6'], [fl]]); A.push([[w], ['adva-weak', 'adva-t6'], [fl]]); });
  /* v1529（棚 #9）：七文（国士・四暗刻・相手あり測り）の出る所＝本体 advLines0 と同じ並び */
  A.push([['adva-kok-a', { n: 11 }, 'adva-kok-b'], [TEI, 'adva-kok-c'], ['adva-yk-1']]);
  A.push([['adva-kok-a', { n: 10 }, 'adva-kok-b', 'adva-kok-m'], [TEI, 'adva-kok-c'], ['adva-yk-3']]);
  A.push([['adva-yak-a'], [TEI, 'adva-yak-b'], ['adva-yk-4'], ['adva-yk-5']]);
  A.push([['adva-yak-a'], [TEI, 'adva-yak-b'], ['adva-yk-7']]);
  A.push([[w], [{ t: 'm7' }, 'adva-from', 'adva-t6'], ['adva-yk-6']]);
  A.push([[w], ['adva-weak', 'adva-t6'], ['adva-yk-6']]);
  A.push([[SCENES[0]], ['adva-t6']]);
  A.push([[SCENES[1]], ['adva-t6']]);
  A.push([[SCENES[2]], ['adva-t6']]);
  // 期限なし（向聴1以下）の型
  A.push([['adva-chi-a', { n: 4 }, 'adva-chi-b'], [TEI, 'adva-chi-c'], ['adva-tn']]);
  A.push([['adva-toi-a', { n: 2 }, 'adva-toi-b', { n: 3 }, 'adva-toi-c'], [TEI, 'adva-toi-d'], ['adva-tn']]);
  A.push([['adva-tan-a', { n: 3 }, 'adva-tan-b'], [TEI, 'adva-tan-c'], ['adva-tn']]);
  A.push([[SCENES[0]], ['adva-tn']]);
  A.push([[SCENES[1]], ['adva-tn']]);
  A.push([[SCENES[2]], ['adva-tn']]);
  A.push([[w], ['adva-weak', 'adva-tn']]);
  /* v1514：守りの並び（本体 advLines0）＝訳→切る順→ひと言添え（二兎／字牌の対子／浮いたドラ／ドラの近く advd-s-sobat／字牌 advd-s-jihaio のどれか一つ）→線 advd-sen→リーチ。九種九牌は線なし */
  const KEEP_ES = ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'E' }, 'advd-and', { t: 'S' }, 'advd-keep'];
  ['far', 'cheap', 'shape', 'honor', 'few', 'pair'].forEach(k => {
    D.push([['advd-w-' + k], KEEP_ES, [{ t: 'E' }, 'advd-s-jihai'], ['advd-sen'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]);
    D.push([['advd-w-' + k], KEEP_ES, ['advd-s-jihaio'], ['advd-sen'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]);
    D.push([['advd-w-' + k], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'p5' }, 'advd-and', { t: 's5' }, 'advd-keep'], ['advd-s-sobat'], ['advd-sen'], ['advd-riichi'], ['advd-r2a', { t: 'p5' }, 'advd-r2b']]);
  });
  /* v1522：対子の種（棚 #4）＝訳→切る順→種→ひと言→線→リーチ（pair は t のみ／few は n＋f／他は n＋t） */
  ['far', 'cheap', 'shape', 'few', 'pair'].forEach(k => {
    const ch = k === 'pair' ? [['advd-w-chi-t']] : k === 'few' ? [['advd-w-chi-n', 'advd-w-chi-f']] : [['advd-w-chi-n', 'advd-w-chi-t']];
    D.push([['advd-w-' + k], KEEP_ES].concat(ch, [['advd-sen'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]));
    D.push([['advd-w-' + k], KEEP_ES].concat(ch, [[{ t: 'E' }, 'advd-s-jihai'], ['advd-sen'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]));
  });
  D.push([['advd-kyu'], KEEP_ES, [{ t: 'E' }, 'advd-s-jihai'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]);
  D.push([['advd-kyu'], KEEP_ES, [{ t: 'E' }, 'advd-s-jihai'], ['adva-yk-2'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]);   // v1529（棚 #9）：九種九牌の守りに yk-2
  D.push([['advd-kyu'], KEEP_ES, ['adva-yk-2'], ['advd-riichi'], ['advd-r2a', { t: 'E' }, 'advd-r2b']]);
  D.push([['advd-w-far'], [{ t: 'P' }, 'advd-keep'], ['advd-s-jihaio'], ['advd-sen'], ['advd-riichi'], ['advd-r2a', { t: 'P' }, 'advd-r2b']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut'], ['advd-sen'], ['advd-riichi'], ['advd-r2c']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'p5' }, 'advd-and', { t: 's5' }, 'advd-keep'], ['advd-s-nito'], ['advd-sen'], ['advd-riichi'], ['advd-r2a', { t: 'p5' }, 'advd-r2b']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut'], ['advd-s-ukai'], ['advd-sen'], ['advd-riichi'], ['advd-r2c']]);
  D.push([['advd-w-far'], ['advd-cut-a', { t: 'm7' }, 'advd-cut', { t: 'P' }, 'advd-keep'], ['advd-s-jihaio'], ['advd-sen'], ['advd-riichi'], ['advd-r2a', { t: 'P' }, 'advd-r2b']]);
  if (process.env.CHI_ONLY === 'kok') { return { A: A.filter(l => JSON.stringify(l).indexOf('adva-kok-m') >= 0).map(l => C.advEchoLs(l, 'a')), D: [] }; }
  if (process.env.CHI_ONLY) { const base = process.env.CHI_ONLY === 'base'; return { A: [], D: D.filter(l => (JSON.stringify(l).indexOf('advd-w-chi') >= 0) !== base).map(l => C.advEchoLs(l, 'd')) }; }
  return { A: A.map(l => C.advEchoLs(l, 'a')), D: D.map(l => C.advEchoLs(l, 'd')) };   // 受け直し
}
function tokens(l, tone) {   // 助言の行の部品 → {t,term} の列
  const out = [];
  l.forEach(t => {
    if (typeof t === 'string') { const o = tk(C.advToneText(tone, t)); o.id = t; out.push(o); return; }   // v1509：部品id（本体の advParts と同じ）
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
function cutPos(ls) { for (let a = 0; a < ls.length; a++) { for (let b = 0; b < ls[a].length - 1; b++) { const t = ls[a][b], nx = ls[a][b + 1]; if (t && typeof t === 'object' && t.t !== undefined && (nx === 'adva-from' || nx === 'advd-cut' || nx === 'adva-from-s' || nx === 'advd-cut-s')) { return [a, b]; } } } return null; }   // 切る牌を言う所（牌の名の直後・v1503）
function wordTokens(word, tone, dial) {   // 麻雀の言葉（word＝語の番号）。代表3人は書いた字のまま／それ以外は人格の部品を方言の層に通す（前の文に左右されない・文の割り振りの外）
  const lit = C.ADV_WORD_LIT[dial + ':' + tone];
  if (lit && lit[word]) { return [{ t: lit[word], term: false, lit: true }]; }
  return tokens(['advw-' + word], tone).map(x => Object.assign({}, x, { term: false, fx: true }));
}
function build(adviceLines, tone, sd, m, vk, i, om, word, dial, head, noEnd, big) {   // om＝{text, kind}（面白みの一言）／word＝語の番号／head＝判定の一言（v1506：助言の頭に入れる。結論はこの一言で一度だけ言う）
  const hl = [process.env.HEADFLAG ? { t: head, term: false, lit: true, head: true } : { t: head, term: false, lit: true }];   // v1513 の本体（advParts）は head の印を付けない。本体に合わせる
  if (big) { hl.unshift({ t: big, term: false, lit: true }); }   // v1509：大物の一言／惜しむ一言（判定の一言の前・同じ行）
  const lines = [hl];
  const al = adviceLines.map(l => l.slice());
  if (om && om.kind === 'inline') { const cp = cutPos(al); if (cp) { al[cp[0]].splice(cp[1] + 1, 0, { lit: om.text }); } }
  if (om && om.kind === 'front') { lines.push([{ t: om.text, term: false, lit: true }]); }
  al.forEach(l => { const tl = tokens(l, tone); if (C.advNcLine(l)) { tl.nc = true; } lines.push(tl); });
  if (om && om.kind === 'end') { lines.push([{ t: om.text, term: false, lit: true }]); }
  if (word) { lines.push(wordTokens(word, tone, dial)); }
  if (m !== 'n' && !noEnd && !(om && om.kind === 'end')) { lines.push(tokens(['advc-' + tone + '-' + sd + '-' + m + '-' + i], tone)); }   // 本体の endTok（advParts＝advToneText と部品id）に合わせる   // v1507：面白みの一言が終わりに来る時は、その一文が終わりの一言   // ノーマルの終わりの一言は付けない
  return lines;
}
function compose(ls, c, om, word, head, big) {   // 詰めの段を通した最後の形：{ r, lines, level }
  const vs = C.advVariants(ls, c.sd, !!om, !!word); let last = null;
  for (let k = 0; k < vs.length; k++) {
    const v = vs[k], lines = build(v.ls, c.tone, c.sd, c.m, c.vk, c.i, v.omo ? om : null, v.word ? word : null, c.dial, head, v.noEnd, big);
    C.advApplyNc(lines, v.nc, v.noEnd);
    const r = C.advTalk(lines, c.tone, c.dial, c.m !== 'n' && !v.noEnd);
    last = { r: r, lines: lines, level: k, ls: v.ls, ok: false };
    if (!C.advBad(r.text, lines.length, v.soft ? C.ADV_SOFT : 0)) { last.ok = true; return last; }
  }
  return last;
}
const WORDS = C.ADV_WORDS.map(x => x[0]);
const HQ = [0, 0.25, 0.5, 0.75, 1];
function headSamples(dial, tone, m, sd, qs) {   // 一言の候補を区分ごとに、字数の短い順に並べて分位の所だけ取る（長さだけが後ろの組み立てに効くため）
  const P = HP.pool(dial, tone, m, sd), out = [];
  Object.keys(P).forEach(cat => { const a = P[cat].slice().sort((x, y) => x.length - y.length); if (!a.length) { return; } const seen = new Set(); qs.forEach(q => { const h = a[Math.min(a.length - 1, Math.round(q * (a.length - 1)))]; if (!seen.has(h)) { seen.add(h); out.push({ cat: cat, head: h }); } }); });
  return out;
}
function each(cb, opt) {   // 全組み合わせを回して cb(結果, 条件) を呼ぶ。一言（頭）は区分ごとの分位で試す（v1506）
  opt = opt || {}; const qsBase = opt.qs || (process.env.QS ? process.env.QS.split(',').map(Number) : HQ), qsX = opt.qsX || [0, 1];
  const TF = process.env.TONE ? process.env.TONE.split(',') : null, DF = process.env.DIAL !== undefined ? process.env.DIAL.split(',') : null;
  TONES.filter(t => !TF || TF.indexOf(t) >= 0).forEach(tone => DIALS.filter(d => !DF || DF.indexOf(d || 'std') >= 0).forEach(dial => ['n', 'd', 't'].forEach(m => (process.env.SIDE ? process.env.SIDE.split(',') : ['a', 'd']).forEach(sd => {
    const big = C.advBigLine(tone, dial, sd === 'a');   // v1509：大物／惜しむ（本体は ctx.big の時だけ。字が空なら出ない）
    const hb = headSamples(dial, tone, m, sd, qsBase), hx = headSamples(dial, tone, m, sd, qsX);
    VK.forEach(vk => {
    const sc = scenarios(vk), list0 = sd === 'a' ? sc.A : sc.D, list = process.env.YK_ONLY ? list0.filter(ls => /adva-(yk|ch|tt|fl)-/.test(JSON.stringify(ls))) : list0;   // v1529：YK_ONLY＝七文を含む並びだけ回す
    for (let i = 0; i < (process.env.YK_ONLY ? 1 : 3); i++) list.forEach((ls, k) => {   /* v1529：YK_ONLY はくじ一つ */
      const c0 = { tone: tone, dial: dial, m: m, sd: sd, vk: vk, i: i, k: k };
      hb.forEach(h => {
        const f = compose(ls, c0, null, null, h.head);
        cb(f.r, Object.assign({ lines: f.lines, level: f.level, ok: f.ok, head: h.head, hcat: h.cat }, c0));
      });
      if (big && i === 0 && !process.env.YK_ONLY) {   // 大物／惜しむの一言付き（くじ一つ・一言は両端の分位）
        hx.forEach(h => { const fb = compose(ls, c0, null, null, h.head, big); cb(fb.r, Object.assign({ lines: fb.lines, level: fb.level, ok: fb.ok, head: h.head, hcat: h.cat, big: big }, c0)); });
      }
      const ob = C.ADV_OMO[dial + ':' + tone];
      if (ob && i === 0 && !process.env.YK_ONLY && (vk === VK[0] || vk === VK[3])) {   // 一言付きは、見方を二つ・くじ一つに絞って回す（量が多いため）
        Object.keys(ob).forEach(sn => {
          if (sn === 'nick' && !cutPos(ls)) { return; }
          if (C.advOmoOverlaps(sn, ls)) { return; }
          ob[sn].forEach(tx => {
            const om = { text: tx, kind: C.ADV_OMO_KIND[sn] };
            hx.forEach(h => {
              const f2 = compose(ls, c0, om, null, h.head);
              if (f2.level === 0 && C.advHasTriple(f2.r.text)) { return; }
              cb(f2.r, Object.assign({ lines: f2.lines, level: f2.level, ok: f2.ok, omo: tx, omoScene: sn, ids: ls, head: h.head, hcat: h.cat }, c0));
            });
          });
        });
      }
      if (i === 0 && vk === VK[0]) {   // 麻雀の言葉：全員・98語
        (process.env.YK_ONLY ? WORDS.slice(0, 3) : WORDS).forEach(wd => hx.forEach(h => { const f3 = compose(ls, c0, null, wd, h.head); if (f3.level === 0 || f3.level === 1) { cb(f3.r, Object.assign({ lines: f3.lines, level: f3.level, ok: f3.ok, word: wd, ids: ls, head: h.head, hcat: h.cat }, c0)); } }));
      }
    });
    });
  }))));
}
module.exports = { each, build, compose, scenarios, tokens, headSamples, VK, TONES, DIALS, WORDS };
if (require.main === module) {
  let total = 0, runs = 0, conn = 0, over = 0, mx = 0; const need = new Set(), chg = new Set();
  each((r, c) => {
    total++;
    const e = C.advEst(r.text, c.lines.length); if (e > C.ADV_CAP) { over++; } if (e > mx) { mx = e; }
    const ss = r.text.split(/(?<=[。！？])/).filter(Boolean); let run = 1;
    for (let k = 1; k < ss.length; k++) { if (ss[k].slice(-4) === ss[k - 1].slice(-4)) { run++; if (run === 3) runs++; } else { run = 1; } }
    const cs = r.items.filter(x => x.conn).map(x => x.text); for (let k = 1; k < cs.length; k++) { if (cs[k] === cs[k - 1]) { conn++; } }
    r.items.forEach(x => { if (x.conn || x.changed) { chg.add(x.text); } });
  });
  console.log('組み合わせ ' + total + '通り／同じ語尾が三文続く ' + runs + '件／つなぎが続けて同じ ' + conn + '件／声が要る字の種類 ' + chg.size + '／30秒超 ' + over + '件・最長 ' + mx.toFixed(1) + '秒');
}
