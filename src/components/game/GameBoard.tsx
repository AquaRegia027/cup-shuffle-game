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
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.isCorrect, config.points, onResult, audio]);

  // Calculate cup size based on number of cups and viewport
  const cupSize = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
    const maxBoardWidth = Math.min(vw - 40, 560);
    const sizeFromCount = Math.floor(maxBoardWidth / (config.numCups * 1.15));
    return Math.max(44, Math.min(80, sizeFromCount));
  }, [config.numCups]);

  const gap = cupSize + 12;
  const boardWidth = gap * config.numCups;
  const boardHeight = cupSize * 2.2;

  const isRevealed = state.phase === 'reveal';
  const isResult = state.phase === 'result';
  const isGuessing = state.phase === 'guessing';

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <LevelIndicator level={level} phase={state.phase} />

      {/* Phase indicator text */}
      <div className="text-center h-8">
        {state.phase === 'reveal' && (
          <p className="text-accent-gold font-semibold text-lg animate-pulse">
            Watch the ball!
          </p>
        )}
        {state.phase === 'covering' && (
          <p className="text-cream-300 text-lg">Covering...</p>
        )}
        {state.phase === 'shuffling' && (
          <p className="text-cream-300 text-lg">
            Shuffling... <span className="text-sea-300">{state.currentStep}/{state.shuffleSteps.length}</span>
          </p>
        )}
        {state.phase === 'guessing' && (
          <p className="text-sea-300 font-semibold text-lg animate-pulse">
            Which cup has the ball? Tap it!
          </p>
        )}
        {state.phase === 'result' && state.isCorrect && (
          <p className="text-accent-correct font-bold text-xl animate-bounce-in">
            Correct! +{config.points} pts
          </p>
        )}
        {state.phase === 'result' && state.isCorrect === false && (
          <p className="text-accent-wrong font-bold text-xl animate-shake">
            Wrong!
          </p>
        )}
      </div>

      {/* Cup playing area */}
      <div className="relative flex items-center justify-center" style={{ width: '100%' }}>
        {/* Table surface */}
        <div
          className="absolute bottom-0 rounded-xl"
          style={{
            width: boardWidth + 40,
            height: 32,
            background: 'linear-gradient(180deg, rgba(30,80,60,0.4) 0%, rgba(20,60,45,0.6) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        />

        {/* Cups container */}
        <div
          className="relative"
          style={{
            width: boardWidth,
            height: boardHeight,
          }}
        >
          {state.cups.map((cup) => (
            <Cup
              key={cup.id}
              id={cup.id}
              x={cup.x}
              hasBall={cup.hasBall}
              isRevealed={isRevealed}
              isSelected={state.selectedCupId === cup.id}
              isResult={isResult}
              onClick={selectCup}
              disabled={!isGuessing}
              shuffleDuration={config.shuffleDuration}
              cupSize={cupSize}
            />
          ))}
        </div>
      </div>

      {/* Cups count indicator */}
      <p className="text-cream-400 text-xs opacity-60">
        {config.numCups} cups &middot; {config.numShuffles} shuffles
      </p>
    </div>
  );
}
