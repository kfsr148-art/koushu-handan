# 空きの片付け-2

**終わり（残り0件）** — 2026-09-18（VAIO）。**二本とも止められなかった。管理者の窓が要る。**
元の設定の控えは残した。`claude`・Defender・予定表の起こしには触っていない。

## 止める前と、いま

| | 刻 | 空き | VCAgent | SearchIndexer |
|---|---|---|---|---|
| 止める前 | 21:09:30 | **1097MB** | 113MB | 69MB |
| いま（止められなかった） | 21:11:50 | **1090MB** | 121MB | 69MB |

**差は -7MB。** 止めていないので、いつもの揺れの幅。

## 止められなかった訳（実測の言い分）

```
VCAgent … ★落とせない … Cannot stop process "VCAgent (6236)" because of the following error: Access is denied
WSearch … ★止められない … Service 'Windows Search (WSearch)' cannot be stopped due to the following error:
                          Cannot open WSearch service on computer '.'
```

**いまの窓は管理者ではない**（`VAIO\user` ／ 管理者か … **False**）。

- **SearchIndexer** の正体は **`WSearch`（Windows Search）**。`StartMode=Auto`・`Running`・走る人は `LocalSystem`
- **VCAgent** はサービスそのものではなく、**`VCService`（VAIO Care）の子**。親は `VCService.exe`（pid 5632・09-10 18:45:59 起動）で、
  こちらも `LocalSystem`。だから**同じ人でない窓からは落とせない**

## 戻せる形（控えを残した）

`~/.claude/service-before-20260918.txt`

```
WSearch    表示名=Windows Search
   起き方(StartMode)=Auto  状態=Running  走る人=LocalSystem
   戻す形 … sc.exe config WSearch start= auto   /   sc.exe start WSearch

VCService  表示名=VCService
   起き方(StartMode)=Manual  状態=Running  走る人=LocalSystem
   戻す形 … sc.exe config VCService start= demand   /   sc.exe start VCService

VCFw       表示名=VAIO Content Folder Watcher
   起き方(StartMode)=Manual  状態=Stopped（もともと止まっている）
```

## 人手でやる形（黒い窓を**管理者として**開いて打つ）

```
sc.exe stop WSearch
sc.exe config WSearch start= disabled

sc.exe stop VCService
sc.exe config VCService start= disabled
```

＊`VCAgent` は `VCService` が起こす子なので、**親の `VCService` を止めれば一緒に落ちる**。
＊戻すときは上の控えのとおり（`WSearch` は `auto`、`VCService` は `demand`）。
＊止めると落ちる働き … `WSearch` は**探し物の索引**（エクスプローラの検索が遅くなる）、
　`VCService` は **VAIO Care**（機械の診断・更新の道具）。
＊戻りの当ては **約160MB**（VCAgent 121MB＋SearchIndexer 69MB＝190MB の、Edge の実測と同じ95%ぶん）。

## 触っていないことの確かめ

| | いま |
|---|---|
| `claude` | **1本・455MB**（pid 4796 のまま） |
| `MsMpEng`（Defender） | **1本・329MB**（除外も触っていない） |
| 予定表の `Claude*` | **10件**（Ready 8・その瞬間走っていた 2） |

## 触った所と触らない所

**触った所** … 無し（**止められなかった**）。残したのは控えの綴り一枚だけ。

**触らない所** … 本体・`~/.claude` の台本・`claude` の窓・Defender と除外の決め・予定表の起こし・
`WSearch` と `VCService` の設定（**一つも変えていない**）。

**未検収** … WSearch と VCService を止めて `disabled` にすること（**人手待ち**。管理者の窓で上の四行）。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **271件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
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
| [`y0917-1944.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/y0917-1944.md) | 09-17 19:55 | 押しの詰まり-1 |

<!-- 控えの一覧 ここまで -->
