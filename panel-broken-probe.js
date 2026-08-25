#!/usr/bin/env node
/* 読む側の壊れ方を見る — 返事パネルに壊れた JSON を食わせる
 *
 * panel.html を手元で開き、usage.json / notices.json / state.json への取得を
 * 途中で捕まえて、書きかけ・空・型違い・HTML の誤りページを返す。
 * そのうえで画面がどうなったか（真っ白か／古い値を新しい値として見せるか）を読む。
 *
 * 公開物には一切触らない。捕まえるのは、この一回のページの中だけ。
 *
 *   node panel-broken-probe.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const PW_DIR = process.env.PW_DIR || 'C:/Users/user/.claude/tools/pw/node_modules';
const playwright = require(path.join(PW_DIR, 'playwright'));

const ROOT = __dirname;
const PANEL = 'file:///' + path.join(ROOT, 'panel.html').replace(/\\/g, '/');

const OK_USAGE = JSON.stringify({
  at: Math.floor(Date.now() / 1000),
  body: { limits: [
    { kind: 'session', percent: 41 },
    { kind: 'weekly_all', percent: 9 },
    { kind: 'weekly_scoped', percent: 4, scope: { model: { display_name: 'Fable' } } },
  ] },
});
const OK_STATE = JSON.stringify({ at: Math.floor(Date.now() / 1000), stat: '作業中', subj: '正しい件名' });
const OK_NOTICES = JSON.stringify([
  { time: Math.floor(Date.now() / 1000), title: '🙋 ヨシしてください', body: '正しい知らせ' },
]);

/* 壊し方。name はまとめに出る名。 */
const BREAKS = [
  { name: '書きかけ（途中で切れた JSON）', make: s => s.slice(0, Math.floor(s.length * 0.6)) },
  { name: '空ファイル（0バイト）',        make: () => '' },
  { name: '空白だけ',                     make: () => '   \n' },
  { name: '型違い（配列のはずが物／物のはずが配列）', make: s => (s[0] === '[' ? '{"a":1}' : '[1,2,3]') },
  { name: 'HTML の誤りページ',            make: () => '<!DOCTYPE html><html><body>404 Not Found</body></html>' },
  { name: 'NaN 入り（JSON にならない字）', make: s => s.replace(/:\s*\d+/, ': NaN') },
];

const TARGETS = [
  { key: 'usage',   match: /usage\.json/,   good: OK_USAGE,
    read: () => {
      const box = document.getElementById('usageTag');
      const hid = !box || box.hidden;
      return { 出ている: !hid, 字: hid ? '' : (box.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) };
    } },
  { key: 'state',   match: /state\.json/,   good: OK_STATE,
    read: () => {
      const st = document.getElementById('stat');
      return { 字: (st ? st.textContent : '').replace(/\s+/g, ' ').trim().slice(0, 70) };
    } },
  { key: 'notices', match: /notices\.json/, good: OK_NOTICES,
    read: () => {
      const ul = document.getElementById('list');
      return { 件数: ul ? ul.children.length : -1,
               字: (ul ? ul.textContent : '').replace(/\s+/g, ' ').trim().slice(0, 70) };
    } },
];

/* 画面が丸ごと落ちていないかの物差し。文字が消えたら「真っ白」。 */
const PAGE_ALIVE = () => ({
  本文の字数: (document.body.innerText || '').replace(/\s+/g, '').length,
  版の字: (document.getElementById('verTag') || {}).textContent || '',
});

async function run() {
  const browser = await playwright.webkit.launch();
  const rows = [];

  for (const t of TARGETS) {
    for (const b of BREAKS) {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 }, locale: 'ja-JP', timezoneId: 'Asia/Tokyo',
      });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', e => errs.push(String(e.message || e).slice(0, 90)));

      /* 三つとも捕まえる。狙った一つだけ壊し、残りは正しい中身を返す。 */
      await page.route(/(usage|state|notices)\.json/, route => {
        const url = route.request().url();
        const me = TARGETS.filter(x => x.match.test(url))[0];
        const body = (me && me.key === t.key) ? b.make(me.good) : (me ? me.good : '{}');
        route.fulfill({
          status: 200, contentType: 'application/json; charset=utf-8',
          headers: { 'access-control-allow-origin': '*' }, body,
        });
      });
      /* 版と stable は今回の見どころではないので、当たり障りのない値で返す。 */
      await page.route(/ver\.txt|panel-ver\.txt/, route =>
        route.fulfill({ status: 200, contentType: 'text/plain',
          headers: { 'access-control-allow-origin': '*' }, body: '30' }));

      let state = { エラー: 'ページが開かなかった' };
      try {
        await page.goto(PANEL, { waitUntil: 'load', timeout: 20000 });
        await page.waitForTimeout(2500);
        state = { ...(await page.evaluate(PAGE_ALIVE)), ...(await page.evaluate(t.read)) };
      } catch (e) { state = { エラー: String(e.message || e).slice(0, 80) }; }

      rows.push({ 対象: t.key, 壊し方: b.name, ...state, 例外: errs.slice(0, 1)[0] || '' });
      await ctx.close();
    }
  }

  /* 比べる相手。三つとも正しいときの姿。 */
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ja-JP' });
    const page = await ctx.newPage();
    await page.route(/(usage|state|notices)\.json/, route => {
      const url = route.request().url();
      const me = TARGETS.filter(x => x.match.test(url))[0];
      route.fulfill({ status: 200, contentType: 'application/json; charset=utf-8',
        headers: { 'access-control-allow-origin': '*' }, body: me ? me.good : '{}' });
    });
    await page.route(/ver\.txt|panel-ver\.txt/, route =>
      route.fulfill({ status: 200, contentType: 'text/plain',
        headers: { 'access-control-allow-origin': '*' }, body: '30' }));
    await page.goto(PANEL, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(2500);
    const base = { ...(await page.evaluate(PAGE_ALIVE)) };
    for (const t of TARGETS) Object.assign(base, await page.evaluate(t.read));
    rows.unshift({ 対象: '（正しいとき）', 壊し方: '—', ...base, 例外: '' });
    await ctx.close();
  }

  await browser.close();

  const out = path.join(ROOT, 'shots', 'panel-broken.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(rows, null, 2) + '\n', 'utf8');

  console.log('');
  rows.forEach(r => {
    console.log('── ' + r.対象 + ' ／ ' + r.壊し方);
    console.log('   本文の字数 ' + (r.本文の字数 === undefined ? '（読めず）' : r.本文の字数) +
                '  版 ' + (r.版の字 || '—'));
    ['出ている', '件数', '字'].forEach(k => { if (r[k] !== undefined && r[k] !== '') console.log('   ' + k + ' : ' + r[k]); });
    if (r.例外) console.log('   ページの例外 : ' + r.例外);
    if (r.エラー) console.log('   ★ ' + r.エラー);
  });
  console.log('');
  console.log('控え: shots/panel-broken.json');
}

run().catch(e => { console.error(e); process.exit(2); });
