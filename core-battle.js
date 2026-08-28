#!/usr/bin/env node
/* ============================================================
   core-battle.js — 配牌の判定と、その局の結末を突き合わせる集計台
   ============================================================
   ＊本体（koushu-handan.html）には一字も触れない。配牌の判定は core-probe.js 越しに
     analyze() を呼ぶ（実行のたび本体から字面を読み出す形。写しを持たない）。

   ＊局を打ち切らせるのは @kobalab/majiang-core（MIT）、打牌の思考は
     @kobalab/majiang-ai（MIT）。どちらも package.json に版を固定して入れてある。

   ＊一局につき四行を書き出す。並びは25項目（タブ区切り）。
       1 局番号   2 席（0=起家からの座順）   3 親か（1/0）   4 配牌13枚
       5〜21 core-probe.js の17項目
       22 局の結果（和了／放銃／被ツモ／流局／無関係）
       23 点棒の増減（符号つき）   24 和了の役名（和了した席だけ）   25 打ち切った巡目

   使い方
     node core-battle.js            … 1000局
     node core-battle.js 50         … 局数を指定
     node core-battle.js 50 out.tsv … 書き出し先も指定
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const Majiang = require('@kobalab/majiang-core');
const AI = require('@kobalab/majiang-ai');
const { makeAnalyze, parseHand, FIELDS } = require('./core-probe.js');

const N = Number(process.argv[2] || 1000);
/* 書き出し先。丸ごとの道を渡されたらそのまま使い、名だけならリポジトリ直下へ置く。 */
const OUT = process.argv[3]
  ? (path.isAbsolute(process.argv[3]) ? process.argv[3] : path.join(__dirname, process.argv[3]))
  : path.join(__dirname, 'core-battle-log.tsv');
const PROGRESS_MS = 10 * 60 * 1000;   /* 十分ごとに途中経過を出す */

/* 麻雀ライブラリの手牌の書き方（"m12077p235689s4z1"）を、
   core-probe.js の読み方（"12077m235689p4s1z"）へ直す。
   ＊数字と種類の並びが逆なだけで、中身は同じ。0 はどちらも赤五。 */
function toProbeHand(s) {
  const out = [];
  const re = /([mpsz])([0-9]+)/g;
  let m;
  while ((m = re.exec(String(s || '')))) { out.push(m[2] + m[1]); }
  return out.join('');
}

/* 局の終わり方から、席ごとの結末を決める。 */
function outcomeOf(last, seat) {
  if (last && last.hule) {
    const h = last.hule;
    if (h.l === seat) { return '和了'; }
    if (typeof h.baojia === 'number' && h.baojia === seat) { return '放銃'; }
    if (typeof h.baojia !== 'number') { return '被ツモ'; }
    return '無関係';
  }
  if (last && last.pingju) { return '流局'; }
  return '無関係';
}

/* 打ち切った巡目。自摸の数を四で割って切り上げる。 */
function junme(kyoku) {
  let z = 0;
  kyoku.forEach(e => { if (e && e.zimo) { z++; } });
  return Math.ceil(z / 4);
}

/* 書き出す17項目。core-probe.js の FIELDS は28項目あるが、
   一行を読み切れる長さに収めるため、宣言した17項目だけを採る。
   ＊順も宣言のとおり。増やしたくなったら、ここへ足してから宣言し直すこと。 */
const BATTLE_FIELDS = [
  'verdict', 'borderline', 'baseShanten', 'acceptTypes', 'acceptTiles',
  'widthLabel', 'goodShapes', 'weakShapes', 'totalBlocks', 'shapeOK',
  'shapeNeeded', 'hasValue', 'doraValue', 'redCount', 'yakuhaiPair',
  'defHonors', 'defTerminals'
];
/* FIELDS に無い名を書いてしまったら、そこで気づけるようにする。 */
BATTLE_FIELDS.forEach(k => {
  if (FIELDS.indexOf(k) < 0) { throw new Error('core-probe.js の項目に無い名: ' + k); }
});

const HEAD = ['局', '席', '親', '配牌']
  .concat(BATTLE_FIELDS)
  .concat(['結果', '点棒', '役', '巡目']);

function main() {
  const analyze = makeAnalyze();
  const rule = Majiang.rule({ '場数': 0 });   /* 一局戦 */
  const fd = fs.openSync(OUT, 'w');
  fs.writeSync(fd, HEAD.join('\t') + '\n', null, 'utf8');

  const t0 = Date.now();
  let last = t0, rows = 0, done = 0;
  console.log('■ 配牌の判定と局の結末の突き合わせ');
  console.log('  局数        : ' + N);
  console.log('  書き出し先  : ' + OUT);
  console.log('  中核        : koushu-handan.html ' + analyze.from + '〜' + analyze.to + '行（本体は無変更）');
  console.log('  始めた時刻  : ' + new Date().toTimeString().slice(0, 8));
  console.log('');

  for (let i = 1; i <= N; i++) {
    let paipu = null;
    const players = [0, 1, 2, 3].map(() => new AI());
    const game = new Majiang.Game(players, p => { paipu = p; }, rule, 'battle');
    game.speed = 0;
    game.stop = null;
    game.do_sync();
    done++;

    if (!paipu || !paipu.log || !paipu.log.length) { continue; }
    const kyoku = paipu.log[0];
    const qipai = (kyoku[0] || {}).qipai;
    if (!qipai) { continue; }
    const end = kyoku[kyoku.length - 1] || {};
    const fenpei = (end.hule && end.hule.fenpei) || (end.pingju && end.pingju.fenpei) || [0, 0, 0, 0];
    const yaku = (end.hule && end.hule.hupai)
      ? end.hule.hupai.map(x => x.name + (x.fanshu ? x.fanshu : '')).join('・') : '';
    const jun = junme(kyoku);
    const oya = qipai.jushu;
    const zhuang = qipai.zhuangfeng;   /* 0=東場 */
    const WIND = ['E', 'S', 'W', 'N'];

    for (let seat = 0; seat < 4; seat++) {
      const hand = toProbeHand(qipai.shoupai[seat]);
      /* 自風は「親からの座順」で決まる。場風は zhuangfeng。 */
      const seatWind = WIND[(seat - oya + 4) % 4];
      const roundWind = WIND[zhuang] || 'E';
      let r;
      try { r = analyze(parseHand(hand), seatWind, roundWind, 0); }
      catch (e) { r = {}; }
      const cells = [i, seat, (seat === oya ? 1 : 0), hand];
      BATTLE_FIELDS.forEach(k => {
        const v = r[k];
        cells.push(v === true ? 1 : v === false ? 0 : (v === undefined ? '' : v));
      });
      cells.push(outcomeOf(end, seat));
      cells.push(fenpei[seat] === undefined ? '' : fenpei[seat]);
      cells.push(seat === (end.hule ? end.hule.l : -1) ? yaku : '');
      cells.push(jun);
      fs.writeSync(fd, cells.join('\t') + '\n', null, 'utf8');
      rows++;
    }

    const now = Date.now();
    if (now - last >= PROGRESS_MS || i === N) {
      const el = (now - t0) / 1000;
      const per = el / i;
      const left = (N - i) * per;
      console.log('  途中経過 ' + new Date().toTimeString().slice(0, 8)
        + ' … ' + i + '/' + N + '局（' + (i / N * 100).toFixed(1) + '%）'
        + '／経過 ' + (el / 60).toFixed(1) + '分'
        + '／一局 ' + per.toFixed(2) + '秒'
        + '／残り およそ ' + (left / 60).toFixed(1) + '分');
      last = now;
    }
  }

  fs.closeSync(fd);
  const st = fs.statSync(OUT);
  const el = (Date.now() - t0) / 1000;
  console.log('');
  console.log('■ 終わり');
  console.log('  打ち切った局数 : ' + done + '／' + N);
  console.log('  書き出した行数 : ' + rows + '行（見出しを除く）');
  console.log('  ファイルの大きさ: ' + st.size + 'バイト（' + (st.size / 1024).toFixed(1) + 'KB）');
  console.log('  かかった時間   : ' + (el / 60).toFixed(1) + '分（一局 ' + (el / done).toFixed(2) + '秒）');
  console.log('  書き出し先     : ' + OUT);
}

if (require.main === module) { main(); }
module.exports = { toProbeHand, outcomeOf, junme, HEAD };
