# 札の押し出し-1 — 🪟 が終わりの札を上書きしていた。二枚とも立てる形にした

**状態：終わり（実地は次に重なった回で確かめる）／本体（`koushu-handan.html`）には触っていない**

**名指し** — 異常の枝が **`$title` / `$body` / `$prio` / `$tags` を上書きしていた**。
札の枠は一巡回に一つしか無いので、同じ巡回で `done:` と重なると**終わりの札が押し出されて消える**。

---

## ① 捨てられた箇所（字面）

札を送るのは**一箇所だけ**。

```powershell
elseif ((($key -notlike 'run:*') -or ($state -eq 'bad')) -and … ) {
  [void](Send-Ntfy $title $body $prio $tags $state)     ← 札の枠はこの一つ
}
```

その手前で、異常の枝が同じ入れ物を**上書きしていた**。

```powershell
if ($badKind -like 'stall:*') {
  $title = $T_BAD_B                                     ← 終わりの札の題を潰す
  $body  = ('見張りの巡回が ' + $script:stallMin + '分ぶん止まっていました…')   ← 本文も潰す
  $prio = '4'; $tags = 'window'
}
```

`done:` の枝が組んだ「✅ 終わりました＋報告の本文」は、**この二行で消えていた**。

**実物**

```
2026-09-03 13:46:36  鍵 run: → done:2026-09-03 13:40:37
2026-09-03 13:46:36  控えへ入れた [🪟 異常です（手が要ります）]     ← 立ったのは 🪟 だけ
notices.json … 13:46:21 に 🪟（3行）／通しの試験-1 の報告を載せた札は**無い**
```

同じ型が今日**三度**（12:21:54／13:46:21／15:34:37）。いずれも固まりの 🪟 が出た回。

## ② 直し — 二枚とも立てる。順は 終わりの札 → 🪟

異常の札を**別の入れ物**（`$badTitle` / `$badBody` / `$badPrio` / `$badTags`）へ移し、
本編を送ったあとに続けて出す。

```powershell
if ($badOn) { [void](Send-Ntfy $badTitle $badBody $badPrio $badTags 'bad') }
```

- 順を **終わりの札 → 🪟** にしたのは、読む側が**まず結果を見て、次に手当てを見る**ため
- **本編が出ない回（`run:` や `idle:`）でも 🪟 は出す**。異常は鍵の形に関わらず手が要る
- **`dead` / `stale:` は今までどおり一枚**。あの二つは**鍵そのものが異常**で、本編の札が既に
  異常の札になっている。二枚にすると同じ話が二度出るので、名乗りを `bad` にするだけにした

## ③ 実測（写しに probe。本体には仕掛けを入れていない）

```
(甲) done: と固まりが同じ巡回  → 立った札 2枚：✅ 終わりました（返事不要） → 🪟 異常です（手が要ります）
(乙) 固まりだけ（run: の回）   → 立った札 1枚：🪟 異常です（手が要ります）
(丙) done: だけ                → 立った札 1枚：✅ 終わりました（返事不要）
```

**(甲) が今日三度落ちた形**で、**二枚とも、順どおりに立つ**ようになった。

**実地** — 毎分呼び直されるので直しは既に効いている。
**次に 🪟 と終わりが重なった回**で、札が二枚立つことを確かめる。
＊[[巡回の固まり-2]] で固まりの根を塞いだので、重なる回そのものが減るはず。
　**減っても、重なったときに落ちない形にしておく**のがこの直し。

写し `.bak-20260903d`／構文OK **2807行**／BOM 有り／毎分呼び直しなので起こし直し不要。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **123件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`札の押し出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%8A%BC%E3%81%97%E5%87%BA%E3%81%97-1.md) | 09-03 17:27 | 札の押し出し-1 — 🪟 が終わりの札を上書きしていた。二枚とも立てる形にした |
| [`巡回の固まり-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E5%9B%BA%E3%81%BE%E3%82%8A-2.md) | 09-03 16:02 | 巡回の固まり-2 — 止まっていたのは「使用量の段」。上限の無い呼び出しが一つあった |
| [`写しの一本化-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E4%B8%80%E6%9C%AC%E5%8C%96-1.md) | 09-03 15:17 | 写しの一本化-1 — 押す所を一つにした（panel v114） |
| [`通しの試験-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E3%81%97%E3%81%AE%E8%A9%A6%E9%A8%93-1.md) | 09-03 13:28 | 通しの試験-1 — 小さな仕事を一つ流して、端から端まで見届けた |
| [`板の欠け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9D%BF%E3%81%AE%E6%AC%A0%E3%81%91-1.md) | 09-03 12:03 | 板の欠け-1 — 公開側の `board.json` は無事だった。消えていたのは**手元の値** |
| [`写しの切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E5%88%87%E3%82%8C-1.md) | 09-03 10:03 | 写しの切れ-1 — 切っていたのは `buildBundle` ではなく、見張りの控えの読み手 |
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

<!-- 控えの一覧 ここまで -->
