# 閲覧用の URL 一覧

このリポジトリで「いまの様子」と「報告」を書いているファイルの、raw の URL。
ログインなしで読める（このリポジトリは **PUBLIC**）。

- オーナー名 : `kfsr148-art`
- リポジトリ名 : `koushu-handan`
- 枝 : `main`
- 作業フォルダの実体 : `C:\Users\user\Desktop\mahjong\koushu-handan`

## 状態と報告

| ファイル | 中身 | raw の URL |
|---|---|---|
| `status.md` | いまの様子（人が読む公開ページ）。知らせのたびに書き直される | https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/status.md |
| `report-latest.md` | 直近の報告書（八項目・これまでの記録） | https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/report-latest.md |
| `notices.json` | 送った知らせの一覧（機械向け。パネルが読む） | https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/notices.json |
| `state.json` | いまの様子（機械向け） | https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/state.json |
| `ver.txt` | 本体の版番号。更新確認が最初に読む | https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/ver.txt |

## 台本

| ファイル | 中身 | raw の URL |
|---|---|---|
| `serifu.txt` | 本体から抽出した台詞 | https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/serifu.txt |
| `serifu-adv.txt` | 探偵編の台詞 | https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/serifu-adv.txt |

## 見るところ（HTML）

| ファイル | 中身 | URL |
|---|---|---|
| `panel.html` | 様子を見るパネル | https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/panel.html |
| `reader.html` | 報告書を読む頁 | https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reader.html |

## この控えの作り直し方

この `urls.md` が消えても、同じ手順で作り直せる。

1. 作業フォルダで実体を確かめる（**推測で埋めないこと**）

```
cd C:\Users\user\Desktop\mahjong\koushu-handan
git remote -v
```

出た `origin` の URL が `https://github.com/<オーナー名>/<リポジトリ名>.git` の形。
上の例では オーナー名 `kfsr148-art` ／ リポジトリ名 `koushu-handan`。

2. 追跡されているファイルのうち、状態と報告を書いているものを拾う

```
git ls-files | findstr /R "\.md$ \.json$ \.txt$"
```

3. 公開か非公開かを確かめる（非公開なら raw の URL は他人からは読めない）

```
gh repo view --json name,owner,visibility,url
```

4. 次の形に当てはめて並べる

```
https://raw.githubusercontent.com/<オーナー名>/<リポジトリ名>/main/<ファイル名>
```

## 注意

- **`status.md` と `notices.json` は機械が書き直す。**手で書き換えない。
- **公開の場に出るので、話題名（ntfy のトピック名）は絶対に書かない。**
- raw は push から数分遅れて反映されることがある。
