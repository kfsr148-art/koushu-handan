# 棚 #5 の声の洗い出し（雲・569秒）

```
{
 "combos": 10011436,
 "ng": 312160,
 "slices": 126,
 "needAll": 18685,
 "simMiss": 328,
 "staticMiss": 3,
 "inVoiceM4aOut": 16,
 "make": 315,
 "kinds": {
  "lit": 154,
  "omo": 154,
  "chg": 156,
  "conn": 2,
  "head": 3
 },
 "chars": 7221,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  7.5,
  10.1
 ],
 "dialJson": 21216,
 "unused": 2862,
 "unusedMB": 66.9,
 "sec": 569
}
```

- 足す声 315本・7221字（読みの括弧 0・空 0）
- 大きさの見込み 7.5〜10.1MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 16本（道具は作らない）
- 今の台本 voice-advice-dial.json 21216本のうち、もう要らない名 2862本・66.9MB（unused.json・消していない）
- 次：手元で  node scratchpad/jobs/shelf5/append-dial.js  → commit・push → voice-m4a.yml を kind=dial で起こす
