'use client';
import type { ReactNode } from 'react';
import { GameProvider } from './GameProvider';
import { AudioProvider } from './AudioProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GameProvider>
      <AudioProvider>{children}</AudioProvider>
    </GameProvider>
  );
}
