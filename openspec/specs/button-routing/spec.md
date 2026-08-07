# button-routing Specification

## Purpose

Defines which buttons perform which actions in the round and match lifecycle — A is the sole proceed button, while B is reserved for cancel/flip actions only.

## Requirements

### Requirement: A is the sole proceed button

Placing a piece, continuing to the next round after a round ends, and starting a new match after a match ends SHALL each be performed only by pressing A.

#### Scenario: A places a piece
- **WHEN** it is a player's turn and they press A on an empty cell
- **THEN** the piece is placed

#### Scenario: A continues after a round
- **WHEN** a round has ended and the match is not over
- **THEN** pressing A starts the next round

#### Scenario: A starts a new match
- **WHEN** a match has ended
- **THEN** pressing A starts a new match

### Requirement: B limited to flip and cancel

B SHALL only flip the starting player during the starter pick window and close the config menu. B SHALL have no effect at match-over, while awaiting continue, or during normal play.

#### Scenario: B closes the config menu
- **WHEN** the config menu is open and B is pressed
- **THEN** the config menu closes

#### Scenario: B flips the starter in the pick window
- **WHEN** the match has begun, no piece has been placed, and B is pressed
- **THEN** the starting player is swapped

#### Scenario: B does nothing at match-over
- **WHEN** a match has ended and B is pressed
- **THEN** nothing happens

#### Scenario: B does nothing while awaiting continue
- **WHEN** a round has ended, the match is not over, and B is pressed
- **THEN** nothing happens
