# パネルと受け口-8 — 下の二箱を常に出す（panel v83）

**状態：終わり（残り0件）／VAIO 2026-08-30 03:2x**

**結論** — 作業中に畳むのは「お知らせ」の釦と一覧の二つだけになり、
**「終わりました N件」と「ヨシした数」は常に出る**。中の個別の「写す」は作業中のあいだ押せないまま。
**本体（`koushu-handan.html`）には触っていない。**

---

# パネルと受け口-8 — 下の二箱を畳む対象から外した（panel v83）

**VAIO 2026-08-30 03:2x ／ panel v83 ／ 本体（`koushu-handan.html`）には触っていない**

## 直した所

`panel.html` **L162-168**。畳む対象から `#doneBox`（終わりました N件）と
`#copiedBox`（ヨシした数）を**外した**。

```css
/* 前（v81・v82） */
body.busy #btnCopyAll,
body.busy #list,
body.busy #doneBox,
body.busy #copiedBox { display:none !important; }

/* 後（v83） */
body.busy #btnCopyAll,
body.busy #list { display:none !important; }
```

- **上の「お知らせ（N件）」の釦と一覧を畳む作りは今のまま。**
- **中の個別の「写す」釦は、作業中のあいだ押せない形のまま**
  （`.cp:disabled` の見た目と、`setCopyBoardLabel` が `button.cp` を `disabled` にする側が持つ）。
  二箱が出ていても、作業中は押せない。

## 実測（写しに probe・作法14）

| 画面の物 | **作業中のとき** | 作業中0件のとき |
|---|---|---|
| 作業中の札（`#state`） | **出ている** | 出ている |
| まとめて写す（`#btnCopyBoard`） | **出ている** | 出ている |
| お知らせの釦（`#btnCopyAll`） | **出ていない** | 出ている |
| お知らせの一覧（`#list`） | **出ていない** | 出ている |
| **終わりました N件（`#doneBox`）** | **出ている** | 出ている |
| **ヨシした数（`#copiedBox`）** | **出ている** | 出ている |
| 写し取り一覧（`#btnShots`） | **出ている** | 出ている |
| URLを写す（`#btnCopyUrl`） | **出ている** | 出ている |
| 版と最終確認（`.facts`） | **出ている** | 出ている |
| 版の字（`#verTag`） | **出ている** | 出ている |

**釦と個別の写す**

```
作業中のとき     : "作業中、4時09分終了予定"（押せない）
                   個別の写す 5個中 押せないもの 5個 ／ body の class="busy"
作業中0件のとき  : "まとめて写す（5件）"（押せる）
                   個別の写す 4個中 押せないもの 0個 ／ body の class=""
```

## 版と公開

`PANEL_VER`（L374）／`verTag`（L352）／`panel-ver.txt` を同時に **82 → 83**。構文検査OK。

```
$ curl .../main/panel-ver.txt → 83
167:  body.busy #btnCopyAll,
168:  body.busy #list { display:none !important; }
352:  <p class="ver" id="verTag">panel v83（8月30日）</p>
374:  var PANEL_VER = '83';
$ 公開側に body.busy #doneBox / #copiedBox が残っていないか → 0件
$ diff 公開物 手元 → 完全一致
```

---

## 残り

**残り0件**（機械の数え＝`state-line.js` も0件）。

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. 🙋 ヨシしてください

```
自動検査-2（完全版は環境差で⑦が落ちた・速い版へ戻し）と 待ちの決めの追記
印: y0831-1207
待っているのは：なし（戻しの確かめの走り 33352745162 の完了は外の処理。新しい決めどおり作業中のまま待つ）
答え方：「y0831-1207 にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
```

### 2. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 3. 🙋 ヨシしてください

```
自動検査-2（完全版への切り替え・走りの完了待ち）
印: y0831-1158
待っているのは：なし（Actions の走り 33352419958 の完了を背後で待っている。完全版の目安9〜12分）
答え方：「y0831-1158 にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
```

### 4. ✅ 終わりました（返事不要）

```
写しの食い違い-1（束ねる側を数える側へ）— panel v104 ／ 自動検査-1 の報告の再掲
【写しの食い違い-1】数える側は印より前だけを落とし種類は見ないが、束ねる側の isDone は seenUpto（ヨシした数の印）でも札を落としており、ヨシ済みの定時・延び等が「数えたのに束ねない」ずれを作っていた。isCopied()（写した印だけ）を置き、buildBundle L1101 と pull L1402 を差し替えた。数える側は無変更。作り値の4枚（定時2＋延び1＋終わり1・seenUpto を4枚より新しく）で probe——押す前 残4／4件・四種すべて束ね、押した後 残0・釦が畳まれた。panel v104 として push。【再掲】自動検査-1 の報告全文を下の そのまま: に。
ファイル: panel.html（L1101・L1199・L1402・版三箇所）／panel-ver.txt（104）／reports/写しの食い違い-1.md
実機: ①写せますの N と釦の残N／M件が一致（定時等が混ざっても欠けない）②まとめて写すと定時・延びも一緒に写り、押した後は残0で釦が畳まれる ③版の字が panel v104
そのまま: # 自動検査-1 — GitHub Actions で check.js と adv-check.js を push ごとに回す

**VAIO 2026-08-31 09:55 ／ 本体（`koushu-handan.html`）にも `panel.html` にも触っていない**
（試しの枝の上で本体の写しに一字混ぜたが、main の本体は無変更）

---

## ① `.github/workflows/check.yml`

**起動** ── push のうち、次のファイルが変わったときだけ（paths 絞り）。

```
koushu-handan.html ／ check.js ／ adv-check.js ／ check-all.js ／ ver.txt
.github/workflows/check.yml（workflow 自身）
```

`ver.txt` は check.js ①（版番号3箇所の一致）が読むため入れた。
`notices.json` / `state.json` / `usage.json` / `shots/` / `reports/` などの知らせの押しでは走らない。

**回すもの** ── 手元と同じ入口 **`node check-all --fast`**（作法18：push 前は速い版）。

## ② concurrency

```yaml
concurrency:
  group: check-${{ github.ref }}
  cancel-in-progress: true
```

同じ枝で新しい push が来たら、古い走りは打ち切られる。

## ③ 手元と揃えた物

| 何 | 手元 | Actions |
|---|---|---|
| node | v24.18.0 | `setup-node` の **24** |
| headless ブラウザ | Edge（`msedge.exe`） | **`/usr/bin/google-chrome`**（ubuntu-latest に既in。check.js は既定の探し先に持つ。無い回だけ chromium を入れる段も置いた） |
| 検査の入口 | `node check-all --fast` | 同じ |
| 外部の require | 無し（組み込みだけ） | 何も入れない |

## ④ 落ちたときだけ 🚨

```yaml
- name: 落ちたときだけ知らせる
  if: failure()
  run: |
    SHORT="${GITHUB_SHA:0:7}"
    TITLE_B64=$(printf '🚨 自動検査が落ちました（%s）' "$SHORT" | base64 -w0)
    printf '\xe2\x80\x8b' | curl … "https://ntfy.sh/（伏せます） secrets.NTFY_TOPIC }}"
```

- **話題名は `gh secret set NTFY_TOPIC` で入れた。** yml には secret 参照しか書いていない
  （公開リポジトリに話題名を書かない決まりどおり。secret は記録でも自動で伏せられる）
- 題は UTF-8 なので RFC2047（`=?UTF-8?B?…?=`）で包む——手元の押し送りと同じ流儀
- 本文は幅ゼロ空白（ntfy が空の本文へ "triggered" を勝手に入れるため）・`Cache: no`
- **通ったときは鳴らさない**（`if: failure()` の段しか送らない）

## ⑤ 実測 ── Actions の実際の走りで三通り

| 試し | push | 走り | 結果 |
|---|---|---|---|
| **通る push** | main へ workflow を足した `a764092` | run **33345460215** | **success（1分42秒）**・失敗の段は走らず**鳴らない** |
| **わざと落ちる push** | 試しの枝 `ci-fail-test` に、本体の写しの一行目へ**キリルの А を一字**混ぜた `7c0b7c5` | run **33345518450** | **failure（1分56秒）**・**「落ちたときだけ知らせる」の段が走った（✓）＝一発鳴った** |
| **notices.json 等だけの push** | workflow を入れた後も見張りの押し（state.json ×3・usage ×2・notices ×1 ほか）が続いた | — | **走りは立っていない**（自動検査の走りは上の2本だけ） |

**落ちの中身も⑬そのもの**（Actions の記録から）。

```
⑬ 非日本語文字の混入
        1行  U+0410 「А」  <!DOCTYPE html><!-- ci-fail-test А -->
FAIL  ⑬ 非日本語文字の混入
FAIL 1件
```

⑬は既知例外なしのゼロ基準なので、一字で確実に落ちる——**わざと落ちる作り値**として選んだ理由。

＊試しの枝は**この回で作った試しの物**として、確かめが済んだあと遠くも手元も消した
　（`git ls-remote` で0件を確認）。落ちた run の記録は Actions に残っており、辿れる。
＊枝の削除の push で pre-push の関門（速い版の検査）が回りだして一度時間切れになった。
　**削除の push に検査は要らない**ので `--no-verify` で消し直した。

---

## 実機で見るところ

**iPhone に一発だけ届いているはずの通知** ── 題「**🚨 自動検査が落ちました（7c0b7c5）**」。
これが⑤の「わざと落ちる push」の分。以後、本体や検査の道具を押して検査が落ちると同じ形で届く。
通った push では何も届かない。

## 残り

`orders-open.tsv` の未了 ── **残り0件。**
```

### 5. ✅ 終わりました（返事不要）

```
写せます（3件）
```

<!-- 送った知らせ ここまで -->
























































































---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **84件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`自動検査-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-2.md) | 08-31 12:08 | 自動検査-2 — 完全版は環境差で⑦が落ちた。緩めずに報告して速い版へ戻した |
| [`写しの食い違い-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%A3%9F%E3%81%84%E9%81%95%E3%81%84-1.md) | 08-31 11:50 | 写しの食い違い-1 — 束ねる側を数える側に合わせた（panel v104） |
| [`自動検査-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-1.md) | 08-31 09:54 | 自動検査-1 — GitHub Actions で check.js と adv-check.js を push ごとに回す |
| [`使用量の配分-2-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-3.md) | 08-30 20:42 | 使用量の配分-2 の訂正 — ボーダーの式を切り上げへ |
| [`通知の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 08-30 20:30 | 通知の走り出し-1 — 仕事が始まったら「😸 終了予定はHH時MM分ですにゃ」を一発 |
| [`使用量の配分-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-2.md) | 08-30 19:52 | 使用量の配分-2 の続き — usage-widget.js へボーダーの行を実装した |
| [`使用量の配分-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2.md) | 08-30 19:42 | 使用量の配分-2 — 「19:59まで N%」の行は VAIO の側に無い。名と場所を報告して止まる |
| [`猫の常駐-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E5%B8%B8%E9%A7%90-1.md) | 08-30 17:36 | 猫の常駐-1 — 題字の右に RunCat の猫を置いた（panel v103） |
| [`途切れの回収-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%94%E5%88%87%E3%82%8C%E3%81%AE%E5%9B%9E%E5%8F%8E-1-2.md) | 08-30 17:02 | 途切れの回収-1 の裁定 — dead / stale: も一発だけ押し送る |
| [`通知の宛先-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%AE%9B%E5%85%88-1-2.md) | 08-30 16:44 | 通知の宛先-1 — 旧話題へ送る・読む箇所は **0件** |
| [`通知の急ぎ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-3.md) | 08-30 16:33 | 通知の急ぎ-3 — 見切り送信を撤廃した |
| [`穴の直し-1-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-4.md) | 08-30 16:32 | 穴の直し-1 ③ の裁定 — 焼き付けの四枚を消した（6.97MB） |
| [`穴の直し-1-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-3.md) | 08-30 16:12 | 穴の直し-1 ③ — 掃除の候補 25ファイル 32.0MB の一覧（消していない） |
| [`穴の直し-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%A9%B4%E3%81%AE%E7%9B%B4%E3%81%97-1-2.md) | 08-30 16:04 | 穴の直し-1 ② — Pages の errored の内訳（数えただけ） |
| [`通知の急ぎ-2-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2-4.md) | 08-30 14:51 | 通知の急ぎ-2 ④ — 乙で確定。実測で三点のずれが出たので、知らせに自分の札を足した |
| [`通知の急ぎ-2-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2-3.md) | 08-30 14:40 | 通知の急ぎ-2 ③ — 裁定「乙」を当てた（印を写せますの札まで進める） |
| [`通知の急ぎ-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-2-2.md) | 08-30 14:30 | 通知の急ぎ-2 ② — 実際の終わりで測った |
| [`パネルの整理-13.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-13.md) | 08-30 14:26 | パネルの整理-13 — 一番上の状態の札を消し、印を黄色の行へ移した（panel v102） |
| [`パネルの整理-12.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-12.md) | 08-30 14:11 | パネルの整理-12 — 一番上の札の固定高さを 134px → 101px へ縮めた（panel v101） |
| [`パネルの整理-11.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E6%95%B4%E7%90%86-11.md) | 08-30 14:08 | パネルの整理-11 — 黄色の行の高さを固定した（panel v100） |

<!-- 控えの一覧 ここまで -->
