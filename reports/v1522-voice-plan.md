# v1522 の声の洗い出し（雲・0秒）

```
{
 "combos": 3748598,
 "ng": 119816,
 "slices": 63,
 "simMiss": 188,
 "staticMiss": 0,
 "inVoiceM4aOut": 10,
 "make": 0,
 "kinds": {},
 "chars": 0,
 "paren": 0,
 "empty": 0,
 "sizeMB": [
  0,
  0
 ],
 "ref": null,
 "sec": 0
}
```

- 足す声 0本・0字（読みの括弧 0・空 0）
- 大きさの見込み 0.0〜0.0MB（字あたり 1,095バイト／1本 32.9KB）
- reports/voice-m4a-out に在って直下に無い物 10本（道具は作らない）
- 次：手元で  node scratchpad/jobs/v1522/append-dial.js  → commit・push → gh workflow run voice-m4a.yml -f kind=dial
