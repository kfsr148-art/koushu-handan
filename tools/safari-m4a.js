#!/usr/bin/env node
/* tools/safari-m4a.js — 公開ページの m4a の声が Safari（WebKit）で鳴る（復号できる）かを確かめる（2026-11-18・y1118-1440 の枠）
   ＊雲（safari-m4a.yml・macOS）で回す。実機の iPhone ではなく、同じ WebKit の復号（Web Audio の decodeAudioData）で確かめる。
   ＊公開ページの同じ道（https://…github.io/koushu-handan/）から m4a を取り、本体の advDecodeM4a と同じ読み方（OfflineAudioContext 24kHz）で復号し、長さ・音量を出す。
   ＊標本：方言の声・部品の声・場面の声の合わせて数十本。一本でも復号できない・無音なら exit 1。 */
'use strict';
const { webkit } = require('playwright');
const BASE = process.env.BASE || 'https://kfsr148-art.github.io/koushu-handan/';
const NAMES = (process.env.NAMES || '').split(',').filter(Boolean);
(async () => {
  const br = await webkit.launch();
  const pg = await br.newPage();
  await pg.goto(BASE + 'ver.txt');
  const ver = await pg.evaluate(() => document.body.innerText.trim());
  console.log('公開の版 ver.txt =', ver, '／WebKit', br.version());
  const res = await pg.evaluate(async (names) => {
    const AC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const out = [];
    for (const n of names) {
      try {
        const r = await fetch(n + '.m4a');
        if (!r.ok) { out.push({ n, ok: false, why: 'HTTP ' + r.status }); continue; }
        const ab = await r.arrayBuffer();
        const ctx = new AC(1, 1, 24000);
        const buf = await new Promise((ok, ng) => { const p = ctx.decodeAudioData(ab, ok, ng); if (p && p.catch) p.catch(ng); });
        const f = buf.getChannelData(0); let s = 0, pk = 0;
        for (let i = 0; i < f.length; i++) { s += f[i] * f[i]; if (Math.abs(f[i]) > pk) pk = Math.abs(f[i]); }
        out.push({ n, ok: true, sec: +buf.duration.toFixed(2), rate: buf.sampleRate, rms: +Math.sqrt(s / f.length).toFixed(4), peak: +pk.toFixed(3), bytes: ab.byteLength });
      } catch (e) { out.push({ n, ok: false, why: String(e && e.message || e) }); }
    }
    return out;
  }, NAMES);
  let bad = 0;
  res.forEach(r => { console.log((r.ok && r.rms > 0.005 ? 'OK ' : 'NG ') + JSON.stringify(r)); if (!(r.ok && r.rms > 0.005)) bad++; });
  console.log('標本', res.length, '本／鳴らない', bad, '本');
  await br.close();
  process.exit(bad ? 1 : 0);
})().catch(e => { console.error('落ちた', e); process.exit(1); });
