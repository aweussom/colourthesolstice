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

A second playtest sharpened the imagery. The first fall pulled every point of
the dying body exponentially toward the base, so it collapsed into a blob and
dropped too fast to register. The descent is now a slow leaf-fall: the whole
body rocks side to side as it sinks over many seconds, staying bright most of
the way down. The consumption also changed character. Brightening the existing
energy pulses read as a vague blink; instead, each consumed being now sends a
ripple of its own coloured light from the root tips inward and then up the
trunk toward the crown — in the spirit of the bioluminescent forest in
*Avatar*, where touched light travels visibly through the network.

## Possible Futures: Trees in Competition

A re-read of the author's earlier RTS experiment *XBattle — Galcon Fusion*
suggested a thought experiment, recorded here strictly as a *could*, not a
*should*. Trees are, after all, in competition.

Colour The Solstice could one day host two or more Yggdrasils sharing a sky,
and several of XBattle's mechanics translate surprisingly directly into
garden terms:

- Its planet economy — production capacity, decay above a threshold, an
  overstretch penalty for holding too much — is already half-present here:
  clump die-off *is* decay above capacity.
- Siege suppression could become shading: a taller crown slows a rival's
  growth wherever it overshadows it.
- The desperation bonus (XBattle's losing players produce double) fits a
  gentle world: a struggling tree's beings would glow brighter and settle
  faster, so nobody's garden ever feels dead.
- The concerted-attack window (waves arriving together outperform a trickle)
  could reward rhythmic play: beings released in close succession establish
  a new branch faster than the same beings released one by one.
- Supply routes could become shared root networks between groves, with the
  consumption ripples already in the game carrying the traffic.

Control would stay indirect — call it reverse bonsai. A bonsai artist prunes
toward a shape; here the player would *feed* toward one. Gestures already
carry direction, length, and energy, and those could bias where a tree
invests its growth without ever becoming commands. The tree keeps
interpreting.

None of this is planned for the jam. The scoreless toy is the project. But if
a competitive mode ever happens, it should be grown out of these existing
mechanics rather than bolted on.

## Capturing the Whole Colourscape

The first PNG button accidentally captured only the foreground canvas. WebGL's
drawing buffer was not preserved after presentation, so by the time a separate
2D canvas tried to copy it, the psychedelic background could already be gone.
The result was still useful: a transparent Yggdrasil makes an excellent article
asset. Export now makes both intentions explicit. Scene PNG composites WebGL
and the foreground immediately after a rendered frame, while Tree PNG preserves
the transparent foreground-only version.

Replay speed had a similar mismatch between interface and implementation. The
selector changed only the delays between creature births; once born, every
being still swam and grew the tree at normal speed. Replay now has a virtual
clock that scales event timing, movement, morphing, and growth together, using
small simulation steps at higher speed to keep the ecosystem stable.

The same frame-synchronous composite canvas also made browser-native recording
practical without asking WebGL to preserve every drawing buffer. Record captures
the clean composition as WebM or MP4 through `MediaRecorder`, depending on the
browser. It remains deliberately silent: screen recording is still the better
fallback when the submission video needs narration, editing, or browser chrome.

## Growing a Soundbed

The first audio experiment stays outside the main runtime while its musical
rules are still being discovered. A small Liquid Morphine set was reduced to
22.05 kHz mono Ogg files, making twelve source sounds roughly half a megabyte
without giving up the single-download character of the toy.

The useful result was not a conventional playlist. Numbered drones form one
slowly crossfading bed, while white-wave textures can gather above it as the
settled population grows. Harps became repeatable release accents, the stretched
reverse drone became a lifecycle transition, and a generated rising tone follows
the same root-to-crown path as a consumption ripple. EQ, echo, and reverb belong
to the state of the ecosystem rather than to a fixed mix.

That experiment is now a small event-driven `AudioSystem`. It accepts release,
attachment, absorption, ripple, and population changes, with seeded variation
where replay will eventually need it. Keeping the system behind those events
lets the soundbed mature in isolation before the game takes on audio startup,
mute persistence, recording, and lifecycle concerns.

A second audition added a CinematicImpact family. The short knocks, metal
strikes, and blunt hits work as percussive alternatives to the two harps. The
medium string and ridged textures give arrivals a less predictable edge. More
surprisingly, all four long cinematic sounds sat comfortably inside the
crossfading drones instead of overwhelming them.

Those long sounds therefore belong to ordinary creation, not only rare dramatic
events. Attachment now places one after the reverse-drone approach, while a long
or energetic release has an increased chance of carrying one into the world.
Absorption may still use a slightly stronger version. A full audition against
the running soundbed confirmed that all ten additions fit, so the division into
percussion, texture, and long accent is now part of the working design rather
than a temporary sorting guess.

Repeated releases exposed one small musical rule: random selection can repeat
the same short hit often enough to sound mechanical. Percussive releases now
rotate through all four short sounds before repeating, while seeded playback
rate still gives each pass some variation.

The drones needed a different treatment from the event sounds. Four-second
crossfades made their short source loops announce every change, even when the
samples themselves belonged together. Each drone now repeats three to five
times before moving automatically to the next, with a twelve-second
cosine-shaped crossfade. A separate long convolution space and quiet feedback
echo smear the loop boundaries without putting the same enormous reverb on
harps, impacts, and ripples. This produced continuity without committing to
offline reversal or granular synthesis before those heavier techniques are
actually needed.

With the spike sounding coherent, the audio system moved into the actual toy.
All twenty-two mono Ogg files are Base64 data URIs inside `index.html`, keeping
the project directly clickable, offline, and self-contained at a little over
one megabyte. A small regeneration script keeps that generated block tied to
the audition sources rather than turning it into an opaque hand-edited blob.

The integration follows the beings' existing lifecycle. Player releases choose
seeded accents; attachment brings the reverse approach and a long arrival;
crowding or replacement triggers absorption; and the root consumption moment
launches the rising ripple tone. Settled population changes the drone and
white-wave density. Ambient births remain quiet so the world can stay alive
without sounding as though it is playing itself.

Audio starts only after a player gesture, and a remembered Sound control can
mute the master without dismantling the soundbed. Replay reuses creature seeds,
so its audible variation follows the recorded creation. Browser-native
recording now combines the canvas stream with a cloned Web Audio output track;
the OS or browser recorder remains the fallback for narration and editing.

## Design Principles

- Creation matters more than competition.
- Every interaction should have a pleasing consequence.
- Control should remain limited but expressive.
- The world should remain alive when untouched, without taking authorship away.
- Technical complexity must produce visible beauty or better interaction.
- Preserve successful accidents, especially Yggdrasil's slow luminous cycle.
