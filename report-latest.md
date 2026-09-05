# 作り値の送り先-1 — 作り値は偽の送り手へ。今夜の分は回し直した

**状態** … 終わり

## 何が起きたか

2026-09-06 **00:16 と 00:17**、帯の関門の作り値が**本物の ntfy へ二通送った**。
題は「😸 走り出したにゃ（終了予定は未定）」で、**実際の仕事の走り出しと見分けが付かない**。
HTTP 200 を確かめたくて、送る行をそのまま回したのが理由。

**これ自体が事故。**次に本当に鳴ったとき「また作り値か」と読み飛ばされる。

## 作法へ書いた一行（作法14「検査は写しに probe 方式」の中）

> **作り値は、必ず偽の送り手へ差し替える。**本物の ntfy・本物の push・本物の commit を、
> 作り値から叩かない。写しの中の送る行を偽物に置き換えてから回す。
>
> ＊差し替え方は写しの中で一行を置き換えるだけでよい（`Invoke-WebRequest` → 控えへ書く手）。
> ＊**HTTP 200 を確かめたいときも、本物へは送らない。**送り手の呼び出しが
> 　「正しい題・正しい回数で呼ばれたか」を見れば足りる。

## 回し直し（偽の送り手・本物へは一通も送っていない）

写しを砂場に取り、**送る一行だけ**を差し替えた。

```
差し替え前 … $r = Invoke-WebRequest -Uri ('https://ntfy.sh/' + $topic) -Method Post …
差し替え後 … $r = [pscustomobject]@{ StatusCode = 200 }; Add-Content -LiteralPath <砂場>\sent.txt -Value $title
```

**帯を 00:27:07 に張り、刻を決め打ちにして回した。**

```
(甲) 帯の10分前の枠            → 控え （無し）              ／ 偽の送り手へ 0通
(乙) 帯に入って1分後の枠        → 控え 帯の中の一つ目の枠      ／ 偽の送り手へ 0通
(丙) 帯に入って2分後の枠        → 控え 帯の中の二つ目の枠      ／ 偽の送り手へ 0通  ← 最後の一件だけ
(丁) 問いかけ                  → 控え 帯の中の二つ目の枠      ／ 偽の送り手へ 0通  ← 替わらない
(戊) 帯が明けた一回            → 控え （無し）              ／ 偽の送り手へ **1通**
(己) その次の一回              → 控え （無し）              ／ 偽の送り手へ 1通のまま ← 二度は鳴らない
偽の送り手が受けた題 … 😸 走り出したにゃ（終了予定は未定）
```

**六つとも、昨夜の本物送りの作り値と同じ結果になった。**送り先だけが違う。

＊最初の回し直しで (甲) と (乙) の見え方が食い違ったのは、**帯の刻を「いま」にしたため**で、
　作りの側の問題ではなかった。帯と枠の刻を決め打ちにしたら、上のとおり揃った。

## いま本物へ送りうる作り値は、他に残っていないか

| 手 | 作り値から本物を叩くか | いま |
|---|---|---|
| `heavy-gate.ps1`（走り出し） | **叩いていた** | 写しの中で差し替える形にした（この報告） |
| `pipe-check.ps1`（訴えの一発） | 叩きうる | **既に砂場で回している**（`ntfy-say.ps1` を偽物に差し替え済み） |
| `notify-record.ps1`（札） | 叩きうる | **既に砂場で回している**（`$Repo` を砂場へ向ける） |
| `watch-notify.ps1`（本体の枝） | 叩かない | 抜き出した枝に `Push-Ntfy` の偽物を置いて回している |

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **147件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`作り値の送り先-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%9C%E3%82%8A%E5%80%A4%E3%81%AE%E9%80%81%E3%82%8A%E5%85%88-1.md) | 09-06 00:34 | 作り値の送り先-1 — 作り値は偽の送り手へ。今夜の分は回し直した |
| [`見張りの地図.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%A6%8B%E5%BC%B5%E3%82%8A%E3%81%AE%E5%9C%B0%E5%9B%B3.md) | 09-06 00:34 | 見張りの地図 — `watch-notify.ps1` の巡回を、段ごとに開く |
| [`帯の中の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B8%AF%E3%81%AE%E4%B8%AD%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 09-06 00:17 | 帯の中の走り出し-1 — 帯をまたいだ走り出しを、関門が持って鳴らす |
| [`走り出しの黙り-3-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3-2.md) | 09-06 00:14 | 走り出しの黙り-3（差し替え版）— 9月1日の直しは残っている。弾いていたのは手前の二つ |
| [`走り出しの黙り-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97%E3%81%AE%E9%BB%99%E3%82%8A-3.md) | 09-06 00:06 | 走り出しの黙り-3 — 弾いていたのは見込みではなく「開始の時計」 |
| [`先の穴-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%88%E3%81%AE%E7%A9%B4-2.md) | 09-05 23:15 | 先の穴-2 — 押し出した札を残し、件名を機械が書き、訴えを画面に出す |
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

<!-- 控えの一覧 ここまで -->
