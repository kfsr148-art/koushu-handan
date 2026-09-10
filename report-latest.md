# 錠の名を揃え、落ちの正体を割った（印 y0910-1655）

**終わり（残り2件）** — 一〜三は済み。**機械は眠っていない。二度とも BSOD（0x4A）で落ちている。**

## 一、`remoteControlAtStartup`

**足す必要がありませんでした。既に `true` で入っています**（`~/.claude/settings.json` の7行目）。
写しも取ってあります（`settings.json.bak-20260910`・md5 `bd6246…` 一致・4065B・160行・BOM有）。
本体は無変更（更新時刻 08-24 19:12 のまま）。

## 二、錠の名を揃えた

**写しを取ってから一字**（`git-push.ps1.bak-20260910b`・13471B・228行）。err=0・**231行**・BOM有。

| ファイル | 行 | 名 | 望む字面と一致 |
|---|---|---|---|
| `git-push.ps1` | **154** | `Local\ClaudeGitPushGate` | **True** |
| `push-mine.ps1` | 24 | `Local\ClaudeGitPushGate` | **True** |
| `heavy-push.ps1` | 52 | `Local\ClaudeGitPushGate` | **True** |

＊突き合わせは `-ceq`（大小も見る）。三つとも同じ字面です。
＊枝 `claude/git-push-lock-alignment-lzcte6` は**取り込んでも参照してもいません**（いま `main`・未 push 0件）。

### 20:01:35 の前後一分に push は二本あったか

**ありません。0本です。** `hook.log`・`watch-notify.log` とも、その一分に**一行も無い**——
それどころか**両方の記録が途切れています**（`hook.log` 19:59:08 → **20:33:49**／
`watch-notify.log` 20:00:11 → **20:34:55**）。押しがぶつかったのではなく、**機械が落ちています。**

## 三、電源の字面と、落ちの正体

### 直す前 → 直した後

| 何 | 直す前 | 直した後 |
|---|---|---|
| スリープまでの時間 | AC=`0x00000000`／DC=`0x00000000`（**もともと「なし」**） | 同じ（`standby-timeout-ac 0` を打ち直した・終了コード0） |
| 休止までの時間 | AC=`0x00000000`／DC=`0x00000000`（**なし**） | 同じ（触っていない） |
| 蓋を閉じたときの動作 | **隠れ設定**で `powercfg /q` に出ない（`Attributes=1`＝ATTRIB_HIDE） | **AC=0／DC=0＝「何もしない」**（帳面で読み直して確認） |
| 休止の有無（`powercfg /a`） | スタンバイ(S3)・休止状態・ハイブリッド スリープ・高速スタートアップが**使える**。S1／S2／S0 は非対応 | 同じ |

＊蓋の設定は `powercfg /q` に出ないので、**帳面（`…\PowerSchemes\381b4222…\4f971e89…\5ca83367…`）の
`ACSettingIndex` / `DCSettingIndex`** で読み直しました。どちらも **0**。

### 眠った刻・起きた刻

**一件もありません。** `Power-Troubleshooter`（Id=1）の記録は**0件**で、
`Kernel-Power` の 42（眠りに入る）／107（起きる）も**0件**。**この機械は眠っていません。**

代わりに出てきたのは**落ちた記録**です。

| 刻 | 何 |
|---|---|
| **09-09 20:03:01** | `Kernel-Power` **Id=41**・**BugcheckCode=74（0x4A）**・PowerButtonTimestamp=0 |
| 09-09 20:03:45 | `EventLog` 6005 起動／**6008「以前のシステム シャットダウン (19:59:20) は予期されていませんでした」** |
| 09-09 20:07:37 | `User32` 1074 … TrustedInstaller が再起動を始めた（更新の当て込み） |
| 09-09 20:08:59 | `EventLog` 6005 起動（二度目） |
| **09-10 09:14:42** | `Kernel-Power` **Id=41**・**BugcheckCode=74（0x4A）** |
| 09-10 09:15:07 | `EventLog` 6005 起動／**6008「以前のシステム シャットダウン (8:49:00) は予期されていませんでした」** |
| 09-10 09:25:32 | `WER-SystemErrorReporting` 1001 … **バグチェック 0x0000004a** |

＊6008 の刻（19:59:20／8:49:00）は**最後に時計を書き落とした刻**で、落ちた刻そのものではありません。
　落ちた刻は Id=41 の側（20:03:01／09:14:42）で挟めます。
＊`C:\Windows\MEMORY.DMP` は **2026-09-10 09:15:04** に書かれています。`Minidump` の folder は
　権限が足りず一覧できません（読むには管理者の窓が要ります）。

### `state.json` の `at` が止まった刻と一致するか

**一致します。** `state.json` の commit は 19:59:13 → 20:00:10 → 20:00:40 → 20:01:03 →
**20:01:35（`17126021`）で止まり**、次は `.git` を直した後の **01:21:24** まで空きます。
**`20:01:35` の直後に落ちた**（Id=41 の復帰が 20:03:01・記録の途切れが 20:00:11）ので、
`.git` が壊れたのはこの落ちの瞬間です。**押しの重なりでも、眠りでもありません。**

＊**09-10 の「窓ごと落ちた」も同じ形。** 控えの最後の項目が **09:13:04**、`hook.log` の
　生存が **09:08:12 → 09:38:45** で30分空き、その間に **09:14:42 の Id=41**。
　窓だけが落ちたのではなく、**機械ごと落ちています。**

## 残り

`残り2件` — ①**押しの黙り-1**、②**土台の直し-1**（VAIO で走っている分）。
別に、**0x4A の中身**（`MEMORY.DMP` は在るが `Minidump` は権限不足）を追うかどうかの裁定。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **195件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`猫を全部白へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%82%92%E5%85%A8%E9%83%A8%E7%99%BD%E3%81%B8-1.md) | 09-09 11:06 | 猫を全部白へ-1 — 頭の猫が地に沈む件（全状態） |
| [`黒猫の待機-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-3.md) | 09-09 09:54 | 黒猫の待機-3 — ヨシ待ちの猫を白から黒へ戻す |
| [`土台の直し-1の宣言.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%A3%E8%A8%80.md) | 09-09 05:55 | 土台の直し-1 — 宣言（ヨシ待ち） |
| [`serifuの再抽出.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/serifu%E3%81%AE%E5%86%8D%E6%8A%BD%E5%87%BA.md) | 09-09 04:50 | serifu.txt / serifu-adv.txt の再抽出（作法17） |
| [`兎の台詞-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E5%8F%B0%E8%A9%9E-1.md) | 09-09 03:27 | 兎の台詞-1（出し直し）— serifu.txt の中の兎 |
| [`写しの重さ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%87%8D%E3%81%95-1.md) | 09-08 22:26 | 写しの重さ-1 — note-at-stop.txt は帳面として太るか |
| [`取り残しの検収-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97%E3%81%AE%E6%A4%9C%E5%8F%8E-1.md) | 09-08 22:03 | 取り残しの検収-1 |

<!-- 控えの一覧 ここまで -->
