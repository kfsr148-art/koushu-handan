// 雲で：今の助言の声の長さを全組み合わせで測る（2026-11-25・橋の枠 三百 一）
//   ＊ふつう（攻めの頭の型・弱い牌・受け直し）と、特殊な形（国士・九種・七対子・染め・対々・断么・一向聴以内・猫牌・役満・場面）と、守りを分けて、
//     見積り秒（本体の advEst＝一字0.19秒ほか）の平均・最長・分位・20秒／30秒を越える割合・空きを出す。標本：くじ i は 0 だけ、一言の分位は 0／0.5／1。
//   ＊材料は advice-talk-sim.js（v1507/ に在る全組み合わせの写し）。本体は替えない。
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..', '..'), SUB = path.join(__dirname, 'v1507');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'len300-'));
['advice-tone-core.js', 'voice-advice-catalog.js', 'voice-advice-open.js', 'voice-advice-persona.js', 'voice-advice-dial.js', 'voice-advice-dial.json'].forEach(f => fs.copyFileSync(path.join(ROOT, f), path.join(tmp, f)));
fs.readdirSync(SUB).forEach(f => fs.copyFileSync(path.join(SUB, f), path.join(tmp, f)));
const body = `'use strict';
const S = require('./advice-talk-sim.js'), C = require('./advice-tone-core.js');
const SPECIAL = /adva-kok|adva-chi|adva-toi|adva-tan|adva-ikk|adva-neko|adva-yak|scene/i;
const cats = { 'ふつう（攻め）': [], '特殊な形（攻め）': [], '守り': [] };
const byKind = {};
S.TONES.forEach(tone => S.DIALS.forEach(dial => ['n', 'd', 't'].forEach(m => ['a', 'd'].forEach(sd => {
  const hs = S.headSamples(dial, tone, m, sd, [0, 0.25, 0.5, 0.75, 1]);
  S.VK.forEach(vk => {
    const sc = S.scenarios(vk), list = sd === 'a' ? sc.A : sc.D;
    for (let ii = 0; ii < 3; ii++) list.forEach((ls, k) => {
      const cat = sd === 'd' ? '守り' : (SPECIAL.test(JSON.stringify(ls)) ? '特殊な形（攻め）' : 'ふつう（攻め）');
      hs.forEach(h => {
        const f = S.compose(ls, { tone, dial, m, sd, vk, i: ii, k }, null, null, h.head);
        const e = C.advEst(f.r.text, f.lines.length);
        cats[cat].push({ e, ok: f.ok, len: f.r.text.length });
        const kk = cat + ' 場面' + k; (byKind[kk] = byKind[kk] || []).push(e);
      });
    });
  });
}))));
const mx = a => a.reduce((m, x) => x > m ? x : m, -1e9);
const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return +s[Math.min(s.length - 1, Math.floor(s.length * p))].toFixed(1); };
const out = {};
Object.keys(cats).forEach(c => { const a = cats[c].map(x => x.e); const n = a.length; if (!n) { return; }
  out[c] = { 標本: n, 収まった: cats[c].filter(x => x.ok).length, 平均秒: +(a.reduce((x, y) => x + y, 0) / n).toFixed(1), 中央: q(a, 0.5), 九割: q(a, 0.9), 最長: +mx(a).toFixed(1), 越20秒の割合: +(a.filter(x => x > 20).length / n * 100).toFixed(1), 越30秒の割合: +(a.filter(x => x > 30).length / n * 100).toFixed(1), 平均字数: Math.round(cats[c].reduce((x, y) => x + y.len, 0) / n), 最長字数: mx(cats[c].map(x => x.len)), '20秒までの空き（平均）': +(20 - a.reduce((x, y) => x + y, 0) / n).toFixed(1), '30秒までの空き（平均）': +(30 - a.reduce((x, y) => x + y, 0) / n).toFixed(1) };
});
const kinds = Object.keys(byKind).sort().map(k => { const a = byKind[k]; return k + '：平均' + (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) + '秒・最長' + mx(a).toFixed(1) + '秒（' + a.length + '）'; });
console.log(JSON.stringify(out, null, 1)); console.log(kinds.join('\\n'));
`;
fs.writeFileSync(path.join(tmp, 'len300.js'), body);
const t0 = Date.now();
cp.execFileSync('node', ['len300.js'], { cwd: tmp, stdio: 'inherit', env: Object.assign({}, process.env, { HEAD_HTML: path.join(ROOT, 'koushu-handan.html') }), timeout: 25 * 60 * 1000 });
console.log('len300 所要', Math.round((Date.now() - t0) / 1000) + '秒');
