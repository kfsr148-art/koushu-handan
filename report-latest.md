# ウィジェットの自動更新-1 — 殻を新設して、Scriptable への貼り替えを不要にした

**状態：終わり（残り0件）／VAIO 2026-09-01 08:0x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — 公開側に **`usage-widget-loader.js`（殻）** を新設した。**この殻を一度だけ Scriptable へ貼れば、
以後は `usage-widget.js` をこちらで直すだけで端末に届く。** 取れた中身は端末のローカルへ控え、
取れなかった回は**控えで描く**（真っ白にしない）。控えも無い初回だけ「取得できませんでした」と出す。
四通りの実測とも狙いどおりで、公開側にも殻と本体の両方が配られている。

---

## ① 殻（`usage-widget-loader.js`）

```
取りに行く（?_chk=<時刻> を付けて中間の控えを挟ませない）
  ├ 取れた   → 端末のローカルへ控えを書き直し、その中身で描く
  ├ 取れない → 控え（前に取れた分）で描く
  └ 控えも無い → 「取得できませんでした」と出す（初回だけここへ来る）
```

- **途中で切れた中身を控えへ書かない。** 最後まで来た印（`module.exports`）が無ければ捨てる。
- 控えの置き場は `FileManager.local()` の documents（オフラインでも読める側）。
- 待ちは10秒。取得に失敗しても**例外で落ちず**、控えへ落ちる。

## ② 本体（`usage-widget.js`）の直し

末尾だけを直した。**ボーダーの式（`ceil((now−last)/24h)×100÷7`・最小1・上限7・分の丸め）も、
表示の形（`20:00まで N%` の添え方）も、一切変えていない。**

```js
module.exports = { build: build };

if (!globalThis.__USAGE_LOADER) {   /* 殻を通さず直に走らせたときは、今までどおり自分で貼る */
  const widget = await build();
  if (config.runsInWidget) { Script.setWidget(widget); }
  else { widget.presentSmall(); }
  Script.complete();
}
```

殻は `__USAGE_LOADER` を立ててから `importModule` するので、**中身は二重に貼らない**。
直に走らせる従来の使い方も、そのまま残っている。

## ③ 実測（Scriptable の道具を真似た台で、本物の殻と本物の中身をそのまま走らせた）

| 通り | 結果 |
|---|---|
| **(甲) 取得できる** | 描いた字＝`Claude 使用量／セッション／3%／4.0時間後／週全体／5%`。**控えに6561字を保存** |
| **(乙) 公開側を一字変える** | 次の回に **`Claude 使用量★`** が出た。**控えも新しい中身に入れ替わった** |
| **(丙) 取得を失敗させる** | **控えの中身で描けた**（`Claude 使用量★／セッション…`）。真っ白にならない |
| (丁) 控えも無い初回で失敗 | `取得できませんでした` ＋ `中身をまだ一度も取れていません。通信を確かめて、もう一度お試しください。` |

## ④ 公開側の実読み

| | 結果 |
|---|---|
| `usage-widget-loader.js` | **HTTP 200・2128字・手元と一致**。控えの仕掛けあり・初回の文言あり |
| `usage-widget.js` | **6561字・手元と一致**。`module.exports` あり・**ボーダーの式は今のまま** |

## 端末でやること（一度だけ）

Scriptable の台本（名は「Claude 使用量」）の中身を、**下の殻の全文で置き換える**だけ。
以後の直しは貼り替え不要で届く。

```js
/* Claude 使用量ウィジェットの殻（Scriptable）— 中身を取りに行って走らせるだけ
 *
 * これを **一度だけ** Scriptable に貼れば、あとは中身（usage-widget.js）を
 * こちらで直すだけで端末に届く。**貼り替えは要らない。**
 *
 * 置き方
 *   1. Scriptable で新しい台本を作り、この中身を貼る（名は「Claude 使用量」）
 *   2. ホーム画面のウィジェット（小 or 中）に Scriptable を置き、
 *      Script にこの台本、When Interacting は Run Script
 *
 * 何をするか
 *   ・公開側から usage-widget.js を取ってきて、端末のローカルへ控える
 *   ・取れた回は、その中身で描く（控えも新しくする）
 *   ・取れなかった回は、**控えで描く**（真っ白にしない）
 *   ・控えも無い初回だけ「取得できませんでした」と出す
 */

const SRC   = 'https://kfsr148-art.github.io/koushu-handan/usage-widget.js';
const NAME  = 'usage-widget.js';   /* 端末のローカルに置く控えの名 */
const TIMEO = 10;                  /* 取得の待ち（秒） */

const BG  = new Color('#0d1b16');
const FG  = new Color('#e8f0ea');
const HOT = new Color('#c0392b');

const fm   = FileManager.local();
const path = fm.joinPath(fm.documentsDirectory(), NAME);

/* 取りに行く。中間の控えを挟まないよう、毎回ちがう問い合わせにする（本体の ver.txt と同じ流儀）。 */
let fresh = null;
try {
  const r = new Request(SRC + '?_chk=' + Date.now());
  r.timeoutInterval = TIMEO;
  const t = await r.loadString();
  /* 途中で切れた中身を控えへ書かない。**最後まで来た印**（module.exports）が無ければ捨てる。 */
  if (t && t.indexOf('module.exports') >= 0) { fresh = t; }
} catch (e) { /* 取れないだけ。控えで描く */ }

if (fresh) { try { fm.writeString(path, fresh); } catch (e) { /* 書けなくても描ける */ } }

/* 控え（さっき書いた分か、前に取れた分）を読む。 */
let code = null;
try { if (fm.fileExists(path)) { code = fm.readString(path); } } catch (e) { }

if (!code) {
  /* 控えも無い＝いちばん最初の一回だけここへ来る。 */
  const w = new ListWidget();
  w.backgroundColor = BG;
  const t1 = w.addText('取得できませんでした');
  t1.font = Font.semiboldSystemFont(13);
  t1.textColor = HOT;
  w.addSpacer(4);
  const t2 = w.addText('中身をまだ一度も取れていません。通信を確かめて、もう一度お試しください。');
  t2.font = Font.systemFont(11);
  t2.textColor = FG;
  if (config.runsInWidget) { Script.setWidget(w); } else { w.presentSmall(); }
  Script.complete();
} else {
  /* 中身の側に「殻から呼ばれた」と伝える。中身は自分では貼らず、build() を渡してくる。 */
  globalThis.__USAGE_LOADER = true;
  const mod = importModule(path);
  const widget = await mod.build();
  if (config.runsInWidget) { Script.setWidget(widget); } else { widget.presentSmall(); }
  Script.complete();
}
```

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **94件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`ウィジェットの自動更新-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0-1.md) | 09-01 08:02 | ウィジェットの自動更新-1 — 殻を新設して、Scriptable への貼り替えを不要にした |
| [`検査の取りこぼし-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E5%8F%96%E3%82%8A%E3%81%93%E3%81%BC%E3%81%97-1.md) | 09-01 06:02 | 検査の取りこぼし-1 — 打ち切りは「落ちた」ではなく「測れなかった」として扱う |
| [`手牌の境目-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-3.md) | 09-01 03:47 | 手牌の境目-3 — `--vz-show` の745は据え置きで確定（掘り返さないための裁定の控え） |
| [`手牌の境目-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-2.md) | 09-01 03:07 | 手牌の境目-2 — 案Aを実装（v1434）。手元も Actions も 189/189 全通過 |
| [`手牌の境目-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-1.md) | 09-01 03:07 | 手牌の境目-1 — 746x375 の手牌が12px切れる件。境目は実測で 758px |
| [`状態の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8A%B6%E6%85%8B%E3%81%AE%E7%A9%B4-1.md) | 08-31 22:45 | 状態の穴-1 — 走っている最中に「次の指示待ち」へ落ちる件（外待ちで作業中を保つ） |
| [`検査の網-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E7%B6%B2-1.md) | 08-31 22:44 | 検査の網-1 — ⑦の視野を網の隙間まで広げた。境目 746x375 で手牌が12px切れている |
| [`自動検査-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-5.md) | 08-31 21:36 | 自動検査-5 — 丙を実装（v1432）。手元も Actions も完全版で全通過 |
| [`自動検査-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-4.md) | 08-31 20:53 | 自動検査-4 — 667x375 の溢れは v1431 で入った（.next-hand-row・21.3px） |
| [`待ちの決め-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%BE%85%E3%81%A1%E3%81%AE%E6%B1%BA%E3%82%81-2.md) | 08-31 12:15 | 待ちの決め-2 — 🙋 の関門に「待ちなしの回は立てない」を実装／⑦の材料 |
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

<!-- 控えの一覧 ここまで -->
