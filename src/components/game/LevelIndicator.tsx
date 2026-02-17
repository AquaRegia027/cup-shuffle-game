'use client';
import type { GamePhase } from '@/types/game';

interface LevelIndicatorProps {
  level: number;
  phase: GamePhase;
}

export function LevelIndicator({ level, phase }: LevelIndicatorProps) {
  const tierStart = Math.floor((level - 1) / 10) * 10 + 1;
  const tierEnd = tierStart + 9;
  const progressInTier = ((level - tierStart) / 9) * 100;

  const phaseLabel =
    phase === 'guessing' ? 'Your turn!' :
    phase === 'shuffling' ? 'Watch closely...' :
    phase === 'reveal' ? '' :
    '';

  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-cream-300 font-medium">Level {level}</span>
        <span className="text-cream-400 text-xs">{phaseLabel}</span>
      </div>
      <div className="h-2 bg-sea-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sea-500 to-sea-300 rounded-full transition-all duration-500"
          style={{ width: `${progressInTier}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-cream-400 mt-1">
        <span>Tier {Math.floor((level - 1) / 10) + 1}</span>
        <span>Levels {tierStart}-{tierEnd}</span>
      </div>
    </div>
  );
}
