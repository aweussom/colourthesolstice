# Colour The Solstice: First Spike

> Historical note: this document records the original proof-of-concept plan.
> The project has moved beyond the spike. See [`README.md`](README.md) for the
> current experience and architecture, and [`DEVLOG.md`](DEVLOG.md) for its
> development journey.

## Purpose

Prove that the central interaction is visually satisfying before building the full cosmic tree. This spike is successful when repeated clicks or touches create an entrancing colourscape without scoring, instructions, failure, or an end state.

## Experience

The screen opens directly onto a deep star field with a young luminous Yggdrasil at its centre. Each pointer gesture releases one segmented rainbow creature. It swims in a loose corkscrew toward the tree, leaves a persistent psychedelic trail, then gradually becomes a living vine along its trunk, branches, or crown.

The player influences rather than places:

- A tap creates a balanced default creature.
- Press duration and stroke distance affect body length and thickness.
- Stroke direction supplies the creature's initial heading and spiral direction.
- Stroke speed changes its energy, swimming speed, colour cycling, and movement character.

The system interprets every gesture and produces a reliably pleasing attachment.
Each attachment raises Yggdrasil's growth target; trunk, roots, and branches ease
toward that target continuously rather than changing size in discrete steps.
The tree itself keeps a slow high-brightness breathing cycle. Attached beings
move faster as translucent rainbow smoke, giving the ancient structure and its
new growth distinct rhythms.

## Technical Approach

The spike is implemented as one directly clickable `index.html`. It uses native
WebGL for the feedback shader and an off-screen Canvas 2D scene for stars,
creatures, particles, and monument geometry. This avoids a server requirement
while preserving the intended GPU feedback technique.

- Two alternating framebuffer textures provide frame feedback.
- A full-screen fragment shader warps, rotates, fades, and hue-shifts the previous frame.
- Additive Canvas 2D drawing supplies glow and lightweight scene geometry.
- A segmented point chain renders each creature.
- Plain JavaScript manages movement, lifecycle, and ribbon attachment.

Keep shader parameters centralized for rapid tuning.

## Implementation Steps

1. Create a full-screen responsive Three.js scene with camera, resize handling, and device-pixel-ratio cap.
2. Add three star layers with different depth, size, drift, and twinkle rates.
3. Render Yggdrasil as growing organic trunk, root, and branch geometry.
4. Spawn one rainbow creature on pointer input.
5. Move its head using attraction plus orbit and curl forces; let trailing segments follow with damping.
6. Add ping-pong feedback with adjustable decay, zoom, rotation, distortion, and hue drift.
7. When the creature reaches Yggdrasil, morph its existing body into a persistent animated vine without an abrupt visual replacement.
8. Add bloom and tune colours, speed, trail persistence, and motion.
9. Verify mouse and touch behavior on desktop and mobile-sized viewports.

## Spike Structure

```text
index.html
```

The full project may move to Three.js if the next stage needs true 3D geometry,
post-processing passes, cameras, or more sophisticated materials.

## Scope Boundaries

Do not add wreaths, flowers, multiple creature species, procedural music, saving, menus, text UI, progression, or finished monument rules during this spike. Do not reproduce MilkDrop presets or use Butterchurn. Implement only the feedback technique needed for this visual identity.

## Success Criteria

- First interaction requires no explanation.
- Ten consecutive releases remain visually distinct and attractive.
- Creatures feel organic rather than like guided projectiles.
- Trails enrich the scene without turning it into uniform brightness.
- Attached ribbons remain readable against ongoing feedback.
- The animation stays smooth on a typical phone and desktop browser.
- The result already communicates stars, rainbow light, gentle creation, and psychedelic motion.

## Exit Decision

If the loop is satisfying, proceed to the construction grammar for the crossbar, wreaths, foliage, flowers, and continuous monument motion. If it is not, iterate on movement and feedback before expanding scope; additional content will not repair an unconvincing core gesture.
