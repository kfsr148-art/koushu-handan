/* serifu-extract.js　全台詞の書き出し
 *
 *   node serifu-extract.js            → serifu.txt を書き出す
 *   node serifu-extract.js --out X    → 書き出し先を変える（差分を見るとき用）
 *   node serifu-extract.js --check    → 書き出さず、いまの serifu.txt と食い違うかだけ見る
 *
 * 本体（koushu-handan.html）の台詞表を読み、レビュー用の台本を組み立てる。
 * 行番号は本体のその行。台詞に手を入れた回は、これを回して serifu.txt を作り直す。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'koushu-handan.html');
const DEST = path.join(ROOT, 'serifu.txt');

/* ── 台詞表の一覧。並び順がそのまま台本の並び順になる ───────────────── */
const TABLES = [
  ['TONE_WORDS',      '判定カード', '攻守の一言。人柄チップで選んだ人柄の言葉。方言チップが入ると DIALECT_WORDS が優先'],
  ['DIALECT_WORDS',   '判定カード', '攻守の一言（方言版）。方言チップを選んでいる間はこちら'],
  ['SEAT_WORDS',      '判定カード', '場風・自風を選んでいるとき、結果の下に一行添える'],
  ['MASCOT_WORDS',    '判定カード', '中央の獣を押したときの判定エンジンの声。方言には反応しない'],
  ['ROTATE_WORDS',    '共通',       '縦持ちにしたときの催促'],
  ['ADV_TALK',        '探偵編',     '部屋での応答（deny=否認／alibi=本人／allyAlibi=味方の証言 ほか）'],
  ['ADV_MOTIVE_HINT', '探偵編',     '否認のとき、動機の匂わせとして後ろに足される'],
  ['ADV_CONFESS',     '探偵編・終幕', '犯人の自白（複数ページ）'],
  ['ADV_MOTIVE',      '探偵編・終幕', '自白のあと、犯人が動機を漏らす'],
  ['ADV_FEAR',        '探偵編・終幕', '犯人が恐れを口にする'],
  ['ADV_GENBA',       '探偵編・終幕', '犯人が現場の様子を語る'],
  ['ADV_NEXT',        '探偵編・終幕', '犯人が頭を下げたあとの一言'],
  ['ADV_PAIR',        '探偵編・終幕', '生存者2名の組に掛け合いがあるときだけ'],
  ['ADV_DEFEND',      '探偵編・終幕', '生存者のうち最大3名が犯人をかばう'],
  ['ADV_GRUDGE',      '探偵編・終幕', '生存者のうち最大3名が遺恨を述べる'],
  ['ADV_BLAME',       '探偵編・終幕', '最大4名が非難を述べる'],
  ['ADV_BLAME_OK',    '探偵編・終幕', '非難への受け答え'],
  ['ADV_MOTIVE_CLUE', '探偵編',     '動機に繋がる手がかり'],
  ['ADV_TRAIT',       '探偵編',     '背格好と装いの言い回し'],
  ['MD_CLOSE',        '誤診記録',   '締めの一言。話者×当たり外れの帯']
];

/* ── 表に入っていない台詞。実行時に組み立てる関数を、並べる順に ─────── */
const FUNCS = [
  ['toneAngleLine', '人柄ごとの見立て（助言欄）'],
  ['mascotSay',     '獣を押したときの5分岐'],
  ['tenLeans',      '投票欄のアイコンを押したときの一行'],
  ['mdOpen',        '誤診記録の口上'],
  ['mdContents',    '誤診記録の読み上げ']
];

/* ── 鍵の日本語。ここに無い鍵は、そのままの字面で出す ───────────────── */
const GLOSS = {
  butler:'執事', strategist:'軍師', blunt:'ずんだもん', lady:'お嬢様',
  french:'マダム', ichihime:'一姫', sensei:'先生',
  miyazaki:'宮崎', hakata:'博多', osaka:'大阪', kyoto:'京都',
  aomori:'青森', okinawa:'沖縄', bushi:'武士', yoji:'幼児',
  a:'攻め', d:'守り', dealer:'親', child:'子', main:'本文', sub:'添え',
  dere:'デレデレ',
  idle:'雑談', idleRepeat:'雑談（二度目）', deny:'否認',
  allyAlibi:'味方の証言', alibi:'本人のアリバイ',
  cat:'現場猫', eda:'枝豆スイッチ', om:'AIスイッチ',
  winA:'当たり（攻め）', winD:'当たり（守り）',
  loseA:'外し（攻め）', loseD:'外し（守り）', mute:'沈黙'
};

const CHARS   = ['butler','strategist','blunt','lady','french','ichihime','sensei'];
const DIALECTS = ['miyazaki','hakata','osaka','kyoto','aomori','okinawa','bushi','yoji'];
const SWITCHES = ['cat','eda','om'];

/* 台詞の頭に「名前「」の形で出る話者。ここに挙げた名だけを拾う */
const PREFIX_NAMES = ['執事','軍師','ずんだもん','ずんだ','お嬢様','マダム','一姫','先生',
                      '現場猫','枝豆スイッチ','AIスイッチ'];

/* ── 口調の混入。口癖と、その持ち主（持ち主の名は複数の呼び方を並べる）───── */
const TICS = [
  { name:'ずんだ', owner:['ずんだもん','ずんだ'], words:['のだ'] },
  { name:'一姫',   owner:['一姫'],                words:['にゃ'] },
  { name:'軍師',   owner:['軍師'],                words:['ぞ', 'べし'] },
  { name:'マダム', owner:['マダム'],              words:['ノン', 'ウィ'] },
  { name:'現場猫', owner:['現場猫'],              words:['ヨシ'] }
];
/* 見るのは人柄七人の台詞だけ。現場猫・スイッチ・地の文は口調の持ち主ではないので数えない */
const TIC_WATCH = ['執事','軍師','ずんだもん','ずんだ','お嬢様','マダム','一姫','先生'];
/* 混入の見張りから外す節。方言と人柄の言い分、誤診記録は、口調がぶつかって当然の場所 */
const TIC_SKIP = ['TONE_WORDS','DIALECT_WORDS','SEAT_WORDS','ROTATE_WORDS','MD_CLOSE','ADV_TRAIT'];
const TIC_CUT = 44;   // 長い台詞は頭だけ載せる

/* ══ 本体の字面を読む ════════════════════════════════════════════ */

/* 添え字の位置が何行目かを引く表を先に作る（一件ごとに数え直さない） */
function lineIndexer(src){
  const at = [0];
  for(let i = 0; i < src.length; i++) if(src[i] === '\n') at.push(i + 1);
  return function(pos){
    let lo = 0, hi = at.length - 1;
    while(lo < hi){ const mid = (lo + hi + 1) >> 1; if(at[mid] <= pos) lo = mid; else hi = mid - 1; }
    return lo + 1;
  };
}

/* 空白とコメントを読み飛ばす */
function skip(src, i){
  for(;;){
    while(i < src.length && /\s/.test(src[i])) i++;
    if(src[i] === '/' && src[i+1] === '/'){ while(i < src.length && src[i] !== '\n') i++; continue; }
    if(src[i] === '/' && src[i+1] === '*'){ const e = src.indexOf('*/', i + 2); i = (e < 0) ? src.length : e + 2; continue; }
    return i;
  }
}

/* 文字列そのもの。'…' "…" `…` を読む（改行を含む台詞があるので素直に拾う） */
function readString(src, i){
  const q = src[i]; let out = ''; i++;
  while(i < src.length && src[i] !== q){
    if(src[i] === '\\'){
      const c = src[i+1];
      out += (c === 'n') ? '\n' : (c === 't') ? '\t' : (c === 'r') ? '\r' : c;
      i += 2; continue;
    }
    out += src[i++];
  }
  return [out, i + 1];
}

/* 値を一つ読む。文字列の葉は sink へ（鍵の道筋と行番号を添えて）流す */
function readValue(src, i, keyPath, sink, lineOf){
  i = skip(src, i);
  const ch = src[i];
  if(ch === '{'){
    i++;
    for(;;){
      i = skip(src, i);
      if(src[i] === '}') return i + 1;
      let key;
      if(src[i] === "'" || src[i] === '"'){ const r = readString(src, i); key = r[0]; i = r[1]; }
      else { let s = i; while(i < src.length && /[A-Za-z0-9_$]/.test(src[i])) i++; key = src.slice(s, i); }
      i = skip(src, i);
      if(src[i] !== ':') return i;   // 読めない形は、そこで打ち切る
      i = readValue(src, i + 1, keyPath.concat(key), sink, lineOf);
      i = skip(src, i);
      if(src[i] === ',') i++;
    }
  }
  if(ch === '['){
    i++;
    for(;;){
      i = skip(src, i);
      if(src[i] === ']') return i + 1;
      i = readValue(src, i, keyPath, sink, lineOf);
      i = skip(src, i);
      if(src[i] === ',') i++;
    }
  }
  if(ch === "'" || ch === '"' || ch === '`'){
    const line = lineOf(i);
    let [text, j] = readString(src, i);
    // 「'…' + '…'」で継いだ台詞は、一つの台詞として扱う（行番号は頭の行）
    for(;;){
      const k = skip(src, j);
      if(src[k] !== '+') break;
      const m = skip(src, k + 1);
      if(src[m] !== "'" && src[m] !== '"' && src[m] !== '`') break;
      const r = readString(src, m); text += r[0]; j = r[1];
    }
    sink({ path: keyPath, line: line, text: text });
    return j;
  }
  // 文字列でも入れ物でもない値（true / 数 / 変数など）は読み飛ばす
  while(i < src.length && !/[,\]}]/.test(src[i])) i++;
  return i;
}

/* const NAME = … を丸ごと読む */
function readTable(src, name, lineOf){
  const head = new RegExp('\\bconst\\s+' + name + '\\s*=\\s*', 'g');
  const m = head.exec(src);
  if(!m) return null;
  const out = [];
  readValue(src, m.index + m[0].length, [], function(x){ out.push(x); }, lineOf);
  return out;
}

/* 台詞の断片かどうか。鍵の名や牌の記号を拾わないための篩。
   ふりがな・仮名・漢字を1文字以上含み、2文字以上あるものだけを台詞と見なす。
   （'butler' や 'a' のような鍵、'1・9・' のような記号だけの断片、絵文字は落ちる） */
function isSerifu(s){
  return s.length >= 2 && /[ぁ-ゖァ-ヺ一-龯]/.test(s);
}

/* function NAME(…){ … } の中の文字列を、出てくる順に拾う */
function readFunc(src, name, lineOf){
  const head = new RegExp('\\bfunction\\s+' + name + '\\s*\\(', 'g');
  const m = head.exec(src);
  if(!m) return null;
  let i = src.indexOf('{', m.index);
  const start = i;
  let depth = 0, out = [];
  for(; i < src.length; i++){
    const c = src[i];
    if(c === '/' && src[i+1] === '/'){ while(i < src.length && src[i] !== '\n') i++; continue; }
    if(c === '/' && src[i+1] === '*'){ const e = src.indexOf('*/', i + 2); i = (e < 0) ? src.length : e + 1; continue; }
    if(c === "'" || c === '"' || c === '`'){
      const line = lineOf(i);
      const r = readString(src, i);
      i = r[1] - 1;
      if(isSerifu(r[0])) out.push({ line: line, text: r[0] });
      continue;
    }
    if(c === '{') depth++;
    else if(c === '}'){ depth--; if(depth === 0) break; }
  }
  return { line: lineOf(start), items: out };
}

/* ══ 体裁を組む ══════════════════════════════════════════════════ */

function gloss(key){ return GLOSS[key] ? (GLOSS[key] + '(' + key + ')') : key; }

/* 話者の欄。名前のうしろを全角空白で詰め、最後に半角空白を一つ置く */
function pad(name){
  return name + '　'.repeat(Math.max(0, Math.min(3, 8 - name.length))) + ' ';
}

/* 誰の台詞か。①頭の「名前「」→②道筋の人柄→③方言→④スイッチ→⑤地の文 */
function speakerOf(keyPath, text){
  const m = /^([^「\n]{1,8})「/.exec(text);
  if(m && PREFIX_NAMES.indexOf(m[1]) >= 0) return m[1];
  for(let i = keyPath.length - 1; i >= 0; i--) if(CHARS.indexOf(keyPath[i]) >= 0) return GLOSS[keyPath[i]];
  for(let i = keyPath.length - 1; i >= 0; i--) if(DIALECTS.indexOf(keyPath[i]) >= 0) return '七人共通・' + GLOSS[keyPath[i]];
  for(let i = keyPath.length - 1; i >= 0; i--) if(SWITCHES.indexOf(keyPath[i]) >= 0) return GLOSS[keyPath[i]];
  return '（地の文）';
}

const RULE = '-'.repeat(78);
const BAR  = '='.repeat(78);

function build(){
  const src = fs.readFileSync(SRC, 'utf8');
  const lineOf = lineIndexer(src);
  const ver = (/<html[^>]*data-ver="([^"]*)"/.exec(src) || [, '?'])[1];

  const out = [];
  out.push('koushu-handan 全台詞');
  out.push('版 v' + ver + ' / 本体から機械的に書き出したもの（レビュー用・本体は未変更）');
  out.push('各行は  行番号 ｜ 話者 ｜ 鍵の道筋 ｜ 本文');
  out.push('行番号は台詞そのものが書かれている行。{n} は実行時に名前が入る。');
  out.push(BAR);
  out.push('');

  let total = 0;
  const all = [];   // 口調の混入を見るため、全台詞を控えておく

  TABLES.forEach(function(t){
    const [name, tag, cond] = t;
    const rows = readTable(src, name, lineOf);
    if(!rows){ out.push('■ ' + name + '　［' + tag + '］　（本体に見当たらない）'); out.push(''); return; }
    const top = rows.length ? rows[0].line - 1 : 0;
    out.push('■ ' + name + '　［' + tag + '］　' + top + '行〜');
    out.push('   出る条件 : ' + cond);
    out.push(RULE);
    rows.forEach(function(r){
      const who = speakerOf(r.path, r.text);
      const key = r.path.map(gloss).join(' / ');
      out.push('   ' + r.line + ' ｜ ' + pad(who) + '｜ ' + key + ' ｜ ' + r.text);
      total++;
      all.push({ table: name, line: r.line, who: who, text: r.text });
    });
    out.push('');
  });

  out.push('■ 表に入っていない台詞（実行時に組み立てるもの）');
  out.push(RULE);
  out.push('');
  FUNCS.forEach(function(f){
    const [name, note] = f;
    const fn = readFunc(src, name, lineOf);
    if(!fn){ out.push('  [' + name + ']　（本体に見当たらない）'); out.push(''); return; }
    out.push('  [' + name + ']　' + fn.line + '行〜 : ' + note);
    fn.items.forEach(function(x){
      out.push('   ' + x.line + ' ｜ ' + x.text);
      total++;
    });
    out.push('');
  });

  const mixed = findMixed(all);
  out.push('■ 口調の混入（機械で当たっただけ。台詞は直していない）');
  out.push('   他人の口癖（のだ／にゃ／ぞ・べし／ノン・ウィ／ヨシ）が、持ち主でない話者の台詞に出た行。');
  out.push('   複数の話者が一行に入る掛け合いは対象外。見るのは人柄七人の台詞だけで、');
  out.push('   『…』で他人の言葉を引いている箇所は数えない。');
  out.push(RULE);
  mixed.forEach(function(x){
    out.push('   ' + x.line + ' ｜ ' + x.who + ' の台詞に ' + x.tic + ' の口癖 ｜ ' + x.table + ' ｜ ' + x.text);
  });
  out.push('');
  out.push(BAR);
  out.push('合計 ' + total + ' 行 ／ 口調の混入 ' + mixed.length + ' 件');
  out.push('');
  return { text: out.join('\n'), total: total, mixed: mixed };
}

/* 他人の口癖が混ざった行を拾う。
   ・見るのは人柄七人の台詞だけ
   ・掛け合い（一行に二人以上の名）は数えない
   ・『…』の中は他人の言葉を引いている箇所なので数えない */
function findMixed(all){
  const hits = [];
  all.forEach(function(r){
    if(TIC_SKIP.indexOf(r.table) >= 0) return;
    if(TIC_WATCH.indexOf(r.who) < 0) return;
    let names = 0;
    PREFIX_NAMES.forEach(function(n){ if(r.text.indexOf(n + '「') >= 0) names++; });
    if(names > 1) return;
    const bare = r.text.replace(/『[^』]*』/g, '');   // 引用を外した字面で当たる
    TICS.forEach(function(t){
      if(t.owner.indexOf(r.who) >= 0) return;
      if(!t.words.some(function(w){ return bare.indexOf(w) >= 0; })) return;
      hits.push({ line: r.line, who: r.who, tic: t.name, table: r.table,
                  text: r.text.length > TIC_CUT ? r.text.slice(0, TIC_CUT) : r.text });
    });
  });
  return hits;
}

/* ══ 入口 ═══════════════════════════════════════════════════════ */
const argv = process.argv.slice(2);
const outAt = argv.indexOf('--out');
const dest = (outAt >= 0 && argv[outAt + 1]) ? argv[outAt + 1] : DEST;
const r = build();

if(argv.indexOf('--check') >= 0){
  const now = fs.existsSync(DEST) ? fs.readFileSync(DEST, 'utf8') : '';
  const same = now.replace(/\r\n/g, '\n') === r.text;
  console.log(same ? 'serifu.txt は本体と一致しています。'
                   : 'serifu.txt が本体とずれています。node serifu-extract.js で作り直してください。');
  process.exit(same ? 0 : 1);
}
fs.writeFileSync(dest, r.text, 'utf8');
console.log('書き出し : ' + dest);
console.log('合計 ' + r.total + ' 行 ／ 口調の混入 ' + r.mixed.length + ' 件');
