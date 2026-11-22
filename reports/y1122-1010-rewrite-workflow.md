# 履歴の書き換え（甲）を雲で回す流れ：history-rewrite.yml（枠 八十八の二〜四・橋の枠 九十五）

状態：流れのファイルを作り、作り値で確かめた（押していない・起こしていない） — 10:14

## 結論（短く）

- `.github/workflows/history-rewrite.yml` を作った。起こすのは手だけ（workflow_dispatch）。**押さない**（permissions は `contents: read` だけ）。成果物を三つ残す：検証の結果・書き換え済みの丸ごと（bundle）・元の丸ごと（bundle）。
- 作り値（5 ref・8 commit の小さいリポジトリ）で、流れの run の中身をそのまま順に回した：**抜くのは守る ref の tree に無い声のパスだけ**、main・stable・check-pass の tree は同一、台帳の声の欠け 0、commit・枝・タグの数も同じ、fsck PASS、二つの bundle の verify PASS。
- **気を付ける所が二つある。** ①蔵（GitHub）に在る枝とタグは `main`・`claude/git-push-lock-alignment-lzcte6`・`stable`・`check-pass` の四つだけ。`backup-main-0918`・`backup-main-1111`・`keep-voices`・`rescue-autostash-20260907`（タグ）は **VAIO の中にしか無い**ので、雲からは見えず書き換えられない（下の「親が決める所」の一）。②**甲の守りに stable と check-pass も入れた。** main だけを守ると、stable の tree に在って main に無い声（旧い版が使う声）が抜けて、stable の tree が変わる（戻り先が壊れる）。stable や check-pass が持つので残したパスは `kept-for-other-refs.txt` に出る。

## 流れの全体（history-rewrite.yml）

`runs-on: ubuntu-latest`・`timeout-minutes: 120`・`concurrency: history-rewrite`・置き場は `/mnt/rw`。入力は二つ（既定のまま起こせばよい）：`keep_refs`（既定 `main stable check-pass`）・`prune_empty`（既定 `never`＝空になった commit も落とさない＝commit 数が元と同じ）。

| 段 | すること |
|---|---|
| 置き場を空ける | runner の大物（dotnet・android・ghc・CodeQL）を消し、`/mnt/rw` を作る |
| 共通の道具 | `lib.sh`（報告の書き方・FAIL の数え方・大きさの測り方）を書き、`verify-report.md` の頭を書く |
| ① mirror | `git clone --mirror`（GITHUB_TOKEN は http.extraheader で渡す。設定には残らない）。heads・tags 以外（refs/pull など）は消して対象外にする |
| ② 元の一覧 | `refs-before.txt`（HEAD・全部の枝とタグの hash・タグの指す先）。commit 数・枝数・タグ数・中身の変わらない commit の数・置き場の大きさ・守る ref の tree の hash を控える |
| ③ 元の丸ごと | `git bundle create original-all.bundle --all` → `git bundle verify`。bundle の頭が元の枝とタグと一致するかも見る |
| ④ 甲の一覧 | `git log --all -m --no-renames --raw --diff-filter=ACMRT` で、履歴に現れた blob とパスを全部拾う。声（.m4a・.wav・.wav.wav・.ogg）のパスのうち、守る ref の先端の tree に無いものを `paths-to-remove.txt` に。**main の tree・守る ref の tree との共通部分が 0 であること**を確かめる（FAIL なら止める）。抜いて届かなくなる blob の数・未圧縮・pack 上の大きさの見込みを出す |
| ⑤ 道具 | `pipx install git-filter-repo==2.47.0`（駄目なら版を外す・pip で入れる） |
| ⑥ 書き換え | mirror を `git clone --mirror --no-local` で写し（bare のまま。枝とタグがそのまま refs/heads・refs/tags に入るので、追跡枝をローカル枝にし直す手が要らない）、枝とタグが元と一致するのを見てから `git filter-repo --invert-paths --paths-from-file …（各行に literal: を付けた物） --prune-empty never --prune-degenerate never --force`。`commit-map.txt`・`ref-map.txt`（旧→新の hash）を残す |
| ⑦ 検証 | (a) 守る ref の先端の tree の hash が元と同一。ほかの ref は先端の hash が変わった本数と理由（tree は同じで歴史だけ変わった／先端の tree にも抜いた声が在った）を一本ずつ書く (b) main の `voice-used.txt` の全部が main の tree に在る（欠け 0）・main の tree の声の本数が元と同じ (c) 枝・タグ・commit の数が元と同じ、声を抜いて空になった commit の本数を別に (c') 書き換え後の全部の履歴に、抜いたパスが 0 本 (d) `reflog expire --expire=now --all`＋`gc --prune=now` の後の置き場を、mirror と書き換え前の写しと比べる (e) `git fsck --no-dangling` |
| ⑧ 書き換え済みの丸ごと | `git bundle create rewritten-all.bundle --all` → 空の置き場で `bundle verify`。頭が書き換え後の枝とタグと一致するか |
| まとめ | どの段が最後まで行かなかったか・FAIL の数。FAIL が1件でもあれば exit 1（「押さないこと」と書く）。報告は Actions の要約にも出す |
| 成果物（三つ・`if: always()`・14日） | `history-rewrite-report`（*.txt・*.md）／`rewritten-all-bundle`／`original-all-bundle`（bundle は圧縮0で上げる） |

## 成果物の名と大きさの見込み

| 成果物 | 中身 | 見込み |
|---|---|---|
| `history-rewrite-report` | `verify-report.md`・`refs-before.txt`・`refs-after.txt`・`refs-cloned-all.txt`・`paths-to-remove.txt`（約1.9万行）・`kept-for-other-refs.txt`・`voice-missing.txt`・`commit-map.txt`・`ref-map.txt`・`fails.txt`（落ちた時だけ） | 数MB |
| `original-all-bundle` | 元の丸ごと（蔵の 1,951,272KB に近い） | 約 2.0GB |
| `rewritten-all-bundle` | 書き換え済みの丸ごと | 約 1.1〜1.3GB（元から約 793MB 減の見込み） |

＊蔵は公開なので、成果物の置き場は無料。成果物は14日で消える。元の丸ごとを長く持つなら、14日の内に取って VAIO か外の置き場に移す（VAIO の空きを先に見る）。
＊公開の蔵の成果物は、GitHub に入った人なら誰でも取れる。中身は今の公開の履歴と同じなので、新たに外へ出る物は無い。

## 雲の見込み時間

約 35〜65分（上限 120分）。mirror 2〜4分・元の bundle 2〜4分・甲の一覧 2〜5分・filter-repo 5〜10分・写し 3〜5分・残りの確かめ 2〜4分・gc 5〜10分・fsck 3〜6分・新しい bundle 2〜3分・成果物の上げ 5〜15分。runner の置き場は約 8GB 使う（/mnt は通常 14GB 以上空き）。

## 作り値の結果（手元・数秒）

手元の python 3.13（rewrite-1122/py313）と取得済みの git-filter-repo（rewrite-1122/dl-fr）を包みにして、流れの run の中身をそのまま切り出して順に回した（雲だけの段＝置き場を空ける・道具を入れる・成果物を上げるは飛ばした）。小さいリポジトリ：main 6 commit（merge 1 を含む）・枝 `claude/side`・`claude/tipvoice`・注釈つきタグ `stable`（声を二つ持つ旧い版）・タグ `check-pass`。

- 抜いたパス 5（`a.wav.wav`・`onlyadd.wav.wav`・`dup.ogg`・`side.ogg`・`tipvoice.wav`）。**stable が持つ `old.m4a`・`reports/x/stab.wav` は残した**（kept-for-other-refs）。main の声 `keep.m4a`・`both.m4a` は残った。
- (a) main・stable・check-pass の tree 同一。先端の hash が変わった ref 5本のうち、先端の tree も変わったのは守る ref の外の `claude/side`・`claude/tipvoice` の2本（先端に抜いた声が在った）。注釈つきタグ stable はタグごと書き直された。
- (b) 台帳の欠け 0 (c) 枝3・タグ2・commit 8 が元と同じ、声を抜いて空になった commit 4（落とさず残した） (c') 抜いたパスの残り 0 (e) fsck PASS。二つの bundle の verify と頭の一致 PASS。
- 一度目は (a) の後で落ちた（gc で消えた旧い tree を新しい置き場で `git diff` しようとした）。旧い側は mirror で、新しい側は作業用の写しで名を並べて比べる形に直し、二度目は全部 PASS。拡張子ごとの数え方（`.wav.wav` が `.wav` に数えられた）も直した。
- 形の点検：タブ無し・頭の鍵が揃う・run の中身 11 段すべて `bash -n` が通る（YAML の解析器は手元に無いので、字下げで run を切り出す小さい道具と目で読んだ）。

## 押した時に雲の自動の走りが起きるか（history-rewrite.yml を押す回）

- `check.yml`：push で起きる（paths-ignore に入っていない）。ただし scope の `scope-pick.js` は `.github/workflows/history-rewrite.yml` を本体（BODY）にもパネル（PANEL）にも数えない（BODY に入る workflow は check.yml だけ）→ `heavy=0`＝**検査は回らず、配信の段だけ走る**（数分）。check-pass からの差も見るが、今の check-pass（2b96d99d）と main（321ebfa6）の差は reports/ だけなので変わらない。
- `job.yml`：paths（scratchpad/jobs・panel・本体・検査台本）に当たらないので起きない。`state-deploy.yml`：起きない。
- `.github/workflows/` の下のファイルを足す押しなので、**workflow の権限のある鍵**（VAIO の鍵）で押す。GITHUB_TOKEN では押せない。

## 押した後の手順

### 1. 起こす（作法37・38・40）

```
gh run list --workflow history-rewrite.yml --limit 5      # queued／in_progress が無いのを確かめる
gh workflow run history-rewrite.yml                        # 既定（keep_refs=main stable check-pass・prune_empty=never）
gh run list --workflow history-rewrite.yml --limit 1 --json databaseId,status,headSha
~/.claude/kumo-set.ps1 -State waiting -Workflow history-rewrite.yml -Sha <押した commit> -Mark <印> -Subj "履歴の書き換え（雲）" -Eta <終わる見込み HH:mm>
```

窓の中で待たない（35〜65分）。終わりは見張りが起こす。

### 2. 成果物を取る

```
gh run download <id> -n history-rewrite-report -D C:/Users/user/Desktop/mahjong/rewrite-1122/run-<id>
gh run download <id> -n rewritten-all-bundle   -D C:/Users/user/Desktop/mahjong/rewrite-1122/run-<id>
gh run download <id> -n original-all-bundle    -D C:/Users/user/Desktop/mahjong/rewrite-1122/run-<id>   # 長く持つなら
```

1.2GB・2.0GB の取り込みは3分を超えるので、`~/.claude/local-run.ps1` で切り離して走らせ、`kumo-set.ps1 -Workflow local:<終わりの印>` で待つ（作法40）。まず `verify-report.md` を読み、FAIL 0・(a)〜(e) を確かめる。FAIL があれば押さない。

### 3. VAIO で bundle を確かめ、今のリポジトリへ取り込む

押しの量を小さくするため、**別の置き場に clone せず、今の VAIO のリポジトリへ別の名前で取り込む**（今のリポジトリには旧い blob が全部在るので、押す時に送る物は書き換えで新しくできた commit と tree だけになる。別の置き場から押すと 1.2GB を丸ごと送る）。

```
git bundle verify <置き場>/rewritten-all.bundle                       # 前提の commit 無し・頭の一覧
git bundle list-heads <置き場>/rewritten-all.bundle                   # refs-after.txt と突き合わせる
git fetch <置き場>/rewritten-all.bundle 'refs/heads/*:refs/rewritten/heads/*' 'refs/tags/*:refs/rewritten/tags/*'   # 切り離して（数分〜）
git rev-parse refs/rewritten/heads/main^{tree} main^{tree}            # 同じであること（stable・check-pass も）
```

### 4. 押す前に、書き手を止める

- 雲：`gh workflow disable check.yml`・`gh workflow disable job.yml`・`gh workflow disable voice-m4a.yml`（`state-deploy.yml` も止めてよい）。走っている分が無いのを `gh run list` で確かめる。**check.yml を止めるのは、`pass` の段が check-pass を API で旧い歴史の commit へ強制で進めるため**（押した後に古い走りが印を戻すと、旧い blob がまた届く）。job.yml・voice-m4a.yml は押しを持つ（job.yml は `pull --rebase` してから押す）。
- VAIO：`~/.claude` の押し手（`git-push.ps1` を通る見張り・`turn-push.ps1`・`push-mine.ps1`・`heavy-push.ps1`・`push-retry.ps1` など）。押しの錠（`push-lock.txt`）は10分で切れるので、押しの間は常駐の押しを止めるか、錠を置き直し続ける。**特に `git-push.ps1` は弾かれると `pull --rebase` する**。書き換えた後の main に旧い歴史の VAIO の main を rebase すると、旧い commit を積み直して抜いた声を戻すおそれがある。VAIO の main を新しい歴史に付け替えるまで（下の 6）は止めたままにする。

### 5. 強制押し（案）

`refs-before.txt`（元の hash）を期待値にして、間に誰かが押していたら弾かれる形で、全部を一度に（`--atomic`）押す。

```
git push --atomic \
  --force-with-lease=refs/heads/main:<元の hash> \
  --force-with-lease=refs/heads/claude/git-push-lock-alignment-lzcte6:<元の hash> \
  --force-with-lease=refs/tags/stable:<元の hash> \
  --force-with-lease=refs/tags/check-pass:<元の hash> \
  origin \
  refs/rewritten/heads/main:refs/heads/main \
  refs/rewritten/heads/claude/git-push-lock-alignment-lzcte6:refs/heads/claude/git-push-lock-alignment-lzcte6 \
  refs/rewritten/tags/stable:refs/tags/stable \
  refs/rewritten/tags/check-pass:refs/tags/check-pass
```

（親が決める所の一で、蔵にだけ無い四つも雲で書き換えた場合は、同じ形でその ref も足す。）
押しは `push-mine.ps1` の錠を通す。pre-push は構文検査だけ。

### 6. 押した後

- VAIO の ref を付け替える：`git update-ref refs/heads/main refs/rewritten/heads/main`（tree が同一なので作業木と index はそのまま。`git status` が変わらないのを見る）。タグも `git tag -f stable refs/rewritten/tags/stable^{}` は使わず `git update-ref refs/tags/stable refs/rewritten/tags/stable`（注釈つきのまま）。`refs/remotes/origin/*` は `git fetch origin` で揃う。済んだら `refs/rewritten/*` を消す。
- 書き手を戻す：`gh workflow enable check.yml` ほか、`~/.claude` の押し手。
- 確かめ（枠の三）：`gh api repos/kfsr148-art/koushu-handan --jq .size`（**GitHub 側の旧い blob はすぐには消えない**。GitHub の掃除が回るまで大きさが下がらないことがあり、早く消すには GitHub の支援窓口に頼む）・公開ページ（本体が出るか。tree が同じなので変わらないはず）・`voice-used.txt` の声の欠け 0（`node pack-site.js` の台帳との突き合わせ）・雲の検査（押しで check.yml が回るか、手で `gh workflow run check.yml`）。
- VAIO の .git は旧い blob を持ったまま（約 3.85GiB）。縮めるには gc か取り直しが要り、どちらも VAIO には重い（作法41）。後で決める。

### 戻す手順

`original-all.bundle`（14日の内）から：

```
git fetch <置き場>/original-all.bundle 'refs/heads/*:refs/original/heads/*' 'refs/tags/*:refs/original/tags/*'
git push --atomic --force origin refs/original/heads/main:refs/heads/main …（refs-before.txt の全部）
```

旧い blob は VAIO のリポジトリにもまだ在るので、VAIO の旧い ref（付け替える前の main の hash は `refs-before.txt`）からも戻せる。

## 親が決める所

1. **蔵に無い四つ**（`backup-main-0918`・`backup-main-1111`・`keep-voices`・タグ `rescue-autostash-20260907`）の扱い。本人は「backup-main-* と keep-voices も含め書き換えて押す」と言っている。案：(A) 起こす前にこの四つを蔵へ押す（どれも main から 1〜2 commit。keep-voices の1本は声 4,700本の移し＝中身は蔵に在る blob なので送る量は小さい）→ 雲が一緒に書き換え、5 で一緒に強制押し。(B) 蔵へは出さず VAIO にだけ置く（蔵の大きさには効かない。VAIO の .git にだけ旧い blob が残る）。
2. 守る ref を `main stable check-pass` にしたこと（甲の言葉どおり main だけにすると stable の tree が変わる）。main だけにしたければ `keep_refs=main` で起こせば、検証 (a) の stable は FAIL になる。
3. 空になった commit を残す（`prune_empty=never`）こと。落とすなら `prune_empty=auto`（commit 数が減り、検証 (c) はその数を書く）。
4. 元の丸ごとを14日より長く持つか（VAIO・外の置き場の空き）。
