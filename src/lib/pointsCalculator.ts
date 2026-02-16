const POINTS_BY_TIER: Record<number, number> = {
  0: 50,
  1: 55,
  2: 60,
  3: 65,
  4: 70,
  5: 75,
  6: 80,
  7: 85,
  8: 90,
  9: 100,
};

export function getPointsForLevel(level: number): number {
  const tier = Math.floor((Math.max(1, Math.min(100, level)) - 1) / 10);
  return POINTS_BY_TIER[tier] ?? 50;
}
