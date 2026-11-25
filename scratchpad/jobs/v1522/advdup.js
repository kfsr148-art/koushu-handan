// advdup.js — 助言の出来上がった文の通し読み検査（枠 三百二十三＝三百十九〜三百二十二）。一文ずつ切って、次の五つを数える：
//   dup＝隣り合う二文に同じ自立語（漢字2字以上の語・牌の名・カナ3字以上）／empty＝中身のない一文（語尾だけ・「なのでござる。」）／
//   dbl＝語尾の二重（「のだでござる」「なのだんや」）／rep＝同じ語尾が二文続く／frag＝切れ端（「うちの猫がね。」のように述語が無い短い一文）。
//   食い違い（向かう言い方と損の一文）は別の検査 advconflict に分ける。
'use strict';
const STOP = new Set(['場合', '今回', 'です', 'ます', '一枚', '二枚', '三枚', '以上', '以下', '自分', '全部', '最後']);
function sentences(t) { return String(t || '').split(/(?<=[。！？])/).map(s => s.trim()).filter(Boolean); }
function words(s) {
  const out = new Set();
  (s.match(/[一-龥々]{2,}|[ァ-ヶー]{3,}/g) || []).forEach(w => { if (!STOP.has(w)) { out.add(w); } });
  (s.match(/[遠安高多少早速悪広薄厚強弱近長短]([いくうき]|ければ|かった)/g) || []).forEach(w => out.add(w[0]));   // 形容詞の語幹（遠い→遠く＝同じ語）
  return out;
}
const ENDS = /(のでございます|でございます|のでござる|でござる|のでおます|でおます|ですわ|ですの|ですよ|ですね|です|ます|にゃ|のだ|だ|ぞ|ぜよ|ばい|たい|けん|やけん|やん|やんか|やで|で|どす|どすえ|やわ|だべ|んだ|だっぺ|びょん|さー|ねー|さ|よ|ね|な|わ)(?=[。！？])/;
function tailOf(s) { const m = ENDS.exec(s.replace(/[、，]+[^、。]*$/, m2 => m2)); const x = s.replace(/[。！？]$/, ''); const k = (/(.{1,4})$/.exec(x) || [, ''])[1]; return k; }
function scan(text) {
  const ss = sentences(text), out = [];
  for (let i = 0; i < ss.length; i++) {
    const s = ss[i], body = s.replace(/[。！？]$/, '');
    if (/^(なの|な|の|ので|のだ|なのだ|だ|です)[^一-龥ァ-ヶー0-9]{0,6}$/.test(body) || (body.length <= 8 && !/[一-龥ァ-ヶー0-9]/.test(body))) { out.push({ k: 'empty', s: s }); }
    if (/(のだ|なのだ)(でござる|だんや|やで|やけん|ばい|たい|どす|やわ|ですけん|だべ|でおます|ぜよ|びょん|さー|ですたい|ですばい|なんや|ちゃう|やんか|ねー)/.test(body)) { out.push({ k: 'dbl', s: s }); }
    if (i > 0) {
      const a = words(ss[i - 1]), b = words(s); const common = [...b].filter(w => a.has(w));
      if (common.length) { out.push({ k: 'dup', s: ss[i - 1] + ' / ' + s, w: common.join('・') }); }
      const t1 = tailOf(ss[i - 1]), t2 = tailOf(s);
      const DE = /(ばい|たい|けん|やん|やで|どす|やわ|だべ|っぺ|ぜよ|びょん|さー|ねー|っちゃ|とよ|やろ|だす|ござる)$/;
      if (t1.length >= 2 && DE.test(ss[i - 1].replace(/[。！？…]+$/, '')) && DE.test(s.replace(/[。！？…]+$/, '')) && DE.exec(ss[i - 1].replace(/[。！？…]+$/, ''))[0] === DE.exec(s.replace(/[。！？…]+$/, ''))[0]) { out.push({ k: 'rep', s: ss[i - 1] + ' / ' + s, w: t2.slice(-2) }); }
    }
    if (body.length <= 9 && /(が|は|を|に|の)ね?$/.test(body) && !/[。]/.test(body)) { out.push({ k: 'frag', s: s }); }
  }
  return out;
}
module.exports = { scan, sentences };
