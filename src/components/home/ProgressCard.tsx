'use client';
import { useGameState } from '@/hooks/useGameState';

export function ProgressCard() {
  const { game } = useGameState();
  const progress = (game.currentLevel / 100) * 100;
  const tier = Math.floor((game.currentLevel - 1) / 10) + 1;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-cream-200 font-bold">Progress</h3>
        <span className="text-sea-300 text-sm">Tier {tier}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-cream-100">Level {game.currentLevel}</span>
        <span className="text-cream-400 text-sm">/ 100</span>
      </div>

      <div className="h-3 bg-sea-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sea-500 to-accent-gold rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-cream-400 text-xs mt-2">
        Highest reached: Level {game.highestLevelReached}
      </p>
    </div>
  );
}
