# 枠 三百二十三 の声の洗い出し（雲・976秒）

```
{
 "combos": 15302496,
 "ng": 4602544,
 "slices": 126,
 "needAll": 15894,
 "simMiss": 1698,
 "staticMiss": 135,
 "inVoiceM4aOut": 8,
 "make": 1825,
 "kinds": {
  "chg": 1591,
  "head": 228,
  "lit": 93,
  "conn": 6
 },
 "chars": 64306,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  67.2,
  58.6
 ],
 "dialJson": 23184,
 "unused": 9123,
 "unusedMB": 151.3,
 "sec": 976
}
```

- 足す声 1825本・64306字（読みの括弧 0・空 0）
- 大きさの見込み 67.2〜58.6MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 8本（道具は作らない）
- 今の台本 voice-advice-dial.json 23184本のうち、もう要らない名 9123本・151.3MB（unused.json・消していない）
- 次：手元で  node scratchpad/jobs/advdup/append-dial.js  → commit・push → voice-m4a.yml を kind=dial で起こす
