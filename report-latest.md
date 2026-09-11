# 0x4A の三（四度目）— 管理者の窓を開かずに、読める分を片付けた

状態：終わり（残り0件）　2026-09-11 21:20

## 結論
- 0x4A は **08-16〜09-10 に11回**。どの回も **ntdll の NtDeviceIoControlFile**（ドライバへの IOCTL）から、**IRQL=1（APC_LEVEL）のまま戻って**落ちている。
- 疑いは無線LANのドライバ **athw10x.sys**（Qualcomm Atheros AR9485WB-EG・10.0.0.352・2017-06-19）。決め手はダンプが要る。

## 管理者なしで取れたもの（一項目一行）
- Event 41：0x4A が11回（08-16 22:22／22:49／08-17 02:06／08-19 15:25／21:44／22:52／08-23 23:33／08-28 02:37／09-09 20:03／09-10 09:14／18:08）
- 引数1：ユーザー側の番地で、下16ビットは毎回 **d684**（上は ASLR で毎回違う）
- 引数2：毎回 **1**（APC_LEVEL）
- d684 の正体：ntdll.dll（2025-10-14）の出口表を読み、syscall 命令の直後の RVA の下16ビットが d684 になるのは **NtDeviceIoControlFile（syscall 0x7・RVA 0x9d684）** だけ。win32u.dll は当たり無し
- setupapi.dev.log：無線LANの器（PCI VEN_168C DEV_0032）の Restart Device が 08-15 18:14・08-16 22:23・08-19 15:25。後の二つは 0x4A の再起動の直後。08-15 は svchost（LocalSystemNetworkRestricted）が器を外して入れ直している
- 更新：08月の間に入ったのは Defender の定義だけ。09-09 に KB5126256（ESU の準備）——0x4A は 08-16 から出ているので無関係
- 落ちの直前2分（6008 の刻）に System・WLAN の記録は無し

## 読めなかったもの
- C:\Windows\Minidump … Access denied
- C:\ProgramData\Microsoft\Windows\WER\ReportArchive\Kernel_4a_*（13束）… 束の中は Access denied
- いまの札は Medium で、BUILTIN\Administrators は deny only（UAC で絞った札）

## UAC が要るところ（飛ばした）
1. 理由：ダンプ（Minidump・MEMORY.DMP・WER の Kernel_4a 束）は Administrators と SYSTEM しか読めない。いまの札では Administrators が deny only なので、読むには昇格が一度要る
2. 代わりの手1：VAIO の前で一度だけ「はい」を押し、SYSTEM で走る予定の仕事（起動のたびに Minidump を ~/.claude/dumps へ写し、読める権限にする）を置く。以後は人手なしで、落ちるたびに頭まで読める
3. 代わりの手2：ダンプを読まずに切り分ける。落ちが続く間は無線LANを切って有線（または USB の無線）で使い、0x4A が止まるかを Event 41 で数える

## 片付けたもの
- yoshi-open.tsv から、管理者の窓を待っていた y0911-0627・0701・0956 を落とした（写し .bak-20260911-2120）

## 残り
残り0件（台帳の 0x4A の三の三行は、この四度目へ統合）

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 0x4A の三（四度目）終わり（残り0件）

```
0x4A の三（四度目）— 終わり（残り0件）
0x4A は 08-16〜09-10 に11回。毎回 ntdll の NtDeviceIoControlFile（syscall 0x7）から IRQL=1 のまま戻って落ちる（引数1 の下16ビット d684・引数2=1）
疑い：無線LAN athw10x.sys（Qualcomm Atheros AR9485・10.0.0.352・2017-06-19）。器の Restart Device が 08-16 22:23・08-19 15:25（どちらも 0x4A の直後）
決め手（どのドライバの IOCTL か）はダンプが要る
UAC の理由：ダンプは Administrators と SYSTEM しか読めず、いまの札は Administrators が deny only
代わりの手1：一度だけ「はい」で SYSTEM の予定の仕事（起動のたびに Minidump を写す）を置けば、以後は人手なし
代わりの手2：無線LANを切って有線か USB の無線で使い、0x4A が止まるかを数える
管理者の窓を待つ印 y0911-0627・0701・0956 は落とした
```

### 2. ✅ 終わりました（返事不要）

```
写せます（5件）
```

### 3. ✅ 終わりました（返事不要）

```
revive-test.txt を読んで結果を三行で書け。それが済んだら .cl
三を始める——revive-test.ps1 を WMI から切り離して起こし、20秒後にこの窓（cmd 6904・claude 7124）を止める。戻るまでを ~/.claude/revive-test.txt に一項目一行で残す。起こし直された窓で結果を読み、報告の札を立てる
ファイル: ~/.claude/revive-claude.ps1（新）／~/.claude/inbox-watch.ps1／panel.html／panel-ver.txt／orders-open.tsv
実測: state.json … "rcName":"koushu-handan-7a","rcPid":7124
実機: 返事パネルの一番下（使用量の下）に「遠隔：koushu-handan-7a（pid 7124）」の一行が出て、版の字が panel v127
```

### 4. ✅ 落ちた後の起こし-2 終わり（残り1件）

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

### 5. ✅ 終わりました（返事不要）

```
落ちた後の起こし-2 — 窓の起こし直しと🪟・RC 切れの数え・遠隔の会話名を state へ
Claude Code が戻りました。
```

<!-- 送った知らせ ここまで -->

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **204件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0910-1330.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1330.md) | 09-10 13:36 | 公開の止まり-1（印 y0910-1330） |
| [`y0910-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-1305.md) | 09-10 13:09 | 承認の足止めと自動モードの戻し道（印 y0910-1305） |
| [`y0910-0052-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052-2.md) | 09-10 01:30 | 一分おきの走り出し-1-2 — 甲で直した。作り値は三通りとも一本 |
| [`y0910-0052.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0910-0052.md) | 09-10 00:56 | 一分おきの走り出し-1 — 口を塞いだ。原因は**件名の末尾の空白** |
| [`ヨシの猫の組み直し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E7%B5%84%E3%81%BF%E7%9B%B4%E3%81%97.md) | 09-09 19:26 | ヨシの猫を差し替え-1 — 組み直しても輪郭が残らなかった。**取り下げる** |
| [`ヨシの猫のマス目.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%81%AE%E3%83%9E%E3%82%B9%E7%9B%AE.md) | 09-09 16:38 | ヨシの猫を差し替え-1 — マス目の割り出しと、箱を上げる案 |
| [`土台の直し-1の四段.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%9B%9B%E6%AE%B5.md) | 09-09 13:02 | 土台の直し-1 ① — 四段の材料の出どころ（名指しの一覧） |
| [`ヨシの猫を差し替え-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%83%A8%E3%82%B7%E3%81%AE%E7%8C%AB%E3%82%92%E5%B7%AE%E3%81%97%E6%9B%BF%E3%81%88-1.md) | 09-09 13:02 | ヨシの猫を差し替え-1 — 素材を測った。**輪郭が潰れるので止まる** |

<!-- 控えの一覧 ここまで -->
