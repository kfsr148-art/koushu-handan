# 黒い窓の巻き戻しを 9001行 → 500行 に

**終わり（残り0件）** — 2026-09-21 21:40（VAIO）。`koushu-handan.html`・`stable` には触っていない。

---

## 1. 変えたもの

**`HKCU\Console\麻雀 攻守判断 (Claude Code)` の `ScreenBufferSize` だけ。**

| | 値 | 生の字 |
|---|---|---|
| **前** | 幅 170 / **高さ 9001** | `0x232900AA` |
| **後** | 幅 170 / **高さ 500** | `0x01F400AA` |

＊`500 × 65536 ＋ 170 ＝ 32,768,170`（高さが上位16ビット・幅が下位16ビット）。**幅は触っていない。**

**同じ項のほかの値は、一つも触っていない。**

| | |
|---|---|
| `WindowSize` | 幅 170 / 高さ 44（そのまま） |
| `FaceName` | BIZ UDGothic（そのまま） |
| `FontSize` | 高さ 16（そのまま） |
| `FontWeight` | 400（そのまま） |

＊**窓44行 ≦ バッファ500行** なので、窓がバッファを超える形にはなっていない（超えると縮められる）。

---

## 2. 次に窓が立った回に効く — 起動の設定の写し

```
Execute : C:\Windows\System32\cmd.exe
Args    : /c start "麻雀 攻守判断 (Claude Code)" /MAX /D "C:\Users\user\Desktop\mahjong\koushu-handan"
            cmd.exe /k C:\Users\user\.claude\claude-loop.cmd
```

**題が一致するか : True**

**なぜ次の回から効くか** … `start "…"` で**題を付けて**コンソールを開くと、Windows は
**その題と同じ名の `HKCU\Console` の項**を読んで、字・窓・バッファを決める。
**読むのはコンソールを作る瞬間だけ**なので、**いま開いている窓は 9001行のまま**で、
**次に立った窓から 500行**になる。

＊立ち上げ直す道は三つとも同じ題を使うので、どれで立っても効く
　——`ClaudeCodeAtLogon`（ログオン）／`revive-claude.ps1`（`schtasks /Run` で同じ札）／
　`claude-loop.cmd`（落ちたときの立て直し。**同じ窓の中**で立て直すので、こちらは題を作り直さない）。

---

## 3. 戻し方

控えを `.reg` で丸ごと書き出してある（**540バイト**）。

```
C:\Users\user\.claude\console-koushu.bak-20260921.reg
  [HKEY_CURRENT_USER\Console\麻雀 攻守判断 (Claude Code)]
  "ScreenBufferSize"=dword:232900aa      ← 元の 9001行
  "WindowSize"=dword:002c00aa
```

```powershell
reg import "C:\Users\user\.claude\console-koushu.bak-20260921.reg"
```

＊**取り込んだあとも、効くのは次に立った窓から。**

---

## 4. 残り

**残り0件。** ＊SysMain・pagefile・healthchecks の check 作りは**人手待ち**のまま。

## 5. 実機で見るところ

- **次に窓が立ったとき**、巻き戻しが **500行で止まる**こと
  （いまの窓のまま確かめても 9001行のままで、変わって見えない）。
- 字（BIZ UDGothic 16px）と窓の大きさ（170×44）・`/MAX` の効きが**これまでどおり**であること。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **373件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0921-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2140.md) | 09-21 21:57 | 黒い窓の巻き戻しを 9001行 → 500行 に |
| [`y0921-2135.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2135.md) | 09-21 21:50 | 盤の健康・熱・画面バッファの調べ／昇格の問いは閉じられた |
| [`y0921-2128.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2128.md) | 09-21 21:28 | 足跡の合図と、手待ちの畳み／pagefile は**手が要る** |
| [`y0921-2120.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2120.md) | 09-21 21:22 | Edge の置き去りを閉じた（+210MB）／SysMain は**手が要る** |
| [`y0921-2110.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2110.md) | 09-21 21:08 | 押しの敷居を 400MB へ／機械に乗っている物の調べ |
| [`y0921-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2050.md) | 09-21 20:50 | 落ちにくい窓（三つ）／枠の上限を刻ひとつに |
| [`y0921-2012.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-2012.md) | 09-21 20:12 | 考え込み中は触らない（CPU で振り分け）／定時の札に起こし直しの数 |
| [`y0921-1957.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1957.md) | 09-21 19:57 | 使用量の上限で手待ちにする（乙で実装） |
| [`y0921-1936.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1936.md) | 09-21 19:37 | 固まりの判じ方を足跡へ／手待ちで重い窓を立て直す |
| [`y0921-1925.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1925.md) | 09-21 19:23 | 使用量の鈴の鍵を **10分の桁**へ（最も近い側へ丸める） |
| [`y0921-1915.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1915.md) | 09-21 19:13 | 綴りを退避して **171.4MB → 4.6MB**／台帳の未了 **0件** |
| [`y0921-1805b.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805b.md) | 09-21 18:35 | 未了4項目を一行ずつ／枠の上限の結果／使用量の鈴の丸め |
| [`y0921-1755.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1755.md) | 09-21 17:55 | 雲へ重い仕事を回す道 — **通った** |
| [`cloud-kumo-tameshi-20260921-085123.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/cloud-kumo-tameshi-20260921-085123.md) | 09-21 17:53 | 雲で回した：`kumo-tameshi.js` |
| [`y0921-1805.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1805.md) | 09-21 17:47 | 枠の上限 — 8分を超え、かつ空きが400MBを割ったら仕事を切る |
| [`y0921-1700.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1700.md) | 09-21 17:02 | 立てる数を減らす — **毎分 22.7本 → 10.6本**／`--continue` を外した |
| [`y0921-1635.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1635.md) | 09-21 16:38 | 網の切れの一覧と、窓隠しの検収 |
| [`y0921-1625.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1625.md) | 09-21 16:26 | 包みの待ちの確かめ・再起動の内側の上限・押しの詰まりの元 |
| [`y0921-1600.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1600.md) | 09-21 15:53 | 二件の取り下げと、走りかけの子 125本の片付け |
| [`y0921-1335.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0921-1335.md) | 09-21 13:31 | 09-20 22:00 からの乱れ一枚と、網／ディスクの突き合わせ |

<!-- 控えの一覧 ここまで -->
