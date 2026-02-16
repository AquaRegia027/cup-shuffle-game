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

const SFX_FILES: Record<string, string> = {
  click: '/audio/click.wav',
  shuffle: '/audio/shuffle.wav',
  correct: '/audio/correct.wav',
  wrong: '/audio/wrong.wav',
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AudioPrefs>({ musicEnabled: true, sfxEnabled: true });
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const initializedRef = useRef(false);

  // Load prefs from localStorage
  useEffect(() => {
    const saved = getFromStorage<AudioPrefs>(STORAGE_KEYS.AUDIO_PREFS, { musicEnabled: true, sfxEnabled: true });
    setPrefs(saved);
  }, []);

  // Save prefs
  useEffect(() => {
    setToStorage(STORAGE_KEYS.AUDIO_PREFS, prefs);
  }, [prefs]);

  // Initialize audio context on first user interaction
  const initAudio = useCallback(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Background music
    const music = new Audio('/audio/bg-music.mp3');
    music.loop = true;
    music.volume = 0.3;
    musicRef.current = music;

    // Web Audio API for SFX
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;

    // Pre-load sound effects
    for (const [name, path] of Object.entries(SFX_FILES)) {
      fetch(path)
        .then((res) => res.arrayBuffer())
        .then((buf) => ctx.decodeAudioData(buf))
        .then((decoded) => buffersRef.current.set(name, decoded))
        .catch(() => {});
    }
  }, []);

  // Resume audio context on user gesture
  useEffect(() => {
    const handler = () => {
      initAudio();
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    document.addEventListener('click', handler, { once: false });
    document.addEventListener('touchstart', handler, { once: false });
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [initAudio]);

  const playBgMusic = useCallback(() => {
    initAudio();
    if (musicRef.current && prefs.musicEnabled) {
      musicRef.current.play().catch(() => {});
    }
  }, [prefs.musicEnabled, initAudio]);

  const stopBgMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  }, []);

  const playSfx = useCallback(
    (sound: 'click' | 'shuffle' | 'correct' | 'wrong') => {
      if (!prefs.sfxEnabled || !audioCtxRef.current) return;
      const buffer = buffersRef.current.get(sound);
      if (!buffer) return;
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.start();
    },
    [prefs.sfxEnabled],
  );

  const toggleMusic = useCallback(() => {
    setPrefs((p) => {
      const next = { ...p, musicEnabled: !p.musicEnabled };
      if (!next.musicEnabled) {
        musicRef.current?.pause();
      } else {
        musicRef.current?.play().catch(() => {});
      }
      return next;
    });
  }, []);

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
