## 1. Banner constants and state

- [ ] 1.1 Add `let DRAW_COLOR = 11` and `let IS_LIGHT = [false, true, false, true, true, true, false, false, false, true, true, true, false, true, false, false]` near the other color constants.
- [ ] 1.2 Add a small `textColorFor(fill)` helper (or inline ternary) returning 15 for light fills, 1 for dark fills.

## 2. Result banner in updateTurnIndicator

- [ ] 2.1 Replace the `turn == -1` branch in `updateTurnIndicator()` with a result-banner call that selects text and fill from `endPlayer` (0 → "DRAW" + `DRAW_COLOR`, 1 → "X WINS"/"X WINS MATCH" + `colorX`, 2 → "O WINS"/"O WINS MATCH" + `colorO`) using `matchOver` to choose round vs match copy.
- [ ] 2.2 Center the new banner text with width-based x-centering (`80 - floor(len * 5 / 2)`) instead of the hardcoded x.
- [ ] 2.3 Apply the contrast-aware text color from step 1.2 to the result banner text.

## 3. Splash removal

- [ ] 3.1 Remove the round-result `game.splash(...)` from `showResultSplash()`, keeping the match-over check, the `awaitingContinue` / `matchOver` transitions, and the match splash.
- [ ] 3.2 Verify the `endDelay` hold and win-line flash still run unchanged after the splash removal.

## 4. Verification

- [ ] 4.1 On-device check: X wins a round → banner shows `X WINS` in X's color; O wins → `O WINS` in O's color; draw → `DRAW` in color 11.
- [ ] 4.2 On-device check: match end shows `X WINS MATCH` / `O WINS MATCH` and the match splash still appears.
- [ ] 4.3 On-device check: setting X or O to a light color (e.g. white or yellow) keeps banner text legible; default blue/red still show white text.
- [ ] 4.4 On-device check: no result splash appears after a round; pressing A still advances to the next round, and the match-over A still starts a new match.
