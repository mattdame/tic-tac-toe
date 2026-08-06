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
The system SHALL declare a draw on a full board only when `MODE` is `5`. At `4E`/`4H`/`3E`/`3H` a board can never fill to 9 cells, so the game SHALL continue until a player wins and SHALL not declare a draw from a full-board condition.

#### Scenario: Full-board draw in mode 5
- **WHEN** `MODE` is `5` and the 9th cell is filled with no win
- **THEN** the game declares a draw

#### Scenario: No draw from a full board in lower modes
- **WHEN** `MODE` is `3E` and both players have 3 pieces each on the board with no win
- **THEN** the game does not end and play continues

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
