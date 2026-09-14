# 人柄の言葉の棚卸し-1（前半四人）

**調べた** — 2026-09-14 22:1x（VAIO）。本体には触っていない。

見立て行の文は **`toneAngleLine()`（`koushu-handan.html` L4604〜）** が組み、`saySet()` がそのまま入れる。
**方言の差し替えは見立て行には掛かっていない**ので、下に写した字がそのまま画面に出る字。
前半四人の分岐は **15通り**（執事2・軍師6・ずんだ4・お嬢様3）。

＊中かっこは差し込まれる値。`{牌}` は小さな牌の絵（`tileChip`）、`{役}` は「盾」「雀頭」「攻めの種」などの役目の名、
`{色}` は萬子・筒子・索子のいずれか、`{n}` は数。どれも `toneFacts()` が判定のたび一度だけ組んだ材料（`window._lastFacts`）から来る。

## 執事（2通り）

| 場合 | 文 |
|---|---|
| 掛け持ちがある | `{牌}に、{役1}と{役2}を掛け持ちさせております。人手が足りませぬ。` |
| 掛け持ちが無い | `持ち場の重なりはございません。皆、専任でございます。` |

## 軍師（6通り）

| 場合 | 文 |
|---|---|
| 鳴きの種が無く 向聴3以下 | `仕掛けの種は無いが、門前でも十分に速い。このまま進むべし。` |
| 鳴きの種が無く 向聴4以上 | `仕掛けの種が無く、門前では遠い。辛抱の一局になるぞ。` |
| 厚みだけ（`atsumi`）・向聴3以下 | `仕掛けの種は無いが、{色}が一番厚い。門前でも十分に速い、このまま進むべし。` |
| 厚みだけ（`atsumi`）・向聴4以上 | `仕掛けの種が無く、門前では遠い。{色}が伸びれば、仕掛けの道も開くなり。` |
| 役牌の対子（`yakuhai`） | `{牌}が二枚。鳴けば一気に仕掛かるぞ。門前に縛られるな。` |
| 染め | `{色}に寄せて鳴く道もある。仕掛けは我の領分なり。` |

## ずんだ（4通り）

| 場合 | 文 |
|---|---|
| かぶり無し・細いまとまりあり | `かぶりは無いのだ。でも細いまとまりが {n} 個あるのだ。` |
| かぶりも細いまとまりも無い | `かぶりも無いし、細いまとまりも無いのだ。素直な手なのだ。` |
| 二度受け（`double`） | `{牌}を二つのまとまりで取り合ってるのだ。損なのだ。` |
| 筋被り | `{牌A}と{牌B}、待ちが同じ筋にかぶるのだ。もったいないのだ！` |

## お嬢様（3通り）

| 場合 | 文 |
|---|---|
| 盾が薄い（`thin`） | `切れる牌が、ほとんどありませんの。窮屈な手ですわ。` |
| 序盤で使い切る（`early`） | `この手、序盤で盾を使い切る算段ですわ。終盤は丸腰でしてよ。` |
| 終盤まで残る | `盾は終盤まで残る並びですわ。良い心がけですの。` |

**後半四人（マダム・一姫・先生・兎）は次の札に出す。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **226件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`人柄の言葉の棚卸し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BA%BA%E6%9F%84%E3%81%AE%E8%A8%80%E8%91%89%E3%81%AE%E6%A3%9A%E5%8D%B8%E3%81%97-1.md) | 09-14 22:16 | 人柄の言葉の棚卸し-1（前半四人） |
| [`v1442-確かめ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/v1442-%E7%A2%BA%E3%81%8B%E3%82%81.md) | 09-14 22:13 | v1442 の確かめ（四件）と 見張りの止まり-2 |
| [`y0914-2115.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0914-2115.md) | 09-14 21:17 | 投票欄の角と釦の押せ（印 y0914-2115） |
| [`合わせ技-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-4.md) | 09-14 21:06 | 合わせ技-4（合計を六つの区切りで帯に切る） |
| [`合わせ技-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-3.md) | 09-14 20:58 | 合わせ技-3（五分割の持ち回りで五回測る） |
| [`合わせ技-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-2.md) | 09-14 20:44 | 合わせ技-2（八人の合計の上位だけを攻めにする） |
| [`合わせ技-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%90%88%E3%82%8F%E3%81%9B%E6%8A%80-1.md) | 09-14 20:31 | 合わせ技-1（八人の点数の重み付き合計） |
| [`y0913-0015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0913-0015.md) | 09-13 00:34 | 配信の切り分け-1（印 y0913-0015） |
| [`y0912-2100.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2100.md) | 09-12 21:21 | 選択釦-1 — v1439（印 y0912-2100） |
| [`y0912-2015.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-2015.md) | 09-12 20:16 | ヨシの猫-7 — ヨシ待ちの頭を現場猫の顔へ（印 y0912-2015） |
| [`y0912-1940.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1940.md) | 09-12 19:44 | ヨシの猫-6 — 現場猫の置き場を三つへ（印 y0912-1940） |
| [`y0912-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-1915.md) | 09-12 19:14 | ヨシの猫-5 — 現場猫の絵を綺麗にした（印 y0912-1915） |
| [`検査を雲へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%82%92%E9%9B%B2%E3%81%B8-1.md) | 09-12 13:42 | 検査を雲へ-1 — Actions で検査し、通った版だけ配信する |
| [`知らせの押し-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-2.md) | 09-12 12:31 | 知らせの押し-2 — 束ねない題と、小さな押しを通す／㉑〜㉔の今の状態 |
| [`知らせの押し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%8A%BC%E3%81%97-1.md) | 09-12 12:04 | 知らせの押し-1 — 03:00 以降に押した一覧と、09:47 の「延びています」が題を失った理由 |
| [`見張りの止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-12 11:04 | 見張りの止まり-1 — 段の時間切れ・空きの関門・止まりの知らせ |
| [`札の本文-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%9C%AC%E6%96%87-1.md) | 09-12 09:54 | 札の本文-1 — 終わりの札が前の仕事の文で出る／遠隔の橋-1 を閉じた |
| [`外の見張り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-2.md) | 09-12 04:09 | 外の見張り-2 — claude.exe が0本なら /fail を打つ |
| [`外の見張り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-1.md) | 09-12 03:46 | 外の見張り-1 — 巡回の末尾で hc-ping.com へ一分に一発 |
| [`読むだけの台本-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%82%80%E3%81%A0%E3%81%91%E3%81%AE%E5%8F%B0%E6%9C%AC-1.md) | 09-12 03:26 | 読むだけの台本-1 ／ 鉤の軽量化-1 ／ 巡回の空き-1 ／ 人手待ち-1 ／ 知らせの割り当て-1 ／ 重複の枠-1 |

<!-- 控えの一覧 ここまで -->
