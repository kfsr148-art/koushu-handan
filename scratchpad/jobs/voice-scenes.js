// 雲で：voice-scenes.txt の台本から、攻めの三場面の声（VOICEVOX:ずんだもん）を作る（2026-11-14・y1114-1945）
//   ＊VAIO（4GB）には VOICEVOX を入れない。エンジン（Docker・CPU版）は雲の ubuntu に立てて、wav を reports/voice-scenes-out/ へ書き戻す。
//     こちらは書き戻された wav を取り込んで、リポジトリ直下（本体の声の置き場）へ置く。
//   ＊声は ずんだもん ノーマル（style id 3）。24kHz・mono・16bit（今の attack／defend と同じ形）。
//     今の attack の声（直下の attack.wav.wav）の「声の長さ」と作った「攻めなのだ。」を並べ、同じ声かを目安で見る。
//   ＊読みは本文の漢字をそのまま渡すと誤読しうる語（立直・役牌・字牌・対子）だけ、カタカナへ直して渡す。
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'reports', 'voice-scenes-out');
const BASE = 'http://127.0.0.1:50021';
const SPEAKER = Number(process.env.VV_SPEAKER || 3);
const READ = [['立直', 'リーチ'], ['役牌', 'ヤクハイ'], ['字牌', 'ジハイ'], ['対子', 'トイツ']];
const yomi = t => READ.reduce((s, [a, b]) => s.split(a).join(b), t);

function sh(c, o) { return execSync(c, Object.assign({ stdio: 'inherit' }, o || {})); }
async function waitUp() {
  for (let i = 0; i < 90; i++) {
    try { const r = await fetch(BASE + '/version'); if (r.ok) return (await r.text()); } catch (e) { /* まだ */ }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('エンジンが立たない');
}
async function synth(text, speaker, tune) {
  const q = await (await fetch(BASE + '/audio_query?speaker=' + speaker + '&text=' + encodeURIComponent(text), { method: 'POST' })).json();
  q.outputSamplingRate = 24000; q.outputStereo = false;
  if (tune) { q.prePhonemeLength = 0.12; q.postPhonemeLength = 0.12; }
  const r = await fetch(BASE + '/synthesis?speaker=' + speaker, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(q) });
  if (!r.ok) throw new Error('synthesis ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}
function voiced(buf) {   // 声の始まりと終わり（秒）。振幅 800 超えを声とみなす
  const d = buf.subarray(44), N = Math.floor(d.length / 2); let a = -1, b = -1;
  for (let i = 0; i < N; i++) if (Math.abs(d.readInt16LE(i * 2)) > 800) { if (a < 0) a = i; b = i; }
  return { total: N / 24000, start: a / 24000, end: b / 24000 };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('VOICEVOX エンジン（Docker・CPU）を立てる…');
  sh('docker pull voicevox/voicevox_engine:cpu-latest');
  sh('docker rm -f vv 2>/dev/null || true');
  sh('docker run -d --name vv -p 127.0.0.1:50021:50021 voicevox/voicevox_engine:cpu-latest');
  console.log('エンジンの版: ' + await waitUp());
  const sp = await (await fetch(BASE + '/speakers')).json();
  const z = sp.find(s => s.name === 'ずんだもん');
  console.log('ずんだもんの声の種類: ' + (z ? z.styles.map(s => s.name + '=' + s.id).join(' ') : '見つからない'));

  /* 今の attack の声と、作った「攻めなのだ。」を並べる（声の種類の見当） */
  try {
    const cur = voiced(fs.readFileSync(path.join(ROOT, 'attack.wav.wav')));
    console.log('今の attack.wav.wav  声の始まり ' + cur.start.toFixed(2) + ' 終わり ' + cur.end.toFixed(2) + '（声 ' + (cur.end - cur.start).toFixed(2) + '秒）');
    for (const id of (z ? z.styles.map(s => s.id) : [SPEAKER])) {
      const v = voiced(await synth('攻めなのだ。', id, false));
      console.log('  style ' + id + ' の「攻めなのだ。」 声 ' + (v.end - v.start).toFixed(2) + '秒');
    }
  } catch (e) { console.log('比べるので例外: ' + e.message); }

  const lines = fs.readFileSync(path.join(ROOT, 'voice-scenes.txt'), 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#');
  let ok = 0;
  for (const l of lines) {
    const [name, text] = l.split('\t');
    if (!name || !text) continue;
    const buf = await synth(yomi(text), SPEAKER, true);
    fs.writeFileSync(path.join(OUT, name), buf);
    const v = voiced(buf);
    console.log(name.padEnd(30) + ' 全長 ' + v.total.toFixed(2) + ' 声 ' + v.start.toFixed(2) + '〜' + v.end.toFixed(2) + ' 末尾の無音 ' + (v.total - v.end).toFixed(2) + '  「' + yomi(text).slice(0, 24) + '…」');
    ok++;
  }
  console.log('\n作った声 ' + ok + '本 → reports/voice-scenes-out/（speaker ' + SPEAKER + '）');
  sh('docker rm -f vv || true');
})().catch(e => { console.log('失敗: ' + e.message); try { execSync('docker logs vv | tail -20', { stdio: 'inherit' }); } catch (x) { /* */ } process.exit(1); });
