## Context

`tic-tac-toe.js` is a single MakeCode Arcade file (160×120, 16-color palette). The `MODE` option is defined by one array at line 444 — `MODES = ["5", "4E", "4H", "3E", "3H"]` — which is simultaneously the display text (`drawConfig` line 242) and the parsed data (`pieceLimit()` line 222 parses `charAt(0)`, `modeIsEasy()` line 225 checks for `"E"`). See proposal.md — Why for motivation; the mode cycle, piece limits, and fade rules are specified in the `piece-rotation` and `disappear-indicator` specs.

## Goals / Non-Goals

**Goals:**
- Make mode labels self-describing on the config panel without changing any gameplay behavior.
- Eliminate string-parsing as the source of mode semantics.
- Remove "easy/hard" from the concept and rename the helper accordingly.

**Non-Goals:**
- No gameplay, draw-rule, cycle-order, or persistence changes.
- No new modes and no config-panel layout changes beyond the label text (the row, header, and highlight remain as-is).

## Decisions

### 1. Three parallel arrays instead of a string enum
Replace the single `MODES` array with three index-aligned arrays:

```ts
let MODE_LABELS: string[] = ["CLASSIC", "4 PIECES FADE", "4 PIECES SOLID", "3 PIECES FADE", "3 PIECES SOLID"]
let MODE_PIECES: number[] = [5, 4, 4, 3, 3]
let MODE_FADES: boolean[] = [false, true, false, true, false]
```

`modeIndex` indexes all three; the cycle (`modeIndex = (modeIndex + delta + MODE_LABELS.length) % MODE_LABELS.length`, line 262) uses `MODE_LABELS.length`.

- `modeLabel()` → `MODE_LABELS[modeIndex]`
- `pieceLimit()` → `MODE_PIECES[modeIndex]` (name stays accurate)
- `modeIsEasy()` → `modeFades()` → `MODE_FADES[modeIndex]` (single call site, line 300)

Rationale: one source of truth per concern, no fragile string parsing, and matches the existing `COLORS` parallel-array style (line 445). Alternatives considered:
- **Array of objects** (`[{label, pieces, fade}, ...]`) — rejected: parallel arrays keep the diff minimal and match the file's established idiom.
- **Keep parsed labels but extend display text** (e.g. `"5 - CLASSIC"`) — rejected: still conflates display and data, and leaves the magic `indexOf("E")` behind.

### 2. "Fork C" labels — explicit piece count in the word, `CLASSIC` for mode 5
`MODE: 4 PIECES SOLID` spells out both dimensions (count + indicator) so the number's meaning is never ambiguous, while `MODE: CLASSIC` needs no count — classic tic-tac-toe *is* the 5-piece game. Rationale: a first-time player can't guess what "4" means on a bare label, and the word (`FADE` vs `SOLID`) is the part that must be legible up front because it changes the game. The count is cheap to learn by play, but self-describing labels cost nothing on this panel.

Width check: longest label is `MODE: 4 PIECES SOLID` = 20 chars ≈ 100px at the file's 5px/char font; the config panel's text area is 118px (panel 130 wide, text starts at x=12). Fits with ~18px to spare; all other labels are shorter.

### 3. `FADE`/`SOLID` as the formal concept, `CLASSIC` as the anchor name
The indicator distinction is named by what the player sees: pieces fade toward removal (`FADE`) or stay full (`SOLID`). "easy" is dropped because it overclaims — the game is identical, only the information display differs. `CLASSIC` (over `NORMAL`/`STANDARD`) is chosen because "normal" subtly implies the other modes are abnormal; "classic" reads as a distinct, familiar variant.

## Risks / Trade-offs

- **Label-width regression** — [a future font/layout change could clip `MODE: 4 PIECES SOLID`] → Mitigation: width checked at 20 chars ≈ 100px against a 118px area; confirm on-device during apply.
- **MODE_FADES[0] = false encodes "classic has no fade"** — [if a future mode needs an indicator at 5 pieces, this array must change] → Mitigation: acceptable; the array is the single definition point and mode 5 currently renders full brightness per spec.
- **Archive ordering with `add-disappearing-pieces`** — [`openspec/specs/` is empty; both changes define the same capabilities, and a MODIFIED delta needs the base requirement present at archive time] → Mitigation: archive `add-disappearing-pieces` first (locks the baseline), then archive `relabel-modes`, whose MODIFIED blocks overwrite the same requirements. If archived in the wrong order, re-run the earlier change's archive afterwards.

## Migration Plan

1. Archive `add-disappearing-pieces` so `openspec/specs/piece-rotation` and `openspec/specs/disappear-indicator` exist with the old wording.
2. Implement the code change (parallel arrays + helper renames).
3. Verify labels on-device in the MakeCode simulator (longest label fits, cycle order, `CLASSIC` default).
4. Archive `relabel-modes` to migrate the specs to the fade/solid wording.

Rollback: revert the `MODES`/helper edits; spec migration is reversible by re-archiving with prior wording.
