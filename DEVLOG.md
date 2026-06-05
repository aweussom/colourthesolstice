# Colour The Solstice: Development Log

## Origin

The project began as an entry for the DEV June Solstice Game Jam. Winning was
not the primary goal; the motivation was to create something visually pleasing
and personally interesting.

The initial references were:

- *flOw* on PlayStation 3: low-control aquatic movement, growth, and trance.
- Psychedelic Amiga-era games and Jeff Minter's visual style.
- MilkDrop/Winamp visualisations: recursive colour, trails, and feedback.
- *Townscaper*: limited input that reliably produces attractive results.
- Swedish midsummer traditions and the June solstice.

The working idea was a scoreless construction toy. Touches release colourful
whirling beings into a star field. They travel organically toward a central
structure and become part of an accumulating colourscape. There is no start,
failure, score, completion state, or correct way to play.

The title became **Colour The Solstice**.

## Technical Direction

The first plan considered Three.js. The project is not opposed to libraries:
use one when it provides a clearly better specialised capability, but implement
ordinary browser logic directly when the result is equally good.

Because the first spike needed to work by double-clicking one file, it used
native WebGL and Canvas 2D inside a self-contained `index.html`:

- WebGL ping-pong framebuffers create MilkDrop-like feedback.
- A fragment shader warps, fades, rotates, and hue-shifts previous frames.
- Canvas 2D draws stars, creatures, particles, and crisp foreground geometry.
- No server, build step, or external dependency is required.

An early render fed the static centrepiece back through the shader. It bloomed
into a large grey capsule. The fix was to separate the structure onto a crisp
foreground canvas while keeping stars, creatures, and particles in the
feedback loop.

## Interaction Evolution

The first version spawned a fixed creature on every click. Gesture creation was
then added:

- Tap creates a balanced default being.
- Hold duration and stroke distance affect length and thickness.
- Drag direction determines launch direction and spiral handedness.
- Drag speed affects energy, swimming speed, wiggle, and colour cycling.

A glowing curve previews the gesture. The system still interprets the input;
the player influences rather than places.

## From Maypole to Yggdrasil

The original centrepiece was a rainbow Swedish maypole. In practice, the
horizontal branch made it read too strongly as a cross. The concept changed to
**Yggdrasil**, which better supports organic growth and the cosmic setting.

The structure became:

- A slowly swaying, tapering trunk.
- Asymmetric upward-curving branches and forks.
- Growing roots.
- Hanging tendrils from mature branch tips.
- A slow high-brightness breathing cycle.

Tree growth was initially tied directly to the number of attachments, causing
branches to jump into existence. Visual growth is now decoupled from count:
each arrival raises a target, and the tree eases toward it over time.

## Living Attachments

The first attachment replaced a moving creature immediately with a clean
mathematical helix. This was abrupt, and the result was less alive than the
swimmer.

The replacement system preserves each body:

- Segments morph progressively from their swimming pose onto trunk or branch.
- Colours and body proportions survive attachment.
- Original gesture length continues to influence the settled creature's reach.
- Settled beings continue breathing, waving, and growing small fronds.
- Multiple translucent displaced layers create an aurora/smoke quality.
- Occupancy-aware placement and slow outward migration reduce branch clumping.
- Incoming creatures stimulate tree growth, while attachment is restricted to
  limbs already large enough to catch them.

The intended result is a living ecosystem on Yggdrasil, not static decoration.

## Preservation and Ecosystem

The later development pass added:

- Save and replay of gesture sequences at selectable speeds.
- PNG capture for creations the player wants to keep.
- A slowly colour-shifting rainbow nebula behind the stars.
- Stars that cycle subtly in hue and brightness.
- Organic roots that continue growing and feed visible light upward.
- Restrained spontaneous creature births after inactivity.
- Older attached beings being absorbed by newer ones, causing a temporary glow
  and preventing unlimited visual clutter.

Browser-native MP4 export was considered, but PNG and replay are the first
priority because video encoding support and output formats vary by browser.

## Refining Attachment and Flow

Development tooling switched from codex-cli to Claude Code running Opus 4.8 at
this point. A playtesting pass surfaced four observations: beings still
settled in empty space above the tree, the loops around Yggdrasil read as
edgy rather than smoky, the moment of attachment was too abrupt, and the
branches clumped while the trunk stayed bare — with the suggestion that long
draws could aim for the trunk.

A persistent bug had beings settling in empty space above the young tree. The
cause was a mismatch between simulation and drawing: attachment positions were
mapped onto the monument's full eventual height, while the trunk was only drawn
up to its current growth. Trunk placements, and the heights creatures aim for,
are now clamped to the visibly grown trunk, so early arrivals wrap the actual
tree. A pleasant side effect is that trunk-attached vines ride upward as the
tree grows beneath them.

The settled loops also looked segmented rather than smoky, because the helix
was sampled at the swimming body's point count — too coarse for several turns.
The helix is now sampled independently and more densely, the swimming pose is
interpolated between its original points, and an extra wider smoke layer with
deeper billow softens the result.

The moment of attachment was still abrupt. Three changes let bodies flow onto
Yggdrasil: the morph easing now starts and ends softly instead of snapping, the
settle takes about a second longer, and — most importantly — the body keeps
swimming toward its landing point while it melts onto the tree, so the tail
glides in instead of freezing mid-water. A fading head halo carries the
swimmer's glow into its settled life.

Placement was rebalanced at the same time. Branches clumped at their tips while
the trunk stayed bare, so tip-seeking and outward migration were softened, the
crowding penalty strengthened, and long gestures now carry enough body to
prefer embracing the trunk itself.

Deployment note: GitHub Pages ran the repository through Jekyll, which failed
on the literal Liquid embed syntax DEV's jam FAQ quotes as documentation. A
`.nojekyll` file now disables Jekyll entirely; the game is static files and
needs no build.

## Clumps Feed the Roots

Live playtesting after deployment showed branches still collecting stacked
beings while the rest of the tree stayed calm. Rather than pushing placement
parameters further, crowding became part of the ecosystem's story: when a
clump persists, a later arrival eats its eldest member. The eaten being
flashes, detaches, and drifts loose down toward the base of the tree, where
the roots consume it in a burst of light — the energy pulses that already
flow through root and trunk briefly surge brighter and larger, then settle
back to normal. Crowding now resolves itself with a small narrative beat
instead of a tuning constant, and the light a being arrived with visibly
returns to the tree that hosted it.

The roots themselves also grew too slowly, trailing the crown they were meant
to anchor. They now lead the tree's growth instead of following it.

## Design Principles

- Creation matters more than competition.
- Every interaction should have a pleasing consequence.
- Control should remain limited but expressive.
- The world should remain alive when untouched, without taking authorship away.
- Technical complexity must produce visible beauty or better interaction.
- Preserve successful accidents, especially Yggdrasil's slow luminous cycle.
