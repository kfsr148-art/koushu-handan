// scope-pick.js — 雲の検査（check.yml の scope）が「どの検査を回すか」を決める所（2026-11-20 本人の枠「雲の検査を速くする」）。
//   入力：標準入力に「変わったもの」（ファイル名を一行ずつ。検査を通った印からの差も合わせた物）。ALL なら全部。
//   出力（GITHUB_OUTPUT へそのまま足せる形）：
//     heavy=1/0 … 検査が要る回か（本体・パネル・ウィジェットの物が一つでも入れば 1。控えだけなら 0＝検査に掛けずそのまま配信）
//     body=1/0  … 本体の検査（速い版・フル版＝約10分）を回すか。
//   決め：差に**本体（koushu-handan.html・ver.txt）か本体の検査台本（check.js・adv-check.js・check-all.js）か検査の仕組み（.github/workflows/check.yml）が一つでも入れば body=1＝今までどおり全部**。
//         差が**パネルとウィジェットの物だけ**なら body=0＝本体の検査を飛ばし、パネルとウィジェットの検査（panel-check・widget-check）だけで印を進めて配信する。
//   ＊本体の検査（check.js・check-all.js・adv-check.js）がパネルを見ている所は無い（grep で確認済み）ので、パネルの側へ移す物は無い。
//   ＊安全側：読めない・ALL は body=1。
'use strict';
const BODY = /^(koushu-handan\.html|check\.js|adv-check\.js|check-all\.js|ver\.txt|\.github\/workflows\/check\.yml)$/;
const PANEL = /^(panel\.html|panel-ver\.txt|panel-check\.js|widget-check\.js|usage-widget(-loader)?\.js|state-decide\.js|state-decide-test\.js|orders-count\.js|orders-count-test\.js|help-count\.js|cdp-run\.js|scope-pick\.js|scope-pick-test\.js)$/;
function pick(text) {
  const files = String(text || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  if (files.indexOf('ALL') >= 0) { return { heavy: 1, body: 1 }; }
  if (files.some(f => BODY.test(f))) { return { heavy: 1, body: 1 }; }
  if (files.some(f => PANEL.test(f))) { return { heavy: 1, body: 0 }; }
  return { heavy: 0, body: 0 };
}
// 2026-11-20 本人の枠：回の「種類」もここで決める（見張り kumo-wait.ps1 は、待っている走りの仕事の名「種類:…」からこれを読む）。
//   honta＝body=1（本体の検査が入る＝一番長い）／panel＝heavy=1・body=0（パネル・ウィジェットの検査だけ）／report＝heavy=0（控えだけ）。
function kindOf(r) { return r.body ? 'honta' : (r.heavy ? 'panel' : 'report'); }
module.exports = { pick, kindOf, BODY, PANEL };
if (require.main === module) {
  let buf = ''; process.stdin.on('data', d => { buf += d; }).on('end', () => { const r = pick(buf); process.stdout.write('heavy=' + r.heavy + '\nbody=' + r.body + '\nkind=' + kindOf(r) + '\n'); });
}
