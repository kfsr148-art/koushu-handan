# 置き場の大きさと、今の本体に無い声が履歴で占める量（枠 八十八 一・読むだけの測り）

状態：終わり（測りのみ・書き換え0・commit/push なし） — 08:37

MB は 1,000,000 バイト。「未圧縮」＝ blob の中身の大きさ（`%(objectsize)`）、「pack 上」＝置き場で実際に占める大きさ（`%(objectsize:disk)`。pack 内は差分圧縮後、散らばった物は zlib 後のファイルの大きさ）。

## 結論（短く）

- **置き場（.git）は約 3.85GiB**：散らばった物（loose）56,313個 2.04GiB ＋ pack 44本 1.80GiB（pack 置き場の実測 1,936,770,223 バイト）。蔵（GitHub）側は **1,951,272KB ≈ 1.86GiB**。追跡中の作業木は 45,294本 1,883.6MB（うち声 43,793本 1,782.8MB）。
- **今の本体に無い声（台帳に載らない声）は、履歴に 23,349個・未圧縮 1,356.8MB・pack 上 1,149.9MB。**
  - うち **過去の commit にだけ在って今の tree に無い声：19,391個・未圧縮 915.9MB・pack 上 793.3MB**（ほぼ全部が旧い `.wav.wav`）
  - うち **今の tree に在るが台帳（voice-used.txt）に載らない声：3,958個・未圧縮 441.0MB・pack 上 356.6MB**
- 今使う声（HEAD に在り台帳に載る）：21,083個・未圧縮 702.1MB・pack 上 690.2MB。
- **減る見込み（pack 上）**：過去にだけ在る声を抜けば **約 793MB**、台帳外の声も今の tree ごと抜けば **約 1,150MB**。抜いた後に gc すると、重複・届かない物も落ちるので、.git は **約 3.85GiB → 2.0GB 以下（甲）／1.6GB 以下（乙）** の見込み（声以外 889.6MB は repack でさらに縮む余地あり）。

## (1) 置き場の大きさ

| 項目 | 値 |
|---|---|
| `count-objects -vH` | count 56,313（散らばった物）・size 2.04GiB／in-pack 60,499・packs 44・size-pack 1.80GiB・prune-packable 78・garbage 0 |
| pack 置き場の実測（`du -sb .git/objects/pack`） | 1,936,770,223 バイト |
| .git 全体の du | 120秒の内側の上限で切った（HDD が遅い）。count-objects から約 3.85GiB |
| 追跡中の作業木（`git ls-files` を stat で合計） | 45,294本・1,883,596,795 バイト（声 43,793本・1,782,809,043 バイト） |
| 蔵（`gh api repos/kfsr148-art/koushu-handan --jq .size`） | 1,951,272 KB |

＊履歴から届く blob の pack 上の合計は 2,729.6MB（声 1,840.0 ＋ 声以外 889.6）。count-objects の 3.85GiB との差（約 1.1GB）は、散らばった物と pack の重複・複数の pack に同じ物・どの枝からも届かない物と見られる（どれも gc で落ちる側）。全オブジェクトの総なめ（`cat-file --batch-all-objects`）は HDD で 150秒に 1万個しか進まず、打ち切った。

## (2) 今の本体に無い声が履歴で占める量

方法：`git rev-list --all`（19,114 commit）を 1,000本ずつ `git diff-tree --stdin -r --root --no-renames --diff-filter=AM` に通し（merge 8本は `-m` で別に）、履歴で一度でも現れた blob とそのパスを全部拾った（72,571個）。拡張子 `.m4a`・`.wav`・`.wav.wav`・`.ogg` 等を声とし（44,432個）、その oid だけ `cat-file --batch-check` で大きさを取った。同じ blob が複数のパスに在っても一度だけ数える。
＊`rev-list --objects --all` 一本は 175秒の上限で二度切れたので、この分け方に替えた。

「今使う声」＝ HEAD の tree の声のうち、台帳 voice-used.txt（21,258本・全部 HEAD に在る）の名に当たるパスの blob。

| 区分 | blob 数 | 未圧縮 | pack 上 |
|---|---:|---:|---:|
| 履歴の声 全部 | 44,432 | 2,059.0MB | 1,840.0MB |
| 今使う声（HEAD ∩ 台帳） | 21,083 | 702.1MB | 690.2MB |
| **過去にだけ在る声**（今の tree に無い） | **19,391** | **915.9MB** | **793.3MB** |
| **HEAD に在るが台帳外** | **3,958** | **441.0MB** | **356.6MB** |
| 今の本体に無い声の計 | 23,349 | 1,356.8MB | 1,149.9MB |
| （参考）声以外の blob | 28,139 | 3,628.3MB | 889.6MB |

＊HEAD の声 43,793 パスは blob にすると 25,041個（`reports/voice-m4a-out/` 20,133本が直下の声と同じ中身の写し＝重複）。

## (3) 内訳（今の本体に無い声）

拡張子ごと

| 拡張子 | 過去にだけ（数・未圧縮・pack 上） | HEAD に在るが台帳外 |
|---|---|---|
| `.wav.wav` | 19,329・913.5MB・790.9MB | 1,752・372.1MB・289.3MB |
| `.m4a` | 62・2.4MB・2.4MB | 2,188・67.0MB・65.8MB |
| `.wav` | 0 | 12・1.8MB・1.4MB |
| `.ogg` | 0 | 6・0.09MB・0.09MB |

置き場所ごと（最初に見たパスで分類）

| 場所 | 過去にだけ | HEAD に在るが台帳外 |
|---|---|---|
| 直下 | 18,983・842.4MB・737.1MB | 2,219・78.2MB・73.7MB |
| `reports/`（voice-advice-out・voice-m4a-out・codec-test・voice-scenes-out） | 408・73.4MB・56.1MB | 1,739・362.8MB・282.9MB |

頭の名ごと（大きい物）

| 頭 | 過去にだけ | HEAD に在るが台帳外 |
|---|---|---|
| `advy-` | 17,793・753.1MB・664.6MB | 1,715・59.8MB・58.4MB |
| `advx-` | 971・90.8MB・72.5MB | 1,053・262.3MB・204.9MB |
| `advw-` | 2・0.07MB | 195・33.3MB・26.8MB |
| `advs-`／`advo-`／`adva-`／`advc-`／`advd-` | 計 549・67.1MB・53.0MB | 計 804・64.7MB・51.0MB |
| `scene-` | 0 | 44・16.3MB・12.8MB |

## (4) 履歴から声を抜いた時に減る見込み（pack 上から）

- 甲：過去にだけ在る声を抜く（今の tree は変えない）→ **約 793MB 減**。
- 乙：甲に加え、台帳外の声を今の tree からも消して履歴から抜く → **約 1,150MB 減**。
- 今使う声 690.2MB と声以外 889.6MB は減らない（声以外は repack の差分圧縮でむしろ縮み得る）。
- 抜いた後の gc で、重複・届かない物（約 1.1GB と見られる）も落ちる。.git は約 3.85GiB から、甲で 2.0GB 以下・乙で 1.6GB 以下の見込み。蔵（1.86GiB）は force push 後、GitHub 側の掃除（自動では即時に減らない。古い参照が残る間は残る）まで減らない。

## (5) 履歴を書き換える時に影響が出る物（読んで分かる範囲）

- **全 commit の hash が替わる**：声を最初に入れた commit より後の commit が全部（19,114 commit の大半）。
- **タグ**：`stable`（cf4e5904・v1505）・`check-pass`（3e851267）・`rescue-autostash-20260907`。filter-repo は付け替えるが、CLAUDE.md 作法46 五の `stable … commit cf4e5904` の字、報告・札に残る hash は古いまま指せなくなる。`check.yml` は `git checkout check-pass -- "$F"` で戻すので、`check-pass` を新しい履歴で押し直す要がある。
- **ブランチ**：`main`・`backup-main-0918`・`backup-main-1111`・`keep-voices`（声を残すための枝）・蔵の `origin/claude/git-push-lock-alignment-lzcte6`。全部書き換えるか消すかを決める要がある（消すのは作法46 ロ）。
- **蔵への押し**：`push -f`（main・タグ全部）が要る＝作法46 ロ（本人のヨシ）。押した後、他の写し（Actions の走り途中・遠隔の器・iPhone の Code の器のクローン）から古い履歴を押し戻されないようにする要がある。
- **~/.claude の押し手**：`git-push.ps1`・`push-mine.ps1`（関門・錠つきの押し）、見張りの自動押し。書き換えの間は止める必要がある（途中で自動 commit/push が入ると古い履歴と混ざる）。測りの間にも main は c0dc17e0 → 3fd6645f と進んでいた。
- **koushu-state**：別のリポジトリ（蔵 `kfsr148-art/koushu-state`・3,720 commit・alternates なし）。git-push.ps1 が写して押すだけで、履歴の書き換えの影響は受けない。作業木の共有（`git worktree`）も無し。
- **GitHub Pages**：配信は `check.yml` の `pack-site.js` が組む `_site/` を `upload-pages-artifact`→`deploy-pages` で上げる形で、履歴には依らない。書き換え後の最初の押しで一度配り直される。`state-deploy.yml` も同じ群れ（group: pages）。
- **Actions**：`actions/cache` は使っていない（キャッシュの影響なし）。checkout は `fetch-depth: 20` など浅いので影響は小さい。走り途中の走りは古い sha を持つ。
- **その他**：`.git/objects/pack/multi-pack-index` が在る（gc で作り直し）。`.git/config` に `[lfs]` の欄はあるが `.gitattributes` は無く LFS は使っていない。

## 測りの注意

- 書いたのはこの報告と scratchpad の一時ファイルだけ。gc・repack・push・タグ/枝の付け替えはしていない。
- commit の一覧は測り始め（main = c0dc17e0 の頃）の物。その後の数 commit は入っていない（声の量への影響は小さい）。
- 声の判定は拡張子だけ（`.m4a`・`.wav`・`.wav.wav`・`.ogg` 等）。
