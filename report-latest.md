# 空きの片付け-2（後の測り）

**終わり（残り0件）** — 2026-09-18（VAIO）。**二本とも止まり、次の起動でも上がらない形になった。**
ただし**その場の空きは増えていない**——同じ間に画面まわりが立ち上がったため。中身は下に。

## 二本の様子（実測）

```
WSearch    起き方=Disabled  状態=Stopped
VCService  起き方=Disabled  状態=Stopped
  VCAgent        0本
  SearchIndexer  0本
```

**`Disabled`** なので**次の起動でも上がらない**。止めたのは管理者の窓（`stop-two-services.cmd` を
`-Verb RunAs` で呼び出し、UAC の「はい」で走った）。この窓からは四行とも `Access is denied（5）`で入れなかった。

## 空き物理メモリ

| 刻 | 空き | そのとき |
|---|---|---|
| 21:09:30 | **1097MB** | 止める前。VCAgent 113MB・SearchIndexer 69MB が居た |
| 21:19:19 | 929MB | 四行が入らず、まだ二本とも動いていた |
| 21:45:00 | 799MB | **二本が止まった直後** |
| 21:45:22 | 801MB | VCAgent 0本・SearchIndexer 0本を確かめた |
| 21:46〜21:47（5秒ごと13回） | **800〜918MB・中央908MB** | 落ち着き待ち |

**二本が使っていた約190MBは確かに戻った**（0本になった）。
**それでも空きの数字は上がっていない。** 訳は同じ間に別の物が増えたため。

| | 止める前（17:47 の測り） | いま |
|---|---|---|
| explorer | 96MB | **156MB**（+60） |
| StartMenuExperienceHost | （居ない） | **85MB**（+85） |
| Memory Compression | 85MB | **109MB**（+24） |
| claude | 483MB | 457〜467MB |
| MsMpEng | 332MB | 315〜328MB |

**+169MB ぶんが画面まわりで立った。** UAC の窓とスタートメニューを触ったことで立ち上がった物で、
しばらく使わなければ縮む見込み。**二本を止めた効きと相殺されて見えているだけ**で、
止めた効き自体は消えていない。

## 本当の効きは、次の「底」で測る

今日いちばん低かったのは **08:23 の 358MB**（押しを見送った刻）。
**二本が居なくなったぶん、この底が約190MB上がるはず**——それが本当の効き。
次に押しと検査が重なる時間帯の空きを見れば分かる。

## 戻し方（控えは残してある）

```
~/.claude/restore-two-services.cmd を右クリック →「管理者として実行」
   sc.exe config WSearch start= auto    / sc.exe start WSearch
   sc.exe config VCService start= demand / sc.exe start VCService
```

元の設定の控えは `~/.claude/service-before-20260918.txt`（`WSearch`=Auto／`VCService`=Manual）。

＊止まったことで落ちる働き … **探し物の索引**（エクスプローラの検索が遅くなる）と
　**VAIO Care**（機械の診断・更新の道具）。

## 触った所と触らない所

**触った所** … `WSearch` と `VCService` を止め、`Disabled` にした（管理者の窓で）。

**触らない所** … 本体・`~/.claude` の台本・`claude` の窓・Defender と除外の決め・予定表の起こし・
ほかのサービス（`VCFw` は元から Stopped のまま）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **272件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`y0918-2145.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2145.md) | 09-18 21:47 | 空きの片付け-2（後の測り） |
| [`y0918-2109.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2109.md) | 09-18 21:12 | 空きの片付け-2 |
| [`y0918-2055.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2055.md) | 09-18 21:01 | 空きの内訳-2 |
| [`y0918-2049.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2049.md) | 09-18 20:53 | 鍵切れの見張り-1 |
| [`y0918-2035.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-2035.md) | 09-18 20:38 | 配信の譲り-1（乙・通し切る形へ） |
| [`y0918-1953.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1953.md) | 09-18 20:00 | 配信の譲り-1 の下調べ |
| [`y0918-1923.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1923.md) | 09-18 19:24 | 公開の追いつき-1 |
| [`y0918-1846.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1846.md) | 09-18 19:05 | 起こしの重なり-1（乙・刻をずらす） |
| [`y0918-1831.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1831.md) | 09-18 18:35 | 起こしの重なり-1 の下調べ |
| [`y0918-1757.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1757.md) | 09-18 17:59 | 空きの片付け-1 |
| [`y0918-1747.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1747.md) | 09-18 17:50 | 空きの内訳-1 |
| [`y0918-1305.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1305.md) | 09-18 13:06 | 軽い巡回の刻-1 |
| [`y0918-1221.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-1221.md) | 09-18 12:24 | 止まりの読み-4 |
| [`y0918-0716.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0716.md) | 09-18 07:19 | 夜の較正-2 |
| [`y0918-0352.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0918-0352.md) | 09-18 03:56 | 止まりの札の敷居-1 |
| [`y0917-2140.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2140.md) | 09-17 21:35 | 呼び名の揃え-1 の下調べ |
| [`y0917-2122.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2122.md) | 09-17 21:25 | 問いかけの判じ-1 |
| [`y0917-2102.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2102.md) | 09-17 21:14 | 訴えの棚卸し-1 |
| [`y0917-2050.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2050.md) | 09-17 20:52 | 古い字の掃除-2 |
| [`y0917-2009.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-2009.md) | 09-17 20:14 | 古い字の掃除-1 |

<!-- 控えの一覧 ここまで -->
