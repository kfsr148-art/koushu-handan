# 枠 三百二十三 の声の洗い出し（雲・656秒）

```
{
 "combos": 15298488,
 "ng": 4750968,
 "slices": 126,
 "needAll": 15664,
 "simMiss": 1363,
 "staticMiss": 103,
 "inVoiceM4aOut": 8,
 "make": 1458,
 "kinds": {
  "chg": 1275,
  "head": 178,
  "lit": 75,
  "conn": 5
 },
 "chars": 52847,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  55.2,
  46.8
 ],
 "dialJson": 23184,
 "unused": 8986,
 "unusedMB": 148.5,
 "sec": 656
}
```

- 足す声 1458本・52847字（読みの括弧 0・空 0）
- 大きさの見込み 55.2〜46.8MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 8本（道具は作らない）
- 今の台本 voice-advice-dial.json 23184本のうち、もう要らない名 8986本・148.5MB（unused.json・消していない）
- 次：手元で  node scratchpad/jobs/advdup/append-dial.js  → commit・push → voice-m4a.yml を kind=dial で起こす
