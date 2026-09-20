# 16:11 の訴え二つ（ntfy-down・pub-read）の今

**終わり（残り0件）** — 2026-09-20 16:3x（VAIO）。読みと問い合わせだけ。`koushu-handan.html`・`stable` には触っていない。

## 今 … **二つとも ok に戻っている**

`pipe-warn.log` の**最後の行**（そのまま写し）

```
2026-09-20 16:20:20  ok            訴えは無くなった
```

その前の四行（この帯のすべて）

```
2026-09-20 16:10:58  pub-read      公開側の notices.json が読めなかった：控えが落ちてこない
2026-09-20 16:10:58  ntfy-down     ntfy.sh が返さない（HTTP 000）。押し送りは黙って届かない
2026-09-20 16:11:35  rung          一発鳴らした：ntfy-down・pub-read
2026-09-20 16:20:20  ok            訴えは無くなった
```

**いま出ている訴えは0件**（`pipe-seen.txt` は空）。**送り直し待ちも無し**（`ntfy-retry.txt` は空）。

## ntfy.sh への今の応答（実測・こちらから問い合わせただけ。**知らせは送っていない**）

| 先 | HTTP |
|---|---|
| `https://ntfy.sh/v1/health` | **200** |
| `https://ntfy.sh/`（本体） | **200** |
| 公開側 `notices.json` | **200** |
| 公開側 `ver.txt` | **200** |

＊16:10:58 の訴えの中身は **HTTP 000**（＝返事そのものが無い）だった。いまは 200 で戻っている。

## 16:11 以降に送れず落ちた鈴 … **無し**

- 16:10〜16:20 の帯には**押し送りの試みが一度も無い**（この帯に立った札が無いため）。
  直前の札は 15:23:18「✅ 終わりました（返事不要）」、次の札は 16:23:01 の同じ題。
- **16:23:01 の札は預けられ、16:25:07 に「押し送りOK（HTTP 200）本日 33件目」で出た**（公開側に出るのを待ってから送る決めどおり）。
- 今日の記録 … **押し送りOK 33件・失敗0件**（`HTTP 000`・`送り直し`・`押し送りNG` の行はいずれも0）。
  日ごとの控え（`ntfy-daily.tsv`）も **2026-09-20 … 合計33・ヨシ待ち5・終わり19**。

**つまり、この二つの訴えは「外が一時的に返さなかった」ことを見張りが正しく拾って鳴らしたもので、
その間に**出そうとして落ちた鈴は一本も無い**。

## 触った所と触らない所

**触った所** … 無し（読みと問い合わせだけ）。報告と控えのみ。
**触らない所** … `koushu-handan.html`・`stable`・見張りの台本。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **318件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0920-1630.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1630.md) | 09-20 16:35 | 16:11 の訴え二つ（ntfy-down・pub-read）の今 |
| [`y0920-1500-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500-2.md) | 09-20 15:19 | v1457 剣士の八枚を idleRight 52 に揃えて焼き直した（納品） |
| [`y0920-1500.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1500.md) | 09-20 14:48 | 【宣言】剣士の八枚を idleRight 52 に揃えて焼き直す（v1457） |
| [`y0920-1450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1450.md) | 09-20 14:40 | 08-20 の保留三つの今（振りの八枚の倍率・目盛り画像の置き場・sizing-review.png） |
| [`y0920-1406-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406-2.md) | 09-20 14:24 | v1456 A の末尾を実測の数を並べた字へ（納品） |
| [`y0920-1406.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1406.md) | 09-20 14:06 | 【宣言】A の末尾の一文を数入りの字へ差し替える（v1456） |
| [`y0920-1400.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1400.md) | 09-20 13:59 | 外した表の前後の字（L1497・そのまま写し） |
| [`y0920-1330-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330-2.md) | 09-20 13:50 | v1455 節五から猫牌の表の二つ目を外した（納品） |
| [`y0920-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1330.md) | 09-20 13:29 | 【宣言】説明欄の節五から猫牌の表の二つ目を外す（v1455） |
| [`y0920-1210.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1210.md) | 09-20 12:05 | 本体のいま三つ（較正-1 の綻び・猫牌の表・ダブルヨシ） |
| [`y0920-1146.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1146.md) | 09-20 11:56 | 今朝の枠の確かめと、実戦的中-2／持ち上げ-1 |
| [`y0920-1058-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058-2.md) | 09-20 11:28 | v1454 説明欄の三つの直し（納品） |
| [`y0920-1058.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1058.md) | 09-20 10:53 | 【宣言】説明欄に三つ手を入れる（v1454） |
| [`y0920-1055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1055.md) | 09-20 10:52 | subj-gap の見比べと step-slow の上限を直した（push-defer は直さない） |
| [`y0920-1040.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-1040.md) | 09-20 10:40 | 訴え三件の元（push-defer・subj-gap・step-slow）と、説明欄の二つの確かめ |
| [`y0920-0912-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912-2.md) | 09-20 09:49 | v1453 ずんだもん・枝豆・兎の文面の差し替え（納品） |
| [`y0920-0912.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0912.md) | 09-20 09:10 | 【宣言】ずんだもん・枝豆・兎の文面を mitate-new-2.txt へ差し替える（v1453） |
| [`y0920-0829.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0920-0829.md) | 09-20 08:32 | 09-19 の調べ四件・台帳の「見張り×2147946720」・ずんだもんと兎の文面 |
| [`y0919-2320.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2320.md) | 09-19 23:17 | stale の回に iPhone が鳴らない穴を塞いだ（🪟 に名乗り bad） |
| [`y0919-2255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-2255.md) | 09-19 23:09 | 連携の総点検（壊さず、作り値と実読みだけで） |

<!-- 控えの一覧 ここまで -->
