'use strict';
// 枠 三百六十七の型のうち、字と配牌だけで決まる物（二重語尾・格言が判定と逆・二度言い・決まり文句・口ごもり・染め）
const DBL = /(ますわ|ますの|ですわ|ですの|でございます|ございます)(びょん|さー|ばい|たい|っちゃ|とよ|だべ)|(びょん|っちゃ|ばい|たい|さー|とよ)(でございます|ですわ|ですの)/;
const DEF_WORDS = ['五向聴は祈るだけ', '四向聴はほぼ配り直し', '降りる勇気', '降りて正解の手', 'ベタオリの準備', '回し打ちの構え', '安全牌を温存', '現物はまだ無い', '三向聴は見切り所', '二向聴は引き所'];
const ATK_WORDS = ['二向聴は押し所'];
const NEVER = /(?:^|[。！？])(にふぇーでーびる|おおきに|おそれいります|かんにんしてや|ごきげんよう|ごめんあそばせ|めっちゃ|ほんまに|うちの猫がね)。/;
const STUT = /(こ、攻|こ、せめ|く、国士|く、こく|せ、際ど|め、么九)/;
function suits(tiles) {   // 配牌の字（例 29m 2234457p 567s 西）→ 色ごとの数牌（0 は赤五）
  const o = { m: [], p: [], s: [] };
  const re = /([0-9]+)([mps])/g; let m;
  while ((m = re.exec(tiles))) m[1].split('').forEach(d => o[m[2]].push(+d || 5));
  return o;
}
function outsideMeld(tiles) {
  const s = suits(tiles);
  const k = ['m', 'p', 's'].reduce((x, y) => (s[y].length > s[x].length ? y : x), 'm');
  return ['m', 'p', 's'].some(u => {
    if (u === k) return false;
    const c = {}; s[u].forEach(n => { c[n] = (c[n] || 0) + 1; });
    for (let i = 1; i <= 9; i++) if (c[i] >= 3 || (c[i] && c[i + 1] && c[i + 2])) return true;
    return false;
  });
}
/* 枠 三百七十四の残る2型（2026-11-26・窓が選んだ条件。緩くしない側）
   測り条件外：染め・七対子・対々・タンヤオの測りの一文が、見える手（directions）にその役の無い局に付く（directions が無い局は数えない）。
   頭だけ方言：方言の局で、頭の一文にその方言の言い方があり、二文目より後のどの文にも一つも無い。 */
const MEAS = [
  ['染め', /染め.{0,3}寄せ|しょめ.{0,3}よせ/, /染め|混一色|清一色/],
  ['七対子', /対子が(2〜3|[456])組.{0,30}(約[0-9,]+点|pt)|七対子(に|には)決め/, /七対子/],
  ['対々', /対々に(向か|は決め)/, /対々/],
  ['タンヤオ', /タンヤオに寄せ/, /タンヤオ/]
];
const DIAL_MARK = {
  miyazaki: /っちゃ|とよ|ちゃが|じゃが|やっど|やが/, hakata: /ばい|たい[。、！]|けん|っちゃ|と[。！？]/, osaka: /やで|ねん|へん|やん|や[。！、]|な[。！]/,
  kyoto: /どす|どすえ|え[。！]|なぁ|やす|はる|やおへん/, aomori: /びょん|だべ|はんで|だきゃ|んず|じゃ/, okinawa: /さー|ねー|やー|どー|やさ/,
  bushi: /ござる|でござ|なり|ぞ[。！]|じゃ|まする/, yoji: /よー|ねー|でしゅ|ましゅ|ばぶ|のー/
};
function measMiss(row) {
  if (!row.dirs) return [];
  const t = String(row.text || '');
  return MEAS.filter(m => m[1].test(t) && !row.dirs.some(d => m[2].test(d))).map(m => ({ k: '測り条件外', why: m[0] + 'の測りの一文があるが、見える手に無い（' + row.dirs.join('・') + '）' }));
}
function headOnly(row) {
  const re = DIAL_MARK[row.dial];
  if (!re) return [];
  const s = String(row.text || '').split(/(?<=[。！？])/).map(x => x.trim()).filter(Boolean);
  if (s.length < 3 || !re.test(s[0])) return [];
  return s.slice(1).some(x => re.test(x)) ? [] : [{ k: '頭だけ方言', why: '頭の一言だけ方言：' + s[0].slice(0, 30) }];
}

/* 枠 三百八十一の型「中身のかぶり」：一つの助言の中で同じ事を指す文の組を、字で拾う。今の組は一つ（守りの「字牌は降りる時に切るために抱える」と「6巡目までに字牌と端と対子を7枚」）。
   二つの組の頭は方言・幼児言葉でも字が変わらないので、語尾を見ずに拾う。二文を「、」でつないだ形も拾う。
   拾えない物：表に無い別の組／言い回しや仮名書きに直した形／片方が「〔牌〕は残しておく」の形の重なり。新しい組は SAME に足す。 */
const SAME = [
  ['字牌を抱える一言と守りの線', /字牌は、?降り[^。！？]{0,24}抱え/, /(巡目|じゅんめ)までに、?字牌と端と対子を[^。！？]{0,8}7枚/]
];
function sameMeaning(t) { return SAME.filter(p => p[1].test(t) && p[2].test(t)).map(p => ({ k: '中身のかぶり', why: '同じ事を指す文が二つ：' + p[0] })); }

function siftAdd(row) {
  const out = [], t = String(row.text || '');
  let m;
  if ((m = DBL.exec(t))) out.push({ k: '二重語尾', why: '語尾が二重：' + t.slice(Math.max(0, m.index - 12), m.index + 14) });
  const w = (row.attack ? DEF_WORDS : ATK_WORDS).filter(x => t.indexOf(x) >= 0)[0];
  if (w) out.push({ k: '格言が逆', why: (row.attack ? '攻め' : '守り') + 'で「' + w + '」' });
  const q = /「([^」]{2,20})」と[^。！？]*[。！？]([^。！？]*[。！？])/.exec(t);
  if (q && q[2].indexOf(q[1].slice(0, 4)) >= 0) out.push({ k: '二度言い', why: '引いた言葉を次の文で繰り返す：' + q[1] });
  if ((m = NEVER.exec(t))) out.push({ k: '決まり文句', why: '場面の無い決まり文句が一文で入る：' + m[1] });
  if ((m = STUT.exec(t))) out.push({ k: '口ごもり', why: '頭の音が違う：' + m[1] });
  if (/残して染め/.test(t) && outsideMeld(row.tiles)) out.push({ k: '染め', why: '染め色の外に完成面子があるのに染めを勧める' });
  sameMeaning(t).forEach(f => out.push(f));
  measMiss(row).forEach(f => out.push(f));
  headOnly(row).forEach(f => out.push(f));
  return out;
}
module.exports = { siftAdd, outsideMeld };
