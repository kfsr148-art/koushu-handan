# 枠 九十三・九十四・九十七：乗り換え前の三つ（job-sync.js・frame-work.ps1）／state-decide.js の [決] の狭めた判じ／CLAUDE.md 作法45 の一段

状態：終わり（下請け・~/.claude 側とリポジトリの state-decide.js・state-decide-test.js・CLAUDE.md） — 14:56

## 結論
- **一（~/.claude）**：見直し役（reports/y1122-1040-jobsync-review.md）の大1・大2・中2 を塞いだ。job-sync.js の作り値（jobsync-test.js）に16項目を足して **PASS 16・FAIL 0**。
- **二（リポジトリ）**：state-decide.js は見直し役の狭めた案を採った。[決] の決めは残し、**手番が開いて足跡（busy.txt の evAt・toolAt の新しい方）が3分以内の間だけ「作業中（許可待ちの段が残っている）」**。止まればヨシ待ちに戻る。新しい材料（user-activity.json）は使わない。作り値に9項目を足し、総当たり 1344組 NG 0。
- **三**：CLAUDE.md 作法45 の末に「区切りでは必ず job-sync.js を呼ぶ」一段を足した。作法46 の stable の字（v1505・cf4e5904）は直していない（本人のヨシが要る物）。
- `node panel-check.js --static`：全て PASS（✓169・✗0・8.5秒。「測れなかった項目」はブラウザの部分）。

## 一、乗り換え前に塞ぐ三つ（~/.claude）
| 穴 | 直した所 | 形 |
|---|---|---|
| 大1 frame-work.ps1 が job-sync の控え（種類も本文も無い）を守れず、合図のたびに件名を「橋（文書の枠を読む）」に替える | `frame-work.ps1` 38〜64行に `Test-JobInProgress` を足し、277〜280行で先に当てる | 控えの件名＝段の台帳の「仕事:」（切り詰めは20字以上の前方一致まで認める）で、段に残り（[ ]・[雲]・[決]）がある間は、件名・印・待ち・本文をまるごと触らない（hook.log に「控えは今の仕事…触らない」の一行）。段が全部済めば今まで通り Test-NoteReported へ渡す。job-sync の控えにも手書きの控えにも効く |
| 大2 `resume` に札の守りが無い（card-out の後、札になる前の「完了:」が消える） | `job-sync.js` 252〜253行 | frame-in と同じ `noteUnsent` で、札になっていない完了があれば終了 4 で断る（--force で通す）。何も書かない |
| 中2 `yoshi` が [決] の無い仕事の見込み・印まで書き替える | `job-sync.js` 215〜220行 | 今の仕事に [決] が無ければ何も書かずに終了 6。預けに [決] があれば「resume --swap で戻してから yoshi」と出す。--mikomi の催促より先に止める |

常駐（inbox-watch.ps1）は frame-work.ps1 を別の手（powershell -File）で呼ぶので、起こし直しは要らない（inbox-watch.ps1 1519行の注）。知らせの要の四本は触っていない。frame-work.ps1 は構文検査（PSParser）errors 0・BOM と LF のまま。job-sync.js は node --check 通る。

### 作り値（jobsync-test.js・置き場は JS_ROOT・JS_NOW で一時ディレクトリ koushu-jstest-*）
PASS 16・FAIL 0（12.3秒）。足した項目：
- card-out は通る／その直後（札が出る前）の resume は終了 4／断った時は五つの台帳の md5 が同じ／控えの「完了:」が残る／札（notify-sent.tsv）が出た後の resume は通る（先頭 [決] の仕事が戻る）
- [決] の無い今の仕事への yoshi は終了 6／預けに [決] があれば「resume --swap」と出す／md5 が同じ／--mikomi が無くても終了 6／resume --swap の後の yoshi は通る（[決]→[ ]・許可済 09:52・見込み 90分）
- job-sync の frame-in が書いた控えに種類も本文も無い（前の守りだけでは通る形）／その控えでも frame-work の守りは KEEP／card-out の後は TOUCH（今まで通り）／件名が違えば TOUCH／20字以上の切り詰め・先頭 [決] でも KEEP／20字未満の前方一致は TOUCH（frame-work.ps1 の関数をそのまま切り出して PowerShell で回した）
- 既存の「前／後」の表には「止まれば」の stat を並べた（足跡の新しい作り値なので [決] は作業中、止まればヨシ待ち）。

## 二、state-decide.js の [決]（リポジトリ）
- `state-decide.js` 44〜52行：`turnOpen` と `footAt = max(evAt, toolAt)` を [決] の前で組み、`alive > 0 && turnOpen && now - footAt <= 180` なら `stat='作業中'`・`detail='許可待ちの段が残っている'`（裏の仕事があれば「・裏で…」を足す）。それ以外は今まで通りヨシ待ち。下の作業中の決めは同じ `turnOpen` を使う（重ねて組まない）。
- 作り値 `state-decide-test.js`：総当たりの当てを「決め待ち＋足跡3分以内＋窓が開いている→作業中」に替え、訳の字も見る。足した9項目：Stop→ヨシ待ち／PostToolUse 20秒→作業中（訳の字）／UserPromptSubmit 170秒→作業中／evAt 400秒・toolAt 60秒→作業中／181秒→ヨシ待ちへ戻る／alive 0→ヨシ待ち／手待ちで裏の手伝いだけ→ヨシ待ちのまま／[決] 無し・動いている→作業中（訳は空・今まで通り）／[決] 無し・止まっている→待ち（残りの段・今まで通り）。全部合い。

## 三、CLAUDE.md 作法45 の一段
区切り（枠を受けた・許可を受けた・段が済んだ・札を出した）では必ず `node ~/.claude/job-sync.js <出来事>`／許可を受けた手番は最初に `yoshi`／別の枠は `frame-in` で別の仕事（前の仕事に段を足さない）／札は `card-out`、止まるのは `card-out` の後（札の前に frame-in・resume を呼ばない）／state-decide の狭めた判じの一行。

## 写しと戻し方
- `~/.claude/frame-work.ps1.bak-20261122q`・`~/.claude/job-sync.js.bak-20261122q`：`cp -p <写し> <元の名>` で戻る。
- リポジトリ：`git revert <この commit>`（state-decide.js・state-decide-test.js・CLAUDE.md・この報告）。state-decide.js の手元の写しは scratchpad/state-decide.js.bak-20261122q（git の外）。

## 残る隙間
- 呼ぶかは窓まかせ（大3）：機械の文言（stop-steps.js 41・rewake.js・frame-in.ps1 28・inbox-watch.ps1 など）は今も手書きを指示している。止まる時の関門も無い。
- 手で書く出来事が無い（中1：[決]／[雲] にして止まる・段を足す・欄だけ書く）。作法45 は「手で書かない」と言うが、待って止まる時は今も手が要る。
- state-decide は止まればヨシ待ちに戻るので、yoshi を呼び忘れると許可の後の止まりで再びヨシ待ちが出る（作法45 に書いた）。橋で渡る許可の yoshi-grant.js は job-sync の yoshi を呼ばない（中9）。
- frame-work.ps1 296〜306 のヨシの返事の畳みは job-sync に寄せていない。預け（job-stack.json）を state-decide・orders-count・endat は読まない（中3・中4）。card-out が札の前に台帳を済にする（中6）。
- 今の本物の job-steps.txt・work-note.txt・inbox.txt・orders-open.tsv は触っていない（乗り換えの畳みは窓の仕事）。

## 残り
残り0件。
