## 1. MODE Config Selector

- [ ] 1.1 Add MODE state (enum value) defaulting to `5`, with a derived piece limit (5→5, 4E/4H→4, 3E/3H→3) and difficulty (E/H) helper
- [ ] 1.2 Grow the config panel from 130×90 to ~130×110 and add a `MODE` row rendering the current value (`5`, `4E`, `4H`, `3E`, `3H`)
- [ ] 1.3 Extend `configIndex` cycling from `% 3` to `% 4` and wire `adjustConfig` to step MODE through `5 → 4E → 4H → 3E → 3H` (wrapping), keeping A/left/right input working

## 2. Rotation Logic

- [ ] 2.1 Add per-player FIFO queues of board positions (`queues[1]`, `queues[2]`), initialized empty in `resetBoard`
- [ ] 2.2 In the A-button placement path, when the placing player's queue is at the piece limit, remove the oldest piece first: `queues[turn].shift()`, clear `list[oldest]`, destroy `markSprites[oldest]`
- [ ] 2.3 Place the new piece at the cursor and push the position onto the player's queue
- [ ] 2.4 Ensure `checkWinning` evaluates the final board state after removal + placement (win on a rotating placement declares the winner)

## 3. Draw Gating

- [ ] 3.1 In `checkWinning`, only declare a board-full draw when the MODE piece limit is `5`; otherwise a no-win board continues play
- [ ] 3.2 Confirm `MODE 5` still ends in a draw when the 9th cell is filled with no win

## 4. Fade Indicator (Easy Modes)

- [ ] 4.1 In `updateMarkImages`, generate per-player fade variants: full (no fade), aging (medium dither), critical (heaviest dither, still readable as the mark), preserving shape and player color
- [ ] 4.2 Implement bucket computation from queue position (life 1 → critical, life 2 → aging, life ≥ 3 → full) identical for 3E and 4E
- [ ] 4.3 Apply the correct sprite variant to every remaining piece of the moving player after each placement (`refreshFades`); re-evaluate all buckets after a removal
- [ ] 4.4 Render no fade in hard modes (`4H`, `3H`) and at `MODE 5` (always full brightness)

## 5. Reset & Edge Behavior

- [ ] 5.1 Reset the current board when MODE changes mid-match (clears queues, marks, board) while preserving `Xscore`, `Oscore`, and `winTarget`
- [ ] 5.2 Keep color and `PLAY TO` changes behaving as today (live update, no board reset)

## 6. Verification

- [ ] 6.1 Verify `MODE 5` is behaviorally identical to the current game (no rotation, board-full draw, default config)
- [ ] 6.2 In the MakeCode simulator, verify `3E`/`4E` rotation: oldest piece removed on over-limit placement, free placement anywhere, fades shift one bucket per placement
- [ ] 6.3 Verify `3H`/`4H` show no fade and play identically to their easy counterparts except for the indicator
- [ ] 6.4 Verify MODE change mid-match resets the board but keeps match scores, and verify the draw rule at `MODE 5`
