#!/usr/bin/env node
/* 主人公の素材1枚の差し替えを一本で行う。キャラが替わっても使える名前にしてある。
     透過 → 切り出し → 本体の他の絵と面積で大きさ合わせ → 計測 → data URL
   揃えに使うのは「倍率」と「元絵での足元」の二つ。顔比は参考で、揃えの判断には使わない
   （上から5分の1の帯に振り上げた刃が入るコマがあり、姿勢によって指標が成立しないため）。
   使い方: node char_export.js <元絵.png> [koushu-handan.html] [向き] [体軸]   向きの既定は d、体軸の既定は 0.5
   出力: eda_<向き>.png（透過済み）／eda_<向き>.txt（data URL）／標準出力に埋める値

   画像の読み書きは headless の Edge / Chrome にやらせる（この環境には画像の外部部品が無い）。
   本体には触れない。写しも一時ディレクトリに作り、終わったら消す（CLAUDE.md §14）。 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const KEY = (process.argv[4] || 'd');   // 差し替える向き（idle/u/ur/r/dr/d/dl/l/ul）
/* 体軸（0〜1）。角度の目盛りをどこを中心に重ねるかに使う。省くと画布の中央。
   足元の重心は刃や弧に引かれるので自動では測らない。本体の EDA_WHIP_AXIS の値を渡すこと。 */
const AXIS = (process.argv[5] !== undefined) ? Number(process.argv[5]) : 0.5;
const WHITE = 240;        // これ以上明るい画素を白＝背景の候補とみなす
const ALPHA = 32;         // これ以上のアルファを「絵がある」とみなす。倍率・足元・顔比の土台
const USE_ANGLE = false;  // 角度の自動判定。剣士では刃と弧を取り違えるので止めてある
const OUTW = 494, OUTH = 290;   // 本体に入れる画布（EDA_SIZE と同じ）
const FOOT_WANT = 279;    // 既存8枚が揃えている足元の行（EDA_FOOT）

const SRC = process.argv[2];
const HTML = process.argv[3] || path.join(__dirname, 'koushu-handan.html');
if (!SRC) { console.error('使い方: node char_export.js <元絵.png> [koushu-handan.html] [向き] [体軸]'); process.exit(2); }
if (!fs.existsSync(SRC)) { console.error('元絵が無い: ' + SRC); process.exit(2); }
if (!fs.existsSync(HTML)) { console.error('本体が無い: ' + HTML); process.exit(2); }

/* ---- 本体から EDA_WHIP を取り出す（真下以外の8枚が大きさの基準） ---- */
const src = fs.readFileSync(HTML, 'utf8');
const i0 = src.indexOf('const EDA_WHIP = {');
if (i0 < 0) {
  console.error('中止：' + HTML + ' から EDA_WHIP を読めなかった。'
    + '大きさの基準がないまま出すと他の8枚と揃わないので、html の場所を指定し直すこと');
  process.exit(2);
}
const block = src.slice(i0, src.indexOf('};', i0) + 2);
const refs = {};
const re = /(\w+):'(data:image\/png;base64,[A-Za-z0-9+/=]+)'/g;
let m;
while ((m = re.exec(block))) refs[m[1]] = m[2];
const refKeys = Object.keys(refs).filter(k => k !== KEY);
if (refKeys.length < 2) { console.error('基準にする絵が足りない'); process.exit(2); }

/* ---- ブラウザを探す ---- */
const cands = [
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env['ProgramFiles(x86)'] && process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env['ProgramFiles'] && process.env['ProgramFiles'] + '\\Google\\Chrome\\Application\\chrome.exe'
].filter(Boolean).filter(p => fs.existsSync(p));
if (!cands.length) { console.error('Edge も Chrome も見つからない。画像を読ませる相手がいない'); process.exit(2); }
const BROWSER = cands[0];

/* ---- 一時ディレクトリに写しを作る ---- */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'edadown-'));
fs.copyFileSync(SRC, path.join(tmp, 'src.png'));

const page = `<!doctype html><meta charset="utf-8"><body><script>
const MK = '#' + 'EDA' + 'DOWN#';
const REFS = ${JSON.stringify(refKeys.map(k => refs[k]))};
const WHITE = ${WHITE}, OUTW = ${OUTW}, OUTH = ${OUTH}, FOOT_WANT = ${FOOT_WANT};
const ALPHA = ${ALPHA}, USE_ANGLE = ${USE_ANGLE}, AXIS = ${AXIS};
function load(s){ return new Promise((ok,ng)=>{ const i=new Image(); i.onload=()=>ok(i); i.onerror=ng; i.src=s; }); }
function grab(im, w, h){
  const c = document.createElement('canvas'); c.width = w||im.naturalWidth; c.height = h||im.naturalHeight;
  const x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
  x.drawImage(im, 0, 0, c.width, c.height);
  return { c:c, x:x, w:c.width, h:c.height, d:x.getImageData(0,0,c.width,c.height) };
}
/* 絵があるかどうかは色ではなくアルファで見る。主人公が替わっても通る。 */
const isInk = (d,p) => d[p+3] >= ALPHA;
/* 火花＝明るい黄橙。鞭の当たっている先にだけ出るので、振りの向きはこれで測る。
   肌（228,171,141 など）は黄みが足りない（G-B が 30 前後）ので、G-B で分ける。 */
const isSpark = (d,p) => d[p+3] >= 32 && d[p] >= 200 && d[p+1]-d[p+2] >= 40 && d[p+2] <= 140;
/* 火花が無い絵のための控え。鎖＝彩度の低い灰色。 */
const isGrey  = (d,p) => { if(d[p+3] < 32) return false;
  const mx = Math.max(d[p],d[p+1],d[p+2]), mn = Math.min(d[p],d[p+1],d[p+2]);
  return mx-mn <= 40 && mx >= 60; };
/* 元絵を読み込んだ直後に一度だけ呼ぶ。透明・半透明の画素を白に合成する。
   これで「透明＝黒」として乗っていた矩形が消え、以降の白基準の透過がそのまま効く。 */
function flattenToWhite(d){
  for(let i=0;i<d.length;i+=4){
    const a = d[i+3]/255;
    d[i]   = Math.round(d[i]   * a + 255 * (1-a));
    d[i+1] = Math.round(d[i+1] * a + 255 * (1-a));
    d[i+2] = Math.round(d[i+2] * a + 255 * (1-a));
    d[i+3] = 255;
  }
  return d;
}
/* 白背景から作った絵の後処理。半透明の画素に残った「白の混ざり」を取り除く。
   これをしないと残像が白いまま薄く残り、暗い背景で白く光る。 */
function unmatteWhite(d){
  for(let i=0;i<d.length;i+=4){
    const a = d[i+3]/255;
    if(a <= 0){ d[i] = d[i+1] = d[i+2] = 0; continue; }
    if(a >= 1) continue;
    for(let k=0;k<3;k++){
      d[i+k] = Math.max(0, Math.min(255, Math.round((d[i+k] - 255*(1-a)) / a)));
    }
  }
  return d;
}
function inkCount(g){ let n=0; const d=g.d.data;
  for(let p=0;p<d.length;p+=4) if(isInk(d,p)) n++; return n; }
/* 足元＝絵のある画素が3つ以上ある、いちばん下の行。
   足より下へ伸びる描き込み（斬撃の弧など）があるコマでは、これは足の高さと一致しない。 */
function footRow(d,w,h){ let f=-1;
  for(let y=0;y<h;y++){ let n=0;
    for(let x=0;x<w;x++) if(isInk(d,(y*w+x)*4)) n++;
    if(n>=3) f=y; }
  return f; }
/* 顔比 ＝ 頭の幅 ÷ 全身の高さ。色は使わない。
   全身の高さは絵の上端から下端まで、頭はその上から5分の1の帯で、いちばん広い行の幅。 */
function faceRatio(d,w,h){
  let top=-1, bottom=-1;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){ if(isInk(d,(y*w+x)*4)){ if(top<0) top=y; bottom=y; break; } }
  }
  if(top<0) return null;
  const height = bottom - top + 1;
  const band = Math.max(1, Math.floor(height / 5));
  let head = 0;
  for(let y=top;y<top+band;y++){
    let left=-1, right=-1;
    for(let x=0;x<w;x++) if(isInk(d,(y*w+x)*4)){ if(left<0) left=x; right=x; }
    if(left>=0) head = Math.max(head, right - left + 1);
  }
  return { ratio: head/height, head:head, height:height, top:top, bottom:bottom };
}
/* 一枚ぶんの計測。 */
function measure(d,w,h){
  let top=-1, alphaBottom=-1, gx=0, gy=0, gn=0, wx=0, wy=0, wn=0, cxg=0, cyg=0, cn=0;
  for(let p=0;p<w*h;p++){
    const q=p*4; if(d[q+3] < 32) continue;
    const x=p%w, y=(p-x)/w;
    if(top<0) top=y;
    alphaBottom = y;
    if(isInk(d,q)){ gx+=x; gy+=y; gn++; }
    if(isSpark(d,q)){ wx+=x; wy+=y; wn++; }
    if(isGrey(d,q)){ cxg+=x; cyg+=y; cn++; }
  }
  const fr = faceRatio(d,w,h);
  const bodyC = gn ? [gx/gn, gy/gn] : [w/2, h/2];
  const height = fr ? fr.height : (alphaBottom - top + 1);
  const head = fr ? fr.head : -1;
  /* 角度の自動判定は止めてある（USE_ANGLE=false）。刃と弧を色で見分けられないため、
     目盛りを重ねた確認画像を出して目で読む。以下の判定はそのために残してある。 */
  const from = !USE_ANGLE ? '止めてある'
    : (wn >= 20 ? '火花' : (cn >= 40 ? '鎖' : '測れず'));
  const tx = from === '火花' ? wx/wn : (from === '鎖' ? cxg/cn : 0);
  const ty = from === '火花' ? wy/wn : (from === '鎖' ? cyg/cn : 0);
  return { top:top, alphaBottom:alphaBottom, foot:footRow(d,w,h), height:height,
           head:head, headRatio: fr ? fr.ratio : -1, sparks:wn, chain:cn, from:from,
           ang: (from === '測れず' || from === '止めてある') ? NaN
                : Math.atan2(-(ty - bodyC[1]), (tx - bodyC[0])) * 180 / Math.PI };
}

(async function(){
  const out = { err:null, note:[] };
  try{
    /* ---------- 1. 透過（白を外周から塗りつぶす。にじみは半透明で残す） ---------- */
    const im = await load('src.png');
    const g = grab(im);
    const w = g.w, h = g.h, d = g.d.data;
    flattenToWhite(d);   /* 透明を白へ。これをしないと透明が黒として焼き付く */
    const mn = new Uint8Array(w*h);
    for(let p=0;p<w*h;p++){
      const q = p*4;
      mn[p] = Math.min(d[q],d[q+1],d[q+2]);
    }
    /* 濃さをそのまま不透明度にする（白＝完全透過）。ただし太い塊は不透明のまま残す。
       鎖は太くて連なった構造、煙の霞は細い。半径4の円で「開いて」太いものだけ拾えば、
       霞を横切って切り刻まないので縞にならない。 */
    const dark = new Uint8Array(w*h);
    for(let p=0;p<w*h;p++) dark[p] = mn[p] < 205 ? 1 : 0;
    const R = 4, off = [];
    for(let dy=-R;dy<=R;dy++) for(let dx=-R;dx<=R;dx++) if(dy*dy+dx*dx <= R*R) off.push([dx,dy]);
    const ero = new Uint8Array(w*h);
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){
      let all = 1;
      for(const [dx,dy] of off){ const nx=x+dx, ny=y+dy;
        if(nx<0||ny<0||nx>=w||ny>=h || !dark[ny*w+nx]){ all=0; break; } }
      if(all) ero[y*w+x] = 1;
    }
    const solid = new Uint8Array(w*h);
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){
      if(!ero[y*w+x]) continue;
      for(const [dx,dy] of off){ const nx=x+dx, ny=y+dy;
        if(nx>=0&&ny>=0&&nx<w&&ny<h) solid[ny*w+nx] = 1; }
    }
    /* 太い塊の内側の穴を埋め、さらに2px広げて「絵の本体」とする。
       輪郭の白いキーラインや鎖の光沢は本体の縁にあるので、広げないと透けて消える。 */
    const notSolid = new Uint8Array(w*h), st2 = [];
    for(let x=0;x<w;x++){ for(const y of [0,h-1]){ const p=y*w+x; if(!solid[p]&&!notSolid[p]){notSolid[p]=1;st2.push(p);} } }
    for(let y=0;y<h;y++){ for(const x of [0,w-1]){ const p=y*w+x; if(!solid[p]&&!notSolid[p]){notSolid[p]=1;st2.push(p);} } }
    while(st2.length){ const p=st2.pop(); const x=p%w, y=(p-x)/w;
      const nb=[]; if(x>0)nb.push(p-1); if(x<w-1)nb.push(p+1); if(y>0)nb.push(p-w); if(y<h-1)nb.push(p+w);
      for(const q of nb) if(!solid[q]&&!notSolid[q]){ notSolid[q]=1; st2.push(q); } }
    const filled = new Uint8Array(w*h);
    for(let p=0;p<w*h;p++) filled[p] = (solid[p] || !notSolid[p]) ? 1 : 0;   /* 囲まれた穴も本体 */
    const G = 2, goff = [];
    for(let dy=-G;dy<=G;dy++) for(let dx=-G;dx<=G;dx++) if(dy*dy+dx*dx <= G*G) goff.push([dx,dy]);
    const body = new Uint8Array(w*h);
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){
      if(!filled[y*w+x]) continue;
      for(const [dx,dy] of goff){ const nx=x+dx, ny=y+dy;
        if(nx>=0&&ny>=0&&nx<w&&ny<h) body[ny*w+nx] = 1; }
    }
    for(let p=0;p<w*h;p++) d[p*4+3] = body[p] ? 255 : (255 - mn[p]);
    unmatteWhite(d);   /* 半透明に残った白の混ざりを取る（暗い背景で白く光らせない） */
    g.x.putImageData(g.d, 0, 0);

    /* ---------- 2. 切り出し ---------- */
    let x0=1e9,x1=-1,y0=1e9,y1=-1;
    for(let p=0;p<w*h;p++){ if(d[p*4+3] <= 16) continue;
      const x=p%w, y=(p-x)/w; if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
    if(x1 < 0) throw new Error('中身が無い（全部が背景と判定された）');
    const clipped = (x0 <= 0 || y0 <= 0 || x1 >= w-1 || y1 >= h-1);
    const cw = x1-x0+1, ch = y1-y0+1;
    const cut = document.createElement('canvas'); cut.width = cw; cut.height = ch;
    cut.getContext('2d').drawImage(g.c, x0, y0, cw, ch, 0, 0, cw, ch);

    /* ---------- 3. 本体の他の絵と面積で大きさを合わせる ---------- */
    const areas = [];
    for(const u of REFS){ const r = grab(await load(u)); areas.push(inkCount(r)); }
    areas.sort((a,b)=>a-b);
    const refGreen = areas.length % 2 ? areas[(areas.length-1)/2]
                   : Math.round((areas[areas.length/2-1] + areas[areas.length/2]) / 2);
    const cutG = grab(cut, cw, ch);
    const myGreen = inkCount(cutG);
    if(!myGreen) throw new Error('絵が見つからない（全部が背景と判定された）');
    const scale = Math.sqrt(refGreen / myGreen);
    const sw = Math.max(1, Math.round(cw * scale)), sh = Math.max(1, Math.round(ch * scale));
    const small = document.createElement('canvas'); small.width = sw; small.height = sh;
    const sx = small.getContext('2d');
    sx.imageSmoothingEnabled = true; sx.imageSmoothingQuality = 'high';
    sx.drawImage(cut, 0, 0, sw, sh);

    /* ---------- 4. 画布へ置く（横は中央、足元は既存8枚と同じ行へ） ---------- */
    const sg = grab(small, sw, sh);
    const footInSmall = footRow(sg.d.data, sw, sh);
    const dx = Math.round((OUTW - sw) / 2);
    let dy = (footInSmall >= 0) ? (FOOT_WANT - footInSmall) : Math.round((OUTH - sh) / 2);
    if(dy + sh > OUTH) out.note.push('画布の下にはみ出すので上へ寄せた');
    if(dy < 0) out.note.push('画布の上にはみ出すので下へ寄せた');
    dy = Math.max(Math.min(dy, OUTH - sh), Math.min(0, OUTH - sh));
    const fin = document.createElement('canvas'); fin.width = OUTW; fin.height = OUTH;
    const fx = fin.getContext('2d'); fx.imageSmoothingEnabled = false;
    fx.drawImage(small, dx, dy);
    const fg = grab(fin, OUTW, OUTH), fd = fg.d.data;

    /* ---------- 5. 計測（基準の8枚も同じ物差しで測って範囲を出す） ---------- */
    const me = measure(fd, OUTW, OUTH);
    const refM = [];
    for(const u of REFS){ const r = grab(await load(u)); refM.push(measure(r.d.data, r.w, r.h)); }
    const ratios = refM.map(r => r.headRatio).filter(v => v > 0).sort((a,b)=>a-b);
    const angs = refM.map(r => r.ang).filter(v => isFinite(v));   /* 火花のない待機は入らない */
    /* 半透明の画素が明るすぎないか（白残りの点検） */
    let semiN=0, semiV=0;
    for(let p=0;p<OUTW*OUTH;p++){ const q=p*4, al=fd[q+3];
      if(al > 8 && al < 200){ semiN++; semiV += (fd[q]+fd[q+1]+fd[q+2])/3; } }
    const halo = semiN ? semiV/semiN : 0;
    out.res = { halo:halo, semiN:semiN, srcSize:[w,h], cut:[cw,ch], cutAt:[x0,y0], clipped:clipped,
                refGreen:refGreen, myGreen:myGreen, scale:scale, small:[sw,sh],
                at:[dx,dy], foot:me.foot, top:me.top, alphaBottom:me.alphaBottom,
                height:me.height, head:me.head, headRatio:me.headRatio, ang:me.ang,
                sparks:me.sparks, chain:me.chain, from:me.from,
                refRatio:[ratios[0], ratios[ratios.length-1]],
                refFeet:[Math.min.apply(null, refM.map(r=>r.foot)), Math.max.apply(null, refM.map(r=>r.foot))],
                refAng:[Math.min.apply(null, angs), Math.max.apply(null, angs)] };
    /* 元絵のままの足元。いまの本体は素材を実寸で使うので、EDA_FOOT に入れるのはこちら。 */
    const cutFoot = footRow(cutG.d.data, cw, ch);
    out.res.srcFoot = cutFoot;

    /* ---------- 6. 確認画像（角度の目盛り／暗地／白地） ---------- */
    const PAD = 12, GAP = 10, LBL = 26;
    const cv3 = document.createElement('canvas');
    cv3.width = PAD * 2 + OUTW * 3 + GAP * 2; cv3.height = PAD * 2 + OUTH + LBL;
    const c3 = cv3.getContext('2d');
    c3.fillStyle = '#ffffff'; c3.fillRect(0, 0, cv3.width, cv3.height);
    const panes = [['#0d1b16', '角度の目盛り（本番の背景）'],
                   ['#0d1b16', '本番の暗い背景'],
                   ['#ffffff', '白地']];
    panes.forEach(function(pn, i){
      const ox = PAD + i * (OUTW + GAP);
      c3.fillStyle = pn[0]; c3.fillRect(ox, PAD, OUTW, OUTH);
      c3.drawImage(fin, ox, PAD);
      c3.strokeStyle = '#999'; c3.lineWidth = 1; c3.strokeRect(ox + 0.5, PAD + 0.5, OUTW - 1, OUTH - 1);
      c3.fillStyle = '#000'; c3.font = '13px monospace'; c3.textAlign = 'center';
      c3.fillText(pn[1], ox + OUTW / 2, PAD + OUTH + 18);
    });
    /* いちばん左に目盛りを重ねる。中心は立ち位置（画布の中央 x、足元の行 y）。 */
    (function(){
      const ox = PAD, cx0 = ox + dx + AXIS * sw, cy0 = PAD + FOOT_WANT, R = Math.min(OUTW, OUTH) * 0.46;
      c3.save();
      c3.strokeStyle = 'rgba(255,255,255,.30)'; c3.lineWidth = 1;
      c3.beginPath(); c3.arc(cx0, cy0, R, 0, Math.PI * 2); c3.stroke();
      for(let deg = -180; deg < 180; deg += 15){
        const rad = deg * Math.PI / 180;
        const big = (deg % 45 === 0);
        c3.strokeStyle = big ? 'rgba(255,210,120,.85)' : 'rgba(255,255,255,.22)';
        c3.beginPath();
        c3.moveTo(cx0 + Math.cos(rad) * (big ? 0 : R * 0.86), cy0 + Math.sin(rad) * (big ? 0 : R * 0.86));
        c3.lineTo(cx0 + Math.cos(rad) * R, cy0 + Math.sin(rad) * R);
        c3.stroke();
        if(big){
          c3.fillStyle = '#ffd27a'; c3.font = '11px monospace';
          c3.textAlign = 'center'; c3.textBaseline = 'middle';
          c3.fillText((-deg) + '°', cx0 + Math.cos(rad) * (R + 12), cy0 + Math.sin(rad) * (R + 12));
        }
      }
      c3.fillStyle = '#ff6060';
      c3.beginPath(); c3.arc(cx0, cy0, 3, 0, Math.PI * 2); c3.fill();
      c3.restore();
    })();
    out.check = cv3.toDataURL('image/png');
    out.url = fin.toDataURL('image/png');
  }catch(e){ out.err = String(e && e.message || e); }
  const v = document.createElement('div'); v.id = 'OUT';
  v.textContent = MK + btoa(unescape(encodeURIComponent(JSON.stringify(out)))) + MK;
  document.body.appendChild(v);
})();
<\/script>`;

fs.writeFileSync(path.join(tmp, 'run.html'), page);

/* ---- 回して結果を拾う ---- */
const fileUrl = 'file:///' + path.join(tmp, 'run.html').split(path.sep).join('/');
const r = spawnSync(BROWSER, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files',
  '--dump-dom', '--virtual-time-budget=180000', fileUrl], { maxBuffer: 1e9, encoding: 'utf8' });
const mm = /id="OUT">#EDADOWN#([^#]*)#EDADOWN#/.exec(r.stdout || '');
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
if (!mm) { console.error('結果を拾えなかった（ブラウザが動いていない可能性）'); process.exit(1); }
const out = JSON.parse(Buffer.from(mm[1], 'base64').toString('utf8'));
if (out.err) { console.error('しくじった: ' + out.err); process.exit(1); }

/* ---- 書き出しと報告 ---- */
const res = out.res;
const png = Buffer.from(out.url.split(',')[1], 'base64');
fs.writeFileSync('eda_' + KEY + '.png', png);
fs.writeFileSync('eda_' + KEY + '.txt', out.url);
if (out.check) fs.writeFileSync('eda_' + KEY + '_check.png',
  Buffer.from(out.check.split(',')[1], 'base64'));

console.log('元絵 ' + res.srcSize.join('x') + ' → 切り出し ' + res.cut.join('x')
  + '（x' + res.cutAt[0] + ' y' + res.cutAt[1] + ' から） → 出力 ' + res.small.join('x'));
console.log('絵の面積 ' + res.myGreen + ' → 基準 ' + res.refGreen
  + '（本体の' + refKeys.length + '枚の中央値） 倍率 ' + res.scale.toFixed(4));
console.log('置いた位置 x=' + res.at[0] + ' y=' + res.at[1] + ' ／ 画布 ' + OUTW + 'x' + OUTH);
out.note.forEach(n => console.log('  ※ ' + n));
console.log(res.from === '止めてある'
  ? '角度 自動判定は止めてある（刃と弧を取り違えるため）。目盛りつきの確認画像で目で読むこと'
  : res.from === '測れず'
  ? '角度 測れず（火花 ' + res.sparks + '画素・鎖 ' + res.chain + '画素。待機は火花がないので無視してよい）'
  : '角度 ' + res.ang.toFixed(1) + '度 （真下なら -70〜-110。' + res.from + ' '
    + (res.from === '火花' ? res.sparks : res.chain) + '画素で測った'
    + (res.from === '鎖' ? '。火花が無いので鎖で代用した' : '') + '）');
console.log('顔比（参考・揃えには使わない） ' + (res.headRatio > 0 ? res.headRatio.toFixed(3) : '測れず')
  + ' （頭の幅 ' + res.head + ' ÷ 全身の高さ ' + res.height
  + '。本体の' + refKeys.length + '枚は ' + res.refRatio[0].toFixed(3) + '〜' + res.refRatio[1].toFixed(3) + '）');
console.log('（参考）画布に載せ直したあとの足元: ' + res.foot
  + ' ／ 本体の' + refKeys.length + '枚は ' + res.refFeet[0] + '〜' + res.refFeet[1] + '。実寸で使ういまの本体では見ない値');
console.log('data URL ' + (out.url.length / 1024).toFixed(0) + 'KB → eda_' + KEY + '.txt');
console.log('半透明の明るさ ' + res.halo.toFixed(0) + '（140以下なら白残りなし。半透明 ' + res.semiN + '画素）');
console.log('EDA_FOOT.' + KEY + ' に入れる値: ' + res.srcFoot + '（元絵のままの足元。揃えはこの値と倍率の二つで行う）');
console.log('確認画像 → eda_' + KEY + '_check.png（左＝角度の目盛り／中＝本番の暗地／右＝白地）');
console.log('※ 縮小は双三次（LANCZOS ではない。この環境に画像の外部部品が無いため）');
if (res.clipped) console.log('!! 元絵が画像の縁で切れている。描き直しが要る');
