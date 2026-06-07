(() => {
  "use strict";

  const DEFAULT_SOUNDS = {
    drones: [
      "drone1.ogg", "drone2.ogg", "drone3.ogg", "drone4.ogg",
      "drone5.ogg", "drone6.ogg", "drone7.ogg"
    ],
    waves: ["white-wave.ogg", "white-wave2.ogg"],
    harps: ["harp1.ogg", "harp2.ogg"],
    transition: "reverse-drone.ogg",
    percussion: [
      "percussion-bash-1.ogg",
      "percussion-bash-2.ogg",
      "percussion-knock.ogg",
      "percussion-tibetan-slam.ogg"
    ],
    textures: [
      "texture-core-string.ogg",
      "texture-ridged-runner.ogg"
    ],
    impacts: [
      "impact-reflex.ogg",
      "impact-roll-off.ogg",
      "impact-grate.ogg",
      "impact-cycle-down.ogg"
    ]
  };

  class AudioSystem {
    constructor(options = {}) {
      this.baseUrl = options.baseUrl || "audio/";
      this.assets = options.assets || null;
      this.sounds = options.sounds || DEFAULT_SOUNDS;
      this.crossfadeSeconds = options.crossfadeSeconds || 12;
      this.autoDrones = options.autoDrones !== false;
      this.context = null;
      this.graph = null;
      this.tracks = new Map();
      this.buffers = new Map();
      this.activeDrone = null;
      this.population = 0;
      this.started = false;
      this.muted = false;
      this.releasePercussionIndex = 0;
      this.droneSequenceIndex = 0;
      this.droneTimer = 0;
      this.settings = {
        low: 0,
        high: 0,
        delay: .32,
        feedback: .32,
        echo: .18,
        reverb: .28,
        master: .7
      };
    }

    async start() {
      if (!this.context) {
        this.context = new AudioContext();
        this.graph = this.createGraph();
        this.createBedTracks();
      }
      await this.context.resume();
      if (!this.started) {
        this.started = true;
        await this.setPopulation(this.population, { immediate: true });
      }
      return this;
    }

    stop() {
      if (!this.context) return;
      window.clearTimeout(this.droneTimer);
      this.droneTimer = 0;
      for (const track of this.tracks.values()) {
        track.fadeToken++;
        track.gain.gain.cancelScheduledValues(this.context.currentTime);
        track.gain.gain.value = 0;
        track.audio.pause();
        track.audio.currentTime = 0;
      }
      this.activeDrone = null;
      this.started = false;
    }

    setAutoDrones(enabled) {
      this.autoDrones = Boolean(enabled);
      window.clearTimeout(this.droneTimer);
      this.droneTimer = 0;
      if (this.autoDrones && this.activeDrone && this.started) {
        this.scheduleDroneTransition(this.activeDrone);
      }
    }

    setCrossfadeSeconds(seconds) {
      this.crossfadeSeconds = this.clamp(Number(seconds) || 12, 4, 24);
    }

    setEffects(values) {
      Object.assign(this.settings, values);
      if (!this.graph) return;
      const now = this.context.currentTime;
      const set = (param, value) => param.setTargetAtTime(value, now, .03);
      set(this.graph.low.gain, this.settings.low);
      set(this.graph.high.gain, this.settings.high);
      set(this.graph.delay.delayTime, this.settings.delay);
      set(this.graph.feedback.gain, this.settings.feedback);
      set(this.graph.echoWet.gain, this.settings.echo);
      set(this.graph.reverbWet.gain, this.settings.reverb);
      set(this.graph.master.gain, this.settings.master);
    }

    setMuted(muted) {
      this.muted = Boolean(muted);
      if (!this.graph) return;
      this.graph.master.gain.setTargetAtTime(
        this.muted ? 0 : this.settings.master,
        this.context.currentTime,
        .04
      );
    }

    getCaptureStream() {
      return this.graph?.captureDestination?.stream || null;
    }

    async setPopulation(count, options = {}) {
      this.population = Math.max(0, Math.round(count));
      if (!this.context || !this.started) return;

      const droneIndex = Math.min(
        this.sounds.drones.length - 1,
        Math.floor(this.population / 3)
      );
      await this.selectDrone(this.sounds.drones[droneIndex], options);

      const fullness = Math.min(1, this.population / 14);
      const waveOne = this.tracks.get(this.sounds.waves[0]);
      const waveTwo = this.tracks.get(this.sounds.waves[1]);
      await this.setLayer(waveOne, fullness > .12 ? .04 + fullness * .12 : 0, 5);
      await this.setLayer(waveTwo, fullness > .55 ? (fullness - .5) * .16 : 0, 7);

      this.setEffects({
        low: 1 + fullness * 3,
        high: -4 + fullness * 5,
        reverb: .24 + fullness * .18,
        echo: .12 + fullness * .1
      });
    }

    async selectDrone(filename, options = {}) {
      await this.start();
      const selected = this.tracks.get(filename);
      if (!selected || selected === this.activeDrone) return;
      const seconds = options.immediate ? .8 : this.crossfadeSeconds;

      for (const droneName of this.sounds.drones) {
        const track = this.tracks.get(droneName);
        if (!track || track === selected || track.audio.paused) continue;
        this.rampTrack(track, 0, seconds);
        this.stopAfterFade(track, seconds);
      }

      selected.fadeToken++;
      selected.audio.loop = true;
      selected.audio.currentTime = 0;
      selected.gain.gain.cancelScheduledValues(this.context.currentTime);
      selected.gain.gain.setValueAtTime(0, this.context.currentTime);
      await selected.audio.play();
      this.rampTrack(selected, selected.level, seconds);
      this.activeDrone = selected;
      this.droneSequenceIndex = this.sounds.drones.indexOf(filename);
      this.scheduleDroneTransition(selected);
    }

    scheduleDroneTransition(track) {
      window.clearTimeout(this.droneTimer);
      this.droneTimer = 0;
      if (!this.autoDrones || !this.started || track !== this.activeDrone) return;

      const duration = Number.isFinite(track.audio.duration) && track.audio.duration > 1
        ? track.audio.duration
        : 12;
      const loops = 3 + (this.droneSequenceIndex % 3);
      const waitSeconds = Math.max(30, duration * loops);
      this.droneTimer = window.setTimeout(() => {
        if (!this.started || track !== this.activeDrone) return;
        const nextIndex = (this.droneSequenceIndex + 1) % this.sounds.drones.length;
        this.selectDrone(this.sounds.drones[nextIndex]);
      }, waitSeconds * 1000);
    }

    async release(event = {}) {
      await this.start();
      const random = this.seededRandom(event.seed);
      const energy = this.clamp(event.energy ?? .5, 0, 1);
      const pan = this.clamp(event.pan ?? Math.cos(event.direction || 0), -1, 1);
      const gestureWeight = event.gestureWeight !== undefined
        ? this.clamp(event.gestureWeight, 0, 1)
        : Math.max(
          this.clamp((event.distance ?? 0) / 600, 0, 1),
          this.clamp((event.duration ?? 0) / 2.5, 0, 1),
          energy * .5
        );
      const choice = random();
      const longChance = .1 + gestureWeight * .3;

      if (choice < longChance) {
        await this.impact({
          seed: event.seed,
          pan,
          gain: .055 + energy * .045,
          rate: .94 + random() * .1
        });
      } else if (choice < longChance + .42) {
        const filename = this.sounds.percussion[
          this.releasePercussionIndex % this.sounds.percussion.length
        ];
        this.releasePercussionIndex++;
        await this.playOneShot(filename, {
          gain: .07 + energy * .1,
          rate: .88 + random() * .24,
          pan,
          attack: .008
        });
      } else {
        const filename = this.pick(this.sounds.harps, random);
        await this.playOneShot(filename, {
          gain: .16 + energy * .18,
          rate: .9 + random() * .22 + energy * .08,
          pan,
          attack: .015
        });
      }
    }

    async attach(event = {}) {
      await this.start();
      const random = this.seededRandom(event.seed);
      const energy = this.clamp(event.energy ?? .5, 0, 1);
      await this.playOneShot(this.sounds.transition, {
        gain: .12 + energy * .12,
        rate: .94 + random() * .1,
        pan: this.clamp(event.pan ?? 0, -1, 1),
        attack: .08
      });
      window.setTimeout(() => {
        const useImpact = random() < .72;
        const filename = this.pick(useImpact ? this.sounds.impacts : this.sounds.textures, random);
        this.playOneShot(filename, {
          gain: useImpact ? .065 + energy * .055 : .08 + energy * .07,
          rate: useImpact ? .92 + random() * .12 : .88 + random() * .12,
          pan: this.clamp(event.pan ?? 0, -1, 1),
          attack: .12
        });
      }, 1300);
    }

    async absorb(event = {}) {
      await this.start();
      const random = this.seededRandom(event.seed);
      await this.impact({
        seed: event.seed,
        pan: event.pan,
        gain: .1 + random() * .04
      });
      await this.playOneShot(this.sounds.transition, {
        gain: .16,
        rate: .78,
        pan: this.clamp(event.pan ?? 0, -1, 1),
        attack: .12
      });
      this.pulseFilter(-8, 2.8);
    }

    async percussion(event = {}) {
      await this.start();
      const random = this.seededRandom(event.seed);
      const energy = this.clamp(event.energy ?? .5, 0, 1);
      return this.playOneShot(this.pick(this.sounds.percussion, random), {
        gain: .07 + energy * .1,
        rate: .88 + random() * .24,
        pan: this.clamp(event.pan ?? 0, -1, 1),
        attack: .008
      });
    }

    async texture(event = {}) {
      await this.start();
      const random = this.seededRandom(event.seed);
      return this.playOneShot(this.pick(this.sounds.textures, random), {
        gain: event.gain ?? .1,
        rate: .86 + random() * .2,
        pan: this.clamp(event.pan ?? 0, -1, 1),
        attack: .08
      });
    }

    async impact(event = {}) {
      await this.start();
      const random = this.seededRandom(event.seed);
      return this.playOneShot(this.pick(this.sounds.impacts, random), {
        gain: event.gain ?? .11,
        rate: event.rate ?? .9 + random() * .12,
        pan: this.clamp(event.pan ?? 0, -1, 1),
        attack: .025
      });
    }

    async ripple(event = {}) {
      await this.start();
      const random = this.seededRandom(event.seed);
      const now = this.context.currentTime;
      const oscillator = new OscillatorNode(this.context, {
        type: "sine",
        frequency: 82 + random() * 28
      });
      const gain = this.context.createGain();
      const filter = new BiquadFilterNode(this.context, {
        type: "lowpass",
        frequency: 500,
        Q: 2
      });
      const pan = new StereoPannerNode(this.context, {
        pan: this.clamp(event.pan ?? 0, -1, 1)
      });

      oscillator.frequency.exponentialRampToValueAtTime(360 + random() * 180, now + 2.8);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 2.6);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.11, now + .18);
      gain.gain.exponentialRampToValueAtTime(.0001, now + 3.2);
      oscillator.connect(filter).connect(gain).connect(pan).connect(this.graph.input);
      oscillator.start(now);
      oscillator.stop(now + 3.25);
    }

    async playOneShot(filename, options = {}) {
      const buffer = await this.loadBuffer(filename);
      if (!buffer || !this.context) return;
      const now = this.context.currentTime;
      const source = this.context.createBufferSource();
      const gain = this.context.createGain();
      const pan = new StereoPannerNode(this.context, {
        pan: this.clamp(options.pan ?? 0, -1, 1)
      });
      const level = options.gain ?? .2;
      const attack = options.attack ?? .01;

      source.buffer = buffer;
      source.playbackRate.value = options.rate ?? 1;
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(.0001, level), now + attack);
      source.connect(gain).connect(pan).connect(this.graph.input);
      source.start(now);
      return source;
    }

    async loadBuffer(filename) {
      if (this.buffers.has(filename)) return this.buffers.get(filename);
      const promise = fetch(this.assetUrl(filename))
        .then(response => {
          if (!response.ok) throw new Error(`Could not load ${filename}`);
          return response.arrayBuffer();
        })
        .then(data => this.context.decodeAudioData(data));
      this.buffers.set(filename, promise);
      return promise;
    }

    createBedTracks() {
      for (const filename of [...this.sounds.drones, ...this.sounds.waves]) {
        const audio = new Audio(this.assetUrl(filename));
        const source = this.context.createMediaElementSource(audio);
        const gain = this.context.createGain();
        audio.preload = "auto";
        audio.loop = true;
        gain.gain.value = 0;
        const isDrone = this.sounds.drones.includes(filename);
        source.connect(gain).connect(isDrone ? this.graph.droneInput : this.graph.input);
        this.tracks.set(filename, {
          filename,
          audio,
          source,
          gain,
          level: isDrone ? .36 : .12,
          fadeToken: 0
        });
      }
    }

    createGraph() {
      const input = this.context.createGain();
      const low = new BiquadFilterNode(this.context, { type: "lowshelf", frequency: 260 });
      const high = new BiquadFilterNode(this.context, { type: "highshelf", frequency: 3200 });
      const dry = this.context.createGain();
      const delay = new DelayNode(this.context, { maxDelayTime: 1.2 });
      const feedback = this.context.createGain();
      const echoWet = this.context.createGain();
      const convolver = this.context.createConvolver();
      const reverbWet = this.context.createGain();
      const compressor = new DynamicsCompressorNode(this.context, {
        threshold: -16, knee: 18, ratio: 4, attack: .01, release: .3
      });
      const master = this.context.createGain();
      const captureDestination = this.context.createMediaStreamDestination();
      const droneInput = this.context.createGain();
      const droneDry = this.context.createGain();
      const droneDelay = new DelayNode(this.context, { maxDelayTime: 2, delayTime: .74 });
      const droneFeedback = this.context.createGain();
      const droneEchoWet = this.context.createGain();
      const droneConvolver = this.context.createConvolver();
      const droneReverbWet = this.context.createGain();

      convolver.buffer = this.createImpulse();
      droneConvolver.buffer = this.createImpulse(7.5, 2.35);
      dry.gain.value = .82;
      droneDry.gain.value = .72;
      droneFeedback.gain.value = .26;
      droneEchoWet.gain.value = .13;
      droneReverbWet.gain.value = .34;
      input.connect(low).connect(high);
      high.connect(dry).connect(compressor);
      high.connect(delay);
      delay.connect(feedback).connect(delay);
      delay.connect(echoWet).connect(compressor);
      high.connect(convolver).connect(reverbWet).connect(compressor);
      compressor.connect(master);
      master.connect(this.context.destination);
      master.connect(captureDestination);
      droneInput.connect(droneDry).connect(input);
      droneInput.connect(droneDelay);
      droneDelay.connect(droneFeedback).connect(droneDelay);
      droneDelay.connect(droneEchoWet).connect(input);
      droneInput.connect(droneConvolver).connect(droneReverbWet).connect(input);

      this.graph = {
        input, low, high, delay, feedback, echoWet, reverbWet, master,
        droneInput, droneDry, droneDelay, droneFeedback, droneEchoWet,
        droneConvolver, droneReverbWet, captureDestination
      };
      this.setEffects(this.settings);
      this.setMuted(this.muted);
      return this.graph;
    }

    createImpulse(seconds = 3.4, decay = 3.2) {
      const length = Math.floor(this.context.sampleRate * seconds);
      const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
      for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
      }
      return impulse;
    }

    async setLayer(track, level, seconds) {
      if (!track) return;
      if (level > 0) {
        track.fadeToken++;
        if (track.audio.paused) {
          track.gain.gain.value = 0;
          await track.audio.play();
        }
      }
      this.rampTrack(track, level, seconds);
      if (level === 0 && !track.audio.paused) this.stopAfterFade(track, seconds);
    }

    rampTrack(track, target, seconds) {
      const now = this.context.currentTime;
      const gain = track.gain.gain;
      const start = gain.value;
      const curve = new Float32Array(64);
      for (let i = 0; i < curve.length; i++) {
        const progress = i / (curve.length - 1);
        const eased = .5 - Math.cos(Math.PI * progress) * .5;
        curve[i] = start + (target - start) * eased;
      }
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(start, now);
      gain.setValueCurveAtTime(curve, now, seconds);
    }

    stopAfterFade(track, seconds) {
      const token = ++track.fadeToken;
      window.setTimeout(() => {
        if (track.fadeToken !== token) return;
        track.audio.pause();
        track.audio.currentTime = 0;
      }, seconds * 1000 + 50);
    }

    pulseFilter(amount, seconds) {
      const now = this.context.currentTime;
      const high = this.graph.high.gain;
      high.cancelScheduledValues(now);
      high.setValueAtTime(high.value, now);
      high.linearRampToValueAtTime(amount, now + .2);
      high.linearRampToValueAtTime(this.settings.high, now + seconds);
    }

    seededRandom(seed = Date.now()) {
      let value = (Number(seed) || 1) >>> 0;
      return () => {
        value += 0x6d2b79f5;
        let result = value;
        result = Math.imul(result ^ result >>> 15, result | 1);
        result ^= result + Math.imul(result ^ result >>> 7, result | 61);
        return ((result ^ result >>> 14) >>> 0) / 4294967296;
      };
    }

    pick(items, random) {
      return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
    }

    assetUrl(filename) {
      return this.assets?.[filename] || this.baseUrl + filename;
    }

    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
  }

  window.AudioSystem = AudioSystem;
})();
