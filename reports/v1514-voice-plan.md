# v1514 の声の洗い出し（雲・332秒）

```
{
 "combos": 2666678,
 "ng": 84424,
 "slices": 63,
 "simMiss": 662,
 "staticMiss": 0,
 "inVoiceM4aOut": 10,
 "make": 652,
 "kinds": {
  "chg": 652
 },
 "chars": 14378,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  15,
  20.9
 ],
 "ref": {
  "miss1514": 625,
  "inThis": 615,
  "inRoot": 0
 },
 "sec": 332
}
```

- 足す声 652本・14378字（読みの括弧 0・空 0）
- 大きさの見込み 15.0〜20.9MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 10本（道具は作らない）
- 次：手元で  node scratchpad/jobs/v1514/append-dial.js  → commit・push → gh workflow run voice-m4a.yml -f kind=dial
