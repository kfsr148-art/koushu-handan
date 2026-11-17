// 雲で：助言の声の詰め方の比べ（2026-11-18・y1118-0400 の枠①）
//   ＊今の声（IMA ADPCM・24kHz）を何本か選び、24kHz のまま AAC（m4a）24k／32k／48k と Opus（参考）で作り直し、大きさと音の差を測る。
//   ＊iPhone の Safari で聞き比べ・つなぎの確かめができるページ reports/codec-test/index.html も書く。
//   ＊素は今の声（ADPCM を復号した物）。VOICEVOX の素の声は残っていないので、「今の声からの作り直し」の比べになる（世代が一つ増える分、実際に素から作る時より少し不利）。
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const ADPCM = require(path.join(ROOT, 'adpcm.js'));
const OUT = path.join(ROOT, 'reports', 'codec-test');
fs.mkdirSync(OUT, { recursive: true });
function sh(c) { return cp.execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] }).toString(); }
try { sh('ffmpeg -version'); } catch (e) { console.log('ffmpeg を入れる…'); cp.execSync('sudo apt-get update -qq && sudo apt-get install -y -qq ffmpeg', { stdio: 'inherit' }); }
console.log(sh('ffmpeg -version').split('\n')[0]);
console.log('エンコーダ：' + sh('ffmpeg -hide_banner -encoders 2>/dev/null | grep -E "aac|opus|libfdk|mp3" || true').trim().replace(/\n/g, ' / '));

// 1) 声を選ぶ：台本（直下の voice-advice-dial.json）の字数が違う物を、直下に在る声から
const dial = JSON.parse(fs.readFileSync(path.join(ROOT, 'voice-advice-dial.json'), 'utf8'));
const have = Object.keys(dial).filter(n => fs.existsSync(path.join(ROOT, n + '.wav.wav')));
const targets = [6, 14, 24, 40, 60, 90];
const pick = [];
targets.forEach(t => { let best = null; have.forEach(n => { const d = Math.abs(dial[n].length - t); if (!pick.includes(n) && (best === null || d < best.d)) { best = { n, d }; } }); if (best) { pick.push(best.n); } });
console.log('選んだ声：' + pick.map(n => n + '（' + dial[n].length + '字）').join('、'));

// 2) 復号して基準の PCM 24kHz を作り、各形式へ
const FORMATS = [
  { id: 'aac24', ext: 'm4a', args: '-c:a aac -b:a 24k -ar 24000 -ac 1 -movflags +faststart' },
  { id: 'aac32', ext: 'm4a', args: '-c:a aac -b:a 32k -ar 24000 -ac 1 -movflags +faststart' },
  { id: 'aac48', ext: 'm4a', args: '-c:a aac -b:a 48k -ar 24000 -ac 1 -movflags +faststart' },
  { id: 'opus24', ext: 'ogg', args: '-c:a libopus -b:a 24k -ar 24000 -ac 1' }
];
const rows = []; let totCur = 0; const totF = {}; FORMATS.forEach(f => { totF[f.id] = 0; });
function readPcm(file) { const b = fs.readFileSync(file); const o = b.indexOf('data') + 8; const n = (b.length - o) >> 1; const s = new Int16Array(n); for (let i = 0; i < n; i++) { s[i] = b.readInt16LE(o + i * 2); } return s; }
function wavFromPcm(s, rate) { const b = Buffer.alloc(44 + s.length * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + s.length * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(s.length * 2, 40); for (let i = 0; i < s.length; i++) { b.writeInt16LE(s[i], 44 + i * 2); } return b; }
pick.forEach(n => {
  const src = path.join(ROOT, n + '.wav.wav'), curBytes = fs.statSync(src).size;
  const d = ADPCM.decode(fs.readFileSync(src));
  const refPath = path.join(OUT, n + '.ref.wav');
  fs.writeFileSync(refPath, wavFromPcm(d.s, d.rate));
  fs.copyFileSync(src, path.join(OUT, n + '.cur.wav'));   // 今の形（ADPCM）
  const row = { n, text: dial[n], sec: +(d.s.length / d.rate).toFixed(2), cur: curBytes, f: {} };
  totCur += curBytes;
  FORMATS.forEach(f => {
    const o = path.join(OUT, n + '.' + f.id + '.' + f.ext);
    try { sh('ffmpeg -y -loglevel error -i "' + refPath + '" ' + f.args + ' "' + o + '"'); } catch (e) { row.f[f.id] = { err: String(e.stderr || e).slice(0, 120) }; return; }
    const bytes = fs.statSync(o).size; totF[f.id] += bytes;
    // 戻して比べる（長さのずれ・差の大きさ）
    const back = path.join(OUT, '_back.wav');
    sh('ffmpeg -y -loglevel error -i "' + o + '" -ar 24000 -ac 1 -c:a pcm_s16le "' + back + '"');
    const r = readPcm(back); const L = Math.min(r.length, d.s.length);
    let sig = 0, err = 0; for (let i = 0; i < L; i++) { sig += d.s[i] * d.s[i]; const e = d.s[i] - r[i]; err += e * e; }
    // 位相のずれ（AAC の先頭の詰め物）を見て、最大 2048 サンプルまでずらして一番差の小さい所の SNR も出す
    let bestSnr = -99, bestLag = 0; for (let lag = 0; lag <= 2048; lag += 1) { let e2 = 0, s2 = 0; const M = Math.min(r.length - lag, d.s.length, 24000 * 3); for (let i = 0; i < M; i++) { const a = d.s[i], b = r[i + lag]; s2 += a * a; e2 += (a - b) * (a - b); } const snr = 10 * Math.log10((s2 + 1) / (e2 + 1)); if (snr > bestSnr) { bestSnr = snr; bestLag = lag; } }
    row.f[f.id] = { bytes, ratio: +(bytes / curBytes).toFixed(2), dSamples: r.length - d.s.length, lag: bestLag, snr: +bestSnr.toFixed(1) };
  });
  rows.push(row);
});
try { fs.unlinkSync(path.join(OUT, '_back.wav')); } catch (e) { }

// 3) 表
let md = '# 声の詰め方の比べ（y1118-0400 の枠①）\n\n素：今の声（IMA ADPCM・24kHz）。AAC は 24kHz・mono のまま。\n\n| 声 | 字 | 秒 | 今(ADPCM) |' + FORMATS.map(f => ' ' + f.id + ' |').join('') + '\n|---|---|---|---|' + FORMATS.map(() => '---|').join('') + '\n';
rows.forEach(r => { md += '| ' + r.n + ' | ' + r.text.length + ' | ' + r.sec + ' | ' + r.cur + ' |' + FORMATS.map(f => { const x = r.f[f.id]; return x ? (x.err ? ' ' + x.err + ' |' : ' ' + x.bytes + '（' + x.ratio + '倍・snr' + x.snr + 'dB・ずれ' + x.lag + '）|') : ' - |'; }).join('') + '\n'; });
md += '\n合計：今 ' + totCur + ' B／' + FORMATS.map(f => f.id + ' ' + totF[f.id] + ' B（' + (totF[f.id] / totCur).toFixed(2) + '倍）').join('／') + '\n';
console.log(md);
fs.writeFileSync(path.join(OUT, 'result.md'), md);
fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify({ rows, totCur, totF }, null, 1));

// 4) iPhone で聞くページ
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
let html = '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>声の詰め方 聞き比べ</title><style>body{font:16px/1.6 system-ui,sans-serif;margin:0;padding:12px 16px;background:#10211b;color:#f1ead9}h1{font-size:18px}.card{border:1px solid #3a5a4c;border-radius:10px;padding:10px 12px;margin:10px 0}.t{font-size:14px;color:#cfc7b0;margin:0 0 6px}button{min-height:44px;min-width:44px;margin:4px 6px 4px 0;padding:6px 12px;border-radius:8px;border:1px solid #6b8f7e;background:#1d3a2f;color:#f1ead9;font-size:15px}pre{white-space:pre-wrap;font-size:13px;background:#0b1712;padding:8px;border-radius:8px}</style></head><body><h1>声の詰め方 聞き比べ（panel 用・本人だけ）</h1><p>今の形（ADPCM）と AAC を、同じ声で押して聞き比べる。最後の「つなぎ」は、AAC の声を decodeAudioData で繋いで一本にして鳴らす（本体の再生と同じやり方）。</p>';
rows.forEach(r => {
  html += '<div class="card"><p class="t">' + esc(r.text) + '（' + r.sec + '秒）</p><button data-u="' + r.n + '.cur.wav">今 ADPCM ' + r.cur + 'B</button>';
  FORMATS.forEach(f => { const x = r.f[f.id]; if (x && !x.err) { html += '<button data-u="' + r.n + '.' + f.id + '.' + f.ext + '">' + f.id + ' ' + x.bytes + 'B</button>'; } });
  html += '</div>';
});
const stitch = rows.slice(0, 3).map(r => r.n);
html += '<div class="card"><p class="t">つなぎの確かめ（三本を 0.07 秒の間で繋ぐ）</p>' + ['cur', 'aac24', 'aac32', 'aac48'].map(k => '<button class="st" data-k="' + k + '">' + k + ' で繋ぐ</button>').join('') + '<pre id="log">結果はここに出る</pre></div>';
html += '<script>\nvar names=' + JSON.stringify(stitch) + ';var ext={cur:"cur.wav",aac24:"aac24.m4a",aac32:"aac32.m4a",aac48:"aac48.m4a"};\nvar cur=null;function say(t){document.getElementById("log").textContent=t;}\n' +
  'document.querySelectorAll("button[data-u]").forEach(function(b){b.onclick=function(){try{if(cur){cur.pause();}cur=new Audio(b.getAttribute("data-u"));cur.play().catch(function(e){say("再生できない: "+e);});}catch(e){say("例外: "+e);}};});\n' +
  'document.querySelectorAll("button.st").forEach(function(b){b.onclick=function(){var k=b.getAttribute("data-k");var AC=window.AudioContext||window.webkitAudioContext;var ac=new AC();ac.resume&&ac.resume();var t0=performance.now();Promise.all(names.map(function(n){return fetch(n+"."+ext[k]).then(function(r){return r.arrayBuffer();}).then(function(a){return new Promise(function(ok,ng){ac.decodeAudioData(a,ok,ng);});});})).then(function(bufs){var gap=0.07,at=ac.currentTime+0.1,info=[];bufs.forEach(function(buf){var s=ac.createBufferSource();s.buffer=buf;s.connect(ac.destination);s.start(at);info.push(buf.duration.toFixed(3)+"s@"+buf.sampleRate);at+=buf.duration+gap;});say(k+" 復号 "+Math.round(performance.now()-t0)+"ms／"+info.join("、"));}).catch(function(e){say(k+" 失敗: "+e);});};});\n</script></body></html>';
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('ページ：reports/codec-test/index.html');
