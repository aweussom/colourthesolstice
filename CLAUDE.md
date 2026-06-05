# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Colour The Solstice** — a scoreless psychedelic creation toy for the browser, built for the DEV June Solstice Game Jam. Always preserve this exact title capitalization and the British spelling of "Colour" in UI text, docs, metadata, and config.

`AGENTS.md` contains the full repository guidelines; the essentials are summarized here.

## Commands

There is no package manifest, build step, or test suite. The entire game is one self-contained file:

- **Run:** open `index.html` directly in a browser (double-click works; no server needed).
- **Dev server (optional, to avoid caching):** `python -m http.server 8000`, then open `http://localhost:8000`.
- **Markdown lint:** `npx markdownlint-cli2 "**/*.md"` (requires Node.js; may be unavailable offline).

Preserve the single-file launch experience. Only split runtime code into `src/` if the implementation becomes hard to maintain or a dependency requires it. If JS tooling is ever introduced, define canonical commands in `package.json` and document them.

## Architecture

Everything lives in `index.html`: CSS, markup, GLSL shaders (template strings), and plain JavaScript in one IIFE. The rendering pipeline is a three-layer composite:

1. **Offscreen Canvas 2D (`scene`)** — draws stars, swimming creatures, particles, and gesture previews with additive blending. This is uploaded each frame as the `u_scene` texture.
2. **WebGL feedback loop (`#gl` canvas)** — two alternating ping-pong framebuffer textures. The *feedback* fragment shader warps, rotates, fades, and hue-shifts the previous frame, then adds the fresh scene (MilkDrop-style). The *copy* shader tone-maps the result and adds a drifting rainbow nebula.
3. **Foreground overlay (`#overlay` canvas)** — Yggdrasil (trunk, roots, branches) and settled vines, drawn crisp *outside* the feedback loop. This separation is deliberate: feeding the monument into the feedback shader caused it to bloom into a grey blob. Keep the tree on the overlay.

Key runtime systems (all in the single `<script>` block, roughly top to bottom):

- **`SETTINGS`** (near the top) — centralized tuning constants for feedback decay/zoom/rotation/warp, creature cap, star count. Tune here, not inline.
- **Gesture interpretation** — pointer events record duration, distance, direction, and speed; `spawnCreature()` maps these to body length/thickness, heading, spiral handedness, energy, and colour. The player *influences* creation but never places objects directly — preserve this principle.
- **Creature → vine lifecycle** — creatures swim toward the tree; `attach()` does occupancy-aware placement (`openAttachmentStart`, `chooseAttachmentPlacement`) so beings spread instead of clumping; `updateRibbons()`/`drawLivingRibbon()` morph segments progressively from swimming pose onto the tree. Attached beings stay alive (breathing, waving, slow migration, absorption of older beings) — never replace a swimmer abruptly with static geometry.
- **Tree growth** — decoupled from attachment count: each arrival raises a growth target and the tree eases toward it continuously (no discrete jumps).
- **Save/replay/export** — gesture sequences persist to `localStorage` (`colour-the-solstice:creation`); replay uses `seededRandom()` for determinism at selectable speeds; PNG export composites the canvases. Video export is intentionally out of scope.

## Design Constraints

- No score, timer, failure, end state, or correct way to play. Every action should have a pleasing consequence.
- Prefer browser-native HTML/CSS/JS; use a library only when it is clearly better for a specialised capability (3D, physics, audio), judged on quality, complexity, payload, and licensing — not rejected on principle.
- Touch-first, direct interaction; state must be readable without instructions.
- Local persistence, static hosting, offline operation.
- Preserve successful visual accidents (especially Yggdrasil's slow luminous breathing cycle).

## Documentation

- `README.md` — current experience and architecture; keep it in sync with behavior changes.
- `DEVLOG.md` — chronological design decisions; it feeds the eventual DEV article. **Every code change made via Claude Code must be logged here**: append what changed and why, in the document's existing narrative prose style (no timestamps or bullet-dump changelogs).
- `PLAN.md` — historical first-spike plan; do not update for new work.
- `dev-to/` — jam announcement and FAQ. DEV-facing Markdown stays here; event docs use uppercase kebab-case names (e.g. `JUNE-SOLSTICE-JAM-RULES.md`). Preserve intentional terminology such as `DEV++`, `Juneteenth`, `LGBTQIA+`.

Markdown style: one top-level heading per document, sentence-case headings, blank lines around headings/lists, fenced code blocks with language identifiers.

## Commits

Short, imperative subjects (e.g. `Clarify team submission rules`). Call out changes to dates, prizes, eligibility, or official rules in jam documents.
