#!/usr/bin/env node
/* voice-advice-catalog.js — 全判定の助言の声の部品の一覧（2026-11-14・y1114-2218 のヨシ）
   ＊ここが部品の台帳。voice-advice.txt（録音台本）と、本体へ入れる表の字（ADV_TEXT）を、この一つから作る。
   ＊部品は「id → 画面に出す字」。録音では漢字の誤読を避けるため、読みを別に持つ物だけ SAY で上書きする。
   ＊牌の名（advt-*）と数字（advn-*）は別枠：牌は読みを持ち、数字は今ある 0〜13 の声を切り詰めて使う（録らない）。
   使い方  node voice-advice-catalog.js         … voice-advice.txt を書く＋本体へ入れる表を標準出力へ
           node voice-advice-catalog.js --check … 件数だけ見る */
'use strict';
const fs = require('fs'), path = require('path');
const T = {};   // id → 字
const SAY = {}; // id → 読み（録音用）
const add = (id, text, say) => { if (T[id]) throw new Error('重複 ' + id); T[id] = text; if (say) SAY[id] = say; };

/* 共通 */
add('adv-teiseki', '定石では、');
/* 攻め・ふつうの型 */
add('adva-head', '攻めなのだ。');
add('adva-from', 'から切って、');
add('adva-weak', 'つながりの薄い牌から切って、');
[3, 6, 7, 8].forEach(n => add('adva-t' + n, n + '巡目までに一向聴なのだ。', n + 'じゅんめまでに、イッコウテンなのだ。'));
add('adva-w-butler', 'ドラがあって、打点が高いのだ。');
add('adva-w-strategist', '受け入れが広いのだ。');
add('adva-w-blunt', '良い形がそろっているのだ。');
add('adva-w-lady', '守りに使える牌が少ないから、押すのだ。');
add('adva-w-french', '浮いた牌が少ないのだ。', 'ういた牌が少ないのだ。');
add('adva-w-ichihime', '対子が多くて、手が見えているのだ。');
add('adva-w-sensei', '染めの形が見えているのだ。', 'そめの形が見えているのだ。');
/* 攻め・特殊形（数字の声は 0〜13 を別に使う。前の部品・後の部品の間に数字が入る） */
add('adva-kok-a', '国士の芽なのだ。一九字牌の十三種のうち、いま', 'コクシの芽なのだ。イチキュウジハイの、じゅうさん種のうち、いま');
add('adva-kok-b', '種そろっているのだ。');
add('adva-kok-c', '真ん中の牌から切って、一九字牌を残すのだ。', 'まんなかの牌から切って、イチキュウジハイを残すのだ。');
add('adva-chi-a', '七対子の形なのだ。対子が', 'チートイツの形なのだ。トイツが');
add('adva-chi-b', '組あるのだ。');
add('adva-chi-c', '対子は崩さずに、一枚の牌を入れ替えるのだ。', 'トイツは崩さずに、いちまいの牌を入れ替えるのだ。');
add('adva-toi-a', '対々和の形なのだ。刻子が', 'トイトイホーの形なのだ。コーツが');
add('adva-toi-b', '組、対子が', '組、トイツが');
add('adva-toi-c', '組あるのだ。');
add('adva-toi-d', '順子になりそうな牌から切って、刻子と対子を残すのだ。', 'シュンツになりそうな牌から切って、コーツとトイツを残すのだ。');
add('adva-ikk-a', 'あと一枚で聴牌なのだ。', 'あと、いちまいで、テンパイなのだ。');
add('adva-ikk-b', '受けの広い方を残して、真っすぐ押すのだ。期限は引かないのだ。', 'うけの広い方を残して、まっすぐ押すのだ。期限は引かないのだ。');
add('adva-neko-a', 'つながらない牌が');
add('adva-neko-b', '枚あるのだ。');
add('adva-neko-c', 'そこから切って形を作るのだ。形ができるまで、期限は決めないのだ。');
add('adva-tan-a', '端の牌と字牌が', 'はしの牌とジハイが');
add('adva-tan-b', '枚しかないのだ。');
add('adva-tan-c', '端と字牌から切って、真ん中の牌で作るのだ。', 'はしとジハイから切って、まんなかの牌で作るのだ。');
add('adva-yak-a', '役満の芽が見えているのだ。', 'ヤクマンの芽が見えているのだ。');
add('adva-yak-b', 'その役に使う牌を残して、使わない牌から切るのだ。');
/* 攻め・他の場面（一文ずつ・定石） */
add('adva-s-nito', '七対子と対々の二兎なのだ。定石では、対子は崩さずに、七対子を先に見るのだ。', 'チートイツとトイトイの、にとなのだ。定石では、トイツは崩さずに、チートイツを先に見るのだ。');
add('adva-s-kasa', '形が重なりすぎているのだ。定石では、重なった一組を先に切って、受けを広げるのだ。');
add('adva-s-nosafe', '速いが安全牌が無いのだ。定石では、このまま押すのだ。');
add('adva-s-ukai', 'ドラが浮いているのだ。定石では、ドラは持ち続けて、形を作るのだ。', 'ドラがういているのだ。定石では、ドラは持ち続けて、形を作るのだ。');
add('adva-s-soba', '定石では、ドラの近くの牌は残して、遠い牌から切るのだ。');
add('adva-s-jihai', '定石では、字牌の対子は雀頭の候補に残して、押すのだ。', '定石では、ジハイのトイツは雀頭の候補に残して、押すのだ。');
/* 守り */
add('advd-head', '守りなのだ。');
add('advd-w-far', 'この手は、上がりまで遠いのだ。');
add('advd-w-cheap', '遠い上に、打点も安いのだ。');
add('advd-w-shape', '形が悪くて、まとまらないのだ。');
add('advd-w-honor', '字牌と端の牌が多くて、守れるのだ。', 'ジハイと端の牌が多くて、守れるのだ。');
add('advd-w-few', '安全牌が少ないのだ。');
add('advd-w-pair', '対子が多くて、守りに回せるのだ。', 'トイツが多くて、守りに回せるのだ。');
add('advd-cut', 'から切るのだ。');
add('advd-and', 'と');
add('advd-keep', 'は、安全牌として残すのだ。');
add('advd-s-soba', '定石では、ドラの近くの牌から先に切るのだ。');
add('advd-s-jihai', 'の対子は、安全牌として抱えるのだ。', 'のトイツは、安全牌として抱えるのだ。');
add('advd-s-nito', '定石では、二兎の対子は、安全牌に回すのだ。', '定石では、にとのトイツは、安全牌に回すのだ。');
add('advd-s-ukai', '定石では、浮いたドラは持たずに切るのだ。', '定石では、ういたドラは持たずに切るのだ。');
add('advd-riichi', '定石では、リーチを受けたら、その人の捨てた牌、残した字牌と対子、筋の順に切るのだ。', '定石では、リーチを受けたら、その人の捨てた牌、残したジハイとトイツ、スジの順に切るのだ。');
/* 牌の名（34）。読みは麻雀の呼び方 */
const MAN = ['イーマン', 'リャンマン', 'サンマン', 'スーマン', 'ウーマン', 'ローマン', 'チーマン', 'パーマン', 'キューマン'];
const PIN = ['イーピン', 'リャンピン', 'サンピン', 'スーピン', 'ウーピン', 'ローピン', 'チーピン', 'パーピン', 'キューピン'];
const SOU = ['イーソー', 'リャンソー', 'サンソー', 'スーソー', 'ウーソー', 'ローソー', 'チーソー', 'パーソー', 'キューソー'];
const KAN = '一二三四五六七八九';
for (let i = 0; i < 9; i++) {
  add('advt-m' + (i + 1), KAN[i] + '萬', MAN[i]);
  add('advt-p' + (i + 1), KAN[i] + '筒', PIN[i]);
  add('advt-s' + (i + 1), KAN[i] + '索', SOU[i]);
}
[['E', '東', 'トン'], ['S', '南', 'ナン'], ['W', '西', 'シャー'], ['N', '北', 'ペー'], ['P', '白', 'ハク'], ['F', '發', 'ハツ'], ['C', '中', 'チュン']].forEach(x => add('advt-' + x[0], x[1], x[2]));

module.exports = { T, SAY };
if (require.main === module) {
  const ids = Object.keys(T);
  if (process.argv.indexOf('--check') >= 0) { console.log('部品 ' + ids.length + '本（牌 ' + ids.filter(i => i.indexOf('advt-') === 0).length + '）'); process.exit(0); }
  const head = '# 全判定の助言の声の録音台本（v1484・y1114-2218）。voice-advice-catalog.js から作る。手で書き換えない。\n# VOICEVOX:ずんだもん。録音の読み（2列目）で渡す。出力は reports/voice-advice-out/<id>.wav.wav\n';
  fs.writeFileSync(path.join(__dirname, 'voice-advice.txt'), head + ids.map(i => i + '.wav.wav\t' + (SAY[i] || T[i])).join('\n') + '\n');
  console.log('部品 ' + ids.length + '本 → voice-advice.txt');
  console.log('// ADV_TEXT（本体へ入れる表）');
  console.log(JSON.stringify(T));
}
