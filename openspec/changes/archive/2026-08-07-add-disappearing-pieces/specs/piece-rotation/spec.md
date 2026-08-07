## Purpose

Lets players cap the number of pieces they control and rotates the oldest piece out of existence once the limit is reached, turning standard tic-tac-toe into a disappearing-piece game with a configurable difficulty.

## ADDED Requirements

### Requirement: MODE configuration selector
The system SHALL provide a `MODE` config option that cycles through the values `5`, `4E`, `4H`, `3E`, `3H`, in that order, defaulting to `5`. The value `5` SHALL behave exactly like standard tic-tac-toe. The letter in `4E`/`3E`/`4H`/`3H` SHALL mark easy (`E`, indicator shown) or hard (`H`, no indicator) difficulty, and the number SHALL be the piece limit.

#### Scenario: Selecting a mode
- **WHEN** the player opens the config menu and adjusts `MODE` from the default `5`
- **THEN** the value cycles in order (`5 → 4E → 4H → 3E → 3H` and wraps around) and the selected value is shown on the config panel

#### Scenario: Mode 5 is standard play
- **WHEN** `MODE` is `5` and players play a game
- **THEN** the game plays exactly as standard tic-tac-toe: no piece ever disappears and a full board ends the game in a draw

#### Scenario: Changing mode mid-match
- **WHEN** the player changes `MODE` while a board is in progress
- **THEN** the current board resets, the match scores and `PLAY TO` target are preserved, and the new mode takes effect

### Requirement: Per-player piece limit and rotation
Each player SHALL control at most `N` pieces on the board, where `N` is the number in the selected `MODE` (`5`→5, `4E`/`4H`→4, `3E`/`3H`→3). When a player attempts to place a piece while already at the limit, the oldest of that player's pieces on the board SHALL be removed (its cell cleared and its sprite destroyed) and the new piece SHALL be placed at the cursor location, which may be any empty cell.

#### Scenario: Placing beyond the limit removes the oldest piece
- **WHEN** a player with `N` pieces already on the board places a new piece on an empty cell
- **THEN** the piece that player placed first among their current pieces is removed from the board and the new piece appears at the cursor

#### Scenario: Removal only affects the placing player
- **WHEN** a player places beyond their limit
- **THEN** only that player's oldest piece is removed and no opponent pieces are affected

#### Scenario: New piece placement is free
- **WHEN** a player places beyond their limit
- **THEN** the new piece may be placed on any empty cell, including one not adjacent to their other pieces

#### Scenario: No rotation at the default limit
- **WHEN** `MODE` is `5`
- **THEN** no piece is ever removed, because a game ends (win or draw) before any player reaches a 6th placement

### Requirement: Draw detection depends on piece limit
The system SHALL declare a draw on a full board only when `MODE` is `5`. At `4E`/`4H`/`3E`/`3H` a board can never fill to 9 cells, so the game SHALL not declare a draw from a full-board condition and SHALL instead rely on the placement cap to end unwinnable games.

#### Scenario: Full-board draw in mode 5
- **WHEN** `MODE` is `5` and the 9th cell is filled with no win
- **THEN** the game declares a draw

#### Scenario: No draw from a full board in lower modes
- **WHEN** `MODE` is `3E` and both players have 3 pieces each on the board with no win
- **THEN** the game does not end from the full-board rule and play continues

### Requirement: Placement cap ends unwinnable games
In modes with fewer than 5 pieces, a board that reaches a per-mode placement cap without a winner SHALL be declared a draw. The cap SHALL be 26 total placements when the piece limit is 4 and 40 total placements when the piece limit is 3. A placement at the cap that completes a winning line SHALL be declared a win, never a draw.

#### Scenario: 4-piece endless game ends in a draw
- **WHEN** a 4-piece game reaches 26 total placements with no winner
- **THEN** the game declares a draw

#### Scenario: Win on the cap placement wins
- **WHEN** a 4-piece game's 26th placement completes a winning line
- **THEN** the placing player is declared the winner

#### Scenario: 3-piece cap
- **WHEN** a 3-piece game reaches 40 total placements with no winner
- **THEN** the game declares a draw

### Requirement: Auto-place the sole remaining move
When a board has exactly one empty cell and the game is active (a player's turn, the config menu closed, no win animation running, and the match not over), the system SHALL automatically place the current player's piece in that cell after a delay of roughly 0.8 seconds. If an auto-placement leaves exactly one empty cell again, the same rule SHALL apply to the next player, so forced endgames play out without input. A manual placement on the sole empty cell before the delay elapses SHALL succeed and restart the delay for the following move rather than causing a second placement.

#### Scenario: Auto-place of 5's final move
- **WHEN** `MODE` is `5`, 8 cells are filled, and the game is active
- **THEN** after roughly 0.8 seconds the current player's piece is placed in the remaining cell and the game ends (win or board-full draw)

#### Scenario: 4-piece forced endgame cascades
- **WHEN** a 4-piece game reaches 8 filled cells and a player places in the sole empty cell
- **THEN** after roughly 0.8 seconds the other player's piece is placed there automatically, repeating until the game ends

#### Scenario: Manual placement wins the race
- **WHEN** exactly one empty cell remains and the player presses A on it before the auto-place delay elapses
- **THEN** the piece is placed manually and no second placement occurs

### Requirement: End-of-game result is shown and held until the player continues
When a board ends in a win, the system SHALL blink the winning line. The blink SHALL keep repeating until the board is reset; it SHALL NOT stop on its own. When a board ends in a draw (placement cap or full board), the system SHALL NOT blink or flash any marks and SHALL leave the final board in place. After the result splash, the system SHALL leave the board in its final state and SHALL start the next board only when the player presses A or B, except when the match is over, where the existing match-over flow applies. The board SHALL NOT be reset automatically.

#### Scenario: Win blinks persistently until reset
- **WHEN** a player completes a winning line
- **THEN** the winning line keeps blinking until the player presses a button to start the next board, with the board held during the winner splash

#### Scenario: Draw holds without flashing
- **WHEN** a game ends in a draw
- **THEN** no marks blink, the final board holds, and the next board starts only when the player presses a button after the draw splash

#### Scenario: Board holds after the splash
- **WHEN** the result splash has been dismissed and the match is not over
- **THEN** the final board remains visible and a win keeps blinking, and the next board starts only when the player presses a button, with match scores preserved

#### Scenario: Press during the pre-splash hold does nothing
- **WHEN** a board has just ended and the result splash has not yet appeared (the ~1.5s hold)
- **THEN** button presses are ignored and the winning line keeps blinking until the splash appears

#### Scenario: Match win keeps the match-over flow
- **WHEN** a result makes a player reach the match target
- **THEN** the match-over message appears and a button press starts a new match, as before

### Requirement: Win detection after rotation
After a placement that removes an old piece, the system SHALL check for a win using the final board state (including the newly placed piece and excluding the removed one) and SHALL declare the winner if three-in-a-row exists.

#### Scenario: Winning on a rotating placement
- **WHEN** a player places beyond their limit and the resulting final board has three-in-a-row for that player
- **THEN** that player is declared the winner

### Requirement: Rotation state resets each board
The per-player placement order (which piece is oldest) SHALL reset whenever a board is reset, so a fresh game starts with empty piece histories.

#### Scenario: New game starts with empty histories
- **WHEN** a new board begins after a win, draw, or mode change
- **THEN** no piece from the previous board is carried over and the first placement of each player becomes that player's oldest piece
