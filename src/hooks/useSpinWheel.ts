'use client';
import { useCallback, useMemo } from 'react';
import { useGameState } from './useGameState';
import { getSpinResult } from '@/lib/spinWheelRewards';
import type { SpinSegment } from '@/types/game';

export function useSpinWheel() {
  const { game, claimSpin } = useGameState();

  const canSpin = useMemo(() => {
    if (game.dailySpinUsed) {
      const today = new Date().toISOString().split('T')[0];
      return game.lastSpinDate !== today;
    }
    return true;
  }, [game.dailySpinUsed, game.lastSpinDate]);

  const spin = useCallback((): SpinSegment => {
    const result = getSpinResult();
    claimSpin(result.points);
    return result;
  }, [claimSpin]);

  return { canSpin, spin };
}
