## 1. MODE Config Selector

- [x] 1.1 Add MODE state (enum value) defaulting to `5`, with a derived piece limit (5→5, 4E/4H→4, 3E/3H→3) and difficulty (E/H) helper
- [x] 1.2 Grow the config panel from 130×90 to ~130×110 and add a `MODE` row rendering the current value (`5`, `4E`, `4H`, `3E`, `3H`)
- [x] 1.3 Extend `configIndex` cycling from `% 3` to `% 4` and wire `adjustConfig` to step MODE through `5 → 4E → 4H → 3E → 3H` (wrapping), keeping A/left/right input working

## 2. Rotation Logic

- [x] 2.1 Add per-player FIFO queues of board positions (`queues[1]`, `queues[2]`), initialized empty in `resetBoard`
- [x] 2.2 In the A-button placement path, when the placing player's queue is at the piece limit, remove the oldest piece first: `queues[turn].shift()`, clear `list[oldest]`, destroy `markSprites[oldest]`
- [x] 2.3 Place the new piece at the cursor and push the position onto the player's queue
- [x] 2.4 Ensure `checkWinning` evaluates the final board state after removal + placement (win on a rotating placement declares the winner)

## 3. Draw Gating

- [x] 3.1 In `checkWinning`, only declare a board-full draw when the MODE piece limit is `5`; otherwise a no-win board continues play
- [x] 3.2 Confirm `MODE 5` still ends in a draw when the 9th cell is filled with no win

## 4. Fade Indicator (Easy Modes)

- [x] 4.1 In `updateFadeImages` (called from `updateMarkImages` and on mode change), generate per-player fade variants for each life level (1..N-1) at the current piece limit, preserving shape and player color, with the newest piece (life = N) at full brightness
- [x] 4.2 Implement life-derived fade level from queue position (`life = N - queue.length + i + 1`), advancing exactly one step per placement, starting from the second placement (no wait-until-limit gating)
- [x] 4.3 Apply the correct sprite variant to every remaining piece of the moving player after each placement (`refreshFades`); re-evaluate all levels after a removal
- [x] 4.4 Render no fade in hard modes (`4H`, `3H`) and at `MODE 5` (always full brightness)

## 5. Reset & Edge Behavior

- [x] 5.1 Reset the current board when MODE changes mid-match (clears queues, marks, board) while preserving `Xscore`, `Oscore`, and `winTarget`
- [x] 5.2 Keep color and `PLAY TO` changes behaving as today (live update, no board reset)

## 6. Verification

- [x] 6.1 Verify `MODE 5` is behaviorally identical to the current game (no rotation, board-full draw, default config)
- [x] 6.2 In the MakeCode simulator, verify `3E`/`4E` rotation: oldest piece removed on over-limit placement, free placement anywhere, fades start before the limit and shift one step per placement
- [x] 6.3 Verify `3H`/`4H` show no fade and play identically to their easy counterparts except for the indicator
- [x] 6.4 Verify MODE change mid-match resets the board but keeps match scores, and verify the draw rule at `MODE 5`

## 7. Move-Cap Draw

- [x] 7.1 Add a per-board `placements` counter (total placements) incremented on every placement and reset in `resetBoard`
- [x] 7.2 Add `moveCap()` returning 26 at a piece limit of 4 and 40 at 3
- [x] 7.3 In `checkWinning`, declare a draw when `placements` reaches the cap with no winner (the win check runs first); board-full draw remains gated to `MODE 5`

## 8. Auto-Place

- [x] 8.1 Extract a shared `placePiece(pos)` used by both the A-button handler and the auto-place timer (rotation, fade refresh, win/draw check, placement count)
- [x] 8.2 Add a self-rearming `game.onUpdateInterval(100, ...)` timer that arms a ~0.8s countdown only when the game is active and exactly one empty cell remains, cancels otherwise, and resets after every placement
- [x] 8.3 Move the cursor to the auto-placed cell; a manual placement before the timer fires still places (no double placement) and restarts the countdown for the next move

## 9. Verification

- [x] 9.1 Verify a 4-piece endless game draws at 26 placements and a win on the 26th placement still wins
- [x] 9.2 Verify a 3-piece drag game draws at 40 placements
- [x] 9.3 Verify the sole remaining move auto-places after ~0.8s (4-piece cascade and 5's final move), cancels during config/win/match-over, and that a manual tap before the timer wins the race

## 10. End-of-Game Flow

- [x] 10.1 Keep the winning-line blink (`showWin`) for win endings; `showDraw` hides the cursor and holds the final board without flashing for draw endings (placement-cap draw and mode-5 full-board draw)
- [x] 10.2 Hold the final board (~1.5s) in `declareWinner` before the result splash, driven by a non-blocking `endDelay` timer in the 100ms interval (no `pause()`, so the win blink and rendering keep running during the hold); `showResultSplash` shows the result and sets `awaitingContinue`
- [x] 10.3 Remove the automatic board reset after a non-match result; A or B starts the next board (scores preserved), matching the match-over flow
- [x] 10.4 Make the win blink persistent: `showWin` records the winning line in `flashCells`, a 300ms interval keeps toggling it until the board is reset, and `awaitingContinue` (set only after the splash) gates the continue
- [x] 10.5 Verify in the harness: game end leaves the board intact with `turn == -1`, the win flash toggles DURING the pre-splash delay (not blocked) and continues until reset, draws do not flash, `awaitingContinue` opens only after the delay + splash, and the advance action starts a fresh board with scores preserved
