# 0x4A の三（三度目）— 昇格の問いは四回とも約2分で取り消し（印 y0911-0701）

**ヨシ待ち（残り1件）**（VAIO 07:02）— y0911-0627 のヨシ（①）を受けて問いを二回出したが、どちらも押されずに閉じた。**Minidump は写せていない。WinDbg は入れていない。**

## 出した刻と閉じた刻（`~/.claude/dumps/uac-asked.txt`）

| 回 | 出した | 閉じた | 長さ | 出した手 | 結果 |
|---|---|---|---|---|---|
| 1 | 09-10 17:26:27 | 17:28:30 | 2分03秒 | 裏の手（窓なし） | 取り消し |
| 2 | 09-11 06:25:07 | 06:27:11 | 2分04秒 | 裏の手（窓なし） | 取り消し |
| **3** | **09-11 06:55:02** | **06:57:06** | 2分04秒 | 裏の手（窓なし） | **取り消し（押されず）** |
| **4** | **09-11 06:59:11** | **07:01:13** | 2分02秒 | **見える窓「0x4A」** | **取り消し（押されず）** |

＊Windows は「いいえ」と時間切れを同じ文言で返すので、どちらだったかは見分けられない。**四回とも約2分**でそろっている。

## 調べたこと

| | |
|---|---|
| アカウント | `vaio\user` は**管理者**（Administrators に在り、UAC で絞られた札）。問いは**「はい／いいえ」**になるはずで、パスワードは要らない |
| UAC の設定 | 標準（`EnableLUA=1`・`ConsentPromptBehaviorAdmin=5`・`PromptOnSecureDesktop=1`） |
| 問いを出していた手 | **窓の無い裏の手**（`MainWindowHandle=0`）。前面に居ない手からの昇格の問いは、画面に出ずに**タスクバーの点滅だけ**になる |
| 四回目 | そこで**見える PowerShell の窓**から出し直した（中継の窓へ「タスクバーの点滅を押して」と先に送った）。**それも押されずに閉じた** |

＊今回の二つの指示は、どちらも**予定表から自動で届いた**もの（前もって書かれた文）。「いま画面の前に居る」の刻と、問いが出た刻がずれていた恐れがある。

## 確かな道 — 手で走らせてもらう

VAIO で **管理者の PowerShell**（スタート → PowerShell を右クリック → 管理者として実行）を開き、次の一行を走らせて **「済んだ」** と送ってください。

```
powershell -ExecutionPolicy Bypass -File C:\Users\user\.claude\dumps\elevated-copy.ps1
```

＊`C:\Windows\Minidump` の一覧を控え、**新しい二つ**を `~/.claude/dumps` へ写し、控え `elevated-copy.log` を書くだけ（**何も書き換えない**）。
＊「済んだ」が届いたら、すぐに**ダンプの頭**（bugcheck と引数四つ・刻）を読み、Event 1001 の五回分（引数1の末尾 `d684`・引数4の末尾 `c80`）と突き合わせる。
＊**WinDbg を入れるかどうかは、頭が読めてから改めて訊く**（いまは入れない）。

## 残り

**残り1件** — 0x4A の追い込み（上の「済んだ」待ち）。
＊v1438 の実機は検収待ち（右下の版の字が v1438・判定の中身は不変が合格）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **202件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0910-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1330.md) | 09-10 13:36 | 公開の止まり-1（印 y0910-1330） |
| [`y0910-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305.md) | 09-10 13:09 | 承認の足止めと自動モードの戻し道（印 y0910-1305） |
| [`y0910-0052-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052-2.md) | 09-10 01:30 | 一分おきの走り出し-1-2 — 甲で直した。作り値は三通りとも一本 |
| [`y0910-0052.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052.md) | 09-10 00:56 | 一分おきの走り出し-1 — 口を塞いだ。原因は**件名の末尾の空白** |
| [`ヨシの猫の組み直し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E7%B5%84%E3%81%BF%E7%9B%B4%E3%81%97.md) | 09-09 19:26 | ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる** |
| [`ヨシの猫のマス目.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E3%83%9E%E3%82%B9%E7%9B%AE.md) | 09-09 16:38 | ヨシの猫を差し替え-1 — マス目の割り出しと、箱を上げる案 |
| [`土台の直し-1の四段.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%9B%9B%E6%AE%B5.md) | 09-09 13:02 | 土台の直し-1 ① — 四段の材料の出どころ（名指しの一覧） |
| [`ヨシの猫を差し替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%82%92%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88-1.md) | 09-09 13:02 | ヨシの猫を差し替え-1 — 素材を測った。**輪郭が潰れるので止まる** |
| [`巡回の止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-09 12:16 | 巡回の止まり-1 — 11:02〜11:45 の43分 |
| [`土台の直し-1の材料.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E6%9D%90%E6%96%99.md) | 09-09 11:59 | 土台の直し-1 ① — 切り候補の四段は、いまどこから値を取っているか |

<!-- 控えの一覧 ここまで -->
