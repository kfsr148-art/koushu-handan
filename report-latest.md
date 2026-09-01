# 知らせの詰まり-1 — 「外待ち」の消し忘れで198分止まっていた。網を足した

**状態：終わり（残り0件）／VAIO 2026-09-01 11:3x ／ 本体（`koushu-handan.html`）には触っていない**

**結論** — **私が控えの `外待ち:` を消し忘れた**のが原因。08:03:46 に stop は叩かれていたが、
外待ちが立っていたので見張りは「まだ外の処理を待っている」と判じ、**08:04〜11:23 の198分ぶん
`run:`（作業中）を続けた**。終わりの札も押し送りも積まれず、公開にも出ていない。
**同じ型を拾う網は無かった**ので足した——外待ちのまま控えが40分書き換わらなければ、
**🪟 異常（手が要ります）を一発**鳴らす。作り値四通りで確かめた。

---

## ① 何が起きていたか（刻つき）

| 刻 | 何が起きたか |
|---|---|
| 08:01:22 | 殻と本体を push（commit `955bfcf`） |
| 08:02:14 | 公開側の実読みで両方そろったことを確認（ここで**仕事は終わっていた**） |
| **08:03:46** | **stop のフックは叩かれている**（`hook.log`：`stop 押し通知=なし タイトル=OK`／`stop-guard 控えあり（この回に書いた・待ちの行あり）。通す`） |
| **08:04:08** | 見張り：`外の処理を待つ回（外待ち: 公開側に殻と本体が出るのを待っている）なので、stop でも終わりにせず作業中を続ける`／`鍵 run: → run:` |
| 08:04:48 | notification（プロンプトへ戻った） |
| 08:05:07 | 見張り：同じく `外待ち…作業中のまま続ける`／`鍵 run: → run:2026-09-01 08:04:51` |
| 08:15〜11:22 | 毎分 `外待ち…古くなっても手待ちへ落とさない` の一行だけ（**約198分**） |
| **11:23:14** | 私が控えを書き換えて外待ちを外した stop |
| 11:23:28 | `急ぎの知らせに積んだ [🔎 調べました]`／`鍵 run: → done:` |
| 11:23:56 | 押し送り（この回のうちに出す） |
| 11:24:42 | `公開側にまだ出ない（30秒）。次の回へ預ける`／`控えへ入れた [🔎 調べました]` |

**三点の答え**

- **stop のフックは叩かれた**（08:03:46）。フックの側は正常。
- **押し送りは一度も積まれていない**。位相が `run:` のままで、`done:` にならなかったため
  （押し送りへ回るのは `wait:` と `done:` だけ）。
- **公開へも出ていない**。積まれていないので出しようがない。

**なぜ `run:` のままだったか** … 8月31日の「状態の穴-1」で入れた枝がそのまま効いていた。
控えに `外待ち:` があれば、stop が鳴っても終わりにせず、古くなっても手待ちへ落とさない。
**外の処理が済んだら私が外待ちの行を消す**という前提で、その**消し忘れを拾う網が無かった**。

＊`🕒 終了予定を過ぎています` も鳴らなかった。あのときの控えに **`見込み:` の行が無かった**ため、
比べる相手が無く、超過の知らせは出ない作りだった（作法25 のとおり）。

## ② 網が無かったので足した（`watch-notify.ps1`）

```powershell
$OUTWAIT_MAX = 40   # 外待ちが立ったまま控えがこの分数を超えて書き換わらなければ異常

$outStuck = $false; $outAge = 0
if ($note.outwait -and -not $note.stale -and $key -like 'run:*') {
  $outAge = [int](((Get-Date) - (Get-Item $NotePath).LastWriteTime).TotalMinutes)
  if ($outAge -gt $OUTWAIT_MAX) { $outStuck = $true }
}
… elseif ($outStuck) { $badKind = 'outwait' }
```

- **物差しは控えの書き換え時刻**。外の処理を本当に待っているなら、控えは見込みを延ばすなどで
  触れられている。**40分放置は「消し忘れて止まっている」**と判じる。
- 題は **`🪟 異常です（手が要ります）`**（ひとりでには戻らないため A ではなく B）。本文に
  件名・何分放置か・「働き手へ一声かけてください」・「この間は作業中のまま止まり、終わりの札も
  押し送りも出ません」を入れる。
- **一発だけ**（印 `outwait`）。控えを書き換えれば印が落ち、また起きればまた一発。
- 送る側の関門も直した——`run:` は普段送らないが、**外待ちの消し忘れ（`bad`）だけは例外**。
  `run:` のまま止まっているのが異常そのものなので、ここで送らないと誰も気づけない。

## ③ 実測（判定の枝 L1663〜L1703 を字面のまま抜き出して作り値で回した）

| 通り | 控えの古さ | 結果 |
|---|---|---|
| (甲) 外待ち・控えが新しい | 5分 | **鳴らない**（作業中のまま。ふつうの外待ちは邪魔しない） |
| **(乙) 外待ち・控えが198分前**（今回の型） | 198分 | **鳴る**：`🪟 異常です（手が要ります）`／名乗り `bad`／記録『異常の押し送りを一発出す（outwait）』 |
| (丙) 続けてもう一度 | 198分 | **鳴らない**：『押し送りはしない（outwait は既に一発送った。戻るまで出さない）』 |
| (丁) 控えを直して外待ちを外した | 0分 | 印が落ちる：『異変から戻ったので、異常の押し送りの印を落とした（前は outwait）』。終わりの札が出る側へ戻る |

写し `.bak-20260901a`／構文OK **2352行**／BOM 有り／`watch-notify.ps1` は毎分呼び直しなので起こし直し不要。

## こちら側の詰め

**外の処理が済んだ回は、控えの `外待ち:` を必ず消す。** 消し忘れても40分で鳴るようになったが、
鳴らせないのが本来。今回は「公開の実読みまで済んだのに控えを書き換えなかった」ことが直接の原因で、
作法25 の「件名は作業の切り替え時点で書き換える」と同じ抜けだった。

---

<!-- 控えの一覧 ここから -->

## 控えの一覧（reports/・新しい順に20件）

＊report-latest.md は毎回上書きするので、**印ごとの控えを `reports/` に残してある**。
　ここに出るのは新しい20件。全部で **95件**ある。
　raw で読める（下の名を押すとその控えへ飛ぶ）。

| 控え | 書いた刻 | 題 |
|---|---|---|
| [`知らせの詰まり-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%AE%E8%A9%B0%E3%81%BE%E3%82%8A-1.md) | 09-01 11:29 | 知らせの詰まり-1 — 「外待ち」の消し忘れで198分止まっていた。網を足した |
| [`ウィジェットの自動更新-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0-1.md) | 09-01 08:02 | ウィジェットの自動更新-1 — 殻を新設して、Scriptable への貼り替えを不要にした |
| [`検査の取りこぼし-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E5%8F%96%E3%82%8A%E3%81%93%E3%81%BC%E3%81%97-1.md) | 09-01 06:02 | 検査の取りこぼし-1 — 打ち切りは「落ちた」ではなく「測れなかった」として扱う |
| [`手牌の境目-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-3.md) | 09-01 03:47 | 手牌の境目-3 — `--vz-show` の745は据え置きで確定（掘り返さないための裁定の控え） |
| [`手牌の境目-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-2.md) | 09-01 03:07 | 手牌の境目-2 — 案Aを実装（v1434）。手元も Actions も 189/189 全通過 |
| [`手牌の境目-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%89%8B%E7%89%8C%E3%81%AE%E5%A2%83%E7%9B%AE-1.md) | 09-01 03:07 | 手牌の境目-1 — 746x375 の手牌が12px切れる件。境目は実測で 758px |
| [`状態の穴-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8A%B6%E6%85%8B%E3%81%AE%E7%A9%B4-1.md) | 08-31 22:45 | 状態の穴-1 — 走っている最中に「次の指示待ち」へ落ちる件（外待ちで作業中を保つ） |
| [`検査の網-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E6%A4%9C%E6%9F%BB%E3%81%AE%E7%B6%B2-1.md) | 08-31 22:44 | 検査の網-1 — ⑦の視野を網の隙間まで広げた。境目 746x375 で手牌が12px切れている |
| [`自動検査-5.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-5.md) | 08-31 21:36 | 自動検査-5 — 丙を実装（v1432）。手元も Actions も完全版で全通過 |
| [`自動検査-4.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-4.md) | 08-31 20:53 | 自動検査-4 — 667x375 の溢れは v1431 で入った（.next-hand-row・21.3px） |
| [`待ちの決め-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%BE%85%E3%81%A1%E3%81%AE%E6%B1%BA%E3%82%81-2.md) | 08-31 12:15 | 待ちの決め-2 — 🙋 の関門に「待ちなしの回は立てない」を実装／⑦の材料 |
| [`自動検査-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-2.md) | 08-31 12:08 | 自動検査-2 — 完全版は環境差で⑦が落ちた。緩めずに報告して速い版へ戻した |
| [`写しの食い違い-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E5%86%99%E3%81%97%E3%81%AE%E9%A3%9F%E3%81%84%E9%81%95%E3%81%84-1.md) | 08-31 11:50 | 写しの食い違い-1 — 束ねる側を数える側に合わせた（panel v104） |
| [`自動検査-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E8%87%AA%E5%8B%95%E6%A4%9C%E6%9F%BB-1.md) | 08-31 09:54 | 自動検査-1 — GitHub Actions で check.js と adv-check.js を push ごとに回す |
| [`使用量の配分-2-3.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-3.md) | 08-30 20:42 | 使用量の配分-2 の訂正 — ボーダーの式を切り上げへ |
| [`通知の走り出し-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%9A%E7%9F%A5%E3%81%AE%E8%B5%B0%E3%82%8A%E5%87%BA%E3%81%97-1.md) | 08-30 20:30 | 通知の走り出し-1 — 仕事が始まったら「😸 終了予定はHH時MM分ですにゃ」を一発 |
| [`使用量の配分-2-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2-2.md) | 08-30 19:52 | 使用量の配分-2 の続き — usage-widget.js へボーダーの行を実装した |
| [`使用量の配分-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E4%BD%BF%E7%94%A8%E9%87%8F%E3%81%AE%E9%85%8D%E5%88%86-2.md) | 08-30 19:42 | 使用量の配分-2 — 「19:59まで N%」の行は VAIO の側に無い。名と場所を報告して止まる |
| [`猫の常駐-1.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E7%8C%AB%E3%81%AE%E5%B8%B8%E9%A7%90-1.md) | 08-30 17:36 | 猫の常駐-1 — 題字の右に RunCat の猫を置いた（panel v103） |
| [`途切れの回収-1-2.md`](https://raw.githubusercontent.com/kfsr148-art/koushu-handan/main/reports/%E9%80%94%E5%88%87%E3%82%8C%E3%81%AE%E5%9B%9E%E5%8F%8E-1-2.md) | 08-30 17:02 | 途切れの回収-1 の裁定 — dead / stale: も一発だけ押し送る |

<!-- 控えの一覧 ここまで -->
