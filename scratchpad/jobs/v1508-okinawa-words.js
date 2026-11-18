// 雲で：国立国語研究所『沖縄語辞典』の電子化データ（https://mmsrv.ninjal.ac.jp/okinawago/ ・CC BY 4.0）の
//   標準語引き索引（okinawa_02.xlsx）と本文（okinawa_01.xlsx）から、執事×沖縄の面白み30本に要る言葉を探し、
//   reports/v1508-okinawa-words.md に書く（v1508・2026-11-19・沖縄は乙＝沖縄語の全文で作る）。
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const WORDS = ["さびしい","なごりおしい","おしい","ちゃ","わかれる","むね","あたためる","こらえる","したがう","さっする","あしもと","いしだん","ささえる","とおい","しんぼう","みち","ながい","せかす","いれる","いっしょ","たのしい","あせる","しま","かぜ","ふく","そろう","もうす","ぞんじる","むかし","おおい","ならぶ","きゃく","ふえる","ほんとう","わかる","まもる","そん","やくめ","つとめる","かげ","しごと","かまう","めだつ","もんばん","あんしん","じみ","なれる","まかせる","へいき","かさ","かぞえる","くら","とくい","おもう","ないしょ","しばい","みがく","たのしみ","はし","すみ","すわる","ひかえる","とも","もつ","きる","はなれる","いつも","ふるい","こころ","きもち","せなか","もん","おと","あがる","いし","はんこ","だいどころ","めずらしい","あわてる","です","する","いる","ある","くる","いく","みる","いう","きく","まつ","ねがう","ひそか","ゆっくり","どうぞ","ござる","いたす","まいる","おる","ふだん","とおざかる","てがら","たから","かね","ちょうめん","かんじょう"];
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
    all['okinawa_02.xlsx'].forEach(r => { if (hits.length < 8 && (r[1] === w)) { hits.push('索引：' + r.join(' ｜ ').slice(0, 260)); } });
    if (hits.length < 3) { all['okinawa_01.xlsx'].forEach(r => { if (hits.length < 6 && r.join(' ').includes(w)) { hits.push('本文：' + r.join(' ｜ ').slice(0, 260)); } }); }
    md += '## ' + w + '（' + hits.length + '件）\n' + (hits.length ? hits.map(h => '- ' + h).join('\n') : '- 見つからない') + '\n\n';
  });
  // 丁寧（ビーン体）の用例も拾う
  const bin = all['okinawa_01.xlsx'].filter(r => /biiN|びーん|ビーン|jabiiN|sabira|サビラ/.test(r.join(' '))).slice(0, 40);
  md += '## 丁寧の形（biiN・sabira 等を含む本文の行・40件まで）\n' + bin.map(r => '- ' + r.join(' ｜ ').slice(0, 260)).join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'reports', 'v1508-okinawa-words.md'), md);
  console.log('書いた');
})().catch(e => { console.log('失敗: ' + e.message); process.exit(1); });
