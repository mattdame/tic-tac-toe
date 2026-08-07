## 1. Decouple mode semantics from display

- [x] 1.1 Replace the `MODES` string array (line 444) with three index-aligned arrays: `MODE_LABELS` (`["CLASSIC", "4 PIECES FADE", "4 PIECES SOLID", "3 PIECES FADE", "3 PIECES SOLID"]`), `MODE_PIECES` (`[5, 4, 4, 3, 3]`), and `MODE_FADES` (`[false, true, false, true, false]`)
- [x] 1.2 Rewrite `modeLabel()` (line 219) to return `MODE_LABELS[modeIndex]` and `pieceLimit()` (line 222) to return `MODE_PIECES[modeIndex]` (no more `parseInt`/`charAt`)
- [x] 1.3 Rename `modeIsEasy()` (line 225) to `modeFades()` returning `MODE_FADES[modeIndex]` (no more `indexOf("E")`), and update its single call site (line 300)
- [x] 1.4 Update the cycle in `adjustConfig` (line 262) to use `MODE_LABELS.length` instead of `MODES.length`

## 2. Config panel rendering

- [x] 2.1 Confirm `drawConfig` (line 242) renders the new labels under the existing `MODE:` header and that the longest label `MODE: 4 PIECES SOLID` (20 chars ≈ 100px) fits the panel's 118px text area without clipping

## 3. Verification

- [ ] 3.1 In the MakeCode simulator, verify the config `MODE` row cycles `CLASSIC → 4 PIECES FADE → 4 PIECES SOLID → 3 PIECES FADE → 3 PIECES SOLID` and wraps, defaulting to `CLASSIC`
- [ ] 3.2 Verify fade modes (`4 PIECES FADE`, `3 PIECES FADE`) show the fade indicator and solid modes (`4 PIECES SOLID`, `3 PIECES SOLID`) and `CLASSIC` render at full brightness
- [ ] 3.3 Verify no gameplay regression: piece rotation, placement caps (26 at 4 pieces, 40 at 3), board-full draw at `CLASSIC`, and auto-place all behave as before
