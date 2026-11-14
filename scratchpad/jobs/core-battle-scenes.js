// 雲で：core-battle を4本×350局（計1400局）で回し、向聴列・安全列に加えて ドラ・打牌列・鳴き列 を記録する（2026-11-14・七人の審判の場面の比べ）
//   ＊中身は core-battle-1000.js と同じ。違いは core-battle.js が書く最後の列「向聴列」と、山の赤牌の確かめ。
//   ＊VAIO（4GB）で回すと一局7.7秒・約2時間かかり、空きメモリ不足で95局で止められた。そこで雲で回す。
//   ＊依存（@kobalab/majiang-core・majiang-ai）は雲の写しに無いので、npm ci で入れる。
//   ＊job.yml の上限（台本ごと1500秒）に収めるため、250局ずつ4本を並べて回す。局は毎回でたらめに配られる
//     （core-battle.js は種を固定しない）ので、4本を足して1000局になる。1380秒で切り、そこまでに書けた局だけを数える。
//   ＊攻め／守りごとに、和了率・放銃率・平均の点棒を出し、8月28日の記録（リポジトリ直下の core-battle-log.tsv。
//     commit 11cb3aed のまま変わっていない）と並べる。今回の記録は reports/cloud-core-battle-scenes-<刻>.tsv に残す。
//   ＊本体（koushu-handan.html）には触らない。core-battle.js が本体から字面を読むだけ。
'use strict';
const fs = require('fs'), path = require('path'), { execSync, spawn } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const PARTS = 4, PER = 350, LIMIT_MS = 1380 * 1000;
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
const OUT = path.join(ROOT, 'reports', 'cloud-core-battle-scenes-' + stamp + '.tsv');

function summarize(text){
  const lines = text.split(/\r?\n/).filter(l => l && l[0] !== '#');
  const head = lines[0].split('\t'), iv = head.indexOf('verdict'), ir = head.indexOf('結果'), ip = head.indexOf('点棒'), ik = head.indexOf('局');
  const g = {}, games = new Set();
  for (const l of lines.slice(1)) {
    const c = l.split('\t'); if (!c[iv]) continue;
    games.add(c[ik]);
    const o = g[c[iv]] || (g[c[iv]] = { n: 0, win: 0, deal: 0, pts: 0 });
    o.n++; o.pts += Number(c[ip]) || 0;
    if (c[ir] === '和了') o.win++;
    if (c[ir] === '放銃') o.deal++;
  }
  return { games: games.size, g: g };
}
function row(label, o){
  if (!o || !o.n) return '| ' + label + ' | 0 | - | - | - |';
  return '| ' + label + ' | ' + o.n + ' | ' + (o.win / o.n * 100).toFixed(1) + '% | ' + (o.deal / o.n * 100).toFixed(1) + '% | ' + (o.pts / o.n >= 0 ? '+' : '') + Math.round(o.pts / o.n) + ' |';
}

console.log('依存を入れる（npm ci）…');
execSync('npm ci --no-audit --no-fund', { cwd: ROOT, stdio: 'inherit' });
console.log('core-battle を ' + PARTS + '本 × ' + PER + '局で並べて回す（上限 ' + LIMIT_MS / 1000 + '秒）');
const t0 = Date.now();
const files = [];
const runs = [];
for (let k = 0; k < PARTS; k++) {
  const f = path.join(ROOT, 'reports', '.battle-part-' + k + '.tsv');
  files.push(f);
  runs.push(new Promise(res => {
    const p = spawn(process.execPath, [path.join(ROOT, 'core-battle.js'), String(PER), f], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
    const timer = setTimeout(() => { try { p.kill('SIGKILL'); } catch (e) { } }, LIMIT_MS);
    p.on('exit', code => { clearTimeout(timer); res(code); });
  }));
}
Promise.all(runs).then(codes => {
  /* 山の確かめ：Majiang.Shan を2000回組み、牌の内訳と赤牌の数を数える（雀魂は各色の五に赤一枚＝計3枚・136枚） */
  try {
    const Majiang = require('@kobalab/majiang-core');
    const rule = Majiang.rule({ '場数': 0 });
    let bad = 0, red = {};
    for (let i = 0; i < 2000; i++) {
      const sh = new Majiang.Shan(rule), all = sh._pai.slice();
      if (all.length !== 136) bad++;
      const r = all.filter(p => p[1] === '0' || p[0] === '0').length;
      red[r] = (red[r] || 0) + 1;
    }
    console.log('山の確かめ … 2000回／136枚でない山 ' + bad + '／赤牌の枚数の内訳 ' + JSON.stringify(red) + '／rule赤牌 ' + JSON.stringify(rule['赤牌']));
  } catch (e) { console.log('山の確かめに失敗: ' + e.message); }
  const sec = Math.round((Date.now() - t0) / 1000);
  /* 4本の記録を一本へ。局番号は本ごとに付け直す（本の番号 × 1000 + 局） */
  let header = null, body = [];
  files.forEach((f, k) => {
    if (!fs.existsSync(f)) return;
    const ls = fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#');
    if (!ls.length) return;
    if (!header) header = ls[0];
    const ik = ls[0].split('\t').indexOf('局');
    ls.slice(1).forEach(l => { const c = l.split('\t'); c[ik] = String(k * 1000 + Number(c[ik])); body.push(c.join('\t')); });
    fs.unlinkSync(f);
  });
  if (!header) { console.log('記録が一行も書けなかった'); process.exit(1); }
  fs.writeFileSync(OUT, '# 雲で回した core-battle（' + PARTS + '本 × ' + PER + '局・' + stamp + ' UTC）。母集団は機械打ち同士（@kobalab/majiang-ai）\n' + header + '\n' + body.join('\n') + '\n');
  const now = summarize(header + '\n' + body.join('\n'));
  const old = summarize(fs.readFileSync(path.join(ROOT, 'core-battle-log.tsv'), 'utf8'));
  console.log('');
  console.log('終了コード ' + JSON.stringify(codes) + '／' + sec + '秒／今回 ' + now.games + '局（' + body.length + '行）');
  console.log('記録 … reports/' + path.basename(OUT));
  console.log('');
  console.log('| | 手 | 和了率 | 放銃率 | 平均の点棒 |');
  console.log('|---|---|---|---|---|');
  console.log(row('8月28日・攻め（' + old.games + '局）', old.g.attack));
  console.log(row('今回・攻め（' + now.games + '局）', now.g.attack));
  console.log(row('8月28日・守り', old.g.defend));
  console.log(row('今回・守り', now.g.defend));
});
