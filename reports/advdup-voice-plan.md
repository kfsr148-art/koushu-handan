# 枠 三百二十三 の声の洗い出し（雲・613秒）

```
{
 "combos": 24561346,
 "ng": 5460610,
 "slices": 126,
 "needAll": 21741,
 "simMiss": 4681,
 "staticMiss": 135,
 "inVoiceM4aOut": 16,
 "make": 4800,
 "kinds": {
  "chg": 4566,
  "head": 228,
  "lit": 93,
  "conn": 6
 },
 "chars": 173257,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  180.9,
  154.2
 ],
 "dialJson": 23184,
 "unused": 6259,
 "unusedMB": 106.3,
 "sec": 613
}
```

- 足す声 4800本・173257字（読みの括弧 0・空 0）
- 大きさの見込み 180.9〜154.2MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 16本（道具は作らない）
- 今の台本 voice-advice-dial.json 23184本のうち、もう要らない名 6259本・106.3MB（unused.json・消していない）
- 次：手元で  node scratchpad/jobs/advdup/append-dial.js  → commit・push → voice-m4a.yml を kind=dial で起こす
