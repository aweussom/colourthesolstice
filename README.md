# Colour The Solstice

**Colour The Solstice** is a scoreless psychedelic creation toy for the browser.
Touch or sweep a star field to release rainbow beings. They swim toward a young
cosmic Yggdrasil, then gradually become living, smoky vines along its trunk and
branches. There is no failure, timer, final state, or correct way to play.

The project is being created for the DEV June Solstice Game Jam. Its main
references are *flOw*, MilkDrop/Winamp visualisations, Jeff Minter's psychedelic
games, and *Townscaper's* limited-but-generative interaction.

## Run

Double-click `index.html` and open it in a current browser. No installation,
server, build step, or network connection is required.

An optional development server can be started with:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Interaction

- **Tap:** create a balanced default being.
- **Hold or make a long stroke:** create a longer, thicker being that prefers
  wrapping the trunk itself.
- **Stroke direction:** influence launch direction and spiral handedness.
- **Stroke speed:** influence energy, swimming speed, movement, and colour.

The player influences creation but never places an object directly. Yggdrasil
interprets every arrival and finds a place for it.

## Current Experience

- Layered, drifting stars with slow hue and brightness cycling.
- Native-WebGL framebuffer feedback inspired by MilkDrop.
- Gesture-generated segmented creatures with persistent psychedelic trails.
- A continuously growing Yggdrasil with trunk, roots, asymmetric branches,
  forks, twigs, and hanging tendrils.
- Gradual creature-to-vine morphing instead of abrupt replacement.
- Attached beings that remain alive as pulsing, translucent rainbow smoke.
- Settled beings spread slowly toward open, brighter branch regions instead of
  clumping at fixed attachment points.
- Approaching beings encourage Yggdrasil to grow toward them before landing.
- Slow luminous breathing in the tree itself.
- Continuing organic root growth, with energy flowing inward and up the trunk.
- A diffuse background nebula that moves through rainbow colours.
- Restrained spontaneous births after a period of inactivity.
- Older attached beings can be absorbed by newer ones, transferring a brief glow.
- Crowded clusters resolve themselves: a later arrival eats the eldest being,
  which flashes and falls like a leaf; the roots consume it and send a ripple
  of its colour up through the trunk.

## Save, Replay, and Export

The lower-right controls preserve a creation without interrupting play:

- **Save** stores the gesture sequence in browser storage.
- **Replay** regrows Yggdrasil and recreates the saved gestures.
- **0.5x**, **1x**, and **2x** set replay speed.
- **PNG** exports the current composition.

Browser-native video export is being treated as optional. PNG and deterministic
replay are more portable and reliable than promising MP4 support across
browsers.

## Architecture

Everything currently lives in one directly clickable `index.html`.

- **Canvas 2D scene:** stars, creatures, particles, and gesture previews.
- **Native WebGL:** two alternating framebuffer textures retain and distort
  previous frames.
- **Fragment shaders:** feedback warp, rotation, fading, hue drift, tone
  mapping, and diffuse rainbow atmosphere.
- **Foreground canvas:** keeps Yggdrasil and settled vines crisp while the
  surrounding colourscape feeds back recursively.
- **Plain JavaScript:** gesture interpretation, movement, growth, attachment,
  replay, and ecosystem behavior.

The project is not opposed to libraries. A library should be used when it
provides clearly better specialised capabilities; direct browser code is
preferred when it reaches equal quality with less machinery.

## Design Principles

- Creation matters more than competition.
- Every action should have a pleasing consequence.
- Keep control limited but expressive.
- Let the world remain alive when untouched without taking authorship away.
- Preserve successful visual accidents.
- Add technical complexity only when it improves beauty or interaction.

## License

[MIT](LICENSE).

## Project Notes

- [`PLAN.md`](PLAN.md) preserves the original first-spike plan.
- [`DEVLOG.md`](DEVLOG.md) records the project's evolving ideas, experiments,
  decisions, and useful material for the eventual DEV article.
- [`dev-to/`](dev-to/) contains the competition announcement and FAQ.
