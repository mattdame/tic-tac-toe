## Why

X currently starts every round and every match (`resetBoard` hardcodes `turn = 1`). Since the starting player has a measurable advantage, this is unfair over a match and gives X a permanent edge.

## What Changes

- **Random first starter**: Each new match picks the starting player randomly (X or O).
- **Starter pick window**: At the start of a match, before any piece is placed, the starter can be changed by pressing B. The window closes on the first placement.
- **Strict alternation**: After round 1, the starting player strictly alternates each round for the rest of the match.
- **Mid-round mode change**: Changing the game mode mid-round restarts the round with the same starter, not the other player.
- **Banner shows starter**: The turn indicator shows "X STARTS" / "O STARTS" during the pick window, and "TURN: X" / "TURN: O" during normal play.
- **Button consistency**: A is the only "proceed" button — placement, continuing to the next round, and starting a new match are all A-only. B is no longer accepted at match-over or awaiting-continue; its only roles are flipping the starter (pick window) and closing the config menu.

## Capabilities

### New Capabilities
- `starting-player`: Determines who starts each round — random pick at match start, B-flip window until first move, strict alternation across rounds, and same-starter restart on mid-round mode changes.
- `button-routing`: Defines which buttons perform which actions — A-only for place/continue/new-match, B-only for flip starter and close config.

### Modified Capabilities

## Impact

- `tic-tac-toe.js` — the round/match lifecycle:
  - `resetBoard()` (line 388): replaces `turn = 1` with the tracked round starter.
  - `startNewMatch()` (line 382): picks a random starter and opens the pick window.
  - `controller.B.onEvent` handler (line 87): removes new-match and next-round behavior.
  - `controller.A.onEvent` handler (line 43): unchanged behavior, remains the sole proceed button.
  - `updateTurnIndicator()` (line 166): shows "STARTS" vs "TURN" states.
  - Boot sequence (line 599): initializes like a new match (random starter + pick window).
- No external dependencies or APIs affected.
