'use client';
import { useMemo } from 'react';
import { getLevelConfig } from '@/lib/levelConfig';
import type { LevelConfig } from '@/types/game';

export function useLevelConfig(level: number): LevelConfig {
  return useMemo(() => getLevelConfig(level), [level]);
}
