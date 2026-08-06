## 1. Starter state

- [ ] 1.1 Add `roundStarter` (1 or 2) and `pickStarterOpen` (boolean) globals alongside the existing state declarations
- [ ] 1.2 Change `resetBoard()` to set `turn = roundStarter` instead of `turn = 1`

## 2. New match flow

- [ ] 2.1 In `startNewMatch()`, set `roundStarter = Math.randomRange(1, 2)` and `pickStarterOpen = true`
- [ ] 2.2 Replace the boot sequence (`resetScores(); resetBoard()`) with a call to `startNewMatch()`

## 3. Starter pick window

- [ ] 3.1 Add a branch to the B handler that flips `roundStarter` and refreshes the turn indicator when `pickStarterOpen` is true
- [ ] 3.2 In `placePiece()`, clear `pickStarterOpen` on the first placement of the match

## 4. Round alternation

- [ ] 4.1 In the A handler at `awaitingContinue`, flip `roundStarter` (`3 - roundStarter`) before calling `resetBoard()`

## 5. B button routing

- [ ] 5.1 Remove the `matchOver` → `startNewMatch()` branch from the B handler (B becomes a no-op at match-over)
- [ ] 5.2 Remove the `awaitingContinue` → `resetBoard()` branch from the B handler (B becomes a no-op while awaiting continue)

## 6. Turn indicator banner

- [ ] 6.1 In `updateTurnIndicator()`, render `X STARTS` / `O STARTS` when `pickStarterOpen`, and `TURN: X` / `TURN: O` otherwise
