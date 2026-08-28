# 配牌 攻守判定

麻雀の配牌13枚を入れると、その手で**攻めるか守るか**を判定する。
判定の根拠（打点の種・埋まり・伸びしろ・見える手）と、七人の人柄＋三つの物差しの言い分が並ぶ。

おまけとして、探偵アドベンチャー「ミシシッピー現場猫事件」と、ミニゲーム「一索の鳥」が同梱されている。

## 公開URL

<https://kfsr148-art.github.io/koushu-handan/>

リポジトリ直下の `index.html` が入口で、本体 `koushu-handan.html` へ送る（履歴に入口を残さない置換で送る）。
本体を直に開いてもよい。

<https://kfsr148-art.github.io/koushu-handan/koushu-handan.html>

## 版の見方

版番号は**3箇所**にあり、**常に同じ値**でなければならない。

| 置き場所 | 書き方 | 役目 |
|---|---|---|
| `koushu-handan.html` 冒頭 | `<html lang="ja" data-ver="1339">` | 本体が自分の版を名乗る |
| `koushu-handan.html` の `verTag` | `<div id="verTag">v1339</div>` | 画面の左上に出る表示 |
| `ver.txt` | `1339` | **更新確認が最初に読みに行くファイル** |

起動時に `data-ver` を読んで `verTag` に映し、そのあと `ver.txt` を取りに行って照合する。
本体は8MB近くあるので、版を知るためだけに毎回それを取得しない造りになっている。

**`ver.txt` が古いままだと、新版を置いても利用者に配信されない。** 3箇所は必ず同時に更新する。

いま公開されている版は、こう確かめられる。

```
curl https://kfsr148-art.github.io/koushu-handan/ver.txt
```

## 構成

| ファイル | 中身 |
|---|---|
| `koushu-handan.html` | **本体**。HTML・CSS・JavaScript・画像・音声が1ファイルに同梱されている（約8MB） |
| `index.html` | 入口。本体へ送るだけ |
| `ver.txt` | 版番号1行。更新確認が読む |
| `reader.html` | スクショ受付。写真から配牌を読み取る入口 |
| `templates.json` | 読み取りのテンプレート置き場（既定は空） |
| `serifu.txt` | 本体から抜き出した台詞の台本。台詞に触れた回は、ここも再抽出する |
| `*.wav.wav` | 音声20本（数字読み上げ・効果音） |
| `CLAUDE.md` | この家の作法。作業の前に読む |

### 検査

| ファイル | 中身 |
|---|---|
| `check-all.js` | **納品前の入口**。下の2本を続けて回す。`node check-all` |
| `check.js` | 本体の検査（版番号・404・構文・音声・死にコード・画面の溢れ・「ヨシ」の混入・ミニゲームの定数ほか） |
| `adv-check.js` | 探偵編の回帰。即死罠と時間切れの2経路を headless ブラウザで実際に通す |

どれも引数に本体のパスを取れる。旧版に当てて、検査そのものの効きを確かめられる。

```
node check-all              # 現行を検査する
node check-all ../old.html  # 旧版に当てる（検査が本当に落ちるかを見る）
```

検査はブラウザを使うものを含む（headless の Edge か Chrome）。
見つからない環境では、その検査だけ飛ばして先へ進む。

## 実戦較正の記録（core-battle-log.tsv）

`core-battle.js` が書き出す、配牌の判定とその局の結末を対にした記録。

**母集団は「機械打ち同士」** — `@kobalab/majiang-ai` の思考を四人とも同じにして、
一局戦を1000局打ち切らせたもの（2026-08-28・較正-1）。**人の打ち筋ではない。**

```
node core-battle.js 1000    # 1000局を回して core-battle-log.tsv へ書き出す
```

局を打ち切らせるのは `@kobalab/majiang-core`、打牌の思考は `@kobalab/majiang-ai`
（どちらも MIT・版は `package.json` に固定）。配牌の判定は `core-probe.js` 越しに
本体の `analyze()` を呼ぶので、**`koushu-handan.html` には触れない**。
