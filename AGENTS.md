# Repository Guidelines

## Project Identity

The game is titled **Colour The Solstice**. Preserve this capitalization and the British spelling of “Colour” in UI text, documentation, metadata, and deployment configuration.

## Project Structure & Module Organization

This repository contains a directly runnable visual spike and reference content for the June Solstice Game Jam:

- `index.html`: self-contained native-WebGL prototype; double-click to run.
- `README.md`: current project overview, interaction, and architecture.
- `PLAN.md`: historical scope and success criteria for the first spike.
- `DEVLOG.md`: chronological design decisions and material for the DEV article.
- `dev-to/JUNE-SOLSTICE-JAM.md`: challenge announcement, prompt, judging criteria, prizes, and dates.
- `dev-to/JUNE-SOLSTICE-JAM-FAQ.md`: participation rules, submission guidance, eligibility, and prize details.

Keep DEV-facing Markdown in `dev-to/`. Preserve the single-file launch experience during the spike. Split runtime code into `src/` only when the implementation becomes difficult to maintain or a dependency makes it necessary.

## Build, Test, and Development Commands

There is no package manifest, server, or build step. Open `index.html` directly in a current browser. For development with browser caching disabled, an optional static server is sufficient:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. Documentation checks:

```powershell
npx markdownlint-cli2 "**/*.md"
```

The lint command requires Node.js and downloads or uses `markdownlint-cli2`; do not assume it is available in offline environments. If JavaScript tooling is introduced, define canonical commands in `package.json` (`npm run dev`, `npm test`, `npm run lint`) and document them here.

## Coding Style & Naming Conventions

Write concise Markdown with one top-level heading per document, descriptive sentence-case headings, blank lines around headings and lists, and fenced code blocks with language identifiers. Use UTF-8 and preserve intentional punctuation and terminology such as `DEV++`, `Juneteenth`, and `LGBTQIA+`.

Existing filenames use uppercase kebab-case for event documents. Follow that pattern for related files, for example `JUNE-SOLSTICE-JAM-RULES.md`. Prefer relative links between repository documents.

## Project Style

New work should reflect the style established across the author's other browser projects:

- Prefer browser-native HTML, CSS, and JavaScript for behavior that can be implemented directly to equal quality. Libraries are welcome when they are an unusually strong fit or provide specialized capabilities such as 3D, physics, audio, or advanced rendering.
- Begin with a familiar game or utility, then give it one distinctive mechanical or technical idea rather than adding unrelated features.
- Use computation to improve fairness: solvable generation, smart setup, visible state, forgiving controls, hints, undo, and graceful recovery.
- Design touch-first and keep interactions direct. Make valid actions, consequences, and system state readable without lengthy instructions.
- Keep data and persistence local where practical. Favor static hosting, offline operation, privacy, and user ownership.
- Let visual treatment support the subject: expressive gradients, glow, and motion for games; restrained, content-first UI for tools.
- Preserve Norwegian language, cultural references, humor, and memorable naming when they give the project character.

Do not reject a dependency on principle. Compare it against a direct implementation by visual quality, interaction quality, complexity, maintenance cost, payload, and licensing. Use the library when it is clearly better; otherwise keep the implementation local and understandable.

Avoid unnecessary infrastructure, opaque mechanics, generic product styling, and feature accumulation that weakens the central interaction. Prototype simply, but split large single-file implementations once their state machines and algorithms become difficult to verify.

## Testing Guidelines

No automated tests or coverage requirements exist. Manually verify heading hierarchy, list rendering, links, dates, eligibility language, and consistency between the announcement and FAQ. Run a Markdown linter when available.

## Commit & Pull Request Guidelines

Git history is not present in this workspace, so no established commit convention can be inferred. Use short, imperative commit subjects, such as `Clarify team submission rules`.

Pull requests should summarize the change, identify affected documents, link the relevant issue or source, and note verification performed. Include screenshots only when rendered formatting changes materially. Keep factual updates narrowly scoped and call out changes to dates, prizes, eligibility, or official rules.
