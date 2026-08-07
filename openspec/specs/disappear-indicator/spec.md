# disappear-indicator Specification

## Purpose

Renders each piece's age in fade modes so players can tell at a glance which piece will disappear next, using a fade that progresses one step per placement from the moment a piece is first placed.

## Requirements

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

### Requirement: Fades advance one step per placement
After any placement, the system SHALL re-evaluate every remaining piece of the moving player and re-render it one fade step deeper than before the placement. When a piece reaches 1 placement remaining it is rendered at the heaviest fade level, and the placement that would reduce it to 0 removes it instead.

#### Scenario: Surviving pieces fade one step
- **WHEN** a player makes a placement and no piece is removed
- **THEN** every surviving piece of that player is re-rendered one fade step deeper than it was

#### Scenario: Fades keep stepping at the piece limit
- **WHEN** a player is at their piece limit and places a new piece (removing the oldest)
- **THEN** the removed piece disappears and every surviving piece is re-rendered one fade step deeper

### Requirement: Fades respect player identity
Faded variants SHALL preserve the piece's shape and the player's configured color, so a faded X is still recognizable as that player's X and a faded O as that player's O.

#### Scenario: Faded piece is still identifiable
- **WHEN** a piece is rendered at any fade level
- **THEN** its mark type (X or O) and the owning player's configured color remain recognizable

### Requirement: No indicator in solid modes or at the default limit
In solid modes (`4 PIECES SOLID`, `3 PIECES SOLID`) and at `MODE` `CLASSIC`, the system SHALL render all pieces at full brightness regardless of age.

#### Scenario: Solid mode shows identical pieces
- **WHEN** `MODE` is `3 PIECES SOLID` and pieces of different ages are on the board
- **THEN** all pieces are rendered at full brightness with no fade distinction

#### Scenario: Classic shows no fade
- **WHEN** `MODE` is `CLASSIC` and pieces are on the board
- **THEN** all pieces are rendered at full brightness with no fade distinction
