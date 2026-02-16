import type { LevelConfig } from '@/types/game';

const POINTS_TABLE = [50, 55, 60, 65, 70, 75, 80, 85, 90, 100];

export function getLevelConfig(level: number): LevelConfig {
  const clampedLevel = Math.max(1, Math.min(100, level));
  const tier = Math.floor((clampedLevel - 1) / 10);
  const numCups = 3 + tier;

  const numShuffles = 3 + Math.floor(22 * (clampedLevel - 1) / 99);

  const t = (clampedLevel - 1) / 99;
  const shuffleDuration = 0.8 - 0.65 * Math.pow(t, 0.7);
  const pauseBetween = 0.3 - 0.25 * Math.pow(t, 0.7);
  const revealTime = 2.0 - 1.2 * t;

  return {
    level: clampedLevel,
    numCups,
    numShuffles,
    shuffleDuration: Math.round(shuffleDuration * 1000) / 1000,
    pauseBetween: Math.round(pauseBetween * 1000) / 1000,
    revealTime: Math.round(revealTime * 100) / 100,
    points: POINTS_TABLE[tier],
  };
}

export function getTierForLevel(level: number): number {
  return Math.floor((Math.max(1, Math.min(100, level)) - 1) / 10);
}
