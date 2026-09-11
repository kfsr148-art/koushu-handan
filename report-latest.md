# 0x4A の切り分け-1 — 無線LANを外して有線へ、Event 41 で数える（印 y0912-0200）

状態：ヨシ待ち（残り1件）　2026-09-12 02:00

## 結論
- **いまは Wi-Fi でしか繋がっていない**（有線は線なし・USB の無線も無い）。ここで無線を切ると網から外れ、遠隔も知らせも止まって戻せない。
- そこで**有線が網へ出られたのを見てから無線の電波を切る**仕掛けを置いた。**VAIO の有線LAN の口へ線を挿せば、あとは自動で切り替わって数えが始まる。**

## 待っていること
- VAIO の有線LAN の口（イーサネット・Realtek PCIe GbE）へ線を挿し、ルーターへ繋ぐ。返事は要らない（挿したら「挿した」でもよい）

## いまの網（一項目一行）
- Wi-Fi：Qualcomm Atheros AR9485WB-EG … Up（auhikari-2e7f4e・Internet・既定の道）
- イーサネット：Realtek PCIe GbE Family Controller … Disconnected（線なし）
- Bluetooth PAN … Disconnected
- USB の無線 … 無し

## 置いたもの
- `~/.claude/wifi-swap.ps1`（新・76行・BOM有・構文誤り0）と予定の仕事 **ClaudeWifiSwap**（毎分）
- 有線が Up かつ Internet に出られるときだけ、無線の電波を切る（Windows.Devices.Radios。管理者は要らない＝RequestAccessAsync が Allowed）
- 有線が落ちたら無線を戻す（遠隔を失わない側へ倒す）
- 最初に切った刻を `wifi-swap-start.txt` へ一度だけ。以後の Event 41 の 0x4A を `wifi-swap.log` へ一行ずつ（そのときの無線・有線の状態つき）
- 試し：いまの状態で一度回して、何も切らずに抜けた（exit 0・Wi-Fi は Up のまま・起点のファイルは作られない）

## 物差し
- これまで 0x4A は 08-16〜09-10 の約25日で11回（一日0.44回）
- 切ってから **7日0回なら偶然の見込み約5%、14日0回なら約0.2%**。そこまで出なければ「止まった」と言える

## 断り
- 電波を切っても athw10x.sys は読み込まれたまま（器ごと外すのは管理者が要る）。止まれば疑いは強まるが、止まらなくても無実とまでは言えない

## 残り
1. 0x4A の切り分け-1 — 有線の線を挿す待ち（y0912-0200）

---

<!-- 送った知らせ ここから -->

## 送った知らせ

直近に ntfy へ送ったものを、新しい順に五件まで。**要約せず、送った本文をそのまま写しています。**

### 1. ✅ 終わりました（返事不要）

```
写せます（2件）
```

### 2. 🙋 0x4A の切り分け-1 有線の線を挿してください（y0912-0200）

```
0x4A の切り分け-1（印 y0912-0200）— 有線の線を挿す待ち
いま繋がっているのは Wi-Fi だけ。有線（Realtek）は線なし、USB の無線も無い
いま無線を切ると網から外れて遠隔・知らせが止まり、戻せない
そこで有線が網へ出られたら無線の電波を自分で切る仕掛けを置いた（ClaudeWifiSwap・毎分・管理者不要）
VAIO の有線LAN の口へ線を挿してルーターへ繋いでください。あとは自動で切り替わり、以後の 0x4A を数えます
物差し：これまで一日0.44回。7日0回で偶然の見込み約5%、14日0回で約0.2%
断り：電波を切っても athw10x.sys は読み込まれたまま
```

### 3. 🙋 ヨシしてください

```
0x4A の切り分け-1 — 無線LANを外して有線へ、Event 41 で数える
印: y0912-0200
待っているのは：VAIO の有線LAN の口（イーサネット・Realtek）へ線を挿してルーターへ繋ぐ。挿せば毎分の見張りが網へ出られるのを見て無線の電波を自分で切り、数えが始まる（返事は不要。挿したら「挿した」でもよい）
答え方：「y0912-0200 にヨシ」で進めます。裸の「ヨシ」は、いちばん新しい待ちへのヨシとして通ります。
```

### 4. ✅ 終わりました（返事不要）

```
写せます（3件）
```

### 5. ✅ 終わりました（返事不要）

```
0x4A の三（四度目）— 管理者の窓を開かずに済む形へ
yoshi-open.tsv から y0911-0627・0701・0956 を落とした（管理者の窓を待つ件。写し .bak-20260911-2120）
ファイル: orders-open.tsv／yoshi-open.tsv／reports/0x4A の三（四度目）.md
未検収: v1438 の実機（右下の版の字が v1438・判定の中身は不変）
```

<!-- 送った知らせ ここまで -->

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **205件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0912-0200.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0912-0200.md) | 09-12 01:54 | 0x4A の切り分け-1 — 無線LANを外して有線へ、Event 41 で数える（印 y0912-0200） |
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

<!-- 控えの一覧 ここまで -->
