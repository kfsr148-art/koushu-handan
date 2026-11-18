// 今夜の git-push.log の「見送る（15秒待った）」を数え、その直前25秒に押された commit（両方の置き場）から、錠を握っていた押しを当てる（2026-11-19）
'use strict';
const fs = require('fs'), cp = require('child_process');
const since = process.argv[2] || '2026-11-18 18:00:00';
const rows = fs.readFileSync('C:/Users/user/.claude/git-push.log', 'utf8').split(/\r?\n/).filter(l => l >= since && /見送る（15秒待った）/.test(l));
const kind = s => /合図/.test(s) ? 'turn（合図）' : /state\.json/.test(s) ? 'state（見張り）' : /notices|status\.md|知らせ/.test(s) ? '札（notices）' : /usage/.test(s) ? '使用量（usage）' : /board/.test(s) ? 'board' : /pipe/.test(s) ? 'pipe' : /ntfy/.test(s) ? 'ntfy' : 'その他';
const commits = [];
['C:/Users/user/Desktop/mahjong/koushu-handan', 'C:/Users/user/Desktop/mahjong/koushu-state'].forEach(r => {
  try { cp.execFileSync('git', ['-C', r, 'log', '--since=' + since, '--format=%ct\t%s'], { maxBuffer: 1 << 26 }).toString().split('\n').filter(Boolean).forEach(l => { const [t, s] = l.split('\t'); commits.push({ t: +t, s: s }); }); } catch (e) { }
});
const pair = {}, byWho = {};
rows.forEach(l => {
  const [ts, who] = l.split('\t');
  const t = Date.parse(ts.replace(' ', 'T') + '+09:00') / 1000;
  byWho[who] = (byWho[who] || 0) + 1;
  const near = commits.filter(c => c.t >= t - 25 && c.t <= t).map(c => kind(c.s));
  const holder = near.length ? [...new Set(near)].join('・') : '不明（その25秒に押しの commit 無し）';
  const k = who + ' ← ' + holder; pair[k] = (pair[k] || 0) + 1;
});
console.log('見送り（' + since + ' 以後）：' + rows.length + '回');
console.log('見送った側：' + Object.entries(byWho).map(([k, v]) => k + ' ' + v).join('・'));
console.log('見送った側 ← 直前25秒に押していた側（錠を握っていたと見られる）：');
Object.entries(pair).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ' + k + '：' + v + '回'));
