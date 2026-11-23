# v1522 の声の洗い出し（雲・757秒）

```
{
 "combos": 3748598,
 "ng": 119816,
 "slices": 63,
 "simMiss": 188,
 "staticMiss": 0,
 "inVoiceM4aOut": 10,
 "make": 178,
 "kinds": {
  "chg": 178
 },
 "chars": 4699,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  4.9,
  5.7
 ],
 "ref": null,
 "sec": 757
}
```

- 足す声 178本・4699字（読みの括弧 0・空 0）
- 大きさの見込み 4.9〜5.7MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 10本（道具は作らない）
- 次：手元で  node scratchpad/jobs/v1522/append-dial.js  → commit・push → gh workflow run voice-m4a.yml -f kind=dial
