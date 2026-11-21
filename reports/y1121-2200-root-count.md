# 直下の物の数え（読むだけ）— y1121-2200

状態：終わり（読むだけ・消す/動かす/commit なし）— 21:44

## やり方
- 直下（最上階のファイルだけ）を node の `readdirSync`＋`statSync` で**一度だけ**回し（26,957本・2.8秒）、JSON に控えて以後はそれで数えた。
- 追跡の有無は `git ls-files -z -- ':(glob)*'`（直下だけ）で 26,943本を取り、突き合わせた。
- `du`・`find` の全体走査はしていない。

## 一、種類ごとの数と MB（直下・計 26,957本・956.0MB）

| 種類 | 数 | MB | うち追跡 | 追跡 MB |
|---|---:|---:|---:|---:|
| .m4a | 22,778 | 721.4 | 22,778 | 721.4 |
| .wav.wav（二重拡張子） | 3,981 | 181.2 | 3,981 | 181.2 |
| .wav（一重） | 0 | 0 | 0 | 0 |
| .png | 70 | 27.8 | 69 | 26.5 |
| .html | 4 | 11.3 | 4 | 11.3 |
| .tsv | 3 | 4.8 | 3 | 4.8 |
| .txt | 21 | 4.3 | 18 | 4.3 |
| .json | 32 | 3.6 | 28 | 3.3 |
| .js | 54 | 1.3 | 54 | 1.3 |
| .md | 5 | 0.2 | 5 | 0.2 |
| .bak-*（3種） | 4 | 0.2 | 0 | 0 |
| .ps1 | 1 | 0.0 | 1 | 0.0 |
| 拡張子なし（SUB_SLEEP・SUB_VIDEO・`-`） | 3 | 0.0 | 1（`-`） | 0.0 |
| **名が「-」** | 1 | 7,178 バイト | 1 | — |

声の内訳：.m4a は advy 21,118（679.7MB）・advx 1,145（32.8MB）・advw 98・advs 126・advc 126・adva 56・advd 41・advt 34・advn 14・advh 12・advk 7・adv 1。
.wav.wav は advy 3,931（170.2MB）・scene-* 27（9.3MB）・数字 0〜13 の14本・attack/defend/yoshi/dame/star/hash・color-man/pin/sou。

未追跡は14本だけ（png 1：genba-taiki.png 1.3MB／notices-*.json 4／bak 4／SUB_* 2／txt 3）。声はすべて追跡。

## 二、使われているか（判定の仕方と結果）

**判定の仕方（突き合わせた字）**
- **advy-・advx- の声（pack-site.js の `isManaged` = `/^(advy|advx)-.*\.(wav\.wav|m4a)$/`）**：ファイル名そのもの（`advy-xxxxxxxx.m4a`）を `voice-used.txt` の行と完全一致で照合。voice-used.txt は `voice-advice-dial.json` のキーと `voice-advice.txt` の1列目から作られる台帳（pack-site.js `makeManifest`）。本体の名は `'advy-' + advHash(text)`（本体 3118行）で組むので、dial.json に無い名は本体から呼ばれない。補足：使われていない advy 5,612本の名（拡張子なし）を本体・核（advice-tone-core.js）・voice-advice-catalog.js の字面で探したが **0件**。
- **他の adv*-.m4a**：拡張子を外した名を `voice-advice.txt` の1列目（`.wav.wav` を外した形）と完全一致で照合。advn-0〜13 だけ台本に無いが、本体が `'advn-' + x.n`（3510・3512行）で組むので使われている（voice-pieces.js が作る部品）。
- **非 adv の .wav.wav**：本体が名を組む箇所と照合 — 1899行 `['attack','defend','yoshi','dame','0','star','hash']`＋`1..13`、1992〜1995行 `scene-some-{man,pin,sou}-{6..13}`・`scene-yakuhai`・`scene-nashi`、3509行 `'color-' + suit`（reader.html 67〜68行も同じ）。
- **声以外**：ファイル名の字面を、直下の追跡されている文字の物（js/html/json/txt/md/tsv/ps1 など・自分自身は除く）と `.github/workflows/*.yml` から探した。**サブディレクトリ（tools/ など）と `~/.claude` の台本は探していない**ので、「名が出ない」は候補止まり（使う道具が外にあり得る）。本体の画像は base64 で 28 枚埋め込まれており、png ファイルは名で呼ばれていない。

**使われていない物**

| 区分 | 数 | MB | 公開の荷に入っているか |
|---|---:|---:|---|
| A：advy-*.m4a で voice-used.txt に無い（dial.json にも無い） | 1,681 | 54.9 | 入っていない（isManaged で外れる） |
| B：advy-*.wav.wav で同名の m4a があり台帳に在る（m4a が読めない時の落とし先だけ） | 35 | 1.2 | 入っていない（台帳は .m4a の名だけ） |
| C：advy-*.wav.wav で同名の m4a 無し・dial.json にも無い | 3,896 | 169.0 | 入っていない |
| D：scene-some-tail.wav.wav（voice-join.js の材料。本体は呼ばない） | 1 | 0.24 | 入っている |
| E：名が「-」 | 1 | 0.007 | 入っている |
| F：notices-*.json（追跡8・未追跡4） | 12 | 1.1 | 追跡の8本・0.8MB が入っている |
| G：*_src.png（剣士の元絵。CLAUDE.md 21「原版として残す」） | 17 | 16.4 | 入っている |
| H：その他の png（kishi_*・hoshi_*・genba-cat-*・IMG_8974 等。名が出ない） | 28 | 2.7 | 追跡の27本・1.4MB が入っている |
| I：未追跡の .bak と SUB_SLEEP・SUB_VIDEO | 5 | 0.1 | 入っていない |
| J：追跡の js/json/txt/md/ps1 で名が出ない（試し台・候補表・README など19本） | 19 | 0.1 | 入っている |

声の小計：使われていない声は **5,613本・225.3MB**（A＋B＋C＋D）。うち荷に入っているのは D の1本（0.24MB）だけ。
voice-used.txt の 20,582本は全部直下に在る（欠け0）。

J の19本：advice-chara-audit.js core-crosscheck.js mitate-new-2.txt mitate-new.txt neko-bun-kouho.json neko-EF-2026.json package-lock.json panel-broken-probe.js panel-mach-probe.js panel-mail-probe.js panel-subj-probe.js README.md release-stable.ps1 setsumei-kouho-0917.json state-line.js urls.md voice-advice-dial-redo.txt（0バイト）voice-user-dict.json voice-yomi-terms.txt（※voice-user-dict.json・voice-yomi-terms.txt は tools/ の声づくりが読む見込みで、サブディレクトリを探していないため「名が出ない」に入った。消す案には入れない）。

## 三、名が「-」のファイルと、入った訳

- **中身**：文字の物（JavaScript・150行・7,178バイト）。頭は `global.window = {};` から始まり、`function cutShanten(tiles, mode)`（本体の向聴の写し）・`pickCutTile`・`acceptTypes` などを並べ、末尾は `module.exports = { pickCutTile, cutShanten, window: global.window };`。**v1436 の「切り候補」を node で試すための試し台**で、本体や検査から読まれていない。
- **入った訳**：commit **d3984e05**（2026-09-06 19:53:52「v1436：切り候補の作り値と check.js ⑱（写しの見張り）」）で `A -`（150行）として、本体・check.js と一緒に入った。それ以後は変わっていない（ファイルの更新時刻 09-06 19:49）。標準出力のつもりの「-」（`node -`・`> -` など）が名前として書き出され、そのまま一緒に add された見込み（`git log --follow` は HDD で110秒を超えたので止め、commit を直に見て確かめた）。
- 公開の荷に入っている（isManaged に当たらない直下の追跡物なので、7KB）。

**二重拡張子の声の入り方**
- c83d6e32（2026-07-19 20:05「Add files via upload」）は **0.wav.wav・hash.wav.wav・star.wav.wav の3本だけ**。手で上げた最初の声で、今も本体が呼ぶ（使われている）。
- advy-*.wav.wav（3,931本）は、その後の雲の声づくり（VOICEVOX・IMA ADPCM）で入った方言の声。11-18 に AAC（m4a）へ替え、7199c37b（11-18 15:29）で「m4a に置き換わった .wav.wav（甲）5,548本・289MB」を消し、**乙と非 adv は残した**。残った乙が今の 3,931本（C の 3,896本＋B の 35本）。
- A の 1,681本は 4a213bfe（11-19 11:37「台本から外れた1681本を外す」）で台帳から外れた m4a で、ファイルは直下に残っている。

## 四、片づけた時に減る大きさ（消す案・本人の決め待ち）

公開の荷は雲（check.yml）が checkout した物から pack-site.js で組むので、**荷に効くのは追跡されていて、かつ isManaged に当たらない物だけ**。いまの荷は 747MB（site-size.txt）、うち直下の分 729.1MB。

| 案 | 種類 | 数 | MB | 荷が減る MB | 備考 |
|---|---|---:|---:|---:|---|
| 1 | A：台帳外の advy m4a | 1,681 | 54.9 | **0** | リポジトリ（作業木）だけ減る |
| 2 | C：m4a 無しの advy wav.wav | 3,896 | 169.0 | **0** | 同上 |
| 3 | B：m4a ありの advy wav.wav | 35 | 1.2 | **0** | 本体の落とし先（m4a が読めない時）だが荷に無いので公開側では元から鳴らない |
| 4 | E：「-」 | 1 | 0.007 | 0.007 | |
| 5 | F：notices-*.json（追跡8） | 8 | 0.8 | 0.8 | 未追跡4本（0.3MB）は荷に無い |
| 6 | I：未追跡 bak・SUB_* | 5 | 0.1 | 0 | git 管理外 |
| — | D：scene-some-tail.wav.wav | 1 | 0.24 | 0.24 | voice-join.js の材料。消すなら荷から外す（pack-site.js）方が筋。案に入れない |
| — | G・H・J（png・試し台など） | 64 | 19.2 | 約17.9 | 原版（CLAUDE.md 21）や道具の入力を含む。名の照合が弱いので案に入れない |

**声の案（1〜3）の合計：5,612本・225.1MB。荷は 0MB 減る**（作業木と、消す commit 以後の checkout が軽くなるだけ。git の履歴には残るので .git の大きさは減らない）。
**荷が減る案（4・5）の合計：約0.8MB。**
＊消すのは git 管理下なので作法46 ②ロ（元に戻せない事）に当たる。本人のヨシ待ち。
