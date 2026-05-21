import { useEffect, useRef, useState } from "react";

// Pentatonic scale — emotionally safe, always sounds good
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.26]; // C4 pentatonic+

const CHORDS: number[][] = [
  [261.63, 329.63, 392.0],    // C major
  [220.0,  261.63, 329.63],   // A minor
  [174.61, 220.0,  261.63],   // F major
  [196.0,  246.94, 293.66],   // G major
];

function createReverb(ctx: AudioContext) {
  const convolver = ctx.createConvolver();
  const rate = ctx.sampleRate;
  const length = rate * 2;
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

function playChord(
  ctx: AudioContext,
  reverb: ConvolverNode,
  master: GainNode,
  freqs: number[],
  start: number,
  dur: number
) {
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    // Sub-octave
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.value = freq / 2;
    g2.gain.value = 0.04;

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.07, start + 0.4);
    gain.gain.setValueAtTime(0.07, start + dur - 0.8);
    gain.gain.linearRampToValueAtTime(0, start + dur);

    osc.connect(gain);
    gain.connect(reverb);
    gain.connect(master);

    osc2.connect(g2);
    g2.connect(master);

    osc.start(start);
    osc.stop(start + dur);
    osc2.start(start);
    osc2.stop(start + dur);
  });
}

function playMelodyNote(
  ctx: AudioContext,
  reverb: ConvolverNode,
  master: GainNode,
  freq: number,
  start: number,
  dur: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq * 2; // octave up for melody
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(0.06, start + 0.1);
  gain.gain.linearRampToValueAtTime(0, start + dur);
  osc.connect(gain);
  gain.connect(reverb);
  gain.connect(master);
  osc.start(start);
  osc.stop(start + dur + 0.1);
}

function scheduleLoop(
  ctx: AudioContext,
  reverb: ConvolverNode,
  master: GainNode,
  startAt: number
): number {
  const chordDur = 4;
  const loopDur = chordDur * CHORDS.length;

  // Chords
  CHORDS.forEach((chord, i) => {
    playChord(ctx, reverb, master, chord, startAt + i * chordDur, chordDur + 0.5);
  });

  // Simple wandering melody
  const melodyPattern = [0, 2, 4, 2, 5, 4, 2, 0, 1, 3, 5, 4, 3, 1, 2, 0];
  melodyPattern.forEach((idx, mi) => {
    const noteTime = startAt + (mi / melodyPattern.length) * loopDur;
    const noteDur = (loopDur / melodyPattern.length) * 0.8;
    playMelodyNote(ctx, reverb, master, SCALE[idx], noteTime, noteDur);
  });

  return loopDur;
}

export default function AmbientAudio() {
  const [playing, setPlaying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLoop = (ctx: AudioContext, reverb: ConvolverNode, master: GainNode) => {
    const now = ctx.currentTime + 0.05;
    const dur = scheduleLoop(ctx, reverb, master, now);
    loopTimerRef.current = setTimeout(() => startLoop(ctx, reverb, master), dur * 1000 - 200);
  };

  const toggle = () => {
    if (!playing) {
      if (!ctxRef.current) {
        const ctx = new AudioContext();
        const reverb = createReverb(ctx);
        const master = ctx.createGain();
        const reverbGain = ctx.createGain();
        reverbGain.gain.value = 0.35;
        reverb.connect(reverbGain);
        reverbGain.connect(ctx.destination);
        master.gain.value = 0.7;
        master.connect(ctx.destination);
        ctxRef.current = ctx;
        masterRef.current = master;
        reverbRef.current = reverb;
      }
      const ctx = ctxRef.current!;
      if (ctx.state === "suspended") ctx.resume();
      startLoop(ctx, reverbRef.current!, masterRef.current!);
      setPlaying(true);
      setUnlocked(true);
    } else {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      masterRef.current?.gain.setTargetAtTime(0, ctxRef.current!.currentTime, 0.5);
      setTimeout(() => {
        masterRef.current?.gain.setValueAtTime(0.7, ctxRef.current!.currentTime);
      }, 3000);
      setPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      ctxRef.current?.close();
    };
  }, []);

  return (
    <div className={`wf-audio-btn ${playing ? "playing" : ""}`} onClick={toggle} title={playing ? "Mute music" : "Play ambient music"}>
      <div className="wf-audio-icon">
        {playing ? (
          <>
            <span className="wf-bar wf-bar--1" />
            <span className="wf-bar wf-bar--2" />
            <span className="wf-bar wf-bar--3" />
            <span className="wf-bar wf-bar--4" />
          </>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8 2L4 5H2C1.45 5 1 5.45 1 6v2c0 .55.45 1 1 1h2l4 3V2z" fill="currentColor"/>
            <path d="M10.5 4.5c.8.8 1.5 2 1.5 2.5s-.7 1.7-1.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
          </svg>
        )}
      </div>
      {!unlocked && <span className="wf-audio-hint">♪ music</span>}
    </div>
  );
}
