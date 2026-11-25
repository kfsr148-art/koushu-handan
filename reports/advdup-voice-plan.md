# 枠 三百二十三 の声の洗い出し（雲・401秒）

```
{
 "combos": 15303321,
 "ng": 4579268,
 "slices": 126,
 "needAll": 15902,
 "simMiss": 1702,
 "staticMiss": 135,
 "inVoiceM4aOut": 8,
 "make": 1829,
 "kinds": {
  "chg": 1595,
  "head": 228,
  "lit": 93,
  "conn": 6
 },
 "chars": 64395,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  67.2,
  58.8
 ],
 "dialJson": 23184,
 "unused": 9119,
 "unusedMB": 151.3,
 "sec": 401
}
```

- 足す声 1829本・64395字（読みの括弧 0・空 0）
- 大きさの見込み 67.2〜58.8MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 8本（道具は作らない）
- 今の台本 voice-advice-dial.json 23184本のうち、もう要らない名 9119本・151.3MB（unused.json・消していない）
- 次：手元で  node scratchpad/jobs/advdup/append-dial.js  → commit・push → voice-m4a.yml を kind=dial で起こす
