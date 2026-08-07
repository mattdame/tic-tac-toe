## 1. Starter state

- [x] 1.1 Add `roundStarter` (1 or 2) and `pickStarterOpen` (boolean) globals alongside the existing state declarations
- [x] 1.2 Change `resetBoard()` to set `turn = roundStarter` instead of `turn = 1`

## 2. New match flow

- [x] 2.1 In `startNewMatch()`, set `roundStarter = Math.randomRange(1, 2)` and `pickStarterOpen = true`
- [x] 2.2 Replace the boot sequence (`resetScores(); resetBoard()`) with a call to `startNewMatch()`

## 3. Starter pick window

- [x] 3.1 Add a branch to the B handler that flips `roundStarter` and refreshes the turn indicator when `pickStarterOpen` is true
- [x] 3.2 In `placePiece()`, clear `pickStarterOpen` on the first placement of the match

## 4. Round alternation

- [x] 4.1 In the A handler at `awaitingContinue`, flip `roundStarter` (`3 - roundStarter`) before calling `resetBoard()`

## 5. B button routing

- [x] 5.1 Remove the `matchOver` → `startNewMatch()` branch from the B handler (B becomes a no-op at match-over)
- [x] 5.2 Remove the `awaitingContinue` → `resetBoard()` branch from the B handler (B becomes a no-op while awaiting continue)

## 6. Turn indicator banner

- [x] 6.1 In `updateTurnIndicator()`, render `X STARTS` / `O STARTS` when `pickStarterOpen`, and `TURN: X` / `TURN: O` otherwise
