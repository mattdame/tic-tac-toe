# starting-player Specification

## Purpose

Determines who starts each round of a match — a random pick for the first round, an optional B-press override before the first move, and strict alternation for every subsequent round.

## Requirements

### Requirement: Random first starter

Each new match SHALL randomly select the starting player (X or O) with equal probability.

#### Scenario: New match starts with X
- **WHEN** a new match begins
- **THEN** the starting player is randomly chosen, which may be X

#### Scenario: New match starts with O
- **WHEN** a new match begins
- **THEN** the starting player is randomly chosen, which may be O

### Requirement: Starter pick window

At the start of a match, before any piece is placed, pressing B SHALL swap the starting player. The window SHALL close once the first piece of the match is placed; after that, B SHALL have no effect on the starter.

#### Scenario: B swaps the starter
- **WHEN** the match has begun and no piece has been placed
- **THEN** pressing B switches the starting player between X and O, and the banner reflects the new starter

#### Scenario: Window closes after first placement
- **WHEN** the first piece of the match has been placed
- **THEN** pressing B no longer changes the starting player

### Requirement: Strict alternation across rounds

After the first round, the starting player SHALL strictly alternate for each subsequent round of the match. A round that ends in a draw SHALL still alternate the starter for the next round.

#### Scenario: Next round alternates starter
- **WHEN** a round ends and the match continues
- **THEN** the next round starts with the player who did not start the finished round

#### Scenario: Draw alternates starter
- **WHEN** a round ends in a draw and the match continues
- **THEN** the next round starts with the player who did not start the drawn round

### Requirement: Mode change restart keeps starter

Changing the game mode mid-round SHALL restart the current round with the same starting player.

#### Scenario: Mid-round mode change restarts with same starter
- **WHEN** a player changes the game mode while a round is in progress
- **THEN** the board resets and the round restarts with the same starting player as before the change
