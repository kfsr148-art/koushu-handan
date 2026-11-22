# 枠 百三十一（下請け）：枠 百二の「大3　呼ぶかは窓まかせ・機械の文言は手書きを指示している」の直し案

状態：終わり（下請け・読むだけ。台本・本体・CLAUDE.md・git・雲には触れていない。書いたのはこの報告1本） — 18:24

## 結論（三行）
- **大3 は半分直っている。** 窓は今日 17:06 から区切りごとに job-sync.js を呼んでいる（job-sync.log）し、作法45 と stop-steps.js 95行は job-sync の呼び方に替わった。**残りは文言 10 か所**（stop-steps.js 54／rewake.js 55・58・61／frame-in.ps1 28／chain-next.sh 15／inbox-watch.ps1 2114・2263・2493・351／stop-guard.ps1 104・162・172・180／kumo-wait.ps1 601・606）と、作法25・39①・44 一の3・4 の字。
- **今日出た三つの穴は、どれも「起こす手（rewake.js）と橋を読む手（bridge-pick.js）に機械の仕事を寄せる」のが筋。** 推す案＝①橋を読む一手（bridge-pick.js に `--stamp`）が台帳の行もその場で結ぶ／②③待ち手（rewake.js）が「札がまだ出ていない」間は合図で起こさず、札が出たら自分で起こす（窓が時計の待ちを立てる手を無くす）。
- **止まりの関門（Stop の hook）に寄せる案は採らない方がよい。** 今日 16:00〜18:20 の止まり 23 回は全部 `stop_hook_active が真` で stop-steps.js が回っていない（stop-gate.log）。起こしの鎖の中では、止まりの関門も、そこに書いた文言も働かない。見込みは全部で **約135分**（四つの枠に割る・下の五）。

読んだ物：reports/y1122-1040-jobsync-review.md／`~/.claude` の stop-steps.js・rewake.js・frame-in.ps1・chain-next.sh・inbox-watch.ps1（該当の所）・stop-guard.ps1・kumo-wait.ps1（該当の所）・job-sync.js・bridge-ledger.js・bridge-pick.js・stop-gate.js／job-sync.log・rewake.log・stop-steps.log・stop-gate.log・ledger-close.log・orders-open.tsv・inbox.txt・job-steps.txt・work-note.txt／CLAUDE.md 作法25・39・44・45。

## 一、報告が挙げた文言の行は、いま当たっているか

行番号は今のファイルの番号（報告の番号からずれた物は「旧」を添えた）。

| # | 所 | 今の字（要る所だけ） | 判定 |
|---|---|---|---|
| 1 | stop-steps.js **54**（旧41） | 「済んだ段は [x]、雲待ちは [雲]、本人の決め待ちは [決] に書き替える」 | **当たっている** |
| 2 | stop-steps.js 95（順番待ちの block） | 「着手する時は node ~/.claude/job-sync.js frame-in で件名・段・枠を同じ手で書き替える」 | **直っている**（枠 百二十四）。ただし「済んだ行・当たらない行は台帳を閉じる」は閉じ方を言っていない |
| 3 | rewake.js **55** | 「済んだら ~/.claude/inbox.txt の行頭の [ ] を [x] にしてください」 | **当たっている**（今日 18:12・18:13・18:15 もこの字で起こしている＝rewake.log） |
| 4 | rewake.js **58** | 「~/.claude/job-steps.txt の残りの段を続けてください」 | 軽く当たる（手書きは言っていないが、job-sync の名が無い） |
| 5 | rewake.js **61** | 「~/.claude/job-steps.txt の [雲] を済みにして、残りの段を続ける」 | **当たっている** |
| 6 | frame-in.ps1 **28** | 「控え work-note.txt の「枠:」にこの刻をそのまま写す。後で着手する枠は job-steps.txt の積む行にも写し…」 | **当たっている**（前の仕事に段を足す形＝⑤総段 7→13 をそのまま勧めている） |
| 7 | chain-next.sh **15** | 「始める前に job-steps.txt と work-note.txt を新しい仕事で書き直し」 | 当たっているが**使われていない**（frame-queue.txt は 11-20 20:46 から 0 バイト）。後回しでよい |
| 8 | inbox-watch.ps1 **2114**（旧2112・使用量のリセットの行） | 「済んだらこの行を [x] にする」 | **当たっている** |
| 9 | inbox-watch.ps1 **2493**（旧2491・時間切れの戻し） | 「work-note.txt（札）と台帳 orders-open.tsv の進み具合から続きを始める」 | 手書きは言っていない。閉じ方・着手の呼び方が無い（中5 の側） |
| 10 | inbox-watch.ps1 **350〜352**（働き手 claude -p への字） | 「済んだら行頭を [x] に書き換えてください。止まる前に work-note.txt へ…書いてください」 | 当たっているが**今は鳴らない**（worker-wake.txt が off・322行で戻る） |
| 11 | inbox-watch.ps1 **2263**（合図の行・報告には無い） | 「…受領の無い枠…を上から順に受けよ」 | **新しく当たる**：受けた後に台帳の行を結ぶ手（bridge-ledger.js／job-sync）を一言も言っていない＝下の穴A の元 |
| 12 | stop-guard.ps1 **104・162・172・180** | 「work-note.txt に「完了:」の行で…書いてから」「待ちの行を必ず一行入れて」「この回の中身へ書き直して」「控えを書いてください」 | **当たっている**（card-out の名が無い。全文を手で書き直すと「枠:」「件名:」が落ちる） |
| 13 | kumo-wait.ps1 **601・606** | 「止まる前に ~/.claude/work-note.txt へ「件名:」と「待ち:」か「完了:」を書き…」 | **当たっている** |
| 14 | job-sync.log「区切りの呼びは一件も無い」 | 17:06:59 から frame-in → step-done → card-out が五つの仕事で続いている | **直っている**（窓の振る舞いとして。呼ばせる仕掛けが入った訳ではない） |
| 15 | job-steps.txt「15段・枠の欄に12個」 | 今は「仕事: 枠 百三十一…」・枠 1個・4段 | **直っている** |
| 16 | CLAUDE.md 作法45 | 「区切りでは必ず node ~/.claude/job-sync.js <出来事> を呼ぶ…」の段が入った | **直っている** |
| 17 | CLAUDE.md 作法25 の `枠:` の行・作法39① | 「その刻をそのまま写す」「同じ最初の一手で、段の台帳にも `仕事:` と段を書く」 | **当たっている**（手で写す前提の字） |
| 18 | CLAUDE.md 作法44 一の3・4 | 「受けた時は node ~/.claude/bridge-ledger.js "<枠の印>" "<受けた枠の頭の一行>"」 | **当たっている**（窓の手の呼びが前提＝穴A） |

併せて確かめた物（大3 の外・直っている）：job-sync.js 269行（resume は札になっていない完了があれば終了4＝大2）／233〜236行（yoshi は今の仕事に [決] が無ければ終了6＝中2）。

## 二、今日出た「窓まかせ」の穴（記録と突き合わせた）

**穴A　受領だけして着手しない枠の、台帳の行を替え忘れる → 掃き手が「合図だけ」と閉じる**
- 記録：ledger-close.log **17:45:08**「合図だけの行を 3 件「該当せず」で閉じた（job-sync card-out から）」。枠 百三十二の札で 17:23:27 の行が済になり、それより前の合図の行のうち項目が「頭：橋（合図 …）」のままだった物が閉じた（百三十＝16:55:58・百三十一＝17:01:08 を含む。今は窓が手で戻して 1885・1886 行は「（橋）枠 百三十…」「（橋）枠 百三十一…」）。
- 仕組み：台帳の行を「（橋）枠 …」に替えるのは、①窓が bridge-ledger.js を直に呼ぶ（作法44 一の4）か、②job-sync の frame-in（228行）だけ。**受領して順番待ちに置くだけの枠は、どちらも通らない。** 掃き手（bridge-ledger.js 26〜29行）は「頭：橋のまま残るのは呼び忘れた合図だけ」（11行の注釈）と見るので、受けた枠の行を閉じる。合図の行の字（inbox-watch.ps1 2263）も、起こしの字（rewake.js 55）も、この一手を言っていない。

**穴B　frame-in が「札が出ていない」と断った後、窓が何も待たずに閉じて起きない**
- 仕組み：job-sync.js 202行（終了4）。窓は止まるしかないが、札が出ても窓を起こす物が無い（rewake.js が起こすのは、新しい受信箱の行・裏の手伝いの終わり・雲／時計の待ちだけ）。
- 今の手当て（枠 百二十六）：断りの字の中で「3分後に起きる時計の待ちを kumo-set.ps1 で立てろ」と**窓に頼んでいる**。今日は 17:44・17:47・18:07・18:16 にこの形で起きている（rewake.log「…の札が出るのを待つ→…」）。窓が立て忘れれば元の待ちぼうけ。3分は見当の数（18:10:32 の card-out の札は 18:14〜18:16 に出た。札が遅い回は、起きてもまた断られる）。resume の断り（269行）にはこの案内も無い。

**穴C　札が出る前に、次の合図で窓が起こされ続ける**
- 記録：枠 百三十の card-out は **18:10:32**、札は 18:14:16〜18:16:19（ledger-close.log・notify-sent.tsv）。その間に rewake.js が **18:12:23・18:13:16・18:15:21** の三度、合図の行で窓を起こしている。起きた窓は橋を読んで受領を書くが、frame-in は断られる（穴B）ので何も着手できず、手番だけが開く。手番が開いている間は札が「まとめ中」になり、出るのが遅れる。
- 仕組み：rewake.js 54〜55行は、新しい行があれば札の有無を見ずに起こす。

**穴D（上の三つを調べる中で見つけた・記録どおり）　起こしの鎖の中では、止まりの関門が回らない**
- 記録：stop-gate.log の 16:00〜18:20 の stop-steps.js の行は **23 回すべて**「stop_hook_active が真なので通した（回さない）」。stop-steps.log は 15:59:38 が最後。
- 見立て（確かめていない）：rewake.js の起こし（asyncRewake の exit 2）で始まった手番は、止まる時に stop_hook_active が真で来る。そうなら、合図や待ちの終わりで起きて回る今の形では、stop-steps.js の「次の段」「順番待ちの次を読む」（枠 百二十三・百二十四）も、そこに書く文言も働かない。**文言と関門を Stop に寄せても届かない**ので、下の案は起こす手（rewake.js）と job-sync の返事の側に置いた。
- 大3 の外なので直し案は付けない。別の枠で確かめる値打ちがある（手で打った枠の後の止まりで真偽を一度見れば分かる）。

## 三、穴ごとの案の比べと、推す案

| 穴 | 機械が代わりにやる | 機械が文言で案内する | 機械が断る | **推す案（一行）** |
|---|---|---|---|---|
| 文言（一の 1・3〜8・11〜13） | —（字の直しそのもの） | 字を job-sync の呼び方に替える | PreToolUse で四つの台帳への直書きを断つ（報告の五の4 の後段） | **案内**：字を替えるだけ。直書きを断つのは、[決]／[雲] にする出来事（中1 の `wait`）が出来てから（今断つと、正しい止まりまで書けなくなる） |
| A 受領だけの枠の行 | 橋を読む一手（bridge-pick.js `--stamp <枠の印>`）が、受領の無い枠があれば台帳の行を頭の一行に替え、無ければ「該当せず」で閉じる | 合図の行と起こしの字に「受けた枠は bridge-ledger.js で結べ」と書く | 掃き手が、直近の読みで受けた枠が台帳に結ばれていない間は閉じない | **機械がやる**：窓が必ず呼ぶ bridge-pick.js に寄せる（呼び忘れの余地が引数一つになる）。`--stamp` が無い呼びには標準エラーで案内を出す |
| B 断られた後に起きない | 待ち手（rewake.js）が、始まった時に「札がまだ」と分かれば覚えておき、札が出たら（順番待ちか受信箱が残っていれば）自分で起こす | 今の形（断りの字で時計の待ちを頼む） | — | **機械がやる**：rewake.js。時計の待ちを立てる手を無くす（断りの字は「止まってよい。札が出たら待ち手が起こす」に替える） |
| C 札の前に合図で起こされる | 待ち手が「札がまだ」の間は受信箱の行で起こさず、札が出た後（か上限 5 分）にまとめて起こす | 起こしの字に「札がまだなら何もせず止まれ」と書く | — | **機械がやる**：B と同じ直し。案内だけでは、起こすたびに手番が開いて札が遅れるのは変わらない |

選ばなかった案の訳：A の「断る」（掃き手の守り）は、読みの記録と台帳の突き合わせが要り、作りが重い。`--stamp` が入れば要らない。B の「案内のまま」は今日四度うまく行ったが、窓まかせのまま残る。

## 四、差分案（どのファイルのどの行をどう変えるか）

置換は Edit の道具で（作法28）。ps1 は BOM 付き UTF-8 のまま。字の中の言い回しは案（言葉の好みは本人・センコが選ぶ所）。

### 四の1　文言（常駐でない物：直したその次の呼びから効く）

**stop-steps.js 54行**（reason の括弧の中だけ替える）
```js
// 前
'（~/.claude/job-steps.txt。済んだ段は [x]、雲待ちは [雲]、本人の決め待ちは [決] に書き替える）'
// 後
'（済んだら node ~/.claude/job-sync.js step-done next。段の台帳を手で書き替えない。雲・手元の走りを待つなら kumo-set.ps1 で待ちを立てて止まる。本人の決めを待つなら控えに「待ち:」「印:」を書いて止まる）'
```
＊段を [雲]／[決] にする出来事は job-sync にまだ無い（中1）。そこは今は手のまま、と正直に残す。

**stop-steps.js 95行**（「済んだ行・当たらない行は台帳を閉じる。」の所だけ）
```js
// 後
'済んだ行・当たらない行は node ~/.claude/job-sync.js inbox-sweep と bridge-ledger.js <枠の印> --none で閉じる（手で字を替えない）。'
```

**rewake.js 55行**
```js
// 前
'。上から着手し、済んだら ~/.claude/inbox.txt の行頭の [ ] を [x] にしてください。\n'
// 後
'。合図（橋）は作法44 のとおり全文を読み、node ~/.claude/bridge-pick.js <ファイル> --stamp "<その合図の枠の印>" で受ける（台帳の行はこの一手が結ぶ）。着手は node ~/.claude/job-sync.js frame-in。行頭の [ ] は手で書かない（frame-in・card-out・inbox-sweep が [x] にする）。\n'
```
**rewake.js 58行**：`'…~/.claude/job-steps.txt の残りの段を続けてください。'` → `'…node ~/.claude/job-sync.js show で残りの段を見て続けてください（済んだ段は step-done next）。'`

**rewake.js 61行**：`'（~/.claude/job-steps.txt の [雲] を済みにして、残りの段を続ける）'` → `'（待っていた [雲] の段は node ~/.claude/job-sync.js step-done next で済みにして、残りの段を続ける）'`
＊step-done は [雲] の行を [x] に出来る（job-sync.js 245〜248行。断るのは [決] だけ）。

**frame-in.ps1 28行**（括弧の中だけ）
```powershell
# 後
'（着手する時は node ~/.claude/job-sync.js frame-in "<この刻>" "<頭の一行>" --steps "段1|段2" --mikomi N。控えの「枠:」と段の台帳は job-sync が書く＝手で写さない。別の枠を前の仕事の段に足さない）'
```
＊報告の五の3 にある「段の先頭が [決] の時に yoshi の一行も出す」は、この鉤（上限15秒・今は台帳を読まない）に読みを一つ足す事になる。足すなら job-steps.txt の頭 20 行だけを読み、`[決]` で始まる行が `[ ]` より先にあれば「許可なら最初の一手で node ~/.claude/job-sync.js yoshi --mikomi N」を一行足す。重さは小さいが、鉤の軽さを決めた経緯（frame-in.ps1 5〜6行の注釈）があるので**別の段に分ける**。

**chain-next.sh 15行**：`始める前に job-steps.txt と work-note.txt を新しい仕事で書き直し` → `始める前に node ~/.claude/job-sync.js frame-in で着手し（手で書き直さない）`。使われていないので最後でよい。

**stop-guard.ps1 104・172行の次に一行ずつ足す**（今の字は残す）
```powershell
[Console]::Error.WriteLine('  ＊終わりの札なら node ~/.claude/job-sync.js card-out --done "…" で書く（控えを手で全文書き直すと「枠:」「件名:」が落ちる）。')
```
＊162・180行は「待ち:」だけ・控えが無い時の字で、job-sync に当たる出来事が無い。今のまま。

### 四の2　穴A：bridge-pick.js に `--stamp`（機械が台帳を結ぶ）

**bridge-pick.js 87行と 92〜96行**（差し込み・断片）
```js
const args = process.argv.slice(2);
const si = args.indexOf('--stamp'), stamp = si >= 0 ? String(args[si + 1] || '') : '';
const f = args.filter((a, i) => a !== '--json' && a !== '--stamp' && !(si >= 0 && i === si + 1))[0];
// …pick の後、標準出力を出す前に
if (stamp) {
  const head = r.open.map(x => x.head).join('／').slice(0, 120);
  const cp = require('child_process');
  const b = cp.spawnSync(process.execPath, [__dirname + '/bridge-ledger.js', stamp, r.open.length ? head : '--none'], { encoding: 'utf8', timeout: 30000, windowsHide: true });
  process.stderr.write('\n台帳：' + String(b.stdout || '').trim() + '\n');
} else if (r.open.length) {
  process.stderr.write('\n受領の無い枠が ' + r.open.length + ' 件。台帳に結ぶ：--stamp "<枠の印>" を付けて呼び直す（付けないと、掃き手が合図だけの行として閉じる）\n');
}
```
- 標準出力の形は変えない（読み手は今のまま）。bridge-ledger.js は「該当の行が 1 件でない時は何も書かず 1 で終わる」ので、同じ刻で二度呼んでも壊れない（二度目は項目がもう「頭：橋」でないので 0 件）。
- 一つの読みで複数の枠を受けた時は、頭を「／」で繋いで一行に入れる（今の 1874 行「（橋）枠 百十七・百十八・百二十二…」と同じ姿）。後で frame-in が同じ刻で呼ばれても、行はもう「頭：橋」でないので bridgeRename（job-sync.js 228行）は何も替えない＝ぶつからない。
- **残る穴**：受領の無い枠が 0 件の読みで `--stamp` を付けると「該当せず」で閉じる。これは今の作法44 一の4 と同じ決め。
- inbox-watch.ps1 2263行の合図の字にも `--stamp "<この行の枠の印>"` を一言入れる（四の4）。

### 四の3　穴B・C：rewake.js が「札がまだ」を見る（機械が待って起こす）

**job-sync.js 196行（count の出力に一欄足す）**
```js
process.stdout.write(JSON.stringify({ steps: steps, waitFirst: waitFirst, waits: waits, inbox: inbox, cardOwed: noteUnsent(orig.note), err: err }) + '\n'); process.exit(0);
```
＊noteUnsent（124〜130行）は frame-in・resume の断りと同じ見方。stop-steps.js 21行の読みは欄が増えても通る。

**rewake.js 35行の次に足す**
```js
// 札待ち：始まった時に「札になっていない完了」があれば、札が出る（か上限）まで受信箱の行では起こさない。札が出たら自分で起こす。
const jsCount = () => { try { return JSON.parse(String(require('child_process').spawnSync(process.execPath, [process.env.JS_PATH || path.join(D, 'job-sync.js'), 'count'], { env: Object.assign({}, process.env, { JS_ROOT: D.replace(/\\/g, '/') }), timeout: 8000, windowsHide: true, encoding: 'utf8' }).stdout || '').trim()); } catch (e) { return null; } };
const mt = f => { try { return fs.statSync(path.join(D, f)).mtimeMs; } catch (e) { return 0; } };
const CARD_HOLD = Number(process.env.REWAKE_CARD_HOLD_SEC || 300);
let owed = !!((jsCount() || {}).cardOwed), sentM = mt('notify-sent.tsv'), cardOut = null;
if (owed) { log('札がまだ出ていない。出るまで（上限 ' + CARD_HOLD + '秒）受信箱の行では起こさない'); }
```
**rewake.js 54〜55行の前後**
```js
if (owed) {
  const m = mt('notify-sent.tsv');
  if (m !== sentM) { sentM = m; const c = jsCount(); if (c && !c.cardOwed) { owed = false; cardOut = c; log('札が出た'); } }
  if (owed && (Date.now() - t0) / 1000 > CARD_HOLD) { owed = false; log('札が出ないまま上限。待たずに起こす側へ戻る'); }
}
const now = unproc().filter(l => !base.has(l));
if (now.length && !owed) { pendingLines = now.slice(); wake(/* 今の字（四の1 の後の字）*/); return; }
if (cardOut && (cardOut.waits.length || cardOut.inbox.length)) {
  const w = cardOut.waits[cardOut.waits.length - 1];
  if (wake('札が出ました。順番待ちの次：' + (w ? w.at + ' ' + w.head : cardOut.inbox[0]) + '（順番待ち ' + cardOut.waits.length + '件）。node ~/.claude/job-sync.js frame-in で着手する（預けた仕事があれば resume）。') === false) { /* 窓が作業中。次の巡回でまた見る */ } else { return; }
  // wake が起こさなかった時は cardOut を残す
}
```
- job-sync.js を呼ぶのは「始まった時に一度」と「notify-sent.tsv の更新刻が変わった時」だけ（2秒おきには呼ばない）。
- 上限 300 秒：札が出ない回（card-gate の止め・見張りの詰まり）でも、5分で今までの動きに戻る＝合図を握ったままにしない。今日の実測は card-out から札まで 3分44秒〜5分47秒（18:10:32→18:14:16／18:16:19）なので、**300 では足りない回がある。360〜420 を推す**（数は仕組みの分かれ道でないので、作り値の後に決める）。
- 待ち手の引き継ぎ（18行・33行）：新しい待ち手は始まる時に自分で `owed` を数え直すので、引き継ぐ物は増やさない。
- 起こしの順：順番待ちの「次」は stop-steps.js 93行と同じ取り方（`waits` の末尾）に揃えた。

**job-sync.js 202行・269行（断りの字）**：rewake.js の直しが入った**後で**、時計の待ちを頼む字を替える。
```js
// 202 後
die(4, '控えに、まだ札になっていない「完了:」がある。何も立てずに止まってよい（札が出たら待ち手 rewake.js が起こす）。急ぐ時だけ --force');
// 269 後（同じ字で「…起こす。その後に resume」）
```
＊順を逆にしない（字を先に替えると、待ち手が古いまま＝穴B に戻る）。

### 四の4　常駐の文言（inbox-watch.ps1・kumo-wait.ps1）と、直す時の手順

**直す所**
- inbox-watch.ps1 **2114**：`済んだらこの行を [x] にする。` → `この行は手で閉じない（node ~/.claude/job-sync.js inbox-sweep が閉じる）。`
- inbox-watch.ps1 **2263**：`…上から順に受けよ。` の前に `bridge-pick.js は --stamp "<この行の枠の印>" を付けて呼ぶ（台帳の行を結ぶ）。着手する枠は node ~/.claude/job-sync.js frame-in。札がまだ出ていない時は何もせず止まる。`
- inbox-watch.ps1 **2493**：`…続きを始める。` の後に `着手は node ~/.claude/job-sync.js show で今の仕事を見てから（預けがあれば resume）。`
- inbox-watch.ps1 **351〜352**（働き手・今は off）：`済んだら行頭を [x] に書き換えてください。止まる前に…書いてください。` → `済んだ仕事は node ~/.claude/job-sync.js card-out --done "…" で札にし、行頭は手で書き換えないでください。`
- kumo-wait.ps1 **601・606**：`止まる前に ~/.claude/work-note.txt へ「件名:」と「待ち:」か「完了:」を書き` → `段が済んだら node ~/.claude/job-sync.js step-done next、終わりは card-out --done "…" で札にし`（601 は「報告は印ごとに reports/ へ残してください。」を残す）

**手順（作法29・知らせが止まる要）** — kumo-wait.ps1 は inbox-watch.ps1 24行で読み込まれる（`. (Join-Path $Root 'kumo-wait.ps1')`）ので、**どちらを直しても常駐の起こし直しが要る。**
1. 写しを取る：`inbox-watch.ps1.bak-20261122`・`kumo-wait.ps1.bak-20261122`（stop-guard.ps1 を直す回は `stop-guard.ps1.bak-20261122` も）。
2. Edit の道具で直す（一行ずつ・錨は一行・改行と BOM を保つ）。字の中に `$'`・`\d`・`\s` を入れない（作法28・34）。
3. 構文検査：`[System.Management.Automation.PSParser]::Tokenize((Get-Content -Raw -Encoding UTF8 <ファイル>), [ref]$err)` で `$err.Count` が 0。行数が前後で変わっていない事（3059行・647行）も見る。
4. 通らなければ、その場で写しから戻す。
5. 起こし直し：`wscript "C:\Users\user\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\ClaudeInboxWatch.vbs"`（新しい常駐が古い方を自分で止める）。
6. 効いたかの確かめ：常駐の起動時刻 ＞ 台本の更新時刻。数えるのは `-File …inbox-watch.ps1` で終わる物だけ（作法29 の字のとおり）。一本である事。
7. 起こし直しは、窓が雲待ち・札待ちの最中を避ける（合図の見張りが数十秒切れる。入れた時点の頭は「見た」扱いなので空鳴りはしないが、札の押しと重ねない）。

rewake.js・stop-steps.js・job-sync.js・bridge-pick.js・frame-in.ps1・stop-guard.ps1 は呼ばれるたびに読まれるので、起こし直しは要らない。**rewake.js だけは、直した時に走っている待ち手が古い字のまま**（次の Stop で新しい待ち手に替わる）。

### 四の5　CLAUDE.md の字（案だけ・変えない。作法の変更は本人の決め）

- **作法25 `枠:` の行**：「その刻をそのまま写す（書き直さない・刻を作らない）」→ 案「その刻で `node ~/.claude/job-sync.js frame-in` を呼ぶ（控えの `枠:` は job-sync が書く。手で写さない・刻を作らない）」。「後で着手する枠は、積む行（`job-steps.txt` の段）にも同じ刻を写す」は**削る**（別の枠は別の仕事＝作法45 と食い違う）。
- **作法39①**：「控えの `枠:` に…そのまま写す」「段の台帳にも `仕事:` と段（`[ ]`）を書く」→ 案「同じ最初の一手は `job-sync.js frame-in`（件名・枠・段・見込みを一度に書く）」。
- **作法44 一の1・4**：「`node ~/.claude/bridge-pick.js <ファイル>` に渡す」→ 案「`node ~/.claude/bridge-pick.js <ファイル> --stamp "<枠の印>"`（受領の無い枠があれば台帳の行を頭の一行に替え、無ければ「該当せず」で閉じる。bridge-ledger.js を別に呼ばない）」。一の4 の二つの呼びは「`--stamp` を付け忘れた時の手」として残す。
- **作法45**：`card-out` の段に一文足す案「札が出る前に断られたら、何も立てずに止まる（待ち手が札の後に起こす）」。今の「札が出る前に次の `frame-in`・`resume` を呼ばない」はそのまま。

## 五、作り値での確かめ方

どれも本物の台帳・受信箱・ntfy に触れない。置き場は `%TEMP%\koushu-dai3-<pid>`（名に `koushu-`・作法35）、終わったら置き場ごと消す。待つ側には `timeout`（各 30 秒以内）。

| # | 見る物 | 作り方 | 合格 |
|---|---|---|---|
| 1 | 文言（四の1） | `SS_ROOT=<置き場>` `SS_NOSEND=1` で stop-steps.js に `{"stop_hook_active":false}` を流す。job-steps.txt は `[ ] 段A` 一行 | 出力の reason に「job-sync.js step-done next」が入り、「書き替える）」で終わらない |
| 2 | 穴A：受けた枠 | `BL_LEDGER=<置き場>/orders-open.tsv`（bridge-ledger.js が読む）に「頭：橋（合図 16:55）／未了：受領」の行。受領の無い枠 1 件の xml を `bridge-pick.js <xml> --stamp "2026-11-22 16:55:58"` | 行の項目が「（橋）枠 …」に替わる・状態は「未了：受領」のまま・標準出力の JSON は `--stamp` 無しと一字も違わない |
| 3 | 穴A：掃き手 | 2 の後、後ろの橋の行を「済」にして `bridge-ledger.js --sweep` | 2 の行は閉じない（0 件）。`--stamp` を付けなかった写しでは 1 件閉じる（＝今日の 17:45:08 の再現） |
| 4 | 穴A：受ける枠なし | 受領済みだけの xml に `--stamp` | 行が「該当せず：橋の文書に、受領の無い枠が一つも無かった」 |
| 5 | 穴A：二度呼び | 2 をもう一度 | 終了は 0・台帳は一字も変わらない・標準エラーに「該当の行が 0 件」 |
| 6 | count の欄 | `JS_ROOT`・`JS_NOW`・`JS_REPO` を置いて、控えに「完了: あいう」・notify-sent.tsv にその字の無い札だけ | `cardOwed:true`。notify-sent.tsv に「あいう」を含む札（base64）を足すと `false` |
| 7 | 穴C：握る | `REWAKE_DIR=<置き場>` `REWAKE_POLL_MS=200` `REWAKE_CARD_HOLD_SEC=5` `JS_PATH`・`HC_PATH` を置き、6 の「札がまだ」の形で rewake.js を起こす。1秒後に inbox.txt へ `[ ] <刻>  橋（合図 …）` を足す | 3秒たっても終わらない（起こさない）。rewake.log に「札がまだ出ていない」 |
| 8 | 穴B：札で起こす | 7 の続きで notify-sent.tsv に札を足す | 1秒以内に終了コード 2・標準エラーに受信箱の行（合図が先）。合図が無く順番待ちだけの形では「札が出ました。順番待ちの次：…」 |
| 9 | 上限 | 7 の形で札を足さない | 5秒を過ぎたら終了コード 2（今までの字）・記録に「札が出ないまま上限」 |
| 10 | 札の要らない止まり | 控えに完了が無い形で rewake.js。inbox に一行足す | すぐ終了コード 2（今までと同じ速さ） |
| 11 | 窓が作業中 | busy.txt を `{"ev":"PostToolUse","evAt":<今>}` にして 8 | 起こさない（43〜45行の今の決めが残る）。busy.txt を Stop にすると起きる |
| 12 | 引き継ぎ | 7 の最中に二本目の rewake.js を起こす | 古い方は「譲って降りる」・新しい方も握る（起こさない） |
| 13 | 常駐の字 | 直した inbox-watch.ps1・kumo-wait.ps1 を PSParser に通す（四の4 の 3）。合図の行は、写しの `Check-SenkoBell` の `$line` の式だけを抜いて評価 | 構文の誤り 0・行数が同じ・字に `--stamp` が入る |

実地（作り値の後・一度だけ）：次の合図で窓が `--stamp` を付けて呼び、台帳の行が「（橋）枠 …／未了：受領」になる事。card-out の後、時計の待ちを立てずに止まり、札の後に rewake.log へ「札が出た」→「起こした」が並ぶ事。

## 六、見込み（分）

| 段 | 中身 | 分 |
|---|---|---|
| 1 | 文言（stop-steps.js 54・95／rewake.js 55・58・61／frame-in.ps1 28／stop-guard.ps1 2行／chain-next.sh）と作り値 1 | 20 |
| 2 | 穴A：bridge-pick.js `--stamp` と作り値 2〜5（bridge-pick-test.js に足す） | 30 |
| 3 | 穴B・C：job-sync.js count の欄・rewake.js の札待ち・作り値 6〜12・その後に job-sync.js 202・269 の字 | 45 |
| 4 | 常駐の字（inbox-watch.ps1 四か所・kumo-wait.ps1 二か所）：写し→構文検査→起こし直し→確かめ・作り値 13 | 25 |
| 5 | CLAUDE.md の字（本人の決めの後）と札 | 15 |
| 計 | | **約135**（一つの枠 20 分の決め＝作法38 に合わせ、段ごとに別の枠にする。段 3 は二つに割る） |

順の訳：段 1 は起こし直しが要らず、すぐ効く。段 2 は今日実際に行が消えた穴。段 3 は今の手当て（時計の待ち）が動いているので三番目。段 4 は常駐の起こし直しが要るので、ほかの常駐の直しと同じ回にまとめる。

## 残り
残り0件（この下請けは直し案まで。直しは枠が立ってから）。大3 の外で気づいた物：穴D（起こしの鎖の中で stop-steps.js が回らない・二の末尾）。確かめていない見立てなので、別の枠で一度確かめる事を勧める。
