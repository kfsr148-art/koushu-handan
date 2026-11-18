// 雲で：国立国語研究所『沖縄語辞典』（首里方言・core.ac.uk の全文 PDF）を文字にし、執事×沖縄の面白み30本に要る標準語の言葉を
//   標準語引きで探して、見つかった行の前後を reports/v1508-okinawa-words.md に書く（v1508・2026-11-19・沖縄は乙＝沖縄語の全文で作る）。
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const WORDS = ['寂しい', '名残惜しい', '惜しい', 'お茶', '茶', '別れ', '胸', '温める', '堪える', '従う', '察する', '足元', '石段', '支える', '遠い', '辛抱', '道', '長い', '急かす', '淹れる', '一緒', '楽しい', '焦る', '島', '風', '吹く', '揃う', '申す', '存じる', '王府', '伝わる', '昔', '多い', '帳簿', '並ぶ', '客', '増える', '本当', '分かる', 'お守り', '確か', '守る', '損', '役目', '務める', '勤め', '陰', '仕事', '構う', '目立つ', '門番', '安心', '地味', '慣れる', '任せる', '平気', '傘', '数える', '蔵', '得意', '思う', '内緒', '芝居', '聞き違える', 'こっそり', '磨く', '楽しみ', '端', '隅', '座る', '控える', '供', 'お供', '持つ', '切る', '離れる', 'ゆっくり', '急ぐ', 'いつも', '古い', '心', '気持ち', '背中', '門', '下役', '不慣れ', '音'];
(async () => {
  const pdf = '/tmp/okinawago.pdf';
  execSync('curl -sSL -o ' + pdf + ' https://core.ac.uk/download/234727834.pdf', { stdio: 'inherit' });
  execSync('sudo apt-get -qq install -y poppler-utils >/dev/null 2>&1 || true', { stdio: 'inherit' });
  execSync('pdftotext -layout ' + pdf + ' /tmp/okinawago.txt', { stdio: 'inherit' });
  const txt = fs.readFileSync('/tmp/okinawago.txt', 'utf8');
  const lines = txt.split('\n');
  console.log('文字にした行数：' + lines.length + '・字数：' + txt.length);
  let md = '# 『沖縄語辞典』（国立国語研究所 資料集5・首里方言）から、執事×沖縄の面白みに要る言葉を探した結果\n\n元：https://core.ac.uk/download/234727834.pdf （pdftotext で文字にした物。字化けがあり得る）\n\n';
  WORDS.forEach(w => {
    const hits = [];
    lines.forEach((l, i) => { if (l.includes(w) && hits.length < 6) { hits.push((i + 1) + ': ' + lines.slice(Math.max(0, i - 1), i + 2).map(x => x.trim()).join(' ／ ').slice(0, 300)); } });
    md += '## ' + w + '（' + hits.length + '件まで）\n' + (hits.length ? hits.map(h => '- ' + h).join('\n') : '- 見つからない') + '\n\n';
  });
  fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'reports', 'v1508-okinawa-words.md'), md);
  fs.writeFileSync(path.join(ROOT, 'reports', 'v1508-okinawago-head.txt'), lines.slice(0, 400).join('\n'));
  console.log('書いた');
})().catch(e => { console.log('失敗: ' + e.message); process.exit(1); });
