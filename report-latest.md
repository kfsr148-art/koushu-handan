# 受け渡しの守り-1 — Code タブと知らせのあいだに、二つの網を足した

**状態：終わり（残り0件）／VAIO 2026-09-01 17:1x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — **枠の取りこぼし**（指示を受けたのに動きが無い）と、**写しの空振り**（`そのまま:` の中身が
空か極端に短い）の二つを見張る形にした。今日の三件を突き合わせると、**二件はいまの仕掛けで拾える**が、
**「枠がまったく届かなかった」回は機械には痕跡が残らない**——ここは正直に拾えないと書く。

---

## ① 枠の取りこぼし（`ORDER_STUCK_MIN = 20分`）

指示を受けた刻（`last-order.txt` の一行目）から**20分**たっても、**控え（`work-note.txt`）が
一度も書き換わっていない**なら、**🕳 枠が届いていないかもしれません**を**一発だけ**押し送る。

本文 … 「指示を受けてから N分、控えが一度も書き換わっていません」／
「こちらがすること：枠が全部届いたかを確かめ、届いていなければ送り直してください」／
「Code タブへ貼った長い文は複数件に割れて届くことがあります。『以上』まで届いているかをご確認ください」。

- 印は**受領の刻そのもの**。新しい枠が来れば、また一発出る。
- **拾えるのは「受け取ったのに動きが無い」形**。割れた枠の片側だけが届いて止まった回はここに落ちる。
- **拾えないのは「まったく届かなかった」形**（受領の刻が動かないので、機械から見ると何も起きていない）。

## ② 写しの空振り（`RAW_MIN_LEN = 20字`）

控えに `そのまま:` の欄が**在る**のに、中身が**20字未満**なら、**その回は送らない**。
記録に「『そのまま』の中身が N字しかないので送らない（20字未満は空振りとみなす。書き直しを待つ）」と残す。
書き直せば次の巡回で送られる。

＊**異常（bad）の知らせだけは、空振りに関わらず出す。** あちらは手が要る合図なので止めない。

## ③ 今日の三件と、いまの仕掛け

| 今日あった件 | 前は | いまは |
|---|---|---|
| **枠の未着**（走り出し-1 の元の枠が二度とも届かなかった） | **拾えない**（人が気づくだけ） | **半分拾える** … 受け取ったのに20分動きが無ければ 🕳。ただし**一度も届かなかった枠そのもの**は痕跡が無く、依然として拾えない（＝こちらが「届いていません」と返す形が最後の砦） |
| **198分の沈黙**（外待ちの消し忘れで作業中のまま止まった） | 拾えない | **拾える** … 知らせの詰まり-1 で入れた網。外待ちが立ったまま控えが40分書き換わらなければ 🪟 を一発 |
| **空の写し**（`そのまま:` を載せる回に中身が無い） | そのまま送っていた | **拾える** … ②で、20字未満は**送らずに書き直しを待つ** |

## ④ 実測（判定の枝 L1673〜L1755 を字面のまま抜き出して作り値で回した）

| 通り | 結果 |
|---|---|
| **(甲) 指示から25分・控えは指示より古い** | **鳴る（🕳 枠が届いていないかもしれません）**／記録『異常の押し送りを一発出す（orderstuck:…）』 |
| (乙) 続けてもう一度 | **🕳 は鳴らない**／記録『押し送りはしない（… は既に一発送った。戻るまで出さない）』 |
| (丙) 指示から5分（まだ早い） | 🕳 は出ない |
| (丁) 指示のあとに控えを書いた | 🕳 は出ない |
| **(戊) `そのまま` が3字の終わりの回** | **送らない**／記録『「そのまま」の中身が 2字しかないので送らない…』 |
| (己) `そのまま` に中身のある終わりの回 | 送る |

＊(乙)(丙)(丁)(己) の「鳴る」は**ふつうの終わりの知らせ**（この抜き出しには本文を組む段が入っていないので
　題は空で出る）。見るべきは **🕳 が出るかどうか**で、そこは狙いどおり (甲) だけ。

**作る途中で一つ踏んだ** … `[DateTime]::TryParse($l1, [ref]$ot)` の `$ot` を `$null` のままにしていて、
**刻を読めず素通り**していた（PowerShell では `[ref]` に渡す変数の型が決まっていないと常に false）。
`[DateTime]$ot = [DateTime]::MinValue` として直し、測り直して (甲) が鳴るのを確かめた。

写し `.bak-20260901b`／構文OK **2402行**／BOM 有り／`watch-notify.ps1` は毎分呼び直しなので起こし直し不要。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **101件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`受け渡しの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%97%E3%81%91%E6%B8%A1%E3%81%97%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 17:30 | 受け渡しの守り-1 — Code タブと知らせのあいだに、二つの網を足した |
| [`パネルの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 16:57 | パネルの守り-1 — 返事パネルを検査の網に入れた |
| [`ウィジェットの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 15:24 | ウィジェットの守り-1 — ウィジェット側を検査の網に入れた |
| [`ウィジェットの猫の色-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E7%8C%AB%E3%81%AE%E8%89%B2-1.md) | 09-01 13:01 | ウィジェットの猫の色-1 — ウィジェットの猫を白へ（元絵とパネルはそのまま） |
| [`ウィジェットの状態表示-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E7%8A%B6%E6%85%8B%E8%A1%A8%E7%A4%BA-1.md) | 09-01 12:10 | ウィジェットの状態表示-1 — 返事パネルと同じ状態をウィジェットにも出した |
| [`殻の直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AE%BB%E3%81%AE%E7%9B%B4%E3%81%97-1.md) | 09-01 11:54 | 殻の直し-1 — 実機の `importModule` エラーは台本名と控え名の衝突。直に評価する形へ |
| [`知らせの詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-01 11:29 | 知らせの詰まり-1 — 「外待ち」の消し忘れで198分止まっていた。網を足した |
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

<!-- 控えの一覧 ここまで -->
