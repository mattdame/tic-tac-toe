## Context

See proposal.md — Why. The game is a single-file MakeCode Arcade game (`tic-tac-toe.js`, 160×120, 16-color palette) with a live config panel (3 rows: `PLAY TO`, `X COLOR`, `O COLOR`, drawn into a 130×90 image). Board state lives in `list[9]` (0/1/2 per cell) and `markSprites[9]` (sprite per cell); placement, win, and draw checks all run in the A-button handler and `checkWinning`. Icons are regenerated per player color by `updateMarkImages()` using `image.replace`. Constraints that shape the design:

- Screen is 120px tall and the config panel already uses rows every 18px — space is the tightest constraint for config.
- No alpha blending or smooth scaling; "fade" must be pre-rendered pixel variants.
- Config can be opened mid-match, and the board is not currently reset on config changes.

## Goals / Non-Goals

**Goals:**
- Add a combined `MODE` selector (`5 → 4E → 4H → 3E → 3H`) as a single config row.
- FIFO per-player rotation: oldest piece removed on over-limit placement.
- Gate the board-full draw to `MODE 5` only.
- Fade-by-age indicator in easy modes using removal-distance buckets, identical across `3E`/`4E`.
- Keep `MODE 5` a byte-for-byte behavior match to today's game.
- Make the indicator renderer swappable so other styles (life-ring, next-only) can be tried later.

**Non-Goals:**
- No slide-to-adjacent movement (Three Men's Morris / Teeko variant) — free placement only.
- No move-cap draw (future config, not now).
- No AI opponent.
- No indicator variants beyond fade-by-age for this change.

## Decisions

### 1. Combined MODE selector as one config row
One row cycling `5 → 4E → 4H → 3E → 3H`, default `5`. Stored as a single enum value; piece limit and difficulty derived from it.

Rationale: fits the existing panel (4 rows total at ~110px, vs 5 rows that overflow 120px), removes meaningless combos (`5E`/`5H`), and matches the player's stated preference. Alternatives considered: two independent rows (`PIECES` + `EASY/HARD`) — rejected for space and dead combos.

Config panel: grow `drawConfig` from 130×90 to ~130×110, add a `MODE` row, bump `configIndex` cycle from `% 3` to `% 4`. Values display as `5`, `4E`, `4H`, `3E`, `3H`.

### 2. Per-player FIFO queues keyed by board position
Add `queues: {1: number[], 2: number[]}` holding board cell indices in placement order (oldest first). Cleared in `resetBoard`. A piece's "life" is derived from its index in the queue:

```
life(i) = queue.length - i   (0-based i; oldest has life 1 at full queue)
```

Rationale: the board cell (not the sprite) is the stable identity, and removal is trivially `queue.shift()` → clear `list[cell]`, destroy `markSprites[cell]`. Alternatives: store sprites directly — rejected, positions keep board logic (`list`, `checkWinning`) single-source.

### 3. Placement flow with rotation
In the A-button handler, before placing when `MODE` number < 5:

```
if queues[turn].length == N:
    oldest = queues[turn].shift()
    list[oldest] = 0; markSprites[oldest].destroy()
place at cursor; push cursor; mark sprite
refreshFades(turn)
checkWinning(turn)   // on final board state
switch turn
```

Rationale: check win after removal+placement so the final board is evaluated (per spec). At `N == 5` the removal branch is unreachable (a game ends before a 6th placement), so it can stay in the code path or be guarded — either is behaviorally identical.

### 4. Draw gating
`checkWinning`'s board-full loop only declares a draw when the MODE number is `5`; otherwise a no-win board simply continues.

### 5. Fade buckets mapped to removal distance, not piece count
Three buckets — **critical** (life 1, heaviest fade), **aging** (life 2, medium), **full** (life ≥ 3 or queue not yet full). Same mapping for `3E` and `4E`, so the indicator reads identically regardless of N and only 2 fade variants are needed per player.

Rationale: a linear per-N fade would give small adjacent steps at `N=4` (blurring "next to go" vs "one safe") and spend visual resolution on pieces that don't matter. Distance-bucketing keeps the critical→aging→full contrast large and constant. See disappear-indicator spec for the exact rules.

### 6. Fade variants via dither masking, generated at runtime
For each player color, generate full / aging / critical icon images. Faded levels are produced by punching deterministic holes in the icon (checker/pattern) using `image` pixel access, keeping shape and color intact so the mark stays identifiable. Extended from `updateMarkImages()` so color changes regenerate all variants. A `fadeLevel(sprite)` swap via `setImage` applies the current bucket.

Rationale: the 16-color palette has no reliable "darker shade" per player color, and MakeCode has no per-sprite alpha; pixel-hole dithering is the only robust cross-color approach. Alternatives: palette dimming (unreliable per color), `setScale` shrink (not smooth, and shrink was a separate option not chosen).

### 7. MODE changes reset the current board
Changing `MODE` calls `resetBoard()` (clears queues, marks, board) but preserves `Xscore`/`Oscore`/`winTarget`, matching the spec requirement. Color and `PLAY TO` changes keep today's live behavior.

### 8. Indicator renderer behind a swappable seam
Fade application is isolated (a single "apply indicator" function plus per-style variant generation). Later styles (life-ring ticks, next-only pulse) would replace only these, per the player's intent to A/B effects.

## Risks / Trade-offs

- **Most-faded piece must stay readable** — [Critical bucket could get too dim to read as X/O] → Mitigation: pin critical to a floor (e.g. ~50% pixel coverage); verify on-device and adjust the dither pattern.
- **Panel space is tight** — [4-row panel at 110px leaves little headroom; footer text could crowd] → Mitigation: tighten row spacing if needed; the screen is 120px so ~5px margins remain.
- **Never-ending games at N<5** — [Win-only play can loop if both players defend] → Mitigation: accepted for now (see proposal/specs); a move-cap draw is a known future config, and the draw gate is centralized in one place.
- **Fade legibility at 4 pieces** — [8 faded marks compete for attention at `4E`] → Mitigation: distance-buckets keep only 2 faded pieces per player at any time; the rest stay full.

## Migration Plan

Single file, no data to migrate. `MODE` defaults to `5`, so existing behavior (and any saved preferences) is unchanged until the player changes it. Rollback = revert the MODE value to `5`.
