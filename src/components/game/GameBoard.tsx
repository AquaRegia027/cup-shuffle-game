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

  useEffect(() => {
    startRound();
  }, [startRound]);

  // Play shuffle sound when a swap begins
  useEffect(() => {
    if (state.activeSwap) {
      audio.playSfx('shuffle');
    }
  }, [state.activeSwap, audio]);

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
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.isCorrect, config.points, onResult, audio]);

  // Cup sizing
  const cupSize = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
    const maxBoard = Math.min(vw - 48, 520);
    const size = Math.floor(maxBoard / (config.numCups * 1.3));
    return Math.max(48, Math.min(80, size));
  }, [config.numCups]);

  const slotWidth = cupSize * 1.3;
  const boardWidth = slotWidth * config.numCups;
  const boardHeight = cupSize * 2.5;

  const isRevealed = state.phase === 'reveal';
  const isResult = state.phase === 'result';
  const isGuessing = state.phase === 'guessing';

  // For each cup, determine swap animation props
  const getCupSwapProps = (cupPosition: number) => {
    if (!state.activeSwap) {
      return { swapTarget: null, swapDirection: null as 'over' | 'under' | null };
    }
    const { posA, posB } = state.activeSwap;
    if (cupPosition === posA) {
      return { swapTarget: posB, swapDirection: 'over' as const };
    }
    if (cupPosition === posB) {
      return { swapTarget: posA, swapDirection: 'under' as const };
    }
    return { swapTarget: null, swapDirection: null as 'over' | 'under' | null };
  };

  // Determine which cups should be lifted
  const shouldLift = (cup: typeof state.cups[0]) => {
    if (isRevealed) return true; // Lift all cups during reveal to show ball
    if (isResult && state.selectedCupId === cup.id) return true; // Lift selected cup
    if (isResult && cup.hasBall) return true; // Also reveal where ball actually was
    return false;
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <LevelIndicator level={level} phase={state.phase} />

      {/* Phase indicator */}
      <div className="text-center h-8 flex items-center justify-center">
        {state.phase === 'reveal' && (
          <p className="text-amber-400 font-semibold text-lg animate-pulse">
            Watch the ball!
          </p>
        )}
        {state.phase === 'covering' && (
          <p className="text-slate-400 text-lg">Covering...</p>
        )}
        {state.phase === 'shuffling' && (
          <p className="text-slate-300 text-lg">
            Shuffling...
          </p>
        )}
        {state.phase === 'guessing' && (
          <p className="text-blue-300 font-semibold text-lg animate-pulse">
            Pick a cup!
          </p>
        )}
        {state.phase === 'result' && state.isCorrect && (
          <p className="text-green-400 font-bold text-xl">
            Correct! +{config.points} pts
          </p>
        )}
        {state.phase === 'result' && state.isCorrect === false && (
          <p className="text-red-400 font-bold text-xl">
            Wrong!
          </p>
        )}
      </div>

      {/* Game area */}
      <div className="flex items-end justify-center" style={{ width: '100%' }}>
        <div className="relative" style={{ width: boardWidth, height: boardHeight }}>
          {/* Table surface */}
          <div
            className="absolute bottom-0 left-1/2 rounded-lg"
            style={{
              width: boardWidth + 32,
              height: 8,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          />

          {/* Cups */}
          {state.cups.map((cup) => {
            const { swapTarget, swapDirection } = getCupSwapProps(cup.position);
            return (
              <Cup
                key={cup.id}
                id={cup.id}
                position={cup.position}
                hasBall={cup.hasBall}
                lifted={shouldLift(cup)}
                isSelected={state.selectedCupId === cup.id}
                isResult={isResult}
                onClick={selectCup}
                disabled={!isGuessing}
                cupSize={cupSize}
                slotWidth={slotWidth}
                swapTarget={swapTarget}
                swapDuration={config.shuffleDuration}
                swapDirection={swapDirection}
              />
            );
          })}
        </div>
      </div>

      <p className="text-slate-500 text-xs mt-2">
        {config.numCups} cups &middot; {config.numShuffles} shuffles
      </p>
    </div>
  );
}
