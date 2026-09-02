# 札の抜け-2（続き）— 昨夜の直しは**一度も働いていなかった**。枝の順が原因

**状態：終わり（実地は次の回で見届ける）／本体（`koushu-handan.html`）には触っていない**

**結論** — 2026-09-02 に入れた「取り逃がした stop を拾い直す」枝は、**一度も働いていなかった。**
手前にある `notification` の枝が先に当たり、**拾い直しの枝まで辿り着いていなかった**。
枝の順を直した。

---

## 働いていなかった証拠

```
done-said.txt            … **無い**（拾い直しの枝は一度も書いていない）
「取り逃がしていた stop を拾った」の記録 … **0件**
2026-09-02 23:33:48  stop
2026-09-02 23:35:11  鍵 run:22:51:41 -> **idle:23:34:41**   ← 直したはずの回で、また idle: になっている
notices.json          … その回の終わりの札は**無い**（23:36:26 の「写せます（4件）」だけ）
```

**直した当人が「入れた」と報告したあとに、同じ型で落ちていた。**

## 原因 — 枝の順

鍵を決める `if / elseif` の並びはこうなっている。

```
L1626  } elseif ($lastKind -eq 'notification' -and $kindFresh) {   ← ここで当たって終わり
           …（ヨシ待ち・外待ち・stopInRound の三つ又）
L1687  } elseif ((… -or $stopPending) -and $note.outwait …) {
L1695  } elseif ((… -or $stopPending)) {                            ← **辿り着かない**
```

stop のあとに来るのは `notification` なので、**必ず L1626 で止まる**。
昨夜足した `$stopPending` は L1687/L1695 にしか無く、**読まれる前に勝負が付いていた**。

＊しかも L1626 の中には `$stopInRound`（この回に stop があったか）を見る三つ又があり、
　「終わりを出しており控えにも待ちが無いので、ヨシ待ちの知らせは出さない」と**記録まで残して**
　idle: へ落ちていた。**stop があったことは分かっていたのに、札を作る側へ渡していなかった。**

## 直し — notification の枝を、待ちが無い回だけ避ける

```
} elseif ($lastKind -eq 'notification' -and $kindFresh -and
          -not ($stopPending -and ($note.askNone -or -not $note.hasAsk))) {
```

**避けるのは「待ちが無い回」だけ**が要点。控えに `待ち:` が書いてある回は、
いままでどおり 🙋 ヨシ待ちが正しい——終わりの札に化けさせない。

## 実測（写しに probe。本体には仕掛けを入れていない）

**どちらの枝が当たるか**（いちばん新しいフックは `notification`）

```
○ (甲) 取り逃がした stop あり・待ちの行が無い     → 終わりの枝へ落ちる
○ (乙) 取り逃がした stop あり・「待ち: なし」     → 終わりの枝へ落ちる
○ (丙) 取り逃がした stop あり・待ちが書いてある   → notification のまま（🙋 が正しい）
○ (丁) 取り逃がした stop なし                     → notification のまま
```

**拾い直しの条件そのもの**（昨夜の6通り）も、そのまま通る。

```
○ 76秒前の stop を拾う ／ 8秒前も拾う ／ 札にした stop は拾わない
○ resume が後なら拾わない ／ 20分前は拾わない ／ stop 無しは拾わない
```

**実地** — 毎分呼び直されるので直しは既に効いている。
**この回の終わり**で、`done-said.txt` が書かれ、`notices.json` に終わりの札が立ち、
😽 が鳴るかを見届ける。**昨夜は「効いている」と書いて効いていなかったので、今度は実物で確かめる。**

写し `.bak-20260903a`／構文OK **2732行**／BOM 有り。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **117件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`札の抜け-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2-2.md) | 09-03 06:43 | 札の抜け-2（続き）— 昨夜の直しは**一度も働いていなかった**。枝の順が原因 |
| [`通知の分け方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E5%88%86%E3%81%91%E6%96%B9-1.md) | 09-02 23:05 | 通知の分け方-1 — 長い報告は ntfy へ送らない。札にして、釦で一枚で写す |
| [`札の抜け-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%9C%E3%81%91-2.md) | 09-02 22:55 | 札の抜け-2 — 取り逃がした stop を拾い直す（終わりの札を運任せにしない） |
| [`通知のコピー-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E3%82%B3%E3%83%94%E3%83%BC-1.md) | 09-02 19:48 | 通知のコピー-1 — 送った本文を「まとめて写す」と同じ形で写せるようにした（panel v111） |
| [`読み口の詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E5%8F%A3%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-02 17:52 | 読み口の詰まり-1 — `?_t=` は CDN に効いていない。遅れの正体は Pages の配り直し |
| [`パネルの色-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E8%89%B2-1.md) | 09-02 16:33 | パネルの色-1 — 終了予定の刻だけを明るい水色にした（panel v108） |
| [`終わりの黙り-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E9%BB%99%E3%82%8A-4.md) | 09-02 16:06 | 終わりの黙り-4 — 写せます（ready）を、終わりと同じ道へ乗せた |
| [`仕事の数え方-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BB%95%E4%BA%8B%E3%81%AE%E6%95%B0%E3%81%88%E6%96%B9-1.md) | 09-02 14:40 | 仕事の数え方-1 — 生存確認を仕事に数えない。**できる。狭く取れば当てられる** |
| [`走り出しの時刻ずれ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E6%99%82%E5%88%BB%E3%81%9A%E3%82%8C-1.md) | 09-02 06:49 | 走り出しの時刻ずれ-1 — 「22時58分」は**前の仕事の開始 ＋ いまの見込み**だった |
| [`使用量の空振り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E7%A9%BA%E6%8C%AF%E3%82%8A-1.md) | 09-02 06:48 | 使用量の空振り-1 — 06:04 の取得は**成功していた**。本文が「枠の立っていない形」だった |
| [`走り出しの黙り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-2.md) | 09-01 21:17 | 走り出しの黙り-2 — 黙っていた理由は「見込みが無い」。見込み無しでも鳴らす形へ |
| [`持ち越しの根治-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8C%81%E3%81%A1%E8%B6%8A%E3%81%97%E3%81%AE%E6%A0%B9%E6%B2%BB-1.md) | 09-01 20:53 | 持ち越しの根治-1 — 仕事に属する印を、切り替わりで一箇所から落とす |
| [`巡回の固まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-1.md) | 09-01 20:31 | 巡回の固まり-1 — 13分の固まりの中身と、預かりの期限・固まりの一発 |
| [`知らせの止まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-2.md) | 09-01 20:12 | 知らせの止まり-2 — 😽 は25分遅れて出た。止めたのは巡回の固まり（空振り除けは無関係） |
| [`写しの絞り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%B5%9E%E3%82%8A-2.md) | 09-01 19:41 | 写しの絞り-2 — 写しの絞りを検査で守る |
| [`写しの絞り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E7%B5%9E%E3%82%8A-1.md) | 09-01 18:00 | 写しの絞り-1 — 貼る写しから、判断に使わない行を落とした（panel v106） |
| [`受け渡しの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%97%E3%81%91%E6%B8%A1%E3%81%97%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 17:30 | 受け渡しの守り-1 — Code タブと知らせのあいだに、二つの網を足した |
| [`パネルの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 16:57 | パネルの守り-1 — 返事パネルを検査の網に入れた |
| [`ウィジェットの守り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E5%AE%88%E3%82%8A-1.md) | 09-01 15:24 | ウィジェットの守り-1 — ウィジェット側を検査の網に入れた |
| [`ウィジェットの猫の色-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E7%8C%AB%E3%81%AE%E8%89%B2-1.md) | 09-01 13:01 | ウィジェットの猫の色-1 — ウィジェットの猫を白へ（元絵とパネルはそのまま） |

<!-- 控えの一覧 ここまで -->
