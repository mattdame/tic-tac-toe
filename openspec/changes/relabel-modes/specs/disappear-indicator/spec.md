## MODIFIED Requirements

### Requirement: Fade reflects remaining life
In fade modes (`4 PIECES FADE`, `3 PIECES FADE`), the system SHALL render each of a player's pieces with a fade level derived from its remaining life — the number of that player's placements before the piece is removed. The most recently placed piece (highest life, equal to the piece limit) SHALL be rendered at full brightness, and the fade SHALL deepen as life decreases, such that the piece with 1 placement remaining is rendered with the heaviest fade that remains readable as the piece's mark. The same life-derived fade rule SHALL apply in both `3 PIECES FADE` and `4 PIECES FADE`.

#### Scenario: Newest piece shows no fade
- **WHEN** a player places a piece
- **THEN** that piece is rendered at full brightness with no fade

#### Scenario: Fade begins before the limit is reached
- **WHEN** a player in `3 PIECES FADE` or `4 PIECES FADE` has placed fewer than their piece limit and makes an additional placement
- **THEN** each previously-placed piece is rendered slightly more faded than before, with no piece removed, and the newly placed piece is rendered at full brightness

#### Scenario: Oldest piece is most faded
- **WHEN** a piece has only 1 placement remaining before removal
- **THEN** it is rendered with the heaviest fade level and is visually distinct from every other piece

#### Scenario: Same rule for both fade modes
- **WHEN** comparing a `3 PIECES FADE` game and a `4 PIECES FADE` game
- **THEN** both use the same life-derived fade rule, with each piece fading one step per placement and the most recent piece always at full brightness

### Requirement: No indicator in solid modes or at the default limit
In solid modes (`4 PIECES SOLID`, `3 PIECES SOLID`) and at `MODE` `CLASSIC`, the system SHALL render all pieces at full brightness regardless of age.

#### Scenario: Solid mode shows identical pieces
- **WHEN** `MODE` is `3 PIECES SOLID` and pieces of different ages are on the board
- **THEN** all pieces are rendered at full brightness with no fade distinction

#### Scenario: Classic shows no fade
- **WHEN** `MODE` is `CLASSIC` and pieces are on the board
- **THEN** all pieces are rendered at full brightness with no fade distinction
