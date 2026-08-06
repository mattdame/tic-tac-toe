## Purpose

Renders each piece's age in easy modes so players can tell at a glance which piece will disappear next, using a fade that maps to distance from removal rather than the configured piece count.

## ADDED Requirements

### Requirement: Fade reflects distance from removal
In easy modes (`4E`, `3E`), the system SHALL render each of a player's pieces in one of exactly three buckets based on how many of that player's placements remain before the piece is removed:

- **critical**: the piece is removed by the player's next placement (1 placement remaining) — heaviest fade, still readable as the piece's mark
- **aging**: the piece is removed by the placement after next (2 placements remaining) — medium fade
- **full**: at least 2 further placements remain before removal, or the player has not yet reached the piece limit — no fade

The bucket mapping SHALL be identical for `3E` and `4E`.

#### Scenario: Oldest piece is most faded
- **WHEN** a player has reached their piece limit and all pieces are on the board
- **THEN** the piece with only 1 placement remaining is rendered with the heaviest fade and is visually distinct from every other piece

#### Scenario: Second-oldest piece is medium faded
- **WHEN** a player has reached their piece limit
- **THEN** the piece with 2 placements remaining is rendered with a medium fade, visually distinct from both the critical piece and the full pieces

#### Scenario: Recent pieces show no fade
- **WHEN** a player has reached their piece limit
- **THEN** every piece with at least 2 further placements remaining is rendered at full brightness with no fade

#### Scenario: Same indicator for both easy modes
- **WHEN** comparing a `3E` game and a `4E` game where a piece in each has the same number of placements remaining before removal
- **THEN** those pieces are rendered with the same fade bucket

### Requirement: Fades update after each placement
After any placement (including a placement that removed an old piece), the system SHALL re-evaluate every remaining piece of the moving player and update its rendered fade to match its new bucket.

#### Scenario: Surviving pieces age one step
- **WHEN** a player at their piece limit places a new piece and an old piece is removed
- **THEN** each surviving piece of that player is re-rendered one bucket closer to critical (full → aging, aging → critical) and the critical piece is removed

### Requirement: Fades respect player identity
Faded variants SHALL preserve the piece's shape and the player's configured color, so a faded X is still recognizable as that player's X and a faded O as that player's O.

#### Scenario: Faded piece is still identifiable
- **WHEN** a piece is rendered at the critical or aging fade level
- **THEN** its mark type (X or O) and the owning player's configured color remain recognizable

### Requirement: No indicator in hard modes or at the default limit
In hard modes (`4H`, `3H`) and at `MODE` `5`, the system SHALL render all pieces at full brightness regardless of age.

#### Scenario: Hard mode shows identical pieces
- **WHEN** `MODE` is `3H` and pieces of different ages are on the board
- **THEN** all pieces are rendered at full brightness with no fade distinction

#### Scenario: Mode 5 shows no fade
- **WHEN** `MODE` is `5` and pieces are on the board
- **THEN** all pieces are rendered at full brightness with no fade distinction
