// 雲で：国立国語研究所『沖縄語辞典』の電子化データ（https://mmsrv.ninjal.ac.jp/okinawago/ ・CC BY 4.0）の
//   標準語引き索引（okinawa_02.xlsx）と本文（okinawa_01.xlsx）から、執事×沖縄の面白み30本に要る言葉を探し、
//   reports/v1508-okinawa-words.md に書く（v1508・2026-11-19・沖縄は乙＝沖縄語の全文で作る）。
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const WORDS = ['寂しい', '名残', '惜しい', '茶', '別れる', '胸', '温める', '堪える', '従う', '察する', '足元', '石段', '支える', '遠い', '辛抱', '道', '長い', '急かす', '注ぐ', '一緒', '楽しい', '焦る', '島', '風', '吹く', '揃う', '申す', '存じる', '王府', '伝わる', '昔', '多い', '帳簿', '並ぶ', '客', '増える', '本当', '分かる', 'お守り', '確か', '守る', '損', '役目', '務める', '陰', '仕事', '構う', '目立つ', '門番', '安心', '地味', '慣れる', '任せる', '平気', '傘', '数える', '蔵', '得意', '思う', '内緒', '芝居', '聞き違える', 'こっそり', '磨く', '楽しみ', '端', '隅', '座る', '控える', '供', '持つ', '切る', '離れる', 'ゆっくり', '急ぐ', 'いつも', '古い', '心', '気持ち', '背中', '門', '音', '上がる', '石', '碁', '印', '判', '末席', '台所', '下役', '勘定', '珍しい', '首里', '琉球', '側用人', '寂しさ', '遠ざかる', '慌てる', 'どうぞ', 'ございます', 'いたします'];
(async () => {
  execSync('pip install -q openpyxl', { stdio: 'inherit' });
  for (const f of ['okinawa_01.xlsx', 'okinawa_02.xlsx']) { execSync('curl -sSL -o /tmp/' + f + ' https://mmsrv.ninjal.ac.jp/okinawago/' + f, { stdio: 'inherit' }); }
  const py = [
    'import openpyxl, json, sys',
    'out = {}',
    'for f in ["okinawa_01.xlsx", "okinawa_02.xlsx"]:',
    '    wb = openpyxl.load_workbook("/tmp/" + f, read_only=True)',
    '    rows = []',
    '    for ws in wb.worksheets:',
    '        for r in ws.iter_rows(values_only=True):',
    '            rows.append(["" if c is None else str(c) for c in r])',
    '    out[f] = rows',
    'json.dump(out, open("/tmp/okw.json", "w", encoding="utf-8"), ensure_ascii=False)',
    'print({k: len(v) for k, v in out.items()})'
  ].join('\n');
  fs.writeFileSync('/tmp/okw.py', py);
  execSync('python3 /tmp/okw.py', { stdio: 'inherit' });
  const all = JSON.parse(fs.readFileSync('/tmp/okw.json', 'utf8'));
  let md = '# 『沖縄語辞典』電子化データ（国立国語研究所・CC BY 4.0・https://mmsrv.ninjal.ac.jp/okinawago/ ）から、執事×沖縄の面白みに要る言葉を探した結果\n\n';
  md += '見出し行：okinawa_01＝' + JSON.stringify(all['okinawa_01.xlsx'][0]) + '／okinawa_02＝' + JSON.stringify(all['okinawa_02.xlsx'][0]) + '\n\n';
  WORDS.forEach(w => {
    const hits = [];
    all['okinawa_02.xlsx'].forEach(r => { if (hits.length < 8 && r.slice(0, 2).some(c => c === w || c.startsWith(w))) { hits.push('索引：' + r.join(' ｜ ').slice(0, 260)); } });
    if (hits.length < 3) { all['okinawa_01.xlsx'].forEach(r => { if (hits.length < 6 && r.join(' ').includes(w)) { hits.push('本文：' + r.join(' ｜ ').slice(0, 260)); } }); }
    md += '## ' + w + '（' + hits.length + '件）\n' + (hits.length ? hits.map(h => '- ' + h).join('\n') : '- 見つからない') + '\n\n';
  });
  // 丁寧（ビーン体）の用例も拾う
  const bin = all['okinawa_01.xlsx'].filter(r => /biiN|びーん|ビーン|jabiiN|sabira|サビラ/.test(r.join(' '))).slice(0, 40);
  md += '## 丁寧の形（biiN・sabira 等を含む本文の行・40件まで）\n' + bin.map(r => '- ' + r.join(' ｜ ').slice(0, 260)).join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'reports', 'v1508-okinawa-words.md'), md);
  console.log('書いた');
})().catch(e => { console.log('失敗: ' + e.message); process.exit(1); });
