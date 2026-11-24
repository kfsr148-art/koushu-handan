# 棚 #5 の声の洗い出し（雲・466秒）

```
{
 "combos": 8864962,
 "ng": 203918,
 "slices": 126,
 "needAll": 17881,
 "simMiss": 314,
 "staticMiss": 3,
 "inVoiceM4aOut": 11,
 "make": 306,
 "kinds": {
  "chg": 293,
  "lit": 10,
  "head": 13
 },
 "chars": 8346,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  8.7,
  9.8
 ],
 "dialJson": 20267,
 "unused": 2703,
 "unusedMB": 61.4,
 "sec": 466
}
```

- 足す声 306本・8346字（読みの括弧 0・空 0）
- 大きさの見込み 8.7〜9.8MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 11本（道具は作らない）
- 今の台本 voice-advice-dial.json 20267本のうち、もう要らない名 2703本・61.4MB（unused.json・消していない）
- 次：手元で  node scratchpad/jobs/shelf5/append-dial.js  → commit・push → voice-m4a.yml を kind=dial で起こす
