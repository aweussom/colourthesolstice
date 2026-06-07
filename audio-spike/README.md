# Audio spike

This standalone page auditions the Liquid Morphine sample set through a shared
Web Audio effects chain. It is intentionally separate from the main Colour The
Solstice runtime.

Run it from the repository root:

```powershell
python -m http.server 8765
```

Then open <http://localhost:8765/audio-spike/>.

The source WAV files were converted to 22.05 kHz mono Ogg Vorbis at quality 2:

```powershell
ffmpeg -i input.WAV -ac 1 -ar 22050 -c:a libvorbis -q:a 2 output.ogg
```

Regenerate the embedded audio and `AudioSystem` block in the main single-file
runtime after changing the spike:

```powershell
.\audio-spike\embed-audio.ps1
```

The page simulates population changes and game events while exposing the shared
low/high shelving EQ, feedback delay, generated convolution reverb, compression,
and master gain. Numbered `drone` tracks are mutually exclusive, loop three to
five times, and then evolve automatically into the next drone. The default
crossfade lasts twelve seconds and uses a cosine-shaped gain curve. White-wave
textures can play over the active drone. Rapid manual changes retire every
earlier drone, so only the deliberate outgoing/incoming crossfade can overlap.
The short reverse-drone sample is treated as a transition accent and was
time-stretched to roughly seven seconds while preserving its pitch.

## AudioSystem API

`audio-system.js` exposes `window.AudioSystem`. The spike creates one instance
as `window.solsticeAudio` for console experiments.

```js
const audio = new AudioSystem({ baseUrl: "audio-spike/audio/" });

await audio.start();
audio.setPopulation(ribbons.length);
audio.release({ seed, energy, direction });
audio.attach({ seed, energy, pan });
audio.absorb({ seed, pan });
audio.ripple({ seed, pan });
audio.percussion({ seed, energy, pan });
audio.texture({ seed, pan });
audio.impact({ seed, pan });
audio.stop();
```

Population selects one looping drone, crossfades when the density band changes,
and gradually introduces the two white-wave layers. Event sounds use decoded
audio buffers so repeated harp or transition accents can overlap. Seeded
variation controls sample choice, playback rate, and generated ripple pitch.

The drones have their own effects bus before entering the shared mix: a
7.5-second generated convolution reverb and a quiet 740 ms feedback delay. This
smears short source loops into a continuous bed without washing the event sounds
to the same degree. Automatic evolution can be paused, and crossfade duration
can be adjusted between 6 and 20 seconds in the spike.

The CinematicImpact additions are divided into short percussion, medium
textures, and long cinematic accents. Release events choose among harp,
percussion, and the long sounds, with longer or more energetic gestures making
a long accent more likely. Percussive releases rotate through all four short
sounds before repeating, while their playback rate remains seeded. Attachment
uses the long sounds as its main arrival material after the reverse transition.
Absorption can still use them at a slightly stronger level. The spike also
exposes every converted file directly for musical audition.
