const S = require('./advice-talk-sim.js'), C = require('./advice-tone-core.js');
let found = null;
try { S.each((r, c) => { if (found) return; r.items.forEach(x => { if ((x.conn || x.changed) && C.advDialVoice(x.text) === 'advy-f65076e7' && !found) { found = { text: x.text, tone: c.tone, dial: c.dial, m: c.m, sd: c.sd, omo: c.omo, k: c.k }; } }); if (found) throw new Error('FOUND'); }); } catch (e) { if (e.message !== 'FOUND') throw e; }
console.log('新しい声が要る一文:', JSON.stringify(found));
