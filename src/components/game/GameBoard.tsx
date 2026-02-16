'use client';
import { useEffect, useMemo } from 'react';
import { Cup } from './Cup';
import { LevelIndicator } from './LevelIndicator';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useAudio } from '@/hooks/useAudio';
import type { LevelConfig } from '@/types/game';

interface GameBoardProps {
  level: number;
  onResult: (correct: boolean, points: number) => void;
  config: LevelConfig;
}

export function GameBoard({ level, onResult, config }: GameBoardProps) {
  const { state, startRound, selectCup } = useGameEngine(level);
  const audio = useAudio();

  // Start round on mount
  useEffect(() => {
    startRound();
  }, [startRound]);

  // Play shuffle sound during shuffling
  useEffect(() => {
    if (state.phase === 'shuffling' && state.currentStep > 0) {
      audio.playSfx('shuffle');
    }
  }, [state.phase, state.currentStep, audio]);

  // Handle result
  useEffect(() => {
    if (state.phase === 'result' && state.isCorrect !== null) {
      if (state.isCorrect) {
        audio.playSfx('correct');
      } else {
        audio.playSfx('wrong');
      }
      const timer = setTimeout(() => {
        onResult(state.isCorrect!, state.isCorrect ? config.points : 0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.isCorrect, config.points, onResult, audio]);

  // Calculate cup size based on number of cups
  const cupSize = useMemo(() => {
    const maxWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 500) : 400;
    return Math.min(60, Math.floor(maxWidth / (config.numCups + 0.5)));
  }, [config.numCups]);

  const boardWidth = (cupSize + 8) * config.numCups;

  const isRevealed = state.phase === 'reveal' || state.phase === 'result';
  const isGuessing = state.phase === 'guessing';

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <LevelIndicator level={level} phase={state.phase} />

      {/* Phase indicator text */}
      <div className="text-center">
        {state.phase === 'reveal' && (
          <p className="text-accent-gold font-semibold animate-pulse">Watch the ball!</p>
        )}
        {state.phase === 'covering' && (
          <p className="text-cream-300">Covering cups...</p>
        )}
        {state.phase === 'shuffling' && (
          <p className="text-cream-300">Shuffling... ({state.currentStep}/{state.shuffleSteps.length})</p>
        )}
        {state.phase === 'guessing' && (
          <p className="text-sea-300 font-semibold">Tap a cup!</p>
        )}
        {state.phase === 'result' && state.isCorrect && (
          <p className="text-accent-correct font-bold text-lg animate-bounce-in">Correct! +{config.points} pts</p>
        )}
        {state.phase === 'result' && state.isCorrect === false && (
          <p className="text-accent-wrong font-bold text-lg animate-shake">Wrong!</p>
        )}
      </div>

      {/* Cup area */}
      <div
        className="relative"
        style={{ width: boardWidth, height: cupSize * 1.5 + 30 }}
      >
        {state.cups.map((cup) => (
          <Cup
            key={cup.id}
            id={cup.id}
            x={cup.x}
            hasBall={cup.hasBall}
            isRevealed={isRevealed}
            isSelected={state.selectedCupId === cup.id}
            onClick={selectCup}
            disabled={!isGuessing}
            shuffleDuration={config.shuffleDuration}
            cupSize={cupSize}
          />
        ))}
      </div>
    </div>
  );
}
