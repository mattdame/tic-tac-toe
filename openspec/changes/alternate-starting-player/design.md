## Context

The game is a single MakeCode Arcade file (`tic-tac-toe.js`). Rounds and matches share one lifecycle: `resetBoard()` (line 388) rebuilds the board and hardcodes `turn = 1`, so X always starts. `startNewMatch()` (line 382) resets scores and calls `resetBoard()`. The B handler (line 87) currently doubles as a proceed button at match-over and awaiting-continue. Motivation and scope are in `proposal.md`; behavioral requirements in the `starting-player` and `button-routing` specs.

## Goals / Non-Goals

**Goals:**
- Keep all logic in `tic-tac-toe.js` with the existing flat global-variable style.
- Single source of truth for "who starts this round" that all reset paths read.
- No new state beyond the starter value and the pick-window flag.

**Non-Goals:**
- No UI work beyond the existing text banner (no new screens or sprites).
- No cross-match logic: every new match re-randomizes independently.
- No persistence or AI changes.

## Decisions

**1. Track `roundStarter` (1 or 2); `resetBoard()` reads it instead of `turn = 1`.**
Rationale: `resetBoard()` is the single choke point for starting a round (boot, new match, round continue, mid-round mode change). Making it read a variable means every restart path inherits the correct starter. Alternative: passing a parameter — rejected because there are four call sites and the variable is simpler.
Mutation is kept out of `resetBoard()` so a mid-round mode change (line 265) naturally restarts with the same starter, per spec.

**2. `pickStarterOpen` flag gates the B-flip window.**
It is set `true` only in `startNewMatch()` and cleared `false` on the first placement in `placePiece()`. `resetBoard()` never touches it. Rationale: the window is a round-1-only concern tied to match creation and first move, not board resets. Auto-place (line 628) cannot interfere — during the window the board is empty, so the "one empty cell" branch can't trigger.

**3. Starter mutates at exactly two transitions.**
- `startNewMatch()`: `roundStarter = Math.randomRange(1, 2)` then opens the window.
- A handler at `awaitingContinue` (line 54): `roundStarter = 3 - roundStarter` before `resetBoard()`, producing strict alternation. Draws flow through the same path, so they alternate too.

**4. B loses its proceed roles.**
B handler becomes: close config (unchanged), flip starter when `pickStarterOpen`. The `matchOver` → `startNewMatch()` and `awaitingContinue` → `resetBoard()` branches are deleted. A already handles both paths, so nothing breaks.

**5. Boot initializes like a new match.**
Replace the boot `resetScores(); resetBoard()` (line 599) with `startNewMatch()`, which already does those steps plus randomizing and opening the window.

**6. Banner distinguishes STARTS vs TURN.**
`updateTurnIndicator()` renders `X STARTS` / `O STARTS` when `pickStarterOpen`, else `TURN: X` / `TURN: O`. Reuses the existing highlight-box layout; "X STARTS" fits the 72px box. A separate "swap with B" hint was considered but omitted to keep the banner minimal.

## Risks / Trade-offs

- **B becomes a "do nothing" button outside config/pick window.** Players used to B-as-proceed may press it expecting to advance. → Mitigation: this is deliberate (spec `button-routing`); A is the only proceed path and is already the primary button.
- **Randomness is non-deterministic to test.** → Mitigation: tests target the alternation and window-closing paths, which are deterministic; the coin flip is a single `Math.randomRange`.
- **Banner text width.** "X STARTS" is one character wider than "TURN: X". → Mitigation: fits within the existing 72px highlight box; verify at play time.
