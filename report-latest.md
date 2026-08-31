# 検査の取りこぼし-1 — 打ち切りは「落ちた」ではなく「測れなかった」として扱う

**状態：終わり（残り0件）／VAIO 2026-09-01 06:0x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — ⑦の打ち切り（ブラウザが返らない）を**溢れの落ちから切り離した**。打ち切った組み合わせは
**掃除してから一度だけ自動でやり直し**、やり直して測れれば落ちに数えない。二度とも駄目なときだけ
**「測れなかった組み合わせ」**という別の題で挙げる。置き去りのブラウザの掃除は**走りの前後**にも入れた。
作り値二通りと実走で確かめ、どれも狙いどおり。

---

## ① なぜ✗2件が出たのか

⑦は視野ごとに headless を起こすが、**プロファイルは一つ（`tmp/prof`）を使い回す**作り
（毎回新しく作ると初回の支度で一版90秒かかるため）。ここに**前の検査の置き去りが居ると、
次の起動が profile の singleton ロックを待ち続けて返らない**。

今夜の一回目（v1435 の速い版）はまさにその状態だった。

- 直前に、時間の上限に当たった速い版を強制終了しており、**`koushu-` の msedge が2本残っていた**
- CPU も **66%** で、起動そのものも遅かった
- 結果、**title 568x320 と judged 568x320 が120秒で打ち切られ**、`✗` として数えられた
- 掃除して（残骸0本・CPU 44%）回し直したら **19/19・全てPASS**

**打ち切りは「溢れている証拠」ではない。** それを `ng()` で溢れと同じ扱いにしていたのが取りこぼしの元。
＊機械の側にも兆候は出ていた——`watch-notify` の 22:33:01 に
`★逆向きの疑い：鍵は done:…（止まっている扱い）なのに CPU 17.2%`。

## ② 「測れなかった」の区別と、自動のやり直し（`check.js` ⑦）

```
打ち切り（一回目） → note「…返らないため打ち切った → 掃除してやり直す」
                    → sweep（置き去りを落とす）→ 同じ組み合わせをもう一度
   ├ 測れた   → 落ちに数えない（まとめに「打ち切りからやり直した組み合わせ N件」と出す）
   └ また駄目 → note「やり直しても返らない（測れなかった）」
                → まとめで ✗「測れなかった組み合わせ N件（溢れの落ちではない）」
                  ＋「溢れは 0件（測れなかった分を除く）」
```

- **`bad`（溢れの数）には一切足さない。** 溢れと測定不能を混ぜない。
- **黙って PASS にもしない。** 測れていない以上「溢れなし」とは言えないので、
  ⑦は落ちる。ただし**題が違う**ので、報告を読めば本体の悪化か機械の都合かが分かる。
- 「測った組み合わせ」の数は測れた分だけを数える（18/19 のように出る）。

## ③ 置き去りの掃除（走りの前後）

```js
const sweep = (when) => { … 'koushu-view-' を含む msedge/chrome だけを落とす … };
sweep('走りの前');   // ⑦に入る前
…（打ち切りのたびにも sweep）…
sweep('走りの後');   // ⑦を出るとき
```

**目印は写しの一時ディレクトリ名（`koushu-view-`）**で、**この検査が起こした分だけ**に当てる。
ゆるく当てると人が開いているブラウザまで落とすため（作法の「置き去りの検査を片付ける」と同じ流儀）。
Windows は PowerShell の `Get-CimInstance`＋`Stop-Process`、それ以外は `pkill -f`。

## ④ 実測

**作り値**（作法14「写しに probe」。本体の `check.js` には仕掛けを入れず、**写しの待ち時間だけ**短くして
打ち切りを故意に起こした）

| 通り | 出力 | 判定 |
|---|---|---|
| **一回目だけ打ち切り** | `title 568x320：…打ち切った → 掃除してやり直す`／`測った組み合わせ : 19 / 19`／`打ち切りからやり直した組み合わせ : 1件`／`✓ どの視野でも、はみ出し・重なり・横溢れなし` | **⑦は PASS**。全体は FAIL にならず、**該当分だけやり直された** |
| **やり直しても打ち切り** | `やり直しても返らない（測れなかった）`／`測った組み合わせ : 18 / 19`／`✗ 測れなかった組み合わせ 1件（溢れの落ちではない…）`／`溢れは 0件（測れなかった分を除く）` | **落ちとは別の題**で挙がる |

＊作り値の走りでは①②④の項目にも ✗ が出るが、これは**写しを一時ディレクトリから回したため**
（`ver.txt` や音声ファイルを写しの隣に探しにいく）。⑦の振る舞いとは関係がない。

**実走**（本物の `node check-all --fast`・05:49:55〜06:01:45）

```
測った組み合わせ : 19 / 19（視野 568x320 900x381 ＋ judged だけ 844x390）
✓ どの視野でも、はみ出し・重なり・横溢れなし
  PASS  check      本体の納品前チェック
  PASS  adv-check  探偵編の回帰（即死罠・時間切れ）
両方PASS
```

**打ち切りは0件**（走りの前の掃除が効いて、一回目から普通に測れた）。

## 触ったもの

`check.js` の⑦のみ（`sweep` の追加、`run()` のやり直し、まとめでの区別）。
**本体には触っていない。** 版も上げていない（`check.js` は配られる物ではないため）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **93件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`通知の急ぎ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E6%80%A5%E3%81%8E-3.md) | 08-30 16:33 | 通知の急ぎ-3 — 見切り送信を撤廃した |

<!-- 控えの一覧 ここまで -->
