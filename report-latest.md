# 先の穴-1 — 生存を関門の外へ、訴えをその場で鳴らす

**状態** … 終わり／判定と札の作りには触っていない

## ① 帯の中の生存を、予定表の外から書く

**何が残っていたか** … 上限を外したので殺されはしなくなったが、
**重い検査の下では立ち上がりが遅れる**。21:48:03 に起こされた回が書けたのは **21:52:50**（4分47秒あと）で、
生存の間隔が **13分50秒**まで伸びていた（網の15分に迫る）。

**直した形** … `heavy-life.ps1` を作った。**帯の間だけ、予定表を通さずに書く手**。

- `heavy-on.ps1` が帯へ入るときに起こす。**4分ごと**に `hook-notice.ps1 -Kind heartbeat` を
  **同じ中で**呼ぶ（既に走っている手なので、**立ち上がりが要らない**）
- 帯が消えたら自分で終わる。消し忘れても **40分で必ず終わる**（置き去りにしない）
- 二重には走らない（`heavy-life.pid` を見て、生きていれば何もせず終わる）
- `heavy-off.ps1` が止める（次の一回を待たせないため）

**書き方は変えていない。**生存の行を組むのは今までどおり `hook-notice.ps1`。

**実地（帯を一回作った）**

```
22:19:05  帯に入った（帯の生存の手を起こした・PID 14116）
生存の刻と間隔
  21:58:21
  22:08:27  ＋606秒   ← 帯の外（予定表の10分）
  22:18:36  ＋609秒   ← 帯の外
  22:19:22  ＋46秒     ← **帯の中**（起こしてすぐ一回）
  22:23:30  ＋248秒    ← **帯の中**（4分08秒）
  22:27:33  ＋243秒    ← **帯の中**（4分03秒）
  22:28:36  ＋63秒     ← 帯を出たところ
22:28:5x  帯を出た（生存の手も止まり、控えも落ちた。残った手は0本）
```

**帯の中の間隔は最大 4分08秒。10分を越えていない。**

＊数えるときは `-File …heavy-life.ps1` で終わるものだけを当てる。
　ゆるく数えると**自分の診断コマンドが1本混じる**（`inbox-watch` と同じ罠）。

## ② 訴えが出た回に、その場で一発鳴らす

**何が残っていたか** … 訴えは `pipe-warn.log` に溜まるだけで、気づくのは **09:00／21:00 の定時**。
半日気づかないことがあった。

**直した形** … `pipe-check.ps1` が、訴えの出た回に **🪟 と同じ道**（`ntfy-say.ps1`）で一発鳴らす。

- **題は一行だけ**（`🪟 連携に訴えがあります（cards-full・topic）`）。中身は**札**として立つ
- 札を組む手も送る手も**既にあるものをそのまま呼ぶ**（札の作りには触っていない）
- **同じ種類が続く間は再送しない。**鳴らした種類を `pipe-warn-rung.txt` に控え、
  **その種類が出なくなったら控えから落とす**（また出たときに、もう一度鳴る）

**作り値（本物の写しを砂場で回した。送る手だけ偽物に差し替え）**

```
(甲) 訴えが初めて出た        → **鳴った**／控え＝cards-full・topic
(乙) 同じ訴えが続く（二回目）  → 鳴らない  ／控えはそのまま
(丙) 同じ訴えが続く（三回目）  → 鳴らない  ／控えはそのまま
(丁) 訴えが消えた            → 鳴らない  ／控え＝cards-full（消えた種類が落ちた）
(戊) また同じ訴えが出た      → **鳴った**／題は「（topic）」＝**増えた種類だけ**
```

## 直しの途中で踏んだ二つ（どちらも同じ形の罠）

**PowerShell は変数の大小を区別しない。**

| 踏んだ所 | 何が起きたか | 直し |
|---|---|---|
| `heavy-life.ps1` | `$Pid` は**読み取り専用の自動変数**。書こうとすると落ちる | `$PidPath` へ改名（走らせる前に気づいた） |
| `pipe-check.ps1` | `$Rung`（道）と `$rung`（一覧）が**同じ変数**。`$rung = @()` が道を空配列で上書きし、**控えが一度も書かれなかった** | `$RungPath` ／ `$rungKinds` へ改名 |

二つ目は、**作り値では「5回とも鳴る」という形で出た**。
黙って `catch { }` に飲まれていたので、砂場の写しだけ catch を見せる形に替えて捕まえた
（`控えが書けない：Cannot bind argument to parameter 'LiteralPath' because it is an empty array.`）。

## 触っていないもの

`koushu-handan.html` ／ `panel.html` ／ `watch-notify.ps1` の判定と札の作り ／
`notify-record.ps1` ／ `hook-notice.ps1`（呼ぶだけ）／ `check.js` の合格条件。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **141件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`先の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-1.md) | 09-05 22:30 | 先の穴-1 — 生存を関門の外へ、訴えをその場で鳴らす |
| [`根の試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A0%B9%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-05 21:57 | 根の試験-1 — 本物の pre-push を一回通して、直りを見届けた |
| [`残りの根-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AE%8B%E3%82%8A%E3%81%AE%E6%A0%B9-1.md) | 09-05 21:22 | 残りの根-1 — 今日止めた分をまとめて直した |
| [`帯の漏れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E6%BC%8F%E3%82%8C-1.md) | 09-05 20:53 | 帯の漏れ-1 — 重い帯を pre-push 自身に持たせた |
| [`飽和の回避-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1-2.md) | 09-05 18:23 | 飽和の回避-1（追補）— 札を立て直した／控えが空だった理由 |
| [`飽和の回避-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%A3%BD%E5%92%8C%E3%81%AE%E5%9B%9E%E9%81%BF-1.md) | 09-05 16:29 | 飽和の回避-1 — 重い帯だけ、起こしを間引く |
| [`連携の改善-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E6%94%B9%E5%96%84-1.md) | 09-05 14:33 | 連携の改善-1 — 止めた5件を外から見る手で近づけ、訴えを定時へ乗せた |
| [`札の上限-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E4%B8%8A%E9%99%90-1.md) | 09-05 12:51 | 札の上限-1／手押しの錠-1 — 枚数を増やし、手押しも同じ錠を通した |
| [`連携の弱い所-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E5%BC%B1%E3%81%84%E6%89%80-1.md) | 09-05 09:48 | 連携の弱い所-1 — 黙って壊れる所を洗い、外から見る手を立てた |
| [`機械の詰まり-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1-2.md) | 09-05 09:37 | 機械の詰まり-1（数え）— 夜は明確に減った。残っているのは**こちらが検査を回している帯** |
| [`矛盾の三つ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%9B%E7%9B%BE%E3%81%AE%E4%B8%89%E3%81%A4-1.md) | 09-04 12:31 | 矛盾の三つ-1 — 三つとも「材料を読む所」がずれていた |
| [`見張りの×-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%C3%97-1.md) | 09-04 10:09 | 見張りの×-1 — 「×2147946720」は死んでいた印ではなく、**その一分の起こしを見送った印** |
| [`機械の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A9%9F%E6%A2%B0%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-04 06:06 | 機械の詰まり-1 — 現場を押さえる手を入れ、押す者を一度に一人にした |
| [`数の不一致-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%95%B0%E3%81%AE%E4%B8%8D%E4%B8%80%E8%87%B4-1.md) | 09-04 01:24 | 数の不一致-1 — 三つを「写した印の無い、中身のある札の数」で揃えた（panel v116） |
| [`生存の途切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%94%9F%E5%AD%98%E3%81%AE%E9%80%94%E5%88%87%E3%82%8C-1.md) | 09-04 00:44 | 生存の途切れ-1 — 詰まった一本が10分ぶら下がり、次の刻が「見送り」で捨てられた |
| [`パネルの立て直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E7%AB%8B%E3%81%A6%E7%9B%B4%E3%81%97-1.md) | 09-03 21:30 | パネルの立て直し-1 — 開いた瞬間に「何が終わって何が待っているか」が読める形へ（panel v115） |
| [`読みの道-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-3.md) | 09-03 20:52 | 読みの道-3 — `latest-name.txt` を完全な URL 一行にした |
| [`読みの道-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-2.md) | 09-03 20:31 | 読みの道-2 — 名を変えた写しを置く（読む側が待たずに最新を取れる） |
| [`札の押し出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%BC%E3%81%97%E5%87%BA%E3%81%97-1.md) | 09-03 17:27 | 札の押し出し-1 — 🪟 が終わりの札を上書きしていた。二枚とも立てる形にした |
| [`巡回の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-03 16:02 | 巡回の固まり-2 — 止まっていたのは「使用量の段」。上限の無い呼び出しが一つあった |

<!-- 控えの一覧 ここまで -->
