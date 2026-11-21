// kaburi.js — 口調表（reports/kuchou-hyou.md）の「直した字」の被りを洗い出す（枠 二十四の第一段）
// 回し方：node scratchpad/kaburi.js            … 集計だけ（取り出した行数・拾えなかった行・種類ごとの被りの数）
//         node scratchpad/kaburi.js --list     … 集計と被りの一覧（番号は reports/kuchou-kaburi.md の番号と同じ）
//         node scratchpad/kaburi.js --rows     … 63行の取り出し結果（(A)(B)・口癖・一人称・述語・語尾）と一覧
//         node scratchpad/kaburi.js --json     … 全部を JSON で出す
// 読むのは reports/kuchou-hyou.md だけ（各人の kuchou-<人格>.md は同じ中身の写し＝2026-11-21 に行ごと突き合わせて確かめた）。
// 書き換えはしない。字を直した後にもう一度回せば、被りが減ったかが分かる。
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'reports', 'kuchou-hyou.md');
const PERSONAS = [ // 表の見出しの名 → 短い名
  ['執事', '執事'], ['軍師', '軍師'], ['ずんだ', 'ずんだ'], ['お嬢様', 'お嬢様'],
  ['マダム', 'マダム'], ['一姫', '一姫'], ['先生', '先生'],
];
const DIALS = ['標準', '宮崎', '博多', '大阪', '京都', '青森', '沖縄', '武士', '幼児'];
const CIRC = '①②③④⑤⑥⑦⑧⑨';
const YOBINA = ['だんさん']; // 直した字に残る呼び名（述語の取り出しの時だけ外す）

// ---------- 字の扱い ----------
const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const clean = s => String(s == null ? '' : s).replace(/\*\*/g, '').replace(/[ 　]+/g, ' ').trim();
// 突き合わせ用：句読点・長音・記号・空白を外し、片仮名を平仮名に
const norm = s => kata2hira(clean(s)).replace(/[、。，．,.！!？?・ー〜～「」『』（）()\s]/g, '');
function lev(a, b) {
  const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
// 文の突き合わせ（①④）：norm が一致＝同じ。頭からの共通部分を除いた残りが「両方1字以下」か「片方が空で他方2字以下」＝ほぼ同じ（句読点・長音・末尾の違いだけ）
function tails(x, y) { let i = 0; while (i < x.length && i < y.length && x[i] === y[i]) i++; return [x.slice(i), y.slice(i)]; }
function likeS(a, b) {
  const x = norm(a), y = norm(b);
  if (!x || !y) return null;
  if (x === y) return '同じ';
  const [t1, t2] = tails(x, y);
  if ((t1.length <= 1 && t2.length <= 1) || (Math.min(t1.length, t2.length) === 0 && Math.max(t1.length, t2.length) <= 2)) return 'ほぼ同じ';
  return null;
}
// 述語の突き合わせ（②③）：同じ＝norm 一致。ほぼ同じ＝差1（短い方3字以上）か差2（短い方6字以上）。
// ただし違う所が両方とも別々の方言の語尾そのもの（や／ね、ぞ／べ 等）なら、別の印として数えない。
function likeP(a, b) {
  const x = norm(a), y = norm(b);
  if (!x || !y) return null;
  if (x === y) return '同じ';
  const [t1, t2] = tails(x, y);
  if (t1 && t2 && ENDINGS[t1] && ENDINGS[t2]) return null;
  const L = Math.min(x.length, y.length), d = lev(x, y);
  if (L >= 3 && (d <= 1 || (d <= 2 && L >= 6))) return 'ほぼ同じ';
  // 頭に2字以下が付いただけ（よう聞きない／聞きない・お聞きなはれ／聞きなはれ）
  const [lo, sh] = x.length >= y.length ? [x, y] : [y, x];
  if (sh.length >= 3 && lo.endsWith(sh) && lo.length - sh.length <= 2) return 'ほぼ同じ';
  return null;
}

// ---------- 取り出し ----------
const text = fs.readFileSync(SRC, 'utf8');
const lines = text.split(/\r?\n/);

function personaBlocks() {
  const out = [];
  let cur = null;
  lines.forEach((ln, i) => {
    const m = ln.match(/^## [一二三四五六七]人目：([^（ ]+?)(（|\s|—|$)/);
    if (m) { cur = { name: m[1], start: i, end: lines.length }; out.push(cur); return; }
  });
  out.forEach((b, k) => { if (k + 1 < out.length) b.end = out[k + 1].start; });
  return out;
}

function rowBlocks(pb) {
  const rows = [];
  for (let i = pb.start; i < pb.end; i++) {
    const m = lines[i].match(/^### (?:仮 )?([①-⑨])/);
    if (m) {
      let j = i + 1;
      while (j < pb.end && !/^(###|## |#### |---)/.test(lines[j])) j++;
      rows.push({ dial: DIALS[CIRC.indexOf(m[1])], from: i, to: j, body: lines.slice(i + 1, j) });
    }
  }
  return rows;
}

// (A)(B) を一つの塊から拾う。(A) の後ろがすぐ「(」のもの（「(A)(B) は…」の説明）は飛ばす。
function pickAB(chunk, isYoji) {
  const s = clean(chunk);
  const reA = /\(A\)\s*(?!\()/g;
  let ma, a = null, b = null;
  while ((ma = reA.exec(s))) {
    const restA = s.slice(ma.index + ma[0].length);
    const ib = restA.search(/\(B\)\s*/);
    const aRaw = ib >= 0 ? restA.slice(0, ib) : restA;
    a = cutSentence(aRaw, isYoji);
    if (ib >= 0) {
      const restB = restA.slice(ib).replace(/^\(B\)\s*/, '');
      b = cutSentence(restB, isYoji);
    }
    if (a) break;
  }
  return { a, b };
}
function cutSentence(raw, isYoji) {
  let t = raw.replace(/^元なし＝標準のまま：/, '').replace(/^[\s：:]+/, '');
  if (isYoji) {
    t = t.split('\n')[0];
    t = t.replace(/（[^）]*）/g, '').replace(/\s*\(B\)[\s\S]*$/, '');
    // 幼児は「ばぶ。」「ばぶー。」で閉じるところまで
    const m = t.match(/^[\s\S]*?ばぶ[ー]?。(?=[^ぁ-んァ-ン]|$)/);
    const m2 = t.match(/^(ばぶ[ーばぶ]*。[\s\S]*ばぶ[ー]?。)/);
    t = m2 ? m2[1] : (m ? m[0] : t);
  } else {
    const k = t.indexOf('。');
    t = k >= 0 ? t.slice(0, k + 1) : t.split(/[（／\n]/)[0];
  }
  t = t.trim();
  return t || null;
}

function extractRow(r) {
  const isYoji = r.dial === '幼児';
  const how = [];
  // 「直した字」を名乗る行のうち最後のもの（先生⑥のように二度書いた行は後の方が今の字）
  // 後ろの「直した字」から拾い、片方しか無ければ前の「直した字」で補う（執事③は【二十三】で (B) だけ書き直した）
  const idxs = [];
  r.body.forEach((ln, k) => { if (/(^|／)直した字[（：【]/.test(ln.replace(/^\s*-\s*/, ''))) idxs.push(k); });
  let a = null, b = null;
  for (const idx of idxs.slice().reverse()) {
    if (a && b) break;
    const got = pickAt(r, idx, isYoji, how);
    if (!b && got.b) b = got.b;
    if (!a && got.a) a = got.a;
  }
  return finishRow(r, a, b, how);
}
function pickAt(r, idx, isYoji, how) {
  let a = null, b = null;
  {
    const ln = r.body[idx];
    const after = ln.slice(ln.search(/直した字/));
    if (/^直した字：同じ。/.test(after) && !/\(A\)/.test(after)) {
      // 「同じ」＝今の字をそのまま
      const now = r.body.find(x => /^今の字：/.test(x)) || '';
      ({ a, b } = pickAB(now.replace(/／直した字.*$/, ''), isYoji));
      how.push('直した字＝同じ → 今の字の(A)(B)');
    } else {
      // その行と続く行（理由／選ばなかった案／見直し／【 の前まで）
      const seg = [after];
      for (let k = idx + 1; k < r.body.length; k++) {
        if (/^(理由|選ばなかった|採らなかった|見直し|【|\*\*仮|仮の訳|注：|元[①-⑨Ａ]|前の元)/.test(r.body[k])) break;
        seg.push(r.body[k]);
      }
      // 幼児は (A) (B) を行ごとに拾う
      if (isYoji) {
        const la = seg.find(x => /^\s*(-\s*)?\(A\)\s*ばぶ/.test(x));
        const lb = seg.find(x => /^\s*(-\s*)?\(B\)\s*ばぶ/.test(x));
        a = la ? cutSentence(la.replace(/^\s*(-\s*)?\(A\)\s*/, ''), true) : null;
        b = lb ? cutSentence(lb.replace(/^\s*(-\s*)?\(B\)\s*/, ''), true) : null;
        how.push('幼児：(A)(B) の行をそのまま');
      } else {
        const j = seg.join('\n');
        ({ a, b } = pickAB(j, false));
        if (!b) { const mb = clean(j).match(/\(B\)\s*(?!\()([\s\S]*)/); if (mb) b = cutSentence(mb[1], false); }
        how.push((seg.length > 1 ? '直した字の行と続く箇条から' : '直した字の行から') + (a ? '(A)' : '') + (b ? '(B)' : ''));
      }
    }
  }
  return { a, b };
}
function finishRow(r, a, b, how) {
  // 口癖：口癖の行のうち、太字の「〜。」か「〜。」で切って／に替えた の形
  let kuse = null;
  for (const ln of r.body) {
    if (!/口癖/.test(ln)) continue;
    const s = ln;
    const m1 = s.match(/「\*\*([^*「」]+?。)\*\*」/) || s.match(/\*\*「([^「」*]+?。)」/);
    const m2 = s.match(/「([^「」]+?。)」(?:\*\*)?(?:で切って|と頭で切る|に替えた)/);
    const m = m1 || m2;
    if (m) { kuse = clean(m[1]); break; }
  }
  if (kuse) how.push('口癖：太字か「〜。」で切っての字');
  return { a, b, kuse, how };
}

// 一人称＝(B) の「〇〇の言うこと／申すこと」の〇〇（幼児も同じ）。無ければ (A) の「〇〇が／〇〇、」
function firstPerson(r) {
  const s = norm(r.b || '');
  let m = s.match(/^(?:ばぶ)*(.+?)の(?:いう|言う|申す|もうしゅ)こと/);
  if (m) return m[1];
  const t = norm(r.a || '').replace(/^(?:ばぶ)+/, '');
  m = t.match(/^(.{1,5}?)(?:が|、)/) || clean(r.a || '').replace(/^ばぶ[ー]?。/, '').match(/^(.{1,5}?)(?:が|、)/);
  return m ? kata2hira(m[1]) : '';
}
const stripYobina = s => YOBINA.reduce((t, y) => t.replace(new RegExp('、' + y + '。?$'), '。'), s);
const stripNya = (s, p) => p === '一姫' ? s.replace(/にゃ。?$/, '。') : s;
// 述語：(A) は「が・、・精一杯・最後まで」の後ろ、(B) は「こと(を|ば|、)」の後ろ
function predA(r) {
  if (!r.a || r.dial === '幼児') return '';
  let s = stripNya(stripYobina(clean(r.a)), r.p).replace(/。$/, '');
  let cut = -1, len = 0;
  for (const k of ['が', '、', '精一杯', '最後まで']) { const i = s.lastIndexOf(k, s.length - k.length - 1); if (i > cut) { cut = i; len = k.length; } }
  return cut >= 0 ? s.slice(cut + len) : s;
}
function predB(r) {
  if (!r.b || r.dial === '幼児') return '';
  let s = stripNya(stripYobina(clean(r.b)), r.p).replace(/。$/, '');
  const m = s.match(/こと(?:を、|を|ば|、)?(.*)$/);
  return m ? m[1].replace(/^[、\s]+/, '') : s;
}
const ENDINGS = { // 方言の語尾（長い方から当てる）
  'くいやんせ': '宮崎', 'てんしゃい': '博多', 'んしゃい': '博多', 'やい': '博多', 'っちゃん': '博多', 'ばい': '博多', 'とよ': '博多',
  'おくれやす': '京都', 'やす': '京都', 'よし': '京都', 'のや': '京都', 'え': '京都',
  'なはれ': '大阪', 'まっせ': '大阪', 'ねん': '大阪', 'や': '関西', 'わ': '関西',
  'っちゃ': '宮崎', 'ない': '宮崎', 'ね': '宮崎', 'が': '宮崎',
  'ねさ': '青森', 'でごす': '青森', 'べ': '青森', 'へ': '青森', 'ら': '青森',
  'でござる': '武士', 'てござる': '武士', 'なされ': '武士', 'いたす': '武士', 'ねえ': '江戸',
  'あそばせ': '標準', 'なさいませ': '標準', 'なさいな': '標準', 'なさい': '標準', 'いたします': '標準',
  'ますの': '標準', 'ております': '標準', 'く': '標準', 'なされよ': '武士', 'います': '標準', 'のだ': '標準', 'といい': '標準', 'が良い': '武士', 'ぞ': '標準', 'う': '標準', 'る': '標準',
};
const ENDK = Object.keys(ENDINGS).sort((x, y) => y.length - x.length);
function ending(pred) {
  if (!pred) return '';
  const k = ENDK.find(e => pred.endsWith(e));
  return k || '';
}

// ---------- 63行を組む ----------
const ROWS = [];
for (const pb of personaBlocks()) {
  const p = (PERSONAS.find(x => pb.name.startsWith(x[0])) || [pb.name, pb.name])[1];
  for (const r of rowBlocks(pb)) {
    const e = extractRow(r);
    ROWS.push({ p, dial: r.dial, line: r.from + 1, a: e.a, b: e.b, kuse: e.kuse, how: e.how });
  }
}
// 拾えなかった行は手で読んで補う（今は 0 件。字を直して拾えなくなったらここへ足す）
const MANUAL = {
  // '執事|博多': { a: '…', b: '…', note: '拾い方' },
};
for (const r of ROWS) {
  const m = MANUAL[r.p + '|' + r.dial];
  if (m) { if (m.a) r.a = m.a; if (m.b) r.b = m.b; if (m.kuse !== undefined) r.kuse = m.kuse; r.how.push('手で補った：' + m.note); }
  r.fp = firstPerson(r); r.pa = predA(r); r.pb = predB(r); r.ea = ending(r.pa); r.eb = ending(r.pb);
}
const missing = ROWS.filter(r => !r.a || !r.b).map(r => `${r.p}×${r.dial}（${r.line}行）：${!r.a ? '(A)' : ''}${!r.b ? '(B)' : ''}`);
const id = r => `${r.p}×${r.dial}`;
const std = p => ROWS.find(r => r.p === p && r.dial === '標準');

// ---------- 被りを数える ----------
const K = { 1: [], 2: [], 3: [], 4: [], 5: [] };
const cmpA = r => stripNya(stripYobina(clean(r.a)), r.p); // 呼び名（だんさん）と一姫の「にゃ」を外して比べる
const cmpB = r => stripNya(stripYobina(clean(r.b)), r.p);
const pairs = (arr, f) => { for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) f(arr[i], arr[j]); };
// 塊にまとめる（頭の一つと比べる＝鎖でつながらない）
function group(items, like) {
  const gs = [];
  for (const it of items) {
    const g = gs.find(g => like(g[0].s, it.s));
    if (g) g.push(it); else gs.push([it]);
  }
  return gs.filter(g => g.length > 1).map(g => ({
    kind: g.every(x => norm(x.s) === norm(g[0].s)) ? '同じ' : 'ほぼ同じ',
    rows: g.map(x => id(x.r)), words: [...new Set(g.map(x => clean(x.s)))], rs: g.map(x => x.r),
  }));
}
// 標準に近い＝その人格の標準の述語と、末尾の違いだけ（likeS）。④で数えるので②③からは外す
const nearStd = (r, f) => { const s = std(r.p); return !!(s && s[f] && r[f] && likeS(s[f], r[f])); };
// 標準のまま＝その人格の標準の述語と字が同じ（③はこちらで外す。末尾に方言の印が付いた行は人格をまたいで被りうるので残す）
const eqStd = (r, f) => { const s = std(r.p); return !!(s && s[f] && r[f] && norm(s[f]) === norm(r[f])); };

// ① 文ごと：(A) どうし・(B) どうし（幼児は除く＝③の幼児で見る）
for (const [lab, pick] of [['(A)', cmpA], ['(B)', cmpB]]) {
  const items = ROWS.filter(r => r.dial !== '幼児' && (lab === '(A)' ? r.a : r.b)).map(r => ({ r, s: pick(r) }));
  for (const g of group(items, likeS)) K[1].push({ field: lab, ...g });
}

// ② 同じ人格の方言どうし：述語（(A)）・命令（(B)）が同じ／ほぼ同じ。標準に近い行（④で数える）は外す
for (const p of PERSONAS.map(x => x[1])) {
  for (const [f, lab] of [['pa', '(A) 述語'], ['pb', '(B) 命令']]) {
    const items = ROWS.filter(r => r.p === p && !['標準', '幼児'].includes(r.dial) && r[f] && !nearStd(r, f)).map(r => ({ r, s: r[f] }));
    for (const g of group(items, likeP)) K[2].push({ field: lab, ...g });
  }
}

// ③ 同じ方言の人格どうし：述語・命令・一人称・口癖・長い語尾（標準のままの行は外す）
const fpSet = r => {
  const out = new Set();
  if (r.fp) out.add(norm(r.fp));
  if (r.dial !== '幼児') { const m = norm(r.a || '').match(/^(.{1,5}?)(?:が|、)/); if (m) out.add(m[1]); }
  return out;
};
for (const d of DIALS.filter(x => !['標準', '幼児'].includes(x))) {
  const rs = ROWS.filter(r => r.dial === d);
  for (const [f, lab] of [['pa', '(A) 述語'], ['pb', '(B) 命令']]) {
    const items = rs.filter(r => r[f] && !eqStd(r, f)).map(r => ({ r, s: r[f] }));
    const gs = group(items, likeP);
    for (const g of gs) K[3].push({ field: lab, ...g });
    // 述語は違うが、3字以上の方言の語尾が同じ物（おくれやす 等）
    const ef = f === 'pa' ? 'ea' : 'eb';
    const byE = {};
    for (const it of items) { const e = it.r[ef]; if (e && e.length >= 3 && ENDINGS[e] !== '標準') (byE[e] = byE[e] || []).push(it.r); }
    for (const [e, xs] of Object.entries(byE)) {
      if (xs.length < 2) continue;
      const inOne = gs.some(g => xs.every(x => g.rs.includes(x)));
      if (!inOne) K[3].push({ field: lab + 'の語尾', kind: '語尾だけ同じ', rows: xs.map(id), words: [e, ...xs.map(x => x[f])] });
    }
  }
  // 一人称（わたくし＝丁寧な人格の基は外す）
  const byFp = {};
  for (const r of rs) for (const fp of fpSet(r)) if (!['わたくし', 'わたくち'].includes(fp)) (byFp[fp] = byFp[fp] || new Set()).add(r);
  for (const [fp, set] of Object.entries(byFp)) if (new Set([...set].map(r => r.p)).size >= 2) K[3].push({ field: '一人称', kind: '同じ', rows: [...set].map(id), words: [fp] });
  // 口癖
  const ki = rs.filter(r => r.kuse).map(r => ({ r, s: r.kuse }));
  for (const g of group(ki, likeS)) K[3].push({ field: '口癖', ...g });
}
// ③の幼児：本文（人格の (A)(B) の一文）と口癖・ばぶを外した「小難しい一言」どうしで、4字以上の同じ並び
function yojiExtra(r, s) {
  const sent = clean(s).split('。').map(x => x.trim()).filter(Boolean)
    .filter(x => !/^ばぶ[ーばぶ]*$/.test(x)).filter(x => !(r.kuse && norm(x + '。') === norm(r.kuse)));
  return norm(sent.slice(1).join(''));
}
function commonRuns(a, b, min) {
  const out = new Set();
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) continue;
    let k = 0; while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
    if (k >= min) out.add(a.slice(i, i + k));
  }
  const arr = [...out];
  return arr.filter(w => !arr.some(v => v !== w && v.includes(w)));
}
const yoji = ROWS.filter(r => r.dial === '幼児');
pairs(yoji, (x, y) => {
  const runs = new Set();
  for (const f of ['a', 'b']) for (const g of ['a', 'b']) commonRuns(yojiExtra(x, x[f]), yojiExtra(y, y[g]), 4).forEach(w => runs.add(w));
  const arr = [...runs].filter(w => ![...runs].some(v => v !== w && v.includes(w)));
  if (arr.length) K[3].push({ field: '幼児の小難しい一言', kind: '同じ並び', rows: [id(x), id(y)], words: arr });
});

// ④ 標準と同じ字のまま（呼び名・一姫の「にゃ」を外して、(A)(B) 別に）
for (const r of ROWS) {
  if (r.dial === '標準' || r.dial === '幼児') continue;
  const s = std(r.p);
  const la = likeS(cmpA(s), cmpA(r)), lb = likeS(cmpB(s), cmpB(r));
  if (!la && !lb) continue;
  const both = la && lb;
  K[4].push({ field: both ? '(A)(B)' : (la ? '(A)' : '(B)'),
    kind: both ? (r.kuse ? `方言の印が口癖だけ（A ${la}・B ${lb}）` : `方言の印が何も無い（A ${la}・B ${lb}）`) : (la || lb),
    rows: [id(r)], words: [la ? clean(r.a) : null, lb ? clean(r.b) : null].filter(Boolean) });
}

// ⑤ 口癖・語尾・一人称が行をまたいで同じ
// (a) 口癖どうし（方言をまたぐ物。同じ方言どうしは③で数えた）
pairs(ROWS.filter(r => r.kuse), (x, y) => {
  if (x.dial === y.dial) return;
  const L = likeS(x.kuse, y.kuse);
  if (L) K[5].push({ field: '口癖×口癖', kind: L, rows: [id(x), id(y)], words: [x.kuse, y.kuse] });
});
// (b) 口癖が、別の行の (B) の命令と同じ／その命令を含む（自分の行・標準のままの命令は外す）
for (const x of ROWS) {
  if (!x.kuse) continue;
  const k = norm(x.kuse);
  for (const y of ROWS) {
    if (y === x || y.dial === '幼児' || y.dial === '標準' || nearStd(y, 'pb')) continue;
    const v = norm(y.pb);
    if (v.length >= 3 && (k === v || k.endsWith(v)))
      K[5].push({ field: '口癖×(B)の命令', kind: k === v ? '同じ' : '含む', rows: [id(x), id(y)], words: [x.kuse, y.pb] });
  }
}
// (b2) 口癖どうしで4字以上の同じ並び（同じ・ほぼ同じに当たらない物。例：申し上げ）
pairs(ROWS.filter(r => r.kuse), (x, y) => {
  if (likeS(x.kuse, y.kuse)) return;
  const runs = commonRuns(norm(x.kuse), norm(y.kuse), 4);
  if (runs.length) K[5].push({ field: '口癖×口癖', kind: '同じ並び（4字以上）', rows: [id(x), id(y)], words: [x.kuse, y.kuse, '〔' + runs.join('・') + '〕'] });
});
// (c) 一人称：違う方言・違う人格に出る同じ字（わたくし・人格の標準の一人称＝基は外す）
{
  const by = {};
  for (const r of ROWS) for (const fp of fpSet(r)) {
    const base = [...fpSet(std(r.p))];
    if (['わたくし', 'わたくち'].includes(fp) || base.includes(fp)) continue;
    (by[fp] = by[fp] || new Set()).add(r);
  }
  for (const [fp, set] of Object.entries(by)) {
    const arr = [...set];
    if (new Set(arr.map(r => r.p)).size >= 2 && new Set(arr.map(r => r.dial)).size >= 2)
      K[5].push({ field: '一人称', kind: '違う方言に同じ字', rows: arr.map(id), words: [fp] });
  }
}
// (d) 方言の語尾：違う方言の行に同じ語尾が出る物（標準の語尾・標準の行は除く）
{
  const byE = {};
  for (const r of ROWS) {
    if (r.dial === '標準') continue;
    for (const [f, lab] of [['ea', '(A)'], ['eb', '(B)']]) {
      const e = r[f]; if (!e || ENDINGS[e] === '標準') continue;
      (byE[e] = byE[e] || []).push({ r, lab });
    }
  }
  for (const [e, xs] of Object.entries(byE)) {
    if (new Set(xs.map(x => x.r.dial)).size < 2) continue;
    K[5].push({ field: '語尾', kind: '違う方言に同じ語尾', rows: xs.map(x => id(x.r) + x.lab), words: [e, ...xs.map(x => x.lab === '(A)' ? x.r.pa : x.r.pb)] });
  }
}

// ---------- 出力 ----------
const arg = process.argv.slice(2);
if (arg.includes('--json')) { console.log(JSON.stringify({ rows: ROWS, kaburi: K, missing }, null, 1)); process.exit(0); }
if (arg.includes('--rows')) {
  for (const r of ROWS) console.log([id(r), 'A=' + r.a, 'B=' + r.b, '口癖=' + (r.kuse || '—'), '一人称=' + r.fp, '述語A=' + r.pa + '〔' + r.ea + '〕', '命令B=' + r.pb + '〔' + r.eb + '〕'].join(' | '));
  console.log('');
}
const NAME = { 1: '① (A)(B) の文が同じ・ほぼ同じ', 2: '② 同じ人格の方言どうし', 3: '③ 同じ方言の人格どうし', 4: '④ 標準と同じ字のまま', 5: '⑤ 口癖・語尾・一人称が行をまたいで同じ' };
console.log(`取り出した行：${ROWS.length}（人格 ${new Set(ROWS.map(r => r.p)).size} × 方言 ${new Set(ROWS.map(r => r.dial)).size}）`);
console.log(`拾えなかった行：${missing.length ? missing.join('／') : '0'}`);
let total = 0;
for (const k of [1, 2, 3, 4, 5]) { total += K[k].length; console.log(`${NAME[k]}：${K[k].length}`); }
console.log(`合わせて：${total}`);
if (arg.includes('--list') || arg.includes('--rows')) for (const k of [1, 2, 3, 4, 5]) {
  console.log(`\n## ${NAME[k]}`);
  K[k].forEach((c, i) => console.log(`${k}-${i + 1}\t${c.field}\t${c.kind}\t${c.rows.join('・')}\t${c.words.join(' ／ ')}`));
}
