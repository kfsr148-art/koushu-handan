// v1508：入れる前に本人へ見せる一覧を作る（reports/v1508-butler-review.md）。
'use strict';
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
global.ADV_TEXT = require(R + '/voice-advice-catalog.js').T;
const C = require(R + '/advice-tone-core.js');
const STD = require('./butler-omo-std.js'), YJ = require('./butler-yoji-new.js');
const NAME = { miyazaki: '宮崎', hakata: '博多', kyoto: '京都', aomori: '青森', okinawa: '沖縄' };
const SC = { dora: 'ドラを切る', far: '上がりが遠い', honor: '字牌', guard: '守り', special: '特別な手', nick: '牌のあだ名' };
let md = '# 執事九行の実装：入れる前に見せる新しい字（v1508・2026-11-19）\n\n';
md += '読み方：「今」＝今の本体の字／「新」＝標準の丁寧語へ書き直した字（センコ作）／「出る字」＝新に、元のある形（宮崎 ございます→ござんす・てください→てくいやんせ／博多 てください→てんしゃい／京都 おVなさいませ→おVおくれやす・名詞＋です→どす／沖縄 です・でございます→やいびーん・お願いいたします→うにげーさびら／青森 足さない）を機械で掛けた、実際に出る字。\n\n';
let n = 0, ch = 0;
Object.keys(STD).forEach(d => {
  md += '## ' + NAME[d] + '（執事の面白み 30本）\n\n';
  const cur = C.ADV_OMO[d + ':butler'];
  Object.keys(STD[d]).forEach(k => {
    md += '### ' + SC[k] + '\n\n';
    STD[d][k].forEach((x, i) => {
      const fx = C.ADV_BUTLER_DIAL[d].fx; const out = fx ? fx(x) : x; n++; if (out !== x) { ch++; }
      md += '- 今：' + cur[k][i] + '\n  - 新：' + x + (out !== x ? '\n  - 出る字：' + out : '') + '\n';
    });
    md += '\n';
  });
});
md += '## 幼児（ミント型）の面白み 30本（新しい字・漢字まじりの元の字。出る時は読みでひらがなにし、す→しゅ・さ→しゃ・し→ち・せ→しぇ・ござ→ごじゃ を掛け、ばぶで挟む）\n\n';
Object.keys(YJ.omo).forEach(k => { md += '### ' + SC[k] + '\n\n'; YJ.omo[k].forEach(x => { md += '- ' + x + '\n  - 音だけ掛けた見本：' + C.advMint(x) + '\n'; }); md += '\n'; });
md += '## 幼児の「妙に小難しく長い一言」（候補5本・助言のどこか一つに足す）\n\n';
YJ.long.forEach(x => { md += '- ' + x + '\n'; });
md += '\n## 幼児の頭の一言\n\n標準の執事の頭の一言をそのまま使い、読みでひらがなにして音の規則を掛ける（新しい字は作らない）。\n';
md += '\n## 幼児の読みで気になる所（雲の VOICEVOX の読み）\n\n- 「浮き牌」「ドラ浮き」を VOICEVOX が「うわき」と読む（今の声も同じ読みの恐れ）。幼児の字は「うき」に直して作るか、本人の決め。\n- 一本だけ、読みを合わせられなかった（「もう一枚で槓」の文）。漢字のまま音の規則だけ掛かる。\n';
fs.writeFileSync(path.join(R, 'reports', 'v1508-butler-review.md'), md);
console.log('面白み ' + n + '本・元のある形が掛かった ' + ch + '本');
