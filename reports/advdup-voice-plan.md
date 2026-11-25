# 枠 三百二十三 の声の洗い出し（雲・740秒）

```
{
 "combos": 24567997,
 "ng": 5449331,
 "slices": 126,
 "needAll": 21822,
 "simMiss": 203,
 "staticMiss": 0,
 "inVoiceM4aOut": 16,
 "make": 187,
 "kinds": {
  "chg": 187
 },
 "chars": 6467,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  6.8,
  6
 ],
 "dialJson": 23184,
 "unused": 6318,
 "unusedMB": 107.6,
 "sec": 740
}
```

- 足す声 187本・6467字（読みの括弧 0・空 0）
- 大きさの見込み 6.8〜6.0MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 16本（道具は作らない）
- 今の台本 voice-advice-dial.json 23184本のうち、もう要らない名 6318本・107.6MB（unused.json・消していない）
- 次：手元で  node scratchpad/jobs/advdup/append-dial.js  → commit・push → voice-m4a.yml を kind=dial で起こす
