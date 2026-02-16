'use client';
import { useContext } from 'react';
import { GameContext, type GameContextValue } from '@/components/providers/GameProvider';

export function useGameState(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameState must be used within GameProvider');
  return ctx;
}
