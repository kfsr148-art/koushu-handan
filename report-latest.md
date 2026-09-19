# 起こし直しのときの台帳の閉じ（①〜④）

**終わり（残り0件）** — 2026-09-19（VAIO）。`koushu-handan.html` には触っていない。
**①と③は既に入っていた**ので確かめだけ。**②を新しく作り**、④の作り値八通りで通した。

## ① 三つの台本 … **既に入っていた**（2026-09-12・台帳の閉じ忘れ-1）

三本とも、**窓を落とす命令の直前**で `ledger-close.ps1` を呼んでいる。

| 台本 | 呼ぶ行 | その次 |
|---|---|---|
| `rc-restart.ps1` | **L17** | L19 `Stop-Process -Id $ClaudePid, $CmdPid -Force` |
| `window-restart.ps1` | **L58** | L60 `Stop-Process -Id $ClaudePid, $CmdPid -Force` |
| `revive-claude.ps1` | **L148** | 起こし直し（`ClaudeCodeAtLogon`） |

`ledger-close.ps1` は控え（`work-note.txt`）の `件名:` に出ている**仕事名の行だけ**を閉じる
（丸括弧の中は落とし、「と・／・、」で割る）。**関わりの無い行には触らない。**

## ③ 09-12 の三回の残り行 … **全部閉じていた**（閉じ直した行は無し）

| 刻 | 行 | 状態 |
|---|---|---|
| 17:57 | 830 遠隔の付け直し-1 ／ 831 `--name=…` の枠 ／ 832 名の固定-取り下げ | **済** |
| 20:4x | 850 窓を見やすく-1 | **済** |
| 21:52 | 853・854 窓を見やすく-1 ／ 855 窓を見やすく-2 | **済** |

## ② 起き直った窓の拾い直し … **無かったので作った**

**`~/.claude/ledger-pickup.ps1`（新）。**

閉じ手が空振りする回がある——控えの件名と台帳の仕事名が食い違う、閉じ手が走った時点で
まだ行が立っていない、など。そのときは `ledger-close.log` に

```
2026-09-19 13:20:00  閉じる行は無かった（件名 起こし直しの試し）
```

と残る。**起き直った側はこの一行を読み、その件名の行がまだ未了なら理由つきで閉じる。**

```
済：窓の起こし直しで閉じ損ねたので、起き直った側が拾い直した（13:59・閉じ手は 2026-09-19 13:20:00 に当てたが見つからなかった）
```

**広げない決め** … 閉じるのは**閉じ手が当てに行った件名の行だけ**／**閉じ手の刻より後に受け取った行は触らない**
（閉じ損ねではなく新しい仕事だから）／一度拾ったら印（`ledger-pickup-seen.txt`）に刻を控え、**同じ回で二度閉じない**。

**呼ぶ所** … `watch-notify.ps1` の毎分の巡回。ふつうの回は
**`ledger-close.log` と印の刻を比べるだけ**で終わる（空振りが無ければ子を起こさない）。

## ④ 作り値（八通り・本物の台帳も本物の窓も触っていない）

一時の所に偽の台帳・偽の控え・偽の記録を置き、**本物の二つの台本を `-Root` で向けて**回した
（`ledger-close.ps1` に `-Root` を足した。既定は今までと同じ場所）。

| 場合 | 結果 |
|---|---|
| イ **閉じる前に自分の行が済になる** | ✔ `済：窓の閉じ直しの前に閉じた（13:59）` |
| ロ 関わりの無い行は触らない | ✔ `未了：受領` のまま |
| ハ 件名が当たらない回は開いたまま | ✔ `未了：受領` |
| ニ 記録に「閉じる行は無かった」が残る | ✔ `2026-09-19 13:59:10  閉じる行は無かった（件名 別の名の仕事）` |
| ホ **起き直りが理由つきで済にする** | ✔ `済：窓の起こし直しで閉じ損ねたので、起き直った側が拾い直した（…）` |
| ヘ 閉じ手より前の行は拾う | ✔ 済になった |
| ト 閉じ手より後の行は触らない | ✔ `未了：受領` のまま |
| チ 二度目は何も動かさない | ✔ 台帳は同じまま |

＊作り値を書き直した所が二つある（**台本ではなく台の側の誤り**）……
　「件名が当たらない」つもりで `（字が違う）` と括弧書きにしたが、閉じ手は**丸括弧の中を落とす**ので当たってしまった。
　もう一つは、同じ刻の記録で二度目を試し、**印が効いて何もしないのが正しい**のに不合格と数えていた。

## 触った所と触らない所

**触った所** … `ledger-pickup.ps1`（新）／`ledger-close.ps1`（`-Root` を足しただけ・写し `.bak-20260919`）／
`watch-notify.ps1`（拾い直しを呼ぶ枝・写し `.bak-20260919b`）。**三本とも構文検査 OK。**

**触らない所** … `koushu-handan.html`・`rc-restart.ps1`・`window-restart.ps1`・`revive-claude.ps1`
（**既に入っていたので一行も直していない**）・台帳の 09-12 の行（全部閉じていた）・
閉じ手の当て方（件名の割り方）・`stable`。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **284件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0919-1343-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1343-2.md) | 09-19 13:59 | 起こし直しのときの台帳の閉じ（①〜④） |
| [`y0919-1343.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1343.md) | 09-19 13:46 | 台帳の「黒猫の待機-2」を読む |
| [`y0919-1255.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-1255.md) | 09-19 12:54 | stable を v1451 へ進めた |
| [`y0919-0815-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815-2.md) | 09-19 08:54 | 【納品】見立て行と釦の助言の文面を差し替えた（v1451） |
| [`y0919-0815.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0815.md) | 09-19 08:19 | 【宣言】見立て行と釦の助言の文面を差し替える（v1451） |
| [`y0919-0800.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0800.md) | 09-19 08:00 | 条件の数の棚卸し（mitate-kazoe.txt） |
| [`y0919-0725.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0725.md) | 09-19 07:43 | 見立て行の尺の縛りを外す |
| [`y0919-0450.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0450.md) | 09-19 07:04 | 見立て行の棚卸し（mitate.txt） |
| [`y0919-0427.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0919-0427.md) | 09-19 04:32 | 再起動-2 |
| [`y0918-2212-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212-2.md) | 09-19 04:20 | 再起動-1（後の測り） |
| [`y0918-2212.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2212.md) | 09-18 22:12 | 再起動-1（前の測り） |
| [`y0918-2155.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2155.md) | 09-18 22:02 | 押しの敷居-2 |
| [`y0918-2145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2145.md) | 09-18 21:47 | 空きの片付け-2（後の測り） |
| [`y0918-2109.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2109.md) | 09-18 21:12 | 空きの片付け-2 |
| [`y0918-2055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2055.md) | 09-18 21:01 | 空きの内訳-2 |
| [`y0918-2049.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2049.md) | 09-18 20:53 | 鍵切れの見張り-1 |
| [`y0918-2035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2035.md) | 09-18 20:38 | 配信の譲り-1（乙・通し切る形へ） |
| [`y0918-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1953.md) | 09-18 20:00 | 配信の譲り-1 の下調べ |
| [`y0918-1923.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1923.md) | 09-18 19:24 | 公開の追いつき-1 |
| [`y0918-1846.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1846.md) | 09-18 19:05 | 起こしの重なり-1（乙・刻をずらす） |

<!-- 控えの一覧 ここまで -->
