#!/usr/bin/env node
/* hotspots.js — 直しの溜まり場と、一緒に変わる組（2026-11-26・橋の枠 三百四十五・本人の決め・数えて知らせるだけで何も直さない）。
   本体・パネル・口調表（advice-tone-core.js）の直しの記録（git の履歴）から、
     ①同じ部分（関数・節の単位）が何度直されたかを数え、多い順に senko/hotspots.md に並べる。30日のうちに同じ部分の直しが三度目になったら、
        その部分と三度の直しの訳（commit の題）を印にして hotspot-alerts.json に出す（VAIO が札の頭に出す）。
     ②いつも同じ直しで一緒に変わる組（ファイルの組）を拾って senko/cochange.md に表にし、直近3日の直しで片方だけ変わった物があれば hotspot-alerts.json に出す（VAIO が札で一言知らせる）。
   ＊読むだけ。雲で回す（koushu-state の hotspots.yml・履歴を全部取った koushu-handan の写しの上で）。VAIO では回さない（履歴が大きく、git が重い）。
   ＊部分の名は、差分の見出し（@@ … @@ の後ろ）に出る関数・const・window.xxx の行（diff の xfuncname を hotspots.yml が .git/info/attributes で当てる）。見つからない所は「（見出し無し）」。
   使い方  node tools/hotspots.js <履歴を持つ koushu-handan の置き場> <出し先の senko フォルダ> [--days 30] [--now <epoch 秒>] */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const a = process.argv.slice(2), opt = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : ''; };
const REPO = path.resolve(a[0] || '.'), OD = path.resolve(a[1] || '.'), DAYS = Number(opt('--days')) || 30, NOW = Number(opt('--now')) || Math.floor(Date.now() / 1000);
const BODY = ['koushu-handan.html', 'panel.html', 'panel-core.js', 'advice-tone-core.js'];
const CO = ['koushu-handan.html', 'panel.html', 'panel-core.js', 'panel-view.js', 'panel-check.js', 'advice-tone-core.js', 'serifu.txt', 'serifu-adv.txt', 'ver.txt', 'panel-ver.txt', 'voice-advice-dial.json', 'voice-used.txt', 'widget-check.js', 'usage-widget.html', 'usage-widget-loader.js', 'check.js'];
const git = (args, ms) => cp.spawnSync('git', ['-C', REPO].concat(args), { encoding: 'utf8', maxBuffer: 1 << 30, timeout: ms || 600000 });
const z2 = n => (n < 10 ? '0' : '') + n;
const day = t => { const d = new Date((t + 9 * 3600) * 1000); return (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + ' ' + z2(d.getUTCHours()) + ':' + z2(d.getUTCMinutes()); };
const stamp = t => { const d = new Date((t + 9 * 3600) * 1000); return d.getUTCFullYear() + '-' + z2(d.getUTCMonth() + 1) + '-' + z2(d.getUTCDate()) + ' ' + z2(d.getUTCHours()) + ':' + z2(d.getUTCMinutes()); };
/* ① 同じ部分の直し */
const since30 = NOW - DAYS * 86400;
const r1 = git(['log', '--since=' + since30, '--no-merges', '--format=@@C%H%x09%ct%x09%s', '-p', '-U0', '--no-color', '--'].concat(BODY));
if (r1.status !== 0) { console.error('git log が落ちた：' + String(r1.stderr).slice(0, 200)); process.exit(3); }
const parts = {};   // 名 → { commits: Map(sha → {t, s}) }
let cur = null, file = '';
String(r1.stdout).split('\n').forEach(l => {
  if (l.startsWith('@@C')) { const c = l.slice(3).split('\t'); cur = { sha: c[0], t: Number(c[1]), s: (c.slice(2).join('\t') || '').slice(0, 90) }; return; }
  if (l.startsWith('+++ b/')) { file = l.slice(6); return; }
  if (cur && l.startsWith('@@ ')) {
    const m = /^@@ [^@]*@@\s?(.*)$/.exec(l); let h = (m && m[1] || '').trim();
    const nm = /(function\s+[A-Za-z0-9_$]+|const\s+[A-Za-z_$][A-Za-z0-9_$]*|window\.[A-Za-z0-9_$]+|let\s+[A-Za-z_$][A-Za-z0-9_$]*|var\s+[A-Za-z_$][A-Za-z0-9_$]*)/.exec(h);
    h = nm ? nm[1] : (h ? h.slice(0, 30) : '（見出し無し）');
    const key = file + '｜' + h; const o = parts[key] || (parts[key] = { file: file, part: h, commits: new Map() });
    if (!o.commits.has(cur.sha)) { o.commits.set(cur.sha, { t: cur.t, s: cur.s }); }
  }
});
const list = Object.values(parts).map(o => ({ file: o.file, part: o.part, n: o.commits.size, cs: [...o.commits.values()].sort((x, y) => x.t - y.t) })).filter(o => o.part !== '（見出し無し）' || o.n >= 3).sort((x, y) => y.n - x.n || x.part.localeCompare(y.part));
const third = list.filter(o => o.n >= 3 && o.cs[2].t >= NOW - 3 * 86400);   // 三度目の直しが直近3日に入った部分
const H = ['# 直しの溜まり場（センコ用・数えて知らせるだけ）', '', '書いた刻：' + stamp(NOW) + '（日本時間）', '見る範囲：本体・パネル・口調表（' + BODY.join('・') + '）の直近 ' + DAYS + ' 日の直し（commit ' + new Set([].concat(...list.map(o => o.cs.map(c => c.t + c.s)))).size + ' 件の変わった部分を数えた）', '', '## 直しが多い部分（同じ部分に入った commit の数・多い順）', ''];
list.slice(0, 40).forEach(o => H.push('- ' + o.n + ' 回｜' + o.file + '｜' + o.part + (o.n >= 3 ? '｜三度目以上' : '') + '｜' + o.cs.slice(-3).map(c => day(c.t) + ' ' + c.s.slice(0, 40)).join(' ／ ')));
H.push('', '## 三度目になった部分（直近3日に三度目の直しが入った物）', '');
if (!third.length) { H.push('なし'); } else { third.forEach(o => H.push('- ' + o.file + '｜' + o.part + '｜' + o.n + ' 回｜三度の直しの訳：' + o.cs.slice(0, 3).map(c => day(c.t) + ' ' + c.s).join(' ／ '))); }
fs.mkdirSync(OD, { recursive: true });
fs.writeFileSync(path.join(OD, 'hotspots.md'), H.join('\n') + '\n', 'utf8');
/* ② 一緒に変わる組 */
const since90 = NOW - 90 * 86400;
const r2 = git(['log', '--since=' + since90, '--no-merges', '--name-only', '--format=@@C%H%x09%ct%x09%s', '--'].concat(CO));
const commits = []; let cc = null;
String(r2.stdout).split('\n').forEach(l => { if (l.startsWith('@@C')) { const c = l.slice(3).split('\t'); cc = { sha: c[0], t: Number(c[1]), s: (c.slice(2).join('\t') || '').slice(0, 90), files: new Set() }; commits.push(cc); } else if (cc && l.trim() && CO.indexOf(l.trim()) >= 0) { cc.files.add(l.trim()); } });
const cnt = {}, co = {};
commits.forEach(c => { const fs_ = [...c.files]; fs_.forEach(f => { cnt[f] = (cnt[f] || 0) + 1; fs_.forEach(g => { if (f !== g) { const k = f + '→' + g; co[k] = (co[k] || 0) + 1; } }); }); });
const pairs = Object.keys(co).map(k => { const [f, g] = k.split('→'); return { f: f, g: g, n: co[k], base: cnt[f], conf: co[k] / cnt[f] }; }).filter(p => p.base >= 5 && p.conf >= 0.7).sort((x, y) => y.conf - x.conf || y.base - x.base);
const C = ['# 一緒に変わる組（センコ用・数えて知らせるだけ）', '', '書いた刻：' + stamp(NOW) + '（日本時間）', '見る範囲：直近90日の commit ' + commits.length + ' 件・ファイル ' + CO.length + ' 本', '読み方：「A を直した commit の何割で B も直されたか」。5回以上直された A で7割以上の組だけ並べる。', '', '## いつも一緒に変わる組（A→B・割合・A の直しの数）', ''];
pairs.slice(0, 40).forEach(p => C.push('- ' + p.f + ' → ' + p.g + '｜' + Math.round(p.conf * 100) + '%（' + p.n + '／' + p.base + '）'));
const strong = pairs.filter(p => p.base >= 8 && p.conf >= 0.8);
const oneSided = [];
commits.filter(c => c.t >= NOW - 3 * 86400).forEach(c => { strong.forEach(p => { if (c.files.has(p.f) && !c.files.has(p.g)) { oneSided.push({ sha: c.sha.slice(0, 9), s: c.s, changed: p.f, missing: p.g, conf: Math.round(p.conf * 100), t: c.t }); } }); });
C.push('', '## 直近3日の直しで、片方だけ変わった物（A→B が8割以上の組で、A だけ変わった commit）', '');
if (!oneSided.length) { C.push('なし'); } else { oneSided.slice(0, 30).forEach(x => C.push('- ' + day(x.t) + ' ' + x.sha + ' ' + x.s + '｜' + x.changed + ' は変わったが ' + x.missing + ' は変わっていない（いつもは ' + x.conf + '% で一緒）')); }
fs.writeFileSync(path.join(OD, 'cochange.md'), C.join('\n') + '\n', 'utf8');
const alerts = { at: NOW, third: third.map(o => ({ key: o.file + '｜' + o.part + '｜' + o.cs[2].t, file: o.file, part: o.part, n: o.n, why: o.cs.slice(0, 3).map(c => c.s) })), oneSided: oneSided.map(x => ({ key: x.sha + '｜' + x.missing, sha: x.sha, s: x.s, changed: x.changed, missing: x.missing, conf: x.conf })) };
fs.writeFileSync(path.join(OD, 'hotspot-alerts.json'), JSON.stringify(alerts, null, 1), 'utf8');
console.log('部分 ' + list.length + '・三度目 ' + third.length + '・組 ' + pairs.length + '・片方だけ ' + oneSided.length + '・commit(30日) ' + new Set(list.flatMap(o => o.cs.map(c => c.t + c.s))).size + '・commit(90日) ' + commits.length);
