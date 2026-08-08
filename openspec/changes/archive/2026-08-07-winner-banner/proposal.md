## Why

When a round or match ends, the banner says the generic `GAME OVER` — it never says who won. Since the current `GAME OVER` box uses color 9 (a selectable player color), it's even ambiguous against a player who picked light blue. The player must rely on the modal splash to learn the outcome, which is redundant with what a result banner could say at a glance.

## What Changes

- **Round-over banner names the winner**: When a round ends, the center banner shows `X WINS`, `O WINS`, or `DRAW` instead of `GAME OVER`, tinted by the winner's color (draw gets its own neutral color).
- **Match-over banner names the match winner**: When a match ends, the banner shows `X WINS MATCH` / `O WINS MATCH` instead of `GAME OVER`.
- **Draw has a fixed non-player color**: Draw uses color **11** (dusty lavender-gray), which is outside the selectable player palette `[1..10]`, so a draw is never confusable with a player's color.
- **Contrast-aware banner text**: Banner text color is chosen white or black based on the box fill's luminance, fixing the existing case where a light player color (e.g. white/yellow) made white-on-color text unreadable.
- **Round-result splash removed**: The `Player 1 (X) Won!` / `Player 2 (O) Won!` / `CAT / DRAW!` splash no longer appears after a round — the banner, win-line flash, and score stars carry the outcome. The **match** splash (`Player 1 Wins the Match!`) is kept.

## Capabilities

### New Capabilities
- `result-banner`: Determines what the center banner shows at round and match end (winner, draw, match winner), its fill and text colors, and which result splash screens are shown.

### Modified Capabilities

## Impact

- `tic-tac-toe.js`:
  - `updateTurnIndicator()` (line 166): replaces the `turn == -1` "GAME OVER" branch with winner/draw/match states; adds a contrast-aware text-color lookup.
  - `declareWinner()` (line 351): unchanged logic; still sets `endPlayer` / `endDelay` used to drive the new banner.
  - `showResultSplash()` (line 362): removes the round-result splash; keeps only the match-over splash and the `awaitingContinue` / `matchOver` transitions.
  - `resetBoard()` (line 388): unchanged.
  - Constants: add a draw color constant and an `isLight[]` lookup table for contrast.
- No external dependencies or APIs affected.
