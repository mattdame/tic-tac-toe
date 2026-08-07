## Why

Turn tic-tac-toe into a "disappearing" variant: players own a limited number of pieces (3-5), and once all are placed the oldest piece vanishes to make room for each new one. This adds a rotating-board mechanic that makes every match more strategic than standard tic-tac-toe, with a configurable difficulty.

## What Changes

- Add a combined `MODE` config option cycling `5 → 4E → 4H → 3E → 3H` (default `5`).
  - `5` behaves exactly like today's game (no piece ever moves).
  - `4E`/`3E` = 4 or 3 pieces per player with the age indicator shown ("easy").
  - `4H`/`3H` = 4 or 3 pieces per player with no indicator ("hard").
- When a player places a piece beyond their limit, their oldest piece is removed (FIFO per player) and the new piece is placed anywhere on the board.
- Board-full draws only apply at `5` pieces; at `4E/4H/3E/3H` games are win-only but end in a draw if a per-mode placement cap is reached without a winner (26 total placements at 4 pieces, 40 at 3 pieces).
- When exactly one empty cell remains, the current player's piece is placed there automatically after a short delay (~0.8s), so forced endgames (the 4-piece rotation tail and 5's final move) play out without input.
- When a board ends, the final board is held (~1.5s, with a win blinking its winning line until reset) before the result splash, and a button press starts the next board — matching the match-over flow instead of auto-resetting.
- In easy modes, each piece's sprite fades as it nears removal so players can see at a glance which piece disappears next (and the relative order).
- Changing `MODE` mid-match resets the current board (scores and match length are preserved).
- Existing config (PLAY TO, X COLOR, O COLOR) is unchanged.

## Capabilities

### New Capabilities
- `piece-rotation`: The MODE selector, per-player FIFO piece queues, oldest-piece removal on over-limit placement, draw-condition gating (board-full at `5`, placement cap at `3`/`4`), auto-place of the sole remaining move, and mid-match reset behavior.
- `disappear-indicator`: The fade-by-age rendering for easy modes, mapped to removal distance (critical / aging / full) rather than piece count.

### Modified Capabilities
<!-- None: no existing specs under openspec/specs/. -->

## Impact

- `tic-tac-toe.js`:
  - Placement handler (`controller.A` / `drawMark`) — queue tracking and removal; shared `placePiece` used by manual and automatic placement.
  - `checkWinning` — gate the board-full draw on N == 5 and declare a draw when the per-mode placement cap is reached.
  - Auto-place interval — places the sole remaining move after a delay when the game is active.
  - Config menu (`drawConfig`, `adjustConfig`, `moveCursor`) — MODE row, larger panel, cycle logic.
  - `updateMarkImages` — generate fade variants per player color.
  - Global state — per-player queues, placement counter; `resetBoard` clears them.
- No new dependencies; all effects use existing MakeCode Arcade primitives (sprites, images, `image.replace`).
