// 雲で：執事×幼児の字（reports/v1508-yoji-texts.json）を VOICEVOX にかけ、読み（モーラのカタカナ）を取る（v1508・y1118）。声は作らない。
//   ＊声に渡す字（voice-advice-persona.js の say を通した字）で読む。読み点の「、」はモーラの切れ目に「、」で残す。
//   ＊reports/v1508-yoji-yomi.json へ書く：[{ t: 元の字, said: 声に渡す字, kana: 読み }]。エンジンの立て方は voice-yomi-check.js と同じ。
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const BASE = 'http://127.0.0.1:50021';
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
  const q = await (await fetch(BASE + '/audio_query?speaker=3&text=' + encodeURIComponent(text), { method: 'POST' })).json();
  return q.accent_phrases.map(ap => ap.moras.map(m => m.text).join('') + (ap.pause_mora ? '、' : '')).join('');
}
(async () => {
  const texts = JSON.parse(fs.readFileSync(path.join(ROOT, 'reports', 'v1508-yoji-texts.json'), 'utf8'));
  console.log('字 ' + texts.length + ' 本');
  sh('docker pull voicevox/voicevox_engine:cpu-latest');
  sh('docker rm -f vv 2>/dev/null || true');
  sh('docker run -d --name vv -p 127.0.0.1:50021:50021 voicevox/voicevox_engine:cpu-latest');
  console.log('エンジンの版: ' + await waitUp()); try { const ud = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'voice-user-dict.json'), 'utf8')); for (const w of ud) { const r = await fetch(BASE + '/user_dict_word?surface=' + encodeURIComponent(w.surface) + '&pronunciation=' + encodeURIComponent(w.pronunciation) + '&accent_type=' + (w.accent_type || 0), { method: 'POST' }); console.log('ユーザー辞書：' + w.surface + '→' + w.pronunciation + '（' + r.status + '）'); } } catch (e) { console.log('ユーザー辞書を入れられなかった：' + e.message); }   // 2026-11-19：読み違いの言葉をユーザー辞書で直す（voice-user-dict.json）
  const out = [];
  for (const t of texts) { const said = P.say(t); out.push({ t: t, said: said, kana: await kana(said) }); }
  fs.writeFileSync(path.join(ROOT, 'reports', 'v1508-yoji-yomi.json'), JSON.stringify(out, null, 1));
  console.log('書いた：' + out.length + ' 本');
  out.slice(0, 5).forEach(o => console.log(o.t + ' → ' + o.kana));
  sh('docker rm -f vv || true');
})().catch(e => { console.log('失敗: ' + e.message); try { execSync('docker logs vv | tail -20', { stdio: 'inherit' }); } catch (x) { /* */ } process.exit(1); });
