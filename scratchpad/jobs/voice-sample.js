// 雲で：公開の声の音の測定と、軽くした音のサンプル（2026-11-25・橋の枠 二百九十五）
//   ＊一、公開に載る声（voice-used.txt の声）を種類ごとに測る（本数・合計・形式・ビットレート・チャンネル・周波数）。
//   ＊二、声の違う三本（方言の声 advy- 一本・人格の声 advx- 二人）を選び、元の音（今の声）と、軽くした音を三通り作る。
//        今の声は AAC-LC・mono・24kHz・48kbps なので、これより重くなる物（64k など）は作らない：40k／32k／24k（どれも mono・24kHz・m4a）。
//   ＊三、各設定の「全部をその設定にした時の公開の合計の見込み」を、無作為の声 40 本の縮み率から出す。
//   ＊結果は reports/voice-sample/（data.json と m4a）へ。本体の声は替えない。
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'reports', 'voice-sample');
fs.mkdirSync(OUT, { recursive: true });
function sh(c) { return cp.execSync(c, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 }).toString(); }
try { sh('ffmpeg -version'); } catch (e) { cp.execSync('sudo apt-get update -qq && sudo apt-get install -y -qq ffmpeg', { stdio: 'inherit' }); }
const man = fs.readFileSync(path.join(ROOT, 'voice-used.txt'), 'utf8').split(/\r?\n/).filter(Boolean).filter(n => fs.existsSync(path.join(ROOT, n)));
const kind = n => /^advy-/.test(n) ? 'advy' : (/^advx-/.test(n) ? 'advx' : 'other');
const size = n => fs.statSync(path.join(ROOT, n)).size;
const tot = { advy: { n: 0, b: 0 }, advx: { n: 0, b: 0 } };
man.forEach(n => { const k = kind(n); if (tot[k]) { tot[k].n++; tot[k].b += size(n); } });
const voiceBytes = tot.advy.b + tot.advx.b;
// 公開の荷の全体（pack-site の数え方）
let pack = '';
try { pack = sh('node pack-site.js --dry').split('\n').filter(l => /公開の荷|内訳/.test(l)).join(' / '); } catch (e) { pack = '（pack-site --dry が走らなかった）'; }
const probe = n => { const j = JSON.parse(sh('ffprobe -v error -show_entries stream=codec_name,profile,sample_rate,channels,bit_rate:format=duration,size -of json "' + path.join(ROOT, n) + '"')); const s = j.streams[0]; return { n, codec: s.codec_name, profile: s.profile, rate: +s.sample_rate, ch: s.channels, kbps: Math.round((+j.format.size * 8 / +j.format.duration) / 1000), sec: +(+j.format.duration).toFixed(2), bytes: +j.format.size }; };
// 無作為（決まった間隔）の 40 本
const step = Math.max(1, Math.floor(man.length / 40)); const samp = []; for (let i = 0; i < man.length && samp.length < 40; i += step) { samp.push(man[i]); }
const info = samp.map(probe);
const uniq = k => [...new Set(info.map(x => x[k]))].join('／');
const avgKbps = Math.round(info.reduce((a, x) => a + x.kbps, 0) / info.length);
const avgSec = +(info.reduce((a, x) => a + x.sec, 0) / info.length).toFixed(2);
// 変種
const V = [{ id: 'k40', kbps: 40 }, { id: 'k32', kbps: 32 }, { id: 'k24', kbps: 24 }];
function enc(src, dst, kbps) { sh('ffmpeg -y -loglevel error -i "' + src + '" -c:a aac -profile:a aac_low -b:a ' + kbps + 'k -ar 24000 -ac 1 -movflags +faststart "' + dst + '"'); }
const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'vs-'));
const ratio = {}; V.forEach(v => { ratio[v.id] = { b: 0, o: 0 }; });
samp.forEach((n, i) => { const o = size(n); V.forEach(v => { const d = path.join(tmp, i + '-' + v.id + '.m4a'); enc(path.join(ROOT, n), d, v.kbps); ratio[v.id].b += fs.statSync(d).size; ratio[v.id].o += o; }); });
// 三本
const pick = [];
const pickOne = re => { const c = man.filter(n => re.test(n)); const withLen = c.slice(0, 400).map(n => ({ n, b: size(n) })).sort((a, b) => a.b - b.b); return withLen[Math.floor(withLen.length / 2)].n; };
pick.push(pickOne(/^advy-/)); pick.push(pickOne(/^advx-sensei-/)); pick.push(pickOne(/^advx-ichihime-/));
const voices = pick.map(n => {
  const cur = probe(n); fs.copyFileSync(path.join(ROOT, n), path.join(OUT, n.replace(/\.m4a$/, '.orig.m4a')));
  const v = { n, cur, f: {} };
  V.forEach(x => { const dst = path.join(OUT, n.replace(/\.m4a$/, '.' + x.id + '.m4a')); enc(path.join(ROOT, n), dst, x.kbps); v.f[x.id] = fs.statSync(dst).size; });
  return v;
});
const est = {};
const restMb = (() => { const m = /公開の荷：[0-9]+本・([0-9]+)MB/.exec(pack); return m ? +m[1] : null; })();
V.forEach(v => { const r = ratio[v.id].b / ratio[v.id].o; const vb = Math.round(voiceBytes * r / 1048576); est[v.id] = { ratio: +r.toFixed(3), voicesMb: vb, totalMb: restMb === null ? null : Math.round(restMb - voiceBytes / 1048576 + vb) }; });
const data = { at: new Date().toISOString(), tot: { advy: tot.advy, advx: tot.advx, voicesMb: Math.round(voiceBytes / 1048576 * 10) / 10 }, pack, current: { codec: uniq('codec'), profile: uniq('profile'), rate: uniq('rate'), ch: uniq('ch'), avgKbps, avgSec, sampleN: info.length }, voices, est, restMb };
fs.writeFileSync(path.join(OUT, 'data.json'), JSON.stringify(data, null, 1));
console.log(JSON.stringify(data, null, 1));
