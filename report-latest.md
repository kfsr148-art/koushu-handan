# 報告 — 押し通知・音・窓・タイトルの手当て（2026-08-21 19:02 VAIO時計）

**状態：終わり。裁定待ちが3件。鳴きの測定は未着手。**

結論を先に二行で。

- **押し通知がスマホへ飛ばない理由は、抑止ではなく `Remote Control` が切れていること。**
  環境変数の手当ては効いていて、いま止めているのはこちらです。
- **タイトルの印は、画面に出るようになりました。**`AttachConsole` で親のコンソールへ
  繋ぎ直す形（裁定：丙）が実測で通りました。

> **注意：同じ依頼を、別のセッションも同時に走らせています。**
> `report-latest.md` は 18:49 に別セッション（窓の題「◐ Push notifications not arriving」）が
> 書いて commit 9442b0b にしています。この報告はその上書きです。二重に走らせると
> 報告ファイルの取り合いになるので、どちらか一方に寄せてください。

---

## 【1】フックの音を止めた（済）

`hook-notice.ps1` から、音に関わる処理だけを外しました。

- 消したもの — `$Sound` の表（`Windows Notify.wav` / `chimes.wav`）、`Media.SoundPlayer` の再生、
  記録の `音=` 欄、音について書いてあった注釈4行。
- **残したもの** — タイトルの書き換え、`hook.log` への追記、`heartbeat`、押し通知の読み取り。

置換は8箇所すべて「1件だけ一致」を確かめてから当てています。当てたあと
`System.Management.Automation.Language.Parser` で構文検査、**OK**。BOM も保ったままです。

記録の欄はこう変わりました。

```
旧: notification  音=OK  押し通知=なし  タイトル=OK  題[...]
新: notification  押し通知=なし  タイトル=OK  繋ぎ=親  題[...]
```

## 【2】環境変数は読まれている（値=1）

**読まれています。** 動いている工程が継いだ環境に、そのまま入っていました。

```
CLAUDE_CODE_DISABLE_NOTIFICATION_PRESENCE_CHECK=1
```

`settings.json` の `env` に入れたのが 12:52、この工程の起動が 18:44 なので、起動時に読み込まれた筋です。

## 【3】適用は不要だった

【2】のとおり効いているので、**再起動なしで効かせる手を探す必要がありませんでした。** 何も足していません。

そのうえで、**押し通知が飛ばない本当の理由**を実測で掴みました。実際に一本出した返事がこれです。

```
Terminal notification sent. Mobile push not sent (Remote Control inactive).
```

- **抑止は掛かっていません**（掛かっていれば「ターミナル操作中のため送られず」が出る。11:11 の記録がその形）。
- **モバイルへ出ないのは `Remote Control` が切れているから。** 03:09 の記録が
  「送信済み（ターミナル通知＋モバイル要求あり）」なので、**その頃は繋がっていました。**
  どこかで切れたまま、いまに至っています。

**繋ぎ直す手立ては二つあります。**

1. **立ち上げ直すとき** — `claude --remote-control` で始める。
   `claude -c --remote-control` なら**いまの会話を継いだまま**繋がります。
2. **設定で常時にする** — 本体に **`remoteControlAtStartup`** という設定キーが実在します
   （`claude.exe` の字面から確認。`remoteControlName` / `remoteControlSessionNamePrefix` も同居）。
   `settings.json` に入れれば、次からは立ち上げるだけで繋がります。
   **頼まれていないので、まだ入れていません。裁定をください。**

## 【4】Windows のユーザー環境変数にも入れた（済）

`setx` で恒久化し、レジストリから読み直して確認しました。

```
[Environment]::GetEnvironmentVariable(...,'User')   → 1
HKCU:\Environment                                   → 1
```

`settings.json` を読まない立ち上げ方をしても効きます。※ 既に走っている窓には効きません（次回の起動から）。

## 【5】フックの窓は出ていない（実測）

`-WindowStyle Hidden` は**前回すでに入っており、いまも入っています**。そのうえで実測しました。

`EnumWindows` で**可視の最上位の窓**だけを数え、フックの発火前と発火の最中（3秒粘っている間）で比べます。

```
発火の前  : cmd(9188)◐Push notification issue / chrome / 設定×2 / TextInputHost / Program Manager … 6個
発火の最中: 同じ 6個（フックの pid=8068 の窓は 0個）
```

**増えていません。フックは窓を出していません。** 前回の見立て（残っていた窓は VAIO の `VCAgent` 側）のままです。

居残りの `powershell.exe` も確認しました。古いセッションの見張り（`watch-window.ps1` /
`watch-title.ps1`）が2本走っていましたが、**いずれも窓は持たず、いまは終了しています。**

## 【6】別の経路でスマホへ知らせる（調査）

**追加の契約が要らないものは、あります。ただし「登録ゼロ」は一つだけです。**

| 経路 | 契約 | 登録 | 実際のところ |
|---|---|---|---|
| **ntfy.sh** | **不要** | **不要**（アプリを入れるだけ） | 本命。下に詳述 |
| ntfy.sh のメール転送 | 不要 | 不要 | `curl -H "Email: 宛先" -d "本文" ntfy.sh/話題名` の一行で送れる |
| 自前の SMTP（Gmail 等） | 不要 | **要**（アプリパスワードの発行と保管） | 鍵を平文で置くことになる。勧めません |
| Pushover | **要（有料）** | 要 | 対象外 |
| Pushbullet / IFTTT / Discord | 不要〜 | **要（アカウント）** | 既にお持ちなら可 |
| LINE Notify | — | — | **2025-03-31 で終了**。使えません |
| Windows の「スマホ連携」 | 不要 | 要 | 任意の知らせを送る口が無い |

**ntfy.sh の要点**

- **送る側** — `curl -d "本文" https://ntfy.sh/<話題名>` の一行だけ。鍵も JSON も要りません。
- **受ける側** — スマホに ntfy のアプリを入れ、同じ話題名を購読するだけ。**アカウント作成なし。**
- **落とし穴** — 公開サーバでは**話題名がそのまま合鍵**です。公式が
  「the topic is essentially a password」と書いています。**推測されない長い名前**にしてください。
  逆に言えば、名前が漏れれば他人も読めます。**本文に中身を書かず「ヨシ待ち」程度に留めるべき**です。

**外へ物を出すことになるので、こちらの判断では実行していません。**「入れてよい」と言われたら、
フックへ一行足して、話題名はランダムな長い文字列で作ります。

## 【7】タイトルの印が画面に出ているか（実測 → 直した）

**出ていませんでした。そして直りました。**

**なぜ出ていなかったか。** `-WindowStyle Hidden` を付けると、`powershell.exe` は
**自前のコンソールを持ちます**。`$Host.UI.RawUI.WindowTitle` はその**隠し窓の題**を書き換えるだけで、
端末には何も起きません。記録の「タイトル=OK」は「自分の窓には書けた」という意味でしかなく、
`題[C:\WINDOWS\System32\WindowsP...]` がその証拠でした（12:53 までは `◑ Session ...` が読めていた＝
端末のコンソールを共有していた。13:02 以降、Hidden を入れた時点で別れています）。

**外から読んだ実物の題**（`EnumWindows` ＋ `GetWindowTextW`）:

```
cmd(9188) の題 = [◐ Push notification issue]     ← ★も●も無い
```

**丙（AttachConsole）の実測。** 隠しの子から `FreeConsole` → `AttachConsole(ATTACH_PARENT_PROCESS)`:

```
繋ぐ前 : console title = [C:\WINDOWS\System32\WindowsPowerShell\v1.0\powershell.exe]
繋いだ後: console title = [◑ Push notification issue]      ← 端末のコンソールを掴んだ
書いた後: console title = [★test ◑ Push notification issue]
```

**通りました。** これを `hook-notice.ps1` へ組み込み、実際に発火させた記録がこれです。

```
18:56:06  notification  押し通知=なし  タイトル=OK  繋ぎ=親  題[◐ Push notification issue]
18:56:11  notification  画面=出   画面の題[★待ち ◑ Push notification issue]
18:56:17  resume        押し通知=なし  タイトル=OK  繋ぎ=親  題[◑ Push notification issue]
18:56:17  resume        画面=出ず  画面の題[◑ Push notification issue]
```

**記録の読み方が二段になりました。**

- `繋ぎ=親` … 端末のコンソールを掴めた（`自` なら掴めず、旧来の `$Host` 経由へ落ちている）
- `画面=出` … **3秒粘ったあと、窓の題を `GetWindowTextW` で読み直して、先頭に印があった**
- `画面=出ず` … 印が無い。`resume` は外すのが仕事なので「出ず」が正解

**これが【7】の答えです。**「書けたか」ではなく「**画面に出ているか**」を、毎回こちらで読めるようになりました。

**一つ、性質として残る限界。** Claude Code は作業中、題の先頭の記号（◐◑◒◓…）を回して**上書きし続け**ます。
上の記録でも、書いた3秒の間に ◐ が ◑ に変わっています。印は先頭に付け直し続けて勝たせていますが、
**フックが終われば次の書き戻しで消えます**。入力待ちの間は Claude Code 側が題を触らないので残ります。

## 【8】いま置かれている状態

| 件 | 状態 |
|---|---|
| 【1】音 | **止めた**（構文OK・BOM保持） |
| 【2】環境変数の確認 | **読まれている**（値=1） |
| 【3】再起動なしで効かせる | **不要だった**／真因は `Remote Control` 切断 |
| 【4】ユーザー環境変数 | **設定済**（レジストリで確認） |
| 【5】窓 | **フックの窓は出ていない**（可視の窓は増えない） |
| 【6】別経路 | **ntfy.sh があります**（契約・登録とも不要）。未実行 |
| 【7】タイトル | **画面に出るようにした**（AttachConsole・裁定 丙） |

## 裁定をお願いしたいこと（3件）

1. **`Remote Control` を繋ぎ直しますか。** これが押し通知の本丸です。
   いまの会話を継ぐなら **`claude -c --remote-control`**。打つのはあなたです。
2. **`remoteControlAtStartup` を `settings.json` に入れますか。** 入れれば毎回自動で繋がります。
   **頼まれていないので入れていません。**
3. **ntfy.sh を入れますか。** 入れるなら話題名は長いランダム文字列にし、本文は
   「ヨシ待ち」程度の中身の無いものに留めます。

## 触れていないこと

- **リポジトリの本体は無変更**（`koushu-handan.html` も `ver.txt` も触っていません。この報告のみ）。
- `settings.json` は**今回いじっていません**（`-WindowStyle Hidden` は前回のまま、`env` も前回のまま）。
- **鳴きの測定は未着手**です。

## `hook.log`（最後の20行）

```
2026-08-21 18:28:42  heartbeat     生存
2026-08-21 18:38:27  heartbeat     生存
2026-08-21 18:40:37  resume        音=-   押し通知=なし  タイトル=OK  題[C:\WINDOWS\System32\WindowsP]
2026-08-21 18:42:33  notification  音=OK  押し通知=なし  タイトル=OK  題[C:\WINDOWS\System32\WindowsP]
2026-08-21 18:44:53  resume        音=-   押し通知=なし  タイトル=OK  題[C:\WINDOWS\System32\WindowsP]
2026-08-21 18:46:38  stop          音=OK  押し通知=なし  タイトル=OK  題[C:\WINDOWS\System32\WindowsP]
2026-08-21 18:46:55  resume        音=-   押し通知=なし  タイトル=OK  題[C:\WINDOWS\System32\WindowsP]
2026-08-21 18:48:09  heartbeat     生存
2026-08-21 18:54:46  notification  押し通知=なし  タイトル=OK  繋ぎ=親  題[◐ Push notification issue]
2026-08-21 18:54:51  notification  画面=出   画面の題[★待ち ◐ Push notification issue]
2026-08-21 18:56:06  notification  押し通知=なし  タイトル=OK  繋ぎ=親  題[◐ Push notification issue]
2026-08-21 18:56:11  notification  画面=出   画面の題[★待ち ◑ Push notification issue]
2026-08-21 18:56:17  resume        押し通知=なし  タイトル=OK  繋ぎ=親  題[◑ Push notification issue]
2026-08-21 18:56:17  resume        画面=出ず  画面の題[◑ Push notification issue]
2026-08-21 18:58:43  PushNotify    結果=ターミナルのみ（Remote Control 切断でモバイル不送信）
```

**`音=` の欄が消え、`繋ぎ=` と `画面=` が増えた行から先が、今回の形です。**
以後は **`繋ぎ=親` と `画面=出` の二つが揃っているか**を見てください。
