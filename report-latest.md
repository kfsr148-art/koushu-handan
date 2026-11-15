# y1115-5 続き：v1488（リーチの行の声と字から『定石では、』を外す）

状態：終わり（残り：凍結-0・実機確認・stable）

## 結果
- ① v1487 の雲の速い検査（reports/cloud-check-fast-20261115-035605.md）：check・adv-check とも全部 PASS。
- ② `advd-riichi` の声：714c9a8a は雲の起動条件（scratchpad/jobs 等）に当たらず voice-advice.js が走っていなかったので、`gh workflow run job.yml -f only=voice-advice.js` で起こした（run 43675024734・成功）。書き戻された advd-riichi を pull し、`node voice-pieces.js` で直下へ置いた（変わったのは advd-riichi.wav.wav の1本だけ）。
- 本体の ADV_TEXT とカタログの advd-riichi の字から『定石では、』を外した。v1488（data-ver・verTag・ver.txt 同時）。
- 構文検査 OK／serifu 再抽出済み（口調の混入0件・--check 一致）。

## 実機で見る所
リーチを受けた守りの判定の最後の行が「リーチを受けたら、その人の捨てた牌、…」で始まり（『定石では、』が付かない）、声も字と同じ出だしであること。版の字が v1488。

## 残り
凍結-0・実機確認・stable
