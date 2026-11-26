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
  return out;
}
module.exports = { siftAdd, outsideMeld };
