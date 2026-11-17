// 雲で：voice-yomi-terms.txt の麻雀の言葉を VOICEVOX（ずんだもん）にかけ、読み（モーラ）を一覧にする（y1117-1050）。声は作らない。
//   ＊そのままの字の読み（raw）と、声に渡す字（voice-advice-persona.js の say を通した字）の読み（said）を並べる。
//   ＊reports/voice-yomi-check.md と voice-yomi-check.json へ書く。エンジンの立て方は voice-advice-dial.js と同じ。
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const BASE = 'http://127.0.0.1:50021';
const SPEAKER = Number(process.env.VV_SPEAKER || 3);
const P = require(path.join(ROOT, 'voice-advice-persona.js'));
function sh(c) { return execSync(c, { stdio: 'inherit' }); }
async function waitUp() {
  for (let i = 0; i < 90; i++) {
    try { const r = await fetch(BASE + '/version'); if (r.ok) return (await r.text()); } catch (e) { /* まだ */ }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('エンジンが立たない');
}
async function kana(text) {
  const q = await (await fetch(BASE + '/audio_query?speaker=' + SPEAKER + '&text=' + encodeURIComponent(text), { method: 'POST' })).json();
  return q.accent_phrases.map(ap => ap.moras.map(m => m.text).join('') + (ap.accent ? '(' + ap.accent + ')' : '')).join('/');
}
(async () => {
  const terms = [...new Set(fs.readFileSync(path.join(ROOT, 'voice-yomi-terms.txt'), 'utf8').split(/\r?\n/).filter(l => l && l[0] !== '#'))];
  console.log('言葉 ' + terms.length + ' 語');
  sh('docker pull voicevox/voicevox_engine:cpu-latest');
  sh('docker rm -f vv 2>/dev/null || true');
  sh('docker run -d --name vv -p 127.0.0.1:50021:50021 voicevox/voicevox_engine:cpu-latest');
  console.log('エンジンの版: ' + await waitUp());
  const out = [];
  for (const t of terms) {
    const said = P.say(t);
    const raw = await kana(t);
    const sd = said === t ? raw : await kana(said);
    out.push({ term: t, say: said, raw: raw, said: sd });
  }
  fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'reports', 'voice-yomi-check.json'), JSON.stringify(out, null, 1));
  let md = '# 麻雀の言葉の読みの点検（VOICEVOX・ずんだもん）\n\n括弧の数字はアクセント核の位置。「声に渡す字」は voice-advice-persona.js の say を通した字（変えていなければ同じ）。\n\n| 言葉 | 今の読み | 声に渡す字 | その読み |\n|---|---|---|---|\n';
  out.forEach(o => { md += '| ' + o.term + ' | ' + o.raw + ' | ' + (o.say === o.term ? '（同じ）' : o.say) + ' | ' + (o.say === o.term ? '（同じ）' : o.said) + ' |\n'; });
  fs.writeFileSync(path.join(ROOT, 'reports', 'voice-yomi-check.md'), md);
  console.log('書いた：' + out.length + ' 語');
  sh('docker rm -f vv || true');
})().catch(e => { console.log('失敗: ' + e.message); try { execSync('docker logs vv | tail -20', { stdio: 'inherit' }); } catch (x) { /* */ } process.exit(1); });
