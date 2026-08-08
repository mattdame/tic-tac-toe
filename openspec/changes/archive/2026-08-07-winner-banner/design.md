## Context

See proposal.md — Why. `tic-tac-toe.js` is a single-file MakeCode Arcade game (160×120, 16-color palette). The center banner is drawn by `updateTurnIndicator()` (line 166): a 76px-wide box (`42..118`) with a 15-black border and a `fillRect(44, 3, 72, 12, color)` inner fill, one line of `bg2.print(text, x, 5, textColor)` at 5px/char (~15 chars max). The `turn == -1` branch currently hardcodes a light-blue (9) box and white "GAME OVER" text.

Round/match flow: `declareWinner()` (line 351) sets `turn = -1`, increments the score, records `endPlayer` (1/2/0 for X/O/draw), arms `endDelay = END_DELAY` (15 × 100ms), and calls `updateTurnIndicator()`. After the hold, `showResultSplash()` (line 362) shows the round-result splash, then either sets `awaitingContinue` or shows the match splash and sets `matchOver`. Player colors are selectable across `COLORS = [1..10]`; the palette's remaining colors are 11 (light purple), 12 (dark purple), 13 (tan = background), 14 (brown), 15 (black = grid/border).

## Goals / Non-Goals

**Goals:**
- Round-over banner names the winner / draw with winner-identified fill.
- Match-over banner names the match winner.
- Draw uses fixed neutral color 11, outside the player palette.
- Contrast-aware text (white on dark, black on light) for all player colors.
- Remove the round-result splash; keep the match-over splash.

**Non-Goals:**
- No change to `showWin`/`showDraw` flash behavior or score stars.
- No change to the `TURN: X`/`TURN: O` in-play banner states.
- No change to button routing (A = proceed; unchanged by `alternate-starting-player`).
- No layout/size changes to the banner box.

## Decisions

### 1. Banner states driven by `endPlayer` + `matchOver` in one branch
Replace the single `turn == -1` "GAME OVER" branch in `updateTurnIndicator()` with a result-banner helper that picks text and fill from `endPlayer` (1/2/0) and `matchOver`:

```
turn == -1 →  endPlayer == 0      → fill DRAW_COLOR (11), text "DRAW"
              endPlayer == 1      → fill colorX,        text matchOver ? "X WINS MATCH" : "X WINS"
              endPlayer == 2      → fill colorO,        text matchOver ? "O WINS MATCH" : "O WINS"
```

Rationale: `endPlayer` already records the outcome before the banner redraws, and the match winner is always the last round's winner (draws can't fill the final star), so no new state is needed. Alternatives: separate branches per state — rejected, one table-like helper is clearer and keeps banner math in one place.

### 2. Draw color constant = 11
Add `let DRAW_COLOR = 11` (dusty lavender-gray). Color 11 is outside `COLORS = [1..10]`, distinct from background 13 and grid/border 15, and the closest the palette has to a neutral gray — "no one" reads correctly. Alternatives: 12 (dark purple) — too somber; 14 (brown) — warmer, reads more assertive; 13/15 — excluded because they equal background/grid.

### 3. Contrast-aware text via a fixed luminance lookup
Add `let IS_LIGHT = [false, true, false, true, true, true, false, false, false, true, true, true, false, true, false, false]` indexed by palette color, and pick `textColor = IS_LIGHT[fill] ? 15 (black) : 1 (white)`.

Rationale: the palette is fixed, so luminance is a compile-time constant — no runtime math, and it covers every player color including light-blue (9) and purple (10) that the current white-on-color code mishandles. Alternatives: runtime brightness computation — unnecessary for a fixed palette; always-white text — broken for light fills (the bug this fixes).

### 4. Round-result splash removal lives in `showResultSplash()`
`showResultSplash()` drops the first `game.splash(...)` call entirely and runs its match check directly. Because the flash interval (`game.onUpdateInterval(300, ...)`) and `endDelay` hold are unchanged, the winning line still blinks and the ~1.5s input-absorbing hold still protects against an A-tap on the winning move instantly resetting the board. `awaitingContinue` / `matchOver` transitions and the match splash are preserved.

Rationale: removing the round splash leaves the banner as the single outcome signal, with the persistent win-line flash and score stars as reinforcement. Keeping the hold prevents the double-tap-reset trap. Alternatives: keep the round splash (tier A) — rejected, redundant with the banner; remove the match splash too (tier C) — rejected, the match splash is the retained "big moment".

### 5. Text x-centering per string
The banner currently centers by hardcoded x (`61` for "TURN: X", `57` for "GAME OVER"). New strings have different widths ("X WINS" ≈ 6 chars, "X WINS MATCH" ≈ 13 chars); center each via `80 - floor(len * 5 / 2)` so all states sit centered in the 76px box. (Exact pixel tweaks confirmed on-device.)

## Risks / Trade-offs

- **Centering drift** — ["X WINS MATCH" at ~65px is near the 72px box width; off-by-a-pixel centering could clip] → Mitigation: use the width-based centering formula and verify the match-over string on-device; drop to "X WINS MATCH" only if it clips, since the match splash already announces it.
- **Light-fill contrast is a behavior change players may notice** — [X set to white now shows black banner text instead of today's white] → Mitigation: this is the intended fix for an unreadable case; default colors (blue/red) still get white text, so the default look is unchanged.
- **Removing the round splash shortens the end-of-round beat** — [The outcome now appears as soon as the banner updates rather than after a modal] → Mitigation: the unchanged `endDelay` hold and persistent win-line flash keep the moment readable.

## Migration Plan

Single file, no data to migrate. Rollback = revert `tic-tac-toe.js` to the pre-change commit. The default player colors (blue/red) keep white banner text, so the default appearance changes only in banner copy ("X WINS" vs "GAME OVER").
