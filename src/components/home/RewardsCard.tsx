'use client';
import { useGameState } from '@/hooks/useGameState';

export function RewardsCard() {
  const { game } = useGameState();

  const gamePoints = game.totalPoints - game.spinPoints;

  return (
    <div className="card">
      <h3 className="text-cream-200 font-bold mb-3">Rewards</h3>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-accent-gold">{game.totalPoints}</span>
        <span className="text-cream-400 text-sm">total points</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-cream-300">
          <span>Game points</span>
          <span className="font-semibold">{gamePoints}</span>
        </div>
        <div className="flex justify-between text-cream-300">
          <span>Spin bonus</span>
          <span className="font-semibold">{game.spinPoints}</span>
        </div>
        <div className="flex justify-between text-cream-300">
          <span>Games played</span>
          <span className="font-semibold">{game.levelHistory.length}</span>
        </div>
        <div className="flex justify-between text-cream-300">
          <span>Win rate</span>
          <span className="font-semibold">
            {game.levelHistory.length > 0
              ? Math.round(
                  (game.levelHistory.filter((r) => r.correct).length /
                    game.levelHistory.length) *
                    100,
                )
              : 0}
            %
          </span>
        </div>
      </div>
    </div>
  );
}
