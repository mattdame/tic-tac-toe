## Why

The `MODE` config values (`5`, `4E`, `4H`, `3E`, `3H`) are cryptic: the number's meaning (per-player piece limit) and the letter split (age indicator shown/hidden) are opaque to players. The "easy/hard" framing is also misleading — hard is genuinely harder (you must track rotation order mentally), but easy isn't easier, it merely shows the indicator. "fade/solid" describes the mechanic honestly and reads better on the config panel.

## What Changes

- Replace the player-facing `MODE` labels with descriptive text under the existing `MODE:` header: `CLASSIC`, `4 PIECES FADE`, `4 PIECES SOLID`, `3 PIECES FADE`, `3 PIECES SOLID`. **BREAKING** (player-facing label change): the cryptic `5/4E/4H/3E/3H` tokens disappear.
- Cycle order and default (`CLASSIC`) are unchanged; the number in a label is the per-player piece limit; `FADE` = age indicator shown, `SOLID` = no indicator; `CLASSIC` = standard tic-tac-toe.
- Decouple display from semantics: replace the single `MODES` string array (currently both display text and parsed data) with parallel `MODE_LABELS` / `MODE_PIECES` / `MODE_FADES` arrays.
- Rename the `modeIsEasy()` helper to `modeFades()`; `pieceLimit()` and `modeLabel()` read from the parallel arrays instead of parsing the label string.
- Adopt "fade/solid" as the formal concept in specs, dropping "easy/hard" language everywhere.

## Capabilities

### New Capabilities
<!-- None - this change modifies existing capabilities only -->

### Modified Capabilities
- `piece-rotation`: The `MODE` config option changes from values `5`, `4E`, `4H`, `3E`, `3H` to labels `CLASSIC`, `4 PIECES FADE`, `4 PIECES SOLID`, `3 PIECES FADE`, `3 PIECES SOLID`; the number is the piece limit, `FADE` marks the indicator shown and `SOLID` marks no indicator.
- `disappear-indicator`: The fade indicator applies to fade modes (`4 PIECES FADE`, `3 PIECES FADE`) rather than "easy" modes; solid modes (`4 PIECES SOLID`, `3 PIECES SOLID`) and `CLASSIC` render at full brightness.

## Impact

- `tic-tac-toe.js` — the `MODES` array (line 444) and its consumers: `modeLabel()` (219), `pieceLimit()` (222), `modeIsEasy()` (225, call site 300), the config panel row (242), and `MODE.length` (262).
- Specs — `piece-rotation` and `disappear-indicator` delta specs under this change supersede the `add-disappearing-pieces` wording.
- No gameplay, draw-rule, cycle-order, or persistence changes.
