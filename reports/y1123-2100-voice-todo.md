# v1522 の声づくりの残り（枠 二百十・棚 #4 守りの対子の種 ＋ 国士10種の言い方）

状態：文字は本体 v1522・核・台帳に入れた（声は一本も作っていない）。声は親が雲（voice-m4a.yml）で作る。

## 一、作る声（確定の分）：28本 = 新規21 + 変更7

読みは `voice-advice-persona.js` の say()（人格）／`voice-advice-catalog.js`（ずんだ）が出す。声の名は `advx-<人格>-<id>`（人格6人）と `<id>`（ずんだ）。

| id | 種類 | 本数 | 人格6人（advx-<人格>-<id>）＋ずんだ（<id>） |
|---|---|---|---|
| advd-w-chi-n | 新規 | 7 | 対子が3組以上ございます／ある／ありますわ／あるんですの／あるにゃ／あります／あるのだ |
| advd-w-chi-t | 新規 | 7 | 対子は、同じ牌を2回続けて切れ…降りる時の盾になる…（七人七様） |
| advd-w-chi-f | 新規 | 7 | 対子は、同じ牌を2回続けて切れ…安全牌の代わりになる…（七人七様） |
| adva-kok-m | 字が変わった | 7 | 「ただし、リーチが来たら降りる…」（ございます／ぞ／ますわ／ますの／にゃ／ます／のだ） |

人格は butler・strategist・lady・french・ichihime・sensei（blunt＝ずんだは素の名）。字の正本は `advice-tone-core.js` の 1140行付近（chi 3行）と `adva-kok-m` の行。

## 二、方言の声（advy-<8桁>）：見積もりで 219本以上

方言（宮崎・博多・大阪・京都・青森・沖縄・武士・幼児）と、つなぎ・語尾の変わった字は、`voice-advice-dial.json` の名（advDialVoice(字)）で別に要る。
手元の写しで、守りの対子の種（far・cheap・shape・few・pair）と国士10種の行を、人格7×方言9×モード3×頭の一言2通りで組み、dial.json に無い名を数えた：

- 対子の種の分：178本（`voice-plan/v1522-dial-sample.json`・名→字の見本）
- 国士10種の分：41本（同じファイルに合算＝重なり除いて **219本**）
- **これは下限**（頭の一言を2通りしか試していない・くじは1つ）。正確な数は雲の洗い出しで出す（下の手順）。
- 見本の台本：`voice-plan/v1522-dial-sample.txt`（名.wav.wav<TAB>読み）

## 三、親が回す手順

1. 本体・核・台帳・serifu を commit・push（雲の check-fast が回る。声が無いので「本体が使う声が公開の荷の台帳に無い」系の検査④が落ちる見込み。声が揃うまで配信は止まる／落ちたら戻さず前へ直す）。
2. 雲の洗い出し：`scratchpad/jobs/v1514-voice-plan.js` を v1522 用に写す。写し先は `scratchpad/jobs/v1522/`（私が `sim1522.js`＝sim1514 に対子の種の場面を足した物と `slice.js` を作っておいた。`CHI_ONLY=1`／`base`／`kok` は手元の点検用の旗で、雲では要らない）。`v1514-voice-plan.js` の `v1514` を `v1522` に直し、`./sim1514.js` の参照を `sim1522.js` に、国士10種の場面（A側）も回るよう `SIDE: 'd'` の縛りを外す（または `a,d`）。`gh run list --workflow job.yml --limit 5` で走りが無いのを確かめてから `gh workflow run job.yml -f only=v1522-voice-plan.js`。
3. 部品の声（上の一の28本）：`voice-m4a.yml` の `kind=parts` を起こす（部品は台帳 `voice-advice-catalog.js` から出る：ずんだ4本＋人格24本）。方言の声：洗い出しが書く `voice-plan/` の足し（v1514 の `append-dial.js` の v1522 版）を `dial.txt` へ足してから `kind=dial`。
4. 声が直下に揃ったら、`node scratchpad/jobs/v1514/merge-dial.js` と同じ型で `voice-advice-dial.json`・`voice-advice-dial.txt` に足し、`node pack-site.js --make-manifest` → `node pack-site.js --verify` で `voice-used.txt` を作り直し、一緒に commit（作法42）。公開の荷は今 716MB 前後、28＋約220本（1本数十KB）で 1GB の手前に収まる見込み。
5. `voice-advice-dial.json` と `voice-used.txt` は私は触っていない（声が無い名を足すと check.js が「台本の声が無い」で落ちるため）。

## 四、30秒の収まり（ADV_CAP = 30）

`advice-tone-core.js` の `advEst`／`advBad` で、守りの対子の種の行を組んだ結果を手元で見た（標準・大阪・宮崎・博多・京都・青森・沖縄・武士・幼児 × 人格7 × モード3）：

- 組み終わっても収まらない（`ok:false`）割合は、対子の種を入れた行 3,360組中10（標準＋大阪）／5,040組中100（宮崎・博多・京都）／6,720組中296（青森・沖縄・武士・幼児）。
- **対子の種の無い今の守りの行でも同じ型で落ちている**（比べ：8,064組中24（標準＋大阪）、8,064組中560（幼児＋宮崎））。割合は増えていない（対子の種が入った行の方が低い）。落ちるのは幼児・一姫の大阪／宮崎などの既存の組み合わせ。
- 種の字（chi-n 12字・chi-t/f 約31字）は `advDropSLs` の正規表現に足したので、収まらない時はひと言添えと同じ段で外れる。
- 国士10種の行（`adva-kok-m` の新しい字）：A側1,512組中44が詰め切れず（最長 32.7秒の見積もり）。**変更前の比べは取っていない**（旧い字は短かったので、「ただし、リーチが来たら降りる」で少し伸びた分が入っている可能性がある）。雲の洗い出し後に `node advice-441.js` 系で確かめる値打ちがある。
