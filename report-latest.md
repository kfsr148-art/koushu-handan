# 生存の途切れ-1 — 詰まった一本が10分ぶら下がり、次の刻が「見送り」で捨てられた

**状態：終わり（実地は次の定刻で見届ける）／本体・パネルには触っていない**

**結論** — 生存の記録は **10分ごとの別の仕事**（`ClaudeHookHeartbeat`）が書いている。
22:48:02 の一本が**終わらないまま10分の上限で殺され**、その間に来た **22:58 の刻は
「既に走っているので見送り」で捨てられた**。**二本続けて落ちて 30分の穴**になり、
23:01 の時点では **23分の途切れ**に見えていた。

---

## ① 止まった段の名指し（足跡と、仕事の記録の突き合わせ）

**生存の記録**

```
22:38:19  ← 最後の一本
（22:48 と 22:58 が落ちている）
23:08:28  ← ここで戻った
```

**仕事の記録（Task Scheduler の記録。これが決め手）**

```
22:48:02  刻で起こす／プロセスを作る／始まった／手が始まった   ← 走り出したが終わらない
22:58:02  **既に走っているので見送り**                        ← 10分後の刻がここで捨てられた
22:58:03  上限で止めた／終わった                              ← 10分の上限で殺された
23:08:02  起こす → 手が始まった
23:08:32  手が終わった／終わった                              ← 生存が戻る
```

**止まった段は「生存の一行を書く手（`hook-notice.ps1 -Kind heartbeat`）そのもの」。**
一行を足すだけの手が **10分終わらなかった**。書けなかったときの退避先
（`hook-fallback.log`）にも落ちていない——**退避へ回る前に殺された**ため
（退避の最後の記録は 08-27 05:08 のまま）。

## ② 立て直し-1 の押しとの関係 — **重なっている**

同じ帯で、見張り（`ClaudeWatchNotify`）も詰まっていた。

```
22:40:58 / 22:41:58 / 22:42:58 / 22:43:58 / 22:44:58 / 22:45:58 / 22:46:58 / 22:47:58
  … すべて「既に走っているので見送り」（8回続けて）
22:48:58  前の一本が終わり、ようやく次が走った
```

足跡の側でも、**22:43:54 に始まった回は一段も進まないまま消えている**
（次の 開始 は 23:01:29）。

**つまり、この帯は機械そのものが詰まっていた。** 立て直し-1 の押し（pre-push の検査は
ブラウザを何枚も起こす）と重なった時間帯で、**生存の手はその巻き添え**になっている。
＊「押しが原因だ」と現場を押さえたわけではない。言えるのは**同じ帯で二つの仕事が
　同時に詰まっており、片方は8回続けて見送られていた**まで。

## ③ 直し — 詰まった一本に、次の刻を巻き込ませない

`ClaudeHookHeartbeat` の設定を二つ替えた。

| | 前 | 後 |
|---|---|---|
| 上限で止める | 10分 | **2分** |
| 多重の扱い | IgnoreNew（既に走っていたら見送る） | **Parallel（前が残っていても次を走らせる）** |

- **2分** … 一行を足すだけの手が2分かかることは無い。詰まった一本を早く諦める
- **Parallel** … これが眼目。**前の一本が残っていても、次の刻は必ず走る**。
  22:58 の刻が捨てられた形は、これで起きない

＊書き込み側は前から守られている（3回まで粘り、駄目なら `hook-fallback.log` へ退避）。
　今回はそこへ**辿り着く前に殺された**ので、効かなかった。上の二つはその手前を塞ぐ。

## 実測

**作り値**（長く走る一本を先に置いて、続けて二度起こした）

```
00:42:47  手が始まった      ← 一本目
00:42:54  手が始まった      ← 二本目。**見送り（322）は出ていない**
00:43:11  手が終わった
00:43:12  手が終わった
生存の行 … 00:43:10 と 00:43:11 の**二本とも書けた**
```

前の設定（IgnoreNew）なら、二本目はここで捨てられていた。

**実地** — 次の定刻（10分ごと）で生存が続けて入ることを見届ける。
＊`watch-notify.ps1` の側の詰まり（8回の見送り）は [[巡回の固まり-2]] で根を一つ塞いだところ。
　こちらは**生存の記録が巻き添えにならない形**にしたもので、狙いが違う。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **127件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`生存の途切れ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%94%9F%E5%AD%98%E3%81%AE%E9%80%94%E5%88%87%E3%82%8C-1.md) | 09-04 00:44 | 生存の途切れ-1 — 詰まった一本が10分ぶら下がり、次の刻が「見送り」で捨てられた |
| [`パネルの立て直し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AE%E7%AB%8B%E3%81%A6%E7%9B%B4%E3%81%97-1.md) | 09-03 21:30 | パネルの立て直し-1 — 開いた瞬間に「何が終わって何が待っているか」が読める形へ（panel v115） |
| [`読みの道-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-3.md) | 09-03 20:52 | 読みの道-3 — `latest-name.txt` を完全な URL 一行にした |
| [`読みの道-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%81%BF%E3%81%AE%E9%81%93-2.md) | 09-03 20:31 | 読みの道-2 — 名を変えた写しを置く（読む側が待たずに最新を取れる） |
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

<!-- 控えの一覧 ここまで -->
