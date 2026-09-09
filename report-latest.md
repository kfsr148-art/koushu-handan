# 猫を全部白へ-1 — 頭の猫が地に沈む件（全状態）

**六枚とも白へ焼き直し、比が 1.3 → 16.17 になった。**元の六枚は消していない。
判定の枝（`isRunning` の物差し・順番）には触っていない。

## ① 白版六枚を焼いた

道具を新しく置いた … **`cat-frames-white.js`**。
元の六枚から**色だけ白へ**塗り替える（透明の度合いはそのまま、形も余白も一画素も変えない）。

```
焼いた : cat0-w.png      56x36  1,361バイト
焼いた : cat1-w.png      56x36  1,289バイト
焼いた : cat2-w.png      56x36  1,291バイト
焼いた : cat3-w.png      56x36  1,173バイト
焼いた : cat4-w.png      56x36  1,271バイト
焼いた : cat-sleep-w.png 56x36  1,589バイト
```

**元の六枚（`cat0.png`〜`cat4.png`・`cat-sleep.png`）は残してある。**
ウィジェットの猫（`*-white.png`）にも触っていない。

### コントラスト比

地は `--bg #14241c`（RGB 20,36,28）、WCAG式。**墨（a=255）の比**で見る。

| | 墨の比 | a≥128 の画素のうち比3.0以上 |
|---|---|---|
| `cat0.png`（**焼く前**） | **1.3** | **0/624（0%）** |
| `cat0-w.png` | **16.17** | 624/624（100%） |
| `cat1-w.png` | **16.17** | 623/623（100%） |
| `cat2-w.png` | **16.17** | 566/566（100%） |
| `cat3-w.png` | **16.17** | 564/564（100%） |
| `cat4-w.png` | **16.17** | 547/547（100%） |
| `cat-sleep-w.png` | **16.17** | 820/820（100%） |
| `panel-icon-white.png` | 16.17 | 8642/8642（100%） |

**3.0 を下回るものは無い。**焼き方を直す必要は出なかった。

＊縁の薄い画素（`a=1`）だけを取ると比は 1.01 になるが、それは**地とほぼ同じ色に重なる画素**で、
　読み手が見る濃さではない。**墨（a=255）の比**で判じた。

## ② runCatTick を白版へ揃えた

| 枝 | 差し替え先 |
|---|---|
| 作業中のコマ送り | `cat0-w.png` 〜 `cat4-w.png` |
| ヨシ待ち | `panel-icon-white.png`（**9月8日に焼いた分。焼き直していない**） |
| 次の指示待ち・連絡なし | `cat-sleep-w.png`（三箇所とも） |
| 先読みの一覧 | `catFrames.concat(['cat-sleep-w.png', 'panel-icon-white.png'])` |

**判定の枝そのものは変えていない**——`isRunning()` の物差しも、
**ヨシ待ち → 連絡なし → 作業中**の順もそのまま。

＊**最初に描く一枚**（`<img id="runcat" src=…>`）も `cat-sleep-w.png` にした。
　ここが黒のままだと、頁を開いた最初の一描画だけ沈んで見えるため。

## ③ 版と panel-check

| 場所 | 値 |
|---|---|
| `PANEL_VER` | `'126'` |
| `verTag` の字 | `panel v126（9月9日）` |
| `panel-ver.txt` | `126` |

**panel-check … 全てPASS（✓52 ／ ✗0）。**

⑰は猫の字面を見る作りなので、白版に合わせて直した。

| 前 | 後 |
|---|---|
| `['黒猫の絵', 'panel-icon-black.png', …]` | `['ヨシ待ちの絵', 'panel-icon-white.png', …]` |
| （無し） | `['コマ送りは白版', "'cat0-w.png'", …]` ← **足した** |
| `['指示待ちで寝姿', "el.src = 'cat-sleep.png'", …]` | `['指示待ちで寝姿', "el.src = 'cat-sleep-w.png'", …]` |

## ④ 検収

### 作り値（偽の送り手。本物の ntfy・push・commit は叩いていない）

| 場合 | 猫の絵 |
|---|---|
| **(a) 作業中** | **`cat1-w.png`**（コマ送り） |
| **(b) 次の指示待ち** | **`cat-sleep-w.png`** |
| **(c) ヨシ待ち** | **`panel-icon-white.png`** |
| （上限超・連絡なし） | `cat-sleep-w.png` |

写しの中で拾った画面の誤り … **無し**。

### 公開側の実読み

```
HTTP 200 / 122,569バイト
catFrames    : var catFrames = ['cat0-w.png','cat1-w.png','cat2-w.png','cat3-w.png','cat4-w.png']
先読みの一覧 : catFrames.concat(['cat-sleep-w.png', 'panel-icon-white.png']
ヨシ待ちの枝 : white
cat-sleep-w の出現 : 6（最初の img ＋枝）
古い cat-sleep.png の残り : 0
PANEL_VER 126 ／ verTag v126 ／ panel-ver.txt 126

公開側 cat0-w.png      : HTTP 200 / 1,361バイト
公開側 cat-sleep-w.png : HTTP 200 / 1,589バイト
```

**版は三箇所とも 126 で一致。素材も公開側に届いている。**

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **182件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`猫を全部白へ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%82%92%E5%85%A8%E9%83%A8%E7%99%BD%E3%81%B8-1.md) | 09-09 11:06 | 猫を全部白へ-1 — 頭の猫が地に沈む件（全状態） |
| [`黒猫の待機-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-3.md) | 09-09 09:54 | 黒猫の待機-3 — ヨシ待ちの猫を白から黒へ戻す |
| [`土台の直し-1の宣言.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%9C%9F%E5%8F%B0%E3%81%AE%E7%9B%B4%E3%81%97-1%E3%81%AE%E5%AE%A3%E8%A8%80.md) | 09-09 05:55 | 土台の直し-1 — 宣言（ヨシ待ち） |
| [`serifuの再抽出.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/serifu%E3%81%AE%E5%86%8D%E6%8A%BD%E5%87%BA.md) | 09-09 04:50 | serifu.txt / serifu-adv.txt の再抽出（作法17） |
| [`兎の台詞-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%85%8E%E3%81%AE%E5%8F%B0%E8%A9%9E-1.md) | 09-09 03:27 | 兎の台詞-1（出し直し）— serifu.txt の中の兎 |
| [`写しの重さ-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%87%8D%E3%81%95-1.md) | 09-08 22:26 | 写しの重さ-1 — note-at-stop.txt は帳面として太るか |
| [`取り残しの検収-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97%E3%81%AE%E6%A4%9C%E5%8F%8E-1.md) | 09-08 22:03 | 取り残しの検収-1 |
| [`前の仕事の取り残し.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%89%8D%E3%81%AE%E4%BB%95%E4%BA%8B%E3%81%AE%E5%8F%96%E3%82%8A%E6%AE%8B%E3%81%97.md) | 09-08 21:15 | 前の仕事の取り残し — 次の指示が先に来た回の落ち |
| [`終わりの札-2の検収.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2%E3%81%AE%E6%A4%9C%E5%8F%8E.md) | 09-08 20:28 | 終わりの札-2 の検収と、窓の幅の裁定材料 |
| [`終わりの札-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-2.md) | 09-08 20:03 | 終わりの札-2 — 終わりの札が立たない根を直す |
| [`止まりの見分け-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%AD%A2%E3%81%BE%E3%82%8A%E3%81%AE%E8%A6%8B%E5%88%86%E3%81%91-1.md) | 09-08 19:03 | 止まりの見分け-1 — 生存が書かれないのに「作業中」が延び続ける件 |
| [`猫の矛盾-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E7%9F%9B%E7%9B%BE-1.md) | 09-08 11:18 | 猫の矛盾-1 — 走っているのに頭の猫が寝ている件 |
| [`終わりの札-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%B5%82%E3%82%8F%E3%82%8A%E3%81%AE%E6%9C%AD-1.md) | 09-08 09:40 | 終わりの札-1 — 終わった知らせが手元に残らない件 |
| [`検査の重さ-1の調べ-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9-3.md) | 09-08 07:57 | 検査の重さ-1 の調べ — 四つの数と、削れそうな所 |
| [`検査の重さ-1の調べ-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9-2.md) | 09-08 07:12 | 検査の重さ-1 の調べ（出し直し）— 21視野のフル版 一回の内訳 |
| [`黒猫の待機-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%BB%92%E7%8C%AB%E3%81%AE%E5%BE%85%E6%A9%9F-2.md) | 09-08 06:25 | 黒猫の待機-2 — ヨシ待ちの猫が地に沈む件 |
| [`検査の重さ-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E9%87%8D%E3%81%95-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-08 00:50 | 検査の重さ-1 の調べ — 21視野の一回に、何がどれだけ掛かっているか |
| [`配牌の目安-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%85%8D%E7%89%8C%E3%81%AE%E7%9B%AE%E5%AE%89-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:18 | 配牌の目安-1 の調べ — 13枚から何を持っているか |
| [`押し引き表-1の調べ.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%8A%BC%E3%81%97%E5%BC%95%E3%81%8D%E8%A1%A8-1%E3%81%AE%E8%AA%BF%E3%81%B9.md) | 09-06 19:15 | 押し引き表-1 の調べ — 判定盤が持っている物・持っていない物 |
| [`最後に受けた枠の撤去-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%9C%80%E5%BE%8C%E3%81%AB%E5%8F%97%E3%81%91%E3%81%9F%E6%9E%A0%E3%81%AE%E6%92%A4%E5%8E%BB-1.md) | 09-06 14:48 | 最後に受けた枠の撤去-1 — パネルからその一行を外した |

<!-- 控えの一覧 ここまで -->
