# 撮って自動で判定した時の声（y1113-2354・v1468）

**終わり** — 2026-11-14 00:17（VAIO）。残り0件。v1468（8a030921）で雲の速い版は全てPASS・配信済み。

| 番号 | 結果 |
|---|---|
| 1 | 自動で判定している間に頼まれた声（攻め／守り）は鳴らさず控え、次に画面に触れた時（指を離す・クリック・キー）に一度だけ鳴らす。字（判定の一言・人柄の台詞）は「判定する」を押した時と同じく先に出る。 |

## 下調べ

写しで、受付ページの写真から自動で判定した時と「判定する」を押した時を比べた。判定カードの字（.verdict-word・.tone-angle）は両方とも同じ形で出ていた。違うのは声で、自動の時は受付ページから読み直した直後で画面に一度も触れておらず、スマホの決まりで音声ファイルも OS の読み上げも鳴らせない。

## 実測（写しで声の呼び出しを数えた・844x390）

| いつ | 直す前 v1467 | 直した後 |
|---|---|---|
| 自動で判定した直後 | 読み上げ「守り」を呼ぶ（触れる前なので実機では鳴らない） | 0回（控える） |
| 一度触れた後 | 同じ1回のまま | 「守り」1回 |
| 二度目に触れた後 | — | 増えない |
| 「判定する」を押した時 | すぐ1回 | すぐ1回（今までどおり） |

＊「セリフ」は、判定するを押した時に鳴る声（攻め／守り）と読んだ。人柄の台詞の全文の読み上げは今の判定するの流れに無いので足していない。
＊シムなし（probe は写しにだけ差し、写しごと消した）。

## 実機で見る所

受付ページで撮る → 判定画面に字が出る → 画面に一度触れると「攻め」か「守り」が聞こえる。版の字が v1468。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **653件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y1113-2354.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2354.md) | 11-14 00:17 | 撮って自動で判定した時の声（y1113-2354・v1468） |
| [`cloud-check-fast-20261113-150313.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-150313.md) | 11-14 00:07 | 雲で回した：`check-fast.js` |
| [`y1113-2241.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2241.md) | 11-13 23:25 | 写真取込の読み直し（y1113-2241・v1466→v1467） |
| [`cloud-check-fast-20261113-141206.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-141206.md) | 11-13 23:15 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-140705.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-140705.md) | 11-13 23:09 | 雲で回した：`check-fast.js` |
| [`y1113-2126.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2126.md) | 11-13 22:22 | 写真取込の三件（y1113-2126・v1463〜v1465） |
| [`cloud-check-fast-20261113-131005.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-131005.md) | 11-13 22:15 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-130004.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-130004.md) | 11-13 22:09 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-124356.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-124356.md) | 11-13 21:47 | 雲で回した：`check-fast.js` |
| [`y1113-2057.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2057.md) | 11-13 21:39 | 横画面で場を押すと並びがずれる（y1113-2057・v1462） |
| [`cloud-check-fast-20261113-122520.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-122520.md) | 11-13 21:28 | 雲で回した：`check-fast.js` |
| [`cloud-check-fast-20261113-121529.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-121529.md) | 11-13 21:24 | 雲で回した：`check-fast.js` |
| [`y1113-2020.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-2020.md) | 11-13 20:39 | 写真取込の後、上の写真を手牌の帯だけに切り抜く（y1113-2020・v1460） |
| [`cloud-check-fast-20261113-112830.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-112830.md) | 11-13 20:33 | 雲で回した：`check-fast.js` |
| [`y1113-1931.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y1113-1931.md) | 11-13 19:58 | 写真取込の後、横画面で下の釦が切れる（y1113-1931・v1459） |
| [`cloud-check-fast-20261113-104749.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-check-fast-20261113-104749.md) | 11-13 19:52 | 雲で回した：`check-fast.js` |
| [`r1113-1528-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1113-1528-2.md) | 11-13 15:28 | 再起動-2（r1113-1528・後の測り） |
| [`r1113-0337-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1113-0337-2.md) | 11-13 03:37 | 再起動-2（r1113-0337・後の測り） |
| [`r1112-1524-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1112-1524-2.md) | 11-12 15:24 | 再起動-2（r1112-1524・後の測り） |
| [`r1112-0331-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/r1112-0331-2.md) | 11-12 03:31 | 再起動-2（r1112-0331・後の測り） |

<!-- 控えの一覧 ここまで -->
