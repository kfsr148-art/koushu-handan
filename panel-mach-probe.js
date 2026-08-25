#!/usr/bin/env node
/* 返事パネル v32 の二つを確かめる — 機械が測った様子の一行と、写した札の「届いた」印
 *
 * panel.html を手元で開き、usage.json / state.json / notices.json への取得を捕まえて
 * こちらで組んだ値を返す。公開物には触れない。
 *
 *   node panel-mach-probe.js
 */
'use strict';
const path = require('path');
const PW_DIR = process.env.PW_DIR || 'C:/Users/user/.claude/tools/pw/node_modules';
const playwright = require(path.join(PW_DIR, 'playwright'));
const PANEL = 'file:///' + path.join(__dirname, 'panel.html').replace(/\\/g, '/');

const now = Math.floor(Date.now() / 1000);
const hhmmss = t => new Date(t * 1000).toTimeString().slice(0, 8);
const stamp = t => {
  const d = new Date(t * 1000), p = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
         ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
};

/* 知らせは二件。片方は「写した刻が resume より前」（届いたはず）、
   もう片方は「写した刻が resume より後」（まだ届いていない）。 */
const N1 = { time: now - 3600, title: '🙋 ヨシしてください', message: '古いほうの知らせ' };
const N2 = { time: now - 1800, title: '✅ 終わりました（返事不要）', message: '新しいほうの知らせ' };
const NOTICES = JSON.stringify([N1, N2]);
const STATE = JSON.stringify({ at: now, stat: '作業中', subj: '試しの件名' });

const mkUsage = watch => JSON.stringify({
  at: stamp(now), http: 200, watch,
  body: { limits: [{ kind: 'session', percent: 41 }] },
});

const BASE = { at: stamp(now - 120), claude: 1, windows: 1, stateSrc: 'note', cpu: 4.2, noteAt: stamp(now - 300) };

const CASES = [
  { name: '動いている（控えと一致）',
    watch: { ...BASE, state: '作業中', lastResume: stamp(now - 300), lastStop: stamp(now - 900) } },
  { name: '止まっている（控えと一致）',
    watch: { ...BASE, state: 'ヨシ待ち', lastStop: stamp(now - 300), lastResume: stamp(now - 900) } },
  { name: '食い違い（機械は止・控えは作業中）',
    watch: { ...BASE, state: '作業中', lastStop: stamp(now - 300), lastResume: stamp(now - 900) } },
  { name: '食い違い（機械は動・控えはヨシ待ち）',
    watch: { ...BASE, state: 'ヨシ待ち', lastResume: stamp(now - 300), lastStop: stamp(now - 900) } },
  { name: '刻が読めない（何も出さない）',
    watch: { ...BASE, state: '作業中', lastResume: null, lastStop: null } },
  { name: 'watch そのものが無い（何も出さない）', watch: null },
  { name: 'cpu が null（CPU の欄だけ落ちる）',
    watch: { ...BASE, cpu: null, state: '作業中', lastResume: stamp(now - 300), lastStop: stamp(now - 900) } },
];

async function run() {
  const browser = await playwright.webkit.launch();
  console.log('');
  console.log('── ① 機械が測った様子の一行 ──');
  for (const c of CASES) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ja-JP' });
    const page = await ctx.newPage();
    await route(page, mkUsage(c.watch));
    await page.goto(PANEL, { waitUntil: 'load' });
    await page.waitForTimeout(2200);
    const r = await page.evaluate(() => {
      const e = document.getElementById('machLine');
      return { cls: e ? e.className : '-', txt: (e ? e.innerText : '').replace(/\s+/g, ' ').trim() };
    });
    console.log('  ' + c.name.padEnd(28) + ' 札=' + r.cls.padEnd(11) + ' 字=' + (r.txt || '（出さない）'));
    await ctx.close();
  }

  console.log('');
  console.log('── ② 写した札の「届いた」印 ──');
  const resumeAt = now - 600;                       // 10分前に再開が鳴った
  const watch = { ...BASE, state: '作業中', lastResume: stamp(resumeAt), lastStop: stamp(now - 1200) };
  const MARKS = [
    { name: '写したのが再開より前（届いたはず）', c1: now - 900,  c2: now - 900 },
    { name: '写したのが再開より後（まだ）',       c1: now - 300,  c2: now - 300 },
    { name: '片方だけ前',                         c1: now - 900,  c2: now - 300 },
    { name: '古い印（刻を控えていない＝1）',       c1: 1,          c2: 1 },
  ];
  for (const m of MARKS) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ja-JP' });
    const page = await ctx.newPage();
    await route(page, mkUsage(watch));
    /* 端末の中の「写した印」を先に仕込む。鍵は 時刻|題。 */
    await ctx.addInitScript(([a, b]) => {
      try { localStorage.setItem('kh-panel-copied', JSON.stringify({ [a[0]]: a[1], [b[0]]: b[1] })); } catch (e) {}
    }, [[`${N1.time}|${N1.title}`, m.c1], [`${N2.time}|${N2.title}`, m.c2]]);
    await page.goto(PANEL, { waitUntil: 'load' });
    await page.waitForTimeout(2200);
    const r = await page.evaluate(() => {
      const h = document.getElementById('copiedHead');
      const ul = document.getElementById('copiedList');
      const box = document.getElementById('copiedBox');
      return {
        box: box ? box.className : '-',
        head: h ? (h.textContent || '').trim() : '',
        got: ul ? ul.querySelectorAll('.got').length : -1,
        list: document.getElementById('list').children.length,
      };
    });
    console.log('  ' + m.name.padEnd(30) + ' 見出し=' + (r.head || '（出さない）').padEnd(26) +
                ' 届いた印=' + r.got + '件  上の一覧=' + r.list + '件');
    await ctx.close();
  }
  await browser.close();
  console.log('');
}

async function route(page, usage) {
  await page.route(/(usage|state|notices)\.json/, r => {
    const u = r.request().url();
    const body = /usage/.test(u) ? usage : (/state/.test(u) ? STATE : NOTICES);
    r.fulfill({ status: 200, contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' }, body });
  });
  await page.route(/ver\.txt|panel-ver\.txt/, r =>
    r.fulfill({ status: 200, contentType: 'text/plain',
      headers: { 'access-control-allow-origin': '*' }, body: '32' }));
}

run().catch(e => { console.error(e); process.exit(2); });
