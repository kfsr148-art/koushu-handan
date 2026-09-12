# 見張りの止まり-1 — 段の時間切れ・空きの関門・止まりの知らせ

状態：終わり（残り0件）　2026-09-12 11:05

## ㉔ 四回はどの段で止まったか
**四回とも段で固まったのではなく、「重い帯のため見送り」（pre-push の検査）でした。**

| 刻 | 最後に通った記録 | そのあと |
|---|---|---|
| 03:27 | 03:27:08 の巡回（watch-status.log） | 03:28:04・03:29:03 に「重い帯のため見送り（pre-push の検査）」 |
| 03:47 | 03:47:16 の巡回 | 03:48:08・03:49:02 に同じ見送り |
| 04:10 | 04:10:11 の巡回 | 04:11:08・04:12:08 に同じ見送り |
| 09:55 | 09:55:04 に **完了まで通った**（足跡あり） | 09:56:05 から四回続けて見送り |

＊03:27・03:47・04:10 の足跡は `watch-step-log.txt` が刈られて（870行・08:26 以降）残っておらず、`heavy-skip.log` で確かめました。
＊**本当に段で固まったのは 02:30 の回**で、「控えを読んだ」（02:30:26）の次の段から記録が止まり、10分の上限で切られていました。

## ㉑ 段ごとの時間切れ
- `watch-notify.ps1` に `$STEP_MAX = 60` と `Step-Over` を置いた
- 段が60秒を超えたら、足跡に `★段が60秒を超えた` の一行、`pipe-warn.log` に `step-slow` の一行
- 段の中で粘る待ち（公開に出るのを確かめる輪・二箇所）は、**段の60秒でも抜ける**
- 予定の仕事 ClaudeWatchNotify の**全体10分の上限は外した**（PT10M → PT0S）
- 写しの試し（上限を1秒に縮めた）… `Step-Over` が 0秒で False・2秒後に True。足跡に `★段が1秒を超えた 遅い段 +2.1秒`、訴えに `step-slow 見張りの段が 2.1秒（上限1秒）：遅い段`

## ㉒ 空きが乏しい回
- `git-push.ps1` の `Git-CommitPush` … 空き物理メモリが **1536MB 未満**なら、add も commit も push もせず **-6** を返し、`heavy-skip.log` に一行
- `.githooks/pre-push` … 同じ関門で `check-all --fast` を飛ばす（**push はそのまま通す**）。飛ばした回は `heavy-skip.log` に一行
- 控え（`state.json`・札）の書き出しは今までどおり。値は空きが戻った回に運ばれる
- 写しの試し（閾値を上げて必ず当たる形）… 返り **-6**、`heavy-skip.log` に `空きが乏しいので押しを見送る（空き 1150MB＜…）`
- **いまの空きは約1.1GB** なので、この関門は実際に効いています

## ㉓ 止まりの知らせ
- `inbox-watch.ps1` の巡回で**一分に一度**、`watch-status.log` の最後の刻を見る
- 10分以上古ければ、**その場で ntfy を一発**「🪟 見張りが止まっています（最後の記録 HH:MM・N分前）」。**一日一回まで**（`watch-stale-seen.txt`）
- あわせて、**5分を超えて居座る watch-notify の回を落とす**（予定の仕事は IgnoreNew なので、居座られると次の回が始まらない）
- 写しの試し（偽の送り手を写しの中へ）… 一度目に題と本文四行が出て、二度目は黙った

## 残り
残り0件

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **211件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`見張りの止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-12 11:04 | 見張りの止まり-1 — 段の時間切れ・空きの関門・止まりの知らせ |
| [`札の本文-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%AD%E3%81%AE%E6%9C%AC%E6%96%87-1.md) | 09-12 09:54 | 札の本文-1 — 終わりの札が前の仕事の文で出る／遠隔の橋-1 を閉じた |
| [`外の見張り-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-2.md) | 09-12 04:09 | 外の見張り-2 — claude.exe が0本なら /fail を打つ |
| [`外の見張り-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%A4%96%E3%81%AE%E8%A6%8B%E5%BC%B5%E3%82%8A-1.md) | 09-12 03:46 | 外の見張り-1 — 巡回の末尾で hc-ping.com へ一分に一発 |
| [`読むだけの台本-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%AA%AD%E3%82%80%E3%81%A0%E3%81%91%E3%81%AE%E5%8F%B0%E6%9C%AC-1.md) | 09-12 03:26 | 読むだけの台本-1 ／ 鉤の軽量化-1 ／ 巡回の空き-1 ／ 人手待ち-1 ／ 知らせの割り当て-1 ／ 重複の枠-1 |
| [`y0912-0300.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-0300.md) | 09-12 02:54 | 連携の穴（09-12）— 枠の全文・板と訴えの押し直し・台帳の開き方・知らせの題・フル版の関門・止まった窓（印 y0912-0300） |
| [`連携の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%A3%E6%90%BA%E3%81%AE%E7%A9%B4-1.md) | 09-12 02:54 | 連携の穴-1 — Codeタブ・返事パネル・GitHub の連携の棚卸し |
| [`y0912-0200.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-0200.md) | 09-12 01:54 | 0x4A の切り分け-1 — 無線LANを外して有線へ、Event 41 で数える（印 y0912-0200） |
| [`0x4A の三（四度目）.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/0x4A%20%E3%81%AE%E4%B8%89%EF%BC%88%E5%9B%9B%E5%BA%A6%E7%9B%AE%EF%BC%89.md) | 09-11 20:57 | 0x4A の三（四度目）— 管理者の窓を開かずに、読める分を片付けた |
| [`落ちた後の起こし-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%90%BD%E3%81%A1%E3%81%9F%E5%BE%8C%E3%81%AE%E8%B5%B7%E3%81%93%E3%81%97-2.md) | 09-11 20:35 | 落ちた後の起こし-2 — 窓の起こし直しと🪟・RC 切れの数え・遠隔の会話名 |
| [`y0911-0701.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0701.md) | 09-11 07:02 | 0x4A の三（三度目）— 昇格の問いは四回とも約2分で取り消し（印 y0911-0701） |
| [`y0911-0627.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0627.md) | 09-11 06:29 | 0x4A の三（二度目）— 昇格の問いは出したが、約2分で取り消しになった（印 y0911-0627） |
| [`y0911-0047.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0911-0047.md) | 09-11 00:47 | 落ちた後の起こし-1 と 帯の中の黙り-1（乙）— 三件とも済 |
| [`y0910-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-2255.md) | 09-10 22:53 | 帯の中の黙り-1 — 直し方の裁定のお願い（印 y0910-2255） |
| [`土台の直し-1の実装.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%9F%E8%A3%85.md) | 09-10 20:27 | 土台の直し-1（実装）— shanten を analyze() の外へ持ち上げ、写し二つを廃した（v1438） |
| [`y0910-1752.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1752.md) | 09-10 17:53 | 押しの黙り-1 — 押しの失敗と .git の壊れを訴えへ足した（印 y0910-1752） |
| [`y0910-1727.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1727.md) | 09-10 17:30 | 旧版の窓を止め、ログオン時の起こしを置いた（印 y0910-1727） |
| [`y0910-1655.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1655.md) | 09-10 17:00 | 錠の名を揃え、落ちの正体を割った（印 y0910-1655） |
| [`y0910-1305-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-3.md) | 09-10 15:16 | pub-read の始末と、長く走る命令の上限（印 y0910-1305-3） |
| [`y0910-1305-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305-2.md) | 09-10 15:04 | 読むだけの台本と、公開の止まりの割り直し（印 y0910-1305-2） |

<!-- 控えの一覧 ここまで -->
