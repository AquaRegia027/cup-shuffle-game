'use client';
import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { getFromStorage, setToStorage } from '@/lib/storage';

interface AudioPrefs {
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export interface AudioContextValue {
  playBgMusic: () => void;
  stopBgMusic: () => void;
  playSfx: (sound: 'click' | 'shuffle' | 'correct' | 'wrong') => void;
  isMusicEnabled: boolean;
  isSfxEnabled: boolean;
  toggleMusic: () => void;
  toggleSfx: () => void;
}

export const AudioCtx = createContext<AudioContextValue | null>(null);

// Synthesize sounds using Web Audio API — no external files needed
function playClick(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

function playShuffle(ctx: AudioContext) {
  // Whoosh sound using noise + filter
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
  filter.Q.value = 1;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

function playCorrect(ctx: AudioContext) {
  // Two-note ascending chime
  const notes = [523.25, 783.99]; // C5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const start = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, start + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.4);
  });
}

function playWrong(ctx: AudioContext) {
  // Low buzz
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 150;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.35);
}

// Simple background melody loop using oscillators
function createBgMusicLoop(ctx: AudioContext, masterGain: GainNode) {
  // Pentatonic melody notes (Hz)
  const melody = [
    329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63, 261.63,
    293.66, 349.23, 392.00, 440.00, 392.00, 349.23, 293.66, 261.63,
  ];
  const noteDuration = 0.4;
  const loopDuration = melody.length * noteDuration;
  let startTime = ctx.currentTime + 0.1;
  const oscillators: OscillatorNode[] = [];

  function scheduleLoop() {
    for (let i = 0; i < melody.length; i++) {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = melody[i];
      const t = startTime + i * noteDuration;
      noteGain.gain.setValueAtTime(0, t);
      noteGain.gain.linearRampToValueAtTime(0.08, t + 0.03);
      noteGain.gain.setValueAtTime(0.08, t + noteDuration * 0.6);
      noteGain.gain.linearRampToValueAtTime(0, t + noteDuration * 0.95);
      osc.connect(noteGain).connect(masterGain);
      osc.start(t);
      osc.stop(t + noteDuration);
      oscillators.push(osc);
    }
    startTime += loopDuration;
  }

  // Schedule first 2 loops, then keep scheduling
  scheduleLoop();
  scheduleLoop();

  const intervalId = setInterval(() => {
    if (ctx.state === 'closed') {
      clearInterval(intervalId);
      return;
    }
    scheduleLoop();
  }, (loopDuration * 1000) * 0.8);

  return () => {
    clearInterval(intervalId);
    oscillators.forEach((o) => { try { o.stop(); } catch {} });
  };
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AudioPrefs>({ musicEnabled: true, sfxEnabled: true });
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgMusicStopRef = useRef<(() => void) | null>(null);
  const bgMusicGainRef = useRef<GainNode | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const saved = getFromStorage<AudioPrefs>(STORAGE_KEYS.AUDIO_PREFS, { musicEnabled: true, sfxEnabled: true });
    setPrefs(saved);
  }, []);

  useEffect(() => {
    setToStorage(STORAGE_KEYS.AUDIO_PREFS, prefs);
  }, [prefs]);

  const ensureCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Resume on first user interaction
  useEffect(() => {
    const handler = () => {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  const playBgMusic = useCallback(() => {
    const ctx = ensureCtx();
    if (bgMusicStopRef.current) return; // already playing
    const gain = ctx.createGain();
    gain.gain.value = 0.5;
    gain.connect(ctx.destination);
    bgMusicGainRef.current = gain;
    bgMusicStopRef.current = createBgMusicLoop(ctx, gain);
  }, [ensureCtx]);

  const stopBgMusic = useCallback(() => {
    if (bgMusicStopRef.current) {
      bgMusicStopRef.current();
      bgMusicStopRef.current = null;
    }
    if (bgMusicGainRef.current) {
      bgMusicGainRef.current.disconnect();
      bgMusicGainRef.current = null;
    }
  }, []);

  const playSfx = useCallback(
    (sound: 'click' | 'shuffle' | 'correct' | 'wrong') => {
      if (!prefs.sfxEnabled) return;
      const ctx = ensureCtx();
      switch (sound) {
        case 'click': playClick(ctx); break;
        case 'shuffle': playShuffle(ctx); break;
        case 'correct': playCorrect(ctx); break;
        case 'wrong': playWrong(ctx); break;
      }
    },
    [prefs.sfxEnabled, ensureCtx],
  );

  const toggleMusic = useCallback(() => {
    setPrefs((p) => {
      const next = { ...p, musicEnabled: !p.musicEnabled };
      if (!next.musicEnabled) {
        stopBgMusic();
      }
      return next;
    });
  }, [stopBgMusic]);

  const toggleSfx = useCallback(() => {
    setPrefs((p) => ({ ...p, sfxEnabled: !p.sfxEnabled }));
  }, []);

  return (
    <AudioCtx.Provider
      value={{
        playBgMusic,
        stopBgMusic,
        playSfx,
        isMusicEnabled: prefs.musicEnabled,
        isSfxEnabled: prefs.sfxEnabled,
        toggleMusic,
        toggleSfx,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
