const fs=require('fs'),os=require('os'),p=require('path'),cp=require('child_process');
const D=fs.mkdtempSync(p.join(os.tmpdir(),'koushu-rw-'));
fs.writeFileSync(p.join(D,'inbox.txt'),'');fs.writeFileSync(p.join(D,'busy.txt'),JSON.stringify({ev:'Stop',evAt:1,turnAt:0}));
const SRC=process.env.HOME_RW;
const env=Object.assign({},process.env,{REWAKE_DIR:D,REWAKE_POLL_MS:'200',REWAKE_BELL_GAP_SEC:'4',REWAKE_QPOLL_MS:'99999999',REWAKE_LIMIT_SEC:'60'});
function ts(){const d=new Date(),q=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+q(d.getMonth()+1)+'-'+q(d.getDate())+' '+q(d.getHours())+':'+q(d.getMinutes())+':'+q(d.getSeconds());}
function spawnRw(){const c=cp.spawn(process.execPath,[SRC],{env,stdio:['ignore','pipe','pipe']});const o={out:'',err:'',code:null,t:Date.now()};c.stderr.on('data',d=>o.err+=d);c.on('exit',x=>{o.code=x;o.end=Date.now();});return o;}
const bell=(n)=>fs.appendFileSync(p.join(D,'inbox.txt'),'[ ] '+ts()+'  橋（合図 '+n+'）：センコが橋の文書に枠を書いた合図\n');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const A=spawnRw();await sleep(800);bell('A');await sleep(2500);
 console.log('A: code',A.code,'(期待2)');
 const B=spawnRw();await sleep(800);bell('B');await sleep(300);bell('C');
 await sleep(1500);console.log('B 間の中: code',B.code,'(期待 null＝積んで待つ)');
 await sleep(4500);console.log('B 間の後: code',B.code,'(期待2)','2件まとめ:',/合図 B/.test(B.err)&&/合図 C/.test(B.err),'件数表示:',(B.err.match(/（([0-9]+)件）/)||[])[1]);
 console.log(fs.readFileSync(p.join(D,'rewake.log'),'utf8').split('\n').filter(l=>/積んでおく|起こした/.test(l)).map(l=>l.slice(0,110)).join('\n'));
 try{B.code===null&&process.kill(0);}catch(e){}
 fs.rmSync(D,{recursive:true,force:true});process.exit(0);
})();
