'use client';
import { useContext } from 'react';
import { AudioCtx, type AudioContextValue } from '@/components/providers/AudioProvider';

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
