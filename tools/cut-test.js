#!/usr/bin/env node
/* cut-test.js（--truth で正しい境目で切った時の当たり数＝見分けの側の限り） — 牌の切り分け（ssWarpCuts）を作り写真の束で測る（2026-11-27・枠 四百七）。本体の写しに probe を差し込んで headless の Edge／Chrome で回す（作法14）。
   使い方：node tools/cut-test.js <本体の html>
   束：34種の牌を字と丸と棒で描き、13枚を細い隙間（影の線）で並べる。条件ごとに30枚。条件＝端がぴったり／右端の牌の側面が帯に入る（幅が牌の0.3・0.6・0.9枚分）／左に0.2枚分の余り／側面あり＋暗い／牌の幅がばらつく。
   見本は端も隙間も無い一枚ずつの絵から作る。数えるのは牌の位置（左から1〜13）ごとの読みの当たり数。 */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const html = fs.readFileSync(path.resolve(process.argv[2] || 'koushu-handan.html'), 'utf8');
const probe = `
window.addEventListener('load', function(){ setTimeout(function(){
 var res = {};
 try {
  var keys = []; ['m','p','s'].forEach(function(s){ for(var n=1;n<=9;n++) keys.push(s+n); }); ['E','S','W','N','P','F','C'].forEach(function(k){ keys.push(k); });
  var KJ = '一二三四五六七八九', HJ = {E:'東',S:'南',W:'西',N:'北',P:'',F:'發',C:'中'};
  var seed = 7; function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function face(g, x, w, h, key, base){
    g.fillStyle = 'rgb(' + base + ',' + base + ',' + (base - 6) + ')'; g.fillRect(x, 0, w, h);
    var s = key.charAt(0), n = +key.slice(1);
    if(s === 'm'){ g.fillStyle = '#1b1b25'; g.font = 'bold ' + Math.round(w*0.7) + 'px serif'; g.textAlign = 'center'; g.fillText(KJ[n-1], x+w/2, h*0.42); g.fillStyle = '#a3201c'; g.fillText('萬', x+w/2, h*0.86); }
    else if(s === 'p' || s === 's'){
      var L = {1:[[.5,.5]],2:[[.5,.28],[.5,.72]],3:[[.22,.22],[.5,.5],[.78,.78]],4:[[.27,.28],[.73,.28],[.27,.72],[.73,.72]],5:[[.27,.24],[.73,.24],[.5,.5],[.27,.76],[.73,.76]],6:[[.28,.22],[.72,.22],[.28,.53],[.72,.53],[.28,.8],[.72,.8]],7:[[.2,.16],[.5,.24],[.8,.32],[.28,.6],[.72,.6],[.28,.83],[.72,.83]],8:[[.28,.16],[.72,.16],[.28,.39],[.72,.39],[.28,.62],[.72,.62],[.28,.85],[.72,.85]],9:[[.2,.2],[.5,.2],[.8,.2],[.2,.5],[.5,.5],[.8,.5],[.2,.8],[.5,.8],[.8,.8]]}[n];
      L.forEach(function(p, i){ g.fillStyle = (i%3===1) ? '#a3201c' : (s==='p' ? '#173a7a' : '#14672f'); if(s==='p'){ g.beginPath(); g.arc(x+p[0]*w, p[1]*h, w*(n===1?0.36:0.14), 0, 7); g.fill(); } else { g.fillRect(x+p[0]*w-w*0.07, p[1]*h-h*0.09, w*0.14, h*0.18); } });
    } else if(HJ[key]){ g.fillStyle = key==='F' ? '#14672f' : (key==='C' ? '#a3201c' : '#15151d'); g.font = 'bold ' + Math.round(w*0.82) + 'px serif'; g.textAlign = 'center'; g.fillText(HJ[key], x+w/2, h*0.68); }
    else { g.strokeStyle = '#8f9bb0'; g.lineWidth = 3; g.strokeRect(x+w*0.18, h*0.16, w*0.64, h*0.68); }
  }
  window.__truth = TRUTHFLAG; var TW = 100, TH = 140, tpl = {};
  keys.forEach(function(k){ var c = document.createElement('canvas'); c.width = TW; c.height = TH; face(c.getContext('2d'), 0, TW, TH, k, 232); tpl[k] = window.ssTileFeature(c, {sx:0,sy:0,sw:TW,sh:TH}); });
  var tplN = window.ssNormTpl(tpl, keys);
  var conds = [['端がぴったり',0,0,232,1],['右に側面0.3枚',0,0.3,232,1],['右に側面0.6枚',0,0.6,232,1],['右に側面0.9枚',0,0.9,232,1],['左に余り0.2枚',0.2,0,232,1],['側面0.6枚で暗い',0,0.6,185,1],['幅がばらつく',0,0.3,232,5]];
  conds.forEach(function(cd){
    seed = 11; var hit = [0,0,0,0,0,0,0,0,0,0,0,0,0], err = 0, N = 30;
    for(var t = 0; t < N; t++){
      var hand = []; for(var i=0;i<13;i++) hand.push(keys[Math.floor(rnd()*keys.length)]);
      var ws = hand.map(function(){ return TW + Math.round((rnd()-0.5)*2*cd[4]); });
      var left = Math.round(cd[1]*TW), right = Math.round(cd[2]*TW), x = left, truth = [];
      var W = left + ws.reduce(function(a,b){return a+b;},0) + 3*12 + (right ? 3 + right : 0);
      var c = document.createElement('canvas'); c.width = W; c.height = TH; var g = c.getContext('2d');
      g.fillStyle = '#2f5a45'; g.fillRect(0,0,W,TH);
      for(i=0;i<13;i++){ face(g, x, ws[i], TH, hand[i], cd[3]); truth.push([x, ws[i]]); x += ws[i]; if(i<12){ g.fillStyle = '#6d6a60'; g.fillRect(x,0,3,TH); x += 3; } }
      if(right){ g.fillStyle = '#6d6a60'; g.fillRect(x,0,3,TH); x += 3; g.fillStyle = 'rgb(' + (cd[3]-14) + ',' + (cd[3]-18) + ',' + (cd[3]-30) + ')'; g.fillRect(x,0,right,TH); }
      var id = g.getImageData(0,0,W,TH), o = id.data;
      for(i=0;i<o.length;i+=4){ var nz = Math.round((rnd()-0.5)*8); o[i]+=nz; o[i+1]+=nz; o[i+2]+=nz; }
      g.putImageData(id,0,0);
      var cuts = window.__truth ? truth.map(function(q){ return {sx:q[0]-1.5,sy:0,sw:q[1]+3,sh:TH}; }) : window.ssWarpCuts(g.getImageData(0,0,W,TH).data, W, TH);
      cuts.forEach(function(cu, k){ var m = window.ssMatchTile(window.ssFeatShape(window.ssNormFeat(window.ssTileFeature(c, cu))), tplN, keys); if(m.key === hand[k]) hit[k]++; if(k>0) err = Math.max(err, Math.abs(cu.sx - (truth[k][0]-1.5))); });
    }
    res[cd[0]] = { hit: hit, n: N, maxErr: Math.round(err) };
  });
 } catch(e){ res = { err: String(e && e.stack || e) }; }
 var d = document.createElement('div'); d.textContent = 'KHCT' + btoa(unescape(encodeURIComponent(JSON.stringify(res)))) + 'KHCTE'; document.body.appendChild(d);
}, 600); });
`;
const mark = 'window.shuffleHand = shuffleHand;';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'koushu-cut-')), f = path.join(tmp, 'p.html');
fs.writeFileSync(f, html.replace(mark, () => mark + probe.replace('TRUTHFLAG', process.argv.indexOf('--truth') >= 0 ? 'true' : 'false')));
const br = [process.env['ProgramFiles(x86)'] + '/Microsoft/Edge/Application/msedge.exe', process.env.ProgramFiles + '/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome'].find(x => fs.existsSync(x));
const r = cp.spawnSync(br, ['--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio', '--user-data-dir=' + path.join(tmp, 'prof'), '--virtual-time-budget=100000', '--dump-dom', 'file:///' + f.split(String.fromCharCode(92)).join('/')], { encoding: 'utf8', timeout: 150000, killSignal: 'SIGKILL', maxBuffer: 1 << 28 });
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { }
const m = /KHCT([A-Za-z0-9+/=]+)KHCTE/.exec(r.stdout || '');
if (!m) { console.log('結果を取り出せない'); process.exit(3); }
const res = JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'));
if (res.err) { console.log(res.err); process.exit(4); }
const sum = [0,0,0,0,0,0,0,0,0,0,0,0,0]; let total = 0, all = 0;
console.log('条件（各30枚）  位置1〜13の当たり数／境目の最大のずれ(px・牌の幅100)');
Object.keys(res).forEach(k => { const v = res[k]; v.hit.forEach((h, i) => { sum[i] += h; total += h; }); all += v.n * 13; console.log(k + '  ' + v.hit.join(' ') + '  ずれ' + v.maxErr); });
console.log('合わせ（位置ごと・各' + Object.keys(res).length * 30 + '）  ' + sum.join(' ') + '  計 ' + total + '/' + all);
