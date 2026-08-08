## Purpose

Announces round and match results in the center banner — who won a round, who won the match, and draws — using winner-identifying fill colors and readable text, and controls which result splash screens are shown.

## ADDED Requirements

### Requirement: Round-over banner names the winner

When a round ends, the center banner SHALL display `X WINS`, `O WINS`, or `DRAW` in place of any generic game-over text. The winner is the player who completed the winning line; a draw is shown when the round ends with no winner.

#### Scenario: X wins a round
- **WHEN** a round ends because X completed a winning line
- **THEN** the banner displays `X WINS`

#### Scenario: O wins a round
- **WHEN** a round ends because O completed a winning line
- **THEN** the banner displays `O WINS`

#### Scenario: Round ends in a draw
- **WHEN** a round ends with no winning line (placement cap or full board)
- **THEN** the banner displays `DRAW`

### Requirement: Winner banner uses the winner's color

The round-over banner's fill color SHALL be the winning player's configured color, so the box color identifies the winner at a glance.

#### Scenario: X's color fills the banner
- **WHEN** a round ends with X as the winner
- **THEN** the banner box is filled with X's configured color

#### Scenario: O's color fills the banner
- **WHEN** a round ends with O as the winner
- **THEN** the banner box is filled with O's configured color

### Requirement: Draw banner uses a fixed neutral color

The draw banner's fill color SHALL be a fixed color that is not among the selectable player colors `[1..10]`, so a draw is never confusable with a player's color.

#### Scenario: Draw uses the neutral color
- **WHEN** a round ends in a draw
- **THEN** the banner box is filled with the fixed neutral color and not with either player's configured color

### Requirement: Banner text contrasts with its fill

The banner text color SHALL be chosen for legibility against the box fill — white text on dark fills, black text on light fills — for every player color the config allows.

#### Scenario: Dark fill uses white text
- **WHEN** the banner box is filled with a dark color (e.g. blue or purple)
- **THEN** the banner text is white

#### Scenario: Light fill uses black text
- **WHEN** the banner box is filled with a light color (e.g. white or yellow)
- **THEN** the banner text is black

### Requirement: Match-over banner names the match winner

When a match ends, the center banner SHALL display `X WINS MATCH` or `O WINS MATCH`, identifying the player who reached the win target, in place of any generic game-over text.

#### Scenario: X wins the match
- **WHEN** a match ends because X reached the configured win target
- **THEN** the banner displays `X WINS MATCH`

#### Scenario: O wins the match
- **WHEN** a match ends because O reached the configured win target
- **THEN** the banner displays `O WINS MATCH`

### Requirement: Round-result splash is removed

The round-result splash (`Player 1 (X) Won!`, `Player 2 (O) Won!`, `CAT / DRAW!`) SHALL NOT appear after a round ends. The match-over splash (`Player 1 Wins the Match!`) SHALL still appear when a match ends.

#### Scenario: No splash after a round
- **WHEN** a round ends (win or draw) and the match is not over
- **THEN** no result splash is shown and the banner displays the round result

#### Scenario: Match splash still shows
- **WHEN** a match ends because a player reached the win target
- **THEN** the match-over splash appears and the banner displays the match winner
