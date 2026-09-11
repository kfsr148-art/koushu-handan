# 落ちた後の起こし-2 — 窓の起こし直しと🪟・RC 切れの数え・遠隔の会話名

状態：終わり（残り1件：0x4A の三）　2026-09-11 20:20

## 結論
- 窓を閉じてから **136秒で claude が戻り、151秒で遠隔へ付き直した**（十分以内）。🪟 は一発だけ鳴った。
- 遠隔の会話の名と pid は state.json（rcName・rcPid）へ入り、panel v127 の下端に出る。

## 一　起こし直し
- 置いたもの：`~/.claude/revive-claude.ps1`（新・106行・BOM有・構文誤り0）と予定の仕事 **ClaudeRevive**（毎分）
- 動き：対話の claude.exe（-p／--print を除く）が0本のまま2分続くと ClaudeCodeAtLogon を叩く（koushu-handan で claude --continue）。前に起こしてから10分は再度叩かない
- 🪟：題「🪟 窓を起こし直しました（今日N回目）」を ntfy-say.ps1 経由で一発
- 今日の回数：落ちは2回（10:02〜10:16 の14.5分・20:11:59 の試し）。自動の起こし直しは **1回**（20:14:11 の試し）。10:16:49 に戻したのは予定の仕事ではない（ClaudeCodeAtLogon の最終実行は 00:42）

## 二　Remote Control の切れ（今日）
遠隔の切れを残す記録は機械に無い（2026-08-25 に記録の仕掛けは見送り）。拾えた分：

| 刻 | 何が | 窓 |
|---|---|---|
| 00:38:23 | 遠隔の外れ（cdacbe8f の remote_session_change・url 空） | 生（プロセス2・窓2） |
| 10:01:16〜10:16:49 | 窓ごと落ち（10:02:22 にプロセス0） | 落 |
| 11:16:45〜11:18:51 | 窓の入れ替わり（新 7124 が 11:17:10 に付き直し） | 生 |
| 20:11:59〜20:14:31 | 三の試し（閉じた→7272 が付き直し） | 落 |

＊プロセスが生きたまま糸だけ切れた回は、記録が無いので数えられない。

- 表示：`inbox-watch.ps1` L515-535・L577-578 で `~/.claude/sessions/<pid>.json` のうち bridgeSessionId があり pid が claude として生きているものから名と pid を読み、state.json の `rcName`・`rcPid` へ（写し .bak-20260911・1010行・誤り0・BOM有・常駐 pid 4804 起動19:58:29＞台本19:56:21・1本）
- パネル：panel v127（commit 1588ff43）。下端に「遠隔：名（pid N）」。取れなければ畳む
- 実測：state.json に `"rcName":"koushu-handan-7a","rcPid":7124`（試しの前）

## 三　検収（実測）
- 20:11:59 窓を閉じた（cmd 6904・claude 7124）
- 20:12:11 ClaudeRevive が0本を見た
- 20:14:11 起こし直した（今日1回目）
- 20:14:15 🪟 を送った（notify-sent.tsv）／claude pid 7272 が戻った（136秒）
- 20:14:31 会話の札 koushu-handan-66・interactive・pidDomain=win32:vaio・遠隔 session_012Cx…（151秒）

## そのほか
- `.claude/settings.json` の allow に Bash(Get-*)・Bash(Select-String*)・Bash(Test-Path*)・Bash(Get-Content*) を足した（Read は元から在った）。＊PowerShell の道具で打つ命令には Bash(…) の決まりは掛からない。PowerShell 側も訊かない形にするなら PowerShell(Get-*) などの行が要る

## 実機で見るところ
- Code タブの一覧で、koushu-handan の行にパソコンの印が付いている
- 返事パネルの下端が「遠隔：koushu-handan-66（pid 7272）」で、版の字が panel v127

## 残り
1. 0x4A の三 — 管理者の PowerShell で elevated-copy.ps1 を走らせてもらう待ち（y0911-0956）

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 落ちた後の起こし-2 終わり（残り1件）

```
落ちた後の起こし-2 — 終わり（残り1件：0x4A の三）
一 revive-claude.ps1＋予定の仕事 ClaudeRevive（毎分）。0本2分で claude --continue を起こし🪟を一発。今日の自動の起こし直し 1回（20:14:11）
二 遠隔の切れ（今日・記録から拾えた分）：00:38:23 遠隔の外れ 窓=生／10:01〜10:16 窓ごと落ち 窓=落／11:16:45〜11:18:51 窓の入れ替わり 窓=生／20:11:59〜20:14:31 試し 窓=落。糸だけ切れた回は記録が無く数えられない
二 state.json に rcName・rcPid、panel v127 の下端に「遠隔：名（pid N）」
三 20:11:59 閉じた
三 20:14:11 起こし直した
三 20:14:15 claude 7272 が戻った（136秒）・🪟 送信
三 20:14:31 札 koushu-handan-66・win32:vaio・遠隔に付き直し（151秒）
settings.json の allow に Bash(Get-*)・Bash(Select-String*)・Bash(Test-Path*)・Bash(Get-Content*)。PowerShell の道具には掛からない
実機：Code タブの koushu-handan の行にパソコンの印／パネル下端「遠隔：koushu-handan-66（pid 7272）」・panel v127
```

### 2. ✅ 終わりました（返事不要）

```
落ちた後の起こし-2 — 窓の起こし直しと🪟・RC 切れの数え・遠隔の会話名を state へ
Claude Code が戻りました。
```

### 3. 🪟 窓を起こし直しました（今日1回目）

```
対話の Claude Code が0本になっていたので、claude --continue で起こし直しました。
落ちを見た刻 20:12:11／起こした刻 20:14:11（0本が2分）
今日 1回目

＊記録は ~/.claude/revive.log にあります。
```

### 4. 🪟 異常です（手が要ります）

```
落ちた後の起こし-2 — 窓の起こし直しと🪟・RC 切れの数え・遠隔の会話名を state へ
Claude Code が動いていません。落ちたか、閉じられました。
こちらがすること：端末で Claude Code を開き直してください。
```

### 5. ✅ 終わりました（返事不要）

```
写せます（1件）
```

<!-- 送った知らせ ここまで -->

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **203件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0910-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1330.md) | 09-10 13:36 | 公開の止まり-1（印 y0910-1330） |
| [`y0910-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305.md) | 09-10 13:09 | 承認の足止めと自動モードの戻し道（印 y0910-1305） |
| [`y0910-0052-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052-2.md) | 09-10 01:30 | 一分おきの走り出し-1-2 — 甲で直した。作り値は三通りとも一本 |
| [`y0910-0052.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052.md) | 09-10 00:56 | 一分おきの走り出し-1 — 口を塞いだ。原因は**件名の末尾の空白** |
| [`ヨシの猫の組み直し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E7%B5%84%E3%81%BF%E7%9B%B4%E3%81%97.md) | 09-09 19:26 | ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる** |
| [`ヨシの猫のマス目.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E3%83%9E%E3%82%B9%E7%9B%AE.md) | 09-09 16:38 | ヨシの猫を差し替え-1 — マス目の割り出しと、箱を上げる案 |
| [`土台の直し-1の四段.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%9B%9B%E6%AE%B5.md) | 09-09 13:02 | 土台の直し-1 ① — 四段の材料の出どころ（名指しの一覧） |
| [`ヨシの猫を差し替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%82%92%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88-1.md) | 09-09 13:02 | ヨシの猫を差し替え-1 — 素材を測った。**輪郭が潰れるので止まる** |
| [`巡回の止まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%B7%A1%E5%9B%9E%E3%81%AE%E6%AD%A2%E3%81%BE%E3%82%8A-1.md) | 09-09 12:16 | 巡回の止まり-1 — 11:02〜11:45 の43分 |

<!-- 控えの一覧 ここまで -->
